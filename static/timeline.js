document.addEventListener("DOMContentLoaded", function () {
  var coll = document.getElementsByClassName("collapsible");
  for (var i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }

  var containers = document.querySelectorAll(".bubble");

  containers.forEach((container, index) => {
    if (index % 2 === 0) {
      container.classList.add("left");
    } else {
      container.classList.add("right");
    }
  });

  function adjustContainerClasses() {
    if (window.innerWidth < 600) {
      containers.forEach((container) => {
        container.classList.remove("left", "right");
      });
    } else {
      containers.forEach((container, index) => {
        if (index % 2 === 0) {
          container.classList.add("left");
        } else {
          container.classList.add("right");
        }
      });
    }
  }

  window.addEventListener("resize", adjustContainerClasses);
  adjustContainerClasses(); // Initial check
});

document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll(".observed-image.hidden");

  const viewportHeight = window.innerHeight;
  const thirdHeight = viewportHeight / 3;
  const rootMargin = `-${thirdHeight}px 0px -${thirdHeight}px 0px`;

  const observer = new IntersectionObserver(
    (entries) => {
      console.log("start");
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("hidden");
          console.log("showing");
        } else {
          entry.target.classList.add("hidden");
          console.log("hiding");
        }
      });
    },
    { rootMargin: rootMargin, threshold: 0 }
  );

  images.forEach((image) => {
    observer.observe(image);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(".observed-image");

  // Define the options for the Intersection Observer
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  // Create a new Intersection Observer
  const observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach((entry) => {
      // If element is in viewport, add the 'show' class to trigger the animation
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        console.log("show");
      } else {
        entry.target.classList.remove("show");
        console.log("hide");
      }
    });
  }, options);

  // Start observing each element
  elements.forEach((element) => {
    observer.observe(element);
  });
});

import { dateContainers } from "/static/timeline_data.js";

const timeline = document.getElementById("timeline");

dateContainers.forEach((container) => {
  const dateContainerDiv = document.createElement("div");
  dateContainerDiv.className = "date-container";

  dateContainerDiv.innerHTML = `
    <div class="bubble">
      <p class="container-header">${container.year}</p>
      <img class="observed-image" src="${container.image_src}" alt="${container.alt_text}" style="width: 100%;">
      <button class="collapsible">${container.header}</button>
      <div class="collapsible-content">
        <p>${container.content}</p>
      </div>
    </div>
  `;

  timeline.appendChild(dateContainerDiv);
});
