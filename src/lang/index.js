import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from 'view-design/dist/locale/en-US'
import zh from 'view-design/dist/locale/zh-CN'
import zhTW from 'view-design/dist/locale/zh-TW'
import axios from 'axios'

Vue.use(VueI18n)
Vue.locale = () => {}

export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    zh: Object.assign(require('@/lang/zh'), zh),
    en: Object.assign(require('@/lang/en'), en),
    'zh-TW': Object.assign(require('@/lang/zh-TW'), zhTW)
  }
})

const loadedLanguages = ['en', 'zh', 'zh-TW'] /* default language */
const setingLanguages = ['en', 'zh', 'zh-TW']

function setI18nLanguage (lang) {
  i18n.locale = lang
  axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync (lang) {
  if (i18n.locale !== lang) {
    if (!loadedLanguages.includes(lang)) {
      if (setingLanguages.includes(lang)) {
        return import(`@/lang/${lang}`).then(msgs => {
          i18n.setLocaleMessage(lang, Object.assign(msgs, lang))
          loadedLanguages.push(lang)
          return setI18nLanguage(lang)
        })
      } else {
        return Promise.resolve(lang)
      }
    }
    return Promise.resolve(setI18nLanguage(lang))
  }
  return Promise.resolve(lang)
}
