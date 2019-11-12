<template>
    <div class="analy">
        <el-tabs v-model="activeName" type="card" style="backgroundColor:inherit;">
            <el-tab-pane label="总体情况" name="all" style="backgroundColor:inherit;">
                <div class="header_l">
                    <el-date-picker
                            clearable
                            v-model="searchDate"
                            type="daterange"
                            align="right"
                            unlink-panels
                            value-format="yyyy-MM-dd"
                            style="margin:0 10px"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                            @change="handleSelectDate">
                    </el-date-picker>
                    <el-button type="primary" size="medium" @click="handleSearch">查询</el-button>
                    <el-button type="primary" size="medium">重置</el-button>
                    <el-button type="primary" size="medium">刷新</el-button>
                    <span class="update">更新时间:  {{updateTime}}</span>
                </div>
                <div class="countBox">
                    <div>
                        <p class="title">当前离线台数</p>
                        <p class="count">{{currentoff}}</p>
                    </div>
                    <div>
                        <p class="title">累计离线台数</p>
                        <p class="count">12</p>
                    </div>
                    <div>
                        <p class="title">累计离线时长</p>
                        <p class="count">{{addUp}}</p>
                    </div>
                </div>
                <div class="offline" style="backgroundColor:#fff;">
                    <span>离线台数统计表</span>
                    <div class="content">
                        <div id="allof_count" style="width: 70%;height:350px;"></div>
                        <el-table
                        :data="offlineList"
                        stripe>
                            <el-table-column
                                prop="lift_id"
                                align="center"
                                label="id"
                                width="50">
                            </el-table-column>
                            <el-table-column
                                prop="name"
                                label="电梯名称"
                                align="center"
                                width="200">
                            </el-table-column>
                            <el-table-column
                                prop="ctime"
                                align="center"
                                label="离线时间"
                                width="230">
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div id="allof_time"  style="width: 100%;height:350px;"></div>
                <el-table
                :data="allData"
                style="width: 100%"
                stripe>
                    <el-table-column
                        prop="ctime"
                        align="center"
                        label="时间"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="lift_id"
                        align="center"
                        label="id"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="lift_name"
                        align="center"
                        label="电梯名称">
                    </el-table-column>
                    <el-table-column
                        prop="online"
                        align="center"
                        label="上线/下线">
                        <div slot-scope="scope" style="width: 100%;">
                            <span v-if="scope.row.online">上线</span>
                            <span v-else>下线</span>
                        </div>
                    </el-table-column>
                    <el-table-column
                        prop="time"
                        align="center"
                        label="持续时间"
                        :formatter="formatSeconds">
                    </el-table-column>
                </el-table>
                <paginate :api="paginate_api" :params="paginate_params" @val-change="onValChange" :refresh="refresh"></paginate>
            </el-tab-pane>
            <el-tab-pane label="单台情况" name="single">
                <div class="header_l">
                    <el-date-picker
                        v-model="date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                    <el-select v-model="value" placeholder="请选择" style="margin: 0 10px">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="primary" size="medium">查询</el-button>
                    <el-button type="primary" size="medium">重置</el-button>
                    <el-button type="primary" size="medium">刷新</el-button>
                    <span class="update">更新时间:</span>
                </div>
                <div class="countBox">
                    <div>
                        <p class="title">累计离线时长</p>
                        <p class="count">10h</p>
                    </div>
                    <div>
                        <p class="title">累计离线次数</p>
                        <p class="count">12</p>
                    </div>
                </div>
                <div id="single_count" style="width: 100%;height:350px;"></div>
                <div id="single_time"  style="width: 100%;height:350px;"></div>
                <el-table
                :data="allData"
                style="width: 100%"
                stripe>
                    <el-table-column
                        prop="date"
                        align="center"
                        label="时间"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        align="center"
                        label="id"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        align="center"
                        label="电梯名称">
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        align="center"
                        label="上线/下线">
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        align="center"
                        label="持续时间">
                    </el-table-column>
                </el-table>
                <!-- <paginate :api="paginate_api" :params="paginate_params" @val-change="onValChange" :refresh="refresh"></paginate> -->
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import Paginate from "@/components/Paginate";
export default{
    components: {
        Paginate
    },
    data () {
        return {
            updateTime:new Date().toLocaleDateString()+`  ${new Date().toLocaleTimeString('chinese', { hour12: false })}`,
            activeName:'all',
            date:'',
            addUp:'',
            allof_count:{
                tooltip: {
                    trigger: 'axis',
                    backgroundColor:'rgba(255,255,255,0.8)',
                    textStyle:{
                        color:'#666',
                        fontSize:12,
                    },
                    extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);'
                },
                legend: {
                    data: ['离线', '总台数'],
                    itemHeight: 0,
                    itemWidth: 15,
                    bottom: '0%',
                    itemGap: 4,
                    textStyle: {
                        color: '#acacac',
                        fontSize: 12
                    }
                },
                grid: {
                    left: '2%',
                    right:'5%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    axisPointer:{
                        type:'none'
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#ccc'
                        }
                    },
                    axisTick:{
                        alignWithLabel: true,
                        lineStyle:{
                            color:'#ccc'
                        }
                    },
                    axisLabel:{
                        rotate:-45,
                        color:'#666'
                    },
                    data: []
                },
                yAxis: {
                    type: 'value',
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    splitLine:{
                        lineStyle:{
                            color:'rgba(0,0,0,0.1)',
                            type:'dotted'
                        }
                    }
                },
                series: [{
                    name:'离线',
                    symbol:'circle',
                    data: [],
                    type: 'line',
                    color: ['#2fc25b']
                },{
                    name:'总台数',
                    symbol:'circle',
                    data: [],
                    type: 'line',
                    color: ['#1890ff']
                }]
            },
            allof_time:{
                color: ['#3aa1ff'],
                title:{
                    text:'离线时长统计表',
                    left:'center',
                    textStyle:{
                        fontSize:13,
                        fontWeight:400
                    },
                    top: 15,
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor:'rgba(255,255,255,0.8)',
                    textStyle:{
                        color:'#666',
                        fontSize:12,
                    },
                    extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);'
                },
                grid: {
                    left: '2%',
                    right: '2%',
                    bottom: '2%',
                    containLabel: true
                },
                xAxis : [{
                    type : 'category',
                    data: [],
                    axisPointer:{
                        type:'none'
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#ccc'
                        }
                    },
                    axisTick:{
                        alignWithLabel: true,
                        lineStyle:{
                            color:'#ccc'
                        }
                    },
                    axisLabel:{
                        interval:0,
                        color:'#666'
                    }
                }],
                yAxis : [{
                    type : 'value',
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    splitLine:{
                        lineStyle:{
                            color:'rgba(0,0,0,0.1)',
                            type:'dotted'
                        }
                    }
                }],
                series : [{
                    name:'离线时长',
                    type:'bar',
                    barWidth: '55%',
                    data:[]
                }]
            },
            searchDate:'',
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            console.log(start.getTime())
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 0.5);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6.5);
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
            currentoff:'',
            offlineList: [],
            paginate_api: '/LogOnline/listPage',
            paginate_params: {
                "page": 1,
                "sort": {ctime:1,status:1,sort:1}
            },
            refresh: false,
            params: {
                name: '',
            },
            allData:[],
            options: [
                {
                    value: '选项1',
                    label: '1'
                }, {
                value: '选项2',
                label: '2'
                }, {
                value: '选项3',
                label: '3'
                }, {
                value: '选项4',
                label: '4'
                }, {
                value: '选项5',
                label: '5'
                }
            ],
            value: ''
        }
    },
    watch: {
      activeName(newVal){
          if(newVal==='single'){
              this.$nextTick(()=>{
                  let single_count=this.$echarts.init(document.getElementById('single_count'))
                  let single_time=this.$echarts.init(document.getElementById('single_time'))
                  single_count.setOption(this.allof_time)
                  single_time.setOption(this.allof_time)
              })
          }
      }  
    },
    mounted () {
        this.$echarts.init(document.getElementById('allof_count')).setOption(this.allof_count)
        this.$echarts.init(document.getElementById('allof_time')).setOption(this.allof_time)
        this.initData()
    },
    methods:{
        initData(){
            this.$api_v3.post('/LogOnline/currentOfflineStatistic').then((res)=>{
                if(res.code===0){
                    this.offlineList=res.data.slice(0,7)
                    this.currentoff=res.data.length
                }
            })
            let start=new Date().getFullYear()+'-'+parseInt(new Date().getMonth()+1)+'-01'
            let end=new Date().getFullYear()+'-'+parseInt(new Date().getMonth()+1)+'-31'
            this.initChart(start,end)
        },
        initChart(start,end){
            this.$api_v3.post('LogOnline/offlineStatistic',{start_date:start,end_date:end}).then((res)=>{
                if(res.code===0){
                    let xArr=[]
                    let yArr=[]
                    res.data.forEach((i)=>{
                        xArr.push(i.date)
                        yArr.push(i.number)
                    })
                    this.$echarts.init(document.getElementById('allof_count')).setOption({xAxis:{data:xArr},series:[{data:yArr}]})
                }
            })
            this.$api_v3.post('LogOnline/offlineTimeStatistic',{start_date:start,end_date:end}).then((res)=>{
                if(res.code===0){
                    let xArr=[]
                    let yArr=[]
                    let addUp={time:0};
                    res.data.forEach((i)=>{
                        xArr.push(i.date)
                        yArr.push(i.number)
                        addUp.time+=parseInt(i.number)
                    })
                    this.addUp=this.formatSeconds(addUp)
                    this.$echarts.init(document.getElementById('allof_time')).setOption({xAxis:{data:xArr},series:[{data:yArr}]})
                }
            })
        },
        handleSearch(){
            this.initChart(this.searchDate[0],this.searchDate[1])
        },
        onValChange(data) {
            this.allData = data;
        },
        handleSelectDate(value){
            console.log(this.searchDate)
        },
        formatSeconds(value) {
            if(!value.time) return '--'
            var secondTime = parseInt(value.time);
            var minuteTime = 0;
            var hourTime = 0;
            if(secondTime > 60) {
                minuteTime = parseInt(secondTime / 60);
                secondTime = parseInt(secondTime % 60);
                if(minuteTime > 60) {
                    hourTime = parseInt(minuteTime / 60);
                    minuteTime = parseInt(minuteTime % 60);
                }
            }
            var result = "" + parseInt(secondTime) + "秒";
            if(minuteTime > 0) {
            result = "" + parseInt(minuteTime) + "分" + result;
            }
            if(hourTime > 0) {
            result = "" + parseInt(hourTime) + "小时" + result;
            }
            return result;
        },
        placeCode(value){
            switch (value) {
                case 'date':
                    return '选择日期';
                case 'week':
                    return '选择周';
                case 'month':
                    return '选择月';
                case 'year':
                    return '选择年';
                default:
                    break;
            }
        }
    }
}
</script>
<style lang="less" scoped>
.analy{
    /deep/.el-tabs__header{
        margin: 0;
        background: #fff;
        .el-tabs__nav{
            border: unset;
        }
    }
    font-size: 14px;
    .header_l{
        background-color:#fff;
        padding: 20px;
        .update{
            display: inline;
            margin-left: 10px;
        }
    }
    .countBox{
        display: flex;
        color: #acacac;
        background-color:#fff;
        margin: 10px 0;
        padding-left: 20px;
        div{
            display: flex;
            flex-direction: column;
            margin: 40px 20px 40px 0;
            .count{
                text-align: center;
                display: block;
                padding-top: 20px;
                color: #666;
                font-size: 30px;
                line-height: 1;
            }
        }
    }
    .offline{
        padding: 20px 0;
        background-color:#fff;
        text-align: center;
        .content{
            display: flex;
        }
    }
    #allof_time,#single_count,#single_time{
        background-color: #fff;
        margin: 10px 0;
    }
}
</style>