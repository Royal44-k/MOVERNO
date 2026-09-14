# MOVERNO / 墨维诺 SS27 短袖 V2 铺装 Round 1

日期：2026-08-28  
状态：八款正背铺装预览已生成并完成内部文件校验，等待用户逐款或整体确认；未确认前不进入高保真三视图。

## 唯一视觉母版

- 文件：`assets/motion-contour-round1/05-relay-veil-edge-gilded-v2.png`
- 规格：1024 x 1024，RGB。
- SHA-256：`6974B12D59755D954DA3B748736218DB78C7B3542D954BEA3EC1E1F040689D76`
- 本轮采用确定性裁切、循环平铺和衣身遮罩，不调用图像生成模型重释纹样。
- 方向、色彩、节点、连接关系与边缘鎏金来源均保持锁定；不镜像、不旋转、不重绘、不改色。
- 统一密度：一个完整 1024 x 1024 V2 方形母版对应每个检测到的正面或背面完整衣身宽度，局部款只改变可见遮罩。

## 八款矩阵

| 款号 | 基础版型 | 铺装 | 预览文件 |
|---|---|---|---|
| `SS27-TS01` | `FRAME` | `FRONT MONOLITH` | `assets/ss27-tee-v2-placement-round1/ss27-ts01-front-monolith.png` |
| `SS27-TS02` | `FRAME` | `BACK GATE` | `assets/ss27-tee-v2-placement-round1/ss27-ts02-back-gate.png` |
| `SS27-TS03` | `TRACE` | `CHEST SIGNAL` | `assets/ss27-tee-v2-placement-round1/ss27-ts03-chest-signal.png` |
| `SS27-TS04` | `TRACE` | `HEM ASCENT` | `assets/ss27-tee-v2-placement-round1/ss27-ts04-hem-ascent.png` |
| `SS27-TS05` | `RHYTHM V` | `SHOULDER CIRCUIT` | `assets/ss27-tee-v2-placement-round1/ss27-ts05-shoulder-circuit.png` |
| `SS27-TS06` | `RHYTHM V` | `FULL VEIL` | `assets/ss27-tee-v2-placement-round1/ss27-ts06-full-veil.png` |
| `SS27-TS07` | `NOIR POLO` | `SIDE RELAY` | `assets/ss27-tee-v2-placement-round1/ss27-ts07-side-relay.png` |
| `SS27-TS08` | `NOIR POLO` | `COMPOSITE RELAY` | `assets/ss27-tee-v2-placement-round1/ss27-ts08-composite-relay.png` |

系列总览：`assets/ss27-tee-v2-placement-round1/00-moverno-ss27-v2-placement-lineup-round1.png`

机器可读记录：`assets/ss27-tee-v2-placement-round1/manifest.json`

## 映射方法与修订

- 生成脚本：`scripts/generate_v2_placement_previews.py`。
- 脚本每次执行先验证 V2 母版 SHA-256；不匹配即停止。
- 从已确认正侧背图中提取正、背视角，只保留与画面中心相连的主衣片遮罩，排除源图中央侧视图可能进入裁切区的细小残片。
- 纹样层只在衣身与款式遮罩交集内显示；领口和领座保持黑色。
- PNG 元数据记录母版路径、母版哈希、基础版型和铺装标识；`manifest.json` 记录八款输出哈希。

## 当前确认门

本轮只确认：八款正背铺装位置、留白比例、各版型与纹样的匹配，以及八款放在一起时的系列节奏。确认后才逐款制作高保真正、侧、背三视图和纹样局部放大；裤装、鞋履、模特、海报、社媒和网站仍后置。
