import axios from 'axios'
import router from '../router/'
import Config from '../config/'
import {Message} from 'element-ui'

let service = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'https://api.msddtsw.com/v3' : 'https://api.msddtsw.com/v3',
    timeout: 20000,
});
//请求拦截器
service.interceptors.request.use(
    config => {
        config.headers = {
            'Content-Type': 'application/json'
        };
        if (localStorage.getItem(Config.tokenKey)) { //登录后保存的token
            config.headers['token'] = localStorage.getItem(Config.tokenKey)
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
);
//响应拦截器
service.interceptors.response.use(function (response) {
        /**
         * 下面的注释为通过在response里，自定义code来标示请求状态
         * 当code返回如下情况则说明权限有问题，登出并返回到登录页
         * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
         */
        //console.log('api',response);
        const res = response.data;
        if(res.code==-1&&res.msg=='无效token'){
            Message.error('身份验证过期，请重新登录');
            router.push('/');
        }
        return response
    }, function (error) {
        console.log('err' + error);
        return Promise.reject(error)
    }
);
export default {
    service,
    //post请求
    post(url, param) {
        return new Promise((resolve, reject) => {
            service({
                url: url,
                method: 'POST',
                data: param,
            }).then(res => {
                //console.log('request_success',res);
                resolve(res.data)
            }).catch(err => {
                reject(err);
                //console.log('request_error',err);
            }).finally()
        })
    }
}
