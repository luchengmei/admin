<template>
    <div class="user-list">
        <ToolBar>
            <div style="float: right;">
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
                <el-select style="" v-model="params.alarm_type" placeholder="报警类型" size="small"
                           clearable>
                    <el-option
                            v-for="item in alarmTypeOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select style="width: 140px;" v-model="params.status" placeholder="报警状态" size="small" clearable>
                    <el-option
                            v-for="item in statusOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input
                        placeholder="请输入故障描述/电梯名称"
                        size="small"
                        style="width: 200px"
                        v-model="params.name"
                        @keyup.native.enter="searchUser"
                        @clear="searchUser"
                        clearable>
                </el-input>
                <el-button @click="searchUser" type="success" icon="el-icon-search" size="small"></el-button>
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
            <el-table-column width="100px" prop="id">
                <template slot="header" slot-scope="scope">
                    ID
                    <table-sort @ascending="onAscOrDesc('id',0)"
                                @descending="onAscOrDesc('id',1)"
                                @reset="onReset('id')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    width="100px"
                    prop="img_urls"
                    label="报警截图">
                <template slot-scope="scope">
                    <el-image
                            @click="previewImage(scope.row.img_urls)"
                            :src="scope.row.img_thumb"
                            fit="scale-down"
                            :preview-src-list="srcList">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column
                    prop="lift_name"
                    label="电梯名称">
                <template slot="header" slot-scope="scope">
                    电梯名称
                    <table-sort @ascending="onAscOrDesc('lift_name',0)"
                                @descending="onAscOrDesc('lift_name',1)"
                                @reset="onReset('lift_name')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    prop="fault_code"
                    label="报警类型">
                <template slot-scope="scope">{{scope.row.fault_code|typeFilter}}</template>
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="报警描述">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="报警处理状态">
                <template slot-scope="scope">
                    <el-tag v-show="scope.row.status=='0'" type="danger" size="small">未处理</el-tag>
                    <el-tag v-show="scope.row.status=='2'" type="success" size="small">已处理</el-tag>
                    <el-tag v-show="scope.row.status=='3'" type="default" size="small">误报</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    prop="ctime"
                    label="报警首次发生时间">
                <template slot="header" slot-scope="scope">
                    报警首次发生时间
                    <table-sort @ascending="onAscOrDesc('ctime',0)"
                                @descending="onAscOrDesc('ctime',1)"
                                @reset="onReset('ctime')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    prop="utime"
                    label="报警最新一次更新时间">
                <template slot="header" slot-scope="scope">
                    报警最新一次时间
                    <table-sort @ascending="onAscOrDesc('utime',0)"
                                @descending="onAscOrDesc('utime',1)"
                                @reset="onReset('utime')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    :render-header="tableAction"
                    width="180">
                <template slot-scope="scope">
                    <el-button @click="editUser(scope.row.id)" type="primary" icon="el-icon-edit" size="small"
                               circle></el-button>
                    <!--<el-button @click="" type="danger" icon="el-icon-delete" circle size="small"></el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <paginate :api="list_url" :params="list_params" :refresh="refresh" @val-change="onValChange"></paginate>
    </div>
</template>

