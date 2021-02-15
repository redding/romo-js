Romo.define('Romo.UI.IndicatorTextInput.Wrapper', function() {
  return class {
    constructor({
      indicatorTextInputDOM,
      cssClass,
    } = {}) {
      this.indicatorTextInputDOM = indicatorTextInputDOM
      this.cssClass = cssClass || ''
    }

    get dom() {
      return Romo.memoize(this, 'dom', function() {
        return this._bind()
      })
    }

    get template() {
      return `
<div class="${this.cssClass}"
     data-romo-ui-indicator-text-input-wrapper>
</div>
`
    }

    // private

    _bind() {
      const dom = Romo.dom(Romo.elements(this.template))

      this.indicatorTextInputDOM.before(dom)
      dom.firstElement.appendChild(this.indicatorTextInputDOM.firstElement)
      Romo.childElementSet.add(this.indicatorTextInputDOM, [dom])

      return dom
    }
  }
})
