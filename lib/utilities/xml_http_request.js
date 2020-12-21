Romo.define('Romo.XMLHttpRequest', function() {
  return class {
    constructor({
      url,
      method,
      data,
      onSuccess,
      onError,
      onAbort,
      onTimeout,
      onCallStart,
      onCallEnd,
      onProgress,
      reloadPageOn,
      headers,
      contentType,
      responseType,
      username,
      password,
    } = {}) {
      if (url.toString().trim() === '') {
        throw new Error('Romo.XMLHttpRequest: no URL given.')
      }

      this.method = method
      this.url = url
      this.data = new Romo.XMLHttpRequest.Data(data)
      this.onSuccess = onSuccess
      this.onError = onError
      this.onAbort = onAbort
      this.onTimeout = onTimeout
      this.onCallStart = onCallStart
      this.onCallEnd = onCallEnd
      this.onProgress = onProgress
      this.reloadPageOn = reloadPageOn
      this.headers = headers
      this.contentType = contentType
      this.responseType = responseType
      this.username = username
      this.password = password

      this.errorResponseText = undefined
    }

    static get GET() {
      return 'GET'
    }

    static get SUCCESS() {
      return 'success'
    }

    static get ERROR() {
      return 'error'
    }

    static get COMPLETE() {
      return 'complete'
    }

    static get ARRAYBUFFER() {
      return 'arraybuffer'
    }

    static get BLOB() {
      return 'blob'
    }

    static get DOCUMENT() {
      return 'document'
    }

    static get JSON() {
      return 'json'
    }

    static get TEXT() {
      return 'text'
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

    static successStatusCode(statusCode) {
      return (statusCode >= 200 && statusCode < 300) || statusCode === 304
    }

    get isNonTextResponseType() {
      return (
        this.responseType === this.class.ARRAYBUFFER ||
        this.responseType === this.class.BLOB ||
        this.responseType === this.class.DOCUMENT ||
        this.responseType === this.class.JSON
      )
    }

    get isBinaryResponseType() {
      return (
        this.responseType === this.class.ARRAYBUFFER ||
        this.responseType === this.class.BLOB
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

        xhr.onload = Romo.bind(this._onLoad, this)
        xhr.onerror = Romo.bind(this._onError, this)
        xhr.onabort = Romo.bind(this._onAbort, this)
        xhr.ontimeout = Romo.bind(this._onTimeout, this)
        xhr.onloadstart = Romo.bind(this._onCallStart, this)
        xhr.onloadend = Romo.bind(this._onCallEnd, this)
        xhr.onprogress = Romo.bind(this._onProgress, this)

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

    _onLoad() {
      this._showFlashAlerts()

      if (this.class.successStatusCode(this.xhr.status)) {
        if (this.onSuccess) {
          if (this.isNonTextResponseType) {
            this.onSuccess(this.xhr.response, this.xhr.status, this.xhr)
          } else {
            this.onSuccess(this.xhr.responseText, this.xhr.status, this.xhr)
          }
        }
      } else {
        this._onError()
      }
    }

    _onError() {
      const response =
        this.isNonTextResponseType ? this.xhr.response : this.xhr.responseText

      if (this.isBinaryResponseType) {
        this.errorResponseText = `${this.xhr.status} ${this.xhr.statusText}`
      } else if (this.responseType === this.class.JSON) {
        this.errorResponseText = JSON.stringify(response)
      } else {
        this.errorResponseText = response.toString()
      }

      if (this.onError) {
        this.onError(response, this.xhr.status, this.xhr)
      }
    }

    _onAbort() {
      if (this.onAbort) {
        this.onAbort(this.xhr.statusText, this.xhr.status, this.xhr)
      }
    }

    _onTimeout() {
      if (this.onTimeout) {
        this.onTimeout(this.xhr.statusText, this.xhr.status, this.xhr)
      }
    }

    _onCallStart() {
      if (this.onCallStart) {
        this.onCallStart(this.xhr)
      }
    }

    _onCallEnd() {
      if (this.onCallEnd) {
        this.onCallEnd(this.xhr)
      }

      if (this.errorResponseText) {
        if (
          this.reloadPageOn === this.class.COMPLETE ||
            this.reloadPageOn === this.class.ERROR
        ) {
          Romo.alertAndReloadPage(
            Romo.xhrErrorAlertMessage(),
            { debugMessage: this.errorResponseText },
          )
        } else {
          Romo.alert(
            Romo.xhrErrorAlertMessage(),
            { debugMessage: this.errorResponseText },
          )
        }
      } else {
        if (
          this.reloadPageOn === this.class.COMPLETE ||
            this.reloadPageOn === this.class.SUCCESS
        ) {
          Romo.reloadPage()
        }
      }
    }

    _onProgress() {
      if (this.onProgress) {
        this.onProgress(this.xhr)
      }
    }

    _showFlashAlerts() {
      var flashAlerts = []
      if (this._getDomain(window.location) === this._getDomain(this.url)) {
        flashAlerts.push(Romo.FlashAlert.forXHR(this.xhr))
      }

      if (
        this.xhr.responseType === this.class.JSON &&
        this.xhr.response &&
        this.xhr.response.flashAlerts &&
        this.xhr.response.flashAlerts.length !== 0
      ) {
        flashAlerts.concat(
          this.xhr.response.flashAlerts.map(function(flashAlertObject) {
            return new Romo.FlashAlert(flashAlertObject)
          })
        )
      }

      Romo.showFlashAlerts(
        flashAlerts.filter(function(romoFlashAlert) {
          return romoFlashAlert.isMessagePresent
        })
      )
    }

    _getDomain(url) {
      return new URL(url.toString()).hostname
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
