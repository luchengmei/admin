<template>
    <div>
        <el-card class="box-card">
            <div slot="header">
                <span>{{ $route.meta.title}}</span>
                <el-button type="primary" icon="el-icon-check" style="float: right" @click="save()">提交</el-button>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="index">
                    <!--<div class="panel-heading">-->
                    <!--<span class="title"><span class="name"></span></span>-->
                    <!--<i :class="edit===true?'fa fa-floppy-o':'el-icon-edit-outline'"-->
                    <!--@click="toggleEdit"-->
                    <!--style="font-size: 28px; position: absolute; right: 31px; top: 0; cursor: pointer;"></i>-->
                    <!--</div>-->
                    <div class="panel-body">
                        <ul>
                            <li>
                                <div class="left"><i class="fa fa-id-card"></i></div>
                                <div class="center">电梯名称</div>
                                <div class="right" v-if="edit">
                                    <el-input></el-input>
                                </div>
                                <div class="right" v-else="edit">{{liftFault.lift?liftFault.lift.name:''}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">报警描述</div>
                                <div class="right" v-if="edit">
                                    <el-input></el-input>
                                </div>
                                <div class="right" v-else="edit">
                                    {{liftFault.description}}
                                </div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">报警时间</div>
                                <div class="right" v-if="edit">
                                    <el-input></el-input>
                                </div>
                                <div class="right" v-else="edit">{{liftFault.ctime}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">报警状态</div>
                                <div class="right" v-if="edit">
                                    <el-input></el-input>
                                </div>
                                <div class="right" v-else="edit">
                                    <el-select v-model="liftFault.status" value="">
                                        <el-option
                                                v-for="item in option"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
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
                activeName: 'index',
                edit: false,
                liftFault: {},
                option: [
                    {
                        label: '未处理',
                        value: 0,
                    }, {
                        label: '已查看',
                        value: 1
                    }, {
                        label: '已处理',
                        value: 2
                    }, {
                        label: '误报',
                        value: 3
                    }
                ]
            }
        },
        filters: {
            statusFilter(value) {
                // 0未处理，1已查看，2已处理，3误报
                if (value == 0) {
                    return '未处理'
                }
                if (value == 1) {
                    return '已查看'
                }
                if (value == 2) {
                    return '已处理'
                }
                if (value == 3) {
                    return '误报'
                }
                return value;
            }
        },
        methods: {
            toggleEdit() {
                this.edit = !this.edit;
            },
            readLiftFault(id) {
                this.$api_v3.post('/LiftsFault/read', {id: id}).then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        this.liftFault = res.data;
                    }
                })
            },
            save() {
                this.$api_v3.post('/LiftsFault/save', this.liftFault).then((res) => {
                    console.log('/LiftsFault/save', res);
                    if (res.code === 0) {
                        this.$message.success('保存成功')
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            }
        },
        mounted() {
            this.readLiftFault(this.$route.query.alarm_id);
        }
    }
</script>
<style lang="less">
</style>
