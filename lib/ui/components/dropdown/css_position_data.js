Romo.define('Romo.UI.Dropdown.CSSPositionData', function() {
  return class {
    constructor(romoDropdown, relativeToDOM, placementData) {
      this._romoDropdown = romoDropdown
      this._romoPopoverDOM = romoDropdown.popoverDOM
      this.relativeToDOM = relativeToDOM
      this._placementData = placementData
    }

    get topPx() {
      return Romo.memoize('topPx', function() {
        const popoverHeightPx = this._romoPopoverDOM.firstElement.offsetHeight
        const relativeToHeightPx = Romo.height(this.relativeToDOM)
        const relativeToTopPx = this._relativeToOffset.top

        switch (this._placementData.position) {
          case 'top':
            this._topPx = relativeToTopPx - popoverHeightPx - this._spacingPx
            break
          case 'bottom':
            this._topPx = relativeToTopPx + relativeToHeightPx + this._spacingPx
            break
        }
        return Math.round(this._topPx * 100) / 100
      })
    }

    get leftPx() {
      return Romo.memoize('leftPx', function() {
        const popoverWidthPx = this._romoPopoverDOM.firstElement.offsetWidth
        const relativeToLeftPx = this._relativeToOffset.left
        const relativeToWidthPx = Romo.width(this.relativeToDOM)

        switch (this._placementData.align) {
          case 'left':
            this._leftPx = relativeToLeftPx
            break
          case 'right':
            this._leftPx = relativeToLeftPx + relativeToWidthPx - popoverWidthPx
            break
        }
        return Math.round(this._leftPx * 100) / 100
      })
    }

    // private

    get _relativeToOffset() {
      return Romo.memoize('_relativeToOffset', function() {
        return Romo.offset(this.relativeToDOM)
      })
    }

    get _spacingPx() {
      return Romo.UI.Dropdown.spacingPx
    }
  }
})
