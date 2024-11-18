import * as fs from "fs";
import * as path from "path";
import { Crop } from "../../utils/banner";
import * as d from "./banner.data";
import * as glob from "glob";

jest.mock("glob");

describe("cropRun", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should run when files found", () => {
    const crop = new Crop();
    const globSyncMock = glob.sync as unknown as jest.Mock;
    globSyncMock.mockReturnValue(d.mockFiles);
    jest.spyOn(crop, "cropAnalyse").mockImplementation(() => {});

    crop.cropRun();

    expect(globSyncMock).toHaveBeenCalledTimes(1);
  });

  it("should run when No files found", () => {
    const crop = new Crop();
    const globSyncMock = glob.sync as unknown as jest.Mock;
    globSyncMock.mockReturnValue(d.mockFiles);
    jest.spyOn(crop, "cropAnalyse").mockImplementation(() => {});

    globSyncMock.mockReturnValue([]);

    crop.cropRun();

    expect(globSyncMock).toHaveBeenCalledTimes(1);
  });
});
