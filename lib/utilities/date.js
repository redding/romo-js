import './date/parser.js'
import './date/formatter.js'

// Romo.Date is a utility API for parsing, formatting, and handling Dates.
Romo.define('Romo.Date', function() {
  return class {
    static date(date) {
      if (date === undefined || date === null) {
        return undefined
      } else {
        var d = new Date(date)
        d.setHours(0, 0, 0, 0) // Romo.Date Dates are always local with zero time
        return d
      }
    }

    static for(yearNum, zeroBasedMonthNum, dayNum) {
      return Romo.Date.date(new Date(yearNum, zeroBasedMonthNum, dayNum))
    }

    static parse(dateString) {
      return (new Romo.Date.Parser(String(dateString).trim())).toDate()
    }

    static format(date, formatString) {
      return (new Romo.Date.Formatter(String(formatString).trim())).toDateString(date)
    }

    static today() {
      return Romo.Date.date(new Date())
    }

    static currentYear() {
      return Romo.Date.today().getFullYear()
    }

    static vector(date, numDays) {
      const d = Romo.Date.date(date)
      return Romo.Date.for(d.getFullYear(), d.getMonth(), d.getDate() + (numDays || 0))
    }

    static next(date, numDays) {
      return Romo.Date.vector(date, numDays || 1)
    }

    static prev(date, numDays) {
      return Romo.Date.vector(date, -(numDays || 1))
    }

    static firstDateOfMonth(monthDate, vectorNumMonths) {
      const d = Romo.Date.date(monthDate)
      return Romo.Date.for(d.getFullYear(), d.getMonth() + (vectorNumMonths || 0), 1)
    }

    static lastDateOfMonth(monthDate, vectorNumMonths) {
      const d = Romo.Date.date(monthDate)
      return Romo.Date.for(d.getFullYear(), d.getMonth() + (vectorNumMonths || 0) + 1, 0)
    }

    static firstDateOfNextMonth(monthDate, numMonths) {
      return Romo.Date.firstDateOfMonth(monthDate, numMonths || 1)
    }

    static firstDateOfPrevMonth(monthDate, numMonths) {
      return Romo.Date.firstDateOfMonth(monthDate, -(numMonths || 1))
    }

    static lastDateOfNextMonth(monthDate, numMonths) {
      return Romo.Date.lastDateOfMonth(monthDate, numMonths || 1)
    }

    static lastDateOfPrevMonth(monthDate, numMonths) {
      return Romo.Date.lastDateOfMonth(monthDate, -(numMonths || 1))
    }

    static daysInMonth(monthDate, vectorNumMonths) {
      return Romo.Date.lastDateOfMonth(monthDate, vectorNumMonths).getDate()
    }

    static daysRemainingInMonth(monthDate) {
      const d = Romo.Date.date(monthDate)
      return Romo.Date.daysInMonth(d) - d.getDate() + 1
    }

    static daysDiff(firstDate, secondDate) {
      const fd = Romo.Date.date(firstDate)
      const sd = Romo.Date.date(secondDate)
      return Math.round((fd.getTime() - sd.getTime()) / 864e5) // 1000 * 60 * 60 * 24
    }

    static isoWeekNum(weekDate) {
      const d = Romo.Date.date(weekDate)

      // calc full weeks to nearest Thursday (basis for ISO week numbers)
      // set to nearest Thursday: current date + 4 - current day number
      d.setDate(d.getDate() + 4 - (d.getDay() || 7))
      const yearStartDate = Romo.Date.for(d.getFullYear(), 0, 1)
      const milliSecsSinceYearStart = d - yearStartDate
      const milliSecsInADay = 24 * 60 * 60 * 1000
      const daysSinceYearStart = milliSecsSinceYearStart / milliSecsInADay
      const weekNumber = Math.ceil((daysSinceYearStart + 1) / 7)

      return weekNumber
    }

    static isEqual(date1, date2, formatString) {
      const d1 = Romo.Date.date(date1)
      const d2 = Romo.Date.date(date2)
      const f = formatString || 'yyyy-mm-dd'

      if (!d1 || !d2) {
        return d1 === d2
      } else {
        return Romo.Date.format(d1, f) === Romo.Date.format(d2, f)
      }
    }

    static isSameDate(date1, date2) {
      return Romo.Date.isEqual(date1, date2)
    }

    static isSameMonth(date1, date2) {
      return Romo.Date.isEqual(date1, date2, 'yyyy-mm')
    }

    static isSameYear(date1, date2) {
      return Romo.Date.isEqual(date1, date2, 'yyyy')
    }

    static isDay(date, day) {
      if (!date) return false

      const dow = Romo.Date.date(date).getDay()
      return (
        day === dow ||
        day === Romo.Date.dayNames[dow] ||
        day === Romo.Date.dayAbbrevs[dow]
      )
    }

    static isWeekend(date) {
      if (!date) return false

      const dow = Romo.Date.date(date).getDay()
      return (dow === 0 || dow === 6)
    }

    static regexMatches(value, regex) {
      if (regex.test(value) === true) {
        return regex.exec(value).slice(1)
      }
      return []
    }

    static get monthNames() {
      return [
        'January', 'Febuary', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ]
    }

    static get monthAbbrevs() {
      return [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ]
    }

    static get dayNames() {
      return [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
      ]
    }

    static get dayAbbrevs() {
      return [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
      ]
    }
  }
})
