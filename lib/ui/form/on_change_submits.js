Romo.define('Romo.Form.OnChangeSubmits', function() {
  return class {
    constructor(formDOM) {
      this.formDOM = formDOM
      this._bind()
    }

    static get selector() {
      return '[data-romo-form-on-change-submit]'
    }

    get onChangeSubmitsDOM() {
      return Romo.memoize(this, 'onChangeSubmitDOMs', function() {
        return this.formDOM.find(this.class.selector)
      })
    }

    // private

    _bind() {
      this.onChangeSubmitsDOM.on('change', Romo.bind(function(e) {
        const submitDOM = Romo.dom(e.target).closest(this.class.selector)
        this.formDOM.trigger(
          'Romo.Form.OnChangeSubmits:changed',
          [this, submitDOM]
        )
      }, this))
    }
  }
})
