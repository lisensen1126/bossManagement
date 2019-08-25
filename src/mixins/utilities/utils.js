export default {
  methods: {
    parseDistanc (distance) {
      if (distance < 1000) {
        return parseFloat(distance).toFixed(1) + 'm'
      } else {
        return distance / 1000 > 99 ? '99+km' : (distance / 1000).toFixed(1) + 'km'
      }
    },
    scaleImage (url, mode, width, height) {
      // imageMogr2/auto-orient,是为了解决ios图片倒置90度问题，后台如果要用imageMogr2压缩图片展示，就不需要这个参数了
      if (url.indexOf('?imageMogr2/auto-orient') > -1) {
        url = url.replace('?imageMogr2/auto-orient', '')
      }
      return `${url}?imageView2/${mode}/w/${width}/h/${height}`
    },
  },
}
