import './base_xhr_submission.js'
import './values.js'

// Romo.Form.XHRGetSubmission submits an Romo.Form using an XHR GET request.
// By default, it redirects the page with the given form values as URL search
// parameters, removes blank param values, and decodes the param value sin the
// URL it redirects to. It ignores any file input values in the form.
Romo.define('Romo.Form.XHRGetSubmission', function() {
  return class extends Romo.Form.BaseXHRSubmission {
    get redirectPage() {
      return this.formDOM.data('romo-form-redirect-page') === true
    }

    get removeBlankGetParams() {
      return this.formDOM.data('romo-form-remove-blank-get-params') || true
    }

    get decodeGetParams() {
      return this.formDOM.data('romo-form-decode-get-params') || true
    }

    doStartSubmit() {
      const data =
        Romo.Form.Values.dataSet(this.formDOM, { includeFiles: false })
      if (this.redirectPage) {
        return this._startSubmit(function() {
          const redirectURL =
            new Romo.URLSearchParams(data, {
              removeBlanks: this.removeBlankGetParams,
              decode:       this.decodeGetParams,
            }).toURL(this.callURL)
          Romo.redirectPage(redirectURL.toString())
        })
      } else {
        return super.doStartSubmit({ data: data })
      }
    }
  }
})
