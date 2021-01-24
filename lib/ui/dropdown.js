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
        this.dom.data(
          `romo-ui-dropdown-popover-max-${type}-detect-pad-px-${direction}`
        )
      const generalPx =
        this.dom.data(`romo-ui-dropdown-popover-max-${type}-detect-pad-px`)

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

        if (this.dom.data('romo-ui-dropdown-popover-max-height') === 'auto') {
          this.romoPopover.doSetContentMaxHeightPx(placementData.maxHeightPx)
        }
        if (this.dom.data('romo-ui-dropdown-popover-max-width') === 'auto') {
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
          this.dom.data('romo-ui-dropdown-popover-default-placement')
        )
      })
    }
  }
})

Romo.addPopoverStackSelector('[data-romo-ui-dropdown-popover]')
Romo.addAutoInitSelector('[data-romo-ui-dropdown]', Romo.UI.Dropdown)
