import '../utilities/dom_component.js'

Romo.define('Romo.UI.Banner', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

      this._bind()
    }

    static get attrPrefix() {
      return 'romo-ui-banner'
    }

    static get contentDOM() {
      return Romo.memoize(this, 'contentDOM', function() {
        return this.containerDOM.find(`[data-${this.attrPrefix}-content]`)
      })
    }

    static get containerDOM() {
      return Romo.memoize(this, 'containerDOM', function() {
        const dom = Romo.dom(Romo.elements(this.containerTemplate))

        this.bodyDOM.append(dom)

        this.bodyDOM.on(
          `${this.eventPrefix}:triggerUpdate`,
          Romo.bind(function(e, dom) {
            this.doUpdate(dom)
          }, this)
        )
        this.bodyDOM.on(
          `${this.eventPrefix}:triggerShow`,
          Romo.bind(function(e, dom) {
            this.doShow(dom)
          }, this)
        )
        this.bodyDOM.on(
          `${this.eventPrefix}:triggerHide`,
          Romo.bind(function(e, dom) {
            this.doHide()
          }, this)
        )

        return dom
      })
    }

    static get containerTemplate() {
      return `
<div class="${this.attrPrefix}-container"
     style="display: none;
            top: ${Romo.config.popovers.headerSpacingPxFn()}px;
            bottom: ${Romo.config.popovers.footerSpacingPxFn()}px">
  <div data-${this.attrPrefix}-content></div>
</div>
`
    }

    static get bodyDOM() {
      return Romo.memoize(this, 'bodyDOM', function() {
        return Romo.f('body')
      })
    }

    static doUpdate(dom) {
      this.contentDOM.update(dom)
      dom
        .find('[data-romo-ui-banner-close]')
        .on('click', Romo.bind(function(e) {
          e.preventDefault()
          this.doHide()
        }, this))

      this.bodyDOM.trigger(`${this.eventPrefix}:updated`, [this, dom])

      return this
    }

    static doShow(dom) {
      if (dom) this.doUpdate(dom)
      this.containerDOM.show()
      this.bodyDOM.trigger(`${this.eventPrefix}:shown`, [this])

      return this
    }

    static doHide() {
      this.containerDOM.hide()
      this.bodyDOM.trigger(`${this.eventPrefix}:hidden`, [this])

      return this
    }

    // private

    _bind() {
      this.dom.remove()
      this.dom.rmProp(`data-${this.attrPrefix}`)
      this.class.doShow(this.dom)
    }
  }
})

Romo.addAutoInitSelector(`[data-${Romo.UI.Banner.attrPrefix}]`, Romo.UI.Banner)
