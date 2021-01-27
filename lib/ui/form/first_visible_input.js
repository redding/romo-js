Romo.define('Romo.UI.Form.FirstVisibleInput', function() {
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
          return (
            inputDOM.data(`${Romo.UI.Form.attrPrefix}-focus-on-init`) === true
          )
        })
      })
    }

    get isFocusingEnabled() {
      return (
        this.formDOM.data(`${Romo.UI.Form.attrPrefix}-disable-focus-on-init`) !==
        true
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
