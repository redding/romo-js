if (window.Romo === undefined) {
  window.Romo = {}
}

// A generic class to centralize global Romo configurtion and allow for easily
// overriding and extending the configurtion seettings. All values are called
// "just in time"; they can be overridden at any time and will immediately take
// effect.
//
// Extend the configuration API with e.g.:
//   Romo.config.my_api = new RomoConfig()
//   Romo.config.my_api.value = 'some value'
class RomoConfig {}
Romo.config = new RomoConfig()
Romo.config.alert = new RomoConfig()
Romo.config.form = new RomoConfig()
Romo.config.xhr = new RomoConfig()

// Default configuration; override as needed/desired.

// Alert

Romo.config.alert.showAlertFn =
  function(alertMessage, { debugMessage } = {}) {
    if (alertMessage && alertMessage.length !== 0) {
      var message = alertMessage

      if (debugMessage && debugMessage.length !== 0) {
        message += `:\n${debugMessage}`
      }
      console.error(message)
    }
  }

Romo.config.alert.showAlertAndReloadPageFn =
  function(alertMessage, { debugMessage } = {}) {
    Romo.config.alert.showAlertFn(alertMessage, { debugMessage: debugMessage })
    Romo.reloadPage()
  }

Romo.config.alert.showFlashAlertsFn =
  function(romoFlashAlerts) {
    Romo.alert(
      Romo
        .array(romoFlashAlerts)
        .map(function(romoFlashAlert) { return romoFlashAlert.toString() })
        .join('\n')
    )
  }

// Form

Romo.config.form.addValidationErrorMessagesFn =
  function(formDOM, messages) {
    console.error(
      'NotImplementedError: override ' +
      'Romo.config.form.addValidationErrorMessagesFn with a custom ' +
      'function that adds validation error messages to form input markup.'
    )
  }

Romo.config.form.removeValidationErrorMessagesFn =
  function(formDOM) {
    console.error(
      'NotImplementedError: override ' +
      'Romo.config.form.removeValidationErrorMessagesFn with a custom ' +
      'function that removes validation error messages from form input markup.'
    )
  }

// XHR

Romo.config.xhr.isSuccessStatusCode =
  function(statusCode) {
    return (statusCode >= 200 && statusCode < 300) || statusCode === 304
  }

Romo.config.xhr.showErrorAlertFn =
  function(romoXMLHttpRequest, { debugMessage } = {}) {
    Romo.alert('An error occurred.', { debugMessage: debugMessage })
  }

Romo.config.xhr.showErrorAlertAndReloadPageFn =
  function(romoXMLHttpRequest, { debugMessage } = {}) {
    Romo.config.xhr.showErrorAlertFn(
      romoXMLHttpRequest,
      { debugMessage: debugMessage },
    )
    Romo.reloadPage()
  }