<template>
  <div class="header">
    <slot name="button"></slot>
    <div class="backButton">
      <el-button :icon="ArrowLeft" circle v-if="hasBack" @click="routerBack"/>
    </div>
    <h3>{{ props.left || '系统介绍' }}</h3>
    <el-popover
        placement="bottom"
        :width="320"
        trigger="click">
      <template #reference>
        <el-button link class="userMessage">{{ props.nickName }}</el-button>
      </template>
      <div class="box">
        <div class="glass-container" id="glass">
          <div class="mes">
            <h4>登录名:<span>{{ props.loginName }}</span></h4>
            <h4>昵称:<span>{{ props.nickName }}</span></h4>
          </div>
          <el-button type="primary" :size="'small'" @click="logOut">退出登录</el-button>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import {ref,} from 'vue';
import {ArrowLeft} from '@element-plus/icons-vue'
import {useRouter} from "vue-router";

const router = useRouter()
const emit = defineEmits(['logOut'])
const name = "header";
let state = ref(false);
const hasBack = ref(false)
const props = defineProps({
  left: String,
  nickName: String,
  loginName: String,
})
const logOut = () => {
  emit("logOut")
}

router.afterEach(to => {
hasBack.value = ['level2', 'level3','OrderDetail'].includes(to.name);
})

const routerBack = () => {
  router.back()
}
</script>

<style scoped lang="less">
.header {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 0;
  border-bottom: 1px solid #e9e9e9;
  height: 45px;

  .backButton {
    text-align: center;
    line-height: 32px;
    margin-left: 10px;
  }

  h3 {
    margin: 0 0 0 10px;
  }

  .userMessage {
    position: absolute;
    right: 25px;
  }
}

.box {
  position: relative;
  width: 290px;
  height: 120px;
  background: url("@/assets/img1 (1).jpg") no-repeat 0 -10px;
  background-size: cover;
  overflow: hidden;

  .glass-container {
    width: inherit;
    height: inherit;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    backdrop-filter: blur(5px);
    background-color: rgba(0, 191, 255, 0.075);
    box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    border: 2px rgba(255, 255, 255, 0.4) solid;
    border-bottom: 2px rgba(40, 40, 40, 0.35) solid;
    border-right: 2px rgba(40, 40, 40, 0.35) solid;

    .mes {
      margin-right: 25px;
    }
  }
}
</style>