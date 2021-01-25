import './available_height_px.js'
import './available_width_px.js'

Romo.define('Romo.UI.Tooltip.PlacementData', function() {
  return class {
    constructor(romoTooltip, relativeToDOM) {
      this._romoTooltip = romoTooltip
      this._romoBubbleDOM = romoTooltip.bubbleDOM
      this.relativeToDOM = relativeToDOM
    }

    get position() {
      return Romo.memoize(this, 'position', function() {
        if (
          this._romoTooltip.defaultPlacementPosition === 'top' ||
          this._romoTooltip.defaultPlacementPosition === 'bottom'
        ) {
          if (
            this._bubbleHeightPx < this._availableHeightPx.top &&
            this._bubbleHeightPx < this._availableHeightPx.bottom
          ) {
            // If the bubble fits for either position, use the default one.
            return this._romoTooltip.defaultPlacementPosition
          } else if (this._availableHeightPx.top > this._availableHeightPx.bottom) {
            return 'top'
          } else {
            return 'bottom'
          }
        } else if (
          this._romoTooltip.defaultPlacementPosition === 'left' ||
          this._romoTooltip.defaultPlacementPosition === 'right'
        ) {
          if (
            this._bubbleWidthPx < this._availableWidthPx.left &&
            this._bubbleWidthPx < this._availableWidthPx.right
          ) {
            // If the bubble fits for either position, use the default one.
            return this._romoTooltip.defaultPlacementPosition
          } else if (this._availableWidthPx.left > this._availableWidthPx.right) {
            return 'left'
          } else {
            return 'right'
          }
        }
      })
    }

    get align() {
      return Romo.memoize(this, 'align', function() {
        if (this.position === 'top' || this.position === 'bottom') {
          if (this._romoTooltip.defaultPlacementAlign === 'left') {
            if (this._fitsAlignedLeft) return 'left'
            if (this._fitsAlignedCenter) return 'center'
            if (this._fitsAlignedRight) return 'right'
            return 'left'
          }
          if (this._romoTooltip.defaultPlacementAlign === 'center') {
            if (this._fitsAlignedCenter) return 'center'
            if (this._fitsAlignedLeft) return 'left'
            if (this._fitsAlignedRight) return 'right'
            return 'center'
          }
          if (this._romoTooltip.defaultPlacementAlign === 'right') {
            if (this._fitsAlignedRight) return 'right'
            if (this._fitsAlignedCenter) return 'center'
            if (this._fitsAlignedLeft) return 'left'
            return 'right'
          }
          return 'center'
        } else if (this.position === 'left' || this.position === 'right') {
          if (this._romoTooltip.defaultPlacementAlign === 'top') {
            if (this._fitsAlignedTop) return 'top'
            if (this._fitsAlignedMiddle) return 'middle'
            if (this._fitsAlignedBottom) return 'bottom'
            return 'top'
          }
          if (this._romoTooltip.defaultPlacementAlign === 'middle') {
            if (this._fitsAlignedMiddle) return 'middle'
            if (this._fitsAlignedTop) return 'top'
            if (this._fitsAlignedBottom) return 'bottom'
            return 'middle'
          }
          if (this._romoTooltip.defaultPlacementAlign === 'bottom') {
            if (this._fitsAlignedBottom) return 'bottom'
            if (this._fitsAlignedMiddle) return 'middle'
            if (this._fitsAlignedTop) return 'top'
            return 'bottom'
          }
          return 'middle'
        }
        return undefined
      })
    }

    // private

    get _fitsAlignedLeft() {
      return this._bubbleWidthPx < this._availableWidthPx.alignedLeft
    }

    get _fitsAlignedCenter() {
      return (
        this._halfBubbleWidthPx < this._availableWidthPx.alignedCenterOnLeft &&
        this._halfBubbleWidthPx < this._availableWidthPx.alignedCenterOnRight
      )
    }

    get _fitsAlignedRight() {
      return this._bubbleWidthPx < this._availableWidthPx.alignedRight
    }

    get _fitsAlignedTop() {
      return this._bubbleHeightPx < this._availableHeightPx.alignedTop
    }

    get _fitsAlignedMiddle() {
      return (
        this._halfBubbleHeightPx < this._availableHeightPx.alignedMiddleOnTop &&
        this._halfBubbleHeightPx < this._availableHeightPx.alignedMiddleOnBottom
      )
    }

    get _fitsAlignedBottom() {
      return this._bubbleHeightPx < this._availableHeightPx.alignedBottom
    }

    get _bubbleHeightPx() {
      return this._romoBubbleDOM.firstElement.offsetHeight
    }

    get _bubbleWidthPx() {
      return this._romoBubbleDOM.firstElement.offsetWidth
    }

    get _halfBubbleHeightPx() {
      return this._bubbleHeightPx / 2
    }

    get _halfBubbleWidthPx() {
      return this._bubbleWidthPx / 2
    }

    get _availableHeightPx() {
      return Romo.memoize(this, '_availableHeightPx', function() {
        return new Romo.UI.Tooltip.AvailableHeightPx(
          this._romoTooltip,
          this.relativeToDOM,
        )
      })
    }

    get _availableWidthPx() {
      return Romo.memoize(this, '_availableWidthPx', function() {
        return new Romo.UI.Tooltip.AvailableWidthPx(
          this._romoTooltip,
          this.relativeToDOM,
        )
      })
    }
  }
})
