<template>
  <div id="app">
    <v-app light>
      <v-toolbar app>
        <v-toolbar-items>
          <v-btn icon :to="{path: 'timetracking'}"><v-icon color="red">alarm</v-icon></v-btn>
          <v-btn icon :to="{path: 'setting'}" ><v-icon color="red">settings</v-icon></v-btn>
          <v-btn icon :to="{path: 'analysis'}"><v-icon color="red">show_chart</v-icon></v-btn>
        </v-toolbar-items>
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
  export default {
    name: 'redmine-time-tracker'
  }
</script>

<style>
  /* CSS */
</style>
