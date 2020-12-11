Romo.remove =
  function(elements) {
    return Romo.array(elements).map(function(element) {
      if (element.parentElement) {
        element.parentElement.removeChild(element)
      }
      return element
    })
  }

Romo.removeChildren =
  function(parentElements) {
    return Romo.array(parentElements).map(function(parentElement) {
      Romo.children(parentElement).forEach(function(childElement) {
        parentElement.removeChild(childElement)
      })
      return parentElement
    })
  }

Romo.replace =
  function(element, replacementElement) {
    element.parentElement.replaceChild(replacementElement, element)
    return Romo.env.applyAutoInitTo(replacementElement)
  }

Romo.replaceHTML =
  function(element, htmlString) {
    const replacementElement = Romo.elements(htmlString)[0]
    if (!replacementElement) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.replace(element, replacementElement)
  }

Romo.update =
  function(element, childElements) {
    Romo.clearHTML(element)
    return Romo.array(childElements).map(function(childElement) {
      element.appendChild(childElement)
      return Romo.env.applyAutoInitTo(childElement)
    })
  }

Romo.updateHTML =
  function(element, htmlString) {
    if (typeof htmlString === 'string' && htmlString.trim() === '') {
      return Romo.clearHTML(element)
    }

    const childElements = Romo.elements(htmlString)
    if (childElements.length === 0) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.update(element, childElements)
  }

Romo.updateText =
  function(element, textString) {
    element.innerText = textString
    return element
  }

Romo.clearHTML =
  function(elements) {
    Romo.array(elements).forEach(function(element) {
      element.innerHTML = ''
    })
    return elements
  }

Romo.prepend =
  function(element, childElements) {
    var referenceElement = element.firstChild
    return (
      Romo
        .array(childElements)
        .reverse()
        .map(function(childElement) {
          referenceElement =
            element.insertBefore(childElement, referenceElement)
          return Romo.env.applyAutoInitTo(referenceElement)
        })
        .reverse()
    )
  }

Romo.prependHtml =
  function(element, htmlString) {
    const childElements = Romo.elements(htmlString)
    if (childElements.length === 0) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.prepend(element, childElements)
  }

Romo.append =
  function(element, childElements) {
    return (
      Romo
        .array(childElements)
        .map(function(childElement) {
          element.appendChild(childElement)
          return Romo.env.applyAutoInitTo(childElement)
        })
    )
  }

Romo.appendHtml =
  function(element, htmlString) {
    const childElements = Romo.elements(htmlString)
    if (childElements.length === 0) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.append(element, childElements)
  }

Romo.before =
  function(element, siblingElements) {
    const parentElement = element.parentElement
    var referenceElement = element
    return (
      Romo
        .array(siblingElements)
        .reverse()
        .map(function(siblingElement) {
          referenceElement =
            parentElement.insertBefore(siblingElement, referenceElement)
          return Romo.env.applyAutoInitTo(referenceElement)
        })
        .reverse()
    )
  }

Romo.beforeHtml =
  function(element, htmlString) {
    const siblingElements = Romo.elements(htmlString)
    if (siblingElements.length === 0) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.before(element, siblingElements)
  }

Romo.after =
  function(element, siblingElements) {
    const parentElement = element.parentElement
    var referenceElement = Romo.next(element)
    return (
      Romo
        .array(siblingElements)
        .map(function(siblingElement) {
          parentElement.insertBefore(siblingElement, referenceElement)
          return Romo.env.applyAutoInitTo(siblingElement)
        })
    )
  }

Romo.afterHtml =
  function(element, htmlString) {
    const siblingElements = Romo.elements(htmlString)
    if (siblingElements.length === 0) {
      throw new Error(`"${htmlString}" doesn't contain HTML elements.`)
    }
    return Romo.after(element, siblingElements)
  }
