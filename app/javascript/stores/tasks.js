import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

axios.defaults.headers['X-CSRF-TOKEN'] = $('meta[name=csrf-token]').attr('content')

export default {
  namespaced: true,
  state: {
    selectedTaskId: null
  },
  actions: {
    getTask ({ commit, state }, { projectId, taskId }) {
      return new Promise((resolve, reject) => {
        axios
        .get(`/projects/${projectId}/tasks/${taskId}`)
        .then(r => r.data)
        .then(task => {
          commit('SET_SELECTED_TASK', task, { root: true })
          resolve(task)
        })
        .catch(error => {
          reject()
        })
      })
    },
    createTask ({ commit, state, getters }, {projectId, task}) {
      const requestTask = getters.getRequestTask(task)

      axios
        .post(`/projects/${projectId}/tasks`, requestTask)
        .then(() => {
          this.dispatch('getStoriesWithTasks', projectId, { root: true })
        })
    },
    updateTask ({ commit, state }, {storyId, projectId, task }) {
      task.story_id = storyId

      axios
        .patch(`/projects/${projectId}/tasks/${task.id}`, task)
        .then(() => {
          this.dispatch('getStoriesWithTasks', projectId, { root: true })
        })
    },
    deleteTask ({ commit, state }, { projectId, taskId }) {
      axios
        .delete(`/projects/${projectId}/tasks/${taskId}`)
        .then(() => {
          this.dispatch('getStoriesWithTasks', projectId, { root: true })
        })
    }
  },
  mutations: {
    SET_TASKS (state, stories) {
      state.stories = stories
    },
    SELECT_TASK (state, taskId) {
      state.selectedTaskId = taskId
    },
    UNSELECT_TASK (state) {
      state.selectedTaskId = null
    }
  },
  getters: {
    getRequestTask: (state) => (task) => {
      let requestTask = task

      if (requestTask.assignee) {
        requestTask = Object.assign(requestTask, {
          assignee_id: requestTask.assignee.id
        })
      }

      if (requestTask.projectTicketStatus) {
        requestTask = Object.assign(requestTask, {
          project_ticket_status_id: requestTask.projectTicketStatus.id
        })
      }

      return requestTask
    }
  }
}