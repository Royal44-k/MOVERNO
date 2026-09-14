# MOVERNO SS27 裤装重构提案：Single Relay / 单链流变

- 日期：2026-08-31
- 状态：设计提案，待确认；未生成图像
- 目标：修正上一轮棕黑、双链重叠、等距重复和矩形分仓问题，建立 12 款不同版型的潮流暗色裤装
- 纹样母版：`05-relay-veil-edge-gilded-v2.png`
- 母版 SHA-256：`6974B12D59755D954DA3B748736218DB78C7B3542D954BEA3EC1E1F040689D76`

## 1. 研究后的改动结论

- 放弃棕黑基调和全部蓝色倾向，改为墨黑、中性风暴灰、铅铁黑、冷矿物灰、暗石榴黑、冷樱黑、石墨橄榄和钨灰；禁止蓝、蓝黑、深靛或蓝灰。
- 一件裤装只保留一条主要 V2 链；不再用两条完整链平行、交叠或重复铺满裤侧。
- 图案节奏从“重复花边”改为“锚点—留白—回声”：至少一个完整可识别模块，其余通过结构遮挡、洗水消隐和少量尺度变化自然过渡。
- 暗金只保留在少数款的边缘光；其余款用枪灰、烟银、氧化镍、反光石墨或同色暗纹，避免全系列棕金化。
- 12 款覆盖超宽、桶形、微喇堆脚、塔形宽腿、运动、carpenter、极宽堆脚、西裤、女性曲线、Cargo、可变直筒和不对称覆褶。

