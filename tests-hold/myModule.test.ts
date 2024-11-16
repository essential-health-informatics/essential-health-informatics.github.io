// test file: myModule.test.ts
import * as myModule from "../myModule";
import * as timelineMain from "../utils/timeline-main";

// jest.mock("../utils/timeline-main", () => {
//   const originalModule = jest.requireActual("../utils/timeline-main");
//   return {
//     ...originalModule, // Keep the other exports as they are
//     logTsFilesInChapters: jest.fn(() => []), // Mock only functionA
//   };
// });

describe("logTsFilesInChapters ", () => {
  //   it("mock logTsFilesInChapters", () => {
  //     expect(timelineMain.logTsFilesInChapters()).toBe("Mocked Function A");
  //   });

  it("mock populateAllTimelines", () => {
    const timeLineClass = new timelineMain.TimeLineIndexPages();
    jest.spyOn(timeLineClass, "logTsFilesInChapters").mockReturnValue([]);

    timeLineClass.populateAllTimelines();
  });
});

// Partially mock the module
// jest.mock("../myModule", () => {
//   const originalModule = jest.requireActual("../myModule");
//   return {
//     ...originalModule, // Keep the other exports as they are
//     functionA: jest.fn(() => "Mocked Function A"), // Mock only functionA
//   };
// });

// describe("Partial mocking with Jest", () => {
//   it("should mock functionA", () => {
//     expect(myModule.functionA()).toBe("Mocked Function A");
//   });

//   it("should use the real implementation of functionB", () => {
//     expect(myModule.functionB()).toBe("Real Function B");
//   });
// });
