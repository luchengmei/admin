<template>
    <div class="user-list">
        <ToolBar>
            <el-button @click="addPlan()" type="primary" icon="el-icon-plus" size="small">添加
            </el-button>
            <div style="float: right">
                <el-date-picker
                        clearable
                        v-model="pickerValue"
                        type="daterange"
                        align="right"
                        unlink-panels
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions">
                </el-date-picker>
                <el-select style="width: 140px" v-model="params.status"
                           placeholder="结果" size="small"
                           clearable>
                    <el-option
                            v-for="item in statusOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select style="width: 140px" v-model="params.type"
                           placeholder="类型" size="small"
                           clearable>
                    <el-option
                            v-for="item in typeOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input
                        placeholder="搜索内容，电梯名称/物业单位名称/维保单位名称"
                        size="small"
                        style="width: 300px"
                        v-model="params.name"
                        @clear="searchUser"
                        @keyup.native.enter="searchUser"
                        clearable>
                </el-input>
                <el-button @click="searchUser" type="success" icon="el-icon-search"
                           size="small"></el-button>
            </div>
        </ToolBar>
        <el-table
                :data="usersData"
                border
                ref="table"
                style="width: 100%">
            <el-table-column width="100" prop="id">
                <template slot="header" slot-scope="scope">
                    ID
                    <table-sort @ascending="onAscOrDesc('id',0)"
                                @descending="onAscOrDesc('id',1)"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    width=""
                    prop="lift_name"
                    label="电梯名称">
                <template slot="header" slot-scope="scope">
                    电梯名称
                    <table-sort @ascending="onAscOrDesc('lift_name',0)"
                                @descending="onAscOrDesc('lift_name',1)"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    prop="next_date"
                    label="下次维保/年审计划日期">
                <template slot="header" slot-scope="scope">
                    下次维保/年审计划日期
                    <table-sort @ascending="onAscOrDesc('next_date',0)"
                                @descending="onAscOrDesc('next_date',1)"></table-sort>
                </template>
                <template slot-scope="scope">
                    <span style="margin-right: 6px">{{scope.row.next_date}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="date"
                    label="本次维保/年审日期">
                <template slot="header" slot-scope="scope">
                    本次维保/年审日期
                    <table-sort @ascending="onAscOrDesc('date',0)"
                                @descending="onAscOrDesc('date',1)"></table-sort>
                </template>
                <template slot-scope="scope">
                    <span style="margin-right: 6px">{{scope.row.date}}</span>
                    <el-tag v-if="scope.row.status==0">{{scope.row.date|formatDate}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    prop="next_date"
                    label="上次维保/年审计划日期">
                <template slot="header" slot-scope="scope">
                    上次维保/年审计划日期
                    <table-sort @ascending="onAscOrDesc('last_date',0)"
                                @descending="onAscOrDesc('last_date',1)"></table-sort>
                </template>
                <template slot-scope="scope">
                    <span style="margin-right: 6px">{{scope.row.last_date}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="类型">
                <template slot-scope="scope">
                    <span>{{scope.row.type|formatType}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="结果">
                <template slot-scope="scope">
                    <el-tag type="danger" v-if="scope.row.status===2">{{scope.row.status|formatStatus}}</el-tag>
                    <el-tag v-else>{{scope.row.status|formatStatus}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    :render-header="tableAction"
                    fixed="right"
                    width="180">
                <template slot-scope="scope">
                    <el-button @click="editPlan(scope.row.id)" type="primary" icon="el-icon-edit" size="small"
                               circle></el-button>
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
                paginate_api: '/LiftsPlan/listPage',
                paginate_params: {
                    "page": 1,
                    "size": 10,
                    "sort": {id: 1},
                    "status": 0
                },
                refresh: false,
                params: {
                    name: '',
                    status: '0',
                    type: ''
                },
                typeOption: [
                    {
                        value: -1,
                        label: '维保'
                    },
                    {
                        value: 5,
                        label: '年审'
                    }, {
                        value: 6,
                        label: '大修'
                    }
                ],
                statusOption: [
                    {
                        value: '2',
                        label: '不合格'
                    },
                    {
                        value: '1',
                        label: '合格'
                    }, {
                        value: '0',
                        label: '未处理'
                    }
                ],
                usersData: [],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                pickerValue: [],
            }
        },
        filters: {
            formatType(val) {
                switch (val) {
                    case 1:
                        return '半月维保';
                    case 2:
                        return '季度维保';
                    case 3:
                        return '半年维保';
                    case 4:
                        return '年度维保';
                    case 5:
                        return '年审';
                    case 6:
                        return '大修';
                    default:
                        return val
                }
            },
            formatStatus(val) {
                switch (val) {
                    case 0:
                        return '未处理';
                    case 1:
                        return '合格';
                    case 2:
                        return '不合格';
                    default:
                        return val
                }
            },
            formatDate(val) {
                let nowTime = new Date(), compareTime = new Date(val);
                if (nowTime > compareTime) return '已过期';
                if (nowTime < compareTime) {
                    if (nowTime.getFullYear() === compareTime.getFullYear()) {
                        if (nowTime.getMonth() === compareTime.getMonth()) {
                            if (nowTime.getDate() === compareTime.getDate()) {
                                return '今天'
                            }
                            return (compareTime.getDate() - nowTime.getDate()).toString() + '天后'
                        }
                        return (compareTime.getMonth() - nowTime.getMonth()).toString() + '月后';
                    }
                    return (compareTime.getFullYear() - nowTime.getFullYear()).toString() + '年后';
                }
            }
        },
        methods: {
            onValChange(data) {
                //console.log(data);
                this.usersData = data
            },
            searchUser() {
                this.paginate_params.page = 1;
                this.paginate_params.search_content = this.params.name;
                this.paginate_params.status = this.params.status;
                this.paginate_params.type = this.params.type===-1?[1,2,3,4]:this.params.type;
                if (this.pickerValue && this.pickerValue.length === 2) {
                    this.paginate_params.start_date = this.pickerValue[0];
                    this.paginate_params.end_date = this.pickerValue[1];
                } else {
                    this.paginate_params.start_date = '';
                    this.paginate_params.end_date = '';
                }
                this.refresh = !this.refresh;
            },
            tableAction() {
                return this.$createElement('HelpHint', {
                    props: {
                        content: '编辑'
                    }
                }, '操作');
            },
            editPlan(id) {
                this.$router.push({path: '/lift_plan_detail', query: {plan_id: id}})
            },
            addPlan(id = null) {
                this.$router.push({path: '/lift_plan_detail', query: {plan_id: id}})
            },
            onAscOrDesc(str, num) {
                console.log(str, num);
                this.paginate_params.sort[str] = num;
                this.refresh = !this.refresh;
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
