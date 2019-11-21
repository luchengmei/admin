let menu = {};

/**
 * 首页
 * @type {{name: string, path: string, icon: string}}
 */
menu.home = {
    name: '首页',
    path: '/home',
    icon: 'fa fa-tachometer',
};


/**
 * 单位管理
 * @type {{name: string, icon: string, children: {}}}
 */
menu.companyManage = {
    name: '单位管理',
    icon: 'fa fa-building-o',
    children: {}
};
let company = menu.companyManage.children;

company.user = {
    name: '单位列表',
    path: '/user_company_list',

};


/**
 * 用户管理
 * @type {{name: string, icon: string, children: {}}}
 */
menu.user_manage = {
    name: '用户管理',
    icon: 'fa fa-users',
    children: {}
};
let UserManage = menu.user_manage.children;

UserManage.user = {
    name: '用户列表',
    path: '/user_manage',
};


/**
 * 电梯管理
 * @type {{name: string, icon: string, children: {}}}
 */
menu.lift_manage = {
    name: '电梯管理',
    icon: 'fa fa-window-restore',
    children: {}
};
let lift = menu.lift_manage.children;

lift.list = {
    name: '电梯列表',
    path: '/lift_list',
};
lift.plan = {
    name: '维保年审',
    path: '/lift_plan_list'
};

lift.map = {
    name: '地图',
    path: '/map'
};

lift.comment = {
    name: '评论列表',
    path: '/comment_list'
};
lift.countPeople = {
    name: '人数检测',
    path: '/count_people_index'
};


/**
 * 采集仪管理
 * @type {{name: string, icon: string, children: {}}}
 */
menu.collectorManage = {
    name: '采集仪管理',
    icon: 'fa fa-podcast',
    children: {}
};
let collector = menu.collectorManage.children;

collector.list = {
    name: '采集仪列表',
    path: '/collector_list',
};
/**
 * 统计分析
 * @type {{name: string, icon: string, children: {}}}
 */
menu.statistical = {
    name: '统计分析',
    icon: 'fa fa-bar-chart',
    children: {}
};
let analysis = menu.statistical.children;

analysis.list = {
    name: '在/离线统计',
    path: '/analysis_list',
};
analysis.alarmStatistical = {
    name: '报警统计',
    path: '/alarmStatistical',
};


/**
 * 报警管理
 * @type {{name: string, icon: string, children: {}}}
 */
menu.alarmManage = {
    name: '报警管理',
    icon: 'fa fa-bell-o',
    children: {}
};
let alarm = menu.alarmManage.children;

alarm.list = {
    name: '报警列表',
    path: '/alarm_list',
};
alarm.setting = {
    name: '报警设置',
    path: '/alarm_setting'
};


/**
 * 系统设置
 * @type {{name: string, icon: string, children: {}}}
 */
menu.system_setting = {
    name: '系统设置',
    icon: 'el-icon-setting',
    children: {}
};
let systemSetting = menu.system_setting.children;

// systemSetting.list = {
//     name: '单位类型设置',
//     path: '/company_setting',
// };
systemSetting.plan = {
    name: '角色权限设置',
    path: '/role_setting'
};
export default menu;