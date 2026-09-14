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
const sources=await readJSON(path.join(root,'generation-index.json'));
check('six unique styles',selected.length===6 && new Set(selected.map(p=>p.id)).size===6);
check('six distinct descriptions',new Set(selected.map(p=>p.statement)).size===6);
check('N04 and N06 selected revisions',selected[3].master==='masters/N04-v2.png' && selected[5].master==='masters/N06-v2.png');
for(const p of selected){
  const full=path.join(root,p.master),m=await sharp(full).metadata();
  check(p.id+' master readable',m.width===1536 && m.height===1024,`${m.width}×${m.height}`);
  const src=sources.find(s=>s.id===p.id);
  check(p.id+' copy equals original',await hash(full)===await hash(src.original));
  const board=path.join(root,'boards',p.id+'-board.png'),bm=await sharp(board).metadata();
  check(p.id+' 4:5 board',bm.width===1600 && bm.height===2000);
  const svg=await fs.readFile(path.join(root,'editable',p.id+'-board.svg'),'utf8');
  const data=(await fs.readFile(full)).toString('base64');
  check(p.id+' original image embedded unchanged',svg.includes(data));
  check(p.id+' identity and caveat in board',svg.includes(p.name) && svg.includes('概念待审'));
  check(p.id+' awaiting user review',p.status==='新概念待审核');
}
const ov=await sharp(path.join(root,'overview-N01-N06.png')).metadata();
check('overview dimensions',ov.width===3300 && ov.height===2400);
const html=await fs.readFile(path.join(root,'index.html'),'utf8');
const refs=[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]).filter(u=>!u.startsWith('data:') && !u.startsWith('#'));
for(const ref of [...new Set(refs)].filter(r=>r!=='verification.json')) {
  let exists=true;try{await fs.access(path.join(root,ref));}catch{exists=false;}
  check('gallery link '+ref,exists);
}
check('no remote gallery dependencies',!refs.some(r=>/^https?:/.test(r)));
const oldRoot=path.join(root,'../footwear-feminine-unisex-round1');
const baseline=await readJSON(path.join(oldRoot,'protected-baseline-r3-b02.json'));
for(const old of baseline)check('protected '+path.basename(old.Path),await hash(old.Path)===old.Hash.toUpperCase());
for(const [file,expected] of [['F02-R3-EXACT.png','F624374A45910821C730EB1F341F2F217A33FEB095B0B97699BF983A8399CF74'],['F06-v1-EXACT.png','69CC0FD8BD57E65247E1765F3BA552001D6B71FD8B20C6A45A72271D7CC17C27']])check('retained original '+file,await hash(path.join(oldRoot,'batch02-redesign/retained',file))===expected);
const result={checkedAt:new Date().toISOString(),checks:checks.length,passed:checks.filter(c=>c.pass).length,failed:checks.filter(c=>!c.pass),note:'Mechanical checks only. Aesthetic acceptance, exact production logo application and sample performance remain unverified.',details:checks};
await fs.writeFile(path.join(root,'verification.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({checks:result.checks,passed:result.passed,failed:result.failed},null,2));
if(result.failed.length)process.exitCode=1;
