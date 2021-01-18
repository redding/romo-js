Romo.define('Romo.UI.Modal.PlacementData', function() {
  return class {
    constructor(romoModal) {
      this._romoModal = romoModal
      this._romoPopoverDOM = romoModal.popoverDOM
    }

    get maxHeightPx() {
      return Romo.memoize('maxHeightPx', function() {
        return Romo.UI.Modal.minPlaceTopPx - this._getPadPx('height', 'bottom')
      })
    }

    get maxWidthPx() {
      return Romo.memoize('maxHeightPx', function() {
        return Romo.UI.Modal.minPlaceLeftPx - this._getPadPx('width', 'right')
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
      return Romo.UI.Modal.getPadPx(this._romoModal, type, direction)
    }
  }
})
