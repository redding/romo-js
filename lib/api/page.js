Romo.reloadPage =
  function() {
    window.location.reload()
  }

Romo.redirectPage =
  function(redirectUrl) {
    window.location = redirectUrl
  }

Romo.alert =
  function(alertMessage, { debugMessage, callbackFn } = {}) {
    Romo.showAlert(alertMessage, debugMessage)

    if (callbackFn) {
      callbackFn()
    }
  }

Romo.alertAndReloadPage =
  function(alertMessage, { debugMessages } = {}) {
    Romo.alert(
      alertMessage,
      {
        debugMessages: debugMessages,
        callbackFn:    function() { Romo.reloadPage() },
      },
    )
  }

// Override as desired.
Romo.showAlert =
  function(alertMessage, debugMessage) {
    if (alertMessage.length !== 0) {
      var message = alertMessage

      if (debugMessage) {
        message += `:\n${debugMessage}`
      }
      console.error(message)
    }
  }

// Override as desired.
Romo.showFlashAlerts =
  function(romoFlashAlerts) {
    Romo.alert(
      Romo
        .array(romoFlashAlerts)
        .map(function(romoFlashAlert) { return romoFlashAlert.toString() })
        .join('\n')
    )
  }
