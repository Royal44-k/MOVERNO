import importlib.util
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).with_name("create_motion_contour_v2_assets.py")
SPEC = importlib.util.spec_from_file_location("motion_contour_assets", MODULE_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class SplitTextTests(unittest.TestCase):
    def test_does_not_leave_cjk_punctuation_on_its_own_line(self) -> None:
        lines = MODULE.split_text("默认 0.60 mm；0.35 / 0.45 mm 只用于试机。", 31)
        self.assertNotIn("。", lines)
        self.assertNotIn("；", lines)
        self.assertEqual("".join(lines), "默认 0.60 mm；0.35 / 0.45 mm 只用于试机。")


class SeparationTests(unittest.TestCase):
    def test_foil_plate_has_no_solid_dark_center_node(self) -> None:
        foil = MODULE.separation_svg("foil")
        self.assertNotIn('fill="#17181B"', foil)

    def test_red_node_plate_excludes_dark_center_node(self) -> None:
        node = MODULE.separation_svg("node")
        self.assertNotIn('fill="#17181B"', node)


if __name__ == "__main__":
    unittest.main()
