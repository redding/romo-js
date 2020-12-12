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
