Romo.xhr =
  function(...args) {
    return new Romo.XMLHttpRequest(...args).doSend()
  }

Romo.url =
  function(urlOrURLString) {
    return new URL(
      (urlOrURLString || window.location).toString(),
      window.location.toString()
    )
  }

Romo.urlSearch =
  function(...args) {
    return new Romo.URLSearchParams(...args).toString()
  }
