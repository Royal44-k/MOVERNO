import { Client } from '@gradio/client';
const timer = setTimeout(() => { console.error('READ_ONLY_CONNECTION_TIMEOUT'); process.exit(2); }, 55000);
try {
  const source = process.argv[2] || 'zerogpu-aoti/wan2-2-fp8da-aoti-faster';
  const app = await Client.connect(source);
  console.log(JSON.stringify(await app.view_api(), null, 2));
} catch (error) { console.error(error); process.exitCode = 1; }
finally { clearTimeout(timer); }
