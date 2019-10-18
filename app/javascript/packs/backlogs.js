import Vue from 'vue'
import VueI18n from 'vue-i18n'
import store from '../stores/backlogs'
import VueRouter from 'vue-router';
import BacklogsPage from '../pages/BacklogsPage'

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('content')
  const projectId = rootElement.dataset.projectId
  Vue.use(VueRouter)
  Vue.use(VueI18n)

  const router = new VueRouter({
    routes: [
      {
        path: '/stories/new',
        component: BacklogsPage,
        meta: {
          newStory: true,
          projectId: projectId
        }
      },
      {
        path: '/stories/:storyId',
        component: BacklogsPage,
        meta: {
          newStory: false,
          projectId: projectId
        }
      },
      {
        path: '*',
        component: BacklogsPage,
        meta: {
          newStory: false,
          projectId: projectId
        }
      },
    ]
  })

  let locale = (window.navigator.languages && window.navigator.languages[0]) ||
                  window.navigator.language ||
                  window.navigator.userLanguage ||
                  window.navigator.browserLanguage;
  if (locale.includes('-')) {
    locale = locale.split('-')[0];
  }

  const i18n = new VueI18n({
    locale: locale,
    messages: require('../i18n/globals.json')
  })

  const app = new Vue({
    i18n,
    router,
    store,
    el: "#content",
    render: h => h(BacklogsPage)
  });
})