import '../utilities/dom_component.js'

Romo.define('Romo.UI.Banner', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super({
        dom:         dom,
        attrPrefix:  'romo-ui-banner',
        eventPrefix: 'Romo.UI.Banner',
      })

      this._bind()
    }

    static get contentDOM() {
      return Romo.memoize(this, 'contentDOM', function() {
        return this.containerDOM.find('[data-romo-ui-banner-content]')
      })
    }

    static get containerDOM() {
      return Romo.memoize(this, 'containerDOM', function() {
        const dom = Romo.dom(Romo.elements(this.containerTemplate))

        this.bodyDOM.append(dom)

        this.bodyDOM.on(
          'Romo.UI.Banner:triggerUpdate',
          Romo.bind(function(e, dom) {
            this.doUpdate(dom)
          }, this)
        )
        this.bodyDOM.on(
          'Romo.UI.Banner:triggerShow',
          Romo.bind(function(e, dom) {
            this.doShow(dom)
          }, this)
        )
        this.bodyDOM.on(
          'Romo.UI.Banner:triggerHide',
          Romo.bind(function(e, dom) {
            this.doHide()
          }, this)
        )

        return dom
      })
    }

    static get containerTemplate() {
      return `
<div class="romo-ui-banner-container"
     style="display: none;
            top: ${Romo.config.popovers.headerSpacingPxFn()}px;
            bottom: ${Romo.config.popovers.footerSpacingPxFn()}px">
  <div data-romo-ui-banner-content></div>
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

      this.bodyDOM.trigger('Romo.UI.Banner:updated', [this, dom])

      return this
    }

    static doShow(dom) {
      if (dom) this.doUpdate(dom)
      this.containerDOM.show()
      this.bodyDOM.trigger('Romo.UI.Banner:shown', [this])

      return this
    }

    static doHide() {
      this.containerDOM.hide()
      this.bodyDOM.trigger('Romo.UI.Banner:hidden', [this])

      return this
    }

    // private

    _bind() {
      this.dom.remove()
      this.dom.rmAttr('data-romo-ui-banner')
      this.class.doShow(this.dom)
    }
  }
})

Romo.addAutoInitSelector('[data-romo-ui-banner]', Romo.UI.Banner)
