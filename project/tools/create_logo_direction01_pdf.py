from pathlib import Path

from reportlab.graphics import renderPDF
from reportlab.lib.colors import Color, HexColor, black, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from svglib.svglib import svg2rlg


ROOT = Path(__file__).resolve().parent.parent
SVG_DIR = ROOT / "assets" / "logo-direction-01" / "svg"
OUT_DIR = ROOT / "output" / "pdf"
OUT_FILE = OUT_DIR / "MOVERNO_Logo_Direction01_Refinement.pdf"

PAGE_W, PAGE_H = landscape(A4)
OBSIDIAN = HexColor("#0D0D0F")
GRAPHITE = HexColor("#25262A")
BONE = HexColor("#D9D4C8")
NICKEL = HexColor("#73777A")
BLOOD = HexColor("#5B1F25")


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


def add_page_number(c: canvas.Canvas, number: int) -> None:
    c.setFillColor(NICKEL)
    c.setFont(FONT, 7)
    c.drawRightString(PAGE_W - 16 * mm, 10 * mm, f"MOVERNO / 墨维诺    {number:02d}")


def add_header(c: canvas.Canvas, title: str, subtitle: str, number: int) -> None:
    c.setFillColor(OBSIDIAN)
    c.setFont(FONT_BOLD, 18)
    c.drawString(16 * mm, PAGE_H - 18 * mm, title)
    c.setFillColor(NICKEL)
    c.setFont(FONT, 8)
    c.drawString(16 * mm, PAGE_H - 25 * mm, subtitle)
    c.setStrokeColor(BONE)
    c.setLineWidth(0.6)
    c.line(16 * mm, PAGE_H - 30 * mm, PAGE_W - 16 * mm, PAGE_H - 30 * mm)
    add_page_number(c, number)


def draw_svg(c: canvas.Canvas, filename: str, x: float, y: float, width: float, height: float) -> None:
    drawing = svg2rlg(str(SVG_DIR / filename))
    if drawing is None or drawing.width <= 0 or drawing.height <= 0:
        raise ValueError(f"Unable to read SVG: {filename}")
    scale = min(width / drawing.width, height / drawing.height)
    drawing.scale(scale, scale)
    actual_w = drawing.width * scale
    actual_h = drawing.height * scale
    renderPDF.draw(drawing, c, x + (width - actual_w) / 2, y + (height - actual_h) / 2)


def draw_paragraph(c: canvas.Canvas, text: str, x: float, y: float, width: float, size: float = 9, leading: float = 14, color=GRAPHITE) -> float:
    style = ParagraphStyle(
        "body",
        fontName=FONT,
        fontSize=size,
        leading=leading,
        textColor=color,
        alignment=TA_LEFT,
        spaceAfter=0,
    )
    paragraph = Paragraph(text, style)
    _, height = paragraph.wrap(width, PAGE_H)
    paragraph.drawOn(c, x, y - height)
    return y - height


