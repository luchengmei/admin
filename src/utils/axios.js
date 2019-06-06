import axios from 'axios'
import store from '../store'
import {Message} from 'element-ui'
import qs from 'qs'
import Config from '../config/'

let service = axios.create({
    // baseURL: 'http://47.75.5.104:8080',
    baseURL: process.env.NODE_ENV == 'development' ? 'http://47.75.5.104:8080' : 'https://admin.msddtsw.com',
    timeout: 20000,
});
//添加请求拦截器
service.interceptors.request.use(
    config => {
        config.headers = {
            'Content-Type': 'application/json' // 设置很关键
        };
        if (localStorage.getItem(Config.tokenKey)) { //登录后保存的token
            config.headers['Authorization'] = 'Bearer ' + localStorage.getItem(Config.tokenKey)
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
);
//添加响应拦截器
// service.interceptors.response.use(function (response) {
//         /**
//          * 下面的注释为通过在response里，自定义code来标示请求状态
//          * 当code返回如下情况则说明权限有问题，登出并返回到登录页
//          * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
//          */
//         // response => {
//         //   const res = response.data
//         //   if (res.code !== 20000) {
//         //     })
//         //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
//         //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         //       }).then(() => {
//         //         })
//         //       })
//         //     }
//         //     return Promise.reject('error')
//         //   } else {
//         //     return response.data
//         //   }
//         // },
//         return response
//     }, function (error) {
//         console.log('err' + error)
//         Message({
//             Message: error.message,
//             type: 'error',
//             duration: 5 * 1000
//         })
//         return Promise.reject(error)
//     }
// )
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
                console.log('request_error',err);
                // Message({
                //     message: '请求出错',
                //     type: 'error'
                // });
            }).finally()
        })
    }
}
