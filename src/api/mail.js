import request from '@/utils/request'

/**
 * 发送验证注册验证邮箱
 * @param {*} username 
 * @param {*} email 
 */
export function verificationMail(username, email) {
    return request({
        url: "/mail/verificationMail?username=" + username + "&email=" + email,
        method: "get"
    })
}

/**
 * 发送重置密码邮箱
 * @param {*} email 
 */
export function resetPasswordMail(email) {
    return request({
        url: "/mail/resetPasswordMail?email=" + email,
        method: "get"
    })
}

/**
 * 发送激活开发者资质邮箱
 * @param {*} email 
 */
export function activeEmailMail(email) {
    return request({
        url: "/mail/activeEmailMail?email=" + email,
        method: "get"
    })
}