import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.48/deno-dom-wasm.ts";

if (typeof Deno !== "undefined") {
  // Create a new document
  const document = new DOMParser().parseFromString(
    "<!DOCTYPE html><html><body></body></html>",
    "text/html"
  );

  (globalThis as any).document = document;
}
