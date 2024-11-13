import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { adjustContainerClasses } from "../src/timeline-runtime.ts";

Deno.test(
  "adjustContainerClasses should adjust classes based on window width",
  () => {
    // Create a mock DOM
    const document = new DOMParser().parseFromString(
      `<!DOCTYPE html>
    <html>
      <body>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
      </body>
    </html>`,
      "text/html"
    );

    (globalThis as any).document = document;
    (globalThis as any).window = { innerWidth: 500 };

    // Call the function with window width less than 600
    adjustContainerClasses();

    let containers = document.querySelectorAll(".bubble");
    containers.forEach((container) => {
      assertEquals(container.classList.contains("left"), false);
      assertEquals(container.classList.contains("right"), false);
    });

    // Change window width to greater than or equal to 600
    (globalThis as any).window.innerWidth = 800;

    // Call the function again
    adjustContainerClasses();

    containers = document.querySelectorAll(".bubble");
    containers.forEach((container, index) => {
      if (index % 2 === 0) {
        assertEquals(container.classList.contains("left"), true);
        assertEquals(container.classList.contains("right"), false);
      } else {
        assertEquals(container.classList.contains("left"), false);
        assertEquals(container.classList.contains("right"), true);
      }
    });
  }
);
