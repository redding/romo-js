import './base_submission.js'

// Romo.Form.BrowserSubmission submits an Romo.Form using the native browser.
Romo.define('Romo.Form.BrowserSubmission', function() {
  return class extends Romo.Form.BaseSubmission {
    doStartSubmit() {
      return super.doStartSubmit(function() {
        this.formDOM.trigger('Romo.Form.Submission:browserSubmit')
        this.formDOM.firstElement.submit()
        Romo.pushFn(Romo.bind(function() { this.doCompleteSubmit() }, this))
      })
    }
  }
})
