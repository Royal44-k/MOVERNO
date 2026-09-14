# MOVERNO SS27 裤装全系列商品详情 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox `- [ ]` and must be checked only after the stated verification passes.

## Scope Amendment — 2026-09-08

用户在第一批生成过程中明确要求“暂时不用考虑生成模特图，其他按计划执行”。本修订覆盖下方所有冲突条款：

- 停止所有新增男性/女性试穿生成；两张已完成身份母版及少量试穿草稿仅作延期资产，不进入当前海报、联系表、清单或验收计数。
- 每款当前生成 4 张纯产品素材：`hero.png`、`silhouette-study.png`、`innovation-atlas.png`、`material-brand-atlas.png`，15 款共 60 张。
- 七个页面板块调整为 `opening`、`silhouette`、`innovation`、`wearingLogic`、`constructionProof`、`identityInTouchpoint`、`materialAndCTA`。其中 `wearingLogic` 用产品动作/开合序列说明穿着逻辑，不出现模特；`constructionProof` 用裁片、褶量、口袋或裤脚结构的独立产品图说明。
- 原 `maleFit`、`femaleFit` 生成、排版和 QA 项全部延期；其余品牌触点、V2、五个版式家族、15 张 1080×6500 长图、105 张切片与 QA 规则不变。

## Scope Amendment 2 — 2026-09-08（覆盖上一修订的模特延期条款）

用户随后明确要求重新考虑模特图，并用两张新附件锁定全部模特造型。以本条为最终有效范围：

- 恢复每款男性、女性两张成年东亚模特全身试穿图，共 30 张；两张既有身份母版重新启用。
- 所有模特统一穿图二参考的黑色 Oversize 短袖：胸前小型 Gate＋MOVERNO，侧身/背部使用断裂残影 V2；图案位置随视角自然透视，但不得改成其他上衣。
- 所有模特统一穿图一参考的 MOVERNO 黑色高帮帆布鞋：黑色鞋面、骨灰鞋带与包边、外侧 Gate、后跟品牌触点；不得替换为低帮鞋、靴子或跑鞋。
- 每款当前资产为 6 张：`hero.png`、`silhouette-study.png`、`innovation-atlas.png`、`material-brand-atlas.png`、`male-fit.png`、`female-fit.png`。15 款共 90 张，加 2 张身份母版，当前验收总数为 92。
- 七个页面板块恢复为 `opening`、`silhouette`、`innovation`、`maleFit`、`femaleFit`、`identityInTouchpoint`、`materialAndCTA`。产品动作/开合与结构证据保留在 `innovation-atlas` 内，不删减。
- PT19、PT20 已生成的旧试穿草稿因上衣和鞋不符合本锁定造型而作废，但保留在项目中；所有 30 张最终试穿图均重新生成。

## Goal

将 12 款主线裤装与 3 款蓝色对照款共 15 款概念图，制作成可供用户统一审核的完整商品详情资产。每款交付一张 1080×6500 长图、一个可编辑 SVG、7 张无损分区 PNG、375px 移动端预览，并为每款配置互不重复的无字主视觉、轮廓研究、创新结构图和材质/品牌细节图。MOVERNO 标识必须有机出现于裤装五金、织唛、绣线或压印触点中，不得单独作为 Logo 展板。

## Architecture

采用“受控生成 + 确定性品牌合成 + 数据驱动排版 + 自动化 QA”四层结构：

1. ImageGen 仅生成裤装、人物、摄影光影和无字细节底图；
2. 正式 MOVERNO / MV RELAY / Veil Gate 源资产通过 Sharp 确定性叠加到裤装触点，并模拟压印、刺绣或氧化镍五金；
3. 15 款商品参数、文案、版式家族、图像路径和品牌触点全部由 JSON 驱动，渲染器输出 SVG 与 PNG；
4. QA 脚本检查尺寸、数量、品牌触点、图片重复、切片回拼、色彩禁区、移动端可读性与全身构图，并输出四张全系列联系表。

## Tech Stack

- Node.js ESM
- Sharp：缩放、裁切、SVG/PNG 合成、长图渲染、切片与像素比对
- ImageGen：商品摄影、东亚模特试穿、三联细节底图
- 现有正式品牌 PNG/SVG 与 V2 纹样母版
- Markdown / JSON：创作记录、数据接口、生成提示词与 QA 报告

