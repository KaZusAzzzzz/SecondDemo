<template>
  <el-card class="box-card">
    <slot name="main">
    <img src="@/assets/img1 (4).jpg" alt="" class="main">
    </slot>
  </el-card>
</template>

<script>
export default {
  name: "card"
}
</script>

<style scoped lang="less">
.box-card {
  width: 99%;
  padding-top: 18px;
  margin-left: 5px;
  :deep(.el-card__body ) {
    padding: 0 15px 20px;
    overflow-y: auto;
    overflow-x: hidden;
    height: 800px;
    .main {
      height: 900px;
    }
  }
}
</style>