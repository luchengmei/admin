<template>
    <div class="user-list">
        <ToolBar>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addUser()" v-show="!treeModel">添加
            </el-button>
            <!--<el-button type="primary" size="small" @click="changeModel">{{treeModel?'列表':'树形结构'}}</el-button>-->
            <div v-show="!treeModel" style="float: right">
                <el-input
                        placeholder="请输入单位名称"
                        size="small"
                        style="width: 140px"
                        v-model="params.name"
                        @clear="searchUser"
                        @keyup.native.enter="searchUser"
                        clearable>
                </el-input>
                <el-button @click="searchUser" type="success" icon="el-icon-search" size="small"></el-button>
            </div>
        </ToolBar>
        <el-table
                v-show="!treeModel"
                :data="companies"
                border
                ref="table"
                style="width: 100%">
            <el-table-column
                    width="100"
                    prop="id"
                    label="单位ID">
                <template slot="header" slot-scope="scope">
                    单位ID
                    <table-sort @ascending="onAscOrDesc('id',0)"
                                @descending="onAscOrDesc('id',1)"
                                @reset="onReset('id')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="单位名称">
                <template slot="header" slot-scope="scope">
                    单位名称
                    <table-sort @ascending="onAscOrDesc('name',0)"
                                @descending="onAscOrDesc('name',1)"
                                @reset="onReset('name')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="地址">
                <template slot="header" slot-scope="scope">
                    地址
                    <table-sort @ascending="onAscOrDesc('address',0)"
                                @descending="onAscOrDesc('address',1)"
                                @reset="onReset('address')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    width="120"
                    prop="lift_count"
                    label="电梯总数">
                <template slot="header" slot-scope="scope">
                    电梯总数
                    <table-sort @ascending="onAscOrDesc('lift_count',0)"
                                @descending="onAscOrDesc('lift_count',1)"
                                @reset="onReset('lift_count')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    :render-header="tableAction"
                    width="180">
                <template slot-scope="scope">
                    <el-button @click="editUser(scope.row.id)" type="primary" icon="el-icon-edit" size="small"
                               circle></el-button>
                    <el-button @click="deleteUser(scope.row.id)" type="danger"
                               icon="el-icon-delete" circle size="small"></el-button>
                    <!--<el-button @click="deleteUser(scope.row.id)" v-else icon="el-icon-check" circle-->
                    <!--size="small"></el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <paginate v-show="!treeModel" :api="paginate_api" :params="paginate_params" @val-change="onValChange"
                  :refresh="refresh"></paginate>
        <div v-show="treeModel" class="el-tree-node__content tree-content-title">
            <span>单位名</span>
            <span>直属机构数量</span>
            <span>创建用户</span>
            <span>创建时间</span>
            <span>操作</span>
        </div>
        <el-tree v-show="treeModel"
                 :data="data"
                 node-key="id"
                 default-expand-all
                 @node-drag-start="handleDragStart"
                 @node-drag-enter="handleDragEnter"
                 @node-drag-leave="handleDragLeave"
                 @node-drag-over="handleDragOver"
                 @node-drag-end="handleDragEnd"
                 @node-drop="handleDrop"
                 draggable
                 :allow-drop="allowDrop"
                 :allow-drag="allowDrag">
        <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="custom-tree-node-label">{{ node.label }}</span>
            <span>
                <span>{{data.count?data.count+'个':""}}</span>
            </span>
            <span>
                <span>{{data.creator||''}}</span>
            </span>
            <span>
                <span>{{data.createTime||''}}</span>
            </span>
            <span>
                <i @click.stop="appendChild(data)" class="el-icon-circle-plus-outline"
                   style="color: #3C8DBC;font-size: 16px;margin-right: 10px"></i>
                <i style="color: #3C8DBC;font-size: 16px" class="el-icon-edit" v-if="data.creator"></i>
            </span>
        </span>
        </el-tree>
    </div>