## Specification

- Approved design: `docs/superpowers/specs/2026-09-08-moverno-pants-product-details-full-series-design.md`
- V2 master: `assets/motion-contour-round1/05-relay-veil-edge-gilded-v2.png`
- V2 SHA-256: `6974B12D59755D954DA3B748736218DB78C7B3542D954BEA3EC1E1F040689D76`
- Concept source: `assets/ss27-pants-single-relay-round3/`
- Output root: `assets/ss27-pants-product-details-full-series/`

## Global Constraints

- 15 款均需成套交付，不以单款确认打断生产批次。
- 每款页面的 Hero、男性试穿、女性试穿、三联细节不得复用同一张图、同一裁切或同一构图。
- 同一模特身份可跨款延续，但动作、镜头、空间方向需依照款式切换；男女图至少在镜头、动作、空间方向中有两项不同。
- 每个模特必须是成年东亚人，头到鞋完整入画，裤装无遮挡，搭配中性、无第三方品牌标识的上衣与鞋。
- V2 图案保持拓扑识别度，边缘鎏金不得渗入暗色内部；变化仅限于单链、裁切、轻微旋转、断裂、残影或被结构局部遮挡。
- 禁止复制十字、皇冠、三叶草、三条纹、TC、LV、Double C、Chrome Hearts、Thug Club、AMIRI、Rick Owens、Balenciaga 等受保护识别资产。
- 商品详情中不得出现孤立 Logo 卡片；品牌微距必须保留至少 60% 裤装语境，标识面积不超过微距的 18%。
- 15 款使用五个版式家族，但任意两款不得拥有完全相同的图片次序、区域比例和注释路径。
- 所有中文、英文、款号、价格和功能声明由排版代码写入，不依赖图片模型生成文字。

## Task 1: Scaffold the full-series contract and validation fixtures

**Files:**

- Create: `assets/ss27-pants-product-details-full-series/products.json`
- Create: `assets/ss27-pants-product-details-full-series/models.json`
- Create: `assets/ss27-pants-product-details-full-series/prompts.json`
- Create: `assets/ss27-pants-product-details-full-series/branding.json`
- Create: `tools/lib/pants-product-details-contract.mjs`
- Create: `tools/test-pants-product-details-contract.mjs`

- [x] Create the output directories: `model-masters`, `generated`, `branded-details`, `editable`, `posters`, `slices`, `mobile`, `previews`, and `qa`.
- [x] Encode the 15 approved style codes and source images exactly:

  `PT19`, `PT20`, `PT21`, `PT22-A`, `PT23-A`, `PT24`, `PT25-A`, `PT26`, `PT27-A`, `PT28`, `PT29`, `PT30-A`, `PT22-B`, `PT25-B`, `PT27-B`.
- [x] For each product record require: `styleCode`, `slug`, `chapter`, `variant`, `sourceConcept`, `displayNameZh`, `displayNameEn`, `silhouette`, `fabric`, `colorName`, `colorHex`, `targetPrice`, `heroDirection`, `maleFitDirection`, `femaleFitDirection`, `innovationFocus`, `salesProof`, `brandPlacement`, `brandAsset`, `brandTechnique`, `motifRule`, `layoutFamily`, `sectionOrder`.
- [x] Encode five chapters and exactly three products per chapter: `FLUID_SHADOW`, `TOWER_CURRENT`, `MINERAL_TAILOR`, `APERTURE_SYSTEM`, `COLOR_LAB`.
- [x] Encode three model masters: one male identity, one female identity, and a neutral styling rule set. Do not use named celebrities.
- [x] Encode formal brand assets and V2 master paths plus locked SHA-256.
- [x] Write contract validation that fails on missing fields, duplicated slug/style code, unknown chapter/layout family, wrong chapter size, missing source image, repeated section order, forbidden third-party terms in user-facing copy, or wrong V2 hash.
- [x] Run:

  `node tools/test-pants-product-details-contract.mjs`

  Expected: `PASS 15 products / 5 chapters / V2 hash locked`.

## Task 2: Generate and archive the two model identity masters

**Files:**

- Create: `assets/ss27-pants-product-details-full-series/model-masters/male-east-asian-master.png`
- Create: `assets/ss27-pants-product-details-full-series/model-masters/female-east-asian-master.png`
- Update: `assets/ss27-pants-product-details-full-series/prompts.json`

