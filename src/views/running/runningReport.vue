<template>
    <el-card>
        <div slot="header" class="box-card-header">
            <span class="name">第四人民医院1号梯</span>
            <span style="color:#4bd863;"> ● </span>
            <span>在线</span>
        </div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="基本信息" name="Basic" class="base">
                <div style="margin-bottom: 10px;">电梯基本信息</div>
                <ul style="border-right:1px solid rgba(0,0,0,.1);border-top:1px solid rgba(0,0,0,.1);">
                    <li>
                        <p class="left">使用登记证编号</p>
                        <span class="right">梯粤EA9946</span>
                    </li>
                    <li>
                        <p class="left">地址</p>
                        <span class="right">广东省佛山市禅城区金澜南路106号</span>
                    </li>
                    <li>
                        <p class="left">额定载重（kg）</p>
                        <span class="right">1600</span>
                    </li>
                    <li>
                        <p class="left">额定速度（m/s）</p>
                        <span class="right">1.75</span>
                    </li>
                    <li>
                        <p class="left">设备类型</p>
                        <span class="right">病床/乘客电梯</span>
                    </li>
                    
                    <li>
                        <p class="left">生产厂家</p>
                        <span class="right">西子奥的斯</span>
                    </li>
                    <li>
                        <p class="left">设备型号</p>
                        <span class="right">OH-B</span>
                    </li>
                    <li>
                        <p class="left">出厂编号</p>
                        <span class="right">2012100614</span>
                    </li>
                    <li>
                        <p class="left">出厂时间</p>
                        <span class="right">2012-09-29</span>
                    </li>
                    <li>
                        <p class="left">层站门</p>
                        <span class="right">4层4站4门</span>
                    </li>
                    <li>
                        <p class="left">梯龄（年）</p>
                        <span class="right">9</span>
                    </li>
                    <li>
                        <p class="left">运行总公里数</p>
                        <span class="right">146432</span>
                    </li>
                </ul>
            </el-tab-pane>
            <el-tab-pane label="故障统计" name="Fault" class="fault">
                <div style="margin: 0 0 0px 20px;">故障统计</div>
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
                    <el-button type="primary" size="medium">查询</el-button>
                    <el-button type="primary" size="medium">重置</el-button>
                    <el-button type="primary" size="medium" style="margin-right:10px">刷新</el-button>
                    <span class="update">更新时间:  {{updateTime}}</span>
                </div>
                <div class="countBox">
                    <div>
                        <p class="title">累计故障次数</p>
                        <p class="count">53</p>
                    </div>
                    <div>
                        <p class="title">累计误报次数</p>
                        <p class="count">38</p>
                    </div>
                    <div>
                        <p class="title">累计困人次数</p>
                        <p class="count">1</p>
                    </div>
                </div>
                <div id="fault_times" style="width: 100%;height:350px;margin-top:20px;"></div>
                <div id="fault_type" style="width: 100%;height:350px;margin-top:20px;"></div>
            </el-tab-pane>
            <el-tab-pane label="维保年审" name="maintenance">维保年审</el-tab-pane>
        </el-tabs>
    </el-card>
</template>
<script>
export default{
    data () {
        return {
            activeName:'Basic',
            faultSearch:'',
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
            updateTime:new Date().toLocaleDateString()+`  ${new Date().toLocaleTimeString('chinese', { hour12: false })}`,
            fault_times:{
                title: {
                    text: '报警和实际故障次数',
                    left:'center',
                    textStyle:{
                        fontWeight: 'normal',
                        fontSize:14
                    }
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
                    data: [1,5,9,7,1,5,8,64,8,49,4,46,1,84,941,21,]
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
                    data: [1,5,9,7,1,5,8,64,8,49,4,46,1,84,941,21],
                    type: 'line',
                    color: ['#2fc25b']
                },{
                    name:'总台数',
                    symbol:'circle',
                    data: [45,4,91,6,16,8,12,35,48,1,1,,85,894,65],
                    type: 'line',
                    color: ['#1890ff']
                }]
            },
            fault_type:{
                color:['#3aa1ff','#4ecb73','#36cbcb','#fbd437'],
                title : {
                    text: '报警类型（不含误报）',
                    x:'center',
                    textStyle:{
                        fontWeight: 'normal',
                        fontSize:14
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    bottom: '0',
                    itemWidth: 10,
                    itemHeight: 10,
                    data: [{icon:'circle',name:'超时不开门'},{icon:'circle',name:'紧急按钮被按下'},{icon:'circle',name:'超时不关门'},{icon:'circle',name:'振动超标'}]
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        data:[
                            {value:335, name:'超时不开门'},
                            {value:310, name:'紧急按钮被按下'},
                            {value:234, name:'超时不关门'},
                            {value:135, name:'振动超标'},
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }
        }
    },
    watch: {
      activeName(newVal){
          if(newVal==='Fault'){
            this.$nextTick(()=>{
                this.$echarts.init(document.getElementById('fault_times')).setOption(this.fault_times)
                this.$echarts.init(document.getElementById('fault_type')).setOption(this.fault_type)
            })
          }
      }    
    },
    mounted () {
    },
    methods: {
      ss(s){
          console.log(s)
      }
    }
}
</script>
<style lang="less" scoped>
.el-card{
    font-size: 14px;
    .name{
        display: inline-block;
        margin-right: 100px;
    }
    .base{
        padding-left:20px;
        ul{
            display: flex;
            flex-wrap: wrap;
            li{
                list-style: none;
                display: flex;
                width: 50%;
                .left{
                    text-align: center;
                    width: 150px;
                    padding: 8px;
                    border-bottom:1px solid rgba(0,0,0,.1);
                    border-right:1px solid rgba(0,0,0,.1);
                    border-left:1px solid rgba(0,0,0,.1);
                    background-color: rgba(163, 163, 163, 0.1);
                }
                .right{
                    flex: 1;
                    padding: 8px;
                    border-bottom:1px solid rgba(0,0,0,.1);
                }
            }
        }
    }
    .fault{
        .header_l{
            padding: 20px;
            border-bottom: 1px solid rgba(0,0,0,.1);
        }
        .countBox{
            display: flex;
            color: #acacac;
            background-color:#fff;
            padding-left: 20px;
            border-bottom: 1px solid rgba(0,0,0,.1);
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
    }
}
</style>