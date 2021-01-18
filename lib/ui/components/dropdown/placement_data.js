import './available_height_px.js'
import './available_width_px.js'

Romo.define('Romo.UI.Dropdown.PlacementData', function() {
  return class {
    constructor(romoDropdown, relativeToDOM) {
      this._romoDropdown = romoDropdown
      this._romoPopoverDOM = romoDropdown.popoverDOM
      this.relativeToDOM = relativeToDOM
    }

    get maxHeightPx() {
      return this._availableHeightPx[this.position]
    }

    get maxWidthPx() {
      return this._availableWidthPx[this.align]
    }

    get position() {
      return Romo.memoize(this, 'position', function() {
        const popoverHeightPx = this._romoPopoverDOM.firstElement.offsetHeight
        if (
          popoverHeightPx < this._availableHeightPx.top &&
          popoverHeightPx < this._availableHeightPx.bottom
        ) {
          // If the popover fits for either position, use the default one.
          return this._romoDropdown.defaultPlacementPosition
        } else if (this._availableHeightPx.top > this._availableHeightPx.bottom) {
          return 'top'
        } else {
          return 'bottom'
        }
      })
    }

    get align() {
      return Romo.memoize(this, 'align', function() {
        const popoverWidthPx = this._romoPopoverDOM.firstElement.offsetWidth
        if (
          popoverWidthPx < this._availableWidthPx.left &&
          popoverWidthPx < this._availableWidthPx.right
        ) {
          // If the popover fits for either position, use the default one.
          return this._romoDropdown.defaultPlacementAlign
        } else if (this._availableWidthPx.left > this._availableWidthPx.right) {
          return 'left'
        } else {
          return 'right'
        }
      })
    }

    // private

    get _availableHeightPx() {
      return Romo.memoize(this, '_availableHeightPx', function() {
        return new Romo.UI.Dropdown.AvailableHeightPx(
          this._romoDropdown,
          this.relativeToDOM,
        )
      })
    }

    get _availableWidthPx() {
      return Romo.memoize(this, '_availableWidthPx', function() {
        return new Romo.UI.Dropdown.AvailableWidthPx(
          this._romoDropdown,
          this.relativeToDOM,
        )
      })
    }
  }
})
