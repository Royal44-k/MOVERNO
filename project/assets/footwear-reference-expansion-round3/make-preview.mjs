import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.dirname(fileURLToPath(import.meta.url));
const result=await sharp(path.join(root,'overview-R01-R12.png')).resize({width:2200}).flatten({background:'#f3f2ee'}).jpeg({quality:90,mozjpeg:true}).toFile(path.join(root,'overview-R01-R12-preview.jpg'));
console.log(JSON.stringify(result));
