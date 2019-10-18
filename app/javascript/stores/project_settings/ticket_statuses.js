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
    ticketStatuses: []
  },
  actions: {
    getTicketStatuses({ commit, state }, projectId) {
      axios
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
        axios
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
      axios
        .patch(`//projects/${projectId}/project_ticket_statuses`)
        .then(r => r.data)
        .then(ticketStatus => {
          dispatch('getTicketStatuses', projectId)
        })
    },
    createTicketStatus({ dispatch, commit, state }, { projectId, status }) {
      axios
        .post(`/projects/${projectId}/project_ticket_statuses`, status)
        .then(r => {
          dispatch('getTicketStatuses', projectId)
        })
    },
    updateTicketStatus({ dispatch, commit, state }, { projectId, status }) {
      axios
        .patch(`/projects/${projectId}/project_ticket_statuses/${status.id}`, status)
        .then(r => {
          dispatch('getTicketStatuses', projectId)
        })
    },
    deleteTicketStatus({ dispatch, commit, state }, { projectId, status }) {
      axios
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