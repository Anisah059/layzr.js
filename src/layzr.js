export default class Layzr {
  constructor(options = {}) {
    // options
    this.selector = options.selector || '[data-layzr]'
    this.srcsetAttr = options.srcsetAttr || 'data-layzr'
    this.bgAttr = options.bgAttr || 'data-layzr-bg'
    this.threshold = options.threshold || 0
    this.callback = options.callback || undefined

    // debounce
    this.prevLocation = 0
    this.ticking = false

    // events
    this.eventsBound = false
    this.eventHandler = () => this._requestLocation()

    // pixel density
    this.dpr = window.devicePixelRatio
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

    return elementOffset.top <= viewportBottom + threshold
        && elementOffset.bottom >= viewportTop - threshold
  }

  _getSource(element) {
    const candidates = element
      .getAttribute(this.srcsetAttr)
      .split(',')
      .map(candidate => candidate.trim())

    const sources = candidates.map(candidate => candidate.split(' ').shift())

    const ratios = candidates.map((candidate) => {
      const raw = candidate.split(' ').pop()
      const px = parseInt(raw, 10)

      return px / this.windowWidth
    })

    const ideal = ratios.filter(ratio => ratio >= this.dpr)
    const fallback = ratios.filter(ratio => ratio < this.dpr)

    const best = ideal.length === 0
      ? Math.max(...fallback)
      : Math.min(...ideal)

    return sources[ratios.indexOf(best)]
  }

  _removeAttributes(element, ...attributes) {
    attributes.forEach(attribute => element.removeAttribute(attribute))
  }

  _reveal(element) {
    const source = this._getSource(element)

    element.hasAttribute(this.bgAttr)
      ? element.style.backgroundImage = 'url("' + source + ')'
      : element.setAttribute('src', source)

    typeof this.callback === 'function' && this.callback.call(element)

    this._removeAttributes(element, this.srcsetAttr, this.bgAttr)

    this.elements = this._getElements()
    this.elements.length === 0 && this._unbindEvents()
  }

  _update() {
    this.windowWidth = window.innerWidth
    this.windowHeight = window.innerHeight
    this.elements.forEach(element => this._inViewport(element) && this._reveal(element))

    this.ticking = false
  }
}
