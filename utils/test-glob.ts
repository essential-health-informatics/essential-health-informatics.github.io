import * as glob from "glob";
import * as path from "path";

export function findTsFiles(
  directoryPath: string
): { directory: string; filename: string }[] {
  const tsFiles: { directory: string; filename: string }[] = [];
  const pattern = path.join(directoryPath, "**/*.ts");
  // console.log("Pattern is:", pattern);
  const files = glob.sync(pattern);
  //   const files = ["src/file1.ts", "src/subdir/file2.ts"];

  console.log("Files found are:", files);

  files.forEach((file: string) => {
    tsFiles.push({
      directory: path.dirname(file),
      filename: path.basename(file),
    });
  });

  return tsFiles;
}

if (require.main === module) {
  console.log(findTsFiles("src"));
}
