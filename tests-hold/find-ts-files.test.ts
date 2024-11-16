describe("findTsFiles", () => {
  const mockFiles = ["src/file1.ts", "src/subdir/file2.ts"];
  let globSyncMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    globSyncMock = jest.fn().mockReturnValue(mockFiles);
    jest.doMock("glob", () => ({
      sync: globSyncMock,
    }));
  });

  it("should return a list of TypeScript files in the directory", () => {
    const { findTsFiles } = require("../utils/test-glob");
    const result = findTsFiles("src");

    expect(result).toEqual([
      { directory: "src", filename: "file1.ts" },
      { directory: "src/subdir", filename: "file2.ts" },
    ]);

    expect(globSyncMock).toHaveBeenCalledTimes(1);
  });

  // it("should call glob.sync with the correct pattern", () => {
  //   const { findTsFiles } = require("../utils/test-glob");
  //   findTsFiles("src");

  //   expect(globSyncMock).toHaveBeenCalledWith("src/**/*.ts");
  // });

  // it("should return an empty array if no TypeScript files are found", () => {
  //   globSyncMock.mockReturnValue([]);
  //   const { findTsFiles } = require("../utils/test-glob");
  //   const result = findTsFiles("src");

  //   expect(result).toEqual([]);
  // });

  // it("should handle directories with no TypeScript files gracefully", () => {
  //   globSyncMock.mockReturnValue([]);
  //   const { findTsFiles } = require("../utils/test-glob");
  //   const result = findTsFiles("emptyDir");

  //   expect(result).toEqual([]);
  // });
});
