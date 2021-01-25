Romo.define('Romo.UI.Tooltip.AvailableHeightPx', function() {
  return class {
    constructor(romoTooltip, relativeToDOM) {
      this._romoTooltip = romoTooltip
      this.relativeToDOM = relativeToDOM
    }

    get top() {
      return Romo.memoize(this, 'top', function() {
        return Math.min(
          this._relativeToTopPx -
          this._padTopPx -
          this._arrowSpacingPx,
          this._maxAvailableHeightPx
        )
      })
    }

    get bottom() {
      return Romo.memoize(this, 'bottom', function() {
        return Math.min(
          this._viewportHeightPx -
          this._relativeToBottomPx -
          this._padBottomPx -
          this._arrowSpacingPx,
          this._maxAvailableHeightPx
        )
      })
    }

    get alignedTop() {
      return Romo.memoize(this, 'alignedTop', function() {
        return this.bottom + this._relativeToHeightPx
      })
    }

    get alignedMiddleOnTop() {
      return Romo.memoize(this, 'alignedMiddleOnTop', function() {
        return this.top + (this._relativeToHeightPx / 2)
      })
    }

    get alignedMiddleOnBottom() {
      return Romo.memoize(this, 'alignedMiddleOnBottom', function() {
        return this.bottom + (this._relativeToHeightPx / 2)
      })
    }

    get alignedBottom() {
      return Romo.memoize(this, 'alignedBottom', function() {
        return this.top + this._relativeToHeightPx
      })
    }

    // private

    get _relativeToTopPx() {
      return this._relativeToRect.top
    }

    get _relativeToBottomPx() {
      return this._relativeToRect.bottom
    }

    get _relativeToHeightPx() {
      return this._relativeToRect.height
    }

    get _relativeToRect() {
      return Romo.memoize(this, '_relativeToRect', function() {
        return Romo.rect(this.relativeToDOM)
      })
    }

    get _padTopPx() {
      return Romo.memoize(this, '_padTopPx', function() {
        return this._getPadPx('top')
      })
    }

    get _padBottomPx() {
      return Romo.memoize(this, '_padBottomPx', function() {
        return this._getPadPx('bottom')
      })
    }

    get _arrowSpacingPx() {
      return Romo.memoize(this, '_arrowSpacingPx', function() {
        return this._romoTooltip.getArrowSpacingPx('height')
      })
    }

    get _maxAvailableHeightPx() {
      return Romo.memoize(this, '_maxAvailableHeightPx', function() {
        return this._viewportHeightPx - this._padTopPx - this._padBottomPx
      })
    }

    get _viewportHeightPx() {
      return document.documentElement.clientHeight
    }

    _getPadPx(direction) {
      return this._romoTooltip.getPadPx('height', direction)
    }
  }
})
