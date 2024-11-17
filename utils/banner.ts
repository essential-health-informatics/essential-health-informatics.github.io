import * as fs from "fs";
import * as path from "path";
import { JSDOM } from "jsdom";
import sharp from "sharp";
import * as deasync from "deasync";

const directoryPath = path.join(process.cwd(), "_site");

export function check3to1(imgSrc: string) {
  const imageBuffer = fs.readFileSync(imgSrc);
  const image = sharp(imageBuffer);
  let metadata: sharp.Metadata = { width: 0, height: 0 };
  let done = false;

  image
    .metadata()
    .then((data) => {
      metadata = data;
      done = true;
    })
    .catch((error) => {
      console.error("Error getting image metadata:", error);
      done = true;
    });

  deasync.loopWhile(() => !done);

  if (!metadata.width || !metadata.height) {
    throw new Error("Could not get image metadata");
  }

  const targetHeight: number = metadata.width / 3;
  const heightReduction = metadata.height - targetHeight;
  const heightReductionPercentage = (heightReduction / metadata.height) * 100;
  let cropHeightStart: string = "0";
  let cropHeightEnd: string = heightReductionPercentage.toFixed(2);

  const heightReductionStr = heightReduction.toFixed(2);
  const heightReductionPercentageStr = heightReductionPercentage.toFixed(2);

  const ratio = metadata.width / metadata.height;

  console.log(`Ratio is: ${ratio.toFixed(2)}:1`);
  // console.log(`Width: ${metadata.width}px, Height: ${metadata.height}px`);
  // console.log(`3:1 ratio height is ${targetHeight.toFixed(2)}px`);
  // console.log(`Height needs to be reduced by ${heightReductionStr}px`);
  // console.log(`Height reduction percentage: ${heightReductionPercentageStr}%`);
}

export function crop3to1(srcValue: string, cropValues: string[]): string {
  let styleText: string = "";
  const imageBuffer = fs.readFileSync(srcValue);
  const image = sharp(imageBuffer);
  let metadata: sharp.Metadata = { width: 0, height: 0 };
  let done = false;

  image
    .metadata()
    .then((data) => {
      metadata = data;
      done = true;
    })
    .catch((error) => {
      console.error("Error getting image metadata:", error);
      done = true;
    });

  deasync.loopWhile(() => !done);

  if (!metadata.width || !metadata.height) {
    throw new Error("Could not get image metadata");
  }

  const targetHeight: number = metadata.width / 3;
  const heightReduction = metadata.height - targetHeight;
  const heightReductionPercentage = (heightReduction / metadata.height) * 100;
  let cropHeightStart: string = "0";
  let cropHeightEnd: string = heightReductionPercentage.toFixed(2);

  if (cropValues[1] && !isNaN(Number(cropValues[1]))) {
    cropHeightStart = Number(cropValues[1]).toFixed(2);
    cropHeightEnd = (heightReductionPercentage - Number(cropValues[1])).toFixed(
      2
    );
  }

  const heightReductionStr = heightReduction.toFixed(2);
  const heightReductionPercentageStr = heightReductionPercentage.toFixed(2);

  console.log(`Width: ${metadata.width}px, Height: ${metadata.height}px`);
  console.log(`3:1 ratio height is ${targetHeight.toFixed(2)}px`);
  console.log(`Height needs to be reduced by ${heightReductionStr}px`);
  console.log(`Height reduction percentage: ${heightReductionPercentageStr}%`);

  styleText = `width: calc(100% + 0%); height: calc(100% + ${heightReductionPercentageStr}%); clip-path: inset(${cropHeightStart}% 0% ${cropHeightEnd}% 0%); margin: 0px 0px -${heightReductionStr}px 0px;`;

  console.log(`Top crop ${cropHeightStart}% to bottom crop ${cropHeightEnd}%`);
  console.log(`Style:\n${styleText}`);

  return styleText;
}

function findAndReplaceImgTags(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  const dom = new JSDOM(content);
  const document = dom.window.document;
  const imgTags = document.querySelectorAll("img[crop]");

  imgTags.forEach((img) => {
    console.log(img.getAttribute("src"));
    if (img.getAttribute("src") !== null) {
      check3to1(String(img.getAttribute("src")));
    }
  });

  const updatedContent = dom.serialize();
  fs.writeFileSync(filePath, updatedContent, "utf-8");
}

function walkDirectory(directory: string) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    files.forEach((file) => {
      const filePath = path.join(directory, file);
      if (fs.statSync(filePath).isDirectory()) {
        walkDirectory(filePath);
      } else if (path.extname(file) === ".html") {
        // console.log(`Processing: ${filePath}`);
        findAndReplaceImgTags(filePath);
      }
    });
  });
}

if (require.main === module) {
  console.log(`Directory: ${directoryPath}`);
  walkDirectory(directoryPath);
}
