import './base_submission.js'
import './values.js'

// Romo.Form.EventSubmission submits an Romo.Form by just emitting a confirmation
// event. The Romo.Form consumer should listen for the event, do whatever logic
// necessary to confirm the submission, and then call `#doSubmit()` on the
// yielded Romo.Form instance.
//
// @example
//   formDOM.on('Romo.Form:confirmSubmit', function(e, romoForm) {
//     if (window.confirm('Are you sure?')) {
//       romoForm.doSubmit()
//     }
//   })
Romo.define('Romo.Form.EventSubmission', function() {
  return class extends Romo.Form.BaseSubmission {
    doStartSubmit() {
      return super.doStartSubmit(function() {
        this.formDOM.trigger(
          'Romo.Form.Submission:eventSubmit',
          [Romo.Form.Values.dataSet(this.formDOM, { includeFiles: true })]
        )
        Romo.pushFn(Romo.bind(function() { this.doCompleteSubmit() }, this))
      })
    }
  }
})
