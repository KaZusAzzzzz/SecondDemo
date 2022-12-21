import axios from "axios";
import router from "@/router/index.js";
import config from "@/config";
import {ElMessage} from "element-plus";
import {localGet} from "@/utils/index.js";

// 本项目由于后端没有区分测试和正式，姑且都写成一个接口。
//axios.defaults.baseURL = config[import.meta.env.MODE].baseUrl // config[import.meta.env.MODE] 获取对应模式下的配置对象
axios.defaults.baseURL = config[import.meta.env.MODE].baseUrl
// 携带 cookie，对目前的项目没有什么作用，因为我们是 token 鉴权
axios.defaults.withCredentials = true

// 请求头，headers 信息
//可以用来判断客户端的请求是Ajax请求还是其他请求,若 req.headers['x-requested-with'].toLowerCase() == 'xmlhttprequest' 则为ajax请求。
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'

//将token放到请求头中
axios.defaults.headers['token'] = localGet('token') || ''

// 默认 post 请求，使用 application/json 形式,它用来告诉服务端消息主体是序列化后的 JSON 字符串
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 请求拦截器，内部根据返回值，重新组装，统一管理。
axios.interceptors.response.use(res => {
    if (typeof res.data !== 'object') {
        ElMessage.error('服务端异常')
        return Promise.reject(res)
    }
    if (res.data.resultCode !== 200) {
        if (res.data.message) ElMessage.error(res.data.message);
        if (res.data.resultCode === 419) router.push('/login')
        return Promise.reject(res.data)
    }
    return res.data.data
})

export default axios
