# MOVERNO · SS27 模特上身图 / Round 1

本目录归档本次 **12 款短袖 × 3 类成年虚拟模特 = 36 张最终候选图**。黑人男、亚裔男、亚裔女各 12 张；每款在三人之间轮换正面、侧前方与背面。不是每位模特各三视图。

- [在 GitHub 浏览全部 36 张图片](LOOKBOOK.md)
- [按款式查找文件与视角](delivery-manifest.json)
- [离线对照审核页](review.html)（下载目录或完整 ZIP 后，用浏览器打开）
- [完整归档 ZIP](https://github.com/Royal44-k/MOVERNO/releases/tag/model-tryon-round1-2026-09-14)
- [提示词](prompts/prompt-set-final.json) · [补修提示词](prompts/correction-prompts-final.json)
- [审核记录](docs/REVIEW-NOTES.md) · [来源与校验映射](source-map.json) · [校验清单](checksums.sha256)

## 归档结构

```text
final/                   36 张最终 PNG，1024 × 1536
references/designs/      12 张本次选定的款式原图
references/styling/       2 张用户提供的裤鞋搭配参考
references/identity/      1 张原品牌门徽
prompts/                 最终生成及补修提示词
archive/superseded/       2 张被替代的初稿，勿当最终图片使用
archive/prompts/          初始与中间提示词，保留创作过程
archive/                 早期清单与原交付说明
docs/                    审核与使用边界
qa/original/             原审核页面截图与验证记录
qa/current/              整理后的页面检查结果
tools/                   可移植的页面校验脚本
review.html              本地三模特／原款对照页面
LOOKBOOK.md              GitHub 可直接浏览的图片目录
delivery-manifest.json   当前最终文件清单；路径以本目录为基准
source-map.json          原 67 份文件的来源、目标、SHA-256
checksums.sha256         本目录文件的 SHA-256，不含清单自身
```

## 修订与来源

LOOK 01 亚裔女使用 `final/look-01-asian-woman-v2.png`，去除了错误出现在后腰的裤装抽绳；LOOK 06 亚裔男使用 `final/look-06-asian-man-v2.png`，补回下摆 MOVERNO 小字。两份初稿仅在历史目录保留。

原工作目录的 **67 份文件全部收录**，其中 55 张 PNG（36 最终图、2 初稿、15 参考图、2 审核截图）逐字节原样复制。公开 JSON 和脚本中的本机路径被改成相对路径或可配置依赖；原文件未改动。提示词里的期望分辨率是历史请求，实际交付以 1024 × 1536 为准。前三款的中文描述只用于检索，不是重新命名款式。

原交付 ZIP 只是已展开文件的重复封装；本次不再次上传含本机路径的旧 ZIP，改为提供包含全部文件与历史记录的可移植完整 ZIP。原交付 ZIP 的名称、大小和哈希另记在 `source-zip-record.json`，供本地追溯。

## 内容边界

图像由内置 ImageGen 生成；StyTrix 仅用于原款约束、多角度搭配与检查方法，没有使用 StyTrix 付费生成。人物为虚拟成年人，不是实拍模特或真实代言人。图中裤鞋是搭配示意，不声称是 Rick Owens 实物、联名或合作。

本目录是**数字上身／宣传候选档案**，不是商品发布批准、量产封样或检测证明。生成图不能保证印花拓扑逐像素一致；正式上架仍需对照实际样衣核对颜色、图案、Logo、衣长、领口与标签。外部款式／搭配参考仅供内部研究，原权利归其权利人，不应直接作为本品牌广告素材。

## 可选复核

在已安装 Node.js 和 Playwright 的环境中，从本目录运行：

```sh
node tools/verify-gallery.cjs
```

可通过 `PLAYWRIGHT_MODULE` 指向已有 Playwright 安装，通过 `BROWSER_EXECUTABLE` 指向已有浏览器。此校验检查图片链接、页面加载与窄屏宽度，不替代美术、实物或权利审核。

