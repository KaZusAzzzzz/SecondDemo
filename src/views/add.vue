<template>
  <card>
    <template #main>
      <el-form ref='formRef' :model="state.Form" label-width="100px" :rules="FormRules">
        <el-form-item label="商品分类">
          <el-cascader
              :placeholder="state.defaultCate"
              :props="state.options"
          />
        </el-form-item>

        <el-form-item label="商品名称" prop="name">
          <el-input v-model="state.Form.name" style="width: 280px" placeholder="请输入商品名称"/>
        </el-form-item>

        <el-form-item label="商品简介">
          <el-input v-model="state.Form.intro" type="textarea" maxlength="100"
                    style="width: 280px" placeholder="请输入商品简介(100字)"/>
        </el-form-item>

        <el-form-item label="商品价格" prop="originPrice">
          <el-input
              v-model="state.Form.originPrice"
              :min="0" style="width: 280px"
              placeholder="请输入商品价格"
              size="small"
              controls-position="right"
          />
        </el-form-item>

        <el-form-item label="商品售价" prop="sellingPrice">
          <el-input
              v-model="state.Form.sellingPrice"
              :min="0" style="width: 280px"
              placeholder="请输入商品售价"
              size="small"
              controls-position="right"
          />
        </el-form-item>

        <el-form-item label="商品库存">
          <el-input
              v-model="state.Form.stockNum"
              :min="0" style="width: 280px"
              placeholder="请输入商品库存"
              size="small"
              controls-position="right"
          />
        </el-form-item>

        <el-form-item label="商品标签">
          <el-input v-model="state.Form.tag"
                    style="width: 280px" placeholder="请输入商品标签"/>
        </el-form-item>

        <el-form-item label="商品状态">
          <el-radio-group v-model="state.Form.goodsSellStatus" fill="#49a9ad">
            <el-radio label="上架"/>
            <el-radio label="下架"/>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="商品主图">
          <el-upload
              ref="imgSet"
              :action="state.uploadImgServer" list-type="picture-card"
              :class="state.Form.goodsCoverImg? 'disable':''"
              accept="jpg,jpeg,png" :headers="{token : state.token}"
              :before-upload="handleBeforeUpload"
              :on-success="handleUrlSuccess" :on-error="handleError"
              :on-remove="remove" :on-preview="handlePictureCardPreview">
            <el-icon>
              <Plus/>
            </el-icon>
          </el-upload>
          <el-dialog v-model="state.dialogVisibleImg">
            <img :src="state.url" alt="Preview Image"/>
          </el-dialog>
        </el-form-item>

        <el-form-item label="详细介绍" class="textEditor">
          <my-editor :id="id"></my-editor>
        </el-form-item>

        <el-form-item>
          <el-button type="default" @click="onSubmit" color="#49a9ad">{{ state.id ? '立即修改' : '立即创建' }}
          </el-button>
        </el-form-item>
      </el-form>
    </template>
  </card>
</template>

<script setup lang="ts">
import MyEditor from "../components/MyEditor.vue";
import Card from "@/components/card.vue";
import {ref, reactive, getCurrentInstance, onMounted} from 'vue'
import {Plus} from '@element-plus/icons-vue'
import {localGet, uploadImgServer} from "@/utils/index.js";
import {ElMessage, UploadProps} from "element-plus";
import {useRoute, useRouter} from "vue-router";
import type {FormInstance, FormRules} from "element-plus";
import axios from "@/utils/axios.js";

const formRef = ref<FormInstance>()
const route = useRoute()
const router = useRouter()
const name = 'add_good'
const {id} = route.query
const {proxy} = getCurrentInstance()

