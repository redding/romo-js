import '../utilities/dom_component.js'
import './form/browser_submission.js'
import './form/enter_submit.js'
import './form/event_submission.js'
import './form/first_visible_input.js'
import './form/on_change_submits.js'
import './form/submit_spinners.js'
import './form/submits.js'
import './form/xhr_get_submission.js'
import './form/xhr_post_submission.js'

// Romo.UI.Form extends form DOM elements with XHR submit and other custom
// behaviors. It uses DOM data attributes with auto-initialization for
// configuration. It emits status and submission lifecycle events.
Romo.define('Romo.UI.Form', function() {
  return class extends Romo.DOMComponent {
    constructor(dom, { givenSubmits, givenSubmitSpinners } = {}) {
      super({
        dom:         dom,
        attrPrefix:  'romo-ui-form',
        eventPrefix: 'Romo.UI.Form',
      })

      this.givenSubmitsDOM = Romo.dom(givenSubmits)
      this.givenSubmitSpinnersDOM = Romo.dom(givenSubmitSpinners)

      // Delay the initial binding so nested components have time to bind first.
      this.pushFn(this._bind)
    }

    get submission() {
      if (this._submission === undefined) {
        if (this.usesBrowserSubmission) {
          this._submission = new Romo.UI.Form.BrowserSubmission(this.dom)
        } else if (this.usesEventSubmission) {
          this._submission = new Romo.UI.Form.EventSubmission(this.dom)
        } else if (this.usesXHRGetSubmission) {
          this._submission = new Romo.UI.Form.XHRGetSubmission(this.dom)
        } else {
          this._submission = new Romo.UI.Form.XHRPostSubmission(this.dom)
        }
      }
      return this._submission
    }

    get usesBrowserSubmission() {
      return this.domData('browser-submit') === true
    }

    get usesEventSubmission() {
      return this.domData('event-submit') === true
    }

    get usesXHRGetSubmission() {
      return (
        !this.usesBrowserSubmission &&
        !this.usesEventSubmission &&
        this.dom.attr('method').toUpperCase() === Romo.XMLHttpRequest.GET
      )
    }

    doSubmit() {
      this.submission.doCall()

      return this
    }

    doConfirmSubmit() {
      if (!this.submission.isRunning) {
        throw new Error(
          'RuntimeError: no submission to confirm. Did you call `#doSubmit()` first?'
        )
      }

      this.submission.doStartSubmit()

      return this
    }

    doDenySubmit() {
      if (!this.submission.isRunning) {
        throw new Error(
          'RuntimeError: no submission to deny. Did you call `#doSubmit()` first?'
        )
      }

      this.submission.doCompleteSubmit()

      return this
    }

    doFocusFirstVisibleInput() {
      (new Romo.UI.Form.FirstVisibleInput(this.dom)).doFocus()

      return this
    }

    doEnableSubmits() {
      this.romoFormSubmits.doEnable()

      return this
    }

    doDisableSubmits() {
      this.romoFormSubmits.doDisable()

      return this
    }

    doStartSubmitSpinners() {
      this.romoFormSubmitSpinners.doStart()

      return this
    }

    doStopSubmitSpinners() {
      this.romoFormSubmitSpinners.doStop()

      return this
    }

    // private

    _bind() {
      this.romoFormSubmits =
        new Romo.UI.Form.Submits(
          this.dom,
          { givenSubmitsDOM: this.givenSubmitsDOM },
        )
      this.romoFormSubmitSpinners =
        new Romo.UI.Form.SubmitSpinners(
          this.dom,
          { givenSubmitSpinnersDOM: this.givenSubmitSpinnersDOM },
        )
      this.romoFormOnChangeSubmits = new Romo.UI.Form.OnChangeSubmits(this.dom)
      this.romoFormEnterSubmit = new Romo.UI.Form.EnterSubmit(this.dom)

      this._bindForm()

      this.submission.doRemoveErrorMessages(this.dom)
      this.doFocusFirstVisibleInput()
    }

    _bindForm() {
      // Submit Trigger events

      this.domOn('triggerSubmit', function(e) {
        if (!this.romoFormSubmits.areDisabled) {
          this.submission.doCall()
        }
      })

      this.dom.on(
        'Romo.UI.Form.Submits:clicked',
        Romo.bind(function(e, _, clickedSubmitDOM) {
          if (!Romo.UI.Form.Submits.isDisabled(clickedSubmitDOM)) {
            this.dom.trigger('Romo.UI.Form:triggerSubmit')
          }
        }, this)
      )

      this.dom.on('Romo.UI.Form.OnChangeSubmits:changed', Romo.bind(function(e) {
        this.dom.trigger('Romo.UI.Form:triggerSubmit')
      }, this))

      this.dom.on('Romo.UI.Form.EnterSubmit:pressed', Romo.bind(function(e) {
        this.dom.trigger('Romo.UI.Form:triggerSubmit')
      }, this))

      // Submission Events

      this._proxySubmissionLifecycleEvents(
        'beforeSubmit',
        'afterSubmit',
        'confirmSubmit',
        'browserSubmit',
        'xhrSubmit',
        'eventSubmit',
        'submitSuccess',
        'submitError',
        'submitComplete',
        'errorMessagesAdded',
        'errorMessagesRemoved',
        'errorMessagesChanged'
      )

      // Lifecycle events

      this.domOn('beforeSubmit', function(e, romoForm) {
        this.doDisableSubmits()
      })

      this.domOn('browserSubmit', function(e, romoForm) {
        this.doEnableSubmits()
      })

      this.domOn('submitComplete', function(e, romoForm) {
        this.doEnableSubmits()
      })

      // Trigger Events

      this.domOn('triggerSubmitSpinnersStart', function(e) {
        this.doStartSubmitSpinners()
      })

      this.domOn('triggerSubmitSpinnersStop', function(e) {
        this.doStopSubmitSpinners()
      })

      this.domOn('triggerRemoveErrorMessages', function(e) {
        this.submission.doRemoveErrorMessages(this.dom)
      })
    }

    _proxySubmissionLifecycleEvents(...eventNames) {
      var submissionEventName, formEventName

      eventNames.forEach(Romo.bind(function(eventName) {
        submissionEventName = `Romo.UI.Form.Submission:${eventName}`
        formEventName = `Romo.UI.Form:${eventName}`

        Romo.proxyEvent({
          fromElement:   this.dom,
          toElement:     this.dom,
          fromEventName: submissionEventName,
          toEventName:   formEventName,
          toArgs:        [this],
        })
      }, this))
    }
  }
})

Romo.addAutoInitSelector('[data-romo-ui-form]', Romo.UI.Form)
