import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Address from './components/address.vue'
import List from './components/list.vue'
import Login from './pages/login.vue'
import Home from './pages/index.vue'
import AddGoods from './pages/addGoods.vue'
import AddShop from './pages/addShop.vue'
import AdminSetting from './pages/adminSetting.vue'
import Edit from './pages/edit.vue'
import GoodList from './pages/goodList.vue'
import Intruduce from './pages/intruduce.vue'
import OrderList from './pages/orderList.vue'
import ShopList from './pages/shopList.vue'
import User from './pages/user.vue'
import UserList from './pages/userList.vue'
import AdminList from './pages/adminList.vue'
import Manage from './pages/manage.vue'
import Info from './pages/info.vue'
import addOrder from './pages/addOrder.vue'
const router = new Router({
  linkActiveClass: 'active',
	mode:'history',
  routes: [
		// {
		// 	path:'/',
		// 	name:'Login',
		// 	component:Login
		// },
    {
      path:'/',
			name:'Home',
      component: Home,
      children:[
      {
        path:'',
        name:'Manage',
        component: Manage,
      },{
        path:'/addGoods',
        name:'AddGoods',
        component: AddGoods,
      },{
        path:'/list',
        name:'List',
        component:List
      },
      {
        path:'/addShop',
        name:'AddShop',
        component: AddShop,
      },{
        path:'/adminList',
        name:'AdminList',
        component: AdminList,
      },{
        path:'/adminSetting',
        name:'AdminSetting',
        component: AdminSetting,
      },{
        path:'/edit',
        name:'Edit',
        component: Edit,
      },{
        path:'/goodList',
        name:'goodList',
        component: GoodList,
      },{
        path:'/intruduce',
        name:'Intruduce',
        component: Intruduce,
      },{
        path:'/orderList',
        name:'OrderList',
        component: OrderList,
      },{
        path:'/shopList',
        name:'ShopList',
        component: ShopList,
      },{
        path:'/user',
        name:'User',
        component: User,
      },{
        path:'/userList',
        name:'UserList',
        component: UserList,
      },
      {
        path:'/addOrder',
        name:'addOrder',
        component:addOrder,
      }
    ]
    },
    {
      path:'/login',
			name:'Login',
			component: Login,
    },
    {
      path:'/address',
			name:'Address',
			component: Address,
    },
    {
      path:'/info',
			name:'Info',
			component: Info,
    }
  ]
})

export default router;