- [x] Generate a clean, full-body adult East Asian male identity master: age 24–28, neutral expression, short black hair, straight build, head-to-shoes, soft gray studio, fitted neutral base layer, no logo, no jewelry, no readable text.
- [x] Generate a clean, full-body adult East Asian female identity master: age 22–28, neutral expression, black hair, curve build, head-to-shoes, soft gray studio, fitted neutral base layer, no logo, no jewelry, no readable text.
- [x] Inspect both at original detail and reject cropped feet, distorted hands, unintended text, visible brand marks, childlike appearance or inconsistent anatomy.
- [x] Record exact prompts, generation date, output dimensions and SHA-256 in `prompts.json` and `models.json`.

## Task 3: Build deterministic brand-in-garment compositing

**Files:**

- Create: `tools/composite-pants-brand-touchpoints.mjs`
- Create: `tools/test-composite-pants-brand-touchpoints.mjs`
- Create: `assets/ss27-pants-product-details-full-series/branding.json`

- [ ] Define one placement profile per style using the approved on-garment locations:

  - `PT19`: MV drawstring end + same-color rear Gate
  - `PT20`: MV side-waist rivet + rear-pocket Gate embroidery
  - `PT21`: MV fly button + MOVERNO coin-pocket tab
  - `PT22-A/B`: rear narrow Gate plate + MV waist button
  - `PT23-A`: MV hidden side-zip pull + Gate inside hem
  - `PT24`: MV tool-loop metal + Gate rear pocket
  - `PT25-A/B`: MV nickel waist button + Gate deboss rear plaque
  - `PT26`: MV rear-waist plate + Gate inner-waistband label
  - `PT27-A/B`: MV waist-side zipper + dried-blood Gate bar tack
  - `PT28`: MV side-zip pull + same-color rear Gate
  - `PT29`: MV side snaps + Gate inner placket
  - `PT30-A`: MV waist hook + Gate fold-underside embroidery
- [ ] Accept a generated three-panel detail atlas and composite the exact approved formal mark into the central brand-touchpoint panel only.
- [ ] Support `oxidized_nickel`, `deboss`, `tonal_embroidery`, `woven_label`, and `dried_blood_bartack` treatments with restrained highlight/shadow and fabric grain preservation.
- [ ] Keep garment context at least 60% and mark coverage at most 18%; preserve the adjacent innovation and material panels untouched.
- [ ] Write a synthetic test atlas and verify output dimensions, alpha-free export, central-panel-only pixel changes, and asset existence.
- [ ] Run:

  `node tools/test-composite-pants-brand-touchpoints.mjs`

  Expected: `PASS deterministic garment touchpoint composite`.

## Task 4: Build the data-driven five-family poster renderer

**Files:**

- Create: `tools/lib/pants-product-layouts.mjs`
- Create: `tools/render-pants-product-details-full-series.mjs`
- Create: `tools/test-pants-product-details-renderer.mjs`

- [ ] Implement five visually distinct layout families:

  1. `FLUID_EDITORIAL`: offset vertical rhythm, long negative-space bands and flowing contour annotations.
  2. `TOWER_TECH`: narrow architectural columns, cropped structural elevations and measured connector lines.
  3. `MINERAL_ATELIER`: tactile macro fields, tailoring grids and restrained material captions.
  4. `APERTURE_UTILITY`: functional modular zones, hardware-led navigation and asymmetric inspection windows.
  5. `COLOR_LAB_COMPARE`: controlled A/B swatch logic without copying the paired A-style layout or images.
- [ ] For all families implement seven semantic sections: `opening`, `silhouette`, `innovation`, `wearingLogic`, `constructionProof`, `identityInTouchpoint`, `materialAndCTA`; allow per-style ordering and geometry variants.
- [ ] Every poster must place the formal wordmark text via vector/text rendering and place MOVERNO identity only on pants within the brand panel.
- [ ] Place mission, belief and product slogan selectively; never repeat all three in every section. Functional proof must be product-specific.
- [ ] Output exactly `1080×6500` opaque PNG and a self-contained SVG with embedded raster assets.
- [ ] Implement 375px-wide preview rendering and a 1600px contact-card preview.
- [ ] Build fixture images and render five representative posters, one per layout family.
- [ ] Run:

  `node tools/test-pants-product-details-renderer.mjs`

  Expected: `PASS 5 layout families / 1080x6500 / embedded SVG assets`.

