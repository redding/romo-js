Romo.define('Romo.DOM', function() {
  return class {
    constructor(elements) {
      // Accespt nested Romo.DOM instances and flatten to a list of elements.
      this.elements =
        Romo
          .array(elements)
          .reduce(function(acc, element) {
            if (element) {
              return acc.concat(element.isRomoDOM ? element.elements : [element])
            } else {
              return acc
            }
          }, [])
    }

    get isRomoDOM() {
      return true
    }

    get hasElements() {
      return this.length !== 0
    }

    get length() {
      return this.elements.length
    }

    get firstElement() {
      return this.elements[0]
    }

    get lastElement() {
      return this.elements[this.elements.length - 1]
    }

    get first() {
      return Romo.dom(this.firstElement)
    }

    get last() {
      return Romo.dom(this.lastElement)
    }

    concat(elements) {
      return Romo.dom(this.elements.concat(Romo.dom(elements).elements))
    }

    reverse() {
      return Romo.dom(this.elements.reverse())
    }

    reverseElements() {
      return this.reverse.elements
    }

    filter(fn) {
      return (
        this
          .elements
          .map(function(element) { return Romo.dom(element) })
          .filter(fn)
      )
    }

    filterElements(fn) {
      return this.elements.filter(fn)
    }

    forEach(fn) {
      this
        .elements
        .map(function(element) { return Romo.dom(element) })
        .forEach(fn)
    }

    forEachElement(fn) {
      this.elements.forEach(fn)
    }

    map(fn) {
      return (
        this
          .elements
          .map(function(element) { return Romo.dom(element) })
          .map(fn)
      )
    }

    mapElements(fn) {
      return this.elements.map(fn)
    }

    reverseMap(fn) {
      return this.reverse().map(fn)
    }

    reverseMapElements(fn) {
      return this.reverse().mapElements(fn)
    }

    reduce(fn, acc) {
      return (
        this
          .elements
          .map(function(element) { return Romo.dom(element) })
          .reduce(fn, acc)
      )
    }

    reduceElements(fn, acc) {
      return this.elements.reduce(fn, acc)
    }

    // DOM attributes API method proxies

    tagName() {
      return Romo.tagName(this)
    }

    attr(attributeName) {
      return Romo.attr(this, attributeName)
    }

    hasAttr(attributeName) {
      return Romo.hasAttr(this, attributeName)
    }

    setAttr(attributeName, attributeValue) {
      return Romo.dom(Romo.setAttr(this, attributeName, attributeValue))
    }

    rmAttr(attributeName) {
      return Romo.dom(Romo.rmAttr(this, attributeName))
    }

    data(dataName) {
      return Romo.data(this, dataName)
    }

    hasData(dataName) {
      return Romo.hasData(this, dataName)
    }

    setData(dataName, dataValue) {
      return Romo.dom(Romo.setData(this, dataName, dataValue))
    }

    setDataDefault(dataName, defaultValue) {
      return Romo.dom(Romo.setDataDefault(this, dataName, defaultValue))
    }

    rmData(dataName) {
      return Romo.dom(Romo.rmData(this, dataName))
    }

    style(styleName) {
      return Romo.style(this, styleName)
    }

    setStyle(styleName, styleValue) {
      return Romo.dom(Romo.setStyle(this, styleName, styleValue))
    }

    batchSetStyle(styles) {
      return Romo.dom(Romo.batchSetStyle(this, styles))
    }

    rmStyle(styleName) {
      return Romo.dom(Romo.rmStyle(this, styleName))
    }

    batchRmStyle(...styles) {
      return Romo.dom(Romo.batchRmStyle(this, ...styles))
    }

    css(styleName) {
      return Romo.css(this, styleName)
    }

    hasClass(className) {
      return Romo.hasClass(this, className)
    }

    addClass(className) {
      return Romo.dom(Romo.addClass(this, className))
    }

    rmClass(className) {
      return Romo.dom(Romo.rmClass(this, className))
    }

    removeClass(className) {
      return this.rmClass(className)
    }

    toggleClass(className) {
      return Romo.dom(Romo.toggleClass(this, className))
    }

    show() {
      return Romo.dom(Romo.show(this))
    }

    hide() {
      return Romo.dom(Romo.hide(this))
    }

    rect() {
      return Romo.rect(this)
    }

    height() {
      return Romo.height(this)
    }

    width() {
      return Romo.width(this)
    }

    offset(relativeToElement) {
      return Romo.offset(this, relativeToElement)
    }

    scrollTop() {
      return Romo.scrollTop(this)
    }

    scrollLeft() {
      return Romo.scrollLeft(this)
    }

    setScrollTop(value) {
      return Romo.dom(Romo.setScrollTop(this, value))
    }

    setScrollLeft(value) {
      return Romo.dom(Romo.setScrollLeft(this, value))
    }

    zIndex() {
      return Romo.zIndex(this)
    }

    // DOM query API method proxies

    get innerText() {
      return Romo.innerText(this)
    }

    get innerHTML() {
      return Romo.innerHTML(this)
    }

    find(selector) {
      return Romo.find(this, selector)
    }

    is(selector) {
      return Romo.is(this, selector)
    }

    children(selector) {
      return Romo.dom(Romo.children(this, selector))
    }

    parent() {
      return Romo.dom(Romo.parent(this))
    }

    parents(selector) {
      return Romo.dom(Romo.parents(this, selector))
    }

    scrollableParent() {
      return Romo.dom(Romo.scrollableParent(this))
    }

    scrollableParents(selector) {
      return Romo.dom(Romo.scrollableParents(this, selector))
    }

    closest(selector) {
      return Romo.dom(Romo.closest(this, selector))
    }

    siblings(selector) {
      return Romo.dom(Romo.siblings(this, selector))
    }

    prev(selector) {
      return Romo.dom(Romo.prev(this, selector))
    }

    next(selector) {
      return Romo.dom(Romo.next(this, selector))
    }

    // DOM mutate API method proxies

    set innerText(value) {
      return Romo.setInnerText(this, value)
    }

    set innerHTML(value) {
      return Romo.setInnerHTML(this, value)
    }

    remove() {
      return Romo.dom(Romo.remove(this))
    }

    removeChildren() {
      return Romo.dom(Romo.removeChildren(this))
    }

    replace(replacementElement) {
      return Romo.dom(Romo.replace(this, replacementElement))
    }

    replaceHTML(htmlString) {
      return Romo.dom(Romo.replaceHTML(this, htmlString))
    }

    update(childElements) {
      return Romo.dom(Romo.update(this, childElements))
    }

    updateHTML(htmlString) {
      return Romo.dom(Romo.updateHTML(this, htmlString))
    }

    updateText(textString) {
      return Romo.dom(Romo.updateText(this, textString))
    }

    clearHTML() {
      return Romo.dom(Romo.clearHTML(this))
    }

    prepend(childElements) {
      return Romo.dom(Romo.prepend(this, childElements))
    }

    prependHTML(htmlString) {
      return Romo.dom(Romo.prependHTML(this, htmlString))
    }

    append(childElements) {
      return Romo.dom(Romo.append(this, childElements))
    }

    appendHTML(htmlString) {
      return Romo.dom(Romo.appendHTML(this, htmlString))
    }

    before(siblingElements) {
      return Romo.dom(Romo.before(this, siblingElements))
    }

    beforeHTML(htmlString) {
      return Romo.dom(Romo.beforeHTML(this, htmlString))
    }

    after(siblingElements) {
      return Romo.dom(Romo.after(this, siblingElements))
    }

    afterHTML(htmlString) {
      return Romo.dom(Romo.afterHTML(this, htmlString))
    }

    // DOM events API method proxies

    on(eventName, eventHandlerFn) {
      return Romo.dom(Romo.on(this, eventName, eventHandlerFn))
    }

    off(eventName, eventHandlerFn) {
      return Romo.dom(Romo.off(this, eventName, eventHandlerFn))
    }

    trigger(customEventName, eventArgs) {
      return Romo.dom(Romo.trigger(this, customEventName, eventArgs))
    }
  }
})
