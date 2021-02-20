import '../utilities/dom_component.js'
import './modal/css_position_data.js'
import './modal/drag.js'
import './modal/placement_data.js'
import './popover.js'

Romo.define('Romo.UI.Modal', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

      this.romoPopover =
        new Romo.UI.Popover(this, {
          attrPrefix:  this.attrPrefix,
          eventPrefix: this.eventPrefix,
        })

      if (this.domData('disable-click-toggle') !== true) {
        this.on('click', function(e) {
          e.preventDefault()
          if (this.isPopoverOpen) {
            e.stopPropagation()
          }

          this.domTrigger('triggerTogglePopover')
        })
      }

      this.domOn('popoverOpened', function(e) { this.dom.addClass('active') })
      this.domOn('popoverClosed', function(e) { this.dom.removeClass('active') })

      this.domOn('popoverBodyUpdated', function(e, romoModal, bodyDOM) {
        this.dragsDOM = bodyDOM.find('[data-romo-ui-modal-drag]')
        this.dragsDOM.on('mousedown', Romo.bind(function(e) {
          e.preventDefault()
          e.stopPropagation()

          new Romo.UI.Modal.Drag(this, e, this.dragsDOM)
        }, this))
        this.dragsDOM.addClass('romo-cursor-grab')
      })
    }

    static get attrPrefix() {
      return 'romo-ui-modal'
    }

    static get minPlaceTopPx() {
      return Romo.UI.Popover.headerSpacingPx
    }

    static get minPlaceLeftPx() {
      return this.defaultPadPx
    }

    static get defaultPadPx() {
      return Romo.config.popovers.defaultPadPxFn()
    }

    static get defaultVerticalPositionViewportPercentage() {
      return (
        Romo.config.popovers.defaultModalVerticalPositionViewportPercentageFn()
      )
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
        const placementData = new Romo.UI.Modal.PlacementData(this)
        const cssPositionData = new Romo.UI.Modal.CSSPositionData(this)

        if (this.domData('popover-max-height') === 'auto') {
          this.romoPopover.doUnsetContentMaxHeightPx()
          this.romoPopover.doSetContentMaxHeightPx(placementData.maxHeightPx)
        }
        if (this.domData('popover-max-width') === 'auto') {
          this.romoPopover.doUnsetContentMaxWidthPx()
          this.romoPopover.doSetContentMaxWidthPx(placementData.maxWidthPx)
        }

        this.popoverDOM.batchSetStyle({
          top:  cssPositionData.topPx + 'px',
          left: cssPositionData.leftPx + 'px',
        })
      }

      return this
    }
  }
})

Romo.addPopoverStackSelector(`[data-${Romo.UI.Modal.attrPrefix}-popover]`)
Romo.addAutoInitSelector(`[data-${Romo.UI.Modal.attrPrefix}]`, Romo.UI.Modal)
