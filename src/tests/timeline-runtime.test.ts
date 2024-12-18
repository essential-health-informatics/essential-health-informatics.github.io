/* eslint-disable @typescript-eslint/no-unused-vars */
class IntersectionObserver {
  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {}

  observe(target: Element) {}
  unobserve(target: Element) {}
  disconnect() {}
  // Add missing properties to match the expected interface
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

global.IntersectionObserver = IntersectionObserver;

import { Timeline } from '../timeline-runtime';
import * as d from './timeline-runtime.data';

describe('Timeline', () => {
  beforeAll(() => {
    document.body.innerHTML = d.dateContainer;
  });

  it('clicking on the title should toggle the content', () => {
    new Timeline();

    // Simulate the DOMContentLoaded event
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const content = document.querySelector(
      '.collapsible-content'
    ) as HTMLElement;
    expect(content.classList.contains('hidden')).toBe(true);
    const button = document.querySelector('.collapsible') as HTMLButtonElement;
    button.click();
    expect(content.classList.contains('hidden')).toBe(false);
  });
});
