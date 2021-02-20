import './calendar_body.js'

Romo.define('Romo.UI.DatePicker.Calendar', function() {
  return class {
    constructor(popoverBodyDOM, { formatString } = {}) {
      this.popoverBodyDOM = popoverBodyDOM
      this.formatString = formatString

      this.refreshDate = undefined
      this.selectedDate = undefined
      this._bind()
    }

    get dom() {
      return Romo.memoize(this, 'dom', function() {
        return Romo.dom(Romo.elements(this._tableTemplate))
      })
    }

    get titleDOM() {
      return Romo.memoize(this, 'titleDOM', function() {
        return this.dom.find('[data-romo-ui-date-picker-calendar-title]')
      })
    }

    get prevDOM() {
      return Romo.memoize(this, 'prevDOM', function() {
        return this.dom.find('[data-romo-ui-date-picker-calendar-prev]')
      })
    }

    get nextDOM() {
      return Romo.memoize(this, 'nextDOM', function() {
        return this.dom.find('[data-romo-ui-date-picker-calendar-next]')
      })
    }

    get bodyDOM() {
      return this.dom.find('tbody')
    }

    get daysDOM() {
      return this.bodyDOM.find('td')
    }

    doSetSelectedDate(date) {
      this.selectedDate = date

      return this
    }

    doRefresh(refreshDate) {
      this.refreshDate = refreshDate || this.selectedDate || Romo.Date.today()

      this.titleDOM.updateText(Romo.Date.format(this.refreshDate, 'MM yyyy'))
      this._bindTableBody()

      return this
    }

    doRefreshToPrevMonth() {
      const pDate =
        Romo.Date.lastDateOfPrevMonth(this.refreshDate || Romo.Date.today())
      this.doRefresh(pDate)

      return this
    }

    doRefreshToNextMonth() {
      const nDate =
        Romo.Date.firstDateOfNextMonth(this.refreshDate || Romo.Date.today())
      this.doRefresh(nDate)

      return this
    }

    // private

    get _tableTemplate() {
      return `
<table class="romo-ui-date-picker-calendar">
  <thead>
    <tr>
      <th title="Previous Month"
          data-romo-ui-date-picker-calendar-prev>
        ${Romo.config.datePicker.calendarPrevMonthMarkupFn()}
      </th>
      <th data-romo-ui-date-picker-calendar-title colspan="5"></th>
      <th title="Next Month"
          data-romo-ui-date-picker-calendar-next>
        ${Romo.config.datePicker.calendarNextMonthMarkupFn()}
      </th>
    </tr>
      <th>S</th>
      <th>M</th>
      <th>T</th>
      <th>W</th>
      <th>T</th>
      <th>F</th>
      <th>S</th>
    <tr>
    </tr>
  </thead>
  <tbody>
  </tbody>
</table>
`
    }

    _bind() {
      this.prevDOM.on('click', Romo.bind(function(e) {
        e.preventDefault()
        this.doRefreshToPrevMonth()
      }, this))
      this.nextDOM.on('click', Romo.bind(function(e) {
        e.preventDefault()
        this.doRefreshToNextMonth()
      }, this))
    }

    _bindTableBody() {
      const calendarBody =
        new Romo.UI.DatePicker.CalendarBody(
          this.refreshDate,
          {
            formatString:  this.formatString,
            selectedDate:  this.selectedDate,
            highlightDate: this.refreshDate,
          }
        )
      this.bodyDOM.replace(calendarBody.dom)

      this.daysDOM.on(
        'Romo.UI.DatePicker.CalendarBody:dayClicked',
        Romo.bind(function(e, dayValue) {
          this.popoverBodyDOM.trigger(
            'Romo.UI.DatePicker.Calendar:dayClicked',
            [dayValue]
          )
        }, this)
      )
    }
  }
})
