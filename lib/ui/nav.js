import './nav/link.js'

// Romo.UI.Nav is used to auto-activate nav links in nav components. This removes the
// need to view model which nav link is currently active. This also allows for
// easier caching of markup as you don't need to cache for each permutation of
// active nav links.
Romo.define('Romo.UI.Nav', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

      this._bind()
    }

    get activeCSSClass() {
      return this.dom.data('romo-ui-nav-active-css-class') || 'active'
    }

    get linksDOM() {
      return this.dom.find('[data-romo-ui-nav-link]')
    }

    doRefresh() {
      const activeCSSClass = this.activeCSSClass

      this.linksDOM.forEach(function(linkDOM) {
        new Romo.UI.Nav.Link(linkDOM, { activeCSSClass: activeCSSClass })
      })

      return this
    }

    // private

    _bind() {
      this.dom.on('Romo.UI.Nav:triggerRefresh', Romo.bind(function(e) {
        this.doRefresh()
      }, this))

      this.doRefresh()
    }
  }
})

Romo.addAutoInitSelector('[data-romo-ui-nav]', Romo.UI.Nav)
