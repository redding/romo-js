Romo.xhr =
  function(...args) {
    return new Romo.XMLHttpRequest(...args).doSend()
  }

Romo.url =
  function(location) {
    return new URL(
      (location || window.location).toString(),
      window.location.toString()
    )
  }

Romo.urlSearch =
  function(...args) {
    return new Romo.URLSearchParams(...args).toString()
  }
