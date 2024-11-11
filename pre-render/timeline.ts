const filename = "chapters/timeline/uk/test.qmd";

await Deno.writeTextFile(filename, "Hello World");

console.log(`File ${filename} created successfully.`);
