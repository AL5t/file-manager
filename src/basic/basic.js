import path from 'node:path';
import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';

async function cmdCat(cwd, filePath) {
  if(!cwd || !filePath) {
    console.log('Invalid input');
    return;
  }

  try {
    const fullFilePath = path.resolve(cwd, filePath);
    const stat = await fs.promises.stat(fullFilePath).catch(() => false);

    if(stat?.isFile) {
      const stream = fs.createReadStream(fullFilePath, {encoding: 'utf8'});
      stream.on('data', (chunk) => {
        process.stdout.write(chunk);
      });
      stream.on('end', () => {
        console.log('\n');
        console.log(`You are currently in ${cwd}`);
      });
    } else {
      console.log('Invalid input. Such file does not exist');
    }
  } catch (error) {
    console.log('Operation failed');
  }
}

async function cmdAdd(cwd, fileName) {
  if(!cwd || !fileName) {
    console.log('Invalid input');
    return;
  }

  try {
    const fullFilePath = path.resolve(cwd, fileName);
    const stat = await fs.promises.stat(fullFilePath).catch(() => false);
    
    if(stat?.isFile) {
      console.log(`Invalid input. A file "${fileName}" already exists.`);
      return;
    }

    const stream = fs.createWriteStream(fullFilePath);

    process.stdin.on('data', (chunk) => {
      stream.write(chunk);
    });
  } catch (error) {
    console.log('Operation failed');
  }
}

async function cmdMkdir(cwd, dirName) {
  if(!cwd || !dirName) {
    console.log('Invalid input');
    return;
  }

  try {
    const dirPath = path.resolve(cwd, dirName);
    const stat = await fs.promises.stat(dirPath).catch(() => false);
    
    if(stat?.isDirectory) {
      console.log(`Invalid input. A directory "${dirName}" already exists.`);
      return;
    }

    await fs.promises.mkdir(dirPath, {recursive: true});
  } catch (error) {
    console.log('Operation failed');
  }
}

async function cdmRn(cwd, filePath, newFileName) {
  if(!cwd || !filePath || !newFileName) {
    console.log('Invalid input');
    return;
  }

  try {
    const fullFilePath = path.resolve(cwd, filePath);
    const pathNewFileName = path.resolve(cwd, newFileName);
    const statFile = await fs.promises.stat(fullFilePath).catch(() => false);
    
    if(!statFile?.isFile) {
      console.log(`Invalid input. File ${filePath} does not exist`);
      return;
    }

    const statNewFileName = await fs.promises.stat(pathNewFileName).catch(() => false);
    
    if(statNewFileName?.isFile) {
      console.log(`Invalid input. A file named "${newFileName}" already exists.`);
      return;
    }

    await fs.promises.rename(fullFilePath, pathNewFileName);
    
  } catch (error) {
    console.log('Operation failed');
  }
}

async function cmdCp(cwd, filePath, pathToNewDir) {
  if(!cwd || !filePath || !pathToNewDir) {
    console.log('Invalid input');
    return;
  }

  try {
    const fullFilePath = path.resolve(cwd, filePath);
    const fullPathToNewDir = path.resolve(cwd, pathToNewDir);
    const statFile = await fs.promises.stat(fullFilePath).catch(() => false);
    const statDir = await fs.promises.stat(fullPathToNewDir).catch(() => false);
    const pathDir = path.join(fullPathToNewDir, path.basename(fullFilePath));

    if(!statFile?.isFile || !statDir?.isDirectory) {
      console.log('Invalid input');
      return;
    }

    const readStream = fs.createReadStream(fullFilePath);
    const writeStream = fs.createWriteStream(pathDir);

    readStream.on('error', () => console.log('Operation failed'));
    writeStream.on('error', () => console.log('Operation failed'));
    readStream.pipe(writeStream);
  } catch (error) {
    console.log('Operation failed');
  }
}

async function cmdMv(cwd, filePath, pathToNewDir) {
  if(!cwd || !filePath || !pathToNewDir) {
    console.log('Invalid input');
    return;
  }

  try {
    const fullFilePath = path.resolve(cwd, filePath);
    const fullPathToNewDir = path.resolve(cwd, pathToNewDir);
    const statFile = await fs.promises.stat(fullFilePath).catch(() => false);
    const statDir = await fs.promises.stat(fullPathToNewDir).catch(() => false);
    const pathDir = path.join(fullPathToNewDir, path.basename(fullFilePath));

    if(!statFile?.isFile || !statDir?.isDirectory) {
      console.log('Invalid input');
      return;
    }

    const readStream = fs.createReadStream(fullFilePath);
    const writeStream = fs.createWriteStream(pathDir);

    readStream.on('error', () => console.log('Operation failed'));
    writeStream.on('error', () => console.log('Operation failed'));

    await pipeline(readStream, writeStream);
    await fs.promises.unlink(fullFilePath);
  } catch (error) {
    console.log('Operation failed');
  }
}

async function cmdRm(cwd, filePath) {
  if(!cwd || !filePath) {
    console.log('Invalid input');
    return;
  }

  try {
    const fullFilePath = path.resolve(cwd, filePath);
    const statFile = await fs.promises.stat(fullFilePath).catch(() => false);

    if(!statFile?.isFile) {
      console.log('Invalid input');
      return;
    }

    await fs.promises.unlink(fullFilePath);
  } catch (error) {
    console.log('Operation failed');
  }
}

export {
  cmdCat,
  cmdAdd,
  cmdMkdir,
  cdmRn,
  cmdCp,
  cmdMv,
  cmdRm
};