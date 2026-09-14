from pathlib import Path
import re
import vtracer


PROJECT_ROOT = Path(__file__).resolve().parent.parent
WORK_DIR = PROJECT_ROOT / "assets" / "logo-direction-01" / "work"
OUT_DIR = PROJECT_ROOT / "assets" / "logo-direction-01" / "svg"

ASSETS = (
    "primary_wordmark",
    "bilingual_wordmark",
    "stacked_lockup",
    "standalone_emblem",
)


def normalize_svg(svg_path: Path, title: str) -> None:
    text = svg_path.read_text(encoding="utf-8")
    text = re.sub(r"<\?xml[^>]*>\s*", "", text, count=1)
    text = re.sub(r"<!DOCTYPE[^>]*>\s*", "", text, count=1)
    text = text.replace("<svg ", f'<svg role="img" aria-label="{title}" ', 1)
    text = re.sub(
        r"(<svg\b[^>]*>)",
        lambda match: f"{match.group(1)}<title>{title}</title>",
        text,
        count=1,
    )
    svg_path.write_text(text, encoding="utf-8")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for name in ASSETS:
        source = WORK_DIR / f"{name}.png"
        target = OUT_DIR / f"moverno-{name.replace('_', '-')}.svg"
        vtracer.convert_image_to_svg_py(
            str(source),
            str(target),
            colormode="binary",
            hierarchical="cutout",
            mode="spline",
            filter_speckle=2,
            corner_threshold=70,
            length_threshold=3.5,
            max_iterations=10,
            splice_threshold=45,
            path_precision=3,
        )
        normalize_svg(target, f"MOVERNO / 墨维诺 — {name.replace('_', ' ')}")

        reversed_target = OUT_DIR / f"moverno-{name.replace('_', '-')}-reverse.svg"
        reversed_text = target.read_text(encoding="utf-8")
        reversed_text = reversed_text.replace("#000000", "#FFFFFF")
        reversed_text = reversed_text.replace(
            f"MOVERNO / 墨维诺 — {name.replace('_', ' ')}",
            f"MOVERNO / 墨维诺 — {name.replace('_', ' ')} reverse",
        )
        reversed_target.write_text(reversed_text, encoding="utf-8")


if __name__ == "__main__":
    main()
