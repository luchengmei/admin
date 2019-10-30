<template>
    <div>
        <el-card class="box-card">
            <div slot="header">
                <span>{{ $route.meta.title}}</span>
                <el-button type="primary" icon="el-icon-check" style="float: right" @click="addPlan()">保存</el-button>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="index">
                    <div class="panel-heading">
                        <span class="title"><span class="name"></span></span>
                        <!--<i :class="edit===true?'fa fa-floppy-o':'el-icon-edit-outline'"-->
                        <!--@click="toggleEdit"-->
                        <!--style="font-size: 28px; position: absolute; right: 31px; top: 0; cursor: pointer;"></i>-->
                    </div>
                    <div class="panel-body">
                        <ul>
                            <li>
                                <div class="left"><i class="fa fa-id-card"></i></div>
                                <div class="center">电梯名称</div>
                                <div class="right" v-if="edit" style="display: flex">
                                    <div style="margin-right: 30px">
                                        <el-popover
                                                placement="bottom"
                                                trigger="click">
                                            <el-card class="box-card" shadow="never">
                                                <div slot="header" style="display: flex;align-items: center">
                                                    <el-input placeholder="请输入名称" v-model="popoverInputVal"
                                                              @clear="search()"
                                                              clearable
                                                              @keyup.native.enter="search()">
                                                        <el-button slot="append" icon="el-icon-search"
                                                                   @click="getLiftList"></el-button>
                                                    </el-input>
                                                    <el-pagination
                                                            :page-size.sync="popover.pageSize"
                                                            :current-page.sync="popover.currentPage"
                                                            @current-change="getLiftList()"
                                                            normal
                                                            layout="prev, pager, next"
                                                            :total="popover.total">
                                                    </el-pagination>
                                                </div>
                                                <div v-for="(item, index) in popover.data" :key="index"
                                                     @click="onPopoverClick(item)"
                                                     style="margin-bottom: 10px;font-size: 14px;color: #3C8DBC;cursor: pointer;">
                                                    {{item.name}}
                                                </div>
                                            </el-card>
                                            <el-button slot="reference" type="primary">点击选择</el-button>
                                        </el-popover>
                                    </div>
                                    <el-input style="flex: 1" v-model="plan.lift_name" disabled></el-input>
                                </div>
                                <div class="right" v-else="edit"></div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">类型</div>
                                <div class="right" v-if="edit">
                                    <el-select v-model="plan.type">
                                        <el-option v-for="item in typeOption" :key="item.value"
                                                   :label="item.label"
                                                   :value="item.value"></el-option>
                                    </el-select>
                                </div>
                                <div class="right" v-else="edit"></div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">维保/年审结果</div>
                                <div class="right" v-if="edit">
                                    <el-select v-model="plan.status">
                                        <el-option v-for="item in statusOption" :key="item.value"
                                                   :label="item.label"
                                                   :value="item.value"></el-option>
                                    </el-select>
                                </div>
                                <div class="right" v-else="edit"></div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-date"></i></div>
                                <div class="center">本次日期</div>
                                <div class="right" v-if="edit">
                                    <el-date-picker v-model="plan.date" type="date" placeholder="选择日期"
                                                    value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </div>
                                <div class="right" v-else="edit"></div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-date"></i></div>
                                <div class="center">预计日期</div>
                                <div class="right" v-if="edit">
                                    <el-date-picker v-model="plan.next_date" type="date" placeholder="选择日期"
                                                    value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </div>
                                <div class="right" v-else="edit"></div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">处理人</div>
                                <div class="right" v-if="edit">
                                    <el-input clearable v-model="plan.handler"></el-input>
                                </div>
                                <div class="right" v-else="edit"></div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">处理人电话</div>
                                <div class="right" v-if="edit">
                                    <el-input clearable v-model="plan.handler_phone"></el-input>
                                </div>
                                <div class="right" v-else="edit"></div>
                            </li>
                            <!--<li>-->
                                <!--<div class="left"><i class="el-icon-info"></i></div>-->
                                <!--<div class="center">负责人</div>-->
                                <!--<div class="right" v-if="edit">-->
                                    <!--<el-input></el-input>-->
                                <!--</div>-->
                                <!--<div class="right" v-else="edit"></div>-->
                            <!--</li>-->
                        </ul>
                        <div style="padding: 15px;display: flex;align-items: center">
                            <span style="width: 30px"><i class="el-icon-info"></i></span>
                            <p style="flex: 1">备注</p>
                            <div style="flex: 3">
                                <el-input v-model="plan.remark" type="textarea"></el-input>
                            </div>
                        </div>
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
                edit: true,
                addNew: true,
                activeName: 'index',
                plan: {
                    lift_id: '',
                    lift_name: ''
                },
                popoverInputVal: '',
                popover: {
                    "pageSize": 10,
                    "total": 0,
                    "currentPage": 1,
                    "data": []
                },
                //1:半月维保,2:季度维保,3:半年维保,4:年度维保,5:年审,6:大修
                typeOption: [
                    {
                        value: 1,
                        label: '半月维保',
                    }, {
                        value: 2,
                        label: '季度维保',
                    }, {
                        value: 3,
                        label: '半年维保'
                    }, {
                        value: 4,
                        label: '年度维保'
                    }, {
                        value: 5,
                        label: '年审'
                    }, {
                        value: 6,
                        label: '大修'
                    }
                ],
                statusOption: [
                    {
                        label: '未处理',
                        value: 0
                    }, {
                        label: '合格',
                        value: 1
                    }, {
                        label: '不合格',
                        value: 2
                    }
                ]
            }
        },
        filters: {},
        methods: {
            toggleEdit() {
                this.edit = !this.edit;
                if (this.edit === false) {
                    this.save();
                }
            },
            onPopoverClick(item) {
                this.plan.lift_id = item.id;
                this.plan.lift_name = item.name;
            },
            search() {
                this.popover.currentPage = 1;
                this.getLiftList();
            },
            getLiftList() {
                let params = {};
                params.page = this.popover.currentPage;
                params.list_rows = this.popover.pageSize;
                params.search_content = this.popoverInputVal;
                this.$api_v3.post('/Lifts/listPage', params).then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        this.popover.data = res.data.data;
                        this.popover.total = res.data.total;
                    }
                })
            },
            addPlan() {
                let params = this.plan;
                this.$api_v3.post('/LiftsPlan/save', params).then((res) => {
                    if (res.code === 0) {
                        this.$message.success('操作成功')
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            readPlan() {
                this.$api_v3.post('/LiftsPlan/read', {id: this.$route.query.plan_id}).then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        this.plan = res.data;
                        this.plan.lift_name = res.data.lift.name;
                    }
                })
            }
        },
        mounted: function () {
            this.getLiftList();
            if (this.$route.query.plan_id !== null) {
                this.readPlan();
            }
        }
    }
</script>
<style lang="less">
</style>
