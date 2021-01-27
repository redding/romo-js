// This is a convenience function for parsing string namespaces and
// automatically generating nested namespace objects. It takes an optional
// `blockFunction` callback that gets passes the generated namespace object.
// Use this to define namespaced classes.
//
// Usage example:
// Romo.namespace('Some.Deep.Namespace', function(ns) {
//   ns.MyClass = class {
//     constructor() {
//       // contructor logic goes here
//     }
//
//     somePublicMethod() {
//     }
//
//     // private
//
//     _somePrivateMethod() {
//     }
//   }
// })
//
// new Some.Deep.Namespace.MyClass()
Romo.namespace =
  function(namespaceString, blockFunction) {
    const parts =
      namespaceString
        .split('.')
        .filter(function(part) { return part.length > 0 })
    var parent = window
    var i

    for (i = 0; i < parts.length; i++) {
      // create a property if it doesnt exist
      if (typeof parent[parts[i]] === 'undefined') {
        parent[parts[i]] = {}
      }
      parent = parent[parts[i]]
    }

    if (blockFunction !== undefined) {
      blockFunction(parent)
    }
    return parent
  }

// This is a convenience function defining namespaced objects in an
// idempotent way. It takes a namespaced object name and, if that object
// is not already defined, calls a function that is expected to return the
// object. It composes `Romo.namespace` for handling the object namespace.
//
// Use this to define namespaced classes and ensure the class is only
// evaluated once (even across split packs when using Webpacker). This is
// used to define Romo components.
//
// Usage example:
// Romo.define('Some.Object', function() {
//   return class {
//     constructor() {
//       // contructor logic goes here
//     }
//
//     somePublicMethod() {
//     }
//
//     // private
//
//     _somePrivateMethod() {
//     }
//   }
// })
//
// new Some.Object()
Romo.define =
  function(namespacedObjectName, objectFunction) {
    const parts = namespacedObjectName.split('.')
    var object =
      parts.reduce(function(object, part) {
        return (object === undefined ? object : object[part])
      }, window)

    if (!object || typeof object === 'object') {
      const namespaceString = parts.slice(0, -1).join('.')
      const objectName = parts[parts.length - 1]

      Romo.namespace(namespaceString, function(ns) {
        ns[objectName] = objectFunction()
        ns[objectName].prototype.class = ns[objectName]
        ns[objectName].prototype.className = namespacedObjectName
        ns[objectName].prototype.respondTo = Romo.respondToMethod()
        ns[objectName].wrap = Romo.wrapMethod(ns[objectName])

        if (object) {
          for (const [key, value] of Object.entries(object)) {
            ns[objectName][key] = value
          }
        }
        object = ns[objectName]
      })
    }

    return object
  }

// This returns a function, bound to the given `objectClass`, for wrapping
// items in a list with the JS Class `objectClass`. The behavior is identical
// to the `BaseViewModel.wrap` Ruby equivalent.
//
// Usage example:
// Romo.define('Some.Object', function() {
//   return class {
//     constructor(
//       value,
//       { thing } = {}
//     ) {
//       this.value = value
//       this.thing = thing
//     }
//   }
// })
//
// var list = [1, 2, 3]
// var object_list = Some.Object.wrap(list, { thing: "SOME_THING1" })
// object_list[0].class // => Some.Objet
// object_list[0].value // => 1
// object_list[0].thing // => "SOME_THING1"
// object_list[1].value // => 2
// object_list[1].thing // => "SOME_THING1"
// object_list[2].value // => 3
// object_list[2].thing // => "SOME_THING1"
Romo.wrapMethod =
  function(objectClass) {
    return (
      Romo.bind(function(list, args) {
        return Romo.array(list).map(Romo.bind(function(item) {
          return new this(item, args)
        }, this))
      }, objectClass)
    )
  }

// This returns whether a property on an object is undefined or not. It is used
// to help introspect Romo-defined objects.
Romo.respondToMethod =
  function() {
    return (
      function(messageName) {
        return Romo.respondTo(this, messageName)
      }
    )
  }

// This returns whether a property on a receiver is undefined or not. It is used
// to help introspect objects.
Romo.respondTo =
  function(receiver, messageName) {
    return typeof receiver[messageName] !== 'undefined'
  }

// This returns whether an object is a Romo.DOM object. It is used to help
// introspect objects.
Romo.isDOM =
  function(object) {
    return Romo.respondTo(object, 'isRomoDOM') && object.isRomoDOM
  }

// This memoizes the return value of the given fnValue function.
//
// @example:
//   get value() {
//     return Romo.memoize(this, 'value', function() {
//       return 'EXPENSIVE_CALCULATED_VALUE'
//     })
//   }
Romo.memoize =
  function(receiver, key, fnValue) {
    if (receiver._romoMemoizeCache === undefined) {
      receiver._romoMemoizeCache = {}
    }

    if (receiver._romoMemoizeCache[key] === undefined) {
      receiver._romoMemoizeCache[key] = Romo.bind(fnValue, receiver)()
    }
    return receiver._romoMemoizeCache[key]
  }
