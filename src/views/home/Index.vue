<template>
    <div>
        <el-card style="border-radius: 0">
            <div slot="header">
                <span>快捷入口</span>
            </div>
            <div class="demo">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <div class="grid-content " @click="toLiftManage">
                            <div style="padding: 10px;background: #673AB7">
                                <i class="fa fa-window-restore index-icon"></i>
                                我的电梯
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content " @click="toUserCompany">
                            <div style="padding: 10px;background: #3c8dbc">
                                <i class="fa fa-building-o index-icon"></i>
                                单位管理
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content " @click="toUserManage">
                            <div style="padding: 10px;background: #009688">
                                <i class="fa fa-users index-icon"></i>
                                用户管理
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content " @click="toPersonal">
                            <div style="padding: 10px;background: #607D8B">
                                <i class="fa fa-user-circle-o index-icon"></i>
                                个人中心
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <br>
        <!--<el-card style="border-radius: 0">-->
            <!--<div slot="header">-->
                <!--<span>设备概括</span>-->
            <!--</div>-->
            <!--<div class="demo">-->
                <!--<el-row :gutter="20">-->
                    <!--<el-col :span="8">-->
                        <!--<div class="grid-content " style="color: #009688;background:#ffffff;text-align: center">-->
                            <!--<div style="padding: 10px">-->
                                <!--<i class="el-icon-loading index-icon" style="color: #009688"></i>-->
                                <!--正常运行-->
                                <!--<span style="font-size: 64px;text-align: center">62</span>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<div class="grid-content " style="color: #d8690b;background:#ffffff;text-align: center">-->
                            <!--<div style="padding: 10px">-->
                                <!--<i class="fa fa-bell-o index-icon"    style="color: #d8690b"></i>-->
                                <!--报警-->
                                <!--<span style="font-size: 64px;text-align: center">3</span>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<div class="grid-content " style="color: #607D8B;background:#ffffff;text-align: center">-->
                            <!--<div style="padding: 10px">-->
                                <!--<i class="fa fa-chain-broken index-icon" style="color: #607D8B"></i>-->
                                <!--离线-->
                                <!--<span style="font-size: 64px;text-align: center">2</span>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</el-col>-->
                <!--</el-row>-->
            <!--</div>-->
        <!--</el-card>-->
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        methods: {
            toLiftManage() {
                this.$router.push('/lift_list')
            },
            toUserCompany() {
                this.$router.push('/userCompany_list')
            },
            toUserManage() {
                this.$router.push('/user_manage')
            },
            toPersonal() {
                this.$router.push('/personal')
            },
        },
        mounted: function () {

        }
    }
</script>
<style lang="less">
    .demo {
        .el-col-6 {
        }
        margin: 10px;
        .grid-content {
            border-radius: 4px;
            overflow: hidden;
            color: #fff;
            background: #d3dce6;
            .index-icon {
                font-size: 82px;
                color: #fff;
            }
            width: 100%;
            height: 100%;
            transition: all 0.2s linear;
            &:hover {
                cursor: pointer;
                transform: scale(1.1, 1.1);
                filter: contrast(130%);
            }
        }
    }
</style>
