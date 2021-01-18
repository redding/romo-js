class RomoUI {
  constructor() {
    this.popoverStackSelectors = []
  }

  setup() {
    Romo.setup()
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
