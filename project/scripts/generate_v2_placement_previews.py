from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, PngImagePlugin


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "ss27-tee-v2-placement-round1"
PATTERN_PATH = (
    ROOT
    / "assets"
    / "motion-contour-round1"
    / "05-relay-veil-edge-gilded-v2.png"
)
PATTERN_SHA256 = "6974B12D59755D954DA3B748736218DB78C7B3542D954BEA3EC1E1F040689D76"

BASES = {
    "FRAME": ROOT
    / "assets"
    / "ss27-tee-base-blocks"
    / "03-frame-influencer-oversize-front-side-back-v2.png",
    "TRACE": ROOT
    / "assets"
    / "ss27-tee-base-blocks"
    / "04-trace-fitted-crop-front-side-back-v2.png",
    "RHYTHM_V": ROOT
    / "assets"
    / "ss27-tee-base-blocks"
    / "05-rhythm-v-hiphop-micro-v-front-side-back-v1.png",
    "NOIR_POLO": ROOT
    / "assets"
    / "ss27-tee-base-blocks"
    / "06-noir-polo-front-side-back-v1.png",
}

ITEMS = [
    {
        "code": "SS27-TS01",
        "name": "FRONT MONOLITH",
        "base": "FRAME",
        "placement": "front_monolith",
    },
    {
        "code": "SS27-TS02",
        "name": "BACK GATE",
        "base": "FRAME",
        "placement": "back_gate",
    },
    {
        "code": "SS27-TS03",
        "name": "CHEST SIGNAL",
        "base": "TRACE",
        "placement": "chest_signal",
    },
    {
        "code": "SS27-TS04",
        "name": "HEM ASCENT",
        "base": "TRACE",
        "placement": "hem_ascent",
    },
    {
        "code": "SS27-TS05",
        "name": "SHOULDER CIRCUIT",
        "base": "RHYTHM_V",
        "placement": "shoulder_circuit",
    },
    {
        "code": "SS27-TS06",
        "name": "FULL VEIL",
        "base": "RHYTHM_V",
        "placement": "full_veil",
    },
    {
        "code": "SS27-TS07",
        "name": "SIDE RELAY",
        "base": "NOIR_POLO",
        "placement": "side_relay",
    },
    {
        "code": "SS27-TS08",
        "name": "COMPOSITE RELAY",
        "base": "NOIR_POLO",
        "placement": "composite_relay",
    },
]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        Path("C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"),
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
    ]
    for path in candidates:
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def make_background(width: int, height: int) -> Image.Image:
    yy, xx = np.mgrid[0:height, 0:width]
    cx, cy = width * 0.5, height * 0.48
    radius = np.sqrt(((xx - cx) / width) ** 2 + ((yy - cy) / height) ** 2)
    edge = np.clip(radius * 23.0, 0, 14)
    vertical = np.clip((yy / height - 0.45) * 7.0, -2.5, 4.0)
    base = np.array([237.0, 234.0, 231.0])[None, None, :]
    arr = base - edge[..., None] - vertical[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def garment_mask(view: Image.Image) -> Image.Image:
    arr = np.asarray(view.convert("RGB"), dtype=np.float32)
    luma = arr[..., 0] * 0.2126 + arr[..., 1] * 0.7152 + arr[..., 2] * 0.0722
    mask = Image.fromarray(np.where(luma < 155, 255, 0).astype(np.uint8), "L")
    mask = mask.filter(ImageFilter.MedianFilter(3))
    mask = mask.filter(ImageFilter.MaxFilter(3))

    # The approved source sheets contain a centred side view between the front
    # and back garments. Its extreme edge can enter either crop as a detached
    # sliver. Flood-fill only the garment connected to the crop centre so the
    # confirmation sheet remains a clean front/back comparison.
    binary = np.asarray(mask, dtype=np.uint8) > 0
    height, width = binary.shape
    centre_x, centre_y = width // 2, height // 2
    seed: tuple[int, int] | None = None
    for radius in range(max(width, height)):
        y0, y1 = max(0, centre_y - radius), min(height, centre_y + radius + 1)
        x0, x1 = max(0, centre_x - radius), min(width, centre_x + radius + 1)
        candidates = np.argwhere(binary[y0:y1, x0:x1])
        if candidates.size:
            candidate_y, candidate_x = candidates[0]
            seed = (int(x0 + candidate_x), int(y0 + candidate_y))
            break
    if seed is None:
        raise RuntimeError("No main garment component found")

    connected = mask.copy()
    ImageDraw.floodfill(connected, seed, 128, thresh=0)
    component = Image.fromarray(
        np.where(np.asarray(connected, dtype=np.uint8) == 128, 255, 0).astype(np.uint8),
        "L",
    )
    return component.filter(ImageFilter.GaussianBlur(0.7))


def texture_for_view(pattern: Image.Image, size: tuple[int, int], bbox: tuple[int, int, int, int]) -> Image.Image:
    width, height = size
    bx0, by0, bx1, by1 = bbox
    tile_size = max(1, bx1 - bx0)
    tile = pattern.resize((tile_size, tile_size), Image.Resampling.LANCZOS)
    texture = Image.new("RGB", size, (13, 13, 15))
    start_y = by0 - tile_size
    for y in range(start_y, height + tile_size, tile_size):
        for x in range(bx0 - tile_size, width + tile_size, tile_size):
            texture.paste(tile, (x, y))
    return texture


def normalized_mesh(bbox: tuple[int, int, int, int], size: tuple[int, int]) -> tuple[np.ndarray, np.ndarray]:
    width, height = size
    bx0, by0, bx1, by1 = bbox
    yy, xx = np.mgrid[0:height, 0:width]
    nx = (xx - bx0) / max(1, bx1 - bx0)
    ny = (yy - by0) / max(1, by1 - by0)
    return nx, ny


def placement_mask(
    placement: str,
    view_name: str,
    size: tuple[int, int],
    bbox: tuple[int, int, int, int],
) -> Image.Image:
    nx, ny = normalized_mesh(bbox, size)
    selected = np.zeros((size[1], size[0]), dtype=bool)

    if placement == "front_monolith" and view_name == "front":
        selected = (nx >= 0.12) & (nx <= 0.88) & (ny >= 0.16) & (ny <= 0.97)
    elif placement == "back_gate" and view_name == "back":
        selected = (nx >= 0.12) & (nx <= 0.88) & (ny >= 0.13) & (ny <= 0.97)
    elif placement == "chest_signal" and view_name == "front":
        selected = (nx >= 0.17) & (nx <= 0.43) & (ny >= 0.23) & (ny <= 0.57)
    elif placement == "hem_ascent":
        top = 0.53 + 0.16 * np.abs(nx - 0.5) * 2.0
        selected = (ny >= top) & (ny <= 0.98)
    elif placement == "shoulder_circuit":
        selected = (ny >= 0.07) & (ny <= 0.35)
    elif placement == "full_veil":
        selected = (ny >= 0.035) & (ny <= 0.985)
    elif placement == "side_relay":
        selected = (((nx >= 0.04) & (nx <= 0.20)) | ((nx >= 0.80) & (nx <= 0.96))) & (
            (ny >= 0.24) & (ny <= 0.96)
        )
    elif placement == "composite_relay":
        if view_name == "front":
            chest = (nx >= 0.15) & (nx <= 0.39) & (ny >= 0.22) & (ny <= 0.52)
            shoulder = (ny >= 0.09) & (ny <= 0.20) & ((nx <= 0.40) | (nx >= 0.60))
            selected = chest | shoulder
        else:
            spine = (nx >= 0.42) & (nx <= 0.58) & (ny >= 0.18) & (ny <= 0.96)
            yoke = (ny >= 0.09) & (ny <= 0.20) & (nx >= 0.16) & (nx <= 0.84)
            selected = spine | yoke

    # Keep collars and neck openings black. This affects only upper-centre geometry;
    # it never edits, mirrors or regenerates the V2 texture itself.
    if view_name == "front":
        neck = (np.abs(nx - 0.5) <= (0.14 - 0.55 * np.clip(ny, 0, 0.16))) & (ny <= 0.16)
        selected &= ~neck
    else:
        selected &= ~((nx >= 0.35) & (nx <= 0.65) & (ny <= 0.10))

    return Image.fromarray(np.where(selected, 255, 0).astype(np.uint8), "L")


def apply_pattern(
    view: Image.Image,
    pattern: Image.Image,
    garment: Image.Image,
    placement: str,
    view_name: str,
) -> Image.Image:
    bbox = garment.getbbox()
    if bbox is None:
        raise RuntimeError(f"No garment detected in {view_name} view")
    texture = texture_for_view(pattern, view.size, bbox)
    placement_layer = placement_mask(placement, view_name, view.size, bbox)

    garment_alpha = np.asarray(garment, dtype=np.float32) / 255.0
    placement_alpha = np.asarray(placement_layer, dtype=np.float32) / 255.0
    alpha = np.clip(garment_alpha * placement_alpha * 0.96, 0.0, 1.0)

    base = np.asarray(view.convert("RGB"), dtype=np.float32)
    tex = np.asarray(texture, dtype=np.float32)
    luma = base[..., 0] * 0.2126 + base[..., 1] * 0.7152 + base[..., 2] * 0.0722
    shade = np.clip(0.76 + luma / 260.0, 0.76, 1.02)[..., None]
    shaded_texture = np.clip(tex * shade, 0, 255)
    patterned = shaded_texture * 0.93 + base * 0.07
    result = base * (1.0 - alpha[..., None]) + patterned * alpha[..., None]
    return Image.fromarray(np.clip(result, 0, 255).astype(np.uint8), "RGB")


def extract_views(sheet: Image.Image) -> dict[str, tuple[Image.Image, Image.Image]]:
    front = sheet.crop((0, 0, 650, 1024)).convert("RGB")
    back = sheet.crop((886, 0, 1536, 1024)).convert("RGB")
    return {
        "front": (front, garment_mask(front)),
        "back": (back, garment_mask(back)),
    }


def make_preview(item: dict[str, str], pattern: Image.Image) -> Image.Image:
    sheet = Image.open(BASES[item["base"]]).convert("RGB")
    views = extract_views(sheet)
    canvas = make_background(1536, 1024)

    front, front_mask = views["front"]
    back, back_mask = views["back"]
    front_result = apply_pattern(front, pattern, front_mask, item["placement"], "front")
    back_result = apply_pattern(back, pattern, back_mask, item["placement"], "back")

    canvas.paste(front_result, (0, 0), front_mask)
    canvas.paste(back_result, (886, 0), back_mask)

    draw = ImageDraw.Draw(canvas)
    title_font = load_font(28, bold=True)
    meta_font = load_font(18)
    label_font = load_font(16, bold=True)
    draw.text((54, 40), f'{item["code"]}  {item["name"]}', fill=(22, 22, 24), font=title_font)
    draw.text((54, 78), f'BASE: {item["base"]}   /   V2 MASTER LOCKED', fill=(76, 77, 80), font=meta_font)
    draw.text((292, 948), "FRONT", fill=(76, 77, 80), font=label_font, anchor="mm")
    draw.text((1204, 948), "BACK", fill=(76, 77, 80), font=label_font, anchor="mm")
    return canvas


def make_lineup(previews: list[tuple[dict[str, str], Image.Image]]) -> Image.Image:
    thumb_w, thumb_h = 720, 480
    gap, margin, header = 24, 28, 122
    width = margin * 2 + thumb_w * 2 + gap
    height = header + margin + thumb_h * 4 + gap * 3 + margin
    board = Image.new("RGB", (width, height), (13, 13, 15))
    draw = ImageDraw.Draw(board)
    draw.text((margin, 28), "MOVERNO SS27 / V2 PLACEMENT ROUND 1", fill=(217, 212, 200), font=load_font(34, True))
    draw.text((margin, 76), "8 SHORT-SLEEVE CONCEPTS / DETERMINISTIC V2 MASTER", fill=(115, 119, 122), font=load_font(18))
    for index, (_, preview) in enumerate(previews):
        col, row = index % 2, index // 2
        x = margin + col * (thumb_w + gap)
        y = header + margin + row * (thumb_h + gap)
        board.paste(preview.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS), (x, y))
    return board


