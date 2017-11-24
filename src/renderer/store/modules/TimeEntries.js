import {remote} from 'electron'
const Redmine = remote.require('node-redmine')

const commentParse = (comment)=>{
    if(!comment){
      return {
        from: '',
        to: '',
        comment: ''
      }
    }
    let match;
    if(match = comment.match(/(^.*)(\{\"from\".+?\})(.*)/)){
      const time = JSON.parse(match[2])
      const from = new Date(time.from)
      const to = new Date(time.to)
      return {
        from: `${from.toLocaleDateString('ja-JP')} ${from.toLocaleTimeString('ja-JP')}`,
        to: `${to.toLocaleDateString('ja-JP')} ${to.toLocaleTimeString('ja-JP')}`,
        comment: match[1] + match[3]
      }  
    }
    return {
      from: '',
      to: '',
      comment: comment
    }
}


const state = {
    timeEntriesByDate: {}
}

const mutations = {
    SET_TIME_ENTRIES_BY_DATE (state, timeEntriesByDate) {
        state.timeEntriesByDate = timeEntriesByDate
    }
}

const actions = {
    updateTimeEntries ({ commit, rootState }) {
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
        const client = new Redmine(rootState.Setting.url, config);
        client.time_entries({}, (err, data)=>{
            const timeEntriesByDate = data.time_entries.map((timeEntry)=>{
                const parsedComment = commentParse(timeEntry.comments)
                return {
                    project: timeEntry.project.name,
                    issue: (timeEntry.issue) ? timeEntry.issue.id : '',
                    user: timeEntry.user.name,
                    date: timeEntry.spent_on,
                    activity: timeEntry.activity.name,
                    hours: timeEntry.hours,
                    from: parsedComment.from,
                    to: parsedComment.to,
                    comment: parsedComment.comment
                }
            }).reduce((obj, timeEntry)=>{
                if(!obj[timeEntry.date]) obj[timeEntry.date] = []
                obj[timeEntry.date].push(timeEntry)
                return obj
            }, {})
            commit('SET_TIME_ENTRIES_BY_DATE', timeEntriesByDate)
        })
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
  