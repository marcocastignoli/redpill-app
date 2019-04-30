import * as ApplicationSettings from "application-settings";

const url = 'http://192.168.1.64:8005'

export const login = (username, password) => {
    return fetch(`${url}/auth/login`, {
        method: "POST",
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({email: username, password})
    })
        .then(res => res.json())
}

export const fetchPosts = (offset, limit, parent_id) => {
    return fetch(`${url}/post/list?limit=${limit}&offset=${offset}&parent_id=${parent_id}`, {
        metohd: "GET",
        headers: new Headers({'Authentication': ApplicationSettings.getString("token")}),
    })
        .then(res => res.json())
}

export const addPost = (parent_id, content) => {
    return fetch(`${url}/post`, {
        method: "POST",
        headers: new Headers({'Authentication': ApplicationSettings.getString("token")}),
        body: JSON.stringify({content, parent_id: parseInt(parent_id)})
    })
        .then(res => res.json())
}

export const addReaction = (post_id, reaction_type) => {
    return fetch(`${url}/reactions`, {
        method: "POST",
        headers: new Headers({'Authentication': ApplicationSettings.getString("token")}),
        body: JSON.stringify({post_id, reaction_type})
    })
        .then(res => res.json())
}

export const deleteReaction = (reaction_id) => {
    return fetch(`${url}/reactions/${reaction_id}`, {
        method: "DELETE",
        headers: new Headers({'Authentication': ApplicationSettings.getString("token")})
    })
        .then(res => res.json())
}