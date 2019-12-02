import axios from 'axios'

axios.defaults.headers['X-CSRF-TOKEN'] = $('meta[name=csrf-token]').attr('content')
axios.defaults.headers.common['Accept'] = 'application/json'

const http = axios;

export default (Vue, { store }) => {
  http.interceptors.request.use((config) => {
    store.commit('SET_IS_LOADING', true)
    return config;
  }, (error) => {
    const errorMsg = `${error.response.status} ${error.response.statusText}`
    const vm = new Vue()
    vm.$bvToast.toast(error.toString(), {
      title: errorMsg,
      noCloseButton: false,
      noAutoHide: true,
      variant: 'danger',
    })

    return Promise.reject(error)
  });

  http.interceptors.response.use((response) => {
    store.commit('SET_IS_LOADING', true);
    return response;
  }, (error) => {
    const errorMsg = `${error.response.status} ${error.response.statusText}`
    const vm = new Vue()
    vm.$bvToast.toast(error.toString(), {
      title: errorMsg,
      noCloseButton: false,
      noAutoHide: true,
      variant: 'danger',
    })

    return Promise.reject(error)
  });

  Vue.http = http;
  Object.defineProperties(Vue.prototype, {
    $http: {
      get () {
        return http;
      }
    }
  });
};