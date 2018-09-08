// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../../node_modules/domtastic/src/util.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 * @module Util
 */

/*
 * Reference to the window object
 * @private
 */

const win = exports.win = typeof window !== 'undefined' ? window : {};

/**
 * Convert `NodeList` to `Array`.
 *
 * @param {NodeList|Array} collection
 * @return {Array}
 * @private
 */

const toArray = exports.toArray = collection => {
  const length = collection.length;
  const result = new Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = collection[i];
  }
  return result;
};

/**
 * Faster alternative to [].forEach method
 *
 * @param {Node|NodeList|Array} collection
 * @param {Function} callback
 * @return {Node|NodeList|Array}
 * @private
 */

const each = exports.each = (collection, callback, thisArg) => {
  const length = collection.length;
  if (length !== undefined && collection.nodeType === undefined) {
    for (let i = 0; i < length; i++) {
      callback.call(thisArg, collection[i], i, collection);
    }
  } else {
    callback.call(thisArg, collection, 0, collection);
  }
  return collection;
};

/**
 * Assign enumerable properties from source object(s) to target object
 *
 * @method extend
 * @param {Object} target Object to extend
 * @param {Object} [source] Object to extend from
 * @return {Object} Extended object
 * @example
 *     $.extend({a: 1}, {b: 2}); // {a: 1, b: 2}
 * @example
 *     $.extend({a: 1}, {b: 2}, {a: 3}); // {a: 3, b: 2}
 */

const extend = exports.extend = (target, ...sources) => {
  sources.forEach(src => {
    for (let prop in src) {
      target[prop] = src[prop];
    }
  });
  return target;
};

/**
 * Return the collection without duplicates
 *
 * @param collection Collection to remove duplicates from
 * @return {Node|NodeList|Array}
 * @private
 */

const uniq = exports.uniq = collection => collection.filter((item, index) => collection.indexOf(item) === index);
},{}],"../../node_modules/domtastic/src/selector/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOMtastic = exports.matches = exports.find = exports.$ = undefined;

var _util = require('../util');

let isPrototypeSet = false; /**
                             * @module Selector
                             */

const reFragment = /^\s*<(\w+|!)[^>]*>/;
const reSingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
const reSimpleSelector = /^[.#]?[\w-]*$/;

/*
 * Versatile wrapper for `querySelectorAll`.
 *
 * @param {String|Node|NodeList|Array} selector Query selector, `Node`, `NodeList`, array of elements, or HTML fragment string.
 * @param {String|Node|NodeList} context=document The context for the selector to query elements.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     var $items = $(.items');
 * @example
 *     var $element = $(domElement);
 * @example
 *     var $list = $(nodeList, document.body);
 * @example
 *     var $element = $('<p>evergreen</p>');
 */

const domtastic = function domtastic(selector, context = document) {

  let collection;

  if (!selector) {

    collection = document.querySelectorAll(null);
  } else if (selector instanceof DOMtastic) {

    return selector;
  } else if (typeof selector !== 'string') {

    collection = selector.nodeType || selector === window ? [selector] : selector;
  } else if (reFragment.test(selector)) {

    collection = createFragment(selector);
  } else {

    context = typeof context === 'string' ? document.querySelector(context) : context.length ? context[0] : context;

    collection = querySelector(selector, context);
  }

  return wrap(collection);
};

const $ = exports.$ = domtastic;

/*
 * Find descendants matching the provided `selector` for each element in the collection.
 *
 * @param {String|Node|NodeList|Array} selector Query selector, `Node`, `NodeList`, array of elements, or HTML fragment string.
 * @return {Object} The wrapped collection
 * @example
 *     $('.selector').find('.deep').$('.deepest');
 */

const find = exports.find = function (selector) {
  const nodes = [];
  (0, _util.each)(this, node => (0, _util.each)(querySelector(selector, node), child => {
    if (nodes.indexOf(child) === -1) {
      nodes.push(child);
    }
  }));
  return $(nodes);
};

/*
 * Returns `true` if the element would be selected by the specified selector string; otherwise, returns `false`.
 *
 * @param {Node} element Element to test
 * @param {String} selector Selector to match against element
 * @return {Boolean}
 *
 * @example
 *     $.matches(element, '.match');
 */

const matches = exports.matches = (() => {
  const context = typeof Element !== 'undefined' ? Element.prototype : _util.win;
  const _matches = context.matches || context.matchesSelector || context.mozMatchesSelector || context.msMatchesSelector || context.oMatchesSelector || context.webkitMatchesSelector;
  return (element, selector) => _matches.call(element, selector);
})();

/*
 * Use the faster `getElementById`, `getElementsByClassName` or `getElementsByTagName` over `querySelectorAll` if possible.
 *
 * @private
 * @param {String} selector Query selector.
 * @param {Node} context The context for the selector to query elements.
 * @return {Object} NodeList, HTMLCollection, or Array of matching elements (depending on method used).
 */

const querySelector = (selector, context) => {

  const isSimpleSelector = reSimpleSelector.test(selector);

  if (isSimpleSelector) {
    if (selector[0] === '#') {
      const element = (context.getElementById ? context : document).getElementById(selector.slice(1));
      return element ? [element] : [];
    }
    if (selector[0] === '.') {
      return context.getElementsByClassName(selector.slice(1));
    }
    return context.getElementsByTagName(selector);
  }

  return context.querySelectorAll(selector);
};

/*
 * Create DOM fragment from an HTML string
 *
 * @private
 * @param {String} html String representing HTML.
 * @return {NodeList}
 */

const createFragment = html => {

  if (reSingleTag.test(html)) {
    return [document.createElement(RegExp.$1)];
  }

  const elements = [];
  const container = document.createElement('div');
  const children = container.childNodes;

  container.innerHTML = html;

  for (let i = 0, l = children.length; i < l; i++) {
    elements.push(children[i]);
  }

  return elements;
};

/*
 * Calling `$(selector)` returns a wrapped collection of elements.
 *
 * @private
 * @param {NodeList|Array} collection Element(s) to wrap.
 * @return Object) The wrapped collection
 */

const wrap = collection => {

  if (!isPrototypeSet) {
    DOMtastic.prototype = $.fn;
    DOMtastic.prototype.constructor = DOMtastic;
    isPrototypeSet = true;
  }

  return new DOMtastic(collection);
};

/*
 * Constructor for the Object.prototype strategy
 *
 * @constructor
 * @private
 * @param {NodeList|Array} collection Element(s) to wrap.
 */

const DOMtastic = exports.DOMtastic = function DOMtastic(collection) {
  let i = 0;
  const length = collection.length;
  for (; i < length;) {
    this[i] = collection[i++];
  }
  this.length = length;
};
},{"../util":"../../node_modules/domtastic/src/util.js"}],"../../node_modules/domtastic/src/array.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unshift = exports.some = exports.shift = exports.reverse = exports.reduceRight = exports.reduce = exports.push = exports.pop = exports.map = exports.indexOf = exports.each = exports.forEach = exports.filter = exports.every = undefined;

var _util = require('./util');

var _index = require('./selector/index');

/**
 * @module Array
 */

const ArrayProto = Array.prototype;

