/**
 * Creates sidebar yaml file and chapters index.qmd file.
 *
 * Exports:
 * - Classes: Chapters
 *
 * @module Chapters
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import * as glob from 'glob';
import matter from 'gray-matter';

export type StrYaml = string | Yaml;

export interface Yaml {
  section: string;
  contents: StrYaml[];
}

export interface FinalSidebar {
  website: {
    sidebar: {
      'collapse-level': number;
      contents: StrYaml[];
    };
  };
}

export class Chapters {
  chaptersFolder: string = 'chapters';
  directoryPath: string = path.join(process.cwd(), this.chaptersFolder);
  searchPattern: string = `${this.directoryPath}/**/*.qmd`;

  constructor() {}

  /**
   * Run all the methods to create the sidebar and chapters files.
   */
  public run(): void {
    const sidebarPath: string = path.join(process.cwd(), 'sidebar.yml');
    const chaptersPath: string = path.join(
      process.cwd(),
      this.chaptersFolder,
      'index.qmd'
    );

    const files: string[] = glob.sync(this.searchPattern);
    if (files.length === 0) {
      console.log('No files found');
      return;
    }

    const sidebarStructure: StrYaml[] = this.createYmlObject(files);
    this.writeYaml(sidebarPath, sidebarStructure);
    this.createChapterFile(chaptersPath, sidebarStructure);
  }

  /**
   * Create sidebar structure in yaml format from provided files
   *
   * @remarks
   * Each file is ordered by the number prefix of the folder and then by file name. The 'index.qmd' file is placed before numbered files. Then all files in the same directory are grouped together. This structure is then converted to yaml format. Note, the files' full path is ultimately altered to be relative to the chapters folder.
   *
   * @param files - The files to create the sidebar structure from.
   * @throws Error - If no files are found or if a directory with files does not contain an index.qmd file.
   * @returns The sidebar structure.
   */
  protected createYmlObject(files: string[]): StrYaml[] {
    if (files.length === 0) {
      throw new Error('No files found');
    }

    files.forEach((file) => {
      if (!file.endsWith('.qmd')) {
        throw new Error(`File '${file}' does not end with .qmd`);
      }
    });

    files = files.map((file) => path.relative(this.directoryPath, file));

    const noIndexFolders: string[] = this.checkIndexFiles(files);
    if (noIndexFolders.length !== 0) {
      throw new Error(
        `'index.qmd' missing from folder(s):\n\n${noIndexFolders}`
      );
    }

    let ymlContents: StrYaml[] = [];

    files.sort((a, b) => {
      // Extract directory paths.
      const aDir: string = path.dirname(a);
      const bDir: string = path.dirname(b);

      // Place the chapters/index.qmd file at the top.
      if (a === 'index.qmd') return -1;
      if (b === 'index.qmd') return 1;

      // If both files are in the same directory, prioritise index.qmd.
      if (aDir === bDir) {
        if (a.endsWith('index.qmd')) return -1;
        if (b.endsWith('index.qmd')) return 1;
      }

      const getNumericPrefix = (str: string): string => {
        const match = str.match(/^(\d+(-\d+)*)/);
        return match ? match[0] : '';
      };

      const aPrefix: string = getNumericPrefix(a);
      const bPrefix: string = getNumericPrefix(b);

      // If both files have a numeric prefixes to their parent folder(s), then sort by these numerical prefixes.
      if (aPrefix && bPrefix) {
        const aParts = aPrefix.split('-').map(Number);
        const bParts = bPrefix.split('-').map(Number);

        for (
          let i: number = 0;
          i < Math.max(aParts.length, bParts.length);
          i++
        ) {
          if (aParts[i] !== bParts[i]) {
            return (aParts[i] || 0) - (bParts[i] || 0);
          }
        }
      }

      // Ensures index.qmd come before subdirectories
      if (aDir.startsWith(bDir) && b.endsWith('index.qmd')) return 1;
      if (bDir.startsWith(aDir) && a.endsWith('index.qmd')) return -1;

      // Else, sort alphabetically.
      return a.localeCompare(b);
    });

    files = files.map((file) => path.join(this.chaptersFolder, file));
    const groupedFiles: { [key: string]: string[] } = {};

    // Put files into groups based on their parent directory.
    files.forEach((file) => {
      const pathParts: string[] = file.split(path.sep);
      const basePath: string = pathParts.slice(0, 2).join(path.sep);

      if (!groupedFiles[basePath]) {
        groupedFiles[basePath] = [];
      }
      if (basePath === this.chaptersFolder) {
        groupedFiles[file] = [file];
      } else {
        groupedFiles[basePath].push(file);
      }
    });

    for (const basePath in groupedFiles) {
      if (groupedFiles[basePath].length === 1) {
        ymlContents.push(groupedFiles[basePath][0]);
      } else {
        let subDirectoryFiles: string[] = groupedFiles[basePath].slice(1);
        const subGroupedFiles: { [key: string]: string[] } = {};

        subDirectoryFiles.forEach((file) => {
          const dir: string = path.dirname(file);

          if (!subGroupedFiles[dir]) {
            subGroupedFiles[dir] = [];
          }

          subGroupedFiles[dir].push(file);
        });

        if (Object.keys(subGroupedFiles).length === 1) {
          ymlContents.push({
            section: groupedFiles[basePath][0],
            contents: subDirectoryFiles
          });
        } else {
          let contents: StrYaml[] = [];

          for (const dir in subGroupedFiles) {
            if (subGroupedFiles[dir].length === 1) {
              contents.push(subGroupedFiles[dir][0]);
            } else {
              contents.push({
                section: subGroupedFiles[dir][0],
                contents: subGroupedFiles[dir].slice(1)
              });
            }
          }
          if (contents) {
            ymlContents.push({
              section: groupedFiles[basePath][0],
              contents: contents
            });
          }
        }
      }
    }
    return ymlContents;
  }

  /**
   * Check that each folder containing files has an 'index.qmd' file.
   *
   * @param files - The files to check.
   * @throws Error - If a directory with files does not contain an index.qmd file.
   */
  protected checkIndexFiles(files: string[]): string[] {
    const directories = new Set<string>();

    files.forEach((file) => {
      const dir = path.dirname(file);
      directories.add(dir);
    });

    let failedFolders: string[] = [];

    directories.forEach((dir) => {
      const indexFile = path.join(dir, 'index.qmd');
      if (!files.includes(indexFile)) {
        failedFolders.push(dir);
      }
    });

    return failedFolders;
  }

  /**
   * Write sidebar structure to file
   *
   * @param yamlPath - The path to write the sidebar yaml file.
   * @param yamlObject - The sidebar structure in yaml format.
   * @returns Sidebar structure
   */
  protected writeYaml(yamlPath: string, yamlObject: StrYaml[]): void {
    const finalSidebar: FinalSidebar = {
      website: {
        sidebar: {
          'collapse-level': 1,
          contents: yamlObject
        }
      }
    };

    const yamlString = yaml.stringify(finalSidebar);
    fs.writeFileSync(yamlPath, yamlString, 'utf8');

    return;
  }

  protected createChapterFile(
    chaptersPath: string,
    ymlObject: StrYaml[]
  ): void {
    const frontMatter = `---
