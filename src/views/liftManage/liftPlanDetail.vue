<template>
    <div>
        <el-card class="box-card">
            <div slot="header">
                <span>{{ $route.meta.title}}</span>
                <el-button type="primary" icon="el-icon-check" style="float: right" @click="save()">提交</el-button>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="index">
                    <div class="panel-heading">
                        <span class="title"><span class="name">{{company.name}}</span></span>
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
                                    <el-input v-model="company.name"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{company.name}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-info"></i></div>
                                <div class="center">ip</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="company.address"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{company.address}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="fa fa-window-restore"></i></div>
                                <div class="center">绑定电梯</div>
                                <div class="right" v-if="edit">
                                    <el-button type="primary">绑定电梯</el-button>
                                </div>
                                <div class="right" v-else="edit">{{company.address}}</div>
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
                company: {},
                liftPlan: {}
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
            liftPlanFetch() {
                this.$req.post('/dm/lift_plan/fetch', this.$route.query.id).then((result) => {
                    console.log(result);
                    this.liftPlan = result;
                })
            },
            save() {
            },
        },
        mounted: function () {
            if (this.$route.query.id !== null) {
                this.liftPlanFetch();
            } else {
                this.edit = true;
                this.addNew = true;
            }
        }
    }
</script>
<style lang="less">
</style>
