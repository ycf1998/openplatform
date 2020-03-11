<template>
  <div>
    <div class="app-container">
      <div v-if="isSuccess" style="text-align:center">
        <img :src="success" alt="success" class="img-style" />
        <h1 class="color-main">Success!</h1>
        <h2 style="color: #606266">验证成功，已激活开发者资质！</h2>
        <router-link :to="{path:'/login'}" style="padding-right:10px">
          <el-link :underline="false">前往登录</el-link>
        </router-link>
      </div>
      <div v-else style="text-align:center">
        <img :src="fail" alt="fail" class="img-style" />
        <h1 style="color:#F56C6C">Fail</h1>
        <h2 style="color: #606266">验证失败或已失效！</h2>
        <p style="color:#909399;font-size: 14px">1.刷新重试</p>
        <p style="color:#909399;font-size: 14px">2.超过验证时间，选择重新发送邮件</p>
        <p style="color:#909399;font-size: 14px">
          3.系统问题，可登录后再验证激活
          <router-link :to="{path:'/login'}" style="padding-right:10px">
            <el-link :underline="false">前往登录</el-link>
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { getRequest } from "@/utils/index.js";
import { activeDev } from "@/api/register.js";
import active_dev_success from "@/assets/images/active_dev_success.jpg";
import active_dev_fail from "@/assets/images/active_dev_fail.jpg";

export default {
  data() {
    return {
      token: "",
      isSuccess: false,
      success: active_dev_success,
      fail: active_dev_fail
    };
  },
  created: function() {
    let params = getRequest();
    this.token = params["token"];
    if (
      this.token != "undefined" &&
      this.token != undefined &&
      this.token != ""
    ) {
      activeDev(this.token).then(() => {
          this.isSuccess = true;
      });
    }
  }
};
</script>

<style scoped>
.app-container {
  width: 350px;
  margin: auto;
  margin-top: 80px;
}
.img-style {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>