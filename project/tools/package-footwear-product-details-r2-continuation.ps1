$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$detailBase = 'D:/Codex-chat/night-veil-brand/assets/ss27-footwear-product-details-round2'
$assetBase = 'D:/Codex-chat/night-veil-brand/assets'
$detailData = Get-Content -LiteralPath ($detailBase + '/products.json') -Raw | ConvertFrom-Json
if ($detailData.completed -ne 15) { throw 'All 15 must be completed before packaging.' }
$hashEngine = [Security.Cryptography.SHA256]::Create()
$priorArchive = [IO.Compression.ZipFile]::OpenRead($assetBase + '/MOVERNO-SS27-details-round2-batch01-20260909.zip')
$preserved = @()
try {
 foreach ($entry in $priorArchive.Entries) {
  if ($entry.FullName -match '^(posters|social|campaign|views|editable|previews|sources)/0[1-5]-') {
   $entryStream = $entry.Open()
   try { $beforeHash = [BitConverter]::ToString($hashEngine.ComputeHash($entryStream)) } finally { $entryStream.Dispose() }
   $currentStream = [IO.File]::OpenRead($detailBase + '/' + $entry.FullName)
   try { $afterHash = [BitConverter]::ToString($hashEngine.ComputeHash($currentStream)) } finally { $currentStream.Dispose() }
   $same = $beforeHash -eq $afterHash
   $preserved += [pscustomobject]@{file=$entry.FullName;unchanged=$same}
   if (-not $same) { throw ('First-batch artifact changed: ' + $entry.FullName) }
  }
 }
} finally { $priorArchive.Dispose(); $hashEngine.Dispose() }
$preservationResult = [pscustomobject]@{checked=$preserved.Count;unchanged=($preserved | Where-Object unchanged).Count;files=$preserved}
[IO.File]::WriteAllText($detailBase+'/preservation-batch01.json',($preservationResult | ConvertTo-Json -Depth 6),[Text.UTF8Encoding]::new($false))
$packageResults = @()
foreach ($batchId in @('02','03')) {
 $selected = @($detailData.products | Where-Object { [int]$_.batch -eq [int]$batchId })
 $destination = $assetBase + '/MOVERNO-SS27-details-round2-batch' + $batchId + '-20260909.zip'
 if (Test-Path -LiteralPath $destination) { throw ('Archive already exists, inspect before replacing: ' + $destination) }
 $entries = @()
 foreach ($product in $selected) {
  $stem = $product.id + '-' + $product.slug
  foreach ($rel in @($product.sourceCopy,$product.atlas,$product.campaign,('posters/'+$stem+'-detail.png'),('social/'+$stem+'-cover.png'),('editable/'+$stem+'-detail.svg'),('editable/'+$stem+'-social.svg'),('previews/'+$product.id+'-detail.png'),('previews/'+$product.id+'-cover.png'))) {
   $entries += [pscustomobject]@{source=($detailBase+'/'+$rel);target=$rel}
  }
 }
 foreach ($rel in @("copy-batch$batchId.json","render-batch$batchId.json","manifest-batch$batchId.json","overview-batch$batchId.png",'layout-qa-batch02-03.json','research/visual-research.md','verification-complete.json','preservation-batch01.json')) {
  $entries += [pscustomobject]@{source=($detailBase+'/'+$rel);target=$rel}
 }
 $entries += [pscustomobject]@{source=($detailBase+'/index-batch'+$batchId+'.html');target='index.html'}
 $entries += [pscustomobject]@{source=($detailBase+'/README-batch'+$batchId+'.md');target='README.md'}
 $zip = [IO.Compression.ZipFile]::Open($destination,[IO.Compression.ZipArchiveMode]::Create)
 try {
  foreach ($item in $entries) { [void][IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip,$item.source,$item.target,[IO.Compression.CompressionLevel]::Optimal) }
  $metaEntry = $zip.CreateEntry('products.json')
  $metaWriter = [IO.StreamWriter]::new($metaEntry.Open(),[Text.UTF8Encoding]::new($false))
  try { $metaWriter.Write(([pscustomobject]@{collection='MOVERNO / SS27';batch=$batchId;scope=5;completed=5;products=$selected} | ConvertTo-Json -Depth 8)) } finally { $metaWriter.Dispose() }
 } finally { $zip.Dispose() }
 $readback = [IO.Compression.ZipFile]::OpenRead($destination)
 try {
  $names = @($readback.Entries.FullName)
  $counts = [ordered]@{}
  foreach ($folder in @('posters','social','campaign','views','editable','sources','previews')) { $counts[$folder]=@($names | Where-Object { $_.StartsWith($folder+'/') }).Count }
  if ($counts.posters -ne 5 -or $counts.social -ne 5 -or $counts.editable -ne 10 -or $counts.views -ne 5 -or $counts.campaign -ne 5 -or $counts.sources -ne 5 -or $counts.previews -ne 10) { throw ('Incorrect package contents: '+$batchId) }
  if (-not $names.Contains('index.html')) { throw 'Missing review page.' }
  $packageResults += [pscustomobject]@{batch=$batchId;path=$destination;bytes=(Get-Item -LiteralPath $destination).Length;entries=$names.Count;counts=$counts;readbackVerified=$true}
 } finally { $readback.Dispose() }
}
[IO.File]::WriteAllText($detailBase+'/package-verification.json',($packageResults | ConvertTo-Json -Depth 8),[Text.UTF8Encoding]::new($false))
$packageResults | ConvertTo-Json -Depth 8
Write-Output ('First-batch files confirmed unchanged against original ZIP: ' + $preserved.Count)
