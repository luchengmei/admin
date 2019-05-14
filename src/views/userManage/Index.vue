<template>
    <div class="user-list">
        <ToolBar>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="editUser()">添加</el-button>
            <el-button type="primary" @click="multipleHandle">批量禁用/允许</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="multipleDelete">批量删除</el-button>
            <div style="float: right">
                <!--<el-select style="width: 100px" v-model="params.status" placeholder="所属单位" size="small" clearable-->
                <!--value="">-->
                <!--<el-option-->
                <!--v-for="item in statusOption"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--<el-select style="width: 100px" v-model="params.status" placeholder="用户类型" size="small" clearable-->
                <!--value="">-->
                <!--<el-option-->
                <!--v-for="item in statusOption"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--<el-select style="width: 100px" v-model="params.status" placeholder="用户状态" size="small" clearable-->
                <!--value="">-->
                <!--<el-option-->
                <!--v-for="item in statusOption"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <el-input
                        placeholder="请输入姓名/手机号/所属单位"
                        size="small"
                        style="width: 220px"
                        v-model="params.name"
                        @clear="initList"
                        @keyup.native.enter="searchUser(params.name)"
                        clearable>
                </el-input>
                <el-button @click="searchUser(params.name)" type="success" icon="el-icon-search"
                           size="small"></el-button>
            </div>
        </ToolBar>
        <el-table
                @select="onSelectionChange"
                @select-all="onSelectionChange"
                :data="usersData"
                border
                ref="table"
                style="width: 100%">
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column
                    prop="cellphone"
                    label="手机号">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名">
            </el-table-column>
            <el-table-column
                    prop="roles"
                    label="用户类型">
                <template slot-scope="scope">
                    <span v-for="item in scope.row.roles" style="margin-right: 10px">{{item|userTypeFrm}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="company_name"
                    label="所属单位">
            </el-table-column>
            <el-table-column
                    prop="is_enabled"
                    width="150"
                    label="禁用/允许登录">
                <div slot-scope="scope" style="width: 100%;">
                    <el-tag v-if="scope.row.is_enabled">允许</el-tag>
                    <el-tag v-else type="danger">禁用</el-tag>
                </div>
            </el-table-column>
            <el-table-column
                    label="操作"
                    :render-header="tableAction"
                    width="180">
                <template slot-scope="scope">
                    <el-button @click="resetting(scope.row)" type="warning" style="transition: .4s;"
                               :ref="scope.row.id" icon="el-icon-refresh" size="small" circle></el-button>
                    <el-button @click="editUser(scope.row.id)" type="primary" icon="el-icon-edit" size="small"
                               circle></el-button>
                    <el-button @click="toggleEnabled(scope.row)" v-if="scope.row.is_enabled" type="warning"
                               icon="el-icon-close" circle size="small"></el-button>
                    <el-button @click="toggleEnabled(scope.row)" v-else icon="el-icon-check" circle
                               size="small"></el-button>
                    <el-button type="danger" @click="deleteUser([scope.row.cellphone])"
                               icon="el-icon-delete" circle size="small"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <paginate :api="paginate_api" :params="paginate_params" @val-change="onValChange" :refresh="refresh"></paginate>
    </div>
</template>

<script>
    import ToolBar from '@/components/ToolBar.vue';
    import HelpHint from '@/components/HelpHint.vue';
    import Paginate from "../../components/Paginate";

    export default {
        data() {
            return {
                paginate_api: '/user/list/is_alive',
                paginate_params: {
                    "is_alive": true,
                    "page_proto": {
                        "page": 1,
                        "property": "id",
                        "size": 10,
                        "sort": "DESC"
                    }
                },
                refresh: false,
                params: {
                    name: '',
                    status: ''
                },
                selectData: [],
                statusOption: [
                    {
                        value: 1,
                        label: '允许'
                    }, {
                        value: 0,
                        label: '禁用'
                    }
                ],
                usersData: []
            }
        },
        filters: {
            userTypeFrm(val) {
                if (val === 'ROLE_ADMIN') return '管理员';
                if (val === 'ROLE_DEVELOPER') return '开发人员';
                if (val === 'ROLE_CLIENT_ADMIN') return '客户管理员';
                if (val === 'ROLE_CLIENT') return '客户';
                if (val === 'ROLE_MAINTAINER_ADMIN') return '维保管理员';
                if (val === 'ROLE_MAINTAINER') return '维保';
                if (val === 'ROLE_INSTALLER_ADMIN') return '安装人员管理员';
                if (val === 'ROLE_INSTALLER') return '安装人员';
                if (val === 'ROLE_SUPER_ADMIN') return '超级管理员';
                return val;
            }
        },
        methods: {
            initList() {
                this.paginate_api = '/user/list/is_alive';
                this.paginate_params = {
                    "is_alive": true,
                    "page_proto": {
                        "page": 1,
                        "property": "id",
                        "size": 10,
                        "sort": "DESC"
                    }
                };
                this.refresh = !this.refresh
            },
            onValChange(data) {
                console.log(data);
                this.usersData = data;
            },
            onSelectionChange(selection, row) {
                console.log(selection);
                this.selectData = selection;
            },
            multipleDelete() {
                if (this.selectData.length === 0) {
                    this.$message({type: 'info', message: '请先选中需要删除的用户'}
                    );
                    return false;
                } else {
                    let arr = [];
                    this.selectData.forEach((item)=>{
                        arr.push(item.cellphone)
                    });
                    this.deleteUser(arr);
                }
            },
            multipleHandle() {
                if (this.selectData.length === 0) {
                    this.$message({type: 'info', message: '请先选中需要处理的用户'}
                    );
                    return false;
                } else {
                    this.usersData.forEach((item) => {//Find the item in userData and also in selectData, then change it's status
                        if (this.selectData.some((item1) => {
                            return item === item1;
                        })) {
                            this.toggleEnabled(item);
                        }
                    });
                }
            },
            deleteUser(arr) {
                this.$confirm("此操作将删除所选用户，是否继续？", "提示", {
                    type: "warning",
                    confirmButtonText: '确定',
                    cancelButtonClass: '取消'
                }).then(() => {
                    this.$req.post('/authentication/batch_remove', arr).then((result) => {
                        if (result.Code === 7000) {
                            arr.forEach((item) => {//Find the item in userData and also in arr, then delete it
                                let index = this.usersData.findIndex((val)=>{
                                    return val.cellphone == item;
                                });
                                this.usersData.splice(index,1)
                            });
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            })
                        }
                    })
                }).catch(() => {
                })
            },
            toggleEnabled(data) {
                if (data.cellphone === null) {
                    this.$message({
                        message: '此用户没有录入手机号',
                        type: 'error'
                    });
                    return false;
                }
                this.$req.post('/authentication/set_enabled', {
                    "cellphone": data.cellphone,
                    "is_enabled": !data.is_enabled
                }).then(() => {
                    data.is_enabled = data.is_enabled !== true;
                    this.$message({
                        message: '更改用户状态成功!',
                        type: 'success'
                    });
                });
            },
            findAllUsers() {
            },
            searchUser(value) {
                this.paginate_api = '/user/fuzzy/search';
                this.paginate_params = {
                    "page_proto": {
                        "page": 1,
                        "property": "id",
                        "size": 10,
                        "sort": "DESC"
                    },
                    "value": value
                };
                this.refresh = !this.refresh;
            },
            tableAction() {
                return this.$createElement('HelpHint', {
                    props: {
                        content: ' 重置密码 / 编辑用户 / 禁用或允许登录 / 删除用户'
                    }
                }, '操作');
            },
            editUser(id = null) {
                this.$router.push({path: '/user_detail', query: {id: id}})
            },
            resetting(row) {
                this.$confirm('此操作将重置密码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let dom = this.$refs[row.id].$el;
                    dom.style.transform = 'rotate(180deg)';
                    if (row.cellphone == null) {
                        this.$message({
                            message: '重置密码失败，此用户没有手机号',
                            type: 'error'
                        });
                        return false;
                    }
                    this.$req.post('/authentication/password/reset', row.cellphone).then((result) => {
                        //console.log(result);
                        this.$message({
                            message: '重置密码成功，密码为888888',
                            type: 'success'
                        });
                    }).finally(() => {
                        dom.style.transform = 'rotate(0deg)'
                    })
                }).catch(() => {
                });
            },
        },
        mounted() {
        },
        components: {
            ToolBar, HelpHint, Paginate
        }
    }
</script>
<style lang="less">
</style>
