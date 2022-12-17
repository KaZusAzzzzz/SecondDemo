<template>
  <card>
    <template #main>
      <div class="top">
        <el-button type="primary" @click="skip">
          <el-icon>
            <Plus/>
          </el-icon>
          增加商品
        </el-button>
      </div>
      <el-table
          ref="TableRef"
          :data="state.tableData"
          style="width: 100%"
      >
        <el-table-column label="商品编号" width="180" property="goodsCategoryId"/>
        <el-table-column property="goodsName" label="商品名" width="120"/>
        <el-table-column property="goodsDetailContent" label="商品简介" show-overflow-tooltip/>
        <el-table-column label="商品图片">
          <template #default={row}>
            <el-image style="width: 100px; height: 100px" :src='$filters.prefix(row.goodsCoverImg)' :fit="'contain'"/>
          </template>
        </el-table-column>
        <el-table-column property="stockNum" label="商品库存"/>
        <el-table-column property="sellingPrice" label="商品售价"/>
        <el-table-column property="goodsSellStatus" label="上架状态">
          <template #default={row}>
            <h4 v-if="row.goodsSellStatus" style="color:#67C23A;">已上架</h4>
            <h4 v-else style="color:#F56C6C;">已下架</h4>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120">
          <template #default={row}>
            <el-button type="primary" link @click="handleEdit(row.goodsId)">
              修改
            </el-button>
            <el-button type="danger" link @click="state.popoverVisible = true" v-if="row.goodsSellStatus">
              下架
            </el-button>
            <el-button type="danger" link @click="state.popoverVisible = true" v-else>
              上架
            </el-button>
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

<script lang="ts">
export default {
  name: "goods_manage"
}
</script>
<script setup lang="ts">
import Card from "@/components/card.vue";
import {ref, reactive, onMounted, onUnmounted, watch,getCurrentInstance} from "vue";
import {useRouter, useRoute} from "vue-router";
import axios from "@/utils/axios.js";
import {ElMessage} from "element-plus";

const app = getCurrentInstance()
const {goTop} =app.appContext.config.globalProperties
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
  popoverVisible: false,
  loading: false,
  tableData: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
})
const unWatch = router.beforeEach(to => {
  if (configTypeMap[to.name]) {
    state.currentPage = 1
    getCommodity()
  }
})
onUnmounted(() => {
  unWatch()
})

onMounted(() => {
  getCommodity()
})

const getCommodity = () => {
  state.loading = true
  axios.get('/goods/list', {
    params: {
      pageNumber: state.currentPage,
      pageSize: state.pageSize,
    }
  }).then(res => {
    state.tableData = res.list
    state.total = res.totalCount
    state.currentPage = res.currPage
    state.loading = false
    goTop && goTop() // 数据获取成功后，回到顶部
    const container = document.querySelector('.el-card__body')
    document.documentElement.scrollTop=container.scrollTop=0
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
    dialogAddGood.value.open(id)
  } else {
    dialogAddGood.value.open()
  }
}

const del = (id) => {
  state.popoverVisible = true
  if (id) {
    axios.post('/indexConfigs/delete', {
      ids: [id]
    }).then(() => {
      ElMessage.success('删除成功')
      getCommodity()
    })
  } else {
    if (TableRef.value.getSelectionRows().length === 0) return ElMessage.error('请选择商品')
    axios.post('/indexConfigs/delete', {
      ids: TableRef.value.getSelectionRows().map(element => element.configId)
    })
  }
}
const skip = () => {
  router.push('/add')
}
const handleEdit = (id) => {
  console.log(id)
  router.push({ path: '/add', query: { id } })
}
const handleStatus = (id,status) => {

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