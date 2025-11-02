import * as readline from 'node:readline';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { cmdCat, cmdAdd, cmdMkdir, cdmRn, cmdCp, cmdMv, cmdRm } from './basic/basic.js'
import { calculateHash } from './hash/hash.js';
import { getOsInfo } from './os/os.js';
import { compress } from './compress/compress.js';
import { decompress } from './compress/decompress.js';

const args = process.argv.slice(2);
let username = null;

(function startWork() {
  for(const arg of args) {
    if(arg.startsWith('--username=')) {
      username = arg.slice('--username='.length);
    }
  }
  if(!username) {
    username = 'username';
  }
  console.log(`Welcome to the File Manager, ${username}!`);
})();


const rl = readline.createInterface({ 
  input: process.stdin, 
  output: process.stdout
});


function finishWork() {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  rl.close();
  process.exit(0);
}

rl.on('SIGINT', () => {
  finishWork();
});


const homeDir = os.homedir();
const fsRoot = path.parse(homeDir).root;
let cwd = homeDir;
function printCwd() {
  console.log(`You are currently in ${cwd}`);
};
printCwd();



function checkPathInRoot(selectedPath) {
  const resolved = path.resolve(selectedPath);
  const selectedRoot = path.parse(resolved).root;

  if(selectedRoot !== fsRoot) {
    return false;
  }

  return resolved.startsWith(fsRoot);
}


async function cmdUp() {
  const selectedPath = path.dirname(cwd);

  if(checkPathInRoot(selectedPath)) {
    cwd = selectedPath;
  }
}

async function cmdCd(pathDirectory) {
  if(!pathDirectory) {
    console.log('Invalid input');
    return;
  }

  try {
    const resolved = path.resolve(cwd, pathDirectory);
    const stats = await fs.promises.stat(resolved);

    if(!stats.isDirectory() || !checkPathInRoot(resolved)) {
      console.log('Operation failed');
      return;
    }

    cwd = resolved;
  } catch (error) {
    console.log('Operation failed');
  }
}

async function cmdLs() {
  try {
    const names = await fs.promises.readdir(cwd);
    const list = [];

    for (const name of names) {
      const full = path.join(cwd, name);
      const stat = await fs.promises.stat(full);
      list.push({name, isDirectory: stat.isDirectory(), isFile: stat.isFile()});
    }

    list.sort((a, b) => {
      if(a.isDirectory && !b.isDirectory) {
        return -1;
      }
      if(!a.isDirectory && b.isDirectory) {
        return 1;
      }
      return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
    });

    console.log('Type        |   Name');
    console.log('--------------------');
    for (const item of list) {
      console.log(`${item.isDirectory ? 'directory' : 'file     '}   |   ${item.name}`);
    }
    console.log('--------------------');
  } catch (error) {
    console.log('Operation failed');
  }
}


async function handleLine(line) {
  try {
    const trimmedLine = line.trim();

    const arrayOfValues = trimmedLine.split(/\s+/);
    const command = arrayOfValues[0].toLowerCase();

    switch (command) {
      case '.exit':
        finishWork();
        break;
      case 'up':
        if (arrayOfValues.length === 1) {
          await cmdUp();
        } else {
          console.log('Invalid input');
        }
        break;
      case 'cd':
        await cmdCd(arrayOfValues[1]);
        break;
      case 'ls':
        if (arrayOfValues.length === 1) {
          await cmdLs();
        } else {
          console.log('Invalid input');
        }
        break;
      case 'cat':
        await cmdCat(cwd, arrayOfValues[1]);
        break;
      case 'add':
        await cmdAdd(cwd, arrayOfValues[1]);
        break;
      case 'mkdir':
        await cmdMkdir(cwd, arrayOfValues[1]);
        break;
      case 'rn':
        await cdmRn(cwd, arrayOfValues[1], arrayOfValues[2]);
        break;
      case 'cp':
        await cmdCp(cwd, arrayOfValues[1], arrayOfValues[2]);
        break;
      case 'mv':
        await cmdMv(cwd, arrayOfValues[1], arrayOfValues[2]);
        break;
      case 'rm':
        await cmdRm(cwd, arrayOfValues[1]);
        break;
      case 'hash':
        await calculateHash(cwd, arrayOfValues[1]);
        break;
      case 'os':
        await getOsInfo(arrayOfValues[1]);
        break;
      case 'compress':
        await compress(cwd, arrayOfValues[1], arrayOfValues[2]);
        break;
      case 'decompress':
        await decompress(cwd, arrayOfValues[1], arrayOfValues[2]);
        break;
      default:
        console.log('Invalid input');
        break;
    }

    printCwd();
  } catch (error) {
    console.log('Operation failed');
  }
}

rl.prompt();
rl.on('line', (line) => handleLine(line));