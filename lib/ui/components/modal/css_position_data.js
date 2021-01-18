Romo.define('Romo.UI.Modal.CSSPositionData', function() {
  return class {
    constructor(romoModal) {
      this._romoModal = romoModal
      this._romoPopoverDOM = romoModal.popoverDOM
    }

    get topPx() {
      return Romo.memoize('maxHeightPx', function() {
        return Math.round(Romo.UI.Modal.minPlaceTopPx * 100) / 100
      })
    }

    get leftPx() {
      return Romo.memoize('maxHeightPx', function() {
        var positionPx = this._centerLeftPx
        if (positionPx < Romo.UI.Modal.minPlaceLeftPx) {
          positionPx = Romo.UI.Modal.minPlaceLeftPx
        }
        return Math.round(positionPx * 100) / 100
      })
    }

    // private

    get _centerTopPx() {
      return (this._viewportHeightPx / 2) - (this._popoverHeightPx / 2)
    }

    get _centerLeftPx() {
      return (this._viewportWidthPx / 2) - (this._popoverWidthPx / 2)
    }

    get _popoverHeightPx() {
      return this._romoPopoverDOM.firstElement.offsetHeight
    }

    get _popoverWidthPx() {
      return this._romoPopoverDOM.firstElement.offsetWidth
    }

    get _viewportHeightPx() {
      return document.documentElement.clientHeight
    }

    get _viewportWidthPx() {
      return document.documentElement.clientWidth
    }
  }
})
