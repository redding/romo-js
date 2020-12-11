Romo.define('Romo.EventListeners', function() {
  return class {
    constructor() {
      this.fns = {}
    }

    static key(element, eventName, fn) {
      Romo.eid(element)
      Romo.fid(fn)

      return (
        `--eid--${Romo.getEid(element)}--${eventName}--fid--${Romo.getFid(fn)}--`
      )
    }

    add(element, eventName, fn) {
      const key = this.class.key(element, eventName, fn)

      if (!this.fns[key]) {
        this.fns[key] = []
      }

      element.addEventListener(eventName, fn)
      this.fns[key].push(fn)
    }

    remove(element, eventName, fn) {
      const key = this.class.key(element, eventName, fn)

      if (!this.fns[key]) {
        this.fns[key] = []
      }

      this.fns[key].forEach(function(fn) {
        element.removeEventListener(eventName, fn)
      })
      this.fns[key] = []
    }
  }
})
