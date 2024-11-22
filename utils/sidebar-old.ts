import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import * as glob from 'glob';
import frontMatter from 'front-matter';

// Array of files to exclude
const excludeFiles = ['404.qmd'];

// Array of files to include at the bottom
const bottomFiles = ['authors-guide.qmd', 'todo.qmd'];

// Define the types for the sidebar structure
interface SidebarItem {
  text?: string;
  href?: string;
  section?: string;
  contents?: SidebarItem[];
}

// Function to create the sidebar structure
const createSidebarStructure = (files: string[]): SidebarItem[] => {
  const structure: SidebarItem[] = [];

  files.forEach((file) => {
    const relativePath = path.relative(process.cwd(), file);
    const parts = relativePath.split(path.sep);

    // Exclude files in the excludeFiles array and bottomFiles array
    if (
      excludeFiles.includes(parts[parts.length - 1]) ||
      bottomFiles.includes(parts[parts.length - 1])
    ) {
      return;
    }

    let currentLevel: SidebarItem[] = structure;
    let parentLevel: SidebarItem[] | null = null;
    let parentIndex: number = -1;

    parts.forEach((part, index) => {
      const isFile = part.endsWith('.qmd');
      const existingItem = currentLevel.find(
        (item) => item.text === part || item.section === part
      );

      if (existingItem) {
        if (existingItem.contents) {
          parentLevel = currentLevel;
          parentIndex = currentLevel.indexOf(existingItem);
          currentLevel = existingItem.contents as SidebarItem[];
        }
      } else {
        let newItem: SidebarItem;
        if (isFile) {
          const fileContent = fs.readFileSync(file, 'utf8');
          const { attributes } = frontMatter<{ title: string }>(fileContent);
          const text = attributes.title || part;
          newItem = { text, href: relativePath };
        } else {
          newItem = { section: part, contents: [] };
        }

        currentLevel.push(newItem);

        if (!isFile) {
          parentLevel = currentLevel;
          parentIndex = currentLevel.indexOf(newItem);
          currentLevel = newItem.contents as SidebarItem[];
        }
      }
    });

    // Move index.qmd to the top of the list and set section href
    if (parentLevel && parentIndex !== -1) {
      const indexItem = currentLevel.find(
        (item) => item.href && item.href.endsWith('index.qmd')
      );
      if (indexItem) {
        currentLevel = currentLevel.filter((item) => item !== indexItem);
        (parentLevel[parentIndex] as SidebarItem).contents = [...currentLevel];
        (parentLevel[parentIndex] as SidebarItem).href = indexItem.href;
      }
    }
  });

  return structure;
};

// Find all .qmd files in the root and chapters folder
const files = glob.sync('{*.qmd,chapters/**/*.qmd}', { cwd: process.cwd() });

// Create the sidebar structure
const sidebarStructure = createSidebarStructure(files);

// Add bottom files to the sidebar structure
bottomFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { attributes } = frontMatter<{ title: string }>(fileContent);
    const text = attributes.title || path.basename(file);
    sidebarStructure.push({ text, href: file });
  }
});

// Create the sidebar.yml content
const sidebarContent = {
  website: {
    sidebar: {
      contents: sidebarStructure
    }
  }
};

// Write the sidebar.yml file
const sidebarPath = path.join(process.cwd(), 'sidebar.yml');
fs.writeFileSync(sidebarPath, yaml.stringify(sidebarContent));

console.log('sidebar.yml created successfully.');
