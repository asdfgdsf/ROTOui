import request from '@/utils/request'

// 查询预约跟拍产品列表
export function listProduct(query) {
  return request({
    url: '/ruoyi-product/product/list',
    method: 'get',
    params: query
  })
}

// 查询预约跟拍产品详细
export function getProduct(id) {
  return request({
    url: '/ruoyi-product/product/' + id,
    method: 'get'
  })
}

// 新增预约跟拍产品
export function addProduct(data) {
  return request({
    url: '/ruoyi-product/product',
    method: 'post',
    data: data
  })
}

// 修改预约跟拍产品
export function updateProduct(data) {
  return request({
    url: '/ruoyi-product/product',
    method: 'put',
    data: data
  })
}

// 删除预约跟拍产品
export function delProduct(id) {
  return request({
    url: '/ruoyi-product/product/' + id,
    method: 'delete'
  })
}

export function upload(query){
  return request({
    url:'/common/upload',
    method:'post',
    data: query,
  })
}
