import '../utilities/dom_component.js'

Romo.define('Romo.UI.Avatar', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

      this._bind()
    }

    static get attrPrefix() {
      return 'romo-ui-avatar'
    }

    static get undefinedURL() {
      return `${this.attrPrefix}-undefined`
    }

    get abbrev() {
      return this.domData('abbrev') || this.abbreviatedName
    }

    get abbreviatedName() {
      return Romo.memoize(this, 'abbreviatedName', function() {
        return this._buildAbbreviatedName(this.name)
      })
    }

    get name() {
      return this.domData('name')
    }

    get url() {
      return this.domData('url') || this.fallbackURL
    }

    get fallbackURL() {
      return (
        this.domData('fallback-url') || Romo.config.avatar.getDefaultURLFn(this)
      )
    }

    get imageDOM() {
      return Romo.memoize(this, 'imageDOM', function() {
        return this._bindImage()
      })
    }

    get fallbackImageDOM() {
      return Romo.memoize(this, 'fallbackImageDOM', function() {
        return this._bindFallbackImage()
      })
    }

    get abbrevDOM() {
      return Romo.memoize(this, 'abbrevDOM', function() {
        return Romo.dom(Romo.elements(`<span>${this.abbrev}</span>`))
      })
    }

    doRefresh() {
      this._imageDOM = undefined
      this._fallbackImageDOM = undefined
      this._abbrevDOM = undefined

      this.dom.update(this.imageDOM)

      return this
    }

    // private

    _bind() {
      this.domOn('triggerRefresh', function(e) { this.doRefresh() })
      this.doRefresh()
    }

    _bindImage() {
      const dom =
        Romo.dom(Romo.elements(`<img src="${this.url}" alt="" />`))
      dom.on('error', Romo.bind(function(e) {
        Romo.dom(e.target).remove()
        this.dom.update(this.fallbackImageDOM)
      }, this))

      return dom
    }

    _bindFallbackImage() {
      const dom =
        Romo.dom(Romo.elements(`<img src="${this.fallbackURL}" alt="" />`))
      dom.on('error', Romo.bind(function(e) {
        Romo.dom(e.target).remove()
        this.dom.update(this.abbrevDOM)
      }, this))

      return dom
    }

    _buildAbbreviatedName(name) {
      const matches = name.match(/\b(\w)/g)
      return matches.join('')
    }
  }
})

Romo.addAutoInitSelector(`[data-${Romo.UI.Avatar.attrPrefix}]`, Romo.UI.Avatar)
