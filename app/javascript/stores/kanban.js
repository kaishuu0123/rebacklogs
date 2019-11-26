import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Stories from './stories'
import Tasks from './tasks'
import Tickets from './tickets'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

axios.defaults.headers.common['Accept'] = 'application/json'

export default new Vuex.Store({
  state: {
    sprintId: null,
    selectedTask: null,
    stories: [],
    projectTicketStatuses: []
  },
  actions: {
    getStoriesWithTasks ({ commit }) {
      axios
        .get(`/projects/${this.state.projectId}/sprints/${this.state.sprintId}/kanban/api`)
        .then(r => r.data)
        .then(data => {
          commit('SET_STORIES', data)
        })
    },
    getProjectTicketStatuses ({ commit }) {
      return new Promise((resolve, reject) => {
        axios
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

      axios
        .patch(`/projects/${this.state.projectId}/tasks/${taskId}`, task)
        .then(r => r.data)
        .then(data => {
          this.dispatch('getStoriesWithTasks')
        })
    },
    updateTasksByDrag ({ commit }, { tasks }) {
      const tasksData = tasks.map((task) => {
        return {
          project_id: this.state.projectId,
          id: task.id,
          story_id: task.storyId,
          project_ticket_status_id: task.statusId,
          row_order_position: task.newIndex
        }
      })

      axios
        .patch(`/projects/${this.state.projectId}/tasks/row_orders`, tasksData)
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
    }
  },
  modules: {
    Stories,
    Tasks,
    Tickets
  }
})