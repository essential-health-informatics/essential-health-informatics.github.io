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
      this.initialiseCollapsibles();
      this.adjustContainerClasses();
      window.addEventListener(
        'resize',
        this.debounce(this.adjustContainerClasses.bind(this), 100)
      );
      this.initialiseImageObserver();
      this.initialiseObserver();
    });
  }

  /**
   * Initialises the observer for the timeline elements.
   */
  protected initialiseObserver(): void {
    const elements: NodeListOf<HTMLImageElement> =
      document.querySelectorAll('.observed-image');

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer: IntersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          const target: HTMLElement = entry.target as HTMLElement;
          target.classList.toggle('show', entry.isIntersecting);
        });
      },
      options
    );

    elements.forEach((element: HTMLImageElement) => {
      observer.observe(element);
    });
  }

  /**
   * Initialises the image observers for the timeline elements.
   */
  protected initialiseImageObserver(): void {
    const images: NodeListOf<HTMLImageElement> = document.querySelectorAll(
      '.observed-image.hidden'
    );

    const viewportHeight: number = window.innerHeight;
    const thirdHeight: number = viewportHeight / 3;
    const rootMargin: string = `-${thirdHeight}px 0px -${thirdHeight}px 0px`;

    const observer: IntersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          const target: HTMLElement = entry.target as HTMLElement;
          target.classList.toggle('hidden', !entry.isIntersecting);
        });
      },
      { rootMargin: rootMargin, threshold: 0 }
    );

    images.forEach((image: HTMLImageElement) => {
      observer.observe(image);
    });
  }

  /**
   * Initialises the collapsible elements within the date bubbles.
   */
  protected initialiseCollapsibles(): void {
    const coll: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName(
      'collapsible'
    ) as HTMLCollectionOf<HTMLElement>;
    for (let i: number = 0; i < coll.length; i++) {
      coll[i].addEventListener('click', function (this: HTMLElement) {
        this.classList.toggle('active');
        const content: HTMLElement = this.nextElementSibling as HTMLElement;
        content.classList.toggle('visible');
        content.classList.toggle('hidden');
      });
    }
  }

  /**
   * Adjusts the container classes based on the window width.
   */
  protected adjustContainerClasses(): void {
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
   * @param {number} wait The time to wait before calling the function.
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
}

// Instantiate the Timeline class to run the functionality
new Timeline();
