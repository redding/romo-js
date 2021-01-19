import './dom_component.js'
// https://cdn.skypack.dev/spin.js@v4.1.0
import { Spinner } from 'https://cdn.skypack.dev/pin/spin.js@v4.1.0-xmnFx39PWHmGEVZL6LAZ/min/spinjs.js'

// Romo.Spinner extends a DOM element so that it can display a spinner when
// directed. It uses DOM attributes to configure the spinner and uses DOM
// events to interact with the spinner.
//
// Romo.Spinner composes https://spin.js.org/spin.js.
Romo.define('Romo.Spinner', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

      this.dom.on('Romo.Spinner:triggerStart', Romo.bind(function(e, basisSizePxPx) {
        this.doStart(basisSizePxPx)
      }, this))
      this.dom.on('Romo.Spinner:triggerStop', Romo.bind(function(e) {
        this.doStop()
      }, this))

      // TODO: do this with only a single window pageshow event handler to
      // scale better.
      if (this.stopOnPageshow !== false) {
        Romo.dom(window).on('pageshow', Romo.bind(function(e) {
          this.dom.trigger('Romo.Spinner:triggerStop')
        }, this))
      }
    }

    get sizePx() {
      return this.dom.data('romo-spinner-size-px')
    }

    get containerSelector() {
      return this.dom.data('romo-spinner-container-selector')
    }

    get stopOnPageshow() {
      return this.dom.data('romo-spinner-stop-on-pageshow')
    }

    get isDisabled() {
      return this.dom.data('romo-spinner-disabled')
    }

    get containerDOM() {
      return Romo.memoize(this, 'containerDOM', function() {
        if (this.containerSelector) {
          return this.dom.find(this.containerSelector)
        } else {
          return this.dom
        }
      })
    }

    doStart({ sizePx, startImmediately } = {}) {
      if (this.spinner || this.isDisabled) {
        return
      }

      var basisSizePx = (
        sizePx ||
        this.sizePx ||
        Math.min(Romo.width(this.containerDOM), Romo.height(this.containerDOM))
      )

      var spinnerOptions = {
        /* eslint-disable key-spacing, no-multi-spaces */
        animation: 'spinner-line-fade-quick',       // The CSS animation name for the lines
        lines:     11,                              // The number of lines to draw
        width:     2.0,                             // The line thickness
        length:    parseInt(basisSizePx, 10) / 5.0, // The length of each line
        radius:    parseInt(basisSizePx, 10) / 6.0, // The radius of the inner circle
        corners:   1,                               // Corner roundness (0..1)
        rotate:    0,                               // The rotation offset
        direction: 1,                               // 1: clockwise, -1: counterclockwise
        color:     this.containerDOM.css('color'),  // #rgb or #rrggbb or array of colors
        speed:     1,                               // Rounds per second
        trail:     60,                              // Afterglow percentage
        shadow:    false,                           // Whether to render a shadow
        hwaccel:   false,                           // Whether to use hardware acceleration
        className: '',                              // The CSS class to assign to the spinner
        zIndex:    1000,                            // The z-index (defaults to 2000000000)
        top:       '50%',                           // Top position relative to parent
        left:      '50%',                           // Left position relative to parent
        /* eslint-enable key-spacing, no-multi-spaces */
      }
      this.spinner = new Spinner(spinnerOptions)

      this.containerHTML = this.containerDOM.innerHTML
      this.containerStyle = this.containerDOM.attr('style')

      Romo.pushFn(Romo.bind(function() {
        this.containerDOM
          .batchSetStyle({
            position:        'relative',
            width:           Romo.width(this.containerDOM) + 'px',
            height:          Romo.height(this.containerDOM) + 'px',
            color:           this.containerDOM.css('color'),
            backgroundColor: this.containerDOM.css('background-color'),
            borderColor:     this.containerDOM.css('border-color'),
          })
          .clearHTML()

        if (this.spinner) {
          this.spinner.spin(this.containerDOM.firstElement)
        }

        this.dom.trigger('Romo.Spinner:started', [this])
      }, this))

      return this
    }

    doStop() {
      Romo.pushFn(Romo.bind(function() {
        if (this.spinner === undefined) {
          return
        }

        this.spinner.stop()
        this.spinner = undefined

        if (this.containerHTML) {
          this.containerDOM.innerHTML = this.containerHTML
        }

        this.containerDOM.batchSetStyle({
          position:        '',
          width:           '',
          height:          '',
          color:           '',
          backgroundColor: '',
          borderColor:     '',
        })

        if (this.containerStyle) {
          this.containerDOM.setAttr('style', this.containerStyle)
        }

        this.dom.trigger('Romo.Spinner:stopped', [this])
      }, this))

      return this
    }
  }
})

Romo.addAutoInitSelector('[data-romo-spinner]', Romo.Spinner)
