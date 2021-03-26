<template>
  <div class="home">
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="~assets/logo.png"
               alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type='inrighto'
                   @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px':'200px'">
          <div class="toggle-button"
               @click="hideAisde">|||</div>
          <el-menu :default-active="activePath"
                   class="el-menu-vertical-demo"
                   background-color="#313743"
                   text-color="#fff"
                   active-text-color="#409eef"
                   unique-opened
                   :collapse="isCollapse"
                   :collapse-transition="false"
                   :router="true">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''"
                        v-for="item in adminData"
                        :key="item.id">
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item v-for="items in item.children"
                            :key="items.id"
                            :index="'/'+items.path"
                            @click="savePath('/'+items.path)"><template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{items.authName}}</span>
                </template></el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体部分 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>
<script>
import { request } from '../request/request'
export default {
  name: 'Home',
  data () {
    return {
      adminData: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$message.success('退出登录')
      this.$router.push('/login')
    },
    async getMenuList () {
      const res = await request({
        url: 'menus',
        method: 'get'
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.message)
      }
      // console.log(res)
      this.adminData = res.data
    },
    // 点击按钮切换菜单的折叠与展开
    hideAisde () {
      this.isCollapse = !this.isCollapse
    },
    savePath (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped >
.home {
  width: 100%;
  height: 100vh;
  color: #fff;
}
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: rgb(54, 61, 64);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-header > div {
  display: flex;
  align-items: center;
}
.el-header img {
  width: 50px;
}
.el-header span {
  font-size: 20px;
  color: #fff;
  line-height: 60px;
  margin-right: 10px;
}
.el-aside {
  background-color: #313743;
}
.el-menu {
  border-right: none;
}
.el-main {
  background-color: #e9edf1;
}
.iconfont {
  margin-right: 20px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-button {
  background-color: #8f9399;
  color: #fff;
  outline: none;
  border: 0;
}
</style>
