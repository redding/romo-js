Romo.define('Tests', function() {
  return class {
    constructor(dom) {
      this.dom = dom
    }

    group(name, fn) {
      this.dom.appendHTML(`<h3>${name}</h3>`)
      fn()
    }

    test(description, fn) {
      const testDOM =
        this.dom.appendHTML(`<div class="test">${description}</description>`)

      // eslint-disable-next-line no-undef
      new Tests.Test(testDOM).run(fn)
    }
  }
})

Romo.define('Tests.Test', function() {
  return class {
    constructor(dom) {
      this.dom = dom
      this.success = true
    }

    run(fn) {
      try {
        fn(this)
      } catch (error) {
        this.unstubConsoleError()
        console.error(error)
        this.fail()
      }
      return this
    }

    assert(assertion) {
      if (assertion) {
        this.pass()
      } else {
        throw new Error('test assertion failed.')
      }
    }

    pass() {
      this.dom.addClass('pass').rmClass('fail')
    }

    fail(message) {
      if (message) {
        this.unstubConsoleError()
        console.error(message)
      }
      this.dom.addClass('fail').rmClass('pass')
    }

    stubConsoleError() {
      console.originalErrorFn = console.error.bind(console)
      console.errorMessages = []
      console.error =
        function() {
          console.errorMessages.push(Array.from(arguments))
          console.log.apply(console, arguments)
        }
    }

    unstubConsoleError() {
      if (console.originalErrorFn) {
        console.error = console.originalErrorFn.bind(console)
        console.errorMessages = undefined
        console.originalErrorFn = undefined
      }
    }
  }
})
