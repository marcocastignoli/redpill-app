import Vue from 'nativescript-vue'
import Login from './components/Login'
import Vuex from 'vuex'
import { authenticationStore } from './store/authentication'
import { postsStore } from './store/posts'

Vue.use(Vuex)

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

new Vue({
  render: h => h('frame', [h(Login)]),
  store: new Vuex.Store({
    modules: {
      auth: authenticationStore,
      posts: postsStore
    }
  })
}).$start()
