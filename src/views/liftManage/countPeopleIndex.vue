<template>
    <div class="user-list">
        <ToolBar>
            <!--<div style="float: right">-->
            <!--<el-input-->
            <!--placeholder=""-->
            <!--size="small"-->
            <!--style="width: 220px"-->
            <!--v-model="params.name"-->
            <!--@clear="searchUser()"-->
            <!--@keyup.native.enter="searchUser()"-->
            <!--clearable>-->
            <!--</el-input>-->
            <!--<el-button @click="searchUser()" type="success" icon="el-icon-search"-->
            <!--size="small"></el-button>-->
            <!--</div>-->
        </ToolBar>
        <el-table
                @select="onSelectionChange"
                @select-all="onSelectionChange"
                :data="usersData"
                border
                ref="table"
                style="width: 100%">
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="id"
                    label="ID">
                <template slot="header" slot-scope="scope">
                    ID
                    <table-sort @ascending="onAscOrDesc('id',0)"
                                @descending="onAscOrDesc('id',1)"
                                @reset="onReset('id')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    prop="lift_name"
                    label="电梯名称">
                <template slot="header" slot-scope="scope">
                    电梯名称
                    <table-sort @ascending="onAscOrDesc('phone',0)"
                                @descending="onAscOrDesc('phone',1)"
                                @reset="onReset('phone')"></table-sort>
                </template>
            </el-table-column>
            <el-table-column
                    prop="result"
                    label="检测到人数">
                <template slot-scope="scope">
                    {{(scope.row.result&&scope.row.result.results)?scope.row.result.results.length:0}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="result"
                    label="结果">
                <template slot-scope="scope">
                    {{scope.row.result}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="img_thumb"
                    label="截图">
                <template slot-scope="scope">
                    <el-image
                            @click="previewImage(scope.row.img_url)"
                            :src="scope.row.img_thumb"
                            fit="scale-down"
                            :preview-src-list="srcList">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column
                    prop="ctime"
                    label="时间">
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
        data() {
            return {
                paginate_api: '/LogPeople/listPage',
                paginate_params: {
                    "page": 1,
                    "size": 10,
                    "sort": {}
                },
                srcList: [],
                refresh: false,
                params: {
                    name: '',
                    status: '',
                    type: ''
                },
                selectData: [],
                statusOption: [
                    {
                        value: 1,
                        label: '允许'
                    }, {
                        value: 0,
                        label: '禁用'
                    }
                ],
                typeOption: [
                    {
                        value: 1,
                        label: '维保'
                    }, {
                        value: 2,
                        label: '物业'
                    }
                ],
                usersData: []
            }
        },
        filters: {},
        methods: {
            previewImage(url) {
                this.srcList.splice(0, 1, url);
            },
            onValChange(data) {
                this.usersData = data;
            },
            onSelectionChange(selection, row) {
                console.log(selection);
                this.selectData = selection;
            },
            multipleDelete() {
                if (this.selectData.length === 0) {
                    this.$message({type: 'info', message: '请先选中需要删除的用户'}
                    );
                    return false;
                } else {
                    let arr = [];
                    this.selectData.forEach((item) => {
                        arr.push(item.cellphone)
                    });
                    this.deleteUser(arr);
                }
            },
            multipleHandle() {
                if (this.selectData.length === 0) {
                    this.$message({type: 'info', message: '请先选中需要处理的用户'}
                    );
                    return false;
                } else {
                    this.usersData.forEach((item) => {//Find the item in userData and also in selectData, then change it's status
                        if (this.selectData.some((item1) => {
                            return item === item1;
                        })) {
                            this.toggleEnabled(item);
                        }
                    });
                }
            },
            deleteUser(id) {
                this.$confirm("此操作将删除用户，是否继续？", "提示", {
                    type: "warning",
                    confirmButtonText: '确定',
                    cancelButtonClass: '取消'
                }).then(() => {
                    this.$api_v3.post('/AuUser/remove', {"id": id}).then((res) => {
                        console.log('/AuUser/remove', res);
                        if (res.code === 0) {
                            this.$message.success('操作成功');
                        } else {
                            this.$message.error('操作失败');
                        }
                    })
                }).catch(() => {
                })
            },
            searchUser() {
                this.paginate_params.page = 1;
                this.paginate_params.user_status = this.params.status;
                this.paginate_params.company_type = this.params.type;
                this.paginate_params.search_content = this.params.name;
                this.refresh = !this.refresh;
            },
            tableAction() {
                return this.$createElement('HelpHint', {
                    props: {
                        content: ' 重置密码 / 编辑用户 / 禁用或允许登录 / 删除用户'
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
            addUser(id = null) {
                this.$router.push({path: '/user_detail', query: {id: id}})
            },
            editUser(id) {
                this.$router.push({path: '/user_detail', query: {id: id}})
            },
            changeStatus(row) {
                let params = {
                    "id": row.id,
                    "status": row.status === 1 ? 0 : 1
                };
                this.$api_v3.post('/AuUser/save', params).then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        row.status = row.status === 1 ? 0 : 1;
                        this.$message.success('操作成功')
                    } else {
                        this.$message.error(res.data)
                    }
                })
            },
            resetPassword(row) {
                let params = {
                    "id": row.id,
                    "password": '12345678'
                };
                this.$confirm('此操作将重置密码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let dom = this.$refs[row.id].$el;
                    dom.style.transform = 'rotate(180deg)';
                    this.$api_v3.post('/AuUser/save', params).then((result) => {
                        console.log(result);
                        if (result.code === 0) {
                            this.$message.success('操作成功');
                        } else {
                            this.$message.error(result.data);
                        }
                    }).finally(() => {
                        dom.style.transform = 'rotate(0deg)'
                    })
                }).catch(() => {
                });
            }
        },
        mounted() {
        },
        components: {
            ToolBar, HelpHint, Paginate, TableSort
        }
    }
</script>
<style lang="less">
</style>
