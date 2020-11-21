import request from '@/utils/request'

/**
 * 获得应用分类
 */
export function categoryTreeList() {
    return request({
        url: '/categoryTreeList',
        method: 'get'
    });
}

/**
 * 申请上架应用
 * @param {FormData} data 
 */
export function applyApp(data) {
    return request({
        url: '/app',
        method: 'post',
        data: data,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}