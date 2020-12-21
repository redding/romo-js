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
  function(romoFlashAlerts) {
    Romo.alert(
      Romo
        .array(romoFlashAlerts)
        .map(function(romoFlashAlert) { return romoFlashAlert.toString() })
        .join('\n')
    )
  }
