<template>
    <div class="user-list">
        <ToolBar>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addLift()">添加</el-button>
            <div style="float: right">
                <el-input
                        placeholder="请输入电梯名称/单位名称"
                        size="small"
                        style="width: 340px"
                        v-model="params.name"
                        @clear="initList"
                        @keyup.native.enter="searchUser"
                        clearable>
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
                    width="100"
                    prop="id"
                    label="电梯ID">
                <template slot="header" slot-scope="scope">
                    电梯ID
                    <table-sort @ascending="onAscOrDesc('id',0)"
                                @descending="onAscOrDesc('id',1)"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    width="200"
                    prop="name"
                    label="电梯名称">
                <template slot="header" slot-scope="scope">
                    电梯名称
                    <table-sort @ascending="onAscOrDesc('name',0)"
                                @descending="onAscOrDesc('name',1)"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    width="140"
                    prop="license"
                    label="使用登记证编号">
                <template slot="header" slot-scope="scope">
                    使用登记证编号
                    <table-sort @ascending="onAscOrDesc('license',0)"
                                @descending="onAscOrDesc('license',1)"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    width="250"
                    prop="address_shot"
                    label="地址">
            </el-table-column>
            <template slot="header" slot-scope="scope">
                地址
                <table-sort @ascending="onAscOrDesc('address_shot',0)"
                            @descending="onAscOrDesc('address_shot',1)"></table-sort>
            </template>
            <el-table-column
                    width="200px"
                    prop="owner_company_name"
                    label="物业单位">
                <template slot="header" slot-scope="scope">
                    物业单位
                    <table-sort @ascending="onAscOrDesc('owner_company_name',0)"
                                @descending="onAscOrDesc('owner_company_name',1)"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    width="200px"
                    prop="maintenance_company_name"
                    label="维保单位">
                <template slot="header" slot-scope="scope">
                    维保单位
                    <table-sort @ascending="onAscOrDesc('maintenance_company_name',0)"
                                @descending="onAscOrDesc('maintenance_company_name',1)"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    width="140"
                    prop="rated_load"
                    label="额定载重(kg)">
                <template slot="header" slot-scope="scope">
                    额定载重(kg)
                    <table-sort @ascending="onAscOrDesc('rated_load',0)"
                                @descending="onAscOrDesc('rated_load',1)"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    width="140"
                    prop="rated_speed"
                    label="额定速度(m/s)">
                <template slot="header" slot-scope="scope">
                    额定速度(m/s)
                    <table-sort @ascending="onAscOrDesc('rated_speed',0)"
                                @descending="onAscOrDesc('rated_speed',1)"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="floor"
                    label="层站数">
                <template slot="header" slot-scope="scope">
                    层站数
                    <table-sort @ascending="onAscOrDesc('floor',0)"
                                @descending="onAscOrDesc('floor',1)"></table-sort>
                </template>
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
                    label="出厂时间">
                <template slot="header" slot-scope="scope">
                    出厂时间
                    <table-sort @ascending="onAscOrDesc('manufacture_date',0)"
                                @descending="onAscOrDesc('manufacture_date',1)"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    :render-header="tableAction"
                    width="180"
                    fixed="right">
                <template slot-scope="scope">
                    <el-button @click="editLift(scope.row.id)" type="primary" icon="el-icon-edit" size="small"
                               circle></el-button>
                    <el-button @click="removeLiftById(scope.row.id)" type="danger"
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
    import linkage from '../../components/linkage';
    import TableSort from '../../components/TableSort'

    export default {
        mounted() {
        },
        activated() {
        },
        data() {
            const permissions = JSON.parse(localStorage.getItem('permissions'));
            return {
                permissions: permissions,
                companyType: [],
                usersData: [],
                list_url: '/Lifts/listPage',
                list_params: {
                    "page": 1,
                    "size": 10,
                    "sort": {id: 1}
                },
                refresh: false,
                params: {
                    name: '',
                    singleField: ''
                },
                singleFieldOption: [
                    {
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
                statusOption: [
                    {
                        value: 1,
                        label: '在线'
                    }, {
                        value: 0,
                        label: '离线'
                    }
                ],
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
                this.usersData = data;
            },
            initList() {
                this.paginate_params.page = 1;
                this.list_params.search_content = '';//清空搜索关键词
                this.refresh = !this.refresh;//refresh paginate
            },
            searchUser() {
                this.paginate_params.page = 1;
                this.list_params.search_content = this.params.name;//搜索关键词
                this.refresh = !this.refresh;
            },
            removeLiftById(id) {
                this.$confirm('移除该电梯, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        this.$api_v3.post('/Lifts/remove', {'id': id}).then((result) => {
                            console.log(result);
                            if (result.code === 0) {
                                this.$message.success('操作成功');
                                this.refresh = !this.refresh;
                            } else {
                                this.$message.error('操作失败')
                            }
                        })
                    }
                ).catch(() => {
                });
            },
            tableAction() {
                return this.$createElement('HelpHint', {
                    props: {
                        content: ' 编辑 / 删除'
                    }
                }, '操作');
            },
            editLift(id) {
                this.$router.push({path: '/lift_detail', query: {lift_id: id}})
            },
            addLift(id = null) {
                this.$router.push({path: '/lift_detail', query: {lift_id: id}})
            },
            onAscOrDesc(str, num) {
                console.log(str, num);
                this.list_params.sort[str] = num;
                this.refresh = !this.refresh;
            },
        },
        components: {
            Paginate,
            ToolBar,
            HelpHint,
            linkage,
            TableSort
        }
    }
</script>
<style lang="less">

</style>
