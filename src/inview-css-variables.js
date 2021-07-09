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

  checkSingleElement(element, viewport) {
    // get element position
    const elementTop = this.getOffsetTop(element);
    const elementHeight = element.offsetHeight;
    const elementBottom = elementTop + elementHeight;

    // check if element was in view
    const wasInView = element.dataset.wasInView || false;

    const topAboveViewportBottom = elementTop <= viewport.bottomOffset;
    const bottomBelowViewportTop = elementBottom >= viewport.topOffset;
    const isInView = topAboveViewportBottom && bottomBelowViewportTop;

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