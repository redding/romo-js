Romo.define('Romo.Form.FirstVisibleInput', function() {
  return class {
    constructor(formDOM) {
      this.formDOM = formDOM
    }

    static get visibleInputsSelector() {
      return (
        'input:not([type="hidden"]):not([type="file"]), ' +
        'select, ' +
        'textarea'
      )
    }

    get visibleInputDOMs() {
      return Romo.memoize(this, 'visibleInputDOMs', function() {
        return (
          this.formDOM
            .find(this.class.visibleInputsSelector)
            .filter(function(inputDOM) {
              return inputDOM.css('display') !== 'none'
            })
        )
      })
    }

    get focusOnInitInputDOMs() {
      return Romo.memoize(this, 'focusOnInitInputsDOM', function() {
        return this.visibleInputDOMs.filter(function(inputDOM) {
          return inputDOM.data('romo-form-focus-on-init') === true
        })
      })
    }

    get isFocusingEnabled() {
      return (
        this.formDOM.data('romo-form-disable-focus-on-init') !== true
      )
    }

    doFocus() {
      const focusInputDOM =
        this.focusOnInitInputDOMs[0] || this.visibleInputDOMs[0]
      if (this.isFocusingEnabled && focusInputDOM) {
        Romo.pushFn(function() { focusInputDOM.firstElement.focus() })
      }

      return this
    }
  }
})