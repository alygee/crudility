# Crudility

## О проекте

Проект является аналогом поиска в Jira через структурированные запросы на языке JQL (Jira Query Language).

Главный элемент проекта - поле ввода со сложной моделью зависимостей.

Подразумевалось, что проект будет представлять собой плагин/npm-пакет, который можно будет использовать в разных сборках и фреймворках. Поэтому предусмотрена возможность передать адаптер для изменений `location.query` в соответствии с рутингом фреймворка.

Проект выполнен на стеке JavaScript, Vue2 и создавался 2020 году.

## Пример инициализации плагина

```
import Vue from 'vue';
import Vuetify from 'vuetify';
import VueI18n from 'vue-i18n';

import { Crudility } from 'crudility/Crudility.umd';
import 'crudility/Crudility.css';
import '@mdi/font/css/materialdesignicons.css';
import RouteAdapter from './RouteAdapter';

Vue.use(Vuetify);
Vue.use(VueI18n);

let vue;

Vue.prototype.$prefix = 'bo/api/v1/crudility';
Vue.prototype.$token = this.AuthService.getToken();
Vue.prototype.$path = this.$location
  .absUrl()
  .replace(this.$location.url(), this.$location.path());

vue = new Vue({
  vuetify: new Vuetify({
    icons: { iconfont: 'mdi' },
  }),
  i18n: new VueI18n({ locale: 'ru' }),
  render: (createElement) =>
    createElement('v-app', [
      createElement(Crudility, {
        props: {
          routeAdapter: new RouteAdapter(this.$location, this.$scope),
        },
        style: {
          '--primary-color': '#00985f',
          '--wrapper-margin': '30px',
        },
      }),
    ]),
});
vue.$mount('#crudility');
```

## Project dev setup

```
npm install
npm run serve
```
