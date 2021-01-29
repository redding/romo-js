Romo.define('Romo.XHRCache', function() {
  return class {
    constructor(url, { cacheName, contentType } = {}) {
      this.url = url
      this.cacheName = cacheName
      this.contentType = contentType

      this._bind()
    }

    doRead(fnCallback) {
      this._read(fnCallback)

      return this
    }

    doWrite(responseText) {
      this._write(responseText)

      return this
    }

    // private

    get _request() {
      return Romo.memoize(this, '_request', function() {
        return new Request(this.url)
      })
    }

    _bind() {
    }

    _read(fnCallback) {
      window.caches.open(this.cacheName).then(Romo.bind(function(cache) {
        cache.match(this._request).then(Romo.bind(function(response) {
          if (response) {
            response.text().then(fnCallback)
          } else {
            Romo
              .xhr({
                url:          this.url,
                method:       Romo.XMLHttpRequest.GET,
                responseType: Romo.XMLHttpRequest.TEXT,
                onSuccess:
                  Romo.bind(function(responseText, status, xhr) {
                    this._write(responseText)
                    fnCallback(responseText)
                  }, this),
              })
          }
        }, this))
      }, this))
    }

    _write(responseText) {
      window.caches.open(this.cacheName).then(Romo.bind(function(cache) {
        cache.put(
          this._request,
          new Response(responseText),
          { headers: { 'Content-Type': this.contentType } }
        )
      }, this))
    }
  }
})
