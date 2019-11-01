<template>
  <div class="home">
    <el-row class="Navmenu">
      <el-col :span="4" :style="min_height">
        <el-menu default-active="1" class="el-menu-vertical-demo">
          <el-menu-item index="1" @click="gopath('/')">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>数据管理</span>
            </template>
            <!-- <el-menu-item index="2-1" @click="gopath('userList')">用户列表</el-menu-item> -->
            <!-- <el-menu-item index="2-2" @click="gopath('shopList')">商家列表</el-menu-item> -->
            <el-menu-item index="2-3" @click="gopath('goodList')">商品列表</el-menu-item>
            <el-menu-item index="2-4" @click="gopath('orderList')">订单列表</el-menu-item>
            <!-- <el-menu-item index="2-5" @click="gopath('adminList')">管理员列表</el-menu-item> -->
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-plus"></i>
              <span>添加数据</span>
            </template>
            <el-menu-item index="3-1" @click="gopath('addOrder')">添加订单</el-menu-item>
            <el-menu-item index="3-2" @click="gopath('addGoods')">添加商品</el-menu-item>
          </el-submenu>
          <!-- <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-picture-outline"></i>
              <span>衣服</span>
            </template>
            <el-menu-item index="4-1" @click="gopath('user')">详情页</el-menu-item>
						<el-menu-item index="4-1" @click="gopath('user')">入库编辑页</el-menu-item>
						<el-menu-item index="4-1" @click="gopath('user')">搜索查询库存页面</el-menu-item>
          </el-submenu> -->
          <!-- <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-edit"></i>
              <span>裤子</span>
            </template>
            <el-menu-item index="4-1" @click="gopath('user')">详情页</el-menu-item>
            <el-menu-item index="4-1" @click="gopath('user')">入库编辑页</el-menu-item>
            <el-menu-item index="4-1" @click="gopath('user')">搜索查询库存页面</el-menu-item>
          </el-submenu> -->
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>管理员设置</span>
            </template>
            <el-menu-item index="6-1" @click="gopath('adminSetting')">管理设置</el-menu-item>
          </el-submenu>
          <el-submenu index="7">
            <template slot="title">
              <i class="el-icon-view"></i>
              <span>系统说明</span>
            </template>
            <el-menu-item index="7-1" @click="gopath('intruduce')">说明</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20" style="height: 100%;overflow: auto;">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data(){
    return {
      min_height:''
    }
  },
  created(){
    var min = document.body.offsetHeight+'px'
    this.min_height = { height:min,overflow:'auto'}
    console.log('屏幕',document.body.offsetHeight)
  },
  methods: {
    gopath(path) {
      let token = window.sessionStorage.getItem('key')
      if(token){
        if(path=='/'){
        this.$router.push('/')
        
        }else{
          this.$router.push('/'+path)
        }
        console.log("传过来的路径", path);
      }else{
        this.$message({
          showClose: true,
          message: '认证失效，请先登录',
          type: 'error'
        });
      }
      
      
    }
  }
};
</script>
<style lang="less">
  .el-col-4::-webkit-scrollbar {display:none}
  
</style>
<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  background: #fff;
}
.el-menu{
    height:100%;
  }
</style>
