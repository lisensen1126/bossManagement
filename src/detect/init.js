/* eslint no-unused-vars: "off" */

function init (BrowserInfo) {
  // XP 页面的文案
  var XPinfo = '<div class="reason-code reason-bigger-margin"><h3 class="reason-title">您还在使用 Window XP 系统，您的操作系统不安全 。</h3><p class="reason-detail">自 2014 年 4 月 8 日起，Microsoft 不再为 Windows XP 和 Internet Explorer 8 及以下版本提供相应支持和更新。如果你继续使用这些，你将可能受到病毒、间谍软件和其他恶意软件的攻击，无法确保个人信息的安全。请参阅 <a href="https://support.microsoft.com/zh-cn/help/14223/windows-xp-end-of-support">Microsoft 关于 Windows XP 支持已经结束的说明 。</a></p></div>'
  var NormalInfo = '<div class="reason-code"><h3 class="reason-title">为什么会出现这个页面？</h3><p class="reason-detail">如果你不知道升级浏览器是什么意思，请请教一些熟练电脑操作的朋友。如果你使用的不是IE6/7/8，而是360浏览器、QQ浏览器、搜狗浏览器等，出现这个页面是因为你使用的不是该浏览器的最新版本，升级至最新即可。</p></div>'
  var moreReasonDetailDom = document.getElementById('moreReasonDetail')

  if (moreReasonDetailDom) {
    moreReasonDetailDom.innerHTML = NormalInfo
    if (BrowserInfo && BrowserInfo.OSName === 'WinXP') {
      moreReasonDetailDom.innerHTML = XPinfo + NormalInfo
    }
  }

  // chrome 下载页面文案
  var chromeSettingStepsDom = document.getElementById('chromeSettingSteps')
  var ChromeWin7 = '<p class="suggesttion-step first-step">点击 Chrome 浏览器地址栏最右侧的 <span class="Chrome-menu"></span>  &nbsp;图标，打开设置。</p><div class="suggesttion-image chrome-step-one-win7"></div><p class="suggesttion-step second-step">找到默认浏览器选项，点击“设为默认搜索引擎”即完成设置。</p><div class="suggesttion-image chrome-step-two-win7"></div>'
  var ChromeWin8 = '<p class="suggesttion-step first-step">点击 Chrome 浏览器地址栏最右侧的 <span class="Chrome-menu"></span>  &nbsp;图标，打开设置。</p><div class="suggesttion-image chrome-step-one-win8"></div><p class="suggesttion-step second-step">找到默认浏览器选项，点击“设为默认搜索引擎”即完成设置。</p><div class="suggesttion-image chrome-step-two-win8"></div><p class="suggesttion-step third-step">在弹出的列表里选择 <span class="Chrome-small-icon"></span> &nbsp;Google Chrome 便完成了设置。</p><div class="suggesttion-image chrome-step-two-win8"></div>'
  var ChromeWin10 = '<p class="suggesttion-step first-step">点击 Chrome 浏览器地址栏最右侧的 <span class="Chrome-menu"></span>  &nbsp;图标，打开设置。</p><div class="suggesttion-image chrome-step-one-win10"></div><p class="suggesttion-step second-step">找到默认浏览器选项，点击“设为默认搜索引擎”即完成设置。</p><div class="suggesttion-image chrome-step-two-win10"></div><p class="suggesttion-step third-step">点击“Web 浏览器”下的 Microsoft Edge，选择 <span class="Chrome-small-icon"></span> &nbsp; Google Chrome。</p><div class="suggesttion-image chrome-step-two-win10"></div>'

  if (chromeSettingStepsDom) {
    switch (BrowserInfo.OSName) {
      case 'Win7':
        chromeSettingStepsDom.innerHTML = ChromeWin7
        break
      case 'Win8':
        chromeSettingStepsDom.innerHTML = ChromeWin8
        break
      case 'Win10':
        chromeSettingStepsDom.innerHTML = ChromeWin10
        break
    }
  }

  // 下载
  var downloadChromeBtn = document.getElementById('downloadChrome')
  var downloadFireFoxBtn = document.getElementById('downloadFireFox')
  var CHROMEX86 = 'http://oss1.chedianai.com/software/tools/ChromeStandaloneSetup.exe'
  var CHROMEX64 = 'http://oss1.chedianai.com/software/tools/ChromeStandaloneSetup64.exe'
  var FIREFOX64 = 'http://oss1.chedianai.com/software/tools/FirefoxSetup52.0.2x64.exe'
  var FIREFOX86 = 'http://oss1.chedianai.com/software/tools/FirefoxSetup52.0.2.exe'

  // 下载Chrome
  if (downloadChromeBtn) {
    // 区分系统是64位 还是32位
    if (BrowserInfo.cpuClass === 'x64') {
      // 64 位系统
      window.open(CHROMEX64, '_target')
      downloadChromeBtn.addEventListener('click', function () {
        window.open(CHROMEX64, '_target')
      }, false)
    } else if (BrowserInfo.cpuClass === 'x86') {
      // 32 位系统
      window.open(CHROMEX86, '_target')
      downloadChromeBtn.addEventListener('click', function () {
        window.open(CHROMEX86, '_target')
      }, false)
    }
  }

  // 下载FireFox
  if (downloadFireFoxBtn) {
    if (BrowserInfo.cpuClass === 'x64') {
      window.open(FIREFOX64, '_target')
      downloadFireFoxBtn.addEventListener('click', function () {
        window.open(FIREFOX64, '_target')
      }, false)
    } else if (BrowserInfo.cpuClass === 'x86') {
      window.open(FIREFOX86, '_target')
      downloadFireFoxBtn.addEventListener('click', function () {
        window.open(FIREFOX86, '_target')
      }, false)
    }
  }
}