研究依据：adidas Originals 的现行裤装横跨宽腿、桶形、直筒、宽松运动、丹宁与缎面，证明长期识别资产可以跨多个裤型，而非复制一条模板；MOVERNO 只借鉴系统方法，不使用三条纹和三叶草。[adidas Originals 裤装](https://www.adidas.com/us/browse-originals-pants)

Thug Club 当前下装通过蜡感、洗水、carpenter、少量铆钉与不同裤型建立工业感；MOVERNO 只借鉴洗水和小五金锚点，不复制 TC/tribal 图腾。[Thug Club Bottom](https://thugclub.store/collections/bottom) · [Thug Pants Denim](https://en.thug-club.com/products/thug-pants-denim)

AMIRI 的 Stack Jean 用贴合上段、34 英寸内缝和石洗形成堆脚；Rick Owens 的 Wide Pusher 用落地宽腿、轻低裆、流动面料和侧边开合形成纵向动势；这两者分别转译为 PT21 的比例控制和 PT19 的结构触发，不复制其标志性识别。[AMIRI Stack Jean](https://amiri.com/products/stack-jean-antique-indigo) · [Rick Owens Wide Pusher](https://www.rickowens.eu/en-us/products/ds01f4336jl09)

Balenciaga 当前 Minimal Baggy 依靠超宽体量和脏灰/浅蓝磨旧成为主视觉，SMFK Tower 则通过塔形宽腿、后腿横向裁线、单色洗水和裤脚小铆钉建立结构；因此大体量款应减少 V2 可见面积，让裤型先说话。[Balenciaga Minimal Baggy](https://www.balenciaga.com/en-us/minimal-baggy-pants-dirty-grey-light-blue-857216TTW661505.html) · [SMFK Tower Denim](https://smfk-official.com/en-us/products/compass-mode-tower-denim-pants-sand)

2026 首尔与东京资料显示丹宁、宽腿、baggy、直筒、桶形及精致混搭并存，不能把“日韩潮流”简化为同一种超宽黑裤。[首尔 SS26 街拍](https://www.vogue.com/slideshow/the-best-street-style-from-seoul-fashion-week-spring-2026) · [Vogue Japan 2026 Baggy 穿搭](https://www.vogue.co.jp/article/baggy-jeans-shoe-styling-2026) · [东京 FW26 街拍](https://www.vogue.com/slideshow/the-best-street-style-photos-from-the-fall-2026-shows-in-tokyo)

## 2. V2 单链流变规则

1. 每款最多一条主链，另一腿只允许一个微型回声模块或完全留白。
2. 至少保留一个完整“幕隙/沙漏”单元，暗石墨内部、窄负空间和暗血红节点保持可读。
3. 允许确定性裁切、遮罩、整单元 4–12° 微倾、尺度级差不超过 1.3 倍、洗水消隐与结构遮挡。
4. 禁止镜像串联、非等比拉伸、重新分叉、火焰/心形/tribal 化，以及金色侵入暗色内部。
5. 可见面积控制在 3–8%，上限 10%；图案不能压过裤型、洗水与材质。
6. 点缀只使用自有资产：MV RELAY 微铆钉、单枚暗血红套结、夜间坐标点阵、窄反光绗线和同色 Motion Contour。

## 3. 十二款设计矩阵

| 款号 | 名称 | 版型与人群 | 色彩/材料 | V2 与点缀策略 | 视觉角色 |
|---|---|---|---|---|---|
| `PT19` | FLUID RELAY | 中性落地宽腿、轻低裆 | 墨黑液态哑光针织 | 单链随侧开合三次显露，烟银边；后腰 MV RELAY | 暗黑流动主款 |
| `PT20` | SEOUL CURVE | 中性中高腰弧形桶腿 | 风暴灰洗水丹宁 | 三个不等长侧缝窗口露出同一链；无金色，一枚红套结 | 韩系弧形街头款 |
| `PT21` | STACK TRACE | 合体腰臀、微喇长堆脚 | 煤黑弹力丹宁 | 大腿中段完整锚点微倾 6°，向脚口洗水消隐 | 修长堆脚款 |
| `PT22` | TOWER SIGNAL | 高腰塔形超宽直腿 | 铅铁黑单色洗水丹宁 | 左腿一条枪灰主链，右脚口一个小回声；裤脚 MV 铆钉 | 塔形核心丹宁 |
| `PT23` | NIGHT CURRENT | 中性宽直开放裤脚运动裤 | 暗石榴黑技术梭织 | 单链被弧形侧缝、拉链和褶量自然打断；窄反光石墨线 | 社媒运动主款 |
| `PT24` | PARKOUR RAIL | 低腰宽直 carpenter | 铁灰蜡洗丹宁 | 侧后链激光暗蚀，膝后折痕吞没一段；小型氧化镍五金 | 工业洗水款 |
| `PT25` | MINERAL PUDDLE | 低腰极宽长裆落地堆脚 | 中性矿物灰/粉笔灰脏洗丹宁 | 仅外侧小腿 1.6 个模块，向下失焦；腰侧坐标点阵 | 体量造型款 |
| `PT26` | QUIET TAILOR | 中性高腰双褶宽直西裤 | 冷樱黑羊毛粘胶 | 24mm 同色暗提花链，三段非连续闪现；无外露金属 | 成熟静默款 |
| `PT27` | CURVE VORTEX | 女性高腰曲线微喇 | 暗酒红黑弹力斜纹 | 左侧三锚点大→小，右侧仅一枚红套结；暗金边低于 1% | 女性夜行核心款 |
| `PT28` | APERTURE CARGO | 中性微桶技术 Cargo | 石墨橄榄 ripstop | V2 隐于侧缝扩容拉链，行走/开启才显露；微孔点阵 | 隐藏机能款 |
| `PT29` | SNAP COLUMN | 中腰直筒、侧开衩可变脚口 | 烟黑羊毛棉 | 单链在暗扣门襟内外穿行；氧化镍边，无连续排扣视觉 | 可变城市款 |
| `PT30` | TOKYO FOLD | 中性不对称覆褶宽裤 | 钨灰羊毛尼龙 | 浮动侧褶遮住约 40% 主链，动态恢复完整；微型反光坐标 | 东京层搭实验款 |

## 4. 生成顺序与画面规范

- 确认后按 `PT19 → PT30` 逐款调用内置 ImageGen，每款独立生成，避免裤型和纹样互相污染。
- 每张 1536×1024 概念板包含同一条裤子的正、侧、背三视图，以及侧链、面料/洗水、MV RELAY 五金三个局部放大。
- 图像生成负责裤型、面料和光影；V2 使用母版的确定性裁切/遮罩逻辑作为结构约束，不允许模型自由重画为其他图腾。
- 统一中性灰白无影棚背景、相同机位与比例；灯光不得产生蓝色偏色；无模特、无鞋、无上装、无第三方品牌标识。
- 先完成 12 张概念板统一审核；未确认前不做技术包、模特、海报或网站。

## 5. 审核门

请确认以下整套方向：

> **“Single Relay / 单链流变”＋12 款矩阵＋冷暗多色谱＋一款一图独立生成。**

确认后才进入实际图像生成。若需要修改，请直接指出款号、颜色或裤型。
