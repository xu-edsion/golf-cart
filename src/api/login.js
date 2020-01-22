import request from '@/utils/request'

export function login(userName, userPwd) {
  return request({
    url: '/account/login',
    method: 'get',
    params: {
      userName,
      userPwd
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
