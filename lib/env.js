if (window.Romo === undefined) {
  window.Romo = {}
}

class RomoEnv {
  constructor() {
    this.currentFid = 1
    this.currentEid = 1

    this.eventListeners = new Romo.EventListeners()
    this.autoInit = new Romo.AutoInit()

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

  addEventListener(element, eventName, listenerFn) {
    this.eventListeners.add(element, eventName, listenerFn)
  }

  removeEventListener(element, eventName, listenerFn) {
    this.eventListeners.remove(element, eventName, listenerFn)
  }

  addAutoInitSelector(selector, componentClass) {
    this.autoInit.addSelector(selector, componentClass)
  }

  applyAutoInitTo(elements) {
    this.autoInit.applyTo(elements)
  }

  isAScrollableElement(element) {
    return (
      (element.tagName.toLowerCase() === 'html') ||
      this.overflowScrollableRegex.test(Romo.css(element, 'overflow')) ||
      this.overflowScrollableRegex.test(Romo.css(element, 'overflow-y')) ||
      this.overflowScrollableRegex.test(Romo.css(element, 'overflow-x'))
    )
  }

  /* eslint-disable no-multi-spaces */
  decodeDataValue(value) {
    try {
      if (value === 'true')      { return true              } // "true"       => true
      if (value === 'false')     { return false             } // "false"      => false
      if (value === 'undefined') { return undefined         } // "undefined"  => undefined
      if (value === 'null')      { return null              } // "null"       => null
      if (value === null)        { return undefined         } // null         => undefined
      if (+value + '' === value) { return +value            } // "42.5"       => 42.5
      if (/^[\[\{]/.test(value)) { return JSON.parse(value) } // JSON         => parse if valid
      return value                                            // String       => self
    } catch {
      return value
    }
  }
  /* eslint-enable no-multi-spaces */
}

Romo.env =
  function() {
    if (this._env === undefined) {
      this._env = new RomoEnv()
    }

    return this._env
  }

Romo.addAutoInitSelector =
  function(selector, componentClass) {
    Romo.env.addAutoInitSelector(selector, componentClass)
  }

Romo.setup =
  function() {
    Romo.onReady(Romo.bind(function(e) {
      this.env.setup()
    }, this))
  }
