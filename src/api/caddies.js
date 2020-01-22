import request from '@/utils/request'
import Qs from 'qs'
export function getCaddiesInfo() {
  return request({
    url: 'ballcar/selectbatboy',
    method: 'post'
  })
}
export function addCaddie(boynumber, boyname, boyphone) {
  const datas = JSON.stringify({
    boynumber, boyname, boyphone
  })
  const data = JSON.parse(datas)
  return request({
    url: 'ballcar/insertbatboy',
    method: 'post',
    data: data
  })
}
export function delCaddie(id) {
  const data = Qs.stringify({
    id
  })
  return request({
    url: 'ballcar/deletebatboy',
    method: 'post',
    data: data
  })
}
