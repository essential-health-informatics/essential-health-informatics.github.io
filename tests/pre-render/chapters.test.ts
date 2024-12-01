import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import * as glob from 'glob';
import matter from 'gray-matter';
import { StrYaml, Yaml, Chapters } from '../../utils/chapters';
import * as d from './chapters.data';
import { after } from 'node:test';
import { cloneDeep } from 'lodash';
import { dir } from 'console';
import exp from 'constants';

jest.mock('fs');
jest.mock('glob');
jest.mock('gray-matter');

class ChaptersTestable extends Chapters {
  run(): void {
    return super.run();
  }

  removeTimelineChildren(files: string[]): string[] {
    return super.removeTimelineChildren(files);
  }

  checkForTitles(files: string[]): void {
    return super.checkForTitles(files);
  }

  createYmlObject(files: string[]): StrYaml[] {
    return super.createYmlObject(files);
  }

  checkIndexFiles(files: string[]): string[] {
    return super.checkIndexFiles(files);
  }

  writeYaml(yamlPath: string, yamlObject: StrYaml[]): void {
    return super.writeYaml(yamlPath, yamlObject);
  }

  createChapterFile(chaptersPath: string, ymlObject: (string | Yaml)[]): void {
    return super.createChapterFile(chaptersPath, ymlObject);
  }

  getTitle(file: string): string {
    return super.getTitle(file);
  }
}

describe('run', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('throws Error when no files found', () => {
    const globSyncMock = glob.sync as unknown as jest.Mock;
    globSyncMock.mockReturnValue([]);
    const chapters = new ChaptersTestable();
    // Did not use prototypes here as needed an instance of the class to access the class variables
    const removeTimelineChildrenSpy = jest
      .spyOn(chapters as any, 'removeTimelineChildren')
      .mockImplementation((files) => files);
    const checkForTitlesSpy = jest
      .spyOn(chapters as any, 'checkForTitles')
      .mockImplementation(() => {});
    const createYmlObjectSpy = jest
      .spyOn(chapters as any, 'createYmlObject')
      .mockImplementation(() => ['/a-file.qmd']);
    const writeYamlSpy = jest
      .spyOn(chapters as any, 'writeYaml')
      .mockImplementation(() => {});
    const createChapterFileSpy = jest
      .spyOn(chapters as any, 'createChapterFile')
      .mockImplementation(() => {});

    expect(() => chapters.run()).toThrow('No files found');

    expect(globSyncMock).toHaveBeenCalledTimes(1);
    expect(removeTimelineChildrenSpy).toHaveBeenCalledTimes(0);
    expect(checkForTitlesSpy).toHaveBeenCalledTimes(0);
    expect(createYmlObjectSpy).toHaveBeenCalledTimes(0);
    expect(writeYamlSpy).toHaveBeenCalledTimes(0);
    expect(createChapterFileSpy).toHaveBeenCalledTimes(0);
  });

  it('run normally', () => {
    const globSyncMock = glob.sync as unknown as jest.Mock;
    globSyncMock.mockReturnValue(d.qmdFiles);

    const chapters = new ChaptersTestable();
    // Did not use prototypes here as needed an instance of the class to access the class variables
    const removeTimelineChildrenSpy = jest
      .spyOn(chapters as any, 'removeTimelineChildren')
      .mockImplementation((files) => files);
    const checkForTitlesSpy = jest
      .spyOn(chapters as any, 'checkForTitles')
      .mockImplementation(() => {});
    const createYmlObjectSpy = jest
      .spyOn(chapters as any, 'createYmlObject')
      .mockImplementation(() => ['/a-file.qmd']);
    const writeYamlSpy = jest
      .spyOn(chapters as any, 'writeYaml')
      .mockImplementation(() => {});
    const createChapterFileSpy = jest
      .spyOn(chapters as any, 'createChapterFile')
      .mockImplementation(() => {});

    chapters.run();

    expect(globSyncMock).toHaveBeenCalledTimes(1);
    expect(removeTimelineChildrenSpy).toHaveBeenCalledTimes(1);
    expect(checkForTitlesSpy).toHaveBeenCalledTimes(1);
    expect(createYmlObjectSpy).toHaveBeenCalledTimes(1);
    expect(writeYamlSpy).toHaveBeenCalledTimes(1);
    expect(createChapterFileSpy).toHaveBeenCalledTimes(1);
  });
});

