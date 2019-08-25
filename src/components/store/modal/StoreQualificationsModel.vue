<template lang="pug">
  .control
    transition-group(tag="div", name="qualification")
      .qualification-bar(v-for="(list, index) in value",)
        .image-upload
          upload-img-model(v-model="list.image_url", img-type="store", :has-second-action="false", @other="delImg", :is-disabled="list.isReadonly")
        .detail
          .title 资质名称
          .action
            .input-bg
              custom-input(v-model="list.title", placeholder="请输入资质名称", :validator="validator.$each[index].title", error-info="请输入资质名称", maxlength=10, :is-disabled="list.isReadonly")
            .del-icon(@click="delConfirm(index)", v-if="!list.isReadonly")
    .add-qualification(@click="addQualification", v-if="value.length < limit") 添加门店资质
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import uploadImgModel from '@/components/store/modal/uploadImgModel'
export default {
  name: 'StoreQualificationsModel',
  components: {
    CustomInput,
    uploadImgModel,
  },
  props: {
    value: {
      type: Array,
      default: [],
    },
    limit: Number,
    validator: {
      type: Object,
      default: null,
    },
  },
  data () {
    return {
      delClickable: true,
      isUploading: false,
    }
  },
  methods: {
    delImg (url) {
      const index = this.value.findIndex(qualification => qualification.image_url === url)
      this.value[index].image_url = ''
    },
    addQualification () {
      this.value.push({
        title: '',
        image_url: '',
        isReadonly: false,
      })
    },
    delConfirm (index) {
      this.$store.dispatch('showMessage', {
        type: 'warning',
        title: '确认',
        content: '确认要删除该资质？',
        isRejectable: 1,
        resolve: () => {
          this.delAction(index)
        },
      })
    },
    delAction (index) {
      this.value.splice(index, 1)
      this.$emit('input', this.value)
    },
    uploadImg (e, index) {},
  },
}
</script>


<style lang="stylus" scoped>
@import '~@/stylus/mixins';

.qualification-enter-active, .qualification-leave-active {
  transition: all 0.2s;
}

.qualification-enter, .qualification-leave-to {
  opacity: 0;
}

.qualification-bar {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  margin-bottom: 16px;
  position: relative;

  &:last-child {
    margin-bottom: 0;

    &::after {
      display: none;
    }
  }

  &::after {
    display: block;
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 400px;
    height: 1px;
    background: rgba(0, 0, 0, 0.08);
  }
}

.image-upload {
  margin-right: 16px;
  width: 88px;
  height: 88px;
}

.detail {
  display: flex;
  flex-direction: column;

  .title {
    color: #666;
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 6px;
  }

  .action {
    display: flex;
    flex-direction: row;
    align-items: center;

    .input-bg {
      width: 296px;
      margin-right: 16px;
    }

    .del-icon {
      width: 16px;
      height: 16px;
      background: getImage('trash.svg') no-repeat;
      cursor: pointer;
    }
  }
}

.add-qualification {
  position: relative;
  height: 24px;
  line-height: 24px;
  font-size: 13px;
  color: #353535;
  padding-left: 32px;

  &::before, &::after {
    display: block;
    content: '';
    width: 24px;
    height: 24px;
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
  }

  &::before {
    background: #ffbb29;
    border-radius: 50%;
    box-shadow: 0 1px 3px 0 rgba(0, 0 0, 0.08);
    z-index: 2;
  }

  &::after {
    width: 10px;
    height: 10px;
    top: 50%;
    left: 7px;
    transform: translateY(-50%);
    background: getImage('plus-l.svg') center center no-repeat;
    z-index: 4;
  }
}
</style>
