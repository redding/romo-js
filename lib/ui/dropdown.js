import '../components/dom_component.js'
import './dropdown/css_position_data.js'
import './dropdown/placement_config.js'
import './dropdown/placement_data.js'
import './popover.js'

Romo.define('Romo.UI.Dropdown', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

      this.romoPopover =
        new Romo.UI.Popover(
          this,
          {
            attrPrefix:  'romo-ui-dropdown',
            eventPrefix: 'Romo.UI.Dropdown',
          },
        )

      if (this.dom.data('romo-ui-dropdown-disable-click-toggle') !== true) {
        this.dom.on('click', Romo.bind(function(e) {
          e.preventDefault()

          this.dom.trigger('Romo.UI.Dropdown:triggerTogglePopover')
        }, this))
      }

      this.dom.on('Romo.UI.Dropdown:popoverOpened', Romo.bind(function(e) {
        this.dom.addClass('active')
      }, this))
      this.dom.on('Romo.UI.Dropdown:popoverClosed', Romo.bind(function(e) {
        this.dom.removeClass('active')
      }, this))
    }

    static get spacingPx() {
      return Romo.config.popovers.dropdownSpacingPxFn()
    }

    static get defaultPadPx() {
      return Romo.config.popovers.defaultPadPxFn()
    }

    static getPadPx(romoDropdown, type, direction) {
      const specficPx =
        romoDropdown.dom.data(
          `romo-ui-dropdown-popover-max-${type}-detect-pad-px-${direction}`
        )
      const generalPx =
        romoDropdown.dom.data(
          `romo-ui-dropdown-popover-max-${type}-detect-pad-px`
        )

      return specficPx || generalPx || this.defaultPadPx
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

    doOpenPopover() {
      this.romoPopover.doOpen()
    }

    doClosePopover() {
      this.romoPopover.doClose()
    }

    doTogglePopover() {
      this.romoPopover.doToggle()
    }

    doUpdatePopoverBody(content) {
      this.romoPopover.doUpdateBody(content)
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

        if (this.dom.data('romo-ui-dropdown-popover-max-height') === 'auto') {
          this.romoPopover.setContentMaxHeightPx(placementData.maxHeightPx)
        }
        if (this.dom.data('romo-ui-dropdown-popover-max-width') === 'auto') {
          this.romoPopover.setContentMaxWidthPx(placementData.maxWidthPx)
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
    }

    // private

    get _defaultPlacementConfig() {
      return Romo.memoize('_defaultPlacementConfig', function() {
        return new Romo.UI.Dropdown.PlacementConfig(
          this.dom.data('romo-ui-dropdown-popover-default-placement')
        )
      })
    }
  }
})

Romo.addPopoverStackSelector('[data-romo-ui-dropdown-popover]')
Romo.addAutoInitSelector('[data-romo-ui-dropdown]', Romo.UI.Dropdown)
