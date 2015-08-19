/*!
 * Layzr.js 2.0.0 - A small, fast, modern, and dependency-free library for lazy loading.
 * Copyright (c) 2015 Michael Cavalea - http://callmecavs.github.io/layzr.js/
 * License: MIT
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Layzr = factory();
  }
}(this, function() {
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

  window.devicePixelRatio > 1
    ? this.src = this.retinaAttr
    : this.src = this.attr;

  this.prevLoc = 0;
  this.ticking = false;

  this.handlers = this._requestLocation.bind(this);
  this.elements = this._getElements();

  this._create();
}

Layzr.prototype._create = function() {
  this.handlers();

  this.container.addEventListener('scroll', this.handlers, false);
  this.container.addEventListener('resize', this.handlers, false);
};

Layzr.prototype._destroy = function() {
  this.container.removeEventListener('scroll', this.handlers, false);
  this.container.removeEventListener('resize', this.handlers, false);
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

Layzr.prototype._getElements = function() {
  return this.container === window
    ? Array.prototype.slice.call(document.querySelectorAll(this.selector))
    : Array.prototype.slice.call(this.container.querySelectorAll(this.selector))
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
    this._destroy();
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

return Layzr;
}));
