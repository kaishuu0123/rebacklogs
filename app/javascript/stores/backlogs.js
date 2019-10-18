import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Stories from './stories'
import Tickets from './tickets'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

axios.defaults.headers.common['Accept'] = 'application/json'

export default new Vuex.Store({
  state: {
    sprints: [],
    storiesInBacklogs: []
  },
  actions: {
    getSprintsWithStories ({ commit }, projectId) {
      axios
        .get(`/projects/${projectId}/sprints`)
        .then(r => r.data)
        .then(data => {
          commit('SET_SPRINTS', data.sprints)
          commit('SET_STORIES_IN_BACKLOGS', data.storiesInBacklogs)
        })
    },
    getClosedSprintsWithStories ({ commit }, projectId) {
      axios
        .get(`/projects/${projectId}/api/closed_sprints`)
        .then(r => r.data)
        .then(data => {
          commit('SET_SPRINTS', data.sprints)
          commit('SET_STORIES_IN_BACKLOGS', data.storiesInBacklogs)
        })
    },
    createSprint({ commit }, { projectId, sprint }) {
      axios
        .post(`/projects/${projectId}/sprints`, sprint)
        .then(r => r.data)
        .then(data => {
          this.dispatch('getSprintsWithStories', projectId)
        })
    },
    updateSprint({ commit }, { projectId, sprint }) {
      axios
        .put(`/projects/${projectId}/sprints/${sprint.id}`, sprint)
        .then(r => r.data)
        .then(data => {
          this.dispatch('getSprintsWithStories', projectId)
        })
    },
    updateStoryByDrag({ commit }, { projectId, from, to, storyId }) {
      const story = {
        sprint_id: to.sprintId,
        row_order_position: to.newIndex
      }

      axios
        .patch(`/projects/${projectId}/stories/${storyId}`, story)
        .then(r => r.data)
        .then(data => {
          this.dispatch('getSprintsWithStories', projectId)
        })
    },
    closeSprint({ commit }, { projectId, sprint }) {
      const closedSprint = Object.assign(sprint, {
        closed: true
      })

      axios
        .patch(`/projects/${projectId}/sprints/${sprint.id}`, closedSprint)
        .then(r => r.data)
        .then(data => {
          this.dispatch('getSprintsWithStories', projectId)
        })
    },
    openSprint({ commit }, { projectId, sprint }) {
      const openSprint = Object.assign(sprint, {
        closed: false
      })

      axios
        .patch(`/projects/${projectId}/sprints/${sprint.id}`, openSprint)
        .then(r => r.data)
        .then(data => {
          this.dispatch('getClosedSprintsWithStories', projectId)
        })
    }
  },
  mutations: {
    SET_SPRINTS (state, sprints) {
      state.sprints = sprints
    },
    SET_STORIES_IN_BACKLOGS (state, storiesInBacklogs) {
      state.storiesInBacklogs = storiesInBacklogs
    }
  },
  modules: {
    Stories,
    Tickets
  }
})