<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="box-card-header">
                <span class="name">{{ device.name}}</span>
                <el-button type="primary" icon="el-icon-check" style="float: right" @click="addOrUpdateDevice()">
                    {{this.addNew?'新增':'提交'}}
                </el-button>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="index">
                    <div class="panel-heading">
                        <!--<span class="title"><span class="name">{{device.name}}</span></span>-->
                        <i :class="edit===true?'fa fa-floppy-o':'el-icon-edit-outline'"
                           @click="toggleEdit"
                           style="font-size: 28px; position: absolute; right: 31px; top: 0; cursor: pointer;"></i>
                    </div>
                    <div class="panel-body">
                        <ul>
                            <li>
                                <div class="left"><i class="fa fa-id-card"></i></div>
                                <div class="center">采集仪名称</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="device.name"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{device.name}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">采集仪编号</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="device.id"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{device.id}}</div>
                            </li>
                            <!--<li>-->
                                <!--<div class="left"><i class="el-icon-info"></i></div>-->
                                <!--<div class="center">绑定电梯</div>-->
                                <!--<div class="right" v-if="edit" style="display: flex">-->
                                    <!--<div style="margin-right: 30px">-->
                                        <!--<el-popover-->
                                                <!--@show="changePage"-->
                                                <!--placement="bottom"-->
                                                <!--width="600"-->
                                                <!--trigger="click">-->
                                            <!--<el-card class="box-card" shadow="never">-->
                                                <!--<div slot="header" style="display: flex;align-items: center">-->
                                                    <!--<el-input placeholder="请输入名称" v-model="popoverInputVal"-->
                                                              <!--@clear="search" clearable-->
                                                              <!--@keyup.native.enter="search">-->
                                                        <!--<el-button slot="append" icon="el-icon-search"-->
                                                                   <!--@click="search"></el-button>-->
                                                    <!--</el-input>-->
                                                    <!--<el-pagination-->
                                                            <!--:page-size.sync="popover.pageSize"-->
                                                            <!--:current-page.sync="popover.currentPage"-->
                                                            <!--@current-change="changePage"-->
                                                            <!--normal-->
                                                            <!--layout="prev, pager, next"-->
                                                            <!--:total="popover.total">-->
                                                    <!--</el-pagination>-->
                                                <!--</div>-->
                                                <!--<div v-for="(item, index) in popover.data" :key="index"-->
                                                     <!--@click="setCompanyName(item)"-->
                                                     <!--style="margin-bottom: 10px;font-size: 14px;color: #3C8DBC;cursor: pointer;">-->
                                                    <!--{{item.name}}-->
                                                <!--</div>-->
                                            <!--</el-card>-->
                                            <!--<el-button slot="reference" type="primary">点击选择</el-button>-->
                                        <!--</el-popover>-->
                                    <!--</div>-->
                                    <!--<el-input style="flex: 1" v-model="lift_name"-->
                                              <!--disabled></el-input>-->
                                <!--</div>-->
                                <!--<div class="right" v-else="edit">{{lift_name}}</div>-->
                            <!--</li>-->
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">绑定时间</div>
                                <div class="right" v-if="edit">
                                    <el-date-picker type="datetime" v-model="device.binding_time"  value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
                                </div>
                                <div class="right" v-else="edit">{{device.binding_time}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">ip</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="device.ip" disabled></el-input>
                                </div>
                                <div class="right" v-else="edit">{{device.ip}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">mac</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="device.mac"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{device.mac}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">频段</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="device.frequency"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{device.frequency}}</div>
                            </li>
                        </ul>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                typeOptions: [
                    {
                        label: '物业',
                        value: 1,
                    },
                    {
                        label: '维保单位',
                        value: 2
                    }],
                edit: false,
                addNew: false,
                activeName: 'index',
                device: {
                },
                lift_name:'',
                deviceChangeCount: 0,
                hasSave: true,
                popoverInputVal: '',
                popover: {
                    "pageSize": 10,
                    "total": 0,
                    "currentPage": 1,
                    "data": []
                },
            }
        },
        filters: {},
        watch: {
            'device': {
                handler: function () {
                    this.deviceChangeCount += 1;
                    if (this.deviceChangeCount > 1) {
                        this.hasSave = false;
                    }
                },
                deep: true
            }
        },
        methods: {
            changePage(){
                let params = {
                    "page": this.popover.currentPage,
                    "list_rows": this.popover.pageSize,
                    "search_content": this.popoverInputVal,
                    "sort": [{"id": 1}]
                };
                this.$api_v3.post('/Lifts/listPage', params).then((result) => {
                    console.log(result);
                    if (result.code === 0) {
                        this.popover.total = result.data.total;
                        this.popover.data = result.data.data;
                    }
                })
            },
            search(){
                this.popover.currentPage = 1;
                this.changePage()
            },
            setCompanyName(item) {
                this.lift_name = item.name;
                this.device.lift_id = item.id;
                this.device.lift = {};
                this.device.lift.name = item.name;
                this.device.lift.id = item.id;
            },
            gteDeviceById(id) {
                this.$api_v3.post('/Devices/read',{"id":id}).then((res)=>{
                    console.log(res);
                    if(res.code===0){
                        this.device = res.data;
                        if(res.data.lift){
                            this.lift_name  = res.data.lift.name;
                        }
                    }
                })
            },
            addOrUpdateDevice(){
                let params = this.device;
                this.$api_v3.post('Devices/save',params).then((res)=>{
                    console.log(res);
                    if(res.code===0){
                        this.$message.success('操作成功')
                    }else {
                        this.$message.error(res.data)
                    }
                })
            },
            toggleEdit() {
                this.edit = !this.edit;
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
        //     } else {
        //         next()
        //     }
        // },
        mounted() {
            if (this.$route.query.id !== null) {
                this.gteDeviceById(this.$route.query.id);
            } else {
                this.edit = true;
                this.addNew = true;
            }
        }
    }
</script>
<style lang="less">
</style>
