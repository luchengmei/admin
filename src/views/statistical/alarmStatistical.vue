<template>
    <div class="alarm">
        <div class="header_l">
            <el-date-picker
                    clearable
                    v-model="faultSearch"
                    type="daterange"
                    align="right"
                    unlink-panels
                    value-format="yyyy-MM-dd"
                    style="margin-right:10px"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
            </el-date-picker>
            <el-select
                    v-model="chooseLift"
                    multiple
                    collapse-tags
                    style="margin-left: 20px;margin-right: 20px"
                    placeholder="请选择"
                    @change="handleSelect">
                <el-option
                        v-for="item in liftOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <!--<el-select-->
            <!--v-model="chooseType"-->
            <!--multiple-->
            <!--collapse-tags-->
            <!--style="margin: 0 20px;"-->
            <!--placeholder="请选择"-->
            <!--@change="handleSelect">-->
            <!--<el-option-->
            <!--v-for="item in typeOptions"-->
            <!--:key="item.id"-->
            <!--:label="item.name"-->
            <!--:value="item.fault_code">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <!--<el-select-->
            <!--v-model="chooseStatus"-->
            <!--multiple-->
            <!--collapse-tags-->
            <!--style="margin-right: 20px;"-->
            <!--placeholder="请选择">-->
            <!--<el-option-->
            <!--v-for="item in statusOptions"-->
            <!--:key="item.status"-->
            <!--:label="item.name"-->
            <!--:value="item.status">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <el-button type="primary" size="medium" @click="onClick('search')">查询</el-button>
            <el-button type="primary" size="medium" @click="onClick('reset')">重置</el-button>
            <el-button type="primary" size="medium" @click="onClick('refresh')" style="margin-right:10px">刷新</el-button>
            <span class="update">更新时间:  {{updateTime}}</span>
        </div>
        <div class="countBox">
            <div>
                <p class="title">累计故障次数</p>
                <p class="count">{{overview.total - overview.falsePositive}}</p>
            </div>
            <div>
                <p class="title">累计误报次数</p>
                <p class="count">{{overview.falsePositive}}</p>
            </div>
            <div>
                <p class="title">累计困人次数</p>
                <p class="count">{{overview.trap}}</p>
            </div>
        </div>
        <div id="fault_times"></div>
        <div id="fault_type"></div>
        <el-table
                @select="onSelectionChange"
                @select-all="onSelectionChange"
                :data="usersData"
                border
                ref="table"
                style="width: 100%">
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
        </el-table>
        <paginate :api="list_url" :params="list_params" :refresh="refresh" @val-change="onValChange"></paginate>
    </div>
