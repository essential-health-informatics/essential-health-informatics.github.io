import { Timeline } from '../timeline-runtime';
import * as d from './timeline-runtime.data';

class TimelineTestable extends Timeline {
  collapseText(): void {
    return super.collapseText();
  }

  changeBubblePosition(): void {
    return super.changeBubblePosition();
  }

  debounce(
    func: (...args: any[]) => void,
    wait: number
  ): (...args: any[]) => void {
    return super.debounce(func, wait);
  }

  changeImageVisibility(): void {
    return super.changeImageVisibility();
  }
}

describe('Constructor', () => {
  beforeAll(() => {
    global.IntersectionObserver = jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    })) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('DOMContentLoaded', () => {
    document.body.innerHTML = d.dateContainerSingle;
    const timeline = new TimelineTestable();
    const collapseTextSpy = jest
      .spyOn(timeline as any, 'collapseText')
      .mockImplementation(() => {});
    const changeBubblePositionSpy = jest
      .spyOn(timeline as any, 'changeBubblePosition')
      .mockImplementation(() => {});
    const debounceSpy = jest
      .spyOn(timeline as any, 'debounce')
      .mockImplementation((func) => func);
    const changeImageVisibilitySpy = jest
      .spyOn(timeline as any, 'changeImageVisibility')
      .mockImplementation(() => {});

    document.dispatchEvent(new Event('DOMContentLoaded'));
    window.dispatchEvent(new Event('resize'));

    expect(collapseTextSpy).toHaveBeenCalledTimes(1);
    expect(changeBubblePositionSpy).toHaveBeenCalledTimes(2);
    expect(debounceSpy).toHaveBeenCalledTimes(1);
    expect(changeImageVisibilitySpy).toHaveBeenCalledTimes(1);
    expect(changeImageVisibilitySpy).toHaveBeenCalledTimes(1);
  });
});

describe('Collapsible text', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('show and then hide contents', () => {
    document.body.innerHTML = d.dateContainerSingle;
    new TimelineTestable().collapseText();

    const collapsibleContent = document.querySelector(
      '.collapsible-content'
    ) as HTMLDivElement;
    expect(collapsibleContent.classList.contains('hidden')).toBe(true);

    const button = document.querySelector('.collapsible') as HTMLButtonElement;
    button.click();

    expect(collapsibleContent.classList.contains('hidden')).toBe(false);

    button.click();

    expect(collapsibleContent.classList.contains('hidden')).toBe(true);
  });

  test('handles unexpected state gracefully', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    document.body.innerHTML = d.dateContainerWrongOrder;
    new TimelineTestable().collapseText();

    const button = document.querySelector('.collapsible') as HTMLButtonElement;

    button.click();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'No collapsible content found on button click!'
    );
  });
});

describe('Bubble siding', () => {
  let timeline: TimelineTestable;

  beforeEach(() => {
    timeline = new TimelineTestable();
    document.body.innerHTML = d.threeBubbles;
  });

  it('should remove left and right classes when window width is less than 600', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500
    });
    timeline.changeBubblePosition();

    document.querySelectorAll('.bubble').forEach((container) => {
      expect(container.classList.contains('left')).toBe(false);
      expect(container.classList.contains('right')).toBe(false);
    });
  });

  it('should toggle left and right classes when window width is 600 or more', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600
    });
    timeline.changeBubblePosition();

    const containers = document.querySelectorAll('.bubble');
    containers.forEach((container, index) => {
      if (index % 2 === 0) {
        expect(container.classList.contains('left')).toBe(true);
        expect(container.classList.contains('right')).toBe(false);
      } else {
        expect(container.classList.contains('left')).toBe(false);
        expect(container.classList.contains('right')).toBe(true);
      }
    });
  });
});

describe('debounce', () => {
  let timeline: TimelineTestable;
  let mockFunction: jest.Mock;

  beforeEach(() => {
    timeline = new TimelineTestable();
    mockFunction = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should debounce the function call', () => {
    const debouncedFunction = timeline.debounce(mockFunction, 200);

    debouncedFunction();
    debouncedFunction();
    debouncedFunction();

    expect(mockFunction).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(200);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('should call the function with the correct arguments', () => {
    const debouncedFunction = timeline.debounce(mockFunction, 200);

    debouncedFunction('arg1', 'arg2');

    jest.advanceTimersByTime(200);

    expect(mockFunction).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should reset the timer if called again within the wait period', () => {
    const debouncedFunction = timeline.debounce(mockFunction, 200);

    debouncedFunction();
    jest.advanceTimersByTime(100);
    debouncedFunction();
    jest.advanceTimersByTime(100);
    debouncedFunction();

    jest.advanceTimersByTime(200);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
});

describe('changeImageVisibility', () => {
  let timeline: TimelineTestable;

  beforeEach(() => {
    timeline = new TimelineTestable();
    document.body.innerHTML = d.dateContainerThree;

    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should toggle the "show" class based on intersection', () => {
    const images = document.querySelectorAll('.observed-image');
    const imagesNumber = 3;
    expect(images.length).toBe(imagesNumber);

    timeline.changeImageVisibility();

    for (let i = 0; i < imagesNumber; i++) {
      const observerCallback = (window.IntersectionObserver as jest.Mock).mock
        .calls[0][0];

      observerCallback([{ target: images[i], isIntersecting: true }]);
      expect(images[i].classList.contains('show')).toBe(true);

      observerCallback([{ target: images[i], isIntersecting: false }]);
      expect(images[i].classList.contains('show')).toBe(false);
    }
  });
});
