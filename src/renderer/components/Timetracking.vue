<template>
    <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
        <h1>Time Tracking</h1>
      </v-flex>
      <v-flex xs12>
        <v-select
          :items="projectSelecter"
          v-model="selectedProjectId"
          label="Project"
          item-value="value"
          item-text="text"
          requires
        ></v-select>
        <v-select
          :items="issueSelecter"
          v-model="selectedIssueId"
          label="Issue"
          item-value="value"
          item-text="text"
        ></v-select>
        <v-select
          :items="activitiesSelecter"
          v-model="selectedActivityId"
          label="Activity"
          item-value="value"
          item-text="text"
          requires
        ></v-select>
      </v-flex>
      <v-flex xs12>
        <v-btn block color="error" large @click.native="startTimeTrack" :disabled="!isTrackingReady">Start</v-btn>
      </v-flex>
    </v-layout>
    <v-dialog v-model="tracking" persistent max-width="80%">
      <v-card>
        <v-card-title class="headline">Time Tracking Now...</v-card-title>
        <v-card-text><b>Start       :</b> {{formatedStartTime}}</v-card-text>
        <v-card-text><b>Elapsed Time:</b> {{formatedElapsedTime}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="tracking = false">Cancel</v-btn>
          <v-btn color="green darken-1" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      :timeout="6000"
      :color="alartColor"
      :top="true"
      v-model="alartIsShow"
      >{{alartMessage}}
      <v-btn flat @click.native="alartIsShow = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import RedmineClient from '@/mixins/RedmineClient'
export default {
  name: 'time-tracking',
  mounted(){
    this.fetchProjects()
  },
  mixins:[RedmineClient],
  data(){
    return {
      projects: {},
      issues: {},
      selectedProjectId: null,
      selectedIssueId: null,
      selectedActivityId: null,
      tracking: false,
      startTimeMilli: null,
      elapsedTimeMilli: 0,

      alartColor: "success",
      alartIsShow: false,
      alartMessage: ""
    }
  },
  computed:{
    isTrackingReady(){
      return !!this.selectedProjectId && !!this.selectedActivityId
    },
    formatedElapsedTime(){
      const elapsedTimeSec = this.elapsedTimeMilli / 1000
      const h = parseInt(elapsedTimeSec / 3600)
      const m = parseInt(elapsedTimeSec % 3600 / 60)
      const s = parseInt(elapsedTimeSec % 60)
      return h+":"+m+":"+s
    },
    formatedStartTime(){
      if(!this.startTimeMilli) return ''
      const date = new Date(this.startTimeMilli)
      return `${date.toDateString()} ${date.toTimeString()}`
    },
    projectSelecter(){
      return Object.keys(this.projects).map((id)=>{
        return {value: id, text: `(ID: ${id}) ${this.projects[id].name}`}
      })
    },
    activities(){
      if(!this.selectedProjectId) return []
      return this.projects[this.selectedProjectId]
                  .time_entry_activities
                  .reduce((obj, activity)=>{
                    obj[activity.id] = activity
                    return obj
                  }, {})
    },
    activitiesSelecter(){
      return Object.keys(this.activities).map((id)=>{
        return {value: id, text: `(ID: ${id}) ${this.activities[id].name}`}
      })
    },
    issueSelecter(){
      return Object.keys(this.issues).map((id)=>{
        return {value: id, text: `(ID: ${id}) ${this.issues[id].subject}`}
      })
    },
  },
  watch:{
    selectedProjectId: function(newVal){
      if(!newVal) return
      this.fetchIssues(newVal)
    }
  },
  methods: {
    save(){
      try{
        const elapsedTime = this.elapsedTimeMilli
        const config = {
          hours: elapsedTime / 1000 / 3600,
          activity_id: this.selectedActivityId,
          comments: JSON.stringify({from: this.startTimeMilli, to: parseInt(this.startTimeMilli) + parseInt(elapsedTime)})
        }
        if(this.selectedIssueId){
          config.issue_id = this.selectedIssueId
        }else if(this.selectedProjectId){
          config.project_id = this.selectedProjectId
        }else{
          throw new Error()
        }
        const client = this.createRedmineClient()
        client.create_time_entry({time_entry: config}, (err, data)=>{
          if(err) throw err
          this.alartMessage = "時間の記録に成功しました。"
          this.alartColor = "success"
          this.alartIsShow = true
          this.tracking = false
        })
      }catch(error){
        this.alartMessage = "時間の記録に失敗しました。"
        this.alartColor = "error"
        this.alartIsShow = true
        console.log(error)
      }
      
    },
    startTimeTrack(){
      this.startTimeMilli = Date.now()
      this.tracking = true
      const time = setInterval(()=>{
        if(!this.tracking) clearInterval(time)
        this.elapsedTimeMilli = Date.now() - this.startTimeMilli
      },100)
    },
    fetchIssues(project_id){
      const client = this.createRedmineClient()
      client.issues({project_id: project_id, status_id: 'open'}, (err, data)=> {
        this.issues = data.issues.reduce((obj, issue)=>{
          obj[issue.id] = issue
          return obj
        }, {})
      })
    },
    fetchProjects(){
      try{
        const client = this.createRedmineClient()
        client.projects({include: "time_entry_activities"}, (err, data)=> {
          this.projects = data.projects.reduce((obj, project)=>{
            obj[project.id] = project
            return obj
          }, {})
        })
        this.selectedIssueId = null
      }catch(err){
        // console.log(err)
      }
    }
  }
}
</script>

<style>
 
</style>