<template>
  <div class="mb-2">
    <div class="img"></div>
    <h4>username</h4>
  </div>
  <el-menu
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      default-active="1"
      :default-openeds=open_array
      :router="true"
  >
    <el-sub-menu index="1">
      <template #title>
        <span>控制面板</span>
      </template>
      <el-menu-item index="/">
        <el-icon>
          <House/>
        </el-icon>
        首页
      </el-menu-item>
      <el-menu-item index="/add" @click="jump($el)">
        <el-icon>
          <Plus/>
        </el-icon>
        添加商品
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <span>首页配置</span>
      </template>
      <el-menu-item index="/banner">
        <el-icon>
          <Picture/>
        </el-icon>
        轮播图配置
      </el-menu-item>
      <el-menu-item index="/hot_goods">
        <el-icon >
          <StarFilled />
        </el-icon>
        热销商品配置
      </el-menu-item>
      <el-menu-item index="/new_goods">
        <el-icon>
          <Sell/>
        </el-icon>
        新品上线配置
      </el-menu-item>
      <el-menu-item index="/recommend">
        <el-icon>
          <ShoppingCart/>
        </el-icon>
        为你推荐配置
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <span>模块管理</span>
      </template>
      <el-menu-item index="/category">
        <el-icon>
          <Menu/>
        </el-icon>
        分类管理
      </el-menu-item>
      <el-menu-item index="/manege">
        <el-icon>
          <Handbag/>
        </el-icon>
        商品管理
      </el-menu-item>
      <el-menu-item index="/vip">
        <el-icon>
          <User/>
        </el-icon>
        会员管理
      </el-menu-item>
      <el-menu-item index="/order">
        <el-icon>
          <List/>
        </el-icon>
        订单管理
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>
        <span>系统管理</span>
      </template>
      <el-menu-item index="/modify_code">
        <el-icon>
          <Lock/>
        </el-icon>
        修改密码
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
<script setup lang="ts">
const open_array = ['1','2','3','4']

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

//路由跳转
const jump = (id) => {
  console.log(id)
}
</script>

<script lang="ts">
export default {
  name: "list"
}
</script>

<style scoped lang="less">

.mb-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  border-right: 1px solid #e9e9e9;

  .img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: red;
  }

  h4 {
    margin: 0 0 0 10px;
  }
}

.el-sub-menu .el-menu-item{
  padding: 0 10px;
  min-width: 0;
}
  .el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) .el-menu-item, .el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) .el-sub-menu__title, .el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) .el-menu-item-group__title{
  padding: 0 10px;
}
</style>