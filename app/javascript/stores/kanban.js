import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Stories from './stories'
import Tasks from './tasks'
import Tickets from './tickets'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sprintId: null,
    selectedTask: null,
    stories: [],
    projectTicketStatuses: [],
    isLoading: false
  },
  actions: {
    getStoriesWithTasks ({ commit }) {
      Vue.http
        .get(`/projects/${this.state.projectId}/sprints/${this.state.sprintId}/kanban/api`)
        .then(r => r.data)
        .then(data => {
          commit('SET_STORIES', data)
        })
    },
    getProjectTicketStatuses ({ commit }) {
      return new Promise((resolve, reject) => {
        Vue.http
          .get(`/projects/${this.state.projectId}/project_ticket_statuses`)
          .then(r => r.data)
          .then(data => {
            commit('SET_PROJECT_TICKET_STATUSES', data)
            resolve(data)
          })
      })
    },
    updateTaskByDrag ({ commit }, { from, to, taskId }) {
      const task = {
        project_id: this.state.projectId,
        story_id: to.storyId,
        project_ticket_status_id: to.statusId,
        row_order_position: to.newIndex
      }

      Vue.http
        .patch(`/projects/${this.state.projectId}/tasks/${taskId}`, task)
        .then(r => r.data)
        .then(data => {
          this.dispatch('getStoriesWithTasks')
        })
    }
  },
  mutations: {
    SET_PROJECT_ID(state, projectId) {
      state.projectId = projectId
    },
    UNSET_PROJECT_ID(state, projectId) {
      state.projectId = null
    },
    SET_SPRINT_ID(state, sprintId) {
      state.sprintId = sprintId
    },
    UNSET_SPRINT_ID(state, sprintId) {
      state.sprintId = null
    },
    SET_STORIES (state, stories) {
      state.stories = stories
    },
    SET_PROJECT_TICKET_STATUSES (state, statuses) {
      state.projectTicketStatuses = statuses
    },
    SET_SELECTED_TASK (state, task) {
      state.selectedTask = task
    },
    SET_IS_LOADING (state, isLoading) {
      state.isLoading = isLoading
    }
  },
  modules: {
    Stories,
    Tasks,
    Tickets
  }
})