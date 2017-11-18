// const Setting = (localStorage.getItem('login-setting')) ? JSON.parse(localStorage.getItem('login-setting')) : {}

const state = {
    projects: []
}

const mutations = {
    // SET_LOGIN_BY_APIKEY (state, setting) {
    //     state.apikey = setting.apikey
    //     state.url = setting.url
    //     state.type = setting.type
    //     localStorage.setItem('login-setting', JSON.stringify({
    //         apikey: setting.apikey,
    //         url: setting.url,
    //         type: setting.type
    //     }))
    // },
    // SET_LOGIN_BY_PASS (state, setting) {
    //     state.user = setting.user
    //     state.password = setting.password
    //     state.url = setting.url
    //     state.type = setting.type
    //     localStorage.setItem('login-setting', JSON.stringify({
    //         apikey: setting.apikey,
    //         password: setting.password,
    //         user: setting.user,
    //         type: setting.type
    //     }))
    // },
}

const actions = {
    someAsyncTask ({ commit }) {
        // do something async
        commit('INCREMENT_MAIN_COUNTER')
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
  