'use strict'

export default class Layzr {
  // TODO: more default options/destructuring?
  constructor(options = {}) {
    this.container = document.querySelector(options.container) || window
    this.selector  = options.selector || '[data-layzr]'
  }

  run(selector = this.selector) {
    // selector is the same -> replace existing elements
    // selector is different -> add to existing elements
    selector === this.selector
      ? this.elements = this._getElements(selector)
      : this.elements = this.elements.concat(this._getElements(selector))
  }

  _getElements(selector) {
    // use qSA based on container to minize # of elements checked
    const elements = this.container === window
      ? document.querySelectorAll(selector)
      : this.container.querySelectorAll(selector)

    return Array.prototype.slice.call(elements)
  }
}
