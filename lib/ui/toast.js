import '../utilities/dom_component.js'

Romo.define('Romo.UI.Toast', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

      this._bind()
    }

    static get attrPrefix() {
      return 'romo-ui-toast'
    }

    static get eventPrefix() {
      return 'Romo.UI.Toast'
    }

    static get listDOM() {
      return Romo.memoize(this, 'listDOM', function() {
        const dom = Romo.dom(Romo.elements(this.listTemplate))

        this.bodyDOM.append(dom)

        this.bodyDOM.on(
          `${this.eventPrefix}:triggerAdd`,
          Romo.bind(function(e, dom) {
            this.doAdd(dom)
          }, this)
        )
        this.bodyDOM.on(
          `${this.eventPrefix}:triggerDismissAll`,
          Romo.bind(function(e, dom) {
            this.doDismissAll()
          }, this)
        )

        return dom
      })
    }

    static get listTemplate() {
      return `
<div class="${this.attrPrefix}-list"
     style="top: ${Romo.config.popovers.headerSpacingPxFn()}px">
</div>
`
    }

    static get bodyDOM() {
      return Romo.memoize(this, 'bodyDOM', function() {
        return Romo.f('body')
      })
    }

    static doAdd(dom) {
      this.listDOM.append(dom)

      return this
    }

    static doShowAll() {
      this
        .listDOM
        .find('[data-romo-ui-listed-toast]')
        .trigger(`${this.eventPrefix}:triggerShow`)
      this.bodyDOM.trigger(`${this.eventPrefix}:allShown`, [this])

      return this
    }

    static doDismissAll() {
      this
        .listDOM
        .find('[data-romo-ui-listed-toast]')
        .trigger(`${this.eventPrefix}:triggerDismiss`)
      this.bodyDOM.trigger(`${this.eventPrefix}:allDismissed`, [this])

      return this
    }

    get bodyDOM() {
      return this.class.bodyDOM
    }

    doShow() {
      if (this.hasDOMClass('dismissed')) {
        this.addDOMClass('shown')
        this.removeDOMClass('dismissed')
        this.bodyDOM.trigger(`${this.eventPrefix}:shown`, [this])
      }

      return this
    }

    doDismiss() {
      if (this.hasDOMClass('shown') && !this.hasDOMClass('dismissed')) {
        this.addDOMClass('dismissed')
        this.removeDOMClass('shown')
        this.bodyDOM.trigger(`${this.eventPrefix}:dismissed`, [this])
      }

      return this
    }

    // private

    _bind() {
      this.dom.remove()
      this.dom.rmProp(`data-${this.attrPrefix}`)
      this.dom.setProp('data-romo-ui-listed-toast')
      this.addDOMClass('dismissed')

      this.domOn('triggerShow', function(e) { this.doShow() })
      this.domOn('triggerDismiss', function(e) { this.doDismiss() })
      this
        .dom
        .find(`[data-${this.attrPrefix}-dismiss]`)
        .on('click', Romo.bind(function(e) {
          e.preventDefault()
          this.doDismiss()
        }, this))

      this.class.doAdd(this.dom)
      this.doShow()
      this.bodyDOM.trigger(`${this.eventPrefix}:added`, [this])
    }
  }
})

Romo.addAutoInitSelector(`[data-${Romo.UI.Toast.attrPrefix}]`, Romo.UI.Toast)
