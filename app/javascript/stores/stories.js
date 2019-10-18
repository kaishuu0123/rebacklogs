import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { request } from 'http';

Vue.use(Vuex)
Vue.use(VueAxios, axios)

axios.defaults.headers['X-CSRF-TOKEN'] = $('meta[name=csrf-token]').attr('content')

export default {
  namespaced: true,
  state: {
    selectedStory: null,
  },
  actions: {
    getStory ({ commit, state }, { projectId, storyId }) {
      return new Promise((resolve, reject) => {
        axios
        .get(`/projects/${projectId}/stories/${storyId}`)
        .then(r => r.data)
        .then(story => {
          commit('SET_SELECTED_STORY', story)
          resolve(story)
        })
        .catch(error => {
          reject()
        })
      })
    },
    createStory ({ commit, state, getters }, {projectId, story}) {
      const requestStory = getters.getRequestStory(story);

      axios
        .post(`/projects/${projectId}/stories`, requestStory)
        .then(() => {
          this.dispatch('getSprintsWithStories', projectId, { root: true })
        })
    },
    updateStory ({ commit, state }, { projectId, story }) {
      axios
        .patch(`/projects/${projectId}/stories/${story.id}`, story)
        .then(() => {
          this.dispatch('getSprintsWithStories', projectId, { root: true })
        })
    },
    deleteStory ({ commit, state }, { projectId, storyId }) {
      axios
        .delete(`/projects/${projectId}/stories/${storyId}`)
        .then(() => {
          this.dispatch('getSprintsWithStories', projectId, { root: true })
        })
    }
  },
  mutations: {
    SET_STORIES (state, stories) {
      state.stories = stories
    },
    SET_SELECTED_STORY (state, story) {
      state.selectedStory = story
    }
  },
  getters: {
    getRequestStory: (state) => (story) => {
      let requestStory = story

      if (requestStory.projectTicketCategory) {
        requestStory = Object.assign(requestStory, {
          project_ticket_category_id: requestStory.projectTicketCategory.id
        })
      }

      if (requestStory.assignee) {
        requestStory = Object.assign(requestStory, {
          assignee_id: requestStory.assignee.id
        })
      }

      if (requestStory.projectTicketStatus) {
        requestStory = Object.assign(requestStory, {
          project_ticket_status_id: requestStory.projectTicketStatus.id
        })
      }

      return requestStory
    }
  }
}