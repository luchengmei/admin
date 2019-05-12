import Menu from './menu';
//import permissions from "../api/permissions";
import req from '../utils/axios'
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
}
export default Menu;
