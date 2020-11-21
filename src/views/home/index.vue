<template>
    <div class="components-container">
        <h3>其他项目（<el-link type="primary" href="http://118.31.77.63:8081/" target="_blank">主入口</el-link>）</h3>
        <el-link type="primary" href="http://118.31.77.63:8081/AppManageSystem/appStorePage/welcome" target="_blank">完整版App应用商店及其开放平台</el-link>
        <span style="margin-left: 10px;"></span>
        <el-link type="primary" href="http://118.31.77.63:8081/tonynews/home.html" target="_blank">防今日头条</el-link>
        <h3>项目进度</h3>
        <img :src="homeImg" style="width:100%;height:100%"/>
    </div>
</template>

<script>
import homeImg from "@/assets/images/home.png";

export default {
    data() {
        return {
            homeImg: homeImg
        }
    }
}
</script>