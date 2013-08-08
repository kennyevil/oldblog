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
/*
 HTML5 Shiv v3.6.2 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/

(function(j,f){function s(a,b){var c=a.createElement("p"),m=a.getElementsByTagName("head")[0]||a.documentElement;c.innerHTML="x<style>"+b+"</style>";return m.insertBefore(c.lastChild,m.firstChild)}function o(){var a=d.elements;return"string"==typeof a?a.split(" "):a}function n(a){var b=t[a[u]];b||(b={},p++,a[u]=p,t[p]=b);return b}function v(a,b,c){b||(b=f);if(e)return b.createElement(a);c||(c=n(b));b=c.cache[a]?c.cache[a].cloneNode():y.test(a)?(c.cache[a]=c.createElem(a)).cloneNode():c.createElem(a);
return b.canHaveChildren&&!z.test(a)?c.frag.appendChild(b):b}function A(a,b){if(!b.cache)b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag();a.createElement=function(c){return!d.shivMethods?b.createElem(c):v(c,a,b)};a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+o().join().replace(/\w+/g,function(a){b.createElem(a);b.frag.createElement(a);return'c("'+a+'")'})+");return n}")(d,b.frag)}
function w(a){a||(a=f);var b=n(a);if(d.shivCSS&&!q&&!b.hasCSS)b.hasCSS=!!s(a,"article,aside,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}");e||A(a,b);return a}function B(a){for(var b,c=a.attributes,m=c.length,f=a.ownerDocument.createElement(l+":"+a.nodeName);m--;)b=c[m],b.specified&&f.setAttribute(b.nodeName,b.nodeValue);f.style.cssText=a.style.cssText;return f}function x(a){function b(){clearTimeout(d._removeSheetTimer);c&&c.removeNode(!0);
c=null}var c,f,d=n(a),e=a.namespaces,j=a.parentWindow;if(!C||a.printShived)return a;"undefined"==typeof e[l]&&e.add(l);j.attachEvent("onbeforeprint",function(){b();var g,i,d;d=a.styleSheets;for(var e=[],h=d.length,k=Array(h);h--;)k[h]=d[h];for(;d=k.pop();)if(!d.disabled&&D.test(d.media)){try{g=d.imports,i=g.length}catch(j){i=0}for(h=0;h<i;h++)k.push(g[h]);try{e.push(d.cssText)}catch(n){}}g=e.reverse().join("").split("{");i=g.length;h=RegExp("(^|[\\s,>+~])("+o().join("|")+")(?=[[\\s,>+~#.:]|$)","gi");
for(k="$1"+l+"\\:$2";i--;)e=g[i]=g[i].split("}"),e[e.length-1]=e[e.length-1].replace(h,k),g[i]=e.join("}");e=g.join("{");i=a.getElementsByTagName("*");h=i.length;k=RegExp("^(?:"+o().join("|")+")$","i");for(d=[];h--;)g=i[h],k.test(g.nodeName)&&d.push(g.applyElement(B(g)));f=d;c=s(a,e)});j.attachEvent("onafterprint",function(){for(var a=f,c=a.length;c--;)a[c].removeNode();clearTimeout(d._removeSheetTimer);d._removeSheetTimer=setTimeout(b,500)});a.printShived=!0;return a}var r=j.html5||{},z=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
y=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,q,u="_html5shiv",p=0,t={},e;(function(){try{var a=f.createElement("a");a.innerHTML="<xyz></xyz>";q="hidden"in a;var b;if(!(b=1==a.childNodes.length)){f.createElement("a");var c=f.createDocumentFragment();b="undefined"==typeof c.cloneNode||"undefined"==typeof c.createDocumentFragment||"undefined"==typeof c.createElement}e=b}catch(d){e=q=!0}})();var d={elements:r.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup main mark meter nav output progress section summary time video",
version:"3.6.2",shivCSS:!1!==r.shivCSS,supportsUnknownElements:e,shivMethods:!1!==r.shivMethods,type:"default",shivDocument:w,createElement:v,createDocumentFragment:function(a,b){a||(a=f);if(e)return a.createDocumentFragment();for(var b=b||n(a),c=b.frag.cloneNode(),d=0,j=o(),l=j.length;d<l;d++)c.createElement(j[d]);return c}};j.html5=d;w(f);var D=/^$|\b(?:all|print)\b/,l="html5shiv",C=!e&&function(){var a=f.documentElement;return!("undefined"==typeof f.namespaces||"undefined"==typeof f.parentWindow||
"undefined"==typeof a.applyElement||"undefined"==typeof a.removeNode||"undefined"==typeof j.attachEvent)}();d.type+=" print";d.shivPrint=x;x(f)})(this,document);
/*
 HTML5 Shiv v3.6.2 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/

(function(l,f){function m(){var a=e.elements;return"string"==typeof a?a.split(" "):a}function i(a){var b=n[a[o]];b||(b={},h++,a[o]=h,n[h]=b);return b}function p(a,b,c){b||(b=f);if(g)return b.createElement(a);c||(c=i(b));b=c.cache[a]?c.cache[a].cloneNode():r.test(a)?(c.cache[a]=c.createElem(a)).cloneNode():c.createElem(a);return b.canHaveChildren&&!s.test(a)?c.frag.appendChild(b):b}function t(a,b){if(!b.cache)b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag();
a.createElement=function(c){return!e.shivMethods?b.createElem(c):p(c,a,b)};a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/\w+/g,function(a){b.createElem(a);b.frag.createElement(a);return'c("'+a+'")'})+");return n}")(e,b.frag)}function q(a){a||(a=f);var b=i(a);if(e.shivCSS&&!j&&!b.hasCSS){var c,d=a;c=d.createElement("p");d=d.getElementsByTagName("head")[0]||d.documentElement;c.innerHTML="x<style>article,aside,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}</style>";
c=d.insertBefore(c.lastChild,d.firstChild);b.hasCSS=!!c}g||t(a,b);return a}var k=l.html5||{},s=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,r=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,j,o="_html5shiv",h=0,n={},g;(function(){try{var a=f.createElement("a");a.innerHTML="<xyz></xyz>";j="hidden"in a;var b;if(!(b=1==a.childNodes.length)){f.createElement("a");var c=f.createDocumentFragment();b="undefined"==typeof c.cloneNode||
"undefined"==typeof c.createDocumentFragment||"undefined"==typeof c.createElement}g=b}catch(d){g=j=!0}})();var e={elements:k.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup main mark meter nav output progress section summary time video",version:"3.6.2",shivCSS:!1!==k.shivCSS,supportsUnknownElements:g,shivMethods:!1!==k.shivMethods,type:"default",shivDocument:q,createElement:p,createDocumentFragment:function(a,b){a||(a=f);if(g)return a.createDocumentFragment();
for(var b=b||i(a),c=b.frag.cloneNode(),d=0,e=m(),h=e.length;d<h;d++)c.createElement(e[d]);return c}};l.html5=e;q(f)})(this,document);
/**
* @preserve HTML5 Shiv v3.6.2 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/

;(function(window, document) {
/*jshint evil:true */
  /** version */
  var version = '3.6.2';

  /** Preset options */
  var options = window.html5 || {};

  /** Used to skip problem elements */
  var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

  /** Not all elements can be cloned in IE **/
  var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

  /** Detect whether the browser supports default html5 styles */
  var supportsHtml5Styles;

  /** Name of the expando, to work with multiple documents or to re-shiv one document */
  var expando = '_html5shiv';

  /** The id for the the documents expando */
  var expanID = 0;

  /** Cached data for each document */
  var expandoData = {};

  /** Detect whether the browser supports unknown elements */
  var supportsUnknownElements;

  (function() {
    try {
        var a = document.createElement('a');
        a.innerHTML = '<xyz></xyz>';
        //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
        supportsHtml5Styles = ('hidden' in a);

        supportsUnknownElements = a.childNodes.length == 1 || (function() {
          // assign a false positive if unable to shiv
          (document.createElement)('a');
          var frag = document.createDocumentFragment();
          return (
            typeof frag.cloneNode == 'undefined' ||
            typeof frag.createDocumentFragment == 'undefined' ||
            typeof frag.createElement == 'undefined'
          );
        }());
    } catch(e) {
      // assign a false positive if detection fails => unable to shiv
      supportsHtml5Styles = true;
      supportsUnknownElements = true;
    }

  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a style sheet with the given CSS text and adds it to the document.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The CSS text.
   * @returns {StyleSheet} The style element.
   */
  function addStyleSheet(ownerDocument, cssText) {
    var p = ownerDocument.createElement('p'),
        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

    p.innerHTML = 'x<style>' + cssText + '</style>';
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }

  /**
   * Returns the value of `html5.elements` as an array.
   * @private
   * @returns {Array} An array of shived element node names.
   */
  function getElements() {
    var elements = html5.elements;
    return typeof elements == 'string' ? elements.split(' ') : elements;
  }

    /**
   * Returns the data associated to the given document
   * @private
   * @param {Document} ownerDocument The document.
   * @returns {Object} An object of data.
   */
  function getExpandoData(ownerDocument) {
    var data = expandoData[ownerDocument[expando]];
    if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
    }
    return data;
  }

  /**
   * returns a shived element for the given nodeName and document
   * @memberOf html5
   * @param {String} nodeName name of the element
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived element.
   */
  function createElement(nodeName, ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createElement(nodeName);
    }
    if (!data) {
        data = getExpandoData(ownerDocument);
    }
    var node;

    if (data.cache[nodeName]) {
        node = data.cache[nodeName].cloneNode();
    } else if (saveClones.test(nodeName)) {
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
    } else {
        node = data.createElem(nodeName);
    }

    // Avoid adding some elements to fragments in IE < 9 because
    // * Attributes like `name` or `type` cannot be set/changed once an element
    //   is inserted into a document/fragment
    // * Link elements with `src` attributes that are inaccessible, as with
    //   a 403 response, will cause the tab/window to crash
    // * Script elements appended to fragments will execute when their `src`
    //   or `text` property is set
    return node.canHaveChildren && !reSkip.test(nodeName) ? data.frag.appendChild(node) : node;
  }

  /**
   * returns a shived DocumentFragment for the given document
   * @memberOf html5
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived DocumentFragment.
   */
  function createDocumentFragment(ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createDocumentFragment();
    }
    data = data || getExpandoData(ownerDocument);
    var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;
    for(;i<l;i++){
        clone.createElement(elems[i]);
    }
    return clone;
  }

  /**
   * Shivs the `createElement` and `createDocumentFragment` methods of the document.
   * @private
   * @param {Document|DocumentFragment} ownerDocument The document.
   * @param {Object} data of the document.
   */
  function shivMethods(ownerDocument, data) {
    if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
    }


    ownerDocument.createElement = function(nodeName) {
      //abort shiv
      if (!html5.shivMethods) {
          return data.createElem(nodeName);
      }
      return createElement(nodeName, ownerDocument, data);
    };

    ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
      'var n=f.cloneNode(),c=n.createElement;' +
      'h.shivMethods&&(' +
        // unroll the `createElement` calls
        getElements().join().replace(/\w+/g, function(nodeName) {
          data.createElem(nodeName);
          data.frag.createElement(nodeName);
          return 'c("' + nodeName + '")';
        }) +
      ');return n}'
    )(html5, data.frag);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivDocument(ownerDocument) {
    if (!ownerDocument) {
        ownerDocument = document;
    }
    var data = getExpandoData(ownerDocument);

    if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
      data.hasCSS = !!addStyleSheet(ownerDocument,
        // corrects block display not defined in IE6/7/8/9
        'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
        // adds styling not present in IE6/7/8/9
        'mark{background:#FF0;color:#000}' +
        // hides non-rendered elements
        'template{display:none}'
      );
    }
    if (!supportsUnknownElements) {
      shivMethods(ownerDocument, data);
    }
    return ownerDocument;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The `html5` object is exposed so that more elements can be shived and
   * existing shiving can be detected on iframes.
   * @type Object
   * @example
   *
   * // options can be changed before the script is included
   * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
   */
  var html5 = {

    /**
     * An array or space separated string of node names of the elements to shiv.
     * @memberOf html5
     * @type Array|String
     */
    'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',

    /**
     * current version of html5shiv
     */
    'version': version,

    /**
     * A flag to indicate that the HTML5 style sheet should be inserted.
     * @memberOf html5
     * @type Boolean
     */
    'shivCSS': (options.shivCSS !== false),

    /**
     * Is equal to true if a browser supports creating unknown/HTML5 elements
     * @memberOf html5
     * @type boolean
     */
    'supportsUnknownElements': supportsUnknownElements,

    /**
     * A flag to indicate that the document's `createElement` and `createDocumentFragment`
     * methods should be overwritten.
     * @memberOf html5
     * @type Boolean
     */
    'shivMethods': (options.shivMethods !== false),

    /**
     * A string to describe the type of `html5` object ("default" or "default print").
     * @memberOf html5
     * @type String
     */
    'type': 'default',

    // shivs the document according to the specified `html5` object options
    'shivDocument': shivDocument,

    //creates a shived element
    createElement: createElement,

    //creates a shived documentFragment
    createDocumentFragment: createDocumentFragment
  };

  /*--------------------------------------------------------------------------*/

  // expose html5
  window.html5 = html5;

  // shiv the document
  shivDocument(document);

  /*------------------------------- Print Shiv -------------------------------*/

  /** Used to filter media types */
  var reMedia = /^$|\b(?:all|print)\b/;

  /** Used to namespace printable elements */
  var shivNamespace = 'html5shiv';

  /** Detect whether the browser supports shivable style sheets */
  var supportsShivableSheets = !supportsUnknownElements && (function() {
    // assign a false negative if unable to shiv
    var docEl = document.documentElement;
    return !(
      typeof document.namespaces == 'undefined' ||
      typeof document.parentWindow == 'undefined' ||
      typeof docEl.applyElement == 'undefined' ||
      typeof docEl.removeNode == 'undefined' ||
      typeof window.attachEvent == 'undefined'
    );
  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Wraps all HTML5 elements in the given document with printable elements.
   * (eg. the "header" element is wrapped with the "html5shiv:header" element)
   * @private
   * @param {Document} ownerDocument The document.
   * @returns {Array} An array wrappers added.
   */
  function addWrappers(ownerDocument) {
    var node,
        nodes = ownerDocument.getElementsByTagName('*'),
        index = nodes.length,
        reElements = RegExp('^(?:' + getElements().join('|') + ')$', 'i'),
        result = [];

    while (index--) {
      node = nodes[index];
      if (reElements.test(node.nodeName)) {
        result.push(node.applyElement(createWrapper(node)));
      }
    }
    return result;
  }

  /**
   * Creates a printable wrapper for the given element.
   * @private
   * @param {Element} element The element.
   * @returns {Element} The wrapper.
   */
  function createWrapper(element) {
    var node,
        nodes = element.attributes,
        index = nodes.length,
        wrapper = element.ownerDocument.createElement(shivNamespace + ':' + element.nodeName);

    // copy element attributes to the wrapper
    while (index--) {
      node = nodes[index];
      node.specified && wrapper.setAttribute(node.nodeName, node.nodeValue);
    }
    // copy element styles to the wrapper
    wrapper.style.cssText = element.style.cssText;
    return wrapper;
  }

  /**
   * Shivs the given CSS text.
   * (eg. header{} becomes html5shiv\:header{})
   * @private
   * @param {String} cssText The CSS text to shiv.
   * @returns {String} The shived CSS text.
   */
  function shivCssText(cssText) {
    var pair,
        parts = cssText.split('{'),
        index = parts.length,
        reElements = RegExp('(^|[\\s,>+~])(' + getElements().join('|') + ')(?=[[\\s,>+~#.:]|$)', 'gi'),
        replacement = '$1' + shivNamespace + '\\:$2';

    while (index--) {
      pair = parts[index] = parts[index].split('}');
      pair[pair.length - 1] = pair[pair.length - 1].replace(reElements, replacement);
      parts[index] = pair.join('}');
    }
    return parts.join('{');
  }

  /**
   * Removes the given wrappers, leaving the original elements.
   * @private
   * @params {Array} wrappers An array of printable wrappers.
   */
  function removeWrappers(wrappers) {
    var index = wrappers.length;
    while (index--) {
      wrappers[index].removeNode();
    }
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document for print.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivPrint(ownerDocument) {
    var shivedSheet,
        wrappers,
        data = getExpandoData(ownerDocument),
        namespaces = ownerDocument.namespaces,
        ownerWindow = ownerDocument.parentWindow;

    if (!supportsShivableSheets || ownerDocument.printShived) {
      return ownerDocument;
    }
    if (typeof namespaces[shivNamespace] == 'undefined') {
      namespaces.add(shivNamespace);
    }

    function removeSheet() {
      clearTimeout(data._removeSheetTimer);
      if (shivedSheet) {
          shivedSheet.removeNode(true);
      }
      shivedSheet= null;
    }

    ownerWindow.attachEvent('onbeforeprint', function() {

      removeSheet();

      var imports,
          length,
          sheet,
          collection = ownerDocument.styleSheets,
          cssText = [],
          index = collection.length,
          sheets = Array(index);

      // convert styleSheets collection to an array
      while (index--) {
        sheets[index] = collection[index];
      }
      // concat all style sheet CSS text
      while ((sheet = sheets.pop())) {
        // IE does not enforce a same origin policy for external style sheets...
        // but has trouble with some dynamically created stylesheets
        if (!sheet.disabled && reMedia.test(sheet.media)) {

          try {
            imports = sheet.imports;
            length = imports.length;
          } catch(er){
            length = 0;
          }

          for (index = 0; index < length; index++) {
            sheets.push(imports[index]);
          }

          try {
            cssText.push(sheet.cssText);
          } catch(er){}
        }
      }

      // wrap all HTML5 elements with printable elements and add the shived style sheet
      cssText = shivCssText(cssText.reverse().join(''));
      wrappers = addWrappers(ownerDocument);
      shivedSheet = addStyleSheet(ownerDocument, cssText);

    });

    ownerWindow.attachEvent('onafterprint', function() {
      // remove wrappers, leaving the original elements, and remove the shived style sheet
      removeWrappers(wrappers);
      clearTimeout(data._removeSheetTimer);
      data._removeSheetTimer = setTimeout(removeSheet, 500);
    });

    ownerDocument.printShived = true;
    return ownerDocument;
  }

  /*--------------------------------------------------------------------------*/

  // expose API
  html5.type += ' print';
  html5.shivPrint = shivPrint;

  // shiv for print
  shivPrint(document);

}(this, document));
/**
* @preserve HTML5 Shiv v3.6.2 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/

;(function(window, document) {
/*jshint evil:true */
  /** version */
  var version = '3.6.2';

  /** Preset options */
  var options = window.html5 || {};

  /** Used to skip problem elements */
  var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

  /** Not all elements can be cloned in IE **/
  var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

  /** Detect whether the browser supports default html5 styles */
  var supportsHtml5Styles;

  /** Name of the expando, to work with multiple documents or to re-shiv one document */
  var expando = '_html5shiv';

  /** The id for the the documents expando */
  var expanID = 0;

  /** Cached data for each document */
  var expandoData = {};

  /** Detect whether the browser supports unknown elements */
  var supportsUnknownElements;

  (function() {
    try {
        var a = document.createElement('a');
        a.innerHTML = '<xyz></xyz>';
        //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
        supportsHtml5Styles = ('hidden' in a);

        supportsUnknownElements = a.childNodes.length == 1 || (function() {
          // assign a false positive if unable to shiv
          (document.createElement)('a');
          var frag = document.createDocumentFragment();
          return (
            typeof frag.cloneNode == 'undefined' ||
            typeof frag.createDocumentFragment == 'undefined' ||
            typeof frag.createElement == 'undefined'
          );
        }());
    } catch(e) {
      // assign a false positive if detection fails => unable to shiv
      supportsHtml5Styles = true;
      supportsUnknownElements = true;
    }

  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a style sheet with the given CSS text and adds it to the document.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The CSS text.
   * @returns {StyleSheet} The style element.
   */
  function addStyleSheet(ownerDocument, cssText) {
    var p = ownerDocument.createElement('p'),
        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

    p.innerHTML = 'x<style>' + cssText + '</style>';
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }

  /**
   * Returns the value of `html5.elements` as an array.
   * @private
   * @returns {Array} An array of shived element node names.
   */
  function getElements() {
    var elements = html5.elements;
    return typeof elements == 'string' ? elements.split(' ') : elements;
  }

    /**
   * Returns the data associated to the given document
   * @private
   * @param {Document} ownerDocument The document.
   * @returns {Object} An object of data.
   */
  function getExpandoData(ownerDocument) {
    var data = expandoData[ownerDocument[expando]];
    if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
    }
    return data;
  }

  /**
   * returns a shived element for the given nodeName and document
   * @memberOf html5
   * @param {String} nodeName name of the element
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived element.
   */
  function createElement(nodeName, ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createElement(nodeName);
    }
    if (!data) {
        data = getExpandoData(ownerDocument);
    }
    var node;

    if (data.cache[nodeName]) {
        node = data.cache[nodeName].cloneNode();
    } else if (saveClones.test(nodeName)) {
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
    } else {
        node = data.createElem(nodeName);
    }

    // Avoid adding some elements to fragments in IE < 9 because
    // * Attributes like `name` or `type` cannot be set/changed once an element
    //   is inserted into a document/fragment
    // * Link elements with `src` attributes that are inaccessible, as with
    //   a 403 response, will cause the tab/window to crash
    // * Script elements appended to fragments will execute when their `src`
    //   or `text` property is set
    return node.canHaveChildren && !reSkip.test(nodeName) ? data.frag.appendChild(node) : node;
  }

  /**
   * returns a shived DocumentFragment for the given document
   * @memberOf html5
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived DocumentFragment.
   */
  function createDocumentFragment(ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createDocumentFragment();
    }
    data = data || getExpandoData(ownerDocument);
    var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;
    for(;i<l;i++){
        clone.createElement(elems[i]);
    }
    return clone;
  }

  /**
   * Shivs the `createElement` and `createDocumentFragment` methods of the document.
   * @private
   * @param {Document|DocumentFragment} ownerDocument The document.
   * @param {Object} data of the document.
   */
  function shivMethods(ownerDocument, data) {
    if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
    }


    ownerDocument.createElement = function(nodeName) {
      //abort shiv
      if (!html5.shivMethods) {
          return data.createElem(nodeName);
      }
      return createElement(nodeName, ownerDocument, data);
    };

    ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
      'var n=f.cloneNode(),c=n.createElement;' +
      'h.shivMethods&&(' +
        // unroll the `createElement` calls
        getElements().join().replace(/\w+/g, function(nodeName) {
          data.createElem(nodeName);
          data.frag.createElement(nodeName);
          return 'c("' + nodeName + '")';
        }) +
      ');return n}'
    )(html5, data.frag);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivDocument(ownerDocument) {
    if (!ownerDocument) {
        ownerDocument = document;
    }
    var data = getExpandoData(ownerDocument);

    if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
      data.hasCSS = !!addStyleSheet(ownerDocument,
        // corrects block display not defined in IE6/7/8/9
        'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
        // adds styling not present in IE6/7/8/9
        'mark{background:#FF0;color:#000}' +
        // hides non-rendered elements
        'template{display:none}'
      );
    }
    if (!supportsUnknownElements) {
      shivMethods(ownerDocument, data);
    }
    return ownerDocument;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The `html5` object is exposed so that more elements can be shived and
   * existing shiving can be detected on iframes.
   * @type Object
   * @example
   *
   * // options can be changed before the script is included
   * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
   */
  var html5 = {

    /**
     * An array or space separated string of node names of the elements to shiv.
     * @memberOf html5
     * @type Array|String
     */
    'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',

    /**
     * current version of html5shiv
     */
    'version': version,

    /**
     * A flag to indicate that the HTML5 style sheet should be inserted.
     * @memberOf html5
     * @type Boolean
     */
    'shivCSS': (options.shivCSS !== false),

    /**
     * Is equal to true if a browser supports creating unknown/HTML5 elements
     * @memberOf html5
     * @type boolean
     */
    'supportsUnknownElements': supportsUnknownElements,

    /**
     * A flag to indicate that the document's `createElement` and `createDocumentFragment`
     * methods should be overwritten.
     * @memberOf html5
     * @type Boolean
     */
    'shivMethods': (options.shivMethods !== false),

    /**
     * A string to describe the type of `html5` object ("default" or "default print").
     * @memberOf html5
     * @type String
     */
    'type': 'default',

    // shivs the document according to the specified `html5` object options
    'shivDocument': shivDocument,

    //creates a shived element
    createElement: createElement,

    //creates a shived documentFragment
    createDocumentFragment: createDocumentFragment
  };

  /*--------------------------------------------------------------------------*/

  // expose html5
  window.html5 = html5;

  // shiv the document
  shivDocument(document);

}(this, document));
/*
 Highcharts JS v2.1.9 (2011-11-11)

 (c) 2009-2011 Torstein H?nsi

 License: www.highcharts.com/license
*/

(function(){function sa(a,b){var c;a||(a={});for(c in b)a[c]=b[c];return a}function ja(a,b){return parseInt(a,b||10)}function Sb(a){return typeof a==="string"}function Nb(a){return typeof a==="object"}function lc(a){return typeof a==="number"}function mc(a){return Fa.log(a)/Fa.LN10}function nc(a,b){for(var c=a.length;c--;)if(a[c]===b){a.splice(c,1);break}}function K(a){return a!==Wa&&a!==null}function Ga(a,b,c){var d,e;if(Sb(b))if(K(c))a.setAttribute(b,c);else{if(a&&a.getAttribute)e=a.getAttribute(b)}else if(K(b)&&
Nb(b))for(d in b)a.setAttribute(d,b[d]);return e}function zc(a){return Object.prototype.toString.call(a)==="[object Array]"?a:[a]}function A(){var a=arguments,b,c,d=a.length;for(b=0;b<d;b++){c=a[b];if(typeof c!=="undefined"&&c!==null)return c}}function Ja(a,b){if(Pc)if(b&&b.opacity!==Wa)b.filter="alpha(opacity="+b.opacity*100+")";sa(a.style,b)}function hb(a,b,c,d,e){a=ua.createElement(a);b&&sa(a,b);e&&Ja(a,{padding:0,border:jb,margin:0});c&&Ja(a,c);d&&d.appendChild(a);return a}function yb(a,b){var c=
function(){};c.prototype=new a;sa(c.prototype,b);return c}function Ed(a,b,c,d){var e=Xa.lang;a=a;var f=isNaN(b=bb(b))?2:b;b=c===undefined?e.decimalPoint:c;d=d===undefined?e.thousandsSep:d;e=a<0?"-":"";c=String(ja(a=bb(+a||0).toFixed(f)));var g=c.length>3?c.length%3:0;return e+(g?c.substr(0,g)+d:"")+c.substr(g).replace(/(\d{3})(?=\d)/g,"$1"+d)+(f?b+bb(a-c).toFixed(f).slice(2):"")}function Fd(a){var b={left:a.offsetLeft,top:a.offsetTop};for(a=a.offsetParent;a;){b.left+=a.offsetLeft;b.top+=a.offsetTop;
if(a!==ua.body&&a!==ua.documentElement){b.left-=a.scrollLeft;b.top-=a.scrollTop}a=a.offsetParent}return b}function Gd(){this.symbol=this.color=0}function fe(a,b,c,d,e,f,g){var h=g.x;g=g.y;var i=h-a+c-25,j=g-b+d+10,m;if(i<7)i=c+h+15;if(i+a>c+e){i-=i+a-(c+e);j-=b;m=true}if(j<5){j=5;if(m&&g>=j&&g<=j+b)j=g+b-5}else if(j+b>d+f)j=d+f-b-5;return{x:i,y:j}}function Hd(a,b){var c=a.length,d;for(d=0;d<c;d++)a[d].ss_i=d;a.sort(function(e,f){var g=b(e,f);return g===0?e.ss_i-f.ss_i:g});for(d=0;d<c;d++)delete a[d].ss_i}
function Ac(a){for(var b in a){a[b]&&a[b].destroy&&a[b].destroy();delete a[b]}}function oc(a,b){Bc=A(a,b.animation)}function Id(){var a=Xa.global.useUTC;Qc=a?Date.UTC:function(b,c,d,e,f,g){return(new Date(b,c,A(d,1),A(e,0),A(f,0),A(g,0))).getTime()};id=a?"getUTCMinutes":"getMinutes";jd=a?"getUTCHours":"getHours";kd=a?"getUTCDay":"getDay";Cc=a?"getUTCDate":"getDate";Rc=a?"getUTCMonth":"getMonth";Sc=a?"getUTCFullYear":"getFullYear";Jd=a?"setUTCMinutes":"setMinutes";Kd=a?"setUTCHours":"setHours";ld=
a?"setUTCDate":"setDate";Ld=a?"setUTCMonth":"setMonth";Md=a?"setUTCFullYear":"setFullYear"}function pc(a){Tc||(Tc=hb(Tb));a&&Tc.appendChild(a);Tc.innerHTML=""}function Uc(){}function Nd(a,b){function c(p){function q(k,n){this.pos=k;this.minor=n;this.isNew=true;n||this.addLabel()}function w(k){if(k){this.options=k;this.id=k.id}return this}function x(k,n,t,r){this.isNegative=n;this.options=k;this.x=t;this.stack=r;this.alignOptions={align:k.align||(va?n?"left":"right":"center"),verticalAlign:k.verticalAlign||
(va?"middle":n?"bottom":"top"),y:A(k.y,va?4:n?14:-6),x:A(k.x,va?n?-6:6:0)};this.textAlign=k.textAlign||(va?n?"right":"left":"center")}function V(){var k=[],n=[],t;pa=wa=null;zb=[];u(Ha,function(r){t=false;u(["xAxis","yAxis"],function(F){if(r.isCartesian&&(F==="xAxis"&&xa||F==="yAxis"&&!xa)&&(r.options[F]===o.index||r.options[F]===Wa&&o.index===0)){r[F]=I;zb.push(r);t=true}});if(!r.visible&&z.ignoreHiddenSeries)t=false;if(t){var J,E,Q,fa,ka,$;if(!xa){J=r.options.stacking;Vc=J==="percent";if(J){ka=
r.options.stack;fa=r.type+A(ka,"");$="-"+fa;r.stackKey=fa;E=k[fa]||[];k[fa]=E;Q=n[$]||[];n[$]=Q}if(Vc){pa=0;wa=99}}if(r.isCartesian){u(r.data,function(F){var O=F.x,S=F.y,aa=S<0,Eb=aa?Q:E,kb=aa?$:fa;if(pa===null)pa=wa=F[qa];if(xa)if(O>wa)wa=O;else{if(O<pa)pa=O}else if(K(S)){if(J)Eb[O]=K(Eb[O])?Eb[O]+S:S;S=Eb?Eb[O]:S;F=A(F.low,S);if(!Vc)if(S>wa)wa=S;else if(F<pa)pa=F;if(J){s[kb]||(s[kb]={});s[kb][O]||(s[kb][O]=new x(o.stackLabels,aa,O,ka));s[kb][O].setTotal(S)}}});if(/(area|column|bar)/.test(r.type)&&
!xa)if(pa>=0){pa=0;Od=true}else if(wa<0){wa=0;Pd=true}}}})}function N(k,n){var t,r;Fb=n?1:Fa.pow(10,lb(Fa.log(k)/Fa.LN10));t=k/Fb;if(!n){n=[1,2,2.5,5,10];if(o.allowDecimals===false||ca)if(Fb===1)n=[1,2,5,10];else if(Fb<=0.1)n=[1/Fb]}for(r=0;r<n.length;r++){k=n[r];if(t<=(n[r]+(n[r+1]||n[r]))/2)break}k*=Fb;return k}function ta(k){var n;n=k;Fb=A(Fb,Fa.pow(10,lb(Fa.log(Ta)/Fa.LN10)));if(Fb<1){n=W(1/Fb)*10;n=W(k*n)/n}return n}function da(){var k,n,t,r,J=o.tickInterval,E=o.tickPixelInterval;k=o.maxZoom||
(xa&&!K(o.min)&&!K(o.max)?tb(l.smallestInterval*5,wa-pa):null);ya=R?Da:Aa;if(Ub){t=l[xa?"xAxis":"yAxis"][o.linkedTo];r=t.getExtremes();ia=A(r.min,r.dataMin);ra=A(r.max,r.dataMax)}else{ia=A(Vb,o.min,pa);ra=A(Gb,o.max,wa)}if(ca){ia=mc(ia);ra=mc(ra)}if(ra-ia<k){r=(k-ra+ia)/2;ia=Ia(ia-r,A(o.min,ia-r),pa);ra=tb(ia+k,A(o.max,ia+k),wa)}if(!Ya&&!Vc&&!Ub&&K(ia)&&K(ra)){k=ra-ia||1;if(!K(o.min)&&!K(Vb)&&Qd&&(pa<0||!Od))ia-=k*Qd;if(!K(o.max)&&!K(Gb)&&Rd&&(wa>0||!Pd))ra+=k*Rd}Ta=ia===ra?1:Ub&&!J&&E===t.options.tickPixelInterval?
t.tickInterval:A(J,Ya?1:(ra-ia)*E/ya);if(!D&&!K(o.tickInterval))Ta=N(Ta);I.tickInterval=Ta;Wc=o.minorTickInterval==="auto"&&Ta?Ta/5:o.minorTickInterval;if(D){Ba=[];J=Xa.global.useUTC;var Q=1E3/ub,fa=6E4/ub,ka=36E5/ub;E=864E5/ub;k=6048E5/ub;r=2592E6/ub;var $=31556952E3/ub,F=[["second",Q,[1,2,5,10,15,30]],["minute",fa,[1,2,5,10,15,30]],["hour",ka,[1,2,3,4,6,8,12]],["day",E,[1,2]],["week",k,[1,2]],["month",r,[1,2,3,4,6]],["year",$,null]],O=F[6],S=O[1],aa=O[2];for(t=0;t<F.length;t++){O=F[t];S=O[1];aa=
O[2];if(F[t+1])if(Ta<=(S*aa[aa.length-1]+F[t+1][1])/2)break}if(S===$&&Ta<5*S)aa=[1,2,5];F=N(Ta/S,aa);aa=new Date(ia*ub);aa.setMilliseconds(0);if(S>=Q)aa.setSeconds(S>=fa?0:F*lb(aa.getSeconds()/F));if(S>=fa)aa[Jd](S>=ka?0:F*lb(aa[id]()/F));if(S>=ka)aa[Kd](S>=E?0:F*lb(aa[jd]()/F));if(S>=E)aa[ld](S>=r?1:F*lb(aa[Cc]()/F));if(S>=r){aa[Ld](S>=$?0:F*lb(aa[Rc]()/F));n=aa[Sc]()}if(S>=$){n-=n%F;aa[Md](n)}S===k&&aa[ld](aa[Cc]()-aa[kd]()+o.startOfWeek);t=1;n=aa[Sc]();Q=aa.getTime()/ub;fa=aa[Rc]();for(ka=aa[Cc]();Q<
ra&&t<Da;){Ba.push(Q);if(S===$)Q=Qc(n+t*F,0)/ub;else if(S===r)Q=Qc(n,fa+t*F)/ub;else if(!J&&(S===E||S===k))Q=Qc(n,fa,ka+t*F*(S===E?1:7));else Q+=S*F;t++}Ba.push(Q);Xc=o.dateTimeLabelFormats[O[0]]}else{t=ta(lb(ia/Ta)*Ta);n=ta(md(ra/Ta)*Ta);Ba=[];for(t=ta(t);t<=n;){Ba.push(t);t=ta(t+Ta)}}if(!Ub){if(Ya||xa&&l.hasColumn){n=(Ya?1:Ta)*0.5;if(Ya||!K(A(o.min,Vb)))ia-=n;if(Ya||!K(A(o.max,Gb)))ra+=n}n=Ba[0];t=Ba[Ba.length-1];if(o.startOnTick)ia=n;else ia>n&&Ba.shift();if(o.endOnTick)ra=t;else ra<t&&Ba.pop();
Ob||(Ob={x:0,y:0});if(!D&&Ba.length>Ob[qa])Ob[qa]=Ba.length}}function Ma(){var k,n;Dc=ia;Sd=ra;V();da();Hb=fb;fb=ya/(ra-ia||1);if(!xa)for(k in s)for(n in s[k])s[k][n].cum=s[k][n].total;if(!I.isDirty)I.isDirty=ia!==Dc||ra!==Sd}function za(k){k=(new w(k)).render();Pb.push(k);return k}function eb(){var k=o.title,n=o.stackLabels,t=o.alternateGridColor,r=o.lineWidth,J,E,Q=(J=l.hasRendered)&&K(Dc)&&!isNaN(Dc);E=zb.length&&K(ia)&&K(ra);ya=R?Da:Aa;fb=ya/(ra-ia||1);cc=R?X:vb;if(E||Ub){if(Wc&&!Ya)for(E=ia+
(Ba[0]-ia)%Wc;E<=ra;E+=Wc){Wb[E]||(Wb[E]=new q(E,true));Q&&Wb[E].isNew&&Wb[E].render(null,true);Wb[E].isActive=true;Wb[E].render()}u(Ba,function($,F){if(!Ub||$>=ia&&$<=ra){Q&&mb[$].isNew&&mb[$].render(F,true);mb[$].isActive=true;mb[$].render(F)}});t&&u(Ba,function($,F){if(F%2===0&&$<ra){dc[$]||(dc[$]=new w);dc[$].options={from:$,to:Ba[F+1]!==Wa?Ba[F+1]:ra,color:t};dc[$].render();dc[$].isActive=true}});J||u((o.plotLines||[]).concat(o.plotBands||[]),function($){Pb.push((new w($)).render())})}u([mb,
Wb,dc],function($){for(var F in $)if($[F].isActive)$[F].isActive=false;else{$[F].destroy();delete $[F]}});if(r){J=X+(Oa?Da:0)+la;E=cb-vb-(Oa?Aa:0)+la;J=ga.crispLine([Za,R?X:J,R?E:ea,Ka,R?$a-Ib:J,R?E:cb-vb],r);if(La)La.animate({d:J});else La=ga.path(J).attr({stroke:o.lineColor,"stroke-width":r,zIndex:7}).add()}if(ba){J=R?X:ea;r=ja(k.style.fontSize||12);J={low:J+(R?0:ya),middle:J+ya/2,high:J+(R?ya:0)}[k.align];r=(R?ea+Aa:X)+(R?1:-1)*(Oa?-1:1)*nd+(L===2?r:0);ba[ba.isNew?"attr":"animate"]({x:R?J:r+(Oa?
Da:0)+la+(k.x||0),y:R?r-(Oa?Aa:0)+la:J+(k.y||0)});ba.isNew=false}if(n&&n.enabled){var fa,ka;n=I.stackTotalGroup;if(!n)I.stackTotalGroup=n=ga.g("stack-labels").attr({visibility:Ab,zIndex:6}).translate(X,ea).add();for(fa in s){k=s[fa];for(ka in k)k[ka].render(n)}}I.isDirty=false}function ab(k){for(var n=Pb.length;n--;)Pb[n].id===k&&Pb[n].destroy()}var xa=p.isX,Oa=p.opposite,R=va?!xa:xa,L=R?Oa?0:2:Oa?1:3,s={},o=Ca(xa?Yc:od,[ge,he,Td,ie][L],p),I=this,ba,B=o.type,D=B==="datetime",ca=B==="logarithmic",
la=o.offset||0,qa=xa?"x":"y",ya,fb,Hb,cc=R?X:vb,G,ha,na,Ra,La,pa,wa,zb,Vb,Gb,ra=null,ia=null,Dc,Sd,Qd=o.minPadding,Rd=o.maxPadding,Ub=K(o.linkedTo),Od,Pd,Vc;B=o.events;var pd,Pb=[],Ta,Wc,Fb,Ba,mb={},Wb={},dc={},qc,rc,nd,Xc,Ya=o.categories,je=o.labels.formatter||function(){var k=this.value;return Xc?Zc(Xc,k):Ta%1E6===0?k/1E6+"M":Ta%1E3===0?k/1E3+"k":!Ya&&k>=1E3?Ed(k,0):k},$c=R&&o.labels.staggerLines,ec=o.reversed,fc=Ya&&o.tickmarkPlacement==="between"?0.5:0;q.prototype={addLabel:function(){var k=this.pos,
n=o.labels,t=!(k===ia&&!A(o.showFirstLabel,1)||k===ra&&!A(o.showLastLabel,0)),r=Ya&&R&&Ya.length&&!n.step&&!n.staggerLines&&!n.rotation&&Da/Ya.length||!R&&Da/2,J=Ya&&K(Ya[k])?Ya[k]:k,E=this.label;k=je.call({isFirst:k===Ba[0],isLast:k===Ba[Ba.length-1],dateTimeLabelFormat:Xc,value:ca?Fa.pow(10,J):J});r=r&&{width:Ia(1,W(r-2*(n.padding||10)))+Ua};r=sa(r,n.style);if(E===Wa)this.label=K(k)&&t&&n.enabled?ga.text(k,0,0,n.useHTML).attr({align:n.align,rotation:n.rotation}).css(r).add(na):null;else E&&E.attr({text:k}).css(r)},
getLabelSize:function(){var k=this.label;return k?(this.labelBBox=k.getBBox())[R?"height":"width"]:0},render:function(k,n){var t=!this.minor,r=this.label,J=this.pos,E=o.labels,Q=this.gridLine,fa=t?o.gridLineWidth:o.minorGridLineWidth,ka=t?o.gridLineColor:o.minorGridLineColor,$=t?o.gridLineDashStyle:o.minorGridLineDashStyle,F=this.mark,O=t?o.tickLength:o.minorTickLength,S=t?o.tickWidth:o.minorTickWidth||0,aa=t?o.tickColor:o.minorTickColor,Eb=t?o.tickPosition:o.minorTickPosition,kb=E.step,nb=n&&ad||
cb,Qb;Qb=R?G(J+fc,null,null,n)+cc:X+la+(Oa?(n&&qd||$a)-Ib-X:0);nb=R?nb-vb+la-(Oa?Aa:0):nb-G(J+fc,null,null,n)-cc;if(fa){J=ha(J+fc,fa,n);if(Q===Wa){Q={stroke:ka,"stroke-width":fa};if($)Q.dashstyle=$;if(t)Q.zIndex=1;this.gridLine=Q=fa?ga.path(J).attr(Q).add(Ra):null}!n&&Q&&J&&Q.animate({d:J})}if(S){if(Eb==="inside")O=-O;if(Oa)O=-O;t=ga.crispLine([Za,Qb,nb,Ka,Qb+(R?0:-O),nb+(R?O:0)],S);if(F)F.animate({d:t});else this.mark=ga.path(t).attr({stroke:aa,"stroke-width":S}).add(na)}if(r&&!isNaN(Qb)){Qb=Qb+
E.x-(fc&&R?fc*fb*(ec?-1:1):0);nb=nb+E.y-(fc&&!R?fc*fb*(ec?1:-1):0);K(E.y)||(nb+=ja(r.styles.lineHeight)*0.9-r.getBBox().height/2);if($c)nb+=k/(kb||1)%$c*16;if(kb)r[k%kb?"hide":"show"]();r[this.isNew?"attr":"animate"]({x:Qb,y:nb})}this.isNew=false},destroy:function(){Ac(this)}};w.prototype={render:function(){var k=this,n=k.options,t=n.label,r=k.label,J=n.width,E=n.to,Q=n.from,fa=n.value,ka,$=n.dashStyle,F=k.svgElem,O=[],S,aa,Eb=n.color;aa=n.zIndex;var kb=n.events;if(ca){Q=mc(Q);E=mc(E);fa=mc(fa)}if(J){O=
ha(fa,J);n={stroke:Eb,"stroke-width":J};if($)n.dashstyle=$}else if(K(Q)&&K(E)){Q=Ia(Q,ia);E=tb(E,ra);ka=ha(E);if((O=ha(Q))&&ka)O.push(ka[4],ka[5],ka[1],ka[2]);else O=null;n={fill:Eb}}else return;if(K(aa))n.zIndex=aa;if(F)if(O)F.animate({d:O},null,F.onGetPath);else{F.hide();F.onGetPath=function(){F.show()}}else if(O&&O.length){k.svgElem=F=ga.path(O).attr(n).add();if(kb){$=function(nb){F.on(nb,function(Qb){kb[nb].apply(k,[Qb])})};for(S in kb)$(S)}}if(t&&K(t.text)&&O&&O.length&&Da>0&&Aa>0){t=Ca({align:R&&
ka&&"center",x:R?!ka&&4:10,verticalAlign:!R&&ka&&"middle",y:R?ka?16:10:ka?6:-4,rotation:R&&!ka&&90},t);if(!r)k.label=r=ga.text(t.text,0,0).attr({align:t.textAlign||t.align,rotation:t.rotation,zIndex:aa}).css(t.style).add();ka=[O[1],O[4],A(O[6],O[1])];O=[O[2],O[5],A(O[7],O[2])];S=tb.apply(Fa,ka);aa=tb.apply(Fa,O);r.align(t,false,{x:S,y:aa,width:Ia.apply(Fa,ka)-S,height:Ia.apply(Fa,O)-aa});r.show()}else r&&r.hide();return k},destroy:function(){Ac(this);nc(Pb,this)}};x.prototype={destroy:function(){Ac(this)},
setTotal:function(k){this.cum=this.total=k},render:function(k){var n=this.options.formatter.call(this);if(this.label)this.label.attr({text:n,visibility:ob});else this.label=l.renderer.text(n,0,0).css(this.options.style).attr({align:this.textAlign,rotation:this.options.rotation,visibility:ob}).add(k)},setOffset:function(k,n){var t=this.isNegative,r=I.translate(this.total),J=I.translate(0);J=bb(r-J);var E=l.xAxis[0].translate(this.x)+k,Q=l.plotHeight;t={x:va?t?r:r-J:E,y:va?Q-E-n:t?Q-r-J:Q-r,width:va?
J:n,height:va?n:J};this.label&&this.label.align(this.alignOptions,null,t).attr({visibility:Ab})}};G=function(k,n,t,r,J){var E=1,Q=0,fa=r?Hb:fb;r=r?Dc:ia;fa||(fa=fb);if(t){E*=-1;Q=ya}if(ec){E*=-1;Q-=E*ya}if(n){if(ec)k=ya-k;k=k/fa+r;if(ca&&J)k=Fa.pow(10,k)}else{if(ca&&J)k=mc(k);k=E*(k-r)*fa+Q}return k};ha=function(k,n,t){var r,J,E;k=G(k,null,null,t);var Q=t&&ad||cb,fa=t&&qd||$a,ka;t=J=W(k+cc);r=E=W(Q-k-cc);if(isNaN(k))ka=true;else if(R){r=ea;E=Q-vb;if(t<X||t>X+Da)ka=true}else{t=X;J=fa-Ib;if(r<ea||r>
ea+Aa)ka=true}return ka?null:ga.crispLine([Za,t,r,Ka,J,E],n||0)};if(va&&xa&&ec===Wa)ec=true;sa(I,{addPlotBand:za,addPlotLine:za,adjustTickAmount:function(){if(Ob&&!D&&!Ya&&!Ub){var k=qc,n=Ba.length;qc=Ob[qa];if(n<qc){for(;Ba.length<qc;)Ba.push(ta(Ba[Ba.length-1]+Ta));fb*=(n-1)/(qc-1);ra=Ba[Ba.length-1]}if(K(k)&&qc!==k)I.isDirty=true}},categories:Ya,getExtremes:function(){return{min:ia,max:ra,dataMin:pa,dataMax:wa,userMin:Vb,userMax:Gb}},getPlotLinePath:ha,getThreshold:function(k){if(ia>k)k=ia;else if(ra<
k)k=ra;return G(k,0,1)},isXAxis:xa,options:o,plotLinesAndBands:Pb,getOffset:function(){var k=zb.length&&K(ia)&&K(ra),n=0,t=0,r=o.title,J=o.labels,E=[-1,1,1,-1][L],Q;if(!na){na=ga.g("axis").attr({zIndex:7}).add();Ra=ga.g("grid").attr({zIndex:1}).add()}rc=0;if(k||Ub){u(Ba,function(fa){if(mb[fa])mb[fa].addLabel();else mb[fa]=new q(fa);if(L===0||L===2||{1:"left",3:"right"}[L]===J.align)rc=Ia(mb[fa].getLabelSize(),rc)});if($c)rc+=($c-1)*16}else for(Q in mb){mb[Q].destroy();delete mb[Q]}if(r&&r.text){if(!ba){ba=
I.axisTitle=ga.text(r.text,0,0,r.useHTML).attr({zIndex:7,rotation:r.rotation||0,align:r.textAlign||{low:"left",middle:"center",high:"right"}[r.align]}).css(r.style).add();ba.isNew=true}n=ba.getBBox()[R?"height":"width"];t=A(r.margin,R?5:10)}la=E*(o.offset||Xb[L]);nd=rc+(L!==2&&rc&&E*o.labels[R?"y":"x"])+t;Xb[L]=Ia(Xb[L],nd+n+E*la)},render:eb,setCategories:function(k,n){I.categories=p.categories=Ya=k;u(zb,function(t){t.translate();t.setTooltipPoints(true)});I.isDirty=true;A(n,true)&&l.redraw()},setExtremes:function(k,
n,t,r){t=A(t,true);Pa(I,"setExtremes",{min:k,max:n},function(){Vb=k;Gb=n;t&&l.redraw(r)})},setScale:Ma,setTickPositions:da,translate:G,redraw:function(){Yb.resetTracker&&Yb.resetTracker();eb();u(Pb,function(k){k.render()});u(zb,function(k){k.isDirty=true})},removePlotBand:ab,removePlotLine:ab,reversed:ec,stacks:s,destroy:function(){var k;pb(I);for(k in s){Ac(s[k]);s[k]=null}if(I.stackTotalGroup)I.stackTotalGroup=I.stackTotalGroup.destroy();u([mb,Wb,dc,Pb],function(n){Ac(n)});u([La,na,Ra,ba],function(n){n&&
n.destroy()});La=na=Ra=ba=null}});for(pd in B)Qa(I,pd,B[pd]);Ma()}function d(){var p={};return{add:function(q,w,x,V){if(!p[q]){w=ga.text(w,0,0).css(a.toolbar.itemStyle).align({align:"right",x:-Ib-20,y:ea+30}).on("click",V).attr({align:"right",zIndex:20}).add();p[q]=w}},remove:function(q){pc(p[q].element);p[q]=null}}}function e(p){function q(){var B=this.points||zc(this),D=B[0].series.xAxis,ca=this.x;D=D&&D.options.type==="datetime";var la=Sb(ca)||D,qa;qa=la?['<span style="font-size: 10px">'+(D?Zc("%A, %b %e, %Y",
ca):ca)+"</span>"]:[];u(B,function(ya){qa.push(ya.point.tooltipFormatter(la))});return qa.join("<br/>")}function w(B,D){L=xa?B:(2*L+B)/3;s=xa?D:(s+D)/2;o.translate(L,s);rd=bb(B-L)>1||bb(D-s)>1?function(){w(B,D)}:null}function x(){if(!xa){var B=l.hoverPoints;o.hide();u(da,function(D){D&&D.hide()});B&&u(B,function(D){D.setState()});l.hoverPoints=null;xa=true}}var V,N=p.borderWidth,ta=p.crosshairs,da=[],Ma=p.style,za=p.shared,eb=ja(Ma.padding),ab=N+eb,xa=true,Oa,R,L=0,s=0;Ma.padding=0;var o=ga.g("tooltip").attr({zIndex:8}).add(),
I=ga.rect(ab,ab,0,0,p.borderRadius,N).attr({fill:p.backgroundColor,"stroke-width":N}).add(o).shadow(p.shadow),ba=ga.text("",eb+ab,ja(Ma.fontSize)+eb+ab,p.useHTML).attr({zIndex:1}).css(Ma).add(o);o.hide();return{shared:za,refresh:function(B){var D,ca,la,qa=0,ya={},fb=[];la=B.tooltipPos;D=p.formatter||q;ya=l.hoverPoints;if(za){ya&&u(ya,function(Hb){Hb.setState()});l.hoverPoints=B;u(B,function(Hb){Hb.setState(Bb);qa+=Hb.plotY;fb.push(Hb.getLabelConfig())});ca=B[0].plotX;qa=W(qa)/B.length;ya={x:B[0].category};
ya.points=fb;B=B[0]}else ya=B.getLabelConfig();ya=D.call(ya);V=B.series;ca=za?ca:B.plotX;qa=za?qa:B.plotY;D=W(la?la[0]:va?Da-qa:ca);ca=W(la?la[1]:va?Aa-ca:qa);la=za||!B.series.isCartesian||gc(D,ca);if(ya===false||!la)x();else{if(xa){o.show();xa=false}ba.attr({text:ya});la=ba.getBBox();Oa=la.width+2*eb;R=la.height+2*eb;I.attr({width:Oa,height:R,stroke:p.borderColor||B.color||V.color||"#606060"});D=fe(Oa,R,X,ea,Da,Aa,{x:D,y:ca});w(W(D.x-ab),W(D.y-ab))}if(ta){ta=zc(ta);for(D=ta.length;D--;){ca=B.series[D?
"yAxis":"xAxis"];if(ta[D]&&ca){ca=ca.getPlotLinePath(B[D?"y":"x"],1);if(da[D])da[D].attr({d:ca,visibility:Ab});else{la={"stroke-width":ta[D].width||1,stroke:ta[D].color||"#C0C0C0",zIndex:2};if(ta[D].dashStyle)la.dashstyle=ta[D].dashStyle;da[D]=ga.path(ca).attr(la).add()}}}}},hide:x,destroy:function(){u(da,function(B){B&&B.destroy()});u([I,ba,o],function(B){B&&B.destroy()});I=ba=o=null}}}function f(p){function q(L){var s,o=Ud&&ua.width/ua.body.scrollWidth-1,I,ba,B;L=L||db.event;if(!L.target)L.target=
L.srcElement;s=L.touches?L.touches.item(0):L;if(L.type!=="mousemove"||db.opera||o){Jb=Fd(oa);I=Jb.left;ba=Jb.top}if(Pc){B=L.x;s=L.y}else if(s.layerX===Wa){B=s.pageX-I;s=s.pageY-ba}else{B=L.layerX;s=L.layerY}if(o){B+=W((o+1)*I-I);s+=W((o+1)*ba-ba)}return sa(L,{chartX:B,chartY:s})}function w(L){var s={xAxis:[],yAxis:[]};u(Va,function(o){var I=o.translate,ba=o.isXAxis;s[ba?"xAxis":"yAxis"].push({axis:o,value:I((va?!ba:ba)?L.chartX-X:Aa-L.chartY+ea,true)})});return s}function x(){var L=l.hoverSeries,
s=l.hoverPoint;s&&s.onMouseOut();L&&L.onMouseOut();hc&&hc.hide();sd=null}function V(){if(za){var L={xAxis:[],yAxis:[]},s=za.getBBox(),o=s.x-X,I=s.y-ea;if(Ma){u(Va,function(ba){var B=ba.translate,D=ba.isXAxis,ca=va?!D:D,la=B(ca?o:Aa-I-s.height,true,0,0,1);B=B(ca?o+s.width:Aa-I,true,0,0,1);L[D?"xAxis":"yAxis"].push({axis:ba,min:tb(la,B),max:Ia(la,B)})});Pa(l,"selection",L,td)}za=za.destroy()}l.mouseIsDown=ud=Ma=false;pb(ua,Kb?"touchend":"mouseup",V)}function N(L){var s=K(L.pageX)?L.pageX:L.page.x;L=
K(L.pageX)?L.pageY:L.page.y;Jb&&!gc(s-Jb.left-X,L-Jb.top-ea)&&x()}var ta,da,Ma,za,eb=z.zoomType,ab=/x/.test(eb),xa=/y/.test(eb),Oa=ab&&!va||xa&&va,R=xa&&!va||ab&&va;bd=function(){if(Ec){Ec.translate(X,ea);va&&Ec.attr({width:l.plotWidth,height:l.plotHeight}).invert()}else l.trackerGroup=Ec=ga.g("tracker").attr({zIndex:9}).add()};bd();if(p.enabled)l.tooltip=hc=e(p);(function(){oa.onmousedown=function(s){s=q(s);!Kb&&s.preventDefault&&s.preventDefault();l.mouseIsDown=ud=true;ta=s.chartX;da=s.chartY;Qa(ua,
Kb?"touchend":"mouseup",V)};var L=function(s){if(!(s&&s.touches&&s.touches.length>1)){s=q(s);if(!Kb)s.returnValue=false;var o=s.chartX,I=s.chartY,ba=!gc(o-X,I-ea);Jb||(Jb=Fd(oa));if(Kb&&s.type==="touchstart")if(Ga(s.target,"isTracker"))l.runTrackerClick||s.preventDefault();else!ke&&!ba&&s.preventDefault();if(ba){if(o<X)o=X;else if(o>X+Da)o=X+Da;if(I<ea)I=ea;else if(I>ea+Aa)I=ea+Aa}if(ud&&s.type!=="touchstart"){Ma=Math.sqrt(Math.pow(ta-o,2)+Math.pow(da-I,2));if(Ma>10){if(sc&&(ab||xa)&&gc(ta-X,da-ea))za||
(za=ga.rect(X,ea,Oa?1:Da,R?1:Aa,0).attr({fill:z.selectionMarkerFill||"rgba(69,114,167,0.25)",zIndex:7}).add());if(za&&Oa){o=o-ta;za.attr({width:bb(o),x:(o>0?0:o)+ta})}if(za&&R){I=I-da;za.attr({height:bb(I),y:(I>0?0:I)+da})}}}else if(!ba){var B;I=l.hoverPoint;o=l.hoverSeries;var D,ca,la=$a,qa=va?s.chartY:s.chartX-X;if(hc&&p.shared){B=[];D=Ha.length;for(ca=0;ca<D;ca++)if(Ha[ca].visible&&Ha[ca].tooltipPoints.length){s=Ha[ca].tooltipPoints[qa];s._dist=bb(qa-s.plotX);la=tb(la,s._dist);B.push(s)}for(D=
B.length;D--;)B[D]._dist>la&&B.splice(D,1);if(B.length&&B[0].plotX!==sd){hc.refresh(B);sd=B[0].plotX}}if(o&&o.tracker)(s=o.tooltipPoints[qa])&&s!==I&&s.onMouseOver()}return ba||!sc}};oa.onmousemove=L;Qa(oa,"mouseleave",x);Qa(ua,"mousemove",N);oa.ontouchstart=function(s){if(ab||xa)oa.onmousedown(s);L(s)};oa.ontouchmove=L;oa.ontouchend=function(){Ma&&x()};oa.onclick=function(s){var o=l.hoverPoint;s=q(s);s.cancelBubble=true;if(!Ma)if(o&&Ga(s.target,"isTracker")){var I=o.plotX,ba=o.plotY;sa(o,{pageX:Jb.left+
X+(va?Da-ba:I),pageY:Jb.top+ea+(va?Aa-I:ba)});Pa(o.series,"click",sa(s,{point:o}));o.firePointEvent("click",s)}else{sa(s,w(s));gc(s.chartX-X,s.chartY-ea)&&Pa(l,"click",s)}Ma=false}})();Vd=setInterval(function(){rd&&rd()},32);sa(this,{zoomX:ab,zoomY:xa,resetTracker:x,destroy:function(){if(l.trackerGroup)l.trackerGroup=Ec=l.trackerGroup.destroy();pb(ua,"mousemove",N);oa.onclick=oa.onmousedown=oa.onmousemove=oa.ontouchstart=oa.ontouchend=oa.ontouchmove=null}})}function g(p){var q=p.type||z.type||z.defaultSeriesType,
w=wb[q],x=l.hasRendered;if(x)if(va&&q==="column")w=wb.bar;else if(!va&&q==="bar")w=wb.column;q=new w;q.init(l,p);if(!x&&q.inverted)va=true;if(q.isCartesian)sc=q.isCartesian;Ha.push(q);return q}function h(){z.alignTicks!==false&&u(Va,function(p){p.adjustTickAmount()});Ob=null}function i(p){var q=l.isDirtyLegend,w,x=l.isDirtyBox,V=Ha.length,N=V,ta=l.clipRect;for(oc(p,l);N--;){p=Ha[N];if(p.isDirty&&p.options.stacking){w=true;break}}if(w)for(N=V;N--;){p=Ha[N];if(p.options.stacking)p.isDirty=true}u(Ha,
function(da){if(da.isDirty){da.cleanData();da.getSegments();if(da.options.legendType==="point")q=true}});if(q&&Fc.renderLegend){Fc.renderLegend();l.isDirtyLegend=false}if(sc){if(!cd){Ob=null;u(Va,function(da){da.setScale()})}h();Gc();u(Va,function(da){if(da.isDirty||x){da.redraw();x=true}})}if(x){vd();bd();if(ta){Hc(ta);ta.animate({width:l.plotSizeX,height:l.plotSizeY})}}u(Ha,function(da){if(da.isDirty&&da.visible&&(!da.isCartesian||da.xAxis))da.redraw()});Yb&&Yb.resetTracker&&Yb.resetTracker();Pa(l,
"redraw")}function j(){var p=a.xAxis||{},q=a.yAxis||{},w;p=zc(p);u(p,function(x,V){x.index=V;x.isX=true});q=zc(q);u(q,function(x,V){x.index=V});Va=p.concat(q);l.xAxis=[];l.yAxis=[];Va=tc(Va,function(x){w=new c(x);l[w.isXAxis?"xAxis":"yAxis"].push(w);return w});h()}function m(p,q){uc=Ca(a.title,p);Ic=Ca(a.subtitle,q);u([["title",p,uc],["subtitle",q,Ic]],function(w){var x=w[0],V=l[x],N=w[1];w=w[2];if(V&&N)V=V.destroy();if(w&&w.text&&!V)l[x]=ga.text(w.text,0,0,w.useHTML).attr({align:w.align,"class":"highcharts-"+
x,zIndex:1}).css(w.style).add().align(w,false,Rb)})}function v(){qb=z.renderTo;Wd=vc+wd++;if(Sb(qb))qb=ua.getElementById(qb);qb.innerHTML="";if(!qb.offsetWidth){Zb=qb.cloneNode(0);Ja(Zb,{position:ic,top:"-9999px",display:""});ua.body.appendChild(Zb)}dd=(Zb||qb).offsetWidth;Jc=(Zb||qb).offsetHeight;l.chartWidth=$a=z.width||dd||600;l.chartHeight=cb=z.height||(Jc>19?Jc:400);l.container=oa=hb(Tb,{className:"highcharts-container"+(z.className?" "+z.className:""),id:Wd},sa({position:Xd,overflow:ob,width:$a+
Ua,height:cb+Ua,textAlign:"left"},z.style),Zb||qb);l.renderer=ga=z.forExport?new ed(oa,$a,cb,true):new fd(oa,$a,cb);var p,q;if(Yd&&oa.getBoundingClientRect){p=function(){Ja(oa,{left:0,top:0});q=oa.getBoundingClientRect();Ja(oa,{left:-(q.left-ja(q.left))+Ua,top:-(q.top-ja(q.top))+Ua})};p();Qa(db,"resize",p);Qa(l,"destroy",function(){pb(db,"resize",p)})}}function P(){function p(){var w=z.width||qb.offsetWidth,x=z.height||qb.offsetHeight;if(w&&x){if(w!==dd||x!==Jc){clearTimeout(q);q=setTimeout(function(){xd(w,
x,false)},100)}dd=w;Jc=x}}var q;Qa(db,"resize",p);Qa(l,"destroy",function(){pb(db,"resize",p)})}function T(){Pa(l,"endResize",null,function(){cd-=1})}function Y(){var p=a.labels,q=a.credits,w;m();Fc=l.legend=new le;Gc();u(Va,function(x){x.setTickPositions(true)});h();Gc();vd();sc&&u(Va,function(x){x.render()});if(!l.seriesGroup)l.seriesGroup=ga.g("series-group").attr({zIndex:3}).add();u(Ha,function(x){x.translate();x.setTooltipPoints();x.render()});p.items&&u(p.items,function(){var x=sa(p.style,this.style),
V=ja(x.left)+X,N=ja(x.top)+ea+12;delete x.left;delete x.top;ga.text(this.html,V,N).attr({zIndex:2}).css(x).add()});if(!l.toolbar)l.toolbar=d();if(q.enabled&&!l.credits){w=q.href;l.credits=ga.text(q.text,0,0).on("click",function(){if(w)location.href=w}).attr({align:q.position.align,zIndex:8}).css(q.style).add().align(q.position)}bd();l.hasRendered=true;if(Zb){qb.appendChild(oa);pc(Zb)}}function H(){var p,q=oa&&oa.parentNode;if(l!==null){Pa(l,"destroy");pb(db,"unload",H);pb(l);for(p=Va.length;p--;)Va[p]=
Va[p].destroy();for(p=Ha.length;p--;)Ha[p]=Ha[p].destroy();u(["title","subtitle","seriesGroup","clipRect","credits","tracker"],function(w){var x=l[w];if(x)l[w]=x.destroy()});u([wc,xc,Kc,Fc,hc,ga,Yb],function(w){w&&w.destroy&&w.destroy()});wc=xc=Kc=Fc=hc=ga=Yb=null;if(oa){oa.innerHTML="";pb(oa);q&&pc(oa);oa=null}clearInterval(Vd);for(p in l)delete l[p];l=null}}function U(){if(!Lc&&db==db.top&&ua.readyState!=="complete")ua.attachEvent("onreadystatechange",function(){ua.detachEvent("onreadystatechange",
U);ua.readyState==="complete"&&U()});else{v();yd();zd();u(a.series||[],function(p){g(p)});l.inverted=va=A(va,a.chart.inverted);j();l.render=Y;l.tracker=Yb=new f(a.tooltip);Y();Pa(l,"load");b&&b.apply(l,[l]);u(l.callbacks,function(p){p.apply(l,[l])})}}Yc=Ca(Yc,Xa.xAxis);od=Ca(od,Xa.yAxis);Xa.xAxis=Xa.yAxis=null;a=Ca(Xa,a);var z=a.chart,M=z.margin;M=Nb(M)?M:[M,M,M,M];var y=A(z.marginTop,M[0]),C=A(z.marginRight,M[1]),Z=A(z.marginBottom,M[2]),Sa=A(z.marginLeft,M[3]),Na=z.spacingTop,Ea=z.spacingRight,
gb=z.spacingBottom,Lb=z.spacingLeft,Rb,uc,Ic,ea,Ib,vb,X,Xb,qb,Zb,oa,Wd,dd,Jc,$a,cb,qd,ad,wc,Kc,Ad,xc,l=this,ke=(M=z.events)&&!!M.click,Bd,gc,hc,ud,jc,Zd,Cd,Aa,Da,Yb,Ec,bd,Fc,$b,ac,Jb,sc=z.showAxes,cd=0,Va=[],Ob,Ha=[],va,ga,rd,Vd,sd,vd,Gc,yd,zd,xd,td,$d,le=function(){function p(G,ha){var na=G.legendItem,Ra=G.legendLine,La=G.legendSymbol,pa=Oa.color,wa=ha?N.itemStyle.color:pa,zb=ha?G.color:pa;pa=ha?G.pointAttr[ib]:{stroke:pa,fill:pa};na&&na.css({fill:wa});Ra&&Ra.attr({stroke:zb});La&&La.attr(pa)}function q(G,
ha,na){var Ra=G.legendItem,La=G.legendLine,pa=G.legendSymbol;G=G.checkbox;Ra&&Ra.attr({x:ha,y:na});La&&La.translate(ha,na-4);pa&&pa.attr({x:ha+pa.xOff,y:na+pa.yOff});if(G){G.x=ha;G.y=na}}function w(){u(za,function(G){var ha=G.checkbox,na=qa.alignAttr;ha&&Ja(ha,{left:na.translateX+G.legendItemWidth+ha.x-40+Ua,top:na.translateY+ha.y-11+Ua})})}function x(G){var ha,na,Ra,La,pa=G.legendItem;La=G.series||G;var wa=La.options,zb=wa&&wa.borderWidth||0;if(!pa){La=/^(bar|pie|area|column)$/.test(La.type);G.legendItem=
pa=ga.text(N.labelFormatter.call(G),0,0).css(G.visible?ab:Oa).on("mouseover",function(){G.setState(Bb);pa.css(xa)}).on("mouseout",function(){pa.css(G.visible?ab:Oa);G.setState()}).on("click",function(){var Gb=function(){G.setVisible()};G.firePointEvent?G.firePointEvent("legendItemClick",null,Gb):Pa(G,"legendItemClick",null,Gb)}).attr({zIndex:2}).add(qa);if(!La&&wa&&wa.lineWidth){var Vb={"stroke-width":wa.lineWidth,zIndex:2};if(wa.dashStyle)Vb.dashstyle=wa.dashStyle;G.legendLine=ga.path([Za,-da-Ma,
0,Ka,-Ma,0]).attr(Vb).add(qa)}if(La)ha=ga.rect(na=-da-Ma,Ra=-11,da,12,2).attr({zIndex:3}).add(qa);else if(wa&&wa.marker&&wa.marker.enabled)ha=ga.symbol(G.symbol,na=-da/2-Ma,Ra=-4,wa.marker.radius).attr({zIndex:3}).add(qa);if(ha){ha.xOff=na+zb%2/2;ha.yOff=Ra+zb%2/2}G.legendSymbol=ha;p(G,G.visible);if(wa&&wa.showCheckbox){G.checkbox=hb("input",{type:"checkbox",checked:G.selected,defaultChecked:G.selected},N.itemCheckboxStyle,oa);Qa(G.checkbox,"click",function(Gb){Pa(G,"checkboxClick",{checked:Gb.target.checked},
function(){G.select()})})}}ha=pa.getBBox();na=G.legendItemWidth=N.itemWidth||da+Ma+ha.width+R;B=ha.height;if(ta&&o-s+na>(fb||$a-2*R-s)){o=s;I+=B}ba=I;q(G,o,I);if(ta)o+=na;else I+=B;ya=fb||Ia(ta?o-s:na,ya)}function V(){o=s;I=L;ba=ya=0;qa||(qa=ga.g("legend").attr({zIndex:7}).add());za=[];u(Hb,function(Ra){var La=Ra.options;if(La.showInLegend)za=za.concat(La.legendType==="point"?Ra.data:Ra)});Hd(za,function(Ra,La){return(Ra.options.legendIndex||0)-(La.options.legendIndex||0)});cc&&za.reverse();u(za,
x);$b=fb||ya;ac=ba-L+B;if(ca||la){$b+=2*R;ac+=2*R;if(D){if($b>0&&ac>0){D[D.isNew?"attr":"animate"](D.crisp(null,null,null,$b,ac));D.isNew=false}}else{D=ga.rect(0,0,$b,ac,N.borderRadius,ca||0).attr({stroke:N.borderColor,"stroke-width":ca||0,fill:la||jb}).add(qa).shadow(N.shadow);D.isNew=true}D[za.length?"show":"hide"]()}for(var G=["left","right","top","bottom"],ha,na=4;na--;){ha=G[na];if(eb[ha]&&eb[ha]!=="auto"){N[na<2?"align":"verticalAlign"]=ha;N[na<2?"x":"y"]=ja(eb[ha])*(na%2?-1:1)}}za.length&&
qa.align(sa(N,{width:$b,height:ac}),true,Rb);cd||w()}var N=l.options.legend;if(N.enabled){var ta=N.layout==="horizontal",da=N.symbolWidth,Ma=N.symbolPadding,za,eb=N.style,ab=N.itemStyle,xa=N.itemHoverStyle,Oa=N.itemHiddenStyle,R=ja(eb.padding),L=18,s=4+R+da+Ma,o,I,ba,B=0,D,ca=N.borderWidth,la=N.backgroundColor,qa,ya,fb=N.width,Hb=l.series,cc=N.reversed;V();Qa(l,"endResize",w);return{colorizeItem:p,destroyItem:function(G){var ha=G.checkbox;u(["legendItem","legendLine","legendSymbol"],function(na){G[na]&&
G[na].destroy()});ha&&pc(G.checkbox)},renderLegend:V,destroy:function(){if(D)D=D.destroy();if(qa)qa=qa.destroy()}}}};gc=function(p,q){return p>=0&&p<=Da&&q>=0&&q<=Aa};$d=function(){Pa(l,"selection",{resetSelection:true},td);l.toolbar.remove("zoom")};td=function(p){var q=Xa.lang,w=l.pointCount<100;l.toolbar.add("zoom",q.resetZoom,q.resetZoomTitle,$d);!p||p.resetSelection?u(Va,function(x){x.setExtremes(null,null,false,w)}):u(p.xAxis.concat(p.yAxis),function(x){var V=x.axis;if(l.tracker[V.isXAxis?"zoomX":
"zoomY"])V.setExtremes(x.min,x.max,false,w)});i()};Gc=function(){var p=a.legend,q=A(p.margin,10),w=p.x,x=p.y,V=p.align,N=p.verticalAlign,ta;yd();if((l.title||l.subtitle)&&!K(y))if(ta=Ia(l.title&&!uc.floating&&!uc.verticalAlign&&uc.y||0,l.subtitle&&!Ic.floating&&!Ic.verticalAlign&&Ic.y||0))ea=Ia(ea,ta+A(uc.margin,15)+Na);if(p.enabled&&!p.floating)if(V==="right")K(C)||(Ib=Ia(Ib,$b-w+q+Ea));else if(V==="left")K(Sa)||(X=Ia(X,$b+w+q+Lb));else if(N==="top")K(y)||(ea=Ia(ea,ac+x+q+Na));else if(N==="bottom")K(Z)||
(vb=Ia(vb,ac-x+q+gb));sc&&u(Va,function(da){da.getOffset()});K(Sa)||(X+=Xb[3]);K(y)||(ea+=Xb[0]);K(Z)||(vb+=Xb[2]);K(C)||(Ib+=Xb[1]);zd()};xd=function(p,q,w){var x=l.title,V=l.subtitle;cd+=1;oc(w,l);ad=cb;qd=$a;l.chartWidth=$a=W(p);l.chartHeight=cb=W(q);Ja(oa,{width:$a+Ua,height:cb+Ua});ga.setSize($a,cb,w);Da=$a-X-Ib;Aa=cb-ea-vb;Ob=null;u(Va,function(N){N.isDirty=true;N.setScale()});u(Ha,function(N){N.isDirty=true});l.isDirtyLegend=true;l.isDirtyBox=true;Gc();x&&x.align(null,null,Rb);V&&V.align(null,
null,Rb);i(w);ad=null;Pa(l,"resize");Bc===false?T():setTimeout(T,Bc&&Bc.duration||500)};zd=function(){l.plotLeft=X=W(X);l.plotTop=ea=W(ea);l.plotWidth=Da=W($a-X-Ib);l.plotHeight=Aa=W(cb-ea-vb);l.plotSizeX=va?Aa:Da;l.plotSizeY=va?Da:Aa;Rb={x:Lb,y:Na,width:$a-Lb-Ea,height:cb-Na-gb}};yd=function(){ea=A(y,Na);Ib=A(C,Ea);vb=A(Z,gb);X=A(Sa,Lb);Xb=[0,0,0,0]};vd=function(){var p=z.borderWidth||0,q=z.backgroundColor,w=z.plotBackgroundColor,x=z.plotBackgroundImage,V,N={x:X,y:ea,width:Da,height:Aa};V=p+(z.shadow?
8:0);if(p||q)if(wc)wc.animate(wc.crisp(null,null,null,$a-V,cb-V));else wc=ga.rect(V/2,V/2,$a-V,cb-V,z.borderRadius,p).attr({stroke:z.borderColor,"stroke-width":p,fill:q||jb}).add().shadow(z.shadow);if(w)if(Kc)Kc.animate(N);else Kc=ga.rect(X,ea,Da,Aa,0).attr({fill:w}).add().shadow(z.plotShadow);if(x)if(Ad)Ad.animate(N);else Ad=ga.image(x,X,ea,Da,Aa).add();if(z.plotBorderWidth)if(xc)xc.animate(xc.crisp(null,X,ea,Da,Aa));else xc=ga.rect(X,ea,Da,Aa,0,z.plotBorderWidth).attr({stroke:z.plotBorderColor,
"stroke-width":z.plotBorderWidth,zIndex:4}).add();l.isDirtyBox=false};Qa(db,"unload",H);z.reflow!==false&&Qa(l,"load",P);if(M)for(Bd in M)Qa(l,Bd,M[Bd]);l.options=a;l.series=Ha;l.addSeries=function(p,q,w){var x;if(p){oc(w,l);q=A(q,true);Pa(l,"addSeries",{options:p},function(){x=g(p);x.isDirty=true;l.isDirtyLegend=true;q&&l.redraw()})}return x};l.animation=A(z.animation,true);l.destroy=H;l.get=function(p){var q,w,x;for(q=0;q<Va.length;q++)if(Va[q].options.id===p)return Va[q];for(q=0;q<Ha.length;q++)if(Ha[q].options.id===
p)return Ha[q];for(q=0;q<Ha.length;q++){x=Ha[q].data;for(w=0;w<x.length;w++)if(x[w].id===p)return x[w]}return null};l.getSelectedPoints=function(){var p=[];u(Ha,function(q){p=p.concat(Dd(q.data,function(w){return w.selected}))});return p};l.getSelectedSeries=function(){return Dd(Ha,function(p){return p.selected})};l.hideLoading=function(){gd(jc,{opacity:0},{duration:a.loading.hideDuration,complete:function(){Ja(jc,{display:jb})}});Cd=false};l.isInsidePlot=gc;l.redraw=i;l.setSize=xd;l.setTitle=m;l.showLoading=
function(p){var q=a.loading;if(!jc){jc=hb(Tb,{className:"highcharts-loading"},sa(q.style,{left:X+Ua,top:ea+Ua,width:Da+Ua,height:Aa+Ua,zIndex:10,display:jb}),oa);Zd=hb("span",null,q.labelStyle,jc)}Zd.innerHTML=p||a.lang.loading;if(!Cd){Ja(jc,{opacity:0,display:""});gd(jc,{opacity:q.style.opacity},{duration:q.showDuration});Cd=true}};l.pointCount=0;l.counters=new Gd;U()}var ua=document,db=window,Fa=Math,W=Fa.round,lb=Fa.floor,md=Fa.ceil,Ia=Fa.max,tb=Fa.min,bb=Fa.abs,rb=Fa.cos,Cb=Fa.sin,kc=Fa.PI,ae=
kc*2/360,yc=navigator.userAgent,Pc=/msie/i.test(yc)&&!db.opera,Mc=ua.documentMode===8,Ud=/AppleWebKit/.test(yc),Yd=/Firefox/.test(yc),Lc=!!ua.createElementNS&&!!ua.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,me=Yd&&parseInt(yc.split("Firefox/")[1],10)<4,fd,Kb=ua.documentElement.ontouchstart!==undefined,be={},wd=0,ub=1,Tc,Xa,Zc,Bc,Nc,Wa,Tb="div",ic="absolute",Xd="relative",ob="hidden",vc="highcharts-",Ab="visible",Ua="px",jb="none",Za="M",Ka="L",ce="rgba(192,192,192,"+(Lc?1.0E-6:
0.0020)+")",ib="",Bb="hover",Qc,id,jd,kd,Cc,Rc,Sc,Jd,Kd,ld,Ld,Md,ma=db.HighchartsAdapter,Db=ma||{},u=Db.each,Dd=Db.grep,tc=Db.map,Ca=Db.merge,Qa=Db.addEvent,pb=Db.removeEvent,Pa=Db.fireEvent,gd=Db.animate,Hc=Db.stop,wb={};Zc=function(a,b,c){function d(P){return P.toString().replace(/^([0-9])$/,"0$1")}if(!K(b)||isNaN(b))return"Invalid date";a=A(a,"%Y-%m-%d %H:%M:%S");b=new Date(b*ub);var e,f=b[jd](),g=b[kd](),h=b[Cc](),i=b[Rc](),j=b[Sc](),m=Xa.lang,v=m.weekdays;b={a:v[g].substr(0,3),A:v[g],d:d(h),
e:h,b:m.shortMonths[i],B:m.months[i],m:d(i+1),y:j.toString().substr(2,2),Y:j,H:d(f),I:d(f%12||12),l:f%12||12,M:d(b[id]()),p:f<12?"AM":"PM",P:f<12?"am":"pm",S:d(b.getSeconds())};for(e in b)a=a.replace("%"+e,b[e]);return c?a.substr(0,1).toUpperCase()+a.substr(1):a};Gd.prototype={wrapColor:function(a){if(this.color>=a)this.color=0},wrapSymbol:function(a){if(this.symbol>=a)this.symbol=0}};Nc={init:function(a,b,c){b=b||"";var d=a.shift,e=b.indexOf("C")>-1,f=e?7:3,g;b=b.split(" ");c=[].concat(c);var h,
i,j=function(m){for(g=m.length;g--;)m[g]===Za&&m.splice(g+1,0,m[g+1],m[g+2],m[g+1],m[g+2])};if(e){j(b);j(c)}if(a.isArea){h=b.splice(b.length-6,6);i=c.splice(c.length-6,6)}if(d){c=[].concat(c).splice(0,f).concat(c);a.shift=false}if(b.length)for(a=c.length;b.length<a;){d=[].concat(b).splice(b.length-f,f);if(e){d[f-6]=d[f-2];d[f-5]=d[f-1]}b=b.concat(d)}if(h){b=b.concat(h);c=c.concat(i)}return[b,c]},step:function(a,b,c,d){var e=[],f=a.length;if(c===1)e=d;else if(f===b.length&&c<1)for(;f--;){d=parseFloat(a[f]);
e[f]=isNaN(d)?a[f]:c*parseFloat(b[f]-d)+d}else e=b;return e}};ma&&ma.init&&ma.init(Nc);if(!ma&&db.jQuery){var Mb=jQuery;u=function(a,b){for(var c=0,d=a.length;c<d;c++)if(b.call(a[c],a[c],c,a)===false)return c};Dd=Mb.grep;tc=function(a,b){for(var c=[],d=0,e=a.length;d<e;d++)c[d]=b.call(a[d],a[d],d,a);return c};Ca=function(){var a=arguments;return Mb.extend(true,null,a[0],a[1],a[2],a[3])};Qa=function(a,b,c){Mb(a).bind(b,c)};pb=function(a,b,c){var d=ua.removeEventListener?"removeEventListener":"detachEvent";
if(ua[d]&&!a[d])a[d]=function(){};Mb(a).unbind(b,c)};Pa=function(a,b,c,d){var e=Mb.Event(b),f="detached"+b;sa(e,c);if(a[b]){a[f]=a[b];a[b]=null}Mb(a).trigger(e);if(a[f]){a[b]=a[f];a[f]=null}d&&!e.isDefaultPrevented()&&d(e)};gd=function(a,b,c){var d=Mb(a);if(b.d){a.toD=b.d;b.d=1}d.stop();d.animate(b,c)};Hc=function(a){Mb(a).stop()};Mb.extend(Mb.easing,{easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c}});var de=jQuery.fx,ee=de.step;u(["cur","_default","width","height"],function(a,b){var c=b?
ee:de.prototype,d=c[a],e;if(d)c[a]=function(f){f=b?f:this;e=f.elem;return e.attr?e.attr(f.prop,f.now):d.apply(this,arguments)}});ee.d=function(a){var b=a.elem;if(!a.started){var c=Nc.init(b,b.d,b.toD);a.start=c[0];a.end=c[1];a.started=true}b.attr("d",Nc.step(a.start,a.end,a.pos,b.toD))}}ma={enabled:true,align:"center",x:0,y:15,style:{color:"#666",fontSize:"11px",lineHeight:"14px"}};Xa={colors:["#4572A7","#AA4643","#89A54E","#80699B","#3D96AE","#DB843D","#92A8CD","#A47D7C","#B5CA92"],symbols:["circle",
"diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","June","Jul","Aug","Sep","Oct","Nov","Dec"],weekdays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],decimalPoint:".",resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:","},global:{useUTC:true},chart:{borderColor:"#4572A7",
borderRadius:5,defaultSeriesType:"line",ignoreHiddenSeries:true,spacingTop:10,spacingRight:10,spacingBottom:15,spacingLeft:10,style:{fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',fontSize:"12px"},backgroundColor:"#FFFFFF",plotBorderColor:"#C0C0C0"},title:{text:"Chart title",align:"center",y:15,style:{color:"#3E576F",fontSize:"16px"}},subtitle:{text:"",align:"center",y:30,style:{color:"#6D869F"}},plotOptions:{line:{allowPointSelect:false,showCheckbox:false,
animation:{duration:1E3},events:{},lineWidth:2,shadow:true,marker:{enabled:true,lineWidth:0,radius:4,lineColor:"#FFFFFF",states:{hover:{},select:{fillColor:"#FFFFFF",lineColor:"#000000",lineWidth:2}}},point:{events:{}},dataLabels:Ca(ma,{enabled:false,y:-6,formatter:function(){return this.y}}),showInLegend:true,states:{hover:{marker:{}},select:{marker:{}}},stickyTracking:true}},labels:{style:{position:ic,color:"#3E576F"}},legend:{enabled:true,align:"center",layout:"horizontal",labelFormatter:function(){return this.name},
borderWidth:1,borderColor:"#909090",borderRadius:5,shadow:false,style:{padding:"5px"},itemStyle:{cursor:"pointer",color:"#3E576F"},itemHoverStyle:{cursor:"pointer",color:"#000000"},itemHiddenStyle:{color:"#C0C0C0"},itemCheckboxStyle:{position:ic,width:"13px",height:"13px"},symbolWidth:16,symbolPadding:5,verticalAlign:"bottom",x:0,y:0},loading:{hideDuration:100,labelStyle:{fontWeight:"bold",position:Xd,top:"1em"},showDuration:100,style:{position:ic,backgroundColor:"white",opacity:0.5,textAlign:"center"}},
tooltip:{enabled:true,backgroundColor:"rgba(255, 255, 255, .85)",borderWidth:2,borderRadius:5,shadow:true,snap:Kb?25:10,style:{color:"#333333",fontSize:"12px",padding:"5px",whiteSpace:"nowrap"}},toolbar:{itemStyle:{color:"#4572A7",cursor:"pointer"}},credits:{enabled:true,text:"Highcharts.com",href:"http://www.highcharts.com",position:{align:"right",x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",color:"#909090",fontSize:"10px"}}};var Yc={dateTimeLabelFormats:{second:"%H:%M:%S",minute:"%H:%M",
hour:"%H:%M",day:"%e. %b",week:"%e. %b",month:"%b '%y",year:"%Y"},endOnTick:false,gridLineColor:"#C0C0C0",labels:ma,lineColor:"#C0D0E0",lineWidth:1,max:null,min:null,minPadding:0.01,maxPadding:0.01,minorGridLineColor:"#E0E0E0",minorGridLineWidth:1,minorTickColor:"#A0A0A0",minorTickLength:2,minorTickPosition:"outside",startOfWeek:1,startOnTick:false,tickColor:"#C0D0E0",tickLength:5,tickmarkPlacement:"between",tickPixelInterval:100,tickPosition:"outside",tickWidth:1,title:{align:"middle",style:{color:"#6D869F",
fontWeight:"bold"}},type:"linear"},od=Ca(Yc,{endOnTick:true,gridLineWidth:1,tickPixelInterval:72,showLastLabel:true,labels:{align:"right",x:-8,y:3},lineWidth:0,maxPadding:0.05,minPadding:0.05,startOnTick:true,tickWidth:0,title:{rotation:270,text:"Y-values"},stackLabels:{enabled:false,formatter:function(){return this.total},style:ma.style}}),ie={labels:{align:"right",x:-8,y:null},title:{rotation:270}},he={labels:{align:"left",x:8,y:null},title:{rotation:90}},Td={labels:{align:"center",x:0,y:14},title:{rotation:0}},
ge=Ca(Td,{labels:{y:-5}}),xb=Xa.plotOptions;ma=xb.line;xb.spline=Ca(ma);xb.scatter=Ca(ma,{lineWidth:0,states:{hover:{lineWidth:0}}});xb.area=Ca(ma,{});xb.areaspline=Ca(xb.area);xb.column=Ca(ma,{borderColor:"#FFFFFF",borderWidth:1,borderRadius:0,groupPadding:0.2,marker:null,pointPadding:0.1,minPointLength:0,states:{hover:{brightness:0.1,shadow:false},select:{color:"#C0C0C0",borderColor:"#000000",shadow:false}},dataLabels:{y:null,verticalAlign:null}});xb.bar=Ca(xb.column,{dataLabels:{align:"left",x:5,
y:0}});xb.pie=Ca(ma,{borderColor:"#FFFFFF",borderWidth:1,center:["50%","50%"],colorByPoint:true,dataLabels:{distance:30,enabled:true,formatter:function(){return this.point.name},y:5},legendType:"point",marker:null,size:"75%",showInLegend:false,slicedOffset:10,states:{hover:{brightness:0.1,shadow:false}}});Id();var bc=function(a){var b=[],c;(function(d){if(c=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/.exec(d))b=[ja(c[1]),ja(c[2]),ja(c[3]),parseFloat(c[4],
10)];else if(c=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(d))b=[ja(c[1],16),ja(c[2],16),ja(c[3],16),1]})(a);return{get:function(d){return b&&!isNaN(b[0])?d==="rgb"?"rgb("+b[0]+","+b[1]+","+b[2]+")":d==="a"?b[3]:"rgba("+b.join(",")+")":a},brighten:function(d){if(lc(d)&&d!==0){var e;for(e=0;e<3;e++){b[e]+=ja(d*255);if(b[e]<0)b[e]=0;if(b[e]>255)b[e]=255}}return this},setOpacity:function(d){b[3]=d;return this}}};Uc.prototype={init:function(a,b){this.element=ua.createElementNS("http://www.w3.org/2000/svg",
b);this.renderer=a},animate:function(a,b,c){if(b=A(b,Bc,true)){b=Ca(b);if(c)b.complete=c;gd(this,a,b)}else{this.attr(a);c&&c()}},attr:function(a,b){var c,d,e,f,g=this.element,h=g.nodeName,i=this.renderer,j,m=this.shadows,v=this.htmlNode,P,T=this;if(Sb(a)&&K(b)){c=a;a={};a[c]=b}if(Sb(a)){c=a;if(h==="circle")c={x:"cx",y:"cy"}[c]||c;else if(c==="strokeWidth")c="stroke-width";T=Ga(g,c)||this[c]||0;if(c!=="d"&&c!=="visibility")T=parseFloat(T)}else for(c in a){j=false;d=a[c];if(c==="d"){if(d&&d.join)d=
d.join(" ");if(/(NaN| {2}|^$)/.test(d))d="M 0 0";this.d=d}else if(c==="x"&&h==="text"){for(e=0;e<g.childNodes.length;e++){f=g.childNodes[e];Ga(f,"x")===Ga(g,"x")&&Ga(f,"x",d)}if(this.rotation)Ga(g,"transform","rotate("+this.rotation+" "+d+" "+ja(a.y||Ga(g,"y"))+")")}else if(c==="fill")d=i.color(d,g,c);else if(h==="circle"&&(c==="x"||c==="y"))c={x:"cx",y:"cy"}[c]||c;else if(c==="translateX"||c==="translateY"||c==="rotation"||c==="verticalAlign"){this[c]=d;this.updateTransform();j=true}else if(c===
"stroke")d=i.color(d,g,c);else if(c==="dashstyle"){c="stroke-dasharray";d=d&&d.toLowerCase();if(d==="solid")d=jb;else if(d){d=d.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(e=d.length;e--;)d[e]=ja(d[e])*a["stroke-width"];d=d.join(",")}}else if(c==="isTracker")this[c]=d;else if(c==="width")d=ja(d);else if(c===
"align"){c="text-anchor";d={left:"start",center:"middle",right:"end"}[d]}else if(c==="title"){e=ua.createElementNS("http://www.w3.org/2000/svg","title");e.appendChild(ua.createTextNode(d));g.appendChild(e)}if(c==="strokeWidth")c="stroke-width";if(Ud&&c==="stroke-width"&&d===0)d=1.0E-6;if(this.symbolName&&/^(x|y|r|start|end|innerR)/.test(c)){if(!P){this.symbolAttr(a);P=true}j=true}if(m&&/^(width|height|visibility|x|y|d)$/.test(c))for(e=m.length;e--;)Ga(m[e],c,d);if((c==="width"||c==="height")&&h===
"rect"&&d<0)d=0;if(c==="text"){this.textStr=d;this.added&&i.buildText(this)}else j||Ga(g,c,d);if(v&&(c==="x"||c==="y"||c==="translateX"||c==="translateY"||c==="visibility")){e=v.length?v:[this];f=e.length;var Y;for(Y=0;Y<f;Y++){v=e[Y];j=v.getBBox();v=v.htmlNode;Ja(v,sa(this.styles,{left:j.x+(this.translateX||0)+Ua,top:j.y+(this.translateY||0)+Ua}));c==="visibility"&&Ja(v,{visibility:d})}}}return T},symbolAttr:function(a){var b=this;u(["x","y","r","start","end","width","height","innerR"],function(c){b[c]=
A(a[c],b[c])});b.attr({d:b.renderer.symbols[b.symbolName](W(b.x*2)/2,W(b.y*2)/2,b.r,{start:b.start,end:b.end,width:b.width,height:b.height,innerR:b.innerR})})},clip:function(a){return this.attr("clip-path","url("+this.renderer.url+"#"+a.id+")")},crisp:function(a,b,c,d,e){var f,g={},h={},i;a=a||this.strokeWidth||0;i=a%2/2;h.x=lb(b||this.x||0)+i;h.y=lb(c||this.y||0)+i;h.width=lb((d||this.width||0)-2*i);h.height=lb((e||this.height||0)-2*i);h.strokeWidth=a;for(f in h)if(this[f]!==h[f])this[f]=g[f]=h[f];
return g},css:function(a){var b=this.element;b=a&&a.width&&b.nodeName==="text";var c,d="",e=function(f,g){return"-"+g.toLowerCase()};if(a&&a.color)a.fill=a.color;this.styles=a=sa(this.styles,a);if(Pc&&!Lc){b&&delete a.width;Ja(this.element,a)}else{for(c in a)d+=c.replace(/([A-Z])/g,e)+":"+a[c]+";";this.attr({style:d})}b&&this.added&&this.renderer.buildText(this);return this},on:function(a,b){var c=b;if(Kb&&a==="click"){a="touchstart";c=function(d){d.preventDefault();b()}}this.element["on"+a]=c;return this},
translate:function(a,b){return this.attr({translateX:a,translateY:b})},invert:function(){this.inverted=true;this.updateTransform();return this},updateTransform:function(){var a=this.translateX||0,b=this.translateY||0,c=this.inverted,d=this.rotation,e=[];if(c){a+=this.attr("width");b+=this.attr("height")}if(a||b)e.push("translate("+a+","+b+")");if(c)e.push("rotate(90) scale(-1,1)");else d&&e.push("rotate("+d+" "+this.x+" "+this.y+")");e.length&&Ga(this.element,"transform",e.join(" "))},toFront:function(){var a=
this.element;a.parentNode.appendChild(a);return this},align:function(a,b,c){if(a){this.alignOptions=a;this.alignByTranslate=b;c||this.renderer.alignedObjects.push(this)}else{a=this.alignOptions;b=this.alignByTranslate}c=A(c,this.renderer);var d=a.align,e=a.verticalAlign,f=(c.x||0)+(a.x||0),g=(c.y||0)+(a.y||0),h={};if(/^(right|center)$/.test(d))f+=(c.width-(a.width||0))/{right:1,center:2}[d];h[b?"translateX":"x"]=W(f);if(/^(bottom|middle)$/.test(e))g+=(c.height-(a.height||0))/({bottom:1,middle:2}[e]||
1);h[b?"translateY":"y"]=W(g);this[this.placed?"animate":"attr"](h);this.placed=true;this.alignAttr=h;return this},getBBox:function(){var a,b,c,d=this.rotation,e=d*ae;try{a=sa({},this.element.getBBox())}catch(f){a={width:0,height:0}}b=a.width;c=a.height;if(d){a.width=bb(c*Cb(e))+bb(b*rb(e));a.height=bb(c*rb(e))+bb(b*Cb(e))}return a},show:function(){return this.attr({visibility:Ab})},hide:function(){return this.attr({visibility:ob})},add:function(a){var b=this.renderer,c=a||b,d=c.element||b.box,e=
d.childNodes,f=this.element,g=Ga(f,"zIndex");this.parentInverted=a&&a.inverted;this.textStr!==undefined&&b.buildText(this);if(a&&this.htmlNode){if(!a.htmlNode)a.htmlNode=[];a.htmlNode.push(this)}if(g){c.handleZ=true;g=ja(g)}if(c.handleZ)for(c=0;c<e.length;c++){a=e[c];b=Ga(a,"zIndex");if(a!==f&&(ja(b)>g||!K(g)&&K(b))){d.insertBefore(f,a);return this}}d.appendChild(f);this.added=true;return this},safeRemoveChild:function(a){var b=a.parentNode;b&&b.removeChild(a)},destroy:function(){var a=this,b=a.element||
{},c=a.shadows,d,e;b.onclick=b.onmouseout=b.onmouseover=b.onmousemove=null;Hc(a);if(a.clipPath)a.clipPath=a.clipPath.destroy();if(a.stops){for(e=0;e<a.stops.length;e++)a.stops[e]=a.stops[e].destroy();a.stops=null}a.safeRemoveChild(b);c&&u(c,function(f){a.safeRemoveChild(f)});nc(a.renderer.alignedObjects,a);for(d in a)delete a[d];return null},empty:function(){for(var a=this.element,b=a.childNodes,c=b.length;c--;)a.removeChild(b[c])},shadow:function(a,b){var c=[],d,e,f=this.element,g=this.parentInverted?
"(-1,-1)":"(1,1)";if(a){for(d=1;d<=3;d++){e=f.cloneNode(0);Ga(e,{isShadow:"true",stroke:"rgb(0, 0, 0)","stroke-opacity":0.05*d,"stroke-width":7-2*d,transform:"translate"+g,fill:jb});b?b.element.appendChild(e):f.parentNode.insertBefore(e,f);c.push(e)}this.shadows=c}return this}};var ed=function(){this.init.apply(this,arguments)};ed.prototype={Element:Uc,init:function(a,b,c,d){var e=location,f;f=this.createElement("svg").attr({xmlns:"http://www.w3.org/2000/svg",version:"1.1"});a.appendChild(f.element);
this.box=f.element;this.boxWrapper=f;this.alignedObjects=[];this.url=Pc?"":e.href.replace(/#.*?$/,"");this.defs=this.createElement("defs").add();this.forExport=d;this.gradients=[];this.setSize(b,c,false)},destroy:function(){var a,b=this.gradients,c=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();if(b){for(a=0;a<b.length;a++)this.gradients[a]=b[a].destroy();this.gradients=null}if(c)this.defs=c.destroy();return this.alignedObjects=null},createElement:function(a){var b=new this.Element;
b.init(this,a);return b},buildText:function(a){for(var b=a.element,c=A(a.textStr,"").toString().replace(/<(b|strong)>/g,'<span style="font-weight:bold">').replace(/<(i|em)>/g,'<span style="font-style:italic">').replace(/<a/g,"<span").replace(/<\/(b|strong|i|em|a)>/g,"</span>").split(/<br.*?>/g),d=b.childNodes,e=/style="([^"]+)"/,f=/href="([^"]+)"/,g=Ga(b,"x"),h=a.styles,i=h&&a.useHTML&&!this.forExport,j=a.htmlNode,m=h&&ja(h.width),v=h&&h.lineHeight,P,T=d.length;T--;)b.removeChild(d[T]);m&&!a.added&&
this.box.appendChild(b);u(c,function(Y,H){var U,z=0,M;Y=Y.replace(/<span/g,"|||<span").replace(/<\/span>/g,"</span>|||");U=Y.split("|||");u(U,function(y){if(y!==""||U.length===1){var C={},Z=ua.createElementNS("http://www.w3.org/2000/svg","tspan");e.test(y)&&Ga(Z,"style",y.match(e)[1].replace(/(;| |^)color([ :])/,"$1fill$2"));if(f.test(y)){Ga(Z,"onclick",'location.href="'+y.match(f)[1]+'"');Ja(Z,{cursor:"pointer"})}y=(y.replace(/<(.|\n)*?>/g,"")||" ").replace(/&lt;/g,"<").replace(/&gt;/g,">");Z.appendChild(ua.createTextNode(y));
if(z)C.dx=3;else C.x=g;if(!z){if(H){!Lc&&a.renderer.forExport&&Ja(Z,{display:"block"});M=db.getComputedStyle&&ja(db.getComputedStyle(P,null).getPropertyValue("line-height"));if(!M||isNaN(M))M=v||P.offsetHeight||18;Ga(Z,"dy",M)}P=Z}Ga(Z,C);b.appendChild(Z);z++;if(m){y=y.replace(/-/g,"- ").split(" ");for(var Sa,Na=[];y.length||Na.length;){Sa=b.getBBox().width;C=Sa>m;if(!C||y.length===1){y=Na;Na=[];if(y.length){Z=ua.createElementNS("http://www.w3.org/2000/svg","tspan");Ga(Z,{dy:v||16,x:g});b.appendChild(Z);
if(Sa>m)m=Sa}}else{Z.removeChild(Z.firstChild);Na.unshift(y.pop())}y.length&&Z.appendChild(ua.createTextNode(y.join(" ").replace(/- /g,"-")))}}}})});if(i){if(!j)j=a.htmlNode=hb("span",null,sa(h,{position:ic,top:0,left:0}),this.box.parentNode);j.innerHTML=a.textStr;for(T=d.length;T--;)d[T].style.visibility=ob}},crispLine:function(a,b){if(a[1]===a[4])a[1]=a[4]=W(a[1])+b%2/2;if(a[2]===a[5])a[2]=a[5]=W(a[2])+b%2/2;return a},path:function(a){return this.createElement("path").attr({d:a,fill:jb})},circle:function(a,
b,c){a=Nb(a)?a:{x:a,y:b,r:c};return this.createElement("circle").attr(a)},arc:function(a,b,c,d,e,f){if(Nb(a)){b=a.y;c=a.r;d=a.innerR;e=a.start;f=a.end;a=a.x}return this.symbol("arc",a||0,b||0,c||0,{innerR:d||0,start:e||0,end:f||0})},rect:function(a,b,c,d,e,f){if(Nb(a)){b=a.y;c=a.width;d=a.height;e=a.r;f=a.strokeWidth;a=a.x}e=this.createElement("rect").attr({rx:e,ry:e,fill:jb});return e.attr(e.crisp(f,a,b,Ia(c,0),Ia(d,0)))},setSize:function(a,b,c){var d=this.alignedObjects,e=d.length;this.width=a;
this.height=b;for(this.boxWrapper[A(c,true)?"animate":"attr"]({width:a,height:b});e--;)d[e].align()},g:function(a){var b=this.createElement("g");return K(a)?b.attr({"class":vc+a}):b},image:function(a,b,c,d,e){var f={preserveAspectRatio:jb};arguments.length>1&&sa(f,{x:b,y:c,width:d,height:e});f=this.createElement("image").attr(f);f.element.setAttributeNS?f.element.setAttributeNS("http://www.w3.org/1999/xlink","href",a):f.element.setAttribute("hc-svg-href",a);return f},symbol:function(a,b,c,d,e){var f,
g=this.symbols[a];g=g&&g(W(b),W(c),d,e);var h=/^url\((.*?)\)$/,i;if(g){f=this.path(g);sa(f,{symbolName:a,x:b,y:c,r:d});e&&sa(f,e)}else if(h.test(a)){var j=function(m,v){m.attr({width:v[0],height:v[1]}).translate(-W(v[0]/2),-W(v[1]/2))};i=a.match(h)[1];a=be[i];f=this.image(i).attr({x:b,y:c});if(a)j(f,a);else{f.attr({width:0,height:0});hb("img",{onload:function(){j(f,be[i]=[this.width,this.height])},src:i})}}else f=this.circle(b,c,d);return f},symbols:{square:function(a,b,c){c=0.707*c;return[Za,a-c,
b-c,Ka,a+c,b-c,a+c,b+c,a-c,b+c,"Z"]},triangle:function(a,b,c){return[Za,a,b-1.33*c,Ka,a+c,b+0.67*c,a-c,b+0.67*c,"Z"]},"triangle-down":function(a,b,c){return[Za,a,b+1.33*c,Ka,a-c,b-0.67*c,a+c,b-0.67*c,"Z"]},diamond:function(a,b,c){return[Za,a,b-c,Ka,a+c,b,a,b+c,a-c,b,"Z"]},arc:function(a,b,c,d){var e=d.start,f=d.end-1.0E-6,g=d.innerR,h=rb(e),i=Cb(e),j=rb(f);f=Cb(f);d=d.end-e<kc?0:1;return[Za,a+c*h,b+c*i,"A",c,c,0,d,1,a+c*j,b+c*f,Ka,a+g*j,b+g*f,"A",g,g,0,d,0,a+g*h,b+g*i,"Z"]}},clipRect:function(a,b,
c,d){var e=vc+wd++,f=this.createElement("clipPath").attr({id:e}).add(this.defs);a=this.rect(a,b,c,d,0).add(f);a.id=e;a.clipPath=f;return a},color:function(a,b,c){var d,e=/^rgba/;if(a&&a.linearGradient){var f=this;b=a.linearGradient;c=vc+wd++;var g,h,i;g=f.createElement("linearGradient").attr({id:c,gradientUnits:"userSpaceOnUse",x1:b[0],y1:b[1],x2:b[2],y2:b[3]}).add(f.defs);f.gradients.push(g);g.stops=[];u(a.stops,function(j){if(e.test(j[1])){d=bc(j[1]);h=d.get("rgb");i=d.get("a")}else{h=j[1];i=1}j=
f.createElement("stop").attr({offset:j[0],"stop-color":h,"stop-opacity":i}).add(g);g.stops.push(j)});return"url("+this.url+"#"+c+")"}else if(e.test(a)){d=bc(a);Ga(b,c+"-opacity",d.get("a"));return d.get("rgb")}else{b.removeAttribute(c+"-opacity");return a}},text:function(a,b,c,d){var e=Xa.chart.style;b=W(A(b,0));c=W(A(c,0));a=this.createElement("text").attr({x:b,y:c,text:a}).css({fontFamily:e.fontFamily,fontSize:e.fontSize});a.x=b;a.y=c;a.useHTML=d;return a}};fd=ed;if(!Lc){Db=yb(Uc,{init:function(a,
b){var c=["<",b,' filled="f" stroked="f"'],d=["position: ",ic,";"];if(b==="shape"||b===Tb)d.push("left:0;top:0;width:10px;height:10px;");if(Mc)d.push("visibility: ",b===Tb?ob:Ab);c.push(' style="',d.join(""),'"/>');if(b){c=b===Tb||b==="span"||b==="img"?c.join(""):a.prepVML(c);this.element=hb(c)}this.renderer=a},add:function(a){var b=this.renderer,c=this.element,d=b.box;d=a?a.element||a:d;a&&a.inverted&&b.invertChild(c,d);Mc&&d.gVis===ob&&Ja(c,{visibility:ob});d.appendChild(c);this.added=true;this.alignOnAdd&&
this.updateTransform();return this},attr:function(a,b){var c,d,e,f=this.element||{},g=f.style,h=f.nodeName,i=this.renderer,j=this.symbolName,m,v,P=this.shadows,T=this;if(Sb(a)&&K(b)){c=a;a={};a[c]=b}if(Sb(a)){c=a;T=c==="strokeWidth"||c==="stroke-width"?this.strokeweight:this[c]}else for(c in a){d=a[c];m=false;if(j&&/^(x|y|r|start|end|width|height|innerR)/.test(c)){if(!v){this.symbolAttr(a);v=true}m=true}else if(c==="d"){d=d||[];this.d=d.join(" ");e=d.length;for(m=[];e--;)m[e]=lc(d[e])?W(d[e]*10)-
5:d[e]==="Z"?"x":d[e];d=m.join(" ")||"x";f.path=d;if(P)for(e=P.length;e--;)P[e].path=d;m=true}else if(c==="zIndex"||c==="visibility"){if(Mc&&c==="visibility"&&h==="DIV"){f.gVis=d;m=f.childNodes;for(e=m.length;e--;)Ja(m[e],{visibility:d});if(d===Ab)d=null}if(d)g[c]=d;m=true}else if(/^(width|height)$/.test(c)){this[c]=d;if(this.updateClipping){this[c]=d;this.updateClipping()}else g[c]=d;m=true}else if(/^(x|y)$/.test(c)){this[c]=d;if(f.tagName==="SPAN")this.updateTransform();else g[{x:"left",y:"top"}[c]]=
d}else if(c==="class")f.className=d;else if(c==="stroke"){d=i.color(d,f,c);c="strokecolor"}else if(c==="stroke-width"||c==="strokeWidth"){f.stroked=d?true:false;c="strokeweight";this[c]=d;if(lc(d))d+=Ua}else if(c==="dashstyle"){(f.getElementsByTagName("stroke")[0]||hb(i.prepVML(["<stroke/>"]),null,null,f))[c]=d||"solid";this.dashstyle=d;m=true}else if(c==="fill")if(h==="SPAN")g.color=d;else{f.filled=d!==jb?true:false;d=i.color(d,f,c);c="fillcolor"}else if(c==="translateX"||c==="translateY"||c==="rotation"||
c==="align"){if(c==="align")c="textAlign";this[c]=d;this.updateTransform();m=true}else if(c==="text"){this.bBox=null;f.innerHTML=d;m=true}if(P&&c==="visibility")for(e=P.length;e--;)P[e].style[c]=d;if(!m)if(Mc)f[c]=d;else Ga(f,c,d)}return T},clip:function(a){var b=this,c=a.members;c.push(b);b.destroyClip=function(){nc(c,b)};return b.css(a.getCSS(b.inverted))},css:function(a){var b=this.element;if(b=a&&b.tagName==="SPAN"&&a.width){delete a.width;this.textWidth=b;this.updateTransform()}this.styles=sa(this.styles,
a);Ja(this.element,a);return this},safeRemoveChild:function(a){a.parentNode&&pc(a)},destroy:function(){this.destroyClip&&this.destroyClip();return Uc.prototype.destroy.apply(this)},empty:function(){for(var a=this.element.childNodes,b=a.length,c;b--;){c=a[b];c.parentNode.removeChild(c)}},getBBox:function(){var a=this.element,b=this.bBox;if(!b){if(a.nodeName==="text")a.style.position=ic;b=this.bBox={x:a.offsetLeft,y:a.offsetTop,width:a.offsetWidth,height:a.offsetHeight}}return b},on:function(a,b){this.element["on"+
a]=function(){var c=db.event;c.target=c.srcElement;b(c)};return this},updateTransform:function(){if(this.added){var a=this,b=a.element,c=a.translateX||0,d=a.translateY||0,e=a.x||0,f=a.y||0,g=a.textAlign||"left",h={left:0,center:0.5,right:1}[g],i=g&&g!=="left";if(c||d)a.css({marginLeft:c,marginTop:d});a.inverted&&u(b.childNodes,function(z){a.renderer.invertChild(z,b)});if(b.tagName==="SPAN"){var j,m;c=a.rotation;var v;j=0;d=1;var P=0,T;v=ja(a.textWidth);var Y=a.xCorr||0,H=a.yCorr||0,U=[c,g,b.innerHTML,
a.textWidth].join(",");if(U!==a.cTT){if(K(c)){j=c*ae;d=rb(j);P=Cb(j);Ja(b,{filter:c?["progid:DXImageTransform.Microsoft.Matrix(M11=",d,", M12=",-P,", M21=",P,", M22=",d,", sizingMethod='auto expand')"].join(""):jb})}j=b.offsetWidth;m=b.offsetHeight;if(j>v){Ja(b,{width:v+Ua,display:"block",whiteSpace:"normal"});j=v}v=W((ja(b.style.fontSize)||12)*1.2);Y=d<0&&-j;H=P<0&&-m;T=d*P<0;Y+=P*v*(T?1-h:h);H-=d*v*(c?T?h:1-h:1);if(i){Y-=j*h*(d<0?-1:1);if(c)H-=m*h*(P<0?-1:1);Ja(b,{textAlign:g})}a.xCorr=Y;a.yCorr=
H}Ja(b,{left:e+Y,top:f+H});a.cTT=U}}else this.alignOnAdd=true},shadow:function(a,b){var c=[],d,e=this.element,f=this.renderer,g,h=e.style,i,j=e.path;if(j&&typeof j.value!=="string")j="x";if(a){for(d=1;d<=3;d++){i=['<shape isShadow="true" strokeweight="',7-2*d,'" filled="false" path="',j,'" coordsize="100,100" style="',e.style.cssText,'" />'];g=hb(f.prepVML(i),null,{left:ja(h.left)+1,top:ja(h.top)+1});i=['<stroke color="black" opacity="',0.05*d,'"/>'];hb(f.prepVML(i),null,null,g);b?b.element.appendChild(g):
e.parentNode.insertBefore(g,e);c.push(g)}this.shadows=c}return this}});ma=function(){this.init.apply(this,arguments)};ma.prototype=Ca(ed.prototype,{Element:Db,isIE8:yc.indexOf("MSIE 8.0")>-1,init:function(a,b,c){var d;this.alignedObjects=[];d=this.createElement(Tb);a.appendChild(d.element);this.box=d.element;this.boxWrapper=d;this.setSize(b,c,false);if(!ua.namespaces.hcv){ua.namespaces.add("hcv","urn:schemas-microsoft-com:vml");ua.createStyleSheet().cssText="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "}},
clipRect:function(a,b,c,d){var e=this.createElement();return sa(e,{members:[],left:a,top:b,width:c,height:d,getCSS:function(f){var g=this.top,h=this.left,i=h+this.width,j=g+this.height;g={clip:"rect("+W(f?h:g)+"px,"+W(f?j:i)+"px,"+W(f?i:j)+"px,"+W(f?g:h)+"px)"};!f&&Mc&&sa(g,{width:i+Ua,height:j+Ua});return g},updateClipping:function(){u(e.members,function(f){f.css(e.getCSS(f.inverted))})}})},color:function(a,b,c){var d,e=/^rgba/;if(a&&a.linearGradient){var f,g,h=a.linearGradient,i,j,m,v;u(a.stops,
function(P,T){if(e.test(P[1])){d=bc(P[1]);f=d.get("rgb");g=d.get("a")}else{f=P[1];g=1}if(T){m=f;v=g}else{i=f;j=g}});a=90-Fa.atan((h[3]-h[1])/(h[2]-h[0]))*180/kc;a=["<",c,' colors="0% ',i,",100% ",m,'" angle="',a,'" opacity="',v,'" o:opacity2="',j,'" type="gradient" focus="100%" />'];hb(this.prepVML(a),null,null,b)}else if(e.test(a)&&b.tagName!=="IMG"){d=bc(a);a=["<",c,' opacity="',d.get("a"),'"/>'];hb(this.prepVML(a),null,null,b);return d.get("rgb")}else{b=b.getElementsByTagName(c);if(b.length)b[0].opacity=
1;return a}},prepVML:function(a){var b=this.isIE8;a=a.join("");if(b){a=a.replace("/>",' xmlns="urn:schemas-microsoft-com:vml" />');a=a.indexOf('style="')===-1?a.replace("/>",' style="display:inline-block;behavior:url(#default#VML);" />'):a.replace('style="','style="display:inline-block;behavior:url(#default#VML);')}else a=a.replace("<","<hcv:");return a},text:function(a,b,c){var d=Xa.chart.style;return this.createElement("span").attr({text:a,x:W(b),y:W(c)}).css({whiteSpace:"nowrap",fontFamily:d.fontFamily,
fontSize:d.fontSize})},path:function(a){return this.createElement("shape").attr({coordsize:"100 100",d:a})},circle:function(a,b,c){return this.symbol("circle").attr({x:a,y:b,r:c})},g:function(a){var b;if(a)b={className:vc+a,"class":vc+a};return this.createElement(Tb).attr(b)},image:function(a,b,c,d,e){var f=this.createElement("img").attr({src:a});arguments.length>1&&f.css({left:b,top:c,width:d,height:e});return f},rect:function(a,b,c,d,e,f){if(Nb(a)){b=a.y;c=a.width;d=a.height;e=a.r;f=a.strokeWidth;
a=a.x}var g=this.symbol("rect");g.r=e;return g.attr(g.crisp(f,a,b,Ia(c,0),Ia(d,0)))},invertChild:function(a,b){var c=b.style;Ja(a,{flip:"x",left:ja(c.width)-10,top:ja(c.height)-10,rotation:-90})},symbols:{arc:function(a,b,c,d){var e=d.start,f=d.end,g=rb(e),h=Cb(e),i=rb(f),j=Cb(f);d=d.innerR;var m=0.07/c,v=d&&0.1/d||0;if(f-e===0)return["x"];else if(2*kc-f+e<m)i=-m;else if(f-e<v)i=rb(e+v);return["wa",a-c,b-c,a+c,b+c,a+c*g,b+c*h,a+c*i,b+c*j,"at",a-d,b-d,a+d,b+d,a+d*i,b+d*j,a+d*g,b+d*h,"x","e"]},circle:function(a,
b,c){return["wa",a-c,b-c,a+c,b+c,a+c,b,a+c,b,"e"]},rect:function(a,b,c,d){if(!K(d))return[];var e=d.width;d=d.height;var f=a+e,g=b+d;c=tb(c,e,d);return[Za,a+c,b,Ka,f-c,b,"wa",f-2*c,b,f,b+2*c,f-c,b,f,b+c,Ka,f,g-c,"wa",f-2*c,g-2*c,f,g,f,g-c,f-c,g,Ka,a+c,g,"wa",a,g-2*c,a+2*c,g,a+c,g,a,g-c,Ka,a,b+c,"wa",a,b,a+2*c,b+2*c,a,b+c,a+c,b,"x","e"]}}});fd=ma}Nd.prototype.callbacks=[];var Oc=function(){};Oc.prototype={init:function(a,b){var c=a.chart.counters,d;this.series=a;this.applyOptions(b);this.pointAttr=
{};if(a.options.colorByPoint){d=a.chart.options.colors;if(!this.options)this.options={};this.color=this.options.color=this.color||d[c.color++];c.wrapColor(d.length)}a.chart.pointCount++;return this},applyOptions:function(a){var b=this.series;this.config=a;if(lc(a)||a===null)this.y=a;else if(Nb(a)&&!lc(a.length)){sa(this,a);this.options=a}else if(Sb(a[0])){this.name=a[0];this.y=a[1]}else if(lc(a[0])){this.x=a[0];this.y=a[1]}if(this.x===Wa)this.x=b.autoIncrement()},destroy:function(){var a=this,b=a.series,
c=b.chart.hoverPoints,d;b.chart.pointCount--;if(c){a.setState();nc(c,a)}a===b.chart.hoverPoint&&a.onMouseOut();pb(a);u(["graphic","tracker","group","dataLabel","connector","shadowGroup"],function(e){a[e]&&a[e].destroy()});a.legendItem&&a.series.chart.legend.destroyItem(a);for(d in a)a[d]=null},getLabelConfig:function(){return{x:this.category,y:this.y,series:this.series,point:this,percentage:this.percentage,total:this.total||this.stackTotal}},select:function(a,b){var c=this,d=c.series.chart;a=A(a,
!c.selected);c.firePointEvent(a?"select":"unselect",{accumulate:b},function(){c.selected=a;c.setState(a&&"select");b||u(d.getSelectedPoints(),function(e){if(e.selected&&e!==c){e.selected=false;e.setState(ib);e.firePointEvent("unselect")}})})},onMouseOver:function(){var a=this.series.chart,b=a.tooltip,c=a.hoverPoint;c&&c!==this&&c.onMouseOut();this.firePointEvent("mouseOver");b&&!b.shared&&b.refresh(this);this.setState(Bb);a.hoverPoint=this},onMouseOut:function(){this.firePointEvent("mouseOut");this.setState();
this.series.chart.hoverPoint=null},tooltipFormatter:function(a){var b=this.series;return['<span style="color:'+b.color+'">',this.name||b.name,"</span>: ",!a?"<b>x = "+(this.name||this.x)+",</b> ":"","<b>",!a?"y = ":"",this.y,"</b>"].join("")},update:function(a,b,c){var d=this,e=d.series,f=d.graphic,g=e.chart;b=A(b,true);d.firePointEvent("update",{options:a},function(){d.applyOptions(a);if(Nb(a)){e.getAttribs();f&&f.attr(d.pointAttr[e.state])}e.isDirty=true;b&&g.redraw(c)})},remove:function(a,b){var c=
this,d=c.series,e=d.chart,f=d.data;oc(b,e);a=A(a,true);c.firePointEvent("remove",null,function(){nc(f,c);c.destroy();d.isDirty=true;a&&e.redraw()})},firePointEvent:function(a,b,c){var d=this,e=this.series.options;if(e.point.events[a]||d.options&&d.options.events&&d.options.events[a])this.importEvents();if(a==="click"&&e.allowPointSelect)c=function(f){d.select(null,f.ctrlKey||f.metaKey||f.shiftKey)};Pa(this,a,b,c)},importEvents:function(){if(!this.hasImportedEvents){var a=Ca(this.series.options.point,
this.options).events,b;this.events=a;for(b in a)Qa(this,b,a[b]);this.hasImportedEvents=true}},setState:function(a){var b=this.series,c=b.options.states,d=xb[b.type].marker&&b.options.marker,e=d&&!d.enabled,f=(d=d&&d.states[a])&&d.enabled===false,g=b.stateMarkerGraphic,h=b.chart,i=this.pointAttr;a=a||ib;if(!(a===this.state||this.selected&&a!=="select"||c[a]&&c[a].enabled===false||a&&(f||e&&!d.enabled))){if(this.graphic)this.graphic.attr(i[a]);else{if(a){if(!g)b.stateMarkerGraphic=g=h.renderer.circle(0,
0,i[a].r).attr(i[a]).add(b.group);g.translate(this.plotX,this.plotY)}if(g)g[a?"show":"hide"]()}this.state=a}}};var sb=function(){};sb.prototype={isCartesian:true,type:"line",pointClass:Oc,pointAttrToOptions:{stroke:"lineColor","stroke-width":"lineWidth",fill:"fillColor",r:"radius"},init:function(a,b){var c,d;d=a.series.length;this.chart=a;b=this.setOptions(b);sa(this,{index:d,options:b,name:b.name||"Series "+(d+1),state:ib,pointAttr:{},visible:b.visible!==false,selected:b.selected===true});d=b.events;
for(c in d)Qa(this,c,d[c]);if(d&&d.click||b.point&&b.point.events&&b.point.events.click||b.allowPointSelect)a.runTrackerClick=true;this.getColor();this.getSymbol();this.setData(b.data,false)},autoIncrement:function(){var a=this.options,b=this.xIncrement;b=A(b,a.pointStart,0);this.pointInterval=A(this.pointInterval,a.pointInterval,1);this.xIncrement=b+this.pointInterval;return b},cleanData:function(){var a=this.chart,b=this.data,c,d,e=a.smallestInterval,f,g;Hd(b,function(h,i){return h.x-i.x});if(this.options.connectNulls)for(g=
b.length-1;g>=0;g--)b[g].y===null&&b[g-1]&&b[g+1]&&b.splice(g,1);for(g=b.length-1;g>=0;g--)if(b[g-1]){f=b[g].x-b[g-1].x;if(f>0&&(d===Wa||f<d)){d=f;c=g}}if(e===Wa||d<e)a.smallestInterval=d;this.closestPoints=c},getSegments:function(){var a=-1,b=[],c=this.data;u(c,function(d,e){if(d.y===null){e>a+1&&b.push(c.slice(a+1,e));a=e}else e===c.length-1&&b.push(c.slice(a+1,e+1))});this.segments=b},setOptions:function(a){var b=this.chart.options.plotOptions;return Ca(b[this.type],b.series,a)},getColor:function(){var a=
this.chart.options.colors,b=this.chart.counters;this.color=this.options.color||a[b.color++]||"#0000ff";b.wrapColor(a.length)},getSymbol:function(){var a=this.chart.options.symbols,b=this.chart.counters;this.symbol=this.options.marker.symbol||a[b.symbol++];b.wrapSymbol(a.length)},addPoint:function(a,b,c,d){var e=this.data,f=this.graph,g=this.area,h=this.chart;a=(new this.pointClass).init(this,a);oc(d,h);if(f&&c)f.shift=c;if(g){g.shift=c;g.isArea=true}b=A(b,true);e.push(a);c&&e[0].remove(false);this.getAttribs();
this.isDirty=true;b&&h.redraw()},setData:function(a,b){var c=this,d=c.data,e=c.initialColor,f=c.chart,g=d&&d.length||0;c.xIncrement=null;if(K(e))f.counters.color=e;for(a=tc(zc(a||[]),function(h){return(new c.pointClass).init(c,h)});g--;)d[g].destroy();c.data=a;c.cleanData();c.getSegments();c.getAttribs();c.isDirty=true;f.isDirtyBox=true;A(b,true)&&f.redraw(false)},remove:function(a,b){var c=this,d=c.chart;a=A(a,true);if(!c.isRemoving){c.isRemoving=true;Pa(c,"remove",null,function(){c.destroy();d.isDirtyLegend=
d.isDirtyBox=true;a&&d.redraw(b)})}c.isRemoving=false},translate:function(){for(var a=this.chart,b=this.options.stacking,c=this.xAxis.categories,d=this.yAxis,e=this.data,f=e.length;f--;){var g=e[f],h=g.x,i=g.y,j=g.low,m=d.stacks[(i<0?"-":"")+this.stackKey];g.plotX=this.xAxis.translate(h);if(b&&this.visible&&m&&m[h]){j=m[h];h=j.total;j.cum=j=j.cum-i;i=j+i;if(b==="percent"){j=h?j*100/h:0;i=h?i*100/h:0}g.percentage=h?g.y*100/h:0;g.stackTotal=h}if(K(j))g.yBottom=d.translate(j,0,1,0,1);if(i!==null)g.plotY=
d.translate(i,0,1,0,1);g.clientX=a.inverted?a.plotHeight-g.plotX:g.plotX;g.category=c&&c[g.x]!==Wa?c[g.x]:g.x}},setTooltipPoints:function(a){var b=this.chart,c=b.inverted,d=[],e=W((c?b.plotTop:b.plotLeft)+b.plotSizeX),f,g,h=[];if(a)this.tooltipPoints=null;u(this.segments,function(i){d=d.concat(i)});if(this.xAxis&&this.xAxis.reversed)d=d.reverse();u(d,function(i,j){f=d[j-1]?d[j-1]._high+1:0;for(g=i._high=d[j+1]?lb((i.plotX+(d[j+1]?d[j+1].plotX:e))/2):e;f<=g;)h[c?e-f++:f++]=i});this.tooltipPoints=h},
onMouseOver:function(){var a=this.chart,b=a.hoverSeries;if(!(!Kb&&a.mouseIsDown)){b&&b!==this&&b.onMouseOut();this.options.events.mouseOver&&Pa(this,"mouseOver");this.tracker&&this.tracker.toFront();this.setState(Bb);a.hoverSeries=this}},onMouseOut:function(){var a=this.options,b=this.chart,c=b.tooltip,d=b.hoverPoint;d&&d.onMouseOut();this&&a.events.mouseOut&&Pa(this,"mouseOut");c&&!a.stickyTracking&&c.hide();this.setState();b.hoverSeries=null},animate:function(a){var b=this.chart,c=this.clipRect,
d=this.options.animation;if(d&&!Nb(d))d={};if(a){if(!c.isAnimating){c.attr("width",0);c.isAnimating=true}}else{c.animate({width:b.plotSizeX},d);this.animate=null}},drawPoints:function(){var a,b=this.data,c=this.chart,d,e,f,g,h,i;if(this.options.marker.enabled)for(f=b.length;f--;){g=b[f];d=g.plotX;e=g.plotY;i=g.graphic;if(e!==Wa&&!isNaN(e)){a=g.pointAttr[g.selected?"select":ib];h=a.r;if(i)i.animate({x:d,y:e,r:h});else g.graphic=c.renderer.symbol(A(g.marker&&g.marker.symbol,this.symbol),d,e,h).attr(a).add(this.group)}}},
convertAttribs:function(a,b,c,d){var e=this.pointAttrToOptions,f,g,h={};a=a||{};b=b||{};c=c||{};d=d||{};for(f in e){g=e[f];h[f]=A(a[g],b[f],c[f],d[f])}return h},getAttribs:function(){var a=this,b=xb[a.type].marker?a.options.marker:a.options,c=b.states,d=c[Bb],e,f=a.color,g={stroke:f,fill:f},h=a.data,i=[],j,m=a.pointAttrToOptions,v;if(a.options.marker){d.radius=d.radius||b.radius+2;d.lineWidth=d.lineWidth||b.lineWidth+1}else d.color=d.color||bc(d.color||f).brighten(d.brightness).get();i[ib]=a.convertAttribs(b,
g);u([Bb,"select"],function(P){i[P]=a.convertAttribs(c[P],i[ib])});a.pointAttr=i;for(f=h.length;f--;){g=h[f];if((b=g.options&&g.options.marker||g.options)&&b.enabled===false)b.radius=0;e=false;if(g.options)for(v in m)if(K(b[m[v]]))e=true;if(e){j=[];c=b.states||{};e=c[Bb]=c[Bb]||{};if(!a.options.marker)e.color=bc(e.color||g.options.color).brighten(e.brightness||d.brightness).get();j[ib]=a.convertAttribs(b,i[ib]);j[Bb]=a.convertAttribs(c[Bb],i[Bb],j[ib]);j.select=a.convertAttribs(c.select,i.select,
j[ib])}else j=i;g.pointAttr=j}},destroy:function(){var a=this,b=a.chart,c=a.clipRect,d=/\/5[0-9\.]+ (Safari|Mobile)\//.test(yc),e,f;Pa(a,"destroy");pb(a);a.legendItem&&a.chart.legend.destroyItem(a);u(a.data,function(g){g.destroy()});if(c&&c!==b.clipRect)a.clipRect=c.destroy();u(["area","graph","dataLabelsGroup","group","tracker"],function(g){if(a[g]){e=d&&g==="group"?"hide":"destroy";a[g][e]()}});if(b.hoverSeries===a)b.hoverSeries=null;nc(b.series,a);for(f in a)delete a[f]},drawDataLabels:function(){if(this.options.dataLabels.enabled){var a,
b,c=this.data,d=this.options,e=d.dataLabels,f,g=this.dataLabelsGroup,h=this.chart,i=h.renderer,j=h.inverted,m=this.type,v;v=d.stacking;var P=m==="column"||m==="bar",T=e.verticalAlign===null,Y=e.y===null;if(P)if(v){if(T)e=Ca(e,{verticalAlign:"middle"});if(Y)e=Ca(e,{y:{top:14,middle:4,bottom:-6}[e.verticalAlign]})}else if(T)e=Ca(e,{verticalAlign:"top"});if(g)g.translate(h.plotLeft,h.plotTop);else g=this.dataLabelsGroup=i.g("data-labels").attr({visibility:this.visible?Ab:ob,zIndex:6}).translate(h.plotLeft,
h.plotTop).add();v=e.color;if(v==="auto")v=null;e.style.color=A(v,this.color,"black");u(c,function(H){var U=H.barX,z=U&&U+H.barW/2||H.plotX||-999,M=A(H.plotY,-999),y=H.dataLabel,C=e.align,Z=Y?H.y>=0?-6:12:e.y;f=e.formatter.call(H.getLabelConfig());a=(j?h.plotWidth-M:z)+e.x;b=(j?h.plotHeight-z:M)+Z;if(m==="column")a+={left:-1,right:1}[C]*H.barW/2||0;if(j&&H.y<0){C="right";a-=10}if(y){if(j&&!e.y)b=b+ja(y.styles.lineHeight)*0.9-y.getBBox().height/2;y.attr({text:f}).animate({x:a,y:b})}else if(K(f)){y=
H.dataLabel=i.text(f,a,b).attr({align:C,rotation:e.rotation,zIndex:1}).css(e.style).add(g);j&&!e.y&&y.attr({y:b+ja(y.styles.lineHeight)*0.9-y.getBBox().height/2})}if(P&&d.stacking&&y){z=H.barY;M=H.barW;H=H.barH;y.align(e,null,{x:j?h.plotWidth-z-H:U,y:j?h.plotHeight-U-M:z,width:j?H:M,height:j?M:H})}})}},drawGraph:function(){var a=this,b=a.options,c=a.graph,d=[],e,f=a.area,g=a.group,h=b.lineColor||a.color,i=b.lineWidth,j=b.dashStyle,m,v=a.chart.renderer,P=a.yAxis.getThreshold(b.threshold||0),T=/^area/.test(a.type),
Y=[],H=[];u(a.segments,function(U){m=[];u(U,function(C,Z){if(a.getPointSpline)m.push.apply(m,a.getPointSpline(U,C,Z));else{m.push(Z?Ka:Za);Z&&b.step&&m.push(C.plotX,U[Z-1].plotY);m.push(C.plotX,C.plotY)}});if(U.length>1)d=d.concat(m);else Y.push(U[0]);if(T){var z=[],M,y=m.length;for(M=0;M<y;M++)z.push(m[M]);y===3&&z.push(Ka,m[1],m[2]);if(b.stacking&&a.type!=="areaspline")for(M=U.length-1;M>=0;M--)z.push(U[M].plotX,U[M].yBottom);else z.push(Ka,U[U.length-1].plotX,P,Ka,U[0].plotX,P);H=H.concat(z)}});
a.graphPath=d;a.singlePoints=Y;if(T){e=A(b.fillColor,bc(a.color).setOpacity(b.fillOpacity||0.75).get());if(f)f.animate({d:H});else a.area=a.chart.renderer.path(H).attr({fill:e}).add(g)}if(c){Hc(c);c.animate({d:d})}else if(i){c={stroke:h,"stroke-width":i};if(j)c.dashstyle=j;a.graph=v.path(d).attr(c).add(g).shadow(b.shadow)}},render:function(){var a=this,b=a.chart,c,d,e=a.options,f=e.animation,g=f&&a.animate;f=g?f&&f.duration||500:0;var h=a.clipRect,i=b.renderer;if(!h){h=a.clipRect=!b.hasRendered&&
b.clipRect?b.clipRect:i.clipRect(0,0,b.plotSizeX,b.plotSizeY);if(!b.clipRect)b.clipRect=h}if(!a.group){c=a.group=i.g("series");if(b.inverted){d=function(){c.attr({width:b.plotWidth,height:b.plotHeight}).invert()};d();Qa(b,"resize",d);Qa(a,"destroy",function(){pb(b,"resize",d)})}c.clip(a.clipRect).attr({visibility:a.visible?Ab:ob,zIndex:e.zIndex}).translate(b.plotLeft,b.plotTop).add(b.seriesGroup)}a.drawDataLabels();g&&a.animate(true);a.drawGraph&&a.drawGraph();a.drawPoints();a.options.enableMouseTracking!==
false&&a.drawTracker();g&&a.animate();setTimeout(function(){h.isAnimating=false;if((c=a.group)&&h!==b.clipRect&&h.renderer){c.clip(a.clipRect=b.clipRect);h.destroy()}},f);a.isDirty=false},redraw:function(){var a=this.chart,b=this.group;if(b){a.inverted&&b.attr({width:a.plotWidth,height:a.plotHeight});b.animate({translateX:a.plotLeft,translateY:a.plotTop})}this.translate();this.setTooltipPoints(true);this.render()},setState:function(a){var b=this.options,c=this.graph,d=b.states;b=b.lineWidth;a=a||
ib;if(this.state!==a){this.state=a;if(!(d[a]&&d[a].enabled===false)){if(a)b=d[a].lineWidth||b+1;if(c&&!c.dashstyle)c.attr({"stroke-width":b},a?0:500)}}},setVisible:function(a,b){var c=this.chart,d=this.legendItem,e=this.group,f=this.tracker,g=this.dataLabelsGroup,h,i=this.data,j=c.options.chart.ignoreHiddenSeries;h=this.visible;h=(this.visible=a=a===Wa?!h:a)?"show":"hide";e&&e[h]();if(f)f[h]();else for(e=i.length;e--;){f=i[e];f.tracker&&f.tracker[h]()}g&&g[h]();d&&c.legend.colorizeItem(this,a);this.isDirty=
true;this.options.stacking&&u(c.series,function(m){if(m.options.stacking&&m.visible)m.isDirty=true});if(j)c.isDirtyBox=true;b!==false&&c.redraw();Pa(this,h)},show:function(){this.setVisible(true)},hide:function(){this.setVisible(false)},select:function(a){this.selected=a=a===Wa?!this.selected:a;if(this.checkbox)this.checkbox.checked=a;Pa(this,a?"select":"unselect")},drawTracker:function(){var a=this,b=a.options,c=[].concat(a.graphPath),d=c.length,e=a.chart,f=e.options.tooltip.snap,g=a.tracker,h=b.cursor;
h=h&&{cursor:h};var i=a.singlePoints,j;if(d)for(j=d+1;j--;){c[j]===Za&&c.splice(j+1,0,c[j+1]-f,c[j+2],Ka);if(j&&c[j]===Za||j===d)c.splice(j,0,Ka,c[j-2]+f,c[j-1])}for(j=0;j<i.length;j++){d=i[j];c.push(Za,d.plotX-f,d.plotY,Ka,d.plotX+f,d.plotY)}if(g)g.attr({d:c});else a.tracker=e.renderer.path(c).attr({isTracker:true,stroke:ce,fill:jb,"stroke-width":b.lineWidth+2*f,visibility:a.visible?Ab:ob,zIndex:b.zIndex||1}).on(Kb?"touchstart":"mouseover",function(){e.hoverSeries!==a&&a.onMouseOver()}).on("mouseout",
function(){b.stickyTracking||a.onMouseOut()}).css(h).add(e.trackerGroup)}};ma=yb(sb);wb.line=ma;ma=yb(sb,{type:"area"});wb.area=ma;ma=yb(sb,{type:"spline",getPointSpline:function(a,b,c){var d=b.plotX,e=b.plotY,f=a[c-1],g=a[c+1],h,i,j,m;if(c&&c<a.length-1){a=f.plotY;j=g.plotX;g=g.plotY;var v;h=(1.5*d+f.plotX)/2.5;i=(1.5*e+a)/2.5;j=(1.5*d+j)/2.5;m=(1.5*e+g)/2.5;v=(m-i)*(j-d)/(j-h)+e-m;i+=v;m+=v;if(i>a&&i>e){i=Ia(a,e);m=2*e-i}else if(i<a&&i<e){i=tb(a,e);m=2*e-i}if(m>g&&m>e){m=Ia(g,e);i=2*e-m}else if(m<
g&&m<e){m=tb(g,e);i=2*e-m}b.rightContX=j;b.rightContY=m}if(c){b=["C",f.rightContX||f.plotX,f.rightContY||f.plotY,h||d,i||e,d,e];f.rightContX=f.rightContY=null}else b=[Za,d,e];return b}});wb.spline=ma;ma=yb(ma,{type:"areaspline"});wb.areaspline=ma;var hd=yb(sb,{type:"column",pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color",r:"borderRadius"},init:function(){sb.prototype.init.apply(this,arguments);var a=this,b=a.chart;b.hasColumn=true;b.hasRendered&&u(b.series,function(c){if(c.type===
a.type)c.isDirty=true})},translate:function(){var a=this,b=a.chart,c=a.options,d=c.stacking,e=c.borderWidth,f=0,g=a.xAxis.reversed,h=a.xAxis.categories,i={},j,m;sb.prototype.translate.apply(a);u(b.series,function(C){if(C.type===a.type&&C.visible){if(C.options.stacking){j=C.stackKey;if(i[j]===Wa)i[j]=f++;m=i[j]}else m=f++;C.columnIndex=m}});var v=a.data,P=a.closestPoints;h=bb(v[1]?v[P].plotX-v[P-1].plotX:b.plotSizeX/(h&&h.length||1));P=h*c.groupPadding;var T=(h-2*P)/f,Y=c.pointWidth,H=K(Y)?(T-Y)/2:
T*c.pointPadding,U=Ia(A(Y,T-2*H),1),z=H+(P+((g?f-a.columnIndex:a.columnIndex)||0)*T-h/2)*(g?-1:1),M=a.yAxis.getThreshold(c.threshold||0),y=A(c.minPointLength,5);u(v,function(C){var Z=C.plotY,Sa=C.yBottom||M,Na=C.plotX+z,Ea=md(tb(Z,Sa)),gb=md(Ia(Z,Sa)-Ea),Lb=a.yAxis.stacks[(C.y<0?"-":"")+a.stackKey],Rb;d&&a.visible&&Lb&&Lb[C.x]&&Lb[C.x].setOffset(z,U);if(bb(gb)<y){if(y){gb=y;Ea=bb(Ea-M)>y?Sa-y:M-(Z<=M?y:0)}Rb=Ea-3}sa(C,{barX:Na,barY:Ea,barW:U,barH:gb});C.shapeType="rect";Z=sa(b.renderer.Element.prototype.crisp.apply({},
[e,Na,Ea,U,gb]),{r:c.borderRadius});if(e%2){Z.y-=1;Z.height+=1}C.shapeArgs=Z;C.trackerArgs=K(Rb)&&Ca(C.shapeArgs,{height:Ia(6,gb+3),y:Rb})})},getSymbol:function(){},drawGraph:function(){},drawPoints:function(){var a=this,b=a.options,c=a.chart.renderer,d,e;u(a.data,function(f){var g=f.plotY;if(g!==Wa&&!isNaN(g)&&f.y!==null){d=f.graphic;e=f.shapeArgs;if(d){Hc(d);d.animate(e)}else f.graphic=c[f.shapeType](e).attr(f.pointAttr[f.selected?"select":ib]).add(a.group).shadow(b.shadow)}})},drawTracker:function(){var a=
this,b=a.chart,c=b.renderer,d,e,f=+new Date,g=a.options,h=g.cursor,i=h&&{cursor:h},j;u(a.data,function(m){e=m.tracker;d=m.trackerArgs||m.shapeArgs;delete d.strokeWidth;if(m.y!==null)if(e)e.attr(d);else m.tracker=c[m.shapeType](d).attr({isTracker:f,fill:ce,visibility:a.visible?Ab:ob,zIndex:g.zIndex||1}).on(Kb?"touchstart":"mouseover",function(v){j=v.relatedTarget||v.fromElement;b.hoverSeries!==a&&Ga(j,"isTracker")!==f&&a.onMouseOver();m.onMouseOver()}).on("mouseout",function(v){if(!g.stickyTracking){j=
v.relatedTarget||v.toElement;Ga(j,"isTracker")!==f&&a.onMouseOut()}}).css(i).add(m.group||b.trackerGroup)})},animate:function(a){var b=this,c=b.data;if(!a){u(c,function(d){var e=d.graphic;d=d.shapeArgs;if(e){e.attr({height:0,y:b.yAxis.translate(0,0,1)});e.animate({height:d.height,y:d.y},b.options.animation)}});b.animate=null}},remove:function(){var a=this,b=a.chart;b.hasRendered&&u(b.series,function(c){if(c.type===a.type)c.isDirty=true});sb.prototype.remove.apply(a,arguments)}});wb.column=hd;ma=yb(hd,
{type:"bar",init:function(a){a.inverted=this.inverted=true;hd.prototype.init.apply(this,arguments)}});wb.bar=ma;ma=yb(sb,{type:"scatter",translate:function(){var a=this;sb.prototype.translate.apply(a);u(a.data,function(b){b.shapeType="circle";b.shapeArgs={x:b.plotX,y:b.plotY,r:a.chart.options.tooltip.snap}})},drawTracker:function(){var a=this,b=a.options.cursor,c=b&&{cursor:b},d;u(a.data,function(e){(d=e.graphic)&&d.attr({isTracker:true}).on("mouseover",function(){a.onMouseOver();e.onMouseOver()}).on("mouseout",
function(){a.options.stickyTracking||a.onMouseOut()}).css(c)})},cleanData:function(){}});wb.scatter=ma;ma=yb(Oc,{init:function(){Oc.prototype.init.apply(this,arguments);var a=this,b;sa(a,{visible:a.visible!==false,name:A(a.name,"Slice")});b=function(){a.slice()};Qa(a,"select",b);Qa(a,"unselect",b);return a},setVisible:function(a){var b=this.series.chart,c=this.tracker,d=this.dataLabel,e=this.connector,f=this.shadowGroup,g;g=(this.visible=a=a===Wa?!this.visible:a)?"show":"hide";this.group[g]();c&&
c[g]();d&&d[g]();e&&e[g]();f&&f[g]();this.legendItem&&b.legend.colorizeItem(this,a)},slice:function(a,b,c){var d=this.series.chart,e=this.slicedTranslation;oc(c,d);A(b,true);a=this.sliced=K(a)?a:!this.sliced;a={translateX:a?e[0]:d.plotLeft,translateY:a?e[1]:d.plotTop};this.group.animate(a);this.shadowGroup&&this.shadowGroup.animate(a)}});ma=yb(sb,{type:"pie",isCartesian:false,pointClass:ma,pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color"},getColor:function(){this.initialColor=
this.chart.counters.color},animate:function(){var a=this;u(a.data,function(b){var c=b.graphic;b=b.shapeArgs;var d=-kc/2;if(c){c.attr({r:0,start:d,end:d});c.animate({r:b.r,start:b.start,end:b.end},a.options.animation)}});a.animate=null},translate:function(){var a=0,b=-0.25,c=this.options,d=c.slicedOffset,e=d+c.borderWidth,f=c.center.concat([c.size,c.innerSize||0]),g=this.chart,h=g.plotWidth,i=g.plotHeight,j,m,v,P=this.data,T=2*kc,Y,H=tb(h,i),U,z,M,y=c.dataLabels.distance;f=tc(f,function(C,Z){return(U=
/%$/.test(C))?[h,i,H,H][Z]*ja(C)/100:C});this.getX=function(C,Z){v=Fa.asin((C-f[1])/(f[2]/2+y));return f[0]+(Z?-1:1)*rb(v)*(f[2]/2+y)};this.center=f;u(P,function(C){a+=C.y});u(P,function(C){Y=a?C.y/a:0;j=W(b*T*1E3)/1E3;b+=Y;m=W(b*T*1E3)/1E3;C.shapeType="arc";C.shapeArgs={x:f[0],y:f[1],r:f[2]/2,innerR:f[3]/2,start:j,end:m};v=(m+j)/2;C.slicedTranslation=tc([rb(v)*d+g.plotLeft,Cb(v)*d+g.plotTop],W);z=rb(v)*f[2]/2;M=Cb(v)*f[2]/2;C.tooltipPos=[f[0]+z*0.7,f[1]+M*0.7];C.labelPos=[f[0]+z+rb(v)*y,f[1]+M+Cb(v)*
y,f[0]+z+rb(v)*e,f[1]+M+Cb(v)*e,f[0]+z,f[1]+M,y<0?"center":v<T/4?"left":"right",v];C.percentage=Y*100;C.total=a});this.setTooltipPoints()},render:function(){this.drawPoints();this.options.enableMouseTracking!==false&&this.drawTracker();this.drawDataLabels();this.options.animation&&this.animate&&this.animate();this.isDirty=false},drawPoints:function(){var a=this.chart,b=a.renderer,c,d,e,f=this.options.shadow,g,h;u(this.data,function(i){d=i.graphic;h=i.shapeArgs;e=i.group;g=i.shadowGroup;if(f&&!g)g=
i.shadowGroup=b.g("shadow").attr({zIndex:4}).add();if(!e)e=i.group=b.g("point").attr({zIndex:5}).add();c=i.sliced?i.slicedTranslation:[a.plotLeft,a.plotTop];e.translate(c[0],c[1]);g&&g.translate(c[0],c[1]);if(d)d.animate(h);else i.graphic=b.arc(h).attr(sa(i.pointAttr[ib],{"stroke-linejoin":"round"})).add(i.group).shadow(f,g);i.visible===false&&i.setVisible(false)})},drawDataLabels:function(){var a=this.data,b,c=this.chart,d=this.options.dataLabels,e=A(d.connectorPadding,10),f=A(d.connectorWidth,1),
g,h,i=A(d.softConnector,true),j=d.distance,m=this.center,v=m[2]/2;m=m[1];var P=j>0,T=[[],[]],Y,H,U,z,M=2,y;if(d.enabled){sb.prototype.drawDataLabels.apply(this);u(a,function(gb){if(gb.dataLabel)T[gb.labelPos[7]<kc/2?0:1].push(gb)});T[1].reverse();z=function(gb,Lb){return Lb.y-gb.y};for(a=T[0][0]&&T[0][0].dataLabel&&ja(T[0][0].dataLabel.styles.lineHeight);M--;){var C=[],Z=[],Sa=T[M],Na=Sa.length,Ea;for(y=m-v-j;y<=m+v+j;y+=a)C.push(y);U=C.length;if(Na>U){h=[].concat(Sa);h.sort(z);for(y=Na;y--;)h[y].rank=
y;for(y=Na;y--;)Sa[y].rank>=U&&Sa.splice(y,1);Na=Sa.length}for(y=0;y<Na;y++){b=Sa[y];h=b.labelPos;b=9999;for(H=0;H<U;H++){g=bb(C[H]-h[1]);if(g<b){b=g;Ea=H}}if(Ea<y&&C[y]!==null)Ea=y;else{if(U<Na-y+Ea&&C[y]!==null)Ea=U-Na+y;for(;C[Ea]===null;)Ea++}Z.push({i:Ea,y:C[Ea]});C[Ea]=null}Z.sort(z);for(y=0;y<Na;y++){b=Sa[y];h=b.labelPos;g=b.dataLabel;H=Z.pop();Y=h[1];U=b.visible===false?ob:Ab;Ea=H.i;H=H.y;if(Y>H&&C[Ea+1]!==null||Y<H&&C[Ea-1]!==null)H=Y;Y=this.getX(Ea===0||Ea===C.length-1?Y:H,M);g.attr({visibility:U,
align:h[6]})[g.moved?"animate":"attr"]({x:Y+d.x+({left:e,right:-e}[h[6]]||0),y:H+d.y});g.moved=true;if(P&&f){g=b.connector;h=i?[Za,Y+(h[6]==="left"?5:-5),H,"C",Y,H,2*h[2]-h[4],2*h[3]-h[5],h[2],h[3],Ka,h[4],h[5]]:[Za,Y+(h[6]==="left"?5:-5),H,Ka,h[2],h[3],Ka,h[4],h[5]];if(g){g.animate({d:h});g.attr("visibility",U)}else b.connector=g=this.chart.renderer.path(h).attr({"stroke-width":f,stroke:d.connectorColor||b.color||"#606060",visibility:U,zIndex:3}).translate(c.plotLeft,c.plotTop).add()}}}}},drawTracker:hd.prototype.drawTracker,
getSymbol:function(){}});wb.pie=ma;db.Highcharts={Chart:Nd,dateFormat:Zc,pathAnim:Nc,getOptions:function(){return Xa},hasRtlBug:me,numberFormat:Ed,Point:Oc,Color:bc,Renderer:fd,seriesTypes:wb,setOptions:function(a){Xa=Ca(Xa,a);Id();return Xa},Series:sb,addEvent:Qa,removeEvent:pb,createElement:hb,discardElement:pc,css:Ja,each:u,extend:sa,map:tc,merge:Ca,pick:A,extendClass:yb,product:"Highcharts",version:"2.1.9"}})();
var foobar = "bar";
jQuery('#ap').html('bar');
ok( true, "test.js executed");
var jQuery = this.jQuery || "jQuery", // For testing .noConflict()
	$ = this.$ || "$",
	originaljQuery = jQuery,
	original$ = $,
	amdDefined;

/**
 * Set up a mock AMD define function for testing AMD registration.
 */
function define(name, dependencies, callback) {
	amdDefined = callback();
}

define.amd = {
	jQuery: true
};

/**
 * Returns an array of elements with the given IDs, eg.
 * @example q("main", "foo", "bar")
 * @result [<div id="main">, <span id="foo">, <input id="bar">]
 */
function q() {
	var r = [];

	for ( var i = 0; i < arguments.length; i++ ) {
		r.push( document.getElementById( arguments[i] ) );
	}

	return r;
}

/**
 * Asserts that a select matches the given IDs * @example t("Check for something", "//[a]", ["foo", "baar"]);
 * @result returns true if "//[a]" return two elements with the IDs 'foo' and 'baar'
 */
function t(a,b,c) {
	var f = jQuery(b).get(), s = "";

	for ( var i = 0; i < f.length; i++ ) {
		s += (s && ",") + '"' + f[i].id + '"';
	}

	deepEqual(f, q.apply(q,c), a + " (" + b + ")");
}

var fireNative;
if ( document.createEvent ) {
	fireNative = function( node, type ) {
		var event = document.createEvent('HTMLEvents');
		event.initEvent( type, true, true );
		node.dispatchEvent( event );
	};
} else {
	fireNative = function( node, type ) {
		var event = document.createEventObject();
		node.fireEvent( 'on' + type, event );
	};
}

/**
 * Add random number to url to stop IE from caching
 *
 * @example url("data/test.html")
 * @result "data/test.html?10538358428943"
 *
 * @example url("data/test.php?foo=bar")
 * @result "data/test.php?foo=bar&10538358345554"
 */
function url(value) {
	return value + (/\?/.test(value) ? "&" : "?") + new Date().getTime() + "" + parseInt(Math.random()*100000);
}

(function () {
	// Store the old counts so that we only assert on tests that have actually leaked,
	// instead of asserting every time a test has leaked sometime in the past
	var oldCacheLength = 0,
		oldFragmentsLength = 0,
		oldTimersLength = 0,
		oldActive = 0;

	/**
	 * Ensures that tests have cleaned up properly after themselves. Should be passed as the
	 * teardown function on all modules' lifecycle object.
	 */
	this.moduleTeardown = function () {
		var i, fragmentsLength = 0, cacheLength = 0;

		// Allow QUnit.reset to clean up any attached elements before checking for leaks
		QUnit.reset();

		for ( i in jQuery.cache ) {
			++cacheLength;
		}

		jQuery.fragments = {};

		for ( i in jQuery.fragments ) {
			++fragmentsLength;
		}

		// Because QUnit doesn't have a mechanism for retrieving the number of expected assertions for a test,
		// if we unconditionally assert any of these, the test will fail with too many assertions :|
		if ( cacheLength !== oldCacheLength ) {
			equal( cacheLength, oldCacheLength, "No unit tests leak memory in jQuery.cache" );
			oldCacheLength = cacheLength;
		}
		if ( fragmentsLength !== oldFragmentsLength ) {
			equal( fragmentsLength, oldFragmentsLength, "No unit tests leak memory in jQuery.fragments" );
			oldFragmentsLength = fragmentsLength;
		}
		if ( jQuery.timers.length !== oldTimersLength ) {
			equal( jQuery.timers.length, oldTimersLength, "No timers are still running" );
			oldTimersLength = jQuery.timers.length;
		}
		if ( jQuery.active !== oldActive ) {
			equal( jQuery.active, 0, "No AJAX requests are still active" );
			oldActive = jQuery.active;
		}
	}
}());
jQuery.noConflict(); // Allow the test to run with other libs or jQuery's.

// jQuery-specific QUnit.reset
(function() {
	var reset = QUnit.reset,
		ajaxSettings = jQuery.ajaxSettings;

	QUnit.reset = function() {
		reset.apply(this, arguments);
		jQuery.event.global = {};
		jQuery.ajaxSettings = jQuery.extend({}, ajaxSettings);
	};
})();

// load testswarm agent
(function() {
	var url = window.location.search;
	url = decodeURIComponent( url.slice( url.indexOf("swarmURL=") + 9 ) );
	if ( !url || url.indexOf("http") !== 0 ) {
		return;
	}

	// (Temporarily) Disable Ajax tests to reduce network strain
	// isLocal = QUnit.isLocal = true;

	document.write("<scr" + "ipt src='http://swarm.jquery.org/js/inject.js?" + (new Date).getTime() + "'></scr" + "ipt>");
})();
// Run minified source from dist (do make first)
// Should be loaded before QUnit but after src
(function() {
	if ( /jquery\=min/.test( window.location.search ) ) {
		jQuery.noConflict( true );
		document.write(unescape("%3Cscript%20src%3D%27../dist/jquery.min.js%27%3E%3C/script%3E"));
	}
})();
module("core", { teardown: moduleTeardown });

test("Basic requirements", function() {
	expect(7);
	ok( Array.prototype.push, "Array.push()" );
	ok( Function.prototype.apply, "Function.apply()" );
	ok( document.getElementById, "getElementById" );
	ok( document.getElementsByTagName, "getElementsByTagName" );
	ok( RegExp, "RegExp" );
	ok( jQuery, "jQuery" );
	ok( $, "$" );
});

test("jQuery()", function() {
	expect(29);

	// Basic constructor's behavior

	equal( jQuery().length, 0, "jQuery() === jQuery([])" );
	equal( jQuery(undefined).length, 0, "jQuery(undefined) === jQuery([])" );
	equal( jQuery(null).length, 0, "jQuery(null) === jQuery([])" );
	equal( jQuery("").length, 0, "jQuery('') === jQuery([])" );
	equal( jQuery("#").length, 0, "jQuery('#') === jQuery([])" );

	var obj = jQuery("div");
	equal( jQuery(obj).selector, "div", "jQuery(jQueryObj) == jQueryObj" );

		// can actually yield more than one, when iframes are included, the window is an array as well
	equal( jQuery(window).length, 1, "Correct number of elements generated for jQuery(window)" );


	var main = jQuery("#qunit-fixture");
	deepEqual( jQuery("div p", main).get(), q("sndp", "en", "sap"), "Basic selector with jQuery object as context" );

/*
	// disabled since this test was doing nothing. i tried to fix it but i'm not sure
	// what the expected behavior should even be. FF returns "\n" for the text node
	// make sure this is handled
	var crlfContainer = jQuery('<p>\r\n</p>');
	var x = crlfContainer.contents().get(0).nodeValue;
	equal( x, what???, "Check for \\r and \\n in jQuery()" );
*/

	/* // Disabled until we add this functionality in
	var pass = true;
	try {
		jQuery("<div>Testing</div>").appendTo(document.getElementById("iframe").contentDocument.body);
	} catch(e){
		pass = false;
	}
	ok( pass, "jQuery('&lt;tag&gt;') needs optional document parameter to ease cross-frame DOM wrangling, see #968" );*/

	var code = jQuery("<code/>");
	equal( code.length, 1, "Correct number of elements generated for code" );
	equal( code.parent().length, 0, "Make sure that the generated HTML has no parent." );
	var img = jQuery("<img/>");
	equal( img.length, 1, "Correct number of elements generated for img" );
	equal( img.parent().length, 0, "Make sure that the generated HTML has no parent." );
	var div = jQuery("<div/><hr/><code/><b/>");
	equal( div.length, 4, "Correct number of elements generated for div hr code b" );
	equal( div.parent().length, 0, "Make sure that the generated HTML has no parent." );

	equal( jQuery([1,2,3]).get(1), 2, "Test passing an array to the factory" );

	equal( jQuery(document.body).get(0), jQuery("body").get(0), "Test passing an html node to the factory" );

	var exec = false;

	var elem = jQuery("<div/>", {
		width: 10,
		css: { paddingLeft:1, paddingRight:1 },
		click: function(){ ok(exec, "Click executed."); },
		text: "test",
		"class": "test2",
		id: "test3"
	});

	equal( elem[0].style.width, "10px", "jQuery() quick setter width");
	equal( elem[0].style.paddingLeft, "1px", "jQuery quick setter css");
	equal( elem[0].style.paddingRight, "1px", "jQuery quick setter css");
	equal( elem[0].childNodes.length, 1, "jQuery quick setter text");
	equal( elem[0].firstChild.nodeValue, "test", "jQuery quick setter text");
	equal( elem[0].className, "test2", "jQuery() quick setter class");
	equal( elem[0].id, "test3", "jQuery() quick setter id");

	exec = true;
	elem.click();

	// manually clean up detached elements
	elem.remove();

	for ( var i = 0; i < 3; ++i ) {
		elem = jQuery("<input type='text' value='TEST' />");
	}
	equal( elem[0].defaultValue, "TEST", "Ensure cached nodes are cloned properly (Bug #6655)" );

	// manually clean up detached elements
	elem.remove();

	equal( jQuery(" <div/> ").length, 1, "Make sure whitespace is trimmed." );
	equal( jQuery(" a<div/>b ").length, 1, "Make sure whitespace and other characters are trimmed." );

	var long = "";
	for ( var i = 0; i < 128; i++ ) {
		long += "12345678";
	}

	equal( jQuery(" <div>" + long + "</div> ").length, 1, "Make sure whitespace is trimmed on long strings." );
	equal( jQuery(" a<div>" + long + "</div>b ").length, 1, "Make sure whitespace and other characters are trimmed on long strings." );
});

test("selector state", function() {
	expect(31);

	var test;

	test = jQuery(undefined);
	equal( test.selector, "", "Empty jQuery Selector" );
	equal( test.context, undefined, "Empty jQuery Context" );

	test = jQuery(document);
	equal( test.selector, "", "Document Selector" );
	equal( test.context, document, "Document Context" );

	test = jQuery(document.body);
	equal( test.selector, "", "Body Selector" );
	equal( test.context, document.body, "Body Context" );

	test = jQuery("#qunit-fixture");
	equal( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equal( test.context, document, "#qunit-fixture Context" );

	test = jQuery("#notfoundnono");
	equal( test.selector, "#notfoundnono", "#notfoundnono Selector" );
	equal( test.context, document, "#notfoundnono Context" );

	test = jQuery("#qunit-fixture", document);
	equal( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equal( test.context, document, "#qunit-fixture Context" );

	test = jQuery("#qunit-fixture", document.body);
	equal( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equal( test.context, document.body, "#qunit-fixture Context" );

	// Test cloning
	test = jQuery(test);
	equal( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equal( test.context, document.body, "#qunit-fixture Context" );

	test = jQuery(document.body).find("#qunit-fixture");
	equal( test.selector, "#qunit-fixture", "#qunit-fixture find Selector" );
	equal( test.context, document.body, "#qunit-fixture find Context" );

	test = jQuery("#qunit-fixture").filter("div");
	equal( test.selector, "#qunit-fixture.filter(div)", "#qunit-fixture filter Selector" );
	equal( test.context, document, "#qunit-fixture filter Context" );

	test = jQuery("#qunit-fixture").not("div");
	equal( test.selector, "#qunit-fixture.not(div)", "#qunit-fixture not Selector" );
	equal( test.context, document, "#qunit-fixture not Context" );

	test = jQuery("#qunit-fixture").filter("div").not("div");
	equal( test.selector, "#qunit-fixture.filter(div).not(div)", "#qunit-fixture filter, not Selector" );
	equal( test.context, document, "#qunit-fixture filter, not Context" );

	test = jQuery("#qunit-fixture").filter("div").not("div").end();
	equal( test.selector, "#qunit-fixture.filter(div)", "#qunit-fixture filter, not, end Selector" );
	equal( test.context, document, "#qunit-fixture filter, not, end Context" );

	test = jQuery("#qunit-fixture").parent("body");
	equal( test.selector, "#qunit-fixture.parent(body)", "#qunit-fixture parent Selector" );
	equal( test.context, document, "#qunit-fixture parent Context" );

	test = jQuery("#qunit-fixture").eq(0);
	equal( test.selector, "#qunit-fixture.slice(0,1)", "#qunit-fixture eq Selector" );
	equal( test.context, document, "#qunit-fixture eq Context" );

	var d = "<div />";
	equal(
		jQuery(d).appendTo(jQuery(d)).selector,
		jQuery(d).appendTo(d).selector,
		"manipulation methods make same selector for jQuery objects"
	);
});

test( "globalEval", function() {

	expect( 3 );

	jQuery.globalEval( "var globalEvalTest = true;" );
	ok( window.globalEvalTest, "Test variable declarations are global" );

	window.globalEvalTest = false;

	jQuery.globalEval( "globalEvalTest = true;" );
	ok( window.globalEvalTest, "Test variable assignments are global" );

	window.globalEvalTest = false;

	jQuery.globalEval( "this.globalEvalTest = true;" );
	ok( window.globalEvalTest, "Test context (this) is the window object" );

	window.globalEvalTest = undefined;
});



test("noConflict", function() {
	expect(7);

	var $$ = jQuery;

	equal( jQuery, jQuery.noConflict(), "noConflict returned the jQuery object" );
	equal( jQuery, $$, "Make sure jQuery wasn't touched." );
	equal( $, original$, "Make sure $ was reverted." );

	jQuery = $ = $$;

	equal( jQuery.noConflict(true), $$, "noConflict returned the jQuery object" );
	equal( jQuery, originaljQuery, "Make sure jQuery was reverted." );
	equal( $, original$, "Make sure $ was reverted." );
	ok( $$("#qunit-fixture").html("test"), "Make sure that jQuery still works." );

	jQuery = $$;
});

test("trim", function() {
	expect(9);

	var nbsp = String.fromCharCode(160);

	equal( jQuery.trim("hello  "), "hello", "trailing space" );
	equal( jQuery.trim("  hello"), "hello", "leading space" );
	equal( jQuery.trim("  hello   "), "hello", "space on both sides" );
	equal( jQuery.trim("  " + nbsp + "hello  " + nbsp + " "), "hello", "&nbsp;" );

	equal( jQuery.trim(), "", "Nothing in." );
	equal( jQuery.trim( undefined ), "", "Undefined" );
	equal( jQuery.trim( null ), "", "Null" );
	equal( jQuery.trim( 5 ), "5", "Number" );
	equal( jQuery.trim( false ), "false", "Boolean" );
});

test("type", function() {
	expect(23);

	equal( jQuery.type(null), "null", "null" );
	equal( jQuery.type(undefined), "undefined", "undefined" );
	equal( jQuery.type(true), "boolean", "Boolean" );
	equal( jQuery.type(false), "boolean", "Boolean" );
	equal( jQuery.type(Boolean(true)), "boolean", "Boolean" );
	equal( jQuery.type(0), "number", "Number" );
	equal( jQuery.type(1), "number", "Number" );
	equal( jQuery.type(Number(1)), "number", "Number" );
	equal( jQuery.type(""), "string", "String" );
	equal( jQuery.type("a"), "string", "String" );
	equal( jQuery.type(String("a")), "string", "String" );
	equal( jQuery.type({}), "object", "Object" );
	equal( jQuery.type(/foo/), "regexp", "RegExp" );
	equal( jQuery.type(new RegExp("asdf")), "regexp", "RegExp" );
	equal( jQuery.type([1]), "array", "Array" );
	equal( jQuery.type(new Date()), "date", "Date" );
	equal( jQuery.type(new Function("return;")), "function", "Function" );
	equal( jQuery.type(function(){}), "function", "Function" );
	equal( jQuery.type(window), "object", "Window" );
	equal( jQuery.type(document), "object", "Document" );
	equal( jQuery.type(document.body), "object", "Element" );
	equal( jQuery.type(document.createTextNode("foo")), "object", "TextNode" );
	equal( jQuery.type(document.getElementsByTagName("*")), "object", "NodeList" );
});

test("isPlainObject", function() {
	expect(15);

	stop();

	// The use case that we want to match
	ok(jQuery.isPlainObject({}), "{}");

	// Not objects shouldn't be matched
	ok(!jQuery.isPlainObject(""), "string");
	ok(!jQuery.isPlainObject(0) && !jQuery.isPlainObject(1), "number");
	ok(!jQuery.isPlainObject(true) && !jQuery.isPlainObject(false), "boolean");
	ok(!jQuery.isPlainObject(null), "null");
	ok(!jQuery.isPlainObject(undefined), "undefined");

	// Arrays shouldn't be matched
	ok(!jQuery.isPlainObject([]), "array");

	// Instantiated objects shouldn't be matched
	ok(!jQuery.isPlainObject(new Date), "new Date");

	var fn = function(){};

	// Functions shouldn't be matched
	ok(!jQuery.isPlainObject(fn), "fn");

	// Again, instantiated objects shouldn't be matched
	ok(!jQuery.isPlainObject(new fn), "new fn (no methods)");

	// Makes the function a little more realistic
	// (and harder to detect, incidentally)
	fn.prototype = {someMethod: function(){}};

	// Again, instantiated objects shouldn't be matched
	ok(!jQuery.isPlainObject(new fn), "new fn");

	// DOM Element
	ok(!jQuery.isPlainObject(document.createElement("div")), "DOM Element");

	// Window
	ok(!jQuery.isPlainObject(window), "window");

	try {
		jQuery.isPlainObject( window.location );
		ok( true, "Does not throw exceptions on host objects");
	} catch ( e ) {
		ok( false, "Does not throw exceptions on host objects -- FAIL");
	}

	try {
		var iframe = document.createElement("iframe");
		document.body.appendChild(iframe);

		window.iframeDone = function(otherObject){
			// Objects from other windows should be matched
			ok(jQuery.isPlainObject(new otherObject), "new otherObject");
			document.body.removeChild( iframe );
			start();
		};

		var doc = iframe.contentDocument || iframe.contentWindow.document;
		doc.open();
		doc.write("<body onload='window.parent.iframeDone(Object);'>");
		doc.close();
	} catch(e) {
		document.body.removeChild( iframe );

		ok(true, "new otherObject - iframes not supported");
		start();
	}
});

test("isFunction", function() {
	expect(19);

	// Make sure that false values return false
	ok( !jQuery.isFunction(), "No Value" );
	ok( !jQuery.isFunction( null ), "null Value" );
	ok( !jQuery.isFunction( undefined ), "undefined Value" );
	ok( !jQuery.isFunction( "" ), "Empty String Value" );
	ok( !jQuery.isFunction( 0 ), "0 Value" );

	// Check built-ins
	// Safari uses "(Internal Function)"
	ok( jQuery.isFunction(String), "String Function("+String+")" );
	ok( jQuery.isFunction(Array), "Array Function("+Array+")" );
	ok( jQuery.isFunction(Object), "Object Function("+Object+")" );
	ok( jQuery.isFunction(Function), "Function Function("+Function+")" );

	// When stringified, this could be misinterpreted
	var mystr = "function";
	ok( !jQuery.isFunction(mystr), "Function String" );

	// When stringified, this could be misinterpreted
	var myarr = [ "function" ];
	ok( !jQuery.isFunction(myarr), "Function Array" );

	// When stringified, this could be misinterpreted
	var myfunction = { "function": "test" };
	ok( !jQuery.isFunction(myfunction), "Function Object" );

	// Make sure normal functions still work
	var fn = function(){};
	ok( jQuery.isFunction(fn), "Normal Function" );

	var obj = document.createElement("object");

	// Firefox says this is a function
	ok( !jQuery.isFunction(obj), "Object Element" );

	// IE says this is an object
	// Since 1.3, this isn't supported (#2968)
	//ok( jQuery.isFunction(obj.getAttribute), "getAttribute Function" );

	var nodes = document.body.childNodes;

	// Safari says this is a function
	ok( !jQuery.isFunction(nodes), "childNodes Property" );

	var first = document.body.firstChild;

	// Normal elements are reported ok everywhere
	ok( !jQuery.isFunction(first), "A normal DOM Element" );

	var input = document.createElement("input");
	input.type = "text";
	document.body.appendChild( input );

	// IE says this is an object
	// Since 1.3, this isn't supported (#2968)
	//ok( jQuery.isFunction(input.focus), "A default function property" );

	document.body.removeChild( input );

	var a = document.createElement("a");
	a.href = "some-function";
	document.body.appendChild( a );

	// This serializes with the word 'function' in it
	ok( !jQuery.isFunction(a), "Anchor Element" );

	document.body.removeChild( a );

	// Recursive function calls have lengths and array-like properties
	function callme(callback){
		function fn(response){
			callback(response);
		}

		ok( jQuery.isFunction(fn), "Recursive Function Call" );

		fn({ some: "data" });
	};

	callme(function(){
		callme(function(){});
	});
});

test( "isNumeric", function() {
	expect( 37 );

	var t = jQuery.isNumeric,
		Traditionalists = function(n) {
			this.value = n;
			this.toString = function(){
				return String(this.value);
			};
		},
		answer = new Traditionalists( "42" ),
		rong = new Traditionalists( "Devo" );

	ok( t("-10"), "Negative integer string");
	ok( t("0"), "Zero string");
	ok( t("5"), "Positive integer string");
	ok( t(-16), "Negative integer number");
	ok( t(0), "Zero integer number");
	ok( t(32), "Positive integer number");
	ok( t("040"), "Octal integer literal string");
	ok( t(0144), "Octal integer literal");
	ok( t("0xFF"), "Hexadecimal integer literal string");
	ok( t(0xFFF), "Hexadecimal integer literal");
	ok( t("-1.6"), "Negative floating point string");
	ok( t("4.536"), "Positive floating point string");
	ok( t(-2.6), "Negative floating point number");
	ok( t(3.1415), "Positive floating point number");
	ok( t(8e5), "Exponential notation");
	ok( t("123e-2"), "Exponential notation string");
	ok( t(answer), "Custom .toString returning number");
	equal( t(""), false, "Empty string");
	equal( t("        "), false, "Whitespace characters string");
	equal( t("\t\t"), false, "Tab characters string");
	equal( t("abcdefghijklm1234567890"), false, "Alphanumeric character string");
	equal( t("xabcdefx"), false, "Non-numeric character string");
	equal( t(true), false, "Boolean true literal");
	equal( t(false), false, "Boolean false literal");
	equal( t("bcfed5.2"), false, "Number with preceding non-numeric characters");
	equal( t("7.2acdgs"), false, "Number with trailling non-numeric characters");
	equal( t(undefined), false, "Undefined value");
	equal( t(null), false, "Null value");
	equal( t(NaN), false, "NaN value");
	equal( t(Infinity), false, "Infinity primitive");
	equal( t(Number.POSITIVE_INFINITY), false, "Positive Infinity");
	equal( t(Number.NEGATIVE_INFINITY), false, "Negative Infinity");
	equal( t(rong), false, "Custom .toString returning non-number");
	equal( t({}), false, "Empty object");
	equal( t(function(){} ), false, "Instance of a function");
	equal( t( new Date ), false, "Instance of a Date");
	equal( t(function(){} ), false, "Instance of a function");
});

test("isXMLDoc - HTML", function() {
	expect(4);

	ok( !jQuery.isXMLDoc( document ), "HTML document" );
	ok( !jQuery.isXMLDoc( document.documentElement ), "HTML documentElement" );
	ok( !jQuery.isXMLDoc( document.body ), "HTML Body Element" );

	var iframe = document.createElement("iframe");
	document.body.appendChild( iframe );

	try {
		var body = jQuery(iframe).contents()[0];

		try {
			ok( !jQuery.isXMLDoc( body ), "Iframe body element" );
		} catch(e) {
			ok( false, "Iframe body element exception" );
		}

	} catch(e) {
		ok( true, "Iframe body element - iframe not working correctly" );
	}

	document.body.removeChild( iframe );
});

test("XSS via location.hash", function() {
	expect(1);

	stop();
	jQuery._check9521 = function(x){
		ok( x, "script called from #id-like selector with inline handler" );
		jQuery("#check9521").remove();
		delete jQuery._check9521;
		start();
	};
	try {
		// This throws an error because it's processed like an id
		jQuery( '#<img id="check9521" src="no-such-.gif" onerror="jQuery._check9521(false)">' ).appendTo("#qunit-fixture");
	} catch (err) {
		jQuery._check9521(true);
	};
});

if ( !isLocal ) {
test("isXMLDoc - XML", function() {
	expect(3);
	stop();
	jQuery.get("data/dashboard.xml", function(xml) {
		ok( jQuery.isXMLDoc( xml ), "XML document" );
		ok( jQuery.isXMLDoc( xml.documentElement ), "XML documentElement" );
		ok( jQuery.isXMLDoc( jQuery("tab", xml)[0] ), "XML Tab Element" );
		start();
	});
});
}

test("isWindow", function() {
	expect( 12 );

	ok( jQuery.isWindow(window), "window" );
	ok( !jQuery.isWindow(), "empty" );
	ok( !jQuery.isWindow(null), "null" );
	ok( !jQuery.isWindow(undefined), "undefined" );
	ok( !jQuery.isWindow(document), "document" );
	ok( !jQuery.isWindow(document.documentElement), "documentElement" );
	ok( !jQuery.isWindow(""), "string" );
	ok( !jQuery.isWindow(1), "number" );
	ok( !jQuery.isWindow(true), "boolean" );
	ok( !jQuery.isWindow({}), "object" );
	// HMMM
	// ok( !jQuery.isWindow({ setInterval: function(){} }), "fake window" );
	ok( !jQuery.isWindow(/window/), "regexp" );
	ok( !jQuery.isWindow(function(){}), "function" );
});

test("jQuery('html')", function() {
	expect(18);

	QUnit.reset();
	jQuery.foo = false;
	var s = jQuery("<script>jQuery.foo='test';</script>")[0];
	ok( s, "Creating a script" );
	ok( !jQuery.foo, "Make sure the script wasn't executed prematurely" );
	jQuery("body").append("<script>jQuery.foo='test';</script>");
	ok( jQuery.foo, "Executing a scripts contents in the right context" );

	// Test multi-line HTML
	var div = jQuery("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>")[0];
	equal( div.nodeName.toUpperCase(), "DIV", "Make sure we're getting a div." );
	equal( div.firstChild.nodeType, 3, "Text node." );
	equal( div.lastChild.nodeType, 3, "Text node." );
	equal( div.childNodes[1].nodeType, 1, "Paragraph." );
	equal( div.childNodes[1].firstChild.nodeType, 3, "Paragraph text." );

	QUnit.reset();
	ok( jQuery("<link rel='stylesheet'/>")[0], "Creating a link" );

	ok( !jQuery("<script/>")[0].parentNode, "Create a script" );

	ok( jQuery("<input/>").attr("type", "hidden"), "Create an input and set the type." );

	var j = jQuery("<span>hi</span> there <!-- mon ami -->");
	ok( j.length >= 2, "Check node,textnode,comment creation (some browsers delete comments)" );

	ok( !jQuery("<option>test</option>")[0].selected, "Make sure that options are auto-selected #2050" );

	ok( jQuery("<div></div>")[0], "Create a div with closing tag." );
	ok( jQuery("<table></table>")[0], "Create a table with closing tag." );

	// Test very large html string #7990
	var i;
	var li = "<li>very large html string</li>";
	var html = ["<ul>"];
	for ( i = 0; i < 50000; i += 1 ) {
		html.push(li);
	}
	html.push("</ul>");
	html = jQuery(html.join(""))[0];
	equal( html.nodeName.toUpperCase(), "UL");
	equal( html.firstChild.nodeName.toUpperCase(), "LI");
	equal( html.childNodes.length, 50000 );
});

test("jQuery('html', context)", function() {
	expect(1);

	var $div = jQuery("<div/>")[0];
	var $span = jQuery("<span/>", $div);
	equal($span.length, 1, "Verify a span created with a div context works, #1763");
});

if ( !isLocal ) {
test("jQuery(selector, xml).text(str) - Loaded via XML document", function() {
	expect(2);
	stop();
	jQuery.get("data/dashboard.xml", function(xml) {
		// tests for #1419 where IE was a problem
		var tab = jQuery("tab", xml).eq(0);
		equal( tab.text(), "blabla", "Verify initial text correct" );
		tab.text("newtext");
		equal( tab.text(), "newtext", "Verify new text correct" );
		start();
	});
});
}

test("end()", function() {
	expect(3);
	equal( "Yahoo", jQuery("#yahoo").parent().end().text(), "Check for end" );
	ok( jQuery("#yahoo").end(), "Check for end with nothing to end" );

	var x = jQuery("#yahoo");
	x.parent();
	equal( "Yahoo", jQuery("#yahoo").text(), "Check for non-destructive behaviour" );
});

test("length", function() {
	expect(1);
	equal( jQuery("#qunit-fixture p").length, 6, "Get Number of Elements Found" );
});

test("size()", function() {
	expect(1);
	equal( jQuery("#qunit-fixture p").size(), 6, "Get Number of Elements Found" );
});

test("get()", function() {
	expect(1);
	deepEqual( jQuery("#qunit-fixture p").get(), q("firstp","ap","sndp","en","sap","first"), "Get All Elements" );
});

test("toArray()", function() {
	expect(1);
	deepEqual( jQuery("#qunit-fixture p").toArray(),
		q("firstp","ap","sndp","en","sap","first"),
		"Convert jQuery object to an Array" )
})

test("inArray()", function() {
	expect(19);

	var selections = {
		p:   q("firstp", "sap", "ap", "first"),
		em:  q("siblingnext", "siblingfirst"),
		div: q("qunit-testrunner-toolbar", "nothiddendiv", "nothiddendivchild", "foo"),
		a:   q("mark", "groups", "google", "simon1"),
		empty: []
	},
	tests = {
		p:    { elem: jQuery("#ap")[0],           index: 2 },
		em:   { elem: jQuery("#siblingfirst")[0], index: 1 },
		div:  { elem: jQuery("#nothiddendiv")[0], index: 1 },
		a:    { elem: jQuery("#simon1")[0],       index: 3 }
	},
	falseTests = {
		p:  jQuery("#liveSpan1")[0],
		em: jQuery("#nothiddendiv")[0],
		empty: ""
	};

	jQuery.each( tests, function( key, obj ) {
		equal( jQuery.inArray( obj.elem, selections[ key ] ), obj.index, "elem is in the array of selections of its tag" );
		// Third argument (fromIndex)
		equal( !!~jQuery.inArray( obj.elem, selections[ key ], 5 ), false, "elem is NOT in the array of selections given a starting index greater than its position" );
		equal( !!~jQuery.inArray( obj.elem, selections[ key ], 1 ), true, "elem is in the array of selections given a starting index less than or equal to its position" );
		equal( !!~jQuery.inArray( obj.elem, selections[ key ], -3 ), true, "elem is in the array of selections given a negative index" );
	});

	jQuery.each( falseTests, function( key, elem ) {
		equal( !!~jQuery.inArray( elem, selections[ key ] ), false, "elem is NOT in the array of selections" );
	});

});

test("get(Number)", function() {
	expect(2);
	equal( jQuery("#qunit-fixture p").get(0), document.getElementById("firstp"), "Get A Single Element" );
	strictEqual( jQuery("#firstp").get(1), undefined, "Try get with index larger elements count" );
});

test("get(-Number)",function() {
	expect(2);
	equal( jQuery("p").get(-1), document.getElementById("first"), "Get a single element with negative index" );
	strictEqual( jQuery("#firstp").get(-2), undefined, "Try get with index negative index larger then elements count" );
})

test("each(Function)", function() {
	expect(1);
	var div = jQuery("div");
	div.each(function(){this.foo = "zoo";});
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
		if ( div.get(i).foo != "zoo" ) pass = false;
	}
	ok( pass, "Execute a function, Relative" );
});

test("slice()", function() {
	expect(7);

	var $links = jQuery("#ap a");

	deepEqual( $links.slice(1,2).get(), q("groups"), "slice(1,2)" );
	deepEqual( $links.slice(1).get(), q("groups", "anchor1", "mark"), "slice(1)" );
	deepEqual( $links.slice(0,3).get(), q("google", "groups", "anchor1"), "slice(0,3)" );
	deepEqual( $links.slice(-1).get(), q("mark"), "slice(-1)" );

	deepEqual( $links.eq(1).get(), q("groups"), "eq(1)" );
	deepEqual( $links.eq("2").get(), q("anchor1"), "eq('2')" );
	deepEqual( $links.eq(-1).get(), q("mark"), "eq(-1)" );
});

test("first()/last()", function() {
	expect(4);

	var $links = jQuery("#ap a"), $none = jQuery("asdf");

	deepEqual( $links.first().get(), q("google"), "first()" );
	deepEqual( $links.last().get(), q("mark"), "last()" );

	deepEqual( $none.first().get(), [], "first() none" );
	deepEqual( $none.last().get(), [], "last() none" );
});

test("map()", function() {
	expect(8);

	deepEqual(
		jQuery("#ap").map(function(){
			return jQuery(this).find("a").get();
		}).get(),
		q("google", "groups", "anchor1", "mark"),
		"Array Map"
	);

	deepEqual(
		jQuery("#ap > a").map(function(){
			return this.parentNode;
		}).get(),
		q("ap","ap","ap"),
		"Single Map"
	);

	//for #2616
	var keys = jQuery.map( {a:1,b:2}, function( v, k ){
		return k;
	});
	equal( keys.join(""), "ab", "Map the keys from a hash to an array" );

	var values = jQuery.map( {a:1,b:2}, function( v, k ){
		return v;
	});
	equal( values.join(""), "12", "Map the values from a hash to an array" );

	// object with length prop
	var values = jQuery.map( {a:1,b:2, length:3}, function( v, k ){
		return v;
	});
	equal( values.join(""), "123", "Map the values from a hash with a length property to an array" );

	var scripts = document.getElementsByTagName("script");
	var mapped = jQuery.map( scripts, function( v, k ){
		return v;
	});
	equal( mapped.length, scripts.length, "Map an array(-like) to a hash" );

	var nonsense = document.getElementsByTagName("asdf");
	var mapped = jQuery.map( nonsense, function( v, k ){
		return v;
	});
	equal( mapped.length, nonsense.length, "Map an empty array(-like) to a hash" );

	var flat = jQuery.map( Array(4), function( v, k ){
		return k % 2 ? k : [k,k,k];//try mixing array and regular returns
	});
	equal( flat.join(""), "00012223", "try the new flatten technique(#2616)" );
});

test("jQuery.merge()", function() {
	expect(8);

	var parse = jQuery.merge;

	deepEqual( parse([],[]), [], "Empty arrays" );

	deepEqual( parse([1],[2]), [1,2], "Basic" );
	deepEqual( parse([1,2],[3,4]), [1,2,3,4], "Basic" );

	deepEqual( parse([1,2],[]), [1,2], "Second empty" );
	deepEqual( parse([],[1,2]), [1,2], "First empty" );

	// Fixed at [5998], #3641
	deepEqual( parse([-2,-1], [0,1,2]), [-2,-1,0,1,2], "Second array including a zero (falsy)");

	// After fixing #5527
	deepEqual( parse([], [null, undefined]), [null, undefined], "Second array including null and undefined values");
	deepEqual( parse({length:0}, [1,2]), {length:2, 0:1, 1:2}, "First array like");
});

test("jQuery.extend(Object, Object)", function() {
	expect(28);

	var settings = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		options = { xnumber2: 1, xstring2: "x", xxx: "newstring" },
		optionsCopy = { xnumber2: 1, xstring2: "x", xxx: "newstring" },
		merged = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "x", xxx: "newstring" },
		deep1 = { foo: { bar: true } },
		deep1copy = { foo: { bar: true } },
		deep2 = { foo: { baz: true }, foo2: document },
		deep2copy = { foo: { baz: true }, foo2: document },
		deepmerged = { foo: { bar: true, baz: true }, foo2: document },
		arr = [1, 2, 3],
		nestedarray = { arr: arr };

	jQuery.extend(settings, options);
	deepEqual( settings, merged, "Check if extended: settings must be extended" );
	deepEqual( options, optionsCopy, "Check if not modified: options must not be modified" );

	jQuery.extend(settings, null, options);
	deepEqual( settings, merged, "Check if extended: settings must be extended" );
	deepEqual( options, optionsCopy, "Check if not modified: options must not be modified" );

	jQuery.extend(true, deep1, deep2);
	deepEqual( deep1.foo, deepmerged.foo, "Check if foo: settings must be extended" );
	deepEqual( deep2.foo, deep2copy.foo, "Check if not deep2: options must not be modified" );
	equal( deep1.foo2, document, "Make sure that a deep clone was not attempted on the document" );

	ok( jQuery.extend(true, {}, nestedarray).arr !== arr, "Deep extend of object must clone child array" );

	// #5991
	ok( jQuery.isArray( jQuery.extend(true, { arr: {} }, nestedarray).arr ), "Cloned array heve to be an Array" );
	ok( jQuery.isPlainObject( jQuery.extend(true, { arr: arr }, { arr: {} }).arr ), "Cloned object heve to be an plain object" );

	var empty = {};
	var optionsWithLength = { foo: { length: -1 } };
	jQuery.extend(true, empty, optionsWithLength);
	deepEqual( empty.foo, optionsWithLength.foo, "The length property must copy correctly" );

	empty = {};
	var optionsWithDate = { foo: { date: new Date } };
	jQuery.extend(true, empty, optionsWithDate);
	deepEqual( empty.foo, optionsWithDate.foo, "Dates copy correctly" );

	var myKlass = function() {};
	var customObject = new myKlass();
	var optionsWithCustomObject = { foo: { date: customObject } };
	empty = {};
	jQuery.extend(true, empty, optionsWithCustomObject);
	ok( empty.foo && empty.foo.date === customObject, "Custom objects copy correctly (no methods)" );

	// Makes the class a little more realistic
	myKlass.prototype = { someMethod: function(){} };
	empty = {};
	jQuery.extend(true, empty, optionsWithCustomObject);
	ok( empty.foo && empty.foo.date === customObject, "Custom objects copy correctly" );

	var ret = jQuery.extend(true, { foo: 4 }, { foo: new Number(5) } );
	ok( ret.foo == 5, "Wrapped numbers copy correctly" );

	var nullUndef;
	nullUndef = jQuery.extend({}, options, { xnumber2: null });
	ok( nullUndef.xnumber2 === null, "Check to make sure null values are copied");

	nullUndef = jQuery.extend({}, options, { xnumber2: undefined });
	ok( nullUndef.xnumber2 === options.xnumber2, "Check to make sure undefined values are not copied");

	nullUndef = jQuery.extend({}, options, { xnumber0: null });
	ok( nullUndef.xnumber0 === null, "Check to make sure null values are inserted");

	var target = {};
	var recursive = { foo:target, bar:5 };
	jQuery.extend(true, target, recursive);
	deepEqual( target, { bar:5 }, "Check to make sure a recursive obj doesn't go never-ending loop by not copying it over" );

	var ret = jQuery.extend(true, { foo: [] }, { foo: [0] } ); // 1907
	equal( ret.foo.length, 1, "Check to make sure a value with coersion 'false' copies over when necessary to fix #1907" );

	var ret = jQuery.extend(true, { foo: "1,2,3" }, { foo: [1, 2, 3] } );
	ok( typeof ret.foo != "string", "Check to make sure values equal with coersion (but not actually equal) overwrite correctly" );

	var ret = jQuery.extend(true, { foo:"bar" }, { foo:null } );
	ok( typeof ret.foo !== "undefined", "Make sure a null value doesn't crash with deep extend, for #1908" );

	var obj = { foo:null };
	jQuery.extend(true, obj, { foo:"notnull" } );
	equal( obj.foo, "notnull", "Make sure a null value can be overwritten" );

	function func() {}
	jQuery.extend(func, { key: "value" } );
	equal( func.key, "value", "Verify a function can be extended" );

	var defaults = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		defaultsCopy = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		options1 = { xnumber2: 1, xstring2: "x" },
		options1Copy = { xnumber2: 1, xstring2: "x" },
		options2 = { xstring2: "xx", xxx: "newstringx" },
		options2Copy = { xstring2: "xx", xxx: "newstringx" },
		merged2 = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "xx", xxx: "newstringx" };

	var settings = jQuery.extend({}, defaults, options1, options2);
	deepEqual( settings, merged2, "Check if extended: settings must be extended" );
	deepEqual( defaults, defaultsCopy, "Check if not modified: options1 must not be modified" );
	deepEqual( options1, options1Copy, "Check if not modified: options1 must not be modified" );
	deepEqual( options2, options2Copy, "Check if not modified: options2 must not be modified" );
});

test("jQuery.each(Object,Function)", function() {
	expect(14);
	jQuery.each( [0,1,2], function(i, n){
		equal( i, n, "Check array iteration" );
	});

	jQuery.each( [5,6,7], function(i, n){
		equal( i, n - 5, "Check array iteration" );
	});

	jQuery.each( { name: "name", lang: "lang" }, function(i, n){
		equal( i, n, "Check object iteration" );
	});

	var total = 0;
	jQuery.each([1,2,3], function(i,v){ total += v; });
	equal( total, 6, "Looping over an array" );
	total = 0;
	jQuery.each([1,2,3], function(i,v){ total += v; if ( i == 1 ) return false; });
	equal( total, 3, "Looping over an array, with break" );
	total = 0;
	jQuery.each({"a":1,"b":2,"c":3}, function(i,v){ total += v; });
	equal( total, 6, "Looping over an object" );
	total = 0;
	jQuery.each({"a":3,"b":3,"c":3}, function(i,v){ total += v; return false; });
	equal( total, 3, "Looping over an object, with break" );

	var f = function(){};
	f.foo = "bar";
	jQuery.each(f, function(i){
		f[i] = "baz";
	});
	equal( "baz", f.foo, "Loop over a function" );

	var stylesheet_count = 0;
	jQuery.each(document.styleSheets, function(i){
		stylesheet_count++;
	});
	//html5shiv may add 1-2 stylesheets
	ok(stylesheet_count > 1 && stylesheet_count < 5, "should not throw an error in IE while looping over document.styleSheets and return proper amount");

});

test("jQuery.makeArray", function(){
	expect(17);

	equal( jQuery.makeArray(jQuery("html>*"))[0].nodeName.toUpperCase(), "HEAD", "Pass makeArray a jQuery object" );

	equal( jQuery.makeArray(document.getElementsByName("PWD")).slice(0,1)[0].name, "PWD", "Pass makeArray a nodelist" );

	equal( (function(){ return jQuery.makeArray(arguments); })(1,2).join(""), "12", "Pass makeArray an arguments array" );

	equal( jQuery.makeArray([1,2,3]).join(""), "123", "Pass makeArray a real array" );

	equal( jQuery.makeArray().length, 0, "Pass nothing to makeArray and expect an empty array" );

	equal( jQuery.makeArray( 0 )[0], 0 , "Pass makeArray a number" );

	equal( jQuery.makeArray( "foo" )[0], "foo", "Pass makeArray a string" );

	equal( jQuery.makeArray( true )[0].constructor, Boolean, "Pass makeArray a boolean" );

	equal( jQuery.makeArray( document.createElement("div") )[0].nodeName.toUpperCase(), "DIV", "Pass makeArray a single node" );

	equal( jQuery.makeArray( {length:2, 0:"a", 1:"b"} ).join(""), "ab", "Pass makeArray an array like map (with length)" );

	ok( !!jQuery.makeArray( document.documentElement.childNodes ).slice(0,1)[0].nodeName, "Pass makeArray a childNodes array" );

	// function, is tricky as it has length
	equal( jQuery.makeArray( function(){ return 1;} )[0](), 1, "Pass makeArray a function" );

	//window, also has length
	equal( jQuery.makeArray(window)[0], window, "Pass makeArray the window" );

	equal( jQuery.makeArray(/a/)[0].constructor, RegExp, "Pass makeArray a regex" );

	ok( jQuery.makeArray(document.getElementById("form")).length >= 13, "Pass makeArray a form (treat as elements)" );

	// For #5610
	deepEqual( jQuery.makeArray({length: "0"}), [], "Make sure object is coerced properly.");
	deepEqual( jQuery.makeArray({length: "5"}), [], "Make sure object is coerced properly.");
});

test("jQuery.inArray", function(){
	expect(3);

	equal( jQuery.inArray( 0, false ), -1 , "Search in 'false' as array returns -1 and doesn't throw exception" );

	equal( jQuery.inArray( 0, null ), -1 , "Search in 'null' as array returns -1 and doesn't throw exception" );

	equal( jQuery.inArray( 0, undefined ), -1 , "Search in 'undefined' as array returns -1 and doesn't throw exception" );
});

test("jQuery.isEmptyObject", function(){
	expect(2);

	equal(true, jQuery.isEmptyObject({}), "isEmptyObject on empty object literal" );
	equal(false, jQuery.isEmptyObject({a:1}), "isEmptyObject on non-empty object literal" );

	// What about this ?
	// equal(true, jQuery.isEmptyObject(null), "isEmptyObject on null" );
});

test("jQuery.proxy", function(){
	expect(7);

	var test = function(){ equal( this, thisObject, "Make sure that scope is set properly." ); };
	var thisObject = { foo: "bar", method: test };

	// Make sure normal works
	test.call( thisObject );

	// Basic scoping
	jQuery.proxy( test, thisObject )();

	// Another take on it
	jQuery.proxy( thisObject, "method" )();

	// Make sure it doesn't freak out
	equal( jQuery.proxy( null, thisObject ), undefined, "Make sure no function was returned." );

        // Partial application
        var test2 = function( a ){ equal( a, "pre-applied", "Ensure arguments can be pre-applied." ); };
        jQuery.proxy( test2, null, "pre-applied" )();

        // Partial application w/ normal arguments
        var test3 = function( a, b ){ equal( b, "normal", "Ensure arguments can be pre-applied and passed as usual." ); };
        jQuery.proxy( test3, null, "pre-applied" )( "normal" );

	// Test old syntax
	var test4 = { meth: function( a ){ equal( a, "boom", "Ensure old syntax works." ); } };
	jQuery.proxy( test4, "meth" )( "boom" );
});

test("jQuery.parseJSON", function(){
	expect(8);

	equal( jQuery.parseJSON(), null, "Nothing in, null out." );
	equal( jQuery.parseJSON( null ), null, "Nothing in, null out." );
	equal( jQuery.parseJSON( "" ), null, "Nothing in, null out." );

	deepEqual( jQuery.parseJSON("{}"), {}, "Plain object parsing." );
	deepEqual( jQuery.parseJSON("{\"test\":1}"), {"test":1}, "Plain object parsing." );

	deepEqual( jQuery.parseJSON("\n{\"test\":1}"), {"test":1}, "Make sure leading whitespaces are handled." );

	try {
		jQuery.parseJSON("{a:1}");
		ok( false, "Test malformed JSON string." );
	} catch( e ) {
		ok( true, "Test malformed JSON string." );
	}

	try {
		jQuery.parseJSON("{'a':1}");
		ok( false, "Test malformed JSON string." );
	} catch( e ) {
		ok( true, "Test malformed JSON string." );
	}
});

test("jQuery.parseXML", 4, function(){
	var xml, tmp;
	try {
		xml = jQuery.parseXML( "<p>A <b>well-formed</b> xml string</p>" );
		tmp = xml.getElementsByTagName( "p" )[ 0 ];
		ok( !!tmp, "<p> present in document" );
		tmp = tmp.getElementsByTagName( "b" )[ 0 ];
		ok( !!tmp, "<b> present in document" );
		strictEqual( tmp.childNodes[ 0 ].nodeValue, "well-formed", "<b> text is as expected" );
	} catch (e) {
		strictEqual( e, undefined, "unexpected error" );
	}
	try {
		xml = jQuery.parseXML( "<p>Not a <<b>well-formed</b> xml string</p>" );
		ok( false, "invalid xml not detected" );
	} catch( e ) {
		strictEqual( e.message, "Invalid XML: <p>Not a <<b>well-formed</b> xml string</p>", "invalid xml detected" );
	}
});

test("jQuery.sub() - Static Methods", function(){
    expect(18);
    var Subclass = jQuery.sub();
    Subclass.extend({
        topLevelMethod: function() {return this.debug;},
        debug: false,
        config: {
            locale: "en_US"
        },
        setup: function(config) {
            this.extend(true, this.config, config);
        }
    });
    Subclass.fn.extend({subClassMethod: function() { return this;}});

    //Test Simple Subclass
    ok(Subclass.topLevelMethod() === false, "Subclass.topLevelMethod thought debug was true");
    ok(Subclass.config.locale == "en_US", Subclass.config.locale + " is wrong!");
    deepEqual(Subclass.config.test, undefined, "Subclass.config.test is set incorrectly");
    equal(jQuery.ajax, Subclass.ajax, "The subclass failed to get all top level methods");

    //Create a SubSubclass
    var SubSubclass = Subclass.sub();

    //Make Sure the SubSubclass inherited properly
    ok(SubSubclass.topLevelMethod() === false, "SubSubclass.topLevelMethod thought debug was true");
    ok(SubSubclass.config.locale == "en_US", SubSubclass.config.locale + " is wrong!");
    deepEqual(SubSubclass.config.test, undefined, "SubSubclass.config.test is set incorrectly");
    equal(jQuery.ajax, SubSubclass.ajax, "The subsubclass failed to get all top level methods");

    //Modify The Subclass and test the Modifications
    SubSubclass.fn.extend({subSubClassMethod: function() { return this;}});
    SubSubclass.setup({locale: "es_MX", test: "worked"});
    SubSubclass.debug = true;
    SubSubclass.ajax = function() {return false;};
    ok(SubSubclass.topLevelMethod(), "SubSubclass.topLevelMethod thought debug was false");
    deepEqual(SubSubclass(document).subClassMethod, Subclass.fn.subClassMethod, "Methods Differ!");
    ok(SubSubclass.config.locale == "es_MX", SubSubclass.config.locale + " is wrong!");
    ok(SubSubclass.config.test == "worked", "SubSubclass.config.test is set incorrectly");
    notEqual(jQuery.ajax, SubSubclass.ajax, "The subsubclass failed to get all top level methods");

    //This shows that the modifications to the SubSubClass did not bubble back up to it's superclass
    ok(Subclass.topLevelMethod() === false, "Subclass.topLevelMethod thought debug was true");
    ok(Subclass.config.locale == "en_US", Subclass.config.locale + " is wrong!");
    deepEqual(Subclass.config.test, undefined, "Subclass.config.test is set incorrectly");
    deepEqual(Subclass(document).subSubClassMethod, undefined, "subSubClassMethod set incorrectly");
    equal(jQuery.ajax, Subclass.ajax, "The subclass failed to get all top level methods");
});

test("jQuery.sub() - .fn Methods", function(){
	expect(378);

	var Subclass = jQuery.sub(),
			SubclassSubclass = Subclass.sub(),
			jQueryDocument = jQuery(document),
			selectors, contexts, methods, method, arg, description;

	jQueryDocument.toString = function(){ return "jQueryDocument"; };

	Subclass.fn.subclassMethod = function(){};
	SubclassSubclass.fn.subclassSubclassMethod = function(){};

	selectors = [
		"body",
		"html, body",
		"<div></div>"
	];

	methods = [ // all methods that return a new jQuery instance
		["eq", 1],
		["add", document],
		["end"],
		["has"],
		["closest", "div"],
		["filter", document],
		["find", "div"]
	];

	contexts = [undefined, document, jQueryDocument];

	jQuery.each(selectors, function(i, selector){

		jQuery.each(methods, function(){
			method = this[0];
			arg = this[1];

			jQuery.each(contexts, function(i, context){

				description = "(\""+selector+"\", "+context+")."+method+"("+(arg||"")+")";

				deepEqual(
					jQuery(selector, context)[method](arg).subclassMethod, undefined,
					"jQuery"+description+" doesn't have Subclass methods"
				);
				deepEqual(
					jQuery(selector, context)[method](arg).subclassSubclassMethod, undefined,
					"jQuery"+description+" doesn't have SubclassSubclass methods"
				);
				deepEqual(
					Subclass(selector, context)[method](arg).subclassMethod, Subclass.fn.subclassMethod,
					"Subclass"+description+" has Subclass methods"
				);
				deepEqual(
					Subclass(selector, context)[method](arg).subclassSubclassMethod, undefined,
					"Subclass"+description+" doesn't have SubclassSubclass methods"
				);
				deepEqual(
					SubclassSubclass(selector, context)[method](arg).subclassMethod, Subclass.fn.subclassMethod,
					"SubclassSubclass"+description+" has Subclass methods"
				);
				deepEqual(
					SubclassSubclass(selector, context)[method](arg).subclassSubclassMethod, SubclassSubclass.fn.subclassSubclassMethod,
					"SubclassSubclass"+description+" has SubclassSubclass methods"
				);

			});
		});
	});

});

test("jQuery.camelCase()", function() {

	var tests = {
		"foo-bar": "fooBar",
		"foo-bar-baz": "fooBarBaz",
		"girl-u-want": "girlUWant",
		"the-4th-dimension": "the4thDimension",
		"-o-tannenbaum": "OTannenbaum",
		"-moz-illa": "MozIlla",
		"-ms-take": "msTake"
	};

	expect(7);

	jQuery.each( tests, function( key, val ) {
		equal( jQuery.camelCase( key ), val, "Converts: " + key + " => " + val );
	});
});
module("manipulation", { teardown: moduleTeardown });

// Ensure that an extended Array prototype doesn't break jQuery
Array.prototype.arrayProtoFn = function(arg) { throw("arrayProtoFn should not be called"); };

var bareObj = function(value) { return value; };
var functionReturningObj = function(value) { return (function() { return value; }); };

test("text()", function() {
	expect(3);
	var expected = "This link has class=\"blog\": Simon Willison's Weblog";
	equal( jQuery("#sap").text(), expected, "Check for merged text of more then one element." );

	// Check serialization of text values
	equal( jQuery(document.createTextNode("foo")).text(), "foo", "Text node was retreived from .text()." );
	notEqual( jQuery(document).text(), "", "Retrieving text for the document retrieves all text (#10724).");
});

var testText = function(valueObj) {
	expect(4);
	var val = valueObj("<div><b>Hello</b> cruel world!</div>");
	equal( jQuery("#foo").text(val)[0].innerHTML.replace(/>/g, "&gt;"), "&lt;div&gt;&lt;b&gt;Hello&lt;/b&gt; cruel world!&lt;/div&gt;", "Check escaped text" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.text(valueObj("hi!"));
	equal( jQuery(j[0]).text(), "hi!", "Check node,textnode,comment with text()" );
	equal( j[1].nodeValue, " there ", "Check node,textnode,comment with text()" );

	// Blackberry 4.6 doesn't maintain comments in the DOM
	equal( jQuery("#nonnodes")[0].childNodes.length < 3 ? 8 : j[2].nodeType, 8, "Check node,textnode,comment with text()" );
};

test("text(String)", function() {
	testText(bareObj);
});

test("text(Function)", function() {
	testText(functionReturningObj);
});

test("text(Function) with incoming value", function() {
	expect(2);

	var old = "This link has class=\"blog\": Simon Willison's Weblog";

	jQuery("#sap").text(function(i, val) {
		equal( val, old, "Make sure the incoming value is correct." );
		return "foobar";
	});

	equal( jQuery("#sap").text(), "foobar", "Check for merged text of more then one element." );

	QUnit.reset();
});

var testWrap = function(val) {
	expect(19);
	var defaultText = "Try them out:";
	var result = jQuery("#first").wrap(val( "<div class='red'><span></span></div>" )).text();
	equal( defaultText, result, "Check for wrapping of on-the-fly html" );
	ok( jQuery("#first").parent().parent().is(".red"), "Check if wrapper has class 'red'" );

	QUnit.reset();
	result = jQuery("#first").wrap(val( document.getElementById("empty") )).parent();
	ok( result.is("ol"), "Check for element wrapping" );
	equal( result.text(), defaultText, "Check for element wrapping" );

	QUnit.reset();
	jQuery("#check1").click(function() {
		var checkbox = this;
		ok( checkbox.checked, "Checkbox's state is erased after wrap() action, see #769" );
		jQuery(checkbox).wrap(val( "<div id='c1' style='display:none;'></div>" ));
		ok( checkbox.checked, "Checkbox's state is erased after wrap() action, see #769" );
	}).click();

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.wrap(val( "<i></i>" ));

	// Blackberry 4.6 doesn't maintain comments in the DOM
	equal( jQuery("#nonnodes > i").length, jQuery("#nonnodes")[0].childNodes.length, "Check node,textnode,comment wraps ok" );
	equal( jQuery("#nonnodes > i").text(), j.text(), "Check node,textnode,comment wraps doesn't hurt text" );

	// Try wrapping a disconnected node
	var cacheLength = 0;
	for (var i in jQuery.cache) {
		cacheLength++;
	}

	j = jQuery("<label/>").wrap(val( "<li/>" ));
	equal( j[0].nodeName.toUpperCase(), "LABEL", "Element is a label" );
	equal( j[0].parentNode.nodeName.toUpperCase(), "LI", "Element has been wrapped" );

	for (i in jQuery.cache) {
		cacheLength--;
	}
	equal(cacheLength, 0, "No memory leak in jQuery.cache (bug #7165)");

	// Wrap an element containing a text node
	j = jQuery("<span/>").wrap("<div>test</div>");
	equal( j[0].previousSibling.nodeType, 3, "Make sure the previous node is a text element" );
	equal( j[0].parentNode.nodeName.toUpperCase(), "DIV", "And that we're in the div element." );

	// Try to wrap an element with multiple elements (should fail)
	j = jQuery("<div><span></span></div>").children().wrap("<p></p><div></div>");
	equal( j[0].parentNode.parentNode.childNodes.length, 1, "There should only be one element wrapping." );
	equal( j.length, 1, "There should only be one element (no cloning)." );
	equal( j[0].parentNode.nodeName.toUpperCase(), "P", "The span should be in the paragraph." );

	// Wrap an element with a jQuery set
	j = jQuery("<span/>").wrap(jQuery("<div></div>"));
	equal( j[0].parentNode.nodeName.toLowerCase(), "div", "Wrapping works." );

	// Wrap an element with a jQuery set and event
	result = jQuery("<div></div>").click(function(){
		ok(true, "Event triggered.");

		// Remove handlers on detached elements
		result.unbind();
		jQuery(this).unbind();
	});

	j = jQuery("<span/>").wrap(result);
	equal( j[0].parentNode.nodeName.toLowerCase(), "div", "Wrapping works." );

	j.parent().trigger("click");

	// clean up attached elements
	QUnit.reset();
}

test("wrap(String|Element)", function() {
	testWrap(bareObj);
});

test("wrap(Function)", function() {
	testWrap(functionReturningObj);
});

test("wrap(Function) with index (#10177)", function() {
	var expectedIndex = 0,
	    targets = jQuery("#qunit-fixture p");

	expect(targets.length);
	targets.wrap(function(i) {
		equal( i, expectedIndex, "Check if the provided index (" + i + ") is as expected (" + expectedIndex + ")" );
		expectedIndex++;

		return "<div id='wrap_index_'" + i + "'></div>";
	});
});

test("wrap(String) consecutive elements (#10177)", function() {
	var targets = jQuery("#qunit-fixture p");

	expect(targets.length * 2);
	targets.wrap("<div class='wrapper'></div>");
	
	targets.each(function() {
		var $this = jQuery(this);
		
		ok( $this.parent().is('.wrapper'), "Check each elements parent is correct (.wrapper)" );
		equal( $this.siblings().length, 0, "Each element should be wrapped individually" );
	});
});

var testWrapAll = function(val) {
	expect(8);
	var prev = jQuery("#firstp")[0].previousSibling;
	var p = jQuery("#firstp,#first")[0].parentNode;

	var result = jQuery("#firstp,#first").wrapAll(val( "<div class='red'><div class='tmp'></div></div>" ));
	equal( result.parent().length, 1, "Check for wrapping of on-the-fly html" );
	ok( jQuery("#first").parent().parent().is(".red"), "Check if wrapper has class 'red'" );
	ok( jQuery("#firstp").parent().parent().is(".red"), "Check if wrapper has class 'red'" );
	equal( jQuery("#first").parent().parent()[0].previousSibling, prev, "Correct Previous Sibling" );
	equal( jQuery("#first").parent().parent()[0].parentNode, p, "Correct Parent" );

	QUnit.reset();
	var prev = jQuery("#firstp")[0].previousSibling;
	var p = jQuery("#first")[0].parentNode;
	var result = jQuery("#firstp,#first").wrapAll(val( document.getElementById("empty") ));
	equal( jQuery("#first").parent()[0], jQuery("#firstp").parent()[0], "Same Parent" );
	equal( jQuery("#first").parent()[0].previousSibling, prev, "Correct Previous Sibling" );
	equal( jQuery("#first").parent()[0].parentNode, p, "Correct Parent" );
}

test("wrapAll(String|Element)", function() {
	testWrapAll(bareObj);
});

var testWrapInner = function(val) {
	expect(11);
	var num = jQuery("#first").children().length;
	var result = jQuery("#first").wrapInner(val("<div class='red'><div id='tmp'></div></div>"));
	equal( jQuery("#first").children().length, 1, "Only one child" );
	ok( jQuery("#first").children().is(".red"), "Verify Right Element" );
	equal( jQuery("#first").children().children().children().length, num, "Verify Elements Intact" );

	QUnit.reset();
	var num = jQuery("#first").html("foo<div>test</div><div>test2</div>").children().length;
	var result = jQuery("#first").wrapInner(val("<div class='red'><div id='tmp'></div></div>"));
	equal( jQuery("#first").children().length, 1, "Only one child" );
	ok( jQuery("#first").children().is(".red"), "Verify Right Element" );
	equal( jQuery("#first").children().children().children().length, num, "Verify Elements Intact" );

	QUnit.reset();
	var num = jQuery("#first").children().length;
	var result = jQuery("#first").wrapInner(val(document.getElementById("empty")));
	equal( jQuery("#first").children().length, 1, "Only one child" );
	ok( jQuery("#first").children().is("#empty"), "Verify Right Element" );
	equal( jQuery("#first").children().children().length, num, "Verify Elements Intact" );

	var div = jQuery("<div/>");
	div.wrapInner(val("<span></span>"));
	equal(div.children().length, 1, "The contents were wrapped.");
	equal(div.children()[0].nodeName.toLowerCase(), "span", "A span was inserted.");
}

test("wrapInner(String|Element)", function() {
	testWrapInner(bareObj);
});

test("wrapInner(Function)", function() {
	testWrapInner(functionReturningObj)
});

test("unwrap()", function() {
	expect(9);

	jQuery("body").append("  <div id='unwrap' style='display: none;'> <div id='unwrap1'> <span class='unwrap'>a</span> <span class='unwrap'>b</span> </div> <div id='unwrap2'> <span class='unwrap'>c</span> <span class='unwrap'>d</span> </div> <div id='unwrap3'> <b><span class='unwrap unwrap3'>e</span></b> <b><span class='unwrap unwrap3'>f</span></b> </div> </div>");

	var abcd = jQuery("#unwrap1 > span, #unwrap2 > span").get(),
		abcdef = jQuery("#unwrap span").get();

	equal( jQuery("#unwrap1 span").add("#unwrap2 span:first").unwrap().length, 3, "make #unwrap1 and #unwrap2 go away" );
	deepEqual( jQuery("#unwrap > span").get(), abcd, "all four spans should still exist" );

	deepEqual( jQuery("#unwrap3 span").unwrap().get(), jQuery("#unwrap3 > span").get(), "make all b in #unwrap3 go away" );

	deepEqual( jQuery("#unwrap3 span").unwrap().get(), jQuery("#unwrap > span.unwrap3").get(), "make #unwrap3 go away" );

	deepEqual( jQuery("#unwrap").children().get(), abcdef, "#unwrap only contains 6 child spans" );

	deepEqual( jQuery("#unwrap > span").unwrap().get(), jQuery("body > span.unwrap").get(), "make the 6 spans become children of body" );

	deepEqual( jQuery("body > span.unwrap").unwrap().get(), jQuery("body > span.unwrap").get(), "can't unwrap children of body" );
	deepEqual( jQuery("body > span.unwrap").unwrap().get(), abcdef, "can't unwrap children of body" );

	deepEqual( jQuery("body > span.unwrap").get(), abcdef, "body contains 6 .unwrap child spans" );

	jQuery("body > span.unwrap").remove();
});

var testAppend = function(valueObj) {
	expect(41);
	var defaultText = "Try them out:"
	var result = jQuery("#first").append(valueObj("<b>buga</b>"));
	equal( result.text(), defaultText + "buga", "Check if text appending works" );
	equal( jQuery("#select3").append(valueObj("<option value='appendTest'>Append Test</option>")).find("option:last-child").attr("value"), "appendTest", "Appending html options to select element");

	QUnit.reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	jQuery("#sap").append(valueObj(document.getElementById("first")));
	equal( jQuery("#sap").text(), expected, "Check for appending of element" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	jQuery("#sap").append(valueObj([document.getElementById("first"), document.getElementById("yahoo")]));
	equal( jQuery("#sap").text(), expected, "Check for appending of array of elements" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:";
	jQuery("#sap").append(valueObj(jQuery("#yahoo, #first")));
	equal( jQuery("#sap").text(), expected, "Check for appending of jQuery object" );

	QUnit.reset();
	jQuery("#sap").append(valueObj( 5 ));
	ok( jQuery("#sap")[0].innerHTML.match( /5$/ ), "Check for appending a number" );

	QUnit.reset();
	jQuery("#sap").append(valueObj( " text with spaces " ));
	ok( jQuery("#sap")[0].innerHTML.match(/ text with spaces $/), "Check for appending text with spaces" );

	QUnit.reset();
	ok( jQuery("#sap").append(valueObj( [] )), "Check for appending an empty array." );
	ok( jQuery("#sap").append(valueObj( "" )), "Check for appending an empty string." );
	ok( jQuery("#sap").append(valueObj( document.getElementsByTagName("foo") )), "Check for appending an empty nodelist." );

	QUnit.reset();
	jQuery("form").append(valueObj("<input name='radiotest' type='radio' checked='checked' />"));
	jQuery("form input[name=radiotest]").each(function(){
		ok( jQuery(this).is(":checked"), "Append checked radio");
	}).remove();

	QUnit.reset();
	jQuery("form").append(valueObj("<input name='radiotest' type='radio' checked    =   'checked' />"));
	jQuery("form input[name=radiotest]").each(function(){
		ok( jQuery(this).is(":checked"), "Append alternately formated checked radio");
	}).remove();

	QUnit.reset();
	jQuery("form").append(valueObj("<input name='radiotest' type='radio' checked />"));
	jQuery("form input[name=radiotest]").each(function(){
		ok( jQuery(this).is(":checked"), "Append HTML5-formated checked radio");
	}).remove();

	QUnit.reset();
	jQuery("#sap").append(valueObj( document.getElementById("form") ));
	equal( jQuery("#sap>form").size(), 1, "Check for appending a form" ); // Bug #910

	QUnit.reset();
	var pass = true;
	try {
		var body = jQuery("#iframe")[0].contentWindow.document.body;

		pass = false;
		jQuery( body ).append(valueObj( "<div>test</div>" ));
		pass = true;
	} catch(e) {}

	ok( pass, "Test for appending a DOM node to the contents of an IFrame" );

	QUnit.reset();
	jQuery("<fieldset/>").appendTo("#form").append(valueObj( "<legend id='legend'>test</legend>" ));
	t( "Append legend", "#legend", ["legend"] );

	QUnit.reset();
	jQuery("#select1").append(valueObj( "<OPTION>Test</OPTION>" ));
	equal( jQuery("#select1 option:last").text(), "Test", "Appending &lt;OPTION&gt; (all caps)" );

	jQuery("#table").append(valueObj( "<colgroup></colgroup>" ));
	ok( jQuery("#table colgroup").length, "Append colgroup" );

	jQuery("#table colgroup").append(valueObj( "<col/>" ));
	ok( jQuery("#table colgroup col").length, "Append col" );

	QUnit.reset();
	jQuery("#table").append(valueObj( "<caption></caption>" ));
	ok( jQuery("#table caption").length, "Append caption" );

	QUnit.reset();
	jQuery("form:last")
		.append(valueObj( "<select id='appendSelect1'></select>" ))
		.append(valueObj( "<select id='appendSelect2'><option>Test</option></select>" ));

	t( "Append Select", "#appendSelect1, #appendSelect2", ["appendSelect1", "appendSelect2"] );

	equal( "Two nodes", jQuery("<div />").append("Two", " nodes").text(), "Appending two text nodes (#4011)" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	var d = jQuery("<div/>").appendTo("#nonnodes").append(j);
	equal( jQuery("#nonnodes").length, 1, "Check node,textnode,comment append moved leaving just the div" );
	ok( d.contents().length >= 2, "Check node,textnode,comment append works" );
	d.contents().appendTo("#nonnodes");
	d.remove();
	ok( jQuery("#nonnodes").contents().length >= 2, "Check node,textnode,comment append cleanup worked" );

	QUnit.reset();
	var $input = jQuery("<input />").attr({ "type": "checkbox", "checked": true }).appendTo('#testForm');
	equal( $input[0].checked, true, "A checked checkbox that is appended stays checked" );

	QUnit.reset();
	var $radios = jQuery("input:radio[name='R1']"),
		$radioNot = jQuery("<input type='radio' name='R1' checked='checked'/>").insertAfter( $radios ),
		$radio = $radios.eq(1).click();
	$radioNot[0].checked = false;
	$radios.parent().wrap("<div></div>");
	equal( $radio[0].checked, true, "Reappending radios uphold which radio is checked" );
	equal( $radioNot[0].checked, false, "Reappending radios uphold not being checked" );
	QUnit.reset();

	var prev = jQuery("#sap").children().length;

	jQuery("#sap").append(
		"<span></span>",
		"<span></span>",
		"<span></span>"
	);

	equal( jQuery("#sap").children().length, prev + 3, "Make sure that multiple arguments works." );
	QUnit.reset();
}

test("append(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	testAppend(bareObj);
});

test("append(Function)", function() {
	testAppend(functionReturningObj);
});

test("append(Function) with incoming value", function() {
	expect(12);

	var defaultText = "Try them out:", old = jQuery("#first").html();

	var result = jQuery("#first").append(function(i, val){
		equal( val, old, "Make sure the incoming value is correct." );
		return "<b>buga</b>";
	});
	equal( result.text(), defaultText + "buga", "Check if text appending works" );

	var select = jQuery("#select3");
	old = select.html();

	equal( select.append(function(i, val){
		equal( val, old, "Make sure the incoming value is correct." );
		return "<option value='appendTest'>Append Test</option>";
	}).find("option:last-child").attr("value"), "appendTest", "Appending html options to select element");

	QUnit.reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	old = jQuery("#sap").html();

	jQuery("#sap").append(function(i, val){
		equal( val, old, "Make sure the incoming value is correct." );
		return document.getElementById("first");
	});
	equal( jQuery("#sap").text(), expected, "Check for appending of element" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	old = jQuery("#sap").html();

	jQuery("#sap").append(function(i, val){
		equal( val, old, "Make sure the incoming value is correct." );
		return [document.getElementById("first"), document.getElementById("yahoo")];
	});
	equal( jQuery("#sap").text(), expected, "Check for appending of array of elements" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:";
	old = jQuery("#sap").html();

	jQuery("#sap").append(function(i, val){
		equal( val, old, "Make sure the incoming value is correct." );
		return jQuery("#yahoo, #first");
	});
	equal( jQuery("#sap").text(), expected, "Check for appending of jQuery object" );

	QUnit.reset();
	old = jQuery("#sap").html();

	jQuery("#sap").append(function(i, val){
		equal( val, old, "Make sure the incoming value is correct." );
		return 5;
	});
	ok( jQuery("#sap")[0].innerHTML.match( /5$/ ), "Check for appending a number" );

	QUnit.reset();
});

test("append the same fragment with events (Bug #6997, 5566)", function () {
	var doExtra = !jQuery.support.noCloneEvent && document.fireEvent;
	expect(2 + (doExtra ? 1 : 0));
	stop();

	var element;

	// This patch modified the way that cloning occurs in IE; we need to make sure that
	// native event handlers on the original object don't get disturbed when they are
	// modified on the clone
	if ( doExtra ) {
		element = jQuery("div:first").click(function () {
			ok(true, "Event exists on original after being unbound on clone");
			jQuery(this).unbind("click");
		});
		var clone = element.clone(true).unbind("click");
		clone[0].fireEvent("onclick");
		element[0].fireEvent("onclick");

		// manually clean up detached elements
		clone.remove();
	}

	element = jQuery("<a class='test6997'></a>").click(function () {
		ok(true, "Append second element events work");
	});

	jQuery("#listWithTabIndex li").append(element)
		.find("a.test6997").eq(1).click();

	element = jQuery("<li class='test6997'></li>").click(function () {
		ok(true, "Before second element events work");
		start();
	});

	jQuery("#listWithTabIndex li").before(element);
	jQuery("#listWithTabIndex li.test6997").eq(1).click();
});

test("append HTML5 sectioning elements (Bug #6485)", function () {
	expect(2);

	jQuery("#qunit-fixture").append("<article style='font-size:10px'><section><aside>HTML5 elements</aside></section></article>");

	var article = jQuery("article"),
	aside = jQuery("aside");

	equal( article.css("fontSize"), "10px", "HTML5 elements are styleable");
	equal( aside.length, 1, "HTML5 elements do not collapse their children")
});

test("HTML5 Elements inherit styles from style rules (Bug #10501)", function () {
	expect(1);

	jQuery("#qunit-fixture").append("<article id='article'></article>");
	jQuery("#article").append("<section>This section should have a pink background.</section>");

	// In IE, the missing background color will claim its value is "transparent"
	notEqual( jQuery("section").css("background-color"), "transparent", "HTML5 elements inherit styles");
});

test("html5 clone() cannot use the fragment cache in IE (#6485)", function () {
	expect(1);

	jQuery("<article><section><aside>HTML5 elements</aside></section></article>").appendTo("#qunit-fixture");

	var clone = jQuery("article").clone();

	jQuery("#qunit-fixture").append( clone );

	equal( jQuery("aside").length, 2, "clone()ing HTML5 elems does not collapse them" );
});

test("html(String) with HTML5 (Bug #6485)", function() {
	expect(2);

	jQuery("#qunit-fixture").html("<article><section><aside>HTML5 elements</aside></section></article>");
	equal( jQuery("#qunit-fixture").children().children().length, 1, "Make sure HTML5 article elements can hold children. innerHTML shortcut path" );
	equal( jQuery("#qunit-fixture").children().children().children().length, 1, "Make sure nested HTML5 elements can hold children." );
});

test("append(xml)", function() {
	expect( 1 );

	function createXMLDoc() {
		// Initialize DOM based upon latest installed MSXML or Netscape
		var elem,
			aActiveX =
				[ "MSXML6.DomDocument",
				"MSXML3.DomDocument",
				"MSXML2.DomDocument",
				"MSXML.DomDocument",
				"Microsoft.XmlDom" ];

		if ( document.implementation && "createDocument" in document.implementation ) {
			return document.implementation.createDocument( "", "", null );
		} else {
			// IE
			for ( var n = 0, len = aActiveX.length; n < len; n++ ) {
				try {
					elem = new ActiveXObject( aActiveX[ n ] );
					return elem;
				} catch(_){};
			}
		}
	}

	var xmlDoc = createXMLDoc(),
		xml1 = xmlDoc.createElement("head"),
		xml2 = xmlDoc.createElement("test");

	ok( jQuery( xml1 ).append( xml2 ), "Append an xml element to another without raising an exception." );

});

test("appendTo(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(17);

	var defaultText = "Try them out:"
	jQuery("<b>buga</b>").appendTo("#first");
	equal( jQuery("#first").text(), defaultText + "buga", "Check if text appending works" );
	equal( jQuery("<option value='appendTest'>Append Test</option>").appendTo("#select3").parent().find("option:last-child").attr("value"), "appendTest", "Appending html options to select element");

	QUnit.reset();
	var l = jQuery("#first").children().length + 2;
	jQuery("<strong>test</strong>");
	jQuery("<strong>test</strong>");
	jQuery([ jQuery("<strong>test</strong>")[0], jQuery("<strong>test</strong>")[0] ])
		.appendTo("#first");
	equal( jQuery("#first").children().length, l, "Make sure the elements were inserted." );
	equal( jQuery("#first").children().last()[0].nodeName.toLowerCase(), "strong", "Verify the last element." );

	QUnit.reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	jQuery(document.getElementById("first")).appendTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for appending of element" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	jQuery([document.getElementById("first"), document.getElementById("yahoo")]).appendTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for appending of array of elements" );

	QUnit.reset();
	ok( jQuery(document.createElement("script")).appendTo("body").length, "Make sure a disconnected script can be appended." );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:";
	jQuery("#yahoo, #first").appendTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for appending of jQuery object" );

	QUnit.reset();
	jQuery("#select1").appendTo("#foo");
	t( "Append select", "#foo select", ["select1"] );

	QUnit.reset();
	var div = jQuery("<div/>").click(function(){
		ok(true, "Running a cloned click.");
	});
	div.appendTo("#qunit-fixture, #moretests");

	jQuery("#qunit-fixture div:last").click();
	jQuery("#moretests div:last").click();

	QUnit.reset();
	div = jQuery("<div/>").appendTo("#qunit-fixture, #moretests");

	equal( div.length, 2, "appendTo returns the inserted elements" );

	div.addClass("test");

	ok( jQuery("#qunit-fixture div:last").hasClass("test"), "appendTo element was modified after the insertion" );
	ok( jQuery("#moretests div:last").hasClass("test"), "appendTo element was modified after the insertion" );

	QUnit.reset();

	div = jQuery("<div/>");
	jQuery("<span>a</span><b>b</b>").filter("span").appendTo( div );

	equal( div.children().length, 1, "Make sure the right number of children were inserted." );

	div = jQuery("#moretests div");

	var num = jQuery("#qunit-fixture div").length;
	div.remove().appendTo("#qunit-fixture");

	equal( jQuery("#qunit-fixture div").length, num, "Make sure all the removed divs were inserted." );

	QUnit.reset();

	stop();
	jQuery.getScript('data/test.js', function() {
		jQuery('script[src*="data\\/test\\.js"]').remove();
		start();
	});
});

var testPrepend = function(val) {
	expect(5);
	var defaultText = "Try them out:"
	var result = jQuery("#first").prepend(val( "<b>buga</b>" ));
	equal( result.text(), "buga" + defaultText, "Check if text prepending works" );
	equal( jQuery("#select3").prepend(val( "<option value='prependTest'>Prepend Test</option>" )).find("option:first-child").attr("value"), "prependTest", "Prepending html options to select element");

	QUnit.reset();
	var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery("#sap").prepend(val( document.getElementById("first") ));
	equal( jQuery("#sap").text(), expected, "Check for prepending of element" );

	QUnit.reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	jQuery("#sap").prepend(val( [document.getElementById("first"), document.getElementById("yahoo")] ));
	equal( jQuery("#sap").text(), expected, "Check for prepending of array of elements" );

	QUnit.reset();
	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery("#sap").prepend(val( jQuery("#yahoo, #first") ));
	equal( jQuery("#sap").text(), expected, "Check for prepending of jQuery object" );
};

test("prepend(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	testPrepend(bareObj);
});

test("prepend(Function)", function() {
	testPrepend(functionReturningObj);
});

test("prepend(Function) with incoming value", function() {
	expect(10);

	var defaultText = "Try them out:", old = jQuery("#first").html();
	var result = jQuery("#first").prepend(function(i, val) {
		equal( val, old, "Make sure the incoming value is correct." );
		return "<b>buga</b>";
	});
	equal( result.text(), "buga" + defaultText, "Check if text prepending works" );

	old = jQuery("#select3").html();

	equal( jQuery("#select3").prepend(function(i, val) {
		equal( val, old, "Make sure the incoming value is correct." );
		return "<option value='prependTest'>Prepend Test</option>";
	}).find("option:first-child").attr("value"), "prependTest", "Prepending html options to select element");

	QUnit.reset();
	var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	old = jQuery("#sap").html();

	jQuery("#sap").prepend(function(i, val) {
		equal( val, old, "Make sure the incoming value is correct." );
		return document.getElementById("first");
	});

	equal( jQuery("#sap").text(), expected, "Check for prepending of element" );

	QUnit.reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	old = jQuery("#sap").html();

	jQuery("#sap").prepend(function(i, val) {
		equal( val, old, "Make sure the incoming value is correct." );
		return [document.getElementById("first"), document.getElementById("yahoo")];
	});

	equal( jQuery("#sap").text(), expected, "Check for prepending of array of elements" );

	QUnit.reset();
	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	old = jQuery("#sap").html();

	jQuery("#sap").prepend(function(i, val) {
		equal( val, old, "Make sure the incoming value is correct." );
		return jQuery("#yahoo, #first");
	});

	equal( jQuery("#sap").text(), expected, "Check for prepending of jQuery object" );
});

test("prependTo(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(6);
	var defaultText = "Try them out:"
	jQuery("<b>buga</b>").prependTo("#first");
	equal( jQuery("#first").text(), "buga" + defaultText, "Check if text prepending works" );
	equal( jQuery("<option value='prependTest'>Prepend Test</option>").prependTo("#select3").parent().find("option:first-child").attr("value"), "prependTest", "Prepending html options to select element");

	QUnit.reset();
	var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery(document.getElementById("first")).prependTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for prepending of element" );

	QUnit.reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	jQuery([document.getElementById("first"), document.getElementById("yahoo")]).prependTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for prepending of array of elements" );

	QUnit.reset();
	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery("#yahoo, #first").prependTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for prepending of jQuery object" );

	QUnit.reset();
	jQuery("<select id='prependSelect1'></select>").prependTo("form:last");
	jQuery("<select id='prependSelect2'><option>Test</option></select>").prependTo("form:last");

	t( "Prepend Select", "#prependSelect2, #prependSelect1", ["prependSelect2", "prependSelect1"] );
});

var testBefore = function(val) {
	expect(6);
	var expected = "This is a normal link: bugaYahoo";
	jQuery("#yahoo").before(val( "<b>buga</b>" ));
	equal( jQuery("#en").text(), expected, "Insert String before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:Yahoo";
	jQuery("#yahoo").before(val( document.getElementById("first") ));
	equal( jQuery("#en").text(), expected, "Insert element before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	jQuery("#yahoo").before(val( [document.getElementById("first"), document.getElementById("mark")] ));
	equal( jQuery("#en").text(), expected, "Insert array of elements before" );

	QUnit.reset();
	expected = "This is a normal link: diveintomarkTry them out:Yahoo";
	jQuery("#yahoo").before(val( jQuery("#mark, #first") ));
	equal( jQuery("#en").text(), expected, "Insert jQuery before" );

	var set = jQuery("<div/>").before("<span>test</span>");
	equal( set[0].nodeName.toLowerCase(), "span", "Insert the element before the disconnected node." );
	equal( set.length, 2, "Insert the element before the disconnected node." );
};

test("before(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	testBefore(bareObj);
});

test("before(Function)", function() {
	testBefore(functionReturningObj);
});

test("before and after w/ empty object (#10812)", function() {
	expect(2);

	var res = jQuery( "#notInTheDocument" ).before( "(" ).after( ")" );
	equal( res.length, 2, "didn't choke on empty object" );
	equal( res.wrapAll("<div/>").parent().text(), "()", "correctly appended text" );
});

test("insertBefore(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = "This is a normal link: bugaYahoo";
	jQuery("<b>buga</b>").insertBefore("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert String before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:Yahoo";
	jQuery(document.getElementById("first")).insertBefore("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert element before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	jQuery([document.getElementById("first"), document.getElementById("mark")]).insertBefore("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert array of elements before" );

	QUnit.reset();
	expected = "This is a normal link: diveintomarkTry them out:Yahoo";
	jQuery("#mark, #first").insertBefore("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert jQuery before" );
});

var testAfter = function(val) {
	expect(6);
	var expected = "This is a normal link: Yahoobuga";
	jQuery("#yahoo").after(val( "<b>buga</b>" ));
	equal( jQuery("#en").text(), expected, "Insert String after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:";
	jQuery("#yahoo").after(val( document.getElementById("first") ));
	equal( jQuery("#en").text(), expected, "Insert element after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	jQuery("#yahoo").after(val( [document.getElementById("first"), document.getElementById("mark")] ));
	equal( jQuery("#en").text(), expected, "Insert array of elements after" );

	QUnit.reset();
	expected = "This is a normal link: YahoodiveintomarkTry them out:";
	jQuery("#yahoo").after(val( jQuery("#mark, #first") ));
	equal( jQuery("#en").text(), expected, "Insert jQuery after" );

	var set = jQuery("<div/>").after("<span>test</span>");
	equal( set[1].nodeName.toLowerCase(), "span", "Insert the element after the disconnected node." );
	equal( set.length, 2, "Insert the element after the disconnected node." );
};

test("after(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	testAfter(bareObj);
});

test("after(Function)", function() {
	testAfter(functionReturningObj);
});

test("insertAfter(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = "This is a normal link: Yahoobuga";
	jQuery("<b>buga</b>").insertAfter("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert String after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:";
	jQuery(document.getElementById("first")).insertAfter("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert element after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	jQuery([document.getElementById("first"), document.getElementById("mark")]).insertAfter("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert array of elements after" );

	QUnit.reset();
	expected = "This is a normal link: YahoodiveintomarkTry them out:";
	jQuery("#mark, #first").insertAfter("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert jQuery after" );
});

var testReplaceWith = function(val) {
	expect(21);
	jQuery("#yahoo").replaceWith(val( "<b id='replace'>buga</b>" ));
	ok( jQuery("#replace")[0], "Replace element with string" );
	ok( !jQuery("#yahoo")[0], "Verify that original element is gone, after string" );

	QUnit.reset();
	jQuery("#yahoo").replaceWith(val( document.getElementById("first") ));
	ok( jQuery("#first")[0], "Replace element with element" );
	ok( !jQuery("#yahoo")[0], "Verify that original element is gone, after element" );

	QUnit.reset();
	jQuery("#qunit-fixture").append("<div id='bar'><div id='baz'</div></div>");
	jQuery("#baz").replaceWith("Baz");
	equal( jQuery("#bar").text(),"Baz", "Replace element with text" );
	ok( !jQuery("#baz")[0], "Verify that original element is gone, after element" );

	QUnit.reset();
	jQuery("#yahoo").replaceWith(val( [document.getElementById("first"), document.getElementById("mark")] ));
	ok( jQuery("#first")[0], "Replace element with array of elements" );
	ok( jQuery("#mark")[0], "Replace element with array of elements" );
	ok( !jQuery("#yahoo")[0], "Verify that original element is gone, after array of elements" );

	QUnit.reset();
	jQuery("#yahoo").replaceWith(val( jQuery("#mark, #first") ));
	ok( jQuery("#first")[0], "Replace element with set of elements" );
	ok( jQuery("#mark")[0], "Replace element with set of elements" );
	ok( !jQuery("#yahoo")[0], "Verify that original element is gone, after set of elements" );

	QUnit.reset();
	var tmp = jQuery("<div/>").appendTo("body").click(function(){ ok(true, "Newly bound click run." ); });
	var y = jQuery("<div/>").appendTo("body").click(function(){ ok(true, "Previously bound click run." ); });
	var child = y.append("<b>test</b>").find("b").click(function(){ ok(true, "Child bound click run." ); return false; });

	y.replaceWith( tmp );

	tmp.click();
	y.click(); // Shouldn't be run
	child.click(); // Shouldn't be run

	tmp.remove();
	y.remove();
	child.remove();

	QUnit.reset();

	y = jQuery("<div/>").appendTo("body").click(function(){ ok(true, "Previously bound click run." ); });
	var child2 = y.append("<u>test</u>").find("u").click(function(){ ok(true, "Child 2 bound click run." ); return false; });

	y.replaceWith( child2 );

	child2.click();

	y.remove();
	child2.remove();

	QUnit.reset();

	var set = jQuery("<div/>").replaceWith(val("<span>test</span>"));
	equal( set[0].nodeName.toLowerCase(), "span", "Replace the disconnected node." );
	equal( set.length, 1, "Replace the disconnected node." );

	var non_existant = jQuery("#does-not-exist").replaceWith( val("<b>should not throw an error</b>") );
	equal( non_existant.length, 0, "Length of non existant element." );

	var $div = jQuery("<div class='replacewith'></div>").appendTo("body");
	// TODO: Work on jQuery(...) inline script execution
	//$div.replaceWith("<div class='replacewith'></div><script>" +
		//"equal(jQuery('.replacewith').length, 1, 'Check number of elements in page.');" +
		//"</script>");
	equal(jQuery(".replacewith").length, 1, "Check number of elements in page.");
	jQuery(".replacewith").remove();

	QUnit.reset();

	jQuery("#qunit-fixture").append("<div id='replaceWith'></div>");
	equal( jQuery("#qunit-fixture").find("div[id=replaceWith]").length, 1, "Make sure only one div exists." );

	jQuery("#replaceWith").replaceWith( val("<div id='replaceWith'></div>") );
	equal( jQuery("#qunit-fixture").find("div[id=replaceWith]").length, 1, "Make sure only one div exists." );

	jQuery("#replaceWith").replaceWith( val("<div id='replaceWith'></div>") );
	equal( jQuery("#qunit-fixture").find("div[id=replaceWith]").length, 1, "Make sure only one div exists." );
}

test("replaceWith(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	testReplaceWith(bareObj);
});

test("replaceWith(Function)", function() {
	testReplaceWith(functionReturningObj);

	expect(22);

	var y = jQuery("#yahoo")[0];

	jQuery(y).replaceWith(function(){
		equal( this, y, "Make sure the context is coming in correctly." );
	});

	QUnit.reset();
});

test("replaceWith(string) for more than one element", function(){
	expect(3);

	equal(jQuery("#foo p").length, 3, "ensuring that test data has not changed");

	jQuery("#foo p").replaceWith("<span>bar</span>");
	equal(jQuery("#foo span").length, 3, "verify that all the three original element have been replaced");
	equal(jQuery("#foo p").length, 0, "verify that all the three original element have been replaced");
});

test("replaceAll(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(10);
	jQuery("<b id='replace'>buga</b>").replaceAll("#yahoo");
	ok( jQuery("#replace")[0], "Replace element with string" );
	ok( !jQuery("#yahoo")[0], "Verify that original element is gone, after string" );

	QUnit.reset();
	jQuery(document.getElementById("first")).replaceAll("#yahoo");
	ok( jQuery("#first")[0], "Replace element with element" );
	ok( !jQuery("#yahoo")[0], "Verify that original element is gone, after element" );

	QUnit.reset();
	jQuery([document.getElementById("first"), document.getElementById("mark")]).replaceAll("#yahoo");
	ok( jQuery("#first")[0], "Replace element with array of elements" );
	ok( jQuery("#mark")[0], "Replace element with array of elements" );
	ok( !jQuery("#yahoo")[0], "Verify that original element is gone, after array of elements" );

	QUnit.reset();
	jQuery("#mark, #first").replaceAll("#yahoo");
	ok( jQuery("#first")[0], "Replace element with set of elements" );
	ok( jQuery("#mark")[0], "Replace element with set of elements" );
	ok( !jQuery("#yahoo")[0], "Verify that original element is gone, after set of elements" );
});

test("jQuery.clone() (#8017)", function() {

	expect(2);

	ok( jQuery.clone && jQuery.isFunction( jQuery.clone ) , "jQuery.clone() utility exists and is a function.");

	var main = jQuery("#qunit-fixture")[0],
			clone = jQuery.clone( main );

	equal( main.childNodes.length, clone.childNodes.length, "Simple child length to ensure a large dom tree copies correctly" );
});

test("clone() (#8070)", function () {
	expect(2);

	jQuery("<select class='test8070'></select><select class='test8070'></select>").appendTo("#qunit-fixture");
	var selects = jQuery(".test8070");
	selects.append("<OPTION>1</OPTION><OPTION>2</OPTION>");

	equal( selects[0].childNodes.length, 2, "First select got two nodes" );
	equal( selects[1].childNodes.length, 2, "Second select got two nodes" );

	selects.remove();
});

test("clone()", function() {
	expect(39);
	equal( "This is a normal link: Yahoo", jQuery("#en").text(), "Assert text for #en" );
	var clone = jQuery("#yahoo").clone();
	equal( "Try them out:Yahoo", jQuery("#first").append(clone).text(), "Check for clone" );
	equal( "This is a normal link: Yahoo", jQuery("#en").text(), "Reassert text for #en" );

	var cloneTags = [
		"<table/>", "<tr/>", "<td/>", "<div/>",
		"<button/>", "<ul/>", "<ol/>", "<li/>",
		"<input type='checkbox' />", "<select/>", "<option/>", "<textarea/>",
		"<tbody/>", "<thead/>", "<tfoot/>", "<iframe/>"
	];
	for (var i = 0; i < cloneTags.length; i++) {
		var j = jQuery(cloneTags[i]);
		equal( j[0].tagName, j.clone()[0].tagName, "Clone a " + cloneTags[i]);
	}

	// using contents will get comments regular, text, and comment nodes
	var cl = jQuery("#nonnodes").contents().clone();
	ok( cl.length >= 2, "Check node,textnode,comment clone works (some browsers delete comments on clone)" );

	var div = jQuery("<div><ul><li>test</li></ul></div>").click(function(){
		ok( true, "Bound event still exists." );
	});

	clone = div.clone(true);

	// manually clean up detached elements
	div.remove();

	div = clone.clone(true);

	// manually clean up detached elements
	clone.remove();

	equal( div.length, 1, "One element cloned" );
	equal( div[0].nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	div.trigger("click");

	// manually clean up detached elements
	div.remove();

	div = jQuery("<div/>").append([ document.createElement("table"), document.createElement("table") ]);
	div.find("table").click(function(){
		ok( true, "Bound event still exists." );
	});

	clone = div.clone(true);
	equal( clone.length, 1, "One element cloned" );
	equal( clone[0].nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	clone.find("table:last").trigger("click");

	// manually clean up detached elements
	div.remove();
	clone.remove();

	var divEvt = jQuery("<div><ul><li>test</li></ul></div>").click(function(){
		ok( false, "Bound event still exists after .clone()." );
	}),
		cloneEvt = divEvt.clone();

	// Make sure that doing .clone() doesn't clone events
	cloneEvt.trigger("click");

	cloneEvt.remove();
	divEvt.remove();

	// Test both html() and clone() for <embed and <object types
	div = jQuery("<div/>").html('<embed height="355" width="425" src="http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en"></embed>');

	clone = div.clone(true);
	equal( clone.length, 1, "One element cloned" );
	equal( clone.html(), div.html(), "Element contents cloned" );
	equal( clone[0].nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	// this is technically an invalid object, but because of the special
	// classid instantiation it is the only kind that IE has trouble with,
	// so let's test with it too.
	div = jQuery("<div/>").html("<object height='355' width='425' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");

	clone = div.clone(true);
	equal( clone.length, 1, "One element cloned" );
	// equal( clone.html(), div.html(), "Element contents cloned" );
	equal( clone[0].nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	// and here's a valid one.
	div = jQuery("<div/>").html("<object height='355' width='425' type='application/x-shockwave-flash' data='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");

	clone = div.clone(true);
	equal( clone.length, 1, "One element cloned" );
	equal( clone.html(), div.html(), "Element contents cloned" );
	equal( clone[0].nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	div = jQuery("<div/>").data({ a: true });
	clone = div.clone(true);
	equal( clone.data("a"), true, "Data cloned." );
	clone.data("a", false);
	equal( clone.data("a"), false, "Ensure cloned element data object was correctly modified" );
	equal( div.data("a"), true, "Ensure cloned element data object is copied, not referenced" );

	// manually clean up detached elements
	div.remove();
	clone.remove();

	var form = document.createElement("form");
	form.action = "/test/";
	var div = document.createElement("div");
	div.appendChild( document.createTextNode("test") );
	form.appendChild( div );

	equal( jQuery(form).clone().children().length, 1, "Make sure we just get the form back." );

	equal( jQuery("body").clone().children()[0].id, "qunit-header", "Make sure cloning body works" );
});

test("clone(form element) (Bug #3879, #6655)", function() {
	expect(5);
	var element = jQuery("<select><option>Foo</option><option selected>Bar</option></select>");

	equal( element.clone().find("option:selected").val(), element.find("option:selected").val(), "Selected option cloned correctly" );

	element = jQuery("<input type='checkbox' value='foo'>").attr("checked", "checked");
	clone = element.clone();

	equal( clone.is(":checked"), element.is(":checked"), "Checked input cloned correctly" );
	equal( clone[0].defaultValue, "foo", "Checked input defaultValue cloned correctly" );

	// defaultChecked also gets set now due to setAttribute in attr, is this check still valid?
	// equal( clone[0].defaultChecked, !jQuery.support.noCloneChecked, "Checked input defaultChecked cloned correctly" );

	element = jQuery("<input type='text' value='foo'>");
	clone = element.clone();
	equal( clone[0].defaultValue, "foo", "Text input defaultValue cloned correctly" );

	element = jQuery("<textarea>foo</textarea>");
	clone = element.clone();
	equal( clone[0].defaultValue, "foo", "Textarea defaultValue cloned correctly" );
});

test("clone(multiple selected options) (Bug #8129)", function() {
	expect(1);
	var element = jQuery("<select><option>Foo</option><option selected>Bar</option><option selected>Baz</option></select>");

	equal( element.clone().find("option:selected").length, element.find("option:selected").length, "Multiple selected options cloned correctly" );

});

if (!isLocal) {
test("clone() on XML nodes", function() {
	expect(2);
	stop();
	jQuery.get("data/dashboard.xml", function (xml) {
		var root = jQuery(xml.documentElement).clone();
		var origTab = jQuery("tab", xml).eq(0);
		var cloneTab = jQuery("tab", root).eq(0);
		origTab.text("origval");
		cloneTab.text("cloneval");
		equal(origTab.text(), "origval", "Check original XML node was correctly set");
		equal(cloneTab.text(), "cloneval", "Check cloned XML node was correctly set");
		start();
	});
});
}

var testHtml = function(valueObj) {
	expect(34);

	jQuery.scriptorder = 0;

	var div = jQuery("#qunit-fixture > div");
	div.html(valueObj("<b>test</b>"));
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
		if ( div.get(i).childNodes.length != 1 ) pass = false;
	}
	ok( pass, "Set HTML" );

	div = jQuery("<div/>").html( valueObj("<div id='parent_1'><div id='child_1'/></div><div id='parent_2'/>") );

	equal( div.children().length, 2, "Make sure two child nodes exist." );
	equal( div.children().children().length, 1, "Make sure that a grandchild exists." );

	var space = jQuery("<div/>").html(valueObj("&#160;"))[0].innerHTML;
	ok( /^\xA0$|^&nbsp;$/.test( space ), "Make sure entities are passed through correctly." );
	equal( jQuery("<div/>").html(valueObj("&amp;"))[0].innerHTML, "&amp;", "Make sure entities are passed through correctly." );

	jQuery("#qunit-fixture").html(valueObj("<style>.foobar{color:green;}</style>"));

	equal( jQuery("#qunit-fixture").children().length, 1, "Make sure there is a child element." );
	equal( jQuery("#qunit-fixture").children()[0].nodeName.toUpperCase(), "STYLE", "And that a style element was inserted." );

	QUnit.reset();
	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.html(valueObj("<b>bold</b>"));

	// this is needed, or the expando added by jQuery unique will yield a different html
	j.find("b").removeData();
	equal( j.html().replace(/ xmlns="[^"]+"/g, "").toLowerCase(), "<b>bold</b>", "Check node,textnode,comment with html()" );

	jQuery("#qunit-fixture").html(valueObj("<select/>"));
	jQuery("#qunit-fixture select").html(valueObj("<option>O1</option><option selected='selected'>O2</option><option>O3</option>"));
	equal( jQuery("#qunit-fixture select").val(), "O2", "Selected option correct" );

	var $div = jQuery("<div />");
	equal( $div.html(valueObj( 5 )).html(), "5", "Setting a number as html" );
	equal( $div.html(valueObj( 0 )).html(), "0", "Setting a zero as html" );

	var $div2 = jQuery("<div/>"), insert = "&lt;div&gt;hello1&lt;/div&gt;";
	equal( $div2.html(insert).html().replace(/>/g, "&gt;"), insert, "Verify escaped insertion." );
	equal( $div2.html("x" + insert).html().replace(/>/g, "&gt;"), "x" + insert, "Verify escaped insertion." );
	equal( $div2.html(" " + insert).html().replace(/>/g, "&gt;"), " " + insert, "Verify escaped insertion." );

	var map = jQuery("<map/>").html(valueObj("<area id='map01' shape='rect' coords='50,50,150,150' href='http://www.jquery.com/' alt='jQuery'>"));

	equal( map[0].childNodes.length, 1, "The area was inserted." );
	equal( map[0].firstChild.nodeName.toLowerCase(), "area", "The area was inserted." );

	QUnit.reset();

	jQuery("#qunit-fixture").html(valueObj("<script type='something/else'>ok( false, 'Non-script evaluated.' );</script><script type='text/javascript'>ok( true, 'text/javascript is evaluated.' );</script><script>ok( true, 'No type is evaluated.' );</script><div><script type='text/javascript'>ok( true, 'Inner text/javascript is evaluated.' );</script><script>ok( true, 'Inner No type is evaluated.' );</script><script type='something/else'>ok( false, 'Non-script evaluated.' );</script></div>"));

	var child = jQuery("#qunit-fixture").find("script");

	equal( child.length, 2, "Make sure that two non-JavaScript script tags are left." );
	equal( child[0].type, "something/else", "Verify type of script tag." );
	equal( child[1].type, "something/else", "Verify type of script tag." );

	jQuery("#qunit-fixture").html(valueObj("<script>ok( true, 'Test repeated injection of script.' );</script>"));
	jQuery("#qunit-fixture").html(valueObj("<script>ok( true, 'Test repeated injection of script.' );</script>"));
	jQuery("#qunit-fixture").html(valueObj("<script>ok( true, 'Test repeated injection of script.' );</script>"));

	jQuery("#qunit-fixture").html(valueObj("<script type='text/javascript'>ok( true, 'jQuery().html().evalScripts() Evals Scripts Twice in Firefox, see #975 (1)' );</script>"));

	jQuery("#qunit-fixture").html(valueObj("foo <form><script type='text/javascript'>ok( true, 'jQuery().html().evalScripts() Evals Scripts Twice in Firefox, see #975 (2)' );</script></form>"));

	jQuery("#qunit-fixture").html(valueObj("<script>equal(jQuery.scriptorder++, 0, 'Script is executed in order');equal(jQuery('#scriptorder').length, 1,'Execute after html (even though appears before)')<\/script><span id='scriptorder'><script>equal(jQuery.scriptorder++, 1, 'Script (nested) is executed in order');equal(jQuery('#scriptorder').length, 1,'Execute after html')<\/script></span><script>equal(jQuery.scriptorder++, 2, 'Script (unnested) is executed in order');equal(jQuery('#scriptorder').length, 1,'Execute after html')<\/script>"));
}

test("html(String)", function() {
	testHtml(bareObj);
});

test("html(Function)", function() {
	testHtml(functionReturningObj);

	expect(36);

	QUnit.reset();

	jQuery("#qunit-fixture").html(function(){
		return jQuery(this).text();
	});

	ok( !/</.test( jQuery("#qunit-fixture").html() ), "Replace html with text." );
	ok( jQuery("#qunit-fixture").html().length > 0, "Make sure text exists." );
});

test("html(Function) with incoming value", function() {
	expect(20);

	var div = jQuery("#qunit-fixture > div"), old = div.map(function(){ return jQuery(this).html() });

	div.html(function(i, val) {
		equal( val, old[i], "Make sure the incoming value is correct." );
		return "<b>test</b>";
	});

	var pass = true;
	div.each(function(){
		if ( this.childNodes.length !== 1 ) {
			pass = false;
		}
	})
	ok( pass, "Set HTML" );

	QUnit.reset();
	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	old = j.map(function(){ return jQuery(this).html(); });

	j.html(function(i, val) {
		equal( val, old[i], "Make sure the incoming value is correct." );
		return "<b>bold</b>";
	});

	// Handle the case where no comment is in the document
	if ( j.length === 2 ) {
		equal( null, null, "Make sure the incoming value is correct." );
	}

	j.find("b").removeData();
	equal( j.html().replace(/ xmlns="[^"]+"/g, "").toLowerCase(), "<b>bold</b>", "Check node,textnode,comment with html()" );

	var $div = jQuery("<div />");

	equal( $div.html(function(i, val) {
		equal( val, "", "Make sure the incoming value is correct." );
		return 5;
	}).html(), "5", "Setting a number as html" );

	equal( $div.html(function(i, val) {
		equal( val, "5", "Make sure the incoming value is correct." );
		return 0;
	}).html(), "0", "Setting a zero as html" );

	var $div2 = jQuery("<div/>"), insert = "&lt;div&gt;hello1&lt;/div&gt;";
	equal( $div2.html(function(i, val) {
		equal( val, "", "Make sure the incoming value is correct." );
		return insert;
	}).html().replace(/>/g, "&gt;"), insert, "Verify escaped insertion." );

	equal( $div2.html(function(i, val) {
		equal( val.replace(/>/g, "&gt;"), insert, "Make sure the incoming value is correct." );
		return "x" + insert;
	}).html().replace(/>/g, "&gt;"), "x" + insert, "Verify escaped insertion." );

	equal( $div2.html(function(i, val) {
		equal( val.replace(/>/g, "&gt;"), "x" + insert, "Make sure the incoming value is correct." );
		return " " + insert;
	}).html().replace(/>/g, "&gt;"), " " + insert, "Verify escaped insertion." );
});

var testRemove = function(method) {
	expect(9);

	var first = jQuery("#ap").children(":first");
	first.data("foo", "bar");

	jQuery("#ap").children()[method]();
	ok( jQuery("#ap").text().length > 10, "Check text is not removed" );
	equal( jQuery("#ap").children().length, 0, "Check remove" );

	equal( first.data("foo"), method == "remove" ? null : "bar" );

	QUnit.reset();
	jQuery("#ap").children()[method]("a");
	ok( jQuery("#ap").text().length > 10, "Check text is not removed" );
	equal( jQuery("#ap").children().length, 1, "Check filtered remove" );

	jQuery("#ap").children()[method]("a, code");
	equal( jQuery("#ap").children().length, 0, "Check multi-filtered remove" );

	// using contents will get comments regular, text, and comment nodes
	// Handle the case where no comment is in the document
	ok( jQuery("#nonnodes").contents().length >= 2, "Check node,textnode,comment remove works" );
	jQuery("#nonnodes").contents()[method]();
	equal( jQuery("#nonnodes").contents().length, 0, "Check node,textnode,comment remove works" );

	// manually clean up detached elements
	if (method === "detach") {
		first.remove();
	}

	QUnit.reset();

	var count = 0;
	var first = jQuery("#ap").children(":first");
	var cleanUp = first.click(function() { count++ })[method]().appendTo("#qunit-fixture").click();

	equal( method == "remove" ? 0 : 1, count );

	// manually clean up detached elements
	cleanUp.remove();
};

test("remove()", function() {
	testRemove("remove");
});

test("detach()", function() {
	testRemove("detach");
});

test("empty()", function() {
	expect(3);
	equal( jQuery("#ap").children().empty().text().length, 0, "Check text is removed" );
	equal( jQuery("#ap").children().length, 4, "Check elements are not removed" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.empty();
	equal( j.html(), "", "Check node,textnode,comment empty works" );
});

test("jQuery.cleanData", function() {
	expect(14);

	var type, pos, div, child;

	type = "remove";

	// Should trigger 4 remove event
	div = getDiv().remove();

	// Should both do nothing
	pos = "Outer";
	div.trigger("click");

	pos = "Inner";
	div.children().trigger("click");

	type = "empty";
	div = getDiv();
	child = div.children();

	// Should trigger 2 remove event
	div.empty();

	// Should trigger 1
	pos = "Outer";
	div.trigger("click");

	// Should do nothing
	pos = "Inner";
	child.trigger("click");

	// Should trigger 2
	div.remove();

	type = "html";

	div = getDiv();
	child = div.children();

	// Should trigger 2 remove event
	div.html("<div></div>");

	// Should trigger 1
	pos = "Outer";
	div.trigger("click");

	// Should do nothing
	pos = "Inner";
	child.trigger("click");

	// Should trigger 2
	div.remove();

	function getDiv() {
		var div = jQuery("<div class='outer'><div class='inner'></div></div>").click(function(){
			ok( true, type + " " + pos + " Click event fired." );
		}).focus(function(){
			ok( true, type + " " + pos + " Focus event fired." );
		}).find("div").click(function(){
			ok( false, type + " " + pos + " Click event fired." );
		}).focus(function(){
			ok( false, type + " " + pos + " Focus event fired." );
		}).end().appendTo("body");

		div[0].detachEvent = div[0].removeEventListener = function(t){
			ok( true, type + " Outer " + t + " event unbound" );
		};

		div[0].firstChild.detachEvent = div[0].firstChild.removeEventListener = function(t){
			ok( true, type + " Inner " + t + " event unbound" );
		};

		return div;
	}
});

test("jQuery.buildFragment - no plain-text caching (Bug #6779)", function() {
	expect(1);

	// DOM manipulation fails if added text matches an Object method
	var $f = jQuery( "<div />" ).appendTo( "#qunit-fixture" ),
		bad = [ "start-", "toString", "hasOwnProperty", "append", "here&there!", "-end" ];

	for ( var i=0; i < bad.length; i++ ) {
		try {
			$f.append( bad[i] );
		}
		catch(e) {}
	}
	equal($f.text(), bad.join(""), "Cached strings that match Object properties");
	$f.remove();
});

test( "jQuery.html - execute scripts escaped with html comment or CDATA (#9221)", function() {
	expect( 3 );
	jQuery( [
	         '<script type="text/javascript">',
	         '<!--',
	         'ok( true, "<!-- handled" );',
	         '//-->',
	         '</script>'
	     ].join ( "\n" ) ).appendTo( "#qunit-fixture" );
	jQuery( [
	         '<script type="text/javascript">',
	         '<![CDATA[',
	         'ok( true, "<![CDATA[ handled" );',
	         '//]]>',
	         '</script>'
	     ].join ( "\n" ) ).appendTo( "#qunit-fixture" );
	jQuery( [
	         '<script type="text/javascript">',
	         '<!--//--><![CDATA[//><!--',
	         'ok( true, "<!--//--><![CDATA[//><!-- (Drupal case) handled" );',
	         '//--><!]]>',
	         '</script>'
	     ].join ( "\n" ) ).appendTo( "#qunit-fixture" );
});

test("jQuery.buildFragment - plain objects are not a document #8950", function() {
	expect(1);

	try {
		jQuery('<input type="hidden">', {});
		ok( true, "Does not allow attribute object to be treated like a doc object");
	} catch (e) {}

});

test("jQuery.clone - no exceptions for object elements #9587", function() {
	expect(1);

	try {
		jQuery("#no-clone-exception").clone();
		ok( true, "cloned with no exceptions" );
	} catch( e ) {
		ok( false, e.message );
	}
});

test("jQuery(<tag>) & wrap[Inner/All]() handle unknown elems (#10667)", function() {
	expect(2);

	var $wraptarget = jQuery( "<div id='wrap-target'>Target</div>" ).appendTo( "#qunit-fixture" ),
			$section = jQuery( "<section>" ).appendTo( "#qunit-fixture" );

	$wraptarget.wrapAll("<aside style='background-color:green'></aside>");

	notEqual( $wraptarget.parent("aside").css("background-color"), "transparent", "HTML5 elements created with wrapAll inherit styles" );
	notEqual( $section.css("background-color"), "transparent", "HTML5 elements create with jQuery( string ) inherit styles" );
});

test("Cloned, detached HTML5 elems (#10667,10670)", function() {
	expect(7);

	var $section = jQuery( "<section>" ).appendTo( "#qunit-fixture" ),
			$clone;

	// First clone
	$clone = $section.clone();

	// Infer that the test is being run in IE<=8
	if ( $clone[0].outerHTML && !jQuery.support.opacity ) {
		// This branch tests cloning nodes by reading the outerHTML, used only in IE<=8
		equal( $clone[0].outerHTML, "<section></section>", "detached clone outerHTML matches '<section></section>'" );
	} else {
		// This branch tests a known behaviour in modern browsers that should never fail.
		// Included for expected test count symmetry (expecting 1)
		equal( $clone[0].nodeName, "SECTION", "detached clone nodeName matches 'SECTION' in modern browsers" );
	}

	// Bind an event
	$section.bind( "click", function( event ) {
		ok( true, "clone fired event" );
	});

	// Second clone (will have an event bound)
	$clone = $section.clone( true );

	// Trigger an event from the first clone
	$clone.trigger( "click" );
	$clone.unbind( "click" );

	// Add a child node with text to the original
	$section.append( "<p>Hello</p>" );

	// Third clone (will have child node and text)
	$clone = $section.clone( true );

	equal( $clone.find("p").text(), "Hello", "Assert text in child of clone" );

	// Trigger an event from the third clone
	$clone.trigger( "click" );
	$clone.unbind( "click" );

	// Add attributes to copy
	$section.attr({
		"class": "foo bar baz",
		"title": "This is a title"
	});

	// Fourth clone (will have newly added attributes)
	$clone = $section.clone( true );

	equal( $clone.attr("class"), $section.attr("class"), "clone and element have same class attribute" );
	equal( $clone.attr("title"), $section.attr("title"), "clone and element have same title attribute" );

	// Remove the original
	$section.remove();

	// Clone the clone
	$section = $clone.clone( true );

	// Remove the clone
	$clone.remove();

	// Trigger an event from the clone of the clone
	$section.trigger( "click" );

	// Unbind any remaining events
	$section.unbind( "click" );
	$clone.unbind( "click" );
});

test("jQuery.fragments cache expectations", function() {

	expect( 10 );

	jQuery.fragments = {};

	function fragmentCacheSize() {
		var n = 0, c;

		for ( c in jQuery.fragments ) {
			n++;
		}
		return n;
	}

	jQuery("<li></li>");
	jQuery("<li>?</li>");
	jQuery("<li>whip</li>");
	jQuery("<li>it</li>");
	jQuery("<li>good</li>");
	jQuery("<div></div>");
	jQuery("<div><div><span></span></div></div>");
	jQuery("<tr><td></td></tr>");
	jQuery("<tr><td></tr>");
	jQuery("<li>aaa</li>");
	jQuery("<ul><li>?</li></ul>");
	jQuery("<div><p>arf</p>nnn</div>");
	jQuery("<div><p>dog</p>?</div>");
	jQuery("<span><span>");

	equal( fragmentCacheSize(), 12, "12 entries exist in jQuery.fragments, 1" );

	jQuery.each( [
		"<tr><td></td></tr>",
		"<ul><li>?</li></ul>",
		"<div><p>dog</p>?</div>",
		"<span><span>"
	], function( i, frag ) {

		jQuery( frag );

		equal( jQuery.fragments[ frag ].nodeType, 11, "Second call with " + frag + " creates a cached DocumentFragment, has nodeType 11" );
		ok( jQuery.fragments[ frag ].childNodes.length, "Second call with " + frag + " creates a cached DocumentFragment, has childNodes with length" );
	});

	equal( fragmentCacheSize(), 12, "12 entries exist in jQuery.fragments, 2" );
});
module("traversing", { teardown: moduleTeardown });

test("find(String)", function() {
	expect(5);
	equal( "Yahoo", jQuery("#foo").find(".blogTest").text(), "Check for find" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	equal( j.find("div").length, 0, "Check node,textnode,comment to find zero divs" );

	deepEqual( jQuery("#qunit-fixture").find("> div").get(), q("foo", "moretests", "tabindex-tests", "liveHandlerOrder", "siblingTest"), "find child elements" );
	deepEqual( jQuery("#qunit-fixture").find("> #foo, > #moretests").get(), q("foo", "moretests"), "find child elements" );
	deepEqual( jQuery("#qunit-fixture").find("> #foo > p").get(), q("sndp", "en", "sap"), "find child elements" );
});

test("find(node|jQuery object)", function() {
	expect( 11 );

	var $foo = jQuery("#foo"),
		$blog = jQuery(".blogTest"),
		$first = jQuery("#first"),
		$two = $blog.add( $first ),
		$fooTwo = $foo.add( $blog );

	equal( $foo.find( $blog ).text(), "Yahoo", "Find with blog jQuery object" );
	equal( $foo.find( $blog[0] ).text(), "Yahoo", "Find with blog node" );
	equal( $foo.find( $first ).length, 0, "#first is not in #foo" );
	equal( $foo.find( $first[0]).length, 0, "#first not in #foo (node)" );
	ok( $foo.find( $two ).is(".blogTest"), "Find returns only nodes within #foo" );
	ok( $fooTwo.find( $blog ).is(".blogTest"), "Blog is part of the collection, but also within foo" );
	ok( $fooTwo.find( $blog[0] ).is(".blogTest"), "Blog is part of the collection, but also within foo(node)" );

	equal( $two.find( $foo ).length, 0, "Foo is not in two elements" );
	equal( $two.find( $foo[0] ).length, 0, "Foo is not in two elements(node)" );
	equal( $two.find( $first ).length, 0, "first is in the collection and not within two" );
	equal( $two.find( $first ).length, 0, "first is in the collection and not within two(node)" );

});

test("is(String|undefined)", function() {
	expect(29);
	ok( jQuery("#form").is("form"), "Check for element: A form must be a form" );
	ok( !jQuery("#form").is("div"), "Check for element: A form is not a div" );
	ok( jQuery("#mark").is(".blog"), "Check for class: Expected class 'blog'" );
	ok( !jQuery("#mark").is(".link"), "Check for class: Did not expect class 'link'" );
	ok( jQuery("#simon").is(".blog.link"), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	ok( !jQuery("#simon").is(".blogTest"), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
	ok( jQuery("#en").is("[lang=\"en\"]"), "Check for attribute: Expected attribute lang to be 'en'" );
	ok( !jQuery("#en").is("[lang=\"de\"]"), "Check for attribute: Expected attribute lang to be 'en', not 'de'" );
	ok( jQuery("#text1").is("[type=\"text\"]"), "Check for attribute: Expected attribute type to be 'text'" );
	ok( !jQuery("#text1").is("[type=\"radio\"]"), "Check for attribute: Expected attribute type to be 'text', not 'radio'" );
	ok( jQuery("#text2").is(":disabled"), "Check for pseudoclass: Expected to be disabled" );
	ok( !jQuery("#text1").is(":disabled"), "Check for pseudoclass: Expected not disabled" );
	ok( jQuery("#radio2").is(":checked"), "Check for pseudoclass: Expected to be checked" );
	ok( !jQuery("#radio1").is(":checked"), "Check for pseudoclass: Expected not checked" );
	ok( jQuery("#foo").is(":has(p)"), "Check for child: Expected a child 'p' element" );
	ok( !jQuery("#foo").is(":has(ul)"), "Check for child: Did not expect 'ul' element" );
	ok( jQuery("#foo").is(":has(p):has(a):has(code)"), "Check for childs: Expected 'p', 'a' and 'code' child elements" );
	ok( !jQuery("#foo").is(":has(p):has(a):has(code):has(ol)"), "Check for childs: Expected 'p', 'a' and 'code' child elements, but no 'ol'" );

	ok( !jQuery("#foo").is(0), "Expected false for an invalid expression - 0" );
	ok( !jQuery("#foo").is(null), "Expected false for an invalid expression - null" );
	ok( !jQuery("#foo").is(""), "Expected false for an invalid expression - \"\"" );
	ok( !jQuery("#foo").is(undefined), "Expected false for an invalid expression - undefined" );
	ok( !jQuery("#foo").is({ plain: "object" }), "Check passing invalid object" );

	// test is() with comma-seperated expressions
	ok( jQuery("#en").is("[lang=\"en\"],[lang=\"de\"]"), "Comma-seperated; Check for lang attribute: Expect en or de" );
	ok( jQuery("#en").is("[lang=\"de\"],[lang=\"en\"]"), "Comma-seperated; Check for lang attribute: Expect en or de" );
	ok( jQuery("#en").is("[lang=\"en\"] , [lang=\"de\"]"), "Comma-seperated; Check for lang attribute: Expect en or de" );
	ok( jQuery("#en").is("[lang=\"de\"] , [lang=\"en\"]"), "Comma-seperated; Check for lang attribute: Expect en or de" );

	ok( !jQuery(window).is('a'), "Checking is on a window does not throw an exception(#10178)" );
	ok( !jQuery(document).is('a'), "Checking is on a document does not throw an exception(#10178)" );
});

test("is(jQuery)", function() {
	expect(21);
	ok( jQuery("#form").is( jQuery("form") ), "Check for element: A form is a form" );
	ok( !jQuery("#form").is( jQuery("div") ), "Check for element: A form is not a div" );
	ok( jQuery("#mark").is( jQuery(".blog") ), "Check for class: Expected class 'blog'" );
	ok( !jQuery("#mark").is( jQuery(".link") ), "Check for class: Did not expect class 'link'" );
	ok( jQuery("#simon").is( jQuery(".blog.link") ), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	ok( !jQuery("#simon").is( jQuery(".blogTest") ), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
	ok( jQuery("#en").is( jQuery("[lang=\"en\"]") ), "Check for attribute: Expected attribute lang to be 'en'" );
	ok( !jQuery("#en").is( jQuery("[lang=\"de\"]") ), "Check for attribute: Expected attribute lang to be 'en', not 'de'" );
	ok( jQuery("#text1").is( jQuery("[type=\"text\"]") ), "Check for attribute: Expected attribute type to be 'text'" );
	ok( !jQuery("#text1").is( jQuery("[type=\"radio\"]") ), "Check for attribute: Expected attribute type to be 'text', not 'radio'" );
	ok( !jQuery("#text1").is( jQuery("input:disabled") ), "Check for pseudoclass: Expected not disabled" );
	ok( jQuery("#radio2").is( jQuery("input:checked") ), "Check for pseudoclass: Expected to be checked" );
	ok( !jQuery("#radio1").is( jQuery("input:checked") ), "Check for pseudoclass: Expected not checked" );
	ok( jQuery("#foo").is( jQuery("div:has(p)") ), "Check for child: Expected a child 'p' element" );
	ok( !jQuery("#foo").is( jQuery("div:has(ul)") ), "Check for child: Did not expect 'ul' element" );

	// Some raw elements
	ok( jQuery("#form").is( jQuery("form")[0] ), "Check for element: A form is a form" );
	ok( !jQuery("#form").is( jQuery("div")[0] ), "Check for element: A form is not a div" );
	ok( jQuery("#mark").is( jQuery(".blog")[0] ), "Check for class: Expected class 'blog'" );
	ok( !jQuery("#mark").is( jQuery(".link")[0] ), "Check for class: Did not expect class 'link'" );
	ok( jQuery("#simon").is( jQuery(".blog.link")[0] ), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	ok( !jQuery("#simon").is( jQuery(".blogTest")[0] ), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
});

test("is() with positional selectors", function() {
	expect(23);

	var html = jQuery(
				'<p id="posp"><a class="firsta" href="#"><em>first</em></a><a class="seconda" href="#"><b>test</b></a><em></em></p>'
			).appendTo( "body" ),
		isit = function(sel, match, expect) {
			equal( jQuery( sel ).is( match ), expect, "jQuery( " + sel + " ).is( " + match + " )" );
		};

	isit( "#posp", "#posp:first", true );
	isit( "#posp", "#posp:eq(2)", false );
	isit( "#posp", "#posp a:first", false );

	isit( "#posp .firsta", "#posp a:first", true );
	isit( "#posp .firsta", "#posp a:last", false );
	isit( "#posp .firsta", "#posp a:even", true );
	isit( "#posp .firsta", "#posp a:odd", false );
	isit( "#posp .firsta", "#posp a:eq(0)", true );
	isit( "#posp .firsta", "#posp a:eq(9)", false );
	isit( "#posp .firsta", "#posp em:eq(0)", false );
	isit( "#posp .firsta", "#posp em:first", false );
	isit( "#posp .firsta", "#posp:first", false );

	isit( "#posp .seconda", "#posp a:first", false );
	isit( "#posp .seconda", "#posp a:last", true );
	isit( "#posp .seconda", "#posp a:gt(0)", true );
	isit( "#posp .seconda", "#posp a:lt(5)", true );
	isit( "#posp .seconda", "#posp a:lt(1)", false );

	isit( "#posp em", "#posp a:eq(0) em", true );
	isit( "#posp em", "#posp a:lt(1) em", true );
	isit( "#posp em", "#posp a:gt(1) em", false );
	isit( "#posp em", "#posp a:first em", true );
	isit( "#posp em", "#posp a em:last", true );
	isit( "#posp em", "#posp a em:eq(2)", false );

	html.remove();
});

test("index()", function() {
	expect( 2 );

	equal( jQuery("#text2").index(), 2, "Returns the index of a child amongst its siblings" );

	equal( jQuery("<div/>").index(), -1, "Node without parent returns -1" );
});

test("index(Object|String|undefined)", function() {
	expect(16);

	var elements = jQuery([window, document]),
		inputElements = jQuery("#radio1,#radio2,#check1,#check2");

	// Passing a node
	equal( elements.index(window), 0, "Check for index of elements" );
	equal( elements.index(document), 1, "Check for index of elements" );
	equal( inputElements.index(document.getElementById("radio1")), 0, "Check for index of elements" );
	equal( inputElements.index(document.getElementById("radio2")), 1, "Check for index of elements" );
	equal( inputElements.index(document.getElementById("check1")), 2, "Check for index of elements" );
	equal( inputElements.index(document.getElementById("check2")), 3, "Check for index of elements" );
	equal( inputElements.index(window), -1, "Check for not found index" );
	equal( inputElements.index(document), -1, "Check for not found index" );

	// Passing a jQuery object
	// enabled since [5500]
	equal( elements.index( elements ), 0, "Pass in a jQuery object" );
	equal( elements.index( elements.eq(1) ), 1, "Pass in a jQuery object" );
	equal( jQuery("#form :radio").index( jQuery("#radio2") ), 1, "Pass in a jQuery object" );

	// Passing a selector or nothing
	// enabled since [6330]
	equal( jQuery("#text2").index(), 2, "Check for index amongst siblings" );
	equal( jQuery("#form").children().eq(4).index(), 4, "Check for index amongst siblings" );
	equal( jQuery("#radio2").index("#form :radio") , 1, "Check for index within a selector" );
	equal( jQuery("#form :radio").index( jQuery("#radio2") ), 1, "Check for index within a selector" );
	equal( jQuery("#radio2").index("#form :text") , -1, "Check for index not found within a selector" );
});

test("filter(Selector|undefined)", function() {
	expect(9);
	deepEqual( jQuery("#form input").filter(":checked").get(), q("radio2", "check1"), "filter(String)" );
	deepEqual( jQuery("p").filter("#ap, #sndp").get(), q("ap", "sndp"), "filter('String, String')" );
	deepEqual( jQuery("p").filter("#ap,#sndp").get(), q("ap", "sndp"), "filter('String,String')" );

	deepEqual( jQuery("p").filter(null).get(),      [], "filter(null) should return an empty jQuery object");
	deepEqual( jQuery("p").filter(undefined).get(), [], "filter(undefined) should return an empty jQuery object");
	deepEqual( jQuery("p").filter(0).get(),         [], "filter(0) should return an empty jQuery object");
	deepEqual( jQuery("p").filter("").get(),        [], "filter('') should return an empty jQuery object");

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	equal( j.filter("span").length, 1, "Check node,textnode,comment to filter the one span" );
	equal( j.filter("[name]").length, 0, "Check node,textnode,comment to filter the one span" );
});

test("filter(Function)", function() {
	expect(2);

	deepEqual( jQuery("#qunit-fixture p").filter(function() { return !jQuery("a", this).length }).get(), q("sndp", "first"), "filter(Function)" );

	deepEqual( jQuery("#qunit-fixture p").filter(function(i, elem) { return !jQuery("a", elem).length }).get(), q("sndp", "first"), "filter(Function) using arg" );
});

test("filter(Element)", function() {
	expect(1);

	var element = document.getElementById("text1");
	deepEqual( jQuery("#form input").filter(element).get(), q("text1"), "filter(Element)" );
});

test("filter(Array)", function() {
	expect(1);

	var elements = [ document.getElementById("text1") ];
	deepEqual( jQuery("#form input").filter(elements).get(), q("text1"), "filter(Element)" );
});

test("filter(jQuery)", function() {
	expect(1);

	var elements = jQuery("#text1");
	deepEqual( jQuery("#form input").filter(elements).get(), q("text1"), "filter(Element)" );
});


test("filter() with positional selectors", function() {
	expect(19);

	var html = jQuery('' +
		'<p id="posp">' +
			'<a class="firsta" href="#">' +
				'<em>first</em>' +
			'</a>' +
			'<a class="seconda" href="#">' +
				'<b>test</b>' +
			'</a>' +
			'<em></em>' +
		'</p>').appendTo( "body" ),
		filterit = function(sel, filter, length) {
			equal( jQuery( sel ).filter( filter ).length, length, "jQuery( " + sel + " ).filter( " + filter + " )" );
		};

	filterit( "#posp", "#posp:first", 1);
	filterit( "#posp", "#posp:eq(2)", 0 );
	filterit( "#posp", "#posp a:first", 0 );

	// Keep in mind this is within the selection and
	// not in relation to other elements (.is() is a different story)
	filterit( "#posp .firsta", "#posp a:first", 1 );
	filterit( "#posp .firsta", "#posp a:last", 1 );
	filterit( "#posp .firsta", "#posp a:last-child", 0 );
	filterit( "#posp .firsta", "#posp a:even", 1 );
	filterit( "#posp .firsta", "#posp a:odd", 0 );
	filterit( "#posp .firsta", "#posp a:eq(0)", 1 );
	filterit( "#posp .firsta", "#posp a:eq(9)", 0 );
	filterit( "#posp .firsta", "#posp em:eq(0)", 0 );
	filterit( "#posp .firsta", "#posp em:first", 0 );
	filterit( "#posp .firsta", "#posp:first", 0 );

	filterit( "#posp .seconda", "#posp a:first", 1 );
	filterit( "#posp .seconda", "#posp em:first", 0 );
	filterit( "#posp .seconda", "#posp a:last", 1 );
	filterit( "#posp .seconda", "#posp a:gt(0)", 0 );
	filterit( "#posp .seconda", "#posp a:lt(5)", 1 );
	filterit( "#posp .seconda", "#posp a:lt(1)", 1 );
	html.remove();
});

test("closest()", function() {
	expect(13);
	deepEqual( jQuery("body").closest("body").get(), q("body"), "closest(body)" );
	deepEqual( jQuery("body").closest("html").get(), q("html"), "closest(html)" );
	deepEqual( jQuery("body").closest("div").get(), [], "closest(div)" );
	deepEqual( jQuery("#qunit-fixture").closest("span,#html").get(), q("html"), "closest(span,#html)" );

	deepEqual( jQuery("div:eq(1)").closest("div:first").get(), [], "closest(div:first)" );
	deepEqual( jQuery("div").closest("body:first div:last").get(), q("fx-tests"), "closest(body:first div:last)" );

	// Test .closest() limited by the context
	var jq = jQuery("#nothiddendivchild");
	deepEqual( jq.closest("html", document.body).get(), [], "Context limited." );
	deepEqual( jq.closest("body", document.body).get(), [], "Context limited." );
	deepEqual( jq.closest("#nothiddendiv", document.body).get(), q("nothiddendiv"), "Context not reached." );

	//Test that .closest() returns unique'd set
	equal( jQuery("#qunit-fixture p").closest("#qunit-fixture").length, 1, "Closest should return a unique set" );

	// Test on disconnected node
	equal( jQuery("<div><p></p></div>").find("p").closest("table").length, 0, "Make sure disconnected closest work." );

	// Bug #7369
	equal( jQuery("<div foo='bar'></div>").closest("[foo]").length, 1, "Disconnected nodes with attribute selector" );
	equal( jQuery("<div>text</div>").closest("[lang]").length, 0, "Disconnected nodes with text and non-existent attribute selector" );
});

test("closest(Array)", function() {
	expect(7);
	deepEqual( jQuery("body").closest(["body"]), [{selector:"body", elem:document.body, level:1}], "closest([body])" );
	deepEqual( jQuery("body").closest(["html"]), [{selector:"html", elem:document.documentElement, level:2}], "closest([html])" );
	deepEqual( jQuery("body").closest(["div"]), [], "closest([div])" );
	deepEqual( jQuery("#yahoo").closest(["div"]), [{"selector":"div", "elem": document.getElementById("foo"), "level": 3}, { "selector": "div", "elem": document.getElementById("qunit-fixture"), "level": 4 }], "closest([div])" );
	deepEqual( jQuery("#qunit-fixture").closest(["span,#html"]), [{selector:"span,#html", elem:document.documentElement, level:4}], "closest([span,#html])" );

	deepEqual( jQuery("body").closest(["body","html"]), [{selector:"body", elem:document.body, level:1}, {selector:"html", elem:document.documentElement, level:2}], "closest([body, html])" );
	deepEqual( jQuery("body").closest(["span","html"]), [{selector:"html", elem:document.documentElement, level:2}], "closest([body, html])" );
});

test("closest(jQuery)", function() {
	expect(8);
	var $child = jQuery("#nothiddendivchild"),
		$parent = jQuery("#nothiddendiv"),
		$main = jQuery("#qunit-fixture"),
		$body = jQuery("body");
	ok( $child.closest( $parent ).is("#nothiddendiv"), "closest( jQuery('#nothiddendiv') )" );
	ok( $child.closest( $parent[0] ).is("#nothiddendiv"), "closest( jQuery('#nothiddendiv') ) :: node" );
	ok( $child.closest( $child ).is("#nothiddendivchild"), "child is included" );
	ok( $child.closest( $child[0] ).is("#nothiddendivchild"), "child is included  :: node" );
	equal( $child.closest( document.createElement("div") ).length, 0, "created element is not related" );
	equal( $child.closest( $main ).length, 0, "Main not a parent of child" );
	equal( $child.closest( $main[0] ).length, 0, "Main not a parent of child :: node" );
	ok( $child.closest( $body.add($parent) ).is("#nothiddendiv"), "Closest ancestor retrieved." );
});

test("not(Selector|undefined)", function() {
	expect(11);
	equal( jQuery("#qunit-fixture > p#ap > a").not("#google").length, 2, "not('selector')" );
	deepEqual( jQuery("p").not(".result").get(), q("firstp", "ap", "sndp", "en", "sap", "first"), "not('.class')" );
	deepEqual( jQuery("p").not("#ap, #sndp, .result").get(), q("firstp", "en", "sap", "first"), "not('selector, selector')" );
	deepEqual( jQuery("#form option").not("option.emptyopt:contains('Nothing'),[selected],[value='1']").get(), q("option1c", "option1d", "option2c", "option3d", "option3e", "option4e","option5b"), "not('complex selector')");

	deepEqual( jQuery("#ap *").not("code").get(), q("google", "groups", "anchor1", "mark"), "not('tag selector')" );
	deepEqual( jQuery("#ap *").not("code, #mark").get(), q("google", "groups", "anchor1"), "not('tag, ID selector')" );
	deepEqual( jQuery("#ap *").not("#mark, code").get(), q("google", "groups", "anchor1"), "not('ID, tag selector')");

	var all = jQuery("p").get();
	deepEqual( jQuery("p").not(null).get(),      all, "not(null) should have no effect");
	deepEqual( jQuery("p").not(undefined).get(), all, "not(undefined) should have no effect");
	deepEqual( jQuery("p").not(0).get(),         all, "not(0) should have no effect");
	deepEqual( jQuery("p").not("").get(),        all, "not('') should have no effect");
});

test("not(Element)", function() {
	expect(1);

	var selects = jQuery("#form select");
	deepEqual( selects.not( selects[1] ).get(), q("select1", "select3", "select4", "select5"), "filter out DOM element");
});

test("not(Function)", function() {
	deepEqual( jQuery("#qunit-fixture p").not(function() { return jQuery("a", this).length }).get(), q("sndp", "first"), "not(Function)" );
});

test("not(Array)", function() {
	expect(2);

	equal( jQuery("#qunit-fixture > p#ap > a").not(document.getElementById("google")).length, 2, "not(DOMElement)" );
	equal( jQuery("p").not(document.getElementsByTagName("p")).length, 0, "not(Array-like DOM collection)" );
});

test("not(jQuery)", function() {
	expect(1);

	deepEqual( jQuery("p").not(jQuery("#ap, #sndp, .result")).get(), q("firstp", "en", "sap", "first"), "not(jQuery)" );
});

test("has(Element)", function() {
	expect(2);

	var obj = jQuery("#qunit-fixture").has(jQuery("#sndp")[0]);
	deepEqual( obj.get(), q("qunit-fixture"), "Keeps elements that have the element as a descendant" );

	var multipleParent = jQuery("#qunit-fixture, #header").has(jQuery("#sndp")[0]);
	deepEqual( obj.get(), q("qunit-fixture"), "Does not include elements that do not have the element as a descendant" );
});

test("has(Selector)", function() {
	expect(3);

	var obj = jQuery("#qunit-fixture").has("#sndp");
	deepEqual( obj.get(), q("qunit-fixture"), "Keeps elements that have any element matching the selector as a descendant" );

	var multipleParent = jQuery("#qunit-fixture, #header").has("#sndp");
	deepEqual( obj.get(), q("qunit-fixture"), "Does not include elements that do not have the element as a descendant" );

	var multipleHas = jQuery("#qunit-fixture").has("#sndp, #first");
	deepEqual( multipleHas.get(), q("qunit-fixture"), "Only adds elements once" );
});

test("has(Arrayish)", function() {
	expect(3);

	var simple = jQuery("#qunit-fixture").has(jQuery("#sndp"));
	deepEqual( simple.get(), q("qunit-fixture"), "Keeps elements that have any element in the jQuery list as a descendant" );

	var multipleParent = jQuery("#qunit-fixture, #header").has(jQuery("#sndp"));
	deepEqual( multipleParent.get(), q("qunit-fixture"), "Does not include elements that do not have an element in the jQuery list as a descendant" );

	var multipleHas = jQuery("#qunit-fixture").has(jQuery("#sndp, #first"));
	deepEqual( simple.get(), q("qunit-fixture"), "Only adds elements once" );
});

test("andSelf()", function() {
	expect(4);
	deepEqual( jQuery("#en").siblings().andSelf().get(), q("sndp", "en", "sap"), "Check for siblings and self" );
	deepEqual( jQuery("#foo").children().andSelf().get(), q("foo", "sndp", "en", "sap"), "Check for children and self" );
	deepEqual( jQuery("#sndp, #en").parent().andSelf().get(), q("foo","sndp","en"), "Check for parent and self" );
	deepEqual( jQuery("#groups").parents("p, div").andSelf().get(), q("qunit-fixture", "ap", "groups"), "Check for parents and self" );
});

test("siblings([String])", function() {
	expect(6);
	deepEqual( jQuery("#en").siblings().get(), q("sndp", "sap"), "Check for siblings" );
	deepEqual( jQuery("#sndp").siblings(":has(code)").get(), q("sap"), "Check for filtered siblings (has code child element)" );
	deepEqual( jQuery("#sndp").siblings(":has(a)").get(), q("en", "sap"), "Check for filtered siblings (has anchor child element)" );
	deepEqual( jQuery("#foo").siblings("form, b").get(), q("form", "floatTest", "lengthtest", "name-tests", "testForm"), "Check for multiple filters" );
	var set = q("sndp", "en", "sap");
	deepEqual( jQuery("#en, #sndp").siblings().get(), set, "Check for unique results from siblings" );
	deepEqual( jQuery("#option5a").siblings("option[data-attr]").get(), q("option5c"), "Has attribute selector in siblings (#9261)" );
});

test("children([String])", function() {
	expect(3);
	deepEqual( jQuery("#foo").children().get(), q("sndp", "en", "sap"), "Check for children" );
	deepEqual( jQuery("#foo").children(":has(code)").get(), q("sndp", "sap"), "Check for filtered children" );
	deepEqual( jQuery("#foo").children("#en, #sap").get(), q("en", "sap"), "Check for multiple filters" );
});

test("parent([String])", function() {
	expect(5);
	equal( jQuery("#groups").parent()[0].id, "ap", "Simple parent check" );
	equal( jQuery("#groups").parent("p")[0].id, "ap", "Filtered parent check" );
	equal( jQuery("#groups").parent("div").length, 0, "Filtered parent check, no match" );
	equal( jQuery("#groups").parent("div, p")[0].id, "ap", "Check for multiple filters" );
	deepEqual( jQuery("#en, #sndp").parent().get(), q("foo"), "Check for unique results from parent" );
});

test("parents([String])", function() {
	expect(5);
	equal( jQuery("#groups").parents()[0].id, "ap", "Simple parents check" );
	equal( jQuery("#groups").parents("p")[0].id, "ap", "Filtered parents check" );
	equal( jQuery("#groups").parents("div")[0].id, "qunit-fixture", "Filtered parents check2" );
	deepEqual( jQuery("#groups").parents("p, div").get(), q("ap", "qunit-fixture"), "Check for multiple filters" );
	deepEqual( jQuery("#en, #sndp").parents().get(), q("foo", "qunit-fixture", "dl", "body", "html"), "Check for unique results from parents" );
});

test("parentsUntil([String])", function() {
	expect(9);

	var parents = jQuery("#groups").parents();

	deepEqual( jQuery("#groups").parentsUntil().get(), parents.get(), "parentsUntil with no selector (nextAll)" );
	deepEqual( jQuery("#groups").parentsUntil(".foo").get(), parents.get(), "parentsUntil with invalid selector (nextAll)" );
	deepEqual( jQuery("#groups").parentsUntil("#html").get(), parents.not(":last").get(), "Simple parentsUntil check" );
	equal( jQuery("#groups").parentsUntil("#ap").length, 0, "Simple parentsUntil check" );
	deepEqual( jQuery("#groups").parentsUntil("#html, #body").get(), parents.slice( 0, 3 ).get(), "Less simple parentsUntil check" );
	deepEqual( jQuery("#groups").parentsUntil("#html", "div").get(), jQuery("#qunit-fixture").get(), "Filtered parentsUntil check" );
	deepEqual( jQuery("#groups").parentsUntil("#html", "p,div,dl").get(), parents.slice( 0, 3 ).get(), "Multiple-filtered parentsUntil check" );
	equal( jQuery("#groups").parentsUntil("#html", "span").length, 0, "Filtered parentsUntil check, no match" );
	deepEqual( jQuery("#groups, #ap").parentsUntil("#html", "p,div,dl").get(), parents.slice( 0, 3 ).get(), "Multi-source, multiple-filtered parentsUntil check" );
});

test("next([String])", function() {
	expect(4);
	equal( jQuery("#ap").next()[0].id, "foo", "Simple next check" );
	equal( jQuery("#ap").next("div")[0].id, "foo", "Filtered next check" );
	equal( jQuery("#ap").next("p").length, 0, "Filtered next check, no match" );
	equal( jQuery("#ap").next("div, p")[0].id, "foo", "Multiple filters" );
});

test("prev([String])", function() {
	expect(4);
	equal( jQuery("#foo").prev()[0].id, "ap", "Simple prev check" );
	equal( jQuery("#foo").prev("p")[0].id, "ap", "Filtered prev check" );
	equal( jQuery("#foo").prev("div").length, 0, "Filtered prev check, no match" );
	equal( jQuery("#foo").prev("p, div")[0].id, "ap", "Multiple filters" );
});

test("nextAll([String])", function() {
	expect(4);

	var elems = jQuery("#form").children();

	deepEqual( jQuery("#label-for").nextAll().get(), elems.not(":first").get(), "Simple nextAll check" );
	deepEqual( jQuery("#label-for").nextAll("input").get(), elems.not(":first").filter("input").get(), "Filtered nextAll check" );
	deepEqual( jQuery("#label-for").nextAll("input,select").get(), elems.not(":first").filter("input,select").get(), "Multiple-filtered nextAll check" );
	deepEqual( jQuery("#label-for, #hidden1").nextAll("input,select").get(), elems.not(":first").filter("input,select").get(), "Multi-source, multiple-filtered nextAll check" );
});

test("prevAll([String])", function() {
	expect(4);

	var elems = jQuery( jQuery("#form").children().slice(0, 12).get().reverse() );

	deepEqual( jQuery("#area1").prevAll().get(), elems.get(), "Simple prevAll check" );
	deepEqual( jQuery("#area1").prevAll("input").get(), elems.filter("input").get(), "Filtered prevAll check" );
	deepEqual( jQuery("#area1").prevAll("input,select").get(), elems.filter("input,select").get(), "Multiple-filtered prevAll check" );
	deepEqual( jQuery("#area1, #hidden1").prevAll("input,select").get(), elems.filter("input,select").get(), "Multi-source, multiple-filtered prevAll check" );
});

test("nextUntil([String])", function() {
	expect(11);

	var elems = jQuery("#form").children().slice( 2, 12 );

	deepEqual( jQuery("#text1").nextUntil().get(), jQuery("#text1").nextAll().get(), "nextUntil with no selector (nextAll)" );
	deepEqual( jQuery("#text1").nextUntil(".foo").get(), jQuery("#text1").nextAll().get(), "nextUntil with invalid selector (nextAll)" );
	deepEqual( jQuery("#text1").nextUntil("#area1").get(), elems.get(), "Simple nextUntil check" );
	equal( jQuery("#text1").nextUntil("#text2").length, 0, "Simple nextUntil check" );
	deepEqual( jQuery("#text1").nextUntil("#area1, #radio1").get(), jQuery("#text1").next().get(), "Less simple nextUntil check" );
	deepEqual( jQuery("#text1").nextUntil("#area1", "input").get(), elems.not("button").get(), "Filtered nextUntil check" );
	deepEqual( jQuery("#text1").nextUntil("#area1", "button").get(), elems.not("input").get(), "Filtered nextUntil check" );
	deepEqual( jQuery("#text1").nextUntil("#area1", "button,input").get(), elems.get(), "Multiple-filtered nextUntil check" );
	equal( jQuery("#text1").nextUntil("#area1", "div").length, 0, "Filtered nextUntil check, no match" );
	deepEqual( jQuery("#text1, #hidden1").nextUntil("#area1", "button,input").get(), elems.get(), "Multi-source, multiple-filtered nextUntil check" );

	deepEqual( jQuery("#text1").nextUntil("[class=foo]").get(), jQuery("#text1").nextAll().get(), "Non-element nodes must be skipped, since they have no attributes" );
});

test("prevUntil([String])", function() {
	expect(10);

	var elems = jQuery("#area1").prevAll();

	deepEqual( jQuery("#area1").prevUntil().get(), elems.get(), "prevUntil with no selector (prevAll)" );
	deepEqual( jQuery("#area1").prevUntil(".foo").get(), elems.get(), "prevUntil with invalid selector (prevAll)" );
	deepEqual( jQuery("#area1").prevUntil("label").get(), elems.not(":last").get(), "Simple prevUntil check" );
	equal( jQuery("#area1").prevUntil("#button").length, 0, "Simple prevUntil check" );
	deepEqual( jQuery("#area1").prevUntil("label, #search").get(), jQuery("#area1").prev().get(), "Less simple prevUntil check" );
	deepEqual( jQuery("#area1").prevUntil("label", "input").get(), elems.not(":last").not("button").get(), "Filtered prevUntil check" );
	deepEqual( jQuery("#area1").prevUntil("label", "button").get(), elems.not(":last").not("input").get(), "Filtered prevUntil check" );
	deepEqual( jQuery("#area1").prevUntil("label", "button,input").get(), elems.not(":last").get(), "Multiple-filtered prevUntil check" );
	equal( jQuery("#area1").prevUntil("label", "div").length, 0, "Filtered prevUntil check, no match" );
	deepEqual( jQuery("#area1, #hidden1").prevUntil("label", "button,input").get(), elems.not(":last").get(), "Multi-source, multiple-filtered prevUntil check" );
});

test("contents()", function() {
	expect(12);
	equal( jQuery("#ap").contents().length, 9, "Check element contents" );
	ok( jQuery("#iframe").contents()[0], "Check existance of IFrame document" );
	var ibody = jQuery("#loadediframe").contents()[0].body;
	ok( ibody, "Check existance of IFrame body" );

	equal( jQuery("span", ibody).text(), "span text", "Find span in IFrame and check its text" );

	jQuery(ibody).append("<div>init text</div>");
	equal( jQuery("div", ibody).length, 2, "Check the original div and the new div are in IFrame" );

	equal( jQuery("div:last", ibody).text(), "init text", "Add text to div in IFrame" );

	jQuery("div:last", ibody).text("div text");
	equal( jQuery("div:last", ibody).text(), "div text", "Add text to div in IFrame" );

	jQuery("div:last", ibody).remove();
	equal( jQuery("div", ibody).length, 1, "Delete the div and check only one div left in IFrame" );

	equal( jQuery("div", ibody).text(), "span text", "Make sure the correct div is still left after deletion in IFrame" );

	jQuery("<table/>", ibody).append("<tr><td>cell</td></tr>").appendTo(ibody);
	jQuery("table", ibody).remove();
	equal( jQuery("div", ibody).length, 1, "Check for JS error on add and delete of a table in IFrame" );

	// using contents will get comments regular, text, and comment nodes
	var c = jQuery("#nonnodes").contents().contents();
	equal( c.length, 1, "Check node,textnode,comment contents is just one" );
	equal( c[0].nodeValue, "hi", "Check node,textnode,comment contents is just the one from span" );
});

test("add(String|Element|Array|undefined)", function() {
	expect(16);
	deepEqual( jQuery("#sndp").add("#en").add("#sap").get(), q("sndp", "en", "sap"), "Check elements from document" );
	deepEqual( jQuery("#sndp").add( jQuery("#en")[0] ).add( jQuery("#sap") ).get(), q("sndp", "en", "sap"), "Check elements from document" );

	// We no longer support .add(form.elements), unfortunately.
	// There is no way, in browsers, to reliably determine the difference
	// between form.elements and form - and doing .add(form) and having it
	// add the form elements is way to unexpected, so this gets the boot.
	// ok( jQuery([]).add(jQuery("#form")[0].elements).length >= 13, "Check elements from array" );

	// For the time being, we're discontinuing support for jQuery(form.elements) since it's ambiguous in IE
	// use jQuery([]).add(form.elements) instead.
	//equal( jQuery([]).add(jQuery("#form")[0].elements).length, jQuery(jQuery("#form")[0].elements).length, "Array in constructor must equals array in add()" );

	var divs = jQuery("<div/>").add("#sndp");
	ok( !divs[0].parentNode, "Make sure the first element is still the disconnected node." );

	divs = jQuery("<div>test</div>").add("#sndp");
	equal( divs[0].parentNode.nodeType, 11, "Make sure the first element is still the disconnected node." );

	divs = jQuery("#sndp").add("<div/>");
	ok( !divs[1].parentNode, "Make sure the first element is still the disconnected node." );

	var tmp = jQuery("<div/>");

	var x = jQuery([]).add(jQuery("<p id='x1'>xxx</p>").appendTo(tmp)).add(jQuery("<p id='x2'>xxx</p>").appendTo(tmp));
	equal( x[0].id, "x1", "Check on-the-fly element1" );
	equal( x[1].id, "x2", "Check on-the-fly element2" );

	var x = jQuery([]).add(jQuery("<p id='x1'>xxx</p>").appendTo(tmp)[0]).add(jQuery("<p id='x2'>xxx</p>").appendTo(tmp)[0]);
	equal( x[0].id, "x1", "Check on-the-fly element1" );
	equal( x[1].id, "x2", "Check on-the-fly element2" );

	var x = jQuery([]).add(jQuery("<p id='x1'>xxx</p>")).add(jQuery("<p id='x2'>xxx</p>"));
	equal( x[0].id, "x1", "Check on-the-fly element1" );
	equal( x[1].id, "x2", "Check on-the-fly element2" );

	var x = jQuery([]).add("<p id='x1'>xxx</p>").add("<p id='x2'>xxx</p>");
	equal( x[0].id, "x1", "Check on-the-fly element1" );
	equal( x[1].id, "x2", "Check on-the-fly element2" );

	var notDefined;
	equal( jQuery([]).add(notDefined).length, 0, "Check that undefined adds nothing" );

	equal( jQuery([]).add( document.getElementById("form") ).length, 1, "Add a form" );
	equal( jQuery([]).add( document.getElementById("select1") ).length, 1, "Add a select" );
});

test("add(String, Context)", function() {
	expect(6);

	deepEqual( jQuery( "#firstp" ).add( "#ap" ).get(), q( "firstp", "ap" ), "Add selector to selector " );
	deepEqual( jQuery( document.getElementById("firstp") ).add( "#ap" ).get(), q( "firstp", "ap" ), "Add gEBId to selector" );
	deepEqual( jQuery( document.getElementById("firstp") ).add( document.getElementById("ap") ).get(), q( "firstp", "ap" ), "Add gEBId to gEBId" );

	var ctx = document.getElementById("firstp");
	deepEqual( jQuery( "#firstp" ).add( "#ap", ctx ).get(), q( "firstp" ), "Add selector to selector " );
	deepEqual( jQuery( document.getElementById("firstp") ).add( "#ap", ctx ).get(), q( "firstp" ), "Add gEBId to selector, not in context" );
	deepEqual( jQuery( document.getElementById("firstp") ).add( "#ap", document.getElementsByTagName("body")[0] ).get(), q( "firstp", "ap" ), "Add gEBId to selector, in context" );
});

test("eq('-1') #10616", function() {
	expect(3);
	var $divs = jQuery( "div" );

	equal( $divs.eq( -1 ).length, 1, "The number -1 returns a selection that has length 1" );
	equal( $divs.eq( "-1" ).length, 1, "The string '-1' returns a selection that has length 1" );
	deepEqual( $divs.eq( "-1" ), $divs.eq( -1 ), "String and number -1 match" );
});

/**
 * QUnit v1.2.0 - A JavaScript Unit Testing Framework
 *
 * http://docs.jquery.com/QUnit
 *
 * Copyright (c) 2011 John Resig, Jörn Zaefferer
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * or GPL (GPL-LICENSE.txt) licenses.
 */


(function(window) {

var defined = {
	setTimeout: typeof window.setTimeout !== "undefined",
	sessionStorage: (function() {
		try {
			return !!sessionStorage.getItem;
		} catch(e) {
			return false;
		}
	})()
};

var	testId = 0,
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty;

var Test = function(name, testName, expected, testEnvironmentArg, async, callback) {
	this.name = name;
	this.testName = testName;
	this.expected = expected;
	this.testEnvironmentArg = testEnvironmentArg;
	this.async = async;
	this.callback = callback;
	this.assertions = [];
};
Test.prototype = {
	init: function() {
		var tests = id("qunit-tests");
		if (tests) {
			var b = document.createElement("strong");
				b.innerHTML = "Running " + this.name;
			var li = document.createElement("li");
				li.appendChild( b );
				li.className = "running";
				li.id = this.id = "test-output" + testId++;
			tests.appendChild( li );
		}
	},
	setup: function() {
		if (this.module != config.previousModule) {
			if ( config.previousModule ) {
				runLoggingCallbacks('moduleDone', QUnit, {
					name: config.previousModule,
					failed: config.moduleStats.bad,
					passed: config.moduleStats.all - config.moduleStats.bad,
					total: config.moduleStats.all
				} );
			}
			config.previousModule = this.module;
			config.moduleStats = { all: 0, bad: 0 };
			runLoggingCallbacks( 'moduleStart', QUnit, {
				name: this.module
			} );
		}

		config.current = this;
		this.testEnvironment = extend({
			setup: function() {},
			teardown: function() {}
		}, this.moduleTestEnvironment);
		if (this.testEnvironmentArg) {
			extend(this.testEnvironment, this.testEnvironmentArg);
		}

		runLoggingCallbacks( 'testStart', QUnit, {
			name: this.testName,
			module: this.module
		});

		// allow utility functions to access the current test environment
		// TODO why??
		QUnit.current_testEnvironment = this.testEnvironment;

		try {
			if ( !config.pollution ) {
				saveGlobal();
			}

			this.testEnvironment.setup.call(this.testEnvironment);
		} catch(e) {
			QUnit.ok( false, "Setup failed on " + this.testName + ": " + e.message );
		}
	},
	run: function() {
		config.current = this;
		if ( this.async ) {
			QUnit.stop();
		}

		if ( config.notrycatch ) {
			this.callback.call(this.testEnvironment);
			return;
		}
		try {
			this.callback.call(this.testEnvironment);
		} catch(e) {
			fail("Test " + this.testName + " died, exception and test follows", e, this.callback);
			QUnit.ok( false, "Died on test #" + (this.assertions.length + 1) + ": " + e.message + " - " + QUnit.jsDump.parse(e) );
			// else next test will carry the responsibility
			saveGlobal();

			// Restart the tests if they're blocking
			if ( config.blocking ) {
				QUnit.start();
			}
		}
	},
	teardown: function() {
		config.current = this;
		try {
			this.testEnvironment.teardown.call(this.testEnvironment);
			checkPollution();
		} catch(e) {
			QUnit.ok( false, "Teardown failed on " + this.testName + ": " + e.message );
		}
	},
	finish: function() {
		config.current = this;
		if ( this.expected != null && this.expected != this.assertions.length ) {
			QUnit.ok( false, "Expected " + this.expected + " assertions, but " + this.assertions.length + " were run" );
		}

		var good = 0, bad = 0,
			tests = id("qunit-tests");

		config.stats.all += this.assertions.length;
		config.moduleStats.all += this.assertions.length;

		if ( tests ) {
			var ol = document.createElement("ol");

			for ( var i = 0; i < this.assertions.length; i++ ) {
				var assertion = this.assertions[i];

				var li = document.createElement("li");
				li.className = assertion.result ? "pass" : "fail";
				li.innerHTML = assertion.message || (assertion.result ? "okay" : "failed");
				ol.appendChild( li );

				if ( assertion.result ) {
					good++;
				} else {
					bad++;
					config.stats.bad++;
					config.moduleStats.bad++;
				}
			}

			// store result when possible
			if ( QUnit.config.reorder && defined.sessionStorage ) {
				if (bad) {
					sessionStorage.setItem("qunit-" + this.module + "-" + this.testName, bad);
				} else {
					sessionStorage.removeItem("qunit-" + this.module + "-" + this.testName);
				}
			}

			if (bad == 0) {
				ol.style.display = "none";
			}

			var b = document.createElement("strong");
			b.innerHTML = this.name + " <b class='counts'>(<b class='failed'>" + bad + "</b>, <b class='passed'>" + good + "</b>, " + this.assertions.length + ")</b>";

			var a = document.createElement("a");
			a.innerHTML = "Rerun";
			a.href = QUnit.url({ filter: getText([b]).replace(/\([^)]+\)$/, "").replace(/(^\s*|\s*$)/g, "") });

			addEvent(b, "click", function() {
				var next = b.nextSibling.nextSibling,
					display = next.style.display;
				next.style.display = display === "none" ? "block" : "none";
			});

			addEvent(b, "dblclick", function(e) {
				var target = e && e.target ? e.target : window.event.srcElement;
				if ( target.nodeName.toLowerCase() == "span" || target.nodeName.toLowerCase() == "b" ) {
					target = target.parentNode;
				}
				if ( window.location && target.nodeName.toLowerCase() === "strong" ) {
					window.location = QUnit.url({ filter: getText([target]).replace(/\([^)]+\)$/, "").replace(/(^\s*|\s*$)/g, "") });
				}
			});

			var li = id(this.id);
			li.className = bad ? "fail" : "pass";
			li.removeChild( li.firstChild );
			li.appendChild( b );
			li.appendChild( a );
			li.appendChild( ol );

		} else {
			for ( var i = 0; i < this.assertions.length; i++ ) {
				if ( !this.assertions[i].result ) {
					bad++;
					config.stats.bad++;
					config.moduleStats.bad++;
				}
			}
		}

		try {
			QUnit.reset();
		} catch(e) {
			fail("reset() failed, following Test " + this.testName + ", exception and reset fn follows", e, QUnit.reset);
		}

		runLoggingCallbacks( 'testDone', QUnit, {
			name: this.testName,
			module: this.module,
			failed: bad,
			passed: this.assertions.length - bad,
			total: this.assertions.length
		} );
	},

	queue: function() {
		var test = this;
		synchronize(function() {
			test.init();
		});
		function run() {
			// each of these can by async
			synchronize(function() {
				test.setup();
			});
			synchronize(function() {
				test.run();
			});
			synchronize(function() {
				test.teardown();
			});
			synchronize(function() {
				test.finish();
			});
		}
		// defer when previous test run passed, if storage is available
		var bad = QUnit.config.reorder && defined.sessionStorage && +sessionStorage.getItem("qunit-" + this.module + "-" + this.testName);
		if (bad) {
			run();
		} else {
			synchronize(run, true);
		};
	}

};

var QUnit = {

	// call on start of module test to prepend name to all tests
	module: function(name, testEnvironment) {
		config.currentModule = name;
		config.currentModuleTestEnviroment = testEnvironment;
	},

	asyncTest: function(testName, expected, callback) {
		if ( arguments.length === 2 ) {
			callback = expected;
			expected = null;
		}

		QUnit.test(testName, expected, callback, true);
	},

	test: function(testName, expected, callback, async) {
		var name = '<span class="test-name">' + testName + '</span>', testEnvironmentArg;

		if ( arguments.length === 2 ) {
			callback = expected;
			expected = null;
		}
		// is 2nd argument a testEnvironment?
		if ( expected && typeof expected === 'object') {
			testEnvironmentArg = expected;
			expected = null;
		}

		if ( config.currentModule ) {
			name = '<span class="module-name">' + config.currentModule + "</span>: " + name;
		}

		if ( !validTest(config.currentModule + ": " + testName) ) {
			return;
		}

		var test = new Test(name, testName, expected, testEnvironmentArg, async, callback);
		test.module = config.currentModule;
		test.moduleTestEnvironment = config.currentModuleTestEnviroment;
		test.queue();
	},

	/**
	 * Specify the number of expected assertions to gurantee that failed test (no assertions are run at all) don't slip through.
	 */
	expect: function(asserts) {
		config.current.expected = asserts;
	},

	/**
	 * Asserts true.
	 * @example ok( "asdfasdf".length > 5, "There must be at least 5 chars" );
	 */
	ok: function(a, msg) {
		a = !!a;
		var details = {
			result: a,
			message: msg
		};
		msg = escapeInnerText(msg);
		runLoggingCallbacks( 'log', QUnit, details );
		config.current.assertions.push({
			result: a,
			message: msg
		});
	},

	/**
	 * Checks that the first two arguments are equal, with an optional message.
	 * Prints out both actual and expected values.
	 *
	 * Prefered to ok( actual == expected, message )
	 *
	 * @example equal( format("Received {0} bytes.", 2), "Received 2 bytes." );
	 *
	 * @param Object actual
	 * @param Object expected
	 * @param String message (optional)
	 */
	equal: function(actual, expected, message) {
		QUnit.push(expected == actual, actual, expected, message);
	},

	notEqual: function(actual, expected, message) {
		QUnit.push(expected != actual, actual, expected, message);
	},

	deepEqual: function(actual, expected, message) {
		QUnit.push(QUnit.equiv(actual, expected), actual, expected, message);
	},

	notDeepEqual: function(actual, expected, message) {
		QUnit.push(!QUnit.equiv(actual, expected), actual, expected, message);
	},

	strictEqual: function(actual, expected, message) {
		QUnit.push(expected === actual, actual, expected, message);
	},

	notStrictEqual: function(actual, expected, message) {
		QUnit.push(expected !== actual, actual, expected, message);
	},

	raises: function(block, expected, message) {
		var actual, ok = false;

		if (typeof expected === 'string') {
			message = expected;
			expected = null;
		}

		try {
			block();
		} catch (e) {
			actual = e;
		}

		if (actual) {
			// we don't want to validate thrown error
			if (!expected) {
				ok = true;
			// expected is a regexp
			} else if (QUnit.objectType(expected) === "regexp") {
				ok = expected.test(actual);
			// expected is a constructor
			} else if (actual instanceof expected) {
				ok = true;
			// expected is a validation function which returns true is validation passed
			} else if (expected.call({}, actual) === true) {
				ok = true;
			}
		}

		QUnit.ok(ok, message);
	},

	start: function(count) {
		config.semaphore -= count || 1;
		if (config.semaphore > 0) {
			// don't start until equal number of stop-calls
			return;
		}
		if (config.semaphore < 0) {
			// ignore if start is called more often then stop
			config.semaphore = 0;
		}
		// A slight delay, to avoid any current callbacks
		if ( defined.setTimeout ) {
			window.setTimeout(function() {
				if (config.semaphore > 0) {
					return;
				}
				if ( config.timeout ) {
					clearTimeout(config.timeout);
				}

				config.blocking = false;
				process(true);
			}, 13);
		} else {
			config.blocking = false;
			process(true);
		}
	},

	stop: function(count) {
		config.semaphore += count || 1;
		config.blocking = true;

		if ( config.testTimeout && defined.setTimeout ) {
			clearTimeout(config.timeout);
			config.timeout = window.setTimeout(function() {
				QUnit.ok( false, "Test timed out" );
				config.semaphore = 1;
				QUnit.start();
			}, config.testTimeout);
		}
	}
};

//We want access to the constructor's prototype
(function() {
	function F(){};
	F.prototype = QUnit;
	QUnit = new F();
	//Make F QUnit's constructor so that we can add to the prototype later
	QUnit.constructor = F;
})();

// Backwards compatibility, deprecated
QUnit.equals = QUnit.equal;
QUnit.same = QUnit.deepEqual;

// Maintain internal state
var config = {
	// The queue of tests to run
	queue: [],

	// block until document ready
	blocking: true,

	// when enabled, show only failing tests
	// gets persisted through sessionStorage and can be changed in UI via checkbox
	hidepassed: false,

	// by default, run previously failed tests first
	// very useful in combination with "Hide passed tests" checked
	reorder: true,

	// by default, modify document.title when suite is done
	altertitle: true,

	urlConfig: ['noglobals', 'notrycatch'],

	//logging callback queues
	begin: [],
	done: [],
	log: [],
	testStart: [],
	testDone: [],
	moduleStart: [],
	moduleDone: []
};

// Load paramaters
(function() {
	var location = window.location || { search: "", protocol: "file:" },
		params = location.search.slice( 1 ).split( "&" ),
		length = params.length,
		urlParams = {},
		current;

	if ( params[ 0 ] ) {
		for ( var i = 0; i < length; i++ ) {
			current = params[ i ].split( "=" );
			current[ 0 ] = decodeURIComponent( current[ 0 ] );
			// allow just a key to turn on a flag, e.g., test.html?noglobals
			current[ 1 ] = current[ 1 ] ? decodeURIComponent( current[ 1 ] ) : true;
			urlParams[ current[ 0 ] ] = current[ 1 ];
		}
	}

	QUnit.urlParams = urlParams;
	config.filter = urlParams.filter;

	// Figure out if we're running the tests from a server or not
	QUnit.isLocal = !!(location.protocol === 'file:');
})();

// Expose the API as global variables, unless an 'exports'
// object exists, in that case we assume we're in CommonJS
if ( typeof exports === "undefined" || typeof require === "undefined" ) {
	extend(window, QUnit);
	window.QUnit = QUnit;
} else {
	extend(exports, QUnit);
	exports.QUnit = QUnit;
}

// define these after exposing globals to keep them in these QUnit namespace only
extend(QUnit, {
	config: config,

	// Initialize the configuration options
	init: function() {
		extend(config, {
			stats: { all: 0, bad: 0 },
			moduleStats: { all: 0, bad: 0 },
			started: +new Date,
			updateRate: 1000,
			blocking: false,
			autostart: true,
			autorun: false,
			filter: "",
			queue: [],
			semaphore: 0
		});

		var tests = id( "qunit-tests" ),
			banner = id( "qunit-banner" ),
			result = id( "qunit-testresult" );

		if ( tests ) {
			tests.innerHTML = "";
		}

		if ( banner ) {
			banner.className = "";
		}

		if ( result ) {
			result.parentNode.removeChild( result );
		}

		if ( tests ) {
			result = document.createElement( "p" );
			result.id = "qunit-testresult";
			result.className = "result";
			tests.parentNode.insertBefore( result, tests );
			result.innerHTML = 'Running...<br/>&nbsp;';
		}
	},

	/**
	 * Resets the test setup. Useful for tests that modify the DOM.
	 *
	 * If jQuery is available, uses jQuery's html(), otherwise just innerHTML.
	 */
	reset: function() {
		if ( window.jQuery ) {
			jQuery( "#qunit-fixture" ).html( config.fixture );
		} else {
			var main = id( 'qunit-fixture' );
			if ( main ) {
				main.innerHTML = config.fixture;
			}
		}
	},

	/**
	 * Trigger an event on an element.
	 *
	 * @example triggerEvent( document.body, "click" );
	 *
	 * @param DOMElement elem
	 * @param String type
	 */
	triggerEvent: function( elem, type, event ) {
		if ( document.createEvent ) {
			event = document.createEvent("MouseEvents");
			event.initMouseEvent(type, true, true, elem.ownerDocument.defaultView,
				0, 0, 0, 0, 0, false, false, false, false, 0, null);
			elem.dispatchEvent( event );

		} else if ( elem.fireEvent ) {
			elem.fireEvent("on"+type);
		}
	},

	// Safe object type checking
	is: function( type, obj ) {
		return QUnit.objectType( obj ) == type;
	},

	objectType: function( obj ) {
		if (typeof obj === "undefined") {
				return "undefined";

		// consider: typeof null === object
		}
		if (obj === null) {
				return "null";
		}

		var type = toString.call( obj ).match(/^\[object\s(.*)\]$/)[1] || '';

		switch (type) {
				case 'Number':
						if (isNaN(obj)) {
								return "nan";
						} else {
								return "number";
						}
				case 'String':
				case 'Boolean':
				case 'Array':
				case 'Date':
				case 'RegExp':
				case 'Function':
						return type.toLowerCase();
		}
		if (typeof obj === "object") {
				return "object";
		}
		return undefined;
	},

	push: function(result, actual, expected, message) {
		var details = {
			result: result,
			message: message,
			actual: actual,
			expected: expected
		};

		message = escapeInnerText(message) || (result ? "okay" : "failed");
		message = '<span class="test-message">' + message + "</span>";
		expected = escapeInnerText(QUnit.jsDump.parse(expected));
		actual = escapeInnerText(QUnit.jsDump.parse(actual));
		var output = message + '<table><tr class="test-expected"><th>Expected: </th><td><pre>' + expected + '</pre></td></tr>';
		if (actual != expected) {
			output += '<tr class="test-actual"><th>Result: </th><td><pre>' + actual + '</pre></td></tr>';
			output += '<tr class="test-diff"><th>Diff: </th><td><pre>' + QUnit.diff(expected, actual) +'</pre></td></tr>';
		}
		if (!result) {
			var source = sourceFromStacktrace();
			if (source) {
				details.source = source;
				output += '<tr class="test-source"><th>Source: </th><td><pre>' + escapeInnerText(source) + '</pre></td></tr>';
			}
		}
		output += "</table>";

		runLoggingCallbacks( 'log', QUnit, details );

		config.current.assertions.push({
			result: !!result,
			message: output
		});
	},

	url: function( params ) {
		params = extend( extend( {}, QUnit.urlParams ), params );
		var querystring = "?",
			key;
		for ( key in params ) {
			if ( !hasOwn.call( params, key ) ) {
				continue;
			}
			querystring += encodeURIComponent( key ) + "=" +
				encodeURIComponent( params[ key ] ) + "&";
		}
		return window.location.pathname + querystring.slice( 0, -1 );
	},

	extend: extend,
	id: id,
	addEvent: addEvent
});

//QUnit.constructor is set to the empty F() above so that we can add to it's prototype later
//Doing this allows us to tell if the following methods have been overwritten on the actual
//QUnit object, which is a deprecated way of using the callbacks.
extend(QUnit.constructor.prototype, {
	// Logging callbacks; all receive a single argument with the listed properties
	// run test/logs.html for any related changes
	begin: registerLoggingCallback('begin'),
	// done: { failed, passed, total, runtime }
	done: registerLoggingCallback('done'),
	// log: { result, actual, expected, message }
	log: registerLoggingCallback('log'),
	// testStart: { name }
	testStart: registerLoggingCallback('testStart'),
	// testDone: { name, failed, passed, total }
	testDone: registerLoggingCallback('testDone'),
	// moduleStart: { name }
	moduleStart: registerLoggingCallback('moduleStart'),
	// moduleDone: { name, failed, passed, total }
	moduleDone: registerLoggingCallback('moduleDone')
});

if ( typeof document === "undefined" || document.readyState === "complete" ) {
	config.autorun = true;
}

QUnit.load = function() {
	runLoggingCallbacks( 'begin', QUnit, {} );

	// Initialize the config, saving the execution queue
	var oldconfig = extend({}, config);
	QUnit.init();
	extend(config, oldconfig);

	config.blocking = false;

	var urlConfigHtml = '', len = config.urlConfig.length;
	for ( var i = 0, val; i < len, val = config.urlConfig[i]; i++ ) {
		config[val] = QUnit.urlParams[val];
		urlConfigHtml += '<label><input name="' + val + '" type="checkbox"' + ( config[val] ? ' checked="checked"' : '' ) + '>' + val + '</label>';
	}

	var userAgent = id("qunit-userAgent");
	if ( userAgent ) {
		userAgent.innerHTML = navigator.userAgent;
	}
	var banner = id("qunit-header");
	if ( banner ) {
		banner.innerHTML = '<a href="' + QUnit.url({ filter: undefined }) + '"> ' + banner.innerHTML + '</a> ' + urlConfigHtml;
		addEvent( banner, "change", function( event ) {
			var params = {};
			params[ event.target.name ] = event.target.checked ? true : undefined;
			window.location = QUnit.url( params );
		});
	}

	var toolbar = id("qunit-testrunner-toolbar");
	if ( toolbar ) {
		var filter = document.createElement("input");
		filter.type = "checkbox";
		filter.id = "qunit-filter-pass";
		addEvent( filter, "click", function() {
			var ol = document.getElementById("qunit-tests");
			if ( filter.checked ) {
				ol.className = ol.className + " hidepass";
			} else {
				var tmp = " " + ol.className.replace( /[\n\t\r]/g, " " ) + " ";
				ol.className = tmp.replace(/ hidepass /, " ");
			}
			if ( defined.sessionStorage ) {
				if (filter.checked) {
					sessionStorage.setItem("qunit-filter-passed-tests", "true");
				} else {
					sessionStorage.removeItem("qunit-filter-passed-tests");
				}
			}
		});
		if ( config.hidepassed || defined.sessionStorage && sessionStorage.getItem("qunit-filter-passed-tests") ) {
			filter.checked = true;
			var ol = document.getElementById("qunit-tests");
			ol.className = ol.className + " hidepass";
		}
		toolbar.appendChild( filter );

		var label = document.createElement("label");
		label.setAttribute("for", "qunit-filter-pass");
		label.innerHTML = "Hide passed tests";
		toolbar.appendChild( label );
	}

	var main = id('qunit-fixture');
	if ( main ) {
		config.fixture = main.innerHTML;
	}

	if (config.autostart) {
		QUnit.start();
	}
};

addEvent(window, "load", QUnit.load);

// addEvent(window, "error") gives us a useless event object
window.onerror = function( message, file, line ) {
	if ( QUnit.config.current ) {
		ok( false, message + ", " + file + ":" + line );
	} else {
		test( "global failure", function() {
			ok( false, message + ", " + file + ":" + line );
		});
	}
};

function done() {
	config.autorun = true;

	// Log the last module results
	if ( config.currentModule ) {
		runLoggingCallbacks( 'moduleDone', QUnit, {
			name: config.currentModule,
			failed: config.moduleStats.bad,
			passed: config.moduleStats.all - config.moduleStats.bad,
			total: config.moduleStats.all
		} );
	}

	var banner = id("qunit-banner"),
		tests = id("qunit-tests"),
		runtime = +new Date - config.started,
		passed = config.stats.all - config.stats.bad,
		html = [
			'Tests completed in ',
			runtime,
			' milliseconds.<br/>',
			'<span class="passed">',
			passed,
			'</span> tests of <span class="total">',
			config.stats.all,
			'</span> passed, <span class="failed">',
			config.stats.bad,
			'</span> failed.'
		].join('');

	if ( banner ) {
		banner.className = (config.stats.bad ? "qunit-fail" : "qunit-pass");
	}

	if ( tests ) {
		id( "qunit-testresult" ).innerHTML = html;
	}

	if ( config.altertitle && typeof document !== "undefined" && document.title ) {
		// show ✖ for good, ✔ for bad suite result in title
		// use escape sequences in case file gets loaded with non-utf-8-charset
		document.title = [
			(config.stats.bad ? "\u2716" : "\u2714"),
			document.title.replace(/^[\u2714\u2716] /i, "")
		].join(" ");
	}

	runLoggingCallbacks( 'done', QUnit, {
		failed: config.stats.bad,
		passed: passed,
		total: config.stats.all,
		runtime: runtime
	} );
}

function validTest( name ) {
	var filter = config.filter,
		run = false;

	if ( !filter ) {
		return true;
	}

	var not = filter.charAt( 0 ) === "!";
	if ( not ) {
		filter = filter.slice( 1 );
	}

	if ( name.indexOf( filter ) !== -1 ) {
		return !not;
	}

	if ( not ) {
		run = true;
	}

	return run;
}

// so far supports only Firefox, Chrome and Opera (buggy)
// could be extended in the future to use something like https://github.com/csnover/TraceKit
function sourceFromStacktrace() {
	try {
		throw new Error();
	} catch ( e ) {
		if (e.stacktrace) {
			// Opera
			return e.stacktrace.split("\n")[6];
		} else if (e.stack) {
			// Firefox, Chrome
			return e.stack.split("\n")[4];
		} else if (e.sourceURL) {
			// Safari, PhantomJS
			// TODO sourceURL points at the 'throw new Error' line above, useless
			//return e.sourceURL + ":" + e.line;
		}
	}
}

function escapeInnerText(s) {
	if (!s) {
		return "";
	}
	s = s + "";
	return s.replace(/[\&<>]/g, function(s) {
		switch(s) {
			case "&": return "&amp;";
			case "<": return "&lt;";
			case ">": return "&gt;";
			default: return s;
		}
	});
}

function synchronize( callback, last ) {
	config.queue.push( callback );

	if ( config.autorun && !config.blocking ) {
		process(last);
	}
}

function process( last ) {
	var start = new Date().getTime();
	config.depth = config.depth ? config.depth + 1 : 1;

	while ( config.queue.length && !config.blocking ) {
		if ( !defined.setTimeout || config.updateRate <= 0 || ( ( new Date().getTime() - start ) < config.updateRate ) ) {
			config.queue.shift()();
		} else {
			window.setTimeout( function(){
				process( last );
			}, 13 );
			break;
		}
	}
	config.depth--;
	if ( last && !config.blocking && !config.queue.length && config.depth === 0 ) {
		done();
	}
}

function saveGlobal() {
	config.pollution = [];

	if ( config.noglobals ) {
		for ( var key in window ) {
			if ( !hasOwn.call( window, key ) ) {
				continue;
			}
			config.pollution.push( key );
		}
	}
}

function checkPollution( name ) {
	var old = config.pollution;
	saveGlobal();

	var newGlobals = diff( config.pollution, old );
	if ( newGlobals.length > 0 ) {
		ok( false, "Introduced global variable(s): " + newGlobals.join(", ") );
	}

	var deletedGlobals = diff( old, config.pollution );
	if ( deletedGlobals.length > 0 ) {
		ok( false, "Deleted global variable(s): " + deletedGlobals.join(", ") );
	}
}

// returns a new Array with the elements that are in a but not in b
function diff( a, b ) {
	var result = a.slice();
	for ( var i = 0; i < result.length; i++ ) {
		for ( var j = 0; j < b.length; j++ ) {
			if ( result[i] === b[j] ) {
				result.splice(i, 1);
				i--;
				break;
			}
		}
	}
	return result;
}

function fail(message, exception, callback) {
	if ( typeof console !== "undefined" && console.error && console.warn ) {
		console.error(message);
		console.error(exception);
		console.warn(callback.toString());

	} else if ( window.opera && opera.postError ) {
		opera.postError(message, exception, callback.toString);
	}
}

function extend(a, b) {
	for ( var prop in b ) {
		if ( b[prop] === undefined ) {
			delete a[prop];

		// Avoid "Member not found" error in IE8 caused by setting window.constructor
		} else if ( prop !== "constructor" || a !== window ) {
			a[prop] = b[prop];
		}
	}

	return a;
}

function addEvent(elem, type, fn) {
	if ( elem.addEventListener ) {
		elem.addEventListener( type, fn, false );
	} else if ( elem.attachEvent ) {
		elem.attachEvent( "on" + type, fn );
	} else {
		fn();
	}
}

function id(name) {
	return !!(typeof document !== "undefined" && document && document.getElementById) &&
		document.getElementById( name );
}

function registerLoggingCallback(key){
	return function(callback){
		config[key].push( callback );
	};
}

// Supports deprecated method of completely overwriting logging callbacks
function runLoggingCallbacks(key, scope, args) {
	//debugger;
	var callbacks;
	if ( QUnit.hasOwnProperty(key) ) {
		QUnit[key].call(scope, args);
	} else {
		callbacks = config[key];
		for( var i = 0; i < callbacks.length; i++ ) {
			callbacks[i].call( scope, args );
		}
	}
}

// Test for equality any JavaScript type.
// Author: Philippe Rathé <prathe@gmail.com>
QUnit.equiv = function () {

	var innerEquiv; // the real equiv function
	var callers = []; // stack to decide between skip/abort functions
	var parents = []; // stack to avoiding loops from circular referencing

	// Call the o related callback with the given arguments.
	function bindCallbacks(o, callbacks, args) {
		var prop = QUnit.objectType(o);
		if (prop) {
			if (QUnit.objectType(callbacks[prop]) === "function") {
				return callbacks[prop].apply(callbacks, args);
			} else {
				return callbacks[prop]; // or undefined
			}
		}
	}

	var getProto = Object.getPrototypeOf || function (obj) {
		return obj.__proto__;
	};

	var callbacks = function () {

		// for string, boolean, number and null
		function useStrictEquality(b, a) {
			if (b instanceof a.constructor || a instanceof b.constructor) {
				// to catch short annotaion VS 'new' annotation of a
				// declaration
				// e.g. var i = 1;
				// var j = new Number(1);
				return a == b;
			} else {
				return a === b;
			}
		}

		return {
			"string" : useStrictEquality,
			"boolean" : useStrictEquality,
			"number" : useStrictEquality,
			"null" : useStrictEquality,
			"undefined" : useStrictEquality,

			"nan" : function(b) {
				return isNaN(b);
			},

			"date" : function(b, a) {
				return QUnit.objectType(b) === "date"
						&& a.valueOf() === b.valueOf();
			},

			"regexp" : function(b, a) {
				return QUnit.objectType(b) === "regexp"
						&& a.source === b.source && // the regex itself
						a.global === b.global && // and its modifers
													// (gmi) ...
						a.ignoreCase === b.ignoreCase
						&& a.multiline === b.multiline;
			},

			// - skip when the property is a method of an instance (OOP)
			// - abort otherwise,
			// initial === would have catch identical references anyway
			"function" : function() {
				var caller = callers[callers.length - 1];
				return caller !== Object && typeof caller !== "undefined";
			},

			"array" : function(b, a) {
				var i, j, loop;
				var len;

				// b could be an object literal here
				if (!(QUnit.objectType(b) === "array")) {
					return false;
				}

				len = a.length;
				if (len !== b.length) { // safe and faster
					return false;
				}

				// track reference to avoid circular references
				parents.push(a);
				for (i = 0; i < len; i++) {
					loop = false;
					for (j = 0; j < parents.length; j++) {
						if (parents[j] === a[i]) {
							loop = true;// dont rewalk array
						}
					}
					if (!loop && !innerEquiv(a[i], b[i])) {
						parents.pop();
						return false;
					}
				}
				parents.pop();
				return true;
			},

			"object" : function(b, a) {
				var i, j, loop;
				var eq = true; // unless we can proove it
				var aProperties = [], bProperties = []; // collection of
														// strings

				// comparing constructors is more strict than using
				// instanceof
				if (a.constructor !== b.constructor) {
					// Allow objects with no prototype to be equivalent to
					// objects with Object as their constructor.
					if (!((getProto(a) === null && getProto(b) === Object.prototype) ||
						  (getProto(b) === null && getProto(a) === Object.prototype)))
					{
						return false;
					}
				}

				// stack constructor before traversing properties
				callers.push(a.constructor);
				// track reference to avoid circular references
				parents.push(a);

				for (i in a) { // be strict: don't ensures hasOwnProperty
								// and go deep
					loop = false;
					for (j = 0; j < parents.length; j++) {
						if (parents[j] === a[i])
							loop = true; // don't go down the same path
											// twice
					}
					aProperties.push(i); // collect a's properties

					if (!loop && !innerEquiv(a[i], b[i])) {
						eq = false;
						break;
					}
				}

				callers.pop(); // unstack, we are done
				parents.pop();

				for (i in b) {
					bProperties.push(i); // collect b's properties
				}

				// Ensures identical properties name
				return eq
						&& innerEquiv(aProperties.sort(), bProperties
								.sort());
			}
		};
	}();

	innerEquiv = function() { // can take multiple arguments
		var args = Array.prototype.slice.apply(arguments);
		if (args.length < 2) {
			return true; // end transition
		}

		return (function(a, b) {
			if (a === b) {
				return true; // catch the most you can
			} else if (a === null || b === null || typeof a === "undefined"
					|| typeof b === "undefined"
					|| QUnit.objectType(a) !== QUnit.objectType(b)) {
				return false; // don't lose time with error prone cases
			} else {
				return bindCallbacks(a, callbacks, [ b, a ]);
			}

			// apply transition with (1..n) arguments
		})(args[0], args[1])
				&& arguments.callee.apply(this, args.splice(1,
						args.length - 1));
	};

	return innerEquiv;

}();

/**
 * jsDump Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com |
 * http://flesler.blogspot.com Licensed under BSD
 * (http://www.opensource.org/licenses/bsd-license.php) Date: 5/15/2008
 *
 * @projectDescription Advanced and extensible data dumping for Javascript.
 * @version 1.0.0
 * @author Ariel Flesler
 * @link {http://flesler.blogspot.com/2008/05/jsdump-pretty-dump-of-any-javascript.html}
 */
QUnit.jsDump = (function() {
	function quote( str ) {
		return '"' + str.toString().replace(/"/g, '\\"') + '"';
	};
	function literal( o ) {
		return o + '';
	};
	function join( pre, arr, post ) {
		var s = jsDump.separator(),
			base = jsDump.indent(),
			inner = jsDump.indent(1);
		if ( arr.join )
			arr = arr.join( ',' + s + inner );
		if ( !arr )
			return pre + post;
		return [ pre, inner + arr, base + post ].join(s);
	};
	function array( arr, stack ) {
		var i = arr.length, ret = Array(i);
		this.up();
		while ( i-- )
			ret[i] = this.parse( arr[i] , undefined , stack);
		this.down();
		return join( '[', ret, ']' );
	};

	var reName = /^function (\w+)/;

	var jsDump = {
		parse:function( obj, type, stack ) { //type is used mostly internally, you can fix a (custom)type in advance
			stack = stack || [ ];
			var parser = this.parsers[ type || this.typeOf(obj) ];
			type = typeof parser;
			var inStack = inArray(obj, stack);
			if (inStack != -1) {
				return 'recursion('+(inStack - stack.length)+')';
			}
			//else
			if (type == 'function')  {
					stack.push(obj);
					var res = parser.call( this, obj, stack );
					stack.pop();
					return res;
			}
			// else
			return (type == 'string') ? parser : this.parsers.error;
		},
		typeOf:function( obj ) {
			var type;
			if ( obj === null ) {
				type = "null";
			} else if (typeof obj === "undefined") {
				type = "undefined";
			} else if (QUnit.is("RegExp", obj)) {
				type = "regexp";
			} else if (QUnit.is("Date", obj)) {
				type = "date";
			} else if (QUnit.is("Function", obj)) {
				type = "function";
			} else if (typeof obj.setInterval !== undefined && typeof obj.document !== "undefined" && typeof obj.nodeType === "undefined") {
				type = "window";
			} else if (obj.nodeType === 9) {
				type = "document";
			} else if (obj.nodeType) {
				type = "node";
			} else if (
				// native arrays
				toString.call( obj ) === "[object Array]" ||
				// NodeList objects
				( typeof obj.length === "number" && typeof obj.item !== "undefined" && ( obj.length ? obj.item(0) === obj[0] : ( obj.item( 0 ) === null && typeof obj[0] === "undefined" ) ) )
			) {
				type = "array";
			} else {
				type = typeof obj;
			}
			return type;
		},
		separator:function() {
			return this.multiline ?	this.HTML ? '<br />' : '\n' : this.HTML ? '&nbsp;' : ' ';
		},
		indent:function( extra ) {// extra can be a number, shortcut for increasing-calling-decreasing
			if ( !this.multiline )
				return '';
			var chr = this.indentChar;
			if ( this.HTML )
				chr = chr.replace(/\t/g,'   ').replace(/ /g,'&nbsp;');
			return Array( this._depth_ + (extra||0) ).join(chr);
		},
		up:function( a ) {
			this._depth_ += a || 1;
		},
		down:function( a ) {
			this._depth_ -= a || 1;
		},
		setParser:function( name, parser ) {
			this.parsers[name] = parser;
		},
		// The next 3 are exposed so you can use them
		quote:quote,
		literal:literal,
		join:join,
		//
		_depth_: 1,
		// This is the list of parsers, to modify them, use jsDump.setParser
		parsers:{
			window: '[Window]',
			document: '[Document]',
			error:'[ERROR]', //when no parser is found, shouldn't happen
			unknown: '[Unknown]',
			'null':'null',
			'undefined':'undefined',
			'function':function( fn ) {
				var ret = 'function',
					name = 'name' in fn ? fn.name : (reName.exec(fn)||[])[1];//functions never have name in IE
				if ( name )
					ret += ' ' + name;
				ret += '(';

				ret = [ ret, QUnit.jsDump.parse( fn, 'functionArgs' ), '){'].join('');
				return join( ret, QUnit.jsDump.parse(fn,'functionCode'), '}' );
			},
			array: array,
			nodelist: array,
			arguments: array,
			object:function( map, stack ) {
				var ret = [ ];
				QUnit.jsDump.up();
				for ( var key in map ) {
				    var val = map[key];
					ret.push( QUnit.jsDump.parse(key,'key') + ': ' + QUnit.jsDump.parse(val, undefined, stack));
                }
				QUnit.jsDump.down();
				return join( '{', ret, '}' );
			},
			node:function( node ) {
				var open = QUnit.jsDump.HTML ? '&lt;' : '<',
					close = QUnit.jsDump.HTML ? '&gt;' : '>';

				var tag = node.nodeName.toLowerCase(),
					ret = open + tag;

				for ( var a in QUnit.jsDump.DOMAttrs ) {
					var val = node[QUnit.jsDump.DOMAttrs[a]];
					if ( val )
						ret += ' ' + a + '=' + QUnit.jsDump.parse( val, 'attribute' );
				}
				return ret + close + open + '/' + tag + close;
			},
			functionArgs:function( fn ) {//function calls it internally, it's the arguments part of the function
				var l = fn.length;
				if ( !l ) return '';

				var args = Array(l);
				while ( l-- )
					args[l] = String.fromCharCode(97+l);//97 is 'a'
				return ' ' + args.join(', ') + ' ';
			},
			key:quote, //object calls it internally, the key part of an item in a map
			functionCode:'[code]', //function calls it internally, it's the content of the function
			attribute:quote, //node calls it internally, it's an html attribute value
			string:quote,
			date:quote,
			regexp:literal, //regex
			number:literal,
			'boolean':literal
		},
		DOMAttrs:{//attributes to dump from nodes, name=>realName
			id:'id',
			name:'name',
			'class':'className'
		},
		HTML:false,//if true, entities are escaped ( <, >, \t, space and \n )
		indentChar:'  ',//indentation unit
		multiline:true //if true, items in a collection, are separated by a \n, else just a space.
	};

	return jsDump;
})();

// from Sizzle.js
function getText( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += getText( elem.childNodes );
		}
	}

	return ret;
};

//from jquery.js
function inArray( elem, array ) {
	if ( array.indexOf ) {
		return array.indexOf( elem );
	}

	for ( var i = 0, length = array.length; i < length; i++ ) {
		if ( array[ i ] === elem ) {
			return i;
		}
	}

	return -1;
}

/*
 * Javascript Diff Algorithm
 *  By John Resig (http://ejohn.org/)
 *  Modified by Chu Alan "sprite"
 *
 * Released under the MIT license.
 *
 * More Info:
 *  http://ejohn.org/projects/javascript-diff-algorithm/
 *
 * Usage: QUnit.diff(expected, actual)
 *
 * QUnit.diff("the quick brown fox jumped over", "the quick fox jumps over") == "the  quick <del>brown </del> fox <del>jumped </del><ins>jumps </ins> over"
 */
QUnit.diff = (function() {
	function diff(o, n) {
		var ns = {};
		var os = {};

		for (var i = 0; i < n.length; i++) {
			if (ns[n[i]] == null)
				ns[n[i]] = {
					rows: [],
					o: null
				};
			ns[n[i]].rows.push(i);
		}

		for (var i = 0; i < o.length; i++) {
			if (os[o[i]] == null)
				os[o[i]] = {
					rows: [],
					n: null
				};
			os[o[i]].rows.push(i);
		}

		for (var i in ns) {
			if ( !hasOwn.call( ns, i ) ) {
				continue;
			}
			if (ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1) {
				n[ns[i].rows[0]] = {
					text: n[ns[i].rows[0]],
					row: os[i].rows[0]
				};
				o[os[i].rows[0]] = {
					text: o[os[i].rows[0]],
					row: ns[i].rows[0]
				};
			}
		}

		for (var i = 0; i < n.length - 1; i++) {
			if (n[i].text != null && n[i + 1].text == null && n[i].row + 1 < o.length && o[n[i].row + 1].text == null &&
			n[i + 1] == o[n[i].row + 1]) {
				n[i + 1] = {
					text: n[i + 1],
					row: n[i].row + 1
				};
				o[n[i].row + 1] = {
					text: o[n[i].row + 1],
					row: i + 1
				};
			}
		}

		for (var i = n.length - 1; i > 0; i--) {
			if (n[i].text != null && n[i - 1].text == null && n[i].row > 0 && o[n[i].row - 1].text == null &&
			n[i - 1] == o[n[i].row - 1]) {
				n[i - 1] = {
					text: n[i - 1],
					row: n[i].row - 1
				};
				o[n[i].row - 1] = {
					text: o[n[i].row - 1],
					row: i - 1
				};
			}
		}

		return {
			o: o,
			n: n
		};
	}

	return function(o, n) {
		o = o.replace(/\s+$/, '');
		n = n.replace(/\s+$/, '');
		var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/));

		var str = "";

		var oSpace = o.match(/\s+/g);
		if (oSpace == null) {
			oSpace = [" "];
		}
		else {
			oSpace.push(" ");
		}
		var nSpace = n.match(/\s+/g);
		if (nSpace == null) {
			nSpace = [" "];
		}
		else {
			nSpace.push(" ");
		}

		if (out.n.length == 0) {
			for (var i = 0; i < out.o.length; i++) {
				str += '<del>' + out.o[i] + oSpace[i] + "</del>";
			}
		}
		else {
			if (out.n[0].text == null) {
				for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
					str += '<del>' + out.o[n] + oSpace[n] + "</del>";
				}
			}

			for (var i = 0; i < out.n.length; i++) {
				if (out.n[i].text == null) {
					str += '<ins>' + out.n[i] + nSpace[i] + "</ins>";
				}
				else {
					var pre = "";

					for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++) {
						pre += '<del>' + out.o[n] + oSpace[n] + "</del>";
					}
					str += " " + out.n[i].text + nSpace[i] + pre;
				}
			}
		}

		return str;
	};
})();

})(this);
(function(){

module("html5shiv tests");
var blockElements  = "article,aside,figcaption,figure,footer,header,hgroup,nav,section".split(',');

var testEnv = [
	{
		doc: document,
		initialShivMethods: html5.shivMethods,
		html5: html5,
		name: 'default'
	}
];


var shivTests = function(fn, env){
	if(!env){
		env = testEnv[0];
	}
	env.html5.shivMethods = true;
	fn();
	env.html5.shivMethods = env.initialShivMethods;
};

var envTest = function(name, fn, frames){
	if(!frames){
		frames = ['default'];
	}
	asyncTest(name, function(){
		$.each(testEnv, function(i, env){
			if($.inArray(env.name, frames) != -1){
				fn(env);
			}
		});
		if(testEnv.length > 1){
			start();
		} else {
			initIframes();
		}
	});
	
};

QUnit.reset = function() {
	$.each(testEnv, function(i, env){
		$('#qunit-fixture', env.doc).html(env.fixture);
	});
};


var initIframes = function(){
	if(testEnv.length > 1){return;}
	testEnv[0].fixture = $('#qunit-fixture').html();
	
	$('iframe.test-frame').each(function(){
		var win = this.contentWindow;
		if($('#qunit-fixture', win.document).length){
			testEnv.push({
				doc: win.document,
				html5: win.html5,
				initialShivMethods: (win.html5 || {}).shivMethods,
				fixture: $('#qunit-fixture', win.document).html(),
				name: this.src.split('?')[1]
			});
		}
	});
	if(testEnv.length > 1){
		start();
	} else {
		setTimeout(initIframes, 30);
	}
};


$(initIframes);


envTest("display block tests", function(env){
	$.each(blockElements, function(i, elem){
		equals($(elem, env.doc).css('display'), 'block', elem +" has display: block");
	});

}, ['default', 'disableMethodsBefore']);

envTest("test html5.createElement/html5.createDocumentFragment", function(env){
	var doc5 = html5;
	if(env.html5){
		doc5 = env.html5;
		env.html5.shivMethods = false;
	}
	html5.shivMethods = false;
	
	var fragDiv =  doc5.createElement('div', env.doc);
	var frag = doc5.createDocumentFragment(env.doc);
	var markText = "with these words highlighted";
	var div = $( doc5.createElement('div', env.doc) ).html('<section><article><mark>s</mark></article>?</section>').appendTo(env.doc.getElementById('qunit-fixture'));
	
	fragDiv.innerHTML = '<section>This native javascript sentence is in a green box <mark>'+markText+'</mark>?</section>';
	
	frag.appendChild(fragDiv);
	fragDiv.innerHTML += '<article>This native javascript sentence is also in a green box <mark>'+markText+'</mark>?</article>';
	
	env.doc.getElementById('qunit-fixture').appendChild(frag);
	
	equals($('section article > mark', div).length, 1, "found mark in section > article");
	equals($('section > mark', fragDiv).html(), markText, "innerHTML getter equals innerHTML setter");
	equals($('article', fragDiv).css('borderTopWidth'), '2px', "article has a 2px border");
	
	if(env.html5){
		env.html5.shivMethods = env.initialShivMethods;
	}
	html5.shivMethods = true;
}, ['disableMethodsBefore', 'disableMethodsAfter']);


if(!html5.supportsUnknownElements){

	envTest("config shivMethods test", function(env){
		var div = $('<div/>', env.doc).html('<section><article><mark></mark></article>?</section>').appendTo(env.doc.getElementById('qunit-fixture'));
		equals($('section article > mark', div).length, (env.html5.shivMethods) ? 1 : 0, "found/no found mark in section > article");
	}, ['default', 'disableMethodsBefore', 'disableMethodsAfter']);
	
	envTest("config shivCSS test", function(env){
		$.each(blockElements, function(i, elem){
			equals($(elem, env.doc).css('display'), 'inline', elem +" has display: inline if unshived");
		});
		env.html5.shivCSS = true;
		env.html5.shivDocument();
		$.each(blockElements, function(i, elem){
			equals($(elem, env.doc).css('display'), 'block', elem +" has display: block. after reshiving");
		});
	}, ['disableCSS']);
}

envTest("config add elements test", function(env){
	var value = $.trim($('abcxyz', env.doc).html());
	ok((html5.supportsUnknownElements || env.html5.elements.indexOf('abcxyz') !== -1) ? value : !value, "unknownelement has one/none div inside: "+ value);
}, ['default', 'disableMethodsBefore', 'addUnknownBefore', 'addUnknownAfter']);

envTest("parsing tests", function(env){
	$.each(blockElements, function(i, elem){
		equals($(elem +' div.inside', env.doc).length, 1, elem +" has a div inside");
	});	
}, ['default', 'disableMethodsBefore']);

envTest("style test", function(env){
	var article = $('article', env.doc);
	equals(article.css('borderTopWidth'), '2px', "article has a 2px border");
}, ['default', 'disableMethodsBefore']);

if (!html5.supportsUnknownElements) {
	envTest("shiv different document", function(env){
		var markText = "with these words highlighted3";
		var markup = '<section><article>This jQuery 1.6.4 sentence is in a green box <mark>' + markText + '</mark></article>?</section>';
		
		var div = $('<div/>', env.doc).html(markup).appendTo(env.doc.getElementById('qunit-fixture'));
		equals($('section article > mark', div).length, 0, "document is not shived");
		
		html5.shivDocument(env.doc);
		
		div = $('<div/>', env.doc).html(markup).appendTo(env.doc.getElementById('qunit-fixture'));
		equals($('section article > mark', div).length, 1, "document is shived");
		equals($('article', div).css('borderTopWidth'), '2px', "article has a 2px border");
		
	}, ['noEmbed']);
}
	
envTest("createElement/innerHTML test", function(env){
	shivTests(
		function(){
			var div = env.doc.createElement('div');
			var text = "This native javascript sentence is in a green box <mark>with these words highlighted</mark>?";
			div.innerHTML = '<section id="section">'+ text +'</section>';
			env.doc.getElementById('qunit-fixture').appendChild(div);
			equals($('#section', env.doc).html(), text, "innerHTML getter equals innerHTML setter");
			equals($('#section mark', env.doc).length, 1, "section has a mark element inside");
		},
		env
	);
}, ['default', 'disableMethodsBefore']);

envTest("createElement/createDocumentFragment/innerHTML test", function(env){
	shivTests(
		function(){
			var div = env.doc.createElement('div');
			var frag = env.doc.createDocumentFragment();
			var markText = "with these words highlighted";
			div.innerHTML = '<section>This native javascript sentence is in a green box <mark>'+markText+'</mark>?</section>';
			frag.appendChild(div);
			div.innerHTML += '<article>This native javascript sentence is also in a green box <mark>'+markText+'</mark>?</article>';
			env.doc.getElementById('qunit-fixture').appendChild(frag);
			equals($('section > mark', div).html(), markText, "innerHTML getter equals innerHTML setter");
			equals($('article', div).css('borderTopWidth'), '2px', "article has a 2px border");
		},
		env
	);
}, ['default', 'disableMethodsBefore']);


envTest("createDocumentFragment/cloneNode/innerHTML test", function(env){
	shivTests(
		function(){
			var frag = env.doc.createDocumentFragment();
			var fragDiv = env.doc.createElement('div');
			
			var markText = "with these words highlighted2";
			var fragDivClone;
			frag.appendChild(fragDiv);
			
			fragDiv.innerHTML = '<div><article>This native javascript sentence is also in a green box <mark>'+markText+'</mark>?</article></div>';
			
			fragDivClone = fragDiv.cloneNode(true);
			
			env.doc.getElementById('qunit-fixture').appendChild(fragDivClone);
			equals($('mark', env.doc).html(), markText, "innerHTML getter equals innerHTML setter");
		},
		env
	);
}, ['default', 'addUnknownAfter']);

test("form test", function() {
	shivTests(
		function(){
			var form = document.createElement('form');
			var select = document.createElement('select');
			var input = document.createElement('input');
			var button = document.createElement('button');
			var option = document.createElement('option');
			var markText = "with these words highlighted2";
			
			form.setAttribute('action', 'some/path');
			form.setAttribute('name', 'formName');
			form.target = '_blank';
			select.name = 'selectName';
			option.value = '1.value';
			button.setAttribute('type', 'submit');
			input.type = 'submit';
			
			form.innerHTML = '<article>This native javascript sentence is also in a green box <mark>'+markText+'</mark>?</article>';
			
			
			form.appendChild(select);
			form.appendChild(button);
			form.appendChild(input);
			
			
			
			if(select.add){
				try {
					select.add(option);
				} catch(er){
					select.appendChild(option);
				}
			} else {
				select.appendChild(option);
			}
			document.getElementById('qunit-fixture').appendChild(form);
			
			equals($('select option', form).val(), '1.value', "select has one option with value");
			equals($('article > mark', form).html(), markText, "innerHTML getter equals innerHTML setter");
			equals($('article', form).css('borderTopWidth'), '2px', "article has a 2px border");
		}
	);
});

envTest("jQuery test", function(env){
	shivTests(
		function(){
			var markText = "with these words highlighted3";
			var div = $('<div/>', env.doc).html('<section><article>This jQuery 1.6.4 sentence is in a green box <mark>'+markText+'</mark></article>?</section>').appendTo(env.doc.getElementById('qunit-fixture'));
			equals($('article > mark', div).html(), markText, "innerHTML getter equals innerHTML setter");
			equals($('article', div).css('borderTopWidth'), '2px', "article has a 2px border");
		},
		env
	);
});




})();
(function() {


}).call(this);
(function() {


}).call(this);
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

    version : '4.3.1',

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
        } else {
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

      lib.outerWidth = function (el, bool) {
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

    zj : $
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

    version: '4.3.1',

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

    version : '4.3.0',

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

      $(document).on('click.fndtn.dropdown', function (e) {
        var parent = $(e.target).closest('[data-dropdown-content]');

        if ($(e.target).data('dropdown') || $(e.target).parent().data('dropdown')) {
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
      // if (offset_parent.length > 0 && /body/i.test(dropdown.offsetParent()[0].nodeName)) {
        var position = target.offset();
        position.top -= offset_parent.offset().top;
        position.left -= offset_parent.offset().left;
      // } else {
      //   var position = target.position();
      // }

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
    name : 'forms',

    version: '4.3.1',

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
            
            // Kick off full DOM change event
            if (typeof (document.createEvent) != 'undefined') {
              var event = document.createEvent('HTMLEvents');
              event.initEvent('change', true, true);
              $select[0].dispatchEvent(event);
            } else {
              $select[0].fireEvent('onchange'); // for IE
            }
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

        // rebuild and re-populate all at once
        var customSelectHtml = '';
        $options.each(function () {
          var $this = $(this), thisHtml = $this.html(), thisSelected = this.selected;
          customSelectHtml += '<li class="' + (thisSelected ? ' selected ' : '') + ($this.is(':disabled') ? ' disabled ' : '') + '">' + thisHtml + '</li>';
          if (thisSelected) {
            $customSelect.find('.current').html(thisHtml);
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
    name : 'joyride',

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
      exposeAddClass : '' // One or more space-separated class names to be added to exposed element
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

      // Prevent scroll bouncing...wait to remove from layout
      this.settings.$current_tip.css('visibility', 'hidden');
      setTimeout($.proxy(function() {
        this.hide();
        this.css('visibility', 'visible');
      }, this.settings.$current_tip), 0);
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
      activeClass: 'active',
      threshold: 0
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

  var noop = function() {};

  var Orbit = function(el, settings) {
    // Don't reinitialize plugin
    if (el.hasClass(settings.slides_container_class)) {
      return this;
    }

    var self = this,
        container,
        slides_container = el,
        number_container,
        bullets_container,
        timer_container,
        idx = 0,
        animate,
        timer,
        locked = false,
        adjust_height_after = false;

    slides_container.children().first().addClass(settings.active_slide_class);

    self.update_slide_number = function(index) {
      if (settings.slide_number) {
        number_container.find('span:first').text(parseInt(index)+1);
        number_container.find('span:last').text(slides_container.children().length);
      }
      if (settings.bullets) {
        bullets_container.children().removeClass(settings.bullets_active_class);
        $(bullets_container.children().get(index)).addClass(settings.bullets_active_class);
      }
    };

    self.build_markup = function() {
      slides_container.wrap('<div class="'+settings.container_class+'"></div>');
      container = slides_container.parent();
      slides_container.addClass(settings.slides_container_class);
      
      if (settings.navigation_arrows) {
        container.append($('<a>').addClass(settings.prev_class).append('<span>'));
        container.append($('<a>').addClass(settings.next_class).append('<span>'));
      }

      if (settings.timer) {
        timer_container = $('<div>').addClass(settings.timer_container_class);
        timer_container.append('<span>');
        timer_container.append($('<div>').addClass(settings.timer_progress_class));
        timer_container.addClass(settings.timer_paused_class);
        container.append(timer_container);
      }

      if (settings.slide_number) {
        number_container = $('<div>').addClass(settings.slide_number_class);
        number_container.append('<span></span> of <span></span>');
        container.append(number_container);
      }

      if (settings.bullets) {
        bullets_container = $('<ol>').addClass(settings.bullets_container_class);
        container.append(bullets_container);
        slides_container.children().each(function(idx, el) {
          var bullet = $('<li>').attr('data-orbit-slide', idx);
          bullets_container.append(bullet);
        });
      }

      if (settings.stack_on_small) {
        container.addClass(settings.stack_on_small_class);
      }

      self.update_slide_number(0);
    };

    self._goto = function(next_idx, start_timer) {
      // if (locked) {return false;}
      if (next_idx === idx) {return false;}
      if (typeof timer === 'object') {timer.restart();}
      var slides = slides_container.children();

      var dir = 'next';
      locked = true;
      if (next_idx < idx) {dir = 'prev';}
      if (next_idx >= slides.length) {next_idx = 0;}
      else if (next_idx < 0) {next_idx = slides.length - 1;}
      
      var current = $(slides.get(idx));
      var next = $(slides.get(next_idx));

      current.css('zIndex', 2);
      current.removeClass(settings.active_slide_class);
      next.css('zIndex', 4).addClass(settings.active_slide_class);

      slides_container.trigger('orbit:before-slide-change');
      settings.before_slide_change();
      
      var callback = function() {
        var unlock = function() {
          idx = next_idx;
          locked = false;
          if (start_timer === true) {timer = self.create_timer(); timer.start();}
          self.update_slide_number(idx);
          slides_container.trigger('orbit:after-slide-change',[{slide_number: idx, total_slides: slides.length}]);
          settings.after_slide_change(idx, slides.length);
        };
        if (slides_container.height() != next.height()) {
          slides_container.animate({'height': next.height()}, 250, 'linear', unlock);
        } else {
          unlock();
        }
      };

      if (slides.length === 1) {callback(); return false;}

      var start_animation = function() {
        if (dir === 'next') {animate.next(current, next, callback);}
        if (dir === 'prev') {animate.prev(current, next, callback);}        
      };

      if (next.height() > slides_container.height()) {
        slides_container.animate({'height': next.height()}, 250, 'linear', start_animation);
      } else {
        start_animation();
      }
    };
    
    self.next = function(e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      self._goto(idx + 1);
    };
    
    self.prev = function(e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      self._goto(idx - 1);
    };

    self.link_custom = function(e) {
      e.preventDefault();
      var link = $(this).attr('data-orbit-link');
      if ((typeof link === 'string') && (link = $.trim(link)) != "") {
        var slide = container.find('[data-orbit-slide='+link+']');
        if (slide.index() != -1) {self._goto(slide.index());}
      }
    };

    self.link_bullet = function(e) {
      var index = $(this).attr('data-orbit-slide');
      if ((typeof index === 'string') && (index = $.trim(index)) != "") {
        self._goto(parseInt(index));
      }
    }

    self.timer_callback = function() {
      self._goto(idx + 1, true);
    }
    
    self.compute_dimensions = function() {
      var current = $(slides_container.children().get(idx));
      var h = current.height();
      if (!settings.variable_height) {
        slides_container.children().each(function(){
          if ($(this).height() > h) { h = $(this).height(); }
        });
      }
      slides_container.height(h);
    };

    self.create_timer = function() {
      var t = new Timer(
        container.find('.'+settings.timer_container_class), 
        settings, 
        self.timer_callback
      );
      return t;
    };

    self.stop_timer = function() {
      if (typeof timer === 'object') timer.stop();
    };

    self.toggle_timer = function() {
      var t = container.find('.'+settings.timer_container_class);
      if (t.hasClass(settings.timer_paused_class)) {
        if (typeof timer === 'undefined') {timer = self.create_timer();}
        timer.start();     
      }
      else {
        if (typeof timer === 'object') {timer.stop();}
      }
    };

    self.init = function() {
      self.build_markup();
      if (settings.timer) {timer = self.create_timer(); timer.start();}
      animate = new FadeAnimation(settings, slides_container);
      if (settings.animation === 'slide') 
        animate = new SlideAnimation(settings, slides_container);        
      container.on('click', '.'+settings.next_class, self.next);
      container.on('click', '.'+settings.prev_class, self.prev);
      container.on('click', '[data-orbit-slide]', self.link_bullet);
      container.on('click', self.toggle_timer);
      container.on('touchstart.fndtn.orbit', function(e) {
        if (!e.touches) {e = e.originalEvent;}
        var data = {
          start_page_x: e.touches[0].pageX,
          start_page_y: e.touches[0].pageY,
          start_time: (new Date()).getTime(),
          delta_x: 0,
          is_scrolling: undefined
        };
        container.data('swipe-transition', data);
        e.stopPropagation();
      })
      .on('touchmove.fndtn.orbit', function(e) {
        if (!e.touches) { e = e.originalEvent; }
        // Ignore pinch/zoom events
        if(e.touches.length > 1 || e.scale && e.scale !== 1) return;

        var data = container.data('swipe-transition');
        if (typeof data === 'undefined') {data = {};}

        data.delta_x = e.touches[0].pageX - data.start_page_x;

        if ( typeof data.is_scrolling === 'undefined') {
          data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
        }

        if (!data.is_scrolling && !data.active) {
          e.preventDefault();
          var direction = (data.delta_x < 0) ? (idx+1) : (idx-1);
          data.active = true;
          self._goto(direction);
        }
      })
      .on('touchend.fndtn.orbit', function(e) {
        container.data('swipe-transition', {});
        e.stopPropagation();
      })
      .on('mouseenter.fndtn.orbit', function(e) {
        if (settings.timer && settings.pause_on_hover) {
          self.stop_timer();
        }
      })
      .on('mouseleave.fndtn.orbit', function(e) {
        if (settings.timer && settings.resume_on_mouseout) {
          timer.start();
        }
      });
      
      $(document).on('click', '[data-orbit-link]', self.link_custom);
      $(window).on('resize', self.compute_dimensions);
      $(window).on('load', self.compute_dimensions);
      slides_container.trigger('orbit:ready');
    };

    self.init();
  };

  var Timer = function(el, settings, callback) {
    var self = this,
        duration = settings.timer_speed,
        progress = el.find('.'+settings.timer_progress_class),
        start, 
        timeout,
        left = -1;

    this.update_progress = function(w) {
      var new_progress = progress.clone();
      new_progress.attr('style', '');
      new_progress.css('width', w+'%');
      progress.replaceWith(new_progress);
      progress = new_progress;
    };

    this.restart = function() {
      clearTimeout(timeout);
      el.addClass(settings.timer_paused_class);
      left = -1;
      self.update_progress(0);
    };

    this.start = function() {
      if (!el.hasClass(settings.timer_paused_class)) {return true;}
      left = (left === -1) ? duration : left;
      el.removeClass(settings.timer_paused_class);
      start = new Date().getTime();
      progress.animate({'width': '100%'}, left, 'linear');
      timeout = setTimeout(function() {
        self.restart();
        callback();
      }, left);
      el.trigger('orbit:timer-started')
    };

    this.stop = function() {
      if (el.hasClass(settings.timer_paused_class)) {return true;}
      clearTimeout(timeout);
      el.addClass(settings.timer_paused_class);
      var end = new Date().getTime();
      left = left - (end - start);
      var w = 100 - ((left / duration) * 100);
      self.update_progress(w);
      el.trigger('orbit:timer-stopped');
    };
  };
  
  var SlideAnimation = function(settings, container) {
    var duration = settings.animation_speed;
    var is_rtl = ($('html[dir=rtl]').length === 1);
    var margin = is_rtl ? 'marginRight' : 'marginLeft';

    this.next = function(current, next, callback) {
      next.animate({margin: '0%'}, duration, 'linear', function() {
        current.css(margin, '100%');
        callback();
      });
    };

    this.prev = function(current, prev, callback) {
      prev.css(margin, '-100%');
      prev.animate({margin:'0%'}, duration, 'linear', function() {
        current.css(margin, '100%');
        callback();
      });
    };
  };

  var FadeAnimation = function(settings, container) {
    var duration = settings.animation_speed;

    this.next = function(current, next, callback) {
      next.css({'marginLeft':'0%', 'opacity':'0.01'});
      next.animate({'opacity':'1'}, duration, 'linear', function() {
        current.css('marginLeft', '100%');
        callback();
      });
    };

    this.prev = function(current, prev, callback) {
      prev.css({'marginLeft':'0%', 'opacity':'0.01'});
      prev.animate({'opacity':'1'}, duration, 'linear', function() {
        current.css('marginLeft', '100%');
        callback();
      });
    };
  };


  Foundation.libs = Foundation.libs || {};

  Foundation.libs.orbit = {
    name: 'orbit',

    version: '4.3.1',

    settings: {
      animation: 'slide',
      timer_speed: 10000,
      pause_on_hover: true,
      resume_on_mouseout: false,
      animation_speed: 500,
      stack_on_small: false,
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
      orbit_transition_class: 'orbit-transitioning',
      bullets: true,
      timer: true,
      variable_height: false,
      before_slide_change: noop,
      after_slide_change: noop
    },

    init: function (scope, method, options) {
      var self = this;
      Foundation.inherit(self, 'data_options');

      if (typeof method === 'object') {
        $.extend(true, self.settings, method);
      }

      if ($(scope).is('[data-orbit]')) {
        var $el = $(scope);
        var opts = self.data_options($el);
        new Orbit($el, $.extend({},self.settings, opts));
      }

      $('[data-orbit]', scope).each(function(idx, el) {
        var $el = $(el);
        var opts = self.data_options($el);
        new Orbit($el, $.extend({},self.settings, opts));
      });
    }
  };

    
}(Foundation.zj, this, this.document));
/*jslint unparam: true, browser: true, indent: 2 */


;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.reveal = {
    name : 'reveal',

    version : '4.3.2',

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
        .on('click.fndtn.reveal touchend', this.close_targets(), function (e) {
          e.preventDefault();
          if (!self.locked) {
            var settings = $.extend({}, self.settings, self.data_options($('.reveal-modal.open'))),
              bgClicked = $(e.target)[0] === $('.' + settings.bgClass)[0];
            if (bgClicked && !settings.closeOnBackgroundClick) {
              return;
            }

            self.locked = true;
            self.close.call(self, bgClicked ? $('.reveal-modal.open') : $(this).closest('.reveal-modal'));
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


;
(function($, window, document) {
  'use strict';

  Foundation.libs.section = {
    name : 'section',

    version : '4.3.1',

    settings: {
      deep_linking: false,
      small_breakpoint: 768,
      one_up: true,
      section_selector: '[data-section]',
      region_selector: 'section, .section, [data-section-region]',
      title_selector: '.title, [data-section-title]',
      //marker: container is resized
      resized_data_attr: 'data-section-resized',
      //marker: container should apply accordion style
      small_style_data_attr: 'data-section-small-style',
      content_selector: '.content, [data-section-content]',
      nav_selector: '[data-section="vertical-nav"], [data-section="horizontal-nav"]',
      active_class: 'active',
      callback: function() {}
    },

    init: function(scope, method, options) {
      var self = this;
      Foundation.inherit(this, 'throttle data_options position_right offset_right');

      if (typeof method === 'object') {
        $.extend(true, self.settings, method);
      }

      if (typeof method !== 'string') {
        this.events();
        return true;
      } else {
        return this[method].call(this, options);
      }
    },

    events: function() {
      var self = this;

      //combine titles selector from settings for click event binding
      var click_title_selectors = [],
          section_selector = self.settings.section_selector,
          region_selectors = self.settings.region_selector.split(","),
          title_selectors = self.settings.title_selector.split(",");

      for (var i = 0, len = region_selectors.length; i < len; i++) {
        var region_selector = region_selectors[i];

        for (var j = 0, len1 = title_selectors.length; j < len1; j++) {
          var title_selector = section_selector + ">" + region_selector + ">" + title_selectors[j];

          click_title_selectors.push(title_selector + " a"); //or we can not do preventDefault for click event of <a>
          click_title_selectors.push(title_selector);
        }
      }

      $(self.scope)
        .on('click.fndtn.section', click_title_selectors.join(","), function(e) {
          var title = $(this).closest(self.settings.title_selector);

          self.close_navs(title);
          if (title.siblings(self.settings.content_selector).length > 0) {
            self.toggle_active.call(title[0], e);
          }
        });

      $(window)
        .on('resize.fndtn.section', self.throttle(function() { self.resize(); }, 30))
        .on('hashchange.fndtn.section', self.set_active_from_hash);

      $(document).on('click.fndtn.section', function (e) {
        if (e.isPropagationStopped && e.isPropagationStopped()) return;
        if (e.target === document) return;
        self.close_navs($(e.target).closest(self.settings.title_selector));
      });

      $(window).triggerHandler('resize.fndtn.section');
      $(window).triggerHandler('hashchange.fndtn.section');
    },
    
    //close nav !one_up on click elsewhere
    close_navs: function(except_nav_with_title) {
      var self = Foundation.libs.section,
          navsToClose = $(self.settings.nav_selector)
            .filter(function() { return !$.extend({}, 
              self.settings, self.data_options($(this))).one_up; });

      if (except_nav_with_title.length > 0) {
        var section = except_nav_with_title.parent().parent();

        if (self.is_horizontal_nav(section) || self.is_vertical_nav(section)) {
          //exclude current nav from list
          navsToClose = navsToClose.filter(function() { return this !== section[0]; });
        }
      }
      //close navs on click on title
      navsToClose.children(self.settings.region_selector).removeClass(self.settings.active_class);
    },

    toggle_active: function(e) {
      var $this = $(this),
          self = Foundation.libs.section,
          region = $this.parent(),
          content = $this.siblings(self.settings.content_selector),
          section = region.parent(),
          settings = $.extend({}, self.settings, self.data_options(section)),
          prev_active_region = section.children(self.settings.region_selector).filter("." + self.settings.active_class);

      //for anchors inside [data-section-title]
      if (!settings.deep_linking && content.length > 0) {
        e.preventDefault();
      }

      e.stopPropagation(); //do not catch same click again on parent

      if (!region.hasClass(self.settings.active_class)) {
        prev_active_region.removeClass(self.settings.active_class);
        region.addClass(self.settings.active_class);
        //force resize for better performance (do not wait timer)
        self.resize(region.find(self.settings.section_selector).not("[" + self.settings.resized_data_attr + "]"), true);
      } else if (!settings.one_up && (self.small(section) || self.is_vertical_nav(section) || self.is_horizontal_nav(section) || self.is_accordion(section))) {
        region.removeClass(self.settings.active_class);
      }
      settings.callback(section);
    },

    check_resize_timer: null,

    //main function that sets title and content positions; runs for :not(.resized) and :visible once when window width is medium up
    //sections:
    //  selected sections to resize, are defined on resize forced by visibility changes
    //ensure_has_active_region:
    //  is true when we force resize for no resized sections that were hidden and became visible, 
    //  these sections can have no selected region, because all regions were hidden along with section on executing set_active_from_hash
    resize: function(sections, ensure_has_active_region) {

      var self = Foundation.libs.section,
          is_small_window = self.small($(document)),
          //filter for section resize
          should_be_resized = function (section, now_is_hidden) {
            return !self.is_accordion(section) && 
              !section.is("[" + self.settings.resized_data_attr + "]") && 
              (!is_small_window || self.is_horizontal_tabs(section)) && 
              now_is_hidden === (section.css('display') === 'none' || 
              !section.parent().is(':visible'));
          };

      sections = sections || $(self.settings.section_selector);

      clearTimeout(self.check_resize_timer);

      if (!is_small_window) {
        sections.removeAttr(self.settings.small_style_data_attr);
      }

      //resize
      sections.filter(function() { return should_be_resized($(this), false); })
        .each(function() {
          var section = $(this),
            regions = section.children(self.settings.region_selector),
            titles = regions.children(self.settings.title_selector),
            content = regions.children(self.settings.content_selector),
            titles_max_height = 0;

          if (ensure_has_active_region && 
            section.children(self.settings.region_selector).filter("." + self.settings.active_class).length == 0) {
            var settings = $.extend({}, self.settings, self.data_options(section));

            if (!settings.deep_linking && (settings.one_up || !self.is_horizontal_nav(section) &&
              !self.is_vertical_nav(section) && !self.is_accordion(section))) {
                regions.filter(":visible").first().addClass(self.settings.active_class);
            }
          }

          if (self.is_horizontal_tabs(section) || self.is_auto(section)) {
            //    region: position relative
            //    title: position absolute
            //    content: position static
            var titles_sum_width = 0;

            titles.each(function() {
              var title = $(this);

              if (title.is(":visible")) {
                title.css(!self.rtl ? 'left' : 'right', titles_sum_width);
                var title_h_border_width = parseInt(title.css("border-" + (self.rtl ? 'left' : 'right') + "-width"), 10);

                if (title_h_border_width.toString() === 'Nan') {
                  title_h_border_width = 0;
                }

                titles_sum_width += self.outerWidth(title) - title_h_border_width;
                titles_max_height = Math.max(titles_max_height, self.outerHeight(title));
              }
            });
            titles.css('height', titles_max_height);
            regions.each(function() {
              var region = $(this),
                  region_content = region.children(self.settings.content_selector),
                  content_top_border_width = parseInt(region_content.css("border-top-width"), 10);

              if (content_top_border_width.toString() === 'Nan') {
                content_top_border_width = 0;
              }

              region.css('padding-top', titles_max_height - content_top_border_width);
            });

            section.css("min-height", titles_max_height);
          } else if (self.is_horizontal_nav(section)) {
            var first = true;
            //    region: positon relative, float left
            //    title: position static
            //    content: position absolute
            titles.each(function() {
              titles_max_height = Math.max(titles_max_height, self.outerHeight($(this)));
            });

            regions.each(function() {
              var region = $(this);

              region.css("margin-left", "-" + (first ? section : region.children(self.settings.title_selector)).css("border-left-width"));
              first = false;
            });

            regions.css("margin-top", "-" + section.css("border-top-width"));
            titles.css('height', titles_max_height);
            content.css('top', titles_max_height);
            section.css("min-height", titles_max_height);
          } else if (self.is_vertical_tabs(section)) {
            var titles_sum_height = 0;
            //    region: position relative, for .active: fixed padding==title.width
            //    title: fixed width, position absolute
            //    content: position static
            titles.each(function() {
              var title = $(this);

              if (title.is(":visible")) {
                title.css('top', titles_sum_height);
                var title_top_border_width = parseInt(title.css("border-top-width"), 10);

                if (title_top_border_width.toString() === 'Nan') {
                  title_top_border_width = 0;
                }

                titles_sum_height += self.outerHeight(title) - title_top_border_width;
              }
            });

            content.css('min-height', titles_sum_height + 1);
          } else if (self.is_vertical_nav(section)) {
            var titles_max_width = 0,
                first1 = true;
            //    region: positon relative
            //    title: position static
            //    content: position absolute
            titles.each(function() {
              titles_max_width = Math.max(titles_max_width, self.outerWidth($(this)));
            });

            regions.each(function () {
              var region = $(this);

              region.css("margin-top", "-" + (first1 ? section : region.children(self.settings.title_selector)).css("border-top-width"));
              first1 = false;
            });

            titles.css('width', titles_max_width);
            content.css(!self.rtl ? 'left' : 'right', titles_max_width);
            section.css('width', titles_max_width);
          }

          section.attr(self.settings.resized_data_attr, true);
        });

      //wait elements to become visible then resize
      if ($(self.settings.section_selector).filter(function() { return should_be_resized($(this), true); }).length > 0)
        self.check_resize_timer = setTimeout(function() {
          self.resize(sections.filter(function() { return should_be_resized($(this), false); }), true);
        }, 700);

      if (is_small_window) {
        sections.attr(self.settings.small_style_data_attr, true);
      }
    },

    is_vertical_nav: function(el) {
      return /vertical-nav/i.test(el.data('section'));
    },

    is_horizontal_nav: function(el) {
      return /horizontal-nav/i.test(el.data('section'));
    },

    is_accordion: function(el) {
      return /accordion/i.test(el.data('section'));
    },

    is_horizontal_tabs: function(el) {
      return /^tabs$/i.test(el.data('section'));
    },

    is_vertical_tabs: function(el) {
      return /vertical-tabs/i.test(el.data('section'));
    },
    
    is_auto: function (el) {
      var data_section = el.data('section');
      return data_section === '' || /auto/i.test(data_section);
    },

    set_active_from_hash: function() {
      var self = Foundation.libs.section,
          hash = window.location.hash.substring(1),
          sections = $(self.settings.section_selector);

      var selectedSection;
      
      sections.each(function() {
          var section = $(this),
          regions = section.children(self.settings.region_selector);
          regions.each(function() {
            var region = $(this),
        	  data_slug = region.children(self.settings.content_selector).data('slug');
        	  if (new RegExp(data_slug, 'i').test(hash)) {
        		  selectedSection=section;
        		  return false;
              }
          });
          
          if (selectedSection != null) {
        	  return false;
          }
      });
      
      if (selectedSection != null) {
        sections.each(function() {
    	    if (selectedSection == $(this)) {
		        var section = $(this),
		            settings = $.extend({}, self.settings, self.data_options(section)),
		            regions = section.children(self.settings.region_selector),
		            set_active_from_hash = settings.deep_linking && hash.length > 0,
		            selected = false;
		
		        regions.each(function() {
		          var region = $(this);
		
		          if (selected) {
		            region.removeClass(self.settings.active_class);
		          } else if (set_active_from_hash) {
		            var data_slug = region.children(self.settings.content_selector).data('slug');
		
		            if (data_slug && new RegExp(data_slug, 'i').test(hash)) {
		              if (!region.hasClass(self.settings.active_class))
		                region.addClass(self.settings.active_class);
		              selected = true;
		            } else {
		              region.removeClass(self.settings.active_class);
		            }
		          } else if (region.hasClass(self.settings.active_class)) {
		            selected = true;
		          }
		        });
		
		        if (!selected && (settings.one_up || !self.is_horizontal_nav(section) &&
		         !self.is_vertical_nav(section) && !self.is_accordion(section)))
		          regions.filter(":visible").first().addClass(self.settings.active_class);
    	    }
        });
      }
    },

    reflow: function() {
      var self = Foundation.libs.section;

      $(self.settings.section_selector).removeAttr(self.settings.resized_data_attr);
      self.throttle(function() { self.resize(); }, 30)();
    },

    small: function(el) {
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

    off: function() {
      $(this.scope).off('.fndtn.section');
      $(window).off('.fndtn.section');
      $(document).off('.fndtn.section');
    }
  };

  //resize selected sections
  $.fn.reflow_section = function(ensure_has_active_region) {
    var section = this,
        self = Foundation.libs.section;

    section.removeAttr(self.settings.resized_data_attr);
    self.throttle(function() { self.resize(section, ensure_has_active_region); }, 30)();
    return this;
  };

}(Foundation.zj, window, document));
/*jslint unparam: true, browser: true, indent: 2 */


;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.tooltips = {
    name : 'tooltips',

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

    version: '4.3.1',

    settings : {
      index : 0,
      stickyClass : 'sticky',
      custom_back_text: true,
      back_text: 'Back',
      is_hover: true,
      mobile_show_parent_link: true,
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

          if (self.settings.is_hover) {
            self.settings.$topbar.find('.has-dropdown').addClass('not-click');
          }

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

    timer : null,

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

            topbar.css('height', self.outerHeight($this.siblings('ul'), true) + self.height(titlebar));
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
          topbar.css('height', self.outerHeight($previousLevelUl, true) + self.height(titlebar));
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

        if (self.settings.mobile_show_parent_link && url && url.length > 1) {
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
            $window = $(window),
            offst = this.outerHeight($('.top-bar')),
            t_top;

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
            } else if ($window.scrollTop() <= distance) {
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

    version : '4.2.4',

    cache : {},

    images_loaded : false,

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
        replace: function (el, path) {
          if (/IMG/.test(el[0].nodeName)) {
            var orig_path = el[0].src;

            if (new RegExp(path, 'i').test(orig_path)) return;

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

      if(!this.images_loaded) {
        setTimeout($.proxy(this.resize, this), 50);
        return;
      }

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
      var count = scenarios.length;

      if (count > 0) {
        var el = $('[data-uuid="' + uuid + '"]');

        for (var i = count - 1; i >= 0; i--) {
          var mq, rule = scenarios[i][2];
          if (this.settings.named_queries.hasOwnProperty(rule)) {
            mq = matchMedia(this.settings.named_queries[rule]);
          } else {
            mq = matchMedia(rule);
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
          loaded_count = 0,
          data_attr = 'data-' + this.settings.load_attr;

      this.cached_images = [];
      this.images_loaded = false;

      for (var i = count - 1; i >= 0; i--) {
        this.loaded($(images[i]), function (image) {
          loaded_count++;
          if (image) {
            var str = image.getAttribute(data_attr) || '';

            if (str.length > 0) {
              this.cached_images.push(image);
            }
          }

          if(loaded_count === count) {
            this.images_loaded = true;
            this.enhance();
          }
        }.bind(this));
      }

      return 'deferred';
    },

    // based on jquery.imageready.js
    // @weblinc, @jsantell, (c) 2012

    loaded : function (image, callback) {
      function loaded () {
        callback(image[0]);
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
/* 
 * The MIT License
 *
 * Copyright (c) 2012 James Allardice
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// Defines the global Placeholders object along with various utility methods
(function (global) {

    "use strict";

    // Cross-browser DOM event binding
    function addEventListener(elem, event, fn) {
        if (elem.addEventListener) {
            return elem.addEventListener(event, fn, false);
        }
        if (elem.attachEvent) {
            return elem.attachEvent("on" + event, fn);
        }
    }

    // Check whether an item is in an array (we don't use Array.prototype.indexOf so we don't clobber any existing polyfills - this is a really simple alternative)
    function inArray(arr, item) {
        var i, len;
        for (i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === item) {
                return true;
            }
        }
        return false;
    }

    // Move the caret to the index position specified. Assumes that the element has focus
    function moveCaret(elem, index) {
        var range;
        if (elem.createTextRange) {
            range = elem.createTextRange();
            range.move("character", index);
            range.select();
        } else if (elem.selectionStart) {
            elem.focus();
            elem.setSelectionRange(index, index);
        }
    }

    // Attempt to change the type property of an input element
    function changeType(elem, type) {
        try {
            elem.type = type;
            return true;
        } catch (e) {
            // You can't change input type in IE8 and below
            return false;
        }
    }

    // Expose public methods
    global.Placeholders = {
        Utils: {
            addEventListener: addEventListener,
            inArray: inArray,
            moveCaret: moveCaret,
            changeType: changeType
        }
    };

}(this));

(function (global) {

    "use strict";

    var validTypes = [
            "text",
            "search",
            "url",
            "tel",
            "email",
            "password",
            "number",
            "textarea"
        ],

        // The list of keycodes that are not allowed when the polyfill is configured to hide-on-input
        badKeys = [

            // The following keys all cause the caret to jump to the end of the input value
            27, // Escape
            33, // Page up
            34, // Page down
            35, // End
            36, // Home

            // Arrow keys allow you to move the caret manually, which should be prevented when the placeholder is visible
            37, // Left
            38, // Up
            39, // Right
            40, // Down

            // The following keys allow you to modify the placeholder text by removing characters, which should be prevented when the placeholder is visible
            8, // Backspace
            46 // Delete
        ],

        // Styling variables
        placeholderStyleColor = "#ccc",
        placeholderClassName = "placeholdersjs",
        classNameRegExp = new RegExp("(?:^|\\s)" + placeholderClassName + "(?!\\S)"),

        // These will hold references to all elements that can be affected. NodeList objects are live, so we only need to get those references once
        inputs, textareas,

        // The various data-* attributes used by the polyfill
        ATTR_CURRENT_VAL = "data-placeholder-value",
        ATTR_ACTIVE = "data-placeholder-active",
        ATTR_INPUT_TYPE = "data-placeholder-type",
        ATTR_FORM_HANDLED = "data-placeholder-submit",
        ATTR_EVENTS_BOUND = "data-placeholder-bound",
        ATTR_OPTION_FOCUS = "data-placeholder-focus",
        ATTR_OPTION_LIVE = "data-placeholder-live",

        // Various other variables used throughout the rest of the script
        test = document.createElement("input"),
        head = document.getElementsByTagName("head")[0],
        root = document.documentElement,
        Placeholders = global.Placeholders,
        Utils = Placeholders.Utils,
        hideOnInput, liveUpdates, keydownVal, styleElem, styleRules, placeholder, timer, form, elem, len, i;

    // No-op (used in place of public methods when native support is detected)
    function noop() {}

    // Hide the placeholder value on a single element. Returns true if the placeholder was hidden and false if it was not (because it wasn't visible in the first place)
    function hidePlaceholder(elem) {
        var type;
        if (elem.value === elem.getAttribute(ATTR_CURRENT_VAL) && elem.getAttribute(ATTR_ACTIVE) === "true") {
            elem.setAttribute(ATTR_ACTIVE, "false");
            elem.value = "";
            elem.className = elem.className.replace(classNameRegExp, "");

            // If the polyfill has changed the type of the element we need to change it back
            type = elem.getAttribute(ATTR_INPUT_TYPE);
            if (type) {
                elem.type = type;
            }
            return true;
        }
        return false;
    }

    // Show the placeholder value on a single element. Returns true if the placeholder was shown and false if it was not (because it was already visible)
    function showPlaceholder(elem) {
        var type,
            val = elem.getAttribute(ATTR_CURRENT_VAL);
        if (elem.value === "" && val) {
            elem.setAttribute(ATTR_ACTIVE, "true");
            elem.value = val;
            elem.className += " " + placeholderClassName;

            // If the type of element needs to change, change it (e.g. password inputs)
            type = elem.getAttribute(ATTR_INPUT_TYPE);
            if (type) {
                elem.type = "text";
            } else if (elem.type === "password") {
                if (Utils.changeType(elem, "text")) {
                    elem.setAttribute(ATTR_INPUT_TYPE, "password");
                }
            }
            return true;
        }
        return false;
    }

    function handleElem(node, callback) {

        var handleInputs, handleTextareas, elem, len, i;

        // Check if the passed in node is an input/textarea (in which case it can't have any affected descendants)
        if (node && node.getAttribute(ATTR_CURRENT_VAL)) {
            callback(node);
        } else {

            // If an element was passed in, get all affected descendants. Otherwise, get all affected elements in document
            handleInputs = node ? node.getElementsByTagName("input") : inputs;
            handleTextareas = node ? node.getElementsByTagName("textarea") : textareas;

            // Run the callback for each element
            for (i = 0, len = handleInputs.length + handleTextareas.length; i < len; i++) {
                elem = i < handleInputs.length ? handleInputs[i] : handleTextareas[i - handleInputs.length];
                callback(elem);
            }
        }
    }

    // Return all affected elements to their normal state (remove placeholder value if present)
    function disablePlaceholders(node) {
        handleElem(node, hidePlaceholder);
    }

    // Show the placeholder value on all appropriate elements
    function enablePlaceholders(node) {
        handleElem(node, showPlaceholder);
    }

    // Returns a function that is used as a focus event handler
    function makeFocusHandler(elem) {
        return function () {

            // Only hide the placeholder value if the (default) hide-on-focus behaviour is enabled
            if (hideOnInput && elem.value === elem.getAttribute(ATTR_CURRENT_VAL) && elem.getAttribute(ATTR_ACTIVE) === "true") {

                // Move the caret to the start of the input (this mimics the behaviour of all browsers that do not hide the placeholder on focus)
                Utils.moveCaret(elem, 0);

            } else {

                // Remove the placeholder
                hidePlaceholder(elem);
            }
        };
    }

    // Returns a function that is used as a blur event handler
    function makeBlurHandler(elem) {
        return function () {
            showPlaceholder(elem);
        };
    }

    // Functions that are used as a event handlers when the hide-on-input behaviour has been activated - very basic implementation of the "input" event
    function makeKeydownHandler(elem) {
        return function (e) {
            keydownVal = elem.value;

            //Prevent the use of the arrow keys (try to keep the cursor before the placeholder)
            if (elem.getAttribute(ATTR_ACTIVE) === "true") {
                if (keydownVal === elem.getAttribute(ATTR_CURRENT_VAL) && Utils.inArray(badKeys, e.keyCode)) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    return false;
                }
            }
        };
    }
    function makeKeyupHandler(elem) {
        return function () {
            var type;

            if (elem.getAttribute(ATTR_ACTIVE) === "true" && elem.value !== keydownVal) {

                // Remove the placeholder
                elem.className = elem.className.replace(classNameRegExp, "");
                elem.value = elem.value.replace(elem.getAttribute(ATTR_CURRENT_VAL), "");
                elem.setAttribute(ATTR_ACTIVE, false);

                // If the type of element needs to change, change it (e.g. password inputs)
                type = elem.getAttribute(ATTR_INPUT_TYPE);
                if (type) {
                    elem.type = type;
                }
            }

            // If the element is now empty we need to show the placeholder
            if (elem.value === "") {
                elem.blur();
                Utils.moveCaret(elem, 0);
            }
        };
    }
    function makeClickHandler(elem) {
        return function () {
            if (elem === document.activeElement && elem.value === elem.getAttribute(ATTR_CURRENT_VAL) && elem.getAttribute(ATTR_ACTIVE) === "true") {
                Utils.moveCaret(elem, 0);
            }
        };
    }

    // Returns a function that is used as a submit event handler on form elements that have children affected by this polyfill
    function makeSubmitHandler(form) {
        return function () {

            // Turn off placeholders on all appropriate descendant elements
            disablePlaceholders(form);
        };
    }

    // Bind event handlers to an element that we need to affect with the polyfill
    function newElement(elem) {

        // If the element is part of a form, make sure the placeholder string is not submitted as a value
        if (elem.form) {
            form = elem.form;

            // Set a flag on the form so we know it's been handled (forms can contain multiple inputs)
            if (!form.getAttribute(ATTR_FORM_HANDLED)) {
                Utils.addEventListener(form, "submit", makeSubmitHandler(form));
                form.setAttribute(ATTR_FORM_HANDLED, "true");
            }
        }

        // Bind event handlers to the element so we can hide/show the placeholder as appropriate
        Utils.addEventListener(elem, "focus", makeFocusHandler(elem));
        Utils.addEventListener(elem, "blur", makeBlurHandler(elem));

        // If the placeholder should hide on input rather than on focus we need additional event handlers
        if (hideOnInput) {
            Utils.addEventListener(elem, "keydown", makeKeydownHandler(elem));
            Utils.addEventListener(elem, "keyup", makeKeyupHandler(elem));
            Utils.addEventListener(elem, "click", makeClickHandler(elem));
        }

        // Remember that we've bound event handlers to this element
        elem.setAttribute(ATTR_EVENTS_BOUND, "true");
        elem.setAttribute(ATTR_CURRENT_VAL, placeholder);

        // If the element doesn't have a value, set it to the placeholder string
        showPlaceholder(elem);
    }

    Placeholders.nativeSupport = test.placeholder !== void 0;

    if (!Placeholders.nativeSupport) {

        // Get references to all the input and textarea elements currently in the DOM (live NodeList objects to we only need to do this once)
        inputs = document.getElementsByTagName("input");
        textareas = document.getElementsByTagName("textarea");

        // Get any settings declared as data-* attributes on the root element (currently the only options are whether to hide the placeholder on focus or input and whether to auto-update)
        hideOnInput = root.getAttribute(ATTR_OPTION_FOCUS) === "false";
        liveUpdates = root.getAttribute(ATTR_OPTION_LIVE) !== "false";

        // Create style element for placeholder styles (instead of directly setting style properties on elements - allows for better flexibility alongside user-defined styles)
        styleElem = document.createElement("style");
        styleElem.type = "text/css";

        // Create style rules as text node
        styleRules = document.createTextNode("." + placeholderClassName + " { color:" + placeholderStyleColor + "; }");

        // Append style rules to newly created stylesheet
        if (styleElem.styleSheet) {
            styleElem.styleSheet.cssText = styleRules.nodeValue;
        } else {
            styleElem.appendChild(styleRules);
        }

        // Prepend new style element to the head (before any existing stylesheets, so user-defined rules take precedence)
        head.insertBefore(styleElem, head.firstChild);

        // Set up the placeholders
        for (i = 0, len = inputs.length + textareas.length; i < len; i++) {
            elem = i < inputs.length ? inputs[i] : textareas[i - inputs.length];

            // Get the value of the placeholder attribute, if any. IE10 emulating IE7 fails with getAttribute, hence the use of the attributes node
            placeholder = elem.attributes.placeholder;
            if (placeholder) {

                // IE returns an empty object instead of undefined if the attribute is not present
                placeholder = placeholder.nodeValue;

                // Only apply the polyfill if this element is of a type that supports placeholders, and has a placeholder attribute with a non-empty value
                if (placeholder && Utils.inArray(validTypes, elem.type)) {
                    newElement(elem);
                }
            }
        }

        // If enabled, the polyfill will repeatedly check for changed/added elements and apply to those as well
        timer = setInterval(function () {
            for (i = 0, len = inputs.length + textareas.length; i < len; i++) {
                elem = i < inputs.length ? inputs[i] : textareas[i - inputs.length];

                // Only apply the polyfill if this element is of a type that supports placeholders, and has a placeholder attribute with a non-empty value
                placeholder = elem.attributes.placeholder;
                if (placeholder) {
                    placeholder = placeholder.nodeValue;
                    if (placeholder && Utils.inArray(validTypes, elem.type)) {

                        // If the element hasn't had event handlers bound to it then add them
                        if (!elem.getAttribute(ATTR_EVENTS_BOUND)) {
                            newElement(elem);
                        }

                        // If the placeholder value has changed or not been initialised yet we need to update the display
                        if (placeholder !== elem.getAttribute(ATTR_CURRENT_VAL) || (elem.type === "password" && !elem.getAttribute(ATTR_INPUT_TYPE))) {

                            // Attempt to change the type of password inputs (fails in IE < 9)
                            if (elem.type === "password" && !elem.getAttribute(ATTR_INPUT_TYPE) && Utils.changeType(elem, "text")) {
                                elem.setAttribute(ATTR_INPUT_TYPE, "password");
                            }

                            // If the placeholder value has changed and the placeholder is currently on display we need to change it
                            if (elem.value === elem.getAttribute(ATTR_CURRENT_VAL)) {
                                elem.value = placeholder;
                            }

                            // Keep a reference to the current placeholder value in case it changes via another script
                            elem.setAttribute(ATTR_CURRENT_VAL, placeholder);
                        }
                    }
                }
            }

            // If live updates are not enabled cancel the timer
            if (!liveUpdates) {
                clearInterval(timer);
            }
        }, 100);
    }

    // Expose public methods
    Placeholders.disable = Placeholders.nativeSupport ? noop : disablePlaceholders;
    Placeholders.enable = Placeholders.nativeSupport ? noop : enablePlaceholders;

}(this));
/*jslint unparam: true, browser: true, indent: 2 */


;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.abide = {
    name : 'abide',

    version : '4.3.0',

    settings : {
      live_validate : true,
      focus_on_invalid : true,
      timeout : 1000,
      patterns : {
        alpha: /[a-zA-Z]+/,
        alpha_numeric : /[a-zA-Z0-9]+/,
        integer: /-?\d+/,
        number: /-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?/,

        // generic password: upper-case, lower-case, number/special character, and min 8 characters
        password : /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,

        // amex, visa, diners
        card : /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
        cvv : /^([0-9]){3,4}$/,

        // http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
        email : /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,

        url: /(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/,
        // abc.de
        domain: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/,

        datetime: /([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))/,
        // YYYY-MM-DD
        date: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/,
        // HH:MM:SS
        time : /(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}/,
        dateISO: /\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/,
        // MM/DD/YYYY
        month_day_year : /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/,

        // #FFF or #FFFFFF
        color: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
      }
    },

    timer : null,

    init : function (scope, method, options) {
      if (typeof method === 'object') {
        $.extend(true, this.settings, method);
      }

      if (typeof method !== 'string') {
        if (!this.settings.init) { this.events(); }

      } else {
        return this[method].call(this, options);
      }
    },

    events : function () {
      var self = this,
          forms = $('form[data-abide]', this.scope).attr('novalidate', 'novalidate');

      forms
        .on('submit validate', function (e) {
          return self.validate($(this).find('input, textarea, select').get(), e);
        });

      this.settings.init = true;

      if (!this.settings.live_validate) return;

      forms
        .find('input, textarea, select')
        .on('blur change', function (e) {
          self.validate([this], e);
        })
        .on('keydown', function (e) {
          clearTimeout(self.timer);
          self.timer = setTimeout(function () {
            self.validate([this], e);
          }.bind(this), self.settings.timeout);
        });
    },

    validate : function (els, e) {
      var validations = this.parse_patterns(els),
          validation_count = validations.length,
          form = $(els[0]).closest('form');

      while (validation_count--) {
        if (!validations[validation_count] && /submit/.test(e.type)) {
          if (this.settings.focus_on_invalid) els[validation_count].focus();
          form.trigger('invalid');
          $(els[validation_count]).closest('form').attr('data-invalid', '');
          return false;
        }
      }

      if (/submit/.test(e.type)) {
        form.trigger('valid');
      }

      form.removeAttr('data-invalid');

      return true;
    },

    parse_patterns : function (els) {
      var count = els.length,
          el_patterns = [];

      for (var i = count - 1; i >= 0; i--) {
        el_patterns.push(this.pattern(els[i]));
      }

      return this.check_validation_and_apply_styles(el_patterns);
    },

    pattern : function (el) {
      var type = el.getAttribute('type'),
          required = typeof el.getAttribute('required') === 'string';

      if (this.settings.patterns.hasOwnProperty(type)) {
        return [el, this.settings.patterns[type], required];
      }

      var pattern = el.getAttribute('pattern') || '';

      if (this.settings.patterns.hasOwnProperty(pattern) && pattern.length > 0) {
        return [el, this.settings.patterns[pattern], required];
      } else if (pattern.length > 0) {
        return [el, new RegExp(pattern), required];
      }

      pattern = /.*/;

      return [el, pattern, required];
    },

    check_validation_and_apply_styles : function (el_patterns) {
      var count = el_patterns.length,
          validations = [];

      for (var i = count - 1; i >= 0; i--) {
        var el = el_patterns[i][0],
            required = el_patterns[i][2],
            value = el.value,
            is_radio = el.type === "radio",
            valid_length = (required) ? (el.value.length > 0) : true;

        if (is_radio && required) {
          validations.push(this.valid_radio(el, required));
        } else {
          if (el_patterns[i][1].test(value) && valid_length ||
            !required && el.value.length < 1) {
            $(el).removeAttr('data-invalid').parent().removeClass('error');
            validations.push(true);
          } else {
            $(el).attr('data-invalid', '').parent().addClass('error');
            validations.push(false);
          }
        }
      }

      return validations;
    },

    valid_radio : function (el, required) {
      var name = el.getAttribute('name'),
          group = document.getElementsByName(name),
          count = group.length,
          valid = false;

      for (var i=0; i < count; i++) {
        if (group[i].checked) valid = true;
      }

      for (var i=0; i < count; i++) {
        if (valid) {
          $(group[i]).removeAttr('data-invalid').parent().removeClass('error');
        } else {
          $(group[i]).attr('data-invalid', '').parent().addClass('error');
        }
      }

      return valid;
    }
  };
}(Foundation.zj, this, this.document));
/*
















*/
;
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






$(document).foundation();
