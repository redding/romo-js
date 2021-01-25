// Romo.DOMComponent is a common base class for Romo JS components that bind to
// a DOM element, are configured by DOM data attributes, and interact using DOM
// events.
Romo.define('Romo.DOMComponent', function() {
  return class {
    constructor({ dom, attrPrefix, eventPrefix } = {}) {
      if (dom) {
        this.dom = Romo.dom(dom)
      }
      this.attrPrefix = attrPrefix
      this.eventPrefix = eventPrefix
    }

    domData(name) {
      return this.dom.data(`${this.attrPrefix}-${name}`)
    }

    hasDOMData(name) {
      return this.dom.hasData(`${this.attrPrefix}-${name}`)
    }

    setDOMData(name, dataValue) {
      return this.dom.setData(`${this.attrPrefix}-${name}`, dataValue)
    }

    setDOMDataDefault(name, dataValue) {
      return this.dom.setDataDefault(`${this.attrPrefix}-${name}`, dataValue)
    }

    on(eventName, eventHandlerFn) {
      return this.dom.on(eventName, Romo.bind(eventHandlerFn, this))
    }

    off(eventName, eventHandlerFn) {
      return this.dom.off(eventName, Romo.bind(eventHandlerFn, this))
    }

    trigger(customEventName, eventArgs) {
      return this.dom.trigger(customEventName, [this].concat(eventArgs || []))
    }

    domOn(eventName, eventHandlerFn) {
      return this.on(`${this.eventPrefix}:${eventName}`, eventHandlerFn)
    }

    domOff(eventName, eventHandlerFn) {
      return this.off(`${this.eventPrefix}:${eventName}`, eventHandlerFn)
    }

    domTrigger(customEventName, eventArgs) {
      return this.trigger(`${this.eventPrefix}:${customEventName}`, eventArgs)
    }

    hasDOMClass(className) {
      return this.dom.hasClass(`${this.attrPrefix}-${className}`)
    }

    addDOMClass(className) {
      return this.dom.addClass(`${this.attrPrefix}-${className}`)
    }

    rmDOMClass(className) {
      return this.dom.rmClass(`${this.attrPrefix}-${className}`)
    }

    removeDOMClass(className) {
      return this.dom.removeClass(`${this.attrPrefix}-${className}`)
    }

    pushFn(fn) {
      return Romo.pushFn(Romo.bind(fn, this))
    }

    delayFn(delayMs, fn) {
      return Romo.delayFn(delayMs, Romo.bind(fn, this))
    }
  }
})
