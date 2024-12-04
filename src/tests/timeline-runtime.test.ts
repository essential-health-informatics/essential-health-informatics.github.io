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

    const button = document.querySelector('.collapsible') as HTMLButtonElement;
    button.click();
    const content = document.querySelector(
      '.collapsible-content'
    ) as HTMLElement;
    expect(content.classList.contains('hidden')).toBe(false);
    button.click();
    expect(content.classList.contains('hidden')).toBe(true);
  });
});
