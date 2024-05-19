import request from '@/utils/request'

// 查询租赁产品列表
export function listLeaseGoogs(query) {
  return request({
    url: '/system/leaseGoogs/list',
    method: 'get',
    params: query
  })
}

// 查询租赁产品详细
export function getLeaseGoogs(leaseId) {
  return request({
    url: '/system/leaseGoogs/' + leaseId,
    method: 'get'
  })
}

// 新增租赁产品
export function addLeaseGoogs(data) {
  return request({
    url: '/system/leaseGoogs',
    method: 'post',
    data: data
  })
}

// 修改租赁产品
export function updateLeaseGoogs(data) {
  return request({
    url: '/system/leaseGoogs',
    method: 'put',
    data: data
  })
}

// 删除租赁产品
export function delLeaseGoogs(leaseId) {
  return request({
    url: '/system/leaseGoogs/' + leaseId,
    method: 'delete'
  })
}
// 查询租赁产品款式列表
export function listLeaseStyle(query) {
  return request({
    url: '/system/leaseStyle/list',
    method: 'get',
    params: query
  })
}
// 查询租赁商家列表
export function listBusiness(query) {
  return request({
    url: '/system/leaseBusiness/list',
    method: 'get',
    params: query
  })
}
// 新增租赁订单
export function addLeaseOrder(data) {
  return request({
    url: '/system/leaseOrder',
    method: 'post',
    data: data
  })
}
