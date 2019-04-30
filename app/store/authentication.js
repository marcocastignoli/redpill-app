import Vuex from 'vuex'
import * as ApplicationSettings from "application-settings";
import { login } from '../api/easySocial'

export const authenticationStore = {
  state: {
    token: ''
  },
  mutations: {
    setToken (state, {token}) {
      state.token = token
    }
  },
  actions: {
    login ({ commit }, {username, password}) {
      return new Promise((resolve, reject) => {
        if (username && password) {
          login(username, password).then(({success, token}) => {
            if (!success) {
              resolve(false)
            }
            commit('setToken', { token })
            ApplicationSettings.setString("token", token)
            resolve(true)
          })
        } else {
          resolve(false)
        }
      })
    },
    logout ({commit}) {
      return new Promise((resolve, reject) => {
        commit('setToken', { token: '' })
        ApplicationSettings.setString("token", '')
        resolve(true)
      })
    },
    checkLogin({commit}) {
      return new Promise((resolve, reject) => {
        const token = ApplicationSettings.getString("token")
        if(token != '') {
          commit('setToken', { token })
          resolve(true)
        } else {
          commit('setToken', { token: '' })
          resolve(false)
        }
      })
    }
  },
  getters: {
    isLogged (state, getters) {
      return state.token != ''
    }
  }
}