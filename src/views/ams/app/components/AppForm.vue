<template>
  <div class="components-container">
    <el-card class="box-card">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="上传安装包"></el-step>
        <el-step title="填写应用信息"></el-step>
        <el-step title="确认申请"></el-step>
      </el-steps>
      <app-upload-form
        v-show="active == 0"
        :is-edit="isEdit"
        v-model="ApplyAppParams"
        @change="updateuploadOk"
        @nextStep="nextStep"
      ></app-upload-form>
      <app-info-form
        v-show="active == 1"
        :is-edit="isEdit"
        v-model="ApplyAppParams"
        @preStep="preStep"
        @nextStep="nextStep"
      ></app-info-form>
       <div v-show="active == 2" style="text-align: center">
         <el-row style="margin-top: 35px">
           
         </el-row>
        <el-row style="margin-top: 35px">
          <el-button type="primary" size="medium" @click="nextStep" :disabled="!uploadOk">确认</el-button>
        </el-row>
      </div>
      <div v-show="active == 3" style="text-align: center">
         <el-row style="margin-top: 35px">
           创建应用成功，您的上架申请工作人员会在24小时内尽快帮你审核，请耐心等待！
         </el-row>
        <el-row style="margin-top: 35px">
          <el-button type="primary" size="medium" @click="complate">完成</el-button>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AppUploadForm from "./AppUploadForm";
import AppInfoForm from "./AppInfoForm";

const defaultApplyAppParams = {
  dev: "",
  name: "",
  size: "",
  packageName: "",
  versionName: "",
  versionCode: "",
  screenSize: "",
  keywords: "",
  language: "简体中文",
  expenses: "免费",
  price: "",
  advertisement: "？",
  remarks: "",
  detailDesc: "",
  category: [],
  onSaleDateStr: "",
  installFile: "",
  logo: "",
  video: "",
  pics: [],
  copyright: [],
  github: "",
  link: "",
  publish: "1",
};

// const defaultApplyAppParams = {
//   dev: "",
//   name: "爱奇艺",
//   size: "",
//   packageName: "com.qiyi.video.apk",
//   versionName: "10.12.5",
//   versionCode: "800101255",
//   screenSize: "",
//   keywords: "海量资源，泡泡圈，电影",
//   language: "简体中文",
//   expenses: "免费",
//   price: "",
//   advertisement: "你有爱奇艺会员吗？",
//   remarks: "没有就冲啊！",
//   detailDesc: "",
//   category: [],
//   onSaleDateStr: "",
//   installFile: "com.qiyi.video1598671925007",
//   logo: "",
//   video: "http://qiyi.com/video/123",
//   pics: [],
//   copyright: [],
//   github: "",
//   link: "",
//   publish: "1",
// };

export default {
  components: { AppUploadForm, AppInfoForm },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      active: 0,
      uploadOk: false,
      ApplyAppParams: Object.assign({}, defaultApplyAppParams),
    };
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);
    }
  },
  methods: {
    fetchData(id) {
      
    },
    preStep() {
      if (this.active-- <= 0) this.active = 0;
    },
    nextStep() {
      if (this.active++ > 2) this.active = 3;
    },
    updateuploadOk(value) {
      this.uploadOk = value;
    },
    complate() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: "/app" });
    }
  },
};
</script>

<style scoped>
.components-container {
  width: 1000px;
  margin: auto;
}
</style>