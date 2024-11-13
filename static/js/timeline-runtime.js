/**
 * Initializes and runs the timeline functionality when the DOM content is loaded.
 */ export function runTimeline() {
  document.addEventListener("DOMContentLoaded", function() {
    initializeCollapsibles();
    adjustContainerClasses();
    window.addEventListener("resize", adjustContainerClasses);
    initializeImageObserver();
    initializeObserver();
  });
}
export function initializeObserver() {
  const elements = document.querySelectorAll(".observed-image");
  // Define the options for the Intersection Observer
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5
  };
  // Create a new Intersection Observer
  const observer = new IntersectionObserver((entries, observer)=>{
    entries.forEach((entry)=>{
      const target = entry.target;
      // If element is in viewport, add the 'show' class to trigger the animation
      if (entry.isIntersecting) {
        target.classList.add("show");
        console.log("show");
      } else {
        target.classList.remove("show");
        console.log("hide");
      }
    });
  }, options);
  // Start observing each element
  elements.forEach((element)=>{
    observer.observe(element);
  });
}
export function initializeImageObserver() {
  const images = document.querySelectorAll(".observed-image.hidden");
  const viewportHeight = window.innerHeight;
  const thirdHeight = viewportHeight / 3;
  const rootMargin = `-${thirdHeight}px 0px -${thirdHeight}px 0px`;
  const observer = new IntersectionObserver((entries)=>{
    console.log("start");
    entries.forEach((entry)=>{
      const target = entry.target;
      if (entry.isIntersecting) {
        target.classList.remove("hidden");
        console.log("showing");
      } else {
        target.classList.add("hidden");
        console.log("hiding");
      }
    });
  }, {
    rootMargin: rootMargin,
    threshold: 0
  });
  images.forEach((image)=>{
    observer.observe(image);
  });
}
export function initializeCollapsibles() {
  const coll = document.getElementsByClassName("collapsible");
  for(let i = 0; i < coll.length; i++){
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
}
export function adjustContainerClasses() {
  var containers = document.querySelectorAll(".bubble");
  if (window.innerWidth < 600) {
    containers.forEach((container)=>{
      container.classList.remove("left", "right");
    });
  } else {
    containers.forEach((container, index)=>{
      if (index % 2 === 0) {
        container.classList.add("left");
      } else {
        container.classList.add("right");
      }
    });
  }
}
runTimeline();
