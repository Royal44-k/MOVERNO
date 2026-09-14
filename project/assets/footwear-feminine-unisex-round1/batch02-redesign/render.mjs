import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const base=path.dirname(fileURLToPath(import.meta.url)),series=path.dirname(base);
const root='D:/Codex-chat/night-veil-brand';
const items=JSON.parse(await fs.readFile(path.join(base,'selected-assets.json'),'utf8'));
const wordmark=root+'/assets/logo-direction-01/png/moverno-primary-wordmark@4x.png';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const txt=(s,x,y,size=24,fill='#1b1b1d',extra='')=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" fill="'+fill+'" '+extra+'>'+esc(s)+'</text>';
const label=(s,x,y)=>txt(s,x,y,18,'#73716e','font-family="Arial,Microsoft YaHei,sans-serif" letter-spacing="1.5"');
const rule=(y,x=64,w=1472)=>'<path d="M'+x+' '+y+'h'+w+'" stroke="#d1cdc7"/>';
const wrap=(s,n)=>{const chars=Array.from(s),rows=Math.ceil(chars.length/n);if(chars.length%n>0&&chars.length%n<6)n=Math.ceil(chars.length/rows);return chars.reduce((a,c,i)=>{if(i%n===0)a.push('');a[a.length-1]+=c;return a;},[]);};
const img=async(file,x,y,w,h)=>'<image x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,'+(await fs.readFile(file)).toString('base64')+'"/>';
const begin=(w,h)=>'<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'"><rect width="100%" height="100%" fill="#f4f3f0"/><g font-family="Microsoft YaHei,Arial,sans-serif">';
const end='</g></svg>';
const checks=[];const check=(name,pass,detail='')=>checks.push({name,pass,detail});
for(const dir of ['boards','editable','derived'])await fs.mkdir(path.join(base,dir),{recursive:true});
for(const [id,p] of Object.entries(items)){
 const master=path.join(base,p.master),atlas=path.join(base,p.atlas);
 const m=await sharp(master).metadata(),t=await sharp(atlas).metadata();
 const side=path.join(base,'derived',id+'-side.png'),detail=path.join(base,'derived',id+'-detail.png');
 await sharp(atlas).extract({left:0,top:0,width:t.width,height:p.sideEnd}).png().toFile(side);
 await sharp(atlas).extract({left:0,top:p.detailStart,width:t.width,height:t.height-p.detailStart}).png().toFile(detail);
 check(id+' master available',m.width>=1024);
 check(id+' atlas available',t.width>=1024);
 check(id+' crop bounds',p.sideEnd<p.detailStart&&p.detailStart<t.height);
 let s=begin(1600,2000);
 s+=await img(wordmark,64,40,445,106);
 s+=label('FEMININE FORM STUDIES / RE-DESIGN 02',64,170);
 s+=txt(id,1536,148,76,'#1b1b1d','text-anchor="end" font-family="Arial" font-weight="700"');
 s+=txt(p.name,64,238,44,'#1b1b1d','font-weight="600"');
 s+=txt(p.materials,64,280,25,'#706c66');
 s+=rule(306);
 s+=await img(master,64,322,1472,788);
 s+=txt(p.statement,64,1154,28);
 s+=rule(1190);
 s+=label('01 / LATERAL VIEW',64,1234);
 s+=await img(side,64,1252,1472,348);
 s+=rule(1620);
 s+=label('02 / CONSTRUCTION & IDENTITY',64,1662);
 s+=txt(p.detailTitle,64,1720,31,'#1b1b1d','font-weight="600"');
 (p.detailLines??wrap(p.detailText,22)).forEach((v,i)=>{s+=txt(v,64,1770+i*37,24,'#6c6863');});
 s+=await img(detail,838,1642,698,252);
 s+=rule(1910);
 s+=label('MOVERNO / DIFFERENT BUT EXCELLENT.',64,1948);
 s+=txt('新设计待审 · 工艺与贴合待打样',1536,1948,20,'#7b766f','text-anchor="end"');
 s+=end;
 await fs.writeFile(path.join(base,'editable',id+'-board.svg'),s);
 await sharp(Buffer.from(s)).png().toFile(path.join(base,'boards',id+'-board.png'));
 const b=await sharp(path.join(base,'boards',id+'-board.png')).metadata();
 check(id+' board 1600x2000',b.width===1600&&b.height===2000);
}
const overviewItems=[
 {id:'F05-R',...items['F05-R'],status:'新设计 · 待审核'},
 {id:'F06 / ORIGINAL',master:'retained/F06-v1-EXACT.png',name:'深可可穆勒',materials:'沿用用户指定原图',statement:'酒红只显于开口内侧；保留原鞋面，无外翻折边。',status:'用户保留 · 未改动'},
 {id:'F07-R',...items['F07-R'],status:'新设计 · 待审核'},
 {id:'F08-R',...items['F08-R'],status:'新设计 · 待审核'}
];
let o=begin(3200,1280);
o+=await img(wordmark,64,35,460,109);
o+=label('BATCH 02 / THREE NEW DESIGNS + ONE RETAINED',64,185);
o+=txt('女性向重设计 / 第二批',3136,122,42,'#1b1b1d','text-anchor="end"');
o+=rule(223,64,3072);
for(let i=0;i<overviewItems.length;i++){
 const p=overviewItems[i],x=64+i*776;
 o+=label(p.id,x,281);
 o+=txt(p.status,x,324,23,p.status.startsWith('用户')?'#6b5e4a':'#575550');
 o+=await img(path.join(base,p.master),x,362,744,460);
 o+=txt(p.name,x,882,36,'#1b1b1d','font-weight="600"');
 wrap(p.materials,24).forEach((v,j)=>{o+=txt(v,x,926+31*j,22,'#736e68');});
 wrap(p.statement,22).forEach((v,j)=>{o+=txt(v,x,1014+39*j,25);});
 if(i<3)o+='<path d="M'+(x+756)+' 280v816" stroke="#dad6d0"/>';
}
o+=rule(1154,64,3072);
o+=label('F02-R3 ALSO RETAINED UNCHANGED / SEE REVIEW GALLERY',64,1205);
o+=txt('概念设计；未验证的舒适、性能与制造参数不作承诺。',3136,1205,22,'#7b766f','text-anchor="end"')+end;
await fs.writeFile(path.join(base,'editable','batch02-redesign-overview.svg'),o);
await sharp(Buffer.from(o)).png().toFile(path.join(base,'batch02-redesign-overview.png'));
const overviewMeta=await sharp(path.join(base,'batch02-redesign-overview.png')).metadata();
check('overview 3200x1280',overviewMeta.width===3200&&overviewMeta.height===1280);
let retained=begin(2400,1250);
retained+=await img(wordmark,64,40,430,103);
retained+=txt('用户指定保留 / 原图未修改',64,208,42);
for(const [i,id,title,file] of [[0,'F02-R3','黑金链纹运动鞋','F02-R3-EXACT.png'],[1,'F06 / V1','深可可穆勒 · 无外翻折边','F06-v1-EXACT.png']]){
 const x=64+i*1164;
 retained+=label(id,x,280);
 retained+=await img(path.join(base,'retained',file),x,310,1108,738);
 retained+=txt(title,x,1130,32);
}
retained+=end;
await fs.writeFile(path.join(base,'editable','retained-exact.svg'),retained);
await sharp(Buffer.from(retained)).png().toFile(path.join(base,'retained-exact.png'));
const html='<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOVERNO 女性向重设计 / 第二批</title><style>*{box-sizing:border-box}body{margin:0;background:#f4f3f0;color:#1b1b1d;font-family:Arial,"Microsoft YaHei",sans-serif}main{max-width:1680px;padding:32px;margin:auto}h1{font-size:30px;font-weight:500;line-height:1.4}p{line-height:1.8;color:#6b6660}a{color:inherit}nav{display:flex;gap:22px;flex-wrap:wrap;padding:12px 0}img{display:block;width:100%;height:auto}section{margin-top:48px}article{margin-bottom:44px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px}.grid article:last-child{max-width:820px}h2{font-size:22px}.note{border-top:1px solid #cdc7bf;padding-top:20px}footer{margin-top:48px;border-top:1px solid #cdc7bf;padding:24px 0;line-height:1.9;color:#716b64}@media(max-width:760px){main{padding:16px}.grid{grid-template-columns:1fr}h1{font-size:24px}}</style><main><h1>MOVERNO / 女性向重设计 · 第二批</h1><p>3 款新设计待审核：F05-R、F07-R、F08-R。F02-R3 与 F06-v1 沿用你指定的原图，未重绘。<br>旧 F05、F07、F08 与 F06 外翻折版退出采用；第三、四批未推进。</p><nav><a href="DESIGN-RECORD.md">参考转化与排重</a><a href="research/CN.md">中国发布记录</a><a href="research/KR.md">韩国平台记录</a><a href="QA.md">复核与打样边界</a><a href="selected-assets.json">选用文件</a></nav><section><h2>第二批横向对比</h2><a href="batch02-redesign-overview.png"><img src="batch02-redesign-overview.png" alt="三款重设计与原样保留F06对比"></a></section><section class="grid">'+Object.entries(items).map(([id,p])=>'<article><h2>'+id+' · '+esc(p.name)+'</h2><a href="boards/'+id+'-board.png"><img src="boards/'+id+'-board.png" alt="'+esc(p.name)+'设计板"></a><p>'+esc(p.styling)+'（设计推演，尚未完成真人试穿。）</p><a href="'+p.master+'">主图</a> · <a href="'+p.atlas+'">侧视和细节</a> · <a href="editable/'+id+'-board.svg">可编辑排版 SVG</a></article>').join('')+'</section><section><h2>两款原样保留</h2><a href="retained-exact.png"><img src="retained-exact.png" alt="F02-R3和F06-v1原样保留"></a><p><a href="retained/F02-R3-EXACT.png">F02-R3 原图</a> · <a href="retained/F06-v1-EXACT.png">F06-v1 原图</a></p></section><footer>Research 用于核验公开原始发布；StyTrix 仅用拆解和复核流程，无付费生成。鞋履图像由内置 ImageGen 制作；板面使用原始 MOVERNO 字标。<br>概念视图不是可制版正投影或真实样鞋。标识曲线、扣件尺寸、贴合与耐久需要标准矢量回套和物理打样。没有宣称全面访问小红书、抖音或 Instagram。<br><a href="prompts.json">母图提示词</a> · <a href="prompt-corrections.json">F05 修正</a> · <a href="prompts-derived.json">派生记录</a> · <a href="prompt-atlas-correction.json">F08 数量修正</a> · <a href="verification.json">导出检查</a></footer></main></html>';
await fs.writeFile(path.join(base,'index.html'),html);
const baseline=JSON.parse(await fs.readFile(path.join(series,'protected-baseline-r3-b02.json'),'utf8'));
for(const old of baseline){const h=crypto.createHash('sha256').update(await fs.readFile(old.Path)).digest('hex').toUpperCase();check('protected '+old.Path,h===old.Hash);}
const gen='C:/Users/lenovo/.codex/generated_images/01a05c31-abd0-79f1-98f3-31e8f97ddab9';
for(const [original,copy] of [['exec-4e7c2f62-7d48-40c7-8f33-dfb4d96c4ff7.png','F02-R3-EXACT.png'],['exec-a479dea4-e926-49f7-a029-a2ee3ddcfccd.png','F06-v1-EXACT.png']]){
 const a=crypto.createHash('sha256').update(await fs.readFile(path.join(gen,original))).digest('hex');
 const b=crypto.createHash('sha256').update(await fs.readFile(path.join(base,'retained',copy))).digest('hex');
 check('user exact retained '+copy,a===b,a);
}
check('three unique statements',new Set(Object.values(items).map(x=>x.statement)).size===3);
check('three new styles only',Object.keys(items).join(',')==='F05-R,F07-R,F08-R');
const linked=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]).filter(x=>!/^https?:/.test(x));
for(const rel of new Set(linked)){if(rel==='verification.json')continue;try{check('gallery file '+rel,(await fs.stat(path.join(base,rel))).size>0);}catch{check('gallery file '+rel,false,'missing');}}
await fs.writeFile(path.join(base,'verification.json'),JSON.stringify({timestamp:new Date().toISOString(),checks,pass:checks.every(c=>c.pass)},null,2));
console.log(JSON.stringify({output:base,checks:checks.length,pass:checks.every(c=>c.pass),failures:checks.filter(c=>!c.pass)},null,2));
if(checks.some(c=>!c.pass))process.exitCode=1;
