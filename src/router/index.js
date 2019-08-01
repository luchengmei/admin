import Vue from 'vue'
import Router from 'vue-router'
import Personal from './personal'

Vue.use(Router)


let RouteList = [
    {
        path: '/home',
        component: resolve => require(['@/views/layout/App.vue'], resolve),
        meta: {
            title: '首页',
            keepAlive: false,
        },
        children: [
            {
                path: '/home',
                name: 'Dashboard',
                meta: {
                    title: '首页',
                    keepAlive: true
                },
                component: resolve => require(['@/views/home/Index.vue'], resolve),
            },
            {
                path: '/lift_list',
                name: 'LiftList',
                meta: {
                    title: '电梯列表',
                    keepAlive: true
                },
                component: resolve => require(['@/views/liftManage/LiftList.vue'], resolve),
            },
            {
                path: '/lift_detail',
                name: 'LiftDetail',
                meta: {
                    title: '电梯信息',
                    keepAlive: false
                },
                component: resolve => require(['@/views/liftManage/liftDetail.vue'], resolve),
            },
            {
                path: '/lift_plan_list',
                name: 'liftPlanList',
                meta: {
                    title: '维保计划',
                    keepAlive: true
                },
                component: resolve => require(['@/views/liftManage/liftPlanList.vue'], resolve),
            },
            {
                path: '/lift_plan_detail',
                name: 'liftPlanDetail',
                meta: {
                    title: '维保信息',
                    keepAlive: false
                },
                component: resolve => require(['@/views/liftManage/liftPlanDetail.vue'], resolve),
            },
            {
                path: '/alarm_setting',
                name: 'alarmSetting',
                meta: {
                    title: '报警设置',
                    keepAlive: false
                },
                component: resolve => require(['@/views/liftManage/alarmSetting.vue'], resolve),
            },
            {
                path: '/userCompany_list',
                name: 'UserCompanyList',
                meta: {
                    title: '单位列表',
                    keepAlive: true
                },
                component: resolve => require(['@/views/userCompany/UserCompanyList.vue'], resolve),
            },
            {
                path: '/userCompany_detail',
                name: 'UserCompanyDetail',
                meta: {
                    title: '单位信息',
                    keepAlive: false
                },
                component: resolve => require(['@/views/userCompany/UserCompanyDetail.vue'], resolve),
            },
            {
                path: '/maintenance_company',
                name: 'MaintenanceCompany',
                meta: {
                    title: '维保单位列表',
                    keepAlive: true
                },
                component: resolve => require(['@/views/maintenanceManage/MaintenanceCompany.vue'], resolve),
            },
            {
                path: '/maintenanceCompany_detail',
                name: 'MCDetail',
                meta: {
                    title: '维保单位信息',
                    keepAlive: false
                },
                component: resolve => require(['@/views/maintenanceManage/MCDetail.vue'], resolve),
            },
            {
                path: '/collector_list',
                name: 'collectorList',
                meta: {
                    title: '采集仪列表',
                    keepAlive: true
                },
                component: resolve => require(['@/views/collectorManage/collector_list.vue'], resolve),
            },
            {
                path: '/collector_detail',
                name: 'collectorDetail',
                meta: {
                    title: '采集仪信息',
                    keepAlive: false
                },
                component: resolve => require(['@/views/collectorManage/collectorDetail.vue'], resolve),
            },
            {
                path: '/alarm_list',
                name: 'alarmList',
                meta: {
                    title: '报警列表',
                    keepAlive: true
                },
                component: resolve => require(['@/views/alarmManage/alarm_list.vue'], resolve),
            },
            {
                path: '/font_awesome',
                name: 'FontAwesome',
                meta: {
                    title: 'FontAwesome 图标',
                    keepAlive: false
                },
                component: resolve => require(['@/views/icon/FontAwesome.vue'], resolve),
            },
            {
                path: '/element_icon',
                name: 'ElementIcon',
                meta: {
                    title: 'Element 图标',
                    keepAlive: false
                },
                component: resolve => require(['@/views/icon/ElementIcon.vue'], resolve),
            },
            {
                path: '/post_manage',
                name: 'PostManage',
                meta: {
                    title: '文章管理',
                    keepAlive: false
                },
                component: resolve => require(['@/views/contentManage/Index.vue'], resolve),
            },
            {
                path: '/user_manage',
                name: 'UserManage',
                meta: {
                    title: '用户列表',
                    keepAlive: true
                },
                component: resolve => require(['@/views/userManage/Index.vue'], resolve),
            },
            {
                path: '/user_detail',
                name: 'UserDetail',
                meta: {
                    title: '用户信息',
                    keepAlive: false
                },
                component: resolve => require(['@/views/userManage/userDetail.vue'], resolve),
            },
            {
                path: '/company_setting',
                name: 'CompanySetting',
                meta: {
                    title: '单位类型设置',
                    keepAlive: true
                },
                component: resolve => require(['@/views/systemSetting/CompanySetting.vue'], resolve),
            },
            {
                path: '/role_setting',
                name: 'RoleSetting',
                meta: {
                    title: '角色权限设置',
                    keepAlive: true
                },
                component: resolve => require(['@/views/systemSetting/RoleSetting.vue'], resolve),
            },
            {
                path: '/category_manage',
                name: 'CategoryManage',
                meta: {
                    title: '分类列表',
                    keepAlive: true
                },
                component: resolve => require(['@/views/categoryManage/Index.vue'], resolve),
            },
            {
                path: '/role_manage',
                name: 'RoleManage',
                meta: {
                    title: '角色列表',
                    keepAlive: true
                },
                component: resolve => require(['@/views/permissionManage/role/Role.vue'], resolve),
            },
            {
                path: '/permission_list',
                name: 'PermissionList',
                meta: {
                    title: '权限列表',
                    keepAlive: true
                },
                component: resolve => require(['@/views/permissionManage/permission/Index.vue'], resolve),
            },
            //个人中心，可能有修改密码，头像修改等路由
            Personal.index,
        ]
    },
    {
        path: '/',
        name: 'Login',
        meta: {
            title: '后台登录',
            keepAlive: false
        },
        components: {
            blank: resolve => require(['@/views/login/Login.vue'], resolve),
        }
    }
]


RouteList[0].children.push({
    path: '/build_code',
    name: 'BuildCode',
    meta: {
        title: '构建代码',
        keepAlive: true
    },
    component: resolve => require(['@/views/developmentTool/Build.vue'], resolve),
});

export default new Router({routes: RouteList})


