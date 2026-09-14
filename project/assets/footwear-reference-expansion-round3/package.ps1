$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$batchRoot = [System.IO.Path]::GetFullPath($PSScriptRoot)
$archivePath = [System.IO.Path]::GetFullPath((Join-Path $batchRoot '..\MOVERNO-Expansion-R07-R12-20260911.zip'))
if (Test-Path -LiteralPath $archivePath) { throw "Archive already exists; choose a new version rather than overwrite: $archivePath" }
$topFiles = @('README.md','STATUS.md','QA.md','REFERENCE-MAP.md','prompts.json','revision-prompts.json','selected-assets.json','protected-R01-R06.json','verification.json','index.html','overview-R07-R12.png','overview-R01-R12.png','overview-R01-R12-preview.jpg','render.mjs','verify.mjs','make-preview.mjs','package.ps1')
$fileList = @($topFiles | ForEach-Object { Get-Item -LiteralPath (Join-Path $batchRoot $_) })
foreach ($folder in @('boards','masters','editable','references','research')) {
    $fileList += @(Get-ChildItem -LiteralPath (Join-Path $batchRoot $folder) -File -Recurse)
}
$archive = [System.IO.Compression.ZipFile]::Open($archivePath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($file in $fileList) {
        $resolvedFile = [System.IO.Path]::GetFullPath($file.FullName)
        if (-not $resolvedFile.StartsWith($batchRoot + '\', [System.StringComparison]::OrdinalIgnoreCase)) { throw "File outside batch: $resolvedFile" }
        $relativeName = $resolvedFile.Substring($batchRoot.Length + 1).Replace('\','/')
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $resolvedFile, $relativeName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
} finally { $archive.Dispose() }
$readArchive = [System.IO.Compression.ZipFile]::OpenRead($archivePath)
$sha = [System.Security.Cryptography.SHA256]::Create()
$badEntries = @()
try {
    foreach ($entry in $readArchive.Entries) {
        $entryStream = $entry.Open()
        try { $entryHash = [System.BitConverter]::ToString($sha.ComputeHash($entryStream)).Replace('-','') } finally { $entryStream.Dispose() }
        $localFile = Join-Path $batchRoot $entry.FullName.Replace('/','\')
        $sourceHash = (Get-FileHash -LiteralPath $localFile -Algorithm SHA256).Hash
        if ($entryHash -ne $sourceHash) { $badEntries += $entry.FullName }
    }
    if ($readArchive.Entries.Count -ne $fileList.Count) { throw 'Archive entry count mismatch' }
    if ($badEntries.Count -gt 0) { throw ('Archive hash mismatch: ' + ($badEntries -join ', ')) }
} finally { $readArchive.Dispose(); $sha.Dispose() }
[pscustomobject]@{ Archive=$archivePath; Files=$fileList.Count; Bytes=(Get-Item -LiteralPath $archivePath).Length; Hash=(Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash; EntryHashes='all matched' } | ConvertTo-Json
