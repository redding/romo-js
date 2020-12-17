// Romo.Queue is a basic Queue implementation that optionally supports the
// Null Object Pattern.
//
// This is just a thin wrapper around Array to implement the classic Queue API.
Romo.define('Romo.Queue', function() {
  return class {
    constructor(nullItem) {
      this.nullItem = nullItem
      this._array = []
    }

    get size() {
      return this._array.length
    }

    get isEmpty() {
      return this._array.length === 0
    }

    enqueue(item) {
      this._array.push(item)

      return this
    }

    dequeue() {
      if (this.isEmpty) return this.nullItem

      return this._array.shift()
    }

    peek() {
      if (this.isEmpty) return undefined

      return this._array[0]
    }

    clear() {
      this._array = []

      return this
    }
  }
})
