import '../utilities/dom_component.js'
import './date_picker/calendar.js'

Romo.define('Romo.UI.DatePicker', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

      this._bind()
    }

    static get attrPrefix() {
      return 'romo-ui-date-picker'
    }

    get formatString() {
      return Romo.memoize(this, 'formatString', function() {
        return this.domData('format') || Romo.config.datePicker.defaultFormatFn()
      })
    }

    get romoDropdown() {
      return Romo.memoize(this, 'romoDropdown', function() {
        return this._bindDropdown()
      })
    }

    get calendar() {
      return Romo.memoize(this, 'calendar', function() {
        return this._bindCalendar()
      })
    }

    get dropdownPopoverBodyDOM() {
      return this.romoDropdown.popoverBodyDOM
    }

    get shouldOpenOnFocus() {
      return this.domData('open-on-focus')
    }

    doSetValue(value) {
      this.date = Romo.Date.parse(value)

      if (this.date !== undefined) {
        this.dom.firstElement.value =
          Romo.Date.format(this.date, this.formatString)
      } else {
        this.dom.firstElement.value = value
      }
      this._triggerSetValueChangeEvent()

      return this
    }

    // private

    _bind() {
      this.prevValue = this.dom.firstElement.value
      this.doSetValue(this.prevValue)

      this.on('change', this._onChange)
      this.on('focus', this._onFocus)
      this.on('blur', this._onBlur)
      this.on('keydown', this._onKeyDown)
      this.on('Romo.UI.IndicatorTextInput:indicatorClicked', function(e) {
        this._openPopover()
      })
      this.on('Romo.UI.Dropdown:popoverOpened', this._onPopoverOpened)
      this.on('Romo.UI.Dropdown:popoverClosed', this._onPopoverClosed)

      this._bindIndicatorTextInput()
    }

    _bindIndicatorTextInput() {
      this.dom.setDataDefault(
        'romo-ui-indicator-text-input-indicator-icon-name',
        Romo.config.datePicker.defaultIndicatorIconNameFn(this),
      )
      this.dom.setDataDefault(
        'romo-ui-indicator-text-input-indicator-icon-css-class',
        Romo.config.datePicker.defaultIndicatorIconCSSClassFn(this),
      )
      this.dom.setDataDefault(
        'romo-ui-indicator-text-input-indicator-position',
        Romo.config.datePicker.defaultIndicatorPositionFn(this),
      )
      this.dom.setDataDefault(
        'romo-ui-indicator-text-input-indicator-spacing-px',
        Romo.config.datePicker.defaultIndicatorSpacingPxFn(this),
      )
      this.dom.setDataDefault(
        'romo-ui-indicator-text-input-indicator-width-px',
        Romo.config.datePicker.defaultIndicatorWidthPxFn(this),
      )
      this.dom.setDataDefault(
        'romo-ui-indicator-text-input-indicator-spinner-size-px',
        Romo.config.datePicker.defaultIndicatorSpinnerSizePxFn(this),
      )

      this.romoIndicatorTextInput = new Romo.UI.IndicatorTextInput(this.dom)
    }

    _bindDropdown() {
      this.dom.setData('romo-ui-dropdown-disable-click-toggle', 'true')
      this.dom.setData('romo-ui-xhr-disabled', 'true')
      if (!this.dom.data('romo-ui-dropdown-popover-width')) {
        this.dom.setData('romo-ui-dropdown-popover-width', 'element')
      }
      if (this.dom.width() < 175) {
        this.dom.setData('romo-ui-dropdown-popover-width', '175px')
      }

      return new Romo.UI.Dropdown(this.dom)
    }

    _bindCalendar() {
      const calendar =
        new Romo.UI.DatePicker.Calendar(
          this.dropdownPopoverBodyDOM,
          { formatString: this.formatString }
        )

      this
        .dropdownPopoverBodyDOM
        .on('mousedown', Romo.bind(this._onMouseDown, this))
        .on(
          'Romo.UI.DatePicker.Calendar:daySelected',
          Romo.bind(this._onDaySelected, this)
        )
      this.romoDropdown.doUpdatePopoverBodyDOM(calendar.dom)

      return calendar
    }

    _triggerSetValueChangeEvent() {
      if (this.dom.firstElement.value !== this.prevValue) {
        this.dom.trigger('change')
      }
    }

    _openPopover() {
      this.romoDropdown.doOpenPopover()
    }

    _onMouseDown(e) {
      e.preventDefault()
      this._clearBlurTimeout()
    }

    _onDaySelected(e, dayDOM) {
      const dayValue = dayDOM.data('romo-ui-date-picker-value')

      this.doSetValue(dayValue)
      this.dom.firstElement.focus()
      this.romoDropdown.doClosePopover()

      this.domTrigger('daySelected', [dayValue, dayDOM])
      if (dayValue !== this.prevValue) {
        this.domTrigger('newDaySelected', [dayValue, dayDOM])
      }
      // Always publish the selected events before publishing any
      // change events.
      this._triggerSetValueChangeEvent()
    }

    _onChange(e) {
      const newValue = this.dom.firstElement.value
      this.domTrigger('changed', [this.prevValue, newValue])
      this.prevValue = newValue
    }

    _onFocus(e) {
      if (this.shouldOpenOnFocus && !this.focusFromClosingThePopover) {
        this._openPopover()
      }
      this.focusFromClosingThePopover = false
    }

    _onBlur(e) {
      this._blurTimeoutID =
        setTimeout(Romo.bind(function() {
          this.romoDropdown.doClosePopover()
          this.pushFn(function() { this.focusFromClosingThePopover = false })
        }, this), 10)
    }

    _clearBlurTimeout() {
      if (this._blurTimeoutId !== undefined) {
        clearTimeout(this._blurTimeoutId)
        this._blurTimeoutId = undefined
      }
    }

    _onKeyDown(e) {
      if (this.dom.hasClass('disabled') === false) {
        if (this.romoDropdown.isPopoverOpen) {
          this._onPopoverOpenedKeyDown(e)
        } else {
          this._onPopoverClosedKeyDown(e)
        }
      }
    }

    _onPopoverOpenedKeyDown(e) {
      e.stopPropagation()

      if (e.keyCode === 38 /* Up */) {
        e.preventDefault()
        this.calendar.doHighlightPrevWeekDay()
      } else if (e.keyCode === 40 /* Down */) {
        e.preventDefault()
        this.calendar.doHighlightNextWeekDay()
      } else if (e.keyCode === 37 /* Left */) {
        e.preventDefault()
        this.calendar.doHighlightPrevDay()
      } else if (e.keyCode === 39 /* Right */) {
        e.preventDefault()
        this.calendar.doHighlightNextDay()
      } else if (e.keyCode === 13 /* Enter */) {
        e.preventDefault()
        this.calendar.doSelectHighlightDay()
      }
    }

    _onPopoverClosedKeyDown(e) {
      if (e.keyCode === 40 /* Down */ || e.keyCode === 38 /* Up */) {
        e.stopPropagation()
        e.preventDefault()

        this._openPopover()
      }
    }

    _onPopoverOpened(e) {
      this.doSetValue(this.dom.firstElement.value)
      this.calendar.doSetSelectedDate(this.date).doRefresh()
      this._clearBlurTimeout()
    }

    _onPopoverClosed(e) {
      this.focusFromClosingThePopover = this.dom.hasFocus
    }
  }
})

Romo.addAutoInitSelector(`[data-${Romo.UI.DatePicker.attrPrefix}]`, Romo.UI.DatePicker)
