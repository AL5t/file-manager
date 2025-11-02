import path from 'node:path';
import fs from 'node:fs';

async function cmdCat(cwd, filePath) {
  if(!cwd || !filePath) {
    console.log('Invalid input');
    return;
  }

  try {
    const fullFilePath = path.resolve(cwd, filePath);
    const stat = await fs.promises.stat(fullFilePath);

    if(stat.isFile) {
      const stream = fs.createReadStream(fullFilePath, {encoding: 'utf8'});
      stream.on('data', (chunk) => {
        process.stdout.write(chunk);
      });
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
    const stream = fs.createWriteStream(fullFilePath);

    process.stdin.on('data', (chunk) => {
      stream.write(chunk);
    });
  } catch (error) {
    console.log('Operation failed');
  }
}

async function cmdMkdir(cwd, dirName) {
  if(!cwd || !fileName) {
    console.log('Invalid input');
    return;
  }

  try {
    const dirPath = path.resolve(cwd, dirName);
    await fs.promises.mkdir(dirPath);
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
    const pathNewFileName = path.resolve(cwd, newFileName);

    await fs.promises.access(filePath, fs.promises.constants.F_OK);

    const isNewFileNameExist = await fs.promises.access(pathNewFileName, fs.promises.constants.F_OK).then(() => true).catch(() => false);
    if(isNewFileNameExist) {
      console.log(`Operation failed. A file named "${newFileName}" already exists.`);
      return;
    }

    fs.promises.rename(filePath, pathNewFileName);
    
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
    const statFile = await fs.promises.stat(fullFilePath);
    const statDir = await fs.promises.stat(fullPathToNewDir);

    if(!statFile?.isFile || !statDir?.isDirectory) {
      console.log('Operation failed');
      return;
    }

    const readStream = fs.createReadStream(fullFilePath);
    const writeStream = fs.createWriteStream(fullPathToNewDir);

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
    const statFile = await fs.promises.stat(fullFilePath);
    const statDir = await fs.promises.stat(fullPathToNewDir);

    if(!statFile?.isFile || !statDir?.isDirectory) {
      console.log('Operation failed');
      return;
    }

    const readStream = fs.createReadStream(fullFilePath);
    const writeStream = fs.createWriteStream(fullPathToNewDir);

    readStream.pipe(writeStream);
    fs.unlink(fullFilePath);
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
    const statFile = await fs.promises.stat(fullFilePath);

    if(!statFile?.isFile) {
      console.log('Operation failed');
      return;
    }

    fs.unlink(fullFilePath);
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