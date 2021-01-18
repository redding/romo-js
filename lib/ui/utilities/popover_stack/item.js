Romo.define('Romo.UI.PopoverStack.Item', function() {
  return class {
    constructor(popoverDOM, closeFn, placeFn) {
      this.popoverDOM = popoverDOM
      this.closeFn = closeFn
      this.placeFn = placeFn
    }

    get positionStyle() {
      return this.popoverDOM.css('position')
    }

    isFor(popoverDOM) {
      return this.popoverDOM.firstElement === popoverDOM.firstElement
    }


    trigger(customEventName, args) {
      return this.popoverDOM.trigger(customEventName, args)
    }
  }
})
