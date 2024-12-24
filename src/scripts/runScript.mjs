import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const scriptPath = join(__dirname, 'setDefaultSubscriptionType.ts');

// Use ts-node to run the TypeScript file
const child = spawn('npx', ['ts-node', scriptPath], {
  stdio: 'inherit'
});

child.on('exit', (code) => {
  process.exit(code);
});
