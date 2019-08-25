<template lang="pug">
  .slide-layout
    .cus-box
      .slide-title 项目详情
      .field-group
        .field
          label.label 项目名称：
          span {{project.name}}
        .field
          label.label 更换里程：
          span {{project.exchange_mile}}
        .field
          label.label 检测里程：
          span {{project.inspect_mile}}
        .field
          label.label 项目提示：
          span {{project.tip}}
        .field
          label.label 检测点：
          span {{project.point.toString() | empty}}
        .field
          label.label 异常问题：
          span {{project.exception.toString() | empty}}
        .field
          label.label 异常建议：
          span {{project.suggest.toString() | empty}}
</template>

<script>
export default {
  name: 'VehicleDetailModel',
  mixins: [],
  components: {
  },
  props: {
    project: {
      type: Object,
      default: {},
    }
  },
  data () {
    return {
    }
  },
  methods: {
  },
  mounted () {
  },
}
</script>

<style lang="stylus" scoped>
.label
  font-size 15px
  color #333333
  font-weight 600
span
  font-size 13px
  color #999999
</style>
