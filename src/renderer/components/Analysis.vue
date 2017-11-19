<template>
    <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
        <v-flex xs12>
            <h1>Metrix</h1>
        </v-flex>
      <v-flex xs12>
        <v-expansion-panel>
          <v-expansion-panel-content v-for="(timeEntries, date) in timeEntriesByDate" :key="date">
            <div slot="header">{{date}}: {{sumTimes(timeEntries)}} Hours</div>
            <v-data-table
              v-bind:headers="headers"
              :items="timeEntries"
              hide-actions
              class="elevation-1"
            >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.project }}</td>
              <td>{{ props.item.issue }}</td>
              <td>{{ props.item.user }}</td>
              <td>{{ props.item.activity }}</td>
              <td class="text-xs-right">{{ props.item.hours }}</td>
              <td>{{ props.item.from }}</td>
              <td>{{ props.item.to }}</td>
              <td>{{ props.item.comment }}</td>
            </template>
          </v-data-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import RedmineMixin from '@/mixins/RedmineClient'
export default {
  name: 'analysis',
  mixins:[RedmineMixin],
  mounted(){
    const client = this.createRedmineClient()
    client.time_entries({}, (err, data)=>{
      this.timeEntriesByDate = data.time_entries.map((timeEntry)=>{
        const parsedComment = this.commentParse(timeEntry.comments)
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
    })
  },
  data(){
    return {
      timeEntriesByDate: {},
      headers: [
        { text: 'Project', value: 'project'},
        { text: 'Issue', value: 'issue'},
        { text: 'User', value: 'user' },
        { text: 'Activity', value: 'activity' },
        { text: 'Hours', value: 'hours' },
        { text: 'From', value: 'from' },
        { text: 'To', value: 'to' },
        { text: 'Comment', value: 'comment' },
      ],
    }
  },
  components: {  },
  methods: {
    sumTimes(timeEntries){
      return timeEntries.reduce((sum, entry)=>{
        return sum + entry.hours
      } ,0)
    },
    commentParse(comment){
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
          from: `${from.toDateString()} ${from.toTimeString()}`,
          to: `${to.toDateString()} ${to.toTimeString()}`,
          comment: match[1] + match[3]
        }  
      }
      return {
        from: '',
        to: '',
        comment: comment
      }
    },
    open (link) {
      this.$electron.shell.openExternal(link)
    }
  }
}
</script>

<style>
 
</style>
