<template lang="pug">
  .editor
    vue-ueditor-wrap(v-model="content" :init="myInit" :config="config", :isDisabled="isDisabled" ref="editor")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'

import RichEditor from '@/components/generics/form/RichEditor'
import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module


export default {
  name: 'richTextFormat',
  mixins: [],
  components: {
    CustomInput,
    RichEditor,
    VueUeditorWrap
  },
  props: {
    isDisabled: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    value: String,
    toolbar: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  watch: {
    content: function (val) {
      this.$emit('input', val)
    },
  },
  data () {
    let host = window.location.host
    let root = 'http://platform.dev.chedianai.com/admin/v1/common/ueditor'
    if (host === 'p.chedianai.com') {
      root = 'http://platform.dev.chedianai.com/admin/v1/common/ueditor'
    }
    if (host === 'p.test.chedianai.com') {
      root = 'http://platform.dev.chedianai.com/admin/v1/common/ueditor'
    }
    return {
      config: {
        serverUrl: root,
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: 500,
        catchRemoteImageEnable: true,  //设置是否抓取远程图片
        //工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的重新定义
        toolbars: [[
         'fullscreen', 'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
             'fontfamily', 'fontsize', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
            'link', 'unlink',  '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
            'simpleupload', 'insertimage', 
            'horizontal', 'date', 'time', '|',
            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
        ]]
      },
      content: '', // 内容
      showIframe: false, // 秀米
    }
  },
  methods: {
    myInit () {
      this.$refs.editor.registerButton({
        name: 'xiumi',
        icon: 'https://oss1.chedianai.com/images/assets/xiumi-connect-icon.png',
        tip: 'xiumi',
        handler: (editor, name) => {
          // 点击自定义按钮事你需要做的事
          console.log('秀米', editor)
          console.log('秀米', name)
          let dialog = new UE.ui.Dialog({
              iframeUrl: 'static/UEditor/xiumi-ue-dialog-v5.html',
              editor   : editor,
              name     : 'xiumi-connect',
              title    : "秀米",
              cssRules : "width: " + (window.innerWidth - 60) + "px;" + "height: " + (window.innerHeight - 60) + "px;",
          });
          dialog.render();
          dialog.open();

        }
      })
    },
    // 父组件给子组件传值 
    info (val) {
      this.content = val
    },
  },
  created () {
  },
  mounted () {
    this.content = this.value ? this.value : ''
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
</style>