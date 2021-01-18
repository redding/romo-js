import './dom_component.js'
import './form/browser_submission.js'
import './form/enter_submit.js'
import './form/event_submission.js'
import './form/first_visible_input.js'
import './form/on_change_submits.js'
import './form/submit_spinners.js'
import './form/submits.js'
import './form/xhr_get_submission.js'
import './form/xhr_post_submission.js'

// Romo.Form extends form DOM elements with XHR submit and other custom
// behaviors. It uses DOM data attributes with auto-initialization for
// configuration. It emits status and submission lifecycle events.
Romo.define('Romo.Form', function() {
  return class extends Romo.DOMComponent {
    constructor(dom, { givenSubmits, givenSubmitSpinners } = {}) {
      super(dom)

      this.givenSubmitsDOM = Romo.dom(givenSubmits)
      this.givenSubmitSpinnersDOM = Romo.dom(givenSubmitSpinners)

      // Delay the initial binding so nested components have time to bind first.
      Romo.pushFn(Romo.bind(this._bind, this))
    }

    get submission() {
      if (this._submission === undefined) {
        if (this.usesBrowserSubmission) {
          this._submission = new Romo.Form.BrowserSubmission(this.dom)
        } else if (this.usesEventSubmission) {
          this._submission = new Romo.Form.EventSubmission(this.dom)
        } else if (this.usesXHRGetSubmission) {
          this._submission = new Romo.Form.XHRGetSubmission(this.dom)
        } else {
          this._submission = new Romo.Form.XHRPostSubmission(this.dom)
        }
      }
      return this._submission
    }

    get usesBrowserSubmission() {
      return this.dom.data('romo-form-browser-submit') === true
    }

    get usesEventSubmission() {
      return this.dom.data('romo-form-event-submit') === true
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
      (new Romo.Form.FirstVisibleInput(this.dom)).doFocus()

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
        new Romo.Form.Submits(
          this.dom,
          { givenSubmitsDOM: this.givenSubmitsDOM },
        )
      this.romoFormSubmitSpinners =
        new Romo.Form.SubmitSpinners(
          this.dom,
          { givenSubmitSpinnersDOM: this.givenSubmitSpinnersDOM },
        )
      this.romoFormOnChangeSubmits = new Romo.Form.OnChangeSubmits(this.dom)
      this.romoFormEnterSubmit = new Romo.Form.EnterSubmit(this.dom)

      this._bindForm()

      this.submission.doRemoveErrorMessages(this.dom)
      this.doFocusFirstVisibleInput()
    }

    _bindForm() {
      // Submit Trigger events

      this.dom.on('Romo.Form:triggerSubmit', Romo.bind(function(e) {
        if (!this.romoFormSubmits.areDisabled) {
          this.submission.doCall()
        }
      }, this))

      this.dom.on(
        'Romo.Form.Submits:clicked',
        Romo.bind(function(e, _, clickedSubmitDOM) {
          if (!Romo.Form.Submits.isDisabled(clickedSubmitDOM)) {
            this.dom.trigger('Romo.Form:triggerSubmit')
          }
        }, this)
      )

      this.dom.on('Romo.Form.OnChangeSubmits:changed', Romo.bind(function(e) {
        this.dom.trigger('Romo.Form:triggerSubmit')
      }, this))

      this.dom.on('Romo.Form.EnterSubmit:pressed', Romo.bind(function(e) {
        this.dom.trigger('Romo.Form:triggerSubmit')
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

      this.dom.on('Romo.Form:beforeSubmit', Romo.bind(function(e, romoForm) {
        this.doDisableSubmits()
      }, this))

      this.dom.on('Romo.Form:browserSubmit', Romo.bind(function(e, romoForm) {
        this.doEnableSubmits()
      }, this))

      this.dom.on('Romo.Form:submitComplete', Romo.bind(function(e, romoForm) {
        this.doEnableSubmits()
      }, this))

      // Trigger Events

      this.dom.on('Romo.Form:triggerSubmitSpinnersStart', Romo.bind(function(e) {
        this.doStartSubmitSpinners()
      }, this))

      this.dom.on('Romo.Form:triggerSubmitSpinnersStop', Romo.bind(function(e) {
        this.doStopSubmitSpinners()
      }, this))

      this.dom.on(
        'Romo.Form:triggerRemoveErrorMessages',
        Romo.bind(function(e) {
          this.submission.doRemoveErrorMessages(this.dom)
        }, this)
      )
    }

    _proxySubmissionLifecycleEvents(...eventNames) {
      var submissionEventName, formEventName

      eventNames.forEach(Romo.bind(function(eventName) {
        submissionEventName = `Romo.Form.Submission:${eventName}`
        formEventName = `Romo.Form:${eventName}`

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

Romo.addAutoInitSelector('[data-romo-form]', Romo.Form)
