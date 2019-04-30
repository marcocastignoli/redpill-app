import Vuex from 'vuex'
import Vue from 'nativescript-vue'
import * as ApplicationSettings from "application-settings";
import { fetchPosts, addPost, addReaction, deleteReaction } from '../api/easySocial'

export const postsStore = {
  state: {
    posts: {}
  },
  mutations: {
    setPosts (state, {parent_id, data}) {
      Vue.set(state.posts, parent_id, data)
    }
  },
  actions: {
    updatePost({ commit, state }, {parent_id, post_id, content, my_vote, reactions}) {
      let post = state.posts[parent_id].find(post => post.post_id === post_id)
      if (content) {
        post.content = content
      }
      if (my_vote || my_vote === 0) {
        post.my_vote = my_vote
      }
      if (reactions) {
        for (let reaction in reactions) {
          let op = reactions[reaction]
          if (op === '+') {
            post[reaction] = parseInt(post[reaction]) + 1
          } else if (op === '-') {
            post[reaction] = parseInt(post[reaction]) - 1
          }
        }
      }
    },
    loadPosts ({ commit, state }, {offset, limit, parent_id}) {
      const cachedPosts = ApplicationSettings.getString(`post${parent_id}`)
      if(cachedPosts) {
        commit('setPosts', { parent_id, data: JSON.parse(cachedPosts) })
      }
      return new Promise((resolve, reject) => {
        state.last_update = Date.now()
        if (offset >= 0 && limit > 0) {
          fetchPosts(offset, limit, parent_id).then(({code, data}) => {
            if (code > 0) {
              resolve(false)
            }
            commit('setPosts', { parent_id, data })
            ApplicationSettings.setString(`post${parent_id}`, JSON.stringify(data))
            resolve(true)
          }).catch(e => resolve(e))
        } else {
          resolve(false)
        }
      })
    },
    publishPost({ commit, state }, {parent_id, content}) {
      return new Promise((resolve, reject) => {
        if (content) {
          addPost(parent_id, content).then(({code}) => {
            if (code > 0) {
              resolve(false)
            }
            resolve(true)
          }).catch(e => resolve(false))
        } else {
          resolve(false)
        }
      })
    },
    react({commit, state}, {post_id, reaction_type}) {
      return new Promise((resolve, reject) => {
        if (post_id && reaction_type) {
          addReaction(post_id, reaction_type).then(({code}) => {
            if (code > 0) {
              resolve(false)
            }
            resolve(true)
          }).catch(e => resolve(false))
        } else {
          resolve(false)
        }
      })
    },
    removeReaction({commit, state}, {post_id}) {
      return new Promise((resolve, reject) => {
        if (post_id) {
          deleteReaction(post_id).then(({code}) => {
            if (code > 0) {
              resolve(false)
            }
            resolve(true)
          }).catch(e => resolve(false))
        } else {
          resolve(false)
        }
      })
    }
  },
  getters: {
    postsList (state, getters) {
      return state.posts
    }
  }
}