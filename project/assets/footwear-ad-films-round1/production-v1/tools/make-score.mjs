import {writeFile,mkdir} from 'node:fs/promises';
const rate=44100, seconds=30, samples=rate*seconds;
await mkdir('../remotion/public/assets',{recursive:true});
for(const [index,id] of ['A01','A02','A03'].entries()) {
 const bpm=[78,94,66][index], beat=60/bpm, base=[55,46.25,41.2][index];
 let seed=471+index, smooth=0;
 const wav=Buffer.alloc(44+samples*4);
 wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(2,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*4,28);wav.writeUInt16LE(4,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples*4,40);
 for(let i=0;i<samples;i++) {
  const t=i/rate, p=t%beat, half=t%(beat/2), bar=Math.floor(t/(beat*4));
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  const noise=seed/4294967296*2-1;smooth=.986*smooth+.014*noise;
  const kick=.3*Math.sin(2*Math.PI*(base*p+1.1*(1-Math.exp(-p*20))))*Math.exp(-p*12);
  const texture=.065*(noise-smooth)*Math.exp(-half*75)*(index===1?1:.5);
  const bell=.035*(Math.sin(2*Math.PI*(index===1?741:329.63)*p)+.4*Math.sin(2*Math.PI*1117*p))*Math.exp(-p*(index===1?14:6));
  const drone=.058*Math.sin(2*Math.PI*base*t)+.024*Math.sin(2*Math.PI*base*1.5*t)+.018*Math.sin(2*Math.PI*(base*2+.15)*t);
  const breathing=.68+.32*Math.sin(t*.52);
  const sparse=(bar%3===2)?.45:1;
  const fade=Math.min(1,t/1.2,(30-t)/2.4);
  const mono=Math.tanh((kick+texture+bell*sparse+drone*breathing+smooth*.1)*.8)*fade;
  const pan=.07*Math.sin(t*.4);
  wav.writeInt16LE(Math.round(mono*(1-pan)*32767),44+i*4);
  wav.writeInt16LE(Math.round(mono*(1+pan)*32767),46+i*4);
 }
 await writeFile(`../remotion/public/assets/${id}-score.wav`,wav);
 console.log(`${id}: original synthesized score, 30.000s, stereo PCM 44.1kHz, ${bpm} BPM`);
}
