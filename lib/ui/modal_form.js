import './modal.js'
import './popover_form.js'

Romo.define('Romo.UI.ModalForm', function() {
  return class extends Romo.UI.PopoverForm {
    constructor(dom) {
      super(
        dom,
        {
          popoverOwnerClass: Romo.UI.Modal,
          eventPrefix:       'Romo.UI.ModalForm',
          attrPrefix:        'romo-ui-modal-form',
        },
      )

      this.romoModal = this.romoPopoverOwner
      this._proxyPopoverEmittedEvents('dragMove', 'dragStart', 'dragStop')
    }
  }
})

Romo.addAutoInitSelector('[data-romo-ui-modal-form]', Romo.UI.ModalForm)
