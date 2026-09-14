$ErrorActionPreference='Stop'
$batchDir='D:\Codex-chat\night-veil-brand\assets\footwear-feminine-unisex-round1\batch02-redesign'
$archivePath='D:\Codex-chat\night-veil-brand\assets\footwear-feminine-unisex-round1\MOVERNO-Batch02-Feminine-Redesign-20260910.zip'
if(Test-Path -LiteralPath $archivePath){throw 'Archive already exists; preserve it and choose a versioned name.'}
$relativeFiles=@(
'index.html','DESIGN-RECORD.md','QA.md','research/CN.md','research/KR.md',
'selected-assets.json','prompts.json','prompt-corrections.json','prompts-derived.json','prompt-atlas-correction.json','verification.json',
'batch02-redesign-overview.png','retained-exact.png',
'masters/F05-R-v2.png','masters/F07-R-v1.png','masters/F08-R-v1.png',
'atlases/F05-R-v1.png','atlases/F07-R-v1.png','atlases/F08-R-v2.png',
'boards/F05-R-board.png','boards/F07-R-board.png','boards/F08-R-board.png',
'derived/F05-R-side.png','derived/F05-R-detail.png','derived/F07-R-side.png','derived/F07-R-detail.png','derived/F08-R-side.png','derived/F08-R-detail.png',
'editable/F05-R-board.svg','editable/F07-R-board.svg','editable/F08-R-board.svg','editable/batch02-redesign-overview.svg','editable/retained-exact.svg',
'retained/F02-R3-EXACT.png','retained/F06-v1-EXACT.png'
)
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive=[System.IO.Compression.ZipFile]::Open($archivePath,[System.IO.Compression.ZipArchiveMode]::Create)
try {
 foreach($rel in $relativeFiles){
  $sourceFile=Join-Path $batchDir $rel
  if(-not(Test-Path -LiteralPath $sourceFile -PathType Leaf)){throw "Missing $rel"}
  [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive,$sourceFile,$rel,[System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
 }
}finally{$archive.Dispose()}
$checkArchive=[System.IO.Compression.ZipFile]::OpenRead($archivePath)
$results=@()
try{
 foreach($rel in $relativeFiles){
  $entry=$checkArchive.GetEntry($rel)
  if($null -eq $entry){throw "Missing packaged entry $rel"}
  $stream=$entry.Open()
  $hasher=[System.Security.Cryptography.SHA256]::Create()
  try{$entryHash=[Convert]::ToHexString($hasher.ComputeHash($stream))}finally{$stream.Dispose();$hasher.Dispose()}
  $sourceHash=(Get-FileHash -LiteralPath (Join-Path $batchDir $rel) -Algorithm SHA256).Hash
  if($entryHash -ne $sourceHash){throw "Integrity failure $rel"}
  $results+=[pscustomobject]@{path=$rel;pass=$true;sha256=$sourceHash}
 }
 $count=$checkArchive.Entries.Count
}finally{$checkArchive.Dispose()}
[pscustomobject]@{archive=$archivePath;bytes=(Get-Item -LiteralPath $archivePath).Length;entries=$count;integrityChecks=$results.Count;pass=$true} | ConvertTo-Json

