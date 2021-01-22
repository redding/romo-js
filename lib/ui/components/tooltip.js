import '../../components/dom_component.js'
import './tooltip/placement_config.js'
import './tooltip/bubble.js'

Romo.define('Romo.UI.Tooltip', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

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
      return this.dom.data('romo-ui-tooltip-css-class')
    }

    get bubbleContent() {
      return this.dom.data('romo-ui-tooltip-content')
    }

    get onToggleEnterDelay() {
      return (
        this.dom.data('romo-ui-tooltip-enter-delay-ms') ||
        this.dom.data('romo-ui-tooltip-delay-ms') ||
        0
      )
    }

    get onToggleLeaveDelay() {
      return (
        this.dom.data('romo-ui-tooltip-leave-delay-ms') ||
        this.dom.data('romo-ui-tooltip-delay-ms') ||
        0
      )
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
      const specficPx =
        this.dom.data(`romo-ui-tooltip-bubble-${type}-pad-px-${direction}`)
      const generalPx = this.dom.data(`romo-ui-tooltip-bubble-${type}-pad-px`)

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
          this.dom.data('romo-ui-tooltip-default-placement')
        )
      })
    }

    _bind() {
      this.dom.setDataDefault('romo-ui-tooltip-css-class', '')
      this.dom.setDataDefault('romo-ui-tooltip-content', '')

      // By default, account for the fixed header/footer heights.
      this.dom.setDataDefault(
        `${this.attrPrefix}-tooltip-max-height-detect-pad-px-top`,
        this.class.headerSpacingPx
      )
      this.dom.setDataDefault(
        `${this.attrPrefix}-tooltip-max-height-detect-pad-px-bottom`,
        this.class.footerSpacingPx
      )

      this.dom.on(
        'Romo.UI.Tooltip:triggerOpenBubble',
        Romo.bind(this._onTriggerOpenBubble, this)
      )
      this.dom.on(
        'Romo.UI.Tooltip:triggerCloseBubble',
        Romo.bind(this._onTriggerCloseBubble, this)
      )
      this.dom.on(
        'Romo.UI.Tooltip:triggerToggleBubble',
        Romo.bind(this._onTriggerToggleBubble, this)
      )
      this.dom.on(
        'Romo.UI.Tooltip:triggerPlaceBubble',
        Romo.bind(this._onTriggerPlaceBubble, this)
      )

      this.hoverState = 'out'
      this.dom.on('mouseenter', Romo.bind(this._onToggleEnter, this))
      this.dom.on('mouseleave', Romo.bind(this._onToggleLeave, this))
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
      if (
        !this.isDisabled &&
        this.dom.data('romo-ui-tooltip-disable-toggle') !== true
      ) {
        Romo.pushFn(Romo.bind(this.doToggleBubble, this))
      }
    }

    _onTriggerPlaceBubble(e) {
      if (!this.isDisabled && this.isBubbleOpen) {
        Romo.pushFn(Romo.bind(this.doPlaceBubble, this))
      }
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
