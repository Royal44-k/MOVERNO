$ErrorActionPreference = 'Stop'
$taskRoot = [System.IO.Path]::GetFullPath($PSScriptRoot)
$expectedRoot = 'D:\Codex-chat\night-veil-brand\assets\footwear-direct-eight-round4'
if ($taskRoot -ne $expectedRoot) { throw 'Unexpected package source directory.' }
$archivePath = 'D:\Codex-chat\night-veil-brand\assets\MOVERNO-Direct-D01-D08-20260911.zip'
if (Test-Path -LiteralPath $archivePath) { throw 'Archive already exists; preserve it and select a new name.' }
$verification = Get-Content -Raw -LiteralPath (Join-Path $taskRoot 'verification.json') | ConvertFrom-Json
if ($verification.failed.Count -gt 0) { throw 'Delivery verification has failures.' }
Add-Type -AssemblyName System.IO.Compression.FileSystem
$sourceFiles = @(Get-ChildItem -LiteralPath $taskRoot -File -Recurse)
[System.IO.Compression.ZipFile]::CreateFromDirectory($taskRoot, $archivePath, [System.IO.Compression.CompressionLevel]::Optimal, $false)
$zipCheck = [System.IO.Compression.ZipFile]::OpenRead($archivePath)
try {
    if ($zipCheck.Entries.Count -ne $sourceFiles.Count) { throw 'Archive entry count mismatch.' }
    $selected = Get-Content -Raw -LiteralPath (Join-Path $taskRoot 'selected-assets.json') | ConvertFrom-Json
    $required = @('index.html', 'overview-D01-D08.png', 'REFERENCE-MAP.md', 'QA.md', 'verification.json')
    foreach ($style in $selected) {
        $required += $style.master
        $required += ('boards/' + $style.id + '-board.png')
    }
    foreach ($entryPath in $required) {
        $archiveEntry = $zipCheck.Entries | Where-Object { $_.FullName.Replace('\','/') -eq $entryPath }
        if (-not $archiveEntry -or $archiveEntry.Length -le 0) { throw ('Missing archive entry: ' + $entryPath) }
    }
    $report = [pscustomobject]@{ archive=$archivePath; entries=$zipCheck.Entries.Count; bytes=(Get-Item -LiteralPath $archivePath).Length; requiredEntries=$required.Count; sha256=(Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash }
    $report | ConvertTo-Json
} finally {
    $zipCheck.Dispose()
}
