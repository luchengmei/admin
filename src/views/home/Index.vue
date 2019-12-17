<template>
    <el-card class="index">
        <el-row :gutter="30" class="online_data">
            <el-col :span="6">
                <el-card shadow="never" style="padding-left:15px;">
                    <div class="count">{{user_online}}</div>
                    <div class="title"><span style="color:#58a3f7;">●</span> 在线用户数</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="never" style="padding-left:15px;">
                    <div class="count">{{device.device_online + '/'+device.device_all}}</div>
                    <div class="title"><span style="color:#fec03d;">●</span> 在线设备数</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="never" style="padding-left:15px;">
                    <div class="count">{{fault}}</div>
                    <div class="title"><span style="color:#52c1f5;">●</span> 未处理报警数量</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="never" style="padding-left:15px;">
                    <div class="count">{{expired}}</div>
                    <div class="title"><span style="color:#4bced0;">●</span> 年审过期（台）</div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="30" class="Qnew">
            <el-col :span="12">
                <el-card shadow="never">
                    <div class="title">快速新建</div>
                    <div class="content">
                        <div class="grid-content" @click="toAddCompany()">
                            <i class="iconfont icon-commpany"></i>
                            <div style="margin-top:10px;">
                                新建单位
                            </div>
                        </div>
                        <div class="grid-content" @click="toAddUser()">
                            <i class="iconfont icon-user-plus"></i>
                            <div style="margin-top:10px;">
                                新建用户
                            </div>
                        </div>
                        <div class="grid-content" @click="toAddLift()">
                            <i class="iconfont icon-elevator"></i>
                            <div style="margin-top:10px;">
                                新建电梯
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="never">
                    <div class="title">服务数据</div>
                    <div class="server_data">
                        <el-card shadow="never">
                            <div class="count">2.3/1.8M</div>
                            <div class="name"><span style="color:#81d3f8;">●</span> 网络（出网/入网）</div>
                        </el-card>
                        <el-card shadow="never">
                            <div class="count">{{server_info.cpuUsageRate*100}}%</div>
                            <div class="name"><span style="color:#80ffff;">●</span> CPU使用率（%）</div>
                        </el-card>
                        <el-card shadow="never">
                            <div class="count">{{server_info.freeMemory +'/'+server_info.totalMemory}}</div>
                            <div class="name"><span style="color:#70b603;">●</span> 内存（GiB）</div>
                        </el-card>
                        <el-card shadow="never">
                            <div class="count">234/400</div>
                            <div class="name"><span style="color:#caf982;">●</span> 磁盘（GB）</div>
                        </el-card>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <div class="ranking" v-loading="rankLoading">
            <div class="head">
                <div class="title">流量排行</div>
                <el-date-picker
                        @change="getRank"
                        clearable
                        v-model="searchDate"
                        type="daterange"
                        align="right"
                        unlink-panels
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions">
                </el-date-picker>
            </div>
            <ul class="lift_list">
                <li v-for="(item,index) in rankList" :key="index">
                    <div class="lift_detail">
                        <div class="index">{{index+1}}</div>
                        <span class="lift_name">{{item.name}}</span>
                    </div>
                    <span class="quantity">{{(item.size/1024/1024).toFixed(2)}}MB</span>
                </li>
            </ul>
        </div>
    </el-card>
