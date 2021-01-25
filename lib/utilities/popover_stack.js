import './popover_stack/item.js'

// Romo.PopoverStack models a stack of Romo.UI.Popover component instances.
// The popovers (modals, dropdowns, etc) can be nested such that, for example, a
// modal may launch a dropdown or a dropdown may launch another dropdown, etc.
// This component manages the "stack" of popovers including the state of what is
// open/not, placing the popovers appropriately, and closing the popovers given
// certain triggers (clicking off the popover, hitting the `Esc` key, etc).
//
// It is modeled as a stack b/c that is how the popovers should behave when
// one popover launches another: they should stack on top of each other and you
// can't close a lower popover without first closing all popovers on top of it.
//
// The `popoverSelectors` param configures the types of popovers that the
// stack should look for and manage. We identify types of popovers using their
// component-name data attributes (e.g. '[data-romo-modal]',
// '[data-romo-dropdown]', etc).
Romo.define('Romo.PopoverStack', function() {
  return class {
    constructor(popoverSelectors) {
      this.items = []
      this.selector = popoverSelectors.join(', ')

      this.bodyDOM = Romo.f('body')
      this.bodyDOM.on('click', Romo.bind(this._onBodyClick, this))
      this.bodyDOM.on('keyup', Romo.bind(this._onBodyKeyUp, this))
      Romo.dom(window).on('resize', Romo.bind(this._onWindowResize, this))
      Romo.dom(window).on('scroll', Romo.bind(this._onWindowScroll, this))
    }

    // This is called by popover classes when they want to open their popover.
    // They add their popover to the stack and the stack calls their
    // `boundOpenFn` callback. The classes also inject other callbacks that
    // allow the stack to appropriately close and place popovers.
    doAddPopover(popoverDOM, boundOpenFn, boundCloseFn, boundPlaceFn) {
      // Allow any in-flight events (e.g. body click events) to propagate and
      // run first. This ensures any currently open popovers are in the
      // appropriate state before opening a new popover.
      Romo.pushFn(Romo.bind(function() {
        this.items.push(
          new Romo.PopoverStack.Item(popoverDOM, boundCloseFn, boundPlaceFn)
        )
        boundOpenFn()
      }, this))

      return this
    }

    // This closes all popovers open on top of the given popover and then closes
    // the given popover itself as well.
    doCloseThru(popoverDOM) {
      // Allow any in-flight events (e.g. body click events) to propagate and
      // run first. This ensures any currently open popovers are in the
      // appropriate state before closing popovers.
      Romo.pushFn(Romo.bind(function() {
        if (this._includes(popoverDOM)) {
          this.doCloseTo(popoverDOM)
          this._closeTop()
        }
      }, this))

      return this
    }

    // This closes all popovers open on top of the given popover but DOES NOT
    // close the given popover itself.
    doCloseTo(popoverDOM) {
      if (this._includes(popoverDOM)) {
        while (
          this.items.length > 0 &&
          !this.items[this.items.length - 1].isFor(popoverDOM)
        ) {
          this._closeTop()
        }
      }

      return this
    }

    // This is bound to window resize/scroll events to trigger resizing popovers
    // as the space available to the popover changes. The `includingFixed`
    // control parameter is needed b/c we resize fixed-position popovers on
    // window resize because that affects all popovers' available space. However
    // we don't resize fixed-position popovers on window scroll because
    // scrolling doesn't affect fixed-position elements.
    doPlaceAllPopovers(includingFixed) {
      this
        .items
        .filter(function(item) {
          return includingFixed || item.positionStyle !== 'fixed'
        })
        .forEach(function(item) {
          item.placeFn()
        })

      return this
    }

    // private

    _closeTop() {
      var item
      if (this.items.length > 0) {
        item = this.items.pop()

        item.closeFn()
        this.bodyDOM.trigger(
          'Romo.PopoverStack:popoverClosed',
          [this, item.popoverDOM],
        )
        item.doTrigger('Romo.PopoverStack:popoverClosed', [this])
      }
      return item
    }

    _closeAll() {
      while (this.items.length > 0) {
        this._closeTop()
      }
    }

    _includes(popoverDOM) {
      return this.items.reduce(function(included, item) {
        return included || item.isFor(popoverDOM)
      }, false)
    }

    // On body clicks, detect the target of the click and see if it is an open
    // popover. If it is, close all popover open on top of it. If it is not,
    // close all open popovers.
    _onBodyClick(e) {
      const popoverDOM = Romo.dom(e.target).closest(this.selector)

      if (popoverDOM.length === 0 || !this._includes(popoverDOM)) {
        this._closeAll()
      } else {
        this.doCloseTo(popoverDOM)
      }
    }

    // On Esc keys, close the top open popover (if any) and trigger a specific
    // event.
    _onBodyKeyUp(e) {
      var closedItem
      if (e.keyCode === 27 /* Esc */) {
        closedItem = this._closeTop()
        if (closedItem) {
          closedItem.doTrigger('Romo.PopoverStack:popoverClosedByEsc', [this])
        }
      }
    }

    // When resizing the window, re-place all open popovers including any
    // fixed-position popovers as the space available to popovers is changing.
    _onWindowResize(e) {
      this.doPlaceAllPopovers(true)
    }

    // When scrolling, re-place non-fixed open popovers as their available space
    // is changing. As scrolling doesn't affect fixed-position popovers, we
    // don't need to re-place them.
    _onWindowScroll(e) {
      this.doPlaceAllPopovers(false)
    }
  }
})
