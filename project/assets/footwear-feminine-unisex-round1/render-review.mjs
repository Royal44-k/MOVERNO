import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const series=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(?:([A-Za-z]:))/, '$1'));
const mode=process.argv[2]||'batch02';
if(!['batch02','revision-03'].includes(mode))throw new Error('Unsupported review set');
const base=path.join(series,mode);
const isRevision=mode==='revision-03';
const root='D:/Codex-chat/night-veil-brand';
const items=JSON.parse(await fs.readFile(path.join(base,isRevision?'prompts.json':'batch02-prompts.json'),'utf8'));
const selected=JSON.parse(await fs.readFile(path.join(base,'selected-assets.json'),'utf8'));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const txt=(s,x,y,size=24,fill='#1a1b1d',extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(s)}</text>`;
const line=(y,x=64,w=1472)=>`<path d="M${x} ${y}h${w}" stroke="#cecac4" stroke-width="1"/>`;
const label=(s,x,y)=>txt(s,x,y,18,'#73706b','font-family="Arial,sans-serif" letter-spacing="2"');
const wrap=(s,n)=>{const chars=Array.from(s),count=Math.ceil(chars.length/n);if(count>1&&chars.length%n>0&&chars.length%n<6)n=Math.ceil(chars.length/count);const a=chars.reduce((acc,c,i)=>{if(i%n===0)acc.push('');acc[acc.length-1]+=c;return acc;},[]);if(a.length>1&&/^[。；，、！？,.!?]+$/.test(a.at(-1))){a[a.length-2]+=a.pop();}return a;};
const img=async(file,x,y,w,h)=>`<image x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,${(await fs.readFile(file)).toString('base64')}"/>`;
const begin=(w,h)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#f4f3f0"/><g font-family="Microsoft YaHei,Arial,sans-serif">`;
const end='</g></svg>';
const wordmark=root+'/assets/logo-direction-01/png/moverno-primary-wordmark@4x.png';
const emblem=root+'/assets/logo-direction-01/png/moverno-standalone-emblem@4x.png';
for(const dir of ['boards','editable','derived'])await fs.mkdir(path.join(base,dir),{recursive:true});
const checks=[];
const record=(name,pass,detail='')=>checks.push({name,pass,detail});
for(const p of items){
  const a=selected[p.id];
  if(!a)throw new Error('Missing selected asset '+p.id);
  const master=path.join(base,a.master),atlas=path.join(base,a.atlas);
  const m=await sharp(master).metadata(),t=await sharp(atlas).metadata();
  const split=Math.round(t.height*0.5);
  const side=path.join(base,'derived',p.id+'-side.png');
  const detail=path.join(base,'derived',p.id+'-detail.png');
  const sideEnd=a.sideEnd??split,detailStart=a.detailStart??split;
  await sharp(atlas).extract({left:0,top:0,width:t.width,height:sideEnd}).png().toFile(side);
  await sharp(atlas).extract({left:0,top:detailStart,width:t.width,height:t.height-detailStart}).png().toFile(detail);
  record(p.id+' master exists',m.width>=1024,`${m.width}×${m.height}`);
  record(p.id+' derived sheet exists',t.width>=1024,`${t.width}×${t.height}`);
  let s=begin(1600,2000);
  s+=await img(wordmark,64,40,445,106);
  s+=label(isRevision?'FORM STUDIES / REVISION 03':'FORM STUDIES / BATCH 02',64,168);
  s+=txt(isRevision?p.id+' / R3':p.id,1536,144,isRevision?68:94,'#1a1b1d','font-family="Arial,sans-serif" font-weight="700" text-anchor="end"');
  s+=txt(p.name,64,230,44,'#1a1b1d','font-weight="600"');
  s+=txt(p.direction+' · '+p.materials,64,275,24,'#6d6964');
  s+=line(300);
  s+=await img(master,64,312,1472,790);
  s+=txt(p.statement,64,1138,28);
  s+=line(1180);
  s+=label('01 / OUTER PROFILE',64,1220);
  s+=await img(side,64,1238,1472,360);
  s+=line(1620);
  s+=label('02 / MATERIAL & IDENTITY',64,1660);
  s+=txt(p.detailTitle,64,1720,30,'#1a1b1d','font-weight="600"');
  wrap(p.detailBody,23).forEach((v,i)=>{s+=txt(v,64,1770+38*i,24,'#69645e');});
  s+=await img(detail,836,1640,700,246);
  if(p.id==='F05'){
    s+=await img(emblem,64,1826,32,54);
    s+=txt('标准徽记 / 鞋上曲线制版时回套矢量',116,1864,21,'#69645e');
  }
  s+=line(1910);
  s+=label('MOVERNO / DIFFERENT BUT EXCELLENT.',64,1946);
  s+=txt('概念设计 · 材质与结构待打样验证',1536,1946,19,'#7e7972','text-anchor="end"');
  s+=end;
  await fs.writeFile(path.join(base,'editable',p.id+'-board.svg'),s);
  await sharp(Buffer.from(s)).png().toFile(path.join(base,'boards',p.id+'-board.png'));
  const bm=await sharp(path.join(base,'boards',p.id+'-board.png')).metadata();
  record(p.id+' board 4:5',bm.width===1600&&bm.height===2000);
}
if(!isRevision){
let overview=begin(3200,1240);
overview+=await img(wordmark,64,35,460,109);
overview+=label('F05—F08 / 第二批：闭合方式',64,185);
overview+=txt('女性向 / 中性鞋履',3136,125,38,'#1a1b1d','text-anchor="end"');
overview+='<path d="M64 220h3072" stroke="#cecac4"/>';
for(let i=0;i<items.length;i++){
  const p=items[i],x=64+i*776;
  overview+=label(p.id+' / '+p.direction,x,280);
  overview+=await img(path.join(base,selected[p.id].master),x,315,744,500);
  overview+=txt(p.name,x,875,37,'#1a1b1d','font-weight="600"');
  overview+=txt(p.color,x,922,24,'#746e66');
  wrap(p.statement,21).forEach((v,j)=>{overview+=txt(v,x,986+j*40,25);});
  if(i<3)overview+=`<path d="M${x+756} 280v790" stroke="#ddd9d3"/>`;
}
overview+='<path d="M64 1135h3072" stroke="#cecac4"/>';
overview+=label('16 CONCEPTS / 4 BATCHES / REVIEW 02',64,1187);
overview+=txt('仅展示设计提案；非量产样鞋或性能证明。',3136,1187,22,'#7e7972','text-anchor="end"')+end;
await fs.writeFile(path.join(base,'editable','batch02-overview.svg'),overview);
await sharp(Buffer.from(overview)).png().toFile(path.join(base,'batch02-overview.png'));
}

