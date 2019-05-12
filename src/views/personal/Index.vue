<template>
    <div>
        <el-card class="box-card">
            <div slot="header">
                <span>{{ $route.meta.title}}</span>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="index">
                    <div class="panel-heading">
                        <span class="title"><p class="role">{{me.name}}</p><span class="name">{{me.roles?me.roles[0]:''}}</span> </span>
                        <i class="el-icon-edit-outline"
                           style="font-size: 28px; position: absolute; right: 31px; top: 0; cursor: pointer;"></i>
                    </div>
                    <div class="panel-body">
                        <ul>
                            <li>
                                <div class="left"><i class="fa fa-id-card"></i></div>
                                <div class="center">ID</div>
                                <div class="right">{{me.id}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-envelope"></i></div>
                                <div class="center">EMAIL</div>
                                <div class="right">{{me.email}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-phone"></i></div>
                                <div class="center">手机</div>
                                <div class="right">{{me.cellphone}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-calendar"></i></div>
                                <div class="center">注册时间</div>
                                <div class="right">{{me.created_at}}</div>
                            </li>
                        </ul>
                    </div>
                </el-tab-pane>
                <!--<el-tab-pane label="我的足迹" name="second">哈哈哈哈哈哈哈哈哈哈</el-tab-pane>-->
                <el-tab-pane label="密码修改" name="third">
                    <div class="panel-body">
                        <ul>
                            <li>
                                <div class="left"><i class="fa fa-lock"></i></div>
                                <div class="center">原密码</div>
                                <div class="right">
                                    <el-input placeholder="请输入原密码"></el-input>
                                </div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-lock"></i></div>
                                <div class="center">新密码</div>
                                <div class="right">
                                    <el-input placeholder="请输入新密码"></el-input>
                                </div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-lock"></i></div>
                                <div class="center">确认新密码</div>
                                <div class="right">
                                    <el-input placeholder="确认密码"></el-input>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="panel-footer">
                        <div>
                            <!--<el-button icon="fa fa-reply"> 重置</el-button>-->
                            <el-button icon="fa fa-check" type="primary"> 保存修改</el-button>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                activeName: 'index',
                me:{}
            }
        },
        methods: {
            fetchMe() {
                this.$req.post('/authentication/me').then((result) => {
                    this.me = result;
                })
            }
        },
        mounted: function () {
            this.fetchMe();
        }
    }
</script>
<style scoped lang="less">
    .box-card .panel-heading {
        min-height: 55px;
    }
</style>
