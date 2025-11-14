import os from 'node:os';

export async function getOsInfo(flag) {
  try {
    if(!flag) {
      console.log('Invalid input');
      return;
    }

    switch (flag) {
      case '--EOL':
        const eol = os.EOL;
        switch (eol) {
          case '\n':
            console.log('\\n');
            break;
          case '\r\n':
            console.log('\\r\\n');
            break;
          case '\n\r':
            console.log('\\n\\r');
            break;
          default:
            console.log(JSON.stringify(eol));
            break;
        }
        break;
      case '--cpus':
        const cpus = os.cpus();
        console.log(`Total: ${cpus.length}`);
        cpus.forEach((cpu, index) => {
          console.log(`${index + 1}. ${cpu.model} ${(cpu.speed / 1000).toFixed(0)}GHz`);
        });
        break;
      case '--homedir':
        console.log(`${os.homedir()}`);
        break;
      case '--username':
        console.log(`${os.userInfo().username}`);
        break;
      case '--architecture':
        console.log(`${os.arch()}`);
        break;
      default:
        console.log('Invalid input');
        break;
    }
  } catch (error) {
    console.log('Operation failed');
  }
}