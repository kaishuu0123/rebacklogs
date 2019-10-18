import Vue from 'vue'
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import store from '../stores/project_settings'
import ProjectSettingsPage from '../pages/ProjectSettingsPage'
import GeneralSettingsPage from '../pages/ProjectSettings/GeneralSettingsPage'
import GroupManagementsPage from '../pages/ProjectSettings/GroupManagementsPage'
import TicketCategories from '../pages/ProjectSettings/TicketCategories'
import TicketStatuses from '../pages/ProjectSettings/TicketStatuses'

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('content')
  const projectId = rootElement.dataset.projectId
  Vue.use(VueRouter)
  Vue.use(VueI18n)

  const router = new VueRouter({
    routes: [
      {
        name: 'GroupManagement',
        path: '/group_managements',
        component: GroupManagementsPage,
        meta: {
          newTask: true,
          projectId: projectId
        }
      },
      {
        name: 'TicketCategories',
        path: '/ticket_categories',
        component: TicketCategories,
        meta: {
          newTask: true,
          projectId: projectId
        }
      },
      {
        name: 'AddTicketCategory',
        path: '/ticket_categories/new',
        component: TicketCategories,
        meta: {
          showModal: true,
          projectId: projectId
        }
      },
      {
        name: 'EditTicketCategory',
        path: '/ticket_categories/:id',
        component: TicketCategories,
        meta: {
          showModal: true,
          projectId: projectId
        }
      },
      {
        name: 'TicketStatuses',
        path: '/ticket_statuses',
        component: TicketStatuses,
        meta: {
          newTask: true,
          projectId: projectId
        }
      },
      {
        name: 'AddTicketStatus',
        path: '/ticket_statuses/new',
        component: TicketStatuses,
        meta: {
          showModal: true,
          projectId: projectId
        }
      },
      {
        name: 'EditTicketStatus',
        path: '/ticket_statuses/:id',
        component: TicketStatuses,
        meta: {
          showModal: true,
          projectId: projectId
        }
      },
      {
        path: '*',
        component: GeneralSettingsPage,
        meta: {
          newTask: false,
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
    render: h => h(ProjectSettingsPage)
  });
})