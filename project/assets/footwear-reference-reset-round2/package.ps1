$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$reviewRoot = [IO.Path]::GetFullPath('D:/Codex-chat/night-veil-brand/assets/footwear-reference-reset-round2')
$reviewArchive = [IO.Path]::GetFullPath('D:/Codex-chat/night-veil-brand/assets/MOVERNO-Reference-R01-R06-20260910.zip')
if (Test-Path -LiteralPath $reviewArchive) { throw 'Archive already exists. Preserve it and choose a new versioned path.' }
$selected = Get-Content -Raw -LiteralPath (Join-Path $reviewRoot 'selected-assets.json') | ConvertFrom-Json
$relFiles = @('index.html','overview-R01-R06.png','editable/overview-R01-R06.svg','README.md','REFERENCE-MAP.md','STATUS.md','QA.md','prompts.json','revision-prompts.json','selected-assets.json','user-reference-index.json','verification.json','research/OCAI-PUBLIC.md','render.mjs','verify.mjs','package.ps1','rejected-N-original-hashes.json')
foreach ($item in $selected) { $relFiles += @($item.master,('boards/'+$item.id+'-board.png'),('editable/'+$item.id+'-board.svg')) }
for($i=1; $i -le 11; $i++) { $relFiles += ('references/user-{0:D2}.png' -f $i) }
$relFiles = @($relFiles | Select-Object -Unique)
foreach ($rel in $relFiles) {
  $full = [IO.Path]::GetFullPath((Join-Path $reviewRoot $rel))
  if (-not $full.StartsWith($reviewRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Path escaped package root' }
  if (-not (Test-Path -LiteralPath $full -PathType Leaf)) { throw "Missing package file: $rel" }
}
$zip = [IO.Compression.ZipFile]::Open($reviewArchive,[IO.Compression.ZipArchiveMode]::Create)
try { foreach ($rel in $relFiles) { [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip,(Join-Path $reviewRoot $rel),$rel,[IO.Compression.CompressionLevel]::Optimal) | Out-Null } } finally { $zip.Dispose() }
$zipRead = [IO.Compression.ZipFile]::OpenRead($reviewArchive)
$checked = 0
try {
  foreach ($entry in $zipRead.Entries) {
    $stream = $entry.Open()
    $sha = [Security.Cryptography.SHA256]::Create()
    try { $entryHash = [BitConverter]::ToString($sha.ComputeHash($stream)).Replace('-','') } finally { $stream.Dispose(); $sha.Dispose() }
    $expected = (Get-FileHash -LiteralPath (Join-Path $reviewRoot $entry.FullName) -Algorithm SHA256).Hash
    if ($entryHash -ne $expected) { throw "Archive content mismatch: $($entry.FullName)" }
    $checked++
  }
  if ($checked -ne $relFiles.Count) { throw 'Archive count mismatch' }
} finally { $zipRead.Dispose() }
[PSCustomObject]@{ Archive=$reviewArchive; Files=$checked; ByteLength=(Get-Item -LiteralPath $reviewArchive).Length; SHA256=(Get-FileHash -LiteralPath $reviewArchive -Algorithm SHA256).Hash; ContentHashes='All matched' } | ConvertTo-Json
