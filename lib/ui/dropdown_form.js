import './dropdown.js'
import './popover_form.js'

Romo.define('Romo.UI.DropdownForm', function() {
  return class extends Romo.UI.PopoverForm {
    constructor(dom) {
      super({
        dom:               dom,
        popoverOwnerClass: Romo.UI.Dropdown,
        attrPrefix:        'romo-ui-dropdown-form',
        eventPrefix:       'Romo.UI.DropdownForm',
      })
      this.romoDropdown = this.romoPopoverOwner
    }
  }
})

Romo.addAutoInitSelector('[data-romo-ui-dropdown-form]', Romo.UI.DropdownForm)
