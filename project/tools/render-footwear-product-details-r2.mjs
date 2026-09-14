import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const base='D:/Codex-chat/night-veil-brand/assets/ss27-footwear-product-details-round2';
const root='D:/Codex-chat/night-veil-brand';
const data=JSON.parse(await fs.readFile(base+'/products.json','utf8'));
const copy=JSON.parse(await fs.readFile(base+'/copy-batch01.json','utf8'));
const products=data.products.slice(0,5).map((p,i)=>({...p,...copy[i]}));
const W=1080,H=6320;
const C={ink:'#151619',paper:'#eeece7',line:'#ccc7be',muted:'#6a6965',white:'#f3f0e8',gold:'#a59a85'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const tx=(s,x,y,size=26,color=C.ink,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${esc(s)}</text>`;
const rect=(x,y,w,h,c,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" ${extra}/>`;
const rule=(x,y,w,c=C.line)=>`<path d="M${x} ${y}h${w}" stroke="${c}"/>`;
const lines=(ss,x,y,size=27,color=C.muted,step=44)=>ss.map((s,i)=>tx(s,x,y+step*i,size,color)).join('');
const util=(s,x,y,size=17,color=C.muted,extra='')=>tx(s,x,y,size,color,`font-family="Bahnschrift,sans-serif" letter-spacing="2" ${extra}`);
const sizes={};
async function def(id,file){const b=await fs.readFile(file);sizes[id]=await sharp(b).metadata();return `<image id="${id}" width="${sizes[id].width}" height="${sizes[id].height}" href="data:image/png;base64,${b.toString('base64')}"/>`;}
const place=(id,x,y,w,h)=>`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${sizes[id].width} ${sizes[id].height}" preserveAspectRatio="xMidYMid meet"><use href="#${id}"/></svg>`;
const crop=(id,x,y,w,h,roi)=>`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${roi.join(' ')}" preserveAspectRatio="xMidYMid slice" overflow="hidden"><use href="#${id}"/></svg>`;
const opening=(height,defs)=>`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="${height}" viewBox="0 0 1080 ${height}"><defs>${defs}<linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#08090a" stop-opacity=".82"/><stop offset=".38" stop-color="#08090a" stop-opacity="0"/><stop offset=".77" stop-color="#08090a" stop-opacity="0"/><stop offset="1" stop-color="#08090a" stop-opacity=".7"/></linearGradient></defs><g font-family="Microsoft YaHei,sans-serif">`;
const end='</g></svg>';
const brandDef=await def('brand',root+'/assets/logo-direction-01/png/moverno-primary-wordmark-reverse@4x.png');
const gateDef=await def('gate',root+'/assets/logo-direction-01/png/moverno-standalone-emblem-reverse@4x.png');
const brandCrop={
 '01':[[.760,.075,.16,.19],[.095,.565,.15,.19]],
 '02':[[1100/1448,65/1086,235/1448,188/1086],[143/1448,630/1086,198/1448,159/1086]],
 '03':[[1090/1448,65/1086,230/1448,185/1086],[133/1448,702/1086,220/1448,176/1086]],
 '04':[[1090/1448,70/1086,230/1448,185/1086],[128/1448,718/1086,235/1448,188/1086]],
 '05':[[1090/1448,35/1086,230/1448,184/1086],[135/1448,770/1086,225/1448,181/1086]]
};
const reports=[];
for(const p of products){
 try{await fs.access(base+'/'+p.atlas);await fs.access(base+'/'+p.campaign);}catch{console.log('Pending assets: '+p.id);continue;}
 const defs=brandDef+gateDef+await def('master',base+'/'+p.sourceCopy)+await def('atlas',base+'/'+p.atlas)+await def('campaign',base+'/'+p.campaign);
 let cover=crop('campaign',0,0,1080,1350,[0,0,sizes.campaign.width,sizes.campaign.height])+rect(0,0,1080,1350,'url(#shade)');
 cover+=place('brand',44,32,330,78)+util('SS27 / '+p.id,1028,83,18,C.white,'text-anchor="end"');
 cover+=lines(p.headline,48,190,72,C.white,88);
 cover+=util(p.english,50,1215,24,C.white)+tx(p.name,50,1278,43,C.white,'font-weight="bold"');
 cover+=util('CONCEPT / MOVERNO',1028,1303,13,C.white,'text-anchor="end"');
 const socialSvg=opening(1350,defs)+cover+end;
 await fs.writeFile(base+`/editable/${p.id}-${p.slug}-social.svg`,socialSvg);
 await sharp(Buffer.from(socialSvg)).png().toFile(base+`/social/${p.id}-${p.slug}-cover.png`);
 let s=opening(H,defs)+rect(0,0,W,H,C.paper)+cover;
 s+=util('DESIGN '+p.id+' / ORIGINAL SILHOUETTE',48,1420)+tx(p.lead,48,1495,40,C.ink,'font-weight="bold"');
 s+=tx('保留原款比例与配色，让每处识别各有位置。',48,1555,26,C.muted);
 s+=place('master',0,1600,1080,720);
 p.features.forEach((f,i)=>{const x=48+i*338;s+=rule(x,2370,306)+tx(f,x,2425,31,C.ink,'font-weight="bold"');});
 s+=util('SOURCE DESIGN / 原款主图完整保留',48,2480,15);
 s+=rect(0,2530,1080,115,C.ink)+tx('近看，才看见不同。',48,2601,42,C.white,'font-weight="bold"')+util('DETAIL STUDY',1028,2600,16,C.gold,'text-anchor="end"');
 p.details.forEach((d,i)=>{const x=48+i*504;s+=crop('master',x,2690,480,470,d.roi)+tx(d.title,x,3220,34,C.ink,'font-weight="bold"')+lines(d.body,x,3276,27,C.muted,43);});
 s+=rect(0,3410,1080,300,C.ink)+place('gate',52,3460,91,155);
 s+=tx('让黑夜不必黯然，',197,3510,38,C.white)+tx('让差异不必喧哗。',197,3570,38,C.white);
 s+=util('Different But Excellent.',197,3650,23,C.gold);
 s+=tx('每一面，都有自己的表达。',48,3800,39,C.ink,'font-weight="bold"');
 const labels=['外侧 / OUTER','内侧 / INNER','正面 / FRONT','后跟 / REAR','俯视 / TOP','底板 / OUTSOLE'];
 const cw=sizes.atlas.width/3,ch=sizes.atlas.height/2;
 labels.forEach((label,i)=>{const col=i%3,row=Math.floor(i/3),x=48+col*338,y=3860+row*405;
  s+=crop('atlas',x,y,310,345,[col*cw+4,row*ch+4,cw-8,ch-8]);
  s+=tx(label,x+155,y+378,21,C.muted,'text-anchor="middle"');
 });
 s+=tx('新增角度与底板为概念延展，结构、底纹及标识需样鞋核对。',48,4727,23,C.muted);
 s+=rule(48,4784,984)+tx('把签名，留在恰好的位置。',48,4858,38,C.ink,'font-weight="bold"');
 brandCrop[p.id].forEach((r,i)=>{const roi=r.map((v,k)=>v*(k%2===0?sizes.atlas.width:sizes.atlas.height));s+=crop('atlas',48+i*504,4910,480,385,roi);});
 s+=tx('鞋舌字标',48,5358,32,C.ink,'font-weight="bold"')+tx('转身识别',552,5358,32,C.ink,'font-weight="bold"');
 s+=lines(p.brandNote,48,5422,27,C.muted,47);
 s+=rule(48,5536,984)+tx('色彩克制，风格不设限。',48,5605,34,C.ink,'font-weight="bold"');
 p.colors.forEach((c,i)=>{const x=48+i*338;s+=rect(x,5655,306,56,c)+tx(p.colorNames[i],x,5756,25);});
 s+=tx(p.styling[0],48,5842,32,C.ink,'font-weight="bold"')+tx(p.styling[1],48,5898,28,C.muted);
 s+=rect(0,5980,1080,340,C.ink)+place('brand',42,6010,267,63)+tx('选你的款，穿你的态度。',48,6148,38,C.white,'font-weight="bold"');
 s+=util('MOVE DARK. STAY SOFT.',48,6203,21,C.gold);
 s+=tx('概念渲染，非实物拍摄；材质、工艺及性能以后续样鞋验证为准。',48,6272,22,'#b7b3aa');
 s+=end;
 const poster=base+`/posters/${p.id}-${p.slug}-detail.png`,editable=base+`/editable/${p.id}-${p.slug}-detail.svg`;
 await fs.writeFile(editable,s);
 await sharp(Buffer.from(s),{limitInputPixels:false}).png({compressionLevel:7}).toFile(poster);
 await sharp(poster).resize({width:360}).png().toFile(base+`/previews/${p.id}-detail.png`);
 await sharp(base+`/social/${p.id}-${p.slug}-cover.png`).resize({width:432}).png().toFile(base+`/previews/${p.id}-cover.png`);
 const original=await fs.readFile(p.source),archived=await fs.readFile(base+'/'+p.sourceCopy);
 const report={id:p.id,poster,editable,width:W,height:H,social:[1080,1350],atlasNative:[sizes.atlas.width,sizes.atlas.height],campaignNative:[sizes.campaign.width,sizes.campaign.height],originalUnchanged:original.equals(archived),sourceSHA256:crypto.createHash('sha256').update(original).digest('hex'),hasMission:s.includes('让黑夜不必黯然，')&&s.includes('让差异不必喧哗。'),hasConceptDisclaimer:s.includes('概念渲染，非实物拍摄'),noExternalImages:!s.includes('href="http')};
 reports.push(report);console.log(JSON.stringify(report));
}
await fs.writeFile(base+'/render-batch01.json',JSON.stringify(reports,null,2));
if(reports.length!==5) process.exit(0);
const cards=products.map(p=>`<article id="shoe-${p.id}"><header><span>${p.id} / ${p.english}</span><h2>${p.name}</h2><p>${p.lead}</p></header><a class="cover" href="social/${p.id}-${p.slug}-cover.png" target="_blank"><img src="previews/${p.id}-cover.png" alt="${p.name}上脚概念封面"></a><nav><a href="posters/${p.id}-${p.slug}-detail.png" target="_blank">详情长图 ↗</a><a href="views/${p.id}-${p.slug}-six-views.png" target="_blank">六角度 ↗</a><a href="editable/${p.id}-${p.slug}-detail.svg" download>可编辑 SVG ↓</a></nav><details><summary>展开详情预览</summary><img class="long" loading="lazy" src="previews/${p.id}-detail.png" alt="${p.name}完整详情"></details></article>`).join('');
const queue=data.products.slice(5).map(p=>`<li><span>${p.id}</span>${p.name}<small>源图已核对 · 待下一批制作</small></li>`).join('');
const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOVERNO · 第一批 5 款详情审核</title><style>*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#151619;color:#eeece7;font-family:"Microsoft YaHei",sans-serif}a{color:inherit}a:focus-visible,summary:focus-visible{outline:3px solid #a59a85;outline-offset:6px}.intro{padding:64px 5vw 42px;max-width:1560px;margin:auto}.intro small{letter-spacing:3px;color:#a59a85}.intro h1{font-size:clamp(32px,4.7vw,68px);line-height:1.24;max-width:920px;margin:30px 0}.intro p{max-width:800px;color:#bbb7ae;line-height:1.9}.index{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}.index a{border:1px solid #55534e;text-decoration:none;padding:10px 15px}.grid{max-width:1560px;padding:0 5vw;margin:0 auto;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:44px 26px}.grid article{min-width:0;background:#242527;padding-bottom:20px;scroll-margin-top:18px}.grid article header{padding:24px 22px 16px;min-height:157px}.grid header span{color:#b6ab95;font-size:12px;letter-spacing:1.5px}.grid h2{font-size:25px;margin:13px 0}.grid header p{margin:0;color:#b9b7b0;font-size:14px;line-height:1.6}.cover img,.long{display:block;width:100%;height:auto}.grid nav{display:flex;gap:16px;padding:22px;flex-wrap:wrap;font-size:13px}.grid nav a{text-decoration-thickness:1px;text-underline-offset:5px}summary{cursor:pointer;margin:0 22px 20px;font-size:14px}.queue{max-width:1560px;padding:64px 5vw 70px;margin:auto}.queue h2{font-size:26px}.queue ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 34px}.queue li{border-bottom:1px solid #3f403e;padding:17px 0;font-size:16px}.queue li span{margin-right:20px;color:#a59a85}.queue li small{display:block;color:#94948f;margin:7px 0 0 43px}.foot{max-width:1560px;padding:0 5vw 60px;margin:auto;color:#aaa79e;font-size:14px;line-height:1.9}.foot a{margin-right:16px}@media(max-width:1120px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.intro{padding:34px 20px}.grid{display:block;padding:0 20px}.grid article{margin-bottom:30px}.queue{padding:28px 20px}.queue ul{display:block}.foot{padding:20px}.grid article header{min-height:0}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}</style></head><body><section class="intro"><small>MOVERNO / SS27 · BATCH 01 OF 03</small><h1>让黑夜不必黯然，<br>让差异不必喧哗。</h1><p>第一批 01–05 已完成：每款包含上脚氛围图、详情长图、原款局部、六角度与新增品牌细节。编号对应本次 15 张上传顺序。点击下方款号快速定位；展开可查看完整详情。</p><p>概念审核资料，非实物拍摄。原款完整保留；底板及隐藏视角为概念延展，需后续样鞋核对。未公开发布。</p><nav class="index">${products.map(p=>`<a href="#shoe-${p.id}">${p.id} ${p.name}</a>`).join('')}</nav></section><main class="grid">${cards}</main><section class="queue"><h2>下一批款式 · 已归档源图</h2><p>以下 10 款尚未生成详情图，不计入本批交付。</p><ul>${queue}</ul></section><footer class="foot">详情长图 1080 × 6320 px · 社媒封面 1080 × 1350 px · 自包含可编辑 SVG<br><a href="research/visual-research.md">官方视觉研究与来源</a><a href="manifest-batch01.json">提示词与图像来源</a><a href="products.json">15 款编号映射</a><a href="render-batch01.json">导出检查</a></footer></body></html>`;
await fs.writeFile(base+'/index.html',html);
const overviewW=1700,overviewH=625;
const header=Buffer.from(`<svg width="${overviewW}" height="${overviewH}"><rect width="100%" height="100%" fill="#151619"/><text x="28" y="50" fill="#eeece7" font-family="Microsoft YaHei" font-size="31">MOVERNO · 第一批 5 款产品详情</text><text x="28" y="88" fill="#a59a85" font-family="Microsoft YaHei" font-size="19">上脚氛围 / 原款细节 / 六角度 / 舌标与后跟 / 品牌故事</text>${products.map((p,i)=>`<text x="${28+i*332}" y="575" fill="#eeece7" font-family="Microsoft YaHei" font-size="23">${p.id} ${p.name}</text>`).join('')}<text x="28" y="611" fill="#9c9991" font-family="Microsoft YaHei" font-size="15">概念渲染，非实物拍摄 · 新增视角需样鞋核对 · 其余 10 款待分批制作</text></svg>`);
const thumb=await Promise.all(products.map(async(p,i)=>({input:await sharp(base+`/social/${p.id}-${p.slug}-cover.png`).resize(316,395).png().toBuffer(),left:28+i*332,top:125})));
await sharp(header).composite(thumb).png().toFile(base+'/overview-batch01.png');
const qa=[];
for(const p of products){for(const [name,y,h] of [['brand',4810,720],['source',2580,770]]){qa.push({input:await sharp(base+`/posters/${p.id}-${p.slug}-detail.png`).extract({left:0,top:y,width:1080,height:h}).resize(324).png().toBuffer(),left:20+(Number(p.id)-1)*340,top:name==='brand'?40:300});}}
await sharp({create:{width:1720,height:570,channels:3,background:'#eeece7'}}).composite(qa).png().toFile(base+'/qa-detail-contact.png');
console.log('Complete batch 01: '+base+'/index.html');
