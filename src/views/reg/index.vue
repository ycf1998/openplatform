<template>
  <div class="regChoose">
    <el-card class="reg-type-layout box-card">
      <div slot="header" class="clearfix">
        <span>请选择注册类型</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="backLogin">返回登录</el-button>
      </div>
      <el-row :gutter="12">
        <el-col :span="12">
          <a href="javascript:;" @click="personDialog = true">
            <el-card :body-style="{ padding: '30px' }" shadow="hover">
              <div style="text-align: center">
                <svg-icon icon-class="person" class="reg-type-icon"></svg-icon>
                <!-- <img src="@/icons/personIcon.jpg" width="250" height="250"> -->
              </div>
              <div style="text-align: center">
                <h2>个人</h2>
                <span>个人类型开发者需上传手持身份证件照片</span>
              </div>
            </el-card>
          </a>
        </el-col>
        <el-col :span="12">
          <a href="javascript:;" @click="companyDialog = true">
            <el-card :body-style="{ padding: '30px' }" shadow="hover">
              <div style="text-align: center">
                <svg-icon icon-class="company" class="reg-type-icon"></svg-icon>
                <!-- <img src="@/icons/companyIcon.jpg" width="250" height="250"> -->
              </div>
              <div style="text-align: center">
                <h2>公司</h2>
                <span>公司类型开发者需提供最新年检营业执照</span>
              </div>
            </el-card>
          </a>
        </el-col>
      </el-row>
      <span>
        <strong>注：</strong>若您将注册
        <strong>个人类型开发者</strong>且已有应用商店账号，请使用已有账号进行升级注册！
      </span>
    </el-card>

    <el-dialog
      title="个人类型开发者"
      center
      :visible.sync="personDialog"
      top="5vh"
      width="90%"
      :before-close="handleClose"
    >
      <PersonReg></PersonReg>
    </el-dialog>
    
    <el-dialog
      title="公司类型开发者"
      center
      :visible.sync="companyDialog"
      top="5vh"
      width="90%"
      :before-close="handleClose"
    >
      <CompanyReg></CompanyReg>
    </el-dialog>
  </div>
</template>

<script>
import PersonReg from "./PersonReg.vue";
import CompanyReg from "./CompanyReg.vue";

export default {
  name: "regChoose",
  data() {
    return {
      personDialog: false,
      companyDialog: false
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    backLogin() {
      this.$router.push({path:"/login"});
    }
  },
  components: { PersonReg, CompanyReg }
};
</script>

<style  scoped>
.reg-type-layout {
  position: absolute;
  left: 0;
  right: 0;
  width: 800px;
  margin: auto;
  margin-top: 80px;
  background: #f1f1f1;
}
.reg-type-icon {
  width: 10em;
  height: 10em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

</style>
