import moment from 'moment'

let locale = (window.navigator.languages && window.navigator.languages[0]) ||
                window.navigator.language ||
                window.navigator.userLanguage ||
                window.navigator.browserLanguage;
if (locale.includes('-')) {
  locale = locale.split('-')[0];
}

moment.locale(locale)

export default moment
