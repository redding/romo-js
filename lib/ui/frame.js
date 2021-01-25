import '../utilities/dom_component.js'

Romo.define('Romo.UI.Frame', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super({
        dom:         dom,
        attrPrefix:  'romo-ui-frame',
        eventPrefix: 'Romo.UI.Frame',
      })

      this._contentStack = []
      this._bind()
    }

    get contentStackSize() {
      return this._contentStack.length
    }

    get isContentStackEmpty() {
      return this.contentStackSize === 0
    }

    doPushContent(contentHTMLOrJSON) {
      if (contentHTMLOrJSON) {
        this._pushContent()
        const contentHTML = this._updateContent(contentHTMLOrJSON)
        this.domTrigger('contentPushed', [contentHTML])
      }

      return this
    }

    doPopContent() {
      if (!this.isContentStackEmpty) {
        const contentHTML = this._contentStack.pop()
        this._updateContent(contentHTML)
        this.domTrigger('contentPopped')
      }

      return this
    }

    doClearContentStack() {
      this._contentStack = []
      this.domTrigger('contentStackCleared')

      return this
    }

    // private

    _bind() {
      this.domOn('triggerPushContent', function(e, contentHTMLOrJSON) {
        this.doPushContent(contentHTMLOrJSON)
      })
      this.domOn('triggerPopContent', function() { this.doPopContent() })
      this._bindContent()
    }

    _bindContent() {
      this._bindPops()
      this._bindXHRs()
      this._bindForm()
    }

    _bindPops() {
      this.dom.find('[data-romo-ui-frame-pop]').on(
        'click',
        Romo.bind(function(e) {
          e.preventDefault()
          this.doPopContent()
        }, this)
      )
    }

    _bindXHRs() {
      const xhrDOMs = this.dom.find('[data-romo-ui-frame-xhr]')
      xhrDOMs.forEach(function(xhrDOM) {
        new Romo.XHR(xhrDOM)
      })
      xhrDOMs.on('Romo.XHR:callStart', Romo.bind(function(e, romoXHR) {
        romoXHR.dom.trigger('Romo.UI.Spinner:triggerStart')
      }, this))
      xhrDOMs.on(
        'Romo.XHR:callSuccess',
        Romo.bind(function(e, romoXHR, data, xhr) {
          this._xhrCallSuccessData = data
        }, this)
      )
      xhrDOMs.on('Romo.XHR:callEnd', Romo.bind(function(e, romoXHR) {
        if (romoXHR.dom.is('[data-romo-ui-spinner]')) {
          romoXHR.dom.trigger('Romo.UI.Spinner:triggerStop')
        } else {
          this._pushXHRSuccessData()
        }
      }, this))
      xhrDOMs.on('Romo.UI.Spinner:stopped', Romo.bind(function(e, romoSpinner) {
        this._pushXHRSuccessData()
      }, this))
    }

    _bindForm() {
      const formDOM = this.dom.find('[data-romo-ui-frame-form]')
      var romoForm
      const domSubmits = this.dom.find('[data-romo-form-submit]')
      const domSubmitSpinners =
        this.dom.find(
          '[data-romo-form-submit][data-romo-ui-spinner], ' +
          '[data-romo-form-submit-spinner][data-romo-ui-spinner]'
        )

      if (formDOM.length !== 0) {
        romoForm =
          new Romo.Form(
            formDOM,
            {
              givenSubmits:        domSubmits,
              givenSubmitSpinners: domSubmitSpinners,
            }
          )

        this._proxyFormTriggeredEvents(
          romoForm,
          'triggerSubmit',
          'triggerSubmitSpinnersStart',
          'triggerSubmitSpinnersStop',
          'triggerRemoveErrorMessages'
        )
        this._proxyFormEmittedEvents(
          romoForm,
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

        formDOM.on(
          'Romo.Form:submitSuccess',
          Romo.bind(function(e, romoForm, data, xhr) {
            this.doPushContent(data)
          }, this)
        )

        // Delay so the form has time to bind first.
        Romo.pushFn(Romo.bind(function() {
          romoForm.doStopSubmitSpinners()
        }, this))
      }
    }

    _proxyFormTriggeredEvents(romoForm, ...eventNames) {
      var formEventName, frameFormEventName

      eventNames.forEach(Romo.bind(function(eventName) {
        formEventName = `Romo.Form:${eventName}`
        frameFormEventName = `Romo.UI.FrameForm:${eventName}`

        Romo.proxyEvent({
          fromElement:   this.dom,
          toElement:     romoForm.dom,
          fromEventName: frameFormEventName,
          toEventName:   formEventName,
          toArgs:        [],
        })
      }, this))
    }

    _proxyFormEmittedEvents(romoForm, ...eventNames) {
      var formEventName, frameFormEventName

      eventNames.forEach(Romo.bind(function(eventName) {
        formEventName = `Romo.Form:${eventName}`
        frameFormEventName = `Romo.UI.FrameForm:${eventName}`

        Romo.proxyEvent({
          fromElement:   romoForm.dom,
          toElement:     this.dom,
          fromEventName: formEventName,
          toEventName:   frameFormEventName,
          toArgs:        [this],
        })
      }, this))
    }

    _pushXHRSuccessData() {
      this.doPushContent(this._xhrCallSuccessData)
      this._xhrCallSuccessData = undefined
    }

    _pushContent() {
      this._contentStack.push(this.dom.innerHTML)
    }

    _updateContent(contentHTMLOrJSON) {
      var contentHTML
      if (typeof contentHTMLOrJSON === 'string') {
        contentHTML = contentHTMLOrJSON
      } else {
        contentHTML = contentHTMLOrJSON.frameContentHTML
      }

      if (contentHTML) {
        this.dom.updateHTML(contentHTML)
        this._bindContent()
      }

      return contentHTML
    }
  }
})

Romo.addAutoInitSelector('[data-romo-ui-frame]', Romo.UI.Frame)
Romo.addAutoInitSelector('romo-ui-frame', Romo.UI.Frame)
