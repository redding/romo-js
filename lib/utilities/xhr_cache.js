Romo.define('Romo.XHRCache', function() {
  return class {
    constructor({ cacheName, contentType } = {}) {
      this.cacheName = cacheName
      this.contentType = contentType
    }

    doRead(url, fnCallback) {
      this._read(url, fnCallback)

      return this
    }

    // private

    _read(url, fnCallback) {
      const request = this._buildRequest(url)
      window.caches.open(this.cacheName).then(Romo.bind(function(cache) {
        cache.match(request).then(Romo.bind(function(response) {
          if (response) {
            response.text().then(fnCallback)
          } else {
            Romo
              .xhr({
                url:          url,
                method:       Romo.XMLHttpRequest.GET,
                responseType: Romo.XMLHttpRequest.TEXT,
                onSuccess:
                  Romo.bind(function(responseText, status, xhr) {
                    this._write(request, responseText)
                    fnCallback(responseText)
                  }, this),
              })
          }
        }, this))
      }, this))
    }

    _write(request, body) {
      window.caches.open(this.cacheName).then(Romo.bind(function(cache) {
        cache.put(request, this._buildResponse(body))
      }, this))
    }

    _buildRequest(url) {
      return new Request(url)
    }

    _buildResponse(body) {
      return new Response(
        body,
        { headers: { 'Content-Type': this.contentType } }
      )
    }
  }
})
