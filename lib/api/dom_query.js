Romo.elements =
  function(htmlString) {
    var context = document.implementation.createHTMLDocument('')

    // Set the base href for the created document so any parsed
    // elements with URLs are based on the document's URL
    var base = context.createElement('base')
    base.href = document.location.href
    context.head.appendChild(base)

    var results = Romo.env.elementTagNameRegex.exec(htmlString)
    if (!results) {
      return []
    }

    var tagName = results[1].toLowerCase()
    var wrap = Romo.env.elementWrapMap[tagName]
    if (!wrap) {
      context.body.innerHTML = htmlString
      return Romo.array(context.body.children)
    } else {
      context.body.innerHTML = wrap[1] + htmlString + wrap[2]
      var parentElement = context.body
      var i = wrap[0]
      while (i-- !== 0) {
        parentElement = parentElement.lastChild
      }
      return Romo.array(parentElement.children)
    }
  }

Romo.dom =
  function(elements) {
    if (typeof elements === 'object' && elements.isRomoDOM === true) {
      return elements
    } else {
      return new Romo.DOM(elements)
    }
  }

Romo.f =
  function(selector) {
    return Romo.dom(document.querySelectorAll(selector))
  }

Romo.find =
  function(parentElements, selector) {
    return Romo.dom(
      Romo.dom(parentElements).reduce(function(foundElements, parentElement) {
        return foundElements.concat(
          Romo.array(parentElement.querySelectorAll(selector))
        )
      }, [])
    )
  }

Romo.is =
  function(element, selector) {
    return Romo.dom(element).firstElement.matches(selector)
  }

Romo.children =
  function(parentElement, selector) {
    const childElements =
      Romo.array(Romo.dom(parentElement).firstElement.children)
    if (selector) {
      return childElements.filter(function(childElement) {
        return Romo.is(childElement, selector)
      })
    } else {
      return childElements
    }
  }

Romo.parent =
  function(childElement) {
    return Romo.dom(childElement).firstElement.parentElement
  }

Romo.parents =
  function(childElement, selector) {
    var parentElement = Romo.parent(Romo.dom(childElement).firstElement)
    if (parentElement && parentElement !== document) {
      if (!selector || Romo.is(parentElement, selector)) {
        if (Romo.is(parentElement, 'body')) {
          return [parentElement]
        } else {
          return [parentElement].concat(Romo.parents(parentElement, selector))
        }
      } else {
        if (Romo.is(parentElement, 'body')) {
          return []
        } else {
          return Romo.parents(parentElement, selector)
        }
      }
    } else {
      return []
    }
  }

// Get the closest ancestor element that is scrollable. This mimics jQuery
// UI's `.scrollParent`. See https://api.jqueryui.com/scrollParent/.
Romo.scrollableParent =
  function(childElement) {
    const childDOM = Romo.dom(childElement)
    if (
      !childDOM.firstElement ||
      Romo.env.isAScrollableElement(childDOM.firstElement)
    ) {
      return childDOM.firstElement
    } else {
      return Romo.scrollableParent(Romo.parent(childDOM.firstElement))
    }
  }

// Get all ancestor elements that are scrollable.
Romo.scrollableParents =
  function(childElement, selector) {
    return (
      Romo
        .parents(childElement, selector)
        .filter(function(parentElement) {
          return Romo.env.isAScrollableElement(parentElement)
        })
    )
  }

Romo.closest =
  function(fromElement, selector) {
    return Romo.dom(fromElement).closest(selector)
  }

Romo.siblings =
  function(element, selector) {
    const dom = Romo.dom(element)
    return (
      Romo
        .children(Romo.parent(dom.firstElement), selector)
        .filter(function(childElement) {
          return childElement !== dom.firstElement
        })
    )
  }

Romo.prev =
  function(fromElement, selector) {
    const prevElement =
      Romo.dom(fromElement).firstElement.previousElementSibling

    if (!prevElement || !selector || Romo.is(prevElement, selector)) {
      return prevElement
    } else {
      return Romo.prev(prevElement, selector)
    }
  }

Romo.next =
  function(fromElement, selector) {
    const nextElement = Romo.dom(fromElement).firstElement.nextElementSibling

    if (!nextElement || !selector || Romo.is(nextElement, selector)) {
      return nextElement
    } else {
      return Romo.next(nextElement, selector)
    }
  }
