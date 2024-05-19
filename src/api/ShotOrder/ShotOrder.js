import request from '@/utils/request'

// 查询跟拍订单列表
export function listShotOrder(query) {
  return request({
    url: '/system/shotOrder/list',
    method: 'get',
    params: query
  })
}

// 查询跟拍订单详细
export function getShotOrder(shotOrderId) {
  return request({
    url: '/system/shotOrder/' + shotOrderId,
    method: 'get'
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

// 修改跟拍订单
export function updateShotOrder(data) {
  return request({
    url: '/system/shotOrder',
    method: 'put',
    data: data
  })
}

// 删除跟拍订单
export function delShotOrder(shotOrderId) {
  return request({
    url: '/system/shotOrder/' + shotOrderId,
    method: 'delete'
  })
}
