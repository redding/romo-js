Romo.attr =
  function(element, attributeName) {
    return element.getAttribute(attributeName)
  }

Romo.setAttr =
  function(elements, attributeName, attributeValue) {
    const value = String(attributeValue)
    Romo.array(elements).forEach(function(element) {
      element.setAttribute(attributeName, value)
    })
    return value
  }

Romo.rmAttr =
  function(elements, attributeName) {
    Romo.array(elements).forEach(function(element) {
      element.removeAttribute(attributeName)
    })
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
    this.rmAttr(elements, `data-${dataName}`)
  }

Romo.style =
  function(element, styleName) {
    return element.style[styleName]
  }

Romo.setStyle =
  function(elements, styleName, styleValue) {
    Romo.array(elements).forEach(function(element) {
      element.style[styleName] = styleValue
    })
    return styleValue
  }

Romo.rmStyle =
  function(elements, styleName) {
    Romo.array(elements).forEach(function(element) {
      element.style[styleName] = ''
    })
  }

Romo.css =
  function(element, styleName) {
    return window.getComputedStyle(element, null).getPropertyValue(styleName)
  }

Romo.hasClass =
  function(element, className) {
    return element.classList.contains(className)
  }

Romo.addClass =
  function(elements, className) {
    const splitClassNames =
      className.split(' ').filter(function(n) { return n })
    Romo.array(elements).forEach(function(element) {
      splitClassNames.forEach(function(splitClassName) {
        element.classList.add(splitClassName)
      })
    })
    return className
  }

Romo.removeClass =
  function(elements, className) {
    const splitClassNames =
      className.split(' ').filter(function(n) { return n })
    Romo.array(elements).forEach(function(element) {
      splitClassNames.forEach(function(splitClassNames) {
        element.classList.remove(splitClassNames)
      })
    })
    return className
  }

Romo.toggleClass =
  function(elements, className) {
    const splitClassNames =
      className.split(' ').filter(function(n) { return n })
    Romo.array(elements).forEach(function(element) {
      splitClassNames.forEach(function(splitClassNames) {
        element.classList.toggle(splitClassNames)
      })
    })
    return className
  }

Romo.show =
  function(elements) {
    Romo.array(elements).forEach(function(element) {
      element.style.display = ''
    })
  }

Romo.hide =
  function(elements) {
    Romo.array(elements).forEach(function(element) {
      element.style.display = 'none'
    })
  }

// This returns the given element's bounding rectangle. This is used by the
// `rect*` methods and is convenience method for the native call.
Romo.rect =
  function(element) {
    if (element) {
      return element.getBoundingClientRect()
    }
    return { height: 0, width: 0, top: 0, left: 0 }
  }

Romo.height =
  function(element) {
    var heightPx = Romo.rect(element).height
    if (heightPx === 0) {
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
    if (widthPx === 0) {
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
    const relativeToRect = this.rect(relativeToElement || document.body)

    /* eslint-disable no-multi-spaces */
    return {
      top:  elementRect.top  - relativeToRect.top,
      left: elementRect.left - relativeToRect.left,
    }
    /* eslint-enable no-multi-spaces */
  }

Romo.scrollTop =
  function(element) {
    return ('scrollTop' in element) ? element.scrollTop : element.pageYOffset
  }

Romo.scrollLeft =
  function(element) {
    return ('scrollLeft' in element) ? element.scrollLeft : element.pageXOffset
  }

Romo.setScrollTop =
  function(elements, value) {
    Romo.array(elements).forEach(function(element) {
      if ('scrollTop' in element) {
        element.scrollTop = value
      } else {
        element.scrollTo(element.scrollX, value)
      }
    })
  }

Romo.setScrollLeft =
  function(elements, value) {
    Romo.array(elements).forEach(function(element) {
      if ('scrollLeft' in element) {
        element.scrollLeft = value
      } else {
        element.scrollTo(value, element.scrollY)
      }
    })
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
