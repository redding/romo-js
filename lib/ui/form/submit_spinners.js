Romo.define('Romo.UI.Form.SubmitSpinners', function() {
  return class {
    constructor(formDOM, { givenSubmitSpinnersDOM } = {}) {
      this.formDOM = formDOM
      this.givenSubmitSpinnersDOM = givenSubmitSpinnersDOM
    }

    static get selector() {
      return (
        'button[type="submit"][data-romo-ui-spinner], ' +
        'input[type="submit"][data-romo-ui-spinner], ' +
        '[data-romo-ui-form-submit][data-romo-ui-spinner], ' +
        '[data-romo-ui-form-submit-spinner][data-romo-ui-spinner]'
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
      this.submitSpinnersDOM.trigger('Romo.UI.Spinner:triggerStart')

      return this
    }

    doStop() {
      this.submitSpinnersDOM.trigger('Romo.UI.Spinner:triggerStop')

      return this
    }
  }
})
