<template>
    <div>
        <ToolBar>
            <div style="float: right">
                <el-input
                        placeholder="物业名称/电梯名称/姓名/邮箱/手机号/留言内容"
                        size="small"
                        style="width: 340px"
                        clearable>
                </el-input>
                <el-button type="success" icon="el-icon-search" size="small"></el-button>
            </div>
        </ToolBar>
        <el-table :data="tableData" border width="100%">
            <el-table-column width="100" prop="id">
                <template slot="header" slot-scope="scope">ID
                    <table-sort @ascending="onAscOrDesc('id',0)"
                                @descending="onAscOrDesc('id',1)"
                                @reset="onReset('id')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column prop="lift_id" width="100">
                <template slot="header" slot-scope="scope">电梯ID
                    <table-sort @ascending="onAscOrDesc('lift_id',0)"
                                @descending="onAscOrDesc('lift_id',1)"
                                @reset="onReset('lift_id')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column prop="name">
                <template slot="header" slot-scope="scope">名字
                    <table-sort @ascending="onAscOrDesc('name',0)"
                                @descending="onAscOrDesc('name',1)"
                                @reset="onReset('name')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column prop="phone">
                <template slot="header" slot-scope="scope">手机号
                    <table-sort @ascending="onAscOrDesc('phone',0)"
                                @descending="onAscOrDesc('phone',1)"
                                @reset="onReset('phone')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column prop="qq">
                <template slot="header" slot-scope="scope">QQ号
                    <table-sort @ascending="onAscOrDesc('qq',0)"
                                @descending="onAscOrDesc('qq',1)"
                                @reset="onReset('qq')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column prop="email">
                <template slot="header" slot-scope="scope">电子邮箱
                    <table-sort @ascending="onAscOrDesc('email',0)"
                                @descending="onAscOrDesc('email',1)"
                                @reset="onReset('email')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column prop="text" label="留言内容">
            </el-table-column>
        </el-table>
        <paginate :api="paginate_api" :params="paginate_params" @val-change="onValChange" :refresh="refresh"></paginate>
    </div>
</template>

<script>
    import ToolBar from '@/components/ToolBar.vue';
    import HelpHint from '@/components/HelpHint.vue';
    import Paginate from "../../components/Paginate";
    import TableSort from "../../components/TableSort"

    export default {
        name: "CommentList",
        components: {
            ToolBar, HelpHint, Paginate, TableSort
        },
        data() {
            return {
                paginate_api: '/Comment/listPage',
                paginate_params: {
                    "page": 1,
                    "size": 10,
                    "sort": {},
                    "status": 0
                },
                refresh: false,
                tableData: [],
            }
        },
        methods: {
            onValChange(data) {
                //console.log(data);
                this.tableData = data
            },
            onAscOrDesc(str, num) {
                console.log(str, num);
                this.paginate_params.sort[str] = num;
                this.refresh = !this.refresh;
            },
            onReset(str) {
                delete this.paginate_params.sort[str];
                this.refresh = !refresh;
            }
        },
        mounted() {
        },
        activated() {
        },
    }
</script>

<style scoped>

</style>
