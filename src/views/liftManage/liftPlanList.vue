<template>
    <div class="user-list">
        <ToolBar>
            <!--<el-button type="primary" icon="el-icon-plus" size="small">添加</el-button>-->
            <div style="float: right">
                <el-select @change="listByStatus" @clear="initList" style="width: 140px" v-model="params.status"
                           placeholder="结果" size="small"
                           clearable>
                    <el-option
                            v-for="item in statusOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select @change="listByType" @clear="initList" style="width: 140px" v-model="params.type"
                           placeholder="类型" size="small"
                           clearable>
                    <el-option
                            v-for="item in typeOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </ToolBar>
        <el-table
                :data="usersData"
                border
                ref="table"
                style="width: 100%">
            <el-table-column
                    width=""
                    prop="lift_name"
                    label="电梯名称">
            </el-table-column>
            <el-table-column
                    sortable
                    prop="date"
                    label="预计时间">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == 5">{{scope.row.date}}</span>
                    <span v-else></span>
                </template>
            </el-table-column>
            <el-table-column
                    sortable
                    prop="arrival_time"
                    label="实际时间">
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
                    <el-button @click="editUser(scope.row.lift_id)" type="primary" icon="el-icon-edit" size="small"
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

    export default {
        data() {
            return {
                paginate_api: '/dm/lift_plan/all',
                paginate_params: {
                    "page": 1,
                    "property": "id",
                    "size": 10,
                    "sort": "DESC"
                },
                refresh: false,
                params: {
                    name: '',
                    status: null,
                    type: null
                },
                typeOption: [
                    {
                        value: 1,
                        label: '半月维保'
                    }, {
                        value: 2,
                        label: '季度维保'
                    }, {
                        value: 3,
                        label: '半年维保'
                    }, {
                        value: 4,
                        label: '年度维保'
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
                        value: 2,
                        label: '不合格'
                    },
                    {
                        value: 1,
                        label: '合格'
                    }, {
                        value: 0,
                        label: '未完成'
                    }
                ],
                usersData: []
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
            }
        },
        methods: {
            onValChange(data) {
                console.log(data);
                this.usersData = data
            },
            initList() {
                this.paginate_api = '/dm/lift_plan/all';
                this.paginate_params = {
                    "page": 1,
                    "property": "id",
                    "size": 10,
                    "sort": "DESC"
                };
                this.refresh = !this.refresh;
            },
            listByStatus() {
                if (this.params.status === '') return;
                this.paginate_api = '/dm/lift_plan/list/status';
                this.paginate_params = {
                    "page_proto": {
                        "page": 1,
                        "property": "id",
                        "size": 10,
                        "sort": "DESC"
                    },
                    "status": this.params.status
                };
                this.refresh = !this.refresh;
            },
            listByType() {
                if (this.params.type === '') return;
                this.paginate_api = '/dm/lift_plan/list/type';
                this.paginate_params = {
                    "page_proto": {
                        "page": 1,
                        "property": "id",
                        "size": 10,
                        "sort": "DESC"
                    },
                    "type": this.params.type
                };
                this.refresh = !this.refresh;
            },
            tableAction() {
                return this.$createElement('HelpHint', {
                    props: {
                        content: ' 编辑用户 / 禁用或允许登录 / 删除用户'
                    }
                }, '操作');
            },
            editUser(id) {
                this.$router.push({path: '/lift_detail', query: {lift_id: id}})
            }
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
