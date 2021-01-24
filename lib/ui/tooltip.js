import '../utilities/dom_component.js'
import './tooltip/placement_config.js'
import './tooltip/bubble.js'

Romo.define('Romo.UI.Tooltip', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super({
        dom:         dom,
        attrPrefix:  'romo-ui-tooltip',
        eventPrefix: 'Romo.UI.Tooltip',
      })

      this.bubble = new Romo.UI.Tooltip.Bubble(this)
      this._bind()
    }

    static get headerSpacingPx() {
      return Romo.config.tooltips.headerSpacingPxFn()
    }

    static get footerSpacingPx() {
      return Romo.config.tooltips.footerSpacingPxFn()
    }

    static get defaultPadPx() {
      return Romo.config.tooltips.defaultPadPxFn()
    }

    get bubbleCSSClass() {
      return this.domData('css-class')
    }

    get bubbleContent() {
      return this.domData('content')
    }

    get onToggleEnterDelay() {
      return (this.domData('enter-delay-ms') || this.domData('delay-ms') || 0)
    }

    get onToggleLeaveDelay() {
      return (this.domData('leave-delay-ms') || this.domData('delay-ms') || 0)
    }

    get isDisabled() {
      return this.dom.hasClass('disabled')
    }

    get isBubbleOpen() {
      return this.bubble.isOpen()
    }

    get isBubbleClosed() {
      return this.bubble.isBubbleClosed()
    }

    get defaultPlacementPosition() {
      return this._defaultPlacementConfig.position
    }

    get defaultPlacementAlign() {
      return this._defaultPlacementConfig.align
    }

    get bubbleDOM() {
      return this.bubble.dom
    }

    get bubbleContentDOM() {
      return this.bubble.contentDOM
    }

    get arrowDOM() {
      return this.bubble.arrowDOM
    }

    getPadPx(type, direction) {
      const specficPx = this.domData(`bubble-${type}-pad-px-${direction}`)
      const generalPx = this.domData(`bubble-${type}-pad-px`)

      return specficPx || generalPx || this.class.defaultPadPx
    }

    getArrowSpacingPx(type) {
      if (type === 'height') {
        return this.arrowDOM.height()
      } else if (type === 'width') {
        return this.arrowDOM.width()
      } else {
        return 0
      }
    }

    doOpenBubble() {
      this.bubble.doOpen()

      return this
    }

    doCloseBubble() {
      this.bubble.doClose()

      return this
    }

    doToggleBubble() {
      this.bubble.doToggle()

      return this
    }

    doPlaceBubble() {
      this.bubble.doPlace()

      return this
    }

    doUpdateBubbleContent(content) {
      this.bubble.doUpdateContent(content)

      return this
    }

    // private

    get _defaultPlacementConfig() {
      return Romo.memoize(this, '_defaultPlacementConfig', function() {
        return new Romo.UI.Tooltip.PlacementConfig(
          this.domData('default-placement')
        )
      })
    }

    _bind() {
      this.setDOMDataDefault('css-class', '')
      this.setDOMDataDefault('content', '')

      // By default, account for the fixed header/footer heights.
      this.setDOMDataDefault(
        'max-height-detect-pad-px-top',
        this.class.headerSpacingPx
      )
      this.setDOMDataDefault(
        'max-height-detect-pad-px-bottom',
        this.class.footerSpacingPx
      )

      this.domOn('triggerOpenBubble', this._onTriggerOpenBubble)
      this.domOn('triggerCloseBubble', this._onTriggerCloseBubble)
      this.domOn('triggerToggleBubble', this._onTriggerToggleBubble)
      this.domOn('triggerPlaceBubble', this._onTriggerPlaceBubble)
      this.domOn('triggerUpdateBubbleContent', this._onTriggerUpdateBubbleContent)

      this.hoverState = 'out'
      this.on('mouseenter', this._onToggleEnter)
      this.on('mouseleave', this._onToggleLeave)
    }

    _onTriggerOpenBubble(e) {
      if (!this.isDisabled && this.isBubbleClosed) {
        Romo.pushFn(Romo.bind(this.doOpenBubble, this))
      }
    }

    _onTriggerCloseBubble(e) {
      if (!this.isDisabled && this.isBubbleOpen) {
        Romo.pushFn(Romo.bind(this.doCloseBubble, this))
      }
    }

    _onTriggerToggleBubble(e) {
      if (!this.isDisabled && this.domData('disable-toggle') !== true) {
        Romo.pushFn(Romo.bind(this.doToggleBubble, this))
      }
    }

    _onTriggerPlaceBubble(e) {
      if (!this.isDisabled && this.isBubbleOpen) {
        Romo.pushFn(Romo.bind(this.doPlaceBubble, this))
      }
    }

    _onTriggerUpdateBubbleContent(e, content) {
      this.doUpdateBubbleContent(content)
    }

    _onToggleEnter(e) {
      if (!this.isDisabled) {
        this.hoverState = 'in'
        clearTimeout(this._timeout)
        this._timeout =
          Romo.delayFn(this.onToggleEnterDelay, Romo.bind(function() {
            if (this.hoverState === 'in') this.doOpenBubble()
          }, this))
      }
    }

    _onToggleLeave(e) {
      if (!this.isDisabled) {
        this.hoverState = 'out'
        clearTimeout(this._timeout)
        this._timeout =
          Romo.delayFn(this.onToggleLeaveDelay, Romo.bind(function() {
            if (this.hoverState === 'out') this.doCloseBubble()
          }, this))
      }
    }
  }
})

Romo.addAutoInitSelector('[data-romo-ui-tooltip]', Romo.UI.Tooltip)
