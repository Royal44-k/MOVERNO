import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.dirname(fileURLToPath(import.meta.url));
const readJSON=async p=>JSON.parse((await fs.readFile(p,'utf8')).replace(/^\uFEFF/,''));
const hash=async p=>crypto.createHash('sha256').update(await fs.readFile(p)).digest('hex').toUpperCase();
const checks=[];
const check=(name,pass,detail)=>checks.push({name,pass,detail});
const selected=await readJSON(path.join(root,'selected-assets.json'));
const prompts=await readJSON(path.join(root,'prompts.json'));
check('six unique expansion styles R07-R12',JSON.stringify(selected.map(p=>p.id))===JSON.stringify(['R07','R08','R09','R10','R11','R12']));
check('six distinct visible descriptions',new Set(selected.map(p=>p.statement)).size===6);
check('six individual reference sources',new Set(prompts.map(p=>p.refFile)).size===6);
check('no rejected or prior shoe image used as generation input',prompts.every(p=>p.inputs.every(s=>!/(footwear-new-six-round1|footwear-reference-reset-round2|footwear-feminine-unisex-round1)/.test(s))));
check('each prompt uses exact three supplied brand proof assets',prompts.every(p=>p.inputs.length===4 && p.inputs.slice(1).every(s=>/(moverno-standalone-emblem-proof|moverno-primary-wordmark-proof|moverno-motion-contour-v2-gilded-preview)\.png$/.test(s))));
for(const p of selected){
  const full=path.join(root,p.master),m=await sharp(full).metadata();
  check(p.id+' master dimensions',m.width===1536 && m.height===1024,`${m.width}×${m.height}`);
  check(p.id+' copy equals ImageGen original',await hash(full)===await hash(p.original));
  const bm=await sharp(path.join(root,'boards',p.id+'-board.png')).metadata();
  check(p.id+' 4:5 board',bm.width===1600 && bm.height===2000);
  const svg=await fs.readFile(path.join(root,'editable',p.id+'-board.svg'),'utf8');
  check(p.id+' master embedded byte-identical',svg.includes((await fs.readFile(full)).toString('base64')));
  check(p.id+' identity and caveat',svg.includes(p.name) && svg.includes('待审核概念') && svg.includes('官方参考'));
  check(p.id+' three image elements: wordmark, emblem plus master and source',([...svg.matchAll(/<image /g)].length)===4);
  const rm=await sharp(path.join(root,p.refFile)).metadata();
  check(p.id+' reference decodes',rm.width>100 && rm.height>100);
  check(p.id+' awaiting review',p.status==='概念待审核');
  for (const input of p.inputs) {let yes=true;try{await fs.access(input);}catch{yes=false;}check(p.id+' generation input exists '+path.basename(input),yes);}
}
for(const [file,w,h] of [['overview-R07-R12.png',3300,2400],['overview-R01-R12.png',4400,3070],['overview-R01-R12-preview.jpg',2200,1535]]){
  const m=await sharp(path.join(root,file)).metadata();check(file+' dimensions',m.width===w && m.height===h);
}
const combined=await fs.readFile(path.join(root,'editable/overview-R01-R12.svg'),'utf8');
const prev=await readJSON(path.join(root,'../footwear-reference-reset-round2/selected-assets.json'));
for(const p of prev)check('combined preserves prior '+p.id,combined.includes((await fs.readFile(path.join(root,'../footwear-reference-reset-round2',p.master))).toString('base64')) && combined.includes(p.name));
const html=await fs.readFile(path.join(root,'index.html'),'utf8');
const links=[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]);
const local=links.filter(u=>!u.startsWith('data:') && !u.startsWith('#') && !/^https?:/.test(u));
for(const ref of [...new Set(local)].filter(r=>r!=='verification.json')) {
  let exists=true;try{await fs.access(path.join(root,ref));}catch{exists=false;}
  check('gallery local link '+ref,exists);
}
check('no remote image/script dependencies',![...html.matchAll(/<(?:img|script)[^>]+src="([^"]+)"/g)].some(m=>/^https?:/.test(m[1])));
check('six linked official credits',new Set(links.filter(r=>/^https?:/.test(r))).size===6);
check('no automatic previous approval',html.includes('不等于自动采纳前批') && html.includes('均保留待审状态'));
const oldRoot=path.join(root,'../footwear-feminine-unisex-round1');
for(const old of await readJSON(path.join(oldRoot,'protected-baseline-r3-b02.json')))check('protected '+path.basename(old.Path),await hash(old.Path)===old.Hash.toUpperCase());
for(const old of await readJSON(path.join(root,'../footwear-reference-reset-round2/rejected-N-original-hashes.json')))check('rejected N preserved '+path.basename(old.Path),await hash(old.Path)===old.Hash.toUpperCase());
for(const old of await readJSON(path.join(root,'protected-R01-R06.json')))check('prior R preserved '+path.basename(old.Path),await hash(old.Path)===old.Hash.toUpperCase());
for(const [file,expected] of [['F02-R3-EXACT.png','F624374A45910821C730EB1F341F2F217A33FEB095B0B97699BF983A8399CF74'],['F06-v1-EXACT.png','69CC0FD8BD57E65247E1765F3BA552001D6B71FD8B20C6A45A72271D7CC17C27']])check('historical original '+file,await hash(path.join(oldRoot,'batch02-redesign/retained',file))===expected);
const result={checkedAt:new Date().toISOString(),checks:checks.length,passed:checks.filter(c=>c.pass).length,failed:checks.filter(c=>!c.pass),note:'Mechanical artifact checks only; not user aesthetic acceptance, exact production-logo matching, material performance or multi-view construction validation.',details:checks};
await fs.writeFile(path.join(root,'verification.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({checks:result.checks,passed:result.passed,failed:result.failed},null,2));
if(result.failed.length)process.exitCode=1;
