# 下载、恢复与校验

GitHub 仓库提供归纳、原文档、脚本、标识和代表预览；完整的 **1,660 份素材（约 4.40 GB / 4.09 GiB）**在 [Release](https://github.com/Royal44-k/MOVERNO/releases/tag/brand-archive-2026-09-14) 的 64 个 ZIP 中。ZIP 总大小约 4.02 GB。GitHub 自动生成的 `Source code.zip` 只包含 Git 文件，不包含完整素材。

## 完整恢复

下载/克隆本仓库后，在仓库根目录执行（Python 3.10 或更高）：

```powershell
python scripts/restore_assets.py --download
```

下载到 `.download-cache/`，还原到 `restored-assets/project/` 和 `restored-assets/recovered/`。依次核验 ZIP 和每个恢复文件的 SHA-256。已有同内容文件跳过，遇到不同内容会停止而不会覆盖。

全量恢复另需约 8.5 GB 可用空间用于 ZIP 与解压文件；下载仓库本身的空间另计。无须 Git LFS、API 密钥或付费工具。

## 按模块恢复

组名见[素材目录](ASSET-CATALOG.md)，例如：

```powershell
python scripts/restore_assets.py --download --group logo-direction-01
python scripts/restore_assets.py --download --group footwear-ad-films-round1
python scripts/restore_assets.py --download --group ss27-pants-product-details-full-series
```

较大模块的 `part01`、`part02` 等是各自可解压的标准 ZIP，**不是分卷压缩格式**。恢复完整模块需下载所有部分；每个文件只在本模块的一部分中出现。

也可自行下载 ZIP，然后使用：

```powershell
python scripts/restore_assets.py --cache "D:\Downloads\MOVERNO"
python scripts/restore_assets.py --verify-only
```

如果需要独立浏览 HTML 画廊或重新渲染视频，建议全量恢复以补齐跨模块图片引用。旧脚本部分依赖原机器的绝对路径与工具库，源文件保持原样；在其他电脑运行前，应配置对应依赖和路径。本次验证的是文件恢复与校验，不是所有工程的跨机器重渲染。

## 文件完整性

- `asset-manifest.json/csv`：每个素材的归档路径、字节数、SHA-256、来源、原文件 SHA-256、所属素材包。
- `release-manifest.json`：每个 ZIP 的大小、SHA-256、分组和下载链接。
- `recovery-manifest.json`：会话原图、附件的恢复、重复及原路径不可用记录。
- `redactions.json`：公开文本副本移除 Canva 短分享链接的记录；原文件未修改。
- `VALIDATION.md`：归档校验范围与结果。

原始的历史审阅 ZIP 也被保留。因此完整素材中存在有意的“已展开图片＋原交付 ZIP”双重保存；这有利于保留过去每次交付的原件。
