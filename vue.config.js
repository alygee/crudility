const prefixer = require('postcss-prefix-selector');

module.exports = {
  transpileDependencies: [
    "vuetify"
  ],
  devServer: {
    proxy: 'http://localhost:46251'
    // proxy: 'http://bo/bo/api/v1/'
  },
  chainWebpack: config => {
    config.module
    .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
        .loader('@kazupon/vue-i18n-loader')
        .end()
    config.module
    .rule("images")
      .use("url-loader")
        .loader("url-loader")
        .tap(options => Object.assign(options, { limit: Infinity }));
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          prefixer({
            prefix: '.crudility',
            transform: function (prefix, selector, prefixedSelector) {
              if (['html', 'body', '*'].includes(selector)
                || selector.startsWith('.v-main')
                || selector.startsWith('.v-application')
                || selector.startsWith('.v-dialog')) {
                return selector;
              } else {
                return prefixedSelector;
              }
            }
          })
        ]
      }
    }
  }
}