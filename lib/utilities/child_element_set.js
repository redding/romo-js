// Romo.ChildElementSet tracks and observes "child" elements by their assigned
// "parent" element. You can declare a set of child elements belongs to a parent
// element. This sets up a MutationObserver that ensures that if a parent
// element is removed from the DOM, all of its declared child elements are also
// removed from the DOM.
//
// This is the default behavior for traditional DOM elements (the nested "child"
// elements are removed from the DOM when their parent element is). However this
// utility should be used when you have non-traditional parent/child elements
// (where the child elements are dependent on other elements that aren't in
// their element tree.
Romo.define('Romo.ChildElementSet', function() {
  return class {
    constructor() {
      this.nextElementID = 1
      this.elements = {}

      this.parentRemovedObserver.observe(
        Romo.f('body').firstElement,
        {
          childList: true,
          subtree:   true,
        }
      )
    }

    get elementIDDataName() {
      return 'romo-child-elements-set-parent-element-id'
    }

    get elementIDAttributeName() {
      return `data-${this.elementIDDataName}`
    }

    get parentRemovedObserver() {
      return Romo.memoize(this, 'parentRemovedObserver', function() {
        return new MutationObserver(
          Romo.bind(function(mutationRecords) {
            mutationRecords.forEach(Romo.bind(function(mutationRecord) {
              if (
                mutationRecord.type === 'childList' &&
                mutationRecord.removedNodes.length > 0
              ) {
                Romo.array(mutationRecord.removedNodes).forEach(
                  Romo.bind(function(removedNode) {
                    this.remove(removedNode)
                  }, this)
                )
              }
            }, this))
          }, this)
        )
      })
    }

    add(parent, children) {
      // Delay adding because the parent element may be manipulated in the DOM
      // resulting in the parent element being removed and then re-added to the
      //  DOM. If the child elements are associated immediately, any removal
      // due to DOM manipulation would incorrectly remove the child elements.
      Romo.pushFn(Romo.bind(function() {
        const parentDOM = Romo.dom(parent)
        parentDOM.setData(
          this.elementIDDataName,
          this._push(parentDOM.data(this.elementIDDataName), Romo.dom(children))
        )
      }, this))
    }

    remove(element) {
      if (element.nodeType !== Node.ELEMENT_NODE) {
        return
      }
      const dom = Romo.dom(element)
      if (dom.data('romo-child-element-set-disabled') !== true) {
        if (dom.data(this.elementIDDataName)) {
          // This element is a parent element itself, remove its children.
          this._removeChildElems(dom)
        }

        Romo
          .array(dom.find(`[${this.elementIDAttributeName}]`))
          .forEach(
            Romo.bind(function(nestedParentDOM) {
              this._removeChildElems(nestedParentDOM)
            }, this)
          )
      }
    }

    // private

    _removeChildElems(dom) {
      Romo
        .array(this._pop(dom.data(this.elementIDDataName)))
        .forEach(
          function(childElement) {
            childElement.remove()
            Romo.trigger(childElement, 'Romo.ChildElementSet:removed', [this])
          }
        )
    }

    _push(parentID, childrenDOM) {
      if (parentID === undefined) {
        parentID = String(this.nextElementID++)
      }

      if (this.elements[parentID] === undefined) {
        this.elements[parentID] = Romo.dom()
      }

      this.elements[parentID] = this.elements[parentID].concat(childrenDOM)

      return parentID
    }

    _pop(id) {
      const itemsDOM = this.elements[id]
      delete this.elements[id]
      return itemsDOM || []
    }
  }
})
