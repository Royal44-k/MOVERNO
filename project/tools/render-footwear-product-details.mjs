import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const base = path.resolve(process.argv[2] || 'D:/Codex-chat/night-veil-brand/assets/ss27-footwear-product-details-round1');
const only = process.argv[3];
const data = JSON.parse(await fs.readFile(path.join(base,'products.json'),'utf8'));
const branding = JSON.parse(await fs.readFile(path.join(base,'branding.json'),'utf8'));
const selected = only ? data.products.filter(p=>p.id===only) : data.products;
const root = 'D:/Codex-chat/night-veil-brand';
const brandPath = root+'/assets/logo-direction-01/png/moverno-primary-wordmark-reverse@4x.png';
const emblemPath = root+'/assets/logo-direction-01/png/moverno-standalone-emblem-reverse@4x.png';
const patternPath = root+'/assets/ss27-footwear-side-pattern-round1/references/03-approved-signature-pattern.png';
const esc = s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const ink='#111215', paper='#f5f3ef', pale='#ddd7ca', gold='#9b8a65', muted='#73716c';
const W=1080,H=5080;
function text(s,x,y,size=24,fill=ink,extra='') {return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(s)}</text>`;}
function rect(x,y,w,h,fill,extra=''){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;}
function line(x,y,w,fill='#d2cec5'){return `<path d="M${x} ${y}h${w}" stroke="${fill}" stroke-width="1"/>`;}
function wrap(s,max=19){const a=Array.from(s),out=[];while(a.length)out.push(a.splice(0,max).join(''));return out;}
function lines(ss,x,y,size=24,fill=ink,step=38){return ss.map((s,i)=>text(s,x,y+i*step,size,fill)).join('');}
function place(id,x,y,w,h){return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${sizes[id].width} ${sizes[id].height}" preserveAspectRatio="xMidYMid meet"><use href="#${id}"/></svg>`;}
function crop(id,x,y,w,h,roi){return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${roi.join(' ')}" preserveAspectRatio="xMidYMid slice" overflow="hidden"><use href="#${id}"/></svg>`;}
const sizes={};
async function def(id,file){const bytes=await fs.readFile(file);sizes[id]=await sharp(bytes).metadata();return `<image id="${id}" width="${sizes[id].width}" height="${sizes[id].height}" href="data:image/png;base64,${bytes.toString('base64')}"/>`;}
const sharedDefs = await def('brand',brandPath)+await def('gate',emblemPath)+await def('pattern',patternPath);
const rendered=[];
for(const p of selected){
  try { await fs.access(p.atlas); } catch { console.log(JSON.stringify({id:p.id,status:'waiting-for-six-views'})); continue; }
  const defs=sharedDefs+await def('master',p.source)+await def('atlas',p.atlas);
  let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs}</defs><g font-family="Microsoft YaHei, sans-serif">`;
  s+=rect(0,0,W,H,paper)+rect(0,0,W,380,ink);
  s+=crop('pattern',740,0,340,380,[300,160,570,640])+rect(740,0,340,380,ink,'opacity="0.42"');
  s+=place('brand',53,35,326,77)+text('SS27  /  FOOTWEAR',680,72,16,pale,'font-family="Bahnschrift, sans-serif" letter-spacing="2" text-anchor="end"');
  s+=text('MOVERNO  墨维诺',64,139,18,pale,'letter-spacing="2"');
  s+=lines(p.headline,61,220,66,'#f2efe8',80);
  s+=text(p.kicker,64,353,17,gold,'font-family="Bahnschrift, sans-serif" letter-spacing="2"');
  s+=place('master',0,380,1080,720);
  s+=text(p.name,64,1170,40,ink,'font-weight="bold"');
  s+=text('DESIGN '+p.id,1016,1168,18,muted,'font-family="Bahnschrift, sans-serif" letter-spacing="1.6" text-anchor="end"');
  s+=lines(p.intro,64,1240,34,muted,50);
  p.features.forEach((f,i)=>{const x=64+i*328;s+=rect(x,1341,3,26,gold)+text(f,x+18,1363,28,ink);});
  s+=line(64,1407,952);
  s+=text('看见每一面',64,1490,36,ink,'font-weight="bold"')+text('SIX PERSPECTIVES',1016,1487,15,muted,'font-family="Bahnschrift, sans-serif" letter-spacing="1.6" text-anchor="end"');
  const labels=['外侧  /  OUTER','内侧  /  INNER','正面  /  FRONT','后跟  /  REAR','俯视  /  TOP','底面  /  SOLE'];
  const cw=sizes.atlas.width/3,ch=sizes.atlas.height/2;
  labels.forEach((label,i)=>{const col=i%3,row=Math.floor(i/3),x=64+col*328,y=1525+row*405;
    s+=crop('atlas',x,y,296,333,[col*cw,row*ch,cw,ch]);
    s+=text(label,x+148,y+370,22,muted,'text-anchor="middle"');
  });
  s+=text('新增视角为概念补充，结构与底纹待样鞋核对。',64,2371,22,muted);
  s+=rect(0,2420,W,250,ink)+crop('pattern',755,2420,325,250,[500,250,650,500])+rect(755,2420,325,250,ink,'opacity="0.32"');
  s+=place('gate',67,2473,67,113)+text('让黑夜不必黯然，',178,2500,31,'#f2efe8')+text('让差异不必喧哗。',178,2550,31,'#f2efe8');
  s+=text('Different But Excellent.',178,2610,24,gold,'font-family="Bahnschrift, sans-serif"');
  s+=text('近一点，看见不同',64,2743,36,ink,'font-weight="bold"')+text('SIGNATURE DETAILS',1016,2740,15,muted,'font-family="Bahnschrift, sans-serif" letter-spacing="1.4" text-anchor="end"');
  p.details.forEach((d,i)=>{const x=64+i*496;s+=crop('master',x,2790,456,460,d.roi);s+=text(d.title,x,3312,32,ink,'font-weight="bold"');s+=lines(wrap(d.body,16),x,3360,28,muted,42);});
  s+=line(64,3484,952)+text(p.id==='04'?'转身与落脚，延续层次':'转身与落脚，都有签名',64,3552,36,ink,'font-weight="bold"');
  const b = branding.products.find(b=>b.id===p.id);
  b.details.forEach((d,i)=>{const x=64+i*496;const roi=d.roi.map((v,k)=>v*(k%2===0?sizes.atlas.width:sizes.atlas.height));s+=crop('atlas',x,3590,456,340,roi);s+=text(d.title,x,3990,32,ink,'font-weight="bold"');s+=lines(wrap(d.body,16),x,4040,28,muted,42);});
  s+='<g transform="translate(0,680)">';
  s+=line(64,3484,952)+text('颜色有分寸，层次有个性',64,3552,33,ink,'font-weight="bold"');
  p.colors.forEach((color,i)=>{const x=64+i*328;s+=rect(x,3600,296,64,color);s+=text(p.colorNames[i],x,3704,28,ink);});
  s+=text('视觉材质与色彩方向，以后续实物样鞋确认为准。',64,3763,22,muted);
  s+=text('把它放进你的日常',64,3850,33,ink,'font-weight="bold"');
  s+=text(p.styling[0],64,3908,32,ink)+text(p.styling[1],64,3953,28,muted);
  s+=rect(0,4020,W,380,ink)+place('brand',52,4045,270,64);
  s+=text('收藏这一款，留下你的风格。',64,4170,36,'#f2efe8','font-weight="bold"');
  s+=text('SS27  /  设计预览',64,4230,20,pale,'letter-spacing="1"');
  s+=text('Different But Excellent.',64,4295,24,gold,'font-family="Bahnschrift, sans-serif"');
  s+=text('概念渲染，非实物拍摄；新增视角为设计补充，最终以样鞋为准。',64,4360,21,'#aaa69e');
  s+='</g></g></svg>';
  const svgPath=path.join(base,'editable',`${p.id}-${p.slug}-detail.svg`);
  await fs.writeFile(svgPath,s);
  await sharp(Buffer.from(s),{limitInputPixels:false}).png({compressionLevel:7}).toFile(p.poster);
  await sharp(p.poster).resize({width:360}).png().toFile(path.join(base,'previews',`${p.id}-detail-preview.png`));
  const meta=await sharp(p.poster).metadata();
  rendered.push({id:p.id,poster:p.poster,svg:svgPath,width:meta.width,height:meta.height});
  console.log(JSON.stringify(rendered.at(-1)));
}
await fs.writeFile(path.join(base,only?`render-${only}.json`:'render-report.json'),JSON.stringify(rendered,null,2));
if(!only && rendered.length===data.products.length){
  const cards=data.products.map(p=>`<article><div class="meta"><span>${p.id}</span><h2>${esc(p.name)}</h2></div><a href="posters/${p.id}-${p.slug}-detail.png" target="_blank"><img loading="lazy" src="previews/${p.id}-detail-preview.png" alt="${esc(p.name)}产品详情长图"></a><nav><a href="posters/${p.id}-${p.slug}-detail.png" target="_blank">打开原尺寸 PNG</a><a href="editable/${p.id}-${p.slug}-detail.svg" download>可编辑 SVG</a><a href="views/${p.id}-${p.slug}-six-views.png" target="_blank">六面展示</a></nav></article>`).join('');
  const html=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOVERNO SS27 · 产品详情图审核</title><style>*{box-sizing:border-box}body{margin:0;background:#111215;color:#eee9df;font-family:"Microsoft YaHei",sans-serif}header{max-width:1560px;margin:auto;padding:64px 36px 42px}header small{color:#ad9a72;letter-spacing:3px}h1{font-size:40px;line-height:1.35;max-width:800px;margin:18px 0}header p{color:#b1ada5;line-height:1.9;max-width:840px}main{max-width:1560px;margin:auto;padding:0 36px 60px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:44px 28px}article{min-width:0;border-top:1px solid #4b463b;padding-top:18px}.meta{display:flex;align-items:baseline;gap:14px;min-height:62px}.meta span{color:#ad9a72;font-size:14px}h2{font-size:19px;line-height:1.5;margin:0 0 20px}article img{width:100%;height:auto;display:block}a{color:inherit;text-decoration:none}a:focus-visible{outline:3px solid #ad9a72;outline-offset:5px}nav{display:flex;gap:18px;flex-wrap:wrap;font-size:14px;padding-top:18px}nav a{text-decoration:underline;text-underline-offset:5px}footer{max-width:1560px;padding:0 36px 60px;margin:auto;color:#aaa59b;line-height:1.8}@media(max-width:1050px){main{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:640px){header{padding:36px 20px}h1{font-size:30px}main{display:block;padding:0 20px}article{margin-bottom:45px}.meta{min-height:0}footer{padding:30px 20px}}</style><header><small>MOVERNO / SS27</small><h1>让黑夜不必黯然，<br>让差异不必喧哗。</h1><p>10 款产品详情长图，每款包含主视觉、六面展示、局部特写、品牌理念和穿搭建议。沿用 Round 6 编号，第 3、5 款采用侧身纹样最新改版。点击图片打开原尺寸，文字与版式可在 SVG 中编辑。</p><p>Different But Excellent. · 概念展示，新增视角待样鞋核对。</p></header><main>${cards}</main><footer>本地审核资料，未公开发布。PNG：1080 × 4400 px。<br><a href="products.json">逐款文案与源图记录</a> · <a href="prompts.json">图像生成提示词</a></footer></html>`;
  await fs.writeFile(path.join(base,'index.html'),html.replace('1080 × 4400','1080 × '+H).replace('<a href="prompts.json">图像生成提示词</a>','<a href="manifest.json">最终提示词与版本记录</a>'));
  const thumbs=[];
  for(const p of data.products){const b=await sharp(p.poster).extract({left:0,top:0,width:1080,height:1420}).resize(288,379).png().toBuffer();thumbs.push({input:b,left:32+Number(p.id-1)%5*304,top:135+Math.floor(Number(p.id-1)/5)*418});}
  const overviewHeader=Buffer.from(`<svg width="1552" height="1000"><rect width="1552" height="1000" fill="#111215"/><text x="32" y="62" fill="#eee9df" font-family="Microsoft YaHei" font-size="34">MOVERNO SS27 · 产品详情图</text><text x="32" y="101" fill="#ad9a72" font-family="Microsoft YaHei" font-size="20">10 款独立长图  /  主视觉・六面展示・标识细节・品牌故事</text>${data.products.map((p,i)=>`<text x="${32+i%5*304}" y="${536+Math.floor(i/5)*418}" fill="#eee9df" font-family="Microsoft YaHei" font-size="18">${esc(p.id+'  '+p.name)}</text>`).join('')}</svg>`);
  await sharp(overviewHeader).composite(thumbs).png().toFile(path.join(base,'overview.png'));
}
