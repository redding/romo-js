(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

require("./api/array.js");

require("./api/bind.js");

require("./api/define.js");

require("./api/dom_attributes.js");

require("./api/dom_events.js");

require("./api/dom_mutate.js");

require("./api/dom_query.js");

require("./api/page.js");

require("./api/xhr.js");

},{"./api/array.js":2,"./api/bind.js":3,"./api/define.js":4,"./api/dom_attributes.js":5,"./api/dom_events.js":6,"./api/dom_mutate.js":7,"./api/dom_query.js":8,"./api/page.js":9,"./api/xhr.js":10}],2:[function(require,module,exports){
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
    Romo.fid(fn)
    if (context) {
      return Romo.fid(fn.bind(context), { aliasFn: fn })
    } else {
      return fn
    }
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
        ns[objectName].prototype.className = namespacedObjectName
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
// TODO add DOM support
Romo.attr =
  function(element, attributeName) {
    return Romo.dom(element).firstElement.getAttribute(attributeName)
  }

Romo.setAttr =
  function(elements, attributeName, attributeValue) {
    const value = String(attributeValue)
    Romo.dom(elements).forEach(function(element) {
      element.setAttribute(attributeName, value)
    })
    return elements
  }

Romo.rmAttr =
  function(elements, attributeName) {
    Romo.dom(elements).forEach(function(element) {
      element.removeAttribute(attributeName)
    })
    return elements
  }

Romo.data =
  function(element, dataName) {
    return Romo.env.decodeDataValue(Romo.attr(element, `data-${dataName}`))
  }

Romo.setData =
  function(elements, dataName, dataValue) {
    return Romo.setAttr(elements, `data-${dataName}`, dataValue)
  }

Romo.rmData =
  function(elements, dataName) {
    return Romo.rmAttr(elements, `data-${dataName}`)
  }

Romo.style =
  function(element, styleName) {
    return Romo.dom(element).firstElement.style[styleName]
  }

Romo.setStyle =
  function(elements, styleName, styleValue) {
    Romo.dom(elements).forEach(function(element) {
      element.style[styleName] = styleValue
    })
    return elements
  }

Romo.rmStyle =
  function(elements, styleName) {
    Romo.dom(elements).forEach(function(element) {
      element.style[styleName] = ''
    })
    return elements
  }

Romo.css =
  function(element, styleName) {
    return (
      window
        .getComputedStyle(Romo.dom(element).firstElement, null)
        .getPropertyValue(styleName)
    )
  }

Romo.hasClass =
  function(element, className) {
    return Romo.dom(element).firstElement.classList.contains(className)
  }

Romo.addClass =
  function(elements, className) {
    const splitClassNames =
      className.split(' ').filter(function(n) { return n })
    Romo.dom(elements).forEach(function(element) {
      splitClassNames.forEach(function(splitClassName) {
        element.classList.add(splitClassName)
      })
    })
    return elements
  }

Romo.rmClass =
  function(elements, className) {
    const splitClassNames =
      className.split(' ').filter(function(n) { return n })
    Romo.dom(elements).forEach(function(element) {
      splitClassNames.forEach(function(splitClassNames) {
        element.classList.remove(splitClassNames)
      })
    })
    return elements
  }

Romo.toggleClass =
  function(elements, className) {
    const splitClassNames =
      className.split(' ').filter(function(n) { return n })
    Romo.dom(elements).forEach(function(element) {
      splitClassNames.forEach(function(splitClassNames) {
        element.classList.toggle(splitClassNames)
      })
    })
    return elements
  }

Romo.show =
  function(elements) {
    Romo.dom(elements).forEach(function(element) {
      element.style.display = ''
    })
    return elements
  }

Romo.hide =
  function(elements) {
    Romo.dom(elements).forEach(function(element) {
      element.style.display = 'none'
    })
    return elements
  }

// This returns the given element's bounding rectangle. This is used by the
// `rect*` methods and is convenience method for the native call.
Romo.rect =
  function(element) {
    const dom = Romo.dom(element)
    if (dom.firstElement) {
      return dom.firstElement.getBoundingClientRect()
    }
    return { height: 0, width: 0, top: 0, left: 0 }
  }

Romo.height =
  function(element) {
    var heightPx = Romo.rect(element).height
    if (heightPx === 0 && Romo.dom(element).firstElement) {
      heightPx = parseInt(Romo.css(element, 'height'), 10)
    }
    if (isNaN(heightPx)) {
      heightPx = 0
    }

    return heightPx
  }

Romo.width =
  function(element) {
    var widthPx = Romo.rect(element).width
    if (widthPx === 0 && Romo.dom(element).firstElement) {
      widthPx = parseInt(Romo.css(element, 'width'), 10)
    }
    if (isNaN(widthPx)) {
      widthPx = 0
    }

    return widthPx
  }

Romo.offset =
  function(element, relativeToElement) {
    const elementRect = Romo.rect(element)
    const relativeToRect = Romo.rect(relativeToElement || document.body)

    /* eslint-disable no-multi-spaces */
    return {
      top:  elementRect.top  - relativeToRect.top,
      left: elementRect.left - relativeToRect.left,
    }
    /* eslint-enable no-multi-spaces */
  }

Romo.scrollTop =
  function(element) {
    const dom = Romo.dom(element)
    if ('scrollTop' in dom.firstElement) {
      return dom.firstElement.scrollTop
    } else {
      return dom.firstElement.pageYOffset
    }
  }

Romo.scrollLeft =
  function(element) {
    const dom = Romo.dom(element)
    if ('scrollLeft' in dom.firstElement) {
      return dom.firstElement.scrollLeft
    } else {
      return dom.firstElement.pageXOffset
    }
  }

Romo.setScrollTop =
  function(elements, value) {
    Romo.dom(elements).forEach(function(element) {
      if ('scrollTop' in element) {
        element.scrollTop = value
      } else {
        element.scrollTo(element.scrollX, value)
      }
    })
    return elements
  }

Romo.setScrollLeft =
  function(elements, value) {
    Romo.dom(elements).forEach(function(element) {
      if ('scrollLeft' in element) {
        element.scrollLeft = value
      } else {
        element.scrollTo(value, element.scrollY)
      }
    })
    return elements
  }

Romo.zIndex =
  function(element) {
    var value = parseInt(Romo.css(element, 'z-index'), 10)
    if (isNaN(value)) {
      value = 0
    }

    if (value !== 0 || Romo.is(element, 'body')) {
      return value
    } else {
      return Romo.zIndex(Romo.parent(element))
    }
  }

},{}],6:[function(require,module,exports){
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

    Romo.dom(elements).forEach(Romo.bind(function(element) {
      Romo.env.addEventListener(element, eventName, listenerFn)
    }, this))

    return elements
  }

Romo.off =
  function(elements, eventName, eventHandlerFn) {
    Romo.dom(elements).forEach(Romo.bind(function(element) {
      Romo.env.removeEventListener(element, eventName, eventHandlerFn)
    }, this))

    return elements
  }

Romo.trigger =
  function(elements, customEventName, args) {
    const event =
      new CustomEvent(customEventName, { bubbles: false, detail: args })

    Romo.dom(elements).forEach(function(element) {
      // Use pushFn to make event dispatches asynchronous like "native" events
      // (`dispatchEvent` runs event handlers synchronously).
      Romo.pushFn(function() { element.dispatchEvent(event) })
    })

    return elements
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

},{}],7:[function(require,module,exports){
Romo.setInnerText =
  function(element, value) {
    Romo.dom(element).firstElement.innerText = value || ''
  }

Romo.setInnerHTML =
  function(element, value) {
    Romo.dom(element).firstElement.innerHTML = value || ''
  }

Romo.remove =
  function(elements) {
    return Romo.dom(elements).map(function(element) {
      if (element.parentElement) {
        element.parentElement.removeChild(element)
      }
      return element
    })
  }

Romo.removeChildren =
  function(parentElements) {
    return Romo.dom(parentElements).map(function(parentElement) {
      Romo.children(parentElement).forEach(function(childElement) {
        parentElement.removeChild(childElement)
      })
      return parentElement
    })
  }

Romo.replace =
  function(element, replacementElement) {
    const dom = Romo.dom(element)
    const replacementDOM = Romo.dom(replacementElement)
    Romo
      .parent(dom)
      .replaceChild(replacementDOM.firstElement, dom.firstElement)
    return Romo.env.applyAutoInitTo(replacementDOM.firstElement)
  }

Romo.replaceHTML =
  function(element, htmlString) {
    const replacementDOM = Romo.dom(Romo.elements(htmlString))
    if (replacementDOM.length === 0) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.replace(element, replacementDOM)
  }

Romo.update =
  function(element, childElements) {
    const dom = Romo.dom(element)
    const childDOM = Romo.dom(childElements)
    Romo.clearHTML(dom.firstElement)
    return Romo.array(childDOM.elements).map(function(childElement) {
      dom.firstElement.appendChild(childElement)
      return Romo.env.applyAutoInitTo(childElement)
    })
  }

Romo.updateHTML =
  function(element, htmlString) {
    if (typeof htmlString === 'string' && htmlString.trim() === '') {
      return Romo.clearHTML(element)
    }

    const childDOM = Romo.dom(Romo.elements(htmlString))
    if (childDOM.length === 0) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.update(element, childDOM)
  }

Romo.updateText =
  function(element, textString) {
    const dom = Romo.dom(element)
    dom.innerText = textString
    return dom.firstElement
  }

Romo.clearHTML =
  function(elements) {
    const dom = Romo.dom(elements)
    dom.forEach(function(element) { element.innerHTML = '' })
    return dom.elements
  }

Romo.prepend =
  function(element, childElements) {
    const dom = Romo.dom(element)
    const childDOM = Romo.dom(childElements)
    var referenceElement = dom.firstElement.firstChild
    return (
      childDOM
        .reverseMap(function(childElement) {
          referenceElement =
            dom.firstElement.insertBefore(childElement, referenceElement)
          return Romo.env.applyAutoInitTo(referenceElement)
        })
        .reverse()
    )
  }

Romo.prependHTML =
  function(element, htmlString) {
    const childDOM = Romo.dom(Romo.elements(htmlString))
    if (childDOM.length === 0) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.prepend(element, childDOM)
  }

Romo.append =
  function(element, childElements) {
    const dom = Romo.dom(element)
    const childDOM = Romo.dom(childElements)
    return (
      childDOM.map(function(childElement) {
        dom.firstElement.appendChild(childElement)
        return Romo.env.applyAutoInitTo(childElement)
      })
    )
  }

Romo.appendHTML =
  function(element, htmlString) {
    const childDOM = Romo.dom(Romo.elements(htmlString))
    if (childDOM.length === 0) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.append(element, childDOM)
  }

Romo.before =
  function(element, siblingElements) {
    const dom = Romo.dom(element)
    const siblingDOM = Romo.dom(siblingElements)
    const parentElement = Romo.parent(dom)
    var referenceElement = dom.firstElement
    return (
      siblingDOM
        .reverseMap(function(siblingElement) {
          referenceElement =
            parentElement.insertBefore(siblingElement, referenceElement)
          return Romo.env.applyAutoInitTo(referenceElement)
        })
        .reverse()
    )
  }

Romo.beforeHTML =
  function(element, htmlString) {
    const siblingDOM = Romo.dom(Romo.elements(htmlString))
    if (siblingDOM.length === 0) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.before(element, siblingDOM)
  }

Romo.after =
  function(element, siblingElements) {
    const dom = Romo.dom(element)
    const siblingDOM = Romo.dom(siblingElements)
    const parentElement = Romo.parent(dom)
    var referenceElement = Romo.next(element)
    return (
      siblingDOM.map(function(siblingElement) {
        parentElement.insertBefore(siblingElement, referenceElement)
        return Romo.env.applyAutoInitTo(siblingElement)
      })
    )
  }

Romo.afterHTML =
  function(element, htmlString) {
    const siblingDOM = Romo.dom(Romo.elements(htmlString))
    if (siblingDOM.length === 0) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.after(element, siblingDOM)
  }

},{}],8:[function(require,module,exports){
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

Romo.dom =
  function(elements) {
    if (typeof elements === 'object' && elements.isRomoDOM === true) {
      return elements
    } else {
      return new Romo.DOM(elements)
    }
  }

Romo.f =
  function(selector) {
    return Romo.dom(document.querySelectorAll(selector))
  }

Romo.find =
  function(parentElements, selector) {
    return Romo.dom(
      Romo.dom(parentElements).reduce(function(foundElements, parentElement) {
        return foundElements.concat(
          Romo.array(parentElement.querySelectorAll(selector))
        )
      }, [])
    )
  }

Romo.innerText =
  function(element) {
    return Romo.dom(element).firstElement.innerText
  }

Romo.innerHTML =
  function(element) {
    return Romo.dom(element).firstElement.innerHTML
  }

Romo.is =
  function(element, selector) {
    return Romo.dom(element).firstElement.matches(selector)
  }

Romo.children =
  function(parentElement, selector) {
    const childElements =
      Romo.array(Romo.dom(parentElement).firstElement.children)
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
    return Romo.dom(childElement).firstElement.parentElement
  }

Romo.parents =
  function(childElement, selector) {
    var parentElement = Romo.parent(Romo.dom(childElement).firstElement)
    if (parentElement && parentElement !== document) {
      if (!selector || Romo.is(parentElement, selector)) {
        if (Romo.is(parentElement, 'html')) {
          return [parentElement]
        } else {
          return [parentElement].concat(Romo.parents(parentElement, selector))
        }
      } else {
        if (Romo.is(parentElement, 'html')) {
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
    const childDOM = Romo.dom(childElement)
    if (
      !childDOM.firstElement ||
      Romo.env.isAScrollableElement(childDOM.firstElement)
    ) {
      return childDOM.firstElement
    } else {
      return Romo.scrollableParent(Romo.parent(childDOM.firstElement))
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
    return Romo.dom(fromElement).firstElement.closest(selector)
  }

Romo.siblings =
  function(element, selector) {
    const dom = Romo.dom(element)
    return (
      Romo
        .children(Romo.parent(dom.firstElement), selector)
        .filter(function(childElement) {
          return childElement !== dom.firstElement
        })
    )
  }

Romo.prev =
  function(fromElement, selector) {
    const prevElement =
      Romo.dom(fromElement).firstElement.previousElementSibling

    if (!prevElement || !selector || Romo.is(prevElement, selector)) {
      return prevElement
    } else {
      return Romo.prev(prevElement, selector)
    }
  }

Romo.next =
  function(fromElement, selector) {
    const nextElement = Romo.dom(fromElement).firstElement.nextElementSibling

    if (!nextElement || !selector || Romo.is(nextElement, selector)) {
      return nextElement
    } else {
      return Romo.next(nextElement, selector)
    }
  }

},{}],9:[function(require,module,exports){
Romo.reloadPage =
  function() {
    window.location.reload()
  }

Romo.redirectPage =
  function(redirectUrl) {
    window.location = redirectUrl
  }

// Override as desired.
Romo.alert =
  function(alertMessage, { debugMessages, callbackFn } = {}) {
    var message = alertMessage
    var debugs = Romo.array(debugMessages)

    if (debugMessages && debugs.length !== 0) {
      message += `:\n${debugs.join('\n')}`
    }

    console.error(message)

    if (callbackFn) {
      callbackFn()
    }
  }

Romo.alertAndReloadPage =
  function(alertMessage, { debugMessages } = {}) {
    Romo.alert(
      alertMessage,
      {
        debugMessages: debugMessages,
        callbackFn:    function() { Romo.reloadPage() },
      },
    )
  }

// Override as desired.
Romo.showFlashAlerts =
  function(flashAlertObjects) {
    Romo.alert(
      Romo
        .array(flashAlertObjects)
        .map(function(flashAlertObject) {
          return new Romo.FlashAlert(flashAlertObject)
        })
        .filter(function(flashAlert) {
          return flashAlert.isMessagePresent
        })
        .map(function(flashAlert) {
          return flashAlert.toString()
        })
        .join('\n')
    )
  }

},{}],10:[function(require,module,exports){
Romo.xhr =
  function(...args) {
    return new Romo.XMLHttpRequest(...args).doSend()
  }

Romo.urlSearch =
  function(...args) {
    return new Romo.URLSearchParams(...args).toString()
  }

},{}],11:[function(require,module,exports){
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
    return this.autoInit.addSelector(selector, componentClass)
  }

  applyAutoInitTo(elements) {
    return this.autoInit.applyTo(elements)
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

},{}],12:[function(require,module,exports){
"use strict";

require("./env.js");

require("./api.js");

require("./utilities.js");

Romo.setup();

},{"./api.js":1,"./env.js":11,"./utilities.js":13}],13:[function(require,module,exports){
"use strict";

require("./utilities/auto_init.js");

require("./utilities/dom.js");

require("./utilities/event_listeners.js");

require("./utilities/flash_alert.js");

require("./utilities/queue.js");

require("./utilities/url_search_params.js");

require("./utilities/xml_http_request.js");

},{"./utilities/auto_init.js":14,"./utilities/dom.js":15,"./utilities/event_listeners.js":16,"./utilities/flash_alert.js":17,"./utilities/queue.js":18,"./utilities/url_search_params.js":19,"./utilities/xml_http_request.js":20}],14:[function(require,module,exports){
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
        Romo.dom(
          Romo
            .dom(parentElements)
            .filter(function(parentDOM) { return Romo.is(parentDOM, selector) })
            .concat(Romo.find(parentElements, selector))
        )
      )
    }

    applyTo(elements) {
      for (var selector in this.componentClasses) {
        this.find(elements, selector).forEach(Romo.bind(function(element) {
          new this.componentClasses[selector](Romo.dom(element))
        }, this))
      }
      return elements
    }
  }
})

},{}],15:[function(require,module,exports){
Romo.define('Romo.DOM', function() {
  return class {
    constructor(elements) {
      // Accespt nested Romo.DOM instances and flatten to a list of elements.
      this.elements =
        Romo
          .array(elements)
          .reduce(function(acc, element) {
            if (element) {
              return acc.concat(element.isRomoDOM ? element.elements : [element])
            } else {
              return acc
            }
          }, [])
    }

    get isRomoDOM() {
      return true
    }

    get length() {
      return this.elements.length
    }

    get firstElement() {
      return this.elements[0]
    }

    get lastElement() {
      return this.elements[this.elements.length - 1]
    }

    get first() {
      return Romo.dom(this.firstElement)
    }

    get last() {
      return Romo.dom(this.lastElement)
    }

    reverse() {
      return Romo.dom(this.elements.reverse())
    }

    filter(fn) {
      return Romo.dom(this.elements.filter(fn))
    }

    concat(elements) {
      return Romo.dom(this.elements.concat(Romo.dom(elements).elements))
    }

    forEach(fn) {
      this.elements.forEach(fn)
    }

    map(fn) {
      return this.elements.map(fn)
    }

    reverseMap(fn) {
      return this.reverse().map(fn)
    }

    reduce(fn, acc) {
      return this.elements.reduce(fn, acc)
    }

    // DOM attributes API method proxies

    attr(attributeName) {
      return Romo.attr(this, attributeName)
    }

    setAttr(attributeName, attributeValue) {
      return Romo.dom(Romo.setAttr(this, attributeName, attributeValue))
    }

    rmAttr(attributeName) {
      return Romo.dom(Romo.rmAttr(this, attributeName))
    }

    data(dataName) {
      return Romo.data(this, dataName)
    }

    setData(dataName, dataValue) {
      return Romo.dom(Romo.setData(this, dataName, dataValue))
    }

    rmData(dataName) {
      return Romo.dom(Romo.rmData(this, dataName))
    }

    style(styleName) {
      return Romo.style(this, styleName)
    }

    setStyle(styleName, styleValue) {
      return Romo.dom(Romo.setStyle(this, styleName, styleValue))
    }

    rmStyle(styleName) {
      return Romo.dom(Romo.rmStyle(this, styleName))
    }

    css(styleName) {
      return Romo.css(this, styleName)
    }

    hasClass(className) {
      return Romo.hasClass(this, className)
    }

    addClass(className) {
      return Romo.dom(Romo.addClass(this, className))
    }

    rmClass(className) {
      return Romo.dom(Romo.rmClass(this, className))
    }

    toggleClass(className) {
      return Romo.dom(Romo.toggleClass(this, className))
    }

    show() {
      return Romo.dom(Romo.show(this))
    }

    hide() {
      return Romo.dom(Romo.hide(this))
    }

    rect() {
      return Romo.rect(this)
    }

    height() {
      return Romo.height(this)
    }

    width() {
      return Romo.width(this)
    }

    offset(relativeToElement) {
      return Romo.offset(this, relativeToElement)
    }

    scrollTop() {
      return Romo.scrollTop(this)
    }

    scrollLeft() {
      return Romo.scrollLeft(this)
    }

    setScrollTop(value) {
      return Romo.dom(Romo.setScrollTop(this, value))
    }

    setScrollLeft(value) {
      return Romo.dom(Romo.setScrollLeft(this, value))
    }

    zIndex() {
      return Romo.zIndex(this)
    }

    // DOM query API method proxies

    get innerText() {
      return Romo.innerText(this)
    }

    get innerHTML() {
      return Romo.innerHTML(this)
    }

    is(selector) {
      return Romo.is(this, selector)
    }

    children(selector) {
      return Romo.dom(Romo.children(this, selector))
    }

    parent() {
      return Romo.dom(Romo.parent(this))
    }

    parents(selector) {
      return Romo.dom(Romo.parents(this, selector))
    }

    scrollableParent() {
      return Romo.dom(Romo.scrollableParent(this))
    }

    scrollableParents(selector) {
      return Romo.dom(Romo.scrollableParents(this, selector))
    }

    closest(selector) {
      return Romo.dom(Romo.closest(this, selector))
    }

    siblings(selector) {
      return Romo.dom(Romo.siblings(this, selector))
    }

    prev(selector) {
      return Romo.dom(Romo.prev(this, selector))
    }

    next(selector) {
      return Romo.dom(Romo.next(this, selector))
    }

    // DOM mutate API method proxies

    set innerText(value) {
      return Romo.setInnerText(this, value)
    }

    set innerHTML(value) {
      return Romo.setInnerHTML(this, value)
    }

    remove() {
      return Romo.dom(Romo.remove(this))
    }

    removeChildren() {
      return Romo.dom(Romo.removeChildren(this))
    }

    replace(replacementElement) {
      return Romo.dom(Romo.replace(this, replacementElement))
    }

    replaceHTML(htmlString) {
      return Romo.dom(Romo.replaceHTML(this, htmlString))
    }

    update(childElements) {
      return Romo.dom(Romo.update(this, childElements))
    }

    updateHTML(htmlString) {
      return Romo.dom(Romo.updateHTML(this, htmlString))
    }

    updateText(textString) {
      return Romo.dom(Romo.updateText(this, textString))
    }

    clearHTML() {
      return Romo.dom(Romo.clearHTML(this))
    }

    prepend(childElements) {
      return Romo.dom(Romo.prepend(this, childElements))
    }

    prependHTML(htmlString) {
      return Romo.dom(Romo.prependHTML(this, htmlString))
    }

    append(childElements) {
      return Romo.dom(Romo.append(this, childElements))
    }

    appendHTML(htmlString) {
      return Romo.dom(Romo.appendHTML(this, htmlString))
    }

    before(siblingElements) {
      return Romo.dom(Romo.before(this, siblingElements))
    }

    beforeHTML(htmlString) {
      return Romo.dom(Romo.beforeHTML(this, htmlString))
    }

    after(siblingElements) {
      return Romo.dom(Romo.after(this, siblingElements))
    }

    afterHTML(htmlString) {
      return Romo.dom(Romo.afterHTML(this, htmlString))
    }

    // DOM events API method proxies

    on(eventName, eventHandlerFn) {
      return Romo.dom(Romo.on(this, eventName, eventHandlerFn))
    }

    off(eventName, eventHandlerFn) {
      return Romo.dom(Romo.off(this, eventName, eventHandlerFn))
    }

    trigger(customEventName, args) {
      return Romo.dom(Romo.trigger(this, customEventName, args))
    }
  }
})

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
Romo.define('Romo.FlashAlert', function() {
  return class {
    constructor(alertObject) {
      this.alertType = alertObject.alertType
      this.message = String(alertObject.message || '').trim()
    }

    static forXHR(xhr) {
      return new this({
        alertType: xhr.getResponseHeader('X-Message-Type'),
        message:   xhr.getResponseHeader('X-Message'),
      })
    }

    get isMessagePresent() {
      return this.message.length !== 0
    }

    toString() {
      return `[${this.alertType}] ${this.message}`.trim()
    }
  }
})

},{}],18:[function(require,module,exports){
// Romo.Queue is a basic Queue implementation that optionally supports the
// Null Object Pattern.
//
// This is just a thin wrapper around Array to implement the classic Queue API.
Romo.define('Romo.Queue', function() {
  return class {
    constructor(nullItem) {
      this.nullItem = nullItem
      this._array = []
    }

    get size() {
      return this._array.length
    }

    get isEmpty() {
      return this._array.length === 0
    }

    enqueue(item) {
      this._array.push(item)

      return this
    }

    dequeue() {
      if (this.isEmpty) return this.nullItem

      return this._array.shift()
    }

    peek() {
      if (this.isEmpty) return undefined

      return this._array[0]
    }

    clear() {
      this._array = []

      return this
    }
  }
})

},{}],19:[function(require,module,exports){
// new Romo.URLSearchParams({}).toString()
//   #=> ""
// new Romo.URLSearchParams({ a: 2, b: 'three', c: 4 }).toString()
//   #=> "a=2&b=three&c=4"
// new Romo.URLSearchParams({ a: [ 2, 3, 4 ] }).toString()
//   #=> "a=2%2C3%2C4"
// new Romo.URLSearchParams({ a: [ 2, 3, 4 ] }, { decode: true }).toString()
//   #=> "a=2,3,4"
// new Romo.URLSearchParams({ "a[]": [ 2, 3, 4 ] }, { decode: true }).toString()
//   #=> "a[]=2&a[]=3&a[]=4"
// new Romo.URLSearchParams({ a: 2, b: '', c: 4 }).toString()
//   #=> "a=2&b=&c=4"
// new Romo.URLSearchParams({ a: 2, b: ' ', c: 4 }, { removeBlanks: true }).toString()
//   #=> "a=2&c=4"
// new Romo.URLSearchParams({ "a[]": [''], { decode: true } }).toString()
//   #=> "a[]="
// new Romo.URLSearchParams({ "a[]": [''], { decode: true, removeBlanks: true } }).toString()
//   #=> ""
Romo.define('Romo.URLSearchParams', function() {
  return class {
    constructor(data, { removeBlanks, decode } = {}) {
      this.data = data || {}
      this.removeBlanks = removeBlanks
      this.decode = decode
    }

    get urlSearchParams() {
      return Romo.memoize(this, 'urlSearchParams', function() {
        const urlSearchParams = new URLSearchParams()

        for (var name in this.data) {
          const value = this.data[name]
          if (
            name.match(/.+\[\]$/) &&
            Array.isArray(value) &&
            value.length > 0
          ) {
            value.forEach(Romo.bind(function(valueItem) {
              this._appendValue(urlSearchParams, name, valueItem)
            }, this))
          } else {
            this._appendValue(urlSearchParams, name, value)
          }
        }

        return urlSearchParams
      })
    }

    keys() {
      return this.urlSearchParams.keys()
    }

    get(key) {
      return this.urlSearchParams.get(key)
    }

    toString() {
      if (this.decode) {
        return window.decodeURIComponent(this.urlSearchParams.toString())
      } else {
        return this.urlSearchParams.toString()
      }
    }

    // private

    _appendValue(urlSearchParams, name, value) {
      const valueString = value.toString().trim()

      if (this.removeBlanks && valueString === '') {
        return
      }
      urlSearchParams.append(name, value)
    }
  }
})

},{}],20:[function(require,module,exports){
Romo.define('Romo.XMLHttpRequest', function() {
  return class {
    constructor({
      url,
      method,
      data,
      onSuccess,
      onError,
      headers,
      contentType,
      responseType,
      username,
      password,
    } = {}) {
      this.method = method
      this.url = url
      this.data = new Romo.XMLHttpRequest.Data(data)
      this.onSuccess = onSuccess
      this.onError = onError
      this.headers = headers
      this.contentType = contentType
      this.responseType = responseType
      this.username = username
      this.password = password
    }

    static get GET() {
      return 'GET'
    }

    static get defaultXHRMethod() {
      return this.GET
    }

    static get defaultURL() {
      return window.location.toString()
    }

    static get sendAsynchronously() {
      return true
    }

    get isNonTextResponseType() {
      return (
        this.responseType === 'arraybuffer' ||
        this.responseType === 'blob' ||
        this.responseType === 'document' ||
        this.responseType === 'json'
      )
    }

    get xhrMethod() {
      return Romo.memoize(this, 'xhrMethod', function() {
        return (this.method || this.class.defaultXHRMethod).toUpperCase()
      })
    }

    get xhrURL() {
      return Romo.memoize(this, 'xhrURL', function() {
        return (
          this.data.toXHRURL(
            this.url || this.class.defaultURL,
            { method: this.xhrMethod },
          )
        )
      })
    }

    get xhrData() {
      return Romo.memoize(this, 'xhrData', function() {
        return this.data.toXHRData({ method: this.xhrMethod })
      })
    }

    get xhr() {
      return Romo.memoize(this, 'xhr', function() {
        const xhr = new XMLHttpRequest()

        xhr.open(
          this.xhrMethod,
          this.xhrURL,
          this.class.sendAsynchronously,
          this.username,
          this.password,
        )

        for (var name in this.headers) {
          xhr.setRequestHeader(name, this.headers[name])
        }

        if (this.contentType) {
          xhr.setRequestHeader('Content-Type', this.contentType)
        }

        if (this.isNonTextResponseType) {
          xhr.responseType = this.responseType
        }

        xhr.onreadystatechange = Romo.bind(this._onReadyStateChange, this)

        return xhr
      })
    }

    doSend() {
      this.xhr.send(this.xhrData)

      return this
    }

    doAbort() {
      this.xhr.abort()

      return this
    }

    // private

    _onReadyStateChange() {
      if (this.xhr.readyState === XMLHttpRequest.DONE) {
        if (
          this.onSuccess &&
          (
            (this.xhr.status >= 200 && this.xhr.status < 300) ||
            this.xhr.status === 304
          )
        ) {
          if (this.isNonTextResponseType) {
            this.onSuccess(this.xhr.response, this.xhr.status, this.xhr)
          } else {
            this.onSuccess(this.xhr.responseText, this.xhr.status, this.xhr)
          }
        } else if (this.onError) {
          this.onError(this.xhr.statusText || null, this.xhr.status, this.xhr)
        }
      }
    }
  }
})

Romo.define('Romo.XMLHttpRequest.Data', function() {
  return class {
    constructor(data) {
      this.data = data || {}
    }

    get length() {
      return Object.keys(this.data).length
    }

    get formData() {
      return Romo.memoize(this, 'formData', function() {
        const formData = new FormData()
        for (var name in this.data) {
          Romo.array(this.data[name]).forEach(function(value) {
            formData.append(name, value)
          })
        }
      })
    }

    get urlSearchParams() {
      return Romo.memoize(this, 'urlSearchParams', function() {
        return new Romo.URLSearchParams(this.data)
      })
    }

    toXHRURL(urlString, { method } = {}) {
      const url = new URL(urlString)

      if (method === Romo.XMLHttpRequest.GET) {
        const combinedSearchParams =
          [url.searchParams, this.urlSearchParams]
            .reduce(function(acc, searchParams) {
              for (var key of searchParams.keys()) {
                acc.append(key, searchParams.get(key))
              }
              return acc
            }, new URLSearchParams())

        url.search = combinedSearchParams.toString()
      }

      return url.toString()
    }

    toXHRData({ method } = {}) {
      if (method === Romo.XMLHttpRequest.GET || this.length === 0) {
        return undefined
      } else {
        return this.formData
      }
    }
  }
})

},{}]},{},[12]);
