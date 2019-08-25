// import { $fetch } from '@/plugins/Fetch'
import store from '@/vuex/store'

const interval = 30000

const poll = async () => {
  try {
    // const {response, result} = await $fetch('audio_notifications')
    // if (response.status === 200) {
    //   const {messages, audios} = result.data.reduce((data, info) => {
    //     data.messages.push({
    //       content: info.text,
    //       time: new Date(info.created_at.replace(/-/g, '/')),
    //     })
    //     data.audios.push(info.audio)
    //     return data
    //   }, {
    //     messages: [],
    //     audios: [],
    //   })
    let messages = []
    let audios = []
    store.dispatch('notify', messages)
    store.dispatch('broadcast', audios)
    // }
  } catch (e) {
    console.error('[Notifier] error: fail to fetch', e)
  }
  setTimeout(poll, interval)
}

export default {
  install () {
    // start notification polling
    poll()
  },
}
