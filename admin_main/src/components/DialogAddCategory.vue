<template>
  <el-dialog v-model="state.visible" :title="type === 'add'? '添加商品':'修改商品'"
             width="25%">
    <el-form ref="formRef"
             label-position="left" :rules="formRule"
             label-width="100px" :model="state.Form">

      <el-form-item label="商品名称" prop="name">
        <el-input style="width: 200px;" v-model="state.Form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序值" prop="rank">
        <el-input v-model="state.Form.rank"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import type {FormInstance, FormRules} from 'element-plus'
import axios from "@/utils/axios.js";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";

const route= useRoute()
const props = defineProps({
  type: String,
  reload: Function
})
const formRef = ref<FormInstance>()
const formRule = reactive<FormRules>({
  name: [{required: true, message: 'name is empty!', trigger: 'blur'}],
  rank: [{required: true, message: 'rank is empty!', trigger: 'blur'},]
})
const state = reactive({
  visible: false,
  categoryLevel: 1,
  parentId: 0,
  Form: {
    name: '',
    rank: ''
  },
  id:0,
})

const submitForm = () => {
  formRef.value.validate((isValid) => {
    if (isValid) {
      if (props.type === 'add') {
        axios.post('/categories',{
          categoryLevel: state.categoryLevel,
          parentId:state.parentId,
          categoryName:state.Form.name,
          categoryRank: state.Form.rank
        }).then(() => {
          ElMessage.success('添加成功')
          if (props.reload) props.reload()
        })
      } else {
        axios.put('/categories', {
          categoryId: state.id,
          categoryLevel: state.categoryLevel,
          parentId: state.categoryLevel,
          categoryName: state.Form.name,
          categoryRank: state.Form.rank
        }).then(() => {
          ElMessage.success('修改成功')
          state.visible = false
          // 接口回调之后，运行重新获取列表方法 reload
          if (props.reload) props.reload()
        })
      }
    }
  })
}

const getDetail = (id) => {
  axios.get(`/categories/${id}`).then(res => {
    state.Form = {
      name: res.categoryName,
      rank: res.categoryRank
    }
    state.parentId = res.parentId
     state.categoryLevel= res.categoryLevel
  })
}
const open = (id) => {
  state.visible = true
  if (id) {
    state.id = id
    // 如果是有 id 传入，证明是修改模式
    getDetail(id)
  } else {
    // 否则为新增模式
    // 新增类目，从路由获取分类 level 级别和父分类 id
    const { level = 1, parent_id = 0 } = route.query
    state.Form = {
      name: '',
      rank: ''
    }
    state.parentId = parent_id
    state.categoryLevel = level
    console.log('yes')
  }
}
const close = ()  => {
  state.visible = false
}
defineExpose({open})
</script>

<script lang="ts">
export default {
  name: "DialogAddCategory"
}
</script>

<style scoped>

</style>