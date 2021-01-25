import './base_xhr_submission.js'
import './values.js'

// Romo.UI.Form.XHRPostSubmission submits an Romo.UI.Form using an XHR POST request.
Romo.define('Romo.UI.Form.XHRPostSubmission', function() {
  return class extends Romo.UI.Form.BaseXHRSubmission {
    doStartSubmit() {
      return super.doStartSubmit({
        data:
          Romo.UI.Form.Values.formData(this.formDOM, { includeFiles: true }),
        processData: false,
        contentType: false,
      })
    }
  }
})
