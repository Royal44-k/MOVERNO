import fs from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';

const source = process.argv[2];
if (!source) throw new Error('An exact current-task rollout path is required.');
const rl = readline.createInterface({ input: fs.createReadStream(source), crlfDelay: Infinity });
let lineNumber = 0;
for await (const line of rl) {
  lineNumber++;
  let record;
  try { record = JSON.parse(line); } catch { continue; }
  const p = record.payload;
  if (!p || p.role !== 'user' || !Array.isArray(p.content)) continue;
  const text = p.content.filter(c => c.type === 'input_text' || c.type === 'text').map(c => c.text || '').join('\n');
  const images = p.content.filter(c => c.type === 'input_image' || c.type === 'image');
  if (process.argv[3] && text.includes('codex-clipboard-3b4d5179-dac6-44c5-88a9-002f25aefdc5.png') && images.length === 10) {
    const dest = path.resolve(process.argv[3]);
    const allowed = path.resolve('D:/Codex-chat/night-veil-brand/assets') + path.sep;
    if (!dest.toLowerCase().startsWith(allowed.toLowerCase())) throw new Error('Output is outside project assets.');
    const names = ['01-black-canvas-hi','02-minimal-canvas-hi','03-oversized-graphic-low','04-liquid-silver-runner','05-black-bone-graphic-low','06-frayed-jacquard-skate','07-black-leather-low','08-white-leather-court','09-ribbed-gum-canvas','10-white-court'];
    fs.mkdirSync(dest, { recursive: true });
    images.forEach((image, i) => {
      const url = typeof image.image_url === 'string' ? image.image_url : image.image_url?.url;
      const match = /^data:image\/(png|jpeg|webp);base64,(.+)$/s.exec(url || '');
      if (!match) throw new Error('Source image is not an embedded supported image.');
      const file = path.join(dest, names[i] + '.' + (match[1] === 'jpeg' ? 'jpg' : match[1]));
      const bytes = Buffer.from(match[2], 'base64');
      if (fs.existsSync(file) && !fs.readFileSync(file).equals(bytes)) throw new Error('Refusing to overwrite a different reference.');
      if (!fs.existsSync(file)) fs.writeFileSync(file, bytes, {flag:'wx'});
      console.log(JSON.stringify({recovered:file, bytes:bytes.length, timestamp:record.timestamp}));
    });
    break;
  }
  if (images.length || text.includes('3b4d5179') || text.includes('整体可采纳')) {
    console.log(JSON.stringify({lineNumber, timestamp: record.timestamp, images: images.length, text: text.slice(0,220), imageKeys: images[0] ? Object.keys(images[0]) : []}));
  }
}
