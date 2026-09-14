# MOVERNO SS27 裤装产品详情试制

- 日期：2026-09-08
- 范围：PT19、PT25-A、PT28
- 交付方式：每款一张详情长图＋六模块独立切片＋可编辑 SVG
- 主视觉生成：OpenAI 内置 ImageGen
- 品牌排版：确定性 SVG
- V2 母版 SHA-256：`6974B12D59755D954DA3B748736218DB78C7B3542D954BEA3EC1E1F040689D76`

## 产品叙事

| 款式 | 核心价值 | 宣传主张 | 长图 |
| --- | --- | --- | --- |
| PT19 FLUID RELAY | 柔性防护 | 柔软不是退让，是另一种防护。 | [查看](../assets/ss27-pants-product-details-pilot/posters/19-fluid-relay-detail.png) |
| PT25 MINERAL PUDDLE | 耐久不规则 | 磨损留下时间，轮廓保留态度。 | [查看](../assets/ss27-pants-product-details-pilot/posters/25a-mineral-puddle-neutral-gray-detail.png) |
| PT28 APERTURE CARGO | 安静反叛 | 把功能藏进结构，把不同留给靠近。 | [查看](../assets/ss27-pants-product-details-pilot/posters/28-aperture-cargo-detail.png) |

## 设计修订记录

- 首轮人工 QA 发现三视图区域以 `slice` 方式填充，导致裤脚被裁切；已改为完整适配显示。
- 首轮品牌触点标题会把 `MV RELAY` 与 `Veil Gate` 拆字换行；已改为单行短标题。
- 品牌触点图形已按实际类型区分抽绳端头、腰扣、拉链头、后腰门徽、织唛和暗血红套结。
- 正式 MOVERNO、Veil Gate、MV RELAY 均来自项目锁定资产，不沿用概念图的生成符号。

## 验证结果

- 自动 QA：3/3 款通过。
- 输出：3 张 1080 × 5080 px 长图、3 份自包含 SVG、18 张模块切片、3 张 375 px 移动端预览。
- 切片回拼：三款均与原长图逐像素一致。
- ROI：全部局部裁切位于对应源概念图范围内。
- 品牌资产：MOVERNO 字标、Veil Gate、MV RELAY 均逐文件嵌入。
- V2 母版哈希：`6974B12D59755D954DA3B748736218DB78C7B3542D954BEA3EC1E1F040689D76`。

## 文件

- [本地审核页](../assets/ss27-pants-product-details-pilot/index.html)
- [三款总览](../assets/ss27-pants-product-details-pilot/overview.png)
- [说明](../assets/ss27-pants-product-details-pilot/README.md)
- [资产清单](../assets/ss27-pants-product-details-pilot/manifest.json)
- [QA 报告](../assets/ss27-pants-product-details-pilot/qa-report.json)

## 下一确认门

用户审核三款的主视觉、文字语气、品牌触点和六模块节奏。确认后将同一结构扩展至其余 12 张用户指定概念图，其中 PT22、PT25、PT27 的蓝色版本作为 A/B 对照，不进入无蓝主系列。
