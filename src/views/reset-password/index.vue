<template>
  <div class="reset-password">
    <el-card class="box-card">
      <h1 class="title">重置密码</h1>
      <el-tabs class="reset-type" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="邮箱重置" name="first">
          <el-form class="mailForm" :rules="rules" ref="mailForm" :model="mailForm">
            <el-form-item prop="email">
              <el-autocomplete
                class="emailInput"
                v-model="mailForm.email"
                :fetch-suggestions="querySeach"
                placeholder="请输入邮箱"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
            <el-button
              class="send"
              type="primary"
              @click="send"
              :loading="sendLoading"
            >{{sendLoadingMsg}}</el-button>
            <div style="text-align:center">
              <el-link type="primary" :underline="false" @click="handleGoLogin">返回</el-link>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { resetPasswordMail } from "@/api/mail.js";

export default {
  data() {
    return {
      activeName: "first",
      restaurants: [],
      sendLoading: false,
      sendLoadingMsg: "发送邮件",
      mailForm: {
        email: ""
      },
      rules: {
        email: [
          { required: true, message: "请填写邮箱", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: "邮箱不合法",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleGoLogin() {
      this.$router.push({ path: "/login" });
    },
    handleClick(tab, event) {},
    // 邮箱预填后缀
    querySeach(prefix, cb) {
      if (prefix.indexOf("@") === -1) {
        var restaurants = this.loadAll();
        this.createFilter(restaurants, prefix);
        this.restaurants = restaurants;
        cb(restaurants);
      } else {
        var restaurants = this.restaurants;
        var results = restaurants.filter(this.fillSuffix(prefix));
        cb(results);
      }
    },
    createFilter(restaurants, prefix) {
      restaurants.forEach(element => {
        element.value = prefix + element.value;
      });
    },
    fillSuffix(prefix) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(prefix.toLowerCase()) === 0
        );
      };
    },
    loadAll() {
      return [
        { value: "@qq.com" },
        { value: "@gmail.com" },
        { value: "@163.com" },
        { value: "@yahoo.com" },
        { value: "@msn.com" },
        { value: "@hotmail.com" },
        { value: "@163.net" }
      ];
    },
    handleSelect() {
      this.$refs.mailForm.validate();
    },
    send() {
      this.$refs.mailForm.validate(valid => {
        if (valid) {
          this.sendLoading = true;
          this.sendLoadingMsg = "正在发送，请稍等...";
          resetPasswordMail(this.mailForm.email)
            .then(() => {
              this.sendLoading = false;
              this.sendLoadingMsg = "发送邮件";
            })
            .catch(() => {
              this.sendLoading = false;
              this.sendLoadingMsg = "发送邮件";
            });
        }
      });
    }
  }
};
</script>

<style scoped>
.reset-password {
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
  margin-top: 80px;
}
.title {
  text-align: center;
}
.reset-type {
  margin: auto 30px;
}
.mailForm {
  margin: 15px 0;
}
.emailInput {
  width: 100%;
}
.send {
  width: 100%;
  margin: 20px 0;
}
</style>