import path from 'node:path';
import fs from 'node:fs';
import zlib from 'node:zlib';

export async function compress(cwd, filePath, pathToDest) {
  if(!cwd || !filePath || !pathToNewDir) {
    console.log('Invalid input');
    return;
  }

  try {
    const fullFilePath = path.resolve(cwd, filePath);
    const fullPathToDest = path.resolve(cwd, pathToDest);
    const statFile = await fs.promises.stat(fullFilePath);
    const statDest = await fs.promises.stat(fullPathToDest);

    if(!statFile?.isFile || !statDest?.isDirectory) {
      console.log('Operation failed');
      return;
    }

    const inputStream = createReadStream(fullFilePath);
    const outputStream = createWriteStream(fullPathToDest + '.br');

    inputStream.pipe(zlib.createBrotliCompress()).pipe(outputStream);
  } catch (error) {
    console.log('Operation failed');
  }
}