const files = require.context('.', true, /\.js$/)
const modules = {}

files.keys().forEach((key) => {
  if (key === './index.js' || /(types|actions|getters|mutations).js$/.test(key)) {
    return
  }
  /*
  regex to get filename w/o extension
    "/^(.*\/)|(\.js)/g"
  */
  modules[key.replace(/^(.*\/)|(\.js)/g, '')] = files(key).default
})

export default modules