describe('removeTimelineChildren', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('removes children and timeline.ts, except index.qmd', () => {
    const chapters = new ChaptersTestable();

    expect(chapters.removeTimelineChildren(d.timelineFiles)).toStrictEqual(
      d.timelineFilesOutput
    );
  });

  it('no removal of files if no timeline.ts file', () => {
    const chapters = new ChaptersTestable();

    expect(
      chapters.removeTimelineChildren(d.timelineFilesNoDotTs)
    ).toStrictEqual(d.timelineFilesNoDotTs);
  });

  it('should pass when no files provided', () => {
    const chapters = new ChaptersTestable();

    expect(chapters.removeTimelineChildren([])).toStrictEqual([]);
  });
});

describe('createYmlObject', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw an error when no files were provided', () => {
    const chapters = new ChaptersTestable() as any;

    expect(() => chapters.createYmlObject([])).toThrow(
      'No files have been supplied'
    );
  });

  it('should throw an error if not all .qmd files', () => {
    const chapters = new ChaptersTestable() as any;

    expect(() => chapters.createYmlObject(d.notAllQmdFiles)).toThrow(
      `File '${d.notQmdFile}' does not end with .qmd`
    );
  });

  it("should throw an error no 'index.qmd' file in folders with files in them", () => {
    const chapters = new ChaptersTestable();

    jest.spyOn(chapters as any, 'checkIndexFiles').mockImplementation(() => {
      return d.folderMissingIndex;
    });

    expect(() => chapters.createYmlObject(d.qmdFilesMissingIndex)).toThrow(
      `'index.qmd' missing from folder(s):\n\n${d.folderMissingIndex}`
    );
  });

  it('should pass', () => {
    const chapters = new ChaptersTestable();

    jest.spyOn(chapters as any, 'checkIndexFiles').mockImplementation(() => {
      return [];
    });

    const yamlObject = chapters.createYmlObject(d.qmdFiles);

    expect(yaml.stringify(yamlObject).trim()).toStrictEqual(d.yamlObjectStr);
  });
});

describe('checkIndexFiles', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('return no folders if each folder with files has an index.qmd file', () => {
    const chapters = new ChaptersTestable();

    const returnedFolders = chapters.checkIndexFiles(d.qmdFiles);

    expect(returnedFolders).toStrictEqual([]);
  });

  it('return the issue folder if folder has files, but no index.qmd file', () => {
    const chapters = new ChaptersTestable();
    let qmdFilesBadFolder = cloneDeep(d.qmdFiles);
    qmdFilesBadFolder.push(d.notAnIndexFile);

    const returnedFolders = chapters.checkIndexFiles(qmdFilesBadFolder);

    expect(returnedFolders).toStrictEqual([d.aFolder]);
  });
});

describe('checkForTitle', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('throws an error if no title is found', () => {
    const chapters = new ChaptersTestable();
    const matterMock = matter as any as jest.Mock;
    matterMock.mockReturnValue({
      data: { title: '' },
      content: 'Some content'
    });

    expect(() => chapters.checkForTitles(d.qmdFiles)).toThrow(
      `No title found in '${d.qmdFiles[0]}' file`
    );

    expect(matterMock).toHaveBeenCalledTimes(1);
  });

  it('should pass', () => {
    const chapters = new ChaptersTestable();
    const matterMock = matter as any as jest.Mock;
    matterMock.mockReturnValue({
      data: { title: 'A title' },
      content: 'Some content'
    });

    chapters.checkForTitles(d.qmdFiles);

    expect(matterMock).toHaveBeenCalledTimes(d.qmdFiles.length);
  });
});

