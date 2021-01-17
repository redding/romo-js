Romo.define('Romo.UI.PopoverStack.Item', function() {
  return class {
    constructor(popoverDOM, closeFn, placeFn) {
      this.popoverDOM = popoverDOM
      this.closeFn = closeFn
      this.placeFn = placeFn
    }

    isFor(popoverDOM) {
      return this.popoverDOM.firstElement === popoverDOM.firstElement
    }

    getPositionStyle() {
      return this.popoverDOM.css('position')
    }

    trigger(customEventName, args) {
      return this.popoverDOM.trigger(customEventName, args)
    }
  }
})
