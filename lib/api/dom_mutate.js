Romo.setInnerText =
  function(element, value) {
    Romo.dom(element).firstElement.innerText = value || ''
  }

Romo.setInnerHTML =
  function(element, value) {
    Romo.dom(element).firstElement.innerHTML = value || ''
  }

Romo.remove =
  function(elements) {
    return Romo.dom(elements).mapElements(function(element) {
      if (element.parentElement) {
        element.parentElement.removeChild(element)
      }
      return element
    })
  }

Romo.removeChildren =
  function(parentElements) {
    return Romo.dom(parentElements).mapElements(function(parentElement) {
      Romo.children(parentElement).forEach(function(childElement) {
        parentElement.removeChild(childElement)
      })
      return parentElement
    })
  }

Romo.replace =
  function(element, replacementElement) {
    const dom = Romo.dom(element)
    const replacementDOM = Romo.dom(replacementElement)
    Romo
      .parent(dom)
      .replaceChild(replacementDOM.firstElement, dom.firstElement)
    return Romo.env.applyAutoInitTo(replacementDOM.firstElement)
  }

Romo.replaceHTML =
  function(element, htmlString) {
    const replacementDOM = Romo.dom(Romo.elements(htmlString))
    if (replacementDOM.hasElements) {
      return Romo.replace(element, replacementDOM)
    } else {
      Romo.remove(element)
      return null
    }
  }

Romo.update =
  function(element, childElements) {
    const dom = Romo.dom(element)
    const childDOM = Romo.dom(childElements)
    Romo.clearHTML(dom.firstElement)
    return Romo.array(childDOM.elements).map(function(childElement) {
      dom.firstElement.appendChild(childElement)
      return Romo.env.applyAutoInitTo(childElement)
    })
  }

Romo.updateHTML =
  function(element, htmlString) {
    if (typeof htmlString === 'string' && htmlString.trim() === '') {
      return Romo.clearHTML(element)
    }

    const childDOM = Romo.dom(Romo.elements(htmlString))
    if (childDOM.hasElements) {
      return Romo.update(element, childDOM)
    } else {
      return Romo.updateText(element, htmlString)
    }
  }

Romo.updateText =
  function(element, textString) {
    const dom = Romo.dom(element)
    dom.innerText = textString
    return dom.firstElement
  }

Romo.clearHTML =
  function(elements) {
    const dom = Romo.dom(elements)
    dom.forEach(function(element) { element.innerHTML = '' })
    return dom.elements
  }

Romo.prepend =
  function(element, childElements) {
    const dom = Romo.dom(element)
    const childDOM = Romo.dom(childElements)
    var referenceElement = dom.firstElement.firstChild
    return (
      childDOM
        .reverseMapElements(function(childElement) {
          referenceElement =
            dom.firstElement.insertBefore(childElement, referenceElement)
          return Romo.env.applyAutoInitTo(referenceElement)
        })
        .reverse()
    )
  }

Romo.prependHTML =
  function(element, htmlString) {
    const childDOM = Romo.dom(Romo.elements(htmlString))
    if (childDOM.hasElements) {
      return Romo.prepend(element, childDOM)
    } else {
      return []
    }
  }

Romo.append =
  function(element, childElements) {
    const dom = Romo.dom(element)
    const childDOM = Romo.dom(childElements)
    return (
      childDOM.mapElements(function(childElement) {
        dom.firstElement.appendChild(childElement)
        return Romo.env.applyAutoInitTo(childElement)
      })
    )
  }

Romo.appendHTML =
  function(element, htmlString) {
    const childDOM = Romo.dom(Romo.elements(htmlString))
    if (childDOM.hasElements) {
      return Romo.append(element, childDOM)
    } else {
      return []
    }
  }

Romo.before =
  function(element, siblingElements) {
    const dom = Romo.dom(element)
    const siblingDOM = Romo.dom(siblingElements)
    const parentElement = Romo.parent(dom)
    var referenceElement = dom.firstElement
    return (
      siblingDOM
        .reverseMapElements(function(siblingElement) {
          referenceElement =
            parentElement.insertBefore(siblingElement, referenceElement)
          return Romo.env.applyAutoInitTo(referenceElement)
        })
        .reverse()
    )
  }

Romo.beforeHTML =
  function(element, htmlString) {
    const siblingDOM = Romo.dom(Romo.elements(htmlString))
    if (siblingDOM.hasElements) {
      return Romo.before(element, siblingDOM)
    } else {
      return []
    }
  }

Romo.after =
  function(element, siblingElements) {
    const dom = Romo.dom(element)
    const siblingDOM = Romo.dom(siblingElements)
    const parentElement = Romo.parent(dom)
    var referenceElement = Romo.next(element)
    return (
      siblingDOM.mapElements(function(siblingElement) {
        parentElement.insertBefore(siblingElement, referenceElement)
        return Romo.env.applyAutoInitTo(siblingElement)
      })
    )
  }

Romo.afterHTML =
  function(element, htmlString) {
    const siblingDOM = Romo.dom(Romo.elements(htmlString))
    if (siblingDOM.hasElements) {
      return Romo.after(element, siblingDOM)
    } else {
      return []
    }
  }
