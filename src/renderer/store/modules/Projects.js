import {remote} from 'electron'
const Redmine = remote.require('node-redmine')

const state = {
    projects: {},
    issues: {}
}

const mutations = {
    SET_PROJECTS (state, projects){
        state.projects = projects
    },
    SET_ISSUES (state, issues){
        state.issues = issues
    }
}

const actions = {
    updateProjects ({ commit, rootState }) {
        if(rootState.Setting.url == '') throw new Error();
        const config = {format: 'json'}
        if('api' == rootState.Setting.type){
            config.apikey = rootState.Setting.apiKey
        }
        else if('basic' == rootState.Setting.type){
            config.username = rootState.Setting.user
            config.password = rootState.Setting.password
        }
        else{
            throw new Error();
        }
        try{
            const client = new Redmine(rootState.Setting.url, config);
            client.projects({include: "time_entry_activities"}, (err, data)=> {
              const projects = data.projects.reduce((obj, project)=>{
                    obj[project.id] = project
                    return obj
              }, {})
              commit('SET_PROJECTS', projects)
            })

            client.issues({status_id: 'open'}, (err, data)=> {
                const issues = data.issues.reduce((obj, issue)=>{
                    obj[issue.id] = issue
                    return obj
                }, {})
                commit('SET_ISSUES', issues)
            })

        }catch(err){
            console.log(err)
        }
    }
}

const getters = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
  