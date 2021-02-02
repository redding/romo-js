Romo.define('Romo.UI.Dropdown.CSSPositionData', function() {
  return class {
    constructor(romoDropdown, relativeToDOM, placementData) {
      this._romoDropdown = romoDropdown
      this.relativeToDOM = relativeToDOM
      this._placementData = placementData
    }

    get top() {
      return Romo.memoize(this, 'top', function() {
        const relativeToHeightPx = Romo.height(this.relativeToDOM)
        const relativeToTopPx = this._relativeToOffset.top
        var position

        switch (this._placementData.position) {
          case 'top':
            position = ''
            break
          case 'bottom':
            position =
              this._round(
                relativeToTopPx + relativeToHeightPx + this._spacingPx
              ) + 'px'
            break
        }
        return position
      })
    }

    get bottom() {
      return Romo.memoize(this, 'bottom', function() {
        const relativeToTopPx = this._relativeToOffset.top
        var position

        switch (this._placementData.position) {
          case 'top':
            position =
              this._round(relativeToTopPx - this._spacingPx) + 'px'
            position =
              this._round(
                this._viewportHeightPx - relativeToTopPx + this._spacingPx
              ) + 'px'
            break
          case 'bottom':
            position = ''
            break
        }
        return position
      })
    }

    get left() {
      return Romo.memoize(this, 'left', function() {
        const relativeToLeftPx = this._relativeToOffset.left
        var position

        switch (this._placementData.align) {
          case 'left':
            position = this._round(relativeToLeftPx) + 'px'
            break
          case 'right':
            position = ''
            break
        }
        return position
      })
    }

    get right() {
      return Romo.memoize(this, 'right', function() {
        const relativeToLeftPx = this._relativeToOffset.left
        const relativeToWidthPx = Romo.width(this.relativeToDOM)
        var position

        switch (this._placementData.align) {
          case 'left':
            position = ''
            break
          case 'right':
            position =
              this._round(
                this._viewportWidthPx - relativeToLeftPx - relativeToWidthPx
              ) + 'px'
            break
        }
        return position
      })
    }

    // private

    get _relativeToOffset() {
      return Romo.memoize(this, '_relativeToOffset', function() {
        return Romo.offset(this.relativeToDOM)
      })
    }

    get _spacingPx() {
      return Romo.UI.Dropdown.spacingPx
    }

    get _viewportWidthPx() {
      return document.documentElement.clientWidth
    }

    get _viewportHeightPx() {
      return document.documentElement.clientHeight
    }

    _round(number) {
      return Math.round(number * 100) / 100
    }
  }
})
