Romo.define('Romo.UI.Modal.Drag', function() {
  return class {
    constructor(romoModal, e) {
      this._romoModal = romoModal
      this._romoModalDOM = romoModal.dom
      this._romoPopoverDOM = romoModal.popoverDOM
      this._dragsDOM = romoModal.dragsDOM
      this._dragDiffX = e.clientX - this._romoPopoverDOM.firstElement.offsetLeft
      this._dragDiffY = e.clientY - this._romoPopoverDOM.firstElement.offsetTop

      this._dragStart()
    }

    // private

    _dragStart() {
      this
        ._dragsDOM
        .addClass('romo-cursor-grabbing')
        .removeClass('romo-cursor-grab')

      Romo.ui.popoverStack.doCloseTo(this._romoPopoverDOM)

      this._romoPopoverDOM.batchSetStyle({
        width:  Romo.width(this._romoPopoverDOM) + 'px',
        height: Romo.height(this._romoPopoverDOM) + 'px',
      })

      Romo
        .dom(window)
        .on('mousemove', Romo.bind(this._onMouseMove, this))
        .on('mouseup', Romo.bind(this._onMouseUp, this))

      this._romoModalDOM.trigger('Romo.UI.Modal:dragStart', [this._romoModal])
    }

    _dragMove(clientX, clientY) {
      const placeX = clientX - this._dragDiffX
      const placeY = clientY - this._dragDiffY

      this._romoPopoverDOM.batchSetStyle({
        left: placeX + 'px',
        top:  placeY + 'px',
      })

      this._romoModalDOM.trigger(
        'Romo.UI.Modal:dragMove',
        [this._romoModal, placeX, placeY],
      )
    }

    _dragStop() {
      this
        ._dragsDOM
        .addClass('romo-cursor-grab')
        .removeClass('romo-cursor-grabbing')

      this._romoPopoverDOM.batchSetStyle({
        width:  '',
        height: '',
      })

      Romo
        .dom(window)
        .off('mousemove', Romo.bind(this._onMouseMove, this))
        .off('mouseup', Romo.bind(this._onMouseUp, this))

      this._romoModalDOM.trigger('Romo.UI.Modal:dragStop', [this._romoModal])
    }

    _onMouseMove(e) {
      e.preventDefault()
      e.stopPropagation()

      Romo.f('body').trigger('Romo.UI.Modal:mousemove')
      this._dragMove(e.clientX, e.clientY)
    }

    _onMouseUp(e) {
      e.preventDefault()
      e.stopPropagation()

      this._dragStop()
    }
  }
})
