<template>
  <div>
    <el-steps :active="active" simple>
      <el-step title="填写资料" icon="el-icon-edit-outline"></el-step>
      <el-step title="验证邮箱" icon="el-icon-message"></el-step>
      <el-step title="完成注册" icon="el-icon-circle-check"></el-step>
    </el-steps>

    <el-form
      v-if="active==0"
      :model="companyRegForm"
      :rules="rules"
      ref="companyRegForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <!-- 填写资料 -->
      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <span>平台账号（用于登录开发平台和应用商店的账号）</span>
        </div>
        <el-form-item label="账号" prop="username">
          <el-input v-model="companyRegForm.username" placeholder="请填写账号（仅且包含英文和数字）"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="companyRegForm.password" placeholder="请填写密码（不少于6位）"></el-input>
        </el-form-item>
      </el-card>

      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <span>平台展示信息（同步于应用商店）</span>
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
          <el-input v-model="companyRegForm.nickname" placeholder="请填写昵称，尽量使用公司名称，将同步用于应用商店"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="info">
          <el-input type="textarea" v-model="companyRegForm.info" placeholder="请填写公司介绍，将同步用于应用商店"></el-input>
        </el-form-item>
      </el-card>

      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <span>个人信息</span>
        </div>
        <el-form-item label="公司全称" prop="companyName">
          <el-input v-model="companyRegForm.companyName" placeholder="请填写与营业执照一致的合法公司全称"></el-input>
        </el-form-item>
        <el-form-item label="营业执照注册号" prop="businessLicenseRegNumber">
          <el-input v-model="companyRegForm.businessLicenseRegNumber" placeholder="请填写完整的营业执照上的注册码"></el-input>
        </el-form-item>
        <el-form-item label="营业执照照片" prop="businessLicense">
          <el-upload
            class="reg-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            accept=".jpg, .jpeg, .png"
            :show-file-list="false"
            :multiple="false"
            :auto-upload="false"
            :on-change="handleBusinessLicenseUpload"
            :http-request="uploadBusinessLicense"
            ref="uploadBusinessLicense"
          >
            <img v-if="businessLicenseUrl" :src="businessLicenseUrl" class="provePic" />
            <i v-else class="el-icon-plus businessLicense-uploader-icon"></i>
          </el-upload>
          <ol class="remark">
            <li>2M以内，JPG/PNG格式的图片</li>
            <li>我司资质验证系统已与工商部门联网，请勿提供虚假证件</li>
          </ol>
        </el-form-item>
      </el-card>

      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <span>联系方式</span>
        </div>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="companyRegForm.contact" placeholder="请填写联系人"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="companyRegForm.phone" placeholder="请填写可以联系到您的手机号码"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="companyRegForm.email" placeholder="请填写有效邮箱，用于接收平台审核结果及重要通知"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <ProvinceCity @selectChange="selectChange"></ProvinceCity>
          <el-input
            style="margin-top:20px"
            v-model="companyRegForm.address"
            placeholder="请填写有效地址，该地址用于联系您和寄送纸质协议等作用"
          ></el-input>
        </el-form-item>
      </el-card>

      <el-form-item prop="agree" label-width="0">
        <el-checkbox-group v-model="companyRegForm.agree" style="display: inline">
          <el-checkbox>同意接受</el-checkbox>
        </el-checkbox-group>
        <el-link type="primary" style="padding:0">麦尼开发者平台协议</el-link>
      </el-form-item>
      <div style="text-align:center">
        <el-button style="margin-top: 12px" @click="handleReg" :loading="regLoading">下一步</el-button>
      </div>
    </el-form>

    <!-- 验证邮箱 -->
    <el-form v-if="active==1">
      <div style="margin-top:5px"></div>
      <el-alert title="您的资料已经提交(仅可登录），进行邮箱验证后即可激活开发者身份。" type="success" show-icon></el-alert>
      <el-card class="box-card" shadow="always">
        <div style="width: 500px;text-align: center;margin: auto;">
          <p>
            验证邮件已发送到您的邮箱{{companyRegForm.email}}
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
    <el-form v-if="active==2">
      <el-card :body-style="{ padding: '30px' }" shadow="always">
        <div style="text-align: center">
          <svg-icon icon-class="company-success" class="reg-success-icon"></svg-icon>
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
  companyReg,
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
      checkUsername(value).then(res => {
        if (res.code !== 200) {
          callback(new Error(res.message));
        } else {
          callback();
        }
      });
    };
    // 邮箱唯一性
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
      regLoading: false,
      successLoading: false,
      resendTitle: "重新发送",
      resendDisable: false,
      timer: null,
      changeEmailDisable: false,
      newEmail: "",
      iconUrl: "/uploads/company.jpg",
      businessLicenseUrl: "",
      companyRegForm: {
        username: "",
        password: "",
        icon: "",
        nickname: "",
        gender: "0",
        info: "",
        companyName: "",
        businessLicenseRegNumber: "",
        businessLicense: "",
        contact: "",
        phone: "",
        email: "",
        province: "",
        city: "",
        address: "",
        agree: []
      },
      // companyRegForm: {
      //   username: "c123456",
      //   password: "123456",
      //   icon: "",
      //   nickname: "深圳市腾讯计算机系统有限公司",
      //   gender: "0",
      //   info: "加入我们！",
      //   companyName: "深圳市腾讯计算机系统有限公司",
      //   businessLicenseRegNumber: "440301103448669",
      //   businessLicense: "",
      //   contact: "小马",
      //   phone: "18120803975",
      //   email: "374648769@qq.com",
      //   province: "",
      //   city: "",
      //   address: "深圳市南山区高新区高新南一路飞亚达大厦5-10楼",
      //   agree: []
      // },
      rules: {
        username: [
          { required: true, message: "请填写账号", trigger: "change" },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/,
            message: "账号仅且必须包含英文和数字，且长度在6-12个字符",
            trigger: "change"
          },
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
        companyName: [
          { required: true, message: "请填写公司全称", trigger: "blur" }
        ],
        businessLicenseRegNumber: [
          {
            required: true,
            message: "请填写有效营业执照注册号",
            trigger: "blur"
          }
        ],
        businessLicense: [{ required: true, message: "请上传最新营业执照" }],
        contact: [
          { required: true, message: "请填写联系人姓名", trigger: "blur" }
        ],
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
      this.companyRegForm.province = province;
      this.companyRegForm.city = city;
    },
    // 注册
    handleReg() {
      this.$refs.companyRegForm.validate(valid => {
        if (valid) {
          this.formData = new FormData();
          this.$refs.uploadIcon.submit();
          this.$refs.uploadBusinessLicense.submit();
          this.formData.append("username", this.companyRegForm.username);
          this.formData.append("password", this.companyRegForm.password);
          this.formData.append("nickname", this.companyRegForm.nickname);
          this.formData.append("gender", this.companyRegForm.gender);
          this.formData.append("info", this.companyRegForm.info);
          this.formData.append("companyName", this.companyRegForm.companyName);
          this.formData.append(
            "businessLicenseRegNumber",
            this.companyRegForm.businessLicenseRegNumber
          );
          this.formData.append("contact", this.companyRegForm.contact);
          this.formData.append("phone", this.companyRegForm.phone);
          this.formData.append("email", this.companyRegForm.email);
          this.formData.append("province", this.companyRegForm.province);
          this.formData.append("city", this.companyRegForm.city);
          this.formData.append("address", this.companyRegForm.address);
          this.loading = true;
          companyReg(this.formData)
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
            this.companyRegForm.username,
            this.companyRegForm.password,
            this.newEmail
          ).then(() => {
            this.companyRegForm.email = this.newEmail;
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
      verificationMail(this.companyRegForm.username, this.companyRegForm.email);
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
      checkVerify(this.companyRegForm.username)
        .then(() => {
          this.active++;
        })
        .catch(() => {});
    },
    // 进入平台（登录）
    handleLogin() {
      this.successLoading = true;
      let loginForm = {
        username: this.companyRegForm.username,
        password: this.companyRegForm.password
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
        this.companyName.icon = file.name;
      }
    },
    uploadIcon(file) {
      if (file.name != "") {
        this.formData.set("iconFile", file.file);
      }
    },
    // 营业执照照片
    handleBusinessLicenseUpload(file) {
      if (file.status == "ready" && this.limitSize(file)) {
        this.businessLicenseUrl = URL.createObjectURL(file.raw);
        this.companyRegForm.businessLicense = file.name;
      }
    },
    uploadBusinessLicense(file) {
      this.formData.set("businessLicenseFile", file.file);
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

.reg-uploader.el-upload {
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
/* 营业执照上传照片 */
.businessLicense-uploader-icon {
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