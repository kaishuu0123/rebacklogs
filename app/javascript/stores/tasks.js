import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    selectedTaskId: null
  },
  actions: {
    getTask ({ commit, state }, { projectId, taskId }) {
      return new Promise((resolve, reject) => {
        Vue.http
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

      Vue.http
        .post(`/projects/${projectId}/tasks`, requestTask)
        .then(() => {
          this.dispatch('getStoriesWithTasks', projectId, { root: true })
        })
    },
    updateTask ({ commit, state }, {storyId, projectId, task }) {
      task.story_id = storyId

      Vue.http
        .patch(`/projects/${projectId}/tasks/${task.id}`, task)
        .then(() => {
          this.dispatch('getStoriesWithTasks', projectId, { root: true })
        })
    },
    deleteTask ({ commit, state }, { projectId, taskId }) {
      Vue.http
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