title: Chapters
sidebar: false
---
`;
    let yamlString = '';

    yamlString = ymlObject
      .map((item) => {
        if (item === 'chapters/index.qmd') {
          return;
        } else if (typeof item === 'string') {
          const fileContent = fs.readFileSync(item, 'utf8');
          const { data: attributes } = matter(fileContent);
          if (attributes.title) {
            return `\n## ${attributes.title}\n\n* [${attributes.title}](/${item})\n`;
          } else {
            return `\n## [${item}](/${item})\n`;
          }
        } else {
          const fileContent = fs.readFileSync(item.section, 'utf8');
          const { data: headerAttributes } = matter(fileContent);
          const furtherLinks = item.contents
            .map((content) => {
              if (typeof content === 'string') {
                const fileContent = fs.readFileSync(String(content), 'utf8');
                const { data: subSectionAttributes } = matter(fileContent);

                if (path.dirname(content) !== path.dirname(item.section)) {
                  if (subSectionAttributes.title) {
                    return `\n### ${subSectionAttributes.title}\n\n* [${subSectionAttributes.title}](/${content})`;
                  } else {
                    return `\n### ${content}\n\n* [${content}](/${content})`;
                  }
                } else if (subSectionAttributes.title) {
                  return `* [${subSectionAttributes.title}](/${content})`;
                } else {
                  return `* [${content}](/${content})`;
                }
              } else {
                let subSectionContent: string = '';

                const fileContent = fs.readFileSync(content.section, 'utf8');
                const { data: subSectionAttributes } = matter(fileContent);
                if (subSectionAttributes.title) {
                  subSectionContent = `\n### ${subSectionAttributes.title}\n\n* [${subSectionAttributes.title}](/${content.section})`;
                } else {
                  subSectionContent = `\n### ${subSectionAttributes.title}\n\n* [${content.section}](/${content.section})`;
                }

                content.contents.forEach((subContent) => {
                  const fileContent = fs.readFileSync(
                    String(subContent),
                    'utf8'
                  );
                  const { data: subSectionAttributes } = matter(fileContent);
                  if (subSectionAttributes.title) {
                    subSectionContent += `\n* [${subSectionAttributes.title}](/${subContent})`;
                  } else {
                    subSectionContent += `\n* [${subContent}](/${subContent})`;
                  }
                });

                return subSectionContent;
              }
            })
            .join('\n');
          if (headerAttributes.title) {
            return `\n## ${headerAttributes.title}\n\n* [${headerAttributes.title}](/${item.section})\n${furtherLinks}\n`;
          } else {
            return `\n## ${item.section}\n\n* [${item.section}](/${item.section})\n${furtherLinks}\n`;
          }
        }
      })
      .join('\n');

    fs.writeFileSync(chaptersPath, frontMatter + yamlString, 'utf8');

    return;
  }
}

if (require.main === module) {
  process.stdout.write('\x1b[34mCreating chapters\x1b[0m');
  const chapters = new Chapters();
  chapters.run();
  process.stdout.write('\x1b[34m - pass\x1b[0m\n');
}
