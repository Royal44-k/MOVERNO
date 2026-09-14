# MOVERNO SS27 裤装：Single Relay Round 3

- 日期：2026-08-31
- 状态：17 张概念板已生成，等待用户审核
- 交付：12 款无蓝主系列＋5 张蓝色系 A/B 对照
- 方法：内置 ImageGen；StyTrix 仅采用工作流规范，未调用付费生成
- V2 母版 SHA-256：`6974B12D59755D954DA3B748736218DB78C7B3542D954BEA3EC1E1F040689D76`

## 1. 无蓝主系列

| 款号 | 主色 | 概念板 |
|---|---|---|
| PT19 FLUID RELAY | 黑曜黑 | [查看](../assets/ss27-pants-single-relay-round3/01-pt19-fluid-relay-obsidian-black.png) |
| PT20 SEOUL CURVE | 中性风暴灰 | [查看](../assets/ss27-pants-single-relay-round3/02-pt20-seoul-curve-storm-gray.png) |
| PT21 STACK TRACE | 煤黑 | [查看](../assets/ss27-pants-single-relay-round3/03-pt21-stack-trace-coal-black.png) |
| PT22 TOWER SIGNAL | 铅铁黑 | [查看](../assets/ss27-pants-single-relay-round3/04a-pt22-tower-signal-lead-iron-black.png) |
| PT23 NIGHT CURRENT | 暗石榴黑 | [查看](../assets/ss27-pants-single-relay-round3/05a-pt23-night-current-pomegranate-black.png) |
| PT24 PARKOUR RAIL | 铁灰 | [查看](../assets/ss27-pants-single-relay-round3/06-pt24-parkour-rail-iron-gray.png) |
| PT25 MINERAL PUDDLE | 中性矿物灰 | [查看](../assets/ss27-pants-single-relay-round3/07a-pt25-mineral-puddle-neutral-gray.png) |
| PT26 QUIET TAILOR | 冷樱黑 | [查看](../assets/ss27-pants-single-relay-round3/08-pt26-quiet-tailor-black-cherry.png) |
| PT27 CURVE VORTEX | 暗酒红黑 | [查看](../assets/ss27-pants-single-relay-round3/09a-pt27-curve-vortex-oxblood-black.png) |
| PT28 APERTURE CARGO | 石墨橄榄 | [查看](../assets/ss27-pants-single-relay-round3/10-pt28-aperture-cargo-graphite-olive.png) |
| PT29 SNAP COLUMN | 烟黑 | [查看](../assets/ss27-pants-single-relay-round3/11-pt29-snap-column-smoke-black.png) |
| PT30 TOKYO FOLD | 钨灰 | [查看](../assets/ss27-pants-single-relay-round3/12a-pt30-tokyo-fold-tungsten-gray.png) |

## 2. 蓝色系 A/B 对照

| 款号 | A：无蓝版本 | B：蓝色系对照 |
|---|---|---|
| PT22 | [铅铁黑](../assets/ss27-pants-single-relay-round3/04a-pt22-tower-signal-lead-iron-black.png) | [深靛黑](../assets/ss27-pants-single-relay-round3/04b-pt22-tower-signal-deep-indigo.png) |
| PT23 | [暗石榴黑](../assets/ss27-pants-single-relay-round3/05a-pt23-night-current-pomegranate-black.png) | [午夜蓝](../assets/ss27-pants-single-relay-round3/05b-pt23-night-current-midnight-blue.png) |
| PT25 | [中性矿物灰](../assets/ss27-pants-single-relay-round3/07a-pt25-mineral-puddle-neutral-gray.png) | [浅灰蓝洗水](../assets/ss27-pants-single-relay-round3/07b-pt25-mineral-puddle-pale-blue-gray.png) |
| PT27 | [暗酒红黑](../assets/ss27-pants-single-relay-round3/09a-pt27-curve-vortex-oxblood-black.png) | [蓝黑](../assets/ss27-pants-single-relay-round3/09b-pt27-curve-vortex-blue-black.png) |
| PT30 | [钨灰](../assets/ss27-pants-single-relay-round3/12a-pt30-tokyo-fold-tungsten-gray.png) | [氧化蓝灰](../assets/ss27-pants-single-relay-round3/12b-pt30-tokyo-fold-oxidized-blue-gray.png) |

## 3. 设计 QA

- 12 款裤型已覆盖流体宽腿、弧形桶裤、微喇堆脚、塔形超宽、宽直运动、carpenter、极宽堆脚、西裤、女性曲线、隐藏 Cargo、可变直筒和不对称覆褶，不是换色复制。
- V2 在所有款中保持暗色内部、窄中缝、边缘线和暗血红节点的核心辨识；变化来自遮挡、窗口、洗水、暗蚀、提花、开衩和覆褶。
- 蓝色 A/B 图均从对应无蓝图执行颜色编辑，版型与主要纹样位置保持可比。
- PT22 画布为 1666×944；其余为 1536×1024。进入最终统一展示前应裁入相同版式，当前不做破坏性缩放。
- PT21 的圆形扣件、部分图片中的细小五金符号属于图像模型的概念占位，不是已定稿的 `MV RELAY`；获选款须以已确认的 MV RELAY 矢量资产替换。
- PT20 的侧缝窗口内出现较密的图形解释，PT21 的左腿链条也比目标更连续；若用户保留这两款，下一轮优先做“减密、不改裤型”的定点修订。
- 概念图不能替代确定性纹样文件或工厂技术图；用户选款后再为保留款制作结构统一的正侧背与侧纹展开。

## 4. 审核方式

请按以下格式回复：

`PT19 保留；PT20 改为单链减密；PT22 选 B；PT25 选 A；……`

只对获选款进入下一轮细化，避免同时修改 12 款导致系列方向再次混杂。

## 5. 文件

- [资产清单 manifest.json](../assets/ss27-pants-single-relay-round3/manifest.json)
- [生成提示词 prompts.md](../assets/ss27-pants-single-relay-round3/prompts.md)
