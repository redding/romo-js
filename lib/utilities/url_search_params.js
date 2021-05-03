// new Romo.URLSearchParams({}).toString()
//   #=> ""
// new Romo.URLSearchParams({ a: 2, b: 'three', c: 4 }).toString()
//   #=> "a=2&b=three&c=4"
// new Romo.URLSearchParams({ a: [ 2, 3, 4 ] }).toString()
//   #=> "a=2%2C3%2C4"
// new Romo.URLSearchParams({ a: [ 2, 3, 4 ] }, { decode: true }).toString()
//   #=> "a=2,3,4"
// new Romo.URLSearchParams({ "a[]": [ 2, 3, 4 ] }, { decode: true }).toString()
//   #=> "a[]=2&a[]=3&a[]=4"
// new Romo.URLSearchParams({ a: 2, b: '', c: 4 }).toString()
//   #=> "a=2&b=&c=4"
// new Romo.URLSearchParams({ a: 2, b: ' ', c: 4 }, { removeBlanks: true }).toString()
//   #=> "a=2&c=4"
// new Romo.URLSearchParams({ "a[]": [''], { decode: true } }).toString()
//   #=> "a[]="
// new Romo.URLSearchParams({ "a[]": [''], { decode: true, removeBlanks: true } }).toString()
//   #=> ""
Romo.define('Romo.URLSearchParams', function() {
  return class {
    constructor(data, { removeBlanks, decode } = {}) {
      this.data = data || {}
      this.removeBlanks = removeBlanks
      this.decode = decode
    }

    get urlSearchParams() {
      return Romo.memoize(this, 'urlSearchParams', function() {
        const urlSearchParams = new URLSearchParams()

        for (var name in this.data) {
          const value = this.data[name]
          if (
            name.match(/.+\[\]$/) &&
            Array.isArray(value) &&
            value.length > 0
          ) {
            value.forEach(Romo.bind(function(valueItem) {
              this._appendValue(urlSearchParams, name, valueItem)
            }, this))
          } else {
            this._appendValue(urlSearchParams, name, value)
          }
        }

        return urlSearchParams
      })
    }

    keys() {
      return this.urlSearchParams.keys()
    }

    get(key) {
      return this.urlSearchParams.get(key)
    }

    append(key, value) {
      return this._appendValue(this.urlSearchParams, key, value)
    }

    toString() {
      if (this.decode) {
        return window.decodeURIComponent(this.urlSearchParams.toString())
      } else {
        return this.urlSearchParams.toString()
      }
    }

    toURL(givenURLString) {
      const givenURL = Romo.url(givenURLString)
      const seedSearchParams =
        new this.class({}, {
          removeBlanks: this.removeBlanks,
          decode:       this.decode,
        })
      const combinedSearchParams =
        [givenURL.searchParams, this.urlSearchParams]
          .reduce(function(acc, searchParams) {
            searchParams.forEach(function(value, key) {
              acc.append(key, value)
            })
            return acc
          }, seedSearchParams)

      givenURL.search = combinedSearchParams.toString()

      return givenURL
    }

    // private

    _appendValue(urlSearchParams, name, value) {
      const valueString = value.toString().trim()

      if (this.removeBlanks && valueString === '') {
        return
      }
      urlSearchParams.append(name, value)
    }
  }
})