def main() -> None:
    if sha256(PATTERN_PATH) != PATTERN_SHA256:
        raise RuntimeError("V2 pattern master SHA-256 mismatch")
    for name, path in BASES.items():
        if not path.exists():
            raise FileNotFoundError(f"Missing base block {name}: {path}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pattern = Image.open(PATTERN_PATH).convert("RGB")
    previews: list[tuple[dict[str, str], Image.Image]] = []
    manifest_items = []

    for item in ITEMS:
        preview = make_preview(item, pattern)
        filename = f'{item["code"].lower()}-{item["name"].lower().replace(" ", "-")}.png'
        output_path = OUT_DIR / filename
        metadata = PngImagePlugin.PngInfo()
        metadata.add_text("pattern_master", str(PATTERN_PATH.relative_to(ROOT)))
        metadata.add_text("pattern_sha256", PATTERN_SHA256)
        metadata.add_text("base_block", item["base"])
        metadata.add_text("placement", item["placement"])
        preview.save(output_path, pnginfo=metadata, optimize=True)
        previews.append((item, preview))
        manifest_items.append({**item, "file": filename, "sha256": sha256(output_path)})
        print(f"generated {output_path.relative_to(ROOT)}")

    lineup = make_lineup(previews)
    lineup_path = OUT_DIR / "00-moverno-ss27-v2-placement-lineup-round1.png"
    lineup.save(lineup_path, optimize=True)
    print(f"generated {lineup_path.relative_to(ROOT)}")

    manifest = {
        "patternMaster": str(PATTERN_PATH.relative_to(ROOT)),
        "patternSha256": PATTERN_SHA256,
        "scalePolicy": "One complete 1024x1024 V2 tile equals each detected front/back garment width; no mirror, rotation, recolor or regeneration.",
        "items": manifest_items,
        "lineup": lineup_path.name,
    }
    (OUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


if __name__ == "__main__":
    main()
