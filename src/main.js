import Vue from 'vue'
import store from './store/'
import ElementUI from 'element-ui'
import './theme/index.css'//自定义element-ui主题
import './assets/css/font-awesome.min.css'
import './assets/css/style.css'
import router from './router/'
import Config from './config/'
import Api from './api/'
import Function from './utils/'
import App from './App.vue'
import req from './utils/axios'
import moment from 'moment'
import {Message} from 'element-ui'


Vue.prototype.$req = req
Vue.prototype.$Api = Api
Vue.prototype.$Config = Config
Vue.prototype.$Func = Function
Vue.prototype.$moment = moment

Vue.use(ElementUI, {size: 'small'})

router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title ? to.meta.title + '-' + Config.siteName : Config.siteName;
    if (localStorage.getItem(Config.tokenKey)) {
        let isOvertime = (new Date - new Date(localStorage.getItem("tokenSetTime"))) >= 259200000;//判断token是否过期
        if (isOvertime) {
            localStorage.removeItem(Config.tokenKey);//移除过期token
            Message({
                message: '身份验证失败，请重新登录',
                type: 'error'
            });
            next({path: '/login'});
        } else if (new Date - new Date(localStorage.getItem("tokenSetTime")) > 216000000) {//判断token是否即将过期
            req.post('/authentication/refresh').then((result) => {//重置token有效时间
                localStorage.setItem("tokenSetTime", new Date);
            });
            next();
        } else {
            next();
        }
    }

    if (!localStorage.getItem(Config.tokenKey) && to.path != '/login') {
        Message({
            message: '身份验证失败，请重新登录',
            type: 'error'
        });
        next({path: '/login'});
    } else {
        next();
    }
});
router.afterEach(transition => {

});


new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
