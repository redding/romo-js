// Romo.DOMComponent is a common base class for Romo JS components that bind to
// a DOM element, are configured by DOM data attributes, and interact using DOM
// events.
Romo.define('Romo.DOMComponent', function() {
  return class {
    constructor(element) {
      this.dom = Romo.dom(element)
    }
  }
})
