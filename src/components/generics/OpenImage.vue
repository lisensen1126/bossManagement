<!--图片放大组件-->
<template lang="pug">
  .open-image-box
    .open-show-pics
      img(v-if="imgType=='1' && isOriginal",:style="{'width':miniWidth+'px','height':miniHeight+'px','margin-bottom':marginBottom+'px','margin-right':marginRight+'px','border-radius':borderRadius+'px'}", @click="enlargePic(imgList)",:src="imgList")
      img(v-if="imgType=='1' && !isOriginal",:style="{'width':miniWidth+'px','height':miniHeight+'px','margin-bottom':marginBottom+'px','margin-right':marginRight+'px','border-radius':borderRadius+'px'}", @click="enlargePic(imgList)",:src="scaleImage(imgList, 1, miniWidth, miniHeight)")
      img(v-if="imgType != '1' && isOriginal",:style="{'width':miniWidth+'px','height':miniHeight+'px','margin-bottom':marginBottom+'px','margin-right':marginRight+'px','border-radius':borderRadius+'px'}", v-for="(item,index) in imgList", @click="enlargePic(item, index)",:src="(imgType==3 ? item[keyName] : item)")
      img(v-if="imgType != '1' && !isOriginal",:style="{'width':miniWidth+'px','height':miniHeight+'px','margin-bottom':marginBottom+'px','margin-right':marginRight+'px','border-radius':borderRadius+'px'}", v-for="(item,index) in imgList", @click="enlargePic(item, index)",:src="(imgType==3 ? scaleImage(item[keyName], 1, miniWidth, miniHeight) : scaleImage(item, 1, miniWidth, miniHeight))")
    .open-modal-box(v-if="open_modal_pic")
      img.close-open-image(src="../../assets/openImage/open-image-close.png",@click="closeModal()")
      .open-modal-pane
        .open-inner-box
          .left-arrow-pic(v-if="leftArrow", @click="enlargePic(imgList[positionPic-1],positionPic-1)")
            img.icon-chakantupian-zuo(src="../../assets/openImage/open-image-left.png")
          .middle-pics-box
            img(:src="middel_pic")
          .right-arrow-pic(v-if="rightArrow", @click="enlargePic(imgList[positionPic+1],positionPic+1)")
            img.icon-chakantupian-you(src="../../assets/openImage/open-image-right.png")
</template>

