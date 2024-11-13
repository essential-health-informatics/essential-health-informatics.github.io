import { promises as fs } from "fs";
import * as glob from "glob";
import * as path from "path";

export interface MetaData {
  title: string;
}

export interface DateContainer {
  year: string;
  image_src: string;
  alt_text: string;
  header: string;
  content: string;
  further_details?: boolean | string;
}

function populateTimeline(
  dateContainers: DateContainer[],
  title: string,
  outputFilename: string
): void {
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

  fs.writeFile(outputFilename, openingHTML);

  dateContainers.forEach((container) => {
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
      further_details = `
      <p><a href="${url}" target="_blank">Further details...</a></p>`;
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

    fs.appendFile(outputFilename, timelineEvent);
  });

  fs.appendFile(outputFilename, closingHTML);
}

function logTsFilesInChapters(
  directoryPath: string = "chapters/"
): { directory: string; filename: string }[] {
  const tsFiles: { directory: string; filename: string }[] = [];
  const pattern = path.join(directoryPath, "**/*.ts");
  const files = glob.sync(pattern);

  files.forEach((file) => {
    tsFiles.push({
      directory: path.dirname(file),
      filename: path.basename(file),
    });
  });

  return tsFiles;
}

console.log("Creating timeline index.qmd pages...");

const tsFiles = logTsFilesInChapters();

tsFiles.forEach(({ directory, filename }) => {
  const modulePath = path.join(process.cwd(), directory, filename);
  const module = require(modulePath);
  const dateContainers: DateContainer[] = module.dateContainers;
  const metaData: MetaData = module.metaData;
  populateTimeline(dateContainers, metaData.title, `${directory}/index.qmd`);
  console.log(`  * ${directory}`);
});

console.log("Finished creating index pages for timeline.");
