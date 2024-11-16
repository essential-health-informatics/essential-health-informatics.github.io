import axios from "axios";
import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";

const render_folder: string = "_site";

async function checkUrlStatus(url: string): Promise<number> {
  if (url.startsWith("file://")) {
    const filePath = url.replace("file://", "");
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return 200;
    } catch {
      return 404;
    }
  } else {
    try {
      const response = await axios.get(url);
      return response.status;
    } catch (error: any) {
      if (error.response) {
        return error.response.status;
      } else {
        console.error(`Error fetching ${url}:`, error.message);
        return 0;
      }
    }
  }
}

function findHtmlFiles(dir: string): string[] {
  const pattern = path.join(dir, "**/*.html");
  return glob.sync(pattern);
}

async function checkUrlsInSiteFolder() {
  const siteFolder = path.join(process.cwd(), render_folder);
  const htmlFiles = findHtmlFiles(siteFolder);
  let hasFailed = false;

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const urls = content.match(/href="([^"]+)"/g);

    if (urls) {
      for (const url of urls) {
        const cleanUrl = url.replace(/href="|"/g, "");
        let fullUrl = cleanUrl;

        if (cleanUrl.startsWith("http")) {
          const status = await checkUrlStatus(fullUrl);
          if (status !== 200) {
            console.error(`URL ${fullUrl} returned status ${status}`);
            hasFailed = true;
          } else {
            continue;
            // console.log(`URL ${fullUrl} is OK`);
          }
        } else if (
          cleanUrl.startsWith("#") ||
          cleanUrl.startsWith("/site_libs/")
        ) {
          continue;
        } else if (cleanUrl.startsWith("/")) {
          fullUrl = path.resolve(process.cwd(), cleanUrl);
          try {
            await fs.promises.access(render_folder, fs.constants.F_OK);
            // console.log(`\x1b[34mLocal file ${fullUrl} exists\x1b[0m`);
          } catch {
            console.log(`Found in file: ${file}`);
            console.log(`Checking local file: ${url}`);
            console.error(
              `\x1b[31mLocal file ${fullUrl} does not exist\x1b[0m\n`
            );
            hasFailed = true;
          }
        } else {
          fullUrl = path.resolve(path.dirname(file), cleanUrl);
          try {
            await fs.promises.access(fullUrl, fs.constants.F_OK);
          } catch {
            console.log(`Found in file: ${file}`);
            console.log(`Checking local file: ${url}`);
            console.error(
              `\x1b[31mLocal file ${fullUrl} does not exist\x1b[0m`
            );
            hasFailed = true;
          }
        }
      }
    }
  }
  if (hasFailed) {
    throw new Error("One or more URLs failed the check.");
  }
}

describe("URLs in site folder", () => {
  it("should return 200 for all URLs", async () => {
    await checkUrlsInSiteFolder();
  });
});
// checkUrlsInSiteFolder()
//   .then(() => {
//     console.log("Finished checking URLs.");
//   })
//   .catch((error: any) => {
//     console.error("Error checking URLs (see above)");
//   });
