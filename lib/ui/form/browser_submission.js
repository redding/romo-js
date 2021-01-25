import './base_submission.js'

// Romo.UI.Form.BrowserSubmission submits an Romo.UI.Form using the native browser.
Romo.define('Romo.UI.Form.BrowserSubmission', function() {
  return class extends Romo.UI.Form.BaseSubmission {
    doStartSubmit() {
      return super.doStartSubmit(function() {
        this.formDOM.trigger('Romo.UI.Form.Submission:browserSubmit')
        this.formDOM.firstElement.submit()
        Romo.pushFn(Romo.bind(function() { this.doCompleteSubmit() }, this))
      })
    }
  }
})
