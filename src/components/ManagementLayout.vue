<template lang="pug">
  .columns.is-horizontal
    major-nav
    router-view.column.manage-layout
</template>

<script>
import MajorNav from './generics/MajorNav'

export default {
  name: 'ManagementLayout',
  components: {
    MajorNav,
  },
}
</script>

<style lang="stylus" scoped>
  .manage-layout
    overflow hidden
    background #f0f1f2
</style>
