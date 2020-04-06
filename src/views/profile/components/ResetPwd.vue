<template>
  <el-form :model="pwdForm" :rules="rules" ref="pwdForm" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="pwdForm.oldPassword" show-password />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="pwdForm.newPassword" show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="pwdForm.confirmPassword" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="small" @click="submit">提交</el-button>
      <el-button type="danger" size="small" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updatePwd } from "@/api/user";

export default {
  name: "ResetPwd",
  props: {
    username: {
      type: String,
      default: ""
    }
  },
  data() {
    var confirmPwd = (rule, value, callback) => {
      if (value !== this.pwdForm.newPassword) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      pwdForm: {
        username: "",
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", triggler: "blur" }
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          {
            min: 6,
            message: "密码至少6位",
            trigger: "blur"
          }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          {
            validator: confirmPwd,
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    username: function(newVal, oldVal) {
      this.pwdForm.username = newVal;
    }
  },
  methods: {
    submit() {
      this.$refs["pwdForm"].validate(valid => {
        if (valid) {
          updatePwd(this.pwdForm).then(res => {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.logout();
          });
        }
      });
    },
    async logout() {
      await this.$store.dispatch('LogOut')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/home" });
    }
  }
};
</script>