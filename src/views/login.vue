<template>
  <div class="body">
    <el-card class="box-card">
      <div class="demo-image">
        <div class="top_block">
          <el-image style="width: 100px; height: 100px" :src="url" fit="cover"/>
          <div>
            <h2>亦澄商城</h2>
            <h6>基于Vue3.0的电商管理系统</h6>
          </div>
        </div>
      </div>
      <!--表单区域-->
      <el-form :inline="true" ref="ruleFormRef"
               :rules="rules" @keyup.enter="onSubmit(ruleFormRef)"
               :model="formInline" status-icon
               class="demo-form-inline" label-position="top">

        <el-form-item label="账号" prop="username">
          <el-input v-model="formInline.username"/>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="formInline.password" type="password"/>
        </el-form-item>

        <el-form-item>
          <div class="detail">
            登录表示您已同意<a href="" @click.prevent=""> 《服务条款》</a>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit(ruleFormRef)" size="large">
            登录
          </el-button>
          <el-checkbox label="记住密码" name="type" v-model="formInline.status"/>
        </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref,} from 'vue';
import {useRouter} from "vue-router";

import {ElMessage} from "element-plus";
import type {FormInstance, FormRules} from 'element-plus'
import img from '@/assets/img1 (2).jpg';
import axios from '@/utils/axios.js'
import md5 from 'js-md5';
import {localSet,} from '@/utils/index.js'

const url = img;
const router = useRouter();

const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules>({
      username: [
        {required: true, message: '请输入账号', trigger: 'blur'},
        {min: 3, max: 6, message: 'Length should be 3 to 5', trigger: 'blur'}
      ],
      password: [
        {required: true, message: 'password is empty', trigger: 'blur'},
        {min: 3, max: 6, message: 'Length should be 3 to 5', trigger: 'blur'}
      ]
    }
)
const formInline = reactive({
  username: '',
  password: '',
  status: false,
})

//表单提交方法
const onSubmit = async (forEI: FormInstance | undefined) => {
  if (!forEI) return
  await forEI.validate((valid,) => {
    if (valid) {
      axios.post('/adminUser/login', {
        userName: formInline.username || '',
        passwordMd5: md5(formInline.password)
      }).then(res => {
        localSet('token', res)
        //router.push('/')
        window.location.href = '/'
      })
    } else {
      ElMessage.error('登录失败');
      return false;
    }
  })
}
</script>

<script lang="ts">
export default {
  name: 'login'
}
</script>

<style scoped lang="less">
.body {
  display: flex;
  justify-content: center;
  margin: 100px auto;

  :deep(.box-card) {
    .top_block {
      display: flex;
      justify-content: center;

      h2 {
        font-size: 30px;
        margin: 18px 0 10px;
        color: #49a9ad;
      }

      h6 {
        font-weight: 500;
        margin-top: 0;
        margin-bottom: 0;
      }
    }

    .el-form {
      align-content: space-around;
      justify-content: flex-end;
      flex-direction: column;
      align-items: center;

      .el-form-item {
        margin-bottom: 12px;
      }

      .el-input__wrapper {
        width: 220px;
      }

      .detail {
        line-height: 1;
      }

      .el-form-item__content {
        flex-direction: column;

        .el-input__wrapper.is-focus {
          box-shadow: 0 0 0 1px #49a9ad inset;
        }

        .el-button--primary {
          width: 200px;
          background-color: #49a9ad;
        }

        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: #49a9ad;
        }

        .el-checkbox__label {
          color: #49a9ad;
        }
      }

    }
  }

  :deep(.el-image__inner) {
    border-radius: 50%;
  }

}


.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}
</style>