<script>
import imageScale from '@/mixins/utilities/imageScale'
export default {
  /**
   * 图片放大组件
   * 使用说明：
   * 1.在页面里先引入组件：import OpenImage from '@/components/generics/OpenImage'
   * 2.注入components里面注入组件：OpenImage
   * 3.在html部分写入组件标签名,写上相应的属性，img-type和img-url必须写
   *    例：open-image(img-type="1",:img-url="testArray1",key-name="picUrl",mini-width="100",mini-height="100",margin-bottom="0", margin-right="0", border-radius="0")
   *         open-image(img-type="2",:img-url="testArray2",key-name="picUrl",mini-width="100",mini-height="100",margin-bottom="0", margin-right="0", border-radius="0")
   *         open-image(img-type="3",:img-url="testArray3",key-name="picUrl",mini-width="100",mini-height="100",margin-bottom="0", margin-right="0", border-radius="0")
   *
   *         testArray1: 'https://oss1.chedianai.com/images/item/15392301563003.jpg',
   *         testArray2: ['https://oss1.chedianai.com/images/item/15392301563003.jpg', 'https://oss1.chedianai.com/images/item/15343342586112.png'],
   *         testArray3: [{picUrl: 'https://oss1.chedianai.com/images/item/15392301563003.jpg'},{picUrl: 'https://oss1.chedianai.com/images/item/15343342586112.png'},],
   * 4.属性名释义：
   *    (1) img-type释义：
   *       1：传入了一张图片的url；
   *       2:传入了一维数组['***.png','***.png','***.png']；
   *       3：传入了数组对象格式的数组[{'imgUrl':'***.jpg'},{'imgUrl':'***.png'},{'imgUrl':'***.jpg'},]
   *   （2）img-url：被放大的图片数组名
   *   （3）key-name：被放大的图片数组的每一项的键值名
   *   （4）mini-width：图片的宽度
   *   （5）mini-height：图片的高度
   *   （6）margin-bottom：每张图片之间的底边距
   *   （7）margin-right：每张图片之间的右边距
   *   （8）border-radius：每张图片的圆角
   *   （9）isOriginal： 是否展示原图（非压缩）
   */
  name: 'OpenImage',
  mixins: [imageScale],
  props: {
    /** imgType释义：
     *  1：传入了一张图片的url；
     *  2:传入了一维数组['***.png','***.png','***.png']；
     *  3：传入了数组对象格式的数组[{'url':'***.jpg'},{'url':'***.png'},{'url':'***.jpg'},]
     */
    imgType: {
      type: [String, Number],
      default: '2',
    },
    miniWidth: {
      type: [String, Number],
      default: '30px',
    },
    miniHeight: {
      type: [String, Number],
      default: '30',
    },
    marginBottom: {
      type: [String, Number],
      default: '8',
    },
    marginRight: {
      type: [String, Number],
      default: '8',
    },
    borderRadius: {
      type: [String, Number],
      default: '5',
    },
    imgUrl: {
      type: [String, Array],
      default: () => {
        return []
      },
    },
    keyName: {
      type: String,
    },
    isOriginal: {
      type: Boolean,
      default () {
        return false
      },
    },
  },
  data () {
    return {
      leftArrow: false, // 左箭头
      rightArrow: false, // 右箭头
      open_modal_pic: false, // 图片放大flag
      middel_pic: '', // 当前被放大的图片url
      positionPic: 0, // 当前被放大的图片序号
      imgList: this.imgUrl, // 图片数组
    }
  },
  methods: {
    enlargePic (item, index) {
      let self = this
      self.leftArrow = false
      self.rightArrow = false
      if (parseInt(self.imgType) === 1) {
        self.middel_pic = item
        self.open_modal_pic = true
      } else {
        if (self.imgList.length >= 2 && index > 0) {
          self.leftArrow = true
        }
        if (self.imgList.length >= 2 && index < self.imgList.length - 1) {
          self.rightArrow = true
        }
        self.open_modal_pic = true
        if (parseInt(self.imgType) === 2) {
          self.middel_pic = item || ''
        } else if (parseInt(self.imgType) === 3) {
          self.middel_pic = (self.keyName ? item[self.keyName] : item.imgUrl) || ''
        }
        self.positionPic = index || 0
      }
    },
    closeModal () {
      let self = this
      self.open_modal_pic = false
      self.middel_pic = ''
    },
  },
  mounted () {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import '../../stylus/mixins'
.open-image-box
  position: relative
  width: 100%
  height: auto
  .open-show-pics
    .bg-cover{
      object-fit cover
      object-position center
    }
    img{
      width: 80px
      height: 80px
      border 0
      border-radius: 5px
      margin-right: 6px
      margin-bottom: 10px
      cursor: pointer
      box-shadow: 0 1px 4px 0 rgba(0,0,0,0.15)
    }
  .open-modal-box
    position: fixed
    z-index: 9999
    left: 0
    right: 0
    top: 0
    bottom: 0
    background: rgba(255,255,255,0.9)
    overflow: auto
    .close-open-image
      position: fixed
      width: 40px
      height: 40px
      right: 20px
      top: 12px
      text-align: center
      line-height: 40px
      color: #bbb
      cursor: pointer
      z-index: 99991
      .iconfont
        font-size: 40px
      &:hover
        color: #2976ea
    .open-modal-pane
      .open-inner-box
        display: flex
        margin: 40px auto
        position: relative
        align-content: center
        .middle-pics-box
          max-width: 1010px
          margin: 0 auto
          min-height: calc( 100vh - 80px )
          display: flex
          justify-content: center
          align-items: center
          img
            max-width: 1010px
            display: block
.left-arrow-pic
  position: fixed
  top:50%
  left:25px
  margin-top: -70px
  font-size: 56px
  cursor: pointer
  width: 55px
  height: 122px
  text-align: center
  line-height: 122px
  border-top-right-radius: 4px
  border-bottom-right-radius: 4px
  color: #fff
  img
    width 100%
.right-arrow-pic
  position: fixed
  top:50%
  right: 25px
  font-size: 56px
  margin-top: -70px
  cursor: pointer
  width: 55px
  height: 122px
  text-align: center
  line-height: 122px
  border-top-left-radius: 4px
  border-bottom-left-radius: 4px
  color: #fff
  img
    width 100%

</style>