/**
 * Checks if the given callback returns a true(-ish) value for each element in the collection.
 *
 * @param {Function} callback Function to execute for each element, invoked with `element` as argument.
 * @param {Object} [thisArg] Value to use as `this` when executing `callback`.
 * @return {Boolean} Whether each element passed the callback check.
 * @example
 *     // Test whether every element in the collection has the "active" attribute
 *     $('.items').every(function(element) {
 *         return element.hasAttribute('active')
 *     });
 */

const every = exports.every = ArrayProto.every;

/**
 * Filter the collection by selector or function, and return a new collection with the result.
 *
 * @param {String|Function} selector Selector or function to filter the collection.
 * @param {Object} [thisArg] Value to use as `this` when executing `callback`.
 * @return {Object} A new wrapped collection
 * @chainable
 * @example
 *     $('.items').filter('.active');
 * @example
 *     $('.items').filter(function(element) {
 *         return element.hasAttribute('active')
 *     });
 */

const filter = exports.filter = function (selector, thisArg) {
  const callback = typeof selector === 'function' ? selector : element => (0, _index.matches)(element, selector);
  return (0, _index.$)(ArrayProto.filter.call(this, callback, thisArg));
};

/**
 * Execute a function for each element in the collection.
 *
 * @param {Function} callback Function to execute for each element, invoked with `element` as argument.
 * @param {Object} [thisArg] Value to use as `this` when executing `callback`.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.items').forEach(function(element) {
 *         element.style.color = 'evergreen';
 *     );
 */

const forEach = exports.forEach = function (callback, thisArg) {
  return (0, _util.each)(this, callback, thisArg);
};

const each = exports.each = forEach;

/**
 * Returns the index of an element in the collection.
 *
 * @param {Node} element
 * @return {Number} The zero-based index, -1 if not found.
 * @example
 *     $('.items').indexOf(element); // 2
 */

const indexOf = exports.indexOf = ArrayProto.indexOf;

/**
 * Create a new collection by executing the callback for each element in the collection.
 *
 * @param {Function} callback Function to execute for each element, invoked with `element` as argument.
 * @param {Object} [thisArg] Value to use as `this` when executing `callback`.
 * @return {Array} Collection with the return value of the executed callback for each element.
 * @example
 *     // Create a new array with the attribute value of each element:
 *     $('.items').map(function(element) {
 *         return element.getAttribute('name')
 */

const map = exports.map = ArrayProto.map;

/**
 * Removes the last element from the collection, and returns that element.
 *
 * @return {Object} The last element from the collection.
 * @example
 *     var lastElement = $('.items').pop();
 */

const pop = exports.pop = ArrayProto.pop;

/**
 * Adds one or more elements to the end of the collection, and returns the new length of the collection.
 *
 * @param {Object} element Element(s) to add to the collection
 * @return {Number} The new length of the collection
 * @example
 *     $('.items').push(element);
 */

const push = exports.push = ArrayProto.push;

/**
 * Apply a function against each element in the collection, and this accumulator function has to reduce it
 * to a single value.
 *
 * @param {Function} callback Function to execute on each value in the array, taking four arguments (see example).
 * @param {Mixed} initialValue Object to use as the first argument to the first call of the callback.
 * @example
 *     // Calculate the combined height of elements:
 *     $('.items').reduce(function(previousValue, element, index, collection) {
 *         return previousValue + element.clientHeight;
 *     }, 0);
 */

const reduce = exports.reduce = ArrayProto.reduce;

/**
 * Apply a function against each element in the collection (from right-to-left), and this accumulator function has
 * to reduce it to a single value.
 *
 * @param {Function} callback Function to execute on each value in the array, taking four arguments (see example).
 * @param {Mixed} initialValue Object to use as the first argument to the first call of the callback.
 * @example
 *     // Concatenate the text of elements in reversed order:
 *     $('.items').reduceRight(function(previousValue, element, index, collection) {
 *         return previousValue + element.textContent;
 *     }, '');
 */

const reduceRight = exports.reduceRight = ArrayProto.reduceRight;

/**
 * Reverses an array in place. The first array element becomes the last and the last becomes the first.
 *
 * @return {Object} The wrapped collection, reversed
 * @chainable
 * @example
 *     $('.items').reverse();
 */

const reverse = exports.reverse = function () {
  return (0, _index.$)((0, _util.toArray)(this).reverse());
};

/**
 * Removes the first element from the collection, and returns that element.
 *
 * @return {Object} The first element from the collection.
 * @example
 *     var firstElement = $('.items').shift();
 */

const shift = exports.shift = ArrayProto.shift;

/**
 * Checks if the given callback returns a true(-ish) value for any of the elements in the collection.
 *
 * @param {Function} callback Function to execute for each element, invoked with `element` as argument.
 * @return {Boolean} Whether any element passed the callback check.
 * @example
 *     $('.items').some(function(element) {
 *         return element.hasAttribute('active')
 *     }); // true/false
 */

const some = exports.some = ArrayProto.some;

/**
 * Adds one or more elements to the beginning of the collection, and returns the new length of the collection.
 *
 * @param {Object} element Element(s) to add to the collection
 * @return {Number} The new length of the collection
 * @example
 *     $('.items').unshift(element);
 */

const unshift = exports.unshift = ArrayProto.unshift;
},{"./util":"../../node_modules/domtastic/src/util.js","./selector/index":"../../node_modules/domtastic/src/selector/index.js"}],"../../node_modules/domtastic/src/baseClass.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (api) {

  /**
   * Provide subclass for classes or components to extend from.
   * The opposite and successor of plugins (no need to extend `$.fn` anymore, complete control).
   *
   * @return {Class} The class to extend from, including all `$.fn` methods.
   * @example
   *     import { BaseClass } from  'domtastic';
   *
   *     class MyComponent extends BaseClass {
   *         doSomething() {
   *             return this.addClass('.foo');
   *         }
   *     }
   *
   *     let component = new MyComponent('body');
   *     component.doSomething();
   *
   * @example
   *     import $ from  'domtastic';
   *
   *     class MyComponent extends $.BaseClass {
   *         progress(value) {
   *             return this.attr('data-progress', value);
   *         }
   *     }
   *
   *     let component = new MyComponent(document.body);
   *     component.progress('ive').append('<p>enhancement</p>');
   */

  class BaseClass {
    constructor() {
      _index.DOMtastic.call(this, (0, _index.$)(...arguments));
    }
  }
  (0, _util.extend)(BaseClass.prototype, api);
  return BaseClass;
};

var _index = require('./selector/index');

var _util = require('./util');
},{"./selector/index":"../../node_modules/domtastic/src/selector/index.js","./util":"../../node_modules/domtastic/src/util.js"}],"../../node_modules/domtastic/src/css.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.css = undefined;

var _util = require('./util');

const isNumeric = value => !isNaN(parseFloat(value)) && isFinite(value); /**
                                                                          * @module CSS
                                                                          */

const camelize = value => value.replace(/-([\da-z])/gi, (matches, letter) => letter.toUpperCase());

