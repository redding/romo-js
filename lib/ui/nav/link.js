Romo.define('Romo.UI.Nav.Link', function() {
  return class extends Romo.DOMComponent {
    constructor(dom, { activeCSSClass } = {}) {
      super({
        dom:         dom,
        attrPrefix:  'romo-ui-nav-link',
        eventPrefix: 'Romo.UI.Nav.Link',
      })
      this.activeCSSClass = activeCSSClass

      this._bind()
    }

    get url() {
      return Romo.memoize(this, 'url', function() {
        return Romo.url(this.domData('url') || this.dom.attr('href'))
      })
    }

    get activateForNested() {
      return this.domData('activate-for-nested') !== false
    }

    get isActive() {
      return (
        this.url.pathname === this._currentPathname ||
        (
          this.activateForNested &&
          (new RegExp(`^${this.url.pathname}/`, 'i')).test(
            `${this._currentPathname}/`
          )
        )
      )
    }

    /* Private */

    _bind() {
      if (this.isActive) {
        this.setDOMData('active', true)
        this.dom.addClass(this.activeCSSClass)
      } else {
        this.setDOMData('active', false)
        this.dom.removeClass(this.activeCSSClass)
      }
    }

    get _currentPathname() {
      return window.location.pathname
    }
  }
})
