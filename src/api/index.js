import axios from "axios";
import Vue from "vue";
import mockServicesSchema from "../assets/mock/newSchema";
import mockServicesData from "../assets/mock/data";

/**
 * wrapper служит декторатором для вставки токена и префикса в запрос.
 * В самих запросах эти параметры не доступны так как теряется контекст Vue.
 * @param {string} path
 * @param {object} data
 * @returns {Promise<AxiosResponse<T>>}
 */
// eslint-disable-next-line no-unused-vars
function requestWrapper(path, data = {}) {
  return axios
    .post(`/${Vue.prototype.$prefix}/${path}`, data, {
      headers: { "X-Token-Header": Vue.prototype.$token }
    })
    .then(response => {
      if (response.data.error) {
        throw new Error(response.data.error);
      } else {
        return response;
      }
    });
}

export default {
  fetchSchema() {
    return Promise.resolve({
      data: mockServicesSchema
    });
  },

  fetchData() {
    return Promise.resolve({
      data: mockServicesData
    });
  },

  create(data) {
    return Promise.resolve({
      data: {
        entityName: data.entityName,
        entities: { data }
      }
    });
  },

  update(data) {
    return Promise.resolve({
      data: {
        entityName: data.entityName,
        entities: { data }
      }
    });
  },

  delete() {
    return Promise.resolve({ data: {} });
  }
};
