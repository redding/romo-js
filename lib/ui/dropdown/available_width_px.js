Romo.define('Romo.UI.Dropdown.AvailableWidthPx', function() {
  return class {
    constructor(romoDropdown, relativeToDOM) {
      this._romoDropdown = romoDropdown
      this.relativeToDOM = relativeToDOM
    }

    get left() {
      return Romo.memoize(this, 'left', function() {
        return Math.min(
          this._viewportWidthPx -
          this._relativeToRightPx +
          this._relativeToWidthPx -
          this._padRightPx,
          this._maxAvailableWidthPx
        )
      })
    }

    get right() {
      return Romo.memoize(this, 'right', function() {
        return Math.min(
          this._relativeToLeftPx + this._relativeToWidthPx - this._padLeftPx,
          this._maxAvailableWidthPx
        )
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

    get _maxAvailableWidthPx() {
      return Romo.memoize(this, '_maxAvailableWidthPx', function() {
        return this._viewportWidthPx - this._padLeftPx - this._padRightPx
      })
    }

    get _viewportWidthPx() {
      return document.documentElement.clientWidth
    }

    _getPadPx(direction) {
      return this._romoDropdown.getPadPx('width', direction)
    }
  }
})
