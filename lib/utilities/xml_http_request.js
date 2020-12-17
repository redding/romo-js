Romo.define('Romo.XMLHttpRequest', function() {
  return class {
    constructor({
      url,
      method,
      data,
      onSuccess,
      onError,
      headers,
      contentType,
      responseType,
      username,
      password,
    } = {}) {
      this.method = method
      this.url = url
      this.data = new Romo.XMLHttpRequest.Data(data)
      this.onSuccess = onSuccess
      this.onError = onError
      this.headers = headers
      this.contentType = contentType
      this.responseType = responseType
      this.username = username
      this.password = password
    }

    static get GET() {
      return 'GET'
    }

    static get defaultXHRMethod() {
      return this.GET
    }

    static get defaultURL() {
      return window.location.toString()
    }

    static get sendAsynchronously() {
      return true
    }

    get isNonTextResponseType() {
      return (
        this.responseType === 'arraybuffer' ||
        this.responseType === 'blob' ||
        this.responseType === 'document' ||
        this.responseType === 'json'
      )
    }

    get xhrMethod() {
      return Romo.memoize(this, 'xhrMethod', function() {
        return (this.method || this.class.defaultXHRMethod).toUpperCase()
      })
    }

    get xhrURL() {
      return Romo.memoize(this, 'xhrURL', function() {
        return (
          this.data.toXHRURL(
            this.url || this.class.defaultURL,
            { method: this.xhrMethod },
          )
        )
      })
    }

    get xhrData() {
      return Romo.memoize(this, 'xhrData', function() {
        return this.data.toXHRData({ method: this.xhrMethod })
      })
    }

    get xhr() {
      return Romo.memoize(this, 'xhr', function() {
        const xhr = new XMLHttpRequest()

        xhr.open(
          this.xhrMethod,
          this.xhrURL,
          this.class.sendAsynchronously,
          this.username,
          this.password,
        )

        for (var name in this.headers) {
          xhr.setRequestHeader(name, this.headers[name])
        }

        if (this.contentType) {
          xhr.setRequestHeader('Content-Type', this.contentType)
        }

        if (this.isNonTextResponseType) {
          xhr.responseType = this.responseType
        }

        xhr.onreadystatechange = Romo.bind(this._onReadyStateChange, this)

        return xhr
      })
    }

    doSend() {
      this.xhr.send(this.xhrData)

      return this
    }

    doAbort() {
      this.xhr.abort()

      return this
    }

    // private

    _onReadyStateChange() {
      if (this.xhr.readyState === XMLHttpRequest.DONE) {
        if (
          this.onSuccess &&
          (
            (this.xhr.status >= 200 && this.xhr.status < 300) ||
            this.xhr.status === 304
          )
        ) {
          if (this.isNonTextResponseType) {
            this.onSuccess(this.xhr.response, this.xhr.status, this.xhr)
          } else {
            this.onSuccess(this.xhr.responseText, this.xhr.status, this.xhr)
          }
        } else if (this.onError) {
          this.onError(this.xhr.statusText || null, this.xhr.status, this.xhr)
        }
      }
    }
  }
})

Romo.define('Romo.XMLHttpRequest.Data', function() {
  return class {
    constructor(data) {
      this.data = data || {}
    }

    get length() {
      return Object.keys(this.data).length
    }

    get formData() {
      return Romo.memoize(this, 'formData', function() {
        const formData = new FormData()
        for (var name in this.data) {
          Romo.array(this.data[name]).forEach(function(value) {
            formData.append(name, value)
          })
        }
      })
    }

    get urlSearchParams() {
      return Romo.memoize(this, 'urlSearchParams', function() {
        return new Romo.URLSearchParams(this.data)
      })
    }

    toXHRURL(urlString, { method } = {}) {
      const url = new URL(urlString)

      if (method === Romo.XMLHttpRequest.GET) {
        const combinedSearchParams =
          [url.searchParams, this.urlSearchParams]
            .reduce(function(acc, searchParams) {
              for (var key of searchParams.keys()) {
                acc.append(key, searchParams.get(key))
              }
              return acc
            }, new URLSearchParams())

        url.search = combinedSearchParams.toString()
      }

      return url.toString()
    }

    toXHRData({ method } = {}) {
      if (method === Romo.XMLHttpRequest.GET || this.length === 0) {
        return undefined
      } else {
        return this.formData
      }
    }
  }
})
