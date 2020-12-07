if (window.Romo === undefined) {
  window.Romo = {}
}

class RomoEnv {
  constructor() {
    this.currentFid = 1
    this.currentEid = 1

    this.eventListenerFns = {}
    this.hasJQuery = (typeof window.jQuery === 'function')
  }

  setup() {
    if (this._hasBeenSetup !== true) {
      // TODO: add setup logic here.

      this._hasBeenSetup = true
    }
  }

  addEventListener(element, eventName, listenerFn) {
    const key = this._eventListenerKey(element, eventName, listenerFn)

    if (this.eventListenerFns[key] === undefined) {
      this.eventListenerFns[key] = []
    }

    element.addEventListener(eventName, listenerFn)
    this.eventListenerFns[key].push(listenerFn)
  }

  removeEventListener(element, eventName, listenerFn) {
    const key = this._eventListenerKey(element, eventName, listenerFn)

    if (this.eventListenerFns[key] === undefined) {
      this.eventListenerFns[key] = []
    }

    this.eventListenerFns[key].forEach(function(listenerFn) {
      element.removeEventListener(eventName, listenerFn)
    })
    this.eventListenerFns[key] = []
  }

  // Private

  _eventListenerKey(element, eventName, fn) {
    Romo.eid(element)
    Romo.fid(fn)

    return (
      `--eid--${Romo.getEid(element)}--${eventName}--fid--${Romo.getFid(fn)}--`
    )
  }
}

Romo.env =
  function() {
    if (this._env === undefined) {
      this._env = new RomoEnv()
    }

    return this._env
  }

Romo.setup =
  function() {
    Romo.onReady(Romo.bind(function(e) {
      this.env.setup()
    }, this))
  }
