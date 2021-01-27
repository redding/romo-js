import './modal.js'
import './popover_form.js'

Romo.define('Romo.UI.ModalForm', function() {
  return class extends Romo.UI.PopoverForm {
    constructor(dom) {
      super({
        dom:               dom,
        popoverOwnerClass: Romo.UI.Modal,
      })
      this.romoModal = this.romoPopoverOwner
      this._proxyPopoverEmittedEvents('dragMove', 'dragStart', 'dragStop')
    }

    static get attrPrefix() {
      return 'romo-ui-modal-form'
    }

    static get eventPrefix() {
      return 'Romo.UI.ModalForm'
    }
  }
})

Romo.addAutoInitSelector(`[data-${Romo.UI.ModalForm.attrPrefix}]`, Romo.UI.ModalForm)
