// TODO add DOM support
Romo.attr =
  function(element, attributeName) {
    return Romo.dom(element).firstElement.getAttribute(attributeName)
  }

Romo.setAttr =
  function(elements, attributeName, attributeValue) {
    const value = String(attributeValue)
    Romo.dom(elements).forEach(function(element) {
      element.setAttribute(attributeName, value)
    })
    return elements
  }

Romo.rmAttr =
  function(elements, attributeName) {
    Romo.dom(elements).forEach(function(element) {
      element.removeAttribute(attributeName)
    })
    return elements
  }

Romo.data =
  function(element, dataName) {
    return Romo.env.decodeDataValue(Romo.attr(element, `data-${dataName}`))
  }

Romo.setData =
  function(elements, dataName, dataValue) {
    return Romo.setAttr(elements, `data-${dataName}`, dataValue)
  }

Romo.rmData =
  function(elements, dataName) {
    return Romo.rmAttr(elements, `data-${dataName}`)
  }

Romo.style =
  function(element, styleName) {
    return Romo.dom(element).firstElement.style[styleName]
  }

Romo.setStyle =
  function(elements, styleName, styleValue) {
    Romo.dom(elements).forEach(function(element) {
      element.style[styleName] = styleValue
    })
    return elements
  }

Romo.rmStyle =
  function(elements, styleName) {
    Romo.dom(elements).forEach(function(element) {
      element.style[styleName] = ''
    })
    return elements
  }

Romo.css =
  function(element, styleName) {
    return (
      window
        .getComputedStyle(Romo.dom(element).firstElement, null)
        .getPropertyValue(styleName)
    )
  }

Romo.hasClass =
  function(element, className) {
    return Romo.dom(element).firstElement.classList.contains(className)
  }

Romo.addClass =
  function(elements, className) {
    const splitClassNames =
      className.split(' ').filter(function(n) { return n })
    Romo.dom(elements).forEach(function(element) {
      splitClassNames.forEach(function(splitClassName) {
        element.classList.add(splitClassName)
      })
    })
    return elements
  }

Romo.rmClass =
  function(elements, className) {
    const splitClassNames =
      className.split(' ').filter(function(n) { return n })
    Romo.dom(elements).forEach(function(element) {
      splitClassNames.forEach(function(splitClassNames) {
        element.classList.remove(splitClassNames)
      })
    })
    return elements
  }

Romo.toggleClass =
  function(elements, className) {
    const splitClassNames =
      className.split(' ').filter(function(n) { return n })
    Romo.dom(elements).forEach(function(element) {
      splitClassNames.forEach(function(splitClassNames) {
        element.classList.toggle(splitClassNames)
      })
    })
    return elements
  }

Romo.show =
  function(elements) {
    Romo.dom(elements).forEach(function(element) {
      element.style.display = ''
    })
    return elements
  }

Romo.hide =
  function(elements) {
    Romo.dom(elements).forEach(function(element) {
      element.style.display = 'none'
    })
    return elements
  }

// This returns the given element's bounding rectangle. This is used by the
// `rect*` methods and is convenience method for the native call.
Romo.rect =
  function(element) {
    const dom = Romo.dom(element)
    if (dom.firstElement) {
      return dom.firstElement.getBoundingClientRect()
    }
    return { height: 0, width: 0, top: 0, left: 0 }
  }

Romo.height =
  function(element) {
    var heightPx = Romo.rect(element).height
    if (heightPx === 0 && Romo.dom(element).firstElement) {
      heightPx = parseInt(Romo.css(element, 'height'), 10)
    }
    if (isNaN(heightPx)) {
      heightPx = 0
    }

    return heightPx
  }

Romo.width =
  function(element) {
    var widthPx = Romo.rect(element).width
    if (widthPx === 0 && Romo.dom(element).firstElement) {
      widthPx = parseInt(Romo.css(element, 'width'), 10)
    }
    if (isNaN(widthPx)) {
      widthPx = 0
    }

    return widthPx
  }

Romo.offset =
  function(element, relativeToElement) {
    const elementRect = Romo.rect(element)
    const relativeToRect = Romo.rect(relativeToElement || document.body)

    /* eslint-disable no-multi-spaces */
    return {
      top:  elementRect.top  - relativeToRect.top,
      left: elementRect.left - relativeToRect.left,
    }
    /* eslint-enable no-multi-spaces */
  }

Romo.scrollTop =
  function(element) {
    const dom = Romo.dom(element)
    if ('scrollTop' in dom.firstElement) {
      return dom.firstElement.scrollTop
    } else {
      return dom.firstElement.pageYOffset
    }
  }

Romo.scrollLeft =
  function(element) {
    const dom = Romo.dom(element)
    if ('scrollLeft' in dom.firstElement) {
      return dom.firstElement.scrollLeft
    } else {
      return dom.firstElement.pageXOffset
    }
  }

Romo.setScrollTop =
  function(elements, value) {
    Romo.dom(elements).forEach(function(element) {
      if ('scrollTop' in element) {
        element.scrollTop = value
      } else {
        element.scrollTo(element.scrollX, value)
      }
    })
    return elements
  }

Romo.setScrollLeft =
  function(elements, value) {
    Romo.dom(elements).forEach(function(element) {
      if ('scrollLeft' in element) {
        element.scrollLeft = value
      } else {
        element.scrollTo(value, element.scrollY)
      }
    })
    return elements
  }

Romo.zIndex =
  function(element) {
    var value = parseInt(Romo.css(element, 'z-index'), 10)
    if (isNaN(value)) {
      value = 0
    }

    if (value !== 0 || Romo.is(element, 'body')) {
      return value
    } else {
      return Romo.zIndex(Romo.parent(element))
    }
  }