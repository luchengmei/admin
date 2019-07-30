<template>
    <div class="user-list">
        <ToolBar>
            <div style="float: left">
                <el-button type="primary" icon="fa fa-hand-pointer-o" size="small" @click="updateStatus_multiple"> 批量处理
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" @click="editUser(false)">批量删除</el-button>
            </div>
            <div style="float: right;display: flex">
                <el-select style="" v-model="params.alarm_type" placeholder="报警类型" size="small"
                           clearable>
                    <el-option
                            v-for="item in alarmTypeOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select style="width: 140px;" v-model="params.status" placeholder="状态" size="small" clearable>
                    <el-option
                            v-for="item in statusOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input
                        placeholder="请输入故障描述/电梯名称"
                        size="small"
                        style="width: 200px"
                        v-model="params.name"
                        @keyup.native.enter="searchUser"
                        @clear="initList"
                        clearable>
                </el-input>
                <el-button @click="searchUser" type="success" icon="el-icon-search" size="small"></el-button>
            </div>
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
                    width="100px"
                    prop="img_urls"
                    label="报警截图">
                <template slot-scope="scope">
                    <el-dropdown>
                        <img style="width: 100%;height: 100%;border-radius: 4px;cursor: pointer"
                             :src="scope.row.img_urls"/>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <img :src="scope.row.img_urls"/>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
            <el-table-column
                    prop="lift_name"
                    label="电梯名称">
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="报警类型">
                <template slot-scope="scope">{{scope.row.type|typeFrm}}</template>
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="报警描述">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="报警处理状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status==='1'" type="success" size="small">已处理</el-tag>
                    <el-tag v-else type="danger" size="small">未处理</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    prop="ctime"
                    label="报警首次发生时间">
            </el-table-column>
            <el-table-column
                    prop="utime"
                    label="报警最新一次更新时间">
            </el-table-column>
            <el-table-column
                    label="操作"
                    :render-header="tableAction"
                    width="180">
                <template slot-scope="scope">
                    <el-button @click="editUser(scope.row)" type="primary" icon="el-icon-edit" size="small" circle></el-button>
                    <!--<el-button @click="" type="danger" icon="el-icon-delete" circle size="small"></el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <paginate :api="list_url" :params="list_params" :refresh="refresh" @val-change="onValChange"></paginate>
    </div>
</template>

<script>
    import ToolBar from '@/components/ToolBar.vue';
    import HelpHint from '@/components/HelpHint.vue';
    import Paginate from '@/components/Paginate.vue';

    export default {
        data() {
            return {
                refresh: false,
                list_url: '/LiftsFault/listPage',
                list_params: {
                    "list_rows": 1,
                    "size": 10,
                    "sort": {id: 1}
                },
                params: {
                    name: '',
                    status: '',
                    alarm_type: ''
                },
                alarmTypeOption: [
                    {
                        value: 'HUMIDIT',
                        label: '湿度'
                    }, {
                        value: 'TEMPERATURE',
                        label: '温度'
                    }, {
                        value: 'NOISE',
                        label: '噪声'
                    }, {
                        value: 'MACHINE_TEMPERATURE',
                        label: '电机温度'
                    }, {
                        value: 'CABINET_TEMPERATURE',
                        label: '电柜温度'
                    }, {
                        value: 'CIRCUIT',
                        label: '安全回路'
                    }, {
                        value: 'DOOR_NOT_OPEN_TIMEOUT',
                        label: '超时不开门'
                    }, {
                        value: 'DOOR_NOT_CLOSED_TIMEOUT',
                        label: '超时不关门'
                    }, {
                        value: 'LEVELING',
                        label: '平层'
                    }, {
                        value: 'LIFTING_WITH_DOOR_OPEN',
                        label: '开门行车'
                    }, {
                        value: 'HALT_OUT_OF_DOOR_ZONE',
                        label: '门区外停车'
                    }, {
                        value: 'DOOR_OPEN_OUT_OF_DOOR_ZONE',
                        label: '门区外开门'
                    }, {
                        value: 'CALL_BUTTON_HIT',
                        label: '呼叫按钮按下'
                    }, {
                        value: 'OVERSPEED',
                        label: '超速'
                    }, {
                        value: 'PONDING',
                        label: '积水'
                    }
                ],
                statusOption: [
                    {
                        value: 1,
                        label: '已处理'
                    }, {
                        value: 0,
                        label: '未处理'
                    }
                ],
                usersData: [],
                selectData: []
            }
        },
        mounted() {
        },
        filters: {
            typeFrm(el) {
                if (el === 'HUMIDITY') return '湿度';
                if (el === 'TEMPERATURE') return '温度';
                if (el === 'NOISE') return '噪声';
                if (el === 'MACHINE_TEMPERATURE') return '电机温度';
                if (el === 'CABINET_TEMPERATURE') return '电柜温度';
                if (el === 'CIRCUIT') return '安全回路';
                if (el === 'DOOR_NOT_OPEN_TIMEOUT') return '超时不开门';
                if (el === 'DOOR_NOT_CLOSED_TIMEOUT') return '超时不关门';
                if (el === 'LEVELING') return '平层';
                if (el === 'LIFTING_WITH_DOOR_OPEN') return '开门行车';
                if (el === 'HALT_OUT_OF_DOOR_ZONE') return '门区外停车';
                if (el === 'DOOR_OPEN_OUT_OF_DOOR_ZONE') return '门区外开门';
                if (el === 'CALL_BUTTON_HIT') return '呼叫按钮按下';
                if (el === 'OVERSPEED') return '超速';
                if (el === 'PONDING') return '积水';
                return el;
            }
        },
        methods: {
            onValChange(data) {
                this.usersData = data;
            },
            initList() {
                this.list_params.search_content = '';
                this.refresh = !this.refresh
            },
            searchUser() {
                this.list_params.search_content = this.params.name;
                this.status = this.params.status;
                this.refresh = !this.refresh;
            },
            tableAction() {
                return this.$createElement('HelpHint', {
                    props: {
                        content: ' 编辑用户 / 禁用或允许登录 / 删除用户'
                    }
                }, '操作');
            },
            editUser(data) {},
            updateStatus_multiple() {
                if (this.selectData.length === 0) {
                    this.$message({type: 'info', message: '请先选中需要处理的报警'}
                    );
                    return false;
                } else {
                    let arr = [];
                    let data = [];
                    this.usersData.forEach((item) => {//Find the item in userData and also in selectData, then change it's status
                        if (this.selectData.some((item1) => {
                            return item === item1;
                        })) {
                            arr.push({
                                "id": item.id,
                                "status": item.status === '1' ? '0' : '1'
                            });
                            data.push(item)
                        }
                    });
                    //console.log('arr', arr);
                    this.$req.post('/dm/alarm_log/update/multiple/status', arr).then((result) => {
                        data.forEach((el) => {
                            el.status = el.status === '1' ? '0' : '1'
                        });
                        //console.log('完成')
                    })
                }
            },
            onSelectionChange(selection) {
                console.log(selection);
                this.selectData = selection;
            },

        },
        components: {
            ToolBar, HelpHint, Paginate
        }
    }
</script>
<style scoped lang="less">
</style>
