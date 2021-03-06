import '../utilities/dom_component.js'

Romo.define('Romo.UI.Popover', function() {
  return class extends Romo.DOMComponent {
    constructor(popoverOwner, options) {
      super()
      this.popoverOwner = popoverOwner
      this._bindOwner()
    }

    static get headerSpacingPx() {
      return Romo.config.popovers.headerSpacingPxFn()
    }

    static get footerSpacingPx() {
      return Romo.config.popovers.footerSpacingPxFn()
    }

    get attrPrefix() {
      return this.popoverOwner.attrPrefix
    }

    get eventPrefix() {
      return this.popoverOwner.eventPrefix
    }

    get romoXHR() {
      return Romo.memoize(this, 'romoXHR', function() {
        return this._bindXHR()
      })
    }

    get dom() {
      return Romo.memoize(this, 'dom', function() {
        return this._bindPopover()
      })
    }

    get template() {
      return `
<div class="${this.attrPrefix}-popover"
     data-${this.attrPrefix}-popover
     data-romo-ui-popover>
  <div data-${this.attrPrefix}-popover-body></div>
  <div class="${this.attrPrefix}-popover-spinner"
       data-${this.attrPrefix}-popover-spinner
       data-romo-ui-spinner
       style="display:none">
  </div>
</div>
`
    }

    get appendReceiverDOM() {
      return Romo.memoize(this, 'appendReceiverDOM', function() {
        const closestSelector =
          this.popoverOwner.domData('popover-append-to-closest-selector')

        if (closestSelector) {
          return this.popoverOwner.dom.closest(closestSelector)
        } else {
          return Romo.f(
            this.popoverOwner.domData('popover-append-to-selector') ||
            'body'
          )
        }
      })
    }

    get isOpen() {
      return this.hasDOMClass('popover-open') === true
    }

    get isClosed() {
      return this.hasDOMClass('popover-open') === false
    }

    doOpen() {
      Romo.env.popoverStack.doAddPopover(
        this.dom,
        Romo.bind(this._popoverStackOpen, this),
        Romo.bind(this._popoverStackClose, this),
        Romo.bind(this._popoverStackPlace, this)
      )

      return this
    }

    doClose() {
      Romo.env.popoverStack.doCloseThru(this.dom)

      return this
    }

    doToggle() {
      if (this.isOpen) {
        this.pushFn(this.doClose)
      } else {
        this.pushFn(this.doOpen)
      }

      return this
    }

    doUpdateBodyHTML(contentHTML) {
      this._updateBodyHTML(contentHTML)
      this._place()

      return this
    }

    doUpdateBodyDOM(contentDOM) {
      this._updateBodyDOM(contentDOM)
      this._place()

      return this
    }

    doSetContentMaxHeightPx(heightPx) {
      const deltaHeightPx =
        this.dom.firstElement.offsetHeight -
        this.contentDOM.firstElement.offsetHeight
      this.contentDOM.setStyle(
        'max-height',
        (heightPx - deltaHeightPx).toString() + 'px'
      )

      return this
    }

    doUnsetContentMaxHeightPx() {
      this.contentDOM.rmStyle('max-height')

      return this
    }

    doSetContentMaxWidthPx(widthPx) {
      const deltaWidthPx =
        this.dom.firstElement.offsetWidth -
        this.contentDOM.firstElement.offsetWidth
      this.contentDOM.setStyle(
        'max-width',
        (widthPx - deltaWidthPx).toString() + 'px'
      )

      return this
    }

    doUnsetContentMaxWidthPx(widthPx) {
      this.contentDOM.rmStyle('max-width')

      return this
    }

    // private

    _bindOwner() {
      this.popoverOwner.setDOMDataDefault('popover-css-class', '')
      // By default, account for the fixed header/footer heights.
      this.popoverOwner.setDOMDataDefault(
        'popover-max-height-detect-pad-px-top',
        this.class.headerSpacingPx
      )
      this.popoverOwner.setDOMDataDefault(
        'popover-max-height-detect-pad-px-bottom',
        this.class.footerSpacingPx
      )

      this.popoverOwner.dom.on(
        `${this.eventPrefix}:triggerOpenPopover`,
        Romo.bind(this._onTriggerOpenPopover, this)
      )
      this.popoverOwner.dom.on(
        `${this.eventPrefix}:triggerClosePopover`,
        Romo.bind(this._onTriggerClosePopover, this)
      )
      this.popoverOwner.dom.on(
        `${this.eventPrefix}:triggerTogglePopover`,
        Romo.bind(this._onTriggerTogglePopover, this)
      )
      this.popoverOwner.dom.on(
        `${this.eventPrefix}:triggerPlacePopover`,
        Romo.bind(this._onTriggerPlacePopover, this)
      )
    }

    _onTriggerOpenPopover(e) {
      if (!this.popoverOwner.isDisabled && this.isClosed) {
        this.pushFn(this.doOpen)
      }
    }

    _onTriggerClosePopover(e) {
      if (!this.popoverOwner.isDisabled && this.isOpen) {
        this.pushFn(this.doClose)
      }
    }

    _onTriggerTogglePopover(e) {
      if (
        !this.popoverOwner.isDisabled &&
        this.popoverOwner.domData('disable-toggle') !== true
      ) {
        this.doToggle()
      }
    }

    _onTriggerPlacePopover(e) {
      if (!this.popoverOwner.isDisabled && this.isOpen) {
        this.pushFn(this._place)
      }
    }

    _bindXHR() {
      const xhr = new Romo.UI.XHR(this.popoverOwner.dom)
      xhr.doUnbindCallOn()

      this.popoverOwner.on(
        'Romo.UI.XHR:callStart',
        Romo.bind(function(e, romoXHR) {
          this._startSpinner()
          this.popoverOwner.domTrigger('loadPopoverContentStart')
        }, this)
      )

      this.popoverOwner.on(
        'Romo.UI.XHR:callSuccess',
        Romo.bind(function(e, romoXHR, data) {
          this._stopSpinner(data)
          this.popoverOwner.domTrigger('loadPopoverContentSuccess', [data])
        }, this)
      )

      this.popoverOwner.on(
        'Romo.UI.XHR:callError',
        Romo.bind(function(e, romoXHR, xhr) {
          this._stopSpinner('')
          this.popoverOwner.domTrigger('loadPopoverContentError', [xhr])
        }, this)
      )

      return xhr
    }

    _bindPopover() {
      const dom = Romo.dom(Romo.elements(this.template))

      dom.setStyle('z-index', this.popoverOwner.dom.zIndex() + 1000)

      Romo.childElementSet.add(this.popoverOwner.dom, [dom])
      dom.on(
        'Romo.ChildElementSet:removed',
        Romo.bind(function(e, romoChildElementSet) {
          Romo.env.popoverStack.doCloseThru(this.dom)
        }, this)
      )
      dom.on(
        'Romo.PopoverStack:popoverClosedByEsc',
        Romo.bind(function(e, romoPopoverStack) {
          this.popoverOwner.domTrigger('popoverClosedByEsc')
        }, this)
      )

      dom.on(
        `${this.eventPrefix}:triggerOpenPopover`,
        Romo.bind(this._onTriggerOpenPopover, this)
      )
      dom.on(
        `${this.eventPrefix}:triggerClosePopover`,
        Romo.bind(this._onTriggerClosePopover, this)
      )
      dom.on(
        `${this.eventPrefix}:triggerTogglePopover`,
        Romo.bind(this._onTriggerTogglePopover, this)
      )
      dom.on(
        `${this.eventPrefix}:triggerPlacePopover`,
        Romo.bind(this._onTriggerPlacePopover, this)
      )

      // Run in a pushFn to allow the onReady auto init callbacks to run.
      this.pushFn(function() {
        Romo.append(this.appendReceiverDOM, this.dom)

        this.bodyDOM =
          this.dom.children(`[data-${this.attrPrefix}-popover-body]`)
        this.bodyDOM.addClass(this.popoverOwner.domData('popover-css-class'))

        this.spinnerDOM =
          this.dom.children(`[data-${this.attrPrefix}-popover-spinner]`)

        this._bindBody()
      })

      this.popoverOwner.domTrigger('popoverBound')

      return dom
    }

    _bindBody() {
      this._resetBodyContent()

      this.contentDOM =
        this.bodyDOM.find(`[data-${this.attrPrefix}-popover-content]`)
      if (this.contentDOM.length === 0) {
        this.contentDOM = this.bodyDOM
      }

      this.dom.find(`[data-${this.attrPrefix}-popover-close]`).on(
        'click',
        Romo.bind(this._onPopoverCloseClick, this),
      )

      if (this.popoverOwner.domData('popover-width') === 'element') {
        this.dom.setStyle('width', this.popoverOwner.dom.width() + 'px')
      } else {
        this.dom.setStyle(
          'width',
          this.popoverOwner.domData('popover-width')
        )
      }
      if (this.popoverOwner.domData('popover-max-width') === 'element') {
        this.dom.setStyle('max-width', this.popoverOwner.dom.width() + 'px')
      } else {
        this.dom.setStyle(
          'max-width',
          this.popoverOwner.domData('popover-max-width')
        )
      }
      if (this.popoverOwner.domData('popover-min-width') === 'element') {
        this.dom.setStyle('min-width', this.popoverOwner.dom.width() + 'px')
      } else {
        this.dom.setStyle(
          'min-width',
          this.popoverOwner.domData('popover-min-width')
        )
      }

      this.popoverOwner.setDOMDataDefault('popover-max-height', 'auto')
      if (this.popoverOwner.domData('popover-max-height') !== 'auto') {
        this.contentDOM.setStyle(
          'max-height',
          this.popoverOwner.domData('popover-max-height')
        )
      }
      this.contentDOM.batchSetStyle({
        'min-height': this.popoverOwner.domData('popover-min-height'),
        height:       this.popoverOwner.domData('popover-height'),
        'overflow-x': this.popoverOwner.domData('popover-overflow-x') || 'auto',
        'overflow-y': this.popoverOwner.domData('popover-overflow-y') || 'auto',
      })
    }

    _resetBodyContent() {
      if (this.contentDOM) {
        this.contentDOM.batchSetStyle({
          'min-width':  '',
          'max-width':  '',
          width:        '',
          'min-height': '',
          'max-height': '',
          height:       '',
          'overflow-x': 'auto',
          'overflow-y': 'auto',
        })
      }

      this.dom.find(`[data-${this.attrPrefix}-popover-close]`).off(
        'click',
        Romo.bind(this._onPopoverCloseClick, this),
      )
    }

    _onPopoverCloseClick(e) {
      e.preventDefault()
      this.popoverOwner.doClosePopover()
    }

    _startSpinner() {
      this.spinnerDOM.trigger('Romo.UI.Spinner:triggerStart')
      this.spinnerDOM.show()
      this.bodyDOM.hide()
      this._updateBodyHTML('')
      this._place()
    }

    _stopSpinner(contentHTML) {
      this.spinnerDOM.trigger('Romo.UI.Spinner:triggerStop')
      this.spinnerDOM.hide()
      this.bodyDOM.show()
      this._updateBodyHTML(contentHTML)
      this._place()
    }

    _popoverStackOpen() {
      this.popoverOwner.dom.scrollableParents().on(
        'scroll',
        this._onScrollableParentsScroll
      )

      this.addDOMClass('popover-open')
      if (this.popoverOwner.domData('popover-content-selector')) {
        this._updateBodyHTML(
          Romo
            .f(this.popoverOwner.domData('popover-content-selector'))
            .firstElement
            .innerHTML
        )
        this._place()
      } else if (this.popoverOwner.dom.data('romo-ui-xhr-disabled')) {
        this._place()
      } else {
        this.romoXHR.doCall()
      }

      this.popoverOwner.domTrigger('popoverOpened')
    }

    _popoverStackClose() {
      this.removeDOMClass('popover-open')

      this.popoverOwner.dom.scrollableParents().off(
        'scroll',
        this._onScrollableParentsScroll
      )

      if (this.popoverOwner.domData('popover-clear-content-on-close') === true) {
        this._updateBodyHTML('')
      }

      this.popoverOwner.domTrigger('popoverClosed')
    }

    _popoverStackPlace() {
      this.popoverOwner.doPlacePopover()
    }

    _onScrollableParentsScroll(e) {
      Romo.env.popoverStack.doPlaceAllPopovers()
    }

    _updateBodyHTML(contentHTML) {
      this.bodyDOM.updateHTML(contentHTML)
      this._bindBody()

      this.popoverOwner.domTrigger('popoverBodyUpdated', [this.bodyDOM])
    }

    _updateBodyDOM(contentDOM) {
      this.bodyDOM.update(contentDOM)
      this._bindBody()

      this.popoverOwner.domTrigger('popoverBodyUpdated', [this.bodyDOM])
    }

    _place() {
      this._popoverStackPlace()
      this.pushFn(this._popoverStackPlace)
    }
  }
})
