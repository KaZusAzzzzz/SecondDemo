<template>
  <card>
    <template #main>
      <el-row justify="space-around">
        <el-col :span="7" style="">
          <h4>今日订单数</h4>
          <h4>1888</h4>
        </el-col>

        <el-col :span="7">
          <h4>今日订单数</h4>
          <h4>1888</h4>
        </el-col>

        <el-col :span="7">
          <h4>今日订单数</h4>
          <h4>1888</h4>
        </el-col>
      </el-row>
      <cahrt></cahrt>
    </template>
  </card>
</template>

<script setup>
import Card from "@/components/card.vue";
import Cahrt from "@/components/cahrt.vue";

const name = "index";
</script>

<style scoped lang="less">

.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  margin-top: 10px;
  border-radius: 4px;
  box-shadow:
  0.4px 0 3.4px rgba(0, 0, 0, 0.06),
  0.9px 0 8.5px rgba(0, 0, 0, 0.036),
  1.3px 0 17.4px rgba(0, 0, 0, 0.026),
  2px 0 35.8px rgba(0, 0, 0, 0.018),
  8px 0 98px rgba(0, 0, 0, 0.009);

  h4:first-child{
    border-bottom:1px solid var(--el-border-color);
  }

  //box-shadow: var(--el-box-shadow);

  *{
    box-sizing: border-box;
    margin: 0;
    padding-left: 30px;
    height: 65px;
    text-align: left;
    line-height: 65px;
  }
}
</style>