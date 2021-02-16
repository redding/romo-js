// Romo.Date.Formatter is a utility class to encapsulate formatting a Date obj
// into a date String e.g. '12/25', '12/25/16', '12/25/2016', '2016/12/25'.
Romo.define('Romo.Date.Formatter', function() {
  return class {
    constructor(trimmedFormatString) {
      this.formatString = trimmedFormatString
    }

    toDateString(date) {
      const d = Romo.Date.date(date)
      const year = d.getFullYear()
      const month = d.getMonth() + 1 // months are zero-based
      const day = d.getDate()

      return this.formatString.replace(/([ymMdD]+)/g, function(match) {
        switch (match) {
          case 'yyyy':
          case 'yyy':
            return year.toString()
          case 'yy':
          case 'y':
            return year.toString().slice(-2)
          case 'mm':
            return `00${month.toString()}`.slice(-2) // pad 2 with '0's
          case 'm':
            return month.toString()
          case 'MM':
            return Romo.Date.monthNames[d.getMonth()]
          case 'M':
            return Romo.Date.monthAbbrevs[d.getMonth()]
          case 'ddd':
            var ds = day.toString()
            var dayLastNum = ds.slice(-1)
            if (dayLastNum === '1' && ds !== '11') {
              ds += 'st'
            } else if (dayLastNum === '2' && ds !== '12') {
              ds += 'nd'
            } else if (dayLastNum === '3' && ds !== '13') {
              ds += 'rd'
            } else {
              ds += 'th'
            }
            return ds
          case 'dd':
            return `00${day.toString()}`.slice(-2) // pad 2 with '0's
          case 'd':
            return day.toString()
          case 'DD':
            return Romo.Date.dayNames[d.getDay()]
          case 'D':
            return Romo.Date.dayAbbrevs[d.getDay()]
          default:
            return match // delimiter, pass-thru
        }
      })
    }
  }
})
