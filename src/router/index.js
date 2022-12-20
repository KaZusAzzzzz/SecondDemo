import {createRouter, createWebHashHistory} from 'vue-router';

import login from "../views/login.vue";
import index from "@/views/index.vue"
import add_good from "@/views/add.vue"
import banner_setting from "@/views/banner_seting.vue";
import indexConfig from "@/views/indexConfig.vue";
import sort_manage from "@/views/sort_manage.vue";
import goods_manage from "@/views/goods_manage.vue";
import vip_manage from "@/views/vip_manage.vue";
import order_manage from "@/views/order_manage.vue";
import modify_code from "@/views/modify_code.vue";
import orderDetail from "@/views/OrderDetail.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: '/login', name: 'login', component: login},
        {path: '/', name: 'index', component: index},
        {path: '/add', name: 'add', component: add_good,},
        {path: '/banner', name: 'banner', component: banner_setting},
        {path: '/hot_goods', name: 'hot_goods', component: indexConfig},
        {path: '/new_goods', name: 'new_goods', component: indexConfig},
        {path: '/recommend', name: 'recommend', component: indexConfig},
        {path: '/category', name: 'category', component: sort_manage,
        children:[
            {path:'/category/level2',name:'level2',component:sort_manage},
            {path:'/category/level3',name:'level3',component:sort_manage},
        ]},
        {path: '/manege', name: 'manage', component: goods_manage},
        {path: '/vip', name: 'vip', component: vip_manage},
        {path: '/order', name: 'order', component: order_manage,},
        {path: '/order/OrderDetail',name: 'OrderDetail',component: orderDetail},
        {path: '/modify_code', name: 'modify_code', component: modify_code},

    ],
})
//配置路由守卫
/*router.beforeEach((to, from, next) => {
    if (from.path === '/login' && to.path === '/introduce') {
        next()
    }
    next()
})*/
export default router
