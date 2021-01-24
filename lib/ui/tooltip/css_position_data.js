Romo.define('Romo.UI.Tooltip.CSSPositionData', function() {
  return class {
    constructor(romoTooltip, relativeToDOM, placementData) {
      this._romoTooltip = romoTooltip
      this._romoBubbleDOM = romoTooltip.bubbleDOM
      this.relativeToDOM = relativeToDOM
      this._placementData = placementData
    }

    get topPx() {
      return Romo.memoize(this, 'topPx', function() {
        const bubbleHeightPx = this._romoBubbleDOM.firstElement.offsetHeight
        const relativeToHeightPx = Romo.height(this.relativeToDOM)
        const relativeToTopPx = this._relativeToOffset.top
        var positionPx

        switch (this._placementData.position) {
          case 'top':
            positionPx =
              relativeToTopPx -
              bubbleHeightPx -
              this._getArrowSpacingPx('height')
            break
          case 'bottom':
            positionPx =
              relativeToTopPx +
              relativeToHeightPx +
              this._getArrowSpacingPx('height')
            break
          default:
            switch (this._placementData.align) {
              case 'top':
                positionPx = relativeToTopPx
                break
              case 'middle':
                positionPx =
                  relativeToTopPx +
                  (relativeToHeightPx / 2) -
                  (bubbleHeightPx / 2)
                break
              case 'bottom':
                positionPx =
                  relativeToTopPx + relativeToHeightPx - bubbleHeightPx
                break
            }
            break
        }
        return Math.round(positionPx * 100) / 100
      })
    }

    get leftPx() {
      return Romo.memoize(this, 'leftPx', function() {
        const bubbleWidthPx = this._romoBubbleDOM.firstElement.offsetWidth
        const relativeToLeftPx = this._relativeToOffset.left
        const relativeToWidthPx = Romo.width(this.relativeToDOM)
        var positionPx

        switch (this._placementData.position) {
          case 'left':
            positionPx =
              relativeToLeftPx -
              bubbleWidthPx -
              this._getArrowSpacingPx('width')
            break
          case 'right':
            positionPx =
              relativeToLeftPx +
              relativeToWidthPx +
              this._getArrowSpacingPx('width')
            break
          default:
            switch (this._placementData.align) {
              case 'left':
                positionPx = relativeToLeftPx
                break
              case 'center':
                positionPx =
                  relativeToLeftPx +
                  (relativeToWidthPx / 2) -
                  (bubbleWidthPx / 2)
                break
              case 'right':
                positionPx =
                  relativeToLeftPx + relativeToWidthPx - bubbleWidthPx
                break
            }
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

    _getArrowSpacingPx(type) {
      return this._romoTooltip.getArrowSpacingPx(type)
    }
  }
})
