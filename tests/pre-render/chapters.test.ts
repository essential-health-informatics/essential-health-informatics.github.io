import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import * as glob from 'glob';
import matter from 'gray-matter';
import { StrYaml, Yaml, Chapters } from '../../utils/chapters';
import * as d from './chapters.data';

jest.mock('fs');
jest.mock('glob');

class ChaptersTestable extends Chapters {
  run(): void {
    return super.run();
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
}

describe('run', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('no files logs a message as such', () => {
    const globSyncMock = glob.sync as unknown as jest.Mock;
    globSyncMock.mockReturnValue([]);
    let consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const chapters = new ChaptersTestable();
    // Did not use prototypes here as needed an instance of the class to access the class variables
    const createYmlObjectSpy = jest
      .spyOn(chapters as any, 'createYmlObject')
      .mockImplementation(() => ['hello']);
    const writeYamlSpy = jest
      .spyOn(chapters as any, 'writeYaml')
      .mockImplementation(() => {});
    const createChapterFileSpy = jest
      .spyOn(chapters as any, 'createChapterFile')
      .mockImplementation(() => {});

    chapters.run();

    expect(globSyncMock).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('No files found');
    expect(createYmlObjectSpy).toHaveBeenCalledTimes(0);
    expect(writeYamlSpy).toHaveBeenCalledTimes(0);
    expect(createChapterFileSpy).toHaveBeenCalledTimes(0);
  });

  it('run normally', () => {
    const globSyncMock = glob.sync as unknown as jest.Mock;
    globSyncMock.mockReturnValue(d.qmdFiles);

    const chapters = new ChaptersTestable();
    // Did not use prototypes here as needed an instance of the class to access the class variables
    const createYmlObjectSpy = jest
      .spyOn(chapters as any, 'createYmlObject')
      .mockImplementation(() => ['hello']);
    const writeYamlSpy = jest
      .spyOn(chapters as any, 'writeYaml')
      .mockImplementation(() => {});
    const createChapterFileSpy = jest
      .spyOn(chapters as any, 'createChapterFile')
      .mockImplementation(() => {});

    chapters.run();

    expect(globSyncMock).toHaveBeenCalledTimes(1);
    expect(createYmlObjectSpy).toHaveBeenCalledTimes(1);
    expect(writeYamlSpy).toHaveBeenCalledTimes(1);
    expect(createChapterFileSpy).toHaveBeenCalledTimes(1);
  });
});

describe('createYmlObject', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw an error no files were provided', () => {
    const chapters = new ChaptersTestable() as any;

    expect(() => chapters.createYmlObject([])).toThrow('No files found');
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
});
