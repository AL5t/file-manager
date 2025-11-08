import path from 'node:path';
import fs from 'node:fs';

export async function cmdLs(cwd) {
  try {
    const names = await fs.promises.readdir(cwd);
    const list = [];

    for (const name of names) {
      const full = path.join(cwd, name);
      const stat = await fs.promises.stat(full);
      list.push({name, type: stat.isDirectory() ? 'directory' : 'file'});
    }

    list.sort((a, b) => {
      if(a.type < b.type) {
        return -1;
      }
      if(a.type > b.type) {
        return 1;
      }
      return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
    });

    console.table(list);
  } catch (error) {
    console.log('Operation failed');
  }
}