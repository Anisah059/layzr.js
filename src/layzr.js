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

  _getSource(element) {
    const dpr = window.devicePixelRatio

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

    const smaller = ratios.filter(ratio => ratio < dpr)
    const larger = ratios.filter(ratio => ratio > dpr)

    const best = larger.length > 0
      ? sources[ratios.indexOf(Math.min(...larger))]
      : sources[ratios.indexOf(Math.max(...smaller))]

    console.log(best)

    // console.log(candidates)
    // console.log(sources)
    // console.log(ratios)

    // const pairs   = element.getAttribute(attribute).split(', ')

    // const sources = pairs.map(pair => pair.split(' ').shift())
    // const sizes   = pairs.map(pair => parseInt(pair.split(' ').pop().slice(0, -1), 10))


    // console.log(pairs)
    // console.log(sources)
    // console.log(sizes)

    // const sources = raw.map((source) => {
    //   const split = source.split(' ')

    //   return [
    //     split / this.windowWidth,
    //     split.shift()
    //   ]
    // })

    // const best = sources.reduce((test, source) => {

    // }, 0)

    // console.log(sources)

    // const source = element
    //   .getAttribute(this.normalAttr)
    //   .split(', ')
    //   .map((source) => {
    //     const px = source.split(' ').pop()
    //     return parseInt(px, 10)
    //   })
    //   .reduce((best, size, index) => {
    //     const ratio = size / this.windowWidth

    //     return ratio >= best
    //       ? index
    //       : best
    //   }, 0)

    // console.log(source)
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