const dasherize = value => value.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * Get the value of a style property for the first element, or set one or more style properties for each element in the collection.
 *
 * @param {String|Object} key The name of the style property to get or set. Or an object containing key-value pairs to set as style properties.
 * @param {String} [value] The value of the style property to set.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').css('padding-left'); // get
 *     $('.item').css('color', '#f00'); // set
 *     $('.item').css({'border-width': '1px', display: 'inline-block'}); // set multiple
 */

const css = exports.css = function (key, value) {

  let styleProps, prop, val;

  if (typeof key === 'string') {
    key = camelize(key);

    if (typeof value === 'undefined') {
      let element = this.nodeType ? this : this[0];
      if (element) {
        val = element.style[key];
        return isNumeric(val) ? parseFloat(val) : val;
      }
      return undefined;
    }

    styleProps = {};
    styleProps[key] = value;
  } else {
    styleProps = key;
    for (prop in styleProps) {
      val = styleProps[prop];
      delete styleProps[prop];
      styleProps[camelize(prop)] = val;
    }
  }

  (0, _util.each)(this, element => {
    for (prop in styleProps) {
      if (styleProps[prop] || styleProps[prop] === 0) {
        element.style[prop] = styleProps[prop];
      } else {
        element.style.removeProperty(dasherize(prop));
      }
    }
  });

  return this;
};
},{"./util":"../../node_modules/domtastic/src/util.js"}],"../../node_modules/domtastic/src/dom/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._each = exports._clone = exports.clone = exports.after = exports.before = exports.prepend = exports.append = undefined;

var _util = require('../util');

var _index = require('../selector/index');

/**
 * @module DOM
 */

const forEach = Array.prototype.forEach;

/**
 * Append element(s) to each element in the collection.
 *
 * @param {String|Node|NodeList|Object} element What to append to the element(s).
 * Clones elements as necessary.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').append('<p>more</p>');
 */

const append = exports.append = function (element) {
  if (this instanceof Node) {
    if (typeof element === 'string') {
      this.insertAdjacentHTML('beforeend', element);
    } else {
      if (element instanceof Node) {
        this.appendChild(element);
      } else {
        const elements = element instanceof NodeList ? (0, _util.toArray)(element) : element;
        forEach.call(elements, this.appendChild.bind(this));
      }
    }
  } else {
    _each(this, append, element);
  }
  return this;
};

/**
 * Place element(s) at the beginning of each element in the collection.
 *
 * @param {String|Node|NodeList|Object} element What to place at the beginning of the element(s).
 * Clones elements as necessary.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').prepend('<span>start</span>');
 */

const prepend = exports.prepend = function (element) {
  if (this instanceof Node) {
    if (typeof element === 'string') {
      this.insertAdjacentHTML('afterbegin', element);
    } else {
      if (element instanceof Node) {
        this.insertBefore(element, this.firstChild);
      } else {
        let elements = element instanceof NodeList ? (0, _util.toArray)(element) : element;
        forEach.call(elements.reverse(), prepend.bind(this));
      }
    }
  } else {
    _each(this, prepend, element);
  }
  return this;
};

/**
 * Place element(s) before each element in the collection.
 *
 * @param {String|Node|NodeList|Object} element What to place as sibling(s) before to the element(s).
 * Clones elements as necessary.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.items').before('<p>prefix</p>');
 */

const before = exports.before = function (element) {
  if (this instanceof Node) {
    if (typeof element === 'string') {
      this.insertAdjacentHTML('beforebegin', element);
    } else {
      if (element instanceof Node) {
        this.parentNode.insertBefore(element, this);
      } else {
        const elements = element instanceof NodeList ? (0, _util.toArray)(element) : element;
        forEach.call(elements, before.bind(this));
      }
    }
  } else {
    _each(this, before, element);
  }
  return this;
};

/**
 * Place element(s) after each element in the collection.
 *
 * @param {String|Node|NodeList|Object} element What to place as sibling(s) after to the element(s). Clones elements as necessary.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.items').after('<span>suf</span><span>fix</span>');
 */

const after = exports.after = function (element) {
  if (this instanceof Node) {
    if (typeof element === 'string') {
      this.insertAdjacentHTML('afterend', element);
    } else {
      if (element instanceof Node) {
        this.parentNode.insertBefore(element, this.nextSibling);
      } else {
        const elements = element instanceof NodeList ? (0, _util.toArray)(element) : element;
        forEach.call(elements.reverse(), after.bind(this));
      }
    }
  } else {
    _each(this, after, element);
  }
  return this;
};

/**
 * Clone a wrapped object.
 *
 * @return {Object} Wrapped collection of cloned nodes.
 * @example
 *     $(element).clone();
 */

const clone = exports.clone = function () {
  return (0, _index.$)(_clone(this));
};

/**
 * Clone an object
 *
 * @param {String|Node|NodeList|Array} element The element(s) to clone.
 * @return {String|Node|NodeList|Array} The cloned element(s)
 * @private
 */

const _clone = exports._clone = element => {
  if (typeof element === 'string') {
    return element;
  } else if (element instanceof Node) {
    return element.cloneNode(true);
  } else if ('length' in element) {
    return [].map.call(element, el => el.cloneNode(true));
  }
  return element;
};

/**
 * Specialized iteration, applying `fn` in reversed manner to a clone of each element, but the provided one.
 *
 * @param {NodeList|Array} collection
 * @param {Function} fn
 * @param {Node} element
 * @private
 */

const _each = exports._each = (collection, fn, element) => {
  let l = collection.length;
  while (l--) {
    const elm = l === 0 ? element : _clone(element);
    fn.call(collection[l], elm);
  }
};
},{"../util":"../../node_modules/domtastic/src/util.js","../selector/index":"../../node_modules/domtastic/src/selector/index.js"}],"../../node_modules/domtastic/src/dom/attr.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeAttr = exports.attr = undefined;

var _util = require('../util');

/**
 * Get the value of an attribute for the first element, or set one or more attributes for each element in the collection.
 *
 * @param {String|Object} key The name of the attribute to get or set. Or an object containing key-value pairs to set as attributes.
 * @param {String} [value] The value of the attribute to set.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').attr('attrName'); // get
 *     $('.item').attr('attrName', 'attrValue'); // set
 *     $('.item').attr({attr1: 'value1', 'attr-2': 'value2'}); // set multiple
 */

const attr = exports.attr = function (key, value) {

  if (typeof key === 'string' && typeof value === 'undefined') {
    const element = this.nodeType ? this : this[0];
    return element ? element.getAttribute(key) : undefined;
  }

  return (0, _util.each)(this, element => {
    if (typeof key === 'object') {
      for (let attr in key) {
        element.setAttribute(attr, key[attr]);
      }
    } else {
      element.setAttribute(key, value);
    }
  });
};

/**
 * Remove attribute from each element in the collection.
 *
 * @param {String} key Attribute name
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.items').removeAttr('attrName');
 */

/**
 * @module Attr
 */

const removeAttr = exports.removeAttr = function (key) {
  return (0, _util.each)(this, element => element.removeAttribute(key));
};
},{"../util":"../../node_modules/domtastic/src/util.js"}],"../../node_modules/domtastic/src/dom/class.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasClass = exports.toggleClass = exports.removeClass = exports.addClass = undefined;

