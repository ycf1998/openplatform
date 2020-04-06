<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>个人资料</span>
    </div>
    <div class="user-title">
      <div class="box-center">
        <pan-thumb :image="avatar" :height="'110px'" :width="'110px'">
          <br />
          <el-link type="primary" @click="toggleShow">[点击更换]</el-link>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-nickname text-center">{{ user.nickname }}</div>
        <div class="user-role text-center text-muted">
          <template v-if="user.activation == 0">
            <el-tag size="mini" type="info">{{user.typeName}}开发者</el-tag>
            <el-link
              type="primary"
              @click="sendMail(user.email)"
              class="active-btn"
              :disabled="sendMailBtn"
            >{{active}}</el-link>
          </template>
          <template v-else>
            <el-tag size="mini" type="success">{{user.typeName}}开发者</el-tag>
          </template>
        </div>
      </div>
    </div>
    <div class="user-profile">
      <el-divider></el-divider>
      <div class="profile-item">
        <svg-icon icon-class="user" />
        <span>账号</span>
        <span class="fr">{{user.username}}</span>
      </div>
      <div v-show="user.type === 2">
        <el-divider></el-divider>
        <div class="profile-item">
          <svg-icon icon-class="person" />
          <span>联系人</span>
          <span class="fr">{{user.contact}}</span>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="profile-item">
        <svg-icon icon-class="phone" />
        <span>手机号码</span>
        <span class="fr">{{user.phone}}</span>
      </div>
      <el-divider></el-divider>
      <div class="profile-item">
        <svg-icon icon-class="email" />
        <span>邮箱</span>
        <div class="fr">
          {{user.email}}
          <el-link @click="dialogVisible = true">
            <svg-icon icon-class="edit" />
          </el-link>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="profile-item">
        <svg-icon icon-class="birthday" />
        <span>生日</span>
        <span class="fr">{{user.birthday}}</span>
      </div>
      <el-divider></el-divider>
      <div class="profile-item">
        <svg-icon icon-class="position" />
        <span>地址</span>
        <span class="fr">{{user.province}}{{user.city}}</span>
      </div>
      <el-divider></el-divider>
      <div class="profile-item">
        <svg-icon icon-class="date" />
        <span>创建日期</span>
        <span class="fr">{{user.createTime}}</span>
      </div>
    </div>
    <my-upload
      field="file"
      @crop-upload-success="cropUploadSuccess"
      v-model="show"
      :width="300"
      :height="300"
      url="/api/user/avatar"
      :headers="headers"
      img-format="png"
    ></my-upload>
    <el-dialog
      title="修改邮箱"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      center
    >
      <el-form :model="form" :rules="rules" label-width="80px">
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" show-password placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入新邮箱"></el-input>
        </el-form-item>
      </el-form>
      <span style="color:red">请填写有效邮箱，用于接收平台审核结果及重要通知！</span>
      <br />
      <span style="color:red">（确定后将发送激活邮件到您的新邮箱，点击链接后激活开发者资质）</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { formatBirthday } from "@/utils/date";
import PanThumb from "@/components/PanThumb";
import myUpload from "vue-image-crop-upload";
import { checkEmail, checkVerify, changeEmail } from "@/api/register.js";
import { activeEmailMail } from "@/api/mail.js";
import { updateEmail } from "@/api/user.js";

export default {
  name: "UserCard",
  components: { PanThumb, myUpload },
  data() {
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
      show: false, // 显示更改头像
      dialogVisible: false, // 修改邮箱对话框
      avatar: this.$store.getters.avatar,
      form: {
        password: "",
        email: ""
      },
      rules: {
        password: [
          { required: true, message: "密码不能为空", triggle: "blur" }
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
        ]
      },
      active: "激活",
      sendMailBtn: false,
      timer: null,
      headers: {
        Authorization: this.$store.getters.token
      },
      imgDataUrl: ""
    };
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          nickname: "",
          avatar: "",
          email: "",
          phone: "",
          createTime: "",
          birthday: "",
          role: ""
        };
      }
    }
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 发送邮箱验证
    sendMail(email) {
      activeEmailMail(email);
      this.$notify({
        title: "成功",
        message: "激活邮件已发送至" + email + "请在1小时内点击邮件中链接激活！",
        type: "success"
      });
      this.sendMailBtn = true;
      this.active = "重新发送";
      const TIME_COUNT = 45;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.sendMailBtn = true;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.active = "重新发送（" + this.count + "）";
            this.count--;
          } else {
            this.sendMailBtn = false;
            this.active = "激活";
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    submit() {
      updateEmail(this.form.email, this.form.password).then(() => {
        this.sendMail(this.form.email);
        this.dialogVisible = false;
        this.user.activation = 0;
      });
    },
    // 立即验证
    verify() {
      checkVerify(this.user.username)
        .then(() => {
          this.user.active
        })
        .catch(() => {});
    },
    /**
     * upload success
     *
     * [param] jsonData   服务器返回数据，已进行json转码
     * [param] field
     */
    cropUploadSuccess(jsonData, field) {
      console.log("-------- upload success --------");
      console.log(jsonData);
      console.log("field: " + field);
      const newAvatar = "/uploads/" + jsonData.data;
      this.$store.commit("SET_AVATAR", newAvatar);
      this.avatar = newAvatar;
    }
  }
};
</script>

<style lang="scss" scoped>
.fr {
  float: right;
}
.box-center {
  margin: 0 auto;
  display: table;
}
.user-title {
  .box-center {
    padding-top: 10px;
  }
  .user-nickname {
    font-weight: bold;
    font-size: 18px;
  }
  .user-role {
    padding-top: 10px;
    font-size: 12px;
  }
  .active-btn {
    font-size: 12px;
    margin-left: 5px;
  }
}

.user-profile {
  .el-divider {
    margin: 10px 0;
  }
}
</style>