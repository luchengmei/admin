<template>
    <div class="user-list">
        <ToolBar>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addUser()">添加</el-button>
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
                        placeholder="请输入采集仪ip/电梯名称/采集仪名称"
                        size="small"
                        style="width: 220px"
                        v-model="params.name"
                        @clear="clearSearch"
                        @keyup.native.enter="searchUser()"
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
                    prop="lift_name"
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
                    <el-button @click="editUser(scope.row.id)" type="primary" icon="el-icon-edit" size="small" circle></el-button>
                    <el-button type="danger" @click="removeDevice(scope.row.id)" icon="el-icon-delete" circle size="small"></el-button>
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
                paginate_api: 'Devices/listPage',
                paginate_params: {
                    "list_rows": 1,
                    "size": 10,
                    "sort": {id: 1}
                },
                refresh:false,
                params: {
                    name: '',
                    status: ''//是否已绑定电梯
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
            clearSearch(){
                this.paginate_params.search_content = '';
                this.paginate_params.is_binded = '';
                this.refresh = !this.refresh;
            },
                searchUser() {
                this.paginate_params.search_content = this.params.name;
                this.paginate_params.is_binded = this.params.status;
                this.refresh = !this.refresh;
            },
            onValChange(data) {
                this.usersData = data
            },
            tableAction() {
                return this.$createElement('HelpHint', {
                    props: {
                        content: ' 编辑采集仪 / 删除采集仪'
                    }
                }, '操作');
            },
            editUser(id) {
                this.$router.push({path: '/collector_detail', query: {id: id}})
            },
            addUser(id=null) {
                this.$router.push({path: '/collector_detail', query: {id: id}})
            },
            removeDevice(id){
                this.$confirm("此操作将删除采集仪，是否继续？", "提示", {
                    type: "warning",
                    confirmButtonText: '确定',
                    cancelButtonClass: '取消'
                }).then(() => {
                    this.$api_v3.post('/Devices/remove',{'id':id}).then((res)=>{
                        if(res.code===0){
                            this.$message.success('操作成功');
                        }else {
                            this.$message.error('操作失败');
                        }
                    })
                }).catch(() => {
                })
            }
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
