<template>
    <div class="container">
        <div class="container_left">
            <div style="text-align: center;padding: 20px">
                <el-button type="primary" style="width: 150px" @click="createType">新建单位类型</el-button>
            </div>
            <div class="companyType-list">
                <span :class="current ==i.id?'active':''" v-for="(i,index) in companyType" v-bind:key="index"
                      @click="changeCurrent(i.id)">{{i.name}}
                <span style="padding-left: 20px" v-if="current ==i.id">
                    <i class="el-icon-edit" @click="updateCompanyType('rename',i)"></i>
                    <i class="el-icon-remove-outline" @click="updateCompanyType('delete',i)"></i>
                    <i class="fa fa-files-o"></i>
                </span>
                </span>
            </div>
        </div>
        <div class="container_right">
            <el-tabs v-model="activeName">
                <el-tab-pane label="具体单位" name="first">
                    <el-table
                            v-loading="loading"
                            :data="tableData"
                            style="width: 100%">
                        <el-table-column
                                prop="name"
                                label="用户"
                                width="300">
                        </el-table-column>
                        <el-table-column
                                prop="ctime"
                                label="创建时间">
                        </el-table-column>
                        <el-table-column
                                label="操作">
                            <template slot-scope="scope">
                                <i class="el-icon-edit" style="font-size: 16px;color: #3C8DBC;cursor: pointer"
                                   @click="router_company(scope.row.id)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog title="新建单位类型" :visible.sync="dialogVisible" style="margin-top:10vh;">
            <el-form :model="form">
                <el-form-item label="单位类型名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
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
                current: null,
                companyType: [],
                tableData: [],
                loading: false,
                form: {},
                formLabelWidth: '120px',
                dialogVisible: false,
                activeName: 'first',
                searchName: '',
            }
        },
        mounted() {
            this.getCompanyType();
        },
        methods: {
            updateCompanyType(operation, item) {
                if (operation === 'delete') {
                    this.$confirm('是否确认删除单位类型 ' + '"' + item.name + '"', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        item.is_enabled = false;
                        this.$req.post('/dm/company_type/set_enabled', item).then(() => {
                            let index = this.companyType.findIndex((x) => {
                                x.id == item.id
                            });
                            this.companyType.splice(index, 1);
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        });
                    }).catch(() => {
                    });
                } else if (operation === 'rename') {
                    this.$prompt('请输入单位类型名称', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({value}) => {
                        let params = {...item};
                        params.name = value;
                        this.$req.post('/dm/company_type/set_enabled', item).then((result) => {
                            item.name = value;
                            this.$message({
                                type: 'success',
                                message: '修改成功 '
                            });
                        });
                    }).catch(() => {
                    });
                }
            },
            router_company(id) {
                this.$router.push({path: '/userCompany_detail', query: {id: id}})
            },
            changeCurrent(id) {
                if (id !== this.current) {
                    this.current = id;
                    this.getCompanyByTypeId(id);
                }
            },
            createType() {
                this.$prompt('请输入单位类型名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({value}) => {
                    let params = {
                        "is_enabled": true,
                        "name": value
                    };
                    this.$req.post('/dm/company_type/add', params).then((result) => {
                        this.$message({
                            type: 'success',
                            message: '新建成功 '
                        });
                        this.getCompanyType();
                    });
                }).catch(() => {
                });
            },
            getCompanyType() {
                this.$req.post('/dm/company_type/all/enabled').then((result) => {
                    this.companyType = result;
                    this.current = result[0].id;
                    this.getCompanyByTypeId(this.current);
                })
            },
            getCompanyByTypeId(id) {
                this.loading = true;
                this.$req.post('/dm/company/list/type', id).then((result) => {
                    this.tableData = result;
                }).finally(() => {
                    this.loading = false
                })
            },
        }
    }
</script>

<style lang="less" scoped>
    .container {
        display: flex;

        .container_left {
            width: 300px;
            background: #ffffff;
            .companyType-list {
                color: #333333;
                display: flex;
                flex-direction: column;
                > span {
                    cursor: pointer;
                    padding: 2px 40px;
                    margin: 5px 0;
                }
                > span:hover {
                    background: #eeeeee;
                }
                i {
                    color: #666666;
                    padding: 0 4px;
                }
                .active {
                    background: rgba(60, 141, 188, 0.3);
                }
            }
        }
        .container_right {
            padding: 20px;
            margin-left: 10px;
            flex: 1;
            background: #ffffff;
        }
    }

    .platform {
        span {
            display: inline-block;
            width: 140px;
        }
        margin: 25px 0;
        .platform-title {
            color: #333333;
            font-size: 18px;
            font-weight: 600;
        }
        .platform-content {
            padding-top: 20px;
            padding-left: 10px;
            color: #888888;
            font-size: 16px;
        }
        .content-list {
            padding-left: 10px;
            padding-top: 10px;
        }
    }
</style>
