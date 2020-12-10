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

Romo.f =
  function(selector) {
    return Romo.array(document.querySelectorAll(selector))
  }

Romo.find =
  function(parentElements, selector) {
    return (
      Romo.array(parentElements).reduce(function(foundElements, parentElement) {
        return foundElements.concat(
          Romo.array(parentElement.querySelectorAll(selector))
        )
      }, [])
    )
  }

Romo.is =
  function(element, selector) {
    return (
      element.matches ||
      element.matchesSelector ||
      element.msMatchesSelector ||
      element.mozMatchesSelector ||
      element.webkitMatchesSelector ||
      element.oMatchesSelector
    ).call(element, selector)
  }

Romo.children =
  function(parentElement, selector) {
    var childElements = Romo.array(parentElement.children)
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
    return childElement.parentElement
  }

Romo.parents =
  function(childElement, selector) {
    var parentElement = Romo.parent(childElement)
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
    if (Romo.env.isAScrollableElement(childElement)) {
      return childElement
    } else {
      return Romo.scrollableParent(Romo.parent(childElement))
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
    if (fromElement.closest) {
      return fromElement.closest(selector)
    } else if (Romo.is(fromElement, selector)) {
      return fromElement
    } else if (fromElement.parentElement) {
      return Romo.closest(fromElement.parentElement, selector)
    } else {
      return null
    }
  }

Romo.siblings =
  function(element, selector) {
    return (
      Romo
        .children(Romo.parent(element), selector)
        .filter(function(childElement) { return childElement !== element })
    )
  }

Romo.prev =
  function(fromElement, selector) {
    const prevElement = fromElement.previousElementSibling

    if (!selector || Romo.is(prevElement, selector)) {
      return prevElement
    } else {
      return Romo.prev(prevElement, selector)
    }
  }

Romo.next =
  function(fromElement, selector) {
    const nextElement = fromElement.nextElementSibling

    if (!selector || Romo.is(nextElement, selector)) {
      return nextElement
    } else {
      return Romo.next(nextElement, selector)
    }
  }
