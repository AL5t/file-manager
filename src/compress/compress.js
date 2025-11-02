import path from 'node:path';
import fs from 'node:fs';
import zlib from 'node:zlib';

export async function compress(cwd, filePath, pathToDest) {
  if(!cwd || !filePath || !pathToDest) {
    console.log('Invalid input');
    return;
  }

  try {
    const fullFilePath = path.resolve(cwd, filePath);
    const fullPathToDest = path.resolve(cwd, pathToDest);
    const statFile = await fs.promises.stat(fullFilePath).catch(() => false);
    const statDest = await fs.promises.stat(fullPathToDest).catch(() => false);
    const pathDir = path.join(fullPathToDest, path.basename(fullFilePath) + '.br');

    if(!statFile?.isFile || !statDest?.isDirectory) {
      console.log('Invalid input');
      return;
    }

    const inputStream = fs.createReadStream(fullFilePath);
    const outputStream = fs.createWriteStream(pathDir);
    inputStream.pipe(zlib.createBrotliCompress()).pipe(outputStream);
  } catch (error) {
    console.log('Operation failed');
  }
}