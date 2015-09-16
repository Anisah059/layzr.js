/*!
 * Layzr.js 2.0.0 - A small, fast, modern, and dependency-free library for lazy loading.
 * Copyright (c) 2015 Michael Cavalea - http://callmecavs.github.io/layzr.js/
 * License: MIT
 */

(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Layzr', ['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.Layzr = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Layzr = (function () {
    function Layzr() {
      var _this = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Layzr);

      // options
      this.selector = options.selector || '[data-layzr]';
      this.srcsetAttr = options.srcsetAttr || 'data-layzr';
      this.bgAttr = options.bgAttr || 'data-layzr-bg';
      this.threshold = options.threshold || 0;
      this.callback = options.callback || undefined;

      // debounce
      this.prevLocation = 0;
      this.ticking = false;

      // events
      this.eventsBound = false;
      this.eventHandler = function () {
        return _this._requestLocation();
      };
    }

    _createClass(Layzr, [{
      key: 'run',
      value: function run() {
        this.elements = this._getElements();
        !this.eventsBound && this._bindEvents();
        this.eventHandler();
      }
    }, {
      key: '_bindEvents',
      value: function _bindEvents() {
        window.addEventListener('scroll', this.eventHandler, false);
        window.addEventListener('resize', this.eventHandler, false);

        this.eventsBound = true;
      }
    }, {
      key: '_unbindEvents',
      value: function _unbindEvents() {
        window.removeEventListener('scroll', this.eventHandler, false);
        window.removeEventListener('resize', this.eventHandler, false);

        this.eventsBound = false;
      }
    }, {
      key: '_requestLocation',
      value: function _requestLocation() {
        this.prevLocation = window.pageYOffset;
        this._requestTick();
      }
    }, {
      key: '_requestTick',
      value: function _requestTick() {
        var _this2 = this;

        if (!this.ticking) {
          requestAnimationFrame(function () {
            return _this2._update();
          });
          this.ticking = true;
        }
      }
    }, {
      key: '_getElements',
      value: function _getElements() {
        return Array.prototype.slice.call(document.querySelectorAll(this.selector));
      }
    }, {
      key: '_getOffset',
      value: function _getOffset(element) {
        var offset = element.getBoundingClientRect();
        var offsetTop = offset.top + this.prevLocation;

        return {
          top: offsetTop,
          bottom: offsetTop + offset.height
        };
      }
    }, {
      key: '_inViewport',
      value: function _inViewport(element) {
        var threshold = this.threshold / 100 * this.windowHeight;

        var viewportTop = this.prevLocation;
        var viewportBottom = viewportTop + this.windowHeight;

        var elementOffset = this._getOffset(element);

        return elementOffset.top >= viewportTop - threshold && elementOffset.bottom <= viewportBottom + threshold;
      }
    }, {
      key: '_getSource',
      value: function _getSource(element) {
        var _this3 = this;

        var dpr = window.devicePixelRatio;

        var candidates = element.getAttribute(this.srcsetAttr).split(',').map(function (candidate) {
          return candidate.trim();
        });

        var sources = candidates.map(function (candidate) {
          return candidate.split(' ').shift();
        });

        var ratios = candidates.map(function (candidate) {
          var raw = candidate.split(' ').pop();
          var px = parseInt(raw, 10);

          return px / _this3.windowWidth;
        });

        var smaller = ratios.filter(function (ratio) {
          return ratio < dpr;
        });
        var larger = ratios.filter(function (ratio) {
          return ratio > dpr;
        });

        var best = larger.length > 0 ? sources[ratios.indexOf(Math.min.apply(Math, _toConsumableArray(larger)))] : sources[ratios.indexOf(Math.max.apply(Math, _toConsumableArray(smaller)))];

        console.log(best);

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
    }, {
      key: '_removeAttributes',
      value: function _removeAttributes(element) {
        for (var _len = arguments.length, attributes = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          attributes[_key - 1] = arguments[_key];
        }

        attributes.forEach(function (attribute) {
          return element.removeAttribute(attribute);
        });
      }
    }, {
      key: '_reveal',
      value: function _reveal(element) {
        var source = this._getSource(element);

        element.hasAttribute(this.bgAttr) ? element.style.backgroundImage = 'url("' + source + ')' : element.setAttribute('src', source);

        typeof this.callback === 'function' && this.callback.call(element);

        this._removeAttributes(element, this.srcsetAttr, this.bgAttr);

        this.elements = this._getElements();
        this.elements.length === 0 && this._unbindEvents();
      }
    }, {
      key: '_update',
      value: function _update() {
        var _this4 = this;

        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.elements.forEach(function (element) {
          return _this4._inViewport(element) && _this4._reveal(element);
        });

        this.ticking = false;
      }
    }]);

    return Layzr;
  })();

  module.exports = Layzr;
});