</template>
<script>
    import ToolBar from '@/components/ToolBar.vue';
    import HelpHint from '@/components/HelpHint.vue';
    import TableSort from '@/components/TableSort.vue';
    import Paginate from "../../components/Paginate";

    export default {
        data() {
            const data = [
                {
                    id: 1,
                    label: '管理单位',
                    children: [{
                        id: 2,
                        label: '马上到科技',
                        creator: 'admin',
                        count: '1',
                        createTime: '2018-09-21 08:50:08',
                        operation: true,
                        children: [{
                            id: 88,
                            label: '合作单位1',
                            creator: 'admin',
                            count: '0',
                            createTime: '2018-09-21 08:50:08',
                            operation: true
                        }, {
                            id: 89,
                            label: '合作单位2',
                            creator: 'admin',
                            account: '123456789',
                            createTime: '2018-09-21 08:50:08',
                            operation: true
                        }]
                    }]
                }, {
                    id: 4,
                    label: '物业单位',
                    children: [{
                        id: 2,
                        label: '百花物业',
                        creator: 'admin',
                        count: '1',
                        createTime: '2018-09-21 08:50:08',
                        operation: true,
                    }, {
                        id: 3,
                        label: '市政府',
                        creator: 'admin',
                        count: '1',
                        createTime: '2018-09-21 08:50:08',
                        operation: true,
                    }]
                }];
            return {
                data: JSON.parse(JSON.stringify(data)),
                treeModel: false,
                paginate_api: '/Group/listPage',
                paginate_params: {
                    "page": 1,
                    "sort": {},
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
            changeModel() {
                this.treeModel = !this.treeModel;
            },
            searchUser() {
                this.paginate_params.page = 1;
                this.paginate_params.name = this.params.name || null;
                this.refresh = !this.refresh;
            },
            onValChange(data) {
                this.companies = data;
            },
            tableAction() {
                return this.$createElement('HelpHint', {
                    props: {
                        content: '编辑单位 / 删除单位'
                    }
                }, '操作');
            },
            onAscOrDesc(str, num) {
                console.log(str, num);
                this.paginate_params.sort[str] = num;
                this.refresh = !this.refresh;
            },
            onReset(str) {
                delete this.paginate_params.sort[str];
                this.refresh = !this.refresh;
            },
            editUser(id) {
                this.$router.push({path: '/user_company_detail', query: {id: id}})
            },
            addUser(id = null) {
                this.$router.push({path: '/user_company_detail', query: {id: id}})
            },
            deleteUser(id) {
                this.$confirm("此操作将删除单位，是否继续？", "提示", {
                    type: "warning",
                    confirmButtonText: '确定',
                    cancelButtonClass: '取消'
                }).then(() => {
                    this.$api_v3.post('/Group/remove', {"id": id}).then((result) => {
                        console.log(result);
                        if (result.code === 0) {
                            this.$message.success('操作成功')
                        }
                        this.refresh = !this.refresh;
                    })
                }).catch(() => {
                });
            },
            //------------------------------------分割线------------------------------//
            appendChild(data) {
                this.$prompt('请输入单位名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({value}) => {
                    this.append(data, value);
                }).catch(() => {
                });
            },
            append(data, value) {
                const newChild = {id: 200, label: value, children: []};
                if (!data.children) {
                    this.$set(data, 'children', []);
                }
                data.children.push(newChild);
            },
            handleDragStart(node, ev) {
                console.log('drag start', node);
            },
            handleDragEnter(draggingNode, dropNode, ev) {
                console.log('tree drag enter: ', dropNode.label);
            },
            handleDragLeave(draggingNode, dropNode, ev) {
                console.log('tree drag leave: ', dropNode.label);
            },
            handleDragOver(draggingNode, dropNode, ev) {
                console.log('tree drag over: ', dropNode.label);
            },
            handleDragEnd(draggingNode, dropNode, dropType, ev) {
                console.log('tree drag end: ', dropNode && dropNode.label, dropType);
            },
            handleDrop(draggingNode, dropNode, dropType, ev) {
                console.log('tree drop: ', dropNode.label, dropType);
            },
            allowDrop(draggingNode, dropNode, type) {
                if (dropNode.data.label === '二级 3-1') {
                    return type !== 'inner';
                } else {
                    return true;
                }
            },
            allowDrag(draggingNode) {
                return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
            }
        },
        components: {
            Paginate,
            ToolBar,
            HelpHint,
            TableSort
        }
    }
</script>
<style lang="less">
    .tree-content-title {
        color: #333333;
        cursor: default;
        height: 40px;
        background: #ffffff;
        padding-left: 54px;
        display: flex;
        span {
            flex: 1;
        }
    }

    .tree-content-title:hover {
        background: #ffffff;
    }

    .el-tree-node__content {
        color: #333333;
        border-bottom: #eeeeee 1px solid;
        height: 45px;
    }

    .el-tree-node__children {
        color: #999999;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        font-size: 14px;
        .custom-tree-node-label {
        }
        span {
            flex: 1;
        }
    }
</style>

