import request from '@/utils/request'

// 查询租赁产品列表
export function listLeaseProduct(query) {
  return request({
    url: '/system/leaseProduct/list',
    method: 'get',
    params: query
  })
}

// 查询租赁产品详细
export function getLeaseProduct(leaseId) {
  return request({
    url: '/system/leaseProduct/' + leaseId,
    method: 'get'
  })
}

// 新增租赁产品
export function addLeaseProduct(data) {
  return request({
    url: '/system/leaseProduct',
    method: 'post',
    data: data
  })
}

// 修改租赁产品
export function updateLeaseProduct(data) {
  return request({
    url: '/system/leaseProduct',
    method: 'put',
    data: data
  })
}

// 删除租赁产品
export function delLeaseProduct(leaseId) {
  return request({
    url: '/system/leaseProduct/' + leaseId,
    method: 'delete'
  })
}
