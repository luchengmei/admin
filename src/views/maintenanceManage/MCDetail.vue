<template>
    <div>
        <el-card class="box-card">
            <div slot="header">
                <span>{{ $route.meta.title}}</span>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="index">
                    <div class="panel-heading">
                        <span class="title"><span class="name">{{name}}</span></span>
                        <i :class="edit===true?'fa fa-floppy-o':'el-icon-edit-outline'"
                           @click="toggleEdit"
                           style="font-size: 28px; position: absolute; right: 31px; top: 0; cursor: pointer;"></i>
                    </div>
                    <div class="panel-body">
                        <ul>
                            <li>
                                <div class="left"><i class="fa fa-id-card"></i></div>
                                <div class="center">单位名称</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="name"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{name}}</div>
                            </li>
                            <li>
                                <div class="left"><i class="el-icon-location"></i></div>
                                <div class="center">地址</div>
                                <div class="right" v-if="edit">
                                    <el-input v-model="address"></el-input>
                                </div>
                                <div class="right" v-else="edit">{{address}}</div>
                            </li>
                        </ul>
                        <div style="margin-top:15px">
                            <el-button type="primary">添加电梯</el-button>
                            <el-button type="primary">添加用户</el-button>
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
                edit: false,
                name: 'xxx维保公司',
                address:'佛山市禅城区',
                activeName: 'index',
            }
        },
        methods: {
            toggleEdit() {
                this.edit = !this.edit;
                if (this.edit === false) {
                    this.save();
                }
            },
            save() {

            }
        },
        mounted: function () {
        }
    }
</script>
<style lang="less">
</style>
