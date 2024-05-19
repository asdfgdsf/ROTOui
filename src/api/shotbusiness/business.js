import request from '@/utils/request'

// 查询跟拍产品商家列表
export function listBusiness(query) {
  return request({
    url: '/system/business/list',
    method: 'get',
    params: query
  })
}

// 查询跟拍产品商家详细
export function getBusiness(applicableProduct) {
  return request({
    url: '/system/business/' + applicableProduct,
    method: 'get'
  })
}

// 新增跟拍产品商家
export function addBusiness(data) {
  return request({
    url: '/system/business',
    method: 'post',
    data: data
  })
}

// 修改跟拍产品商家
export function updateBusiness(data) {
  return request({
    url: '/system/business',
    method: 'put',
    data: data
  })
}

// 删除跟拍产品商家
export function delBusiness(data) {
  return request({
    url: '/system/business/delete',
    method: 'post',
    data: data
  })
}
