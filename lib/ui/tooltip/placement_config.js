Romo.define('Romo.UI.Tooltip.PlacementConfig', function() {
  return class {
    constructor(placementString) {
      this.placementString = placementString
    }

    static get delimiter() {
      return ','
    }

    static get defaultPosition() {
      return 'right'
    }

    static get defaultAlign() {
      return 'middle'
    }

    get position() {
      return Romo.memoize(this, 'position', function() {
        return this._decodedValues.position || this.class.defaultPosition
      })
    }

    get align() {
      return Romo.memoize(this, 'align', function() {
        return this._decodedValues.align || this.class.defaultAlign
      })
    }

    // private

    get _decodedValues() {
      return Romo.memoize(this, '_decodedValues', function() {
        const values = (this.placementString || '').split(this.class.delimiter)
        return { position: values[0], align: values[1] }
      })
    }
  }
})
