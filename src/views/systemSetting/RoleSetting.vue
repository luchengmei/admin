<template>
    <el-card class="container">
        <div class="container_left">
            <div style="text-align: center;padding: 20px">
                <el-button type="primary" style="width: 150px" @click="createRole">新建角色</el-button>
            </div>
            <div class="companyType-list">
                <span :class="current ===i.id?'active':''" v-for="i in roles"
                      @click="changeCurrent(i.id)">{{i.name}}
                </span>
            </div>
        </div>
        <div class="container_right">
            <el-tabs v-model="activeName">
                <el-tab-pane label="角色配置" name="first">
                    <div>
                        <el-form ref="form" :model="role" :rules="rules" label-width="150px" label-position="left">
                            <el-form-item label="角色名称" prop="name">
                                <el-input v-model="role.name" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="电梯查看级别">
                                <el-select v-model="role.lifts_limit_level" placeholder="请选择级别">
                                    <el-option value="0"></el-option>
                                    <el-option value="1"></el-option>
                                    <el-option value="2"></el-option>
                                </el-select>
                                <span style="color: #666666;font-size: 14px">(0:无限制,1:只能查看本组电梯,2:只能查看管理员分配的电梯)</span>
                            </el-form-item>
                            <el-form-item label="可访问平台">
                                <el-checkbox v-for="platform in platforms" v-model="platform.value"
                                             :label="platform.name" border></el-checkbox>
                            </el-form-item>
                            <el-form-item label="角色权限">
                                <el-checkbox v-for="authority in authorities" v-model="authority.value"
                                             :label="authority.name" border></el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" :loading="saveLoading" @click="saveRole()">保存</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="角色用户" name="second">
                    <div>
                        <el-button type="primary" @click="showDialog()">添加用户</el-button>
                    </div>
                    <el-table
                            v-loading="loading"
                            :data="role.users">
                        <el-table-column
                                prop="name"
                                label="用户">
                        </el-table-column>
                        <el-table-column
                                prop="phone"
                                label="账号">
                        </el-table-column>
                        <el-table-column
                                prop="created_at"
                                label="创建时间">
                        </el-table-column>
                        <el-table-column
                                label="操作">
                            <template slot-scope="scope">
                                <el-button @click="router_user(scope.row.id)" size="mini">查看</el-button>
                                <el-button size="mini" @click="removeUser(scope.row)">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
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
                <el-button :loading="btn_loading" type="primary" @click="dialog_confirm">确 定</el-button>
            </span>
            <span slot="title">
                <el-input placeholder="搜索内容，电梯名称/物业单位名称/维保单位名称" style="width: 50%;font-size: 12px" @clear="search()"
                          @keyup.native.enter="search()" clearable
                          v-model="transfer.search_content">
                     <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
                </el-input>
            </span>
        </el-dialog>
    </el-card>
</template>

<script>
    import ToolBar from '@/components/ToolBar.vue';

    export default {
        name: "RoleSetting",
        components: {
            ToolBar
        },
        data() {
            return {
                tableData: [],
                loading: false,
                saveLoading: false,
                roles: [],//所有角色
                role: {},
                rules: {
                    name: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'}
                    ],
                },
                platforms: [],//所有平台
                authorities:[],//所有权限
                current: null,
                activeName: 'first',
                //--------------transfer--------------
                dialogVisible: false,
                btn_loading: false,
                data_select: [],
                transfer: {
                    "pageSize": 10,
                    "total": null,
                    "currentPage": 1,
                    "data": [],
                    "search_content": ''
                },
                allUser_url: '/AuUser/listPage',
            }
        },
        mounted() {
            this.getRolesList();
            this.getAllPlatforms();
            this.getAllAuthorities();
        },
        filters: {},
        watch: {},
        methods: {
            getAllPlatforms() {
                this.$api_v3.post('/Platform/listPage', {}).then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        this.platforms = res.data.data;
                    }
                })
            },
            getAllAuthorities(){
                this.$api_v3.post('/Authority/listPage',{}).then((res)=>{
                    console.log(res);
                    if(res.code===0){
                        this.authorities = res.data.data;
                    }
                })
            },
            createRole() {
                this.$prompt('请输入角色名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({value}) => {
                    this.$api_v3.post('/AuRole/save', {"name": value}).then((res) => {
                        console.log(res);
                        if (res.code === 0) {
                            this.$message.success('操作成功');
                            this.getRolesList();
                        } else {
                            this.$message.error(res.data)
                        }
                    })
                }).catch(() => {
                });
            },
            saveRole() {
                this.saveLoading = true;
                let params = {
                    "id": this.role.id,
                    "name": this.role.name,
                    "lifts_limit_level": this.role.lifts_limit_level,
                    "platform_ids": [],
                    "authority_ids":[]
                };
                this.platforms.forEach((item) => {
                    if (item.value) {
                        params["platform_ids"].push(item.id);
                    }
                });
                this.authorities.forEach((item) => {
                    if (item.value) {
                        params["authority_ids"].push(item.id);
                    }
                });
                this.$api_v3.post('/AuRole/save', params).then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        this.$message.success('保存成功')
                    } else {
                        this.$message.error(res.data)
                    }
                }).finally(() => {
                    this.saveLoading = false;
                })
            },
            readRole(id) {
                this.$api_v3.post('/AuRole/read', {"id": id}).then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        this.role = res.data;
                        this.platforms.forEach((platform) => {
                            this.$set(platform, "value", false)
                        });
                        this.authorities.forEach((authority) => {
                            this.$set(authority, "value", false)
                        });
                        this.role.platforms.forEach((item) => {
                            let index = this.platforms.findIndex((i) => {
                                return i.id === item.id;
                            });
                            this.platforms[index].value = index !== -1;
                        });
                        this.role.authorities.forEach((item) => {
                            let index = this.authorities.findIndex((i) => {
                                return i.id === item.id;
                            });
                            this.authorities[index].value = index !== -1;
                        })
                    }
                })
            },
            getRolesList() {
                this.$api_v3.post('/AuRole/listPage').then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        this.roles = res.data.data;
                        this.current = res.data.data[0].id;
                        this.readRole(res.data.data[0].id);
                    }
                });
            },
            changeCurrent(role_id) {
                if (role_id !== this.current) {
                    this.current = role_id;
                    this.readRole(role_id);
                }
            },
            router_user(id) {
                this.$router.push({path: '/user_detail', query: {id: id}})
            },
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
                this.btn_loading = true;
                let params = {
                    "role_id": this.role.id,
                    "user_ids": this.data_select
                };
                this.$api_v3.post('/AuRole/addUsers', params).then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        if (res.code === 0) {
                            this.$message.success('操作成功');
                            this.readRole(this.role.id);
                        } else {
                            this.$message.error(res.data)
                        }
                    }
                }).finally(() => {
                    this.btn_loading = false;
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
                this.$api_v3.post(this.allUser_url, params).then((res) => {
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
            removeUser(row) {
                let params = {
                    "role_id": this.role.id,
                    "user_ids": [row.id]
                };
                this.$confirm('移除该用户', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api_v3.post('/AuRole/deleteUsers', params).then((res) => {
                        console.log(res);
                        if (res.code === 0) {
                            let index = this.role.users.findIndex((i) => {
                                return i.id === row.id;
                            });
                            if (index !== -1) {
                                this.role.users.splice(index, 1);
                            }
                        } else {
                            this.$message.error('移除失败')
                        }
                    })
                }).catch(() => {
                });
            },
            handleClose(done) {
                done()
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "systemStting";
</style>
