Romo.define('Romo.UI.Form.BaseSubmission', function() {
  return class {
    constructor(formDOM) {
      this.formDOM = formDOM
      this.queued = false
      this.running = false
    }

    get usesConfirmation() {
      return this.formDOM.data('romo-ui-form-confirm-submit') === true
    }

    get isRunning() {
      return this.running === true
    }

    get isQueued() {
      return this.queued === true
    }

    get reloadPageOn() {
      return this.formDOM.data('romo-ui-form-reload-page-on')
    }

    doCall(fnSubmit) {
      this.queued = true
      if (!this.isRunning) {
        this.running = true
        this.queued = false

        this.formDOM.trigger('Romo.UI.Form:triggerSubmitSpinnersStart')
        this.formDOM.trigger('Romo.UI.Form.Submission:beforeSubmit')

        if (this.usesConfirmation) {
          this.doConfirmSubmit()
        } else {
          this.doStartSubmit()
          this.formDOM.trigger('Romo.UI.Form.Submission:afterSubmit')
        }
      }

      return this
    }

    doStartSubmit(fnSubmit) {
      this._startSubmit(fnSubmit)

      return this
    }

    doConfirmSubmit() {
      this.formDOM.trigger('Romo.UI.Form.Submission:confirmSubmit')

      return this
    }

    doCompleteSubmit() {
      this.formDOM.trigger('Romo.UI.Form.Submission:submitComplete')

      this.running = false
      if (this.isQueued) {
        this.doCall()
      }

      return this
    }

    doAddErrorMessages(messages) {
      Romo.config.form.addErrorMessagesFn(this.formDOM, messages)
      this.formDOM.trigger(
        'Romo.UI.Form.Submission:errorMessagesAdded',
        [this.formDOM, messages],
      )
      this.formDOM.trigger(
        'Romo.UI.Form.Submission:errorMessagesChanged',
        [this.formDOM],
      )

      return this
    }

    doRemoveErrorMessages() {
      Romo.config.form.removeErrorMessagesFn(this.formDOM)
      this.formDOM.trigger(
        'Romo.UI.Form.Submission:errorMessagesRemoved',
        [this.formDOM],
      )
      this.formDOM.trigger(
        'Romo.UI.Form.Submission:errorMessagesChanged',
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
