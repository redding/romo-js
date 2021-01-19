Romo.define('Romo.UI.Popover', function() {
  return class {
    constructor(popoverOwner, options) {
      this.popoverOwner = popoverOwner
      this.attrPrefix = options.attrPrefix
      this.eventPrefix = options.eventPrefix

      this._bindOwner()
    }

    static get headerSpacingPx() {
      return Romo.config.popovers.headerSpacingPxFn()
    }

    static get footerSpacingPx() {
      return Romo.config.popovers.footerSpacingPxFn()
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
       data-romo-spinner
       style="display:none">
  </div>
</div>
`
    }

    get appendReceiverDOM() {
      return Romo.memoize(this, 'appendReceiverDOM', function() {
        const closestSelector =
          this.popoverOwner.dom.data(
            `${this.attrPrefix}-popover-append-to-closest-selector`
          )

        if (closestSelector) {
          return this.popoverOwner.dom.closest(closestSelector)
        } else {
          return Romo.f(
            this.popoverOwner.dom.data(
              `${this.attrPrefix}-popover-append-to-selector`
            ) ||
            'body'
          )
        }
      })
    }

    get isOpen() {
      return this.dom.hasClass(`${this.attrPrefix}-popover-open`) === true
    }

    get isClosed() {
      return this.dom.hasClass(`${this.attrPrefix}-popover-open`) === false
    }

    doOpen() {
      Romo.ui.popoverStack.doAddPopover(
        this.dom,
        Romo.bind(this._popoverStackOpen, this),
        Romo.bind(this._popoverStackClose, this),
        Romo.bind(this._popoverStackPlace, this)
      )

      return this
    }

    doClose() {
      Romo.ui.popoverStack.doCloseThru(this.dom)

      return this
    }

    doToggle() {
      if (this.isOpen) {
        Romo.pushFn(Romo.bind(this.doClose, this))
      } else {
        Romo.pushFn(Romo.bind(this.doOpen, this))
      }

      return this
    }

    doUpdateBody(content) {
      this._updateBody(content)
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

    // private

    _bindOwner() {
      this.popoverOwner.dom.setDataDefault(
        `${this.attrPrefix}-popover-css-class`,
        ''
      )
      // By default, account for the fixed header/footer nav bar heights.
      this.popoverOwner.dom.setDataDefault(
        `${this.attrPrefix}-popover-max-height-detect-pad-px-top`,
        this.class.headerSpacingPx
      )
      this.popoverOwner.dom.setDataDefault(
        `${this.attrPrefix}-popover-max-height-detect-pad-px-bottom`,
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
        Romo.pushFn(Romo.bind(this.doOpen, this))
      }
    }

    _onTriggerClosePopover(e) {
      if (!this.popoverOwner.isDisabled && this.isOpen) {
        Romo.pushFn(Romo.bind(this.doClose, this))
      }
    }

    _onTriggerTogglePopover(e) {
      if (
        !this.popoverOwner.isDisabled &&
        this.popoverOwner.dom.data(`${this.attrPrefix}-disable-toggle`) !== true
      ) {
        this.doToggle()
      }
    }

    _onTriggerPlacePopover(e) {
      if (!this.popoverOwner.isDisabled) {
        if (!this.popoverOwner.isDisabled && this.isOpen) {
          Romo.pushFn(Romo.bind(this._place, this))
        }
      }
    }

    _bindXHR() {
      const xhr = new Romo.XHR(this.popoverOwner.dom)
      xhr.doUnbindCallOn()

      this.popoverOwner.dom.on(
        'Romo.XHR:callStart',
        Romo.bind(function(e, romoXHR) {
          this._startSpinner()
          this.popoverOwner.dom.trigger(
            `${this.eventPrefix}:loadPopoverContentStart`,
            [this.popoverOwner]
          )
        }, this)
      )

      this.popoverOwner.dom.on(
        'Romo.XHR:callSuccess',
        Romo.bind(function(e, romoXHR, data) {
          this._stopSpinner(data)
          this.popoverOwner.dom.trigger(
            `${this.eventPrefix}:loadPopoverContentSuccess`,
            [this.popoverOwner, data]
          )
        }, this)
      )

      this.popoverOwner.dom.on(
        'Romo.XHR:callError',
        Romo.bind(function(e, romoXHR, xhr) {
          this._stopSpinner('')
          this.popoverOwner.dom.trigger(
            `${this.eventPrefix}:loadPopoverContentError`,
            [this.popoverOwner, xhr]
          )
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
          Romo.ui.popoverStack.doCloseThru(this.dom)
        }, this)
      )
      dom.on(
        'Romo.UI.PopoverStack:popoverClosedByEsc',
        Romo.bind(function(e, romoPopoverStack) {
          this.popoverOwner.dom.trigger(
            `${this.eventPrefix}:popoverClosedByEsc`,
            [this.popoverOwner]
          )
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
      Romo.pushFn(Romo.bind(function() {
        Romo.append(this.appendReceiverDOM, this.dom)

        this.bodyDOM =
          this.dom.children(`[data-${this.attrPrefix}-popover-body]`)
        this.bodyDOM.addClass(
          this.popoverOwner.dom.data(`${this.attrPrefix}-popover-css-class`)
        )

        this.spinnerDOM =
          this.dom.children(`[data-${this.attrPrefix}-popover-spinner]`)

        this._bindBody()
      }, this))

      this.popoverOwner.dom.trigger(
        `${this.eventPrefix}:popoverBound`,
        [this.popoverOwner]
      )

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

      this.popoverOwner.dom.setDataDefault(
        `${this.attrPrefix}-popover-max-width`,
        'auto',
      )
      if (
        this.popoverOwner.dom.data(`${this.attrPrefix}-popover-width`) ===
        'element'
      ) {
        this.dom.setStyle('width', this.popoverOwner.dom.width() + 'px')
      } else {
        if (
          this.popoverOwner.dom.data(`${this.attrPrefix}-popover-max-width`) !==
          'auto'
        ) {
          this.contentDOM.setStyle(
            'max-width',
            this.popoverOwner.dom.data(`${this.attrPrefix}-popover-max-width`)
          )
        }
        this.contentDOM.batchSetStyle({
          'min-width':
            this.popoverOwner.dom.data(`${this.attrPrefix}-popover-min-width`),
          width:
            this.popoverOwner.dom.data(`${this.attrPrefix}-popover-width`),
        })
      }

      this.popoverOwner.dom.setDataDefault(
        `${this.attrPrefix}-popover-max-height`,
        'auto'
      )
      if (
        this.popoverOwner.dom.data(`${this.attrPrefix}-popover-max-height`) !==
        'auto'
      ) {
        this.contentDOM.setStyle(
          'max-height',
          this.popoverOwner.dom.data(`${this.attrPrefix}-popover-max-height`)
        )
      }
      this.contentDOM.batchSetStyle({
        'min-height':
          this.popoverOwner.dom.data(`${this.attrPrefix}-popover-min-height`),
        height:
          this.popoverOwner.dom.data(`${this.attrPrefix}-popover-height`),
        'overflow-x':
          this.popoverOwner.dom.data(`${this.attrPrefix}-popover-overflow-x`) ||
          'auto',
        'overflow-y':
          this.popoverOwner.dom.data(`${this.attrPrefix}-popover-overflow-y`) ||
          'auto',
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
      e.stopPropagation()

      this.popoverOwner.doClosePopover()
    }

    _startSpinner() {
      this.spinnerDOM.trigger('Romo.Spinner:triggerStart')
      this.spinnerDOM.show()
      this.bodyDOM.hide()
      this._updateBody('')
      this._place()
    }

    _stopSpinner(content) {
      this.spinnerDOM.trigger('Romo.Spinner:triggerStop')
      this.spinnerDOM.hide()
      this.bodyDOM.show()
      this._updateBody(content)
      this._place()
    }

    _popoverStackOpen() {
      this.popoverOwner.dom.scrollableParents().on(
        'scroll',
        this._onScrollableParentsScroll
      )

      this.dom.addClass(`${this.attrPrefix}-popover-open`)
      if (
        this.popoverOwner.dom.data(
          `${this.attrPrefix}-popover-content-selector`
        )
      ) {
        this._updateBody(
          Romo
            .f(
              this.popoverOwner.dom.data(
                `${this.attrPrefix}-popover-content-selector`
              )
            )
            .firstElement
            .innerHTML
        )
        this._place()
      } else if (this.popoverOwner.dom.data('romo-xhr-disabled')) {
        this._place()
      } else {
        this.romoXHR.doCall()
      }

      this.popoverOwner.dom.trigger(
        `${this.eventPrefix}:popoverOpened`,
        [this.popoverOwner]
      )
    }

    _popoverStackClose() {
      this.dom.removeClass(`${this.attrPrefix}-popover-open`)

      this.popoverOwner.dom.scrollableParents().off(
        'scroll',
        this._onScrollableParentsScroll
      )

      if (
        this.popoverOwner.dom.data(
          `${this.attrPrefix}-popover-clear-content-on-close`
        ) === true
      ) {
        this._updateBody('')
      }

      this.popoverOwner.dom.trigger(
        `${this.eventPrefix}:popoverClosed`,
        [this.popoverOwner]
      )
    }

    _popoverStackPlace() {
      this.popoverOwner.doPlacePopover()
    }

    _onScrollableParentsScroll(e) {
      Romo.ui.popoverStack.doPlaceAllPopovers()
    }

    _updateBody(contentHTMLString) {
      Romo.updateHTML(this.bodyDOM, contentHTMLString)
      this._bindBody()

      this.popoverOwner.dom.trigger(
        `${this.eventPrefix}:popoverBodyUpdated`,
        [this.popoverOwner, this.bodyDOM]
      )
    }

    _place() {
      this._popoverStackPlace()
      Romo.pushFn(Romo.bind(this._popoverStackPlace, this))
    }
  }
})
