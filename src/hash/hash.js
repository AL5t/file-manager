import { createReadStream } from 'node:fs';
import fs from 'node:fs'
const { createHash } = await import('node:crypto');

export async function calculateHash(filePath) {
  try {
    if(!filePath) {
      console.log('Invalid input');
      return;
    }

    const stat = await fs.promises.stat(filePath);
    if(!stat?.isFile) {
      throw new Error('Operation failed');
    }

    const hash = createHash('sha256');
    const input = createReadStream(filePath);

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