const state = reactive({
  uploadImgServer,
  token: localGet('token') || '',
  dialogVisibleImg: false,
  url: '',
  imgVision: false,
  id: id,
  defaultCate: '', //默认分类项
  Form: {
    name: '',
    intro: '',
    originPrice: '',
    sellingPrice: '',
    stockNum: '',
    goodsSellStatus: '0',
    goodsCoverImg: '',
    tag: '',
    goodsDetail:'',

  },
  categoryId: '', // 分类 id
  options: {
    lazy: true,
    expandTrigger: 'hover',
    lazyLoad(node, resolve) {
      const {level = 0, value} = node
      axios.get('categories', {
        params: {
          pageNumber: 1,
          pageSize: 1000,
          categoryLevel: level + 1,
          parentId: value || 0
        }
      }).then((res) => {
        const list = res.list
        const nodes = list.map(item => ({
          value: item.categoryId,
          label: item.categoryName,
          leaf: level > 1
        }))
        resolve(nodes)
      })
    },
  }
})
const FormRules = reactive<FormRules>({
      name: [
        {required: true, message: '请填写商品名称', trigger: ['change']}
      ],
  originPrice: [
        {required: true, message: '请填写商品价格', trigger: ['change']}
      ],
  sellingPrice: [
        {required: true, message: '请填写商品售价', trigger: ['change']}
      ],
      stockNum: [
        {required: true, message: '请填写商品库存', trigger: ['change']}
      ],
    })

//对上传文件进行检验
const handleBeforeUpload = (file) => {
  const sufix = file.name.split('.')[1] || ''
  if (!['jpg', 'jpeg', 'png'].includes(sufix)) {
    ElMessage.error('请上传 jpg、jpeg、png 格式的图片')
    return false
  }
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  state.url = uploadFile.url!
  state.dialogVisibleImg = true
}

const handleUrlSuccess = (val) => {
  state.Form.goodsCoverImg = val.data || ''
  state.imgVision = true
  ElMessage.success('上传成功')
}

const remove = () => {
  state.imgVision = false
}

const handleError = (err) => {
  console.log(err)
  ElMessage.error('上传失败，请稍后再试')
}

onMounted(() => {
  if (id) {
    axios.get(`/goods/${id}`).then(res => {
      console.log(res)
      const { goods, firstCategory, secondCategory, thirdCategory } = res
      state.Form = {
        name: goods.goodsName,
        intro: goods.goodsIntro,
        originPrice: goods.originalPrice,
        sellingPrice: goods.sellingPrice,
        stockNum: goods.stockNum,
        goodsSellStatus: String(goods.goodsSellStatus),
        goodsCoverImg: proxy.$filters.prefix(goods.goodsCoverImg),
        tag: goods.tag,
        goodsDetail :goods.goodsDetailContent
      }
      state.categoryId = goods.goodsCategoryId
      state.defaultCate = `${firstCategory.categoryName}/${secondCategory.categoryName}/${thirdCategory.categoryName}`
      console.log(state.Form.goodsCoverImg)

    })
  }
})

const onSubmit = () => {
  formRef.value.validate((isValid) => {
    if (isValid) {
      let httpOption = axios.post
      let params = {
        goodsCategoryId: state.categoryId,
        goodsCoverImg: state.Form.goodsCoverImg,
        goodsDetailContent: state.Form,
        goodsIntro: state.Form.intro,
        goodsName: state.Form.name,
        goodsSellStatus: state.Form.goodsSellStatus,
        originalPrice: state.Form.originPrice,
        sellingPrice: state.Form.sellingPrice,
        stockNum: state.Form.stockNum,
        tag: state.Form.tag
      }
      if (id) {
        params.goodsId = id
        httpOption=axios.put
      }
      httpOption('/goods',params).then(() => {
        ElMessage.success(id ? '修改成功' : '添加成功')
        router.push({ path: '/good' })
      })
    }
  })
}
</script>

<style scoped lang="less">

.el-form-item {
  :deep(.el-upload--picture-card) {
    width: 100px;
  }
}

:deep(.el-input__inner) {
  width: 120px;
}

:deep(.el-form-item ) {
  margin-bottom: 15px;
  //调整颜色checkbox颜色
  .el-radio__input.is-checked + .el-radio__label {
    color: #49a9ad !important;
  }

  .el-radio__input.is-checked .el-radio__inner {
    background: #49a9ad !important;
    border-color: #49a9ad !important;
  }

  .el-button span {
    color: #fff;
  }
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.textEditor {
  text-align: left;
}

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
