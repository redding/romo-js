Romo.reloadPage =
  function() {
    window.location.reload()
  }

Romo.redirectPage =
  function(redirectUrl) {
    window.location = redirectUrl
  }

Romo.showBannerAlert =
  function(bannerAlert) {
    Romo.config.alert.showBannerAlertFn(bannerAlert)
  }

Romo.showToastAlert =
  function(toastAlert) {
    Romo.config.alert.showToastAlertFn(toastAlert)
  }
