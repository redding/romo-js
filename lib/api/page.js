Romo.reloadPage =
  function() {
    window.location.reload()
  }

Romo.redirectPage =
  function(redirectUrl) {
    window.location = redirectUrl
  }

Romo.alert =
  function(alertMessage, { debugMessage } = {}) {
    Romo.config.alert.showAlertFn(alertMessage, {
      debugMessage: debugMessage,
    })
  }

Romo.alertAndReloadPage =
  function(alertMessage, { debugMessage } = {}) {
    Romo.config.alert.showAlertAndReloadPageFn(alertMessage, {
      debugMessage: debugMessage,
    })
  }

Romo.showFlashAlerts =
  function(romoFlashAlerts) {
    Romo.config.alert.showFlashAlertsFn(romoFlashAlerts)
  }
