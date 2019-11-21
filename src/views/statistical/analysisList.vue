<template>
    <div class="analy">
        <el-tabs v-model="activeName" type="card" style="backgroundColor:inherit;">
            <el-tab-pane label="总体情况" name="all" style="backgroundColor:inherit;" v-loading="loading">
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
                            :picker-options="pickerOptions">
                    </el-date-picker>
                    <el-button type="primary" size="medium" @click="handleSearch(0)">查询</el-button>
                    <el-button type="primary" size="medium" @click="handleReset(0)">重置</el-button>
                    <el-button type="primary" size="medium" @click="handleRefresh(0)">刷新</el-button>
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
                        height="350"
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
                <div id="allof_time"  style="width: 100%;height:400px;"></div>
                <el-table
                :data="allData"
                style="width: 100%"
                stripe>
                    <el-table-column
                        prop="ctime"
                        align="center"
                        label="时间"
                        width="180">
                        <template slot="header" slot-scope="scope">
                            时间
                            <table-sort @ascending="onAscOrDesc('ctime',0)"
                                        @descending="onAscOrDesc('ctime',1)"
                                        @reset="onReset('ctime')"></table-sort>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="lift_id"
                        align="center"
                        label="id"
                        width="180">
                        <template slot="header" slot-scope="scope">
                            id
                            <table-sort @ascending="onAscOrDesc('lift_id',0)"
                                        @descending="onAscOrDesc('lift_id',1)"
                                        @reset="onReset('lift_id')"></table-sort>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="lift_name"
                        align="center"
                        label="电梯名称">
                        <template slot="header" slot-scope="scope">
                            电梯名称
                            <table-sort @ascending="onAscOrDesc('lift_name',0)"
                                        @descending="onAscOrDesc('lift_name',1)"
                                        @reset="onReset('lift_name')"></table-sort>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="online"
                        align="center"
                        label="上线/下线">
                        <div slot-scope="scope" style="width: 100%;">
                            <span v-if="scope.row.online">上线</span>
                            <span v-else>下线</span>
                        </div>
                        <template slot="header" slot-scope="scope">
                            上线/下线
                            <table-sort @ascending="onAscOrDesc('online',0)"
                                        @descending="onAscOrDesc('online',1)"
                                        @reset="onReset('online')"></table-sort>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="time"
                        align="center"
                        label="持续时间"
                        :formatter="formatSeconds">
                        <template slot="header" slot-scope="scope">
                            持续时间
                            <table-sort @ascending="onAscOrDesc('time',0)"
                                        @descending="onAscOrDesc('time',1)"
                                        @reset="onReset('time')"></table-sort>
                        </template>
                    </el-table-column>
                </el-table>
                <paginate :api="paginate_api" :params="paginate_params" @val-change="onValChange" :refresh="refresh"></paginate>
            </el-tab-pane>
            <el-tab-pane label="单台情况" name="single" v-loading="loading">
                <div class="header_l">
                    <el-date-picker
                            clearable
                            v-model="searchSingle"
                            type="daterange"
                            align="right"
                            unlink-panels
                            value-format="yyyy-MM-dd"
                            style="margin:0 10px"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                    <el-select v-model="ChooseLift" filterable placeholder="请选择" style="margin: 0 10px" clearable @change="handleSelect">
                        <el-option
                        v-for="item in singleList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button type="primary" size="medium" @click="handleSearch(1)">查询</el-button>
                    <el-button type="primary" size="medium" @click="handleReset(1)">重置</el-button>
                    <el-button type="primary" size="medium" @click="handleRefresh(1)">刷新</el-button>
                    <span class="update">更新时间:  {{updateTime}}</span>
                </div>
                <div class="countBox">
                    <div>
                        <p class="title">累计离线次数</p>
                        <p class="count">{{singleCount}}</p>
                    </div>
                    <div>
                        <p class="title">累计离线时长</p>
                        <p class="count">{{singleAddup}}</p>
                    </div>
                </div>
                <div id="single_time" style="width: 100%;height:350px;"></div>
                <div id="single_count"  style="width: 100%;height:400px;"></div>
                <el-table
                :data="singleData"
                style="width: 100%"
                stripe>
                    <el-table-column
                        prop="ctime"
                        align="center"
                        label="时间"
                        width="180">
                        <template slot="header" slot-scope="scope">
                            时间
                            <table-sort @ascending="onAscOrDesc('ctime',0)"
                                        @descending="onAscOrDesc('ctime',1)"
                                        @reset="onReset('ctime')"></table-sort>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="lift_id"
                        align="center"
                        label="id"
                        width="180">
                        <template slot="header" slot-scope="scope">
                            id
                            <table-sort @ascending="onAscOrDesc('id',0)"
                                        @descending="onAscOrDesc('id',1)"
                                        @reset="onReset('id')"></table-sort>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="lift_name"
                        align="center"
                        label="电梯名称">
                        <template slot="header" slot-scope="scope">
                            电梯名称
                            <table-sort @ascending="onAscOrDesc('lift_name',0)"
                                        @descending="onAscOrDesc('lift_name',1)"
                                        @reset="onReset('lift_name')"></table-sort>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="online"
                        align="center"
                        label="上线/下线">
                        <div slot-scope="scope" style="width: 100%;">
                            <span v-if="scope.row.online">上线</span>
                            <span v-else>下线</span>
                        </div>
                        <template slot="header" slot-scope="scope">
                            上线/下线
                            <table-sort @ascending="onAscOrDesc('online',0)"
                                        @descending="onAscOrDesc('online',1)"
                                        @reset="onReset('online')"></table-sort>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="time"
                        align="center"
                        label="持续时间"
                        :formatter="formatSeconds">
                        <template slot="header" slot-scope="scope">
                            持续时间
                            <table-sort @ascending="onAscOrDesc('time',0)"
                                        @descending="onAscOrDesc('time',1)"
                                        @reset="onReset('time')"></table-sort>
                        </template>
                    </el-table-column>
                </el-table>
                <paginate :api="paginate_api" :params="params" @val-change="onsingleValChange" :refresh="refresh"></paginate>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import Paginate from "@/components/Paginate";
