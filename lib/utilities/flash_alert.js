Romo.define('Romo.FlashAlert', function() {
  return class {
    constructor(alertObject) {
      this.alertType = alertObject.alertType
      this.message = String(alertObject.message || '').trim()
    }

    static forXHR(xhr) {
      return new this({
        alertType: xhr.getResponseHeader('X-Message-Type'),
        message:   xhr.getResponseHeader('X-Message'),
      })
    }

    get isMessagePresent() {
      return this.message.length !== 0
    }

    toString() {
      return `[${this.alertType}] ${this.message}`.trim()
    }
  }
})
