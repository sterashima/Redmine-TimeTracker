<template>
  <div id="app">
    <v-app light>
      <v-toolbar app>
        <v-btn icon :to="{path: 'timetracking'}"><v-icon color="red">alarm</v-icon></v-btn>
        <v-btn icon :to="{path: 'setting'}" ><v-icon color="red">settings</v-icon></v-btn>
        <v-btn icon :to="{path: 'analysis'}"><v-icon color="red">show_chart</v-icon></v-btn>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="reload"><v-icon color="black">autorenew</v-icon></v-btn>
      </v-toolbar>
      <v-content>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-content>
      <v-footer app>
        <v-spacer></v-spacer>
        <div>© 2017 sterashima</div>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'redmine-time-tracker',
  methods:{
    ...mapActions('Projects',['updateProjects']),
    ...mapActions('TimeEntries', ['updateTimeEntries']),
    reload(){
      this.updateProjects()
      this.updateTimeEntries()
    }
  }
}
</script>

<style>
  /* CSS */
</style>
