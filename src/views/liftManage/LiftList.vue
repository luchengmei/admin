<template>
    <div class="user-list">
        <ToolBar>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addLift()">添加</el-button>
            <div style="float: right">
                <el-select v-model="params.singleField" placeholder="功能" size="small" @change="onSingleFieldChange"
                           @clear="initList"
                           clearable
                           style="width: 100px">
                    <el-option
                            v-for="item in singleFieldOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input
                        placeholder="请输入电梯名称/单位名称"
                        size="small"
                        style="width: 340px"
                        v-model="params.name"
                        @clear="initList"
                        @keyup.native.enter="searchUser"
                        clearable>
                    <el-select v-model="searchSelect" slot="prepend" placeholder="请选择" value="" style="width: 100px">
                        <el-option label="电梯名称" value="电梯名称"></el-option>
                        <el-option v-for="item in companyType" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-input>
                <el-button @click="searchUser" type="success" icon="el-icon-search" size="small"></el-button>
            </div>
        </ToolBar>
        <el-table
                :data="usersData"
                border
                ref="table"
                style="width: 100%">
            <el-table-column
                    width=""
                    prop="id"
                    label="电梯ID">
            </el-table-column>
            <el-table-column
                    width="200"
                    prop="name"
                    label="电梯名称">
            </el-table-column>
            <el-table-column
                    width="120"
                    prop="license"
                    label="使用登记证编号">
            </el-table-column>
            <el-table-column
                    width="400px"
                    prop="address"
                    label="地址">
            </el-table-column>
            <el-table-column
                    width="200px"
                    prop="companies"
                    label="物业单位">
                <template slot-scope="scope">
                    {{scope.row.companies[0]?scope.row.companies[0].company_name:''}}
                </template>
            </el-table-column>
            <el-table-column
                    width="200px"
                    prop="companies"
                    label="维保单位">
                <template slot-scope="scope">
                    {{scope.row.companies[1]?scope.row.companies[1].company_name:''}}
                </template>
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="rated_load"
                    label="额定载重(kg)">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="rated_speed"
                    label="额定速度(m/s)">
            </el-table-column>
            <el-table-column
                    prop="floor"
                    label="层站数">
            </el-table-column>
            <el-table-column
                    width="200"
                    prop="brand"
                    label="生产厂家">
            </el-table-column>
            <el-table-column
                    width="200"
                    prop="model"
                    label="设备型号">
            </el-table-column>
            <el-table-column
                    width="200"
                    prop="product_number"
                    label="出厂编号">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="manufacture_date"
                    sortable
                    label="出厂时间">
            </el-table-column>
            <el-table-column
                    label="操作"
                    :render-header="tableAction"
                    width="180"
                    fixed="right">
                <template slot-scope="scope">
                    <el-button @click="editLift(scope.row.id)" type="primary" icon="el-icon-edit" size="small"
                               circle></el-button>
                    <!--<el-button @click="deleteLiftById(scope.row)" v-if="scope.row.is_enabled !==false" type="warning"-->
                    <!--icon="el-icon-close" circle size="small"></el-button>-->
                    <!--<el-button v-else icon="el-icon-check" circle-->
                    <!--size="small"></el-button>-->
                    <el-button @click="removeLiftById(scope.row)" type="danger"
                               icon="el-icon-delete" circle size="small"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <paginate :api="list_url" :params="list_params" :refresh="refresh" @val-change="onValChange"></paginate>
    </div>
</template>

