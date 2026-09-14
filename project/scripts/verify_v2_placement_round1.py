from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "ss27-tee-v2-placement-round1"
PATTERN = ROOT / "assets" / "motion-contour-round1" / "05-relay-veil-edge-gilded-v2.png"
EXPECTED_PATTERN_SHA = "6974B12D59755D954DA3B748736218DB78C7B3542D954BEA3EC1E1F040689D76"
EXPECTED = {
    "SS27-TS01": ("FRAME", "front_monolith", "ss27-ts01-front-monolith.png"),
    "SS27-TS02": ("FRAME", "back_gate", "ss27-ts02-back-gate.png"),
    "SS27-TS03": ("TRACE", "chest_signal", "ss27-ts03-chest-signal.png"),
    "SS27-TS04": ("TRACE", "hem_ascent", "ss27-ts04-hem-ascent.png"),
    "SS27-TS05": ("RHYTHM_V", "shoulder_circuit", "ss27-ts05-shoulder-circuit.png"),
    "SS27-TS06": ("RHYTHM_V", "full_veil", "ss27-ts06-full-veil.png"),
    "SS27-TS07": ("NOIR_POLO", "side_relay", "ss27-ts07-side-relay.png"),
    "SS27-TS08": ("NOIR_POLO", "composite_relay", "ss27-ts08-composite-relay.png"),
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> None:
    require(PATTERN.exists(), "V2 pattern master is missing")
    require(sha256(PATTERN) == EXPECTED_PATTERN_SHA, "V2 pattern SHA-256 mismatch")
    with Image.open(PATTERN) as pattern:
        require(pattern.size == (1024, 1024), f"Unexpected V2 size: {pattern.size}")
        require(pattern.mode == "RGB", f"Unexpected V2 mode: {pattern.mode}")

    manifest_path = OUT_DIR / "manifest.json"
    require(manifest_path.exists(), "manifest.json is missing")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    require(manifest["patternSha256"] == EXPECTED_PATTERN_SHA, "Manifest V2 hash mismatch")
    require(len(manifest["items"]) == 8, "Manifest must contain exactly eight items")
    require(len({item["code"] for item in manifest["items"]}) == 8, "Item codes are not unique")

    seen: set[str] = set()
    for item in manifest["items"]:
        code = item["code"]
        require(code in EXPECTED, f"Unexpected item code: {code}")
        expected_base, expected_placement, expected_file = EXPECTED[code]
        require(item["base"] == expected_base, f"{code} base mismatch")
        require(item["placement"] == expected_placement, f"{code} placement mismatch")
        require(item["file"] == expected_file, f"{code} filename mismatch")

        output = OUT_DIR / expected_file
        require(output.exists(), f"Missing output: {expected_file}")
        require(sha256(output) == item["sha256"], f"{code} output hash mismatch")
        with Image.open(output) as image:
            require(image.size == (1536, 1024), f"{code} size mismatch: {image.size}")
            require(image.mode == "RGB", f"{code} mode mismatch: {image.mode}")
            require(image.info.get("pattern_sha256") == EXPECTED_PATTERN_SHA, f"{code} PNG V2 hash missing")
            require(image.info.get("base_block") == expected_base, f"{code} PNG base metadata mismatch")
            require(image.info.get("placement") == expected_placement, f"{code} PNG placement metadata mismatch")

            # The area between the extracted front and back views must be free
            # of any dark side-view fragments below the title region.
            arr = np.asarray(image.convert("RGB"), dtype=np.float32)
            gap = arr[150:900, 660:876]
            luma = gap[..., 0] * 0.2126 + gap[..., 1] * 0.7152 + gap[..., 2] * 0.0722
            require(int(np.count_nonzero(luma < 155)) == 0, f"{code} contains a centre-gap fragment")
        seen.add(code)

    require(seen == set(EXPECTED), "Eight-item matrix is incomplete")
    lineup = OUT_DIR / manifest["lineup"]
    require(lineup.exists(), "Lineup image is missing")
    with Image.open(lineup) as board:
        require(board.size == (1520, 2170), f"Lineup size mismatch: {board.size}")
        require(board.mode == "RGB", f"Lineup mode mismatch: {board.mode}")

    expected_files = {value[2] for value in EXPECTED.values()} | {
        "00-moverno-ss27-v2-placement-lineup-round1.png",
        "manifest.json",
    }
    require({path.name for path in OUT_DIR.iterdir()} == expected_files, "Unexpected or missing stage files")

    print("PASS V2 master: 1024x1024 RGB and locked SHA-256")
    print("PASS matrix: 8 unique items with approved base/placement mapping")
    print("PASS previews: 8/8 are 1536x1024 RGB with embedded V2/base/placement metadata")
    print("PASS integrity: 8/8 output hashes match manifest")
    print("PASS crops: 8/8 centre gaps contain no side-view fragments")
    print("PASS lineup: 1520x2170 RGB")


if __name__ == "__main__":
    main()
