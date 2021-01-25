Romo.define('Romo.UI.Form.Values', function() {
  return class {
    constructor(formDOM, { includeFiles } = {}) {
      this.formDOM = formDOM
      this.includeFiles = includeFiles || false
    }

    static dataSet(formDOM, { includeFiles } = {}) {
      return (new this(formDOM, { includeFiles: includeFiles })).dataSet
    }

    static formData(formDOM, { includeFiles } = {}) {
      return (new this(formDOM, { includeFiles: includeFiles })).formData
    }

    get dataSet() {
      return Romo.memoize(this, 'dataSet', function() {
        return this._buildDataSet()
      })
    }

    get formData() {
      return Romo.memoize(this, 'formData', function() {
        return this._buildFormData()
      })
    }

    // private

    _buildDataSet() {
      var dataSet = {}

      // Build dataSet object from the form element's inputs.
      // { "inputName1": "inputValue1",
      //   "inputName2[]": ["inputValue1", "inputValue2"],
      //   ...
      // }
      Romo
        .array(this.formDOM.firstElement.elements)
        .forEach(Romo.bind(function(input) {
          if (this._isAFormValueInput(input)) {
            if (dataSet[input.name] === undefined) {
              // Use a Set to ensure only building unique value sets.
              dataSet[input.name] = new Set()
            }

            if (input.nodeName.toLowerCase() === 'select') {
              Romo.array(input.options).filter(function(option) {
                return option.selected
              }).forEach(function(selectedOption) {
                dataSet[input.name].add(selectedOption.value)
              })
            } else if (input.type === 'file') {
              Array.prototype.forEach.call(input.files, function(file) {
                dataSet[input.name].add(file)
              })
            } else if (input.type === 'checkbox') {
              // Only accumulate checkbox values if they are designated as an
              // Array value (e.g. name="widget_ids[]").
              if (!input.name.match(/.+\[\]$/g)) {
                dataSet[input.name].clear()
              }
              dataSet[input.name].add(input.value)
            } else {
              dataSet[input.name].add(input.value)
            }
          }
        }, this))

      for (var key in dataSet) {
        // Convert Set values to Arrays
        dataSet[key] = Array.from(dataSet[key])

        // Remove the array from any single item values.
        if (dataSet[key].length === 1) {
          dataSet[key] = dataSet[key][0]
        }
      }

      return dataSet
    }

    _buildFormData() {
      const formData = new FormData()

      for (var name in this.dataSet) {
        Romo.array(this.dataSet[name]).forEach(function(value) {
          formData.append(name, value)
        })
      }

      return formData
    }

    /* eslint-disable no-multi-spaces */
    _isAFormValueInput(input) {
      return (
        input.nodeName.toLowerCase() !== 'fieldset'   &&
        input.name                                    &&
        !input.disabled                               &&
        input.type !== 'submit'                       &&
        input.type !== 'reset'                        &&
        input.type !== 'button'                       &&
        (this.includeFiles || input.type  !== 'file') &&
        (input.checked || (input.type !== 'radio' && input.type !== 'checkbox'))
      )
    }
    /* eslint-enable no-multi-spaces */
  }
})
