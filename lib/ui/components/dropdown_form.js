import './dropdown.js'
import './popover_form.js'

Romo.define('Romo.UI.DropdownForm', function() {
  return class extends Romo.UI.PopoverForm {
    constructor(dom) {
      super(
        dom,
        {
          popoverOwnerClass: Romo.UI.Dropdown,
          eventPrefix:       'Romo.UI.DropdownForm',
          attrPrefix:        'romo-ui-dropdown-form',
        },
      )
      this.romoDropdown = this.romoPopoverOwner
    }
  }
})

Romo.addAutoInitSelector('[data-romo-ui-dropdown-form]', Romo.UI.DropdownForm)