</template>
<script>
    export default {
        data() {
            return {
                searchDate: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 30), new Date()],
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
                user_online: 0,
                device: {
                    device_all: '',
                    device_online: ''
                },
                expired: 0,
                fault:'',
                server_info: {
                    totalMemory: '',
                    freeMemory: '',
                    cpuUsageRate: ''
                },
                rankList: [],
                rankLoading: false,
            }
        },
        sockets: {
            server_information(data) {
                console.log(data);
                this.server_info = data.server_information;
            },
            user_status(data) {
                console.log(data);
                this.user_online = data.user_online;
            },
            device_status(data) {
                console.log(data);
                this.device = data;
            },
        },
        mounted() {
            this.emitSocketEvent(true);
            this.getExpired();
            this.getFault();
            this.getRank();
        },
        beforeDestroy() {
            this.emitSocketEvent(false);
        },
        methods: {
            getRank() {
                this.rankLoading = true;
                let param = {};
                if (this.searchDate) {
                    param.start_date = this.searchDate[0];
                    param.end_date = this.searchDate[1];
                }
                this.$api_v3.post('/LogSocketData/rank', param).then((res) => {
                    console.log('/LogSocketData/rank', res);
                    if (res.code === 0) {
                        this.rankList = res.data;
                    }
                }).finally(() => {
                    this.rankLoading = false;
                })
            },
            emitSocketEvent(bool) {
                let events = ['server_information', 'user_status', 'device_status'];
                events.forEach((event) => {
                    this.$socket.emit(event, {enable: bool}, function (data) {
                        console.log(data);
                    });
                });
            },
            getExpired() {
                this.$api_v3.post('/LiftsPlan/checkPlans', {type: 5}).then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        if(res.data.expired){
                            this.expired = res.data.expired.length;
                        }
                    }
                })
            },
            getFault() {
                this.$api_v3.post('/LiftsFault/getFaultCount', {
                    status: 0,
                    start_date: this.$moment().format("YYYY-MM-DD"),
                    end_date: this.$moment().format("YYYY-MM-DD"),
                }).then((res)=>{
                    console.log('/LiftsFault/getFaultCount',res);
                    if(res.code===0){
                        this.fault = res.data[0].count
                    }
                })
            },
            toAddCompany(id = null) {
                this.$router.push({path: '/user_company_detail', query: {id: id}})
            },
            toAddUser(id = null) {
                this.$router.push({path: '/user_detail', query: {id: id}})
            },
            toAddLift(id = null) {
                this.$router.push({path: '/lift_detail', query: {lift_id: id}})
            },
        }
    }
</script>
<style lang="less" scoped>
    .index {
        padding: 15px;
        .online_data {
            .count {
                font-size: 25px;
            }
            .title {
                color: rgba(0, 0, 0, .5);
                font-size: 14px;
            }
        }
        .el-row {
            margin-bottom: 20px;
        }
        .el-card {
            border-radius: unset;
        }
        .Qnew {
            font-size: 14px;
            /deep/ .el-card__body {
                padding: 0;
            }
            .title {
                padding: 15px;
                border-bottom: 1px solid rgba(0, 0, 0, .1);
                background-color: #f9f9f9;
            }
            .content {
                background-color: #fff;
                display: flex;
                padding: 10px 15px;
                height: 135px;
                .iconfont {
                    font-size: 50px;
                    color: rgba(102, 102, 102, 0.767);
                }
                .grid-content {
                    padding: 15px 25px;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    align-items: center;
                    &:hover {
                        cursor: pointer;
                        box-shadow: 0px 0px 1px #666;
                        background-color: #f9f9f9;
                    }
                }
            }
            .server_data {
                height: 135px;
                padding: 15px 20px;
                display: flex;
                align-items: center;
                .count {
                    font-size: 20px;
                }
                .el-card {
                    width: 25%;
                    border: unset;
                }
                .name {
                    color: #888;
                }
            }
        }
        .ranking {
            border: 1px solid rgba(0, 0, 0, .1);
            .head {
                font-size: 14px;
                padding: 10px 20px;
                background-color: #f9f9f9;
                border-bottom: 1px solid rgba(0, 0, 0, .1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .lift_list {
                padding: 20px 10px;
                display: flex;
                list-style: none;
                flex-wrap: wrap;
                font-size: 14px;
                li {
                    width: 49%;
                    margin: 0 0.5%;
                    padding: 10px 0px;
                    border-bottom: 1px solid #f2f2f2;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .quantity {
                        color: rgba(0, 0, 0, 0.5);
                    }
                    .lift_detail {
                        display: flex;
                        align-items: center;
                        .index {
                            padding: 0 15px;
                        }
                    }
                }
            }
        }
    }
</style>
