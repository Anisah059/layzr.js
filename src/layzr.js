'use strict';

function Layzr(options) {
  options = options || {};

  this.container  = document.querySelector(options.container) || window;
  this.selector   = options.selector || '[data-layzr]';
  this.attr       = options.attr || 'data-layzr';
  this.retinaAttr = options.retinaAttr || 'data-layzr-retina';
  this.bgAttr     = options.bgAttr || 'data-layzr-bg';
  this.threshold  = options.threshold || 0;
  this.callback   = options.callback || null;

  this.src = window.devicePixelRatio > 1
    ? this.retinaAttr
    : this.attr;

  this.prevLoc = 0;
  this.ticking = false;

  this.eventsBound   = false;
  this.eventsHandler = this._requestLocation.bind(this);

  this.elements = [];
}

Layzr.prototype.start =
Layzr.prototype.continue = function(selector, overwrite) {
  // get new elements
  var newElements = this._getElements(selector);

  // update or overwrite existing elements
  overwrite
    ? this.elements = newElements
    : this.elements = this.elements.concat(newElements);

  // bind events, if needed
  if(!this.eventsBound) {
    this._bindEvents();
  }

  // call event handler once
  this.eventsHandler();
}

Layzr.prototype._bindEvents = function() {
  this.container.addEventListener('scroll', this.eventsHandler, false);
  this.container.addEventListener('resize', this.eventsHandler, false);

  this.eventsBound = true;
};

Layzr.prototype._unbindEvents = function() {
  this.container.removeEventListener('scroll', this.eventsHandler, false);
  this.container.removeEventListener('resize', this.eventsHandler, false);

  this.eventsBound = false;
};

Layzr.prototype._requestLocation = function() {
  this.container === window
    ? this.prevLoc = window.pageYOffset
    : this.prevLoc = this.container.scrollTop + this._getOffset(this.container);

  this._requestTick();
};

Layzr.prototype._requestTick = function() {
  if(!this.ticking) {
    requestAnimationFrame(this._update.bind(this));
    this.ticking = true;
  }
};

Layzr.prototype._getElements = function(selector) {
  return this.container === window
    ? Array.prototype.slice.call(document.querySelectorAll(selector || this.selector))
    : Array.prototype.slice.call(this.container.querySelectorAll(selector || this.selector))
};

Layzr.prototype._getOffset = function(element) {
  return this.container === window
    ? element.getBoundingClientRect().top + window.pageYOffset
    : element.offsetTop - element.parentNode.offsetTop;
};

Layzr.prototype._inViewport = function(element) {
  var viewportTop = this.prevLoc;
  var viewportBottom = viewportTop + this.containerHeight;

  var elementTop = this._getOffset(element);
  var elementBottom = elementTop + this.containerHeight;

  var threshold = (this.threshold / 100) * this.containerHeight;

  return elementBottom >= viewportTop - threshold
      && elementTop <= viewportBottom + threshold;
};

Layzr.prototype._reveal = function(element) {
  var source = element.getAttribute(this.src) || element.getAttribute(this.attr);

  element.hasAttribute(this.bgAttr)
    ? element.style.backgroundImage = 'url("' + source + '")'
    : element.setAttribute('src', source);

  if(typeof this.callback === 'function') {
    this.callback.call(element);
  }

  element.removeAttribute(this.attr);
  element.removeAttribute(this.retinaAttr);
  element.removeAttribute(this.bgAttr);

  this.elements = this._getElements();

  if(this.elements.length === 0) {
    this._unbindEvents();
  }
};

Layzr.prototype._update = function() {
  this.containerHeight = this.container.innerHeight || this.container.offsetHeight;

  this.elements.forEach(function(element) {
    if(this._inViewport(element)) {
      this._reveal(element);
    }
  }.bind(this));

  this.ticking = false;
};
