import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const base='D:/Codex-chat/night-veil-brand/assets/ss27-footwear-product-details-round2';
const data=JSON.parse(await fs.readFile(base+'/products.json','utf8'));
const checks=[];
const check=(name,ok)=>checks.push({name,ok:!!ok});
const selected=data.products.slice(0,5);
for(const p of data.products){check(p.id+' source archive unchanged',(await fs.readFile(p.source)).equals(await fs.readFile(base+'/'+p.sourceCopy)));}
for(const p of selected){
 const poster=await sharp(base+`/posters/${p.id}-${p.slug}-detail.png`).metadata();
 const social=await sharp(base+`/social/${p.id}-${p.slug}-cover.png`).metadata();
 const atlas=await sharp(base+'/'+p.atlas).metadata();
 const svg=await fs.readFile(base+`/editable/${p.id}-${p.slug}-detail.svg`,'utf8');
 check(p.id+' poster 1080x6320',poster.width===1080&&poster.height===6320);
 check(p.id+' cover 1080x1350',social.width===1080&&social.height===1350);
 check(p.id+' native 4:3 atlas',Math.abs(atlas.width/atlas.height-4/3)<.01&&atlas.width>=1400);
 const images=[...svg.matchAll(/<image id="([^"]+)"[^>]*href="data:image\/png;base64,([^"]+)"/g)];
 check(p.id+' 5 embedded image assets',images.length===5);
 const master=images.find(i=>i[1]==='master');
 check(p.id+' exact source embedded',master&&Buffer.from(master[2],'base64').equals(await fs.readFile(p.source)));
 check(p.id+' no external image links',!svg.includes('href="http'));
 check(p.id+' Chinese mission and concept disclaimer',svg.includes('让黑夜不必黯然，')&&svg.includes('让差异不必喧哗。')&&svg.includes('概念渲染，非实物拍摄'));
 check(p.id+' all six view labels',['OUTER','INNER','FRONT','REAR','TOP','OUTSOLE'].every(s=>svg.includes(s)));
 check(p.id+' no unverified performance claim',!['防水','防滑','缓震','零磨脚','实测','限量','销量'].some(s=>svg.includes(s)));
}
const html=await fs.readFile(base+'/index.html','utf8');
const links=[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]).filter(p=>!p.startsWith('#')&&!p.startsWith('http'));
for(const p of new Set(links)){let ok=true;try{await fs.access(path.join(base,p));}catch{ok=false;}check('local link '+p,ok);}
check('HTML says only first batch complete',html.includes('以下 10 款尚未生成详情图'));
const result={date:'2026-09-09',scope:'batch01 / 01–05 only',count:checks.length,passed:checks.filter(c=>c.ok).length,failed:checks.filter(c=>!c.ok),checks,visualReview:'Source silhouettes and palette, six-view order, cover composition and detail crops inspected separately. Added views are conceptual, not CAD/tech-pack or factory proof.'};
await fs.writeFile(base+'/qa-batch01.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({checks:result.count,passed:result.passed,failed:result.failed}));
if(result.failed.length)process.exitCode=1;
