import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    ticketCategories: []
  },
  actions: {
    getTicketCategories({ commit, state }, projectId) {
      Vue.http
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
        Vue.http
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
      Vue.http
        .post(`/projects/${projectId}/project_ticket_categories`, category)
        .then(r => {
          dispatch('getTicketCategories', projectId)
        })
    },
    updateTicketCategory({ dispatch, commit, state }, { projectId, category }) {
      Vue.http
        .patch(`/projects/${projectId}/project_ticket_categories/${category.id}`, category)
        .then(r => {
          dispatch('getTicketCategories', projectId)
        })
    },
    deleteTicketCategory({ dispatch, commit, state }, { projectId, category }) {
      Vue.http
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