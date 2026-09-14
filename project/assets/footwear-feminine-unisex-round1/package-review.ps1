$ErrorActionPreference='Stop'
$seriesDir='D:\Codex-chat\night-veil-brand\assets\footwear-feminine-unisex-round1'
$deliveryDir=Join-Path $seriesDir 'delivery-F02R3-batch02'
$zipFile=Join-Path $seriesDir 'MOVERNO-F02-R3-and-Batch02-review.zip'
if(Test-Path -LiteralPath $deliveryDir){throw 'Delivery folder already exists; do not overwrite.'}
if(Test-Path -LiteralPath $zipFile){throw 'Review ZIP already exists; do not overwrite.'}
New-Item -ItemType Directory -Path $deliveryDir | Out-Null
foreach($group in @('revision-03','batch02')){
  $sourceDir=Join-Path $seriesDir $group
  $targetDir=Join-Path $deliveryDir $group
  New-Item -ItemType Directory -Path $targetDir | Out-Null
  $selected=Get-Content -LiteralPath (Join-Path $sourceDir 'selected-assets.json') -Raw | ConvertFrom-Json
  foreach($entry in $selected.PSObject.Properties){
    $shoeId=$entry.Name
    $paths=@($entry.Value.master,$entry.Value.atlas,('boards/'+$shoeId+'-board.png'),('editable/'+$shoeId+'-board.svg'))
    foreach($rel in $paths){
      $destination=Join-Path $targetDir $rel
      New-Item -ItemType Directory -Path (Split-Path -Parent $destination) -Force | Out-Null
      Copy-Item -LiteralPath (Join-Path $sourceDir $rel) -Destination $destination
    }
  }
  $docs=@('index.html','QA.md','selected-assets.json','verification.json','prompts-derived.json')
  if($group -eq 'revision-03'){$docs+=@('prompts.json','REVISION-NOTES.md')}else{$docs+=@('batch02-prompts.json','prompts-corrections.json','REFERENCE-MAP.md','batch02-overview.png','editable/batch02-overview.svg')}
  foreach($rel in $docs){
    $destination=Join-Path $targetDir $rel
    New-Item -ItemType Directory -Path (Split-Path -Parent $destination) -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $sourceDir $rel) -Destination $destination
  }
}
Copy-Item -LiteralPath (Join-Path $seriesDir 'review-r3-batch02.html') -Destination (Join-Path $deliveryDir 'index.html')
$archiveItems=Get-ChildItem -LiteralPath $deliveryDir | Select-Object -ExpandProperty FullName
Compress-Archive -LiteralPath $archiveItems -DestinationPath $zipFile -CompressionLevel Optimal
Add-Type -AssemblyName System.IO.Compression.FileSystem
$reviewZip=[System.IO.Compression.ZipFile]::OpenRead($zipFile)
try{
  $boards=@($reviewZip.Entries | Where-Object {$_.FullName -match '(?:/|\\)boards(?:/|\\)F\d+-board.png$'})
  if($boards.Count -ne 5){throw "Expected five boards, found $($boards.Count)"}
  [PSCustomObject]@{Zip=$zipFile;Bytes=(Get-Item -LiteralPath $zipFile).Length;Entries=$reviewZip.Entries.Count;Boards=$boards.Count} | ConvertTo-Json
}finally{$reviewZip.Dispose()}

