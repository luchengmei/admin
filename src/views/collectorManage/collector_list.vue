<template>
    <div class="user-list">
        <ToolBar>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="editUser()">添加</el-button>
            <div style="float: right">
                <el-select style="width: 140px" v-model="params.status" placeholder="是否绑定电梯" size="small" clearable>
                    <el-option
                            v-for="item in statusOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input
                        placeholder="请输入采集仪/绑定电梯名称"
                        size="small"
                        style="width: 220px"
                        v-model="params.name"
                        @clear="searchUser"
                        clearable>
                </el-input>
                <el-button @click="searchUser" type="success" icon="el-icon-search" size="small"></el-button>
            </div>
        </ToolBar>
        <el-table
                :data="usersData"
                border
                ref="table"
                style="width: 100%">
            <el-table-column
                    prop="name"
                    label="采集仪名称">
            </el-table-column>
            <el-table-column
                    prop="ip"
                    label="采集仪IP">
            </el-table-column>
            <el-table-column
                    prop="lift_id"
                    label="绑定电梯名称">
            </el-table-column>
            <el-table-column
                    prop="binding_time"
                    label="绑定电梯时间">
            </el-table-column>
            <el-table-column
                    label="操作"
                    :render-header="tableAction"
                    width="180">
                <template slot-scope="scope">
                    <el-button @click="editUser(scope.row.id)" type="primary" icon="el-icon-edit" size="small"
                               circle></el-button>
                    <el-button @click="changeUser(scope.row)" v-if="scope.row.active != '0'" type="warning"
                               icon="el-icon-close" circle size="small"></el-button>
                    <el-button @click="changeUser(scope.row)" v-else icon="el-icon-check" circle
                               size="small"></el-button>
                    <el-button type="danger"
                               icon="el-icon-delete" circle size="small"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <paginate :api="paginate_api" :params="paginate_params" @val-change="onValChange" :refresh="refresh"></paginate>
    </div>
</template>

<script>
    import ToolBar from '@/components/ToolBar.vue';
    import HelpHint from '@/components/HelpHint.vue';
    import Paginate from "../../components/Paginate";

    export default {
        data() {
            return {
                paginate_api: '/dm/device/all',
                paginate_params: {
                    "page": 1,
                    "property": "id",
                    "size": 10,
                    "sort": "DESC"
                },
                refresh:false,
                params: {
                    name: '',
                    status: ''
                },
                statusOption: [
                    {
                        value: 1,
                        label: '已绑定'
                    }, {
                        value: 0,
                        label: '未绑定'
                    }
                ],
                usersData: []
            }
        },
        methods: {
            searchUser() {
            },
            onValChange(data) {
                console.log(data);
                this.usersData = data
            },
            tableAction() {
                return this.$createElement('HelpHint', {
                    props: {
                        content: ' 编辑用户 / 禁用或允许登录 / 删除用户'
                    }
                }, '操作');
            },
            editUser(id=null) {
                this.$router.push({path: '/collector_detail', query: {id: id}})
            },
            changeUser(data) {
                if (data.active === 1) {
                    data.active = 0
                } else {
                    data.active = 1
                }
                this.$message({
                    message: '更改用户状态成功!',
                    type: 'success'
                });
            },
            resetting(id) {

                let dom = this.$refs[id].$el;
                dom.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    dom.style.transform = 'rotate(0deg)'
                }, 600);
                this.$message({
                    message: '已经成功重置密码',
                    type: 'success'
                });

            },
        },
        mounted(){
        },
        components: {
            ToolBar, HelpHint, Paginate
        }
    }
</script>
<style lang="less">

</style>
