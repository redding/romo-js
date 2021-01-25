Romo.define('Romo.UI.Modal.PlacementData', function() {
  return class {
    constructor(romoModal) {
      this._romoModal = romoModal
      this._romoPopoverDOM = romoModal.popoverDOM
    }

    get maxHeightPx() {
      return Romo.memoize(this, 'maxHeightPx', function() {
        return (
          this._viewportHeightPx -
          Romo.UI.Modal.minPlaceTopPx -
          this._getPadPx('height', 'bottom')
        )
      })
    }

    get maxWidthPx() {
      return Romo.memoize(this, 'maxWidthPx', function() {
        return (
          this._viewportWidthPx -
          Romo.UI.Modal.minPlaceLeftPx -
          this._getPadPx('width', 'right')
        )
      })
    }

    // private

    get _viewportHeightPx() {
      return document.documentElement.clientHeight
    }

    get _viewportWidthPx() {
      return document.documentElement.clientWidth
    }

    _getPadPx(type, direction) {
      return this._romoModal.getPadPx(type, direction)
    }
  }
})
