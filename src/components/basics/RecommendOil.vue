<template lang="pug">
  .section-layout.contentss
    .section-filter.is-horizontal.section-filter-none
    .content-wrapper.list-wrapper.table-data(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td 配图
          tbody(v-if="list.length")
            tr(v-for="(customer, index) in list")
              td
                .field.is-horizontal.image-super
                  upload-pic(v-model="customer.pic", img-type="customer.pic", :img-id="index", is-original=true, :need-default="is_not")
    div.tip 注：1.建议上传尺寸为375x147的jpg/png格式文件，文件不能超过1M。
    .btn-wrapper
      .button-group
        a.button.primary.large(@click="saveData") 保存
</template>

<script>
  import EmptyPage from '@/components/generics/EmptyPage'
  import UploadPic from '@/components/generics/form/UploadPic'
  import AdminApi from '@/mixins/modules/basics'
  export default {
    name: 'RecommendOil',
    mixins: [AdminApi],
    components: {
      EmptyPage,
      UploadPic,
    },
    data () {
      return {
        is_not: false,
        list: [{
          pic: '',
        }],
      }
    },
    methods: {
      async saveData () {
        if (!this.list[0].pic) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '请上传图片',
          })
          return
        }
        let params = {
          pic: this.list[0].pic,
        }
        try {
          const { response, result } = await this.saveOilApi({
            data: params,
          })
          if (response.status === 200) {         // 分开判断
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '保存成功',
              })
              this.getData()
            } else {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '保存失败',
                content: `${response.status} ${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '保存失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: `错误：${err}`,
          })
        }
      },
      async getData () {
        try {
          const {response, result} = await this.oilDetailApi()
          if (response.status === 200) {
            this.list = [{
              pic: result.data.pic ? result.data.pic : 'https://oss1.chedianai.com/defalut-change-oil.png',
            }]
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取详情出错',
              content: `出错啦！错误码：${response.status}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取详情失败',
            content: `出错啦！错误码：${err}`,
          })
        }
      },
    },
    mounted () {
      this.getData()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';

  .list-wrapper {
    padding-bottom: 120px !important;
  }

  .section-layout {
    padding: 0 !important;
  }

  .contentss {
    height: calc(100% - 30px);
  }

  .table-data {
    height: calc(100% - 50px) !important;
  }

  .section-filter-none.is-horizontal {
    height: 0;
    padding: 0;
  }

  .section-filter .add-button {
    bottom: initial;
  }

  .section-layout {
    position: relative;
    padding-top: 0;

    .add-button {
      position: absolute;
      right: 40px;
      top: 0;
      z-index: 22;
    }
  }

  table td {
    vertical-align: middle;
  }

  .cuselct {
    width: 345px;
    margin-top: 5px;
  }

  .emp {
    margin-top: 40px;
  }

  .upc {
    width: 73px;
    height: 32px;
  }

  .content {
    display: flex;
    justify-content: start;
  }
  .tip {
    position: fixed;
    bottom: 60px;
    padding: 0 40px 0;
    white-space: nowrap;
    font-size: 14px;
    color: rgb(255, 0, 0);
  }
  .pp {
    position: relative;
  }

  .haha, .add-icon, .category-icon {
    display: inline-flex;
    width: 16px;
    height: 16px;
    background: url('~@/assets/icons/button-add.svg') no-repeat center center;
    background-size: cover;
    margin-right: 6px;
    margin-top: 8px;
  }

  .category-icon {
    background-image: url('~@/assets/icons/button-catrgory.svg');
  }

  .page-selector {
    label {
      z-index: 5;
    }
  }

  .right-box {
    display: flex;
    position: absolute;
    bottom: 20px;
    right: 30px;
  }

  .xi {
    align-self: flex-end;
  }

  .bian {
    height: 16px;
    font-size: 13px;
    font-family: MicrosoftYaHei;
    color: rgba(47, 171, 221, 1);
    line-height: 16px;
    padding-right: 17px;
    margin-right: 0;
  }

  .del {
    padding-left: 17px;
    color: rgba(235, 78, 56, 1) !important;
    border-left: 1px solid rgba(0, 0, 0, 0.08);
  }

  .button {
    padding: 0 10px;
  }

  .btn-wrapper {
    margin-top: 20px;
    padding-right: 70px;
    text-align: right;
    text-align: right;
    position: fixed;
    bottom: 40px;
    right: 0;
    padding: 23px 40px 0;

    .large {
      width: 120px;
    }
  }

  .username {
    line-height: 36px;
  }

  .button-import:hover a {
    position: relative;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
    color: #121212;
    top: -1px;
  }

  .subFile {
    width: 74px;
    height: 32px;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }

  .position-relative {
    position: relative;
  }

  .upload-pic.is-normal, .field.is-horizontal {
    width: 200px !important;
    height: 113px !important;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .tr-p {
    position: relative;
  }

  .up, .down {
    position: absolute;
    top: 100px;
    width: 20px;
    height: 30px;
    opacity: 0.5;
    cursor: pointer;

    &.is-disable {
      opacity: 0.2;
      pointer-events: none;
    }

    &:hover {
      opacity: 1;
    }
  }

  .up {
    left: 0;
    background: center no-repeat url('~@/assets/icons/move-up.svg');
    background-size: 20px 30px;
  }

  .down {
    left: 25px;
    background: center no-repeat url('~@/assets/icons/move-down.svg');
    background-size: 20px 30px;
  }

  .delete {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 16px;
    height: 16px;
    background: center no-repeat url('~@/assets/icons/trash.svg');
    cursor: pointer;
  }

  .operation-link {
    position: relative;
    margin-right: 10px;
  }

  .setting-block {
    position: absolute;
    top: -28px;
    left: 30px;
    background: #f0f1f2;
    z-index: 1000;
    width: 110px;
    box-sizing: border-box;
    border-radius: 2px;

    li {
      color: #999;
      padding: 10px;
      line-height: 12px;
      font-size: 12px;
    }

    li:hover {
      background: #ffc723;
      color: white;
    }
  }
</style>

