import '../utilities/dom_component.js'

Romo.define('Romo.UI.InfiniteScroller', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

      this._bind()
    }

    static get attrPrefix() {
      return 'romo-ui-infinite-scroller'
    }

    static get eventPrefix() {
      return 'Romo.UI.InfiniteScroller'
    }

    static onViewChange(e) {
      Romo
        .f(`[data-${this.attrPrefix}]`)
        .trigger(`${this.eventPrefix}:triggerViewChange`)
    }

    get containerDOM() {
      return Romo.memoize(this, 'containerDOM', function() {
        return this.dom.parent()
      })
    }

    get nextPageUrl() {
      return this.domData('next-page-url')
    }

    get shouldAutoCall() {
      return this.domData('auto-call') || false
    }

    get scrollRangePx() {
      return this.domData('scroll-range-px') || 0
    }

    get romoXHR() {
      return Romo.memoize(this, 'romoXHR', function() {
        return this._bindXHR()
      })
    }

    get scrollableParent() {
      return Romo.memoize(this, 'scrollableParent', function() {
        return this.dom.scrollableParent()
      })
    }

    isAboveBottomOfWindow() {
      const scrollableTopPx = this.scrollableParent.scrollTop()
      var scrollableBottomPx = scrollableTopPx + this.scrollableParent.height()
      var domTopRangePx =
        this.dom.offset(this.scrollableParent).top - this.scrollRangePx

      return domTopRangePx <= scrollableBottomPx
    }

    // private

    _bind() {
      this.spinnerDOM = this.containerDOM.find('[data-romo-ui-spinner]')

      this.domOn('triggerViewChange', function(e) {
        if (this.isAboveBottomOfWindow()) {
          this._unbindViewChange()
          this.romoXHR.doCall()
        }
      })

      this.dom.on(
        'Romo.UI.XHR:callStart',
        Romo.bind(function(e, romoAJAX) {
          this.spinnerDOM.trigger('Romo.UI.Spinner:triggerStart')
          this.containerDOM.trigger(`${this.eventPrefix}:callStart`, [this])
        }, this)
      )
      this.dom.on(
        'Romo.UI.XHR:callSuccess',
        Romo.bind(function(e, romoAJAX, data) {
          this.dom.remove()

          var appendedDOM
          if (this.spinnerDOM.hasElements) {
            appendedDOM = this.spinnerDOM.beforeHTML(data)
          } else {
            appendedDOM = this.containerDOM.appendHTML(data)
          }

          if (!appendedDOM.hasElements) {
            this.spinnerDOM.trigger('SC.Spinner:triggerStop')
            this.spinnerDOM.remove()
          }
          this.containerDOM.trigger(
            `${this.eventPrefix}:callSuccess`,
            [this, appendedDOM]
          )
        }, this)
      )

      if (this.shouldAutoCall) {
        this.romoXHR.doCall()
      } else {
        this._bindViewChange()
      }
    }

    _bindViewChange() {
      this.scrollableParent.on('scroll', Romo.bind(this.class.onViewChange, this.class))
      document.addEventListener('scroll', Romo.bind(this.class.onViewChange, this.class))
      window.addEventListener('resize', Romo.bind(this.class.onViewChange, this.class))

      this.dom.trigger(`${this.eventPrefix}:triggerViewChange`)
    }

    _unbindViewChange() {
      this.scrollableParent.off('scroll', Romo.bind(this.class.onViewChange, this.class))
      document.removeEventListener('scroll', Romo.bind(this.class.onViewChange, this.class))
      window.removeEventListener('resize', Romo.bind(this.class.onViewChange, this.class))
    }

    _bindXHR() {
      Romo.setData(this.dom, 'romo-ui-xhr-call-url', this.nextPageUrl)
      const romoXHR = new Romo.UI.XHR(this.dom)
      romoXHR.doUnbindCallOn()

      return romoXHR
    }
  }
})

Romo.addAutoInitSelector(`[data-${Romo.UI.InfiniteScroller.attrPrefix}]`, Romo.UI.InfiniteScroller)
