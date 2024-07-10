import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'
import axios from "axios"
import isArray from 'lodash/isArray'
import concat from 'lodash/concat'
import router from './router'

Vue.config.productionTip = false


Vue.prototype.$getValues = function (data) {
  if (!isArray(data)) {
    data = concat(data.fields, data.medLnk, data.revFk, data.fk)
  }
  return data.map((item) => {
    return item ? item.title || item.name : ''
  })
}

Vue.prototype.$findValue = function (value, dataList) {
  if (!value) {
    return {}
  }

  let name, title
  return dataList.find((data) => {
    name = data.name ? data.name.toUpperCase() : ''
    title = data.title ? data.title.toUpperCase() : ''
    return [name, title].includes(value.toUpperCase())
  })
}

Vue.prototype.$prefix = 'crudility'
axios.defaults.headers.common['X-Token-Header'] = ''
Vue.prototype.$path = ''

new Vue({
  i18n,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
