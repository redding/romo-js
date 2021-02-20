import '../utilities/dom_component.js'
import './indicator_text_input/indicator.js'
import './indicator_text_input/wrapper.js'

Romo.define('Romo.UI.IndicatorTextInput', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

      this._bind()
    }

    static get attrPrefix() {
      return 'romo-ui-indicator-text-input'
    }

    get cssClass() {
      return this.domData('css-class')
    }

    get indicatorIconName() {
      return this.domData('indicator-icon-name')
    }

    get indicatorIconCSSClass() {
      return this.domData('indicator-icon-css-class')
    }

    get indicatorPosition() {
      return this.domData('indicator-position')
    }

    get indicatorSpacingPx() {
      return this.domData('indicator-spacing-px')
    }

    get indicatorWidthPx() {
      return this.domData('indicator-width-px')
    }

    get indicatorSpinnerSizePx() {
      return this.domData('indicator-spinner-size-px')
    }

    get wrapperDisplayStyle() {
      return this.dom.css('display')
    }

    get wrapperDOM() {
      return this.wrapper.dom
    }

    get indicatorDOM() {
      return this.indicator.dom
    }

    get indicatorSpinnerDOM() {
      return this.indicator.spinnerDOM
    }

    doEnable() {
      this.dom.rmProp('disabled')
      this.dom.removeClass('disabled')
      this.indicatorDOM.removeClass('disabled')
    }

    doDisable() {
      this.dom.setProp('disabled')
      this.dom.addClass('disabled')
      this.indicatorDOM.addClass('disabled')
    }

    doShow() {
      this.wrapperDOM.show()
      this.indicator.doPlace()
    }

    doHide() {
      this.wrapperDOM.hide()
    }

    doShowIndicator() {
      this.indicatorDOM.show()
      this.indicator.doPlace()
    }

    doHideIndicator() {
      this.indicatorDOM.hide()
      this.indicator.doPlace()
    }

    doStartIndicatorSpinner() {
      this.indicator.doStartSpinner()
    }

    doStopIndicatorSpinner() {
      this.indicator.doStopSpinner()
    }

    doResetIndicator() {
      this.indicator.doRemove()
      this._bindIndicator()
    }

    // private

    _bind() {
      // TODO: make this late-bound and only execute when the element becomes
      // "visible" somehow.
      this._bindWrapper()
      this._bindIndicator()

      this.domOn('triggerEnable', function(e) {
        this.doEnable()
      })
      this.domOn('triggerDisable', function(e) {
        this.doDisable()
      })
      this.domOn('triggerShow', function(e) {
        this.doShow()
      })
      this.domOn('triggerHide', function(e) {
        this.doHide()
      })
      this.domOn('triggerShowIndicator', function(e) {
        this.doShowIndicator()
      })
      this.domOn('triggerHideIndicator', function(e) {
        this.doHideIndicator()
      })
      this.domOn('triggerStartIndicatorSpinner', function(e) {
        this.doStartIndicatorSpinner()
      })
      this.domOn('triggerStopIndicatorSpinner', function(e) {
        this.doStopIndicatorSpinner()
      })
      this.domOn('triggerResetIndicator', function(e) {
        this.doResetIndicator()
      })
    }

    _bindWrapper() {
      this.wrapper =
        new Romo.UI.IndicatorTextInput.Wrapper({
          indicatorTextInputDOM: this.dom,
          cssClass:              this.cssClass,
        })

      if (this.wrapperDisplayStyle) {
        this.wrapper.dom.setStyle('display', this.wrapperDisplayStyle)
      } else if (this.dom.css('display')) {
        this.wrapper.dom.setStyle('display', this.dom.css('display'))
      }
    }

    _bindIndicator() {
      this.indicator =
        new Romo.UI.IndicatorTextInput.Indicator({
          indicatorTextInputDOM: this.dom,
          iconName:              this.indicatorIconName,
          iconCSSClass:          this.indicatorIconCSSClass,
          widthPx:               this.indicatorWidthPx,
          spinnerSizePx:         this.indicatorSpinnerSizePx,
          spacingPx:             this.indicatorSpacingPx,
          position:              this.indicatorPosition,
        })

      this.wrapperDOM.append(this.indicatorDOM)
      Romo.pushFn(Romo.bind(function() {
        this.indicator.doPlace()
      }, this))

      this.indicatorDOM.on(
        Romo.UI.IndicatorTextInput.Indicator.clickedEventName,
        Romo.bind(this._onIndicatorClick, this)
      )
    }

    _onIndicatorClick(e) {
      e.preventDefault()
      e.stopPropagation()

      if (this.dom.disabled !== true) {
        this.dom.firstElement.focus()
        this.domTrigger('indicatorClicked')
      }
    }
  }
})

Romo.addAutoInitSelector(`[data-${Romo.UI.IndicatorTextInput.attrPrefix}]`, Romo.UI.IndicatorTextInput)
