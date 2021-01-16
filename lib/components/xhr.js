import '../utilities/queue.js'
import './dom_component.js'
import './spinner.js'

// Romo.XHR adds XHR behaviors to DOM elements. This means you can configure a
// DOM element to make XHR requests and bind XHR lifecycle events to the DOM
// element.
Romo.define('Romo.XHR', function() {
  return class extends Romo.DOMComponent {
    constructor(element) {
      super(element)

      this._bind()
    }

    get callUrl() {
      return this.dom.data('romo-xhr-call-url') || this.dom.attr('href')
    }

    get callMethod() {
      return this.dom.data('romo-xhr-call-method') || Romo.XMLHttpRequest.GET
    }

    get callResponseType() {
      return (
        this.dom.data('romo-xhr-call-response-type') || Romo.XMLHttpRequest.JSON
      )
    }

    get callOn() {
      var eventType = this.dom.data('romo-xhr-call-on')

      if (eventType === '') {
        eventType = undefined
      } else if (!eventType && this.dom.is('a, button')) {
        eventType = 'click'
      }

      return eventType
    }

    get confirm() {
      return this.dom.data('romo-xhr-confirm')
    }

    get disableWithSpinner() {
      return this.dom.data('romo-xhr-disable-with-spinner')
    }

    get callOnlyOnce() {
      return this.dom.data('romo-xhr-call-only-once')
    }

    get reloadPageOn() {
      return this.dom.data('romo-xhr-reload-page-on')
    }

    get isCallConfirmed() {
      return !this.confirm || window.confirm(this.confirm)
    }

    doCall(data) {
      this._enqueueCall(data)

      return this
    }

    doAbort() {
      this.currentXHR.doAbort()

      return this
    }

    doEnable() {
      if (this.disableWithSpinner) {
        this.romoSpinner.doStop()
        this.dom.rmClass('disabled')
      }

      return this
    }

    doBindCallOn(callOn) {
      this.dom.on((callOn || this.callOn), Romo.bind(this._onCallOn, this))

      return this
    }

    doUnbindCallOn(callOn) {
      this.dom.off((callOn || this.callOn), Romo.bind(this._onCallOn, this))

      return this
    }

    // private

    get _nullXHR() {
      return {
        doAbort: function() {},
      }
    }

    _bind() {
      this.callQueue = new Romo.Queue()
      this.callStarted = false
      this.callRunning = false
      this.currentXHR = this._nullXHR

      if (this.disableWithSpinner) {
        this.romoSpinner = new Romo.Spinner(this.dom)
      }

      this.doUnbindCallOn()
      this.doBindCallOn()

      this.dom.on('Romo.XHR:triggerCall', Romo.bind(this._onTriggerCall, this))
      this.dom.on('Romo.XHR:triggerAbort', Romo.bind(this._onTriggerAbort, this))
      this.dom.on('Romo.XHR:triggerEnable', Romo.bind(this._onTriggerEnable, this))
    }

    _enqueueCall(data) {
      if (this.dom.data('romo-xhr-disabled')) {
        return
      }

      this.dom.trigger('Romo.XHR:callQueueStart', [this])
      this.callQueue.enqueue(data)

      if (this.callRunning === false) {
        this._dequeueCall()
      }
    }

    _dequeueCall() {
      this.callRunning = true

      const data = this.callQueue.dequeue()

      if (this.callUrl && this.isCallConfirmed) {
        if (this.disableWithSpinner) {
          this.romoSpinner.doStart()
          this.dom.addClass('disabled')
        }
        if (this.callOnlyOnce) {
          Romo.setData(this.dom, 'romo-xhr-disabled', true)
        }

        this._startCall(data)
      } else {
        this._completeCall()
      }
    }

    _startCall(data) {
      this.currentXHR =
        Romo.xhr({
          url:          this.callUrl,
          method:       this.callMethod,
          data:         data,
          responseType: this.callResponseType,
          reloadPageOn: this.reloadPageOn,
          onCallStart:  Romo.bind(this._onCallStart, this),
          onProgress:   Romo.bind(this._onCallProgress, this),
          onSuccess:    Romo.bind(this._onCallSuccess, this),
          onError:      Romo.bind(this._onCallError, this),
          onAbort:      Romo.bind(this._onCallAbort, this),
          onTimeout:    Romo.bind(this._onCallTimeout, this),
          onCallEnd:    Romo.bind(this._onCallEnd, this),
        })
    }

    _onCallStart(xhr) {
      this.callStarted = true
      this.dom.trigger('Romo.XHR:callStart', [this, xhr])
    }

    _onCallProgress(xhr) {
      this.dom.trigger('Romo.XHR:callProgress', [this, xhr])
    }

    _onCallSuccess(responseData, status, xhr) {
      this.dom.trigger('Romo.XHR:callSuccess', [this, responseData, xhr])
    }

    _onCallError(responseData, status, xhr) {
      this.dom.trigger('Romo.XHR:callError', [this, responseData, xhr])
    }

    _onCallAbort(statusText, status, xhr) {
      this.dom.trigger('Romo.XHR:callAbort', [this, xhr])
    }

    _onCallTimeout(statusText, status, xhr) {
      this.dom.trigger('Romo.XHR:callTimeout', [this, xhr])
    }

    _onCallEnd(xhr) {
      this.dom.trigger('Romo.XHR:callEnd', [xhr])
      this._completeCall()
    }

    _completeCall() {
      this.currentXHR = this._nullXHR

      if (this.callQueue.isEmpty) {
        this.callRunning = false
        this._completeCallQueue()
      } else {
        this._dequeueCall()
      }
    }

    _completeCallQueue() {
      if (this.callStarted) {
        this.callStarted = false
      }

      this.dom.trigger('Romo.XHR:callQueueEnd', [this])
    }

    _onCallOn(e) {
      e.preventDefault()
      e.stopPropagation()

      if (this.dom.hasClass('disabled') === false) {
        // Make the call late-bound to let all `callOn`` event type handling
        // finish before making the call.
        Romo.pushFn(Romo.bind(this.doCall, this))
      }
    }

    _onTriggerCall(e, data) {
      if (this.dom.hasClass('disabled') === false) {
        this.doCall(data)
      }
    }

    _onTriggerAbort(e) {
      this.doAbort()
    }

    _onTriggerEnable(e) {
      this.doEnable()
    }
  }
})

Romo.addAutoInitSelector('[data-romo-xhr', Romo.XHR)
