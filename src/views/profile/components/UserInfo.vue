<template>
  <el-form :model="user" :rules="rules" ref="form" label-width="80px">
    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="user.nickname" />
    </el-form-item>
    <el-form-item label="性别" prop="gender" v-show="user.type == 1">
      <el-radio-group v-model="user.gender" size="small">
        <el-radio label="0" border>未知</el-radio>
        <el-radio label="1" border>男</el-radio>
        <el-radio label="2" border>女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="介绍" prop="info">
      <el-input type="textarea" v-model="user.info" placeholder="请填写个人介绍，将同步用于应用商店"></el-input>
    </el-form-item>
    <template v-if="user.type == 2">
      <el-form-item label="联系人" prop="contact">
        <el-input v-model="user.contact" placeholder="请填写联系人"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="user.phone" placeholder="请填写可以联系到您的手机号码"></el-input>
      </el-form-item>
    </template>
    <el-form-item label="联系地址" prop="address">
      <province-city @selectChange="selectChange" :default-province="user.province" :default-city="user.city"></province-city>
      <el-input
        v-model="user.address"
        style="margin-top:20px"
        placeholder="请填写有效地址，该地址用于联系您和寄送纸质协议等作用"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="small" @click="submit">提交</el-button>
      <el-button type="danger" size="small" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import ProvinceCity from "@/components/ProvinceCity";
import { updateProfile } from "@/api/user";

export default {
  name: "UserInfo",
  components: { ProvinceCity },
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      rules: {
        nickname: [
          { required: true, message: "昵称不能位空", trigger: "blur" }
        ],
        info: [{ required: true, message: "请填写介绍", trigger: "blur" }],
        province: [
          { required: true, message: "请选择省份", trigger: "change" }
        ],
        city: [{ required: true, message: "请选择市", trigger: "change" }],
        address: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ],
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
        ]
      }
    };
  },
  methods: {
    // 省市二级联动 子组件传值
    selectChange(province, city) {
      this.user.province = province;
      this.user.city = city;
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateProfile(this.user).then(res => {
            this.$message({
              message: res.message,
              type: "success"
            });
          });
        }
      });
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/home" });
    }
  }
};
</script>