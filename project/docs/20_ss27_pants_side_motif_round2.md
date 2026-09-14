# MOVERNO SS27 裤侧 V2 系列（Round 2）

- 日期：2026-08-30
- 状态：8 款全部生成，待用户统一审核
- 母版：`05-relay-veil-edge-gilded-v2.png`
- 母版 SHA-256：`6974B12D59755D954DA3B748736218DB78C7B3542D954BEA3EC1E1F040689D76`
- 生成方式：OpenAI 内置 ImageGen；StyTrix 仅使用工作流方法，未调用付费生成

## 1. 本轮修正结论

- 正式废止 `PT09 RIVET SHROUD`：不再使用大面积矩形补丁、可拆覆盖板或心形铆钉。
- `PT03 BREAKLINE TRACK` 被 `PT13 GHOST TRACK` 替代：删除对品牌纹样的树枝化、心形化和普通运动条带化解释。
- V2 保持沙漏链拓扑、暗色内部、边缘鎏金和少量暗血红节点；变化只来自裁切、遮罩、断续、尺度、整体微旋转、错位残影与洗水消隐。
- 所有方案都把 V2 控制在裤侧，不进行大面积正面铺满。

## 2. 八款审核矩阵

| 款号 | 版型差异 | 裤侧 V2 方式 | 颜色与面料 | 建议角色 |
|---|---|---|---|---|
| `PT11 RELAY COLUMN` | 中腰宽直丹宁 | 48mm 完整窄侧链＋三处接缝遮断 | 油黑 13oz 丹宁 | 核心识别款 |
| `PT12 ARC VEIL` | 高腰弧形桶裤 | 竖直 V2 从弧形侧缝窗口分段显露 | 石墨黑锦棉斜纹 | 建筑轮廓款 |
| `PT13 GHOST TRACK` | 宽松直筒运动裤 | 主链＋不等宽低透明残影 | 午夜蓝黑技术梭织 | 社媒运动款 |
| `PT14 RIFT FLARE` | 合体上段、微喇堆脚 | 上小下大双尺度，膝部本布自然断点 | 煤黑弹力丹宁 | 暗黑修长款 |
| `PT15 NOCTURNE TAILOR II` | 双褶宽直西裤 | 28mm 缎面侧嵌中的微缩暗提花 | 梅紫黑羊毛粘胶 | 成熟商务款 |
| `PT16 SHADOW CARGO` | 微桶形模块 Cargo | 纹样藏于侧缝扩容腔与小腿拉链口 | 暗橄榄黑 ripstop | 隐藏机能款 |
| `PT17 PUDDLE ASCENT` | 低腰超宽堆脚 | 从裤脚向上清晰→断裂→消隐 | 烟灰蓝黑 13oz 丹宁 | 造型主视觉款 |
| `PT18 CURVE SIGNAL` | 女性高腰曲线微喇 | 三段尺度直接落在本布，无框无补丁 | 暗血红黑弹力斜纹 | 女性支线核心款 |

## 3. 正侧背概念板

- [PT11 RELAY COLUMN](../assets/ss27-pants-side-motif-round2/01-pt11-relay-column.png)
- [PT12 ARC VEIL](../assets/ss27-pants-side-motif-round2/02-pt12-arc-veil.png)
- [PT13 GHOST TRACK](../assets/ss27-pants-side-motif-round2/03-pt13-ghost-track.png)
- [PT14 RIFT FLARE](../assets/ss27-pants-side-motif-round2/04-pt14-rift-flare.png)
- [PT15 NOCTURNE TAILOR II](../assets/ss27-pants-side-motif-round2/05-pt15-nocturne-tailor-ii.png)
- [PT16 SHADOW CARGO](../assets/ss27-pants-side-motif-round2/06-pt16-shadow-cargo.png)
- [PT17 PUDDLE ASCENT](../assets/ss27-pants-side-motif-round2/07-pt17-puddle-ascent.png)
- [PT18 CURVE SIGNAL](../assets/ss27-pants-side-motif-round2/08-pt18-curve-signal.png)

## 4. 视觉 QA

- `PT11`：识别度最直接，适合成为长期核心款；侧链密度最高但仍未侵入主体正面。
- `PT12`：版型与纹样关系最建筑化；窗口只是遮罩，不改变 V2 拓扑。
- `PT13`：残影清楚但保持不等宽双轨，与三条纹体系有明显距离。
- `PT14`：首稿的膝部矩形带已废止；正式图只保留本布自然间隔。
- `PT15`：色彩与商务成熟度最佳，远看近乎纯色，近看才识别纹样。
- `PT16`：没有外挂补丁；纹样需要侧缝拉链打开后才完整出现。
- `PT17`：社媒视觉最强，深化时要控制洗水与金线面积，避免过度复古。
- `PT18`：首稿的瑜伽裤感和框状分区已废止；正式图改为有腰头、腰省和中线的曲线剪裁微喇裤。

本轮概念图用于款式与视觉审核。图像模型仍可能对细小节点产生像素级简化；被选中的款式必须回到原始 V2 母版，以确定性裁切和遮罩建立侧纹展开图。

## 5. 文件与下一确认门

- [资产清单 manifest.json](../assets/ss27-pants-side-motif-round2/manifest.json)
- [最终提示词 prompts.md](../assets/ss27-pants-side-motif-round2/prompts.md)

请对 `PT11–PT18` 分别给出“保留 / 修改 / 归档”。完成选择后，只对保留款深化 `STRAIGHT / CURVE`、`REGULAR / LONG`、POM、BOM、侧纹展开与工艺技术图。

