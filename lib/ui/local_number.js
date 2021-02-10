import '../utilities/dom_component.js'

// Romo.UI.LocalTime renders numbers using the browser's local format.
Romo.define('Romo.UI.LocalNumber', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

      this._bind()
    }

    static get attrPrefix() {
      return 'romo-ui-local-number'
    }

    static get defaultLocale() {
      return (new Intl.NumberFormat()).resolvedOptions().locale
    }

    get locale() {
      return this.domData('locale')
    }

    get shouldShowAsTitle() {
      return this.domData('show-as-title') === true
    }

    get isRomoTooltip() {
      return this.dom.hasData('romo-ui-tooltip')
    }

    get compactDisplay() {
      return this.domData('compact-display')
    }

    get currency() {
      return this.domData('currency')
    }

    get currencyDisplay() {
      return this.domData('currency-display')
    }

    get currencySign() {
      return this.domData('currency-sign')
    }

    get notation() {
      return this.domData('notation')
    }

    get numberingSystem() {
      return this.domData('numbering-system')
    }

    get signDisplay() {
      return this.domData('sign-display')
    }

    get style() {
      return this.domData('style')
    }

    get unit() {
      return this.domData('unit')
    }

    get unitDisplay() {
      return this.domData('unit-display')
    }

    get useGrouping() {
      return this.domData('use-grouping')
    }

    get minimumIntegerDigits() {
      return this.domData('minimum-integer-digits')
    }

    get minimumFractionDigits() {
      return this.domData('minimum-fraction-digits')
    }

    get maximumFractionDigits() {
      return this.domData('maximum-fraction-digits')
    }

    get minimumSignificantDigits() {
      return this.domData('minimum-significant-digits')
    }

    get maximumSignificantDigits() {
      return this.domData('maximum-significant-digits')
    }

    get numberFormatOptions() {
      return {

        compactDisplay:           this.compactDisplay,
        currency:                 this.currency,
        currencyDisplay:          this.currencyDisplay,
        currencySign:             this.currencySign,
        notation:                 this.notation,
        numberingSystem:          this.numberingSystem,
        signDisplay:              this.signDisplay,
        style:                    this.style,
        unit:                     this.unit,
        unitDisplay:              this.unitDisplay,
        useGrouping:              this.useGrouping,
        minimumIntegerDigits:     this.minimumIntegerDigits,
        minimumFractionDigits:    this.minimumFractionDigits,
        maximumFractionDigits:    this.maximumFractionDigits,
        minimumSignificantDigits: this.minimumSignificantDigits,
        maximumSignificantDigits: this.maximumSignificantDigits,
      }
    }

    get value() {
      return this.domData('value')
    }

    get numberFormat() {
      return new Intl.NumberFormat(this.locale, this.numberFormatOptions)
    }

    doRefresh() {
      const formattedValue = this.numberFormat.format(this.value)

      if (this.shouldShowAsTitle) {
        this.dom.setAttr('title', formattedValue)
      } else {
        this.dom.rmAttr('title', formattedValue)
      }
      if (this.isRomoTooltip) {
        this.dom.trigger(
          'Romo.UI.Tooltip:triggerUpdateBubbleContent',
          [formattedValue]
        )
      }
      if (!this.shouldShowAsTitle && !this.isRomoTooltip) {
        this.dom.updateText(formattedValue)
      }

      this.setDOMData('formatted', true)

      return this
    }

    // private

    _bind() {
      this.setDOMDataDefault('locale', 'default')
      if (this.dom.tagName() === 'currency') {
        Romo.config.localNumber.applyCurrencyTagDefaultsFn(this)
      }
      if (this.dom.tagName() === 'decimal') {
        Romo.config.localNumber.applyDecimalTagDefaultsFn(this)
      }
      if (this.dom.tagName() === 'percent') {
        Romo.config.localNumber.applyPercentTagDefaultsFn(this)
      }
      if (this.dom.tagName() === 'unit') {
        Romo.config.localNumber.applyUnitTagDefaultsFn(this)
      }

      this.domOn('triggerRefresh', function(e) { this.doRefresh() })

      this.doRefresh()
    }
  }
})

Romo.addAutoInitSelector(`[data-${Romo.UI.LocalNumber.attrPrefix}]`, Romo.UI.LocalNumber)
