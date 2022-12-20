<template>
  <card>
    <template #main>
      <div class="top">
        <el-button type="primary" @click="add">
          <slot name="one">
            <el-icon>
              <Plus/>
            </el-icon>
            增加
          </slot>
        </el-button>
        <el-popconfirm :visible="state.visible" width="160"
                       title="确定删除吗？"
                       confirmButtonText='确定'
                       cancelButtonText='取消'
                       @confirm="goodsDelete">
          <template #reference>
            <el-button type="danger" >
              <slot name="two">
                <el-icon>
                  <DeleteFilled/>
                </el-icon>
                批量删除
              </slot>
            </el-button>
          </template>
        </el-popconfirm>

      </div>

      <el-table
          ref="TableRef"
          :data="state.tableData"
          style="width: 100%"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column label="分类名称" width="120" property="categoryName"/>
        <el-table-column property="categoryRank" label="排序值" width="120"/>
        <el-table-column property="updateTime" label="添加时间"/>
        <el-table-column label="操作" width="220">
          <template #default={row}>
            <el-button type="primary" link @click="changeGoods(row.categoryId)">
              修改
            </el-button>
            <el-button type="primary" link @click="skipNext(row.categoryId)">
              下级分类
            </el-button>
            <el-popconfirm :visible="state.visible" width="160"
                           title="确定删除吗？"
                           confirmButtonText='确定'
                           cancelButtonText='取消'
                           @confirm="goodDelete(row.categoryId)">
              <template #reference>
                <el-button type="danger" link >
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
      <dialog-add-category ref="addCategory" :type="state.type" :reload="getDate"></dialog-add-category>
    </template>
  </card>
</template>

<script>
export default {
  name: "sort_manage"
}
</script>

<script setup>
import {ref, reactive, onUnmounted, onMounted, watch} from "vue";
import Card from "@/components/card.vue";
import {useRouter, useRoute} from "vue-router";
import {Plus, Delete} from '@element-plus/icons-vue'
import axios from "@/utils/axios.js";
import {ElMessage} from "element-plus";
import DialogAddCategory from '@/components/DialogAddCategory.vue'

const router = useRouter()
const route = useRoute()
const TableRef = ref(null)
const addCategory =ref(null)

const state = reactive({
  loading: false,
  tableData: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  type: 'add',
  level: 1,
  parentId: 0
})
const unWatch = router.afterEach(to => {
  if (['category', 'level2', 'level3'].includes(to.name)) {
    getDate()
  }
})

onMounted(() => {
  getDate()
})
onUnmounted(() => {
  unWatch()
})

watch(() => {
  return state.currentPage
}, (next) => {
  state.currentPage = next
  getDate()
})

const getDate = () => {
  const {level = 1, parentId = 0} = route.query
  state.loading = true
  axios.get('/categories', {
    params: {
      pageNumber: state.currentPage,
      pageSize: state.pageSize,
      categoryLevel: level,
      parentId: parentId
    }
  }).then((res) => {
    state.tableData = res.list
    state.total = res.totalCount
    state.currentPage = res.currPage
    state.level = level
    state.parentId = parentId
    state.loading = false
  })
}

const skipNext = (id) => {
  if (state.level >= 3) return ElMessage.error('这是最后一级目录')
  ++state.level
  router.push({
    name: `level${state.level}`,
    query: {
      level: state.level,
      parent_id: id,
    }
  })
}

const add = () => {
  addCategory.value.open()
}

const changeGoods = (id) => {
  state.type = 'modify'
  addCategory.value.open(id)
}

const goodDelete = (id) => {
  axios.delete('/categories', {
    data: {
      ids: [id]
    }
  }).then(() => {
    ElMessage.success('删除成功')
    getDate()
  })
}

const goodsDelete = () => {
  if (TableRef.value.getSelectionRows().length === 0  ) return  ElMessage.error('请选择商品')
  axios.delete('/categories', {
    data: {
      ids: TableRef.value.getSelectionRows().map(i => i.categoryId)
    }
  }).then(() => {
    ElMessage.success('删除成功')
    getDate()
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

.el-pagination {
  margin-top: 20px;
}


</style>