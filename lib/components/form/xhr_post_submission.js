import './base_xhr_submission.js'
import './values.js'

// Romo.Form.XHRPostSubmission submits an Romo.Form using an XHR POST request.
Romo.define('Romo.Form.XHRPostSubmission', function() {
  return class extends Romo.Form.BaseXHRSubmission {
    doStartSubmit() {
      return super.doStartSubmit({
        data:
          Romo.Form.Values.formData(this.formDOM, { includeFiles: true }),
        processData: false,
        contentType: false,
      })
    }
  }
})
