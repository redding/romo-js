// https://cdn.skypack.dev/sortablejs@v1.13.0
import { Sortable } from 'https://cdn.skypack.dev/pin/sortablejs@v1.13.0-mei9zfSyMp6mF9rZklbl/min/sortablejs.js'
import '../utilities/dom_component.js'

// Romo.UI.Sortable extends sortablejs to have the typical Romo features: DOM
// configuration, auto-initialization, and event-based interations.
Romo.define('Romo.UI.Sortable', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

      this._bind()
    }

    static get attrPrefix() {
      return 'romo-ui-sortable'
    }

    static get defaultSort() {
      return true
    }

    static get defaultDirection() {
      return 'vertical'
    }

    static get defaultHandle() {
      return `[data-${this.attrPrefix}-handle]`
    }

    static get defaultGhostCSSClass() {
      return `${this.attrPrefix}-ghost`
    }

    static get defaultChosenCSSClass() {
      return `${this.attrPrefix}-chosen`
    }

    static get defaultAnimation() {
      return 200
    }

    // private

    _bind() {
      this.setDOMDataDefault('sort', this.class.defaultSort)
      this.setDOMDataDefault('direction', this.class.defaultDirection)
      this.setDOMDataDefault('handle', this.class.defaultHandle)
      this.setDOMDataDefault('ghost-css-class', this.class.defaultGhostCSSClass)
      this.setDOMDataDefault('chosen-css-class', this.class.defaultChosenCSSClass)
      this.setDOMDataDefault('animation', this.class.defaultAnimation)

      Sortable.create(this.dom.firstElement, {
        group:       this.domData('group'),
        sort:        this.domData('sort'),
        direction:   this.domData('direction'),
        draggable:   this.domData('draggable'),
        handle:      this.domData('handle'),
        ghostClass:  this.domData('ghost-css-class'),
        chosenClass: this.domData('chosen-css-class'),
        animation:   this.domData('animation'),
        onUpdate:
          Romo.bind(function(e) { this.domTrigger('onUpdate', [e]) }, this),
      })
    }
  }
})

Romo.addAutoInitSelector(`[data-${Romo.UI.Sortable.attrPrefix}]`, Romo.UI.Sortable)
