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
      headers,
      contentType,
      responseType,
      username,
      password,
      mutedErrorStatusCodes,
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
      this.headers = headers
      this.contentType = contentType
      this.responseType = responseType
      this.username = username
      this.password = password
      this.mutedErrorStatusCodes = Romo.array(mutedErrorStatusCodes)

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
      this._showJSONBannerAlert()
      this._showJSONToastAlerts()

      if (Romo.config.xhr.isSuccessStatusCode(this.xhr.status)) {
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

      if (!this.mutedErrorStatusCodes.includes(this.xhr.status)) {
        if (this.isBinaryResponseType) {
          this.errorResponseText = `${this.xhr.status} ${this.xhr.statusText}`
        } else if (this.responseType === this.class.JSON) {
          this.errorResponseText = JSON.stringify(response)
        } else {
          this.errorResponseText = response.toString()
        }
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
        Romo.config.xhr.showErrorAlertFn(
          this,
          {
            debugMessage: this.errorResponseText,
            xhr:          this.xhr,
          },
        )
      }
    }

    _onProgress() {
      if (this.onProgress) {
        this.onProgress(this.xhr)
      }
    }

    _showJSONBannerAlert() {
      if (
        this._getDomain(window.location) === this._getDomain(this.url) &&
        this.xhr.responseType === this.class.JSON &&
        this.xhr.response
      ) {
        Romo.config.xhr.showJSONBannerAlertFn(this.xhr.response)
      }
    }

    _showJSONToastAlerts() {
      if (
        this._getDomain(window.location) === this._getDomain(this.url) &&
        this.xhr.responseType === this.class.JSON &&
        this.xhr.response
      ) {
        Romo.config.xhr.showJSONToastAlertsFn(this.xhr.response)
      }
    }

    _getDomain(url) {
      return Romo.url(url).hostname
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
        return formData
      })
    }

    toXHRURL(urlString, { method } = {}) {
      var url

      if (method === Romo.XMLHttpRequest.GET) {
        url = new Romo.URLSearchParams(this.data).toURL(urlString)
      } else {
        url = Romo.url(urlString)
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
