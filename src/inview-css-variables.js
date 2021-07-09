export default class InViewCssVariables {
  constructor(options) {
    this.options = {
      baseClass: 'm-inview-css',
      positionTrackClass: 'm-inview-css--track-scroll-position',
      aboveViewportVariable: '--percentage-above-viewport',
      belowViewportVariable: '--percentage-below-viewport',
      inViewportVariable: '--in-view',
      ...options
    };
    this.initEvents();
    this.checkAllElements();
  }
  initEvents() {
    document.addEventListener('scroll', (e) => {
      this.checkAllElements();
    })
    window.addEventListener('resize', (e) => {
      this.checkAllElements();
    })
  }
  checkAllElements() {
    const allElements = document.querySelectorAll(`.${this.options.baseClass}`);
    const viewport = {
      topOffset: window.pageYOffset,
      bottomOffset: window.pageYOffset + window.innerHeight
    };
    for (let element of allElements) {
      this.checkSingleElement(element, viewport);
    }
  }
  checkSingleElement(element, viewport) {
    const elementTop = this.getOffsetTop(element);
    const elementHeight = element.offsetHeight;
    const elementBottom = elementTop + elementHeight;
    const wasInView = element.dataset.wasInView || false;

    const topAboveViewportBottom = elementTop <= viewport.bottomOffset;

    const bottomBelowViewportTop = elementBottom >= viewport.topOffset;

    const isInView = topAboveViewportBottom && bottomBelowViewportTop;

    element.dataset.isInView = isInView;
    element.dataset.wasInView = isInView || wasInView;

    if (element.classList.contains(this.options.positionTrackClass)) {
      const percentageBelowViewport = 1 - Math.min(1, Math.max(0, (viewport.bottomOffset - elementTop) / elementHeight));
      const percentageAboveViewport = 1 - Math.min(1, Math.max(0, (elementBottom - viewport.topOffset) / elementHeight));
      element.style.setProperty(this.options.aboveViewportVariable, percentageAboveViewport)
      element.style.setProperty(this.options.belowViewportVariable, percentageBelowViewport)
      element.style.setProperty(this.options.inViewportVariable, (1 - percentageBelowViewport + percentageAboveViewport) / 2)
    }
  }
  getOffsetTop(element) {
    let fullOffset = 0;
    for (let el = element; el; el = el.offsetParent) {
      fullOffset += el.offsetTop;
    }
    return fullOffset;
  }
}