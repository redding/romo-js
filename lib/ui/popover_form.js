import '../utilities/dom_component.js'
import './form.js'

Romo.define('Romo.UI.PopoverForm', function() {
  return class extends Romo.DOMComponent {
    constructor({ dom, eventPrefix, attrPrefix, popoverOwnerClass } = {}) {
      super({
        dom:         dom,
        eventPrefix: eventPrefix,
        attrPrefix:  attrPrefix,
      })

      this.romoPopoverOwner = new popoverOwnerClass(dom)
      this._bindPopoverOwner()
    }

    get popoverAttrPrefix() {
      return this.romoPopoverOwner.romoPopover.attrPrefix
    }

    get popoverEventPrefix() {
      return this.romoPopoverOwner.romoPopover.eventPrefix
    }

    get popoverDOM() {
      return this.romoPopoverOwner.romoPopover.dom
    }

    doOpenPopover() {
      this.romoPopoverOwner.doOpenPopover()

      return this
    }

    doClosePopover() {
      this.romoPopoverOwner.doClosePopover()

      return this
    }

    doTogglePopover() {
      this.romoPopoverOwner.doTogglePopover()

      return this
    }

    doPlacePopover() {
      this.romoPopoverOwner.doPlacePopover()

      return this
    }

    // private

    _bindPopoverOwner() {
      var bindFormFn, editableContentFn

      this.dom.setDataDefault(
        `${this.popoverAttrPrefix}-popover-clear-content-on-close`,
        true
      )

      // Bind the form element when the popover is opened to cover binding
      // popovers that don't load their content via XHR.
      // Bind the form element when the popover's content is successfully
      // loaded via XHR to cover popovers that load their content via XHR.
      bindFormFn = Romo.bind(function(e) { this._bindForm() }, this)
      this.dom.on(
        `${this.popoverEventPrefix}:popoverOpened`,
        bindFormFn
      )
      this.dom.on(
        `${this.popoverEventPrefix}:loadPopoverContentSuccess`,
        bindFormFn
      )

      // If directed, manage CSS classes indicating that `this.dom` is
      // editable content. This adds bg color on hover and a pointer when the
      // dom is hovered. This also keeps the bg color applied while the
      // popover is open.
      if (this.dom.data(`${this.attrPrefix}-editable-content`)) {
        this
          .dom
          .addClass('romo-cursor-pointer')
          .removeClass(
            Romo.config.popovers.popoverFormEditableContentCSSClassFn()
          )
          .addClass(
            Romo.config.popovers.popoverFormEditableContentHoverCSSClassFn()
          )

        editableContentFn =
          Romo.bind(function(e) {
            this
              .dom
              .toggleClass(
                Romo.config.popovers.popoverFormEditableContentCSSClassFn()
              )
              .toggleClass(
                Romo.config.popovers.popoverFormEditableContentHoverCSSClassFn()
              )
          }, this)
        this
          .dom
          .on(`${this.popoverEventPrefix}:popoverOpened`, editableContentFn)
          .on(`${this.popoverEventPrefix}:popoverClosed`, editableContentFn)
      }

      this._proxyPopoverTriggeredEvents(
        'triggerOpenPopover',
        'triggerClosePopover',
        'triggerTogglePopover',
        'triggerPlacePopover',
      )
      this._proxyPopoverEmittedEvents(
        'loadPopoverContentStart',
        'loadPopoverContentSuccess',
        'loadPopoverContentError',
        'popoverBodyUpdated',
        'popoverOpened',
        'popoverClosed',
        'popoverClosedByEsc',
      )
    }

    _bindForm() {
      const formDOM = this.popoverDOM.find('form[data-romo-ui-popover-form]')
      const initializedDataAttr = `${this.attrPrefix}-form-initialized`
      const popoverDOMSubmits = this.popoverDOM.find('[data-romo-ui-form-submit]')
      const popoverDOMSubmitSpinners =
        this.popoverDOM.find(
          '[data-romo-ui-form-submit][data-romo-ui-spinner], ' +
          '[data-romo-ui-form-submit-spinner][data-romo-ui-spinner]'
        )

      if (formDOM.length !== 0 && formDOM.data(initializedDataAttr) !== true) {
        this.romoForm =
          new Romo.UI.Form(
            formDOM,
            {
              givenSubmits:        popoverDOMSubmits,
              givenSubmitSpinners: popoverDOMSubmitSpinners,
            }
          )
        formDOM.setData(initializedDataAttr, true)

        this._proxyFormTriggeredEvents(
          'triggerSubmit',
          'triggerSubmitSpinnersStart',
          'triggerSubmitSpinnersStop',
          'triggerRemoveErrorMessages'
        )
        this._proxyFormEmittedEvents(
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

        formDOM.on('Romo.UI.Form:errorMessagesChanged', Romo.bind(function() {
          this.doPlacePopover()
        }, this))
      }

      if (this.romoForm) {
        // Delay so the form has time to bind first.
        this.pushFn(function() { this.romoForm.doStopSubmitSpinners() })
      }
    }

    _proxyPopoverTriggeredEvents(...eventNames) {
      var popoverEventName, popoverFormEventName

      eventNames.forEach(Romo.bind(function(eventName) {
        popoverEventName = `${this.popoverEventPrefix}:${eventName}`
        popoverFormEventName = `${this.eventPrefix}:${eventName}`

        Romo.proxyEvent({
          fromElement:   this.dom,
          toElement:     this.dom,
          fromEventName: popoverFormEventName,
          toEventName:   popoverEventName,
          toArgs:        [],
        })

        Romo.proxyEvent({
          fromElement:   this.popoverDOM,
          toElement:     this.popoverDOM,
          fromEventName: popoverFormEventName,
          toEventName:   popoverEventName,
          toArgs:        [],
        })
      }, this))
    }

    _proxyPopoverEmittedEvents(...eventNames) {
      var popoverEventName, popoverFormEventName

      eventNames.forEach(Romo.bind(function(eventName) {
        popoverEventName = `${this.popoverEventPrefix}:${eventName}`
        popoverFormEventName = `${this.eventPrefix}:${eventName}`

        Romo.proxyEvent({
          fromElement:   this.dom,
          toElement:     this.dom,
          fromEventName: popoverEventName,
          toEventName:   popoverFormEventName,
          toArgs:        [this],
        })

        Romo.proxyEvent({
          fromElement:   this.popoverDOM,
          toElement:     this.popoverDOM,
          fromEventName: popoverEventName,
          toEventName:   popoverFormEventName,
          toArgs:        [this],
        })
      }, this))
    }

    _proxyFormTriggeredEvents(...eventNames) {
      var formEventName, popoverFormEventName

      eventNames.forEach(Romo.bind(function(eventName) {
        formEventName = `Romo.UI.Form:${eventName}`
        popoverFormEventName = `${this.eventPrefix}:${eventName}`

        Romo.proxyEvent({
          fromElement:   this.dom,
          toElement:     this.romoForm.dom,
          fromEventName: popoverFormEventName,
          toEventName:   formEventName,
          toArgs:        [],
        })
      }, this))
    }

    _proxyFormEmittedEvents(...eventNames) {
      var formEventName, popoverFormEventName

      eventNames.forEach(Romo.bind(function(eventName) {
        formEventName = `Romo.UI.Form:${eventName}`
        popoverFormEventName = `${this.eventPrefix}:${eventName}`

        Romo.proxyEvent({
          fromElement:   this.romoForm.dom,
          toElement:     this.dom,
          fromEventName: formEventName,
          toEventName:   popoverFormEventName,
          toArgs:        [this],
        })
      }, this))
    }
  }
})
