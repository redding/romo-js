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

    Romo.dom(elements).forEachElement(Romo.bind(function(element) {
      Romo.env.addEventListener(element, eventName, listenerFn)
    }, this))

    return elements
  }

Romo.off =
  function(elements, eventName, eventHandlerFn) {
    Romo.dom(elements).forEachElement(Romo.bind(function(element) {
      Romo.env.removeEventListener(element, eventName, eventHandlerFn)
    }, this))

    return elements
  }

Romo.trigger =
  function(elements, customEventName, eventArgs) {
    const event =
      new CustomEvent(customEventName, { bubbles: false, detail: eventArgs })

    Romo.dom(elements).forEachElement(function(element) {
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
    return Romo.delayFn(1, fn)
  }

// This delays executing the given function for the given milliseconds.
Romo.delayFn =
  function(delayMs, fn) {
    return setTimeout(fn, delayMs)
  }
