from __future__ import annotations

import argparse
from pathlib import Path

from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.pagesizes import A3, landscape
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader


ROOT = Path(__file__).resolve().parent.parent
ASSET_ROOT = ROOT / "assets" / "motion-contour-v2-vector"
SVG_DIR = ASSET_ROOT / "svg"
PROOF_DIR = ASSET_ROOT / "proof"
PDF_DIR = ROOT / "output" / "pdf"
REFERENCE = ROOT / "assets" / "motion-contour-round1" / "05-relay-veil-edge-gilded-v2.png"
PDF_OUT = PDF_DIR / "MOVERNO_Motion_Contour_V2_Edge_Gilding_Tech_Sheet.pdf"

TILE_W = 240.0
TILE_H = 360.0
MODULE_H = 180.0
FOIL_W = 0.60

OBSIDIAN = "#0D0D0F"
GRAPHITE = "#25262A"
GRAPHITE_DEEP = "#17181B"
BONE = "#D9D4C8"
NICKEL = "#73777A"
BLOOD = "#5B1F25"
GOLD = "#A4874F"
GOLD_DARK = "#705A35"
GOLD_LIGHT = "#C7AA6A"


def f(value: float) -> str:
    text = f"{value:.2f}"
    return text.rstrip("0").rstrip(".")


def panel_path(cx: float, y: float, side: int) -> str:
    # One production-clean panel half. side=-1 is left, side=1 is right.
    x1 = cx + side * 6
    x2 = cx + side * 14
    x3 = cx + side * 30
    x4 = cx + side * 45
    return " ".join(
        [
            f"M {f(x1)} {f(y + 8)}",
            f"L {f(x2)} {f(y + 14)}",
            f"C {f(x3)} {f(y + 24)} {f(x4)} {f(y + 28)} {f(x4)} {f(y + 48)}",
            f"L {f(x4)} {f(y + 120)}",
            f"C {f(x4)} {f(y + 140)} {f(x3)} {f(y + 151)} {f(x2)} {f(y + 166)}",
            f"L {f(x1)} {f(y + 172)}",
            "Z",
        ]
    )


def module_positions() -> list[tuple[float, float]]:
    positions: list[tuple[float, float]] = []
    for y in (-MODULE_H, 0.0, MODULE_H):
        positions.append((60.0, y))
    for y in (-90.0, 90.0, 270.0):
        positions.append((180.0, y))
    return positions


def node_positions() -> list[tuple[float, float]]:
    positions: list[tuple[float, float]] = []
    for y in (0.0, 180.0, 360.0):
        positions.append((60.0, y))
    for y in (-90.0, 90.0, 270.0, 450.0):
        positions.append((180.0, y))
    return positions


def panel_elements(fill: str, stroke: str | None = None, stroke_width: float = 0.0, opacity: float = 1.0) -> str:
    chunks: list[str] = []
    stroke_attr = "none" if stroke is None else stroke
    for cx, y in module_positions():
        for side in (-1, 1):
            chunks.append(
                f'<path d="{panel_path(cx, y, side)}" fill="{fill}" stroke="{stroke_attr}" '
                f'stroke-width="{f(stroke_width)}" stroke-linejoin="round" opacity="{f(opacity)}"/>'
            )
    return "\n".join(chunks)


def node_elements(
    fill: str,
    stroke: str | None = None,
    stroke_width: float = 0.0,
    center_fill: str = GRAPHITE_DEEP,
    include_center: bool = True,
) -> str:
    chunks: list[str] = []
    stroke_attr = "none" if stroke is None else stroke
    for cx, y in node_positions():
        for offset in (-6.8, 6.8):
            x = cx + offset
            points = f"{f(x)},{f(y - 3.4)} {f(x + 3.2)},{f(y)} {f(x)},{f(y + 3.4)} {f(x - 3.2)},{f(y)}"
            chunks.append(
                f'<polygon points="{points}" fill="{fill}" stroke="{stroke_attr}" '
                f'stroke-width="{f(stroke_width)}" stroke-linejoin="round"/>'
            )
        if include_center:
            points = f"{f(cx)},{f(y - 2.7)} {f(cx + 2.7)},{f(y)} {f(cx)},{f(y + 2.7)} {f(cx - 2.7)},{f(y)}"
            chunks.append(
                f'<polygon points="{points}" fill="{center_fill}" stroke="{stroke_attr}" '
                f'stroke-width="{f(stroke_width)}" stroke-linejoin="round"/>'
            )
    return "\n".join(chunks)


