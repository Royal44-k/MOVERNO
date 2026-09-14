import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const base=path.resolve(process.argv[2]||'D:/Codex-chat/night-veil-brand/assets/ss27-footwear-product-details-round1');
const data=JSON.parse(await fs.readFile(path.join(base,'products.json'),'utf8'));
const escape=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const records=[],tiles=[];
for(const [i,p] of data.products.entries()){
  const png=await fs.readFile(p.poster),meta=await sharp(png).metadata();
  const svg=await fs.readFile(path.join(base,'editable',`${p.id}-${p.slug}-detail.svg`),'utf8');
  const master=await fs.readFile(p.source),atlas=await fs.readFile(p.atlas);
  const am=await sharp(atlas).metadata();
  const checks={correctDimensions:meta.width===1080&&meta.height===5080,masterEmbeddedVerbatim:svg.includes(master.toString('base64')),atlasEmbeddedVerbatim:svg.includes(atlas.toString('base64')),missionPresent:svg.includes('让黑夜不必黯然，')&&svg.includes('让差异不必喧哗。'),conceptDisclaimerPresent:svg.includes('概念渲染，非实物拍摄'),headlinePresent:p.headline.every(t=>svg.includes(t)),noExternalRasterDependencies:!svg.includes('href="http'),atlasAspectAndMinimumSize:Math.abs(am.width/am.height-4/3)<.01&&am.width>=1440&&am.height>=1080};
  records.push({id:p.id,name:p.name,dimensions:[meta.width,meta.height],atlasDimensions:[am.width,am.height],posterBytes:png.length,posterSha256:crypto.createHash('sha256').update(png).digest('hex'),sourceSha256:crypto.createHash('sha256').update(master).digest('hex'),checks,pass:Object.values(checks).every(Boolean)});
  tiles.push({input:await sharp(png).extract({left:48,top:3510,width:984,height:620}).resize(600,378).png().toBuffer(),left:24+(i%2)*624,top:86+Math.floor(i/2)*424});
}
const sheet=Buffer.from(`<svg width="1272" height="2230"><rect width="1272" height="2230" fill="#111215"/><g font-family="Microsoft YaHei" fill="#eee9df"><text x="24" y="46" font-size="28">MOVERNO · 10 款标识细节核对</text>${data.products.map((p,i)=>`<text x="${24+i%2*624}" y="${73+Math.floor(i/2)*424}" font-size="17">${escape(p.id+' '+p.name)}</text>`).join('')}</g></svg>`);
await sharp(sheet).composite(tiles).png().toFile(path.join(base,'qa-branding-contact.png'));
await fs.writeFile(path.join(base,'qa-report.json'),JSON.stringify({stage:'asset-and-layout-check',passed:records.every(r=>r.pass),count:records.length,records,note:'Technical file checks plus separately performed visual review; not factory or manufacturing approval.'},null,2));
console.log(JSON.stringify({count:records.length,passed:records.every(r=>r.pass),failed:records.filter(r=>!r.pass)},null,2));
