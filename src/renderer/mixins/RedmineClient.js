import {remote} from 'electron'
const Redmine = remote.require('node-redmine')
export default {
    methods:{
        createRedmineClient(config = null){
            if(config){
                return this._createRedmineClient(config)
            }else{
                return this._createRedmineClient(this.$store.state.Setting)
            }
        },
        _createRedmineClient({type, apiKey, password, user, url}){
            if(url == '') throw new Error();
            const config = {format: 'json'}
            if('api' == type){
                config.apikey = apiKey
            }else if('basic' == type){
                config.username = user
                config.password = password
            }
            return new Redmine(url, config);
        }
    }
};