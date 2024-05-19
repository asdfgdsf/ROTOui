import request from '@/utils/request'

// 查询租赁订单列表
export function listLeaseOrder(query) {
  return request({
    url: '/system/leaseOrder/list',
    method: 'get',
    params: query
  })
}

// 查询租赁订单详细
export function getLeaseOrder(leaseOrderId) {
  return request({
    url: '/system/leaseOrder/' + leaseOrderId,
    method: 'get'
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

// 修改租赁订单
export function updateLeaseOrder(data) {
  return request({
    url: '/system/leaseOrder',
    method: 'put',
    data: data
  })
}

// 删除租赁订单
export function delLeaseOrder(leaseOrderId) {
  return request({
    url: '/system/leaseOrder/' + leaseOrderId,
    method: 'delete'
  })
}
