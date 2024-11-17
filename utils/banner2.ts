import * as fs from 'fs';
import * as path from 'path';
import * as sizeOf from 'image-size';

const chaptersDir = path.join(__dirname, 'chapters');
const qmdFiles = fs.readdirSync(chaptersDir).filter(file => file.endsWith('.qmd'));

qmdFiles.forEach(file => {
    const filePath = path.join(chaptersDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Assuming the image is in the first few lines under the title
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const imageMatch = line.match(/!\[.*\]\((.*)\)/);
        if (imageMatch) {
            const imagePath = path.join(chaptersDir, imageMatch[1]);
            const dimensions = sizeOf(imagePath);
            const aspectRatio = dimensions.width / dimensions.height;
            if (aspectRatio !== 3) {
                console.log(`Image in file ${file} does not have a 3:1 aspect ratio: ${imagePath}`);
            }else{
                console.log(`Image in file ${file} has a 3:1 aspect ratio: ${imagePath}`);
            break;
        }
    }
});