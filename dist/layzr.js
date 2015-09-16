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

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Layzr = (function () {
    function Layzr() {
      var _this = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Layzr);

      // options
      this.selector = options.selector || '[data-layzr]';
      this.threshold = options.threshold || 0;

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
      key: '_update',
      value: function _update() {
        var _this3 = this;

        this.windowHeight = window.innerHeight;
        this.elements.forEach(function (element) {
          return _this3._inViewport(element) && console.log('In viewport.');
        });

        this.ticking = false;
      }
    }]);

    return Layzr;
  })();

  module.exports = Layzr;
});