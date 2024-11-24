import { Crop } from '../../utils/banners';
import * as d from './banner.data';
import * as glob from 'glob';
import * as fs from 'fs';
import * as jsdom from 'jsdom';

jest.mock('glob');
jest.mock('fs');

describe('crop3to1', () => {
  let img: NodeListOf<HTMLImageElement>;

  beforeEach(() => {
    jest.resetAllMocks();
    const dom = new jsdom.JSDOM(d.htmlContent);
    const document: Document = dom.window.document;
    img = document.querySelectorAll<HTMLImageElement>('img[data-crop]');
  });

  it('should throw error when file path does not exist', () => {
    const fsExistsSyncMock = fs.existsSync as unknown as jest.Mock;
    fsExistsSyncMock.mockReturnValue(false);
    const crop = new Crop();
    const imgBad = new jsdom.JSDOM(d.htmlContent).window.document.querySelector(
      'img'
    );
    expect(() =>
      crop.crop3to1(d.testFileName, imgBad as HTMLImageElement, 50)
    ).toThrow(`The file path ${d.testFileName} does not exist`);
  });

  it('should throw an error when no src in img', () => {
    const fsExistsSyncMock = fs.existsSync as unknown as jest.Mock;
    fsExistsSyncMock.mockReturnValue(true);
    const dom = new jsdom.JSDOM(d.htmlContentNoSrc);
    const document: Document = dom.window.document;
    const imgBad =
      document.querySelectorAll<HTMLImageElement>('img[data-crop]');

    const crop = new Crop();
    expect(() => crop.crop3to1(d.testFileName, imgBad[0], 50)).toThrow(
      'The image has no src or alt attribute(s)'
    );
  });

  it('should throw an error when no alt in img', () => {
    const fsExistsSyncMock = fs.existsSync as unknown as jest.Mock;
    fsExistsSyncMock.mockReturnValue(true);
    const dom = new jsdom.JSDOM(d.htmlContentNoAlt);
    const document: Document = dom.window.document;
    const imgBad =
      document.querySelectorAll<HTMLImageElement>('img[data-crop]');

    const crop = new Crop();
    expect(() => crop.crop3to1(d.testFileName, imgBad[0], 50)).toThrow(
      'The image has no src or alt attribute(s)'
    );
  });

  it("should throw an error when number is not of type 'number'", () => {
    const fsExistsSyncMock = fs.existsSync as unknown as jest.Mock;
    fsExistsSyncMock.mockReturnValue(true);
    const position = 'invalid';

    const crop = new Crop();
    expect(() =>
      crop.crop3to1(d.testFileName, img[0], position as unknown as number)
    ).toThrow(`The position value of ${position} is not a number`);
  });

  it('should throw an error when number is below 0', () => {
    const fsExistsSyncMock = fs.existsSync as unknown as jest.Mock;
    fsExistsSyncMock.mockReturnValue(true);
    const position = -1;

    const crop = new Crop();
    expect(() =>
      crop.crop3to1(d.testFileName, img[0], position as unknown as number)
    ).toThrow(`The position value of ${position} is outside the range 0-100`);
  });

  it('should throw an error when number is above 100', () => {
    const fsExistsSyncMock = fs.existsSync as unknown as jest.Mock;
    fsExistsSyncMock.mockReturnValue(true);
    const position = 101;

    const crop = new Crop();
    expect(() =>
      crop.crop3to1(d.testFileName, img[0], position as unknown as number)
    ).toThrow(`The position value of ${position} is outside the range 0-100`);
  });

  it('should throw an error when no parent node', () => {
    const fsExistsSyncMock = fs.existsSync as unknown as jest.Mock;
    fsExistsSyncMock.mockReturnValue(true);
    const dom = new jsdom.JSDOM(d.htmlContent);
    const document: Document = dom.window.document;
    const imgBad =
      document.querySelectorAll<HTMLImageElement>('img[data-crop]');

    // Remove the parent node of the image
    if (imgBad[0] && imgBad[0].parentNode) {
      imgBad[0].parentNode.removeChild(imgBad[0]);
    }
    const crop = new Crop();
    expect(() => crop.crop3to1('testFile.html', imgBad[0], 50)).toThrow(
      `There was no parent node for image '../media/test_image.jpg' in file 'testFile.html'`
    );
  });

  it('should run all the way through', () => {
    const fsExistsSyncMock = fs.existsSync as unknown as jest.Mock;
    fsExistsSyncMock.mockReturnValue(true);

    const crop = new Crop();
    crop.crop3to1(d.testFileName, img[0], 50);
  });
});

