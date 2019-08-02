<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="box-card-header">
                <span class="name">{{ user.name}}</span>
                <el-button type="primary" icon="el-icon-check" style="float: right" @click="addOrUpdateUser()">
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
                                    <el-input v-model="user.name" clearable></el-input>
                                </div>
                                <div class="right" v-else="edit">{{user.name}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-phone"></i></div>
                                <div class="center">手机</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="user.phone" clearable></el-input>
                                </div>
                                <div class="right" v-else="edit">{{user.phone}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-address-book-o"></i></div>
                                <div class="center">用户类型</div>
                                <div class="right" v-if="edit">
                                    <el-select class="multiple-select" v-model="roles" multiple placeholder="请选择"
                                               value=""
                                               style="height: 32px;width: 100%" size="small" clearable collapse-tags>
                                        <el-option
                                                v-for="item in roleOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="right" v-else="edit">
                                    <span style="margin-right: 15px"
                                          v-for="(item,index2) in user.roles"
                                          :key="index2">{{item.name}}
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
                                                    <!--<el-input placeholder="请输入名称" v-model="popoverInputVal"-->
                                                    <!--@clear="changePage1" clearable-->
                                                    <!--@keyup.native.enter="popoverSearch">-->
                                                    <!--<el-button slot="append" icon="el-icon-search"-->
                                                    <!--@click="popoverSearch"></el-button>-->
                                                    <!--</el-input>-->
                                                    <el-pagination
                                                            :page-size.sync="popover.pageSize"
                                                            :current-page.sync="popover.currentPage"
                                                            @current-change="changePage1"
                                                            normal
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
                                    <el-input style="flex: 1" v-model="group_name"
                                              disabled></el-input>
                                </div>
                                <div class="right" v-else>{{user.group?user.group.name:''}}
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span style="margin-right: 15px;color: #3C8DBC">是否允许登录</span>
                                    <el-switch v-model="user.status" :active-value="1" :inactive-value="0"></el-switch>
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="电梯列表" name="second">
                    <div style="display: flex;align-items: center;margin-top: 15px;justify-content: space-between">
                        <el-button type="primary" @click="showDialog">添加电梯</el-button>
                    </div>
                    <el-table
                            :data="user.lifts"
                            style="width: 100%;margin-top: 15px;color: #3C8DBC;font-size: 14px">
                        <el-table-column
                                prop="id"
                                label="电梯ID">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="电梯名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click="removeLift(scope.row)" size="mini">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog title="" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
            <el-transfer style="display: flex;align-items: center;justify-content: center"
                         v-model="data_select"
                         :titles="['待选', '已选']"
                         :data="transfer.data">
            </el-transfer>
            <span slot="footer" class="dialog-footer">
                <el-pagination style="float: left"
                               :page-size.sync="transfer.pageSize"
                               :current-page.sync="transfer.currentPage"
                               @current-change="changePage"
                               normal
                               layout="prev, pager, next"
                               :total="transfer.total"
                               background>
                </el-pagination>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button :loading="loading" type="primary" @click="dialog_confirm">确 定</el-button>
            </span>
            <span slot="title">
                <el-input placeholder="搜索内容，电梯名称/物业单位名称/维保单位名称" style="width: 50%;font-size: 12px" @clear="search()"
                          @keyup.native.enter="search()" clearable
                          v-model="transfer.search_content">
                     <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
                </el-input>
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
                //--------------transfer--------------
                dialogVisible: false,
                loading: false,
                data_select: [],
                transfer: {
                    "pageSize": 10,
                    "total": null,
                    "currentPage": 1,
                    "data": [],
                    "search_content": ''
                },
                allLift_url: '/Lifts/listPage',

                //--------------
                popoverInputVal: '',
                popover: {
                    "pageSize": 10,
                    "total": 0,
                    "currentPage": 1,
                    "data": []
                },
                userChangeCount: 0,
                hasSave: true,
                userId: null,
                edit: false,
                addUser: false,
                company_name: '',
                user: {},
                group_name:'',
                roles: [],
                activeName: 'index',
                userType: [],
                roleOptions: []
            }
        },
        filters: {},
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
            showDialog() {
                this.dialogVisible = true;
                this.data_select = [];
                this.transfer = {
                    "pageSize": 10,
                    "total": null,
                    "currentPage": 1,
                    "data": [],
                    "search_content": ''
                };
                this.changePage();
            },
            dialog_confirm() {
                this.loading = true;
                let params = {
                    "user_id": this.user.id,
                    "lift_ids": this.data_select
                };
                this.$api_v3.post('/AuUser/addLifts', params).then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        if (res.code === 0) {
                            this.$message.success('操作成功');
                            this.findUser(this.user.id);
                        } else {
                            this.$message.error(res.data)
                        }
                    }
                }).finally(() => {
                    this.loading = false;
                    this.dialogVisible = false;
                });
            },
            changePage() {
                let params = {};
                params = {
                    "page": this.transfer.currentPage,
                    "list_rows": this.transfer.pageSize,
                    "search_content": this.transfer.search_content,
                    "sort": {"id": 1}
                };
                this.$api_v3.post(this.allLift_url, params).then((res) => {
                    console.log(res);
                    this.transfer.total = res.data.total;
                    this.transfer.data = [];
                    res.data.data.forEach((item) => {
                        this.transfer.data.push({"key": item.id, "label": item.name})
                    })
                })
            },
            search() {
                this.transfer.currentPage = 1;
                this.changePage();
            },
            removeLift(row) {
                let params = {
                    "user_id": this.user.id,
                    "lift_ids": [row.id]
                };
                this.$confirm('移除该电梯', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api_v3.post('/AuUser/deleteLifts', params).then((res) => {
                        console.log(res);
                        if (res.code === 0) {
                            let index = this.user.lifts.findIndex((i) => {
                                return i.id === row.id;
                            });
                            if (index !== -1) {
                                this.user.lifts.splice(index, 1);
                            }
                        } else {
                            this.$message.error('移除失败   ')
                        }
                    })
                }).catch(() => {
                });
            },
            findUser(id) {
                this.$api_v3.post('/AuUser/read', {"id": id}).then((res) => {
                    console.log("/AuUser/read", res);
                    if (res.code === 0) {
                        this.user = res.data;
                        this.user.roles.forEach((i) => {
                            this.roles.push(i.id)
                        });
                        this.group_name = this.user.group?this.user.group.name:'';
                    }
                })
            },
            addOrUpdateUser() {
                let params = this.user;
                params.role_ids = this.roles;
                this.$api_v3.post('/AuUser/save', params).then((res) => {
                    console.log('/AuUser/save', res);
                    if (res.code === 0) {
                        this.$message.success('操作成功');
                    } else {
                        this.$message.error('操作失败');
                    }
                })
            },
            toggleEdit() {
                this.edit = !this.edit;
            },
            handleClose(done) {
                done();
            },
            setCompanyName(item) {
                this.group_name = item.name;
                this.user.group_id = item.id;
                this.user.group={};
                this.user.group.name = item.name;
                this.user.group.id = item.id;
            },
            changePage1() {
                let params = {
                    "page": this.popover.currentPage,
                    "list_rows": this.popover.pageSize,
                    "sort": [{"id": 1}]
                };
                this.$api_v3.post('/Group/listPage', params).then((result) => {
                    console.log(result);
                    if (result.code === 0) {
                        this.popover.total = result.data.total;
                        this.popover.data = result.data.data;
                    }
                })
            },
            getAllRoles() {
                this.$api_v3.post('/AuRole/listPage', {}).then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        res.data.data.forEach((i) => {
                            this.roleOptions.push({"value": i.id, "label": i.name})
                        })
                    }
                })
            },
        },
        // beforeRouteLeave(to, from, next) {
        //     if (this.hasSave === false) {
        //         next(false);
        //         this.$confirm('内容未保存, 是否继续退出?', '提示', {
        //             confirmButtonText: '确定',
        //             cancelButtonText: '取消',
        //             type: 'warning'
        //         }).then(() => {
        //             next();
        //         }).catch(() => {
        //         });
        //     } else {
        //         next()
        //     }
        // },
        mounted() {
            this.getAllRoles();
            if (this.$route.query.id !== null) {
                this.edit = false;
                this.userId = this.$route.query.id;
                this.findUser(this.$route.query.id);
            } else {
                this.edit = true;
                this.addUser = true;
            }
        }
    }
</script>
<style lang="less">
    .el-input.el-input--small.el-input--suffix {
        input {
            height: 32px !important;
        }
    }

    .multiple-select > .el-select__tags {
        top: 70%;
    }
</style>