## Task 5: Build slicing, manifest and lossless round-trip verification

**Files:**

- Create: `tools/slice-pants-product-details-full-series.mjs`
- Create: `tools/test-pants-product-details-slicing.mjs`
- Create: `assets/ss27-pants-product-details-full-series/manifest.json`

- [ ] Derive seven slice boundaries from each rendered SVG layout record rather than hard-coded equal heights.
- [ ] Export seven ordered PNG files per style under `slices/<styleCode>/`.
- [ ] Rejoin the seven slices in memory and compare pixel-for-pixel with the source poster.
- [ ] Record poster/SVG/slice/mobile/preview paths, dimensions, SHA-256, source concepts and generated-image lineage in `manifest.json`.
- [ ] Run:

  `node tools/test-pants-product-details-slicing.mjs`

  Expected: `PASS 7 slices / lossless round-trip`.

## Task 6: Batch 1 — FLUID SHADOW (PT19, PT20, PT21)

**Files:**

- Create: `assets/ss27-pants-product-details-full-series/generated/PT19/{hero,silhouette-study,innovation-atlas,material-brand-atlas}.png`
- Create: `assets/ss27-pants-product-details-full-series/generated/PT20/{hero,silhouette-study,innovation-atlas,material-brand-atlas}.png`
- Create: `assets/ss27-pants-product-details-full-series/generated/PT21/{hero,silhouette-study,innovation-atlas,material-brand-atlas}.png`
- Create: `assets/ss27-pants-product-details-full-series/branded-details/PT19/detail-atlas-branded.png`
- Create: `assets/ss27-pants-product-details-full-series/branded-details/PT20/detail-atlas-branded.png`
- Create: `assets/ss27-pants-product-details-full-series/branded-details/PT21/detail-atlas-branded.png`

- [ ] PT19 `FLUID RELAY`: prioritize draped wide-leg movement, low-contrast single-chain V2 trajectory and drawstring-end MV touchpoint; hero movement and model poses must not repeat the pilot page composition.
- [ ] PT20 `SEOUL CURVE`: prioritize curved outseam, controlled storm-gray-black tonal hierarchy and side-waist rivet; use front elevation for silhouette study and a side-step-like fabric motion sequence for wearing logic.
- [ ] PT21 `STACK TRACE`: prioritize coal-black denim stack, shoe break and fly-button MV; use low product camera and rear three-quarter product rotation without a model.
- [ ] Generate four independent product-only images per style, with concept source and V2 master as references where applicable.
- [ ] Composite exact brand touchpoints into all three detail atlases.
- [ ] Run batch visual QA: full body, product consistency, V2 recognition, no unwanted text/logo, and no duplicate crop/composition.

## Task 7: Batch 2 — TOWER CURRENT (PT22-A, PT23-A, PT24)

**Files:**

- Create: `assets/ss27-pants-product-details-full-series/generated/PT22-A/{hero,silhouette-study,innovation-atlas,material-brand-atlas}.png`
- Create: `assets/ss27-pants-product-details-full-series/generated/PT23-A/{hero,silhouette-study,innovation-atlas,material-brand-atlas}.png`
- Create: `assets/ss27-pants-product-details-full-series/generated/PT24/{hero,silhouette-study,innovation-atlas,material-brand-atlas}.png`
- Create: corresponding `branded-details/<styleCode>/detail-atlas-branded.png`

- [ ] PT22-A `TOWER SIGNAL`: highlight lead/iron-black architectural straight leg, restrained rail interruption and narrow rear Gate plate.
- [ ] PT23-A `NIGHT CURRENT`: highlight pomegranate-black undertone, hidden side zipper and organic current line without large-scale pattern fill.
- [ ] PT24 `PARKOUR RAIL`: highlight iron-gray articulated movement, tool-loop hardware and sport-utility volume without three-stripe logic.
- [ ] Generate four independent product-only images per style; make all camera directions and spatial movement distinct from Batch 1.
- [ ] Composite exact brand touchpoints and complete batch visual QA.

## Task 8: Batch 3 — MINERAL TAILOR (PT25-A, PT26, PT27-A)

**Files:**

