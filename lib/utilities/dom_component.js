// Romo.DOMComponent is a common base class for Romo JS components that bind to
// a DOM element, are configured by DOM data attributes, and interact using DOM
// events.
Romo.define('Romo.DOMComponent', function() {
  return class {
    constructor(element, domDataName) {
      this.dom = Romo.dom(element)
      this.domDataName = domDataName
    }

    domData(name) {
      return this.dom.data(`${this.domDataName}-${name}`)
    }

    hasDOMData(name) {
      return this.dom.hasData(`${this.domDataName}-${name}`)
    }

    setDOMData(name, dataValue) {
      return this.dom.setData(`${this.domDataName}-${name}`, dataValue)
    }

    setDOMDataDefault(name, dataValue) {
      return this.dom.setDataDefault(`${this.domDataName}-${name}`, dataValue)
    }
  }
})
