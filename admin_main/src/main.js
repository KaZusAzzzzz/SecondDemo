import {createApp} from 'vue'
import './style.css'
import router from "./router/index.js";
import VueCookies from  'vue-cookies'
import 'element-plus/theme-chalk/src/index.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'

const app = createApp(App)

app.config.globalProperties.$filters = {
    prefix(url) {
        if (url && url.startsWith('http')) {
            // 当 url 以 http 开头时候，我们返回原路径
            return url
        } else {
            // 否则，我们给路径添加 host，如下
            url = `http://backend-api-02.newbee.ltd${url}`
            return url
        }
    }
}

app.config.globalProperties.goTop = function () {
    const main = document.querySelector('.main')
    document.body.scrollTop = 0
}

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(VueCookies,{expires:'7d'})
app.mount('#app')
