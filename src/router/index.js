import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/layout',
    component: Layout,
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/monitor',
    component: Layout,
    redirect: '/monitor/amap',
    name: 'monitor',
    meta: { title: '实时监控', icon: 'international' },
    children: [
      // {
      //   path: 'amap',
      //   name: 'amap',
      //   component: () => import('@/views/amap/index'),
      //   meta: { title: '高德地图' }
      // },
      // {
      //   path: 'supermap',
      //   name: 'superMap',
      //   component: () => import('@/views/amap/superMap'),
      //   meta: { title: 'Supermap' }
      // },
      {
        path: 'panorama',
        name: 'panorama',
        component: () => import('@/views/amap/panorama'),
        meta: { title: '全景地图' }
      },
      {
        path: 'openlayer',
        name: 'openlayer',
        component: () => import('@/views/amap/openlayer'),
        meta: { title: 'openlayers' }
      },
      {
        path: 'data_show',
        name: 'dataShow',
        component: () => import('@/views/amap/dataShow'),
        meta: { title: '数据展示' }
      }
    ]
  },

  {
    path: '/cart_manage',
    component: Layout,
    redirect: '/cart_manage/cart_library',
    name: 'cartManage',
    meta: { title: '球车管理', icon: 'shape' },
    children: [
      {
        path: 'due_out',
        name: 'dueOut',
        component: () => import('@/views/cartManage/cartDueout'),
        meta: { title: '收发球车' }
      },
      // {
      //   path: 'due_in',
      //   name: 'dueIn',
      //   component: () => import('@/views/cartManage/cartDuein'),
      //   meta: { title: '待收车' }
      // },
      {
        path: 'cart_library',
        name: 'cartLibrary',
        component: () => import('@/views/cartManage/cartLibrary'),
        meta: { title: '球车库' }
      }
    ]
  },
  {
    path: '/setup',
    component: Layout,
    redirect: '/setup/electric_fence',
    name: 'setup',
    meta: { title: '设置', icon: 'example' },
    children: [
      {
        path: 'electric_fence',
        name: 'electricFence',
        component: () => import('@/views/setUp/electricFence'),
        meta: { title: '电子围栏' }
      },
      {
        path: 'caddies',
        name: 'caddies',
        component: () => import('@/views/setUp/caddies'),
        meta: { title: '球童管理' }
      }
    ]
  },
  // {
  //   path: '/table',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

