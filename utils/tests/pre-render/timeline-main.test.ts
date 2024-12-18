import * as fs from 'fs';
import * as glob from 'glob';
import { TimeLineIndexPages } from '../../timeline-main';
import * as d from './timeline-main.data';

jest.mock('fs');
jest.mock('glob');

describe('populateTimeline', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('throws an error when datesContainers is empty', () => {
    const timeLineClass = new TimeLineIndexPages();
    expect(() =>
      timeLineClass.populateTimeline([], d.title, d.outputFilename)
    ).toThrow('DatesContainers can not be empty');
  });

  it('throws an error when title is empty', () => {
    const timeLineClass = new TimeLineIndexPages();
    expect(() =>
      timeLineClass.populateTimeline(d.datesContainers, '', d.outputFilename)
    ).toThrow('Title can not be empty');
  });

  it('throws an error when outputFilename is not a .qmd file', () => {
    const timeLineClass = new TimeLineIndexPages();
    expect(() =>
      timeLineClass.populateTimeline(
        d.datesContainers,
        d.title,
        d.outputFilenameBad
      )
    ).toThrow('OutputFilename must be a .qmd file');
  });

  it('writes accurately to file', () => {
    const timeLineClass = new TimeLineIndexPages();
    const writeFileSyncMock = fs.writeFileSync as jest.Mock;
    const appendFileSyncMock = fs.appendFileSync as jest.Mock;

    timeLineClass.populateTimeline(
      d.datesContainers,
      d.title,
      d.outputFilename
    );

    expect(writeFileSyncMock).toHaveBeenCalledTimes(1);
    expect(appendFileSyncMock).toHaveBeenCalledTimes(4);

    expect(writeFileSyncMock).toHaveBeenCalledWith(
      d.outputFilename,
      d.expectedWriteFileSync
    );

    d.expectedAppendFileSync.forEach((expected, index) => {
      expect(appendFileSyncMock).toHaveBeenNthCalledWith(
        index + 1,
        d.outputFilename,
        expected
      );
    });
  });
});

describe('logTsFilesInChapters', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("two valid paths returns two 'timeline.ts' paths", () => {
    const globSyncMock = glob.sync as unknown as jest.Mock;
    globSyncMock.mockReturnValue(d.mockFiles);
    const timeLineClass = new TimeLineIndexPages();

    const result = timeLineClass.logTsFilesInChapters();

    expect(result).toEqual([
      { directory: 'chapters/timeline/england-test', filename: 'timeline.ts' },
      { directory: 'chapters/timeline/wales-test', filename: 'timeline.ts' }
    ]);
    expect(globSyncMock).toHaveBeenCalledTimes(1);
  });

  it('no valid paths returns empty array', () => {
    const timeLineClass = new TimeLineIndexPages();
    const globSyncMock = glob.sync as unknown as jest.Mock;
    globSyncMock.mockReturnValue([]);

    const result = timeLineClass.logTsFilesInChapters();

    expect(result).toEqual([]);
    expect(globSyncMock).toHaveBeenCalledTimes(1);
  });
});

describe('populateAllTimelines', () => {
  const fullMockPath = `${d.path.basePath}/${d.path.directory}/${d.path.filename}`;

  beforeEach(() => {
    jest.resetAllMocks();
    const mockCwd = jest.spyOn(process, 'cwd');
    mockCwd.mockReturnValue(d.path.basePath);
  });

  it('console error when no TypeScript files are found', async () => {
    const timeLineClass = new TimeLineIndexPages();
    jest.spyOn(timeLineClass, 'logTsFilesInChapters').mockReturnValue([]);

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await timeLineClass.populateAllTimelines();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'No TypeScript files found in chapters directory.'
    );

    consoleErrorSpy.mockRestore();
  });

  it('console error when a module fails to load', async () => {
    const timeLineClass = new TimeLineIndexPages();
    jest
      .spyOn(timeLineClass, 'logTsFilesInChapters')
      .mockReturnValue([
        { directory: d.path.directory, filename: d.path.filename }
      ]);
    const mockCwd = jest.spyOn(process, 'cwd');
    mockCwd.mockReturnValue(d.path.basePath);

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await expect(timeLineClass.populateAllTimelines()).rejects.toThrow(
      `Failed to load module at '${fullMockPath}'`
    );

    consoleErrorSpy.mockRestore();
  });

  it('exception when no datesContainers module fail', async () => {
    const timeLineClass = new TimeLineIndexPages();
    jest
      .spyOn(timeLineClass, 'logTsFilesInChapters')
      .mockReturnValue([
        { directory: d.path.directory, filename: d.path.filename }
      ]);
    const mockCwd = jest.spyOn(process, 'cwd');
    mockCwd.mockReturnValue(d.path.basePath);

    await expect(() => timeLineClass.populateAllTimelines()).rejects.toThrow(
      `Failed to load module at '${fullMockPath}'`
    );
  });

  it("console error when no datesContainers content in 'timeline.ts' module", async () => {
    const timeLineClass = new TimeLineIndexPages();
    jest.spyOn(timeLineClass, 'logTsFilesInChapters').mockReturnValue([
      {
        directory: d.path.directory,
        filename: d.path.filename
      }
    ]);

    jest.doMock(
      fullMockPath,
      () => ({
        datesContainer: []
      }),
      { virtual: true }
    );

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await timeLineClass.populateAllTimelines();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `No datesContainers found in module at '${fullMockPath}'`
    );

    consoleErrorSpy.mockRestore();
  });

  it("console error when no MetaData in 'timeline.ts' module", async () => {
    const timeLineClass = new TimeLineIndexPages();
    jest.spyOn(timeLineClass, 'logTsFilesInChapters').mockReturnValue([
      {
        directory: d.path.directory,
        filename: d.path.filename
      }
    ]);

    jest.doMock(
      fullMockPath,
      () => ({
        datesContainer: d.datesContainers[0]
      }),
      { virtual: true }
    );

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await timeLineClass.populateAllTimelines();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Invalid metaData or title in module at '${fullMockPath}'`
    );

    consoleErrorSpy.mockRestore();
  });

  it('runs normally with good data', async () => {
    const timeLineClass = new TimeLineIndexPages();
    jest.spyOn(timeLineClass, 'logTsFilesInChapters').mockReturnValue([
      {
        directory: d.path.directory,
        filename: d.path.filename
      }
    ]);
    jest.spyOn(timeLineClass, 'populateTimeline').mockImplementation(() => {});

    jest.doMock(
      fullMockPath,
      () => ({
        datesContainer: d.datesContainers[0],
        metaData: d.metaData
      }),
      { virtual: true }
    );

    await timeLineClass.populateAllTimelines();

    expect(timeLineClass.populateTimeline).toHaveBeenCalledTimes(1);
    expect(timeLineClass.populateTimeline).toHaveBeenCalledWith(
      d.datesContainers[0],
      d.metaData.title,
      `${d.path.directory}/index.qmd`
    );
  });

  afterEach(() => {
    jest.resetModules();
  });
});
