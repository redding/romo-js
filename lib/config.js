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
Romo.config.frames = new RomoConfig()
Romo.config.localTime = new RomoConfig()
Romo.config.popovers = new RomoConfig()
Romo.config.tooltips = new RomoConfig()
Romo.config.xhr = new RomoConfig()

// Default configuration; override as needed/desired.

// Alert

Romo.config.alert.showBannerAlertFn =
  function(bannerAlert) {
    if (bannerAlert) {
      console.error(bannerAlert)
    }
  }

Romo.config.alert.showToastAlertFn =
  function(toastAlert) {
    if (toastAlert) {
      console.error(toastAlert)
    }
  }

// Form

Romo.config.form.addErrorMessagesFn =
  function(formDOM, messages) {
    console.error(
      'NotImplementedError: override ' +
      'Romo.config.form.addErrorMessagesFn with a custom ' +
      'function that adds validation error messages to form input markup.'
    )
  }

Romo.config.form.removeErrorMessagesFn =
  function(formDOM) {
    console.error(
      'NotImplementedError: override ' +
      'Romo.config.form.removeErrorMessagesFn with a custom ' +
      'function that removes validation error messages from form input markup.'
    )
  }

// Frames

Romo.config.frames.defaultSpinnerHeightPxFn =
  function(frameDOM) {
    return 45
  }

// LocalTime

Romo.config.localTime.applyDateTagDefaultsFn =
  function(romoLocalTime) {
    romoLocalTime.setDOMDataDefault('year-format', 'numeric')
    romoLocalTime.setDOMDataDefault('month-format', 'numeric')
    romoLocalTime.setDOMDataDefault('day-format', 'numeric')
  }

Romo.config.localTime.applyTimeTagDefaultsFn =
  function(romoLocalTime) {
    romoLocalTime.setDOMDataDefault('hour-format', 'numeric')
    romoLocalTime.setDOMDataDefault('minute-format', 'numeric')
    if (
      romoLocalTime.timeZone &&
      romoLocalTime.timeZone !== romoLocalTime.class.defaultTimeZone
    ) {
      romoLocalTime.setDOMDataDefault('time-zone-name-format', 'short')
    }
  }

// Popovers

Romo.config.popovers.defaultModalVerticalPositionViewportPercentageFn =
  function() {
    return 0.0
  }

Romo.config.popovers.defaultPadPxFn =
  function() {
    return 10
  }

Romo.config.popovers.dropdownSpacingPxFn =
  function() {
    return 2
  }

Romo.config.popovers.headerSpacingPxFn =
  function() {
    return 10
  }

Romo.config.popovers.footerSpacingPxFn =
  function() {
    return 10
  }

Romo.config.popovers.popoverFormEditableContentCSSClassFn =
  function() {
    return ''
  }

Romo.config.popovers.popoverFormEditableContentHoverCSSClassFn =
  function() {
    return ''
  }

// Tooltip

Romo.config.tooltips.defaultPadPxFn =
  function() {
    return 10
  }

Romo.config.tooltips.headerSpacingPxFn =
  function() {
    return 10
  }

Romo.config.tooltips.footerSpacingPxFn =
  function() {
    return 10
  }

// XHR

Romo.config.xhr.isSuccessStatusCode =
  function(statusCode) {
    return (statusCode >= 200 && statusCode < 300) || statusCode === 304
  }

Romo.config.xhr.showBannerAlertFn =
  function(xhrResponse) {
    Romo.showBannerAlert(xhrResponse.bannerAlert)
  }

Romo.config.xhr.showToastAlertsFn =
  function(xhrResponse) {
    Romo.array(xhrResponse.toastAlerts).forEach(function(toastAlert) {
      Romo.showToastAlert(toastAlert)
    })
  }
