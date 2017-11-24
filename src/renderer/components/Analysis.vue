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
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('TimeEntries')

export default {
  name: 'analysis',
  mounted(){
    this.updateTimeEntries()
  },
  computed:{
    ...mapState({
      timeEntriesByDate: state => state.timeEntriesByDate
    })
  },
  data(){
    return {
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
    ...mapActions([
      'updateTimeEntries'
    ]),
    sumTimes(timeEntries){
      return timeEntries.reduce((sum, entry)=>{
        return sum + entry.hours
      } ,0)
    },
  }
}
</script>

<style>
 
</style>
