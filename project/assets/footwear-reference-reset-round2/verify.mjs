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
check('six unique styles',selected.length===6 && new Set(selected.map(p=>p.id)).size===6);
check('six unique descriptions',new Set(selected.map(p=>p.statement)).size===6);
check('reference mapping covers all 11 uploads',JSON.stringify([...new Set(selected.flatMap(p=>p.refs))].sort((a,b)=>a-b))===JSON.stringify(Array.from({length:11},(_,i)=>i+1)));
check('R05 selected local correction',selected.find(p=>p.id==='R05').master==='masters/R05-v2.png');
check('rejected N masters not used as prompt inputs',prompts.every(p=>p.inputs.every(s=>!s.includes('footwear-new-six-round1'))));
for(const p of selected){
  const full=path.join(root,p.master),m=await sharp(full).metadata();
  check(p.id+' master dimensions',m.width===1536 && m.height===1024,`${m.width}×${m.height}`);
  check(p.id+' copy equals ImageGen original',await hash(full)===await hash(p.original));
  const bm=await sharp(path.join(root,'boards',p.id+'-board.png')).metadata();
  check(p.id+' 4:5 board',bm.width===1600 && bm.height===2000);
  const svg=await fs.readFile(path.join(root,'editable',p.id+'-board.svg'),'utf8');
  check(p.id+' master embedded unchanged',svg.includes((await fs.readFile(full)).toString('base64')));
  check(p.id+' identity and caveat',svg.includes(p.name) && svg.includes('待审核概念') && svg.includes('原参考'));
  for(const ref of p.refs) check(p.id+' original reference '+ref+' embedded unchanged',svg.includes((await fs.readFile(path.join(root,'references',`user-${String(ref).padStart(2,'0')}.png`))).toString('base64')));
  check(p.id+' awaiting review',p.status==='概念待审核');
}
const refs=await readJSON(path.join(root,'user-reference-index.json'));
for(const ref of refs)check('user reference '+ref.id+' exact copy',await hash(ref.source)===await hash(path.join(root,ref.local)));
const ov=await sharp(path.join(root,'overview-R01-R06.png')).metadata();
check('overview dimensions',ov.width===3300 && ov.height===2400);
const html=await fs.readFile(path.join(root,'index.html'),'utf8');
const links=[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]).filter(u=>!u.startsWith('data:') && !u.startsWith('#'));
for(const ref of [...new Set(links)].filter(r=>r!=='verification.json')) {
  let exists=true;try{await fs.access(path.join(root,ref));}catch{exists=false;}
  check('gallery link '+ref,exists);
}
check('no remote gallery dependencies',!links.some(r=>/^https?:/.test(r)));
const oldRoot=path.join(root,'../footwear-feminine-unisex-round1');
for(const old of await readJSON(path.join(oldRoot,'protected-baseline-r3-b02.json')))check('protected '+path.basename(old.Path),await hash(old.Path)===old.Hash.toUpperCase());
for(const old of await readJSON(path.join(root,'rejected-N-original-hashes.json')))check('rejected N preserved '+path.basename(old.Path),await hash(old.Path)===old.Hash.toUpperCase());
for(const [file,expected] of [['F02-R3-EXACT.png','F624374A45910821C730EB1F341F2F217A33FEB095B0B97699BF983A8399CF74'],['F06-v1-EXACT.png','69CC0FD8BD57E65247E1765F3BA552001D6B71FD8B20C6A45A72271D7CC17C27']])check('historical original '+file,await hash(path.join(oldRoot,'batch02-redesign/retained',file))===expected);
const result={checkedAt:new Date().toISOString(),checks:checks.length,passed:checks.filter(c=>c.pass).length,failed:checks.filter(c=>!c.pass),note:'Mechanical artifact checks only; not user aesthetic acceptance, production trademark matching, material performance or a multi-view construction audit.',details:checks};
await fs.writeFile(path.join(root,'verification.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({checks:result.checks,passed:result.passed,failed:result.failed},null,2));
if(result.failed.length)process.exitCode=1;