var _util = require('../util');

/**
 * Add a class to the element(s)
 *
 * @param {String} value Space-separated class name(s) to add to the element(s).
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').addClass('bar');
 *     $('.item').addClass('bar foo');
 */

const addClass = exports.addClass = function (value) {
  if (value && value.length) {
    (0, _util.each)(value.split(' '), _each.bind(this, 'add'));
  }
  return this;
};

/**
 * Remove a class from the element(s)
 *
 * @param {String} value Space-separated class name(s) to remove from the element(s).
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.items').removeClass('bar');
 *     $('.items').removeClass('bar foo');
 */

/**
 * @module Class
 */

const removeClass = exports.removeClass = function (value) {
  if (value && value.length) {
    (0, _util.each)(value.split(' '), _each.bind(this, 'remove'));
  }
  return this;
};

/**
 * Toggle a class at the element(s)
 *
 * @param {String} value Space-separated class name(s) to toggle at the element(s).
 * @param {Boolean} [state] A Boolean value to determine whether the class should be added or removed.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').toggleClass('bar');
 *     $('.item').toggleClass('bar foo');
 *     $('.item').toggleClass('bar', true);
 */

const toggleClass = exports.toggleClass = function (value, state) {
  if (value && value.length) {
    const action = typeof state === 'boolean' ? state ? 'add' : 'remove' : 'toggle';
    (0, _util.each)(value.split(' '), _each.bind(this, action));
  }
  return this;
};

/**
 * Check if the element(s) have a class.
 *
 * @param {String} value Check if the DOM element contains the class name. When applied to multiple elements,
 * returns `true` if _any_ of them contains the class name.
 * @return {Boolean} Whether the element's class attribute contains the class name.
 * @example
 *     $('.item').hasClass('bar');
 */

const hasClass = exports.hasClass = function (value) {
  return (this.nodeType ? [this] : this).some(element => element.classList.contains(value));
};

/**
 * Specialized iteration, applying `fn` of the classList API to each element.
 *
 * @param {String} fnName
 * @param {String} className
 * @private
 */

const _each = function (fnName, className) {
  return (0, _util.each)(this, element => element.classList[fnName](className));
};
},{"../util":"../../node_modules/domtastic/src/util.js"}],"../../node_modules/domtastic/src/dom/contains.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @module contains
 */

/**
 * Test whether an element contains another element in the DOM.
 *
 * @param {Element} container The element that may contain the other element.
 * @param {Element} element The element that may be a descendant of the other element.
 * @return {Boolean} Whether the `container` element contains the `element`.
 * @example
 *     $.contains(parentElement, childElement); // true/false
 */

const contains = exports.contains = (container, element) => {
  if (!container || !element || container === element) {
    return false;
  } else if (container.contains) {
    return container.contains(element);
  } else if (container.compareDocumentPosition) {
    return !(container.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_DISCONNECTED);
  }
  return false;
};
},{}],"../../node_modules/domtastic/src/dom/data.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prop = exports.data = undefined;

var _util = require('../util');

const isSupportsDataSet = typeof document !== 'undefined' && 'dataset' in document.documentElement; /**
                                                                                                     * @module Data
                                                                                                     */

const DATAKEYPROP = isSupportsDataSet ? 'dataset' : '__DOMTASTIC_DATA__';

const camelize = str => str.replace(/-+(.)?/g, (match, char) => char ? char.toUpperCase() : '');

/**
 * Get data from first element, or set data for each element in the collection.
 *
 * @param {String} key The key for the data to get or set.
 * @param {String} [value] The data to set.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').data('attrName'); // get
 *     $('.item').data('attrName', {any: 'data'}); // set
 */

const data = exports.data = function (key, value) {

  if (typeof key === 'string' && typeof value === 'undefined') {
    const element = this.nodeType ? this : this[0];
    return element && DATAKEYPROP in element ? element[DATAKEYPROP][camelize(key)] : undefined;
  }

  return (0, _util.each)(this, element => {
    if (!isSupportsDataSet) {
      element[DATAKEYPROP] = element[DATAKEYPROP] || {};
    }

    element[DATAKEYPROP][camelize(key)] = value;
  });
};

/**
 * Get property from first element, or set property on each element in the collection.
 *
 * @param {String} key The name of the property to get or set.
 * @param {String} [value] The value of the property to set.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').prop('attrName'); // get
 *     $('.item').prop('attrName', 'attrValue'); // set
 */

const prop = exports.prop = function (key, value) {

  if (typeof key === 'string' && typeof value === 'undefined') {
    const element = this.nodeType ? this : this[0];
    return element && element ? element[key] : undefined;
  }

  return (0, _util.each)(this, element => element[key] = value);
};
},{"../util":"../../node_modules/domtastic/src/util.js"}],"../../node_modules/domtastic/src/dom/extra.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.val = exports.text = exports.replaceWith = exports.remove = exports.empty = exports.appendTo = undefined;

var _util = require('../util');

var _index = require('./index');

var _index2 = require('../selector/index');

/**
 * Append each element in the collection to the specified element(s).
 *
 * @param {Node|NodeList|Object} element What to append the element(s) to. Clones elements as necessary.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').appendTo(container);
 */

const appendTo = exports.appendTo = function (element) {
  const context = typeof element === 'string' ? (0, _index2.$)(element) : element;
  _index.append.call(context, this);
  return this;
};

/*
 * Empty each element in the collection.
 *
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').empty();
 */

/**
 * @module DOM (extra)
 */

const empty = exports.empty = function () {
  return (0, _util.each)(this, element => element.innerHTML = '');
};

/**
 * Remove the collection from the DOM.
 *
 * @return {Array} Array containing the removed elements
 * @example
 *     $('.item').remove();
 */

const remove = exports.remove = function () {
  return (0, _util.each)(this, element => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
};

/**
 * Replace each element in the collection with the provided new content, and return the array of elements that were replaced.
 *
 * @return {Array} Array containing the replaced elements
 */

const replaceWith = exports.replaceWith = function () {
  return _index.before.apply(this, arguments).remove();
};

/**
 * Get the `textContent` from the first, or set the `textContent` of each element in the collection.
 *
 * @param {String} [value]
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').text('New content');
 */

const text = exports.text = function (value) {

  if (value === undefined) {
    return this[0].textContent;
  }

  return (0, _util.each)(this, element => element.textContent = '' + value);
};

/**
 * Get the `value` from the first, or set the `value` of each element in the collection.
 *
 * @param {String} [value]
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('input.firstName').val('New value');
 */

const val = exports.val = function (value) {

  if (value === undefined) {
    return this.length > 0 ? this[0].value : undefined;
  }

  return (0, _util.each)(this, element => element.value = value);
};
},{"../util":"../../node_modules/domtastic/src/util.js","./index":"../../node_modules/domtastic/src/dom/index.js","../selector/index":"../../node_modules/domtastic/src/selector/index.js"}],"../../node_modules/domtastic/src/dom/html.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = undefined;

var _util = require('../util');

/*
 * Get the HTML contents of the first element, or set the HTML contents for each element in the collection.
 *
 * @param {String} [fragment] HTML fragment to set for the element. If this argument is omitted, the HTML contents are returned.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').html();
 *     $('.item').html('<span>more</span>');
 */

