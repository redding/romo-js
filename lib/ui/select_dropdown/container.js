import './options_list.js'

Romo.define('Romo.UI.SelectDropdown.Container', function() {
  return class {
    constructor(popoverBodyDOM, { options } = {}) {
      this.popoverBodyDOM = popoverBodyDOM

      this.refreshOptions = options
      this.selectedValue = undefined
      this._bind()
    }

    get dom() {
      return Romo.memoize(this, 'dom', function() {
        return Romo.dom(Romo.elements(this._containerTemplate))
      })
    }

    get filterContainerDOM() {
      return Romo.memoize(this, 'filterContainerDOM', function() {
        return this.dom.find('[data-romo-ui-select-dropdown-filter-container]')
      })
    }

    get filterDOM() {
      return Romo.memoize(this, 'filterDOM', function() {
        return this.filterContainerDOM.find('[data-romo-ui-select-dropdown-filter]')
      })
    }

    get popoverContentDOM() {
      return this.dom.find('[data-romo-ui-dropdown-popover-content]')
    }

    get popoverContentDOMOffset() {
      return this.popoverContentDOM.offset()
    }

    get popoverContentDOMHeight() {
      return this.popoverContentDOM.height()
    }

    get optionsListDOM() {
      return this.dom.find('ul')
    }

    get optionsDOM() {
      return this.optionsListDOM.find('li.option')
    }

    get availableOptionSelector() {
      return 'li.option:not(.disabled):not(.hidden)'
    }

    get availableOptionsDOM() {
      return this.optionsListDOM.find(this.availableOptionSelector)
    }

    get highlightOptionDOM() {
      return this.optionsListDOM.find('li.highlight')
    }

    get highlightPrevOptionDOM() {
      return this.highlightOptionDOM.prev(this.availableOptionSelector)
    }

    get highlightNextOptionDOM() {
      return this.highlightOptionDOM.next(this.availableOptionSelector)
    }

    doUpdateOptions(options) {
      this.refreshOptions = options

      return this
    }

    doSetSelectedValue(value) {
      this.selectedValue = value

      return this
    }

    doRefresh() {
      this._bindOptionsList()
      this.filterDOM.firstElement.value = ''
      this.filterDOM.firstElement.focus()

      return this
    }

    doResetOptionsDOM() {
      this.optionsDOM.removeClass('highlight').removeClass('hidden')

      return this
    }

    doLockWidth() {
      this.popoverContentDOM.setStyle(
        'width',
        `${this.popoverContentDOM.width()}px`
      )

      return this
    }

    doUnlockWidth() {
      this.popoverContentDOM.rmStyle('width')

      return this
    }

    doHideFilter() {
      this.filterContainerDOM.hide()

      return this
    }

    doShowFilter() {
      this.filterContainerDOM.show()

      return this
    }

    doHighlightPrevOption() {
      var prevOptionDOM = this.highlightPrevOptionDOM
      if (!prevOptionDOM.hasElements) {
        prevOptionDOM = this.availableOptionsDOM.last
      }
      if (prevOptionDOM) {
        const prevOptionDOMOffset = prevOptionDOM.offset()

        this.doHighlightOption(prevOptionDOM)

        if (this.popoverContentDOMOffset.top > prevOptionDOMOffset.top) {
          this.doScrollTopToOption(prevOptionDOM)
        } else if (
          (this.popoverContentDOMOffset.top + this.popoverContentDOMHeight) <
          prevOptionDOMOffset.top
        ) {
          this.doScrollTopToOption(prevOptionDOM)
        }
      }

      return this
    }

    doHighlightNextOption() {
      var nextOptionDOM = this.highlightNextOptionDOM
      if (!nextOptionDOM.hasElements) {
        nextOptionDOM = this.availableOptionsDOM.first
      }
      if (nextOptionDOM) {
        const nextOptionDOMOffset = nextOptionDOM.offset()
        const nextOptionDOMHeight = nextOptionDOM.height()

        this.doHighlightOption(nextOptionDOM)

        if (
          (this.popoverContentDOMOffset.top + this.popoverContentDOMHeight) <
          (nextOptionDOMOffset.top + nextOptionDOMHeight)
        ) {
          this.doScrollBottomToOption(nextOptionDOM)
        } else if (this.popoverContentDOMOffset.top > nextOptionDOMOffset.top) {
          this.doScrollTopToOption(nextOptionDOM)
        }
      }

      return this
    }

    doHighlightOption(optionDOM) {
      this.highlightOptionDOM.removeClass('highlight')
      optionDOM.addClass('highlight')

      return this
    }

    doScrollTopToOption(optionDOM) {
      if (optionDOM) {
        const scrollDOM = this.popoverContentDOM
        scrollDOM.setScrollTop(0)

        const scrollOffsetTop = scrollDOM.offset().top
        const optionOffsetTop = optionDOM.offset().top
        const optionOffset = optionDOM.height() / 2

        scrollDOM.setScrollTop(optionOffsetTop - scrollOffsetTop - optionOffset)
      }

      return this
    }

    doScrollBottomToOption(optionDOM) {
      if (optionDOM) {
        const scrollDOM = this.popoverContentDOM
        scrollDOM.setScrollTop(0)

        const scrollOffsetTop = scrollDOM.offset().top
        const optionOffsetTop = optionDOM.offset().top
        const optionOffset =
          scrollDOM.firstElement.offsetHeight - optionDOM.height()

        scrollDOM.setScrollTop(optionOffsetTop - scrollOffsetTop - optionOffset)
      }

      return this
    }

    doSelectHighlightOption() {
      this.doSelectOption(this.highlightOptionDOM)

      return this
    }

    doSelectOption(optionDOM) {
      if (optionDOM) {
        this.popoverBodyDOM.trigger(
          'Romo.UI.SelectDropdown.Container:optionSelected',
          [optionDOM]
        )
      }

      return this
    }

    doFilterOptions() {
      const elements = this.optionsDOM.elements
      const fuzzySearchFilter =
        Romo.FuzzySearch.filter(
          this.filterDOM.firstElement.value,
          elements,
          function(element) {
            // The fuzzy search filter by default considers a space, "-",
            // and "_" as word boundaries. We want to also consider other
            // non-word characters (such as ":", "/", ".", "?", "=", "&") as
            // word boundaries as well so convert them to spaces..
            return element.textContent.replace(/\W/g, ' ')
          }
        )

      Romo.removeClass(fuzzySearchFilter.matchingItems, 'hidden')
      Romo.addClass(fuzzySearchFilter.notMatchingItems, 'hidden')

      this.doHighlightOption(this.availableOptionsDOM.first)

      this.popoverBodyDOM.trigger(
        'Romo.UI.SelectDropdown.Container:optionsFiltered'
      )

      return this
    }

    doBindWindowKeyDown() {
      Romo.dom(window).on('keydown', Romo.bind(this._onWindowKeyDown, this))

      return this
    }

    doUnBindWindowKeyDown() {
      Romo.dom(window).off('keydown', Romo.bind(this._onWindowKeyDown, this))

      return this
    }

    // private

    get _containerTemplate() {
      return `
<div data-romo-ui-select-dropdown-container>
  <div data-romo-ui-select-dropdown-filter-container>
    <input type="text"
           size="1"
           autocomplete="off"
           data-romo-ui-select-dropdown-filter
           data-romo-ui-indicator-text-input
           data-romo-ui-on-key
           data-romo-ui-form-disable-enter-submit="true">
  </div>
  <div data-romo-ui-dropdown-popover-content><ul></ul></div>
</div>
`
    }

    _bind() {
      this._bindFilter()
    }

    _bindFilter() {
      this.filterDOM.setDataDefault(
        'romo-ui-indicator-text-input-indicator-icon-name',
        Romo.config.selectDropdown.filterIndicatorIconNameFn(),
      )
      this.filterDOM.setDataDefault(
        'romo-ui-indicator-text-input-indicator-icon-css-class',
        Romo.config.selectDropdown.filterIndicatorIconCSSClassFn(),
      )
      this.filterDOM.setDataDefault(
        'romo-ui-indicator-text-input-indicator-position',
        Romo.config.selectDropdown.filterIndicatorPositionFn(),
      )
      this.filterDOM.setDataDefault(
        'romo-ui-indicator-text-input-indicator-spacing-px',
        Romo.config.selectDropdown.filterIndicatorSpacingPxFn(),
      )
      this.filterDOM.setDataDefault(
        'romo-ui-indicator-text-input-indicator-width-px',
        Romo.config.selectDropdown.filterIndicatorWidthPxFn(),
      )
      this.filterDOM.setDataDefault(
        'romo-ui-indicator-text-input-indicator-spinner-size-px',
        Romo.config.selectDropdown.filterIndicatorSpinnerSizePxFn(),
      )

      this.filterDOM.on(
        'Romo.UI.OnKey:keyEvent',
        Romo.bind(function(e, romoOnKey, keyEvent) {
          if (Romo.env.isInputKey(keyEvent.keyCode)) {
            this.doFilterOptions()
          }
        }, this)
      )
    }

    _bindOptionsList() {
      const optionsList =
        new Romo.UI.SelectDropdown.OptionsList(
          this.refreshOptions,
          { selectedValue: this.selectedValue }
        )
      this.optionsListDOM.replace(optionsList.dom)

      this.optionsDOM.on(
        'Romo.UI.SelectDropdown.OptionsList:optionClicked',
        Romo.bind(function(e, optionDOM) {
          this.doSelectOption(optionDOM)
        }, this)
      )
    }

    _onWindowKeyDown(e) {
      e.stopPropagation()

      if (e.keyCode === 38 /* Up */) {
        e.preventDefault()
        this.doHighlightPrevOption()
      } else if (e.keyCode === 40 /* Down */) {
        e.preventDefault()
        this.doHighlightNextOption()
      } else if (e.keyCode === 13 /* Enter */) {
        e.preventDefault()
        this.doSelectHighlightOption()
      } else if (e.keyCode === 9 /* Tab */) {
        e.preventDefault()
      }
    }
  }
})
