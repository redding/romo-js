Romo.define('Romo.UI.Tooltip.AvailableWidthPx', function() {
  return class {
    constructor(romoTooltip, relativeToDOM) {
      this._romoTooltip = romoTooltip
      this.relativeToDOM = relativeToDOM
    }

    get left() {
      return Romo.memoize(this, 'left', function() {
        return Math.min(
          this._relativeToLeftPx -
          this._padLeftPx -
          this._arrowSpacingPx,
          this._maxAvailableWidthPx
        )
      })
    }

    get right() {
      return Romo.memoize(this, 'right', function() {
        return Math.min(
          this._viewportWidthPx -
          this._relativeToRightPx -
          this._padRightPx -
          this._arrowSpacingPx,
          this._maxAvailableWidthPx
        )
      })
    }

    get alignedLeft() {
      return Romo.memoize(this, 'alignedLeft', function() {
        return this.right + this._relativeToWidthPx
      })
    }

    get alignedCenterOnLeft() {
      return Romo.memoize(this, 'alignedCenterOnLeft', function() {
        return this.left + (this._relativeToWidthPx / 2)
      })
    }

    get alignedCenterOnRight() {
      return Romo.memoize(this, 'alignedCenterOnRight', function() {
        return this.right + (this._relativeToWidthPx / 2)
      })
    }

    get alignedRight() {
      return Romo.memoize(this, 'alignedRight', function() {
        return this.left + this._relativeToWidthPx
      })
    }

    // private

    get _relativeToLeftPx() {
      return this._relativeToRect.left
    }

    get _relativeToRightPx() {
      return this._relativeToRect.right
    }

    get _relativeToWidthPx() {
      return this._relativeToRect.width
    }

    get _relativeToRect() {
      return Romo.memoize(this, '_relativeToRect', function() {
        return Romo.rect(this.relativeToDOM)
      })
    }

    get _padLeftPx() {
      return Romo.memoize(this, '_padLeftPx', function() {
        return this._getPadPx('left')
      })
    }

    get _padRightPx() {
      return Romo.memoize(this, '_padRightPx', function() {
        return this._getPadPx('right')
      })
    }

    get _arrowSpacingPx() {
      return Romo.memoize(this, '_arrowSpacingPx', function() {
        return this._romoTooltip.getArrowSpacingPx('width')
      })
    }

    get _maxAvailableWidthPx() {
      return Romo.memoize(this, '_maxAvailableWidthPx', function() {
        return this._viewportWidthPx - this._padLeftPx - this._padRightPx
      })
    }

    get _viewportWidthPx() {
      return document.documentElement.clientWidth
    }

    _getPadPx(direction) {
      return this._romoTooltip.getPadPx('width', direction)
    }
  }
})
