// 时间戳转时间
function date (input, formatMode, country) {
  function formatTimeWithMode (time, mode, CTRY) {
    const date = new Date((time - 0) * 1000)
    const cnWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    const enWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const shortCnWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const shortEnWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    mode = mode.replace(/y{1,4}|MM|dd|hh|HH|mm|ss|E{1,4}/g, function (value) {
      switch (value) {
        case 'MM':
          // return date.getMonth() + 1
          return date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        case 'dd':
          return date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        case 'hh':
          return (date.getHours() - 12).toString().padStart(2, '0')
        case 'HH':
          return date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        case 'mm':
          return date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        case 'ss':
          return date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        default:
          if (value.indexOf('y') !== -1) {
            const year = date.getFullYear()
            return value.length <= 2 ? year % 100 : year
          } else {
            const week = date.getDay()
            const weekMap = CTRY === 'cn'
              ? [shortCnWeek[week], cnWeek[week]]
              : [shortEnWeek[week], enWeek[week]]
            return value.length <= 2 ? weekMap[0] : weekMap[1]
          }
      }
    })
    return mode
  }
  if (!input) {
    return ''
  } else if (typeof input === 'number' || input instanceof Date) {
    if (input instanceof Date) {
      input = input.getTime()
    }
    if (typeof formatMode === 'string') {
      return formatTimeWithMode(input, formatMode, country)
    } else {
      return input
    }
  } else {
    return input
  }
}

function empty (input) {
  if (input === '') {
    return '--'
  } else {
    return input
  }
}
module.exports = {
  install (Vue, options) {
    Vue.filter('date', date)
    Vue.filter('empty', empty)
    Vue.prototype.easyFilter = {
      date,
      empty,
    }
  }}
