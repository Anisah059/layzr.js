# Layzr.js

[![Layzr.js on NPM](https://img.shields.io/npm/v/layzr.js.svg)](https://www.npmjs.com/package/layzr.js)
[![Layzr.js on Bower](https://img.shields.io/bower/v/layzr.js.svg)](http://bower.io/search/?q=layzr.js)
[![Layzr.js on Gitter](https://img.shields.io/badge/gitter-join%20chat-brightgreen.svg)](https://gitter.im/callmecavs/layzr.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

A small, fast, modern, and dependency-free library for lazy loading.

Lazy loading boosts page speed by deferring the loading of images until they're in (or near) the viewport. This library makes it completely painless - maximizing speed by keeping options to a minimum.

* [Demo Page](http://callmecavs.github.io/layzr.js/)

## Usage

Follow these steps:

1. [Install](#install)
2. [Element Setup](#element-setup)
3. [Instance Creation](#instance-creation)
4. [`start` & `continue`]()

### Install

Load the script.

[Download it](https://github.com/callmecavs/layzr.js/archive/master.zip), install it with [NPM](https://www.npmjs.com/package/layzr.js), or install it with [Bower](http://bower.io/search/?q=layzr.js).

```html
<script src="layzr.js"></script>
```

#### CDN

The script is also available via CDN.

Replace `{version}` with your desired [release](https://github.com/callmecavs/layzr.js/releases) in the following:

##### [cdnjs](https://cdnjs.com/libraries/layzr.js)
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/layzr.js/{version}/layzr.min.js"></script>
```

##### [jsDelivr](http://www.jsdelivr.com/#!layzr.js)
```html
<script src="https://cdn.jsdelivr.net/layzr.js/{version}/layzr.min.js"></script>
```

### Element Setup

Use the `data-layzr` attribute to include the source for each `img` and `iframe` to lazy load.

```html
<img data-layzr="image/source">
<iframe data-layzr="media/source"></iframe>
```

This is the only _required_ setup. Advanced, _optional_ setup follows.

* [Placeholders](#placeholders)
* [Retina Support](#retina-support)
* [Background Images](#background-images)

#### Placeholders

Use the `src` attribute to include a placeholder.

_Before_ they load, elements without a placeholder may impact layout - have no width/height, appear broken, etc.

```html
<img src="optional/placeholder" data-layzr="image/source">
```

#### Retina Support

Use the `data-layzr-retina` attribute to include a retina version of the image if the [devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) is greater than 1.

Ensure the proper CSS is in place to display both regular and retina images correctly.

```html
<img data-layzr="image/source" data-layzr-retina="optional/retina/source">
```

#### Background Images

Include the `data-layzr-bg` attribute to load the source as a background image.

The `data-layzr-bg` attribute should be valueless - the image source is still taken from the `data-layzr` and `data-layzr-retina` attributes.

```html
<img data-layzr="image/source" data-layzr-bg>
```

### Instance Creation

Create a new instance, and that's it!

```javascript
var layzr = new Layzr();
```

Documentation for all options follows:

## Options

Defaults shown below:

```javascript
var layzr = new Layzr({
  container: null,
  selector: '[data-layzr]',
  attr: 'data-layzr',
  retinaAttr: 'data-layzr-retina',
  bgAttr: 'data-layzr-bg',
  threshold: 0,
  callback: null
});
```

Explanation of each follows:

### container

Customize the container that holds the elements to lazy load - using CSS selector syntax. This option may be useful when building single page applications.

Note that `window` is assumed to be the container if this option is set to `null`.

```javascript
var layzr = new Layzr({
  container: null
});
```

### selector

Customize the selector used to find elements to lazy load - using CSS selector syntax.

```javascript
var layzr = new Layzr({
  selector: '[data-layzr]'
});
```

### attr / retinaAttr

Customize the data attributes that image sources are taken from.

```javascript
var layzr = new Layzr({
  attr: 'data-layzr',
  retinaAttr: 'data-layzr-retina'
});
```

### bgAttr

Customize the data attribute that loads images as a background.

```javascript
var layzr = new Layzr({
  bgAttr: 'data-layzr-bg'
});
```

### threshold

Adjust when images load, relative to the viewport. Positive values make elements load _sooner_.

Threshold is a percentage of the viewport height - think of it as similar to the CSS `vh` unit.

```javascript
// load images when they're half the viewport height away from the bottom of the viewport

var layzr = new Layzr({
  threshold: 50
});
```

### callback

Invoke a callback function each time an image is loaded.

The image _may not be fully loaded before the function is called_. Detecting image load is inconsistent at best in modern browsers.

```javascript
// in the callback function, "this" refers to the image node

var layzr = new Layzr({
  callback: function() {
    this.classList.add('class');
  }
});
```

## Browser Support

Layzr natively supports **IE10+**.

To add support for older browsers, consider including [Paul Irish's polyfill](https://gist.github.com/paulirish/1579671) for [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

There are currently no plans to include the polyfill in the library, in the interest of file size.

## Colophon

* Site Design: [Chris Allen](https://dribbble.com/cp_allen)
* Stock Photos: [Unsplash](https://unsplash.com/)
* Heading Links: [heading-links.js](https://github.com/callmecavs/heading-links.js)
* Google Analytics Isogram: [isogrammer](http://isogrammer.com/)
* Inspiration: [Headroom.js](http://wicky.nillia.ms/headroom.js/), [jQuery Unveil](http://luis-almeida.github.io/unveil/)
* Education: [Paul Lewis](http://www.html5rocks.com/en/tutorials/speed/animations/)

## License

MIT. © 2015 Michael Cavalea

## Roadmap

- [x] Add to CDN?

[![Built With Love](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)
