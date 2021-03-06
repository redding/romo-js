import '../utilities/dom_component.js'

Romo.define('Romo.UI.OnKey', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

      this.delayTimeout = undefined
      this._bind()
    }

    static get attrPrefix() {
      return 'romo-ui-on-key'
    }

    static get defaultKeyEvent() {
      return Romo.config.onKey.defaultKeyEventFn()
    }

    static get defaultDelayMs() {
      return Romo.config.onKey.defaultDelayMsFn()
    }

    get keyEvent() {
      return this.domData('event') || this.class.defaultKeyEvent
    }

    get delayMs() {
      return this.domData('delay-ms') || this.defaultDelayMs
    }

    // private

    _bind() {
      this.dom.on(this.keyEvent, Romo.bind(this._onKeyEvent, this))
    }

    _onKeyEvent(keyEvent) {
      clearTimeout(this.delayTimeout)
      this.delayTimeout =
        Romo.delayFn(this.delayMs, Romo.bind(function() {
          this.domTrigger('keyEvent', [keyEvent])
        }, this))
    }
  }
})

Romo.addAutoInitSelector(`[data-${Romo.UI.OnKey.attrPrefix}]`, Romo.UI.OnKey)
