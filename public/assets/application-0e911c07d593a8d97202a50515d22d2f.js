/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/*
 * Foundation Responsive Library
 * http://foundation.zurb.com
 * Copyright 2013, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

/*jslint unparam: true, browser: true, indent: 2 */

// Accommodate running jQuery or Zepto in noConflict() mode by
// using an anonymous function to redefine the $ shorthand name.
// See http://docs.jquery.com/Using_jQuery_with_Other_Libraries
// and http://zeptojs.com/
var libFuncName = null;

if (typeof jQuery === "undefined" &&
    typeof Zepto === "undefined" &&
    typeof $ === "function") {
  libFuncName = $;
} else if (typeof jQuery === "function") {
  libFuncName = jQuery;
} else if (typeof Zepto === "function") {
  libFuncName = Zepto;
} else {
  throw new TypeError();
}

(function ($, window, document, undefined) {
  'use strict';

  /*
    matchMedia() polyfill - Test a CSS media 
    type/query in JS. Authors & copyright (c) 2012: 
    Scott Jehl, Paul Irish, Nicholas Zakas. 
    Dual MIT/BSD license

    https://github.com/paulirish/matchMedia.js
  */

  window.matchMedia = window.matchMedia || (function( doc, undefined ) {

    "use strict";

    var bool,
        docElem = doc.documentElement,
        refNode = docElem.firstElementChild || docElem.firstChild,
        // fakeBody required for <FF4 when executed in <head>
        fakeBody = doc.createElement( "body" ),
        div = doc.createElement( "div" );

    div.id = "mq-test-1";
    div.style.cssText = "position:absolute;top:-100em";
    fakeBody.style.background = "none";
    fakeBody.appendChild(div);

    return function(q){

      div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

      docElem.insertBefore( fakeBody, refNode );
      bool = div.offsetWidth === 42;
      docElem.removeChild( fakeBody );

      return {
        matches: bool,
        media: q
      };

    };

  }( document ));

  // add dusty browser stuff
  if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisp */) {
      "use strict";
   
      if (this == null) {
        throw new TypeError();
      }

      var t = Object(this),
          len = t.length >>> 0;
      if (typeof fun !== "function") {
          return;
      }

      var res = [],
          thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        if (i in t) {
          var val = t[i]; // in case fun mutates this
          if (fun && fun.call(thisp, val, i, t)) {
            res.push(val);
          }
        }
      }

      return res;
    }
  }

  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== "function") {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      }
   
      var aArgs = Array.prototype.slice.call(arguments, 1), 
          fToBind = this, 
          fNOP = function () {},
          fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis
               ? this
               : oThis,
             aArgs.concat(Array.prototype.slice.call(arguments)));
          };
   
      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();
   
      return fBound;
    };
  }

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
      "use strict";
      if (this == null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) { // shortcut for verifying if it's NaN
          n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
          return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    }
  }

  // fake stop() for zepto.
  $.fn.stop = $.fn.stop || function() {
    return this;
  };

  window.Foundation = {
    name : 'Foundation',

    version : '4.2.3',

    cache : {},

    init : function (scope, libraries, method, options, response, /* internal */ nc) {
      var library_arr,
          args = [scope, method, options, response],
          responses = [],
          nc = nc || false;

      // disable library error catching,
      // used for development only
      if (nc) this.nc = nc;

      // check RTL
      this.rtl = /rtl/i.test($('html').attr('dir'));

      // set foundation global scope
      this.scope = scope || this.scope;

      if (libraries && typeof libraries === 'string' && !/reflow/i.test(libraries)) {
        if (/off/i.test(libraries)) return this.off();

        library_arr = libraries.split(' ');

        if (library_arr.length > 0) {
          for (var i = library_arr.length - 1; i >= 0; i--) {
            responses.push(this.init_lib(library_arr[i], args));
          }
        }
      } else {
        if (/reflow/i.test(libraries)) args[1] = 'reflow';

        for (var lib in this.libs) {
          responses.push(this.init_lib(lib, args));
        }
      }

      // if first argument is callback, add to args
      if (typeof libraries === 'function') {
        args.unshift(libraries);
      }

      return this.response_obj(responses, args);
    },

    response_obj : function (response_arr, args) {
      for (var i = 0, len = args.length; i < len; i++) {
        if (typeof args[i] === 'function') {
          return args[i]({
            errors: response_arr.filter(function (s) {
              if (typeof s === 'string') return s;
            })
          });
        }
      }

      return response_arr;
    },

    init_lib : function (lib, args) {
      return this.trap(function () {
        if (this.libs.hasOwnProperty(lib)) {
          this.patch(this.libs[lib]);
          return this.libs[lib].init.apply(this.libs[lib], args);
        }
        else {
          return function () {};
        }
      }.bind(this), lib);
    },

    trap : function (fun, lib) {
      if (!this.nc) {
        try {
          return fun();
        } catch (e) {
          return this.error({name: lib, message: 'could not be initialized', more: e.name + ' ' + e.message});
        }
      }

      return fun();
    },

    patch : function (lib) {
      this.fix_outer(lib);
      lib.scope = this.scope;
      lib.rtl = this.rtl;
    },

    inherit : function (scope, methods) {
      var methods_arr = methods.split(' ');

      for (var i = methods_arr.length - 1; i >= 0; i--) {
        if (this.lib_methods.hasOwnProperty(methods_arr[i])) {
          this.libs[scope.name][methods_arr[i]] = this.lib_methods[methods_arr[i]];
        }
      }
    },

    random_str : function (length) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

      if (!length) {
        length = Math.floor(Math.random() * chars.length);
      }

      var str = '';
      for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      return str;
    },

    libs : {},

    // methods that can be inherited in libraries
    lib_methods : {
      set_data : function (node, data) {
        // this.name references the name of the library calling this method
        var id = [this.name,+new Date(),Foundation.random_str(5)].join('-');

        Foundation.cache[id] = data;
        node.attr('data-' + this.name + '-id', id);
        return data;
      },

      get_data : function (node) {
        return Foundation.cache[node.attr('data-' + this.name + '-id')];
      },

      remove_data : function (node) {
        if (node) {
          delete Foundation.cache[node.attr('data-' + this.name + '-id')];
          node.attr('data-' + this.name + '-id', '');
        } else {
          $('[data-' + this.name + '-id]').each(function () {
            delete Foundation.cache[$(this).attr('data-' + this.name + '-id')];
            $(this).attr('data-' + this.name + '-id', '');
          });
        }
      },

      throttle : function(fun, delay) {
        var timer = null;
        return function () {
          var context = this, args = arguments;
          clearTimeout(timer);
          timer = setTimeout(function () {
            fun.apply(context, args);
          }, delay);
        };
      },

      // parses data-options attribute on nodes and turns
      // them into an object
      data_options : function (el) {
        var opts = {}, ii, p,
            opts_arr = (el.attr('data-options') || ':').split(';'),
            opts_len = opts_arr.length;

        function isNumber (o) {
          return ! isNaN (o-0) && o !== null && o !== "" && o !== false && o !== true;
        }

        function trim(str) {
          if (typeof str === 'string') return $.trim(str);
          return str;
        }

        // parse options
        for (ii = opts_len - 1; ii >= 0; ii--) {
          p = opts_arr[ii].split(':');

          if (/true/i.test(p[1])) p[1] = true;
          if (/false/i.test(p[1])) p[1] = false;
          if (isNumber(p[1])) p[1] = parseInt(p[1], 10);

          if (p.length === 2 && p[0].length > 0) {
            opts[trim(p[0])] = trim(p[1]);
          }
        }

        return opts;
      },

      delay : function (fun, delay) {
        return setTimeout(fun, delay);
      },

      // animated scrolling
      scrollTo : function (el, to, duration) {
        if (duration < 0) return;
        var difference = to - $(window).scrollTop();
        var perTick = difference / duration * 10;

        this.scrollToTimerCache = setTimeout(function() {
          if (!isNaN(parseInt(perTick, 10))) {
            window.scrollTo(0, $(window).scrollTop() + perTick);
            this.scrollTo(el, to, duration - 10);
          }
        }.bind(this), 10);
      },

      // not supported in core Zepto
      scrollLeft : function (el) {
        if (!el.length) return;
        return ('scrollLeft' in el[0]) ? el[0].scrollLeft : el[0].pageXOffset;
      },

      // test for empty object or array
      empty : function (obj) {
        if (obj.length && obj.length > 0)    return false;
        if (obj.length && obj.length === 0)  return true;

        for (var key in obj) {
          if (hasOwnProperty.call(obj, key))    return false;
        }

        return true;
      }
    },

    fix_outer : function (lib) {
      lib.outerHeight = function (el, bool) {
        if (typeof Zepto === 'function') {
          return el.height();
        }

        if (typeof bool !== 'undefined') {
          return el.outerHeight(bool);
        }

        return el.outerHeight();
      };

      lib.outerWidth = function (el) {
        if (typeof Zepto === 'function') {
          return el.width();
        }

        if (typeof bool !== 'undefined') {
          return el.outerWidth(bool);
        }

        return el.outerWidth();
      };
    },

    error : function (error) {
      return error.name + ' ' + error.message + '; ' + error.more;
    },

    // remove all foundation events.
    off: function () {
      $(this.scope).off('.fndtn');
      $(window).off('.fndtn');
      return true;
    },

    zj : function () {
      if (typeof Zepto !== 'undefined') {
        return Zepto;
      } else {
        return jQuery;
      }
    }()
  };

  $.fn.foundation = function () {
    var args = Array.prototype.slice.call(arguments, 0);

    return this.each(function () {
      Foundation.init.apply(Foundation, [this].concat(args));
      return this;
    });
  };

}(libFuncName, this, this.document));
/*jslint unparam: true, browser: true, indent: 2 */


;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.alerts = {
    name : 'alerts',

    version : '4.2.2',

    settings : {
      speed: 300, // fade out speed
      callback: function (){}
    },

    init : function (scope, method, options) {
      this.scope = scope || this.scope;

      if (typeof method === 'object') {
        $.extend(true, this.settings, method);
      }

      if (typeof method !== 'string') {
        if (!this.settings.init) { this.events(); }

        return this.settings.init;
      } else {
        return this[method].call(this, options);
      }
    },

    events : function () {
      var self = this;

      $(this.scope).on('click.fndtn.alerts', '[data-alert] a.close', function (e) {
        e.preventDefault();
        $(this).closest("[data-alert]").fadeOut(self.speed, function () {
          $(this).remove();
          self.settings.callback();
        });
      });

      this.settings.init = true;
    },

    off : function () {
      $(this.scope).off('.fndtn.alerts');
    },

    reflow : function () {}
  };
}(Foundation.zj, this, this.document));
/*jslint unparam: true, browser: true, indent: 2 */


;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.clearing = {
    name : 'clearing',

    version : '4.2.2',

    settings : {
      templates : {
        viewing : '<a href="#" class="clearing-close">&times;</a>' +
          '<div class="visible-img" style="display: none"><img src="//:0">' +
          '<p class="clearing-caption"></p><a href="#" class="clearing-main-prev"><span></span></a>' +
          '<a href="#" class="clearing-main-next"><span></span></a></div>'
      },

      // comma delimited list of selectors that, on click, will close clearing,
      // add 'div.clearing-blackout, div.visible-img' to close on background click
      close_selectors : '.clearing-close',

      // event initializers and locks
      init : false,
      locked : false
    },

    init : function (scope, method, options) {
      var self = this;
      Foundation.inherit(this, 'set_data get_data remove_data throttle data_options');

      if (typeof method === 'object') {
        options = $.extend(true, this.settings, method);
      }

      if (typeof method !== 'string') {
        $(this.scope).find('ul[data-clearing]').each(function () {
          var $el = $(this),
              options = options || {},
              lis = $el.find('li'),
              settings = self.get_data($el);

          if (!settings && lis.length > 0) {
            options.$parent = $el.parent();

            self.set_data($el, $.extend({}, self.settings, options, self.data_options($el)));

            self.assemble($el.find('li'));

            if (!self.settings.init) {
              self.events().swipe_events();
            }
          }
        });

        return this.settings.init;
      } else {
        // fire method
        return this[method].call(this, options);
      }
    },

    // event binding and initial setup

    events : function () {
      var self = this;

      $(this.scope)
        .on('click.fndtn.clearing', 'ul[data-clearing] li',
          function (e, current, target) {
            var current = current || $(this),
                target = target || current,
                next = current.next('li'),
                settings = self.get_data(current.parent()),
                image = $(e.target);

            e.preventDefault();
            if (!settings) self.init();

            // if clearing is open and the current image is
            // clicked, go to the next image in sequence
            if (target.hasClass('visible') && 
              current[0] === target[0] && 
              next.length > 0 && self.is_open(current)) {
              target = next;
              image = target.find('img');
            }

            // set current and target to the clicked li if not otherwise defined.
            self.open(image, current, target);
            self.update_paddles(target);
          })

        .on('click.fndtn.clearing', '.clearing-main-next',
          function (e) { this.nav(e, 'next') }.bind(this))
        .on('click.fndtn.clearing', '.clearing-main-prev',
          function (e) { this.nav(e, 'prev') }.bind(this))
        .on('click.fndtn.clearing', this.settings.close_selectors,
          function (e) { Foundation.libs.clearing.close(e, this) })
        .on('keydown.fndtn.clearing',
          function (e) { this.keydown(e) }.bind(this));

      $(window).on('resize.fndtn.clearing',
        function () { this.resize() }.bind(this));

      this.settings.init = true;
      return this;
    },

    swipe_events : function () {
      var self = this;

      $(this.scope)
        .on('touchstart.fndtn.clearing', '.visible-img', function(e) {
          if (!e.touches) { e = e.originalEvent; }
          var data = {
                start_page_x: e.touches[0].pageX,
                start_page_y: e.touches[0].pageY,
                start_time: (new Date()).getTime(),
                delta_x: 0,
                is_scrolling: undefined
              };

          $(this).data('swipe-transition', data);
          e.stopPropagation();
        })
        .on('touchmove.fndtn.clearing', '.visible-img', function(e) {
          if (!e.touches) { e = e.originalEvent; }
          // Ignore pinch/zoom events
          if(e.touches.length > 1 || e.scale && e.scale !== 1) return;

          var data = $(this).data('swipe-transition');

          if (typeof data === 'undefined') {
            data = {};
          }

          data.delta_x = e.touches[0].pageX - data.start_page_x;

          if ( typeof data.is_scrolling === 'undefined') {
            data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
          }

          if (!data.is_scrolling && !data.active) {
            e.preventDefault();
            var direction = (data.delta_x < 0) ? 'next' : 'prev';
            data.active = true;
            self.nav(e, direction);
          }
        })
        .on('touchend.fndtn.clearing', '.visible-img', function(e) {
          $(this).data('swipe-transition', {});
          e.stopPropagation();
        });
    },

    assemble : function ($li) {
      var $el = $li.parent();
      $el.after('<div id="foundationClearingHolder"></div>');

      var holder = $('#foundationClearingHolder'),
          settings = this.get_data($el),
          grid = $el.detach(),
          data = {
            grid: '<div class="carousel">' + this.outerHTML(grid[0]) + '</div>',
            viewing: settings.templates.viewing
          },
          wrapper = '<div class="clearing-assembled"><div>' + data.viewing +
            data.grid + '</div></div>';

      return holder.after(wrapper).remove();
    },

    // event callbacks

    open : function ($image, current, target) {
      var root = target.closest('.clearing-assembled'),
          container = root.find('div').first(),
          visible_image = container.find('.visible-img'),
          image = visible_image.find('img').not($image);

      if (!this.locked()) {
        // set the image to the selected thumbnail
        image
          .attr('src', this.load($image))
          .css('visibility', 'hidden');

        this.loaded(image, function () {
          image.css('visibility', 'visible');
          // toggle the gallery
          root.addClass('clearing-blackout');
          container.addClass('clearing-container');
          visible_image.show();
          this.fix_height(target)
            .caption(visible_image.find('.clearing-caption'), $image)
            .center(image)
            .shift(current, target, function () {
              target.siblings().removeClass('visible');
              target.addClass('visible');
            });
        }.bind(this));
      }
    },

    close : function (e, el) {
      e.preventDefault();

      var root = (function (target) {
            if (/blackout/.test(target.selector)) {
              return target;
            } else {
              return target.closest('.clearing-blackout');
            }
          }($(el))), container, visible_image;

      if (el === e.target && root) {
        container = root.find('div').first();
        visible_image = container.find('.visible-img');
        this.settings.prev_index = 0;
        root.find('ul[data-clearing]')
          .attr('style', '').closest('.clearing-blackout')
          .removeClass('clearing-blackout');
        container.removeClass('clearing-container');
        visible_image.hide();
      }

      return false;
    },

    is_open : function (current) {
      return current.parent().attr('style').length > 0;
    },

    keydown : function (e) {
      var clearing = $('.clearing-blackout').find('ul[data-clearing]');

      if (e.which === 39) this.go(clearing, 'next');
      if (e.which === 37) this.go(clearing, 'prev');
      if (e.which === 27) $('a.clearing-close').trigger('click');
    },

    nav : function (e, direction) {
      var clearing = $('.clearing-blackout').find('ul[data-clearing]');

      e.preventDefault();
      this.go(clearing, direction);
    },

    resize : function () {
      var image = $('.clearing-blackout .visible-img').find('img');

      if (image.length) {
        this.center(image);
      }
    },

    // visual adjustments
    fix_height : function (target) {
      var lis = target.parent().children(),
          self = this;

      lis.each(function () {
          var li = $(this),
              image = li.find('img');

          if (li.height() > self.outerHeight(image)) {
            li.addClass('fix-height');
          }
        })
        .closest('ul')
        .width(lis.length * 100 + '%');

      return this;
    },

    update_paddles : function (target) {
      var visible_image = target
        .closest('.carousel')
        .siblings('.visible-img');

      if (target.next().length > 0) {
        visible_image
          .find('.clearing-main-next')
          .removeClass('disabled');
      } else {
        visible_image
          .find('.clearing-main-next')
          .addClass('disabled');
      }

      if (target.prev().length > 0) {
        visible_image
          .find('.clearing-main-prev')
          .removeClass('disabled');
      } else {
        visible_image
          .find('.clearing-main-prev')
          .addClass('disabled');
      }
    },

    center : function (target) {
      if (!this.rtl) {
        target.css({
          marginLeft : -(this.outerWidth(target) / 2),
          marginTop : -(this.outerHeight(target) / 2)
        });
      } else {
        target.css({
          marginRight : -(this.outerWidth(target) / 2),
          marginTop : -(this.outerHeight(target) / 2)
        });
      }
      return this;
    },

    // image loading and preloading

    load : function ($image) {
      if ($image[0].nodeName === "A") {
        var href = $image.attr('href');
      } else {
        var href = $image.parent().attr('href');
      }

      this.preload($image);

      if (href) return href;
      return $image.attr('src');
    },

    preload : function ($image) {
      this
        .img($image.closest('li').next())
        .img($image.closest('li').prev());
    },

    loaded : function (image, callback) {
      // based on jquery.imageready.js
      // @weblinc, @jsantell, (c) 2012

      function loaded () {
        callback();
      }

      function bindLoad () {
        this.one('load', loaded);

        if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
          var src = this.attr( 'src' ),
              param = src.match( /\?/ ) ? '&' : '?';

          param += 'random=' + (new Date()).getTime();
          this.attr('src', src + param);
        }
      }

      if (!image.attr('src')) {
        loaded();
        return;
      }

      if (image[0].complete || image[0].readyState === 4) {
        loaded();
      } else {
        bindLoad.call(image);
      }
    },

    img : function (img) {
      if (img.length) {
        var new_img = new Image(),
            new_a = img.find('a');

        if (new_a.length) {
          new_img.src = new_a.attr('href');
        } else {
          new_img.src = img.find('img').attr('src');
        }
      }
      return this;
    },

    // image caption

    caption : function (container, $image) {
      var caption = $image.data('caption');

      if (caption) {
        container
          .html(caption)
          .show();
      } else {
        container
          .text('')
          .hide();
      }
      return this;
    },

    // directional methods

    go : function ($ul, direction) {
      var current = $ul.find('.visible'),
          target = current[direction]();

      if (target.length) {
        target
          .find('img')
          .trigger('click', [current, target]);
      }
    },

    shift : function (current, target, callback) {
      var clearing = target.parent(),
          old_index = this.settings.prev_index || target.index(),
          direction = this.direction(clearing, current, target),
          left = parseInt(clearing.css('left'), 10),
          width = this.outerWidth(target),
          skip_shift;

      // we use jQuery animate instead of CSS transitions because we
      // need a callback to unlock the next animation
      if (target.index() !== old_index && !/skip/.test(direction)){
        if (/left/.test(direction)) {
          this.lock();
          clearing.animate({left : left + width}, 300, this.unlock());
        } else if (/right/.test(direction)) {
          this.lock();
          clearing.animate({left : left - width}, 300, this.unlock());
        }
      } else if (/skip/.test(direction)) {
        // the target image is not adjacent to the current image, so
        // do we scroll right or not
        skip_shift = target.index() - this.settings.up_count;
        this.lock();

        if (skip_shift > 0) {
          clearing.animate({left : -(skip_shift * width)}, 300, this.unlock());
        } else {
          clearing.animate({left : 0}, 300, this.unlock());
        }
      }

      callback();
    },

    direction : function ($el, current, target) {
      var lis = $el.find('li'),
          li_width = this.outerWidth(lis) + (this.outerWidth(lis) / 4),
          up_count = Math.floor(this.outerWidth($('.clearing-container')) / li_width) - 1,
          target_index = lis.index(target),
          response;

      this.settings.up_count = up_count;

      if (this.adjacent(this.settings.prev_index, target_index)) {
        if ((target_index > up_count)
          && target_index > this.settings.prev_index) {
          response = 'right';
        } else if ((target_index > up_count - 1)
          && target_index <= this.settings.prev_index) {
          response = 'left';
        } else {
          response = false;
        }
      } else {
        response = 'skip';
      }

      this.settings.prev_index = target_index;

      return response;
    },

    adjacent : function (current_index, target_index) {
      for (var i = target_index + 1; i >= target_index - 1; i--) {
        if (i === current_index) return true;
      }
      return false;
    },

    // lock management

    lock : function () {
      this.settings.locked = true;
    },

    unlock : function () {
      this.settings.locked = false;
    },

    locked : function () {
      return this.settings.locked;
    },

    // plugin management/browser quirks

    outerHTML : function (el) {
      // support FireFox < 11
      return el.outerHTML || new XMLSerializer().serializeToString(el);
    },

    off : function () {
      $(this.scope).off('.fndtn.clearing');
      $(window).off('.fndtn.clearing');
      this.remove_data(); // empty settings cache
      this.settings.init = false;
    },

    reflow : function () {
      this.init();
    }
  };

}(Foundation.zj, this, this.document));
/*!
 * jQuery Cookie Plugin v1.3
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 *
 * Modified to work with Zepto.js by ZURB
 */

(function ($, document, undefined) {

  var pluses = /\+/g;

  function raw(s) {
    return s;
  }

  function decoded(s) {
    return decodeURIComponent(s.replace(pluses, ' '));
  }

  var config = $.cookie = function (key, value, options) {

    // write
    if (value !== undefined) {
      options = $.extend({}, config.defaults, options);

      if (value === null) {
        options.expires = -1;
      }

      if (typeof options.expires === 'number') {
        var days = options.expires, t = options.expires = new Date();
        t.setDate(t.getDate() + days);
      }

      value = config.json ? JSON.stringify(value) : String(value);

      return (document.cookie = [
        encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
        options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
        options.path    ? '; path=' + options.path : '',
        options.domain  ? '; domain=' + options.domain : '',
        options.secure  ? '; secure' : ''
      ].join(''));
    }

    // read
    var decode = config.raw ? raw : decoded;
    var cookies = document.cookie.split('; ');
    for (var i = 0, l = cookies.length; i < l; i++) {
      var parts = cookies[i].split('=');
      if (decode(parts.shift()) === key) {
        var cookie = decode(parts.join('='));
        return config.json ? JSON.parse(cookie) : cookie;
      }
    }

    return null;
  };

  config.defaults = {};

  $.removeCookie = function (key, options) {
    if ($.cookie(key) !== null) {
      $.cookie(key, null, options);
      return true;
    }
    return false;
  };

})(Foundation.zj, document);
/*jslint unparam: true, browser: true, indent: 2 */


;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.dropdown = {
    name : 'dropdown',

    version : '4.2.0',

    settings : {
      activeClass: 'open',
      is_hover: false,
      opened: function(){},
      closed: function(){}
    },

    init : function (scope, method, options) {
      this.scope = scope || this.scope;
      Foundation.inherit(this, 'throttle scrollLeft data_options');

      if (typeof method === 'object') {
        $.extend(true, this.settings, method);
      }

      if (typeof method !== 'string') {

        if (!this.settings.init) {
          this.events();
        }

        return this.settings.init;
      } else {
        return this[method].call(this, options);
      }
    },

    events : function () {
      var self = this;

      $(this.scope)
        .on('click.fndtn.dropdown', '[data-dropdown]', function (e) {
          var settings = $.extend({}, self.settings, self.data_options($(this)));
          e.preventDefault();

          if (!settings.is_hover) self.toggle($(this));
        })
        .on('mouseenter', '[data-dropdown]', function (e) {
          var settings = $.extend({}, self.settings, self.data_options($(this)));
          if (settings.is_hover) self.toggle($(this));
        })
        .on('mouseleave', '[data-dropdown-content]', function (e) {
          var target = $('[data-dropdown="' + $(this).attr('id') + '"]'),
              settings = $.extend({}, self.settings, self.data_options(target));
          if (settings.is_hover) self.close.call(self, $(this));
        })
        .on('opened.fndtn.dropdown', '[data-dropdown-content]', this.settings.opened)
        .on('closed.fndtn.dropdown', '[data-dropdown-content]', this.settings.closed);

      $('body').on('click.fndtn.dropdown', function (e) {
        var parent = $(e.target).closest('[data-dropdown-content]');

        if ($(e.target).data('dropdown')) {
          return;
        }
        if (parent.length > 0 && ($(e.target).is('[data-dropdown-content]') || $.contains(parent.first()[0], e.target))) {
          e.stopPropagation();
          return;
        }

        self.close.call(self, $('[data-dropdown-content]'));
      });

      $(window).on('resize.fndtn.dropdown', self.throttle(function () {
        self.resize.call(self);
      }, 50)).trigger('resize');

      this.settings.init = true;
    },

    close: function (dropdown) {
      var self = this;
      dropdown.each(function () {
        if ($(this).hasClass(self.settings.activeClass)) {
          $(this)
            .css(Foundation.rtl ? 'right':'left', '-99999px')
            .removeClass(self.settings.activeClass);
          $(this).trigger('closed');
        }
      });
    },

    open: function (dropdown, target) {
        this
          .css(dropdown
            .addClass(this.settings.activeClass), target);
        dropdown.trigger('opened');
    },

    toggle : function (target) {
      var dropdown = $('#' + target.data('dropdown'));

      this.close.call(this, $('[data-dropdown-content]').not(dropdown));

      if (dropdown.hasClass(this.settings.activeClass)) {
        this.close.call(this, dropdown);
      } else {
        this.close.call(this, $('[data-dropdown-content]'))
        this.open.call(this, dropdown, target);
      }
    },

    resize : function () {
      var dropdown = $('[data-dropdown-content].open'),
          target = $("[data-dropdown='" + dropdown.attr('id') + "']");

      if (dropdown.length && target.length) {
        this.css(dropdown, target);
      }
    },

    css : function (dropdown, target) {
      var offset_parent = dropdown.offsetParent();
      // temporary workaround until 4.2
      if (offset_parent.length > 0 && /body/i.test(dropdown.offsetParent()[0].nodeName)) {
        var position = target.offset();
        position.top -= dropdown.offsetParent().offset().top;
        position.left -= dropdown.offsetParent().offset().left;
      } else {
        var position = target.position();
      }

      if (this.small()) {
        dropdown.css({
          position : 'absolute',
          width: '95%',
          left: '2.5%',
          'max-width': 'none',
          top: position.top + this.outerHeight(target)
        });
      } else {
        if (!Foundation.rtl && $(window).width() > this.outerWidth(dropdown) + target.offset().left) {
          var left = position.left;
          if (dropdown.hasClass('right')) {
            dropdown.removeClass('right');
          }
        } else {
          if (!dropdown.hasClass('right')) {
            dropdown.addClass('right');
          }
          var left = position.left - (this.outerWidth(dropdown) - this.outerWidth(target));
        }

        dropdown.attr('style', '').css({
          position : 'absolute',
          top: position.top + this.outerHeight(target),
          left: left
        });
      }

      return dropdown;
    },

    small : function () {
      return $(window).width() < 768 || $('html').hasClass('lt-ie9');
    },

    off: function () {
      $(this.scope).off('.fndtn.dropdown');
      $('html, body').off('.fndtn.dropdown');
      $(window).off('.fndtn.dropdown');
      $('[data-dropdown-content]').off('.fndtn.dropdown');
      this.settings.init = false;
    },

    reflow : function () {}
  };
}(Foundation.zj, this, this.document));
(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.forms = {
    name: 'forms',

    version: '4.2.3',

    cache: {},

    settings: {
      disable_class: 'no-custom',
      last_combo : null
    },

    init: function (scope, method, options) {

      if (typeof method === 'object') {
        $.extend(true, this.settings, method);
      }

      if (typeof method !== 'string') {
        if (!this.settings.init) {
          this.events();
        }

        this.assemble();

        return this.settings.init;
      } else {
        return this[method].call(this, options);
      }
    },

    assemble: function () {
      $('form.custom input[type="radio"]', $(this.scope))
        .not('[data-customforms="disabled"]')
        .not('.' + this.settings.disable_class)
        .each(this.append_custom_markup);
      $('form.custom input[type="checkbox"]', $(this.scope))
        .not('[data-customforms="disabled"]')
        .not('.' + this.settings.disable_class)
        .each(this.append_custom_markup);
      $('form.custom select', $(this.scope))
        .not('[data-customforms="disabled"]')
        .not('.' + this.settings.disable_class)
        .not('[multiple=multiple]')
        .each(this.append_custom_select);
    },

    events: function () {
      var self = this;

      $(this.scope)
        .on('click.fndtn.forms', 'form.custom span.custom.checkbox', function (e) {
          e.preventDefault();
          e.stopPropagation();
          self.toggle_checkbox($(this));
        })
        .on('click.fndtn.forms', 'form.custom span.custom.radio', function (e) {
          e.preventDefault();
          e.stopPropagation();
          self.toggle_radio($(this));
        })
        .on('change.fndtn.forms', 'form.custom select', function (e, force_refresh) {
          if ($(this).is('[data-customforms="disabled"]')) return;
          self.refresh_custom_select($(this), force_refresh);
        })
        .on('click.fndtn.forms', 'form.custom label', function (e) {
          if ($(e.target).is('label')) {
            var $associatedElement = $('#' + self.escape($(this).attr('for'))).not('[data-customforms="disabled"]'),
              $customCheckbox,
              $customRadio;

            if ($associatedElement.length !== 0) {
              if ($associatedElement.attr('type') === 'checkbox') {
                e.preventDefault();
                $customCheckbox = $(this).find('span.custom.checkbox');
                //the checkbox might be outside after the label or inside of another element
                if ($customCheckbox.length === 0) {
                  $customCheckbox = $associatedElement.add(this).siblings('span.custom.checkbox').first();
                }
                self.toggle_checkbox($customCheckbox);
              } else if ($associatedElement.attr('type') === 'radio') {
                e.preventDefault();
                $customRadio = $(this).find('span.custom.radio');
                //the radio might be outside after the label or inside of another element
                if ($customRadio.length === 0) {
                  $customRadio = $associatedElement.add(this).siblings('span.custom.radio').first();
                }
                self.toggle_radio($customRadio);
              }
            }
          }
        })
        .on('mousedown.fndtn.forms', 'form.custom div.custom.dropdown', function () {
          return false;
        })
        .on('click.fndtn.forms', 'form.custom div.custom.dropdown a.current, form.custom div.custom.dropdown a.selector', function (e) {
          var $this = $(this),
              $dropdown = $this.closest('div.custom.dropdown'),
              $select = getFirstPrevSibling($dropdown, 'select');

          // make sure other dropdowns close
          if (!$dropdown.hasClass('open')) $(self.scope).trigger('click');

          e.preventDefault();
          if (false === $select.is(':disabled')) {
            $dropdown.toggleClass('open');

            if ($dropdown.hasClass('open')) {
              $(self.scope).on('click.fndtn.forms.customdropdown', function () {
                $dropdown.removeClass('open');
                $(self.scope).off('.fndtn.forms.customdropdown');
              });
            } else {
              $(self.scope).on('.fndtn.forms.customdropdown');
            }
            return false;
          }
        })
        .on('click.fndtn.forms touchend.fndtn.forms', 'form.custom div.custom.dropdown li', function (e) {
          var $this = $(this),
              $customDropdown = $this.closest('div.custom.dropdown'),
              $select = getFirstPrevSibling($customDropdown, 'select'),
              selectedIndex = 0;

          e.preventDefault();
          e.stopPropagation();

          if (!$(this).hasClass('disabled')) {
            $('div.dropdown').not($customDropdown).removeClass('open');

            var $oldThis = $this.closest('ul')
              .find('li.selected');
            $oldThis.removeClass('selected');

            $this.addClass('selected');

            $customDropdown.removeClass('open')
              .find('a.current')
              .text($this.text());

            $this.closest('ul').find('li').each(function (index) {
              if ($this[0] === this) {
                selectedIndex = index;
              }
            });
            $select[0].selectedIndex = selectedIndex;

            //store the old value in data
            $select.data('prevalue', $oldThis.html());
            $select.trigger('change');
          }
      });

      $(window).on('keydown', function (e) {
        var focus = document.activeElement,
            self = Foundation.libs.forms,
            dropdown = $('.custom.dropdown.open');

        if (dropdown.length > 0) {
          e.preventDefault();

          if (e.which === 13) {
            dropdown.find('li.selected').trigger('click');
          }

          if (e.which === 27) {
            dropdown.removeClass('open');
          }

          if (e.which >= 65 && e.which <= 90) {
            var next = self.go_to(dropdown, e.which),
                current = dropdown.find('li.selected');

            if (next) {
              current.removeClass('selected');
              self.scrollTo(next.addClass('selected'), 300);
            }
          }

          if (e.which === 38) {
            var current = dropdown.find('li.selected'),
                prev = current.prev(':not(.disabled)');

            if (prev.length > 0) {
              prev.parent()[0].scrollTop = prev.parent().scrollTop() - self.outerHeight(prev);
              current.removeClass('selected');
              prev.addClass('selected');
            }
          } else if (e.which === 40) {
            var current = dropdown.find('li.selected'),
                next = current.next(':not(.disabled)');

            if (next.length > 0) {
              next.parent()[0].scrollTop = next.parent().scrollTop() + self.outerHeight(next);
              current.removeClass('selected');
              next.addClass('selected');
            }
          }
        }
      });

      this.settings.init = true;
    },

    go_to: function (dropdown, character) {
      var lis = dropdown.find('li'),
          count = lis.length;

      if (count > 0) {
        for (var i = 0; i < count; i++) {
          var first_letter = lis.eq(i).text().charAt(0).toLowerCase();
          if (first_letter === String.fromCharCode(character).toLowerCase()) return lis.eq(i);
        }
      }
    },

    scrollTo: function (el, duration) {
      if (duration < 0) return;
      var parent = el.parent();
      var li_height = this.outerHeight(el);
      var difference = (li_height * (el.index())) - parent.scrollTop();
      var perTick = difference / duration * 10;

      this.scrollToTimerCache = setTimeout(function () {
        if (!isNaN(parseInt(perTick, 10))) {
          parent[0].scrollTop = parent.scrollTop() + perTick;
          this.scrollTo(el, duration - 10);
        }
      }.bind(this), 10);
    },

    append_custom_markup: function (idx, sel) {
      var $this = $(sel),
          type = $this.attr('type'),
          $span = $this.next('span.custom.' + type);
          
      if (!$this.parent().hasClass('switch')) {
        $this.addClass('hidden-field');
      }

      if ($span.length === 0) {
        $span = $('<span class="custom ' + type + '"></span>').insertAfter($this);
      }

      $span.toggleClass('checked', $this.is(':checked'));
      $span.toggleClass('disabled', $this.is(':disabled'));
    },

    append_custom_select: function (idx, sel) {
        var self = Foundation.libs.forms,
            $this = $(sel),
            $customSelect = $this.next('div.custom.dropdown'),
            $customList = $customSelect.find('ul'),
            $selectCurrent = $customSelect.find(".current"),
            $selector = $customSelect.find(".selector"),
            $options = $this.find('option'),
            $selectedOption = $options.filter(':selected'),
            copyClasses = $this.attr('class') ? $this.attr('class').split(' ') : [],
            maxWidth = 0,
            liHtml = '',
            $listItems,
            $currentSelect = false;

        if ($customSelect.length === 0) {
          var customSelectSize = $this.hasClass('small') ? 'small' : $this.hasClass('medium') ? 'medium' : $this.hasClass('large') ? 'large' : $this.hasClass('expand') ? 'expand' : '';

          $customSelect = $('<div class="' + ['custom', 'dropdown', customSelectSize].concat(copyClasses).filter(function (item, idx, arr) {
            if (item === '') return false;
            return arr.indexOf(item) === idx;
          }).join(' ') + '"><a href="#" class="selector"></a><ul /></div>');

          $selector = $customSelect.find(".selector");
          $customList = $customSelect.find("ul");

          liHtml = $options.map(function () {
            var copyClasses = $(this).attr('class') ? $(this).attr('class') : '';
            return "<li class='" + copyClasses + "'>" + $(this).html() + "</li>";
          }).get().join('');

          $customList.append(liHtml);

          $currentSelect = $customSelect
            .prepend('<a href="#" class="current">' + $selectedOption.html() + '</a>')
            .find(".current");

          $this.after($customSelect)
            .addClass('hidden-field');
        } else {
          liHtml = $options.map(function () {
              return "<li>" + $(this).html() + "</li>";
            })
            .get().join('');

          $customList.html('')
            .append(liHtml);

        } // endif $customSelect.length === 0

        self.assign_id($this, $customSelect);
        $customSelect.toggleClass('disabled', $this.is(':disabled'));
        $listItems = $customList.find('li');

        // cache list length
        self.cache[$customSelect.data('id')] = $listItems.length;

        $options.each(function (index) {
          if (this.selected) {
            $listItems.eq(index).addClass('selected');

            if ($currentSelect) {
              $currentSelect.html($(this).html());
            }
          }
          if ($(this).is(':disabled')) {
            $listItems.eq(index).addClass('disabled');
          }
        });

        //
        // If we're not specifying a predetermined form size.
        //
        if (!$customSelect.is('.small, .medium, .large, .expand')) {

          // ------------------------------------------------------------------------------------
          // This is a work-around for when elements are contained within hidden parents.
          // For example, when custom-form elements are inside of a hidden reveal modal.
          //
          // We need to display the current custom list element as well as hidden parent elements
          // in order to properly calculate the list item element's width property.
          // -------------------------------------------------------------------------------------

          $customSelect.addClass('open');
          //
          // Quickly, display all parent elements.
          // This should help us calcualate the width of the list item's within the drop down.
          //
          var self = Foundation.libs.forms;
          self.hidden_fix.adjust($customList);

          maxWidth = (self.outerWidth($listItems) > maxWidth) ? self.outerWidth($listItems) : maxWidth;

          Foundation.libs.forms.hidden_fix.reset();

          $customSelect.removeClass('open');

        } // endif

    },

    assign_id: function ($select, $customSelect) {
      var id = [+new Date(), Foundation.random_str(5)].join('-');
      $select.attr('data-id', id);
      $customSelect.attr('data-id', id);
    },

    refresh_custom_select: function ($select, force_refresh) {
      var self = this;
      var maxWidth = 0,
          $customSelect = $select.next(),
          $options = $select.find('option'),
          $listItems = $customSelect.find('li');

      if ($listItems.length !== this.cache[$customSelect.data('id')] || force_refresh) {
        $customSelect.find('ul').html('');

        $options.each(function () {
          var $li = $('<li>' + $(this).html() + '</li>');
          $customSelect.find('ul').append($li);
        });

        // re-populate
        $options.each(function (index) {
          if (this.selected) {
            $customSelect.find('li').eq(index).addClass('selected');
            $customSelect.find('.current').html($(this).html());
          }
          if ($(this).is(':disabled')) {
            $customSelect.find('li').eq(index).addClass('disabled');
          }
        });

        // fix width
        $customSelect.removeAttr('style')
          .find('ul').removeAttr('style');
        $customSelect.find('li').each(function () {
          $customSelect.addClass('open');
          if (self.outerWidth($(this)) > maxWidth) {
            maxWidth = self.outerWidth($(this));
          }
          $customSelect.removeClass('open');
        });

        $listItems = $customSelect.find('li');
        // cache list length
        this.cache[$customSelect.data('id')] = $listItems.length;
      }
    },

    toggle_checkbox: function ($element) {
      var $input = $element.prev(),
          input = $input[0];

      if (false === $input.is(':disabled')) {
        input.checked = ((input.checked) ? false : true);
        $element.toggleClass('checked');

        $input.trigger('change');
      }
    },

    toggle_radio: function ($element) {
        var $input = $element.prev(),
            $form = $input.closest('form.custom'),
            input = $input[0];

        if (false === $input.is(':disabled')) {
          $form.find('input[type="radio"][name="' + this.escape($input.attr('name')) + '"]')
            .next().not($element).removeClass('checked');

          if (!$element.hasClass('checked')) {
            $element.toggleClass('checked');
          }

          input.checked = $element.hasClass('checked');

          $input.trigger('change');
        }
    },

    escape: function (text) {
      if (!text) return '';
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    },

    hidden_fix: {
        /**
         * Sets all hidden parent elements and self to visibile.
         *
         * @method adjust
         * @param {jQuery Object} $child
         */

        // We'll use this to temporarily store style properties.
        tmp: [],

        // We'll use this to set hidden parent elements.
        hidden: null,

        adjust: function ($child) {
          // Internal reference.
          var _self = this;

          // Set all hidden parent elements, including this element.
          _self.hidden = $child.parents();
          _self.hidden = _self.hidden.add($child).filter(":hidden");

          // Loop through all hidden elements.
          _self.hidden.each(function () {

            // Cache the element.
            var $elem = $(this);

            // Store the style attribute.
            // Undefined if element doesn't have a style attribute.
            _self.tmp.push($elem.attr('style'));

            // Set the element's display property to block,
            // but ensure it's visibility is hidden.
            $elem.css({
                'visibility': 'hidden',
                'display': 'block'
            });
          });

        }, // end adjust

        /**
         * Resets the elements previous state.
         *
         * @method reset
         */
        reset: function () {
          // Internal reference.
          var _self = this;
          // Loop through our hidden element collection.
          _self.hidden.each(function (i) {
            // Cache this element.
            var $elem = $(this),
                _tmp = _self.tmp[i]; // Get the stored 'style' value for this element.

            // If the stored value is undefined.
            if (_tmp === undefined)
            // Remove the style attribute.
            $elem.removeAttr('style');
            else
            // Otherwise, reset the element style attribute.
            $elem.attr('style', _tmp);
          });
          // Reset the tmp array.
          _self.tmp = [];
          // Reset the hidden elements variable.
          _self.hidden = null;

        } // end reset
    },

    off: function () {
      $(this.scope).off('.fndtn.forms');
    },

    reflow : function () {}
  };

  var getFirstPrevSibling = function($el, selector) {
    var $el = $el.prev();
    while ($el.length) {
      if ($el.is(selector)) return $el;
      $el = $el.prev();
    }
    return $();
  };
}(Foundation.zj, this, this.document));
/*jslint unparam: true, browser: true, indent: 2 */


(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.joyride = {
    name: 'joyride',

    version : '4.2.2',

    defaults : {
      expose               : false,      // turn on or off the expose feature
      modal                : false,      // Whether to cover page with modal during the tour
      tipLocation          : 'bottom',  // 'top' or 'bottom' in relation to parent
      nubPosition          : 'auto',    // override on a per tooltip bases
      scrollSpeed          : 300,       // Page scrolling speed in milliseconds, 0 = no scroll animation
      timer                : 0,         // 0 = no timer , all other numbers = timer in milliseconds
      startTimerOnClick    : true,      // true or false - true requires clicking the first button start the timer
      startOffset          : 0,         // the index of the tooltip you want to start on (index of the li)
      nextButton           : true,      // true or false to control whether a next button is used
      tipAnimation         : 'fade',    // 'pop' or 'fade' in each tip
      pauseAfter           : [],        // array of indexes where to pause the tour after
      exposed              : [],        // array of expose elements
      tipAnimationFadeSpeed: 300,       // when tipAnimation = 'fade' this is speed in milliseconds for the transition
      cookieMonster        : false,     // true or false to control whether cookies are used
      cookieName           : 'joyride', // Name the cookie you'll use
      cookieDomain         : false,     // Will this cookie be attached to a domain, ie. '.notableapp.com'
      cookieExpires        : 365,       // set when you would like the cookie to expire.
      tipContainer         : 'body',    // Where will the tip be attached
      postRideCallback     : function (){},    // A method to call once the tour closes (canceled or complete)
      postStepCallback     : function (){},    // A method to call after each step
      preStepCallback      : function (){},    // A method to call before each step
      preRideCallback      : function (){},    // A method to call before the tour starts (passed index, tip, and cloned exposed element)
      postExposeCallback   : function (){},    // A method to call after an element has been exposed
      template : { // HTML segments for tip layout
        link    : '<a href="#close" class="joyride-close-tip">&times;</a>',
        timer   : '<div class="joyride-timer-indicator-wrap"><span class="joyride-timer-indicator"></span></div>',
        tip     : '<div class="joyride-tip-guide"><span class="joyride-nub"></span></div>',
        wrapper : '<div class="joyride-content-wrapper"></div>',
        button  : '<a href="#" class="small button joyride-next-tip"></a>',
        modal   : '<div class="joyride-modal-bg"></div>',
        expose  : '<div class="joyride-expose-wrapper"></div>',
        exposeCover: '<div class="joyride-expose-cover"></div>'
      },
      exposeAddClass  	: ''		// One or more space-separated class names to be added to exposed element
    },

    settings : {},

    init : function (scope, method, options) {
      this.scope = scope || this.scope;
      Foundation.inherit(this, 'throttle data_options scrollTo scrollLeft delay');

      if (typeof method === 'object') {
        $.extend(true, this.settings, this.defaults, method);
      } else {
        $.extend(true, this.settings, this.defaults, options);
      }

      if (typeof method !== 'string') {
        if (!this.settings.init) this.events();

        return this.settings.init;
      } else {
        return this[method].call(this, options);
      }
    },

    events : function () {
      var self = this;

      $(this.scope)
        .on('click.joyride', '.joyride-next-tip, .joyride-modal-bg', function (e) {
          e.preventDefault();

          if (this.settings.$li.next().length < 1) {
            this.end();
          } else if (this.settings.timer > 0) {
            clearTimeout(this.settings.automate);
            this.hide();
            this.show();
            this.startTimer();
          } else {
            this.hide();
            this.show();
          }

        }.bind(this))

        .on('click.joyride', '.joyride-close-tip', function (e) {
          e.preventDefault();
          this.end();
        }.bind(this));

      $(window).on('resize.fndtn.joyride', self.throttle(function () {
        if ($('[data-joyride]').length > 0 && self.settings.$next_tip) {
          if (self.settings.exposed.length > 0) {
            var $els = $(self.settings.exposed);

            $els.each(function () {
              var $this = $(this);
              self.un_expose($this);
              self.expose($this);
            });
          }

          if (self.is_phone()) {
            self.pos_phone();
          } else {
            self.pos_default(false, true);
          }
        }
      }, 100));

      this.settings.init = true;
    },

    start : function () {
      var self = this,
          $this = $(this.scope).find('[data-joyride]'),
          integer_settings = ['timer', 'scrollSpeed', 'startOffset', 'tipAnimationFadeSpeed', 'cookieExpires'],
          int_settings_count = integer_settings.length;

      if (!this.settings.init) this.init();

      // non configureable settings
      this.settings.$content_el = $this;
      this.settings.$body = $(this.settings.tipContainer);
      this.settings.body_offset = $(this.settings.tipContainer).position();
      this.settings.$tip_content = this.settings.$content_el.find('> li');
      this.settings.paused = false;
      this.settings.attempts = 0;

      this.settings.tipLocationPatterns = {
        top: ['bottom'],
        bottom: [], // bottom should not need to be repositioned
        left: ['right', 'top', 'bottom'],
        right: ['left', 'top', 'bottom']
      };

      // can we create cookies?
      if (typeof $.cookie !== 'function') {
        this.settings.cookieMonster = false;
      }

      // generate the tips and insert into dom.
      if (!this.settings.cookieMonster || this.settings.cookieMonster && $.cookie(this.settings.cookieName) === null) {
        this.settings.$tip_content.each(function (index) {
          var $this = $(this);
          $.extend(true, self.settings, self.data_options($this));
          // Make sure that settings parsed from data_options are integers where necessary
          for (var i = int_settings_count - 1; i >= 0; i--) {
            self.settings[integer_settings[i]] = parseInt(self.settings[integer_settings[i]], 10);
          }
          self.create({$li : $this, index : index});
        });

        // show first tip
        if (!this.settings.startTimerOnClick && this.settings.timer > 0) {
          this.show('init');
          this.startTimer();
        } else {
          this.show('init');
        }

      }
    },

    resume : function () {
      this.set_li();
      this.show();
    },

    tip_template : function (opts) {
      var $blank, content;

      opts.tip_class = opts.tip_class || '';

      $blank = $(this.settings.template.tip).addClass(opts.tip_class);
      content = $.trim($(opts.li).html()) +
        this.button_text(opts.button_text) +
        this.settings.template.link +
        this.timer_instance(opts.index);

      $blank.append($(this.settings.template.wrapper));
      $blank.first().attr('data-index', opts.index);
      $('.joyride-content-wrapper', $blank).append(content);

      return $blank[0];
    },

    timer_instance : function (index) {
      var txt;

      if ((index === 0 && this.settings.startTimerOnClick && this.settings.timer > 0) || this.settings.timer === 0) {
        txt = '';
      } else {
        txt = this.outerHTML($(this.settings.template.timer)[0]);
      }
      return txt;
    },

    button_text : function (txt) {
      if (this.settings.nextButton) {
        txt = $.trim(txt) || 'Next';
        txt = this.outerHTML($(this.settings.template.button).append(txt)[0]);
      } else {
        txt = '';
      }
      return txt;
    },

    create : function (opts) {
      var buttonText = opts.$li.attr('data-button') || opts.$li.attr('data-text'),
        tipClass = opts.$li.attr('class'),
        $tip_content = $(this.tip_template({
          tip_class : tipClass,
          index : opts.index,
          button_text : buttonText,
          li : opts.$li
        }));

      $(this.settings.tipContainer).append($tip_content);
    },

    show : function (init) {
      var $timer = null;

      // are we paused?
      if (this.settings.$li === undefined
        || ($.inArray(this.settings.$li.index(), this.settings.pauseAfter) === -1)) {

        // don't go to the next li if the tour was paused
        if (this.settings.paused) {
          this.settings.paused = false;
        } else {
          this.set_li(init);
        }

        this.settings.attempts = 0;

        if (this.settings.$li.length && this.settings.$target.length > 0) {
          if (init) { //run when we first start
            this.settings.preRideCallback(this.settings.$li.index(), this.settings.$next_tip);
            if (this.settings.modal) {
              this.show_modal();
            }
          }

          this.settings.preStepCallback(this.settings.$li.index(), this.settings.$next_tip);

          if (this.settings.modal && this.settings.expose) {
            this.expose();
          }

          this.settings.tipSettings = $.extend(this.settings, this.data_options(this.settings.$li));

          this.settings.timer = parseInt(this.settings.timer, 10);

          this.settings.tipSettings.tipLocationPattern = this.settings.tipLocationPatterns[this.settings.tipSettings.tipLocation];

          // scroll if not modal
          if (!/body/i.test(this.settings.$target.selector)) {
            this.scroll_to();
          }

          if (this.is_phone()) {
            this.pos_phone(true);
          } else {
            this.pos_default(true);
          }

          $timer = this.settings.$next_tip.find('.joyride-timer-indicator');

          if (/pop/i.test(this.settings.tipAnimation)) {

            $timer.width(0);

            if (this.settings.timer > 0) {

              this.settings.$next_tip.show();

              this.delay(function () {
                $timer.animate({
                  width: $timer.parent().width()
                }, this.settings.timer, 'linear');
              }.bind(this), this.settings.tipAnimationFadeSpeed);

            } else {
              this.settings.$next_tip.show();

            }


          } else if (/fade/i.test(this.settings.tipAnimation)) {

            $timer.width(0);

            if (this.settings.timer > 0) {

              this.settings.$next_tip
                .fadeIn(this.settings.tipAnimationFadeSpeed)
                .show();

              this.delay(function () {
                $timer.animate({
                  width: $timer.parent().width()
                }, this.settings.timer, 'linear');
              }.bind(this), this.settings.tipAnimationFadeSpeed);

            } else {
              this.settings.$next_tip.fadeIn(this.settings.tipAnimationFadeSpeed);

            }
          }

          this.settings.$current_tip = this.settings.$next_tip;

        // skip non-existant targets
        } else if (this.settings.$li && this.settings.$target.length < 1) {

          this.show();

        } else {

          this.end();

        }
      } else {

        this.settings.paused = true;

      }

    },

    is_phone : function () {
      if (Modernizr) {
        return Modernizr.mq('only screen and (max-width: 767px)') || $('.lt-ie9').length > 0;
      }

      return (this.settings.$window.width() < 767);
    },

    hide : function () {
      if (this.settings.modal && this.settings.expose) {
        this.un_expose();
      }

      if (!this.settings.modal) {
        $('.joyride-modal-bg').hide();
      }
      this.settings.$current_tip.hide();
      this.settings.postStepCallback(this.settings.$li.index(),
        this.settings.$current_tip);
    },

    set_li : function (init) {
      if (init) {
        this.settings.$li = this.settings.$tip_content.eq(this.settings.startOffset);
        this.set_next_tip();
        this.settings.$current_tip = this.settings.$next_tip;
      } else {
        this.settings.$li = this.settings.$li.next();
        this.set_next_tip();
      }

      this.set_target();
    },

    set_next_tip : function () {
      this.settings.$next_tip = $(".joyride-tip-guide[data-index='" + this.settings.$li.index() + "']");
      this.settings.$next_tip.data('closed', '');
    },

    set_target : function () {
      var cl = this.settings.$li.attr('data-class'),
          id = this.settings.$li.attr('data-id'),
          $sel = function () {
            if (id) {
              return $(document.getElementById(id));
            } else if (cl) {
              return $('.' + cl).first();
            } else {
              return $('body');
            }
          };

      this.settings.$target = $sel();
    },

    scroll_to : function () {
      var window_half, tipOffset;

      window_half = $(window).height() / 2;
      tipOffset = Math.ceil(this.settings.$target.offset().top - window_half + this.outerHeight(this.settings.$next_tip));
      if (tipOffset > 0) {
        this.scrollTo($('html, body'), tipOffset, this.settings.scrollSpeed);
      }
    },

    paused : function () {
      return ($.inArray((this.settings.$li.index() + 1), this.settings.pauseAfter) === -1);
    },

    restart : function () {
      this.hide();
      this.settings.$li = undefined;
      this.show('init');
    },

    pos_default : function (init, resizing) {
      var half_fold = Math.ceil($(window).height() / 2),
          tip_position = this.settings.$next_tip.offset(),
          $nub = this.settings.$next_tip.find('.joyride-nub'),
          nub_width = Math.ceil(this.outerWidth($nub) / 2),
          nub_height = Math.ceil(this.outerHeight($nub) / 2),
          toggle = init || false;

      // tip must not be "display: none" to calculate position
      if (toggle) {
        this.settings.$next_tip.css('visibility', 'hidden');
        this.settings.$next_tip.show();
      }

      if (typeof resizing === 'undefined') {
        resizing = false;
      }

      if (!/body/i.test(this.settings.$target.selector)) {

          if (this.bottom()) {
            var leftOffset = this.settings.$target.offset().left;
            if (Foundation.rtl) {
              leftOffset = this.settings.$target.offset().width - this.settings.$next_tip.width() + leftOffset;
            }
            this.settings.$next_tip.css({
              top: (this.settings.$target.offset().top + nub_height + this.outerHeight(this.settings.$target)),
              left: leftOffset});

            this.nub_position($nub, this.settings.tipSettings.nubPosition, 'top');

          } else if (this.top()) {
            var leftOffset = this.settings.$target.offset().left;
            if (Foundation.rtl) {
              leftOffset = this.settings.$target.offset().width - this.settings.$next_tip.width() + leftOffset;
            }
            this.settings.$next_tip.css({
              top: (this.settings.$target.offset().top - this.outerHeight(this.settings.$next_tip) - nub_height),
              left: leftOffset});

            this.nub_position($nub, this.settings.tipSettings.nubPosition, 'bottom');

          } else if (this.right()) {

            this.settings.$next_tip.css({
              top: this.settings.$target.offset().top,
              left: (this.outerWidth(this.settings.$target) + this.settings.$target.offset().left + nub_width)});

            this.nub_position($nub, this.settings.tipSettings.nubPosition, 'left');

          } else if (this.left()) {

            this.settings.$next_tip.css({
              top: this.settings.$target.offset().top,
              left: (this.settings.$target.offset().left - this.outerWidth(this.settings.$next_tip) - nub_width)});

            this.nub_position($nub, this.settings.tipSettings.nubPosition, 'right');

          }

          if (!this.visible(this.corners(this.settings.$next_tip)) && this.settings.attempts < this.settings.tipSettings.tipLocationPattern.length) {

            $nub.removeClass('bottom')
              .removeClass('top')
              .removeClass('right')
              .removeClass('left');

            this.settings.tipSettings.tipLocation = this.settings.tipSettings.tipLocationPattern[this.settings.attempts];

            this.settings.attempts++;

            this.pos_default();

          }

      } else if (this.settings.$li.length) {

        this.pos_modal($nub);

      }

      if (toggle) {
        this.settings.$next_tip.hide();
        this.settings.$next_tip.css('visibility', 'visible');
      }

    },

    pos_phone : function (init) {
      var tip_height = this.outerHeight(this.settings.$next_tip),
          tip_offset = this.settings.$next_tip.offset(),
          target_height = this.outerHeight(this.settings.$target),
          $nub = $('.joyride-nub', this.settings.$next_tip),
          nub_height = Math.ceil(this.outerHeight($nub) / 2),
          toggle = init || false;

      $nub.removeClass('bottom')
        .removeClass('top')
        .removeClass('right')
        .removeClass('left');

      if (toggle) {
        this.settings.$next_tip.css('visibility', 'hidden');
        this.settings.$next_tip.show();
      }

      if (!/body/i.test(this.settings.$target.selector)) {

        if (this.top()) {

            this.settings.$next_tip.offset({top: this.settings.$target.offset().top - tip_height - nub_height});
            $nub.addClass('bottom');

        } else {

          this.settings.$next_tip.offset({top: this.settings.$target.offset().top + target_height + nub_height});
          $nub.addClass('top');

        }

      } else if (this.settings.$li.length) {
        this.pos_modal($nub);
      }

      if (toggle) {
        this.settings.$next_tip.hide();
        this.settings.$next_tip.css('visibility', 'visible');
      }
    },

    pos_modal : function ($nub) {
      this.center();
      $nub.hide();

      this.show_modal();
    },

    show_modal : function () {
      if (!this.settings.$next_tip.data('closed')) {
        var joyridemodalbg =  $('.joyride-modal-bg');
        if (joyridemodalbg.length < 1) {
          $('body').append(this.settings.template.modal).show();
        }

        if (/pop/i.test(this.settings.tipAnimation)) {
            joyridemodalbg.show();
        } else {
            joyridemodalbg.fadeIn(this.settings.tipAnimationFadeSpeed);
        }
      }
    },

    expose : function () {
      var expose,
          exposeCover,
          el,
          origCSS,
          origClasses,
          randId = 'expose-'+Math.floor(Math.random()*10000);

      if (arguments.length > 0 && arguments[0] instanceof $) {
        el = arguments[0];
      } else if(this.settings.$target && !/body/i.test(this.settings.$target.selector)){
        el = this.settings.$target;
      }  else {
        return false;
      }

      if(el.length < 1){
        if(window.console){
          console.error('element not valid', el);
        }
        return false;
      }

      expose = $(this.settings.template.expose);
      this.settings.$body.append(expose);
      expose.css({
        top: el.offset().top,
        left: el.offset().left,
        width: this.outerWidth(el, true),
        height: this.outerHeight(el, true)
      });

      exposeCover = $(this.settings.template.exposeCover);

      origCSS = {
        zIndex: el.css('z-index'),
        position: el.css('position')
      };
      
      origClasses = el.attr('class') == null ? '' : el.attr('class');

      el.css('z-index',parseInt(expose.css('z-index'))+1);

      if (origCSS.position == 'static') {
        el.css('position','relative');
      }

      el.data('expose-css',origCSS);
      el.data('orig-class', origClasses);
      el.attr('class', origClasses + ' ' + this.settings.exposeAddClass);

      exposeCover.css({
        top: el.offset().top,
        left: el.offset().left,
        width: this.outerWidth(el, true),
        height: this.outerHeight(el, true)
      });

      this.settings.$body.append(exposeCover);
      expose.addClass(randId);
      exposeCover.addClass(randId);
      el.data('expose', randId);
      this.settings.postExposeCallback(this.settings.$li.index(), this.settings.$next_tip, el);
      this.add_exposed(el);
    },

    un_expose : function () {
      var exposeId,
          el,
          expose ,
          origCSS,
          origClasses,
          clearAll = false;

      if (arguments.length > 0 && arguments[0] instanceof $) {
        el = arguments[0];
      } else if(this.settings.$target && !/body/i.test(this.settings.$target.selector)){
        el = this.settings.$target;
      }  else {
        return false;
      }

      if(el.length < 1){
        if (window.console) {
          console.error('element not valid', el);
        }
        return false;
      }

      exposeId = el.data('expose');
      expose = $('.' + exposeId);

      if (arguments.length > 1) {
        clearAll = arguments[1];
      }

      if (clearAll === true) {
        $('.joyride-expose-wrapper,.joyride-expose-cover').remove();
      } else {
        expose.remove();
      }

      origCSS = el.data('expose-css');

      if (origCSS.zIndex == 'auto') {
        el.css('z-index', '');
      } else {
        el.css('z-index', origCSS.zIndex);
      }

      if (origCSS.position != el.css('position')) {
        if(origCSS.position == 'static') {// this is default, no need to set it.
          el.css('position', '');
        } else {
          el.css('position', origCSS.position);
        }
      }
      
      origClasses = el.data('orig-class');
      el.attr('class', origClasses);
      el.removeData('orig-classes');

      el.removeData('expose');
      el.removeData('expose-z-index');
      this.remove_exposed(el);
    },

    add_exposed: function(el){
      this.settings.exposed = this.settings.exposed || [];
      if (el instanceof $ || typeof el === 'object') {
        this.settings.exposed.push(el[0]);
      } else if (typeof el == 'string') {
        this.settings.exposed.push(el);
      }
    },

    remove_exposed: function(el){
      var search, count;
      if (el instanceof $) {
        search = el[0]
      } else if (typeof el == 'string'){
        search = el;
      }

      this.settings.exposed = this.settings.exposed || [];
      count = this.settings.exposed.length;

      for (var i=0; i < count; i++) {
        if (this.settings.exposed[i] == search) {
          this.settings.exposed.splice(i, 1);
          return;
        }
      }
    },

    center : function () {
      var $w = $(window);

      this.settings.$next_tip.css({
        top : ((($w.height() - this.outerHeight(this.settings.$next_tip)) / 2) + $w.scrollTop()),
        left : ((($w.width() - this.outerWidth(this.settings.$next_tip)) / 2) + this.scrollLeft($w))
      });

      return true;
    },

    bottom : function () {
      return /bottom/i.test(this.settings.tipSettings.tipLocation);
    },

    top : function () {
      return /top/i.test(this.settings.tipSettings.tipLocation);
    },

    right : function () {
      return /right/i.test(this.settings.tipSettings.tipLocation);
    },

    left : function () {
      return /left/i.test(this.settings.tipSettings.tipLocation);
    },

    corners : function (el) {
      var w = $(window),
          window_half = w.height() / 2,
          //using this to calculate since scroll may not have finished yet.
          tipOffset = Math.ceil(this.settings.$target.offset().top - window_half + this.settings.$next_tip.outerHeight()),
          right = w.width() + this.scrollLeft(w),
          offsetBottom =  w.height() + tipOffset,
          bottom = w.height() + w.scrollTop(),
          top = w.scrollTop();

      if (tipOffset < top) {
        if (tipOffset < 0) {
          top = 0;
        } else {
          top = tipOffset;
        }
      }

      if (offsetBottom > bottom) {
        bottom = offsetBottom;
      }

      return [
        el.offset().top < top,
        right < el.offset().left + el.outerWidth(),
        bottom < el.offset().top + el.outerHeight(),
        this.scrollLeft(w) > el.offset().left
      ];
    },

    visible : function (hidden_corners) {
      var i = hidden_corners.length;

      while (i--) {
        if (hidden_corners[i]) return false;
      }

      return true;
    },

    nub_position : function (nub, pos, def) {
      if (pos === 'auto') {
        nub.addClass(def);
      } else {
        nub.addClass(pos);
      }
    },

    startTimer : function () {
      if (this.settings.$li.length) {
        this.settings.automate = setTimeout(function () {
          this.hide();
          this.show();
          this.startTimer();
        }.bind(this), this.settings.timer);
      } else {
        clearTimeout(this.settings.automate);
      }
    },

    end : function () {
      if (this.settings.cookieMonster) {
        $.cookie(this.settings.cookieName, 'ridden', { expires: this.settings.cookieExpires, domain: this.settings.cookieDomain });
      }

      if (this.settings.timer > 0) {
        clearTimeout(this.settings.automate);
      }

      if (this.settings.modal && this.settings.expose) {
        this.un_expose();
      }

      this.settings.$next_tip.data('closed', true);

      $('.joyride-modal-bg').hide();
      this.settings.$current_tip.hide();
      this.settings.postStepCallback(this.settings.$li.index(), this.settings.$current_tip);
      this.settings.postRideCallback(this.settings.$li.index(), this.settings.$current_tip);
      $('.joyride-tip-guide').remove();
    },

    outerHTML : function (el) {
      // support FireFox < 11
      return el.outerHTML || new XMLSerializer().serializeToString(el);
    },

    off : function () {
      $(this.scope).off('.joyride');
      $(window).off('.joyride');
      $('.joyride-close-tip, .joyride-next-tip, .joyride-modal-bg').off('.joyride');
      $('.joyride-tip-guide, .joyride-modal-bg').remove();
      clearTimeout(this.settings.automate);
      this.settings = {};
    },

    reflow : function () {}
  };
}(Foundation.zj, this, this.document));
/*jslint unparam: true, browser: true, indent: 2 */


;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.magellan = {
    name : 'magellan',

    version : '4.2.2',

    settings : {
      activeClass: 'active'
    },

    init : function (scope, method, options) {
      this.scope = scope || this.scope;
      Foundation.inherit(this, 'data_options');

      if (typeof method === 'object') {
        $.extend(true, this.settings, method);
      }

      if (typeof method !== 'string') {
        if (!this.settings.init) {
          this.fixed_magellan = $("[data-magellan-expedition]");
          this.set_threshold();
          this.last_destination = $('[data-magellan-destination]').last();
          this.events();
        }

        return this.settings.init;
      } else {
        return this[method].call(this, options);
      }
    },

    events : function () {
      var self = this;
      $(this.scope).on('arrival.fndtn.magellan', '[data-magellan-arrival]', function (e) {
        var $destination = $(this),
            $expedition = $destination.closest('[data-magellan-expedition]'),
            activeClass = $expedition.attr('data-magellan-active-class') 
              || self.settings.activeClass;

          $destination
            .closest('[data-magellan-expedition]')
            .find('[data-magellan-arrival]')
            .not($destination)
            .removeClass(activeClass);
          $destination.addClass(activeClass);
      });

      this.fixed_magellan
        .on('update-position.fndtn.magellan', function(){
          var $el = $(this);
          // $el.data("magellan-fixed-position","");
          // $el.data("magellan-top-offset", "");
        })
        .trigger('update-position');

      $(window)
        .on('resize.fndtn.magellan', function() {
          this.fixed_magellan.trigger('update-position');
        }.bind(this))

        .on('scroll.fndtn.magellan', function() {
          var windowScrollTop = $(window).scrollTop();
          self.fixed_magellan.each(function() {
            var $expedition = $(this);
            if (typeof $expedition.data('magellan-top-offset') === 'undefined') {
              $expedition.data('magellan-top-offset', $expedition.offset().top);
            }
            if (typeof $expedition.data('magellan-fixed-position') === 'undefined') {
              $expedition.data('magellan-fixed-position', false)
            }
            var fixed_position = (windowScrollTop + self.settings.threshold) > $expedition.data("magellan-top-offset");
            var attr = $expedition.attr('data-magellan-top-offset');

            if ($expedition.data("magellan-fixed-position") != fixed_position) {
              $expedition.data("magellan-fixed-position", fixed_position);
              if (fixed_position) {
                $expedition.addClass('fixed');
                $expedition.css({position:"fixed", top:0});
              } else {
                $expedition.removeClass('fixed');
                $expedition.css({position:"", top:""});
              }
              if (fixed_position && typeof attr != 'undefined' && attr != false) {
                $expedition.css({position:"fixed", top:attr + "px"});
              }
            }
          });
        });


      if (this.last_destination.length > 0) {
        $(window).on('scroll.fndtn.magellan', function (e) {
          var windowScrollTop = $(window).scrollTop(),
              scrolltopPlusHeight = windowScrollTop + $(window).height(),
              lastDestinationTop = Math.ceil(self.last_destination.offset().top);

          $('[data-magellan-destination]').each(function () {
            var $destination = $(this),
                destination_name = $destination.attr('data-magellan-destination'),
                topOffset = $destination.offset().top - windowScrollTop;

            if (topOffset <= self.settings.threshold) {
              $("[data-magellan-arrival='" + destination_name + "']").trigger('arrival');
            }
            // In large screens we may hit the bottom of the page and dont reach the top of the last magellan-destination, so lets force it
            if (scrolltopPlusHeight >= $(self.scope).height() && lastDestinationTop > windowScrollTop && lastDestinationTop < scrolltopPlusHeight) {
              $('[data-magellan-arrival]').last().trigger('arrival');
            }
          });
        });
      }

      this.settings.init = true;
    },

    set_threshold : function () {
      if (!this.settings.threshold) {
        this.settings.threshold = (this.fixed_magellan.length > 0) ? 
          this.outerHeight(this.fixed_magellan, true) : 0;
      }
    },

    off : function () {
      $(this.scope).off('.fndtn.magellan');
    },

    reflow : function () {}
  };
}(Foundation.zj, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs = Foundation.libs || {};

  Foundation.libs.orbit = {
    name: 'orbit',

    version: '4.2.0',

    settings: {
      timer_speed: 10000,
      pause_on_hover: true,
      resume_on_mouseout: false,
      animation_speed: 500,
      bullets: true,
      stack_on_small: true,
      navigation_arrows: true,
      slide_number: true,
      container_class: 'orbit-container',
      stack_on_small_class: 'orbit-stack-on-small',
      next_class: 'orbit-next',
      prev_class: 'orbit-prev',
      timer_container_class: 'orbit-timer',
      timer_paused_class: 'paused',
      timer_progress_class: 'orbit-progress',
      slides_container_class: 'orbit-slides-container',
      bullets_container_class: 'orbit-bullets',
      bullets_active_class: 'active',
      slide_number_class: 'orbit-slide-number',
      caption_class: 'orbit-caption',
      active_slide_class: 'active',
      orbit_transition_class: 'orbit-transitioning'
    },

    init: function (scope, method, options) {
      var self = this;
      Foundation.inherit(self, 'data_options');

      if (typeof method === 'object') {
        $.extend(true, self.settings, method);
      }

      if ($(scope).is('[data-orbit]')) {
        var scoped_self = $.extend(true, {}, self);
        scoped_self._init(idx, el);
      }

      $('[data-orbit]', scope).each(function(idx, el) {
        var scoped_self = $.extend(true, {}, self);
        scoped_self._init(idx, el);
      });
    },

    _container_html: function() {
      var self = this;
      return '<div class="' + self.settings.container_class + '"></div>';
    },

    _bullets_container_html: function($slides) {
      var self = this,
          $list = $('<ol class="' + self.settings.bullets_container_class + '"></ol>');
      $slides.each(function(idx, slide) {
        var $item = $('<li data-orbit-slide-number="' + (idx+1) + '" class=""></li>');
        if (idx === 0) {
          $item.addClass(self.settings.bullets_active_class);
        }
        $list.append($item);
      });
      return $list;
    },

    _slide_number_html: function(slide_number, total_slides) {
      var self = this,
          $container = $('<div class="' + self.settings.slide_number_class + '"></div>');
      $container.append('<span>' + slide_number + '</span> of <span>' + total_slides + '</span>');
      return $container;
    },

    _timer_html: function() {
      var self = this;
      if (typeof self.settings.timer_speed === 'number' && self.settings.timer_speed > 0) {
        return '<div class="' + self.settings.timer_container_class
          + '"><span></span><div class="' + self.settings.timer_progress_class
          + '"></div></div>';
      } else {
        return '';
      }
    },

    _next_html: function() {
      var self = this;
      return '<a href="#" class="' + self.settings.next_class + '">Next <span></span></a>';
    },

    _prev_html: function() {
      var self = this;
      return '<a href="#" class="' + self.settings.prev_class + '">Prev <span></span></a>';
    },

    _init: function (idx, slider) {
      var self = this,
          $slides_container = $(slider),
          $container = $slides_container.wrap(self._container_html()).parent(),
          $slides = $slides_container.children();
      
      $.extend(true, self.settings, self.data_options($slides_container));

      if (self.settings.navigation_arrows) {
          $container.append(self._prev_html());
          $container.append(self._next_html());
      }
      $slides_container.addClass(self.settings.slides_container_class);
      if (self.settings.stack_on_small) {
        $container.addClass(self.settings.stack_on_small_class);
      }
      if (self.settings.slide_number) {
        $container.append(self._slide_number_html(1, $slides.length));
      }
      $container.append(self._timer_html());
      if (self.settings.bullets) {
        $container.after(self._bullets_container_html($slides));
      }
      // To better support the "sliding" effect it's easier
      // if we just clone the first and last slides
      $slides_container.append($slides.first().clone().attr('data-orbit-slide',''));
      $slides_container.prepend($slides.last().clone().attr('data-orbit-slide',''));
      // Make the first "real" slide active
      $slides_container.css(Foundation.rtl ? 'marginRight' : 'marginLeft', '-100%');
      $slides.first().addClass(self.settings.active_slide_class);

      self._init_events($slides_container);
      self._init_dimensions($slides_container);
      self._start_timer($slides_container);
    },

    _init_events: function ($slides_container) {
      var self = this,
          $container = $slides_container.parent();

      $(window)
        .on('load.fndtn.orbit', function() {
          $slides_container.height('');
          $slides_container.height($slides_container.height($container.height()));
          $slides_container.trigger('orbit:ready');
        })
        .on('resize.fndtn.orbit', function() {
          $slides_container.height('');
          $slides_container.height($slides_container.height($container.height()));
        });

      $(document).on('click.fndtn.orbit', '[data-orbit-link]', function(e) {
        e.preventDefault();
        var id = $(e.currentTarget).attr('data-orbit-link'),
            $slide = $slides_container.find('[data-orbit-slide=' + id + ']').first();

        if ($slide.length === 1) {
          self._reset_timer($slides_container, true);
          self._goto($slides_container, $slide.index(), function() {});
        }
      });

      $container.siblings('.' + self.settings.bullets_container_class)
        .on('click.fndtn.orbit', '[data-orbit-slide-number]', function(e) {
          e.preventDefault();
          self._reset_timer($slides_container, true);
          self._goto($slides_container, $(e.currentTarget).data('orbit-slide-number'),function() {});
        });

      $container
        .on('mouseenter.fndtn.orbit', function(e) {
          if (self.settings.pause_on_hover) {
            self._stop_timer($slides_container);
          }
        })
        .on('mouseleave.fndtn.orbit', function(e) {
          if (self.settings.resume_on_mouseout) {
            self._start_timer($slides_container);
          }
        })
        .on('orbit:after-slide-change.fndtn.orbit', function(e, orbit) {
          var $slide_number = $container.find('.' + self.settings.slide_number_class);

          if ($slide_number.length === 1) {
            $slide_number.replaceWith(self._slide_number_html(orbit.slide_number, orbit.total_slides));
          }
        })
        .on('orbit:next-slide.fndtn.orbit click.fndtn.orbit', '.' + self.settings.next_class.split(" ").join("."), function(e) {
          e.preventDefault();
          self._reset_timer($slides_container, true);
          self._goto($slides_container, 'next', function() {});
        })
        .on('orbit:prev-slide.fndtn.orbit click.fndtn.orbit', '.' + self.settings.prev_class.split(" ").join("."), function(e) {
          e.preventDefault();
          self._reset_timer($slides_container, true);
          self._goto($slides_container, 'prev', function() {});
        })
        .on('orbit:toggle-play-pause.fndtn.orbit click.fndtn.orbit touchstart.fndtn.orbit', '.' + self.settings.timer_container_class, function(e) {
          e.preventDefault();
          var $timer = $(e.currentTarget).toggleClass(self.settings.timer_paused_class),
              $slides_container = $timer.closest('.' + self.settings.container_class)
                .find('.' + self.settings.slides_container_class);

          if ($timer.hasClass(self.settings.timer_paused_class)) {
            self._stop_timer($slides_container);
          } else {
            self._start_timer($slides_container);
          }
        })
        .on('touchstart.fndtn.orbit', function(e) {
          if (!e.touches) { e = e.originalEvent; }
          var data = {
            start_page_x: e.touches[0].pageX,
            start_page_y: e.touches[0].pageY,
            start_time: (new Date()).getTime(),
            delta_x: 0,
            is_scrolling: undefined
          };
          $container.data('swipe-transition', data);
          e.stopPropagation();
        })
        .on('touchmove.fndtn.orbit', function(e) {
          if (!e.touches) { e = e.originalEvent; }
          // Ignore pinch/zoom events
          if(e.touches.length > 1 || e.scale && e.scale !== 1) return;

          var data = $container.data('swipe-transition');
          if (typeof data === 'undefined') {
            data = {};
          }

          data.delta_x = e.touches[0].pageX - data.start_page_x;

          if ( typeof data.is_scrolling === 'undefined') {
            data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
          }

          if (!data.is_scrolling && !data.active) {
            e.preventDefault();
            self._stop_timer($slides_container);
            var direction = (data.delta_x < 0) ? 'next' : 'prev';
            data.active = true;
            self._goto($slides_container, direction, function() {});
          }
        })
        .on('touchend.fndtn.orbit', function(e) {
          $container.data('swipe-transition', {});
          e.stopPropagation();
        });
    },

    _init_dimensions: function ($slides_container) {
      var $container = $slides_container.parent(),
          $slides = $slides_container.children();

      $slides_container.css('width', $slides.length * 100 + '%');
      $slides.css('width', 100 / $slides.length + '%');
      $slides_container.height($container.height());
      $slides_container.css('width', $slides.length * 100 + '%');
    },

    _start_timer: function ($slides_container) {
      var self = this,
          $container = $slides_container.parent();

      var callback = function() {
        self._reset_timer($slides_container, false);
        self._goto($slides_container, 'next', function() {
          self._start_timer($slides_container);
        });
      };

      var $timer = $container.find('.' + self.settings.timer_container_class),
          $progress = $timer.find('.' + self.settings.timer_progress_class),
          progress_pct = ($progress.width() / $timer.width()),
          delay = self.settings.timer_speed - (progress_pct * self.settings.timer_speed);

      $progress.animate({'width': '100%'}, delay, 'linear', callback);
      $slides_container.trigger('orbit:timer-started');
    },

    _stop_timer: function ($slides_container) {
      var self = this,
          $container = $slides_container.parent(),
          $timer = $container.find('.' + self.settings.timer_container_class),
          $progress = $timer.find('.' + self.settings.timer_progress_class),
          progress_pct = $progress.width() / $timer.width();
      self._rebuild_timer($container, progress_pct * 100 + '%');
      // $progress.stop();
      $slides_container.trigger('orbit:timer-stopped');
      $timer = $container.find('.' + self.settings.timer_container_class);
      $timer.addClass(self.settings.timer_paused_class);
    },

    _reset_timer: function($slides_container, is_paused) {
      var self = this,
          $container = $slides_container.parent();
      self._rebuild_timer($container, '0%');
      if (typeof is_paused === 'boolean' && is_paused) {
        var $timer = $container.find('.' + self.settings.timer_container_class);
        $timer.addClass(self.settings.timer_paused_class);
      }
    },

    _rebuild_timer: function ($container, width_pct) {
      // Zepto is unable to stop animations since they
      // are css-based. This is a workaround for that
      // limitation, which rebuilds the dom element
      // thus stopping the animation
      var self = this,
          $timer = $container.find('.' + self.settings.timer_container_class),
          $new_timer = $(self._timer_html()),
          $new_timer_progress = $new_timer.find('.' + self.settings.timer_progress_class);

      if (typeof Zepto === 'function') {
        $timer.remove();
        $container.append($new_timer);
        $new_timer_progress.css('width', width_pct);
      } else if (typeof jQuery === 'function') {
        var $progress = $timer.find('.' + self.settings.timer_progress_class);
        $progress.css('width', width_pct);
        $progress.stop();
      }
    },

    _goto: function($slides_container, index_or_direction, callback) {
      var self = this,
          $container = $slides_container.parent(),
          $slides = $slides_container.children(),
          $active_slide = $slides_container.find('.' + self.settings.active_slide_class),
          active_index = $active_slide.index(),
          margin_position = Foundation.rtl ? 'marginRight' : 'marginLeft';

      if ($container.hasClass(self.settings.orbit_transition_class)) {
        return false;
      }

      if (index_or_direction === 'prev') {
        if (active_index === 0) {
          active_index = $slides.length - 1;
        }
        else {
          active_index--;
        }
      }
      else if (index_or_direction === 'next') {
        active_index = (active_index+1) % $slides.length;
      }
      else if (typeof index_or_direction === 'number') {
        active_index = (index_or_direction % $slides.length);
      }
      if (active_index === ($slides.length - 1) && index_or_direction === 'next') {
        $slides_container.css(margin_position, '0%');
        active_index = 1;
      }
      else if (active_index === 0 && index_or_direction === 'prev') {
        $slides_container.css(margin_position, '-' + ($slides.length - 1) * 100 + '%');
        active_index = $slides.length - 2;
      }
      // Start transition, make next slide active
      $container.addClass(self.settings.orbit_transition_class);
      $active_slide.removeClass(self.settings.active_slide_class);
      $($slides[active_index]).addClass(self.settings.active_slide_class);
      // Make next bullet active
      var $bullets = $container.siblings('.' + self.settings.bullets_container_class);
      if ($bullets.length === 1) {
        $bullets.children().removeClass(self.settings.bullets_active_class);
        $($bullets.children()[active_index-1]).addClass(self.settings.bullets_active_class);
      }
      var new_margin_left = '-' + (active_index * 100) + '%';
      // Check to see if animation will occur, otherwise perform
      // callbacks manually
      $slides_container.trigger('orbit:before-slide-change');
      if ($slides_container.css(margin_position) === new_margin_left) {
        $container.removeClass(self.settings.orbit_transition_class);
        $slides_container.trigger('orbit:after-slide-change', [{slide_number: active_index, total_slides: $slides_container.children().length - 2}]);
        callback();
      } else {
        var properties = {};
        properties[margin_position] = new_margin_left;

        $slides_container.animate(properties, self.settings.animation_speed, 'linear', function() {
          $container.removeClass(self.settings.orbit_transition_class);
          $slides_container.trigger('orbit:after-slide-change', [{slide_number: active_index, total_slides: $slides_container.children().length - 2}]);
          callback();
        });
      }
    }
  };
}(Foundation.zj, this, this.document));
/*jslint unparam: true, browser: true, indent: 2 */


;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.reveal = {
    name: 'reveal',

    version : '4.2.2',

    locked : false,

    settings : {
      animation: 'fadeAndPop',
      animationSpeed: 250,
      closeOnBackgroundClick: true,
      closeOnEsc: true,
      dismissModalClass: 'close-reveal-modal',
      bgClass: 'reveal-modal-bg',
      open: function(){},
      opened: function(){},
      close: function(){},
      closed: function(){},
      bg : $('.reveal-modal-bg'),
      css : {
        open : {
          'opacity': 0,
          'visibility': 'visible',
          'display' : 'block'
        },
        close : {
          'opacity': 1,
          'visibility': 'hidden',
          'display': 'none'
        }
      }
    },

    init : function (scope, method, options) {
      Foundation.inherit(this, 'data_options delay');

      if (typeof method === 'object') {
        $.extend(true, this.settings, method);
      } else if (typeof options !== 'undefined') {
        $.extend(true, this.settings, options);
      }

      if (typeof method !== 'string') {
        this.events();

        return this.settings.init;
      } else {
        return this[method].call(this, options);
      }
    },

    events : function () {
      var self = this;

      $(this.scope)
        .off('.fndtn.reveal')
        .on('click.fndtn.reveal', '[data-reveal-id]', function (e) {
          e.preventDefault();

          if (!self.locked) {
            var element = $(this),
                ajax = element.data('reveal-ajax');

            self.locked = true;

            if (typeof ajax === 'undefined') {
              self.open.call(self, element);
            } else {
              var url = ajax === true ? element.attr('href') : ajax;

              self.open.call(self, element, {url: url});
            }
          }
        })
        .on('click.fndtn.reveal', this.close_targets(), function (e) {
          e.preventDefault();
          if (!self.locked) {
            var settings = $.extend({}, self.settings, self.data_options($('.reveal-modal.open')));
            if ($(e.target)[0] === $('.' + settings.bgClass)[0] && !settings.closeOnBackgroundClick) {
              return;
            }

            self.locked = true;
            self.close.call(self, $(this).closest('.reveal-modal'));
          }
        })
        .on('open.fndtn.reveal', '.reveal-modal', this.settings.open)
        .on('opened.fndtn.reveal', '.reveal-modal', this.settings.opened)
        .on('opened.fndtn.reveal', '.reveal-modal', this.open_video)
        .on('close.fndtn.reveal', '.reveal-modal', this.settings.close)
        .on('closed.fndtn.reveal', '.reveal-modal', this.settings.closed)
        .on('closed.fndtn.reveal', '.reveal-modal', this.close_video);

      $( 'body' ).bind( 'keyup.reveal', function ( event ) {
        var open_modal = $('.reveal-modal.open'),
            settings = $.extend({}, self.settings, self.data_options(open_modal));
        if ( event.which === 27  && settings.closeOnEsc) { // 27 is the keycode for the Escape key
          open_modal.foundation('reveal', 'close');
        }
      });

      return true;
    },

    open : function (target, ajax_settings) {
      if (target) {
        if (typeof target.selector !== 'undefined') {
          var modal = $('#' + target.data('reveal-id'));
        } else {
          var modal = $(this.scope);

          ajax_settings = target;
        }
      } else {
        var modal = $(this.scope);
      }

      if (!modal.hasClass('open')) {
        var open_modal = $('.reveal-modal.open');

        if (typeof modal.data('css-top') === 'undefined') {
          modal.data('css-top', parseInt(modal.css('top'), 10))
            .data('offset', this.cache_offset(modal));
        }

        modal.trigger('open');

        if (open_modal.length < 1) {
          this.toggle_bg(modal);
        }

        if (typeof ajax_settings === 'undefined' || !ajax_settings.url) {
          this.hide(open_modal, this.settings.css.close);
          this.show(modal, this.settings.css.open);
        } else {
          var self = this,
              old_success = typeof ajax_settings.success !== 'undefined' ? ajax_settings.success : null;

          $.extend(ajax_settings, {
            success: function (data, textStatus, jqXHR) {
              if ( $.isFunction(old_success) ) {
                old_success(data, textStatus, jqXHR);
              }

              modal.html(data);
              $(modal).foundation('section', 'reflow');

              self.hide(open_modal, self.settings.css.close);
              self.show(modal, self.settings.css.open);
            }
          });

          $.ajax(ajax_settings);
        }
      }
    },

    close : function (modal) {

      var modal = modal && modal.length ? modal : $(this.scope),
          open_modals = $('.reveal-modal.open');

      if (open_modals.length > 0) {
        this.locked = true;
        modal.trigger('close');
        this.toggle_bg(modal);
        this.hide(open_modals, this.settings.css.close);
      }
    },

    close_targets : function () {
      var base = '.' + this.settings.dismissModalClass;

      if (this.settings.closeOnBackgroundClick) {
        return base + ', .' + this.settings.bgClass;
      }

      return base;
    },

    toggle_bg : function (modal) {
      if ($('.reveal-modal-bg').length === 0) {
        this.settings.bg = $('<div />', {'class': this.settings.bgClass})
          .appendTo('body');
      }

      if (this.settings.bg.filter(':visible').length > 0) {
        this.hide(this.settings.bg);
      } else {
        this.show(this.settings.bg);
      }
    },

    show : function (el, css) {
      // is modal
      if (css) {
        if (/pop/i.test(this.settings.animation)) {
          css.top = $(window).scrollTop() - el.data('offset') + 'px';
          var end_css = {
            top: $(window).scrollTop() + el.data('css-top') + 'px',
            opacity: 1
          };

          return this.delay(function () {
            return el
              .css(css)
              .animate(end_css, this.settings.animationSpeed, 'linear', function () {
                this.locked = false;
                el.trigger('opened');
              }.bind(this))
              .addClass('open');
          }.bind(this), this.settings.animationSpeed / 2);
        }

        if (/fade/i.test(this.settings.animation)) {
          var end_css = {opacity: 1};

          return this.delay(function () {
            return el
              .css(css)
              .animate(end_css, this.settings.animationSpeed, 'linear', function () {
                this.locked = false;
                el.trigger('opened');
              }.bind(this))
              .addClass('open');
          }.bind(this), this.settings.animationSpeed / 2);
        }

        return el.css(css).show().css({opacity: 1}).addClass('open').trigger('opened');
      }

      // should we animate the background?
      if (/fade/i.test(this.settings.animation)) {
        return el.fadeIn(this.settings.animationSpeed / 2);
      }

      return el.show();
    },

    hide : function (el, css) {
      // is modal
      if (css) {
        if (/pop/i.test(this.settings.animation)) {
          var end_css = {
            top: - $(window).scrollTop() - el.data('offset') + 'px',
            opacity: 0
          };

          return this.delay(function () {
            return el
              .animate(end_css, this.settings.animationSpeed, 'linear', function () {
                this.locked = false;
                el.css(css).trigger('closed');
              }.bind(this))
              .removeClass('open');
          }.bind(this), this.settings.animationSpeed / 2);
        }

        if (/fade/i.test(this.settings.animation)) {
          var end_css = {opacity: 0};

          return this.delay(function () {
            return el
              .animate(end_css, this.settings.animationSpeed, 'linear', function () {
                this.locked = false;
                el.css(css).trigger('closed');
              }.bind(this))
              .removeClass('open');
          }.bind(this), this.settings.animationSpeed / 2);
        }

        return el.hide().css(css).removeClass('open').trigger('closed');
      }

      // should we animate the background?
      if (/fade/i.test(this.settings.animation)) {
        return el.fadeOut(this.settings.animationSpeed / 2);
      }

      return el.hide();
    },

    close_video : function (e) {
      var video = $(this).find('.flex-video'),
          iframe = video.find('iframe');

      if (iframe.length > 0) {
        iframe.attr('data-src', iframe[0].src);
        iframe.attr('src', 'about:blank');
        video.hide();
      }
    },

    open_video : function (e) {
      var video = $(this).find('.flex-video'),
          iframe = video.find('iframe');

      if (iframe.length > 0) {
        var data_src = iframe.attr('data-src');
        if (typeof data_src === 'string') {
          iframe[0].src = iframe.attr('data-src');
        } else {
          var src = iframe[0].src;
          iframe[0].src = undefined;
          iframe[0].src = src;
        }
        video.show();
      }
    },

    cache_offset : function (modal) {
      var offset = modal.show().height() + parseInt(modal.css('top'), 10);

      modal.hide();

      return offset;
    },

    off : function () {
      $(this.scope).off('.fndtn.reveal');
    },

    reflow : function () {}
  };
}(Foundation.zj, this, this.document));
/*jslint unparam: true, browser: true, indent: 2 */


;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.section = {
    name: 'section',

    version : '4.2.3',

    settings : {
      deep_linking: false,
      small_breakpoint: 768,
      one_up: true,
      section_selector : '[data-section]',
      region_selector : 'section, .section, [data-section-region]',
      title_selector : '.title, [data-section-title]',
      active_region_selector : 'section.active, .section.active, .active[data-section-region]',
      content_selector : '.content, [data-section-content]',
      nav_selector : '[data-section="vertical-nav"], [data-section="horizontal-nav"]',
      callback: function (){}
    },

    init : function (scope, method, options) {
      var self = this;
      Foundation.inherit(this, 'throttle data_options position_right offset_right');

      if (typeof method === 'object') {
        $.extend(true, self.settings, method);
      }

      if (typeof method !== 'string') {
        this.set_active_from_hash();
        this.events();

        return true;
      } else {
        return this[method].call(this, options);
      }
    },

    events : function () {
      var self = this;

      $(this.scope)
        .on('click.fndtn.section', '[data-section] .title, [data-section] [data-section-title]', function (e) {
          var $this = $(this),
              section = $this.closest(self.settings.region_selector);

          if (section.children(self.settings.content_selector).length > 0) {
            self.toggle_active.call(this, e, self);
            self.reflow();
          }
        });

      $(window)
        .on('resize.fndtn.section', self.throttle(function () {
          self.resize.call(this);
        }, 30))
        .on('hashchange', function () {
          if (!self.settings.toggled){
            self.set_active_from_hash();
            $(this).trigger('resize');
          }
        }).trigger('resize');

      $(document)
        .on('click.fndtn.section', function (e) {
          if ($(e.target).closest(self.settings.title_selector).length < 1) {
            $(self.settings.nav_selector)
              .children(self.settings.region_selector)
              .removeClass('active')
              .attr('style', '');
          }
        });

    },

    toggle_active : function (e, self) {
      var $this = $(this),
          self = Foundation.libs.section,
          region = $this.closest(self.settings.region_selector),
          content = $this.siblings(self.settings.content_selector),
          parent = region.parent(),
          settings = $.extend({}, self.settings, self.data_options(parent)),
          prev_active_section = parent
            .children(self.settings.active_region_selector);

      self.settings.toggled = true;

      if (!settings.deep_linking && content.length > 0) {
        e.preventDefault();
      }

      if (region.hasClass('active')) {
        // this is causing the style flash.
        if (self.small(parent)
          || self.is_vertical_nav(parent)
          || self.is_horizontal_nav(parent)
          || self.is_accordion(parent)) {
            if (prev_active_section[0] !== region[0]
              || (prev_active_section[0] === region[0] && !settings.one_up)) {
              region
                .removeClass('active')
                .attr('style', '');
            }
        }
      } else {
        var prev_active_section = parent
              .children(self.settings.active_region_selector),
            title_height = self.outerHeight(region
              .children(self.settings.title_selector));

        if (self.small(parent) || settings.one_up) {

          if (self.small(parent)) {
            prev_active_section.attr('style', '');
          } else {
            prev_active_section.attr('style',
              'visibility: hidden; padding-top: '+title_height+'px;');
          }
        }

        if (self.small(parent)) {
          region.attr('style', '');
        } else {
          region.css('padding-top', title_height);
        }

        region.addClass('active');

        if (prev_active_section.length > 0) {
          prev_active_section
            .removeClass('active')
            .attr('style', '');
        }

        // Toggle the content display attribute. This is done to
        // ensure accurate outerWidth measurements that account for
        // the scrollbar.
        if (self.is_vertical_tabs(parent)) {
          content.css('display', 'block');

          if (prev_active_section !== null) {
            prev_active_section
              .children(self.settings.content_selector)
              .css('display', 'none');
          }
        }
      }

      setTimeout(function () {
        self.settings.toggled = false;
      }, 300);

      settings.callback();
    },

    resize : function () {
      var self = Foundation.libs.section,
          sections = $(self.settings.section_selector);

      sections.each(function() {
        var $this = $(this),
            active_section = $this
              .children(self.settings.active_region_selector),
            settings = $.extend({}, self.settings, self.data_options($this));

        if (active_section.length > 1) {
          active_section
            .not(':first')
            .removeClass('active')
            .attr('style', '');
        } else if (active_section.length < 1
          && !self.is_vertical_nav($this)
          && !self.is_horizontal_nav($this)
          && !self.is_accordion($this)) {

          var first = $this.children(self.settings.region_selector).first();

          if (settings.one_up || !self.small($this)) {
            first.addClass('active');
          }

          if (self.small($this)) {
            first.attr('style', '');
          } else {
            first.css('padding-top', self.outerHeight(first
              .children(self.settings.title_selector)));
          }
        }

        if (self.small($this)) {
          active_section.attr('style', '');
        } else {
          active_section.css('padding-top', self.outerHeight(active_section
            .children(self.settings.title_selector)));
        }

        self.position_titles($this);

        if ( (self.is_horizontal_nav($this) && !self.small($this))
          || self.is_vertical_tabs($this) && !self.small($this)) {
          self.position_content($this);
        } else {
          self.position_content($this, false);
        }
      });
    },

    is_vertical_nav : function (el) {
      return /vertical-nav/i.test(el.data('section'));
    },

    is_horizontal_nav : function (el) {
      return /horizontal-nav/i.test(el.data('section'));
    },

    is_accordion : function (el) {
      return /accordion/i.test(el.data('section'));
    },

    is_horizontal_tabs : function (el) {
      return /^tabs$/i.test(el.data('section'));
    },

    is_vertical_tabs : function (el) {
      return /vertical-tabs/i.test(el.data('section'));
    },

    set_active_from_hash : function () {
      var hash = window.location.hash.substring(1),
          sections = $('[data-section]'),
          self = this;
      sections.each(function () {
        var section = $(this),
            settings = $.extend({}, self.settings, self.data_options(section));

        if (hash.length > 0 && settings.deep_linking) {
          var regions = section
            .children(self.settings.region_selector)
            .attr('style', '')
            .removeClass('active');

          var hash_regions = regions.map(function () {
              var content = $(self.settings.content_selector, this),
                  content_slug = content.data('slug');

              if (new RegExp(content_slug, 'i').test(hash)) 
                return content;
            });


          var count = hash_regions.length;

          for (var i = count - 1; i >= 0; i--) {
            $(hash_regions[i]).parent().addClass('active');
          }
        }
      });
    },

    position_titles : function (section, off) {
      var self = this,
          titles = section
            .children(this.settings.region_selector)
            .map(function () {
              return $(this).children(self.settings.title_selector);
            }),
          previous_width = 0,
          previous_height = 0,
          self = this;

      if (typeof off === 'boolean') {
        titles.attr('style', '');

      } else {
        titles.each(function () {
          if (self.is_vertical_tabs(section)) {
            $(this).css('top', previous_height);
            previous_height += self.outerHeight($(this));
          } else {
            if (!self.rtl) {
              $(this).css('left', previous_width);
            } else {
              $(this).css('right', previous_width);
            }
            previous_width += self.outerWidth($(this));
          }
        });
      }
    },

    position_content : function (section, off) {
      var self = this,
          regions = section.children(self.settings.region_selector),
          titles = regions
            .map(function () {
              return $(this).children(self.settings.title_selector);
            }),
          content = regions
            .map(function () {
              return $(this).children(self.settings.content_selector);
            });

      if (typeof off === 'boolean') {
        content.attr('style', '');
        section.attr('style', '');

        // Reset the minHeight and maxWidth values (only applicable to
        // vertical tabs)
        content.css('minHeight', '');
        content.css('maxWidth', '');
      } else {
        if (self.is_vertical_tabs(section)
            && !self.small(section)) {
          var content_min_height = 0,
              content_min_width = Number.MAX_VALUE,
              title_width = null;

          regions.each(function () {
            var region = $(this),
                title = region.children(self.settings.title_selector),
                content = region.children(self.settings.content_selector),
                content_width = 0;

            title_width = self.outerWidth(title);
            content_width = self.outerWidth(section) - title_width;

            if (content_width < content_min_width) {
              content_min_width = content_width;
            }

            // Increment the minimum height of the content region
            // to align with the height of the titles.
            content_min_height += self.outerHeight(title);

            // Set all of the inactive tabs to 'display: none'
            // The CSS sets all of the tabs as 'display: block'
            // in order to account for scrollbars when measuring the width
            // of the content regions.
            if (!$(this).hasClass('active')) {
              content.css('display', 'none');
            }
          });

          regions.each(function () {
            var content = $(this).children(self.settings.content_selector);
            content.css('minHeight', content_min_height);

            // Remove 2 pixels to account for the right-shift in the CSS
            content.css('maxWidth', content_min_width - 2);
          });

        } else {
          regions.each(function () {
            var region = $(this),
                title = region.children(self.settings.title_selector),
                content = region.children(self.settings.content_selector);
            if (!self.rtl) {
              content
                .css({left: title.position().left - 1,
                  top: self.outerHeight(title) - 2});
            } else {
              content
                .css({right: self.position_right(title) + 1,
                  top: self.outerHeight(title) - 2});
            }
          });

          // temporary work around for Zepto outerheight calculation issues.
          if (typeof Zepto === 'function') {
            section.height(this.outerHeight($(titles[0])));
          } else {
            section.height(this.outerHeight($(titles[0])) - 2);
          }
        }
      }
    },

    position_right : function (el) {
      var self = this,
          section = el.closest(this.settings.section_selector),
          regions = section.children(this.settings.region_selector),
          section_width = el.closest(this.settings.section_selector).width(),
          offset = regions
            .map(function () {
              return $(this).children(self.settings.title_selector);
            }).length;
      return (section_width - el.position().left - el.width() * (el.index() + 1) - offset);
    },

    reflow : function (scope) {
      var scope = scope || document;
      $(this.settings.section_selector, scope).trigger('resize');
    },

    small : function (el) {
      var settings = $.extend({}, this.settings, this.data_options(el));

      if (this.is_horizontal_tabs(el)) {
        return false;
      }
      if (el && this.is_accordion(el)) {
        return true;
      }
      if ($('html').hasClass('lt-ie9')) {
        return true;
      }
      if ($('html').hasClass('ie8compat')) {
        return true;
      }
      return $(this.scope).width() < settings.small_breakpoint;
    },

    off : function () {
      $(this.scope).off('.fndtn.section');
      $(window).off('.fndtn.section');
      $(document).off('.fndtn.section')
    }
  };
}(Foundation.zj, this, this.document));
/*jslint unparam: true, browser: true, indent: 2 */


;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.tooltips = {
    name: 'tooltips',

    version : '4.2.2',

    settings : {
      selector : '.has-tip',
      additionalInheritableClasses : [],
      tooltipClass : '.tooltip',
      appendTo: 'body',
      'disable-for-touch': false,
      tipTemplate : function (selector, content) {
        return '<span data-selector="' + selector + '" class="' 
          + Foundation.libs.tooltips.settings.tooltipClass.substring(1) 
          + '">' + content + '<span class="nub"></span></span>';
      }
    },

    cache : {},

    init : function (scope, method, options) {
      Foundation.inherit(this, 'data_options');
      var self = this;

      if (typeof method === 'object') {
        $.extend(true, this.settings, method);
      } else if (typeof options !== 'undefined') {
        $.extend(true, this.settings, options);
      }

      if (typeof method !== 'string') {
        if (Modernizr.touch) {
          $(this.scope)
            .on('click.fndtn.tooltip touchstart.fndtn.tooltip touchend.fndtn.tooltip', 
              '[data-tooltip]', function (e) {
              var settings = $.extend({}, self.settings, self.data_options($(this)));
              if (!settings['disable-for-touch']) {
                e.preventDefault();
                $(settings.tooltipClass).hide();
                self.showOrCreateTip($(this));
              }
            })
            .on('click.fndtn.tooltip touchstart.fndtn.tooltip touchend.fndtn.tooltip', 
              this.settings.tooltipClass, function (e) {
              e.preventDefault();
              $(this).fadeOut(150);
            });
        } else {
          $(this.scope)
            .on('mouseenter.fndtn.tooltip mouseleave.fndtn.tooltip', 
              '[data-tooltip]', function (e) {
              var $this = $(this);

              if (/enter|over/i.test(e.type)) {
                self.showOrCreateTip($this);
              } else if (e.type === 'mouseout' || e.type === 'mouseleave') {
                self.hide($this);
              }
            });
        }

        // $(this.scope).data('fndtn-tooltips', true);
      } else {
        return this[method].call(this, options);
      }

    },

    showOrCreateTip : function ($target) {
      var $tip = this.getTip($target);

      if ($tip && $tip.length > 0) {
        return this.show($target);
      }

      return this.create($target);
    },

    getTip : function ($target) {
      var selector = this.selector($target),
          tip = null;

      if (selector) {
        tip = $('span[data-selector="' + selector + '"]' + this.settings.tooltipClass);
      }

      return (typeof tip === 'object') ? tip : false;
    },

    selector : function ($target) {
      var id = $target.attr('id'),
          dataSelector = $target.attr('data-tooltip') || $target.attr('data-selector');

      if ((id && id.length < 1 || !id) && typeof dataSelector != 'string') {
        dataSelector = 'tooltip' + Math.random().toString(36).substring(7);
        $target.attr('data-selector', dataSelector);
      }

      return (id && id.length > 0) ? id : dataSelector;
    },

    create : function ($target) {
      var $tip = $(this.settings.tipTemplate(this.selector($target), $('<div></div>').html($target.attr('title')).html())),
          classes = this.inheritable_classes($target);

      $tip.addClass(classes).appendTo(this.settings.appendTo);
      if (Modernizr.touch) {
        $tip.append('<span class="tap-to-close">tap to close </span>');
      }
      $target.removeAttr('title').attr('title','');
      this.show($target);
    },

    reposition : function (target, tip, classes) {
      var width, nub, nubHeight, nubWidth, column, objPos;

      tip.css('visibility', 'hidden').show();

      width = target.data('width');
      nub = tip.children('.nub');
      nubHeight = this.outerHeight(nub);
      nubWidth = this.outerHeight(nub);

      objPos = function (obj, top, right, bottom, left, width) {
        return obj.css({
          'top' : (top) ? top : 'auto',
          'bottom' : (bottom) ? bottom : 'auto',
          'left' : (left) ? left : 'auto',
          'right' : (right) ? right : 'auto',
          'width' : (width) ? width : 'auto'
        }).end();
      };

      objPos(tip, (target.offset().top + this.outerHeight(target) + 10), 'auto', 'auto', target.offset().left, width);

      if ($(window).width() < 767) {
        objPos(tip, (target.offset().top + this.outerHeight(target) + 10), 'auto', 'auto', 12.5, $(this.scope).width());
        tip.addClass('tip-override');
        objPos(nub, -nubHeight, 'auto', 'auto', target.offset().left);
      } else {
        var left = target.offset().left;
        if (Foundation.rtl) {
          left = target.offset().left + target.offset().width - this.outerWidth(tip);
        }
        objPos(tip, (target.offset().top + this.outerHeight(target) + 10), 'auto', 'auto', left, width);
        tip.removeClass('tip-override');
        if (classes && classes.indexOf('tip-top') > -1) {
          objPos(tip, (target.offset().top - this.outerHeight(tip)), 'auto', 'auto', left, width)
            .removeClass('tip-override');
        } else if (classes && classes.indexOf('tip-left') > -1) {
          objPos(tip, (target.offset().top + (this.outerHeight(target) / 2) - nubHeight*2.5), 'auto', 'auto', (target.offset().left - this.outerWidth(tip) - nubHeight), width)
            .removeClass('tip-override');
        } else if (classes && classes.indexOf('tip-right') > -1) {
          objPos(tip, (target.offset().top + (this.outerHeight(target) / 2) - nubHeight*2.5), 'auto', 'auto', (target.offset().left + this.outerWidth(target) + nubHeight), width)
            .removeClass('tip-override');
        }
      }

      tip.css('visibility', 'visible').hide();
    },

    inheritable_classes : function (target) {
      var inheritables = ['tip-top', 'tip-left', 'tip-bottom', 'tip-right', 'noradius'].concat(this.settings.additionalInheritableClasses),
          classes = target.attr('class'),
          filtered = classes ? $.map(classes.split(' '), function (el, i) {
            if ($.inArray(el, inheritables) !== -1) {
              return el;
            }
          }).join(' ') : '';

      return $.trim(filtered);
    },

    show : function ($target) {
      var $tip = this.getTip($target);

      this.reposition($target, $tip, $target.attr('class'));
      $tip.fadeIn(150);
    },

    hide : function ($target) {
      var $tip = this.getTip($target);

      $tip.fadeOut(150);
    },

    // deprecate reload
    reload : function () {
      var $self = $(this);

      return ($self.data('fndtn-tooltips')) ? $self.foundationTooltips('destroy').foundationTooltips('init') : $self.foundationTooltips('init');
    },

    off : function () {
      $(this.scope).off('.fndtn.tooltip');
      $(this.settings.tooltipClass).each(function (i) {
        $('[data-tooltip]').get(i).attr('title', $(this).text());
      }).remove();
    },

    reflow : function () {}
  };
}(Foundation.zj, this, this.document));
/*jslint unparam: true, browser: true, indent: 2 */


;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.topbar = {
    name : 'topbar',

    version : '4.2.3',

    settings : {
      index : 0,
      stickyClass : 'sticky',
      custom_back_text: true,
      back_text: 'Back',
      is_hover: true,
      scrolltop : true, // jump to top when sticky nav menu toggle is clicked
      init : false
    },

    init : function (section, method, options) {
      Foundation.inherit(this, 'data_options');
      var self = this;

      if (typeof method === 'object') {
        $.extend(true, this.settings, method);
      } else if (typeof options !== 'undefined') {
        $.extend(true, this.settings, options);
      }

      if (typeof method !== 'string') {

        $('.top-bar, [data-topbar]').each(function () {
          $.extend(true, self.settings, self.data_options($(this)));
          self.settings.$w = $(window);
          self.settings.$topbar = $(this);
          self.settings.$section = self.settings.$topbar.find('section');
          self.settings.$titlebar = self.settings.$topbar.children('ul').first();
          self.settings.$topbar.data('index', 0);

          var breakpoint = $("<div class='top-bar-js-breakpoint'/>").insertAfter(self.settings.$topbar);
          self.settings.breakPoint = breakpoint.width();
          breakpoint.remove();

          self.assemble();

          if (self.settings.$topbar.parent().hasClass('fixed')) {
            $('body').css('padding-top', self.outerHeight(self.settings.$topbar));
          }
        });

        if (!self.settings.init) {
          this.events();
        }

        return this.settings.init;
      } else {
        // fire method
        return this[method].call(this, options);
      }
    },

    events : function () {
      var self = this;
      var offst = this.outerHeight($('.top-bar, [data-topbar]'));
      $(this.scope)
        .off('.fndtn.topbar')
        .on('click.fndtn.topbar', '.top-bar .toggle-topbar, [data-topbar] .toggle-topbar', function (e) {
          var topbar = $(this).closest('.top-bar, [data-topbar]'),
              section = topbar.find('section, .section'),
              titlebar = topbar.children('ul').first();

          e.preventDefault();

          if (self.breakpoint()) {
            if (!self.rtl) {
              section.css({left: '0%'});
              section.find('>.name').css({left: '100%'});
            } else {
              section.css({right: '0%'});
              section.find('>.name').css({right: '100%'});
            }

            section.find('li.moved').removeClass('moved');
            topbar.data('index', 0);

            topbar
              .toggleClass('expanded')
              .css('height', '');
          }

          if (!topbar.hasClass('expanded')) {
            if (topbar.hasClass('fixed')) {
              topbar.parent().addClass('fixed');
              topbar.removeClass('fixed');
              $('body').css('padding-top',offst);
            }
          } else if (topbar.parent().hasClass('fixed')) {
            topbar.parent().removeClass('fixed');
            topbar.addClass('fixed');
            $('body').css('padding-top','0');

            if (self.settings.scrolltop) {
              window.scrollTo(0,0);
            }
          }
        })

        .on('mouseenter mouseleave', '.top-bar li', function (e) {
          if (!self.settings.is_hover) return;

          if (/enter|over/i.test(e.type)) {
            $(this).addClass('hover');
          } else {
            $(this).removeClass('hover');
          }
        })

        .on('click.fndtn.topbar', '.top-bar li.has-dropdown', function (e) {
          if (self.breakpoint()) return;

          var li = $(this),
              target = $(e.target),
              topbar = li.closest('[data-topbar], .top-bar'),
              is_hover = topbar.data('topbar');

          if (self.settings.is_hover && !Modernizr.touch) return;

          e.stopImmediatePropagation();

          if (target[0].nodeName === 'A' && target.parent().hasClass('has-dropdown')) {
            e.preventDefault();
          }

          if (li.hasClass('hover')) {
            li
              .removeClass('hover')
              .find('li')
              .removeClass('hover');
          } else {
            li.addClass('hover');
          }
        })

        .on('click.fndtn.topbar', '.top-bar .has-dropdown>a, [data-topbar] .has-dropdown>a', function (e) {
          if (self.breakpoint()) {
            e.preventDefault();

            var $this = $(this),
                topbar = $this.closest('.top-bar, [data-topbar]'),
                section = topbar.find('section, .section'),
                titlebar = topbar.children('ul').first(),
                dropdownHeight = $this.next('.dropdown').outerHeight(),
                $selectedLi = $this.closest('li');

            topbar.data('index', topbar.data('index') + 1);
            $selectedLi.addClass('moved');

            if (!self.rtl) {
              section.css({left: -(100 * topbar.data('index')) + '%'});
              section.find('>.name').css({left: 100 * topbar.data('index') + '%'});
            } else {
              section.css({right: -(100 * topbar.data('index')) + '%'});
              section.find('>.name').css({right: 100 * topbar.data('index') + '%'});
            }

            topbar.css('height', self.outerHeight($this.siblings('ul'), true) + self.outerHeight(titlebar, true));
          }
        });

      $(window).on('resize.fndtn.topbar', function () {
        if (!self.breakpoint()) {
          $('.top-bar, [data-topbar]')
            .css('height', '')
            .removeClass('expanded')
            .find('li')
            .removeClass('hover');
        }
      }.bind(this));

      $('body').on('click.fndtn.topbar', function (e) {
        var parent = $(e.target).closest('[data-topbar], .top-bar');

        if (parent.length > 0) {
          return;
        }

        $('.top-bar li, [data-topbar] li').removeClass('hover');
      });

      // Go up a level on Click
      $(this.scope).on('click.fndtn', '.top-bar .has-dropdown .back, [data-topbar] .has-dropdown .back', function (e) {
        e.preventDefault();

        var $this = $(this),
            topbar = $this.closest('.top-bar, [data-topbar]'),
            titlebar = topbar.children('ul').first(),
            section = topbar.find('section, .section'),
            $movedLi = $this.closest('li.moved'),
            $previousLevelUl = $movedLi.parent();

        topbar.data('index', topbar.data('index') - 1);

        if (!self.rtl) {
          section.css({left: -(100 * topbar.data('index')) + '%'});
          section.find('>.name').css({left: 100 * topbar.data('index') + '%'});
        } else {
          section.css({right: -(100 * topbar.data('index')) + '%'});
          section.find('>.name').css({right: 100 * topbar.data('index') + '%'});
        }

        if (topbar.data('index') === 0) {
          topbar.css('height', '');
        } else {
          topbar.css('height', self.outerHeight($previousLevelUl, true) + self.outerHeight(titlebar, true));
        }

        setTimeout(function () {
          $movedLi.removeClass('moved');
        }, 300);
      });
    },

    breakpoint : function () {
      return $(document).width() <= this.settings.breakPoint || $('html').hasClass('lt-ie9');
    },

    assemble : function () {
      var self = this;
      // Pull element out of the DOM for manipulation
      this.settings.$section.detach();

      this.settings.$section.find('.has-dropdown>a').each(function () {
        var $link = $(this),
            $dropdown = $link.siblings('.dropdown'),
            url = $link.attr('href');

        if (url && url.length > 1) {
          var $titleLi = $('<li class="title back js-generated"><h5><a href="#"></a></h5></li><li><a class="parent-link js-generated" href="' + url + '">' + $link.text() +'</a></li>');
        } else {
          var $titleLi = $('<li class="title back js-generated"><h5><a href="#"></a></h5></li>');
        }

        // Copy link to subnav
        if (self.settings.custom_back_text == true) {
          $titleLi.find('h5>a').html('&laquo; ' + self.settings.back_text);
        } else {
          $titleLi.find('h5>a').html('&laquo; ' + $link.html());
        }
        $dropdown.prepend($titleLi);
      });

      // Put element back in the DOM
      this.settings.$section.appendTo(this.settings.$topbar);

      // check for sticky
      this.sticky();
    },

    height : function (ul) {
      var total = 0,
          self = this;

      ul.find('> li').each(function () { total += self.outerHeight($(this), true); });

      return total;
    },

    sticky : function () {
      var klass = '.' + this.settings.stickyClass;
      if ($(klass).length > 0) {
        var distance = $(klass).length ? $(klass).offset().top: 0,
            $window = $(window);
            var offst = this.outerHeight($('.top-bar'));
        //Whe resize elements of the page on windows resize. Must recalculate distance
		$(window).resize(function() {
            clearTimeout(t_top);
			t_top = setTimeout (function() {
				distance = $(klass).offset().top;
			},105);
		});
          $window.scroll(function() {
            if ($window.scrollTop() > (distance)) {
              $(klass).addClass("fixed");
              $('body').css('padding-top',offst);
            }

            else if ($window.scrollTop() <= distance) {
              $(klass).removeClass("fixed");
              $('body').css('padding-top','0');
            }
        });
      }
    },

    off : function () {
      $(this.scope).off('.fndtn.topbar');
      $(window).off('.fndtn.topbar');
    },

    reflow : function () {}
  };
}(Foundation.zj, this, this.document));
/*jslint unparam: true, browser: true, indent: 2 */


;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.interchange = {
    name : 'interchange',

    version : '4.2.2',

    cache : {},

    settings : {
      load_attr : 'interchange',

      named_queries : {
        'default' : 'only screen and (min-width: 1px)',
        small : 'only screen and (min-width: 768px)',
        medium : 'only screen and (min-width: 1280px)',
        large : 'only screen and (min-width: 1440px)',
        landscape : 'only screen and (orientation: landscape)',
        portrait : 'only screen and (orientation: portrait)',
        retina : 'only screen and (-webkit-min-device-pixel-ratio: 2),' + 
          'only screen and (min--moz-device-pixel-ratio: 2),' + 
          'only screen and (-o-min-device-pixel-ratio: 2/1),' + 
          'only screen and (min-device-pixel-ratio: 2),' + 
          'only screen and (min-resolution: 192dpi),' + 
          'only screen and (min-resolution: 2dppx)'
      },

      directives : {
        replace : function (el, path) {
          if (/IMG/.test(el[0].nodeName)) {
            var path_parts = path.split('/'),
                path_file = path_parts[path_parts.length - 1],
                orig_path = el[0].src;

            if (new RegExp(path_file, 'i').test(el[0].src)) return;

            el[0].src = path;

            return el.trigger('replace', [el[0].src, orig_path]);
          }
        }
      }
    },

    init : function (scope, method, options) {
      Foundation.inherit(this, 'throttle');

      if (typeof method === 'object') {
        $.extend(true, this.settings, method);
      }

      this.events();
      this.images();

      if (typeof method !== 'string') {
        return this.settings.init;
      } else {
        return this[method].call(this, options);
      }
    },

    events : function () {
      var self = this;

      $(window).on('resize.fndtn.interchange', self.throttle(function () {
        self.resize.call(self);
      }, 50));
    },

    resize : function () {
      var cache = this.cache;

      for (var uuid in cache) {
        if (cache.hasOwnProperty(uuid)) {
          var passed = this.results(uuid, cache[uuid]);

          if (passed) {
            this.settings.directives[passed
              .scenario[1]](passed.el, passed.scenario[0]);
          }
        }
      }

    },

    results : function (uuid, scenarios) {
      var count = scenarios.length,
          results_arr = [];

      if (count > 0) {
        var el = $('[data-uuid="' + uuid + '"]');

        for (var i = count - 1; i >= 0; i--) {
          var rule = scenarios[i][2];
          if (this.settings.named_queries.hasOwnProperty(rule)) {
            var mq = matchMedia(this.settings.named_queries[rule]);
          } else {
            var mq = matchMedia(scenarios[i][2]);
          }
          if (mq.matches) {
            return {el: el, scenario: scenarios[i]};
          }
        }
      }

      return false;
    },

    images : function (force_update) {
      if (typeof this.cached_images === 'undefined' || force_update) {
        return this.update_images();
      }

      return this.cached_images;
    },

    update_images : function () {
      var images = document.getElementsByTagName('img'),
          count = images.length,
          data_attr = 'data-' + this.settings.load_attr;

      this.cached_images = [];

      for (var i = count - 1; i >= 0; i--) {
        this.loaded($(images[i]), (i === 0), function (image, last) {
          if (image) {
            var str = image.getAttribute(data_attr) || '';

            if (str.length > 0) {
              this.cached_images.push(image);
            }
          }

          if (last) this.enhance();

        }.bind(this));
      }

      return 'deferred';
    },

    // based on jquery.imageready.js
    // @weblinc, @jsantell, (c) 2012

    loaded : function (image, last, callback) {
      function loaded () {
        callback(image[0], last);
      }

      function bindLoad () {
        this.one('load', loaded);

        if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
          var src = this.attr( 'src' ),
              param = src.match( /\?/ ) ? '&' : '?';

          param += 'random=' + (new Date()).getTime();
          this.attr('src', src + param);
        }
      }

      if (!image.attr('src')) {
        loaded();
        return;
      }

      if (image[0].complete || image[0].readyState === 4) {
        loaded();
      } else {
        bindLoad.call(image);
      }
    },

    enhance : function () {
      var count = this.images().length;

      for (var i = count - 1; i >= 0; i--) {
        this._object($(this.images()[i]));
      }

      return $(window).trigger('resize');
    },

    parse_params : function (path, directive, mq) {
      return [this.trim(path), this.convert_directive(directive), this.trim(mq)];
    },

    convert_directive : function (directive) {
      var trimmed = this.trim(directive);

      if (trimmed.length > 0) {
        return trimmed;
      }

      return 'replace';
    },

    _object : function(el) {
      var raw_arr = this.parse_data_attr(el),
          scenarios = [], count = raw_arr.length;

      if (count > 0) {
        for (var i = count - 1; i >= 0; i--) {
          var split = raw_arr[i].split(/\((.*?)(\))$/);

          if (split.length > 1) {
            var cached_split = split[0].split(','),
                params = this.parse_params(cached_split[0],
                  cached_split[1], split[1]);

            scenarios.push(params);
          }
        }
      }

      return this.store(el, scenarios);
    },

    uuid : function (separator) {
      var delim = separator || "-";

      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }

      return (S4() + S4() + delim + S4() + delim + S4()
        + delim + S4() + delim + S4() + S4() + S4());
    },

    store : function (el, scenarios) {
      var uuid = this.uuid(),
          current_uuid = el.data('uuid');

      if (current_uuid) return this.cache[current_uuid];

      el.attr('data-uuid', uuid);

      return this.cache[uuid] = scenarios;
    },

    trim : function(str) {
      if (typeof str === 'string') {
        return $.trim(str);
      }

      return str;
    },

    parse_data_attr : function (el) {
      var raw = el.data(this.settings.load_attr).split(/\[(.*?)\]/),
          count = raw.length, output = [];

      for (var i = count - 1; i >= 0; i--) {
        if (raw[i].replace(/[\W\d]+/, '').length > 4) {
          output.push(raw[i]);
        }
      }

      return output;
    },

    reflow : function () {
      this.images(true);
    }

  };

}(Foundation.zj, this, this.document));
/*! http://mths.be/placeholder v2.0.7 by @mathias 
	Modified to work with Zepto.js by ZURB
*/

;(function(window, document, $) {

	var isInputSupported = 'placeholder' in document.createElement('input'),
	    isTextareaSupported = 'placeholder' in document.createElement('textarea'),
	    prototype = $.fn,
	    valHooks = $.valHooks,
	    hooks,
	    placeholder;

	if (isInputSupported && isTextareaSupported) {

		placeholder = prototype.placeholder = function() {
			return this;
		};

		placeholder.input = placeholder.textarea = true;

	} else {

		placeholder = prototype.placeholder = function() {
			var $this = this;
			$this
				.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
				.not('.placeholder')
				.bind({
					'focus.placeholder': clearPlaceholder,
					'blur.placeholder': setPlaceholder
				})
				.data('placeholder-enabled', true)
				.trigger('blur.placeholder');
			return $this;
		};

		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;

		hooks = {
			'get': function(element) {
				var $element = $(element);
				return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
			},
			'set': function(element, value) {
				var $element = $(element);
				if (!$element.data('placeholder-enabled')) {
					return element.value = value;
				}
				if (value == '') {
					element.value = value;
					// Issue #56: Setting the placeholder causes problems if the element continues to have focus.
					if (element != document.activeElement) {
						// We can't use `triggerHandler` here because of dummy text/password inputs :(
						setPlaceholder.call(element);
					}
				} else if ($element.hasClass('placeholder')) {
					clearPlaceholder.call(element, true, value) || (element.value = value);
				} else {
					element.value = value;
				}
				// `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
				return $element;
			}
		};

		isInputSupported || (valHooks.input = hooks);
		isTextareaSupported || (valHooks.textarea = hooks);

		$(function() {
			// Look for forms
			$(document).delegate('form', 'submit.placeholder', function() {
				// Clear the placeholder values so they don't get submitted
				var $inputs = $('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		// Clear placeholder values upon page reload
		$(window).bind('beforeunload.placeholder', function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});

	}

	function args(elem) {
		// Return an object of element attributes
		var newAttrs = {},
		    rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder(event, value) {
		var input = this,
		    $input = $(input);
		if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
				// If `clearPlaceholder` was called from `$.valHooks.input.set`
				if (event === true) {
					return $input[0].value = value;
				}
				$input.focus();
			} else {
				input.value = '';
				$input.removeClass('placeholder');
				input == document.activeElement && input.select();
			}
		}
	}

	function setPlaceholder() {
		var $replacement,
		    input = this,
		    $input = $(input),
		    $origInput = $input,
		    id = this.id;
		if (input.value == '') {
			if (input.type == 'password') {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().attr({ 'type': 'text' });
					} catch(e) {
						$replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
					}
					$replacement
						.removeAttr('name')
						.data({
							'placeholder-password': true,
							'placeholder-id': id
						})
						.bind('focus.placeholder', clearPlaceholder);
					$input
						.data({
							'placeholder-textinput': $replacement,
							'placeholder-id': id
						})
						.before($replacement);
				}
				$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
				// Note: `$input[0] != input` now!
			}
			$input.addClass('placeholder');
			$input[0].value = $input.attr('placeholder');
		} else {
			$input.removeClass('placeholder');
		}
	}

}(this, document, Foundation.zj));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.placeholder = {
    name : 'placeholder',

    version : '4.2.2',

    init : function (scope, method, options) {
      this.scope = scope || this.scope;

      if (typeof method !== 'string') {
        window.onload = function () {
        	$('input, textarea').placeholder();
        }
      }
    }
  };
}(Foundation.zj, this, this.document));
/*















*/
;
(function() {
  var CSRFToken, anchoredLink, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsPushState, cacheCurrentPage, cacheSize, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, fetchHistory, fetchReplacement, handleClick, ignoreClick, initializeTurbolinks, installClickHandlerLast, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, pageChangePrevented, pagesCached, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, removeHash, removeNoscriptTags, requestMethod, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, visit, xhr, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  cacheSize = 10;

  currentState = null;

  referer = null;

  loadedAssets = null;

  pageCache = {};

  createDocument = null;

  requestMethod = ((_ref = document.cookie.match(/request_method=(\w+)/)) != null ? _ref[1].toUpperCase() : void 0) || '';

  xhr = null;

  fetchReplacement = function(url) {
    var safeUrl;
    triggerEvent('page:fetch');
    safeUrl = removeHash(url);
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', safeUrl, true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent('page:receive');
      if (doc = processResponse()) {
        reflectNewUrl(url);
        changePage.apply(null, extractTitleAndBody(doc));
        reflectRedirectedUrl();
        if (document.location.hash) {
          document.location.href = document.location.href;
        } else {
          resetScrollPosition();
        }
        return triggerEvent('page:load');
      } else {
        return document.location.href = url;
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onabort = function() {
      return rememberCurrentUrl();
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(position) {
    var page;
    cacheCurrentPage();
    page = pageCache[position];
    if (xhr != null) {
      xhr.abort();
    }
    changePage(page.title, page.body);
    recallScrollPosition(page);
    return triggerEvent('page:restore');
  };

  cacheCurrentPage = function() {
    pageCache[currentState.position] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var key, value;
    for (key in pageCache) {
      if (!__hasProp.call(pageCache, key)) continue;
      value = pageCache[key];
      if (key <= currentState.position - limit) {
        pageCache[key] = null;
      }
    }
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    removeNoscriptTags();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    return triggerEvent('page:change');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref1, _ref2;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref1 = script.type) === '' || _ref1 === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref2 = script.attributes;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        attr = _ref2[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function() {
    var noscript, noscriptTags, _i, _len;
    noscriptTags = Array.prototype.slice.call(document.body.getElementsByTagName('noscript'));
    for (_i = 0, _len = noscriptTags.length; _i < _len; _i++) {
      noscript = noscriptTags[_i];
      noscript.parentNode.removeChild(noscript);
    }
  };

  reflectNewUrl = function(url) {
    if (url !== referer) {
      return window.history.pushState({
        turbolinks: true,
        position: currentState.position + 1
      }, '', url);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      preservedHash = removeHash(location) === location ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location + preservedHash);
    }
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      position: Date.now()
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    return window.scrollTo(0, 0);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  triggerEvent = function(name) {
    var event;
    event = document.createEvent('Events');
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function() {
    return !triggerEvent('page:before-change');
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var _ref1;
      return (400 <= (_ref1 = xhr.status) && _ref1 < 600);
    };
    validContent = function() {
      return xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref1, _results;
      _ref1 = doc.head.childNodes;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        node = _ref1[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.src || node.href);
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref1, _results;
      if (a.length > b.length) {
        _ref1 = [b, a], a = _ref1[0], b = _ref1[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, doc.body, CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref1;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref1 = testDoc.body) != null ? _ref1.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        if (!pageChangePrevented()) {
          visit(link.href);
        }
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(/\.html?(\?.*)?$/g);
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    createDocument = browserCompatibleDocumentParser();
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', function(event) {
      var state;
      state = event.state;
      if (state != null ? state.turbolinks : void 0) {
        if (pageCache[state.position]) {
          return fetchHistory(state.position);
        } else {
          return visit(event.target.location.href);
        }
      }
    }, false);
  };

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && window.history.state !== void 0;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = requestMethod === 'GET' || requestMethod === '';

  if (browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe) {
    visit = function(url) {
      referer = document.location.href;
      cacheCurrentPage();
      return fetchReplacement(url);
    };
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached
  };

}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
window.tinyMCEPreInit = window.tinyMCEPreInit || {
  base:   '/assets/tinymce',
  query:  '3.5.8.3',
  suffix: ''
};
// FILE IS GENERATED BY COMBINING THE SOURCES IN THE "classes" DIRECTORY SO DON'T MODIFY THIS FILE DIRECTLY
(function(win) {
	var whiteSpaceRe = /^\s*|\s*$/g,
		undef, isRegExpBroken = 'B'.replace(/A(.)|B/, '$1') === '$1';

	var tinymce = {
		majorVersion : '3',

		minorVersion : '5.8',

		releaseDate : '2012-11-20',

		_init : function() {
			var t = this, d = document, na = navigator, ua = na.userAgent, i, nl, n, base, p, v;

			t.isOpera = win.opera && opera.buildNumber;

			t.isWebKit = /WebKit/.test(ua);

			t.isIE = !t.isWebKit && !t.isOpera && (/MSIE/gi).test(ua) && (/Explorer/gi).test(na.appName);

			t.isIE6 = t.isIE && /MSIE [56]/.test(ua);

			t.isIE7 = t.isIE && /MSIE [7]/.test(ua);

			t.isIE8 = t.isIE && /MSIE [8]/.test(ua);

			t.isIE9 = t.isIE && /MSIE [9]/.test(ua);

			t.isGecko = !t.isWebKit && /Gecko/.test(ua);

			t.isMac = ua.indexOf('Mac') != -1;

			t.isAir = /adobeair/i.test(ua);

			t.isIDevice = /(iPad|iPhone)/.test(ua);
			
			t.isIOS5 = t.isIDevice && ua.match(/AppleWebKit\/(\d*)/)[1]>=534;

			// TinyMCE .NET webcontrol might be setting the values for TinyMCE
			if (win.tinyMCEPreInit) {
				t.suffix = tinyMCEPreInit.suffix;
				t.baseURL = tinyMCEPreInit.base;
				t.query = tinyMCEPreInit.query;
				return;
			}

			// Get suffix and base
			t.suffix = '';

			// If base element found, add that infront of baseURL
			nl = d.getElementsByTagName('base');
			for (i=0; i<nl.length; i++) {
				v = nl[i].href;
				if (v) {
					// Host only value like http://site.com or http://site.com:8008
					if (/^https?:\/\/[^\/]+$/.test(v))
						v += '/';

					base = v ? v.match(/.*\//)[0] : ''; // Get only directory
				}
			}

			function getBase(n) {
				if (n.src && /tiny_mce(|_gzip|_jquery|_prototype|_full)(_dev|_src)?.js/.test(n.src)) {
					if (/_(src|dev)\.js/g.test(n.src))
						t.suffix = '_src';

					if ((p = n.src.indexOf('?')) != -1)
						t.query = n.src.substring(p + 1);

					t.baseURL = n.src.substring(0, n.src.lastIndexOf('/'));

					// If path to script is relative and a base href was found add that one infront
					// the src property will always be an absolute one on non IE browsers and IE 8
					// so this logic will basically only be executed on older IE versions
					if (base && t.baseURL.indexOf('://') == -1 && t.baseURL.indexOf('/') !== 0)
						t.baseURL = base + t.baseURL;

					return t.baseURL;
				}

				return null;
			};

			// Check document
			nl = d.getElementsByTagName('script');
			for (i=0; i<nl.length; i++) {
				if (getBase(nl[i]))
					return;
			}

			// Check head
			n = d.getElementsByTagName('head')[0];
			if (n) {
				nl = n.getElementsByTagName('script');
				for (i=0; i<nl.length; i++) {
					if (getBase(nl[i]))
						return;
				}
			}

			return;
		},

		is : function(o, t) {
			if (!t)
				return o !== undef;

			if (t == 'array' && tinymce.isArray(o))
				return true;

			return typeof(o) == t;
		},

		isArray: Array.isArray || function(obj) {
			return Object.prototype.toString.call(obj) === "[object Array]";
		},

		makeMap : function(items, delim, map) {
			var i;

			items = items || [];
			delim = delim || ',';

			if (typeof(items) == "string")
				items = items.split(delim);

			map = map || {};

			i = items.length;
			while (i--)
				map[items[i]] = {};

			return map;
		},

		each : function(o, cb, s) {
			var n, l;

			if (!o)
				return 0;

			s = s || o;

			if (o.length !== undef) {
				// Indexed arrays, needed for Safari
				for (n=0, l = o.length; n < l; n++) {
					if (cb.call(s, o[n], n, o) === false)
						return 0;
				}
			} else {
				// Hashtables
				for (n in o) {
					if (o.hasOwnProperty(n)) {
						if (cb.call(s, o[n], n, o) === false)
							return 0;
					}
				}
			}

			return 1;
		},


		trim : function(s) {
			return (s ? '' + s : '').replace(whiteSpaceRe, '');
		},

		create : function(s, p, root) {
			var t = this, sp, ns, cn, scn, c, de = 0;

			// Parse : <prefix> <class>:<super class>
			s = /^((static) )?([\w.]+)(:([\w.]+))?/.exec(s);
			cn = s[3].match(/(^|\.)(\w+)$/i)[2]; // Class name

			// Create namespace for new class
			ns = t.createNS(s[3].replace(/\.\w+$/, ''), root);

			// Class already exists
			if (ns[cn])
				return;

			// Make pure static class
			if (s[2] == 'static') {
				ns[cn] = p;

				if (this.onCreate)
					this.onCreate(s[2], s[3], ns[cn]);

				return;
			}

			// Create default constructor
			if (!p[cn]) {
				p[cn] = function() {};
				de = 1;
			}

			// Add constructor and methods
			ns[cn] = p[cn];
			t.extend(ns[cn].prototype, p);

			// Extend
			if (s[5]) {
				sp = t.resolve(s[5]).prototype;
				scn = s[5].match(/\.(\w+)$/i)[1]; // Class name

				// Extend constructor
				c = ns[cn];
				if (de) {
					// Add passthrough constructor
					ns[cn] = function() {
						return sp[scn].apply(this, arguments);
					};
				} else {
					// Add inherit constructor
					ns[cn] = function() {
						this.parent = sp[scn];
						return c.apply(this, arguments);
					};
				}
				ns[cn].prototype[cn] = ns[cn];

				// Add super methods
				t.each(sp, function(f, n) {
					ns[cn].prototype[n] = sp[n];
				});

				// Add overridden methods
				t.each(p, function(f, n) {
					// Extend methods if needed
					if (sp[n]) {
						ns[cn].prototype[n] = function() {
							this.parent = sp[n];
							return f.apply(this, arguments);
						};
					} else {
						if (n != cn)
							ns[cn].prototype[n] = f;
					}
				});
			}

			// Add static methods
			t.each(p['static'], function(f, n) {
				ns[cn][n] = f;
			});

			if (this.onCreate)
				this.onCreate(s[2], s[3], ns[cn].prototype);
		},

		walk : function(o, f, n, s) {
			s = s || this;

			if (o) {
				if (n)
					o = o[n];

				tinymce.each(o, function(o, i) {
					if (f.call(s, o, i, n) === false)
						return false;

					tinymce.walk(o, f, n, s);
				});
			}
		},

		createNS : function(n, o) {
			var i, v;

			o = o || win;

			n = n.split('.');
			for (i=0; i<n.length; i++) {
				v = n[i];

				if (!o[v])
					o[v] = {};

				o = o[v];
			}

			return o;
		},

		resolve : function(n, o) {
			var i, l;

			o = o || win;

			n = n.split('.');
			for (i = 0, l = n.length; i < l; i++) {
				o = o[n[i]];

				if (!o)
					break;
			}

			return o;
		},

		addUnload : function(f, s) {
			var t = this, unload;

			unload = function() {
				var li = t.unloads, o, n;

				if (li) {
					// Call unload handlers
					for (n in li) {
						o = li[n];

						if (o && o.func)
							o.func.call(o.scope, 1); // Send in one arg to distinct unload and user destroy
					}

					// Detach unload function
					if (win.detachEvent) {
						win.detachEvent('onbeforeunload', fakeUnload);
						win.detachEvent('onunload', unload);
					} else if (win.removeEventListener)
						win.removeEventListener('unload', unload, false);

					// Destroy references
					t.unloads = o = li = w = unload = 0;

					// Run garbarge collector on IE
					if (win.CollectGarbage)
						CollectGarbage();
				}
			};

			function fakeUnload() {
				var d = document;

				function stop() {
					// Prevent memory leak
					d.detachEvent('onstop', stop);

					// Call unload handler
					if (unload)
						unload();

					d = 0;
				};

				// Is there things still loading, then do some magic
				if (d.readyState == 'interactive') {
					// Fire unload when the currently loading page is stopped
					if (d)
						d.attachEvent('onstop', stop);

					// Remove onstop listener after a while to prevent the unload function
					// to execute if the user presses cancel in an onbeforeunload
					// confirm dialog and then presses the browser stop button
					win.setTimeout(function() {
						if (d)
							d.detachEvent('onstop', stop);
					}, 0);
				}
			};

			f = {func : f, scope : s || this};

			if (!t.unloads) {
				// Attach unload handler
				if (win.attachEvent) {
					win.attachEvent('onunload', unload);
					win.attachEvent('onbeforeunload', fakeUnload);
				} else if (win.addEventListener)
					win.addEventListener('unload', unload, false);

				// Setup initial unload handler array
				t.unloads = [f];
			} else
				t.unloads.push(f);

			return f;
		},

		removeUnload : function(f) {
			var u = this.unloads, r = null;

			tinymce.each(u, function(o, i) {
				if (o && o.func == f) {
					u.splice(i, 1);
					r = f;
					return false;
				}
			});

			return r;
		},

		explode : function(s, d) {
			if (!s || tinymce.is(s, 'array')) {
				return s;
			}

			return tinymce.map(s.split(d || ','), tinymce.trim);
		},

		_addVer : function(u) {
			var v;

			if (!this.query)
				return u;

			v = (u.indexOf('?') == -1 ? '?' : '&') + this.query;

			if (u.indexOf('#') == -1)
				return u + v;

			return u.replace('#', v + '#');
		},

		// Fix function for IE 9 where regexps isn't working correctly
		// Todo: remove me once MS fixes the bug
		_replace : function(find, replace, str) {
			// On IE9 we have to fake $x replacement
			if (isRegExpBroken) {
				return str.replace(find, function() {
					var val = replace, args = arguments, i;

					for (i = 0; i < args.length - 2; i++) {
						if (args[i] === undef) {
							val = val.replace(new RegExp('\\$' + i, 'g'), '');
						} else {
							val = val.replace(new RegExp('\\$' + i, 'g'), args[i]);
						}
					}

					return val;
				});
			}

			return str.replace(find, replace);
		}

		};

	// Initialize the API
	tinymce._init();

	// Expose tinymce namespace to the global namespace (window)
	win.tinymce = win.tinyMCE = tinymce;

	// Describe the different namespaces

	})(window);


(function($, tinymce) {
	var is = tinymce.is, attrRegExp = /^(href|src|style)$/i, undef;

	// jQuery is undefined
	if (!$ && window.console) {
		return console.log("Load jQuery first!");
	}

	// Stick jQuery into the tinymce namespace
	tinymce.$ = $;

	// Setup adapter
	tinymce.adapter = {
		patchEditor : function(editor) {
			var fn = $.fn;

			// Adapt the css function to make sure that the data-mce-style
			// attribute gets updated with the new style information
			function css(name, value) {
				var self = this;

				// Remove data-mce-style when set operation occurs
				if (value)
					self.removeAttr('data-mce-style');

				return fn.css.apply(self, arguments);
			};

			// Apapt the attr function to make sure that it uses the data-mce- prefixed variants
			function attr(name, value) {
				var self = this;

				// Update/retrive data-mce- attribute variants
				if (attrRegExp.test(name)) {
					if (value !== undef) {
						// Use TinyMCE behavior when setting the specifc attributes
						self.each(function(i, node) {
							editor.dom.setAttrib(node, name, value);
						});

						return self;
					} else
						return self.attr('data-mce-' + name);
				}

				// Default behavior
				return fn.attr.apply(self, arguments);
			};

			// Patch various jQuery functions to handle tinymce specific attribute and content behavior
			// we don't patch the jQuery.fn directly since it will most likely break compatibility
			// with other jQuery logic on the page. Only instances created by TinyMCE should be patched.
			function patch(jq) {
				// Patch some functions, only patch the object once
				if (jq.css !== css) {
					// Patch css/attr to use the data-mce- prefixed attribute variants
					jq.css = css;
					jq.attr = attr;

					jq.tinymce = editor;

					// Each pushed jQuery instance needs to be patched
					// as well for example when traversing the DOM
					jq.pushStack = function() {
						return patch(fn.pushStack.apply(this, arguments));
					};
				}

				return jq;
			};

			// Add a $ function on each editor instance this one is scoped for the editor document object
			// this way you can do chaining like this tinymce.get(0).$('p').append('text').css('color', 'red');
			editor.$ = function(selector, scope) {
				var doc = editor.getDoc();

				return patch($(selector || doc, doc || scope));
			};
		}
	};

	// Patch in core NS functions
	tinymce.extend = $.extend;
	tinymce.extend(tinymce, {
		map : $.map,
		grep : function(a, f) {return $.grep(a, f || function(){return 1;});},
		inArray : function(a, v) {return $.inArray(v, a || []);}

		/* Didn't iterate stylesheets
		each : function(o, cb, s) {
			if (!o)
				return 0;

			var r = 1;

			$.each(o, function(nr, el){
				if (cb.call(s, el, nr, o) === false) {
					r = 0;
					return false;
				}
			});

			return r;
		}*/
	});

	// Patch in functions in various clases
	// Add a "#ifndefjquery" statement around each core API function you add below
	var patches = {
		'tinymce.dom.DOMUtils' : {
			/*
			addClass : function(e, c) {
				if (is(e, 'array') && is(e[0], 'string'))
					e = e.join(',#');
				return (e && $(is(e, 'string') ? '#' + e : e)
					.addClass(c)
					.attr('class')) || false;
			},

			hasClass : function(n, c) {
				return $(is(n, 'string') ? '#' + n : n).hasClass(c);
			},

			removeClass : function(e, c) {
				if (!e)
					return false;

				var r = [];

				$(is(e, 'string') ? '#' + e : e)
					.removeClass(c)
					.each(function(){
						r.push(this.className);
					});

				return r.length == 1 ? r[0] : r;
			},
			*/

			select : function(pattern, scope) {
				var t = this;

				return $.find(pattern, t.get(scope) || t.get(t.settings.root_element) || t.doc, []);
			},

			is : function(n, patt) {
				return $(this.get(n)).is(patt);
			}

			/*
			show : function(e) {
				if (is(e, 'array') && is(e[0], 'string'))
					e = e.join(',#');

				$(is(e, 'string') ? '#' + e : e).css('display', 'block');
			},

			hide : function(e) {
				if (is(e, 'array') && is(e[0], 'string'))
					e = e.join(',#');

				$(is(e, 'string') ? '#' + e : e).css('display', 'none');
			},

			isHidden : function(e) {
				return $(is(e, 'string') ? '#' + e : e).is(':hidden');
			},

			insertAfter : function(n, e) {
				return $(is(e, 'string') ? '#' + e : e).after(n);
			},

			replace : function(o, n, k) {
				n = $(is(n, 'string') ? '#' + n : n);

				if (k)
					n.children().appendTo(o);

				n.replaceWith(o);
			},

			setStyle : function(n, na, v) {
				if (is(n, 'array') && is(n[0], 'string'))
					n = n.join(',#');

				$(is(n, 'string') ? '#' + n : n).css(na, v);
			},

			getStyle : function(n, na, c) {
				return $(is(n, 'string') ? '#' + n : n).css(na);
			},

			setStyles : function(e, o) {
				if (is(e, 'array') && is(e[0], 'string'))
					e = e.join(',#');
				$(is(e, 'string') ? '#' + e : e).css(o);
			},

			setAttrib : function(e, n, v) {
				var t = this, s = t.settings;

				if (is(e, 'array') && is(e[0], 'string'))
					e = e.join(',#');

				e = $(is(e, 'string') ? '#' + e : e);

				switch (n) {
					case "style":
						e.each(function(i, v){
							if (s.keep_values)
								$(v).attr('data-mce-style', v);

							v.style.cssText = v;
						});
						break;

					case "class":
						e.each(function(){
							this.className = v;
						});
						break;

					case "src":
					case "href":
						e.each(function(i, v){
							if (s.keep_values) {
								if (s.url_converter)
									v = s.url_converter.call(s.url_converter_scope || t, v, n, v);

								t.setAttrib(v, 'data-mce-' + n, v);
							}
						});

						break;
				}

				if (v !== null && v.length !== 0)
					e.attr(n, '' + v);
				else
					e.removeAttr(n);
			},

			setAttribs : function(e, o) {
				var t = this;

				$.each(o, function(n, v){
					t.setAttrib(e,n,v);
				});
			}
			*/
		}

/*
		'tinymce.dom.Event' : {
			add : function (o, n, f, s) {
				var lo, cb;

				cb = function(e) {
					e.target = e.target || this;
					f.call(s || this, e);
				};

				if (is(o, 'array') && is(o[0], 'string'))
					o = o.join(',#');
				o = $(is(o, 'string') ? '#' + o : o);
				if (n == 'init') {
					o.ready(cb, s);
				} else {
					if (s) {
						o.bind(n, s, cb);
					} else {
						o.bind(n, cb);
					}
				}

				lo = this._jqLookup || (this._jqLookup = []);
				lo.push({func : f, cfunc : cb});

				return cb;
			},

			remove : function(o, n, f) {
				// Find cfunc
				$(this._jqLookup).each(function() {
					if (this.func === f)
						f = this.cfunc;
				});

				if (is(o, 'array') && is(o[0], 'string'))
					o = o.join(',#');

				$(is(o, 'string') ? '#' + o : o).unbind(n,f);

				return true;
			}
		}
*/
	};

	// Patch functions after a class is created
	tinymce.onCreate = function(ty, c, p) {
		tinymce.extend(p, patches[c]);
	};
})(window.jQuery, tinymce);



tinymce.create('tinymce.util.Dispatcher', {
	scope : null,
	listeners : null,
	inDispatch: false,

	Dispatcher : function(scope) {
		this.scope = scope || this;
		this.listeners = [];
	},

	add : function(callback, scope) {
		this.listeners.push({cb : callback, scope : scope || this.scope});

		return callback;
	},

	addToTop : function(callback, scope) {
		var self = this, listener = {cb : callback, scope : scope || self.scope};

		// Create new listeners if addToTop is executed in a dispatch loop
		if (self.inDispatch) {
			self.listeners = [listener].concat(self.listeners);
		} else {
			self.listeners.unshift(listener);
		}

		return callback;
	},

	remove : function(callback) {
		var listeners = this.listeners, output = null;

		tinymce.each(listeners, function(listener, i) {
			if (callback == listener.cb) {
				output = listener;
				listeners.splice(i, 1);
				return false;
			}
		});

		return output;
	},

	dispatch : function() {
		var self = this, returnValue, args = arguments, i, listeners = self.listeners, listener;

		self.inDispatch = true;
		
		// Needs to be a real loop since the listener count might change while looping
		// And this is also more efficient
		for (i = 0; i < listeners.length; i++) {
			listener = listeners[i];
			returnValue = listener.cb.apply(listener.scope, args.length > 0 ? args : [listener.scope]);

			if (returnValue === false)
				break;
		}

		self.inDispatch = false;

		return returnValue;
	}

	});

(function() {
	var each = tinymce.each;

	tinymce.create('tinymce.util.URI', {
		URI : function(u, s) {
			var t = this, o, a, b, base_url;

			// Trim whitespace
			u = tinymce.trim(u);

			// Default settings
			s = t.settings = s || {};

			// Strange app protocol that isn't http/https or local anchor
			// For example: mailto,skype,tel etc.
			if (/^([\w\-]+):([^\/]{2})/i.test(u) || /^\s*#/.test(u)) {
				t.source = u;
				return;
			}

			// Absolute path with no host, fake host and protocol
			if (u.indexOf('/') === 0 && u.indexOf('//') !== 0)
				u = (s.base_uri ? s.base_uri.protocol || 'http' : 'http') + '://mce_host' + u;

			// Relative path http:// or protocol relative //path
			if (!/^[\w\-]*:?\/\//.test(u)) {
				base_url = s.base_uri ? s.base_uri.path : new tinymce.util.URI(location.href).directory;
				u = ((s.base_uri && s.base_uri.protocol) || 'http') + '://mce_host' + t.toAbsPath(base_url, u);
			}

			// Parse URL (Credits goes to Steave, http://blog.stevenlevithan.com/archives/parseuri)
			u = u.replace(/@@/g, '(mce_at)'); // Zope 3 workaround, they use @@something
			u = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(u);
			each(["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"], function(v, i) {
				var s = u[i];

				// Zope 3 workaround, they use @@something
				if (s)
					s = s.replace(/\(mce_at\)/g, '@@');

				t[v] = s;
			});

			b = s.base_uri;
			if (b) {
				if (!t.protocol)
					t.protocol = b.protocol;

				if (!t.userInfo)
					t.userInfo = b.userInfo;

				if (!t.port && t.host === 'mce_host')
					t.port = b.port;

				if (!t.host || t.host === 'mce_host')
					t.host = b.host;

				t.source = '';
			}

			//t.path = t.path || '/';
		},

		setPath : function(p) {
			var t = this;

			p = /^(.*?)\/?(\w+)?$/.exec(p);

			// Update path parts
			t.path = p[0];
			t.directory = p[1];
			t.file = p[2];

			// Rebuild source
			t.source = '';
			t.getURI();
		},

		toRelative : function(u) {
			var t = this, o;

			if (u === "./")
				return u;

			u = new tinymce.util.URI(u, {base_uri : t});

			// Not on same domain/port or protocol
			if ((u.host != 'mce_host' && t.host != u.host && u.host) || t.port != u.port || t.protocol != u.protocol)
				return u.getURI();

			var tu = t.getURI(), uu = u.getURI();
			
			// Allow usage of the base_uri when relative_urls = true
			if(tu == uu || (tu.charAt(tu.length - 1) == "/" && tu.substr(0, tu.length - 1) == uu))
				return tu;

			o = t.toRelPath(t.path, u.path);

			// Add query
			if (u.query)
				o += '?' + u.query;

			// Add anchor
			if (u.anchor)
				o += '#' + u.anchor;

			return o;
		},
	
		toAbsolute : function(u, nh) {
			u = new tinymce.util.URI(u, {base_uri : this});

			return u.getURI(this.host == u.host && this.protocol == u.protocol ? nh : 0);
		},

		toRelPath : function(base, path) {
			var items, bp = 0, out = '', i, l;

			// Split the paths
			base = base.substring(0, base.lastIndexOf('/'));
			base = base.split('/');
			items = path.split('/');

			if (base.length >= items.length) {
				for (i = 0, l = base.length; i < l; i++) {
					if (i >= items.length || base[i] != items[i]) {
						bp = i + 1;
						break;
					}
				}
			}

			if (base.length < items.length) {
				for (i = 0, l = items.length; i < l; i++) {
					if (i >= base.length || base[i] != items[i]) {
						bp = i + 1;
						break;
					}
				}
			}

			if (bp === 1)
				return path;

			for (i = 0, l = base.length - (bp - 1); i < l; i++)
				out += "../";

			for (i = bp - 1, l = items.length; i < l; i++) {
				if (i != bp - 1)
					out += "/" + items[i];
				else
					out += items[i];
			}

			return out;
		},

		toAbsPath : function(base, path) {
			var i, nb = 0, o = [], tr, outPath;

			// Split paths
			tr = /\/$/.test(path) ? '/' : '';
			base = base.split('/');
			path = path.split('/');

			// Remove empty chunks
			each(base, function(k) {
				if (k)
					o.push(k);
			});

			base = o;

			// Merge relURLParts chunks
			for (i = path.length - 1, o = []; i >= 0; i--) {
				// Ignore empty or .
				if (path[i].length === 0 || path[i] === ".")
					continue;

				// Is parent
				if (path[i] === '..') {
					nb++;
					continue;
				}

				// Move up
				if (nb > 0) {
					nb--;
					continue;
				}

				o.push(path[i]);
			}

			i = base.length - nb;

			// If /a/b/c or /
			if (i <= 0)
				outPath = o.reverse().join('/');
			else
				outPath = base.slice(0, i).join('/') + '/' + o.reverse().join('/');

			// Add front / if it's needed
			if (outPath.indexOf('/') !== 0)
				outPath = '/' + outPath;

			// Add traling / if it's needed
			if (tr && outPath.lastIndexOf('/') !== outPath.length - 1)
				outPath += tr;

			return outPath;
		},

		getURI : function(nh) {
			var s, t = this;

			// Rebuild source
			if (!t.source || nh) {
				s = '';

				if (!nh) {
					if (t.protocol)
						s += t.protocol + '://';

					if (t.userInfo)
						s += t.userInfo + '@';

					if (t.host)
						s += t.host;

					if (t.port)
						s += ':' + t.port;
				}

				if (t.path)
					s += t.path;

				if (t.query)
					s += '?' + t.query;

				if (t.anchor)
					s += '#' + t.anchor;

				t.source = s;
			}

			return t.source;
		}
	});
})();

(function() {
	var each = tinymce.each;

	tinymce.create('static tinymce.util.Cookie', {
		getHash : function(n) {
			var v = this.get(n), h;

			if (v) {
				each(v.split('&'), function(v) {
					v = v.split('=');
					h = h || {};
					h[unescape(v[0])] = unescape(v[1]);
				});
			}

			return h;
		},

		setHash : function(n, v, e, p, d, s) {
			var o = '';

			each(v, function(v, k) {
				o += (!o ? '' : '&') + escape(k) + '=' + escape(v);
			});

			this.set(n, o, e, p, d, s);
		},

		get : function(n) {
			var c = document.cookie, e, p = n + "=", b;

			// Strict mode
			if (!c)
				return;

			b = c.indexOf("; " + p);

			if (b == -1) {
				b = c.indexOf(p);

				if (b !== 0)
					return null;
			} else
				b += 2;

			e = c.indexOf(";", b);

			if (e == -1)
				e = c.length;

			return unescape(c.substring(b + p.length, e));
		},

		set : function(n, v, e, p, d, s) {
			document.cookie = n + "=" + escape(v) +
				((e) ? "; expires=" + e.toGMTString() : "") +
				((p) ? "; path=" + escape(p) : "") +
				((d) ? "; domain=" + d : "") +
				((s) ? "; secure" : "");
		},

		remove : function(name, path, domain) {
			var date = new Date();

			date.setTime(date.getTime() - 1000);

			this.set(name, '', date, path, domain);
		}
	});
})();

(function() {
	function serialize(o, quote) {
		var i, v, t, name;

		quote = quote || '"';

		if (o == null)
			return 'null';

		t = typeof o;

		if (t == 'string') {
			v = '\bb\tt\nn\ff\rr\""\'\'\\\\';

			return quote + o.replace(/([\u0080-\uFFFF\x00-\x1f\"\'\\])/g, function(a, b) {
				// Make sure single quotes never get encoded inside double quotes for JSON compatibility
				if (quote === '"' && a === "'")
					return a;

				i = v.indexOf(b);

				if (i + 1)
					return '\\' + v.charAt(i + 1);

				a = b.charCodeAt().toString(16);

				return '\\u' + '0000'.substring(a.length) + a;
			}) + quote;
		}

		if (t == 'object') {
			if (o.hasOwnProperty && Object.prototype.toString.call(o) === '[object Array]') {
					for (i=0, v = '['; i<o.length; i++)
						v += (i > 0 ? ',' : '') + serialize(o[i], quote);

					return v + ']';
				}

				v = '{';

				for (name in o) {
					if (o.hasOwnProperty(name)) {
						v += typeof o[name] != 'function' ? (v.length > 1 ? ',' + quote : quote) + name + quote +':' + serialize(o[name], quote) : '';
					}
				}

				return v + '}';
		}

		return '' + o;
	};

	tinymce.util.JSON = {
		serialize: serialize,

		parse: function(s) {
			try {
				return eval('(' + s + ')');
			} catch (ex) {
				// Ignore
			}
		}

		};
})();

tinymce.create('static tinymce.util.XHR', {
	send : function(o) {
		var x, t, w = window, c = 0;

		function ready() {
			if (!o.async || x.readyState == 4 || c++ > 10000) {
				if (o.success && c < 10000 && x.status == 200)
					o.success.call(o.success_scope, '' + x.responseText, x, o);
				else if (o.error)
					o.error.call(o.error_scope, c > 10000 ? 'TIMED_OUT' : 'GENERAL', x, o);

				x = null;
			} else
				w.setTimeout(ready, 10);
		};

		// Default settings
		o.scope = o.scope || this;
		o.success_scope = o.success_scope || o.scope;
		o.error_scope = o.error_scope || o.scope;
		o.async = o.async === false ? false : true;
		o.data = o.data || '';

		function get(s) {
			x = 0;

			try {
				x = new ActiveXObject(s);
			} catch (ex) {
			}

			return x;
		};

		x = w.XMLHttpRequest ? new XMLHttpRequest() : get('Microsoft.XMLHTTP') || get('Msxml2.XMLHTTP');

		if (x) {
			if (x.overrideMimeType)
				x.overrideMimeType(o.content_type);

			x.open(o.type || (o.data ? 'POST' : 'GET'), o.url, o.async);

			if (o.content_type)
				x.setRequestHeader('Content-Type', o.content_type);

			x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

			x.send(o.data);

			// Syncronous request
			if (!o.async)
				return ready();

			// Wait for response, onReadyStateChange can not be used since it leaks memory in IE
			t = w.setTimeout(ready, 10);
		}
	}
});

(function() {
	var extend = tinymce.extend, JSON = tinymce.util.JSON, XHR = tinymce.util.XHR;

	tinymce.create('tinymce.util.JSONRequest', {
		JSONRequest : function(s) {
			this.settings = extend({
			}, s);
			this.count = 0;
		},

		send : function(o) {
			var ecb = o.error, scb = o.success;

			o = extend(this.settings, o);

			o.success = function(c, x) {
				c = JSON.parse(c);

				if (typeof(c) == 'undefined') {
					c = {
						error : 'JSON Parse error.'
					};
				}

				if (c.error)
					ecb.call(o.error_scope || o.scope, c.error, x);
				else
					scb.call(o.success_scope || o.scope, c.result);
			};

			o.error = function(ty, x) {
				if (ecb)
					ecb.call(o.error_scope || o.scope, ty, x);
			};

			o.data = JSON.serialize({
				id : o.id || 'c' + (this.count++),
				method : o.method,
				params : o.params
			});

			// JSON content type for Ruby on rails. Bug: #1883287
			o.content_type = 'application/json';

			XHR.send(o);
		},

		'static' : {
			sendRPC : function(o) {
				return new tinymce.util.JSONRequest().send(o);
			}
		}
	});
}());
(function(tinymce){
	tinymce.VK = {
		BACKSPACE: 8,
		DELETE: 46,
		DOWN: 40,
		ENTER: 13,
		LEFT: 37,
		RIGHT: 39,
		SPACEBAR: 32,
		TAB: 9,
		UP: 38,

		modifierPressed: function (e) {
			return e.shiftKey || e.ctrlKey || e.altKey;
		},

		metaKeyPressed: function(e) {
			// Check if ctrl or meta key is pressed also check if alt is false for Polish users
			return tinymce.isMac ? e.metaKey : e.ctrlKey && !e.altKey;
		}
	};
})(tinymce);

tinymce.util.Quirks = function(editor) {
	var VK = tinymce.VK, BACKSPACE = VK.BACKSPACE, DELETE = VK.DELETE, dom = editor.dom, selection = editor.selection,
		settings = editor.settings, parser = editor.parser, serializer = editor.serializer, each = tinymce.each;

	function setEditorCommandState(cmd, state) {
		try {
			editor.getDoc().execCommand(cmd, false, state);
		} catch (ex) {
			// Ignore
		}
	}

	function getDocumentMode() {
		var documentMode = editor.getDoc().documentMode;

		return documentMode ? documentMode : 6;
	};

	function isDefaultPrevented(e) {
		return e.isDefaultPrevented();
	};

	function cleanupStylesWhenDeleting() {
		function removeMergedFormatSpans(isDelete) {
			var rng, blockElm, node, clonedSpan;

			rng = selection.getRng();

			// Find root block
			blockElm = dom.getParent(rng.startContainer, dom.isBlock);

			// On delete clone the root span of the next block element
			if (isDelete) {
				blockElm = dom.getNext(blockElm, dom.isBlock);
			}

			// Locate root span element and clone it since it would otherwise get merged by the "apple-style-span" on delete/backspace
			if (blockElm) {
				node = blockElm.firstChild;

				// Ignore empty text nodes
				while (node && node.nodeType == 3 && node.nodeValue.length === 0) {
					node = node.nextSibling;
				}

				if (node && node.nodeName === 'SPAN') {
					clonedSpan = node.cloneNode(false);
				}
			}

			each(dom.select('span', blockElm), function(span) {
				span.setAttribute('data-mce-mark', '1');
			});

			// Do the backspace/delete action
			editor.getDoc().execCommand(isDelete ? 'ForwardDelete' : 'Delete', false, null);

			// Find all odd apple-style-spans
			blockElm = dom.getParent(rng.startContainer, dom.isBlock);
			each(dom.select('span', blockElm), function(span) {
				var bm = selection.getBookmark();

				if (clonedSpan) {
					dom.replace(clonedSpan.cloneNode(false), span, true);
				} else if (!span.getAttribute('data-mce-mark')) {
					dom.remove(span, true);
				} else {
					span.removeAttribute('data-mce-mark');
				}

				// Restore the selection
				selection.moveToBookmark(bm);
			});
		}

		editor.onKeyDown.add(function(editor, e) {
			var isDelete;

			isDelete = e.keyCode == DELETE;
			if (!isDefaultPrevented(e) && (isDelete || e.keyCode == BACKSPACE) && !VK.modifierPressed(e)) {
				e.preventDefault();
				removeMergedFormatSpans(isDelete);
			}
		});

		editor.addCommand('Delete', function() {removeMergedFormatSpans();});
	};
	
	function emptyEditorWhenDeleting() {
		function serializeRng(rng) {
			var body = dom.create("body");
			var contents = rng.cloneContents();
			body.appendChild(contents);
			return selection.serializer.serialize(body, {format: 'html'});
		}

		function allContentsSelected(rng) {
			var selection = serializeRng(rng);

			var allRng = dom.createRng();
			allRng.selectNode(editor.getBody());

			var allSelection = serializeRng(allRng);
			return selection === allSelection;
		}

		editor.onKeyDown.add(function(editor, e) {
			var keyCode = e.keyCode, isCollapsed;

			// Empty the editor if it's needed for example backspace at <p><b>|</b></p>
			if (!isDefaultPrevented(e) && (keyCode == DELETE || keyCode == BACKSPACE)) {
				isCollapsed = editor.selection.isCollapsed();

				// Selection is collapsed but the editor isn't empty
				if (isCollapsed && !dom.isEmpty(editor.getBody())) {
					return;
				}

				// IE deletes all contents correctly when everything is selected
				if (tinymce.isIE && !isCollapsed) {
					return;
				}

				// Selection isn't collapsed but not all the contents is selected
				if (!isCollapsed && !allContentsSelected(editor.selection.getRng())) {
					return;
				}

				// Manually empty the editor
				editor.setContent('');
				editor.selection.setCursorLocation(editor.getBody(), 0);
				editor.nodeChanged();
			}
		});
	};

	function selectAll() {
		editor.onKeyDown.add(function(editor, e) {
			if (!isDefaultPrevented(e) && e.keyCode == 65 && VK.metaKeyPressed(e)) {
				e.preventDefault();
				editor.execCommand('SelectAll');
			}
		});
	};

	function inputMethodFocus() {
		if (!editor.settings.content_editable) {
			// Case 1 IME doesn't initialize if you focus the document
			dom.bind(editor.getDoc(), 'focusin', function(e) {
				selection.setRng(selection.getRng());
			});

			// Case 2 IME doesn't initialize if you click the documentElement it also doesn't properly fire the focusin event
			dom.bind(editor.getDoc(), 'mousedown', function(e) {
				if (e.target == editor.getDoc().documentElement) {
					editor.getWin().focus();
					selection.setRng(selection.getRng());
				}
			});
		}
	};

	function removeHrOnBackspace() {
		editor.onKeyDown.add(function(editor, e) {
			if (!isDefaultPrevented(e) && e.keyCode === BACKSPACE) {
				if (selection.isCollapsed() && selection.getRng(true).startOffset === 0) {
					var node = selection.getNode();
					var previousSibling = node.previousSibling;

					if (previousSibling && previousSibling.nodeName && previousSibling.nodeName.toLowerCase() === "hr") {
						dom.remove(previousSibling);
						tinymce.dom.Event.cancel(e);
					}
				}
			}
		})
	}

	function focusBody() {
		// Fix for a focus bug in FF 3.x where the body element
		// wouldn't get proper focus if the user clicked on the HTML element
		if (!Range.prototype.getClientRects) { // Detect getClientRects got introduced in FF 4
			editor.onMouseDown.add(function(editor, e) {
				if (!isDefaultPrevented(e) && e.target.nodeName === "HTML") {
					var body = editor.getBody();

					// Blur the body it's focused but not correctly focused
					body.blur();

					// Refocus the body after a little while
					setTimeout(function() {
						body.focus();
					}, 0);
				}
			});
		}
	};

	function selectControlElements() {
		editor.onClick.add(function(editor, e) {
			e = e.target;

			// Workaround for bug, http://bugs.webkit.org/show_bug.cgi?id=12250
			// WebKit can't even do simple things like selecting an image
			// Needs tobe the setBaseAndExtend or it will fail to select floated images
			if (/^(IMG|HR)$/.test(e.nodeName)) {
				selection.getSel().setBaseAndExtent(e, 0, e, 1);
			}

			if (e.nodeName == 'A' && dom.hasClass(e, 'mceItemAnchor')) {
				selection.select(e);
			}

			editor.nodeChanged();
		});
	};

	function removeStylesWhenDeletingAccrossBlockElements() {
		function getAttributeApplyFunction() {
			var template = dom.getAttribs(selection.getStart().cloneNode(false));

			return function() {
				var target = selection.getStart();

				if (target !== editor.getBody()) {
					dom.setAttrib(target, "style", null);

					each(template, function(attr) {
						target.setAttributeNode(attr.cloneNode(true));
					});
				}
			};
		}

		function isSelectionAcrossElements() {
			return !selection.isCollapsed() && dom.getParent(selection.getStart(), dom.isBlock) != dom.getParent(selection.getEnd(), dom.isBlock);
		}

		function blockEvent(editor, e) {
			e.preventDefault();
			return false;
		}

		editor.onKeyPress.add(function(editor, e) {
			var applyAttributes;

			if (!isDefaultPrevented(e) && (e.keyCode == 8 || e.keyCode == 46) && isSelectionAcrossElements()) {
				applyAttributes = getAttributeApplyFunction();
				editor.getDoc().execCommand('delete', false, null);
				applyAttributes();
				e.preventDefault();
				return false;
			}
		});

		dom.bind(editor.getDoc(), 'cut', function(e) {
			var applyAttributes;

			if (!isDefaultPrevented(e) && isSelectionAcrossElements()) {
				applyAttributes = getAttributeApplyFunction();
				editor.onKeyUp.addToTop(blockEvent);

				setTimeout(function() {
					applyAttributes();
					editor.onKeyUp.remove(blockEvent);
				}, 0);
			}
		});
	}

	function selectionChangeNodeChanged() {
		var lastRng, selectionTimer;

		dom.bind(editor.getDoc(), 'selectionchange', function() {
			if (selectionTimer) {
				clearTimeout(selectionTimer);
				selectionTimer = 0;
			}

			selectionTimer = window.setTimeout(function() {
				var rng = selection.getRng();

				// Compare the ranges to see if it was a real change or not
				if (!lastRng || !tinymce.dom.RangeUtils.compareRanges(rng, lastRng)) {
					editor.nodeChanged();
					lastRng = rng;
				}
			}, 50);
		});
	}

	function ensureBodyHasRoleApplication() {
		document.body.setAttribute("role", "application");
	}

	function disableBackspaceIntoATable() {
		editor.onKeyDown.add(function(editor, e) {
			if (!isDefaultPrevented(e) && e.keyCode === BACKSPACE) {
				if (selection.isCollapsed() && selection.getRng(true).startOffset === 0) {
					var previousSibling = selection.getNode().previousSibling;
					if (previousSibling && previousSibling.nodeName && previousSibling.nodeName.toLowerCase() === "table") {
						return tinymce.dom.Event.cancel(e);
					}
				}
			}
		})
	}

	function addNewLinesBeforeBrInPre() {
		// IE8+ rendering mode does the right thing with BR in PRE
		if (getDocumentMode() > 7) {
			return;
		}

		 // Enable display: none in area and add a specific class that hides all BR elements in PRE to
		 // avoid the caret from getting stuck at the BR elements while pressing the right arrow key
		setEditorCommandState('RespectVisibilityInDesign', true);
		editor.contentStyles.push('.mceHideBrInPre pre br {display: none}');
		dom.addClass(editor.getBody(), 'mceHideBrInPre');

		// Adds a \n before all BR elements in PRE to get them visual
		parser.addNodeFilter('pre', function(nodes, name) {
			var i = nodes.length, brNodes, j, brElm, sibling;

			while (i--) {
				brNodes = nodes[i].getAll('br');
				j = brNodes.length;
				while (j--) {
					brElm = brNodes[j];

					// Add \n before BR in PRE elements on older IE:s so the new lines get rendered
					sibling = brElm.prev;
					if (sibling && sibling.type === 3 && sibling.value.charAt(sibling.value - 1) != '\n') {
						sibling.value += '\n';
					} else {
						brElm.parent.insert(new tinymce.html.Node('#text', 3), brElm, true).value = '\n';
					}
				}
			}
		});

		// Removes any \n before BR elements in PRE since other browsers and in contentEditable=false mode they will be visible
		serializer.addNodeFilter('pre', function(nodes, name) {
			var i = nodes.length, brNodes, j, brElm, sibling;

			while (i--) {
				brNodes = nodes[i].getAll('br');
				j = brNodes.length;
				while (j--) {
					brElm = brNodes[j];
					sibling = brElm.prev;
					if (sibling && sibling.type == 3) {
						sibling.value = sibling.value.replace(/\r?\n$/, '');
					}
				}
			}
		});
	}

	function removePreSerializedStylesWhenSelectingControls() {
		dom.bind(editor.getBody(), 'mouseup', function(e) {
			var value, node = selection.getNode();

			// Moved styles to attributes on IMG eements
			if (node.nodeName == 'IMG') {
				// Convert style width to width attribute
				if (value = dom.getStyle(node, 'width')) {
					dom.setAttrib(node, 'width', value.replace(/[^0-9%]+/g, ''));
					dom.setStyle(node, 'width', '');
				}

				// Convert style height to height attribute
				if (value = dom.getStyle(node, 'height')) {
					dom.setAttrib(node, 'height', value.replace(/[^0-9%]+/g, ''));
					dom.setStyle(node, 'height', '');
				}
			}
		});
	}

	function keepInlineElementOnDeleteBackspace() {
		editor.onKeyDown.add(function(editor, e) {
			var isDelete, rng, container, offset, brElm, sibling, collapsed;

			isDelete = e.keyCode == DELETE;
			if (!isDefaultPrevented(e) && (isDelete || e.keyCode == BACKSPACE) && !VK.modifierPressed(e)) {
				rng = selection.getRng();
				container = rng.startContainer;
				offset = rng.startOffset;
				collapsed = rng.collapsed;

				// Override delete if the start container is a text node and is at the beginning of text or
				// just before/after the last character to be deleted in collapsed mode
				if (container.nodeType == 3 && container.nodeValue.length > 0 && ((offset === 0 && !collapsed) || (collapsed && offset === (isDelete ? 0 : 1)))) {
					nonEmptyElements = editor.schema.getNonEmptyElements();

					// Prevent default logic since it's broken
					e.preventDefault();

					// Insert a BR before the text node this will prevent the containing element from being deleted/converted
					brElm = dom.create('br', {id: '__tmp'});
					container.parentNode.insertBefore(brElm, container);

					// Do the browser delete
					editor.getDoc().execCommand(isDelete ? 'ForwardDelete' : 'Delete', false, null);

					// Check if the previous sibling is empty after deleting for example: <p><b></b>|</p>
					container = selection.getRng().startContainer;
					sibling = container.previousSibling;
					if (sibling && sibling.nodeType == 1 && !dom.isBlock(sibling) && dom.isEmpty(sibling) && !nonEmptyElements[sibling.nodeName.toLowerCase()]) {
						dom.remove(sibling);
					}

					// Remove the temp element we inserted
					dom.remove('__tmp');
				}
			}
		});
	}

	function removeBlockQuoteOnBackSpace() {
		// Add block quote deletion handler
		editor.onKeyDown.add(function(editor, e) {
			var rng, container, offset, root, parent;

			if (isDefaultPrevented(e) || e.keyCode != VK.BACKSPACE) {
				return;
			}

			rng = selection.getRng();
			container = rng.startContainer;
			offset = rng.startOffset;
			root = dom.getRoot();
			parent = container;

			if (!rng.collapsed || offset !== 0) {
				return;
			}

			while (parent && parent.parentNode && parent.parentNode.firstChild == parent && parent.parentNode != root) {
				parent = parent.parentNode;
			}

			// Is the cursor at the beginning of a blockquote?
			if (parent.tagName === 'BLOCKQUOTE') {
				// Remove the blockquote
				editor.formatter.toggle('blockquote', null, parent);

				// Move the caret to the beginning of container
				rng = dom.createRng();
				rng.setStart(container, 0);
				rng.setEnd(container, 0);
				selection.setRng(rng);
			}
		});
	};

	function setGeckoEditingOptions() {
		function setOpts() {
			editor._refreshContentEditable();

			setEditorCommandState("StyleWithCSS", false);
			setEditorCommandState("enableInlineTableEditing", false);

			if (!settings.object_resizing) {
				setEditorCommandState("enableObjectResizing", false);
			}
		};

		if (!settings.readonly) {
			editor.onBeforeExecCommand.add(setOpts);
			editor.onMouseDown.add(setOpts);
		}
	};

	function addBrAfterLastLinks() {
		function fixLinks(editor, o) {
			each(dom.select('a'), function(node) {
				var parentNode = node.parentNode, root = dom.getRoot();

				if (parentNode.lastChild === node) {
					while (parentNode && !dom.isBlock(parentNode)) {
						if (parentNode.parentNode.lastChild !== parentNode || parentNode === root) {
							return;
						}

						parentNode = parentNode.parentNode;
					}

					dom.add(parentNode, 'br', {'data-mce-bogus' : 1});
				}
			});
		};

		editor.onExecCommand.add(function(editor, cmd) {
			if (cmd === 'CreateLink') {
				fixLinks(editor);
			}
		});

		editor.onSetContent.add(selection.onSetContent.add(fixLinks));
	};

	function setDefaultBlockType() {
		if (settings.forced_root_block) {
			editor.onInit.add(function() {
				setEditorCommandState('DefaultParagraphSeparator', settings.forced_root_block);
			});
		}
	}

	function removeGhostSelection() {
		function repaint(sender, args) {
			if (!sender || !args.initial) {
				editor.execCommand('mceRepaint');
			}
		};

		editor.onUndo.add(repaint);
		editor.onRedo.add(repaint);
		editor.onSetContent.add(repaint);
	};

	function deleteControlItemOnBackSpace() {
		editor.onKeyDown.add(function(editor, e) {
			var rng;

			if (!isDefaultPrevented(e) && e.keyCode == BACKSPACE) {
				rng = editor.getDoc().selection.createRange();
				if (rng && rng.item) {
					e.preventDefault();
					editor.undoManager.beforeChange();
					dom.remove(rng.item(0));
					editor.undoManager.add();
				}
			}
		});
	};

	function renderEmptyBlocksFix() {
		var emptyBlocksCSS;

		// IE10+
		if (getDocumentMode() >= 10) {
			emptyBlocksCSS = '';
			each('p div h1 h2 h3 h4 h5 h6'.split(' '), function(name, i) {
				emptyBlocksCSS += (i > 0 ? ',' : '') + name + ':empty';
			});

			editor.contentStyles.push(emptyBlocksCSS + '{padding-right: 1px !important}');
		}
	};

	function fakeImageResize() {
		var selectedElmX, selectedElmY, selectedElm, selectedElmGhost, selectedHandle, startX, startY, startW, startH, ratio,
			resizeHandles, width, height, rootDocument = document, editableDoc = editor.getDoc();

		if (!settings.object_resizing || settings.webkit_fake_resize === false) {
			return;
		}

		// Try disabling object resizing if WebKit implements resizing in the future
		setEditorCommandState("enableObjectResizing", false);

		// Details about each resize handle how to scale etc
		resizeHandles = {
			// Name: x multiplier, y multiplier, delta size x, delta size y
			n: [.5, 0, 0, -1],
			e: [1, .5, 1, 0],
			s: [.5, 1, 0, 1],
			w: [0, .5, -1, 0],
			nw: [0, 0, -1, -1],
			ne: [1, 0, 1, -1],
			se: [1, 1, 1, 1],
			sw : [0, 1, -1, 1]
		};

		function resizeElement(e) {
			var deltaX, deltaY;

			// Calc new width/height
			deltaX = e.screenX - startX;
			deltaY = e.screenY - startY;

			// Calc new size
			width = deltaX * selectedHandle[2] + startW;
			height = deltaY * selectedHandle[3] + startH;

			// Never scale down lower than 5 pixels
			width = width < 5 ? 5 : width;
			height = height < 5 ? 5 : height;

			// Constrain proportions when modifier key is pressed or if the nw, ne, sw, se corners are moved on an image
			if (VK.modifierPressed(e) || (selectedElm.nodeName == "IMG" && selectedHandle[2] * selectedHandle[3] !== 0)) {
				width = Math.round(height / ratio);
				height = Math.round(width * ratio);
			}

			// Update ghost size
			dom.setStyles(selectedElmGhost, {
				width: width,
				height: height
			});

			// Update ghost X position if needed
			if (selectedHandle[2] < 0 && selectedElmGhost.clientWidth <= width) {
				dom.setStyle(selectedElmGhost, 'left', selectedElmX + (startW - width));
			}

			// Update ghost Y position if needed
			if (selectedHandle[3] < 0 && selectedElmGhost.clientHeight <= height) {
				dom.setStyle(selectedElmGhost, 'top', selectedElmY + (startH - height));
			}
		}

		function endResize() {
			function setSizeProp(name, value) {
				if (value) {
					// Resize by using style or attribute
					if (selectedElm.style[name] || !editor.schema.isValid(selectedElm.nodeName.toLowerCase(), name)) {
						dom.setStyle(selectedElm, name, value);
					} else {
						dom.setAttrib(selectedElm, name, value);
					}
				}
			}

			// Set width/height properties
			setSizeProp('width', width);
			setSizeProp('height', height);

			dom.unbind(editableDoc, 'mousemove', resizeElement);
			dom.unbind(editableDoc, 'mouseup', endResize);

			if (rootDocument != editableDoc) {
				dom.unbind(rootDocument, 'mousemove', resizeElement);
				dom.unbind(rootDocument, 'mouseup', endResize);
			}

			// Remove ghost and update resize handle positions
			dom.remove(selectedElmGhost);
			showResizeRect(selectedElm);
		}

		function showResizeRect(targetElm) {
			var position, targetWidth, targetHeight;

			hideResizeRect();

			// Get position and size of target
			position = dom.getPos(targetElm);
			selectedElmX = position.x;
			selectedElmY = position.y;
			targetWidth = targetElm.offsetWidth;
			targetHeight = targetElm.offsetHeight;

			// Reset width/height if user selects a new image/table
			if (selectedElm != targetElm) {
				selectedElm = targetElm;
				width = height = 0;
			}

			each(resizeHandles, function(handle, name) {
				var handleElm;

				// Get existing or render resize handle
				handleElm = dom.get('mceResizeHandle' + name);
				if (!handleElm) {
					handleElm = dom.add(editableDoc.documentElement, 'div', {
						id: 'mceResizeHandle' + name,
						'class': 'mceResizeHandle',
						style: 'cursor:' + name + '-resize; margin:0; padding:0'
					});

					dom.bind(handleElm, 'mousedown', function(e) {
						e.preventDefault();

						endResize();

						startX = e.screenX;
						startY = e.screenY;
						startW = selectedElm.clientWidth;
						startH = selectedElm.clientHeight;
						ratio = startH / startW;
						selectedHandle = handle;

						selectedElmGhost = selectedElm.cloneNode(true);
						dom.addClass(selectedElmGhost, 'mceClonedResizable');
						dom.setStyles(selectedElmGhost, {
							left: selectedElmX,
							top: selectedElmY,
							margin: 0
						});

						editableDoc.documentElement.appendChild(selectedElmGhost);

						dom.bind(editableDoc, 'mousemove', resizeElement);
						dom.bind(editableDoc, 'mouseup', endResize);

						if (rootDocument != editableDoc) {
							dom.bind(rootDocument, 'mousemove', resizeElement);
							dom.bind(rootDocument, 'mouseup', endResize);
						}
					});
				} else {
					dom.show(handleElm);
				}

				// Position element
				dom.setStyles(handleElm, {
					left: (targetWidth * handle[0] + selectedElmX) - (handleElm.offsetWidth / 2),
					top: (targetHeight * handle[1] + selectedElmY) - (handleElm.offsetHeight / 2)
				});
			});

			// Only add resize rectangle on WebKit and only on images
			if (!tinymce.isOpera && selectedElm.nodeName == "IMG") {
				selectedElm.setAttribute('data-mce-selected', '1');
			}
		}

		function hideResizeRect() {
			if (selectedElm) {
				selectedElm.removeAttribute('data-mce-selected');
			}

			for (var name in resizeHandles) {
				dom.hide('mceResizeHandle' + name);
			}
		}

		// Add CSS for resize handles, cloned element and selected
		editor.contentStyles.push(
			'.mceResizeHandle {' +
				'position: absolute;' +
				'border: 1px solid black;' +
				'background: #FFF;' +
				'width: 5px;' +
				'height: 5px;' +
				'z-index: 10000' +
			'}' +
			'.mceResizeHandle:hover {' +
				'background: #000' +
			'}' +
			'img[data-mce-selected] {' +
				'outline: 1px solid black' +
			'}' +
			'img.mceClonedResizable, table.mceClonedResizable {' +
				'position: absolute;' +
				'outline: 1px dashed black;' +
				'opacity: .5;' +
				'z-index: 10000' +
			'}'
		);

		function updateResizeRect() {
			var controlElm = dom.getParent(selection.getNode(), 'table,img');

			// Remove data-mce-selected from all elements since they might have been copied using Ctrl+c/v
			each(dom.select('img[data-mce-selected]'), function(img) {
				img.removeAttribute('data-mce-selected');
			});

			if (controlElm) {
				showResizeRect(controlElm);
			} else {
				hideResizeRect();
			}
		}

		// Show/hide resize rect when image is selected
		editor.onNodeChange.add(updateResizeRect);

		// Fixes WebKit quirk where it returns IMG on getNode if caret is after last image in container
		dom.bind(editableDoc, 'selectionchange', updateResizeRect);

		// Remove the internal attribute when serializing the DOM
		editor.serializer.addAttributeFilter('data-mce-selected', function(nodes, name) {
			var i = nodes.length;

			while (i--) {
				nodes[i].attr(name, null);
			}
		});
	}

	function keepNoScriptContents() {
		if (getDocumentMode() < 9) {
			parser.addNodeFilter('noscript', function(nodes) {
				var i = nodes.length, node, textNode;

				while (i--) {
					node = nodes[i];
					textNode = node.firstChild;

					if (textNode) {
						node.attr('data-mce-innertext', textNode.value);
					}
				}
			});

			serializer.addNodeFilter('noscript', function(nodes) {
				var i = nodes.length, node, textNode, value;

				while (i--) {
					node = nodes[i];
					textNode = nodes[i].firstChild;

					if (textNode) {
						textNode.value = tinymce.html.Entities.decode(textNode.value);
					} else {
						// Old IE can't retain noscript value so an attribute is used to store it
						value = node.attributes.map['data-mce-innertext'];
						if (value) {
							node.attr('data-mce-innertext', null);
							textNode = new tinymce.html.Node('#text', 3);
							textNode.value = value;
							textNode.raw = true;
							node.append(textNode);
						}
					}
				}
			});
		}
	}

	// All browsers
	disableBackspaceIntoATable();
	removeBlockQuoteOnBackSpace();
	emptyEditorWhenDeleting();

	// WebKit
	if (tinymce.isWebKit) {
		keepInlineElementOnDeleteBackspace();
		cleanupStylesWhenDeleting();
		inputMethodFocus();
		selectControlElements();
		setDefaultBlockType();

		// iOS
		if (tinymce.isIDevice) {
			selectionChangeNodeChanged();
		} else {
			fakeImageResize();
			selectAll();
		}
	}

	// IE
	if (tinymce.isIE) {
		removeHrOnBackspace();
		ensureBodyHasRoleApplication();
		addNewLinesBeforeBrInPre();
		removePreSerializedStylesWhenSelectingControls();
		deleteControlItemOnBackSpace();
		renderEmptyBlocksFix();
		keepNoScriptContents();
	}

	// Gecko
	if (tinymce.isGecko) {
		removeHrOnBackspace();
		focusBody();
		removeStylesWhenDeletingAccrossBlockElements();
		setGeckoEditingOptions();
		addBrAfterLastLinks();
		removeGhostSelection();
	}

	// Opera
	if (tinymce.isOpera) {
		fakeImageResize();
	}
};
(function(tinymce) {
	var namedEntities, baseEntities, reverseEntities,
		attrsCharsRegExp = /[&<>\"\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
		textCharsRegExp = /[<>&\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
		rawCharsRegExp = /[<>&\"\']/g,
		entityRegExp = /&(#x|#)?([\w]+);/g,
		asciiMap = {
				128 : "\u20AC", 130 : "\u201A", 131 : "\u0192", 132 : "\u201E", 133 : "\u2026", 134 : "\u2020",
				135 : "\u2021", 136 : "\u02C6", 137 : "\u2030", 138 : "\u0160", 139 : "\u2039", 140 : "\u0152",
				142 : "\u017D", 145 : "\u2018", 146 : "\u2019", 147 : "\u201C", 148 : "\u201D", 149 : "\u2022",
				150 : "\u2013", 151 : "\u2014", 152 : "\u02DC", 153 : "\u2122", 154 : "\u0161", 155 : "\u203A",
				156 : "\u0153", 158 : "\u017E", 159 : "\u0178"
		};

	// Raw entities
	baseEntities = {
		'\"' : '&quot;', // Needs to be escaped since the YUI compressor would otherwise break the code
		"'" : '&#39;',
		'<' : '&lt;',
		'>' : '&gt;',
		'&' : '&amp;'
	};

	// Reverse lookup table for raw entities
	reverseEntities = {
		'&lt;' : '<',
		'&gt;' : '>',
		'&amp;' : '&',
		'&quot;' : '"',
		'&apos;' : "'"
	};

	// Decodes text by using the browser
	function nativeDecode(text) {
		var elm;

		elm = document.createElement("div");
		elm.innerHTML = text;

		return elm.textContent || elm.innerText || text;
	};

	// Build a two way lookup table for the entities
	function buildEntitiesLookup(items, radix) {
		var i, chr, entity, lookup = {};

		if (items) {
			items = items.split(',');
			radix = radix || 10;

			// Build entities lookup table
			for (i = 0; i < items.length; i += 2) {
				chr = String.fromCharCode(parseInt(items[i], radix));

				// Only add non base entities
				if (!baseEntities[chr]) {
					entity = '&' + items[i + 1] + ';';
					lookup[chr] = entity;
					lookup[entity] = chr;
				}
			}

			return lookup;
		}
	};

	// Unpack entities lookup where the numbers are in radix 32 to reduce the size
	namedEntities = buildEntitiesLookup(
		'50,nbsp,51,iexcl,52,cent,53,pound,54,curren,55,yen,56,brvbar,57,sect,58,uml,59,copy,' +
		'5a,ordf,5b,laquo,5c,not,5d,shy,5e,reg,5f,macr,5g,deg,5h,plusmn,5i,sup2,5j,sup3,5k,acute,' +
		'5l,micro,5m,para,5n,middot,5o,cedil,5p,sup1,5q,ordm,5r,raquo,5s,frac14,5t,frac12,5u,frac34,' +
		'5v,iquest,60,Agrave,61,Aacute,62,Acirc,63,Atilde,64,Auml,65,Aring,66,AElig,67,Ccedil,' +
		'68,Egrave,69,Eacute,6a,Ecirc,6b,Euml,6c,Igrave,6d,Iacute,6e,Icirc,6f,Iuml,6g,ETH,6h,Ntilde,' +
		'6i,Ograve,6j,Oacute,6k,Ocirc,6l,Otilde,6m,Ouml,6n,times,6o,Oslash,6p,Ugrave,6q,Uacute,' +
		'6r,Ucirc,6s,Uuml,6t,Yacute,6u,THORN,6v,szlig,70,agrave,71,aacute,72,acirc,73,atilde,74,auml,' +
		'75,aring,76,aelig,77,ccedil,78,egrave,79,eacute,7a,ecirc,7b,euml,7c,igrave,7d,iacute,7e,icirc,' +
		'7f,iuml,7g,eth,7h,ntilde,7i,ograve,7j,oacute,7k,ocirc,7l,otilde,7m,ouml,7n,divide,7o,oslash,' +
		'7p,ugrave,7q,uacute,7r,ucirc,7s,uuml,7t,yacute,7u,thorn,7v,yuml,ci,fnof,sh,Alpha,si,Beta,' +
		'sj,Gamma,sk,Delta,sl,Epsilon,sm,Zeta,sn,Eta,so,Theta,sp,Iota,sq,Kappa,sr,Lambda,ss,Mu,' +
		'st,Nu,su,Xi,sv,Omicron,t0,Pi,t1,Rho,t3,Sigma,t4,Tau,t5,Upsilon,t6,Phi,t7,Chi,t8,Psi,' +
		't9,Omega,th,alpha,ti,beta,tj,gamma,tk,delta,tl,epsilon,tm,zeta,tn,eta,to,theta,tp,iota,' +
		'tq,kappa,tr,lambda,ts,mu,tt,nu,tu,xi,tv,omicron,u0,pi,u1,rho,u2,sigmaf,u3,sigma,u4,tau,' +
		'u5,upsilon,u6,phi,u7,chi,u8,psi,u9,omega,uh,thetasym,ui,upsih,um,piv,812,bull,816,hellip,' +
		'81i,prime,81j,Prime,81u,oline,824,frasl,88o,weierp,88h,image,88s,real,892,trade,89l,alefsym,' +
		'8cg,larr,8ch,uarr,8ci,rarr,8cj,darr,8ck,harr,8dl,crarr,8eg,lArr,8eh,uArr,8ei,rArr,8ej,dArr,' +
		'8ek,hArr,8g0,forall,8g2,part,8g3,exist,8g5,empty,8g7,nabla,8g8,isin,8g9,notin,8gb,ni,8gf,prod,' +
		'8gh,sum,8gi,minus,8gn,lowast,8gq,radic,8gt,prop,8gu,infin,8h0,ang,8h7,and,8h8,or,8h9,cap,8ha,cup,' +
		'8hb,int,8hk,there4,8hs,sim,8i5,cong,8i8,asymp,8j0,ne,8j1,equiv,8j4,le,8j5,ge,8k2,sub,8k3,sup,8k4,' +
		'nsub,8k6,sube,8k7,supe,8kl,oplus,8kn,otimes,8l5,perp,8m5,sdot,8o8,lceil,8o9,rceil,8oa,lfloor,8ob,' +
		'rfloor,8p9,lang,8pa,rang,9ea,loz,9j0,spades,9j3,clubs,9j5,hearts,9j6,diams,ai,OElig,aj,oelig,b0,' +
		'Scaron,b1,scaron,bo,Yuml,m6,circ,ms,tilde,802,ensp,803,emsp,809,thinsp,80c,zwnj,80d,zwj,80e,lrm,' +
		'80f,rlm,80j,ndash,80k,mdash,80o,lsquo,80p,rsquo,80q,sbquo,80s,ldquo,80t,rdquo,80u,bdquo,810,dagger,' +
		'811,Dagger,81g,permil,81p,lsaquo,81q,rsaquo,85c,euro', 32);

	tinymce.html = tinymce.html || {};

	tinymce.html.Entities = {
		encodeRaw : function(text, attr) {
			return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function(chr) {
				return baseEntities[chr] || chr;
			});
		},

		encodeAllRaw : function(text) {
			return ('' + text).replace(rawCharsRegExp, function(chr) {
				return baseEntities[chr] || chr;
			});
		},

		encodeNumeric : function(text, attr) {
			return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function(chr) {
				// Multi byte sequence convert it to a single entity
				if (chr.length > 1)
					return '&#' + (((chr.charCodeAt(0) - 0xD800) * 0x400) + (chr.charCodeAt(1) - 0xDC00) + 0x10000) + ';';

				return baseEntities[chr] || '&#' + chr.charCodeAt(0) + ';';
			});
		},

		encodeNamed : function(text, attr, entities) {
			entities = entities || namedEntities;

			return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function(chr) {
				return baseEntities[chr] || entities[chr] || chr;
			});
		},

		getEncodeFunc : function(name, entities) {
			var Entities = tinymce.html.Entities;

			entities = buildEntitiesLookup(entities) || namedEntities;

			function encodeNamedAndNumeric(text, attr) {
				return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function(chr) {
					return baseEntities[chr] || entities[chr] || '&#' + chr.charCodeAt(0) + ';' || chr;
				});
			};

			function encodeCustomNamed(text, attr) {
				return Entities.encodeNamed(text, attr, entities);
			};

			// Replace + with , to be compatible with previous TinyMCE versions
			name = tinymce.makeMap(name.replace(/\+/g, ','));

			// Named and numeric encoder
			if (name.named && name.numeric)
				return encodeNamedAndNumeric;

			// Named encoder
			if (name.named) {
				// Custom names
				if (entities)
					return encodeCustomNamed;

				return Entities.encodeNamed;
			}

			// Numeric
			if (name.numeric)
				return Entities.encodeNumeric;

			// Raw encoder
			return Entities.encodeRaw;
		},

		decode : function(text) {
			return text.replace(entityRegExp, function(all, numeric, value) {
				if (numeric) {
					value = parseInt(value, numeric.length === 2 ? 16 : 10);

					// Support upper UTF
					if (value > 0xFFFF) {
						value -= 0x10000;

						return String.fromCharCode(0xD800 + (value >> 10), 0xDC00 + (value & 0x3FF));
					} else
						return asciiMap[value] || String.fromCharCode(value);
				}

				return reverseEntities[all] || namedEntities[all] || nativeDecode(all);
			});
		}
	};
})(tinymce);

tinymce.html.Styles = function(settings, schema) {
	var rgbRegExp = /rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)/gi,
		urlOrStrRegExp = /(?:url(?:(?:\(\s*\"([^\"]+)\"\s*\))|(?:\(\s*\'([^\']+)\'\s*\))|(?:\(\s*([^)\s]+)\s*\))))|(?:\'([^\']+)\')|(?:\"([^\"]+)\")/gi,
		styleRegExp = /\s*([^:]+):\s*([^;]+);?/g,
		trimRightRegExp = /\s+$/,
		urlColorRegExp = /rgb/,
		undef, i, encodingLookup = {}, encodingItems;

	settings = settings || {};

	encodingItems = '\\" \\\' \\; \\: ; : \uFEFF'.split(' ');
	for (i = 0; i < encodingItems.length; i++) {
		encodingLookup[encodingItems[i]] = '\uFEFF' + i;
		encodingLookup['\uFEFF' + i] = encodingItems[i];
	}

	function toHex(match, r, g, b) {
		function hex(val) {
			val = parseInt(val).toString(16);

			return val.length > 1 ? val : '0' + val; // 0 -> 00
		};

		return '#' + hex(r) + hex(g) + hex(b);
	};

	return {
		toHex : function(color) {
			return color.replace(rgbRegExp, toHex);
		},

		parse : function(css) {
			var styles = {}, matches, name, value, isEncoded, urlConverter = settings.url_converter, urlConverterScope = settings.url_converter_scope || this;

			function compress(prefix, suffix) {
				var top, right, bottom, left;

				// Get values and check it it needs compressing
				top = styles[prefix + '-top' + suffix];
				if (!top)
					return;

				right = styles[prefix + '-right' + suffix];
				if (top != right)
					return;

				bottom = styles[prefix + '-bottom' + suffix];
				if (right != bottom)
					return;

				left = styles[prefix + '-left' + suffix];
				if (bottom != left)
					return;

				// Compress
				styles[prefix + suffix] = left;
				delete styles[prefix + '-top' + suffix];
				delete styles[prefix + '-right' + suffix];
				delete styles[prefix + '-bottom' + suffix];
				delete styles[prefix + '-left' + suffix];
			};

			function canCompress(key) {
				var value = styles[key], i;

				if (!value || value.indexOf(' ') < 0)
					return;

				value = value.split(' ');
				i = value.length;
				while (i--) {
					if (value[i] !== value[0])
						return false;
				}

				styles[key] = value[0];

				return true;
			};

			function compress2(target, a, b, c) {
				if (!canCompress(a))
					return;

				if (!canCompress(b))
					return;

				if (!canCompress(c))
					return;

				// Compress
				styles[target] = styles[a] + ' ' + styles[b] + ' ' + styles[c];
				delete styles[a];
				delete styles[b];
				delete styles[c];
			};

			// Encodes the specified string by replacing all \" \' ; : with _<num>
			function encode(str) {
				isEncoded = true;

				return encodingLookup[str];
			};

			// Decodes the specified string by replacing all _<num> with it's original value \" \' etc
			// It will also decode the \" \' if keep_slashes is set to fale or omitted
			function decode(str, keep_slashes) {
				if (isEncoded) {
					str = str.replace(/\uFEFF[0-9]/g, function(str) {
						return encodingLookup[str];
					});
				}

				if (!keep_slashes)
					str = str.replace(/\\([\'\";:])/g, "$1");

				return str;
			};

			function processUrl(match, url, url2, url3, str, str2) {
				str = str || str2;

				if (str) {
					str = decode(str);

					// Force strings into single quote format
					return "'" + str.replace(/\'/g, "\\'") + "'";
				}

				url = decode(url || url2 || url3);

				// Convert the URL to relative/absolute depending on config
				if (urlConverter)
					url = urlConverter.call(urlConverterScope, url, 'style');

				// Output new URL format
				return "url('" + url.replace(/\'/g, "\\'") + "')";
			};

			if (css) {
				// Encode \" \' % and ; and : inside strings so they don't interfere with the style parsing
				css = css.replace(/\\[\"\';:\uFEFF]/g, encode).replace(/\"[^\"]+\"|\'[^\']+\'/g, function(str) {
					return str.replace(/[;:]/g, encode);
				});

				// Parse styles
				while (matches = styleRegExp.exec(css)) {
					name = matches[1].replace(trimRightRegExp, '').toLowerCase();
					value = matches[2].replace(trimRightRegExp, '');

					if (name && value.length > 0) {
						// Opera will produce 700 instead of bold in their style values
						if (name === 'font-weight' && value === '700')
							value = 'bold';
						else if (name === 'color' || name === 'background-color') // Lowercase colors like RED
							value = value.toLowerCase();		

						// Convert RGB colors to HEX
						value = value.replace(rgbRegExp, toHex);

						// Convert URLs and force them into url('value') format
						value = value.replace(urlOrStrRegExp, processUrl);
						styles[name] = isEncoded ? decode(value, true) : value;
					}

					styleRegExp.lastIndex = matches.index + matches[0].length;
				}

				// Compress the styles to reduce it's size for example IE will expand styles
				compress("border", "");
				compress("border", "-width");
				compress("border", "-color");
				compress("border", "-style");
				compress("padding", "");
				compress("margin", "");
				compress2('border', 'border-width', 'border-style', 'border-color');

				// Remove pointless border, IE produces these
				if (styles.border === 'medium none')
					delete styles.border;
			}

			return styles;
		},

		serialize : function(styles, element_name) {
			var css = '', name, value;

			function serializeStyles(name) {
				var styleList, i, l, value;

				styleList = schema.styles[name];
				if (styleList) {
					for (i = 0, l = styleList.length; i < l; i++) {
						name = styleList[i];
						value = styles[name];

						if (value !== undef && value.length > 0)
							css += (css.length > 0 ? ' ' : '') + name + ': ' + value + ';';
					}
				}
			};

			// Serialize styles according to schema
			if (element_name && schema && schema.styles) {
				// Serialize global styles and element specific styles
				serializeStyles('*');
				serializeStyles(element_name);
			} else {
				// Output the styles in the order they are inside the object
				for (name in styles) {
					value = styles[name];

					if (value !== undef && value.length > 0)
						css += (css.length > 0 ? ' ' : '') + name + ': ' + value + ';';
				}
			}

			return css;
		}
	};
};

(function(tinymce) {
	var mapCache = {}, makeMap = tinymce.makeMap, each = tinymce.each;

	function split(str, delim) {
		return str.split(delim || ',');
	};

	function unpack(lookup, data) {
		var key, elements = {};

		function replace(value) {
			return value.replace(/[A-Z]+/g, function(key) {
				return replace(lookup[key]);
			});
		};

		// Unpack lookup
		for (key in lookup) {
			if (lookup.hasOwnProperty(key))
				lookup[key] = replace(lookup[key]);
		}

		// Unpack and parse data into object map
		replace(data).replace(/#/g, '#text').replace(/(\w+)\[([^\]]+)\]\[([^\]]*)\]/g, function(str, name, attributes, children) {
			attributes = split(attributes, '|');

			elements[name] = {
				attributes : makeMap(attributes),
				attributesOrder : attributes,
				children : makeMap(children, '|', {'#comment' : {}})
			}
		});

		return elements;
	};

	function getHTML5() {
		var html5 = mapCache.html5;

		if (!html5) {
			html5 = mapCache.html5 = unpack({
					A : 'id|accesskey|class|dir|draggable|item|hidden|itemprop|role|spellcheck|style|subject|title|onclick|ondblclick|onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|onkeydown|onkeyup',
					B : '#|a|abbr|area|audio|b|bdo|br|button|canvas|cite|code|command|datalist|del|dfn|em|embed|i|iframe|img|input|ins|kbd|keygen|label|link|map|mark|meta|' +
						'meter|noscript|object|output|progress|q|ruby|samp|script|select|small|span|strong|sub|sup|svg|textarea|time|var|video|wbr',
					C : '#|a|abbr|area|address|article|aside|audio|b|bdo|blockquote|br|button|canvas|cite|code|command|datalist|del|details|dfn|dialog|div|dl|em|embed|fieldset|' +
						'figure|footer|form|h1|h2|h3|h4|h5|h6|header|hgroup|hr|i|iframe|img|input|ins|kbd|keygen|label|link|map|mark|menu|meta|meter|nav|noscript|ol|object|output|' +
						'p|pre|progress|q|ruby|samp|script|section|select|small|span|strong|style|sub|sup|svg|table|textarea|time|ul|var|video'
				}, 'html[A|manifest][body|head]' +
					'head[A][base|command|link|meta|noscript|script|style|title]' +
					'title[A][#]' +
					'base[A|href|target][]' +
					'link[A|href|rel|media|type|sizes][]' +
					'meta[A|http-equiv|name|content|charset][]' +
					'style[A|type|media|scoped][#]' +
					'script[A|charset|type|src|defer|async][#]' +
					'noscript[A][C]' +
					'body[A][C]' +
					'section[A][C]' +
					'nav[A][C]' +
					'article[A][C]' +
					'aside[A][C]' +
					'h1[A][B]' +
					'h2[A][B]' +
					'h3[A][B]' +
					'h4[A][B]' +
					'h5[A][B]' +
					'h6[A][B]' +
					'hgroup[A][h1|h2|h3|h4|h5|h6]' +
					'header[A][C]' +
					'footer[A][C]' +
					'address[A][C]' +
					'p[A][B]' +
					'br[A][]' +
					'pre[A][B]' +
					'dialog[A][dd|dt]' +
					'blockquote[A|cite][C]' +
					'ol[A|start|reversed][li]' +
					'ul[A][li]' +
					'li[A|value][C]' +
					'dl[A][dd|dt]' +
					'dt[A][B]' +
					'dd[A][C]' +
					'a[A|href|target|ping|rel|media|type][B]' +
					'em[A][B]' +
					'strong[A][B]' +
					'small[A][B]' +
					'cite[A][B]' +
					'q[A|cite][B]' +
					'dfn[A][B]' +
					'abbr[A][B]' +
					'code[A][B]' +
					'var[A][B]' +
					'samp[A][B]' +
					'kbd[A][B]' +
					'sub[A][B]' +
					'sup[A][B]' +
					'i[A][B]' +
					'b[A][B]' +
					'mark[A][B]' +
					'progress[A|value|max][B]' +
					'meter[A|value|min|max|low|high|optimum][B]' +
					'time[A|datetime][B]' +
					'ruby[A][B|rt|rp]' +
					'rt[A][B]' +
					'rp[A][B]' +
					'bdo[A][B]' +
					'span[A][B]' +
					'ins[A|cite|datetime][B]' +
					'del[A|cite|datetime][B]' +
					'figure[A][C|legend|figcaption]' +
					'figcaption[A][C]' +
					'img[A|alt|src|height|width|usemap|ismap][]' +
					'iframe[A|name|src|height|width|sandbox|seamless][]' +
					'embed[A|src|height|width|type][]' +
					'object[A|data|type|height|width|usemap|name|form|classid][param]' +
					'param[A|name|value][]' +
					'details[A|open][C|legend]' +
					'command[A|type|label|icon|disabled|checked|radiogroup][]' +
					'menu[A|type|label][C|li]' +
					'legend[A][C|B]' +
					'div[A][C]' +
					'source[A|src|type|media][]' +
					'audio[A|src|autobuffer|autoplay|loop|controls][source]' +
					'video[A|src|autobuffer|autoplay|loop|controls|width|height|poster][source]' +
					'hr[A][]' +
					'form[A|accept-charset|action|autocomplete|enctype|method|name|novalidate|target][C]' +
					'fieldset[A|disabled|form|name][C|legend]' +
					'label[A|form|for][B]' +
					'input[A|type|accept|alt|autocomplete|autofocus|checked|disabled|form|formaction|formenctype|formmethod|formnovalidate|formtarget|height|list|max|maxlength|min|' +
						'multiple|pattern|placeholder|readonly|required|size|src|step|width|files|value|name][]' +
					'button[A|autofocus|disabled|form|formaction|formenctype|formmethod|formnovalidate|formtarget|name|value|type][B]' +
					'select[A|autofocus|disabled|form|multiple|name|size][option|optgroup]' +
					'datalist[A][B|option]' +
					'optgroup[A|disabled|label][option]' +
					'option[A|disabled|selected|label|value][]' +
					'textarea[A|autofocus|disabled|form|maxlength|name|placeholder|readonly|required|rows|cols|wrap][]' +
					'keygen[A|autofocus|challenge|disabled|form|keytype|name][]' +
					'output[A|for|form|name][B]' +
					'canvas[A|width|height][]' +
					'map[A|name][B|C]' +
					'area[A|shape|coords|href|alt|target|media|rel|ping|type][]' +
					'mathml[A][]' +
					'svg[A][]' +
					'table[A|border][caption|colgroup|thead|tfoot|tbody|tr]' +
					'caption[A][C]' +
					'colgroup[A|span][col]' +
					'col[A|span][]' +
					'thead[A][tr]' +
					'tfoot[A][tr]' +
					'tbody[A][tr]' +
					'tr[A][th|td]' +
					'th[A|headers|rowspan|colspan|scope][B]' +
					'td[A|headers|rowspan|colspan][C]' +
					'wbr[A][]'
			);
		}

		return html5;
	};

	function getHTML4() {
		var html4 = mapCache.html4;

		if (!html4) {
			// This is the XHTML 1.0 transitional elements with it's attributes and children packed to reduce it's size
			html4 = mapCache.html4 = unpack({
				Z : 'H|K|N|O|P',
				Y : 'X|form|R|Q',
				ZG : 'E|span|width|align|char|charoff|valign',
				X : 'p|T|div|U|W|isindex|fieldset|table',
				ZF : 'E|align|char|charoff|valign',
				W : 'pre|hr|blockquote|address|center|noframes',
				ZE : 'abbr|axis|headers|scope|rowspan|colspan|align|char|charoff|valign|nowrap|bgcolor|width|height',
				ZD : '[E][S]',
				U : 'ul|ol|dl|menu|dir',
				ZC : 'p|Y|div|U|W|table|br|span|bdo|object|applet|img|map|K|N|Q',
				T : 'h1|h2|h3|h4|h5|h6',
				ZB : 'X|S|Q',
				S : 'R|P',
				ZA : 'a|G|J|M|O|P',
				R : 'a|H|K|N|O',
				Q : 'noscript|P',
				P : 'ins|del|script',
				O : 'input|select|textarea|label|button',
				N : 'M|L',
				M : 'em|strong|dfn|code|q|samp|kbd|var|cite|abbr|acronym',
				L : 'sub|sup',
				K : 'J|I',
				J : 'tt|i|b|u|s|strike',
				I : 'big|small|font|basefont',
				H : 'G|F',
				G : 'br|span|bdo',
				F : 'object|applet|img|map|iframe',
				E : 'A|B|C',
				D : 'accesskey|tabindex|onfocus|onblur',
				C : 'onclick|ondblclick|onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|onkeydown|onkeyup',
				B : 'lang|xml:lang|dir',
				A : 'id|class|style|title'
			}, 'script[id|charset|type|language|src|defer|xml:space][]' + 
				'style[B|id|type|media|title|xml:space][]' + 
				'object[E|declare|classid|codebase|data|type|codetype|archive|standby|width|height|usemap|name|tabindex|align|border|hspace|vspace][#|param|Y]' + 
				'param[id|name|value|valuetype|type][]' + 
				'p[E|align][#|S]' + 
				'a[E|D|charset|type|name|href|hreflang|rel|rev|shape|coords|target][#|Z]' + 
				'br[A|clear][]' + 
				'span[E][#|S]' + 
				'bdo[A|C|B][#|S]' + 
				'applet[A|codebase|archive|code|object|alt|name|width|height|align|hspace|vspace][#|param|Y]' + 
				'h1[E|align][#|S]' + 
				'img[E|src|alt|name|longdesc|width|height|usemap|ismap|align|border|hspace|vspace][]' + 
				'map[B|C|A|name][X|form|Q|area]' + 
				'h2[E|align][#|S]' + 
				'iframe[A|longdesc|name|src|frameborder|marginwidth|marginheight|scrolling|align|width|height][#|Y]' + 
				'h3[E|align][#|S]' + 
				'tt[E][#|S]' + 
				'i[E][#|S]' + 
				'b[E][#|S]' + 
				'u[E][#|S]' + 
				's[E][#|S]' + 
				'strike[E][#|S]' + 
				'big[E][#|S]' + 
				'small[E][#|S]' + 
				'font[A|B|size|color|face][#|S]' + 
				'basefont[id|size|color|face][]' + 
				'em[E][#|S]' + 
				'strong[E][#|S]' + 
				'dfn[E][#|S]' + 
				'code[E][#|S]' + 
				'q[E|cite][#|S]' + 
				'samp[E][#|S]' + 
				'kbd[E][#|S]' + 
				'var[E][#|S]' + 
				'cite[E][#|S]' + 
				'abbr[E][#|S]' + 
				'acronym[E][#|S]' + 
				'sub[E][#|S]' + 
				'sup[E][#|S]' + 
				'input[E|D|type|name|value|checked|disabled|readonly|size|maxlength|src|alt|usemap|onselect|onchange|accept|align][]' + 
				'select[E|name|size|multiple|disabled|tabindex|onfocus|onblur|onchange][optgroup|option]' + 
				'optgroup[E|disabled|label][option]' + 
				'option[E|selected|disabled|label|value][]' + 
				'textarea[E|D|name|rows|cols|disabled|readonly|onselect|onchange][]' + 
				'label[E|for|accesskey|onfocus|onblur][#|S]' + 
				'button[E|D|name|value|type|disabled][#|p|T|div|U|W|table|G|object|applet|img|map|K|N|Q]' + 
				'h4[E|align][#|S]' + 
				'ins[E|cite|datetime][#|Y]' + 
				'h5[E|align][#|S]' + 
				'del[E|cite|datetime][#|Y]' + 
				'h6[E|align][#|S]' + 
				'div[E|align][#|Y]' + 
				'ul[E|type|compact][li]' + 
				'li[E|type|value][#|Y]' + 
				'ol[E|type|compact|start][li]' + 
				'dl[E|compact][dt|dd]' + 
				'dt[E][#|S]' + 
				'dd[E][#|Y]' + 
				'menu[E|compact][li]' + 
				'dir[E|compact][li]' + 
				'pre[E|width|xml:space][#|ZA]' + 
				'hr[E|align|noshade|size|width][]' + 
				'blockquote[E|cite][#|Y]' + 
				'address[E][#|S|p]' + 
				'center[E][#|Y]' + 
				'noframes[E][#|Y]' + 
				'isindex[A|B|prompt][]' + 
				'fieldset[E][#|legend|Y]' + 
				'legend[E|accesskey|align][#|S]' + 
				'table[E|summary|width|border|frame|rules|cellspacing|cellpadding|align|bgcolor][caption|col|colgroup|thead|tfoot|tbody|tr]' + 
				'caption[E|align][#|S]' + 
				'col[ZG][]' + 
				'colgroup[ZG][col]' + 
				'thead[ZF][tr]' + 
				'tr[ZF|bgcolor][th|td]' + 
				'th[E|ZE][#|Y]' + 
				'form[E|action|method|name|enctype|onsubmit|onreset|accept|accept-charset|target][#|X|R|Q]' + 
				'noscript[E][#|Y]' + 
				'td[E|ZE][#|Y]' + 
				'tfoot[ZF][tr]' + 
				'tbody[ZF][tr]' + 
				'area[E|D|shape|coords|href|nohref|alt|target][]' + 
				'base[id|href|target][]' + 
				'body[E|onload|onunload|background|bgcolor|text|link|vlink|alink][#|Y]'
			);
		}

		return html4;
	};

	tinymce.html.Schema = function(settings) {
		var self = this, elements = {}, children = {}, patternElements = [], validStyles, schemaItems;
		var whiteSpaceElementsMap, selfClosingElementsMap, shortEndedElementsMap, boolAttrMap, blockElementsMap, nonEmptyElementsMap, customElementsMap = {};

		// Creates an lookup table map object for the specified option or the default value
		function createLookupTable(option, default_value, extend) {
			var value = settings[option];

			if (!value) {
				// Get cached default map or make it if needed
				value = mapCache[option];

				if (!value) {
					value = makeMap(default_value, ' ', makeMap(default_value.toUpperCase(), ' '));
					value = tinymce.extend(value, extend);

					mapCache[option] = value;
				}
			} else {
				// Create custom map
				value = makeMap(value, ',', makeMap(value.toUpperCase(), ' '));
			}

			return value;
		};

		settings = settings || {};
		schemaItems = settings.schema == "html5" ? getHTML5() : getHTML4();

		// Allow all elements and attributes if verify_html is set to false
		if (settings.verify_html === false)
			settings.valid_elements = '*[*]';

		// Build styles list
		if (settings.valid_styles) {
			validStyles = {};

			// Convert styles into a rule list
			each(settings.valid_styles, function(value, key) {
				validStyles[key] = tinymce.explode(value);
			});
		}

		// Setup map objects
		whiteSpaceElementsMap = createLookupTable('whitespace_elements', 'pre script noscript style textarea');
		selfClosingElementsMap = createLookupTable('self_closing_elements', 'colgroup dd dt li option p td tfoot th thead tr');
		shortEndedElementsMap = createLookupTable('short_ended_elements', 'area base basefont br col frame hr img input isindex link meta param embed source wbr');
		boolAttrMap = createLookupTable('boolean_attributes', 'checked compact declare defer disabled ismap multiple nohref noresize noshade nowrap readonly selected autoplay loop controls');
		nonEmptyElementsMap = createLookupTable('non_empty_elements', 'td th iframe video audio object', shortEndedElementsMap);
		textBlockElementsMap = createLookupTable('text_block_elements', 'h1 h2 h3 h4 h5 h6 p div address pre form ' + 
						'blockquote center dir fieldset header footer article section hgroup aside nav figure');
		blockElementsMap = createLookupTable('block_elements', 'hr table tbody thead tfoot ' + 
						'th tr td li ol ul caption dl dt dd noscript menu isindex samp option datalist select optgroup', textBlockElementsMap);

		// Converts a wildcard expression string to a regexp for example *a will become /.*a/.
		function patternToRegExp(str) {
			return new RegExp('^' + str.replace(/([?+*])/g, '.$1') + '$');
		};

		// Parses the specified valid_elements string and adds to the current rules
		// This function is a bit hard to read since it's heavily optimized for speed
		function addValidElements(valid_elements) {
			var ei, el, ai, al, yl, matches, element, attr, attrData, elementName, attrName, attrType, attributes, attributesOrder,
				prefix, outputName, globalAttributes, globalAttributesOrder, transElement, key, childKey, value,
				elementRuleRegExp = /^([#+\-])?([^\[\/]+)(?:\/([^\[]+))?(?:\[([^\]]+)\])?$/,
				attrRuleRegExp = /^([!\-])?(\w+::\w+|[^=:<]+)?(?:([=:<])(.*))?$/,
				hasPatternsRegExp = /[*?+]/;

			if (valid_elements) {
				// Split valid elements into an array with rules
				valid_elements = split(valid_elements);

				if (elements['@']) {
					globalAttributes = elements['@'].attributes;
					globalAttributesOrder = elements['@'].attributesOrder;
				}

				// Loop all rules
				for (ei = 0, el = valid_elements.length; ei < el; ei++) {
					// Parse element rule
					matches = elementRuleRegExp.exec(valid_elements[ei]);
					if (matches) {
						// Setup local names for matches
						prefix = matches[1];
						elementName = matches[2];
						outputName = matches[3];
						attrData = matches[4];

						// Create new attributes and attributesOrder
						attributes = {};
						attributesOrder = [];

						// Create the new element
						element = {
							attributes : attributes,
							attributesOrder : attributesOrder
						};

						// Padd empty elements prefix
						if (prefix === '#')
							element.paddEmpty = true;

						// Remove empty elements prefix
						if (prefix === '-')
							element.removeEmpty = true;

						// Copy attributes from global rule into current rule
						if (globalAttributes) {
							for (key in globalAttributes)
								attributes[key] = globalAttributes[key];

							attributesOrder.push.apply(attributesOrder, globalAttributesOrder);
						}

						// Attributes defined
						if (attrData) {
							attrData = split(attrData, '|');
							for (ai = 0, al = attrData.length; ai < al; ai++) {
								matches = attrRuleRegExp.exec(attrData[ai]);
								if (matches) {
									attr = {};
									attrType = matches[1];
									attrName = matches[2].replace(/::/g, ':');
									prefix = matches[3];
									value = matches[4];

									// Required
									if (attrType === '!') {
										element.attributesRequired = element.attributesRequired || [];
										element.attributesRequired.push(attrName);
										attr.required = true;
									}

									// Denied from global
									if (attrType === '-') {
										delete attributes[attrName];
										attributesOrder.splice(tinymce.inArray(attributesOrder, attrName), 1);
										continue;
									}

									// Default value
									if (prefix) {
										// Default value
										if (prefix === '=') {
											element.attributesDefault = element.attributesDefault || [];
											element.attributesDefault.push({name: attrName, value: value});
											attr.defaultValue = value;
										}

										// Forced value
										if (prefix === ':') {
											element.attributesForced = element.attributesForced || [];
											element.attributesForced.push({name: attrName, value: value});
											attr.forcedValue = value;
										}

										// Required values
										if (prefix === '<')
											attr.validValues = makeMap(value, '?');
									}

									// Check for attribute patterns
									if (hasPatternsRegExp.test(attrName)) {
										element.attributePatterns = element.attributePatterns || [];
										attr.pattern = patternToRegExp(attrName);
										element.attributePatterns.push(attr);
									} else {
										// Add attribute to order list if it doesn't already exist
										if (!attributes[attrName])
											attributesOrder.push(attrName);

										attributes[attrName] = attr;
									}
								}
							}
						}

						// Global rule, store away these for later usage
						if (!globalAttributes && elementName == '@') {
							globalAttributes = attributes;
							globalAttributesOrder = attributesOrder;
						}

						// Handle substitute elements such as b/strong
						if (outputName) {
							element.outputName = elementName;
							elements[outputName] = element;
						}

						// Add pattern or exact element
						if (hasPatternsRegExp.test(elementName)) {
							element.pattern = patternToRegExp(elementName);
							patternElements.push(element);
						} else
							elements[elementName] = element;
					}
				}
			}
		};

		function setValidElements(valid_elements) {
			elements = {};
			patternElements = [];

			addValidElements(valid_elements);

			each(schemaItems, function(element, name) {
				children[name] = element.children;
			});
		};

		// Adds custom non HTML elements to the schema
		function addCustomElements(custom_elements) {
			var customElementRegExp = /^(~)?(.+)$/;

			if (custom_elements) {
				each(split(custom_elements), function(rule) {
					var matches = customElementRegExp.exec(rule),
						inline = matches[1] === '~',
						cloneName = inline ? 'span' : 'div',
						name = matches[2];

					children[name] = children[cloneName];
					customElementsMap[name] = cloneName;

					// If it's not marked as inline then add it to valid block elements
					if (!inline) {
						blockElementsMap[name.toUpperCase()] = {};
						blockElementsMap[name] = {};
					}

					// Add elements clone if needed
					if (!elements[name]) {
						elements[name] = elements[cloneName];
					}

					// Add custom elements at span/div positions
					each(children, function(element, child) {
						if (element[cloneName])
							element[name] = element[cloneName];
					});
				});
			}
		};

		// Adds valid children to the schema object
		function addValidChildren(valid_children) {
			var childRuleRegExp = /^([+\-]?)(\w+)\[([^\]]+)\]$/;

			if (valid_children) {
				each(split(valid_children), function(rule) {
					var matches = childRuleRegExp.exec(rule), parent, prefix;

					if (matches) {
						prefix = matches[1];

						// Add/remove items from default
						if (prefix)
							parent = children[matches[2]];
						else
							parent = children[matches[2]] = {'#comment' : {}};

						parent = children[matches[2]];

						each(split(matches[3], '|'), function(child) {
							if (prefix === '-')
								delete parent[child];
							else
								parent[child] = {};
						});
					}
				});
			}
		};

		function getElementRule(name) {
			var element = elements[name], i;

			// Exact match found
			if (element)
				return element;

			// No exact match then try the patterns
			i = patternElements.length;
			while (i--) {
				element = patternElements[i];

				if (element.pattern.test(name))
					return element;
			}
		};

		if (!settings.valid_elements) {
			// No valid elements defined then clone the elements from the schema spec
			each(schemaItems, function(element, name) {
				elements[name] = {
					attributes : element.attributes,
					attributesOrder : element.attributesOrder
				};

				children[name] = element.children;
			});

			// Switch these on HTML4
			if (settings.schema != "html5") {
				each(split('strong/b,em/i'), function(item) {
					item = split(item, '/');
					elements[item[1]].outputName = item[0];
				});
			}

			// Add default alt attribute for images
			elements.img.attributesDefault = [{name: 'alt', value: ''}];

			// Remove these if they are empty by default
			each(split('ol,ul,sub,sup,blockquote,span,font,a,table,tbody,tr,strong,em,b,i'), function(name) {
				if (elements[name]) {
					elements[name].removeEmpty = true;
				}
			});

			// Padd these by default
			each(split('p,h1,h2,h3,h4,h5,h6,th,td,pre,div,address,caption'), function(name) {
				elements[name].paddEmpty = true;
			});
		} else
			setValidElements(settings.valid_elements);

		addCustomElements(settings.custom_elements);
		addValidChildren(settings.valid_children);
		addValidElements(settings.extended_valid_elements);

		// Todo: Remove this when we fix list handling to be valid
		addValidChildren('+ol[ul|ol],+ul[ul|ol]');

		// Delete invalid elements
		if (settings.invalid_elements) {
			tinymce.each(tinymce.explode(settings.invalid_elements), function(item) {
				if (elements[item])
					delete elements[item];
			});
		}

		// If the user didn't allow span only allow internal spans
		if (!getElementRule('span'))
			addValidElements('span[!data-mce-type|*]');

		self.children = children;

		self.styles = validStyles;

		self.getBoolAttrs = function() {
			return boolAttrMap;
		};

		self.getBlockElements = function() {
			return blockElementsMap;
		};

		self.getTextBlockElements = function() {
			return textBlockElementsMap;
		};

		self.getShortEndedElements = function() {
			return shortEndedElementsMap;
		};

		self.getSelfClosingElements = function() {
			return selfClosingElementsMap;
		};

		self.getNonEmptyElements = function() {
			return nonEmptyElementsMap;
		};

		self.getWhiteSpaceElements = function() {
			return whiteSpaceElementsMap;
		};

		self.isValidChild = function(name, child) {
			var parent = children[name];

			return !!(parent && parent[child]);
		};

		self.isValid = function(name, attr) {
			var attrPatterns, i, rule = getElementRule(name);

			// Check if it's a valid element
			if (rule) {
				if (attr) {
					// Check if attribute name exists
					if (rule.attributes[attr]) {
						return true;
					}

					// Check if attribute matches a regexp pattern
					attrPatterns = rule.attributePatterns;
					if (attrPatterns) {
						i = attrPatterns.length;
						while (i--) {
							if (attrPatterns[i].pattern.test(name)) {
								return true;
							}
						}
					}
				} else {
					return true;
				}
			}

			// No match
			return false;
		};
		
		self.getElementRule = getElementRule;

		self.getCustomElements = function() {
			return customElementsMap;
		};

		self.addValidElements = addValidElements;

		self.setValidElements = setValidElements;

		self.addCustomElements = addCustomElements;

		self.addValidChildren = addValidChildren;

		self.elements = elements;
	};
})(tinymce);

(function(tinymce) {
	tinymce.html.SaxParser = function(settings, schema) {
		var self = this, noop = function() {};

		settings = settings || {};
		self.schema = schema = schema || new tinymce.html.Schema();

		if (settings.fix_self_closing !== false)
			settings.fix_self_closing = true;

		// Add handler functions from settings and setup default handlers
		tinymce.each('comment cdata text start end pi doctype'.split(' '), function(name) {
			if (name)
				self[name] = settings[name] || noop;
		});

		self.parse = function(html) {
			var self = this, matches, index = 0, value, endRegExp, stack = [], attrList, i, text, name, isInternalElement, removeInternalElements,
				shortEndedElements, fillAttrsMap, isShortEnded, validate, elementRule, isValidElement, attr, attribsValue, invalidPrefixRegExp,
				validAttributesMap, validAttributePatterns, attributesRequired, attributesDefault, attributesForced, selfClosing,
				tokenRegExp, attrRegExp, specialElements, attrValue, idCount = 0, decode = tinymce.html.Entities.decode, fixSelfClosing, isIE;

			function processEndTag(name) {
				var pos, i;

				// Find position of parent of the same type
				pos = stack.length;
				while (pos--) {
					if (stack[pos].name === name)
						break;						
				}

				// Found parent
				if (pos >= 0) {
					// Close all the open elements
					for (i = stack.length - 1; i >= pos; i--) {
						name = stack[i];

						if (name.valid)
							self.end(name.name);
					}

					// Remove the open elements from the stack
					stack.length = pos;
				}
			};

			function parseAttribute(match, name, value, val2, val3) {
				var attrRule, i;

				name = name.toLowerCase();
				value = name in fillAttrsMap ? name : decode(value || val2 || val3 || ''); // Handle boolean attribute than value attribute

				// Validate name and value
				if (validate && !isInternalElement && name.indexOf('data-') !== 0) {
					attrRule = validAttributesMap[name];

					// Find rule by pattern matching
					if (!attrRule && validAttributePatterns) {
						i = validAttributePatterns.length;
						while (i--) {
							attrRule = validAttributePatterns[i];
							if (attrRule.pattern.test(name))
								break;
						}

						// No rule matched
						if (i === -1)
							attrRule = null;
					}

					// No attribute rule found
					if (!attrRule)
						return;

					// Validate value
					if (attrRule.validValues && !(value in attrRule.validValues))
						return;
				}

				// Add attribute to list and map
				attrList.map[name] = value;
				attrList.push({
					name: name,
					value: value
				});
			};

			// Precompile RegExps and map objects
			tokenRegExp = new RegExp('<(?:' +
				'(?:!--([\\w\\W]*?)-->)|' + // Comment
				'(?:!\\[CDATA\\[([\\w\\W]*?)\\]\\]>)|' + // CDATA
				'(?:!DOCTYPE([\\w\\W]*?)>)|' + // DOCTYPE
				'(?:\\?([^\\s\\/<>]+) ?([\\w\\W]*?)[?/]>)|' + // PI
				'(?:\\/([^>]+)>)|' + // End element
				'(?:([A-Za-z0-9\\-\\:\\.]+)((?:\\s+[^"\'>]+(?:(?:"[^"]*")|(?:\'[^\']*\')|[^>]*))*|\\/|\\s+)>)' + // Start element
			')', 'g');

			attrRegExp = /([\w:\-]+)(?:\s*=\s*(?:(?:\"((?:[^\"])*)\")|(?:\'((?:[^\'])*)\')|([^>\s]+)))?/g;
			specialElements = {
				'script' : /<\/script[^>]*>/gi,
				'style' : /<\/style[^>]*>/gi,
				'noscript' : /<\/noscript[^>]*>/gi
			};

			// Setup lookup tables for empty elements and boolean attributes
			shortEndedElements = schema.getShortEndedElements();
			selfClosing = settings.self_closing_elements || schema.getSelfClosingElements();
			fillAttrsMap = schema.getBoolAttrs();
			validate = settings.validate;
			removeInternalElements = settings.remove_internals;
			fixSelfClosing = settings.fix_self_closing;
			isIE = tinymce.isIE;
			invalidPrefixRegExp = /^:/;

			while (matches = tokenRegExp.exec(html)) {
				// Text
				if (index < matches.index)
					self.text(decode(html.substr(index, matches.index - index)));

				if (value = matches[6]) { // End element
					value = value.toLowerCase();

					// IE will add a ":" in front of elements it doesn't understand like custom elements or HTML5 elements
					if (isIE && invalidPrefixRegExp.test(value))
						value = value.substr(1);

					processEndTag(value);
				} else if (value = matches[7]) { // Start element
					value = value.toLowerCase();

					// IE will add a ":" in front of elements it doesn't understand like custom elements or HTML5 elements
					if (isIE && invalidPrefixRegExp.test(value))
						value = value.substr(1);

					isShortEnded = value in shortEndedElements;

					// Is self closing tag for example an <li> after an open <li>
					if (fixSelfClosing && selfClosing[value] && stack.length > 0 && stack[stack.length - 1].name === value)
						processEndTag(value);

					// Validate element
					if (!validate || (elementRule = schema.getElementRule(value))) {
						isValidElement = true;

						// Grab attributes map and patters when validation is enabled
						if (validate) {
							validAttributesMap = elementRule.attributes;
							validAttributePatterns = elementRule.attributePatterns;
						}

						// Parse attributes
						if (attribsValue = matches[8]) {
							isInternalElement = attribsValue.indexOf('data-mce-type') !== -1; // Check if the element is an internal element

							// If the element has internal attributes then remove it if we are told to do so
							if (isInternalElement && removeInternalElements)
								isValidElement = false;

							attrList = [];
							attrList.map = {};

							attribsValue.replace(attrRegExp, parseAttribute);
						} else {
							attrList = [];
							attrList.map = {};
						}

						// Process attributes if validation is enabled
						if (validate && !isInternalElement) {
							attributesRequired = elementRule.attributesRequired;
							attributesDefault = elementRule.attributesDefault;
							attributesForced = elementRule.attributesForced;

							// Handle forced attributes
							if (attributesForced) {
								i = attributesForced.length;
								while (i--) {
									attr = attributesForced[i];
									name = attr.name;
									attrValue = attr.value;

									if (attrValue === '{$uid}')
										attrValue = 'mce_' + idCount++;

									attrList.map[name] = attrValue;
									attrList.push({name: name, value: attrValue});
								}
							}

							// Handle default attributes
							if (attributesDefault) {
								i = attributesDefault.length;
								while (i--) {
									attr = attributesDefault[i];
									name = attr.name;

									if (!(name in attrList.map)) {
										attrValue = attr.value;

										if (attrValue === '{$uid}')
											attrValue = 'mce_' + idCount++;

										attrList.map[name] = attrValue;
										attrList.push({name: name, value: attrValue});
									}
								}
							}

							// Handle required attributes
							if (attributesRequired) {
								i = attributesRequired.length;
								while (i--) {
									if (attributesRequired[i] in attrList.map)
										break;
								}

								// None of the required attributes where found
								if (i === -1)
									isValidElement = false;
							}

							// Invalidate element if it's marked as bogus
							if (attrList.map['data-mce-bogus'])
								isValidElement = false;
						}

						if (isValidElement)
							self.start(value, attrList, isShortEnded);
					} else
						isValidElement = false;

					// Treat script, noscript and style a bit different since they may include code that looks like elements
					if (endRegExp = specialElements[value]) {
						endRegExp.lastIndex = index = matches.index + matches[0].length;

						if (matches = endRegExp.exec(html)) {
							if (isValidElement)
								text = html.substr(index, matches.index - index);

							index = matches.index + matches[0].length;
						} else {
							text = html.substr(index);
							index = html.length;
						}

						if (isValidElement && text.length > 0)
							self.text(text, true);

						if (isValidElement)
							self.end(value);

						tokenRegExp.lastIndex = index;
						continue;
					}

					// Push value on to stack
					if (!isShortEnded) {
						if (!attribsValue || attribsValue.indexOf('/') != attribsValue.length - 1)
							stack.push({name: value, valid: isValidElement});
						else if (isValidElement)
							self.end(value);
					}
				} else if (value = matches[1]) { // Comment
					self.comment(value);
				} else if (value = matches[2]) { // CDATA
					self.cdata(value);
				} else if (value = matches[3]) { // DOCTYPE
					self.doctype(value);
				} else if (value = matches[4]) { // PI
					self.pi(value, matches[5]);
				}

				index = matches.index + matches[0].length;
			}

			// Text
			if (index < html.length)
				self.text(decode(html.substr(index)));

			// Close any open elements
			for (i = stack.length - 1; i >= 0; i--) {
				value = stack[i];

				if (value.valid)
					self.end(value.name);
			}
		};
	}
})(tinymce);

(function(tinymce) {
	var whiteSpaceRegExp = /^[ \t\r\n]*$/, typeLookup = {
		'#text' : 3,
		'#comment' : 8,
		'#cdata' : 4,
		'#pi' : 7,
		'#doctype' : 10,
		'#document-fragment' : 11
	};

	// Walks the tree left/right
	function walk(node, root_node, prev) {
		var sibling, parent, startName = prev ? 'lastChild' : 'firstChild', siblingName = prev ? 'prev' : 'next';

		// Walk into nodes if it has a start
		if (node[startName])
			return node[startName];

		// Return the sibling if it has one
		if (node !== root_node) {
			sibling = node[siblingName];

			if (sibling)
				return sibling;

			// Walk up the parents to look for siblings
			for (parent = node.parent; parent && parent !== root_node; parent = parent.parent) {
				sibling = parent[siblingName];

				if (sibling)
					return sibling;
			}
		}
	};

	function Node(name, type) {
		this.name = name;
		this.type = type;

		if (type === 1) {
			this.attributes = [];
			this.attributes.map = {};
		}
	}

	tinymce.extend(Node.prototype, {
		replace : function(node) {
			var self = this;

			if (node.parent)
				node.remove();

			self.insert(node, self);
			self.remove();

			return self;
		},

		attr : function(name, value) {
			var self = this, attrs, i, undef;

			if (typeof name !== "string") {
				for (i in name)
					self.attr(i, name[i]);

				return self;
			}

			if (attrs = self.attributes) {
				if (value !== undef) {
					// Remove attribute
					if (value === null) {
						if (name in attrs.map) {
							delete attrs.map[name];

							i = attrs.length;
							while (i--) {
								if (attrs[i].name === name) {
									attrs = attrs.splice(i, 1);
									return self;
								}
							}
						}

						return self;
					}

					// Set attribute
					if (name in attrs.map) {
						// Set attribute
						i = attrs.length;
						while (i--) {
							if (attrs[i].name === name) {
								attrs[i].value = value;
								break;
							}
						}
					} else
						attrs.push({name: name, value: value});

					attrs.map[name] = value;

					return self;
				} else {
					return attrs.map[name];
				}
			}
		},

		clone : function() {
			var self = this, clone = new Node(self.name, self.type), i, l, selfAttrs, selfAttr, cloneAttrs;

			// Clone element attributes
			if (selfAttrs = self.attributes) {
				cloneAttrs = [];
				cloneAttrs.map = {};

				for (i = 0, l = selfAttrs.length; i < l; i++) {
					selfAttr = selfAttrs[i];

					// Clone everything except id
					if (selfAttr.name !== 'id') {
						cloneAttrs[cloneAttrs.length] = {name: selfAttr.name, value: selfAttr.value};
						cloneAttrs.map[selfAttr.name] = selfAttr.value;
					}
				}

				clone.attributes = cloneAttrs;
			}

			clone.value = self.value;
			clone.shortEnded = self.shortEnded;

			return clone;
		},

		wrap : function(wrapper) {
			var self = this;

			self.parent.insert(wrapper, self);
			wrapper.append(self);

			return self;
		},

		unwrap : function() {
			var self = this, node, next;

			for (node = self.firstChild; node; ) {
				next = node.next;
				self.insert(node, self, true);
				node = next;
			}

			self.remove();
		},

		remove : function() {
			var self = this, parent = self.parent, next = self.next, prev = self.prev;

			if (parent) {
				if (parent.firstChild === self) {
					parent.firstChild = next;

					if (next)
						next.prev = null;
				} else {
					prev.next = next;
				}

				if (parent.lastChild === self) {
					parent.lastChild = prev;

					if (prev)
						prev.next = null;
				} else {
					next.prev = prev;
				}

				self.parent = self.next = self.prev = null;
			}

			return self;
		},

		append : function(node) {
			var self = this, last;

			if (node.parent)
				node.remove();

			last = self.lastChild;
			if (last) {
				last.next = node;
				node.prev = last;
				self.lastChild = node;
			} else
				self.lastChild = self.firstChild = node;

			node.parent = self;

			return node;
		},

		insert : function(node, ref_node, before) {
			var parent;

			if (node.parent)
				node.remove();

			parent = ref_node.parent || this;

			if (before) {
				if (ref_node === parent.firstChild)
					parent.firstChild = node;
				else
					ref_node.prev.next = node;

				node.prev = ref_node.prev;
				node.next = ref_node;
				ref_node.prev = node;
			} else {
				if (ref_node === parent.lastChild)
					parent.lastChild = node;
				else
					ref_node.next.prev = node;

				node.next = ref_node.next;
				node.prev = ref_node;
				ref_node.next = node;
			}

			node.parent = parent;

			return node;
		},

		getAll : function(name) {
			var self = this, node, collection = [];

			for (node = self.firstChild; node; node = walk(node, self)) {
				if (node.name === name)
					collection.push(node);
			}

			return collection;
		},

		empty : function() {
			var self = this, nodes, i, node;

			// Remove all children
			if (self.firstChild) {
				nodes = [];

				// Collect the children
				for (node = self.firstChild; node; node = walk(node, self))
					nodes.push(node);

				// Remove the children
				i = nodes.length;
				while (i--) {
					node = nodes[i];
					node.parent = node.firstChild = node.lastChild = node.next = node.prev = null;
				}
			}

			self.firstChild = self.lastChild = null;

			return self;
		},

		isEmpty : function(elements) {
			var self = this, node = self.firstChild, i, name;

			if (node) {
				do {
					if (node.type === 1) {
						// Ignore bogus elements
						if (node.attributes.map['data-mce-bogus'])
							continue;

						// Keep empty elements like <img />
						if (elements[node.name])
							return false;

						// Keep elements with data attributes or name attribute like <a name="1"></a>
						i = node.attributes.length;
						while (i--) {
							name = node.attributes[i].name;
							if (name === "name" || name.indexOf('data-mce-') === 0)
								return false;
						}
					}

					// Keep comments
					if (node.type === 8)
						return false;
					
					// Keep non whitespace text nodes
					if ((node.type === 3 && !whiteSpaceRegExp.test(node.value)))
						return false;
				} while (node = walk(node, self));
			}

			return true;
		},

		walk : function(prev) {
			return walk(this, null, prev);
		}
	});

	tinymce.extend(Node, {
		create : function(name, attrs) {
			var node, attrName;

			// Create node
			node = new Node(name, typeLookup[name] || 1);

			// Add attributes if needed
			if (attrs) {
				for (attrName in attrs)
					node.attr(attrName, attrs[attrName]);
			}

			return node;
		}
	});

	tinymce.html.Node = Node;
})(tinymce);

(function(tinymce) {
	var Node = tinymce.html.Node;

	tinymce.html.DomParser = function(settings, schema) {
		var self = this, nodeFilters = {}, attributeFilters = [], matchedNodes = {}, matchedAttributes = {};

		settings = settings || {};
		settings.validate = "validate" in settings ? settings.validate : true;
		settings.root_name = settings.root_name || 'body';
		self.schema = schema = schema || new tinymce.html.Schema();

		function fixInvalidChildren(nodes) {
			var ni, node, parent, parents, newParent, currentNode, tempNode, childNode, i,
				childClone, nonEmptyElements, nonSplitableElements, textBlockElements, sibling, nextNode;

			nonSplitableElements = tinymce.makeMap('tr,td,th,tbody,thead,tfoot,table');
			nonEmptyElements = schema.getNonEmptyElements();
			textBlockElements = schema.getTextBlockElements();

			for (ni = 0; ni < nodes.length; ni++) {
				node = nodes[ni];

				// Already removed or fixed
				if (!node.parent || node.fixed)
					continue;

				// If the invalid element is a text block and the text block is within a parent LI element
				// Then unwrap the first text block and convert other sibling text blocks to LI elements similar to Word/Open Office
				if (textBlockElements[node.name] && node.parent.name == 'li') {
					// Move sibling text blocks after LI element
					sibling = node.next;
					while (sibling) {
						if (textBlockElements[sibling.name]) {
							sibling.name = 'li';
							sibling.fixed = true;
							node.parent.insert(sibling, node.parent);
						} else {
							break;
						}

						sibling = sibling.next;
					}

					// Unwrap current text block
					node.unwrap(node);
					continue;
				}

				// Get list of all parent nodes until we find a valid parent to stick the child into
				parents = [node];
				for (parent = node.parent; parent && !schema.isValidChild(parent.name, node.name) && !nonSplitableElements[parent.name]; parent = parent.parent)
					parents.push(parent);

				// Found a suitable parent
				if (parent && parents.length > 1) {
					// Reverse the array since it makes looping easier
					parents.reverse();

					// Clone the related parent and insert that after the moved node
					newParent = currentNode = self.filterNode(parents[0].clone());

					// Start cloning and moving children on the left side of the target node
					for (i = 0; i < parents.length - 1; i++) {
						if (schema.isValidChild(currentNode.name, parents[i].name)) {
							tempNode = self.filterNode(parents[i].clone());
							currentNode.append(tempNode);
						} else
							tempNode = currentNode;

						for (childNode = parents[i].firstChild; childNode && childNode != parents[i + 1]; ) {
							nextNode = childNode.next;
							tempNode.append(childNode);
							childNode = nextNode;
						}

						currentNode = tempNode;
					}

					if (!newParent.isEmpty(nonEmptyElements)) {
						parent.insert(newParent, parents[0], true);
						parent.insert(node, newParent);
					} else {
						parent.insert(node, parents[0], true);
					}

					// Check if the element is empty by looking through it's contents and special treatment for <p><br /></p>
					parent = parents[0];
					if (parent.isEmpty(nonEmptyElements) || parent.firstChild === parent.lastChild && parent.firstChild.name === 'br') {
						parent.empty().remove();
					}
				} else if (node.parent) {
					// If it's an LI try to find a UL/OL for it or wrap it
					if (node.name === 'li') {
						sibling = node.prev;
						if (sibling && (sibling.name === 'ul' || sibling.name === 'ul')) {
							sibling.append(node);
							continue;
						}

						sibling = node.next;
						if (sibling && (sibling.name === 'ul' || sibling.name === 'ul')) {
							sibling.insert(node, sibling.firstChild, true);
							continue;
						}

						node.wrap(self.filterNode(new Node('ul', 1)));
						continue;
					}

					// Try wrapping the element in a DIV
					if (schema.isValidChild(node.parent.name, 'div') && schema.isValidChild('div', node.name)) {
						node.wrap(self.filterNode(new Node('div', 1)));
					} else {
						// We failed wrapping it, then remove or unwrap it
						if (node.name === 'style' || node.name === 'script')
							node.empty().remove();
						else
							node.unwrap();
					}
				}
			}
		};

		self.filterNode = function(node) {
			var i, name, list;

			// Run element filters
			if (name in nodeFilters) {
				list = matchedNodes[name];

				if (list)
					list.push(node);
				else
					matchedNodes[name] = [node];
			}

			// Run attribute filters
			i = attributeFilters.length;
			while (i--) {
				name = attributeFilters[i].name;

				if (name in node.attributes.map) {
					list = matchedAttributes[name];

					if (list)
						list.push(node);
					else
						matchedAttributes[name] = [node];
				}
			}

			return node;
		};

		self.addNodeFilter = function(name, callback) {
			tinymce.each(tinymce.explode(name), function(name) {
				var list = nodeFilters[name];

				if (!list)
					nodeFilters[name] = list = [];

				list.push(callback);
			});
		};

		self.addAttributeFilter = function(name, callback) {
			tinymce.each(tinymce.explode(name), function(name) {
				var i;

				for (i = 0; i < attributeFilters.length; i++) {
					if (attributeFilters[i].name === name) {
						attributeFilters[i].callbacks.push(callback);
						return;
					}
				}

				attributeFilters.push({name: name, callbacks: [callback]});
			});
		};

		self.parse = function(html, args) {
			var parser, rootNode, node, nodes, i, l, fi, fl, list, name, validate,
				blockElements, startWhiteSpaceRegExp, invalidChildren = [], isInWhiteSpacePreservedElement,
				endWhiteSpaceRegExp, allWhiteSpaceRegExp, isAllWhiteSpaceRegExp, whiteSpaceElements, children, nonEmptyElements, rootBlockName;

			args = args || {};
			matchedNodes = {};
			matchedAttributes = {};
			blockElements = tinymce.extend(tinymce.makeMap('script,style,head,html,body,title,meta,param'), schema.getBlockElements());
			nonEmptyElements = schema.getNonEmptyElements();
			children = schema.children;
			validate = settings.validate;
			rootBlockName = "forced_root_block" in args ? args.forced_root_block : settings.forced_root_block;

			whiteSpaceElements = schema.getWhiteSpaceElements();
			startWhiteSpaceRegExp = /^[ \t\r\n]+/;
			endWhiteSpaceRegExp = /[ \t\r\n]+$/;
			allWhiteSpaceRegExp = /[ \t\r\n]+/g;
			isAllWhiteSpaceRegExp = /^[ \t\r\n]+$/;

			function addRootBlocks() {
				var node = rootNode.firstChild, next, rootBlockNode;

				while (node) {
					next = node.next;

					if (node.type == 3 || (node.type == 1 && node.name !== 'p' && !blockElements[node.name] && !node.attr('data-mce-type'))) {
						if (!rootBlockNode) {
							// Create a new root block element
							rootBlockNode = createNode(rootBlockName, 1);
							rootNode.insert(rootBlockNode, node);
							rootBlockNode.append(node);
						} else
							rootBlockNode.append(node);
					} else {
						rootBlockNode = null;
					}

					node = next;
				};
			};

			function createNode(name, type) {
				var node = new Node(name, type), list;

				if (name in nodeFilters) {
					list = matchedNodes[name];

					if (list)
						list.push(node);
					else
						matchedNodes[name] = [node];
				}

				return node;
			};

			function removeWhitespaceBefore(node) {
				var textNode, textVal, sibling;

				for (textNode = node.prev; textNode && textNode.type === 3; ) {
					textVal = textNode.value.replace(endWhiteSpaceRegExp, '');

					if (textVal.length > 0) {
						textNode.value = textVal;
						textNode = textNode.prev;
					} else {
						sibling = textNode.prev;
						textNode.remove();
						textNode = sibling;
					}
				}
			};

			function cloneAndExcludeBlocks(input) {
				var name, output = {};

				for (name in input) {
					if (name !== 'li' && name != 'p') {
						output[name] = input[name];
					}
				}

				return output;
			};

			parser = new tinymce.html.SaxParser({
				validate : validate,

				// Exclude P and LI from DOM parsing since it's treated better by the DOM parser
				self_closing_elements: cloneAndExcludeBlocks(schema.getSelfClosingElements()),

				cdata: function(text) {
					node.append(createNode('#cdata', 4)).value = text;
				},

				text: function(text, raw) {
					var textNode;

					// Trim all redundant whitespace on non white space elements
					if (!isInWhiteSpacePreservedElement) {
						text = text.replace(allWhiteSpaceRegExp, ' ');

						if (node.lastChild && blockElements[node.lastChild.name])
							text = text.replace(startWhiteSpaceRegExp, '');
					}

					// Do we need to create the node
					if (text.length !== 0) {
						textNode = createNode('#text', 3);
						textNode.raw = !!raw;
						node.append(textNode).value = text;
					}
				},

				comment: function(text) {
					node.append(createNode('#comment', 8)).value = text;
				},

				pi: function(name, text) {
					node.append(createNode(name, 7)).value = text;
					removeWhitespaceBefore(node);
				},

				doctype: function(text) {
					var newNode;
		
					newNode = node.append(createNode('#doctype', 10));
					newNode.value = text;
					removeWhitespaceBefore(node);
				},

				start: function(name, attrs, empty) {
					var newNode, attrFiltersLen, elementRule, textNode, attrName, text, sibling, parent;

					elementRule = validate ? schema.getElementRule(name) : {};
					if (elementRule) {
						newNode = createNode(elementRule.outputName || name, 1);
						newNode.attributes = attrs;
						newNode.shortEnded = empty;

						node.append(newNode);

						// Check if node is valid child of the parent node is the child is
						// unknown we don't collect it since it's probably a custom element
						parent = children[node.name];
						if (parent && children[newNode.name] && !parent[newNode.name])
							invalidChildren.push(newNode);

						attrFiltersLen = attributeFilters.length;
						while (attrFiltersLen--) {
							attrName = attributeFilters[attrFiltersLen].name;

							if (attrName in attrs.map) {
								list = matchedAttributes[attrName];

								if (list)
									list.push(newNode);
								else
									matchedAttributes[attrName] = [newNode];
							}
						}

						// Trim whitespace before block
						if (blockElements[name])
							removeWhitespaceBefore(newNode);

						// Change current node if the element wasn't empty i.e not <br /> or <img />
						if (!empty)
							node = newNode;

						// Check if we are inside a whitespace preserved element
						if (!isInWhiteSpacePreservedElement && whiteSpaceElements[name]) {
							isInWhiteSpacePreservedElement = true;
						}
					}
				},

				end: function(name) {
					var textNode, elementRule, text, sibling, tempNode;

					elementRule = validate ? schema.getElementRule(name) : {};
					if (elementRule) {
						if (blockElements[name]) {
							if (!isInWhiteSpacePreservedElement) {
								// Trim whitespace of the first node in a block
								textNode = node.firstChild;
								if (textNode && textNode.type === 3) {
									text = textNode.value.replace(startWhiteSpaceRegExp, '');

									// Any characters left after trim or should we remove it
									if (text.length > 0) {
										textNode.value = text;
										textNode = textNode.next;
									} else {
										sibling = textNode.next;
										textNode.remove();
										textNode = sibling;
									}

									// Remove any pure whitespace siblings
									while (textNode && textNode.type === 3) {
										text = textNode.value;
										sibling = textNode.next;

										if (text.length === 0 || isAllWhiteSpaceRegExp.test(text)) {
											textNode.remove();
											textNode = sibling;
										}

										textNode = sibling;
									}
								}

								// Trim whitespace of the last node in a block
								textNode = node.lastChild;
								if (textNode && textNode.type === 3) {
									text = textNode.value.replace(endWhiteSpaceRegExp, '');

									// Any characters left after trim or should we remove it
									if (text.length > 0) {
										textNode.value = text;
										textNode = textNode.prev;
									} else {
										sibling = textNode.prev;
										textNode.remove();
										textNode = sibling;
									}

									// Remove any pure whitespace siblings
									while (textNode && textNode.type === 3) {
										text = textNode.value;
										sibling = textNode.prev;

										if (text.length === 0 || isAllWhiteSpaceRegExp.test(text)) {
											textNode.remove();
											textNode = sibling;
										}

										textNode = sibling;
									}
								}
							}

							// Trim start white space
							// Removed due to: #5424
							/*textNode = node.prev;
							if (textNode && textNode.type === 3) {
								text = textNode.value.replace(startWhiteSpaceRegExp, '');

								if (text.length > 0)
									textNode.value = text;
								else
									textNode.remove();
							}*/
						}

						// Check if we exited a whitespace preserved element
						if (isInWhiteSpacePreservedElement && whiteSpaceElements[name]) {
							isInWhiteSpacePreservedElement = false;
						}

						// Handle empty nodes
						if (elementRule.removeEmpty || elementRule.paddEmpty) {
							if (node.isEmpty(nonEmptyElements)) {
								if (elementRule.paddEmpty)
									node.empty().append(new Node('#text', '3')).value = '\u00a0';
								else {
									// Leave nodes that have a name like <a name="name">
									if (!node.attributes.map.name && !node.attributes.map.id) {
										tempNode = node.parent;
										node.empty().remove();
										node = tempNode;
										return;
									}
								}
							}
						}

						node = node.parent;
					}
				}
			}, schema);

			rootNode = node = new Node(args.context || settings.root_name, 11);

			parser.parse(html);

			// Fix invalid children or report invalid children in a contextual parsing
			if (validate && invalidChildren.length) {
				if (!args.context)
					fixInvalidChildren(invalidChildren);
				else
					args.invalid = true;
			}

			// Wrap nodes in the root into block elements if the root is body
			if (rootBlockName && rootNode.name == 'body')
				addRootBlocks();

			// Run filters only when the contents is valid
			if (!args.invalid) {
				// Run node filters
				for (name in matchedNodes) {
					list = nodeFilters[name];
					nodes = matchedNodes[name];

					// Remove already removed children
					fi = nodes.length;
					while (fi--) {
						if (!nodes[fi].parent)
							nodes.splice(fi, 1);
					}

					for (i = 0, l = list.length; i < l; i++)
						list[i](nodes, name, args);
				}

				// Run attribute filters
				for (i = 0, l = attributeFilters.length; i < l; i++) {
					list = attributeFilters[i];

					if (list.name in matchedAttributes) {
						nodes = matchedAttributes[list.name];

						// Remove already removed children
						fi = nodes.length;
						while (fi--) {
							if (!nodes[fi].parent)
								nodes.splice(fi, 1);
						}

						for (fi = 0, fl = list.callbacks.length; fi < fl; fi++)
							list.callbacks[fi](nodes, list.name, args);
					}
				}
			}

			return rootNode;
		};

		// Remove <br> at end of block elements Gecko and WebKit injects BR elements to
		// make it possible to place the caret inside empty blocks. This logic tries to remove
		// these elements and keep br elements that where intended to be there intact
		if (settings.remove_trailing_brs) {
			self.addNodeFilter('br', function(nodes, name) {
				var i, l = nodes.length, node, blockElements = tinymce.extend({}, schema.getBlockElements()),
					nonEmptyElements = schema.getNonEmptyElements(), parent, lastParent, prev, prevName;

				// Remove brs from body element as well
				blockElements.body = 1;

				// Must loop forwards since it will otherwise remove all brs in <p>a<br><br><br></p>
				for (i = 0; i < l; i++) {
					node = nodes[i];
					parent = node.parent;

					if (blockElements[node.parent.name] && node === parent.lastChild) {
						// Loop all nodes to the left of the current node and check for other BR elements
						// excluding bookmarks since they are invisible
						prev = node.prev;
						while (prev) {
							prevName = prev.name;

							// Ignore bookmarks
							if (prevName !== "span" || prev.attr('data-mce-type') !== 'bookmark') {
								// Found a non BR element
								if (prevName !== "br")
									break;
	
								// Found another br it's a <br><br> structure then don't remove anything
								if (prevName === 'br') {
									node = null;
									break;
								}
							}

							prev = prev.prev;
						}

						if (node) {
							node.remove();

							// Is the parent to be considered empty after we removed the BR
							if (parent.isEmpty(nonEmptyElements)) {
								elementRule = schema.getElementRule(parent.name);

								// Remove or padd the element depending on schema rule
								if (elementRule) {
									if (elementRule.removeEmpty)
										parent.remove();
									else if (elementRule.paddEmpty)
										parent.empty().append(new tinymce.html.Node('#text', 3)).value = '\u00a0';
								}
							}
						}
					} else {
						// Replaces BR elements inside inline elements like <p><b><i><br></i></b></p> so they become <p><b><i>&nbsp;</i></b></p> 
						lastParent = node;
						while (parent.firstChild === lastParent && parent.lastChild === lastParent) {
							lastParent = parent;

							if (blockElements[parent.name]) {
								break;
							}

							parent = parent.parent;
						}

						if (lastParent === parent) {
							textNode = new tinymce.html.Node('#text', 3);
							textNode.value = '\u00a0';
							node.replace(textNode);
						}
					}
				}
			});
		}

		// Force anchor names closed, unless the setting "allow_html_in_named_anchor" is explicitly included.
		if (!settings.allow_html_in_named_anchor) {
			self.addAttributeFilter('id,name', function(nodes, name) {
				var i = nodes.length, sibling, prevSibling, parent, node;

				while (i--) {
					node = nodes[i];
					if (node.name === 'a' && node.firstChild && !node.attr('href')) {
						parent = node.parent;

						// Move children after current node
						sibling = node.lastChild;
						do {
							prevSibling = sibling.prev;
							parent.insert(sibling, node);
							sibling = prevSibling;
						} while (sibling);
					}
				}
			});
		}
	}
})(tinymce);

tinymce.html.Writer = function(settings) {
	var html = [], indent, indentBefore, indentAfter, encode, htmlOutput;

	settings = settings || {};
	indent = settings.indent;
	indentBefore = tinymce.makeMap(settings.indent_before || '');
	indentAfter = tinymce.makeMap(settings.indent_after || '');
	encode = tinymce.html.Entities.getEncodeFunc(settings.entity_encoding || 'raw', settings.entities);
	htmlOutput = settings.element_format == "html";

	return {
		start: function(name, attrs, empty) {
			var i, l, attr, value;

			if (indent && indentBefore[name] && html.length > 0) {
				value = html[html.length - 1];

				if (value.length > 0 && value !== '\n')
					html.push('\n');
			}

			html.push('<', name);

			if (attrs) {
				for (i = 0, l = attrs.length; i < l; i++) {
					attr = attrs[i];
					html.push(' ', attr.name, '="', encode(attr.value, true), '"');
				}
			}

			if (!empty || htmlOutput)
				html[html.length] = '>';
			else
				html[html.length] = ' />';

			if (empty && indent && indentAfter[name] && html.length > 0) {
				value = html[html.length - 1];

				if (value.length > 0 && value !== '\n')
					html.push('\n');
			}
		},

		end: function(name) {
			var value;

			/*if (indent && indentBefore[name] && html.length > 0) {
				value = html[html.length - 1];

				if (value.length > 0 && value !== '\n')
					html.push('\n');
			}*/

			html.push('</', name, '>');

			if (indent && indentAfter[name] && html.length > 0) {
				value = html[html.length - 1];

				if (value.length > 0 && value !== '\n')
					html.push('\n');
			}
		},

		text: function(text, raw) {
			if (text.length > 0)
				html[html.length] = raw ? text : encode(text);
		},

		cdata: function(text) {
			html.push('<![CDATA[', text, ']]>');
		},

		comment: function(text) {
			html.push('<!--', text, '-->');
		},

		pi: function(name, text) {
			if (text)
				html.push('<?', name, ' ', text, '?>');
			else
				html.push('<?', name, '?>');

			if (indent)
				html.push('\n');
		},

		doctype: function(text) {
			html.push('<!DOCTYPE', text, '>', indent ? '\n' : '');
		},

		reset: function() {
			html.length = 0;
		},

		getContent: function() {
			return html.join('').replace(/\n$/, '');
		}
	};
};

(function(tinymce) {
	tinymce.html.Serializer = function(settings, schema) {
		var self = this, writer = new tinymce.html.Writer(settings);

		settings = settings || {};
		settings.validate = "validate" in settings ? settings.validate : true;

		self.schema = schema = schema || new tinymce.html.Schema();
		self.writer = writer;

		self.serialize = function(node) {
			var handlers, validate;

			validate = settings.validate;

			handlers = {
				// #text
				3: function(node, raw) {
					writer.text(node.value, node.raw);
				},

				// #comment
				8: function(node) {
					writer.comment(node.value);
				},

				// Processing instruction
				7: function(node) {
					writer.pi(node.name, node.value);
				},

				// Doctype
				10: function(node) {
					writer.doctype(node.value);
				},

				// CDATA
				4: function(node) {
					writer.cdata(node.value);
				},

				// Document fragment
				11: function(node) {
					if ((node = node.firstChild)) {
						do {
							walk(node);
						} while (node = node.next);
					}
				}
			};

			writer.reset();

			function walk(node) {
				var handler = handlers[node.type], name, isEmpty, attrs, attrName, attrValue, sortedAttrs, i, l, elementRule;

				if (!handler) {
					name = node.name;
					isEmpty = node.shortEnded;
					attrs = node.attributes;

					// Sort attributes
					if (validate && attrs && attrs.length > 1) {
						sortedAttrs = [];
						sortedAttrs.map = {};

						elementRule = schema.getElementRule(node.name);
						for (i = 0, l = elementRule.attributesOrder.length; i < l; i++) {
							attrName = elementRule.attributesOrder[i];

							if (attrName in attrs.map) {
								attrValue = attrs.map[attrName];
								sortedAttrs.map[attrName] = attrValue;
								sortedAttrs.push({name: attrName, value: attrValue});
							}
						}

						for (i = 0, l = attrs.length; i < l; i++) {
							attrName = attrs[i].name;

							if (!(attrName in sortedAttrs.map)) {
								attrValue = attrs.map[attrName];
								sortedAttrs.map[attrName] = attrValue;
								sortedAttrs.push({name: attrName, value: attrValue});
							}
						}

						attrs = sortedAttrs;
					}

					writer.start(node.name, attrs, isEmpty);

					if (!isEmpty) {
						if ((node = node.firstChild)) {
							do {
								walk(node);
							} while (node = node.next);
						}

						writer.end(name);
					}
				} else
					handler(node);
			}

			// Serialize element and treat all non elements as fragments
			if (node.type == 1 && !settings.inner)
				walk(node);
			else
				handlers[11](node);

			return writer.getContent();
		};
	}
})(tinymce);

// JSLint defined globals
/*global tinymce:false, window:false */

tinymce.dom = {};

(function(namespace, expando) {
	var w3cEventModel = !!document.addEventListener;

	function addEvent(target, name, callback, capture) {
		if (target.addEventListener) {
			target.addEventListener(name, callback, capture || false);
		} else if (target.attachEvent) {
			target.attachEvent('on' + name, callback);
		}
	}

	function removeEvent(target, name, callback, capture) {
		if (target.removeEventListener) {
			target.removeEventListener(name, callback, capture || false);
		} else if (target.detachEvent) {
			target.detachEvent('on' + name, callback);
		}
	}

	function fix(original_event, data) {
		var name, event = data || {};

		// Dummy function that gets replaced on the delegation state functions
		function returnFalse() {
			return false;
		}

		// Dummy function that gets replaced on the delegation state functions
		function returnTrue() {
			return true;
		}

		// Copy all properties from the original event
		for (name in original_event) {
			// layerX/layerY is deprecated in Chrome and produces a warning
			if (name !== "layerX" && name !== "layerY") {
				event[name] = original_event[name];
			}
		}

		// Normalize target IE uses srcElement
		if (!event.target) {
			event.target = event.srcElement || document;
		}

		// Add preventDefault method
		event.preventDefault = function() {
			event.isDefaultPrevented = returnTrue;

			// Execute preventDefault on the original event object
			if (original_event) {
				if (original_event.preventDefault) {
					original_event.preventDefault();
				} else {
					original_event.returnValue = false; // IE
				}
			}
		};

		// Add stopPropagation
		event.stopPropagation = function() {
			event.isPropagationStopped = returnTrue;

			// Execute stopPropagation on the original event object
			if (original_event) {
				if (original_event.stopPropagation) {
					original_event.stopPropagation();
				} else {
					original_event.cancelBubble = true; // IE
				}
			 }
		};

		// Add stopImmediatePropagation
		event.stopImmediatePropagation = function() {
			event.isImmediatePropagationStopped = returnTrue;
			event.stopPropagation();
		};

		// Add event delegation states
		if (!event.isDefaultPrevented) {
			event.isDefaultPrevented = returnFalse;
			event.isPropagationStopped = returnFalse;
			event.isImmediatePropagationStopped = returnFalse;
		}

		return event;
	}

	function bindOnReady(win, callback, event_utils) {
		var doc = win.document, event = {type: 'ready'};

		// Gets called when the DOM is ready
		function readyHandler() {
			if (!event_utils.domLoaded) {
				event_utils.domLoaded = true;
				callback(event);
			}
		}

		// Page already loaded then fire it directly
		if (doc.readyState == "complete") {
			readyHandler();
			return;
		}

		// Use W3C method
		if (w3cEventModel) {
			addEvent(win, 'DOMContentLoaded', readyHandler);
		} else {
			// Use IE method
			addEvent(doc, "readystatechange", function() {
				if (doc.readyState === "complete") {
					removeEvent(doc, "readystatechange", arguments.callee);
					readyHandler();
				}
			});

			// Wait until we can scroll, when we can the DOM is initialized
			if (doc.documentElement.doScroll && win === win.top) {
				(function() {
					try {
						// If IE is used, use the trick by Diego Perini licensed under MIT by request to the author.
						// http://javascript.nwbox.com/IEContentLoaded/
						doc.documentElement.doScroll("left");
					} catch (ex) {
						setTimeout(arguments.callee, 0);
						return;
					}

					readyHandler();
				})();
			}
		}

		// Fallback if any of the above methods should fail for some odd reason
		addEvent(win, 'load', readyHandler);
	}

	function EventUtils(proxy) {
		var self = this, events = {}, count, isFocusBlurBound, hasFocusIn, hasMouseEnterLeave, mouseEnterLeave;

		hasMouseEnterLeave = "onmouseenter" in document.documentElement;
		hasFocusIn = "onfocusin" in document.documentElement;
		mouseEnterLeave = {mouseenter: 'mouseover', mouseleave: 'mouseout'};
		count = 1;

		// State if the DOMContentLoaded was executed or not
		self.domLoaded = false;
		self.events = events;

		function executeHandlers(evt, id) {
			var callbackList, i, l, callback;

			callbackList = events[id][evt.type];
			if (callbackList) {
				for (i = 0, l = callbackList.length; i < l; i++) {
					callback = callbackList[i];
					
					// Check if callback exists might be removed if a unbind is called inside the callback
					if (callback && callback.func.call(callback.scope, evt) === false) {
						evt.preventDefault();
					}

					// Should we stop propagation to immediate listeners
					if (evt.isImmediatePropagationStopped()) {
						return;
					}
				}
			}
		}

		self.bind = function(target, names, callback, scope) {
			var id, callbackList, i, name, fakeName, nativeHandler, capture, win = window;

			// Native event handler function patches the event and executes the callbacks for the expando
			function defaultNativeHandler(evt) {
				executeHandlers(fix(evt || win.event), id);
			}

			// Don't bind to text nodes or comments
			if (!target || target.nodeType === 3 || target.nodeType === 8) {
				return;
			}

			// Create or get events id for the target
			if (!target[expando]) {
				id = count++;
				target[expando] = id;
				events[id] = {};
			} else {
				id = target[expando];

				if (!events[id]) {
					events[id] = {};
				}
			}

			// Setup the specified scope or use the target as a default
			scope = scope || target;

			// Split names and bind each event, enables you to bind multiple events with one call
			names = names.split(' ');
			i = names.length;
			while (i--) {
				name = names[i];
				nativeHandler = defaultNativeHandler;
				fakeName = capture = false;

				// Use ready instead of DOMContentLoaded
				if (name === "DOMContentLoaded") {
					name = "ready";
				}

				// DOM is already ready
				if ((self.domLoaded || target.readyState == 'complete') && name === "ready") {
					self.domLoaded = true;
					callback.call(scope, fix({type: name}));
					continue;
				}

				// Handle mouseenter/mouseleaver
				if (!hasMouseEnterLeave) {
					fakeName = mouseEnterLeave[name];

					if (fakeName) {
						nativeHandler = function(evt) {
							var current, related;

							current = evt.currentTarget;
							related = evt.relatedTarget;

							// Check if related is inside the current target if it's not then the event should be ignored since it's a mouseover/mouseout inside the element
							if (related && current.contains) {
								// Use contains for performance
								related = current.contains(related);
							} else {
								while (related && related !== current) {
									related = related.parentNode;
								}
							}

							// Fire fake event
							if (!related) {
								evt = fix(evt || win.event);
								evt.type = evt.type === 'mouseout' ? 'mouseleave' : 'mouseenter';
								evt.target = current;
								executeHandlers(evt, id);
							}
						};
					}
				}

				// Fake bubbeling of focusin/focusout
				if (!hasFocusIn && (name === "focusin" || name === "focusout")) {
					capture = true;
					fakeName = name === "focusin" ? "focus" : "blur";
					nativeHandler = function(evt) {
						evt = fix(evt || win.event);
						evt.type = evt.type === 'focus' ? 'focusin' : 'focusout';
						executeHandlers(evt, id);
					};
				}

				// Setup callback list and bind native event
				callbackList = events[id][name];
				if (!callbackList) {
					events[id][name] = callbackList = [{func: callback, scope: scope}];
					callbackList.fakeName = fakeName;
					callbackList.capture = capture;

					// Add the nativeHandler to the callback list so that we can later unbind it
					callbackList.nativeHandler = nativeHandler;
					if (!w3cEventModel) {
						callbackList.proxyHandler = proxy(id);
					}

					// Check if the target has native events support
					if (name === "ready") {
						bindOnReady(target, nativeHandler, self);
					} else {
						addEvent(target, fakeName || name, w3cEventModel ? nativeHandler : callbackList.proxyHandler, capture);
					}
				} else {
					// If it already has an native handler then just push the callback
					callbackList.push({func: callback, scope: scope});
				}
			}

			target = callbackList = 0; // Clean memory for IE

			return callback;
		};

		self.unbind = function(target, names, callback) {
			var id, callbackList, i, ci, name, eventMap;

			// Don't bind to text nodes or comments
			if (!target || target.nodeType === 3 || target.nodeType === 8) {
				return self;
			}

			// Unbind event or events if the target has the expando
			id = target[expando];
			if (id) {
				eventMap = events[id];

				// Specific callback
				if (names) {
					names = names.split(' ');
					i = names.length;
					while (i--) {
						name = names[i];
						callbackList = eventMap[name];

						// Unbind the event if it exists in the map
						if (callbackList) {
							// Remove specified callback
							if (callback) {
								ci = callbackList.length;
								while (ci--) {
									if (callbackList[ci].func === callback) {
										callbackList.splice(ci, 1);
									}
								}
							}

							// Remove all callbacks if there isn't a specified callback or there is no callbacks left
							if (!callback || callbackList.length === 0) {
								delete eventMap[name];
								removeEvent(target, callbackList.fakeName || name, w3cEventModel ? callbackList.nativeHandler : callbackList.proxyHandler, callbackList.capture);
							}
						}
					}
				} else {
					// All events for a specific element
					for (name in eventMap) {
						callbackList = eventMap[name];
						removeEvent(target, callbackList.fakeName || name, w3cEventModel ? callbackList.nativeHandler : callbackList.proxyHandler, callbackList.capture);
					}

					eventMap = {};
				}

				// Check if object is empty, if it isn't then we won't remove the expando map
				for (name in eventMap) {
					return self;
				}

				// Delete event object
				delete events[id];

				// Remove expando from target
				try {
					// IE will fail here since it can't delete properties from window
					delete target[expando];
				} catch (ex) {
					// IE will set it to null
					target[expando] = null;
				}
			}

			return self;
		};

		self.fire = function(target, name, args) {
			var id, event;

			// Don't bind to text nodes or comments
			if (!target || target.nodeType === 3 || target.nodeType === 8) {
				return self;
			}

			// Build event object by patching the args
			event = fix(null, args);
			event.type = name;

			do {
				// Found an expando that means there is listeners to execute
				id = target[expando];
				if (id) {
					executeHandlers(event, id);
				}

				// Walk up the DOM
				target = target.parentNode || target.ownerDocument || target.defaultView || target.parentWindow;
			} while (target && !event.isPropagationStopped());

			return self;
		};

		self.clean = function(target) {
			var i, children, unbind = self.unbind;
	
			// Don't bind to text nodes or comments
			if (!target || target.nodeType === 3 || target.nodeType === 8) {
				return self;
			}

			// Unbind any element on the specificed target
			if (target[expando]) {
				unbind(target);
			}

			// Target doesn't have getElementsByTagName it's probably a window object then use it's document to find the children
			if (!target.getElementsByTagName) {
				target = target.document;
			}

			// Remove events from each child element
			if (target && target.getElementsByTagName) {
				unbind(target);

				children = target.getElementsByTagName('*');
				i = children.length;
				while (i--) {
					target = children[i];

					if (target[expando]) {
						unbind(target);
					}
				}
			}

			return self;
		};

		self.callNativeHandler = function(id, evt) {
			if (events) {
				events[id][evt.type].nativeHandler(evt);
			}
		};

		self.destory = function() {
			events = {};
		};

		// Legacy function calls

		self.add = function(target, events, func, scope) {
			// Old API supported direct ID assignment
			if (typeof(target) === "string") {
				target = document.getElementById(target);
			}

			// Old API supported multiple targets
			if (target && target instanceof Array) {
				var i = target.length;

				while (i--) {
					self.add(target[i], events, func, scope);
				}

				return;
			}

			// Old API called ready init
			if (events === "init") {
				events = "ready";
			}

			return self.bind(target, events instanceof Array ? events.join(' ') : events, func, scope);
		};

		self.remove = function(target, events, func, scope) {
			if (!target) {
				return self;
			}

			// Old API supported direct ID assignment
			if (typeof(target) === "string") {
				target = document.getElementById(target);
			}

			// Old API supported multiple targets
			if (target instanceof Array) {
				var i = target.length;

				while (i--) {
					self.remove(target[i], events, func, scope);
				}

				return self;
			}

			return self.unbind(target, events instanceof Array ? events.join(' ') : events, func);
		};

		self.clear = function(target) {
			// Old API supported direct ID assignment
			if (typeof(target) === "string") {
				target = document.getElementById(target);
			}

			return self.clean(target);
		};

		self.cancel = function(e) {
			if (e) {
				self.prevent(e);
				self.stop(e);
			}

			return false;
		};

		self.prevent = function(e) {
			if (!e.preventDefault) {
				e = fix(e);
			}

			e.preventDefault();

			return false;
		};

		self.stop = function(e) {
			if (!e.stopPropagation) {
				e = fix(e);
			}

			e.stopPropagation();

			return false;
		};
	}

	namespace.EventUtils = EventUtils;

	namespace.Event = new EventUtils(function(id) {
		return function(evt) {
			tinymce.dom.Event.callNativeHandler(id, evt);
		};
	});

	// Bind ready event when tinymce script is loaded
	namespace.Event.bind(window, 'ready', function() {});

	namespace = 0;
})(tinymce.dom, 'data-mce-expando'); // Namespace and expando

tinymce.dom.TreeWalker = function(start_node, root_node) {
	var node = start_node;

	function findSibling(node, start_name, sibling_name, shallow) {
		var sibling, parent;

		if (node) {
			// Walk into nodes if it has a start
			if (!shallow && node[start_name])
				return node[start_name];

			// Return the sibling if it has one
			if (node != root_node) {
				sibling = node[sibling_name];
				if (sibling)
					return sibling;

				// Walk up the parents to look for siblings
				for (parent = node.parentNode; parent && parent != root_node; parent = parent.parentNode) {
					sibling = parent[sibling_name];
					if (sibling)
						return sibling;
				}
			}
		}
	};

	this.current = function() {
		return node;
	};

	this.next = function(shallow) {
		return (node = findSibling(node, 'firstChild', 'nextSibling', shallow));
	};

	this.prev = function(shallow) {
		return (node = findSibling(node, 'lastChild', 'previousSibling', shallow));
	};
};

(function(tinymce) {
	// Shorten names
	var each = tinymce.each,
		is = tinymce.is,
		isWebKit = tinymce.isWebKit,
		isIE = tinymce.isIE,
		Entities = tinymce.html.Entities,
		simpleSelectorRe = /^([a-z0-9],?)+$/i,
		whiteSpaceRegExp = /^[ \t\r\n]*$/;

	tinymce.create('tinymce.dom.DOMUtils', {
		doc : null,
		root : null,
		files : null,
		pixelStyles : /^(top|left|bottom|right|width|height|borderWidth)$/,
		props : {
			"for" : "htmlFor",
			"class" : "className",
			className : "className",
			checked : "checked",
			disabled : "disabled",
			maxlength : "maxLength",
			readonly : "readOnly",
			selected : "selected",
			value : "value",
			id : "id",
			name : "name",
			type : "type"
		},

		DOMUtils : function(d, s) {
			var t = this, globalStyle, name, blockElementsMap;

			t.doc = d;
			t.win = window;
			t.files = {};
			t.cssFlicker = false;
			t.counter = 0;
			t.stdMode = !tinymce.isIE || d.documentMode >= 8;
			t.boxModel = !tinymce.isIE || d.compatMode == "CSS1Compat" || t.stdMode;
			t.hasOuterHTML = "outerHTML" in d.createElement("a");

			t.settings = s = tinymce.extend({
				keep_values : false,
				hex_colors : 1
			}, s);
			
			t.schema = s.schema;
			t.styles = new tinymce.html.Styles({
				url_converter : s.url_converter,
				url_converter_scope : s.url_converter_scope
			}, s.schema);

			// Fix IE6SP2 flicker and check it failed for pre SP2
			if (tinymce.isIE6) {
				try {
					d.execCommand('BackgroundImageCache', false, true);
				} catch (e) {
					t.cssFlicker = true;
				}
			}

			t.fixDoc(d);
			t.events = s.ownEvents ? new tinymce.dom.EventUtils(s.proxy) : tinymce.dom.Event;
			tinymce.addUnload(t.destroy, t);
			blockElementsMap = s.schema ? s.schema.getBlockElements() : {};

			t.isBlock = function(node) {
				// Fix for #5446
				if (!node) {
					return false;
				}

				// This function is called in module pattern style since it might be executed with the wrong this scope
				var type = node.nodeType;

				// If it's a node then check the type and use the nodeName
				if (type)
					return !!(type === 1 && blockElementsMap[node.nodeName]);

				return !!blockElementsMap[node];
			};
		},

		fixDoc: function(doc) {
			var settings = this.settings, name;

			if (isIE && settings.schema) {
				// Add missing HTML 4/5 elements to IE
				('abbr article aside audio canvas ' +
				'details figcaption figure footer ' +
				'header hgroup mark menu meter nav ' +
				'output progress section summary ' +
				'time video').replace(/\w+/g, function(name) {
					doc.createElement(name);
				});

				// Create all custom elements
				for (name in settings.schema.getCustomElements()) {
					doc.createElement(name);
				}
			}
		},

		clone: function(node, deep) {
			var self = this, clone, doc;

			// TODO: Add feature detection here in the future
			if (!isIE || node.nodeType !== 1 || deep) {
				return node.cloneNode(deep);
			}

			doc = self.doc;

			// Make a HTML5 safe shallow copy
			if (!deep) {
				clone = doc.createElement(node.nodeName);

				// Copy attribs
				each(self.getAttribs(node), function(attr) {
					self.setAttrib(clone, attr.nodeName, self.getAttrib(node, attr.nodeName));
				});

				return clone;
			}
/*
			// Setup HTML5 patched document fragment
			if (!self.frag) {
				self.frag = doc.createDocumentFragment();
				self.fixDoc(self.frag);
			}

			// Make a deep copy by adding it to the document fragment then removing it this removed the :section
			clone = doc.createElement('div');
			self.frag.appendChild(clone);
			clone.innerHTML = node.outerHTML;
			self.frag.removeChild(clone);
*/
			return clone.firstChild;
		},

		getRoot : function() {
			var t = this, s = t.settings;

			return (s && t.get(s.root_element)) || t.doc.body;
		},

		getViewPort : function(w) {
			var d, b;

			w = !w ? this.win : w;
			d = w.document;
			b = this.boxModel ? d.documentElement : d.body;

			// Returns viewport size excluding scrollbars
			return {
				x : w.pageXOffset || b.scrollLeft,
				y : w.pageYOffset || b.scrollTop,
				w : w.innerWidth || b.clientWidth,
				h : w.innerHeight || b.clientHeight
			};
		},

		getRect : function(e) {
			var p, t = this, sr;

			e = t.get(e);
			p = t.getPos(e);
			sr = t.getSize(e);

			return {
				x : p.x,
				y : p.y,
				w : sr.w,
				h : sr.h
			};
		},

		getSize : function(e) {
			var t = this, w, h;

			e = t.get(e);
			w = t.getStyle(e, 'width');
			h = t.getStyle(e, 'height');

			// Non pixel value, then force offset/clientWidth
			if (w.indexOf('px') === -1)
				w = 0;

			// Non pixel value, then force offset/clientWidth
			if (h.indexOf('px') === -1)
				h = 0;

			return {
				w : parseInt(w, 10) || e.offsetWidth || e.clientWidth,
				h : parseInt(h, 10) || e.offsetHeight || e.clientHeight
			};
		},

		getParent : function(n, f, r) {
			return this.getParents(n, f, r, false);
		},

		getParents : function(n, f, r, c) {
			var t = this, na, se = t.settings, o = [];

			n = t.get(n);
			c = c === undefined;

			if (se.strict_root)
				r = r || t.getRoot();

			// Wrap node name as func
			if (is(f, 'string')) {
				na = f;

				if (f === '*') {
					f = function(n) {return n.nodeType == 1;};
				} else {
					f = function(n) {
						return t.is(n, na);
					};
				}
			}

			while (n) {
				if (n == r || !n.nodeType || n.nodeType === 9)
					break;

				if (!f || f(n)) {
					if (c)
						o.push(n);
					else
						return n;
				}

				n = n.parentNode;
			}

			return c ? o : null;
		},

		get : function(e) {
			var n;

			if (e && this.doc && typeof(e) == 'string') {
				n = e;
				e = this.doc.getElementById(e);

				// IE and Opera returns meta elements when they match the specified input ID, but getElementsByName seems to do the trick
				if (e && e.id !== n)
					return this.doc.getElementsByName(n)[1];
			}

			return e;
		},

		getNext : function(node, selector) {
			return this._findSib(node, selector, 'nextSibling');
		},

		getPrev : function(node, selector) {
			return this._findSib(node, selector, 'previousSibling');
		},


		add : function(p, n, a, h, c) {
			var t = this;

			return this.run(p, function(p) {
				var e, k;

				e = is(n, 'string') ? t.doc.createElement(n) : n;
				t.setAttribs(e, a);

				if (h) {
					if (h.nodeType)
						e.appendChild(h);
					else
						t.setHTML(e, h);
				}

				return !c ? p.appendChild(e) : e;
			});
		},

		create : function(n, a, h) {
			return this.add(this.doc.createElement(n), n, a, h, 1);
		},

		createHTML : function(n, a, h) {
			var o = '', t = this, k;

			o += '<' + n;

			for (k in a) {
				if (a.hasOwnProperty(k))
					o += ' ' + k + '="' + t.encode(a[k]) + '"';
			}

			// A call to tinymce.is doesn't work for some odd reason on IE9 possible bug inside their JS runtime
			if (typeof(h) != "undefined")
				return o + '>' + h + '</' + n + '>';

			return o + ' />';
		},

		remove : function(node, keep_children) {
			return this.run(node, function(node) {
				var child, parent = node.parentNode;

				if (!parent)
					return null;

				if (keep_children) {
					while (child = node.firstChild) {
						// IE 8 will crash if you don't remove completely empty text nodes
						if (!tinymce.isIE || child.nodeType !== 3 || child.nodeValue)
							parent.insertBefore(child, node);
						else
							node.removeChild(child);
					}
				}

				return parent.removeChild(node);
			});
		},

		setStyle : function(n, na, v) {
			var t = this;

			return t.run(n, function(e) {
				var s, i;

				s = e.style;

				// Camelcase it, if needed
				na = na.replace(/-(\D)/g, function(a, b){
					return b.toUpperCase();
				});

				// Default px suffix on these
				if (t.pixelStyles.test(na) && (tinymce.is(v, 'number') || /^[\-0-9\.]+$/.test(v)))
					v += 'px';

				switch (na) {
					case 'opacity':
						// IE specific opacity
						if (isIE) {
							s.filter = v === '' ? '' : "alpha(opacity=" + (v * 100) + ")";

							if (!n.currentStyle || !n.currentStyle.hasLayout)
								s.display = 'inline-block';
						}

						// Fix for older browsers
						s[na] = s['-moz-opacity'] = s['-khtml-opacity'] = v || '';
						break;

					case 'float':
						isIE ? s.styleFloat = v : s.cssFloat = v;
						break;
					
					default:
						s[na] = v || '';
				}

				// Force update of the style data
				if (t.settings.update_styles)
					t.setAttrib(e, 'data-mce-style');
			});
		},

		getStyle : function(n, na, c) {
			n = this.get(n);

			if (!n)
				return;

			// Gecko
			if (this.doc.defaultView && c) {
				// Remove camelcase
				na = na.replace(/[A-Z]/g, function(a){
					return '-' + a;
				});

				try {
					return this.doc.defaultView.getComputedStyle(n, null).getPropertyValue(na);
				} catch (ex) {
					// Old safari might fail
					return null;
				}
			}

			// Camelcase it, if needed
			na = na.replace(/-(\D)/g, function(a, b){
				return b.toUpperCase();
			});

			if (na == 'float')
				na = isIE ? 'styleFloat' : 'cssFloat';

			// IE & Opera
			if (n.currentStyle && c)
				return n.currentStyle[na];

			return n.style ? n.style[na] : undefined;
		},

		setStyles : function(e, o) {
			var t = this, s = t.settings, ol;

			ol = s.update_styles;
			s.update_styles = 0;

			each(o, function(v, n) {
				t.setStyle(e, n, v);
			});

			// Update style info
			s.update_styles = ol;
			if (s.update_styles)
				t.setAttrib(e, s.cssText);
		},

		removeAllAttribs: function(e) {
			return this.run(e, function(e) {
				var i, attrs = e.attributes;
				for (i = attrs.length - 1; i >= 0; i--) {
					e.removeAttributeNode(attrs.item(i));
				}
			});
		},

		setAttrib : function(e, n, v) {
			var t = this;

			// Whats the point
			if (!e || !n)
				return;

			// Strict XML mode
			if (t.settings.strict)
				n = n.toLowerCase();

			return this.run(e, function(e) {
				var s = t.settings;
				var originalValue = e.getAttribute(n);
				if (v !== null) {
					switch (n) {
						case "style":
							if (!is(v, 'string')) {
								each(v, function(v, n) {
									t.setStyle(e, n, v);
								});

								return;
							}

							// No mce_style for elements with these since they might get resized by the user
							if (s.keep_values) {
								if (v && !t._isRes(v))
									e.setAttribute('data-mce-style', v, 2);
								else
									e.removeAttribute('data-mce-style', 2);
							}

							e.style.cssText = v;
							break;

						case "class":
							e.className = v || ''; // Fix IE null bug
							break;

						case "src":
						case "href":
							if (s.keep_values) {
								if (s.url_converter)
									v = s.url_converter.call(s.url_converter_scope || t, v, n, e);

								t.setAttrib(e, 'data-mce-' + n, v, 2);
							}

							break;

						case "shape":
							e.setAttribute('data-mce-style', v);
							break;
					}
				}
				if (is(v) && v !== null && v.length !== 0)
					e.setAttribute(n, '' + v, 2);
				else
					e.removeAttribute(n, 2);

				// fire onChangeAttrib event for attributes that have changed
				if (tinyMCE.activeEditor && originalValue != v) {
					var ed = tinyMCE.activeEditor;
					ed.onSetAttrib.dispatch(ed, e, n, v);
				}
			});
		},

		setAttribs : function(e, o) {
			var t = this;

			return this.run(e, function(e) {
				each(o, function(v, n) {
					t.setAttrib(e, n, v);
				});
			});
		},

		getAttrib : function(e, n, dv) {
			var v, t = this, undef;

			e = t.get(e);

			if (!e || e.nodeType !== 1)
				return dv === undef ? false : dv;

			if (!is(dv))
				dv = '';

			// Try the mce variant for these
			if (/^(src|href|style|coords|shape)$/.test(n)) {
				v = e.getAttribute("data-mce-" + n);

				if (v)
					return v;
			}

			if (isIE && t.props[n]) {
				v = e[t.props[n]];
				v = v && v.nodeValue ? v.nodeValue : v;
			}

			if (!v)
				v = e.getAttribute(n, 2);

			// Check boolean attribs
			if (/^(checked|compact|declare|defer|disabled|ismap|multiple|nohref|noshade|nowrap|readonly|selected)$/.test(n)) {
				if (e[t.props[n]] === true && v === '')
					return n;

				return v ? n : '';
			}

			// Inner input elements will override attributes on form elements
			if (e.nodeName === "FORM" && e.getAttributeNode(n))
				return e.getAttributeNode(n).nodeValue;

			if (n === 'style') {
				v = v || e.style.cssText;

				if (v) {
					v = t.serializeStyle(t.parseStyle(v), e.nodeName);

					if (t.settings.keep_values && !t._isRes(v))
						e.setAttribute('data-mce-style', v);
				}
			}

			// Remove Apple and WebKit stuff
			if (isWebKit && n === "class" && v)
				v = v.replace(/(apple|webkit)\-[a-z\-]+/gi, '');

			// Handle IE issues
			if (isIE) {
				switch (n) {
					case 'rowspan':
					case 'colspan':
						// IE returns 1 as default value
						if (v === 1)
							v = '';

						break;

					case 'size':
						// IE returns +0 as default value for size
						if (v === '+0' || v === 20 || v === 0)
							v = '';

						break;

					case 'width':
					case 'height':
					case 'vspace':
					case 'checked':
					case 'disabled':
					case 'readonly':
						if (v === 0)
							v = '';

						break;

					case 'hspace':
						// IE returns -1 as default value
						if (v === -1)
							v = '';

						break;

					case 'maxlength':
					case 'tabindex':
						// IE returns default value
						if (v === 32768 || v === 2147483647 || v === '32768')
							v = '';

						break;

					case 'multiple':
					case 'compact':
					case 'noshade':
					case 'nowrap':
						if (v === 65535)
							return n;

						return dv;

					case 'shape':
						v = v.toLowerCase();
						break;

					default:
						// IE has odd anonymous function for event attributes
						if (n.indexOf('on') === 0 && v)
							v = tinymce._replace(/^function\s+\w+\(\)\s+\{\s+(.*)\s+\}$/, '$1', '' + v);
				}
			}

			return (v !== undef && v !== null && v !== '') ? '' + v : dv;
		},

		getPos : function(n, ro) {
			var t = this, x = 0, y = 0, e, d = t.doc, r;

			n = t.get(n);
			ro = ro || d.body;

			if (n) {
				// Use getBoundingClientRect if it exists since it's faster than looping offset nodes
				if (n.getBoundingClientRect) {
					n = n.getBoundingClientRect();
					e = t.boxModel ? d.documentElement : d.body;

					// Add scroll offsets from documentElement or body since IE with the wrong box model will use d.body and so do WebKit
					// Also remove the body/documentelement clientTop/clientLeft on IE 6, 7 since they offset the position
					x = n.left + (d.documentElement.scrollLeft || d.body.scrollLeft) - e.clientTop;
					y = n.top + (d.documentElement.scrollTop || d.body.scrollTop) - e.clientLeft;

					return {x : x, y : y};
				}

				r = n;
				while (r && r != ro && r.nodeType) {
					x += r.offsetLeft || 0;
					y += r.offsetTop || 0;
					r = r.offsetParent;
				}

				r = n.parentNode;
				while (r && r != ro && r.nodeType) {
					x -= r.scrollLeft || 0;
					y -= r.scrollTop || 0;
					r = r.parentNode;
				}
			}

			return {x : x, y : y};
		},

		parseStyle : function(st) {
			return this.styles.parse(st);
		},

		serializeStyle : function(o, name) {
			return this.styles.serialize(o, name);
		},

		addStyle: function(cssText) {
			var doc = this.doc, head;

			// Create style element if needed
			styleElm = doc.getElementById('mceDefaultStyles');
			if (!styleElm) {
				styleElm = doc.createElement('style'),
				styleElm.id = 'mceDefaultStyles';
				styleElm.type = 'text/css';

				head = doc.getElementsByTagName('head')[0];
				if (head.firstChild) {
					head.insertBefore(styleElm, head.firstChild);
				} else {
					head.appendChild(styleElm);
				}
			}

			// Append style data to old or new style element
			if (styleElm.styleSheet) {
				styleElm.styleSheet.cssText += cssText;
			} else {
				styleElm.appendChild(doc.createTextNode(cssText));
			}
		},

		loadCSS : function(u) {
			var t = this, d = t.doc, head;

			if (!u)
				u = '';

			head = d.getElementsByTagName('head')[0];

			each(u.split(','), function(u) {
				var link;

				if (t.files[u])
					return;

				t.files[u] = true;
				link = t.create('link', {rel : 'stylesheet', href : tinymce._addVer(u)});

				// IE 8 has a bug where dynamically loading stylesheets would produce a 1 item remaining bug
				// This fix seems to resolve that issue by realcing the document ones a stylesheet finishes loading
				// It's ugly but it seems to work fine.
				if (isIE && d.documentMode && d.recalc) {
					link.onload = function() {
						if (d.recalc)
							d.recalc();

						link.onload = null;
					};
				}

				head.appendChild(link);
			});
		},

		addClass : function(e, c) {
			return this.run(e, function(e) {
				var o;

				if (!c)
					return 0;

				if (this.hasClass(e, c))
					return e.className;

				o = this.removeClass(e, c);

				return e.className = (o != '' ? (o + ' ') : '') + c;
			});
		},

		removeClass : function(e, c) {
			var t = this, re;

			return t.run(e, function(e) {
				var v;

				if (t.hasClass(e, c)) {
					if (!re)
						re = new RegExp("(^|\\s+)" + c + "(\\s+|$)", "g");

					v = e.className.replace(re, ' ');
					v = tinymce.trim(v != ' ' ? v : '');

					e.className = v;

					// Empty class attr
					if (!v) {
						e.removeAttribute('class');
						e.removeAttribute('className');
					}

					return v;
				}

				return e.className;
			});
		},

		hasClass : function(n, c) {
			n = this.get(n);

			if (!n || !c)
				return false;

			return (' ' + n.className + ' ').indexOf(' ' + c + ' ') !== -1;
		},

		show : function(e) {
			return this.setStyle(e, 'display', 'block');
		},

		hide : function(e) {
			return this.setStyle(e, 'display', 'none');
		},

		isHidden : function(e) {
			e = this.get(e);

			return !e || e.style.display == 'none' || this.getStyle(e, 'display') == 'none';
		},

		uniqueId : function(p) {
			return (!p ? 'mce_' : p) + (this.counter++);
		},

		setHTML : function(element, html) {
			var self = this;

			return self.run(element, function(element) {
				if (isIE) {
					// Remove all child nodes, IE keeps empty text nodes in DOM
					while (element.firstChild)
						element.removeChild(element.firstChild);

					try {
						// IE will remove comments from the beginning
						// unless you padd the contents with something
						element.innerHTML = '<br />' + html;
						element.removeChild(element.firstChild);
					} catch (ex) {
						// IE sometimes produces an unknown runtime error on innerHTML if it's an block element within a block element for example a div inside a p
						// This seems to fix this problem

						// Create new div with HTML contents and a BR infront to keep comments
						var newElement = self.create('div');
						newElement.innerHTML = '<br />' + html;

						// Add all children from div to target
						each (tinymce.grep(newElement.childNodes), function(node, i) {
							// Skip br element
							if (i && element.canHaveHTML)
								element.appendChild(node);
						});
					}
				} else
					element.innerHTML = html;

				return html;
			});
		},

		getOuterHTML : function(elm) {
			var doc, self = this;

			elm = self.get(elm);

			if (!elm)
				return null;

			if (elm.nodeType === 1 && self.hasOuterHTML)
				return elm.outerHTML;

			doc = (elm.ownerDocument || self.doc).createElement("body");
			doc.appendChild(elm.cloneNode(true));

			return doc.innerHTML;
		},

		setOuterHTML : function(e, h, d) {
			var t = this;

			function setHTML(e, h, d) {
				var n, tp;

				tp = d.createElement("body");
				tp.innerHTML = h;

				n = tp.lastChild;
				while (n) {
					t.insertAfter(n.cloneNode(true), e);
					n = n.previousSibling;
				}

				t.remove(e);
			};

			return this.run(e, function(e) {
				e = t.get(e);

				// Only set HTML on elements
				if (e.nodeType == 1) {
					d = d || e.ownerDocument || t.doc;

					if (isIE) {
						try {
							// Try outerHTML for IE it sometimes produces an unknown runtime error
							if (isIE && e.nodeType == 1)
								e.outerHTML = h;
							else
								setHTML(e, h, d);
						} catch (ex) {
							// Fix for unknown runtime error
							setHTML(e, h, d);
						}
					} else
						setHTML(e, h, d);
				}
			});
		},

		decode : Entities.decode,

		encode : Entities.encodeAllRaw,

		insertAfter : function(node, reference_node) {
			reference_node = this.get(reference_node);

			return this.run(node, function(node) {
				var parent, nextSibling;

				parent = reference_node.parentNode;
				nextSibling = reference_node.nextSibling;

				if (nextSibling)
					parent.insertBefore(node, nextSibling);
				else
					parent.appendChild(node);

				return node;
			});
		},

		replace : function(n, o, k) {
			var t = this;

			if (is(o, 'array'))
				n = n.cloneNode(true);

			return t.run(o, function(o) {
				if (k) {
					each(tinymce.grep(o.childNodes), function(c) {
						n.appendChild(c);
					});
				}

				return o.parentNode.replaceChild(n, o);
			});
		},

		rename : function(elm, name) {
			var t = this, newElm;

			if (elm.nodeName != name.toUpperCase()) {
				// Rename block element
				newElm = t.create(name);

				// Copy attribs to new block
				each(t.getAttribs(elm), function(attr_node) {
					t.setAttrib(newElm, attr_node.nodeName, t.getAttrib(elm, attr_node.nodeName));
				});

				// Replace block
				t.replace(newElm, elm, 1);
			}

			return newElm || elm;
		},

		findCommonAncestor : function(a, b) {
			var ps = a, pe;

			while (ps) {
				pe = b;

				while (pe && ps != pe)
					pe = pe.parentNode;

				if (ps == pe)
					break;

				ps = ps.parentNode;
			}

			if (!ps && a.ownerDocument)
				return a.ownerDocument.documentElement;

			return ps;
		},

		toHex : function(s) {
			var c = /^\s*rgb\s*?\(\s*?([0-9]+)\s*?,\s*?([0-9]+)\s*?,\s*?([0-9]+)\s*?\)\s*$/i.exec(s);

			function hex(s) {
				s = parseInt(s, 10).toString(16);

				return s.length > 1 ? s : '0' + s; // 0 -> 00
			};

			if (c) {
				s = '#' + hex(c[1]) + hex(c[2]) + hex(c[3]);

				return s;
			}

			return s;
		},

		getClasses : function() {
			var t = this, cl = [], i, lo = {}, f = t.settings.class_filter, ov;

			if (t.classes)
				return t.classes;

			function addClasses(s) {
				// IE style imports
				each(s.imports, function(r) {
					addClasses(r);
				});

				each(s.cssRules || s.rules, function(r) {
					// Real type or fake it on IE
					switch (r.type || 1) {
						// Rule
						case 1:
							if (r.selectorText) {
								each(r.selectorText.split(','), function(v) {
									v = v.replace(/^\s*|\s*$|^\s\./g, "");

									// Is internal or it doesn't contain a class
									if (/\.mce/.test(v) || !/\.[\w\-]+$/.test(v))
										return;

									// Remove everything but class name
									ov = v;
									v = tinymce._replace(/.*\.([a-z0-9_\-]+).*/i, '$1', v);

									// Filter classes
									if (f && !(v = f(v, ov)))
										return;

									if (!lo[v]) {
										cl.push({'class' : v});
										lo[v] = 1;
									}
								});
							}
							break;

						// Import
						case 3:
							addClasses(r.styleSheet);
							break;
					}
				});
			};

			try {
				each(t.doc.styleSheets, addClasses);
			} catch (ex) {
				// Ignore
			}

			if (cl.length > 0)
				t.classes = cl;

			return cl;
		},

		run : function(e, f, s) {
			var t = this, o;

			if (t.doc && typeof(e) === 'string')
				e = t.get(e);

			if (!e)
				return false;

			s = s || this;
			if (!e.nodeType && (e.length || e.length === 0)) {
				o = [];

				each(e, function(e, i) {
					if (e) {
						if (typeof(e) == 'string')
							e = t.doc.getElementById(e);

						o.push(f.call(s, e, i));
					}
				});

				return o;
			}

			return f.call(s, e);
		},

		getAttribs : function(n) {
			var o;

			n = this.get(n);

			if (!n)
				return [];

			if (isIE) {
				o = [];

				// Object will throw exception in IE
				if (n.nodeName == 'OBJECT')
					return n.attributes;

				// IE doesn't keep the selected attribute if you clone option elements
				if (n.nodeName === 'OPTION' && this.getAttrib(n, 'selected'))
					o.push({specified : 1, nodeName : 'selected'});

				// It's crazy that this is faster in IE but it's because it returns all attributes all the time
				n.cloneNode(false).outerHTML.replace(/<\/?[\w:\-]+ ?|=[\"][^\"]+\"|=\'[^\']+\'|=[\w\-]+|>/gi, '').replace(/[\w:\-]+/gi, function(a) {
					o.push({specified : 1, nodeName : a});
				});

				return o;
			}

			return n.attributes;
		},

		isEmpty : function(node, elements) {
			var self = this, i, attributes, type, walker, name, brCount = 0;

			node = node.firstChild;
			if (node) {
				walker = new tinymce.dom.TreeWalker(node, node.parentNode);
				elements = elements || self.schema ? self.schema.getNonEmptyElements() : null;

				do {
					type = node.nodeType;

					if (type === 1) {
						// Ignore bogus elements
						if (node.getAttribute('data-mce-bogus'))
							continue;

						// Keep empty elements like <img />
						name = node.nodeName.toLowerCase();
						if (elements && elements[name]) {
							// Ignore single BR elements in blocks like <p><br /></p> or <p><span><br /></span></p>
							if (name === 'br') {
								brCount++;
								continue;
							}

							return false;
						}

						// Keep elements with data-bookmark attributes or name attribute like <a name="1"></a>
						attributes = self.getAttribs(node);
						i = node.attributes.length;
						while (i--) {
							name = node.attributes[i].nodeName;
							if (name === "name" || name === 'data-mce-bookmark')
								return false;
						}
					}

					// Keep comment nodes
					if (type == 8)
						return false;

					// Keep non whitespace text nodes
					if ((type === 3 && !whiteSpaceRegExp.test(node.nodeValue)))
						return false;
				} while (node = walker.next());
			}

			return brCount <= 1;
		},

		destroy : function(s) {
			var t = this;

			t.win = t.doc = t.root = t.events = t.frag = null;

			// Manual destroy then remove unload handler
			if (!s)
				tinymce.removeUnload(t.destroy);
		},

		createRng : function() {
			var d = this.doc;

			return d.createRange ? d.createRange() : new tinymce.dom.Range(this);
		},

		nodeIndex : function(node, normalized) {
			var idx = 0, lastNodeType, lastNode, nodeType;

			if (node) {
				for (lastNodeType = node.nodeType, node = node.previousSibling, lastNode = node; node; node = node.previousSibling) {
					nodeType = node.nodeType;

					// Normalize text nodes
					if (normalized && nodeType == 3) {
						if (nodeType == lastNodeType || !node.nodeValue.length)
							continue;
					}
					idx++;
					lastNodeType = nodeType;
				}
			}

			return idx;
		},

		split : function(pe, e, re) {
			var t = this, r = t.createRng(), bef, aft, pa;

			// W3C valid browsers tend to leave empty nodes to the left/right side of the contents, this makes sense
			// but we don't want that in our code since it serves no purpose for the end user
			// For example if this is chopped:
			//   <p>text 1<span><b>CHOP</b></span>text 2</p>
			// would produce:
			//   <p>text 1<span></span></p><b>CHOP</b><p><span></span>text 2</p>
			// this function will then trim of empty edges and produce:
			//   <p>text 1</p><b>CHOP</b><p>text 2</p>
			function trim(node) {
				var i, children = node.childNodes, type = node.nodeType;

				function surroundedBySpans(node) {
					var previousIsSpan = node.previousSibling && node.previousSibling.nodeName == 'SPAN';
					var nextIsSpan = node.nextSibling && node.nextSibling.nodeName == 'SPAN';
					return previousIsSpan && nextIsSpan;
				}

				if (type == 1 && node.getAttribute('data-mce-type') == 'bookmark')
					return;

				for (i = children.length - 1; i >= 0; i--)
					trim(children[i]);

				if (type != 9) {
					// Keep non whitespace text nodes
					if (type == 3 && node.nodeValue.length > 0) {
						// If parent element isn't a block or there isn't any useful contents for example "<p>   </p>"
						// Also keep text nodes with only spaces if surrounded by spans.
						// eg. "<p><span>a</span> <span>b</span></p>" should keep space between a and b
						var trimmedLength = tinymce.trim(node.nodeValue).length;
						if (!t.isBlock(node.parentNode) || trimmedLength > 0 || trimmedLength === 0 && surroundedBySpans(node))
							return;
					} else if (type == 1) {
						// If the only child is a bookmark then move it up
						children = node.childNodes;
						if (children.length == 1 && children[0] && children[0].nodeType == 1 && children[0].getAttribute('data-mce-type') == 'bookmark')
							node.parentNode.insertBefore(children[0], node);

						// Keep non empty elements or img, hr etc
						if (children.length || /^(br|hr|input|img)$/i.test(node.nodeName))
							return;
					}

					t.remove(node);
				}

				return node;
			};

			if (pe && e) {
				// Get before chunk
				r.setStart(pe.parentNode, t.nodeIndex(pe));
				r.setEnd(e.parentNode, t.nodeIndex(e));
				bef = r.extractContents();

				// Get after chunk
				r = t.createRng();
				r.setStart(e.parentNode, t.nodeIndex(e) + 1);
				r.setEnd(pe.parentNode, t.nodeIndex(pe) + 1);
				aft = r.extractContents();

				// Insert before chunk
				pa = pe.parentNode;
				pa.insertBefore(trim(bef), pe);

				// Insert middle chunk
				if (re)
				pa.replaceChild(re, e);
			else
				pa.insertBefore(e, pe);

				// Insert after chunk
				pa.insertBefore(trim(aft), pe);
				t.remove(pe);

				return re || e;
			}
		},

		bind : function(target, name, func, scope) {
			return this.events.add(target, name, func, scope || this);
		},

		unbind : function(target, name, func) {
			return this.events.remove(target, name, func);
		},

		fire : function(target, name, evt) {
			return this.events.fire(target, name, evt);
		},

		// Returns the content editable state of a node
		getContentEditable: function(node) {
			var contentEditable;

			// Check type
			if (node.nodeType != 1) {
				return null;
			}

			// Check for fake content editable
			contentEditable = node.getAttribute("data-mce-contenteditable");
			if (contentEditable && contentEditable !== "inherit") {
				return contentEditable;
			}

			// Check for real content editable
			return node.contentEditable !== "inherit" ? node.contentEditable : null;
		},


		_findSib : function(node, selector, name) {
			var t = this, f = selector;

			if (node) {
				// If expression make a function of it using is
				if (is(f, 'string')) {
					f = function(node) {
						return t.is(node, selector);
					};
				}

				// Loop all siblings
				for (node = node[name]; node; node = node[name]) {
					if (f(node))
						return node;
				}
			}

			return null;
		},

		_isRes : function(c) {
			// Is live resizble element
			return /^(top|left|bottom|right|width|height)/i.test(c) || /;\s*(top|left|bottom|right|width|height)/i.test(c);
		}

		/*
		walk : function(n, f, s) {
			var d = this.doc, w;

			if (d.createTreeWalker) {
				w = d.createTreeWalker(n, NodeFilter.SHOW_TEXT, null, false);

				while ((n = w.nextNode()) != null)
					f.call(s || this, n);
			} else
				tinymce.walk(n, f, 'childNodes', s);
		}
		*/

		/*
		toRGB : function(s) {
			var c = /^\s*?#([0-9A-F]{2})([0-9A-F]{1,2})([0-9A-F]{2})?\s*?$/.exec(s);

			if (c) {
				// #FFF -> #FFFFFF
				if (!is(c[3]))
					c[3] = c[2] = c[1];

				return "rgb(" + parseInt(c[1], 16) + "," + parseInt(c[2], 16) + "," + parseInt(c[3], 16) + ")";
			}

			return s;
		}
		*/
	});

	tinymce.DOM = new tinymce.dom.DOMUtils(document, {process_html : 0});
})(tinymce);

(function(ns) {
	// Range constructor
	function Range(dom) {
		var t = this,
			doc = dom.doc,
			EXTRACT = 0,
			CLONE = 1,
			DELETE = 2,
			TRUE = true,
			FALSE = false,
			START_OFFSET = 'startOffset',
			START_CONTAINER = 'startContainer',
			END_CONTAINER = 'endContainer',
			END_OFFSET = 'endOffset',
			extend = tinymce.extend,
			nodeIndex = dom.nodeIndex;

		extend(t, {
			// Inital states
			startContainer : doc,
			startOffset : 0,
			endContainer : doc,
			endOffset : 0,
			collapsed : TRUE,
			commonAncestorContainer : doc,

			// Range constants
			START_TO_START : 0,
			START_TO_END : 1,
			END_TO_END : 2,
			END_TO_START : 3,

			// Public methods
			setStart : setStart,
			setEnd : setEnd,
			setStartBefore : setStartBefore,
			setStartAfter : setStartAfter,
			setEndBefore : setEndBefore,
			setEndAfter : setEndAfter,
			collapse : collapse,
			selectNode : selectNode,
			selectNodeContents : selectNodeContents,
			compareBoundaryPoints : compareBoundaryPoints,
			deleteContents : deleteContents,
			extractContents : extractContents,
			cloneContents : cloneContents,
			insertNode : insertNode,
			surroundContents : surroundContents,
			cloneRange : cloneRange,
			toStringIE : toStringIE
		});

		function createDocumentFragment() {
			return doc.createDocumentFragment();
		};

		function setStart(n, o) {
			_setEndPoint(TRUE, n, o);
		};

		function setEnd(n, o) {
			_setEndPoint(FALSE, n, o);
		};

		function setStartBefore(n) {
			setStart(n.parentNode, nodeIndex(n));
		};

		function setStartAfter(n) {
			setStart(n.parentNode, nodeIndex(n) + 1);
		};

		function setEndBefore(n) {
			setEnd(n.parentNode, nodeIndex(n));
		};

		function setEndAfter(n) {
			setEnd(n.parentNode, nodeIndex(n) + 1);
		};

		function collapse(ts) {
			if (ts) {
				t[END_CONTAINER] = t[START_CONTAINER];
				t[END_OFFSET] = t[START_OFFSET];
			} else {
				t[START_CONTAINER] = t[END_CONTAINER];
				t[START_OFFSET] = t[END_OFFSET];
			}

			t.collapsed = TRUE;
		};

		function selectNode(n) {
			setStartBefore(n);
			setEndAfter(n);
		};

		function selectNodeContents(n) {
			setStart(n, 0);
			setEnd(n, n.nodeType === 1 ? n.childNodes.length : n.nodeValue.length);
		};

		function compareBoundaryPoints(h, r) {
			var sc = t[START_CONTAINER], so = t[START_OFFSET], ec = t[END_CONTAINER], eo = t[END_OFFSET],
			rsc = r.startContainer, rso = r.startOffset, rec = r.endContainer, reo = r.endOffset;

			// Check START_TO_START
			if (h === 0)
				return _compareBoundaryPoints(sc, so, rsc, rso);
	
			// Check START_TO_END
			if (h === 1)
				return _compareBoundaryPoints(ec, eo, rsc, rso);
	
			// Check END_TO_END
			if (h === 2)
				return _compareBoundaryPoints(ec, eo, rec, reo);
	
			// Check END_TO_START
			if (h === 3) 
				return _compareBoundaryPoints(sc, so, rec, reo);
		};

		function deleteContents() {
			_traverse(DELETE);
		};

		function extractContents() {
			return _traverse(EXTRACT);
		};

		function cloneContents() {
			return _traverse(CLONE);
		};

		function insertNode(n) {
			var startContainer = this[START_CONTAINER],
				startOffset = this[START_OFFSET], nn, o;

			// Node is TEXT_NODE or CDATA
			if ((startContainer.nodeType === 3 || startContainer.nodeType === 4) && startContainer.nodeValue) {
				if (!startOffset) {
					// At the start of text
					startContainer.parentNode.insertBefore(n, startContainer);
				} else if (startOffset >= startContainer.nodeValue.length) {
					// At the end of text
					dom.insertAfter(n, startContainer);
				} else {
					// Middle, need to split
					nn = startContainer.splitText(startOffset);
					startContainer.parentNode.insertBefore(n, nn);
				}
			} else {
				// Insert element node
				if (startContainer.childNodes.length > 0)
					o = startContainer.childNodes[startOffset];

				if (o)
					startContainer.insertBefore(n, o);
				else
					startContainer.appendChild(n);
			}
		};

		function surroundContents(n) {
			var f = t.extractContents();

			t.insertNode(n);
			n.appendChild(f);
			t.selectNode(n);
		};

		function cloneRange() {
			return extend(new Range(dom), {
				startContainer : t[START_CONTAINER],
				startOffset : t[START_OFFSET],
				endContainer : t[END_CONTAINER],
				endOffset : t[END_OFFSET],
				collapsed : t.collapsed,
				commonAncestorContainer : t.commonAncestorContainer
			});
		};

		// Private methods

		function _getSelectedNode(container, offset) {
			var child;

			if (container.nodeType == 3 /* TEXT_NODE */)
				return container;

			if (offset < 0)
				return container;

			child = container.firstChild;
			while (child && offset > 0) {
				--offset;
				child = child.nextSibling;
			}

			if (child)
				return child;

			return container;
		};

		function _isCollapsed() {
			return (t[START_CONTAINER] == t[END_CONTAINER] && t[START_OFFSET] == t[END_OFFSET]);
		};

		function _compareBoundaryPoints(containerA, offsetA, containerB, offsetB) {
			var c, offsetC, n, cmnRoot, childA, childB;
			
			// In the first case the boundary-points have the same container. A is before B
			// if its offset is less than the offset of B, A is equal to B if its offset is
			// equal to the offset of B, and A is after B if its offset is greater than the
			// offset of B.
			if (containerA == containerB) {
				if (offsetA == offsetB)
					return 0; // equal

				if (offsetA < offsetB)
					return -1; // before

				return 1; // after
			}

			// In the second case a child node C of the container of A is an ancestor
			// container of B. In this case, A is before B if the offset of A is less than or
			// equal to the index of the child node C and A is after B otherwise.
			c = containerB;
			while (c && c.parentNode != containerA)
				c = c.parentNode;

			if (c) {
				offsetC = 0;
				n = containerA.firstChild;

				while (n != c && offsetC < offsetA) {
					offsetC++;
					n = n.nextSibling;
				}

				if (offsetA <= offsetC)
					return -1; // before

				return 1; // after
			}

			// In the third case a child node C of the container of B is an ancestor container
			// of A. In this case, A is before B if the index of the child node C is less than
			// the offset of B and A is after B otherwise.
			c = containerA;
			while (c && c.parentNode != containerB) {
				c = c.parentNode;
			}

			if (c) {
				offsetC = 0;
				n = containerB.firstChild;

				while (n != c && offsetC < offsetB) {
					offsetC++;
					n = n.nextSibling;
				}

				if (offsetC < offsetB)
					return -1; // before

				return 1; // after
			}

			// In the fourth case, none of three other cases hold: the containers of A and B
			// are siblings or descendants of sibling nodes. In this case, A is before B if
			// the container of A is before the container of B in a pre-order traversal of the
			// Ranges' context tree and A is after B otherwise.
			cmnRoot = dom.findCommonAncestor(containerA, containerB);
			childA = containerA;

			while (childA && childA.parentNode != cmnRoot)
				childA = childA.parentNode;

			if (!childA)
				childA = cmnRoot;

			childB = containerB;
			while (childB && childB.parentNode != cmnRoot)
				childB = childB.parentNode;

			if (!childB)
				childB = cmnRoot;

			if (childA == childB)
				return 0; // equal

			n = cmnRoot.firstChild;
			while (n) {
				if (n == childA)
					return -1; // before

				if (n == childB)
					return 1; // after

				n = n.nextSibling;
			}
		};

		function _setEndPoint(st, n, o) {
			var ec, sc;

			if (st) {
				t[START_CONTAINER] = n;
				t[START_OFFSET] = o;
			} else {
				t[END_CONTAINER] = n;
				t[END_OFFSET] = o;
			}

			// If one boundary-point of a Range is set to have a root container
			// other than the current one for the Range, the Range is collapsed to
			// the new position. This enforces the restriction that both boundary-
			// points of a Range must have the same root container.
			ec = t[END_CONTAINER];
			while (ec.parentNode)
				ec = ec.parentNode;

			sc = t[START_CONTAINER];
			while (sc.parentNode)
				sc = sc.parentNode;

			if (sc == ec) {
				// The start position of a Range is guaranteed to never be after the
				// end position. To enforce this restriction, if the start is set to
				// be at a position after the end, the Range is collapsed to that
				// position.
				if (_compareBoundaryPoints(t[START_CONTAINER], t[START_OFFSET], t[END_CONTAINER], t[END_OFFSET]) > 0)
					t.collapse(st);
			} else
				t.collapse(st);

			t.collapsed = _isCollapsed();
			t.commonAncestorContainer = dom.findCommonAncestor(t[START_CONTAINER], t[END_CONTAINER]);
		};

		function _traverse(how) {
			var c, endContainerDepth = 0, startContainerDepth = 0, p, depthDiff, startNode, endNode, sp, ep;

			if (t[START_CONTAINER] == t[END_CONTAINER])
				return _traverseSameContainer(how);

			for (c = t[END_CONTAINER], p = c.parentNode; p; c = p, p = p.parentNode) {
				if (p == t[START_CONTAINER])
					return _traverseCommonStartContainer(c, how);

				++endContainerDepth;
			}

			for (c = t[START_CONTAINER], p = c.parentNode; p; c = p, p = p.parentNode) {
				if (p == t[END_CONTAINER])
					return _traverseCommonEndContainer(c, how);

				++startContainerDepth;
			}

			depthDiff = startContainerDepth - endContainerDepth;

			startNode = t[START_CONTAINER];
			while (depthDiff > 0) {
				startNode = startNode.parentNode;
				depthDiff--;
			}

			endNode = t[END_CONTAINER];
			while (depthDiff < 0) {
				endNode = endNode.parentNode;
				depthDiff++;
			}

			// ascend the ancestor hierarchy until we have a common parent.
			for (sp = startNode.parentNode, ep = endNode.parentNode; sp != ep; sp = sp.parentNode, ep = ep.parentNode) {
				startNode = sp;
				endNode = ep;
			}

			return _traverseCommonAncestors(startNode, endNode, how);
		};

		 function _traverseSameContainer(how) {
			var frag, s, sub, n, cnt, sibling, xferNode, start, len;

			if (how != DELETE)
				frag = createDocumentFragment();

			// If selection is empty, just return the fragment
			if (t[START_OFFSET] == t[END_OFFSET])
				return frag;

			// Text node needs special case handling
			if (t[START_CONTAINER].nodeType == 3 /* TEXT_NODE */) {
				// get the substring
				s = t[START_CONTAINER].nodeValue;
				sub = s.substring(t[START_OFFSET], t[END_OFFSET]);

				// set the original text node to its new value
				if (how != CLONE) {
					n = t[START_CONTAINER];
					start = t[START_OFFSET];
					len = t[END_OFFSET] - t[START_OFFSET];

					if (start === 0 && len >= n.nodeValue.length - 1) {
						n.parentNode.removeChild(n);
					} else {
						n.deleteData(start, len);
					}

					// Nothing is partially selected, so collapse to start point
					t.collapse(TRUE);
				}

				if (how == DELETE)
					return;

				if (sub.length > 0) {
					frag.appendChild(doc.createTextNode(sub));
				}

				return frag;
			}

			// Copy nodes between the start/end offsets.
			n = _getSelectedNode(t[START_CONTAINER], t[START_OFFSET]);
			cnt = t[END_OFFSET] - t[START_OFFSET];

			while (n && cnt > 0) {
				sibling = n.nextSibling;
				xferNode = _traverseFullySelected(n, how);

				if (frag)
					frag.appendChild( xferNode );

				--cnt;
				n = sibling;
			}

			// Nothing is partially selected, so collapse to start point
			if (how != CLONE)
				t.collapse(TRUE);

			return frag;
		};

		function _traverseCommonStartContainer(endAncestor, how) {
			var frag, n, endIdx, cnt, sibling, xferNode;

			if (how != DELETE)
				frag = createDocumentFragment();

			n = _traverseRightBoundary(endAncestor, how);

			if (frag)
				frag.appendChild(n);

			endIdx = nodeIndex(endAncestor);
			cnt = endIdx - t[START_OFFSET];

			if (cnt <= 0) {
				// Collapse to just before the endAncestor, which
				// is partially selected.
				if (how != CLONE) {
					t.setEndBefore(endAncestor);
					t.collapse(FALSE);
				}

				return frag;
			}

			n = endAncestor.previousSibling;
			while (cnt > 0) {
				sibling = n.previousSibling;
				xferNode = _traverseFullySelected(n, how);

				if (frag)
					frag.insertBefore(xferNode, frag.firstChild);

				--cnt;
				n = sibling;
			}

			// Collapse to just before the endAncestor, which
			// is partially selected.
			if (how != CLONE) {
				t.setEndBefore(endAncestor);
				t.collapse(FALSE);
			}

			return frag;
		};

		function _traverseCommonEndContainer(startAncestor, how) {
			var frag, startIdx, n, cnt, sibling, xferNode;

			if (how != DELETE)
				frag = createDocumentFragment();

			n = _traverseLeftBoundary(startAncestor, how);
			if (frag)
				frag.appendChild(n);

			startIdx = nodeIndex(startAncestor);
			++startIdx; // Because we already traversed it

			cnt = t[END_OFFSET] - startIdx;
			n = startAncestor.nextSibling;
			while (n && cnt > 0) {
				sibling = n.nextSibling;
				xferNode = _traverseFullySelected(n, how);

				if (frag)
					frag.appendChild(xferNode);

				--cnt;
				n = sibling;
			}

			if (how != CLONE) {
				t.setStartAfter(startAncestor);
				t.collapse(TRUE);
			}

			return frag;
		};

		function _traverseCommonAncestors(startAncestor, endAncestor, how) {
			var n, frag, commonParent, startOffset, endOffset, cnt, sibling, nextSibling;

			if (how != DELETE)
				frag = createDocumentFragment();

			n = _traverseLeftBoundary(startAncestor, how);
			if (frag)
				frag.appendChild(n);

			commonParent = startAncestor.parentNode;
			startOffset = nodeIndex(startAncestor);
			endOffset = nodeIndex(endAncestor);
			++startOffset;

			cnt = endOffset - startOffset;
			sibling = startAncestor.nextSibling;

			while (cnt > 0) {
				nextSibling = sibling.nextSibling;
				n = _traverseFullySelected(sibling, how);

				if (frag)
					frag.appendChild(n);

				sibling = nextSibling;
				--cnt;
			}

			n = _traverseRightBoundary(endAncestor, how);

			if (frag)
				frag.appendChild(n);

			if (how != CLONE) {
				t.setStartAfter(startAncestor);
				t.collapse(TRUE);
			}

			return frag;
		};

		function _traverseRightBoundary(root, how) {
			var next = _getSelectedNode(t[END_CONTAINER], t[END_OFFSET] - 1), parent, clonedParent, prevSibling, clonedChild, clonedGrandParent, isFullySelected = next != t[END_CONTAINER];

			if (next == root)
				return _traverseNode(next, isFullySelected, FALSE, how);

			parent = next.parentNode;
			clonedParent = _traverseNode(parent, FALSE, FALSE, how);

			while (parent) {
				while (next) {
					prevSibling = next.previousSibling;
					clonedChild = _traverseNode(next, isFullySelected, FALSE, how);

					if (how != DELETE)
						clonedParent.insertBefore(clonedChild, clonedParent.firstChild);

					isFullySelected = TRUE;
					next = prevSibling;
				}

				if (parent == root)
					return clonedParent;

				next = parent.previousSibling;
				parent = parent.parentNode;

				clonedGrandParent = _traverseNode(parent, FALSE, FALSE, how);

				if (how != DELETE)
					clonedGrandParent.appendChild(clonedParent);

				clonedParent = clonedGrandParent;
			}
		};

		function _traverseLeftBoundary(root, how) {
			var next = _getSelectedNode(t[START_CONTAINER], t[START_OFFSET]), isFullySelected = next != t[START_CONTAINER], parent, clonedParent, nextSibling, clonedChild, clonedGrandParent;

			if (next == root)
				return _traverseNode(next, isFullySelected, TRUE, how);

			parent = next.parentNode;
			clonedParent = _traverseNode(parent, FALSE, TRUE, how);

			while (parent) {
				while (next) {
					nextSibling = next.nextSibling;
					clonedChild = _traverseNode(next, isFullySelected, TRUE, how);

					if (how != DELETE)
						clonedParent.appendChild(clonedChild);

					isFullySelected = TRUE;
					next = nextSibling;
				}

				if (parent == root)
					return clonedParent;

				next = parent.nextSibling;
				parent = parent.parentNode;

				clonedGrandParent = _traverseNode(parent, FALSE, TRUE, how);

				if (how != DELETE)
					clonedGrandParent.appendChild(clonedParent);

				clonedParent = clonedGrandParent;
			}
		};

		function _traverseNode(n, isFullySelected, isLeft, how) {
			var txtValue, newNodeValue, oldNodeValue, offset, newNode;

			if (isFullySelected)
				return _traverseFullySelected(n, how);

			if (n.nodeType == 3 /* TEXT_NODE */) {
				txtValue = n.nodeValue;

				if (isLeft) {
					offset = t[START_OFFSET];
					newNodeValue = txtValue.substring(offset);
					oldNodeValue = txtValue.substring(0, offset);
				} else {
					offset = t[END_OFFSET];
					newNodeValue = txtValue.substring(0, offset);
					oldNodeValue = txtValue.substring(offset);
				}

				if (how != CLONE)
					n.nodeValue = oldNodeValue;

				if (how == DELETE)
					return;

				newNode = dom.clone(n, FALSE);
				newNode.nodeValue = newNodeValue;

				return newNode;
			}

			if (how == DELETE)
				return;

			return dom.clone(n, FALSE);
		};

		function _traverseFullySelected(n, how) {
			if (how != DELETE)
				return how == CLONE ? dom.clone(n, TRUE) : n;

			n.parentNode.removeChild(n);
		};

		function toStringIE() {
			return dom.create('body', null, cloneContents()).outerText;
		}
		
		return t;
	};

	ns.Range = Range;

	// Older IE versions doesn't let you override toString by it's constructor so we have to stick it in the prototype
	Range.prototype.toString = function() {
		return this.toStringIE();
	};
})(tinymce.dom);

(function() {
	function Selection(selection) {
		var self = this, dom = selection.dom, TRUE = true, FALSE = false;

		function getPosition(rng, start) {
			var checkRng, startIndex = 0, endIndex, inside,
				children, child, offset, index, position = -1, parent;

			// Setup test range, collapse it and get the parent
			checkRng = rng.duplicate();
			checkRng.collapse(start);
			parent = checkRng.parentElement();

			// Check if the selection is within the right document
			if (parent.ownerDocument !== selection.dom.doc)
				return;

			// IE will report non editable elements as it's parent so look for an editable one
			while (parent.contentEditable === "false") {
				parent = parent.parentNode;
			}

			// If parent doesn't have any children then return that we are inside the element
			if (!parent.hasChildNodes()) {
				return {node : parent, inside : 1};
			}

			// Setup node list and endIndex
			children = parent.children;
			endIndex = children.length - 1;

			// Perform a binary search for the position
			while (startIndex <= endIndex) {
				index = Math.floor((startIndex + endIndex) / 2);

				// Move selection to node and compare the ranges
				child = children[index];
				checkRng.moveToElementText(child);
				position = checkRng.compareEndPoints(start ? 'StartToStart' : 'EndToEnd', rng);

				// Before/after or an exact match
				if (position > 0) {
					endIndex = index - 1;
				} else if (position < 0) {
					startIndex = index + 1;
				} else {
					return {node : child};
				}
			}

			// Check if child position is before or we didn't find a position
			if (position < 0) {
				// No element child was found use the parent element and the offset inside that
				if (!child) {
					checkRng.moveToElementText(parent);
					checkRng.collapse(true);
					child = parent;
					inside = true;
				} else
					checkRng.collapse(false);

				// Walk character by character in text node until we hit the selected range endpoint, hit the end of document or parent isn't the right one
				// We need to walk char by char since rng.text or rng.htmlText will trim line endings
				offset = 0;
				while (checkRng.compareEndPoints(start ? 'StartToStart' : 'StartToEnd', rng) !== 0) {
					if (checkRng.move('character', 1) === 0 || parent != checkRng.parentElement()) {
						break;
					}

					offset++;
				}
			} else {
				// Child position is after the selection endpoint
				checkRng.collapse(true);

				// Walk character by character in text node until we hit the selected range endpoint, hit the end of document or parent isn't the right one
				offset = 0;
				while (checkRng.compareEndPoints(start ? 'StartToStart' : 'StartToEnd', rng) !== 0) {
					if (checkRng.move('character', -1) === 0 || parent != checkRng.parentElement()) {
						break;
					}

					offset++;
				}
			}

			return {node : child, position : position, offset : offset, inside : inside};
		};

		// Returns a W3C DOM compatible range object by using the IE Range API
		function getRange() {
			var ieRange = selection.getRng(), domRange = dom.createRng(), element, collapsed, tmpRange, element2, bookmark, fail;

			// If selection is outside the current document just return an empty range
			element = ieRange.item ? ieRange.item(0) : ieRange.parentElement();
			if (element.ownerDocument != dom.doc)
				return domRange;

			collapsed = selection.isCollapsed();

			// Handle control selection
			if (ieRange.item) {
				domRange.setStart(element.parentNode, dom.nodeIndex(element));
				domRange.setEnd(domRange.startContainer, domRange.startOffset + 1);

				return domRange;
			}

			function findEndPoint(start) {
				var endPoint = getPosition(ieRange, start), container, offset, textNodeOffset = 0, sibling, undef, nodeValue;

				container = endPoint.node;
				offset = endPoint.offset;

				if (endPoint.inside && !container.hasChildNodes()) {
					domRange[start ? 'setStart' : 'setEnd'](container, 0);
					return;
				}

				if (offset === undef) {
					domRange[start ? 'setStartBefore' : 'setEndAfter'](container);
					return;
				}

				if (endPoint.position < 0) {
					sibling = endPoint.inside ? container.firstChild : container.nextSibling;

					if (!sibling) {
						domRange[start ? 'setStartAfter' : 'setEndAfter'](container);
						return;
					}

					if (!offset) {
						if (sibling.nodeType == 3)
							domRange[start ? 'setStart' : 'setEnd'](sibling, 0);
						else
							domRange[start ? 'setStartBefore' : 'setEndBefore'](sibling);

						return;
					}

					// Find the text node and offset
					while (sibling) {
						nodeValue = sibling.nodeValue;
						textNodeOffset += nodeValue.length;

						// We are at or passed the position we where looking for
						if (textNodeOffset >= offset) {
							container = sibling;
							textNodeOffset -= offset;
							textNodeOffset = nodeValue.length - textNodeOffset;
							break;
						}

						sibling = sibling.nextSibling;
					}
				} else {
					// Find the text node and offset
					sibling = container.previousSibling;

					if (!sibling)
						return domRange[start ? 'setStartBefore' : 'setEndBefore'](container);

					// If there isn't any text to loop then use the first position
					if (!offset) {
						if (container.nodeType == 3)
							domRange[start ? 'setStart' : 'setEnd'](sibling, container.nodeValue.length);
						else
							domRange[start ? 'setStartAfter' : 'setEndAfter'](sibling);

						return;
					}

					while (sibling) {
						textNodeOffset += sibling.nodeValue.length;

						// We are at or passed the position we where looking for
						if (textNodeOffset >= offset) {
							container = sibling;
							textNodeOffset -= offset;
							break;
						}

						sibling = sibling.previousSibling;
					}
				}

				domRange[start ? 'setStart' : 'setEnd'](container, textNodeOffset);
			};

			try {
				// Find start point
				findEndPoint(true);

				// Find end point if needed
				if (!collapsed)
					findEndPoint();
			} catch (ex) {
				// IE has a nasty bug where text nodes might throw "invalid argument" when you
				// access the nodeValue or other properties of text nodes. This seems to happend when
				// text nodes are split into two nodes by a delete/backspace call. So lets detect it and try to fix it.
				if (ex.number == -2147024809) {
					// Get the current selection
					bookmark = self.getBookmark(2);

					// Get start element
					tmpRange = ieRange.duplicate();
					tmpRange.collapse(true);
					element = tmpRange.parentElement();

					// Get end element
					if (!collapsed) {
						tmpRange = ieRange.duplicate();
						tmpRange.collapse(false);
						element2 = tmpRange.parentElement();
						element2.innerHTML = element2.innerHTML;
					}

					// Remove the broken elements
					element.innerHTML = element.innerHTML;

					// Restore the selection
					self.moveToBookmark(bookmark);

					// Since the range has moved we need to re-get it
					ieRange = selection.getRng();

					// Find start point
					findEndPoint(true);

					// Find end point if needed
					if (!collapsed)
						findEndPoint();
				} else
					throw ex; // Throw other errors
			}

			return domRange;
		};

		this.getBookmark = function(type) {
			var rng = selection.getRng(), start, end, bookmark = {};

			function getIndexes(node) {
				var parent, root, children, i, indexes = [];

				parent = node.parentNode;
				root = dom.getRoot().parentNode;

				while (parent != root && parent.nodeType !== 9) {
					children = parent.children;

					i = children.length;
					while (i--) {
						if (node === children[i]) {
							indexes.push(i);
							break;
						}
					}

					node = parent;
					parent = parent.parentNode;
				}

				return indexes;
			};

			function getBookmarkEndPoint(start) {
				var position;

				position = getPosition(rng, start);
				if (position) {
					return {
						position : position.position,
						offset : position.offset,
						indexes : getIndexes(position.node),
						inside : position.inside
					};
				}
			};

			// Non ubstructive bookmark
			if (type === 2) {
				// Handle text selection
				if (!rng.item) {
					bookmark.start = getBookmarkEndPoint(true);

					if (!selection.isCollapsed())
						bookmark.end = getBookmarkEndPoint();
				} else
					bookmark.start = {ctrl : true, indexes : getIndexes(rng.item(0))};
			}

			return bookmark;
		};

		this.moveToBookmark = function(bookmark) {
			var rng, body = dom.doc.body;

			function resolveIndexes(indexes) {
				var node, i, idx, children;

				node = dom.getRoot();
				for (i = indexes.length - 1; i >= 0; i--) {
					children = node.children;
					idx = indexes[i];

					if (idx <= children.length - 1) {
						node = children[idx];
					}
				}

				return node;
			};
			
			function setBookmarkEndPoint(start) {
				var endPoint = bookmark[start ? 'start' : 'end'], moveLeft, moveRng, undef;

				if (endPoint) {
					moveLeft = endPoint.position > 0;

					moveRng = body.createTextRange();
					moveRng.moveToElementText(resolveIndexes(endPoint.indexes));

					offset = endPoint.offset;
					if (offset !== undef) {
						moveRng.collapse(endPoint.inside || moveLeft);
						moveRng.moveStart('character', moveLeft ? -offset : offset);
					} else
						moveRng.collapse(start);

					rng.setEndPoint(start ? 'StartToStart' : 'EndToStart', moveRng);

					if (start)
						rng.collapse(true);
				}
			};

			if (bookmark.start) {
				if (bookmark.start.ctrl) {
					rng = body.createControlRange();
					rng.addElement(resolveIndexes(bookmark.start.indexes));
					rng.select();
				} else {
					rng = body.createTextRange();
					setBookmarkEndPoint(true);
					setBookmarkEndPoint();
					rng.select();
				}
			}
		};

		this.addRange = function(rng) {
			var ieRng, ctrlRng, startContainer, startOffset, endContainer, endOffset, sibling,
				doc = selection.dom.doc, body = doc.body, nativeRng, ctrlElm;

			function setEndPoint(start) {
				var container, offset, marker, tmpRng, nodes;

				marker = dom.create('a');
				container = start ? startContainer : endContainer;
				offset = start ? startOffset : endOffset;
				tmpRng = ieRng.duplicate();

				if (container == doc || container == doc.documentElement) {
					container = body;
					offset = 0;
				}

				if (container.nodeType == 3) {
					container.parentNode.insertBefore(marker, container);
					tmpRng.moveToElementText(marker);
					tmpRng.moveStart('character', offset);
					dom.remove(marker);
					ieRng.setEndPoint(start ? 'StartToStart' : 'EndToEnd', tmpRng);
				} else {
					nodes = container.childNodes;

					if (nodes.length) {
						if (offset >= nodes.length) {
							dom.insertAfter(marker, nodes[nodes.length - 1]);
						} else {
							container.insertBefore(marker, nodes[offset]);
						}

						tmpRng.moveToElementText(marker);
					} else if (container.canHaveHTML) {
						// Empty node selection for example <div>|</div>
						// Setting innerHTML with a span marker then remove that marker seems to keep empty block elements open
						container.innerHTML = '<span>\uFEFF</span>';
						marker = container.firstChild;
						tmpRng.moveToElementText(marker);
						tmpRng.collapse(FALSE); // Collapse false works better than true for some odd reason
					}

					ieRng.setEndPoint(start ? 'StartToStart' : 'EndToEnd', tmpRng);
					dom.remove(marker);
				}
			}

			// Setup some shorter versions
			startContainer = rng.startContainer;
			startOffset = rng.startOffset;
			endContainer = rng.endContainer;
			endOffset = rng.endOffset;
			ieRng = body.createTextRange();

			// If single element selection then try making a control selection out of it
			if (startContainer == endContainer && startContainer.nodeType == 1) {
				// Trick to place the caret inside an empty block element like <p></p>
				if (startOffset == endOffset && !startContainer.hasChildNodes()) {
					if (startContainer.canHaveHTML) {
						// Check if previous sibling is an empty block if it is then we need to render it
						// IE would otherwise move the caret into the sibling instead of the empty startContainer see: #5236
						// Example this: <p></p><p>|</p> would become this: <p>|</p><p></p>
						sibling = startContainer.previousSibling;
						if (sibling && !sibling.hasChildNodes() && dom.isBlock(sibling)) {
							sibling.innerHTML = '\uFEFF';
						} else {
							sibling = null;
						}

						startContainer.innerHTML = '<span>\uFEFF</span><span>\uFEFF</span>';
						ieRng.moveToElementText(startContainer.lastChild);
						ieRng.select();
						dom.doc.selection.clear();
						startContainer.innerHTML = '';

						if (sibling) {
							sibling.innerHTML = '';
						}
						return;
					} else {
						startOffset = dom.nodeIndex(startContainer);
						startContainer = startContainer.parentNode;
					}
				}

				if (startOffset == endOffset - 1) {
					try {
						ctrlElm = startContainer.childNodes[startOffset];
						ctrlRng = body.createControlRange();
						ctrlRng.addElement(ctrlElm);
						ctrlRng.select();

						// Check if the range produced is on the correct element and is a control range
						// On IE 8 it will select the parent contentEditable container if you select an inner element see: #5398
						nativeRng = selection.getRng();
						if (nativeRng.item && ctrlElm === nativeRng.item(0)) {
							return;
						}
					} catch (ex) {
						// Ignore
					}
				}
			}

			// Set start/end point of selection
			setEndPoint(true);
			setEndPoint();

			// Select the new range and scroll it into view
			ieRng.select();
		};

		// Expose range method
		this.getRangeAt = getRange;
	};

	// Expose the selection object
	tinymce.dom.TridentSelection = Selection;
})();


(function(tinymce) {
	tinymce.dom.Element = function(id, settings) {
		var t = this, dom, el;

		t.settings = settings = settings || {};
		t.id = id;
		t.dom = dom = settings.dom || tinymce.DOM;

		// Only IE leaks DOM references, this is a lot faster
		if (!tinymce.isIE)
			el = dom.get(t.id);

		tinymce.each(
				('getPos,getRect,getParent,add,setStyle,getStyle,setStyles,' + 
				'setAttrib,setAttribs,getAttrib,addClass,removeClass,' + 
				'hasClass,getOuterHTML,setOuterHTML,remove,show,hide,' + 
				'isHidden,setHTML,get').split(/,/), function(k) {
					t[k] = function() {
						var a = [id], i;

						for (i = 0; i < arguments.length; i++)
							a.push(arguments[i]);

						a = dom[k].apply(dom, a);
						t.update(k);

						return a;
					};
			}
		);

		tinymce.extend(t, {
			on : function(n, f, s) {
				return tinymce.dom.Event.add(t.id, n, f, s);
			},

			getXY : function() {
				return {
					x : parseInt(t.getStyle('left')),
					y : parseInt(t.getStyle('top'))
				};
			},

			getSize : function() {
				var n = dom.get(t.id);

				return {
					w : parseInt(t.getStyle('width') || n.clientWidth),
					h : parseInt(t.getStyle('height') || n.clientHeight)
				};
			},

			moveTo : function(x, y) {
				t.setStyles({left : x, top : y});
			},

			moveBy : function(x, y) {
				var p = t.getXY();

				t.moveTo(p.x + x, p.y + y);
			},

			resizeTo : function(w, h) {
				t.setStyles({width : w, height : h});
			},

			resizeBy : function(w, h) {
				var s = t.getSize();

				t.resizeTo(s.w + w, s.h + h);
			},

			update : function(k) {
				var b;

				if (tinymce.isIE6 && settings.blocker) {
					k = k || '';

					// Ignore getters
					if (k.indexOf('get') === 0 || k.indexOf('has') === 0 || k.indexOf('is') === 0)
						return;

					// Remove blocker on remove
					if (k == 'remove') {
						dom.remove(t.blocker);
						return;
					}

					if (!t.blocker) {
						t.blocker = dom.uniqueId();
						b = dom.add(settings.container || dom.getRoot(), 'iframe', {id : t.blocker, style : 'position:absolute;', frameBorder : 0, src : 'javascript:""'});
						dom.setStyle(b, 'opacity', 0);
					} else
						b = dom.get(t.blocker);

					dom.setStyles(b, {
						left : t.getStyle('left', 1),
						top : t.getStyle('top', 1),
						width : t.getStyle('width', 1),
						height : t.getStyle('height', 1),
						display : t.getStyle('display', 1),
						zIndex : parseInt(t.getStyle('zIndex', 1) || 0) - 1
					});
				}
			}
		});
	};
})(tinymce);

(function(tinymce) {
	function trimNl(s) {
		return s.replace(/[\n\r]+/g, '');
	};

	// Shorten names
	var is = tinymce.is, isIE = tinymce.isIE, each = tinymce.each, TreeWalker = tinymce.dom.TreeWalker;

	tinymce.create('tinymce.dom.Selection', {
		Selection : function(dom, win, serializer, editor) {
			var t = this;

			t.dom = dom;
			t.win = win;
			t.serializer = serializer;
			t.editor = editor;

			// Add events
			each([
				'onBeforeSetContent',

				'onBeforeGetContent',

				'onSetContent',

				'onGetContent'
			], function(e) {
				t[e] = new tinymce.util.Dispatcher(t);
			});

			// No W3C Range support
			if (!t.win.getSelection)
				t.tridentSel = new tinymce.dom.TridentSelection(t);

			if (tinymce.isIE && dom.boxModel)
				this._fixIESelection();

			// Prevent leaks
			tinymce.addUnload(t.destroy, t);
		},

		setCursorLocation: function(node, offset) {
			var t = this; var r = t.dom.createRng();
			r.setStart(node, offset);
			r.setEnd(node, offset);
			t.setRng(r);
			t.collapse(false);
		},
		getContent : function(s) {
			var t = this, r = t.getRng(), e = t.dom.create("body"), se = t.getSel(), wb, wa, n;

			s = s || {};
			wb = wa = '';
			s.get = true;
			s.format = s.format || 'html';
			s.forced_root_block = '';
			t.onBeforeGetContent.dispatch(t, s);

			if (s.format == 'text')
				return t.isCollapsed() ? '' : (r.text || (se.toString ? se.toString() : ''));

			if (r.cloneContents) {
				n = r.cloneContents();

				if (n)
					e.appendChild(n);
			} else if (is(r.item) || is(r.htmlText)) {
				// IE will produce invalid markup if elements are present that
				// it doesn't understand like custom elements or HTML5 elements.
				// Adding a BR in front of the contents and then remoiving it seems to fix it though.
				e.innerHTML = '<br>' + (r.item ? r.item(0).outerHTML : r.htmlText);
				e.removeChild(e.firstChild);
			} else
				e.innerHTML = r.toString();

			// Keep whitespace before and after
			if (/^\s/.test(e.innerHTML))
				wb = ' ';

			if (/\s+$/.test(e.innerHTML))
				wa = ' ';

			s.getInner = true;

			s.content = t.isCollapsed() ? '' : wb + t.serializer.serialize(e, s) + wa;
			t.onGetContent.dispatch(t, s);

			return s.content;
		},

		setContent : function(content, args) {
			var self = this, rng = self.getRng(), caretNode, doc = self.win.document, frag, temp;

			args = args || {format : 'html'};
			args.set = true;
			content = args.content = content;

			// Dispatch before set content event
			if (!args.no_events)
				self.onBeforeSetContent.dispatch(self, args);

			content = args.content;

			if (rng.insertNode) {
				// Make caret marker since insertNode places the caret in the beginning of text after insert
				content += '<span id="__caret">_</span>';

				// Delete and insert new node
				if (rng.startContainer == doc && rng.endContainer == doc) {
					// WebKit will fail if the body is empty since the range is then invalid and it can't insert contents
					doc.body.innerHTML = content;
				} else {
					rng.deleteContents();

					if (doc.body.childNodes.length === 0) {
						doc.body.innerHTML = content;
					} else {
						// createContextualFragment doesn't exists in IE 9 DOMRanges
						if (rng.createContextualFragment) {
							rng.insertNode(rng.createContextualFragment(content));
						} else {
							// Fake createContextualFragment call in IE 9
							frag = doc.createDocumentFragment();
							temp = doc.createElement('div');

							frag.appendChild(temp);
							temp.outerHTML = content;

							rng.insertNode(frag);
						}
					}
				}

				// Move to caret marker
				caretNode = self.dom.get('__caret');

				// Make sure we wrap it compleatly, Opera fails with a simple select call
				rng = doc.createRange();
				rng.setStartBefore(caretNode);
				rng.setEndBefore(caretNode);
				self.setRng(rng);

				// Remove the caret position
				self.dom.remove('__caret');

				try {
					self.setRng(rng);
				} catch (ex) {
					// Might fail on Opera for some odd reason
				}
			} else {
				if (rng.item) {
					// Delete content and get caret text selection
					doc.execCommand('Delete', false, null);
					rng = self.getRng();
				}

				// Explorer removes spaces from the beginning of pasted contents
				if (/^\s+/.test(content)) {
					rng.pasteHTML('<span id="__mce_tmp">_</span>' + content);
					self.dom.remove('__mce_tmp');
				} else
					rng.pasteHTML(content);
			}

			// Dispatch set content event
			if (!args.no_events)
				self.onSetContent.dispatch(self, args);
		},

		getStart : function() {
			var self = this, rng = self.getRng(), startElement, parentElement, checkRng, node;

			if (rng.duplicate || rng.item) {
				// Control selection, return first item
				if (rng.item)
					return rng.item(0);

				// Get start element
				checkRng = rng.duplicate();
				checkRng.collapse(1);
				startElement = checkRng.parentElement();
				if (startElement.ownerDocument !== self.dom.doc) {
					startElement = self.dom.getRoot();
				}

				// Check if range parent is inside the start element, then return the inner parent element
				// This will fix issues when a single element is selected, IE would otherwise return the wrong start element
				parentElement = node = rng.parentElement();
				while (node = node.parentNode) {
					if (node == startElement) {
						startElement = parentElement;
						break;
					}
				}

				return startElement;
			} else {
				startElement = rng.startContainer;

				if (startElement.nodeType == 1 && startElement.hasChildNodes())
					startElement = startElement.childNodes[Math.min(startElement.childNodes.length - 1, rng.startOffset)];

				if (startElement && startElement.nodeType == 3)
					return startElement.parentNode;

				return startElement;
			}
		},

		getEnd : function() {
			var self = this, rng = self.getRng(), endElement, endOffset;

			if (rng.duplicate || rng.item) {
				if (rng.item)
					return rng.item(0);

				rng = rng.duplicate();
				rng.collapse(0);
				endElement = rng.parentElement();
				if (endElement.ownerDocument !== self.dom.doc) {
					endElement = self.dom.getRoot();
				}

				if (endElement && endElement.nodeName == 'BODY')
					return endElement.lastChild || endElement;

				return endElement;
			} else {
				endElement = rng.endContainer;
				endOffset = rng.endOffset;

				if (endElement.nodeType == 1 && endElement.hasChildNodes())
					endElement = endElement.childNodes[endOffset > 0 ? endOffset - 1 : endOffset];

				if (endElement && endElement.nodeType == 3)
					return endElement.parentNode;

				return endElement;
			}
		},

		getBookmark : function(type, normalized) {
			var t = this, dom = t.dom, rng, rng2, id, collapsed, name, element, index, chr = '\uFEFF', styles;

			function findIndex(name, element) {
				var index = 0;

				each(dom.select(name), function(node, i) {
					if (node == element)
						index = i;
				});

				return index;
			};

			function normalizeTableCellSelection(rng) {
				function moveEndPoint(start) {
					var container, offset, childNodes, prefix = start ? 'start' : 'end';

					container = rng[prefix + 'Container'];
					offset = rng[prefix + 'Offset'];

					if (container.nodeType == 1 && container.nodeName == "TR") {
						childNodes = container.childNodes;
						container = childNodes[Math.min(start ? offset : offset - 1, childNodes.length - 1)];
						if (container) {
							offset = start ? 0 : container.childNodes.length;
							rng['set' + (start ? 'Start' : 'End')](container, offset);
						}
					}
				};

				moveEndPoint(true);
				moveEndPoint();

				return rng;
			};

			function getLocation() {
				var rng = t.getRng(true), root = dom.getRoot(), bookmark = {};

				function getPoint(rng, start) {
					var container = rng[start ? 'startContainer' : 'endContainer'],
						offset = rng[start ? 'startOffset' : 'endOffset'], point = [], node, childNodes, after = 0;

					if (container.nodeType == 3) {
						if (normalized) {
							for (node = container.previousSibling; node && node.nodeType == 3; node = node.previousSibling)
								offset += node.nodeValue.length;
						}

						point.push(offset);
					} else {
						childNodes = container.childNodes;

						if (offset >= childNodes.length && childNodes.length) {
							after = 1;
							offset = Math.max(0, childNodes.length - 1);
						}

						point.push(t.dom.nodeIndex(childNodes[offset], normalized) + after);
					}

					for (; container && container != root; container = container.parentNode)
						point.push(t.dom.nodeIndex(container, normalized));

					return point;
				};

				bookmark.start = getPoint(rng, true);

				if (!t.isCollapsed())
					bookmark.end = getPoint(rng);

				return bookmark;
			};

			if (type == 2) {
				if (t.tridentSel)
					return t.tridentSel.getBookmark(type);

				return getLocation();
			}

			// Handle simple range
			if (type)
				return {rng : t.getRng()};

			rng = t.getRng();
			id = dom.uniqueId();
			collapsed = tinyMCE.activeEditor.selection.isCollapsed();
			styles = 'overflow:hidden;line-height:0px';

			// Explorer method
			if (rng.duplicate || rng.item) {
				// Text selection
				if (!rng.item) {
					rng2 = rng.duplicate();

					try {
						// Insert start marker
						rng.collapse();
						rng.pasteHTML('<span data-mce-type="bookmark" id="' + id + '_start" style="' + styles + '">' + chr + '</span>');

						// Insert end marker
						if (!collapsed) {
							rng2.collapse(false);

							// Detect the empty space after block elements in IE and move the end back one character <p></p>] becomes <p>]</p>
							rng.moveToElementText(rng2.parentElement());
							if (rng.compareEndPoints('StartToEnd', rng2) === 0)
								rng2.move('character', -1);

							rng2.pasteHTML('<span data-mce-type="bookmark" id="' + id + '_end" style="' + styles + '">' + chr + '</span>');
						}
					} catch (ex) {
						// IE might throw unspecified error so lets ignore it
						return null;
					}
				} else {
					// Control selection
					element = rng.item(0);
					name = element.nodeName;

					return {name : name, index : findIndex(name, element)};
				}
			} else {
				element = t.getNode();
				name = element.nodeName;
				if (name == 'IMG')
					return {name : name, index : findIndex(name, element)};

				// W3C method
				rng2 = normalizeTableCellSelection(rng.cloneRange());

				// Insert end marker
				if (!collapsed) {
					rng2.collapse(false);
					rng2.insertNode(dom.create('span', {'data-mce-type' : "bookmark", id : id + '_end', style : styles}, chr));
				}

				rng = normalizeTableCellSelection(rng);
				rng.collapse(true);
				rng.insertNode(dom.create('span', {'data-mce-type' : "bookmark", id : id + '_start', style : styles}, chr));
			}

			t.moveToBookmark({id : id, keep : 1});

			return {id : id};
		},

		moveToBookmark : function(bookmark) {
			var t = this, dom = t.dom, marker1, marker2, rng, root, startContainer, endContainer, startOffset, endOffset;

			function setEndPoint(start) {
				var point = bookmark[start ? 'start' : 'end'], i, node, offset, children;

				if (point) {
					offset = point[0];

					// Find container node
					for (node = root, i = point.length - 1; i >= 1; i--) {
						children = node.childNodes;

						if (point[i] > children.length - 1)
							return;

						node = children[point[i]];
					}

					// Move text offset to best suitable location
					if (node.nodeType === 3)
						offset = Math.min(point[0], node.nodeValue.length);

					// Move element offset to best suitable location
					if (node.nodeType === 1)
						offset = Math.min(point[0], node.childNodes.length);

					// Set offset within container node
					if (start)
						rng.setStart(node, offset);
					else
						rng.setEnd(node, offset);
				}

				return true;
			};

			function restoreEndPoint(suffix) {
				var marker = dom.get(bookmark.id + '_' + suffix), node, idx, next, prev, keep = bookmark.keep;

				if (marker) {
					node = marker.parentNode;

					if (suffix == 'start') {
						if (!keep) {
							idx = dom.nodeIndex(marker);
						} else {
							node = marker.firstChild;
							idx = 1;
						}

						startContainer = endContainer = node;
						startOffset = endOffset = idx;
					} else {
						if (!keep) {
							idx = dom.nodeIndex(marker);
						} else {
							node = marker.firstChild;
							idx = 1;
						}

						endContainer = node;
						endOffset = idx;
					}

					if (!keep) {
						prev = marker.previousSibling;
						next = marker.nextSibling;

						// Remove all marker text nodes
						each(tinymce.grep(marker.childNodes), function(node) {
							if (node.nodeType == 3)
								node.nodeValue = node.nodeValue.replace(/\uFEFF/g, '');
						});

						// Remove marker but keep children if for example contents where inserted into the marker
						// Also remove duplicated instances of the marker for example by a split operation or by WebKit auto split on paste feature
						while (marker = dom.get(bookmark.id + '_' + suffix))
							dom.remove(marker, 1);

						// If siblings are text nodes then merge them unless it's Opera since it some how removes the node
						// and we are sniffing since adding a lot of detection code for a browser with 3% of the market isn't worth the effort. Sorry, Opera but it's just a fact
						if (prev && next && prev.nodeType == next.nodeType && prev.nodeType == 3 && !tinymce.isOpera) {
							idx = prev.nodeValue.length;
							prev.appendData(next.nodeValue);
							dom.remove(next);

							if (suffix == 'start') {
								startContainer = endContainer = prev;
								startOffset = endOffset = idx;
							} else {
								endContainer = prev;
								endOffset = idx;
							}
						}
					}
				}
			};

			function addBogus(node) {
				// Adds a bogus BR element for empty block elements
				if (dom.isBlock(node) && !node.innerHTML && !isIE)
					node.innerHTML = '<br data-mce-bogus="1" />';

				return node;
			};

			if (bookmark) {
				if (bookmark.start) {
					rng = dom.createRng();
					root = dom.getRoot();

					if (t.tridentSel)
						return t.tridentSel.moveToBookmark(bookmark);

					if (setEndPoint(true) && setEndPoint()) {
						t.setRng(rng);
					}
				} else if (bookmark.id) {
					// Restore start/end points
					restoreEndPoint('start');
					restoreEndPoint('end');

					if (startContainer) {
						rng = dom.createRng();
						rng.setStart(addBogus(startContainer), startOffset);
						rng.setEnd(addBogus(endContainer), endOffset);
						t.setRng(rng);
					}
				} else if (bookmark.name) {
					t.select(dom.select(bookmark.name)[bookmark.index]);
				} else if (bookmark.rng)
					t.setRng(bookmark.rng);
			}
		},

		select : function(node, content) {
			var t = this, dom = t.dom, rng = dom.createRng(), idx;

			function setPoint(node, start) {
				var walker = new TreeWalker(node, node);

				do {
					// Text node
					if (node.nodeType == 3 && tinymce.trim(node.nodeValue).length !== 0) {
						if (start)
							rng.setStart(node, 0);
						else
							rng.setEnd(node, node.nodeValue.length);

						return;
					}

					// BR element
					if (node.nodeName == 'BR') {
						if (start)
							rng.setStartBefore(node);
						else
							rng.setEndBefore(node);

						return;
					}
				} while (node = (start ? walker.next() : walker.prev()));
			};

			if (node) {
				idx = dom.nodeIndex(node);
				rng.setStart(node.parentNode, idx);
				rng.setEnd(node.parentNode, idx + 1);

				// Find first/last text node or BR element
				if (content) {
					setPoint(node, 1);
					setPoint(node);
				}

				t.setRng(rng);
			}

			return node;
		},

		isCollapsed : function() {
			var t = this, r = t.getRng(), s = t.getSel();

			if (!r || r.item)
				return false;

			if (r.compareEndPoints)
				return r.compareEndPoints('StartToEnd', r) === 0;

			return !s || r.collapsed;
		},

		collapse : function(to_start) {
			var self = this, rng = self.getRng(), node;

			// Control range on IE
			if (rng.item) {
				node = rng.item(0);
				rng = self.win.document.body.createTextRange();
				rng.moveToElementText(node);
			}

			rng.collapse(!!to_start);
			self.setRng(rng);
		},

		getSel : function() {
			var t = this, w = this.win;

			return w.getSelection ? w.getSelection() : w.document.selection;
		},

		getRng : function(w3c) {
			var self = this, selection, rng, elm, doc = self.win.document;

			// Found tridentSel object then we need to use that one
			if (w3c && self.tridentSel) {
				return self.tridentSel.getRangeAt(0);
			}

			try {
				if (selection = self.getSel()) {
					rng = selection.rangeCount > 0 ? selection.getRangeAt(0) : (selection.createRange ? selection.createRange() : doc.createRange());
				}
			} catch (ex) {
				// IE throws unspecified error here if TinyMCE is placed in a frame/iframe
			}

			// We have W3C ranges and it's IE then fake control selection since IE9 doesn't handle that correctly yet
			if (tinymce.isIE && rng && rng.setStart && doc.selection.createRange().item) {
				elm = doc.selection.createRange().item(0);
				rng = doc.createRange();
				rng.setStartBefore(elm);
				rng.setEndAfter(elm);
			}

			// No range found then create an empty one
			// This can occur when the editor is placed in a hidden container element on Gecko
			// Or on IE when there was an exception
			if (!rng) {
				rng = doc.createRange ? doc.createRange() : doc.body.createTextRange();
			}

			// If range is at start of document then move it to start of body
			if (rng.setStart && rng.startContainer.nodeType === 9 && rng.collapsed) {
				elm = self.dom.getRoot();
				rng.setStart(elm, 0);
				rng.setEnd(elm, 0);
			}

			if (self.selectedRange && self.explicitRange) {
				if (rng.compareBoundaryPoints(rng.START_TO_START, self.selectedRange) === 0 && rng.compareBoundaryPoints(rng.END_TO_END, self.selectedRange) === 0) {
					// Safari, Opera and Chrome only ever select text which causes the range to change.
					// This lets us use the originally set range if the selection hasn't been changed by the user.
					rng = self.explicitRange;
				} else {
					self.selectedRange = null;
					self.explicitRange = null;
				}
			}

			return rng;
		},

		setRng : function(r, forward) {
			var s, t = this;

			if (!t.tridentSel) {
				s = t.getSel();

				if (s) {
					t.explicitRange = r;

					try {
						s.removeAllRanges();
					} catch (ex) {
						// IE9 might throw errors here don't know why
					}

					s.addRange(r);

					// Forward is set to false and we have an extend function
					if (forward === false && s.extend) {
						s.collapse(r.endContainer, r.endOffset);
						s.extend(r.startContainer, r.startOffset);
					}

					// adding range isn't always successful so we need to check range count otherwise an exception can occur
					t.selectedRange = s.rangeCount > 0 ? s.getRangeAt(0) : null;
				}
			} else {
				// Is W3C Range
				if (r.cloneRange) {
					try {
						t.tridentSel.addRange(r);
						return;
					} catch (ex) {
						//IE9 throws an error here if called before selection is placed in the editor
					}
				}

				// Is IE specific range
				try {
					r.select();
				} catch (ex) {
					// Needed for some odd IE bug #1843306
				}
			}
		},

		setNode : function(n) {
			var t = this;

			t.setContent(t.dom.getOuterHTML(n));

			return n;
		},

		getNode : function() {
			var t = this, rng = t.getRng(), sel = t.getSel(), elm, start = rng.startContainer, end = rng.endContainer;

			function skipEmptyTextNodes(n, forwards) {
				var orig = n;
				while (n && n.nodeType === 3 && n.length === 0) {
					n = forwards ? n.nextSibling : n.previousSibling;
				}
				return n || orig;
			};

			// Range maybe lost after the editor is made visible again
			if (!rng)
				return t.dom.getRoot();

			if (rng.setStart) {
				elm = rng.commonAncestorContainer;

				// Handle selection a image or other control like element such as anchors
				if (!rng.collapsed) {
					if (rng.startContainer == rng.endContainer) {
						if (rng.endOffset - rng.startOffset < 2) {
							if (rng.startContainer.hasChildNodes())
								elm = rng.startContainer.childNodes[rng.startOffset];
						}
					}

					// If the anchor node is a element instead of a text node then return this element
					//if (tinymce.isWebKit && sel.anchorNode && sel.anchorNode.nodeType == 1)
					//	return sel.anchorNode.childNodes[sel.anchorOffset];

					// Handle cases where the selection is immediately wrapped around a node and return that node instead of it's parent.
					// This happens when you double click an underlined word in FireFox.
					if (start.nodeType === 3 && end.nodeType === 3) {
						if (start.length === rng.startOffset) {
							start = skipEmptyTextNodes(start.nextSibling, true);
						} else {
							start = start.parentNode;
						}
						if (rng.endOffset === 0) {
							end = skipEmptyTextNodes(end.previousSibling, false);
						} else {
							end = end.parentNode;
						}

						if (start && start === end)
							return start;
					}
				}

				if (elm && elm.nodeType == 3)
					return elm.parentNode;

				return elm;
			}

			return rng.item ? rng.item(0) : rng.parentElement();
		},

		getSelectedBlocks : function(st, en) {
			var t = this, dom = t.dom, sb, eb, n, bl = [];

			sb = dom.getParent(st || t.getStart(), dom.isBlock);
			eb = dom.getParent(en || t.getEnd(), dom.isBlock);

			if (sb)
				bl.push(sb);

			if (sb && eb && sb != eb) {
				n = sb;

				var walker = new TreeWalker(sb, dom.getRoot());
				while ((n = walker.next()) && n != eb) {
					if (dom.isBlock(n))
						bl.push(n);
				}
			}

			if (eb && sb != eb)
				bl.push(eb);

			return bl;
		},

		isForward: function(){
			var dom = this.dom, sel = this.getSel(), anchorRange, focusRange;

			// No support for selection direction then always return true
			if (!sel || sel.anchorNode == null || sel.focusNode == null) {
				return true;
			}

			anchorRange = dom.createRng();
			anchorRange.setStart(sel.anchorNode, sel.anchorOffset);
			anchorRange.collapse(true);

			focusRange = dom.createRng();
			focusRange.setStart(sel.focusNode, sel.focusOffset);
			focusRange.collapse(true);

			return anchorRange.compareBoundaryPoints(anchorRange.START_TO_START, focusRange) <= 0;
		},

		normalize : function() {
			var self = this, rng, normalized, collapsed, node, sibling;

			function normalizeEndPoint(start) {
				var container, offset, walker, dom = self.dom, body = dom.getRoot(), node, nonEmptyElementsMap, nodeName;

				function hasBrBeforeAfter(node, left) {
					var walker = new TreeWalker(node, dom.getParent(node.parentNode, dom.isBlock) || body);

					while (node = walker[left ? 'prev' : 'next']()) {
						if (node.nodeName === "BR") {
							return true;
						}
					}
				};

				// Walks the dom left/right to find a suitable text node to move the endpoint into
				// It will only walk within the current parent block or body and will stop if it hits a block or a BR/IMG
				function findTextNodeRelative(left, startNode) {
					var walker, lastInlineElement;

					startNode = startNode || container;
					walker = new TreeWalker(startNode, dom.getParent(startNode.parentNode, dom.isBlock) || body);

					// Walk left until we hit a text node we can move to or a block/br/img
					while (node = walker[left ? 'prev' : 'next']()) {
						// Found text node that has a length
						if (node.nodeType === 3 && node.nodeValue.length > 0) {
							container = node;
							offset = left ? node.nodeValue.length : 0;
							normalized = true;
							return;
						}

						// Break if we find a block or a BR/IMG/INPUT etc
						if (dom.isBlock(node) || nonEmptyElementsMap[node.nodeName.toLowerCase()]) {
							return;
						}

						lastInlineElement = node;
					}

					// Only fetch the last inline element when in caret mode for now
					if (collapsed && lastInlineElement) {
						container = lastInlineElement;
						normalized = true;
						offset = 0;
					}
				};

				container = rng[(start ? 'start' : 'end') + 'Container'];
				offset = rng[(start ? 'start' : 'end') + 'Offset'];
				nonEmptyElementsMap = dom.schema.getNonEmptyElements();

				// If the container is a document move it to the body element
				if (container.nodeType === 9) {
					container = dom.getRoot();
					offset = 0;
				}

				// If the container is body try move it into the closest text node or position
				if (container === body) {
					// If start is before/after a image, table etc
					if (start) {
						node = container.childNodes[offset > 0 ? offset - 1 : 0];
						if (node) {
							nodeName = node.nodeName.toLowerCase();
							if (nonEmptyElementsMap[node.nodeName] || node.nodeName == "TABLE") {
								return;
							}
						}
					}

					// Resolve the index
					if (container.hasChildNodes()) {
						container = container.childNodes[Math.min(!start && offset > 0 ? offset - 1 : offset, container.childNodes.length - 1)];
						offset = 0;

						// Don't walk into elements that doesn't have any child nodes like a IMG
						if (container.hasChildNodes() && !/TABLE/.test(container.nodeName)) {
							// Walk the DOM to find a text node to place the caret at or a BR
							node = container;
							walker = new TreeWalker(container, body);

							do {
								// Found a text node use that position
								if (node.nodeType === 3 && node.nodeValue.length > 0) {
									offset = start ? 0 : node.nodeValue.length;
									container = node;
									normalized = true;
									break;
								}

								// Found a BR/IMG element that we can place the caret before
								if (nonEmptyElementsMap[node.nodeName.toLowerCase()]) {
									offset = dom.nodeIndex(node);
									container = node.parentNode;

									// Put caret after image when moving the end point
									if (node.nodeName ==  "IMG" && !start) {
										offset++;
									}

									normalized = true;
									break;
								}
							} while (node = (start ? walker.next() : walker.prev()));
						}
					}
				}

				// Lean the caret to the left if possible
				if (collapsed) {
					// So this: <b>x</b><i>|x</i>
					// Becomes: <b>x|</b><i>x</i>
					// Seems that only gecko has issues with this
					if (container.nodeType === 3 && offset === 0) {
						findTextNodeRelative(true);
					}

					// Lean left into empty inline elements when the caret is before a BR
					// So this: <i><b></b><i>|<br></i>
					// Becomes: <i><b>|</b><i><br></i>
					// Seems that only gecko has issues with this
					if (container.nodeType === 1) {
						node = container.childNodes[offset];
						if(node && node.nodeName === 'BR' && !hasBrBeforeAfter(node) && !hasBrBeforeAfter(node, true)) {
							findTextNodeRelative(true, container.childNodes[offset]);
						}
					}
				}

				// Lean the start of the selection right if possible
				// So this: x[<b>x]</b>
				// Becomes: x<b>[x]</b>
				if (start && !collapsed && container.nodeType === 3 && offset === container.nodeValue.length) {
					findTextNodeRelative(false);
				}

				// Set endpoint if it was normalized
				if (normalized)
					rng['set' + (start ? 'Start' : 'End')](container, offset);
			};

			// Normalize only on non IE browsers for now
			if (tinymce.isIE)
				return;
			
			rng = self.getRng();
			collapsed = rng.collapsed;

			// Normalize the end points
			normalizeEndPoint(true);

			if (!collapsed)
				normalizeEndPoint();

			// Set the selection if it was normalized
			if (normalized) {
				// If it was collapsed then make sure it still is
				if (collapsed) {
					rng.collapse(true);
				}

				//console.log(self.dom.dumpRng(rng));
				self.setRng(rng, self.isForward());
			}
		},

		selectorChanged: function(selector, callback) {
			var self = this, currentSelectors;

			if (!self.selectorChangedData) {
				self.selectorChangedData = {};
				currentSelectors = {};

				self.editor.onNodeChange.addToTop(function(ed, cm, node) {
					var dom = self.dom, parents = dom.getParents(node, null, dom.getRoot()), matchedSelectors = {};

					// Check for new matching selectors
					each(self.selectorChangedData, function(callbacks, selector) {
						each(parents, function(node) {
							if (dom.is(node, selector)) {
								if (!currentSelectors[selector]) {
									// Execute callbacks
									each(callbacks, function(callback) {
										callback(true, {node: node, selector: selector, parents: parents});
									});

									currentSelectors[selector] = callbacks;
								}

								matchedSelectors[selector] = callbacks;
								return false;
							}
						});
					});

					// Check if current selectors still match
					each(currentSelectors, function(callbacks, selector) {
						if (!matchedSelectors[selector]) {
							delete currentSelectors[selector];

							each(callbacks, function(callback) {
								callback(false, {node: node, selector: selector, parents: parents});
							});
						}
					});
				});
			}

			// Add selector listeners
			if (!self.selectorChangedData[selector]) {
				self.selectorChangedData[selector] = [];
			}

			self.selectorChangedData[selector].push(callback);

			return self;
		},

		scrollIntoView: function(elm) {
			var y, viewPort, self = this, dom = self.dom;

			viewPort = dom.getViewPort(self.editor.getWin());
			y = dom.getPos(elm).y;
			if (y < viewPort.y || y + 25 > viewPort.y + viewPort.h) {
				self.editor.getWin().scrollTo(0, y < viewPort.y ? y : y - viewPort.h + 25);
			}
		},

		destroy : function(manual) {
			var self = this;

			self.win = null;

			// Manual destroy then remove unload handler
			if (!manual)
				tinymce.removeUnload(self.destroy);
		},

		// IE has an issue where you can't select/move the caret by clicking outside the body if the document is in standards mode
		_fixIESelection : function() {
			var dom = this.dom, doc = dom.doc, body = doc.body, started, startRng, htmlElm;

			// Return range from point or null if it failed
			function rngFromPoint(x, y) {
				var rng = body.createTextRange();

				try {
					rng.moveToPoint(x, y);
				} catch (ex) {
					// IE sometimes throws and exception, so lets just ignore it
					rng = null;
				}

				return rng;
			};

			// Fires while the selection is changing
			function selectionChange(e) {
				var pointRng;

				// Check if the button is down or not
				if (e.button) {
					// Create range from mouse position
					pointRng = rngFromPoint(e.x, e.y);

					if (pointRng) {
						// Check if pointRange is before/after selection then change the endPoint
						if (pointRng.compareEndPoints('StartToStart', startRng) > 0)
							pointRng.setEndPoint('StartToStart', startRng);
						else
							pointRng.setEndPoint('EndToEnd', startRng);

						pointRng.select();
					}
				} else
					endSelection();
			}

			// Removes listeners
			function endSelection() {
				var rng = doc.selection.createRange();

				// If the range is collapsed then use the last start range
				if (startRng && !rng.item && rng.compareEndPoints('StartToEnd', rng) === 0)
					startRng.select();

				dom.unbind(doc, 'mouseup', endSelection);
				dom.unbind(doc, 'mousemove', selectionChange);
				startRng = started = 0;
			};

			// Make HTML element unselectable since we are going to handle selection by hand
			doc.documentElement.unselectable = true;
			
			// Detect when user selects outside BODY
			dom.bind(doc, ['mousedown', 'contextmenu'], function(e) {
				if (e.target.nodeName === 'HTML') {
					if (started)
						endSelection();

					// Detect vertical scrollbar, since IE will fire a mousedown on the scrollbar and have target set as HTML
					htmlElm = doc.documentElement;
					if (htmlElm.scrollHeight > htmlElm.clientHeight)
						return;

					started = 1;
					// Setup start position
					startRng = rngFromPoint(e.x, e.y);
					if (startRng) {
						// Listen for selection change events
						dom.bind(doc, 'mouseup', endSelection);
						dom.bind(doc, 'mousemove', selectionChange);

						dom.win.focus();
						startRng.select();
					}
				}
			});
		}
	});
})(tinymce);

(function(tinymce) {
	tinymce.dom.Serializer = function(settings, dom, schema) {
		var onPreProcess, onPostProcess, isIE = tinymce.isIE, each = tinymce.each, htmlParser;

		// Support the old apply_source_formatting option
		if (!settings.apply_source_formatting)
			settings.indent = false;

		// Default DOM and Schema if they are undefined
		dom = dom || tinymce.DOM;
		schema = schema || new tinymce.html.Schema(settings);
		settings.entity_encoding = settings.entity_encoding || 'named';
		settings.remove_trailing_brs = "remove_trailing_brs" in settings ? settings.remove_trailing_brs : true;

		onPreProcess = new tinymce.util.Dispatcher(self);

		onPostProcess = new tinymce.util.Dispatcher(self);

		htmlParser = new tinymce.html.DomParser(settings, schema);

		// Convert move data-mce-src, data-mce-href and data-mce-style into nodes or process them if needed
		htmlParser.addAttributeFilter('src,href,style', function(nodes, name) {
			var i = nodes.length, node, value, internalName = 'data-mce-' + name, urlConverter = settings.url_converter, urlConverterScope = settings.url_converter_scope, undef;

			while (i--) {
				node = nodes[i];

				value = node.attributes.map[internalName];
				if (value !== undef) {
					// Set external name to internal value and remove internal
					node.attr(name, value.length > 0 ? value : null);
					node.attr(internalName, null);
				} else {
					// No internal attribute found then convert the value we have in the DOM
					value = node.attributes.map[name];

					if (name === "style")
						value = dom.serializeStyle(dom.parseStyle(value), node.name);
					else if (urlConverter)
						value = urlConverter.call(urlConverterScope, value, name, node.name);

					node.attr(name, value.length > 0 ? value : null);
				}
			}
		});

		// Remove internal classes mceItem<..> or mceSelected
		htmlParser.addAttributeFilter('class', function(nodes, name) {
			var i = nodes.length, node, value;

			while (i--) {
				node = nodes[i];
				value = node.attr('class').replace(/(?:^|\s)mce(Item\w+|Selected)(?!\S)/g, '');
				node.attr('class', value.length > 0 ? value : null);
			}
		});

		// Remove bookmark elements
		htmlParser.addAttributeFilter('data-mce-type', function(nodes, name, args) {
			var i = nodes.length, node;

			while (i--) {
				node = nodes[i];

				if (node.attributes.map['data-mce-type'] === 'bookmark' && !args.cleanup)
					node.remove();
			}
		});

		// Remove expando attributes
		htmlParser.addAttributeFilter('data-mce-expando', function(nodes, name, args) {
			var i = nodes.length;

			while (i--) {
				nodes[i].attr(name, null);
			}
		});

		htmlParser.addNodeFilter('noscript', function(nodes) {
			var i = nodes.length, node;

			while (i--) {
				node = nodes[i].firstChild;

				if (node) {
					node.value = tinymce.html.Entities.decode(node.value);
				}
			}
		});

		// Force script into CDATA sections and remove the mce- prefix also add comments around styles
		htmlParser.addNodeFilter('script,style', function(nodes, name) {
			var i = nodes.length, node, value;

			function trim(value) {
				return value.replace(/(<!--\[CDATA\[|\]\]-->)/g, '\n')
						.replace(/^[\r\n]*|[\r\n]*$/g, '')
						.replace(/^\s*((<!--)?(\s*\/\/)?\s*<!\[CDATA\[|(<!--\s*)?\/\*\s*<!\[CDATA\[\s*\*\/|(\/\/)?\s*<!--|\/\*\s*<!--\s*\*\/)\s*[\r\n]*/gi, '')
						.replace(/\s*(\/\*\s*\]\]>\s*\*\/(-->)?|\s*\/\/\s*\]\]>(-->)?|\/\/\s*(-->)?|\]\]>|\/\*\s*-->\s*\*\/|\s*-->\s*)\s*$/g, '');
			};

			while (i--) {
				node = nodes[i];
				value = node.firstChild ? node.firstChild.value : '';

				if (name === "script") {
					// Remove mce- prefix from script elements
					node.attr('type', (node.attr('type') || 'text/javascript').replace(/^mce\-/, ''));

					if (value.length > 0)
						node.firstChild.value = '// <![CDATA[\n' + trim(value) + '\n// ]]>';
				} else {
					if (value.length > 0)
						node.firstChild.value = '<!--\n' + trim(value) + '\n-->';
				}
			}
		});

		// Convert comments to cdata and handle protected comments
		htmlParser.addNodeFilter('#comment', function(nodes, name) {
			var i = nodes.length, node;

			while (i--) {
				node = nodes[i];

				if (node.value.indexOf('[CDATA[') === 0) {
					node.name = '#cdata';
					node.type = 4;
					node.value = node.value.replace(/^\[CDATA\[|\]\]$/g, '');
				} else if (node.value.indexOf('mce:protected ') === 0) {
					node.name = "#text";
					node.type = 3;
					node.raw = true;
					node.value = unescape(node.value).substr(14);
				}
			}
		});

		htmlParser.addNodeFilter('xml:namespace,input', function(nodes, name) {
			var i = nodes.length, node;

			while (i--) {
				node = nodes[i];
				if (node.type === 7)
					node.remove();
				else if (node.type === 1) {
					if (name === "input" && !("type" in node.attributes.map))
						node.attr('type', 'text');
				}
			}
		});

		// Fix list elements, TODO: Replace this later
		if (settings.fix_list_elements) {
			htmlParser.addNodeFilter('ul,ol', function(nodes, name) {
				var i = nodes.length, node, parentNode;

				while (i--) {
					node = nodes[i];
					parentNode = node.parent;

					if (parentNode.name === 'ul' || parentNode.name === 'ol') {
						if (node.prev && node.prev.name === 'li') {
							node.prev.append(node);
						}
					}
				}
			});
		}

		// Remove internal data attributes
		htmlParser.addAttributeFilter('data-mce-src,data-mce-href,data-mce-style', function(nodes, name) {
			var i = nodes.length;

			while (i--) {
				nodes[i].attr(name, null);
			}
		});

		// Return public methods
		return {
			schema : schema,

			addNodeFilter : htmlParser.addNodeFilter,

			addAttributeFilter : htmlParser.addAttributeFilter,

			onPreProcess : onPreProcess,

			onPostProcess : onPostProcess,

			serialize : function(node, args) {
				var impl, doc, oldDoc, htmlSerializer, content;

				// Explorer won't clone contents of script and style and the
				// selected index of select elements are cleared on a clone operation.
				if (isIE && dom.select('script,style,select,map').length > 0) {
					content = node.innerHTML;
					node = node.cloneNode(false);
					dom.setHTML(node, content);
				} else
					node = node.cloneNode(true);

				// Nodes needs to be attached to something in WebKit/Opera
				// Older builds of Opera crashes if you attach the node to an document created dynamically
				// and since we can't feature detect a crash we need to sniff the acutal build number
				// This fix will make DOM ranges and make Sizzle happy!
				impl = node.ownerDocument.implementation;
				if (impl.createHTMLDocument) {
					// Create an empty HTML document
					doc = impl.createHTMLDocument("");

					// Add the element or it's children if it's a body element to the new document
					each(node.nodeName == 'BODY' ? node.childNodes : [node], function(node) {
						doc.body.appendChild(doc.importNode(node, true));
					});

					// Grab first child or body element for serialization
					if (node.nodeName != 'BODY')
						node = doc.body.firstChild;
					else
						node = doc.body;

					// set the new document in DOMUtils so createElement etc works
					oldDoc = dom.doc;
					dom.doc = doc;
				}

				args = args || {};
				args.format = args.format || 'html';

				// Pre process
				if (!args.no_events) {
					args.node = node;
					onPreProcess.dispatch(self, args);
				}

				// Setup serializer
				htmlSerializer = new tinymce.html.Serializer(settings, schema);

				// Parse and serialize HTML
				args.content = htmlSerializer.serialize(
					htmlParser.parse(tinymce.trim(args.getInner ? node.innerHTML : dom.getOuterHTML(node)), args)
				);

				// Replace all BOM characters for now until we can find a better solution
				if (!args.cleanup)
					args.content = args.content.replace(/\uFEFF/g, '');

				// Post process
				if (!args.no_events)
					onPostProcess.dispatch(self, args);

				// Restore the old document if it was changed
				if (oldDoc)
					dom.doc = oldDoc;

				args.node = null;

				return args.content;
			},

			addRules : function(rules) {
				schema.addValidElements(rules);
			},

			setRules : function(rules) {
				schema.setValidElements(rules);
			}
		};
	};
})(tinymce);
(function(tinymce) {
	tinymce.dom.ScriptLoader = function(settings) {
		var QUEUED = 0,
			LOADING = 1,
			LOADED = 2,
			states = {},
			queue = [],
			scriptLoadedCallbacks = {},
			queueLoadedCallbacks = [],
			loading = 0,
			undef;

		function loadScript(url, callback) {
			var t = this, dom = tinymce.DOM, elm, uri, loc, id;

			// Execute callback when script is loaded
			function done() {
				dom.remove(id);

				if (elm)
					elm.onreadystatechange = elm.onload = elm = null;

				callback();
			};
			
			function error() {
				// Report the error so it's easier for people to spot loading errors
				if (typeof(console) !== "undefined" && console.log)
					console.log("Failed to load: " + url);

				// We can't mark it as done if there is a load error since
				// A) We don't want to produce 404 errors on the server and
				// B) the onerror event won't fire on all browsers.
				// done();
			};

			id = dom.uniqueId();

			if (tinymce.isIE6) {
				uri = new tinymce.util.URI(url);
				loc = location;

				// If script is from same domain and we
				// use IE 6 then use XHR since it's more reliable
				if (uri.host == loc.hostname && uri.port == loc.port && (uri.protocol + ':') == loc.protocol && uri.protocol.toLowerCase() != 'file') {
					tinymce.util.XHR.send({
						url : tinymce._addVer(uri.getURI()),
						success : function(content) {
							// Create new temp script element
							var script = dom.create('script', {
								type : 'text/javascript'
							});

							// Evaluate script in global scope
							script.text = content;
							document.getElementsByTagName('head')[0].appendChild(script);
							dom.remove(script);

							done();
						},
						
						error : error
					});

					return;
				}
			}

			// Create new script element
			elm = document.createElement('script');
			elm.id = id;
			elm.type = 'text/javascript';
			elm.src = tinymce._addVer(url);

			// Add onload listener for non IE browsers since IE9
			// fires onload event before the script is parsed and executed
			if (!tinymce.isIE)
				elm.onload = done;

			// Add onerror event will get fired on some browsers but not all of them
			elm.onerror = error;

			// Opera 9.60 doesn't seem to fire the onreadystate event at correctly
			if (!tinymce.isOpera) {
				elm.onreadystatechange = function() {
					var state = elm.readyState;

					// Loaded state is passed on IE 6 however there
					// are known issues with this method but we can't use
					// XHR in a cross domain loading
					if (state == 'complete' || state == 'loaded')
						done();
				};
			}

			// Most browsers support this feature so we report errors
			// for those at least to help users track their missing plugins etc
			// todo: Removed since it produced error if the document is unloaded by navigating away, re-add it as an option
			/*elm.onerror = function() {
				alert('Failed to load: ' + url);
			};*/

			// Add script to document
			(document.getElementsByTagName('head')[0] || document.body).appendChild(elm);
		};

		this.isDone = function(url) {
			return states[url] == LOADED;
		};

		this.markDone = function(url) {
			states[url] = LOADED;
		};

		this.add = this.load = function(url, callback, scope) {
			var item, state = states[url];

			// Add url to load queue
			if (state == undef) {
				queue.push(url);
				states[url] = QUEUED;
			}

			if (callback) {
				// Store away callback for later execution
				if (!scriptLoadedCallbacks[url])
					scriptLoadedCallbacks[url] = [];

				scriptLoadedCallbacks[url].push({
					func : callback,
					scope : scope || this
				});
			}
		};

		this.loadQueue = function(callback, scope) {
			this.loadScripts(queue, callback, scope);
		};

		this.loadScripts = function(scripts, callback, scope) {
			var loadScripts;

			function execScriptLoadedCallbacks(url) {
				// Execute URL callback functions
				tinymce.each(scriptLoadedCallbacks[url], function(callback) {
					callback.func.call(callback.scope);
				});

				scriptLoadedCallbacks[url] = undef;
			};

			queueLoadedCallbacks.push({
				func : callback,
				scope : scope || this
			});

			loadScripts = function() {
				var loadingScripts = tinymce.grep(scripts);

				// Current scripts has been handled
				scripts.length = 0;

				// Load scripts that needs to be loaded
				tinymce.each(loadingScripts, function(url) {
					// Script is already loaded then execute script callbacks directly
					if (states[url] == LOADED) {
						execScriptLoadedCallbacks(url);
						return;
					}

					// Is script not loading then start loading it
					if (states[url] != LOADING) {
						states[url] = LOADING;
						loading++;

						loadScript(url, function() {
							states[url] = LOADED;
							loading--;

							execScriptLoadedCallbacks(url);

							// Load more scripts if they where added by the recently loaded script
							loadScripts();
						});
					}
				});

				// No scripts are currently loading then execute all pending queue loaded callbacks
				if (!loading) {
					tinymce.each(queueLoadedCallbacks, function(callback) {
						callback.func.call(callback.scope);
					});

					queueLoadedCallbacks.length = 0;
				}
			};

			loadScripts();
		};
	};

	// Global script loader
	tinymce.ScriptLoader = new tinymce.dom.ScriptLoader();
})(tinymce);

(function(tinymce) {
	tinymce.dom.RangeUtils = function(dom) {
		var INVISIBLE_CHAR = '\uFEFF';

		this.walk = function(rng, callback) {
			var startContainer = rng.startContainer,
				startOffset = rng.startOffset,
				endContainer = rng.endContainer,
				endOffset = rng.endOffset,
				ancestor, startPoint,
				endPoint, node, parent, siblings, nodes;

			// Handle table cell selection the table plugin enables
			// you to fake select table cells and perform formatting actions on them
			nodes = dom.select('td.mceSelected,th.mceSelected');
			if (nodes.length > 0) {
				tinymce.each(nodes, function(node) {
					callback([node]);
				});

				return;
			}

			function exclude(nodes) {
				var node;

				// First node is excluded
				node = nodes[0];
				if (node.nodeType === 3 && node === startContainer && startOffset >= node.nodeValue.length) {
					nodes.splice(0, 1);
				}

				// Last node is excluded
				node = nodes[nodes.length - 1];
				if (endOffset === 0 && nodes.length > 0 && node === endContainer && node.nodeType === 3) {
					nodes.splice(nodes.length - 1, 1);
				}

				return nodes;
			};

			function collectSiblings(node, name, end_node) {
				var siblings = [];

				for (; node && node != end_node; node = node[name])
					siblings.push(node);

				return siblings;
			};

			function findEndPoint(node, root) {
				do {
					if (node.parentNode == root)
						return node;

					node = node.parentNode;
				} while(node);
			};

			function walkBoundary(start_node, end_node, next) {
				var siblingName = next ? 'nextSibling' : 'previousSibling';

				for (node = start_node, parent = node.parentNode; node && node != end_node; node = parent) {
					parent = node.parentNode;
					siblings = collectSiblings(node == start_node ? node : node[siblingName], siblingName);

					if (siblings.length) {
						if (!next)
							siblings.reverse();

						callback(exclude(siblings));
					}
				}
			};

			// If index based start position then resolve it
			if (startContainer.nodeType == 1 && startContainer.hasChildNodes())
				startContainer = startContainer.childNodes[startOffset];

			// If index based end position then resolve it
			if (endContainer.nodeType == 1 && endContainer.hasChildNodes())
				endContainer = endContainer.childNodes[Math.min(endOffset - 1, endContainer.childNodes.length - 1)];

			// Same container
			if (startContainer == endContainer)
				return callback(exclude([startContainer]));

			// Find common ancestor and end points
			ancestor = dom.findCommonAncestor(startContainer, endContainer);
				
			// Process left side
			for (node = startContainer; node; node = node.parentNode) {
				if (node === endContainer)
					return walkBoundary(startContainer, ancestor, true);

				if (node === ancestor)
					break;
			}

			// Process right side
			for (node = endContainer; node; node = node.parentNode) {
				if (node === startContainer)
					return walkBoundary(endContainer, ancestor);

				if (node === ancestor)
					break;
			}

			// Find start/end point
			startPoint = findEndPoint(startContainer, ancestor) || startContainer;
			endPoint = findEndPoint(endContainer, ancestor) || endContainer;

			// Walk left leaf
			walkBoundary(startContainer, startPoint, true);

			// Walk the middle from start to end point
			siblings = collectSiblings(
				startPoint == startContainer ? startPoint : startPoint.nextSibling,
				'nextSibling',
				endPoint == endContainer ? endPoint.nextSibling : endPoint
			);

			if (siblings.length)
				callback(exclude(siblings));

			// Walk right leaf
			walkBoundary(endContainer, endPoint);
		};

		this.split = function(rng) {
			var startContainer = rng.startContainer,
				startOffset = rng.startOffset,
				endContainer = rng.endContainer,
				endOffset = rng.endOffset;

			function splitText(node, offset) {
				return node.splitText(offset);
			};

			// Handle single text node
			if (startContainer == endContainer && startContainer.nodeType == 3) {
				if (startOffset > 0 && startOffset < startContainer.nodeValue.length) {
					endContainer = splitText(startContainer, startOffset);
					startContainer = endContainer.previousSibling;

					if (endOffset > startOffset) {
						endOffset = endOffset - startOffset;
						startContainer = endContainer = splitText(endContainer, endOffset).previousSibling;
						endOffset = endContainer.nodeValue.length;
						startOffset = 0;
					} else {
						endOffset = 0;
					}
				}
			} else {
				// Split startContainer text node if needed
				if (startContainer.nodeType == 3 && startOffset > 0 && startOffset < startContainer.nodeValue.length) {
					startContainer = splitText(startContainer, startOffset);
					startOffset = 0;
				}

				// Split endContainer text node if needed
				if (endContainer.nodeType == 3 && endOffset > 0 && endOffset < endContainer.nodeValue.length) {
					endContainer = splitText(endContainer, endOffset).previousSibling;
					endOffset = endContainer.nodeValue.length;
				}
			}

			return {
				startContainer : startContainer,
				startOffset : startOffset,
				endContainer : endContainer,
				endOffset : endOffset
			};
		};

	};

	tinymce.dom.RangeUtils.compareRanges = function(rng1, rng2) {
		if (rng1 && rng2) {
			// Compare native IE ranges
			if (rng1.item || rng1.duplicate) {
				// Both are control ranges and the selected element matches
				if (rng1.item && rng2.item && rng1.item(0) === rng2.item(0))
					return true;

				// Both are text ranges and the range matches
				if (rng1.isEqual && rng2.isEqual && rng2.isEqual(rng1))
					return true;
			} else {
				// Compare w3c ranges
				return rng1.startContainer == rng2.startContainer && rng1.startOffset == rng2.startOffset;
			}
		}

		return false;
	};
})(tinymce);

(function(tinymce) {
	var Event = tinymce.dom.Event, each = tinymce.each;

	tinymce.create('tinymce.ui.KeyboardNavigation', {
		KeyboardNavigation: function(settings, dom) {
			var t = this, root = settings.root, items = settings.items,
					enableUpDown = settings.enableUpDown, enableLeftRight = settings.enableLeftRight || !settings.enableUpDown,
					excludeFromTabOrder = settings.excludeFromTabOrder,
					itemFocussed, itemBlurred, rootKeydown, rootFocussed, focussedId;

			dom = dom || tinymce.DOM;

			itemFocussed = function(evt) {
				focussedId = evt.target.id;
			};
			
			itemBlurred = function(evt) {
				dom.setAttrib(evt.target.id, 'tabindex', '-1');
			};
			
			rootFocussed = function(evt) {
				var item = dom.get(focussedId);
				dom.setAttrib(item, 'tabindex', '0');
				item.focus();
			};
			
			t.focus = function() {
				dom.get(focussedId).focus();
			};

			t.destroy = function() {
				each(items, function(item) {
					var elm = dom.get(item.id);

					dom.unbind(elm, 'focus', itemFocussed);
					dom.unbind(elm, 'blur', itemBlurred);
				});

				var rootElm = dom.get(root);
				dom.unbind(rootElm, 'focus', rootFocussed);
				dom.unbind(rootElm, 'keydown', rootKeydown);

				items = dom = root = t.focus = itemFocussed = itemBlurred = rootKeydown = rootFocussed = null;
				t.destroy = function() {};
			};
			
			t.moveFocus = function(dir, evt) {
				var idx = -1, controls = t.controls, newFocus;

				if (!focussedId)
					return;

				each(items, function(item, index) {
					if (item.id === focussedId) {
						idx = index;
						return false;
					}
				});

				idx += dir;
				if (idx < 0) {
					idx = items.length - 1;
				} else if (idx >= items.length) {
					idx = 0;
				}
				
				newFocus = items[idx];
				dom.setAttrib(focussedId, 'tabindex', '-1');
				dom.setAttrib(newFocus.id, 'tabindex', '0');
				dom.get(newFocus.id).focus();

				if (settings.actOnFocus) {
					settings.onAction(newFocus.id);
				}

				if (evt)
					Event.cancel(evt);
			};
			
			rootKeydown = function(evt) {
				var DOM_VK_LEFT = 37, DOM_VK_RIGHT = 39, DOM_VK_UP = 38, DOM_VK_DOWN = 40, DOM_VK_ESCAPE = 27, DOM_VK_ENTER = 14, DOM_VK_RETURN = 13, DOM_VK_SPACE = 32;
				
				switch (evt.keyCode) {
					case DOM_VK_LEFT:
						if (enableLeftRight) t.moveFocus(-1);
						break;
	
					case DOM_VK_RIGHT:
						if (enableLeftRight) t.moveFocus(1);
						break;
	
					case DOM_VK_UP:
						if (enableUpDown) t.moveFocus(-1);
						break;

					case DOM_VK_DOWN:
						if (enableUpDown) t.moveFocus(1);
						break;

					case DOM_VK_ESCAPE:
						if (settings.onCancel) {
							settings.onCancel();
							Event.cancel(evt);
						}
						break;

					case DOM_VK_ENTER:
					case DOM_VK_RETURN:
					case DOM_VK_SPACE:
						if (settings.onAction) {
							settings.onAction(focussedId);
							Event.cancel(evt);
						}
						break;
				}
			};

			// Set up state and listeners for each item.
			each(items, function(item, idx) {
				var tabindex, elm;

				if (!item.id) {
					item.id = dom.uniqueId('_mce_item_');
				}

				elm = dom.get(item.id);

				if (excludeFromTabOrder) {
					dom.bind(elm, 'blur', itemBlurred);
					tabindex = '-1';
				} else {
					tabindex = (idx === 0 ? '0' : '-1');
				}

				elm.setAttribute('tabindex', tabindex);
				dom.bind(elm, 'focus', itemFocussed);
			});
			
			// Setup initial state for root element.
			if (items[0]){
				focussedId = items[0].id;
			}

			dom.setAttrib(root, 'tabindex', '-1');

			// Setup listeners for root element.
			var rootElm = dom.get(root);
			dom.bind(rootElm, 'focus', rootFocussed);
			dom.bind(rootElm, 'keydown', rootKeydown);
		}
	});
})(tinymce);

(function(tinymce) {
	// Shorten class names
	var DOM = tinymce.DOM, is = tinymce.is;

	tinymce.create('tinymce.ui.Control', {
		Control : function(id, s, editor) {
			this.id = id;
			this.settings = s = s || {};
			this.rendered = false;
			this.onRender = new tinymce.util.Dispatcher(this);
			this.classPrefix = '';
			this.scope = s.scope || this;
			this.disabled = 0;
			this.active = 0;
			this.editor = editor;
		},
		
		setAriaProperty : function(property, value) {
			var element = DOM.get(this.id + '_aria') || DOM.get(this.id);
			if (element) {
				DOM.setAttrib(element, 'aria-' + property, !!value);
			}
		},
		
		focus : function() {
			DOM.get(this.id).focus();
		},

		setDisabled : function(s) {
			if (s != this.disabled) {
				this.setAriaProperty('disabled', s);

				this.setState('Disabled', s);
				this.setState('Enabled', !s);
				this.disabled = s;
			}
		},

		isDisabled : function() {
			return this.disabled;
		},

		setActive : function(s) {
			if (s != this.active) {
				this.setState('Active', s);
				this.active = s;
				this.setAriaProperty('pressed', s);
			}
		},

		isActive : function() {
			return this.active;
		},

		setState : function(c, s) {
			var n = DOM.get(this.id);

			c = this.classPrefix + c;

			if (s)
				DOM.addClass(n, c);
			else
				DOM.removeClass(n, c);
		},

		isRendered : function() {
			return this.rendered;
		},

		renderHTML : function() {
		},

		renderTo : function(n) {
			DOM.setHTML(n, this.renderHTML());
		},

		postRender : function() {
			var t = this, b;

			// Set pending states
			if (is(t.disabled)) {
				b = t.disabled;
				t.disabled = -1;
				t.setDisabled(b);
			}

			if (is(t.active)) {
				b = t.active;
				t.active = -1;
				t.setActive(b);
			}
		},

		remove : function() {
			DOM.remove(this.id);
			this.destroy();
		},

		destroy : function() {
			tinymce.dom.Event.clear(this.id);
		}
	});
})(tinymce);
tinymce.create('tinymce.ui.Container:tinymce.ui.Control', {
	Container : function(id, s, editor) {
		this.parent(id, s, editor);

		this.controls = [];

		this.lookup = {};
	},

	add : function(c) {
		this.lookup[c.id] = c;
		this.controls.push(c);

		return c;
	},

	get : function(n) {
		return this.lookup[n];
	}
});


tinymce.create('tinymce.ui.Separator:tinymce.ui.Control', {
	Separator : function(id, s) {
		this.parent(id, s);
		this.classPrefix = 'mceSeparator';
		this.setDisabled(true);
	},

	renderHTML : function() {
		return tinymce.DOM.createHTML('span', {'class' : this.classPrefix, role : 'separator', 'aria-orientation' : 'vertical', tabindex : '-1'});
	}
});

(function(tinymce) {
	var is = tinymce.is, DOM = tinymce.DOM, each = tinymce.each, walk = tinymce.walk;

	tinymce.create('tinymce.ui.MenuItem:tinymce.ui.Control', {
		MenuItem : function(id, s) {
			this.parent(id, s);
			this.classPrefix = 'mceMenuItem';
		},

		setSelected : function(s) {
			this.setState('Selected', s);
			this.setAriaProperty('checked', !!s);
			this.selected = s;
		},

		isSelected : function() {
			return this.selected;
		},

		postRender : function() {
			var t = this;
			
			t.parent();

			// Set pending state
			if (is(t.selected))
				t.setSelected(t.selected);
		}
	});
})(tinymce);

(function(tinymce) {
	var is = tinymce.is, DOM = tinymce.DOM, each = tinymce.each, walk = tinymce.walk;

	tinymce.create('tinymce.ui.Menu:tinymce.ui.MenuItem', {
		Menu : function(id, s) {
			var t = this;

			t.parent(id, s);
			t.items = {};
			t.collapsed = false;
			t.menuCount = 0;
			t.onAddItem = new tinymce.util.Dispatcher(this);
		},

		expand : function(d) {
			var t = this;

			if (d) {
				walk(t, function(o) {
					if (o.expand)
						o.expand();
				}, 'items', t);
			}

			t.collapsed = false;
		},

		collapse : function(d) {
			var t = this;

			if (d) {
				walk(t, function(o) {
					if (o.collapse)
						o.collapse();
				}, 'items', t);
			}

			t.collapsed = true;
		},

		isCollapsed : function() {
			return this.collapsed;
		},

		add : function(o) {
			if (!o.settings)
				o = new tinymce.ui.MenuItem(o.id || DOM.uniqueId(), o);

			this.onAddItem.dispatch(this, o);

			return this.items[o.id] = o;
		},

		addSeparator : function() {
			return this.add({separator : true});
		},

		addMenu : function(o) {
			if (!o.collapse)
				o = this.createMenu(o);

			this.menuCount++;

			return this.add(o);
		},

		hasMenus : function() {
			return this.menuCount !== 0;
		},

		remove : function(o) {
			delete this.items[o.id];
		},

		removeAll : function() {
			var t = this;

			walk(t, function(o) {
				if (o.removeAll)
					o.removeAll();
				else
					o.remove();

				o.destroy();
			}, 'items', t);

			t.items = {};
		},

		createMenu : function(o) {
			var m = new tinymce.ui.Menu(o.id || DOM.uniqueId(), o);

			m.onAddItem.add(this.onAddItem.dispatch, this.onAddItem);

			return m;
		}
	});
})(tinymce);
(function(tinymce) {
	var is = tinymce.is, DOM = tinymce.DOM, each = tinymce.each, Event = tinymce.dom.Event, Element = tinymce.dom.Element;

	tinymce.create('tinymce.ui.DropMenu:tinymce.ui.Menu', {
		DropMenu : function(id, s) {
			s = s || {};
			s.container = s.container || DOM.doc.body;
			s.offset_x = s.offset_x || 0;
			s.offset_y = s.offset_y || 0;
			s.vp_offset_x = s.vp_offset_x || 0;
			s.vp_offset_y = s.vp_offset_y || 0;

			if (is(s.icons) && !s.icons)
				s['class'] += ' mceNoIcons';

			this.parent(id, s);
			this.onShowMenu = new tinymce.util.Dispatcher(this);
			this.onHideMenu = new tinymce.util.Dispatcher(this);
			this.classPrefix = 'mceMenu';
		},

		createMenu : function(s) {
			var t = this, cs = t.settings, m;

			s.container = s.container || cs.container;
			s.parent = t;
			s.constrain = s.constrain || cs.constrain;
			s['class'] = s['class'] || cs['class'];
			s.vp_offset_x = s.vp_offset_x || cs.vp_offset_x;
			s.vp_offset_y = s.vp_offset_y || cs.vp_offset_y;
			s.keyboard_focus = cs.keyboard_focus;
			m = new tinymce.ui.DropMenu(s.id || DOM.uniqueId(), s);

			m.onAddItem.add(t.onAddItem.dispatch, t.onAddItem);

			return m;
		},
		
		focus : function() {
			var t = this;
			if (t.keyboardNav) {
				t.keyboardNav.focus();
			}
		},

		update : function() {
			var t = this, s = t.settings, tb = DOM.get('menu_' + t.id + '_tbl'), co = DOM.get('menu_' + t.id + '_co'), tw, th;

			tw = s.max_width ? Math.min(tb.offsetWidth, s.max_width) : tb.offsetWidth;
			th = s.max_height ? Math.min(tb.offsetHeight, s.max_height) : tb.offsetHeight;

			if (!DOM.boxModel)
				t.element.setStyles({width : tw + 2, height : th + 2});
			else
				t.element.setStyles({width : tw, height : th});

			if (s.max_width)
				DOM.setStyle(co, 'width', tw);

			if (s.max_height) {
				DOM.setStyle(co, 'height', th);

				if (tb.clientHeight < s.max_height)
					DOM.setStyle(co, 'overflow', 'hidden');
			}
		},

		showMenu : function(x, y, px) {
			var t = this, s = t.settings, co, vp = DOM.getViewPort(), w, h, mx, my, ot = 2, dm, tb, cp = t.classPrefix;

			t.collapse(1);

			if (t.isMenuVisible)
				return;

			if (!t.rendered) {
				co = DOM.add(t.settings.container, t.renderNode());

				each(t.items, function(o) {
					o.postRender();
				});

				t.element = new Element('menu_' + t.id, {blocker : 1, container : s.container});
			} else
				co = DOM.get('menu_' + t.id);

			// Move layer out of sight unless it's Opera since it scrolls to top of page due to an bug
			if (!tinymce.isOpera)
				DOM.setStyles(co, {left : -0xFFFF , top : -0xFFFF});

			DOM.show(co);
			t.update();

			x += s.offset_x || 0;
			y += s.offset_y || 0;
			vp.w -= 4;
			vp.h -= 4;

			// Move inside viewport if not submenu
			if (s.constrain) {
				w = co.clientWidth - ot;
				h = co.clientHeight - ot;
				mx = vp.x + vp.w;
				my = vp.y + vp.h;

				if ((x + s.vp_offset_x + w) > mx)
					x = px ? px - w : Math.max(0, (mx - s.vp_offset_x) - w);

				if ((y + s.vp_offset_y + h) > my)
					y = Math.max(0, (my - s.vp_offset_y) - h);
			}

			DOM.setStyles(co, {left : x , top : y});
			t.element.update();

			t.isMenuVisible = 1;
			t.mouseClickFunc = Event.add(co, 'click', function(e) {
				var m;

				e = e.target;

				if (e && (e = DOM.getParent(e, 'tr')) && !DOM.hasClass(e, cp + 'ItemSub')) {
					m = t.items[e.id];

					if (m.isDisabled())
						return;

					dm = t;

					while (dm) {
						if (dm.hideMenu)
							dm.hideMenu();

						dm = dm.settings.parent;
					}

					if (m.settings.onclick)
						m.settings.onclick(e);

					return false; // Cancel to fix onbeforeunload problem
				}
			});

			if (t.hasMenus()) {
				t.mouseOverFunc = Event.add(co, 'mouseover', function(e) {
					var m, r, mi;

					e = e.target;
					if (e && (e = DOM.getParent(e, 'tr'))) {
						m = t.items[e.id];

						if (t.lastMenu)
							t.lastMenu.collapse(1);

						if (m.isDisabled())
							return;

						if (e && DOM.hasClass(e, cp + 'ItemSub')) {
							//p = DOM.getPos(s.container);
							r = DOM.getRect(e);
							m.showMenu((r.x + r.w - ot), r.y - ot, r.x);
							t.lastMenu = m;
							DOM.addClass(DOM.get(m.id).firstChild, cp + 'ItemActive');
						}
					}
				});
			}
			
			Event.add(co, 'keydown', t._keyHandler, t);

			t.onShowMenu.dispatch(t);

			if (s.keyboard_focus) { 
				t._setupKeyboardNav(); 
			}
		},

		hideMenu : function(c) {
			var t = this, co = DOM.get('menu_' + t.id), e;

			if (!t.isMenuVisible)
				return;

			if (t.keyboardNav) t.keyboardNav.destroy();
			Event.remove(co, 'mouseover', t.mouseOverFunc);
			Event.remove(co, 'click', t.mouseClickFunc);
			Event.remove(co, 'keydown', t._keyHandler);
			DOM.hide(co);
			t.isMenuVisible = 0;

			if (!c)
				t.collapse(1);

			if (t.element)
				t.element.hide();

			if (e = DOM.get(t.id))
				DOM.removeClass(e.firstChild, t.classPrefix + 'ItemActive');

			t.onHideMenu.dispatch(t);
		},

		add : function(o) {
			var t = this, co;

			o = t.parent(o);

			if (t.isRendered && (co = DOM.get('menu_' + t.id)))
				t._add(DOM.select('tbody', co)[0], o);

			return o;
		},

		collapse : function(d) {
			this.parent(d);
			this.hideMenu(1);
		},

		remove : function(o) {
			DOM.remove(o.id);
			this.destroy();

			return this.parent(o);
		},

		destroy : function() {
			var t = this, co = DOM.get('menu_' + t.id);

			if (t.keyboardNav) t.keyboardNav.destroy();
			Event.remove(co, 'mouseover', t.mouseOverFunc);
			Event.remove(DOM.select('a', co), 'focus', t.mouseOverFunc);
			Event.remove(co, 'click', t.mouseClickFunc);
			Event.remove(co, 'keydown', t._keyHandler);

			if (t.element)
				t.element.remove();

			DOM.remove(co);
		},

		renderNode : function() {
			var t = this, s = t.settings, n, tb, co, w;

			w = DOM.create('div', {role: 'listbox', id : 'menu_' + t.id, 'class' : s['class'], 'style' : 'position:absolute;left:0;top:0;z-index:200000;outline:0'});
			if (t.settings.parent) {
				DOM.setAttrib(w, 'aria-parent', 'menu_' + t.settings.parent.id);
			}
			co = DOM.add(w, 'div', {role: 'presentation', id : 'menu_' + t.id + '_co', 'class' : t.classPrefix + (s['class'] ? ' ' + s['class'] : '')});
			t.element = new Element('menu_' + t.id, {blocker : 1, container : s.container});

			if (s.menu_line)
				DOM.add(co, 'span', {'class' : t.classPrefix + 'Line'});

//			n = DOM.add(co, 'div', {id : 'menu_' + t.id + '_co', 'class' : 'mceMenuContainer'});
			n = DOM.add(co, 'table', {role: 'presentation', id : 'menu_' + t.id + '_tbl', border : 0, cellPadding : 0, cellSpacing : 0});
			tb = DOM.add(n, 'tbody');

			each(t.items, function(o) {
				t._add(tb, o);
			});

			t.rendered = true;

			return w;
		},

		// Internal functions
		_setupKeyboardNav : function(){
			var contextMenu, menuItems, t=this; 
			contextMenu = DOM.get('menu_' + t.id);
			menuItems = DOM.select('a[role=option]', 'menu_' + t.id);
			menuItems.splice(0,0,contextMenu);
			t.keyboardNav = new tinymce.ui.KeyboardNavigation({
				root: 'menu_' + t.id,
				items: menuItems,
				onCancel: function() {
					t.hideMenu();
				},
				enableUpDown: true
			});
			contextMenu.focus();
		},

		_keyHandler : function(evt) {
			var t = this, e;
			switch (evt.keyCode) {
				case 37: // Left
					if (t.settings.parent) {
						t.hideMenu();
						t.settings.parent.focus();
						Event.cancel(evt);
					}
					break;
				case 39: // Right
					if (t.mouseOverFunc)
						t.mouseOverFunc(evt);
					break;
			}
		},

		_add : function(tb, o) {
			var n, s = o.settings, a, ro, it, cp = this.classPrefix, ic;

			if (s.separator) {
				ro = DOM.add(tb, 'tr', {id : o.id, 'class' : cp + 'ItemSeparator'});
				DOM.add(ro, 'td', {'class' : cp + 'ItemSeparator'});

				if (n = ro.previousSibling)
					DOM.addClass(n, 'mceLast');

				return;
			}

			n = ro = DOM.add(tb, 'tr', {id : o.id, 'class' : cp + 'Item ' + cp + 'ItemEnabled'});
			n = it = DOM.add(n, s.titleItem ? 'th' : 'td');
			n = a = DOM.add(n, 'a', {id: o.id + '_aria',  role: s.titleItem ? 'presentation' : 'option', href : 'javascript:;', onclick : "return false;", onmousedown : 'return false;'});

			if (s.parent) {
				DOM.setAttrib(a, 'aria-haspopup', 'true');
				DOM.setAttrib(a, 'aria-owns', 'menu_' + o.id);
			}

			DOM.addClass(it, s['class']);
//			n = DOM.add(n, 'span', {'class' : 'item'});

			ic = DOM.add(n, 'span', {'class' : 'mceIcon' + (s.icon ? ' mce_' + s.icon : '')});

			if (s.icon_src)
				DOM.add(ic, 'img', {src : s.icon_src});

			n = DOM.add(n, s.element || 'span', {'class' : 'mceText', title : o.settings.title}, o.settings.title);

			if (o.settings.style) {
				if (typeof o.settings.style == "function")
					o.settings.style = o.settings.style();

				DOM.setAttrib(n, 'style', o.settings.style);
			}

			if (tb.childNodes.length == 1)
				DOM.addClass(ro, 'mceFirst');

			if ((n = ro.previousSibling) && DOM.hasClass(n, cp + 'ItemSeparator'))
				DOM.addClass(ro, 'mceFirst');

			if (o.collapse)
				DOM.addClass(ro, cp + 'ItemSub');

			if (n = ro.previousSibling)
				DOM.removeClass(n, 'mceLast');

			DOM.addClass(ro, 'mceLast');
		}
	});
})(tinymce);
(function(tinymce) {
	var DOM = tinymce.DOM;

	tinymce.create('tinymce.ui.Button:tinymce.ui.Control', {
		Button : function(id, s, ed) {
			this.parent(id, s, ed);
			this.classPrefix = 'mceButton';
		},

		renderHTML : function() {
			var cp = this.classPrefix, s = this.settings, h, l;

			l = DOM.encode(s.label || '');
			h = '<a role="button" id="' + this.id + '" href="javascript:;" class="' + cp + ' ' + cp + 'Enabled ' + s['class'] + (l ? ' ' + cp + 'Labeled' : '') +'" onmousedown="return false;" onclick="return false;" aria-labelledby="' + this.id + '_voice" title="' + DOM.encode(s.title) + '">';
			if (s.image && !(this.editor  &&this.editor.forcedHighContrastMode) )
				h += '<span class="mceIcon ' + s['class'] + '"><img class="mceIcon" src="' + s.image + '" alt="' + DOM.encode(s.title) + '" /></span>' + (l ? '<span class="' + cp + 'Label">' + l + '</span>' : '');
			else
				h += '<span class="mceIcon ' + s['class'] + '"></span>' + (l ? '<span class="' + cp + 'Label">' + l + '</span>' : '');

			h += '<span class="mceVoiceLabel mceIconOnly" style="display: none;" id="' + this.id + '_voice">' + s.title + '</span>'; 
			h += '</a>';
			return h;
		},

		postRender : function() {
			var t = this, s = t.settings, imgBookmark;

			// In IE a large image that occupies the entire editor area will be deselected when a button is clicked, so
			// need to keep the selection in case the selection is lost
			if (tinymce.isIE && t.editor) {
				tinymce.dom.Event.add(t.id, 'mousedown', function(e) {
					var nodeName = t.editor.selection.getNode().nodeName;
					imgBookmark = nodeName === 'IMG' ? t.editor.selection.getBookmark() : null;
				});
			}
			tinymce.dom.Event.add(t.id, 'click', function(e) {
				if (!t.isDisabled()) {
					// restore the selection in case the selection is lost in IE
					if (tinymce.isIE && t.editor && imgBookmark !== null) {
						t.editor.selection.moveToBookmark(imgBookmark);
					}
					return s.onclick.call(s.scope, e);
				}
			});
			tinymce.dom.Event.add(t.id, 'keyup', function(e) {
				if (!t.isDisabled() && e.keyCode==tinymce.VK.SPACEBAR)
					return s.onclick.call(s.scope, e);
			});
		}
	});
})(tinymce);

(function(tinymce) {
	var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each, Dispatcher = tinymce.util.Dispatcher, undef;

	tinymce.create('tinymce.ui.ListBox:tinymce.ui.Control', {
		ListBox : function(id, s, ed) {
			var t = this;

			t.parent(id, s, ed);

			t.items = [];

			t.onChange = new Dispatcher(t);

			t.onPostRender = new Dispatcher(t);

			t.onAdd = new Dispatcher(t);

			t.onRenderMenu = new tinymce.util.Dispatcher(this);

			t.classPrefix = 'mceListBox';
			t.marked = {};
		},

		select : function(va) {
			var t = this, fv, f;

			t.marked = {};

			if (va == undef)
				return t.selectByIndex(-1);

			// Is string or number make function selector
			if (va && typeof(va)=="function")
				f = va;
			else {
				f = function(v) {
					return v == va;
				};
			}

			// Do we need to do something?
			if (va != t.selectedValue) {
				// Find item
				each(t.items, function(o, i) {
					if (f(o.value)) {
						fv = 1;
						t.selectByIndex(i);
						return false;
					}
				});

				if (!fv)
					t.selectByIndex(-1);
			}
		},

		selectByIndex : function(idx) {
			var t = this, e, o, label;

			t.marked = {};

			if (idx != t.selectedIndex) {
				e = DOM.get(t.id + '_text');
				label = DOM.get(t.id + '_voiceDesc');
				o = t.items[idx];

				if (o) {
					t.selectedValue = o.value;
					t.selectedIndex = idx;
					DOM.setHTML(e, DOM.encode(o.title));
					DOM.setHTML(label, t.settings.title + " - " + o.title);
					DOM.removeClass(e, 'mceTitle');
					DOM.setAttrib(t.id, 'aria-valuenow', o.title);
				} else {
					DOM.setHTML(e, DOM.encode(t.settings.title));
					DOM.setHTML(label, DOM.encode(t.settings.title));
					DOM.addClass(e, 'mceTitle');
					t.selectedValue = t.selectedIndex = null;
					DOM.setAttrib(t.id, 'aria-valuenow', t.settings.title);
				}
				e = 0;
			}
		},

		mark : function(value) {
			this.marked[value] = true;
		},

		add : function(n, v, o) {
			var t = this;

			o = o || {};
			o = tinymce.extend(o, {
				title : n,
				value : v
			});

			t.items.push(o);
			t.onAdd.dispatch(t, o);
		},

		getLength : function() {
			return this.items.length;
		},

		renderHTML : function() {
			var h = '', t = this, s = t.settings, cp = t.classPrefix;

			h = '<span role="listbox" aria-haspopup="true" aria-labelledby="' + t.id +'_voiceDesc" aria-describedby="' + t.id + '_voiceDesc"><table role="presentation" tabindex="0" id="' + t.id + '" cellpadding="0" cellspacing="0" class="' + cp + ' ' + cp + 'Enabled' + (s['class'] ? (' ' + s['class']) : '') + '"><tbody><tr>';
			h += '<td>' + DOM.createHTML('span', {id: t.id + '_voiceDesc', 'class': 'voiceLabel', style:'display:none;'}, t.settings.title); 
			h += DOM.createHTML('a', {id : t.id + '_text', tabindex : -1, href : 'javascript:;', 'class' : 'mceText', onclick : "return false;", onmousedown : 'return false;'}, DOM.encode(t.settings.title)) + '</td>';
			h += '<td>' + DOM.createHTML('a', {id : t.id + '_open', tabindex : -1, href : 'javascript:;', 'class' : 'mceOpen', onclick : "return false;", onmousedown : 'return false;'}, '<span><span style="display:none;" class="mceIconOnly" aria-hidden="true">\u25BC</span></span>') + '</td>';
			h += '</tr></tbody></table></span>';

			return h;
		},

		showMenu : function() {
			var t = this, p2, e = DOM.get(this.id), m;

			if (t.isDisabled() || t.items.length === 0)
				return;

			if (t.menu && t.menu.isMenuVisible)
				return t.hideMenu();

			if (!t.isMenuRendered) {
				t.renderMenu();
				t.isMenuRendered = true;
			}

			p2 = DOM.getPos(e);

			m = t.menu;
			m.settings.offset_x = p2.x;
			m.settings.offset_y = p2.y;
			m.settings.keyboard_focus = !tinymce.isOpera; // Opera is buggy when it comes to auto focus

			// Select in menu
			each(t.items, function(o) {
				if (m.items[o.id]) {
					m.items[o.id].setSelected(0);
				}
			});

			each(t.items, function(o) {
				if (m.items[o.id] && t.marked[o.value]) {
					m.items[o.id].setSelected(1);
				}

				if (o.value === t.selectedValue) {
					m.items[o.id].setSelected(1);
				}
			});

			m.showMenu(0, e.clientHeight);

			Event.add(DOM.doc, 'mousedown', t.hideMenu, t);
			DOM.addClass(t.id, t.classPrefix + 'Selected');

			//DOM.get(t.id + '_text').focus();
		},

		hideMenu : function(e) {
			var t = this;

			if (t.menu && t.menu.isMenuVisible) {
				DOM.removeClass(t.id, t.classPrefix + 'Selected');

				// Prevent double toogles by canceling the mouse click event to the button
				if (e && e.type == "mousedown" && (e.target.id == t.id + '_text' || e.target.id == t.id + '_open'))
					return;

				if (!e || !DOM.getParent(e.target, '.mceMenu')) {
					DOM.removeClass(t.id, t.classPrefix + 'Selected');
					Event.remove(DOM.doc, 'mousedown', t.hideMenu, t);
					t.menu.hideMenu();
				}
			}
		},

		renderMenu : function() {
			var t = this, m;

			m = t.settings.control_manager.createDropMenu(t.id + '_menu', {
				menu_line : 1,
				'class' : t.classPrefix + 'Menu mceNoIcons',
				max_width : 250,
				max_height : 150
			});

			m.onHideMenu.add(function() {
				t.hideMenu();
				t.focus();
			});

			m.add({
				title : t.settings.title,
				'class' : 'mceMenuItemTitle',
				onclick : function() {
					if (t.settings.onselect('') !== false)
						t.select(''); // Must be runned after
				}
			});

			each(t.items, function(o) {
				// No value then treat it as a title
				if (o.value === undef) {
					m.add({
						title : o.title,
						role : "option",
						'class' : 'mceMenuItemTitle',
						onclick : function() {
							if (t.settings.onselect('') !== false)
								t.select(''); // Must be runned after
						}
					});
				} else {
					o.id = DOM.uniqueId();
					o.role= "option";
					o.onclick = function() {
						if (t.settings.onselect(o.value) !== false)
							t.select(o.value); // Must be runned after
					};

					m.add(o);
				}
			});

			t.onRenderMenu.dispatch(t, m);
			t.menu = m;
		},

		postRender : function() {
			var t = this, cp = t.classPrefix;

			Event.add(t.id, 'click', t.showMenu, t);
			Event.add(t.id, 'keydown', function(evt) {
				if (evt.keyCode == 32) { // Space
					t.showMenu(evt);
					Event.cancel(evt);
				}
			});
			Event.add(t.id, 'focus', function() {
				if (!t._focused) {
					t.keyDownHandler = Event.add(t.id, 'keydown', function(e) {
						if (e.keyCode == 40) {
							t.showMenu();
							Event.cancel(e);
						}
					});
					t.keyPressHandler = Event.add(t.id, 'keypress', function(e) {
						var v;
						if (e.keyCode == 13) {
							// Fake select on enter
							v = t.selectedValue;
							t.selectedValue = null; // Needs to be null to fake change
							Event.cancel(e);
							t.settings.onselect(v);
						}
					});
				}

				t._focused = 1;
			});
			Event.add(t.id, 'blur', function() {
				Event.remove(t.id, 'keydown', t.keyDownHandler);
				Event.remove(t.id, 'keypress', t.keyPressHandler);
				t._focused = 0;
			});

			// Old IE doesn't have hover on all elements
			if (tinymce.isIE6 || !DOM.boxModel) {
				Event.add(t.id, 'mouseover', function() {
					if (!DOM.hasClass(t.id, cp + 'Disabled'))
						DOM.addClass(t.id, cp + 'Hover');
				});

				Event.add(t.id, 'mouseout', function() {
					if (!DOM.hasClass(t.id, cp + 'Disabled'))
						DOM.removeClass(t.id, cp + 'Hover');
				});
			}

			t.onPostRender.dispatch(t, DOM.get(t.id));
		},

		destroy : function() {
			this.parent();

			Event.clear(this.id + '_text');
			Event.clear(this.id + '_open');
		}
	});
})(tinymce);

(function(tinymce) {
	var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each, Dispatcher = tinymce.util.Dispatcher, undef;

	tinymce.create('tinymce.ui.NativeListBox:tinymce.ui.ListBox', {
		NativeListBox : function(id, s) {
			this.parent(id, s);
			this.classPrefix = 'mceNativeListBox';
		},

		setDisabled : function(s) {
			DOM.get(this.id).disabled = s;
			this.setAriaProperty('disabled', s);
		},

		isDisabled : function() {
			return DOM.get(this.id).disabled;
		},

		select : function(va) {
			var t = this, fv, f;

			if (va == undef)
				return t.selectByIndex(-1);

			// Is string or number make function selector
			if (va && typeof(va)=="function")
				f = va;
			else {
				f = function(v) {
					return v == va;
				};
			}

			// Do we need to do something?
			if (va != t.selectedValue) {
				// Find item
				each(t.items, function(o, i) {
					if (f(o.value)) {
						fv = 1;
						t.selectByIndex(i);
						return false;
					}
				});

				if (!fv)
					t.selectByIndex(-1);
			}
		},

		selectByIndex : function(idx) {
			DOM.get(this.id).selectedIndex = idx + 1;
			this.selectedValue = this.items[idx] ? this.items[idx].value : null;
		},

		add : function(n, v, a) {
			var o, t = this;

			a = a || {};
			a.value = v;

			if (t.isRendered())
				DOM.add(DOM.get(this.id), 'option', a, n);

			o = {
				title : n,
				value : v,
				attribs : a
			};

			t.items.push(o);
			t.onAdd.dispatch(t, o);
		},

		getLength : function() {
			return this.items.length;
		},

		renderHTML : function() {
			var h, t = this;

			h = DOM.createHTML('option', {value : ''}, '-- ' + t.settings.title + ' --');

			each(t.items, function(it) {
				h += DOM.createHTML('option', {value : it.value}, it.title);
			});

			h = DOM.createHTML('select', {id : t.id, 'class' : 'mceNativeListBox', 'aria-labelledby': t.id + '_aria'}, h);
			h += DOM.createHTML('span', {id : t.id + '_aria', 'style': 'display: none'}, t.settings.title);
			return h;
		},

		postRender : function() {
			var t = this, ch, changeListenerAdded = true;

			t.rendered = true;

			function onChange(e) {
				var v = t.items[e.target.selectedIndex - 1];

				if (v && (v = v.value)) {
					t.onChange.dispatch(t, v);

					if (t.settings.onselect)
						t.settings.onselect(v);
				}
			};

			Event.add(t.id, 'change', onChange);

			// Accessibility keyhandler
			Event.add(t.id, 'keydown', function(e) {
				var bf;

				Event.remove(t.id, 'change', ch);
				changeListenerAdded = false;

				bf = Event.add(t.id, 'blur', function() {
					if (changeListenerAdded) return;
					changeListenerAdded = true;
					Event.add(t.id, 'change', onChange);
					Event.remove(t.id, 'blur', bf);
				});

				//prevent default left and right keys on chrome - so that the keyboard navigation is used.
				if (tinymce.isWebKit && (e.keyCode==37 ||e.keyCode==39)) {
					return Event.prevent(e);
				}
				
				if (e.keyCode == 13 || e.keyCode == 32) {
					onChange(e);
					return Event.cancel(e);
				}
			});

			t.onPostRender.dispatch(t, DOM.get(t.id));
		}
	});
})(tinymce);

(function(tinymce) {
	var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each;

	tinymce.create('tinymce.ui.MenuButton:tinymce.ui.Button', {
		MenuButton : function(id, s, ed) {
			this.parent(id, s, ed);

			this.onRenderMenu = new tinymce.util.Dispatcher(this);

			s.menu_container = s.menu_container || DOM.doc.body;
		},

		showMenu : function() {
			var t = this, p1, p2, e = DOM.get(t.id), m;

			if (t.isDisabled())
				return;

			if (!t.isMenuRendered) {
				t.renderMenu();
				t.isMenuRendered = true;
			}

			if (t.isMenuVisible)
				return t.hideMenu();

			p1 = DOM.getPos(t.settings.menu_container);
			p2 = DOM.getPos(e);

			m = t.menu;
			m.settings.offset_x = p2.x;
			m.settings.offset_y = p2.y;
			m.settings.vp_offset_x = p2.x;
			m.settings.vp_offset_y = p2.y;
			m.settings.keyboard_focus = t._focused;
			m.showMenu(0, e.firstChild.clientHeight);

			Event.add(DOM.doc, 'mousedown', t.hideMenu, t);
			t.setState('Selected', 1);

			t.isMenuVisible = 1;
		},

		renderMenu : function() {
			var t = this, m;

			m = t.settings.control_manager.createDropMenu(t.id + '_menu', {
				menu_line : 1,
				'class' : this.classPrefix + 'Menu',
				icons : t.settings.icons
			});

			m.onHideMenu.add(function() {
				t.hideMenu();
				t.focus();
			});

			t.onRenderMenu.dispatch(t, m);
			t.menu = m;
		},

		hideMenu : function(e) {
			var t = this;

			// Prevent double toogles by canceling the mouse click event to the button
			if (e && e.type == "mousedown" && DOM.getParent(e.target, function(e) {return e.id === t.id || e.id === t.id + '_open';}))
				return;

			if (!e || !DOM.getParent(e.target, '.mceMenu')) {
				t.setState('Selected', 0);
				Event.remove(DOM.doc, 'mousedown', t.hideMenu, t);
				if (t.menu)
					t.menu.hideMenu();
			}

			t.isMenuVisible = 0;
		},

		postRender : function() {
			var t = this, s = t.settings;

			Event.add(t.id, 'click', function() {
				if (!t.isDisabled()) {
					if (s.onclick)
						s.onclick(t.value);

					t.showMenu();
				}
			});
		}
	});
})(tinymce);

(function(tinymce) {
	var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each;

	tinymce.create('tinymce.ui.SplitButton:tinymce.ui.MenuButton', {
		SplitButton : function(id, s, ed) {
			this.parent(id, s, ed);
			this.classPrefix = 'mceSplitButton';
		},

		renderHTML : function() {
			var h, t = this, s = t.settings, h1;

			h = '<tbody><tr>';

			if (s.image)
				h1 = DOM.createHTML('img ', {src : s.image, role: 'presentation', 'class' : 'mceAction ' + s['class']});
			else
				h1 = DOM.createHTML('span', {'class' : 'mceAction ' + s['class']}, '');

			h1 += DOM.createHTML('span', {'class': 'mceVoiceLabel mceIconOnly', id: t.id + '_voice', style: 'display:none;'}, s.title);
			h += '<td >' + DOM.createHTML('a', {role: 'button', id : t.id + '_action', tabindex: '-1', href : 'javascript:;', 'class' : 'mceAction ' + s['class'], onclick : "return false;", onmousedown : 'return false;', title : s.title}, h1) + '</td>';
	
			h1 = DOM.createHTML('span', {'class' : 'mceOpen ' + s['class']}, '<span style="display:none;" class="mceIconOnly" aria-hidden="true">\u25BC</span>');
			h += '<td >' + DOM.createHTML('a', {role: 'button', id : t.id + '_open', tabindex: '-1', href : 'javascript:;', 'class' : 'mceOpen ' + s['class'], onclick : "return false;", onmousedown : 'return false;', title : s.title}, h1) + '</td>';

			h += '</tr></tbody>';
			h = DOM.createHTML('table', { role: 'presentation',   'class' : 'mceSplitButton mceSplitButtonEnabled ' + s['class'], cellpadding : '0', cellspacing : '0', title : s.title}, h);
			return DOM.createHTML('div', {id : t.id, role: 'button', tabindex: '0', 'aria-labelledby': t.id + '_voice', 'aria-haspopup': 'true'}, h);
		},

		postRender : function() {
			var t = this, s = t.settings, activate;

			if (s.onclick) {
				activate = function(evt) {
					if (!t.isDisabled()) {
						s.onclick(t.value);
						Event.cancel(evt);
					}
				};
				Event.add(t.id + '_action', 'click', activate);
				Event.add(t.id, ['click', 'keydown'], function(evt) {
					var DOM_VK_SPACE = 32, DOM_VK_ENTER = 14, DOM_VK_RETURN = 13, DOM_VK_UP = 38, DOM_VK_DOWN = 40;
					if ((evt.keyCode === 32 || evt.keyCode === 13 || evt.keyCode === 14) && !evt.altKey && !evt.ctrlKey && !evt.metaKey) {
						activate();
						Event.cancel(evt);
					} else if (evt.type === 'click' || evt.keyCode === DOM_VK_DOWN) {
						t.showMenu();
						Event.cancel(evt);
					}
				});
			}

			Event.add(t.id + '_open', 'click', function (evt) {
				t.showMenu();
				Event.cancel(evt);
			});
			Event.add([t.id, t.id + '_open'], 'focus', function() {t._focused = 1;});
			Event.add([t.id, t.id + '_open'], 'blur', function() {t._focused = 0;});

			// Old IE doesn't have hover on all elements
			if (tinymce.isIE6 || !DOM.boxModel) {
				Event.add(t.id, 'mouseover', function() {
					if (!DOM.hasClass(t.id, 'mceSplitButtonDisabled'))
						DOM.addClass(t.id, 'mceSplitButtonHover');
				});

				Event.add(t.id, 'mouseout', function() {
					if (!DOM.hasClass(t.id, 'mceSplitButtonDisabled'))
						DOM.removeClass(t.id, 'mceSplitButtonHover');
				});
			}
		},

		destroy : function() {
			this.parent();

			Event.clear(this.id + '_action');
			Event.clear(this.id + '_open');
			Event.clear(this.id);
		}
	});
})(tinymce);

(function(tinymce) {
	var DOM = tinymce.DOM, Event = tinymce.dom.Event, is = tinymce.is, each = tinymce.each;

	tinymce.create('tinymce.ui.ColorSplitButton:tinymce.ui.SplitButton', {
		ColorSplitButton : function(id, s, ed) {
			var t = this;

			t.parent(id, s, ed);

			t.settings = s = tinymce.extend({
				colors : '000000,993300,333300,003300,003366,000080,333399,333333,800000,FF6600,808000,008000,008080,0000FF,666699,808080,FF0000,FF9900,99CC00,339966,33CCCC,3366FF,800080,999999,FF00FF,FFCC00,FFFF00,00FF00,00FFFF,00CCFF,993366,C0C0C0,FF99CC,FFCC99,FFFF99,CCFFCC,CCFFFF,99CCFF,CC99FF,FFFFFF',
				grid_width : 8,
				default_color : '#888888'
			}, t.settings);

			t.onShowMenu = new tinymce.util.Dispatcher(t);

			t.onHideMenu = new tinymce.util.Dispatcher(t);

			t.value = s.default_color;
		},

		showMenu : function() {
			var t = this, r, p, e, p2;

			if (t.isDisabled())
				return;

			if (!t.isMenuRendered) {
				t.renderMenu();
				t.isMenuRendered = true;
			}

			if (t.isMenuVisible)
				return t.hideMenu();

			e = DOM.get(t.id);
			DOM.show(t.id + '_menu');
			DOM.addClass(e, 'mceSplitButtonSelected');
			p2 = DOM.getPos(e);
			DOM.setStyles(t.id + '_menu', {
				left : p2.x,
				top : p2.y + e.firstChild.clientHeight,
				zIndex : 200000
			});
			e = 0;

			Event.add(DOM.doc, 'mousedown', t.hideMenu, t);
			t.onShowMenu.dispatch(t);

			if (t._focused) {
				t._keyHandler = Event.add(t.id + '_menu', 'keydown', function(e) {
					if (e.keyCode == 27)
						t.hideMenu();
				});

				DOM.select('a', t.id + '_menu')[0].focus(); // Select first link
			}

			t.keyboardNav = new tinymce.ui.KeyboardNavigation({
				root: t.id + '_menu',
				items: DOM.select('a', t.id + '_menu'),
				onCancel: function() {
					t.hideMenu();
					t.focus();
				}
			});

			t.keyboardNav.focus();
			t.isMenuVisible = 1;
		},

		hideMenu : function(e) {
			var t = this;

			if (t.isMenuVisible) {
				// Prevent double toogles by canceling the mouse click event to the button
				if (e && e.type == "mousedown" && DOM.getParent(e.target, function(e) {return e.id === t.id + '_open';}))
					return;

				if (!e || !DOM.getParent(e.target, '.mceSplitButtonMenu')) {
					DOM.removeClass(t.id, 'mceSplitButtonSelected');
					Event.remove(DOM.doc, 'mousedown', t.hideMenu, t);
					Event.remove(t.id + '_menu', 'keydown', t._keyHandler);
					DOM.hide(t.id + '_menu');
				}

				t.isMenuVisible = 0;
				t.onHideMenu.dispatch();
				t.keyboardNav.destroy();
			}
		},

		renderMenu : function() {
			var t = this, m, i = 0, s = t.settings, n, tb, tr, w, context;

			w = DOM.add(s.menu_container, 'div', {role: 'listbox', id : t.id + '_menu', 'class' : s.menu_class + ' ' + s['class'], style : 'position:absolute;left:0;top:-1000px;'});
			m = DOM.add(w, 'div', {'class' : s['class'] + ' mceSplitButtonMenu'});
			DOM.add(m, 'span', {'class' : 'mceMenuLine'});

			n = DOM.add(m, 'table', {role: 'presentation', 'class' : 'mceColorSplitMenu'});
			tb = DOM.add(n, 'tbody');

			// Generate color grid
			i = 0;
			each(is(s.colors, 'array') ? s.colors : s.colors.split(','), function(c) {
				c = c.replace(/^#/, '');

				if (!i--) {
					tr = DOM.add(tb, 'tr');
					i = s.grid_width - 1;
				}

				n = DOM.add(tr, 'td');
				var settings = {
					href : 'javascript:;',
					style : {
						backgroundColor : '#' + c
					},
					'title': t.editor.getLang('colors.' + c, c),
					'data-mce-color' : '#' + c
				};

				// adding a proper ARIA role = button causes JAWS to read things incorrectly on IE.
				if (!tinymce.isIE ) {
					settings.role = 'option';
				}

				n = DOM.add(n, 'a', settings);

				if (t.editor.forcedHighContrastMode) {
					n = DOM.add(n, 'canvas', { width: 16, height: 16, 'aria-hidden': 'true' });
					if (n.getContext && (context = n.getContext("2d"))) {
						context.fillStyle = '#' + c;
						context.fillRect(0, 0, 16, 16);
					} else {
						// No point leaving a canvas element around if it's not supported for drawing on anyway.
						DOM.remove(n);
					}
				}
			});

			if (s.more_colors_func) {
				n = DOM.add(tb, 'tr');
				n = DOM.add(n, 'td', {colspan : s.grid_width, 'class' : 'mceMoreColors'});
				n = DOM.add(n, 'a', {role: 'option', id : t.id + '_more', href : 'javascript:;', onclick : 'return false;', 'class' : 'mceMoreColors'}, s.more_colors_title);

				Event.add(n, 'click', function(e) {
					s.more_colors_func.call(s.more_colors_scope || this);
					return Event.cancel(e); // Cancel to fix onbeforeunload problem
				});
			}

			DOM.addClass(m, 'mceColorSplitMenu');

			// Prevent IE from scrolling and hindering click to occur #4019
			Event.add(t.id + '_menu', 'mousedown', function(e) {return Event.cancel(e);});

			Event.add(t.id + '_menu', 'click', function(e) {
				var c;

				e = DOM.getParent(e.target, 'a', tb);

				if (e && e.nodeName.toLowerCase() == 'a' && (c = e.getAttribute('data-mce-color')))
					t.setColor(c);

				return false; // Prevent IE auto save warning
			});

			return w;
		},

		setColor : function(c) {
			this.displayColor(c);
			this.hideMenu();
			this.settings.onselect(c);
		},
		
		displayColor : function(c) {
			var t = this;

			DOM.setStyle(t.id + '_preview', 'backgroundColor', c);

			t.value = c;
		},

		postRender : function() {
			var t = this, id = t.id;

			t.parent();
			DOM.add(id + '_action', 'div', {id : id + '_preview', 'class' : 'mceColorPreview'});
			DOM.setStyle(t.id + '_preview', 'backgroundColor', t.value);
		},

		destroy : function() {
			var self = this;

			self.parent();

			Event.clear(self.id + '_menu');
			Event.clear(self.id + '_more');
			DOM.remove(self.id + '_menu');

			if (self.keyboardNav) {
				self.keyboardNav.destroy();
			}
		}
	});
})(tinymce);

(function(tinymce) {
// Shorten class names
var dom = tinymce.DOM, each = tinymce.each, Event = tinymce.dom.Event;
tinymce.create('tinymce.ui.ToolbarGroup:tinymce.ui.Container', {
	renderHTML : function() {
		var t = this, h = [], controls = t.controls, each = tinymce.each, settings = t.settings;

		h.push('<div id="' + t.id + '" role="group" aria-labelledby="' + t.id + '_voice">');
		//TODO: ACC test this out - adding a role = application for getting the landmarks working well.
		h.push("<span role='application'>");
		h.push('<span id="' + t.id + '_voice" class="mceVoiceLabel" style="display:none;">' + dom.encode(settings.name) + '</span>');
		each(controls, function(toolbar) {
			h.push(toolbar.renderHTML());
		});
		h.push("</span>");
		h.push('</div>');

		return h.join('');
	},
	
	focus : function() {
		var t = this;
		dom.get(t.id).focus();
	},
	
	postRender : function() {
		var t = this, items = [];

		each(t.controls, function(toolbar) {
			each (toolbar.controls, function(control) {
				if (control.id) {
					items.push(control);
				}
			});
		});

		t.keyNav = new tinymce.ui.KeyboardNavigation({
			root: t.id,
			items: items,
			onCancel: function() {
				//Move focus if webkit so that navigation back will read the item.
				if (tinymce.isWebKit) {
					dom.get(t.editor.id+"_ifr").focus();
				}
				t.editor.focus();
			},
			excludeFromTabOrder: !t.settings.tab_focus_toolbar
		});
	},
	
	destroy : function() {
		var self = this;

		self.parent();
		self.keyNav.destroy();
		Event.clear(self.id);
	}
});
})(tinymce);

(function(tinymce) {
// Shorten class names
var dom = tinymce.DOM, each = tinymce.each;
tinymce.create('tinymce.ui.Toolbar:tinymce.ui.Container', {
	renderHTML : function() {
		var t = this, h = '', c, co, s = t.settings, i, pr, nx, cl;

		cl = t.controls;
		for (i=0; i<cl.length; i++) {
			// Get current control, prev control, next control and if the control is a list box or not
			co = cl[i];
			pr = cl[i - 1];
			nx = cl[i + 1];

			// Add toolbar start
			if (i === 0) {
				c = 'mceToolbarStart';

				if (co.Button)
					c += ' mceToolbarStartButton';
				else if (co.SplitButton)
					c += ' mceToolbarStartSplitButton';
				else if (co.ListBox)
					c += ' mceToolbarStartListBox';

				h += dom.createHTML('td', {'class' : c}, dom.createHTML('span', null, '<!-- IE -->'));
			}

			// Add toolbar end before list box and after the previous button
			// This is to fix the o2k7 editor skins
			if (pr && co.ListBox) {
				if (pr.Button || pr.SplitButton)
					h += dom.createHTML('td', {'class' : 'mceToolbarEnd'}, dom.createHTML('span', null, '<!-- IE -->'));
			}

			// Render control HTML

			// IE 8 quick fix, needed to propertly generate a hit area for anchors
			if (dom.stdMode)
				h += '<td style="position: relative">' + co.renderHTML() + '</td>';
			else
				h += '<td>' + co.renderHTML() + '</td>';

			// Add toolbar start after list box and before the next button
			// This is to fix the o2k7 editor skins
			if (nx && co.ListBox) {
				if (nx.Button || nx.SplitButton)
					h += dom.createHTML('td', {'class' : 'mceToolbarStart'}, dom.createHTML('span', null, '<!-- IE -->'));
			}
		}

		c = 'mceToolbarEnd';

		if (co.Button)
			c += ' mceToolbarEndButton';
		else if (co.SplitButton)
			c += ' mceToolbarEndSplitButton';
		else if (co.ListBox)
			c += ' mceToolbarEndListBox';

		h += dom.createHTML('td', {'class' : c}, dom.createHTML('span', null, '<!-- IE -->'));

		return dom.createHTML('table', {id : t.id, 'class' : 'mceToolbar' + (s['class'] ? ' ' + s['class'] : ''), cellpadding : '0', cellspacing : '0', align : t.settings.align || '', role: 'presentation', tabindex: '-1'}, '<tbody><tr>' + h + '</tr></tbody>');
	}
});
})(tinymce);

(function(tinymce) {
	var Dispatcher = tinymce.util.Dispatcher, each = tinymce.each;

	tinymce.create('tinymce.AddOnManager', {
		AddOnManager : function() {
			var self = this;

			self.items = [];
			self.urls = {};
			self.lookup = {};
			self.onAdd = new Dispatcher(self);
		},

		get : function(n) {
			if (this.lookup[n]) {
				return this.lookup[n].instance;
			} else {
				return undefined;
			}
		},

		dependencies : function(n) {
			var result;
			if (this.lookup[n]) {
				result = this.lookup[n].dependencies;
			}
			return result || [];
		},

		requireLangPack : function(n) {
			var s = tinymce.settings;

			if (s && s.language && s.language_load !== false)
				tinymce.ScriptLoader.add(this.urls[n] + '/langs/' + s.language + '.js');
		},

		add : function(id, o, dependencies) {
			this.items.push(o);
			this.lookup[id] = {instance:o, dependencies:dependencies};
			this.onAdd.dispatch(this, id, o);

			return o;
		},
		createUrl: function(baseUrl, dep) {
			if (typeof dep === "object") {
				return dep
			} else {
				return {prefix: baseUrl.prefix, resource: dep, suffix: baseUrl.suffix};
			}
		},

		addComponents: function(pluginName, scripts) {
			var pluginUrl = this.urls[pluginName];
			tinymce.each(scripts, function(script){
				tinymce.ScriptLoader.add(pluginUrl+"/"+script);	
			});
		},

		load : function(n, u, cb, s) {
			var t = this, url = u;

			function loadDependencies() {
				var dependencies = t.dependencies(n);
				tinymce.each(dependencies, function(dep) {
					var newUrl = t.createUrl(u, dep);
					t.load(newUrl.resource, newUrl, undefined, undefined);
				});
				if (cb) {
					if (s) {
						cb.call(s);
					} else {
						cb.call(tinymce.ScriptLoader);
					}
				}
			}

			if (t.urls[n])
				return;
			if (typeof u === "object")
				url = u.prefix + u.resource + u.suffix;

			if (url.indexOf('/') !== 0 && url.indexOf('://') == -1)
				url = tinymce.baseURL + '/' + url;

			t.urls[n] = url.substring(0, url.lastIndexOf('/'));

			if (t.lookup[n]) {
				loadDependencies();
			} else {
				tinymce.ScriptLoader.add(url, loadDependencies, s);
			}
		}
	});

	// Create plugin and theme managers
	tinymce.PluginManager = new tinymce.AddOnManager();
	tinymce.ThemeManager = new tinymce.AddOnManager();
}(tinymce));

(function(tinymce) {
	// Shorten names
	var each = tinymce.each, extend = tinymce.extend,
		DOM = tinymce.DOM, Event = tinymce.dom.Event,
		ThemeManager = tinymce.ThemeManager, PluginManager = tinymce.PluginManager,
		explode = tinymce.explode,
		Dispatcher = tinymce.util.Dispatcher, undef, instanceCounter = 0;

	// Setup some URLs where the editor API is located and where the document is
	tinymce.documentBaseURL = window.location.href.replace(/[\?#].*$/, '').replace(/[\/\\][^\/]+$/, '');
	if (!/[\/\\]$/.test(tinymce.documentBaseURL))
		tinymce.documentBaseURL += '/';

	tinymce.baseURL = new tinymce.util.URI(tinymce.documentBaseURL).toAbsolute(tinymce.baseURL);

	tinymce.baseURI = new tinymce.util.URI(tinymce.baseURL);

	// Add before unload listener
	// This was required since IE was leaking memory if you added and removed beforeunload listeners
	// with attachEvent/detatchEvent so this only adds one listener and instances can the attach to the onBeforeUnload event
	tinymce.onBeforeUnload = new Dispatcher(tinymce);

	// Must be on window or IE will leak if the editor is placed in frame or iframe
	Event.add(window, 'beforeunload', function(e) {
		tinymce.onBeforeUnload.dispatch(tinymce, e);
	});

	tinymce.onAddEditor = new Dispatcher(tinymce);

	tinymce.onRemoveEditor = new Dispatcher(tinymce);

	tinymce.EditorManager = extend(tinymce, {
		editors : [],

		i18n : {},

		activeEditor : null,

		init : function(s) {
			var t = this, pl, sl = tinymce.ScriptLoader, e, el = [], ed;

			function createId(elm) {
				var id = elm.id;
	
				// Use element id, or unique name or generate a unique id
				if (!id) {
					id = elm.name;
	
					if (id && !DOM.get(id)) {
						id = elm.name;
					} else {
						// Generate unique name
						id = DOM.uniqueId();
					}

					elm.setAttribute('id', id);
				}

				return id;
			};

			function execCallback(se, n, s) {
				var f = se[n];

				if (!f)
					return;

				if (tinymce.is(f, 'string')) {
					s = f.replace(/\.\w+$/, '');
					s = s ? tinymce.resolve(s) : 0;
					f = tinymce.resolve(f);
				}

				return f.apply(s || this, Array.prototype.slice.call(arguments, 2));
			};

			function hasClass(n, c) {
				return c.constructor === RegExp ? c.test(n.className) : DOM.hasClass(n, c);
			};

			t.settings = s;

			// Legacy call
			Event.bind(window, 'ready', function() {
				var l, co;

				execCallback(s, 'onpageload');

				switch (s.mode) {
					case "exact":
						l = s.elements || '';

						if(l.length > 0) {
							each(explode(l), function(v) {
								if (DOM.get(v)) {
									ed = new tinymce.Editor(v, s);
									el.push(ed);
									ed.render(1);
								} else {
									each(document.forms, function(f) {
										each(f.elements, function(e) {
											if (e.name === v) {
												v = 'mce_editor_' + instanceCounter++;
												DOM.setAttrib(e, 'id', v);

												ed = new tinymce.Editor(v, s);
												el.push(ed);
												ed.render(1);
											}
										});
									});
								}
							});
						}
						break;

					case "textareas":
					case "specific_textareas":
						each(DOM.select('textarea'), function(elm) {
							if (s.editor_deselector && hasClass(elm, s.editor_deselector))
								return;

							if (!s.editor_selector || hasClass(elm, s.editor_selector)) {
								ed = new tinymce.Editor(createId(elm), s);
								el.push(ed);
								ed.render(1);
							}
						});
						break;
					
					default:
						if (s.types) {
							// Process type specific selector
							each(s.types, function(type) {
								each(DOM.select(type.selector), function(elm) {
									var editor = new tinymce.Editor(createId(elm), tinymce.extend({}, s, type));
									el.push(editor);
									editor.render(1);
								});
							});
						} else if (s.selector) {
							// Process global selector
							each(DOM.select(s.selector), function(elm) {
								var editor = new tinymce.Editor(createId(elm), s);
								el.push(editor);
								editor.render(1);
							});
						}
				}

				// Call onInit when all editors are initialized
				if (s.oninit) {
					l = co = 0;

					each(el, function(ed) {
						co++;

						if (!ed.initialized) {
							// Wait for it
							ed.onInit.add(function() {
								l++;

								// All done
								if (l == co)
									execCallback(s, 'oninit');
							});
						} else
							l++;

						// All done
						if (l == co)
							execCallback(s, 'oninit');					
					});
				}
			});
		},

		get : function(id) {
			if (id === undef)
				return this.editors;

			if (!this.editors.hasOwnProperty(id))
				return undef;

			return this.editors[id];
		},

		getInstanceById : function(id) {
			return this.get(id);
		},

		add : function(editor) {
			var self = this, editors = self.editors;

			// Add named and index editor instance
			editors[editor.id] = editor;
			editors.push(editor);

			self._setActive(editor);
			self.onAddEditor.dispatch(self, editor);


			// Patch the tinymce.Editor instance with jQuery adapter logic
			if (tinymce.adapter)
				tinymce.adapter.patchEditor(editor);


			return editor;
		},

		remove : function(editor) {
			var t = this, i, editors = t.editors;

			// Not in the collection
			if (!editors[editor.id])
				return null;

			delete editors[editor.id];

			for (i = 0; i < editors.length; i++) {
				if (editors[i] == editor) {
					editors.splice(i, 1);
					break;
				}
			}

			// Select another editor since the active one was removed
			if (t.activeEditor == editor)
				t._setActive(editors[0]);

			editor.destroy();
			t.onRemoveEditor.dispatch(t, editor);

			return editor;
		},

		execCommand : function(c, u, v) {
			var t = this, ed = t.get(v), w;

			function clr() {
				ed.destroy();
				w.detachEvent('onunload', clr);
				w = w.tinyMCE = w.tinymce = null; // IE leak
			};

			// Manager commands
			switch (c) {
				case "mceFocus":
					ed.focus();
					return true;

				case "mceAddEditor":
				case "mceAddControl":
					if (!t.get(v))
						new tinymce.Editor(v, t.settings).render();

					return true;

				case "mceAddFrameControl":
					w = v.window;

					// Add tinyMCE global instance and tinymce namespace to specified window
					w.tinyMCE = tinyMCE;
					w.tinymce = tinymce;

					tinymce.DOM.doc = w.document;
					tinymce.DOM.win = w;

					ed = new tinymce.Editor(v.element_id, v);
					ed.render();

					// Fix IE memory leaks
					if (tinymce.isIE) {
						w.attachEvent('onunload', clr);
					}

					v.page_window = null;

					return true;

				case "mceRemoveEditor":
				case "mceRemoveControl":
					if (ed)
						ed.remove();

					return true;

				case 'mceToggleEditor':
					if (!ed) {
						t.execCommand('mceAddControl', 0, v);
						return true;
					}

					if (ed.isHidden())
						ed.show();
					else
						ed.hide();

					return true;
			}

			// Run command on active editor
			if (t.activeEditor)
				return t.activeEditor.execCommand(c, u, v);

			return false;
		},

		execInstanceCommand : function(id, c, u, v) {
			var ed = this.get(id);

			if (ed)
				return ed.execCommand(c, u, v);

			return false;
		},

		triggerSave : function() {
			each(this.editors, function(e) {
				e.save();
			});
		},

		addI18n : function(p, o) {
			var lo, i18n = this.i18n;

			if (!tinymce.is(p, 'string')) {
				each(p, function(o, lc) {
					each(o, function(o, g) {
						each(o, function(o, k) {
							if (g === 'common')
								i18n[lc + '.' + k] = o;
							else
								i18n[lc + '.' + g + '.' + k] = o;
						});
					});
				});
			} else {
				each(o, function(o, k) {
					i18n[p + '.' + k] = o;
				});
			}
		},

		// Private methods

		_setActive : function(editor) {
			this.selectedInstance = this.activeEditor = editor;
		}
	});
})(tinymce);

(function(tinymce) {
	// Shorten these names
	var DOM = tinymce.DOM, Event = tinymce.dom.Event, extend = tinymce.extend,
		each = tinymce.each, isGecko = tinymce.isGecko,
		isIE = tinymce.isIE, isWebKit = tinymce.isWebKit, is = tinymce.is,
		ThemeManager = tinymce.ThemeManager, PluginManager = tinymce.PluginManager,
		explode = tinymce.explode;

	tinymce.create('tinymce.Editor', {
		Editor : function(id, settings) {
			var self = this, TRUE = true;

			self.settings = settings = extend({
				id : id,
				language : 'en',
				theme : 'advanced',
				skin : 'default',
				delta_width : 0,
				delta_height : 0,
				popup_css : '',
				plugins : '',
				document_base_url : tinymce.documentBaseURL,
				add_form_submit_trigger : TRUE,
				submit_patch : TRUE,
				add_unload_trigger : TRUE,
				convert_urls : TRUE,
				relative_urls : TRUE,
				remove_script_host : TRUE,
				table_inline_editing : false,
				object_resizing : TRUE,
				accessibility_focus : TRUE,
				doctype : tinymce.isIE6 ? '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">' : '<!DOCTYPE>', // Use old doctype on IE 6 to avoid horizontal scroll
				visual : TRUE,
				font_size_style_values : 'xx-small,x-small,small,medium,large,x-large,xx-large',
				font_size_legacy_values : 'xx-small,small,medium,large,x-large,xx-large,300%', // See: http://www.w3.org/TR/CSS2/fonts.html#propdef-font-size
				apply_source_formatting : TRUE,
				directionality : 'ltr',
				forced_root_block : 'p',
				hidden_input : TRUE,
				padd_empty_editor : TRUE,
				render_ui : TRUE,
				indentation : '30px',
				fix_table_elements : TRUE,
				inline_styles : TRUE,
				convert_fonts_to_spans : TRUE,
				indent : 'simple',
				indent_before : 'p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,ul,li,area,table,thead,tfoot,tbody,tr,section,article,hgroup,aside,figure,option,optgroup,datalist',
				indent_after : 'p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,ul,li,area,table,thead,tfoot,tbody,tr,section,article,hgroup,aside,figure,option,optgroup,datalist',
				validate : TRUE,
				entity_encoding : 'named',
				url_converter : self.convertURL,
				url_converter_scope : self,
				ie7_compat : TRUE
			}, settings);

			self.id = self.editorId = id;

			self.isNotDirty = false;

			self.plugins = {};

			self.documentBaseURI = new tinymce.util.URI(settings.document_base_url || tinymce.documentBaseURL, {
				base_uri : tinyMCE.baseURI
			});

			self.baseURI = tinymce.baseURI;

			self.contentCSS = [];

			self.contentStyles = [];

			// Creates all events like onClick, onSetContent etc see Editor.Events.js for the actual logic
			self.setupEvents();

			// Internal command handler objects
			self.execCommands = {};
			self.queryStateCommands = {};
			self.queryValueCommands = {};

			// Call setup
			self.execCallback('setup', self);
		},

		render : function(nst) {
			var t = this, s = t.settings, id = t.id, sl = tinymce.ScriptLoader;

			// Page is not loaded yet, wait for it
			if (!Event.domLoaded) {
				Event.add(window, 'ready', function() {
					t.render();
				});
				return;
			}

			tinyMCE.settings = s;

			// Element not found, then skip initialization
			if (!t.getElement())
				return;

			// Is a iPad/iPhone and not on iOS5, then skip initialization. We need to sniff 
			// here since the browser says it has contentEditable support but there is no visible caret.
			if (tinymce.isIDevice && !tinymce.isIOS5)
				return;

			// Add hidden input for non input elements inside form elements
			if (!/TEXTAREA|INPUT/i.test(t.getElement().nodeName) && s.hidden_input && DOM.getParent(id, 'form'))
				DOM.insertAfter(DOM.create('input', {type : 'hidden', name : id}), id);

			// Hide target element early to prevent content flashing
			if (!s.content_editable) {
				t.orgVisibility = t.getElement().style.visibility;
				t.getElement().style.visibility = 'hidden';
			}

			if (tinymce.WindowManager)
				t.windowManager = new tinymce.WindowManager(t);

			if (s.encoding == 'xml') {
				t.onGetContent.add(function(ed, o) {
					if (o.save)
						o.content = DOM.encode(o.content);
				});
			}

			if (s.add_form_submit_trigger) {
				t.onSubmit.addToTop(function() {
					if (t.initialized) {
						t.save();
						t.isNotDirty = 1;
					}
				});
			}

			if (s.add_unload_trigger) {
				t._beforeUnload = tinyMCE.onBeforeUnload.add(function() {
					if (t.initialized && !t.destroyed && !t.isHidden())
						t.save({format : 'raw', no_events : true});
				});
			}

			tinymce.addUnload(t.destroy, t);

			if (s.submit_patch) {
				t.onBeforeRenderUI.add(function() {
					var n = t.getElement().form;

					if (!n)
						return;

					// Already patched
					if (n._mceOldSubmit)
						return;

					// Check page uses id="submit" or name="submit" for it's submit button
					if (!n.submit.nodeType && !n.submit.length) {
						t.formElement = n;
						n._mceOldSubmit = n.submit;
						n.submit = function() {
							// Save all instances
							tinymce.triggerSave();
							t.isNotDirty = 1;

							return t.formElement._mceOldSubmit(t.formElement);
						};
					}

					n = null;
				});
			}

			// Load scripts
			function loadScripts() {
				if (s.language && s.language_load !== false)
					sl.add(tinymce.baseURL + '/langs/' + s.language + '.js');

				if (s.theme && typeof s.theme != "function" && s.theme.charAt(0) != '-' && !ThemeManager.urls[s.theme])
					ThemeManager.load(s.theme, 'themes/' + s.theme + '/editor_template' + tinymce.suffix + '.js');

				each(explode(s.plugins), function(p) {
					if (p &&!PluginManager.urls[p]) {
						if (p.charAt(0) == '-') {
							p = p.substr(1, p.length);
							var dependencies = PluginManager.dependencies(p);
							each(dependencies, function(dep) {
								var defaultSettings = {prefix:'plugins/', resource: dep, suffix:'/editor_plugin' + tinymce.suffix + '.js'};
								dep = PluginManager.createUrl(defaultSettings, dep);
								PluginManager.load(dep.resource, dep);
							});
						} else {
							// Skip safari plugin, since it is removed as of 3.3b1
							if (p == 'safari') {
								return;
							}
							PluginManager.load(p, {prefix:'plugins/', resource: p, suffix:'/editor_plugin' + tinymce.suffix + '.js'});
						}
					}
				});

				// Init when que is loaded
				sl.loadQueue(function() {
					if (!t.removed)
						t.init();
				});
			};

			loadScripts();
		},

		init : function() {
			var n, t = this, s = t.settings, w, h, mh, e = t.getElement(), o, ti, u, bi, bc, re, i, initializedPlugins = [];

			tinymce.add(t);

			s.aria_label = s.aria_label || DOM.getAttrib(e, 'aria-label', t.getLang('aria.rich_text_area'));

			if (s.theme) {
				if (typeof s.theme != "function") {
					s.theme = s.theme.replace(/-/, '');
					o = ThemeManager.get(s.theme);
					t.theme = new o();

					if (t.theme.init)
						t.theme.init(t, ThemeManager.urls[s.theme] || tinymce.documentBaseURL.replace(/\/$/, ''));
				} else {
					t.theme = s.theme;
				}
			}

			function initPlugin(p) {
				var c = PluginManager.get(p), u = PluginManager.urls[p] || tinymce.documentBaseURL.replace(/\/$/, ''), po;
				if (c && tinymce.inArray(initializedPlugins,p) === -1) {
					each(PluginManager.dependencies(p), function(dep){
						initPlugin(dep);
					});
					po = new c(t, u);

					t.plugins[p] = po;

					if (po.init) {
						po.init(t, u);
						initializedPlugins.push(p);
					}
				}
			}
			
			// Create all plugins
			each(explode(s.plugins.replace(/\-/g, '')), initPlugin);

			// Setup popup CSS path(s)
			if (s.popup_css !== false) {
				if (s.popup_css)
					s.popup_css = t.documentBaseURI.toAbsolute(s.popup_css);
				else
					s.popup_css = t.baseURI.toAbsolute("themes/" + s.theme + "/skins/" + s.skin + "/dialog.css");
			}

			if (s.popup_css_add)
				s.popup_css += ',' + t.documentBaseURI.toAbsolute(s.popup_css_add);

			t.controlManager = new tinymce.ControlManager(t);

			// Enables users to override the control factory
			t.onBeforeRenderUI.dispatch(t, t.controlManager);

			// Measure box
			if (s.render_ui && t.theme) {
				t.orgDisplay = e.style.display;

				if (typeof s.theme != "function") {
					w = s.width || e.style.width || e.offsetWidth;
					h = s.height || e.style.height || e.offsetHeight;
					mh = s.min_height || 100;
					re = /^[0-9\.]+(|px)$/i;

					if (re.test('' + w))
						w = Math.max(parseInt(w, 10) + (o.deltaWidth || 0), 100);

					if (re.test('' + h))
						h = Math.max(parseInt(h, 10) + (o.deltaHeight || 0), mh);

					// Render UI
					o = t.theme.renderUI({
						targetNode : e,
						width : w,
						height : h,
						deltaWidth : s.delta_width,
						deltaHeight : s.delta_height
					});

					// Resize editor
					DOM.setStyles(o.sizeContainer || o.editorContainer, {
						width : w,
						height : h
					});

					h = (o.iframeHeight || h) + (typeof(h) == 'number' ? (o.deltaHeight || 0) : '');
					if (h < mh)
						h = mh;
				} else {
					o = s.theme(t, e);

					// Convert element type to id:s
					if (o.editorContainer.nodeType) {
						o.editorContainer = o.editorContainer.id = o.editorContainer.id || t.id + "_parent";
					}

					// Convert element type to id:s
					if (o.iframeContainer.nodeType) {
						o.iframeContainer = o.iframeContainer.id = o.iframeContainer.id || t.id + "_iframecontainer";
					}

					// Use specified iframe height or the targets offsetHeight
					h = o.iframeHeight || e.offsetHeight;

					// Store away the selection when it's changed to it can be restored later with a editor.focus() call
					if (isIE) {
						t.onInit.add(function(ed) {
							ed.dom.bind(ed.getBody(), 'beforedeactivate keydown', function() {
								ed.lastIERng = ed.selection.getRng();
							});
						});
					}
				}

				t.editorContainer = o.editorContainer;
			}

			// Load specified content CSS last
			if (s.content_css) {
				each(explode(s.content_css), function(u) {
					t.contentCSS.push(t.documentBaseURI.toAbsolute(u));
				});
			}

			// Load specified content CSS last
			if (s.content_style) {
				t.contentStyles.push(s.content_style);
			}

			// Content editable mode ends here
			if (s.content_editable) {
				e = n = o = null; // Fix IE leak
				return t.initContentBody();
			}

			// User specified a document.domain value
			if (document.domain && location.hostname != document.domain)
				tinymce.relaxedDomain = document.domain;

			t.iframeHTML = s.doctype + '<html><head xmlns="http://www.w3.org/1999/xhtml">';

			// We only need to override paths if we have to
			// IE has a bug where it remove site absolute urls to relative ones if this is specified
			if (s.document_base_url != tinymce.documentBaseURL)
				t.iframeHTML += '<base href="' + t.documentBaseURI.getURI() + '" />';

			// IE8 doesn't support carets behind images setting ie7_compat would force IE8+ to run in IE7 compat mode.
			if (tinymce.isIE8) {
				if (s.ie7_compat)
					t.iframeHTML += '<meta http-equiv="X-UA-Compatible" content="IE=7" />';
				else
					t.iframeHTML += '<meta http-equiv="X-UA-Compatible" content="IE=edge" />';
			}

			t.iframeHTML += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';

			// Load the CSS by injecting them into the HTML this will reduce "flicker"
			for (i = 0; i < t.contentCSS.length; i++) {
				t.iframeHTML += '<link type="text/css" rel="stylesheet" href="' + t.contentCSS[i] + '" />';
			}

			t.contentCSS = [];

			bi = s.body_id || 'tinymce';
			if (bi.indexOf('=') != -1) {
				bi = t.getParam('body_id', '', 'hash');
				bi = bi[t.id] || bi;
			}

			bc = s.body_class || '';
			if (bc.indexOf('=') != -1) {
				bc = t.getParam('body_class', '', 'hash');
				bc = bc[t.id] || '';
			}

			t.iframeHTML += '</head><body id="' + bi + '" class="mceContentBody ' + bc + '" onload="window.parent.tinyMCE.get(\'' + t.id + '\').onLoad.dispatch();"><br></body></html>';

			// Domain relaxing enabled, then set document domain
			if (tinymce.relaxedDomain && (isIE || (tinymce.isOpera && parseFloat(opera.version()) < 11))) {
				// We need to write the contents here in IE since multiple writes messes up refresh button and back button
				u = 'javascript:(function(){document.open();document.domain="' + document.domain + '";var ed = window.parent.tinyMCE.get("' + t.id + '");document.write(ed.iframeHTML);document.close();ed.initContentBody();})()';
			}

			// Create iframe
			// TODO: ACC add the appropriate description on this.
			n = DOM.add(o.iframeContainer, 'iframe', { 
				id : t.id + "_ifr",
				src : u || 'javascript:""', // Workaround for HTTPS warning in IE6/7
				frameBorder : '0',
				allowTransparency : "true",
				title : s.aria_label,
				style : {
					width : '100%',
					height : h,
					display : 'block' // Important for Gecko to render the iframe correctly
				}
			});

			t.contentAreaContainer = o.iframeContainer;

			if (o.editorContainer) {
				DOM.get(o.editorContainer).style.display = t.orgDisplay;
			}

			// Restore visibility on target element
			e.style.visibility = t.orgVisibility;

			DOM.get(t.id).style.display = 'none';
			DOM.setAttrib(t.id, 'aria-hidden', true);

			if (!tinymce.relaxedDomain || !u)
				t.initContentBody();

			e = n = o = null; // Cleanup
		},

		initContentBody : function() {
			var self = this, settings = self.settings, targetElm = DOM.get(self.id), doc = self.getDoc(), html, body, contentCssText;

			// Setup iframe body
			if ((!isIE || !tinymce.relaxedDomain) && !settings.content_editable) {
				doc.open();
				doc.write(self.iframeHTML);
				doc.close();

				if (tinymce.relaxedDomain)
					doc.domain = tinymce.relaxedDomain;
			}

			if (settings.content_editable) {
				DOM.addClass(targetElm, 'mceContentBody');
				self.contentDocument = doc = settings.content_document || document;
				self.contentWindow = settings.content_window || window;
				self.bodyElement = targetElm;

				// Prevent leak in IE
				settings.content_document = settings.content_window = null;
			}

			// It will not steal focus while setting contentEditable
			body = self.getBody();
			body.disabled = true;

			if (!settings.readonly)
				body.contentEditable = self.getParam('content_editable_state', true);

			body.disabled = false;

			self.schema = new tinymce.html.Schema(settings);

			self.dom = new tinymce.dom.DOMUtils(doc, {
				keep_values : true,
				url_converter : self.convertURL,
				url_converter_scope : self,
				hex_colors : settings.force_hex_style_colors,
				class_filter : settings.class_filter,
				update_styles : true,
				root_element : settings.content_editable ? self.id : null,
				schema : self.schema
			});

			self.parser = new tinymce.html.DomParser(settings, self.schema);

			// Convert src and href into data-mce-src, data-mce-href and data-mce-style
			self.parser.addAttributeFilter('src,href,style', function(nodes, name) {
				var i = nodes.length, node, dom = self.dom, value, internalName;

				while (i--) {
					node = nodes[i];
					value = node.attr(name);
					internalName = 'data-mce-' + name;

					// Add internal attribute if we need to we don't on a refresh of the document
					if (!node.attributes.map[internalName]) {	
						if (name === "style")
							node.attr(internalName, dom.serializeStyle(dom.parseStyle(value), node.name));
						else
							node.attr(internalName, self.convertURL(value, name, node.name));
					}
				}
			});

			// Keep scripts from executing
			self.parser.addNodeFilter('script', function(nodes, name) {
				var i = nodes.length, node;

				while (i--) {
					node = nodes[i];
					node.attr('type', 'mce-' + (node.attr('type') || 'text/javascript'));
				}
			});

			self.parser.addNodeFilter('#cdata', function(nodes, name) {
				var i = nodes.length, node;

				while (i--) {
					node = nodes[i];
					node.type = 8;
					node.name = '#comment';
					node.value = '[CDATA[' + node.value + ']]';
				}
			});

			self.parser.addNodeFilter('p,h1,h2,h3,h4,h5,h6,div', function(nodes, name) {
				var i = nodes.length, node, nonEmptyElements = self.schema.getNonEmptyElements();

				while (i--) {
					node = nodes[i];

					if (node.isEmpty(nonEmptyElements))
						node.empty().append(new tinymce.html.Node('br', 1)).shortEnded = true;
				}
			});

			self.serializer = new tinymce.dom.Serializer(settings, self.dom, self.schema);

			self.selection = new tinymce.dom.Selection(self.dom, self.getWin(), self.serializer, self);

			self.formatter = new tinymce.Formatter(self);

			self.undoManager = new tinymce.UndoManager(self);

			self.forceBlocks = new tinymce.ForceBlocks(self);
			self.enterKey = new tinymce.EnterKey(self);
			self.editorCommands = new tinymce.EditorCommands(self);

			self.onExecCommand.add(function(editor, command) {
				// Don't refresh the select lists until caret move
				if (!/^(FontName|FontSize)$/.test(command))
					self.nodeChanged();
			});

			// Pass through
			self.serializer.onPreProcess.add(function(se, o) {
				return self.onPreProcess.dispatch(self, o, se);
			});

			self.serializer.onPostProcess.add(function(se, o) {
				return self.onPostProcess.dispatch(self, o, se);
			});

			self.onPreInit.dispatch(self);

			if (!settings.browser_spellcheck && !settings.gecko_spellcheck)
				doc.body.spellcheck = false;

			if (!settings.readonly) {
				self.bindNativeEvents();
			}

			self.controlManager.onPostRender.dispatch(self, self.controlManager);
			self.onPostRender.dispatch(self);

			self.quirks = tinymce.util.Quirks(self);

			if (settings.directionality)
				body.dir = settings.directionality;

			if (settings.nowrap)
				body.style.whiteSpace = "nowrap";

			if (settings.protect) {
				self.onBeforeSetContent.add(function(ed, o) {
					each(settings.protect, function(pattern) {
						o.content = o.content.replace(pattern, function(str) {
							return '<!--mce:protected ' + escape(str) + '-->';
						});
					});
				});
			}

			// Add visual aids when new contents is added
			self.onSetContent.add(function() {
				self.addVisual(self.getBody());
			});

			// Remove empty contents
			if (settings.padd_empty_editor) {
				self.onPostProcess.add(function(ed, o) {
					o.content = o.content.replace(/^(<p[^>]*>(&nbsp;|&#160;|\s|\u00a0|)<\/p>[\r\n]*|<br \/>[\r\n]*)$/, '');
				});
			}

			self.load({initial : true, format : 'html'});
			self.startContent = self.getContent({format : 'raw'});

			self.initialized = true;

			self.onInit.dispatch(self);
			self.execCallback('setupcontent_callback', self.id, body, doc);
			self.execCallback('init_instance_callback', self);
			self.focus(true);
			self.nodeChanged({initial : true});

			// Add editor specific CSS styles
			if (self.contentStyles.length > 0) {
				contentCssText = '';

				each(self.contentStyles, function(style) {
					contentCssText += style + "\r\n";
				});

				self.dom.addStyle(contentCssText);
			}

			// Load specified content CSS last
			each(self.contentCSS, function(url) {
				self.dom.loadCSS(url);
			});

			// Handle auto focus
			if (settings.auto_focus) {
				setTimeout(function () {
					var ed = tinymce.get(settings.auto_focus);

					ed.selection.select(ed.getBody(), 1);
					ed.selection.collapse(1);
					ed.getBody().focus();
					ed.getWin().focus();
				}, 100);
			}

			// Clean up references for IE
			targetElm = doc = body = null;
		},

		focus : function(skip_focus) {
			var oed, self = this, selection = self.selection, contentEditable = self.settings.content_editable, ieRng, controlElm, doc = self.getDoc(), body;

			if (!skip_focus) {
				if (self.lastIERng) {
					selection.setRng(self.lastIERng);
				}

				// Get selected control element
				ieRng = selection.getRng();
				if (ieRng.item) {
					controlElm = ieRng.item(0);
				}

				self._refreshContentEditable();

				// Focus the window iframe
				if (!contentEditable) {
					self.getWin().focus();
				}

				// Focus the body as well since it's contentEditable
				if (tinymce.isGecko || contentEditable) {
					body = self.getBody();

					// Check for setActive since it doesn't scroll to the element
					if (body.setActive) {
						body.setActive();
					} else {
						body.focus();
					}

					if (contentEditable) {
						selection.normalize();
					}
				}

				// Restore selected control element
				// This is needed when for example an image is selected within a
				// layer a call to focus will then remove the control selection
				if (controlElm && controlElm.ownerDocument == doc) {
					ieRng = doc.body.createControlRange();
					ieRng.addElement(controlElm);
					ieRng.select();
				}
			}

			if (tinymce.activeEditor != self) {
				if ((oed = tinymce.activeEditor) != null)
					oed.onDeactivate.dispatch(oed, self);

				self.onActivate.dispatch(self, oed);
			}

			tinymce._setActive(self);
		},

		execCallback : function(n) {
			var t = this, f = t.settings[n], s;

			if (!f)
				return;

			// Look through lookup
			if (t.callbackLookup && (s = t.callbackLookup[n])) {
				f = s.func;
				s = s.scope;
			}

			if (is(f, 'string')) {
				s = f.replace(/\.\w+$/, '');
				s = s ? tinymce.resolve(s) : 0;
				f = tinymce.resolve(f);
				t.callbackLookup = t.callbackLookup || {};
				t.callbackLookup[n] = {func : f, scope : s};
			}

			return f.apply(s || t, Array.prototype.slice.call(arguments, 1));
		},

		translate : function(s) {
			var c = this.settings.language || 'en', i18n = tinymce.i18n;

			if (!s)
				return '';

			return i18n[c + '.' + s] || s.replace(/\{\#([^\}]+)\}/g, function(a, b) {
				return i18n[c + '.' + b] || '{#' + b + '}';
			});
		},

		getLang : function(n, dv) {
			return tinymce.i18n[(this.settings.language || 'en') + '.' + n] || (is(dv) ? dv : '{#' + n + '}');
		},

		getParam : function(n, dv, ty) {
			var tr = tinymce.trim, v = is(this.settings[n]) ? this.settings[n] : dv, o;

			if (ty === 'hash') {
				o = {};

				if (is(v, 'string')) {
					each(v.indexOf('=') > 0 ? v.split(/[;,](?![^=;,]*(?:[;,]|$))/) : v.split(','), function(v) {
						v = v.split('=');

						if (v.length > 1)
							o[tr(v[0])] = tr(v[1]);
						else
							o[tr(v[0])] = tr(v);
					});
				} else
					o = v;

				return o;
			}

			return v;
		},

		nodeChanged : function(o) {
			var self = this, selection = self.selection, node;

			// Fix for bug #1896577 it seems that this can not be fired while the editor is loading
			if (self.initialized) {
				o = o || {};

				// Get start node
				node = selection.getStart() || self.getBody();
				node = isIE && node.ownerDocument != self.getDoc() ? self.getBody() : node; // Fix for IE initial state

				// Get parents and add them to object
				o.parents = [];
				self.dom.getParent(node, function(node) {
					if (node.nodeName == 'BODY')
						return true;

					o.parents.push(node);
				});

				self.onNodeChange.dispatch(
					self,
					o ? o.controlManager || self.controlManager : self.controlManager,
					node,
					selection.isCollapsed(),
					o
				);
			}
		},

		addButton : function(name, settings) {
			var self = this;

			self.buttons = self.buttons || {};
			self.buttons[name] = settings;
		},

		addCommand : function(name, callback, scope) {
			this.execCommands[name] = {func : callback, scope : scope || this};
		},

		addQueryStateHandler : function(name, callback, scope) {
			this.queryStateCommands[name] = {func : callback, scope : scope || this};
		},

		addQueryValueHandler : function(name, callback, scope) {
			this.queryValueCommands[name] = {func : callback, scope : scope || this};
		},

		addShortcut : function(pa, desc, cmd_func, sc) {
			var t = this, c;

			if (t.settings.custom_shortcuts === false)
				return false;

			t.shortcuts = t.shortcuts || {};

			if (is(cmd_func, 'string')) {
				c = cmd_func;

				cmd_func = function() {
					t.execCommand(c, false, null);
				};
			}

			if (is(cmd_func, 'object')) {
				c = cmd_func;

				cmd_func = function() {
					t.execCommand(c[0], c[1], c[2]);
				};
			}

			each(explode(pa), function(pa) {
				var o = {
					func : cmd_func,
					scope : sc || this,
					desc : t.translate(desc),
					alt : false,
					ctrl : false,
					shift : false
				};

				each(explode(pa, '+'), function(v) {
					switch (v) {
						case 'alt':
						case 'ctrl':
						case 'shift':
							o[v] = true;
							break;

						default:
							o.charCode = v.charCodeAt(0);
							o.keyCode = v.toUpperCase().charCodeAt(0);
					}
				});

				t.shortcuts[(o.ctrl ? 'ctrl' : '') + ',' + (o.alt ? 'alt' : '') + ',' + (o.shift ? 'shift' : '') + ',' + o.keyCode] = o;
			});

			return true;
		},

		execCommand : function(cmd, ui, val, a) {
			var t = this, s = 0, o, st;

			if (!/^(mceAddUndoLevel|mceEndUndoLevel|mceBeginUndoLevel|mceRepaint|SelectAll)$/.test(cmd) && (!a || !a.skip_focus))
				t.focus();

			a = extend({}, a);
			t.onBeforeExecCommand.dispatch(t, cmd, ui, val, a);
			if (a.terminate)
				return false;

			// Command callback
			if (t.execCallback('execcommand_callback', t.id, t.selection.getNode(), cmd, ui, val)) {
				t.onExecCommand.dispatch(t, cmd, ui, val, a);
				return true;
			}

			// Registred commands
			if (o = t.execCommands[cmd]) {
				st = o.func.call(o.scope, ui, val);

				// Fall through on true
				if (st !== true) {
					t.onExecCommand.dispatch(t, cmd, ui, val, a);
					return st;
				}
			}

			// Plugin commands
			each(t.plugins, function(p) {
				if (p.execCommand && p.execCommand(cmd, ui, val)) {
					t.onExecCommand.dispatch(t, cmd, ui, val, a);
					s = 1;
					return false;
				}
			});

			if (s)
				return true;

			// Theme commands
			if (t.theme && t.theme.execCommand && t.theme.execCommand(cmd, ui, val)) {
				t.onExecCommand.dispatch(t, cmd, ui, val, a);
				return true;
			}

			// Editor commands
			if (t.editorCommands.execCommand(cmd, ui, val)) {
				t.onExecCommand.dispatch(t, cmd, ui, val, a);
				return true;
			}

			// Browser commands
			t.getDoc().execCommand(cmd, ui, val);
			t.onExecCommand.dispatch(t, cmd, ui, val, a);
		},

		queryCommandState : function(cmd) {
			var t = this, o, s;

			// Is hidden then return undefined
			if (t._isHidden())
				return;

			// Registred commands
			if (o = t.queryStateCommands[cmd]) {
				s = o.func.call(o.scope);

				// Fall though on true
				if (s !== true)
					return s;
			}

			// Registred commands
			o = t.editorCommands.queryCommandState(cmd);
			if (o !== -1)
				return o;

			// Browser commands
			try {
				return this.getDoc().queryCommandState(cmd);
			} catch (ex) {
				// Fails sometimes see bug: 1896577
			}
		},

		queryCommandValue : function(c) {
			var t = this, o, s;

			// Is hidden then return undefined
			if (t._isHidden())
				return;

			// Registred commands
			if (o = t.queryValueCommands[c]) {
				s = o.func.call(o.scope);

				// Fall though on true
				if (s !== true)
					return s;
			}

			// Registred commands
			o = t.editorCommands.queryCommandValue(c);
			if (is(o))
				return o;

			// Browser commands
			try {
				return this.getDoc().queryCommandValue(c);
			} catch (ex) {
				// Fails sometimes see bug: 1896577
			}
		},

		show : function() {
			var self = this;

			DOM.show(self.getContainer());
			DOM.hide(self.id);
			self.load();
		},

		hide : function() {
			var self = this, doc = self.getDoc();

			// Fixed bug where IE has a blinking cursor left from the editor
			if (isIE && doc)
				doc.execCommand('SelectAll');

			// We must save before we hide so Safari doesn't crash
			self.save();

			// defer the call to hide to prevent an IE9 crash #4921
			DOM.hide(self.getContainer());
			DOM.setStyle(self.id, 'display', self.orgDisplay);
		},

		isHidden : function() {
			return !DOM.isHidden(this.id);
		},

		setProgressState : function(b, ti, o) {
			this.onSetProgressState.dispatch(this, b, ti, o);

			return b;
		},

		load : function(o) {
			var t = this, e = t.getElement(), h;

			if (e) {
				o = o || {};
				o.load = true;

				// Double encode existing entities in the value
				h = t.setContent(is(e.value) ? e.value : e.innerHTML, o);
				o.element = e;

				if (!o.no_events)
					t.onLoadContent.dispatch(t, o);

				o.element = e = null;

				return h;
			}
		},

		save : function(o) {
			var t = this, e = t.getElement(), h, f;

			if (!e || !t.initialized)
				return;

			o = o || {};
			o.save = true;

			o.element = e;
			h = o.content = t.getContent(o);

			if (!o.no_events)
				t.onSaveContent.dispatch(t, o);

			h = o.content;

			if (!/TEXTAREA|INPUT/i.test(e.nodeName)) {
				e.innerHTML = h;

				// Update hidden form element
				if (f = DOM.getParent(t.id, 'form')) {
					each(f.elements, function(e) {
						if (e.name == t.id) {
							e.value = h;
							return false;
						}
					});
				}
			} else
				e.value = h;

			o.element = e = null;

			return h;
		},

		setContent : function(content, args) {
			var self = this, rootNode, body = self.getBody(), forcedRootBlockName;

			// Setup args object
			args = args || {};
			args.format = args.format || 'html';
			args.set = true;
			args.content = content;

			// Do preprocessing
			if (!args.no_events)
				self.onBeforeSetContent.dispatch(self, args);

			content = args.content;

			// Padd empty content in Gecko and Safari. Commands will otherwise fail on the content
			// It will also be impossible to place the caret in the editor unless there is a BR element present
			if (!tinymce.isIE && (content.length === 0 || /^\s+$/.test(content))) {
				forcedRootBlockName = self.settings.forced_root_block;
				if (forcedRootBlockName)
					content = '<' + forcedRootBlockName + '><br data-mce-bogus="1"></' + forcedRootBlockName + '>';
				else
					content = '<br data-mce-bogus="1">';

				body.innerHTML = content;
				self.selection.select(body, true);
				self.selection.collapse(true);
				return;
			}

			// Parse and serialize the html
			if (args.format !== 'raw') {
				content = new tinymce.html.Serializer({}, self.schema).serialize(
					self.parser.parse(content)
				);
			}

			// Set the new cleaned contents to the editor
			args.content = tinymce.trim(content);
			self.dom.setHTML(body, args.content);

			// Do post processing
			if (!args.no_events)
				self.onSetContent.dispatch(self, args);

			// Don't normalize selection if the focused element isn't the body in content editable mode since it will steal focus otherwise
			if (!self.settings.content_editable || document.activeElement === self.getBody()) {
				self.selection.normalize();
			}

			return args.content;
		},

		getContent : function(args) {
			var self = this, content, body = self.getBody();

			// Setup args object
			args = args || {};
			args.format = args.format || 'html';
			args.get = true;
			args.getInner = true;

			// Do preprocessing
			if (!args.no_events)
				self.onBeforeGetContent.dispatch(self, args);

			// Get raw contents or by default the cleaned contents
			if (args.format == 'raw')
				content = body.innerHTML;
			else if (args.format == 'text')
				content = body.innerText || body.textContent;
			else
				content = self.serializer.serialize(body, args);

			// Trim whitespace in beginning/end of HTML
			if (args.format != 'text') {
				args.content = tinymce.trim(content);
			} else {
				args.content = content;
			}

			// Do post processing
			if (!args.no_events)
				self.onGetContent.dispatch(self, args);

			return args.content;
		},

		isDirty : function() {
			var self = this;

			return tinymce.trim(self.startContent) != tinymce.trim(self.getContent({format : 'raw', no_events : 1})) && !self.isNotDirty;
		},

		getContainer : function() {
			var self = this;

			if (!self.container)
				self.container = DOM.get(self.editorContainer || self.id + '_parent');

			return self.container;
		},

		getContentAreaContainer : function() {
			return this.contentAreaContainer;
		},

		getElement : function() {
			return DOM.get(this.settings.content_element || this.id);
		},

		getWin : function() {
			var self = this, elm;

			if (!self.contentWindow) {
				elm = DOM.get(self.id + "_ifr");

				if (elm)
					self.contentWindow = elm.contentWindow;
			}

			return self.contentWindow;
		},

		getDoc : function() {
			var self = this, win;

			if (!self.contentDocument) {
				win = self.getWin();

				if (win)
					self.contentDocument = win.document;
			}

			return self.contentDocument;
		},

		getBody : function() {
			return this.bodyElement || this.getDoc().body;
		},

		convertURL : function(url, name, elm) {
			var self = this, settings = self.settings;

			// Use callback instead
			if (settings.urlconverter_callback)
				return self.execCallback('urlconverter_callback', url, elm, true, name);

			// Don't convert link href since thats the CSS files that gets loaded into the editor also skip local file URLs
			if (!settings.convert_urls || (elm && elm.nodeName == 'LINK') || url.indexOf('file:') === 0)
				return url;

			// Convert to relative
			if (settings.relative_urls)
				return self.documentBaseURI.toRelative(url);

			// Convert to absolute
			url = self.documentBaseURI.toAbsolute(url, settings.remove_script_host);

			return url;
		},

		addVisual : function(elm) {
			var self = this, settings = self.settings, dom = self.dom, cls;

			elm = elm || self.getBody();

			if (!is(self.hasVisual))
				self.hasVisual = settings.visual;

			each(dom.select('table,a', elm), function(elm) {
				var value;

				switch (elm.nodeName) {
					case 'TABLE':
						cls = settings.visual_table_class || 'mceItemTable';
						value = dom.getAttrib(elm, 'border');

						if (!value || value == '0') {
							if (self.hasVisual)
								dom.addClass(elm, cls);
							else
								dom.removeClass(elm, cls);
						}

						return;

					case 'A':
						if (!dom.getAttrib(elm, 'href', false)) {
							value = dom.getAttrib(elm, 'name') || elm.id;
							cls = 'mceItemAnchor';

							if (value) {
								if (self.hasVisual)
									dom.addClass(elm, cls);
								else
									dom.removeClass(elm, cls);
							}
						}

						return;
				}
			});

			self.onVisualAid.dispatch(self, elm, self.hasVisual);
		},

		remove : function() {
			var self = this, elm = self.getContainer(), doc = self.getDoc();

			if (!self.removed) {
				self.removed = 1; // Cancels post remove event execution

				// Fixed bug where IE has a blinking cursor left from the editor
				if (isIE && doc)
					doc.execCommand('SelectAll');

				// We must save before we hide so Safari doesn't crash
				self.save();

				DOM.setStyle(self.id, 'display', self.orgDisplay);

				// Don't clear the window or document if content editable
				// is enabled since other instances might still be present
				if (!self.settings.content_editable) {
					Event.unbind(self.getWin());
					Event.unbind(self.getDoc());
				}

				Event.unbind(self.getBody());
				Event.clear(elm);

				self.execCallback('remove_instance_callback', self);
				self.onRemove.dispatch(self);

				// Clear all execCommand listeners this is required to avoid errors if the editor was removed inside another command
				self.onExecCommand.listeners = [];

				tinymce.remove(self);
				DOM.remove(elm);
			}
		},

		destroy : function(s) {
			var t = this;

			// One time is enough
			if (t.destroyed)
				return;

			// We must unbind on Gecko since it would otherwise produce the pesky "attempt to run compile-and-go script on a cleared scope" message
			if (isGecko) {
				Event.unbind(t.getDoc());
				Event.unbind(t.getWin());
				Event.unbind(t.getBody());
			}

			if (!s) {
				tinymce.removeUnload(t.destroy);
				tinyMCE.onBeforeUnload.remove(t._beforeUnload);

				// Manual destroy
				if (t.theme && t.theme.destroy)
					t.theme.destroy();

				// Destroy controls, selection and dom
				t.controlManager.destroy();
				t.selection.destroy();
				t.dom.destroy();
			}

			if (t.formElement) {
				t.formElement.submit = t.formElement._mceOldSubmit;
				t.formElement._mceOldSubmit = null;
			}

			t.contentAreaContainer = t.formElement = t.container = t.settings.content_element = t.bodyElement = t.contentDocument = t.contentWindow = null;

			if (t.selection)
				t.selection = t.selection.win = t.selection.dom = t.selection.dom.doc = null;

			t.destroyed = 1;
		},

		// Internal functions

		_refreshContentEditable : function() {
			var self = this, body, parent;

			// Check if the editor was hidden and the re-initalize contentEditable mode by removing and adding the body again
			if (self._isHidden()) {
				body = self.getBody();
				parent = body.parentNode;

				parent.removeChild(body);
				parent.appendChild(body);

				body.focus();
			}
		},

		_isHidden : function() {
			var s;

			if (!isGecko)
				return 0;

			// Weird, wheres that cursor selection?
			s = this.selection.getSel();
			return (!s || !s.rangeCount || s.rangeCount === 0);
		}
	});
})(tinymce);
(function(tinymce) {
	var each = tinymce.each;

	tinymce.Editor.prototype.setupEvents = function() {
		var self = this, settings = self.settings;

		// Add events to the editor
		each([
			'onPreInit',

			'onBeforeRenderUI',

			'onPostRender',

			'onLoad',

			'onInit',

			'onRemove',

			'onActivate',

			'onDeactivate',

			'onClick',

			'onEvent',

			'onMouseUp',

			'onMouseDown',

			'onDblClick',

			'onKeyDown',

			'onKeyUp',

			'onKeyPress',

			'onContextMenu',

			'onSubmit',

			'onReset',

			'onPaste',

			'onPreProcess',

			'onPostProcess',

			'onBeforeSetContent',

			'onBeforeGetContent',

			'onSetContent',

			'onGetContent',

			'onLoadContent',

			'onSaveContent',

			'onNodeChange',

			'onChange',

			'onBeforeExecCommand',

			'onExecCommand',

			'onUndo',

			'onRedo',

			'onVisualAid',

			'onSetProgressState',

			'onSetAttrib'
		], function(name) {
			self[name] = new tinymce.util.Dispatcher(self);
		});

		// Handle legacy cleanup_callback option
		if (settings.cleanup_callback) {
			self.onBeforeSetContent.add(function(ed, o) {
				o.content = ed.execCallback('cleanup_callback', 'insert_to_editor', o.content, o);
			});

			self.onPreProcess.add(function(ed, o) {
				if (o.set)
					ed.execCallback('cleanup_callback', 'insert_to_editor_dom', o.node, o);

				if (o.get)
					ed.execCallback('cleanup_callback', 'get_from_editor_dom', o.node, o);
			});

			self.onPostProcess.add(function(ed, o) {
				if (o.set)
					o.content = ed.execCallback('cleanup_callback', 'insert_to_editor', o.content, o);

				if (o.get)						
					o.content = ed.execCallback('cleanup_callback', 'get_from_editor', o.content, o);
			});
		}

		// Handle legacy save_callback option
		if (settings.save_callback) {
			self.onGetContent.add(function(ed, o) {
				if (o.save)
					o.content = ed.execCallback('save_callback', ed.id, o.content, ed.getBody());
			});
		}

		// Handle legacy handle_event_callback option
		if (settings.handle_event_callback) {
			self.onEvent.add(function(ed, e, o) {
				if (self.execCallback('handle_event_callback', e, ed, o) === false) {
					e.preventDefault();
					e.stopPropagation();
				}
			});
		}

		// Handle legacy handle_node_change_callback option
		if (settings.handle_node_change_callback) {
			self.onNodeChange.add(function(ed, cm, n) {
				ed.execCallback('handle_node_change_callback', ed.id, n, -1, -1, true, ed.selection.isCollapsed());
			});
		}

		// Handle legacy save_callback option
		if (settings.save_callback) {
			self.onSaveContent.add(function(ed, o) {
				var h = ed.execCallback('save_callback', ed.id, o.content, ed.getBody());

				if (h)
					o.content = h;
			});
		}

		// Handle legacy onchange_callback option
		if (settings.onchange_callback) {
			self.onChange.add(function(ed, l) {
				ed.execCallback('onchange_callback', ed, l);
			});
		}
	};

	tinymce.Editor.prototype.bindNativeEvents = function() {
		// 'focus', 'blur', 'dblclick', 'beforedeactivate', submit, reset
		var self = this, i, settings = self.settings, dom = self.dom, nativeToDispatcherMap;

		nativeToDispatcherMap = {
			mouseup : 'onMouseUp',
			mousedown : 'onMouseDown',
			click : 'onClick',
			keyup : 'onKeyUp',
			keydown : 'onKeyDown',
			keypress : 'onKeyPress',
			submit : 'onSubmit',
			reset : 'onReset',
			contextmenu : 'onContextMenu',
			dblclick : 'onDblClick',
			paste : 'onPaste' // Doesn't work in all browsers yet
		};

		// Handler that takes a native event and sends it out to a dispatcher like onKeyDown
		function eventHandler(evt, args) {
			var type = evt.type;

			// Don't fire events when it's removed
			if (self.removed)
				return;

			// Sends the native event out to a global dispatcher then to the specific event dispatcher
			if (self.onEvent.dispatch(self, evt, args) !== false) {
				self[nativeToDispatcherMap[evt.fakeType || evt.type]].dispatch(self, evt, args);
			}
		};

		// Opera doesn't support focus event for contentEditable elements so we need to fake it
		function doOperaFocus(e) {
			self.focus(true);
		};

		function nodeChanged(ed, e) {
			// Normalize selection for example <b>a</b><i>|a</i> becomes <b>a|</b><i>a</i> except for Ctrl+A since it selects everything
			if (e.keyCode != 65 || !tinymce.VK.metaKeyPressed(e)) {
				self.selection.normalize();
			}

			self.nodeChanged();
		}

		// Add DOM events
		each(nativeToDispatcherMap, function(dispatcherName, nativeName) {
			var root = settings.content_editable ? self.getBody() : self.getDoc();

			switch (nativeName) {
				case 'contextmenu':
					dom.bind(root, nativeName, eventHandler);
					break;

				case 'paste':
					dom.bind(self.getBody(), nativeName, eventHandler);
					break;

				case 'submit':
				case 'reset':
					dom.bind(self.getElement().form || tinymce.DOM.getParent(self.id, 'form'), nativeName, eventHandler);
					break;

				default:
					dom.bind(root, nativeName, eventHandler);
			}
		});

		// Set the editor as active when focused
		dom.bind(settings.content_editable ? self.getBody() : (tinymce.isGecko ? self.getDoc() : self.getWin()), 'focus', function(e) {
			self.focus(true);
		});

		if (settings.content_editable && tinymce.isOpera) {
			dom.bind(self.getBody(), 'click', doOperaFocus);
			dom.bind(self.getBody(), 'keydown', doOperaFocus);
		}

		// Add node change handler
		self.onMouseUp.add(nodeChanged);

		self.onKeyUp.add(function(ed, e) {
			var keyCode = e.keyCode;

			if ((keyCode >= 33 && keyCode <= 36) || (keyCode >= 37 && keyCode <= 40) || keyCode == 13 || keyCode == 45 || keyCode == 46 || keyCode == 8 || (tinymce.isMac && (keyCode == 91 || keyCode == 93)) || e.ctrlKey)
				nodeChanged(ed, e);
		});

		// Add reset handler
		self.onReset.add(function() {
			self.setContent(self.startContent, {format : 'raw'});
		});

		// Add shortcuts
		function handleShortcut(e, execute) {
			if (e.altKey || e.ctrlKey || e.metaKey) {
				each(self.shortcuts, function(shortcut) {
					var ctrlState = tinymce.isMac ? e.metaKey : e.ctrlKey;

					if (shortcut.ctrl != ctrlState || shortcut.alt != e.altKey || shortcut.shift != e.shiftKey)
						return;

					if (e.keyCode == shortcut.keyCode || (e.charCode && e.charCode == shortcut.charCode)) {
						e.preventDefault();

						if (execute) {
							shortcut.func.call(shortcut.scope);
						}

						return true;
					}
				});
			}
		};

		self.onKeyUp.add(function(ed, e) {
			handleShortcut(e);
		});

		self.onKeyPress.add(function(ed, e) {
			handleShortcut(e);
		});

		self.onKeyDown.add(function(ed, e) {
			handleShortcut(e, true);
		});

		if (tinymce.isOpera) {
			self.onClick.add(function(ed, e) {
				e.preventDefault();
			});
		}
	};
})(tinymce);
(function(tinymce) {
	// Added for compression purposes
	var each = tinymce.each, undef, TRUE = true, FALSE = false;

	tinymce.EditorCommands = function(editor) {
		var dom = editor.dom,
			selection = editor.selection,
			commands = {state: {}, exec : {}, value : {}},
			settings = editor.settings,
			formatter = editor.formatter,
			bookmark;

		function execCommand(command, ui, value) {
			var func;

			command = command.toLowerCase();
			if (func = commands.exec[command]) {
				func(command, ui, value);
				return TRUE;
			}

			return FALSE;
		};

		function queryCommandState(command) {
			var func;

			command = command.toLowerCase();
			if (func = commands.state[command])
				return func(command);

			return -1;
		};

		function queryCommandValue(command) {
			var func;

			command = command.toLowerCase();
			if (func = commands.value[command])
				return func(command);

			return FALSE;
		};

		function addCommands(command_list, type) {
			type = type || 'exec';

			each(command_list, function(callback, command) {
				each(command.toLowerCase().split(','), function(command) {
					commands[type][command] = callback;
				});
			});
		};

		// Expose public methods
		tinymce.extend(this, {
			execCommand : execCommand,
			queryCommandState : queryCommandState,
			queryCommandValue : queryCommandValue,
			addCommands : addCommands
		});

		// Private methods

		function execNativeCommand(command, ui, value) {
			if (ui === undef)
				ui = FALSE;

			if (value === undef)
				value = null;

			return editor.getDoc().execCommand(command, ui, value);
		};

		function isFormatMatch(name) {
			return formatter.match(name);
		};

		function toggleFormat(name, value) {
			formatter.toggle(name, value ? {value : value} : undef);
		};

		function storeSelection(type) {
			bookmark = selection.getBookmark(type);
		};

		function restoreSelection() {
			selection.moveToBookmark(bookmark);
		};

		// Add execCommand overrides
		addCommands({
			// Ignore these, added for compatibility
			'mceResetDesignMode,mceBeginUndoLevel' : function() {},

			// Add undo manager logic
			'mceEndUndoLevel,mceAddUndoLevel' : function() {
				editor.undoManager.add();
			},

			'Cut,Copy,Paste' : function(command) {
				var doc = editor.getDoc(), failed;

				// Try executing the native command
				try {
					execNativeCommand(command);
				} catch (ex) {
					// Command failed
					failed = TRUE;
				}

				// Present alert message about clipboard access not being available
				if (failed || !doc.queryCommandSupported(command)) {
					if (tinymce.isGecko) {
						editor.windowManager.confirm(editor.getLang('clipboard_msg'), function(state) {
							if (state)
								open('http://www.mozilla.org/editor/midasdemo/securityprefs.html', '_blank');
						});
					} else
						editor.windowManager.alert(editor.getLang('clipboard_no_support'));
				}
			},

			// Override unlink command
			unlink : function(command) {
				if (selection.isCollapsed())
					selection.select(selection.getNode());

				execNativeCommand(command);
				selection.collapse(FALSE);
			},

			// Override justify commands to use the text formatter engine
			'JustifyLeft,JustifyCenter,JustifyRight,JustifyFull' : function(command) {
				var align = command.substring(7);

				// Remove all other alignments first
				each('left,center,right,full'.split(','), function(name) {
					if (align != name)
						formatter.remove('align' + name);
				});

				toggleFormat('align' + align);
				execCommand('mceRepaint');
			},

			// Override list commands to fix WebKit bug
			'InsertUnorderedList,InsertOrderedList' : function(command) {
				var listElm, listParent;

				execNativeCommand(command);

				// WebKit produces lists within block elements so we need to split them
				// we will replace the native list creation logic to custom logic later on
				// TODO: Remove this when the list creation logic is removed
				listElm = dom.getParent(selection.getNode(), 'ol,ul');
				if (listElm) {
					listParent = listElm.parentNode;

					// If list is within a text block then split that block
					if (/^(H[1-6]|P|ADDRESS|PRE)$/.test(listParent.nodeName)) {
						storeSelection();
						dom.split(listParent, listElm);
						restoreSelection();
					}
				}
			},

			// Override commands to use the text formatter engine
			'Bold,Italic,Underline,Strikethrough,Superscript,Subscript' : function(command) {
				toggleFormat(command);
			},

			// Override commands to use the text formatter engine
			'ForeColor,HiliteColor,FontName' : function(command, ui, value) {
				toggleFormat(command, value);
			},

			FontSize : function(command, ui, value) {
				var fontClasses, fontSizes;

				// Convert font size 1-7 to styles
				if (value >= 1 && value <= 7) {
					fontSizes = tinymce.explode(settings.font_size_style_values);
					fontClasses = tinymce.explode(settings.font_size_classes);

					if (fontClasses)
						value = fontClasses[value - 1] || value;
					else
						value = fontSizes[value - 1] || value;
				}

				toggleFormat(command, value);
			},

			RemoveFormat : function(command) {
				formatter.remove(command);
			},

			mceBlockQuote : function(command) {
				toggleFormat('blockquote');
			},

			FormatBlock : function(command, ui, value) {
				return toggleFormat(value || 'p');
			},

			mceCleanup : function() {
				var bookmark = selection.getBookmark();

				editor.setContent(editor.getContent({cleanup : TRUE}), {cleanup : TRUE});

				selection.moveToBookmark(bookmark);
			},

			mceRemoveNode : function(command, ui, value) {
				var node = value || selection.getNode();

				// Make sure that the body node isn't removed
				if (node != editor.getBody()) {
					storeSelection();
					editor.dom.remove(node, TRUE);
					restoreSelection();
				}
			},

			mceSelectNodeDepth : function(command, ui, value) {
				var counter = 0;

				dom.getParent(selection.getNode(), function(node) {
					if (node.nodeType == 1 && counter++ == value) {
						selection.select(node);
						return FALSE;
					}
				}, editor.getBody());
			},

			mceSelectNode : function(command, ui, value) {
				selection.select(value);
			},

			mceInsertContent : function(command, ui, value) {
				var parser, serializer, parentNode, rootNode, fragment, args,
					marker, nodeRect, viewPortRect, rng, node, node2, bookmarkHtml, viewportBodyElement;

				//selection.normalize();

				// Setup parser and serializer
				parser = editor.parser;
				serializer = new tinymce.html.Serializer({}, editor.schema);
				bookmarkHtml = '<span id="mce_marker" data-mce-type="bookmark">\uFEFF</span>';

				// Run beforeSetContent handlers on the HTML to be inserted
				args = {content: value, format: 'html'};
				selection.onBeforeSetContent.dispatch(selection, args);
				value = args.content;

				// Add caret at end of contents if it's missing
				if (value.indexOf('{$caret}') == -1)
					value += '{$caret}';

				// Replace the caret marker with a span bookmark element
				value = value.replace(/\{\$caret\}/, bookmarkHtml);

				// Insert node maker where we will insert the new HTML and get it's parent
				if (!selection.isCollapsed())
					editor.getDoc().execCommand('Delete', false, null);

				parentNode = selection.getNode();

				// Parse the fragment within the context of the parent node
				args = {context : parentNode.nodeName.toLowerCase()};
				fragment = parser.parse(value, args);

				// Move the caret to a more suitable location
				node = fragment.lastChild;
				if (node.attr('id') == 'mce_marker') {
					marker = node;

					for (node = node.prev; node; node = node.walk(true)) {
						if (node.type == 3 || !dom.isBlock(node.name)) {
							node.parent.insert(marker, node, node.name === 'br');
							break;
						}
					}
				}

				// If parser says valid we can insert the contents into that parent
				if (!args.invalid) {
					value = serializer.serialize(fragment);

					// Check if parent is empty or only has one BR element then set the innerHTML of that parent
					node = parentNode.firstChild;
					node2 = parentNode.lastChild;
					if (!node || (node === node2 && node.nodeName === 'BR'))
						dom.setHTML(parentNode, value);
					else
						selection.setContent(value);
				} else {
					// If the fragment was invalid within that context then we need
					// to parse and process the parent it's inserted into

					// Insert bookmark node and get the parent
					selection.setContent(bookmarkHtml);
					parentNode = selection.getNode();
					rootNode = editor.getBody();

					// Opera will return the document node when selection is in root
					if (parentNode.nodeType == 9)
						parentNode = node = rootNode;
					else
						node = parentNode;

					// Find the ancestor just before the root element
					while (node !== rootNode) {
						parentNode = node;
						node = node.parentNode;
					}

					// Get the outer/inner HTML depending on if we are in the root and parser and serialize that
					value = parentNode == rootNode ? rootNode.innerHTML : dom.getOuterHTML(parentNode);
					value = serializer.serialize(
						parser.parse(
							// Need to replace by using a function since $ in the contents would otherwise be a problem
							value.replace(/<span (id="mce_marker"|id=mce_marker).+?<\/span>/i, function() {
								return serializer.serialize(fragment);
							})
						)
					);

					// Set the inner/outer HTML depending on if we are in the root or not
					if (parentNode == rootNode)
						dom.setHTML(rootNode, value);
					else
						dom.setOuterHTML(parentNode, value);
				}

				marker = dom.get('mce_marker');

				// Scroll range into view scrollIntoView on element can't be used since it will scroll the main view port as well
				nodeRect = dom.getRect(marker);
				viewPortRect = dom.getViewPort(editor.getWin());

				// Check if node is out side the viewport if it is then scroll to it
				if ((nodeRect.y + nodeRect.h > viewPortRect.y + viewPortRect.h || nodeRect.y < viewPortRect.y) ||
					(nodeRect.x > viewPortRect.x + viewPortRect.w || nodeRect.x < viewPortRect.x)) {
					viewportBodyElement = tinymce.isIE ? editor.getDoc().documentElement : editor.getBody();
					viewportBodyElement.scrollLeft = nodeRect.x;
					viewportBodyElement.scrollTop = nodeRect.y - viewPortRect.h + 25;
				}

				// Move selection before marker and remove it
				rng = dom.createRng();

				// If previous sibling is a text node set the selection to the end of that node
				node = marker.previousSibling;
				if (node && node.nodeType == 3) {
					rng.setStart(node, node.nodeValue.length);
				} else {
					// If the previous sibling isn't a text node or doesn't exist set the selection before the marker node
					rng.setStartBefore(marker);
					rng.setEndBefore(marker);
				}

				// Remove the marker node and set the new range
				dom.remove(marker);
				selection.setRng(rng);

				// Dispatch after event and add any visual elements needed
				selection.onSetContent.dispatch(selection, args);
				editor.addVisual();
			},

			mceInsertRawHTML : function(command, ui, value) {
				selection.setContent('tiny_mce_marker');
				editor.setContent(editor.getContent().replace(/tiny_mce_marker/g, function() { return value }));
			},

			mceToggleFormat : function(command, ui, value) {
				toggleFormat(value);
			},

			mceSetContent : function(command, ui, value) {
				editor.setContent(value);
			},

			'Indent,Outdent' : function(command) {
				var intentValue, indentUnit, value;

				// Setup indent level
				intentValue = settings.indentation;
				indentUnit = /[a-z%]+$/i.exec(intentValue);
				intentValue = parseInt(intentValue);

				if (!queryCommandState('InsertUnorderedList') && !queryCommandState('InsertOrderedList')) {
					// If forced_root_blocks is set to false we don't have a block to indent so lets create a div
					if (!settings.forced_root_block && !dom.getParent(selection.getNode(), dom.isBlock)) {
						formatter.apply('div');
					}

					each(selection.getSelectedBlocks(), function(element) {
						if (command == 'outdent') {
							value = Math.max(0, parseInt(element.style.paddingLeft || 0) - intentValue);
							dom.setStyle(element, 'paddingLeft', value ? value + indentUnit : '');
						} else
							dom.setStyle(element, 'paddingLeft', (parseInt(element.style.paddingLeft || 0) + intentValue) + indentUnit);
					});
				} else
					execNativeCommand(command);
			},

			mceRepaint : function() {
				var bookmark;

				if (tinymce.isGecko) {
					try {
						storeSelection(TRUE);

						if (selection.getSel())
							selection.getSel().selectAllChildren(editor.getBody());

						selection.collapse(TRUE);
						restoreSelection();
					} catch (ex) {
						// Ignore
					}
				}
			},

			mceToggleFormat : function(command, ui, value) {
				formatter.toggle(value);
			},

			InsertHorizontalRule : function() {
				editor.execCommand('mceInsertContent', false, '<hr />');
			},

			mceToggleVisualAid : function() {
				editor.hasVisual = !editor.hasVisual;
				editor.addVisual();
			},

			mceReplaceContent : function(command, ui, value) {
				editor.execCommand('mceInsertContent', false, value.replace(/\{\$selection\}/g, selection.getContent({format : 'text'})));
			},

			mceInsertLink : function(command, ui, value) {
				var anchor;

				if (typeof(value) == 'string')
					value = {href : value};

				anchor = dom.getParent(selection.getNode(), 'a');

				// Spaces are never valid in URLs and it's a very common mistake for people to make so we fix it here.
				value.href = value.href.replace(' ', '%20');

				// Remove existing links if there could be child links or that the href isn't specified
				if (!anchor || !value.href) {
					formatter.remove('link');
				}		

				// Apply new link to selection
				if (value.href) {
					formatter.apply('link', value, anchor);
				}
			},

			selectAll : function() {
				var root = dom.getRoot(), rng = dom.createRng();

				// Old IE does a better job with selectall than new versions
				if (selection.getRng().setStart) {
					rng.setStart(root, 0);
					rng.setEnd(root, root.childNodes.length);

					selection.setRng(rng);
				} else {
					execNativeCommand('SelectAll');
				}
			}
		});

		// Add queryCommandState overrides
		addCommands({
			// Override justify commands
			'JustifyLeft,JustifyCenter,JustifyRight,JustifyFull' : function(command) {
				var name = 'align' + command.substring(7);
				var nodes = selection.isCollapsed() ? [dom.getParent(selection.getNode(), dom.isBlock)] : selection.getSelectedBlocks();
				var matches = tinymce.map(nodes, function(node) {
					return !!formatter.matchNode(node, name);
				});
				return tinymce.inArray(matches, TRUE) !== -1;
			},

			'Bold,Italic,Underline,Strikethrough,Superscript,Subscript' : function(command) {
				return isFormatMatch(command);
			},

			mceBlockQuote : function() {
				return isFormatMatch('blockquote');
			},

			Outdent : function() {
				var node;

				if (settings.inline_styles) {
					if ((node = dom.getParent(selection.getStart(), dom.isBlock)) && parseInt(node.style.paddingLeft) > 0)
						return TRUE;

					if ((node = dom.getParent(selection.getEnd(), dom.isBlock)) && parseInt(node.style.paddingLeft) > 0)
						return TRUE;
				}

				return queryCommandState('InsertUnorderedList') || queryCommandState('InsertOrderedList') || (!settings.inline_styles && !!dom.getParent(selection.getNode(), 'BLOCKQUOTE'));
			},

			'InsertUnorderedList,InsertOrderedList' : function(command) {
				var list = dom.getParent(selection.getNode(), 'ul,ol');
				return list && 
				     (command === 'insertunorderedlist' && list.tagName === 'UL'
				   || command === 'insertorderedlist' && list.tagName === 'OL');
			}
		}, 'state');

		// Add queryCommandValue overrides
		addCommands({
			'FontSize,FontName' : function(command) {
				var value = 0, parent;

				if (parent = dom.getParent(selection.getNode(), 'span')) {
					if (command == 'fontsize')
						value = parent.style.fontSize;
					else
						value = parent.style.fontFamily.replace(/, /g, ',').replace(/[\'\"]/g, '').toLowerCase();
				}

				return value;
			}
		}, 'value');

		// Add undo manager logic
		addCommands({
			Undo : function() {
				editor.undoManager.undo();
			},

			Redo : function() {
				editor.undoManager.redo();
			}
		});
	};
})(tinymce);

(function(tinymce) {
	var Dispatcher = tinymce.util.Dispatcher;

	tinymce.UndoManager = function(editor) {
		var self, index = 0, data = [], beforeBookmark, onAdd, onUndo, onRedo;

		function getContent() {
			// Remove whitespace before/after and remove pure bogus nodes
			return tinymce.trim(editor.getContent({format : 'raw', no_events : 1}).replace(/<span[^>]+data-mce-bogus[^>]+>[\u200B\uFEFF]+<\/span>/g, ''));
		};

		function addNonTypingUndoLevel() {
			self.typing = false;
			self.add();
		};

		// Create event instances
		onBeforeAdd = new Dispatcher(self);
		onAdd       = new Dispatcher(self);
		onUndo      = new Dispatcher(self);
		onRedo      = new Dispatcher(self);

		// Pass though onAdd event from UndoManager to Editor as onChange
		onAdd.add(function(undoman, level) {
			if (undoman.hasUndo())
				return editor.onChange.dispatch(editor, level, undoman);
		});

		// Pass though onUndo event from UndoManager to Editor
		onUndo.add(function(undoman, level) {
			return editor.onUndo.dispatch(editor, level, undoman);
		});

		// Pass though onRedo event from UndoManager to Editor
		onRedo.add(function(undoman, level) {
			return editor.onRedo.dispatch(editor, level, undoman);
		});

		// Add initial undo level when the editor is initialized
		editor.onInit.add(function() {
			self.add();
		});

		// Get position before an execCommand is processed
		editor.onBeforeExecCommand.add(function(ed, cmd, ui, val, args) {
			if (cmd != 'Undo' && cmd != 'Redo' && cmd != 'mceRepaint' && (!args || !args.skip_undo)) {
				self.beforeChange();
			}
		});

		// Add undo level after an execCommand call was made
		editor.onExecCommand.add(function(ed, cmd, ui, val, args) {
			if (cmd != 'Undo' && cmd != 'Redo' && cmd != 'mceRepaint' && (!args || !args.skip_undo)) {
				self.add();
			}
		});

		// Add undo level on save contents, drag end and blur/focusout
		editor.onSaveContent.add(addNonTypingUndoLevel);
		editor.dom.bind(editor.dom.getRoot(), 'dragend', addNonTypingUndoLevel);
		editor.dom.bind(editor.getBody(), 'focusout', function(e) {
			if (!editor.removed && self.typing) {
				addNonTypingUndoLevel();
			}
		});

		editor.onKeyUp.add(function(editor, e) {
			var keyCode = e.keyCode;

			if ((keyCode >= 33 && keyCode <= 36) || (keyCode >= 37 && keyCode <= 40) || keyCode == 45 || keyCode == 13 || e.ctrlKey) {
				addNonTypingUndoLevel();
			}
		});

		editor.onKeyDown.add(function(editor, e) {
			var keyCode = e.keyCode;

			// Is caracter positon keys left,right,up,down,home,end,pgdown,pgup,enter
			if ((keyCode >= 33 && keyCode <= 36) || (keyCode >= 37 && keyCode <= 40) || keyCode == 45) {
				if (self.typing) {
					addNonTypingUndoLevel();
				}

				return;
			}

			// If key isn't shift,ctrl,alt,capslock,metakey
			if ((keyCode < 16 || keyCode > 20) && keyCode != 224 && keyCode != 91 && !self.typing) {
				self.beforeChange();
				self.typing = true;
				self.add();
			}
		});

		editor.onMouseDown.add(function(editor, e) {
			if (self.typing) {
				addNonTypingUndoLevel();
			}
		});

		// Add keyboard shortcuts for undo/redo keys
		editor.addShortcut('ctrl+z', 'undo_desc', 'Undo');
		editor.addShortcut('ctrl+y', 'redo_desc', 'Redo');

		self = {
			// Explose for debugging reasons
			data : data,

			typing : false,
			
			onBeforeAdd: onBeforeAdd,

			onAdd : onAdd,

			onUndo : onUndo,

			onRedo : onRedo,

			beforeChange : function() {
				beforeBookmark = editor.selection.getBookmark(2, true);
			},

			add : function(level) {
				var i, settings = editor.settings, lastLevel;

				level = level || {};
				level.content = getContent();
				
				self.onBeforeAdd.dispatch(self, level);

				// Add undo level if needed
				lastLevel = data[index];
				if (lastLevel && lastLevel.content == level.content)
					return null;

				// Set before bookmark on previous level
				if (data[index])
					data[index].beforeBookmark = beforeBookmark;

				// Time to compress
				if (settings.custom_undo_redo_levels) {
					if (data.length > settings.custom_undo_redo_levels) {
						for (i = 0; i < data.length - 1; i++)
							data[i] = data[i + 1];

						data.length--;
						index = data.length;
					}
				}

				// Get a non intrusive normalized bookmark
				level.bookmark = editor.selection.getBookmark(2, true);

				// Crop array if needed
				if (index < data.length - 1)
					data.length = index + 1;

				data.push(level);
				index = data.length - 1;

				self.onAdd.dispatch(self, level);
				editor.isNotDirty = 0;

				return level;
			},

			undo : function() {
				var level, i;

				if (self.typing) {
					self.add();
					self.typing = false;
				}

				if (index > 0) {
					level = data[--index];

					editor.setContent(level.content, {format : 'raw'});
					editor.selection.moveToBookmark(level.beforeBookmark);

					self.onUndo.dispatch(self, level);
				}

				return level;
			},

			redo : function() {
				var level;

				if (index < data.length - 1) {
					level = data[++index];

					editor.setContent(level.content, {format : 'raw'});
					editor.selection.moveToBookmark(level.bookmark);

					self.onRedo.dispatch(self, level);
				}

				return level;
			},

			clear : function() {
				data = [];
				index = 0;
				self.typing = false;
			},

			hasUndo : function() {
				return index > 0 || this.typing;
			},

			hasRedo : function() {
				return index < data.length - 1 && !this.typing;
			}
		};

		return self;
	};
})(tinymce);

tinymce.ForceBlocks = function(editor) {
	var settings = editor.settings, dom = editor.dom, selection = editor.selection, blockElements = editor.schema.getBlockElements();

	function addRootBlocks() {
		var node = selection.getStart(), rootNode = editor.getBody(), rng, startContainer, startOffset, endContainer, endOffset, rootBlockNode, tempNode, offset = -0xFFFFFF, wrapped, isInEditorDocument;

		if (!node || node.nodeType !== 1 || !settings.forced_root_block)
			return;

		// Check if node is wrapped in block
		while (node && node != rootNode) {
			if (blockElements[node.nodeName])
				return;

			node = node.parentNode;
		}

		// Get current selection
		rng = selection.getRng();
		if (rng.setStart) {
			startContainer = rng.startContainer;
			startOffset = rng.startOffset;
			endContainer = rng.endContainer;
			endOffset = rng.endOffset;
		} else {
			// Force control range into text range
			if (rng.item) {
				node = rng.item(0);
				rng = editor.getDoc().body.createTextRange();
				rng.moveToElementText(node);
			}

			isInEditorDocument = rng.parentElement().ownerDocument === editor.getDoc();
			tmpRng = rng.duplicate();
			tmpRng.collapse(true);
			startOffset = tmpRng.move('character', offset) * -1;

			if (!tmpRng.collapsed) {
				tmpRng = rng.duplicate();
				tmpRng.collapse(false);
				endOffset = (tmpRng.move('character', offset) * -1) - startOffset;
			}
		}

		// Wrap non block elements and text nodes
		node = rootNode.firstChild;
		while (node) {
			if (node.nodeType === 3 || (node.nodeType == 1 && !blockElements[node.nodeName])) {
				// Remove empty text nodes
				if (node.nodeType === 3 && node.nodeValue.length == 0) {
					tempNode = node;
					node = node.nextSibling;
					dom.remove(tempNode);
					continue;
				}

				if (!rootBlockNode) {
					rootBlockNode = dom.create(settings.forced_root_block);
					node.parentNode.insertBefore(rootBlockNode, node);
					wrapped = true;
				}

				tempNode = node;
				node = node.nextSibling;
				rootBlockNode.appendChild(tempNode);
			} else {
				rootBlockNode = null;
				node = node.nextSibling;
			}
		}

		if (wrapped) {
			if (rng.setStart) {
				rng.setStart(startContainer, startOffset);
				rng.setEnd(endContainer, endOffset);
				selection.setRng(rng);
			} else {
				// Only select if the previous selection was inside the document to prevent auto focus in quirks mode
				if (isInEditorDocument) {
					try {
						rng = editor.getDoc().body.createTextRange();
						rng.moveToElementText(rootNode);
						rng.collapse(true);
						rng.moveStart('character', startOffset);

						if (endOffset > 0)
							rng.moveEnd('character', endOffset);

						rng.select();
					} catch (ex) {
						// Ignore
					}
				}
			}

			editor.nodeChanged();
		}
	};

	// Force root blocks
	if (settings.forced_root_block) {
		editor.onKeyUp.add(addRootBlocks);
		editor.onNodeChange.add(addRootBlocks);
	}
};

(function(tinymce) {
	// Shorten names
	var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each, extend = tinymce.extend;

	tinymce.create('tinymce.ControlManager', {
		ControlManager : function(ed, s) {
			var t = this, i;

			s = s || {};
			t.editor = ed;
			t.controls = {};
			t.onAdd = new tinymce.util.Dispatcher(t);
			t.onPostRender = new tinymce.util.Dispatcher(t);
			t.prefix = s.prefix || ed.id + '_';
			t._cls = {};

			t.onPostRender.add(function() {
				each(t.controls, function(c) {
					c.postRender();
				});
			});
		},

		get : function(id) {
			return this.controls[this.prefix + id] || this.controls[id];
		},

		setActive : function(id, s) {
			var c = null;

			if (c = this.get(id))
				c.setActive(s);

			return c;
		},

		setDisabled : function(id, s) {
			var c = null;

			if (c = this.get(id))
				c.setDisabled(s);

			return c;
		},

		add : function(c) {
			var t = this;

			if (c) {
				t.controls[c.id] = c;
				t.onAdd.dispatch(c, t);
			}

			return c;
		},

		createControl : function(name) {
			var ctrl, i, l, self = this, editor = self.editor, factories, ctrlName;

			// Build control factory cache
			if (!self.controlFactories) {
				self.controlFactories = [];
				each(editor.plugins, function(plugin) {
					if (plugin.createControl) {
						self.controlFactories.push(plugin);
					}
				});
			}

			// Create controls by asking cached factories
			factories = self.controlFactories;
			for (i = 0, l = factories.length; i < l; i++) {
				ctrl = factories[i].createControl(name, self);

				if (ctrl) {
					return self.add(ctrl);
				}
			}

			// Create sepearator
			if (name === "|" || name === "separator") {
				return self.createSeparator();
			}

			// Create control from button collection
			if (editor.buttons && (ctrl = editor.buttons[name])) {
				return self.createButton(name, ctrl);
			}

			return self.add(ctrl);
		},

		createDropMenu : function(id, s, cc) {
			var t = this, ed = t.editor, c, bm, v, cls;

			s = extend({
				'class' : 'mceDropDown',
				constrain : ed.settings.constrain_menus
			}, s);

			s['class'] = s['class'] + ' ' + ed.getParam('skin') + 'Skin';
			if (v = ed.getParam('skin_variant'))
				s['class'] += ' ' + ed.getParam('skin') + 'Skin' + v.substring(0, 1).toUpperCase() + v.substring(1);

			s['class'] += ed.settings.directionality == "rtl" ? ' mceRtl' : '';

			id = t.prefix + id;
			cls = cc || t._cls.dropmenu || tinymce.ui.DropMenu;
			c = t.controls[id] = new cls(id, s);
			c.onAddItem.add(function(c, o) {
				var s = o.settings;

				s.title = ed.getLang(s.title, s.title);

				if (!s.onclick) {
					s.onclick = function(v) {
						if (s.cmd)
							ed.execCommand(s.cmd, s.ui || false, s.value);
					};
				}
			});

			ed.onRemove.add(function() {
				c.destroy();
			});

			// Fix for bug #1897785, #1898007
			if (tinymce.isIE) {
				c.onShowMenu.add(function() {
					// IE 8 needs focus in order to store away a range with the current collapsed caret location
					ed.focus();

					bm = ed.selection.getBookmark(1);
				});

				c.onHideMenu.add(function() {
					if (bm) {
						ed.selection.moveToBookmark(bm);
						bm = 0;
					}
				});
			}

			return t.add(c);
		},

		createListBox : function(id, s, cc) {
			var t = this, ed = t.editor, cmd, c, cls;

			if (t.get(id))
				return null;

			s.title = ed.translate(s.title);
			s.scope = s.scope || ed;

			if (!s.onselect) {
				s.onselect = function(v) {
					ed.execCommand(s.cmd, s.ui || false, v || s.value);
				};
			}

			s = extend({
				title : s.title,
				'class' : 'mce_' + id,
				scope : s.scope,
				control_manager : t
			}, s);

			id = t.prefix + id;


			function useNativeListForAccessibility(ed) {
				return ed.settings.use_accessible_selects && !tinymce.isGecko
			}

			if (ed.settings.use_native_selects || useNativeListForAccessibility(ed))
				c = new tinymce.ui.NativeListBox(id, s);
			else {
				cls = cc || t._cls.listbox || tinymce.ui.ListBox;
				c = new cls(id, s, ed);
			}

			t.controls[id] = c;

			// Fix focus problem in Safari
			if (tinymce.isWebKit) {
				c.onPostRender.add(function(c, n) {
					// Store bookmark on mousedown
					Event.add(n, 'mousedown', function() {
						ed.bookmark = ed.selection.getBookmark(1);
					});

					// Restore on focus, since it might be lost
					Event.add(n, 'focus', function() {
						ed.selection.moveToBookmark(ed.bookmark);
						ed.bookmark = null;
					});
				});
			}

			if (c.hideMenu)
				ed.onMouseDown.add(c.hideMenu, c);

			return t.add(c);
		},

		createButton : function(id, s, cc) {
			var t = this, ed = t.editor, o, c, cls;

			if (t.get(id))
				return null;

			s.title = ed.translate(s.title);
			s.label = ed.translate(s.label);
			s.scope = s.scope || ed;

			if (!s.onclick && !s.menu_button) {
				s.onclick = function() {
					ed.execCommand(s.cmd, s.ui || false, s.value);
				};
			}

			s = extend({
				title : s.title,
				'class' : 'mce_' + id,
				unavailable_prefix : ed.getLang('unavailable', ''),
				scope : s.scope,
				control_manager : t
			}, s);

			id = t.prefix + id;

			if (s.menu_button) {
				cls = cc || t._cls.menubutton || tinymce.ui.MenuButton;
				c = new cls(id, s, ed);
				ed.onMouseDown.add(c.hideMenu, c);
			} else {
				cls = t._cls.button || tinymce.ui.Button;
				c = new cls(id, s, ed);
			}

			return t.add(c);
		},

		createMenuButton : function(id, s, cc) {
			s = s || {};
			s.menu_button = 1;

			return this.createButton(id, s, cc);
		},

		createSplitButton : function(id, s, cc) {
			var t = this, ed = t.editor, cmd, c, cls;

			if (t.get(id))
				return null;

			s.title = ed.translate(s.title);
			s.scope = s.scope || ed;

			if (!s.onclick) {
				s.onclick = function(v) {
					ed.execCommand(s.cmd, s.ui || false, v || s.value);
				};
			}

			if (!s.onselect) {
				s.onselect = function(v) {
					ed.execCommand(s.cmd, s.ui || false, v || s.value);
				};
			}

			s = extend({
				title : s.title,
				'class' : 'mce_' + id,
				scope : s.scope,
				control_manager : t
			}, s);

			id = t.prefix + id;
			cls = cc || t._cls.splitbutton || tinymce.ui.SplitButton;
			c = t.add(new cls(id, s, ed));
			ed.onMouseDown.add(c.hideMenu, c);

			return c;
		},

		createColorSplitButton : function(id, s, cc) {
			var t = this, ed = t.editor, cmd, c, cls, bm;

			if (t.get(id))
				return null;

			s.title = ed.translate(s.title);
			s.scope = s.scope || ed;

			if (!s.onclick) {
				s.onclick = function(v) {
					if (tinymce.isIE)
						bm = ed.selection.getBookmark(1);

					ed.execCommand(s.cmd, s.ui || false, v || s.value);
				};
			}

			if (!s.onselect) {
				s.onselect = function(v) {
					ed.execCommand(s.cmd, s.ui || false, v || s.value);
				};
			}

			s = extend({
				title : s.title,
				'class' : 'mce_' + id,
				'menu_class' : ed.getParam('skin') + 'Skin',
				scope : s.scope,
				more_colors_title : ed.getLang('more_colors')
			}, s);

			id = t.prefix + id;
			cls = cc || t._cls.colorsplitbutton || tinymce.ui.ColorSplitButton;
			c = new cls(id, s, ed);
			ed.onMouseDown.add(c.hideMenu, c);

			// Remove the menu element when the editor is removed
			ed.onRemove.add(function() {
				c.destroy();
			});

			// Fix for bug #1897785, #1898007
			if (tinymce.isIE) {
				c.onShowMenu.add(function() {
					// IE 8 needs focus in order to store away a range with the current collapsed caret location
					ed.focus();
					bm = ed.selection.getBookmark(1);
				});

				c.onHideMenu.add(function() {
					if (bm) {
						ed.selection.moveToBookmark(bm);
						bm = 0;
					}
				});
			}

			return t.add(c);
		},

		createToolbar : function(id, s, cc) {
			var c, t = this, cls;

			id = t.prefix + id;
			cls = cc || t._cls.toolbar || tinymce.ui.Toolbar;
			c = new cls(id, s, t.editor);

			if (t.get(id))
				return null;

			return t.add(c);
		},
		
		createToolbarGroup : function(id, s, cc) {
			var c, t = this, cls;
			id = t.prefix + id;
			cls = cc || this._cls.toolbarGroup || tinymce.ui.ToolbarGroup;
			c = new cls(id, s, t.editor);
			
			if (t.get(id))
				return null;
			
			return t.add(c);
		},

		createSeparator : function(cc) {
			var cls = cc || this._cls.separator || tinymce.ui.Separator;

			return new cls();
		},

		setControlType : function(n, c) {
			return this._cls[n.toLowerCase()] = c;
		},
	
		destroy : function() {
			each(this.controls, function(c) {
				c.destroy();
			});

			this.controls = null;
		}
	});
})(tinymce);

(function(tinymce) {
	var Dispatcher = tinymce.util.Dispatcher, each = tinymce.each, isIE = tinymce.isIE, isOpera = tinymce.isOpera;

	tinymce.create('tinymce.WindowManager', {
		WindowManager : function(ed) {
			var t = this;

			t.editor = ed;
			t.onOpen = new Dispatcher(t);
			t.onClose = new Dispatcher(t);
			t.params = {};
			t.features = {};
		},

		open : function(s, p) {
			var t = this, f = '', x, y, mo = t.editor.settings.dialog_type == 'modal', w, sw, sh, vp = tinymce.DOM.getViewPort(), u;

			// Default some options
			s = s || {};
			p = p || {};
			sw = isOpera ? vp.w : screen.width; // Opera uses windows inside the Opera window
			sh = isOpera ? vp.h : screen.height;
			s.name = s.name || 'mc_' + new Date().getTime();
			s.width = parseInt(s.width || 320);
			s.height = parseInt(s.height || 240);
			s.resizable = true;
			s.left = s.left || parseInt(sw / 2.0) - (s.width / 2.0);
			s.top = s.top || parseInt(sh / 2.0) - (s.height / 2.0);
			p.inline = false;
			p.mce_width = s.width;
			p.mce_height = s.height;
			p.mce_auto_focus = s.auto_focus;

			if (mo) {
				if (isIE) {
					s.center = true;
					s.help = false;
					s.dialogWidth = s.width + 'px';
					s.dialogHeight = s.height + 'px';
					s.scroll = s.scrollbars || false;
				}
			}

			// Build features string
			each(s, function(v, k) {
				if (tinymce.is(v, 'boolean'))
					v = v ? 'yes' : 'no';

				if (!/^(name|url)$/.test(k)) {
					if (isIE && mo)
						f += (f ? ';' : '') + k + ':' + v;
					else
						f += (f ? ',' : '') + k + '=' + v;
				}
			});

			t.features = s;
			t.params = p;
			t.onOpen.dispatch(t, s, p);

			u = s.url || s.file;
			u = tinymce._addVer(u);

			try {
				if (isIE && mo) {
					w = 1;
					window.showModalDialog(u, window, f);
				} else
					w = window.open(u, s.name, f);
			} catch (ex) {
				// Ignore
			}

			if (!w)
				alert(t.editor.getLang('popup_blocked'));
		},

		close : function(w) {
			w.close();
			this.onClose.dispatch(this);
		},

		createInstance : function(cl, a, b, c, d, e) {
			var f = tinymce.resolve(cl);

			return new f(a, b, c, d, e);
		},

		confirm : function(t, cb, s, w) {
			w = w || window;

			cb.call(s || this, w.confirm(this._decode(this.editor.getLang(t, t))));
		},

		alert : function(tx, cb, s, w) {
			var t = this;

			w = w || window;
			w.alert(t._decode(t.editor.getLang(tx, tx)));

			if (cb)
				cb.call(s || t);
		},

		resizeBy : function(dw, dh, win) {
			win.resizeBy(dw, dh);
		},

		// Internal functions

		_decode : function(s) {
			return tinymce.DOM.decode(s).replace(/\\n/g, '\n');
		}
	});
}(tinymce));
(function(tinymce) {
	tinymce.Formatter = function(ed) {
		var formats = {},
			each = tinymce.each,
			dom = ed.dom,
			selection = ed.selection,
			TreeWalker = tinymce.dom.TreeWalker,
			rangeUtils = new tinymce.dom.RangeUtils(dom),
			isValid = ed.schema.isValidChild,
			isArray = tinymce.isArray,
			isBlock = dom.isBlock,
			forcedRootBlock = ed.settings.forced_root_block,
			nodeIndex = dom.nodeIndex,
			INVISIBLE_CHAR = '\uFEFF',
			MCE_ATTR_RE = /^(src|href|style)$/,
			FALSE = false,
			TRUE = true,
			formatChangeData,
			undef,
			getContentEditable = dom.getContentEditable;

		function isTextBlock(name) {
			return !!ed.schema.getTextBlocks()[name.toLowerCase()];
		}

		function getParents(node, selector) {
			return dom.getParents(node, selector, dom.getRoot());
		};

		function isCaretNode(node) {
			return node.nodeType === 1 && node.id === '_mce_caret';
		};

		function defaultFormats() {
			register({
				alignleft : [
					{selector : 'figure,p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li', styles : {textAlign : 'left'}, defaultBlock: 'div'},
					{selector : 'img,table', collapsed : false, styles : {'float' : 'left'}}
				],

				aligncenter : [
					{selector : 'figure,p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li', styles : {textAlign : 'center'}, defaultBlock: 'div'},
					{selector : 'img', collapsed : false, styles : {display : 'block', marginLeft : 'auto', marginRight : 'auto'}},
					{selector : 'table', collapsed : false, styles : {marginLeft : 'auto', marginRight : 'auto'}}
				],

				alignright : [
					{selector : 'figure,p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li', styles : {textAlign : 'right'}, defaultBlock: 'div'},
					{selector : 'img,table', collapsed : false, styles : {'float' : 'right'}}
				],

				alignfull : [
					{selector : 'figure,p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li', styles : {textAlign : 'justify'}, defaultBlock: 'div'}
				],

				bold : [
					{inline : 'strong', remove : 'all'},
					{inline : 'span', styles : {fontWeight : 'bold'}},
					{inline : 'b', remove : 'all'}
				],

				italic : [
					{inline : 'em', remove : 'all'},
					{inline : 'span', styles : {fontStyle : 'italic'}},
					{inline : 'i', remove : 'all'}
				],

				underline : [
					{inline : 'span', styles : {textDecoration : 'underline'}, exact : true},
					{inline : 'u', remove : 'all'}
				],

				strikethrough : [
					{inline : 'span', styles : {textDecoration : 'line-through'}, exact : true},
					{inline : 'strike', remove : 'all'}
				],

				forecolor : {inline : 'span', styles : {color : '%value'}, wrap_links : false},
				hilitecolor : {inline : 'span', styles : {backgroundColor : '%value'}, wrap_links : false},
				fontname : {inline : 'span', styles : {fontFamily : '%value'}},
				fontsize : {inline : 'span', styles : {fontSize : '%value'}},
				fontsize_class : {inline : 'span', attributes : {'class' : '%value'}},
				blockquote : {block : 'blockquote', wrapper : 1, remove : 'all'},
				subscript : {inline : 'sub'},
				superscript : {inline : 'sup'},

				link : {inline : 'a', selector : 'a', remove : 'all', split : true, deep : true,
					onmatch : function(node) {
						return true;
					},

					onformat : function(elm, fmt, vars) {
						each(vars, function(value, key) {
							dom.setAttrib(elm, key, value);
						});
					}
				},

				removeformat : [
					{selector : 'b,strong,em,i,font,u,strike', remove : 'all', split : true, expand : false, block_expand : true, deep : true},
					{selector : 'span', attributes : ['style', 'class'], remove : 'empty', split : true, expand : false, deep : true},
					{selector : '*', attributes : ['style', 'class'], split : false, expand : false, deep : true}
				]
			});

			// Register default block formats
			each('p h1 h2 h3 h4 h5 h6 div address pre div code dt dd samp'.split(/\s/), function(name) {
				register(name, {block : name, remove : 'all'});
			});

			// Register user defined formats
			register(ed.settings.formats);
		};

		function addKeyboardShortcuts() {
			// Add some inline shortcuts
			ed.addShortcut('ctrl+b', 'bold_desc', 'Bold');
			ed.addShortcut('ctrl+i', 'italic_desc', 'Italic');
			ed.addShortcut('ctrl+u', 'underline_desc', 'Underline');

			// BlockFormat shortcuts keys
			for (var i = 1; i <= 6; i++) {
				ed.addShortcut('ctrl+' + i, '', ['FormatBlock', false, 'h' + i]);
			}

			ed.addShortcut('ctrl+7', '', ['FormatBlock', false, 'p']);
			ed.addShortcut('ctrl+8', '', ['FormatBlock', false, 'div']);
			ed.addShortcut('ctrl+9', '', ['FormatBlock', false, 'address']);
		};

		// Public functions

		function get(name) {
			return name ? formats[name] : formats;
		};

		function register(name, format) {
			if (name) {
				if (typeof(name) !== 'string') {
					each(name, function(format, name) {
						register(name, format);
					});
				} else {
					// Force format into array and add it to internal collection
					format = format.length ? format : [format];

					each(format, function(format) {
						// Set deep to false by default on selector formats this to avoid removing
						// alignment on images inside paragraphs when alignment is changed on paragraphs
						if (format.deep === undef)
							format.deep = !format.selector;

						// Default to true
						if (format.split === undef)
							format.split = !format.selector || format.inline;

						// Default to true
						if (format.remove === undef && format.selector && !format.inline)
							format.remove = 'none';

						// Mark format as a mixed format inline + block level
						if (format.selector && format.inline) {
							format.mixed = true;
							format.block_expand = true;
						}

						// Split classes if needed
						if (typeof(format.classes) === 'string')
							format.classes = format.classes.split(/\s+/);
					});

					formats[name] = format;
				}
			}
		};

		var getTextDecoration = function(node) {
			var decoration;

			ed.dom.getParent(node, function(n) {
				decoration = ed.dom.getStyle(n, 'text-decoration');
				return decoration && decoration !== 'none';
			});

			return decoration;
		};

		var processUnderlineAndColor = function(node) {
			var textDecoration;
			if (node.nodeType === 1 && node.parentNode && node.parentNode.nodeType === 1) {
				textDecoration = getTextDecoration(node.parentNode);
				if (ed.dom.getStyle(node, 'color') && textDecoration) {
					ed.dom.setStyle(node, 'text-decoration', textDecoration);
				} else if (ed.dom.getStyle(node, 'textdecoration') === textDecoration) {
					ed.dom.setStyle(node, 'text-decoration', null);
				}
			}
		};

		function apply(name, vars, node) {
			var formatList = get(name), format = formatList[0], bookmark, rng, i, isCollapsed = selection.isCollapsed();

			function setElementFormat(elm, fmt) {
				fmt = fmt || format;

				if (elm) {
					if (fmt.onformat) {
						fmt.onformat(elm, fmt, vars, node);
					}

					each(fmt.styles, function(value, name) {
						dom.setStyle(elm, name, replaceVars(value, vars));
					});

					each(fmt.attributes, function(value, name) {
						dom.setAttrib(elm, name, replaceVars(value, vars));
					});

					each(fmt.classes, function(value) {
						value = replaceVars(value, vars);

						if (!dom.hasClass(elm, value))
							dom.addClass(elm, value);
					});
				}
			};
			function adjustSelectionToVisibleSelection() {
				function findSelectionEnd(start, end) {
					var walker = new TreeWalker(end);
					for (node = walker.current(); node; node = walker.prev()) {
						if (node.childNodes.length > 1 || node == start || node.tagName == 'BR') {
							return node;
						}
					}
				};

				// Adjust selection so that a end container with a end offset of zero is not included in the selection
				// as this isn't visible to the user.
				var rng = ed.selection.getRng();
				var start = rng.startContainer;
				var end = rng.endContainer;

				if (start != end && rng.endOffset === 0) {
					var newEnd = findSelectionEnd(start, end);
					var endOffset = newEnd.nodeType == 3 ? newEnd.length : newEnd.childNodes.length;

					rng.setEnd(newEnd, endOffset);
				}

				return rng;
			}
			
			function applyStyleToList(node, bookmark, wrapElm, newWrappers, process){
				var nodes = [], listIndex = -1, list, startIndex = -1, endIndex = -1, currentWrapElm;
				
				// find the index of the first child list.
				each(node.childNodes, function(n, index) {
					if (n.nodeName === "UL" || n.nodeName === "OL") {
						listIndex = index;
						list = n;
						return false;
					}
				});
				
				// get the index of the bookmarks
				each(node.childNodes, function(n, index) {
					if (n.nodeName === "SPAN" && dom.getAttrib(n, "data-mce-type") == "bookmark") {
						if (n.id == bookmark.id + "_start") {
							startIndex = index;
						} else if (n.id == bookmark.id + "_end") {
							endIndex = index;
						}
					}
				});
				
				// if the selection spans across an embedded list, or there isn't an embedded list - handle processing normally
				if (listIndex <= 0 || (startIndex < listIndex && endIndex > listIndex)) {
					each(tinymce.grep(node.childNodes), process);
					return 0;
				} else {
					currentWrapElm = dom.clone(wrapElm, FALSE);

					// create a list of the nodes on the same side of the list as the selection
					each(tinymce.grep(node.childNodes), function(n, index) {
						if ((startIndex < listIndex && index < listIndex) || (startIndex > listIndex && index > listIndex)) {
							nodes.push(n); 
							n.parentNode.removeChild(n);
						}
					});

					// insert the wrapping element either before or after the list.
					if (startIndex < listIndex) {
						node.insertBefore(currentWrapElm, list);
					} else if (startIndex > listIndex) {
						node.insertBefore(currentWrapElm, list.nextSibling);
					}
					
					// add the new nodes to the list.
					newWrappers.push(currentWrapElm);

					each(nodes, function(node) {
						currentWrapElm.appendChild(node);
					});

					return currentWrapElm;
				}
			};

			function applyRngStyle(rng, bookmark, node_specific) {
				var newWrappers = [], wrapName, wrapElm, contentEditable = true;

				// Setup wrapper element
				wrapName = format.inline || format.block;
				wrapElm = dom.create(wrapName);
				setElementFormat(wrapElm);

				rangeUtils.walk(rng, function(nodes) {
					var currentWrapElm;

					function process(node) {
						var nodeName, parentName, found, hasContentEditableState, lastContentEditable;

						lastContentEditable = contentEditable;
						nodeName = node.nodeName.toLowerCase();
						parentName = node.parentNode.nodeName.toLowerCase();

						// Node has a contentEditable value
						if (node.nodeType === 1 && getContentEditable(node)) {
							lastContentEditable = contentEditable;
							contentEditable = getContentEditable(node) === "true";
							hasContentEditableState = true; // We don't want to wrap the container only it's children
						}

						// Stop wrapping on br elements
						if (isEq(nodeName, 'br')) {
							currentWrapElm = 0;

							// Remove any br elements when we wrap things
							if (format.block)
								dom.remove(node);

							return;
						}

						// If node is wrapper type
						if (format.wrapper && matchNode(node, name, vars)) {
							currentWrapElm = 0;
							return;
						}

						// Can we rename the block
						if (contentEditable && !hasContentEditableState && format.block && !format.wrapper && isTextBlock(nodeName)) {
							node = dom.rename(node, wrapName);
							setElementFormat(node);
							newWrappers.push(node);
							currentWrapElm = 0;
							return;
						}

						// Handle selector patterns
						if (format.selector) {
							// Look for matching formats
							each(formatList, function(format) {
								// Check collapsed state if it exists
								if ('collapsed' in format && format.collapsed !== isCollapsed) {
									return;
								}

								if (dom.is(node, format.selector) && !isCaretNode(node)) {
									setElementFormat(node, format);
									found = true;
								}
							});

							// Continue processing if a selector match wasn't found and a inline element is defined
							if (!format.inline || found) {
								currentWrapElm = 0;
								return;
							}
						}

						// Is it valid to wrap this item
						if (contentEditable && !hasContentEditableState && isValid(wrapName, nodeName) && isValid(parentName, wrapName) &&
								!(!node_specific && node.nodeType === 3 && node.nodeValue.length === 1 && node.nodeValue.charCodeAt(0) === 65279) && !isCaretNode(node)) {
							// Start wrapping
							if (!currentWrapElm) {
								// Wrap the node
								currentWrapElm = dom.clone(wrapElm, FALSE);
								node.parentNode.insertBefore(currentWrapElm, node);
								newWrappers.push(currentWrapElm);
							}

							currentWrapElm.appendChild(node);
						} else if (nodeName == 'li' && bookmark) {
							// Start wrapping - if we are in a list node and have a bookmark, then we will always begin by wrapping in a new element.
							currentWrapElm = applyStyleToList(node, bookmark, wrapElm, newWrappers, process);
						} else {
							// Start a new wrapper for possible children
							currentWrapElm = 0;
							
							each(tinymce.grep(node.childNodes), process);

							if (hasContentEditableState) {
								contentEditable = lastContentEditable; // Restore last contentEditable state from stack
							}

							// End the last wrapper
							currentWrapElm = 0;
						}
					};

					// Process siblings from range
					each(nodes, process);
				});

				// Wrap links inside as well, for example color inside a link when the wrapper is around the link
				if (format.wrap_links === false) {
					each(newWrappers, function(node) {
						function process(node) {
							var i, currentWrapElm, children;

							if (node.nodeName === 'A') {
								currentWrapElm = dom.clone(wrapElm, FALSE);
								newWrappers.push(currentWrapElm);

								children = tinymce.grep(node.childNodes);
								for (i = 0; i < children.length; i++)
									currentWrapElm.appendChild(children[i]);

								node.appendChild(currentWrapElm);
							}

							each(tinymce.grep(node.childNodes), process);
						};

						process(node);
					});
				}

				// Cleanup
				
				each(newWrappers, function(node) {
					var childCount;

					function getChildCount(node) {
						var count = 0;

						each(node.childNodes, function(node) {
							if (!isWhiteSpaceNode(node) && !isBookmarkNode(node))
								count++;
						});

						return count;
					};

					function mergeStyles(node) {
						var child, clone;

						each(node.childNodes, function(node) {
							if (node.nodeType == 1 && !isBookmarkNode(node) && !isCaretNode(node)) {
								child = node;
								return FALSE; // break loop
							}
						});

						// If child was found and of the same type as the current node
						if (child && matchName(child, format)) {
							clone = dom.clone(child, FALSE);
							setElementFormat(clone);

							dom.replace(clone, node, TRUE);
							dom.remove(child, 1);
						}

						return clone || node;
					};

					childCount = getChildCount(node);

					// Remove empty nodes but only if there is multiple wrappers and they are not block
					// elements so never remove single <h1></h1> since that would remove the currrent empty block element where the caret is at
					if ((newWrappers.length > 1 || !isBlock(node)) && childCount === 0) {
						dom.remove(node, 1);
						return;
					}

					if (format.inline || format.wrapper) {
						// Merges the current node with it's children of similar type to reduce the number of elements
						if (!format.exact && childCount === 1)
							node = mergeStyles(node);

						// Remove/merge children
						each(formatList, function(format) {
							// Merge all children of similar type will move styles from child to parent
							// this: <span style="color:red"><b><span style="color:red; font-size:10px">text</span></b></span>
							// will become: <span style="color:red"><b><span style="font-size:10px">text</span></b></span>
							each(dom.select(format.inline, node), function(child) {
								var parent;

								// When wrap_links is set to false we don't want
								// to remove the format on children within links
								if (format.wrap_links === false) {
									parent = child.parentNode;

									do {
										if (parent.nodeName === 'A')
											return;
									} while (parent = parent.parentNode);
								}

								removeFormat(format, vars, child, format.exact ? child : null);
							});
						});

						// Remove child if direct parent is of same type
						if (matchNode(node.parentNode, name, vars)) {
							dom.remove(node, 1);
							node = 0;
							return TRUE;
						}

						// Look for parent with similar style format
						if (format.merge_with_parents) {
							dom.getParent(node.parentNode, function(parent) {
								if (matchNode(parent, name, vars)) {
									dom.remove(node, 1);
									node = 0;
									return TRUE;
								}
							});
						}

						// Merge next and previous siblings if they are similar <b>text</b><b>text</b> becomes <b>texttext</b>
						if (node && format.merge_siblings !== false) {
							node = mergeSiblings(getNonWhiteSpaceSibling(node), node);
							node = mergeSiblings(node, getNonWhiteSpaceSibling(node, TRUE));
						}
					}
				});
			};

			if (format) {
				if (node) {
					if (node.nodeType) {
						rng = dom.createRng();
						rng.setStartBefore(node);
						rng.setEndAfter(node);
						applyRngStyle(expandRng(rng, formatList), null, true);
					} else {
						applyRngStyle(node, null, true);
					}
				} else {
					if (!isCollapsed || !format.inline || dom.select('td.mceSelected,th.mceSelected').length) {
						// Obtain selection node before selection is unselected by applyRngStyle()
						var curSelNode = ed.selection.getNode();

						// If the formats have a default block and we can't find a parent block then start wrapping it with a DIV this is for forced_root_blocks: false
						// It's kind of a hack but people should be using the default block type P since all desktop editors work that way
						if (!forcedRootBlock && formatList[0].defaultBlock && !dom.getParent(curSelNode, dom.isBlock)) {
							apply(formatList[0].defaultBlock);
						}

						// Apply formatting to selection
						ed.selection.setRng(adjustSelectionToVisibleSelection());
						bookmark = selection.getBookmark();
						applyRngStyle(expandRng(selection.getRng(TRUE), formatList), bookmark);

						// Colored nodes should be underlined so that the color of the underline matches the text color.
						if (format.styles && (format.styles.color || format.styles.textDecoration)) {
							tinymce.walk(curSelNode, processUnderlineAndColor, 'childNodes');
							processUnderlineAndColor(curSelNode);
						}

						selection.moveToBookmark(bookmark);
						moveStart(selection.getRng(TRUE));
						ed.nodeChanged();
					} else
						performCaretAction('apply', name, vars);
				}
			}
		};

		function remove(name, vars, node) {
			var formatList = get(name), format = formatList[0], bookmark, i, rng, contentEditable = true;

			// Merges the styles for each node
			function process(node) {
				var children, i, l, localContentEditable, lastContentEditable, hasContentEditableState;

				// Skip on text nodes as they have neither format to remove nor children
				if (node.nodeType === 3) {
					return;
				}

				// Node has a contentEditable value
				if (node.nodeType === 1 && getContentEditable(node)) {
					lastContentEditable = contentEditable;
					contentEditable = getContentEditable(node) === "true";
					hasContentEditableState = true; // We don't want to wrap the container only it's children
				}

				// Grab the children first since the nodelist might be changed
				children = tinymce.grep(node.childNodes);

				// Process current node
				if (contentEditable && !hasContentEditableState) {
					for (i = 0, l = formatList.length; i < l; i++) {
						if (removeFormat(formatList[i], vars, node, node))
							break;
					}
				}

				// Process the children
				if (format.deep) {
					if (children.length) {					
						for (i = 0, l = children.length; i < l; i++)
							process(children[i]);

						if (hasContentEditableState) {
							contentEditable = lastContentEditable; // Restore last contentEditable state from stack
						}
					}
				}
			};

			function findFormatRoot(container) {
				var formatRoot;

				// Find format root
				each(getParents(container.parentNode).reverse(), function(parent) {
					var format;

					// Find format root element
					if (!formatRoot && parent.id != '_start' && parent.id != '_end') {
						// Is the node matching the format we are looking for
						format = matchNode(parent, name, vars);
						if (format && format.split !== false)
							formatRoot = parent;
					}
				});

				return formatRoot;
			};

			function wrapAndSplit(format_root, container, target, split) {
				var parent, clone, lastClone, firstClone, i, formatRootParent;

				// Format root found then clone formats and split it
				if (format_root) {
					formatRootParent = format_root.parentNode;

					for (parent = container.parentNode; parent && parent != formatRootParent; parent = parent.parentNode) {
						clone = dom.clone(parent, FALSE);

						for (i = 0; i < formatList.length; i++) {
							if (removeFormat(formatList[i], vars, clone, clone)) {
								clone = 0;
								break;
							}
						}

						// Build wrapper node
						if (clone) {
							if (lastClone)
								clone.appendChild(lastClone);

							if (!firstClone)
								firstClone = clone;

							lastClone = clone;
						}
					}

					// Never split block elements if the format is mixed
					if (split && (!format.mixed || !isBlock(format_root)))
						container = dom.split(format_root, container);

					// Wrap container in cloned formats
					if (lastClone) {
						target.parentNode.insertBefore(lastClone, target);
						firstClone.appendChild(target);
					}
				}

				return container;
			};

			function splitToFormatRoot(container) {
				return wrapAndSplit(findFormatRoot(container), container, container, true);
			};

			function unwrap(start) {
				var node = dom.get(start ? '_start' : '_end'),
					out = node[start ? 'firstChild' : 'lastChild'];

				// If the end is placed within the start the result will be removed
				// So this checks if the out node is a bookmark node if it is it
				// checks for another more suitable node
				if (isBookmarkNode(out))
					out = out[start ? 'firstChild' : 'lastChild'];

				dom.remove(node, true);

				return out;
			};

			function removeRngStyle(rng) {
				var startContainer, endContainer, node;

				rng = expandRng(rng, formatList, TRUE);

				if (format.split) {
					startContainer = getContainer(rng, TRUE);
					endContainer = getContainer(rng);

					if (startContainer != endContainer) {
						// WebKit will render the table incorrectly if we wrap a TD in a SPAN so lets see if the can use the first child instead
						// This will happen if you tripple click a table cell and use remove formatting
						if (/^(TR|TD)$/.test(startContainer.nodeName) && startContainer.firstChild) {
							startContainer = (startContainer.nodeName == "TD" ? startContainer.firstChild : startContainer.firstChild.firstChild) || startContainer;
						}

						// Wrap start/end nodes in span element since these might be cloned/moved
						startContainer = wrap(startContainer, 'span', {id : '_start', 'data-mce-type' : 'bookmark'});
						endContainer = wrap(endContainer, 'span', {id : '_end', 'data-mce-type' : 'bookmark'});

						// Split start/end
						splitToFormatRoot(startContainer);
						splitToFormatRoot(endContainer);

						// Unwrap start/end to get real elements again
						startContainer = unwrap(TRUE);
						endContainer = unwrap();
					} else
						startContainer = endContainer = splitToFormatRoot(startContainer);

					// Update range positions since they might have changed after the split operations
					rng.startContainer = startContainer.parentNode;
					rng.startOffset = nodeIndex(startContainer);
					rng.endContainer = endContainer.parentNode;
					rng.endOffset = nodeIndex(endContainer) + 1;
				}

				// Remove items between start/end
				rangeUtils.walk(rng, function(nodes) {
					each(nodes, function(node) {
						process(node);

						// Remove parent span if it only contains text-decoration: underline, yet a parent node is also underlined.
						if (node.nodeType === 1 && ed.dom.getStyle(node, 'text-decoration') === 'underline' && node.parentNode && getTextDecoration(node.parentNode) === 'underline') {
							removeFormat({'deep': false, 'exact': true, 'inline': 'span', 'styles': {'textDecoration' : 'underline'}}, null, node);
						}
					});
				});
			};

			// Handle node
			if (node) {
				if (node.nodeType) {
					rng = dom.createRng();
					rng.setStartBefore(node);
					rng.setEndAfter(node);
					removeRngStyle(rng);
				} else {
					removeRngStyle(node);
				}

				return;
			}

			if (!selection.isCollapsed() || !format.inline || dom.select('td.mceSelected,th.mceSelected').length) {
				bookmark = selection.getBookmark();
				removeRngStyle(selection.getRng(TRUE));
				selection.moveToBookmark(bookmark);

				// Check if start element still has formatting then we are at: "<b>text|</b>text" and need to move the start into the next text node
				if (format.inline && match(name, vars, selection.getStart())) {
					moveStart(selection.getRng(true));
				}

				ed.nodeChanged();
			} else
				performCaretAction('remove', name, vars);
		};

		function toggle(name, vars, node) {
			var fmt = get(name);

			if (match(name, vars, node) && (!('toggle' in fmt[0]) || fmt[0].toggle))
				remove(name, vars, node);
			else
				apply(name, vars, node);
		};

		function matchNode(node, name, vars, similar) {
			var formatList = get(name), format, i, classes;

			function matchItems(node, format, item_name) {
				var key, value, items = format[item_name], i;

				// Custom match
				if (format.onmatch) {
					return format.onmatch(node, format, item_name);
				}

				// Check all items
				if (items) {
					// Non indexed object
					if (items.length === undef) {
						for (key in items) {
							if (items.hasOwnProperty(key)) {
								if (item_name === 'attributes')
									value = dom.getAttrib(node, key);
								else
									value = getStyle(node, key);

								if (similar && !value && !format.exact)
									return;

								if ((!similar || format.exact) && !isEq(value, replaceVars(items[key], vars)))
									return;
							}
						}
					} else {
						// Only one match needed for indexed arrays
						for (i = 0; i < items.length; i++) {
							if (item_name === 'attributes' ? dom.getAttrib(node, items[i]) : getStyle(node, items[i]))
								return format;
						}
					}
				}

				return format;
			};

			if (formatList && node) {
				// Check each format in list
				for (i = 0; i < formatList.length; i++) {
					format = formatList[i];

					// Name name, attributes, styles and classes
					if (matchName(node, format) && matchItems(node, format, 'attributes') && matchItems(node, format, 'styles')) {
						// Match classes
						if (classes = format.classes) {
							for (i = 0; i < classes.length; i++) {
								if (!dom.hasClass(node, classes[i]))
									return;
							}
						}

						return format;
					}
				}
			}
		};

		function match(name, vars, node) {
			var startNode;

			function matchParents(node) {
				// Find first node with similar format settings
				node = dom.getParent(node, function(node) {
					return !!matchNode(node, name, vars, true);
				});

				// Do an exact check on the similar format element
				return matchNode(node, name, vars);
			};

			// Check specified node
			if (node)
				return matchParents(node);

			// Check selected node
			node = selection.getNode();
			if (matchParents(node))
				return TRUE;

			// Check start node if it's different
			startNode = selection.getStart();
			if (startNode != node) {
				if (matchParents(startNode))
					return TRUE;
			}

			return FALSE;
		};

		function matchAll(names, vars) {
			var startElement, matchedFormatNames = [], checkedMap = {}, i, ni, name;

			// Check start of selection for formats
			startElement = selection.getStart();
			dom.getParent(startElement, function(node) {
				var i, name;

				for (i = 0; i < names.length; i++) {
					name = names[i];

					if (!checkedMap[name] && matchNode(node, name, vars)) {
						checkedMap[name] = true;
						matchedFormatNames.push(name);
					}
				}
			}, dom.getRoot());

			return matchedFormatNames;
		};

		function canApply(name) {
			var formatList = get(name), startNode, parents, i, x, selector;

			if (formatList) {
				startNode = selection.getStart();
				parents = getParents(startNode);

				for (x = formatList.length - 1; x >= 0; x--) {
					selector = formatList[x].selector;

					// Format is not selector based, then always return TRUE
					if (!selector)
						return TRUE;

					for (i = parents.length - 1; i >= 0; i--) {
						if (dom.is(parents[i], selector))
							return TRUE;
					}
				}
			}

			return FALSE;
		};

		function formatChanged(formats, callback, similar) {
			var currentFormats;

			// Setup format node change logic
			if (!formatChangeData) {
				formatChangeData = {};
				currentFormats = {};

				ed.onNodeChange.addToTop(function(ed, cm, node) {
					var parents = getParents(node), matchedFormats = {};

					// Check for new formats
					each(formatChangeData, function(callbacks, format) {
						each(parents, function(node) {
							if (matchNode(node, format, {}, callbacks.similar)) {
								if (!currentFormats[format]) {
									// Execute callbacks
									each(callbacks, function(callback) {
										callback(true, {node: node, format: format, parents: parents});
									});

									currentFormats[format] = callbacks;
								}

								matchedFormats[format] = callbacks;
								return false;
							}
						});
					});

					// Check if current formats still match
					each(currentFormats, function(callbacks, format) {
						if (!matchedFormats[format]) {
							delete currentFormats[format];

							each(callbacks, function(callback) {
								callback(false, {node: node, format: format, parents: parents});
							});
						}
					});
				});
			}

			// Add format listeners
			each(formats.split(','), function(format) {
				if (!formatChangeData[format]) {
					formatChangeData[format] = [];
					formatChangeData[format].similar = similar;
				}

				formatChangeData[format].push(callback);
			});

			return this;
		};

		// Expose to public
		tinymce.extend(this, {
			get : get,
			register : register,
			apply : apply,
			remove : remove,
			toggle : toggle,
			match : match,
			matchAll : matchAll,
			matchNode : matchNode,
			canApply : canApply,
			formatChanged: formatChanged
		});

		// Initialize
		defaultFormats();
		addKeyboardShortcuts();

		// Private functions

		function matchName(node, format) {
			// Check for inline match
			if (isEq(node, format.inline))
				return TRUE;

			// Check for block match
			if (isEq(node, format.block))
				return TRUE;

			// Check for selector match
			if (format.selector)
				return dom.is(node, format.selector);
		};

		function isEq(str1, str2) {
			str1 = str1 || '';
			str2 = str2 || '';

			str1 = '' + (str1.nodeName || str1);
			str2 = '' + (str2.nodeName || str2);

			return str1.toLowerCase() == str2.toLowerCase();
		};

		function getStyle(node, name) {
			var styleVal = dom.getStyle(node, name);

			// Force the format to hex
			if (name == 'color' || name == 'backgroundColor')
				styleVal = dom.toHex(styleVal);

			// Opera will return bold as 700
			if (name == 'fontWeight' && styleVal == 700)
				styleVal = 'bold';

			return '' + styleVal;
		};

		function replaceVars(value, vars) {
			if (typeof(value) != "string")
				value = value(vars);
			else if (vars) {
				value = value.replace(/%(\w+)/g, function(str, name) {
					return vars[name] || str;
				});
			}

			return value;
		};

		function isWhiteSpaceNode(node) {
			return node && node.nodeType === 3 && /^([\t \r\n]+|)$/.test(node.nodeValue);
		};

		function wrap(node, name, attrs) {
			var wrapper = dom.create(name, attrs);

			node.parentNode.insertBefore(wrapper, node);
			wrapper.appendChild(node);

			return wrapper;
		};

		function expandRng(rng, format, remove) {
			var sibling, lastIdx, leaf, endPoint,
				startContainer = rng.startContainer,
				startOffset = rng.startOffset,
				endContainer = rng.endContainer,
				endOffset = rng.endOffset;

			// This function walks up the tree if there is no siblings before/after the node
			function findParentContainer(start) {
				var container, parent, child, sibling, siblingName, root;

				container = parent = start ? startContainer : endContainer;
				siblingName = start ? 'previousSibling' : 'nextSibling';
				root = dom.getRoot();

				function isBogusBr(node) {
					return node.nodeName == "BR" && node.getAttribute('data-mce-bogus') && !node.nextSibling;
				};

				// If it's a text node and the offset is inside the text
				if (container.nodeType == 3 && !isWhiteSpaceNode(container)) {
					if (start ? startOffset > 0 : endOffset < container.nodeValue.length) {
						return container;
					}
				}

				for (;;) {
					// Stop expanding on block elements
					if (!format[0].block_expand && isBlock(parent))
						return parent;

					// Walk left/right
					for (sibling = parent[siblingName]; sibling; sibling = sibling[siblingName]) {
						if (!isBookmarkNode(sibling) && !isWhiteSpaceNode(sibling) && !isBogusBr(sibling)) {
							return parent;
						}
					}

					// Check if we can move up are we at root level or body level
					if (parent.parentNode == root) {
						container = parent;
						break;
					}

					parent = parent.parentNode;
				}

				return container;
			};

			// This function walks down the tree to find the leaf at the selection.
			// The offset is also returned as if node initially a leaf, the offset may be in the middle of the text node.
			function findLeaf(node, offset) {
				if (offset === undef)
					offset = node.nodeType === 3 ? node.length : node.childNodes.length;
				while (node && node.hasChildNodes()) {
					node = node.childNodes[offset];
					if (node)
						offset = node.nodeType === 3 ? node.length : node.childNodes.length;
				}
				return { node: node, offset: offset };
			}

			// If index based start position then resolve it
			if (startContainer.nodeType == 1 && startContainer.hasChildNodes()) {
				lastIdx = startContainer.childNodes.length - 1;
				startContainer = startContainer.childNodes[startOffset > lastIdx ? lastIdx : startOffset];

				if (startContainer.nodeType == 3)
					startOffset = 0;
			}

			// If index based end position then resolve it
			if (endContainer.nodeType == 1 && endContainer.hasChildNodes()) {
				lastIdx = endContainer.childNodes.length - 1;
				endContainer = endContainer.childNodes[endOffset > lastIdx ? lastIdx : endOffset - 1];

				if (endContainer.nodeType == 3)
					endOffset = endContainer.nodeValue.length;
			}

			// Expands the node to the closes contentEditable false element if it exists
			function findParentContentEditable(node) {
				var parent = node;

				while (parent) {
					if (parent.nodeType === 1 && getContentEditable(parent)) {
						return getContentEditable(parent) === "false" ? parent : node;
					}

					parent = parent.parentNode;
				}

				return node;
			};

			function findWordEndPoint(container, offset, start) {
				var walker, node, pos, lastTextNode;

				function findSpace(node, offset) {
					var pos, pos2, str = node.nodeValue;

					if (typeof(offset) == "undefined") {
						offset = start ? str.length : 0;
					}

					if (start) {
						pos = str.lastIndexOf(' ', offset);
						pos2 = str.lastIndexOf('\u00a0', offset);
						pos = pos > pos2 ? pos : pos2;

						// Include the space on remove to avoid tag soup
						if (pos !== -1 && !remove) {
							pos++;
						}
					} else {
						pos = str.indexOf(' ', offset);
						pos2 = str.indexOf('\u00a0', offset);
						pos = pos !== -1 && (pos2 === -1 || pos < pos2) ? pos : pos2;
					}

					return pos;
				};

				if (container.nodeType === 3) {
					pos = findSpace(container, offset);

					if (pos !== -1) {
						return {container : container, offset : pos};
					}

					lastTextNode = container;
				}

				// Walk the nodes inside the block
				walker = new TreeWalker(container, dom.getParent(container, isBlock) || ed.getBody());
				while (node = walker[start ? 'prev' : 'next']()) {
					if (node.nodeType === 3) {
						lastTextNode = node;
						pos = findSpace(node);

						if (pos !== -1) {
							return {container : node, offset : pos};
						}
					} else if (isBlock(node)) {
						break;
					}
				}

				if (lastTextNode) {
					if (start) {
						offset = 0;
					} else {
						offset = lastTextNode.length;
					}

					return {container: lastTextNode, offset: offset};
				}
			};

			function findSelectorEndPoint(container, sibling_name) {
				var parents, i, y, curFormat;

				if (container.nodeType == 3 && container.nodeValue.length === 0 && container[sibling_name])
					container = container[sibling_name];

				parents = getParents(container);
				for (i = 0; i < parents.length; i++) {
					for (y = 0; y < format.length; y++) {
						curFormat = format[y];

						// If collapsed state is set then skip formats that doesn't match that
						if ("collapsed" in curFormat && curFormat.collapsed !== rng.collapsed)
							continue;

						if (dom.is(parents[i], curFormat.selector))
							return parents[i];
					}
				}

				return container;
			};

			function findBlockEndPoint(container, sibling_name, sibling_name2) {
				var node;

				// Expand to block of similar type
				if (!format[0].wrapper)
					node = dom.getParent(container, format[0].block);

				// Expand to first wrappable block element or any block element
				if (!node)
					node = dom.getParent(container.nodeType == 3 ? container.parentNode : container, isTextBlock);

				// Exclude inner lists from wrapping
				if (node && format[0].wrapper)
					node = getParents(node, 'ul,ol').reverse()[0] || node;

				// Didn't find a block element look for first/last wrappable element
				if (!node) {
					node = container;

					while (node[sibling_name] && !isBlock(node[sibling_name])) {
						node = node[sibling_name];

						// Break on BR but include it will be removed later on
						// we can't remove it now since we need to check if it can be wrapped
						if (isEq(node, 'br'))
							break;
					}
				}

				return node || container;
			};

			// Expand to closest contentEditable element
			startContainer = findParentContentEditable(startContainer);
			endContainer = findParentContentEditable(endContainer);

			// Exclude bookmark nodes if possible
			if (isBookmarkNode(startContainer.parentNode) || isBookmarkNode(startContainer)) {
				startContainer = isBookmarkNode(startContainer) ? startContainer : startContainer.parentNode;
				startContainer = startContainer.nextSibling || startContainer;

				if (startContainer.nodeType == 3)
					startOffset = 0;
			}

			if (isBookmarkNode(endContainer.parentNode) || isBookmarkNode(endContainer)) {
				endContainer = isBookmarkNode(endContainer) ? endContainer : endContainer.parentNode;
				endContainer = endContainer.previousSibling || endContainer;

				if (endContainer.nodeType == 3)
					endOffset = endContainer.length;
			}

			if (format[0].inline) {
				if (rng.collapsed) {
					// Expand left to closest word boundery
					endPoint = findWordEndPoint(startContainer, startOffset, true);
					if (endPoint) {
						startContainer = endPoint.container;
						startOffset = endPoint.offset;
					}

					// Expand right to closest word boundery
					endPoint = findWordEndPoint(endContainer, endOffset);
					if (endPoint) {
						endContainer = endPoint.container;
						endOffset = endPoint.offset;
					}
				}

				// Avoid applying formatting to a trailing space.
				leaf = findLeaf(endContainer, endOffset);
				if (leaf.node) {
					while (leaf.node && leaf.offset === 0 && leaf.node.previousSibling)
						leaf = findLeaf(leaf.node.previousSibling);

					if (leaf.node && leaf.offset > 0 && leaf.node.nodeType === 3 &&
							leaf.node.nodeValue.charAt(leaf.offset - 1) === ' ') {

						if (leaf.offset > 1) {
							endContainer = leaf.node;
							endContainer.splitText(leaf.offset - 1);
						}
					}
				}
			}

			// Move start/end point up the tree if the leaves are sharp and if we are in different containers
			// Example * becomes !: !<p><b><i>*text</i><i>text*</i></b></p>!
			// This will reduce the number of wrapper elements that needs to be created
			// Move start point up the tree
			if (format[0].inline || format[0].block_expand) {
				if (!format[0].inline || (startContainer.nodeType != 3 || startOffset === 0)) {
					startContainer = findParentContainer(true);
				}

				if (!format[0].inline || (endContainer.nodeType != 3 || endOffset === endContainer.nodeValue.length)) {
					endContainer = findParentContainer();
				}
			}

			// Expand start/end container to matching selector
			if (format[0].selector && format[0].expand !== FALSE && !format[0].inline) {
				// Find new startContainer/endContainer if there is better one
				startContainer = findSelectorEndPoint(startContainer, 'previousSibling');
				endContainer = findSelectorEndPoint(endContainer, 'nextSibling');
			}

			// Expand start/end container to matching block element or text node
			if (format[0].block || format[0].selector) {
				// Find new startContainer/endContainer if there is better one
				startContainer = findBlockEndPoint(startContainer, 'previousSibling');
				endContainer = findBlockEndPoint(endContainer, 'nextSibling');

				// Non block element then try to expand up the leaf
				if (format[0].block) {
					if (!isBlock(startContainer))
						startContainer = findParentContainer(true);

					if (!isBlock(endContainer))
						endContainer = findParentContainer();
				}
			}

			// Setup index for startContainer
			if (startContainer.nodeType == 1) {
				startOffset = nodeIndex(startContainer);
				startContainer = startContainer.parentNode;
			}

			// Setup index for endContainer
			if (endContainer.nodeType == 1) {
				endOffset = nodeIndex(endContainer) + 1;
				endContainer = endContainer.parentNode;
			}

			// Return new range like object
			return {
				startContainer : startContainer,
				startOffset : startOffset,
				endContainer : endContainer,
				endOffset : endOffset
			};
		}

		function removeFormat(format, vars, node, compare_node) {
			var i, attrs, stylesModified;

			// Check if node matches format
			if (!matchName(node, format))
				return FALSE;

			// Should we compare with format attribs and styles
			if (format.remove != 'all') {
				// Remove styles
				each(format.styles, function(value, name) {
					value = replaceVars(value, vars);

					// Indexed array
					if (typeof(name) === 'number') {
						name = value;
						compare_node = 0;
					}

					if (!compare_node || isEq(getStyle(compare_node, name), value))
						dom.setStyle(node, name, '');

					stylesModified = 1;
				});

				// Remove style attribute if it's empty
				if (stylesModified && dom.getAttrib(node, 'style') == '') {
					node.removeAttribute('style');
					node.removeAttribute('data-mce-style');
				}

				// Remove attributes
				each(format.attributes, function(value, name) {
					var valueOut;

					value = replaceVars(value, vars);

					// Indexed array
					if (typeof(name) === 'number') {
						name = value;
						compare_node = 0;
					}

					if (!compare_node || isEq(dom.getAttrib(compare_node, name), value)) {
						// Keep internal classes
						if (name == 'class') {
							value = dom.getAttrib(node, name);
							if (value) {
								// Build new class value where everything is removed except the internal prefixed classes
								valueOut = '';
								each(value.split(/\s+/), function(cls) {
									if (/mce\w+/.test(cls))
										valueOut += (valueOut ? ' ' : '') + cls;
								});

								// We got some internal classes left
								if (valueOut) {
									dom.setAttrib(node, name, valueOut);
									return;
								}
							}
						}

						// IE6 has a bug where the attribute doesn't get removed correctly
						if (name == "class")
							node.removeAttribute('className');

						// Remove mce prefixed attributes
						if (MCE_ATTR_RE.test(name))
							node.removeAttribute('data-mce-' + name);

						node.removeAttribute(name);
					}
				});

				// Remove classes
				each(format.classes, function(value) {
					value = replaceVars(value, vars);

					if (!compare_node || dom.hasClass(compare_node, value))
						dom.removeClass(node, value);
				});

				// Check for non internal attributes
				attrs = dom.getAttribs(node);
				for (i = 0; i < attrs.length; i++) {
					if (attrs[i].nodeName.indexOf('_') !== 0)
						return FALSE;
				}
			}

			// Remove the inline child if it's empty for example <b> or <span>
			if (format.remove != 'none') {
				removeNode(node, format);
				return TRUE;
			}
		};

		function removeNode(node, format) {
			var parentNode = node.parentNode, rootBlockElm;

			function find(node, next, inc) {
				node = getNonWhiteSpaceSibling(node, next, inc);

				return !node || (node.nodeName == 'BR' || isBlock(node));
			};

			if (format.block) {
				if (!forcedRootBlock) {
					// Append BR elements if needed before we remove the block
					if (isBlock(node) && !isBlock(parentNode)) {
						if (!find(node, FALSE) && !find(node.firstChild, TRUE, 1))
							node.insertBefore(dom.create('br'), node.firstChild);

						if (!find(node, TRUE) && !find(node.lastChild, FALSE, 1))
							node.appendChild(dom.create('br'));
					}
				} else {
					// Wrap the block in a forcedRootBlock if we are at the root of document
					if (parentNode == dom.getRoot()) {
						if (!format.list_block || !isEq(node, format.list_block)) {
							each(tinymce.grep(node.childNodes), function(node) {
								if (isValid(forcedRootBlock, node.nodeName.toLowerCase())) {
									if (!rootBlockElm)
										rootBlockElm = wrap(node, forcedRootBlock);
									else
										rootBlockElm.appendChild(node);
								} else
									rootBlockElm = 0;
							});
						}
					}
				}
			}

			// Never remove nodes that isn't the specified inline element if a selector is specified too
			if (format.selector && format.inline && !isEq(format.inline, node))
				return;

			dom.remove(node, 1);
		};

		function getNonWhiteSpaceSibling(node, next, inc) {
			if (node) {
				next = next ? 'nextSibling' : 'previousSibling';

				for (node = inc ? node : node[next]; node; node = node[next]) {
					if (node.nodeType == 1 || !isWhiteSpaceNode(node))
						return node;
				}
			}
		};

		function isBookmarkNode(node) {
			return node && node.nodeType == 1 && node.getAttribute('data-mce-type') == 'bookmark';
		};

		function mergeSiblings(prev, next) {
			var marker, sibling, tmpSibling;

			function compareElements(node1, node2) {
				// Not the same name
				if (node1.nodeName != node2.nodeName)
					return FALSE;

				function getAttribs(node) {
					var attribs = {};

					each(dom.getAttribs(node), function(attr) {
						var name = attr.nodeName.toLowerCase();

						// Don't compare internal attributes or style
						if (name.indexOf('_') !== 0 && name !== 'style')
							attribs[name] = dom.getAttrib(node, name);
					});

					return attribs;
				};

				function compareObjects(obj1, obj2) {
					var value, name;

					for (name in obj1) {
						// Obj1 has item obj2 doesn't have
						if (obj1.hasOwnProperty(name)) {
							value = obj2[name];

							// Obj2 doesn't have obj1 item
							if (value === undef)
								return FALSE;

							// Obj2 item has a different value
							if (obj1[name] != value)
								return FALSE;

							// Delete similar value
							delete obj2[name];
						}
					}

					// Check if obj 2 has something obj 1 doesn't have
					for (name in obj2) {
						// Obj2 has item obj1 doesn't have
						if (obj2.hasOwnProperty(name))
							return FALSE;
					}

					return TRUE;
				};

				// Attribs are not the same
				if (!compareObjects(getAttribs(node1), getAttribs(node2)))
					return FALSE;

				// Styles are not the same
				if (!compareObjects(dom.parseStyle(dom.getAttrib(node1, 'style')), dom.parseStyle(dom.getAttrib(node2, 'style'))))
					return FALSE;

				return TRUE;
			};

			function findElementSibling(node, sibling_name) {
				for (sibling = node; sibling; sibling = sibling[sibling_name]) {
					if (sibling.nodeType == 3 && sibling.nodeValue.length !== 0)
						return node;

					if (sibling.nodeType == 1 && !isBookmarkNode(sibling))
						return sibling;
				}

				return node;
			};

			// Check if next/prev exists and that they are elements
			if (prev && next) {
				// If previous sibling is empty then jump over it
				prev = findElementSibling(prev, 'previousSibling');
				next = findElementSibling(next, 'nextSibling');

				// Compare next and previous nodes
				if (compareElements(prev, next)) {
					// Append nodes between
					for (sibling = prev.nextSibling; sibling && sibling != next;) {
						tmpSibling = sibling;
						sibling = sibling.nextSibling;
						prev.appendChild(tmpSibling);
					}

					// Remove next node
					dom.remove(next);

					// Move children into prev node
					each(tinymce.grep(next.childNodes), function(node) {
						prev.appendChild(node);
					});

					return prev;
				}
			}

			return next;
		};

		function isTextBlock(name) {
			return /^(h[1-6]|p|div|pre|address|dl|dt|dd)$/.test(name);
		};

		function getContainer(rng, start) {
			var container, offset, lastIdx, walker;

			container = rng[start ? 'startContainer' : 'endContainer'];
			offset = rng[start ? 'startOffset' : 'endOffset'];

			if (container.nodeType == 1) {
				lastIdx = container.childNodes.length - 1;

				if (!start && offset)
					offset--;

				container = container.childNodes[offset > lastIdx ? lastIdx : offset];
			}

			// If start text node is excluded then walk to the next node
			if (container.nodeType === 3 && start && offset >= container.nodeValue.length) {
				container = new TreeWalker(container, ed.getBody()).next() || container;
			}

			// If end text node is excluded then walk to the previous node
			if (container.nodeType === 3 && !start && offset === 0) {
				container = new TreeWalker(container, ed.getBody()).prev() || container;
			}

			return container;
		};

		function performCaretAction(type, name, vars) {
			var caretContainerId = '_mce_caret', debug = ed.settings.caret_debug;

			// Creates a caret container bogus element
			function createCaretContainer(fill) {
				var caretContainer = dom.create('span', {id: caretContainerId, 'data-mce-bogus': true, style: debug ? 'color:red' : ''});

				if (fill) {
					caretContainer.appendChild(ed.getDoc().createTextNode(INVISIBLE_CHAR));
				}

				return caretContainer;
			};

			function isCaretContainerEmpty(node, nodes) {
				while (node) {
					if ((node.nodeType === 3 && node.nodeValue !== INVISIBLE_CHAR) || node.childNodes.length > 1) {
						return false;
					}

					// Collect nodes
					if (nodes && node.nodeType === 1) {
						nodes.push(node);
					}

					node = node.firstChild;
				}

				return true;
			};
			
			// Returns any parent caret container element
			function getParentCaretContainer(node) {
				while (node) {
					if (node.id === caretContainerId) {
						return node;
					}

					node = node.parentNode;
				}
			};

			// Finds the first text node in the specified node
			function findFirstTextNode(node) {
				var walker;

				if (node) {
					walker = new TreeWalker(node, node);

					for (node = walker.current(); node; node = walker.next()) {
						if (node.nodeType === 3) {
							return node;
						}
					}
				}
			};

			// Removes the caret container for the specified node or all on the current document
			function removeCaretContainer(node, move_caret) {
				var child, rng;

				if (!node) {
					node = getParentCaretContainer(selection.getStart());

					if (!node) {
						while (node = dom.get(caretContainerId)) {
							removeCaretContainer(node, false);
						}
					}
				} else {
					rng = selection.getRng(true);

					if (isCaretContainerEmpty(node)) {
						if (move_caret !== false) {
							rng.setStartBefore(node);
							rng.setEndBefore(node);
						}

						dom.remove(node);
					} else {
						child = findFirstTextNode(node);

						if (child.nodeValue.charAt(0) === INVISIBLE_CHAR) {
							child = child.deleteData(0, 1);
						}

						dom.remove(node, 1);
					}

					selection.setRng(rng);
				}
			};
			
			// Applies formatting to the caret postion
			function applyCaretFormat() {
				var rng, caretContainer, textNode, offset, bookmark, container, text;

				rng = selection.getRng(true);
				offset = rng.startOffset;
				container = rng.startContainer;
				text = container.nodeValue;

				caretContainer = getParentCaretContainer(selection.getStart());
				if (caretContainer) {
					textNode = findFirstTextNode(caretContainer);
				}

				// Expand to word is caret is in the middle of a text node and the char before/after is a alpha numeric character
				if (text && offset > 0 && offset < text.length && /\w/.test(text.charAt(offset)) && /\w/.test(text.charAt(offset - 1))) {
					// Get bookmark of caret position
					bookmark = selection.getBookmark();

					// Collapse bookmark range (WebKit)
					rng.collapse(true);

					// Expand the range to the closest word and split it at those points
					rng = expandRng(rng, get(name));
					rng = rangeUtils.split(rng);

					// Apply the format to the range
					apply(name, vars, rng);

					// Move selection back to caret position
					selection.moveToBookmark(bookmark);
				} else {
					if (!caretContainer || textNode.nodeValue !== INVISIBLE_CHAR) {
						caretContainer = createCaretContainer(true);
						textNode = caretContainer.firstChild;

						rng.insertNode(caretContainer);
						offset = 1;

						apply(name, vars, caretContainer);
					} else {
						apply(name, vars, caretContainer);
					}

					// Move selection to text node
					selection.setCursorLocation(textNode, offset);
				}
			};

			function removeCaretFormat() {
				var rng = selection.getRng(true), container, offset, bookmark,
					hasContentAfter, node, formatNode, parents = [], i, caretContainer;

				container = rng.startContainer;
				offset = rng.startOffset;
				node = container;

				if (container.nodeType == 3) {
					if (offset != container.nodeValue.length || container.nodeValue === INVISIBLE_CHAR) {
						hasContentAfter = true;
					}

					node = node.parentNode;
				}

				while (node) {
					if (matchNode(node, name, vars)) {
						formatNode = node;
						break;
					}

					if (node.nextSibling) {
						hasContentAfter = true;
					}

					parents.push(node);
					node = node.parentNode;
				}

				// Node doesn't have the specified format
				if (!formatNode) {
					return;
				}

				// Is there contents after the caret then remove the format on the element
				if (hasContentAfter) {
					// Get bookmark of caret position
					bookmark = selection.getBookmark();

					// Collapse bookmark range (WebKit)
					rng.collapse(true);

					// Expand the range to the closest word and split it at those points
					rng = expandRng(rng, get(name), true);
					rng = rangeUtils.split(rng);

					// Remove the format from the range
					remove(name, vars, rng);

					// Move selection back to caret position
					selection.moveToBookmark(bookmark);
				} else {
					caretContainer = createCaretContainer();

					node = caretContainer;
					for (i = parents.length - 1; i >= 0; i--) {
						node.appendChild(dom.clone(parents[i], false));
						node = node.firstChild;
					}

					// Insert invisible character into inner most format element
					node.appendChild(dom.doc.createTextNode(INVISIBLE_CHAR));
					node = node.firstChild;

					// Insert caret container after the formated node
					dom.insertAfter(caretContainer, formatNode);

					// Move selection to text node
					selection.setCursorLocation(node, 1);
				}
			};

			// Checks if the parent caret container node isn't empty if that is the case it
			// will remove the bogus state on all children that isn't empty
			function unmarkBogusCaretParents() {
				var i, caretContainer, node;

				caretContainer = getParentCaretContainer(selection.getStart());
				if (caretContainer && !dom.isEmpty(caretContainer)) {
					tinymce.walk(caretContainer, function(node) {
						if (node.nodeType == 1 && node.id !== caretContainerId && !dom.isEmpty(node)) {
							dom.setAttrib(node, 'data-mce-bogus', null);
						}
					}, 'childNodes');
				}
			};

			// Only bind the caret events once
			if (!self._hasCaretEvents) {
				// Mark current caret container elements as bogus when getting the contents so we don't end up with empty elements
				ed.onBeforeGetContent.addToTop(function() {
					var nodes = [], i;

					if (isCaretContainerEmpty(getParentCaretContainer(selection.getStart()), nodes)) {
						// Mark children
						i = nodes.length;
						while (i--) {
							dom.setAttrib(nodes[i], 'data-mce-bogus', '1');
						}
					}
				});

				// Remove caret container on mouse up and on key up
				tinymce.each('onMouseUp onKeyUp'.split(' '), function(name) {
					ed[name].addToTop(function() {
						removeCaretContainer();
						unmarkBogusCaretParents();
					});
				});

				// Remove caret container on keydown and it's a backspace, enter or left/right arrow keys
				ed.onKeyDown.addToTop(function(ed, e) {
					var keyCode = e.keyCode;

					if (keyCode == 8 || keyCode == 37 || keyCode == 39) {
						removeCaretContainer(getParentCaretContainer(selection.getStart()));
					}

					unmarkBogusCaretParents();
				});

				// Remove bogus state if they got filled by contents using editor.selection.setContent
				selection.onSetContent.add(unmarkBogusCaretParents);

				self._hasCaretEvents = true;
			}

			// Do apply or remove caret format
			if (type == "apply") {
				applyCaretFormat();
			} else {
				removeCaretFormat();
			}
		};

		function moveStart(rng) {
			var container = rng.startContainer,
					offset = rng.startOffset, isAtEndOfText,
					walker, node, nodes, tmpNode;

			// Convert text node into index if possible
			if (container.nodeType == 3 && offset >= container.nodeValue.length) {
				// Get the parent container location and walk from there
				offset = nodeIndex(container);
				container = container.parentNode;
				isAtEndOfText = true;
			}

			// Move startContainer/startOffset in to a suitable node
			if (container.nodeType == 1) {
				nodes = container.childNodes;
				container = nodes[Math.min(offset, nodes.length - 1)];
				walker = new TreeWalker(container, dom.getParent(container, dom.isBlock));

				// If offset is at end of the parent node walk to the next one
				if (offset > nodes.length - 1 || isAtEndOfText)
					walker.next();

				for (node = walker.current(); node; node = walker.next()) {
					if (node.nodeType == 3 && !isWhiteSpaceNode(node)) {
						// IE has a "neat" feature where it moves the start node into the closest element
						// we can avoid this by inserting an element before it and then remove it after we set the selection
						tmpNode = dom.create('a', null, INVISIBLE_CHAR);
						node.parentNode.insertBefore(tmpNode, node);

						// Set selection and remove tmpNode
						rng.setStart(node, 0);
						selection.setRng(rng);
						dom.remove(tmpNode);

						return;
					}
				}
			}
		};
	};
})(tinymce);

tinymce.onAddEditor.add(function(tinymce, ed) {
	var filters, fontSizes, dom, settings = ed.settings;

	function replaceWithSpan(node, styles) {
		tinymce.each(styles, function(value, name) {
			if (value)
				dom.setStyle(node, name, value);
		});

		dom.rename(node, 'span');
	};

	function convert(editor, params) {
		dom = editor.dom;

		if (settings.convert_fonts_to_spans) {
			tinymce.each(dom.select('font,u,strike', params.node), function(node) {
				filters[node.nodeName.toLowerCase()](ed.dom, node);
			});
		}
	};

	if (settings.inline_styles) {
		fontSizes = tinymce.explode(settings.font_size_legacy_values);

		filters = {
			font : function(dom, node) {
				replaceWithSpan(node, {
					backgroundColor : node.style.backgroundColor,
					color : node.color,
					fontFamily : node.face,
					fontSize : fontSizes[parseInt(node.size, 10) - 1]
				});
			},

			u : function(dom, node) {
				replaceWithSpan(node, {
					textDecoration : 'underline'
				});
			},

			strike : function(dom, node) {
				replaceWithSpan(node, {
					textDecoration : 'line-through'
				});
			}
		};

		ed.onPreProcess.add(convert);
		ed.onSetContent.add(convert);

		ed.onInit.add(function() {
			ed.selection.onSetContent.add(convert);
		});
	}
});

(function(tinymce) {
	var TreeWalker = tinymce.dom.TreeWalker;

	tinymce.EnterKey = function(editor) {
		var dom = editor.dom, selection = editor.selection, settings = editor.settings, undoManager = editor.undoManager, nonEmptyElementsMap = editor.schema.getNonEmptyElements();

		function handleEnterKey(evt) {
			var rng = selection.getRng(true), tmpRng, editableRoot, container, offset, parentBlock, documentMode, shiftKey,
				newBlock, fragment, containerBlock, parentBlockName, containerBlockName, newBlockName, isAfterLastNodeInContainer;

			// Returns true if the block can be split into two blocks or not
			function canSplitBlock(node) {
				return node &&
					dom.isBlock(node) &&
					!/^(TD|TH|CAPTION|FORM)$/.test(node.nodeName) &&
					!/^(fixed|absolute)/i.test(node.style.position) && 
					dom.getContentEditable(node) !== "true";
			};

			// Renders empty block on IE
			function renderBlockOnIE(block) {
				var oldRng;

				if (tinymce.isIE && dom.isBlock(block)) {
					oldRng = selection.getRng();
					block.appendChild(dom.create('span', null, '\u00a0'));
					selection.select(block);
					block.lastChild.outerHTML = '';
					selection.setRng(oldRng);
				}
			};

			// Remove the first empty inline element of the block so this: <p><b><em></em></b>x</p> becomes this: <p>x</p>
			function trimInlineElementsOnLeftSideOfBlock(block) {
				var node = block, firstChilds = [], i;

				// Find inner most first child ex: <p><i><b>*</b></i></p>
				while (node = node.firstChild) {
					if (dom.isBlock(node)) {
						return;
					}

					if (node.nodeType == 1 && !nonEmptyElementsMap[node.nodeName.toLowerCase()]) {
						firstChilds.push(node);
					}
				}

				i = firstChilds.length;
				while (i--) {
					node = firstChilds[i];
					if (!node.hasChildNodes() || (node.firstChild == node.lastChild && node.firstChild.nodeValue === '')) {
						dom.remove(node);
					} else {
						// Remove <a> </a> see #5381
						if (node.nodeName == "A" && (node.innerText || node.textContent) === ' ') {
							dom.remove(node);
						}
					}
				}
			};
			
			// Moves the caret to a suitable position within the root for example in the first non pure whitespace text node or before an image
			function moveToCaretPosition(root) {
				var walker, node, rng, y, viewPort, lastNode = root, tempElm;

				rng = dom.createRng();

				if (root.hasChildNodes()) {
					walker = new TreeWalker(root, root);

					while (node = walker.current()) {
						if (node.nodeType == 3) {
							rng.setStart(node, 0);
							rng.setEnd(node, 0);
							break;
						}

						if (nonEmptyElementsMap[node.nodeName.toLowerCase()]) {
							rng.setStartBefore(node);
							rng.setEndBefore(node);
							break;
						}

						lastNode = node;
						node = walker.next();
					}

					if (!node) {
						rng.setStart(lastNode, 0);
						rng.setEnd(lastNode, 0);
					}
				} else {
					if (root.nodeName == 'BR') {
						if (root.nextSibling && dom.isBlock(root.nextSibling)) {
							// Trick on older IE versions to render the caret before the BR between two lists
							if (!documentMode || documentMode < 9) {
								tempElm = dom.create('br');
								root.parentNode.insertBefore(tempElm, root);
							}

							rng.setStartBefore(root);
							rng.setEndBefore(root);
						} else {
							rng.setStartAfter(root);
							rng.setEndAfter(root);
						}
					} else {
						rng.setStart(root, 0);
						rng.setEnd(root, 0);
					}
				}

				selection.setRng(rng);

				// Remove tempElm created for old IE:s
				dom.remove(tempElm);

				viewPort = dom.getViewPort(editor.getWin());

				// scrollIntoView seems to scroll the parent window in most browsers now including FF 3.0b4 so it's time to stop using it and do it our selfs
				y = dom.getPos(root).y;
				if (y < viewPort.y || y + 25 > viewPort.y + viewPort.h) {
					editor.getWin().scrollTo(0, y < viewPort.y ? y : y - viewPort.h + 25); // Needs to be hardcoded to roughly one line of text if a huge text block is broken into two blocks
				}
			};

			// Creates a new block element by cloning the current one or creating a new one if the name is specified
			// This function will also copy any text formatting from the parent block and add it to the new one
			function createNewBlock(name) {
				var node = container, block, clonedNode, caretNode;

				block = name || parentBlockName == "TABLE" ? dom.create(name || newBlockName) : parentBlock.cloneNode(false);
				caretNode = block;

				// Clone any parent styles
				if (settings.keep_styles !== false) {
					do {
						if (/^(SPAN|STRONG|B|EM|I|FONT|STRIKE|U)$/.test(node.nodeName)) {
							// Never clone a caret containers
							if (node.id == '_mce_caret') {
								continue;
							}

							clonedNode = node.cloneNode(false);
							dom.setAttrib(clonedNode, 'id', ''); // Remove ID since it needs to be document unique

							if (block.hasChildNodes()) {
								clonedNode.appendChild(block.firstChild);
								block.appendChild(clonedNode);
							} else {
								caretNode = clonedNode;
								block.appendChild(clonedNode);
							}
						}
					} while (node = node.parentNode);
				}

				// BR is needed in empty blocks on non IE browsers
				if (!tinymce.isIE) {
					caretNode.innerHTML = '<br data-mce-bogus="1">';
				}

				return block;
			};

			// Returns true/false if the caret is at the start/end of the parent block element
			function isCaretAtStartOrEndOfBlock(start) {
				var walker, node, name;

				// Caret is in the middle of a text node like "a|b"
				if (container.nodeType == 3 && (start ? offset > 0 : offset < container.nodeValue.length)) {
					return false;
				}

				// If after the last element in block node edge case for #5091
				if (container.parentNode == parentBlock && isAfterLastNodeInContainer && !start) {
					return true;
				}

				// If the caret if before the first element in parentBlock
				if (start && container.nodeType == 1 && container == parentBlock.firstChild) {
					return true;
				}

				// Caret can be before/after a table
				if (container.nodeName === "TABLE" || (container.previousSibling && container.previousSibling.nodeName == "TABLE")) {
					return (isAfterLastNodeInContainer && !start) || (!isAfterLastNodeInContainer && start);
				}

				// Walk the DOM and look for text nodes or non empty elements
				walker = new TreeWalker(container, parentBlock);
	
				// If caret is in beginning or end of a text block then jump to the next/previous node
				if (container.nodeType == 3) {
					if (start && offset == 0) {
						walker.prev();
					} else if (!start && offset == container.nodeValue.length) {
						walker.next();
					}
				}

				while (node = walker.current()) {
					if (node.nodeType === 1) {
						// Ignore bogus elements
						if (!node.getAttribute('data-mce-bogus')) {
							// Keep empty elements like <img /> <input /> but not trailing br:s like <p>text|<br></p>
							name = node.nodeName.toLowerCase();
							if (nonEmptyElementsMap[name] && name !== 'br') {
								return false;
							}
						}
					} else if (node.nodeType === 3 && !/^[ \t\r\n]*$/.test(node.nodeValue)) {
						return false;
					}

					if (start) {
						walker.prev();
					} else {
						walker.next();
					}
				}

				return true;
			};

			// Wraps any text nodes or inline elements in the specified forced root block name
			function wrapSelfAndSiblingsInDefaultBlock(container, offset) {
				var newBlock, parentBlock, startNode, node, next, blockName = newBlockName || 'P';

				// Not in a block element or in a table cell or caption
				parentBlock = dom.getParent(container, dom.isBlock);
				if (!parentBlock || !canSplitBlock(parentBlock)) {
					parentBlock = parentBlock || editableRoot;

					if (!parentBlock.hasChildNodes()) {
						newBlock = dom.create(blockName);
						parentBlock.appendChild(newBlock);
						rng.setStart(newBlock, 0);
						rng.setEnd(newBlock, 0);
						return newBlock;
					}

					// Find parent that is the first child of parentBlock
					node = container;
					while (node.parentNode != parentBlock) {
						node = node.parentNode;
					}

					// Loop left to find start node start wrapping at
					while (node && !dom.isBlock(node)) {
						startNode = node;
						node = node.previousSibling;
					}

					if (startNode) {
						newBlock = dom.create(blockName);
						startNode.parentNode.insertBefore(newBlock, startNode);

						// Start wrapping until we hit a block
						node = startNode;
						while (node && !dom.isBlock(node)) {
							next = node.nextSibling;
							newBlock.appendChild(node);
							node = next;
						}

						// Restore range to it's past location
						rng.setStart(container, offset);
						rng.setEnd(container, offset);
					}
				}

				return container;
			};

			// Inserts a block or br before/after or in the middle of a split list of the LI is empty
			function handleEmptyListItem() {
				function isFirstOrLastLi(first) {
					var node = containerBlock[first ? 'firstChild' : 'lastChild'];

					// Find first/last element since there might be whitespace there
					while (node) {
						if (node.nodeType == 1) {
							break;
						}

						node = node[first ? 'nextSibling' : 'previousSibling'];
					}

					return node === parentBlock;
				};

				newBlock = newBlockName ? createNewBlock(newBlockName) : dom.create('BR');

				if (isFirstOrLastLi(true) && isFirstOrLastLi()) {
					// Is first and last list item then replace the OL/UL with a text block
					dom.replace(newBlock, containerBlock);
				} else if (isFirstOrLastLi(true)) {
					// First LI in list then remove LI and add text block before list
					containerBlock.parentNode.insertBefore(newBlock, containerBlock);
				} else if (isFirstOrLastLi()) {
					// Last LI in list then temove LI and add text block after list
					dom.insertAfter(newBlock, containerBlock);
					renderBlockOnIE(newBlock);
				} else {
					// Middle LI in list the split the list and insert a text block in the middle
					// Extract after fragment and insert it after the current block
					tmpRng = rng.cloneRange();
					tmpRng.setStartAfter(parentBlock);
					tmpRng.setEndAfter(containerBlock);
					fragment = tmpRng.extractContents();
					dom.insertAfter(fragment, containerBlock);
					dom.insertAfter(newBlock, containerBlock);
				}

				dom.remove(parentBlock);
				moveToCaretPosition(newBlock);
				undoManager.add();
			};

			// Walks the parent block to the right and look for BR elements
			function hasRightSideBr() {
				var walker = new TreeWalker(container, parentBlock), node;

				while (node = walker.current()) {
					if (node.nodeName == 'BR') {
						return true;
					}

					node = walker.next();
				}
			}
			
			// Inserts a BR element if the forced_root_block option is set to false or empty string
			function insertBr() {
				var brElm, extraBr, marker;

				if (container && container.nodeType == 3 && offset >= container.nodeValue.length) {
					// Insert extra BR element at the end block elements
					if (!tinymce.isIE && !hasRightSideBr()) {
						brElm = dom.create('br');
						rng.insertNode(brElm);
						rng.setStartAfter(brElm);
						rng.setEndAfter(brElm);
						extraBr = true;
					}
				}

				brElm = dom.create('br');
				rng.insertNode(brElm);

				// Rendering modes below IE8 doesn't display BR elements in PRE unless we have a \n before it
				if (tinymce.isIE && parentBlockName == 'PRE' && (!documentMode || documentMode < 8)) {
					brElm.parentNode.insertBefore(dom.doc.createTextNode('\r'), brElm);
				}

				// Insert temp marker and scroll to that
				marker = dom.create('span', {}, '&nbsp;');
				brElm.parentNode.insertBefore(marker, brElm);
				selection.scrollIntoView(marker);
				dom.remove(marker);

				if (!extraBr) {
					rng.setStartAfter(brElm);
					rng.setEndAfter(brElm);
				} else {
					rng.setStartBefore(brElm);
					rng.setEndBefore(brElm);
				}

				selection.setRng(rng);
				undoManager.add();
			};

			// Trims any linebreaks at the beginning of node user for example when pressing enter in a PRE element
			function trimLeadingLineBreaks(node) {
				do {
					if (node.nodeType === 3) {
						node.nodeValue = node.nodeValue.replace(/^[\r\n]+/, '');
					}

					node = node.firstChild;
				} while (node);
			};

			function getEditableRoot(node) {
				var root = dom.getRoot(), parent, editableRoot;

				// Get all parents until we hit a non editable parent or the root
				parent = node;
				while (parent !== root && dom.getContentEditable(parent) !== "false") {
					if (dom.getContentEditable(parent) === "true") {
						editableRoot = parent;
					}

					parent = parent.parentNode;
				}
				
				return parent !== root ? editableRoot : root;
			};

			// Adds a BR at the end of blocks that only contains an IMG or INPUT since these might be floated and then they won't expand the block
			function addBrToBlockIfNeeded(block) {
				var lastChild;

				// IE will render the blocks correctly other browsers needs a BR
				if (!tinymce.isIE) {
					block.normalize(); // Remove empty text nodes that got left behind by the extract

					// Check if the block is empty or contains a floated last child
					lastChild = block.lastChild;
					if (!lastChild || (/^(left|right)$/gi.test(dom.getStyle(lastChild, 'float', true)))) {
						dom.add(block, 'br');
					}
				}
			};

			// Delete any selected contents
			if (!rng.collapsed) {
				editor.execCommand('Delete');
				return;
			}

			// Event is blocked by some other handler for example the lists plugin
			if (evt.isDefaultPrevented()) {
				return;
			}

			// Setup range items and newBlockName
			container = rng.startContainer;
			offset = rng.startOffset;
			newBlockName = (settings.force_p_newlines ? 'p' : '') || settings.forced_root_block;
			newBlockName = newBlockName ? newBlockName.toUpperCase() : '';
			documentMode = dom.doc.documentMode;
			shiftKey = evt.shiftKey;

			// Resolve node index
			if (container.nodeType == 1 && container.hasChildNodes()) {
				isAfterLastNodeInContainer = offset > container.childNodes.length - 1;
				container = container.childNodes[Math.min(offset, container.childNodes.length - 1)] || container;
				if (isAfterLastNodeInContainer && container.nodeType == 3) {
					offset = container.nodeValue.length;
				} else {
					offset = 0;
				}
			}

			// Get editable root node normaly the body element but sometimes a div or span
			editableRoot = getEditableRoot(container);

			// If there is no editable root then enter is done inside a contentEditable false element
			if (!editableRoot) {
				return;
			}

			undoManager.beforeChange();

			// If editable root isn't block nor the root of the editor
			if (!dom.isBlock(editableRoot) && editableRoot != dom.getRoot()) {
				if (!newBlockName || shiftKey) {
					insertBr();
				}

				return;
			}

			// Wrap the current node and it's sibling in a default block if it's needed.
			// for example this <td>text|<b>text2</b></td> will become this <td><p>text|<b>text2</p></b></td>
			// This won't happen if root blocks are disabled or the shiftKey is pressed
			if ((newBlockName && !shiftKey) || (!newBlockName && shiftKey)) {
				container = wrapSelfAndSiblingsInDefaultBlock(container, offset);
			}

			// Find parent block and setup empty block paddings
			parentBlock = dom.getParent(container, dom.isBlock);
			containerBlock = parentBlock ? dom.getParent(parentBlock.parentNode, dom.isBlock) : null;

			// Setup block names
			parentBlockName = parentBlock ? parentBlock.nodeName.toUpperCase() : ''; // IE < 9 & HTML5
			containerBlockName = containerBlock ? containerBlock.nodeName.toUpperCase() : ''; // IE < 9 & HTML5

			// Enter inside block contained within a LI then split or insert before/after LI
			if (containerBlockName == 'LI' && !evt.ctrlKey) {
				parentBlock = containerBlock;
				parentBlockName = containerBlockName;
			}

			// Handle enter in LI
			if (parentBlockName == 'LI') {
				if (!newBlockName && shiftKey) {
					insertBr();
					return;
				}

				// Handle enter inside an empty list item
				if (dom.isEmpty(parentBlock)) {
					// Let the list plugin or browser handle nested lists for now
					if (/^(UL|OL|LI)$/.test(containerBlock.parentNode.nodeName)) {
						return false;
					}

					handleEmptyListItem();
					return;
				}
			}

			// Don't split PRE tags but insert a BR instead easier when writing code samples etc
			if (parentBlockName == 'PRE' && settings.br_in_pre !== false) {
				if (!shiftKey) {
					insertBr();
					return;
				}
			} else {
				// If no root block is configured then insert a BR by default or if the shiftKey is pressed
				if ((!newBlockName && !shiftKey && parentBlockName != 'LI') || (newBlockName && shiftKey)) {
					insertBr();
					return;
				}
			}

			// Default block name if it's not configured
			newBlockName = newBlockName || 'P';

			// Insert new block before/after the parent block depending on caret location
			if (isCaretAtStartOrEndOfBlock()) {
				// If the caret is at the end of a header we produce a P tag after it similar to Word unless we are in a hgroup
				if (/^(H[1-6]|PRE)$/.test(parentBlockName) && containerBlockName != 'HGROUP') {
					newBlock = createNewBlock(newBlockName);
				} else {
					newBlock = createNewBlock();
				}

				// Split the current container block element if enter is pressed inside an empty inner block element
				if (settings.end_container_on_empty_block && canSplitBlock(containerBlock) && dom.isEmpty(parentBlock)) {
					// Split container block for example a BLOCKQUOTE at the current blockParent location for example a P
					newBlock = dom.split(containerBlock, parentBlock);
				} else {
					dom.insertAfter(newBlock, parentBlock);
				}

				moveToCaretPosition(newBlock);
			} else if (isCaretAtStartOrEndOfBlock(true)) {
				// Insert new block before
				newBlock = parentBlock.parentNode.insertBefore(createNewBlock(), parentBlock);
				renderBlockOnIE(newBlock);
			} else {
				// Extract after fragment and insert it after the current block
				tmpRng = rng.cloneRange();
				tmpRng.setEndAfter(parentBlock);
				fragment = tmpRng.extractContents();
				trimLeadingLineBreaks(fragment);
				newBlock = fragment.firstChild;
				dom.insertAfter(fragment, parentBlock);
				trimInlineElementsOnLeftSideOfBlock(newBlock);
				addBrToBlockIfNeeded(parentBlock);
				moveToCaretPosition(newBlock);
			}

			dom.setAttrib(newBlock, 'id', ''); // Remove ID since it needs to be document unique
			undoManager.add();
		}

		editor.onKeyDown.add(function(ed, evt) {
			if (evt.keyCode == 13) {
				if (handleEnterKey(evt) !== false) {
					evt.preventDefault();
				}
			}
		});
	};
})(tinymce);

(function(c){var b,e,a=[],d=window;c.fn.tinymce=function(j){var p=this,g,k,h,m,i,l="",n="";if(!p.length){return p}if(!j){return tinyMCE.get(p[0].id)}p.css("visibility","hidden");function o(){var r=[],q=0;if(f){f();f=null}p.each(function(t,u){var s,w=u.id,v=j.oninit;if(!w){u.id=w=tinymce.DOM.uniqueId()}s=new tinymce.Editor(w,j);r.push(s);s.onInit.add(function(){var x,y=v;p.css("visibility","");if(v){if(++q==r.length){if(tinymce.is(y,"string")){x=(y.indexOf(".")===-1)?null:tinymce.resolve(y.replace(/\.\w+$/,""));y=tinymce.resolve(y)}y.apply(x||tinymce,r)}}})});c.each(r,function(t,s){s.render()})}if(!d.tinymce&&!e&&(g=j.script_url)){e=1;h=g.substring(0,g.lastIndexOf("/"));if(/_(src|dev)\.js/g.test(g)){n="_src"}m=g.lastIndexOf("?");if(m!=-1){l=g.substring(m+1)}d.tinyMCEPreInit=d.tinyMCEPreInit||{base:h,suffix:n,query:l};if(g.indexOf("gzip")!=-1){i=j.language||"en";g=g+(/\?/.test(g)?"&":"?")+"js=true&core=true&suffix="+escape(n)+"&themes="+escape(j.theme)+"&plugins="+escape(j.plugins)+"&languages="+i;if(!d.tinyMCE_GZ){tinyMCE_GZ={start:function(){tinymce.suffix=n;function q(r){tinymce.ScriptLoader.markDone(tinyMCE.baseURI.toAbsolute(r))}q("langs/"+i+".js");q("themes/"+j.theme+"/editor_template"+n+".js");q("themes/"+j.theme+"/langs/"+i+".js");c.each(j.plugins.split(","),function(s,r){if(r){q("plugins/"+r+"/editor_plugin"+n+".js");q("plugins/"+r+"/langs/"+i+".js")}})},end:function(){}}}}c.ajax({type:"GET",url:g,dataType:"script",cache:true,success:function(){tinymce.dom.Event.domLoaded=1;e=2;if(j.script_loaded){j.script_loaded()}o();c.each(a,function(q,r){r()})}})}else{if(e===1){a.push(o)}else{o()}}return p};c.extend(c.expr[":"],{tinymce:function(g){return !!(g.id&&"tinyMCE" in window&&tinyMCE.get(g.id))}});function f(){function i(l){if(l==="remove"){this.each(function(n,o){var m=h(o);if(m){m.remove()}})}this.find("span.mceEditor,div.mceEditor").each(function(n,o){var m=tinyMCE.get(o.id.replace(/_parent$/,""));if(m){m.remove()}})}function k(n){var m=this,l;if(n!==b){i.call(m);m.each(function(p,q){var o;if(o=tinyMCE.get(q.id)){o.setContent(n)}})}else{if(m.length>0){if(l=tinyMCE.get(m[0].id)){return l.getContent()}}}}function h(m){var l=null;(m)&&(m.id)&&(d.tinymce)&&(l=tinyMCE.get(m.id));return l}function g(l){return !!((l)&&(l.length)&&(d.tinymce)&&(l.is(":tinymce")))}var j={};c.each(["text","html","val"],function(n,l){var o=j[l]=c.fn[l],m=(l==="text");c.fn[l]=function(s){var p=this;if(!g(p)){return o.apply(p,arguments)}if(s!==b){k.call(p.filter(":tinymce"),s);o.apply(p.not(":tinymce"),arguments);return p}else{var r="";var q=arguments;(m?p:p.eq(0)).each(function(u,v){var t=h(v);r+=t?(m?t.getContent().replace(/<(?:"[^"]*"|'[^']*'|[^'">])*>/g,""):t.getContent({save:true})):o.apply(c(v),q)});return r}}});c.each(["append","prepend"],function(n,m){var o=j[m]=c.fn[m],l=(m==="prepend");c.fn[m]=function(q){var p=this;if(!g(p)){return o.apply(p,arguments)}if(q!==b){p.filter(":tinymce").each(function(s,t){var r=h(t);r&&r.setContent(l?q+r.getContent():r.getContent()+q)});o.apply(p.not(":tinymce"),arguments);return p}}});c.each(["remove","replaceWith","replaceAll","empty"],function(m,l){var n=j[l]=c.fn[l];c.fn[l]=function(){i.call(this,l);return n.apply(this,arguments)}});j.attr=c.fn.attr;c.fn.attr=function(o,q){var m=this,n=arguments;if((!o)||(o!=="value")||(!g(m))){if(q!==b){return j.attr.apply(m,n)}else{return j.attr.apply(m,n)}}if(q!==b){k.call(m.filter(":tinymce"),q);j.attr.apply(m.not(":tinymce"),n);return m}else{var p=m[0],l=h(p);return l?l.getContent({save:true}):j.attr.apply(c(p),n)}}}})(jQuery);



// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//








$(function(){ $(document).foundation(); });
