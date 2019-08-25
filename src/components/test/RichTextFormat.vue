<template lang="pug">
  .page
    .title 富文本吧
    .des 富文本的最大支持
    .content
      rich-editor(v-model="content", :toolbar="toolbar" ref="editor")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'

import RichEditor from '@/components/generics/form/RichEditor'

export default {
  name: 'richTextFormat',
  mixins: [],
  components: {
    CustomInput,
    RichEditor
  },
  data () {
    return {
      toolbar: [
        'bold', 'italic', 'underline', 'strike',        // toggled buttons
        'blockquote', 'code-block',
        {'header': 1}, {'header': 2},               // custom button values
        {'list': 'ordered'}, {'list': 'bullet'},
        {'script': 'sub'}, {'script': 'super'},      // superscript/subscript
        {'indent': '-1'}, {'indent': '+1'},          // outdent/indent
        {'direction': 'rtl'},                         // text direction
        {'size': ['small', false, 'large', 'huge']},  // custom dropdown
        {'header': [1, 2, 3, 4, 5, 6, false]},
        {'color': []}, {'background': []},          // dropdown with defaults from theme
        // {'font': []},
        {'align': []},
        'link', 'image', 'video',
        'clean'                                     // remove formatting button
      ],
      content: '',
    }
  },
  methods: {

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