
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn) {
	  var module = { exports: {} };
		return fn(module, module.exports), module.exports;
	}

	/* @preserve
	 * Leaflet 1.7.1, a JS library for interactive maps. http://leafletjs.com
	 * (c) 2010-2019 Vladimir Agafonkin, (c) 2010-2011 CloudMade
	 */

	var leafletSrc = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	  factory(exports) ;
	}(commonjsGlobal, (function (exports) {
	  var version = "1.7.1";

	  /*
	   * @namespace Util
	   *
	   * Various utility functions, used by Leaflet internally.
	   */

	  // @function extend(dest: Object, src?: Object): Object
	  // Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter. Has an `L.extend` shortcut.
	  function extend(dest) {
	  	var i, j, len, src;

	  	for (j = 1, len = arguments.length; j < len; j++) {
	  		src = arguments[j];
	  		for (i in src) {
	  			dest[i] = src[i];
	  		}
	  	}
	  	return dest;
	  }

	  // @function create(proto: Object, properties?: Object): Object
	  // Compatibility polyfill for [Object.create](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
	  var create = Object.create || (function () {
	  	function F() {}
	  	return function (proto) {
	  		F.prototype = proto;
	  		return new F();
	  	};
	  })();

	  // @function bind(fn: Function, …): Function
	  // Returns a new function bound to the arguments passed, like [Function.prototype.bind](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
	  // Has a `L.bind()` shortcut.
	  function bind(fn, obj) {
	  	var slice = Array.prototype.slice;

	  	if (fn.bind) {
	  		return fn.bind.apply(fn, slice.call(arguments, 1));
	  	}

	  	var args = slice.call(arguments, 2);

	  	return function () {
	  		return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
	  	};
	  }

	  // @property lastId: Number
	  // Last unique ID used by [`stamp()`](#util-stamp)
	  var lastId = 0;

	  // @function stamp(obj: Object): Number
	  // Returns the unique ID of an object, assigning it one if it doesn't have it.
	  function stamp(obj) {
	  	/*eslint-disable */
	  	obj._leaflet_id = obj._leaflet_id || ++lastId;
	  	return obj._leaflet_id;
	  	/* eslint-enable */
	  }

	  // @function throttle(fn: Function, time: Number, context: Object): Function
	  // Returns a function which executes function `fn` with the given scope `context`
	  // (so that the `this` keyword refers to `context` inside `fn`'s code). The function
	  // `fn` will be called no more than one time per given amount of `time`. The arguments
	  // received by the bound function will be any arguments passed when binding the
	  // function, followed by any arguments passed when invoking the bound function.
	  // Has an `L.throttle` shortcut.
	  function throttle(fn, time, context) {
	  	var lock, args, wrapperFn, later;

	  	later = function () {
	  		// reset lock and call if queued
	  		lock = false;
	  		if (args) {
	  			wrapperFn.apply(context, args);
	  			args = false;
	  		}
	  	};

	  	wrapperFn = function () {
	  		if (lock) {
	  			// called too soon, queue to call later
	  			args = arguments;

	  		} else {
	  			// call and lock until later
	  			fn.apply(context, arguments);
	  			setTimeout(later, time);
	  			lock = true;
	  		}
	  	};

	  	return wrapperFn;
	  }

	  // @function wrapNum(num: Number, range: Number[], includeMax?: Boolean): Number
	  // Returns the number `num` modulo `range` in such a way so it lies within
	  // `range[0]` and `range[1]`. The returned value will be always smaller than
	  // `range[1]` unless `includeMax` is set to `true`.
	  function wrapNum(x, range, includeMax) {
	  	var max = range[1],
	  	    min = range[0],
	  	    d = max - min;
	  	return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
	  }

	  // @function falseFn(): Function
	  // Returns a function which always returns `false`.
	  function falseFn() { return false; }

	  // @function formatNum(num: Number, digits?: Number): Number
	  // Returns the number `num` rounded to `digits` decimals, or to 6 decimals by default.
	  function formatNum(num, digits) {
	  	var pow = Math.pow(10, (digits === undefined ? 6 : digits));
	  	return Math.round(num * pow) / pow;
	  }

	  // @function trim(str: String): String
	  // Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
	  function trim(str) {
	  	return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
	  }

	  // @function splitWords(str: String): String[]
	  // Trims and splits the string on whitespace and returns the array of parts.
	  function splitWords(str) {
	  	return trim(str).split(/\s+/);
	  }

	  // @function setOptions(obj: Object, options: Object): Object
	  // Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `L.setOptions` shortcut.
	  function setOptions(obj, options) {
	  	if (!Object.prototype.hasOwnProperty.call(obj, 'options')) {
	  		obj.options = obj.options ? create(obj.options) : {};
	  	}
	  	for (var i in options) {
	  		obj.options[i] = options[i];
	  	}
	  	return obj.options;
	  }

	  // @function getParamString(obj: Object, existingUrl?: String, uppercase?: Boolean): String
	  // Converts an object into a parameter URL string, e.g. `{a: "foo", b: "bar"}`
	  // translates to `'?a=foo&b=bar'`. If `existingUrl` is set, the parameters will
	  // be appended at the end. If `uppercase` is `true`, the parameter names will
	  // be uppercased (e.g. `'?A=foo&B=bar'`)
	  function getParamString(obj, existingUrl, uppercase) {
	  	var params = [];
	  	for (var i in obj) {
	  		params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
	  	}
	  	return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
	  }

	  var templateRe = /\{ *([\w_-]+) *\}/g;

	  // @function template(str: String, data: Object): String
	  // Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'`
	  // and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
	  // `('Hello foo, bar')`. You can also specify functions instead of strings for
	  // data values — they will be evaluated passing `data` as an argument.
	  function template(str, data) {
	  	return str.replace(templateRe, function (str, key) {
	  		var value = data[key];

	  		if (value === undefined) {
	  			throw new Error('No value provided for variable ' + str);

	  		} else if (typeof value === 'function') {
	  			value = value(data);
	  		}
	  		return value;
	  	});
	  }

	  // @function isArray(obj): Boolean
	  // Compatibility polyfill for [Array.isArray](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
	  var isArray = Array.isArray || function (obj) {
	  	return (Object.prototype.toString.call(obj) === '[object Array]');
	  };

	  // @function indexOf(array: Array, el: Object): Number
	  // Compatibility polyfill for [Array.prototype.indexOf](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
	  function indexOf(array, el) {
	  	for (var i = 0; i < array.length; i++) {
	  		if (array[i] === el) { return i; }
	  	}
	  	return -1;
	  }

	  // @property emptyImageUrl: String
	  // Data URI string containing a base64-encoded empty GIF image.
	  // Used as a hack to free memory from unused images on WebKit-powered
	  // mobile devices (by setting image `src` to this string).
	  var emptyImageUrl = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

	  // inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

	  function getPrefixed(name) {
	  	return window['webkit' + name] || window['moz' + name] || window['ms' + name];
	  }

	  var lastTime = 0;

	  // fallback for IE 7-8
	  function timeoutDefer(fn) {
	  	var time = +new Date(),
	  	    timeToCall = Math.max(0, 16 - (time - lastTime));

	  	lastTime = time + timeToCall;
	  	return window.setTimeout(fn, timeToCall);
	  }

	  var requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer;
	  var cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') ||
	  		getPrefixed('CancelRequestAnimationFrame') || function (id) { window.clearTimeout(id); };

	  // @function requestAnimFrame(fn: Function, context?: Object, immediate?: Boolean): Number
	  // Schedules `fn` to be executed when the browser repaints. `fn` is bound to
	  // `context` if given. When `immediate` is set, `fn` is called immediately if
	  // the browser doesn't have native support for
	  // [`window.requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame),
	  // otherwise it's delayed. Returns a request ID that can be used to cancel the request.
	  function requestAnimFrame(fn, context, immediate) {
	  	if (immediate && requestFn === timeoutDefer) {
	  		fn.call(context);
	  	} else {
	  		return requestFn.call(window, bind(fn, context));
	  	}
	  }

	  // @function cancelAnimFrame(id: Number): undefined
	  // Cancels a previous `requestAnimFrame`. See also [window.cancelAnimationFrame](https://developer.mozilla.org/docs/Web/API/window/cancelAnimationFrame).
	  function cancelAnimFrame(id) {
	  	if (id) {
	  		cancelFn.call(window, id);
	  	}
	  }

	  var Util = ({
	    extend: extend,
	    create: create,
	    bind: bind,
	    lastId: lastId,
	    stamp: stamp,
	    throttle: throttle,
	    wrapNum: wrapNum,
	    falseFn: falseFn,
	    formatNum: formatNum,
	    trim: trim,
	    splitWords: splitWords,
	    setOptions: setOptions,
	    getParamString: getParamString,
	    template: template,
	    isArray: isArray,
	    indexOf: indexOf,
	    emptyImageUrl: emptyImageUrl,
	    requestFn: requestFn,
	    cancelFn: cancelFn,
	    requestAnimFrame: requestAnimFrame,
	    cancelAnimFrame: cancelAnimFrame
	  });

	  // @class Class
	  // @aka L.Class

	  // @section
	  // @uninheritable

	  // Thanks to John Resig and Dean Edwards for inspiration!

	  function Class() {}

	  Class.extend = function (props) {

	  	// @function extend(props: Object): Function
	  	// [Extends the current class](#class-inheritance) given the properties to be included.
	  	// Returns a Javascript function that is a class constructor (to be called with `new`).
	  	var NewClass = function () {

	  		// call the constructor
	  		if (this.initialize) {
	  			this.initialize.apply(this, arguments);
	  		}

	  		// call all constructor hooks
	  		this.callInitHooks();
	  	};

	  	var parentProto = NewClass.__super__ = this.prototype;

	  	var proto = create(parentProto);
	  	proto.constructor = NewClass;

	  	NewClass.prototype = proto;

	  	// inherit parent's statics
	  	for (var i in this) {
	  		if (Object.prototype.hasOwnProperty.call(this, i) && i !== 'prototype' && i !== '__super__') {
	  			NewClass[i] = this[i];
	  		}
	  	}

	  	// mix static properties into the class
	  	if (props.statics) {
	  		extend(NewClass, props.statics);
	  		delete props.statics;
	  	}

	  	// mix includes into the prototype
	  	if (props.includes) {
	  		checkDeprecatedMixinEvents(props.includes);
	  		extend.apply(null, [proto].concat(props.includes));
	  		delete props.includes;
	  	}

	  	// merge options
	  	if (proto.options) {
	  		props.options = extend(create(proto.options), props.options);
	  	}

	  	// mix given properties into the prototype
	  	extend(proto, props);

	  	proto._initHooks = [];

	  	// add method for calling all hooks
	  	proto.callInitHooks = function () {

	  		if (this._initHooksCalled) { return; }

	  		if (parentProto.callInitHooks) {
	  			parentProto.callInitHooks.call(this);
	  		}

	  		this._initHooksCalled = true;

	  		for (var i = 0, len = proto._initHooks.length; i < len; i++) {
	  			proto._initHooks[i].call(this);
	  		}
	  	};

	  	return NewClass;
	  };


	  // @function include(properties: Object): this
	  // [Includes a mixin](#class-includes) into the current class.
	  Class.include = function (props) {
	  	extend(this.prototype, props);
	  	return this;
	  };

	  // @function mergeOptions(options: Object): this
	  // [Merges `options`](#class-options) into the defaults of the class.
	  Class.mergeOptions = function (options) {
	  	extend(this.prototype.options, options);
	  	return this;
	  };

	  // @function addInitHook(fn: Function): this
	  // Adds a [constructor hook](#class-constructor-hooks) to the class.
	  Class.addInitHook = function (fn) { // (Function) || (String, args...)
	  	var args = Array.prototype.slice.call(arguments, 1);

	  	var init = typeof fn === 'function' ? fn : function () {
	  		this[fn].apply(this, args);
	  	};

	  	this.prototype._initHooks = this.prototype._initHooks || [];
	  	this.prototype._initHooks.push(init);
	  	return this;
	  };

	  function checkDeprecatedMixinEvents(includes) {
	  	if (typeof L === 'undefined' || !L || !L.Mixin) { return; }

	  	includes = isArray(includes) ? includes : [includes];

	  	for (var i = 0; i < includes.length; i++) {
	  		if (includes[i] === L.Mixin.Events) {
	  			console.warn('Deprecated include of L.Mixin.Events: ' +
	  				'this property will be removed in future releases, ' +
	  				'please inherit from L.Evented instead.', new Error().stack);
	  		}
	  	}
	  }

	  /*
	   * @class Evented
	   * @aka L.Evented
	   * @inherits Class
	   *
	   * A set of methods shared between event-powered classes (like `Map` and `Marker`). Generally, events allow you to execute some function when something happens with an object (e.g. the user clicks on the map, causing the map to fire `'click'` event).
	   *
	   * @example
	   *
	   * ```js
	   * map.on('click', function(e) {
	   * 	alert(e.latlng);
	   * } );
	   * ```
	   *
	   * Leaflet deals with event listeners by reference, so if you want to add a listener and then remove it, define it as a function:
	   *
	   * ```js
	   * function onClick(e) { ... }
	   *
	   * map.on('click', onClick);
	   * map.off('click', onClick);
	   * ```
	   */

	  var Events = {
	  	/* @method on(type: String, fn: Function, context?: Object): this
	  	 * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
	  	 *
	  	 * @alternative
	  	 * @method on(eventMap: Object): this
	  	 * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
	  	 */
	  	on: function (types, fn, context) {

	  		// types can be a map of types/handlers
	  		if (typeof types === 'object') {
	  			for (var type in types) {
	  				// we don't process space-separated events here for performance;
	  				// it's a hot path since Layer uses the on(obj) syntax
	  				this._on(type, types[type], fn);
	  			}

	  		} else {
	  			// types can be a string of space-separated words
	  			types = splitWords(types);

	  			for (var i = 0, len = types.length; i < len; i++) {
	  				this._on(types[i], fn, context);
	  			}
	  		}

	  		return this;
	  	},

	  	/* @method off(type: String, fn?: Function, context?: Object): this
	  	 * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
	  	 *
	  	 * @alternative
	  	 * @method off(eventMap: Object): this
	  	 * Removes a set of type/listener pairs.
	  	 *
	  	 * @alternative
	  	 * @method off: this
	  	 * Removes all listeners to all events on the object. This includes implicitly attached events.
	  	 */
	  	off: function (types, fn, context) {

	  		if (!types) {
	  			// clear all listeners if called without arguments
	  			delete this._events;

	  		} else if (typeof types === 'object') {
	  			for (var type in types) {
	  				this._off(type, types[type], fn);
	  			}

	  		} else {
	  			types = splitWords(types);

	  			for (var i = 0, len = types.length; i < len; i++) {
	  				this._off(types[i], fn, context);
	  			}
	  		}

	  		return this;
	  	},

	  	// attach listener (without syntactic sugar now)
	  	_on: function (type, fn, context) {
	  		this._events = this._events || {};

	  		/* get/init listeners for type */
	  		var typeListeners = this._events[type];
	  		if (!typeListeners) {
	  			typeListeners = [];
	  			this._events[type] = typeListeners;
	  		}

	  		if (context === this) {
	  			// Less memory footprint.
	  			context = undefined;
	  		}
	  		var newListener = {fn: fn, ctx: context},
	  		    listeners = typeListeners;

	  		// check if fn already there
	  		for (var i = 0, len = listeners.length; i < len; i++) {
	  			if (listeners[i].fn === fn && listeners[i].ctx === context) {
	  				return;
	  			}
	  		}

	  		listeners.push(newListener);
	  	},

	  	_off: function (type, fn, context) {
	  		var listeners,
	  		    i,
	  		    len;

	  		if (!this._events) { return; }

	  		listeners = this._events[type];

	  		if (!listeners) {
	  			return;
	  		}

	  		if (!fn) {
	  			// Set all removed listeners to noop so they are not called if remove happens in fire
	  			for (i = 0, len = listeners.length; i < len; i++) {
	  				listeners[i].fn = falseFn;
	  			}
	  			// clear all listeners for a type if function isn't specified
	  			delete this._events[type];
	  			return;
	  		}

	  		if (context === this) {
	  			context = undefined;
	  		}

	  		if (listeners) {

	  			// find fn and remove it
	  			for (i = 0, len = listeners.length; i < len; i++) {
	  				var l = listeners[i];
	  				if (l.ctx !== context) { continue; }
	  				if (l.fn === fn) {

	  					// set the removed listener to noop so that's not called if remove happens in fire
	  					l.fn = falseFn;

	  					if (this._firingCount) {
	  						/* copy array in case events are being fired */
	  						this._events[type] = listeners = listeners.slice();
	  					}
	  					listeners.splice(i, 1);

	  					return;
	  				}
	  			}
	  		}
	  	},

	  	// @method fire(type: String, data?: Object, propagate?: Boolean): this
	  	// Fires an event of the specified type. You can optionally provide an data
	  	// object — the first argument of the listener function will contain its
	  	// properties. The event can optionally be propagated to event parents.
	  	fire: function (type, data, propagate) {
	  		if (!this.listens(type, propagate)) { return this; }

	  		var event = extend({}, data, {
	  			type: type,
	  			target: this,
	  			sourceTarget: data && data.sourceTarget || this
	  		});

	  		if (this._events) {
	  			var listeners = this._events[type];

	  			if (listeners) {
	  				this._firingCount = (this._firingCount + 1) || 1;
	  				for (var i = 0, len = listeners.length; i < len; i++) {
	  					var l = listeners[i];
	  					l.fn.call(l.ctx || this, event);
	  				}

	  				this._firingCount--;
	  			}
	  		}

	  		if (propagate) {
	  			// propagate the event to parents (set with addEventParent)
	  			this._propagateEvent(event);
	  		}

	  		return this;
	  	},

	  	// @method listens(type: String): Boolean
	  	// Returns `true` if a particular event type has any listeners attached to it.
	  	listens: function (type, propagate) {
	  		var listeners = this._events && this._events[type];
	  		if (listeners && listeners.length) { return true; }

	  		if (propagate) {
	  			// also check parents for listeners if event propagates
	  			for (var id in this._eventParents) {
	  				if (this._eventParents[id].listens(type, propagate)) { return true; }
	  			}
	  		}
	  		return false;
	  	},

	  	// @method once(…): this
	  	// Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
	  	once: function (types, fn, context) {

	  		if (typeof types === 'object') {
	  			for (var type in types) {
	  				this.once(type, types[type], fn);
	  			}
	  			return this;
	  		}

	  		var handler = bind(function () {
	  			this
	  			    .off(types, fn, context)
	  			    .off(types, handler, context);
	  		}, this);

	  		// add a listener that's executed once and removed after that
	  		return this
	  		    .on(types, fn, context)
	  		    .on(types, handler, context);
	  	},

	  	// @method addEventParent(obj: Evented): this
	  	// Adds an event parent - an `Evented` that will receive propagated events
	  	addEventParent: function (obj) {
	  		this._eventParents = this._eventParents || {};
	  		this._eventParents[stamp(obj)] = obj;
	  		return this;
	  	},

	  	// @method removeEventParent(obj: Evented): this
	  	// Removes an event parent, so it will stop receiving propagated events
	  	removeEventParent: function (obj) {
	  		if (this._eventParents) {
	  			delete this._eventParents[stamp(obj)];
	  		}
	  		return this;
	  	},

	  	_propagateEvent: function (e) {
	  		for (var id in this._eventParents) {
	  			this._eventParents[id].fire(e.type, extend({
	  				layer: e.target,
	  				propagatedFrom: e.target
	  			}, e), true);
	  		}
	  	}
	  };

	  // aliases; we should ditch those eventually

	  // @method addEventListener(…): this
	  // Alias to [`on(…)`](#evented-on)
	  Events.addEventListener = Events.on;

	  // @method removeEventListener(…): this
	  // Alias to [`off(…)`](#evented-off)

	  // @method clearAllEventListeners(…): this
	  // Alias to [`off()`](#evented-off)
	  Events.removeEventListener = Events.clearAllEventListeners = Events.off;

	  // @method addOneTimeEventListener(…): this
	  // Alias to [`once(…)`](#evented-once)
	  Events.addOneTimeEventListener = Events.once;

	  // @method fireEvent(…): this
	  // Alias to [`fire(…)`](#evented-fire)
	  Events.fireEvent = Events.fire;

	  // @method hasEventListeners(…): Boolean
	  // Alias to [`listens(…)`](#evented-listens)
	  Events.hasEventListeners = Events.listens;

	  var Evented = Class.extend(Events);

	  /*
	   * @class Point
	   * @aka L.Point
	   *
	   * Represents a point with `x` and `y` coordinates in pixels.
	   *
	   * @example
	   *
	   * ```js
	   * var point = L.point(200, 300);
	   * ```
	   *
	   * All Leaflet methods and options that accept `Point` objects also accept them in a simple Array form (unless noted otherwise), so these lines are equivalent:
	   *
	   * ```js
	   * map.panBy([200, 300]);
	   * map.panBy(L.point(200, 300));
	   * ```
	   *
	   * Note that `Point` does not inherit from Leaflet's `Class` object,
	   * which means new classes can't inherit from it, and new methods
	   * can't be added to it with the `include` function.
	   */

	  function Point(x, y, round) {
	  	// @property x: Number; The `x` coordinate of the point
	  	this.x = (round ? Math.round(x) : x);
	  	// @property y: Number; The `y` coordinate of the point
	  	this.y = (round ? Math.round(y) : y);
	  }

	  var trunc = Math.trunc || function (v) {
	  	return v > 0 ? Math.floor(v) : Math.ceil(v);
	  };

	  Point.prototype = {

	  	// @method clone(): Point
	  	// Returns a copy of the current point.
	  	clone: function () {
	  		return new Point(this.x, this.y);
	  	},

	  	// @method add(otherPoint: Point): Point
	  	// Returns the result of addition of the current and the given points.
	  	add: function (point) {
	  		// non-destructive, returns a new point
	  		return this.clone()._add(toPoint(point));
	  	},

	  	_add: function (point) {
	  		// destructive, used directly for performance in situations where it's safe to modify existing point
	  		this.x += point.x;
	  		this.y += point.y;
	  		return this;
	  	},

	  	// @method subtract(otherPoint: Point): Point
	  	// Returns the result of subtraction of the given point from the current.
	  	subtract: function (point) {
	  		return this.clone()._subtract(toPoint(point));
	  	},

	  	_subtract: function (point) {
	  		this.x -= point.x;
	  		this.y -= point.y;
	  		return this;
	  	},

	  	// @method divideBy(num: Number): Point
	  	// Returns the result of division of the current point by the given number.
	  	divideBy: function (num) {
	  		return this.clone()._divideBy(num);
	  	},

	  	_divideBy: function (num) {
	  		this.x /= num;
	  		this.y /= num;
	  		return this;
	  	},

	  	// @method multiplyBy(num: Number): Point
	  	// Returns the result of multiplication of the current point by the given number.
	  	multiplyBy: function (num) {
	  		return this.clone()._multiplyBy(num);
	  	},

	  	_multiplyBy: function (num) {
	  		this.x *= num;
	  		this.y *= num;
	  		return this;
	  	},

	  	// @method scaleBy(scale: Point): Point
	  	// Multiply each coordinate of the current point by each coordinate of
	  	// `scale`. In linear algebra terms, multiply the point by the
	  	// [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
	  	// defined by `scale`.
	  	scaleBy: function (point) {
	  		return new Point(this.x * point.x, this.y * point.y);
	  	},

	  	// @method unscaleBy(scale: Point): Point
	  	// Inverse of `scaleBy`. Divide each coordinate of the current point by
	  	// each coordinate of `scale`.
	  	unscaleBy: function (point) {
	  		return new Point(this.x / point.x, this.y / point.y);
	  	},

	  	// @method round(): Point
	  	// Returns a copy of the current point with rounded coordinates.
	  	round: function () {
	  		return this.clone()._round();
	  	},

	  	_round: function () {
	  		this.x = Math.round(this.x);
	  		this.y = Math.round(this.y);
	  		return this;
	  	},

	  	// @method floor(): Point
	  	// Returns a copy of the current point with floored coordinates (rounded down).
	  	floor: function () {
	  		return this.clone()._floor();
	  	},

	  	_floor: function () {
	  		this.x = Math.floor(this.x);
	  		this.y = Math.floor(this.y);
	  		return this;
	  	},

	  	// @method ceil(): Point
	  	// Returns a copy of the current point with ceiled coordinates (rounded up).
	  	ceil: function () {
	  		return this.clone()._ceil();
	  	},

	  	_ceil: function () {
	  		this.x = Math.ceil(this.x);
	  		this.y = Math.ceil(this.y);
	  		return this;
	  	},

	  	// @method trunc(): Point
	  	// Returns a copy of the current point with truncated coordinates (rounded towards zero).
	  	trunc: function () {
	  		return this.clone()._trunc();
	  	},

	  	_trunc: function () {
	  		this.x = trunc(this.x);
	  		this.y = trunc(this.y);
	  		return this;
	  	},

	  	// @method distanceTo(otherPoint: Point): Number
	  	// Returns the cartesian distance between the current and the given points.
	  	distanceTo: function (point) {
	  		point = toPoint(point);

	  		var x = point.x - this.x,
	  		    y = point.y - this.y;

	  		return Math.sqrt(x * x + y * y);
	  	},

	  	// @method equals(otherPoint: Point): Boolean
	  	// Returns `true` if the given point has the same coordinates.
	  	equals: function (point) {
	  		point = toPoint(point);

	  		return point.x === this.x &&
	  		       point.y === this.y;
	  	},

	  	// @method contains(otherPoint: Point): Boolean
	  	// Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
	  	contains: function (point) {
	  		point = toPoint(point);

	  		return Math.abs(point.x) <= Math.abs(this.x) &&
	  		       Math.abs(point.y) <= Math.abs(this.y);
	  	},

	  	// @method toString(): String
	  	// Returns a string representation of the point for debugging purposes.
	  	toString: function () {
	  		return 'Point(' +
	  		        formatNum(this.x) + ', ' +
	  		        formatNum(this.y) + ')';
	  	}
	  };

	  // @factory L.point(x: Number, y: Number, round?: Boolean)
	  // Creates a Point object with the given `x` and `y` coordinates. If optional `round` is set to true, rounds the `x` and `y` values.

	  // @alternative
	  // @factory L.point(coords: Number[])
	  // Expects an array of the form `[x, y]` instead.

	  // @alternative
	  // @factory L.point(coords: Object)
	  // Expects a plain object of the form `{x: Number, y: Number}` instead.
	  function toPoint(x, y, round) {
	  	if (x instanceof Point) {
	  		return x;
	  	}
	  	if (isArray(x)) {
	  		return new Point(x[0], x[1]);
	  	}
	  	if (x === undefined || x === null) {
	  		return x;
	  	}
	  	if (typeof x === 'object' && 'x' in x && 'y' in x) {
	  		return new Point(x.x, x.y);
	  	}
	  	return new Point(x, y, round);
	  }

	  /*
	   * @class Bounds
	   * @aka L.Bounds
	   *
	   * Represents a rectangular area in pixel coordinates.
	   *
	   * @example
	   *
	   * ```js
	   * var p1 = L.point(10, 10),
	   * p2 = L.point(40, 60),
	   * bounds = L.bounds(p1, p2);
	   * ```
	   *
	   * All Leaflet methods that accept `Bounds` objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
	   *
	   * ```js
	   * otherBounds.intersects([[10, 10], [40, 60]]);
	   * ```
	   *
	   * Note that `Bounds` does not inherit from Leaflet's `Class` object,
	   * which means new classes can't inherit from it, and new methods
	   * can't be added to it with the `include` function.
	   */

	  function Bounds(a, b) {
	  	if (!a) { return; }

	  	var points = b ? [a, b] : a;

	  	for (var i = 0, len = points.length; i < len; i++) {
	  		this.extend(points[i]);
	  	}
	  }

	  Bounds.prototype = {
	  	// @method extend(point: Point): this
	  	// Extends the bounds to contain the given point.
	  	extend: function (point) { // (Point)
	  		point = toPoint(point);

	  		// @property min: Point
	  		// The top left corner of the rectangle.
	  		// @property max: Point
	  		// The bottom right corner of the rectangle.
	  		if (!this.min && !this.max) {
	  			this.min = point.clone();
	  			this.max = point.clone();
	  		} else {
	  			this.min.x = Math.min(point.x, this.min.x);
	  			this.max.x = Math.max(point.x, this.max.x);
	  			this.min.y = Math.min(point.y, this.min.y);
	  			this.max.y = Math.max(point.y, this.max.y);
	  		}
	  		return this;
	  	},

	  	// @method getCenter(round?: Boolean): Point
	  	// Returns the center point of the bounds.
	  	getCenter: function (round) {
	  		return new Point(
	  		        (this.min.x + this.max.x) / 2,
	  		        (this.min.y + this.max.y) / 2, round);
	  	},

	  	// @method getBottomLeft(): Point
	  	// Returns the bottom-left point of the bounds.
	  	getBottomLeft: function () {
	  		return new Point(this.min.x, this.max.y);
	  	},

	  	// @method getTopRight(): Point
	  	// Returns the top-right point of the bounds.
	  	getTopRight: function () { // -> Point
	  		return new Point(this.max.x, this.min.y);
	  	},

	  	// @method getTopLeft(): Point
	  	// Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)).
	  	getTopLeft: function () {
	  		return this.min; // left, top
	  	},

	  	// @method getBottomRight(): Point
	  	// Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)).
	  	getBottomRight: function () {
	  		return this.max; // right, bottom
	  	},

	  	// @method getSize(): Point
	  	// Returns the size of the given bounds
	  	getSize: function () {
	  		return this.max.subtract(this.min);
	  	},

	  	// @method contains(otherBounds: Bounds): Boolean
	  	// Returns `true` if the rectangle contains the given one.
	  	// @alternative
	  	// @method contains(point: Point): Boolean
	  	// Returns `true` if the rectangle contains the given point.
	  	contains: function (obj) {
	  		var min, max;

	  		if (typeof obj[0] === 'number' || obj instanceof Point) {
	  			obj = toPoint(obj);
	  		} else {
	  			obj = toBounds(obj);
	  		}

	  		if (obj instanceof Bounds) {
	  			min = obj.min;
	  			max = obj.max;
	  		} else {
	  			min = max = obj;
	  		}

	  		return (min.x >= this.min.x) &&
	  		       (max.x <= this.max.x) &&
	  		       (min.y >= this.min.y) &&
	  		       (max.y <= this.max.y);
	  	},

	  	// @method intersects(otherBounds: Bounds): Boolean
	  	// Returns `true` if the rectangle intersects the given bounds. Two bounds
	  	// intersect if they have at least one point in common.
	  	intersects: function (bounds) { // (Bounds) -> Boolean
	  		bounds = toBounds(bounds);

	  		var min = this.min,
	  		    max = this.max,
	  		    min2 = bounds.min,
	  		    max2 = bounds.max,
	  		    xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
	  		    yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

	  		return xIntersects && yIntersects;
	  	},

	  	// @method overlaps(otherBounds: Bounds): Boolean
	  	// Returns `true` if the rectangle overlaps the given bounds. Two bounds
	  	// overlap if their intersection is an area.
	  	overlaps: function (bounds) { // (Bounds) -> Boolean
	  		bounds = toBounds(bounds);

	  		var min = this.min,
	  		    max = this.max,
	  		    min2 = bounds.min,
	  		    max2 = bounds.max,
	  		    xOverlaps = (max2.x > min.x) && (min2.x < max.x),
	  		    yOverlaps = (max2.y > min.y) && (min2.y < max.y);

	  		return xOverlaps && yOverlaps;
	  	},

	  	isValid: function () {
	  		return !!(this.min && this.max);
	  	}
	  };


	  // @factory L.bounds(corner1: Point, corner2: Point)
	  // Creates a Bounds object from two corners coordinate pairs.
	  // @alternative
	  // @factory L.bounds(points: Point[])
	  // Creates a Bounds object from the given array of points.
	  function toBounds(a, b) {
	  	if (!a || a instanceof Bounds) {
	  		return a;
	  	}
	  	return new Bounds(a, b);
	  }

	  /*
	   * @class LatLngBounds
	   * @aka L.LatLngBounds
	   *
	   * Represents a rectangular geographical area on a map.
	   *
	   * @example
	   *
	   * ```js
	   * var corner1 = L.latLng(40.712, -74.227),
	   * corner2 = L.latLng(40.774, -74.125),
	   * bounds = L.latLngBounds(corner1, corner2);
	   * ```
	   *
	   * All Leaflet methods that accept LatLngBounds objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
	   *
	   * ```js
	   * map.fitBounds([
	   * 	[40.712, -74.227],
	   * 	[40.774, -74.125]
	   * ]);
	   * ```
	   *
	   * Caution: if the area crosses the antimeridian (often confused with the International Date Line), you must specify corners _outside_ the [-180, 180] degrees longitude range.
	   *
	   * Note that `LatLngBounds` does not inherit from Leaflet's `Class` object,
	   * which means new classes can't inherit from it, and new methods
	   * can't be added to it with the `include` function.
	   */

	  function LatLngBounds(corner1, corner2) { // (LatLng, LatLng) or (LatLng[])
	  	if (!corner1) { return; }

	  	var latlngs = corner2 ? [corner1, corner2] : corner1;

	  	for (var i = 0, len = latlngs.length; i < len; i++) {
	  		this.extend(latlngs[i]);
	  	}
	  }

	  LatLngBounds.prototype = {

	  	// @method extend(latlng: LatLng): this
	  	// Extend the bounds to contain the given point

	  	// @alternative
	  	// @method extend(otherBounds: LatLngBounds): this
	  	// Extend the bounds to contain the given bounds
	  	extend: function (obj) {
	  		var sw = this._southWest,
	  		    ne = this._northEast,
	  		    sw2, ne2;

	  		if (obj instanceof LatLng) {
	  			sw2 = obj;
	  			ne2 = obj;

	  		} else if (obj instanceof LatLngBounds) {
	  			sw2 = obj._southWest;
	  			ne2 = obj._northEast;

	  			if (!sw2 || !ne2) { return this; }

	  		} else {
	  			return obj ? this.extend(toLatLng(obj) || toLatLngBounds(obj)) : this;
	  		}

	  		if (!sw && !ne) {
	  			this._southWest = new LatLng(sw2.lat, sw2.lng);
	  			this._northEast = new LatLng(ne2.lat, ne2.lng);
	  		} else {
	  			sw.lat = Math.min(sw2.lat, sw.lat);
	  			sw.lng = Math.min(sw2.lng, sw.lng);
	  			ne.lat = Math.max(ne2.lat, ne.lat);
	  			ne.lng = Math.max(ne2.lng, ne.lng);
	  		}

	  		return this;
	  	},

	  	// @method pad(bufferRatio: Number): LatLngBounds
	  	// Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
	  	// For example, a ratio of 0.5 extends the bounds by 50% in each direction.
	  	// Negative values will retract the bounds.
	  	pad: function (bufferRatio) {
	  		var sw = this._southWest,
	  		    ne = this._northEast,
	  		    heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
	  		    widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

	  		return new LatLngBounds(
	  		        new LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
	  		        new LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
	  	},

	  	// @method getCenter(): LatLng
	  	// Returns the center point of the bounds.
	  	getCenter: function () {
	  		return new LatLng(
	  		        (this._southWest.lat + this._northEast.lat) / 2,
	  		        (this._southWest.lng + this._northEast.lng) / 2);
	  	},

	  	// @method getSouthWest(): LatLng
	  	// Returns the south-west point of the bounds.
	  	getSouthWest: function () {
	  		return this._southWest;
	  	},

	  	// @method getNorthEast(): LatLng
	  	// Returns the north-east point of the bounds.
	  	getNorthEast: function () {
	  		return this._northEast;
	  	},

	  	// @method getNorthWest(): LatLng
	  	// Returns the north-west point of the bounds.
	  	getNorthWest: function () {
	  		return new LatLng(this.getNorth(), this.getWest());
	  	},

	  	// @method getSouthEast(): LatLng
	  	// Returns the south-east point of the bounds.
	  	getSouthEast: function () {
	  		return new LatLng(this.getSouth(), this.getEast());
	  	},

	  	// @method getWest(): Number
	  	// Returns the west longitude of the bounds
	  	getWest: function () {
	  		return this._southWest.lng;
	  	},

	  	// @method getSouth(): Number
	  	// Returns the south latitude of the bounds
	  	getSouth: function () {
	  		return this._southWest.lat;
	  	},

	  	// @method getEast(): Number
	  	// Returns the east longitude of the bounds
	  	getEast: function () {
	  		return this._northEast.lng;
	  	},

	  	// @method getNorth(): Number
	  	// Returns the north latitude of the bounds
	  	getNorth: function () {
	  		return this._northEast.lat;
	  	},

	  	// @method contains(otherBounds: LatLngBounds): Boolean
	  	// Returns `true` if the rectangle contains the given one.

	  	// @alternative
	  	// @method contains (latlng: LatLng): Boolean
	  	// Returns `true` if the rectangle contains the given point.
	  	contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
	  		if (typeof obj[0] === 'number' || obj instanceof LatLng || 'lat' in obj) {
	  			obj = toLatLng(obj);
	  		} else {
	  			obj = toLatLngBounds(obj);
	  		}

	  		var sw = this._southWest,
	  		    ne = this._northEast,
	  		    sw2, ne2;

	  		if (obj instanceof LatLngBounds) {
	  			sw2 = obj.getSouthWest();
	  			ne2 = obj.getNorthEast();
	  		} else {
	  			sw2 = ne2 = obj;
	  		}

	  		return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
	  		       (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
	  	},

	  	// @method intersects(otherBounds: LatLngBounds): Boolean
	  	// Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
	  	intersects: function (bounds) {
	  		bounds = toLatLngBounds(bounds);

	  		var sw = this._southWest,
	  		    ne = this._northEast,
	  		    sw2 = bounds.getSouthWest(),
	  		    ne2 = bounds.getNorthEast(),

	  		    latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
	  		    lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

	  		return latIntersects && lngIntersects;
	  	},

	  	// @method overlaps(otherBounds: LatLngBounds): Boolean
	  	// Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
	  	overlaps: function (bounds) {
	  		bounds = toLatLngBounds(bounds);

	  		var sw = this._southWest,
	  		    ne = this._northEast,
	  		    sw2 = bounds.getSouthWest(),
	  		    ne2 = bounds.getNorthEast(),

	  		    latOverlaps = (ne2.lat > sw.lat) && (sw2.lat < ne.lat),
	  		    lngOverlaps = (ne2.lng > sw.lng) && (sw2.lng < ne.lng);

	  		return latOverlaps && lngOverlaps;
	  	},

	  	// @method toBBoxString(): String
	  	// Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
	  	toBBoxString: function () {
	  		return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
	  	},

	  	// @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
	  	// Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
	  	equals: function (bounds, maxMargin) {
	  		if (!bounds) { return false; }

	  		bounds = toLatLngBounds(bounds);

	  		return this._southWest.equals(bounds.getSouthWest(), maxMargin) &&
	  		       this._northEast.equals(bounds.getNorthEast(), maxMargin);
	  	},

	  	// @method isValid(): Boolean
	  	// Returns `true` if the bounds are properly initialized.
	  	isValid: function () {
	  		return !!(this._southWest && this._northEast);
	  	}
	  };

	  // TODO International date line?

	  // @factory L.latLngBounds(corner1: LatLng, corner2: LatLng)
	  // Creates a `LatLngBounds` object by defining two diagonally opposite corners of the rectangle.

	  // @alternative
	  // @factory L.latLngBounds(latlngs: LatLng[])
	  // Creates a `LatLngBounds` object defined by the geographical points it contains. Very useful for zooming the map to fit a particular set of locations with [`fitBounds`](#map-fitbounds).
	  function toLatLngBounds(a, b) {
	  	if (a instanceof LatLngBounds) {
	  		return a;
	  	}
	  	return new LatLngBounds(a, b);
	  }

	  /* @class LatLng
	   * @aka L.LatLng
	   *
	   * Represents a geographical point with a certain latitude and longitude.
	   *
	   * @example
	   *
	   * ```
	   * var latlng = L.latLng(50.5, 30.5);
	   * ```
	   *
	   * All Leaflet methods that accept LatLng objects also accept them in a simple Array form and simple object form (unless noted otherwise), so these lines are equivalent:
	   *
	   * ```
	   * map.panTo([50, 30]);
	   * map.panTo({lon: 30, lat: 50});
	   * map.panTo({lat: 50, lng: 30});
	   * map.panTo(L.latLng(50, 30));
	   * ```
	   *
	   * Note that `LatLng` does not inherit from Leaflet's `Class` object,
	   * which means new classes can't inherit from it, and new methods
	   * can't be added to it with the `include` function.
	   */

	  function LatLng(lat, lng, alt) {
	  	if (isNaN(lat) || isNaN(lng)) {
	  		throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
	  	}

	  	// @property lat: Number
	  	// Latitude in degrees
	  	this.lat = +lat;

	  	// @property lng: Number
	  	// Longitude in degrees
	  	this.lng = +lng;

	  	// @property alt: Number
	  	// Altitude in meters (optional)
	  	if (alt !== undefined) {
	  		this.alt = +alt;
	  	}
	  }

	  LatLng.prototype = {
	  	// @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
	  	// Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
	  	equals: function (obj, maxMargin) {
	  		if (!obj) { return false; }

	  		obj = toLatLng(obj);

	  		var margin = Math.max(
	  		        Math.abs(this.lat - obj.lat),
	  		        Math.abs(this.lng - obj.lng));

	  		return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
	  	},

	  	// @method toString(): String
	  	// Returns a string representation of the point (for debugging purposes).
	  	toString: function (precision) {
	  		return 'LatLng(' +
	  		        formatNum(this.lat, precision) + ', ' +
	  		        formatNum(this.lng, precision) + ')';
	  	},

	  	// @method distanceTo(otherLatLng: LatLng): Number
	  	// Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
	  	distanceTo: function (other) {
	  		return Earth.distance(this, toLatLng(other));
	  	},

	  	// @method wrap(): LatLng
	  	// Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
	  	wrap: function () {
	  		return Earth.wrapLatLng(this);
	  	},

	  	// @method toBounds(sizeInMeters: Number): LatLngBounds
	  	// Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
	  	toBounds: function (sizeInMeters) {
	  		var latAccuracy = 180 * sizeInMeters / 40075017,
	  		    lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

	  		return toLatLngBounds(
	  		        [this.lat - latAccuracy, this.lng - lngAccuracy],
	  		        [this.lat + latAccuracy, this.lng + lngAccuracy]);
	  	},

	  	clone: function () {
	  		return new LatLng(this.lat, this.lng, this.alt);
	  	}
	  };



	  // @factory L.latLng(latitude: Number, longitude: Number, altitude?: Number): LatLng
	  // Creates an object representing a geographical point with the given latitude and longitude (and optionally altitude).

	  // @alternative
	  // @factory L.latLng(coords: Array): LatLng
	  // Expects an array of the form `[Number, Number]` or `[Number, Number, Number]` instead.

	  // @alternative
	  // @factory L.latLng(coords: Object): LatLng
	  // Expects an plain object of the form `{lat: Number, lng: Number}` or `{lat: Number, lng: Number, alt: Number}` instead.

	  function toLatLng(a, b, c) {
	  	if (a instanceof LatLng) {
	  		return a;
	  	}
	  	if (isArray(a) && typeof a[0] !== 'object') {
	  		if (a.length === 3) {
	  			return new LatLng(a[0], a[1], a[2]);
	  		}
	  		if (a.length === 2) {
	  			return new LatLng(a[0], a[1]);
	  		}
	  		return null;
	  	}
	  	if (a === undefined || a === null) {
	  		return a;
	  	}
	  	if (typeof a === 'object' && 'lat' in a) {
	  		return new LatLng(a.lat, 'lng' in a ? a.lng : a.lon, a.alt);
	  	}
	  	if (b === undefined) {
	  		return null;
	  	}
	  	return new LatLng(a, b, c);
	  }

	  /*
	   * @namespace CRS
	   * @crs L.CRS.Base
	   * Object that defines coordinate reference systems for projecting
	   * geographical points into pixel (screen) coordinates and back (and to
	   * coordinates in other units for [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services). See
	   * [spatial reference system](http://en.wikipedia.org/wiki/Coordinate_reference_system).
	   *
	   * Leaflet defines the most usual CRSs by default. If you want to use a
	   * CRS not defined by default, take a look at the
	   * [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet) plugin.
	   *
	   * Note that the CRS instances do not inherit from Leaflet's `Class` object,
	   * and can't be instantiated. Also, new classes can't inherit from them,
	   * and methods can't be added to them with the `include` function.
	   */

	  var CRS = {
	  	// @method latLngToPoint(latlng: LatLng, zoom: Number): Point
	  	// Projects geographical coordinates into pixel coordinates for a given zoom.
	  	latLngToPoint: function (latlng, zoom) {
	  		var projectedPoint = this.projection.project(latlng),
	  		    scale = this.scale(zoom);

	  		return this.transformation._transform(projectedPoint, scale);
	  	},

	  	// @method pointToLatLng(point: Point, zoom: Number): LatLng
	  	// The inverse of `latLngToPoint`. Projects pixel coordinates on a given
	  	// zoom into geographical coordinates.
	  	pointToLatLng: function (point, zoom) {
	  		var scale = this.scale(zoom),
	  		    untransformedPoint = this.transformation.untransform(point, scale);

	  		return this.projection.unproject(untransformedPoint);
	  	},

	  	// @method project(latlng: LatLng): Point
	  	// Projects geographical coordinates into coordinates in units accepted for
	  	// this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
	  	project: function (latlng) {
	  		return this.projection.project(latlng);
	  	},

	  	// @method unproject(point: Point): LatLng
	  	// Given a projected coordinate returns the corresponding LatLng.
	  	// The inverse of `project`.
	  	unproject: function (point) {
	  		return this.projection.unproject(point);
	  	},

	  	// @method scale(zoom: Number): Number
	  	// Returns the scale used when transforming projected coordinates into
	  	// pixel coordinates for a particular zoom. For example, it returns
	  	// `256 * 2^zoom` for Mercator-based CRS.
	  	scale: function (zoom) {
	  		return 256 * Math.pow(2, zoom);
	  	},

	  	// @method zoom(scale: Number): Number
	  	// Inverse of `scale()`, returns the zoom level corresponding to a scale
	  	// factor of `scale`.
	  	zoom: function (scale) {
	  		return Math.log(scale / 256) / Math.LN2;
	  	},

	  	// @method getProjectedBounds(zoom: Number): Bounds
	  	// Returns the projection's bounds scaled and transformed for the provided `zoom`.
	  	getProjectedBounds: function (zoom) {
	  		if (this.infinite) { return null; }

	  		var b = this.projection.bounds,
	  		    s = this.scale(zoom),
	  		    min = this.transformation.transform(b.min, s),
	  		    max = this.transformation.transform(b.max, s);

	  		return new Bounds(min, max);
	  	},

	  	// @method distance(latlng1: LatLng, latlng2: LatLng): Number
	  	// Returns the distance between two geographical coordinates.

	  	// @property code: String
	  	// Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`)
	  	//
	  	// @property wrapLng: Number[]
	  	// An array of two numbers defining whether the longitude (horizontal) coordinate
	  	// axis wraps around a given range and how. Defaults to `[-180, 180]` in most
	  	// geographical CRSs. If `undefined`, the longitude axis does not wrap around.
	  	//
	  	// @property wrapLat: Number[]
	  	// Like `wrapLng`, but for the latitude (vertical) axis.

	  	// wrapLng: [min, max],
	  	// wrapLat: [min, max],

	  	// @property infinite: Boolean
	  	// If true, the coordinate space will be unbounded (infinite in both axes)
	  	infinite: false,

	  	// @method wrapLatLng(latlng: LatLng): LatLng
	  	// Returns a `LatLng` where lat and lng has been wrapped according to the
	  	// CRS's `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
	  	wrapLatLng: function (latlng) {
	  		var lng = this.wrapLng ? wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng,
	  		    lat = this.wrapLat ? wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat,
	  		    alt = latlng.alt;

	  		return new LatLng(lat, lng, alt);
	  	},

	  	// @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
	  	// Returns a `LatLngBounds` with the same size as the given one, ensuring
	  	// that its center is within the CRS's bounds.
	  	// Only accepts actual `L.LatLngBounds` instances, not arrays.
	  	wrapLatLngBounds: function (bounds) {
	  		var center = bounds.getCenter(),
	  		    newCenter = this.wrapLatLng(center),
	  		    latShift = center.lat - newCenter.lat,
	  		    lngShift = center.lng - newCenter.lng;

	  		if (latShift === 0 && lngShift === 0) {
	  			return bounds;
	  		}

	  		var sw = bounds.getSouthWest(),
	  		    ne = bounds.getNorthEast(),
	  		    newSw = new LatLng(sw.lat - latShift, sw.lng - lngShift),
	  		    newNe = new LatLng(ne.lat - latShift, ne.lng - lngShift);

	  		return new LatLngBounds(newSw, newNe);
	  	}
	  };

	  /*
	   * @namespace CRS
	   * @crs L.CRS.Earth
	   *
	   * Serves as the base for CRS that are global such that they cover the earth.
	   * Can only be used as the base for other CRS and cannot be used directly,
	   * since it does not have a `code`, `projection` or `transformation`. `distance()` returns
	   * meters.
	   */

	  var Earth = extend({}, CRS, {
	  	wrapLng: [-180, 180],

	  	// Mean Earth Radius, as recommended for use by
	  	// the International Union of Geodesy and Geophysics,
	  	// see http://rosettacode.org/wiki/Haversine_formula
	  	R: 6371000,

	  	// distance between two geographical points using spherical law of cosines approximation
	  	distance: function (latlng1, latlng2) {
	  		var rad = Math.PI / 180,
	  		    lat1 = latlng1.lat * rad,
	  		    lat2 = latlng2.lat * rad,
	  		    sinDLat = Math.sin((latlng2.lat - latlng1.lat) * rad / 2),
	  		    sinDLon = Math.sin((latlng2.lng - latlng1.lng) * rad / 2),
	  		    a = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon,
	  		    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	  		return this.R * c;
	  	}
	  });

	  /*
	   * @namespace Projection
	   * @projection L.Projection.SphericalMercator
	   *
	   * Spherical Mercator projection — the most common projection for online maps,
	   * used by almost all free and commercial tile providers. Assumes that Earth is
	   * a sphere. Used by the `EPSG:3857` CRS.
	   */

	  var earthRadius = 6378137;

	  var SphericalMercator = {

	  	R: earthRadius,
	  	MAX_LATITUDE: 85.0511287798,

	  	project: function (latlng) {
	  		var d = Math.PI / 180,
	  		    max = this.MAX_LATITUDE,
	  		    lat = Math.max(Math.min(max, latlng.lat), -max),
	  		    sin = Math.sin(lat * d);

	  		return new Point(
	  			this.R * latlng.lng * d,
	  			this.R * Math.log((1 + sin) / (1 - sin)) / 2);
	  	},

	  	unproject: function (point) {
	  		var d = 180 / Math.PI;

	  		return new LatLng(
	  			(2 * Math.atan(Math.exp(point.y / this.R)) - (Math.PI / 2)) * d,
	  			point.x * d / this.R);
	  	},

	  	bounds: (function () {
	  		var d = earthRadius * Math.PI;
	  		return new Bounds([-d, -d], [d, d]);
	  	})()
	  };

	  /*
	   * @class Transformation
	   * @aka L.Transformation
	   *
	   * Represents an affine transformation: a set of coefficients `a`, `b`, `c`, `d`
	   * for transforming a point of a form `(x, y)` into `(a*x + b, c*y + d)` and doing
	   * the reverse. Used by Leaflet in its projections code.
	   *
	   * @example
	   *
	   * ```js
	   * var transformation = L.transformation(2, 5, -1, 10),
	   * 	p = L.point(1, 2),
	   * 	p2 = transformation.transform(p), //  L.point(7, 8)
	   * 	p3 = transformation.untransform(p2); //  L.point(1, 2)
	   * ```
	   */


	  // factory new L.Transformation(a: Number, b: Number, c: Number, d: Number)
	  // Creates a `Transformation` object with the given coefficients.
	  function Transformation(a, b, c, d) {
	  	if (isArray(a)) {
	  		// use array properties
	  		this._a = a[0];
	  		this._b = a[1];
	  		this._c = a[2];
	  		this._d = a[3];
	  		return;
	  	}
	  	this._a = a;
	  	this._b = b;
	  	this._c = c;
	  	this._d = d;
	  }

	  Transformation.prototype = {
	  	// @method transform(point: Point, scale?: Number): Point
	  	// Returns a transformed point, optionally multiplied by the given scale.
	  	// Only accepts actual `L.Point` instances, not arrays.
	  	transform: function (point, scale) { // (Point, Number) -> Point
	  		return this._transform(point.clone(), scale);
	  	},

	  	// destructive transform (faster)
	  	_transform: function (point, scale) {
	  		scale = scale || 1;
	  		point.x = scale * (this._a * point.x + this._b);
	  		point.y = scale * (this._c * point.y + this._d);
	  		return point;
	  	},

	  	// @method untransform(point: Point, scale?: Number): Point
	  	// Returns the reverse transformation of the given point, optionally divided
	  	// by the given scale. Only accepts actual `L.Point` instances, not arrays.
	  	untransform: function (point, scale) {
	  		scale = scale || 1;
	  		return new Point(
	  		        (point.x / scale - this._b) / this._a,
	  		        (point.y / scale - this._d) / this._c);
	  	}
	  };

	  // factory L.transformation(a: Number, b: Number, c: Number, d: Number)

	  // @factory L.transformation(a: Number, b: Number, c: Number, d: Number)
	  // Instantiates a Transformation object with the given coefficients.

	  // @alternative
	  // @factory L.transformation(coefficients: Array): Transformation
	  // Expects an coefficients array of the form
	  // `[a: Number, b: Number, c: Number, d: Number]`.

	  function toTransformation(a, b, c, d) {
	  	return new Transformation(a, b, c, d);
	  }

	  /*
	   * @namespace CRS
	   * @crs L.CRS.EPSG3857
	   *
	   * The most common CRS for online maps, used by almost all free and commercial
	   * tile providers. Uses Spherical Mercator projection. Set in by default in
	   * Map's `crs` option.
	   */

	  var EPSG3857 = extend({}, Earth, {
	  	code: 'EPSG:3857',
	  	projection: SphericalMercator,

	  	transformation: (function () {
	  		var scale = 0.5 / (Math.PI * SphericalMercator.R);
	  		return toTransformation(scale, 0.5, -scale, 0.5);
	  	}())
	  });

	  var EPSG900913 = extend({}, EPSG3857, {
	  	code: 'EPSG:900913'
	  });

	  // @namespace SVG; @section
	  // There are several static functions which can be called without instantiating L.SVG:

	  // @function create(name: String): SVGElement
	  // Returns a instance of [SVGElement](https://developer.mozilla.org/docs/Web/API/SVGElement),
	  // corresponding to the class name passed. For example, using 'line' will return
	  // an instance of [SVGLineElement](https://developer.mozilla.org/docs/Web/API/SVGLineElement).
	  function svgCreate(name) {
	  	return document.createElementNS('http://www.w3.org/2000/svg', name);
	  }

	  // @function pointsToPath(rings: Point[], closed: Boolean): String
	  // Generates a SVG path string for multiple rings, with each ring turning
	  // into "M..L..L.." instructions
	  function pointsToPath(rings, closed) {
	  	var str = '',
	  	i, j, len, len2, points, p;

	  	for (i = 0, len = rings.length; i < len; i++) {
	  		points = rings[i];

	  		for (j = 0, len2 = points.length; j < len2; j++) {
	  			p = points[j];
	  			str += (j ? 'L' : 'M') + p.x + ' ' + p.y;
	  		}

	  		// closes the ring for polygons; "x" is VML syntax
	  		str += closed ? (svg ? 'z' : 'x') : '';
	  	}

	  	// SVG complains about empty path strings
	  	return str || 'M0 0';
	  }

	  /*
	   * @namespace Browser
	   * @aka L.Browser
	   *
	   * A namespace with static properties for browser/feature detection used by Leaflet internally.
	   *
	   * @example
	   *
	   * ```js
	   * if (L.Browser.ielt9) {
	   *   alert('Upgrade your browser, dude!');
	   * }
	   * ```
	   */

	  var style$1 = document.documentElement.style;

	  // @property ie: Boolean; `true` for all Internet Explorer versions (not Edge).
	  var ie = 'ActiveXObject' in window;

	  // @property ielt9: Boolean; `true` for Internet Explorer versions less than 9.
	  var ielt9 = ie && !document.addEventListener;

	  // @property edge: Boolean; `true` for the Edge web browser.
	  var edge = 'msLaunchUri' in navigator && !('documentMode' in document);

	  // @property webkit: Boolean;
	  // `true` for webkit-based browsers like Chrome and Safari (including mobile versions).
	  var webkit = userAgentContains('webkit');

	  // @property android: Boolean
	  // `true` for any browser running on an Android platform.
	  var android = userAgentContains('android');

	  // @property android23: Boolean; `true` for browsers running on Android 2 or Android 3.
	  var android23 = userAgentContains('android 2') || userAgentContains('android 3');

	  /* See https://stackoverflow.com/a/17961266 for details on detecting stock Android */
	  var webkitVer = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10); // also matches AppleWebKit
	  // @property androidStock: Boolean; `true` for the Android stock browser (i.e. not Chrome)
	  var androidStock = android && userAgentContains('Google') && webkitVer < 537 && !('AudioNode' in window);

	  // @property opera: Boolean; `true` for the Opera browser
	  var opera = !!window.opera;

	  // @property chrome: Boolean; `true` for the Chrome browser.
	  var chrome = !edge && userAgentContains('chrome');

	  // @property gecko: Boolean; `true` for gecko-based browsers like Firefox.
	  var gecko = userAgentContains('gecko') && !webkit && !opera && !ie;

	  // @property safari: Boolean; `true` for the Safari browser.
	  var safari = !chrome && userAgentContains('safari');

	  var phantom = userAgentContains('phantom');

	  // @property opera12: Boolean
	  // `true` for the Opera browser supporting CSS transforms (version 12 or later).
	  var opera12 = 'OTransition' in style$1;

	  // @property win: Boolean; `true` when the browser is running in a Windows platform
	  var win = navigator.platform.indexOf('Win') === 0;

	  // @property ie3d: Boolean; `true` for all Internet Explorer versions supporting CSS transforms.
	  var ie3d = ie && ('transition' in style$1);

	  // @property webkit3d: Boolean; `true` for webkit-based browsers supporting CSS transforms.
	  var webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23;

	  // @property gecko3d: Boolean; `true` for gecko-based browsers supporting CSS transforms.
	  var gecko3d = 'MozPerspective' in style$1;

	  // @property any3d: Boolean
	  // `true` for all browsers supporting CSS transforms.
	  var any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantom;

	  // @property mobile: Boolean; `true` for all browsers running in a mobile device.
	  var mobile = typeof orientation !== 'undefined' || userAgentContains('mobile');

	  // @property mobileWebkit: Boolean; `true` for all webkit-based browsers in a mobile device.
	  var mobileWebkit = mobile && webkit;

	  // @property mobileWebkit3d: Boolean
	  // `true` for all webkit-based browsers in a mobile device supporting CSS transforms.
	  var mobileWebkit3d = mobile && webkit3d;

	  // @property msPointer: Boolean
	  // `true` for browsers implementing the Microsoft touch events model (notably IE10).
	  var msPointer = !window.PointerEvent && window.MSPointerEvent;

	  // @property pointer: Boolean
	  // `true` for all browsers supporting [pointer events](https://msdn.microsoft.com/en-us/library/dn433244%28v=vs.85%29.aspx).
	  var pointer = !!(window.PointerEvent || msPointer);

	  // @property touch: Boolean
	  // `true` for all browsers supporting [touch events](https://developer.mozilla.org/docs/Web/API/Touch_events).
	  // This does not necessarily mean that the browser is running in a computer with
	  // a touchscreen, it only means that the browser is capable of understanding
	  // touch events.
	  var touch = !window.L_NO_TOUCH && (pointer || 'ontouchstart' in window ||
	  		(window.DocumentTouch && document instanceof window.DocumentTouch));

	  // @property mobileOpera: Boolean; `true` for the Opera browser in a mobile device.
	  var mobileOpera = mobile && opera;

	  // @property mobileGecko: Boolean
	  // `true` for gecko-based browsers running in a mobile device.
	  var mobileGecko = mobile && gecko;

	  // @property retina: Boolean
	  // `true` for browsers on a high-resolution "retina" screen or on any screen when browser's display zoom is more than 100%.
	  var retina = (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) > 1;

	  // @property passiveEvents: Boolean
	  // `true` for browsers that support passive events.
	  var passiveEvents = (function () {
	  	var supportsPassiveOption = false;
	  	try {
	  		var opts = Object.defineProperty({}, 'passive', {
	  			get: function () { // eslint-disable-line getter-return
	  				supportsPassiveOption = true;
	  			}
	  		});
	  		window.addEventListener('testPassiveEventSupport', falseFn, opts);
	  		window.removeEventListener('testPassiveEventSupport', falseFn, opts);
	  	} catch (e) {
	  		// Errors can safely be ignored since this is only a browser support test.
	  	}
	  	return supportsPassiveOption;
	  }());

	  // @property canvas: Boolean
	  // `true` when the browser supports [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
	  var canvas = (function () {
	  	return !!document.createElement('canvas').getContext;
	  }());

	  // @property svg: Boolean
	  // `true` when the browser supports [SVG](https://developer.mozilla.org/docs/Web/SVG).
	  var svg = !!(document.createElementNS && svgCreate('svg').createSVGRect);

	  // @property vml: Boolean
	  // `true` if the browser supports [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language).
	  var vml = !svg && (function () {
	  	try {
	  		var div = document.createElement('div');
	  		div.innerHTML = '<v:shape adj="1"/>';

	  		var shape = div.firstChild;
	  		shape.style.behavior = 'url(#default#VML)';

	  		return shape && (typeof shape.adj === 'object');

	  	} catch (e) {
	  		return false;
	  	}
	  }());


	  function userAgentContains(str) {
	  	return navigator.userAgent.toLowerCase().indexOf(str) >= 0;
	  }

	  var Browser = ({
	    ie: ie,
	    ielt9: ielt9,
	    edge: edge,
	    webkit: webkit,
	    android: android,
	    android23: android23,
	    androidStock: androidStock,
	    opera: opera,
	    chrome: chrome,
	    gecko: gecko,
	    safari: safari,
	    phantom: phantom,
	    opera12: opera12,
	    win: win,
	    ie3d: ie3d,
	    webkit3d: webkit3d,
	    gecko3d: gecko3d,
	    any3d: any3d,
	    mobile: mobile,
	    mobileWebkit: mobileWebkit,
	    mobileWebkit3d: mobileWebkit3d,
	    msPointer: msPointer,
	    pointer: pointer,
	    touch: touch,
	    mobileOpera: mobileOpera,
	    mobileGecko: mobileGecko,
	    retina: retina,
	    passiveEvents: passiveEvents,
	    canvas: canvas,
	    svg: svg,
	    vml: vml
	  });

	  /*
	   * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
	   */


	  var POINTER_DOWN =   msPointer ? 'MSPointerDown'   : 'pointerdown';
	  var POINTER_MOVE =   msPointer ? 'MSPointerMove'   : 'pointermove';
	  var POINTER_UP =     msPointer ? 'MSPointerUp'     : 'pointerup';
	  var POINTER_CANCEL = msPointer ? 'MSPointerCancel' : 'pointercancel';

	  var _pointers = {};
	  var _pointerDocListener = false;

	  // Provides a touch events wrapper for (ms)pointer events.
	  // ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890

	  function addPointerListener(obj, type, handler, id) {
	  	if (type === 'touchstart') {
	  		_addPointerStart(obj, handler, id);

	  	} else if (type === 'touchmove') {
	  		_addPointerMove(obj, handler, id);

	  	} else if (type === 'touchend') {
	  		_addPointerEnd(obj, handler, id);
	  	}

	  	return this;
	  }

	  function removePointerListener(obj, type, id) {
	  	var handler = obj['_leaflet_' + type + id];

	  	if (type === 'touchstart') {
	  		obj.removeEventListener(POINTER_DOWN, handler, false);

	  	} else if (type === 'touchmove') {
	  		obj.removeEventListener(POINTER_MOVE, handler, false);

	  	} else if (type === 'touchend') {
	  		obj.removeEventListener(POINTER_UP, handler, false);
	  		obj.removeEventListener(POINTER_CANCEL, handler, false);
	  	}

	  	return this;
	  }

	  function _addPointerStart(obj, handler, id) {
	  	var onDown = bind(function (e) {
	  		// IE10 specific: MsTouch needs preventDefault. See #2000
	  		if (e.MSPOINTER_TYPE_TOUCH && e.pointerType === e.MSPOINTER_TYPE_TOUCH) {
	  			preventDefault(e);
	  		}

	  		_handlePointer(e, handler);
	  	});

	  	obj['_leaflet_touchstart' + id] = onDown;
	  	obj.addEventListener(POINTER_DOWN, onDown, false);

	  	// need to keep track of what pointers and how many are active to provide e.touches emulation
	  	if (!_pointerDocListener) {
	  		// we listen document as any drags that end by moving the touch off the screen get fired there
	  		document.addEventListener(POINTER_DOWN, _globalPointerDown, true);
	  		document.addEventListener(POINTER_MOVE, _globalPointerMove, true);
	  		document.addEventListener(POINTER_UP, _globalPointerUp, true);
	  		document.addEventListener(POINTER_CANCEL, _globalPointerUp, true);

	  		_pointerDocListener = true;
	  	}
	  }

	  function _globalPointerDown(e) {
	  	_pointers[e.pointerId] = e;
	  }

	  function _globalPointerMove(e) {
	  	if (_pointers[e.pointerId]) {
	  		_pointers[e.pointerId] = e;
	  	}
	  }

	  function _globalPointerUp(e) {
	  	delete _pointers[e.pointerId];
	  }

	  function _handlePointer(e, handler) {
	  	e.touches = [];
	  	for (var i in _pointers) {
	  		e.touches.push(_pointers[i]);
	  	}
	  	e.changedTouches = [e];

	  	handler(e);
	  }

	  function _addPointerMove(obj, handler, id) {
	  	var onMove = function (e) {
	  		// don't fire touch moves when mouse isn't down
	  		if ((e.pointerType === (e.MSPOINTER_TYPE_MOUSE || 'mouse')) && e.buttons === 0) {
	  			return;
	  		}

	  		_handlePointer(e, handler);
	  	};

	  	obj['_leaflet_touchmove' + id] = onMove;
	  	obj.addEventListener(POINTER_MOVE, onMove, false);
	  }

	  function _addPointerEnd(obj, handler, id) {
	  	var onUp = function (e) {
	  		_handlePointer(e, handler);
	  	};

	  	obj['_leaflet_touchend' + id] = onUp;
	  	obj.addEventListener(POINTER_UP, onUp, false);
	  	obj.addEventListener(POINTER_CANCEL, onUp, false);
	  }

	  /*
	   * Extends the event handling code with double tap support for mobile browsers.
	   */

	  var _touchstart = msPointer ? 'MSPointerDown' : pointer ? 'pointerdown' : 'touchstart';
	  var _touchend = msPointer ? 'MSPointerUp' : pointer ? 'pointerup' : 'touchend';
	  var _pre = '_leaflet_';

	  // inspired by Zepto touch code by Thomas Fuchs
	  function addDoubleTapListener(obj, handler, id) {
	  	var last, touch$$1,
	  	    doubleTap = false,
	  	    delay = 250;

	  	function onTouchStart(e) {

	  		if (pointer) {
	  			if (!e.isPrimary) { return; }
	  			if (e.pointerType === 'mouse') { return; } // mouse fires native dblclick
	  		} else if (e.touches.length > 1) {
	  			return;
	  		}

	  		var now = Date.now(),
	  		    delta = now - (last || now);

	  		touch$$1 = e.touches ? e.touches[0] : e;
	  		doubleTap = (delta > 0 && delta <= delay);
	  		last = now;
	  	}

	  	function onTouchEnd(e) {
	  		if (doubleTap && !touch$$1.cancelBubble) {
	  			if (pointer) {
	  				if (e.pointerType === 'mouse') { return; }
	  				// work around .type being readonly with MSPointer* events
	  				var newTouch = {},
	  				    prop, i;

	  				for (i in touch$$1) {
	  					prop = touch$$1[i];
	  					newTouch[i] = prop && prop.bind ? prop.bind(touch$$1) : prop;
	  				}
	  				touch$$1 = newTouch;
	  			}
	  			touch$$1.type = 'dblclick';
	  			touch$$1.button = 0;
	  			handler(touch$$1);
	  			last = null;
	  		}
	  	}

	  	obj[_pre + _touchstart + id] = onTouchStart;
	  	obj[_pre + _touchend + id] = onTouchEnd;
	  	obj[_pre + 'dblclick' + id] = handler;

	  	obj.addEventListener(_touchstart, onTouchStart, passiveEvents ? {passive: false} : false);
	  	obj.addEventListener(_touchend, onTouchEnd, passiveEvents ? {passive: false} : false);

	  	// On some platforms (notably, chrome<55 on win10 + touchscreen + mouse),
	  	// the browser doesn't fire touchend/pointerup events but does fire
	  	// native dblclicks. See #4127.
	  	// Edge 14 also fires native dblclicks, but only for pointerType mouse, see #5180.
	  	obj.addEventListener('dblclick', handler, false);

	  	return this;
	  }

	  function removeDoubleTapListener(obj, id) {
	  	var touchstart = obj[_pre + _touchstart + id],
	  	    touchend = obj[_pre + _touchend + id],
	  	    dblclick = obj[_pre + 'dblclick' + id];

	  	obj.removeEventListener(_touchstart, touchstart, passiveEvents ? {passive: false} : false);
	  	obj.removeEventListener(_touchend, touchend, passiveEvents ? {passive: false} : false);
	  	obj.removeEventListener('dblclick', dblclick, false);

	  	return this;
	  }

	  /*
	   * @namespace DomUtil
	   *
	   * Utility functions to work with the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)
	   * tree, used by Leaflet internally.
	   *
	   * Most functions expecting or returning a `HTMLElement` also work for
	   * SVG elements. The only difference is that classes refer to CSS classes
	   * in HTML and SVG classes in SVG.
	   */


	  // @property TRANSFORM: String
	  // Vendor-prefixed transform style name (e.g. `'webkitTransform'` for WebKit).
	  var TRANSFORM = testProp(
	  	['transform', 'webkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

	  // webkitTransition comes first because some browser versions that drop vendor prefix don't do
	  // the same for the transitionend event, in particular the Android 4.1 stock browser

	  // @property TRANSITION: String
	  // Vendor-prefixed transition style name.
	  var TRANSITION = testProp(
	  	['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

	  // @property TRANSITION_END: String
	  // Vendor-prefixed transitionend event name.
	  var TRANSITION_END =
	  	TRANSITION === 'webkitTransition' || TRANSITION === 'OTransition' ? TRANSITION + 'End' : 'transitionend';


	  // @function get(id: String|HTMLElement): HTMLElement
	  // Returns an element given its DOM id, or returns the element itself
	  // if it was passed directly.
	  function get(id) {
	  	return typeof id === 'string' ? document.getElementById(id) : id;
	  }

	  // @function getStyle(el: HTMLElement, styleAttrib: String): String
	  // Returns the value for a certain style attribute on an element,
	  // including computed values or values set through CSS.
	  function getStyle(el, style) {
	  	var value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

	  	if ((!value || value === 'auto') && document.defaultView) {
	  		var css = document.defaultView.getComputedStyle(el, null);
	  		value = css ? css[style] : null;
	  	}
	  	return value === 'auto' ? null : value;
	  }

	  // @function create(tagName: String, className?: String, container?: HTMLElement): HTMLElement
	  // Creates an HTML element with `tagName`, sets its class to `className`, and optionally appends it to `container` element.
	  function create$1(tagName, className, container) {
	  	var el = document.createElement(tagName);
	  	el.className = className || '';

	  	if (container) {
	  		container.appendChild(el);
	  	}
	  	return el;
	  }

	  // @function remove(el: HTMLElement)
	  // Removes `el` from its parent element
	  function remove(el) {
	  	var parent = el.parentNode;
	  	if (parent) {
	  		parent.removeChild(el);
	  	}
	  }

	  // @function empty(el: HTMLElement)
	  // Removes all of `el`'s children elements from `el`
	  function empty(el) {
	  	while (el.firstChild) {
	  		el.removeChild(el.firstChild);
	  	}
	  }

	  // @function toFront(el: HTMLElement)
	  // Makes `el` the last child of its parent, so it renders in front of the other children.
	  function toFront(el) {
	  	var parent = el.parentNode;
	  	if (parent && parent.lastChild !== el) {
	  		parent.appendChild(el);
	  	}
	  }

	  // @function toBack(el: HTMLElement)
	  // Makes `el` the first child of its parent, so it renders behind the other children.
	  function toBack(el) {
	  	var parent = el.parentNode;
	  	if (parent && parent.firstChild !== el) {
	  		parent.insertBefore(el, parent.firstChild);
	  	}
	  }

	  // @function hasClass(el: HTMLElement, name: String): Boolean
	  // Returns `true` if the element's class attribute contains `name`.
	  function hasClass(el, name) {
	  	if (el.classList !== undefined) {
	  		return el.classList.contains(name);
	  	}
	  	var className = getClass(el);
	  	return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
	  }

	  // @function addClass(el: HTMLElement, name: String)
	  // Adds `name` to the element's class attribute.
	  function addClass(el, name) {
	  	if (el.classList !== undefined) {
	  		var classes = splitWords(name);
	  		for (var i = 0, len = classes.length; i < len; i++) {
	  			el.classList.add(classes[i]);
	  		}
	  	} else if (!hasClass(el, name)) {
	  		var className = getClass(el);
	  		setClass(el, (className ? className + ' ' : '') + name);
	  	}
	  }

	  // @function removeClass(el: HTMLElement, name: String)
	  // Removes `name` from the element's class attribute.
	  function removeClass(el, name) {
	  	if (el.classList !== undefined) {
	  		el.classList.remove(name);
	  	} else {
	  		setClass(el, trim((' ' + getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
	  	}
	  }

	  // @function setClass(el: HTMLElement, name: String)
	  // Sets the element's class.
	  function setClass(el, name) {
	  	if (el.className.baseVal === undefined) {
	  		el.className = name;
	  	} else {
	  		// in case of SVG element
	  		el.className.baseVal = name;
	  	}
	  }

	  // @function getClass(el: HTMLElement): String
	  // Returns the element's class.
	  function getClass(el) {
	  	// Check if the element is an SVGElementInstance and use the correspondingElement instead
	  	// (Required for linked SVG elements in IE11.)
	  	if (el.correspondingElement) {
	  		el = el.correspondingElement;
	  	}
	  	return el.className.baseVal === undefined ? el.className : el.className.baseVal;
	  }

	  // @function setOpacity(el: HTMLElement, opacity: Number)
	  // Set the opacity of an element (including old IE support).
	  // `opacity` must be a number from `0` to `1`.
	  function setOpacity(el, value) {
	  	if ('opacity' in el.style) {
	  		el.style.opacity = value;
	  	} else if ('filter' in el.style) {
	  		_setOpacityIE(el, value);
	  	}
	  }

	  function _setOpacityIE(el, value) {
	  	var filter = false,
	  	    filterName = 'DXImageTransform.Microsoft.Alpha';

	  	// filters collection throws an error if we try to retrieve a filter that doesn't exist
	  	try {
	  		filter = el.filters.item(filterName);
	  	} catch (e) {
	  		// don't set opacity to 1 if we haven't already set an opacity,
	  		// it isn't needed and breaks transparent pngs.
	  		if (value === 1) { return; }
	  	}

	  	value = Math.round(value * 100);

	  	if (filter) {
	  		filter.Enabled = (value !== 100);
	  		filter.Opacity = value;
	  	} else {
	  		el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
	  	}
	  }

	  // @function testProp(props: String[]): String|false
	  // Goes through the array of style names and returns the first name
	  // that is a valid style name for an element. If no such name is found,
	  // it returns false. Useful for vendor-prefixed styles like `transform`.
	  function testProp(props) {
	  	var style = document.documentElement.style;

	  	for (var i = 0; i < props.length; i++) {
	  		if (props[i] in style) {
	  			return props[i];
	  		}
	  	}
	  	return false;
	  }

	  // @function setTransform(el: HTMLElement, offset: Point, scale?: Number)
	  // Resets the 3D CSS transform of `el` so it is translated by `offset` pixels
	  // and optionally scaled by `scale`. Does not have an effect if the
	  // browser doesn't support 3D CSS transforms.
	  function setTransform(el, offset, scale) {
	  	var pos = offset || new Point(0, 0);

	  	el.style[TRANSFORM] =
	  		(ie3d ?
	  			'translate(' + pos.x + 'px,' + pos.y + 'px)' :
	  			'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
	  		(scale ? ' scale(' + scale + ')' : '');
	  }

	  // @function setPosition(el: HTMLElement, position: Point)
	  // Sets the position of `el` to coordinates specified by `position`,
	  // using CSS translate or top/left positioning depending on the browser
	  // (used by Leaflet internally to position its layers).
	  function setPosition(el, point) {

	  	/*eslint-disable */
	  	el._leaflet_pos = point;
	  	/* eslint-enable */

	  	if (any3d) {
	  		setTransform(el, point);
	  	} else {
	  		el.style.left = point.x + 'px';
	  		el.style.top = point.y + 'px';
	  	}
	  }

	  // @function getPosition(el: HTMLElement): Point
	  // Returns the coordinates of an element previously positioned with setPosition.
	  function getPosition(el) {
	  	// this method is only used for elements previously positioned using setPosition,
	  	// so it's safe to cache the position for performance

	  	return el._leaflet_pos || new Point(0, 0);
	  }

	  // @function disableTextSelection()
	  // Prevents the user from generating `selectstart` DOM events, usually generated
	  // when the user drags the mouse through a page with text. Used internally
	  // by Leaflet to override the behaviour of any click-and-drag interaction on
	  // the map. Affects drag interactions on the whole document.

	  // @function enableTextSelection()
	  // Cancels the effects of a previous [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection).
	  var disableTextSelection;
	  var enableTextSelection;
	  var _userSelect;
	  if ('onselectstart' in document) {
	  	disableTextSelection = function () {
	  		on(window, 'selectstart', preventDefault);
	  	};
	  	enableTextSelection = function () {
	  		off(window, 'selectstart', preventDefault);
	  	};
	  } else {
	  	var userSelectProperty = testProp(
	  		['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

	  	disableTextSelection = function () {
	  		if (userSelectProperty) {
	  			var style = document.documentElement.style;
	  			_userSelect = style[userSelectProperty];
	  			style[userSelectProperty] = 'none';
	  		}
	  	};
	  	enableTextSelection = function () {
	  		if (userSelectProperty) {
	  			document.documentElement.style[userSelectProperty] = _userSelect;
	  			_userSelect = undefined;
	  		}
	  	};
	  }

	  // @function disableImageDrag()
	  // As [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection), but
	  // for `dragstart` DOM events, usually generated when the user drags an image.
	  function disableImageDrag() {
	  	on(window, 'dragstart', preventDefault);
	  }

	  // @function enableImageDrag()
	  // Cancels the effects of a previous [`L.DomUtil.disableImageDrag`](#domutil-disabletextselection).
	  function enableImageDrag() {
	  	off(window, 'dragstart', preventDefault);
	  }

	  var _outlineElement, _outlineStyle;
	  // @function preventOutline(el: HTMLElement)
	  // Makes the [outline](https://developer.mozilla.org/docs/Web/CSS/outline)
	  // of the element `el` invisible. Used internally by Leaflet to prevent
	  // focusable elements from displaying an outline when the user performs a
	  // drag interaction on them.
	  function preventOutline(element) {
	  	while (element.tabIndex === -1) {
	  		element = element.parentNode;
	  	}
	  	if (!element.style) { return; }
	  	restoreOutline();
	  	_outlineElement = element;
	  	_outlineStyle = element.style.outline;
	  	element.style.outline = 'none';
	  	on(window, 'keydown', restoreOutline);
	  }

	  // @function restoreOutline()
	  // Cancels the effects of a previous [`L.DomUtil.preventOutline`]().
	  function restoreOutline() {
	  	if (!_outlineElement) { return; }
	  	_outlineElement.style.outline = _outlineStyle;
	  	_outlineElement = undefined;
	  	_outlineStyle = undefined;
	  	off(window, 'keydown', restoreOutline);
	  }

	  // @function getSizedParentNode(el: HTMLElement): HTMLElement
	  // Finds the closest parent node which size (width and height) is not null.
	  function getSizedParentNode(element) {
	  	do {
	  		element = element.parentNode;
	  	} while ((!element.offsetWidth || !element.offsetHeight) && element !== document.body);
	  	return element;
	  }

	  // @function getScale(el: HTMLElement): Object
	  // Computes the CSS scale currently applied on the element.
	  // Returns an object with `x` and `y` members as horizontal and vertical scales respectively,
	  // and `boundingClientRect` as the result of [`getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).
	  function getScale(element) {
	  	var rect = element.getBoundingClientRect(); // Read-only in old browsers.

	  	return {
	  		x: rect.width / element.offsetWidth || 1,
	  		y: rect.height / element.offsetHeight || 1,
	  		boundingClientRect: rect
	  	};
	  }

	  var DomUtil = ({
	    TRANSFORM: TRANSFORM,
	    TRANSITION: TRANSITION,
	    TRANSITION_END: TRANSITION_END,
	    get: get,
	    getStyle: getStyle,
	    create: create$1,
	    remove: remove,
	    empty: empty,
	    toFront: toFront,
	    toBack: toBack,
	    hasClass: hasClass,
	    addClass: addClass,
	    removeClass: removeClass,
	    setClass: setClass,
	    getClass: getClass,
	    setOpacity: setOpacity,
	    testProp: testProp,
	    setTransform: setTransform,
	    setPosition: setPosition,
	    getPosition: getPosition,
	    disableTextSelection: disableTextSelection,
	    enableTextSelection: enableTextSelection,
	    disableImageDrag: disableImageDrag,
	    enableImageDrag: enableImageDrag,
	    preventOutline: preventOutline,
	    restoreOutline: restoreOutline,
	    getSizedParentNode: getSizedParentNode,
	    getScale: getScale
	  });

	  /*
	   * @namespace DomEvent
	   * Utility functions to work with the [DOM events](https://developer.mozilla.org/docs/Web/API/Event), used by Leaflet internally.
	   */

	  // Inspired by John Resig, Dean Edwards and YUI addEvent implementations.

	  // @function on(el: HTMLElement, types: String, fn: Function, context?: Object): this
	  // Adds a listener function (`fn`) to a particular DOM event type of the
	  // element `el`. You can optionally specify the context of the listener
	  // (object the `this` keyword will point to). You can also pass several
	  // space-separated types (e.g. `'click dblclick'`).

	  // @alternative
	  // @function on(el: HTMLElement, eventMap: Object, context?: Object): this
	  // Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
	  function on(obj, types, fn, context) {

	  	if (typeof types === 'object') {
	  		for (var type in types) {
	  			addOne(obj, type, types[type], fn);
	  		}
	  	} else {
	  		types = splitWords(types);

	  		for (var i = 0, len = types.length; i < len; i++) {
	  			addOne(obj, types[i], fn, context);
	  		}
	  	}

	  	return this;
	  }

	  var eventsKey = '_leaflet_events';

	  // @function off(el: HTMLElement, types: String, fn: Function, context?: Object): this
	  // Removes a previously added listener function.
	  // Note that if you passed a custom context to on, you must pass the same
	  // context to `off` in order to remove the listener.

	  // @alternative
	  // @function off(el: HTMLElement, eventMap: Object, context?: Object): this
	  // Removes a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
	  function off(obj, types, fn, context) {

	  	if (typeof types === 'object') {
	  		for (var type in types) {
	  			removeOne(obj, type, types[type], fn);
	  		}
	  	} else if (types) {
	  		types = splitWords(types);

	  		for (var i = 0, len = types.length; i < len; i++) {
	  			removeOne(obj, types[i], fn, context);
	  		}
	  	} else {
	  		for (var j in obj[eventsKey]) {
	  			removeOne(obj, j, obj[eventsKey][j]);
	  		}
	  		delete obj[eventsKey];
	  	}

	  	return this;
	  }

	  function browserFiresNativeDblClick() {
	  	// See https://github.com/w3c/pointerevents/issues/171
	  	if (pointer) {
	  		return !(edge || safari);
	  	}
	  }

	  var mouseSubst = {
	  	mouseenter: 'mouseover',
	  	mouseleave: 'mouseout',
	  	wheel: !('onwheel' in window) && 'mousewheel'
	  };

	  function addOne(obj, type, fn, context) {
	  	var id = type + stamp(fn) + (context ? '_' + stamp(context) : '');

	  	if (obj[eventsKey] && obj[eventsKey][id]) { return this; }

	  	var handler = function (e) {
	  		return fn.call(context || obj, e || window.event);
	  	};

	  	var originalHandler = handler;

	  	if (pointer && type.indexOf('touch') === 0) {
	  		// Needs DomEvent.Pointer.js
	  		addPointerListener(obj, type, handler, id);

	  	} else if (touch && (type === 'dblclick') && !browserFiresNativeDblClick()) {
	  		addDoubleTapListener(obj, handler, id);

	  	} else if ('addEventListener' in obj) {

	  		if (type === 'touchstart' || type === 'touchmove' || type === 'wheel' ||  type === 'mousewheel') {
	  			obj.addEventListener(mouseSubst[type] || type, handler, passiveEvents ? {passive: false} : false);

	  		} else if (type === 'mouseenter' || type === 'mouseleave') {
	  			handler = function (e) {
	  				e = e || window.event;
	  				if (isExternalTarget(obj, e)) {
	  					originalHandler(e);
	  				}
	  			};
	  			obj.addEventListener(mouseSubst[type], handler, false);

	  		} else {
	  			obj.addEventListener(type, originalHandler, false);
	  		}

	  	} else if ('attachEvent' in obj) {
	  		obj.attachEvent('on' + type, handler);
	  	}

	  	obj[eventsKey] = obj[eventsKey] || {};
	  	obj[eventsKey][id] = handler;
	  }

	  function removeOne(obj, type, fn, context) {

	  	var id = type + stamp(fn) + (context ? '_' + stamp(context) : ''),
	  	    handler = obj[eventsKey] && obj[eventsKey][id];

	  	if (!handler) { return this; }

	  	if (pointer && type.indexOf('touch') === 0) {
	  		removePointerListener(obj, type, id);

	  	} else if (touch && (type === 'dblclick') && !browserFiresNativeDblClick()) {
	  		removeDoubleTapListener(obj, id);

	  	} else if ('removeEventListener' in obj) {

	  		obj.removeEventListener(mouseSubst[type] || type, handler, false);

	  	} else if ('detachEvent' in obj) {
	  		obj.detachEvent('on' + type, handler);
	  	}

	  	obj[eventsKey][id] = null;
	  }

	  // @function stopPropagation(ev: DOMEvent): this
	  // Stop the given event from propagation to parent elements. Used inside the listener functions:
	  // ```js
	  // L.DomEvent.on(div, 'click', function (ev) {
	  // 	L.DomEvent.stopPropagation(ev);
	  // });
	  // ```
	  function stopPropagation(e) {

	  	if (e.stopPropagation) {
	  		e.stopPropagation();
	  	} else if (e.originalEvent) {  // In case of Leaflet event.
	  		e.originalEvent._stopped = true;
	  	} else {
	  		e.cancelBubble = true;
	  	}
	  	skipped(e);

	  	return this;
	  }

	  // @function disableScrollPropagation(el: HTMLElement): this
	  // Adds `stopPropagation` to the element's `'wheel'` events (plus browser variants).
	  function disableScrollPropagation(el) {
	  	addOne(el, 'wheel', stopPropagation);
	  	return this;
	  }

	  // @function disableClickPropagation(el: HTMLElement): this
	  // Adds `stopPropagation` to the element's `'click'`, `'doubleclick'`,
	  // `'mousedown'` and `'touchstart'` events (plus browser variants).
	  function disableClickPropagation(el) {
	  	on(el, 'mousedown touchstart dblclick', stopPropagation);
	  	addOne(el, 'click', fakeStop);
	  	return this;
	  }

	  // @function preventDefault(ev: DOMEvent): this
	  // Prevents the default action of the DOM Event `ev` from happening (such as
	  // following a link in the href of the a element, or doing a POST request
	  // with page reload when a `<form>` is submitted).
	  // Use it inside listener functions.
	  function preventDefault(e) {
	  	if (e.preventDefault) {
	  		e.preventDefault();
	  	} else {
	  		e.returnValue = false;
	  	}
	  	return this;
	  }

	  // @function stop(ev: DOMEvent): this
	  // Does `stopPropagation` and `preventDefault` at the same time.
	  function stop(e) {
	  	preventDefault(e);
	  	stopPropagation(e);
	  	return this;
	  }

	  // @function getMousePosition(ev: DOMEvent, container?: HTMLElement): Point
	  // Gets normalized mouse position from a DOM event relative to the
	  // `container` (border excluded) or to the whole page if not specified.
	  function getMousePosition(e, container) {
	  	if (!container) {
	  		return new Point(e.clientX, e.clientY);
	  	}

	  	var scale = getScale(container),
	  	    offset = scale.boundingClientRect; // left and top  values are in page scale (like the event clientX/Y)

	  	return new Point(
	  		// offset.left/top values are in page scale (like clientX/Y),
	  		// whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
	  		(e.clientX - offset.left) / scale.x - container.clientLeft,
	  		(e.clientY - offset.top) / scale.y - container.clientTop
	  	);
	  }

	  // Chrome on Win scrolls double the pixels as in other platforms (see #4538),
	  // and Firefox scrolls device pixels, not CSS pixels
	  var wheelPxFactor =
	  	(win && chrome) ? 2 * window.devicePixelRatio :
	  	gecko ? window.devicePixelRatio : 1;

	  // @function getWheelDelta(ev: DOMEvent): Number
	  // Gets normalized wheel delta from a wheel DOM event, in vertical
	  // pixels scrolled (negative if scrolling down).
	  // Events from pointing devices without precise scrolling are mapped to
	  // a best guess of 60 pixels.
	  function getWheelDelta(e) {
	  	return (edge) ? e.wheelDeltaY / 2 : // Don't trust window-geometry-based delta
	  	       (e.deltaY && e.deltaMode === 0) ? -e.deltaY / wheelPxFactor : // Pixels
	  	       (e.deltaY && e.deltaMode === 1) ? -e.deltaY * 20 : // Lines
	  	       (e.deltaY && e.deltaMode === 2) ? -e.deltaY * 60 : // Pages
	  	       (e.deltaX || e.deltaZ) ? 0 :	// Skip horizontal/depth wheel events
	  	       e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : // Legacy IE pixels
	  	       (e.detail && Math.abs(e.detail) < 32765) ? -e.detail * 20 : // Legacy Moz lines
	  	       e.detail ? e.detail / -32765 * 60 : // Legacy Moz pages
	  	       0;
	  }

	  var skipEvents = {};

	  function fakeStop(e) {
	  	// fakes stopPropagation by setting a special event flag, checked/reset with skipped(e)
	  	skipEvents[e.type] = true;
	  }

	  function skipped(e) {
	  	var events = skipEvents[e.type];
	  	// reset when checking, as it's only used in map container and propagates outside of the map
	  	skipEvents[e.type] = false;
	  	return events;
	  }

	  // check if element really left/entered the event target (for mouseenter/mouseleave)
	  function isExternalTarget(el, e) {

	  	var related = e.relatedTarget;

	  	if (!related) { return true; }

	  	try {
	  		while (related && (related !== el)) {
	  			related = related.parentNode;
	  		}
	  	} catch (err) {
	  		return false;
	  	}
	  	return (related !== el);
	  }

	  var DomEvent = ({
	    on: on,
	    off: off,
	    stopPropagation: stopPropagation,
	    disableScrollPropagation: disableScrollPropagation,
	    disableClickPropagation: disableClickPropagation,
	    preventDefault: preventDefault,
	    stop: stop,
	    getMousePosition: getMousePosition,
	    getWheelDelta: getWheelDelta,
	    fakeStop: fakeStop,
	    skipped: skipped,
	    isExternalTarget: isExternalTarget,
	    addListener: on,
	    removeListener: off
	  });

	  /*
	   * @class PosAnimation
	   * @aka L.PosAnimation
	   * @inherits Evented
	   * Used internally for panning animations, utilizing CSS3 Transitions for modern browsers and a timer fallback for IE6-9.
	   *
	   * @example
	   * ```js
	   * var fx = new L.PosAnimation();
	   * fx.run(el, [300, 500], 0.5);
	   * ```
	   *
	   * @constructor L.PosAnimation()
	   * Creates a `PosAnimation` object.
	   *
	   */

	  var PosAnimation = Evented.extend({

	  	// @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
	  	// Run an animation of a given element to a new position, optionally setting
	  	// duration in seconds (`0.25` by default) and easing linearity factor (3rd
	  	// argument of the [cubic bezier curve](http://cubic-bezier.com/#0,0,.5,1),
	  	// `0.5` by default).
	  	run: function (el, newPos, duration, easeLinearity) {
	  		this.stop();

	  		this._el = el;
	  		this._inProgress = true;
	  		this._duration = duration || 0.25;
	  		this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);

	  		this._startPos = getPosition(el);
	  		this._offset = newPos.subtract(this._startPos);
	  		this._startTime = +new Date();

	  		// @event start: Event
	  		// Fired when the animation starts
	  		this.fire('start');

	  		this._animate();
	  	},

	  	// @method stop()
	  	// Stops the animation (if currently running).
	  	stop: function () {
	  		if (!this._inProgress) { return; }

	  		this._step(true);
	  		this._complete();
	  	},

	  	_animate: function () {
	  		// animation loop
	  		this._animId = requestAnimFrame(this._animate, this);
	  		this._step();
	  	},

	  	_step: function (round) {
	  		var elapsed = (+new Date()) - this._startTime,
	  		    duration = this._duration * 1000;

	  		if (elapsed < duration) {
	  			this._runFrame(this._easeOut(elapsed / duration), round);
	  		} else {
	  			this._runFrame(1);
	  			this._complete();
	  		}
	  	},

	  	_runFrame: function (progress, round) {
	  		var pos = this._startPos.add(this._offset.multiplyBy(progress));
	  		if (round) {
	  			pos._round();
	  		}
	  		setPosition(this._el, pos);

	  		// @event step: Event
	  		// Fired continuously during the animation.
	  		this.fire('step');
	  	},

	  	_complete: function () {
	  		cancelAnimFrame(this._animId);

	  		this._inProgress = false;
	  		// @event end: Event
	  		// Fired when the animation ends.
	  		this.fire('end');
	  	},

	  	_easeOut: function (t) {
	  		return 1 - Math.pow(1 - t, this._easeOutPower);
	  	}
	  });

	  /*
	   * @class Map
	   * @aka L.Map
	   * @inherits Evented
	   *
	   * The central class of the API — it is used to create a map on a page and manipulate it.
	   *
	   * @example
	   *
	   * ```js
	   * // initialize the map on the "map" div with a given center and zoom
	   * var map = L.map('map', {
	   * 	center: [51.505, -0.09],
	   * 	zoom: 13
	   * });
	   * ```
	   *
	   */

	  var Map = Evented.extend({

	  	options: {
	  		// @section Map State Options
	  		// @option crs: CRS = L.CRS.EPSG3857
	  		// The [Coordinate Reference System](#crs) to use. Don't change this if you're not
	  		// sure what it means.
	  		crs: EPSG3857,

	  		// @option center: LatLng = undefined
	  		// Initial geographic center of the map
	  		center: undefined,

	  		// @option zoom: Number = undefined
	  		// Initial map zoom level
	  		zoom: undefined,

	  		// @option minZoom: Number = *
	  		// Minimum zoom level of the map.
	  		// If not specified and at least one `GridLayer` or `TileLayer` is in the map,
	  		// the lowest of their `minZoom` options will be used instead.
	  		minZoom: undefined,

	  		// @option maxZoom: Number = *
	  		// Maximum zoom level of the map.
	  		// If not specified and at least one `GridLayer` or `TileLayer` is in the map,
	  		// the highest of their `maxZoom` options will be used instead.
	  		maxZoom: undefined,

	  		// @option layers: Layer[] = []
	  		// Array of layers that will be added to the map initially
	  		layers: [],

	  		// @option maxBounds: LatLngBounds = null
	  		// When this option is set, the map restricts the view to the given
	  		// geographical bounds, bouncing the user back if the user tries to pan
	  		// outside the view. To set the restriction dynamically, use
	  		// [`setMaxBounds`](#map-setmaxbounds) method.
	  		maxBounds: undefined,

	  		// @option renderer: Renderer = *
	  		// The default method for drawing vector layers on the map. `L.SVG`
	  		// or `L.Canvas` by default depending on browser support.
	  		renderer: undefined,


	  		// @section Animation Options
	  		// @option zoomAnimation: Boolean = true
	  		// Whether the map zoom animation is enabled. By default it's enabled
	  		// in all browsers that support CSS3 Transitions except Android.
	  		zoomAnimation: true,

	  		// @option zoomAnimationThreshold: Number = 4
	  		// Won't animate zoom if the zoom difference exceeds this value.
	  		zoomAnimationThreshold: 4,

	  		// @option fadeAnimation: Boolean = true
	  		// Whether the tile fade animation is enabled. By default it's enabled
	  		// in all browsers that support CSS3 Transitions except Android.
	  		fadeAnimation: true,

	  		// @option markerZoomAnimation: Boolean = true
	  		// Whether markers animate their zoom with the zoom animation, if disabled
	  		// they will disappear for the length of the animation. By default it's
	  		// enabled in all browsers that support CSS3 Transitions except Android.
	  		markerZoomAnimation: true,

	  		// @option transform3DLimit: Number = 2^23
	  		// Defines the maximum size of a CSS translation transform. The default
	  		// value should not be changed unless a web browser positions layers in
	  		// the wrong place after doing a large `panBy`.
	  		transform3DLimit: 8388608, // Precision limit of a 32-bit float

	  		// @section Interaction Options
	  		// @option zoomSnap: Number = 1
	  		// Forces the map's zoom level to always be a multiple of this, particularly
	  		// right after a [`fitBounds()`](#map-fitbounds) or a pinch-zoom.
	  		// By default, the zoom level snaps to the nearest integer; lower values
	  		// (e.g. `0.5` or `0.1`) allow for greater granularity. A value of `0`
	  		// means the zoom level will not be snapped after `fitBounds` or a pinch-zoom.
	  		zoomSnap: 1,

	  		// @option zoomDelta: Number = 1
	  		// Controls how much the map's zoom level will change after a
	  		// [`zoomIn()`](#map-zoomin), [`zoomOut()`](#map-zoomout), pressing `+`
	  		// or `-` on the keyboard, or using the [zoom controls](#control-zoom).
	  		// Values smaller than `1` (e.g. `0.5`) allow for greater granularity.
	  		zoomDelta: 1,

	  		// @option trackResize: Boolean = true
	  		// Whether the map automatically handles browser window resize to update itself.
	  		trackResize: true
	  	},

	  	initialize: function (id, options) { // (HTMLElement or String, Object)
	  		options = setOptions(this, options);

	  		// Make sure to assign internal flags at the beginning,
	  		// to avoid inconsistent state in some edge cases.
	  		this._handlers = [];
	  		this._layers = {};
	  		this._zoomBoundLayers = {};
	  		this._sizeChanged = true;

	  		this._initContainer(id);
	  		this._initLayout();

	  		// hack for https://github.com/Leaflet/Leaflet/issues/1980
	  		this._onResize = bind(this._onResize, this);

	  		this._initEvents();

	  		if (options.maxBounds) {
	  			this.setMaxBounds(options.maxBounds);
	  		}

	  		if (options.zoom !== undefined) {
	  			this._zoom = this._limitZoom(options.zoom);
	  		}

	  		if (options.center && options.zoom !== undefined) {
	  			this.setView(toLatLng(options.center), options.zoom, {reset: true});
	  		}

	  		this.callInitHooks();

	  		// don't animate on browsers without hardware-accelerated transitions or old Android/Opera
	  		this._zoomAnimated = TRANSITION && any3d && !mobileOpera &&
	  				this.options.zoomAnimation;

	  		// zoom transitions run with the same duration for all layers, so if one of transitionend events
	  		// happens after starting zoom animation (propagating to the map pane), we know that it ended globally
	  		if (this._zoomAnimated) {
	  			this._createAnimProxy();
	  			on(this._proxy, TRANSITION_END, this._catchTransitionEnd, this);
	  		}

	  		this._addLayers(this.options.layers);
	  	},


	  	// @section Methods for modifying map state

	  	// @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
	  	// Sets the view of the map (geographical center and zoom) with the given
	  	// animation options.
	  	setView: function (center, zoom, options) {

	  		zoom = zoom === undefined ? this._zoom : this._limitZoom(zoom);
	  		center = this._limitCenter(toLatLng(center), zoom, this.options.maxBounds);
	  		options = options || {};

	  		this._stop();

	  		if (this._loaded && !options.reset && options !== true) {

	  			if (options.animate !== undefined) {
	  				options.zoom = extend({animate: options.animate}, options.zoom);
	  				options.pan = extend({animate: options.animate, duration: options.duration}, options.pan);
	  			}

	  			// try animating pan or zoom
	  			var moved = (this._zoom !== zoom) ?
	  				this._tryAnimatedZoom && this._tryAnimatedZoom(center, zoom, options.zoom) :
	  				this._tryAnimatedPan(center, options.pan);

	  			if (moved) {
	  				// prevent resize handler call, the view will refresh after animation anyway
	  				clearTimeout(this._sizeTimer);
	  				return this;
	  			}
	  		}

	  		// animation didn't start, just reset the map view
	  		this._resetView(center, zoom);

	  		return this;
	  	},

	  	// @method setZoom(zoom: Number, options?: Zoom/pan options): this
	  	// Sets the zoom of the map.
	  	setZoom: function (zoom, options) {
	  		if (!this._loaded) {
	  			this._zoom = zoom;
	  			return this;
	  		}
	  		return this.setView(this.getCenter(), zoom, {zoom: options});
	  	},

	  	// @method zoomIn(delta?: Number, options?: Zoom options): this
	  	// Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
	  	zoomIn: function (delta, options) {
	  		delta = delta || (any3d ? this.options.zoomDelta : 1);
	  		return this.setZoom(this._zoom + delta, options);
	  	},

	  	// @method zoomOut(delta?: Number, options?: Zoom options): this
	  	// Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
	  	zoomOut: function (delta, options) {
	  		delta = delta || (any3d ? this.options.zoomDelta : 1);
	  		return this.setZoom(this._zoom - delta, options);
	  	},

	  	// @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
	  	// Zooms the map while keeping a specified geographical point on the map
	  	// stationary (e.g. used internally for scroll zoom and double-click zoom).
	  	// @alternative
	  	// @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
	  	// Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
	  	setZoomAround: function (latlng, zoom, options) {
	  		var scale = this.getZoomScale(zoom),
	  		    viewHalf = this.getSize().divideBy(2),
	  		    containerPoint = latlng instanceof Point ? latlng : this.latLngToContainerPoint(latlng),

	  		    centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale),
	  		    newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));

	  		return this.setView(newCenter, zoom, {zoom: options});
	  	},

	  	_getBoundsCenterZoom: function (bounds, options) {

	  		options = options || {};
	  		bounds = bounds.getBounds ? bounds.getBounds() : toLatLngBounds(bounds);

	  		var paddingTL = toPoint(options.paddingTopLeft || options.padding || [0, 0]),
	  		    paddingBR = toPoint(options.paddingBottomRight || options.padding || [0, 0]),

	  		    zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR));

	  		zoom = (typeof options.maxZoom === 'number') ? Math.min(options.maxZoom, zoom) : zoom;

	  		if (zoom === Infinity) {
	  			return {
	  				center: bounds.getCenter(),
	  				zoom: zoom
	  			};
	  		}

	  		var paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),

	  		    swPoint = this.project(bounds.getSouthWest(), zoom),
	  		    nePoint = this.project(bounds.getNorthEast(), zoom),
	  		    center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);

	  		return {
	  			center: center,
	  			zoom: zoom
	  		};
	  	},

	  	// @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
	  	// Sets a map view that contains the given geographical bounds with the
	  	// maximum zoom level possible.
	  	fitBounds: function (bounds, options) {

	  		bounds = toLatLngBounds(bounds);

	  		if (!bounds.isValid()) {
	  			throw new Error('Bounds are not valid.');
	  		}

	  		var target = this._getBoundsCenterZoom(bounds, options);
	  		return this.setView(target.center, target.zoom, options);
	  	},

	  	// @method fitWorld(options?: fitBounds options): this
	  	// Sets a map view that mostly contains the whole world with the maximum
	  	// zoom level possible.
	  	fitWorld: function (options) {
	  		return this.fitBounds([[-90, -180], [90, 180]], options);
	  	},

	  	// @method panTo(latlng: LatLng, options?: Pan options): this
	  	// Pans the map to a given center.
	  	panTo: function (center, options) { // (LatLng)
	  		return this.setView(center, this._zoom, {pan: options});
	  	},

	  	// @method panBy(offset: Point, options?: Pan options): this
	  	// Pans the map by a given number of pixels (animated).
	  	panBy: function (offset, options) {
	  		offset = toPoint(offset).round();
	  		options = options || {};

	  		if (!offset.x && !offset.y) {
	  			return this.fire('moveend');
	  		}
	  		// If we pan too far, Chrome gets issues with tiles
	  		// and makes them disappear or appear in the wrong place (slightly offset) #2602
	  		if (options.animate !== true && !this.getSize().contains(offset)) {
	  			this._resetView(this.unproject(this.project(this.getCenter()).add(offset)), this.getZoom());
	  			return this;
	  		}

	  		if (!this._panAnim) {
	  			this._panAnim = new PosAnimation();

	  			this._panAnim.on({
	  				'step': this._onPanTransitionStep,
	  				'end': this._onPanTransitionEnd
	  			}, this);
	  		}

	  		// don't fire movestart if animating inertia
	  		if (!options.noMoveStart) {
	  			this.fire('movestart');
	  		}

	  		// animate pan unless animate: false specified
	  		if (options.animate !== false) {
	  			addClass(this._mapPane, 'leaflet-pan-anim');

	  			var newPos = this._getMapPanePos().subtract(offset).round();
	  			this._panAnim.run(this._mapPane, newPos, options.duration || 0.25, options.easeLinearity);
	  		} else {
	  			this._rawPanBy(offset);
	  			this.fire('move').fire('moveend');
	  		}

	  		return this;
	  	},

	  	// @method flyTo(latlng: LatLng, zoom?: Number, options?: Zoom/pan options): this
	  	// Sets the view of the map (geographical center and zoom) performing a smooth
	  	// pan-zoom animation.
	  	flyTo: function (targetCenter, targetZoom, options) {

	  		options = options || {};
	  		if (options.animate === false || !any3d) {
	  			return this.setView(targetCenter, targetZoom, options);
	  		}

	  		this._stop();

	  		var from = this.project(this.getCenter()),
	  		    to = this.project(targetCenter),
	  		    size = this.getSize(),
	  		    startZoom = this._zoom;

	  		targetCenter = toLatLng(targetCenter);
	  		targetZoom = targetZoom === undefined ? startZoom : targetZoom;

	  		var w0 = Math.max(size.x, size.y),
	  		    w1 = w0 * this.getZoomScale(startZoom, targetZoom),
	  		    u1 = (to.distanceTo(from)) || 1,
	  		    rho = 1.42,
	  		    rho2 = rho * rho;

	  		function r(i) {
	  			var s1 = i ? -1 : 1,
	  			    s2 = i ? w1 : w0,
	  			    t1 = w1 * w1 - w0 * w0 + s1 * rho2 * rho2 * u1 * u1,
	  			    b1 = 2 * s2 * rho2 * u1,
	  			    b = t1 / b1,
	  			    sq = Math.sqrt(b * b + 1) - b;

	  			    // workaround for floating point precision bug when sq = 0, log = -Infinite,
	  			    // thus triggering an infinite loop in flyTo
	  			    var log = sq < 0.000000001 ? -18 : Math.log(sq);

	  			return log;
	  		}

	  		function sinh(n) { return (Math.exp(n) - Math.exp(-n)) / 2; }
	  		function cosh(n) { return (Math.exp(n) + Math.exp(-n)) / 2; }
	  		function tanh(n) { return sinh(n) / cosh(n); }

	  		var r0 = r(0);

	  		function w(s) { return w0 * (cosh(r0) / cosh(r0 + rho * s)); }
	  		function u(s) { return w0 * (cosh(r0) * tanh(r0 + rho * s) - sinh(r0)) / rho2; }

	  		function easeOut(t) { return 1 - Math.pow(1 - t, 1.5); }

	  		var start = Date.now(),
	  		    S = (r(1) - r0) / rho,
	  		    duration = options.duration ? 1000 * options.duration : 1000 * S * 0.8;

	  		function frame() {
	  			var t = (Date.now() - start) / duration,
	  			    s = easeOut(t) * S;

	  			if (t <= 1) {
	  				this._flyToFrame = requestAnimFrame(frame, this);

	  				this._move(
	  					this.unproject(from.add(to.subtract(from).multiplyBy(u(s) / u1)), startZoom),
	  					this.getScaleZoom(w0 / w(s), startZoom),
	  					{flyTo: true});

	  			} else {
	  				this
	  					._move(targetCenter, targetZoom)
	  					._moveEnd(true);
	  			}
	  		}

	  		this._moveStart(true, options.noMoveStart);

	  		frame.call(this);
	  		return this;
	  	},

	  	// @method flyToBounds(bounds: LatLngBounds, options?: fitBounds options): this
	  	// Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
	  	// but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
	  	flyToBounds: function (bounds, options) {
	  		var target = this._getBoundsCenterZoom(bounds, options);
	  		return this.flyTo(target.center, target.zoom, options);
	  	},

	  	// @method setMaxBounds(bounds: LatLngBounds): this
	  	// Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
	  	setMaxBounds: function (bounds) {
	  		bounds = toLatLngBounds(bounds);

	  		if (!bounds.isValid()) {
	  			this.options.maxBounds = null;
	  			return this.off('moveend', this._panInsideMaxBounds);
	  		} else if (this.options.maxBounds) {
	  			this.off('moveend', this._panInsideMaxBounds);
	  		}

	  		this.options.maxBounds = bounds;

	  		if (this._loaded) {
	  			this._panInsideMaxBounds();
	  		}

	  		return this.on('moveend', this._panInsideMaxBounds);
	  	},

	  	// @method setMinZoom(zoom: Number): this
	  	// Sets the lower limit for the available zoom levels (see the [minZoom](#map-minzoom) option).
	  	setMinZoom: function (zoom) {
	  		var oldZoom = this.options.minZoom;
	  		this.options.minZoom = zoom;

	  		if (this._loaded && oldZoom !== zoom) {
	  			this.fire('zoomlevelschange');

	  			if (this.getZoom() < this.options.minZoom) {
	  				return this.setZoom(zoom);
	  			}
	  		}

	  		return this;
	  	},

	  	// @method setMaxZoom(zoom: Number): this
	  	// Sets the upper limit for the available zoom levels (see the [maxZoom](#map-maxzoom) option).
	  	setMaxZoom: function (zoom) {
	  		var oldZoom = this.options.maxZoom;
	  		this.options.maxZoom = zoom;

	  		if (this._loaded && oldZoom !== zoom) {
	  			this.fire('zoomlevelschange');

	  			if (this.getZoom() > this.options.maxZoom) {
	  				return this.setZoom(zoom);
	  			}
	  		}

	  		return this;
	  	},

	  	// @method panInsideBounds(bounds: LatLngBounds, options?: Pan options): this
	  	// Pans the map to the closest view that would lie inside the given bounds (if it's not already), controlling the animation using the options specific, if any.
	  	panInsideBounds: function (bounds, options) {
	  		this._enforcingBounds = true;
	  		var center = this.getCenter(),
	  		    newCenter = this._limitCenter(center, this._zoom, toLatLngBounds(bounds));

	  		if (!center.equals(newCenter)) {
	  			this.panTo(newCenter, options);
	  		}

	  		this._enforcingBounds = false;
	  		return this;
	  	},

	  	// @method panInside(latlng: LatLng, options?: options): this
	  	// Pans the map the minimum amount to make the `latlng` visible. Use
	  	// `padding`, `paddingTopLeft` and `paddingTopRight` options to fit
	  	// the display to more restricted bounds, like [`fitBounds`](#map-fitbounds).
	  	// If `latlng` is already within the (optionally padded) display bounds,
	  	// the map will not be panned.
	  	panInside: function (latlng, options) {
	  		options = options || {};

	  		var paddingTL = toPoint(options.paddingTopLeft || options.padding || [0, 0]),
	  		    paddingBR = toPoint(options.paddingBottomRight || options.padding || [0, 0]),
	  		    center = this.getCenter(),
	  		    pixelCenter = this.project(center),
	  		    pixelPoint = this.project(latlng),
	  		    pixelBounds = this.getPixelBounds(),
	  		    halfPixelBounds = pixelBounds.getSize().divideBy(2),
	  		    paddedBounds = toBounds([pixelBounds.min.add(paddingTL), pixelBounds.max.subtract(paddingBR)]);

	  		if (!paddedBounds.contains(pixelPoint)) {
	  			this._enforcingBounds = true;
	  			var diff = pixelCenter.subtract(pixelPoint),
	  			    newCenter = toPoint(pixelPoint.x + diff.x, pixelPoint.y + diff.y);

	  			if (pixelPoint.x < paddedBounds.min.x || pixelPoint.x > paddedBounds.max.x) {
	  				newCenter.x = pixelCenter.x - diff.x;
	  				if (diff.x > 0) {
	  					newCenter.x += halfPixelBounds.x - paddingTL.x;
	  				} else {
	  					newCenter.x -= halfPixelBounds.x - paddingBR.x;
	  				}
	  			}
	  			if (pixelPoint.y < paddedBounds.min.y || pixelPoint.y > paddedBounds.max.y) {
	  				newCenter.y = pixelCenter.y - diff.y;
	  				if (diff.y > 0) {
	  					newCenter.y += halfPixelBounds.y - paddingTL.y;
	  				} else {
	  					newCenter.y -= halfPixelBounds.y - paddingBR.y;
	  				}
	  			}
	  			this.panTo(this.unproject(newCenter), options);
	  			this._enforcingBounds = false;
	  		}
	  		return this;
	  	},

	  	// @method invalidateSize(options: Zoom/pan options): this
	  	// Checks if the map container size changed and updates the map if so —
	  	// call it after you've changed the map size dynamically, also animating
	  	// pan by default. If `options.pan` is `false`, panning will not occur.
	  	// If `options.debounceMoveend` is `true`, it will delay `moveend` event so
	  	// that it doesn't happen often even if the method is called many
	  	// times in a row.

	  	// @alternative
	  	// @method invalidateSize(animate: Boolean): this
	  	// Checks if the map container size changed and updates the map if so —
	  	// call it after you've changed the map size dynamically, also animating
	  	// pan by default.
	  	invalidateSize: function (options) {
	  		if (!this._loaded) { return this; }

	  		options = extend({
	  			animate: false,
	  			pan: true
	  		}, options === true ? {animate: true} : options);

	  		var oldSize = this.getSize();
	  		this._sizeChanged = true;
	  		this._lastCenter = null;

	  		var newSize = this.getSize(),
	  		    oldCenter = oldSize.divideBy(2).round(),
	  		    newCenter = newSize.divideBy(2).round(),
	  		    offset = oldCenter.subtract(newCenter);

	  		if (!offset.x && !offset.y) { return this; }

	  		if (options.animate && options.pan) {
	  			this.panBy(offset);

	  		} else {
	  			if (options.pan) {
	  				this._rawPanBy(offset);
	  			}

	  			this.fire('move');

	  			if (options.debounceMoveend) {
	  				clearTimeout(this._sizeTimer);
	  				this._sizeTimer = setTimeout(bind(this.fire, this, 'moveend'), 200);
	  			} else {
	  				this.fire('moveend');
	  			}
	  		}

	  		// @section Map state change events
	  		// @event resize: ResizeEvent
	  		// Fired when the map is resized.
	  		return this.fire('resize', {
	  			oldSize: oldSize,
	  			newSize: newSize
	  		});
	  	},

	  	// @section Methods for modifying map state
	  	// @method stop(): this
	  	// Stops the currently running `panTo` or `flyTo` animation, if any.
	  	stop: function () {
	  		this.setZoom(this._limitZoom(this._zoom));
	  		if (!this.options.zoomSnap) {
	  			this.fire('viewreset');
	  		}
	  		return this._stop();
	  	},

	  	// @section Geolocation methods
	  	// @method locate(options?: Locate options): this
	  	// Tries to locate the user using the Geolocation API, firing a [`locationfound`](#map-locationfound)
	  	// event with location data on success or a [`locationerror`](#map-locationerror) event on failure,
	  	// and optionally sets the map view to the user's location with respect to
	  	// detection accuracy (or to the world view if geolocation failed).
	  	// Note that, if your page doesn't use HTTPS, this method will fail in
	  	// modern browsers ([Chrome 50 and newer](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins))
	  	// See `Locate options` for more details.
	  	locate: function (options) {

	  		options = this._locateOptions = extend({
	  			timeout: 10000,
	  			watch: false
	  			// setView: false
	  			// maxZoom: <Number>
	  			// maximumAge: 0
	  			// enableHighAccuracy: false
	  		}, options);

	  		if (!('geolocation' in navigator)) {
	  			this._handleGeolocationError({
	  				code: 0,
	  				message: 'Geolocation not supported.'
	  			});
	  			return this;
	  		}

	  		var onResponse = bind(this._handleGeolocationResponse, this),
	  		    onError = bind(this._handleGeolocationError, this);

	  		if (options.watch) {
	  			this._locationWatchId =
	  			        navigator.geolocation.watchPosition(onResponse, onError, options);
	  		} else {
	  			navigator.geolocation.getCurrentPosition(onResponse, onError, options);
	  		}
	  		return this;
	  	},

	  	// @method stopLocate(): this
	  	// Stops watching location previously initiated by `map.locate({watch: true})`
	  	// and aborts resetting the map view if map.locate was called with
	  	// `{setView: true}`.
	  	stopLocate: function () {
	  		if (navigator.geolocation && navigator.geolocation.clearWatch) {
	  			navigator.geolocation.clearWatch(this._locationWatchId);
	  		}
	  		if (this._locateOptions) {
	  			this._locateOptions.setView = false;
	  		}
	  		return this;
	  	},

	  	_handleGeolocationError: function (error) {
	  		var c = error.code,
	  		    message = error.message ||
	  		            (c === 1 ? 'permission denied' :
	  		            (c === 2 ? 'position unavailable' : 'timeout'));

	  		if (this._locateOptions.setView && !this._loaded) {
	  			this.fitWorld();
	  		}

	  		// @section Location events
	  		// @event locationerror: ErrorEvent
	  		// Fired when geolocation (using the [`locate`](#map-locate) method) failed.
	  		this.fire('locationerror', {
	  			code: c,
	  			message: 'Geolocation error: ' + message + '.'
	  		});
	  	},

	  	_handleGeolocationResponse: function (pos) {
	  		var lat = pos.coords.latitude,
	  		    lng = pos.coords.longitude,
	  		    latlng = new LatLng(lat, lng),
	  		    bounds = latlng.toBounds(pos.coords.accuracy * 2),
	  		    options = this._locateOptions;

	  		if (options.setView) {
	  			var zoom = this.getBoundsZoom(bounds);
	  			this.setView(latlng, options.maxZoom ? Math.min(zoom, options.maxZoom) : zoom);
	  		}

	  		var data = {
	  			latlng: latlng,
	  			bounds: bounds,
	  			timestamp: pos.timestamp
	  		};

	  		for (var i in pos.coords) {
	  			if (typeof pos.coords[i] === 'number') {
	  				data[i] = pos.coords[i];
	  			}
	  		}

	  		// @event locationfound: LocationEvent
	  		// Fired when geolocation (using the [`locate`](#map-locate) method)
	  		// went successfully.
	  		this.fire('locationfound', data);
	  	},

	  	// TODO Appropriate docs section?
	  	// @section Other Methods
	  	// @method addHandler(name: String, HandlerClass: Function): this
	  	// Adds a new `Handler` to the map, given its name and constructor function.
	  	addHandler: function (name, HandlerClass) {
	  		if (!HandlerClass) { return this; }

	  		var handler = this[name] = new HandlerClass(this);

	  		this._handlers.push(handler);

	  		if (this.options[name]) {
	  			handler.enable();
	  		}

	  		return this;
	  	},

	  	// @method remove(): this
	  	// Destroys the map and clears all related event listeners.
	  	remove: function () {

	  		this._initEvents(true);
	  		this.off('moveend', this._panInsideMaxBounds);

	  		if (this._containerId !== this._container._leaflet_id) {
	  			throw new Error('Map container is being reused by another instance');
	  		}

	  		try {
	  			// throws error in IE6-8
	  			delete this._container._leaflet_id;
	  			delete this._containerId;
	  		} catch (e) {
	  			/*eslint-disable */
	  			this._container._leaflet_id = undefined;
	  			/* eslint-enable */
	  			this._containerId = undefined;
	  		}

	  		if (this._locationWatchId !== undefined) {
	  			this.stopLocate();
	  		}

	  		this._stop();

	  		remove(this._mapPane);

	  		if (this._clearControlPos) {
	  			this._clearControlPos();
	  		}
	  		if (this._resizeRequest) {
	  			cancelAnimFrame(this._resizeRequest);
	  			this._resizeRequest = null;
	  		}

	  		this._clearHandlers();

	  		if (this._loaded) {
	  			// @section Map state change events
	  			// @event unload: Event
	  			// Fired when the map is destroyed with [remove](#map-remove) method.
	  			this.fire('unload');
	  		}

	  		var i;
	  		for (i in this._layers) {
	  			this._layers[i].remove();
	  		}
	  		for (i in this._panes) {
	  			remove(this._panes[i]);
	  		}

	  		this._layers = [];
	  		this._panes = [];
	  		delete this._mapPane;
	  		delete this._renderer;

	  		return this;
	  	},

	  	// @section Other Methods
	  	// @method createPane(name: String, container?: HTMLElement): HTMLElement
	  	// Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
	  	// then returns it. The pane is created as a child of `container`, or
	  	// as a child of the main map pane if not set.
	  	createPane: function (name, container) {
	  		var className = 'leaflet-pane' + (name ? ' leaflet-' + name.replace('Pane', '') + '-pane' : ''),
	  		    pane = create$1('div', className, container || this._mapPane);

	  		if (name) {
	  			this._panes[name] = pane;
	  		}
	  		return pane;
	  	},

	  	// @section Methods for Getting Map State

	  	// @method getCenter(): LatLng
	  	// Returns the geographical center of the map view
	  	getCenter: function () {
	  		this._checkIfLoaded();

	  		if (this._lastCenter && !this._moved()) {
	  			return this._lastCenter;
	  		}
	  		return this.layerPointToLatLng(this._getCenterLayerPoint());
	  	},

	  	// @method getZoom(): Number
	  	// Returns the current zoom level of the map view
	  	getZoom: function () {
	  		return this._zoom;
	  	},

	  	// @method getBounds(): LatLngBounds
	  	// Returns the geographical bounds visible in the current map view
	  	getBounds: function () {
	  		var bounds = this.getPixelBounds(),
	  		    sw = this.unproject(bounds.getBottomLeft()),
	  		    ne = this.unproject(bounds.getTopRight());

	  		return new LatLngBounds(sw, ne);
	  	},

	  	// @method getMinZoom(): Number
	  	// Returns the minimum zoom level of the map (if set in the `minZoom` option of the map or of any layers), or `0` by default.
	  	getMinZoom: function () {
	  		return this.options.minZoom === undefined ? this._layersMinZoom || 0 : this.options.minZoom;
	  	},

	  	// @method getMaxZoom(): Number
	  	// Returns the maximum zoom level of the map (if set in the `maxZoom` option of the map or of any layers).
	  	getMaxZoom: function () {
	  		return this.options.maxZoom === undefined ?
	  			(this._layersMaxZoom === undefined ? Infinity : this._layersMaxZoom) :
	  			this.options.maxZoom;
	  	},

	  	// @method getBoundsZoom(bounds: LatLngBounds, inside?: Boolean, padding?: Point): Number
	  	// Returns the maximum zoom level on which the given bounds fit to the map
	  	// view in its entirety. If `inside` (optional) is set to `true`, the method
	  	// instead returns the minimum zoom level on which the map view fits into
	  	// the given bounds in its entirety.
	  	getBoundsZoom: function (bounds, inside, padding) { // (LatLngBounds[, Boolean, Point]) -> Number
	  		bounds = toLatLngBounds(bounds);
	  		padding = toPoint(padding || [0, 0]);

	  		var zoom = this.getZoom() || 0,
	  		    min = this.getMinZoom(),
	  		    max = this.getMaxZoom(),
	  		    nw = bounds.getNorthWest(),
	  		    se = bounds.getSouthEast(),
	  		    size = this.getSize().subtract(padding),
	  		    boundsSize = toBounds(this.project(se, zoom), this.project(nw, zoom)).getSize(),
	  		    snap = any3d ? this.options.zoomSnap : 1,
	  		    scalex = size.x / boundsSize.x,
	  		    scaley = size.y / boundsSize.y,
	  		    scale = inside ? Math.max(scalex, scaley) : Math.min(scalex, scaley);

	  		zoom = this.getScaleZoom(scale, zoom);

	  		if (snap) {
	  			zoom = Math.round(zoom / (snap / 100)) * (snap / 100); // don't jump if within 1% of a snap level
	  			zoom = inside ? Math.ceil(zoom / snap) * snap : Math.floor(zoom / snap) * snap;
	  		}

	  		return Math.max(min, Math.min(max, zoom));
	  	},

	  	// @method getSize(): Point
	  	// Returns the current size of the map container (in pixels).
	  	getSize: function () {
	  		if (!this._size || this._sizeChanged) {
	  			this._size = new Point(
	  				this._container.clientWidth || 0,
	  				this._container.clientHeight || 0);

	  			this._sizeChanged = false;
	  		}
	  		return this._size.clone();
	  	},

	  	// @method getPixelBounds(): Bounds
	  	// Returns the bounds of the current map view in projected pixel
	  	// coordinates (sometimes useful in layer and overlay implementations).
	  	getPixelBounds: function (center, zoom) {
	  		var topLeftPoint = this._getTopLeftPoint(center, zoom);
	  		return new Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
	  	},

	  	// TODO: Check semantics - isn't the pixel origin the 0,0 coord relative to
	  	// the map pane? "left point of the map layer" can be confusing, specially
	  	// since there can be negative offsets.
	  	// @method getPixelOrigin(): Point
	  	// Returns the projected pixel coordinates of the top left point of
	  	// the map layer (useful in custom layer and overlay implementations).
	  	getPixelOrigin: function () {
	  		this._checkIfLoaded();
	  		return this._pixelOrigin;
	  	},

	  	// @method getPixelWorldBounds(zoom?: Number): Bounds
	  	// Returns the world's bounds in pixel coordinates for zoom level `zoom`.
	  	// If `zoom` is omitted, the map's current zoom level is used.
	  	getPixelWorldBounds: function (zoom) {
	  		return this.options.crs.getProjectedBounds(zoom === undefined ? this.getZoom() : zoom);
	  	},

	  	// @section Other Methods

	  	// @method getPane(pane: String|HTMLElement): HTMLElement
	  	// Returns a [map pane](#map-pane), given its name or its HTML element (its identity).
	  	getPane: function (pane) {
	  		return typeof pane === 'string' ? this._panes[pane] : pane;
	  	},

	  	// @method getPanes(): Object
	  	// Returns a plain object containing the names of all [panes](#map-pane) as keys and
	  	// the panes as values.
	  	getPanes: function () {
	  		return this._panes;
	  	},

	  	// @method getContainer: HTMLElement
	  	// Returns the HTML element that contains the map.
	  	getContainer: function () {
	  		return this._container;
	  	},


	  	// @section Conversion Methods

	  	// @method getZoomScale(toZoom: Number, fromZoom: Number): Number
	  	// Returns the scale factor to be applied to a map transition from zoom level
	  	// `fromZoom` to `toZoom`. Used internally to help with zoom animations.
	  	getZoomScale: function (toZoom, fromZoom) {
	  		// TODO replace with universal implementation after refactoring projections
	  		var crs = this.options.crs;
	  		fromZoom = fromZoom === undefined ? this._zoom : fromZoom;
	  		return crs.scale(toZoom) / crs.scale(fromZoom);
	  	},

	  	// @method getScaleZoom(scale: Number, fromZoom: Number): Number
	  	// Returns the zoom level that the map would end up at, if it is at `fromZoom`
	  	// level and everything is scaled by a factor of `scale`. Inverse of
	  	// [`getZoomScale`](#map-getZoomScale).
	  	getScaleZoom: function (scale, fromZoom) {
	  		var crs = this.options.crs;
	  		fromZoom = fromZoom === undefined ? this._zoom : fromZoom;
	  		var zoom = crs.zoom(scale * crs.scale(fromZoom));
	  		return isNaN(zoom) ? Infinity : zoom;
	  	},

	  	// @method project(latlng: LatLng, zoom: Number): Point
	  	// Projects a geographical coordinate `LatLng` according to the projection
	  	// of the map's CRS, then scales it according to `zoom` and the CRS's
	  	// `Transformation`. The result is pixel coordinate relative to
	  	// the CRS origin.
	  	project: function (latlng, zoom) {
	  		zoom = zoom === undefined ? this._zoom : zoom;
	  		return this.options.crs.latLngToPoint(toLatLng(latlng), zoom);
	  	},

	  	// @method unproject(point: Point, zoom: Number): LatLng
	  	// Inverse of [`project`](#map-project).
	  	unproject: function (point, zoom) {
	  		zoom = zoom === undefined ? this._zoom : zoom;
	  		return this.options.crs.pointToLatLng(toPoint(point), zoom);
	  	},

	  	// @method layerPointToLatLng(point: Point): LatLng
	  	// Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
	  	// returns the corresponding geographical coordinate (for the current zoom level).
	  	layerPointToLatLng: function (point) {
	  		var projectedPoint = toPoint(point).add(this.getPixelOrigin());
	  		return this.unproject(projectedPoint);
	  	},

	  	// @method latLngToLayerPoint(latlng: LatLng): Point
	  	// Given a geographical coordinate, returns the corresponding pixel coordinate
	  	// relative to the [origin pixel](#map-getpixelorigin).
	  	latLngToLayerPoint: function (latlng) {
	  		var projectedPoint = this.project(toLatLng(latlng))._round();
	  		return projectedPoint._subtract(this.getPixelOrigin());
	  	},

	  	// @method wrapLatLng(latlng: LatLng): LatLng
	  	// Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
	  	// map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
	  	// CRS's bounds.
	  	// By default this means longitude is wrapped around the dateline so its
	  	// value is between -180 and +180 degrees.
	  	wrapLatLng: function (latlng) {
	  		return this.options.crs.wrapLatLng(toLatLng(latlng));
	  	},

	  	// @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
	  	// Returns a `LatLngBounds` with the same size as the given one, ensuring that
	  	// its center is within the CRS's bounds.
	  	// By default this means the center longitude is wrapped around the dateline so its
	  	// value is between -180 and +180 degrees, and the majority of the bounds
	  	// overlaps the CRS's bounds.
	  	wrapLatLngBounds: function (latlng) {
	  		return this.options.crs.wrapLatLngBounds(toLatLngBounds(latlng));
	  	},

	  	// @method distance(latlng1: LatLng, latlng2: LatLng): Number
	  	// Returns the distance between two geographical coordinates according to
	  	// the map's CRS. By default this measures distance in meters.
	  	distance: function (latlng1, latlng2) {
	  		return this.options.crs.distance(toLatLng(latlng1), toLatLng(latlng2));
	  	},

	  	// @method containerPointToLayerPoint(point: Point): Point
	  	// Given a pixel coordinate relative to the map container, returns the corresponding
	  	// pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
	  	containerPointToLayerPoint: function (point) { // (Point)
	  		return toPoint(point).subtract(this._getMapPanePos());
	  	},

	  	// @method layerPointToContainerPoint(point: Point): Point
	  	// Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
	  	// returns the corresponding pixel coordinate relative to the map container.
	  	layerPointToContainerPoint: function (point) { // (Point)
	  		return toPoint(point).add(this._getMapPanePos());
	  	},

	  	// @method containerPointToLatLng(point: Point): LatLng
	  	// Given a pixel coordinate relative to the map container, returns
	  	// the corresponding geographical coordinate (for the current zoom level).
	  	containerPointToLatLng: function (point) {
	  		var layerPoint = this.containerPointToLayerPoint(toPoint(point));
	  		return this.layerPointToLatLng(layerPoint);
	  	},

	  	// @method latLngToContainerPoint(latlng: LatLng): Point
	  	// Given a geographical coordinate, returns the corresponding pixel coordinate
	  	// relative to the map container.
	  	latLngToContainerPoint: function (latlng) {
	  		return this.layerPointToContainerPoint(this.latLngToLayerPoint(toLatLng(latlng)));
	  	},

	  	// @method mouseEventToContainerPoint(ev: MouseEvent): Point
	  	// Given a MouseEvent object, returns the pixel coordinate relative to the
	  	// map container where the event took place.
	  	mouseEventToContainerPoint: function (e) {
	  		return getMousePosition(e, this._container);
	  	},

	  	// @method mouseEventToLayerPoint(ev: MouseEvent): Point
	  	// Given a MouseEvent object, returns the pixel coordinate relative to
	  	// the [origin pixel](#map-getpixelorigin) where the event took place.
	  	mouseEventToLayerPoint: function (e) {
	  		return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
	  	},

	  	// @method mouseEventToLatLng(ev: MouseEvent): LatLng
	  	// Given a MouseEvent object, returns geographical coordinate where the
	  	// event took place.
	  	mouseEventToLatLng: function (e) { // (MouseEvent)
	  		return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
	  	},


	  	// map initialization methods

	  	_initContainer: function (id) {
	  		var container = this._container = get(id);

	  		if (!container) {
	  			throw new Error('Map container not found.');
	  		} else if (container._leaflet_id) {
	  			throw new Error('Map container is already initialized.');
	  		}

	  		on(container, 'scroll', this._onScroll, this);
	  		this._containerId = stamp(container);
	  	},

	  	_initLayout: function () {
	  		var container = this._container;

	  		this._fadeAnimated = this.options.fadeAnimation && any3d;

	  		addClass(container, 'leaflet-container' +
	  			(touch ? ' leaflet-touch' : '') +
	  			(retina ? ' leaflet-retina' : '') +
	  			(ielt9 ? ' leaflet-oldie' : '') +
	  			(safari ? ' leaflet-safari' : '') +
	  			(this._fadeAnimated ? ' leaflet-fade-anim' : ''));

	  		var position = getStyle(container, 'position');

	  		if (position !== 'absolute' && position !== 'relative' && position !== 'fixed') {
	  			container.style.position = 'relative';
	  		}

	  		this._initPanes();

	  		if (this._initControlPos) {
	  			this._initControlPos();
	  		}
	  	},

	  	_initPanes: function () {
	  		var panes = this._panes = {};
	  		this._paneRenderers = {};

	  		// @section
	  		//
	  		// Panes are DOM elements used to control the ordering of layers on the map. You
	  		// can access panes with [`map.getPane`](#map-getpane) or
	  		// [`map.getPanes`](#map-getpanes) methods. New panes can be created with the
	  		// [`map.createPane`](#map-createpane) method.
	  		//
	  		// Every map has the following default panes that differ only in zIndex.
	  		//
	  		// @pane mapPane: HTMLElement = 'auto'
	  		// Pane that contains all other map panes

	  		this._mapPane = this.createPane('mapPane', this._container);
	  		setPosition(this._mapPane, new Point(0, 0));

	  		// @pane tilePane: HTMLElement = 200
	  		// Pane for `GridLayer`s and `TileLayer`s
	  		this.createPane('tilePane');
	  		// @pane overlayPane: HTMLElement = 400
	  		// Pane for overlay shadows (e.g. `Marker` shadows)
	  		this.createPane('shadowPane');
	  		// @pane shadowPane: HTMLElement = 500
	  		// Pane for vectors (`Path`s, like `Polyline`s and `Polygon`s), `ImageOverlay`s and `VideoOverlay`s
	  		this.createPane('overlayPane');
	  		// @pane markerPane: HTMLElement = 600
	  		// Pane for `Icon`s of `Marker`s
	  		this.createPane('markerPane');
	  		// @pane tooltipPane: HTMLElement = 650
	  		// Pane for `Tooltip`s.
	  		this.createPane('tooltipPane');
	  		// @pane popupPane: HTMLElement = 700
	  		// Pane for `Popup`s.
	  		this.createPane('popupPane');

	  		if (!this.options.markerZoomAnimation) {
	  			addClass(panes.markerPane, 'leaflet-zoom-hide');
	  			addClass(panes.shadowPane, 'leaflet-zoom-hide');
	  		}
	  	},


	  	// private methods that modify map state

	  	// @section Map state change events
	  	_resetView: function (center, zoom) {
	  		setPosition(this._mapPane, new Point(0, 0));

	  		var loading = !this._loaded;
	  		this._loaded = true;
	  		zoom = this._limitZoom(zoom);

	  		this.fire('viewprereset');

	  		var zoomChanged = this._zoom !== zoom;
	  		this
	  			._moveStart(zoomChanged, false)
	  			._move(center, zoom)
	  			._moveEnd(zoomChanged);

	  		// @event viewreset: Event
	  		// Fired when the map needs to redraw its content (this usually happens
	  		// on map zoom or load). Very useful for creating custom overlays.
	  		this.fire('viewreset');

	  		// @event load: Event
	  		// Fired when the map is initialized (when its center and zoom are set
	  		// for the first time).
	  		if (loading) {
	  			this.fire('load');
	  		}
	  	},

	  	_moveStart: function (zoomChanged, noMoveStart) {
	  		// @event zoomstart: Event
	  		// Fired when the map zoom is about to change (e.g. before zoom animation).
	  		// @event movestart: Event
	  		// Fired when the view of the map starts changing (e.g. user starts dragging the map).
	  		if (zoomChanged) {
	  			this.fire('zoomstart');
	  		}
	  		if (!noMoveStart) {
	  			this.fire('movestart');
	  		}
	  		return this;
	  	},

	  	_move: function (center, zoom, data) {
	  		if (zoom === undefined) {
	  			zoom = this._zoom;
	  		}
	  		var zoomChanged = this._zoom !== zoom;

	  		this._zoom = zoom;
	  		this._lastCenter = center;
	  		this._pixelOrigin = this._getNewPixelOrigin(center);

	  		// @event zoom: Event
	  		// Fired repeatedly during any change in zoom level, including zoom
	  		// and fly animations.
	  		if (zoomChanged || (data && data.pinch)) {	// Always fire 'zoom' if pinching because #3530
	  			this.fire('zoom', data);
	  		}

	  		// @event move: Event
	  		// Fired repeatedly during any movement of the map, including pan and
	  		// fly animations.
	  		return this.fire('move', data);
	  	},

	  	_moveEnd: function (zoomChanged) {
	  		// @event zoomend: Event
	  		// Fired when the map has changed, after any animations.
	  		if (zoomChanged) {
	  			this.fire('zoomend');
	  		}

	  		// @event moveend: Event
	  		// Fired when the center of the map stops changing (e.g. user stopped
	  		// dragging the map).
	  		return this.fire('moveend');
	  	},

	  	_stop: function () {
	  		cancelAnimFrame(this._flyToFrame);
	  		if (this._panAnim) {
	  			this._panAnim.stop();
	  		}
	  		return this;
	  	},

	  	_rawPanBy: function (offset) {
	  		setPosition(this._mapPane, this._getMapPanePos().subtract(offset));
	  	},

	  	_getZoomSpan: function () {
	  		return this.getMaxZoom() - this.getMinZoom();
	  	},

	  	_panInsideMaxBounds: function () {
	  		if (!this._enforcingBounds) {
	  			this.panInsideBounds(this.options.maxBounds);
	  		}
	  	},

	  	_checkIfLoaded: function () {
	  		if (!this._loaded) {
	  			throw new Error('Set map center and zoom first.');
	  		}
	  	},

	  	// DOM event handling

	  	// @section Interaction events
	  	_initEvents: function (remove$$1) {
	  		this._targets = {};
	  		this._targets[stamp(this._container)] = this;

	  		var onOff = remove$$1 ? off : on;

	  		// @event click: MouseEvent
	  		// Fired when the user clicks (or taps) the map.
	  		// @event dblclick: MouseEvent
	  		// Fired when the user double-clicks (or double-taps) the map.
	  		// @event mousedown: MouseEvent
	  		// Fired when the user pushes the mouse button on the map.
	  		// @event mouseup: MouseEvent
	  		// Fired when the user releases the mouse button on the map.
	  		// @event mouseover: MouseEvent
	  		// Fired when the mouse enters the map.
	  		// @event mouseout: MouseEvent
	  		// Fired when the mouse leaves the map.
	  		// @event mousemove: MouseEvent
	  		// Fired while the mouse moves over the map.
	  		// @event contextmenu: MouseEvent
	  		// Fired when the user pushes the right mouse button on the map, prevents
	  		// default browser context menu from showing if there are listeners on
	  		// this event. Also fired on mobile when the user holds a single touch
	  		// for a second (also called long press).
	  		// @event keypress: KeyboardEvent
	  		// Fired when the user presses a key from the keyboard that produces a character value while the map is focused.
	  		// @event keydown: KeyboardEvent
	  		// Fired when the user presses a key from the keyboard while the map is focused. Unlike the `keypress` event,
	  		// the `keydown` event is fired for keys that produce a character value and for keys
	  		// that do not produce a character value.
	  		// @event keyup: KeyboardEvent
	  		// Fired when the user releases a key from the keyboard while the map is focused.
	  		onOff(this._container, 'click dblclick mousedown mouseup ' +
	  			'mouseover mouseout mousemove contextmenu keypress keydown keyup', this._handleDOMEvent, this);

	  		if (this.options.trackResize) {
	  			onOff(window, 'resize', this._onResize, this);
	  		}

	  		if (any3d && this.options.transform3DLimit) {
	  			(remove$$1 ? this.off : this.on).call(this, 'moveend', this._onMoveEnd);
	  		}
	  	},

	  	_onResize: function () {
	  		cancelAnimFrame(this._resizeRequest);
	  		this._resizeRequest = requestAnimFrame(
	  		        function () { this.invalidateSize({debounceMoveend: true}); }, this);
	  	},

	  	_onScroll: function () {
	  		this._container.scrollTop  = 0;
	  		this._container.scrollLeft = 0;
	  	},

	  	_onMoveEnd: function () {
	  		var pos = this._getMapPanePos();
	  		if (Math.max(Math.abs(pos.x), Math.abs(pos.y)) >= this.options.transform3DLimit) {
	  			// https://bugzilla.mozilla.org/show_bug.cgi?id=1203873 but Webkit also have
	  			// a pixel offset on very high values, see: http://jsfiddle.net/dg6r5hhb/
	  			this._resetView(this.getCenter(), this.getZoom());
	  		}
	  	},

	  	_findEventTargets: function (e, type) {
	  		var targets = [],
	  		    target,
	  		    isHover = type === 'mouseout' || type === 'mouseover',
	  		    src = e.target || e.srcElement,
	  		    dragging = false;

	  		while (src) {
	  			target = this._targets[stamp(src)];
	  			if (target && (type === 'click' || type === 'preclick') && !e._simulated && this._draggableMoved(target)) {
	  				// Prevent firing click after you just dragged an object.
	  				dragging = true;
	  				break;
	  			}
	  			if (target && target.listens(type, true)) {
	  				if (isHover && !isExternalTarget(src, e)) { break; }
	  				targets.push(target);
	  				if (isHover) { break; }
	  			}
	  			if (src === this._container) { break; }
	  			src = src.parentNode;
	  		}
	  		if (!targets.length && !dragging && !isHover && isExternalTarget(src, e)) {
	  			targets = [this];
	  		}
	  		return targets;
	  	},

	  	_handleDOMEvent: function (e) {
	  		if (!this._loaded || skipped(e)) { return; }

	  		var type = e.type;

	  		if (type === 'mousedown' || type === 'keypress' || type === 'keyup' || type === 'keydown') {
	  			// prevents outline when clicking on keyboard-focusable element
	  			preventOutline(e.target || e.srcElement);
	  		}

	  		this._fireDOMEvent(e, type);
	  	},

	  	_mouseEvents: ['click', 'dblclick', 'mouseover', 'mouseout', 'contextmenu'],

	  	_fireDOMEvent: function (e, type, targets) {

	  		if (e.type === 'click') {
	  			// Fire a synthetic 'preclick' event which propagates up (mainly for closing popups).
	  			// @event preclick: MouseEvent
	  			// Fired before mouse click on the map (sometimes useful when you
	  			// want something to happen on click before any existing click
	  			// handlers start running).
	  			var synth = extend({}, e);
	  			synth.type = 'preclick';
	  			this._fireDOMEvent(synth, synth.type, targets);
	  		}

	  		if (e._stopped) { return; }

	  		// Find the layer the event is propagating from and its parents.
	  		targets = (targets || []).concat(this._findEventTargets(e, type));

	  		if (!targets.length) { return; }

	  		var target = targets[0];
	  		if (type === 'contextmenu' && target.listens(type, true)) {
	  			preventDefault(e);
	  		}

	  		var data = {
	  			originalEvent: e
	  		};

	  		if (e.type !== 'keypress' && e.type !== 'keydown' && e.type !== 'keyup') {
	  			var isMarker = target.getLatLng && (!target._radius || target._radius <= 10);
	  			data.containerPoint = isMarker ?
	  				this.latLngToContainerPoint(target.getLatLng()) : this.mouseEventToContainerPoint(e);
	  			data.layerPoint = this.containerPointToLayerPoint(data.containerPoint);
	  			data.latlng = isMarker ? target.getLatLng() : this.layerPointToLatLng(data.layerPoint);
	  		}

	  		for (var i = 0; i < targets.length; i++) {
	  			targets[i].fire(type, data, true);
	  			if (data.originalEvent._stopped ||
	  				(targets[i].options.bubblingMouseEvents === false && indexOf(this._mouseEvents, type) !== -1)) { return; }
	  		}
	  	},

	  	_draggableMoved: function (obj) {
	  		obj = obj.dragging && obj.dragging.enabled() ? obj : this;
	  		return (obj.dragging && obj.dragging.moved()) || (this.boxZoom && this.boxZoom.moved());
	  	},

	  	_clearHandlers: function () {
	  		for (var i = 0, len = this._handlers.length; i < len; i++) {
	  			this._handlers[i].disable();
	  		}
	  	},

	  	// @section Other Methods

	  	// @method whenReady(fn: Function, context?: Object): this
	  	// Runs the given function `fn` when the map gets initialized with
	  	// a view (center and zoom) and at least one layer, or immediately
	  	// if it's already initialized, optionally passing a function context.
	  	whenReady: function (callback, context) {
	  		if (this._loaded) {
	  			callback.call(context || this, {target: this});
	  		} else {
	  			this.on('load', callback, context);
	  		}
	  		return this;
	  	},


	  	// private methods for getting map state

	  	_getMapPanePos: function () {
	  		return getPosition(this._mapPane) || new Point(0, 0);
	  	},

	  	_moved: function () {
	  		var pos = this._getMapPanePos();
	  		return pos && !pos.equals([0, 0]);
	  	},

	  	_getTopLeftPoint: function (center, zoom) {
	  		var pixelOrigin = center && zoom !== undefined ?
	  			this._getNewPixelOrigin(center, zoom) :
	  			this.getPixelOrigin();
	  		return pixelOrigin.subtract(this._getMapPanePos());
	  	},

	  	_getNewPixelOrigin: function (center, zoom) {
	  		var viewHalf = this.getSize()._divideBy(2);
	  		return this.project(center, zoom)._subtract(viewHalf)._add(this._getMapPanePos())._round();
	  	},

	  	_latLngToNewLayerPoint: function (latlng, zoom, center) {
	  		var topLeft = this._getNewPixelOrigin(center, zoom);
	  		return this.project(latlng, zoom)._subtract(topLeft);
	  	},

	  	_latLngBoundsToNewLayerBounds: function (latLngBounds, zoom, center) {
	  		var topLeft = this._getNewPixelOrigin(center, zoom);
	  		return toBounds([
	  			this.project(latLngBounds.getSouthWest(), zoom)._subtract(topLeft),
	  			this.project(latLngBounds.getNorthWest(), zoom)._subtract(topLeft),
	  			this.project(latLngBounds.getSouthEast(), zoom)._subtract(topLeft),
	  			this.project(latLngBounds.getNorthEast(), zoom)._subtract(topLeft)
	  		]);
	  	},

	  	// layer point of the current center
	  	_getCenterLayerPoint: function () {
	  		return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
	  	},

	  	// offset of the specified place to the current center in pixels
	  	_getCenterOffset: function (latlng) {
	  		return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());
	  	},

	  	// adjust center for view to get inside bounds
	  	_limitCenter: function (center, zoom, bounds) {

	  		if (!bounds) { return center; }

	  		var centerPoint = this.project(center, zoom),
	  		    viewHalf = this.getSize().divideBy(2),
	  		    viewBounds = new Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf)),
	  		    offset = this._getBoundsOffset(viewBounds, bounds, zoom);

	  		// If offset is less than a pixel, ignore.
	  		// This prevents unstable projections from getting into
	  		// an infinite loop of tiny offsets.
	  		if (offset.round().equals([0, 0])) {
	  			return center;
	  		}

	  		return this.unproject(centerPoint.add(offset), zoom);
	  	},

	  	// adjust offset for view to get inside bounds
	  	_limitOffset: function (offset, bounds) {
	  		if (!bounds) { return offset; }

	  		var viewBounds = this.getPixelBounds(),
	  		    newBounds = new Bounds(viewBounds.min.add(offset), viewBounds.max.add(offset));

	  		return offset.add(this._getBoundsOffset(newBounds, bounds));
	  	},

	  	// returns offset needed for pxBounds to get inside maxBounds at a specified zoom
	  	_getBoundsOffset: function (pxBounds, maxBounds, zoom) {
	  		var projectedMaxBounds = toBounds(
	  		        this.project(maxBounds.getNorthEast(), zoom),
	  		        this.project(maxBounds.getSouthWest(), zoom)
	  		    ),
	  		    minOffset = projectedMaxBounds.min.subtract(pxBounds.min),
	  		    maxOffset = projectedMaxBounds.max.subtract(pxBounds.max),

	  		    dx = this._rebound(minOffset.x, -maxOffset.x),
	  		    dy = this._rebound(minOffset.y, -maxOffset.y);

	  		return new Point(dx, dy);
	  	},

	  	_rebound: function (left, right) {
	  		return left + right > 0 ?
	  			Math.round(left - right) / 2 :
	  			Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right));
	  	},

	  	_limitZoom: function (zoom) {
	  		var min = this.getMinZoom(),
	  		    max = this.getMaxZoom(),
	  		    snap = any3d ? this.options.zoomSnap : 1;
	  		if (snap) {
	  			zoom = Math.round(zoom / snap) * snap;
	  		}
	  		return Math.max(min, Math.min(max, zoom));
	  	},

	  	_onPanTransitionStep: function () {
	  		this.fire('move');
	  	},

	  	_onPanTransitionEnd: function () {
	  		removeClass(this._mapPane, 'leaflet-pan-anim');
	  		this.fire('moveend');
	  	},

	  	_tryAnimatedPan: function (center, options) {
	  		// difference between the new and current centers in pixels
	  		var offset = this._getCenterOffset(center)._trunc();

	  		// don't animate too far unless animate: true specified in options
	  		if ((options && options.animate) !== true && !this.getSize().contains(offset)) { return false; }

	  		this.panBy(offset, options);

	  		return true;
	  	},

	  	_createAnimProxy: function () {

	  		var proxy = this._proxy = create$1('div', 'leaflet-proxy leaflet-zoom-animated');
	  		this._panes.mapPane.appendChild(proxy);

	  		this.on('zoomanim', function (e) {
	  			var prop = TRANSFORM,
	  			    transform = this._proxy.style[prop];

	  			setTransform(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1));

	  			// workaround for case when transform is the same and so transitionend event is not fired
	  			if (transform === this._proxy.style[prop] && this._animatingZoom) {
	  				this._onZoomTransitionEnd();
	  			}
	  		}, this);

	  		this.on('load moveend', this._animMoveEnd, this);

	  		this._on('unload', this._destroyAnimProxy, this);
	  	},

	  	_destroyAnimProxy: function () {
	  		remove(this._proxy);
	  		this.off('load moveend', this._animMoveEnd, this);
	  		delete this._proxy;
	  	},

	  	_animMoveEnd: function () {
	  		var c = this.getCenter(),
	  		    z = this.getZoom();
	  		setTransform(this._proxy, this.project(c, z), this.getZoomScale(z, 1));
	  	},

	  	_catchTransitionEnd: function (e) {
	  		if (this._animatingZoom && e.propertyName.indexOf('transform') >= 0) {
	  			this._onZoomTransitionEnd();
	  		}
	  	},

	  	_nothingToAnimate: function () {
	  		return !this._container.getElementsByClassName('leaflet-zoom-animated').length;
	  	},

	  	_tryAnimatedZoom: function (center, zoom, options) {

	  		if (this._animatingZoom) { return true; }

	  		options = options || {};

	  		// don't animate if disabled, not supported or zoom difference is too large
	  		if (!this._zoomAnimated || options.animate === false || this._nothingToAnimate() ||
	  		        Math.abs(zoom - this._zoom) > this.options.zoomAnimationThreshold) { return false; }

	  		// offset is the pixel coords of the zoom origin relative to the current center
	  		var scale = this.getZoomScale(zoom),
	  		    offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale);

	  		// don't animate if the zoom origin isn't within one screen from the current center, unless forced
	  		if (options.animate !== true && !this.getSize().contains(offset)) { return false; }

	  		requestAnimFrame(function () {
	  			this
	  			    ._moveStart(true, false)
	  			    ._animateZoom(center, zoom, true);
	  		}, this);

	  		return true;
	  	},

	  	_animateZoom: function (center, zoom, startAnim, noUpdate) {
	  		if (!this._mapPane) { return; }

	  		if (startAnim) {
	  			this._animatingZoom = true;

	  			// remember what center/zoom to set after animation
	  			this._animateToCenter = center;
	  			this._animateToZoom = zoom;

	  			addClass(this._mapPane, 'leaflet-zoom-anim');
	  		}

	  		// @section Other Events
	  		// @event zoomanim: ZoomAnimEvent
	  		// Fired at least once per zoom animation. For continuous zoom, like pinch zooming, fired once per frame during zoom.
	  		this.fire('zoomanim', {
	  			center: center,
	  			zoom: zoom,
	  			noUpdate: noUpdate
	  		});

	  		// Work around webkit not firing 'transitionend', see https://github.com/Leaflet/Leaflet/issues/3689, 2693
	  		setTimeout(bind(this._onZoomTransitionEnd, this), 250);
	  	},

	  	_onZoomTransitionEnd: function () {
	  		if (!this._animatingZoom) { return; }

	  		if (this._mapPane) {
	  			removeClass(this._mapPane, 'leaflet-zoom-anim');
	  		}

	  		this._animatingZoom = false;

	  		this._move(this._animateToCenter, this._animateToZoom);

	  		// This anim frame should prevent an obscure iOS webkit tile loading race condition.
	  		requestAnimFrame(function () {
	  			this._moveEnd(true);
	  		}, this);
	  	}
	  });

	  // @section

	  // @factory L.map(id: String, options?: Map options)
	  // Instantiates a map object given the DOM ID of a `<div>` element
	  // and optionally an object literal with `Map options`.
	  //
	  // @alternative
	  // @factory L.map(el: HTMLElement, options?: Map options)
	  // Instantiates a map object given an instance of a `<div>` HTML element
	  // and optionally an object literal with `Map options`.
	  function createMap(id, options) {
	  	return new Map(id, options);
	  }

	  /*
	   * @class Control
	   * @aka L.Control
	   * @inherits Class
	   *
	   * L.Control is a base class for implementing map controls. Handles positioning.
	   * All other controls extend from this class.
	   */

	  var Control = Class.extend({
	  	// @section
	  	// @aka Control options
	  	options: {
	  		// @option position: String = 'topright'
	  		// The position of the control (one of the map corners). Possible values are `'topleft'`,
	  		// `'topright'`, `'bottomleft'` or `'bottomright'`
	  		position: 'topright'
	  	},

	  	initialize: function (options) {
	  		setOptions(this, options);
	  	},

	  	/* @section
	  	 * Classes extending L.Control will inherit the following methods:
	  	 *
	  	 * @method getPosition: string
	  	 * Returns the position of the control.
	  	 */
	  	getPosition: function () {
	  		return this.options.position;
	  	},

	  	// @method setPosition(position: string): this
	  	// Sets the position of the control.
	  	setPosition: function (position) {
	  		var map = this._map;

	  		if (map) {
	  			map.removeControl(this);
	  		}

	  		this.options.position = position;

	  		if (map) {
	  			map.addControl(this);
	  		}

	  		return this;
	  	},

	  	// @method getContainer: HTMLElement
	  	// Returns the HTMLElement that contains the control.
	  	getContainer: function () {
	  		return this._container;
	  	},

	  	// @method addTo(map: Map): this
	  	// Adds the control to the given map.
	  	addTo: function (map) {
	  		this.remove();
	  		this._map = map;

	  		var container = this._container = this.onAdd(map),
	  		    pos = this.getPosition(),
	  		    corner = map._controlCorners[pos];

	  		addClass(container, 'leaflet-control');

	  		if (pos.indexOf('bottom') !== -1) {
	  			corner.insertBefore(container, corner.firstChild);
	  		} else {
	  			corner.appendChild(container);
	  		}

	  		this._map.on('unload', this.remove, this);

	  		return this;
	  	},

	  	// @method remove: this
	  	// Removes the control from the map it is currently active on.
	  	remove: function () {
	  		if (!this._map) {
	  			return this;
	  		}

	  		remove(this._container);

	  		if (this.onRemove) {
	  			this.onRemove(this._map);
	  		}

	  		this._map.off('unload', this.remove, this);
	  		this._map = null;

	  		return this;
	  	},

	  	_refocusOnMap: function (e) {
	  		// if map exists and event is not a keyboard event
	  		if (this._map && e && e.screenX > 0 && e.screenY > 0) {
	  			this._map.getContainer().focus();
	  		}
	  	}
	  });

	  var control = function (options) {
	  	return new Control(options);
	  };

	  /* @section Extension methods
	   * @uninheritable
	   *
	   * Every control should extend from `L.Control` and (re-)implement the following methods.
	   *
	   * @method onAdd(map: Map): HTMLElement
	   * Should return the container DOM element for the control and add listeners on relevant map events. Called on [`control.addTo(map)`](#control-addTo).
	   *
	   * @method onRemove(map: Map)
	   * Optional method. Should contain all clean up code that removes the listeners previously added in [`onAdd`](#control-onadd). Called on [`control.remove()`](#control-remove).
	   */

	  /* @namespace Map
	   * @section Methods for Layers and Controls
	   */
	  Map.include({
	  	// @method addControl(control: Control): this
	  	// Adds the given control to the map
	  	addControl: function (control) {
	  		control.addTo(this);
	  		return this;
	  	},

	  	// @method removeControl(control: Control): this
	  	// Removes the given control from the map
	  	removeControl: function (control) {
	  		control.remove();
	  		return this;
	  	},

	  	_initControlPos: function () {
	  		var corners = this._controlCorners = {},
	  		    l = 'leaflet-',
	  		    container = this._controlContainer =
	  		            create$1('div', l + 'control-container', this._container);

	  		function createCorner(vSide, hSide) {
	  			var className = l + vSide + ' ' + l + hSide;

	  			corners[vSide + hSide] = create$1('div', className, container);
	  		}

	  		createCorner('top', 'left');
	  		createCorner('top', 'right');
	  		createCorner('bottom', 'left');
	  		createCorner('bottom', 'right');
	  	},

	  	_clearControlPos: function () {
	  		for (var i in this._controlCorners) {
	  			remove(this._controlCorners[i]);
	  		}
	  		remove(this._controlContainer);
	  		delete this._controlCorners;
	  		delete this._controlContainer;
	  	}
	  });

	  /*
	   * @class Control.Layers
	   * @aka L.Control.Layers
	   * @inherits Control
	   *
	   * The layers control gives users the ability to switch between different base layers and switch overlays on/off (check out the [detailed example](http://leafletjs.com/examples/layers-control/)). Extends `Control`.
	   *
	   * @example
	   *
	   * ```js
	   * var baseLayers = {
	   * 	"Mapbox": mapbox,
	   * 	"OpenStreetMap": osm
	   * };
	   *
	   * var overlays = {
	   * 	"Marker": marker,
	   * 	"Roads": roadsLayer
	   * };
	   *
	   * L.control.layers(baseLayers, overlays).addTo(map);
	   * ```
	   *
	   * The `baseLayers` and `overlays` parameters are object literals with layer names as keys and `Layer` objects as values:
	   *
	   * ```js
	   * {
	   *     "<someName1>": layer1,
	   *     "<someName2>": layer2
	   * }
	   * ```
	   *
	   * The layer names can contain HTML, which allows you to add additional styling to the items:
	   *
	   * ```js
	   * {"<img src='my-layer-icon' /> <span class='my-layer-item'>My Layer</span>": myLayer}
	   * ```
	   */

	  var Layers = Control.extend({
	  	// @section
	  	// @aka Control.Layers options
	  	options: {
	  		// @option collapsed: Boolean = true
	  		// If `true`, the control will be collapsed into an icon and expanded on mouse hover or touch.
	  		collapsed: true,
	  		position: 'topright',

	  		// @option autoZIndex: Boolean = true
	  		// If `true`, the control will assign zIndexes in increasing order to all of its layers so that the order is preserved when switching them on/off.
	  		autoZIndex: true,

	  		// @option hideSingleBase: Boolean = false
	  		// If `true`, the base layers in the control will be hidden when there is only one.
	  		hideSingleBase: false,

	  		// @option sortLayers: Boolean = false
	  		// Whether to sort the layers. When `false`, layers will keep the order
	  		// in which they were added to the control.
	  		sortLayers: false,

	  		// @option sortFunction: Function = *
	  		// A [compare function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
	  		// that will be used for sorting the layers, when `sortLayers` is `true`.
	  		// The function receives both the `L.Layer` instances and their names, as in
	  		// `sortFunction(layerA, layerB, nameA, nameB)`.
	  		// By default, it sorts layers alphabetically by their name.
	  		sortFunction: function (layerA, layerB, nameA, nameB) {
	  			return nameA < nameB ? -1 : (nameB < nameA ? 1 : 0);
	  		}
	  	},

	  	initialize: function (baseLayers, overlays, options) {
	  		setOptions(this, options);

	  		this._layerControlInputs = [];
	  		this._layers = [];
	  		this._lastZIndex = 0;
	  		this._handlingClick = false;

	  		for (var i in baseLayers) {
	  			this._addLayer(baseLayers[i], i);
	  		}

	  		for (i in overlays) {
	  			this._addLayer(overlays[i], i, true);
	  		}
	  	},

	  	onAdd: function (map) {
	  		this._initLayout();
	  		this._update();

	  		this._map = map;
	  		map.on('zoomend', this._checkDisabledLayers, this);

	  		for (var i = 0; i < this._layers.length; i++) {
	  			this._layers[i].layer.on('add remove', this._onLayerChange, this);
	  		}

	  		return this._container;
	  	},

	  	addTo: function (map) {
	  		Control.prototype.addTo.call(this, map);
	  		// Trigger expand after Layers Control has been inserted into DOM so that is now has an actual height.
	  		return this._expandIfNotCollapsed();
	  	},

	  	onRemove: function () {
	  		this._map.off('zoomend', this._checkDisabledLayers, this);

	  		for (var i = 0; i < this._layers.length; i++) {
	  			this._layers[i].layer.off('add remove', this._onLayerChange, this);
	  		}
	  	},

	  	// @method addBaseLayer(layer: Layer, name: String): this
	  	// Adds a base layer (radio button entry) with the given name to the control.
	  	addBaseLayer: function (layer, name) {
	  		this._addLayer(layer, name);
	  		return (this._map) ? this._update() : this;
	  	},

	  	// @method addOverlay(layer: Layer, name: String): this
	  	// Adds an overlay (checkbox entry) with the given name to the control.
	  	addOverlay: function (layer, name) {
	  		this._addLayer(layer, name, true);
	  		return (this._map) ? this._update() : this;
	  	},

	  	// @method removeLayer(layer: Layer): this
	  	// Remove the given layer from the control.
	  	removeLayer: function (layer) {
	  		layer.off('add remove', this._onLayerChange, this);

	  		var obj = this._getLayer(stamp(layer));
	  		if (obj) {
	  			this._layers.splice(this._layers.indexOf(obj), 1);
	  		}
	  		return (this._map) ? this._update() : this;
	  	},

	  	// @method expand(): this
	  	// Expand the control container if collapsed.
	  	expand: function () {
	  		addClass(this._container, 'leaflet-control-layers-expanded');
	  		this._section.style.height = null;
	  		var acceptableHeight = this._map.getSize().y - (this._container.offsetTop + 50);
	  		if (acceptableHeight < this._section.clientHeight) {
	  			addClass(this._section, 'leaflet-control-layers-scrollbar');
	  			this._section.style.height = acceptableHeight + 'px';
	  		} else {
	  			removeClass(this._section, 'leaflet-control-layers-scrollbar');
	  		}
	  		this._checkDisabledLayers();
	  		return this;
	  	},

	  	// @method collapse(): this
	  	// Collapse the control container if expanded.
	  	collapse: function () {
	  		removeClass(this._container, 'leaflet-control-layers-expanded');
	  		return this;
	  	},

	  	_initLayout: function () {
	  		var className = 'leaflet-control-layers',
	  		    container = this._container = create$1('div', className),
	  		    collapsed = this.options.collapsed;

	  		// makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
	  		container.setAttribute('aria-haspopup', true);

	  		disableClickPropagation(container);
	  		disableScrollPropagation(container);

	  		var section = this._section = create$1('section', className + '-list');

	  		if (collapsed) {
	  			this._map.on('click', this.collapse, this);

	  			if (!android) {
	  				on(container, {
	  					mouseenter: this.expand,
	  					mouseleave: this.collapse
	  				}, this);
	  			}
	  		}

	  		var link = this._layersLink = create$1('a', className + '-toggle', container);
	  		link.href = '#';
	  		link.title = 'Layers';

	  		if (touch) {
	  			on(link, 'click', stop);
	  			on(link, 'click', this.expand, this);
	  		} else {
	  			on(link, 'focus', this.expand, this);
	  		}

	  		if (!collapsed) {
	  			this.expand();
	  		}

	  		this._baseLayersList = create$1('div', className + '-base', section);
	  		this._separator = create$1('div', className + '-separator', section);
	  		this._overlaysList = create$1('div', className + '-overlays', section);

	  		container.appendChild(section);
	  	},

	  	_getLayer: function (id) {
	  		for (var i = 0; i < this._layers.length; i++) {

	  			if (this._layers[i] && stamp(this._layers[i].layer) === id) {
	  				return this._layers[i];
	  			}
	  		}
	  	},

	  	_addLayer: function (layer, name, overlay) {
	  		if (this._map) {
	  			layer.on('add remove', this._onLayerChange, this);
	  		}

	  		this._layers.push({
	  			layer: layer,
	  			name: name,
	  			overlay: overlay
	  		});

	  		if (this.options.sortLayers) {
	  			this._layers.sort(bind(function (a, b) {
	  				return this.options.sortFunction(a.layer, b.layer, a.name, b.name);
	  			}, this));
	  		}

	  		if (this.options.autoZIndex && layer.setZIndex) {
	  			this._lastZIndex++;
	  			layer.setZIndex(this._lastZIndex);
	  		}

	  		this._expandIfNotCollapsed();
	  	},

	  	_update: function () {
	  		if (!this._container) { return this; }

	  		empty(this._baseLayersList);
	  		empty(this._overlaysList);

	  		this._layerControlInputs = [];
	  		var baseLayersPresent, overlaysPresent, i, obj, baseLayersCount = 0;

	  		for (i = 0; i < this._layers.length; i++) {
	  			obj = this._layers[i];
	  			this._addItem(obj);
	  			overlaysPresent = overlaysPresent || obj.overlay;
	  			baseLayersPresent = baseLayersPresent || !obj.overlay;
	  			baseLayersCount += !obj.overlay ? 1 : 0;
	  		}

	  		// Hide base layers section if there's only one layer.
	  		if (this.options.hideSingleBase) {
	  			baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
	  			this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
	  		}

	  		this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

	  		return this;
	  	},

	  	_onLayerChange: function (e) {
	  		if (!this._handlingClick) {
	  			this._update();
	  		}

	  		var obj = this._getLayer(stamp(e.target));

	  		// @namespace Map
	  		// @section Layer events
	  		// @event baselayerchange: LayersControlEvent
	  		// Fired when the base layer is changed through the [layers control](#control-layers).
	  		// @event overlayadd: LayersControlEvent
	  		// Fired when an overlay is selected through the [layers control](#control-layers).
	  		// @event overlayremove: LayersControlEvent
	  		// Fired when an overlay is deselected through the [layers control](#control-layers).
	  		// @namespace Control.Layers
	  		var type = obj.overlay ?
	  			(e.type === 'add' ? 'overlayadd' : 'overlayremove') :
	  			(e.type === 'add' ? 'baselayerchange' : null);

	  		if (type) {
	  			this._map.fire(type, obj);
	  		}
	  	},

	  	// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
	  	_createRadioElement: function (name, checked) {

	  		var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' +
	  				name + '"' + (checked ? ' checked="checked"' : '') + '/>';

	  		var radioFragment = document.createElement('div');
	  		radioFragment.innerHTML = radioHtml;

	  		return radioFragment.firstChild;
	  	},

	  	_addItem: function (obj) {
	  		var label = document.createElement('label'),
	  		    checked = this._map.hasLayer(obj.layer),
	  		    input;

	  		if (obj.overlay) {
	  			input = document.createElement('input');
	  			input.type = 'checkbox';
	  			input.className = 'leaflet-control-layers-selector';
	  			input.defaultChecked = checked;
	  		} else {
	  			input = this._createRadioElement('leaflet-base-layers_' + stamp(this), checked);
	  		}

	  		this._layerControlInputs.push(input);
	  		input.layerId = stamp(obj.layer);

	  		on(input, 'click', this._onInputClick, this);

	  		var name = document.createElement('span');
	  		name.innerHTML = ' ' + obj.name;

	  		// Helps from preventing layer control flicker when checkboxes are disabled
	  		// https://github.com/Leaflet/Leaflet/issues/2771
	  		var holder = document.createElement('div');

	  		label.appendChild(holder);
	  		holder.appendChild(input);
	  		holder.appendChild(name);

	  		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
	  		container.appendChild(label);

	  		this._checkDisabledLayers();
	  		return label;
	  	},

	  	_onInputClick: function () {
	  		var inputs = this._layerControlInputs,
	  		    input, layer;
	  		var addedLayers = [],
	  		    removedLayers = [];

	  		this._handlingClick = true;

	  		for (var i = inputs.length - 1; i >= 0; i--) {
	  			input = inputs[i];
	  			layer = this._getLayer(input.layerId).layer;

	  			if (input.checked) {
	  				addedLayers.push(layer);
	  			} else if (!input.checked) {
	  				removedLayers.push(layer);
	  			}
	  		}

	  		// Bugfix issue 2318: Should remove all old layers before readding new ones
	  		for (i = 0; i < removedLayers.length; i++) {
	  			if (this._map.hasLayer(removedLayers[i])) {
	  				this._map.removeLayer(removedLayers[i]);
	  			}
	  		}
	  		for (i = 0; i < addedLayers.length; i++) {
	  			if (!this._map.hasLayer(addedLayers[i])) {
	  				this._map.addLayer(addedLayers[i]);
	  			}
	  		}

	  		this._handlingClick = false;

	  		this._refocusOnMap();
	  	},

	  	_checkDisabledLayers: function () {
	  		var inputs = this._layerControlInputs,
	  		    input,
	  		    layer,
	  		    zoom = this._map.getZoom();

	  		for (var i = inputs.length - 1; i >= 0; i--) {
	  			input = inputs[i];
	  			layer = this._getLayer(input.layerId).layer;
	  			input.disabled = (layer.options.minZoom !== undefined && zoom < layer.options.minZoom) ||
	  			                 (layer.options.maxZoom !== undefined && zoom > layer.options.maxZoom);

	  		}
	  	},

	  	_expandIfNotCollapsed: function () {
	  		if (this._map && !this.options.collapsed) {
	  			this.expand();
	  		}
	  		return this;
	  	},

	  	_expand: function () {
	  		// Backward compatibility, remove me in 1.1.
	  		return this.expand();
	  	},

	  	_collapse: function () {
	  		// Backward compatibility, remove me in 1.1.
	  		return this.collapse();
	  	}

	  });


	  // @factory L.control.layers(baselayers?: Object, overlays?: Object, options?: Control.Layers options)
	  // Creates a layers control with the given layers. Base layers will be switched with radio buttons, while overlays will be switched with checkboxes. Note that all base layers should be passed in the base layers object, but only one should be added to the map during map instantiation.
	  var layers = function (baseLayers, overlays, options) {
	  	return new Layers(baseLayers, overlays, options);
	  };

	  /*
	   * @class Control.Zoom
	   * @aka L.Control.Zoom
	   * @inherits Control
	   *
	   * A basic zoom control with two buttons (zoom in and zoom out). It is put on the map by default unless you set its [`zoomControl` option](#map-zoomcontrol) to `false`. Extends `Control`.
	   */

	  var Zoom = Control.extend({
	  	// @section
	  	// @aka Control.Zoom options
	  	options: {
	  		position: 'topleft',

	  		// @option zoomInText: String = '+'
	  		// The text set on the 'zoom in' button.
	  		zoomInText: '+',

	  		// @option zoomInTitle: String = 'Zoom in'
	  		// The title set on the 'zoom in' button.
	  		zoomInTitle: 'Zoom in',

	  		// @option zoomOutText: String = '&#x2212;'
	  		// The text set on the 'zoom out' button.
	  		zoomOutText: '&#x2212;',

	  		// @option zoomOutTitle: String = 'Zoom out'
	  		// The title set on the 'zoom out' button.
	  		zoomOutTitle: 'Zoom out'
	  	},

	  	onAdd: function (map) {
	  		var zoomName = 'leaflet-control-zoom',
	  		    container = create$1('div', zoomName + ' leaflet-bar'),
	  		    options = this.options;

	  		this._zoomInButton  = this._createButton(options.zoomInText, options.zoomInTitle,
	  		        zoomName + '-in',  container, this._zoomIn);
	  		this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
	  		        zoomName + '-out', container, this._zoomOut);

	  		this._updateDisabled();
	  		map.on('zoomend zoomlevelschange', this._updateDisabled, this);

	  		return container;
	  	},

	  	onRemove: function (map) {
	  		map.off('zoomend zoomlevelschange', this._updateDisabled, this);
	  	},

	  	disable: function () {
	  		this._disabled = true;
	  		this._updateDisabled();
	  		return this;
	  	},

	  	enable: function () {
	  		this._disabled = false;
	  		this._updateDisabled();
	  		return this;
	  	},

	  	_zoomIn: function (e) {
	  		if (!this._disabled && this._map._zoom < this._map.getMaxZoom()) {
	  			this._map.zoomIn(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
	  		}
	  	},

	  	_zoomOut: function (e) {
	  		if (!this._disabled && this._map._zoom > this._map.getMinZoom()) {
	  			this._map.zoomOut(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
	  		}
	  	},

	  	_createButton: function (html, title, className, container, fn) {
	  		var link = create$1('a', className, container);
	  		link.innerHTML = html;
	  		link.href = '#';
	  		link.title = title;

	  		/*
	  		 * Will force screen readers like VoiceOver to read this as "Zoom in - button"
	  		 */
	  		link.setAttribute('role', 'button');
	  		link.setAttribute('aria-label', title);

	  		disableClickPropagation(link);
	  		on(link, 'click', stop);
	  		on(link, 'click', fn, this);
	  		on(link, 'click', this._refocusOnMap, this);

	  		return link;
	  	},

	  	_updateDisabled: function () {
	  		var map = this._map,
	  		    className = 'leaflet-disabled';

	  		removeClass(this._zoomInButton, className);
	  		removeClass(this._zoomOutButton, className);

	  		if (this._disabled || map._zoom === map.getMinZoom()) {
	  			addClass(this._zoomOutButton, className);
	  		}
	  		if (this._disabled || map._zoom === map.getMaxZoom()) {
	  			addClass(this._zoomInButton, className);
	  		}
	  	}
	  });

	  // @namespace Map
	  // @section Control options
	  // @option zoomControl: Boolean = true
	  // Whether a [zoom control](#control-zoom) is added to the map by default.
	  Map.mergeOptions({
	  	zoomControl: true
	  });

	  Map.addInitHook(function () {
	  	if (this.options.zoomControl) {
	  		// @section Controls
	  		// @property zoomControl: Control.Zoom
	  		// The default zoom control (only available if the
	  		// [`zoomControl` option](#map-zoomcontrol) was `true` when creating the map).
	  		this.zoomControl = new Zoom();
	  		this.addControl(this.zoomControl);
	  	}
	  });

	  // @namespace Control.Zoom
	  // @factory L.control.zoom(options: Control.Zoom options)
	  // Creates a zoom control
	  var zoom = function (options) {
	  	return new Zoom(options);
	  };

	  /*
	   * @class Control.Scale
	   * @aka L.Control.Scale
	   * @inherits Control
	   *
	   * A simple scale control that shows the scale of the current center of screen in metric (m/km) and imperial (mi/ft) systems. Extends `Control`.
	   *
	   * @example
	   *
	   * ```js
	   * L.control.scale().addTo(map);
	   * ```
	   */

	  var Scale = Control.extend({
	  	// @section
	  	// @aka Control.Scale options
	  	options: {
	  		position: 'bottomleft',

	  		// @option maxWidth: Number = 100
	  		// Maximum width of the control in pixels. The width is set dynamically to show round values (e.g. 100, 200, 500).
	  		maxWidth: 100,

	  		// @option metric: Boolean = True
	  		// Whether to show the metric scale line (m/km).
	  		metric: true,

	  		// @option imperial: Boolean = True
	  		// Whether to show the imperial scale line (mi/ft).
	  		imperial: true

	  		// @option updateWhenIdle: Boolean = false
	  		// If `true`, the control is updated on [`moveend`](#map-moveend), otherwise it's always up-to-date (updated on [`move`](#map-move)).
	  	},

	  	onAdd: function (map) {
	  		var className = 'leaflet-control-scale',
	  		    container = create$1('div', className),
	  		    options = this.options;

	  		this._addScales(options, className + '-line', container);

	  		map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
	  		map.whenReady(this._update, this);

	  		return container;
	  	},

	  	onRemove: function (map) {
	  		map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
	  	},

	  	_addScales: function (options, className, container) {
	  		if (options.metric) {
	  			this._mScale = create$1('div', className, container);
	  		}
	  		if (options.imperial) {
	  			this._iScale = create$1('div', className, container);
	  		}
	  	},

	  	_update: function () {
	  		var map = this._map,
	  		    y = map.getSize().y / 2;

	  		var maxMeters = map.distance(
	  			map.containerPointToLatLng([0, y]),
	  			map.containerPointToLatLng([this.options.maxWidth, y]));

	  		this._updateScales(maxMeters);
	  	},

	  	_updateScales: function (maxMeters) {
	  		if (this.options.metric && maxMeters) {
	  			this._updateMetric(maxMeters);
	  		}
	  		if (this.options.imperial && maxMeters) {
	  			this._updateImperial(maxMeters);
	  		}
	  	},

	  	_updateMetric: function (maxMeters) {
	  		var meters = this._getRoundNum(maxMeters),
	  		    label = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';

	  		this._updateScale(this._mScale, label, meters / maxMeters);
	  	},

	  	_updateImperial: function (maxMeters) {
	  		var maxFeet = maxMeters * 3.2808399,
	  		    maxMiles, miles, feet;

	  		if (maxFeet > 5280) {
	  			maxMiles = maxFeet / 5280;
	  			miles = this._getRoundNum(maxMiles);
	  			this._updateScale(this._iScale, miles + ' mi', miles / maxMiles);

	  		} else {
	  			feet = this._getRoundNum(maxFeet);
	  			this._updateScale(this._iScale, feet + ' ft', feet / maxFeet);
	  		}
	  	},

	  	_updateScale: function (scale, text, ratio) {
	  		scale.style.width = Math.round(this.options.maxWidth * ratio) + 'px';
	  		scale.innerHTML = text;
	  	},

	  	_getRoundNum: function (num) {
	  		var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
	  		    d = num / pow10;

	  		d = d >= 10 ? 10 :
	  		    d >= 5 ? 5 :
	  		    d >= 3 ? 3 :
	  		    d >= 2 ? 2 : 1;

	  		return pow10 * d;
	  	}
	  });


	  // @factory L.control.scale(options?: Control.Scale options)
	  // Creates an scale control with the given options.
	  var scale = function (options) {
	  	return new Scale(options);
	  };

	  /*
	   * @class Control.Attribution
	   * @aka L.Control.Attribution
	   * @inherits Control
	   *
	   * The attribution control allows you to display attribution data in a small text box on a map. It is put on the map by default unless you set its [`attributionControl` option](#map-attributioncontrol) to `false`, and it fetches attribution texts from layers with the [`getAttribution` method](#layer-getattribution) automatically. Extends Control.
	   */

	  var Attribution = Control.extend({
	  	// @section
	  	// @aka Control.Attribution options
	  	options: {
	  		position: 'bottomright',

	  		// @option prefix: String = 'Leaflet'
	  		// The HTML text shown before the attributions. Pass `false` to disable.
	  		prefix: '<a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
	  	},

	  	initialize: function (options) {
	  		setOptions(this, options);

	  		this._attributions = {};
	  	},

	  	onAdd: function (map) {
	  		map.attributionControl = this;
	  		this._container = create$1('div', 'leaflet-control-attribution');
	  		disableClickPropagation(this._container);

	  		// TODO ugly, refactor
	  		for (var i in map._layers) {
	  			if (map._layers[i].getAttribution) {
	  				this.addAttribution(map._layers[i].getAttribution());
	  			}
	  		}

	  		this._update();

	  		return this._container;
	  	},

	  	// @method setPrefix(prefix: String): this
	  	// Sets the text before the attributions.
	  	setPrefix: function (prefix) {
	  		this.options.prefix = prefix;
	  		this._update();
	  		return this;
	  	},

	  	// @method addAttribution(text: String): this
	  	// Adds an attribution text (e.g. `'Vector data &copy; Mapbox'`).
	  	addAttribution: function (text) {
	  		if (!text) { return this; }

	  		if (!this._attributions[text]) {
	  			this._attributions[text] = 0;
	  		}
	  		this._attributions[text]++;

	  		this._update();

	  		return this;
	  	},

	  	// @method removeAttribution(text: String): this
	  	// Removes an attribution text.
	  	removeAttribution: function (text) {
	  		if (!text) { return this; }

	  		if (this._attributions[text]) {
	  			this._attributions[text]--;
	  			this._update();
	  		}

	  		return this;
	  	},

	  	_update: function () {
	  		if (!this._map) { return; }

	  		var attribs = [];

	  		for (var i in this._attributions) {
	  			if (this._attributions[i]) {
	  				attribs.push(i);
	  			}
	  		}

	  		var prefixAndAttribs = [];

	  		if (this.options.prefix) {
	  			prefixAndAttribs.push(this.options.prefix);
	  		}
	  		if (attribs.length) {
	  			prefixAndAttribs.push(attribs.join(', '));
	  		}

	  		this._container.innerHTML = prefixAndAttribs.join(' | ');
	  	}
	  });

	  // @namespace Map
	  // @section Control options
	  // @option attributionControl: Boolean = true
	  // Whether a [attribution control](#control-attribution) is added to the map by default.
	  Map.mergeOptions({
	  	attributionControl: true
	  });

	  Map.addInitHook(function () {
	  	if (this.options.attributionControl) {
	  		new Attribution().addTo(this);
	  	}
	  });

	  // @namespace Control.Attribution
	  // @factory L.control.attribution(options: Control.Attribution options)
	  // Creates an attribution control.
	  var attribution = function (options) {
	  	return new Attribution(options);
	  };

	  Control.Layers = Layers;
	  Control.Zoom = Zoom;
	  Control.Scale = Scale;
	  Control.Attribution = Attribution;

	  control.layers = layers;
	  control.zoom = zoom;
	  control.scale = scale;
	  control.attribution = attribution;

	  /*
	  	L.Handler is a base class for handler classes that are used internally to inject
	  	interaction features like dragging to classes like Map and Marker.
	  */

	  // @class Handler
	  // @aka L.Handler
	  // Abstract class for map interaction handlers

	  var Handler = Class.extend({
	  	initialize: function (map) {
	  		this._map = map;
	  	},

	  	// @method enable(): this
	  	// Enables the handler
	  	enable: function () {
	  		if (this._enabled) { return this; }

	  		this._enabled = true;
	  		this.addHooks();
	  		return this;
	  	},

	  	// @method disable(): this
	  	// Disables the handler
	  	disable: function () {
	  		if (!this._enabled) { return this; }

	  		this._enabled = false;
	  		this.removeHooks();
	  		return this;
	  	},

	  	// @method enabled(): Boolean
	  	// Returns `true` if the handler is enabled
	  	enabled: function () {
	  		return !!this._enabled;
	  	}

	  	// @section Extension methods
	  	// Classes inheriting from `Handler` must implement the two following methods:
	  	// @method addHooks()
	  	// Called when the handler is enabled, should add event hooks.
	  	// @method removeHooks()
	  	// Called when the handler is disabled, should remove the event hooks added previously.
	  });

	  // @section There is static function which can be called without instantiating L.Handler:
	  // @function addTo(map: Map, name: String): this
	  // Adds a new Handler to the given map with the given name.
	  Handler.addTo = function (map, name) {
	  	map.addHandler(name, this);
	  	return this;
	  };

	  var Mixin = {Events: Events};

	  /*
	   * @class Draggable
	   * @aka L.Draggable
	   * @inherits Evented
	   *
	   * A class for making DOM elements draggable (including touch support).
	   * Used internally for map and marker dragging. Only works for elements
	   * that were positioned with [`L.DomUtil.setPosition`](#domutil-setposition).
	   *
	   * @example
	   * ```js
	   * var draggable = new L.Draggable(elementToDrag);
	   * draggable.enable();
	   * ```
	   */

	  var START = touch ? 'touchstart mousedown' : 'mousedown';
	  var END = {
	  	mousedown: 'mouseup',
	  	touchstart: 'touchend',
	  	pointerdown: 'touchend',
	  	MSPointerDown: 'touchend'
	  };
	  var MOVE = {
	  	mousedown: 'mousemove',
	  	touchstart: 'touchmove',
	  	pointerdown: 'touchmove',
	  	MSPointerDown: 'touchmove'
	  };


	  var Draggable = Evented.extend({

	  	options: {
	  		// @section
	  		// @aka Draggable options
	  		// @option clickTolerance: Number = 3
	  		// The max number of pixels a user can shift the mouse pointer during a click
	  		// for it to be considered a valid click (as opposed to a mouse drag).
	  		clickTolerance: 3
	  	},

	  	// @constructor L.Draggable(el: HTMLElement, dragHandle?: HTMLElement, preventOutline?: Boolean, options?: Draggable options)
	  	// Creates a `Draggable` object for moving `el` when you start dragging the `dragHandle` element (equals `el` itself by default).
	  	initialize: function (element, dragStartTarget, preventOutline$$1, options) {
	  		setOptions(this, options);

	  		this._element = element;
	  		this._dragStartTarget = dragStartTarget || element;
	  		this._preventOutline = preventOutline$$1;
	  	},

	  	// @method enable()
	  	// Enables the dragging ability
	  	enable: function () {
	  		if (this._enabled) { return; }

	  		on(this._dragStartTarget, START, this._onDown, this);

	  		this._enabled = true;
	  	},

	  	// @method disable()
	  	// Disables the dragging ability
	  	disable: function () {
	  		if (!this._enabled) { return; }

	  		// If we're currently dragging this draggable,
	  		// disabling it counts as first ending the drag.
	  		if (Draggable._dragging === this) {
	  			this.finishDrag();
	  		}

	  		off(this._dragStartTarget, START, this._onDown, this);

	  		this._enabled = false;
	  		this._moved = false;
	  	},

	  	_onDown: function (e) {
	  		// Ignore simulated events, since we handle both touch and
	  		// mouse explicitly; otherwise we risk getting duplicates of
	  		// touch events, see #4315.
	  		// Also ignore the event if disabled; this happens in IE11
	  		// under some circumstances, see #3666.
	  		if (e._simulated || !this._enabled) { return; }

	  		this._moved = false;

	  		if (hasClass(this._element, 'leaflet-zoom-anim')) { return; }

	  		if (Draggable._dragging || e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }
	  		Draggable._dragging = this;  // Prevent dragging multiple objects at once.

	  		if (this._preventOutline) {
	  			preventOutline(this._element);
	  		}

	  		disableImageDrag();
	  		disableTextSelection();

	  		if (this._moving) { return; }

	  		// @event down: Event
	  		// Fired when a drag is about to start.
	  		this.fire('down');

	  		var first = e.touches ? e.touches[0] : e,
	  		    sizedParent = getSizedParentNode(this._element);

	  		this._startPoint = new Point(first.clientX, first.clientY);

	  		// Cache the scale, so that we can continuously compensate for it during drag (_onMove).
	  		this._parentScale = getScale(sizedParent);

	  		on(document, MOVE[e.type], this._onMove, this);
	  		on(document, END[e.type], this._onUp, this);
	  	},

	  	_onMove: function (e) {
	  		// Ignore simulated events, since we handle both touch and
	  		// mouse explicitly; otherwise we risk getting duplicates of
	  		// touch events, see #4315.
	  		// Also ignore the event if disabled; this happens in IE11
	  		// under some circumstances, see #3666.
	  		if (e._simulated || !this._enabled) { return; }

	  		if (e.touches && e.touches.length > 1) {
	  			this._moved = true;
	  			return;
	  		}

	  		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
	  		    offset = new Point(first.clientX, first.clientY)._subtract(this._startPoint);

	  		if (!offset.x && !offset.y) { return; }
	  		if (Math.abs(offset.x) + Math.abs(offset.y) < this.options.clickTolerance) { return; }

	  		// We assume that the parent container's position, border and scale do not change for the duration of the drag.
	  		// Therefore there is no need to account for the position and border (they are eliminated by the subtraction)
	  		// and we can use the cached value for the scale.
	  		offset.x /= this._parentScale.x;
	  		offset.y /= this._parentScale.y;

	  		preventDefault(e);

	  		if (!this._moved) {
	  			// @event dragstart: Event
	  			// Fired when a drag starts
	  			this.fire('dragstart');

	  			this._moved = true;
	  			this._startPos = getPosition(this._element).subtract(offset);

	  			addClass(document.body, 'leaflet-dragging');

	  			this._lastTarget = e.target || e.srcElement;
	  			// IE and Edge do not give the <use> element, so fetch it
	  			// if necessary
	  			if (window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance) {
	  				this._lastTarget = this._lastTarget.correspondingUseElement;
	  			}
	  			addClass(this._lastTarget, 'leaflet-drag-target');
	  		}

	  		this._newPos = this._startPos.add(offset);
	  		this._moving = true;

	  		cancelAnimFrame(this._animRequest);
	  		this._lastEvent = e;
	  		this._animRequest = requestAnimFrame(this._updatePosition, this, true);
	  	},

	  	_updatePosition: function () {
	  		var e = {originalEvent: this._lastEvent};

	  		// @event predrag: Event
	  		// Fired continuously during dragging *before* each corresponding
	  		// update of the element's position.
	  		this.fire('predrag', e);
	  		setPosition(this._element, this._newPos);

	  		// @event drag: Event
	  		// Fired continuously during dragging.
	  		this.fire('drag', e);
	  	},

	  	_onUp: function (e) {
	  		// Ignore simulated events, since we handle both touch and
	  		// mouse explicitly; otherwise we risk getting duplicates of
	  		// touch events, see #4315.
	  		// Also ignore the event if disabled; this happens in IE11
	  		// under some circumstances, see #3666.
	  		if (e._simulated || !this._enabled) { return; }
	  		this.finishDrag();
	  	},

	  	finishDrag: function () {
	  		removeClass(document.body, 'leaflet-dragging');

	  		if (this._lastTarget) {
	  			removeClass(this._lastTarget, 'leaflet-drag-target');
	  			this._lastTarget = null;
	  		}

	  		for (var i in MOVE) {
	  			off(document, MOVE[i], this._onMove, this);
	  			off(document, END[i], this._onUp, this);
	  		}

	  		enableImageDrag();
	  		enableTextSelection();

	  		if (this._moved && this._moving) {
	  			// ensure drag is not fired after dragend
	  			cancelAnimFrame(this._animRequest);

	  			// @event dragend: DragEndEvent
	  			// Fired when the drag ends.
	  			this.fire('dragend', {
	  				distance: this._newPos.distanceTo(this._startPos)
	  			});
	  		}

	  		this._moving = false;
	  		Draggable._dragging = false;
	  	}

	  });

	  /*
	   * @namespace LineUtil
	   *
	   * Various utility functions for polyline points processing, used by Leaflet internally to make polylines lightning-fast.
	   */

	  // Simplify polyline with vertex reduction and Douglas-Peucker simplification.
	  // Improves rendering performance dramatically by lessening the number of points to draw.

	  // @function simplify(points: Point[], tolerance: Number): Point[]
	  // Dramatically reduces the number of points in a polyline while retaining
	  // its shape and returns a new array of simplified points, using the
	  // [Douglas-Peucker algorithm](http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm).
	  // Used for a huge performance boost when processing/displaying Leaflet polylines for
	  // each zoom level and also reducing visual noise. tolerance affects the amount of
	  // simplification (lesser value means higher quality but slower and with more points).
	  // Also released as a separated micro-library [Simplify.js](http://mourner.github.com/simplify-js/).
	  function simplify(points, tolerance) {
	  	if (!tolerance || !points.length) {
	  		return points.slice();
	  	}

	  	var sqTolerance = tolerance * tolerance;

	  	    // stage 1: vertex reduction
	  	    points = _reducePoints(points, sqTolerance);

	  	    // stage 2: Douglas-Peucker simplification
	  	    points = _simplifyDP(points, sqTolerance);

	  	return points;
	  }

	  // @function pointToSegmentDistance(p: Point, p1: Point, p2: Point): Number
	  // Returns the distance between point `p` and segment `p1` to `p2`.
	  function pointToSegmentDistance(p, p1, p2) {
	  	return Math.sqrt(_sqClosestPointOnSegment(p, p1, p2, true));
	  }

	  // @function closestPointOnSegment(p: Point, p1: Point, p2: Point): Number
	  // Returns the closest point from a point `p` on a segment `p1` to `p2`.
	  function closestPointOnSegment(p, p1, p2) {
	  	return _sqClosestPointOnSegment(p, p1, p2);
	  }

	  // Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
	  function _simplifyDP(points, sqTolerance) {

	  	var len = points.length,
	  	    ArrayConstructor = typeof Uint8Array !== undefined + '' ? Uint8Array : Array,
	  	    markers = new ArrayConstructor(len);

	  	    markers[0] = markers[len - 1] = 1;

	  	_simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

	  	var i,
	  	    newPoints = [];

	  	for (i = 0; i < len; i++) {
	  		if (markers[i]) {
	  			newPoints.push(points[i]);
	  		}
	  	}

	  	return newPoints;
	  }

	  function _simplifyDPStep(points, markers, sqTolerance, first, last) {

	  	var maxSqDist = 0,
	  	index, i, sqDist;

	  	for (i = first + 1; i <= last - 1; i++) {
	  		sqDist = _sqClosestPointOnSegment(points[i], points[first], points[last], true);

	  		if (sqDist > maxSqDist) {
	  			index = i;
	  			maxSqDist = sqDist;
	  		}
	  	}

	  	if (maxSqDist > sqTolerance) {
	  		markers[index] = 1;

	  		_simplifyDPStep(points, markers, sqTolerance, first, index);
	  		_simplifyDPStep(points, markers, sqTolerance, index, last);
	  	}
	  }

	  // reduce points that are too close to each other to a single point
	  function _reducePoints(points, sqTolerance) {
	  	var reducedPoints = [points[0]];

	  	for (var i = 1, prev = 0, len = points.length; i < len; i++) {
	  		if (_sqDist(points[i], points[prev]) > sqTolerance) {
	  			reducedPoints.push(points[i]);
	  			prev = i;
	  		}
	  	}
	  	if (prev < len - 1) {
	  		reducedPoints.push(points[len - 1]);
	  	}
	  	return reducedPoints;
	  }

	  var _lastCode;

	  // @function clipSegment(a: Point, b: Point, bounds: Bounds, useLastCode?: Boolean, round?: Boolean): Point[]|Boolean
	  // Clips the segment a to b by rectangular bounds with the
	  // [Cohen-Sutherland algorithm](https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm)
	  // (modifying the segment points directly!). Used by Leaflet to only show polyline
	  // points that are on the screen or near, increasing performance.
	  function clipSegment(a, b, bounds, useLastCode, round) {
	  	var codeA = useLastCode ? _lastCode : _getBitCode(a, bounds),
	  	    codeB = _getBitCode(b, bounds),

	  	    codeOut, p, newCode;

	  	    // save 2nd code to avoid calculating it on the next segment
	  	    _lastCode = codeB;

	  	while (true) {
	  		// if a,b is inside the clip window (trivial accept)
	  		if (!(codeA | codeB)) {
	  			return [a, b];
	  		}

	  		// if a,b is outside the clip window (trivial reject)
	  		if (codeA & codeB) {
	  			return false;
	  		}

	  		// other cases
	  		codeOut = codeA || codeB;
	  		p = _getEdgeIntersection(a, b, codeOut, bounds, round);
	  		newCode = _getBitCode(p, bounds);

	  		if (codeOut === codeA) {
	  			a = p;
	  			codeA = newCode;
	  		} else {
	  			b = p;
	  			codeB = newCode;
	  		}
	  	}
	  }

	  function _getEdgeIntersection(a, b, code, bounds, round) {
	  	var dx = b.x - a.x,
	  	    dy = b.y - a.y,
	  	    min = bounds.min,
	  	    max = bounds.max,
	  	    x, y;

	  	if (code & 8) { // top
	  		x = a.x + dx * (max.y - a.y) / dy;
	  		y = max.y;

	  	} else if (code & 4) { // bottom
	  		x = a.x + dx * (min.y - a.y) / dy;
	  		y = min.y;

	  	} else if (code & 2) { // right
	  		x = max.x;
	  		y = a.y + dy * (max.x - a.x) / dx;

	  	} else if (code & 1) { // left
	  		x = min.x;
	  		y = a.y + dy * (min.x - a.x) / dx;
	  	}

	  	return new Point(x, y, round);
	  }

	  function _getBitCode(p, bounds) {
	  	var code = 0;

	  	if (p.x < bounds.min.x) { // left
	  		code |= 1;
	  	} else if (p.x > bounds.max.x) { // right
	  		code |= 2;
	  	}

	  	if (p.y < bounds.min.y) { // bottom
	  		code |= 4;
	  	} else if (p.y > bounds.max.y) { // top
	  		code |= 8;
	  	}

	  	return code;
	  }

	  // square distance (to avoid unnecessary Math.sqrt calls)
	  function _sqDist(p1, p2) {
	  	var dx = p2.x - p1.x,
	  	    dy = p2.y - p1.y;
	  	return dx * dx + dy * dy;
	  }

	  // return closest point on segment or distance to that point
	  function _sqClosestPointOnSegment(p, p1, p2, sqDist) {
	  	var x = p1.x,
	  	    y = p1.y,
	  	    dx = p2.x - x,
	  	    dy = p2.y - y,
	  	    dot = dx * dx + dy * dy,
	  	    t;

	  	if (dot > 0) {
	  		t = ((p.x - x) * dx + (p.y - y) * dy) / dot;

	  		if (t > 1) {
	  			x = p2.x;
	  			y = p2.y;
	  		} else if (t > 0) {
	  			x += dx * t;
	  			y += dy * t;
	  		}
	  	}

	  	dx = p.x - x;
	  	dy = p.y - y;

	  	return sqDist ? dx * dx + dy * dy : new Point(x, y);
	  }


	  // @function isFlat(latlngs: LatLng[]): Boolean
	  // Returns true if `latlngs` is a flat array, false is nested.
	  function isFlat(latlngs) {
	  	return !isArray(latlngs[0]) || (typeof latlngs[0][0] !== 'object' && typeof latlngs[0][0] !== 'undefined');
	  }

	  function _flat(latlngs) {
	  	console.warn('Deprecated use of _flat, please use L.LineUtil.isFlat instead.');
	  	return isFlat(latlngs);
	  }

	  var LineUtil = ({
	    simplify: simplify,
	    pointToSegmentDistance: pointToSegmentDistance,
	    closestPointOnSegment: closestPointOnSegment,
	    clipSegment: clipSegment,
	    _getEdgeIntersection: _getEdgeIntersection,
	    _getBitCode: _getBitCode,
	    _sqClosestPointOnSegment: _sqClosestPointOnSegment,
	    isFlat: isFlat,
	    _flat: _flat
	  });

	  /*
	   * @namespace PolyUtil
	   * Various utility functions for polygon geometries.
	   */

	  /* @function clipPolygon(points: Point[], bounds: Bounds, round?: Boolean): Point[]
	   * Clips the polygon geometry defined by the given `points` by the given bounds (using the [Sutherland-Hodgman algorithm](https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm)).
	   * Used by Leaflet to only show polygon points that are on the screen or near, increasing
	   * performance. Note that polygon points needs different algorithm for clipping
	   * than polyline, so there's a separate method for it.
	   */
	  function clipPolygon(points, bounds, round) {
	  	var clippedPoints,
	  	    edges = [1, 4, 2, 8],
	  	    i, j, k,
	  	    a, b,
	  	    len, edge, p;

	  	for (i = 0, len = points.length; i < len; i++) {
	  		points[i]._code = _getBitCode(points[i], bounds);
	  	}

	  	// for each edge (left, bottom, right, top)
	  	for (k = 0; k < 4; k++) {
	  		edge = edges[k];
	  		clippedPoints = [];

	  		for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
	  			a = points[i];
	  			b = points[j];

	  			// if a is inside the clip window
	  			if (!(a._code & edge)) {
	  				// if b is outside the clip window (a->b goes out of screen)
	  				if (b._code & edge) {
	  					p = _getEdgeIntersection(b, a, edge, bounds, round);
	  					p._code = _getBitCode(p, bounds);
	  					clippedPoints.push(p);
	  				}
	  				clippedPoints.push(a);

	  			// else if b is inside the clip window (a->b enters the screen)
	  			} else if (!(b._code & edge)) {
	  				p = _getEdgeIntersection(b, a, edge, bounds, round);
	  				p._code = _getBitCode(p, bounds);
	  				clippedPoints.push(p);
	  			}
	  		}
	  		points = clippedPoints;
	  	}

	  	return points;
	  }

	  var PolyUtil = ({
	    clipPolygon: clipPolygon
	  });

	  /*
	   * @namespace Projection
	   * @section
	   * Leaflet comes with a set of already defined Projections out of the box:
	   *
	   * @projection L.Projection.LonLat
	   *
	   * Equirectangular, or Plate Carree projection — the most simple projection,
	   * mostly used by GIS enthusiasts. Directly maps `x` as longitude, and `y` as
	   * latitude. Also suitable for flat worlds, e.g. game maps. Used by the
	   * `EPSG:4326` and `Simple` CRS.
	   */

	  var LonLat = {
	  	project: function (latlng) {
	  		return new Point(latlng.lng, latlng.lat);
	  	},

	  	unproject: function (point) {
	  		return new LatLng(point.y, point.x);
	  	},

	  	bounds: new Bounds([-180, -90], [180, 90])
	  };

	  /*
	   * @namespace Projection
	   * @projection L.Projection.Mercator
	   *
	   * Elliptical Mercator projection — more complex than Spherical Mercator. Assumes that Earth is an ellipsoid. Used by the EPSG:3395 CRS.
	   */

	  var Mercator = {
	  	R: 6378137,
	  	R_MINOR: 6356752.314245179,

	  	bounds: new Bounds([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),

	  	project: function (latlng) {
	  		var d = Math.PI / 180,
	  		    r = this.R,
	  		    y = latlng.lat * d,
	  		    tmp = this.R_MINOR / r,
	  		    e = Math.sqrt(1 - tmp * tmp),
	  		    con = e * Math.sin(y);

	  		var ts = Math.tan(Math.PI / 4 - y / 2) / Math.pow((1 - con) / (1 + con), e / 2);
	  		y = -r * Math.log(Math.max(ts, 1E-10));

	  		return new Point(latlng.lng * d * r, y);
	  	},

	  	unproject: function (point) {
	  		var d = 180 / Math.PI,
	  		    r = this.R,
	  		    tmp = this.R_MINOR / r,
	  		    e = Math.sqrt(1 - tmp * tmp),
	  		    ts = Math.exp(-point.y / r),
	  		    phi = Math.PI / 2 - 2 * Math.atan(ts);

	  		for (var i = 0, dphi = 0.1, con; i < 15 && Math.abs(dphi) > 1e-7; i++) {
	  			con = e * Math.sin(phi);
	  			con = Math.pow((1 - con) / (1 + con), e / 2);
	  			dphi = Math.PI / 2 - 2 * Math.atan(ts * con) - phi;
	  			phi += dphi;
	  		}

	  		return new LatLng(phi * d, point.x * d / r);
	  	}
	  };

	  /*
	   * @class Projection

	   * An object with methods for projecting geographical coordinates of the world onto
	   * a flat surface (and back). See [Map projection](http://en.wikipedia.org/wiki/Map_projection).

	   * @property bounds: Bounds
	   * The bounds (specified in CRS units) where the projection is valid

	   * @method project(latlng: LatLng): Point
	   * Projects geographical coordinates into a 2D point.
	   * Only accepts actual `L.LatLng` instances, not arrays.

	   * @method unproject(point: Point): LatLng
	   * The inverse of `project`. Projects a 2D point into a geographical location.
	   * Only accepts actual `L.Point` instances, not arrays.

	   * Note that the projection instances do not inherit from Leaflet's `Class` object,
	   * and can't be instantiated. Also, new classes can't inherit from them,
	   * and methods can't be added to them with the `include` function.

	   */

	  var index = ({
	    LonLat: LonLat,
	    Mercator: Mercator,
	    SphericalMercator: SphericalMercator
	  });

	  /*
	   * @namespace CRS
	   * @crs L.CRS.EPSG3395
	   *
	   * Rarely used by some commercial tile providers. Uses Elliptical Mercator projection.
	   */
	  var EPSG3395 = extend({}, Earth, {
	  	code: 'EPSG:3395',
	  	projection: Mercator,

	  	transformation: (function () {
	  		var scale = 0.5 / (Math.PI * Mercator.R);
	  		return toTransformation(scale, 0.5, -scale, 0.5);
	  	}())
	  });

	  /*
	   * @namespace CRS
	   * @crs L.CRS.EPSG4326
	   *
	   * A common CRS among GIS enthusiasts. Uses simple Equirectangular projection.
	   *
	   * Leaflet 1.0.x complies with the [TMS coordinate scheme for EPSG:4326](https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification#global-geodetic),
	   * which is a breaking change from 0.7.x behaviour.  If you are using a `TileLayer`
	   * with this CRS, ensure that there are two 256x256 pixel tiles covering the
	   * whole earth at zoom level zero, and that the tile coordinate origin is (-180,+90),
	   * or (-180,-90) for `TileLayer`s with [the `tms` option](#tilelayer-tms) set.
	   */

	  var EPSG4326 = extend({}, Earth, {
	  	code: 'EPSG:4326',
	  	projection: LonLat,
	  	transformation: toTransformation(1 / 180, 1, -1 / 180, 0.5)
	  });

	  /*
	   * @namespace CRS
	   * @crs L.CRS.Simple
	   *
	   * A simple CRS that maps longitude and latitude into `x` and `y` directly.
	   * May be used for maps of flat surfaces (e.g. game maps). Note that the `y`
	   * axis should still be inverted (going from bottom to top). `distance()` returns
	   * simple euclidean distance.
	   */

	  var Simple = extend({}, CRS, {
	  	projection: LonLat,
	  	transformation: toTransformation(1, 0, -1, 0),

	  	scale: function (zoom) {
	  		return Math.pow(2, zoom);
	  	},

	  	zoom: function (scale) {
	  		return Math.log(scale) / Math.LN2;
	  	},

	  	distance: function (latlng1, latlng2) {
	  		var dx = latlng2.lng - latlng1.lng,
	  		    dy = latlng2.lat - latlng1.lat;

	  		return Math.sqrt(dx * dx + dy * dy);
	  	},

	  	infinite: true
	  });

	  CRS.Earth = Earth;
	  CRS.EPSG3395 = EPSG3395;
	  CRS.EPSG3857 = EPSG3857;
	  CRS.EPSG900913 = EPSG900913;
	  CRS.EPSG4326 = EPSG4326;
	  CRS.Simple = Simple;

	  /*
	   * @class Layer
	   * @inherits Evented
	   * @aka L.Layer
	   * @aka ILayer
	   *
	   * A set of methods from the Layer base class that all Leaflet layers use.
	   * Inherits all methods, options and events from `L.Evented`.
	   *
	   * @example
	   *
	   * ```js
	   * var layer = L.marker(latlng).addTo(map);
	   * layer.addTo(map);
	   * layer.remove();
	   * ```
	   *
	   * @event add: Event
	   * Fired after the layer is added to a map
	   *
	   * @event remove: Event
	   * Fired after the layer is removed from a map
	   */


	  var Layer = Evented.extend({

	  	// Classes extending `L.Layer` will inherit the following options:
	  	options: {
	  		// @option pane: String = 'overlayPane'
	  		// By default the layer will be added to the map's [overlay pane](#map-overlaypane). Overriding this option will cause the layer to be placed on another pane by default.
	  		pane: 'overlayPane',

	  		// @option attribution: String = null
	  		// String to be shown in the attribution control, e.g. "© OpenStreetMap contributors". It describes the layer data and is often a legal obligation towards copyright holders and tile providers.
	  		attribution: null,

	  		bubblingMouseEvents: true
	  	},

	  	/* @section
	  	 * Classes extending `L.Layer` will inherit the following methods:
	  	 *
	  	 * @method addTo(map: Map|LayerGroup): this
	  	 * Adds the layer to the given map or layer group.
	  	 */
	  	addTo: function (map) {
	  		map.addLayer(this);
	  		return this;
	  	},

	  	// @method remove: this
	  	// Removes the layer from the map it is currently active on.
	  	remove: function () {
	  		return this.removeFrom(this._map || this._mapToAdd);
	  	},

	  	// @method removeFrom(map: Map): this
	  	// Removes the layer from the given map
	  	//
	  	// @alternative
	  	// @method removeFrom(group: LayerGroup): this
	  	// Removes the layer from the given `LayerGroup`
	  	removeFrom: function (obj) {
	  		if (obj) {
	  			obj.removeLayer(this);
	  		}
	  		return this;
	  	},

	  	// @method getPane(name? : String): HTMLElement
	  	// Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
	  	getPane: function (name) {
	  		return this._map.getPane(name ? (this.options[name] || name) : this.options.pane);
	  	},

	  	addInteractiveTarget: function (targetEl) {
	  		this._map._targets[stamp(targetEl)] = this;
	  		return this;
	  	},

	  	removeInteractiveTarget: function (targetEl) {
	  		delete this._map._targets[stamp(targetEl)];
	  		return this;
	  	},

	  	// @method getAttribution: String
	  	// Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
	  	getAttribution: function () {
	  		return this.options.attribution;
	  	},

	  	_layerAdd: function (e) {
	  		var map = e.target;

	  		// check in case layer gets added and then removed before the map is ready
	  		if (!map.hasLayer(this)) { return; }

	  		this._map = map;
	  		this._zoomAnimated = map._zoomAnimated;

	  		if (this.getEvents) {
	  			var events = this.getEvents();
	  			map.on(events, this);
	  			this.once('remove', function () {
	  				map.off(events, this);
	  			}, this);
	  		}

	  		this.onAdd(map);

	  		if (this.getAttribution && map.attributionControl) {
	  			map.attributionControl.addAttribution(this.getAttribution());
	  		}

	  		this.fire('add');
	  		map.fire('layeradd', {layer: this});
	  	}
	  });

	  /* @section Extension methods
	   * @uninheritable
	   *
	   * Every layer should extend from `L.Layer` and (re-)implement the following methods.
	   *
	   * @method onAdd(map: Map): this
	   * Should contain code that creates DOM elements for the layer, adds them to `map panes` where they should belong and puts listeners on relevant map events. Called on [`map.addLayer(layer)`](#map-addlayer).
	   *
	   * @method onRemove(map: Map): this
	   * Should contain all clean up code that removes the layer's elements from the DOM and removes listeners previously added in [`onAdd`](#layer-onadd). Called on [`map.removeLayer(layer)`](#map-removelayer).
	   *
	   * @method getEvents(): Object
	   * This optional method should return an object like `{ viewreset: this._reset }` for [`addEventListener`](#evented-addeventlistener). The event handlers in this object will be automatically added and removed from the map with your layer.
	   *
	   * @method getAttribution(): String
	   * This optional method should return a string containing HTML to be shown on the `Attribution control` whenever the layer is visible.
	   *
	   * @method beforeAdd(map: Map): this
	   * Optional method. Called on [`map.addLayer(layer)`](#map-addlayer), before the layer is added to the map, before events are initialized, without waiting until the map is in a usable state. Use for early initialization only.
	   */


	  /* @namespace Map
	   * @section Layer events
	   *
	   * @event layeradd: LayerEvent
	   * Fired when a new layer is added to the map.
	   *
	   * @event layerremove: LayerEvent
	   * Fired when some layer is removed from the map
	   *
	   * @section Methods for Layers and Controls
	   */
	  Map.include({
	  	// @method addLayer(layer: Layer): this
	  	// Adds the given layer to the map
	  	addLayer: function (layer) {
	  		if (!layer._layerAdd) {
	  			throw new Error('The provided object is not a Layer.');
	  		}

	  		var id = stamp(layer);
	  		if (this._layers[id]) { return this; }
	  		this._layers[id] = layer;

	  		layer._mapToAdd = this;

	  		if (layer.beforeAdd) {
	  			layer.beforeAdd(this);
	  		}

	  		this.whenReady(layer._layerAdd, layer);

	  		return this;
	  	},

	  	// @method removeLayer(layer: Layer): this
	  	// Removes the given layer from the map.
	  	removeLayer: function (layer) {
	  		var id = stamp(layer);

	  		if (!this._layers[id]) { return this; }

	  		if (this._loaded) {
	  			layer.onRemove(this);
	  		}

	  		if (layer.getAttribution && this.attributionControl) {
	  			this.attributionControl.removeAttribution(layer.getAttribution());
	  		}

	  		delete this._layers[id];

	  		if (this._loaded) {
	  			this.fire('layerremove', {layer: layer});
	  			layer.fire('remove');
	  		}

	  		layer._map = layer._mapToAdd = null;

	  		return this;
	  	},

	  	// @method hasLayer(layer: Layer): Boolean
	  	// Returns `true` if the given layer is currently added to the map
	  	hasLayer: function (layer) {
	  		return !!layer && (stamp(layer) in this._layers);
	  	},

	  	/* @method eachLayer(fn: Function, context?: Object): this
	  	 * Iterates over the layers of the map, optionally specifying context of the iterator function.
	  	 * ```
	  	 * map.eachLayer(function(layer){
	  	 *     layer.bindPopup('Hello');
	  	 * });
	  	 * ```
	  	 */
	  	eachLayer: function (method, context) {
	  		for (var i in this._layers) {
	  			method.call(context, this._layers[i]);
	  		}
	  		return this;
	  	},

	  	_addLayers: function (layers) {
	  		layers = layers ? (isArray(layers) ? layers : [layers]) : [];

	  		for (var i = 0, len = layers.length; i < len; i++) {
	  			this.addLayer(layers[i]);
	  		}
	  	},

	  	_addZoomLimit: function (layer) {
	  		if (isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom)) {
	  			this._zoomBoundLayers[stamp(layer)] = layer;
	  			this._updateZoomLevels();
	  		}
	  	},

	  	_removeZoomLimit: function (layer) {
	  		var id = stamp(layer);

	  		if (this._zoomBoundLayers[id]) {
	  			delete this._zoomBoundLayers[id];
	  			this._updateZoomLevels();
	  		}
	  	},

	  	_updateZoomLevels: function () {
	  		var minZoom = Infinity,
	  		    maxZoom = -Infinity,
	  		    oldZoomSpan = this._getZoomSpan();

	  		for (var i in this._zoomBoundLayers) {
	  			var options = this._zoomBoundLayers[i].options;

	  			minZoom = options.minZoom === undefined ? minZoom : Math.min(minZoom, options.minZoom);
	  			maxZoom = options.maxZoom === undefined ? maxZoom : Math.max(maxZoom, options.maxZoom);
	  		}

	  		this._layersMaxZoom = maxZoom === -Infinity ? undefined : maxZoom;
	  		this._layersMinZoom = minZoom === Infinity ? undefined : minZoom;

	  		// @section Map state change events
	  		// @event zoomlevelschange: Event
	  		// Fired when the number of zoomlevels on the map is changed due
	  		// to adding or removing a layer.
	  		if (oldZoomSpan !== this._getZoomSpan()) {
	  			this.fire('zoomlevelschange');
	  		}

	  		if (this.options.maxZoom === undefined && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom) {
	  			this.setZoom(this._layersMaxZoom);
	  		}
	  		if (this.options.minZoom === undefined && this._layersMinZoom && this.getZoom() < this._layersMinZoom) {
	  			this.setZoom(this._layersMinZoom);
	  		}
	  	}
	  });

	  /*
	   * @class LayerGroup
	   * @aka L.LayerGroup
	   * @inherits Layer
	   *
	   * Used to group several layers and handle them as one. If you add it to the map,
	   * any layers added or removed from the group will be added/removed on the map as
	   * well. Extends `Layer`.
	   *
	   * @example
	   *
	   * ```js
	   * L.layerGroup([marker1, marker2])
	   * 	.addLayer(polyline)
	   * 	.addTo(map);
	   * ```
	   */

	  var LayerGroup = Layer.extend({

	  	initialize: function (layers, options) {
	  		setOptions(this, options);

	  		this._layers = {};

	  		var i, len;

	  		if (layers) {
	  			for (i = 0, len = layers.length; i < len; i++) {
	  				this.addLayer(layers[i]);
	  			}
	  		}
	  	},

	  	// @method addLayer(layer: Layer): this
	  	// Adds the given layer to the group.
	  	addLayer: function (layer) {
	  		var id = this.getLayerId(layer);

	  		this._layers[id] = layer;

	  		if (this._map) {
	  			this._map.addLayer(layer);
	  		}

	  		return this;
	  	},

	  	// @method removeLayer(layer: Layer): this
	  	// Removes the given layer from the group.
	  	// @alternative
	  	// @method removeLayer(id: Number): this
	  	// Removes the layer with the given internal ID from the group.
	  	removeLayer: function (layer) {
	  		var id = layer in this._layers ? layer : this.getLayerId(layer);

	  		if (this._map && this._layers[id]) {
	  			this._map.removeLayer(this._layers[id]);
	  		}

	  		delete this._layers[id];

	  		return this;
	  	},

	  	// @method hasLayer(layer: Layer): Boolean
	  	// Returns `true` if the given layer is currently added to the group.
	  	// @alternative
	  	// @method hasLayer(id: Number): Boolean
	  	// Returns `true` if the given internal ID is currently added to the group.
	  	hasLayer: function (layer) {
	  		if (!layer) { return false; }
	  		var layerId = typeof layer === 'number' ? layer : this.getLayerId(layer);
	  		return layerId in this._layers;
	  	},

	  	// @method clearLayers(): this
	  	// Removes all the layers from the group.
	  	clearLayers: function () {
	  		return this.eachLayer(this.removeLayer, this);
	  	},

	  	// @method invoke(methodName: String, …): this
	  	// Calls `methodName` on every layer contained in this group, passing any
	  	// additional parameters. Has no effect if the layers contained do not
	  	// implement `methodName`.
	  	invoke: function (methodName) {
	  		var args = Array.prototype.slice.call(arguments, 1),
	  		    i, layer;

	  		for (i in this._layers) {
	  			layer = this._layers[i];

	  			if (layer[methodName]) {
	  				layer[methodName].apply(layer, args);
	  			}
	  		}

	  		return this;
	  	},

	  	onAdd: function (map) {
	  		this.eachLayer(map.addLayer, map);
	  	},

	  	onRemove: function (map) {
	  		this.eachLayer(map.removeLayer, map);
	  	},

	  	// @method eachLayer(fn: Function, context?: Object): this
	  	// Iterates over the layers of the group, optionally specifying context of the iterator function.
	  	// ```js
	  	// group.eachLayer(function (layer) {
	  	// 	layer.bindPopup('Hello');
	  	// });
	  	// ```
	  	eachLayer: function (method, context) {
	  		for (var i in this._layers) {
	  			method.call(context, this._layers[i]);
	  		}
	  		return this;
	  	},

	  	// @method getLayer(id: Number): Layer
	  	// Returns the layer with the given internal ID.
	  	getLayer: function (id) {
	  		return this._layers[id];
	  	},

	  	// @method getLayers(): Layer[]
	  	// Returns an array of all the layers added to the group.
	  	getLayers: function () {
	  		var layers = [];
	  		this.eachLayer(layers.push, layers);
	  		return layers;
	  	},

	  	// @method setZIndex(zIndex: Number): this
	  	// Calls `setZIndex` on every layer contained in this group, passing the z-index.
	  	setZIndex: function (zIndex) {
	  		return this.invoke('setZIndex', zIndex);
	  	},

	  	// @method getLayerId(layer: Layer): Number
	  	// Returns the internal ID for a layer
	  	getLayerId: function (layer) {
	  		return stamp(layer);
	  	}
	  });


	  // @factory L.layerGroup(layers?: Layer[], options?: Object)
	  // Create a layer group, optionally given an initial set of layers and an `options` object.
	  var layerGroup = function (layers, options) {
	  	return new LayerGroup(layers, options);
	  };

	  /*
	   * @class FeatureGroup
	   * @aka L.FeatureGroup
	   * @inherits LayerGroup
	   *
	   * Extended `LayerGroup` that makes it easier to do the same thing to all its member layers:
	   *  * [`bindPopup`](#layer-bindpopup) binds a popup to all of the layers at once (likewise with [`bindTooltip`](#layer-bindtooltip))
	   *  * Events are propagated to the `FeatureGroup`, so if the group has an event
	   * handler, it will handle events from any of the layers. This includes mouse events
	   * and custom events.
	   *  * Has `layeradd` and `layerremove` events
	   *
	   * @example
	   *
	   * ```js
	   * L.featureGroup([marker1, marker2, polyline])
	   * 	.bindPopup('Hello world!')
	   * 	.on('click', function() { alert('Clicked on a member of the group!'); })
	   * 	.addTo(map);
	   * ```
	   */

	  var FeatureGroup = LayerGroup.extend({

	  	addLayer: function (layer) {
	  		if (this.hasLayer(layer)) {
	  			return this;
	  		}

	  		layer.addEventParent(this);

	  		LayerGroup.prototype.addLayer.call(this, layer);

	  		// @event layeradd: LayerEvent
	  		// Fired when a layer is added to this `FeatureGroup`
	  		return this.fire('layeradd', {layer: layer});
	  	},

	  	removeLayer: function (layer) {
	  		if (!this.hasLayer(layer)) {
	  			return this;
	  		}
	  		if (layer in this._layers) {
	  			layer = this._layers[layer];
	  		}

	  		layer.removeEventParent(this);

	  		LayerGroup.prototype.removeLayer.call(this, layer);

	  		// @event layerremove: LayerEvent
	  		// Fired when a layer is removed from this `FeatureGroup`
	  		return this.fire('layerremove', {layer: layer});
	  	},

	  	// @method setStyle(style: Path options): this
	  	// Sets the given path options to each layer of the group that has a `setStyle` method.
	  	setStyle: function (style) {
	  		return this.invoke('setStyle', style);
	  	},

	  	// @method bringToFront(): this
	  	// Brings the layer group to the top of all other layers
	  	bringToFront: function () {
	  		return this.invoke('bringToFront');
	  	},

	  	// @method bringToBack(): this
	  	// Brings the layer group to the back of all other layers
	  	bringToBack: function () {
	  		return this.invoke('bringToBack');
	  	},

	  	// @method getBounds(): LatLngBounds
	  	// Returns the LatLngBounds of the Feature Group (created from bounds and coordinates of its children).
	  	getBounds: function () {
	  		var bounds = new LatLngBounds();

	  		for (var id in this._layers) {
	  			var layer = this._layers[id];
	  			bounds.extend(layer.getBounds ? layer.getBounds() : layer.getLatLng());
	  		}
	  		return bounds;
	  	}
	  });

	  // @factory L.featureGroup(layers?: Layer[], options?: Object)
	  // Create a feature group, optionally given an initial set of layers and an `options` object.
	  var featureGroup = function (layers, options) {
	  	return new FeatureGroup(layers, options);
	  };

	  /*
	   * @class Icon
	   * @aka L.Icon
	   *
	   * Represents an icon to provide when creating a marker.
	   *
	   * @example
	   *
	   * ```js
	   * var myIcon = L.icon({
	   *     iconUrl: 'my-icon.png',
	   *     iconRetinaUrl: 'my-icon@2x.png',
	   *     iconSize: [38, 95],
	   *     iconAnchor: [22, 94],
	   *     popupAnchor: [-3, -76],
	   *     shadowUrl: 'my-icon-shadow.png',
	   *     shadowRetinaUrl: 'my-icon-shadow@2x.png',
	   *     shadowSize: [68, 95],
	   *     shadowAnchor: [22, 94]
	   * });
	   *
	   * L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
	   * ```
	   *
	   * `L.Icon.Default` extends `L.Icon` and is the blue icon Leaflet uses for markers by default.
	   *
	   */

	  var Icon = Class.extend({

	  	/* @section
	  	 * @aka Icon options
	  	 *
	  	 * @option iconUrl: String = null
	  	 * **(required)** The URL to the icon image (absolute or relative to your script path).
	  	 *
	  	 * @option iconRetinaUrl: String = null
	  	 * The URL to a retina sized version of the icon image (absolute or relative to your
	  	 * script path). Used for Retina screen devices.
	  	 *
	  	 * @option iconSize: Point = null
	  	 * Size of the icon image in pixels.
	  	 *
	  	 * @option iconAnchor: Point = null
	  	 * The coordinates of the "tip" of the icon (relative to its top left corner). The icon
	  	 * will be aligned so that this point is at the marker's geographical location. Centered
	  	 * by default if size is specified, also can be set in CSS with negative margins.
	  	 *
	  	 * @option popupAnchor: Point = [0, 0]
	  	 * The coordinates of the point from which popups will "open", relative to the icon anchor.
	  	 *
	  	 * @option tooltipAnchor: Point = [0, 0]
	  	 * The coordinates of the point from which tooltips will "open", relative to the icon anchor.
	  	 *
	  	 * @option shadowUrl: String = null
	  	 * The URL to the icon shadow image. If not specified, no shadow image will be created.
	  	 *
	  	 * @option shadowRetinaUrl: String = null
	  	 *
	  	 * @option shadowSize: Point = null
	  	 * Size of the shadow image in pixels.
	  	 *
	  	 * @option shadowAnchor: Point = null
	  	 * The coordinates of the "tip" of the shadow (relative to its top left corner) (the same
	  	 * as iconAnchor if not specified).
	  	 *
	  	 * @option className: String = ''
	  	 * A custom class name to assign to both icon and shadow images. Empty by default.
	  	 */

	  	options: {
	  		popupAnchor: [0, 0],
	  		tooltipAnchor: [0, 0]
	  	},

	  	initialize: function (options) {
	  		setOptions(this, options);
	  	},

	  	// @method createIcon(oldIcon?: HTMLElement): HTMLElement
	  	// Called internally when the icon has to be shown, returns a `<img>` HTML element
	  	// styled according to the options.
	  	createIcon: function (oldIcon) {
	  		return this._createIcon('icon', oldIcon);
	  	},

	  	// @method createShadow(oldIcon?: HTMLElement): HTMLElement
	  	// As `createIcon`, but for the shadow beneath it.
	  	createShadow: function (oldIcon) {
	  		return this._createIcon('shadow', oldIcon);
	  	},

	  	_createIcon: function (name, oldIcon) {
	  		var src = this._getIconUrl(name);

	  		if (!src) {
	  			if (name === 'icon') {
	  				throw new Error('iconUrl not set in Icon options (see the docs).');
	  			}
	  			return null;
	  		}

	  		var img = this._createImg(src, oldIcon && oldIcon.tagName === 'IMG' ? oldIcon : null);
	  		this._setIconStyles(img, name);

	  		return img;
	  	},

	  	_setIconStyles: function (img, name) {
	  		var options = this.options;
	  		var sizeOption = options[name + 'Size'];

	  		if (typeof sizeOption === 'number') {
	  			sizeOption = [sizeOption, sizeOption];
	  		}

	  		var size = toPoint(sizeOption),
	  		    anchor = toPoint(name === 'shadow' && options.shadowAnchor || options.iconAnchor ||
	  		            size && size.divideBy(2, true));

	  		img.className = 'leaflet-marker-' + name + ' ' + (options.className || '');

	  		if (anchor) {
	  			img.style.marginLeft = (-anchor.x) + 'px';
	  			img.style.marginTop  = (-anchor.y) + 'px';
	  		}

	  		if (size) {
	  			img.style.width  = size.x + 'px';
	  			img.style.height = size.y + 'px';
	  		}
	  	},

	  	_createImg: function (src, el) {
	  		el = el || document.createElement('img');
	  		el.src = src;
	  		return el;
	  	},

	  	_getIconUrl: function (name) {
	  		return retina && this.options[name + 'RetinaUrl'] || this.options[name + 'Url'];
	  	}
	  });


	  // @factory L.icon(options: Icon options)
	  // Creates an icon instance with the given options.
	  function icon(options) {
	  	return new Icon(options);
	  }

	  /*
	   * @miniclass Icon.Default (Icon)
	   * @aka L.Icon.Default
	   * @section
	   *
	   * A trivial subclass of `Icon`, represents the icon to use in `Marker`s when
	   * no icon is specified. Points to the blue marker image distributed with Leaflet
	   * releases.
	   *
	   * In order to customize the default icon, just change the properties of `L.Icon.Default.prototype.options`
	   * (which is a set of `Icon options`).
	   *
	   * If you want to _completely_ replace the default icon, override the
	   * `L.Marker.prototype.options.icon` with your own icon instead.
	   */

	  var IconDefault = Icon.extend({

	  	options: {
	  		iconUrl:       'marker-icon.png',
	  		iconRetinaUrl: 'marker-icon-2x.png',
	  		shadowUrl:     'marker-shadow.png',
	  		iconSize:    [25, 41],
	  		iconAnchor:  [12, 41],
	  		popupAnchor: [1, -34],
	  		tooltipAnchor: [16, -28],
	  		shadowSize:  [41, 41]
	  	},

	  	_getIconUrl: function (name) {
	  		if (!IconDefault.imagePath) {	// Deprecated, backwards-compatibility only
	  			IconDefault.imagePath = this._detectIconPath();
	  		}

	  		// @option imagePath: String
	  		// `Icon.Default` will try to auto-detect the location of the
	  		// blue icon images. If you are placing these images in a non-standard
	  		// way, set this option to point to the right path.
	  		return (this.options.imagePath || IconDefault.imagePath) + Icon.prototype._getIconUrl.call(this, name);
	  	},

	  	_detectIconPath: function () {
	  		var el = create$1('div',  'leaflet-default-icon-path', document.body);
	  		var path = getStyle(el, 'background-image') ||
	  		           getStyle(el, 'backgroundImage');	// IE8

	  		document.body.removeChild(el);

	  		if (path === null || path.indexOf('url') !== 0) {
	  			path = '';
	  		} else {
	  			path = path.replace(/^url\(["']?/, '').replace(/marker-icon\.png["']?\)$/, '');
	  		}

	  		return path;
	  	}
	  });

	  /*
	   * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
	   */


	  /* @namespace Marker
	   * @section Interaction handlers
	   *
	   * Interaction handlers are properties of a marker instance that allow you to control interaction behavior in runtime, enabling or disabling certain features such as dragging (see `Handler` methods). Example:
	   *
	   * ```js
	   * marker.dragging.disable();
	   * ```
	   *
	   * @property dragging: Handler
	   * Marker dragging handler (by both mouse and touch). Only valid when the marker is on the map (Otherwise set [`marker.options.draggable`](#marker-draggable)).
	   */

	  var MarkerDrag = Handler.extend({
	  	initialize: function (marker) {
	  		this._marker = marker;
	  	},

	  	addHooks: function () {
	  		var icon = this._marker._icon;

	  		if (!this._draggable) {
	  			this._draggable = new Draggable(icon, icon, true);
	  		}

	  		this._draggable.on({
	  			dragstart: this._onDragStart,
	  			predrag: this._onPreDrag,
	  			drag: this._onDrag,
	  			dragend: this._onDragEnd
	  		}, this).enable();

	  		addClass(icon, 'leaflet-marker-draggable');
	  	},

	  	removeHooks: function () {
	  		this._draggable.off({
	  			dragstart: this._onDragStart,
	  			predrag: this._onPreDrag,
	  			drag: this._onDrag,
	  			dragend: this._onDragEnd
	  		}, this).disable();

	  		if (this._marker._icon) {
	  			removeClass(this._marker._icon, 'leaflet-marker-draggable');
	  		}
	  	},

	  	moved: function () {
	  		return this._draggable && this._draggable._moved;
	  	},

	  	_adjustPan: function (e) {
	  		var marker = this._marker,
	  		    map = marker._map,
	  		    speed = this._marker.options.autoPanSpeed,
	  		    padding = this._marker.options.autoPanPadding,
	  		    iconPos = getPosition(marker._icon),
	  		    bounds = map.getPixelBounds(),
	  		    origin = map.getPixelOrigin();

	  		var panBounds = toBounds(
	  			bounds.min._subtract(origin).add(padding),
	  			bounds.max._subtract(origin).subtract(padding)
	  		);

	  		if (!panBounds.contains(iconPos)) {
	  			// Compute incremental movement
	  			var movement = toPoint(
	  				(Math.max(panBounds.max.x, iconPos.x) - panBounds.max.x) / (bounds.max.x - panBounds.max.x) -
	  				(Math.min(panBounds.min.x, iconPos.x) - panBounds.min.x) / (bounds.min.x - panBounds.min.x),

	  				(Math.max(panBounds.max.y, iconPos.y) - panBounds.max.y) / (bounds.max.y - panBounds.max.y) -
	  				(Math.min(panBounds.min.y, iconPos.y) - panBounds.min.y) / (bounds.min.y - panBounds.min.y)
	  			).multiplyBy(speed);

	  			map.panBy(movement, {animate: false});

	  			this._draggable._newPos._add(movement);
	  			this._draggable._startPos._add(movement);

	  			setPosition(marker._icon, this._draggable._newPos);
	  			this._onDrag(e);

	  			this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
	  		}
	  	},

	  	_onDragStart: function () {
	  		// @section Dragging events
	  		// @event dragstart: Event
	  		// Fired when the user starts dragging the marker.

	  		// @event movestart: Event
	  		// Fired when the marker starts moving (because of dragging).

	  		this._oldLatLng = this._marker.getLatLng();

	  		// When using ES6 imports it could not be set when `Popup` was not imported as well
	  		this._marker.closePopup && this._marker.closePopup();

	  		this._marker
	  			.fire('movestart')
	  			.fire('dragstart');
	  	},

	  	_onPreDrag: function (e) {
	  		if (this._marker.options.autoPan) {
	  			cancelAnimFrame(this._panRequest);
	  			this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
	  		}
	  	},

	  	_onDrag: function (e) {
	  		var marker = this._marker,
	  		    shadow = marker._shadow,
	  		    iconPos = getPosition(marker._icon),
	  		    latlng = marker._map.layerPointToLatLng(iconPos);

	  		// update shadow position
	  		if (shadow) {
	  			setPosition(shadow, iconPos);
	  		}

	  		marker._latlng = latlng;
	  		e.latlng = latlng;
	  		e.oldLatLng = this._oldLatLng;

	  		// @event drag: Event
	  		// Fired repeatedly while the user drags the marker.
	  		marker
	  		    .fire('move', e)
	  		    .fire('drag', e);
	  	},

	  	_onDragEnd: function (e) {
	  		// @event dragend: DragEndEvent
	  		// Fired when the user stops dragging the marker.

	  		 cancelAnimFrame(this._panRequest);

	  		// @event moveend: Event
	  		// Fired when the marker stops moving (because of dragging).
	  		delete this._oldLatLng;
	  		this._marker
	  		    .fire('moveend')
	  		    .fire('dragend', e);
	  	}
	  });

	  /*
	   * @class Marker
	   * @inherits Interactive layer
	   * @aka L.Marker
	   * L.Marker is used to display clickable/draggable icons on the map. Extends `Layer`.
	   *
	   * @example
	   *
	   * ```js
	   * L.marker([50.5, 30.5]).addTo(map);
	   * ```
	   */

	  var Marker = Layer.extend({

	  	// @section
	  	// @aka Marker options
	  	options: {
	  		// @option icon: Icon = *
	  		// Icon instance to use for rendering the marker.
	  		// See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
	  		// If not specified, a common instance of `L.Icon.Default` is used.
	  		icon: new IconDefault(),

	  		// Option inherited from "Interactive layer" abstract class
	  		interactive: true,

	  		// @option keyboard: Boolean = true
	  		// Whether the marker can be tabbed to with a keyboard and clicked by pressing enter.
	  		keyboard: true,

	  		// @option title: String = ''
	  		// Text for the browser tooltip that appear on marker hover (no tooltip by default).
	  		title: '',

	  		// @option alt: String = ''
	  		// Text for the `alt` attribute of the icon image (useful for accessibility).
	  		alt: '',

	  		// @option zIndexOffset: Number = 0
	  		// By default, marker images zIndex is set automatically based on its latitude. Use this option if you want to put the marker on top of all others (or below), specifying a high value like `1000` (or high negative value, respectively).
	  		zIndexOffset: 0,

	  		// @option opacity: Number = 1.0
	  		// The opacity of the marker.
	  		opacity: 1,

	  		// @option riseOnHover: Boolean = false
	  		// If `true`, the marker will get on top of others when you hover the mouse over it.
	  		riseOnHover: false,

	  		// @option riseOffset: Number = 250
	  		// The z-index offset used for the `riseOnHover` feature.
	  		riseOffset: 250,

	  		// @option pane: String = 'markerPane'
	  		// `Map pane` where the markers icon will be added.
	  		pane: 'markerPane',

	  		// @option shadowPane: String = 'shadowPane'
	  		// `Map pane` where the markers shadow will be added.
	  		shadowPane: 'shadowPane',

	  		// @option bubblingMouseEvents: Boolean = false
	  		// When `true`, a mouse event on this marker will trigger the same event on the map
	  		// (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
	  		bubblingMouseEvents: false,

	  		// @section Draggable marker options
	  		// @option draggable: Boolean = false
	  		// Whether the marker is draggable with mouse/touch or not.
	  		draggable: false,

	  		// @option autoPan: Boolean = false
	  		// Whether to pan the map when dragging this marker near its edge or not.
	  		autoPan: false,

	  		// @option autoPanPadding: Point = Point(50, 50)
	  		// Distance (in pixels to the left/right and to the top/bottom) of the
	  		// map edge to start panning the map.
	  		autoPanPadding: [50, 50],

	  		// @option autoPanSpeed: Number = 10
	  		// Number of pixels the map should pan by.
	  		autoPanSpeed: 10
	  	},

	  	/* @section
	  	 *
	  	 * In addition to [shared layer methods](#Layer) like `addTo()` and `remove()` and [popup methods](#Popup) like bindPopup() you can also use the following methods:
	  	 */

	  	initialize: function (latlng, options) {
	  		setOptions(this, options);
	  		this._latlng = toLatLng(latlng);
	  	},

	  	onAdd: function (map) {
	  		this._zoomAnimated = this._zoomAnimated && map.options.markerZoomAnimation;

	  		if (this._zoomAnimated) {
	  			map.on('zoomanim', this._animateZoom, this);
	  		}

	  		this._initIcon();
	  		this.update();
	  	},

	  	onRemove: function (map) {
	  		if (this.dragging && this.dragging.enabled()) {
	  			this.options.draggable = true;
	  			this.dragging.removeHooks();
	  		}
	  		delete this.dragging;

	  		if (this._zoomAnimated) {
	  			map.off('zoomanim', this._animateZoom, this);
	  		}

	  		this._removeIcon();
	  		this._removeShadow();
	  	},

	  	getEvents: function () {
	  		return {
	  			zoom: this.update,
	  			viewreset: this.update
	  		};
	  	},

	  	// @method getLatLng: LatLng
	  	// Returns the current geographical position of the marker.
	  	getLatLng: function () {
	  		return this._latlng;
	  	},

	  	// @method setLatLng(latlng: LatLng): this
	  	// Changes the marker position to the given point.
	  	setLatLng: function (latlng) {
	  		var oldLatLng = this._latlng;
	  		this._latlng = toLatLng(latlng);
	  		this.update();

	  		// @event move: Event
	  		// Fired when the marker is moved via [`setLatLng`](#marker-setlatlng) or by [dragging](#marker-dragging). Old and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
	  		return this.fire('move', {oldLatLng: oldLatLng, latlng: this._latlng});
	  	},

	  	// @method setZIndexOffset(offset: Number): this
	  	// Changes the [zIndex offset](#marker-zindexoffset) of the marker.
	  	setZIndexOffset: function (offset) {
	  		this.options.zIndexOffset = offset;
	  		return this.update();
	  	},

	  	// @method getIcon: Icon
	  	// Returns the current icon used by the marker
	  	getIcon: function () {
	  		return this.options.icon;
	  	},

	  	// @method setIcon(icon: Icon): this
	  	// Changes the marker icon.
	  	setIcon: function (icon) {

	  		this.options.icon = icon;

	  		if (this._map) {
	  			this._initIcon();
	  			this.update();
	  		}

	  		if (this._popup) {
	  			this.bindPopup(this._popup, this._popup.options);
	  		}

	  		return this;
	  	},

	  	getElement: function () {
	  		return this._icon;
	  	},

	  	update: function () {

	  		if (this._icon && this._map) {
	  			var pos = this._map.latLngToLayerPoint(this._latlng).round();
	  			this._setPos(pos);
	  		}

	  		return this;
	  	},

	  	_initIcon: function () {
	  		var options = this.options,
	  		    classToAdd = 'leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

	  		var icon = options.icon.createIcon(this._icon),
	  		    addIcon = false;

	  		// if we're not reusing the icon, remove the old one and init new one
	  		if (icon !== this._icon) {
	  			if (this._icon) {
	  				this._removeIcon();
	  			}
	  			addIcon = true;

	  			if (options.title) {
	  				icon.title = options.title;
	  			}

	  			if (icon.tagName === 'IMG') {
	  				icon.alt = options.alt || '';
	  			}
	  		}

	  		addClass(icon, classToAdd);

	  		if (options.keyboard) {
	  			icon.tabIndex = '0';
	  		}

	  		this._icon = icon;

	  		if (options.riseOnHover) {
	  			this.on({
	  				mouseover: this._bringToFront,
	  				mouseout: this._resetZIndex
	  			});
	  		}

	  		var newShadow = options.icon.createShadow(this._shadow),
	  		    addShadow = false;

	  		if (newShadow !== this._shadow) {
	  			this._removeShadow();
	  			addShadow = true;
	  		}

	  		if (newShadow) {
	  			addClass(newShadow, classToAdd);
	  			newShadow.alt = '';
	  		}
	  		this._shadow = newShadow;


	  		if (options.opacity < 1) {
	  			this._updateOpacity();
	  		}


	  		if (addIcon) {
	  			this.getPane().appendChild(this._icon);
	  		}
	  		this._initInteraction();
	  		if (newShadow && addShadow) {
	  			this.getPane(options.shadowPane).appendChild(this._shadow);
	  		}
	  	},

	  	_removeIcon: function () {
	  		if (this.options.riseOnHover) {
	  			this.off({
	  				mouseover: this._bringToFront,
	  				mouseout: this._resetZIndex
	  			});
	  		}

	  		remove(this._icon);
	  		this.removeInteractiveTarget(this._icon);

	  		this._icon = null;
	  	},

	  	_removeShadow: function () {
	  		if (this._shadow) {
	  			remove(this._shadow);
	  		}
	  		this._shadow = null;
	  	},

	  	_setPos: function (pos) {

	  		if (this._icon) {
	  			setPosition(this._icon, pos);
	  		}

	  		if (this._shadow) {
	  			setPosition(this._shadow, pos);
	  		}

	  		this._zIndex = pos.y + this.options.zIndexOffset;

	  		this._resetZIndex();
	  	},

	  	_updateZIndex: function (offset) {
	  		if (this._icon) {
	  			this._icon.style.zIndex = this._zIndex + offset;
	  		}
	  	},

	  	_animateZoom: function (opt) {
	  		var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();

	  		this._setPos(pos);
	  	},

	  	_initInteraction: function () {

	  		if (!this.options.interactive) { return; }

	  		addClass(this._icon, 'leaflet-interactive');

	  		this.addInteractiveTarget(this._icon);

	  		if (MarkerDrag) {
	  			var draggable = this.options.draggable;
	  			if (this.dragging) {
	  				draggable = this.dragging.enabled();
	  				this.dragging.disable();
	  			}

	  			this.dragging = new MarkerDrag(this);

	  			if (draggable) {
	  				this.dragging.enable();
	  			}
	  		}
	  	},

	  	// @method setOpacity(opacity: Number): this
	  	// Changes the opacity of the marker.
	  	setOpacity: function (opacity) {
	  		this.options.opacity = opacity;
	  		if (this._map) {
	  			this._updateOpacity();
	  		}

	  		return this;
	  	},

	  	_updateOpacity: function () {
	  		var opacity = this.options.opacity;

	  		if (this._icon) {
	  			setOpacity(this._icon, opacity);
	  		}

	  		if (this._shadow) {
	  			setOpacity(this._shadow, opacity);
	  		}
	  	},

	  	_bringToFront: function () {
	  		this._updateZIndex(this.options.riseOffset);
	  	},

	  	_resetZIndex: function () {
	  		this._updateZIndex(0);
	  	},

	  	_getPopupAnchor: function () {
	  		return this.options.icon.options.popupAnchor;
	  	},

	  	_getTooltipAnchor: function () {
	  		return this.options.icon.options.tooltipAnchor;
	  	}
	  });


	  // factory L.marker(latlng: LatLng, options? : Marker options)

	  // @factory L.marker(latlng: LatLng, options? : Marker options)
	  // Instantiates a Marker object given a geographical point and optionally an options object.
	  function marker(latlng, options) {
	  	return new Marker(latlng, options);
	  }

	  /*
	   * @class Path
	   * @aka L.Path
	   * @inherits Interactive layer
	   *
	   * An abstract class that contains options and constants shared between vector
	   * overlays (Polygon, Polyline, Circle). Do not use it directly. Extends `Layer`.
	   */

	  var Path = Layer.extend({

	  	// @section
	  	// @aka Path options
	  	options: {
	  		// @option stroke: Boolean = true
	  		// Whether to draw stroke along the path. Set it to `false` to disable borders on polygons or circles.
	  		stroke: true,

	  		// @option color: String = '#3388ff'
	  		// Stroke color
	  		color: '#3388ff',

	  		// @option weight: Number = 3
	  		// Stroke width in pixels
	  		weight: 3,

	  		// @option opacity: Number = 1.0
	  		// Stroke opacity
	  		opacity: 1,

	  		// @option lineCap: String= 'round'
	  		// A string that defines [shape to be used at the end](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) of the stroke.
	  		lineCap: 'round',

	  		// @option lineJoin: String = 'round'
	  		// A string that defines [shape to be used at the corners](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linejoin) of the stroke.
	  		lineJoin: 'round',

	  		// @option dashArray: String = null
	  		// A string that defines the stroke [dash pattern](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dasharray). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
	  		dashArray: null,

	  		// @option dashOffset: String = null
	  		// A string that defines the [distance into the dash pattern to start the dash](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dashoffset). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
	  		dashOffset: null,

	  		// @option fill: Boolean = depends
	  		// Whether to fill the path with color. Set it to `false` to disable filling on polygons or circles.
	  		fill: false,

	  		// @option fillColor: String = *
	  		// Fill color. Defaults to the value of the [`color`](#path-color) option
	  		fillColor: null,

	  		// @option fillOpacity: Number = 0.2
	  		// Fill opacity.
	  		fillOpacity: 0.2,

	  		// @option fillRule: String = 'evenodd'
	  		// A string that defines [how the inside of a shape](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule) is determined.
	  		fillRule: 'evenodd',

	  		// className: '',

	  		// Option inherited from "Interactive layer" abstract class
	  		interactive: true,

	  		// @option bubblingMouseEvents: Boolean = true
	  		// When `true`, a mouse event on this path will trigger the same event on the map
	  		// (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
	  		bubblingMouseEvents: true
	  	},

	  	beforeAdd: function (map) {
	  		// Renderer is set here because we need to call renderer.getEvents
	  		// before this.getEvents.
	  		this._renderer = map.getRenderer(this);
	  	},

	  	onAdd: function () {
	  		this._renderer._initPath(this);
	  		this._reset();
	  		this._renderer._addPath(this);
	  	},

	  	onRemove: function () {
	  		this._renderer._removePath(this);
	  	},

	  	// @method redraw(): this
	  	// Redraws the layer. Sometimes useful after you changed the coordinates that the path uses.
	  	redraw: function () {
	  		if (this._map) {
	  			this._renderer._updatePath(this);
	  		}
	  		return this;
	  	},

	  	// @method setStyle(style: Path options): this
	  	// Changes the appearance of a Path based on the options in the `Path options` object.
	  	setStyle: function (style) {
	  		setOptions(this, style);
	  		if (this._renderer) {
	  			this._renderer._updateStyle(this);
	  			if (this.options.stroke && style && Object.prototype.hasOwnProperty.call(style, 'weight')) {
	  				this._updateBounds();
	  			}
	  		}
	  		return this;
	  	},

	  	// @method bringToFront(): this
	  	// Brings the layer to the top of all path layers.
	  	bringToFront: function () {
	  		if (this._renderer) {
	  			this._renderer._bringToFront(this);
	  		}
	  		return this;
	  	},

	  	// @method bringToBack(): this
	  	// Brings the layer to the bottom of all path layers.
	  	bringToBack: function () {
	  		if (this._renderer) {
	  			this._renderer._bringToBack(this);
	  		}
	  		return this;
	  	},

	  	getElement: function () {
	  		return this._path;
	  	},

	  	_reset: function () {
	  		// defined in child classes
	  		this._project();
	  		this._update();
	  	},

	  	_clickTolerance: function () {
	  		// used when doing hit detection for Canvas layers
	  		return (this.options.stroke ? this.options.weight / 2 : 0) + this._renderer.options.tolerance;
	  	}
	  });

	  /*
	   * @class CircleMarker
	   * @aka L.CircleMarker
	   * @inherits Path
	   *
	   * A circle of a fixed size with radius specified in pixels. Extends `Path`.
	   */

	  var CircleMarker = Path.extend({

	  	// @section
	  	// @aka CircleMarker options
	  	options: {
	  		fill: true,

	  		// @option radius: Number = 10
	  		// Radius of the circle marker, in pixels
	  		radius: 10
	  	},

	  	initialize: function (latlng, options) {
	  		setOptions(this, options);
	  		this._latlng = toLatLng(latlng);
	  		this._radius = this.options.radius;
	  	},

	  	// @method setLatLng(latLng: LatLng): this
	  	// Sets the position of a circle marker to a new location.
	  	setLatLng: function (latlng) {
	  		var oldLatLng = this._latlng;
	  		this._latlng = toLatLng(latlng);
	  		this.redraw();

	  		// @event move: Event
	  		// Fired when the marker is moved via [`setLatLng`](#circlemarker-setlatlng). Old and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
	  		return this.fire('move', {oldLatLng: oldLatLng, latlng: this._latlng});
	  	},

	  	// @method getLatLng(): LatLng
	  	// Returns the current geographical position of the circle marker
	  	getLatLng: function () {
	  		return this._latlng;
	  	},

	  	// @method setRadius(radius: Number): this
	  	// Sets the radius of a circle marker. Units are in pixels.
	  	setRadius: function (radius) {
	  		this.options.radius = this._radius = radius;
	  		return this.redraw();
	  	},

	  	// @method getRadius(): Number
	  	// Returns the current radius of the circle
	  	getRadius: function () {
	  		return this._radius;
	  	},

	  	setStyle : function (options) {
	  		var radius = options && options.radius || this._radius;
	  		Path.prototype.setStyle.call(this, options);
	  		this.setRadius(radius);
	  		return this;
	  	},

	  	_project: function () {
	  		this._point = this._map.latLngToLayerPoint(this._latlng);
	  		this._updateBounds();
	  	},

	  	_updateBounds: function () {
	  		var r = this._radius,
	  		    r2 = this._radiusY || r,
	  		    w = this._clickTolerance(),
	  		    p = [r + w, r2 + w];
	  		this._pxBounds = new Bounds(this._point.subtract(p), this._point.add(p));
	  	},

	  	_update: function () {
	  		if (this._map) {
	  			this._updatePath();
	  		}
	  	},

	  	_updatePath: function () {
	  		this._renderer._updateCircle(this);
	  	},

	  	_empty: function () {
	  		return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
	  	},

	  	// Needed by the `Canvas` renderer for interactivity
	  	_containsPoint: function (p) {
	  		return p.distanceTo(this._point) <= this._radius + this._clickTolerance();
	  	}
	  });


	  // @factory L.circleMarker(latlng: LatLng, options?: CircleMarker options)
	  // Instantiates a circle marker object given a geographical point, and an optional options object.
	  function circleMarker(latlng, options) {
	  	return new CircleMarker(latlng, options);
	  }

	  /*
	   * @class Circle
	   * @aka L.Circle
	   * @inherits CircleMarker
	   *
	   * A class for drawing circle overlays on a map. Extends `CircleMarker`.
	   *
	   * It's an approximation and starts to diverge from a real circle closer to poles (due to projection distortion).
	   *
	   * @example
	   *
	   * ```js
	   * L.circle([50.5, 30.5], {radius: 200}).addTo(map);
	   * ```
	   */

	  var Circle = CircleMarker.extend({

	  	initialize: function (latlng, options, legacyOptions) {
	  		if (typeof options === 'number') {
	  			// Backwards compatibility with 0.7.x factory (latlng, radius, options?)
	  			options = extend({}, legacyOptions, {radius: options});
	  		}
	  		setOptions(this, options);
	  		this._latlng = toLatLng(latlng);

	  		if (isNaN(this.options.radius)) { throw new Error('Circle radius cannot be NaN'); }

	  		// @section
	  		// @aka Circle options
	  		// @option radius: Number; Radius of the circle, in meters.
	  		this._mRadius = this.options.radius;
	  	},

	  	// @method setRadius(radius: Number): this
	  	// Sets the radius of a circle. Units are in meters.
	  	setRadius: function (radius) {
	  		this._mRadius = radius;
	  		return this.redraw();
	  	},

	  	// @method getRadius(): Number
	  	// Returns the current radius of a circle. Units are in meters.
	  	getRadius: function () {
	  		return this._mRadius;
	  	},

	  	// @method getBounds(): LatLngBounds
	  	// Returns the `LatLngBounds` of the path.
	  	getBounds: function () {
	  		var half = [this._radius, this._radiusY || this._radius];

	  		return new LatLngBounds(
	  			this._map.layerPointToLatLng(this._point.subtract(half)),
	  			this._map.layerPointToLatLng(this._point.add(half)));
	  	},

	  	setStyle: Path.prototype.setStyle,

	  	_project: function () {

	  		var lng = this._latlng.lng,
	  		    lat = this._latlng.lat,
	  		    map = this._map,
	  		    crs = map.options.crs;

	  		if (crs.distance === Earth.distance) {
	  			var d = Math.PI / 180,
	  			    latR = (this._mRadius / Earth.R) / d,
	  			    top = map.project([lat + latR, lng]),
	  			    bottom = map.project([lat - latR, lng]),
	  			    p = top.add(bottom).divideBy(2),
	  			    lat2 = map.unproject(p).lat,
	  			    lngR = Math.acos((Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) /
	  			            (Math.cos(lat * d) * Math.cos(lat2 * d))) / d;

	  			if (isNaN(lngR) || lngR === 0) {
	  				lngR = latR / Math.cos(Math.PI / 180 * lat); // Fallback for edge case, #2425
	  			}

	  			this._point = p.subtract(map.getPixelOrigin());
	  			this._radius = isNaN(lngR) ? 0 : p.x - map.project([lat2, lng - lngR]).x;
	  			this._radiusY = p.y - top.y;

	  		} else {
	  			var latlng2 = crs.unproject(crs.project(this._latlng).subtract([this._mRadius, 0]));

	  			this._point = map.latLngToLayerPoint(this._latlng);
	  			this._radius = this._point.x - map.latLngToLayerPoint(latlng2).x;
	  		}

	  		this._updateBounds();
	  	}
	  });

	  // @factory L.circle(latlng: LatLng, options?: Circle options)
	  // Instantiates a circle object given a geographical point, and an options object
	  // which contains the circle radius.
	  // @alternative
	  // @factory L.circle(latlng: LatLng, radius: Number, options?: Circle options)
	  // Obsolete way of instantiating a circle, for compatibility with 0.7.x code.
	  // Do not use in new applications or plugins.
	  function circle(latlng, options, legacyOptions) {
	  	return new Circle(latlng, options, legacyOptions);
	  }

	  /*
	   * @class Polyline
	   * @aka L.Polyline
	   * @inherits Path
	   *
	   * A class for drawing polyline overlays on a map. Extends `Path`.
	   *
	   * @example
	   *
	   * ```js
	   * // create a red polyline from an array of LatLng points
	   * var latlngs = [
	   * 	[45.51, -122.68],
	   * 	[37.77, -122.43],
	   * 	[34.04, -118.2]
	   * ];
	   *
	   * var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
	   *
	   * // zoom the map to the polyline
	   * map.fitBounds(polyline.getBounds());
	   * ```
	   *
	   * You can also pass a multi-dimensional array to represent a `MultiPolyline` shape:
	   *
	   * ```js
	   * // create a red polyline from an array of arrays of LatLng points
	   * var latlngs = [
	   * 	[[45.51, -122.68],
	   * 	 [37.77, -122.43],
	   * 	 [34.04, -118.2]],
	   * 	[[40.78, -73.91],
	   * 	 [41.83, -87.62],
	   * 	 [32.76, -96.72]]
	   * ];
	   * ```
	   */


	  var Polyline = Path.extend({

	  	// @section
	  	// @aka Polyline options
	  	options: {
	  		// @option smoothFactor: Number = 1.0
	  		// How much to simplify the polyline on each zoom level. More means
	  		// better performance and smoother look, and less means more accurate representation.
	  		smoothFactor: 1.0,

	  		// @option noClip: Boolean = false
	  		// Disable polyline clipping.
	  		noClip: false
	  	},

	  	initialize: function (latlngs, options) {
	  		setOptions(this, options);
	  		this._setLatLngs(latlngs);
	  	},

	  	// @method getLatLngs(): LatLng[]
	  	// Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
	  	getLatLngs: function () {
	  		return this._latlngs;
	  	},

	  	// @method setLatLngs(latlngs: LatLng[]): this
	  	// Replaces all the points in the polyline with the given array of geographical points.
	  	setLatLngs: function (latlngs) {
	  		this._setLatLngs(latlngs);
	  		return this.redraw();
	  	},

	  	// @method isEmpty(): Boolean
	  	// Returns `true` if the Polyline has no LatLngs.
	  	isEmpty: function () {
	  		return !this._latlngs.length;
	  	},

	  	// @method closestLayerPoint(p: Point): Point
	  	// Returns the point closest to `p` on the Polyline.
	  	closestLayerPoint: function (p) {
	  		var minDistance = Infinity,
	  		    minPoint = null,
	  		    closest = _sqClosestPointOnSegment,
	  		    p1, p2;

	  		for (var j = 0, jLen = this._parts.length; j < jLen; j++) {
	  			var points = this._parts[j];

	  			for (var i = 1, len = points.length; i < len; i++) {
	  				p1 = points[i - 1];
	  				p2 = points[i];

	  				var sqDist = closest(p, p1, p2, true);

	  				if (sqDist < minDistance) {
	  					minDistance = sqDist;
	  					minPoint = closest(p, p1, p2);
	  				}
	  			}
	  		}
	  		if (minPoint) {
	  			minPoint.distance = Math.sqrt(minDistance);
	  		}
	  		return minPoint;
	  	},

	  	// @method getCenter(): LatLng
	  	// Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the polyline.
	  	getCenter: function () {
	  		// throws error when not yet added to map as this center calculation requires projected coordinates
	  		if (!this._map) {
	  			throw new Error('Must add layer to map before using getCenter()');
	  		}

	  		var i, halfDist, segDist, dist, p1, p2, ratio,
	  		    points = this._rings[0],
	  		    len = points.length;

	  		if (!len) { return null; }

	  		// polyline centroid algorithm; only uses the first ring if there are multiple

	  		for (i = 0, halfDist = 0; i < len - 1; i++) {
	  			halfDist += points[i].distanceTo(points[i + 1]) / 2;
	  		}

	  		// The line is so small in the current view that all points are on the same pixel.
	  		if (halfDist === 0) {
	  			return this._map.layerPointToLatLng(points[0]);
	  		}

	  		for (i = 0, dist = 0; i < len - 1; i++) {
	  			p1 = points[i];
	  			p2 = points[i + 1];
	  			segDist = p1.distanceTo(p2);
	  			dist += segDist;

	  			if (dist > halfDist) {
	  				ratio = (dist - halfDist) / segDist;
	  				return this._map.layerPointToLatLng([
	  					p2.x - ratio * (p2.x - p1.x),
	  					p2.y - ratio * (p2.y - p1.y)
	  				]);
	  			}
	  		}
	  	},

	  	// @method getBounds(): LatLngBounds
	  	// Returns the `LatLngBounds` of the path.
	  	getBounds: function () {
	  		return this._bounds;
	  	},

	  	// @method addLatLng(latlng: LatLng, latlngs?: LatLng[]): this
	  	// Adds a given point to the polyline. By default, adds to the first ring of
	  	// the polyline in case of a multi-polyline, but can be overridden by passing
	  	// a specific ring as a LatLng array (that you can earlier access with [`getLatLngs`](#polyline-getlatlngs)).
	  	addLatLng: function (latlng, latlngs) {
	  		latlngs = latlngs || this._defaultShape();
	  		latlng = toLatLng(latlng);
	  		latlngs.push(latlng);
	  		this._bounds.extend(latlng);
	  		return this.redraw();
	  	},

	  	_setLatLngs: function (latlngs) {
	  		this._bounds = new LatLngBounds();
	  		this._latlngs = this._convertLatLngs(latlngs);
	  	},

	  	_defaultShape: function () {
	  		return isFlat(this._latlngs) ? this._latlngs : this._latlngs[0];
	  	},

	  	// recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
	  	_convertLatLngs: function (latlngs) {
	  		var result = [],
	  		    flat = isFlat(latlngs);

	  		for (var i = 0, len = latlngs.length; i < len; i++) {
	  			if (flat) {
	  				result[i] = toLatLng(latlngs[i]);
	  				this._bounds.extend(result[i]);
	  			} else {
	  				result[i] = this._convertLatLngs(latlngs[i]);
	  			}
	  		}

	  		return result;
	  	},

	  	_project: function () {
	  		var pxBounds = new Bounds();
	  		this._rings = [];
	  		this._projectLatlngs(this._latlngs, this._rings, pxBounds);

	  		if (this._bounds.isValid() && pxBounds.isValid()) {
	  			this._rawPxBounds = pxBounds;
	  			this._updateBounds();
	  		}
	  	},

	  	_updateBounds: function () {
	  		var w = this._clickTolerance(),
	  		    p = new Point(w, w);
	  		this._pxBounds = new Bounds([
	  			this._rawPxBounds.min.subtract(p),
	  			this._rawPxBounds.max.add(p)
	  		]);
	  	},

	  	// recursively turns latlngs into a set of rings with projected coordinates
	  	_projectLatlngs: function (latlngs, result, projectedBounds) {
	  		var flat = latlngs[0] instanceof LatLng,
	  		    len = latlngs.length,
	  		    i, ring;

	  		if (flat) {
	  			ring = [];
	  			for (i = 0; i < len; i++) {
	  				ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
	  				projectedBounds.extend(ring[i]);
	  			}
	  			result.push(ring);
	  		} else {
	  			for (i = 0; i < len; i++) {
	  				this._projectLatlngs(latlngs[i], result, projectedBounds);
	  			}
	  		}
	  	},

	  	// clip polyline by renderer bounds so that we have less to render for performance
	  	_clipPoints: function () {
	  		var bounds = this._renderer._bounds;

	  		this._parts = [];
	  		if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
	  			return;
	  		}

	  		if (this.options.noClip) {
	  			this._parts = this._rings;
	  			return;
	  		}

	  		var parts = this._parts,
	  		    i, j, k, len, len2, segment, points;

	  		for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
	  			points = this._rings[i];

	  			for (j = 0, len2 = points.length; j < len2 - 1; j++) {
	  				segment = clipSegment(points[j], points[j + 1], bounds, j, true);

	  				if (!segment) { continue; }

	  				parts[k] = parts[k] || [];
	  				parts[k].push(segment[0]);

	  				// if segment goes out of screen, or it's the last one, it's the end of the line part
	  				if ((segment[1] !== points[j + 1]) || (j === len2 - 2)) {
	  					parts[k].push(segment[1]);
	  					k++;
	  				}
	  			}
	  		}
	  	},

	  	// simplify each clipped part of the polyline for performance
	  	_simplifyPoints: function () {
	  		var parts = this._parts,
	  		    tolerance = this.options.smoothFactor;

	  		for (var i = 0, len = parts.length; i < len; i++) {
	  			parts[i] = simplify(parts[i], tolerance);
	  		}
	  	},

	  	_update: function () {
	  		if (!this._map) { return; }

	  		this._clipPoints();
	  		this._simplifyPoints();
	  		this._updatePath();
	  	},

	  	_updatePath: function () {
	  		this._renderer._updatePoly(this);
	  	},

	  	// Needed by the `Canvas` renderer for interactivity
	  	_containsPoint: function (p, closed) {
	  		var i, j, k, len, len2, part,
	  		    w = this._clickTolerance();

	  		if (!this._pxBounds || !this._pxBounds.contains(p)) { return false; }

	  		// hit detection for polylines
	  		for (i = 0, len = this._parts.length; i < len; i++) {
	  			part = this._parts[i];

	  			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
	  				if (!closed && (j === 0)) { continue; }

	  				if (pointToSegmentDistance(p, part[k], part[j]) <= w) {
	  					return true;
	  				}
	  			}
	  		}
	  		return false;
	  	}
	  });

	  // @factory L.polyline(latlngs: LatLng[], options?: Polyline options)
	  // Instantiates a polyline object given an array of geographical points and
	  // optionally an options object. You can create a `Polyline` object with
	  // multiple separate lines (`MultiPolyline`) by passing an array of arrays
	  // of geographic points.
	  function polyline(latlngs, options) {
	  	return new Polyline(latlngs, options);
	  }

	  // Retrocompat. Allow plugins to support Leaflet versions before and after 1.1.
	  Polyline._flat = _flat;

	  /*
	   * @class Polygon
	   * @aka L.Polygon
	   * @inherits Polyline
	   *
	   * A class for drawing polygon overlays on a map. Extends `Polyline`.
	   *
	   * Note that points you pass when creating a polygon shouldn't have an additional last point equal to the first one — it's better to filter out such points.
	   *
	   *
	   * @example
	   *
	   * ```js
	   * // create a red polygon from an array of LatLng points
	   * var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];
	   *
	   * var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);
	   *
	   * // zoom the map to the polygon
	   * map.fitBounds(polygon.getBounds());
	   * ```
	   *
	   * You can also pass an array of arrays of latlngs, with the first array representing the outer shape and the other arrays representing holes in the outer shape:
	   *
	   * ```js
	   * var latlngs = [
	   *   [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
	   *   [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
	   * ];
	   * ```
	   *
	   * Additionally, you can pass a multi-dimensional array to represent a MultiPolygon shape.
	   *
	   * ```js
	   * var latlngs = [
	   *   [ // first polygon
	   *     [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
	   *     [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
	   *   ],
	   *   [ // second polygon
	   *     [[41, -111.03],[45, -111.04],[45, -104.05],[41, -104.05]]
	   *   ]
	   * ];
	   * ```
	   */

	  var Polygon = Polyline.extend({

	  	options: {
	  		fill: true
	  	},

	  	isEmpty: function () {
	  		return !this._latlngs.length || !this._latlngs[0].length;
	  	},

	  	getCenter: function () {
	  		// throws error when not yet added to map as this center calculation requires projected coordinates
	  		if (!this._map) {
	  			throw new Error('Must add layer to map before using getCenter()');
	  		}

	  		var i, j, p1, p2, f, area, x, y, center,
	  		    points = this._rings[0],
	  		    len = points.length;

	  		if (!len) { return null; }

	  		// polygon centroid algorithm; only uses the first ring if there are multiple

	  		area = x = y = 0;

	  		for (i = 0, j = len - 1; i < len; j = i++) {
	  			p1 = points[i];
	  			p2 = points[j];

	  			f = p1.y * p2.x - p2.y * p1.x;
	  			x += (p1.x + p2.x) * f;
	  			y += (p1.y + p2.y) * f;
	  			area += f * 3;
	  		}

	  		if (area === 0) {
	  			// Polygon is so small that all points are on same pixel.
	  			center = points[0];
	  		} else {
	  			center = [x / area, y / area];
	  		}
	  		return this._map.layerPointToLatLng(center);
	  	},

	  	_convertLatLngs: function (latlngs) {
	  		var result = Polyline.prototype._convertLatLngs.call(this, latlngs),
	  		    len = result.length;

	  		// remove last point if it equals first one
	  		if (len >= 2 && result[0] instanceof LatLng && result[0].equals(result[len - 1])) {
	  			result.pop();
	  		}
	  		return result;
	  	},

	  	_setLatLngs: function (latlngs) {
	  		Polyline.prototype._setLatLngs.call(this, latlngs);
	  		if (isFlat(this._latlngs)) {
	  			this._latlngs = [this._latlngs];
	  		}
	  	},

	  	_defaultShape: function () {
	  		return isFlat(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
	  	},

	  	_clipPoints: function () {
	  		// polygons need a different clipping algorithm so we redefine that

	  		var bounds = this._renderer._bounds,
	  		    w = this.options.weight,
	  		    p = new Point(w, w);

	  		// increase clip padding by stroke width to avoid stroke on clip edges
	  		bounds = new Bounds(bounds.min.subtract(p), bounds.max.add(p));

	  		this._parts = [];
	  		if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
	  			return;
	  		}

	  		if (this.options.noClip) {
	  			this._parts = this._rings;
	  			return;
	  		}

	  		for (var i = 0, len = this._rings.length, clipped; i < len; i++) {
	  			clipped = clipPolygon(this._rings[i], bounds, true);
	  			if (clipped.length) {
	  				this._parts.push(clipped);
	  			}
	  		}
	  	},

	  	_updatePath: function () {
	  		this._renderer._updatePoly(this, true);
	  	},

	  	// Needed by the `Canvas` renderer for interactivity
	  	_containsPoint: function (p) {
	  		var inside = false,
	  		    part, p1, p2, i, j, k, len, len2;

	  		if (!this._pxBounds || !this._pxBounds.contains(p)) { return false; }

	  		// ray casting algorithm for detecting if point is in polygon
	  		for (i = 0, len = this._parts.length; i < len; i++) {
	  			part = this._parts[i];

	  			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
	  				p1 = part[j];
	  				p2 = part[k];

	  				if (((p1.y > p.y) !== (p2.y > p.y)) && (p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
	  					inside = !inside;
	  				}
	  			}
	  		}

	  		// also check if it's on polygon stroke
	  		return inside || Polyline.prototype._containsPoint.call(this, p, true);
	  	}

	  });


	  // @factory L.polygon(latlngs: LatLng[], options?: Polyline options)
	  function polygon(latlngs, options) {
	  	return new Polygon(latlngs, options);
	  }

	  /*
	   * @class GeoJSON
	   * @aka L.GeoJSON
	   * @inherits FeatureGroup
	   *
	   * Represents a GeoJSON object or an array of GeoJSON objects. Allows you to parse
	   * GeoJSON data and display it on the map. Extends `FeatureGroup`.
	   *
	   * @example
	   *
	   * ```js
	   * L.geoJSON(data, {
	   * 	style: function (feature) {
	   * 		return {color: feature.properties.color};
	   * 	}
	   * }).bindPopup(function (layer) {
	   * 	return layer.feature.properties.description;
	   * }).addTo(map);
	   * ```
	   */

	  var GeoJSON = FeatureGroup.extend({

	  	/* @section
	  	 * @aka GeoJSON options
	  	 *
	  	 * @option pointToLayer: Function = *
	  	 * A `Function` defining how GeoJSON points spawn Leaflet layers. It is internally
	  	 * called when data is added, passing the GeoJSON point feature and its `LatLng`.
	  	 * The default is to spawn a default `Marker`:
	  	 * ```js
	  	 * function(geoJsonPoint, latlng) {
	  	 * 	return L.marker(latlng);
	  	 * }
	  	 * ```
	  	 *
	  	 * @option style: Function = *
	  	 * A `Function` defining the `Path options` for styling GeoJSON lines and polygons,
	  	 * called internally when data is added.
	  	 * The default value is to not override any defaults:
	  	 * ```js
	  	 * function (geoJsonFeature) {
	  	 * 	return {}
	  	 * }
	  	 * ```
	  	 *
	  	 * @option onEachFeature: Function = *
	  	 * A `Function` that will be called once for each created `Feature`, after it has
	  	 * been created and styled. Useful for attaching events and popups to features.
	  	 * The default is to do nothing with the newly created layers:
	  	 * ```js
	  	 * function (feature, layer) {}
	  	 * ```
	  	 *
	  	 * @option filter: Function = *
	  	 * A `Function` that will be used to decide whether to include a feature or not.
	  	 * The default is to include all features:
	  	 * ```js
	  	 * function (geoJsonFeature) {
	  	 * 	return true;
	  	 * }
	  	 * ```
	  	 * Note: dynamically changing the `filter` option will have effect only on newly
	  	 * added data. It will _not_ re-evaluate already included features.
	  	 *
	  	 * @option coordsToLatLng: Function = *
	  	 * A `Function` that will be used for converting GeoJSON coordinates to `LatLng`s.
	  	 * The default is the `coordsToLatLng` static method.
	  	 *
	  	 * @option markersInheritOptions: Boolean = false
	  	 * Whether default Markers for "Point" type Features inherit from group options.
	  	 */

	  	initialize: function (geojson, options) {
	  		setOptions(this, options);

	  		this._layers = {};

	  		if (geojson) {
	  			this.addData(geojson);
	  		}
	  	},

	  	// @method addData( <GeoJSON> data ): this
	  	// Adds a GeoJSON object to the layer.
	  	addData: function (geojson) {
	  		var features = isArray(geojson) ? geojson : geojson.features,
	  		    i, len, feature;

	  		if (features) {
	  			for (i = 0, len = features.length; i < len; i++) {
	  				// only add this if geometry or geometries are set and not null
	  				feature = features[i];
	  				if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
	  					this.addData(feature);
	  				}
	  			}
	  			return this;
	  		}

	  		var options = this.options;

	  		if (options.filter && !options.filter(geojson)) { return this; }

	  		var layer = geometryToLayer(geojson, options);
	  		if (!layer) {
	  			return this;
	  		}
	  		layer.feature = asFeature(geojson);

	  		layer.defaultOptions = layer.options;
	  		this.resetStyle(layer);

	  		if (options.onEachFeature) {
	  			options.onEachFeature(geojson, layer);
	  		}

	  		return this.addLayer(layer);
	  	},

	  	// @method resetStyle( <Path> layer? ): this
	  	// Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
	  	// If `layer` is omitted, the style of all features in the current layer is reset.
	  	resetStyle: function (layer) {
	  		if (layer === undefined) {
	  			return this.eachLayer(this.resetStyle, this);
	  		}
	  		// reset any custom styles
	  		layer.options = extend({}, layer.defaultOptions);
	  		this._setLayerStyle(layer, this.options.style);
	  		return this;
	  	},

	  	// @method setStyle( <Function> style ): this
	  	// Changes styles of GeoJSON vector layers with the given style function.
	  	setStyle: function (style) {
	  		return this.eachLayer(function (layer) {
	  			this._setLayerStyle(layer, style);
	  		}, this);
	  	},

	  	_setLayerStyle: function (layer, style) {
	  		if (layer.setStyle) {
	  			if (typeof style === 'function') {
	  				style = style(layer.feature);
	  			}
	  			layer.setStyle(style);
	  		}
	  	}
	  });

	  // @section
	  // There are several static functions which can be called without instantiating L.GeoJSON:

	  // @function geometryToLayer(featureData: Object, options?: GeoJSON options): Layer
	  // Creates a `Layer` from a given GeoJSON feature. Can use a custom
	  // [`pointToLayer`](#geojson-pointtolayer) and/or [`coordsToLatLng`](#geojson-coordstolatlng)
	  // functions if provided as options.
	  function geometryToLayer(geojson, options) {

	  	var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
	  	    coords = geometry ? geometry.coordinates : null,
	  	    layers = [],
	  	    pointToLayer = options && options.pointToLayer,
	  	    _coordsToLatLng = options && options.coordsToLatLng || coordsToLatLng,
	  	    latlng, latlngs, i, len;

	  	if (!coords && !geometry) {
	  		return null;
	  	}

	  	switch (geometry.type) {
	  	case 'Point':
	  		latlng = _coordsToLatLng(coords);
	  		return _pointToLayer(pointToLayer, geojson, latlng, options);

	  	case 'MultiPoint':
	  		for (i = 0, len = coords.length; i < len; i++) {
	  			latlng = _coordsToLatLng(coords[i]);
	  			layers.push(_pointToLayer(pointToLayer, geojson, latlng, options));
	  		}
	  		return new FeatureGroup(layers);

	  	case 'LineString':
	  	case 'MultiLineString':
	  		latlngs = coordsToLatLngs(coords, geometry.type === 'LineString' ? 0 : 1, _coordsToLatLng);
	  		return new Polyline(latlngs, options);

	  	case 'Polygon':
	  	case 'MultiPolygon':
	  		latlngs = coordsToLatLngs(coords, geometry.type === 'Polygon' ? 1 : 2, _coordsToLatLng);
	  		return new Polygon(latlngs, options);

	  	case 'GeometryCollection':
	  		for (i = 0, len = geometry.geometries.length; i < len; i++) {
	  			var layer = geometryToLayer({
	  				geometry: geometry.geometries[i],
	  				type: 'Feature',
	  				properties: geojson.properties
	  			}, options);

	  			if (layer) {
	  				layers.push(layer);
	  			}
	  		}
	  		return new FeatureGroup(layers);

	  	default:
	  		throw new Error('Invalid GeoJSON object.');
	  	}
	  }

	  function _pointToLayer(pointToLayerFn, geojson, latlng, options) {
	  	return pointToLayerFn ?
	  		pointToLayerFn(geojson, latlng) :
	  		new Marker(latlng, options && options.markersInheritOptions && options);
	  }

	  // @function coordsToLatLng(coords: Array): LatLng
	  // Creates a `LatLng` object from an array of 2 numbers (longitude, latitude)
	  // or 3 numbers (longitude, latitude, altitude) used in GeoJSON for points.
	  function coordsToLatLng(coords) {
	  	return new LatLng(coords[1], coords[0], coords[2]);
	  }

	  // @function coordsToLatLngs(coords: Array, levelsDeep?: Number, coordsToLatLng?: Function): Array
	  // Creates a multidimensional array of `LatLng`s from a GeoJSON coordinates array.
	  // `levelsDeep` specifies the nesting level (0 is for an array of points, 1 for an array of arrays of points, etc., 0 by default).
	  // Can use a custom [`coordsToLatLng`](#geojson-coordstolatlng) function.
	  function coordsToLatLngs(coords, levelsDeep, _coordsToLatLng) {
	  	var latlngs = [];

	  	for (var i = 0, len = coords.length, latlng; i < len; i++) {
	  		latlng = levelsDeep ?
	  			coordsToLatLngs(coords[i], levelsDeep - 1, _coordsToLatLng) :
	  			(_coordsToLatLng || coordsToLatLng)(coords[i]);

	  		latlngs.push(latlng);
	  	}

	  	return latlngs;
	  }

	  // @function latLngToCoords(latlng: LatLng, precision?: Number): Array
	  // Reverse of [`coordsToLatLng`](#geojson-coordstolatlng)
	  function latLngToCoords(latlng, precision) {
	  	precision = typeof precision === 'number' ? precision : 6;
	  	return latlng.alt !== undefined ?
	  		[formatNum(latlng.lng, precision), formatNum(latlng.lat, precision), formatNum(latlng.alt, precision)] :
	  		[formatNum(latlng.lng, precision), formatNum(latlng.lat, precision)];
	  }

	  // @function latLngsToCoords(latlngs: Array, levelsDeep?: Number, closed?: Boolean): Array
	  // Reverse of [`coordsToLatLngs`](#geojson-coordstolatlngs)
	  // `closed` determines whether the first point should be appended to the end of the array to close the feature, only used when `levelsDeep` is 0. False by default.
	  function latLngsToCoords(latlngs, levelsDeep, closed, precision) {
	  	var coords = [];

	  	for (var i = 0, len = latlngs.length; i < len; i++) {
	  		coords.push(levelsDeep ?
	  			latLngsToCoords(latlngs[i], levelsDeep - 1, closed, precision) :
	  			latLngToCoords(latlngs[i], precision));
	  	}

	  	if (!levelsDeep && closed) {
	  		coords.push(coords[0]);
	  	}

	  	return coords;
	  }

	  function getFeature(layer, newGeometry) {
	  	return layer.feature ?
	  		extend({}, layer.feature, {geometry: newGeometry}) :
	  		asFeature(newGeometry);
	  }

	  // @function asFeature(geojson: Object): Object
	  // Normalize GeoJSON geometries/features into GeoJSON features.
	  function asFeature(geojson) {
	  	if (geojson.type === 'Feature' || geojson.type === 'FeatureCollection') {
	  		return geojson;
	  	}

	  	return {
	  		type: 'Feature',
	  		properties: {},
	  		geometry: geojson
	  	};
	  }

	  var PointToGeoJSON = {
	  	toGeoJSON: function (precision) {
	  		return getFeature(this, {
	  			type: 'Point',
	  			coordinates: latLngToCoords(this.getLatLng(), precision)
	  		});
	  	}
	  };

	  // @namespace Marker
	  // @section Other methods
	  // @method toGeoJSON(precision?: Number): Object
	  // `precision` is the number of decimal places for coordinates.
	  // The default value is 6 places.
	  // Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the marker (as a GeoJSON `Point` Feature).
	  Marker.include(PointToGeoJSON);

	  // @namespace CircleMarker
	  // @method toGeoJSON(precision?: Number): Object
	  // `precision` is the number of decimal places for coordinates.
	  // The default value is 6 places.
	  // Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the circle marker (as a GeoJSON `Point` Feature).
	  Circle.include(PointToGeoJSON);
	  CircleMarker.include(PointToGeoJSON);


	  // @namespace Polyline
	  // @method toGeoJSON(precision?: Number): Object
	  // `precision` is the number of decimal places for coordinates.
	  // The default value is 6 places.
	  // Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polyline (as a GeoJSON `LineString` or `MultiLineString` Feature).
	  Polyline.include({
	  	toGeoJSON: function (precision) {
	  		var multi = !isFlat(this._latlngs);

	  		var coords = latLngsToCoords(this._latlngs, multi ? 1 : 0, false, precision);

	  		return getFeature(this, {
	  			type: (multi ? 'Multi' : '') + 'LineString',
	  			coordinates: coords
	  		});
	  	}
	  });

	  // @namespace Polygon
	  // @method toGeoJSON(precision?: Number): Object
	  // `precision` is the number of decimal places for coordinates.
	  // The default value is 6 places.
	  // Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polygon (as a GeoJSON `Polygon` or `MultiPolygon` Feature).
	  Polygon.include({
	  	toGeoJSON: function (precision) {
	  		var holes = !isFlat(this._latlngs),
	  		    multi = holes && !isFlat(this._latlngs[0]);

	  		var coords = latLngsToCoords(this._latlngs, multi ? 2 : holes ? 1 : 0, true, precision);

	  		if (!holes) {
	  			coords = [coords];
	  		}

	  		return getFeature(this, {
	  			type: (multi ? 'Multi' : '') + 'Polygon',
	  			coordinates: coords
	  		});
	  	}
	  });


	  // @namespace LayerGroup
	  LayerGroup.include({
	  	toMultiPoint: function (precision) {
	  		var coords = [];

	  		this.eachLayer(function (layer) {
	  			coords.push(layer.toGeoJSON(precision).geometry.coordinates);
	  		});

	  		return getFeature(this, {
	  			type: 'MultiPoint',
	  			coordinates: coords
	  		});
	  	},

	  	// @method toGeoJSON(precision?: Number): Object
	  	// `precision` is the number of decimal places for coordinates.
	  	// The default value is 6 places.
	  	// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
	  	toGeoJSON: function (precision) {

	  		var type = this.feature && this.feature.geometry && this.feature.geometry.type;

	  		if (type === 'MultiPoint') {
	  			return this.toMultiPoint(precision);
	  		}

	  		var isGeometryCollection = type === 'GeometryCollection',
	  		    jsons = [];

	  		this.eachLayer(function (layer) {
	  			if (layer.toGeoJSON) {
	  				var json = layer.toGeoJSON(precision);
	  				if (isGeometryCollection) {
	  					jsons.push(json.geometry);
	  				} else {
	  					var feature = asFeature(json);
	  					// Squash nested feature collections
	  					if (feature.type === 'FeatureCollection') {
	  						jsons.push.apply(jsons, feature.features);
	  					} else {
	  						jsons.push(feature);
	  					}
	  				}
	  			}
	  		});

	  		if (isGeometryCollection) {
	  			return getFeature(this, {
	  				geometries: jsons,
	  				type: 'GeometryCollection'
	  			});
	  		}

	  		return {
	  			type: 'FeatureCollection',
	  			features: jsons
	  		};
	  	}
	  });

	  // @namespace GeoJSON
	  // @factory L.geoJSON(geojson?: Object, options?: GeoJSON options)
	  // Creates a GeoJSON layer. Optionally accepts an object in
	  // [GeoJSON format](https://tools.ietf.org/html/rfc7946) to display on the map
	  // (you can alternatively add it later with `addData` method) and an `options` object.
	  function geoJSON(geojson, options) {
	  	return new GeoJSON(geojson, options);
	  }

	  // Backward compatibility.
	  var geoJson = geoJSON;

	  /*
	   * @class ImageOverlay
	   * @aka L.ImageOverlay
	   * @inherits Interactive layer
	   *
	   * Used to load and display a single image over specific bounds of the map. Extends `Layer`.
	   *
	   * @example
	   *
	   * ```js
	   * var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
	   * 	imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
	   * L.imageOverlay(imageUrl, imageBounds).addTo(map);
	   * ```
	   */

	  var ImageOverlay = Layer.extend({

	  	// @section
	  	// @aka ImageOverlay options
	  	options: {
	  		// @option opacity: Number = 1.0
	  		// The opacity of the image overlay.
	  		opacity: 1,

	  		// @option alt: String = ''
	  		// Text for the `alt` attribute of the image (useful for accessibility).
	  		alt: '',

	  		// @option interactive: Boolean = false
	  		// If `true`, the image overlay will emit [mouse events](#interactive-layer) when clicked or hovered.
	  		interactive: false,

	  		// @option crossOrigin: Boolean|String = false
	  		// Whether the crossOrigin attribute will be added to the image.
	  		// If a String is provided, the image will have its crossOrigin attribute set to the String provided. This is needed if you want to access image pixel data.
	  		// Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
	  		crossOrigin: false,

	  		// @option errorOverlayUrl: String = ''
	  		// URL to the overlay image to show in place of the overlay that failed to load.
	  		errorOverlayUrl: '',

	  		// @option zIndex: Number = 1
	  		// The explicit [zIndex](https://developer.mozilla.org/docs/Web/CSS/CSS_Positioning/Understanding_z_index) of the overlay layer.
	  		zIndex: 1,

	  		// @option className: String = ''
	  		// A custom class name to assign to the image. Empty by default.
	  		className: ''
	  	},

	  	initialize: function (url, bounds, options) { // (String, LatLngBounds, Object)
	  		this._url = url;
	  		this._bounds = toLatLngBounds(bounds);

	  		setOptions(this, options);
	  	},

	  	onAdd: function () {
	  		if (!this._image) {
	  			this._initImage();

	  			if (this.options.opacity < 1) {
	  				this._updateOpacity();
	  			}
	  		}

	  		if (this.options.interactive) {
	  			addClass(this._image, 'leaflet-interactive');
	  			this.addInteractiveTarget(this._image);
	  		}

	  		this.getPane().appendChild(this._image);
	  		this._reset();
	  	},

	  	onRemove: function () {
	  		remove(this._image);
	  		if (this.options.interactive) {
	  			this.removeInteractiveTarget(this._image);
	  		}
	  	},

	  	// @method setOpacity(opacity: Number): this
	  	// Sets the opacity of the overlay.
	  	setOpacity: function (opacity) {
	  		this.options.opacity = opacity;

	  		if (this._image) {
	  			this._updateOpacity();
	  		}
	  		return this;
	  	},

	  	setStyle: function (styleOpts) {
	  		if (styleOpts.opacity) {
	  			this.setOpacity(styleOpts.opacity);
	  		}
	  		return this;
	  	},

	  	// @method bringToFront(): this
	  	// Brings the layer to the top of all overlays.
	  	bringToFront: function () {
	  		if (this._map) {
	  			toFront(this._image);
	  		}
	  		return this;
	  	},

	  	// @method bringToBack(): this
	  	// Brings the layer to the bottom of all overlays.
	  	bringToBack: function () {
	  		if (this._map) {
	  			toBack(this._image);
	  		}
	  		return this;
	  	},

	  	// @method setUrl(url: String): this
	  	// Changes the URL of the image.
	  	setUrl: function (url) {
	  		this._url = url;

	  		if (this._image) {
	  			this._image.src = url;
	  		}
	  		return this;
	  	},

	  	// @method setBounds(bounds: LatLngBounds): this
	  	// Update the bounds that this ImageOverlay covers
	  	setBounds: function (bounds) {
	  		this._bounds = toLatLngBounds(bounds);

	  		if (this._map) {
	  			this._reset();
	  		}
	  		return this;
	  	},

	  	getEvents: function () {
	  		var events = {
	  			zoom: this._reset,
	  			viewreset: this._reset
	  		};

	  		if (this._zoomAnimated) {
	  			events.zoomanim = this._animateZoom;
	  		}

	  		return events;
	  	},

	  	// @method setZIndex(value: Number): this
	  	// Changes the [zIndex](#imageoverlay-zindex) of the image overlay.
	  	setZIndex: function (value) {
	  		this.options.zIndex = value;
	  		this._updateZIndex();
	  		return this;
	  	},

	  	// @method getBounds(): LatLngBounds
	  	// Get the bounds that this ImageOverlay covers
	  	getBounds: function () {
	  		return this._bounds;
	  	},

	  	// @method getElement(): HTMLElement
	  	// Returns the instance of [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)
	  	// used by this overlay.
	  	getElement: function () {
	  		return this._image;
	  	},

	  	_initImage: function () {
	  		var wasElementSupplied = this._url.tagName === 'IMG';
	  		var img = this._image = wasElementSupplied ? this._url : create$1('img');

	  		addClass(img, 'leaflet-image-layer');
	  		if (this._zoomAnimated) { addClass(img, 'leaflet-zoom-animated'); }
	  		if (this.options.className) { addClass(img, this.options.className); }

	  		img.onselectstart = falseFn;
	  		img.onmousemove = falseFn;

	  		// @event load: Event
	  		// Fired when the ImageOverlay layer has loaded its image
	  		img.onload = bind(this.fire, this, 'load');
	  		img.onerror = bind(this._overlayOnError, this, 'error');

	  		if (this.options.crossOrigin || this.options.crossOrigin === '') {
	  			img.crossOrigin = this.options.crossOrigin === true ? '' : this.options.crossOrigin;
	  		}

	  		if (this.options.zIndex) {
	  			this._updateZIndex();
	  		}

	  		if (wasElementSupplied) {
	  			this._url = img.src;
	  			return;
	  		}

	  		img.src = this._url;
	  		img.alt = this.options.alt;
	  	},

	  	_animateZoom: function (e) {
	  		var scale = this._map.getZoomScale(e.zoom),
	  		    offset = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;

	  		setTransform(this._image, offset, scale);
	  	},

	  	_reset: function () {
	  		var image = this._image,
	  		    bounds = new Bounds(
	  		        this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
	  		        this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
	  		    size = bounds.getSize();

	  		setPosition(image, bounds.min);

	  		image.style.width  = size.x + 'px';
	  		image.style.height = size.y + 'px';
	  	},

	  	_updateOpacity: function () {
	  		setOpacity(this._image, this.options.opacity);
	  	},

	  	_updateZIndex: function () {
	  		if (this._image && this.options.zIndex !== undefined && this.options.zIndex !== null) {
	  			this._image.style.zIndex = this.options.zIndex;
	  		}
	  	},

	  	_overlayOnError: function () {
	  		// @event error: Event
	  		// Fired when the ImageOverlay layer fails to load its image
	  		this.fire('error');

	  		var errorUrl = this.options.errorOverlayUrl;
	  		if (errorUrl && this._url !== errorUrl) {
	  			this._url = errorUrl;
	  			this._image.src = errorUrl;
	  		}
	  	}
	  });

	  // @factory L.imageOverlay(imageUrl: String, bounds: LatLngBounds, options?: ImageOverlay options)
	  // Instantiates an image overlay object given the URL of the image and the
	  // geographical bounds it is tied to.
	  var imageOverlay = function (url, bounds, options) {
	  	return new ImageOverlay(url, bounds, options);
	  };

	  /*
	   * @class VideoOverlay
	   * @aka L.VideoOverlay
	   * @inherits ImageOverlay
	   *
	   * Used to load and display a video player over specific bounds of the map. Extends `ImageOverlay`.
	   *
	   * A video overlay uses the [`<video>`](https://developer.mozilla.org/docs/Web/HTML/Element/video)
	   * HTML5 element.
	   *
	   * @example
	   *
	   * ```js
	   * var videoUrl = 'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
	   * 	videoBounds = [[ 32, -130], [ 13, -100]];
	   * L.videoOverlay(videoUrl, videoBounds ).addTo(map);
	   * ```
	   */

	  var VideoOverlay = ImageOverlay.extend({

	  	// @section
	  	// @aka VideoOverlay options
	  	options: {
	  		// @option autoplay: Boolean = true
	  		// Whether the video starts playing automatically when loaded.
	  		autoplay: true,

	  		// @option loop: Boolean = true
	  		// Whether the video will loop back to the beginning when played.
	  		loop: true,

	  		// @option keepAspectRatio: Boolean = true
	  		// Whether the video will save aspect ratio after the projection.
	  		// Relevant for supported browsers. Browser compatibility- https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
	  		keepAspectRatio: true,

	  		// @option muted: Boolean = false
	  		// Whether the video starts on mute when loaded.
	  		muted: false
	  	},

	  	_initImage: function () {
	  		var wasElementSupplied = this._url.tagName === 'VIDEO';
	  		var vid = this._image = wasElementSupplied ? this._url : create$1('video');

	  		addClass(vid, 'leaflet-image-layer');
	  		if (this._zoomAnimated) { addClass(vid, 'leaflet-zoom-animated'); }
	  		if (this.options.className) { addClass(vid, this.options.className); }

	  		vid.onselectstart = falseFn;
	  		vid.onmousemove = falseFn;

	  		// @event load: Event
	  		// Fired when the video has finished loading the first frame
	  		vid.onloadeddata = bind(this.fire, this, 'load');

	  		if (wasElementSupplied) {
	  			var sourceElements = vid.getElementsByTagName('source');
	  			var sources = [];
	  			for (var j = 0; j < sourceElements.length; j++) {
	  				sources.push(sourceElements[j].src);
	  			}

	  			this._url = (sourceElements.length > 0) ? sources : [vid.src];
	  			return;
	  		}

	  		if (!isArray(this._url)) { this._url = [this._url]; }

	  		if (!this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(vid.style, 'objectFit')) {
	  			vid.style['objectFit'] = 'fill';
	  		}
	  		vid.autoplay = !!this.options.autoplay;
	  		vid.loop = !!this.options.loop;
	  		vid.muted = !!this.options.muted;
	  		for (var i = 0; i < this._url.length; i++) {
	  			var source = create$1('source');
	  			source.src = this._url[i];
	  			vid.appendChild(source);
	  		}
	  	}

	  	// @method getElement(): HTMLVideoElement
	  	// Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
	  	// used by this overlay.
	  });


	  // @factory L.videoOverlay(video: String|Array|HTMLVideoElement, bounds: LatLngBounds, options?: VideoOverlay options)
	  // Instantiates an image overlay object given the URL of the video (or array of URLs, or even a video element) and the
	  // geographical bounds it is tied to.

	  function videoOverlay(video, bounds, options) {
	  	return new VideoOverlay(video, bounds, options);
	  }

	  /*
	   * @class SVGOverlay
	   * @aka L.SVGOverlay
	   * @inherits ImageOverlay
	   *
	   * Used to load, display and provide DOM access to an SVG file over specific bounds of the map. Extends `ImageOverlay`.
	   *
	   * An SVG overlay uses the [`<svg>`](https://developer.mozilla.org/docs/Web/SVG/Element/svg) element.
	   *
	   * @example
	   *
	   * ```js
	   * var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	   * svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
	   * svgElement.setAttribute('viewBox', "0 0 200 200");
	   * svgElement.innerHTML = '<rect width="200" height="200"/><rect x="75" y="23" width="50" height="50" style="fill:red"/><rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>';
	   * var svgElementBounds = [ [ 32, -130 ], [ 13, -100 ] ];
	   * L.svgOverlay(svgElement, svgElementBounds).addTo(map);
	   * ```
	   */

	  var SVGOverlay = ImageOverlay.extend({
	  	_initImage: function () {
	  		var el = this._image = this._url;

	  		addClass(el, 'leaflet-image-layer');
	  		if (this._zoomAnimated) { addClass(el, 'leaflet-zoom-animated'); }
	  		if (this.options.className) { addClass(el, this.options.className); }

	  		el.onselectstart = falseFn;
	  		el.onmousemove = falseFn;
	  	}

	  	// @method getElement(): SVGElement
	  	// Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
	  	// used by this overlay.
	  });


	  // @factory L.svgOverlay(svg: String|SVGElement, bounds: LatLngBounds, options?: SVGOverlay options)
	  // Instantiates an image overlay object given an SVG element and the geographical bounds it is tied to.
	  // A viewBox attribute is required on the SVG element to zoom in and out properly.

	  function svgOverlay(el, bounds, options) {
	  	return new SVGOverlay(el, bounds, options);
	  }

	  /*
	   * @class DivOverlay
	   * @inherits Layer
	   * @aka L.DivOverlay
	   * Base model for L.Popup and L.Tooltip. Inherit from it for custom popup like plugins.
	   */

	  // @namespace DivOverlay
	  var DivOverlay = Layer.extend({

	  	// @section
	  	// @aka DivOverlay options
	  	options: {
	  		// @option offset: Point = Point(0, 7)
	  		// The offset of the popup position. Useful to control the anchor
	  		// of the popup when opening it on some overlays.
	  		offset: [0, 7],

	  		// @option className: String = ''
	  		// A custom CSS class name to assign to the popup.
	  		className: '',

	  		// @option pane: String = 'popupPane'
	  		// `Map pane` where the popup will be added.
	  		pane: 'popupPane'
	  	},

	  	initialize: function (options, source) {
	  		setOptions(this, options);

	  		this._source = source;
	  	},

	  	onAdd: function (map) {
	  		this._zoomAnimated = map._zoomAnimated;

	  		if (!this._container) {
	  			this._initLayout();
	  		}

	  		if (map._fadeAnimated) {
	  			setOpacity(this._container, 0);
	  		}

	  		clearTimeout(this._removeTimeout);
	  		this.getPane().appendChild(this._container);
	  		this.update();

	  		if (map._fadeAnimated) {
	  			setOpacity(this._container, 1);
	  		}

	  		this.bringToFront();
	  	},

	  	onRemove: function (map) {
	  		if (map._fadeAnimated) {
	  			setOpacity(this._container, 0);
	  			this._removeTimeout = setTimeout(bind(remove, undefined, this._container), 200);
	  		} else {
	  			remove(this._container);
	  		}
	  	},

	  	// @namespace Popup
	  	// @method getLatLng: LatLng
	  	// Returns the geographical point of popup.
	  	getLatLng: function () {
	  		return this._latlng;
	  	},

	  	// @method setLatLng(latlng: LatLng): this
	  	// Sets the geographical point where the popup will open.
	  	setLatLng: function (latlng) {
	  		this._latlng = toLatLng(latlng);
	  		if (this._map) {
	  			this._updatePosition();
	  			this._adjustPan();
	  		}
	  		return this;
	  	},

	  	// @method getContent: String|HTMLElement
	  	// Returns the content of the popup.
	  	getContent: function () {
	  		return this._content;
	  	},

	  	// @method setContent(htmlContent: String|HTMLElement|Function): this
	  	// Sets the HTML content of the popup. If a function is passed the source layer will be passed to the function. The function should return a `String` or `HTMLElement` to be used in the popup.
	  	setContent: function (content) {
	  		this._content = content;
	  		this.update();
	  		return this;
	  	},

	  	// @method getElement: String|HTMLElement
	  	// Returns the HTML container of the popup.
	  	getElement: function () {
	  		return this._container;
	  	},

	  	// @method update: null
	  	// Updates the popup content, layout and position. Useful for updating the popup after something inside changed, e.g. image loaded.
	  	update: function () {
	  		if (!this._map) { return; }

	  		this._container.style.visibility = 'hidden';

	  		this._updateContent();
	  		this._updateLayout();
	  		this._updatePosition();

	  		this._container.style.visibility = '';

	  		this._adjustPan();
	  	},

	  	getEvents: function () {
	  		var events = {
	  			zoom: this._updatePosition,
	  			viewreset: this._updatePosition
	  		};

	  		if (this._zoomAnimated) {
	  			events.zoomanim = this._animateZoom;
	  		}
	  		return events;
	  	},

	  	// @method isOpen: Boolean
	  	// Returns `true` when the popup is visible on the map.
	  	isOpen: function () {
	  		return !!this._map && this._map.hasLayer(this);
	  	},

	  	// @method bringToFront: this
	  	// Brings this popup in front of other popups (in the same map pane).
	  	bringToFront: function () {
	  		if (this._map) {
	  			toFront(this._container);
	  		}
	  		return this;
	  	},

	  	// @method bringToBack: this
	  	// Brings this popup to the back of other popups (in the same map pane).
	  	bringToBack: function () {
	  		if (this._map) {
	  			toBack(this._container);
	  		}
	  		return this;
	  	},

	  	_prepareOpen: function (parent, layer, latlng) {
	  		if (!(layer instanceof Layer)) {
	  			latlng = layer;
	  			layer = parent;
	  		}

	  		if (layer instanceof FeatureGroup) {
	  			for (var id in parent._layers) {
	  				layer = parent._layers[id];
	  				break;
	  			}
	  		}

	  		if (!latlng) {
	  			if (layer.getCenter) {
	  				latlng = layer.getCenter();
	  			} else if (layer.getLatLng) {
	  				latlng = layer.getLatLng();
	  			} else {
	  				throw new Error('Unable to get source layer LatLng.');
	  			}
	  		}

	  		// set overlay source to this layer
	  		this._source = layer;

	  		// update the overlay (content, layout, ect...)
	  		this.update();

	  		return latlng;
	  	},

	  	_updateContent: function () {
	  		if (!this._content) { return; }

	  		var node = this._contentNode;
	  		var content = (typeof this._content === 'function') ? this._content(this._source || this) : this._content;

	  		if (typeof content === 'string') {
	  			node.innerHTML = content;
	  		} else {
	  			while (node.hasChildNodes()) {
	  				node.removeChild(node.firstChild);
	  			}
	  			node.appendChild(content);
	  		}
	  		this.fire('contentupdate');
	  	},

	  	_updatePosition: function () {
	  		if (!this._map) { return; }

	  		var pos = this._map.latLngToLayerPoint(this._latlng),
	  		    offset = toPoint(this.options.offset),
	  		    anchor = this._getAnchor();

	  		if (this._zoomAnimated) {
	  			setPosition(this._container, pos.add(anchor));
	  		} else {
	  			offset = offset.add(pos).add(anchor);
	  		}

	  		var bottom = this._containerBottom = -offset.y,
	  		    left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;

	  		// bottom position the popup in case the height of the popup changes (images loading etc)
	  		this._container.style.bottom = bottom + 'px';
	  		this._container.style.left = left + 'px';
	  	},

	  	_getAnchor: function () {
	  		return [0, 0];
	  	}

	  });

	  /*
	   * @class Popup
	   * @inherits DivOverlay
	   * @aka L.Popup
	   * Used to open popups in certain places of the map. Use [Map.openPopup](#map-openpopup) to
	   * open popups while making sure that only one popup is open at one time
	   * (recommended for usability), or use [Map.addLayer](#map-addlayer) to open as many as you want.
	   *
	   * @example
	   *
	   * If you want to just bind a popup to marker click and then open it, it's really easy:
	   *
	   * ```js
	   * marker.bindPopup(popupContent).openPopup();
	   * ```
	   * Path overlays like polylines also have a `bindPopup` method.
	   * Here's a more complicated way to open a popup on a map:
	   *
	   * ```js
	   * var popup = L.popup()
	   * 	.setLatLng(latlng)
	   * 	.setContent('<p>Hello world!<br />This is a nice popup.</p>')
	   * 	.openOn(map);
	   * ```
	   */


	  // @namespace Popup
	  var Popup = DivOverlay.extend({

	  	// @section
	  	// @aka Popup options
	  	options: {
	  		// @option maxWidth: Number = 300
	  		// Max width of the popup, in pixels.
	  		maxWidth: 300,

	  		// @option minWidth: Number = 50
	  		// Min width of the popup, in pixels.
	  		minWidth: 50,

	  		// @option maxHeight: Number = null
	  		// If set, creates a scrollable container of the given height
	  		// inside a popup if its content exceeds it.
	  		maxHeight: null,

	  		// @option autoPan: Boolean = true
	  		// Set it to `false` if you don't want the map to do panning animation
	  		// to fit the opened popup.
	  		autoPan: true,

	  		// @option autoPanPaddingTopLeft: Point = null
	  		// The margin between the popup and the top left corner of the map
	  		// view after autopanning was performed.
	  		autoPanPaddingTopLeft: null,

	  		// @option autoPanPaddingBottomRight: Point = null
	  		// The margin between the popup and the bottom right corner of the map
	  		// view after autopanning was performed.
	  		autoPanPaddingBottomRight: null,

	  		// @option autoPanPadding: Point = Point(5, 5)
	  		// Equivalent of setting both top left and bottom right autopan padding to the same value.
	  		autoPanPadding: [5, 5],

	  		// @option keepInView: Boolean = false
	  		// Set it to `true` if you want to prevent users from panning the popup
	  		// off of the screen while it is open.
	  		keepInView: false,

	  		// @option closeButton: Boolean = true
	  		// Controls the presence of a close button in the popup.
	  		closeButton: true,

	  		// @option autoClose: Boolean = true
	  		// Set it to `false` if you want to override the default behavior of
	  		// the popup closing when another popup is opened.
	  		autoClose: true,

	  		// @option closeOnEscapeKey: Boolean = true
	  		// Set it to `false` if you want to override the default behavior of
	  		// the ESC key for closing of the popup.
	  		closeOnEscapeKey: true,

	  		// @option closeOnClick: Boolean = *
	  		// Set it if you want to override the default behavior of the popup closing when user clicks
	  		// on the map. Defaults to the map's [`closePopupOnClick`](#map-closepopuponclick) option.

	  		// @option className: String = ''
	  		// A custom CSS class name to assign to the popup.
	  		className: ''
	  	},

	  	// @namespace Popup
	  	// @method openOn(map: Map): this
	  	// Adds the popup to the map and closes the previous one. The same as `map.openPopup(popup)`.
	  	openOn: function (map) {
	  		map.openPopup(this);
	  		return this;
	  	},

	  	onAdd: function (map) {
	  		DivOverlay.prototype.onAdd.call(this, map);

	  		// @namespace Map
	  		// @section Popup events
	  		// @event popupopen: PopupEvent
	  		// Fired when a popup is opened in the map
	  		map.fire('popupopen', {popup: this});

	  		if (this._source) {
	  			// @namespace Layer
	  			// @section Popup events
	  			// @event popupopen: PopupEvent
	  			// Fired when a popup bound to this layer is opened
	  			this._source.fire('popupopen', {popup: this}, true);
	  			// For non-path layers, we toggle the popup when clicking
	  			// again the layer, so prevent the map to reopen it.
	  			if (!(this._source instanceof Path)) {
	  				this._source.on('preclick', stopPropagation);
	  			}
	  		}
	  	},

	  	onRemove: function (map) {
	  		DivOverlay.prototype.onRemove.call(this, map);

	  		// @namespace Map
	  		// @section Popup events
	  		// @event popupclose: PopupEvent
	  		// Fired when a popup in the map is closed
	  		map.fire('popupclose', {popup: this});

	  		if (this._source) {
	  			// @namespace Layer
	  			// @section Popup events
	  			// @event popupclose: PopupEvent
	  			// Fired when a popup bound to this layer is closed
	  			this._source.fire('popupclose', {popup: this}, true);
	  			if (!(this._source instanceof Path)) {
	  				this._source.off('preclick', stopPropagation);
	  			}
	  		}
	  	},

	  	getEvents: function () {
	  		var events = DivOverlay.prototype.getEvents.call(this);

	  		if (this.options.closeOnClick !== undefined ? this.options.closeOnClick : this._map.options.closePopupOnClick) {
	  			events.preclick = this._close;
	  		}

	  		if (this.options.keepInView) {
	  			events.moveend = this._adjustPan;
	  		}

	  		return events;
	  	},

	  	_close: function () {
	  		if (this._map) {
	  			this._map.closePopup(this);
	  		}
	  	},

	  	_initLayout: function () {
	  		var prefix = 'leaflet-popup',
	  		    container = this._container = create$1('div',
	  			prefix + ' ' + (this.options.className || '') +
	  			' leaflet-zoom-animated');

	  		var wrapper = this._wrapper = create$1('div', prefix + '-content-wrapper', container);
	  		this._contentNode = create$1('div', prefix + '-content', wrapper);

	  		disableClickPropagation(container);
	  		disableScrollPropagation(this._contentNode);
	  		on(container, 'contextmenu', stopPropagation);

	  		this._tipContainer = create$1('div', prefix + '-tip-container', container);
	  		this._tip = create$1('div', prefix + '-tip', this._tipContainer);

	  		if (this.options.closeButton) {
	  			var closeButton = this._closeButton = create$1('a', prefix + '-close-button', container);
	  			closeButton.href = '#close';
	  			closeButton.innerHTML = '&#215;';

	  			on(closeButton, 'click', this._onCloseButtonClick, this);
	  		}
	  	},

	  	_updateLayout: function () {
	  		var container = this._contentNode,
	  		    style = container.style;

	  		style.width = '';
	  		style.whiteSpace = 'nowrap';

	  		var width = container.offsetWidth;
	  		width = Math.min(width, this.options.maxWidth);
	  		width = Math.max(width, this.options.minWidth);

	  		style.width = (width + 1) + 'px';
	  		style.whiteSpace = '';

	  		style.height = '';

	  		var height = container.offsetHeight,
	  		    maxHeight = this.options.maxHeight,
	  		    scrolledClass = 'leaflet-popup-scrolled';

	  		if (maxHeight && height > maxHeight) {
	  			style.height = maxHeight + 'px';
	  			addClass(container, scrolledClass);
	  		} else {
	  			removeClass(container, scrolledClass);
	  		}

	  		this._containerWidth = this._container.offsetWidth;
	  	},

	  	_animateZoom: function (e) {
	  		var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center),
	  		    anchor = this._getAnchor();
	  		setPosition(this._container, pos.add(anchor));
	  	},

	  	_adjustPan: function () {
	  		if (!this.options.autoPan) { return; }
	  		if (this._map._panAnim) { this._map._panAnim.stop(); }

	  		var map = this._map,
	  		    marginBottom = parseInt(getStyle(this._container, 'marginBottom'), 10) || 0,
	  		    containerHeight = this._container.offsetHeight + marginBottom,
	  		    containerWidth = this._containerWidth,
	  		    layerPos = new Point(this._containerLeft, -containerHeight - this._containerBottom);

	  		layerPos._add(getPosition(this._container));

	  		var containerPos = map.layerPointToContainerPoint(layerPos),
	  		    padding = toPoint(this.options.autoPanPadding),
	  		    paddingTL = toPoint(this.options.autoPanPaddingTopLeft || padding),
	  		    paddingBR = toPoint(this.options.autoPanPaddingBottomRight || padding),
	  		    size = map.getSize(),
	  		    dx = 0,
	  		    dy = 0;

	  		if (containerPos.x + containerWidth + paddingBR.x > size.x) { // right
	  			dx = containerPos.x + containerWidth - size.x + paddingBR.x;
	  		}
	  		if (containerPos.x - dx - paddingTL.x < 0) { // left
	  			dx = containerPos.x - paddingTL.x;
	  		}
	  		if (containerPos.y + containerHeight + paddingBR.y > size.y) { // bottom
	  			dy = containerPos.y + containerHeight - size.y + paddingBR.y;
	  		}
	  		if (containerPos.y - dy - paddingTL.y < 0) { // top
	  			dy = containerPos.y - paddingTL.y;
	  		}

	  		// @namespace Map
	  		// @section Popup events
	  		// @event autopanstart: Event
	  		// Fired when the map starts autopanning when opening a popup.
	  		if (dx || dy) {
	  			map
	  			    .fire('autopanstart')
	  			    .panBy([dx, dy]);
	  		}
	  	},

	  	_onCloseButtonClick: function (e) {
	  		this._close();
	  		stop(e);
	  	},

	  	_getAnchor: function () {
	  		// Where should we anchor the popup on the source layer?
	  		return toPoint(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
	  	}

	  });

	  // @namespace Popup
	  // @factory L.popup(options?: Popup options, source?: Layer)
	  // Instantiates a `Popup` object given an optional `options` object that describes its appearance and location and an optional `source` object that is used to tag the popup with a reference to the Layer to which it refers.
	  var popup = function (options, source) {
	  	return new Popup(options, source);
	  };


	  /* @namespace Map
	   * @section Interaction Options
	   * @option closePopupOnClick: Boolean = true
	   * Set it to `false` if you don't want popups to close when user clicks the map.
	   */
	  Map.mergeOptions({
	  	closePopupOnClick: true
	  });


	  // @namespace Map
	  // @section Methods for Layers and Controls
	  Map.include({
	  	// @method openPopup(popup: Popup): this
	  	// Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
	  	// @alternative
	  	// @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
	  	// Creates a popup with the specified content and options and opens it in the given point on a map.
	  	openPopup: function (popup, latlng, options) {
	  		if (!(popup instanceof Popup)) {
	  			popup = new Popup(options).setContent(popup);
	  		}

	  		if (latlng) {
	  			popup.setLatLng(latlng);
	  		}

	  		if (this.hasLayer(popup)) {
	  			return this;
	  		}

	  		if (this._popup && this._popup.options.autoClose) {
	  			this.closePopup();
	  		}

	  		this._popup = popup;
	  		return this.addLayer(popup);
	  	},

	  	// @method closePopup(popup?: Popup): this
	  	// Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
	  	closePopup: function (popup) {
	  		if (!popup || popup === this._popup) {
	  			popup = this._popup;
	  			this._popup = null;
	  		}
	  		if (popup) {
	  			this.removeLayer(popup);
	  		}
	  		return this;
	  	}
	  });

	  /*
	   * @namespace Layer
	   * @section Popup methods example
	   *
	   * All layers share a set of methods convenient for binding popups to it.
	   *
	   * ```js
	   * var layer = L.Polygon(latlngs).bindPopup('Hi There!').addTo(map);
	   * layer.openPopup();
	   * layer.closePopup();
	   * ```
	   *
	   * Popups will also be automatically opened when the layer is clicked on and closed when the layer is removed from the map or another popup is opened.
	   */

	  // @section Popup methods
	  Layer.include({

	  	// @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
	  	// Binds a popup to the layer with the passed `content` and sets up the
	  	// necessary event listeners. If a `Function` is passed it will receive
	  	// the layer as the first argument and should return a `String` or `HTMLElement`.
	  	bindPopup: function (content, options) {

	  		if (content instanceof Popup) {
	  			setOptions(content, options);
	  			this._popup = content;
	  			content._source = this;
	  		} else {
	  			if (!this._popup || options) {
	  				this._popup = new Popup(options, this);
	  			}
	  			this._popup.setContent(content);
	  		}

	  		if (!this._popupHandlersAdded) {
	  			this.on({
	  				click: this._openPopup,
	  				keypress: this._onKeyPress,
	  				remove: this.closePopup,
	  				move: this._movePopup
	  			});
	  			this._popupHandlersAdded = true;
	  		}

	  		return this;
	  	},

	  	// @method unbindPopup(): this
	  	// Removes the popup previously bound with `bindPopup`.
	  	unbindPopup: function () {
	  		if (this._popup) {
	  			this.off({
	  				click: this._openPopup,
	  				keypress: this._onKeyPress,
	  				remove: this.closePopup,
	  				move: this._movePopup
	  			});
	  			this._popupHandlersAdded = false;
	  			this._popup = null;
	  		}
	  		return this;
	  	},

	  	// @method openPopup(latlng?: LatLng): this
	  	// Opens the bound popup at the specified `latlng` or at the default popup anchor if no `latlng` is passed.
	  	openPopup: function (layer, latlng) {
	  		if (this._popup && this._map) {
	  			latlng = this._popup._prepareOpen(this, layer, latlng);

	  			// open the popup on the map
	  			this._map.openPopup(this._popup, latlng);
	  		}

	  		return this;
	  	},

	  	// @method closePopup(): this
	  	// Closes the popup bound to this layer if it is open.
	  	closePopup: function () {
	  		if (this._popup) {
	  			this._popup._close();
	  		}
	  		return this;
	  	},

	  	// @method togglePopup(): this
	  	// Opens or closes the popup bound to this layer depending on its current state.
	  	togglePopup: function (target) {
	  		if (this._popup) {
	  			if (this._popup._map) {
	  				this.closePopup();
	  			} else {
	  				this.openPopup(target);
	  			}
	  		}
	  		return this;
	  	},

	  	// @method isPopupOpen(): boolean
	  	// Returns `true` if the popup bound to this layer is currently open.
	  	isPopupOpen: function () {
	  		return (this._popup ? this._popup.isOpen() : false);
	  	},

	  	// @method setPopupContent(content: String|HTMLElement|Popup): this
	  	// Sets the content of the popup bound to this layer.
	  	setPopupContent: function (content) {
	  		if (this._popup) {
	  			this._popup.setContent(content);
	  		}
	  		return this;
	  	},

	  	// @method getPopup(): Popup
	  	// Returns the popup bound to this layer.
	  	getPopup: function () {
	  		return this._popup;
	  	},

	  	_openPopup: function (e) {
	  		var layer = e.layer || e.target;

	  		if (!this._popup) {
	  			return;
	  		}

	  		if (!this._map) {
	  			return;
	  		}

	  		// prevent map click
	  		stop(e);

	  		// if this inherits from Path its a vector and we can just
	  		// open the popup at the new location
	  		if (layer instanceof Path) {
	  			this.openPopup(e.layer || e.target, e.latlng);
	  			return;
	  		}

	  		// otherwise treat it like a marker and figure out
	  		// if we should toggle it open/closed
	  		if (this._map.hasLayer(this._popup) && this._popup._source === layer) {
	  			this.closePopup();
	  		} else {
	  			this.openPopup(layer, e.latlng);
	  		}
	  	},

	  	_movePopup: function (e) {
	  		this._popup.setLatLng(e.latlng);
	  	},

	  	_onKeyPress: function (e) {
	  		if (e.originalEvent.keyCode === 13) {
	  			this._openPopup(e);
	  		}
	  	}
	  });

	  /*
	   * @class Tooltip
	   * @inherits DivOverlay
	   * @aka L.Tooltip
	   * Used to display small texts on top of map layers.
	   *
	   * @example
	   *
	   * ```js
	   * marker.bindTooltip("my tooltip text").openTooltip();
	   * ```
	   * Note about tooltip offset. Leaflet takes two options in consideration
	   * for computing tooltip offsetting:
	   * - the `offset` Tooltip option: it defaults to [0, 0], and it's specific to one tooltip.
	   *   Add a positive x offset to move the tooltip to the right, and a positive y offset to
	   *   move it to the bottom. Negatives will move to the left and top.
	   * - the `tooltipAnchor` Icon option: this will only be considered for Marker. You
	   *   should adapt this value if you use a custom icon.
	   */


	  // @namespace Tooltip
	  var Tooltip = DivOverlay.extend({

	  	// @section
	  	// @aka Tooltip options
	  	options: {
	  		// @option pane: String = 'tooltipPane'
	  		// `Map pane` where the tooltip will be added.
	  		pane: 'tooltipPane',

	  		// @option offset: Point = Point(0, 0)
	  		// Optional offset of the tooltip position.
	  		offset: [0, 0],

	  		// @option direction: String = 'auto'
	  		// Direction where to open the tooltip. Possible values are: `right`, `left`,
	  		// `top`, `bottom`, `center`, `auto`.
	  		// `auto` will dynamically switch between `right` and `left` according to the tooltip
	  		// position on the map.
	  		direction: 'auto',

	  		// @option permanent: Boolean = false
	  		// Whether to open the tooltip permanently or only on mouseover.
	  		permanent: false,

	  		// @option sticky: Boolean = false
	  		// If true, the tooltip will follow the mouse instead of being fixed at the feature center.
	  		sticky: false,

	  		// @option interactive: Boolean = false
	  		// If true, the tooltip will listen to the feature events.
	  		interactive: false,

	  		// @option opacity: Number = 0.9
	  		// Tooltip container opacity.
	  		opacity: 0.9
	  	},

	  	onAdd: function (map) {
	  		DivOverlay.prototype.onAdd.call(this, map);
	  		this.setOpacity(this.options.opacity);

	  		// @namespace Map
	  		// @section Tooltip events
	  		// @event tooltipopen: TooltipEvent
	  		// Fired when a tooltip is opened in the map.
	  		map.fire('tooltipopen', {tooltip: this});

	  		if (this._source) {
	  			// @namespace Layer
	  			// @section Tooltip events
	  			// @event tooltipopen: TooltipEvent
	  			// Fired when a tooltip bound to this layer is opened.
	  			this._source.fire('tooltipopen', {tooltip: this}, true);
	  		}
	  	},

	  	onRemove: function (map) {
	  		DivOverlay.prototype.onRemove.call(this, map);

	  		// @namespace Map
	  		// @section Tooltip events
	  		// @event tooltipclose: TooltipEvent
	  		// Fired when a tooltip in the map is closed.
	  		map.fire('tooltipclose', {tooltip: this});

	  		if (this._source) {
	  			// @namespace Layer
	  			// @section Tooltip events
	  			// @event tooltipclose: TooltipEvent
	  			// Fired when a tooltip bound to this layer is closed.
	  			this._source.fire('tooltipclose', {tooltip: this}, true);
	  		}
	  	},

	  	getEvents: function () {
	  		var events = DivOverlay.prototype.getEvents.call(this);

	  		if (touch && !this.options.permanent) {
	  			events.preclick = this._close;
	  		}

	  		return events;
	  	},

	  	_close: function () {
	  		if (this._map) {
	  			this._map.closeTooltip(this);
	  		}
	  	},

	  	_initLayout: function () {
	  		var prefix = 'leaflet-tooltip',
	  		    className = prefix + ' ' + (this.options.className || '') + ' leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

	  		this._contentNode = this._container = create$1('div', className);
	  	},

	  	_updateLayout: function () {},

	  	_adjustPan: function () {},

	  	_setPosition: function (pos) {
	  		var subX, subY,
	  		    map = this._map,
	  		    container = this._container,
	  		    centerPoint = map.latLngToContainerPoint(map.getCenter()),
	  		    tooltipPoint = map.layerPointToContainerPoint(pos),
	  		    direction = this.options.direction,
	  		    tooltipWidth = container.offsetWidth,
	  		    tooltipHeight = container.offsetHeight,
	  		    offset = toPoint(this.options.offset),
	  		    anchor = this._getAnchor();

	  		if (direction === 'top') {
	  			subX = tooltipWidth / 2;
	  			subY = tooltipHeight;
	  		} else if (direction === 'bottom') {
	  			subX = tooltipWidth / 2;
	  			subY = 0;
	  		} else if (direction === 'center') {
	  			subX = tooltipWidth / 2;
	  			subY = tooltipHeight / 2;
	  		} else if (direction === 'right') {
	  			subX = 0;
	  			subY = tooltipHeight / 2;
	  		} else if (direction === 'left') {
	  			subX = tooltipWidth;
	  			subY = tooltipHeight / 2;
	  		} else if (tooltipPoint.x < centerPoint.x) {
	  			direction = 'right';
	  			subX = 0;
	  			subY = tooltipHeight / 2;
	  		} else {
	  			direction = 'left';
	  			subX = tooltipWidth + (offset.x + anchor.x) * 2;
	  			subY = tooltipHeight / 2;
	  		}

	  		pos = pos.subtract(toPoint(subX, subY, true)).add(offset).add(anchor);

	  		removeClass(container, 'leaflet-tooltip-right');
	  		removeClass(container, 'leaflet-tooltip-left');
	  		removeClass(container, 'leaflet-tooltip-top');
	  		removeClass(container, 'leaflet-tooltip-bottom');
	  		addClass(container, 'leaflet-tooltip-' + direction);
	  		setPosition(container, pos);
	  	},

	  	_updatePosition: function () {
	  		var pos = this._map.latLngToLayerPoint(this._latlng);
	  		this._setPosition(pos);
	  	},

	  	setOpacity: function (opacity) {
	  		this.options.opacity = opacity;

	  		if (this._container) {
	  			setOpacity(this._container, opacity);
	  		}
	  	},

	  	_animateZoom: function (e) {
	  		var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
	  		this._setPosition(pos);
	  	},

	  	_getAnchor: function () {
	  		// Where should we anchor the tooltip on the source layer?
	  		return toPoint(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
	  	}

	  });

	  // @namespace Tooltip
	  // @factory L.tooltip(options?: Tooltip options, source?: Layer)
	  // Instantiates a Tooltip object given an optional `options` object that describes its appearance and location and an optional `source` object that is used to tag the tooltip with a reference to the Layer to which it refers.
	  var tooltip = function (options, source) {
	  	return new Tooltip(options, source);
	  };

	  // @namespace Map
	  // @section Methods for Layers and Controls
	  Map.include({

	  	// @method openTooltip(tooltip: Tooltip): this
	  	// Opens the specified tooltip.
	  	// @alternative
	  	// @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
	  	// Creates a tooltip with the specified content and options and open it.
	  	openTooltip: function (tooltip, latlng, options) {
	  		if (!(tooltip instanceof Tooltip)) {
	  			tooltip = new Tooltip(options).setContent(tooltip);
	  		}

	  		if (latlng) {
	  			tooltip.setLatLng(latlng);
	  		}

	  		if (this.hasLayer(tooltip)) {
	  			return this;
	  		}

	  		return this.addLayer(tooltip);
	  	},

	  	// @method closeTooltip(tooltip?: Tooltip): this
	  	// Closes the tooltip given as parameter.
	  	closeTooltip: function (tooltip) {
	  		if (tooltip) {
	  			this.removeLayer(tooltip);
	  		}
	  		return this;
	  	}

	  });

	  /*
	   * @namespace Layer
	   * @section Tooltip methods example
	   *
	   * All layers share a set of methods convenient for binding tooltips to it.
	   *
	   * ```js
	   * var layer = L.Polygon(latlngs).bindTooltip('Hi There!').addTo(map);
	   * layer.openTooltip();
	   * layer.closeTooltip();
	   * ```
	   */

	  // @section Tooltip methods
	  Layer.include({

	  	// @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
	  	// Binds a tooltip to the layer with the passed `content` and sets up the
	  	// necessary event listeners. If a `Function` is passed it will receive
	  	// the layer as the first argument and should return a `String` or `HTMLElement`.
	  	bindTooltip: function (content, options) {

	  		if (content instanceof Tooltip) {
	  			setOptions(content, options);
	  			this._tooltip = content;
	  			content._source = this;
	  		} else {
	  			if (!this._tooltip || options) {
	  				this._tooltip = new Tooltip(options, this);
	  			}
	  			this._tooltip.setContent(content);

	  		}

	  		this._initTooltipInteractions();

	  		if (this._tooltip.options.permanent && this._map && this._map.hasLayer(this)) {
	  			this.openTooltip();
	  		}

	  		return this;
	  	},

	  	// @method unbindTooltip(): this
	  	// Removes the tooltip previously bound with `bindTooltip`.
	  	unbindTooltip: function () {
	  		if (this._tooltip) {
	  			this._initTooltipInteractions(true);
	  			this.closeTooltip();
	  			this._tooltip = null;
	  		}
	  		return this;
	  	},

	  	_initTooltipInteractions: function (remove$$1) {
	  		if (!remove$$1 && this._tooltipHandlersAdded) { return; }
	  		var onOff = remove$$1 ? 'off' : 'on',
	  		    events = {
	  			remove: this.closeTooltip,
	  			move: this._moveTooltip
	  		    };
	  		if (!this._tooltip.options.permanent) {
	  			events.mouseover = this._openTooltip;
	  			events.mouseout = this.closeTooltip;
	  			if (this._tooltip.options.sticky) {
	  				events.mousemove = this._moveTooltip;
	  			}
	  			if (touch) {
	  				events.click = this._openTooltip;
	  			}
	  		} else {
	  			events.add = this._openTooltip;
	  		}
	  		this[onOff](events);
	  		this._tooltipHandlersAdded = !remove$$1;
	  	},

	  	// @method openTooltip(latlng?: LatLng): this
	  	// Opens the bound tooltip at the specified `latlng` or at the default tooltip anchor if no `latlng` is passed.
	  	openTooltip: function (layer, latlng) {
	  		if (this._tooltip && this._map) {
	  			latlng = this._tooltip._prepareOpen(this, layer, latlng);

	  			// open the tooltip on the map
	  			this._map.openTooltip(this._tooltip, latlng);

	  			// Tooltip container may not be defined if not permanent and never
	  			// opened.
	  			if (this._tooltip.options.interactive && this._tooltip._container) {
	  				addClass(this._tooltip._container, 'leaflet-clickable');
	  				this.addInteractiveTarget(this._tooltip._container);
	  			}
	  		}

	  		return this;
	  	},

	  	// @method closeTooltip(): this
	  	// Closes the tooltip bound to this layer if it is open.
	  	closeTooltip: function () {
	  		if (this._tooltip) {
	  			this._tooltip._close();
	  			if (this._tooltip.options.interactive && this._tooltip._container) {
	  				removeClass(this._tooltip._container, 'leaflet-clickable');
	  				this.removeInteractiveTarget(this._tooltip._container);
	  			}
	  		}
	  		return this;
	  	},

	  	// @method toggleTooltip(): this
	  	// Opens or closes the tooltip bound to this layer depending on its current state.
	  	toggleTooltip: function (target) {
	  		if (this._tooltip) {
	  			if (this._tooltip._map) {
	  				this.closeTooltip();
	  			} else {
	  				this.openTooltip(target);
	  			}
	  		}
	  		return this;
	  	},

	  	// @method isTooltipOpen(): boolean
	  	// Returns `true` if the tooltip bound to this layer is currently open.
	  	isTooltipOpen: function () {
	  		return this._tooltip.isOpen();
	  	},

	  	// @method setTooltipContent(content: String|HTMLElement|Tooltip): this
	  	// Sets the content of the tooltip bound to this layer.
	  	setTooltipContent: function (content) {
	  		if (this._tooltip) {
	  			this._tooltip.setContent(content);
	  		}
	  		return this;
	  	},

	  	// @method getTooltip(): Tooltip
	  	// Returns the tooltip bound to this layer.
	  	getTooltip: function () {
	  		return this._tooltip;
	  	},

	  	_openTooltip: function (e) {
	  		var layer = e.layer || e.target;

	  		if (!this._tooltip || !this._map) {
	  			return;
	  		}
	  		this.openTooltip(layer, this._tooltip.options.sticky ? e.latlng : undefined);
	  	},

	  	_moveTooltip: function (e) {
	  		var latlng = e.latlng, containerPoint, layerPoint;
	  		if (this._tooltip.options.sticky && e.originalEvent) {
	  			containerPoint = this._map.mouseEventToContainerPoint(e.originalEvent);
	  			layerPoint = this._map.containerPointToLayerPoint(containerPoint);
	  			latlng = this._map.layerPointToLatLng(layerPoint);
	  		}
	  		this._tooltip.setLatLng(latlng);
	  	}
	  });

	  /*
	   * @class DivIcon
	   * @aka L.DivIcon
	   * @inherits Icon
	   *
	   * Represents a lightweight icon for markers that uses a simple `<div>`
	   * element instead of an image. Inherits from `Icon` but ignores the `iconUrl` and shadow options.
	   *
	   * @example
	   * ```js
	   * var myIcon = L.divIcon({className: 'my-div-icon'});
	   * // you can set .my-div-icon styles in CSS
	   *
	   * L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
	   * ```
	   *
	   * By default, it has a 'leaflet-div-icon' CSS class and is styled as a little white square with a shadow.
	   */

	  var DivIcon = Icon.extend({
	  	options: {
	  		// @section
	  		// @aka DivIcon options
	  		iconSize: [12, 12], // also can be set through CSS

	  		// iconAnchor: (Point),
	  		// popupAnchor: (Point),

	  		// @option html: String|HTMLElement = ''
	  		// Custom HTML code to put inside the div element, empty by default. Alternatively,
	  		// an instance of `HTMLElement`.
	  		html: false,

	  		// @option bgPos: Point = [0, 0]
	  		// Optional relative position of the background, in pixels
	  		bgPos: null,

	  		className: 'leaflet-div-icon'
	  	},

	  	createIcon: function (oldIcon) {
	  		var div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
	  		    options = this.options;

	  		if (options.html instanceof Element) {
	  			empty(div);
	  			div.appendChild(options.html);
	  		} else {
	  			div.innerHTML = options.html !== false ? options.html : '';
	  		}

	  		if (options.bgPos) {
	  			var bgPos = toPoint(options.bgPos);
	  			div.style.backgroundPosition = (-bgPos.x) + 'px ' + (-bgPos.y) + 'px';
	  		}
	  		this._setIconStyles(div, 'icon');

	  		return div;
	  	},

	  	createShadow: function () {
	  		return null;
	  	}
	  });

	  // @factory L.divIcon(options: DivIcon options)
	  // Creates a `DivIcon` instance with the given options.
	  function divIcon(options) {
	  	return new DivIcon(options);
	  }

	  Icon.Default = IconDefault;

	  /*
	   * @class GridLayer
	   * @inherits Layer
	   * @aka L.GridLayer
	   *
	   * Generic class for handling a tiled grid of HTML elements. This is the base class for all tile layers and replaces `TileLayer.Canvas`.
	   * GridLayer can be extended to create a tiled grid of HTML elements like `<canvas>`, `<img>` or `<div>`. GridLayer will handle creating and animating these DOM elements for you.
	   *
	   *
	   * @section Synchronous usage
	   * @example
	   *
	   * To create a custom layer, extend GridLayer and implement the `createTile()` method, which will be passed a `Point` object with the `x`, `y`, and `z` (zoom level) coordinates to draw your tile.
	   *
	   * ```js
	   * var CanvasLayer = L.GridLayer.extend({
	   *     createTile: function(coords){
	   *         // create a <canvas> element for drawing
	   *         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
	   *
	   *         // setup tile width and height according to the options
	   *         var size = this.getTileSize();
	   *         tile.width = size.x;
	   *         tile.height = size.y;
	   *
	   *         // get a canvas context and draw something on it using coords.x, coords.y and coords.z
	   *         var ctx = tile.getContext('2d');
	   *
	   *         // return the tile so it can be rendered on screen
	   *         return tile;
	   *     }
	   * });
	   * ```
	   *
	   * @section Asynchronous usage
	   * @example
	   *
	   * Tile creation can also be asynchronous, this is useful when using a third-party drawing library. Once the tile is finished drawing it can be passed to the `done()` callback.
	   *
	   * ```js
	   * var CanvasLayer = L.GridLayer.extend({
	   *     createTile: function(coords, done){
	   *         var error;
	   *
	   *         // create a <canvas> element for drawing
	   *         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
	   *
	   *         // setup tile width and height according to the options
	   *         var size = this.getTileSize();
	   *         tile.width = size.x;
	   *         tile.height = size.y;
	   *
	   *         // draw something asynchronously and pass the tile to the done() callback
	   *         setTimeout(function() {
	   *             done(error, tile);
	   *         }, 1000);
	   *
	   *         return tile;
	   *     }
	   * });
	   * ```
	   *
	   * @section
	   */


	  var GridLayer = Layer.extend({

	  	// @section
	  	// @aka GridLayer options
	  	options: {
	  		// @option tileSize: Number|Point = 256
	  		// Width and height of tiles in the grid. Use a number if width and height are equal, or `L.point(width, height)` otherwise.
	  		tileSize: 256,

	  		// @option opacity: Number = 1.0
	  		// Opacity of the tiles. Can be used in the `createTile()` function.
	  		opacity: 1,

	  		// @option updateWhenIdle: Boolean = (depends)
	  		// Load new tiles only when panning ends.
	  		// `true` by default on mobile browsers, in order to avoid too many requests and keep smooth navigation.
	  		// `false` otherwise in order to display new tiles _during_ panning, since it is easy to pan outside the
	  		// [`keepBuffer`](#gridlayer-keepbuffer) option in desktop browsers.
	  		updateWhenIdle: mobile,

	  		// @option updateWhenZooming: Boolean = true
	  		// By default, a smooth zoom animation (during a [touch zoom](#map-touchzoom) or a [`flyTo()`](#map-flyto)) will update grid layers every integer zoom level. Setting this option to `false` will update the grid layer only when the smooth animation ends.
	  		updateWhenZooming: true,

	  		// @option updateInterval: Number = 200
	  		// Tiles will not update more than once every `updateInterval` milliseconds when panning.
	  		updateInterval: 200,

	  		// @option zIndex: Number = 1
	  		// The explicit zIndex of the tile layer.
	  		zIndex: 1,

	  		// @option bounds: LatLngBounds = undefined
	  		// If set, tiles will only be loaded inside the set `LatLngBounds`.
	  		bounds: null,

	  		// @option minZoom: Number = 0
	  		// The minimum zoom level down to which this layer will be displayed (inclusive).
	  		minZoom: 0,

	  		// @option maxZoom: Number = undefined
	  		// The maximum zoom level up to which this layer will be displayed (inclusive).
	  		maxZoom: undefined,

	  		// @option maxNativeZoom: Number = undefined
	  		// Maximum zoom number the tile source has available. If it is specified,
	  		// the tiles on all zoom levels higher than `maxNativeZoom` will be loaded
	  		// from `maxNativeZoom` level and auto-scaled.
	  		maxNativeZoom: undefined,

	  		// @option minNativeZoom: Number = undefined
	  		// Minimum zoom number the tile source has available. If it is specified,
	  		// the tiles on all zoom levels lower than `minNativeZoom` will be loaded
	  		// from `minNativeZoom` level and auto-scaled.
	  		minNativeZoom: undefined,

	  		// @option noWrap: Boolean = false
	  		// Whether the layer is wrapped around the antimeridian. If `true`, the
	  		// GridLayer will only be displayed once at low zoom levels. Has no
	  		// effect when the [map CRS](#map-crs) doesn't wrap around. Can be used
	  		// in combination with [`bounds`](#gridlayer-bounds) to prevent requesting
	  		// tiles outside the CRS limits.
	  		noWrap: false,

	  		// @option pane: String = 'tilePane'
	  		// `Map pane` where the grid layer will be added.
	  		pane: 'tilePane',

	  		// @option className: String = ''
	  		// A custom class name to assign to the tile layer. Empty by default.
	  		className: '',

	  		// @option keepBuffer: Number = 2
	  		// When panning the map, keep this many rows and columns of tiles before unloading them.
	  		keepBuffer: 2
	  	},

	  	initialize: function (options) {
	  		setOptions(this, options);
	  	},

	  	onAdd: function () {
	  		this._initContainer();

	  		this._levels = {};
	  		this._tiles = {};

	  		this._resetView();
	  		this._update();
	  	},

	  	beforeAdd: function (map) {
	  		map._addZoomLimit(this);
	  	},

	  	onRemove: function (map) {
	  		this._removeAllTiles();
	  		remove(this._container);
	  		map._removeZoomLimit(this);
	  		this._container = null;
	  		this._tileZoom = undefined;
	  	},

	  	// @method bringToFront: this
	  	// Brings the tile layer to the top of all tile layers.
	  	bringToFront: function () {
	  		if (this._map) {
	  			toFront(this._container);
	  			this._setAutoZIndex(Math.max);
	  		}
	  		return this;
	  	},

	  	// @method bringToBack: this
	  	// Brings the tile layer to the bottom of all tile layers.
	  	bringToBack: function () {
	  		if (this._map) {
	  			toBack(this._container);
	  			this._setAutoZIndex(Math.min);
	  		}
	  		return this;
	  	},

	  	// @method getContainer: HTMLElement
	  	// Returns the HTML element that contains the tiles for this layer.
	  	getContainer: function () {
	  		return this._container;
	  	},

	  	// @method setOpacity(opacity: Number): this
	  	// Changes the [opacity](#gridlayer-opacity) of the grid layer.
	  	setOpacity: function (opacity) {
	  		this.options.opacity = opacity;
	  		this._updateOpacity();
	  		return this;
	  	},

	  	// @method setZIndex(zIndex: Number): this
	  	// Changes the [zIndex](#gridlayer-zindex) of the grid layer.
	  	setZIndex: function (zIndex) {
	  		this.options.zIndex = zIndex;
	  		this._updateZIndex();

	  		return this;
	  	},

	  	// @method isLoading: Boolean
	  	// Returns `true` if any tile in the grid layer has not finished loading.
	  	isLoading: function () {
	  		return this._loading;
	  	},

	  	// @method redraw: this
	  	// Causes the layer to clear all the tiles and request them again.
	  	redraw: function () {
	  		if (this._map) {
	  			this._removeAllTiles();
	  			this._update();
	  		}
	  		return this;
	  	},

	  	getEvents: function () {
	  		var events = {
	  			viewprereset: this._invalidateAll,
	  			viewreset: this._resetView,
	  			zoom: this._resetView,
	  			moveend: this._onMoveEnd
	  		};

	  		if (!this.options.updateWhenIdle) {
	  			// update tiles on move, but not more often than once per given interval
	  			if (!this._onMove) {
	  				this._onMove = throttle(this._onMoveEnd, this.options.updateInterval, this);
	  			}

	  			events.move = this._onMove;
	  		}

	  		if (this._zoomAnimated) {
	  			events.zoomanim = this._animateZoom;
	  		}

	  		return events;
	  	},

	  	// @section Extension methods
	  	// Layers extending `GridLayer` shall reimplement the following method.
	  	// @method createTile(coords: Object, done?: Function): HTMLElement
	  	// Called only internally, must be overridden by classes extending `GridLayer`.
	  	// Returns the `HTMLElement` corresponding to the given `coords`. If the `done` callback
	  	// is specified, it must be called when the tile has finished loading and drawing.
	  	createTile: function () {
	  		return document.createElement('div');
	  	},

	  	// @section
	  	// @method getTileSize: Point
	  	// Normalizes the [tileSize option](#gridlayer-tilesize) into a point. Used by the `createTile()` method.
	  	getTileSize: function () {
	  		var s = this.options.tileSize;
	  		return s instanceof Point ? s : new Point(s, s);
	  	},

	  	_updateZIndex: function () {
	  		if (this._container && this.options.zIndex !== undefined && this.options.zIndex !== null) {
	  			this._container.style.zIndex = this.options.zIndex;
	  		}
	  	},

	  	_setAutoZIndex: function (compare) {
	  		// go through all other layers of the same pane, set zIndex to max + 1 (front) or min - 1 (back)

	  		var layers = this.getPane().children,
	  		    edgeZIndex = -compare(-Infinity, Infinity); // -Infinity for max, Infinity for min

	  		for (var i = 0, len = layers.length, zIndex; i < len; i++) {

	  			zIndex = layers[i].style.zIndex;

	  			if (layers[i] !== this._container && zIndex) {
	  				edgeZIndex = compare(edgeZIndex, +zIndex);
	  			}
	  		}

	  		if (isFinite(edgeZIndex)) {
	  			this.options.zIndex = edgeZIndex + compare(-1, 1);
	  			this._updateZIndex();
	  		}
	  	},

	  	_updateOpacity: function () {
	  		if (!this._map) { return; }

	  		// IE doesn't inherit filter opacity properly, so we're forced to set it on tiles
	  		if (ielt9) { return; }

	  		setOpacity(this._container, this.options.opacity);

	  		var now = +new Date(),
	  		    nextFrame = false,
	  		    willPrune = false;

	  		for (var key in this._tiles) {
	  			var tile = this._tiles[key];
	  			if (!tile.current || !tile.loaded) { continue; }

	  			var fade = Math.min(1, (now - tile.loaded) / 200);

	  			setOpacity(tile.el, fade);
	  			if (fade < 1) {
	  				nextFrame = true;
	  			} else {
	  				if (tile.active) {
	  					willPrune = true;
	  				} else {
	  					this._onOpaqueTile(tile);
	  				}
	  				tile.active = true;
	  			}
	  		}

	  		if (willPrune && !this._noPrune) { this._pruneTiles(); }

	  		if (nextFrame) {
	  			cancelAnimFrame(this._fadeFrame);
	  			this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
	  		}
	  	},

	  	_onOpaqueTile: falseFn,

	  	_initContainer: function () {
	  		if (this._container) { return; }

	  		this._container = create$1('div', 'leaflet-layer ' + (this.options.className || ''));
	  		this._updateZIndex();

	  		if (this.options.opacity < 1) {
	  			this._updateOpacity();
	  		}

	  		this.getPane().appendChild(this._container);
	  	},

	  	_updateLevels: function () {

	  		var zoom = this._tileZoom,
	  		    maxZoom = this.options.maxZoom;

	  		if (zoom === undefined) { return undefined; }

	  		for (var z in this._levels) {
	  			z = Number(z);
	  			if (this._levels[z].el.children.length || z === zoom) {
	  				this._levels[z].el.style.zIndex = maxZoom - Math.abs(zoom - z);
	  				this._onUpdateLevel(z);
	  			} else {
	  				remove(this._levels[z].el);
	  				this._removeTilesAtZoom(z);
	  				this._onRemoveLevel(z);
	  				delete this._levels[z];
	  			}
	  		}

	  		var level = this._levels[zoom],
	  		    map = this._map;

	  		if (!level) {
	  			level = this._levels[zoom] = {};

	  			level.el = create$1('div', 'leaflet-tile-container leaflet-zoom-animated', this._container);
	  			level.el.style.zIndex = maxZoom;

	  			level.origin = map.project(map.unproject(map.getPixelOrigin()), zoom).round();
	  			level.zoom = zoom;

	  			this._setZoomTransform(level, map.getCenter(), map.getZoom());

	  			// force the browser to consider the newly added element for transition
	  			falseFn(level.el.offsetWidth);

	  			this._onCreateLevel(level);
	  		}

	  		this._level = level;

	  		return level;
	  	},

	  	_onUpdateLevel: falseFn,

	  	_onRemoveLevel: falseFn,

	  	_onCreateLevel: falseFn,

	  	_pruneTiles: function () {
	  		if (!this._map) {
	  			return;
	  		}

	  		var key, tile;

	  		var zoom = this._map.getZoom();
	  		if (zoom > this.options.maxZoom ||
	  			zoom < this.options.minZoom) {
	  			this._removeAllTiles();
	  			return;
	  		}

	  		for (key in this._tiles) {
	  			tile = this._tiles[key];
	  			tile.retain = tile.current;
	  		}

	  		for (key in this._tiles) {
	  			tile = this._tiles[key];
	  			if (tile.current && !tile.active) {
	  				var coords = tile.coords;
	  				if (!this._retainParent(coords.x, coords.y, coords.z, coords.z - 5)) {
	  					this._retainChildren(coords.x, coords.y, coords.z, coords.z + 2);
	  				}
	  			}
	  		}

	  		for (key in this._tiles) {
	  			if (!this._tiles[key].retain) {
	  				this._removeTile(key);
	  			}
	  		}
	  	},

	  	_removeTilesAtZoom: function (zoom) {
	  		for (var key in this._tiles) {
	  			if (this._tiles[key].coords.z !== zoom) {
	  				continue;
	  			}
	  			this._removeTile(key);
	  		}
	  	},

	  	_removeAllTiles: function () {
	  		for (var key in this._tiles) {
	  			this._removeTile(key);
	  		}
	  	},

	  	_invalidateAll: function () {
	  		for (var z in this._levels) {
	  			remove(this._levels[z].el);
	  			this._onRemoveLevel(Number(z));
	  			delete this._levels[z];
	  		}
	  		this._removeAllTiles();

	  		this._tileZoom = undefined;
	  	},

	  	_retainParent: function (x, y, z, minZoom) {
	  		var x2 = Math.floor(x / 2),
	  		    y2 = Math.floor(y / 2),
	  		    z2 = z - 1,
	  		    coords2 = new Point(+x2, +y2);
	  		coords2.z = +z2;

	  		var key = this._tileCoordsToKey(coords2),
	  		    tile = this._tiles[key];

	  		if (tile && tile.active) {
	  			tile.retain = true;
	  			return true;

	  		} else if (tile && tile.loaded) {
	  			tile.retain = true;
	  		}

	  		if (z2 > minZoom) {
	  			return this._retainParent(x2, y2, z2, minZoom);
	  		}

	  		return false;
	  	},

	  	_retainChildren: function (x, y, z, maxZoom) {

	  		for (var i = 2 * x; i < 2 * x + 2; i++) {
	  			for (var j = 2 * y; j < 2 * y + 2; j++) {

	  				var coords = new Point(i, j);
	  				coords.z = z + 1;

	  				var key = this._tileCoordsToKey(coords),
	  				    tile = this._tiles[key];

	  				if (tile && tile.active) {
	  					tile.retain = true;
	  					continue;

	  				} else if (tile && tile.loaded) {
	  					tile.retain = true;
	  				}

	  				if (z + 1 < maxZoom) {
	  					this._retainChildren(i, j, z + 1, maxZoom);
	  				}
	  			}
	  		}
	  	},

	  	_resetView: function (e) {
	  		var animating = e && (e.pinch || e.flyTo);
	  		this._setView(this._map.getCenter(), this._map.getZoom(), animating, animating);
	  	},

	  	_animateZoom: function (e) {
	  		this._setView(e.center, e.zoom, true, e.noUpdate);
	  	},

	  	_clampZoom: function (zoom) {
	  		var options = this.options;

	  		if (undefined !== options.minNativeZoom && zoom < options.minNativeZoom) {
	  			return options.minNativeZoom;
	  		}

	  		if (undefined !== options.maxNativeZoom && options.maxNativeZoom < zoom) {
	  			return options.maxNativeZoom;
	  		}

	  		return zoom;
	  	},

	  	_setView: function (center, zoom, noPrune, noUpdate) {
	  		var tileZoom = Math.round(zoom);
	  		if ((this.options.maxZoom !== undefined && tileZoom > this.options.maxZoom) ||
	  		    (this.options.minZoom !== undefined && tileZoom < this.options.minZoom)) {
	  			tileZoom = undefined;
	  		} else {
	  			tileZoom = this._clampZoom(tileZoom);
	  		}

	  		var tileZoomChanged = this.options.updateWhenZooming && (tileZoom !== this._tileZoom);

	  		if (!noUpdate || tileZoomChanged) {

	  			this._tileZoom = tileZoom;

	  			if (this._abortLoading) {
	  				this._abortLoading();
	  			}

	  			this._updateLevels();
	  			this._resetGrid();

	  			if (tileZoom !== undefined) {
	  				this._update(center);
	  			}

	  			if (!noPrune) {
	  				this._pruneTiles();
	  			}

	  			// Flag to prevent _updateOpacity from pruning tiles during
	  			// a zoom anim or a pinch gesture
	  			this._noPrune = !!noPrune;
	  		}

	  		this._setZoomTransforms(center, zoom);
	  	},

	  	_setZoomTransforms: function (center, zoom) {
	  		for (var i in this._levels) {
	  			this._setZoomTransform(this._levels[i], center, zoom);
	  		}
	  	},

	  	_setZoomTransform: function (level, center, zoom) {
	  		var scale = this._map.getZoomScale(zoom, level.zoom),
	  		    translate = level.origin.multiplyBy(scale)
	  		        .subtract(this._map._getNewPixelOrigin(center, zoom)).round();

	  		if (any3d) {
	  			setTransform(level.el, translate, scale);
	  		} else {
	  			setPosition(level.el, translate);
	  		}
	  	},

	  	_resetGrid: function () {
	  		var map = this._map,
	  		    crs = map.options.crs,
	  		    tileSize = this._tileSize = this.getTileSize(),
	  		    tileZoom = this._tileZoom;

	  		var bounds = this._map.getPixelWorldBounds(this._tileZoom);
	  		if (bounds) {
	  			this._globalTileRange = this._pxBoundsToTileRange(bounds);
	  		}

	  		this._wrapX = crs.wrapLng && !this.options.noWrap && [
	  			Math.floor(map.project([0, crs.wrapLng[0]], tileZoom).x / tileSize.x),
	  			Math.ceil(map.project([0, crs.wrapLng[1]], tileZoom).x / tileSize.y)
	  		];
	  		this._wrapY = crs.wrapLat && !this.options.noWrap && [
	  			Math.floor(map.project([crs.wrapLat[0], 0], tileZoom).y / tileSize.x),
	  			Math.ceil(map.project([crs.wrapLat[1], 0], tileZoom).y / tileSize.y)
	  		];
	  	},

	  	_onMoveEnd: function () {
	  		if (!this._map || this._map._animatingZoom) { return; }

	  		this._update();
	  	},

	  	_getTiledPixelBounds: function (center) {
	  		var map = this._map,
	  		    mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom(),
	  		    scale = map.getZoomScale(mapZoom, this._tileZoom),
	  		    pixelCenter = map.project(center, this._tileZoom).floor(),
	  		    halfSize = map.getSize().divideBy(scale * 2);

	  		return new Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
	  	},

	  	// Private method to load tiles in the grid's active zoom level according to map bounds
	  	_update: function (center) {
	  		var map = this._map;
	  		if (!map) { return; }
	  		var zoom = this._clampZoom(map.getZoom());

	  		if (center === undefined) { center = map.getCenter(); }
	  		if (this._tileZoom === undefined) { return; }	// if out of minzoom/maxzoom

	  		var pixelBounds = this._getTiledPixelBounds(center),
	  		    tileRange = this._pxBoundsToTileRange(pixelBounds),
	  		    tileCenter = tileRange.getCenter(),
	  		    queue = [],
	  		    margin = this.options.keepBuffer,
	  		    noPruneRange = new Bounds(tileRange.getBottomLeft().subtract([margin, -margin]),
	  		                              tileRange.getTopRight().add([margin, -margin]));

	  		// Sanity check: panic if the tile range contains Infinity somewhere.
	  		if (!(isFinite(tileRange.min.x) &&
	  		      isFinite(tileRange.min.y) &&
	  		      isFinite(tileRange.max.x) &&
	  		      isFinite(tileRange.max.y))) { throw new Error('Attempted to load an infinite number of tiles'); }

	  		for (var key in this._tiles) {
	  			var c = this._tiles[key].coords;
	  			if (c.z !== this._tileZoom || !noPruneRange.contains(new Point(c.x, c.y))) {
	  				this._tiles[key].current = false;
	  			}
	  		}

	  		// _update just loads more tiles. If the tile zoom level differs too much
	  		// from the map's, let _setView reset levels and prune old tiles.
	  		if (Math.abs(zoom - this._tileZoom) > 1) { this._setView(center, zoom); return; }

	  		// create a queue of coordinates to load tiles from
	  		for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
	  			for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
	  				var coords = new Point(i, j);
	  				coords.z = this._tileZoom;

	  				if (!this._isValidTile(coords)) { continue; }

	  				var tile = this._tiles[this._tileCoordsToKey(coords)];
	  				if (tile) {
	  					tile.current = true;
	  				} else {
	  					queue.push(coords);
	  				}
	  			}
	  		}

	  		// sort tile queue to load tiles in order of their distance to center
	  		queue.sort(function (a, b) {
	  			return a.distanceTo(tileCenter) - b.distanceTo(tileCenter);
	  		});

	  		if (queue.length !== 0) {
	  			// if it's the first batch of tiles to load
	  			if (!this._loading) {
	  				this._loading = true;
	  				// @event loading: Event
	  				// Fired when the grid layer starts loading tiles.
	  				this.fire('loading');
	  			}

	  			// create DOM fragment to append tiles in one batch
	  			var fragment = document.createDocumentFragment();

	  			for (i = 0; i < queue.length; i++) {
	  				this._addTile(queue[i], fragment);
	  			}

	  			this._level.el.appendChild(fragment);
	  		}
	  	},

	  	_isValidTile: function (coords) {
	  		var crs = this._map.options.crs;

	  		if (!crs.infinite) {
	  			// don't load tile if it's out of bounds and not wrapped
	  			var bounds = this._globalTileRange;
	  			if ((!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x)) ||
	  			    (!crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y))) { return false; }
	  		}

	  		if (!this.options.bounds) { return true; }

	  		// don't load tile if it doesn't intersect the bounds in options
	  		var tileBounds = this._tileCoordsToBounds(coords);
	  		return toLatLngBounds(this.options.bounds).overlaps(tileBounds);
	  	},

	  	_keyToBounds: function (key) {
	  		return this._tileCoordsToBounds(this._keyToTileCoords(key));
	  	},

	  	_tileCoordsToNwSe: function (coords) {
	  		var map = this._map,
	  		    tileSize = this.getTileSize(),
	  		    nwPoint = coords.scaleBy(tileSize),
	  		    sePoint = nwPoint.add(tileSize),
	  		    nw = map.unproject(nwPoint, coords.z),
	  		    se = map.unproject(sePoint, coords.z);
	  		return [nw, se];
	  	},

	  	// converts tile coordinates to its geographical bounds
	  	_tileCoordsToBounds: function (coords) {
	  		var bp = this._tileCoordsToNwSe(coords),
	  		    bounds = new LatLngBounds(bp[0], bp[1]);

	  		if (!this.options.noWrap) {
	  			bounds = this._map.wrapLatLngBounds(bounds);
	  		}
	  		return bounds;
	  	},
	  	// converts tile coordinates to key for the tile cache
	  	_tileCoordsToKey: function (coords) {
	  		return coords.x + ':' + coords.y + ':' + coords.z;
	  	},

	  	// converts tile cache key to coordinates
	  	_keyToTileCoords: function (key) {
	  		var k = key.split(':'),
	  		    coords = new Point(+k[0], +k[1]);
	  		coords.z = +k[2];
	  		return coords;
	  	},

	  	_removeTile: function (key) {
	  		var tile = this._tiles[key];
	  		if (!tile) { return; }

	  		remove(tile.el);

	  		delete this._tiles[key];

	  		// @event tileunload: TileEvent
	  		// Fired when a tile is removed (e.g. when a tile goes off the screen).
	  		this.fire('tileunload', {
	  			tile: tile.el,
	  			coords: this._keyToTileCoords(key)
	  		});
	  	},

	  	_initTile: function (tile) {
	  		addClass(tile, 'leaflet-tile');

	  		var tileSize = this.getTileSize();
	  		tile.style.width = tileSize.x + 'px';
	  		tile.style.height = tileSize.y + 'px';

	  		tile.onselectstart = falseFn;
	  		tile.onmousemove = falseFn;

	  		// update opacity on tiles in IE7-8 because of filter inheritance problems
	  		if (ielt9 && this.options.opacity < 1) {
	  			setOpacity(tile, this.options.opacity);
	  		}

	  		// without this hack, tiles disappear after zoom on Chrome for Android
	  		// https://github.com/Leaflet/Leaflet/issues/2078
	  		if (android && !android23) {
	  			tile.style.WebkitBackfaceVisibility = 'hidden';
	  		}
	  	},

	  	_addTile: function (coords, container) {
	  		var tilePos = this._getTilePos(coords),
	  		    key = this._tileCoordsToKey(coords);

	  		var tile = this.createTile(this._wrapCoords(coords), bind(this._tileReady, this, coords));

	  		this._initTile(tile);

	  		// if createTile is defined with a second argument ("done" callback),
	  		// we know that tile is async and will be ready later; otherwise
	  		if (this.createTile.length < 2) {
	  			// mark tile as ready, but delay one frame for opacity animation to happen
	  			requestAnimFrame(bind(this._tileReady, this, coords, null, tile));
	  		}

	  		setPosition(tile, tilePos);

	  		// save tile in cache
	  		this._tiles[key] = {
	  			el: tile,
	  			coords: coords,
	  			current: true
	  		};

	  		container.appendChild(tile);
	  		// @event tileloadstart: TileEvent
	  		// Fired when a tile is requested and starts loading.
	  		this.fire('tileloadstart', {
	  			tile: tile,
	  			coords: coords
	  		});
	  	},

	  	_tileReady: function (coords, err, tile) {
	  		if (err) {
	  			// @event tileerror: TileErrorEvent
	  			// Fired when there is an error loading a tile.
	  			this.fire('tileerror', {
	  				error: err,
	  				tile: tile,
	  				coords: coords
	  			});
	  		}

	  		var key = this._tileCoordsToKey(coords);

	  		tile = this._tiles[key];
	  		if (!tile) { return; }

	  		tile.loaded = +new Date();
	  		if (this._map._fadeAnimated) {
	  			setOpacity(tile.el, 0);
	  			cancelAnimFrame(this._fadeFrame);
	  			this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
	  		} else {
	  			tile.active = true;
	  			this._pruneTiles();
	  		}

	  		if (!err) {
	  			addClass(tile.el, 'leaflet-tile-loaded');

	  			// @event tileload: TileEvent
	  			// Fired when a tile loads.
	  			this.fire('tileload', {
	  				tile: tile.el,
	  				coords: coords
	  			});
	  		}

	  		if (this._noTilesToLoad()) {
	  			this._loading = false;
	  			// @event load: Event
	  			// Fired when the grid layer loaded all visible tiles.
	  			this.fire('load');

	  			if (ielt9 || !this._map._fadeAnimated) {
	  				requestAnimFrame(this._pruneTiles, this);
	  			} else {
	  				// Wait a bit more than 0.2 secs (the duration of the tile fade-in)
	  				// to trigger a pruning.
	  				setTimeout(bind(this._pruneTiles, this), 250);
	  			}
	  		}
	  	},

	  	_getTilePos: function (coords) {
	  		return coords.scaleBy(this.getTileSize()).subtract(this._level.origin);
	  	},

	  	_wrapCoords: function (coords) {
	  		var newCoords = new Point(
	  			this._wrapX ? wrapNum(coords.x, this._wrapX) : coords.x,
	  			this._wrapY ? wrapNum(coords.y, this._wrapY) : coords.y);
	  		newCoords.z = coords.z;
	  		return newCoords;
	  	},

	  	_pxBoundsToTileRange: function (bounds) {
	  		var tileSize = this.getTileSize();
	  		return new Bounds(
	  			bounds.min.unscaleBy(tileSize).floor(),
	  			bounds.max.unscaleBy(tileSize).ceil().subtract([1, 1]));
	  	},

	  	_noTilesToLoad: function () {
	  		for (var key in this._tiles) {
	  			if (!this._tiles[key].loaded) { return false; }
	  		}
	  		return true;
	  	}
	  });

	  // @factory L.gridLayer(options?: GridLayer options)
	  // Creates a new instance of GridLayer with the supplied options.
	  function gridLayer(options) {
	  	return new GridLayer(options);
	  }

	  /*
	   * @class TileLayer
	   * @inherits GridLayer
	   * @aka L.TileLayer
	   * Used to load and display tile layers on the map. Note that most tile servers require attribution, which you can set under `Layer`. Extends `GridLayer`.
	   *
	   * @example
	   *
	   * ```js
	   * L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}).addTo(map);
	   * ```
	   *
	   * @section URL template
	   * @example
	   *
	   * A string of the following form:
	   *
	   * ```
	   * 'http://{s}.somedomain.com/blabla/{z}/{x}/{y}{r}.png'
	   * ```
	   *
	   * `{s}` means one of the available subdomains (used sequentially to help with browser parallel requests per domain limitation; subdomain values are specified in options; `a`, `b` or `c` by default, can be omitted), `{z}` — zoom level, `{x}` and `{y}` — tile coordinates. `{r}` can be used to add "&commat;2x" to the URL to load retina tiles.
	   *
	   * You can use custom keys in the template, which will be [evaluated](#util-template) from TileLayer options, like this:
	   *
	   * ```
	   * L.tileLayer('http://{s}.somedomain.com/{foo}/{z}/{x}/{y}.png', {foo: 'bar'});
	   * ```
	   */


	  var TileLayer = GridLayer.extend({

	  	// @section
	  	// @aka TileLayer options
	  	options: {
	  		// @option minZoom: Number = 0
	  		// The minimum zoom level down to which this layer will be displayed (inclusive).
	  		minZoom: 0,

	  		// @option maxZoom: Number = 18
	  		// The maximum zoom level up to which this layer will be displayed (inclusive).
	  		maxZoom: 18,

	  		// @option subdomains: String|String[] = 'abc'
	  		// Subdomains of the tile service. Can be passed in the form of one string (where each letter is a subdomain name) or an array of strings.
	  		subdomains: 'abc',

	  		// @option errorTileUrl: String = ''
	  		// URL to the tile image to show in place of the tile that failed to load.
	  		errorTileUrl: '',

	  		// @option zoomOffset: Number = 0
	  		// The zoom number used in tile URLs will be offset with this value.
	  		zoomOffset: 0,

	  		// @option tms: Boolean = false
	  		// If `true`, inverses Y axis numbering for tiles (turn this on for [TMS](https://en.wikipedia.org/wiki/Tile_Map_Service) services).
	  		tms: false,

	  		// @option zoomReverse: Boolean = false
	  		// If set to true, the zoom number used in tile URLs will be reversed (`maxZoom - zoom` instead of `zoom`)
	  		zoomReverse: false,

	  		// @option detectRetina: Boolean = false
	  		// If `true` and user is on a retina display, it will request four tiles of half the specified size and a bigger zoom level in place of one to utilize the high resolution.
	  		detectRetina: false,

	  		// @option crossOrigin: Boolean|String = false
	  		// Whether the crossOrigin attribute will be added to the tiles.
	  		// If a String is provided, all tiles will have their crossOrigin attribute set to the String provided. This is needed if you want to access tile pixel data.
	  		// Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
	  		crossOrigin: false
	  	},

	  	initialize: function (url, options) {

	  		this._url = url;

	  		options = setOptions(this, options);

	  		// detecting retina displays, adjusting tileSize and zoom levels
	  		if (options.detectRetina && retina && options.maxZoom > 0) {

	  			options.tileSize = Math.floor(options.tileSize / 2);

	  			if (!options.zoomReverse) {
	  				options.zoomOffset++;
	  				options.maxZoom--;
	  			} else {
	  				options.zoomOffset--;
	  				options.minZoom++;
	  			}

	  			options.minZoom = Math.max(0, options.minZoom);
	  		}

	  		if (typeof options.subdomains === 'string') {
	  			options.subdomains = options.subdomains.split('');
	  		}

	  		// for https://github.com/Leaflet/Leaflet/issues/137
	  		if (!android) {
	  			this.on('tileunload', this._onTileRemove);
	  		}
	  	},

	  	// @method setUrl(url: String, noRedraw?: Boolean): this
	  	// Updates the layer's URL template and redraws it (unless `noRedraw` is set to `true`).
	  	// If the URL does not change, the layer will not be redrawn unless
	  	// the noRedraw parameter is set to false.
	  	setUrl: function (url, noRedraw) {
	  		if (this._url === url && noRedraw === undefined) {
	  			noRedraw = true;
	  		}

	  		this._url = url;

	  		if (!noRedraw) {
	  			this.redraw();
	  		}
	  		return this;
	  	},

	  	// @method createTile(coords: Object, done?: Function): HTMLElement
	  	// Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
	  	// to return an `<img>` HTML element with the appropriate image URL given `coords`. The `done`
	  	// callback is called when the tile has been loaded.
	  	createTile: function (coords, done) {
	  		var tile = document.createElement('img');

	  		on(tile, 'load', bind(this._tileOnLoad, this, done, tile));
	  		on(tile, 'error', bind(this._tileOnError, this, done, tile));

	  		if (this.options.crossOrigin || this.options.crossOrigin === '') {
	  			tile.crossOrigin = this.options.crossOrigin === true ? '' : this.options.crossOrigin;
	  		}

	  		/*
	  		 Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
	  		 http://www.w3.org/TR/WCAG20-TECHS/H67
	  		*/
	  		tile.alt = '';

	  		/*
	  		 Set role="presentation" to force screen readers to ignore this
	  		 https://www.w3.org/TR/wai-aria/roles#textalternativecomputation
	  		*/
	  		tile.setAttribute('role', 'presentation');

	  		tile.src = this.getTileUrl(coords);

	  		return tile;
	  	},

	  	// @section Extension methods
	  	// @uninheritable
	  	// Layers extending `TileLayer` might reimplement the following method.
	  	// @method getTileUrl(coords: Object): String
	  	// Called only internally, returns the URL for a tile given its coordinates.
	  	// Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
	  	getTileUrl: function (coords) {
	  		var data = {
	  			r: retina ? '@2x' : '',
	  			s: this._getSubdomain(coords),
	  			x: coords.x,
	  			y: coords.y,
	  			z: this._getZoomForUrl()
	  		};
	  		if (this._map && !this._map.options.crs.infinite) {
	  			var invertedY = this._globalTileRange.max.y - coords.y;
	  			if (this.options.tms) {
	  				data['y'] = invertedY;
	  			}
	  			data['-y'] = invertedY;
	  		}

	  		return template(this._url, extend(data, this.options));
	  	},

	  	_tileOnLoad: function (done, tile) {
	  		// For https://github.com/Leaflet/Leaflet/issues/3332
	  		if (ielt9) {
	  			setTimeout(bind(done, this, null, tile), 0);
	  		} else {
	  			done(null, tile);
	  		}
	  	},

	  	_tileOnError: function (done, tile, e) {
	  		var errorUrl = this.options.errorTileUrl;
	  		if (errorUrl && tile.getAttribute('src') !== errorUrl) {
	  			tile.src = errorUrl;
	  		}
	  		done(e, tile);
	  	},

	  	_onTileRemove: function (e) {
	  		e.tile.onload = null;
	  	},

	  	_getZoomForUrl: function () {
	  		var zoom = this._tileZoom,
	  		maxZoom = this.options.maxZoom,
	  		zoomReverse = this.options.zoomReverse,
	  		zoomOffset = this.options.zoomOffset;

	  		if (zoomReverse) {
	  			zoom = maxZoom - zoom;
	  		}

	  		return zoom + zoomOffset;
	  	},

	  	_getSubdomain: function (tilePoint) {
	  		var index = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
	  		return this.options.subdomains[index];
	  	},

	  	// stops loading all tiles in the background layer
	  	_abortLoading: function () {
	  		var i, tile;
	  		for (i in this._tiles) {
	  			if (this._tiles[i].coords.z !== this._tileZoom) {
	  				tile = this._tiles[i].el;

	  				tile.onload = falseFn;
	  				tile.onerror = falseFn;

	  				if (!tile.complete) {
	  					tile.src = emptyImageUrl;
	  					remove(tile);
	  					delete this._tiles[i];
	  				}
	  			}
	  		}
	  	},

	  	_removeTile: function (key) {
	  		var tile = this._tiles[key];
	  		if (!tile) { return; }

	  		// Cancels any pending http requests associated with the tile
	  		// unless we're on Android's stock browser,
	  		// see https://github.com/Leaflet/Leaflet/issues/137
	  		if (!androidStock) {
	  			tile.el.setAttribute('src', emptyImageUrl);
	  		}

	  		return GridLayer.prototype._removeTile.call(this, key);
	  	},

	  	_tileReady: function (coords, err, tile) {
	  		if (!this._map || (tile && tile.getAttribute('src') === emptyImageUrl)) {
	  			return;
	  		}

	  		return GridLayer.prototype._tileReady.call(this, coords, err, tile);
	  	}
	  });


	  // @factory L.tilelayer(urlTemplate: String, options?: TileLayer options)
	  // Instantiates a tile layer object given a `URL template` and optionally an options object.

	  function tileLayer(url, options) {
	  	return new TileLayer(url, options);
	  }

	  /*
	   * @class TileLayer.WMS
	   * @inherits TileLayer
	   * @aka L.TileLayer.WMS
	   * Used to display [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services as tile layers on the map. Extends `TileLayer`.
	   *
	   * @example
	   *
	   * ```js
	   * var nexrad = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
	   * 	layers: 'nexrad-n0r-900913',
	   * 	format: 'image/png',
	   * 	transparent: true,
	   * 	attribution: "Weather data © 2012 IEM Nexrad"
	   * });
	   * ```
	   */

	  var TileLayerWMS = TileLayer.extend({

	  	// @section
	  	// @aka TileLayer.WMS options
	  	// If any custom options not documented here are used, they will be sent to the
	  	// WMS server as extra parameters in each request URL. This can be useful for
	  	// [non-standard vendor WMS parameters](http://docs.geoserver.org/stable/en/user/services/wms/vendor.html).
	  	defaultWmsParams: {
	  		service: 'WMS',
	  		request: 'GetMap',

	  		// @option layers: String = ''
	  		// **(required)** Comma-separated list of WMS layers to show.
	  		layers: '',

	  		// @option styles: String = ''
	  		// Comma-separated list of WMS styles.
	  		styles: '',

	  		// @option format: String = 'image/jpeg'
	  		// WMS image format (use `'image/png'` for layers with transparency).
	  		format: 'image/jpeg',

	  		// @option transparent: Boolean = false
	  		// If `true`, the WMS service will return images with transparency.
	  		transparent: false,

	  		// @option version: String = '1.1.1'
	  		// Version of the WMS service to use
	  		version: '1.1.1'
	  	},

	  	options: {
	  		// @option crs: CRS = null
	  		// Coordinate Reference System to use for the WMS requests, defaults to
	  		// map CRS. Don't change this if you're not sure what it means.
	  		crs: null,

	  		// @option uppercase: Boolean = false
	  		// If `true`, WMS request parameter keys will be uppercase.
	  		uppercase: false
	  	},

	  	initialize: function (url, options) {

	  		this._url = url;

	  		var wmsParams = extend({}, this.defaultWmsParams);

	  		// all keys that are not TileLayer options go to WMS params
	  		for (var i in options) {
	  			if (!(i in this.options)) {
	  				wmsParams[i] = options[i];
	  			}
	  		}

	  		options = setOptions(this, options);

	  		var realRetina = options.detectRetina && retina ? 2 : 1;
	  		var tileSize = this.getTileSize();
	  		wmsParams.width = tileSize.x * realRetina;
	  		wmsParams.height = tileSize.y * realRetina;

	  		this.wmsParams = wmsParams;
	  	},

	  	onAdd: function (map) {

	  		this._crs = this.options.crs || map.options.crs;
	  		this._wmsVersion = parseFloat(this.wmsParams.version);

	  		var projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
	  		this.wmsParams[projectionKey] = this._crs.code;

	  		TileLayer.prototype.onAdd.call(this, map);
	  	},

	  	getTileUrl: function (coords) {

	  		var tileBounds = this._tileCoordsToNwSe(coords),
	  		    crs = this._crs,
	  		    bounds = toBounds(crs.project(tileBounds[0]), crs.project(tileBounds[1])),
	  		    min = bounds.min,
	  		    max = bounds.max,
	  		    bbox = (this._wmsVersion >= 1.3 && this._crs === EPSG4326 ?
	  		    [min.y, min.x, max.y, max.x] :
	  		    [min.x, min.y, max.x, max.y]).join(','),
	  		    url = TileLayer.prototype.getTileUrl.call(this, coords);
	  		return url +
	  			getParamString(this.wmsParams, url, this.options.uppercase) +
	  			(this.options.uppercase ? '&BBOX=' : '&bbox=') + bbox;
	  	},

	  	// @method setParams(params: Object, noRedraw?: Boolean): this
	  	// Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
	  	setParams: function (params, noRedraw) {

	  		extend(this.wmsParams, params);

	  		if (!noRedraw) {
	  			this.redraw();
	  		}

	  		return this;
	  	}
	  });


	  // @factory L.tileLayer.wms(baseUrl: String, options: TileLayer.WMS options)
	  // Instantiates a WMS tile layer object given a base URL of the WMS service and a WMS parameters/options object.
	  function tileLayerWMS(url, options) {
	  	return new TileLayerWMS(url, options);
	  }

	  TileLayer.WMS = TileLayerWMS;
	  tileLayer.wms = tileLayerWMS;

	  /*
	   * @class Renderer
	   * @inherits Layer
	   * @aka L.Renderer
	   *
	   * Base class for vector renderer implementations (`SVG`, `Canvas`). Handles the
	   * DOM container of the renderer, its bounds, and its zoom animation.
	   *
	   * A `Renderer` works as an implicit layer group for all `Path`s - the renderer
	   * itself can be added or removed to the map. All paths use a renderer, which can
	   * be implicit (the map will decide the type of renderer and use it automatically)
	   * or explicit (using the [`renderer`](#path-renderer) option of the path).
	   *
	   * Do not use this class directly, use `SVG` and `Canvas` instead.
	   *
	   * @event update: Event
	   * Fired when the renderer updates its bounds, center and zoom, for example when
	   * its map has moved
	   */

	  var Renderer = Layer.extend({

	  	// @section
	  	// @aka Renderer options
	  	options: {
	  		// @option padding: Number = 0.1
	  		// How much to extend the clip area around the map view (relative to its size)
	  		// e.g. 0.1 would be 10% of map view in each direction
	  		padding: 0.1,

	  		// @option tolerance: Number = 0
	  		// How much to extend click tolerance round a path/object on the map
	  		tolerance : 0
	  	},

	  	initialize: function (options) {
	  		setOptions(this, options);
	  		stamp(this);
	  		this._layers = this._layers || {};
	  	},

	  	onAdd: function () {
	  		if (!this._container) {
	  			this._initContainer(); // defined by renderer implementations

	  			if (this._zoomAnimated) {
	  				addClass(this._container, 'leaflet-zoom-animated');
	  			}
	  		}

	  		this.getPane().appendChild(this._container);
	  		this._update();
	  		this.on('update', this._updatePaths, this);
	  	},

	  	onRemove: function () {
	  		this.off('update', this._updatePaths, this);
	  		this._destroyContainer();
	  	},

	  	getEvents: function () {
	  		var events = {
	  			viewreset: this._reset,
	  			zoom: this._onZoom,
	  			moveend: this._update,
	  			zoomend: this._onZoomEnd
	  		};
	  		if (this._zoomAnimated) {
	  			events.zoomanim = this._onAnimZoom;
	  		}
	  		return events;
	  	},

	  	_onAnimZoom: function (ev) {
	  		this._updateTransform(ev.center, ev.zoom);
	  	},

	  	_onZoom: function () {
	  		this._updateTransform(this._map.getCenter(), this._map.getZoom());
	  	},

	  	_updateTransform: function (center, zoom) {
	  		var scale = this._map.getZoomScale(zoom, this._zoom),
	  		    position = getPosition(this._container),
	  		    viewHalf = this._map.getSize().multiplyBy(0.5 + this.options.padding),
	  		    currentCenterPoint = this._map.project(this._center, zoom),
	  		    destCenterPoint = this._map.project(center, zoom),
	  		    centerOffset = destCenterPoint.subtract(currentCenterPoint),

	  		    topLeftOffset = viewHalf.multiplyBy(-scale).add(position).add(viewHalf).subtract(centerOffset);

	  		if (any3d) {
	  			setTransform(this._container, topLeftOffset, scale);
	  		} else {
	  			setPosition(this._container, topLeftOffset);
	  		}
	  	},

	  	_reset: function () {
	  		this._update();
	  		this._updateTransform(this._center, this._zoom);

	  		for (var id in this._layers) {
	  			this._layers[id]._reset();
	  		}
	  	},

	  	_onZoomEnd: function () {
	  		for (var id in this._layers) {
	  			this._layers[id]._project();
	  		}
	  	},

	  	_updatePaths: function () {
	  		for (var id in this._layers) {
	  			this._layers[id]._update();
	  		}
	  	},

	  	_update: function () {
	  		// Update pixel bounds of renderer container (for positioning/sizing/clipping later)
	  		// Subclasses are responsible of firing the 'update' event.
	  		var p = this.options.padding,
	  		    size = this._map.getSize(),
	  		    min = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();

	  		this._bounds = new Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());

	  		this._center = this._map.getCenter();
	  		this._zoom = this._map.getZoom();
	  	}
	  });

	  /*
	   * @class Canvas
	   * @inherits Renderer
	   * @aka L.Canvas
	   *
	   * Allows vector layers to be displayed with [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
	   * Inherits `Renderer`.
	   *
	   * Due to [technical limitations](http://caniuse.com/#search=canvas), Canvas is not
	   * available in all web browsers, notably IE8, and overlapping geometries might
	   * not display properly in some edge cases.
	   *
	   * @example
	   *
	   * Use Canvas by default for all paths in the map:
	   *
	   * ```js
	   * var map = L.map('map', {
	   * 	renderer: L.canvas()
	   * });
	   * ```
	   *
	   * Use a Canvas renderer with extra padding for specific vector geometries:
	   *
	   * ```js
	   * var map = L.map('map');
	   * var myRenderer = L.canvas({ padding: 0.5 });
	   * var line = L.polyline( coordinates, { renderer: myRenderer } );
	   * var circle = L.circle( center, { renderer: myRenderer } );
	   * ```
	   */

	  var Canvas = Renderer.extend({
	  	getEvents: function () {
	  		var events = Renderer.prototype.getEvents.call(this);
	  		events.viewprereset = this._onViewPreReset;
	  		return events;
	  	},

	  	_onViewPreReset: function () {
	  		// Set a flag so that a viewprereset+moveend+viewreset only updates&redraws once
	  		this._postponeUpdatePaths = true;
	  	},

	  	onAdd: function () {
	  		Renderer.prototype.onAdd.call(this);

	  		// Redraw vectors since canvas is cleared upon removal,
	  		// in case of removing the renderer itself from the map.
	  		this._draw();
	  	},

	  	_initContainer: function () {
	  		var container = this._container = document.createElement('canvas');

	  		on(container, 'mousemove', this._onMouseMove, this);
	  		on(container, 'click dblclick mousedown mouseup contextmenu', this._onClick, this);
	  		on(container, 'mouseout', this._handleMouseOut, this);

	  		this._ctx = container.getContext('2d');
	  	},

	  	_destroyContainer: function () {
	  		cancelAnimFrame(this._redrawRequest);
	  		delete this._ctx;
	  		remove(this._container);
	  		off(this._container);
	  		delete this._container;
	  	},

	  	_updatePaths: function () {
	  		if (this._postponeUpdatePaths) { return; }

	  		var layer;
	  		this._redrawBounds = null;
	  		for (var id in this._layers) {
	  			layer = this._layers[id];
	  			layer._update();
	  		}
	  		this._redraw();
	  	},

	  	_update: function () {
	  		if (this._map._animatingZoom && this._bounds) { return; }

	  		Renderer.prototype._update.call(this);

	  		var b = this._bounds,
	  		    container = this._container,
	  		    size = b.getSize(),
	  		    m = retina ? 2 : 1;

	  		setPosition(container, b.min);

	  		// set canvas size (also clearing it); use double size on retina
	  		container.width = m * size.x;
	  		container.height = m * size.y;
	  		container.style.width = size.x + 'px';
	  		container.style.height = size.y + 'px';

	  		if (retina) {
	  			this._ctx.scale(2, 2);
	  		}

	  		// translate so we use the same path coordinates after canvas element moves
	  		this._ctx.translate(-b.min.x, -b.min.y);

	  		// Tell paths to redraw themselves
	  		this.fire('update');
	  	},

	  	_reset: function () {
	  		Renderer.prototype._reset.call(this);

	  		if (this._postponeUpdatePaths) {
	  			this._postponeUpdatePaths = false;
	  			this._updatePaths();
	  		}
	  	},

	  	_initPath: function (layer) {
	  		this._updateDashArray(layer);
	  		this._layers[stamp(layer)] = layer;

	  		var order = layer._order = {
	  			layer: layer,
	  			prev: this._drawLast,
	  			next: null
	  		};
	  		if (this._drawLast) { this._drawLast.next = order; }
	  		this._drawLast = order;
	  		this._drawFirst = this._drawFirst || this._drawLast;
	  	},

	  	_addPath: function (layer) {
	  		this._requestRedraw(layer);
	  	},

	  	_removePath: function (layer) {
	  		var order = layer._order;
	  		var next = order.next;
	  		var prev = order.prev;

	  		if (next) {
	  			next.prev = prev;
	  		} else {
	  			this._drawLast = prev;
	  		}
	  		if (prev) {
	  			prev.next = next;
	  		} else {
	  			this._drawFirst = next;
	  		}

	  		delete layer._order;

	  		delete this._layers[stamp(layer)];

	  		this._requestRedraw(layer);
	  	},

	  	_updatePath: function (layer) {
	  		// Redraw the union of the layer's old pixel
	  		// bounds and the new pixel bounds.
	  		this._extendRedrawBounds(layer);
	  		layer._project();
	  		layer._update();
	  		// The redraw will extend the redraw bounds
	  		// with the new pixel bounds.
	  		this._requestRedraw(layer);
	  	},

	  	_updateStyle: function (layer) {
	  		this._updateDashArray(layer);
	  		this._requestRedraw(layer);
	  	},

	  	_updateDashArray: function (layer) {
	  		if (typeof layer.options.dashArray === 'string') {
	  			var parts = layer.options.dashArray.split(/[, ]+/),
	  			    dashArray = [],
	  			    dashValue,
	  			    i;
	  			for (i = 0; i < parts.length; i++) {
	  				dashValue = Number(parts[i]);
	  				// Ignore dash array containing invalid lengths
	  				if (isNaN(dashValue)) { return; }
	  				dashArray.push(dashValue);
	  			}
	  			layer.options._dashArray = dashArray;
	  		} else {
	  			layer.options._dashArray = layer.options.dashArray;
	  		}
	  	},

	  	_requestRedraw: function (layer) {
	  		if (!this._map) { return; }

	  		this._extendRedrawBounds(layer);
	  		this._redrawRequest = this._redrawRequest || requestAnimFrame(this._redraw, this);
	  	},

	  	_extendRedrawBounds: function (layer) {
	  		if (layer._pxBounds) {
	  			var padding = (layer.options.weight || 0) + 1;
	  			this._redrawBounds = this._redrawBounds || new Bounds();
	  			this._redrawBounds.extend(layer._pxBounds.min.subtract([padding, padding]));
	  			this._redrawBounds.extend(layer._pxBounds.max.add([padding, padding]));
	  		}
	  	},

	  	_redraw: function () {
	  		this._redrawRequest = null;

	  		if (this._redrawBounds) {
	  			this._redrawBounds.min._floor();
	  			this._redrawBounds.max._ceil();
	  		}

	  		this._clear(); // clear layers in redraw bounds
	  		this._draw(); // draw layers

	  		this._redrawBounds = null;
	  	},

	  	_clear: function () {
	  		var bounds = this._redrawBounds;
	  		if (bounds) {
	  			var size = bounds.getSize();
	  			this._ctx.clearRect(bounds.min.x, bounds.min.y, size.x, size.y);
	  		} else {
	  			this._ctx.save();
	  			this._ctx.setTransform(1, 0, 0, 1, 0, 0);
	  			this._ctx.clearRect(0, 0, this._container.width, this._container.height);
	  			this._ctx.restore();
	  		}
	  	},

	  	_draw: function () {
	  		var layer, bounds = this._redrawBounds;
	  		this._ctx.save();
	  		if (bounds) {
	  			var size = bounds.getSize();
	  			this._ctx.beginPath();
	  			this._ctx.rect(bounds.min.x, bounds.min.y, size.x, size.y);
	  			this._ctx.clip();
	  		}

	  		this._drawing = true;

	  		for (var order = this._drawFirst; order; order = order.next) {
	  			layer = order.layer;
	  			if (!bounds || (layer._pxBounds && layer._pxBounds.intersects(bounds))) {
	  				layer._updatePath();
	  			}
	  		}

	  		this._drawing = false;

	  		this._ctx.restore();  // Restore state before clipping.
	  	},

	  	_updatePoly: function (layer, closed) {
	  		if (!this._drawing) { return; }

	  		var i, j, len2, p,
	  		    parts = layer._parts,
	  		    len = parts.length,
	  		    ctx = this._ctx;

	  		if (!len) { return; }

	  		ctx.beginPath();

	  		for (i = 0; i < len; i++) {
	  			for (j = 0, len2 = parts[i].length; j < len2; j++) {
	  				p = parts[i][j];
	  				ctx[j ? 'lineTo' : 'moveTo'](p.x, p.y);
	  			}
	  			if (closed) {
	  				ctx.closePath();
	  			}
	  		}

	  		this._fillStroke(ctx, layer);

	  		// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
	  	},

	  	_updateCircle: function (layer) {

	  		if (!this._drawing || layer._empty()) { return; }

	  		var p = layer._point,
	  		    ctx = this._ctx,
	  		    r = Math.max(Math.round(layer._radius), 1),
	  		    s = (Math.max(Math.round(layer._radiusY), 1) || r) / r;

	  		if (s !== 1) {
	  			ctx.save();
	  			ctx.scale(1, s);
	  		}

	  		ctx.beginPath();
	  		ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);

	  		if (s !== 1) {
	  			ctx.restore();
	  		}

	  		this._fillStroke(ctx, layer);
	  	},

	  	_fillStroke: function (ctx, layer) {
	  		var options = layer.options;

	  		if (options.fill) {
	  			ctx.globalAlpha = options.fillOpacity;
	  			ctx.fillStyle = options.fillColor || options.color;
	  			ctx.fill(options.fillRule || 'evenodd');
	  		}

	  		if (options.stroke && options.weight !== 0) {
	  			if (ctx.setLineDash) {
	  				ctx.setLineDash(layer.options && layer.options._dashArray || []);
	  			}
	  			ctx.globalAlpha = options.opacity;
	  			ctx.lineWidth = options.weight;
	  			ctx.strokeStyle = options.color;
	  			ctx.lineCap = options.lineCap;
	  			ctx.lineJoin = options.lineJoin;
	  			ctx.stroke();
	  		}
	  	},

	  	// Canvas obviously doesn't have mouse events for individual drawn objects,
	  	// so we emulate that by calculating what's under the mouse on mousemove/click manually

	  	_onClick: function (e) {
	  		var point = this._map.mouseEventToLayerPoint(e), layer, clickedLayer;

	  		for (var order = this._drawFirst; order; order = order.next) {
	  			layer = order.layer;
	  			if (layer.options.interactive && layer._containsPoint(point)) {
	  				if (!(e.type === 'click' || e.type !== 'preclick') || !this._map._draggableMoved(layer)) {
	  					clickedLayer = layer;
	  				}
	  			}
	  		}
	  		if (clickedLayer)  {
	  			fakeStop(e);
	  			this._fireEvent([clickedLayer], e);
	  		}
	  	},

	  	_onMouseMove: function (e) {
	  		if (!this._map || this._map.dragging.moving() || this._map._animatingZoom) { return; }

	  		var point = this._map.mouseEventToLayerPoint(e);
	  		this._handleMouseHover(e, point);
	  	},


	  	_handleMouseOut: function (e) {
	  		var layer = this._hoveredLayer;
	  		if (layer) {
	  			// if we're leaving the layer, fire mouseout
	  			removeClass(this._container, 'leaflet-interactive');
	  			this._fireEvent([layer], e, 'mouseout');
	  			this._hoveredLayer = null;
	  			this._mouseHoverThrottled = false;
	  		}
	  	},

	  	_handleMouseHover: function (e, point) {
	  		if (this._mouseHoverThrottled) {
	  			return;
	  		}

	  		var layer, candidateHoveredLayer;

	  		for (var order = this._drawFirst; order; order = order.next) {
	  			layer = order.layer;
	  			if (layer.options.interactive && layer._containsPoint(point)) {
	  				candidateHoveredLayer = layer;
	  			}
	  		}

	  		if (candidateHoveredLayer !== this._hoveredLayer) {
	  			this._handleMouseOut(e);

	  			if (candidateHoveredLayer) {
	  				addClass(this._container, 'leaflet-interactive'); // change cursor
	  				this._fireEvent([candidateHoveredLayer], e, 'mouseover');
	  				this._hoveredLayer = candidateHoveredLayer;
	  			}
	  		}

	  		if (this._hoveredLayer) {
	  			this._fireEvent([this._hoveredLayer], e);
	  		}

	  		this._mouseHoverThrottled = true;
	  		setTimeout(bind(function () {
	  			this._mouseHoverThrottled = false;
	  		}, this), 32);
	  	},

	  	_fireEvent: function (layers, e, type) {
	  		this._map._fireDOMEvent(e, type || e.type, layers);
	  	},

	  	_bringToFront: function (layer) {
	  		var order = layer._order;

	  		if (!order) { return; }

	  		var next = order.next;
	  		var prev = order.prev;

	  		if (next) {
	  			next.prev = prev;
	  		} else {
	  			// Already last
	  			return;
	  		}
	  		if (prev) {
	  			prev.next = next;
	  		} else if (next) {
	  			// Update first entry unless this is the
	  			// single entry
	  			this._drawFirst = next;
	  		}

	  		order.prev = this._drawLast;
	  		this._drawLast.next = order;

	  		order.next = null;
	  		this._drawLast = order;

	  		this._requestRedraw(layer);
	  	},

	  	_bringToBack: function (layer) {
	  		var order = layer._order;

	  		if (!order) { return; }

	  		var next = order.next;
	  		var prev = order.prev;

	  		if (prev) {
	  			prev.next = next;
	  		} else {
	  			// Already first
	  			return;
	  		}
	  		if (next) {
	  			next.prev = prev;
	  		} else if (prev) {
	  			// Update last entry unless this is the
	  			// single entry
	  			this._drawLast = prev;
	  		}

	  		order.prev = null;

	  		order.next = this._drawFirst;
	  		this._drawFirst.prev = order;
	  		this._drawFirst = order;

	  		this._requestRedraw(layer);
	  	}
	  });

	  // @factory L.canvas(options?: Renderer options)
	  // Creates a Canvas renderer with the given options.
	  function canvas$1(options) {
	  	return canvas ? new Canvas(options) : null;
	  }

	  /*
	   * Thanks to Dmitry Baranovsky and his Raphael library for inspiration!
	   */


	  var vmlCreate = (function () {
	  	try {
	  		document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml');
	  		return function (name) {
	  			return document.createElement('<lvml:' + name + ' class="lvml">');
	  		};
	  	} catch (e) {
	  		return function (name) {
	  			return document.createElement('<' + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
	  		};
	  	}
	  })();


	  /*
	   * @class SVG
	   *
	   *
	   * VML was deprecated in 2012, which means VML functionality exists only for backwards compatibility
	   * with old versions of Internet Explorer.
	   */

	  // mixin to redefine some SVG methods to handle VML syntax which is similar but with some differences
	  var vmlMixin = {

	  	_initContainer: function () {
	  		this._container = create$1('div', 'leaflet-vml-container');
	  	},

	  	_update: function () {
	  		if (this._map._animatingZoom) { return; }
	  		Renderer.prototype._update.call(this);
	  		this.fire('update');
	  	},

	  	_initPath: function (layer) {
	  		var container = layer._container = vmlCreate('shape');

	  		addClass(container, 'leaflet-vml-shape ' + (this.options.className || ''));

	  		container.coordsize = '1 1';

	  		layer._path = vmlCreate('path');
	  		container.appendChild(layer._path);

	  		this._updateStyle(layer);
	  		this._layers[stamp(layer)] = layer;
	  	},

	  	_addPath: function (layer) {
	  		var container = layer._container;
	  		this._container.appendChild(container);

	  		if (layer.options.interactive) {
	  			layer.addInteractiveTarget(container);
	  		}
	  	},

	  	_removePath: function (layer) {
	  		var container = layer._container;
	  		remove(container);
	  		layer.removeInteractiveTarget(container);
	  		delete this._layers[stamp(layer)];
	  	},

	  	_updateStyle: function (layer) {
	  		var stroke = layer._stroke,
	  		    fill = layer._fill,
	  		    options = layer.options,
	  		    container = layer._container;

	  		container.stroked = !!options.stroke;
	  		container.filled = !!options.fill;

	  		if (options.stroke) {
	  			if (!stroke) {
	  				stroke = layer._stroke = vmlCreate('stroke');
	  			}
	  			container.appendChild(stroke);
	  			stroke.weight = options.weight + 'px';
	  			stroke.color = options.color;
	  			stroke.opacity = options.opacity;

	  			if (options.dashArray) {
	  				stroke.dashStyle = isArray(options.dashArray) ?
	  				    options.dashArray.join(' ') :
	  				    options.dashArray.replace(/( *, *)/g, ' ');
	  			} else {
	  				stroke.dashStyle = '';
	  			}
	  			stroke.endcap = options.lineCap.replace('butt', 'flat');
	  			stroke.joinstyle = options.lineJoin;

	  		} else if (stroke) {
	  			container.removeChild(stroke);
	  			layer._stroke = null;
	  		}

	  		if (options.fill) {
	  			if (!fill) {
	  				fill = layer._fill = vmlCreate('fill');
	  			}
	  			container.appendChild(fill);
	  			fill.color = options.fillColor || options.color;
	  			fill.opacity = options.fillOpacity;

	  		} else if (fill) {
	  			container.removeChild(fill);
	  			layer._fill = null;
	  		}
	  	},

	  	_updateCircle: function (layer) {
	  		var p = layer._point.round(),
	  		    r = Math.round(layer._radius),
	  		    r2 = Math.round(layer._radiusY || r);

	  		this._setPath(layer, layer._empty() ? 'M0 0' :
	  			'AL ' + p.x + ',' + p.y + ' ' + r + ',' + r2 + ' 0,' + (65535 * 360));
	  	},

	  	_setPath: function (layer, path) {
	  		layer._path.v = path;
	  	},

	  	_bringToFront: function (layer) {
	  		toFront(layer._container);
	  	},

	  	_bringToBack: function (layer) {
	  		toBack(layer._container);
	  	}
	  };

	  var create$2 = vml ? vmlCreate : svgCreate;

	  /*
	   * @class SVG
	   * @inherits Renderer
	   * @aka L.SVG
	   *
	   * Allows vector layers to be displayed with [SVG](https://developer.mozilla.org/docs/Web/SVG).
	   * Inherits `Renderer`.
	   *
	   * Due to [technical limitations](http://caniuse.com/#search=svg), SVG is not
	   * available in all web browsers, notably Android 2.x and 3.x.
	   *
	   * Although SVG is not available on IE7 and IE8, these browsers support
	   * [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language)
	   * (a now deprecated technology), and the SVG renderer will fall back to VML in
	   * this case.
	   *
	   * @example
	   *
	   * Use SVG by default for all paths in the map:
	   *
	   * ```js
	   * var map = L.map('map', {
	   * 	renderer: L.svg()
	   * });
	   * ```
	   *
	   * Use a SVG renderer with extra padding for specific vector geometries:
	   *
	   * ```js
	   * var map = L.map('map');
	   * var myRenderer = L.svg({ padding: 0.5 });
	   * var line = L.polyline( coordinates, { renderer: myRenderer } );
	   * var circle = L.circle( center, { renderer: myRenderer } );
	   * ```
	   */

	  var SVG = Renderer.extend({

	  	getEvents: function () {
	  		var events = Renderer.prototype.getEvents.call(this);
	  		events.zoomstart = this._onZoomStart;
	  		return events;
	  	},

	  	_initContainer: function () {
	  		this._container = create$2('svg');

	  		// makes it possible to click through svg root; we'll reset it back in individual paths
	  		this._container.setAttribute('pointer-events', 'none');

	  		this._rootGroup = create$2('g');
	  		this._container.appendChild(this._rootGroup);
	  	},

	  	_destroyContainer: function () {
	  		remove(this._container);
	  		off(this._container);
	  		delete this._container;
	  		delete this._rootGroup;
	  		delete this._svgSize;
	  	},

	  	_onZoomStart: function () {
	  		// Drag-then-pinch interactions might mess up the center and zoom.
	  		// In this case, the easiest way to prevent this is re-do the renderer
	  		//   bounds and padding when the zooming starts.
	  		this._update();
	  	},

	  	_update: function () {
	  		if (this._map._animatingZoom && this._bounds) { return; }

	  		Renderer.prototype._update.call(this);

	  		var b = this._bounds,
	  		    size = b.getSize(),
	  		    container = this._container;

	  		// set size of svg-container if changed
	  		if (!this._svgSize || !this._svgSize.equals(size)) {
	  			this._svgSize = size;
	  			container.setAttribute('width', size.x);
	  			container.setAttribute('height', size.y);
	  		}

	  		// movement: update container viewBox so that we don't have to change coordinates of individual layers
	  		setPosition(container, b.min);
	  		container.setAttribute('viewBox', [b.min.x, b.min.y, size.x, size.y].join(' '));

	  		this.fire('update');
	  	},

	  	// methods below are called by vector layers implementations

	  	_initPath: function (layer) {
	  		var path = layer._path = create$2('path');

	  		// @namespace Path
	  		// @option className: String = null
	  		// Custom class name set on an element. Only for SVG renderer.
	  		if (layer.options.className) {
	  			addClass(path, layer.options.className);
	  		}

	  		if (layer.options.interactive) {
	  			addClass(path, 'leaflet-interactive');
	  		}

	  		this._updateStyle(layer);
	  		this._layers[stamp(layer)] = layer;
	  	},

	  	_addPath: function (layer) {
	  		if (!this._rootGroup) { this._initContainer(); }
	  		this._rootGroup.appendChild(layer._path);
	  		layer.addInteractiveTarget(layer._path);
	  	},

	  	_removePath: function (layer) {
	  		remove(layer._path);
	  		layer.removeInteractiveTarget(layer._path);
	  		delete this._layers[stamp(layer)];
	  	},

	  	_updatePath: function (layer) {
	  		layer._project();
	  		layer._update();
	  	},

	  	_updateStyle: function (layer) {
	  		var path = layer._path,
	  		    options = layer.options;

	  		if (!path) { return; }

	  		if (options.stroke) {
	  			path.setAttribute('stroke', options.color);
	  			path.setAttribute('stroke-opacity', options.opacity);
	  			path.setAttribute('stroke-width', options.weight);
	  			path.setAttribute('stroke-linecap', options.lineCap);
	  			path.setAttribute('stroke-linejoin', options.lineJoin);

	  			if (options.dashArray) {
	  				path.setAttribute('stroke-dasharray', options.dashArray);
	  			} else {
	  				path.removeAttribute('stroke-dasharray');
	  			}

	  			if (options.dashOffset) {
	  				path.setAttribute('stroke-dashoffset', options.dashOffset);
	  			} else {
	  				path.removeAttribute('stroke-dashoffset');
	  			}
	  		} else {
	  			path.setAttribute('stroke', 'none');
	  		}

	  		if (options.fill) {
	  			path.setAttribute('fill', options.fillColor || options.color);
	  			path.setAttribute('fill-opacity', options.fillOpacity);
	  			path.setAttribute('fill-rule', options.fillRule || 'evenodd');
	  		} else {
	  			path.setAttribute('fill', 'none');
	  		}
	  	},

	  	_updatePoly: function (layer, closed) {
	  		this._setPath(layer, pointsToPath(layer._parts, closed));
	  	},

	  	_updateCircle: function (layer) {
	  		var p = layer._point,
	  		    r = Math.max(Math.round(layer._radius), 1),
	  		    r2 = Math.max(Math.round(layer._radiusY), 1) || r,
	  		    arc = 'a' + r + ',' + r2 + ' 0 1,0 ';

	  		// drawing a circle with two half-arcs
	  		var d = layer._empty() ? 'M0 0' :
	  			'M' + (p.x - r) + ',' + p.y +
	  			arc + (r * 2) + ',0 ' +
	  			arc + (-r * 2) + ',0 ';

	  		this._setPath(layer, d);
	  	},

	  	_setPath: function (layer, path) {
	  		layer._path.setAttribute('d', path);
	  	},

	  	// SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
	  	_bringToFront: function (layer) {
	  		toFront(layer._path);
	  	},

	  	_bringToBack: function (layer) {
	  		toBack(layer._path);
	  	}
	  });

	  if (vml) {
	  	SVG.include(vmlMixin);
	  }

	  // @namespace SVG
	  // @factory L.svg(options?: Renderer options)
	  // Creates a SVG renderer with the given options.
	  function svg$1(options) {
	  	return svg || vml ? new SVG(options) : null;
	  }

	  Map.include({
	  	// @namespace Map; @method getRenderer(layer: Path): Renderer
	  	// Returns the instance of `Renderer` that should be used to render the given
	  	// `Path`. It will ensure that the `renderer` options of the map and paths
	  	// are respected, and that the renderers do exist on the map.
	  	getRenderer: function (layer) {
	  		// @namespace Path; @option renderer: Renderer
	  		// Use this specific instance of `Renderer` for this path. Takes
	  		// precedence over the map's [default renderer](#map-renderer).
	  		var renderer = layer.options.renderer || this._getPaneRenderer(layer.options.pane) || this.options.renderer || this._renderer;

	  		if (!renderer) {
	  			renderer = this._renderer = this._createRenderer();
	  		}

	  		if (!this.hasLayer(renderer)) {
	  			this.addLayer(renderer);
	  		}
	  		return renderer;
	  	},

	  	_getPaneRenderer: function (name) {
	  		if (name === 'overlayPane' || name === undefined) {
	  			return false;
	  		}

	  		var renderer = this._paneRenderers[name];
	  		if (renderer === undefined) {
	  			renderer = this._createRenderer({pane: name});
	  			this._paneRenderers[name] = renderer;
	  		}
	  		return renderer;
	  	},

	  	_createRenderer: function (options) {
	  		// @namespace Map; @option preferCanvas: Boolean = false
	  		// Whether `Path`s should be rendered on a `Canvas` renderer.
	  		// By default, all `Path`s are rendered in a `SVG` renderer.
	  		return (this.options.preferCanvas && canvas$1(options)) || svg$1(options);
	  	}
	  });

	  /*
	   * L.Rectangle extends Polygon and creates a rectangle when passed a LatLngBounds object.
	   */

	  /*
	   * @class Rectangle
	   * @aka L.Rectangle
	   * @inherits Polygon
	   *
	   * A class for drawing rectangle overlays on a map. Extends `Polygon`.
	   *
	   * @example
	   *
	   * ```js
	   * // define rectangle geographical bounds
	   * var bounds = [[54.559322, -5.767822], [56.1210604, -3.021240]];
	   *
	   * // create an orange rectangle
	   * L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
	   *
	   * // zoom the map to the rectangle bounds
	   * map.fitBounds(bounds);
	   * ```
	   *
	   */


	  var Rectangle = Polygon.extend({
	  	initialize: function (latLngBounds, options) {
	  		Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
	  	},

	  	// @method setBounds(latLngBounds: LatLngBounds): this
	  	// Redraws the rectangle with the passed bounds.
	  	setBounds: function (latLngBounds) {
	  		return this.setLatLngs(this._boundsToLatLngs(latLngBounds));
	  	},

	  	_boundsToLatLngs: function (latLngBounds) {
	  		latLngBounds = toLatLngBounds(latLngBounds);
	  		return [
	  			latLngBounds.getSouthWest(),
	  			latLngBounds.getNorthWest(),
	  			latLngBounds.getNorthEast(),
	  			latLngBounds.getSouthEast()
	  		];
	  	}
	  });


	  // @factory L.rectangle(latLngBounds: LatLngBounds, options?: Polyline options)
	  function rectangle(latLngBounds, options) {
	  	return new Rectangle(latLngBounds, options);
	  }

	  SVG.create = create$2;
	  SVG.pointsToPath = pointsToPath;

	  GeoJSON.geometryToLayer = geometryToLayer;
	  GeoJSON.coordsToLatLng = coordsToLatLng;
	  GeoJSON.coordsToLatLngs = coordsToLatLngs;
	  GeoJSON.latLngToCoords = latLngToCoords;
	  GeoJSON.latLngsToCoords = latLngsToCoords;
	  GeoJSON.getFeature = getFeature;
	  GeoJSON.asFeature = asFeature;

	  /*
	   * L.Handler.BoxZoom is used to add shift-drag zoom interaction to the map
	   * (zoom to a selected bounding box), enabled by default.
	   */

	  // @namespace Map
	  // @section Interaction Options
	  Map.mergeOptions({
	  	// @option boxZoom: Boolean = true
	  	// Whether the map can be zoomed to a rectangular area specified by
	  	// dragging the mouse while pressing the shift key.
	  	boxZoom: true
	  });

	  var BoxZoom = Handler.extend({
	  	initialize: function (map) {
	  		this._map = map;
	  		this._container = map._container;
	  		this._pane = map._panes.overlayPane;
	  		this._resetStateTimeout = 0;
	  		map.on('unload', this._destroy, this);
	  	},

	  	addHooks: function () {
	  		on(this._container, 'mousedown', this._onMouseDown, this);
	  	},

	  	removeHooks: function () {
	  		off(this._container, 'mousedown', this._onMouseDown, this);
	  	},

	  	moved: function () {
	  		return this._moved;
	  	},

	  	_destroy: function () {
	  		remove(this._pane);
	  		delete this._pane;
	  	},

	  	_resetState: function () {
	  		this._resetStateTimeout = 0;
	  		this._moved = false;
	  	},

	  	_clearDeferredResetState: function () {
	  		if (this._resetStateTimeout !== 0) {
	  			clearTimeout(this._resetStateTimeout);
	  			this._resetStateTimeout = 0;
	  		}
	  	},

	  	_onMouseDown: function (e) {
	  		if (!e.shiftKey || ((e.which !== 1) && (e.button !== 1))) { return false; }

	  		// Clear the deferred resetState if it hasn't executed yet, otherwise it
	  		// will interrupt the interaction and orphan a box element in the container.
	  		this._clearDeferredResetState();
	  		this._resetState();

	  		disableTextSelection();
	  		disableImageDrag();

	  		this._startPoint = this._map.mouseEventToContainerPoint(e);

	  		on(document, {
	  			contextmenu: stop,
	  			mousemove: this._onMouseMove,
	  			mouseup: this._onMouseUp,
	  			keydown: this._onKeyDown
	  		}, this);
	  	},

	  	_onMouseMove: function (e) {
	  		if (!this._moved) {
	  			this._moved = true;

	  			this._box = create$1('div', 'leaflet-zoom-box', this._container);
	  			addClass(this._container, 'leaflet-crosshair');

	  			this._map.fire('boxzoomstart');
	  		}

	  		this._point = this._map.mouseEventToContainerPoint(e);

	  		var bounds = new Bounds(this._point, this._startPoint),
	  		    size = bounds.getSize();

	  		setPosition(this._box, bounds.min);

	  		this._box.style.width  = size.x + 'px';
	  		this._box.style.height = size.y + 'px';
	  	},

	  	_finish: function () {
	  		if (this._moved) {
	  			remove(this._box);
	  			removeClass(this._container, 'leaflet-crosshair');
	  		}

	  		enableTextSelection();
	  		enableImageDrag();

	  		off(document, {
	  			contextmenu: stop,
	  			mousemove: this._onMouseMove,
	  			mouseup: this._onMouseUp,
	  			keydown: this._onKeyDown
	  		}, this);
	  	},

	  	_onMouseUp: function (e) {
	  		if ((e.which !== 1) && (e.button !== 1)) { return; }

	  		this._finish();

	  		if (!this._moved) { return; }
	  		// Postpone to next JS tick so internal click event handling
	  		// still see it as "moved".
	  		this._clearDeferredResetState();
	  		this._resetStateTimeout = setTimeout(bind(this._resetState, this), 0);

	  		var bounds = new LatLngBounds(
	  		        this._map.containerPointToLatLng(this._startPoint),
	  		        this._map.containerPointToLatLng(this._point));

	  		this._map
	  			.fitBounds(bounds)
	  			.fire('boxzoomend', {boxZoomBounds: bounds});
	  	},

	  	_onKeyDown: function (e) {
	  		if (e.keyCode === 27) {
	  			this._finish();
	  		}
	  	}
	  });

	  // @section Handlers
	  // @property boxZoom: Handler
	  // Box (shift-drag with mouse) zoom handler.
	  Map.addInitHook('addHandler', 'boxZoom', BoxZoom);

	  /*
	   * L.Handler.DoubleClickZoom is used to handle double-click zoom on the map, enabled by default.
	   */

	  // @namespace Map
	  // @section Interaction Options

	  Map.mergeOptions({
	  	// @option doubleClickZoom: Boolean|String = true
	  	// Whether the map can be zoomed in by double clicking on it and
	  	// zoomed out by double clicking while holding shift. If passed
	  	// `'center'`, double-click zoom will zoom to the center of the
	  	//  view regardless of where the mouse was.
	  	doubleClickZoom: true
	  });

	  var DoubleClickZoom = Handler.extend({
	  	addHooks: function () {
	  		this._map.on('dblclick', this._onDoubleClick, this);
	  	},

	  	removeHooks: function () {
	  		this._map.off('dblclick', this._onDoubleClick, this);
	  	},

	  	_onDoubleClick: function (e) {
	  		var map = this._map,
	  		    oldZoom = map.getZoom(),
	  		    delta = map.options.zoomDelta,
	  		    zoom = e.originalEvent.shiftKey ? oldZoom - delta : oldZoom + delta;

	  		if (map.options.doubleClickZoom === 'center') {
	  			map.setZoom(zoom);
	  		} else {
	  			map.setZoomAround(e.containerPoint, zoom);
	  		}
	  	}
	  });

	  // @section Handlers
	  //
	  // Map properties include interaction handlers that allow you to control
	  // interaction behavior in runtime, enabling or disabling certain features such
	  // as dragging or touch zoom (see `Handler` methods). For example:
	  //
	  // ```js
	  // map.doubleClickZoom.disable();
	  // ```
	  //
	  // @property doubleClickZoom: Handler
	  // Double click zoom handler.
	  Map.addInitHook('addHandler', 'doubleClickZoom', DoubleClickZoom);

	  /*
	   * L.Handler.MapDrag is used to make the map draggable (with panning inertia), enabled by default.
	   */

	  // @namespace Map
	  // @section Interaction Options
	  Map.mergeOptions({
	  	// @option dragging: Boolean = true
	  	// Whether the map be draggable with mouse/touch or not.
	  	dragging: true,

	  	// @section Panning Inertia Options
	  	// @option inertia: Boolean = *
	  	// If enabled, panning of the map will have an inertia effect where
	  	// the map builds momentum while dragging and continues moving in
	  	// the same direction for some time. Feels especially nice on touch
	  	// devices. Enabled by default unless running on old Android devices.
	  	inertia: !android23,

	  	// @option inertiaDeceleration: Number = 3000
	  	// The rate with which the inertial movement slows down, in pixels/second².
	  	inertiaDeceleration: 3400, // px/s^2

	  	// @option inertiaMaxSpeed: Number = Infinity
	  	// Max speed of the inertial movement, in pixels/second.
	  	inertiaMaxSpeed: Infinity, // px/s

	  	// @option easeLinearity: Number = 0.2
	  	easeLinearity: 0.2,

	  	// TODO refactor, move to CRS
	  	// @option worldCopyJump: Boolean = false
	  	// With this option enabled, the map tracks when you pan to another "copy"
	  	// of the world and seamlessly jumps to the original one so that all overlays
	  	// like markers and vector layers are still visible.
	  	worldCopyJump: false,

	  	// @option maxBoundsViscosity: Number = 0.0
	  	// If `maxBounds` is set, this option will control how solid the bounds
	  	// are when dragging the map around. The default value of `0.0` allows the
	  	// user to drag outside the bounds at normal speed, higher values will
	  	// slow down map dragging outside bounds, and `1.0` makes the bounds fully
	  	// solid, preventing the user from dragging outside the bounds.
	  	maxBoundsViscosity: 0.0
	  });

	  var Drag = Handler.extend({
	  	addHooks: function () {
	  		if (!this._draggable) {
	  			var map = this._map;

	  			this._draggable = new Draggable(map._mapPane, map._container);

	  			this._draggable.on({
	  				dragstart: this._onDragStart,
	  				drag: this._onDrag,
	  				dragend: this._onDragEnd
	  			}, this);

	  			this._draggable.on('predrag', this._onPreDragLimit, this);
	  			if (map.options.worldCopyJump) {
	  				this._draggable.on('predrag', this._onPreDragWrap, this);
	  				map.on('zoomend', this._onZoomEnd, this);

	  				map.whenReady(this._onZoomEnd, this);
	  			}
	  		}
	  		addClass(this._map._container, 'leaflet-grab leaflet-touch-drag');
	  		this._draggable.enable();
	  		this._positions = [];
	  		this._times = [];
	  	},

	  	removeHooks: function () {
	  		removeClass(this._map._container, 'leaflet-grab');
	  		removeClass(this._map._container, 'leaflet-touch-drag');
	  		this._draggable.disable();
	  	},

	  	moved: function () {
	  		return this._draggable && this._draggable._moved;
	  	},

	  	moving: function () {
	  		return this._draggable && this._draggable._moving;
	  	},

	  	_onDragStart: function () {
	  		var map = this._map;

	  		map._stop();
	  		if (this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
	  			var bounds = toLatLngBounds(this._map.options.maxBounds);

	  			this._offsetLimit = toBounds(
	  				this._map.latLngToContainerPoint(bounds.getNorthWest()).multiplyBy(-1),
	  				this._map.latLngToContainerPoint(bounds.getSouthEast()).multiplyBy(-1)
	  					.add(this._map.getSize()));

	  			this._viscosity = Math.min(1.0, Math.max(0.0, this._map.options.maxBoundsViscosity));
	  		} else {
	  			this._offsetLimit = null;
	  		}

	  		map
	  		    .fire('movestart')
	  		    .fire('dragstart');

	  		if (map.options.inertia) {
	  			this._positions = [];
	  			this._times = [];
	  		}
	  	},

	  	_onDrag: function (e) {
	  		if (this._map.options.inertia) {
	  			var time = this._lastTime = +new Date(),
	  			    pos = this._lastPos = this._draggable._absPos || this._draggable._newPos;

	  			this._positions.push(pos);
	  			this._times.push(time);

	  			this._prunePositions(time);
	  		}

	  		this._map
	  		    .fire('move', e)
	  		    .fire('drag', e);
	  	},

	  	_prunePositions: function (time) {
	  		while (this._positions.length > 1 && time - this._times[0] > 50) {
	  			this._positions.shift();
	  			this._times.shift();
	  		}
	  	},

	  	_onZoomEnd: function () {
	  		var pxCenter = this._map.getSize().divideBy(2),
	  		    pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);

	  		this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
	  		this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
	  	},

	  	_viscousLimit: function (value, threshold) {
	  		return value - (value - threshold) * this._viscosity;
	  	},

	  	_onPreDragLimit: function () {
	  		if (!this._viscosity || !this._offsetLimit) { return; }

	  		var offset = this._draggable._newPos.subtract(this._draggable._startPos);

	  		var limit = this._offsetLimit;
	  		if (offset.x < limit.min.x) { offset.x = this._viscousLimit(offset.x, limit.min.x); }
	  		if (offset.y < limit.min.y) { offset.y = this._viscousLimit(offset.y, limit.min.y); }
	  		if (offset.x > limit.max.x) { offset.x = this._viscousLimit(offset.x, limit.max.x); }
	  		if (offset.y > limit.max.y) { offset.y = this._viscousLimit(offset.y, limit.max.y); }

	  		this._draggable._newPos = this._draggable._startPos.add(offset);
	  	},

	  	_onPreDragWrap: function () {
	  		// TODO refactor to be able to adjust map pane position after zoom
	  		var worldWidth = this._worldWidth,
	  		    halfWidth = Math.round(worldWidth / 2),
	  		    dx = this._initialWorldOffset,
	  		    x = this._draggable._newPos.x,
	  		    newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx,
	  		    newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx,
	  		    newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;

	  		this._draggable._absPos = this._draggable._newPos.clone();
	  		this._draggable._newPos.x = newX;
	  	},

	  	_onDragEnd: function (e) {
	  		var map = this._map,
	  		    options = map.options,

	  		    noInertia = !options.inertia || this._times.length < 2;

	  		map.fire('dragend', e);

	  		if (noInertia) {
	  			map.fire('moveend');

	  		} else {
	  			this._prunePositions(+new Date());

	  			var direction = this._lastPos.subtract(this._positions[0]),
	  			    duration = (this._lastTime - this._times[0]) / 1000,
	  			    ease = options.easeLinearity,

	  			    speedVector = direction.multiplyBy(ease / duration),
	  			    speed = speedVector.distanceTo([0, 0]),

	  			    limitedSpeed = Math.min(options.inertiaMaxSpeed, speed),
	  			    limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed),

	  			    decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease),
	  			    offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();

	  			if (!offset.x && !offset.y) {
	  				map.fire('moveend');

	  			} else {
	  				offset = map._limitOffset(offset, map.options.maxBounds);

	  				requestAnimFrame(function () {
	  					map.panBy(offset, {
	  						duration: decelerationDuration,
	  						easeLinearity: ease,
	  						noMoveStart: true,
	  						animate: true
	  					});
	  				});
	  			}
	  		}
	  	}
	  });

	  // @section Handlers
	  // @property dragging: Handler
	  // Map dragging handler (by both mouse and touch).
	  Map.addInitHook('addHandler', 'dragging', Drag);

	  /*
	   * L.Map.Keyboard is handling keyboard interaction with the map, enabled by default.
	   */

	  // @namespace Map
	  // @section Keyboard Navigation Options
	  Map.mergeOptions({
	  	// @option keyboard: Boolean = true
	  	// Makes the map focusable and allows users to navigate the map with keyboard
	  	// arrows and `+`/`-` keys.
	  	keyboard: true,

	  	// @option keyboardPanDelta: Number = 80
	  	// Amount of pixels to pan when pressing an arrow key.
	  	keyboardPanDelta: 80
	  });

	  var Keyboard = Handler.extend({

	  	keyCodes: {
	  		left:    [37],
	  		right:   [39],
	  		down:    [40],
	  		up:      [38],
	  		zoomIn:  [187, 107, 61, 171],
	  		zoomOut: [189, 109, 54, 173]
	  	},

	  	initialize: function (map) {
	  		this._map = map;

	  		this._setPanDelta(map.options.keyboardPanDelta);
	  		this._setZoomDelta(map.options.zoomDelta);
	  	},

	  	addHooks: function () {
	  		var container = this._map._container;

	  		// make the container focusable by tabbing
	  		if (container.tabIndex <= 0) {
	  			container.tabIndex = '0';
	  		}

	  		on(container, {
	  			focus: this._onFocus,
	  			blur: this._onBlur,
	  			mousedown: this._onMouseDown
	  		}, this);

	  		this._map.on({
	  			focus: this._addHooks,
	  			blur: this._removeHooks
	  		}, this);
	  	},

	  	removeHooks: function () {
	  		this._removeHooks();

	  		off(this._map._container, {
	  			focus: this._onFocus,
	  			blur: this._onBlur,
	  			mousedown: this._onMouseDown
	  		}, this);

	  		this._map.off({
	  			focus: this._addHooks,
	  			blur: this._removeHooks
	  		}, this);
	  	},

	  	_onMouseDown: function () {
	  		if (this._focused) { return; }

	  		var body = document.body,
	  		    docEl = document.documentElement,
	  		    top = body.scrollTop || docEl.scrollTop,
	  		    left = body.scrollLeft || docEl.scrollLeft;

	  		this._map._container.focus();

	  		window.scrollTo(left, top);
	  	},

	  	_onFocus: function () {
	  		this._focused = true;
	  		this._map.fire('focus');
	  	},

	  	_onBlur: function () {
	  		this._focused = false;
	  		this._map.fire('blur');
	  	},

	  	_setPanDelta: function (panDelta) {
	  		var keys = this._panKeys = {},
	  		    codes = this.keyCodes,
	  		    i, len;

	  		for (i = 0, len = codes.left.length; i < len; i++) {
	  			keys[codes.left[i]] = [-1 * panDelta, 0];
	  		}
	  		for (i = 0, len = codes.right.length; i < len; i++) {
	  			keys[codes.right[i]] = [panDelta, 0];
	  		}
	  		for (i = 0, len = codes.down.length; i < len; i++) {
	  			keys[codes.down[i]] = [0, panDelta];
	  		}
	  		for (i = 0, len = codes.up.length; i < len; i++) {
	  			keys[codes.up[i]] = [0, -1 * panDelta];
	  		}
	  	},

	  	_setZoomDelta: function (zoomDelta) {
	  		var keys = this._zoomKeys = {},
	  		    codes = this.keyCodes,
	  		    i, len;

	  		for (i = 0, len = codes.zoomIn.length; i < len; i++) {
	  			keys[codes.zoomIn[i]] = zoomDelta;
	  		}
	  		for (i = 0, len = codes.zoomOut.length; i < len; i++) {
	  			keys[codes.zoomOut[i]] = -zoomDelta;
	  		}
	  	},

	  	_addHooks: function () {
	  		on(document, 'keydown', this._onKeyDown, this);
	  	},

	  	_removeHooks: function () {
	  		off(document, 'keydown', this._onKeyDown, this);
	  	},

	  	_onKeyDown: function (e) {
	  		if (e.altKey || e.ctrlKey || e.metaKey) { return; }

	  		var key = e.keyCode,
	  		    map = this._map,
	  		    offset;

	  		if (key in this._panKeys) {
	  			if (!map._panAnim || !map._panAnim._inProgress) {
	  				offset = this._panKeys[key];
	  				if (e.shiftKey) {
	  					offset = toPoint(offset).multiplyBy(3);
	  				}

	  				map.panBy(offset);

	  				if (map.options.maxBounds) {
	  					map.panInsideBounds(map.options.maxBounds);
	  				}
	  			}
	  		} else if (key in this._zoomKeys) {
	  			map.setZoom(map.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[key]);

	  		} else if (key === 27 && map._popup && map._popup.options.closeOnEscapeKey) {
	  			map.closePopup();

	  		} else {
	  			return;
	  		}

	  		stop(e);
	  	}
	  });

	  // @section Handlers
	  // @section Handlers
	  // @property keyboard: Handler
	  // Keyboard navigation handler.
	  Map.addInitHook('addHandler', 'keyboard', Keyboard);

	  /*
	   * L.Handler.ScrollWheelZoom is used by L.Map to enable mouse scroll wheel zoom on the map.
	   */

	  // @namespace Map
	  // @section Interaction Options
	  Map.mergeOptions({
	  	// @section Mouse wheel options
	  	// @option scrollWheelZoom: Boolean|String = true
	  	// Whether the map can be zoomed by using the mouse wheel. If passed `'center'`,
	  	// it will zoom to the center of the view regardless of where the mouse was.
	  	scrollWheelZoom: true,

	  	// @option wheelDebounceTime: Number = 40
	  	// Limits the rate at which a wheel can fire (in milliseconds). By default
	  	// user can't zoom via wheel more often than once per 40 ms.
	  	wheelDebounceTime: 40,

	  	// @option wheelPxPerZoomLevel: Number = 60
	  	// How many scroll pixels (as reported by [L.DomEvent.getWheelDelta](#domevent-getwheeldelta))
	  	// mean a change of one full zoom level. Smaller values will make wheel-zooming
	  	// faster (and vice versa).
	  	wheelPxPerZoomLevel: 60
	  });

	  var ScrollWheelZoom = Handler.extend({
	  	addHooks: function () {
	  		on(this._map._container, 'wheel', this._onWheelScroll, this);

	  		this._delta = 0;
	  	},

	  	removeHooks: function () {
	  		off(this._map._container, 'wheel', this._onWheelScroll, this);
	  	},

	  	_onWheelScroll: function (e) {
	  		var delta = getWheelDelta(e);

	  		var debounce = this._map.options.wheelDebounceTime;

	  		this._delta += delta;
	  		this._lastMousePos = this._map.mouseEventToContainerPoint(e);

	  		if (!this._startTime) {
	  			this._startTime = +new Date();
	  		}

	  		var left = Math.max(debounce - (+new Date() - this._startTime), 0);

	  		clearTimeout(this._timer);
	  		this._timer = setTimeout(bind(this._performZoom, this), left);

	  		stop(e);
	  	},

	  	_performZoom: function () {
	  		var map = this._map,
	  		    zoom = map.getZoom(),
	  		    snap = this._map.options.zoomSnap || 0;

	  		map._stop(); // stop panning and fly animations if any

	  		// map the delta with a sigmoid function to -4..4 range leaning on -1..1
	  		var d2 = this._delta / (this._map.options.wheelPxPerZoomLevel * 4),
	  		    d3 = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(d2)))) / Math.LN2,
	  		    d4 = snap ? Math.ceil(d3 / snap) * snap : d3,
	  		    delta = map._limitZoom(zoom + (this._delta > 0 ? d4 : -d4)) - zoom;

	  		this._delta = 0;
	  		this._startTime = null;

	  		if (!delta) { return; }

	  		if (map.options.scrollWheelZoom === 'center') {
	  			map.setZoom(zoom + delta);
	  		} else {
	  			map.setZoomAround(this._lastMousePos, zoom + delta);
	  		}
	  	}
	  });

	  // @section Handlers
	  // @property scrollWheelZoom: Handler
	  // Scroll wheel zoom handler.
	  Map.addInitHook('addHandler', 'scrollWheelZoom', ScrollWheelZoom);

	  /*
	   * L.Map.Tap is used to enable mobile hacks like quick taps and long hold.
	   */

	  // @namespace Map
	  // @section Interaction Options
	  Map.mergeOptions({
	  	// @section Touch interaction options
	  	// @option tap: Boolean = true
	  	// Enables mobile hacks for supporting instant taps (fixing 200ms click
	  	// delay on iOS/Android) and touch holds (fired as `contextmenu` events).
	  	tap: true,

	  	// @option tapTolerance: Number = 15
	  	// The max number of pixels a user can shift his finger during touch
	  	// for it to be considered a valid tap.
	  	tapTolerance: 15
	  });

	  var Tap = Handler.extend({
	  	addHooks: function () {
	  		on(this._map._container, 'touchstart', this._onDown, this);
	  	},

	  	removeHooks: function () {
	  		off(this._map._container, 'touchstart', this._onDown, this);
	  	},

	  	_onDown: function (e) {
	  		if (!e.touches) { return; }

	  		preventDefault(e);

	  		this._fireClick = true;

	  		// don't simulate click or track longpress if more than 1 touch
	  		if (e.touches.length > 1) {
	  			this._fireClick = false;
	  			clearTimeout(this._holdTimeout);
	  			return;
	  		}

	  		var first = e.touches[0],
	  		    el = first.target;

	  		this._startPos = this._newPos = new Point(first.clientX, first.clientY);

	  		// if touching a link, highlight it
	  		if (el.tagName && el.tagName.toLowerCase() === 'a') {
	  			addClass(el, 'leaflet-active');
	  		}

	  		// simulate long hold but setting a timeout
	  		this._holdTimeout = setTimeout(bind(function () {
	  			if (this._isTapValid()) {
	  				this._fireClick = false;
	  				this._onUp();
	  				this._simulateEvent('contextmenu', first);
	  			}
	  		}, this), 1000);

	  		this._simulateEvent('mousedown', first);

	  		on(document, {
	  			touchmove: this._onMove,
	  			touchend: this._onUp
	  		}, this);
	  	},

	  	_onUp: function (e) {
	  		clearTimeout(this._holdTimeout);

	  		off(document, {
	  			touchmove: this._onMove,
	  			touchend: this._onUp
	  		}, this);

	  		if (this._fireClick && e && e.changedTouches) {

	  			var first = e.changedTouches[0],
	  			    el = first.target;

	  			if (el && el.tagName && el.tagName.toLowerCase() === 'a') {
	  				removeClass(el, 'leaflet-active');
	  			}

	  			this._simulateEvent('mouseup', first);

	  			// simulate click if the touch didn't move too much
	  			if (this._isTapValid()) {
	  				this._simulateEvent('click', first);
	  			}
	  		}
	  	},

	  	_isTapValid: function () {
	  		return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
	  	},

	  	_onMove: function (e) {
	  		var first = e.touches[0];
	  		this._newPos = new Point(first.clientX, first.clientY);
	  		this._simulateEvent('mousemove', first);
	  	},

	  	_simulateEvent: function (type, e) {
	  		var simulatedEvent = document.createEvent('MouseEvents');

	  		simulatedEvent._simulated = true;
	  		e.target._simulatedClick = true;

	  		simulatedEvent.initMouseEvent(
	  		        type, true, true, window, 1,
	  		        e.screenX, e.screenY,
	  		        e.clientX, e.clientY,
	  		        false, false, false, false, 0, null);

	  		e.target.dispatchEvent(simulatedEvent);
	  	}
	  });

	  // @section Handlers
	  // @property tap: Handler
	  // Mobile touch hacks (quick tap and touch hold) handler.
	  if (touch && (!pointer || safari)) {
	  	Map.addInitHook('addHandler', 'tap', Tap);
	  }

	  /*
	   * L.Handler.TouchZoom is used by L.Map to add pinch zoom on supported mobile browsers.
	   */

	  // @namespace Map
	  // @section Interaction Options
	  Map.mergeOptions({
	  	// @section Touch interaction options
	  	// @option touchZoom: Boolean|String = *
	  	// Whether the map can be zoomed by touch-dragging with two fingers. If
	  	// passed `'center'`, it will zoom to the center of the view regardless of
	  	// where the touch events (fingers) were. Enabled for touch-capable web
	  	// browsers except for old Androids.
	  	touchZoom: touch && !android23,

	  	// @option bounceAtZoomLimits: Boolean = true
	  	// Set it to false if you don't want the map to zoom beyond min/max zoom
	  	// and then bounce back when pinch-zooming.
	  	bounceAtZoomLimits: true
	  });

	  var TouchZoom = Handler.extend({
	  	addHooks: function () {
	  		addClass(this._map._container, 'leaflet-touch-zoom');
	  		on(this._map._container, 'touchstart', this._onTouchStart, this);
	  	},

	  	removeHooks: function () {
	  		removeClass(this._map._container, 'leaflet-touch-zoom');
	  		off(this._map._container, 'touchstart', this._onTouchStart, this);
	  	},

	  	_onTouchStart: function (e) {
	  		var map = this._map;
	  		if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) { return; }

	  		var p1 = map.mouseEventToContainerPoint(e.touches[0]),
	  		    p2 = map.mouseEventToContainerPoint(e.touches[1]);

	  		this._centerPoint = map.getSize()._divideBy(2);
	  		this._startLatLng = map.containerPointToLatLng(this._centerPoint);
	  		if (map.options.touchZoom !== 'center') {
	  			this._pinchStartLatLng = map.containerPointToLatLng(p1.add(p2)._divideBy(2));
	  		}

	  		this._startDist = p1.distanceTo(p2);
	  		this._startZoom = map.getZoom();

	  		this._moved = false;
	  		this._zooming = true;

	  		map._stop();

	  		on(document, 'touchmove', this._onTouchMove, this);
	  		on(document, 'touchend', this._onTouchEnd, this);

	  		preventDefault(e);
	  	},

	  	_onTouchMove: function (e) {
	  		if (!e.touches || e.touches.length !== 2 || !this._zooming) { return; }

	  		var map = this._map,
	  		    p1 = map.mouseEventToContainerPoint(e.touches[0]),
	  		    p2 = map.mouseEventToContainerPoint(e.touches[1]),
	  		    scale = p1.distanceTo(p2) / this._startDist;

	  		this._zoom = map.getScaleZoom(scale, this._startZoom);

	  		if (!map.options.bounceAtZoomLimits && (
	  			(this._zoom < map.getMinZoom() && scale < 1) ||
	  			(this._zoom > map.getMaxZoom() && scale > 1))) {
	  			this._zoom = map._limitZoom(this._zoom);
	  		}

	  		if (map.options.touchZoom === 'center') {
	  			this._center = this._startLatLng;
	  			if (scale === 1) { return; }
	  		} else {
	  			// Get delta from pinch to center, so centerLatLng is delta applied to initial pinchLatLng
	  			var delta = p1._add(p2)._divideBy(2)._subtract(this._centerPoint);
	  			if (scale === 1 && delta.x === 0 && delta.y === 0) { return; }
	  			this._center = map.unproject(map.project(this._pinchStartLatLng, this._zoom).subtract(delta), this._zoom);
	  		}

	  		if (!this._moved) {
	  			map._moveStart(true, false);
	  			this._moved = true;
	  		}

	  		cancelAnimFrame(this._animRequest);

	  		var moveFn = bind(map._move, map, this._center, this._zoom, {pinch: true, round: false});
	  		this._animRequest = requestAnimFrame(moveFn, this, true);

	  		preventDefault(e);
	  	},

	  	_onTouchEnd: function () {
	  		if (!this._moved || !this._zooming) {
	  			this._zooming = false;
	  			return;
	  		}

	  		this._zooming = false;
	  		cancelAnimFrame(this._animRequest);

	  		off(document, 'touchmove', this._onTouchMove, this);
	  		off(document, 'touchend', this._onTouchEnd, this);

	  		// Pinch updates GridLayers' levels only when zoomSnap is off, so zoomSnap becomes noUpdate.
	  		if (this._map.options.zoomAnimation) {
	  			this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), true, this._map.options.zoomSnap);
	  		} else {
	  			this._map._resetView(this._center, this._map._limitZoom(this._zoom));
	  		}
	  	}
	  });

	  // @section Handlers
	  // @property touchZoom: Handler
	  // Touch zoom handler.
	  Map.addInitHook('addHandler', 'touchZoom', TouchZoom);

	  Map.BoxZoom = BoxZoom;
	  Map.DoubleClickZoom = DoubleClickZoom;
	  Map.Drag = Drag;
	  Map.Keyboard = Keyboard;
	  Map.ScrollWheelZoom = ScrollWheelZoom;
	  Map.Tap = Tap;
	  Map.TouchZoom = TouchZoom;

	  exports.version = version;
	  exports.Control = Control;
	  exports.control = control;
	  exports.Browser = Browser;
	  exports.Evented = Evented;
	  exports.Mixin = Mixin;
	  exports.Util = Util;
	  exports.Class = Class;
	  exports.Handler = Handler;
	  exports.extend = extend;
	  exports.bind = bind;
	  exports.stamp = stamp;
	  exports.setOptions = setOptions;
	  exports.DomEvent = DomEvent;
	  exports.DomUtil = DomUtil;
	  exports.PosAnimation = PosAnimation;
	  exports.Draggable = Draggable;
	  exports.LineUtil = LineUtil;
	  exports.PolyUtil = PolyUtil;
	  exports.Point = Point;
	  exports.point = toPoint;
	  exports.Bounds = Bounds;
	  exports.bounds = toBounds;
	  exports.Transformation = Transformation;
	  exports.transformation = toTransformation;
	  exports.Projection = index;
	  exports.LatLng = LatLng;
	  exports.latLng = toLatLng;
	  exports.LatLngBounds = LatLngBounds;
	  exports.latLngBounds = toLatLngBounds;
	  exports.CRS = CRS;
	  exports.GeoJSON = GeoJSON;
	  exports.geoJSON = geoJSON;
	  exports.geoJson = geoJson;
	  exports.Layer = Layer;
	  exports.LayerGroup = LayerGroup;
	  exports.layerGroup = layerGroup;
	  exports.FeatureGroup = FeatureGroup;
	  exports.featureGroup = featureGroup;
	  exports.ImageOverlay = ImageOverlay;
	  exports.imageOverlay = imageOverlay;
	  exports.VideoOverlay = VideoOverlay;
	  exports.videoOverlay = videoOverlay;
	  exports.SVGOverlay = SVGOverlay;
	  exports.svgOverlay = svgOverlay;
	  exports.DivOverlay = DivOverlay;
	  exports.Popup = Popup;
	  exports.popup = popup;
	  exports.Tooltip = Tooltip;
	  exports.tooltip = tooltip;
	  exports.Icon = Icon;
	  exports.icon = icon;
	  exports.DivIcon = DivIcon;
	  exports.divIcon = divIcon;
	  exports.Marker = Marker;
	  exports.marker = marker;
	  exports.TileLayer = TileLayer;
	  exports.tileLayer = tileLayer;
	  exports.GridLayer = GridLayer;
	  exports.gridLayer = gridLayer;
	  exports.SVG = SVG;
	  exports.svg = svg$1;
	  exports.Renderer = Renderer;
	  exports.Canvas = Canvas;
	  exports.canvas = canvas$1;
	  exports.Path = Path;
	  exports.CircleMarker = CircleMarker;
	  exports.circleMarker = circleMarker;
	  exports.Circle = Circle;
	  exports.circle = circle;
	  exports.Polyline = Polyline;
	  exports.polyline = polyline;
	  exports.Polygon = Polygon;
	  exports.polygon = polygon;
	  exports.Rectangle = Rectangle;
	  exports.rectangle = rectangle;
	  exports.Map = Map;
	  exports.map = createMap;

	  var oldL = window.L;
	  exports.noConflict = function() {
	  	window.L = oldL;
	  	return this;
	  };

	  // Always export us to window global (see #2364)
	  window.L = exports;

	})));
	//# sourceMappingURL=leaflet-src.js.map
	});

	var arbres = [
		[
			6.6455191,
			46.7828399
		],
		[
			6.645151,
			46.7823663
		],
		[
			6.6453909,
			46.7826772
		],
		[
			6.6450192,
			46.7822061
		],
		[
			6.6452756,
			46.7825226
		],
		[
			6.6494323,
			46.7813657
		],
		[
			6.6487343,
			46.7808696
		],
		[
			6.6485238,
			46.7816779
		],
		[
			6.6481537,
			46.7818066
		],
		[
			6.6491989,
			46.780624
		],
		[
			6.6481966,
			46.7815029
		],
		[
			6.6486573,
			46.7807624
		],
		[
			6.6483517,
			46.7816475
		],
		[
			6.6492272,
			46.7811897
		],
		[
			6.6487924,
			46.7812297
		],
		[
			6.6477198,
			46.7814861
		],
		[
			6.6450713,
			46.7798657
		],
		[
			6.6455312,
			46.7797952
		],
		[
			6.6458667,
			46.7794886
		],
		[
			6.645527,
			46.7796337
		],
		[
			6.6456927,
			46.7795632
		],
		[
			6.6484258,
			46.7819796
		],
		[
			6.6483121,
			46.7820201
		],
		[
			6.6481653,
			46.7820737
		],
		[
			6.648048,
			46.782115
		],
		[
			6.6479059,
			46.7821702
		],
		[
			6.6477875,
			46.7822156
		],
		[
			6.6476619,
			46.7822635
		],
		[
			6.6475435,
			46.782304
		],
		[
			6.6474416,
			46.7823421
		],
		[
			6.6473113,
			46.7823908
		],
		[
			6.6468435,
			46.7825619
		],
		[
			6.6467097,
			46.782609
		],
		[
			6.6465829,
			46.7826528
		],
		[
			6.646455,
			46.7826998
		],
		[
			6.6463176,
			46.7827493
		],
		[
			6.646211,
			46.7827858
		],
		[
			6.6460973,
			46.7828304
		],
		[
			6.6459718,
			46.7828725
		],
		[
			6.6487954,
			46.781845
		],
		[
			6.6489138,
			46.7818028
		],
		[
			6.6490619,
			46.7817517
		],
		[
			6.6493177,
			46.7816552
		],
		[
			6.6494468,
			46.7816106
		],
		[
			6.6495688,
			46.7815651
		],
		[
			6.6496967,
			46.7815197
		],
		[
			6.6499869,
			46.7815749
		],
		[
			6.6497,
			46.7813287
		],
		[
			6.6451364,
			46.7790111
		],
		[
			6.6451926,
			46.7790628
		],
		[
			6.6474494,
			46.7814683
		],
		[
			6.6475075,
			46.7814467
		],
		[
			6.6474836,
			46.7814153
		],
		[
			6.6474238,
			46.7814347
		],
		[
			6.6475465,
			46.7815705
		],
		[
			6.6474477,
			46.7816083
		],
		[
			6.6475942,
			46.7814971
		],
		[
			6.6476148,
			46.7815268
		],
		[
			6.6476376,
			46.7815542
		],
		[
			6.6476552,
			46.7815783
		],
		[
			6.6477136,
			46.7816437
		],
		[
			6.6477349,
			46.7816684
		],
		[
			6.6477518,
			46.7816903
		],
		[
			6.6477749,
			46.7817169
		],
		[
			6.6478241,
			46.7817798
		],
		[
			6.6478407,
			46.7817992
		],
		[
			6.6478601,
			46.78182
		],
		[
			6.6478825,
			46.7818439
		],
		[
			6.6480298,
			46.7819164
		],
		[
			6.6480746,
			46.7819541
		],
		[
			6.6483938,
			46.781649
		],
		[
			6.6477441,
			46.7813402
		],
		[
			6.6478006,
			46.7813195
		],
		[
			6.6478568,
			46.7812982
		],
		[
			6.6477261,
			46.7813119
		],
		[
			6.6477776,
			46.7812901
		],
		[
			6.6450804,
			46.7826318
		],
		[
			6.645195,
			46.7827906
		],
		[
			6.6456091,
			46.7824973
		],
		[
			6.6451452,
			46.7827224
		],
		[
			6.6452519,
			46.7828606
		],
		[
			6.6452999,
			46.7829184
		],
		[
			6.649207,
			46.7811923
		],
		[
			6.6492837,
			46.781165
		],
		[
			6.6493113,
			46.7811319
		],
		[
			6.6493519,
			46.7812653
		],
		[
			6.6493008,
			46.7812591
		],
		[
			6.6487583,
			46.7809725
		],
		[
			6.6486403,
			46.7809702
		]
	];

	var type = "FeatureCollection";
	var generator = "overpass-ide";
	var copyright = "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.";
	var timestamp = "2021-04-23T12:15:43Z";
	var features = [
		{
			type: "Feature",
			properties: {
				"@id": "way/166320768",
				aerialway: "gondola",
				ele: "2555",
				name: "Plan Maison",
				public_transport: "station"
			},
			geometry: {
				type: "Polygon",
				coordinates: [
					[
						[
							7.6541119,
							45.9406905
						],
						[
							7.6541392,
							45.9406413
						],
						[
							7.6540658,
							45.9406236
						],
						[
							7.6541383,
							45.9405077
						],
						[
							7.6543276,
							45.9405712
						],
						[
							7.6544717,
							45.9405542
						],
						[
							7.6544773,
							45.9406027
						],
						[
							7.6547232,
							45.9406518
						],
						[
							7.6547241,
							45.9407147
						],
						[
							7.6547156,
							45.9408679
						],
						[
							7.6546205,
							45.9409819
						],
						[
							7.654305,
							45.9408699
						],
						[
							7.6542843,
							45.9408941
						],
						[
							7.6541903,
							45.9408572
						],
						[
							7.6541543,
							45.9408431
						],
						[
							7.6541766,
							45.9407957
						],
						[
							7.6542099,
							45.940754
						],
						[
							7.6541458,
							45.9407442
						],
						[
							7.6541119,
							45.9406905
						]
					]
				]
			},
			id: "way/166320768"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/166437927",
				aerialway: "gondola",
				building: "yes",
				public_transport: "station"
			},
			geometry: {
				type: "Polygon",
				coordinates: [
					[
						[
							7.6331807,
							45.9342051
						],
						[
							7.6332747,
							45.9340646
						],
						[
							7.6335057,
							45.9341433
						],
						[
							7.6338792,
							45.9342724
						],
						[
							7.6337795,
							45.934399
						],
						[
							7.6331807,
							45.9342051
						]
					]
				]
			},
			id: "way/166437927"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/233807949",
				aerialway: "gondola",
				building: "yes",
				name: "Bergstation Spielbodenbahn",
				source: "Bing"
			},
			geometry: {
				type: "Polygon",
				coordinates: [
					[
						[
							7.8996093,
							46.092028
						],
						[
							7.8994768,
							46.0920556
						],
						[
							7.8994697,
							46.0920391
						],
						[
							7.899395,
							46.0918662
						],
						[
							7.8995592,
							46.091832
						],
						[
							7.8999422,
							46.0919842
						],
						[
							7.8998327,
							46.0921168
						],
						[
							7.8998158,
							46.0921372
						],
						[
							7.8996781,
							46.0920824
						],
						[
							7.8996949,
							46.092062
						],
						[
							7.8996093,
							46.092028
						]
					]
				]
			},
			id: "way/233807949"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/269649097",
				aerialway: "gondola",
				building: "yes",
				construction_date: "22.12.1016",
				name: "Zwischenstation Spielbodenbahn",
				source: "Bing",
				year_of_construction: "2016"
			},
			geometry: {
				type: "Polygon",
				coordinates: [
					[
						[
							7.9203247,
							46.1002277
						],
						[
							7.9198785,
							46.1000336
						],
						[
							7.9198788,
							46.0999318
						],
						[
							7.9201993,
							46.0999459
						],
						[
							7.9201964,
							46.100009
						],
						[
							7.920431,
							46.1001072
						],
						[
							7.9203247,
							46.1002277
						]
					]
				]
			},
			id: "way/269649097"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/2573724",
				aerialway: "gondola",
				"aerialway:occupancy": "8",
				name: "Gondelbahn Oeschinensee"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.6827488,
						46.4975529
					],
					[
						7.6969711,
						46.5020573
					]
				]
			},
			id: "way/2573724"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/4380591",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				name: "Stoss - Leiterli"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.4289053,
						46.4404985
					],
					[
						7.4281642,
						46.4400638
					],
					[
						7.4261437,
						46.4388878
					],
					[
						7.4241375,
						46.4377201
					],
					[
						7.422354,
						46.436682
					],
					[
						7.4208256,
						46.4357924
					],
					[
						7.4185314,
						46.434457
					],
					[
						7.4158135,
						46.432875
					],
					[
						7.4138178,
						46.4317132
					],
					[
						7.4114525,
						46.4303363
					],
					[
						7.4095129,
						46.4292072
					],
					[
						7.4088953,
						46.4288477
					]
				]
			},
			id: "way/4380591"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/4866703",
				aerialway: "gondola",
				"aerialway:occupancy": "12",
				capacity: "12",
				name: "Télécabine du Fierney"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.0069356,
						46.2826283
					],
					[
						6.006639,
						46.2827364
					],
					[
						6.0064997,
						46.282788
					],
					[
						6.0057731,
						46.2830569
					],
					[
						6.0044497,
						46.2835466
					],
					[
						6.0034272,
						46.283925
					],
					[
						6.0012334,
						46.2847368
					],
					[
						5.9998335,
						46.2852548
					],
					[
						5.9985689,
						46.2857228
					],
					[
						5.9967012,
						46.2864139
					],
					[
						5.994852,
						46.2870982
					],
					[
						5.9941143,
						46.2873712
					],
					[
						5.9928248,
						46.2878483
					],
					[
						5.9907772,
						46.288606
					],
					[
						5.9885591,
						46.2894267
					],
					[
						5.9870958,
						46.2899682
					],
					[
						5.9856386,
						46.2905073
					],
					[
						5.9853819,
						46.2906023
					],
					[
						5.983606,
						46.2912594
					],
					[
						5.983458,
						46.2913142
					],
					[
						5.9829883,
						46.291488
					]
				]
			},
			id: "way/4866703"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/6272955",
				aerialway: "gondola",
				"aerialway:capacity": "2400",
				"aerialway:occupancy": "8",
				name: "Veysonnaz - Thyon",
				operator: "Téléveysonnaz",
				ref: "11"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.3429929,
						46.1955269
					],
					[
						7.3660104,
						46.180306
					]
				]
			},
			id: "way/6272955"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/8112443",
				aerialway: "gondola",
				"aerialway:capacity": "700",
				"aerialway:occupancy": "6",
				name: "Mörel - Ried Mörel - Riederalp",
				ref: "A2"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.0456424,
						46.3565758
					],
					[
						8.0454262,
						46.3566474
					],
					[
						8.0450007,
						46.3567883
					],
					[
						8.0432417,
						46.3573708
					],
					[
						8.0415266,
						46.3579388
					],
					[
						8.0388875,
						46.3588128
					],
					[
						8.0368271,
						46.3594951
					],
					[
						8.035177,
						46.3600415
					],
					[
						8.034703,
						46.3601985
					],
					[
						8.0345209,
						46.3605317
					],
					[
						8.0343459,
						46.360852
					],
					[
						8.033934,
						46.3616059
					],
					[
						8.0328197,
						46.3636451
					],
					[
						8.0323279,
						46.3645451
					],
					[
						8.0318102,
						46.3654925
					],
					[
						8.0306681,
						46.3675825
					],
					[
						8.030328,
						46.368205
					],
					[
						8.0295554,
						46.3696187
					],
					[
						8.0286542,
						46.3712677
					],
					[
						8.0276661,
						46.3730757
					],
					[
						8.0263848,
						46.3754202
					],
					[
						8.0260622,
						46.3759881
					]
				]
			},
			id: "way/8112443"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/19091762",
				aerialway: "gondola",
				name: "Télécabine de la Catheline"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						5.9437259,
						46.3042921
					],
					[
						5.9569623,
						46.2962665
					],
					[
						5.9605622,
						46.2940836
					],
					[
						5.9609017,
						46.2938777
					]
				]
			},
			id: "way/19091762"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/22337636",
				aerialway: "gondola",
				"aerialway:capacity": "2400",
				"aerialway:duration": "7.5",
				"aerialway:occupancy": "8",
				layer: "2",
				name: "Furi - Riffelberg",
				ref: "Q"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.732298,
						46.0013446
					],
					[
						7.7352235,
						46.0002733
					],
					[
						7.7470513,
						45.9958221
					],
					[
						7.7543078,
						45.9930911
					]
				]
			},
			id: "way/22337636"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/23037884",
				aerialway: "gondola",
				"aerialway:capacity": "100",
				"aerialway:occupancy": "12",
				name: "Caboche"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.6254394,
						45.8451662
					],
					[
						6.6252854,
						45.8449682
					],
					[
						6.6248088,
						45.8443899
					],
					[
						6.6240602,
						45.8435549
					],
					[
						6.6231951,
						45.8425673
					],
					[
						6.6224089,
						45.8416648
					],
					[
						6.6219663,
						45.8411559
					],
					[
						6.6210599,
						45.8401401
					],
					[
						6.6206869,
						45.8397122
					],
					[
						6.6201861,
						45.8391367
					],
					[
						6.6198264,
						45.8387198
					],
					[
						6.6183855,
						45.8370659
					],
					[
						6.6180059,
						45.8366309
					],
					[
						6.617907,
						45.8365133
					],
					[
						6.6175045,
						45.8360584
					],
					[
						6.6164443,
						45.834878
					],
					[
						6.6149634,
						45.8331818
					],
					[
						6.6146961,
						45.8328673
					],
					[
						6.6146272,
						45.8327909
					],
					[
						6.6144153,
						45.8325304
					]
				]
			},
			id: "way/23037884"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/23037888",
				aerialway: "gondola",
				"aerialway:capacity": "100",
				"aerialway:occupancy": "6",
				name: "Chamois"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.6180506,
						45.8556242
					],
					[
						6.6182581,
						45.8553135
					],
					[
						6.6187934,
						45.8545627
					],
					[
						6.6195932,
						45.8534453
					],
					[
						6.6200656,
						45.8527726
					],
					[
						6.6203054,
						45.8524341
					],
					[
						6.6213879,
						45.8508901
					],
					[
						6.6220622,
						45.8499335
					],
					[
						6.6223451,
						45.8495322
					],
					[
						6.6224501,
						45.8493854
					],
					[
						6.6234062,
						45.8480488
					],
					[
						6.6238768,
						45.8473778
					],
					[
						6.6244662,
						45.8465442
					],
					[
						6.6249589,
						45.8458461
					],
					[
						6.6252659,
						45.8453886
					]
				]
			},
			id: "way/23037888"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/23057527",
				aerialway: "gondola",
				name: "Mont d'Arbois"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.6322082,
						45.8534515
					],
					[
						6.6335082,
						45.8536714
					],
					[
						6.6352418,
						45.8539646
					],
					[
						6.6373502,
						45.8543212
					],
					[
						6.6395677,
						45.8546963
					],
					[
						6.6397229,
						45.8547225
					],
					[
						6.6405414,
						45.854861
					],
					[
						6.6418623,
						45.8550844
					],
					[
						6.6429228,
						45.8552761
					],
					[
						6.6452674,
						45.8556806
					],
					[
						6.6471747,
						45.8560009
					],
					[
						6.6496327,
						45.8563882
					],
					[
						6.6508009,
						45.8565969
					],
					[
						6.6523234,
						45.8568324
					],
					[
						6.6556025,
						45.8574115
					],
					[
						6.6557271,
						45.8574325
					],
					[
						6.6558771,
						45.857458
					],
					[
						6.6579527,
						45.8578093
					],
					[
						6.6600894,
						45.8581741
					],
					[
						6.6614701,
						45.8584027
					],
					[
						6.6620637,
						45.858501
					]
				]
			},
			id: "way/23057527"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/23057532",
				aerialway: "gondola",
				"aerialway:occupancy": "8",
				name: "Princesse"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.6507993,
						45.8724141
					],
					[
						6.6510189,
						45.8721462
					],
					[
						6.6510871,
						45.8720606
					],
					[
						6.6512055,
						45.8719421
					],
					[
						6.6516409,
						45.8714446
					],
					[
						6.6522322,
						45.8707508
					],
					[
						6.6537712,
						45.8688367
					],
					[
						6.6548295,
						45.8676077
					],
					[
						6.6557904,
						45.8664593
					],
					[
						6.6565748,
						45.8655261
					],
					[
						6.6583467,
						45.8634695
					],
					[
						6.6587756,
						45.8629459
					],
					[
						6.6591605,
						45.8624772
					],
					[
						6.659221,
						45.8624046
					],
					[
						6.6599372,
						45.8615642
					],
					[
						6.6610864,
						45.8602141
					],
					[
						6.6618558,
						45.8592947
					],
					[
						6.6619638,
						45.8591698
					],
					[
						6.6620648,
						45.8590468
					],
					[
						6.6622022,
						45.8588311
					]
				]
			},
			id: "way/23057532"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/23153686",
				aerialway: "gondola",
				"aerialway:capacity": "1400",
				"aerialway:duration": "6.25",
				"aerialway:occupancy": "8",
				name: "Chassoure",
				operator: "Téléverbier",
				ref: "119"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.3034941,
						46.1134799
					],
					[
						7.2997544,
						46.1121452
					],
					[
						7.279169,
						46.1040571
					]
				]
			},
			id: "way/23153686"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/23154704",
				aerialway: "gondola",
				"aerialway:capacity": "800",
				"aerialway:duration": "12.25",
				"aerialway:occupancy": "4",
				name: "Verbier - Savoleyres",
				operator: "Téléverbier",
				ref: "200"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.2248088,
						46.1037944
					],
					[
						7.2189456,
						46.1222701
					]
				]
			},
			id: "way/23154704"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/23154712",
				aerialway: "gondola",
				"aerialway:bubble": "yes",
				"aerialway:capacity": "1100",
				"aerialway:duration": "9",
				"aerialway:heating": "no",
				"aerialway:occupancy": "4",
				bicycle: "yes",
				name: "Le Châble - Verbier",
				operator: "Téléverbier",
				ref: "100",
				"safety:mask:covid19": "yes"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.2147897,
						46.0787259
					],
					[
						7.2155746,
						46.079355
					],
					[
						7.2157733,
						46.0795139
					],
					[
						7.217652,
						46.0810158
					],
					[
						7.2191489,
						46.0822126
					],
					[
						7.2201118,
						46.0829823
					],
					[
						7.220491,
						46.0832855
					],
					[
						7.2209207,
						46.083629
					],
					[
						7.2214579,
						46.0840584
					],
					[
						7.2224493,
						46.084851
					],
					[
						7.2233256,
						46.0855515
					],
					[
						7.2246636,
						46.0866211
					],
					[
						7.2265439,
						46.0881241
					],
					[
						7.2275146,
						46.0889001
					],
					[
						7.2315646,
						46.0921374
					],
					[
						7.232917,
						46.0932184
					],
					[
						7.2334061,
						46.0936093
					]
				]
			},
			id: "way/23154712"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/23154713",
				aerialway: "gondola",
				"aerialway:capacity": "1800",
				"aerialway:duration": "6.75",
				"aerialway:occupancy": "6",
				fixme: "Not wayed",
				name: "Médran I",
				operator: "Téléverbier",
				ref: "101",
				"safety:mask:covid19": "yes"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.2338038,
						46.093507
					],
					[
						7.2528677,
						46.0910874
					]
				]
			},
			id: "way/23154713"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/23186074",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				level: "1",
				name: "Charamillon"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.9472594,
						46.0039979
					],
					[
						6.9481889,
						46.0050836
					],
					[
						6.9497254,
						46.006878
					],
					[
						6.949924,
						46.0071099
					],
					[
						6.9500692,
						46.0072796
					],
					[
						6.950838,
						46.0081774
					],
					[
						6.9523586,
						46.0099532
					],
					[
						6.9541154,
						46.0120048
					],
					[
						6.9551266,
						46.0131856
					],
					[
						6.9551307,
						46.0131904
					],
					[
						6.9551784,
						46.0132462
					],
					[
						6.9554104,
						46.0135171
					],
					[
						6.9557566,
						46.0139213
					]
				]
			},
			id: "way/23186074"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/23266367",
				aerialway: "gondola",
				"aerialway:occupancy": "15",
				name: "Bochard"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.9429273,
						45.967985
					],
					[
						6.9450345,
						45.9479474
					]
				]
			},
			id: "way/23266367"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/23266459",
				aerialway: "gondola",
				"aerialway:capacity": "2480",
				"aerialway:occupancy": "8",
				name: "Dolonne"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.9638265,
						45.7925897
					],
					[
						6.9633215,
						45.7925613
					],
					[
						6.9622252,
						45.7924996
					],
					[
						6.9606598,
						45.7924116
					],
					[
						6.9594904,
						45.7923458
					],
					[
						6.9578431,
						45.7922532
					],
					[
						6.9555899,
						45.7921265
					],
					[
						6.9538201,
						45.792027
					],
					[
						6.9526151,
						45.7919592
					],
					[
						6.9524455,
						45.7919496
					],
					[
						6.9477789,
						45.7916872
					],
					[
						6.9471973,
						45.7916545
					]
				]
			},
			id: "way/23266459"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/23266529",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				layer: "1",
				name: "Checrouit"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.9434554,
						45.7904273
					],
					[
						6.9428068,
						45.790174
					],
					[
						6.9421582,
						45.7899206
					],
					[
						6.9405237,
						45.7892822
					],
					[
						6.9393277,
						45.7888151
					],
					[
						6.9374703,
						45.7880896
					],
					[
						6.936345,
						45.78765
					],
					[
						6.935961,
						45.7875
					],
					[
						6.9340523,
						45.7867545
					],
					[
						6.9328909,
						45.7863008
					],
					[
						6.9310707,
						45.7855898
					],
					[
						6.9293109,
						45.7849024
					],
					[
						6.9276398,
						45.7842496
					],
					[
						6.9259944,
						45.7836069
					],
					[
						6.9240263,
						45.7828381
					],
					[
						6.9235971,
						45.7826704
					]
				]
			},
			id: "way/23266529"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/23275859",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				name: "La Grande Terche"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.6414785,
						46.2261605
					],
					[
						6.6410551,
						46.2257201
					],
					[
						6.6403982,
						46.2249475
					],
					[
						6.6399548,
						46.2244287
					],
					[
						6.6393771,
						46.223756
					],
					[
						6.6387172,
						46.2229702
					],
					[
						6.6381263,
						46.2222725
					],
					[
						6.6375299,
						46.2215833
					],
					[
						6.6363055,
						46.2201553
					],
					[
						6.6359292,
						46.2197054
					],
					[
						6.6352223,
						46.2188797
					],
					[
						6.6315789,
						46.2148114
					]
				]
			},
			id: "way/23275859"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/23364268",
				aerialway: "gondola",
				"aerialway:bicycle": "yes",
				"aerialway:capacity": "2400",
				"aerialway:duration": "8.5",
				"aerialway:occupancy": "8",
				name: "Bettmeralp - Bettmerhorn",
				ref: "M"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.0643516,
						46.3922061
					],
					[
						8.0645295,
						46.3924587
					],
					[
						8.0649822,
						46.3931013
					],
					[
						8.0653497,
						46.3936229
					],
					[
						8.066437,
						46.3951663
					],
					[
						8.0672858,
						46.3963711
					],
					[
						8.0680203,
						46.3974136
					],
					[
						8.0691296,
						46.3989881
					],
					[
						8.0699143,
						46.4001019
					],
					[
						8.0710693,
						46.4017412
					],
					[
						8.0721635,
						46.403294
					],
					[
						8.0734033,
						46.4050535
					],
					[
						8.0744619,
						46.4065558
					],
					[
						8.0759423,
						46.4086567
					],
					[
						8.0767995,
						46.4098731
					],
					[
						8.0771147,
						46.4103303
					]
				]
			},
			id: "way/23364268"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/23575302",
				aerialway: "gondola",
				"aerialway:occupancy": "8",
				name: "Prarion"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.7817016,
						45.8946188
					],
					[
						6.7530913,
						45.8862367
					]
				]
			},
			id: "way/23575302"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/23663858",
				aerialway: "gondola",
				"aerialway:capacity": "600",
				"aerialway:length": "2468",
				"aerialway:occupancy": "4",
				name: "Barboleuse - Les Chaux",
				"seasonal:summer": "yes",
				"seasonal:winter": "yes",
				source: "Télé Villars-Gryon"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.0769021,
						46.2836968
					],
					[
						7.104709,
						46.2950751
					]
				]
			},
			id: "way/23663858"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/23713028",
				aerialway: "gondola",
				"aerialway:bubble": "no",
				"aerialway:capacity": "300",
				"aerialway:duration": "6.2",
				"aerialway:heating": "no",
				"aerialway:occupancy": "20",
				name: "Les Suches",
				note: "Costruttore: Agudio",
				oneway: "no"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.949164,
						45.7114319
					],
					[
						6.9425708,
						45.7025489
					],
					[
						6.9394683,
						45.6983684
					]
				]
			},
			id: "way/23713028"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/24898714",
				aerialway: "gondola",
				"aerialway:occupancy": "10",
				name: "Super-Châtel"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.8423985,
						46.2666962
					],
					[
						6.8574868,
						46.2676713
					]
				]
			},
			id: "way/24898714"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/25076686",
				aerialway: "gondola",
				"aerialway:capacity": "1200",
				"aerialway:occupancy": "6",
				name: "Firstbahn",
				ref: "2440"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.0417827,
						46.6250229
					],
					[
						8.041831,
						46.6253103
					],
					[
						8.0420181,
						46.626334
					],
					[
						8.0421765,
						46.6274856
					],
					[
						8.0423408,
						46.6286804
					],
					[
						8.0425419,
						46.630142
					],
					[
						8.0428317,
						46.632249
					],
					[
						8.0429799,
						46.6333262
					],
					[
						8.0430942,
						46.634157
					],
					[
						8.0431695,
						46.6346786
					],
					[
						8.0440517,
						46.6358898
					],
					[
						8.0450116,
						46.6372463
					],
					[
						8.0464181,
						46.6392338
					],
					[
						8.0471518,
						46.6402706
					],
					[
						8.0478251,
						46.641222
					],
					[
						8.0491374,
						46.6430763
					],
					[
						8.0496402,
						46.6437867
					],
					[
						8.0507165,
						46.6453075
					],
					[
						8.05142,
						46.6463015
					],
					[
						8.0517645,
						46.6467562
					],
					[
						8.0519695,
						46.6469588
					],
					[
						8.0521926,
						46.6471522
					],
					[
						8.0534877,
						46.6482751
					],
					[
						8.054278,
						46.6489603
					],
					[
						8.0559358,
						46.6503976
					],
					[
						8.0570983,
						46.6514054
					],
					[
						8.0579339,
						46.6521298
					],
					[
						8.0582619,
						46.6524142
					],
					[
						8.0587489,
						46.6528364
					],
					[
						8.0603992,
						46.6542671
					],
					[
						8.0610415,
						46.6548239
					],
					[
						8.0630097,
						46.6565301
					],
					[
						8.0643429,
						46.6576858
					],
					[
						8.0647254,
						46.6580173
					],
					[
						8.0650071,
						46.6582615
					],
					[
						8.0652644,
						46.6584938
					]
				]
			},
			id: "way/25076686"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/25277191",
				aerialway: "gondola",
				"aerialway:bubble": "no",
				"aerialway:capacity": "2000",
				"aerialway:duration": "6.37",
				"aerialway:heating": "no",
				"aerialway:occupancy": "10",
				name: "Flégère",
				oneway: "no"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.8853115,
						45.9416425
					],
					[
						6.8853296,
						45.9418425
					],
					[
						6.8853992,
						45.9426102
					],
					[
						6.8856421,
						45.9452912
					],
					[
						6.8858897,
						45.9480235
					],
					[
						6.8861154,
						45.9505151
					],
					[
						6.8862559,
						45.9520649
					],
					[
						6.88647,
						45.9544277
					],
					[
						6.8866404,
						45.956308
					],
					[
						6.8867649,
						45.9576823
					],
					[
						6.8868842,
						45.9589979
					],
					[
						6.8869809,
						45.9600653
					],
					[
						6.8870011,
						45.9602881
					]
				]
			},
			id: "way/25277191"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/25650667",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				name: "Gondelbahn Emmetten-Stockhütte",
				url: "http://www.klewenalp.ch/"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.5137113,
						46.9560865
					],
					[
						8.5135033,
						46.9558236
					],
					[
						8.5122594,
						46.9542507
					],
					[
						8.5103419,
						46.951826
					],
					[
						8.5099244,
						46.9512982
					],
					[
						8.5085326,
						46.9495383
					],
					[
						8.5066771,
						46.9471918
					],
					[
						8.5057729,
						46.9460483
					],
					[
						8.5053624,
						46.9455293
					],
					[
						8.5049165,
						46.9449653
					]
				]
			},
			id: "way/25650667"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/25790122",
				aerialway: "gondola",
				"aerialway:capacity": "1100",
				"aerialway:duration": "6",
				"aerialway:occupancy": "4",
				fixme: "Not wayed",
				name: "Médran II",
				operator: "Téléverbier",
				ref: "102",
				"safety:mask:covid19": "yes"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.2335907,
						46.0936237
					],
					[
						7.2366743,
						46.0932337
					],
					[
						7.2369002,
						46.0932051
					],
					[
						7.2444705,
						46.0922476
					],
					[
						7.2529016,
						46.0911811
					]
				]
			},
			id: "way/25790122"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/26584935",
				aerialway: "gondola",
				"aerialway:capacity": "2000",
				"aerialway:duration": "8",
				"aerialway:heating": "no",
				"aerialway:occupancy": "8",
				name: "Anzère - Intermédiaire - Pas de Maimbré",
				operator: "Télé Anzère SA",
				ref: "1"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.3948417,
						46.2953776
					],
					[
						7.3944186,
						46.2961772
					],
					[
						7.3937101,
						46.2974502
					],
					[
						7.3932364,
						46.2983504
					],
					[
						7.3924045,
						46.2998915
					],
					[
						7.3912556,
						46.3020532
					],
					[
						7.3905425,
						46.3033949
					],
					[
						7.3898078,
						46.3047772
					],
					[
						7.3891823,
						46.305979
					],
					[
						7.3890253,
						46.3063111
					],
					[
						7.3888736,
						46.3065968
					],
					[
						7.388814,
						46.3066921
					],
					[
						7.3887693,
						46.3067535
					],
					[
						7.3887308,
						46.3068086
					],
					[
						7.388698,
						46.3068614
					],
					[
						7.3884178,
						46.3073568
					],
					[
						7.3876072,
						46.3088793
					],
					[
						7.3871223,
						46.3097841
					],
					[
						7.3864188,
						46.3111088
					],
					[
						7.3860621,
						46.3118285
					],
					[
						7.3860325,
						46.3118829
					],
					[
						7.3859474,
						46.3120452
					]
				]
			},
			id: "way/26584935"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/26974485",
				aerialway: "gondola",
				"aerialway:occupancy": "15",
				name: "Gondelbahn Stöckalp-Melchsee-Frutt",
				ref: "A"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.2691708,
						46.7759146
					],
					[
						8.2694141,
						46.7765805
					],
					[
						8.2701607,
						46.7785458
					],
					[
						8.2705344,
						46.7795296
					],
					[
						8.271083,
						46.7809737
					],
					[
						8.2715388,
						46.7821734
					],
					[
						8.2723834,
						46.7843965
					],
					[
						8.2732364,
						46.7866417
					],
					[
						8.2739151,
						46.788428
					],
					[
						8.274527,
						46.7900385
					],
					[
						8.2755148,
						46.7926381
					],
					[
						8.2761335,
						46.7942663
					],
					[
						8.2766066,
						46.7955111
					],
					[
						8.2770278,
						46.7966196
					],
					[
						8.2770762,
						46.796747
					],
					[
						8.2777773,
						46.7985918
					],
					[
						8.2783351,
						46.8000595
					],
					[
						8.2788569,
						46.8014326
					],
					[
						8.2790217,
						46.8019204
					]
				]
			},
			id: "way/26974485"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/27255186",
				aerialway: "gondola",
				"aerialway:capacity": "1800",
				"aerialway:duration": "8.7",
				"aerialway:occupancy": "10",
				name: "Männlichenbahn",
				source: "survey"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.0185521,
						46.6246865
					],
					[
						8.0180854,
						46.6246445
					],
					[
						8.0170901,
						46.6245548
					],
					[
						8.0153129,
						46.6243948
					],
					[
						8.013355,
						46.6242185
					],
					[
						8.0116954,
						46.6240691
					],
					[
						8.0105754,
						46.6239682
					],
					[
						8.008942,
						46.623817
					],
					[
						8.007854,
						46.6237231
					],
					[
						8.0073957,
						46.6236819
					],
					[
						8.006998,
						46.6236461
					],
					[
						8.0047857,
						46.6234468
					],
					[
						8.002917,
						46.6232786
					],
					[
						8.0024865,
						46.6232398
					],
					[
						8.000346,
						46.623047
					],
					[
						7.9987367,
						46.6229021
					],
					[
						7.9969314,
						46.6227395
					],
					[
						7.9952594,
						46.622589
					],
					[
						7.9935613,
						46.6224361
					],
					[
						7.993108,
						46.6223952
					],
					[
						7.9925037,
						46.6223408
					],
					[
						7.9902042,
						46.6221338
					],
					[
						7.9886306,
						46.621992
					],
					[
						7.9866902,
						46.6218173
					],
					[
						7.9847677,
						46.6216442
					],
					[
						7.9827298,
						46.6214606
					],
					[
						7.9813278,
						46.6213344
					],
					[
						7.9799125,
						46.6212069
					],
					[
						7.9793146,
						46.6211531
					]
				]
			},
			id: "way/27255186"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/27517489",
				aerialway: "gondola",
				"aerialway:occupancy": "8",
				name: "Drehgondelbahn Stuckli Rondo"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.6345107,
						47.0784714
					],
					[
						8.6347155,
						47.0783252
					],
					[
						8.6357734,
						47.07757
					],
					[
						8.6370147,
						47.0766839
					],
					[
						8.638797,
						47.0754115
					],
					[
						8.641627,
						47.0733912
					],
					[
						8.6428515,
						47.0725169
					],
					[
						8.6452244,
						47.0708228
					],
					[
						8.6479663,
						47.0688652
					],
					[
						8.649315,
						47.0679022
					],
					[
						8.6498909,
						47.067491
					]
				]
			},
			id: "way/27517489"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/27776072",
				aerialway: "gondola",
				"aerialway:capacity": "900",
				"aerialway:duration": "10",
				"aerialway:occupancy": "6",
				layer: "1",
				name: "Weissensteinbahn",
				operator: "SWAG"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.4929721,
						47.2356171
					],
					[
						7.4940877,
						47.2363771
					],
					[
						7.4950195,
						47.2369881
					],
					[
						7.4971052,
						47.2383448
					],
					[
						7.4987639,
						47.2394324
					],
					[
						7.5007583,
						47.2407772
					],
					[
						7.5026415,
						47.24196
					],
					[
						7.5042668,
						47.2430256
					],
					[
						7.5046089,
						47.2432385
					],
					[
						7.5073167,
						47.2450225
					],
					[
						7.5078387,
						47.2453482
					],
					[
						7.5078416,
						47.2456153
					],
					[
						7.5078661,
						47.2460305
					],
					[
						7.5080167,
						47.2485034
					],
					[
						7.5080962,
						47.2495353
					],
					[
						7.5081476,
						47.2504359
					],
					[
						7.5082074,
						47.2515074
					],
					[
						7.5082314,
						47.2518803
					]
				]
			},
			id: "way/27776072"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/27869867",
				aerialway: "gondola",
				"aerialway:duration": "5",
				"aerialway:occupancy": "8",
				name: "Gondelbahn Reuti-Bidmi-Mägisalp"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.2089624,
						46.7330423
					],
					[
						8.2092054,
						46.7332995
					],
					[
						8.2092683,
						46.7333662
					],
					[
						8.2096332,
						46.7337525
					],
					[
						8.2101364,
						46.7342853
					],
					[
						8.2109496,
						46.7351462
					],
					[
						8.212353,
						46.736632
					],
					[
						8.2125565,
						46.7368475
					],
					[
						8.2131399,
						46.7374651
					],
					[
						8.2136258,
						46.7379795
					],
					[
						8.2141206,
						46.7385033
					],
					[
						8.2144635,
						46.7388663
					],
					[
						8.2156488,
						46.7401211
					],
					[
						8.2174902,
						46.7420705
					],
					[
						8.2183348,
						46.7429646
					],
					[
						8.2186402,
						46.7432879
					],
					[
						8.219163,
						46.7438413
					],
					[
						8.2196125,
						46.7443171
					]
				]
			},
			id: "way/27869867"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/28091606",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				name: "Flaschen - Torrentalp - Rinderhütte"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.6229148,
						46.3610154
					],
					[
						7.6238139,
						46.3610634
					],
					[
						7.6255801,
						46.3611585
					],
					[
						7.6270965,
						46.3612401
					],
					[
						7.6286034,
						46.3613212
					],
					[
						7.6306367,
						46.3614307
					],
					[
						7.6326409,
						46.3615386
					],
					[
						7.6340956,
						46.361617
					],
					[
						7.6343191,
						46.361629
					],
					[
						7.6351408,
						46.3616738
					],
					[
						7.6359534,
						46.3621054
					],
					[
						7.6366353,
						46.362469
					],
					[
						7.637885,
						46.3631354
					],
					[
						7.6391283,
						46.3637983
					],
					[
						7.64076,
						46.3646439
					],
					[
						7.6421628,
						46.3653857
					],
					[
						7.6437872,
						46.3662448
					],
					[
						7.6453538,
						46.3670732
					],
					[
						7.646762,
						46.3678179
					],
					[
						7.6478373,
						46.3683866
					],
					[
						7.6484102,
						46.3686895
					]
				]
			},
			id: "way/28091606"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/28147252",
				aerialway: "gondola",
				"aerialway:occupancy": "4",
				name: "Gondelbahn Kriens-Fräkmüntegg (Pilatusbahn)"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.2515389,
						46.9909124
					],
					[
						8.2533104,
						46.9942687
					],
					[
						8.2544269,
						46.9961928
					],
					[
						8.2551496,
						46.9975142
					],
					[
						8.255733,
						46.9985475
					],
					[
						8.2569669,
						47.0006699
					],
					[
						8.2581511,
						47.002746
					],
					[
						8.2591938,
						47.0046399
					],
					[
						8.2593723,
						47.0049779
					],
					[
						8.2600527,
						47.0061368
					],
					[
						8.2614455,
						47.008684
					],
					[
						8.2626948,
						47.0108819
					],
					[
						8.2629113,
						47.0112417
					],
					[
						8.2645616,
						47.0140779
					],
					[
						8.2648408,
						47.0144052
					],
					[
						8.2665729,
						47.0166374
					],
					[
						8.2682998,
						47.0186528
					],
					[
						8.2699237,
						47.0206711
					],
					[
						8.2704418,
						47.0213152
					],
					[
						8.273448,
						47.0249167
					],
					[
						8.2736418,
						47.025172
					],
					[
						8.2738616,
						47.0254806
					],
					[
						8.2779524,
						47.0304363
					]
				]
			},
			id: "way/28147252"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/28156424",
				aerialway: "gondola",
				"aerialway:bubble": "no",
				"aerialway:heating": "no",
				"aerialway:occupancy": "8",
				layer: "2",
				name: "TéléCharmey"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.168901,
						46.618623
					],
					[
						7.1697732,
						46.6187924
					],
					[
						7.171431,
						46.6191143
					],
					[
						7.1739149,
						46.6195965
					],
					[
						7.1750111,
						46.6198094
					],
					[
						7.1801427,
						46.6208058
					],
					[
						7.182076,
						46.6211811
					],
					[
						7.1838857,
						46.6215329
					],
					[
						7.1859946,
						46.6219422
					],
					[
						7.1872667,
						46.6221891
					],
					[
						7.1887073,
						46.6224687
					],
					[
						7.1895273,
						46.6226279
					],
					[
						7.19104,
						46.6229216
					],
					[
						7.194934,
						46.6236776
					],
					[
						7.197832,
						46.6242403
					],
					[
						7.1987992,
						46.6244281
					],
					[
						7.2018898,
						46.6250281
					],
					[
						7.2042082,
						46.6254782
					],
					[
						7.2050834,
						46.6256481
					],
					[
						7.2064822,
						46.6259197
					],
					[
						7.207073,
						46.6260344
					]
				]
			},
			id: "way/28156424"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/28770030",
				aerialway: "gondola",
				"aerialway:capacity": "1600",
				"aerialway:duration": "9",
				"aerialway:occupancy": "8",
				name: "La Tzoumaz - Savoleyres",
				operator: "Téléverbier",
				ref: "201"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.2330457,
						46.1447824
					],
					[
						7.2300778,
						46.1401229
					],
					[
						7.2261053,
						46.1338855
					],
					[
						7.225898,
						46.13356
					],
					[
						7.2254317,
						46.1328279
					],
					[
						7.2189856,
						46.122705
					]
				]
			},
			id: "way/28770030"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/29179617",
				aerialway: "gondola",
				name: "Ruelle"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.6410231,
						45.772772
					],
					[
						6.6532602,
						45.7776378
					]
				]
			},
			id: "way/29179617"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/29289978",
				aerialway: "gondola",
				"aerialway:bubble": "no",
				"aerialway:capacity": "2400",
				"aerialway:duration": "8",
				"aerialway:heating": "no",
				"aerialway:occupancy": "8",
				duration: "05:30 Min.",
				length: "1621",
				name: "Tracouet",
				oneway: "no",
				operator: "Télénendaz",
				ref: "50",
				year_of_construction: "2019"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.2911847,
						46.1798997
					],
					[
						7.2908719,
						46.1791878
					],
					[
						7.2902369,
						46.1777368
					],
					[
						7.2897133,
						46.1765716
					],
					[
						7.2891323,
						46.1752171
					],
					[
						7.2888093,
						46.1744786
					],
					[
						7.2885082,
						46.1737924
					],
					[
						7.2879279,
						46.172467
					],
					[
						7.2873038,
						46.17105
					],
					[
						7.2866226,
						46.1694993
					],
					[
						7.2862302,
						46.1686008
					],
					[
						7.2859511,
						46.1679624
					],
					[
						7.2858168,
						46.167653
					],
					[
						7.2853814,
						46.1666548
					],
					[
						7.2848266,
						46.1653866
					],
					[
						7.2841889,
						46.1639277
					],
					[
						7.2834701,
						46.162282
					],
					[
						7.2832702,
						46.1618373
					]
				]
			},
			id: "way/29289978"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/29376884",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				name: "Lenk - Stoss"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.4369734,
						46.4530126
					],
					[
						7.4289053,
						46.4404985
					]
				]
			},
			id: "way/29376884"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/29389400",
				aerialway: "gondola",
				"aerialway:occupancy": "4",
				name: "Gondelbahn Marbach - Marbachegg"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.8955099,
						46.8499991
					],
					[
						7.9061326,
						46.8351539
					]
				]
			},
			id: "way/29389400"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/29425131",
				aerialway: "gondola",
				"aerialway:capacity": "800",
				"aerialway:occupancy": "6",
				name: "Gondelbahn Rosswald"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.0256234,
						46.3139669
					],
					[
						8.0258189,
						46.3138447
					],
					[
						8.0258791,
						46.3138071
					],
					[
						8.027858,
						46.3125701
					],
					[
						8.0294976,
						46.3115453
					],
					[
						8.0313864,
						46.3103646
					],
					[
						8.0330792,
						46.3093065
					],
					[
						8.0345709,
						46.308374
					],
					[
						8.0358637,
						46.3075659
					],
					[
						8.0369486,
						46.3068877
					],
					[
						8.0385473,
						46.3058883
					],
					[
						8.0391719,
						46.3054978
					],
					[
						8.0401465,
						46.3048886
					],
					[
						8.0404533,
						46.3046968
					],
					[
						8.0409798,
						46.3043677
					]
				]
			},
			id: "way/29425131"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/29569916",
				aerialway: "gondola",
				"aerialway:capacity": "1800",
				"aerialway:diagonallength": "3070",
				"aerialway:duration": "12",
				"aerialway:occupancy": "6",
				brand: "von Roll",
				name: "Oey-Bergläger",
				ref: "C7",
				start_date: "1990"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.5468416,
						46.4821338
					],
					[
						7.5466787,
						46.4819606
					],
					[
						7.5466374,
						46.4819202
					],
					[
						7.5463774,
						46.481666
					],
					[
						7.5456014,
						46.4808685
					],
					[
						7.5448539,
						46.4801516
					],
					[
						7.5440289,
						46.4793605
					],
					[
						7.5433852,
						46.4787434
					],
					[
						7.5423106,
						46.4777132
					],
					[
						7.5412876,
						46.4767325
					],
					[
						7.5401115,
						46.475605
					],
					[
						7.5388188,
						46.4743656
					],
					[
						7.5375143,
						46.473115
					],
					[
						7.5374434,
						46.4730448
					],
					[
						7.5367105,
						46.4723418
					],
					[
						7.5360566,
						46.4717147
					],
					[
						7.5348034,
						46.4705128
					],
					[
						7.5336794,
						46.4694347
					],
					[
						7.5330436,
						46.4688248
					],
					[
						7.5327725,
						46.4685758
					]
				]
			},
			id: "way/29569916"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/29727631",
				aerialway: "gondola",
				"aerialway:capacity": "1800",
				"aerialway:occupancy": "8",
				name: "Crans-Merbé-Cry d'Er",
				ref: "A"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.4673134,
						46.3085835
					],
					[
						7.4724729,
						46.3241786
					],
					[
						7.4777522,
						46.3347378
					]
				]
			},
			id: "way/29727631"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/29919592",
				aerialway: "gondola",
				"aerialway:capacity": "2200",
				"aerialway:occupancy": "6",
				"aerialway:ref": "L",
				name: "Violettes Express"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.498532,
						46.32052
					],
					[
						7.4953,
						46.3257856
					],
					[
						7.4966397,
						46.3334802
					],
					[
						7.498191,
						46.342389
					]
				]
			},
			id: "way/29919592"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/29919593",
				aerialway: "gondola",
				"aerialway:capacity": "1600",
				"aerialway:duration": "10",
				"aerialway:occupancy": "30",
				name: "Funitel Violettes-Plaine Morte"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.4987685,
						46.3426777
					],
					[
						7.497946,
						46.3449795
					],
					[
						7.4974945,
						46.346243
					],
					[
						7.4964961,
						46.3490369
					],
					[
						7.494084,
						46.3557861
					],
					[
						7.4938157,
						46.3565368
					],
					[
						7.4905151,
						46.3657704
					],
					[
						7.488988,
						46.3700422
					]
				]
			},
			id: "way/29919593"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/30160814",
				aerialway: "gondola",
				"aerialway:capacity": "2000",
				"aerialway:duration": "7",
				"aerialway:occupancy": "10",
				name: "Téléphérique de Vercland",
				official_name: "TCD10"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.7005176,
						46.0717679
					],
					[
						6.7004943,
						46.0715989
					],
					[
						6.7003251,
						46.0703733
					],
					[
						6.7001057,
						46.0687836
					],
					[
						6.6998531,
						46.0669535
					],
					[
						6.6996349,
						46.0653721
					],
					[
						6.6990456,
						46.0611016
					],
					[
						6.6987115,
						46.0586805
					],
					[
						6.6983613,
						46.0561425
					],
					[
						6.698101,
						46.0542561
					],
					[
						6.6980464,
						46.0538603
					],
					[
						6.6980249,
						46.0537044
					],
					[
						6.6980039,
						46.0535526
					]
				]
			},
			id: "way/30160814"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/30160828",
				aerialway: "gondola",
				"aerialway:bubble": "yes",
				"aerialway:capacity": "2740",
				"aerialway:duration": "6",
				"aerialway:heating": "no",
				name: "Kedeuze",
				oneway: "no"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.6443657,
						46.0247003
					],
					[
						6.66526,
						46.026371
					]
				]
			},
			id: "way/30160828"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/30239947",
				aerialway: "gondola",
				"aerialway:capacity": "1715",
				"aerialway:occupancy": "8",
				name: "Beauregard"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.422272,
						45.9032234
					],
					[
						6.4067564,
						45.8939443
					]
				]
			},
			id: "way/30239947"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/30240765",
				aerialway: "gondola",
				"aerialway:capacity": "2160",
				"aerialway:occupancy": "10",
				name: "La Patinoire"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.4224113,
						45.9034015
					],
					[
						6.4226701,
						45.9033553
					],
					[
						6.4227791,
						45.9033378
					],
					[
						6.4229536,
						45.9033088
					],
					[
						6.4235246,
						45.9032112
					],
					[
						6.4257043,
						45.9028603
					],
					[
						6.4278169,
						45.902506
					],
					[
						6.4283462,
						45.9024039
					]
				]
			},
			id: "way/30240765"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/30246229",
				aerialway: "gondola",
				"aerialway:capacity": "1500",
				"aerialway:occupancy": "16",
				name: "Fernuy"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.4669458,
						45.9101
					],
					[
						6.4668731,
						45.9096085
					],
					[
						6.4668478,
						45.9094905
					],
					[
						6.4666644,
						45.9086348
					],
					[
						6.4663884,
						45.907347
					],
					[
						6.4660804,
						45.9059102
					],
					[
						6.4658299,
						45.9047417
					],
					[
						6.4655003,
						45.9032036
					],
					[
						6.4653761,
						45.9026239
					],
					[
						6.4649304,
						45.9005445
					],
					[
						6.4644704,
						45.8983981
					],
					[
						6.4639148,
						45.8958054
					],
					[
						6.4635488,
						45.8940974
					],
					[
						6.4633012,
						45.8929423
					],
					[
						6.4631595,
						45.8922807
					],
					[
						6.4629383,
						45.89156
					],
					[
						6.4629259,
						45.8915018
					],
					[
						6.4629134,
						45.8914435
					],
					[
						6.4628642,
						45.891214
					]
				]
			},
			id: "way/30246229"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/30246550",
				aerialway: "gondola",
				"aerialway:capacity": "2100",
				"aerialway:occupancy": "12",
				name: "La Balme"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.4675409,
						45.9100192
					],
					[
						6.4685852,
						45.9093016
					],
					[
						6.4691933,
						45.9088896
					],
					[
						6.4694074,
						45.9087405
					],
					[
						6.46958,
						45.9086204
					],
					[
						6.4707048,
						45.9078375
					],
					[
						6.4721062,
						45.906862
					],
					[
						6.472612,
						45.9065099
					],
					[
						6.4734878,
						45.9059002
					],
					[
						6.473522,
						45.9058764
					],
					[
						6.4736001,
						45.905822
					],
					[
						6.4744799,
						45.9052096
					],
					[
						6.4758603,
						45.9042487
					],
					[
						6.4768012,
						45.9035937
					],
					[
						6.4772064,
						45.9033116
					],
					[
						6.4773136,
						45.903237
					],
					[
						6.4773415,
						45.9032175
					],
					[
						6.4783213,
						45.9025355
					],
					[
						6.4792405,
						45.9018955
					],
					[
						6.4801069,
						45.9012924
					],
					[
						6.4807482,
						45.900846
					],
					[
						6.4807823,
						45.9008222
					],
					[
						6.4808165,
						45.9007984
					],
					[
						6.4812522,
						45.9004988
					]
				]
			},
			id: "way/30246550"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/30286610",
				aerialway: "gondola",
				"aerialway:capacity": "900",
				"aerialway:duration": "10",
				"aerialway:heating": "no",
				"aerialway:occupancy": "6",
				name: "Leysin - Berneuse"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.017398,
						46.347434
					],
					[
						7.0171742,
						46.3476222
					],
					[
						7.01667,
						46.3480462
					],
					[
						7.0162677,
						46.3483845
					],
					[
						7.0154628,
						46.3490614
					],
					[
						7.0142211,
						46.3501056
					],
					[
						7.0127133,
						46.3513673
					],
					[
						7.0119244,
						46.3520239
					],
					[
						7.0113698,
						46.3524854
					],
					[
						7.0101147,
						46.3535299
					],
					[
						7.0087373,
						46.354692
					],
					[
						7.00731,
						46.3559012
					],
					[
						7.0029321,
						46.3595072
					]
				]
			},
			id: "way/30286610"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/30323849",
				aerialway: "gondola",
				"aerialway:duration": "10",
				"aerialway:occupancy": "6",
				bicycle: "permissive",
				name: "Gondelbahn Wasserwendi-Lischen-Käserstatt"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.195042,
						46.7452248
					],
					[
						8.1969617,
						46.7462257
					],
					[
						8.1991346,
						46.7473585
					],
					[
						8.2001514,
						46.7478886
					],
					[
						8.2005697,
						46.7481067
					],
					[
						8.2019105,
						46.7488057
					],
					[
						8.2030246,
						46.7493864
					],
					[
						8.2055673,
						46.750712
					],
					[
						8.206165,
						46.7510236
					],
					[
						8.2063147,
						46.7511016
					],
					[
						8.2066756,
						46.7512898
					],
					[
						8.2069263,
						46.7514205
					],
					[
						8.2095749,
						46.7528011
					],
					[
						8.2111968,
						46.7536465
					],
					[
						8.2129324,
						46.7545513
					],
					[
						8.2148585,
						46.7555553
					],
					[
						8.2159406,
						46.7561194
					],
					[
						8.2167468,
						46.7565396
					],
					[
						8.2181436,
						46.7572676
					],
					[
						8.2186004,
						46.7575057
					],
					[
						8.2189269,
						46.7576759
					]
				]
			},
			id: "way/30323849"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/30323853",
				aerialway: "gondola",
				"aerialway:duration": "7",
				"aerialway:occupancy": "8",
				name: "Gondelbahn Mägisalp-Planplatten (Eagle-Express)"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.237392,
						46.7493033
					],
					[
						8.237637,
						46.7491629
					],
					[
						8.2376871,
						46.7491342
					],
					[
						8.2390636,
						46.7483454
					],
					[
						8.2395858,
						46.7480462
					],
					[
						8.2412639,
						46.7470846
					],
					[
						8.2422445,
						46.7465227
					],
					[
						8.2451031,
						46.7448845
					],
					[
						8.2467993,
						46.7439124
					],
					[
						8.2486917,
						46.7428279
					],
					[
						8.2512333,
						46.7413713
					],
					[
						8.2532163,
						46.7402348
					],
					[
						8.255338,
						46.7390188
					],
					[
						8.2567212,
						46.7382261
					],
					[
						8.2568281,
						46.7381648
					],
					[
						8.2572576,
						46.7379186
					]
				]
			},
			id: "way/30323853"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/30700972",
				aerialway: "gondola",
				"aerialway:occupancy": "2",
				name: "Télébenne"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.6958378,
						46.0045301
					],
					[
						6.6982149,
						46.0052324
					]
				]
			},
			id: "way/30700972"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/30749921",
				aerialway: "gondola",
				"aerialway:occupancy": "10",
				name: "Télécabine du Linga",
				source: "GPS"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.8213991,
						46.2542619
					],
					[
						6.8180585,
						46.2389936
					]
				]
			},
			id: "way/30749921"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/30752181",
				aerialway: "gondola",
				"aerialway:capacity": "580",
				"aerialway:occupancy": "10",
				layer: "1",
				name: "Télécabine du Pleney"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.6925855,
						46.1695975
					],
					[
						6.6956811,
						46.1729138
					],
					[
						6.6969055,
						46.1742822
					],
					[
						6.6983215,
						46.1758636
					],
					[
						6.6991389,
						46.1767749
					],
					[
						6.7019377,
						46.1799048
					]
				]
			},
			id: "way/30752181"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/30833737",
				aerialway: "gondola",
				"aerialway:capacity": "2400",
				"aerialway:occupancy": "12",
				layer: "1",
				name: "Salette",
				ref: "(d)"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.6239952,
						45.8882336
					],
					[
						7.6472901,
						45.8931471
					]
				]
			},
			id: "way/30833737"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/31153950",
				aerialway: "gondola",
				"aerialway:occupancy": "10",
				name: "Piste de l'Ours",
				operator: "Téléveysonnaz"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.3632098,
						46.1972711
					],
					[
						7.3670047,
						46.1898659
					],
					[
						7.3669598,
						46.1871542
					],
					[
						7.3668545,
						46.1801576
					]
				]
			},
			id: "way/31153950"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/31758294",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				name: "Saanenmöser - Saanenwald"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.3153382,
						46.5172595
					],
					[
						7.3154114,
						46.5170322
					],
					[
						7.315508,
						46.5167197
					],
					[
						7.3157545,
						46.5159262
					],
					[
						7.3159971,
						46.5151313
					],
					[
						7.316401,
						46.5138381
					],
					[
						7.3167764,
						46.5126409
					],
					[
						7.3171772,
						46.5113096
					],
					[
						7.3174352,
						46.5105075
					],
					[
						7.3175862,
						46.5100316
					]
				]
			},
			id: "way/31758294"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/31770794",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				name: "Télécabine de la Panthiaz"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.7997934,
						46.2911379
					],
					[
						6.8120723,
						46.3013315
					]
				]
			},
			id: "way/31770794"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/33002191",
				aerialway: "gondola",
				"aerialway:heating": "no",
				"aerialway:occupancy": "8",
				name: "Gondelbahn Saas-Grund - Kreuzboden"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.9385889,
						46.1281503
					],
					[
						7.9389294,
						46.1282869
					],
					[
						7.9402045,
						46.1287984
					],
					[
						7.9421388,
						46.1295744
					],
					[
						7.9427554,
						46.1298218
					],
					[
						7.9436321,
						46.1301735
					],
					[
						7.9460997,
						46.1311634
					],
					[
						7.947269,
						46.1316324
					],
					[
						7.9485029,
						46.1321274
					],
					[
						7.9517139,
						46.1334155
					],
					[
						7.9520966,
						46.133569
					],
					[
						7.9523825,
						46.1336837
					],
					[
						7.9530856,
						46.1339657
					],
					[
						7.9554511,
						46.1349146
					],
					[
						7.9587082,
						46.136221
					],
					[
						7.9602547,
						46.1368414
					],
					[
						7.9627107,
						46.1378265
					],
					[
						7.9635026,
						46.1381441
					],
					[
						7.9640111,
						46.1383481
					]
				]
			},
			id: "way/33002191"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/33041630",
				aerialway: "gondola",
				"aerialway:occupancy": "8",
				name: "Gondelbahn Kreuzboden - Hohsaas"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.9644031,
						46.1384315
					],
					[
						7.9651288,
						46.1384668
					],
					[
						7.968556,
						46.1386336
					],
					[
						7.9722173,
						46.1388117
					],
					[
						7.9732078,
						46.1388599
					],
					[
						7.975522,
						46.1389725
					],
					[
						7.9785782,
						46.1391212
					],
					[
						7.9789796,
						46.1391408
					],
					[
						7.9796461,
						46.1391732
					],
					[
						7.9822836,
						46.1393015
					],
					[
						7.9838057,
						46.1393756
					],
					[
						7.9855941,
						46.1394626
					],
					[
						7.989059,
						46.1396312
					],
					[
						7.9903938,
						46.1396961
					],
					[
						7.9908328,
						46.1397175
					],
					[
						7.990913,
						46.1397214
					]
				]
			},
			id: "way/33041630"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/33053550",
				aerialway: "gondola",
				"aerialway:bubble": "no",
				"aerialway:capacity": "2400",
				"aerialway:duration": "11",
				"aerialway:heating": "no",
				"aerialway:occupancy": "12",
				name: "Gabiet - Passo dei Salati",
				note: "Costruttore: Leitner",
				oneway: "no",
				ref: "25"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.8449054,
						45.8554893
					],
					[
						7.8456273,
						45.8561794
					],
					[
						7.8466625,
						45.8571495
					],
					[
						7.8476823,
						45.858105
					],
					[
						7.84896,
						45.8593022
					],
					[
						7.849689,
						45.8599853
					],
					[
						7.8505431,
						45.8607854
					],
					[
						7.8516862,
						45.8618565
					],
					[
						7.852931,
						45.8630227
					],
					[
						7.8540654,
						45.8640856
					],
					[
						7.855071,
						45.8650277
					],
					[
						7.855826,
						45.8657351
					],
					[
						7.856369,
						45.8662437
					],
					[
						7.8575386,
						45.8673395
					],
					[
						7.8586186,
						45.8683513
					],
					[
						7.8599488,
						45.8695974
					],
					[
						7.8611305,
						45.8707043
					],
					[
						7.8619357,
						45.8714587
					],
					[
						7.8629527,
						45.8724114
					],
					[
						7.8635781,
						45.8729972
					],
					[
						7.8651463,
						45.8744661
					],
					[
						7.865948,
						45.8752171
					],
					[
						7.8667269,
						45.8759467
					],
					[
						7.8673377,
						45.8765188
					],
					[
						7.8673786,
						45.8765571
					],
					[
						7.8677266,
						45.8768831
					]
				]
			},
			id: "way/33053550"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/33053558",
				aerialway: "gondola",
				"aerialway:bubble": "no",
				"aerialway:capacity": "1400",
				"aerialway:duration": "11",
				"aerialway:heating": "no",
				"aerialway:occupancy": "8",
				name: "Alagna - Pianalunga",
				note: "Costruttore: Doppelmayr",
				oneway: "no",
				source: "GPS"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.9351294,
						45.8532948
					],
					[
						7.9344111,
						45.8535698
					],
					[
						7.9328634,
						45.8541623
					],
					[
						7.9314423,
						45.8547063
					],
					[
						7.9303977,
						45.8551062
					],
					[
						7.9277906,
						45.8561042
					],
					[
						7.9261863,
						45.8567183
					],
					[
						7.9232455,
						45.8578441
					],
					[
						7.9224828,
						45.858136
					],
					[
						7.9221788,
						45.8582524
					],
					[
						7.9199582,
						45.8591024
					],
					[
						7.9178196,
						45.859921
					],
					[
						7.9165125,
						45.8604214
					],
					[
						7.9148892,
						45.8610427
					],
					[
						7.9137063,
						45.8614955
					],
					[
						7.9104319,
						45.8627488
					],
					[
						7.9081193,
						45.863634
					],
					[
						7.9062612,
						45.8643452
					],
					[
						7.9032927,
						45.8654814
					]
				]
			},
			id: "way/33053558"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/33053598",
				aerialway: "gondola",
				"aerialway:bubble": "no",
				"aerialway:capacity": "2800",
				"aerialway:duration": "5",
				"aerialway:heating": "no",
				"aerialway:occupancy": "8",
				name: "Crest - Alpe Ostafa III",
				note: "Costruttore: Leitner",
				oneway: "yes",
				ref: "11",
				source: "GPS"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.7442473,
						45.8327233
					],
					[
						7.7613801,
						45.8345535
					]
				]
			},
			id: "way/33053598"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/33206839",
				aerialway: "gondola",
				"aerialway:capacity": "1840",
				"aerialway:duration": "5.667",
				"aerialway:occupancy": "12",
				name: "Grimentz - Bendolla",
				opening_hours: "09:00-16:30"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.5735019,
						46.1762105
					],
					[
						7.5727285,
						46.1764303
					],
					[
						7.5713099,
						46.1768335
					],
					[
						7.5693415,
						46.177393
					],
					[
						7.5673565,
						46.1779572
					],
					[
						7.5656974,
						46.1784287
					],
					[
						7.5649002,
						46.1786553
					],
					[
						7.5644586,
						46.1787808
					],
					[
						7.5628378,
						46.1792414
					],
					[
						7.5610959,
						46.1797365
					],
					[
						7.559357,
						46.1802307
					],
					[
						7.55889,
						46.1803634
					],
					[
						7.5579562,
						46.1806288
					]
				]
			},
			id: "way/33206839"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/34131067",
				aerialway: "gondola",
				"aerialway:bubble": "no",
				"aerialway:capacity": "2400",
				"aerialway:duration": "7.5",
				"aerialway:heating": "no",
				"aerialway:height_difference": "300m",
				"aerialway:length": "768m",
				"aerialway:max_speed": "10mps",
				"aerialway:occupancy": "8",
				name: "Stafal - Gabiet",
				note: "Costruttore: Leitner",
				oneway: "no",
				ref: "20",
				source: "GPS",
				"source:data": "data plate at base station"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.8119897,
						45.8578754
					],
					[
						7.813459,
						45.8577741
					],
					[
						7.8147758,
						45.8576833
					],
					[
						7.8170437,
						45.8575269
					],
					[
						7.8197894,
						45.8573376
					],
					[
						7.823847,
						45.8570579
					],
					[
						7.8252974,
						45.8569578
					],
					[
						7.8272543,
						45.8568229
					],
					[
						7.8298005,
						45.8566474
					],
					[
						7.8320526,
						45.8564921
					],
					[
						7.8340105,
						45.8563571
					],
					[
						7.8396097,
						45.855971
					],
					[
						7.8412345,
						45.855859
					],
					[
						7.8423305,
						45.8557834
					],
					[
						7.8439517,
						45.8556716
					],
					[
						7.8444715,
						45.8556358
					]
				]
			},
			id: "way/34131067"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/34560089",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				name: "Eggweid - Rinderberg",
				ref: "B2"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.3633252,
						46.5259618
					],
					[
						7.3632705,
						46.5254652
					],
					[
						7.3632298,
						46.5253071
					],
					[
						7.3613653,
						46.5190249
					],
					[
						7.3612626,
						46.5186788
					],
					[
						7.3609778,
						46.5177191
					],
					[
						7.3605591,
						46.5163082
					],
					[
						7.360321,
						46.5155059
					],
					[
						7.3600947,
						46.5147434
					],
					[
						7.3595939,
						46.5130558
					],
					[
						7.3593941,
						46.5123826
					],
					[
						7.35824,
						46.508493
					]
				]
			},
			id: "way/34560089"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/36113788",
				aerialway: "gondola",
				name: "Télécabine du Jaillet"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.6179633,
						45.8647216
					],
					[
						6.6171507,
						45.8649418
					],
					[
						6.6163525,
						45.8651679
					],
					[
						6.6146894,
						45.8656283
					],
					[
						6.6133689,
						45.8659815
					],
					[
						6.6130709,
						45.8660559
					],
					[
						6.612616,
						45.8661843
					],
					[
						6.6111407,
						45.8665762
					],
					[
						6.6101831,
						45.8668324
					],
					[
						6.6088418,
						45.8671844
					],
					[
						6.6068602,
						45.8677218
					],
					[
						6.6053268,
						45.8681606
					],
					[
						6.6037024,
						45.8686112
					],
					[
						6.6019028,
						45.8691133
					],
					[
						6.6003171,
						45.8695428
					],
					[
						6.6000721,
						45.8696186
					]
				]
			},
			id: "way/36113788"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/37281908",
				aerialway: "gondola",
				"aerialway:occupancy": "8",
				name: "Vallorcine - Posettes"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.9331894,
						46.0334499
					],
					[
						6.9494945,
						46.0297301
					]
				]
			},
			id: "way/37281908"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/39523532",
				aerialway: "gondola",
				"aerialway:occupancy": "4",
				name: "Les Marécottes - La Creusaz",
				operator: "TéléMarécottes",
				ref: "V",
				source: "camptocamp.org"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.0064559,
						46.1112353
					],
					[
						6.9943674,
						46.1184474
					]
				]
			},
			id: "way/39523532"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/39807163",
				aerialway: "gondola",
				name: "Funivie del Lago Maggiore",
				website: "http://www.funiviedellagomaggiore.it",
				wikipedia: "it:Cestovia Laveno-Poggio Sant'Elsa"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.6209233,
						45.9122296
					],
					[
						8.6211777,
						45.9122135
					],
					[
						8.6217511,
						45.9121765
					],
					[
						8.6222359,
						45.912146
					],
					[
						8.6249956,
						45.9119682
					],
					[
						8.6289584,
						45.9117391
					],
					[
						8.6294174,
						45.9117125
					],
					[
						8.6304796,
						45.9116359
					],
					[
						8.6338204,
						45.9114239
					],
					[
						8.6368203,
						45.9111937
					],
					[
						8.6371382,
						45.9111661
					]
				]
			},
			id: "way/39807163"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/40842199",
				aerialway: "gondola",
				"aerialway:heating": "no",
				"aerialway:occupancy": "20",
				alt_name: "DMC du Bettex",
				name: "Télécabine du Bettex"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.70739,
						45.89019
					],
					[
						6.7071658,
						45.8900294
					],
					[
						6.7063089,
						45.8894159
					],
					[
						6.7031886,
						45.8871814
					],
					[
						6.7006857,
						45.8853891
					],
					[
						6.6961238,
						45.8821221
					],
					[
						6.6941941,
						45.8807401
					],
					[
						6.6920517,
						45.8792058
					],
					[
						6.6898372,
						45.8776197
					],
					[
						6.6877483,
						45.8761236
					],
					[
						6.6863533,
						45.8751244
					],
					[
						6.6857846,
						45.8747673
					]
				]
			},
			id: "way/40842199"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/40842200",
				aerialway: "gondola",
				name: "Princesse"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.6411312,
						45.8800957
					],
					[
						6.6419714,
						45.8794123
					],
					[
						6.643179,
						45.8784472
					],
					[
						6.6445551,
						45.8773458
					],
					[
						6.6455941,
						45.876544
					],
					[
						6.6465631,
						45.8757828
					],
					[
						6.6477393,
						45.8748535
					],
					[
						6.6494934,
						45.8734532
					],
					[
						6.6505349,
						45.8726493
					],
					[
						6.6507993,
						45.8724141
					]
				]
			},
			id: "way/40842200"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/40842204",
				aerialway: "gondola",
				"aerialway:occupancy": "12",
				name: "Bettex - Arbois"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.6854748,
						45.8748922
					],
					[
						6.6848911,
						45.8741904
					],
					[
						6.6840881,
						45.8732232
					],
					[
						6.6834798,
						45.8724898
					],
					[
						6.6828226,
						45.871714
					],
					[
						6.6824239,
						45.871231
					],
					[
						6.6820114,
						45.8707231
					],
					[
						6.6814281,
						45.8700116
					],
					[
						6.6802894,
						45.8686315
					],
					[
						6.6791547,
						45.8672908
					],
					[
						6.6790179,
						45.8671187
					],
					[
						6.6787946,
						45.8668483
					],
					[
						6.6781042,
						45.8660107
					],
					[
						6.6777591,
						45.8655963
					],
					[
						6.6766273,
						45.8642425
					],
					[
						6.6763914,
						45.8639617
					],
					[
						6.6756504,
						45.8630816
					],
					[
						6.6742426,
						45.8613371
					],
					[
						6.6741817,
						45.8612664
					],
					[
						6.6741091,
						45.8611675
					],
					[
						6.6740158,
						45.8610621
					],
					[
						6.6733461,
						45.860204
					],
					[
						6.6726899,
						45.8594112
					],
					[
						6.6725908,
						45.8592793
					],
					[
						6.6725086,
						45.8591854
					],
					[
						6.6723704,
						45.8590167
					],
					[
						6.6715933,
						45.8580841
					],
					[
						6.6712136,
						45.8576273
					],
					[
						6.6698778,
						45.8559926
					],
					[
						6.6695947,
						45.8556563
					],
					[
						6.6695427,
						45.8555924
					],
					[
						6.6692758,
						45.8552567
					]
				]
			},
			id: "way/40842204"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/44411986",
				aerialway: "gondola",
				"aerialway:bubble": "no",
				"aerialway:capacity": "2400",
				"aerialway:duration": "11",
				"aerialway:heating": "no",
				"aerialway:occupancy": "8",
				layer: "1",
				name: "Aosta - Les Fleurs",
				note: "Costruttore: Leitner",
				oneway: "no"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.3192552,
						45.7319221
					],
					[
						7.3191263,
						45.7314299
					],
					[
						7.3190865,
						45.7312779
					],
					[
						7.3190005,
						45.7309495
					],
					[
						7.3188897,
						45.7305261
					],
					[
						7.3187295,
						45.7299146
					],
					[
						7.3185994,
						45.7294177
					],
					[
						7.3183138,
						45.7283267
					],
					[
						7.3181764,
						45.7278022
					],
					[
						7.3178619,
						45.726601
					],
					[
						7.3175186,
						45.7252964
					],
					[
						7.3172236,
						45.7241672
					],
					[
						7.3170054,
						45.7233322
					],
					[
						7.3166692,
						45.7220597
					],
					[
						7.3162551,
						45.7205871
					],
					[
						7.3159047,
						45.7191366
					],
					[
						7.3155331,
						45.7177899
					],
					[
						7.3154021,
						45.7173303
					],
					[
						7.3150411,
						45.7159712
					],
					[
						7.3149957,
						45.715802
					],
					[
						7.3149042,
						45.7154608
					],
					[
						7.3146597,
						45.7145487
					],
					[
						7.3142519,
						45.7129995
					],
					[
						7.3141191,
						45.7124813
					],
					[
						7.313748,
						45.7110994
					],
					[
						7.3135929,
						45.7105401
					],
					[
						7.3134382,
						45.7099837
					],
					[
						7.3132239,
						45.7091673
					],
					[
						7.312916,
						45.7079939
					],
					[
						7.3126138,
						45.7068475
					],
					[
						7.3123831,
						45.7059831
					],
					[
						7.3118708,
						45.7039517
					],
					[
						7.3116898,
						45.7032989
					],
					[
						7.3116682,
						45.7032241
					],
					[
						7.3115423,
						45.7027884
					]
				]
			},
			id: "way/44411986"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/46715051",
				aerialway: "gondola",
				"aerialway:capacity": "2800",
				"aerialway:duration": "6.8",
				"aerialway:occupancy": "8",
				name: "Matterhorn Express"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.7319625,
						46.0016707
					],
					[
						7.7194012,
						45.9964464
					],
					[
						7.7089476,
						45.9921248
					],
					[
						7.7089208,
						45.9920763
					]
				]
			},
			id: "way/46715051"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/47199730",
				aerialway: "gondola",
				"aerialway:capacity": "2000",
				"aerialway:length": "2050",
				"aerialway:occupancy": "8",
				name: "Villars - Roc d'Orsay",
				"seasonal:summer": "yes",
				"seasonal:winter": "yes",
				source: "Télé Villars-Gryon"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.0638476,
						46.3220721
					],
					[
						7.0554973,
						46.3047495
					],
					[
						7.0549611,
						46.3036371
					]
				]
			},
			id: "way/47199730"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/48477695",
				aerialway: "gondola",
				"aerialway:occupancy": "15",
				name: "Gandegg-Hockenhorngrat"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.7580175,
						46.4258039
					],
					[
						7.7570643,
						46.4261837
					],
					[
						7.7478379,
						46.429635
					]
				]
			},
			id: "way/48477695"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/49023748",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				name: "Gondelbahn Rossweid"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.0339364,
						46.8207719
					],
					[
						8.0271498,
						46.8089074
					]
				]
			},
			id: "way/49023748"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/49070881",
				aerialway: "gondola",
				"aerialway:occupancy": "8",
				name: "La Videmanette",
				ref: "L1"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.2085311,
						46.4857453
					],
					[
						7.2084086,
						46.4850722
					],
					[
						7.2081979,
						46.4837777
					],
					[
						7.2079404,
						46.4821744
					],
					[
						7.2076118,
						46.4803145
					],
					[
						7.2073093,
						46.4784356
					],
					[
						7.206903,
						46.476078
					],
					[
						7.2065421,
						46.4739869
					],
					[
						7.2064766,
						46.4733889
					],
					[
						7.2061991,
						46.4711734
					],
					[
						7.2059174,
						46.4690456
					],
					[
						7.2057056,
						46.4673123
					],
					[
						7.2053333,
						46.4650741
					],
					[
						7.2052986,
						46.4648364
					],
					[
						7.2049525,
						46.4622084
					],
					[
						7.2046554,
						46.4598633
					]
				]
			},
			id: "way/49070881"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/49511436",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				name: "Télécabine du Mont Chéry"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.6697611,
						46.1607738
					],
					[
						6.6694443,
						46.1609025
					],
					[
						6.6687534,
						46.161183
					],
					[
						6.6676562,
						46.1616591
					],
					[
						6.6660793,
						46.1623233
					],
					[
						6.664015,
						46.163195
					],
					[
						6.6598701,
						46.1649392
					],
					[
						6.6586983,
						46.1654621
					]
				]
			},
			id: "way/49511436"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/49685031",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				name: "Zweisimmen - Eggweid",
				ref: "B1"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.3744297,
						46.5510265
					],
					[
						7.3742327,
						46.5505823
					],
					[
						7.3739813,
						46.5500349
					],
					[
						7.3734373,
						46.5488075
					],
					[
						7.3729806,
						46.5477772
					],
					[
						7.3724939,
						46.5466792
					],
					[
						7.3718324,
						46.5451865
					],
					[
						7.3715081,
						46.5444548
					],
					[
						7.3710531,
						46.5434282
					],
					[
						7.3706696,
						46.5425628
					],
					[
						7.3702346,
						46.5415813
					],
					[
						7.3700245,
						46.5411072
					],
					[
						7.3696562,
						46.5402761
					],
					[
						7.3690664,
						46.5389452
					],
					[
						7.3688,
						46.5383403
					],
					[
						7.3680028,
						46.5365492
					],
					[
						7.3673855,
						46.5351586
					],
					[
						7.3668895,
						46.5340411
					],
					[
						7.3666976,
						46.5336088
					],
					[
						7.3664948,
						46.5331518
					],
					[
						7.3656354,
						46.531186
					],
					[
						7.3653405,
						46.5305178
					],
					[
						7.3646466,
						46.528974
					],
					[
						7.3641863,
						46.5279421
					],
					[
						7.3636103,
						46.5266429
					],
					[
						7.3633252,
						46.5259618
					]
				]
			},
			id: "way/49685031"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/50563219",
				aerialway: "gondola",
				"aerialway:occupancy": "30",
				name: "Alpin Express II",
				ref: "G"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.917569,
						46.0816376
					],
					[
						7.9174409,
						46.0808716
					],
					[
						7.9169186,
						46.0777472
					],
					[
						7.9154009,
						46.0689896
					],
					[
						7.9153433,
						46.0686047
					]
				]
			},
			id: "way/50563219"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/50759246",
				aerialway: "gondola",
				"aerialway:capacity": "2000",
				"aerialway:duration": "6.3",
				"aerialway:occupancy": "8",
				name: "Grächen - Hannigalp",
				oneway: "no",
				source: "https://m.imgur.com/gallery/KgiAvp0"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.8415978,
						46.1966661
					],
					[
						7.8418484,
						46.1967622
					],
					[
						7.8437204,
						46.1974802
					],
					[
						7.8453023,
						46.198087
					],
					[
						7.8478645,
						46.1990697
					],
					[
						7.8493096,
						46.199624
					],
					[
						7.8511937,
						46.2003466
					],
					[
						7.8534036,
						46.2011942
					],
					[
						7.8551276,
						46.2018554
					],
					[
						7.8572724,
						46.202678
					],
					[
						7.8593141,
						46.2034611
					],
					[
						7.8612692,
						46.2042109
					],
					[
						7.863624,
						46.205114
					],
					[
						7.8655291,
						46.2058446
					],
					[
						7.8665354,
						46.2062305
					],
					[
						7.866951,
						46.2063899
					],
					[
						7.8672253,
						46.2064951
					]
				]
			},
			id: "way/50759246"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/50855155",
				aerialway: "gondola",
				"aerialway:capacity": "1400",
				"aerialway:occupancy": "10",
				construction_date: "22.12.2016",
				name: "Spielboden 1. Sektion",
				ref: "T",
				year_of_construction: "2016"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.9260197,
						46.1023634
					],
					[
						7.9201572,
						46.1000804
					]
				]
			},
			id: "way/50855155"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/50855158",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				name: "Plattjen",
				ref: "A"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.9263335,
						46.1025054
					],
					[
						7.9430361,
						46.0906179
					]
				]
			},
			id: "way/50855158"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/53165460",
				aerialway: "gondola",
				layer: "1",
				name: "Télécabine Super Morzine",
				source: "cadastre-dgi-fr source : Direction Générale des Impôts - Cadastre. Mise à jour : 2010"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.7177974,
						46.1911125
					],
					[
						6.7173269,
						46.1908271
					],
					[
						6.7159942,
						46.1901197
					],
					[
						6.7145247,
						46.1893426
					],
					[
						6.7129479,
						46.188501
					],
					[
						6.7119235,
						46.1879725
					],
					[
						6.7108134,
						46.1873855
					],
					[
						6.7099757,
						46.1869398
					],
					[
						6.7088166,
						46.1863266
					],
					[
						6.7068613,
						46.185295
					],
					[
						6.7064812,
						46.1850943
					],
					[
						6.7055748,
						46.1846102
					],
					[
						6.703519,
						46.183571
					]
				]
			},
			id: "way/53165460"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/55015811",
				aerialway: "gondola",
				"aerialway:occupancy": "10",
				name: "Télécabine des Mémises",
				source: "cadastre-dgi-fr source : Direction Générale des Impôts - Cadastre. Mise à jour : 2010"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.717215,
						46.3903959
					],
					[
						6.7234116,
						46.3796377
					]
				]
			},
			id: "way/55015811"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/55037927",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				name: "Télécabine de l'Essert",
				source: "cadastre-dgi-fr source : Direction Générale des Impôts - Cadastre. Mise à jour : 2010"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.7210793,
						46.2756646
					],
					[
						6.7052807,
						46.264896
					]
				]
			},
			id: "way/55037927"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/59109225",
				aerialway: "gondola",
				"aerialway:bubble": "no",
				"aerialway:capacity": "2000",
				"aerialway:duration": "6.4",
				"aerialway:heating": "no",
				"aerialway:occupancy": "6",
				name: "Chardonney - Laris",
				note: "Costruttore: Agudio",
				oneway: "no"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.605875,
						45.6209992
					],
					[
						7.5882734,
						45.6110647
					]
				]
			},
			id: "way/59109225"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/76198795",
				aerialway: "gondola",
				"aerialway:occupancy": "4",
				name: "Verdasio-Monte Comino"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.647596,
						46.1662636
					],
					[
						8.6461234,
						46.1756631
					]
				]
			},
			id: "way/76198795"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/78342184",
				aerialway: "gondola",
				"aerialway:occupancy": "4",
				layer: "1",
				name: "Gstaad - Bodme"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.2848845,
						46.4636644
					],
					[
						7.2854432,
						46.4630876
					],
					[
						7.2868191,
						46.4615571
					],
					[
						7.2870757,
						46.4612716
					],
					[
						7.2872126,
						46.4611193
					],
					[
						7.2873226,
						46.460997
					],
					[
						7.2874396,
						46.4608669
					],
					[
						7.2884975,
						46.45969
					],
					[
						7.289385,
						46.4587027
					],
					[
						7.2903906,
						46.4575841
					],
					[
						7.2908226,
						46.4571035
					],
					[
						7.2908851,
						46.4570339
					],
					[
						7.2916485,
						46.4561846
					],
					[
						7.2926338,
						46.4550885
					],
					[
						7.2936874,
						46.4539163
					],
					[
						7.2938845,
						46.453697
					],
					[
						7.294051,
						46.4535118
					],
					[
						7.2952514,
						46.4521762
					],
					[
						7.296198,
						46.451123
					],
					[
						7.296757,
						46.4505011
					],
					[
						7.2970454,
						46.4501802
					]
				]
			},
			id: "way/78342184"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/82714880",
				aerialway: "gondola",
				"aerialway:occupancy": "8",
				name: "Les Gouilles - La Videmanette"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.2045794,
						46.4597439
					],
					[
						7.2067261,
						46.4576297
					]
				]
			},
			id: "way/82714880"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/86249803",
				aerialway: "gondola",
				"aerialway:heating": "no",
				"aerialway:occupancy": "4",
				name: "Gstaad-Eggli",
				ref: "J1"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.282072,
						46.46753
					],
					[
						7.2657637,
						46.4632817
					]
				]
			},
			id: "way/86249803"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/91785015",
				aerialway: "gondola",
				name: "Mongnod - Chantorné",
				ref: "A"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.5676991,
						45.8044959
					],
					[
						7.5565035,
						45.809432
					]
				]
			},
			id: "way/91785015"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/108272363",
				aerialway: "gondola",
				"aerialway:bubble": "no",
				"aerialway:capacity": "1000",
				"aerialway:duration": "11",
				"aerialway:heating": "no",
				"aerialway:occupancy": "8",
				layer: "1",
				man_made: "leitner",
				name: "Funivia Prestinone - La Piana",
				phone: "+39 0324 98646"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.4845051,
						46.1644637
					],
					[
						8.4844392,
						46.1641821
					],
					[
						8.4836769,
						46.1609237
					],
					[
						8.4834601,
						46.1599971
					],
					[
						8.4832845,
						46.1592465
					],
					[
						8.4830163,
						46.1580999
					],
					[
						8.4827056,
						46.1567716
					],
					[
						8.4822613,
						46.1548726
					],
					[
						8.4816893,
						46.152427
					],
					[
						8.4813866,
						46.1511331
					],
					[
						8.4812496,
						46.1505475
					],
					[
						8.4808699,
						46.148924
					],
					[
						8.4804784,
						46.14725
					],
					[
						8.4801086,
						46.1456689
					],
					[
						8.4796895,
						46.143877
					],
					[
						8.4794684,
						46.1429319
					],
					[
						8.4793294,
						46.1423374
					],
					[
						8.4788578,
						46.140321
					],
					[
						8.4788358,
						46.1402266
					],
					[
						8.4787345,
						46.1397934
					],
					[
						8.4783917,
						46.1383277
					]
				]
			},
			id: "way/108272363"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/114942017",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				name: "Plan Maison",
				ref: "A"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.6336586,
						45.9342756
					],
					[
						7.6341413,
						45.9344289
					],
					[
						7.6343203,
						45.9344859
					],
					[
						7.6355374,
						45.9348726
					],
					[
						7.6367238,
						45.9352497
					],
					[
						7.6377876,
						45.9355877
					],
					[
						7.6393208,
						45.936075
					],
					[
						7.6403446,
						45.9364003
					],
					[
						7.6408331,
						45.9365555
					],
					[
						7.6413481,
						45.9367192
					],
					[
						7.6421783,
						45.936983
					],
					[
						7.644836,
						45.9378276
					],
					[
						7.6452316,
						45.9379533
					],
					[
						7.6459524,
						45.9381823
					],
					[
						7.646689,
						45.9384164
					],
					[
						7.6468022,
						45.9384524
					],
					[
						7.6486285,
						45.9390327
					],
					[
						7.6489405,
						45.9391319
					],
					[
						7.6494074,
						45.9392802
					],
					[
						7.6506354,
						45.9396705
					],
					[
						7.6517887,
						45.9400369
					],
					[
						7.6522116,
						45.9401713
					],
					[
						7.6535165,
						45.9405859
					],
					[
						7.6541766,
						45.9407957
					]
				]
			},
			id: "way/114942017"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/126134048",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				name: "Luftseilbahn Eggwald-Gummenalp"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.3585712,
						46.9108611
					],
					[
						8.3589556,
						46.9095186
					],
					[
						8.3602353,
						46.9050487
					],
					[
						8.3608544,
						46.9028863
					],
					[
						8.3612574,
						46.9014785
					]
				]
			},
			id: "way/126134048"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/142819885",
				aerialway: "gondola",
				"aerialway:heating": "no",
				"aerialway:occupancy": "6",
				layer: "1",
				name: "Montjoie",
				source: "cadastre-dgi-fr source : Direction Générale des Impôts - Cadastre. Mise à jour : 2011"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.723011,
						45.8114987
					],
					[
						6.7135172,
						45.8030868
					]
				]
			},
			id: "way/142819885"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/142819886",
				aerialway: "gondola",
				"aerialway:occupancy": "4",
				name: "La Gorge",
				source: "cadastre-dgi-fr source : Direction Générale des Impôts - Cadastre. Mise à jour : 2011"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.7198467,
						45.8009628
					],
					[
						6.7141449,
						45.802766
					]
				]
			},
			id: "way/142819886"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/142819887",
				aerialway: "gondola",
				"aerialway:heating": "no",
				"aerialway:occupancy": "6",
				name: "Signal",
				source: "cadastre-dgi-fr source : Direction Générale des Impôts - Cadastre. Mise à jour : 2011"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.713314,
						45.802903
					],
					[
						6.7070194,
						45.7976668
					],
					[
						6.7044506,
						45.7955299
					],
					[
						6.694438,
						45.7871996
					]
				]
			},
			id: "way/142819887"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/146079317",
				aerialway: "gondola",
				"aerialway:bubble": "yes",
				"aerialway:heating": "no",
				name: "Le Rosay"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.4350077,
						45.9450017
					],
					[
						6.4357533,
						45.9455035
					],
					[
						6.4362867,
						45.9458625
					],
					[
						6.4373683,
						45.9465904
					],
					[
						6.4389184,
						45.9476336
					],
					[
						6.4401792,
						45.9484821
					],
					[
						6.4410157,
						45.949045
					],
					[
						6.442715,
						45.9501886
					],
					[
						6.4437568,
						45.9508897
					],
					[
						6.4457274,
						45.9522159
					],
					[
						6.4468997,
						45.9530048
					],
					[
						6.4474244,
						45.9533579
					],
					[
						6.4487565,
						45.9542544
					],
					[
						6.4504567,
						45.9553986
					],
					[
						6.4510834,
						45.9558204
					],
					[
						6.4525078,
						45.956779
					],
					[
						6.4529416,
						45.9570709
					],
					[
						6.4538867,
						45.957707
					],
					[
						6.4543278,
						45.9580038
					],
					[
						6.4547554,
						45.9582916
					],
					[
						6.4553293,
						45.9586779
					],
					[
						6.455463,
						45.9587678
					]
				]
			},
			id: "way/146079317"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/154530061",
				aerialway: "gondola",
				"aerialway:capacity": "1800",
				"aerialway:occupancy": "10",
				name: "Männlichenbahn",
				source: "survey"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.9793146,
						46.6211531
					],
					[
						7.9789906,
						46.6210878
					]
				]
			},
			id: "way/154530061"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/155478239",
				aerialway: "gondola",
				"aerialway:occupancy": "4",
				name: "Hannig",
				ref: "X"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.9167095,
						46.1147218
					],
					[
						7.9268418,
						46.1103021
					],
					[
						7.9271736,
						46.1101303
					],
					[
						7.9272469,
						46.1100979
					]
				]
			},
			id: "way/155478239"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/156291724",
				aerialway: "gondola",
				"aerialway:capacity": "1200",
				"aerialway:heating": "no",
				"aerialway:occupancy": "8",
				layer: "2",
				name: "Télécabine Vercorin - Crêt-du-Midi"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.5342923,
						46.2541147
					],
					[
						7.5342035,
						46.2537551
					],
					[
						7.5341155,
						46.2533987
					],
					[
						7.5336479,
						46.2515047
					],
					[
						7.5333274,
						46.2502061
					],
					[
						7.5320548,
						46.2450504
					],
					[
						7.5314418,
						46.2425664
					],
					[
						7.5310195,
						46.2408553
					],
					[
						7.5308548,
						46.2401878
					],
					[
						7.5307093,
						46.2395979
					],
					[
						7.5306845,
						46.2393622
					],
					[
						7.530645,
						46.2389846
					],
					[
						7.5304465,
						46.2370913
					],
					[
						7.5302558,
						46.2352725
					],
					[
						7.5300921,
						46.2337112
					],
					[
						7.5298389,
						46.2312954
					],
					[
						7.5296467,
						46.2294605
					]
				]
			},
			id: "way/156291724"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/174540569",
				aerialway: "gondola",
				"aerialway:bubble": "no",
				"aerialway:heating": "no",
				"aerialway:occupancy": "8",
				name: "Grand Massif Express"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.7212417,
						46.0765457
					],
					[
						6.7198374,
						46.0749831
					],
					[
						6.7194393,
						46.0745401
					],
					[
						6.7184708,
						46.0734624
					],
					[
						6.7173479,
						46.0722129
					],
					[
						6.7161029,
						46.0708275
					],
					[
						6.7149391,
						46.0695323
					],
					[
						6.7147544,
						46.0693269
					],
					[
						6.7137544,
						46.0682139
					],
					[
						6.7128818,
						46.0672429
					],
					[
						6.7113574,
						46.0655464
					],
					[
						6.7100273,
						46.0640661
					],
					[
						6.7089228,
						46.0628368
					],
					[
						6.7087661,
						46.0626625
					],
					[
						6.708002,
						46.061812
					],
					[
						6.7052033,
						46.058697
					],
					[
						6.7050435,
						46.0585191
					],
					[
						6.7039721,
						46.0573266
					],
					[
						6.7039072,
						46.0572544
					],
					[
						6.7038423,
						46.0571822
					],
					[
						6.7033935,
						46.0566826
					],
					[
						6.7027095,
						46.0559086
					],
					[
						6.702301,
						46.0554461
					]
				]
			},
			id: "way/174540569"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/187932942",
				aerialway: "gondola",
				"aerialway:heating": "no",
				"aerialway:occupancy": "10",
				name: "Planpraz",
				oneway: "no",
				wheelchair: "yes"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.8632341,
						45.9239877
					],
					[
						6.8630586,
						45.9241836
					],
					[
						6.863009,
						45.924239
					],
					[
						6.8628158,
						45.9244546
					],
					[
						6.8618273,
						45.9255582
					],
					[
						6.8608022,
						45.9267026
					],
					[
						6.8594684,
						45.9281917
					],
					[
						6.8585361,
						45.9292324
					],
					[
						6.857659,
						45.9302115
					],
					[
						6.8566093,
						45.9313833
					],
					[
						6.8557626,
						45.9323285
					],
					[
						6.8546671,
						45.9335514
					],
					[
						6.8540207,
						45.9342729
					],
					[
						6.8530593,
						45.935346
					],
					[
						6.8528192,
						45.9356141
					],
					[
						6.8527552,
						45.9356855
					],
					[
						6.8526047,
						45.9358535
					]
				]
			},
			id: "way/187932942"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/198738238",
				aerialway: "gondola",
				name: "Aup de Veran"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.6916642,
						46.0033983
					],
					[
						6.6956734,
						45.9981769
					],
					[
						6.7005185,
						45.9918831
					],
					[
						6.7050723,
						45.986106
					]
				]
			},
			id: "way/198738238"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/198765185",
				aerialway: "gondola",
				"aerialway:bubble": "no",
				"aerialway:heating": "no",
				name: "Morillon"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.6806014,
						46.0814504
					],
					[
						6.6728504,
						46.0653684
					],
					[
						6.6728073,
						46.0652669
					]
				]
			},
			id: "way/198765185"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/199915290",
				aerialway: "gondola",
				"aerialway:bubble": "yes",
				"aerialway:capacity": "1000",
				"aerialway:duration": "5",
				"aerialway:heating": "no",
				"aerialway:occupancy": "4",
				name: "La Joyère"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.4354967,
						45.9447727
					],
					[
						6.4356442,
						45.9448101
					],
					[
						6.4364029,
						45.9450217
					],
					[
						6.4374825,
						45.9453271
					],
					[
						6.438935,
						45.9457485
					],
					[
						6.4392906,
						45.9458505
					],
					[
						6.4392997,
						45.9458531
					],
					[
						6.4393674,
						45.9458725
					],
					[
						6.4407433,
						45.9462671
					],
					[
						6.4422203,
						45.9466834
					],
					[
						6.4437243,
						45.9471099
					],
					[
						6.4459473,
						45.9477462
					],
					[
						6.4481726,
						45.948357
					],
					[
						6.4493307,
						45.9486879
					],
					[
						6.4501232,
						45.9489165
					],
					[
						6.4507047,
						45.9490735
					]
				]
			},
			id: "way/199915290"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/201282418",
				aerialway: "gondola",
				"aerialway:source": "https://patrimoine.auvergnerhonealpes.fr/dossier/teleferique-des-grandes-platieres/2b8f36d7-bfe1-4a92-8ff1-ca7d29e64f32",
				manufacturer: "Omnium Lyonnais",
				name: "Grandes Platières",
				start_date: "1967-12"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.6963852,
						46.0042481
					],
					[
						6.7220932,
						45.9847012
					]
				]
			},
			id: "way/201282418"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/217973825",
				aerialway: "gondola",
				"aerialway:capacity": "1200",
				"aerialway:duration": "8.3",
				"aerialway:occupancy": "8",
				name: "Le Châble - Mayens de Bruson",
				operator: "Téléverbier",
				ref: "500"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.2145085,
						46.0785022
					],
					[
						7.2134754,
						46.0774681
					],
					[
						7.1962756,
						46.0602478
					]
				]
			},
			id: "way/217973825"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/249809635",
				aerialway: "gondola",
				"aerialway:capacity": "2400",
				"aerialway:duration": "6.5",
				"aerialway:occupancy": "8",
				layer: "1",
				name: "Siviez",
				operator: "Télénendaz",
				ref: "61",
				source: "survey 2013.12"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.3159838,
						46.1352824
					],
					[
						7.2942949,
						46.1401307
					]
				]
			},
			id: "way/249809635"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/285775369",
				aerialway: "gondola",
				alt_name: "Heiligkreuz-Kumme",
				name: "Heiligkreuz-Chummibort"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.1670144,
						46.3262266
					],
					[
						8.1739133,
						46.3420159
					]
				]
			},
			id: "way/285775369"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/286067653",
				aerialway: "gondola",
				"aerialway:occupancy": "8",
				name: "Luftseilbahn Rotenflue",
				website: "http://www.rotenflue-kulm.ch"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.6692591,
						47.0148031
					],
					[
						8.670424,
						47.0150103
					],
					[
						8.6751542,
						47.0158581
					],
					[
						8.6788116,
						47.0165097
					],
					[
						8.682639,
						47.0171954
					],
					[
						8.6862151,
						47.0178326
					],
					[
						8.688529,
						47.0182448
					],
					[
						8.6893855,
						47.0184064
					],
					[
						8.6924099,
						47.0189403
					],
					[
						8.6955883,
						47.0195063
					],
					[
						8.6982974,
						47.0199886
					],
					[
						8.7016833,
						47.0205915
					],
					[
						8.7021793,
						47.0206798
					],
					[
						8.7027358,
						47.0207789
					],
					[
						8.7032347,
						47.0208677
					]
				]
			},
			id: "way/286067653"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/288709911",
				aerialway: "gondola",
				"aerialway:capacity": "1800",
				"aerialway:duration": "10.3",
				"aerialway:occupancy": "10",
				name: "Männlichenbahn",
				source: "survey"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.9789906,
						46.6210878
					],
					[
						7.9787493,
						46.6210207
					],
					[
						7.9782149,
						46.6208722
					],
					[
						7.9766784,
						46.6204453
					],
					[
						7.9747577,
						46.6199117
					],
					[
						7.9727037,
						46.619341
					],
					[
						7.9716266,
						46.6190417
					],
					[
						7.9697837,
						46.6185296
					],
					[
						7.9675679,
						46.6179139
					],
					[
						7.9657552,
						46.6174103
					],
					[
						7.9641706,
						46.61697
					],
					[
						7.9621546,
						46.6164098
					],
					[
						7.9609448,
						46.6160736
					],
					[
						7.9605576,
						46.615966
					],
					[
						7.9600959,
						46.6158377
					],
					[
						7.9583647,
						46.6153567
					],
					[
						7.956901,
						46.61495
					],
					[
						7.9543869,
						46.6142514
					],
					[
						7.9522297,
						46.6136519
					],
					[
						7.9514816,
						46.613444
					],
					[
						7.9499932,
						46.6130304
					],
					[
						7.947934,
						46.6124582
					],
					[
						7.9475102,
						46.6123404
					],
					[
						7.9471101,
						46.6122292
					],
					[
						7.9450873,
						46.6116671
					],
					[
						7.9436464,
						46.6112667
					],
					[
						7.9434152,
						46.6112025
					],
					[
						7.9428482,
						46.6110449
					]
				]
			},
			id: "way/288709911"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/305162724",
				aerialway: "gondola",
				"aerialway:occupancy": "10",
				name: "Plan Joran",
				wheelchair: "yes"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.9282173,
						45.9790112
					],
					[
						6.9405288,
						45.9616985
					]
				]
			},
			id: "way/305162724"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/307206289",
				aerialway: "gondola",
				"aerialway:capacity": "2400",
				"aerialway:duration": "2.5",
				"aerialway:occupancy": "10",
				"aerialway:speed": "6 m/s",
				brand: "Leitner ropeways",
				layer: "1"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.4570496,
						46.4420448
					],
					[
						7.4671113,
						46.4443925
					]
				]
			},
			id: "way/307206289"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/322784212",
				aerialway: "gondola",
				"aerialway:duration": "10",
				"aerialway:heating": "no",
				"aerialway:occupancy": "12",
				name: "Cime Bianche Laghi",
				ref: "T"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.6558052,
						45.9409779
					],
					[
						7.6560461,
						45.9408701
					],
					[
						7.6567294,
						45.9405802
					],
					[
						7.656951,
						45.9404667
					],
					[
						7.6576871,
						45.940135
					],
					[
						7.6592824,
						45.9394212
					],
					[
						7.6609542,
						45.9386849
					],
					[
						7.6627686,
						45.937872
					],
					[
						7.6639265,
						45.9373529
					],
					[
						7.6650579,
						45.9368459
					],
					[
						7.6671038,
						45.9359288
					],
					[
						7.6687038,
						45.9352118
					],
					[
						7.6704479,
						45.9344316
					],
					[
						7.6727223,
						45.9334073
					],
					[
						7.6744886,
						45.9326171
					],
					[
						7.6749318,
						45.9324152
					],
					[
						7.6772827,
						45.931367
					],
					[
						7.6784983,
						45.9308225
					],
					[
						7.6795338,
						45.9303601
					],
					[
						7.679952,
						45.9301751
					]
				]
			},
			id: "way/322784212"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/327170711",
				aerialway: "gondola",
				"aerialway:occupancy": "6",
				name: "Saanenwald - Saanerslochgrat"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.317664,
						46.5099162
					],
					[
						7.3178495,
						46.5098142
					],
					[
						7.318457,
						46.5094447
					],
					[
						7.3195614,
						46.5087814
					],
					[
						7.3207281,
						46.5080796
					],
					[
						7.3214355,
						46.5076551
					],
					[
						7.3222453,
						46.5071679
					],
					[
						7.3249162,
						46.5055618
					],
					[
						7.3262172,
						46.5047803
					],
					[
						7.3270508,
						46.5042801
					],
					[
						7.3289434,
						46.5031413
					],
					[
						7.3296543,
						46.5027138
					],
					[
						7.3309512,
						46.5019339
					],
					[
						7.3316008,
						46.5015432
					],
					[
						7.3336005,
						46.5003406
					],
					[
						7.3339553,
						46.5001273
					],
					[
						7.3343547,
						46.4998875
					],
					[
						7.3352304,
						46.4993605
					],
					[
						7.3367898,
						46.4984225
					],
					[
						7.336948,
						46.4983277
					],
					[
						7.3372285,
						46.4981491
					],
					[
						7.337429,
						46.4980294
					]
				]
			},
			id: "way/327170711"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/327171395",
				aerialway: "gondola",
				"aerialway:occupancy": "4",
				description: "Bodme - Wispile",
				layer: "1"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.2970441,
						46.4501733
					],
					[
						7.2969534,
						46.4499537
					],
					[
						7.2967048,
						46.4493995
					],
					[
						7.2925554,
						46.4401476
					]
				]
			},
			id: "way/327171395"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/327889524",
				aerialway: "gondola",
				name: "Télémixte Le Brand - La Berra"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.1550795,
						46.6866521
					],
					[
						7.155691,
						46.6864113
					],
					[
						7.1791801,
						46.6775997
					]
				]
			},
			id: "way/327889524"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/330910426",
				aerialway: "gondola",
				"aerialway:capacity": "2400",
				"aerialway:duration": "6",
				"aerialway:occupancy": "10",
				"aerialway:speed": "6 m/s",
				brand: "Leitner ropeways",
				layer: "1"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.4672106,
						46.4444068
					],
					[
						7.469009,
						46.4443809
					],
					[
						7.4710448,
						46.4443581
					],
					[
						7.4741469,
						46.4443234
					],
					[
						7.4762792,
						46.4442995
					],
					[
						7.479644,
						46.4442618
					],
					[
						7.4823651,
						46.4442314
					],
					[
						7.4870724,
						46.4441787
					],
					[
						7.4894126,
						46.4441525
					],
					[
						7.4917301,
						46.4441266
					],
					[
						7.4939281,
						46.444102
					],
					[
						7.4945326,
						46.4440952
					]
				]
			},
			id: "way/330910426"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/333301450",
				aerialway: "gondola",
				"aerialway:capacity": "2800",
				"aerialway:duration": "7",
				"aerialway:occupancy": "8",
				name: "Matterhorn Express"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.7106105,
						45.9874879
					],
					[
						7.7216263,
						45.9716053
					]
				]
			},
			id: "way/333301450"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/333301451",
				aerialway: "gondola",
				"aerialway:capacity": "2800",
				"aerialway:duration": "2",
				"aerialway:occupancy": "8",
				name: "Matterhorn Express"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.7089208,
						45.9920763
					],
					[
						7.7106105,
						45.9874879
					]
				]
			},
			id: "way/333301451"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/365650592",
				aerialway: "gondola",
				"aerialway:occupancy": "8",
				name: "Gondelbahn Blatten - Chiematte"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.9840043,
						46.3588728
					],
					[
						7.9837679,
						46.359028
					],
					[
						7.9833655,
						46.3592947
					],
					[
						7.9807476,
						46.3610299
					],
					[
						7.9796792,
						46.361738
					],
					[
						7.977696,
						46.3630524
					],
					[
						7.9760417,
						46.3641488
					],
					[
						7.9737348,
						46.3656777
					],
					[
						7.9722893,
						46.3666357
					],
					[
						7.9712119,
						46.3673497
					],
					[
						7.9696728,
						46.3683697
					],
					[
						7.9694922,
						46.3684893
					],
					[
						7.968107,
						46.3694073
					],
					[
						7.9674966,
						46.3698297
					]
				]
			},
			id: "way/365650592"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/388096328",
				aerialway: "gondola",
				"aerialway:occupancy": "8",
				name: "TITLIS-Xpress"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.3966117,
						46.8160724
					],
					[
						8.3969057,
						46.8100901
					],
					[
						8.3976495,
						46.7939855
					]
				]
			},
			id: "way/388096328"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/388096332",
				aerialway: "gondola",
				"aerialway:occupancy": "8",
				name: "TITLIS-Xpress"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.4171168,
						46.7824029
					],
					[
						8.3984875,
						46.7929845
					],
					[
						8.3979224,
						46.7933054
					]
				]
			},
			id: "way/388096332"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/430206136",
				aerialway: "gondola",
				"aerialway:occupancy": "8",
				bicycle: "permissive",
				name: "Luftseilbahn Brunni-Alp Gschwänd",
				note: "offizieller Name?"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.2687922,
						46.9858775
					],
					[
						8.2731171,
						46.9862186
					],
					[
						8.280898,
						46.9868324
					],
					[
						8.2865379,
						46.9872773
					],
					[
						8.2878305,
						46.9873793
					]
				]
			},
			id: "way/430206136"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/436389224",
				aerialway: "gondola",
				"aerialway:capacity": "1600",
				"aerialway:occupancy": "10",
				name: "Montana - Arnouvaz",
				ref: "G"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.4774512,
						46.317705
					],
					[
						7.4792069,
						46.3128795
					]
				]
			},
			id: "way/436389224"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/438186992",
				aerialway: "gondola",
				"aerialway:capacity": "1400",
				"aerialway:occupancy": "10",
				construction_date: "22.12.2016",
				name: "Spielboden 2. Sektion",
				ref: "T",
				year_of_construction: "2016"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.9201572,
						46.1000804
					],
					[
						7.9193562,
						46.0997619
					],
					[
						7.8996703,
						46.091975
					]
				]
			},
			id: "way/438186992"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/446250954",
				aerialway: "gondola",
				"aerialway:capacity": "1800",
				"aerialway:diagonallength": "1295",
				"aerialway:duration": "5",
				"aerialway:occupancy": "6",
				brand: "von Roll",
				name: "Bergläger-Sillerenbühl",
				ref: "C8",
				start_date: "1990"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.532749,
						46.4685721
					],
					[
						7.5323938,
						46.4686498
					],
					[
						7.5323028,
						46.4686696
					],
					[
						7.531682,
						46.4688053
					],
					[
						7.5302993,
						46.4691075
					],
					[
						7.5281076,
						46.4695864
					],
					[
						7.5267272,
						46.4698881
					],
					[
						7.5249387,
						46.4702789
					],
					[
						7.523682,
						46.4705535
					],
					[
						7.5234885,
						46.4705958
					],
					[
						7.521822,
						46.47096
					],
					[
						7.5189888,
						46.4715791
					],
					[
						7.5185997,
						46.4716641
					],
					[
						7.5179441,
						46.4718074
					]
				]
			},
			id: "way/446250954"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/446569623",
				aerialway: "gondola",
				"aerialway:bicycle": "no",
				"aerialway:bubble": "yes",
				"aerialway:capacity": "2200",
				"aerialway:difference": "298",
				"aerialway:duration": "4",
				"aerialway:heating": "no",
				"aerialway:occupancy": "9",
				name: "Télécabine d'Ardent"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.7609866,
						46.2137817
					],
					[
						6.7614141,
						46.2136343
					],
					[
						6.7619466,
						46.2134466
					],
					[
						6.7632994,
						46.212975
					],
					[
						6.7650223,
						46.2123829
					],
					[
						6.7684501,
						46.2112312
					],
					[
						6.7690273,
						46.2110196
					],
					[
						6.7713403,
						46.2102519
					],
					[
						6.7733783,
						46.2095452
					],
					[
						6.7751937,
						46.2089245
					],
					[
						6.7762135,
						46.2085793
					],
					[
						6.7774787,
						46.2081432
					],
					[
						6.7777543,
						46.2080485
					],
					[
						6.7781291,
						46.2079166
					]
				]
			},
			id: "way/446569623"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/519981791",
				aerialway: "gondola",
				"aerialway:capacity": "2000",
				"aerialway:duration": "9",
				"aerialway:occupancy": "28",
				name: "Trockener Steg - Klein Matterhorn Glacier Ride"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.7287929,
						45.9383891
					],
					[
						7.7234053,
						45.9627752
					],
					[
						7.7222316,
						45.9680763
					],
					[
						7.7215161,
						45.9713237
					]
				]
			},
			id: "way/519981791"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/549622063",
				aerialway: "gondola",
				"aerialway:capacity": "2400",
				"aerialway:heating": "no",
				"aerialway:occupancy": "8",
				name: "Gütsch-Express",
				ref: "1"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.5954215,
						46.6378096
					],
					[
						8.6071778,
						46.6426683
					],
					[
						8.6212662,
						46.6561821
					]
				]
			},
			id: "way/549622063"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/554676919",
				aerialway: "gondola",
				"aerialway:duration": "5",
				"aerialway:occupancy": "8",
				name: "Gondelbahn Reuti-Bidmi-Mägisalp"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.2196125,
						46.7443171
					],
					[
						8.2205777,
						46.7446001
					],
					[
						8.2231862,
						46.7453649
					],
					[
						8.2254686,
						46.746034
					],
					[
						8.2310446,
						46.7476688
					],
					[
						8.2335023,
						46.7483893
					],
					[
						8.2341844,
						46.7485892
					],
					[
						8.2359697,
						46.7491126
					],
					[
						8.2367225,
						46.7493333
					]
				]
			},
			id: "way/554676919"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/614302259",
				aerialway: "gondola",
				"aerialway:occupancy": "8",
				description: "Oberschwend-Rigi Burggeist"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.5407983,
						47.0128806
					],
					[
						8.5247919,
						47.0252496
					]
				]
			},
			id: "way/614302259"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/639376260",
				aerialway: "gondola",
				"aerialway:capacity": "2500",
				"aerialway:duration": "6.5",
				"aerialway:heating": "no",
				"aerialway:occupancy": "10",
				description: "remplace le télésiège Vioz-Mazot",
				name: "Diablerets express",
				oneway: "no"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.155157,
						46.3457054
					],
					[
						7.1532825,
						46.3446508
					],
					[
						7.1507621,
						46.3432329
					],
					[
						7.1477645,
						46.3415464
					],
					[
						7.1462305,
						46.3406833
					],
					[
						7.1443174,
						46.3396069
					],
					[
						7.1426506,
						46.3386691
					],
					[
						7.140967,
						46.3377218
					],
					[
						7.1401006,
						46.3372344
					],
					[
						7.1394593,
						46.3368735
					],
					[
						7.1386696,
						46.3363174
					],
					[
						7.1368241,
						46.3350175
					],
					[
						7.1343587,
						46.3332811
					],
					[
						7.1328874,
						46.3322448
					]
				]
			},
			id: "way/639376260"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/648887133",
				aerialway: "gondola",
				"aerialway:bubble": "yes",
				"aerialway:capacity": "2400",
				"aerialway:duration": "4.1",
				"aerialway:heating": "no",
				"aerialway:occupancy": "8",
				name: "Champoluc - Crest",
				note: "Costruttore: Leitner",
				oneway: "no"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.7442473,
						45.8327233
					],
					[
						7.7317833,
						45.8365364
					]
				]
			},
			id: "way/648887133"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/660153038",
				aerialway: "gondola",
				"aerialway:capacity": "1500",
				"aerialway:duration": "4.7",
				"aerialway:heating": "no",
				"aerialway:occupancy": "8",
				name: "Kumme"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.7731509,
						46.0356013
					],
					[
						7.7893834,
						46.0362514
					]
				]
			},
			id: "way/660153038"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/671148223",
				aerialway: "gondola",
				"aerialway:occupancy": "10",
				name: "Schneehüenerstock-Express",
				ref: "5"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.6719814,
						46.660105
					],
					[
						8.6611416,
						46.6664242
					],
					[
						8.6559203,
						46.6694678
					]
				]
			},
			id: "way/671148223"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/675779413",
				aerialway: "gondola",
				"aerialway:capacity": "1800",
				"aerialway:diagonallength": "3070",
				"aerialway:duration": "12",
				"aerialway:occupancy": "6",
				brand: "von Roll",
				name: "Oey-Bergläger",
				ref: "C7",
				start_date: "1990"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.5601351,
						46.4878013
					],
					[
						7.5599292,
						46.4877022
					],
					[
						7.5597395,
						46.4876207
					],
					[
						7.5580445,
						46.4868928
					],
					[
						7.5562533,
						46.4861236
					],
					[
						7.5543084,
						46.4853025
					],
					[
						7.5527669,
						46.484645
					],
					[
						7.5512215,
						46.4839843
					],
					[
						7.5491136,
						46.48309
					],
					[
						7.547729,
						46.4825026
					],
					[
						7.5468416,
						46.4821338
					]
				]
			},
			id: "way/675779413"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/675817101",
				aerialway: "gondola",
				"aerialway:capacity": "1200",
				"aerialway:occupancy": "6",
				name: "Firstbahn",
				ref: "2440"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.0652644,
						46.6584938
					],
					[
						8.0648646,
						46.6585339
					],
					[
						8.064287,
						46.6586039
					],
					[
						8.0618671,
						46.6588969
					],
					[
						8.0598203,
						46.6591448
					],
					[
						8.0582358,
						46.6593366
					],
					[
						8.0573945,
						46.6594385
					],
					[
						8.0550788,
						46.6597189
					],
					[
						8.0545568,
						46.6597821
					],
					[
						8.0538405,
						46.6598706
					]
				]
			},
			id: "way/675817101"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/719574404",
				aerialway: "gondola",
				"aerialway:occupancy": "8",
				layer: "-2",
				name: "TITLIS-Xpress",
				tunnel: "building_passage"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.3976495,
						46.7939855
					],
					[
						8.3976744,
						46.7934462
					]
				]
			},
			id: "way/719574404"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/719574405",
				aerialway: "gondola",
				"aerialway:occupancy": "8",
				layer: "-2",
				name: "TITLIS-Xpress",
				tunnel: "building_passage"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.3979224,
						46.7933054
					],
					[
						8.3976744,
						46.7934462
					]
				]
			},
			id: "way/719574405"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/761801233",
				aerialway: "gondola",
				"aerialway:capacity": "2400",
				"aerialway:duration": "5.5",
				"aerialway:occupancy": "8",
				layer: "1",
				name: "Plan du Fou",
				operator: "Télénendaz",
				ref: "59",
				source: "GPS survey 2020.01"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.2789177,
						46.1489567
					],
					[
						7.2942949,
						46.1401307
					]
				]
			},
			id: "way/761801233"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/799042591",
				aerialway: "gondola",
				"aerialway:capacity": "2200",
				"aerialway:duration": "15",
				"aerialway:occupancy": "26",
				name: "Eiger Express",
				source: "survey"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						8.0193659,
						46.6243074
					],
					[
						8.0186102,
						46.6234749
					],
					[
						8.0149966,
						46.6195386
					],
					[
						8.0082489,
						46.6119287
					],
					[
						8.0027256,
						46.6057257
					],
					[
						7.9885763,
						46.589833
					],
					[
						7.9846602,
						46.5851814
					],
					[
						7.9753956,
						46.575392
					]
				]
			},
			id: "way/799042591"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/814532263",
				aerialway: "gondola",
				"aerialway:heating": "no",
				"aerialway:occupancy": "10",
				name: "Le Bois",
				oneway: "no"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						6.5415614,
						45.6714466
					],
					[
						6.5648181,
						45.6659108
					]
				]
			},
			id: "way/814532263"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/834713210",
				aerialway: "gondola",
				"aerialway:capacity": "1800",
				"aerialway:occupancy": "10",
				name: "Zinal - Sorebois - Espace Weisshorn"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.6240848,
						46.1382896
					],
					[
						7.6039023,
						46.1449077
					],
					[
						7.5956962,
						46.1503387
					]
				]
			},
			id: "way/834713210"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/903540908",
				aerialway: "gondola",
				"aerialway:capacity": "1500",
				"aerialway:duration": "6.1",
				"aerialway:heating": "no",
				"aerialway:occupancy": "8",
				name: "Kumme"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.7893834,
						46.0362514
					],
					[
						7.7982523,
						46.0210362
					]
				]
			},
			id: "way/903540908"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/903540909",
				aerialway: "gondola",
				"aerialway:capacity": "2800",
				"aerialway:duration": "4.5",
				"aerialway:occupancy": "8",
				name: "Matterhorn Express"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.7426639,
						46.0146424
					],
					[
						7.7319625,
						46.0016707
					]
				]
			},
			id: "way/903540909"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/917788066",
				aerialway: "gondola",
				"aerialway:bubble": "no",
				"aerialway:capacity": "2400",
				"aerialway:duration": "4",
				"aerialway:heating": "no",
				"aerialway:occupancy": "8",
				layer: "1",
				name: "Plan Praz - Pila",
				note: "Costruttore: Leitner",
				oneway: "no"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.3113411,
						45.697946
					],
					[
						7.311325,
						45.6976552
					],
					[
						7.3113194,
						45.6975547
					],
					[
						7.3112789,
						45.6969365
					],
					[
						7.3112638,
						45.6961239
					],
					[
						7.3112486,
						45.6957458
					],
					[
						7.3111828,
						45.6944174
					],
					[
						7.3111626,
						45.693686
					],
					[
						7.3110872,
						45.6915665
					],
					[
						7.3110448,
						45.6905206
					],
					[
						7.3109916,
						45.6894331
					],
					[
						7.3109608,
						45.6887713
					],
					[
						7.3109585,
						45.6884432
					]
				]
			},
			id: "way/917788066"
		},
		{
			type: "Feature",
			properties: {
				"@id": "way/917788067",
				aerialway: "gondola",
				"aerialway:bubble": "no",
				"aerialway:capacity": "2400",
				"aerialway:duration": "2",
				"aerialway:heating": "no",
				"aerialway:occupancy": "8",
				layer: "1",
				name: "Les Fleurs - Plan Praz",
				note: "Costruttore: Leitner",
				oneway: "no"
			},
			geometry: {
				type: "LineString",
				coordinates: [
					[
						7.3115423,
						45.7027884
					],
					[
						7.3115266,
						45.7024869
					],
					[
						7.311523,
						45.7024179
					],
					[
						7.3115195,
						45.702351
					],
					[
						7.3114858,
						45.7017156
					],
					[
						7.3114712,
						45.7007232
					],
					[
						7.3114024,
						45.6993187
					],
					[
						7.3113814,
						45.698893
					],
					[
						7.3113693,
						45.69836
					],
					[
						7.3113411,
						45.697946
					]
				]
			},
			id: "way/917788067"
		}
	];
	var telecabine = {
		type: type,
		generator: generator,
		copyright: copyright,
		timestamp: timestamp,
		features: features
	};

	const map = leafletSrc.map('map').setView([46.4, 7.1], 10);

	telecabine.features.filter(d => d.geometry.type==="Point");

	leafletSrc.tileLayer(
	  'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}',
	  {
	    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	    subdomains: 'abcd',
	    minZoom: 0,
	    maxZoom: 20,
	    ext: 'png',
	  })
	    .addTo(map);

	const icon = leafletSrc.icon({
	  iconUrl: 'arbre.png',
	  iconSize: [30, 30],
	  iconAnchor: [15, 30],
	});

	arbres.map(d => {
	  const [lon, lat] = d;
	  leafletSrc.marker([lat, lon], { icon }).addTo(map);
	});

	// point_tele.map(d =>{
	//   const [lon, lat] = d.geometry.coordinates
	//   console.log(lon,lat);
	//   L.marker([lat, lon], { icon }).addTo(map)
	// })

	leafletSrc.geoJSON(
	  telecabine,
	  {
	    // style: feature =>
	    //   feature.properties['name'] === 'Centre Saint-Roch'
	    //     ? { color: 'indianred' }
	    //     : { color: 'steelblue' },
	    // onEachFeature: (feature, layer) =>
	    //   layer.bindPopup(feature.properties.name || feature.properties['addr:street'] || feature.properties.uid)
	      
	  },
	).addTo(map);

}());
