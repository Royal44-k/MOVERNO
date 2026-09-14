import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),sharp=require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.dirname(fileURLToPath(import.meta.url));
const readJSON=async f=>JSON.parse((await fs.readFile(f,'utf8')).replace(/^\uFEFF/,''));
const hash=async f=>crypto.createHash('sha256').update(await fs.readFile(f)).digest('hex').toUpperCase();
const checks=[],check=(name,pass,detail)=>checks.push({name,pass,detail});
const items=await readJSON(path.join(root,'selected-assets.json'));
const prompts=await readJSON(path.join(root,'prompts.json'));
const revisions=await readJSON(path.join(root,'revision-prompts.json'));
check('eight D styles',JSON.stringify(items.map(x=>x.id))===JSON.stringify(Array.from({length:8},(_,i)=>'D'+String(i+1).padStart(2,'0'))));
check('eight different descriptions',new Set(items.map(x=>x.statement)).size===8);
check('all eleven references covered',JSON.stringify([...new Set(items.flatMap(x=>x.refs))].sort((a,b)=>a-b))===JSON.stringify(Array.from({length:11},(_,i)=>i+1)));
check('different high-top references',JSON.stringify(items[3].refs)==='[6]' && JSON.stringify(items[4].refs)==='[7]');
check('different sneaker references',JSON.stringify(items[5].refs)==='[8]' && JSON.stringify(items[6].refs)==='[9]');
check('no previous generated shoe used as initial input',prompts.every(p=>p.inputs.every(s=>!/(footwear-new-six-round1|footwear-reference-expansion-round3|footwear-feminine-unisex-round1|footwear-reference-reset-round2)/.test(s))));
check('valid tool reference count',prompts.concat(revisions).every(p=>p.inputs.length<=5));
for(const p of items){
  const f=path.join(root,p.master),m=await sharp(f).metadata();
  check(p.id+' 1536x1024 master',m.width===1536&&m.height===1024);
  check(p.id+' unchanged ImageGen output copy',await hash(f)===await hash(p.original));
  const bm=await sharp(path.join(root,'boards',p.id+'-board.png')).metadata();
  check(p.id+' 1600x2000 board',bm.width===1600&&bm.height===2000);
  const s=await fs.readFile(path.join(root,'editable',p.id+'-board.svg'),'utf8');
  check(p.id+' master bytes embedded',s.includes((await fs.readFile(f)).toString('base64')));
  check(p.id+' name/caveat/reference label',s.includes(p.name)&&s.includes('待审概念')&&s.includes('鞋型直接依据'));
  for(const n of p.refs)check(p.id+' direct source '+n+' embedded',s.includes((await fs.readFile(path.join(root,'references',`user-${String(n).padStart(2,'0')}.png`))).toString('base64')));
  check(p.id+' pending user review',p.status==='概念待审核');
  check(p.id+' brand source roles specified',p.prompt.includes('EMBLEM')&&p.prompt.includes('WORDMARK'));
  for(const input of p.inputs){let ok=true;try{await fs.access(input);}catch{ok=false;}check(p.id+' input exists '+path.basename(input),ok);}
}
for(const r of await readJSON(path.join(root,'user-reference-index.json')))check('original upload archive '+r.id+' exact copy',await hash(path.join(root,r.local))===r.sha256 && await hash(r.source)===r.sha256);
for(const [n,w,h] of [['overview-D01-D08.png',4400,2400],['overview-D01-D08-preview.jpg',2200,1200]]){const m=await sharp(path.join(root,n)).metadata();check(n+' dimensions',m.width===w&&m.height===h);}
const html=await fs.readFile(path.join(root,'index.html'),'utf8');
const urls=[...new Set([...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]))].filter(x=>!x.startsWith('data:')&&!x.startsWith('#'));
check('gallery has no remote asset dependency',urls.every(x=>!/^https?:/.test(x)));
for(const u of urls.filter(x=>x!=='verification.json')){let ok=true;try{await fs.access(path.join(root,u));}catch{ok=false;}check('gallery '+u,ok);}
for(const r of await readJSON(path.join(root,'protected-R01-R12.json')))check('prior '+r.id+' preserved',await hash(r.Path)===r.Hash);
const result={checkedAt:new Date().toISOString(),checks:checks.length,passed:checks.filter(x=>x.pass).length,failed:checks.filter(x=>!x.pass),note:'Mechanical delivery checks only; not aesthetic approval, exact production-brand calibration, multi-view consistency or material performance.',details:checks};
await fs.writeFile(path.join(root,'verification.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({checks:result.checks,passed:result.passed,failed:result.failed},null,2));if(result.failed.length)process.exitCode=1;
