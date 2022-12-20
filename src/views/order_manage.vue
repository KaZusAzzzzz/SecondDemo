<template>
  <card>
    <template #main>
      <div class="top">
        <el-input style="width:150px;height: 30px;" placeholder="请输入订单号"/>
        <el-select class="m-2" v-model="state.orderStatus"
                   placeholder="状态选择" @change="handleOption">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-button type="primary"  @click="handleConfig(null)">
          <el-icon>
            <Check/>
          </el-icon>
          配货完成
        </el-button>
        <el-button type="primary" @click="handleSend(null)">
          <el-icon>
            <House/>
          </el-icon>
          出库
        </el-button>
        <el-button type="danger" @click="handleClose(null)">
          <Delete style="width: 1em; height: 1em; margin-right: 8px"/>
          关闭订单
        </el-button>
      </div>

      <el-table ref="tableRef" v-loading="state.loading" @selection-change="getSelection"
                :data="state.tableData">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="订单号" property="orderNo" width="200"></el-table-column>
        <el-table-column label="订单总价" property="totalPrice"></el-table-column>
        <el-table-column label="支付方式">
          <template #default="{row}">
            <h4 v-if="row.payType===1">微信支付</h4>
            <h4 v-else-if="row.payType===2">支付宝</h4>
            <h4 v-else>未知</h4>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" property="updateTime"></el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
            <el-popconfirm v-if="!(row.orderStatus === 4 || row.orderStatus < 0)"
                           title="确定关闭订单吗" @confirm="handleClose(row.orderId)"
                           confirm-button-text="确定" cancel-button-text="取消">
              <template #reference>
                <el-button type="primary" link >
                  关闭订单
                </el-button>
              </template>
            </el-popconfirm>
            <el-button type="primary" link @click="skip(row.orderId)">
              订单详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="example-pagination-block">
        <el-pagination background layout="prev, pager, next" :page-size="state.pageSize"
                       :total="state.total" v-model:current-page="state.currentPage">

        </el-pagination>
      </div>
    </template>
  </card>
</template>

<script lang="ts">
export default {
  name: "order_manage"
}
</script>

<script setup lang="ts">
import Card from "@/components/card.vue";
import {ref, reactive, onMounted, watch} from 'vue'
import {House, Check, Delete} from '@element-plus/icons-vue'
import  {ElTable} from "element-plus";
import axios from "@/utils/axios.js";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";

const router = useRouter()
const value = ref('')
const tableRef = ref<InstanceType<typeof ElTable>>()

const state = reactive({
  loading: false,
  tableData: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  orderNo: '',
  orderStatus: '',
  multipleSelection: []
})
const options = [
  {
    value: '',
    label: '全部',
  },
  {
    value: '1',
    label: '待支付',
  },
  {
    value: '2',
    label: '配货完成',
  },
  {
    value: '3',
    label: '出货成功',
  },
  {
    value: '4',
    label: '交易成功',
  },
  {
    value: '-1',
    label: '手动关闭',
  },
  {
    value: '-2',
    label: '超时关闭',
  },
  {
    value: '-3',
    label: '商家关闭',
  },
]

onMounted(() => {
  getOderList()
})

const getOderList = () => {
  state.loading = true
  axios.get('/orders', {
    params: {
      pageNumber: state.currentPage,
      pageSize: state.pageSize,
      orderNo: state.orderNo,
      orderStatus: state.orderStatus
    }
  }).then(res => {
    console.log(res)
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
  getOderList()
})

const skip = (id) => {
  router.push({path: '/order/OrderDetail', query: {id: id}})
}

const handleOption = () => {
  state.currentPage = 1
  getOderList()
}

const getSelection = () => {
  state.multipleSelection = tableRef.value.getSelectionRows().map(item => item.orderId)
}

const handleConfig = (id) => {
  let params
  if (id) {
    params = [id]
  } else {
    if (!state.multipleSelection.length) {
      ElMessage.error('请选择项')
      return
    }
    //多项操作
    params = state.multipleSelection
  }
  axios.put('/orders/checkDone', {
    ids: params
  }).then(() => {
    ElMessage.success('配货成功')
    getOderList()
  })
}

const handleSend = (id) => {
  let params
  if (id) {
    params = [id]
  } else {
    if (!state.multipleSelection.length) {
      ElMessage.error('请选择项')
      return
    }
    params = state.multipleSelection
  }
  axios.put('/orders/checkOut', {
    ids: params
  }).then(() => {
    ElMessage.success('出库成功')
    getOderList()
  })
}

// 关闭订单方法
const handleClose = (id) => {
  let params
  if (id) {
    params = [id]
  } else {
    if (!state.multipleSelection.length) {
      ElMessage.error('请选择项')
      return
    }
    params = state.multipleSelection
  }
  axios.put('/orders/close', {
    ids: params
  }).then(() => {
    ElMessage.success('关闭成功')
    getOderList()
  })
}
</script>


<style scoped lang="less">
.top {
  display: flex;
  position: relative;
  height: 45px;
  left: -15px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e9e9e9;

  .el-input {
    margin: 0 15px;
  }

  .el-select {
    margin-right: 10px;
  }

  .el-icon {
    margin-right: 5px;
  }
}

h4 {
  margin: 0;
  font-weight: 500;
}

.el-pagination {
  margin-top: 20px;
}
</style>