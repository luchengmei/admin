<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="box-card-header">
                <span class="name">{{ lift.name||$route.meta.title}}</span>
                <el-button v-show="activeName==='index'||activeName==='second'" type="primary" icon="el-icon-check"
                           style="float: right" @click="addOrUpdateLift()">{{addNew?'提交':'保存'}}
                </el-button>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="index">
                    <div class="panel-heading">
                        <i :class="edit===true?'fa fa-floppy-o':'el-icon-edit-outline'"
                           @click="toggleEdit"
                           style="font-size: 28px; position: absolute; right: 31px; top: 0; cursor: pointer;"></i>
                    </div>
                    <div class="panel-body">
                        <ul>
                            <li>
                                <div class="left"><i class="fa fa-id-card"></i></div>
                                <div class="center">电梯名称</div>
                                <el-input class="right" v-if="edit" v-model="lift.name"></el-input>
                                <div class="right" v-else="edit">{{lift.name}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-id-card"></i></div>
                                <div class="center">使用登记证编号</div>
                                <el-input class="right" v-if="edit" v-model="lift.license"></el-input>
                                <div class="right" v-else="edit">{{lift.license}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-building-o"></i></div>
                                <div class="center">物业单位</div>
                                <div class="right" v-if="edit" style="display: flex">
                                    <div style="margin-right: 30px">
                                        <el-popover
                                                @show="changePage"
                                                placement="bottom"
                                                width="600"
                                                trigger="click">
                                            <el-card class="box-card" shadow="never">
                                                <div slot="header" style="display: flex;align-items: center">
                                                    <el-input placeholder="请输入名称" v-model="popoverInputVal"
                                                              @clear="search" clearable
                                                              @keyup.native.enter="search">
                                                        <el-button slot="append" icon="el-icon-search"
                                                                   @click="search"></el-button>
                                                    </el-input>
                                                    <el-pagination
                                                            :page-size.sync="popover.pageSize"
                                                            :current-page.sync="popover.currentPage"
                                                            @current-change="changePage"
                                                            normal
                                                            layout="prev, pager, next"
                                                            :total="popover.total">
                                                    </el-pagination>
                                                </div>
                                                <div v-for="(item, index) in popover.data" :key="index"
                                                     @click="setCompanyName(item)"
                                                     style="margin-bottom: 10px;font-size: 14px;color: #3C8DBC;cursor: pointer;">
                                                    {{item.name}}
                                                </div>
                                            </el-card>
                                            <el-button slot="reference" type="primary">点击选择</el-button>
                                        </el-popover>
                                    </div>
                                    <el-input style="flex: 1" v-model="company_name"
                                              disabled></el-input>
                                </div>
                                <div class="right" v-else>{{company_name}}
                                </div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-building-o"></i></div>
                                <div class="center">维保单位</div>
                                <div class="right" v-if="edit" style="display: flex">
                                    <div style="margin-right: 30px">
                                        <el-popover
                                                @show="changePage"
                                                placement="bottom"
                                                width="600"
                                                trigger="click">
                                            <el-card class="box-card" shadow="never">
                                                <div slot="header" style="display: flex;align-items: center">
                                                    <el-input placeholder="请输入名称" v-model="popoverInputVal"
                                                              @clear="search" clearable
                                                              @keyup.native.enter="search">
                                                        <el-button slot="append" icon="el-icon-search"
                                                                   @click="search"></el-button>
                                                    </el-input>
                                                    <el-pagination
                                                            :page-size.sync="popover.pageSize"
                                                            :current-page.sync="popover.currentPage"
                                                            @current-change="changePage"
                                                            normal
                                                            layout="prev, pager, next"
                                                            :total="popover.total">
                                                    </el-pagination>
                                                </div>
                                                <div v-for="(item, index) in popover.data" :key="index"
                                                     @click="setMaintenanceName(item)"
                                                     style="margin-bottom: 10px;font-size: 14px;color: #3C8DBC;cursor: pointer;">
                                                    {{item.name}}
                                                </div>
                                            </el-card>
                                            <el-button slot="reference" type="primary">点击选择</el-button>
                                        </el-popover>
                                    </div>
                                    <el-input style="flex: 1" v-model="maintenance_name"
                                              disabled></el-input>
                                </div>
                                <div class="right" v-else>{{maintenance_name}}
                                </div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-location"></i></div>
                                <div class="center">地址</div>
                                <div class="right" v-if="edit" style="display: flex;align-items: center">
                                    <!--<link-age @changeCity="onchangeCity" :sheng="lift.province" :shi="lift.city" :qu="lift.street"></link-age>-->
                                    <el-input style="flex: 1" v-model="lift.address"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{lift.address}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-location"></i></div>
                                <div class="center">简易地址</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="lift.address_shot"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{lift.address_shot}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">额定载重(kg)</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="lift.rated_load"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{lift.rated_load}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">额定速度(m/s)</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="lift.rated_speed"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{lift.rated_speed}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">设备类型</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="lift.type"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{lift.type}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-home"></i></div>
                                <div class="center">生产厂家</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="lift.brand"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{lift.brand}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-id-card"></i></div>
                                <div class="center">设备型号</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="lift.model"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{lift.model}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-id-card"></i></div>
                                <div class="center">出厂编号</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="lift.product_number"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{lift.product_number}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-time"></i></div>
                                <div class="center">出厂时间</div>
                                <div class="right" v-if="edit">
                                    <el-date-picker
                                            value-format="yyyy-MM-dd"
                                            v-model="lift.manufacture_date"
                                            type="date"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </div>
                                <div class="right" v-else="edit">{{lift.manufacture_date}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-bars"></i></div>
                                <div class="center">层/站/门</div>
                                <div class="right" v-if="edit" style="display: flex;align-items: center">
                                    <el-input clearable placeholder="层" v-model="lift.floor" @change="changeFloor">
                                        <template slot="append">层</template>
                                    </el-input>
                                    <el-input clearable placeholder="站" v-model="lift.station">
                                        <template slot="append">站</template>
                                    </el-input>
                                    <el-input clearable placeholder="门" v-model="lift.door">
                                        <template slot="append">门</template>
                                    </el-input>
                                </div>
                                <div class="right" v-else="edit">{{lift.floor}} 层 {{lift.station}} 站 {{lift.door}} 门
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <el-collapse v-model="collapseNames">
                            <el-collapse-item title="楼层分布" name="1" style="color: #3C8DBC;">
                                <div class="container-floor">
                                    <el-input v-for="(i,index) in lift.floors" :key="index" v-model="i.alias"
                                              style="width: 20%">
                                        <template slot="prepend">{{i.floor}}</template>
                                    </el-input>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="选择功能" name="second">
                    <div class="cardContainer">
                        <el-card>
                            <div slot="header">
                                <span>机房</span>
                                <el-switch v-model="lift.has_machine_room" :active-value="1"
                                           :inactive-value="0"></el-switch>
                            </div>
                            <div class="body-item">环境温度和温度
                                <el-switch v-model="lift.temperature_humidity_in_machine_room" :active-value="1"
                                           :inactive-value="0"></el-switch>
                            </div>
                            <div class="body-item">环境噪声
                                <el-switch v-model="lift.noise_in_machine_room" :active-value="1"
                                           :inactive-value="0"></el-switch>
                            </div>
                            <div class="body-item">安全回路
                                <el-switch v-model="lift.circuit" :active-value="1" :inactive-value="0"></el-switch>
                            </div>
                            <div class="body-item">电机温度
                                <el-switch v-model="lift.machine_temperature" :active-value="1"
                                           :inactive-value="0"></el-switch>
                            </div>
                            <!--&lt;!&ndash;<div class="body-item">电柜温度&ndash;&gt;-->
                            <!--<el-switch v-model="lift.cabinet_temperature" :active-value="1" :inactive-value="0"></el-switch>-->
                            <!--</div>-->
                            <div class="body-item">电流
                                <el-switch v-model="lift.electricity" :active-value="1" :inactive-value="0"></el-switch>
                            </div>
                            <!--<div class="body-item">电压-->
                            <!--<el-switch v-model="lift.voltage" :active-value="1" :inactive-value="0"></el-switch>-->
                            <!--</div>-->
                            <div class="body-item">抱闸温度
                                <el-switch v-model="lift.brake_temperature" :active-value="1"
                                           :inactive-value="0"></el-switch>
                            </div>
                            <div class="body-item">曳引绳断股
                                <el-switch v-model="lift.hoist_rope" :active-value="1" :inactive-value="0"></el-switch>
                            </div>
                        </el-card>
                        <el-card>
                            <div slot="header">
                                <span>轿厢</span>
                            </div>
                            <div class="body-item">单独麦克风
                                <el-switch v-model="lift.microphone" :active-value="1" :inactive-value="0"></el-switch>
                            </div>
                            <div class="body-item">摄像头
                                <el-switch v-model="lift.camera" :active-value="1" :inactive-value="0"></el-switch>
                            </div>
                            <div class="body-item">红外人体感应
                                <el-switch v-model="lift.motion" :active-value="1" :inactive-value="0"></el-switch>
                            </div>
                            <div class="body-item">紧急按钮
                                <el-switch v-model="lift.emergency_button" :active-value="1"
                                           :inactive-value="0"></el-switch>
                            </div>
                            <div class="body-item">应急电源
                                <el-switch v-model="lift._e_p_s" :active-value="1" :inactive-value="0"></el-switch>
                            </div>
                            <div class="body-item">扬声器
                                <el-switch v-model="lift.loudspeaker" :active-value="1" :inactive-value="0"></el-switch>
                            </div>
                            <div class="body-item">广告屏
                                <el-switch v-model="lift.ad_screen" :active-value="1" :inactive-value="0"></el-switch>
                            </div>
                            <div class="body-item">电话卡ICCID
                                <el-input placeholder="" v-model="lift.device_phone"
                                          style="width: 150px"></el-input>
                            </div>
                        </el-card>
                        <el-card>
                            <div slot="header">
                                <span>底坑</span>
                            </div>
                            <div class="body-item">环境温度和湿度
                                <el-switch v-model="lift.temperature_humidity_in_pit" :active-value="1"
                                           :inactive-value="0"></el-switch>
                            </div>
                            <div class="body-item">环境噪声
                                <el-switch v-model="lift.noise_in_pit" :active-value="1"
                                           :inactive-value="0"></el-switch>
                            </div>
                            <div class="body-item">钢丝绳
                                <el-switch v-model="lift.wire_rope" :active-value="1" :inactive-value="0"></el-switch>
                            </div>
                            <div class="body-item">保护装置
                                <el-switch v-model="lift.protector" :active-value="1" :inactive-value="0"></el-switch>
                            </div>
                            <div class="body-item">底坑积水
                                <el-switch v-model="lift.ponding_in_pit" :active-value="1"
                                           :inactive-value="0"></el-switch>
                            </div>
                        </el-card>
                    </div>
                    <transition name="slide-fade">
                        <div v-if="lift.camera" style="color: #3C8DBC;margin-top: 15px;">
                            <span style="margin-right: 15px">视频存储天数</span>
                            <el-select v-model="lift.video_duration" placeholder="请选择" value="">
                                <el-option
                                        v-for="item in userOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button type="" @click="showMessageBox">其他</el-button>
                        </div>
                    </transition>
                </el-tab-pane>
                <el-tab-pane label="年审计划" name="fifth">
                    <div class="lift-plan" style="padding: 0 5px">
                        <!--<el-timeline>-->
                            <!--<transition-group name="slide-fade">-->
                                <!--<el-timeline-item v-for="(item,index) in liftPlan" :key="index"-->
                                                  <!--:type="item.status|typeFrm"-->
                                                  <!--:timestamp="item.arrival_time|dateFrm"-->
                                                  <!--placement="top">-->
                                    <!--<el-card style="color: #3C8DBC">-->
                                        <!--<i class="el-icon-delete"-->
                                           <!--style="float: right;font-size: 20px;cursor: pointer;margin-left: 10px"-->
                                           <!--@click="deletePlan(item,index)"></i>-->
                                        <!--<i :class="item.edit===true?'fa fa-floppy-o':'el-icon-edit-outline'"-->
                                           <!--style="float: right;font-size: 20px;cursor: pointer;"-->
                                           <!--@click="toggleEditPlan(item)"></i>-->
                                        <!--<h4 v-if="item.edit">年审结果：-->
                                            <!--<el-select v-model="item.status" placeholder="请选择" value="">-->
                                                <!--<el-option-->
                                                        <!--v-for="item in result"-->
                                                        <!--:key="item.value"-->
                                                        <!--:label="item.label"-->
                                                        <!--:value="item.value">-->
                                                <!--</el-option>-->
                                            <!--</el-select>-->
                                        <!--</h4>-->
                                        <!--<h4 v-else>年审结果：{{item.status|statusFrm}}</h4>-->
                                        <!--<div style="display: flex">-->
                                            <!--<p v-if="item.edit">实际年审时间：-->
                                                <!--<el-date-picker-->
                                                        <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                                                        <!--v-model="item.arrival_time"-->
                                                        <!--type="datetime"-->
                                                        <!--placeholder="选择日期">-->
                                                <!--</el-date-picker>-->
                                            <!--</p>-->
                                            <!--<p v-else>实际年审时间：{{item.arrival_time|dateFrm}}</p>-->
                                            <!--<p v-if="item.edit">计划年审时间：-->
                                                <!--<el-date-picker-->
                                                        <!--value-format="yyyy-MM-dd"-->
                                                        <!--v-model="item.date"-->
                                                        <!--type="date"-->
                                                        <!--placeholder="计划年审时间">-->
                                                <!--</el-date-picker>-->
                                            <!--</p>-->
                                            <!--<p v-else>计划年审时间：{{item.date|dateFrm}}</p>-->
                                        <!--</div>-->
                                    <!--</el-card>-->
                                <!--</el-timeline-item>-->
                            <!--</transition-group>-->
                        <!--</el-timeline>-->
                        <!--<div class="plan-add" style="font-size: 14px;color: #3C8DBC">-->
                            <!--<span>-->
                                <!--<el-date-picker-->
                                        <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                                        <!--v-model="plan.arrival_time"-->
                                        <!--type="datetime"-->
                                        <!--placeholder="实际年审时间">-->
                                <!--</el-date-picker>-->
                            <!--</span>-->
                            <!--<span>-->
                                <!--<el-date-picker-->
                                        <!--value-format="yyyy-MM-dd"-->
                                        <!--v-model="plan.date"-->
                                        <!--type="date"-->
                                        <!--placeholder="计划年审时间">-->
                                <!--</el-date-picker>-->
                            <!--</span>-->
                            <!--<span><el-select v-model="plan.status" placeholder="年审结果" value="">-->
                                                <!--<el-option-->
                                                        <!--v-for="item in result"-->
                                                        <!--:key="item.value"-->
                                                        <!--:label="item.label"-->
                                                        <!--:value="item.value">-->
                                                <!--</el-option>-->
                                            <!--</el-select></span>-->
                            <!--<el-button type="primary" icon="el-icon-plus" @click="addLiftPlan">添加年审计划</el-button>-->
                        <!--</div>-->
                    </div>
                </el-tab-pane>
                <el-tab-pane label="备注" name="sixth">
                    <div class="">
                        <el-input
                                @change="updateRemark"
                                type="textarea"
                                :rows="5"
                                placeholder="请输入内容"
                                v-model="lift.remark">
                        </el-input>
                    </div>
                    <el-upload style="margin-top: 15px"
                               action="https://jsonplaceholder.typicode.com/posts/"
                               list-type="picture-card"
                               :on-preview="handlePictureCardPreview"
                               :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
    import linkAge from '@/components/linkage'
    import moment from 'moment'

    export default {
        components: {
            linkAge
        },
        data() {
            return {
                popoverInputVal: '',
                popover: {
                    "pageSize": 10,
                    "total": 0,
                    "currentPage": 1,
                    "data": []
                },
                liftChangeCount: 0,
                collapseNames: [],
                lift: {},
                company_name: '',
                maintenance_name: '',
                floors: [],
                value: '',
                edit: true,
                addNew: false,
                activeName: 'index',
                userOptions: [
                    {
                        value: 7,
                        label: '七天'
                    }, {
                        value: 31,
                        label: '一个月（31天）'
                    }, {
                        value: 63,
                        label: '三个月（63天）'
                    }, {
                        value: 365,
                        label: '一年（365天）'
                    }],
                //about remark
                dialogImageUrl: '',
                dialogVisible: false,
                //about liftPlan
                result: [{
                    value: 1,
                    label: '合格'
                }, {
                    value: 2,
                    label: '不合格'
                }],
                liftPlan: [],
                addPlan: false,
                plan: {
                    "arrival_time": null,
                    "date": null,
                    "lift_id": this.$route.query.lift_id,
                    "type": 5,
                    "status": null,
                    "edit": false
                }
            }
        },
        filters: {
            statusFrm(el) {
                if (el == 1) return '合格';
                if (el == 2) return '不合格';
                return ' '
            },
            typeFrm(el) {
                if (el == 1) return 'success';
                if (el == 2) return 'danger';
                return 'info'
            },
            dateFrm(el) {
                if (el === null) return '';
                return moment(el).format("YYYY-MM-DD")
            }
        },
        watch: {
            'lift': {
                handler: function () {
                    this.liftChangeCount += 1;
                    if (this.liftChangeCount > 2) {
                        this.hasSave = false;
                    }
                },
                deep: true
            }
        },
        computed: {},
        methods: {
            //____________________remark_____________________start
            updateRemark() {
                this.$req.post('/dm/lift/remark/add', {
                    "id": this.lift.id,
                    "remark": this.lift.remark
                }).then((result) => {
                    if (result.Code === 7000) {
                        this.$message({
                            type: 'success',
                            message: '已保存修改'
                        })
                    }
                })
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            //____________________remark_____________________end


            //___________________baseInfo______________________start
            changePage() {
                let params = {
                    "page": this.popover.currentPage,
                    "list_rows": this.popover.pageSize,
                    "name": this.popoverInputVal,
                    "sort": [{"id": 1}]
                };
                this.$api_v3.post('/Group/listPage', params).then((result) => {
                    console.log(result);
                    if (result.code === 0) {
                        this.popover.total = result.data.total;
                        this.popover.data = result.data.data;
                    }
                })
            },
            search() {
                this.popover.currentPage = 1;
                this.changePage();
            },
            setCompanyName(item) {
                this.company_name = item.name;
                this.lift.company_id = item.id
            },
            setMaintenanceName(item) {
                this.maintenance_name = item.name;
                this.lift.maintenance_id = item.id
            },
            showMessageBox() {//输入视频存储天数
                this.$prompt('请输入天数', '视频存储天数', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[1-9]\d*$/,
                    inputErrorMessage: '请输入正整数'
                }).then(({value}) => {
                    this.lift.video_duration = Number(value);
                }).catch(() => {
                });
            },
            findLiftById(id) {
                this.$api_v3.post('/Lifts/read', {'id': id}).then((res) => {
                    console.log('lift', res);
                    if (res.code === 0) {
                        this.lift = res.data;
                        if (res.data.owner_group) {
                            this.company_name = res.data.owner_group.name;
                        }
                        if (res.data.maintenance_group) {
                            this.maintenance_name = res.data.maintenance_group.name
                        }
                    }
                })
            },
            toggleEdit() {
                this.edit = !this.edit;
                if (this.edit === false) {
                }
            },
            changeFloor(val) {
                //console.log(val);
                this.collapseNames = ["1"];
                let difference = val - this.lift.floors.length;
                if (difference > 0) {
                    for (let i = 1; i <= difference; i++) {
                        this.lift.floors.push(
                            {
                                alias: '',
                                floor: this.lift.floors.length + 1
                            }
                        )
                    }
                } else if (difference < 0) {
                    for (let j = 1; j <= -difference; j++) {
                        this.lift.floors.pop();
                    }
                }
            },
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                    //console.log(this.dynamicTags);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            addOrUpdateLift() {
                let params = this.lift;
                this.$api_v3.post('/Lifts/save', params).then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        this.$message.success(res.msg);
                    } else {
                        this.$message.error(res.data);
                    }
                })
            }
            //_____________________baseInfo_______________end
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
        mounted: function () {
            if (this.$route.query.lift_id !== null) {
                this.edit = false;
                this.findLiftById(this.$route.query.lift_id);
            } else {
                this.edit = true;
            }
        }
    }
</script>
<style scoped lang="less">
    .container-floor {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .el-collapse-item__header {
        color: #3c8dbc !important;
        font-size: 14px;
    }

    /*---------报警设置板块------------*/
    .el-tag + .el-tag {
        margin-left: 10px;
    }

    .button-new-tag {
        margin-left: 10px;
        height: 24px;
        line-height: 22px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        height: 24px;
        line-height: 22px;
        width: 200px;
        margin-left: 10px;
        vertical-align: bottom;
    }

    .noteSetting {
        margin-top: 15px;
        width: 100%;
        font-size: 14px;
    }

    /*---------liftPlan------------*/
    .lift-plan {
        h4, div {
            line-height: 35px;
            p {
                margin-right: 30px;
            }
        }
    }

    .plan-add {
        span, .el-button {
            margin-right: 15px;
        }
    }

    /*--------------alarm push -----------*/

    .el-row {
        font-size: 14px;
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    .el-col {
        border-radius: 4px;
    }

    .bg-purple {
        background: #3C8DBC;
    }

    .grid-content {
        border-radius: 4px;
        line-height: 32px;
    }

    .row-bg {
        padding: 10px 0;
    }
</style>
