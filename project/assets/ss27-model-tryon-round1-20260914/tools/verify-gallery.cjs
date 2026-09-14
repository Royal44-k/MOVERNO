const taskPath = require("path");
const bundleRoot = taskPath.resolve(__dirname,"..");

const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { pathToFileURL } = require("url");
const fs = require("fs");
(async()=>{
fs.mkdirSync(bundleRoot+"/qa/current",{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE ? {executablePath:process.env.BROWSER_EXECUTABLE} : {})});
const page=await browser.newPage({viewport:{width:1440,height:1080},deviceScaleFactor:1});
const errors=[];page.on("pageerror",e=>errors.push(e.message));
await page.goto(pathToFileURL(bundleRoot+"/review.html").href);
await page.locator("img").evaluateAll(imgs=>imgs.forEach(img=>img.loading="eager"));
await page.waitForFunction(()=>Array.from(document.images).every(i=>i.complete));
const images=await page.locator("img").evaluateAll(imgs=>imgs.map(i=>({src:i.getAttribute("src"),ok:i.naturalWidth>0,width:i.naturalWidth,height:i.naturalHeight})));
const files=await page.locator("a[href]").evaluateAll(as=>as.map(a=>a.getAttribute("href")).filter(h=>!h.startsWith("#")));
const missingFiles=[...new Set(files)].filter(f=>!fs.existsSync(bundleRoot+"/"+f));
await page.screenshot({path:bundleRoot+"/qa/current/qa-review-desktop.png"});
await page.setViewportSize({width:375,height:812});
await page.goto(pathToFileURL(bundleRoot+"/review.html").href+"#look-01");
await page.screenshot({path:bundleRoot+"/qa/current/qa-review-mobile.png"});
const mobile=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,sections:document.querySelectorAll("section.look").length,modelImages:document.querySelectorAll(".photo").length}));
console.log(JSON.stringify({errors,missingFiles,images:images.length,failedImages:images.filter(i=>!i.ok),modelImageDimensions:[...new Set(images.filter(i=>!i.src.startsWith("references/")).map(i=>i.width+"x"+i.height))],mobile},null,2));
await browser.close();
})();

