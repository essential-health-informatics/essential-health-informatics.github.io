/**
 * Creates code documentation within
 */

import fs from 'fs';
import { exec } from 'child_process';

class CodeDocumentation {
  chapterPath: string = './chapters';

  constructor() {}

  create() {
    const filesAndFolders: string[] = fs.readdirSync(this.chapterPath);
    const highestNumber: number = this.highestPrefix(filesAndFolders);
    const command: string =
      'npx typedoc --entryPoints ./utils/*.ts --entryPoints ./src/*ts --out ' +
      './_site/chapters/' +
      String(highestNumber + 1) +
      '-code-documentation';

    exec(command, (error, _, stderr) => {
      if (error) {
        throw new Error(String(error));
      } else if (stderr) {
        console.log(stderr);
      }
    });
  }

  highestPrefix(files: string[]): number {
    let highestNumber: number = 0;

    files.forEach((file: string) => {
      const match = file.match(/^(\d+)-/);
      if (match) {
        const number = parseInt(match[1], 10);

        if (number > highestNumber) {
          highestNumber = number;
        }
      }
    });

    return highestNumber;
  }
}

const docs = new CodeDocumentation();
docs.create();
