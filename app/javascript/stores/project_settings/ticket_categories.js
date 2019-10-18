import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

axios.defaults.headers['X-CSRF-TOKEN'] = $('meta[name=csrf-token]').attr('content')
axios.defaults.headers.common['Accept'] = 'application/json'

export default {
  namespaced: true,
  state: {
    ticketCategories: []
  },
  actions: {
    getTicketCategories({ commit, state }, projectId) {
      axios
        .get(`/projects/${projectId}/project_ticket_categories`)
        .then(r => r.data)
        .then(ticketCategories => {
          commit('SET_TICKET_CATEGORIES', ticketCategories)
        })
        .catch((error) => {
          reject(error)
        })
    },
    getTicketCategory({ commit, state }, { projectId, categoryId }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/projects/${projectId}/project_ticket_categories/${categoryId}`)
          .then(r => r.data)
          .then(category => {
            resolve(category)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    createTicketCategory({ dispatch, commit, state }, { projectId, category }) {
      axios
        .post(`/projects/${projectId}/project_ticket_categories`, category)
        .then(r => {
          dispatch('getTicketCategories', projectId)
        })
    },
    updateTicketCategory({ dispatch, commit, state }, { projectId, category }) {
      axios
        .patch(`/projects/${projectId}/project_ticket_categories/${category.id}`, category)
        .then(r => {
          dispatch('getTicketCategories', projectId)
        })
    },
    deleteTicketCategory({ dispatch, commit, state }, { projectId, category }) {
      axios
        .delete(`/projects/${projectId}/project_ticket_categories/${category.id}`)
        .then(r => {
          dispatch('getTicketCategories', projectId)
        })
    }
  },
  mutations: {
    SET_TICKET_CATEGORIES (state, ticketCategories) {
      state.ticketCategories = ticketCategories
    }
  }
}