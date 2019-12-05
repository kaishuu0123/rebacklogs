import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Stories from './stories'
import Tickets from './tickets'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sprints: [],
    storiesInBacklogs: [],
    isLoading: false
  },
  actions: {
    getSprintsWithStories ({ commit }, projectId) {
      Vue.http
        .get(`/projects/${projectId}/sprints`)
        .then(r => r.data)
        .then(data => {
          commit('SET_SPRINTS', data.sprints)
          commit('SET_STORIES_IN_BACKLOGS', data.storiesInBacklogs)
        })
    },
    getClosedSprintsWithStories ({ commit }, projectId) {
      Vue.http
        .get(`/projects/${projectId}/api/closed_sprints`)
        .then(r => r.data)
        .then(data => {
          commit('SET_SPRINTS', data.sprints)
          commit('SET_STORIES_IN_BACKLOGS', data.storiesInBacklogs)
        })
    },
    createSprint({ commit }, { projectId, sprint }) {
      Vue.http
        .post(`/projects/${projectId}/sprints`, sprint)
        .then(r => r.data)
        .then(data => {
          this.dispatch('getSprintsWithStories', projectId)
        })
    },
    updateSprint({ commit }, { projectId, sprint }) {
      Vue.http
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

      Vue.http
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

      Vue.http
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

      Vue.http
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
    },
    SET_IS_LOADING (state, isLoading) {
      state.isLoading = isLoading
    }
  },
  modules: {
    Stories,
    Tickets
  }
})