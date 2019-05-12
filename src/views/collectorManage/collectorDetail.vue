<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="box-card-header">
                <span class="name">{{ device.name}}</span>
                <el-button type="primary" icon="el-icon-check" style="float: right" @click="save()">
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
                                    <el-input v-model="device.ip"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{device.ip}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">绑定电梯</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="device.ip"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{device.ip}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">曾绑定电梯</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="device.ip"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{device.ip}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">安装时间</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="device.ip"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{device.ip}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">安装人员</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="device.ip"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{device.ip}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">ip</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="device.ip"></el-input>
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
                                    <el-input v-model="device.ip"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{device.ip}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">树莓派编号</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="device.ip"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{device.ip}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">生产日期</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="device.ip"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{device.ip}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">批次</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="device.ip"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{device.ip}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">生产单位</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="device.ip"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{device.ip}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-window-restore"></i></div>
                                <div class="center">绑定电梯</div>
                                <div class="right" v-if="edit">
                                    <el-button type="primary" @click="showDialog">绑定电梯</el-button>
                                </div>
                                <div class="right" v-else="edit">{{device.lift_id}}</div>
                            </li>
                        </ul>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog title="" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
            <el-transfer style="display: flex;align-items: center;justify-content: center" filterable
                         :titles="['待选', '已选']"
                         :data="transfer.data"
                         v-model="data_select">
            </el-transfer>
            <span slot="footer" class="dialog-footer">
                <el-pagination style="float: left"
                               :page-size.sync="transfer.pageSize"
                               :current-page.sync="transfer.currentPage"
                               @current-change="changePage"
                               small
                               layout="prev, pager, next"
                               :total="transfer.total"
                               background>
                </el-pagination>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialog_confirm">确 定</el-button>
            </span>
        </el-dialog>
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
                device: {},
                deviceChangeCount: 0,
                hasSave: true,
                //transfer-------------
                dialogVisible: false,
                data_select: [],
                transfer: {
                    "pageSize": 10,
                    "total": null,
                    "currentPage": 1,
                    "data": [],
                },
                list_url: '',
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
            showDialog() {
                this.dialogVisible = true;
                this.data_select = [];
                this.changePage();
            },
            handleClose(done) {
                done()
            },
            dialog_confirm() {
                this.dialogVisible = false;
                if (this.data_select.length === 0) return false;
                this.deviceBindLift();
            },
            changePage() {
                let params = {};
                let url = this.list_url;
                // this.$req.post(url, params).then((result) => {
                //     console.log(result);
                //     this.transfer.total = result.total_elements;
                //     this.transfer.data = [];
                //     result.content.forEach((item) => {
                //         this.transfer.data.push({"key": item.id, "label": item.name})
                //     })
                // })
            },
            addDevice() {
                let params = this.device;
                this.$req.post('/dm/device/add', params).then((result) => {
                    this.hasSave = true;
                    this.$router.go(-1);
                    this.$message({
                        "type": "success",
                        "message": '新增成功'
                    })
                })
            },
            updateDevice(){
                    this.$req.post('/dm/device/update',this.device).then((result)=>{
                        this.hasSave = true;
                        this.$router.go(-1);
                        this.$message({
                            "type":'success',
                            "message":'更新成功'
                        })
                    })
            },
            deviceBindLift() {
                if (!this.this.device.name) return false;
                let params = {
                    "device_name": this.device.name,
                    "lift_id": this.device.lift_id
                };
                this.$req.post('/dm/device/bind_lift', params).then((result) => {
                    this.device.binding_time = new Date();
                    this.$message({
                        "type": 'success',
                        "message": '绑定成功'
                    })
                })
            },
            gteDeviceById() {
                this.$req.post('/dm/device/fetch', this.$route.query.id).then((result) => {
                    console.log(result);
                    this.device = result;
                })
            },
            toggleEdit() {
                this.edit = !this.edit;
            },
            save() {
                if (this.addNew === true) {
                    this.addDevice()
                } else {
                    this.updateDevice()
                }
            },
        },
        beforeRouteLeave(to, from, next) {
            if (this.hasSave === false) {
                next(false);
                this.$confirm('内容未保存, 是否继续退出?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    next();
                }).catch(() => {
                });
            } else {
                next()
            }
        },
        mounted() {
            if (this.$route.query.id !== null) {
                this.gteDeviceById();
            } else {
                this.edit = true;
                this.addNew = true;
            }
        }
    }
</script>
<style lang="less">
</style>
