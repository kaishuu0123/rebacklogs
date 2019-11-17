import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

axios.defaults.headers['X-CSRF-TOKEN'] = $('meta[name=csrf-token]').attr('content')

const getDefaultState = () => {
  return {
    assignee: {
      selected: null,
      assignees: []
    },
    projectTicketStatus: {
      selected: null,
      statuses: []
    },
    projectTicketCategory: {
      selected: null,
      categories: []
    },
    projectTags: {
      selected: [],
      tags: []
    }
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  actions: {
    getAssignees({ commit, state }, { projectId }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/projects/${projectId}/users`)
          .then(result => {
            let assignees = [
              {
                id: null,
                username: 'Unassigned'
              }
            ]
            commit('SET_ASSIGNEES', assignees.concat(result.data))
            resolve(assignees.concat(result.data))
          })
      })
    },
    updateAssignee({ commit, state }, { projectId, ticketType, ticketId }) {
      let ticket = {
        id: ticketId,
        assignee_id: state.assignee.selected.id
      }

      axios
        .patch(`/projects/${projectId}/${ticketType}/${ticketId}`, ticket)
        .then(result => {
          if (ticketType === 'stories') {
            commit('Stories/SET_SELECTED_STORY', result.data, { root: true })
          } else {
            commit('Tickets/SET_SELECTED_TASK', result.data, { root: true })
          }
        })
    },
    updateAssigneeForTask({ dispatch, commit, state }, { projectId, ticketType, ticketId, assigneeId }) {
      let ticket = {
        id: ticketId,
        assignee_id: assigneeId
      }

      axios
        .patch(`/projects/${projectId}/${ticketType}/${ticketId}`, ticket)
        .then(result => {
          this.dispatch('getStoriesWithTasks', {root: true})
        })
    },
    getProjectTicketStatuses({ commit, state }, { projectId }) {
      axios
        .get(`/projects/${projectId}/project_ticket_statuses`)
        .then(result => {
          commit('SET_PROJECT_TICKET_STATUSES', result.data)
        })
    },
    updateProjectTicketStatus({ commit, state }, { projectId, ticketType, ticketId }) {
      let ticket = {
        id: ticketId,
        project_ticket_status_id: state.projectTicketStatus.selected.id
      }

      axios
        .patch(`/projects/${projectId}/${ticketType}/${ticketId}`, ticket)
        .then(result => {
          if (ticketType === 'stories') {
            commit('Stories/SET_SELECTED_STORY', result.data, { root: true })
          } else {
            commit('Tasks/SET_SELECTED_TASK', result.data, { root: true })
          }
        })
    },
    getProjectTicketCategories({ commit, state }, { projectId }) {
      axios
        .get(`/projects/${projectId}/project_ticket_categories`)
        .then(result => {
          commit('SET_PROJECT_TICKET_CATEGORIES', result.data)
        })
    },
    updateProjectTicketCategory({ commit, state }, { projectId, ticketType, ticketId }) {
      let ticket = {
        id: ticketId,
        project_ticket_category_id: state.projectTicketCategory.selected.id
      }

      axios
        .patch(`/projects/${projectId}/${ticketType}/${ticketId}`, ticket)
        .then(result => {
          if (ticketType === 'stories') {
            commit('Stories/SET_SELECTED_STORY', result.data, { root: true })
          } else {
            commit('Tasks/SET_SELECTED_TASK', result.data, { root: true })
          }
        })
    },
    updateTicketPoint({ commit, state }, { projectId, ticketType, ticketId, point }) {
      const ticket = {
        point: point
      }

      axios
        .patch(`/projects/${projectId}/${ticketType}/${ticketId}`, ticket)
        .then(result => {
          if (ticketType === 'stories') {
            commit('Stories/SET_SELECTED_STORY', result.data, { root: true })
          } else {
            commit('Tasks/SET_SELECTED_TASK', result.data, { root: true })
          }
        })
    },
    getProjectTags({ commit, state }, { projectId }) {
      axios
        .get(`/projects/${projectId}/project_tags`)
        .then(result => {
          commit('SET_PROJECT_TAGS', result.data)
        })
    },
    createComment({ commit, state }, { projectId, ticketType, ticketId, commentBody }) {
      const comment = {
        ticket_id: ticketId,
        body: commentBody
      }

      return new Promise((resolve, reject) => {
        axios
          .post(`/projects/${projectId}/${ticketType}/${ticketId}/comments`, comment)
          .then((result) => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      });
    },
    deleteComment({ commit, state }, { projectId, ticketType, ticketId, commentId }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/projects/${projectId}/${ticketType}/${ticketId}/comments/${commentId}`)
          .then((result) => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      });
    }
  },
  mutations: {
    SET_ASSIGNEES (state, assignees) {
      state.assignee.assignees = assignees
    },
    SET_ASSIGNEE (state, assignee) {
      state.assignee.selected = assignee
    },
    SET_PROJECT_TICKET_STATUSES (state, projectTicketStatuses) {
      state.projectTicketStatus.statuses = projectTicketStatuses
    },
    SET_PROJECT_TICKET_STATUS (state, projectTicketStatus) {
      state.projectTicketStatus.selected = projectTicketStatus
    },
    SET_PROJECT_TICKET_CATEGORIES (state, projectTicketCategories) {
      state.projectTicketCategory.categories = projectTicketCategories
    },
    SET_PROJECT_TICKET_CATEGORY (state, projectTicketCategory) {
      state.projectTicketCategory.selected = projectTicketCategory
    },
    SET_PROJECT_TAGS (state, projectTags) {
      state.projectTags.tags = projectTags
    },
    SET_PROGJECT_TAG (state, projectTag) {
      // Array
      state.projectTags.selected = projectTag
    },
    RESET_TICKET_ATTRIBUTES (state) {
      Object.assign(state, getDefaultState())
    }
  }
}