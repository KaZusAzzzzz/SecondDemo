<template>
  <card>
    <template #main>
      <div class="top">
        <el-button type="primary" @click="handleAdd(null)">
          <slot name="one">
            <el-icon>
              <Plus/>
            </el-icon>
            增加
          </slot>
        </el-button>
        <el-popconfirm :visible="state.visible"  width="160"
                       title="确定删除吗？"
                       confirmButtonText='确定'
                       cancelButtonText='取消'
                       @confirm="del(null)">
          <template #reference>
            <el-button type="danger" @click="">
              <slot name="two">
                <el-icon>
                  <DeleteFilled/>
                </el-icon>
                批量删除
              </slot>
            </el-button>
          </template>
        </el-popconfirm>

        <dialog-add-good ref="dialogAddGood" :type="state.type" :reload="getCommodity"
                         :config-type="state.configType"></dialog-add-good>
      </div>
      <el-table
          ref="TableRef"
          :data="state.tableData"
          style="width: 100%"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column label="商品名称" width="180" property="configName"/>
        <el-table-column property="redirectUrl" label="跳转链接" width="120"/>
        <el-table-column property="configRank" label="排序值" show-overflow-tooltip/>
        <el-table-column property="configId" label="商品编号"/>
        <el-table-column property="updateTime" label="添加时间"/>

        <el-table-column label="操作" width="120">
          <template #default={row}>
            <el-button type="primary" link @click="handleAdd(row.configId)">
              修改
            </el-button>
            <el-popconfirm :visible="state.visible"  width="160"
                           title="确定删除吗？"
                           confirmButtonText='确定'
                           cancelButtonText='取消'
                           @confirm="del(row.configId)">
              <template #reference>
                <el-button type="danger" link @click="state.popoverVisible = true">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="example-pagination-block">
        <el-pagination
            background layout="prev, pager, next" :total="state.total"
            :page-size="state.pageSize" v-model:current-page="state.currentPage"
        />
      </div>
    </template>
  </card>
</template>

<script>
export default {
  name: "hot_goods"
}
</script>

<script setup>
import Card from "@/components/card.vue";
import {ref, reactive, onUnmounted, onMounted, watch} from "vue";
import {useRouter, useRoute} from "vue-router";
import axios from "@/utils/axios.js";
import DialogAddGood from "@/components/DialogAddGood.vue"
import {ElMessage} from "element-plus";

const router = useRouter()
const route = useRoute()
const dialogAddGood = ref(null)
const TableRef = ref(null)

const configTypeMap = {
  hot_goods: 3,
  new_goods: 4,
  recommend: 5
}
const state = reactive({
  popoverVisible : false,
  loading: false,
  tableData: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  type: 'add',
  configType: 3,
  level: 1,
  parent_id: 0
})
const unWatch = router.beforeEach(to => {
  if (configTypeMap[to.name]) {
    state.configType = configTypeMap[to.name]
    state.currentPage = 1
    getCommodity()
  }
})
onUnmounted(() => {
  unWatch()
})

onMounted(() => {
  state.configType = configTypeMap[route.name]
  getCommodity()
})

const getCommodity = () => {
  state.loading = true
  axios.get('/indexConfigs', {
    params: {
      pageNumber: state.currentPage,
      pageSize: state.pageSize,
      configType: state.configType
    }
  }).then(res => {
    console.log(res.list)
    state.tableData = res.list
    state.total = res.totalCount
    state.currentPage = res.currPage
    state.loading = false
  })
}

watch(() => {
  return state.currentPage
}, (next) => {
  state.currentPage = next
  getCommodity()
})

const handleAdd = (id) => {
  if (id) {
    state.type = 'modify'
    dialogAddGood.value.open(id)
  } else {
    state.type = 'add'
    dialogAddGood.value.open()
  }
}

const del = (id) => {
  state.popoverVisible = true
  if (id) {
    axios.post('/indexConfigs/delete',{
      ids:[id]
    }).then(() => {
      ElMessage.success('删除成功')
      getCommodity()
    })
  }else {
  if (TableRef.value.getSelectionRows().length === 0  ) return  ElMessage.error('请选择商品')
    axios.post('/indexConfigs/delete',{
      ids:TableRef.value.getSelectionRows().map(element => element.configId)
    })
  }
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

.el-pagination {
  margin-top: 20px;
}
</style>