<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <user-card :user="user" />
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="基本资料" name="first">
                  <user-info :user="user" />
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="second">
                  <reset-pwd :username="user.username"></reset-pwd>
              </el-tab-pane>
              <el-tab-pane label="开发者资质" name="third">
                  <dev-profile :user="user"></dev-profile>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { formatBirthday } from "@/utils/date";
import { getTypeName } from "@/utils/money";
import UserCard from "./components/UserCard";
import UserInfo from "./components/UserInfo";
import ResetPwd from "./components/ResetPwd";
import DevProfile from "./components/DevProfile";
import { getProfile } from "@/api/user";

export default {
  name: "Profile",
  components: { UserCard, UserInfo, ResetPwd, DevProfile },
  data() {
    return {
      user: {},
      activeName: "first"
    };
  },
  created() {
    this.getProfile();
  },
  methods: {
    handleClick(tab, event) {    },
    getProfile() {
      getProfile().then(res => {
        this.user = res.data.user;
        this.user.birthday = formatBirthday(this.user.birthday);
        this.user.gender += '';
        // this.role = res.roles[0];
        this.user.typeName = getTypeName(this.user.type, null);
      });
    }
  }
};
</script>