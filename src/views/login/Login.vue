<template>
    <div class="login">
        <div>
            <div v-if="Login" class="login-form">
                <div class="login-header">
                    <img src="../../assets/images/4c1bbc36e26cc5209cb2dcf487af6a8.png" width="100" height="100" alt="">
                    <p>{{ $Config.siteName }}</p>
                </div>
                <el-input
                        clearable
                        placeholder="请输入手机号"
                        suffix-icon="fa fa-user"
                        v-model="username"
                        style="margin-bottom: 18px"
                >
                </el-input>
                <el-input
                        clearable
                        placeholder="请输入密码"
                        suffix-icon="fa fa-keyboard-o"
                        v-model="password"
                        type="password"
                        style="margin-bottom: 18px"
                        @keyup.native.enter="login"
                >
                </el-input>
                <el-button
                        type="primary" :loading="loginLoading"
                        style="width: 100%;margin-bottom: 18px"
                        @click.native="login">登录
                </el-button>
                <div>
                    <el-checkbox v-model="Remember"> 记住密码</el-checkbox>
                    <!--<div style="float: right;color: #3C8DBC;font-size: 14px;cursor: pointer"-->
                    <!--@click="Login = !Login">注册</div>-->
                </div>
            </div>
            <div v-if="!Login" class="login-form">
                <div class="login-header">
                    <img src="../../assets/images/4c1bbc36e26cc5209cb2dcf487af6a8.png" width="100" height="100" alt="">
                </div>
                <el-input
                        placeholder="请输入用户名"
                        suffix-icon="fa fa-user"
                        v-model="username"
                        style="margin-bottom: 18px"
                >
                </el-input>

                <el-input
                        placeholder="请输入密码"
                        suffix-icon="fa fa-keyboard-o"
                        v-model="password"
                        type="password"
                        style="margin-bottom: 18px"
                        @keyup.native.enter="login"
                >
                </el-input>
                <el-input
                        placeholder="请再次输入密码"
                        suffix-icon="fa fa-keyboard-o"
                        v-model="password1"
                        type="password"
                        style="margin-bottom: 18px"
                        @keyup.native.enter="login"
                >
                </el-input>

                <el-button
                        type="primary" :loading="loginLoading"
                        style="width: 100%;margin-bottom: 18px"
                >注册
                </el-button>
                <div>
                    <div style="float: right;color: #3C8DBC;font-size: 14px;cursor: pointer"
                         @click="Login = !Login"><i class="fa fa-reply"></i> 返回登录
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                Login: true,
                username: '',
                password: '',
                password1: '',
                Remember: true,
                loginLoading: false
            }
        },
        mounted() {
            this.username = localStorage.getItem('MSDManagement_username');
            this.password = localStorage.getItem('MSDManagement_password');
            this.autoLogin();
        },
        methods: {
            login() {
                this.loginLoading = true;
                this.$api_v3.post('/Identify/login', {
                    'phone': this.username,
                    'password': this.password
                }).then((result) => {
                    //console.log(result);
                    if (result.code !== 0) {//登录失败
                        this.$message.error('账号或密码错误');
                        return false;
                    }
                    if (result.code === 0) {//登录成功
                        console.log(result);
                        if (this.Remember === true) {//是否记住密码
                            localStorage.setItem('MSDManagement_username', this.username);
                            localStorage.setItem('MSDManagement_password', this.password);
                        } else {
                            localStorage.removeItem('MSDManagement_username');
                            localStorage.removeItem('MSDManagement_password')
                        }
                        sessionStorage.setItem('user', JSON.stringify(result.data.user));//保存当前用户信息
                        localStorage.setItem(this.$Config.tokenKey, result.data.token);//保存token
                        this.$socket.emit("login", {token: result.data.token}, (data) => {
                            console.log('socket.io--login', data);
                        });
                        this.$router.push({path: '/home'});//跳转到首页
                    }
                }).finally(() => {
                    this.loginLoading = false;
                })
            },
            autoLogin() {
                let token = localStorage.getItem(this.$Config.tokenKey);
                console.log(token);
                if (token) {
                    this.loginLoading = true;
                    this.$api_v3.post('/Identify/autoLogin').then((result)=>{
                        console.log(result);
                        if(result.code===0){
                            sessionStorage.setItem('user', JSON.stringify(result.data.user));//保存当前用户信息
                            this.$socket.emit("login", {token: token}, (data) => {
                                console.log('socket.io--login', data);
                            });
                            this.$router.push({path: '/home'});//跳转到首页
                        }
                    }).finally(()=>{
                        this.loginLoading = false;
                    })
                }
            },
            getSMSCode(){
                this.$api_v3.post('/Identify/getSMSCode',{
                    'phone':''
                })
            }
        }
    }
</script>

<style lang="less">
    @import "Login.less";
</style>
