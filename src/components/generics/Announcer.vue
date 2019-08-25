<template lang="pug">
  audio.announcer(ref='player', autoplay, :src="currentPiece", @ended="removeCurrentPiece" @error="removeCurrentPiece")
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Announcer',
    computed: {
      ...mapGetters({
        playlist: 'playlist',
      }),
      currentPiece () {
        return this.playlist[0]
      },
    },
    methods: {
      ...mapActions([
        'removeBroadcast',
      ]),
      async removeCurrentPiece () {
        if (this.currentPiece) {
          await this.removeBroadcast(this.currentPiece)
          this.$nextTick(() => this.currentPiece && this.$refs.player.play())
        }
      },
    },
  }
</script>

<style lang="stylus" scoped>
.announcer
  display none
</style>

