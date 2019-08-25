/* Mandarin locals for flatpickr */
var Flatpickr
Flatpickr = Flatpickr || { l10ns: {} }
Flatpickr.l10ns.zh = {}

Flatpickr.l10ns.zh.weekdays = {
  shorthand: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  longhand: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
}

Flatpickr.l10ns.zh.months = {
  shorthand: ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月'],
  longhand: ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月'],
}

Flatpickr.l10ns.zh.rangeSeparator = ' 至 '

if (typeof module !== 'undefined') {
  module.exports = Flatpickr.l10ns
}
