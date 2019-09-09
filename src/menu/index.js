import Menu from './menu';
//这里可以根据权限做菜单过滤
if (process.env.NODE_ENV == 'development') {

    Menu.development_tools = {
        name: '开发工具',
        icon: 'fa fa-wrench',
        children: {}
    };

    let DevelopmentTools = Menu.development_tools.children;

    DevelopmentTools.code = {
        name: '构建代码',
        path: '/build_code',
    };
    DevelopmentTools.role = {
        name: '角色管理',
        path: '/role_manage',
    };

    DevelopmentTools.permission = {
        name: '权限列表',
        path: '/permission_list',
    };


    DevelopmentTools.font_awesome = {
        name: 'FontAwesome 4.7',
        path: '/font_awesome',

    };
    DevelopmentTools.element_icon = {
        name: 'ElementIcon',
        path: '/element_icon',
    };
}
export default Menu;
