// Romo.Date.Parser is utility class to encapsulate parsing a Date obj from a
// trimmed date String e.g. '12/25', '12/25/16', '12/25/2016', '2016/12/25'.
Romo.define('Romo.Date.Parser', function() {
  return class {
    constructor(trimmedDateString) {
      this.dateString = trimmedDateString
    }

    toDate() {
      if (!this.dateString || this.dateString === '') {
        return undefined
      }

      const dateValues = this._parseValues(this.dateString)
      if (dateValues.length === 0) {
        return undefined
      }
      var year = parseInt(dateValues[0], 10)
      if (year < 0) {
        return undefined
      }
      if (dateValues[0].length > 2 && year < 100) {
        return undefined
      }
      if (dateValues[0].length === 2 && year < 100) {
        // 2-digit years are subjective. prefer assuming
        // they are past years except assuming all years
        // in the next decade are future years.
        const cy = Romo.Date.currentYear()
        year = cy - (cy % 100) + year
        if ((year - cy) > 10) {
          year = year - 100
        }
      }

      const month = parseInt(dateValues[1], 10) - 1
      if (month < 0 || month > 11) {
        return undefined
      }

      const day = parseInt(dateValues[2], 10)
      const date = Romo.Date.for(year, month, day)
      if (date.getMonth() !== month) {
        return undefined
      }

      return date
    }

    // private

    _parseValues(dateString) {
      var regex, matches

      regex = /^([0-9]{1,2})[^0-9]+([0-9]{1,2})[^0-9]+([0-9]{2,4})$/ // "mm dd yyyy" or "mm dd yy"
      matches = Romo.Date.regexMatches(dateString, regex)
      if (matches.length === 3) {
        return [matches[2], matches[0], matches[1]]
      }

      regex = /^([0-9]{3,4})[^0-9]+([0-9]{1,2})[^0-9]+([0-9]{1,2})$/ // "yyyy mm dd"
      matches = Romo.Date.regexMatches(dateString, regex)
      if (matches.length === 3) {
        return matches
      }

      regex = /^([0-9]{1,2})[^0-9]+([0-9]{1,2})$/ // "mm dd"
      matches = Romo.Date.regexMatches(dateString, regex)
      if (matches.length === 2) {
        return [Romo.Date.currentYear(), matches[0], matches[1]]
      }

      return []
    }
  }
})
