/* eslint-disable no-multi-spaces */
/* eslint-disable space-in-parens */
Romo.array =
  function(value) {
    // Short-circuit for jQuery element sets. This ensures these values are fast
    // and don't run through all of the logic to detect if the value is like an
    // array. Keep each item in the Array a jQuery-wrapped element.
    if (Romo.env.hasJQuery && value instanceof window.jQuery) {
      return Array.prototype.slice.call(value).map(function(element) {
        return $(element)
      })
    }

    // Short-circuit for NodeList, HTMLCollection, or actual array values. This
    // ensures these values are fast and don't run through all of the logic to
    // detect if the value is like an array.
    var valString = Object.prototype.toString.call(value)
    if (
      valString === '[object NodeList]'       ||
      valString === '[object HTMLCollection]' ||
      Array.isArray(value)
    ) {
      return Array.prototype.slice.call(value)
    }

    // Short-circuit passing individual elements and "not truthy" values. This
    // ensures these values are fast and don't run through all of the logic to
    // detect if the value is like an array. This also handles passing in null
    // or undefined values.
    if (!value || (typeof value.nodeType) === 'number') {
      return [value]
    }

    const object = Object(value)
    var length
    if (!!object && 'length' in object) {
      length = object.length
    }

    // Some browsers return 'function' for HTML elements.
    const isFunction =
      (
        (typeof object)          === 'function' &&
        (typeof object.nodeType) !== 'number'
      )
    const likeArray = (
      (typeof value) !== 'string' &&
      !isFunction                 &&
      object !== window           &&
      object !== document         &&
      (
        Array.isArray(object) ||
        length === 0          ||
        (
          (typeof length) === 'number' &&
          length > 0                   &&
          (length - 1) in object
        )
      )
    )

    return (likeArray ? Array.prototype.slice.call(value) : [value])
  }
  /* eslint-enable no-multi-spaces */
  /* eslint-enable space-in-parens */
