<template>
  <el-dialog
      v-model="state.dialogVisible"
      :title="type === 'add'? '添加轮播图':'修改轮播图'" width="30%"
      :before-close="handleClose"
  >
    <el-form
        ref="formRef"
        :label-position="'left'"
        label-width="100px"
        :model="state.Form"
        :rules="state.rules"
        style="max-width: 460px"
    >
      <el-form-item label="图片" prop="url">
        <el-upload
            ref="imgSet"
            :action="state.uploadImgServer" list-type="picture-card"
            :class="Disable? 'disable':''"
            accept="jpg,jpeg,png" :headers="{token : state.token}"
            :before-upload="handleBeforeUpload"
            :on-success="handleUrlSuccess" :on-error="handleError"
            :on-remove="remove" :on-preview="handlePictureCardPreview">
          <el-icon>
            <Plus/>
          </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisibleImg">
          <img :src="dialogImageUrl" alt="Preview Image"/>
        </el-dialog>
      </el-form-item>

      <el-form-item label="跳转链接" prop="link">
        <el-input v-model="state.Form.link"/>
      </el-form-item>

      <el-form-item label="排序值" prop="sort">
        <el-input v-model="state.Form.sort"/>
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {localGet, uploadImgServer} from '@/utils/index.js'
import axios from "@/utils/axios.js";
import {ElMessage, ElMessageBox, UploadProps} from "element-plus";

const imgSet = ref(null)
const dialogImageUrl = ref('')
const dialogVisibleImg = ref(false)
const Disable = ref(false)
//formRef用于表单控制
const formRef = ref(null)

const props = defineProps({
  type: String,
  reload: Function
})

const state = reactive({
  id: '',
  dialogVisible: false,
  token: localGet('token') || '',
  uploadImgServer,
  Form: {
    url: '',
    link: '',
    sort: ''
  },
  rules: {
    url: [{required: true, message: 'img is empty!', trigger: 'change'}],
    sort: [{required: true, message: 'sort is empty !', trigger: 'blur'}]
  },
})

const remove = () => {
  Disable.value = false
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisibleImg.value = true
}

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确认关闭表格？', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
      .then(() => {
        done()
        reset()
      })
      .catch((err) => {
        console.log(err)
      })
}

// 获得详情
const getDate = (id) => {
  axios.get(`/carousels/${id}`).then(res => {
    state.Form = {
      url: res.carouselUrl,
      link: res.carouselUrl,
      sort: res.carouselRank
    }
  })
}

//对上传文件进行检验
const handleBeforeUpload = (file) => {
  const sufix = file.name.split('.')[1] || ''
  if (!['jpg', 'jpeg', 'png'].includes(sufix)) {
    ElMessage.error('请上传 jpg、jpeg、png 格式的图片')
    return false
  }
}

//上传图片
const handleUrlSuccess = (val) => {
  state.Form.url = val.data || ''
  Disable.value = true
  ElMessage.success('上传成功')
}

//开启弹窗，此方法将在父组件，通过 ref 直接调用
const open = (id) => {
  state.dialogVisible = true
  //如果带着id，则是编辑，否则为新增
  if (id) {
    state.id = id
    getDate(id)
  } else {
    state.Form = {
      url: '',
      link: '',
      sort: ''
    }
  }
}

//关闭弹窗
const close = () => {
  state.dialogVisible = false
}

//提交表单方法
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (props.type === 'add') {
        //增加数据
        axios.post('/carousels', {
          carouselUrl: state.Form.url,
          redirectUrl: state.Form.link,
          carouselRank: state.Form.sort
        }).then(() => {
          ElMessage.success('添加成功')
          reset()
          if (props.reload) {
            props.reload()
          }
        })
      } else {
        //修改数据
        axios.put('/carousels', {
          carouselId: state.id,
          carouselUrl: state.Form.url,
          redirectUrl: state.Form.link,
          carouselRank: state.Form.sort
        }).then(() => {
          ElMessage.success('修改成功')
          state.dialogVisible = false
          if (props.reload) props.reload()
        })
      }
    }
  })
}

defineExpose({open, close})

//重置表单
const reset = () => {
  state.Form.sort = ''
  state.Form.url = ''
  state.Form.link = ''
  imgSet.value.clearFiles()
  Disable.value = false
}

const handleError = (err) => {
  console.log(err)
  ElMessage.error('上传失败，请稍后再试')
  reset()
}
</script>

<script lang="ts">
export default {
  name: "DialogAddBanner"
}
</script>

<style scoped lang="less">


.disable {
  :deep( .el-upload--picture-card) {
    display: none;
  }
}

:deep(.el-dialog) {
  .el-dialog__body {
    display: flex;
    justify-content: center;

    img {
      width: 96%;
    }
  }
}

</style>