Romo.define('Romo.UI.DatePicker.CalendarBody', function() {
  return class {
    constructor(date, { formatString, selectedDate } = {}) {
      this.today = Romo.Date.today()
      this.date = date
      this.formatString = formatString
      this.selectedDate = selectedDate
      this.highlightDate = this.date
    }

    get dom() {
      return Romo.memoize(this, 'dom', function() {
        return this._bindDOM()
      })
    }

    get html() {
      return Romo.memoize(this, 'html', function() {
        return this._buildHTML()
      })
    }

    // private

    _bindDOM() {
      const dom = Romo.dom(Romo.elements(this.html))

      dom
        .find('td:not(.disabled)')
        .on('click', Romo.bind(this._onClick, this))
        .on('mouseenter', Romo.bind(this._onMouseEnter, this))

      return dom
    }

    _onClick(e) {
      const tdDOM = Romo.dom(e.target).closest('td')
      const value = tdDOM.data('romo-ui-date-picker-value')

      this.dom.find('td').removeClass('selected')
      tdDOM.addClass('selected')
      tdDOM.trigger(
        'Romo.UI.DatePicker.CalendarBody:dayClicked',
        [value]
      )
    }

    _onMouseEnter(e) {
      this.dom.find('td').removeClass('highlight')
      Romo.dom(e.target).closest('td').addClass('highlight')
    }

    _buildHTML() {
      var html = []

      // Prefer showing as many past dates in each month as possible by
      // calculating the most post days we can show and still fit the date's
      // month in 6 weeks of displayed days:
      // - 7 days * 6 weeks = 42 displayed days
      // - 42 displayed days - {days in month} = {max past days}

      // first-of-month
      const fom = Romo.Date.firstDateOfMonth(this.date)
      // days-in-month
      const dim = Romo.Date.daysInMonth(this.date)

      // Start on this week's Sunday. if there is enough room, start on prev
      // week's Sunday.
      var past = fom.getDay()
      if ((past + 7) <= (42 - dim)) {
        past = past + 7
      }
      var iDate = Romo.Date.vector(fom, -past)

      // Render 6 weeks in the calendar.
      var iWeek = 0
      while (iWeek < 6) {
        if (Romo.Date.isDay(iDate, 'Sunday')) {
          html.push('<tr>')
        }

        html.push(this._buildDayHTML(iDate))

        if (Romo.Date.isDay(iDate, 'Saturday')) {
          html.push('</tr>')
          iWeek += 1
        }
        iDate = Romo.Date.next(iDate)
      }

      return `<tbody>${html.join('')}</tbody>`
    }

    _buildDayHTML(date) {
      const value = Romo.Date.format(date, this.formatString)
      var cssClasses = []
      if (Romo.Date.isWeekend(date)) {
        cssClasses.push('weekend')
      }
      if (!Romo.Date.isSameMonth(date, this.date)) {
        cssClasses.push('other-month')
      }
      if (Romo.Date.isEqual(date, this.today)) {
        cssClasses.push('today')
      }
      if (Romo.Date.isEqual(date, this.selectedDate)) {
        cssClasses.push('selected')
      }
      if (Romo.Date.isEqual(date, this.highlightDate)) {
        cssClasses.push('highlight')
      }

      return `
<td class="${cssClasses.join(' ')}"
    title="${value}"
    data-romo-ui-date-picker-value="${value}">
  ${Romo.Date.format(date, 'd')}
</td>
`
    }
  }
})
