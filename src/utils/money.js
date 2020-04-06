/** money相关js */

export function getTypeName(type, updateTime) {
    const uodate = updateTime ? "升级" : "";
    switch(type) {
        case 1: return uodate + "个人类型";break;
        case 2: return "公司类型";break;
    }
}