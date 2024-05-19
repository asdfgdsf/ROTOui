import request from '@/utils/request'

// 查询跟拍套餐列表
export function listPackage(query) {
  return request({
    url: '/product/package/list',
    method: 'get',
    params: query
  })
}

// 查询跟拍套餐详细
export function getPackage(packageId) {
  return request({
    url: '/product/package/' + packageId,
    method: 'get'
  })
}

// 新增跟拍套餐
export function addPackage(data) {
  return request({
    url: '/product/package',
    method: 'post',
    data: data
  })
}

// 修改跟拍套餐
export function updatePackage(data) {
  return request({
    url: '/product/package',
    method: 'put',
    data: data
  })
}

// 删除跟拍套餐
export function delPackage(packageId) {
  return request({
    url: '/product/package/' + packageId,
    method: 'delete'
  })
}
