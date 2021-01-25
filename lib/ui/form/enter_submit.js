Romo.define('Romo.UI.Form.EnterSubmit', function() {
  return class {
    constructor(formDOM) {
      this.formDOM = formDOM
      this._bind()
    }

    static get enterKeyCode() {
      return 13 // Enter
    }

    isEnabled(event) {
      return (
        this.formDOM.data('romo-ui-form-disable-enter-submit') !== true &&
        Romo.dom(event.target).data('romo-ui-form-disable-enter-submit') !== true
      )
    }

    isEnterKeyPress(event) {
      return event.keyCode === this.class.enterKeyCode
    }

    isValidKeyPress(event) {
      return (
        this.isEnterKeyPress(event) &&
        this.isEnabled(event) &&
        event.target.nodeName.toLowerCase() !== 'textarea'
      )
    }

    // private

    _bind() {
      this.formDOM.on('keypress', Romo.bind(function(e) {
        if (this.isValidKeyPress(e)) {
          e.preventDefault()
          this.formDOM.trigger(
            'Romo.UI.Form.EnterSubmit:pressed',
            [this, Romo.dom(event.target)]
          )
        }
      }, this))
    }
  }
})
