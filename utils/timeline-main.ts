/**
 * Provides functions to generate and populate timeline HTML pages based on
 * date containers and metadata. It includes functionality to log TypeScript files in
 * specified directories and to create timeline index pages.
 *
 * Exports:
 * - Functions: populateTimeline, logTsFilesInChapters and populateAllTimelines
 *
 * @module TimelineMain
 */

import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

interface TimelineModule {
  datesContainer: DatesContainer[];
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

export class TimeLineIndexPages {
  readonly directoryPath: string = 'chapters/';

  constructor() {}

  /**
   * Populates all timelines.
   *
   * Creates index pages for all timelines found in the specified directories.
   */
  public populateAllTimelines(): void {
    console.log('Creating timeline index.qmd pages...');

    const tsFiles: FileDescriptor[] = this.logTsFilesInChapters();

    if (!tsFiles || tsFiles.length === 0) {
      console.error('No TypeScript files found in chapters directory.');
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

      const datesContainers: DatesContainer[] = module.datesContainer;
      const metaData: MetaData = module.metaData;

      if (!datesContainers || datesContainers.length === 0) {
        console.error(`No datesContainers found in module at '${modulePath}'`);
        return;
      }

      if (!metaData || !metaData.title || metaData.title.trim() === '') {
        console.error(`Invalid metaData or title in module at '${modulePath}'`);
        return;
      }

      this.populateTimeline(
        datesContainers,
        metaData.title,
        `${directory}/index.qmd`
      );
      console.log(`  * ${directory}`);
    });

    console.log('Finished creating index pages for timeline.');
  }
  /**
   * Logs and returns TypeScript files in chapters.
   *
   * @remarks
   * Searches for all `timeline.ts` files within the global `directoryPath` directory
   * and returns an array of objects containing the directory and filename of each file.
   *
   * @returns FileDescriptor[] - An array of objects containing the directory and filename of each `timeline.ts` file.
   */
  logTsFilesInChapters(): FileDescriptor[] {
    const tsFiles: FileDescriptor[] = [];
    const pattern = path.join(this.directoryPath, '**/timeline.ts');
    const files = glob.sync(pattern);

    files.forEach((file: string) => {
      tsFiles.push({
        directory: path.dirname(file),
        filename: path.basename(file)
      });
    });

    return tsFiles;
  }

  /**
   * Populates a timeline with events and writes it to an output file.
   *
   * @remarks
   * Generates HTML content for a timeline based on the provided date containers,
   * title, and output filename. Writes the generated HTML to the specified output file.
   *
   * @param datesContainers - An array of date containers representing timeline events.
   * @param title - The title of the timeline.
   * @param outputFilename - The path to the output file where the timeline HTML will be written.
   * @throws Error - If datesContainers is empty.
   * @throws Error - If title is empty.
   * @throws Error - If outputFilename is not a .qmd file.
   */
  populateTimeline(
    datesContainers: DatesContainer[],
    title: string,
    outputFilename: string
  ): void {
    if (!datesContainers || datesContainers.length === 0) {
      throw new Error('DatesContainers can not be empty');
    }

    if (!title || title.trim() === '') {
      throw new Error('Title can not be empty');
    }

    if (!outputFilename || !outputFilename.endsWith('.qmd')) {
      throw new Error('OutputFilename must be a .qmd file');
    }

    let timelineEvent: string = '';
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

    datesContainers.forEach((container) => {
      const positionClass = isLeft ? 'left' : 'right';
      isLeft = !isLeft; // Toggle the flag
      let further_details: boolean | string = '';

      if (container.further_details) {
        let url = '';
        if (typeof container.further_details === 'boolean') {
          url =
            container.header
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '') + '.html';
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
        <div class="collapsible-content hidden">
          <p>${container.content}</p>${further_details}
        </div>
      </div>
    </div>
    `;

      fs.appendFileSync(outputFilename, timelineEvent);
    });

    fs.appendFileSync(outputFilename, closingHTML);
  }
}

if (require.main === module) {
  const timelineManager = new TimeLineIndexPages();
  timelineManager.populateAllTimelines();
}