- Create: `assets/ss27-pants-product-details-full-series/generated/PT25-A/{hero,silhouette-study,innovation-atlas,material-brand-atlas}.png`
- Create: `assets/ss27-pants-product-details-full-series/generated/PT26/{hero,silhouette-study,innovation-atlas,material-brand-atlas}.png`
- Create: `assets/ss27-pants-product-details-full-series/generated/PT27-A/{hero,silhouette-study,innovation-atlas,material-brand-atlas}.png`
- Create: corresponding `branded-details/<styleCode>/detail-atlas-branded.png`

- [ ] PT25-A `MINERAL PUDDLE`: highlight neutral-gray mineral wash, puddled hem, nickel waist button and debossed Gate plaque; do not repeat previous pilot crops.
- [ ] PT26 `QUIET TAILOR`: highlight black-cherry mature tailoring, clean drape and rear-waist MV plate; eliminate mechanical overload.
- [ ] PT27-A `CURVE VORTEX`: highlight oxblood-black curve block, controlled flare and dried-blood Gate bar tack; retain adult, refined styling.
- [ ] Generate four independent images per style, composite exact brand touchpoints and complete batch visual QA.

## Task 9: Batch 4 — APERTURE SYSTEM (PT28, PT29, PT30-A)

**Files:**

- Create: `assets/ss27-pants-product-details-full-series/generated/PT28/{hero,silhouette-study,innovation-atlas,material-brand-atlas}.png`
- Create: `assets/ss27-pants-product-details-full-series/generated/PT29/{hero,silhouette-study,innovation-atlas,material-brand-atlas}.png`
- Create: `assets/ss27-pants-product-details-full-series/generated/PT30-A/{hero,silhouette-study,innovation-atlas,material-brand-atlas}.png`
- Create: corresponding `branded-details/<styleCode>/detail-atlas-branded.png`

- [ ] PT28 `APERTURE CARGO`: highlight graphite-olive module volume, hidden access and same-color rear Gate; no armour silhouette or decorative fake pockets.
- [ ] PT29 `SNAP COLUMN`: highlight smoke-black segmented snap column, controlled transformation and on-garment MV snaps; no full-side button imitation.
- [ ] PT30-A `TOKYO FOLD`: highlight tungsten-gray fold construction, waist hook and underside Gate embroidery; preserve quiet metropolitan tailoring.
- [ ] Generate four independent images per style, composite exact brand touchpoints and complete batch visual QA.

## Task 10: Batch 5 — COLOR LAB (PT22-B, PT25-B, PT27-B)

**Files:**

- Create: `assets/ss27-pants-product-details-full-series/generated/PT22-B/{hero,silhouette-study,innovation-atlas,material-brand-atlas}.png`
- Create: `assets/ss27-pants-product-details-full-series/generated/PT25-B/{hero,silhouette-study,innovation-atlas,material-brand-atlas}.png`
- Create: `assets/ss27-pants-product-details-full-series/generated/PT27-B/{hero,silhouette-study,innovation-atlas,material-brand-atlas}.png`
- Create: corresponding `branded-details/<styleCode>/detail-atlas-branded.png`

- [ ] PT22-B retains PT22 silhouette and brand location but uses deep indigo as an explicit comparison branch, with new camera, poses, light and detail imagery.
- [ ] PT25-B retains PT25 silhouette and brand location but uses pale blue-gray mineral treatment, with new camera, poses, light and detail imagery.
- [ ] PT27-B retains PT27 silhouette and brand location but uses blue-black curve treatment, with new camera, poses, light and detail imagery.
- [ ] Do not reuse any A-variant image or crop; generate twelve new independent images.
- [ ] Composite exact brand touchpoints and complete A/B visual consistency QA.

## Task 11: Render all 15 editable pages, posters, slices and responsive previews

**Files:**

- Create: `assets/ss27-pants-product-details-full-series/editable/<slug>.svg` (15)
- Create: `assets/ss27-pants-product-details-full-series/posters/<slug>.png` (15)
- Create: `assets/ss27-pants-product-details-full-series/slices/<styleCode>/*.png` (105)
- Create: `assets/ss27-pants-product-details-full-series/mobile/<slug>-375.png` (15)
- Create: `assets/ss27-pants-product-details-full-series/previews/<slug>-preview.png` (15)

