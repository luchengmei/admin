<template>
    <div class="user-list">
        <ToolBar>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="editUser()">添加</el-button>
            <div style="float: right">
                <el-input
                        placeholder="请输入单位名称！"
                        size="small"
                        style="width: 140px"
                        v-model="params.name"
                        @clear="initList"
                        @keyup.native.enter="searchUser"
                        clearable>
                </el-input>
                <el-button @click="searchUser" type="success" icon="el-icon-search" size="small"></el-button>
            </div>
        </ToolBar>
        <el-table
                :data="companies"
                border
                ref="table"
                style="width: 100%">
            <el-table-column
                    prop="name"
                    label="单位名称">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="地址">
            </el-table-column>
            <el-table-column
                    prop="lifts_count"
                    label="电梯总数">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    :render-header="tableAction"
                    width="180">
                <template slot-scope="scope">
                    <el-button @click="editUser(scope.row.id)" type="primary" icon="el-icon-edit" size="small"
                               circle></el-button>
                    <!--<el-button @click="deleteUser(scope.row.id)" v-if="scope.row.active != '0'" type="danger"-->
                               <!--icon="el-icon-delete" circle size="small"></el-button>-->
                    <!--<el-button @click="deleteUser(scope.row.id)" v-else icon="el-icon-check" circle-->
                               <!--size="small"></el-button>-->
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
                paginate_api: '/dm/company/all',
                paginate_params: {
                    "page": 1,
                    "property": "id",
                    "size": 10,
                    "sort": "DESC"
                },
                refresh: false,
                params: {
                    name: '',
                },
                companies: [],
            }
        },
        mounted() {
        },
        methods: {
            onValChange(data) {
                //console.log(data);
                this.companies = data;
            },
            initList() {
                this.paginate_api = '/dm/company/all';
                this.paginate_params = {
                    "page": 1,
                    "property": "id",
                    "size": 10,
                    "sort": "DESC"
                };
                this.refresh = !this.refresh;
            },
            searchUser() {
                this.paginate_api = '/dm/company/fuzzy/search';
                this.paginate_params = {
                    "page_proto": {
                        "page": 1,
                        "property": "id",
                        "size": 10,
                        "sort": "DESC"
                    },
                    "value": this.params.name
                };
                this.refresh = !this.refresh
            },
            tableAction() {
                return this.$createElement('HelpHint', {
                    props: {
                        content: '编辑用户 / 删除或恢复用户'
                    }
                }, '操作');
            },
            editUser(id = null) {
                this.$router.push({path: '/userCompany_detail', query: {id: id}})
            },
            deleteUser(id) {
                this.$message({
                    message: '这里请求api删除或者恢复用户之后刷新分页组件，列表自动更新',
                    type: 'success'
                });
            },
        },
        components: {
            Paginate,
            ToolBar,
            HelpHint
        }
    }
</script>
<style lang="less">
</style>

