import { Client, handle_file } from '@gradio/client';
import { writeFile, mkdir, access } from 'node:fs/promises';
import { resolve } from 'node:path';
const id = process.argv[2];
const prompts = {
  A01: 'A photorealistic fashion film, continuous full-body shot. The woman in this exact image naturally shifts her weight and takes one small relaxed step forward, then settles into a comfortable stance. Feet visibly make contact with the dry stone ground. Her leather jacket and skirt move with subtle natural inertia. Locked camera, no zoom. Keep both shoes completely inside frame and clearly visible. Preserve the precise beige-grey black and gold chain-pattern low-top canvas shoes, cream toe caps, white laces, cream low rubber sidewalls with the same black MOVERNO wordmark. No changes to the footwear. Realistic anatomy, gentle movement, refined editorial lighting.',
  A02: 'A photorealistic fashion film, one continuous shot with a locked camera. The seated woman naturally adjusts the angle of her nearer foot a few degrees to show the outer side of her high-top, gently moves her hand from her knee to the hem of her coat, and looks to the side. She remains seated. Restrained relaxed motion, believable ankle articulation and grounded feet. Both exact black canvas high-top shoes remain visible. Preserve the diagonal silver outer zipper, narrow gold chain-pattern strip immediately beneath it, white laces, upright black tongue and moderate cream rubber sole. Do not change any shoe construction. Realistic human anatomy and fabric inertia.',
  A03: 'A photorealistic luxury footwear film, continuous full-body shot, camera fixed low. The standing woman takes one small slow step forward with the rear foot and then naturally transfers her weight, her long black coat gently swaying and settling. Preserve both exact black canvas giant-platform high-tops, very thick continuous cream rubber soles, rounded cream toe caps, white laces, upright tongue with the twin vertical panel emblem. No zipper. Feet stay on the stone ground with clear sole contact, no foot sliding, no sole deformation. Keep both whole shoes inside the frame. Natural restrained human movement, realistic gravity, editorial daylight.'
};
if (!prompts[id]) throw new Error('Expected A01, A02 or A03');
const output = resolve('../assets', `${id}-model-motion.mp4`);
try { await access(output); throw new Error('Output already exists; refusing duplicate generation'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const timer = setTimeout(() => { console.error('GENERATION_TIMEOUT: do not automatically resubmit'); process.exit(2); }, 240000);
try {
  // Anonymous connection only: no access token, account credits, paid fallback or duplicate Space.
  const app = await Client.connect('https://zerogpu-aoti-wan2-2-fp8da-aoti-faster.hf.space', {events:['data','status']});
  const payload = {
    input_image: handle_file(resolve('../assets', `${id}-model-keyframe.png`)),
    prompt: prompts[id], steps: 4, duration_seconds: 3.5,
    guidance_scale: 1, guidance_scale_2: 1, seed: 1900 + Number(id.slice(1)), randomize_seed: false,
    negative_prompt: 'static still picture, camera zoom, shoe morphing, incorrect logo, changed sole thickness, extra legs, extra feet, fused limbs, sliding feet, floating feet, broken ankles, warped shoes, melting rubber, disappearing zipper, floating laces, cartoon, bad anatomy, blurry feet, text overlays, subtitles, watermark'
  };
  await mkdir('../records', {recursive:true});
  await writeFile(`../records/${id}-motion-request.json`, JSON.stringify({...payload,input_image:`${id}-model-keyframe.png`,service:'zerogpu-aoti/wan2-2-fp8da-aoti-faster',payment:'anonymous free quota only'},null,2));
  const job = app.submit('/generate_video', payload);
  let lastStatus = '';
  for await (const msg of job) {
    const statusKey = `${msg.type}:${msg.stage}:${msg.progress_data?.[0]?.desc}:${Math.floor((msg.progress_data?.[0]?.index || 0)/20)}`;
    if (msg.type === 'data' || statusKey !== lastStatus) console.log(JSON.stringify(msg));
    lastStatus = statusKey;
    if (msg.type === 'status' && msg.stage === 'error') throw new Error(msg.message || 'Generation rejected');
    if (msg.type === 'data') {
      await writeFile(`../records/${id}-motion-result.json`, JSON.stringify(msg.data,null,2));
      const item = msg.data[0];
      const url = item?.video?.url || item?.url;
      if (!url || new URL(url).hostname !== 'zerogpu-aoti-wan2-2-fp8da-aoti-faster.hf.space') throw new Error('Unexpected output URL; manual review required');
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Output download HTTP ${response.status}`);
      await writeFile(output, new Uint8Array(await response.arrayBuffer()));
      console.log(`SAVED ${output}`);
    }
  }
} catch (error) { console.error(error); process.exitCode=1; }
finally { clearTimeout(timer); }
