import request from '@/utils/request'
import Qs from 'qs'
export function getCartInfo() {
  return request({
    url: 'cart',
    method: 'get'
  })
}
export function changePrice(member, guest, courtId, price, hotSpringId) {
  const datas = Qs.stringify({
    member,
    guest,
    courtId,
    price,
    hotSpringId
  })
  return request({
    url: '/manage/newAdd/updatePrice',
    method: 'post',
    data: datas
  })
}
export function getCartList() {
  return request({
    url: 'ballcar/getballcarinfo',
    method: 'post'
  })
}
export function uploadPicture(file) {
  var formData = new FormData()
  formData.append('file', file)
  return request({
    url: 'ballcar/uploadpicture',
    method: 'post',
    data: formData
  })
}
export function addCart(pictrue, carmodel, peoplenumber, carinfo, carnumber) {
  const datas = JSON.stringify({
    pictrue, carmodel, peoplenumber, carinfo, carnumber
  })
  const data = JSON.parse(datas)
  return request({
    url: 'ballcar/insertballcarinfo',
    method: 'post',
    data: data
  })
}
export function delBallCart(id) {
  const data = Qs.stringify({
    id
  })
  return request({
    url: 'ballcar/deleteballcarinfo',
    method: 'post',
    data: data
  })
}
export function getOrder() {
  return request({
    url: 'ballcar/getOrderinfo',
    method: 'post'
  })
}
export function dueCar(orderNo, carid, batboyid, stuta) {
  const data = Qs.stringify({
    orderNo, carid, batboyid, stuta
  })
  return request({
    url: 'ballcar/departcar',
    method: 'post',
    data: data
  })
}
