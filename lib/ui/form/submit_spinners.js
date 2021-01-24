import '../../utilities/dom_component.js'

Romo.define('Romo.Form.SubmitSpinners', function() {
  return class extends Romo.DOMComponent {
    constructor(formDOM, { givenSubmitSpinnersDOM } = {}) {
      super(formDOM)

      this.formDOM = formDOM
      this.givenSubmitSpinnersDOM = givenSubmitSpinnersDOM
    }

    static get selector() {
      return (
        'button[type="submit"][data-romo-spinner], ' +
        'input[type="submit"][data-romo-spinner], ' +
        '[data-romo-form-submit][data-romo-spinner], ' +
        '[data-romo-form-submit-spinner][data-romo-spinner]'
      )
    }

    get submitSpinnersDOM() {
      return Romo.memoize(this, 'submitSpinnersDOM', function() {
        return (
          Romo
            .dom()
            .concat(this.givenSubmitSpinnersDOM)
            .concat(this.formDOM.find(this.class.selector))
        )
      })
    }

    doStart() {
      this.submitSpinnersDOM.trigger('Romo.Spinner:triggerStart')

      return this
    }

    doStop() {
      this.submitSpinnersDOM.trigger('Romo.Spinner:triggerStop')

      return this
    }
  }
})