const html = exports.html = function (fragment) {

  if (fragment === undefined) {
    const element = this.nodeType ? this : this[0];
    return element ? element.innerHTML : undefined;
  }

  return (0, _util.each)(this, element => element.innerHTML = fragment);
}; /**
    * @module HTML
    */
},{"../util":"../../node_modules/domtastic/src/util.js"}],"../../node_modules/domtastic/src/selector/closest.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closest = undefined;

var _index = require('./index');

var _util = require('../util');

/**
 * Return the closest element matching the selector (starting by itself) for each element in the collection.
 *
 * @param {String} selector Filter
 * @param {Object} [context] If provided, matching elements must be a descendant of this element
 * @return {Object} New wrapped collection (containing zero or one element)
 * @chainable
 * @example
 *     $('.selector').closest('.container');
 */

/**
 * @module closest
 */

const closest = exports.closest = (() => {

  const closest = function (selector, context) {
    const nodes = [];
    (0, _util.each)(this, node => {
      while (node && node !== context) {
        if ((0, _index.matches)(node, selector)) {
          nodes.push(node);
          break;
        }
        node = node.parentElement;
      }
    });
    return (0, _index.$)((0, _util.uniq)(nodes));
  };

  return typeof Element === 'undefined' || !Element.prototype.closest ? closest : function (selector, context) {
    if (!context) {
      const nodes = [];
      (0, _util.each)(this, node => {
        const n = node.closest(selector);
        if (n) {
          nodes.push(n);
        }
      });
      return (0, _index.$)((0, _util.uniq)(nodes));
    } else {
      return closest.call(this, selector, context);
    }
  };
})();
},{"./index":"../../node_modules/domtastic/src/selector/index.js","../util":"../../node_modules/domtastic/src/util.js"}],"../../node_modules/domtastic/src/event/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unbind = exports.bind = exports.delegateHandler = exports.proxyHandler = exports.clearHandlers = exports.getHandlers = exports.one = exports.off = exports.on = undefined;

var _util = require('../util');

var _closest = require('../selector/closest');

/**
 * Shorthand for `addEventListener`. Supports event delegation if a filter (`selector`) is provided.
 *
 * @param {String} eventNames List of space-separated event types to be added to the element(s)
 * @param {String} [selector] Selector to filter descendants that delegate the event to this element.
 * @param {Function} handler Event handler
 * @param {Boolean} useCapture=false
 * @param {Boolean} once=false
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').on('click', callback);
 *     $('.container').on('click focus', '.item', handler);
 */

/**
 * @module Events
 */

const on = exports.on = function (eventNames, selector, handler, useCapture, once) {

  if (typeof selector === 'function') {
    handler = selector;
    selector = null;
  }

  let parts, namespace, eventListener;

  eventNames.split(' ').forEach(eventName => {

    parts = eventName.split('.');
    eventName = parts[0] || null;
    namespace = parts[1] || null;

    eventListener = proxyHandler(handler);

    (0, _util.each)(this, element => {

      if (selector) {
        eventListener = delegateHandler.bind(element, selector, eventListener);
      }

      if (once) {
        const listener = eventListener;
        eventListener = event => {
          off.call(element, eventNames, selector, handler, useCapture);
          listener.call(element, event);
        };
      }

      element.addEventListener(eventName, eventListener, useCapture || false);

      getHandlers(element).push({
        eventName,
        handler,
        eventListener,
        selector,
        namespace
      });
    });
  }, this);

  return this;
};

/**
 * Shorthand for `removeEventListener`.
 *
 * @param {String} eventNames List of space-separated event types to be removed from the element(s)
 * @param {String} [selector] Selector to filter descendants that undelegate the event to this element.
 * @param {Function} handler Event handler
 * @param {Boolean} useCapture=false
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').off('click', callback);
 *     $('#my-element').off('myEvent myOtherEvent');
 *     $('.item').off();
 */

const off = exports.off = function (eventNames = '', selector, handler, useCapture) {

  if (typeof selector === 'function') {
    handler = selector;
    selector = null;
  }

  let parts, namespace, handlers;

  eventNames.split(' ').forEach(eventName => {

    parts = eventName.split('.');
    eventName = parts[0] || null;
    namespace = parts[1] || null;

    return (0, _util.each)(this, element => {

      handlers = getHandlers(element);

      (0, _util.each)(handlers.filter(item => {
        return (!eventName || item.eventName === eventName) && (!namespace || item.namespace === namespace) && (!handler || item.handler === handler) && (!selector || item.selector === selector);
      }), item => {
        element.removeEventListener(item.eventName, item.eventListener, useCapture || false);
        handlers.splice(handlers.indexOf(item), 1);
      });

      if (!eventName && !namespace && !selector && !handler) {
        clearHandlers(element);
      } else if (handlers.length === 0) {
        clearHandlers(element);
      }
    });
  }, this);

  return this;
};

/**
 * Add event listener and execute the handler at most once per element.
 *
 * @param eventNames
 * @param selector
 * @param handler
 * @param useCapture
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').one('click', callback);
 */

const one = exports.one = function (eventNames, selector, handler, useCapture) {
  return on.call(this, eventNames, selector, handler, useCapture, 1);
};

/**
 * Get event handlers from an element
 *
 * @private
 * @param {Node} element
 * @return {Array}
 */

const eventKeyProp = '__domtastic_event__';
let id = 1;
let handlers = {};
let unusedKeys = [];

const getHandlers = exports.getHandlers = element => {
  if (!element[eventKeyProp]) {
    element[eventKeyProp] = unusedKeys.length === 0 ? ++id : unusedKeys.pop();
  }
  const key = element[eventKeyProp];
  return handlers[key] || (handlers[key] = []);
};

/**
 * Clear event handlers for an element
 *
 * @private
 * @param {Node} element
 */

const clearHandlers = exports.clearHandlers = element => {
  const key = element[eventKeyProp];
  if (handlers[key]) {
    handlers[key] = null;
    element[eventKeyProp] = null;
    unusedKeys.push(key);
  }
};

/**
 * Function to create a handler that augments the event object with some extra methods,
 * and executes the callback with the event and the event data (i.e. `event.detail`).
 *
 * @private
 * @param handler Callback to execute as `handler(event, data)`
 * @return {Function}
 */

const proxyHandler = exports.proxyHandler = handler => function (event) {
  return handler.call(this, augmentEvent(event));
};

const eventMethods = {
  preventDefault: 'isDefaultPrevented',
  stopImmediatePropagation: 'isImmediatePropagationStopped',
  stopPropagation: 'isPropagationStopped'
};
const returnTrue = () => true;
const returnFalse = () => false;

/**
 * Attempt to augment events and implement something closer to DOM Level 3 Events.
 *
 * @private
 * @param {Object} event
 * @return {Function}
 */