const overviewFile=isRevision?'boards/F02-board.png':'batch02-overview.png';
const title=isRevision?'F02 / R3 定向改版':'F05—F08 / 第二批：闭合方式';
const html='<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOVERNO — '+title+'</title><style>*{box-sizing:border-box}body{margin:0;background:#f4f3f0;color:#171819;font-family:Arial,"Microsoft YaHei",sans-serif}main{max-width:1600px;margin:auto;padding:28px}h1{font-size:28px;font-weight:500}p{color:#68645e;line-height:1.7}a{color:inherit}nav{display:flex;gap:20px;flex-wrap:wrap}.overview{width:100%;height:auto;display:block;margin:28px 0}.grid{display:grid;grid-template-columns:repeat('+ (isRevision?1:2) +',minmax(0,1fr));gap:28px}article img{width:100%;height:auto}h2{font-size:20px}footer{padding:28px 0;line-height:1.8}@media(max-width:700px){main{padding:16px}.grid{grid-template-columns:1fr}}</style><main><h1>MOVERNO / '+title+'</h1><p>'+(isRevision?'取消翻折鞋舌，黑金链纹嵌入鞋侧分区。F01、F03、F04 不变。':'四款采用不同的鞋口及闭合结构。本批完成后等待审核，F09–F16 尚未制作。')+'</p><nav><a href="'+(isRevision?'REVISION-NOTES.md':'REFERENCE-MAP.md')+'">参考与修改记录</a><a href="QA.md">复核记录</a><a href="'+(isRevision?'prompts.json':'batch02-prompts.json')+'">主图提示词</a><a href="prompts-derived.json">派生提示词</a></nav>'+(isRevision?'':'<a href="'+overviewFile+'"><img class="overview" src="'+overviewFile+'" alt="第二批横向总览"></a>')+'<section class="grid">'+items.map(p=>'<article><h2>'+p.id+(isRevision?' / R3':'')+' · '+esc(p.name)+'</h2><a href="boards/'+p.id+'-board.png"><img src="boards/'+p.id+'-board.png" alt="'+esc(p.name)+'，主视图、外侧与关键细节"></a><p><a href="'+selected[p.id].master+'">主图原文件</a> · <a href="'+selected[p.id].atlas+'">侧视与细节原文件</a></p></article>').join('')+'</section><footer>StyTrix 仅采用设计流程，无付费生成；鞋履像素由内置 ImageGen 制作。板面标准字标为原始资产。鞋上标识为栅格示意，不替代矢量工艺文件。<br>材质、结构、贴合与耐久均待打样验证，不作未经测试的性能承诺。</footer></main></html>';
await fs.writeFile(path.join(base,'index.html'),html);
const baseline=JSON.parse(await fs.readFile(path.join(series,'protected-baseline-r3-b02.json'),'utf8'));
for(const old of baseline){const h=crypto.createHash('sha256').update(await fs.readFile(old.Path)).digest('hex').toUpperCase();record('unchanged '+old.Path,h===old.Hash);}
record('distinct style statements',new Set(items.map(p=>p.statement)).size===items.length);
record('expected board count',items.length===(isRevision?1:4)&&Object.keys(selected).length===items.length);
if(!isRevision){const om=await sharp(path.join(base,overviewFile)).metadata();record('overview 3200x1240',om.width===3200&&om.height===1240);}
for(const p of items){for(const rel of [selected[p.id].master,selected[p.id].atlas,'boards/'+p.id+'-board.png','editable/'+p.id+'-board.svg'])record('artifact '+rel,(await fs.stat(path.join(base,rel))).size>1000);}
await fs.writeFile(path.join(base,'verification.json'),JSON.stringify({timestamp:new Date().toISOString(),checks,pass:checks.every(c=>c.pass)},null,2));
console.log(JSON.stringify({output:base,checks:checks.length,pass:checks.every(c=>c.pass),boards:items.map(p=>'boards/'+p.id+'-board.png')},null,2));
if(checks.some(c=>!c.pass))process.exitCode=1;
