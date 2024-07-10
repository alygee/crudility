import axios from 'axios'
import Vue from 'vue'

/**
 * wrapper служит декторатором для вставки токена и префикса в запрос.
 * В самих запросах эти параметры не доступны так как теряется контекст Vue.
 * @param {string} path
 * @param {object} data
 * @returns {Promise<AxiosResponse<T>>}
 */
function requestWrapper (path, data = {}) {
  return axios
    .post(`/${Vue.prototype.$prefix}/${path}`, data, {
      headers: { 'X-Token-Header': Vue.prototype.$token }
    })
    .then((response) => {
      if (response.data.error) {
        throw new Error(response.data.error)
      } else {
        return response
      }
    })
}

export default {
  fetchSchema () {
    return requestWrapper('meta/schema')
  },

  fetchData (data) {
    return requestWrapper('query', data)
  },

  create (entityData) {
    return requestWrapper('create', entityData)
  },

  update (data) {
    return requestWrapper('update', data)
  },

  delete (data) {
    return requestWrapper('delete', data)
  }
}
