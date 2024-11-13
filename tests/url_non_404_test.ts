import { walk } from "https://deno.land/std/fs/mod.ts";
import { assert } from "https://deno.land/std/testing/asserts.ts";

// Function to extract URLs from a file
async function extractUrls(filePath: string): Promise<string[]> {
  const fileContent = await Deno.readTextFile(filePath);
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = fileContent.match(urlRegex) || [];
  return urls;
}

// Function to check if a URL returns a non-404 status
async function checkUrl(url: string): Promise<void> {
  try {
    const response = await fetch(url);
    assert(response.status !== 404, `URL returned 404: ${url}`);
    assert(
      response.ok,
      `URL returned error status: ${url} - ${response.status}`
    );
  } catch (error) {
    console.error(`Failed to fetch URL: ${url}`, error);
  }
}

// Main function to run the test
async function runTest() {
  const chaptersDir = "./chapters";
  const urls: string[] = [];

  // Recursively read all files in the chapters directory
  for await (const entry of walk(chaptersDir, {
    includeFiles: true,
    exts: [".md", ".html", ".txt"],
  })) {
    if (entry.isFile) {
      const fileUrls = await extractUrls(entry.path);
      urls.push(...fileUrls);
    }
  }

  // Check each URL
  for (const url of urls) {
    await checkUrl(url);
  }

  console.log("All URLs checked.");
}

// Run the test
runTest();
