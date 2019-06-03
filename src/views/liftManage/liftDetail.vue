<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="box-card-header">
                <span class="name">{{ lift.name||$route.meta.title}}</span>
                <el-button style="float: right;margin-left: 10px" type="primary" icon="el-icon-d-arrow-left"
                           @click="goBack">返回
                </el-button>
                <el-button v-show="activeName==='index'||activeName==='second'" type="primary" icon="el-icon-check"
                           style="float: right" @click="save()">{{addNew?'新增':'提交'}}
                </el-button>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="index">
                    <div class="panel-heading">
                        <!--<span class="title">-->
                        <!--<el-input v-if="edit" v-model="lift.name" placeholder="请输入电梯名称"></el-input>-->
                        <!--<span v-else="edit" class="name">{{lift.name}}</span>-->
                        <!--</span>-->
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
                            <li v-if="addNew&&edit" v-for="(item1,index1) in companyType">
                                <div class="left"><i class="fa fa-building-o"></i></div>
                                <div class="center">{{item1.name}}</div>
                                <div class="right" style="display: flex">
                                    <div style="margin-right: 30px">
                                        <el-popover
                                                @show="changePage"
                                                placement="bottom"
                                                width="600"
                                                trigger="click">
                                            <el-card class="box-card" shadow="never">
                                                <div slot="header" style="display: flex;align-items: center">
                                                    <el-input placeholder="请输入名称">
                                                        <el-button slot="append" icon="el-icon-search"></el-button>
                                                    </el-input>
                                                    <el-pagination
                                                            :page-size.sync="popover.pageSize"
                                                            :current-page.sync="popover.currentPage"
                                                            @current-change="changePage"
                                                            small
                                                            layout="prev, pager, next"
                                                            :total="popover.total">
                                                    </el-pagination>
                                                </div>
                                                <div v-for="(item, index) in popover.data" :key="index"
                                                     @click="setCompanyName(item,index1,item1.id)"
                                                     style="margin-bottom: 10px;font-size: 14px;color: #3C8DBC;cursor: pointer;">
                                                    {{item.name}}
                                                </div>
                                            </el-card>
                                            <el-button slot="reference" type="primary">点击选择</el-button>
                                        </el-popover>
                                    </div>
                                    <el-input style="flex: 1" v-model="companies_and_types[index1].company_name"
                                              disabled=""></el-input>
                                </div>
                            </li>
                            <li v-if="!addNew" v-for="(company,index2) in lift.companies">
                                <div class="left"><i class="fa fa-building-o"></i></div>
                                <div class="center">{{company.company_type_name}}</div>
                                <div class="right" v-if="edit" style="display: flex">
                                    <div style="margin-right: 30px">
                                        <el-popover
                                                @show="changePage"
                                                placement="bottom"
                                                width="600"
                                                trigger="click">
                                            <el-card class="box-card" shadow="never">
                                                <div slot="header" style="display: flex;align-items: center">
                                                    <el-input placeholder="请输入名称" clearable v-model="popover.param"
                                                              @clear="cancelSearch">
                                                        <el-button slot="append" icon="el-icon-search"
                                                                   @click="searchCompany"></el-button>
                                                    </el-input>
                                                    <el-pagination
                                                            :page-size.sync="popover.pageSize"
                                                            :current-page.sync="popover.currentPage"
                                                            @current-change="changePage"
                                                            small
                                                            layout="prev, pager, next"
                                                            :total="popover.total">
                                                    </el-pagination>
                                                </div>
                                                <div v-for="(item, index3) in popover.data" :key="index3"
                                                     @click="setCompanyName1(item,index2)"
                                                     style="margin-bottom: 10px;font-size: 14px;color: #3C8DBC;cursor: pointer;">
                                                    {{item.name}}
                                                </div>
                                            </el-card>
                                            <el-button slot="reference" type="primary">点击选择</el-button>
                                        </el-popover>
                                    </div>
                                    <el-input style="flex: 1" v-model="company.company_name" disabled=""></el-input>
                                </div>
                                <div class="right" v-else="edit">{{company.company_name}}</div>
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
                                    <el-input placeholder="" v-model="lift.floor">
                                        <template slot="append">层</template>
                                    </el-input>
                                    <el-input-number placeholder="站" style="width: 300px" v-model="lift.station"
                                                     @change="changeFloor" :min="1">
                                    </el-input-number>
                                    <el-input placeholder="" v-model="lift.door">
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
                                    <el-input v-for="(i,index) in floors" :key="index" v-model="i.label"
                                              style="width: 20%">
                                        <template slot="prepend">{{i.value}}</template>
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
                                <el-switch v-model="lift.has_machine_room"></el-switch>
                            </div>
                            <div class="body-item">环境温度和温度
                                <el-switch v-model="lift.temperature_humidity_in_machine_room"></el-switch>
                            </div>
                            <div class="body-item">环境噪声
                                <el-switch v-model="lift.noise_in_machine_room"></el-switch>
                            </div>
                            <div class="body-item">安全回路
                                <el-switch v-model="lift.circuit"></el-switch>
                            </div>
                            <div class="body-item">电机温度
                                <el-switch v-model="lift.machine_temperature"></el-switch>
                            </div>
                            <!--&lt;!&ndash;<div class="body-item">电柜温度&ndash;&gt;-->
                            <!--<el-switch v-model="lift.cabinet_temperature"></el-switch>-->
                            <!--</div>-->
                            <div class="body-item">电流
                                <el-switch v-model="lift.electricity"></el-switch>
                            </div>
                            <!--<div class="body-item">电压-->
                            <!--<el-switch v-model="lift.voltage"></el-switch>-->
                            <!--</div>-->
                            <div class="body-item">抱闸温度
                                <el-switch v-model="lift.brake_temperature"></el-switch>
                            </div>
                            <div class="body-item">曳引绳断股
                                <el-switch v-model="lift.hoist_rope"></el-switch>
                            </div>
                        </el-card>
                        <el-card>
                            <div slot="header">
                                <span>轿厢</span>
                            </div>
                            <div class="body-item">单独麦克风
                                <el-switch v-model="lift.microphone"></el-switch>
                            </div>
                            <div class="body-item">摄像头
                                <el-switch v-model="lift.camera"></el-switch>
                            </div>
                            <div class="body-item">红外人体感应
                                <el-switch v-model="lift.motion"></el-switch>
                            </div>
                            <div class="body-item">紧急按钮
                                <el-switch v-model="lift.emergency_button"></el-switch>
                            </div>
                            <div class="body-item">应急电源
                                <el-switch v-model="lift._e_p_s"></el-switch>
                            </div>
                            <div class="body-item">扬声器
                                <el-switch v-model="lift.loudspeaker"></el-switch>
                            </div>
                            <div class="body-item">广告屏
                                <el-switch v-model="lift.ad_screen"></el-switch>
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
                                <el-switch v-model="lift.temperature_humidity_in_pit"></el-switch>
                            </div>
                            <div class="body-item">环境噪声
                                <el-switch v-model="lift.noise_in_pit"></el-switch>
                            </div>
                            <div class="body-item">钢丝绳
                                <el-switch v-model="lift.wire_rope"></el-switch>
                            </div>
                            <div class="body-item">保护装置
                                <el-switch v-model="lift.protector"></el-switch>
                            </div>
                            <div class="body-item">底坑积水
                                <el-switch v-model="lift.ponding_in_pit"></el-switch>
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
                <el-tab-pane label="报警设置" name="third">
                    <div style="text-align: center;">
                        <el-row :gutter="10" style="color: #ffffff">
                            <el-col :span="6">
                                <div class="grid-content bg-purple">报警类型</div>
                            </el-col>
                            <el-col :span="2">
                                <div class="grid-content bg-purple">阈值(max)</div>
                            </el-col>
                            <el-col :span="2">
                                <div class="grid-content bg-purple">阈值(min)</div>
                            </el-col>
                            <el-col :span="8">
                                <div class="grid-content bg-purple">报警时间</div>
                            </el-col>
                            <el-col :span="2">
                                <div class="grid-content bg-purple">开关</div>
                            </el-col>
                            <el-col :span="4">
                                <div class="grid-content bg-purple">操作</div>
                            </el-col>
                        </el-row>
                        <transition-group name="slide-fade">
                            <el-row :gutter="10" v-for="(item,index) in alarms" :key="index">
                                <el-col :span="6">
                                    <div class="grid-content">{{item.type|formatAlarmType}}</div>
                                </el-col>
                                <el-col :span="2">
                                    <div class="grid-content">
                                        <el-input v-model="item.threshold_max"
                                                  :disabled="isInputDisabled(item.type)"></el-input>
                                    </div>
                                </el-col>
                                <el-col :span="2">
                                    <div class="grid-content">
                                        <el-input v-model="item.threshold_min"
                                                  :disabled="isInputDisabled(item.type)"></el-input>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content">
                                        <el-time-picker
                                                :disabled="isPickerDisabled(item.type)"
                                                v-model="item.period_full"
                                                is-range
                                                range-separator="至"
                                                start-placeholder="开始时间"
                                                end-placeholder="结束时间"
                                                placeholder="选择时间范围">
                                        </el-time-picker>
                                    </div>
                                </el-col>
                                <el-col :span="2">
                                    <div class="grid-content">
                                        <el-switch v-model="item.is_enabled"></el-switch>
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="grid-content" v-if="item.adding">
                                        <el-button type="primary" size="small" plain @click="add_confirm(item)">确定
                                        </el-button>
                                        <el-button type="danger" size="small" @click="add_cancel(item)">取消
                                        </el-button>
                                    </div>
                                    <div class="grid-content" v-else>
                                        <el-button :disabled="isPickerDisabled(item.type)" type="primary" size="small"
                                                   plain @click="addPeriod(item)">添加时段
                                        </el-button>
                                        <el-button type="primary" size="small" @click="updateSingleAlarm(item)">保存
                                        </el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </transition-group>
                    </div>
                    <template><!--<div style="margin-bottom: 15px;color: #3C8DBC;">-->
                        <!--<div style="display: flex">-->
                        <!--<div style="margin-right: 15px">APP推送-->
                        <!--<el-switch v-model="APPpush"></el-switch>-->
                        <!--</div>-->
                        <!--<div>短信通知-->
                        <!--<el-switch v-model="note"></el-switch>-->
                        <!--</div>-->
                        <!--</div>-->
                        <!--<transition name="slide-fade">-->
                        <!--<div v-show="note" class="noteSetting">-->
                        <!--<el-card shadow="never">-->
                        <!--<div slot="header">-->
                        <!--<span>短信通知配置</span>-->
                        <!--</div>-->
                        <!--<div>-->
                        <!--<el-checkbox-group v-model="checkList" style="margin-bottom: 10px">-->
                        <!--<el-checkbox label="物业"></el-checkbox>-->
                        <!--<el-checkbox label="维保"></el-checkbox>-->
                        <!--<el-checkbox label="管理员"></el-checkbox>-->
                        <!--</el-checkbox-group>-->
                        <!--<el-tag-->
                        <!--:key="tag"-->
                        <!--v-for="tag in dynamicTags"-->
                        <!--closable-->
                        <!--:disable-transitions="false"-->
                        <!--@close="handleClose(tag)">-->
                        <!--{{tag}}-->
                        <!--</el-tag>-->
                        <!--<el-input-->
                        <!--placeholder="请输入手机号"-->
                        <!--class="input-new-tag"-->
                        <!--v-show="inputVisible"-->
                        <!--v-model="inputValue"-->
                        <!--ref="saveTagInput"-->
                        <!--size="small"-->
                        <!--@keyup.enter.native="handleInputConfirm"-->
                        <!--@blur="handleInputConfirm">-->
                        <!--</el-input>-->
                        <!--<el-button icon="el-icon-plus" v-show="!inputVisible" class="button-new-tag"-->
                        <!--size="small" @click="showInput">添加指定用户-->
                        <!--</el-button>-->
                        <!--</div>-->
                        <!--</el-card>-->
                        <!--</div>-->
                        <!--</transition>-->
                        <!--</div>--></template>
                </el-tab-pane>
                <el-tab-pane label="报警通知" name="fourth">
                    <div style="margin-bottom: 15px;color: #3C8DBC;">
                        <div style="display: flex">
                            <div style="margin-right: 30px">
                                <el-switch v-model="APPpush" style="margin-left: 10px" active-text="报警通知"></el-switch>
                            </div>
                            <div>
                                <el-switch v-model="note" style="margin-left: 10px" active-text="短信通知"></el-switch>
                            </div>
                        </div>
                    </div>
                    <el-table
                            :data="tableData"
                            style="width: 100%;color: #3C8DBC">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>机房湿度超标</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.HUMIDITY_IN_MACHINE_ROOM.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.HUMIDITY_IN_MACHINE_ROOM.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>机房温度超标</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.TEMPERATURE_IN_MACHINE_ROOM.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.TEMPERATURE_IN_MACHINE_ROOM.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>机房噪声超标</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.NOISE_IN_MACHINE_ROOM.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.NOISE_IN_MACHINE_ROOM.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>安全回路</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.CIRCUIT.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.CIRCUIT.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>抱闸异常</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.BRAKE_EXCEPTION.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.BRAKE_EXCEPTION.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>曳引绳断股</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.HOIST_ROPE_BROKEN.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.HOIST_ROPE_BROKEN.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>电流异常</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.ELECTRICITY_EXCEPTION.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.ELECTRICITY_EXCEPTION.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>超时不开门</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.DOOR_NOT_OPEN_TIMEOUT.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.DOOR_NOT_OPEN_TIMEOUT.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>超时不关门</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.DOOR_NOT_CLOSED_TIMEOUT.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.DOOR_NOT_CLOSED_TIMEOUT.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>电梯非门区停车</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.HALT_OUT_OF_DOOR_ZONE.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.HALT_OUT_OF_DOOR_ZONE.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>轿厢意外移动（开门行车）</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.LIFTING_WITH_DOOR_OPEN.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.LIFTING_WITH_DOOR_OPEN.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>电梯门区开门</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.DOOR_OPEN_OUT_OF_DOOR_ZONE.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.DOOR_OPEN_OUT_OF_DOOR_ZONE.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>电梯困人</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.STUCK_IN_LIFT.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.STUCK_IN_LIFT.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>紧急按钮按下</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.CALL_BUTTON_HIT.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.CALL_BUTTON_HIT.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>超速或失速报警</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.OVERSPEED_OR_STALLING.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.OVERSPEED_OR_STALLING.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>轿厢空气检测</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.AIR_IN_LIFT.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.AIR_IN_LIFT.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>电梯断电报警</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.BLACKOUT.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.BLACKOUT.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>轿厢倾斜超标报警</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.LIFT_INCLINE.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.LIFT_INCLINE.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>轿厢震动超标报警</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.LIFT_QUAKE.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.LIFT_QUAKE.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>底坑噪声</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.NOISE_IN_PIT.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.NOISE_IN_PIT.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>底坑温度</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.TEMPERATURE_IN_PIT.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.TEMPERATURE_IN_PIT.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>底坑湿度</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.HUMIDITY_IN_PIT.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.HUMIDITY_IN_PIT.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>钢丝绳异常</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.WIRE_ROPE_EXCEPTION.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.WIRE_ROPE_EXCEPTION.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>超速保护</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.OVERSPEED_PROTECTION.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.OVERSPEED_PROTECTION.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="row-bg">
                                    <el-col :span="4">
                                        <div>积水</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.PONDING.is_enabled"
                                                   active-text="报警通知"></el-switch>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-switch v-model="props.row.PONDING.message_switch"
                                                   active-text="短信通知"></el-switch>
                                    </el-col>
                                </el-row>
                                <div>
                                    <el-button :disabled="updatingNotice" style="float: right" type="primary"
                                               @click="updateNoticeByUser(props.row)">
                                        {{updatingNotice===true?'正在保存':'保存'}}
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="姓名"
                                prop="name">
                        </el-table-column>
                        <el-table-column
                                label="手机号"
                                prop="cellphone">
                        </el-table-column>
                        <el-table-column
                                label="用户类型"
                                prop="roles">
                            <template slot-scope="scope">
                                <span style="margin-right: 5px" v-for="i in scope.row.roles">{{i|userTypeFrm}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="单位"
                                prop="name">
                        </el-table-column>
                        <el-table-column
                                label="报警通知">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.MASTER_SWITCH.is_enabled"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="短信通知"
                                prop="MASTER_TEXT_SWITCH">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.MASTER_TEXT_SWITCH.is_enabled"></el-switch>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="年审计划" name="fifth">
                    <div class="lift-plan" style="padding: 0 5px">
                        <el-timeline>
                            <transition-group name="slide-fade">
                                <el-timeline-item v-for="(item,index) in liftPlan" :key="index"
                                                  :type="item.status|typeFrm"
                                                  :timestamp="item.arrival_time|dateFrm"
                                                  placement="top">
                                    <el-card style="color: #3C8DBC">
                                        <i class="el-icon-delete"
                                           style="float: right;font-size: 20px;cursor: pointer;margin-left: 10px"
                                           @click="deletePlan(item,index)"></i>
                                        <i :class="item.edit===true?'fa fa-floppy-o':'el-icon-edit-outline'"
                                           style="float: right;font-size: 20px;cursor: pointer;"
                                           @click="toggleEditPlan(item)"></i>
                                        <h4 v-if="item.edit">年审结果：
                                            <el-select v-model="item.status" placeholder="请选择" value="">
                                                <el-option
                                                        v-for="item in result"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </h4>
                                        <h4 v-else>年审结果：{{item.status|statusFrm}}</h4>
                                        <div style="display: flex">
                                            <p v-if="item.edit">实际年审时间：
                                                <el-date-picker
                                                        value-format="yyyy-MM-dd HH:mm:ss"
                                                        v-model="item.arrival_time"
                                                        type="datetime"
                                                        placeholder="选择日期">
                                                </el-date-picker>
                                            </p>
                                            <p v-else>实际年审时间：{{item.arrival_time|dateFrm}}</p>
                                            <p v-if="item.edit">计划年审时间：
                                                <el-date-picker
                                                        value-format="yyyy-MM-dd"
                                                        v-model="item.date"
                                                        type="date"
                                                        placeholder="计划年审时间">
                                                </el-date-picker>
                                            </p>
                                            <p v-else>计划年审时间：{{item.date|dateFrm}}</p>
                                        </div>
                                    </el-card>
                                </el-timeline-item>
                            </transition-group>
                        </el-timeline>
                        <div class="plan-add" style="font-size: 14px;color: #3C8DBC">
                            <span>
                                <el-date-picker
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        v-model="plan.arrival_time"
                                        type="datetime"
                                        placeholder="实际年审时间">
                                </el-date-picker>
                            </span>
                            <span>
                                <el-date-picker
                                        value-format="yyyy-MM-dd"
                                        v-model="plan.date"
                                        type="date"
                                        placeholder="计划年审时间">
                                </el-date-picker>
                            </span>
                            <span><el-select v-model="plan.status" placeholder="年审结果" value="">
                                                <el-option
                                                        v-for="item in result"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                </el-option>
                                            </el-select></span>
                            <el-button type="primary" icon="el-icon-plus" @click="addLiftPlan">添加年审计划</el-button>
                        </div>
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
                liftChangeCount: 0,
                collapseNames: [],
                camera: false,
                companyType: [],
                companies_and_types: [],
                lift: {
                    "company_id": 0,
                    "company_name": '',
                    "maintainer_name": '',
                    "has_machine_room": true,
                    "env_humidity_in_machine_room": true,
                    "env_temperature_in_machine_room": true,
                    "env_temperature_in_pit": true,
                    "machine_temperature": true,
                    "emergency_button": true,
                    "motion": true,
                    "camera": true,
                    "microphone": true,
                    "noise_in_machine_room": true,
                    "noise_in_pit": true,
                    "wire_rope": true,
                    "protector": true,
                    "ad_screen": false,
                    "addr_detail": "",
                    "address": "",
                    "address_shot": "",
                    "brand": "",
                    "building_id": 0,
                    "cabinet_temperature": false,
                    "circuit": true,
                    "city": "",
                    "device_id": null,
                    "district": "",
                    "door": null,
                    "dtsw_date": "",
                    "fault_code": 0,
                    "floor": null,
                    "has_video": true,
                    "id": 0,
                    "is_enabled": true,
                    "lat": null,
                    "license": "",
                    "lng": null,
                    "maintenance_id": 0,
                    "manufacture_date": "",
                    "max_floor": null,
                    "min_floor": null,
                    "model": "",
                    "name": "",
                    "online": 0,
                    "part_of": "",
                    "product_number": "",
                    "province": "",
                    "rated_load": null,
                    "rated_speed": null,
                    "remark": "",
                    "road": "",
                    "station": null,
                    "status": 0,
                    "street": "",
                    "type": "",
                    "user_safe": "",
                    "ponding_in_pit": false,
                    "_e_p_s": true,
                    "loudspeaker": true,
                    "device_phone": '',
                    "hoist_rope": false,
                    "brake_temperature": false,
                    "voltage": false,
                    "electricity": false,
                },
                floors: [],
                value: '',
                value1: '',
                edit: true,
                addNew: false,
                activeName: 'index',
                userType: '',
                userOptions: [{
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
                popover: {
                    "url": '/dm/company/all',
                    "pageSize": 5,
                    "total": 25,
                    "currentPage": 1,
                    "data": [],
                    "param": ''
                },
                //about alarm push
                APPpush: true,
                note: true,
                tableData: [],
                updatingNotice: false,

                //about alarm setting
                alarms: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                hasSave: true,
                value4: '',
                value5: '',
                checkList: [],
                dynamicTags: [],
                overTime_open: [1],
                overTime_close: [1],
                inputVisible: false,
                inputValue: '',
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
            userTypeFrm(val) {
                if (val === 'ROLE_ADMIN') return '管理员';
                if (val === 'ROLE_DEVELOPER') return '开发人员';
                if (val === 'ROLE_CLIENT_ADMIN') return '物业管理员';
                if (val === 'ROLE_CLIENT') return '物业';
                if (val === 'ROLE_MAINTAINER_ADMIN') return '维保管理员';
                if (val === 'ROLE_MAINTAINER') return '维保';
                if (val === 'ROLE_INSTALLER_ADMIN') return '安装人员管理员';
                if (val === 'ROLE_INSTALLER') return '安装人员';
                return val;
            },
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
            },
            formatAlarmType(type) {
                if (type === 'HUMIDITY_IN_MACHINE_ROOM') return '机房湿度超标（%）';
                if (type === 'TEMPERATURE_IN_MACHINE_ROOM') return '机房温度超标（℃）';
                if (type === 'NOISE_IN_MACHINE_ROOM') return '机房噪声超标（db）';
                if (type === 'CIRCUIT') return '安全回路断路';
                if (type === 'BRAKE_EXCEPTION') return '抱闸异常';
                if (type === 'HOIST_ROPE_BROKEN') return '曳引绳断股';
                if (type === 'ELECTRICITY_EXCEPTION') return '电流异常';
                if (type === 'DOOR_NOT_OPEN_TIMEOUT') return '超时不开门（s）';
                if (type === 'DOOR_NOT_CLOSED_TIMEOUT') return '超时不关门（s）';
                if (type === 'HALT_OUT_OF_DOOR_ZONE') return '电梯非门区停车';
                if (type === 'LIFTING_WITH_DOOR_OPEN') return '轿厢意外移动（开门行车）';
                if (type === 'DOOR_OPEN_OUT_OF_DOOR_ZONE') return '电梯门区开门';
                if (type === 'STUCK_IN_LIFT') return '电梯困人';
                if (type === 'CALL_BUTTON_HIT') return '紧急按钮按下';
                if (type === 'OVERSPEED_OR_STALLING') return '超速或失速报警';
                if (type === 'AIR_IN_LIFT') return '轿厢空气检测';
                if (type === 'BLACKOUT') return '电梯断电报警';
                if (type === 'LIFT_INCLINE') return '轿厢倾斜超标报警';
                if (type === 'LIFT_QUAKE') return '轿厢震动超标报警';
                if (type === 'NOISE_IN_PIT') return '底坑噪声';
                // if (type === 'MACHINE_TEMPERATURE') return '电机温度';
                // if (type === 'CABINET_TEMPERATURE') return '电柜温度';
                if (type === 'WIRE_ROPE_EXCEPTION') return '钢丝绳异常';
                if (type === 'OVERSPEED_PROTECTION') return '超速保护';
                if (type === 'PONDING') return '积水';
                if (type === 'TEMPERATURE_IN_PIT') return '底坑温度';
                if (type === 'HUMIDITY_IN_PIT') return '底坑湿度';
                return "未知类型"
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
            goBack() {
                this.hasSave = true;
                this.$router.go(-1);
            },
            hello() {
                console.log('hello')
            },
            //____________________alarmSetting______________start
            isInputDisabled(type) {
                if (type == 'HOIST_ROPE_BROKEN') return true;
                if (type == 'HALT_OUT_OF_DOOR_ZONE') return true;
                if (type == 'LIFTING_WITH_DOOR_OPEN') return true;
                if (type == 'DOOR_OPEN_OUT_OF_DOOR_ZONE') return true;
                if (type == 'OVERSPEED_PROTECTION') return true;
                if (type == 'WIRE_ROPE_EXCEPTION') return true;
                return type == 'PONDING';
            },
            isPickerDisabled(type) {
                return type == 'HOIST_ROPE_BROKEN';
            },
            getAlarmSetting() {
                if (!this.$route.query.lift_id) return;
                let id = this.$route.query.lift_id.toString();
                this.$req.post('/dm/alarm/list', id).then((result) => {
                    //console.log(result);
                    if (result.length !== 0) {
                        result.forEach((item) => {
                            if (item.period_start === null) {
                                item["period_full"] = null
                            } else {
                                item.period_start = this.$moment().format("YYYY-MM-DD ") + item.period_start;
                                item.period_end = this.$moment().format("YYYY-MM-DD ") + item.period_end;
                                item["period_full"] = [new Date(item.period_start), new Date(item.period_end)];
                            }
                        });
                        this.alarms = result.slice(2);
                    }
                })
            },
            updateSingleAlarm(item) {
                if (item.period_full !== null) {
                    item.period_start = this.$moment(item.period_full[0]).format("HH:mm:ss");
                    item.period_end = this.$moment(item.period_full[1]).format("HH:mm:ss")
                }
                this.$req.post('/dm/alarm/update', item).then((result) => {
                    if (result.Code === 7000) {
                        this.$message({
                            type: 'success',
                            message: '设置成功'
                        })
                    }
                })
            },
            addPeriod(item) {
                this.alarms.unshift({
                    "lift_id": item.lift_id,
                    "period_end": null,
                    "period_start": null,
                    "threshold_max": "",
                    "threshold_min": "",
                    "type": item.type,
                    "period_full": null,
                    "is_enabled": true,
                    "adding": true
                })
            },
            add_confirm(item) {
                if (item.period_full == null) {
                    this.$message({
                        "type": 'error',
                        "message": '添加时间段不能为空'
                    });
                    return false;
                } else if (item.period_full !== null) {
                    item.period_start = this.$moment(item.period_full[0]).format("HH:mm:ss");
                    item.period_end = this.$moment(item.period_full[1]).format("HH:mm:ss");
                    this.$req.post('/dm/alarm/add', item).then((result) => {
                        if (result.Code === 7000) {
                            this.$message({
                                "type": 'success',
                                "message": '添加成功'
                            });
                            item.id = result.id;
                            item.adding = false;
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            },
            add_cancel(item) {
                let index = this.alarms.findIndex((value) => {
                    return value === item
                });
                if (index === -1) return;
                this.alarms.splice(index, 1)
            },
            //____________________alarmSetting______________end

            //___________________alarmNotice________________start
            getNoticeList() {
                if (!this.$route.query.lift_id) return;
                this.$req.post('/dm/text_notice/list/lift_id', this.$route.query.lift_id).then((result) => {
                    console.log(result);
                    this.tableData = result;
                    // Object.keys(result).forEach((key) => {
                    //     this.tableData.push(result[key]);
                    //     result[key].notices.forEach((item) => {
                    //         console.log(item)
                    //         // result[key].push(item);
                    //         // console.log(this.tableData)
                    //     });
                    // });
                })
            },
            updateNoticeByUser(row) {
                if (!this.$route.query.lift_id) return;
                this.updatingNotice = true;
                let params = [];
                let Cellphone = row.cellphone;
                //console.log(row);
                Object.keys(row).forEach((key) => {
                    if (key !== "cellphone") {
                        params.push({
                            "cellphone": Cellphone,
                            "is_enabled": row[key].is_enabled,
                            "lift_id": this.$route.query.lift_id,
                            "message_switch": row[key].message_switch,
                            "type": key
                        })
                    }
                });
                //console.log(params);
                this.$req.post('/dm/text_notice/batch_update', params).then((result) => {
                    if (result.Code === 7000) {
                        this.$message({
                            "type": 'success',
                            "message": '保存成功'
                        })
                    }
                }).finally(() => {
                    this.updatingNotice = false
                })
            },
            //___________________alarmNotice________________end

            //____________________liftPlan___________________start
            deletePlan(item, index) {
                //console.log(item);
                this.$confirm('删除此条年审记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$req.post('/dm/lift_plan/delete', item.id).then((result) => {
                        //console.log(result);
                        this.liftPlan.splice(index, 1);
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                    });
                }).catch(() => {
                });
            },
            updatePlan(item) {
                let params = {};
                params = item;
                this.$req.post('/dm/lift_plan/update', params).then((result) => {
                    if (result.Code === 7000) {
                        this.$message({
                            type: 'success',
                            message: '更新成功'
                        })
                    }
                })
            },
            toggleEditPlan(item) {
                item.edit = !item.edit;
                if (item.edit === false) {
                    this.updatePlan(item)
                }
            },
            addLiftPlan() {
                if (this.plan.date === null && this.plan.arrival_time === null) {
                    this.$message({
                        type: 'error',
                        message: '请先选择年审时间'
                    });
                    return false;
                }
                let params = {...this.plan};
                this.$req.post('/dm/lift_plan/add', params).then((result) => {
                    if (result.Code === 7000) {
                        this.liftPlan.push(params);
                        this.plan = {
                            "arrival_time": null,
                            "date": null,
                            "lift_id": this.$route.query.lift_id,
                            "type": 5,
                            "status": null,
                            "edit": false
                        };
                        this.$message({
                            type: 'success',
                            message: '添加成功'
                        });
                    }
                })
            },
            getLiftPlan(id) {
                let params = {
                    "lift_id": id,
                    "page_proto": {
                        "page": 1,
                        "property": "id",
                        "size": 10,
                        "sort": "ASC"
                    }
                };
                this.$req.post('/dm/lift_plan/list/lift_id', params).then((result) => {
                    console.log(result);
                    let arr = result.content.filter((item) => {
                        return item.type == 5;
                    });
                    arr.forEach((i) => {
                        i.edit = false;
                    });
                    this.liftPlan = arr;
                })
            },
            //____________________liftPlan___________________end


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
            searchCompany() {
                this.popover.url = '/dm/company/fuzzy/search';
                this.popover.currentPage = 1;
                this.changePage();
            },
            cancelSearch() {
                this.popover.url = '/dm/company/fuzzy/search';
                this.popover.currentPage = 1;
                this.changePage();
            },
            getCompanyType() {
                this.$req.post('/dm/company_type/all/enabled').then((result) => {
                    console.log(result);
                    this.companyType = [...result];
                    for (let i = 0; i < result.length; i++) {
                        this.companies_and_types.push({
                            "company_name": ''
                        });
                    }
                })
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
            setCompanyName(item, index1, company_type_id) {
                this.companies_and_types[index1].company_name = item.name;
                this.companies_and_types[index1].company_id = item.id;
                this.companies_and_types[index1].company_type_id = company_type_id;
            },
            setCompanyName1(item, index2) {
                this.lift.companies[index2].company_id = item.id;
                this.lift.companies[index2].company_name = item.name;
            },
            onchangeCity(p, c, s) {
                console.log(p, c, s)
            },
            changePage() {
                if (this.popover.url === '/dm/company/all') {
                    let params = {
                        "page": this.popover.currentPage,
                        "property": "id",
                        "size": this.popover.pageSize,
                        "sort": "DESC"
                    };
                    this.$req.post(this.popover.url, params).then((result) => {
                        console.log(result);
                        this.popover.total = result.total_elements;
                        this.popover.data = [...result.content]
                    })
                } else if (this.popover.url === '/dm/company/fuzzy/search') {
                    let params = {
                        "page_proto": {
                            "page": this.popover.currentPage,
                            "property": "id",
                            "size": this.popover.pageSize,
                            "sort": "DESC"
                        },
                        "value": this.popover.param
                    };
                    this.$req.post(this.popover.url, params).then((result) => {
                        console.log(result);
                        this.popover.total = result.total_elements;
                        this.popover.data = [...result.content]
                    })
                }
            },
            addLift() {
                let params = {
                    "building_id": 0,
                    "companies_and_types": this.companies_and_types,
                    "lift": this.lift
                };
                this.$req.post('/dm/lift/add', params).then((result) => {
                    console.log(result);
                    if (result.Code === 7000) {
                        this.addNew = false;
                        this.hasSave = true;
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                    }
                }).then(() => {
                    this.$router.go(-1);
                })
            },
            updateLiftById() {
                let params = {
                    "lift": this.lift,
                    "lifts_companies": this.lift.companies
                };
                this.$req.post('/dm/lift/update', params).then((result) => {
                    if (result.Code === 7000) {
                        this.hasSave = true;
                        this.$message({
                            message: '更新成功',
                            type: 'success'
                        });
                        this.$router.go(-1);
                    }
                })
            },
            findLiftById(id, cb) {
                this.$req.post('/dm/lift/fetch', {
                    'id': id
                }).then((result) => {
                    console.log(result);
                    result.companies.forEach((company) => {
                        if (!company.id) {
                            company.company_id = '';
                            company.company_name = '';
                        }
                    });
                    this.lift = {...result};
                }).then(() => {
                    if (cb) {
                        cb()
                    }
                })
            },
            setFloors() {
                this.floors = [];
                for (let i = 1; i <= parseInt(this.lift.floor); i++) {
                    this.floors.push({
                        label: '',
                        value: i
                    })
                }
            },
            toggleEdit() {
                this.edit = !this.edit;
                if (this.edit === false) {
                }
            },
            changeFloor(val) {
                //console.log(val);
                this.collapseNames = ["1"];
                let difference = val - this.floors.length;
                if (difference > 0) {
                    for (let i = 1; i <= difference; i++) {
                        this.floors.push(
                            {
                                label: '',
                                value: this.floors.length + 1
                            }
                        )
                    }
                } else if (difference < 0) {
                    for (let j = 1; j <= -difference; j++) {
                        this.floors.pop();
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

            delete_time(index, arr) {
                arr.splice(index, 1)
            },
            add_time(arr) {
                arr.push('')
            },
            save() {
                if (this.addNew === true) {
                    this.addLift();
                } else {
                    this.updateLiftById();
                }
            }
            //_____________________baseInfo_______________end
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
        mounted: function () {
            //console.log(this.$route.query);
            if (this.$route.query.lift_id !== null) {
                this.edit = false;
                this.findLiftById(this.$route.query.lift_id, this.setFloors);
                this.getLiftPlan(this.$route.query.lift_id);
                this.getAlarmSetting();
                this.getNoticeList();
            } else {
                this.edit = true;
                this.addNew = true;
                this.getCompanyType();
            }
            //this.getCompanyType();
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
