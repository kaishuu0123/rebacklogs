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
    project: null
  },
  actions: {
    getProject({ commit, state }, projectId) {
      axios
        .get(`/projects/${projectId}`)
        .then(r => r.data)
        .then(project => {
          commit('SET_PROJECT', project)
        })
        .catch((error) => {
          reject(error)
        })
    },
    updateProject({ commit, state }, { projectId, project }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/projects/${projectId}`, project)
          .then(r => r.data)
          .then(project => {
            commit('SET_PROJECT', project)
            resolve(project)
          })
      })
    },
    uploadImage({ commit, state }, { projectId, file }) {
      let formData = new FormData();
      formData.append('project[image]', file)

      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }

      return new Promise((resolve, reject) => {
        axios
          .patch(`/projects/${projectId}`, formData, config)
          .then(result => {
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })
      });
    },
    deleteImage({ commit, state }, projectId) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/projects/${projectId}/delete_image`)
          .then(result => {
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  },
  mutations: {
    SET_PROJECT (state, project) {
      state.project = project
    }
  }
}