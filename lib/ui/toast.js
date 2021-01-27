import '../utilities/dom_component.js'

Romo.define('Romo.UI.Toast', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super({
        dom:         dom,
        attrPrefix:  'romo-ui-toast',
        eventPrefix: 'Romo.UI.Toast',
      })

      this._bind()
    }

    static get listDOM() {
      return Romo.memoize(this, 'listDOM', function() {
        const dom = Romo.dom(Romo.elements(this.listTemplate))

        this.bodyDOM.append(dom)

        this.bodyDOM.on(
          'Romo.UI.Toast:triggerAdd',
          Romo.bind(function(e, dom) {
            this.doAdd(dom)
          }, this)
        )
        this.bodyDOM.on(
          'Romo.UI.Toast:triggerDismissAll',
          Romo.bind(function(e, dom) {
            this.doDismissAll()
          }, this)
        )

        return dom
      })
    }

    static get listTemplate() {
      return `
<div class="romo-ui-toast-list"
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
        .trigger('Romo.UI.Toast:triggerShow')
      this.bodyDOM.trigger('Romo.UI.Toast:allShown', [this])

      return this
    }

    static doDismissAll() {
      this
        .listDOM
        .find('[data-romo-ui-listed-toast]')
        .trigger('Romo.UI.Toast:triggerDismiss')
      this.bodyDOM.trigger('Romo.UI.Toast:allDismissed', [this])

      return this
    }

    get bodyDOM() {
      return this.class.bodyDOM
    }

    doShow() {
      if (this.hasDOMClass('dismissed')) {
        this.addDOMClass('shown')
        this.removeDOMClass('dismissed')
        this.bodyDOM.trigger('Romo.UI.Toast:shown', [this])
      }

      return this
    }

    doDismiss() {
      if (this.hasDOMClass('shown') && !this.hasDOMClass('dismissed')) {
        this.addDOMClass('dismissed')
        this.removeDOMClass('shown')
        this.bodyDOM.trigger('Romo.UI.Toast:dismissed', [this])
      }

      return this
    }

    // private

    _bind() {
      this.dom.remove()
      this.dom.rmProp('data-romo-ui-toast')
      this.dom.setProp('data-romo-ui-listed-toast')
      this.addDOMClass('dismissed')

      this.domOn('triggerShow', function(e) { this.doShow() })
      this.domOn('triggerDismiss', function(e) { this.doDismiss() })
      this
        .dom
        .find('[data-romo-ui-toast-dismiss]')
        .on('click', Romo.bind(function(e) {
          e.preventDefault()
          this.doDismiss()
        }, this))

      this.class.doAdd(this.dom)
      this.doShow()
      this.bodyDOM.trigger('Romo.UI.Toast:added', [this])
    }
  }
})

Romo.addAutoInitSelector('[data-romo-ui-toast]', Romo.UI.Toast)
