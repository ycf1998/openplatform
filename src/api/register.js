import request from '@/utils/request'
import checkRequest from '@/utils/checkRequest'

// 商店用户升级 暂时关闭
export function upgrade(username, password) {
    return request({
        url: '/platform/register/login',
        method: 'post',
        data: {
            username,
            password
        }
    })
}
// 个人类型开发者注册
export function personReg(data, isStoreUser) {
    var url = ""
    if (isStoreUser) {
        url = "/platform/register/upgradePersonDev"
    } else {
        url = "/platform/register/person";
    }
    return request({
        url: url,
        method: "post",
        data: data,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}
// 公司类型开发者注册
export function companyReg(data) {
    return request({
        url: "/platform/register/company",
        method: "post",
        data: data,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}
// 检查账号的唯一性
export function checkUsername(username) {
    return checkRequest({
        url: "/platform/checkUsername/" + username,
        method: "get"
    })
}
// 检查邮箱的唯一性
export function checkEmail(email) {
    return checkRequest({
        url: "/platform/checkEmail?email=" + email,
        method: "get"
    })
}
// 修改邮箱
export function changeEmail(username, password, email) {
    return request({
        url: "/platform/changeEmail",
        method: "post",
        data: {
            username,
            password,
            email
        }
    })
}
// 检查是否已经验证邮箱
export function checkVerify(username) {
    return request({
        url: "/platform/checkVerify/" + username,
        method: "get"
    })
}
// 激活开发资质
export function activeDev(token) {
    return request({
        url: "/platform/activeDev/" + token,
        method: "get"
    })
}
// 重置密码
export function resetPasswordByEmail(id, token, newPassword) {
    return request({
        url: "/platform/resetPassword",
        method: "post",
        data: {
            id,
            token,
            newPassword
        }
    })
}