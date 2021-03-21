import axios from 'axios'

export function request (config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })
  // 2.1 请求拦截
  instance.interceptors.request.use(config => {
    // 拦截成功输出
    // console.log(config)
    return config
  }, err => {
    // 拦截失败输出
    console.log(err)
  })

  // 2.2 响应拦截
  instance.interceptors.response.use(res => {
    console.log(res)
    return res.data
  }, err => {
    console.log(err)
  })
  // 3.发送真正的网络请求
  return instance(config)
}
