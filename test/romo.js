(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

require("./api/array.js");

require("./api/bind.js");

require("./api/define.js");

require("./api/dom_query.js");

require("./api/dom_mutate.js");

require("./api/events.js");

},{"./api/array.js":2,"./api/bind.js":3,"./api/define.js":4,"./api/dom_mutate.js":5,"./api/dom_query.js":6,"./api/events.js":7}],2:[function(require,module,exports){
/* eslint-disable no-multi-spaces */
Romo.array =
  function(value) {
    // Short-circuit for jQuery element sets. This ensures these values are fast
    // and don't run through all of the logic to detect if the value is like an
    // array. Keep each item in the Array a jQuery-wrapped element.
    if (Romo.env.hasJQuery && value instanceof window.jQuery) {
      return Array.prototype.slice.call(value).map(function(element) {
        return $(element)
      })
    }

    // Short-circuit for NodeList, HTMLCollection, or actual array values. This
    // ensures these values are fast and don't run through all of the logic to
    // detect if the value is like an array.
    var valString = Object.prototype.toString.call(value)
    if (
      valString === '[object NodeList]'       ||
      valString === '[object HTMLCollection]' ||
      Array.isArray(value)
    ) {
      return Array.prototype.slice.call(value)
    }

    // Short-circuit passing individual elements and "not truthy" values. This
    // ensures these values are fast and don't run through all of the logic to
    // detect if the value is like an array. This also handles passing in null
    // or undefined values.
    if (!value || (typeof value.nodeType) === 'number') {
      return [value]
    }

    const object = Object(value)
    var length
    if (!!object && 'length' in object) {
      length = object.length
    }

    // Some browsers return 'function' for HTML elements.
    const isFunction =
      (
        (typeof object)          === 'function' &&
        (typeof object.nodeType) !== 'number'
      )
    const likeArray = (
      (typeof value) !== 'string' &&
      !isFunction                 &&
      object !== window           &&
      object !== document         &&
      (
        Array.isArray(object) ||
        length === 0          ||
        (
          (typeof length) === 'number' &&
          length > 0                   &&
          (length - 1) in object
        )
      )
    )

    return (likeArray ? Array.prototype.slice.call(value) : [value])
  }
/* eslint-enable no-multi-spaces */

},{}],3:[function(require,module,exports){
Romo.bind =
  function(fn, context) {
    return Romo.fid(context ? fn.bind(context) : fn)
  }

Romo.fid =
  function(fn, { aliasFn } = {}) {
    if (!fn._romofid) {
      fn._romofid = Romo.getFid(aliasFn) || Romo.env.currentFid++
    }

    return fn
  }

Romo.getFid =
  function(fn) {
    return (fn || {})._romofid
  }

Romo.eid =
  function(element, { aliasElement } = {}) {
    if (!element._romoeid) {
      element._romoeid = Romo.getEid(aliasElement) || Romo.env.currentEid++
    }

    return element
  }

Romo.getEid =
  function(element) {
    return (element || {})._romoeid
  }

},{}],4:[function(require,module,exports){
(function (global){(function (){
// This is a convenience function for parsing string namespaces and
// automatically generating nested namespace objects. It takes an optional
// `blockFunction` callback that gets passes the generated namespace object.
// Use this to define namespaced classes.
//
// Usage example:
// Romo.namespace('Some.Deep.Namespace', function(ns) {
//   ns.MyClass = class {
//     constructor() {
//       // contructor logic goes here
//     }
//
//     somePublicMethod() {
//     }
//
//     // Private
//
//     _somePrivateMethod() {
//     }
//   }
// })
//
// new Some.Deep.Namespace.MyClass()
Romo.namespace =
  function(namespaceString, blockFunction) {
    const parts =
      namespaceString.split('.').filter(function(part) { return part.length > 0 })
    var parent = global
    var i

    for (i = 0; i < parts.length; i++) {
      // create a property if it doesnt exist
      if (typeof parent[parts[i]] === 'undefined') {
        parent[parts[i]] = {}
      }
      parent = parent[parts[i]]
    }

    if (blockFunction !== undefined) {
      blockFunction(parent)
    }
    return parent
  }

// This is a convenience function defining namespaced objects in an
// idempotent way. It takes a namespaced object name and, if that object
// is not already defined, calls a function that is expected to return the
// object. It composes `Romo.namespace` for handling the object namespace.
//
// Use this to define namespaced classes and ensure the class is only
// evaluated once (even across split packs when using Webpacker). This is
// used to define SC components since they will be typically imported in all
// of the packs.
//
// Usage example:
// Romo.define('Some.Object', function() {
//   return class {
//     constructor() {
//       // contructor logic goes here
//     }
//
//     somePublicMethod() {
//     }
//
//     // Private
//
//     _somePrivateMethod() {
//     }
//   }
// })
//
// new Some.Object()
Romo.define =
  function(namespacedObjectName, objectFunction) {
    const parts = namespacedObjectName.split('.')
    var object = parts.reduce(function(object, part) {
      return (object === undefined ? object : object[part])
    }, global)

    if (!object || typeof object === 'object') {
      const namespaceString = parts.slice(0, -1).join('.')
      const objectName = parts[parts.length - 1]

      Romo.namespace(namespaceString, function(ns) {
        ns[objectName] = objectFunction()
        ns[objectName].prototype.class = ns[objectName]
        ns[objectName].wrap = Romo.wrapMethod(ns[objectName])

        if (object) {
          for (const [key, value] of Object.entries(object)) {
            ns[objectName][key] = value
          }
        }
        object = ns[objectName]
      })
    }

    return object
  }

// This returns a function, bound to the given `objectClass`, for wrapping
// items in a list with the JS Class `objectClass`. The behavior is identical
// to the `BaseViewModel.wrap` Ruby equivalent.
//
// Usage example:
// Romo.define('Some.Object', function() {
//   return class {
//     constructor(
//       value,
//       { thing } = {}
//     ) {
//       this.value = value
//       this.thing = thing
//     }
//   }
// })
//
// var list = [1, 2, 3]
// var object_list = Some.Object.wrap(list, { thing: "SOME_THING1" })
// object_list[0].class // => Some.Objet
// object_list[0].value // => 1
// object_list[0].thing // => "SOME_THING1"
// object_list[1].value // => 2
// object_list[1].thing // => "SOME_THING1"
// object_list[2].value // => 3
// object_list[2].thing // => "SOME_THING1"
Romo.wrapMethod =
  function(objectClass) {
    return (
      Romo.bind(function(list, args) {
        return Romo.array(list).map(Romo.bind(function(item) {
          return new this(item, args)
        }, this))
      }, objectClass)
    )
  }

// This memoizes the return value of the given fnValue function.
//
// @example:
//   get value() {
//     return Romo.memoize(this, 'value', function() {
//       return 'EXPENSIVE_CALCULATED_VALUE'
//     })
//   }
Romo.memoize =
  function(receiver, key, fnValue) {
    if (receiver._scMemoizeCache === undefined) {
      receiver._scMemoizeCache = {}
    }

    if (receiver._scMemoizeCache[key] === undefined) {
      receiver._scMemoizeCache[key] = Romo.bind(fnValue, receiver)()
    }
    return receiver._scMemoizeCache[key]
  }

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
Romo.remove =
  function(elements) {
    return Romo.array(elements).map(function(element) {
      if (element.parentElement) {
        element.parentElement.removeChild(element)
      }
      return element
    })
  }

Romo.removeChildren =
  function(parentElements) {
    return Romo.array(parentElements).map(function(parentElement) {
      Romo.children(parentElement).forEach(function(childElement) {
        parentElement.removeChild(childElement)
      })
      return parentElement
    })
  }

Romo.replace =
  function(element, replacementElement) {
    element.parentElement.replaceChild(replacementElement, element)
    return Romo.env.applyAutoInitTo(replacementElement)
  }

Romo.replaceHTML =
  function(element, htmlString) {
    const replacementElement = Romo.elements(htmlString)[0]
    if (!replacementElement) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.replace(element, replacementElement)
  }

Romo.update =
  function(element, childElements) {
    Romo.clearHTML(element)
    return Romo.array(childElements).map(function(childElement) {
      element.appendChild(childElement)
      return Romo.env.applyAutoInitTo(childElement)
    })
  }

Romo.updateHTML =
  function(element, htmlString) {
    if (typeof htmlString === 'string' && htmlString.trim() === '') {
      return Romo.clearHTML(element)
    }

    const childElements = Romo.elements(htmlString)
    if (childElements.length === 0) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.update(element, childElements)
  }

Romo.updateText =
  function(element, textString) {
    element.innerText = textString
    return element
  }

Romo.clearHTML =
  function(elements) {
    Romo.array(elements).forEach(function(element) {
      element.innerHTML = ''
    })
    return elements
  }

Romo.prepend =
  function(element, childElements) {
    var referenceElement = element.firstChild
    return (
      Romo
        .array(childElements)
        .reverse()
        .map(function(childElement) {
          referenceElement =
            element.insertBefore(childElement, referenceElement)
          return Romo.env.applyAutoInitTo(referenceElement)
        })
        .reverse()
    )
  }

Romo.prependHtml =
  function(element, htmlString) {
    const childElements = Romo.elements(htmlString)
    if (childElements.length === 0) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.prepend(element, childElements)
  }

Romo.append =
  function(element, childElements) {
    return (
      Romo
        .array(childElements)
        .map(function(childElement) {
          element.appendChild(childElement)
          return Romo.env.applyAutoInitTo(childElement)
        })
    )
  }

Romo.appendHtml =
  function(element, htmlString) {
    const childElements = Romo.elements(htmlString)
    if (childElements.length === 0) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.append(element, childElements)
  }

Romo.before =
  function(element, siblingElements) {
    const parentElement = element.parentElement
    var referenceElement = element
    return (
      Romo
        .array(siblingElements)
        .reverse()
        .map(function(siblingElement) {
          referenceElement =
            parentElement.insertBefore(siblingElement, referenceElement)
          return Romo.env.applyAutoInitTo(referenceElement)
        })
        .reverse()
    )
  }

Romo.beforeHtml =
  function(element, htmlString) {
    const siblingElements = Romo.elements(htmlString)
    if (siblingElements.length === 0) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.before(element, siblingElements)
  }

Romo.after =
  function(element, siblingElements) {
    const parentElement = element.parentElement
    var referenceElement = Romo.next(element)
    return (
      Romo
        .array(siblingElements)
        .map(function(siblingElement) {
          parentElement.insertBefore(siblingElement, referenceElement)
          return Romo.env.applyAutoInitTo(siblingElement)
        })
    )
  }

Romo.afterHtml =
  function(element, htmlString) {
    const siblingElements = Romo.elements(htmlString)
    if (siblingElements.length === 0) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.after(element, siblingElements)
  }

},{}],6:[function(require,module,exports){
Romo.elements =
  function(htmlString) {
    var context = document.implementation.createHTMLDocument('')

    // Set the base href for the created document so any parsed
    // elements with URLs are based on the document's URL
    var base = context.createElement('base')
    base.href = document.location.href
    context.head.appendChild(base)

    var results = Romo.env.elementTagNameRegex.exec(htmlString)
    if (!results) {
      return []
    }

    var tagName = results[1].toLowerCase()
    var wrap = Romo.env.elementWrapMap[tagName]
    if (!wrap) {
      context.body.innerHTML = htmlString
      return Romo.array(context.body.children)
    } else {
      context.body.innerHTML = wrap[1] + htmlString + wrap[2]
      var parentElement = context.body
      var i = wrap[0]
      while (i-- !== 0) {
        parentElement = parentElement.lastChild
      }
      return Romo.array(parentElement.children)
    }
  }

Romo.f =
  function(selector) {
    return Romo.array(document.querySelectorAll(selector))
  }

Romo.find =
  function(parentElements, selector) {
    return (
      Romo.array(parentElements).reduce(function(foundElements, parentElement) {
        return foundElements.concat(
          Romo.array(parentElement.querySelectorAll(selector))
        )
      }, [])
    )
  }

Romo.is =
  function(element, selector) {
    return (
      element.matches ||
      element.matchesSelector ||
      element.msMatchesSelector ||
      element.mozMatchesSelector ||
      element.webkitMatchesSelector ||
      element.oMatchesSelector
    ).call(element, selector)
  }

Romo.children =
  function(parentElement, selector) {
    var childElements = Romo.array(parentElement.children)
    if (selector) {
      return childElements.filter(function(childElement) {
        return Romo.is(childElement, selector)
      })
    } else {
      return childElements
    }
  }

Romo.parent =
  function(childElement) {
    return childElement.parentElement
  }

Romo.parents =
  function(childElement, selector) {
    var parentElement = Romo.parent(childElement)
    if (parentElement && parentElement !== document) {
      if (!selector || Romo.is(parentElement, selector)) {
        if (Romo.is(parentElement, 'body')) {
          return [parentElement]
        } else {
          return [parentElement].concat(Romo.parents(parentElement, selector))
        }
      } else {
        if (Romo.is(parentElement, 'body')) {
          return []
        } else {
          return Romo.parents(parentElement, selector)
        }
      }
    } else {
      return []
    }
  }

// Get the closest ancestor element that is scrollable. This mimics jQuery
// UI's `.scrollParent`. See https://api.jqueryui.com/scrollParent/.
Romo.scrollableParent =
  function(childElement) {
    if (Romo.env.isAScrollableElement(childElement)) {
      return childElement
    } else {
      return Romo.scrollableParent(Romo.parent(childElement))
    }
  }

// Get all ancestor elements that are scrollable.
Romo.scrollableParents =
  function(childElement, selector) {
    return (
      Romo
        .parents(childElement, selector)
        .filter(function(parentElement) {
          return Romo.env.isAScrollableElement(parentElement)
        })
    )
  }

Romo.closest =
  function(fromElement, selector) {
    if (fromElement.closest) {
      return fromElement.closest(selector)
    } else if (Romo.is(fromElement, selector)) {
      return fromElement
    } else if (fromElement.parentElement) {
      return Romo.closest(fromElement.parentElement, selector)
    } else {
      return null
    }
  }

Romo.siblings =
  function(element, selector) {
    return (
      Romo
        .children(Romo.parent(element), selector)
        .filter(function(childElement) { return childElement !== element })
    )
  }

Romo.prev =
  function(fromElement, selector) {
    const prevElement = fromElement.previousElementSibling

    if (!selector || Romo.is(prevElement, selector)) {
      return prevElement
    } else {
      return Romo.prev(prevElement, selector)
    }
  }

Romo.next =
  function(fromElement, selector) {
    const nextElement = fromElement.nextElementSibling

    if (!selector || Romo.is(nextElement, selector)) {
      return nextElement
    } else {
      return Romo.next(nextElement, selector)
    }
  }

},{}],7:[function(require,module,exports){
Romo.on =
  function(elements, eventName, eventHandlerFn) {
    const listenerFn =
      function(e) {
        const args = e.detail === undefined ? [e] : [e].concat(e.detail)
        const result = eventHandlerFn.apply(e.target, args)

        if (result === false) {
          e.preventDefault()
          e.stopPropagation()
        }

        return result
      }
    Romo.fid(eventHandlerFn)
    Romo.fid(listenerFn, { aliasFn: eventHandlerFn })

    Romo.array(elements).forEach(Romo.bind(function(element) {
      Romo.env.addEventListener(element, eventName, listenerFn)
    }, this))
  }

Romo.off =
  function(elements, eventName, eventHandlerFn) {
    Romo.array(elements).forEach(Romo.bind(function(element) {
      Romo.env.removeEventListener(element, eventName, eventHandlerFn)
    }, this))
  }

Romo.trigger =
  function(elements, customEventName, args) {
    const event =
      new CustomEvent(customEventName, { bubbles: false, detail: args })

    Romo.array(elements).forEach(function(element) {
      element.dispatchEvent(event)
    })
  }

Romo.proxyEvent =
  function({ fromElement, toElement, fromEventName, toEventName, toArgs } = {}) {
    Romo.on(fromElement, fromEventName, Romo.bind(function(e, ...eventArgs) {
      Romo.trigger(toElement, toEventName, (toArgs || []).concat(eventArgs || []))
    }, this))
  }

Romo.onReady =
  function(eventHandlerFn) {
    if (document.readyState === 'complete' || document.readyState !== 'loading') {
      eventHandlerFn()
    } else {
      Romo.on(document, 'DOMContentLoaded', eventHandlerFn)
    }
  }

// This pushes (delays) executing the given function until the end of the
// current reactor stack (including other event handlers that have yet to run).
// Note: this is a hack using `delayFn(1, fn)`. Ideally the js engine API will
// someday provide a native way to push something to the end of the reactor
// stack.
Romo.pushFn =
  function(fn) {
    Romo.delayFn(1, fn)
  }

// This delays executing the given function for the given milliseconds.
Romo.delayFn =
  function(delayMs, fn) {
    setTimeout(fn, delayMs)
  }

},{}],8:[function(require,module,exports){
if (window.Romo === undefined) {
  window.Romo = {}
}

class RomoEnv {
  constructor() {
    this.currentFid = 1
    this.currentEid = 1

    this.elementTagNameRegex = /<([a-z0-9-]+)[\s\/>]+/i
    this.elementWrapMap =
      /* eslint-disable no-multi-spaces */
      {
        caption:  [1, '<table>',            '</table>'],
        colgroup: [1, '<table>',            '</table>'],
        col:      [2, '<table><colgroup>',  '</colgroup></table>'],
        thead:    [1, '<table>',            '</table>'],
        tbody:    [1, '<table>',            '</table>'],
        tfoot:    [1, '<table>',            '</table>'],
        tr:       [2, '<table><tbody>',     '</tbody></table>'],
        th:       [3, '<table><tbody><tr>', '</tr></tbody></table>'],
        td:       [3, '<table><tbody><tr>', '</tr></tbody></table>'],
      }
      /* eslint-enable no-multi-spaces */

    this.overflowScrollableRegex = /(auto|scroll)/
    this.hasJQuery = (typeof window.jQuery === 'function')
  }

  get eventListeners() {
    return Romo.memoize(this, 'eventListeners', function() {
      return new Romo.EventListeners()
    })
  }

  get autoInit() {
    return Romo.memoize(this, 'autoInit', function() {
      return new Romo.AutoInit()
    })
  }

  setup() {
    if (this._hasBeenSetup !== true) {
      // TODO: add setup logic here.

      this._hasBeenSetup = true
    }
  }

  addEventListener(element, eventName, listenerFn) {
    this.eventListeners.add(element, eventName, listenerFn)
  }

  removeEventListener(element, eventName, listenerFn) {
    this.eventListeners.remove(element, eventName, listenerFn)
  }

  addAutoInitSelector(selector, componentClass) {
    this.autoInit.addSelector(selector, componentClass)
  }

  applyAutoInitTo(elements) {
    this.autoInit.applyTo(elements)
  }

  isAScrollableElement(element) {
    return (
      (element.tagName.toLowerCase() === 'html') ||
      this.overflowScrollableRegex.test(Romo.css(element, 'overflow')) ||
      this.overflowScrollableRegex.test(Romo.css(element, 'overflow-y')) ||
      this.overflowScrollableRegex.test(Romo.css(element, 'overflow-x'))
    )
  }

  /* eslint-disable no-multi-spaces */
  decodeDataValue(value) {
    try {
      if (value === 'true')      { return true              } // "true"       => true
      if (value === 'false')     { return false             } // "false"      => false
      if (value === 'undefined') { return undefined         } // "undefined"  => undefined
      if (value === 'null')      { return null              } // "null"       => null
      if (value === null)        { return undefined         } // null         => undefined
      if (+value + '' === value) { return +value            } // "42.5"       => 42.5
      if (/^[\[\{]/.test(value)) { return JSON.parse(value) } // JSON         => parse if valid
      return value                                            // String       => self
    } catch {
      return value
    }
  }
  /* eslint-enable no-multi-spaces */
}

Romo.setup =
  function() {
    Romo.onReady(Romo.bind(function(e) { Romo.env.setup() }, this))
  }

Romo.addAutoInitSelector =
  function(selector, componentClass) {
    Romo.env.addAutoInitSelector(selector, componentClass)
  }

Romo.env = new RomoEnv()

},{}],9:[function(require,module,exports){
"use strict";

require("./env.js");

require("./api.js");

require("./utilities.js");

Romo.setup();

},{"./api.js":1,"./env.js":8,"./utilities.js":10}],10:[function(require,module,exports){
"use strict";

require("./utilities/auto_init.js");

require("./utilities/event_listeners.js");

},{"./utilities/auto_init.js":11,"./utilities/event_listeners.js":12}],11:[function(require,module,exports){
Romo.define('Romo.AutoInit', function() {
  return class {
    constructor() {
      this.componentClasses = {}
    }

    addSelector(selector, componentClass) {
      if (!this.componentClasses[selector]) {
        this.componentClasses[selector] = componentClass
      } else if (this.componentClasses[selector] !== componentClass) {
        throw new Error(
          `RuntimeError: attempting to override "${selector}" ` +
          `(${this.componentClasses[selector]}) with ${componentClass}.`
        )
      }

      return componentClass
    }

    find(parentElements, selector) {
      return (
        Romo
          .array(parentElements)
          .filter(function(onElement) {
            return Romo.is(onElement, selector)
          })
          .concat(Romo.find(parentElements, selector))
      )
    }

    applyTo(elements) {
      for (var selector in this.componentClasses) {
        this.find(elements, selector).forEach(Romo.bind(function(element) {
          new this.componentClasses[selector](element)
        }, this))
      }
      return elements
    }
  }
})

},{}],12:[function(require,module,exports){
Romo.define('Romo.EventListeners', function() {
  return class {
    constructor() {
      this.fns = {}
    }

    static key(element, eventName, fn) {
      Romo.eid(element)
      Romo.fid(fn)

      return (
        `--eid--${Romo.getEid(element)}--${eventName}--fid--${Romo.getFid(fn)}--`
      )
    }

    add(element, eventName, fn) {
      const key = this.class.key(element, eventName, fn)

      if (!this.fns[key]) {
        this.fns[key] = []
      }

      element.addEventListener(eventName, fn)
      this.fns[key].push(fn)
    }

    remove(element, eventName, fn) {
      const key = this.class.key(element, eventName, fn)

      if (!this.fns[key]) {
        this.fns[key] = []
      }

      this.fns[key].forEach(function(fn) {
        element.removeEventListener(eventName, fn)
      })
      this.fns[key] = []
    }
  }
})

},{}]},{},[9]);
