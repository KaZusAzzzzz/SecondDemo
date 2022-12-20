//用于封装一些公共方法

//获取localStorage中的数据
export function localGet(key) {
    const value = window.localStorage.getItem(key)
    try {
        return JSON.parse(window.localStorage.getItem(key))
    } catch (error) {
        return value
    }
}

export function localSet(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
}

export function localRemove(key) {
    window.localStorage.removeItem(key)
}

//banner图上传
export const uploadImgServer = 'http://backend-api-02.newbee.ltd/manage-api/v1/upload/file'
