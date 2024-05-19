import request from '@/utils/request'

// 查询预约跟拍商品列表
export function listShotGoods(query) {
  return request({
    url: '/system/shotGoods/list',
    method: 'get',
    params: query
  })
}

// 查询预约跟拍商品详细
export function getShotGoods(shotId) {
  return request({
    url: '/system/shotGoods/' + shotId,
    method: 'get'
  })
}

// 新增预约跟拍商品
export function addShotGoods(data) {
  return request({
    url: '/system/shotGoods',
    method: 'post',
    data: data
  })
}

// 修改预约跟拍商品
export function updateShotGoods(data) {
  return request({
    url: '/system/shotGoods',
    method: 'put',
    data: data
  })
}

// 删除预约跟拍商品
export function delShotGoods(shotId) {
  return request({
    url: '/system/shotGoods/' + shotId,
    method: 'delete'
  })
}
// 查询跟拍产品商家列表
export function listBusiness(query) {
  return request({
    url: '/system/business/list',
    method: 'get',
    params: query
  })
}
// 查询跟拍套餐列表
export function listPackage(query) {
  return request({
    url: '/product/package/list',
    method: 'get',
    params: query
  })
}
// 新增跟拍订单
export function addShotOrder(data) {
  return request({
    url: '/system/shotOrder',
    method: 'post',
    data: data
  })
}