const augmentEvent = event => {
  if (!event.isDefaultPrevented || event.stopImmediatePropagation || event.stopPropagation) {
    for (const methodName in eventMethods) {
      (function (methodName, testMethodName, originalMethod) {
        event[methodName] = function () {
          this[testMethodName] = returnTrue;
          return originalMethod && originalMethod.apply(this, arguments);
        };
        event[testMethodName] = returnFalse;
      })(methodName, eventMethods[methodName], event[methodName]);
    }
    if (event._preventDefault) {
      event.preventDefault();
    }
  }
  return event;
};

/**
 * Function to test whether delegated events match the provided `selector` (filter),
 * if the event propagation was stopped, and then actually call the provided event handler.
 * Use `this` instead of `event.currentTarget` on the event object.
 *
 * @private
 * @param {String} selector Selector to filter descendants that undelegate the event to this element.
 * @param {Function} handler Event handler
 * @param {Event} event
 */

const delegateHandler = exports.delegateHandler = function (selector, handler, event) {
  const eventTarget = event._target || event.target;
  const currentTarget = _closest.closest.call([eventTarget], selector, this)[0];
  if (currentTarget && currentTarget !== this) {
    if (currentTarget === eventTarget || !(event.isPropagationStopped && event.isPropagationStopped())) {
      handler.call(currentTarget, event);
    }
  }
};

const bind = exports.bind = on;
const unbind = exports.unbind = off;
},{"../util":"../../node_modules/domtastic/src/util.js","../selector/closest":"../../node_modules/domtastic/src/selector/closest.js"}],"../../node_modules/domtastic/src/event/trigger.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.triggerHandler = exports.trigger = undefined;

var _util = require('../util');

var _contains = require('../dom/contains');

/**
 * @module trigger
 */

const reMouseEvent = /^(mouse(down|up|over|out|enter|leave|move)|contextmenu|(dbl)?click)$/;
const reKeyEvent = /^key(down|press|up)$/;

/**
 * Trigger event at element(s)
 *
 * @param {String} type Type of the event
 * @param {Object} data Data to be sent with the event (`params.detail` will be set to this).
 * @param {Object} [params] Event parameters (optional)
 * @param {Boolean} params.bubbles=true Does the event bubble up through the DOM or not.
 * @param {Boolean} params.cancelable=true Is the event cancelable or not.
 * @param {Mixed} params.detail=undefined Additional information about the event.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').trigger('anyEventType');
 */

const trigger = exports.trigger = function (type, data, { bubbles = true, cancelable = true, preventDefault = false } = {}) {

  const EventConstructor = getEventConstructor(type);
  const event = new EventConstructor(type, {
    bubbles,
    cancelable,
    preventDefault,
    detail: data
  });

  event._preventDefault = preventDefault;

  return (0, _util.each)(this, element => {
    if (!bubbles || isEventBubblingInDetachedTree || isAttachedToDocument(element)) {
      dispatchEvent(element, event);
    } else {
      triggerForPath(element, type, {
        bubbles,
        cancelable,
        preventDefault,
        detail: data
      });
    }
  });
};

const getEventConstructor = type => isSupportsOtherEventConstructors ? reMouseEvent.test(type) ? MouseEvent : reKeyEvent.test(type) ? KeyboardEvent : CustomEvent : CustomEvent;

/**
 * Trigger event at first element in the collection. Similar to `trigger()`, except:
 *
 * - Event does not bubble
 * - Default event behavior is prevented
 * - Only triggers handler for first matching element
 *
 * @param {String} type Type of the event
 * @param {Object} data Data to be sent with the event
 * @example
 *     $('form').triggerHandler('submit');
 */

const triggerHandler = exports.triggerHandler = function (type, data) {
  if (this[0]) {
    trigger.call(this[0], type, data, {
      bubbles: false,
      preventDefault: true
    });
  }
};

/**
 * Check whether the element is attached to or detached from) the document
 *
 * @private
 * @param {Node} element Element to test
 * @return {Boolean}
 */

const isAttachedToDocument = element => {
  if (element === window || element === document) {
    return true;
  }
  return (0, _contains.contains)(element.ownerDocument.documentElement, element);
};

/**
 * Dispatch the event at the element and its ancestors.
 * Required to support delegated events in browsers that don't bubble events in detached DOM trees.
 *
 * @private
 * @param {Node} element First element to dispatch the event at
 * @param {String} type Type of the event
 * @param {Object} [params] Event parameters (optional)
 * @param {Boolean} params.bubbles=true Does the event bubble up through the DOM or not.
 * Will be set to false (but shouldn't matter since events don't bubble anyway).
 * @param {Boolean} params.cancelable=true Is the event cancelable or not.
 * @param {Mixed} params.detail=undefined Additional information about the event.
 */

const triggerForPath = (element, type, params = {}) => {
  params.bubbles = false;
  const event = new CustomEvent(type, params);
  event._target = element;
  do {
    dispatchEvent(element, event);
  } while (element = element.parentNode); // eslint-disable-line no-cond-assign
};

/**
 * Dispatch event to element, but call direct event methods instead if available
 * (e.g. "blur()", "submit()") and if the event is non-cancelable.
 *
 * @private
 * @param {Node} element Element to dispatch the event at
 * @param {Object} event Event to dispatch
 */

const directEventMethods = ['blur', 'focus', 'select', 'submit'];

const dispatchEvent = (element, event) => {
  if (directEventMethods.indexOf(event.type) !== -1 && typeof element[event.type] === 'function' && !event._preventDefault && !event.cancelable) {
    element[event.type]();
  } else {
    element.dispatchEvent(event);
  }
};

/**
 * Polyfill for CustomEvent, borrowed from [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill).
 * Needed to support IE (9, 10, 11) & PhantomJS
 */

(() => {
  const CustomEvent = function (event, params = {
    bubbles: false,
    cancelable: false,
    detail: undefined
  }) {
    let customEvent = document.createEvent('CustomEvent');
    customEvent.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return customEvent;
  };

  CustomEvent.prototype = _util.win.CustomEvent && _util.win.CustomEvent.prototype;
  _util.win.CustomEvent = CustomEvent;
})();

/*
 * Are events bubbling in detached DOM trees?
 * @private
 */

const isEventBubblingInDetachedTree = (() => {
  let isBubbling = false;
  const doc = _util.win.document;
  if (doc) {
    const parent = doc.createElement('div');
    const child = parent.cloneNode();
    parent.appendChild(child);
    parent.addEventListener('e', function () {
      isBubbling = true;
    });
    child.dispatchEvent(new CustomEvent('e', { bubbles: true }));
  }
  return isBubbling;
})();

const isSupportsOtherEventConstructors = (() => {
  try {
    new MouseEvent('click');
  } catch (e) {
    return false;
  }
  return true;
})();
},{"../util":"../../node_modules/domtastic/src/util.js","../dom/contains":"../../node_modules/domtastic/src/dom/contains.js"}],"../../node_modules/domtastic/src/event/ready.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @module Ready
 */

/**
 * Execute callback when `DOMContentLoaded` fires for `document`, or immediately if called afterwards.
 *
 * @param handler Callback to execute when initial DOM content is loaded.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $(document).ready(callback);
 */

const ready = exports.ready = function (handler) {
  if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
    handler();
  } else {
    document.addEventListener('DOMContentLoaded', handler, false);
  }
  return this;
};
},{}],"../../node_modules/domtastic/src/noconflict.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noConflict = undefined;

