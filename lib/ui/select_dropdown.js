import '../utilities/dom_component.js'
import './select_dropdown/container.js'

Romo.define('Romo.UI.SelectDropdown', function() {
  return class extends Romo.DOMComponent {
    constructor(dom) {
      super(dom)

      this._bind()
    }

    static get attrPrefix() {
      return 'romo-ui-select-dropdown'
    }

    get romoDropdown() {
      return Romo.memoize(this, 'romoDropdown', function() {
        return this._bindDropdown()
      })
    }

    get container() {
      return Romo.memoize(this, 'container', function() {
        return this._bindContainer()
      })
    }

    get containerFilterDOM() {
      return this.container.filterDOM
    }

    get dropdownPopoverBodyDOM() {
      return this.romoDropdown.popoverBodyDOM
    }

    get shouldOpenOnFocus() {
      return this.domData('open-on-focus')
    }

    doSetValue(value) {
      this.value = value
      this._triggerSetValueChangeEvent()

      return this
    }

    // private

    _bind() {
      this.prevValue = this.domData('value')
      this.doSetValue(this.prevValue)

      this.on('click', this._onClick)
      this.on('keydown', this._onKeyDown)
      this.on('change', this._onChange)
      this.on('focus', this._onFocus)
      this.on('Romo.UI.Dropdown:popoverOpened', this._onPopoverOpened)
      this.on('Romo.UI.Dropdown:popoverClosed', this._onPopoverClosed)
    }

    _bindDropdown() {
      this.dom.setData('romo-ui-dropdown-disable-click-toggle', 'true')
      this.dom.setData('romo-ui-xhr-disabled', 'true')

      return new Romo.UI.Dropdown(this.dom)
    }

    _bindContainer() {
      const container =
        new Romo.UI.SelectDropdown.Container(
          this.dropdownPopoverBodyDOM,
          { options: this.domData('options-json') }
        )

      this.dropdownPopoverBodyDOM.on(
        'Romo.UI.SelectDropdown.Container:optionSelected',
        Romo.bind(this._onOptionSelected, this)
      )
      this.dropdownPopoverBodyDOM.on(
        'Romo.UI.SelectDropdown.Container:optionsFiltered',
        Romo.bind(this._onOptionsFiltered, this)
      )
      this.romoDropdown.doUpdatePopoverBodyDOM(container.dom)

      Romo.pushFn(Romo.bind(function() {
        container.doScrollTopToOption(container.highlightOptionDOM)
      }, this))

      return container
    }

    _triggerSetValueChangeEvent() {
      if (this.value !== this.prevValue) {
        this.dom.trigger('change')
      }
    }

    _openPopover(callbackFn) {
      this._popoverOpenedCallbackFn =
        Romo.bind(callbackFn || function() {}, this)
      this.romoDropdown.doOpenPopover()
    }

    _onOptionSelected(e, optionDOM) {
      const optionValue = optionDOM.data('romo-ui-select-dropdown-value')
      this.doSetValue(optionValue)
      this.romoDropdown.doClosePopover()

      this.domTrigger('optionSelected', [optionValue, optionDOM])
      if (optionValue !== this.prevValue) {
        this.domTrigger('newOptionSelected', [optionValue, optionDOM])
      }
      // Always publish the selected events before publishing any
      // change events.
      this._triggerSetValueChangeEvent()
    }

    _onOptionsFiltered(e) {
      this.romoDropdown.doPlacePopover()
    }

    _onClick(e) {
      e.preventDefault()
      this.romoDropdown.doTogglePopover()
    }

    // Run in a pushFn to allow the romoDropdown to fully bind.
    _onKeyDown(e) {
      if (!this.dom.hasClass('disabled') && this.romoDropdown.isPopoverClosed) {
        Romo.pushFn(Romo.bind(function() {
          if (e.keyCode === 40 /* Down */ || e.keyCode === 38 /* Up */) {
            e.stopPropagation()
            e.preventDefault()

            this._openPopover()
          } else if (
            Romo.env.isInputKey(e.keyCode) &&
            e.keyCode !== 8 /* Backspace */ &&
            e.keyCode !== 13 /* Enter */ &&
            e.metaKey === false &&
            this.containerFilterDOM.hasElements
          ) {
            e.stopPropagation()
            e.preventDefault()

            this._openPopover(function() {
              this.containerFilterDOM.firstElement.value = e.key
              this.container.doFilterOptions()
            })
          }
        }, this))
      }
    }

    _onChange(e) {
      const newValue = this.value
      this.domTrigger('changed', [this.prevValue, newValue])
      this.prevValue = newValue
    }

    _onFocus(e) {
      if (this.shouldOpenOnFocus && !this.focusFromClosingThePopover) {
        this._openPopover()
      }
      this.focusFromClosingThePopover = false
    }

    _onPopoverOpened(e) {
      this.doSetValue(this.value)
      this.container.doSetSelectedValue(this.value).doRefresh().doLockWidth()
      if (this._popoverOpenedCallbackFn) {
        this._popoverOpenedCallbackFn()
        this._popoverOpenedCallbackFn = undefined
      }
    }

    _onPopoverClosed(e) {
      this.focusFromClosingThePopover = true
      this.dom.firstElement.focus()
      this.container.doResetOptionsDOM().doUnlockWidth()
    }
  }
})

Romo.addAutoInitSelector(`[data-${Romo.UI.SelectDropdown.attrPrefix}]`, Romo.UI.SelectDropdown)
