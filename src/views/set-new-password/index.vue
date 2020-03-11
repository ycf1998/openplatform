<template>
  <div class="set-new-password">
    <el-card class="box-card">
      <h1 class="title">重置密码</h1>
      <el-form v-show="token" class="resetForm" :rules="rules" ref="resetForm" :model="resetForm">
        <el-form-item prop="newPassword">
          <el-input show-password v-model="resetForm.newPassword" placeholder="请填写新密码"></el-input>
        </el-form-item>
        <el-button class="resetPassword" type="primary" @click="resetPassword" :loading="loading">确定</el-button>
        <div style="text-align:center">
          <el-link type="primary" :underline="false" @click="handleGoLogin">返回</el-link>
        </div>
      </el-form>
      <p v-show="!token" style="text-align:center;margin: 50px;">缺少token信息</p>
    </el-card>
  </div>
</template>

<script>
import { getRequest } from "@/utils/index.js";
import { resetPasswordByEmail } from "@/api/register.js";

export default {
  data() {
    return {
      activeName: "first",
      loading: false,
      resetForm: {
        newPassword: ""
      },
      token: "",
      rules: {
        newPassword: [
          { required: true, message: "请填写新密码", trigger: "blur" },
          { min: 1, message: "密码至少6位", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleGoLogin() {
      this.$router.push({ path: "/login" });
    },
    resetPassword() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          this.loading = true;
          resetPasswordByEmail(0, this.token, this.resetForm.newPassword)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: "/login" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  },
  mounted: function() {
    let params = getRequest();
    this.token = params["token"];
    if (this.token == "undefined" || this.token == undefined) {
      this.token = "";
    }
  }
};
</script>

<style scoped>
.set-new-password {
  position: fixed;
  background: #f1f1f1;
  width: 100%;
  height: 100%;
}
.box-card {
  position: absolute;
  left: 0;
  right: 0;
  width: 500px;
  margin: auto;
  margin-top: 100px;
}
.title {
  text-align: center;
}
.resetForm {
  margin: 20px 30px;
}
.resetPassword {
  width: 100%;
  margin: 10px 0;
}
</style>