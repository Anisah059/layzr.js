'use strict'

export default class Layzr {
  constructor(options = {}) {
    // options
    this.selector = options.selector || '[data-layzr]'
    this.normalAttr = options.normalAttr || 'data-layzr'
    this.retinaAttr = options.retinaAttr || 'data-layzr-retina'
    this.bgAttr = options.bgAttr || 'data-layzr-bg'
    this.threshold = options.threshold || 0
    this.callback = options.callback || null

    // debounce
    this.prevLocation = 0
    this.ticking = false

    // events
    this.eventsBound = false
    this.eventHandler = () => this._requestLocation()
  }

  run() {
    this.elements = this._getElements()
    !this.eventsBound && this._bindEvents()
    this.eventHandler()
  }

  _bindEvents() {
    window.addEventListener('scroll', this.eventHandler, false)
    window.addEventListener('resize', this.eventHandler, false)

    this.eventsBound = true
  }

  _unbindEvents() {
    window.removeEventListener('scroll', this.eventHandler, false)
    window.removeEventListener('resize', this.eventHandler, false)

    this.eventsBound = false
  }

  _requestLocation() {
    this.prevLocation = window.pageYOffset
    this._requestTick()
  }

  _requestTick() {
    if(!this.ticking) {
      requestAnimationFrame(() => this._update())
      this.ticking = true
    }
  }

  _getElements() {
    return Array.prototype.slice.call(document.querySelectorAll(this.selector))
  }

  _getOffset(element) {
    const offset = element.getBoundingClientRect()
    const offsetTop = offset.top + this.prevLocation

    return {
      top: offsetTop,
      bottom: offsetTop + offset.height
    }
  }

  _inViewport(element) {
    const threshold = (this.threshold / 100) * this.windowHeight

    const viewportTop = this.prevLocation
    const viewportBottom = viewportTop + this.windowHeight

    const elementOffset = this._getOffset(element)

    return elementOffset.top >= viewportTop - threshold
        && elementOffset.bottom <= viewportBottom + threshold
  }

  _removeAttributes(element, ...attributes) {
    attributes.forEach(attribute => element.removeAttribute(attribute))
  }

  _reveal(element) {
    const source = '';

    element.hasAttribute(this.bgAttr)
      ? element.style.backgroundImage = 'url("' + source + ')'
      : element.setAttribute('src', source)

    typeof this.callback === 'function' && this.callback.call(element)

    this._removeAttributes(element, this.normalAttr, this.retinaAttr, this.bgAttr)

    this.elements = this._getElements()
    this.elements.length === 0 && this._unbindEvents()
  }

  _update() {
    this.windowHeight = window.innerHeight
    this.elements.forEach(element => this._inViewport(element) && this._reveal(element))

    this.ticking = false
  }
}
