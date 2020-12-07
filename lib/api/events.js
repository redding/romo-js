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

Romo.onReady =
  function(eventHandlerFn) {
    if (document.readyState === 'complete' || document.readyState !== 'loading') {
      eventHandlerFn()
    } else {
      Romo.on(document, 'DOMContentLoaded', eventHandlerFn)
    }
  }
