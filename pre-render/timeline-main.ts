export interface MetaData {
  title: string;
}

export interface DateContainer {
  year: string;
  image_src: string;
  alt_text: string;
  header: string;
  content: string;
}

export function populateTimeline(
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

  Deno.writeTextFile(outputFilename, openingHTML);

  dateContainers.forEach((container) => {
    const positionClass = isLeft ? "left" : "right";
    isLeft = !isLeft; // Toggle the flag

    timelineEvent = `
    <div class="date-container">
      <div class="bubble ${positionClass}">
        <p class="container-header">${container.year}</p>
        <img class="observed-image" src="${container.image_src}" alt="${container.alt_text}" style="width: 100%;">
        <button class="collapsible">${container.header}</button>
        <div class="collapsible-content">
          <p>${container.content}</p>
        </div>
      </div>
    </div>
    `;

    Deno.writeTextFile(outputFilename, timelineEvent, { append: true });
  });

  Deno.writeTextFile(outputFilename, closingHTML, { append: true });
  console.log(`File ${outputFilename} created successfully.`);
}

// Function to find and log .ts files in the ../chapters directory and its subfolders
export async function logTsFilesInChapters(
  directoryPath: string = "chapters/"
): Promise<{ directory: string; filename: string }[]> {
  const tsFiles: { directory: string; filename: string }[] = [];

  async function findTsFiles(path: string): Promise<void> {
    for await (const dirEntry of Deno.readDir(path)) {
      const fullPath = `${path}${dirEntry.name}`;
      if (dirEntry.isFile && dirEntry.name.endsWith(".ts")) {
        if (dirEntry.name.includes("timeline")) {
          tsFiles.push({ directory: path, filename: dirEntry.name });
        }
      } else if (dirEntry.isDirectory) {
        // Recursively search in subdirectories
        await findTsFiles(`${fullPath}/`);
      }
    }
  }

  await findTsFiles(directoryPath);
  return tsFiles;
}

logTsFilesInChapters()
  .then(async (tsFiles) => {
    for (const { directory, filename } of tsFiles) {
      console.log(`Directory: ${directory}`);
      console.log(`Filename: ${filename}`);

      const modulePath = `../${directory}${filename}`;
      const module = await import(modulePath);
      const dateContainers: DateContainer[] = module.dateContainers;
      const metaData: MetaData = module.metaData;

      populateTimeline(
        dateContainers,
        metaData.title,
        `${directory}/index.qmd`
      );
    }
  })
  .then(() => console.log("Finished logging TypeScript files in chapters"))
  .catch((error) =>
    console.error("Error logging TypeScript files in chapters:", error)
  );
