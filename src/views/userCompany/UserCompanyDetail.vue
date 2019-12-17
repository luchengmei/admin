<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="box-card-header">
                <span class="name">{{ company.name}}</span>
                <!-- <el-button type="primary" icon="el-icon-check" style="float: right" @click="addOrUpdateCompany()">
                    {{addNew?'提交':'保存'}}
                </el-button> -->
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="index">
                    <!-- <div class="panel-heading">
                        <span class="title"><span class="name">{{company.name}}</span></span>
                        <i :class="edit===true?'fa fa-floppy-o':'el-icon-edit-outline'"
                           @click="toggleEdit"
                           style="font-size: 28px; position: absolute; right: 31px; top: 0; cursor: pointer;"></i>
                    </div> -->
                    <div class="panel-body">
                        <ul>
                            <li>
                                <div class="left"><i class="fa fa-id-card"></i></div>
                                <div class="center">单位名称<span style="color: red">*</span></div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="company.name" clearable></el-input>
                                </div>
                                <div class="right" v-else="edit">{{company.name}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-location"></i></div>
                                <div class="center">地址</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="company.address" clearable></el-input>
                                </div>
                                <div class="right" v-else="edit">{{company.address}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-phone"></i></div>
                                <div class="center">联系电话</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="company.telephone" clearable></el-input>
                                </div>
                                <div class="right" v-else>{{company.telephone}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-address-book-o"></i></div>
                                <div class="center">单位类型<span style="color: red">*</span></div>
                                <div class="right" v-if="edit">
                                    <el-select v-model="company.type" placeholder="请选择" value="">
                                        <el-option
                                                v-for="item in typeOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="right" v-else>{{company.type|formatType}}</div>
                            </li>
                        </ul>
                    </div>
                    <div style="text-align:center;">
                        <el-button type="primary" style="margin:10px;" @click="getBack()">
                            返回
                        </el-button>
                        <el-button type="primary" style="margin:10px;" @click="edit= true">
                            编辑
                        </el-button>
                        <el-button type="primary" style="margin:10px 0;" @click="addOrUpdateCompany()">
                            {{addNew?'提交':'保存'}}
                        </el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="电梯列表" name="second">
                    <div style="margin-top:15px">
                        <el-button type="primary" @click="showDialog()">添加电梯</el-button>
                    </div>
                    <el-table
                            :data="company.lifts"
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
                                <el-button @click="removeLifts(scope.row)" size="mini">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="用户列表" name="third">
                    <div style="margin-top:15px">
                        <el-button type="primary" @click="showDialog()">添加用户</el-button>
                    </div>
                    <el-table
                            :data="users"
                            style="width: 100%;margin-top: 15px;color: #3C8DBC;font-size: 14px">
                        <el-table-column
                                prop="id"
                                label="用户ID">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="姓名">
                        </el-table-column>
                        <el-table-column
                                prop="phone"
                                label="联系电话">
                        </el-table-column>
                        <el-table-column
                                prop="roles"
                                label="用户类型">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click="checkUser(scope.row)" size="mini">查看</el-button>
                                <el-button @click="removeUsers(scope.row)" size="mini">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog title="" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
            <el-transfer style="display: flex;align-items: center;justify-content: center"
                         :titles="['待选', '已选']"
                         :data="transfer.data"
                         v-model="data_select">
            </el-transfer>
            <span slot="footer" class="dialog-footer">
                <el-pagination style="float: left"
                               :page-size.sync="transfer.pageSize"
                               :current-page.sync="transfer.currentPage"
                               @current-change="changePage"
                               mornal
                               layout="prev, pager, next"
                               :total="transfer.total"
                               background>
                </el-pagination>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button :loading="loading" type="primary" @click="dialogConfirm">确 定</el-button>
            </span>
            <span slot="title">
                <el-input :placeholder="placeholder" style="width: 50%;font-size: 12px" @clear="search()"
                          @keyup.native.enter="search()" clearable
                          v-model="transfer.search_content">
                     <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
                </el-input>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Paginate from '@/components/Paginate'

    export default {
        components: {
            Paginate
        },
        data() {
            return {
                hasSave: true,
                companyChangeCount: 0,
                dialogVisible: false,
                typeOptions: [
                    {
                        label: '物业',
                        value: 1,
                    },
                    {
                        label: '维保单位',
                        value: 2
                    }],
                edit: true,
                addNew: false,
                activeName: 'index',
                company: {},
                users: [],
                //--------------transfer--------------
                placeholder: '',
                loading: false,
                data_select: [],
                transfer: {
                    "pageSize": 10,
                    "total": null,
                    "currentPage": 1,
                    "data": [],
                    "search_content": ''
                },
                current_url: '',
                allUser_url: '/AuUser/listPage',
                allLift_url: '/Lifts/listPage',
            }
        },
        filters: {
            formatType(val) {
                if (val === 1) return '物业';
                else if (val === 2) return '维保单位';
                else return ''
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
                if (this.activeName === 'second') {
                    this.placeholder = '搜索内容，电梯名称/物业单位名称/维保单位名称';
                    this.current_url = this.allLift_url;
                } else if (this.activeName === 'third') {
                    this.placeholder = '搜索内容,用户手机/用户姓名/单位名称';
                    this.current_url = this.allUser_url;
                }
                this.changePage();
            },
            changePage() {
                let params = {};
                params = {
                    "page": this.transfer.currentPage,
                    "list_rows": this.transfer.pageSize,
                    "search_content": this.transfer.search_content,
                    "sort": {"id": 1}
                };
                this.$api_v3.post(this.current_url, params).then((res) => {
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
            handleClose(done) {
                done();
            },
            dialogConfirm() {
                this.loading = true;
                if (this.activeName === 'second') {
                    let params = {
                        "group_id": this.company.id,
                        "lift_ids": this.data_select
                    };
                    this.$api_v3.post('/Group/addLifts', params).then((res) => {
                        console.log(res);
                        if (res.code === 0) {
                            this.$message.success('操作成功');
                            this.findCompanyById(this.company.id);
                        } else {
                            this.$message.error(res.data)
                        }
                    }).finally(() => {
                        this.loading = false;
                        this.dialogVisible = false;
                    })
                } else if (this.activeName === 'third') {
                    let params = {
                        "group_id": this.company.id,
                        "user_ids": this.data_select
                    };
                    this.$api_v3.post('/Group/addUsers', params).then((res) => {
                        console.log(res);
                        if (res.code === 0) {
                            this.$message.success('操作成功')
                        } else {
                            this.$message.error(res.data)
                        }
                    }).finally(() => {
                        this.loading = false;
                        this.dialogVisible = false;
                        this.findCompanyById(this.company.id);
                    })
                }
            },
            findCompanyById(id) {
                this.$api_v3.post('/Group/read', {"id": id}).then((result) => {
                    console.log(result);
                    if (result.code === 0) {
                        this.company = result.data;
                    }
                });
            },
            findUserByCompanyId(id) {
                this.$api_v3.post('/AuUser/listPage', {"company_id": id, "list_rows": 999}).then((res) => {
                    console.log('/AuUser/listPage', res);
                    this.users = res.data.data
                })
            },
            // toggleEdit() {
            //     this.edit = !this.edit;
            // },
            addOrUpdateCompany() {
                let params = this.company;
                if (params.name === '') return;
                this.$api_v3.post('/Group/save', params).then((result) => {
                    console.log(result);
                    if (result.code === 0) {
                        this.$message.success('操作成功')
                        this.edit = false
                    } else {
                        this.$message.error(result.data)
                    }
                })
            },
            removeUsers(row) {
                let params = {
                    "group_id": this.company.id,
                    "user_ids": [row.id]
                };
                this.$confirm('移除该电梯', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api_v3.post('/Group/deleteUsers', params).then((res) => {
                        console.log(res);
                        if (res.code === 0) {
                            let index = this.company.users.findIndex((i) => {
                                return i.id === row.id;
                            });
                            if (index !== -1) {
                                this.company.users.splice(index, 1);
                            }
                        } else {
                            this.$message.error('移除失败')
                        }
                    })
                }).catch(() => {
                });
            },
            checkUser(row) {
                this.$router.push({path: '/user_detail', query: {id: row.id}})
            },
            removeLifts(row) {
                let params = {
                    "group_id": this.company.id,
                    "lift_ids": [row.id]
                };
                this.$confirm('移除该电梯', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api_v3.post('/Group/deleteLifts', params).then((res) => {
                        console.log(res);
                        if (res.code === 0) {
                            let index = this.company.lifts.findIndex((i) => {
                                return i.id === row.id;
                            });
                            if (index !== -1) {
                                this.company.lifts.splice(index, 1);
                            }
                        } else {
                            this.$message.error('移除失败   ')
                        }
                    })
                }).catch(() => {
                });
            },
            getBack() {
                this.$router.go(-1)
            }
        },
        watch: {
            'company': {
                handler: function () {
                    this.companyChangeCount += 1;
                    if (this.companyChangeCount > 1) {
                        this.hasSave = false;
                    }
                },
                deep: true
            }
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
            if (this.$route.query.id !== null) {
                this.findCompanyById(this.$route.query.id);
                this.findUserByCompanyId(this.$route.query.id);
            } else {
                this.edit = true;
                this.addNew = true;
            }
        }
    }
</script>
<style lang="less">
</style>
