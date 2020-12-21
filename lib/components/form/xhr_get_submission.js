import './base_xhr_submission.js'
import './values.js'

// Romo.Form.XHRGetSubmission submits an Romo.Form using an XHR GET request.
// It ignores any file input values in the form.
Romo.define('Romo.Form.XHRGetSubmission', function() {
  return class extends Romo.Form.BaseXHRSubmission {
    doStartSubmit() {
      return super.doStartSubmit({
        data: Romo.Form.Values.dataSet(this.formDOM, { includeFiles: false }),
      })
    }
  }
})
