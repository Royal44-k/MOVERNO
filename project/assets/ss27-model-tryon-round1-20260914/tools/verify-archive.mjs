import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.resolve(process.argv[2]||path.join(import.meta.dirname,'..'));
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const file=f=>fs.readFileSync(path.join(root,f));
const manifest=JSON.parse(file('delivery-manifest.json'));
const map=JSON.parse(file('source-map.json'));
if(manifest.outputs.length!==36)throw new Error('Expected 36 final images');
const styles=new Map();for(const x of manifest.outputs){if(!fs.existsSync(path.join(root,x.file)))throw new Error('Missing final '+x.file);const p=file(x.file);if(p.readUInt32BE(16)!==1024||p.readUInt32BE(20)!==1536)throw new Error('Unexpected PNG dimensions');const a=styles.get(x.style)||[];a.push(x);styles.set(x.style,a);}
if(styles.size!==12||[...styles.values()].some(a=>a.length!==3||new Set(a.map(x=>x.model)).size!==3||new Set(a.map(x=>x.view)).size!==3))throw new Error('Model/style/angle coverage mismatch');
if(map.sourceFileCount!==67||map.files.length!==67)throw new Error('Source inventory mismatch');
const failures=[];for(const x of map.files){if(!fs.existsSync(path.join(root,x.archivedPath)))failures.push(x.archivedPath+' missing');else if(digest(file(x.archivedPath))!==x.archivedSHA256)failures.push(x.archivedPath+' archived hash');else if(x.sourceRelative.endsWith('.png')&&x.sourceSHA256!==x.archivedSHA256)failures.push(x.archivedPath+' image changed');}
for(const line of file('checksums.sha256').toString('utf8').trim().split(/\r?\n/)){const m=line.match(/^([a-f0-9]{64})  (.+)$/);if(!m||digest(file(m[2]))!==m[1])failures.push('Checksum '+line);}
const results={originalFiles:map.files.length,finalImages:manifest.outputs.length,styles:styles.size,unchangedOriginalPNGs:map.files.filter(x=>x.sourceRelative.endsWith('.png')&&x.sourceSHA256===x.archivedSHA256).length,failures};
console.log(JSON.stringify(results,null,2));if(failures.length)process.exitCode=1;

