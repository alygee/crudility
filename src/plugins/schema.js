import Vue from 'vue'
import isArray from 'lodash/isArray'
import concat from 'lodash/concat'
import axios from 'axios'

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

Vue.prototype.$prefix = 'crudility/data'
axios.defaults.headers.common['X-Token-Header'] = ''
Vue.prototype.$path = ''

// const schema = {
//   install (Vue) {
//   }
// }
// Vue.use(schema)
