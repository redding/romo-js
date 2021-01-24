import '../../utilities/dom_component.js'

Romo.define('Romo.Form.BaseSubmission', function() {
  return class extends Romo.DOMComponent {
    constructor(formDOM) {
      super(formDOM)

      this.formDOM = formDOM
      this.queued = false
      this.running = false
    }

    get usesConfirmation() {
      return this.dom.data('romo-form-confirm-submit') === true
    }

    get isRunning() {
      return this.running === true
    }

    get isQueued() {
      return this.queued === true
    }

    get reloadPageOn() {
      return this.formDOM.data('romo-form-reload-page-on')
    }

    doCall(fnSubmit) {
      this.queued = true
      if (!this.isRunning) {
        this.running = true
        this.queued = false

        this.formDOM.trigger('Romo.Form:triggerSubmitSpinnersStart')
        this.formDOM.trigger('Romo.Form.Submission:beforeSubmit')

        if (this.usesConfirmation) {
          this.doConfirmSubmit()
        } else {
          this.doStartSubmit()
          this.formDOM.trigger('Romo.Form.Submission:afterSubmit')
        }
      }

      return this
    }

    doStartSubmit(fnSubmit) {
      this._startSubmit(fnSubmit)

      return this
    }

    doConfirmSubmit() {
      this.formDOM.trigger('Romo.Form.Submission:confirmSubmit')

      return this
    }

    doCompleteSubmit() {
      this.formDOM.trigger('Romo.Form.Submission:submitComplete')

      this.running = false
      if (this.isQueued) {
        this.doCall()
      }

      return this
    }

    doAddErrorMessages(messages) {
      Romo.config.form.addErrorMessagesFn(this.formDOM, messages)
      this.formDOM.trigger(
        'Romo.Form.Submission:errorMessagesAdded',
        [this.formDOM, messages],
      )
      this.formDOM.trigger(
        'Romo.Form.Submission:errorMessagesChanged',
        [this.formDOM],
      )

      return this
    }

    doRemoveErrorMessages() {
      Romo.config.form.removeErrorMessagesFn(this.formDOM)
      this.formDOM.trigger(
        'Romo.Form.Submission:errorMessagesRemoved',
        [this.formDOM],
      )
      this.formDOM.trigger(
        'Romo.Form.Submission:errorMessagesChanged',
        [this.formDOM],
      )

      return this
    }

    // private

    _startSubmit(fnSubmit) {
      if (!fnSubmit) {
        throw new Error(
          `ArgumentError: expected a function for \`fnSubmit\`; given ${fnSubmit}`
        )
      }

      if (!this.isRunning) {
        throw new Error(
          'RuntimeError: the submission is not running.'
        )
      }

      Romo.bind(fnSubmit, this)()
    }
  }
})
