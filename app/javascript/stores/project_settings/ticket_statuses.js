import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    ticketStatuses: []
  },
  actions: {
    getTicketStatuses({ commit, state }, projectId) {
      Vue.http
        .get(`/projects/${projectId}/project_ticket_statuses`)
        .then(r => r.data)
        .then(ticketStatuses => {
          commit('SET_TICKET_STATUSES', ticketStatuses)
        })
        .catch((error) => {
          reject(error)
        })
    },
    getTicketStatus({ commit, state }, { projectId, statusId }) {
      return new Promise((resolve, reject) => {
        Vue.http
          .get(`/projects/${projectId}/project_ticket_statuses/${statusId}`)
          .then(r => r.data)
          .then(status => {
            resolve(status)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    updateTicketStatus({ dispatch, commit, state }, { projectId, status }) {
      Vue.http
        .patch(`//projects/${projectId}/project_ticket_statuses`)
        .then(r => r.data)
        .then(ticketStatus => {
          dispatch('getTicketStatuses', projectId)
        })
    },
    createTicketStatus({ dispatch, commit, state }, { projectId, status }) {
      Vue.http
        .post(`/projects/${projectId}/project_ticket_statuses`, status)
        .then(r => {
          dispatch('getTicketStatuses', projectId)
        })
    },
    updateTicketStatus({ dispatch, commit, state }, { projectId, status }) {
      Vue.http
        .patch(`/projects/${projectId}/project_ticket_statuses/${status.id}`, status)
        .then(r => {
          dispatch('getTicketStatuses', projectId)
        })
    },
    deleteTicketStatus({ dispatch, commit, state }, { projectId, status }) {
      Vue.http
        .delete(`/projects/${projectId}/project_ticket_statuses/${status.id}`)
        .then(r => {
          dispatch('getTicketStatuses', projectId)
        })
    }
  },
  mutations: {
    SET_TICKET_STATUSES (state, ticketStatuses) {
      state.ticketStatuses = ticketStatuses
    }
  }
}