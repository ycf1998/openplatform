<template>
  <div>
    <el-steps :active="active" simple>
      <el-step title="已有商店账号?" icon="el-icon-user"></el-step>
      <el-step title="填写资料" icon="el-icon-edit-outline"></el-step>
      <el-step title="验证邮箱" icon="el-icon-message"></el-step>
      <el-step title="完成注册" icon="el-icon-circle-check"></el-step>
    </el-steps>

    <!-- 是否已有商店账号 -->
    <el-form v-if="active==0" :rules="loginRules" ref="loginForm" :model="loginForm">
      <el-card class="box-card" shadow="always" :body-style="{ 'margin-left': '20%' }">
        <div slot="header" class="clearfix">
          <span>是否已有商店账号</span>
        </div>
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="loginForm.username"
            autocomplete="off"
            placeholder="请输入手机号"
          >
            <span slot="prefix">
              <svg-icon icon-class="user" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            @keyup.enter.native="upgrade"
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
        <el-form-item>
          <el-button
            @click="upgrade"
            type="success"
            style="margin:15px"
            :loading="loginLoading"
          >登录升级</el-button>
          <el-button @click="active++;" style="margin:15px">没有，直接注册</el-button>
        </el-form-item>
      </el-card>
    </el-form>

    <el-form
      v-if="active==1"
      :model="personRegForm"
      :rules="rules"
      ref="personRegForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <!-- 填写资料 -->
      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <span>平台账号（用于登录开发平台和应用商店的账号）</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="active--">返回上一步</el-button>
        </div>
        <el-form-item label="账号" prop="username">
          <el-input
            :disabled="isStoreUser"
            v-model="personRegForm.username"
            placeholder="请填写账号（仅且包含英文和数字）"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="!isStoreUser" label="密码" prop="password">
          <el-input type="password" v-model="personRegForm.password" placeholder="请填写密码（不少于6位）"></el-input>
        </el-form-item>
      </el-card>

      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <span>平台个人信息（同步于应用商店）</span>
        </div>
        <el-form-item label="头像" prop="icon">
          <el-upload
            class="reg-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            accept=".jpg, .jpeg"
            :show-file-list="false"
            :multiple="false"
            :auto-upload="false"
            :on-change="handleIconUpload"
            :http-request="uploadIcon"
            ref="uploadIcon"
          >
            <img v-if="iconUrl" :src="iconUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="personRegForm.nickname" placeholder="请填写昵称，将同步用于应用商店"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="personRegForm.gender" size="small">
            <el-radio label="0" border>未知</el-radio>
            <el-radio label="1" border>男</el-radio>
            <el-radio label="2" border>女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="介绍" prop="info">
          <el-input type="textarea" v-model="personRegForm.info" placeholder="请填写个人介绍，将同步用于应用商店"></el-input>
        </el-form-item>
      </el-card>

      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <span>个人信息</span>
        </div>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="personRegForm.realName" placeholder="请填写与有效身份证上一致的姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="idCard">
          <el-input v-model="personRegForm.idCard" placeholder="请填写18位身份证号码"></el-input>
        </el-form-item>
        <el-form-item label="手持身份证照片" prop="idCardPic">
          <el-upload
            class="reg-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            accept=".jpg, .jpeg, .png"
            :show-file-list="false"
            :multiple="false"
            :auto-upload="false"
            :on-change="handleIdCardPicUpload"
            :http-request="uploadIdCardPic"
            ref="uploadIdCardPic"
          >
            <img v-if="idCardUrl" :src="idCardUrl" class="provePic" />
            <i v-else class="el-icon-plus idCard-uploader-icon"></i>
          </el-upload>
          <ol class="remark">
            <li>2M以内，JPG/PNG格式的图片</li>
            <li>开发者手持身份证正面拍照，要求五官可见，身份证清晰无遮挡</li>
            <li>我司资质验证系统已与工商部门联网，请勿提供虚假证件</li>
          </ol>
        </el-form-item>
      </el-card>

      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <span>联系方式</span>
        </div>
        <el-form-item label="手机号码" prop="phone">
          <el-input
            :disabled="isStoreUser"
            v-model="personRegForm.phone"
            placeholder="请填写可以联系到您的手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="personRegForm.email" placeholder="请填写有效邮箱，用于接收平台审核结果及重要通知"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <ProvinceCity @selectChange="selectChange"></ProvinceCity>
          <el-input
            v-model="personRegForm.address"
            style="margin-top:20px"
            placeholder="请填写有效地址，该地址用于联系您和寄送纸质协议等作用"
          ></el-input>
        </el-form-item>
      </el-card>

      <el-form-item prop="agree" label-width="0">
        <el-checkbox-group v-model="personRegForm.agree" style="display: inline">
          <el-checkbox>同意接受</el-checkbox>
        </el-checkbox-group>
        <el-link type="primary" style="padding:0">麦尼开发者平台协议</el-link>
      </el-form-item>
      <div style="text-align:center">
        <el-button style="margin-top: 12px" @click="handleReg" :loading="regLoading">下一步</el-button>
      </div>
    </el-form>

    <!-- 验证邮箱 -->
    <el-form v-if="active==2">
      <div style="margin-top:5px"></div>
      <el-alert title="您的资料已经提交(仅可登录），进行邮箱验证后即可激活开发者身份。" type="success" show-icon></el-alert>
      <el-card class="box-card" shadow="always">
        <div style="width: 500px;text-align: center;margin: auto;">
          <p>
            验证邮件已发送到您的邮箱{{personRegForm.email}}
            <el-link
              type="primary"
              :underline="false"
              @click="changeEmailDisable = !changeEmailDisable"
            >修改邮箱</el-link>
          </p>
          <p>请单击邮箱里的链接进行验证，验证成功后即完成注册。</p>
          <el-input v-model="newEmail" v-show="changeEmailDisable" placeholder="请输入邮箱">
            <el-button slot="append" icon="el-icon-check" @click="changeEmail"></el-button>
          </el-input>
          <el-button @click="verify" style="margin:15px 0">立即验证</el-button>
          <p>
            没收到邮件？
            <el-link
              type="primary"
              :underline="false"
              :disabled="resendDisable"
              @click="sendMail"
            >{{resendTitle}}</el-link>
          </p>
        </div>
      </el-card>
    </el-form>

    <!-- 完成注册 -->
    <el-form v-if="active==3">
      <el-card :body-style="{ padding: '30px' }" shadow="always">
        <div style="text-align: center">
          <svg-icon icon-class="person-success" class="reg-success-icon"></svg-icon>
          <br />
          <h2>验证成功!</h2>
          <p>欢迎加入麦尼开放平台！</p>
          <el-button
            @click="handleLogin"
            type="success"
            style="margin:15px 0"
            :loading="successLoading"
          >进入平台</el-button>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import {
  upgrade,
  personReg,
  checkUsername,
  checkEmail,
  checkVerify,
  changeEmail
} from "@/api/register.js";
import ProvinceCity from "@/components/ProvinceCity";
import { verificationMail } from "@/api/mail.js";

