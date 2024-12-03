"use strict";
/**
 * initialises and runs the timeline functionality when the DOM content is loaded.
 *
 * @module Timeline
 */
/**
 * Initialises and reacts to timeline events
 *
 */
class Timeline {
    /**
     * Initialises elements and starts event listeners.
     */
    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initialiseCollapsibles();
            this.adjustContainerClasses();
            window.addEventListener('resize', this.debounce(this.adjustContainerClasses.bind(this), 100));
            this.initialiseImageObserver();
            this.initialiseObserver();
        });
    }
    initialiseObserver() {
        const elements = document.querySelectorAll('.observed-image');
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const target = entry.target;
                target.classList.toggle('show', entry.isIntersecting);
            });
        }, options);
        elements.forEach((element) => {
            observer.observe(element);
        });
    }
    initialiseImageObserver() {
        const images = document.querySelectorAll('.observed-image.hidden');
        const viewportHeight = window.innerHeight;
        const thirdHeight = viewportHeight / 3;
        const rootMargin = `-${thirdHeight}px 0px -${thirdHeight}px 0px`;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const target = entry.target;
                target.classList.toggle('hidden', !entry.isIntersecting);
            });
        }, { rootMargin: rootMargin, threshold: 0 });
        images.forEach((image) => {
            observer.observe(image);
        });
    }
    initialiseCollapsibles() {
        const coll = document.getElementsByClassName('collapsible');
        for (let i = 0; i < coll.length; i++) {
            coll[i].addEventListener('click', function () {
                this.classList.toggle('active');
                const content = this.nextElementSibling;
                content.classList.toggle('visible');
                content.classList.toggle('hidden');
            });
        }
    }
    adjustContainerClasses() {
        const containers = document.querySelectorAll('.bubble');
        if (window.innerWidth < 600) {
            containers.forEach((container) => {
                container.classList.remove('left', 'right');
            });
        }
        else {
            containers.forEach((container, index) => {
                container.classList.toggle('left', index % 2 === 0);
                container.classList.toggle('right', index % 2 !== 0);
            });
        }
    }
    debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = window.setTimeout(() => func.apply(this, args), wait);
        };
    }
}
// Instantiate the Timeline class to run the functionality
new Timeline();
