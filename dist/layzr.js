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

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Layzr = function Layzr(options) {
    _classCallCheck(this, Layzr);

    console.log(this);
  };

  module.exports = Layzr;
});