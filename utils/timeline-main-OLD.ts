/**
 * @module TimelineMain
 *
 * Provides functions to generate and populate timeline HTML pages based on
 * date containers and metadata. It includes functionality to log TypeScript files in
 * specified directories and to create timeline index pages.
 *
 * Functions:
 * - populateTimeline: Generates HTML content for a timeline and writes it to an output file.
 * - logTsFilesInChapters: Logs and returns TypeScript files in specified chapters.
 * - populateAllTimelines: Creates index pages for all timelines found in the specified directories.
 *
 * Usage:
 * Can be used to automate the creation of timeline HTML pages for a website.
 * It searches for `timeline.ts` files in specified directories, processes the data, and
 * generates corresponding HTML files.
 */

import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import * as timelineMain from "../utils/timeline-main";

const directoryPath: string = "chapters/";

interface TimelineModule {
  DatesContainers: DatesContainer[];
  metaData: MetaData;
}

export interface MetaData {
  title: string;
}

export interface DatesContainer {
  year: string;
  image_src: string;
  alt_text: string;
  header: string;
  content: string;
  further_details?: boolean | string;
}

interface FileDescriptor {
  directory: string;
  filename: string;
}

/**
 * Populates a timeline with events and writes it to an output file.
 *
 * Generates HTML content for a timeline based on the provided date containers,
 * title, and output filename. Writes the generated HTML to the specified output file.
 *
 * @param {DatesContainer[]} datesContainers - An array of date containers representing timeline events.
 * @param {string} title - The title of the timeline.
 * @param {string} outputFilename - The path to the output file where the timeline HTML will be written.
 * @throws {Error} If datesContainers is empty.
 * @throws {Error} If title is empty.
 * @throws {Error} If outputFilename is not a .qmd file.
 */
export function populateTimeline(
  datesContainers: DatesContainer[],
  title: string,
  outputFilename: string
): void {
  if (!datesContainers || datesContainers.length === 0) {
    throw new Error("DatesContainers can not be empty");
  }

  if (!title || title.trim() === "") {
    throw new Error("Title can not be empty");
  }

  if (!outputFilename || !outputFilename.endsWith(".qmd")) {
    throw new Error("OutputFilename must be a .qmd file");
  }

  let timelineEvent: string = "";
  let isLeft = true;

  const openingHTML = `---
title: "${title}"
sidebar: false
---

\`\`\`{=html}
<div id="timeline" class="timeline">
`;

  const closingHTML = `
</div>

<script type="module" src="/static/js/timeline-runtime.js"></script>
\`\`\`
`;

  fs.writeFileSync(outputFilename, openingHTML);

  datesContainers.forEach((container, index) => {
    const positionClass = isLeft ? "left" : "right";
    isLeft = !isLeft; // Toggle the flag
    let further_details: boolean | string = "";

    if (container.further_details) {
      let url = "";
      if (typeof container.further_details === "boolean") {
        url =
          container.header
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "") + ".html";
      } else {
        url = container.further_details;
      }
      further_details = `<p><a href="${url}" target="_blank">Further details...</a></p>`;
    }

    timelineEvent = `
    <div class="date-container">
      <div class="bubble ${positionClass}">
        <p class="container-header">${container.year}</p>
        <img class="observed-image" src="${container.image_src}" alt="${container.alt_text}" style="width: 100%;">
        <button class="collapsible">${container.header}</button>
        <div class="collapsible-content">
          <p>${container.content}</p>${further_details}
        </div>
      </div>
    </div>
    `;

    fs.appendFileSync(outputFilename, timelineEvent);
  });

  fs.appendFileSync(outputFilename, closingHTML);
}

/**
 * Logs and returns TypeScript files in chapters.
 *
 * Searches for all `timeline.ts` files within the global `directoryPath` directory
 * and returns an array of objects containing the directory and filename of each file.
 *
 * @returns {FileDescriptor[]} - An array of objects containing the directory and filename of each `timeline.ts` file.
 */
export function logTsFilesInChapters(): FileDescriptor[] {
  console.log(1);
  const tsFiles: FileDescriptor[] = [];
  const pattern = path.join(directoryPath, "**/timeline.ts");
  const files = glob.sync(pattern);

  files.forEach((file: string) => {
    tsFiles.push({
      directory: path.dirname(file),
      filename: path.basename(file),
    });
  });

  return tsFiles;
}

/**
 * Populates all timelines.
 *
 * Creates index pages for all timelines found in the specified directories.
 */
export function populateAllTimelines() {
  console.log("Creating timeline index.qmd pages...");

  // TODO need typing for module
  const tsFiles = timelineMain.logTsFilesInChapters();

  console.log(
    `Found ${tsFiles.length} TypeScript files in chapters directory.`
  );

  if (!tsFiles || tsFiles.length === 0) {
    console.error("No TypeScript files found in chapters directory.");
    return;
  }

  tsFiles.forEach(({ directory, filename }) => {
    const modulePath = path.join(process.cwd(), directory, filename);
    let module: TimelineModule;

    try {
      module = require(modulePath);
    } catch {
      throw new Error(`Failed to load module at '${modulePath}'`);
    }

    const datesContainers: DatesContainer[] = module.DatesContainers;
    const metaData: MetaData = module.metaData;

    if (!datesContainers || datesContainers.length === 0) {
      console.error(`No datesContainers found in module at ${modulePath}`);
      return;
    }

    if (!metaData || !metaData.title || metaData.title.trim() === "") {
      console.error(`Invalid metaData or title in module at ${modulePath}`);
      return;
    }

    populateTimeline(datesContainers, metaData.title, `${directory}/index.qmd`);
    console.log(`  * ${directory}`);
  });

  console.log("Finished creating index pages for timeline.");
}

if (require.main === module) {
  populateAllTimelines();
}