  /* eslint no-unused-vars: "off" */

  function detect () {
    // var nVer = navigator.appVersion
    var nAgt = navigator.userAgent
    var browserName = navigator.appName
    var fullVersion = '' + parseFloat(navigator.appVersion)
    var majorVersion = parseInt(navigator.appVersion, 10)
    var nameOffset, verOffset, ix
    var browserInfo = {
      browserName: '',
      fullVersion: '',
      majorVersion: '',
      OSName: '',
      isPassed: true,
      next: '',
      cpuClass: 'x86',
    }

    // In Opera, the true version is after 'Opera' or after 'Version'
    if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
      browserName = 'Opera'
      fullVersion = nAgt.substring(verOffset + 6)
      if ((verOffset = nAgt.indexOf('Version')) !== -1) fullVersion = nAgt.substring(verOffset + 8)
    } else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) {
      // In MSIE, the true version is after 'MSIE' in userAgent
      browserName = 'Microsoft Internet Explorer'
      fullVersion = nAgt.substring(verOffset + 5)
    } else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
      // In Chrome, the true version is after 'Chrome'
      browserName = 'Chrome'
      fullVersion = nAgt.substring(verOffset + 7)
    } else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
      // In Safari, the true version is after 'Safari' or after 'Version'
      browserName = 'Safari'
      fullVersion = nAgt.substring(verOffset + 7)
      if ((verOffset = nAgt.indexOf('Version')) !== -1) fullVersion = nAgt.substring(verOffset + 8)
    } else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
      // In Firefox, the true version is after 'Firefox'
      browserName = 'Firefox'
      fullVersion = nAgt.substring(verOffset + 8)
    } else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
      // In most other browsers, 'name/version' is at the end of userAgent
      browserName = nAgt.substring(nameOffset, verOffset)
      fullVersion = nAgt.substring(verOffset + 1)
      if (browserName.toLowerCase() === browserName.toUpperCase()) {
        browserName = navigator.appName
      }
    }

    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(';')) !== -1) {
      fullVersion = fullVersion.substring(0, ix)
    }
    if ((ix = fullVersion.indexOf(' ')) !== -1) {
      fullVersion = fullVersion.substring(0, ix)
    }

    majorVersion = parseInt('' + fullVersion, 10)
    if (isNaN(majorVersion)) {
      fullVersion = '' + parseFloat(navigator.appVersion)
      majorVersion = parseInt(navigator.appVersion, 10)
    }

    var OSName = 'Unknown OS'
    if (navigator.appVersion.indexOf('Win') !== -1) {
      OSName = 'Windows'
      if (navigator.userAgent.toLowerCase().indexOf('win64') !== -1) {
        browserInfo.cpuClass = 'x64'
      }
      if (navigator.appVersion.indexOf('Windows NT 5.1') !== -1) {
        OSName = 'WinXP'
      }
      if (navigator.appVersion.indexOf('Windows NT 10.0') !== -1) {
        OSName = 'Win10'
      }
      if (navigator.appVersion.indexOf('Windows NT 6.2') !== -1) {
        OSName = 'Win8'
      }
      if (navigator.appVersion.indexOf('Windows NT 6.1') !== -1) {
        OSName = 'Win7'
      }
    }
    if (navigator.appVersion.indexOf('Mac') !== -1) {
      OSName = 'MacOS'
    }
    if (navigator.appVersion.indexOf('X11') !== -1) {
      OSName = 'UNIX'
    }
    if (navigator.appVersion.indexOf('Linux') !== -1) {
      OSName = 'Linux'
    }
    browserInfo.browserName = browserName
    browserInfo.fullVersion = fullVersion
    browserInfo.majorVersion = majorVersion
    browserInfo.OSName = OSName

    // console.log('Browser name  = ' + browserName)
    // console.log('Full version  = ' + fullVersion)
    // console.log('Major version  = ' + majorVersion)
    // console.log('navigator.appName  = ' + navigator.appName)
    // console.log('navigator.userAgent  = ' + navigator.userAgent)
    // console.log('navigator.appVersion  = ' + navigator.appVersion)
    // console.log('Your OS: ' + OSName)

    switch (OSName) {
      case 'WinXP':
        if (browserName !== 'Firefox') {
          // 跳转至firefox下载页面
          browserInfo.isPassed = false
          browserInfo.next = './legasy.html'
        } else {
          if (majorVersion !== 52) {
            // 跳转至firefox下载页面
            browserInfo.isPassed = false
            browserInfo.next = './legasy.html'
          }
        }
        break
      case 'Win10':
      case 'Win8':
      case 'Win7':
        if (browserName !== 'Chrome') {
          // 跳转至chrome页面
          browserInfo.next = './browser.html'
          browserInfo.isPassed = false
        } else {
          if (majorVersion < 56) {
            // 直接跳转chrome页面
            browserInfo.next = './browser.html'
            browserInfo.isPassed = false
          }
        }
        break
    }
    return browserInfo
  }
