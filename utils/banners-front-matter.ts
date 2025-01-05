/**
 * Crop images in HTML files.
 *
 * Finds images with a 'crop' attribute and crops the images to the specified ratio and location.
 *
 * Exports:
 * - Classes: Crop
 *
 * @module Crops
 */

import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
// import { JSDOM } from 'jsdom';
import matter from 'gray-matter';

export class Crop {
  directoryPath: string = path.join(process.cwd(), '..', 'chapters');
  searchPattern: string = `${this.directoryPath}/**/*.qmd`;

  constructor() {}

  /**
   * Find and crop images in HTML files
   */
  cropRun() {
    const files = glob.sync(this.searchPattern);

    if (files.length === 0) {
      console.log('No files found');
      return;
    }
    console.log('Cropping images for banners...');

    files.forEach((file) => {
      this.cropAnalyse(file);
    });

    console.log('Finished cropping images');
  }

  /**
   * Analyse the HTML file and crop images.
   *
   * @param filePath - The file path of the HTML file.
   * @throws Error - The file path does not exist.
   * @throws Error - No content found in file.
   * @throws Error - Failed to create DOM from content.
   */
  protected cropAnalyse(filePath: string): void {
    if (!fs.existsSync(filePath)) {
      throw new Error(`The file path ${filePath} does not exist`);
    }

    const content: string = fs.readFileSync(filePath, 'utf-8');
    if (!content) {
      throw new Error(`No content found in file: ${filePath}`);
    }

    const { data: attributes } = matter(content);

    console.log(attributes);

    // const dom = new JSDOM(content);
    // const document: Document = dom.window.document;
    // // Note: Quarto renames 'crop' attributes to 'data-crop'
    // const images: NodeListOf<HTMLImageElement> =
    //   document.querySelectorAll('img[data-crop]');

    // images.forEach((img: HTMLImageElement) => {
    //   let dataCrop: string | null = img.getAttribute('data-crop');

    //   if (dataCrop) {
    //     dataCrop = dataCrop.trim();
    //     const dataCropValues: string[] = dataCrop.split(/\s+/);

    //     if (dataCropValues[0] === '3:1') {
    //       const positionStr: number | string = dataCropValues[1].replace(
    //         '%',
    //         ''
    //       );

    //       if (!isNaN(Number(positionStr))) {
    //         this.crop3to1(filePath, img, Number(positionStr));
    //         fs.writeFileSync(filePath, dom.serialize());
    //         console.log(`  * ${filePath.replace(this.directoryPath, '')}`);
    //       } else {
    //         throw new TypeError(
    //           `${filePath}: The position value of ${positionStr} is not a number`
    //         );
    //       }
    //     } else {
    //       throw new RangeError(
    //         `${filePath}: Unsupported crop method: ${dataCrop}`
    //       );
    //     }
    //   }
    // });
  }

  /**
   * Crops to a 3:1 ratio and positions the image.
   *
   * @param filePath - The file path of the HTML file.
   * @param img - The image path.
   * @param position - The vertical position of the crop (0-100%). 0% is the top of the image, 100% is the bottom.
   * @throws Error - The file path does not exist
   * @throws TypeError - The supplied image is null.
   * @throws TypeError - The position value is not a number.
   * @throws RangeError - The position value is outside the range 0-100.
   * @throws RangeError - The image has no 'src' or 'alt' attribute(s).
   */
  protected crop3to1(
    filePath: string,
    img: HTMLImageElement,
    position: number
  ): void {
    if (!fs.existsSync(filePath)) {
      throw new Error(`The file path ${filePath} does not exist`);
    }

    if (img.getAttribute('src') === null || img.getAttribute('alt') === null) {
      throw new TypeError('The image has no src or alt attribute(s)');
    }

    if (typeof position !== 'number') {
      throw new TypeError(`The position value of ${position} is not a number`);
    }

    if (position < 0 || position > 100) {
      throw new RangeError(
        `The position value of ${position} is outside the range 0-100`
      );
    }

    const src: string = String(img.getAttribute('src'));
    const alt: string = String(img.getAttribute('alt'));
    const cropDiv = img.ownerDocument.createElement('div');
    cropDiv.className = 'crop-3-1';
    const newImg: HTMLImageElement = img.ownerDocument.createElement('img');
    newImg.setAttribute('src', src);
    newImg.setAttribute('alt', alt);
    newImg.setAttribute('style', `object-position: 50% ${position}%;`);

    cropDiv.appendChild(newImg);

    if (img.parentNode !== null) {
      img.parentNode.replaceChild(cropDiv, img);
    } else {
      throw new ReferenceError(
        `There was no parent node for image '${src}' in file '${filePath}'`
      );
    }
  }
}

if (require.main === module) {
  const cropRun = new Crop();
  cropRun.cropRun();
}
