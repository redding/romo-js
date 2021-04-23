Romo.define('Romo.UI.IndicatorTextInput.Indicator', function() {
  return class {
    constructor({
      indicatorTextInputDOM,
      iconName,
      iconCSSClass,
      widthPx,
      spinnerSizePx,
      spacingPx,
      position,
    } = {}) {
      this.indicatorTextInputDOM = indicatorTextInputDOM
      this.iconName = iconName
      this.iconCSSClass = iconCSSClass
      this._widthPx = widthPx
      this._spinnerSizePx = spinnerSizePx
      this._spacingPx = spacingPx
      this._position = position

      this._bind()
    }

    static get spinnerDataName() {
      return 'data-romo-ui-indicator-text-input-indicator-spinner'
    }

    static get clickedEventName() {
      return 'Romo.UI.IndicatorTextInput.Indicator:clicked'
    }

    static get defaultPosition() {
      return Romo.config.indicatorTextInput.defaultIndicatorPositionFn()
    }

    static get defaultSpacingPx() {
      return Romo.config.indicatorTextInput.defaultIndicatorSpacingPxFn()
    }

    static defaultSpinnerSizePx(spinnerDOM) {
      return spinnerDOM.css('font-size')
    }

    get widthPx() {
      return this._widthPx || this.dom.width()
    }

    get spinnerSizePx() {
      return this._spinnerSizePx || this.class.defaultSpinnerSizePx(this.spinnerDOM)
    }

    get spacingPx() {
      return this._spacingPx || this.class.defaultSpacingPx
    }

    get position() {
      return this._position || this.class.defaultPosition
    }

    get spinnerDOM() {
      return Romo.memoize(this, 'spinnerDOM', function() {
        return this.dom.find(`[${this.class.spinnerDataName}]`)
      })
    }

    get dom() {
      return Romo.memoize(this, 'dom', function() {
        return Romo.dom(Romo.elements(this.template))
      })
    }

    get template() {
      return `
<div data-romo-ui-indicator-text-input-indicator>
  <div ${this.class.spinnerDataName}>
    ${Romo.config.indicatorTextInput.indicatorIconTemplateFn(this.iconName, this.iconCSSClass)}
  </div>
</div>
`
    }

    doPlace() {
      const position = this.position

      this.indicatorTextInputDOM.batchSetStyle({
        'padding-left':  '',
        'padding-right': '',
      })

      if (this.iconName !== undefined && this.dom.css('display') !== 'none') {
        this.dom.setStyle('line-height', `${this.indicatorTextInputDOM.height()}px`)

        if (this.indicatorTextInputDOM.hasProp('disabled') === true) {
          this.dom.addClass('disabled')
        }

        if (this.indicatorTextInputDOM.css('display') === 'none') {
          this.dom.hide()
        }

        const spacingPx = parseInt(this.spacingPx, 10)
        const widthPx = parseInt(this.widthPx, 10)
        const inputPaddingPx = spacingPx + widthPx + spacingPx

        var spinnerSizePx = parseInt(this.spinnerSizePx, 10)
        if (isNaN(spinnerSizePx)) {
          spinnerSizePx = ''
        }
        this.spinnerDOM.setData('romo-ui-spinner-size-px', this.spinnerSizePx)

        // add a pixel to account for the default input border
        this.dom.setStyle(position, `${spacingPx + 1}px`)
        this.indicatorTextInputDOM.setStyle(`padding-${position}`, `${inputPaddingPx}px`)
      }
    }

    doStartSpinner() {
      this.spinnerDOM.trigger('Romo.UI.Spinner:triggerStart')
    }

    doStopSpinner() {
      this.spinnerDOM.trigger('Romo.UI.Spinner:triggerStop')
    }

    doRemove() {
      this.dom.remove()
    }

    // private

    _bind() {
      if (this.iconName !== undefined) {
        this.dom.on(
          'click',
          Romo.bind(function(e) {
            e.preventDefault()
            e.stopPropagation()

            this.dom.trigger(this.class.clickedEventName)
          }, this)
        )

        new Romo.UI.Spinner(this.spinnerDOM)
      }
    }
  }
})
