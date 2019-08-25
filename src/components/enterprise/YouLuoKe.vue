<template lang="pug">
  div.content
    you-tab.topnav(:enterpriseName="enterpriseName" :enterpriseId="enterpriseId")
    router-view
</template>

<script>
  import YouTab from '@/components/generics/YouluokeTab'
  export default {
    name: 'youLuoKe',
    components: {
      YouTab,
    },
    data () {
      return {
        enterpriseName: '',
        enterpriseId: '',
      }
    },
    mounted () {
      this.enterpriseName = this.$route.query.enterpriseName
      this.enterpriseId = this.$route.query.enterpriseId
    },
  }
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.content
  height calc(100% - 56px)
.topnav
  display: flex;
  flex: 0 0 48px;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 48px;
  padding-left: 64px;
  padding-right: 64px;
  background-color: #fcfcfc;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,.08);
  z-index: 8;
</style>


