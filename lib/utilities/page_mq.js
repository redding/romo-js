import './queue.js'

// Romo.PageMQ is a utility for implementing page-specific Message Queues (FIFO).
// The enqueueing object (the page) enqueues messages (functions) that need to
// be executed in sequence. As the page hits states where it can execute the
// next message, it dequeues them.
//
// Messages are functions that are executed in the scope of the enqueueing
// object. Dequeueing automatically executes the message-function.
//
// Usage example:
//   this.pageMQ = new Romo.PageMQ(this)
//
//   this.pageMQ.enqueue(function() { // Message 1
//     this._doMessage1Part1()
//     this._doMessage1Part2()
//   })
//   this.pageMQ.enqueue(function() { // Message 2
//     this._doMessage2()
//   })
//   this.pageMQ.enqueue(function() { // Message 3
//     this._doMessage3Part1()
//     this._doMessage3Part2()
//     this._doMessage3Part3()
//   })
//
//   this.pageMQ.dequeue() // => executes Message 1 function
//   this.pageMQ.dequeue() // => executes Message 2 function
//   this.pageMQ.dequeue() // => executes Message 3 function
//   this.pageMQ.dequeue() // => (does nothing)
Romo.define('Romo.PageMQ', function() {
  return class {
    constructor(page) {
      this.page = page
      this._queue = new Romo.Queue(this._emptyDequeueFn)
    }

    get size() {
      return this._queue.size
    }

    get isEmpty() {
      return this._queue.isEmpty
    }

    enqueue(fnMessage) {
      this._queue.enqueue(Romo.bind(fnMessage, this.page))

      return this
    }

    dequeue() {
      this._queue.dequeue()()

      return this
    }

    dequeueAll() {
      while (!this.isEmpty) { this.dequeue() }

      return this
    }

    peek() {
      return this._queue.peek()
    }

    clear() {
      this._queue.clear()

      return this
    }

    // Private

    // If the underlying Queue is empty and told to dequeue, return a no-op
    // function so we won't try to execute `undefined` and don't have to check
    // for this case when dequeueing (Null Object Pattern).
    get _emptyDequeueFn() {
      return function() {}
    }
  }
})
