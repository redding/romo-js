if (window.Romo === undefined) {
  window.Romo = {}
}

class RomoEnv {
  constructor() {
    this.currentFid = 1
    this.currentEid = 1

    this.eventListenerFns = {}

    /* eslint-disable-next-line no-useless-escape */
    this.elementTagNameRegex = /<([a-z0-9-]+)[\s\/>]+/i
    this.elementWrapMap =
      /* eslint-disable no-multi-spaces */
      {
        caption:  [1, '<table>',            '</table>'],
        colgroup: [1, '<table>',            '</table>'],
        col:      [2, '<table><colgroup>',  '</colgroup></table>'],
        thead:    [1, '<table>',            '</table>'],
        tbody:    [1, '<table>',            '</table>'],
        tfoot:    [1, '<table>',            '</table>'],
        tr:       [2, '<table><tbody>',     '</tbody></table>'],
        th:       [3, '<table><tbody><tr>', '</tr></tbody></table>'],
        td:       [3, '<table><tbody><tr>', '</tr></tbody></table>'],
      }
      /* eslint-enable no-multi-spaces */

    this.overflowScrollableRegex = /(auto|scroll)/
    this.hasJQuery = (typeof window.jQuery === 'function')
  }

  setup() {
    if (this._hasBeenSetup !== true) {
      // TODO: add setup logic here.

      this._hasBeenSetup = true
    }
  }

  isAScrollableElement(element) {
    return (
      (element.tagName.toLowerCase() === 'html') ||
      this.overflowScrollableRegex.test(Romo.css(element, 'overflow')) ||
      this.overflowScrollableRegex.test(Romo.css(element, 'overflow-y')) ||
      this.overflowScrollableRegex.test(Romo.css(element, 'overflow-x'))
    )
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
