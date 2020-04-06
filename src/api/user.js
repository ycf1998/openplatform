import request from '@/utils/request'

/**
 * 获取个人资料
 */
export function getProfile() {
    return request({
        url: '/user/profile',
        method: 'get'
    })
}

/**
 * 获取开发者资质
 */
export function getDevProfile(type) {
    return request({
        url: '/user/devProfile/' + type,
        method: 'get'
    })
}

/**
 *  更新个人资料
 * @param {Object} user 
 */
export function updateProfile(user) {
    return request({
        url: '/user/profile',
        method: 'put',
        data: user
    })
}

/**
 * 修改密码
 */
export function updatePwd(data) {
    return request({
        url: '/user/updatePwd',
        method: 'put',
        data: data
    })
}

/**
 * 修改邮箱
 */
export function updateEmail(email, password) {
    return request({
        url: '/user/updateEmail',
        method: 'put',
        params: {
            email,
            password
        }
    })
}