import '../dom_component.js'

Romo.define('Romo.Form.Submits', function() {
  return class extends Romo.DOMComponent {
    constructor(formDOM, { givenSubmitsDOM } = {}) {
      super(formDOM)

      this.formDOM = formDOM
      this.givenSubmitsDOM = givenSubmitsDOM

      this._bind()
    }

    static get selector() {
      return (
        'button[type="submit"], input[type="submit"], [data-romo-form-submit]'
      )
    }

    static isDisabled(submitDOM) {
      return submitDOM.hasClass('disabled')
    }

    get submitsDOM() {
      return Romo.memoize(this, 'submitsDOM', function() {
        return (
          Romo
            .dom()
            .concat(this.givenSubmitsDOM)
            .concat(this.formDOM.find(this.class.selector))
        )
      })
    }

    get areDisbabled() {
      return (
        this.submitsDOM.reduce(function(disabled, submitDOM) {
          return disabled || this.class.isDisables(submitDOM)
        }, false)
      )
    }

    doDisable() {
      this.submitsDOM.addClass('disabled')

      return this
    }

    doEnable() {
      this.submitsDOM.rmClass('disabled')

      return this
    }

    // private

    _bind() {
      this.submitsDOM.on('click', Romo.bind(function(e) {
        e.preventDefault()

        const submitDOM = Romo.dom(e.target).closest(this.class.selector)
        this.formDOM.trigger('Romo.Form.Submits:clicked', [this, submitDOM])
      }, this))
    }
  }
})
