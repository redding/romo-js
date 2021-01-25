Romo.define('Romo.UI.Dropdown.CSSPositionData', function() {
  return class {
    constructor(romoDropdown, relativeToDOM, placementData) {
      this._romoDropdown = romoDropdown
      this._romoPopoverDOM = romoDropdown.popoverDOM
      this.relativeToDOM = relativeToDOM
      this._placementData = placementData
    }

    get topPx() {
      return Romo.memoize(this, 'topPx', function() {
        const popoverHeightPx = this._romoPopoverDOM.firstElement.offsetHeight
        const relativeToHeightPx = Romo.height(this.relativeToDOM)
        const relativeToTopPx = this._relativeToOffset.top
        var positionPx

        switch (this._placementData.position) {
          case 'top':
            positionPx = relativeToTopPx - popoverHeightPx - this._spacingPx
            break
          case 'bottom':
            positionPx = relativeToTopPx + relativeToHeightPx + this._spacingPx
            break
        }
        return Math.round(positionPx * 100) / 100
      })
    }

    get leftPx() {
      return Romo.memoize(this, 'leftPx', function() {
        const popoverWidthPx = this._romoPopoverDOM.firstElement.offsetWidth
        const relativeToLeftPx = this._relativeToOffset.left
        const relativeToWidthPx = Romo.width(this.relativeToDOM)
        var positionPx

        switch (this._placementData.align) {
          case 'left':
            positionPx = relativeToLeftPx
            break
          case 'right':
            positionPx = relativeToLeftPx + relativeToWidthPx - popoverWidthPx
            break
        }
        return Math.round(positionPx * 100) / 100
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
  }
})
