<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="box-card-header">
                <span class="name">{{ user.name}}</span>
                <el-button type="primary" icon="el-icon-check" style="float: right" @click="save()">
                    {{addUser?'新增':'提交'}}
                </el-button>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="index">
                    <div class="panel-heading">
                        <!--<span class="title"><span class="name">{{user.name}}</span></span>-->
                        <i :class="edit===true?'fa fa-floppy-o':'el-icon-edit-outline'"
                           @click="toggleEdit"
                           style="font-size: 28px; position: absolute; right: 31px; top: 0; cursor: pointer;"></i>
                    </div>
                    <div class="panel-body">
                        <ul>
                            <li>
                                <div class="left"><i class="fa fa-id-card"></i></div>
                                <div class="center">姓名</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="user.name"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{user.name}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-phone"></i></div>
                                <div class="center">手机</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="user.cellphone"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{user.cellphone}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-address-book-o"></i></div>
                                <div class="center">用户类型</div>
                                <div class="right" v-if="edit">
                                    <el-select v-model="roles" multiple placeholder="请选择" value=""
                                               style="height: 32px;width: 100%" size="small">
                                        <el-option
                                                v-for="item in userOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="right" v-else="edit">
                                    <span style="margin-right: 15px"
                                          v-for="(item,index2) in roles"
                                          :key="index2">{{item|userTypeFrm}}
                                    </span>
                                </div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-building-o"></i></div>
                                <div class="center">所属单位</div>
                                <div class="right" v-if="edit" style="display: flex">
                                    <div style="margin-right: 30px">
                                        <el-popover
                                                @show="changePage1"
                                                placement="bottom"
                                                width="600"
                                                trigger="click">
                                            <el-card class="box-card" shadow="never">
                                                <div slot="header" style="display: flex;align-items: center">
                                                    <el-input placeholder="请输入名称" v-model="popoverInputVal"
                                                              @clear="changePage1" clearable
                                                              @keyup.native.enter="popoverSearch">
                                                        <el-button slot="append" icon="el-icon-search"
                                                                   @click="popoverSearch"></el-button>
                                                    </el-input>
                                                    <el-pagination
                                                            :page-size.sync="popover.pageSize"
                                                            :current-page.sync="popover.currentPage"
                                                            @current-change="changePage1"
                                                            small
                                                            layout="prev, pager, next"
                                                            :total="popover.total">
                                                    </el-pagination>
                                                </div>
                                                <div v-for="(item, index) in popover.data" :key="index"
                                                     @click="setCompanyName(item)"
                                                     style="margin-bottom: 10px;font-size: 14px;color: #3C8DBC;cursor: pointer;">
                                                    {{item.name}}
                                                </div>
                                            </el-card>
                                            <el-button slot="reference" type="primary">点击选择</el-button>
                                        </el-popover>
                                    </div>
                                    <el-input style="flex: 1" v-model="company_name" disabled=""></el-input>
                                </div>
                                <div class="right" v-else="edit">{{company_name===''?user.company_id:company_name}}
                                </div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-user-circle-o"></i></div>
                                <div class="center">账号</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="user.username" placeholder="请输入手机号"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{user.username}}</div>
                            </li>
                            <!--<li>-->
                            <!--<div class="left"><i class="fa fa-lock"></i></div>-->
                            <!--<div class="center">密码</div>-->
                            <!--<div class="right" v-if="edit">-->
                            <!--<el-input v-model="user.password"></el-input>-->
                            <!--</div>-->
                            <!--<div class="right" v-else="edit">{{user.password}}</div>-->
                            <!--</li>-->
                        </ul>
                        <transition name="slide-fade">
                            <div v-if="userType==='安装人员'" style="margin-top: 15px">
                                <el-button type="primary" @click="showTransfer()">选择电梯</el-button>
                                <el-button type="primary" @click="showTransfer()">选择采集仪</el-button>
                            </div>
                        </transition>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="权限管理" name="second">
                    <div style="display: flex;align-items: center;margin-top: 15px;justify-content: space-between">
                        <el-button type="primary" @click="showDialog">添加电梯</el-button>
                        <div>
                            <span style="margin-right: 15px;color: #3C8DBC">是否允许登录</span>
                            <el-switch v-model="user.is_enabled" @change="toggleEnabled(user)"></el-switch>
                        </div>
                    </div>
                    <el-table
                            :data="tableData"
                            style="width: 100%;margin-top: 15px;color: #3C8DBC;font-size: 14px">
                        <el-table-column
                                width="80"
                                prop="lift.id"
                                label="ID">
                        </el-table-column>
                        <el-table-column
                                prop="lift.name"
                                label="电梯名称">
                        </el-table-column>
                        <el-table-column
                                prop="lift.address"
                                label="地址">
                        </el-table-column>
                    </el-table>
                    <paginate style="border: none" :api="list_url" :params="list_params" :refresh="refresh"
                              @val-change="onValChange"></paginate>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog title="" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
            <el-transfer style="display: flex;align-items: center;justify-content: center" filterable
                         v-model="data_select"
                         :titles="['待选', '已选']"
                         :data="transfer.data">
            </el-transfer>
            <span slot="footer" class="dialog-footer">
                <el-pagination style="float: left"
                               :page-size.sync="transfer.pageSize"
                               :current-page.sync="transfer.currentPage"
                               @current-change="changePage"
                               small
                               layout="prev, pager, next"
                               :total="transfer.total"
                               background>
                </el-pagination>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialog_confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    import paginate from '../../components/Paginate'

    export default {
        components: {
            paginate
        },
        data() {
            return {
                value3: true,
                value4: true,
                dialogVisible: false,
                data_select: [],
                transfer: {
                    "pageSize": 10,
                    "total": null,
                    "currentPage": 1,
                    "data": [],
                },
                popoverInputVal: '',
                popover: {
                    "pageSize": 5,
                    "total": 25,
                    "currentPage": 1,
                    "data": []
                },
                //--------------
                userChangeCount: 0,
                hasSave: true,
                userId: null,
                edit: false,
                addUser: false,
                company_name: '',
                user: {
                    "company_id": null,
                    "roles": ['ROLE_CLIENT']
                },
                roles: [],
                activeName: 'index',
                userType: [],
                userOptions: [{
                    value: 'ROLE_ADMIN',
                    label: '管理员'
                }, {
                    value: 'ROLE_DEVELOPER',
                    label: '开发人员'
                }, {
                    value: 'ROLE_CLIENT_ADMIN',
                    label: '物业管理员'
                }, {
                    value: 'ROLE_CLIENT',
                    label: '物业'
                }, {
                    value: 'ROLE_MAINTAINER_ADMIN',
                    label: '维保管理员'
                }, {
                    value: 'ROLE_MAINTAINER',
                    label: '维保'
                }, {
                    value: 'ROLE_INSTALLER_ADMIN',
                    label: '安装人员管理员'
                }, {
                    value: 'ROLE_INSTALLER',
                    label: '安装人员'
                }],

                list_url: '/dm/lift/list/user_id',
                list_params: {
                    "user_id": this.$route.query.id,
                    "page_proto": {
                        "page": 1,
                        "property": "id",
                        "size": 10,
                        "sort": "DESC"
                    }
                },
                refresh: false,
                tableData: [],
            }
        },
        filters: {
            userTypeFrm(val) {
                if (val === 'ROLE_ADMIN') return '管理员';
                if (val === 'ROLE_DEVELOPER') return '开发人员';
                if (val === 'ROLE_CLIENT_ADMIN') return '物业管理员';
                if (val === 'ROLE_CLIENT') return '物业';
                if (val === 'ROLE_MAINTAINER_ADMIN') return '维保管理员';
                if (val === 'ROLE_MAINTAINER') return '维保';
                if (val === 'ROLE_INSTALLER_ADMIN') return '安装人员管理员';
                if (val === 'ROLE_INSTALLER') return '安装人员';
                return val;
            }
        },
        watch: {
            'user': {
                handler: function () {
                    this.userChangeCount += 1;
                    if (this.userChangeCount > 1) {
                        this.hasSave = false;
                    }
                },
                deep: true
            }
        },
        methods: {
            toggleEnabled(data) {
                if (data.cellphone === null) {
                    this.$message({
                        message: '此用户没有录入手机号',
                        type: 'error'
                    });
                    data.is_enabled = !data.is_enabled;
                    return false;
                }
                this.$req.post('/authentication/set_enabled', {
                    "cellphone": data.cellphone,
                    "is_enable": data.is_enabled
                }).then(() => {
                    this.$message({
                        message: '更改用户状态成功!',
                        type: 'success'
                    });
                });
            },
            showDialog() {
                this.dialogVisible = true;
                this.data_select = [];
                this.changePage();
            },
            dialog_confirm() {
                this.dialogVisible = false;
                this.addLiftsToUser();
            },
            addLiftsToUser() {
                let params = {
                    "lifts_ids": this.data_select,
                    "user_id": Number(this.$route.query.id)
                };
                console.log(params);
                this.$req.post('/dm/lifts_users/lifts/add', params).then((result) => {
                    if (result.Code === 7000) {
                        this.$message({
                            type: 'success',
                            message: '添加成功'
                        });
                    }
                })
            },
            setCompanyName(item) {
                this.company_name = item.name;
                this.user.company_id = item.id
            },
            changePage1() {
                let params = {
                    "page": this.popover.currentPage,
                    "property": "id",
                    "size": this.popover.pageSize,
                    "sort": "DESC"
                };
                this.$req.post('/dm/company/all', params).then((result) => {
                    console.log(result);
                    this.popover.total = result.total_elements;
                    this.popover.data = [...result.content]
                })
            },
            popoverSearch() {
                let params = {
                    "page_proto": {
                        "page": 1,
                        "property": "id",
                        "size": 10,
                        "sort": "DESC"
                    },
                    "value": this.popoverInputVal
                };
                this.$req.post('/dm/company/fuzzy/search', params).then((result) => {
                    console.log(result);
                    this.popover.total = result.total_elements;
                    this.popover.data = [...result.content]
                })
            },
            changePage() {
                let params = {
                    "company_id": this.user.company_id,
                    "page_proto": {
                        "page": this.transfer.currentPage,
                        "property": "id",
                        "size": this.transfer.pageSize,
                        "sort": "DESC"
                    }
                };
                let url = '/dm/lift/list/company_id';
                this.$req.post(url, params).then((result) => {
                    console.log(result);
                    this.transfer.total = result.total_elements;
                    this.transfer.data = [];
                    result.content.forEach((item) => {
                        this.transfer.data.push({"key": item.id, "label": item.name})
                    })
                })
            },
            onValChange(data) {
                //console.log(data)
                this.tableData = data
            },
            disableUser(cellphone) {
                this.$req.post('/authentication', cellphone).then((result) => {
                    console.log(result)
                })
            },
            createUser() {
                if (this.user.username === undefined) {
                    this.$message({
                        type: 'error',
                        message: '用户名不能为空'
                    });
                    return false;
                }
                let params = this.user;
                this.$req.post('/authentication/signup', params).then((result) => {
                    if (result.Code === 7000) {
                        this.hasSave = true;
                        this.list_params.user_id = result.id;
                        this.$router.go(-1);
                        this.$message({
                            type: 'success',
                            message: '创建用户成功'
                        })
                    }
                })
            },
            findUser() {
                this.$req.post('/user/fetch', {"id": this.$route.query.id}).then((result) => {
                    console.log(result);
                    this.user = result.user;
                    this.roles = result.roles;
                    if (this.user.company_id === null) return;
                    this.$req.post('/dm/company/fetch', {"id": this.user.company_id}).then((result) => {
                        this.company_name = result.name
                    })
                })
            },
            updateUser() {
                let params = {
                    user: this.user,
                    roles: this.roles,
                };
                this.$req.post('/user/update', params).then((result) => {
                    if (result.Code === 7000) {
                        this.hasSave = true;
                        this.$router.go(-1);
                        this.$message({
                            message: '更新成功',
                            type: 'success'
                        })
                    }
                })
            },
            toggleEdit() {
                this.edit = !this.edit;
            },
            showTransfer(params) {
                this.dialogVisible = true;
            },
            handleClose(done) {
                done();
            },
            save() {
                if (this.addUser === false) {
                    this.updateUser();
                } else if (this.addUser === true) {
                    this.createUser();
                }
            }
        },
        beforeRouteLeave(to, from, next) {
            if (this.hasSave === false) {
                next(false);
                this.$confirm('内容未保存, 是否继续退出?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    next();
                }).catch(() => {
                });
            } else {
                next()
            }
        },
        mounted() {
            if (this.$route.query.id !== null) {
                this.edit = false;
                this.userId = this.$route.query.id;
                this.findUser();
            } else {
                this.edit = true;
                this.addUser = true;
            }
        }
    }
</script>
<style scoped lang="less">
</style>
