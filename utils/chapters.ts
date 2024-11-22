import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import * as glob from 'glob';
import matter from 'gray-matter';

type StrYaml = string | Yaml;

interface Yaml {
  section: string;
  contents: StrYaml[];
}

interface FinalSidebar {
  website: {
    sidebar: {
      'collapse-level': number;
      contents: StrYaml[];
    };
  };
}

class Chapters {
  chaptersFolder = 'chapters';
  directoryPath = path.join(process.cwd(), this.chaptersFolder);
  searchPattern = `${this.directoryPath}/**/*.qmd`;

  constructor() {}

  /**
   * Create sidebar structure from files
   *
   * @param files
   * @returns StrYaml[] - Sidebar structure
   */
  createYmlObject = (files: string[]): StrYaml[] => {
    const groupedFiles: { [key: string]: string[] } = {};
    let ymlContents: StrYaml[] = [];

    files = files.map((file) => path.relative(this.directoryPath, file));

    files.sort((a, b) => {
      const getNumericPrefix = (str: string) => {
        const match = str.match(/^(\d+(-\d+)*)/);
        return match ? match[0] : '';
      };

      // Extract directory paths
      const aDir = path.dirname(a);
      const bDir = path.dirname(b);

      if (a === 'index.qmd') return -1;
      if (b === 'index.qmd') return 1;

      // If both files are in the same directory, prioritize index.qmd
      if (aDir === bDir) {
        if (a.endsWith('index.qmd')) return -1;
        if (b.endsWith('index.qmd')) return 1;
      }

      const aPrefix = getNumericPrefix(a);
      const bPrefix = getNumericPrefix(b);

      if (aPrefix && bPrefix) {
        const aParts = aPrefix.split('-').map(Number);
        const bParts = bPrefix.split('-').map(Number);

        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          if (aParts[i] !== bParts[i]) {
            return (aParts[i] || 0) - (bParts[i] || 0);
          }
        }
      }

      // Ensure directories with index.qmd come before subdirectories
      if (aDir.startsWith(bDir) && b.endsWith('index.qmd')) return 1;
      if (bDir.startsWith(aDir) && a.endsWith('index.qmd')) return -1;

      return a.localeCompare(b);
    });

    files = files.map((file) => path.join(this.chaptersFolder, file));

    files.forEach((file) => {
      const pathParts = file.split(path.sep);
      const dir = path.dirname(file);
      const basePath = pathParts.slice(0, 2).join(path.sep);

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
      } else if (!groupedFiles[basePath][0].endsWith('index.qmd')) {
        const firstDir = path.dirname(groupedFiles[basePath][0]);
        throw new Error(
          `'${firstDir}' directory doesn't have an index.qmd file!`
        );
      } else {
        let subDirectoryFiles: string[] = groupedFiles[basePath].slice(1);

        const subGroupedFiles: { [key: string]: string[] } = {};

        subDirectoryFiles.forEach((file) => {
          const dir = path.dirname(file);
          if (!subGroupedFiles[dir]) {
            subGroupedFiles[dir] = [];
          }
          subGroupedFiles[dir].push(file);
        });

        const subFiles = Object.values(subGroupedFiles);
        let contents: StrYaml[] = [];

        if (Object.keys(subGroupedFiles).length === 1) {
          ymlContents.push({
            section: groupedFiles[basePath][0],
            contents: subDirectoryFiles
          });
        } else {
          for (const dir in subGroupedFiles) {
            if (!subGroupedFiles[dir][0].endsWith('index.qmd')) {
              const firstDir = path.dirname(dir);
              throw new Error(
                `'${firstDir}' directory doesn't have an index.qmd file!`
              );
            } else if (subGroupedFiles[dir].length === 1) {
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
  };

  /**
   * Write sidebar structure to file
   *
   * @param yamlPath
   * @param yamlObject
   * @returns StrYaml[] - Sidebar structure
   */
  writeYaml(yamlPath: string, yamlObject: StrYaml[]): void {
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

  createChapterFile(chaptersPath: string, ymlObject: StrYaml[]): void {
    const frontMatter = `---
title: Chapters
sidebar: false
---
`;
    let yamlString = '';
    console.log('');

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
                // console.log('Item --', item.section);
                // console.log('Content --', content);

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

  /**
   * Run the script
   */
  run() {
    const sidebarPath: string = path.join(process.cwd(), 'sidebar.yml');
    const chaptersPath: string = path.join(
      process.cwd(),
      this.chaptersFolder,
      'index.qmd'
    );
    const files = glob.sync(this.searchPattern);

    const sidebarStructure: StrYaml[] = this.createYmlObject(files);

    this.writeYaml(sidebarPath, sidebarStructure);

    this.createChapterFile(chaptersPath, sidebarStructure);
  }
}

if (require.main === module) {
  process.stdout.write('\x1b[34mCreating chapters\x1b[0m');
  const chapters = new Chapters();
  chapters.run();
  process.stdout.write('\x1b[34m - pass\x1b[0m\n');
}
