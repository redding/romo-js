import './css_position_data.js'
import './placement_data.js'

Romo.define('Romo.UI.Tooltip.Bubble', function() {
  return class {
    constructor(romoTooltip) {
      this._romoTooltip = romoTooltip
    }

    get romoXHR() {
      return Romo.memoize(this, 'romoXHR', function() {
        return this._bindXHR()
      })
    }

    get arrowDOM() {
      return Romo.memoize(this, 'arrowDOM', function() {
        return this.dom.find('[data-romo-ui-tooltip-bubble-arrow]')
      })
    }

    get contentDOM() {
      return Romo.memoize(this, 'contentDOM', function() {
        return this.dom.find('[data-romo-ui-tooltip-bubble-content]')
      })
    }

    get dom() {
      return Romo.memoize(this, 'dom', function() {
        return this._bindBubble()
      })
    }

    get template() {
      return `
<div class="romo-ui-tooltip-bubble ${this._romoTooltip.bubbleCSSClass}"
     data-romo-ui-tooltip-bubble>
  <div data-romo-ui-tooltip-bubble-arrow></div>
  <div data-romo-ui-tooltip-bubble-content>
    ${this._romoTooltip.bubbleContent}
  </div>
</div>
`
    }

    get appendReceiverDOM() {
      return Romo.memoize(this, 'appendReceiverDOM', function() {
        const closestSelector =
          this._romoTooltip.dom.data(
            'romo-ui-tooltip-bubble-append-to-closest-selector'
          )

        if (closestSelector) {
          return this._romoTooltip.dom.closest(closestSelector)
        } else {
          return Romo.f(
            this._romoTooltip.dom.data(
              'romo-ui-tooltip-bubble-append-to-selector'
            ) ||
            'body'
          )
        }
      })
    }

    get isOpen() {
      return this.dom.hasClass('romo-ui-tooltip-bubble-open') === true
    }

    get isClosed() {
      return this.dom.hasClass('romo-ui-tooltip-bubble-open') === false
    }

    doOpen() {
      this._romoTooltip.dom.scrollableParents().on(
        'scroll',
        Romo.bind(this._onScrollableParentsScroll, this)
      )

      this.dom.addClass('romo-ui-tooltip-bubble-open')
      this.doPlace(Romo.bind(function() {
        if (
          this._romoTooltip.dom.hasData('romo-ui-tooltip-xhr') &&
          !this.contentDOM.data('romo-xhr-disabled')
        ) {
          this.doUpdateContent('', Romo.bind(function() {
            this.romoXHR.doCall()
          }, this))
        }
        this._romoTooltip.dom.trigger(
          'Romo.UI.Tooltip:opened',
          [this._romoTooltip]
        )
      }, this))

      return this
    }

    doClose() {
      this.dom.removeClass('romo-ui-tooltip-bubble-open')
      this._romoTooltip.dom.scrollableParents().off(
        'scroll',
        Romo.bind(this._onScrollableParentsScroll, this)
      )

      this._romoTooltip.dom.trigger(
        'Romo.UI.Tooltip:closed',
        [this._romoTooltip]
      )

      return this
    }

    doToggle() {
      if (this.isOpen) {
        this.doClose()
      } else {
        this.doOpen()
      }

      return this
    }

    doUpdateContent(contentHTML, fnCallback) {
      this.contentDOM.updateHTML(contentHTML)

      this._romoTooltip.dom.trigger(
        'Romo.UI.Tooltip:bubbleContentUpdated',
        [this._romoTooltip, this.bodyDOM]
      )
      this.doPlace(fnCallback)

      return this
    }

    doPlace(fnCallback) {
      Romo.pushFn(Romo.bind(function() {
        this._place(fnCallback)
      }, this))

      return this
    }

    // private

    _bindXHR() {
      this._romoTooltip.dom.setDataDefault(
        'romo-ui-tooltip-xhr-call-only-once',
        true,
      )
      this.contentDOM.setData(
        'romo-xhr-call-url',
        this._romoTooltip.dom.data('romo-ui-tooltip-xhr-call-url')
      )
      this.contentDOM.setData('romo-xhr-call-method', Romo.XMLHttpRequest.GET)
      this.contentDOM.setData('romo-xhr-call-on', 'undefined')
      this.contentDOM.setData(
        'romo-xhr-call-only-once',
        this._romoTooltip.dom.data('romo-ui-tooltip-xhr-call-only-once'),
      )
      this.contentDOM.setData('romo-xhr-disable-with-spinner', true)

      this.contentDOM.on(
        'Romo.XHR:callSuccess',
        Romo.bind(function(e, romoXHR, data, xhr) {
          // Call in a pushFn to allow the `callEnd` handler to run first.
          Romo.pushFn(Romo.bind(function() {
            this.doUpdateContent(data)
          }, this))
        }, this)
      )
      this.contentDOM.on(
        'Romo.XHR:callEnd',
        Romo.bind(function(e, romoXHR) {
          romoXHR.doEnable()
        }, this)
      )

      const xhr = new Romo.XHR(this.contentDOM)
      this._proxyXHREmittedEvents(
        xhr,
        'callQueueStart',
        'callStart',
        'callProgress',
        'callSuccess',
        'callError',
        'callAbort',
        'callTimeout',
        'callEnd',
        'callQueueEnd',
      )

      // TODO: turn off spinner on call end?

      return xhr
    }

    _bindBubble() {
      const dom = Romo.dom(Romo.elements(this.template))

      dom.setStyle('z-index', this._romoTooltip.dom.zIndex())
      Romo.childElementSet.add(this._romoTooltip.dom, [dom])

      // Run in a pushFn to allow the onReady auto init callbacks to run.
      Romo.pushFn(Romo.bind(function() {
        Romo.append(this.appendReceiverDOM, this.dom)
      }, this))

      return dom
    }

    _proxyXHREmittedEvents(romoXHR, ...eventNames) {
      var xhrEventName, tooltipXHREventName

      eventNames.forEach(Romo.bind(function(eventName) {
        xhrEventName = `Romo.XHR:${eventName}`
        tooltipXHREventName = `Romo.UI.TooltipXHR:${eventName}`

        Romo.proxyEvent({
          fromElement:   this.contentDOM,
          toElement:     this._romoTooltip.dom,
          fromEventName: xhrEventName,
          toEventName:   tooltipXHREventName,
          toArgs:        [this._romoTooltip],
        })
      }, this))
    }

    _onScrollableParentsScroll(e) {
      this.doPlace()
    }

    _place(fnCallback) {
      if (this.isOpen) {
        this._lockSize(Romo.bind(function() {
          const relativeToDOM = this._romoTooltip.dom

          const placementData =
            new Romo.UI.Tooltip.PlacementData(this._romoTooltip, relativeToDOM)
          const cssPositionData =
            new Romo.UI.Tooltip.CSSPositionData(
              this._romoTooltip,
              relativeToDOM,
              placementData
            )

          this.dom.setData('position', placementData.position)
          this.dom.setData('align', placementData.align)

          this.dom.batchSetStyle({
            top:  cssPositionData.topPx + 'px',
            left: cssPositionData.leftPx + 'px',
          })
          if (fnCallback) fnCallback()
        }, this))
      }

      return this
    }

    _lockSize(fnCallback) {
      const viewPortRect = Romo.rect(document.documentElement)

      this.contentDOM.batchRmStyle('width', 'height')
      this.dom.batchSetStyle({
        top:        Math.abs(viewPortRect.top) + 'px',
        left:       Math.abs(viewPortRect.left) + 'px',
        visibility: 'hidden',
      })
      Romo.pushFn(Romo.bind(function() {
        this.contentDOM.batchSetStyle({
          width:  this.contentDOM.width() + 'px',
          height: this.contentDOM.height() + 'px',
        })

        fnCallback()

        this.dom.setStyle('visibility', 'visible')
      }, this))
    }
  }
})
