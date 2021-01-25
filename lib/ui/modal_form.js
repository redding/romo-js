import './modal.js'
import './popover_form.js'

Romo.define('Romo.UI.ModalForm', function() {
  return class extends Romo.UI.PopoverForm {
    constructor(dom) {
      super({
        dom:               dom,
        popoverOwnerClass: Romo.UI.Modal,
        attrPrefix:        'romo-ui-modal-form',
        eventPrefix:       'Romo.UI.ModalForm',
      })
      this.romoModal = this.romoPopoverOwner
      this._proxyPopoverEmittedEvents('dragMove', 'dragStart', 'dragStop')
    }
  }
})

Romo.addAutoInitSelector('[data-romo-ui-modal-form]', Romo.UI.ModalForm)
