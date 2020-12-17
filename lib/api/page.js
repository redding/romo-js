Romo.reloadPage =
  function() {
    window.location.reload()
  }

Romo.redirectPage =
  function(redirectUrl) {
    window.location = redirectUrl
  }

// Override as desired.
Romo.alert =
  function(alertMessage, { debugMessages, callbackFn } = {}) {
    var message = alertMessage
    var debugs = Romo.array(debugMessages)

    if (debugMessages && debugs.length !== 0) {
      message += `:\n${debugs.join('\n')}`
    }

    console.error(message)

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
Romo.showFlashAlerts =
  function(flashAlertObjects) {
    Romo.alert(
      Romo
        .array(flashAlertObjects)
        .map(function(flashAlertObject) {
          return new Romo.FlashAlert(flashAlertObject)
        })
        .filter(function(flashAlert) {
          return flashAlert.isMessagePresent
        })
        .map(function(flashAlert) {
          return flashAlert.toString()
        })
        .join('\n')
    )
  }
