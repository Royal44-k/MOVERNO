const assert = require('assert');
const path = require('path');
const { spawnSync } = require('child_process');

const script = path.join(__dirname, 'render_motion_contour_v2.cjs');
const result = spawnSync(process.execPath, [script], {
  cwd: path.resolve(__dirname, '..'),
  env: process.env,
  encoding: 'utf8',
});

assert.strictEqual(
  result.status,
  0,
  `motion contour proof rendering must complete without exceeding the rasterizer pixel limit\n${result.stderr}`,
);

process.stdout.write('PASS render_motion_contour_v2\n');
