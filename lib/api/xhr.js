Romo.xhr =
  function(...args) {
    return new Romo.XMLHttpRequest(...args).doSend()
  }

Romo.urlSearch =
  function(...args) {
    return new Romo.URLSearchParams(...args).toString()
  }
