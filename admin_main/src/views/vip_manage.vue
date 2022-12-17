<template>
  <card>
    <template #main>
      <div class="top">
        <el-button type="primary" @click="undo">
          <slot name="one">
            <el-icon>
              <Plus/>
            </el-icon>
            解除禁用
          </slot>
        </el-button>
        <el-popconfirm :visible="state.visible" width="160"
                       title="确定删除吗？"
                       confirmButtonText='确定'
                       cancelButtonText='取消'
                       @confirm="ban">
          <template #reference>
            <el-button type="danger" >
              <slot name="two">
                <el-icon>
                  <DeleteFilled/>
                </el-icon>
                禁用账户
              </slot>
            </el-button>
          </template>
        </el-popconfirm>

      </div>

      <el-table ref="table" v-loading="state.loading" :data="state.tableList">
        <el-table-column type="selection" width="55"/>
        <el-table-column label="昵称" prop="nickName"/>
        <el-table-column label="登录名" prop="loginName"/>
        <el-table-column label="身份状态" >
          <template #default={row} >
            <p :style="row.lockedFlag === 0 ? 'color: green;' : 'color: red;' ">
              {{ row.lockedFlag === 0 ? '正常' : '禁用' }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="是否注销" >
          <template #default={row} >
            <p :style="row.isDeleted === 0 ? 'color: green;' : 'color: red;' ">
              {{ row.isDeleted === 0 ? '正常' : '禁用' }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" prop="createTime"/>
      </el-table>

      <div class="example-pagination-block">
        <el-pagination background layout="prev, pager, next" :page-size="state.pageSize"
                       :total="state.total" v-model:current-page="state.currentPage">

        </el-pagination>
      </div>
    </template>
  </card>
</template>

<script>
export default {
  name: "vip_manage"
}
</script>
<script setup>
import Card from "@/components/card.vue";
import {ref,reactive, onMounted,watch} from "vue";
import axios from "@/utils/axios.js";
import {ElMessage} from "element-plus";
import {DeleteFilled} from '@element-plus/icons-vue'

const table = ref()
const state = reactive({
  loading: false,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  tableList: [],
})
onMounted(() => {
  getList()
})

const getList = () => {
  state.loading = true;
  axios.get('/users', {
    params: {
      pageNumber: state.currentPage,
      pageSize: state.pageSize
    }
  }).then(res => {
    console.log(res)
    state.tableList=res.list
    state.loading = false
  })
}

watch(() => {
  return state.currentPage
}, (next) => {
  state.currentPage = next
  getOderList()
})

const undo = () => {
  const selection  = table.value.getSelectionRows().map(item =>item.userId)
  if (selection.length===0) return ElMessage.error('请选择账号')
  axios.put(`/users/0`, {
    ids:selection
  }).then(() => {
    ElMessage.success('解除成功')
    getList()
  })
}
const ban = () => {
  const selection  = table.value.getSelectionRows().map(item => item.userId)
  if (selection.length===0) return ElMessage.error('请选择账号')
  axios.put(`/users/1`, {
    ids:selection
  }).then(() => {
    ElMessage.success('禁用成功')
    getList()
  })
}
</script>
<style scoped lang="less">
//顶部按钮样式
.top {
  display: flex;
  position: relative;
  left: -15px;
  height: 45px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e9e9e9;

.el-button {
  margin-left: 20px;
}

:deep(.el-icon) {
  margin-right: 5px;
}

.el-dialog__body {
  padding: 10px 10px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
}
</style>