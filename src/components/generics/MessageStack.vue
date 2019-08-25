<template lang="pug">
  .message-center
    message-modal(v-for="(message, index) in messages", :key="index", :message="message")
</template>

<script>
import MessageModal from './MessageModal'

export default {
  name: 'MessageStack',
  components: {
    MessageModal,
  },
  data () {
    return {
      messages: this.$store.getters.messageStack,
    }
  },
}
</script>