def page_cover(c: canvas.Canvas) -> None:
    c.setFillColor(OBSIDIAN)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    draw_svg(c, "moverno-stacked-lockup-reverse.svg", 28 * mm, 32 * mm, 88 * mm, 140 * mm)
    c.setFillColor(white)
    c.setFont(FONT_BOLD, 26)
    c.drawString(135 * mm, 122 * mm, "LOGO DIRECTION 01")
    c.setFont(FONT, 12)
    c.drawString(135 * mm, 110 * mm, "锐利切口 / 静默幕隙 / 工程化衬线")
    c.setFillColor(BONE)
    c.setFont(FONT, 9)
    c.drawString(135 * mm, 92 * mm, "内部方向校样 - 非商标注册终稿")
    c.drawString(135 * mm, 84 * mm, "版本：2026-08-27")
    c.setFillColor(BLOOD)
    c.rect(135 * mm, 68 * mm, 30 * mm, 1.2 * mm, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont(FONT, 9)
    c.drawString(135 * mm, 52 * mm, "Different But Excellent.")
    c.showPage()


def page_lockups(c: canvas.Canvas) -> None:
    add_header(c, "01 组合系统", "统一采用已选方向 1 的同一矢量轮廓，不混入其他方案。", 2)
    draw_svg(c, "moverno-primary-wordmark.svg", 18 * mm, 109 * mm, 124 * mm, 37 * mm)
    draw_svg(c, "moverno-bilingual-wordmark.svg", 154 * mm, 94 * mm, 124 * mm, 58 * mm)
    draw_svg(c, "moverno-stacked-lockup.svg", 20 * mm, 23 * mm, 73 * mm, 78 * mm)
    draw_svg(c, "moverno-standalone-emblem.svg", 111 * mm, 31 * mm, 40 * mm, 64 * mm)
    c.setFillColor(OBSIDIAN)
    c.roundRect(166 * mm, 28 * mm, 112 * mm, 62 * mm, 3 * mm, stroke=0, fill=1)
    draw_svg(c, "moverno-bilingual-wordmark-reverse.svg", 174 * mm, 39 * mm, 96 * mm, 40 * mm)
    c.setFillColor(GRAPHITE)
    c.setFont(FONT, 8)
    c.drawString(18 * mm, 104 * mm, "英文主字标")
    c.drawString(154 * mm, 92 * mm, "中英双语组合")
    c.drawString(20 * mm, 19 * mm, "纵向组合")
    c.drawString(111 * mm, 27 * mm, "独立门徽")
    c.drawString(166 * mm, 23 * mm, "反白应用")
    c.showPage()


def page_emblem(c: canvas.Canvas) -> None:
    add_header(c, "02 幕隙门徽", "两条错位纵弧围出窄光缝，在整体轮廓中形成抽象 M。", 3)
    draw_svg(c, "moverno-standalone-emblem.svg", 24 * mm, 33 * mm, 76 * mm, 130 * mm)
    c.setStrokeColor(BONE)
    c.setLineWidth(0.8)
    c.rect(119 * mm, 101 * mm, 44 * mm, 66 * mm, stroke=1, fill=0)
    draw_svg(c, "moverno-standalone-emblem.svg", 130 * mm, 112 * mm, 22 * mm, 44 * mm)
    c.setFillColor(GRAPHITE)
    c.setFont(FONT_BOLD, 10)
    c.drawString(177 * mm, 154 * mm, "安全区")
    draw_paragraph(c, "以门徽宽度的 1/4 作为 X；门徽四周至少保留 1X。不得让文字、缝线、孔位或裁片边缘侵入。", 177 * mm, 146 * mm, 99 * mm)
    c.setFont(FONT_BOLD, 10)
    c.drawString(177 * mm, 110 * mm, "造型边界")
    draw_paragraph(c, "机甲感来自分节秩序与受力结构，不增加十字、皇冠、盾牌、武器或游戏阵营符号。", 177 * mm, 102 * mm, 99 * mm)
    c.setFont(FONT_BOLD, 10)
    c.drawString(177 * mm, 67 * mm, "生产提示")
    draw_paragraph(c, "当前 SVG 为从已确认概念图生成的方向矢量。注册、刺绣与五金开模前仍需完成专业光学校正、节点清理及图形近似检索。", 177 * mm, 59 * mm, 99 * mm)
    c.showPage()


def page_minimum_sizes(c: canvas.Canvas) -> None:
    add_header(c, "03 最小尺寸与工艺门", "可识别不等于可生产；低于绝对最小值时改用更大的应用位。", 4)
    rows = [
        ("独立门徽", "24px 绝对最小 / 32px 推荐", "8mm 高", "16px 可辨识 M，但光缝不稳定，不批准公开数字应用"),
        ("英文主字标", "24px 高绝对最小 / 32px 高推荐", "8mm 高", "16px 衬线和 V/E 切口损失明显"),
        ("中英双语组合", "64px 高绝对最小 / 94px 高推荐", "14mm 高", "32px 中文副标不可稳定识读"),
        ("纵向组合", "不用于小图标", "25mm 高", "优先用于吊牌、包装、品牌手册与门店物料"),
    ]
    x0 = 18 * mm
    widths = [47 * mm, 66 * mm, 40 * mm, 102 * mm]
    y = 145 * mm
    headers = ["资产", "数字端", "印刷端", "判定"]
    c.setFillColor(OBSIDIAN)
    c.rect(x0, y, sum(widths), 11 * mm, stroke=0, fill=1)
    x = x0
    c.setFillColor(white)
    c.setFont(FONT_BOLD, 8)
    for header, width in zip(headers, widths):
        c.drawString(x + 3 * mm, y + 3.5 * mm, header)
        x += width
    y -= 16 * mm
    for index, row in enumerate(rows):
        if index % 2 == 0:
            c.setFillColor(Color(0.96, 0.96, 0.95))
            c.rect(x0, y - 13 * mm, sum(widths), 16 * mm, stroke=0, fill=1)
        x = x0
        for value, width in zip(row, widths):
            draw_paragraph(c, value, x + 3 * mm, y, width - 6 * mm, size=7.4, leading=9.5)
            x += width
        y -= 16 * mm

    c.setFillColor(GRAPHITE)
    c.setFont(FONT_BOLD, 9)
    c.drawString(18 * mm, 62 * mm, "相对比例示意（非屏幕 1:1）")
    sizes = [(16, 16 * mm), (24, 24 * mm), (32, 32 * mm), (94, 47 * mm)]
    x = 18 * mm
    for px, box_h in sizes:
        draw_svg(c, "moverno-standalone-emblem.svg", x, 17 * mm, box_h * 0.7, box_h)
        c.setFont(FONT, 7)
        c.drawCentredString(x + box_h * 0.35, 13 * mm, f"{px}px")
        x += box_h + 13 * mm
    c.showPage()


def page_language_and_color(c: canvas.Canvas) -> None:
    add_header(c, "04 品牌语言与单色边界", "Logo 阶段仅批准黑、白与反白；暗血红不用于主标填充。", 5)
    statements = [
        ("品牌使命", "让黑夜不必黯然，让差异不必喧哗。"),
        ("长期信念", "Different But Excellent."),
        ("产品传播语", "暗中移动，保持柔软 / MOVE DARK. STAY SOFT."),
        ("四项价值", "柔性防护 / 真实身体 / 耐久不规则 / 安静反叛"),
    ]
    y = 153 * mm
    for label, value in statements:
        c.setFillColor(NICKEL)
        c.setFont(FONT, 8)
        c.drawString(20 * mm, y, label)
        c.setFillColor(OBSIDIAN)
        c.setFont(FONT_BOLD, 12)
        c.drawString(56 * mm, y - 1 * mm, value)
        y -= 24 * mm

    swatches = [
        ("OBSIDIAN", "#0D0D0F", OBSIDIAN),
        ("GRAPHITE", "#25262A", GRAPHITE),
        ("BONE ASH", "#D9D4C8", BONE),
        ("OXIDIZED NICKEL", "#73777A", NICKEL),
        ("DRIED BLOOD", "#5B1F25", BLOOD),
    ]
    x = 20 * mm
    for name, hex_value, color in swatches:
        c.setFillColor(color)
        c.rect(x, 34 * mm, 43 * mm, 19 * mm, stroke=0, fill=1)
        c.setFillColor(GRAPHITE)
        c.setFont(FONT_BOLD, 6.8)
        c.drawString(x, 28 * mm, name)
        c.setFont(FONT, 6.8)
        c.drawString(x, 23 * mm, hex_value)
        x += 52 * mm
    c.showPage()


def page_status(c: canvas.Canvas) -> None:
    add_header(c, "05 当前状态与下一确认门", "本文件用于方向确认，不代表商标核准或生产封样。", 6)
    items = [
        "已完成：英文主字标、中文副标、幕隙门徽、横向/纵向/独立组合。",
        "已完成：纯黑、纯白、反白 SVG 与透明 PNG；正反轮廓保持一致。",
        "已测试：16/24/32px 与 8mm；已写入最小尺寸规则。",
        "待完成：人工矢量节点精修、反向图片检索、中国第 25/35 类代理人检索。",
        "确认后才进入下一阶段：Motion Contour 纹样、五金压印、刺绣、织唛与鞋面微孔版本。",
    ]
    y = 149 * mm
    for index, item in enumerate(items, start=1):
        c.setFillColor(OBSIDIAN if index < 4 else BLOOD)
        c.circle(24 * mm, y + 1.5 * mm, 3.5 * mm, stroke=0, fill=1)
        c.setFillColor(white)
        c.setFont(FONT_BOLD, 7)
        c.drawCentredString(24 * mm, y - 0.7 * mm, str(index))
        draw_paragraph(c, item, 34 * mm, y + 4 * mm, 235 * mm, size=10, leading=15)
        y -= 24 * mm
    c.setFillColor(OBSIDIAN)
    c.setFont(FONT_BOLD, 13)
    c.drawString(20 * mm, 27 * mm, "确认门：只确认 Logo 方向 1 的精修系统；不自动推进服装、海报或网站。")
    c.showPage()


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT_FILE), pagesize=landscape(A4), pageCompression=1)
    c.setTitle("MOVERNO / 墨维诺 - Logo Direction 01 Refinement")
    c.setAuthor("MOVERNO Brand Development")
    page_cover(c)
    page_lockups(c)
    page_emblem(c)
    page_minimum_sizes(c)
    page_language_and_color(c)
    page_status(c)
    c.save()
    print(OUT_FILE)


if __name__ == "__main__":
    main()