describe('cropAnalyse', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw error when file path does not exist', () => {
    const fsExistsSyncMock = fs.existsSync as unknown as jest.Mock;
    fsExistsSyncMock.mockReturnValue(false);
    const crop = new Crop();
    expect(() => crop.cropAnalyse(d.testFileName)).toThrow(
      `The file path ${d.testFileName} does not exist`
    );
  });

  it('should throw error when no content found in file', () => {
    const fsExistsSyncMock = fs.existsSync as unknown as jest.Mock;
    fsExistsSyncMock.mockReturnValue(true);
    const fsReadFileSyncMock = fs.readFileSync as unknown as jest.Mock;
    fsReadFileSyncMock.mockReturnValue('');
    const crop = new Crop();
    expect(() => crop.cropAnalyse(d.testFileName)).toThrow(
      `No content found in file: ${d.testFileName}`
    );
  });

  it("if no 'data-crop' attributes, then should write nothing back to html file", () => {
    const fsExistsSyncMock = fs.existsSync as unknown as jest.Mock;
    fsExistsSyncMock.mockReturnValue(true);
    const fsReadFileSyncMock = fs.readFileSync as unknown as jest.Mock;
    fsReadFileSyncMock.mockReturnValue(d.htmlContentNoDataCropAttribute);
    const fsWriteFileSyncMock = fs.writeFileSync as unknown as jest.Mock;

    const crop3to1Mock = jest
      .spyOn(Crop.prototype, 'crop3to1')
      .mockImplementation(() => {});

    const crop = new Crop();
    crop.cropAnalyse(d.testFileName);

    expect(fsExistsSyncMock).toHaveBeenCalledTimes(1);
    expect(fsReadFileSyncMock).toHaveBeenCalledTimes(1);
    expect(fsWriteFileSyncMock).toHaveBeenCalledTimes(0);
    expect(crop3to1Mock).toHaveBeenCalledTimes(0);
  });

  it('should throw error if bad method in crop attribute', () => {
    const fsExistsSyncMock = fs.existsSync as unknown as jest.Mock;
    fsExistsSyncMock.mockReturnValue(true);
    const fsReadFileSyncMock = fs.readFileSync as unknown as jest.Mock;
    fsReadFileSyncMock.mockReturnValue(d.htmlContentBadMethod);
    const fsWriteFileSyncMock = fs.writeFileSync as unknown as jest.Mock;

    const crop3to1Mock = jest
      .spyOn(Crop.prototype, 'crop3to1')
      .mockImplementation(() => {});

    const crop = new Crop();
    expect(() => crop.cropAnalyse(d.testFileName)).toThrow(
      `\t* ${d.testFileName}: Unsupported crop method: ${d.badMethod}`
    );
    expect(fsExistsSyncMock).toHaveBeenCalledTimes(1);
    expect(fsReadFileSyncMock).toHaveBeenCalledTimes(1);
    expect(fsWriteFileSyncMock).toHaveBeenCalledTimes(0);
    expect(crop3to1Mock).toHaveBeenCalledTimes(0);
  });

  it('should throw error if bad value in crop attribute', () => {
    const fsExistsSyncMock = fs.existsSync as unknown as jest.Mock;
    fsExistsSyncMock.mockReturnValue(true);
    const fsReadFileSyncMock = fs.readFileSync as unknown as jest.Mock;
    fsReadFileSyncMock.mockReturnValue(d.htmlContentBadPosition);
    const fsWriteFileSyncMock = fs.writeFileSync as unknown as jest.Mock;

    const crop3to1Mock = jest
      .spyOn(Crop.prototype, 'crop3to1')
      .mockImplementation(() => {});

    const crop = new Crop();
    expect(() => crop.cropAnalyse(d.testFileName)).toThrow(
      `\t* ${d.testFileName}: The position value of ${d.positionBadValue} is not a number`
    );
    expect(fsExistsSyncMock).toHaveBeenCalledTimes(1);
    expect(fsReadFileSyncMock).toHaveBeenCalledTimes(1);
    expect(fsWriteFileSyncMock).toHaveBeenCalledTimes(0);
    expect(crop3to1Mock).toHaveBeenCalledTimes(0);
  });

  it('should run through correctly', () => {
    const fsExistsSyncMock = fs.existsSync as unknown as jest.Mock;
    fsExistsSyncMock.mockReturnValue(true);
    const fsReadFileSyncMock = fs.readFileSync as unknown as jest.Mock;
    fsReadFileSyncMock.mockReturnValue(d.htmlContent);
    const fsWriteFileSyncMock = fs.writeFileSync as unknown as jest.Mock;
    fsWriteFileSyncMock.mockReturnValue(d.htmlContent);
    const crop3to1Mock = jest
      .spyOn(Crop.prototype, 'crop3to1')
      .mockImplementation(() => {});

    const crop = new Crop();
    crop.cropAnalyse(d.testFileName);

    expect(fsExistsSyncMock).toHaveBeenCalledTimes(1);
    expect(fsReadFileSyncMock).toHaveBeenCalledTimes(1);
    expect(crop3to1Mock).toHaveBeenCalledTimes(1);
  });
});

describe('cropRun', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should run when files found', () => {
    const crop = new Crop();
    const globSyncMock = glob.sync as unknown as jest.Mock;
    globSyncMock.mockReturnValue(d.mockFiles);
    jest.spyOn(crop, 'cropAnalyse').mockImplementation(() => {});

    crop.cropRun();

    expect(globSyncMock).toHaveBeenCalledTimes(1);
  });

  it('should run when NO files found', () => {
    const crop = new Crop();
    const globSyncMock = glob.sync as unknown as jest.Mock;
    globSyncMock.mockReturnValue(d.mockFiles);
    jest.spyOn(crop, 'cropAnalyse').mockImplementation(() => {});

    globSyncMock.mockReturnValue([]);

    crop.cropRun();

    expect(globSyncMock).toHaveBeenCalledTimes(1);
  });
});
