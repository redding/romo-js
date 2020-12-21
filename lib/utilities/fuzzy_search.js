import './fuzzy_search/filter.js'

// Romo.FuzzySearch is a utility for matching a search term against some
// text. It is "fuzzy" in the sense that it matches words in the term against
// words in the text such that partial matches are honored. Matching is also
// case-insensitive.
//
Romo.define('Romo.FuzzySearch', function() {
  return class {
    constructor(term, text) {
      this.term = term || ''
      this.text = text || ''
    }

    // Usage example
    //   const filter =
    //     Romo.FuzzySearch.filter(
    //       this.searchFormInputDOM.value(),
    //       this._getListingDOMs(),
    //       function(listingDOM) {
    //         return listingDOM.data('search-content')
    //       })
    //   filter.matchingItems.forEach(function(listingDOM) { listingDOM.show() })
    //   filter.nonMatchingItems.forEach(function(listingDOM) { listingDOM.hide() })
    static filter(term, items, getItemTextFn) {
      return new Romo.FuzzySearch.Filter(term, items, getItemTextFn)
    }

    static get wordBoundaryCharsRegex() {
      return /[\s-_]+/
    }

    get isAMatch() {
      if (this._isAMatch === undefined) {
        this._isAMatch =
          this._termWords.reduce(Romo.bind(function(termMatch, termWord) {
            return termMatch && this._textMatch(termWord)
          }, this), true)
      }
      return this._isAMatch
    }

    /* Private */

    _textMatch(termWord) {
      var textWord, match
      do {
        textWord = this._textWordStack.pop()
        match = (textWord !== undefined && textWord.indexOf(termWord) >= 0)
      } while (match === false && textWord !== undefined)

      return match
    }

    get _textWordStack() {
      if (this.__textWordStack === undefined) {
        this.__textWordStack =
          this.text
            .trim()
            .toLowerCase()
            .split(this.class.wordBoundaryCharsRegex)
            .reverse()
      }
      return this.__textWordStack
    }

    get _termWords() {
      if (this.__termWords === undefined) {
        this.__termWords =
          this.term
            .trim()
            .toLowerCase()
            .split(this.class.wordBoundaryCharsRegex)
      }
      return this.__termWords
    }
  }
})
