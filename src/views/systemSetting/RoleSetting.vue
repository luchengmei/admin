<template>
    <div class="container">
        <!--<el-input v-model="hhhh"></el-input>-->
        <!--<el-button @click="initRolePrivilege(Number(hhhh))">execute</el-button>-->
        <div class="container_left">
            <div style="text-align: center;padding: 20px">
                <el-button type="primary" style="width: 150px" @click="createRole">新建角色</el-button>
            </div>
            <div class="companyType-list">
                <span :class="current ==i.id?'active':''" v-for="i in roles"
                      @click="changeCurrent(i.id)">{{i.name|rolesFormat}}
                    <!--<span style="padding-left: 20px" v-if="current ==i.id">-->
                    <!--<i class="el-icon-edit"></i>-->
                    <!--<i class="el-icon-remove-outline"></i>-->
                    <!--<i class="fa fa-files-o"></i>-->
                    <!--</span>-->
                </span>
            </div>
        </div>
        <div class="container_right">
            <el-tabs v-model="activeName">
                <el-tab-pane label="角色权限" name="first">
                    <div>
                        <el-checkbox @change="selectAll">全部</el-checkbox>
                        <el-button type="primary" style="float: right;" @click="updateMultiplePrivilege">保存</el-button>
                    </div>
                    <div class="platform">
                        <div class="platform-title">
                            <span>设备管理平台</span>
                            <el-checkbox v-if="privilege[0]" v-model="privilege[0].access_value"
                                         @change="onchange(privilege[0].access_value,[1,28])">允许访问
                            </el-checkbox>
                        </div>
                        <div class="platform-content">
                            <span>单位管理板块</span>
                            <el-checkbox v-if="privilege[1]" v-model="privilege[1].access_value"
                                         @change="onchange(privilege[1].access_value,[2,8])">允许访问
                            </el-checkbox>
                        </div>
                        <div class="content-list">
                            <el-checkbox v-if="privilege[2]" v-model="privilege[2].access_value">查看单位</el-checkbox>
                            <el-checkbox v-if="privilege[3]" v-model="privilege[3].access_value">修改单位</el-checkbox>
                            <el-checkbox v-if="privilege[4]" v-model="privilege[4].access_value">禁用单位</el-checkbox>
                            <el-checkbox v-if="privilege[5]" v-model="privilege[5].access_value">新增单位</el-checkbox>
                            <el-checkbox v-if="privilege[6]" v-model="privilege[6].access_value">删除单位</el-checkbox>
                            <el-checkbox v-if="privilege[7]" v-model="privilege[7].access_value">添加用户</el-checkbox>
                            <el-checkbox v-if="privilege[8]" v-model="privilege[8].access_value">查看用户</el-checkbox>
                        </div>
                        <div class="platform-content">
                            <span>用户管理板块</span>
                            <el-checkbox v-if="privilege[9]" v-model="privilege[9].access_value"
                                         @change="onchange(privilege[9].access_value,[10,16])">允许访问
                            </el-checkbox>
                        </div>
                        <div class="content-list">
                            <el-checkbox v-if="privilege[10]" v-model="privilege[10].access_value">查看用户</el-checkbox>
                            <el-checkbox v-if="privilege[11]" v-model="privilege[11].access_value">修改用户</el-checkbox>
                            <el-checkbox v-if="privilege[12]" v-model="privilege[12].access_value">禁用用户</el-checkbox>
                            <el-checkbox v-if="privilege[13]" v-model="privilege[13].access_value">新增用户</el-checkbox>
                            <el-checkbox v-if="privilege[14]" v-model="privilege[14].access_value">删除用户</el-checkbox>
                            <el-checkbox v-if="privilege[15]" v-model="privilege[15].access_value">重置密码</el-checkbox>
                            <el-checkbox v-if="privilege[16]" v-model="privilege[16].access_value">添加电梯</el-checkbox>
                        </div>
                        <div class="platform-content">
                            <span>电梯管理板块</span>
                            <el-checkbox v-if="privilege[17]" v-model="privilege[17].access_value"
                                         @change="onchange(privilege[17].access_value,[18,25])">允许访问
                            </el-checkbox>
                        </div>
                        <div class="content-list">
                            <el-checkbox v-if="privilege[18]" v-model="privilege[18].access_value">查看电梯</el-checkbox>
                            <el-checkbox v-if="privilege[19]" v-model="privilege[19].access_value">修改电梯</el-checkbox>
                            <el-checkbox v-if="privilege[20]" v-model="privilege[20].access_value">禁用电梯</el-checkbox>
                            <el-checkbox v-if="privilege[21]" v-model="privilege[21].access_value">新增电梯</el-checkbox>
                            <el-checkbox v-if="privilege[22]" v-model="privilege[22].access_value">删除电梯</el-checkbox>
                            <el-checkbox v-if="privilege[23]" v-model="privilege[23].access_value">选择电梯功能</el-checkbox>
                            <el-checkbox v-if="privilege[24]" v-model="privilege[24].access_value">报警设置</el-checkbox>
                            <el-checkbox v-if="privilege[25]" v-model="privilege[25].access_value">报警通知设置</el-checkbox>
                        </div>
                        <div class="platform-content">
                            <span>采集仪管理板块</span>
                            <el-checkbox v-if="privilege[26]" v-model="privilege[26].access_value"
                                         @change="onchange(privilege[26].access_value,[27,28])">允许访问
                            </el-checkbox>
                        </div>
                        <div class="content-list">
                            <el-checkbox v-if="privilege[27]" v-model="privilege[27].access_value">禁用采集仪</el-checkbox>
                            <el-checkbox v-if="privilege[28]" v-model="privilege[28].access_value">编辑采集仪信息</el-checkbox>
                        </div>
                    </div>
                    <div class="platform">
                        <div class="platform-title">
                            <span>安装APP</span>
                            <el-checkbox v-if="privilege[29]" v-model="privilege[29].access_value"
                                         @change="onchange(privilege[29].access_value,[30,35])">允许访问
                            </el-checkbox>
                        </div>
                        <div class="content-list">
                            <el-checkbox v-if="privilege[30]" v-model="privilege[30].access_value">绑定电梯</el-checkbox>
                            <el-checkbox v-if="privilege[31]" v-model="privilege[31].access_value">楼层学习</el-checkbox>
                            <el-checkbox v-if="privilege[32]" v-model="privilege[32].access_value">开启视频</el-checkbox>
                            <el-checkbox v-if="privilege[33]" v-model="privilege[33].access_value">开启对讲</el-checkbox>
                            <el-checkbox v-if="privilege[34]" v-model="privilege[34].access_value">查看报警</el-checkbox>
                            <el-checkbox v-if="privilege[35]" v-model="privilege[35].access_value">处理报警</el-checkbox>
                        </div>
                    </div>
                    <div class="platform">
                        <div class="platform-title">
                            <span>中心监控平台</span>
                            <el-checkbox v-if="privilege[36]" v-model="privilege[36].access_value">允许访问</el-checkbox>
                        </div>
                    </div>
                    <div class="platform">
                        <div class="platform-title">
                            <span>客户APP和PC</span>
                            <el-checkbox v-if="privilege[37]" v-model="privilege[37].access_value"
                                         @change="onchange(privilege[37].access_value,[38,40])">允许访问
                            </el-checkbox>
                        </div>
                        <div class="content-list">
                            <el-checkbox v-if="privilege[38]" v-model="privilege[38].access_value">打开视频</el-checkbox>
                            <el-checkbox v-if="privilege[39]" v-model="privilege[39].access_value">进行通话</el-checkbox>
                            <el-checkbox v-if="privilege[40]" v-model="privilege[40].access_value">报警处理</el-checkbox>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="角色用户" name="second">
                    <el-table
                            v-loading="loading"
                            :data="tableData"
                            style="width: 100%">
                        <el-table-column
                                prop="name"
                                label="用户"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="username"
                                label="账号"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="created_at"
                                label="创建时间">
                        </el-table-column>
                        <el-table-column
                                label="操作">
                            <template slot-scope="scope">
                                <i class="el-icon-edit" style="font-size: 16px;color: #3C8DBC;cursor: pointer"
                                   @click="router_user(scope.row.id)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--<div class="el-tree-node__content tree-content-title">-->
                    <!--<span>用户</span>-->
                    <!--<span>账号</span>-->
                    <!--<span>创建用户</span>-->
                    <!--<span>创建时间</span>-->
                    <!--<span>操作</span>-->
                    <!--</div>-->
                    <!--<el-tree-->
                    <!--:data="data"-->
                    <!--node-key="id"-->
                    <!--default-expand-all-->
                    <!--@node-drag-start="handleDragStart"-->
                    <!--@node-drag-enter="handleDragEnter"-->
                    <!--@node-drag-leave="handleDragLeave"-->
                    <!--@node-drag-over="handleDragOver"-->
                    <!--@node-drag-end="handleDragEnd"-->
                    <!--@node-drop="handleDrop"-->
                    <!--draggable-->
                    <!--:allow-drop="allowDrop"-->
                    <!--:allow-drag="allowDrag">-->
                    <!--<span class="custom-tree-node" slot-scope="{ node, data }">-->
                    <!--<span class="custom-tree-node-label">{{ node.label}}</span>-->
                    <!--<span>-->
                    <!--<span @click="() => append(data)">{{data.name||''}}</span>-->
                    <!--</span>-->
                    <!--<span>-->
                    <!--<span @click="() => append(data)">{{data.creator||''}}</span>-->
                    <!--</span>-->
                    <!--<span>-->
                    <!--<span @click="() => remove(node, data)">{{data.createTime||''}}-->
                    <!--</span>-->
                    <!--</span>-->
                    <!--<span>-->
                    <!--<i style="color: #3C8DBC;font-size: 16px" class="el-icon-edit" v-if="data.account"-->
                    <!--@click="() => remove(node, data)">-->
                    <!--</i>-->
                    <!--</span>-->
                    <!--</span>-->
                    <!--</el-tree>-->
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import ToolBar from '@/components/ToolBar.vue';

    export default {
        name: "RoleSetting",
        components: {
            ToolBar
        },
        data() {
            const data = [{
                id: 1,
                label: '马上到科技',
                children: [{
                    id: 2,
                    label: '一级管理员',
                    children: [{
                        id: 88,
                        label: 'user1',
                        creator: 'admin',
                        account: '123456789',
                        createTime: '2018-09-21 08:50:08',
                        operation: true
                    }, {
                        id: 89,
                        label: 'user2',
                        creator: 'admin',
                        account: '123456789',
                        createTime: '2018-09-21 08:50:08',
                        operation: true
                    }, {
                        id: 87,
                        label: 'user3',
                        creator: 'admin',
                        account: '123456789',
                        createTime: '2018-09-21 08:50:08',
                        operation: true
                    }]
                }, {
                    id: 5,
                    label: '游客'
                }]
            }];
            return {
                hhhh: null,
                data: JSON.parse(JSON.stringify(data)),
                tableData: [],
                loading: false,
                roles: [],
                current: null,
                activeName: 'first',
                searchName: '',
                privilege: [],
                all: false
            }
        },
        mounted() {
            this.getRolesList();
        },
        filters: {
            rolesFormat(el) {
                if (el === "ROLE_ADMIN") return "管理员";
                if (el === "ROLE_DEVELOPER") return "开发者";
                if (el === "ROLE_CLIENT_ADMIN") return "物业管理员";
                if (el === "ROLE_CLIENT") return "物业";
                if (el === "ROLE_MAINTAINER_ADMIN") return "维保管理员";
                if (el === "ROLE_MAINTAINER") return "维保人员";
                if (el === "ROLE_INSTALLER_ADMIN") return "安装管理员";
                if (el === "ROLE_INSTALLER") return "安装人员";
                if (el === "ROLE_SUPER_ADMIN") return "超级管理员";
                return el;
            }
        },
        watch: {},
        methods: {
            onchange(val, arr) {
                //console.log(val,arr);
                let Arr = [];
                for (let i = arr[0]; i <= arr[1]; i++) {
                    Arr.push(i)
                }
                Arr.forEach((item) => {
                    this.privilege[item].access_value = val;
                });
            },
            router_user(id) {
                this.$router.push({path: '/user_detail', query: {id: id}})
            },
            selectAll(val) {
                this.privilege.forEach((item) => {
                    item.access_value = val;
                })
            },
            getPrivilegeByRoleId(id) {
                this.$req.post('/privilege/list/role_id', id).then((result) => {
                    console.log(result);
                    // result.forEach((item) => {
                    //     this.privilege[item.object + '_' + item.access] = item;
                    // })
                    result.forEach((item) => {
                        if (item.access_value === 'true') item.access_value = true;
                        if (item.access_value === 'false') item.access_value = false;
                    });
                    this.privilege = result;
                })
            },
            initRolePrivilege(role_id) {
                let params = [
                    {
                        "access": "access",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "platform_equipment",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "access",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "company",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "fetch",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "company",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "modify",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "company",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "disabled",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "company",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "add",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "company",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "delete",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "company",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "add_user",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "company",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "fetch_user",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "company",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "access",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "user",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "fetch",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "user",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "modify",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "user",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "disabled",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "user",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "add",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "user",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "delete",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "user",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "reset_password",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "user",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "add_lift",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "user",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "access",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "lift",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "fetch",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "lift",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "modify",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "lift",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "disabled",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "lift",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "add",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "lift",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "delete",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "lift",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "choose_function",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "lift",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "alarm_setting",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "lift",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "notice_setting",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "lift",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "access",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "device",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "disabled",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "lift",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "modify",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "lift",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "access",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "installer_app",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "bind_lift",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "installer_app",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "set_floor",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "installer_app",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "video",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "installer_app",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "microphone",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "installer_app",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "fetch_alarm",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "installer_app",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "handle_alarm",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "installer_app",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "access",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "monitoring_center",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "access",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "client_app_pc",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "video",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "client_app_pc",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "microphone",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "client_app_pc",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                    {
                        "access": "handle_alarm",
                        "access_value": "",
                        "master": "role",
                        "master_value": role_id,
                        "object": "client_app_pc",
                        "object_value": 0,
                        "operation": "enabled"
                    },
                ];
                this.$req.post('/privilege/add/multiple', params).then((result) => {
                    console.log(result);
                })
            },
            createRole() {
                this.$prompt('请输入角色名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({value}) => {
                    this.$req.post('/role/add', value).then((result) => {
                        //console.log(result)
                        this.$message({
                            type: 'success',
                            message: '新建成功'
                        });
                        this.initRolePrivilege(result.id);
                        this.getRolesList();
                    })
                }).catch(() => {
                });
            },
            userListByRolesId(role_id) {
                this.loading = true;
                this.$req.post('/user/list/role_id', role_id).then((result) => {
                    //console.log(result)
                    this.tableData = result;
                }).finally(() => {
                    this.loading = false;
                })
            },
            getRolesList() {
                this.$req.post('/role/all').then((result) => {
                    //console.log(result);
                    this.roles = result;
                    this.current = result[0].id;
                    this.userListByRolesId(this.current);
                    this.getPrivilegeByRoleId(this.current);
                })
            },
            changeCurrent(role_id) {
                if (role_id !== this.current) {
                    this.current = role_id;
                    this.userListByRolesId(role_id);
                    this.getPrivilegeByRoleId(role_id);
                }
            },
            updateSinglePrivilege() {
                let params = {};
                this.$req.post('/privilege/update/single', params).then((result) => {
                })
            },
            updateMultiplePrivilege() {
                let params = JSON.parse(JSON.stringify(this.privilege));
                params.forEach((item1) => {
                    if (item1.access_value === true) item1.access_value = 'true';
                    if (item1.access_value === false) item1.access_value = 'false';
                });
                this.$req.post('/privilege/update/multiple', params).then((result) => {
                    if (result.Code === 7000) {
                        this.$message({
                            "message": '保存成功',
                            "type": 'success'
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .container {
        display: flex;

        .container_left {
            width: 300px;
            background: #ffffff;
            .companyType-list {
                color: #333333;
                display: flex;
                flex-direction: column;
                > span {
                    cursor: pointer;
                    padding: 2px 40px;
                    margin: 5px 0;
                }
                > span:hover {
                    background: #eeeeee;
                }
                i {
                    color: #666666;
                    padding: 0 4px;
                }
                .active {
                    background: rgba(60, 141, 188, 0.3);
                }
            }
        }
        .container_right {
            padding: 20px;
            margin-left: 10px;
            flex: 1;
            background: #ffffff;
        }
    }

    .platform {
        span {
            display: inline-block;
            width: 140px;
        }
        margin: 25px 0;
        .platform-title {
            color: #333333;
            font-size: 18px;
            font-weight: 600;
        }
        .platform-content {
            padding-top: 20px;
            padding-left: 10px;
            color: #888888;
            font-size: 16px;
        }
        .content-list {
            padding-left: 10px;
            padding-top: 10px;
        }
    }

    .tree-content-title {
        color: #000000;
        cursor: default;
        height: 40px;
        background: rgba(238, 238, 238, 0.5);
        padding-left: 54px;
        display: flex;
        span {
            flex: 1;
        }
    }
</style>
<style lang="less">
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
