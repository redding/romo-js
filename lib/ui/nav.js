import '../utilities/dom_component.js'
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

    static get attrPrefix() {
      return 'romo-ui-nav'
    }

    static get eventPrefix() {
      return 'Romo.UI.Nav'
    }

    get activeCSSClass() {
      return this.domData('active-css-class') || 'active'
    }

    get linksDOM() {
      return this.dom.find(`[data-${Romo.UI.Nav.Link.attrPrefix}]`)
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
      this.domOn('triggerRefresh', function(e) { this.doRefresh() })
      this.doRefresh()
    }
  }
})

Romo.addAutoInitSelector(`[data-${Romo.UI.Nav.attrPrefix}]`, Romo.UI.Nav)
