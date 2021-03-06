const Setting = (localStorage.getItem('login-setting')) ? JSON.parse(localStorage.getItem('login-setting')) : {}

const state = {
    url: Setting.url ? Setting.url : '',
    apiKey: Setting.apiKey ? Setting.apiKey : '',
    user: Setting.user ? Setting.user : '',
    password: Setting.password ? Setting.password : '',
    type: Setting.type ? Setting.type : 'basic',
}

const mutations = {
    SET_LOGIN_BY_APIKEY (state, setting) {
        state.apiKey = setting.apiKey
        state.url = setting.url
        state.type = setting.type
        localStorage.setItem('login-setting', JSON.stringify({
            apiKey: setting.apiKey,
            url: setting.url,
            type: setting.type
        }))
    },
    SET_LOGIN_BY_PASS (state, setting) {
        state.user = setting.user
        state.password = setting.password
        state.url = setting.url
        state.type = setting.type
        localStorage.setItem('login-setting', JSON.stringify({
            url: setting.url,
            password: setting.password,
            user: setting.user,
            type: setting.type
        }))
    },
}

const actions = {}


export default {
    namespaced: true,
    state,
    mutations,
    actions,
}
  