</template>
<script>
    import Paginate from '@/components/Paginate.vue';
    import TableSort from '../../components/TableSort';
    import HelpHint from '@/components/HelpHint.vue';

    export default {
        data() {
            return {
                faultSearch: '',
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '最近一天',
                            onClick(picker) {
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 0.5);
                                picker.$emit('pick', [start, start]);
                            }
                        },
                        {
                            text: '最近一周',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近一个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近一年',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 360);
                                picker.$emit('pick', [start, end]);
                            }
                        }
                    ]
                },
                updateTime: new Date().toLocaleDateString() + `  ${new Date().toLocaleTimeString('chinese', {hour12: false})}`,
                fault_times: {
                    title: {
                        text: '报警和实际故障次数',
                        left: 'center',
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        textStyle: {
                            color: '#666',
                            fontSize: 12,
                        },
                        extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);'
                    },
                    legend: {
                        data: ['实际故障', '总报警数'],
                        itemHeight: 0,
                        itemWidth: 15,
                        bottom: '5%',
                        itemGap: 4,
                        textStyle: {
                            color: '#acacac',
                            fontSize: 12
                        }
                    },
                    grid: {
                        left: '2%',
                        right: '5%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        axisPointer: {
                            type: 'none'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        },
                        axisTick: {
                            alignWithLabel: true,
                            lineStyle: {
                                color: '#ccc'
                            }
                        },
                        axisLabel: {
                            rotate: -45,
                            color: '#666'
                        },
                        data: []
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            lineStyle: {
                                color: 'rgba(0,0,0,0.1)',
                                type: 'dotted'
                            }
                        }
                    },
                    series: [{
                        name: '实际故障',
                        symbol: 'circle',
                        data: [],
                        type: 'line',
                        color: ['#2fc25b']
                    }, {
                        name: '总报警数',
                        symbol: 'circle',
                        data: [],
                        type: 'line',
                        color: ['#1890ff']
                    }]
                },
                fault_type: {
                    //color: ['#3aa1ff', '#4ecb73', '#36cbcb', '#fbd437'],
                    title: {
                        text: '报警类型（不含误报）',
                        x: 'center',
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        bottom: '0',
                        itemWidth: 10,
                        itemHeight: 10,
                        data: []
                    },
                    series: [
                        {
                            name: '报警类型',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '50%'],
                            data: [],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                },
                chooseLift: [],
                chooseType: [],
                chooseStatus: [0],
                liftOptions: [],
                typeOptions: [],
                statusOptions: [
                    {
                        status: 0,
                        name: '未处理'
                    },
                    {
                        status: 1,
                        name: '已读'
                    },
                    {
                        status: 2,
                        name: '已处理'
                    },
                    {
                        status: 3,
                        name: '误报'
                    }
                ],
                refresh: false,
                list_url: '/LiftsFault/listPage',
                list_params: {
                    "page": 1,
                    "size": 10,
                    "sort": {}
                },
                srcList: [],
                params: {
                    name: '',
                    status: '',
                    alarm_type: ''
                },
                usersData: [],
                selectData: [],
                pickerValue: [],
                overview: {}
            }
        },
        mounted() {
            this.init()
            this.getFaultTimes()
            this.getFaultDistribution()
            this.getFaultOverview()
        },
        methods: {
            onClick(action) {
                if (action === 'search') {
                }
                if (action === 'reset') {
                    this.chooseLift = [];
                    this.faultSearch = this.initTime();
                }
                if (action === 'refresh') {
                }
                this.getFaultTimes()
                this.getFaultDistribution()
                this.getFaultOverview()
            },
            init() {
                this.faultSearch = this.initTime()
                this.$api_v3.post('/Lifts/listPage', {list_rows: 999999}).then((res) => {
                    if (res.code === 0) {
                        this.liftOptions = res.data.data
                    }
                })
                this.$api_v3.post('/LiftsFaultType/listPage', {status: [1]}).then((res) => {
                    if (res.code === 0) {
                        this.typeOptions = res.data.data
                    }
                })
            },
            initTime() {
                let start = new Date()
                let end = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
                return [`${start.getFullYear()}` + '-' + `${start.getMonth() + 1}` + '-' + `${start.getDate()}`, `${end.getFullYear()}` + '-' + `${end.getMonth() + 1}` + '-' + `${end.getDate()}`]
            },
            getFaultDistribution() {
                let param = {
                    start_date: this.faultSearch[0],
                    end_date: this.faultSearch[1],
                };
                if (this.chooseLift.length) {
                    param.lift_ids = this.chooseLift
                }
                this.$api_v3.post('/LiftsFault/faultDistribution', param).then((res) => {
                    console.log('/LiftsFault/faultDistribution', res);
                    if (res.code === 0) {
                        let seriesData = [], legendData = [];
                        res.data.forEach((item) => {
                            seriesData.push({value: item.count, name: item.name});
                            legendData.push({icon: 'circle', name: item.name})
                        });
                        this.fault_type.series[0].data = seriesData;
                        this.fault_type.legend.data = legendData;
                        this.$echarts.init(document.getElementById('fault_type')).setOption(this.fault_type);
                    }
                })
            },
            getFaultTimes() {
                let param = {
                    start_date: this.faultSearch[0],
                    end_date: this.faultSearch[1],
                };
                if (this.chooseLift.length) {
                    param.lift_ids = this.chooseLift
                }
                this.$api_v3.post('/LiftsFault/faultTimes', param).then((res) => {
                    console.log('/LiftsFault/faultTimes', res);
                    if (res.code === 0) {
                        let xAxisData = [], seriesData0 = [], seriesData1 = [];
                        res.data.forEach((item) => {
                            xAxisData.push(item.date);
                            seriesData0.push(item.true_fault);
                            seriesData1.push(item.total);
                        });
                        this.fault_times.xAxis.data = xAxisData;
                        this.fault_times.series[0].data = seriesData0;
                        this.fault_times.series[1].data = seriesData1;
                        this.$echarts.init(document.getElementById('fault_times')).setOption(this.fault_times)
                    }
                })
            },
            getFaultOverview() {
                let param = {
                    start_date: this.faultSearch[0],
                    end_date: this.faultSearch[1],
                };
                if (this.chooseLift.length) {
                    param.lift_ids = this.chooseLift
                }
                this.$api_v3.post('/LiftsFault/faultOverview', param).then((res) => {
                    console.log('/LiftsFault/faultOverview', res);
                    if (res.code === 0) {
                        this.overview = res.data;
                    }
                })
            },
            handleSelect(val) {
                console.log(val)
            },
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
            onSelectionChange(selection) {
                console.log(selection);
                this.selectData = selection;
            },
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
        components: {
            HelpHint, Paginate, TableSort
        }
    }
</script>
<style lang="less" scoped>
    .alarm {
        font-size: 14px;
        .header_l {
            padding: 20px;
            background-color: #fff;
            margin-bottom: 10px;
        }
        .countBox {
            display: flex;
            color: #acacac;
            background-color: #fff;
            padding-left: 20px;
            border-bottom: 1px solid rgba(0, 0, 0, .1);
            div {
                display: flex;
                flex-direction: column;
                margin: 40px 20px 40px 0;
                .count {
                    text-align: center;
                    display: block;
                    padding-top: 20px;
                    color: #666;
                    font-size: 30px;
                    line-height: 1;
                }
            }
        }
        #fault_times, #fault_type {
            width: 100%;
            height: 350px;
            padding: 20px 0;
            background-color: #fff;
        }
    }
</style>
