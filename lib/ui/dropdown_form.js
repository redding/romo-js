import './dropdown.js'
import './popover_form.js'

Romo.define('Romo.UI.DropdownForm', function() {
  return class extends Romo.UI.PopoverForm {
    constructor(dom) {
      super({
        dom:               dom,
        popoverOwnerClass: Romo.UI.Dropdown,
      })
      this.romoDropdown = this.romoPopoverOwner
    }

    static get attrPrefix() {
      return 'romo-ui-dropdown-form'
    }

    static get eventPrefix() {
      return 'Romo.UI.DropdownForm'
    }
  }
})

Romo.addAutoInitSelector(`[data-${Romo.UI.DropdownForm.attrPrefix}]`, Romo.UI.DropdownForm)
