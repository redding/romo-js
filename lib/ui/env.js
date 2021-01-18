class RomoUI {
  constructor() {
    this.popoverStackSelectors = []
  }

  get popoverStack() {
    return Romo.memoize(this, 'popoverStack', function() {
      return new Romo.UI.PopoverStack(this.popoverStackSelectors)
    })
  }

  setup() {
    if (this._hasBeenSetup !== true) {
      Romo.setup()

      this._hasBeenSetup = true
    }
  }

  addPopoverStackSelector(selector) {
    this.popoverStackSelectors.push(selector)
  }
}

Romo.ui = new RomoUI()

Romo.addPopoverStackSelector =
  function(selector) {
    Romo.ui.addPopoverStackSelector(selector)
  }
