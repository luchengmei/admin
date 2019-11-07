<template>
    <div class="analy">
        <el-tabs v-model="activeName" type="card" style="backgroundColor:inherit;">
            <el-tab-pane label="总体情况" name="all" style="backgroundColor:inherit;">
                <div class="header_l">
                    <el-date-picker
                        v-model="date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        style="margin-right: 10px">
                    </el-date-picker>
                    <el-button type="primary" size="medium">查询</el-button>
                    <el-button type="primary" size="medium">重置</el-button>
                    <el-button type="primary" size="medium">刷新</el-button>
                    <span class="update">更新时间:</span>
                </div>
                <div class="countBox">
                    <div>
                        <p class="title">当前离线台数</p>
                        <p class="count">12</p>
                    </div>
                    <div>
                        <p class="title">累计离线台数</p>
                        <p class="count">12</p>
                    </div>
                    <div>
                        <p class="title">累计离线时长</p>
                        <p class="count">10h</p>
                    </div>
                </div>
                <div class="offline" style="backgroundColor:#fff;">
                    <span>离线台数统计表</span>
                    <div class="content">
                        <div id="allof_count" style="width: 70%;height:350px;"></div>
                        <el-table
                        :data="tableData"
                        stripe>
                            <el-table-column
                                prop="date"
                                align="center"
                                label="id"
                                width="50">
                            </el-table-column>
                            <el-table-column
                                prop="name"
                                label="电梯名称"
                                align="center"
                                width="100">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                align="center"
                                label="离线时间"
                                width="250">
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
                    </el-table-column>
                    <el-table-column
                        prop="time"
                        align="center"
                        label="持续时间">
                    </el-table-column>
                </el-table>
                <paginate :api="paginate_api" :params="paginate_params" @val-change="onValChange"
                    :refresh="refresh"></paginate>
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
                :data="tableData"
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
                <paginate :api="paginate_api" :params="paginate_params" @val-change="onValChange"
                    :refresh="refresh"></paginate>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import Paginate from "../../components/Paginate";
export default{
    components:{
        Paginate
    },
    data () {
        return {
            activeName:'all',
            date:'',
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
                    data: ['10/1', '10/2', '10/3','10/4','10/5','10/6','10/7','10/8','10/9','10/10','10/11','10/12','10/13','10/14','10/15','10/16','10/17','10/18','10/19','10/20','10/21','10/22','10/23','10/24','10/25','10/26','10/27','10/28','10/29','10/30','10/31']
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
                    data: [820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    color: ['#2fc25b']
                },{
                    name:'总台数',
                    symbol:'circle',
                    data: [45, 66, 44, 88, 1290, 1800, 600,45, 66, 44, 88, 1290, 1800, 600,45, 66, 44, 88, 1290, 1800, 600,45, 66, 44, 88, 1290, 1800, 600],
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
                    data: ['1日', '2日', '3日','4日','5日','6日','7日','8日','9日','10日','11日','12日','13日','14日','15日','16日','17日','18日','19日','20日','21日','22日','23日','24日','25日','26日','27日','28日','29日','30日','31日'],
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
                    data:[820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901]
                }]
            },
            allData:[],
            tableData: [{
                date: '123',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '123',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '123',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '123',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }, {
                date: '123',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '123',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '123',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }],
            paginate_api: '/LogOnline/listPage',
            paginate_params: {
                "page": 1,
                "size": 10,
                "sort": {name:1,status:1,sort:1},
            },
            refresh: false,
            params: {
                name: '',
            },
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
        let allof_count=this.$echarts.init(document.getElementById('allof_count'))
        let allof_time=this.$echarts.init(document.getElementById('allof_time'))
        allof_count.setOption(this.allof_count)
        allof_time.setOption(this.allof_time)
        this.initdata()
    },
    methods:{
        initdata(){
            this.$api_v3.post('/LogOnline/listPage',{list_rows:10,sort:{name:1,status:1,sort:1}}).then((res)=>{
                console.log(res);
                if(res.code===0){
                    this.allData=res.data.data
                }
            })
        },
        onValChange(data) {
            this.allData = data;
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