import {remote} from 'electron'
import { setTimeout } from 'timers';
const Redmine = remote.require('node-redmine')

const state = {
    projects: {},
    issues: {},
    projectsError:  "",
    issuesError: "",
}

const mutations = {
    SET_PROJECTS (state, projects){
        state.projects = projects
    },
    SET_ISSUES (state, issues){
        state.issues = issues
    },
    SET_PROJECTS_ERROR (state, error){
        state.projectsError = error
    },
    SET_ISSUES_ERROR (state, error){
        state.issuesError = error
    },
}

const actions = {
    updateProjects ({ commit, rootState }) {
        if(rootState.Setting.url == '') throw new Error();
        const config = {format: 'json'}
        if('api' == rootState.Setting.type){
            config.apiKey = rootState.Setting.apiKey
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
                if(err){
                    commit("SET_PROJECTS_ERROR", err)
                    setTimeout(()=>{
                        commit("SET_PROJECTS_ERROR", "")
                    }, 1000)
                    return 
                } 
                const projects = data.projects.reduce((obj, project)=>{
                    obj[project.id] = project
                    return obj
                }, {})
                commit('SET_PROJECTS', projects)
            })

            client.issues({status_id: 'open'}, (err, data)=> {
                if(err){
                    commit("SET_ISSUES_ERROR", err)
                    setTimeout(()=>{
                        commit("SET_ISSUES_ERROR", "")
                    }, 10)
                    return 
                } 
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
  