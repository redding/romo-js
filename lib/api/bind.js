Romo.bind =
  function(fn, context) {
    Romo.fid(fn)
    if (context) {
      return Romo.fid(fn.bind(context), { aliasFn: fn })
    } else {
      return fn
    }
  }

Romo.fid =
  function(fn, { aliasFn } = {}) {
    if (!fn._romofid) {
      fn._romofid = Romo.getFid(aliasFn) || Romo.env.currentFid++
    }

    return fn
  }

Romo.getFid =
  function(fn) {
    return (fn || {})._romofid
  }

Romo.eid =
  function(element, { aliasElement } = {}) {
    if (!element._romoeid) {
      element._romoeid = Romo.getEid(aliasElement) || Romo.env.currentEid++
    }

    return element
  }

Romo.getEid =
  function(element) {
    return (element || {})._romoeid
  }