- [ ] Render all products from `products.json`; stop on any missing or dimension-mismatched asset.
- [ ] Slice all posters into seven semantic panels and run lossless round-trip verification.
- [ ] Verify page-level uniqueness: four unique source files, seven unique crop rectangles, non-identical layout signatures.
- [ ] Verify that no isolated logo card exists and every identity panel references its branded garment atlas.
- [ ] Visually inspect posters at 100% and mobile previews at 375px.
- [ ] Run:

  `node tools/render-pants-product-details-full-series.mjs`

  `node tools/slice-pants-product-details-full-series.mjs`

  Expected: `15 SVG / 15 posters / 105 slices / 15 mobile / 15 previews`.

## Task 12: Build comprehensive QA and four audit contact sheets

**Files:**

- Create: `tools/qa-pants-product-details-full-series.mjs`
- Create: `assets/ss27-pants-product-details-full-series/qa-report.json`
- Create: `assets/ss27-pants-product-details-full-series/qa/heroes-contact-sheet.png`
- Create: `assets/ss27-pants-product-details-full-series/qa/model-identity-contact-sheet.png`
- Create: `assets/ss27-pants-product-details-full-series/qa/brand-touchpoints-contact-sheet.png`
- Create: `assets/ss27-pants-product-details-full-series/qa/v2-innovation-contact-sheet.png`
- Create: `assets/ss27-pants-product-details-full-series/overview.png`

- [ ] Verify 92 current-scope generated images exist (2 identity masters + 60 product-only images + 30 styled model images), are at least 1000px on the long edge, and decode successfully.
- [ ] Calculate cryptographic hashes and perceptual hashes; fail exact duplicates and flag near duplicates for review.
- [ ] Verify all 60 product-only assets contain no person or body parts; verify all 30 model images show the correct adult identity, locked MOVERNO Oversize tee and high-top shoe styling, full head, both shoes and unobstructed pants.
- [ ] Verify 15 branded detail atlases exist, differ from their base atlas only in configured brand ROI, and use exact approved mark assets.
- [ ] Verify V2 master SHA-256 and gold-edge color rule.
- [ ] Verify exact counts and dimensions: 15 posters at 1080×6500, 15 self-contained SVG, 105 slices, 15 mobile previews, 15 page previews.
- [ ] Verify unique `layoutSignature`, unique per-page crop signatures, and all five families represented three times.
- [ ] Generate four contact sheets and one overview for fast user audit.
- [ ] Run:

  `node tools/qa-pants-product-details-full-series.mjs`

  Expected final line: `PASS FULL SERIES: 15 products / 92 images / 15 posters / 105 slices / 5 layout families`.

## Task 13: Build the local audit index and archive the delivery

**Files:**

- Create: `assets/ss27-pants-product-details-full-series/index.html`
- Create: `docs/23_ss27_pants_product_details_full_series.md`
- Create: `assets/MOVERNO-SS27-pants-product-details-full-series-20260908.zip`

- [ ] Build a static local index grouped by five chapters with thumbnails and links to PNG, SVG, 7 slices and mobile preview for each style.
- [ ] Add filter controls for chapter, male/female fit review, brand touchpoint review and A/B comparison without requiring a server.
- [ ] Document design rationale, image prompts, source lineage, brand-in-garment method, known concept limitations and final counts.
- [ ] Copy `products.json`, `models.json`, `prompts.json`, `branding.json`, `manifest.json` and `qa-report.json` into the archive.
- [ ] Create the zip only after full QA passes.
- [ ] Reopen the archive listing and verify all expected roots and 15 style records are present.

## Final Verification Checklist

- [ ] `node tools/test-pants-product-details-contract.mjs`
- [ ] `node tools/test-composite-pants-brand-touchpoints.mjs`
- [ ] `node tools/test-pants-product-details-renderer.mjs`
- [ ] `node tools/test-pants-product-details-slicing.mjs`
- [ ] `node tools/qa-pants-product-details-full-series.mjs`
- [ ] Manual review of `overview.png` and all four QA contact sheets.
- [ ] Manual spot-check of PT19, PT22-A, PT25-A, PT28 and PT22-B posters at 100%.
- [ ] Confirm no `TODO`, `TBD`, placeholder copy, broken path, isolated Logo card or third-party brand asset remains in deliverables.

## Execution Mode

The current project is not a Git repository, so no worktree or commit steps apply. The user approved the full-series design and did not request delegated sub-agents; implementation therefore proceeds inline in this task with `superpowers:executing-plans`, in five three-style generation batches followed by deterministic rendering and QA.
