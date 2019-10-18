import Vue from 'vue'
import store from './store/'
import ElementUI from 'element-ui'
import './theme/index.css'//自定义element-ui主题
/**
 * 若更新element-ui版本需将新增组件的原样式文件引入theme/index.css
 * 例如新增了timeline组件:@import "timeline.css"; @import "timeline-item.css";
 * 原样式文件在 'node_modules/element-ui/lib/theme-chalk/';
 */
import './assets/css/font-awesome.min.css'
import './assets/css/style.css'
import router from './router/'
import Config from './config/'
import App from './App.vue'
import req from './utils/axios'
import moment from 'moment'
import {Message} from 'element-ui'
import api_v3 from './api/api_v3'

Vue.prototype.$req = req
Vue.prototype.$Config = Config
Vue.prototype.$moment = moment
Vue.prototype.$api_v3 = api_v3

//socket.io
let socket = io('https://www.msddtsw.com:8010/user');
Vue.prototype.$socket = socket;
socket.on("connect", function () {
    console.log("connected");
});
socket.on("disconnect", function () {
    console.log("disconnected");
});

Vue.use(ElementUI, {size: 'small'})

router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title ? to.meta.title + '-' + Config.siteName : Config.siteName;
    next();
});
router.afterEach(transition => {

});


new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
