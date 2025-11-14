import { createReadStream } from 'node:fs';
import fs from 'node:fs';
import path from 'node:path';
const { createHash } = await import('node:crypto');

export async function calculateHash(cwd, filePath) {
  if(!cwd || !filePath) {
    console.log('Invalid input');
    return;
  }

  try {
    const fullFilePath = path.resolve(cwd, filePath);
    const stat = await fs.promises.stat(fullFilePath).catch(() => false);
    if(!stat?.isFile) {
      console.log('Invalid input');
      return;
    }

    const hash = createHash('sha256');
    const input = createReadStream(fullFilePath);

    input.on('readable', () => {
      const data = input.read();
      if (data)
        hash.update(data);
      else {
        console.log(`Hash: ${hash.digest('hex')}`);
      }
    });
  } catch (error) {
    console.log('Operation failed');
  }
};