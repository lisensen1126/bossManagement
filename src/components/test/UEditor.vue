<template lang="pug">
  .page
    .title 百度秀米
    .des 为了支持秀米
    //- .content
      //- rich-editor(v-model="content", :toolbar="toolbar" ref="editor")
    .content
      vue-ueditor-wrap(v-model="content" :init="myInit" :config="config" ref="editor")

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
  data () {
    return {
      config: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: '100%',
        catchRemoteImageEnable: true,  //设置是否抓取远程图片
        //工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的重新定义
        toolbars: [[
         'fullscreen', 'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            // 'rowspacingtop', 'rowspacingbottom', 'lineheight', '|','customstyle', 'paragraph',
             'fontfamily', 'fontsize', '|',
            // 'directionalityltr', 'directionalityrtl', 'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
            'link', 'unlink',  '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
            'simpleupload', 'insertimage', 
            //  'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe','webapp', 'anchor',
            //  'insertcode',  'pagebreak', 'template', 'background', '|','emotion','spechars''snapscreen', 'wordimage', 
            'horizontal', 'date', 'time', '|',
            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
            // 'print', 'preview', 'searchreplace', 'drafts', 'help'
        ]]
      },
      content: '',
      showIframe: false,
    }
  },
  methods: {
    myInit () {
      this.$refs.editor.registerButton({
        name: 'xiumi',
        icon: 'http://xiumi.us/connect/ue/xiumi-connect-icon.png',
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
    }
  },
  created () {
    
  },
  mounted () {
   
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.page
  margin 20px
  padding 30px
  background #fff
  .title
    font-size 18px
    line-height 2
    color: #333
  .des
    font-size 14px
    line-height 1
    color: #888
  .content
    margin-top: 20px
</style>