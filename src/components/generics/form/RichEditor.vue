<template lang="pug">
  div
    quill-editor(v-model="content", :options="editorOption", @ready="onEditorReady($event)", @change="onEditorChange", v-if="!isDisabled")
    .default-editor(v-if="isDisabled", v-html="value")
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import fileUploader from '@/mixins/utilities/fileUploader'

export default {
  name: 'RichEditor',
  mixins: [fileUploader],
  components: {
    quillEditor,
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
  data () {
    return {
      isUploading: false,
      content: '',
      editor: {},
      editorOption: {
        placeholder: '请输入文字',
        modules: {
          toolbar: {
            container: [['image', ...this.toolbar]],
            handlers: {
              image: this.imageHandler,
            },
          },
        },
      },
    }
  },
  methods: {
    onEditorChange (content) {
      this.$emit('input', content.html)
    },
    onEditorReady (editor) {
      if (this.value) {
        this.content = this.value
      }
      this.editor = editor
    },
    imageHandler () {
      if (this.isUploading) {
        this.$store.dispatch('showMessage', {
          title: '警告',
          content: '图片正在上传',
        })
        return
      }
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.click()

      // Listen upload local image and save to server
      input.onchange = () => {
        const file = input.files[0]
        const maxSize = 5120 * 1024
        if (file.size > maxSize) {
          this.$store.dispatch('showMessage', {
            title: '图片尺寸太大',
            content: '允许的图片尺寸: 不超过5M',
          })
          // e.target.value = null
          return
        }
        // file type is only image.
        if (/^image\//.test(file.type)) {
          this.uploadImage(file, 'item')
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '图片格式不正确',
            content: '允许的图片格式：jpg, jpeg, png',
          })
        }
      }
    },
    insertToEditor (url) {
      // push image url to rich editor.
      const range = this.editor.getSelection()
      this.editor.insertEmbed((range && range.index || 1), 'image', url)
    },
    async uploadImage (file, type) {
      this.isUploading = true
      try {
        const { response, result } = await this._uploadImage(type, file)
        if (response.status === 200) {
          this.insertToEditor(result.data.image_url)
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '上传失败',
            content: `${response.status} ${result.message}`,
          })
        }
        this.isUploading = false
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '上传失败',
          content: `错误：${err}`,
        })
        this.isUploading = false
      }
    },
    info (val) {
      this.content = val
    },
  },
  mounted () {
  },
}
</script>

<style>
.quill-editor:not(.bubble) .ql-container,
.quill-editor:not(.bubble) .ql-container .ql-editor {
  height: 260px;
}
</style>

<style lang="stylus" scoped>
  .default-editor
    width 406px
    padding 12px 15px
    box-sizing border-box
    height 260px
    border 1px solid #ddd
    overflow-y scroll
</style>

<style lang="stylus">
  img
    width 100%
</style>


