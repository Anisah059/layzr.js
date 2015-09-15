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
    // TODO: more default options/destructuring?

    function Layzr() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Layzr);

      this.container = document.querySelector(options.container) || window;
      this.selector = options.selector || '[data-layzr]';
    }

    _createClass(Layzr, [{
      key: 'run',
      value: function run() {
        var selector = arguments.length <= 0 || arguments[0] === undefined ? this.selector : arguments[0];

        // selector is the same -> replace existing elements
        // selector is different -> add to existing elements
        selector === this.selector ? this.elements = this._getElements(selector) : this.elements = this.elements.concat(this._getElements(selector));
      }
    }, {
      key: '_getElements',
      value: function _getElements(selector) {
        // use qSA based on container to minize # of elements checked
        var elements = this.container === window ? document.querySelectorAll(selector) : this.container.querySelectorAll(selector);

        return Array.prototype.slice.call(elements);
      }
    }]);

    return Layzr;
  })();

  module.exports = Layzr;
});