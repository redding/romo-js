import './base_submission.js'

// Romo.UI.Form.BaseXHRSubmission submits an Romo.UI.Form using an XHR request. It
// handles 422 responses by adding/removing validation error messages as needed.
Romo.define('Romo.UI.Form.BaseXHRSubmission', function() {
  return class extends Romo.UI.Form.BaseSubmission {
    get callURL() {
      return this.formDOM.attr('action')
    }

    get callMethod() {
      return this.formDOM.attr('method')
    }

    get responseType() {
      return (
        this.formDOM.data('romo-ui-form-xhr-response-type')
      )
    }

    get usesJSONResponseType() {
      return this.responseType === Romo.XMLHttpRequest.JSON
    }

    doStartSubmit(submitXHROptions) {
      const requiredXHROptions =
        {
          url:                   this.callURL,
          method:                this.callMethod,
          responseType:          this.responseType,
          onSuccess:             Romo.bind(this._onSuccess, this),
          onError:               Romo.bind(this._onError, this),
          onCallEnd:             Romo.bind(this._onCallEnd, this),
          mutedErrorStatusCodes: [422],
        }

      return super.doStartSubmit(function() {
        try {
          const xhrOptions =
            Object.assign({}, submitXHROptions, requiredXHROptions)
          Romo.xhr(xhrOptions)
          this.formDOM.trigger('Romo.UI.Form.Submission:xhrSubmit', [xhrOptions])
        } catch (error) {
          console.error(error)
          this.pushFn(this._onCallEnd)
        }
      })
    }

    // private

    _onSuccess(response, status, xhr) {
      this.doRemoveErrorMessages()

      this.formDOM.trigger('Romo.UI.Form.Submission:submitSuccess', [response, xhr])
    }

    _onError(response, status, xhr) {
      this.doRemoveErrorMessages()

      if (xhr.status === 422 && xhr.responseJSON) {
        this.doAddErrorMessages(xhr.responseJSON)
      }

      this.formDOM.trigger('Romo.UI.Form.Submission:submitError', [response, xhr])
      this.formDOM.trigger('Romo.UI.Form:triggerSubmitSpinnersStop')
    }

    _onCallEnd(xhr) {
      this.doCompleteSubmit()
    }
  }
})
