# MOVERNO SS27 裤装产品详情试制 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 PT19、PT25-A、PT28 制作三套可编辑、可切片、可自动验收的 MOVERNO 裤装产品详情长图。

**Architecture:** 以三张已确认概念板为结构真值，ImageGen 只生成无文字的暗场主视觉；Node.js/Sharp 将正式品牌 SVG、文案、源概念图和局部裁切确定性组合为自包含 SVG 与 1080 × 5080 PNG，并导出六模块切片。数据、生成提示词、渲染与 QA 相互分离，使后续 12 张扩展只需增加产品记录和主视觉，不修改模板结构。

**Tech Stack:** OpenAI ImageGen、Node.js ESM、Sharp、SVG、HTML、JSON、PowerShell。

**Spec:** `docs/superpowers/specs/2026-09-08-moverno-pants-product-detail-pilot-design.md`

## Global Constraints

- 品牌名固定为 `MOVERNO / 墨维诺`。
- 品牌使命固定为 `让黑夜不必黯然，让差异不必喧哗。`
- 长期信念固定为 `Different But Excellent.`
- 图像生成阶段禁止生成文字和 Logo；正式标识只在确定性排版阶段加入。
- V2 母版固定为 `assets/motion-contour-round1/05-relay-veil-edge-gilded-v2.png`，SHA-256 为 `6974B12D59755D954DA3B748736218DB78C7B3542D954BEA3EC1E1F040689D76`。
- 鎏金只沿 V2 边缘出现，不进入暗色内部；暗血红只作低占比连接节点。
- `Veil Gate` 为主徽记，`MV RELAY` 为裤装二级标。
- 本阶段是概念宣传视觉，不得写入未经检测的性能或可持续声明。
- 长图固定为 1080 × 5080 px，每款导出六张切片和一张 360 px 宽审核预览。

---

### Task 1: 建立试制产品数据与品牌配置

**Files:**
- Create: `assets/ss27-pants-product-details-pilot/products.json`
- Create: `assets/ss27-pants-product-details-pilot/branding.json`
- Create: `assets/ss27-pants-product-details-pilot/prompts.json`
- Create: `assets/ss27-pants-product-details-pilot/README.md`

**Interfaces:**
- Consumes: 三张源概念板、正式 MOVERNO Logo、Veil Gate、MV RELAY 与 V2 母版的绝对路径。
- Produces: `products.json` 中三条完整产品记录；`branding.json` 中 `wordmarkPath`、`emblemPath`、`mvRelayPath`、`motifPath`；`prompts.json` 中与产品 `id` 一一对应的无文字主视觉提示词。

- [x] **Step 1: 创建目录与三条产品记录**

  建立 `heroes/`、`editable/`、`posters/`、`slices/`、`previews/` 子目录。`products.json` 只收录 `19`、`25A`、`28`，其中 `source` 分别指向 Round 3 的 PT19、PT25 中性矿物灰和 PT28 图。

- [x] **Step 2: 写入逐款卖点与局部 ROI**

  每款写入三项可见卖点、两项纹样/材质局部和三项品牌触点；ROI 使用 `[x,y,width,height]` 像素坐标，并限制在各自源图边界内。

- [x] **Step 3: 写入三条 ImageGen 提示词**

  每条提示词明确：`product-mockup`、无文字、无人物、无第三方品牌、保留原裤型与颜色、裤脚腰头完整、V2 单链不可增殖、金色只在边缘。

- [x] **Step 4: 运行 JSON 和输入路径预检**

  Run: `node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('assets/ss27-pants-product-details-pilot/products.json'));if(p.products.length!==3)process.exit(1);for(const x of p.products){if(!fs.existsSync(x.source))throw Error(x.source)};console.log('3 products and sources OK')"`

  Expected: `3 products and sources OK`

### Task 2: 生成并归档三张无文字主视觉

**Files:**
- Create: `assets/ss27-pants-product-details-pilot/heroes/19-fluid-relay-hero.png`
- Create: `assets/ss27-pants-product-details-pilot/heroes/25a-mineral-puddle-hero.png`
- Create: `assets/ss27-pants-product-details-pilot/heroes/28-aperture-cargo-hero.png`
- Modify: `assets/ss27-pants-product-details-pilot/products.json`

**Interfaces:**
- Consumes: `prompts.json`、对应源概念板、V2 母版。
- Produces: 三张无文字 4:5 或可安全裁切为 4:5 的暗场商品主视觉；每条产品记录的 `hero` 指向归档路径。

- [x] **Step 1: 生成 PT19 主视觉**

  使用 PT19 概念板与 V2 母版作为参考。锁定黑曜流体宽腿、三段侧窗、完整腰头裤脚和窄暖银侧光；禁止运动场、人体和文字。

- [x] **Step 2: 生成 PT25-A 主视觉**

  使用 PT25-A 概念板与 V2 母版作为参考。锁定中性矿物灰洗水、极宽堆脚、一个完整模块加残影和近地视角；禁止蓝色色偏。

- [x] **Step 3: 生成 PT28 主视觉**

  使用 PT28 概念板与 V2 母版作为参考。锁定石墨橄榄 ripstop、微桶形、半开隐藏侧缝与内部单链；禁止新增大块贴袋。

- [x] **Step 4: 归档并检查图像尺寸**

  Run: `node -e "const s=require('sharp');Promise.all(process.argv.slice(1).map(async f=>{const m=await s(f).metadata();if(m.width<1000||m.height<1000)throw Error(f);console.log(f,m.width,m.height)}))" assets/ss27-pants-product-details-pilot/heroes/*.png`

  Expected: 三条路径均显示宽高至少 1000 px。

