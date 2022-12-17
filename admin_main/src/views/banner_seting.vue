<template>
  <card>
    <template #main>
      <div class="top">
        <el-button type="primary" @click="handleAdd">
          <slot name="one">
            <el-icon>
              <Plus/>
            </el-icon>
            增加
          </slot>
        </el-button>
        <el-button type="danger" @click="deleteRow">
          <slot name="two">
            <el-icon>
              <DeleteFilled/>
            </el-icon>
            批量删除
          </slot>
        </el-button>
        <dialog-add-banner ref="dialogBanner" :reload="getMessage" :type="state.type"></dialog-add-banner>
      </div>
      <!--表单区-->
      <el-table
          ref="Form"
          v-loading="state.loading"
          :data="state.tableList"
          style="width: 100%"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column label="轮播图" width="160" :show-overflow-tooltip=false>
          <template #default={row}>
            <el-image style="width: 100px; height: 100px" :src='row.carouselUrl' :fit="'contain'"/>
          </template>
        </el-table-column>
        <el-table-column property="redirectUrl" label="跳转链接"/>
        <el-table-column property="carouselRank" label="排序值" />
        <el-table-column property="updateTime" label="添加时间" />
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

<script setup lang="ts">
import {onMounted, reactive, ref,watch} from 'vue'
import {ElMessage, ElTable,} from 'element-plus'
import type {UploadInstance,} from 'element-plus'
import axios from "@/utils/axios.js";
import DialogAddBanner from "@/components/DialogAddBanner.vue";

const upload = ref<UploadInstance>()
const Form = ref(null)
const dialogBanner = ref(null)
const state = reactive({
  loading: false,
  tableList: [],
  currentPage: 1,
  pageSize: 10,
  type:'add',
  selectArray:[],
  total:0
})

//请求数据
onMounted(() => {
  getMessage()
})
const getMessage = async () => {
  state.loading = true
  await axios.get('/carousels', {
    params: {
      pageNumber: state.currentPage,
      pageSize: state.pageSize
    }
  }).then((res) => {
    state.tableList = res.list
    state.total = res.totalCount
    state.loading = false
    state.currentPage = res.currPage
  })
}

//增加轮播图
const handleAdd = () => {
   state.type = 'add'
  dialogBanner.value.open() //此为子组件的方法
}

//修改轮播图
const handleEdit = (id) => {
  state.type = 'edit'
  dialogBanner.value.open(id)
}

//选中轮播图
const deleteRow = () => {
  axios.delete('/carousels',{
    data:{
      ids:Form.value.getSelectionRows().map(element => element.carouselId)
    }
  }).then(() => {
    ElMessage.success('删除成功')
    getMessage()
  }).catch(err => {
    console.log(err)
  })
}

watch(() => {
 return  state.currentPage
},(next) => {
  state.currentPage = next
  getMessage()
})
</script>

<script lang="ts">
import Card from "@/components/card.vue";

export default {
  name: "banner_setting",
  components: {Card}
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
  .el-dialog__body{
    padding: 10px 10px;
  }
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
}

.example-pagination-block + .example-pagination-block {
  margin-top: 10px;
}

.example-pagination-block .example-demonstration {
  margin-bottom: 16px;
}

.el-pagination {
  margin-top: 20px;
}

</style>