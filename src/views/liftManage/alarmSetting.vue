<template>
    <div>
        <ToolBar>
            <el-time-picker value-format="yyyy-mm-dd HH:mm:ss" v-model="test" :is-range="true"></el-time-picker>
            <div style="float: right">
                <el-select value="" v-model="paginate_params.level" placeholder="请选择级别" clearable>
                    <el-option
                            v-for="item in level"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                <el-input
                        placeholder="请输入电梯名称"
                        size="small"
                        style="width: 250px"
                        v-model="params.name"
                        @clear="search"
                        @keyup.native.enter="search"
                        clearable>
                </el-input>
                <el-button @click="search" type="success" icon="el-icon-search" size="small"></el-button>
            </div>
        </ToolBar>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <p class="expand-container-row">
                        <span style="flex: 4;min-width: 350px">时间段</span>
                        <span style="flex: 2">是否开启通知</span>
                        <span style="flex: 2">是否开启短信通知</span>
                        <span style="flex: 2">最大值</span>
                        <span style="flex: 2">最小值</span>
                        <span style="flex: 1"></span>
                    </p>
                    <div class="hide-scrollbar expand-container">
                        <transition-group name="slide-fade">
                            <p class="expand-container-row" v-for="(i,index) in props.row.condition" v-bind:key="index">
                            <span style="flex: 4;min-width: 350px"><el-time-picker @change="onSwitchChange($event,props.row,true)"
                                                                  :is-range="true"
                                                                  v-model="i.time_period"></el-time-picker></span>
                                <span style="flex: 2"><el-switch :disabled="props.row.status !==1" :active-value="1"
                                                                 :inactive-value="0"
                                                                 v-model="i.enable_message"></el-switch></span>
                                <span style="flex: 2"><el-switch :disabled="props.row.status !==1" :active-value="1"
                                                                 :inactive-value="0"
                                                                 v-model="i.enable_sms"></el-switch></span>
                                <span style="flex: 2"><el-input v-model="i.max"></el-input></span>
                                <span style="flex: 2"><el-input v-model="i.min"></el-input></span>
                                <span style="flex: 1"><el-button @click="deleteCondition(props.row.condition,index)"
                                                                 icon="el-icon-minus" circle type="danger"></el-button></span>
                            </p>
                        </transition-group>
                    </div>
                    <el-button style="margin-top: 5px" icon="el-icon-plus" circle
                               @click="addCondition(props.row.condition)"></el-button>
                </template>
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="id">
                <template slot="header" slot-scope="scope">
                    ID
                    <table-sort @ascending="onAscOrDesc('id',0)"
                                @descending="onAscOrDesc('id',1)"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    prop="fault_name"
                    label="报警名称">
            </el-table-column>
            <el-table-column
                    prop="lift_name"
                    label="电梯名称">
            </el-table-column>
            <el-table-column
                    prop="level"
                    label="故障级别">
                <template slot="header" slot-scope="scope">
                    故障级别
                    <table-sort @ascending="onAscOrDesc('level',0)"
                                @descending="onAscOrDesc('level',1)"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    prop="fault_code"
                    label="故障码">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="是否开启">
                <template slot-scope="scope">
                    <el-switch :active-value="1"
                               :inactive-value="0" v-model="scope.row.status"></el-switch>
                </template>
            </el-table-column>
            <el-table-column
                    prop="enable_message"
                    label="是否开启消息通知">
                <template slot-scope="scope">
                    <el-switch :disabled="scope.row.status !==1" @change="onSwitchChange($event,scope.row)"
                               :active-value="1" :inactive-value="0"
                               v-model="scope.row.enable_message"></el-switch>
                </template>
            </el-table-column>
            <el-table-column
                    prop="enable_sms"
                    label="是否开启短息通知">
                <template slot-scope="scope">
                    <el-switch :disabled="scope.row.status !==1" :active-value="1" :inactive-value="0"
                               v-model="scope.row.enable_sms"></el-switch>
                </template>
            </el-table-column>
        </el-table>
        <paginate :api="paginate_api" :params="paginate_params" @val-change="onValChange"
                  :refresh="refresh"></paginate>
    </div>
</template>

<script>
    import ToolBar from '@/components/ToolBar.vue';
    import HelpHint from '@/components/HelpHint.vue';
    import TableSort from '@/components/TableSort.vue';
    import Paginate from "../../components/Paginate";

    export default {
        data() {
            return {
                test: ['2019-09-12 12:00:00', '2019-09-12 13:00:00'],
                tableData: [],
                params: {name: ''},
                paginate_api: '/LiftsFaultSetting/listPage',
                paginate_params: {
                    "page": 1,
                    "sort": {id: 1},
                    "level": ''
                },
                refresh: false,
                level: [1, 2, 3, 4]
            }
        },
        methods: {
            search() {
            },
            onValChange(data) {
                if (data.length > 0) {
                    data.forEach((i) => {
                        if (i.condition.length > 0) {
                            i.condition.forEach((j) => {
                                //为什么是2019-9-19？  因为这行代码写于2019-9-19
                                this.$set(j, 'time_period', [new Date(`2019-9-19 ${j.start_time}`), new Date(`2019-9-19 ${j.end_time}`)])
                            })
                        }
                    })
                }
                this.tableData = data;
            },
            onAscOrDesc(str, num) {
                console.log(str, num);
                this.paginate_params.sort[str] = num;
                this.refresh = !this.refresh;
            },
            onSwitchChange($event, data, isTime = false) {
                console.log($event);
                console.log(data);
                console.log(isTime);
                // if (isTime) {
                //     data.condition.start_time = this.$moment(data.condition.time_period[0]).format('hh:mm:ss');
                //     data.condition.end_time = this.$moment(data.condition.time_period[1]).format('hh:mm:ss');
                // }
                this.saveFaultSetting(data);
            },
            saveFaultSetting(param) {
                this.$api_v3.post('/LiftsFaultSetting/save', param).then((res) => {
                    console.log('/LiftsFaultSetting/save', res);
                    if (res.code === 0) {
                    } else {
                        this.$message.error(res.msg);
                    }
                })
            },
            addCondition(data) {
                console.log(data);
                data.push({
                    enable_message: 1,
                    enable_sms: 1,
                    end_time: "02:00:00",
                    max: 40.6,
                    min: 10,
                    start_time: "01:00:00"
                })
            },
            deleteCondition(data, index) {
                data.splice(index, 1);
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
        //     }
        // },
        components: {
            Paginate,
            ToolBar,
            HelpHint,
            TableSort
        }
    }
</script>
<style scoped lang="less">
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }

    .expand-container {
        max-height: 200px;
        overflow-y: scroll;
    }

    .expand-container-row {
        margin-bottom: 10px;
        line-height: 24px;
        display: flex;
        align-items: center;
        span {
            margin-right: 10px;
            overflow: hidden;
            word-break: keep-all;
        }
    }

    .el-button--small.is-circle {
        padding: 6px;
    }
</style>

