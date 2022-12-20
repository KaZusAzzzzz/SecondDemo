<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px" v-if="showMenu">
        <list></list>
      </el-aside>
      <el-container>
        <el-header v-if="showMenu">
          <peak :left="state.name" @logOut="logOut"
                :nick-name="userMessage.nickName"
                :login-name="userMessage.loginName"></peak>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer v-if="showMenu">Footer</el-footer>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import List from "@/components/menu.vue";
import Peak from "@/components/header.vue";
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from "vue-router";
import {localGet, localRemove} from "@/utils/index.js"
import axios from "@/utils/axios.js";

const showMenu = ref(true)
const router = useRouter();
const pathMap = {
  index: '首页',
  add: '添加商品',
  banner:'设置轮播图',
  hot_goods : '热销商品配置',
  new_goods : '新品上线配置',
  recommend: '为你推荐配置',
  category:'分类管理',
  order:'订单管理',
  level2: '分类二级管理',
  level3: '分类三级管理',
  OrderDetail:'订单详情',
  vip:'会员管理',
  modify_code:'修改密码'
}
const userMessage = reactive({
    nickName: '',
    loginName: ''
})

const state = reactive({
  name: '首页',
})
const noMenu = ['/login', '/#']

onMounted(() => {
  const pathname = window.location.hash.split('/')[1] || ''
  if (!['login'].includes(pathname) && !userMessage.loginName) {
    getMessage()
  }
});

const getMessage = async () => {
  const x = await axios.get('/adminUser/profile',)
  userMessage.loginName = x.loginUserName
  userMessage.nickName = x.nickName
}
//退出登录
const logOut = () => {
  axios.delete('/logout').then(() => {
    // clear token
    localRemove('token')
    router.push('/login')
  })
}

router.beforeEach((to, form, next) => {
  if (to.path === '/login') {
    next()
  } else {
    if (!localGet('token')) {
      next('/login')
    } else {
      next()
    }
  }
})

router.afterEach(to => {
  showMenu.value = !noMenu.includes(to.path);
  state.name = pathMap[to.name]  //如果没有在路由中使用name，那么pathMap中的add就要写成‘/add’多了一个‘/’
})
</script>

<style scoped>
.el-aside {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 8px;
}

.el-main,.el-header {
  padding: 0;
}
.el-container{
  overflow: auto;
}
.el-container .el-container {
  padding: 0;
}
</style>
