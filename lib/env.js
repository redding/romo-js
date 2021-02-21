if (window.Romo === undefined) {
  window.Romo = {}
}

class RomoEnv {
  constructor() {
    this.currentFid = 1
    this.currentEid = 1

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

    this.popoverStackSelectors = []
  }

  get eventListeners() {
    return Romo.memoize(this, 'eventListeners', function() {
      return new Romo.EventListeners()
    })
  }

  get childElementSet() {
    return Romo.memoize(this, 'childElementSet', function() {
      return new Romo.ChildElementSet()
    })
  }

  get autoInit() {
    return Romo.memoize(this, 'autoInit', function() {
      return new Romo.AutoInit()
    })
  }

  get popoverStack() {
    return Romo.memoize(this, 'popoverStack', function() {
      return new Romo.PopoverStack(this.popoverStackSelectors)
    })
  }

  /* eslint-disable no-multi-spaces */
  get nonInputTextKeyCodes() {
    // https://css-tricks.com/snippets/javascript/javascript-keycodes/
    return [
      9,   /* tab */
      13,  /* enter */
      16,  /* shift */
      17,  /* ctrl */
      18,  /* alt */
      19,  /* pausebreak */
      20,  /* capslock */
      27,  /* escape */
      33,  /* pageup */
      34,  /* pagedown */
      35,  /* end */
      36,  /* home */
      37,  /* leftarrow */
      38,  /* uparrow */
      39,  /* rightarrow */
      40,  /* downarrow */
      45,  /* insert */
      46,  /* delete */
      91,  /* leftwindowkey */
      92,  /* rightwindowkey */
      93,  /* selectkey */
      112, /* f1 */
      113, /* f2 */
      114, /* f3 */
      115, /* f4 */
      116, /* f5 */
      117, /* f6 */
      118, /* f7 */
      119, /* f8 */
      120, /* f9 */
      121, /* f10 */
      122, /* f11 */
      123, /* f12 */
      144, /* numlock */
      145, /* scrolllock */
    ]
  }
  /* eslint-enable no-multi-spaces */

  setup() {
    if (this._hasBeenSetup !== true) {
      Romo.childElementSet = this.childElementSet
      Romo.pushFn(Romo.bind(function() {
        this.applyAutoInitTo(Romo.f('body'))
      }, this))

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
    return this.autoInit.addSelector(selector, componentClass)
  }

  applyAutoInitTo(elements) {
    return this.autoInit.applyTo(elements)
  }

  addPopoverStackSelector(selector) {
    this.popoverStackSelectors.push(selector)
  }

  isAScrollableElement(element) {
    return (
      (element.tagName.toLowerCase() === 'html') ||
      this.overflowScrollableRegex.test(Romo.css(element, 'overflow')) ||
      this.overflowScrollableRegex.test(Romo.css(element, 'overflow-y')) ||
      this.overflowScrollableRegex.test(Romo.css(element, 'overflow-x'))
    )
  }

  isInputKey(keyCode) {
    return this.nonInputTextKeyCodes.indexOf(keyCode) === -1
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

Romo.setup =
  function() {
    Romo.onReady(Romo.bind(function(e) { Romo.env.setup() }, this))
  }

Romo.addAutoInitSelector =
  function(selector, componentClass) {
    Romo.env.addAutoInitSelector(selector, componentClass)
  }

Romo.addPopoverStackSelector =
  function(selector) {
    Romo.env.addPopoverStackSelector(selector)
  }

Romo.env = new RomoEnv()
