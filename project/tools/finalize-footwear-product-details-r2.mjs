import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const base='D:/Codex-chat/night-veil-brand/assets/ss27-footwear-product-details-round2';
const data=JSON.parse(await fs.readFile(base+'/products.json','utf8'));
const copies=(await Promise.all(['01','02','03'].map(async b=>JSON.parse(await fs.readFile(base+'/copy-batch'+b+'.json','utf8'))))).flat();
const all=data.products.map(p=>({...p,...copies.find(c=>c.id===p.id)}));
for(const p of all)for(const f of ['posters/'+p.id+'-'+p.slug+'-detail.png','social/'+p.id+'-'+p.slug+'-cover.png',p.atlas,p.campaign])await fs.access(base+'/'+f);
const css='*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#151619;color:#eeece7;font-family:"Microsoft YaHei",sans-serif}a{color:inherit}a:focus-visible,summary:focus-visible{outline:3px solid #a59a85;outline-offset:6px}.intro,.foot{padding:54px 5vw 42px;max-width:1560px;margin:auto}.intro small{letter-spacing:3px;color:#a59a85}.intro h1{font-size:clamp(32px,4.7vw,68px);line-height:1.24;max-width:920px;margin:30px 0}.intro p{max-width:870px;color:#bbb7ae;line-height:1.9}.index{display:flex;gap:12px;flex-wrap:wrap;margin:28px 0 0}.index a{border:1px solid #55534e;text-decoration:none;padding:10px 15px}.batch{max-width:1560px;margin:0 auto;padding:30px 5vw 50px}.batch>h2{font-size:29px;font-weight:500;margin:0 0 24px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px 26px}.grid article{min-width:0;background:#242527;padding-bottom:20px;scroll-margin-top:18px}.grid article header{padding:24px 22px 16px;min-height:163px}.grid header span{color:#b6ab95;font-size:12px;letter-spacing:1.5px}.grid h3{font-size:25px;margin:13px 0}.grid header p{margin:0;color:#b9b7b0;font-size:14px;line-height:1.6}.cover img,.long{display:block;width:100%;height:auto}.grid nav{display:flex;gap:15px;padding:22px;flex-wrap:wrap;font-size:13px}.grid nav a{text-decoration-thickness:1px;text-underline-offset:5px}summary{cursor:pointer;margin:0 22px 20px;font-size:14px}.foot{color:#aaa79e;font-size:14px;line-height:1.9;border-top:1px solid #3b3c3b}.foot a{margin-right:16px}@media(max-width:1120px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.intro,.foot{padding:34px 20px}.batch{padding:20px}.grid{display:block}.grid article{margin-bottom:30px}.grid article header{min-height:0}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}';
function card(p){
const stem=p.id+'-'+p.slug;
return '<article id="shoe-'+p.id+'"><header><span>'+p.id+' / '+p.english+'</span><h3>'+p.name+'</h3><p>'+p.lead+'</p></header><a class="cover" href="social/'+stem+'-cover.png" target="_blank"><img loading="lazy" src="previews/'+p.id+'-cover.png" width="432" height="540" alt="'+p.name+'上脚概念封面"></a><nav><a href="posters/'+stem+'-detail.png" target="_blank">详情长图 ↗</a><a href="views/'+stem+'-six-views.png" target="_blank">六角度 ↗</a><a href="editable/'+stem+'-detail.svg" download>可编辑 SVG ↓</a></nav><details><summary>展开详情预览</summary><img class="long" loading="lazy" src="previews/'+p.id+'-detail.png" alt="'+p.name+'完整详情"></details></article>';
}
function page(ps,b=null){
const batches=[...new Set(ps.map(p=>Number(p.batch)))];
return '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOVERNO · '+(b?'第 '+b+' 批详情审核':'全部 15 款详情审核')+'</title><style>'+css+'</style></head><body><section class="intro"><small>MOVERNO / SS27 · '+(b?'BATCH '+b:'ALL 15 DESIGNS')+'</small><h1>让黑夜不必黯然，<br>让差异不必喧哗。</h1><p>'+(b?'本批五款':'三批十五款')+'均包含上脚氛围图、详情长图、原款局部、六角度与品牌细节。编号对应本次 15 张上传顺序。'+(b?'':'首批 01–05 沿用已交付版本；此次续制 06–15。')+'</p><p>概念审核资料，非实物拍摄。原款主图完整保留；底板及隐藏视角为概念延展，需样鞋核对。未公开发布。</p><nav class="index">'+ps.map(p=>'<a href="#shoe-'+p.id+'">'+p.id+' '+p.name+'</a>').join('')+'</nav></section><main>'+batches.map(n=>'<section class="batch"><h2>BATCH 0'+n+' / '+(n===1?'01–05':n===2?'06–10':'11–15')+'</h2><div class="grid">'+ps.filter(p=>Number(p.batch)===n).map(card).join('')+'</div></section>').join('')+'</main><footer class="foot">详情长图 1080 × 6320 px · 社媒封面 1080 × 1350 px · 自包含可编辑 SVG<br><a href="research/visual-research.md">官方视觉研究与来源</a><a href="products.json">款号与原图映射</a><a href="'+(b?'render-batch'+b+'.json':'verification-complete.json')+'">导出检查</a></footer></body></html>';
}
try{await fs.access(base+'/index-batch01.html');}catch{await fs.copyFile(base+'/index.html',base+'/index-batch01.html');}
await fs.writeFile(base+'/index.html',page(all));
for(const b of ['02','03']){
 const ps=all.filter(p=>Number(p.batch)===Number(b));
 await fs.writeFile(base+'/index-batch'+b+'.html',page(ps,b));
 const jobs=[];
 for(const f of await fs.readdir(base+'/jobs')){const j=JSON.parse(await fs.readFile(base+'/jobs/'+f,'utf8'));if(ps.some(p=>p.id===j.id))jobs.push(j);}
 await fs.writeFile(base+'/manifest-batch'+b+'.json',JSON.stringify({batch:b,date:'2026-09-09',products:ps.map(p=>({id:p.id,name:p.name,source:p.source,sourceCopy:p.sourceCopy,lockedDesign:p.lockedDesign})),jobs,conceptDisclosure:'ImageGen 概念延展；新增视角、底板与标识位置需样鞋核对。',workflow:'StyTrix 流程核对，未使用 StyTrix 付费生成；复用第一批官方视觉研究。'},null,2));
 await fs.writeFile(base+'/README-batch'+b+'.md','# MOVERNO SS27 · 第 '+b+' 批详情审核\n\n款号 '+ps[0].id+'–'+ps.at(-1).id+'，沿用用户选定顺序。\n\n## 文件\n\n- index.html（压缩包内）/ index-batch'+b+'.html：本批审核页面。\n- posters/：5 张 1080 × 6320 产品详情长图。\n- social/：5 张 1080 × 1350 社媒封面。\n- views/：5 张六角度概念图；原生像素以 render-batch'+b+'.json 为准。\n- campaign/：5 张上脚概念图。\n- editable/：10 份自包含 SVG，中文文案可编辑；图片内容为嵌入式 PNG。\n- sources/：5 款原图副本，未修改。\n- previews/：轻量预览。\n\n## 审核边界\n\n原款主图保留，不把新视角当成实物。新增鞋舌、后跟、底板标识与结构为概念表达，量产需样鞋验证。未增加材质成分、性能、库存、价格、评价等未经证实的销售宣称。宣传聚焦轮廓、纹理、品牌识别与搭配。未公开发布。\n\n品牌理念：让黑夜不必黯然，让差异不必喧哗。Different But Excellent.\n\nStyTrix 仅用于设计流程，ImageGen 生成画面，确定性排版输出中文详情；不使用 StyTrix 付费生成。\n');
}
data.completed=15;data.phase=3;
for(const p of data.products)if(Number(p.id)>5)p.status='batch0'+p.batch+'-complete-for-review';
await fs.writeFile(base+'/products.json',JSON.stringify(data,null,2));
await fs.writeFile(base+'/README.md','# MOVERNO SS27 · 全部 15 款详情审核\n\n打开 index.html 查看全部三批。首批 01–05 保留原交付；本次续制 06–15。\n\n两批新增共 10 张详情长图、10 张社媒封面、10 张六视图、10 张上脚概念图和 20 份可编辑 SVG。每批分别有 index-batch02.html / index-batch03.html、README 和来源记录。\n\n所有图片均为概念渲染，非实物拍摄。原款主图未修改；隐藏视角、底板与品牌细节为概念延展，需打样核对。未公开发布。详见各批 README。\n');
const top=await sharp(base+'/overview-batch02.png').png().toBuffer();
const bottom=await sharp(base+'/overview-batch03.png').png().toBuffer();
await sharp({create:{width:1700,height:1250,channels:3,background:'#151619'}}).composite([{input:top,left:0,top:0},{input:bottom,left:0,top:625}]).png().toFile(base+'/overview-batch02-03.png');
console.log('Review pages and manifests complete for all 15; first-batch images unchanged.');

