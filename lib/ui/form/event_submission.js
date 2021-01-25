import './base_submission.js'
import './values.js'

// Romo.UI.Form.EventSubmission submits an Romo.UI.Form by just emitting a confirmation
// event. The Romo.UI.Form consumer should listen for the event, do whatever logic
// necessary to confirm the submission, and then call `#doSubmit()` on the
// yielded Romo.UI.Form instance.
//
// @example
//   formDOM.on('Romo.UI.Form:confirmSubmit', function(e, romoForm) {
//     if (window.confirm('Are you sure?')) {
//       romoForm.doSubmit()
//     }
//   })
Romo.define('Romo.UI.Form.EventSubmission', function() {
  return class extends Romo.UI.Form.BaseSubmission {
    doStartSubmit() {
      return super.doStartSubmit(function() {
        this.formDOM.trigger(
          'Romo.UI.Form.Submission:eventSubmit',
          [Romo.UI.Form.Values.dataSet(this.formDOM, { includeFiles: true })]
        )
        this.pushFn(this.doCompleteSubmit)
      })
    }
  }
})