var _util = require('./util');

/*
 * Save the previous value of the global `$` variable, so that it can be restored later on.
 * @private
 */

const previousLib = _util.win.$;

/**
 * In case another library sets the global `$` variable before DOMtastic does,
 * this method can be used to return the global `$` to that other library.
 *
 * @return {Object} Reference to DOMtastic.
 * @example
 *     var domtastic = $.noConflict();
 */

/**
 * @module noConflict
 */

const noConflict = exports.noConflict = function () {
  _util.win.$ = previousLib;
  return this;
};
},{"./util":"../../node_modules/domtastic/src/util.js"}],"../../node_modules/domtastic/src/selector/extra.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.slice = exports.siblings = exports.parent = exports.get = exports.first = exports.eq = exports.contents = exports.concat = exports.children = undefined;

var _util = require('../util');

var _index = require('./index');

/**
 * Return children of each element in the collection, optionally filtered by a selector.
 *
 * @param {String} [selector] Filter
 * @return {Object} New wrapped collection
 * @chainable
 * @example
 *     $('.selector').children();
 *     $('.selector').children('.filter');
 */

/**
 * @module Selector (extra)
 */

const children = exports.children = function (selector) {
  const nodes = [];
  (0, _util.each)(this, element => {
    if (element.children) {
      (0, _util.each)(element.children, child => {
        if (!selector || selector && (0, _index.matches)(child, selector)) {
          nodes.push(child);
        }
      });
    }
  });
  return (0, _index.$)(nodes);
};

/**
 * Add the elements of a wrapped collection to another.
 *
 * @param {String|Node|NodeList|Array} selector Query selector, `Node`, `NodeList`, array of elements, or HTML fragment string.
 * @return {Object} The extended wrapped collection
 * @example
 *     $('.items').concat($('.more-items));
 *     $('.items').concat('.more-items);
 *     $('.items').concat('<div>more</div>');
 */

const concat = exports.concat = function (selector) {
  (0, _util.each)((0, _index.$)(selector), element => {
    if ([].indexOf.call(this, element) === -1) {
      [].push.call(this, element);
    }
  });
  return this;
};

/**
 * Return child nodes of each element in the collection, including text and comment nodes.
 *
 * @return {Object} New wrapped collection
 * @example
 *     $('.selector').contents();
 */

const contents = exports.contents = function () {
  const nodes = [];
  (0, _util.each)(this, element => nodes.push.apply(nodes, (0, _util.toArray)(element.childNodes)));
  return (0, _index.$)(nodes);
};

/**
 * Return a collection containing only the one at the specified index.
 *
 * @param {Number} index
 * @return {Object} New wrapped collection
 * @chainable
 * @example
 *     $('.items').eq(1)
 *     // The second item; result is the same as doing $($('.items')[1]);
 */

const eq = exports.eq = function (index) {
  return slice.call(this, index, index + 1);
};

/**
 * Return a collection containing only the first item.
 *
 * @return {Object} New wrapped collection
 * @chainable
 * @example
 *     $('.items').first()
 *     // The first item; result is the same as doing $($('.items')[0]);
 */

const first = exports.first = function () {
  return slice.call(this, 0, 1);
};

/**
 * Return the DOM element at the specified index.
 *
 * @param {Number} index
 * @return {Node} Element at the specified index
 * @example
 *     $('.items').get(1)
 *     // The second element; result is the same as doing $('.items')[1];
 */

const get = exports.get = function (index) {
  return this[index];
};

/**
 * Return the parent elements of each element in the collection, optionally filtered by a selector.
 *
 * @param {String} [selector] Filter
 * @return {Object} New wrapped collection
 * @chainable
 * @example
 *     $('.selector').parent();
 *     $('.selector').parent('.filter');
 */

const parent = exports.parent = function (selector) {
  const nodes = [];
  (0, _util.each)(this, element => {
    if (!selector || selector && (0, _index.matches)(element.parentNode, selector)) {
      nodes.push(element.parentNode);
    }
  });
  return (0, _index.$)(nodes);
};

/**
 * Return the sibling elements of each element in the collection, optionally filtered by a selector.
 *
 * @param {String} [selector] Filter
 * @return {Object} New wrapped collection
 * @chainable
 * @example
 *     $('.selector').siblings();
 *     $('.selector').siblings('.filter');
 */

const siblings = exports.siblings = function (selector) {
  const nodes = [];
  (0, _util.each)(this, element => (0, _util.each)(element.parentNode.children, sibling => {
    if (sibling !== element && (!selector || selector && (0, _index.matches)(sibling, selector))) {
      nodes.push(sibling);
    }
  }));
  return (0, _index.$)(nodes);
};

/**
 * Create a new, sliced collection.
 *
 * @param {Number} start
 * @param {Number} end
 * @return {Object} New wrapped collection
 * @example
 *     $('.items').slice(1, 3)
 *     // New wrapped collection containing the second, third, and fourth element.
 */

const slice = exports.slice = function (start, end) {
  // eslint-disable-line no-unused-vars
  return (0, _index.$)([].slice.apply(this, arguments));
};
},{"../util":"../../node_modules/domtastic/src/util.js","./index":"../../node_modules/domtastic/src/selector/index.js"}],"../../node_modules/domtastic/src/type.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @module Type
 */

/*
 * Determine if the argument passed is a Javascript function object.
 *
 * @param {Object} [obj] Object to test whether or not it is a function.
 * @return {boolean}
 * @example
 *     $.isFunction(function(){}); // true
 * @example
 *     $.isFunction({}); // false
 */

const isFunction = exports.isFunction = obj => typeof obj === 'function';

/*
 * Determine whether the argument is an array.
 *
 * @param {Object} [obj] Object to test whether or not it is an array.
 * @return {boolean}
 * @example
 *     $.isArray([]); // true
 * @example
 *     $.isArray({}); // false
 */

const isArray = exports.isArray = Array.isArray;
},{}],"../../node_modules/domtastic/src/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util');

var _array = require('./array');

var array = _interopRequireWildcard(_array);

var _baseClass = require('./baseClass');

var _baseClass2 = _interopRequireDefault(_baseClass);

var _css = require('./css');

var css = _interopRequireWildcard(_css);

var _index = require('./dom/index');

var dom = _interopRequireWildcard(_index);

var _attr = require('./dom/attr');

var dom_attr = _interopRequireWildcard(_attr);

var _class = require('./dom/class');

var dom_class = _interopRequireWildcard(_class);

var _contains = require('./dom/contains');

var dom_contains = _interopRequireWildcard(_contains);

var _data = require('./dom/data');

var dom_data = _interopRequireWildcard(_data);

var _extra = require('./dom/extra');

var dom_extra = _interopRequireWildcard(_extra);

var _html = require('./dom/html');

var dom_html = _interopRequireWildcard(_html);

var _index2 = require('./event/index');

var event = _interopRequireWildcard(_index2);

var _trigger = require('./event/trigger');

var event_trigger = _interopRequireWildcard(_trigger);

var _ready = require('./event/ready');

var event_ready = _interopRequireWildcard(_ready);

var _noconflict = require('./noconflict');

