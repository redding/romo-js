import '../utilities/dom_component.js'
import './dropdown/css_position_data.js'
import './dropdown/placement_config.js'
import './dropdown/placement_data.js'
import './popover.js'

Romo.define('Romo.UI.Dropdown', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

      this.romoPopover =
        new Romo.UI.Popover(this)

      if (this.domData('disable-click-toggle') !== true) {
        this.on('click', function(e) {
          e.preventDefault()
          if (this.isPopoverOpen) {
            e.stopPropagation()
          }

          this.domTrigger('triggerTogglePopover')
        })
      }

      this.domOn('popoverOpened', function(e) {
        this.dom.addClass(this.openCSSClass)
      })
      this.domOn('popoverClosed', function(e) {
        this.dom.removeClass(this.openCSSClass)
      })
    }

    static get attrPrefix() {
      return 'romo-ui-dropdown'
    }

    static get spacingPx() {
      return Romo.config.popovers.dropdownSpacingPxFn()
    }

    static get defaultPadPx() {
      return Romo.config.popovers.defaultPadPxFn()
    }

    static get baseOpenCSSClass() {
      return Romo.config.popovers.dropdownBaseOpenCSSClassFn()
    }

    get isDisabled() {
      return this.dom.hasClass('disabled')
    }

    get isPopoverOpen() {
      return this.romoPopover.isOpen
    }

    get isPopoverClosed() {
      return this.romoPopover.isClosed
    }

    get defaultPlacementPosition() {
      return this._defaultPlacementConfig.position
    }

    get defaultPlacementAlign() {
      return this._defaultPlacementConfig.align
    }

    get openCSSClass() {
      return (
        `${this.class.baseOpenCSSClass} ${this.domData('open-css-class')}`
      )
    }

    get popoverDOM() {
      return this.romoPopover.dom
    }

    get popoverBodyDOM() {
      return this.romoPopover.bodyDOM
    }

    getPadPx(type, direction) {
      const specficPx =
        this.domData(`popover-max-${type}-detect-pad-px-${direction}`)
      const generalPx =
        this.domData(`popover-max-${type}-detect-pad-px`)

      return specficPx || generalPx || this.class.defaultPadPx
    }

    doOpenPopover() {
      this.romoPopover.doOpen()

      return this
    }

    doClosePopover() {
      this.romoPopover.doClose()

      return this
    }

    doTogglePopover() {
      this.romoPopover.doToggle()

      return this
    }

    doUpdatePopoverBody(content) {
      this.romoPopover.doUpdateBody(content)

      return this
    }

    doPlacePopover() {
      if (this.romoPopover.isOpen) {
        const relativeToDOM = this.dom

        const placementData =
          new Romo.UI.Dropdown.PlacementData(this, relativeToDOM)
        const cssPositionData =
          new Romo.UI.Dropdown.CSSPositionData(
            this,
            relativeToDOM,
            placementData
          )
        if (this.domData('popover-max-height') === 'auto') {
          this.romoPopover.doUnsetContentMaxHeightPx()
          this.romoPopover.doSetContentMaxHeightPx(placementData.maxHeightPx)
        }
        if (this.domData('popover-max-width') === 'auto') {
          this.romoPopover.doUnsetContentMaxWidthPx()
          this.romoPopover.doSetContentMaxWidthPx(placementData.maxWidthPx)
        }

        this.popoverDOM.setData(
          `${this.attrPrefix}-popover-placement-position`,
          placementData.position
        )
        this.popoverDOM.setData(
          `${this.attrPrefix}-popover-placement-align`,
          placementData.align
        )

        this.popoverDOM.batchSetStyle({
          top:    cssPositionData.top,
          right:  cssPositionData.right,
          bottom: cssPositionData.bottom,
          left:   cssPositionData.left,
        })
      }

      return this
    }

    // private

    get _defaultPlacementConfig() {
      return Romo.memoize(this, '_defaultPlacementConfig', function() {
        return new Romo.UI.Dropdown.PlacementConfig(
          this.domData('popover-default-placement')
        )
      })
    }
  }
})

Romo.addPopoverStackSelector(`[data-${Romo.UI.Dropdown.attrPrefix}-popover]`)
Romo.addAutoInitSelector(`[data-${Romo.UI.Dropdown.attrPrefix}]`, Romo.UI.Dropdown)
