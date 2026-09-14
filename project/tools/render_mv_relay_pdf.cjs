const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const projectRoot = path.resolve(__dirname, '..');
const assetRoot = path.join(projectRoot, 'assets', 'ss27-pants-mv-relay-selected');
const markBlack = fs.readFileSync(path.join(assetRoot, 'svg', 'moverno-mv-relay.svg'), 'utf8');
const markWhite = fs.readFileSync(path.join(assetRoot, 'svg', 'moverno-mv-relay-reverse.svg'), 'utf8');
const proof = fs.readFileSync(path.join(assetRoot, 'proof', 'moverno-mv-relay-application-proof.svg'), 'utf8');
const outputDir = path.join(projectRoot, 'output', 'pdf');
const outputFile = path.join(outputDir, 'MOVERNO_MV_RELAY_Selected_Mark.pdf');

function stripDeclaration(svg) {
  return svg.replace(/^<\?xml[^>]*>\s*/i, '');
}

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<style>
  @page { size: A4 landscape; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; font-family: Arial, "Microsoft YaHei", sans-serif; color: #0D0D0F; }
  .page { width: 297mm; height: 210mm; page-break-after: always; position: relative; overflow: hidden; }
  .page:last-child { page-break-after: auto; }
  .cover { background: #0D0D0F; color: #D9D4C8; padding: 25mm 24mm; }
  .cover .mark { position: absolute; width: 90mm; height: 90mm; left: 24mm; top: 48mm; }
  .cover .copy { position: absolute; left: 132mm; top: 62mm; width: 135mm; }
  h1 { margin: 0; font-size: 26pt; letter-spacing: .04em; line-height: 1.12; }
  h2 { margin: 5mm 0 0; font-size: 13pt; font-weight: 500; color: #73777A; letter-spacing: .08em; }
  .rule { width: 34mm; height: 1.2mm; background: #5B1F25; margin: 14mm 0 8mm; }
  .meta { font-size: 9pt; line-height: 1.75; color: #D9D4C8; }
  .belief { position: absolute; left: 132mm; bottom: 30mm; font-family: Georgia, serif; font-size: 12pt; }
  .footer { position: absolute; left: 24mm; right: 24mm; bottom: 12mm; color: #73777A; font-size: 7pt; display: flex; justify-content: space-between; }
  .proof-page { background: #F3F1EC; }
  .proof-page svg { width: 100%; height: 100%; display: block; }
  .rules { padding: 18mm 20mm; background: white; }
  .rules h1 { font-size: 21pt; }
  .rules .sub { margin-top: 3mm; color: #73777A; font-size: 9pt; letter-spacing: .08em; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; margin-top: 11mm; }
  .card { min-height: 54mm; padding: 8mm; background: #F3F1EC; border: .3mm solid #D9D4C8; }
  .card h3 { margin: 0 0 4mm; font-size: 11pt; }
  .card p, .card li { font-size: 8.5pt; line-height: 1.65; color: #25262A; }
  .card ul { margin: 0; padding-left: 5mm; }
  .mini-mark { float: right; width: 26mm; height: 26mm; margin-left: 5mm; }
  .warning { color: #5B1F25 !important; font-weight: 700; }
</style>
</head>
<body>
  <section class="page cover">
    <div class="mark">${stripDeclaration(markWhite)}</div>
    <div class="copy">
      <h1>MV RELAY<br>SELECTED PANT MARK</h1>
      <h2>MOVERNO / 墨维诺 - SS27</h2>
      <div class="rule"></div>
      <div class="meta">二级裤装识别资产<br>Round 1 - Direction B selected<br>确定性矢量重建 / 纯黑与反白<br>版本：2026-08-30</div>
    </div>
    <div class="belief">Different But Excellent.</div>
    <div class="footer"><span>INTERNAL DIRECTION MASTER</span><span>01</span></div>
  </section>

  <section class="page proof-page">
    ${stripDeclaration(proof)}
  </section>

  <section class="page rules">
    <h1>使用规则与确认边界</h1>
    <div class="sub">MV RELAY IS SECONDARY. VEIL GATE REMAINS THE MASTER BRAND EMBLEM.</div>
    <div class="grid">
      <div class="card">
        <div class="mini-mark">${stripDeclaration(markBlack)}</div>
        <h3>结构定义</h3>
        <p>上部圆角 M 代表柔性防护；左下横轨在单一错位节点将动势交给锐利 V。不得把 M 与 V 拆成两个并排字母，也不得添加外框、盾形或第三条平行轨迹。</p>
      </div>
      <div class="card">
        <h3>最小尺寸</h3>
        <ul><li>数字端：16 px 为绝对最小，24 px 为推荐下限。</li><li>压印/五金：8 mm 高为概念下限，开模前需按材料补偿。</li><li>织唛/刺绣：建议不小于 12 mm 高，并保留内部负空间。</li></ul>
      </div>
      <div class="card">
        <h3>批准应用</h3>
        <p>后腰牌、纽扣、铆钉、拉链头、小型同色刺绣、Relay Rail 末端节点。氧化镍为主要五金色；暗血红只能作为低于 3% 的定位点。</p>
      </div>
      <div class="card">
        <h3>未批准事项</h3>
        <p class="warning">本文件不是商标核准、五金开模或量产文件。</p>
        <p>公开发布前仍需完成中国第 25/35 类检索、反向图片检查、笔画扩展、节点清理与真实 8 mm 打样。</p>
      </div>
    </div>
    <div class="footer"><span>MOVERNO - MOVE DARK. STAY SOFT.</span><span>03</span></div>
  </section>
</body>
</html>`;

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Users\\lenovo\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1132 }, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'load' });
    await page.pdf({
      path: outputFile,
      format: 'A4',
      landscape: true,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
  } finally {
    await browser.close();
  }
  process.stdout.write(`${outputFile}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});
