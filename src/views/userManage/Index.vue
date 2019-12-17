<template>
    <div class="user-list">
        <ToolBar>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addUser()">添加</el-button>
            <el-button type="primary" @click="multipleHandle" v-show="selectData.length">批量禁用/允许</el-button>
            <el-button type="danger" @click="multipleDelete" v-show="selectData.length">批量删除</el-button>
            <div style="float: right">
                <el-select style="width: 100px" v-model="params.type" placeholder="用户类型" size="small" clearable
                           value="">
                    <el-option
                            v-for="item in typeOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select style="width: 100px" v-model="params.status" placeholder="用户状态" size="small" clearable
                           value="">
                    <el-option
                            v-for="item in statusOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input
                        placeholder="请输入姓名/手机号/所属单位"
                        size="small"
                        style="width: 220px"
                        v-model="params.name"
                        @clear="searchUser()"
                        @keyup.native.enter="searchUser()"
                        clearable>
                </el-input>
                <el-button @click="searchUser()" type="success" icon="el-icon-search"
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
                    width="100"
                    prop="id"
                    label="用户ID">
                <template slot="header" slot-scope="scope">
                    用户ID
                    <table-sort @ascending="onAscOrDesc('id',0)"
                                @descending="onAscOrDesc('id',1)"
                                @reset="onReset('id')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="手机号">
                <template slot="header" slot-scope="scope">
                    手机号
                    <table-sort @ascending="onAscOrDesc('phone',0)"
                                @descending="onAscOrDesc('phone',1)"
                                @reset="onReset('phone')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名">
                <template slot="header" slot-scope="scope">
                    姓名
                    <table-sort @ascending="onAscOrDesc('name',0)"
                                @descending="onAscOrDesc('name',1)"
                                @reset="onReset('name')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    prop="roles"
                    label="用户类型">
                <template slot-scope="scope">
                    <el-tag v-for="i in scope.row.roles" style="margin: 0 2px" type="info">
                        {{i}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    prop="company_name"
                    label="所属单位">
                <template slot="header" slot-scope="scope">
                    所属单位
                    <table-sort @ascending="onAscOrDesc('company_name',0)"
                                @descending="onAscOrDesc('company_name',1)"
                                @reset="onReset('company_name')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    prop="status"
                    width="150"
                    label="禁用/允许登录">
                <div slot-scope="scope" style="width: 100%;">
                    <el-tag v-if="scope.row.status">允许</el-tag>
                    <el-tag v-else type="danger">禁用</el-tag>
                </div>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    :render-header="tableAction"
                    width="180">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="重置密码为'123456'" placement="top">
                        <el-button @click="resetPassword(scope.row)" type="warning" style="transition: .4s;"
                                   :ref="scope.row.id" icon="el-icon-refresh" size="small" circle></el-button>
                    </el-tooltip>
                    <el-button @click="editUser(scope.row.id)" type="primary" icon="el-icon-edit" size="small"
                               circle></el-button>
                    <el-tooltip class="item" effect="dark" content="是否允许登录" placement="top">
                        <el-button @click="changeStatus(scope.row)" type="primary" icon="fa fa-hand-pointer-o"
                                   size="small"
                                   circle></el-button>
                    </el-tooltip>
                    <el-button type="danger" @click="deleteUser(scope.row.id)"
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
    import TableSort from "../../components/TableSort"

    export default {
        data() {
            return {
                paginate_api: '/AuUser/listPage',
                paginate_params: {
                    "page": 1,
                    "size": 10,
                    "sort": {}
                },
                refresh: false,
                params: {
                    name: '',
                    status: '',
                    type: ''
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
                typeOption: [
                    {
                        value: 1,
                        label: '维保'
                    }, {
                        value: 2,
                        label: '物业'
                    }
                ],
                usersData: []
            }
        },
        filters: {},
        methods: {
            onValChange(data) {
                this.selectData = [];
                data.forEach((i) => {
                    if (i.roles === null) {
                        i.roles = [];
                    } else {
                        i.roles = i.roles.split(',');
                    }
                });
                this.usersData = data;
            },
            onSelectionChange(selection, row) {
                console.log(selection);
                this.selectData = selection;
            },
            multipleDelete() {
                let ids = [];
                this.selectData.forEach((i) => {
                    ids.push(i.id)
                });
                this.$api_v3.post('/AuUser/removeList', {ids: ids}).then((res) => {
                    if (res.code === 0) {
                        this.$message.success(res.msg)
                        this.refresh = !this.refresh
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            multipleHandle() {
                let param = {list: [...this.selectData]};
                param.list.forEach((i) => {
                    i.status = i.status ? 0 : 1
                });
                this.$api_v3.post('/AuUser/saveList', param).then((res) => {
                    console.log('/AuUser/saveList', res);
                    if (res.code === 0) {
                        this.$message.success(res.msg)
                    } else {
                        this.$message.error(res.msg)
                    }
                });
            },
            deleteUser(id) {
                this.$confirm("此操作将删除用户，是否继续？", "提示", {
                    type: "warning",
                    confirmButtonText: '确定',
                    cancelButtonClass: '取消'
                }).then(() => {
                    this.$api_v3.post('/AuUser/remove', {"id": id}).then((res) => {
                        console.log('/AuUser/remove', res);
                        if (res.code === 0) {
                            this.$message.success('操作成功');
                            this.refresh = !this.refresh
                        } else {
                            this.$message.error('操作失败');
                        }
                    })
                }).catch(() => {
                })
            },
            searchUser() {
                this.paginate_params.page = 1;
                this.paginate_params.user_status = this.params.status;
                this.paginate_params.company_type = this.params.type;
                this.paginate_params.search_content = this.params.name;
                this.refresh = !this.refresh;
            },
            tableAction() {
                return this.$createElement('HelpHint', {
                    props: {
                        content: ' 重置密码 / 编辑用户 / 禁用或允许登录 / 删除用户'
                    }
                }, '操作');
            },
            onAscOrDesc(str, num) {
                console.log(str, num);
                this.paginate_params.sort[str] = num;
                this.refresh = !this.refresh;
            },
            onReset(str) {
                delete this.paginate_params.sort[str];
                this.refresh = !this.refresh;
            },
            addUser(id = null) {
                this.$router.push({path: '/user_detail', query: {id: id}})
            },
            editUser(id) {
                this.$router.push({path: '/user_detail', query: {id: id}})
            },
            changeStatus(row) {
                let params = {
                    "id": row.id,
                    "status": row.status === 1 ? 0 : 1
                };
                this.$api_v3.post('/AuUser/save', params).then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        row.status = row.status === 1 ? 0 : 1;
                        this.$message.success('操作成功')
                    } else {
                        this.$message.error(res.data)
                    }
                })
            },
            resetPassword(row) {
                let params = {
                    "id": row.id,
                    "password": '12345678'
                };
                this.$confirm('此操作将重置密码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let dom = this.$refs[row.id].$el;
                    dom.style.transform = 'rotate(180deg)';
                    this.$api_v3.post('/AuUser/save', params).then((result) => {
                        console.log(result);
                        if (result.code === 0) {
                            this.$message.success('操作成功');
                        } else {
                            this.$message.error(result.data);
                        }
                    }).finally(() => {
                        dom.style.transform = 'rotate(0deg)'
                    })
                }).catch(() => {
                });
            }
        },
        mounted() {
        },
        components: {
            ToolBar, HelpHint, Paginate, TableSort
        }
    }
</script>
<style lang="less">
</style>
