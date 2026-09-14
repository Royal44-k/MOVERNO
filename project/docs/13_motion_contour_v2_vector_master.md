# MOVERNO / 墨维诺 Motion Contour V2 矢量母版与边缘鎏金工艺稿

日期：2026-08-28  
状态：历史技术研究稿。V2 视觉方向仍获确认，但本文件记录的几何矢量母版因节点与节奏偏离 V2，不再作为服装视觉来源；文件保留用于过程追溯，不进入短袖铺装。

## 锁定原则

- 结构来源：已确认的 `05-relay-veil-edge-gilded-v2.png`。
- 金色范围：只允许位于面板外轮廓、倒角及极少量节点边缘；不得以金粉、金雾、暖色磨损或大面积金属填色进入面板内部。
- 内部质感：黑曜 `#0D0D0F` 与石墨 `#25262A` 为主，立体感来自冷色暗面层次，不来自内部金色。
- 本阶段边界：只制作纹样与烫金生产逻辑，不生成服装、模特、海报或网站。

## 尺寸与重复

- 单元尺寸：240 x 360 mm。
- 横向节奏：双列结构，列中心距 120 mm。
- 纵向节奏：第二列相对第一列偏移 90 mm。
- 默认边缘烫金线宽：0.60 mm。
- 试机线宽：0.35 / 0.45 / 0.60 mm；前两档只用于确认设备能力。
- 套准设计目标：试烫后边缘偏移控制在 +/-0.35 mm 内；若设备不能稳定达到，优先整体向外修正轮廓，不允许向面板内部增宽。

## 可编辑矢量文件

- `assets/motion-contour-v2-vector/svg/moverno-motion-contour-v2-master-tile.svg`
- `assets/motion-contour-v2-vector/svg/moverno-motion-contour-v2-gilded-preview.svg`
- `assets/motion-contour-v2-vector/svg/moverno-motion-contour-v2-tonal-plate.svg`
- `assets/motion-contour-v2-vector/svg/moverno-motion-contour-v2-foil-plate.svg`
- `assets/motion-contour-v2-vector/svg/moverno-motion-contour-v2-node-plate.svg`
- `assets/motion-contour-v2-vector/svg/moverno-motion-contour-v2-seam-proof.svg`
- `assets/motion-contour-v2-vector/svg/moverno-motion-contour-v2-line-test.svg`

主文件包含以下命名图层：

- `SUBSTRATE_OBSIDIAN`
- `TONAL_GRAPHITE_PANEL`
- `FOIL_GOLD_EDGE`
- `DRIED_BLOOD_NODE`

## 预览与技术文件

- PNG 校样位于 `assets/motion-contour-v2-vector/proof/`。
- A3 五页技术 PDF：`output/pdf/MOVERNO_Motion_Contour_V2_Edge_Gilding_Tech_Sheet.pdf`。
- 技术页包括：方向锁定、无缝母版、三张专色分色、3 x 3 接缝校验、线宽/间隙试烫条与工厂交接清单。

## 出片规则

- `FOIL_GOLD_EDGE` 分色稿中的黑线只代表鎏金区域，白色区域不得出片。
- 中央暗色小节点只属于综合预览的结构层；在鎏金版中仅保留其轮廓，在暗血红版中完全剥离，不得作为实心专色输出。
- 转曲前保留 live-stroke 原始文件；工厂输出版另存为转轮廓版本。
- 不用十字形品牌图案；套准只采用四角 L 形工艺标记，且不得进入最终成品视觉。
- 允许整体等比缩放，但禁止单独加粗金边来补偿小尺寸。
- 量产前必须完成基材、烫金膜、温度、压力、时间、离型方式及洗后/摩擦测试，并保留试机记录。

## 当前确认门

服装视觉已改为直接锁定 `05-relay-veil-edge-gilded-v2.png`，只允许裁切、遮罩、循环平铺及随衣身产生的透视/褶皱变形。短袖阶段的当前确认门见 `docs/14_ss27_tee_base_blocks.md`。