export default {
  name: "reg",
  components: { ProvinceCity },
  data() {
    // 账号唯一性
    var validateUsername = (rule, value, callback) => {
      if (this.isStoreUser) {
        callback();
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(value)) {
        callback(new Error("账号仅且必须包含英文和数字，且长度在6-12个字符"));
      } else {
        checkUsername(value).then(res => {
          if (res.code !== 200) {
            callback(new Error(res.message));
          } else {
            callback();
          }
        });
      }
    };
    // 邮箱验证
    var validateEmail = (rule, value, callback) => {
      checkEmail(value).then(res => {
        if (res.code !== 200) {
          callback(new Error(res.message));
        } else {
          callback();
        }
      });
    };
    return {
      formData: "",
      active: 0,
      isStoreUser: false,
      loginLoading: false,
      regLoading: false,
      successLoading: false,
      resendTitle: "重新发送",
      resendDisable: false,
      timer: null,
      changeEmailDisable: false,
      newEmail: "",
      iconUrl: "/uploads/person.jpg",
      idCardUrl: "",
      loginForm: {
        username: "",
        password: ""
      },
      personRegForm: {
        icon: "",
        idCardPic: "",
        username: "",
        password: "",
        nickname: "",
        gender: "0",
        info: "",
        realName: "",
        idCard: "",
        phone: "",
        email: "",
        province: "",
        city: "",
        address: "",
        agree: []
      },
      // personRegForm: {
      //   icon: "",
      //   idCardPic: "",
      //   username: "q123456",
      //   password: "123456",
      //   nickname: "Money",
      //   gender: "1",
      //   info: "我就是开发者，是要怎样！",
      //   realName: "麦尼",
      //   idCard: "666666199807091314",
      //   phone: "13345678910",
      //   email: "1@qq.com",
      //   province: "北京市",
      //   city: "朝阳区",
      //   address: "北京市朝阳区一环内大户人家",
      //   agree: []
      // },
      loginRules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      },
      rules: {
        username: [
          { required: true, message: "请填写账号", trigger: "change" },
          {
            validator: validateUsername,
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请填写密码", trigger: "blur" },
          {
            min: 6,
            message: "密码至少6位",
            trigger: "blur"
          }
        ],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        info: [{ required: true, message: "请填写介绍", trigger: "blur" }],
        realName: [
          { required: true, message: "请填写真实姓名", trigger: "blur" }
        ],
        idCard: [
          { required: true, message: "请填写身份证", trigger: "blur" },
          {
            pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: "身份证不合法",
            trigger: "blur"
          }
        ],
        idCardPic: [{ required: true, message: "请上传手持身份证件照" }],
        phone: [
          { required: true, message: "请填写手机号码", trigger: "blur" },
          {
            pattern: /^1(3|4|5|7|8)\d{9}$/,
            message: "手机号码不合法",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请填写邮箱", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: "邮箱不合法",
            trigger: "blur"
          },
          {
            validator: validateEmail,
            trigger: "blur"
          }
        ],
        province: [
          { required: true, message: "请选择省份", trigger: "change" }
        ],
        city: [{ required: true, message: "请选择市", trigger: "change" }],
        address: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ],
        agree: [
          {
            type: "array",
            required: true,
            message: "未同意",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    // 省市二级联动 子组件传值
    selectChange(province, city) {
      this.personRegForm.province = province;
      this.personRegForm.city = city;
    },
    // 商店用户升级
    upgrade() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginLoading = true;
          upgrade(this.loginForm.username, this.loginForm.password)
            .then(response => {
              this.loginLoading = false;
              if (response.data.type > 0) {
                this.$message({
                  type: "warning",
                  message: "您已经是开发者了！！！"
                });
              } else {
                // 预填充应用商店同步信息
                this.isStoreUser = true;
                this.personRegForm.username = response.data.username;
                this.personRegForm.icon = response.data.icon;
                this.iconUrl = "/uploads/" + response.data.icon;
                this.personRegForm.nickname = response.data.nickname;
                this.personRegForm.gender = response.data.gender + "";
                this.personRegForm.info = response.data.info;
                this.personRegForm.phone = response.data.phone;
                this.active++;
              }
            })
            .catch(() => {
              this.loginLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    // 注册
    handleReg() {
      this.$refs.personRegForm.validate(valid => {
        this.regLoading = true;
        if (valid) {
          this.formData = new FormData();
          this.$refs.uploadIcon.submit();
          this.$refs.uploadIdCardPic.submit();
          this.formData.append("username", this.personRegForm.username);
          this.formData.append("password", this.personRegForm.password);
          this.formData.append("nickname", this.personRegForm.nickname);
          this.formData.append("gender", this.personRegForm.gender);
          this.formData.append("info", this.personRegForm.info);
          this.formData.append("realName", this.personRegForm.realName);
          this.formData.append("idCard", this.personRegForm.idCard);
          this.formData.append("phone", this.personRegForm.phone);
          this.formData.append("email", this.personRegForm.email);
          this.formData.append("province", this.personRegForm.province);
          this.formData.append("city", this.personRegForm.city);
          this.formData.append("address", this.personRegForm.address);
          personReg(this.formData, this.isStoreUser)
            .then(response => {
              this.regLoading = false;
              this.active++;
              // 发送邮箱验证
              this.sendMail();
            })
            .catch(() => {
              this.regLoading = false;
            });
        } else {
          this.regLoading = false;
          return false;
        }
      });
    },
    // 修改邮箱
    changeEmail() {
      if (
        !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
          this.newEmail
        )
      ) {
        this.$message({
          type: "error",
          message: "邮箱格式不对"
        });
        return false;
      }
      checkEmail(this.newEmail).then(res => {
        if (res.code === 200) {
          changeEmail(
            this.personRegForm.username,
            this.personRegForm.password,
            this.newEmail
          ).then(() => {
            this.personRegForm.email = this.newEmail;
            this.changeEmailDisable = false;
            this.sendMail();
          });
        } else {
          this.$message({
            type: "error",
            message: "该邮箱已被注册"
          });
        }
      });
      return false;
    },
    // 发送邮箱验证
    sendMail() {
      verificationMail(this.personRegForm.username, this.personRegForm.email);
      this.resendDisable = true;
      const TIME_COUNT = 45;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.resendDisable = true;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.resendTitle = "重新发送（" + this.count + "）";
            this.count--;
          } else {
            this.resendDisable = false;
            this.resendTitle = "重新发送";
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    // 立即验证
    verify() {
      checkVerify(this.personRegForm.username)
        .then(() => {
          this.active++;
        })
        .catch(() => {});
    },
    // 进入平台（登录）
    handleLogin() {
      this.successLoading = true;
      let loginForm = {
        username: this.personRegForm.username,
        password: this.personRegForm.password
      };
      this.$store
        .dispatch("Login", loginForm)
        .then(() => {
          this.active++;
          this.successLoading = false;
          this.$router.push({ path: "/" });
        })
        .catch(() => {
          this.successLoading = false;
        });
    },
    // 头像
    handleIconUpload(file) {
      if (file.status == "ready" && this.limitSize(file)) {
        this.iconUrl = URL.createObjectURL(file.raw);
        this.personRegForm.icon = file.name;
      }
    },
    uploadIcon(file) {
      if (file.name != "") {
        this.formData.set("iconFile", file.file);
      }
    },
    // 身份证照片
    handleIdCardPicUpload(file) {
      if (file.status == "ready" && this.limitSize(file)) {
        this.idCardUrl = URL.createObjectURL(file.raw);
        this.personRegForm.idCardPic = file.name;
      }
    },
    uploadIdCardPic(file) {
      this.formData.set("idCardPicFile", file.file);
    },
    // 限制图片大小
    limitSize(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    }
  }
};
</script>
<style scoped>
.reg-success-icon {
  width: 12em;
  height: 12em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.reg-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.reg-uploader .el-upload:hover {
  border-color: #409eff;
}
/* 头像上传照片 */
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  line-height: 78px;
  text-align: center;
}
/* 身份证上传照片 */
.idCard-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.avatar {
  width: 78px;
  height: 78px;
  display: block;
}
.provePic {
  width: 188px;
  height: 168px;
  display: block;
}
/* diglog */
.remark {
  color: #909399;
}
ol {
  line-height: 20px;
  padding-left: 10px;
}
.el-dialog__body {
  min-height: 650px;
  background: #fcf9f9;
}
.el-form-item {
  width: 70%;
}
</style>