<script>
    import ToolBar from '@/components/ToolBar.vue';
    import HelpHint from '@/components/HelpHint.vue';
    import Paginate from "../../components/Paginate";
    import linkage from '../../components/linkage'

    export default {
        mounted() {
            this.getCompanyType();
        },
        activated() {
        },
        data() {
            const permissions = JSON.parse(localStorage.getItem('permissions'));
            return {
                permissions: permissions,
                companyType: [],
                usersData: [],
                list_url: '/dm/lift/list/is_existed',
                list_params: {
                    "page_proto": {
                        "page": 1,
                        "property": "id",
                        "size": 10,
                        "sort": "DESC"
                    },
                    "is_existed": true
                },
                refresh: false,
                searchSelect: '电梯名称',
                params: {
                    name: '',
                    singleField: ''
                },
                singleFieldOption: [{
                    label: '机房',
                    value: 'has_machine_room',
                }, {
                    label: '机房温度',
                    value: 'env_temperature_in_machine_room',
                }, {
                    label: '机房湿度',
                    value: 'env_humidity_in_machine_room',
                }, {
                    label: '机房噪声',
                    value: 'noise_in_machine_room',
                }, {
                    label: '安全回路',
                    value: 'circuit',
                }, {
                    label: '电机温度',
                    value: 'machine_temperature',
                }, {
                    label: '电柜温度',
                    value: 'cabinet_temperature',
                }, {
                    label: '麦克风',
                    value: 'microphone',
                }, {
                    label: '摄像头',
                    value: 'camera',
                }, {
                    label: '人体感应',
                    value: 'motion',
                }, {
                    label: '应急按钮',
                    value: 'emergency_button',
                }, {
                    label: '广告屏',
                    value: 'ad_screen',
                }, {
                    label: '底坑温度',
                    value: 'env_temperature_in_pit',
                }, {
                    label: '底坑噪声',
                    value: 'noise_in_pit',
                }, {
                    label: '钢丝绳',
                    value: 'wire_rope',
                }, {
                    label: '保护装置',
                    value: 'protector',
                }],
                status: '',
                statusOption: [{
                    value: 1,
                    label: '在线'
                }, {
                    value: 0,
                    label: '离线'
                }],
                usersDataTemp: [],
            }
        },
        watch: {
            'params.singleField': function () {
                if (this.params.singleField === '') {
                    this.initList()
                }
            }
        },
        computed: {},
        methods: {
            onValChange(data) {
                //console.log(data);
                this.usersData = data;
            },
            onSingleFieldChange() {
                let key = this.params.singleField;
                let lift = {};
                lift[key] = true;
                this.list_url = '/dm/lift/list/by';
                this.list_params = {
                    "lift": lift,
                    "page_proto": {
                        "page": 1,
                        "property": "id",
                        "size": 10,
                        "sort": "DESC"
                    }
                };
                this.refresh = !this.refresh;
            },
            initList() {
                this.list_url = '/dm/lift/list/is_existed';
                this.list_params = {
                    "page_proto": {
                        "page": 1,
                        "property": "id",
                        "size": 10,
                        "sort": "DESC"
                    },
                    "is_existed": true
                };
                this.refresh = !this.refresh;//refresh paginate
            },
            getCompanyType() {
                this.$req.post('/dm/company_type/all/enabled').then((result) => {
                    //console.log(result);
                    this.companyType = [...result];
                })
            },
            searchUser() {
                if (this.searchSelect === '电梯名称') {//search by lift name
                    this.list_url = '/dm/lift/list/name';
                    this.list_params = {
                        "name": this.params.name,
                        "page_proto": {
                            "page": 1,
                            "property": "id",
                            "size": 10,
                            "sort": "DESC"
                        }
                    };
                    this.refresh = !this.refresh;
                } else {
                    this.list_url = '/dm/lift/list/company_name/like';
                    this.list_params = {
                        "company_name": this.params.name,
                        "company_type": this.searchSelect,
                        "page_proto": {
                            "page": 1,
                            "property": "id",
                            "size": 10,
                            "sort": "DESC"
                        }
                    };
                    this.refresh = !this.refresh;
                }
            },
            removeLiftById(row) {
                if (this.permissions.lift_delete !== 'true') {
                    this.$message({
                        type: 'error',
                        message: '对不起，您没有权限进行此操作。'
                    });
                    return false;
                }
                this.$req.post('/dm/lift/remove', {"id": row.id}).then((result) => {
                    if (result.Code === 7000) {
                        let index = this.usersData.findIndex((val) => {
                            return val.id == row.id;
                        });
                        this.usersData.splice(index, 1);
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    }
                })
            },
            deleteLiftById(row) {
                this.$confirm('删除该电梯, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        this.$req.post('/dm/lift/disable', {
                            "id": row.id
                        }).then((result) => {
                            console.log(result);
                            row.is_enabled = false;
                            if (result.Code === 7000) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                            }
                        })
                    }
                ).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            tableAction() {
                return this.$createElement('HelpHint', {
                    props: {
                        content: ' 编辑 / 删除'
                    }
                }, '操作');
            },
            setting(id) {
                this.$router.push('/alarm_setting')
            },
            editLift(id) {
                if (this.permissions.lift_fetch !== 'true') {
                    this.$message({
                        type: 'error',
                        message: '对不起，您没有权限进行此操作。'
                    });
                    return false;
                }
                this.$router.push({path: '/lift_detail', query: {lift_id: id}})
            },
            addLift(id = null) {
                if (this.permissions.lift_add !== 'true') {
                    this.$message({
                        type: 'error',
                        message: '对不起，您没有权限进行此操作。'
                    });
                    return false;
                }
                this.$router.push({path: '/lift_detail', query: {lift_id: id}})
            }
        },
        components: {
            Paginate,
            ToolBar,
            HelpHint,
            linkage
        }
    }
</script>
<style lang="less">

</style>