import TableSort from '@/components/TableSort.vue';
export default{
    components: {
        Paginate,
        TableSort
    },
    data () {
        return {
            status:'',
            loading:false,
            updateTime:new Date().toLocaleDateString()+`  ${new Date().toLocaleTimeString('chinese', { hour12: false })}`,
            activeName:'all',
            date:'',
            addUp:0,
            singleAddup:'',
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
                    text:'离线时长统计表(小时)',
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
                        rotate:-45,
                        interval:0,
                        fontSize:10,
                        color:'#666',
                    },
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
            single_time:{
                color: ['#3aa1ff'],
                title:{
                    text:'离线时长统计表(小时)',
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
                    data:  [],
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
                    data: []
                }]
            },
            single_count:{
                color: ['#3aa1ff'],
                title:{
                    text:'离线次数统计表',
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
            searchSingle:'',
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
            currentoff:0,
            singleCount:0,
            ChooseLift:'',
            liftTarget:'',
            offlineList: [],
            singleList: [],
            paginate_api: '/LogOnline/listPage',
            paginate_params: {
                "page": 1,
                "sort": {ctime:1}
            },
            refresh: false,
            params: {
                sort: {ctime:1},
                lift_id: '',
            },
            allData:[],
            singleData:[],
        }
    },
    watch: {
      activeName(newVal){
          if(newVal==='single'){
            this.$nextTick(()=>{
                this.initChart(this.searchSingle,['single_count','single_time'],this.liftTarget)
                this.params.lift_id=this.liftTarget
                this.refresh=!this.refresh
            })
          }
      }  
    },
    mounted () {
        this.$echarts.init(document.getElementById('allof_count')).setOption(this.allof_count)
        this.$echarts.init(document.getElementById('allof_time')).setOption(this.allof_time)
        this.initData()
        this.searchDate=this.initTime()
        this.searchSingle=this.initTime()
        // window.onresize=()=>{
        //     console.log(123)
        //     this.$echarts.init(document.getElementById('allof_count')).setOption(this.allof_count)
        // }
    },
    methods:{
        initTime(){
            let start = new Date()
            let end = new Date()
            start.setTime(start.getTime()-3600*1000*24*15)
            return [`${start.getFullYear()}`+'-'+`${start.getMonth()+1}`+'-'+`${start.getDate()}`,`${end.getFullYear()}`+'-'+`${end.getMonth()+1}`+'-'+`${end.getDate()}`]
        },
        initData(){
            this.initOfflineList()
            this.$echarts.init(document.getElementById('allof_count')).on('click',(param)=>{
                this.initOfflineList(param.name)
            })
            this.$api_v3.post('/Lifts/listPage',{list_rows:999999}).then((res)=>{
                if(res.code===0){
                    this.singleList=res.data.data
                   this.liftTarget=this.singleList[0].id
                   this.ChooseLift=this.singleList[0].name
                }
            })
        },
        initOfflineList(date){
            this.$api_v3.post('/LogOnline/currentOfflineStatistic',{date:date}).then((res)=>{
                if(res.code===0){
                    // this.offlineList=res.data.slice(0,7)
                    this.offlineList=res.data
                    if(!date){
                        this.currentoff=res.data.length
                        this.initChart(this.searchDate,['allof_count','allof_time'])
                    } 
                }
            })
        },
        initChart(date,dom,id){
            this.$api_v3.post('LogOnline/offlineStatistic',{start_date:date[0],end_date:date[1],lift_id:id}).then((res)=>{
                if(res.code===0){
                    let xArr=[]
                    let yArr=[]
                    res.data.forEach((i)=>{
                        xArr.push(i.date)
                        yArr.push(i.number)
                    })
                    if(id){
                        this.single_count.xAxis[0].data=xArr
                        this.single_count.series[0].data=yArr
                        this.singleCount=this.sum(yArr)
                        this.$echarts.init(document.getElementById(dom[0])).setOption(this.single_count)
                    }else{
                        this.$echarts.init(document.getElementById(dom[0])).setOption({xAxis:{data:xArr},series:[{data:yArr}]})
                    }
                }
            })
            this.$api_v3.post('LogOnline/offlineTimeStatistic',{start_date:date[0],end_date:date[1],lift_id:id}).then((res)=>{
                if(res.code===0){
                    console.log(res)
                    let xArr=[]
                    let yArr=[]
                    res.data.forEach((i)=>{
                        xArr.push(i.date)
                        yArr.push(i.number)
                    })
                    function toDecimal(x) {
                        var val = Number(x)
                        if(!isNaN(parseFloat(val))) {
                            val = val.toFixed(1);
                        }
                        return val;
                    }
                     if(id){
                        this.single_time.xAxis[0].data=xArr
                        this.single_time.series[0].data=yArr
                        this.$echarts.init(document.getElementById(dom[1])).setOption(this.single_time)
                        this.singleAddup=toDecimal(this.sum(yArr))+'小时'
                    }else{
                        this.$echarts.init(document.getElementById(dom[1])).setOption({xAxis:{data:xArr},series:[{data:yArr}]})
                        this.addUp=toDecimal(this.sum(yArr))+'小时'
                    }
                }
            })
        },
        handleSearch(val){
            if(val===0){
                this.initChart(this.searchDate,['allof_count','allof_time'])
                let date=new Date()
                let today=`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
                this.initOfflineList(today)
            }else{
                this.initChart(this.searchSingle,['single_count','single_time'],this.liftTarget)
                this.params.lift_id=this.liftTarget
                this.refresh=!this.refresh
            }
        },
        handleReset(val){
            if(val===0){
                this.searchDate=this.initTime()
            }else{
                this.searchSingle=this.initTime()
                this.liftTarget=this.singleList[0].id
                this.ChooseLift=this.singleList[0].name
            }
        },
        handleRefresh(val){
            this.updateTime=new Date().toLocaleDateString()+`  ${new Date().toLocaleTimeString('chinese', { hour12: false })}`
            if(val===0){
                this.initData()
            }else{
                this.initChart(this.searchSingle,['single_count','single_time'],this.liftTarget)
            }
            this.loading=true
            setTimeout(() => {
                this.loading=false
            }, 1000);
        },
        sum(arr) {
            return eval(arr.join("+"));
        },
        onValChange(data) {
            this.allData = data;
        },
        onsingleValChange(data) {
            this.singleData = data;
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
        onAscOrDesc(str, num) {
            this.paginate_params.sort[str] = num;
            this.refresh = !this.refresh;
        },
        onReset(str) {
            delete this.paginate_params.sort[str];
            this.refresh = !this.refresh;
        },
        handleSelect(item) {
            this.liftTarget=item
            this.params.lift_id=item
        },

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
        padding-bottom: 10px;
    }
}
</style>