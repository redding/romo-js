import '../../components/dom_component.js'
import './modal/css_position_data.js'
import './modal/drag.js'
import './modal/placement_data.js'
import './popover.js'

Romo.define('Romo.UI.Modal', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

      this.romoPopover =
        new Romo.UI.Popover(
          this,
          {
            attrPrefix:  'romo-ui-modal',
            eventPrefix: 'Romo.UI.Modal',
          }
        )

      if (this.dom.data('romo-ui-modal-disable-click-open') !== true) {
        this.dom.on('click', Romo.bind(function(e) {
          e.preventDefault()

          this.dom.trigger('Romo.UI.Modal:triggerOpenPopover')
        }, this))
      }

      this.dom.on('Romo.UI.Modal:popoverOpened', Romo.bind(function(e) {
        this.dom.addClass('active')
      }, this))
      this.dom.on('Romo.UI.Modal:popoverClosed', Romo.bind(function(e) {
        this.dom.removeClass('active')
      }, this))

      this.dom.on(
        'Romo.UI.Modal:popoverBodyUpdated',
        Romo.bind(function(e, romoModal, bodyDOM) {
          this.dragsDOM = bodyDOM.find('[data-romo-ui-modal-drag]')
          this.dragsDOM.on('mousedown', Romo.bind(function(e) {
            e.preventDefault()
            e.stopPropagation()

            new Romo.UI.Modal.Drag(this, e, this.dragsDOM)
          }, this))
          this.dragsDOM.addClass('romo-cursor-grab')
        }, this)
      )
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
      return this.romoPopover.isOpen()
    }

    get isPopoverClosed() {
      return this.romoPopover.isClosed()
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
          `romo-ui-modal-popover-max-${type}-detect-pad-px-${direction}`
        )
      const generalPx =
        this.dom.data(`romo-ui-modal-popover-max-${type}-detect-pad-px`)

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

        if (this.dom.data('romo-ui-modal-popover-max-height') === 'auto') {
          this.romoPopover.doSetContentMaxHeightPx(placementData.maxHeightPx)
        }
        if (this.dom.data('romo-ui-modal-popover-max-width') === 'auto') {
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

Romo.addPopoverStackSelector('[data-romo-ui-modal-popover]')
Romo.addAutoInitSelector('[data-romo-ui-modal]', Romo.UI.Modal)
