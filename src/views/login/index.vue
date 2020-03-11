<template>
  <div class="login">
    <el-card class="login-form-layout">
      <el-form
        autocomplete="on"
        label-position="left"
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
      >
        <div style="text-align: center">
          <img :src="logo" style="width: 68px;height: 58px;color: #409EFF" />
        </div>
        <h2 class="login-title color-main">麦尼开放平台</h2>
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="loginForm.username"
            autocomplete="off"
            placeholder="请输入用户名"
          >
            <span slot="prefix">
              <svg-icon icon-class="user" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            @keyup.enter.native="handleLogin"
            v-model="loginForm.password"
            autocomplete="on"
            placeholder="请输入密码"
            show-password
          >
            <span slot="prefix">
              <svg-icon icon-class="password" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button
            style="width: 45%"
            type="primary"
            :loading="loading"
            @click.native.prevent="handleLogin"
          >登录</el-button>
          <el-button style="width: 45%" type="primary" @click.native.prevent="toReg">注册</el-button>
        </el-form-item>
      </el-form>
      <div style="width:100%;text-align:right;">
        <router-link :to="{path: '/reset-password'}">
          <el-link :underline="false" type="info">忘记密码？</el-link>
        </router-link>
      </div>
    </el-card>
    <img :src="login_center_bg" class="login-center-layout" />
  </div>
</template>

<script>
import logo from "@/assets/images/logo.png";
import login_center_bg from "@/assets/images/login_center_bg.png";
import { setSupport, getSupport, setCookie, getCookie } from "@/utils/support";

export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ]
      },
      loading: false,
      logo,
      login_center_bg
    };
  },
  created() {
    this.loginForm.username = getCookie("username");
    this.loginForm.password = getCookie("password");
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.loading = false;
              setCookie("username", this.loginForm.username, 15);
              setCookie("password", this.loginForm.password, 15);
              this.$router.push({ path: "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    toReg() {
      this.$router.push({ path: "/reg" });
    }
  }
};
</script>

<style>
.login-form-layout {
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  margin: 120px auto;
  border-top: 10px solid #25d19d;
}

.login-title {
  text-align: center;
}

.login-center-layout {
  background: #25d19d;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-top: 200px;
}
</style>
