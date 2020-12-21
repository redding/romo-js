Romo.define('Romo.FuzzySearch.Filter', function() {
  return class {
    constructor(term, items, givenGetItemTextFn) {
      this.matchingItems = []
      this.notMatchingItems = []

      const getItemTextFn = givenGetItemTextFn || function(item) { return item }

      var fuzzySearch
      Romo.array(items).forEach(Romo.bind(function(item) {
        fuzzySearch = new Romo.FuzzySearch(term, getItemTextFn(item))
        if (fuzzySearch.isAMatch) {
          this.matchingItems.push(item)
        } else {
          this.notMatchingItems.push(item)
        }
      }, this))
    }
  }
})
