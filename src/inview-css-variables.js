export default class InViewCssVariables {

  constructor(options) {
    // extend default options
    this.options = {
      baseClass: 'm-inview-css',
      positionTrackClass: 'm-inview-css--track-scroll-position',
      aboveViewportVariable: '--percentage-above-viewport',
      belowViewportVariable: '--percentage-below-viewport',
      inViewportVariable: '--in-view',
      ...options
    };

    // init events
    this.initEvents();

    // first calculate
    this.checkAllElements();
  }

  initEvents() {
    // refresh calculation after scroll
    document.addEventListener('scroll', (e) => {
      this.checkAllElements();
    })
    
    // refresh calculation after resize
    window.addEventListener('resize', (e) => {
      this.checkAllElements();
    })
    
    // refresh calculation after resize
    document.addEventListener('inview-css-variables', (e) => {
      this.checkAllElements();
    })
  }

  checkAllElements() {
    // get all elements for calculation
    const allElements = document.querySelectorAll(`.${this.options.baseClass}`);

    // get scroll position
    const viewport = {
      topOffset: window.pageYOffset,
      bottomOffset: window.pageYOffset + window.innerHeight
    };

    // calculate for all elements
    for (let element of allElements) {
      this.checkSingleElement(element, viewport);
    }
  }

  isVisible(element) {
    const clientRect = element.getBoundingClientRect();

    if (element.offsetWidth + element.offsetHeight + clientRect.height + clientRect.width === 0) {
        return false;
    }
    const elemCenter = {
        start: clientRect.top,
        center: clientRect.top + element.offsetHeight / 2,
        end: clientRect.top + element.offsetHeight
    };
    if (elemCenter.end < 0) return false;
    if (elemCenter.start > (document.documentElement.clientHeight || window.innerHeight)) return false;
    // start
    let pointContainer = document.elementFromPoint(clientRect.left, elemCenter.start);
    do {
        if (pointContainer === element) return true;
    } while (pointContainer && (pointContainer = pointContainer.parentNode));
    // center
    pointContainer = document.elementFromPoint(clientRect.left + element.offsetWidth / 2, elemCenter.center);
    do {
        if (pointContainer === element) return true;
    } while (pointContainer && (pointContainer = pointContainer.parentNode));
    // bottom
    pointContainer = document.elementFromPoint(clientRect.left + element.offsetWidth, elemCenter.end);
    do {
        if (pointContainer === element) return true;
    } while (pointContainer && (pointContainer = pointContainer.parentNode));
    return false;
  }

  checkSingleElement(element, viewport) {
    // get element position
    const elementTop = this.getOffsetTop(element);
    const elementHeight = element.offsetHeight;
    const elementBottom = elementTop + elementHeight;

    // check if element was in view
    const wasInView = element.dataset.wasInView || false;
    const isInView = this.isVisible(element);

    // is currently visible
    element.dataset.isInView = isInView;
    // is or was visible
    element.dataset.wasInView = isInView || wasInView;

    // calculate percentage if needed
    if (element.classList.contains(this.options.positionTrackClass)) {
      const percentageBelowViewport = 1 - Math.min(1, Math.max(0, (viewport.bottomOffset - elementTop) / elementHeight));
      const percentageAboveViewport = 1 - Math.min(1, Math.max(0, (elementBottom - viewport.topOffset) / elementHeight));
      element.style.setProperty(this.options.aboveViewportVariable, percentageAboveViewport)
      element.style.setProperty(this.options.belowViewportVariable, percentageBelowViewport)
      element.style.setProperty(this.options.inViewportVariable, (1 - percentageBelowViewport + percentageAboveViewport) / 2)
    }
  }

  getOffsetTop(element) {
    // calculate offset
    let fullOffset = 0;
    for (let el = element; el; el = el.offsetParent) {
      fullOffset += el.offsetTop;
    }
    return fullOffset;
  }
}