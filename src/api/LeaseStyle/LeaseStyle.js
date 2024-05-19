import request from '@/utils/request'

// 查询租赁产品款式列表
export function listLeaseStyle(query) {
  return request({
    url: '/system/leaseStyle/list',
    method: 'get',
    params: query
  })
}

// 查询租赁产品款式详细
export function getLeaseStyle(styleId) {
  return request({
    url: '/system/leaseStyle/' + styleId,
    method: 'get'
  })
}

// 新增租赁产品款式
export function addLeaseStyle(data) {
  return request({
    url: '/system/leaseStyle',
    method: 'post',
    data: data
  })
}

// 修改租赁产品款式
export function updateLeaseStyle(data) {
  return request({
    url: '/system/leaseStyle',
    method: 'put',
    data: data
  })
}

// 删除租赁产品款式
export function delLeaseStyle(styleId) {
  return request({
    url: '/system/leaseStyle/' + styleId,
    method: 'delete'
  })
}