<script>
    import ToolBar from '@/components/ToolBar.vue';
    import HelpHint from '@/components/HelpHint.vue';
    import Paginate from '@/components/Paginate.vue';
    import TableSort from '../../components/TableSort'

    export default {
        data() {
            return {
                refresh: false,
                list_url: '/LiftsFault/listPage',
                list_params: {
                    "page": 1,
                    "size": 10,
                    "sort": {}
                },
                srcList:[],
                params: {
                    name: '',
                    status: '',
                    alarm_type: ''
                },
                alarmTypeOption: [
                    {
                        value: '301',
                        label: '机房湿度异常'
                    }, {
                        value: '302',
                        label: '机房温度异常'
                    }, {
                        value: '303',
                        label: '机房噪声异常'
                    }, {
                        value: '304',
                        label: '安全回路断路'
                    }, {
                        value: '305',
                        label: '抱闸温度异常'
                    }, {
                        value: '306',
                        label: '电流异常'
                    }, {
                        value: '307',
                        label: '曳引绳断股'
                    }, {
                        value: '201',
                        label: '超时不开门'
                    }, {
                        value: '202',
                        label: '超时不关门'
                    }, {
                        value: '204',
                        label: '电梯非门区停车'
                    }, {
                        value: '205',
                        label: '电梯意外移动'
                    }, {
                        value: '206',
                        label: '电梯非门区开门'
                    }, {
                        value: '401',
                        label: '电梯困人'
                    }, {
                        value: '402',
                        label: '紧急按钮被按下'
                    }, {
                        value: '207',
                        label: '电梯超速'
                    }, {
                        value: '208',
                        label: '电梯失速'
                    }, {
                        value: '209',
                        label: '轿厢含氧量低'
                    }, {
                        value: '210',
                        label: '电梯停电'
                    }, {
                        value: '211',
                        label: '轿厢倾斜超标'
                    }, {
                        value: '212',
                        label: '轿厢振动超标'
                    }, {
                        value: '101',
                        label: '底坑湿度异常'
                    }, {
                        value: '102',
                        label: '底坑温度异常'
                    }, {
                        value: '103',
                        label: '底坑噪声异常'
                    }, {
                        value: '104',
                        label: '钢丝绳伸长'
                    }, {
                        value: '105',
                        label: '安全钳保护装置异常'
                    }, {
                        value: '106',
                        label: '底坑积水报警'
                    }
                ],
                statusOption: [
                    {
                        value: 0,
                        label: '未处理'
                    }, {
                        value: 2,
                        label: '已处理'
                    }, {
                        value: 3,
                        label: '误报'
                    }
                ],
                usersData: [],
                selectData: [],
                pickerValue: [],
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
            }
        },
        mounted() {
        },
        filters: {
            typeFilter(val) {
                if (val == '301') return '机房湿度异常';
                if (val == '302') return '机房温度异常';
                if (val == '304') return '安全回路断路';
                if (val == '305') return '抱闸温度异常';
                if (val == '306') return '电流异常';
                if (val == '307') return '曳引绳断股';
                if (val == '201') return '超时不开门';
                if (val == '202') return '超时不关门';
                if (val == '204') return '电梯非门区停车';
                if (val == '205') return '电梯意外移动';
                if (val == '206') return '电梯非门区开门';
                if (val == '401') return '电梯困人';
                if (val == '402') return '紧急按钮被按下';
                if (val == '207') return '电梯超速';
                if (val == '208') return '电梯失速';
                if (val == '209') return '轿厢含氧量低';
                if (val == '210') return '电梯停电';
                if (val == '211') return '轿厢倾斜超标';
                if (val == '211') return '轿厢振动超标';
                if (val == '101') return '底坑湿度异常';
                if (val == '102') return '底坑温度异常';
                if (val == '103') return '底坑噪声异常';
                if (val == '104') return '钢丝绳伸长';
                if (val == '105') return '安全钳保护装置异常';
                if (val == '106') return '底坑积水报警';
                return val;
            }
        },
        methods: {
            previewImage(url) {
                //console.log(url);
                this.srcList.splice(0, 1, url);
            },
            onValChange(data) {
                this.usersData = data;
            },
            onAscOrDesc(str, num) {
                console.log(str, num);
                this.list_params.sort[str] = num;
                this.refresh = !this.refresh;
            },
            onReset(str) {
                delete this.list_params.sort[str];
                this.refresh = !this.refresh;
            },
            searchUser() {
                this.list_params.page = 1;
                this.list_params.search_content = this.params.name;
                this.list_params.status = this.params.status;
                this.list_params.fault_code = this.params.alarm_type;
                if (this.pickerValue && this.pickerValue.length === 2) {
                    this.list_params.start_date = this.pickerValue[0];
                    this.list_params.end_date = this.pickerValue[1];
                } else {
                    this.list_params.start_date = '';
                    this.list_params.end_date = '';
                }
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
                this.$router.push({path: '/alarm_detail', query: {alarm_id: id}})
            },
            onSelectionChange(selection) {
                console.log(selection);
                this.selectData = selection;
            },

        },
        components: {
            ToolBar, HelpHint, Paginate, TableSort
        }
    }
</script>
<style scoped lang="less">
</style>
