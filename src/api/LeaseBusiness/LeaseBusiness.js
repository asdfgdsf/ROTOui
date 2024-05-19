import request from '@/utils/request'

// 查询租赁商家列表
export function listBusiness(query) {
  return request({
    url: '/system/leaseBusiness/list',
    method: 'get',
    params: query
  })
}

// 查询租赁商家详细
export function getBusiness(applicableProduct) {
  return request({
    url: '/system/leaseBusiness/' + applicableProduct,
    method: 'get'
  })
}

// 新增租赁商家
export function addBusiness(data) {
  return request({
    url: '/system/leaseBusiness',
    method: 'post',
    data: data
  })
}

// 修改租赁商家
export function updateBusiness(data) {
  return request({
    url: '/system/leaseBusiness',
    method: 'put',
    data: data
  })
}

// 删除租赁商家
export function delBusiness(data) {
  return request({
    url: '/system/leaseBusiness/delete',
    method: 'post',
    data: data
  })
}
