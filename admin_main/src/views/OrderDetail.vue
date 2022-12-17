<template>
  <el-row justify="space-around">
    <el-col :span="7" style="">
      <h4>订单状态</h4>
      <h4>{{state.data.orderStatusString}}</h4>
    </el-col>

    <el-col :span="7">
      <h4>创建时间</h4>
      <h4>{{ state.data.createTime }}</h4>
    </el-col>

    <el-col :span="7">
      <h4>订单号</h4>
      <h4>{{state.data.orderNo  }}</h4>
    </el-col>
  </el-row>

  <el-table :data="state.tableData" :border="true" >
    <el-table-column label="商品图片" width="200" :align="'center'">
<template #default={row}>
  <img :src="$filters.prefix(row.goodsCoverImg)" alt="商品主图" width="200">
</template>
    </el-table-column >
    <el-table-column label="商品名称" prop="goodsName" :align="'center'"/>
    <el-table-column label="商品价格" prop="sellingPrice" :align="'center'"/>
    <el-table-column label="商品库存" prop="goodsCount" :align="'center'"/>

  </el-table>
</template>

<script>
export default {
  name: "OrderDetail"
}
</script>
<script setup>
import {reactive,onMounted} from "vue";
import axios from "@/utils/axios.js";
import {useRoute} from "vue-router";

const route = useRoute()
const {id} = route.query
const state = reactive({
  data:'',
  tableData:[]
})
onMounted(() => {
  // 初始化钩子，获取订单详情数据
  axios.get(`/orders/${id}`).then(res => {
    console.log(res)
    state.data = res
    console.log(state.data)
    state.tableData = res.newBeeMallOrderItemVOS
  })
})
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