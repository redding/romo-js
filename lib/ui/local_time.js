import '../utilities/dom_component.js'

// Romo.UI.LocalTime renders UTC dates/times in the browser's local time.
Romo.define('Romo.UI.LocalTime', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super({
        dom:          dom,
        attrPrefix:  'romo-ui-local-time',
        eventPrefix: 'Romo.UI.LocalTime',
      })

      this._bind()
    }

    static get defaultLocale() {
      return (new Intl.DateTimeFormat()).resolvedOptions().locale
    }

    static get defaultTimeZone() {
      return (new Intl.DateTimeFormat()).resolvedOptions().timeZone
    }

    get locale() {
      return this.domData('locale')
    }

    get timeZone() {
      return this.domData('time-zone')
    }

    get calendar() {
      return this.domData('calendar')
    }

    get numberingSystem() {
      return this.domData('numbering-system')
    }

    get shouldShowAsTitle() {
      return this.domData('show-as-title') === true
    }

    get isRomoTooltip() {
      return this.dom.hasData('romo-ui-tooltip')
    }

    get weekdayFormat() {
      return this.domData('weekday-format')
    }

    get eraFormat() {
      return this.domData('era-format')
    }

    get yearFormat() {
      return this.domData('year-format')
    }

    get monthFormat() {
      return this.domData('month-format')
    }

    get dayFormat() {
      return this.domData('day-format')
    }

    get dayPeriodFormat() {
      return this.domData('day-period-format')
    }

    get hourFormat() {
      return this.domData('hour-format')
    }

    get minuteFormat() {
      return this.domData('minute-format')
    }

    get secondFormat() {
      return this.domData('second-format')
    }

    get fractionalSecondDigitsFormat() {
      return this.domData('fractional-second-digits-format')
    }

    get timeZoneNameFormat() {
      return this.domData('time-zone-name-format')
    }

    get dateTimeFormatOptions() {
      return {
        weekday:                this.weekdayFormat,
        era:                    this.eraFormat,
        year:                   this.yearFormat,
        month:                  this.monthFormat,
        day:                    this.dayFormat,
        dayPeriod:              this.dayPeriodFormat,
        hour:                   this.hourFormat,
        minute:                 this.minuteFormat,
        second:                 this.secondFormat,
        fractionalSecondDigits: this.fractionalSecondDigitsFormat,
        timeZoneName:           this.timeZoneNameFormat,
        timeZone:               this.timeZone,
        calendar:               this.calendar,
        numberingSystem:        this.numberingSystem,
      }
    }

    get encodedUTCValue() {
      return this.domData('utc-value')
    }

    get decodedUTCValue() {
      return Romo.memoize(this, 'decodedUTCValue', function() {
        return new Date(Date.parse(this.encodedUTCValue))
      })
    }

    get dateTimeFormat() {
      return new Intl.DateTimeFormat(this.locale, this.dateTimeFormatOptions)
    }

    doRefresh() {
      const formattedValue = this.dateTimeFormat.format(this.decodedUTCValue)

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
      if (this.dom.tagName() === 'date') {
        Romo.config.localTime.applyDateTagDefaultsFn(this)
      }
      if (this.dom.tagName() === 'time') {
        Romo.config.localTime.applyTimeTagDefaultsFn(this)
      }
      if (this.dom.tagName() === 'datetime') {
        Romo.config.localTime.applyDateTagDefaultsFn(this)
        Romo.config.localTime.applyTimeTagDefaultsFn(this)
      }

      this.domOn('triggerRefresh', function(e) { this.doRefresh() })

      this.doRefresh()
    }
  }
})

Romo.addAutoInitSelector('[data-romo-ui-local-time]', Romo.UI.LocalTime)
