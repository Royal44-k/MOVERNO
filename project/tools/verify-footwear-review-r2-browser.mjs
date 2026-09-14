import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base='D:/Codex-chat/night-veil-brand/assets/ss27-footwear-product-details-round2';
const browser=await chromium.launch({headless:true,channel:'msedge'});
const results=[];
try{
for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(base+'/index.html').href);
 await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>null)));});
 const state=await page.evaluate(()=>({cards:document.querySelectorAll('article').length,images:[...document.images].length,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),overflow:document.documentElement.scrollWidth>innerWidth}));
 await page.locator('#shoe-06 summary').click();
 const expanded=await page.locator('#shoe-06 details').getAttribute('open')!==null;
 await page.locator('#shoe-06').scrollIntoViewIfNeeded();
 await page.screenshot({path:base+'/review-qa-'+width+'.png'});
 results.push({width,...state,expanded,errors,passed:state.cards===15&&state.broken.length===0&&!state.overflow&&expanded&&errors.length===0});
 await page.close();
}
}finally{await browser.close();}
await fs.writeFile(base+'/review-browser-qa.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results));
if(results.some(r=>!r.passed))process.exitCode=1;
