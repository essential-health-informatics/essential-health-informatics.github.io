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
  relativePath: string = '..';
  chaptersFolder: string = 'chapters';
  directoryPath: string = path.join(
    process.cwd(),
    this.relativePath,
    this.chaptersFolder
  );
  searchPattern: string = `${this.directoryPath}/**/*.{qmd,ts}`;

  constructor() {}

  /**
   * Run all the methods to create the sidebar and chapters files.
   */
  public run(): void {
    const sidebarPath: string = path.join(
      process.cwd(),
      this.relativePath,
      'sidebar.yml'
    );
    const chaptersPath: string = path.join(
      process.cwd(),
      this.relativePath,
      this.chaptersFolder,
      'index.qmd'
    );

    let files: string[] = glob.sync(this.searchPattern);
    if (files.length === 0) {
      throw new Error('No files found');
    }

    files = this.removeTimelineChildren(files);
    this.checkForTitles(files);
    const sidebarStructure: StrYaml[] = this.createYmlObject(files);
    this.writeYaml(sidebarPath, sidebarStructure);
    this.createChapterFile(chaptersPath, sidebarStructure);
  }

  /**
   * Remove timeline children from the files except index.qmd.
   *
   * @param files - Files to remove timeline children from.
   * @returns Files with timeline children removed except index.qmd.
   */
  protected removeTimelineChildren(files: string[]): string[] {
    const timelineFolders = new Set<string>();

    files.forEach((file) => {
      if (file.endsWith('timeline.ts')) {
        const dir: string = path.dirname(file);
        timelineFolders.add(dir);
      }
    });

    files = files.filter((file) => {
      const dir: string = path.dirname(file);
      if (timelineFolders.has(dir)) {
        return file.endsWith('index.qmd');
      }
      return true;
    });

    return files;
  }

  /**
   * Check that each file has a title in its front matter.
   *
   * @param files - The files to check for titles.
   * @throws Error - If no title found in a file.
   *
   */
  public checkForTitles(files: string[]): void {
    files.forEach((file) => {
      const fileContent = fs.readFileSync(file, 'utf8');
      const { data: attributes } = matter(fileContent);

      if (!attributes.title) {
        throw new Error(`No title found in '${file}' file`);
      }
    });
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
      throw new Error('No files have been supplied');
    }

    files.forEach((file) => {
      if (!file.endsWith('.qmd')) {
        throw new Error(`File '${file}' does not end with .qmd`);
      }
    });

    files = files.map((file) => {
      const filePath = path.relative(this.directoryPath, file);
      return filePath;
    });

    const noIndexFolders: string[] = this.checkIndexFiles(files);
    if (noIndexFolders.length !== 0) {
      throw new Error(
        `'index.qmd' missing from folder(s):\n\n${noIndexFolders}`
      );
    }

    const ymlContents: StrYaml[] = [];

    files.sort((a, b) => {
      // Extract directory paths.
      const aDir: string = path.dirname(a);
      const bDir: string = path.dirname(b);

      // Place the 'chapters/index.qmd' file at the top.
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
        const subDirectoryFiles: string[] = groupedFiles[basePath].slice(1);
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
          const contents: StrYaml[] = [];

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

    const failedFolders: string[] = [];

    directories.forEach((dir) => {
      const indexFile = path.join(dir, 'index.qmd');
      if (!files.includes(indexFile)) {
        failedFolders.push(dir);
      }
    });

    return failedFolders;
  }

  /**
   * Write sidebar structure to yaml file
   *
   * @param yamlPath - The path to write the sidebar yaml file.
   * @param yamlObject - The sidebar structure in yaml format.
   * @throws Error - If failed to write the yaml file.
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

    try {
      const yamlString =
        yaml.stringify(finalSidebar) +
        `      - text: Code Documentation
        href: chapters/code-documentation/index.html`;

      // Ensure the directory exists
      const dir = path.dirname(yamlPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(yamlPath, yamlString, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write YAML file: ${error}`);
    }
    return;
  }

  /**
   *
   * Create the chapters index.qmd file.
   *
   * @param chaptersPath
   * @param ymlObject
   * @throws Error - If no chapters path has been supplied.
   * @throws Error - If no yaml object has been supplied.
   * @throws Error - If no title found in a .qmd file.
   * @returns
   */
  protected createChapterFile(
    chaptersPath: string,
    ymlObject: StrYaml[]
  ): void {
    if (chaptersPath.length === 0) {
      throw new Error('No chapters path has been supplied');
    }

    if (ymlObject.length === 0) {
      throw new Error('No yaml object has been supplied');
    }

    const yamlString = ymlObject
      .map((item: StrYaml) => {
        if (item === 'chapters/index.qmd') {
          return;
        } else if (typeof item === 'string') {
          const title: string = this.getTitle(item);
          return `## ${title}\n\n* [${title}](/${item})\n`;
        } else {
          const furtherLinks: StrYaml = item.contents
            .map((content: StrYaml) => {
              if (typeof content === 'string') {
                const childTitle: string = this.getTitle(String(content));

                if (path.dirname(content) !== path.dirname(item.section)) {
                  return `\n### ${childTitle}\n\n* [${childTitle}](/${content})`;
                } else {
                  return `* [${childTitle}](/${content})`;
                }
              } else {
                const childTitle: string = this.getTitle(
                  String(content.section)
                );
                let subSectionContent: string = `\n### ${childTitle}\n\n* [${childTitle}](/${content.section})`;

                content.contents.forEach((subContent: StrYaml) => {
                  const grandChildTitle: string = this.getTitle(
                    String(subContent)
                  );

                  subSectionContent += `\n* [${grandChildTitle}](/${subContent})`;
                });

                return subSectionContent;
              }
            })
            .join('\n');

          const parentTitle: string = this.getTitle(item.section);

          return `## ${parentTitle}\n\n* [${parentTitle}](/${item.section})\n${furtherLinks}\n`;
        }
      })
      .join('\n');

    const frontMatter: string = `---
title: Chapters
sidebar: false
---
`;
    const codeDoc: string = `\n## Code Documentation\n\n* [Code Documentation](/chapters/code-documentation/index.html)`;

    fs.writeFileSync(chaptersPath, frontMatter + yamlString + codeDoc, 'utf8');

    return;
  }

  /**
   * Get the title from the front matter of a file.
   *
   * @param file - The file to get the title from.
   * @throws Error - If no title found in the file.
   * @returns The title of the file.
   */
  protected getTitle(file: string): string {
    const fileContent: string = fs.readFileSync(
      path.join(this.relativePath, file),
      'utf8'
    );
    const { data: attributes } = matter(fileContent);

    if (!attributes.title) {
      throw new Error(`Title is missing for '${file}'`);
    }

    return attributes.title;
  }
}

if (require.main === module) {
  process.stdout.write('\x1b[34mCreating chapters\x1b[0m');
  const chapters = new Chapters();
  chapters.run();
  process.stdout.write('\x1b[34m - pass\x1b[0m\n');
}
