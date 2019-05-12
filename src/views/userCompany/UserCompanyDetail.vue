<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="box-card-header">
                <span class="name">{{ company.name}}</span>
                <el-button type="primary" icon="el-icon-check" style="float: right" @click="save()">{{addNew?'新增':'提交'}}</el-button>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="index">
                    <div class="panel-heading">
                        <!--<span class="title"><span class="name">{{company.name}}</span></span>-->
                        <i :class="edit===true?'fa fa-floppy-o':'el-icon-edit-outline'"
                           @click="toggleEdit"
                           style="font-size: 28px; position: absolute; right: 31px; top: 0; cursor: pointer;"></i>
                    </div>
                    <div class="panel-body">
                        <ul>
                            <li>
                                <div class="left"><i class="fa fa-id-card"></i></div>
                                <div class="center">单位名称</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="company.name"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{company.name}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-location"></i></div>
                                <div class="center">地址</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="company.address"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{company.address}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-phone"></i></div>
                                <div class="center">联系电话</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="company.telephone"></el-input>
                                </div>
                                <div class="right" v-else>{{company.telephone}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-address-book-o"></i></div>
                                <div class="center">单位类型</div>
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
                </el-tab-pane>
                <el-tab-pane label="电梯列表" name="second">
                    <div style="margin-top:15px">
                        <el-button type="primary" @click="showDialog()">添加电梯</el-button>
                    </div>
                    <el-table
                            :data="tableData"
                            style="width: 100%;margin-top: 15px;color: #3C8DBC;font-size: 14px">
                        <el-table-column
                                prop="name"
                                label="电梯名称">
                        </el-table-column>
                        <el-table-column
                                prop="address"
                                label="地址">
                        </el-table-column>
                    </el-table>
                    <paginate style="border: none" :api="list_url" :params="list_params" :refresh="refresh"
                              @val-change="onValChange"></paginate>
                </el-tab-pane>
                <el-tab-pane label="用户列表" name="third">
                    <div style="margin-top:15px">
                        <el-button type="primary" @click="showDialog()">添加用户</el-button>
                    </div>
                    <el-table
                            :data="tableData_u"
                            style="width: 100%;margin-top: 15px;color: #3C8DBC;font-size: 14px">
                        <el-table-column
                                prop="name"
                                label="姓名">
                        </el-table-column>
                        <el-table-column
                                prop="cellphone"
                                label="联系电话">
                        </el-table-column>
                    </el-table>
                    <paginate style="border: none" :api="list_url_u" :params="list_params_u" :refresh="refresh_u"
                              @val-change="onValChange_u"></paginate>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog title="" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
            <el-transfer style="display: flex;align-items: center;justify-content: center" filterable
                         :titles="['待选', '已选']"
                         :data="transfer.data"
                         v-model="data_select">
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
    import Paginate from '@/components/Paginate'

    export default {
        components: {
            Paginate
        },
        data() {
            return {
                hasSave:true,
                companyChangeCount: 0,
                collapseNames: [],
                companyId: null,
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
                edit: false,
                addNew: false,
                activeName: 'index',
                company: {},
                lifts: [],//对象数组
                userCellphones: [],//字符串数组

                //--------------transfer--------------
                data_select: [],
                transfer: {
                    "pageSize": 10,
                    "total": null,
                    "currentPage": 1,
                    "data": [],
                },
                allUser_url: '/user/fetch/company',
                allLift_url: '/dm/lift/list/company_id',

                //--------------电梯列表---------------
                list_url: '/dm/lift/list/company_id',
                list_params: {
                    "company_id": this.$route.query.id,
                    "page_proto": {
                        "page": 1,
                        "property": "id",
                        "size": 10,
                        "sort": "DESC"
                    }
                },
                refresh: false,
                tableData: [],
                //--------------用户列表------------------
                list_url_u: '/user/fetch/company',
                list_params_u: {
                    "company_id": this.$route.query.id,
                    "page_proto": {
                        "page": 1,
                        "property": "id",
                        "size": 10,
                        "sort": "DESC"
                    }
                },
                refresh_u: false,
                tableData_u: [],
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
            addUsersToCompany(id, data) {
                let params = {
                    "company_id": id,
                    "user_cellphones": data
                };
                this.$req.post('/user/add/company', params).then((result) => {
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    });
                    this.refresh_u = !this.refresh_u;
                })
            },
            addLiftsToCompany(id, data) {
                let params = {
                    "company_id": id,
                    "lift_ids": data
                };
                this.$req.post('/dm/lift/add/company', params).then(() => {
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    });
                    this.refresh = !this.refresh;
                })
            },
            dialog_confirm() {
                this.dialogVisible = false;
                if (this.data_select.length === 0) return false;
                if (this.activeName === 'third') {
                    this.addUsersToCompany(this.companyId, this.data_select);
                } else if (this.activeName === 'second') {
                    this.addLiftsToCompany(this.companyId, this.data_select);
                }
            },
            showDialog() {
                this.dialogVisible = true;
                this.data_select = [];
                this.changePage();
            },
            changePage() {
                let params = {};
                let url = '';
                if (this.activeName === 'second') {
                    url = this.allLift_url;
                    params = {
                        "company_id": 0,
                        "page_proto": {
                            "page": this.transfer.currentPage,
                            "property": "id",
                            "size": this.transfer.pageSize,
                            "sort": "DESC"
                        }
                    }
                }
                if (this.activeName === 'third') {
                    url = this.allUser_url;
                    params = {
                        "company_id": null,
                        "page_proto": {
                            "page": this.transfer.currentPage,
                            "property": "id",
                            "size": this.transfer.pageSize,
                            "sort": "DESC"
                        }
                    };
                }
                this.$req.post(url, params).then((result) => {
                    console.log(result);
                    this.transfer.total = result.total_elements;
                    this.transfer.data = [];
                    if (this.activeName === 'second') {
                        result.content.forEach((item) => {
                            this.transfer.data.push({"key": item.id, "label": item.name})
                        })
                    } else if (this.activeName === 'third') {
                        result.content.forEach((item) => {
                            this.transfer.data.push({"key": item.cellphone, "label": item.name})
                        })
                    }
                })
            },
            onValChange(data) {
                //console.log(data)
                this.tableData = data;
            },
            onValChange_u(data) {
                console.log(data);
                this.tableData_u = data;
            },
            handleClose(done) {
                done();
            },
            addCompany() {
                let params = this.company;
                this.$req.post('/dm/company/add', params).then((result) => {
                    console.log(result);
                    if (result.Code === 7000) {
                        this.hasSave = true;
                        this.addNew = false;
                        this.companyId = result.id;
                        this.list_params.company_id = result.id;
                        this.list_params_u.company_id = result.id;
                        this.$router.go(-1);
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        })
                    }
                })
            },
            addCompanyWithLiftAndUser() {
                let params = {
                    "company": this.company,
                    "lifts": this.lifts,
                    "userCellPhones": this.userCellPhones
                };
                this.$req.post('/dm/company/add/with_lifts', params).then((result) => {
                    console.log(result);
                    if (result.Code === 7000) {
                        this.hasSave = true;
                        this.addNew = false;
                        this.companyId = result.id;
                        this.list_params.company_id = result.id;
                        this.list_params_u.company_id = result.id;
                        this.$router.go(-1);
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        })
                    }
                })
            },
            updateCompany() {
                let params = {
                    "company": this.company,
                    "lifts": this.lifts,
                    "user_cellphones": this.userCellPhones
                };
                this.$req.post('/dm/company/update', params).then((result) => {
                    console.log(result);
                    if (result.Code === 7000) {
                        this.hasSave  = true;
                        this.$router.go(-1);
                        this.$message({
                            message: '更新成功',
                            type: 'success'
                        })
                    }
                })
            },
            findCompanyById(id) {
                this.$req.post('/dm/company/fetch', {
                    'id': id
                }).then((result) => {
                    console.log(result);
                    this.company = result;
                })
            },
            toggleEdit() {
                this.edit = !this.edit;
            },
            save() {
                if (this.addNew === true) {
                    if (this.lifts.length === 0 && this.userCellphones.length === 0) {
                        this.addCompany()
                    } else {
                        this.addCompanyWithLiftAndUser()
                    }
                } else {
                    this.updateCompany()
                }
                this.edit = false;
            }
        },
        watch:{
          'company': {
              handler: function () {
                  this.companyChangeCount += 1;
                  if (this.companyChangeCount >1) {
                      this.hasSave = false;
                  }
              },
              deep: true
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
                this.companyId = Number(this.$route.query.id);
                this.findCompanyById(this.$route.query.id);
            } else {
                this.edit = true;
                this.addNew = true;
            }
        }
    }
</script>
<style lang="less">
</style>
