/**
 * initialises and runs the timeline functionality when the DOM content is loaded.
 *
 * @module TimelineRuntime
 */

/**
 * Initialises and reacts to timeline events
 *
 */
export class Timeline {
  /**
   * Initialises elements and starts event listeners.
   */
  constructor() {
    document.addEventListener('DOMContentLoaded', () => {
      this.collapseText();
      this.changeBubblePosition();
      window.addEventListener(
        'resize',
        this.debounce(this.changeBubblePosition.bind(this), 100)
      );
      this.changeImageVisibility();
    });
  }

  /**
   * Change of visibility of content on title press
   *
   * Initialises the collapsible text elements within the date bubbles with
   * event listeners to show and hide the content when the title is pressed.
   */
  protected collapseText(): void {
    const collapsibles: HTMLCollectionOf<HTMLElement> =
      document.getElementsByClassName(
        'collapsible'
      ) as HTMLCollectionOf<HTMLElement>;
    for (let i: number = 0; i < collapsibles.length; i++) {
      collapsibles[i].addEventListener('click', function (this: HTMLElement) {
        this.classList.toggle('active');
        const content: HTMLElement = this.nextElementSibling as HTMLElement;
        if (content && content.classList.contains('collapsible-content')) {
          content.classList.toggle('hidden');
        } else {
          console.error('No collapsible content found on button click!');
        }
      });
    }
  }

  /**
   * Left and right alignment of bubbles
   *
   * Alternates bubbles to left and right alignment if window is above 600 px
   * width. If below 600 px width, left and right alignment is removed.
   */
  protected changeBubblePosition(): void {
    const containers: NodeListOf<HTMLElement> =
      document.querySelectorAll('.bubble');
    if (window.innerWidth < 600) {
      containers.forEach((container: HTMLElement) => {
        container.classList.remove('left', 'right');
      });
    } else {
      containers.forEach((container: HTMLElement, index: number) => {
        container.classList.toggle('left', index % 2 === 0);
        container.classList.toggle('right', index % 2 !== 0);
      });
    }
  }

  /**
   * Debounces a function to prevent it from being called too frequently.
   *
   * @param {Function} func The function to debounce.
   * @param {number} wait The time to wait before calling the function in milliseconds.
   * @returns {Function} The debounced function.
   */
  protected debounce(
    func: (...args: any[]) => void,
    wait: number
  ): (...args: any[]) => void {
    let timeout: number | undefined;
    return function (this: any, ...args: any[]): void {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Show and hide images when they are in viewport.
   *
   * Initialises the observer for the images and then shows them when they enter
   * the middle third of the viewport. Also hides them when they leave the middle
   * third of the viewport.
   */
  protected changeImageVisibility(): void {
    const images: NodeListOf<HTMLImageElement> =
      document.querySelectorAll('.observed-image');

    const thirdHeight: number = window.innerHeight / 3;
    const rootMargin: string = `-${thirdHeight}px 0px -${thirdHeight}px 0px`;

    const observer: IntersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          const target: HTMLElement = entry.target as HTMLElement;
          target.classList.toggle('show', entry.isIntersecting);
        });
      },
      { rootMargin: rootMargin }
    );

    images.forEach((image: HTMLImageElement) => {
      observer.observe(image);
    });
  }
}

// Instantiate the Timeline class if running in a real browser.
// Process is only defined in Node.js environments.
if (typeof process === 'undefined') {
  new Timeline();
}
