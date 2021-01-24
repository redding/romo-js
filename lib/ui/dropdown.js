import '../utilities/dom_component.js'
import './dropdown/css_position_data.js'
import './dropdown/placement_config.js'
import './dropdown/placement_data.js'
import './popover.js'

Romo.define('Romo.UI.Dropdown', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super({
        dom:         dom,
        attrPrefix:  'romo-ui-dropdown',
        eventPrefix: 'Romo.UI.Dropdown',
      })

      this.romoPopover =
        new Romo.UI.Popover(this, {
          attrPrefix:  this.attrPrefix,
          eventPrefix: this.eventPrefix,
        })

      if (this.domData('disable-click-toggle') !== true) {
        this.on('click', function(e) {
          e.preventDefault()
          e.stopPropagation()

          this.domTrigger('triggerTogglePopover')
        })
      }

      this.domOn('popoverOpened', function(e) { this.dom.addClass('active') })
      this.domOn('popoverClosed', function(e) { this.dom.removeClass('active') })
    }

    static get spacingPx() {
      return Romo.config.popovers.dropdownSpacingPxFn()
    }

    static get defaultPadPx() {
      return Romo.config.popovers.defaultPadPxFn()
    }

    get isDisabled() {
      return this.dom.hasClass('disabled')
    }

    get isPopoverOpen() {
      return this.romoPopover.isOpen()
    }

    get isPopoverClosed() {
      return this.romoPopover.isClosed()
    }

    get defaultPlacementPosition() {
      return this._defaultPlacementConfig.position
    }

    get defaultPlacementAlign() {
      return this._defaultPlacementConfig.align
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
          this.romoPopover.doSetContentMaxHeightPx(placementData.maxHeightPx)
        }
        if (this.domData('popover-max-width') === 'auto') {
          this.romoPopover.doSetContentMaxWidthPx(placementData.maxWidthPx)
        }

        this.popoverDOM.setData(
          'romo-ui-dropdown-popover-placement-position',
          placementData.position
        )
        this.popoverDOM.setData(
          'romo-ui-dropdown-popover-placement-align',
          placementData.align
        )

        this.popoverDOM.batchSetStyle({
          top:  cssPositionData.topPx + 'px',
          left: cssPositionData.leftPx + 'px',
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

Romo.addPopoverStackSelector('[data-romo-ui-dropdown-popover]')
Romo.addAutoInitSelector('[data-romo-ui-dropdown]', Romo.UI.Dropdown)
