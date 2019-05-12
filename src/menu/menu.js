let menu = {};

/**
 * 首页
 * @type {{name: string, path: string, icon: string}}
 */
menu.home = {
    name: '首页',
    path: '/',
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
    path: '/userCompany_list',

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
    name: '维保计划',
    path: '/lift_plan_list'
};


// company.maintenance = {
//     name: '维保单位列表',
//     path: '/maintenance_company',
//
// };

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
/**
 * 字体图标
 * @type {{name: string, icon: string, children: {}}}
 */
// menu.font_icon = {
//     name: '字体图标',
//     icon: 'fa fa-th',
//     children: {}
// };
// let icon = menu.font_icon.children;
//
// icon.font_awesome = {
//     name: 'FontAwesome 4.7',
//     path: '/font_awesome',
//
// };
// icon.element_icon = {
//     name: 'ElementIcon',
//     path: '/element_icon',
// };

/**
 * 内容管理
 * @type {{name: string, icon: string, children: {}}}
 */
// menu.content_manage = {
//     name: '内容管理',
//     icon: 'fa fa-file-text-o',
//     children: {}
// };
//
// let ContentManage = menu.content_manage.children;
//
// ContentManage.post = {
//     name: '文章管理',
//     path: '/post_manage',
// };


/**
 * 分类管理
 * @type {{name: string, icon: string, children: {}}}
 */
// menu.category_manage = {
//     name: '分类管理',
//     icon: 'fa fa-sitemap',
//     children: {}
// };
// let CategoryManage = menu.category_manage.children;
//
// CategoryManage.category = {
//     name: '分类列表',
//     path: '/category_manage',
// };
//
//
// menu.permission_manage = {
//     name: '权限管理',
//     icon: 'fa fa-qrcode',
//     children: {}
// };
// let PermissionManage = menu.permission_manage.children;
//
// PermissionManage.role = {
//     name: '角色管理',
//     path: '/role_manage',
// };
//
// PermissionManage.permission = {
//     name: '权限列表',
//     path: '/permission_list',
// };

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

systemSetting.list = {
    name: '单位类型设置',
    path: '/company_setting',
};
systemSetting.plan = {
    name: '角色权限设置',
    path: '/role_setting'
};
export default menu;

// if (process.env.NODE_ENV == 'development') {
//
//     menu.development_tools = {
//         name: '开发工具',
//         icon: 'fa fa-wrench',
//         children: {}
//     };
//
//     let DevelopmentTools = menu.development_tools.children;
//
//     DevelopmentTools.code = {
//         name: '构建代码',
//         path: '/build_code',
//     };
//
// }
