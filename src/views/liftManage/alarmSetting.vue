<template>
    <div>
        <ToolBar>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="dialogVisible = true">添加</el-button>
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
                            <span style="flex: 4;min-width: 350px">
                                <div style="display: flex">
                                    <el-time-select placeholder="起始时间" v-model="i.start_time"
                                                    :picker-options="{start: '00:00',step: '01:00',end: '23:00' }"></el-time-select>
                                    <el-time-select placeholder="结束时间" v-model="i.end_time"
                                                    :picker-options="{start: '01:00',step: '01:00',end: '24:00',minTime: i.start_time}"></el-time-select>
                                </div>
                            </span>
                                <span style="flex: 2"><el-switch :disabled="props.row.status !==1" :active-value="1"
                                                                 :inactive-value="0"
                                                                 @change="onInputChange(props.row)"
                                                                 v-model="i.enable_message"></el-switch></span>
                                <span style="flex: 2"><el-switch :disabled="props.row.status !==1" :active-value="1"
                                                                 :inactive-value="0"
                                                                 @change="onInputChange(props.row)"
                                                                 v-model="i.enable_sms"></el-switch></span>
                                <span style="flex: 2"><el-input v-model="i.max"
                                                                @change="onInputChange(props.row)"></el-input></span>
                                <span style="flex: 2"><el-input v-model="i.min"
                                                                @change="onInputChange(props.row)"></el-input></span>
                                <span style="flex: 1"><el-button @click="deleteCondition(props.row,index)"
                                                                 icon="el-icon-minus" circle type="danger"></el-button></span>
                            </p>
                        </transition-group>
                    </div>
                    <el-button style="margin-top: 5px" icon="el-icon-plus" circle
                               @click="addCondition(props.row)"></el-button>
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
                    label="报警类型">
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
                    <el-switch :active-value="1" @change="onInputChange(scope.row)"
                               :inactive-value="0" v-model="scope.row.status"></el-switch>
                </template>
            </el-table-column>
            <el-table-column
                    prop="enable_message"
                    label="是否开启消息通知">
                <template slot-scope="scope">
                    <el-switch :disabled="scope.row.status !==1" @change="onInputChange(scope.row)"
                               :active-value="1" :inactive-value="0"
                               v-model="scope.row.enable_message"></el-switch>
                </template>
            </el-table-column>
            <el-table-column
                    prop="enable_sms"
                    label="是否开启短息通知">
                <template slot-scope="scope">
                    <el-switch :disabled="scope.row.status !==1" @change="onInputChange(scope.row)"
                               :active-value="1" :inactive-value="0"
                               v-model="scope.row.enable_sms"></el-switch>
                </template>
            </el-table-column>
        </el-table>
        <paginate :api="paginate_api" :params="paginate_params" @val-change="onValChange" :refresh="refresh"></paginate>
        <el-dialog title="添加报警项" :visible.sync="dialogVisible">
            <el-form :model="form">
                <el-form-item label="报警类型" :label-width="formLabelWidth">
                    <el-select value="" v-model="form.fault_type_id" clearable>
                        <el-option v-for="i in faultTypeOption" :key="i.id" :value="i.id" :label="i.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择电梯" :label-width="formLabelWidth">
                    <el-autocomplete
                            clearable
                            v-model="form.lift_name"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            value-key="name"
                            :debounce="1000"
                            @select="handleSelect">
                    </el-autocomplete>
                    (请务必在列表中选取)
                </el-form-item>
                <el-form-item label="是否开启" :label-width="formLabelWidth">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="通知方式" :label-width="formLabelWidth">
                    <el-checkbox :disabled="form.status===0" :true-label="1" :false-label="0"
                                 v-model="form.enable_message" label="消息通知">
                    </el-checkbox>
                    <el-checkbox :disabled="form.status===0" label="短信通知" :true-label="1" :false-label="0"
                                 v-model="form.enable_sms">
                    </el-checkbox>
                </el-form-item>
                <el-form-item label="时段设置" :label-width="formLabelWidth">
                    <div style="display: flex;">
                        <el-time-select style="margin-right: 30px" placeholder="起始时间"
                                        v-model="form.condition[0].start_time"
                                        :picker-options="{start: '00:00',step: '01:00',end: '23:00' }"></el-time-select>
                        <el-time-select style="margin-right: 30px" placeholder="结束时间"
                                        v-model="form.condition[0].end_time"
                                        :picker-options="{start: '01:00',step: '01:00',end: '24:00',minTime: form.condition[0].start_time}"></el-time-select>
                        <el-checkbox :disabled="form.status===0" :true-label="1" :false-label="0"
                                     v-model="form.condition[0].enable_message" label="消息通知">
                        </el-checkbox>
                        <el-checkbox :disabled="form.status===0" label="短信通知" :true-label="1" :false-label="0"
                                     v-model="form.condition[0].enable_sms">
                        </el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="" :label-width="formLabelWidth">
                    <el-button size="small" type="primary" @click="submitForm" :loading="loading">立即创建</el-button>
                    <el-button size="small">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
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
                loading: false,
                formLabelWidth: '120px',
                form: {
                    status: 1,
                    condition: [
                        {
                            "start_time": "00:00:00",
                            "end_time": "08:00:00",
                            "enable_message": 0,
                            "enable_sms": 0,
                            "max": 0,
                            "min": 0
                        },
                    ],
                },
                dialogVisible: false,
                tableData: [],
                params: {name: ''},
                paginate_api: '/LiftsFaultSetting/listPage',
                paginate_params: {
                    "page": 1,
                    "sort": {id: 1},
                    "level": ''
                },
                refresh: false,
                level: [1, 2, 3, 4],
                faultTypeOption: []
            }
        },
        methods: {
            search() {
            },
            onValChange(data) {
                this.tableData = data;
            },
            onAscOrDesc(str, num) {
                console.log(str, num);
                this.paginate_params.sort[str] = num;
                this.refresh = !this.refresh;
            },
            onInputChange(data) {
                console.log(data);
                this.saveFaultSetting(data)
            },
            saveFaultSetting(param, success, error) {
                this.$api_v3.post('/LiftsFaultSetting/save', param).then((res) => {
                    console.log('/LiftsFaultSetting/save', res);
                    if (res.code === 0) {
                        if (success) {
                            success();
                        }
                    } else {
                        this.$message.error(res.msg);
                        if (error) {
                            error();
                        }
                    }
                })
            },
            addCondition(data) {
                console.log(data);
                data.condition.push({
                    enable_message: 0,
                    enable_sms: 0,
                    end_time: "00:00",
                    max: 0,
                    min: 0,
                    start_time: "00:00"
                });
                this.saveFaultSetting(data);
            },
            deleteCondition(data, index) {
                this.$confirm('')
                data.condition.splice(index, 1);
                this.saveFaultSetting(data);
            },
            getFaultType() {
                this.$api_v3.post('/LiftsFaultType/listPage', {list_rows: 99}).then((res) => {
                    console.log('/LiftsFaultType/listPage', res);
                    if (res.code === 0) {
                        this.faultTypeOption = res.data.data;
                    }
                })
            },
            handleSelect(item) {
                this.form.lift_id = item.id;
            },
            querySearchAsync(queryString, cb) {
                this.$api_v3.post('/Lifts/listPage', {search_content: queryString, list_rows: 999}).then((res) => {
                    console.log('/Lifts/listPage', res);
                    if (res.code === 0) {
                        cb(res.data.data)
                    }
                })
            },
            submitForm() {
                this.loading = true;
                this.saveFaultSetting(this.form, () => {
                    this.loading = false;
                    this.dialogVisible = false;
                    this.from = {
                        status: 1,
                        condition: [
                            {
                                "start_time": "00:00:00",
                                "end_time": "08:00:00",
                                "enable_message": 0,
                                "enable_sms": 0,
                                "max": 0,
                                "min": 0
                            },
                        ],
                    };
                    this.refresh = !this.refresh;
                },()=>{
                    this.loading = false;
                })
            }
        },
        mounted() {
            this.getFaultType();
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

