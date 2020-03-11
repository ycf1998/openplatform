import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/sso/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/sso/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/sso/logout',
    method: 'post'
  })
}
