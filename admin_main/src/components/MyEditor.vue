<template>
  <div>
    <div style="border: 1px solid #ccc; margin-top: 10px;">
      <!-- 工具栏 -->
      <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editor"
          :defaultConfig="toolbarConfig"
      />
      <!-- 编辑器 -->
      <Editor
          style="height: 400px; overflow-y: hidden;"
          :defaultConfig="editorConfig"
          v-model="html"
          @onChange="onChange"
          @onCreated="onCreated"
      />
    </div>
  </div>
</template>

<script>
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import axios from "@/utils/axios.js";

export default {
  name: 'MyEditor',
  components: {Editor, Toolbar},
  props: ['id',],
  data() {
    return {
      editor: null,
      html:'',
      //html: '<p>hello&nbsp;world</p>',
      toolbarConfig: {
        // toolbarKeys: [ /* 显示哪些菜单，如何排序、分组 */ ],
        // excludeKeys: [ /* 隐藏哪些菜单 */ ],
      },
      editorConfig: {
        placeholder: '请输入内容...',
        // autoFocus: false,

        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {}
      }
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 【注意】一定要用 Object.seal() 否则会报错
      if (this.id) {
        axios.get(`/goods/${this.id}`).then(res => {
          const {goods} = res
          this.html= goods.goodsDetailContent
        })
      }
    },
    onChange(editor) {
      console.log('onChange', editor.getHtml()) // onChange 时获取编辑器最新内容
    },
  },
  mounted() {
    // 模拟 ajax 请求，异步渲染编辑器
/*            setTimeout(() => {
                this.html = '<p>Ajax 异步设置内容 HTML</p>'
            }, 1000)*/
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁 editor ，重要！！！
  },
}
</script>

<style src="../../node_modules/@wangeditor/editor/dist/css/style.css"></style>
