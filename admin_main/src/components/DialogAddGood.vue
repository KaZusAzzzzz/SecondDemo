<template>
  <el-dialog v-model="state.dialogVisible"
             :title="type === 'add' ? '添加新商品':'修改商品'" :width="400">
    <el-form ref="formRef"
             label-position="left" :rules="formRule"
             label-width="100px" :model="state.Form">
      <el-form-item label="商品名称" prop="name">
        <el-input style="width: 200px;" v-model="state.Form.name"></el-input>
      </el-form-item>
      <el-form-item label="跳转链接" prop="link">
        <el-input style="width: 200px;" v-model="state.Form.link"></el-input>
      </el-form-item>
      <el-form-item label="商品编号" prop="id">
        <el-input style="width: 200px;" v-model.number="state.Form.id"></el-input>
      </el-form-item>
      <el-form-item label="排序值" prop="rank">
        <el-input style="width: 200px;" v-model.number="state.Form.rank"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="" @click="state.dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, reactive} from "vue";
import type {FormInstance,FormRules} from 'element-plus'
import axios from "@/utils/axios.js";
import {ElMessage} from "element-plus";

const formRef = ref<FormInstance>(null)
const props = defineProps({
  type: String,
  configType: Number,
  reload: Function
})
const state = reactive({
  id: '',
  dialogVisible: false,
  Form: {
    name: '',
    id:0,
    link: '',
    rank: '',
  },
})

const formRule = reactive<FormRules>({
      name: [{required: true, message: 'name is empty!', trigger: 'blur'}],
      link: [{required: true, message: 'link is empty!', trigger: 'blur'}],
      id: [{required: true, message: 'id is empty!', trigger: 'blur'}],
      rank: [{required: true, message: 'rank is empty!', trigger: 'blur'},]
    })

//打开表单
const open = (id) => {
  state.dialogVisible = true
  if (id) {
    state.id = id
    getData(id)
  } else {
    state.Form = {
      name: '',
      id: 0,
      link: '',
      rank: ''
    }
  }
}

//提交表单
const submitForm = () => {
  formRef.value.validate((isValid) => {
    if (isValid) {
      if (props.type === 'add') {
        axios.post('/indexConfigs',{
          configType: props.configType || 3,
          configName: state.Form.name,
          redirectUrl: state.Form.link,
          goodsId: state.Form.id,
          configRank: state.Form.rank
        }).then(() => {
          state.dialogVisible = false
          ElMessage.success('添加成功')
          if (props.reload) props.reload()
        })
      } else {
        axios.put('/indexConfigs',{
          configId: state.id,
          configType: props.configType || 3,
          configName: state.Form.name,
          redirectUrl: state.Form.link,
          goodsId: state.Form.id,
          configRank: state.Form.rank
        }).then(() => {
          state.dialogVisible = false
          ElMessage.success('修改成功')
          if (props.reload) props.reload()
        })
      }
    }
  })
}

//修改表单时根据id获取数据
const getData = (id) => {
  if (!id) return
  axios.get(`/indexConfigs/${id}`).then(res => {
    state.Form = {
      name: res.configName,
      id: res.goodsId,
      link: res.redirectUrl,
      rank: res.configRank
    }
  }).catch((err) => {
    console.log(err)
  })
}
defineExpose({open})
</script>

<script lang="ts">
export default {
  name: "DialogAddGood.vue"
}
</script>

<style scoped lang="less">

</style>