Romo.define('Romo.UI.Nav.Link', function() {
  return class extends Romo.DOMComponent {
    constructor(dom, { activeCSSClass } = {}) {
      super(dom)
      this.activeCSSClass = activeCSSClass

      this._bind()
    }

    get url() {
      return this.dom.data('romo-ui-nav-link-url') || this.dom.attr('href')
    }

    /* Private */

    _bind() {
      if (this.url === this._currentURL) {
        this.dom.setData('romo-ui-nav-link-active', true)
        this.dom.addClass(this.activeCSSClass)
      } else {
        this.dom.setData('romo-ui-nav-link-active', false)
        this.dom.removeClass(this.activeCSSClass)
      }
    }

    get _currentURL() {
      return window.location.pathname
    }
  }
})
