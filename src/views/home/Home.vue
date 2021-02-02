<template>
  <el-container class="home-container">
    <!-- 页面头部 -->
    <el-header>
      <div>
        <img src="~@/assets/img/logo/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px' ">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu background-color="#606266" text-color="#fff" active-text-color="#40beff" 
        unique-opened :collapse = isCollapse :collapse-transition = false>
          <el-submenu :index="item.id + '' " v-for="item in MenusList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="submenu.id + '' " v-for="submenu in item.children" :key="submenu.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{submenu.authName}}</span>
              </template>  
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      MenusList:[],
      iconObj:{
        125:'iconfont icon-user',
        103:'iconfont icon-tijikongjian',
        101:'iconfont icon-shangpin' ,
        102:'iconfont icon-danju' ,
        145:'iconfont icon-baobiao' 
      },
      isCollapse:false,
    }
  },
  created() {
    this.getMenusList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
   async getMenusList() {
    const { data: res } = await await this.$http.get('Menus');
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
    console.log(res);
    this.MenusList = res.data;
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  color: #fff;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
}
.el-aside {
  background-color: #606266;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #C0C4CC;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #909399;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
}
</style>