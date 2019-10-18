import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Generals from './project_settings/generals'
import GroupManagements from './project_settings/group_managements'
import TicketCategories from './project_settings/ticket_categories'
import TicketStatuses from './project_settings/ticket_statuses'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

axios.defaults.headers.common['Accept'] = 'application/json'

export default new Vuex.Store({
  modules: {
    Generals,
    GroupManagements,
    TicketCategories,
    TicketStatuses
  }
})