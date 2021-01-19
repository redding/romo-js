Romo.define('Romo.UI.Dropdown.AvailableHeightPx', function() {
  return class {
    constructor(romoDropdown, relativeToDOM) {
      this._romoDropdown = romoDropdown
      this.relativeToDOM = relativeToDOM
    }

    get top() {
      return Romo.memoize(this, 'top', function() {
        return Math.min(
          this._relativeToTopPx - this._padTopPx,
          this._maxAvailableHeightPx
        )
      })
    }

    get bottom() {
      return Romo.memoize(this, 'bottom', function() {
        return Math.min(
          this._viewportHeightPx - this._relativeToBottomPx - this._padBottomPx,
          this._maxAvailableHeightPx
        )
      })
    }

    // private

    get _relativeToTopPx() {
      return this._relativeToRect.top
    }

    get _relativeToBottomPx() {
      return this._relativeToRect.bottom
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

    get _maxAvailableHeightPx() {
      return Romo.memoize(this, '_maxAvailableHeightPx', function() {
        return this._viewportHeightPx - this._padTopPx - this._padBottomPx
      })
    }

    get _viewportHeightPx() {
      return document.documentElement.clientHeight
    }

    _getPadPx(direction) {
      return Romo.UI.Dropdown.getPadPx(this._romoDropdown, 'height', direction)
    }
  }
})