def svg_root(body: str, width: float, height: float, view_box: str | None = None, metadata: str = "") -> str:
    box = view_box or f"0 0 {f(width)} {f(height)}"
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{f(width)}mm" height="{f(height)}mm" viewBox="{box}">
  <title>MOVERNO Motion Contour V2</title>
  <desc>{metadata}</desc>
{body}
</svg>
'''


def master_svg() -> str:
    body = f'''  <g id="SUBSTRATE_OBSIDIAN" data-spot="OBSIDIAN {OBSIDIAN}">
    <rect x="0" y="0" width="{f(TILE_W)}" height="{f(TILE_H)}" fill="{OBSIDIAN}"/>
  </g>
  <g id="FOIL_GOLD_EDGE" data-spot="FOIL_GOLD_EDGE {GOLD}">
{indent(panel_elements("none", GOLD, FOIL_W), 4)}
  </g>
  <g id="TONAL_GRAPHITE_PANEL" data-spot="GRAPHITE {GRAPHITE}">
{indent(panel_elements(GRAPHITE), 4)}
  </g>
  <g id="DRIED_BLOOD_NODE" data-spot="DRIED_BLOOD {BLOOD}">
{indent(node_elements(BLOOD, GOLD, 0.28), 4)}
  </g>'''
    return svg_root(
        body,
        TILE_W,
        TILE_H,
        metadata="Editable seamless repeat. Tile 240 x 360 mm. Gold is restricted to 0.60 mm panel perimeter strokes and node bevels.",
    )


def preview_svg() -> str:
    defs = f'''  <defs>
    <linearGradient id="panelDepth" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="{GRAPHITE_DEEP}"/>
      <stop offset="0.70" stop-color="{GRAPHITE}"/>
      <stop offset="1" stop-color="#30343A"/>
    </linearGradient>
    <linearGradient id="edgeGilt" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{GOLD_DARK}"/>
      <stop offset="0.45" stop-color="{GOLD_LIGHT}"/>
      <stop offset="1" stop-color="{GOLD_DARK}"/>
    </linearGradient>
  </defs>'''
    body = f'''{defs}
  <rect x="0" y="0" width="{f(TILE_W)}" height="{f(TILE_H)}" fill="{OBSIDIAN}"/>
  <g id="EDGE_GILT_PREVIEW">
{indent(panel_elements("url(#panelDepth)", "url(#edgeGilt)", FOIL_W), 4)}
  </g>
  <g id="NODE_PREVIEW">
{indent(node_elements(BLOOD, GOLD_LIGHT, 0.28), 4)}
  </g>'''
    return svg_root(
        body,
        TILE_W,
        TILE_H,
        metadata="Visual proof only. Dark interiors stay free of warm metallic fill; gilding is perimeter-only.",
    )


def separation_svg(kind: str) -> str:
    if kind == "tonal":
        content = panel_elements("#000000")
        metadata = "GRAPHITE tonal panel plate. Black indicates print or tonal surface treatment."
    elif kind == "foil":
        content = panel_elements("none", "#000000", FOIL_W) + "\n" + node_elements(
            "none", "#000000", 0.28, center_fill="none"
        )
        metadata = "FOIL_GOLD_EDGE plate. Black indicates foil only. Convert strokes to outlines before die or screen output."
    elif kind == "node":
        content = node_elements("#000000", include_center=False)
        metadata = "DRIED_BLOOD node plate. Black indicates the hidden red accent layer."
    else:
        raise ValueError(kind)
    body = f'''  <rect x="0" y="0" width="{f(TILE_W)}" height="{f(TILE_H)}" fill="#FFFFFF"/>
  <g id="{kind.upper()}_PLATE">
{indent(content, 4)}
  </g>
  <g id="L_REGISTRATION_MARKS" fill="none" stroke="#000000" stroke-width="0.25">
    <path d="M 3 12 L 3 3 L 12 3"/><path d="M 228 3 L 237 3 L 237 12"/>
    <path d="M 3 348 L 3 357 L 12 357"/><path d="M 228 357 L 237 357 L 237 348"/>
  </g>'''
    return svg_root(body, TILE_W, TILE_H, metadata=metadata)


def seam_proof_svg() -> str:
    tile = preview_svg().split("<svg", 1)[1]
    tile_body = tile.split(">", 1)[1].rsplit("</svg>", 1)[0]
    chunks = [f'  <rect x="0" y="0" width="{f(TILE_W * 3)}" height="{f(TILE_H * 3)}" fill="{OBSIDIAN}"/>']
    for row in range(3):
        for col in range(3):
            chunks.append(f'  <g transform="translate({f(col * TILE_W)} {f(row * TILE_H)})">{tile_body}</g>')
    chunks.append(
        f'''  <g id="SEAM_GUIDES" fill="none" stroke="#D9D4C8" stroke-width="0.35" stroke-dasharray="4 4" opacity="0.72">
    <path d="M {f(TILE_W)} 0 V {f(TILE_H * 3)} M {f(TILE_W * 2)} 0 V {f(TILE_H * 3)}"/>
    <path d="M 0 {f(TILE_H)} H {f(TILE_W * 3)} M 0 {f(TILE_H * 2)} H {f(TILE_W * 3)}"/>
  </g>'''
    )
    return svg_root(
        "\n".join(chunks),
        TILE_W * 3,
        TILE_H * 3,
        metadata="Three by three seam proof. Dashed Bone Ash guides mark tile joins and are not production artwork.",
    )


def line_test_svg() -> str:
    rows = []
    widths = [0.35, 0.45, 0.60]
    y_values = [22, 42, 62]
    for width, y in zip(widths, y_values):
        rows.append(f'<path d="M 42 {y} C 72 {y - 11} 103 {y + 11} 134 {y}" fill="none" stroke="#000000" stroke-width="{f(width)}"/>')
        rows.append(f'<text x="8" y="{f(y + 2.5)}" font-size="5" font-family="Arial, Microsoft YaHei, sans-serif">{f(width)} mm edge</text>')
    gaps = []
    x = 145
    for gap in widths:
        gaps.append(f'<rect x="{f(x)}" y="15" width="2" height="50" fill="#000000"/>')
        gaps.append(f'<rect x="{f(x + 2 + gap)}" y="15" width="2" height="50" fill="#000000"/>')
        gaps.append(f'<text x="{f(x - 1)}" y="72" font-size="4" font-family="Arial, Microsoft YaHei, sans-serif">{f(gap)}</text>')
        x += 11
    body = f'''  <rect x="0" y="0" width="180" height="80" fill="#FFFFFF"/>
  <text x="8" y="9" font-size="5.5" font-weight="700" font-family="Arial, Microsoft YaHei, sans-serif">MOVERNO - FOIL EDGE LINE / GAP TEST</text>
  <g id="EDGE_LINE_TEST">{''.join(rows)}</g>
  <g id="NEGATIVE_GAP_TEST">{''.join(gaps)}</g>'''
    return svg_root(body, 180, 80, metadata="Test strip only. Default edge width is 0.60 mm. 0.35 and 0.45 mm are supplier capability tests.")


def indent(text: str, spaces: int) -> str:
    pad = " " * spaces
    return "\n".join(pad + line for line in text.splitlines())


def write_svgs() -> None:
    SVG_DIR.mkdir(parents=True, exist_ok=True)
    files = {
        "moverno-motion-contour-v2-master-tile.svg": master_svg(),
        "moverno-motion-contour-v2-gilded-preview.svg": preview_svg(),
        "moverno-motion-contour-v2-tonal-plate.svg": separation_svg("tonal"),
        "moverno-motion-contour-v2-foil-plate.svg": separation_svg("foil"),
        "moverno-motion-contour-v2-node-plate.svg": separation_svg("node"),
        "moverno-motion-contour-v2-seam-proof.svg": seam_proof_svg(),
        "moverno-motion-contour-v2-line-test.svg": line_test_svg(),
    }
    for name, text in files.items():
        (SVG_DIR / name).write_text(text, encoding="utf-8")
        print(SVG_DIR / name)


def register_fonts() -> tuple[str, str]:
    candidates = [
        (Path("C:/Windows/Fonts/msyh.ttc"), Path("C:/Windows/Fonts/msyhbd.ttc")),
        (Path("C:/Windows/Fonts/simhei.ttf"), Path("C:/Windows/Fonts/simhei.ttf")),
        (Path("C:/Windows/Fonts/simsun.ttc"), Path("C:/Windows/Fonts/simsun.ttc")),
    ]
    for regular, bold in candidates:
        if regular.exists() and bold.exists():
            pdfmetrics.registerFont(TTFont("MOVERNO-CJK", str(regular)))
            pdfmetrics.registerFont(TTFont("MOVERNO-CJK-Bold", str(bold)))
            return "MOVERNO-CJK", "MOVERNO-CJK-Bold"
    return "Helvetica", "Helvetica-Bold"


FONT, FONT_BOLD = register_fonts()
PAGE_W, PAGE_H = landscape(A3)


def draw_image_fit(c: canvas.Canvas, path: Path, x: float, y: float, w: float, h: float, bg: str | None = None) -> None:
    if bg:
        c.setFillColor(HexColor(bg))
        c.rect(x, y, w, h, stroke=0, fill=1)
    image = ImageReader(str(path))
    iw, ih = image.getSize()
    scale = min(w / iw, h / ih)
    rw, rh = iw * scale, ih * scale
    c.drawImage(image, x + (w - rw) / 2, y + (h - rh) / 2, rw, rh, mask="auto")


def header(c: canvas.Canvas, title: str, subtitle: str, page: int) -> None:
    c.setFillColor(HexColor(OBSIDIAN))
    c.setFont(FONT_BOLD, 18)
    c.drawString(16 * mm, PAGE_H - 18 * mm, title)
    c.setFillColor(HexColor(NICKEL))
    c.setFont(FONT, 8)
    c.drawString(16 * mm, PAGE_H - 25 * mm, subtitle)
    c.setStrokeColor(HexColor(BONE))
    c.setLineWidth(0.5)
    c.line(16 * mm, PAGE_H - 30 * mm, PAGE_W - 16 * mm, PAGE_H - 30 * mm)
    c.setFont(FONT, 7)
    c.drawRightString(PAGE_W - 16 * mm, 10 * mm, f"MOVERNO / 墨维诺    {page:02d}")


def label(c: canvas.Canvas, x: float, y: float, title: str, value: str, width: float) -> None:
    c.setFillColor(HexColor(NICKEL))
    c.setFont(FONT, 7)
    c.drawString(x, y, title)
    c.setFillColor(HexColor(OBSIDIAN))
    c.setFont(FONT_BOLD, 9)
    lines = split_text(value, 31)
    for i, line in enumerate(lines):
        c.drawString(x, y - (6 + i * 5.5) * mm, line)
    c.setStrokeColor(HexColor(BONE))
    c.line(x, y - (10 + max(0, len(lines) - 1) * 5.5) * mm, x + width, y - (10 + max(0, len(lines) - 1) * 5.5) * mm)


def split_text(text: str, count: int) -> list[str]:
    lines = [text[i : i + count] for i in range(0, len(text), count)] or [""]
    punctuation = "。；，、：！？,.!?;:"
    if len(lines) > 1 and lines[-1] and all(char in punctuation for char in lines[-1]):
        lines[-2] += lines[-1]
        lines.pop()
    return lines


def create_pdf() -> None:
    required = [
        PROOF_DIR / "moverno-motion-contour-v2-gilded-preview.png",
        PROOF_DIR / "moverno-motion-contour-v2-master-tile.png",
        PROOF_DIR / "moverno-motion-contour-v2-tonal-plate.png",
        PROOF_DIR / "moverno-motion-contour-v2-foil-plate.png",
        PROOF_DIR / "moverno-motion-contour-v2-node-plate.png",
        PROOF_DIR / "moverno-motion-contour-v2-seam-proof.png",
        PROOF_DIR / "moverno-motion-contour-v2-line-test.png",
    ]
    missing = [str(path) for path in required if not path.exists()]
    if missing:
        raise FileNotFoundError("Missing rendered proofs: " + ", ".join(missing))

    PDF_DIR.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(PDF_OUT), pagesize=landscape(A3), pageCompression=1)
    c.setTitle("MOVERNO Motion Contour V2 - Edge Gilding Technical Sheet")
    c.setAuthor("MOVERNO Brand Development")

    # 1 - Direction lock
    c.setFillColor(HexColor(OBSIDIAN))
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont(FONT_BOLD, 25)
    c.drawString(20 * mm, PAGE_H - 28 * mm, "MOTION CONTOUR V2")
    c.setFont(FONT, 11)
    c.drawString(20 * mm, PAGE_H - 39 * mm, "边缘鎏金无缝矢量母版 / EDGE-GILDED SEAMLESS MASTER")
    c.setFillColor(HexColor(GOLD_LIGHT))
    c.rect(20 * mm, PAGE_H - 48 * mm, 48 * mm, 1.2 * mm, stroke=0, fill=1)
    draw_image_fit(c, REFERENCE, 20 * mm, 25 * mm, 112 * mm, 180 * mm, OBSIDIAN)
    draw_image_fit(c, required[0], 154 * mm, 25 * mm, 112 * mm, 180 * mm, OBSIDIAN)
    c.setFillColor(HexColor(BONE))
    c.setFont(FONT, 8)
    c.drawString(20 * mm, 18 * mm, "左：已确认 V2 视觉参考    右：确定性矢量重绘预览")
    c.setFillColor(white)
    c.setFont(FONT_BOLD, 12)
    c.drawString(292 * mm, 190 * mm, "锁定原则")
    c.setFont(FONT, 9)
    rules = [
        "金色只存在于外轮廓、倒角及极少节点边缘。",
        "面板内部仅使用黑曜 / 石墨冷色暗面。",
        "不允许金粉、金雾、暖色磨损向内部扩散。",
        "本阶段不生成服装，不改变既定重复节奏。",
    ]
    y = 176 * mm
    for rule in rules:
        c.setFillColor(HexColor(GOLD_LIGHT))
        c.circle(295 * mm, y + 1.5 * mm, 1.4 * mm, stroke=0, fill=1)
        c.setFillColor(white)
        c.drawString(302 * mm, y, rule)
        y -= 17 * mm
    c.setFillColor(HexColor(BONE))
    c.setFont(FONT, 8)
    c.drawString(292 * mm, 72 * mm, "版本：2026-08-28")
    c.drawString(292 * mm, 62 * mm, "状态：内部打样稿 / 未封样")
    c.drawString(292 * mm, 52 * mm, "重复尺寸：240 x 360 mm")
    c.showPage()

    # 2 - Master tile
    header(c, "01 无缝矢量重复单元", "生产主文件采用平面专色图层；立体光影仅作为材质目标参考。", 2)
    draw_image_fit(c, required[1], 22 * mm, 28 * mm, 146 * mm, 226 * mm, OBSIDIAN)
    c.setFillColor(HexColor(GOLD))
    c.setLineWidth(0.8)
    c.line(22 * mm, 20 * mm, 168 * mm, 20 * mm)
    c.setFont(FONT_BOLD, 8)
    c.drawCentredString(95 * mm, 15 * mm, "240 mm")
    c.line(176 * mm, 28 * mm, 176 * mm, 254 * mm)
    c.saveState()
    c.translate(184 * mm, 141 * mm)
    c.rotate(90)
    c.drawCentredString(0, 0, "360 mm")
    c.restoreState()
    label(c, 205 * mm, 238 * mm, "图层 01", f"SUBSTRATE_OBSIDIAN {OBSIDIAN}", 82 * mm)
    label(c, 205 * mm, 202 * mm, "图层 02", f"TONAL_GRAPHITE_PANEL {GRAPHITE}", 82 * mm)
    label(c, 205 * mm, 166 * mm, "图层 03", f"FOIL_GOLD_EDGE {GOLD}", 82 * mm)
    label(c, 205 * mm, 130 * mm, "图层 04", f"DRIED_BLOOD_NODE {BLOOD}", 82 * mm)
    label(c, 302 * mm, 238 * mm, "边缘线宽", "默认 0.60 mm；0.35 / 0.45 mm 只用于试机。", 94 * mm)
    label(c, 302 * mm, 190 * mm, "金色覆盖", "设计目标约 3%-5%；RIP 后复测，不得扩大到面板内部。", 94 * mm)
    label(c, 302 * mm, 142 * mm, "重复结构", "双列错位；第二列垂直偏移 90 mm；四边连续。", 94 * mm)
    label(c, 302 * mm, 94 * mm, "缩放规则", "允许整体等比缩放；禁止单独加粗金边补偿小尺寸。", 94 * mm)
    c.showPage()

    # 3 - Color separations
    header(c, "02 专色分层与出片", "所有分色稿均为黑版显示；白色代表不出片区域。", 3)
    plate_w, plate_h = 102 * mm, 184 * mm
    xs = [18 * mm, 159 * mm, 300 * mm]
    titles = ["TONAL GRAPHITE", "FOIL GOLD EDGE", "DRIED BLOOD NODE"]
    images = [required[2], required[3], required[4]]
    notes = ["石墨面层 / 哑光或低光泽色差", "鎏金边缘 / 0.60 mm 默认线宽", "暗血红节点 / 总面积保持低于 3%"]
    for x, title, image_path, note in zip(xs, titles, images, notes):
        c.setFillColor(HexColor(OBSIDIAN))
        c.setFont(FONT_BOLD, 10)
        c.drawString(x, 244 * mm, title)
        draw_image_fit(c, image_path, x, 48 * mm, plate_w, plate_h, "#FFFFFF")
        c.setFillColor(HexColor(GRAPHITE))
        c.setFont(FONT, 7.5)
        c.drawString(x, 39 * mm, note)
    c.setFillColor(HexColor(BLOOD))
    c.setFont(FONT_BOLD, 9)
    c.drawString(18 * mm, 24 * mm, "出片硬规则：FOIL 层不得填充面板内部；转曲前保留原始 live-stroke 文件，转曲后另存工厂版。")
    c.showPage()

    # 4 - Seam proof
    header(c, "03 接缝与重复校验", "虚线为 240 x 360 mm 单元边界，只用于 QA，不进入生产图层。", 4)
    draw_image_fit(c, required[5], 18 * mm, 24 * mm, 206 * mm, 228 * mm, OBSIDIAN)
    c.setFillColor(HexColor(OBSIDIAN))
    c.setFont(FONT_BOLD, 11)
    c.drawString(250 * mm, 232 * mm, "验收点")
    checks = [
        "左右拼接后列间距保持 120 mm。",
        "上下拼接后第二列仍维持 90 mm 错位。",
        "边界节点无断线、重线或双层烫金。",
        "金边仅沿轮廓，不跨入石墨面层。",
        "四角 L 形套准标记不属于品牌图案。",
        "输出前检查路径方向、孤立点与重叠段。",
    ]
    y = 214 * mm
    for i, check in enumerate(checks, 1):
        c.setFillColor(HexColor(GOLD))
        c.circle(254 * mm, y + 1.3 * mm, 2.2 * mm, stroke=0, fill=1)
        c.setFillColor(white if False else HexColor(OBSIDIAN))
        c.setFont(FONT_BOLD, 7)
        c.drawCentredString(254 * mm, y - 1 * mm, str(i))
        c.setFillColor(HexColor(GRAPHITE))
        c.setFont(FONT, 9)
        c.drawString(263 * mm, y, check)
        y -= 23 * mm
    c.setFillColor(HexColor(BONE))
    c.rect(246 * mm, 38 * mm, 151 * mm, 41 * mm, stroke=0, fill=1)
    c.setFillColor(HexColor(OBSIDIAN))
    c.setFont(FONT_BOLD, 9)
    c.drawString(254 * mm, 66 * mm, "接缝放行标准")
    c.setFont(FONT, 8)
    c.drawString(254 * mm, 54 * mm, "100% 显示检查无跳线；3 x 3 拼接无节奏断裂；")
    c.drawString(254 * mm, 45 * mm, "试烫后边缘偏移目标控制在 +/-0.35 mm 内。")
    c.showPage()

    # 5 - Foil test and factory handoff
    header(c, "04 试烫条与工厂交接", "先试机，再决定最终线宽；严禁用增加面内金色来补偿工艺损耗。", 5)
    draw_image_fit(c, required[6], 18 * mm, 166 * mm, 252 * mm, 90 * mm, "#FFFFFF")
    c.setFillColor(HexColor(OBSIDIAN))
    c.setFont(FONT_BOLD, 11)
    c.drawString(292 * mm, 238 * mm, "建议试烫矩阵")
    rows = [
        ("A", "0.35 mm", "能力下限观察", "仅记录，不默认量产"),
        ("B", "0.45 mm", "精细替代", "节点与曲率区重点检查"),
        ("C", "0.60 mm", "默认方案", "优先量产候选"),
    ]
    y = 219 * mm
    for code, width, purpose, status in rows:
        c.setFillColor(HexColor(GOLD))
        c.rect(292 * mm, y - 5 * mm, 14 * mm, 10 * mm, stroke=0, fill=1)
        c.setFillColor(HexColor(OBSIDIAN))
        c.setFont(FONT_BOLD, 8)
        c.drawCentredString(299 * mm, y - 2 * mm, code)
        c.setFont(FONT_BOLD, 8)
        c.drawString(313 * mm, y, width)
        c.setFont(FONT, 8)
        c.drawString(343 * mm, y, purpose)
        c.drawString(385 * mm, y, status)
        y -= 18 * mm
    c.setFillColor(HexColor(OBSIDIAN))
    c.setFont(FONT_BOLD, 11)
    c.drawString(18 * mm, 142 * mm, "工厂交接清单")
    checklist = [
        "确认基材、底色与烫金方式：织物转印 / 丝印胶浆烫金 / 局部压烫不可混用同一参数。",
        "按 A/B/C 三档线宽试烫，并记录温度、压力、时间、离型方式及冷/热撕条件。",
        "检查曲线拐点、节点、小间隙、接缝重复、摩擦后脱落及洗后边缘完整度。",
        "若套准不足，优先整体向外修正轮廓；禁止把金色向面板中央增宽。",
        "封样前保留材料批次、烫金膜型号、试机照片和实际尺寸报告。",
    ]
    y = 124 * mm
    for item in checklist:
        c.setFillColor(HexColor(BLOOD))
        c.rect(20 * mm, y - 1 * mm, 3 * mm, 3 * mm, stroke=0, fill=1)
        c.setFillColor(HexColor(GRAPHITE))
        c.setFont(FONT, 8.5)
        c.drawString(29 * mm, y, item)
        y -= 18 * mm
    c.setFillColor(HexColor(BONE))
    c.rect(18 * mm, 22 * mm, 382 * mm, 28 * mm, stroke=0, fill=1)
    c.setFillColor(HexColor(OBSIDIAN))
    c.setFont(FONT_BOLD, 8.5)
    c.drawString(25 * mm, 39 * mm, "本稿为打样起点，不替代供应商设备参数、材料兼容性测试或最终封样。")
    c.setFont(FONT, 8)
    c.drawString(25 * mm, 29 * mm, "下一确认门：审阅矢量节奏与边缘鎏金出片逻辑，确认后再制作金属提花、刺绣和五金压印版本。")
    c.showPage()

    c.save()
    print(PDF_OUT)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--svgs", action="store_true")
    parser.add_argument("--pdf", action="store_true")
    args = parser.parse_args()
    if not args.svgs and not args.pdf:
        parser.error("Choose --svgs or --pdf")
    if args.svgs:
        write_svgs()
    if args.pdf:
        create_pdf()


if __name__ == "__main__":
    main()
