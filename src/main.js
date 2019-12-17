import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Lockr from 'lockr'
import Util from '@/libs/util'
import { loadLanguageAsync, i18n } from '@/lang'
import { LoadingBar, Button } from 'view-design'
import 'view-design/dist/styles/iview.css'

Vue.config.productionTip = false
Vue.component('Button', Button)

router.beforeEach((to, from, next) => {
  let lang
  lang = navigator.appName === 'Netscape' ? navigator.language : navigator.browserLanguage
  lang = lang.indexOf('en') > -1 ? 'en' : lang
  lang = lang.indexOf('zh-CN') > -1 ? 'zh' : lang
  lang = lang.indexOf('zh-TW') > -1 ? 'zh-TW' : lang
  lang = to.query.lang || lang
  let authorization = Lockr.get('authorization')
  let csrfToken = Lockr.get('X-XSRF-TOKEN')

  LoadingBar.start()
  Util.title(to.meta.title)

  if (!to.meta.isCheck) {
    loadLanguageAsync(lang).then(() => {
      if (to.meta.title && to.meta.title.indexOf('.') > -1) {
        Util.title(i18n.t(to.meta.title))
      }
      next()
    })
  } else if (authorization && csrfToken) {
    if (JSON.stringify(store.state.user) === '{}') {
      store.commit('setAuthorization', authorization)
      store.commit('setCsrfToken', csrfToken)
      store.commit('setLang', lang)
    }
    loadLanguageAsync(lang).then(() => {
      if (to.meta.title.indexOf('.') > -1) {
        Util.title(i18n.t(to.meta.title))
      }
      next()
    })
  } else {
    // 未登录跳转...
    /* next({
      name: 'login'
    }) */
  }
})

router.afterEach((to, from, next) => {
  LoadingBar.finish()
  window.scrollTo(0, 0)
})

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
