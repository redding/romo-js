import '../utilities/dom_component.js'
import '../utilities/queue.js'
import './spinner.js'

// Romo.UI.XHR adds XHR behaviors to DOM elements. This means you can configure
// a DOM element to make XHR requests and bind XHR lifecycle events to the DOM
// element.
Romo.define('Romo.UI.XHR', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super({
        dom:         dom,
        attrPrefix:  'romo-ui-xhr',
        eventPrefix: 'Romo.UI.XHR',
      })

      this._bind()
    }

    get callUrl() {
      return this.domData('call-url') || this.dom.attr('href')
    }

    get callMethod() {
      return this.domData('call-method') || Romo.XMLHttpRequest.GET
    }

    get callResponseType() {
      return this.domData('call-response-type')
    }

    get callOn() {
      var eventType = this.domData('call-on')

      if (eventType === '') {
        eventType = undefined
      } else if (!eventType && this.dom.is('a, button')) {
        eventType = 'click'
      }

      return eventType
    }

    get confirm() {
      return this.domData('confirm')
    }

    get disableWithSpinner() {
      return this.domData('disable-with-spinner')
    }

    get callOnlyOnce() {
      return this.domData('call-only-once')
    }

    get reloadPageOn() {
      return this.domData('reload-page-on')
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
        this.romoSpinner.doStop({ stopImmediately: true })
        this.dom.removeClass('disabled')
      }

      return this
    }

    doBindCallOn(callOn) {
      this.on((callOn || this.callOn), this._onCallOn)

      return this
    }

    doUnbindCallOn(callOn) {
      this.off((callOn || this.callOn), this._onCallOn)

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
        this.romoSpinner = new Romo.UI.Spinner(this.dom)
      }

      this.doUnbindCallOn()
      this.doBindCallOn()

      this.domOn('triggerCall', this._onTriggerCall)
      this.domOn('triggerAbort', this._onTriggerAbort)
      this.domOn('triggerEnable', this._onTriggerEnable)
    }

    _enqueueCall(data) {
      if (this.domData('disabled')) {
        return
      }

      this.domTrigger('callQueueStart')
      this.callQueue.enqueue(data)

      if (this.callRunning === false) {
        this._dequeueCall()
      }
    }

    _dequeueCall() {
      this.callRunning = true

      const data = this.callQueue.dequeue()
      if (this.callUrl && this.isCallConfirmed) {
        this._startCall(data)
      } else {
        this._completeCall()
      }
    }

    _startCall(data) {
      if (this.disableWithSpinner) {
        this.romoSpinner.doStart()
        this.dom.addClass('disabled')
      }
      if (this.callOnlyOnce) {
        this.setDOMData('disabled', true)
      }
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
      this.domTrigger('callStart', [xhr])
    }

    _onCallProgress(xhr) {
      this.domTrigger('callProgress', [xhr])
    }

    _onCallSuccess(responseData, status, xhr) {
      this.domTrigger('callSuccess', [responseData, xhr])
    }

    _onCallError(responseData, status, xhr) {
      this.domTrigger('callError', [responseData, xhr])
    }

    _onCallAbort(statusText, status, xhr) {
      this.domTrigger('callAbort', [xhr])
    }

    _onCallTimeout(statusText, status, xhr) {
      this.domTrigger('callTimeout', [xhr])
    }

    _onCallEnd(xhr) {
      this.domTrigger('callEnd', [xhr])
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

      this.domTrigger('callQueueEnd')
    }

    _onCallOn(e) {
      e.preventDefault()

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

Romo.addAutoInitSelector('[data-romo-ui-xhr]', Romo.UI.XHR)
