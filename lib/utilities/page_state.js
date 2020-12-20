// Romo.PageState is a utility for managing page state interactions via JS that
// are reflected in the page's URL.
//
// It is a wrapper around `URLSearchParams` that integrates with the
// `window.history` API to manage replacing, pushing, and popping page state.
// It uses `URLSearchParams` to handler serializing/deserializing state to/from
// the page's query string.
//
// Usage example:
//   this.pageState = new Romo.PageState()
//   if (!this.pageState.has('tile_filter')) {
//     this.pageState.doSet('tile_filter', 'my-filter')
//   }
//   if (!this.pageState.has('tab')) {
//     this.pageState.doSet('tab', 'a-tab')
//   }
//
//   this.pageState.doBindPop(Romo.bind(function(pageState) {
//     this.pageState = pageState
//     this._refreshPage(this.pageState)
//   }, this))
//   this.pageState.doReplace()
Romo.define('Romo.PageState', function() {
  return class {
    constructor(locationURL) {
      const location = locationURL ? new URL(locationURL) : window.location

      this.locationPathname = location.pathname
      this.searchParams =
        new URLSearchParams(window.decodeURIComponent(location.search))
    }

    get params() {
      return Object.fromEntries(this.searchParams.entries())
    }

    get(name) {
      return this.searchParams.get(name)
    }

    has(name) {
      return this.searchParams.has(name)
    }

    toString(givenPathname) {
      var pathname = givenPathname || this.locationPathname

      if (pathname.includes('?')) {
        return `${pathname}&${this.toQueryString()}`
      } else {
        return `${pathname}?${this.toQueryString()}`
      }
    }

    toQueryString() {
      return window.decodeURIComponent(this.searchParams.toString())
    }

    toLocation() {
      return {
        pathname: this.locationPathname,
        search:   this.toQueryString(),
      }
    }

    doSet(name, value) {
      if (Array.isArray(value)) {
        value.forEach(Romo.bind(function(item) {
          this.searchParams.append(name, item)
        }, this))
      } else {
        this.searchParams.set(name, value)
      }
      this.searchParams.sort()

      return this
    }

    doSetAll(values) {
      for (const [key, value] of Object.entries(values)) {
        this.doSet(key, value)
      }
      this.searchParams.sort()

      return this
    }

    doDelete(name) {
      this.searchParams.delete(name)

      return this
    }

    doReset() {
      this.searchParams = new URLSearchParams()

      return this
    }

    doResetTo(names) {
      const values =
        names.reduce(Romo.bind(function(acc, name) {
          acc[name] = this.get(name); return acc
        }, this), {})

      return this.doReset().doSetAll(values)
    }

    doBindPop(fnCallback) {
      window.onpopstate =
        Romo.bind(function(e) { fnCallback(new this.class(e.state.location)) }, this)

      return this
    }

    doReplace() {
      window.history.replaceState({ location: this.toLocation() }, null, this.toString())

      return this
    }

    doPush() {
      window.history.pushState({ location: this.toLocation() }, null, this.toString())

      return this
    }

    doSetAndReplace(name, value) {
      return this.doSet(name, value).doReplace()
    }

    doSetAndPush(name, value) {
      return this.doSet(name, value).doPush()
    }

    doSetAllAndReplace(values) {
      return this.doSetAll(values).doReplace()
    }

    doSetAllAndPush(values) {
      return this.doSetAll(values).doPush()
    }

    doDeleteAndReplace(name) {
      return this.doDelete(name).doReplace()
    }

    doDeleteAndPush(name) {
      return this.doDelete(name).doPush()
    }

    doResetAndReplace() {
      return this.doReset().doReplace()
    }

    doResetAndPush() {
      return this.doReset().doPush()
    }

    doResetToAndReplace(names) {
      return this.doResetTo(names).doReplace()
    }

    doResetToAndPush(names) {
      return this.doResetTo(names).doPush()
    }
  }
})
