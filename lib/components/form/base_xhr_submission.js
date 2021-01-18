import './base_submission.js'

// Romo.Form.BaseXHRSubmission submits an Romo.Form using an XHR request. It
// handles 422 responses by adding/removing validation error messages as needed.
// It handles all other XHR error responses by alerting using `Romo.alert`.
Romo.define('Romo.Form.BaseXHRSubmission', function() {
  return class extends Romo.Form.BaseSubmission {
    get callURL() {
      return this.formDOM.attr('action')
    }

    get callMethod() {
      return this.formDOM.attr('method')
    }

    get responseType() {
      return (
        this.formDOM.data('romo-form-xhr-response-type') ||
          Romo.XMLHttpRequest.JSON
      )
    }

    get usesJSONResponseType() {
      return this.responseType === Romo.XMLHttpRequest.JSON
    }

    doStartSubmit(submitXHROptions) {
      const requiredXHROptions = {
        url:                   this.callURL,
        method:                this.callMethod,
        responseType:          this.responseType,
        reloadPageOn:          this.reloadPageOn,
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
          this.formDOM.trigger('Romo.Form.Submission:xhrSubmit', [xhrOptions])
        } catch (error) {
          console.error(error)
          Romo.pushFn(Romo.bind(function() { this._onCallEnd() }, this))
        }
      })
    }

    // private

    _onSuccess(response, status, xhr) {
      this.doRemoveErrorMessages()

      this.formDOM.trigger('Romo.Form.Submission:submitSuccess', [response, xhr])
    }

    _onError(response, status, xhr) {
      this.doRemoveErrorMessages()

      if (xhr.status === 422 && xhr.responseJSON) {
        this.doAddErrorMessages(xhr.responseJSON)
      }

      this.formDOM.trigger('Romo.Form.Submission:submitError', [response, xhr])
      this.formDOM.trigger('Romo.Form:triggerSubmitSpinnersStop')
    }

    _onCallEnd(xhr) {
      this.doCompleteSubmit()
    }
  }
})
