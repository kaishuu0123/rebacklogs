import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Generals from './project_settings/generals'
import GroupManagements from './project_settings/group_managements'
import TicketCategories from './project_settings/ticket_categories'
import TicketStatuses from './project_settings/ticket_statuses'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: false
  },
  mutations: {
    SET_IS_LOADING (state, isLoading) {
      state.isLoading = isLoading
    }
  },
  modules: {
    Generals,
    GroupManagements,
    TicketCategories,
    TicketStatuses
  }
})