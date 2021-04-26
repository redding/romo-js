Romo.define('Romo.UI.SelectDropdown.OptionsList', function() {
  return class {
    constructor(options, { selectedValue } = {}) {
      if (!Array.isArray(options)) {
        throw new Error(
          'TypeError: expected an Array of option Objects; ' +
          `given ${typeof options}: ${options}`
        )
      }

      this.options = options
      this.selectedValue = selectedValue
      this.highlightValue = selectedValue || (options[0] && options[0].value)
    }

    get dom() {
      return Romo.memoize(this, 'dom', function() {
        return this._bindDOM()
      })
    }

    get html() {
      return Romo.memoize(this, 'html', function() {
        return this._buildHTML()
      })
    }

    // private

    _bindDOM() {
      const dom = Romo.dom(Romo.elements(this.html))

      dom
        .find('li.option:not(.disabled)')
        .on('click', Romo.bind(this._onClick, this))
        .on('mouseenter', Romo.bind(this._onMouseEnter, this))

      return dom
    }

    _onClick(e) {
      const liDOM = Romo.dom(e.target).closest('li')

      this.dom.find('li').removeClass('selected')
      liDOM.addClass('selected')
      liDOM.trigger(
        'Romo.UI.SelectDropdown.OptionsList:optionClicked',
        [liDOM]
      )
    }

    _onMouseEnter(e) {
      this.dom.find('li').removeClass('highlight')
      Romo.dom(e.target).closest('li').addClass('highlight')
    }

    _buildHTML() {
      var html = []
      var currentGroupLabel

      Romo.array(this.options).forEach(Romo.bind(function(option) {
        if (!('value' in option)) {
          throw new Error(
            'TypeError: expected an option Object; ' +
            `given ${typeof option}: ${option}`
          )
        }

        if (
          (currentGroupLabel || option.groupLabel) &&
          option.groupLabel !== currentGroupLabel
        ) {
          html.push(this._buildOptgroupHTML(option.groupLabel))
          currentGroupLabel = option.groupLabel
        }
        html.push(this._buildOptionHTML(option, currentGroupLabel))
      }, this))

      return `<ul data-romo-ui-select-dropdown-options-list>${html.join('')}</ul>`
    }

    _buildOptionHTML(option, currentGroupLabel) {
      var cssClasses = ['option']
      if (currentGroupLabel) {
        cssClasses.push('in-optgroup')
      }
      if (option.value === this.selectedValue) {
        cssClasses.push('selected')
      }
      if (option.value === this.highlightValue) {
        cssClasses.push('highlight')
      }
      if (option.disabled) {
        cssClasses.push('disabled')
      }

      const dataPropertiesHTML =
        Object
          .keys(option)
          .map(function(key) {
            return `data-option-${key}="${option[key]}"`
          })
          .join(' ')

      return `
<li class="${cssClasses.join(' ')}" ${dataPropertiesHTML}>
  ${option.label || option.value}
</li>
`
    }

    _buildOptgroupHTML(groupLabel) {
      return `<li class="optgroup">${groupLabel}</li>`
    }
  }
})