### Task 3: 实现裤装详情长图渲染器

**Files:**
- Create: `tools/render-pants-product-details.mjs`
- Create: `assets/ss27-pants-product-details-pilot/editable/*.svg`
- Create: `assets/ss27-pants-product-details-pilot/posters/*.png`
- Create: `assets/ss27-pants-product-details-pilot/previews/*.png`
- Create: `assets/ss27-pants-product-details-pilot/index.html`
- Create: `assets/ss27-pants-product-details-pilot/overview.png`

**Interfaces:**
- Consumes: `products.json`、`branding.json`、主视觉 PNG、源概念板和四项正式品牌资产。
- Produces: `renderProduct(product, branding): Promise<{poster,svg,preview}>` 的等价脚本行为；三张 1080 × 5080 长图、三份自包含 SVG、三张审核预览、本地索引页和总览图。

- [x] **Step 1: 建立 1080 × 5080 SVG 页面骨架**

  页面按主视觉、廓形、纹样、标识、材质、品牌收束六段排列；设置固定颜色、字体回退、页边距和 375 px 缩略安全区。

- [x] **Step 2: 嵌入 raster 与正式标识**

  将 hero、source、V2、wordmark、Veil Gate、MV RELAY 读取为 base64 data URL；SVG 中不得出现 `http://`、`https://` 或本地绝对文件引用。

- [x] **Step 3: 绘制逐款差异化内容**

  PT19 使用纵向窄光缝；PT25-A 使用矿物颗粒分隔线；PT28 使用开合式斜切框。三款共享网格和字级，不共享相同主视觉裁切与细节顺序。

- [x] **Step 4: 输出 SVG、PNG、预览和索引**

  使用 Sharp 从 SVG 输出 1080 × 5080 PNG，再生成 360 px 宽预览；`index.html` 提供原尺寸 PNG、SVG、切片和源概念板入口。

- [x] **Step 5: 执行渲染器**

  Run: `node tools/render-pants-product-details.mjs assets/ss27-pants-product-details-pilot`

  Expected: 输出三条 JSON 日志，每条包含 `id`、`width:1080`、`height:5080`。

### Task 4: 导出六模块切片

**Files:**
- Create: `tools/slice-pants-product-details.mjs`
- Create: `assets/ss27-pants-product-details-pilot/slices/19/*.png`
- Create: `assets/ss27-pants-product-details-pilot/slices/25a/*.png`
- Create: `assets/ss27-pants-product-details-pilot/slices/28/*.png`

**Interfaces:**
- Consumes: 三张 1080 × 5080 海报与固定的 `sliceRegions` 配置。
- Produces: 每款 `01-hero.png`、`02-silhouette.png`、`03-relay-anatomy.png`、`04-brand-touchpoints.png`、`05-material-in-motion.png`、`06-brand-close.png`。

- [x] **Step 1: 定义六个无重叠切片区域**

  六个区域的 `top` 从 0 递增，`height` 之和严格等于 5080，宽度固定为 1080。

- [x] **Step 2: 使用 Sharp 导出 18 张 PNG**

  Run: `node tools/slice-pants-product-details.mjs assets/ss27-pants-product-details-pilot`

  Expected: 日志输出 `3 products, 18 slices`。

- [x] **Step 3: 验证切片可逆覆盖整张海报**

  将每款六张切片按顺序垂直拼接为内存图像，比较拼接图和原海报的像素摘要；差异像素必须为 0。

### Task 5: 自动 QA 与视觉核对

**Files:**
- Create: `tools/qa-pants-product-details.mjs`
- Create: `assets/ss27-pants-product-details-pilot/qa-report.json`
- Create: `assets/ss27-pants-product-details-pilot/qa-branding-contact.png`
- Create: `assets/ss27-pants-product-details-pilot/manifest.json`
- Create: `docs/23_ss27_pants_product_details_pilot.md`

**Interfaces:**
- Consumes: 产品数据、三张源图、三张 hero、三张 poster、三份 SVG 和 18 张切片。
- Produces: 可机读 QA 报告、三款标识接触表、全部输入输出 SHA-256 清单和人工审核说明。

- [x] **Step 1: 编写结构化检查**

  检查长图尺寸、切片数量、SVG 自包含、源图与 hero 嵌入、使命与信念文本、款号、正式 Logo、免责声明、ROI 边界和 V2 母版 SHA-256。

- [x] **Step 2: 运行自动 QA**

  Run: `node tools/qa-pants-product-details.mjs assets/ss27-pants-product-details-pilot`

  Expected: JSON 输出 `{"count":3,"passed":true,"sliceCount":18}`。

- [x] **Step 3: 生成并查看审核接触表**

  将三款的主视觉、纹样特写与标识区域排成一张 QA 图，重点检查：Logo 未拼错、MV RELAY 未变形、金色未进入 V2 内部、蓝色未污染 PT19/PT25-A/PT28。

- [x] **Step 4: 在 375 px 条件下检查可读性**

  将三张长图缩放到 375 px 宽，确认主标题、款号、三项卖点和免责声明仍可辨认；问题必须在 SVG 模板中修复后重新渲染。

- [x] **Step 5: 写入阶段报告与扩展接口**

  `docs/23_ss27_pants_product_details_pilot.md` 记录三款链接、生成提示词、SHA-256、自动 QA 结果、人工检查限制，以及剩余 12 张扩展时只需新增产品记录和 hero 的操作方式。
