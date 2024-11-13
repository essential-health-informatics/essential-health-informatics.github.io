import { transpile } from "https://deno.land/x/emit/mod.ts";
import { dirname, fromFileUrl } from "https://deno.land/std/path/mod.ts";

const currentDir = dirname(fromFileUrl(import.meta.url));
const tempFilePath = `${currentDir}/temp_dom_combined.ts`;
const inputDir = "./src";
const outputDir = "./static/js";

// Create the output directory if it does not exist
await Deno.mkdir(outputDir, { recursive: true });

async function checkType(filename: string): Promise<void> {
  const domProxyContent = await Deno.readTextFile(`${currentDir}/dom-proxy.ts`);
  const fileContent = await Deno.readTextFile(filename);
  const combinedContent = `${domProxyContent}\n${fileContent}`;
  await Deno.writeTextFile(tempFilePath, combinedContent);

  // TypeScript type check
  const typeCheckProcess = new Deno.Command("deno", {
    args: ["-A", "--check", tempFilePath],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stdout, stderr } = await typeCheckProcess.output();
  const output = new TextDecoder().decode(stdout);
  const error = new TextDecoder().decode(stderr);

  await Deno.remove(tempFilePath);

  if (code === 0) {
    console.log("TypeScript type check passed.");
    console.log(output);
  } else {
    console.error("TypeScript type check failed:");
    console.error(error);
    Deno.exit(code);
  }
}

for await (const dirEntry of Deno.readDir(inputDir)) {
  if (dirEntry.isFile && dirEntry.name.endsWith(".ts")) {
    console.log(`Found TypeScript file: ${dirEntry.name}`);

    await checkType(`${inputDir}/${dirEntry.name}`);

    const url = new URL(`../src/${dirEntry.name}`, import.meta.url);
    const result = await transpile(url);

    const code = result.get(url.href);

    if (code) {
      const outputPath = `${outputDir}/${dirEntry.name.replace(".ts", ".js")}`;
      await Deno.writeTextFile(outputPath, code);
      console.log(`Transpiled code written to ${outputPath}`);
    } else {
      console.error(
        `Transpilation failed or code is undefined for ${dirEntry.name}`
      );
    }
  }
}
