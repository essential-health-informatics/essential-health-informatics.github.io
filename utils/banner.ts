/**
 * Crop images in HTML files
 *
 * This script will crop images in HTML files based on the data-crop attribute
 *
 * Classes:
 * - Crop: Crop images in HTML files
 */

import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";
import { JSDOM } from "jsdom";

export class Crop {
  directoryPath = path.join(process.cwd(), "_site");
  searchPattern = `${this.directoryPath}/**/*.html`;

  constructor() {}

  /**
   * Crops to a 3:1 ratio and positions the image
   *
   * @param {string} filePath - The file path of the HTML file
   */
  crop3to1(filePath: string, img: HTMLImageElement, position: number) {
    if (!fs.existsSync(filePath)) {
      console.error(`The file path ${filePath} does not exist`);
      return;
    }

    if (!img) {
      console.error("The supplied image is null");
      return;
    }

    if (img.getAttribute("src") === null || img.getAttribute("alt") === null) {
      console.error(`The image has no src or alt attribute`);
      return;
    }

    if (typeof position !== "number") {
      console.error(`The position value of ${position} is not a number`);
      return;
    }

    if (position < 0 || position > 100) {
      console.error(
        `The position value of ${position} is outside the range 0-100`
      );
      return;
    }

    if (img.getAttribute("src") === null || img.getAttribute("alt") === null) {
      console.error("The image has no 'src' or 'alt' attribute(s)");
      return;
    }

    const src: string = String(img.getAttribute("src"));
    const alt: string = String(img.getAttribute("alt"));
    const cropDiv = img.ownerDocument.createElement("div");
    cropDiv.className = "crop-3-1";
    const newImg = img.ownerDocument.createElement("img");
    newImg.setAttribute("src", src);
    newImg.setAttribute("alt", alt);
    newImg.setAttribute("style", `object-position: 50% ${position}%;`);

    cropDiv.appendChild(newImg);

    if (img.parentNode) {
      img.parentNode.replaceChild(cropDiv, img);
    } else {
      console.error(
        `The parent node of the image is null for file: ${filePath}`
      );
    }
  }

  /**
   * Analyse the HTML file and crop images
   *
   * @param {string} filePath - The file path of the HTML file
   */
  cropAnalyse(filePath: string) {
    const content: string = fs.readFileSync(filePath, "utf-8");
    const dom: JSDOM = new JSDOM(content);
    const document: Document = dom.window.document;
    // Quarto renames 'crop' attributes to 'data-crop'
    const images: NodeListOf<HTMLImageElement> =
      document.querySelectorAll("img[data-crop]");

    images.forEach((img: HTMLImageElement) => {
      const src = img.getAttribute("src");
      let dataCrop = img.getAttribute("data-crop");
      // console.log(`Found image with data-crop attribute: ${src}`);

      if (dataCrop) {
        dataCrop = dataCrop.trim();
        const dataCropValues = dataCrop.split(/\s+/);
        // console.log(`data-crop values: ${dataCropValues.join(", ")}`);

        if (dataCropValues[0] === "3:1") {
          const positionStr: number = Number(
            dataCropValues[1].replace("%", "")
          );
          if (!isNaN(positionStr)) {
            this.crop3to1(filePath, img, positionStr);
            fs.writeFileSync(filePath, dom.serialize());
            console.log(`\t* ${filePath}`);
          }
        }
      }
    });
    return;
  }

  /**
   * Find and crop images in HTML files
   */
  cropRun() {
    let testResult: boolean = true;
    const files = glob.sync(this.searchPattern);

    console.log("Cropping images for banners...");

    files.forEach((file) => {
      this.cropAnalyse(file);
    });

    console.log("Finished cropping images");
  }
}

if (require.main === module) {
  const cropRun = new Crop();
  cropRun.cropRun();
}
