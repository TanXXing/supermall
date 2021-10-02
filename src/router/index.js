import Vue from 'vue'
import Router from 'vue-router'

//路由懒加载
const Home = () => import('../views/home/Home')
const Category = () => import('../views/category/Category')
const Cart = () => import('../views/cart/Cart')
const Profile = () => import('../views/profile/Profile')

//1. 安装插件
Vue.use(Router)

//路由器实例对象的routes，这对应着每个实际的路由(配置路由)
const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/category',
    component: Category
  },
  {
    path: '/cart',
    component: Cart
  },
  {
    path: '/profile',
    component: Profile
  }
]


/*
const router = new Router({
  routes,
})
*/

//2. 创建路由器实例对象并导出
export default new Router({
  routes,
  mode: 'history'
})

//3.去main.js里面去挂载这个路由器实例对象
