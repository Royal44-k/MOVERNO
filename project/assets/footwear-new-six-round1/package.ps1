$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$sixRoot = [IO.Path]::GetFullPath('D:/Codex-chat/night-veil-brand/assets/footwear-new-six-round1')
$sixArchive = [IO.Path]::GetFullPath('D:/Codex-chat/night-veil-brand/assets/MOVERNO-New-Six-N01-N06-20260910.zip')
if (Test-Path -LiteralPath $sixArchive) { throw 'Archive already exists. Keep the prior package; choose a new versioned path.' }
$selected = Get-Content -Raw -LiteralPath (Join-Path $sixRoot 'selected-assets.json') | ConvertFrom-Json
$relFiles = @('index.html','overview-N01-N06.png','editable/overview-N01-N06.svg','README.md','DESIGN-RECORD.md','USER-FEEDBACK.md','QA.md','prompts.json','revision-prompts.json','selected-assets.json','generation-index.json','verification.json','research/LUXURY-WINTER.md','render.mjs','verify.mjs','package.ps1')
foreach ($item in $selected) { $relFiles += @($item.master,('boards/'+$item.id+'-board.png'),('editable/'+$item.id+'-board.svg')) }
$relFiles = @($relFiles | Select-Object -Unique)
foreach ($rel in $relFiles) {
  $full = [IO.Path]::GetFullPath((Join-Path $sixRoot $rel))
  if (-not $full.StartsWith($sixRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Path escaped package root' }
  if (-not (Test-Path -LiteralPath $full -PathType Leaf)) { throw "Missing package file: $rel" }
}
$zip = [IO.Compression.ZipFile]::Open($sixArchive,[IO.Compression.ZipArchiveMode]::Create)
try { foreach ($rel in $relFiles) { [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip,(Join-Path $sixRoot $rel),$rel,[IO.Compression.CompressionLevel]::Optimal) | Out-Null } } finally { $zip.Dispose() }
$zipRead = [IO.Compression.ZipFile]::OpenRead($sixArchive)
$checked = 0
try {
  foreach ($entry in $zipRead.Entries) {
    $stream = $entry.Open()
    $sha = [Security.Cryptography.SHA256]::Create()
    try { $entryHash = [BitConverter]::ToString($sha.ComputeHash($stream)).Replace('-','') } finally { $stream.Dispose(); $sha.Dispose() }
    $expected = (Get-FileHash -LiteralPath (Join-Path $sixRoot $entry.FullName) -Algorithm SHA256).Hash
    if ($entryHash -ne $expected) { throw "Archive content hash mismatch: $($entry.FullName)" }
    $checked++
  }
  if ($checked -ne $relFiles.Count) { throw 'Archive count mismatch' }
} finally { $zipRead.Dispose() }
[PSCustomObject]@{ Archive=$sixArchive; Files=$checked; ByteLength=(Get-Item -LiteralPath $sixArchive).Length; SHA256=(Get-FileHash -LiteralPath $sixArchive -Algorithm SHA256).Hash; ContentHashes='All matched' } | ConvertTo-Json
