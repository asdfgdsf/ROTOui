import request from '@/utils/request'

// 查询商家信息列表
export function listBussinessInfo(query) {
  return request({
    url: '/system/bussinessInfo/list',
    method: 'get',
    params: query
  })
}

// 查询商家信息详细
export function getBussinessInfo(businessId) {
  return request({
    url: '/system/bussinessInfo/' + businessId,
    method: 'get'
  })
}

// 新增商家信息
export function addBussinessInfo(data) {
  return request({
    url: '/system/bussinessInfo',
    method: 'post',
    data: data
  })
}

// 修改商家信息
export function updateBussinessInfo(data) {
  return request({
    url: '/system/bussinessInfo',
    method: 'put',
    data: data
  })
}

// 删除商家信息
export function delBussinessInfo(businessId) {
  return request({
    url: '/system/bussinessInfo/' + businessId,
    method: 'delete'
  })
}
