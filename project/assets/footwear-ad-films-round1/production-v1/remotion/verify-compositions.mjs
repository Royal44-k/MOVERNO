import assert from 'node:assert/strict';
import {bundle} from '@remotion/bundler';
import {getCompositions} from '@remotion/renderer';
import {resolve} from 'node:path';
const url=await bundle({entryPoint:resolve('src/index.ts'),outDir:resolve('../qa/remotion-bundle')});
const compositions=await getCompositions(url,{browserExecutable:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
for(const id of ['A01','A02','A03']) {
  const item=compositions.find(c=>c.id===id);
  assert.ok(item,`Missing required film ${id}`);
  assert.equal(item.durationInFrames,900,`${id} must be exactly 900 frames`);
  assert.equal(item.fps,30);
  assert.equal(item.width,1080);
  assert.equal(item.height,1920);
}
console.log('PASS: three 900-frame, 30 fps, 1080x1920 compositions.');
