import path from 'node:path';
import fs from 'node:fs';
import zlib from 'node:zlib';

export async function decompress(cwd, filePath, pathToDest) {
  if(!cwd || !filePath || !pathToDest) {
    console.log('Invalid input');
    return;
  }

  try {
    const fullFilePath = path.resolve(cwd, filePath);
    const fullPathToDest = path.resolve(cwd, pathToDest);
    const statFile = await fs.promises.stat(fullFilePath).catch(() => false);
    const statDest = await fs.promises.stat(fullPathToDest).catch(() => false);
    const pathDir = path.join(fullPathToDest, path.basename(fullFilePath));

    if(!statFile?.isFile || !statDest?.isDirectory) {
      console.log('Invalid input-1');
      return;
    }

    const inputStream = fs.createReadStream(fullFilePath);
    const outputStream = fs.createWriteStream(pathDir.slice(0, -3));

    inputStream.pipe(zlib.createBrotliDecompress()).pipe(outputStream);
  } catch (error) {
    console.log('Operation failed');
  }
}