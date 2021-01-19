Romo.define('Romo.UI.Frame', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

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
      this._pushContent()
      const contentHTML = this._updateContent(contentHTMLOrJSON)
      this.dom.trigger('Romo.UI.Frame:contentPushed', [this, contentHTML])

      return this
    }

    doPopContent() {
      if (!this.isContentStackEmpty) {
        const contentHTML = this._contentStack.pop()
        this._updateContent(contentHTML)
        this.dom.trigger('Romo.UI.Frame:contentPopped', [this])
      }

      return this
    }

    doClearContentStack() {
      this._contentStack = []
      this.dom.trigger('Romo.UI.Frame:contentStackCleared', [this])

      return this
    }

    doStartSpinner() {
      this.romoSpinner.doStart({ startImmediately: true })

      return this
    }

    doStopSpinner() {
      this.romoSpinner.doStop({ stopImmediately: true })

      return this
    }

    // private

    _bind() {
      this._bindSpinner()

      this.dom.on(
        'Romo.UI.Frame:triggerPushContent',
        Romo.bind(function(e, contentHTMLOrJSON) {
          this.doPushContent(contentHTMLOrJSON)
        }, this)
      )
      this.dom.on('Romo.UI.Frame:triggerPopContent', Romo.bind(function() {
        this.doPopContent()
      }, this))

      this._bindContent()
    }

    _bindSpinner() {
      this.dom.setDataDefault(
        'romo-spinner-size-px',
        Romo.config.frames.defaultSpinnerHeightPxFn(this.dom)
      )

      this.dom.on('Romo.UI.Frame:triggerSpinnerStart', Romo.bind(function() {
        this.doStartSpinner()
      }, this))
      this.dom.on('Romo.UI.Frame:triggerSpinnerStop', Romo.bind(function() {
        this.doStopSpinner()
      }, this))

      this.romoSpinner = new Romo.Spinner(this.dom)
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
        this.doStartSpinner()
      }, this))
      xhrDOMs.on('Romo.XHR:callEnd', Romo.bind(function(e, romoXHR) {
        this.doStopSpinner()
      }, this))
      xhrDOMs.on(
        'Romo.XHR:callSuccess',
        Romo.bind(function(e, romoXHR, data, xhr) {
          // Run in a pushFn to allow callEnd event to stop the spinner first.
          Romo.pushFn(Romo.bind(function() {
            this.doPushContent(data)
          }, this))
        }, this)
      )
    }

    _bindForm() {
      const formDOM = this.dom.find('[data-romo-ui-frame-form]')
      var romoForm
      const domSubmits = this.dom.find('[data-romo-form-submit]')
      const domSubmitSpinners =
        this.dom.find(
          '[data-romo-form-submit][data-romo-spinner], ' +
          '[data-romo-form-submit-spinner][data-romo-spinner]'
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
      // bind success to push content
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