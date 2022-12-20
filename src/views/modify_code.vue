<template>
  <card>
    <template #main>
      <el-form
          ref="formName"
          :model="state.formLabelName"
          :rules="state.rules"
          :label-position="'right'"
          label-width="100px"
          style="max-width: 460px"
      >
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="state.formLabelName.loginName" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName
">
          <el-input v-model="state.formLabelName.nickName" style="width: 200px;"/>
        </el-form-item>
        <el-button type="danger" @click="submitName">确认修改</el-button>
      </el-form>
    </template>
  </card>
  <card>
    <template #main>
      <el-form
          ref="formPass"
          :model="state.formLabelPass"
          :rules="state.rules"
          :label-position="'right'"
          label-width="100px"
          style="max-width: 460px"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input v-model="state.formLabelPass.oldPass" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input v-model="state.formLabelPass.newPass" style="width: 200px;"/>
        </el-form-item>
        <el-button type="danger" @click="submitPass">确认修改</el-button>
      </el-form>
    </template>
  </card>
</template>

<script>
export default {
  name: "modify_code"
}
</script>
<script setup>
import {ref, reactive, onMounted} from 'vue'
import Card from "@/components/card.vue";
import axios from "@/utils/axios.js";
import {ElMessage} from "element-plus";
import md5 from 'js-md5'


const formName = ref()
const formPass = ref()
const state = reactive({
  formLabelName: {
    loginName: '',
    nickName: '',
  },
  formLabelPass: {
    oldPass: '',
    newPass: '',
  },
  rules: {
    loginName: [
      {required: 'true', message: '登录名不能为空', trigger: ['change']}
    ],
    nickName: [
      {required: 'true', message: '昵称不能为空', trigger: ['change']}
    ],
    oldPass: [
      {required: 'true', message: '原密码不能为空', trigger: ['change']}
    ],
    newPass: [
      {required: 'true', message: '新密码不能为空', trigger: ['change']}
    ]
  },
})
onMounted(() => {
  // 获取用户信息
  axios.get('/adminUser/profile').then(res => {
    state.user = res
    state.formLabelName.loginName = res.loginUserName
    state.formLabelName.nickName = res.nickName
  })
})

const submitName = () => {
  formName.value.validate((value) => {
    if (value) {
      axios.put('/adminUser/name', {
        loginUserName: state.formLabelName.loginName,
        nickName: state.formLabelName.nickName
      }).then(() => {
        ElMessage.success('修改成功')
        window.location.reload()
      })
    }
  })
}

const submitPass = () => {
  formPass.value.validate((value) => {
    if (value) {
      console.log('yes')
      axios.put('/adminUser/password', {
        originalPassword: md5(state.formLabelPass.oldpass),
        newPassword: md5(state.formLabelPass.newpass)
      }).then(() => {
        ElMessage.success('修改成功')
        //window.location.reload()
      })
    }
  })
}
</script>
<style scoped lang="less">
.box-card {
  height: 150px;
  width: 1200px;
  margin: 10px 0 30px 20px;
}

.el-button {
  margin-bottom: 10px;
  margin-right: 70px;
}
</style>