describe('writeYaml', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw an error as mkdirSync fails', () => {
    const errorMessage = 'Error mkdirSync';
    const directory = path.dirname(d.sidebarYamlPath);
    const existsSyncMock = jest
      .spyOn(fs, 'existsSync')
      .mockImplementation(() => {
        return false;
      });
    const mkdirSyncMock = jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const chapters = new ChaptersTestable();

    expect(() => chapters.writeYaml(d.sidebarYamlPath, d.yamlObject2)).toThrow(
      `Failed to write YAML file: Error: ${errorMessage}`
    );

    expect(existsSyncMock).toHaveBeenCalledWith(directory);
    expect(mkdirSyncMock).toHaveBeenLastCalledWith(directory, {
      recursive: true
    });
  });

  it('should throw an error as writeFileSync fails', () => {
    const errorMessage = 'writeFileSync';
    const directory = path.dirname(d.sidebarYamlPath);
    const existsSyncMock = jest
      .spyOn(fs, 'existsSync')
      .mockImplementation(() => {
        return true;
      });
    const mkdirSyncMock = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {
        throw new Error(errorMessage);
      });

    const chapters = new ChaptersTestable();

    expect(() => chapters.writeYaml(d.sidebarYamlPath, d.yamlObject2)).toThrow(
      `Failed to write YAML file: Error: ${errorMessage}`
    );

    expect(existsSyncMock).toHaveBeenCalledWith(directory);
    expect(mkdirSyncMock).toHaveBeenCalledWith(
      d.sidebarYamlPath,
      d.yamlObjectStringified,
      'utf8'
    );
  });

  it('should throw an error as writeFileSync fails', () => {
    const errorMessage = 'writeFileSync';
    const directory = path.dirname(d.sidebarYamlPath);
    const existsSyncMock = jest
      .spyOn(fs, 'existsSync')
      .mockImplementation(() => {
        return true;
      });
    const writeFileSyncMock = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    const chapters = new ChaptersTestable();
    chapters.writeYaml(d.sidebarYamlPath, d.yamlObject2);

    expect(existsSyncMock).toHaveBeenCalledWith(directory);
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      d.sidebarYamlPath,
      d.yamlObjectStringified,
      'utf8'
    );
  });
});

const makeshiftTitle = (str: string): string => {
  str = str.replace(/^\d+-/, '');
  let newTitle = str.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });

  newTitle = newTitle + ' (makeshift)';
  return newTitle;
};

describe('createChapterFile', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw an error if chapters path length is zero', () => {
    const chapters = new ChaptersTestable();

    expect(() => chapters.createChapterFile('', d.yamlObject2)).toThrow(
      'No chapters path has been supplied'
    );
  });

  it('should throw an error if ymlObject has 0 length', () => {
    const chapters = new ChaptersTestable();

    expect(() => chapters.createChapterFile(d.aFolder, [])).toThrow(
      'No yaml object has been supplied'
    );
  });

  it('should pass normally', () => {
    const chapters = new ChaptersTestable();
    const getTitleMock = jest
      .spyOn(chapters as any, 'getTitle')
      .mockImplementation((file) => {
        const fileName = path.basename(
          String(file),
          path.extname(String(file))
        );
        return makeshiftTitle(fileName);
      });
    const writeFileSyncMock = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    chapters.createChapterFile(d.finalChapterFileName, d.yamlObject2);

    expect(getTitleMock).toHaveBeenCalledTimes(18);

    // console.log(writeFileSyncMock.mock.calls);

    expect(writeFileSyncMock).toHaveBeenCalledWith(
      d.finalChapterFileName,
      d.finalChapterFileContents,
      'utf8'
    );
  });
});

describe('getTitle', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should throw an error if title is missing in the front matter', () => {
    const chapters = new ChaptersTestable();
    const readFileSyncMock = jest
      .spyOn(fs, 'readFileSync')
      .mockImplementation(() => d.missingFrontMatter);
    const matterMock = matter as unknown as jest.Mock;
    matterMock.mockReturnValue({ data: { title: '' } });

    expect(() => chapters.getTitle(d.finalChapterFileName)).toThrow(
      `Title is missing for '${d.finalChapterFileName}'`
    );

    expect(readFileSyncMock).toHaveBeenCalledWith(
      d.finalChapterFileName,
      'utf8'
    );
    expect(matterMock).toHaveBeenCalledTimes(1);
  });

  it('should return the title from the front matter', () => {
    const chapters = new ChaptersTestable();
    const readFileSyncMock = jest
      .spyOn(fs, 'readFileSync')
      .mockImplementation(() => d.hasFrontMatter);
    const matterMock = matter as unknown as jest.Mock;
    matterMock.mockReturnValue({ data: { title: 'A title' } });

    const title = chapters.getTitle(d.finalChapterFileName);
    expect(title).toBe('A title');
    expect(readFileSyncMock).toHaveBeenCalledWith(
      d.finalChapterFileName,
      'utf8'
    );
  });
});
