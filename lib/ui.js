import './ui/nav.js'
import './ui/popover.js'
import './ui/popover_stack.js'

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
