export default {
  methods: {
    scaleImage (url, mode, width, height) {
      // imageMogr2/auto-orient,是为了解决ios图片倒置90度问题，后台如果要用imageMogr2压缩图片展示，就不需要这个参数了
      if (url.indexOf('?imageMogr2/auto-orient') > -1) {
        url = url.replace('?imageMogr2/auto-orient', '')
      }
      return `${url}?imageView2/${mode}/w/${width}/h/${height}`
    },
  },
}
