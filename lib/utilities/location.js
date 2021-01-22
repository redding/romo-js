Romo.define('Romo.Location', function() {
  return class {
    constructor({ pathname, search } = {}) {
      this.pathname = pathname
      this.searchParams =
        new URLSearchParams(window.decodeURIComponent(search || ''))
    }

    set search(value) {
      this.searchParams = new URLSearchParams(window.decodeURIComponent(value))
    }

    get search() {
      return window.decodeURIComponent(this.searchParams.toString())
    }

    get params() {
      return Object.fromEntries(this.searchParams.entries())
    }

    toString() {
      if (this.pathname.includes('?')) {
        return `${this.pathname}&${this.search}`
      } else if (this.search.length > 0) {
        return `${this.pathname}?${this.search}`
      } else {
        return this.pathname
      }
    }

    toURL() {
      return Romo.url(this)
    }

    toObject() {
      return {
        pathname: this.pathname,
        search:   this.search,
      }
    }
  }
})