var noconflict = _interopRequireWildcard(_noconflict);

var _index3 = require('./selector/index');

var selector = _interopRequireWildcard(_index3);

var _closest = require('./selector/closest');

var selector_closest = _interopRequireWildcard(_closest);

var _extra2 = require('./selector/extra');

var selector_extra = _interopRequireWildcard(_extra2);

var _type = require('./type');

var type = _interopRequireWildcard(_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const api = {}; /**
                 * @module API
                 */

let $ = {};

// Import modules to build up the API

if (typeof selector !== 'undefined') {
  $ = selector.$;
  $.matches = selector.matches;
  api.find = selector.find;
}

(0, _util.extend)($, dom_contains, noconflict, type);
(0, _util.extend)(api, array, css, dom_attr, dom, dom_class, dom_data, dom_extra, dom_html, event, event_trigger, event_ready, selector_closest, selector_extra);

$.fn = api;

// Version

$.version = '__VERSION__';

// Util

$.extend = _util.extend;

// Provide base class to extend from

if (typeof _baseClass2.default !== 'undefined') {
  $.BaseClass = (0, _baseClass2.default)($.fn);
}

// Export interface

exports.default = $;
},{"./util":"../../node_modules/domtastic/src/util.js","./array":"../../node_modules/domtastic/src/array.js","./baseClass":"../../node_modules/domtastic/src/baseClass.js","./css":"../../node_modules/domtastic/src/css.js","./dom/index":"../../node_modules/domtastic/src/dom/index.js","./dom/attr":"../../node_modules/domtastic/src/dom/attr.js","./dom/class":"../../node_modules/domtastic/src/dom/class.js","./dom/contains":"../../node_modules/domtastic/src/dom/contains.js","./dom/data":"../../node_modules/domtastic/src/dom/data.js","./dom/extra":"../../node_modules/domtastic/src/dom/extra.js","./dom/html":"../../node_modules/domtastic/src/dom/html.js","./event/index":"../../node_modules/domtastic/src/event/index.js","./event/trigger":"../../node_modules/domtastic/src/event/trigger.js","./event/ready":"../../node_modules/domtastic/src/event/ready.js","./noconflict":"../../node_modules/domtastic/src/noconflict.js","./selector/index":"../../node_modules/domtastic/src/selector/index.js","./selector/closest":"../../node_modules/domtastic/src/selector/closest.js","./selector/extra":"../../node_modules/domtastic/src/selector/extra.js","./type":"../../node_modules/domtastic/src/type.js"}],"components/tabs.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _domtastic = require('domtastic');

var _domtastic2 = _interopRequireDefault(_domtastic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tabs = function () {
  function Tabs(trigger) {
    _classCallCheck(this, Tabs);

    this.changeTabs(trigger);
    this.listenClick(trigger);
  }

  _createClass(Tabs, [{
    key: 'changeTabs',
    value: function changeTabs(trigger) {
      var context = (0, _domtastic2.default)(trigger);
      var tabActive = context.find('.tab-list__item.active');
      var tab = tabActive.data('tab');

      (0, _domtastic2.default)('.tab-content__item').removeClass('active');
      context.find('.tab-content__item[data-tab="' + tab + '"]').addClass('active');
    }
  }, {
    key: 'listenClick',
    value: function listenClick(trigger) {
      var _this = this;

      var changeTab = function changeTab(trigger) {
        return _this.changeTabs(trigger);
      };

      (0, _domtastic2.default)('.tab-list__item').on('click', function () {
        (0, _domtastic2.default)('.tab-list__item').removeClass('active');
        (0, _domtastic2.default)(this).addClass('active');
        changeTab(trigger);
      });
    }
  }]);

  return Tabs;
}();

exports.default = Tabs;
},{"domtastic":"../../node_modules/domtastic/src/index.js"}],"components/config.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ELECTION = '2022802018';
var STATE = 'SC';

exports.ELECTION = ELECTION;
exports.STATE = STATE;
},{}],"components/api.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPhoto = exports.getList = undefined;

var _config = require('./config');

var makeAPIUrl = function makeAPIUrl(state, type) {
  return 'http://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/listar/2018/' + state + '/' + _config.ELECTION + '/' + type + '/candidatos';
};

var getList = function getList(type) {
  var api = '';

  switch (type) {
    case 'presidente':
      api = makeAPIUrl('BR', '1');
      break;
    case 'governador':
      api = makeAPIUrl(_config.STATE, '3');
      break;
    case 'senador':
      api = makeAPIUrl(_config.STATE, '5');
      break;
    case 'federal':
      api = makeAPIUrl(_config.STATE, '6');
      break;
    case 'estadual':
      api = makeAPIUrl(_config.STATE, '7');
      break;
  }

  return fetch(api).then(function (response) {
    return response.json();
  }); // eslint-disable-line
};

var getPhoto = function getPhoto(id, state) {
  return fetch('http://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/buscar/2018/' + state + '/' + _config.ELECTION + '/candidato/' + id).then(function (response) {
    return response.json();
  }); // eslint-disable-line
};

exports.getList = getList;
exports.getPhoto = getPhoto;
},{"./config":"components/config.js"}],"components/render.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = render;

var _domtastic = require('domtastic');

var _domtastic2 = _interopRequireDefault(_domtastic);

var _api = require('./api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function render() {
  var candidates = (0, _domtastic2.default)('[data-candidate]');

  candidates.each(function (item) {
    var candidateDiv = (0, _domtastic2.default)(item);
    var candidate = candidateDiv.data('candidate');

    candidateDiv.html('<img class="loading" src="assets/img/loading.gif" />');

    (0, _api.getList)(candidate).then(function (res) {
      candidateDiv.html(renderCandidates(res.candidatos, res.unidadeEleitoral.sigla));
    });
  });
}

var renderCandidates = function renderCandidates(data, state) {
  var renderized = '';

  data.map(function (item) {
    if (item.descricaoSituacao === 'Deferido') {
      renderized += '\n        <div class="candidate-item">\n          <div class="candidate-item-column__photo">\n            <img class="candidate-item__photo" data-photo-candidate="' + item.id + '" />\n          </div>\n          <div class="candidate-item-column__content">\n            <span class="candidate-item__number">' + item.numero + '</span>\n            <h3 class="candidate-item__name">' + item.nomeUrna + ' <span</h3>\n            <p class="candidate-item__coalition">' + item.partido.sigla + ' \u2022 ' + item.nomeColigacao + '</p>\n          </div>\n        </div>\n      ';
    }

    (0, _api.getPhoto)(item.id, state).then(function (res) {
      (0, _domtastic2.default)('[data-photo-candidate="' + res.id + '"]').attr('src', res.fotoUrl);
    });
  });

  return renderized;
};
},{"domtastic":"../../node_modules/domtastic/src/index.js","./api":"components/api.js"}],"main.js":[function(require,module,exports) {
'use strict';

var _tabs = require('./components/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _render = require('./components/render');

var _render2 = _interopRequireDefault(_render);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _tabs2.default('.tabs'); // eslint-disable-line
(0, _render2.default)();
},{"./components/tabs":"components/tabs.js","./components/render":"components/render.js"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '59966' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.map