<template>
    <div id="app">
        <router-view name="blank"></router-view>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data() {
            return {}
        },
        sockets: {
            //查看socket是否渲染成功
            connect() {
                console.log("链接成功");
            },
            disconnect(){
                console.log("断开链接");
            },//检测socket断开链接
            reconnect(){
                console.log("重新链接");
            },
            //客户端接收后台传输的socket事件
            message(data) {
                this.$notify({
                    title: '新消息',
                    message: data,
                    type: 'warning',
                    duration:10000
                });
                console.log("data", data);//接收的消息
            }
        },
        mounted() {
            console.log(process.env.NODE_ENV);
        }
    }
</script>

<style lang="less">
    #app {
        background-color: #222d32;
    }

</style>
