<template>
    <div class="user-list">
        <ToolBar>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="editUser(false)">添加</el-button>
            <div style="float: right">
                <el-input
                        placeholder="请输入单位名称！"
                        size="small"
                        style="width: 140px"
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
                    prop="companyName"
                    label="单位名称">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="地址">
            </el-table-column>
            <el-table-column
                    prop="account"
                    label="电梯总数">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    :render-header="tableAction"
                    width="180">
                <template slot-scope="scope">
                    <!--<el-button @click="resetting(scope.row.id)" type="warning" style="transition: .4s;"-->
                               <!--:ref="scope.row.id" icon="el-icon-refresh" size="small" circle></el-button>-->
                    <el-button @click="editUser(scope.row)" type="primary" icon="el-icon-edit" size="small"
                               circle></el-button>
                    <el-button @click="deleteUser(scope.row.id)" v-if="scope.row.active != '0'" type="danger"
                               icon="el-icon-delete" circle size="small"></el-button>
                    <el-button @click="deleteUser(scope.row.id)" v-else icon="el-icon-check" circle
                               size="small"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <paginate :api="maintenanceApi"></paginate>
    </div>
</template>

<script>
    import ToolBar from '@/components/ToolBar.vue';
    import HelpHint from '@/components/HelpHint.vue';
    import Paginate from "../../components/Paginate";

    export default {
        data() {
            return {
                maintenanceApi:'./static/json/maintenance.json',
                params: {
                    name: '',
                },
                usersData: [
                    {
                        id: 1,
                        companyName: 'Admin',
                        address: 'Admin@.admin.com',
                        account: 'Admin@.admin.com',
                        password: '151178xxxx'
                    },
                    {
                        id: 2,
                        companyName: 'haha',
                        address: 'Admin@.admin.com',
                        account: 'Admin@.admin.com',
                        password: '151178xxxx'
                    },
                ]
            }
        },
        methods: {
            searchUser() {
                let tableRow = this.$refs.table.$el.querySelectorAll('tbody tr');
                let tableRowHeight = tableRow[1].offsetHeight;
                let isjump = false;
                for (let i = 0; i < this.usersData.length; i++) {
                    if (this.params.name && this.usersData[i].companyName.indexOf(this.params.name) != -1) {
                        tableRow[i].style.backgroundColor = '#85ce61';
                        if (!isjump) {
                            scrollTo(0, i * tableRowHeight + 66);
                            isjump = true;
                        }
                    } else {
                        tableRow[i].style.backgroundColor = '#fff';
                    }
                }
            },
            tableAction() {
                return this.$createElement('HelpHint', {
                    props: {
                        content: '编辑用户 / 删除或恢复用户'
                    }
                }, '操作');
            },
            editUser(data) {
                this.$router.push('/maintenanceCompany_detail')
            },
            UploadUser(data) {

            },
            deleteUser(id) {
                this.$message({
                    message: '这里请求api删除或者恢复用户之后刷新分页组件，列表自动更新',
                    type: 'success'
                });
            },
            // resetting(id) {
            //     let dom = this.$refs[id].$el;
            //     dom.style.transform = 'rotate(180deg)';
            //     setTimeout(() => {
            //         dom.style.transform = 'rotate(0deg)'
            //     }, 600);
            //     this.$message({
            //         message: '已经成功重置密码',
            //         type: 'success'
            //     });
            // },
        },
        components: {
            Paginate,
            ToolBar, HelpHint
        }
    }
</script>
<style lang="less">

</style>

