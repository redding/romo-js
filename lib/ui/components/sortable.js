// https://cdn.skypack.dev/sortablejs@v1.13.0
import { Sortable } from 'https://cdn.skypack.dev/pin/sortablejs@v1.13.0-mei9zfSyMp6mF9rZklbl/min/sortablejs.js'

// Romo.UI.Sortable extends sortablejs to have the typical Romo features: DOM
// configuration, auto-initialization, and event-based interations.
Romo.define('Romo.UI.Sortable', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

      this._bind()
    }

    static get defaultSort() {
      return true
    }

    static get defaultDirection() {
      return 'vertical'
    }

    static get defaultHandle() {
      return '[data-romo-ui-sortable-handle]'
    }

    static get defaultGhostCSSClass() {
      return 'romo-ui-sortable-ghost'
    }

    static get defaultChosenCSSClass() {
      return 'romo-ui-sortable-chosen'
    }

    static get defaultAnimation() {
      return 200
    }

    // private

    _bind() {
      Romo.setDataDefault(
        this.dom,
        'romo-ui-sortable-sort',
        this.class.defaultSort
      )
      Romo.setDataDefault(
        this.dom,
        'romo-ui-sortable-direction',
        this.class.defaultDirection
      )
      Romo.setDataDefault(
        this.dom,
        'romo-ui-sortable-handle',
        this.class.defaultHandle
      )
      Romo.setDataDefault(
        this.dom,
        'romo-ui-sortable-ghost-css-class',
        this.class.defaultGhostCSSClass
      )
      Romo.setDataDefault(
        this.dom,
        'romo-ui-sortable-chosen-css-class',
        this.class.defaultChosenCSSClass
      )
      Romo.setDataDefault(
        this.dom,
        'romo-ui-sortable-animation',
        this.class.defaultAnimation
      )

      Sortable.create(this.dom.firstElement, {
        group:       this.dom.data('romo-ui-sortable-group'),
        sort:        this.dom.data('romo-ui-sortable-sort'),
        direction:   this.dom.data('romo-ui-sortable-direction'),
        draggable:   this.dom.data('romo-ui-sortable-draggable'),
        handle:      this.dom.data('romo-ui-sortable-handle'),
        ghostClass:  this.dom.data('romo-ui-sortable-ghost-css-class'),
        chosenClass: this.dom.data('romo-ui-sortable-chosen-css-class'),
        animation:   this.dom.data('romo-ui-sortable-animation'),
        onUpdate:
          Romo.bind(function(e) {
            this.dom.trigger('Romo.UI.Sortable:onUpdate', [this, e])
          }, this),
      })
    }
  }
})

Romo.addAutoInitSelector('[data-romo-ui-sortable]', Romo.UI.Sortable)
