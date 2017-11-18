<template>
<v-container grid-list-md text-xs-center>
    <v-layout row wrap>
        <v-flex xs12>
            <h1>Setting</h1>
        </v-flex>
        <v-flex xs12>
            <v-tabs fixed centered>
                <v-tabs-bar>
                    <v-tabs-slider></v-tabs-slider>
                    <v-tabs-item href="#tab-login" selected>Login</v-tabs-item>
                </v-tabs-bar>
                <v-tabs-items>
                <v-tabs-content id="tab-login">
                    <v-card>
                        <v-card-text><h3>Login server</h3></v-card-text>
                        <v-text-field
                            label="Redmine Server URL"
                            v-model="url"
                            required
                        ></v-text-field>
                        <v-card-text><h3>Login type</h3></v-card-text>
                        <v-radio-group v-model="type" row>
                            <v-radio label="BASIC" value="basic" selected></v-radio>
                            <v-radio label="API Key" value="api" disabled></v-radio>
                        </v-radio-group>
                        <div v-if="type == 'basic'">
                            <v-text-field
                                label="Login User"
                                v-model="user"
                                required
                            ></v-text-field>
                            <v-text-field
                                label="Login Password"
                                v-model="password"
                                type="password"
                                required
                            ></v-text-field>
                        </div>
                        <div v-if="type == 'api'">
                            <v-text-field
                                label="API Key"
                                v-model="apiKey"
                                type="password"
                                required
                            ></v-text-field>
                        </div>
                        <v-btn
                            color="success"
                            :loading="loading"
                            @click.native="save"
                            :disabled="loading"
                            large
                        >Save<span slot="loader">Checking...</span>
                        </v-btn>
                    </v-card>
                </v-tabs-content>
                </v-tabs-items>
            </v-tabs>
        </v-flex>
    </v-layout>
    <v-snackbar
        :timeout="6000"
        color="error"
        :top="true"
        v-model="alertError"
    >認証に失敗しました。
        <v-btn flat @click.native="alertError = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar
        :timeout="6000"
        color="success"
        :top="true"
        v-model="alertSuccess"
    >ログイン情報を保存しました
        <v-btn flat @click.native="alertSuccess = false">Close</v-btn>
    </v-snackbar>
</v-container>
</template>

<script>
import RedmineMixin from '@/mixins/RedmineClient'
export default {
    mixins:[RedmineMixin],
    created(){
        this.$nextTick(()=>{
            const keys = ['url', 'apiKey', 'user', 'password', 'type'];
            keys.forEach((key)=>{
                this.$data[key] = this.$store.state.Setting[key]
            })
        })
    },
    data(){
        return {
            url: '',
            apiKey: '',
            user: '',
            password: '',
            type: 'api',
            loading: false,
            alertError: false,
            alertSuccess: false
        }    
    },
    name: 'setting',
    methods: {
        save(){
            this.loading = true
            try{
                const client = this.createRedmineClient({
                    url: this.url,
                    password: this.password,
                    user: this.user,
                    url: this.url,
                    type: this.type
                })
                client.projects({include: "trackers"}, (err,data)=>{
                    this.alertSuccess = true
                    this.loading = false
                    const config = {
                        url: this.url,
                        type: this.type,
                    }
                    if('api' == this.type){
                        config.apiKey = this.apiKey
                        this.$store.commit("Setting/SET_LOGIN_BY_APIKEY", config)
                    }else if('basic' == this.type){
                        config.password = this.password
                        config.user = this.user
                        this.$store.commit("Setting/SET_LOGIN_BY_PASS", config)
                    }
                })
            }catch(err){
                this.alertError = true;
                this.loading = false
                console.log(err)
            }
            
        },
    },
}
</script>

<style>
 
</style>
