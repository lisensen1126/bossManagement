import Vue from 'vue'

// events used across the whole app
export const events = {
  // window resize event
  resize: 'evtResize',
  // app wide notify event
  notify: 'evtNotify',
  // event on modal creation / destruction
  modalChange: 'evtModalChange',
  // event on modal creation / destruction
  navChange: 'evtNavChange',
  // collapse data pickers
  collapseDataPickers: 'evtCollapseDataPickers',
  // body clicked
  bodyClick: 'evtBodyClick',
}

// event hub for message transmission between components
export const hub = new Vue({
  data: {
    events,
    _global: null,
  },
})

// plugin
export default {
  install (Vue) {
    // staggered window resizing
    let resizingTimeout
    let resizingEvent
    window.addEventListener('resize', evt => {
      resizingEvent = evt
      if (!resizingTimeout) {
        resizingTimeout = setTimeout(() => {
          hub.$emit(events.resize, resizingEvent)
          resizingTimeout = null
          resizingEvent = null
        }, 100)
      }
    })
    document.body.addEventListener('click', evt => hub.$emit(events.bodyClick, evt), false)

    // register $hub on Vue
    Vue.prototype.$hub = hub
  },
}
