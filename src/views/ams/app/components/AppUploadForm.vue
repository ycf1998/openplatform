<template>
  <div style="margin-top: 50px;text-align:center">
    <el-row>
      <el-col :md="10">
        <el-upload
          class="drag"
          ref="upload"
          drag
          action="/api/apk"
          with-credentials
          :data="this.value"
          :auto-upload="false"
          :multiple="false"
          :on-change="handleChange"
          :on-success="handleSuccess"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击选择</em>
          </div>
          <div class="el-upload__tip" slot="tip">点击上传后，可先下一步填写应用信息</div>
        </el-upload>
      </el-col>
      <el-col :md="14">
        <el-card shadow="never" class="cardBg" v-loading="loadSwich" element-loading-text="解析中">
          <div class="info-item">
            <span class="info-label info-first">名称</span>
            <span class="info">{{value.name}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">大小</span>
            <span class="info">{{value.size}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">包名</span>
            <span class="info">{{value.packageName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">版本名</span>
            <span class="info">{{value.versionName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">版本号</span>
            <span class="info">{{value.versionCode}}</span>
          </div>
          <el-button
            size="small"
            type="warning"
            v-show="sumbit"
            @click="submitUpload"
            style="margin-top: 10px"
          >确认上传</el-button>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 35px">
      <el-button type="primary" size="medium" @click="handleNext()" :disabled="nextBtn">下一步，填写应用信息</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      nextBtn: true,
      loadSwich: false,
      sumbit: false,
    };
  },
  methods: {
    //上传文件让第二次覆盖第一的文件
    handleChange(file, fileList) {
      this.$emit('change', true);
      if (file.status == "ready") {
        this.loadSwich = true;
        this.sumbit = false;
        this.nextBtn = true;
        if (fileList.length > 1) {
          fileList.splice(0, 1);
        }
        this.value.size = (file.size/1024/1024).toFixed(3) + 'MB';
        this.parseFile(file.raw);
      } else if (file.status == "success") {
        this.$emit('change', true);
        this.$message({
          message: "安装包上传成功",
          type: "success",
        });
      } else {
        this.value.name = '';
        this.value.size = '';
        this.value.packageName = '';
        this.value.versionName = '';
        this.value.versionCode = '';
        this.$message.error("安装包上传错误，请重新上传");
      }
    },
    handleSuccess(res) {
      this.value.installFile = res.data.appFileName;
    },
    parseFile(file) {
      const AppInfoParser = require("app-info-parser/src/apk");
      const parser = new AppInfoParser(file);
      parser
        .parse()
        .then((res) => {
          this.value.dev = this.$store.getters.username;
          this.value.name = res.application.label[0];
          this.value.packageName = res.package;
          this.value.versionName = res.versionName;
          this.value.versionCode = res.versionCode;
          // console.log("icon base64 ----> ", res.icon);
          this.sumbit = true;
          this.loadSwich = false
        })
        .catch((err) => {
          this.value.name = "解析失败，请重新上传";
          this.value.size = "解析失败，请重新上传";
          this.value.packageName = "解析失败，请重新上传";
          this.value.versionName = "解析失败，请重新上传";
          this.value.versionCode = "解析失败，请重新上传";
          this.loadSwich = false
          console.log("err ----> ", err);
        });
    },
    submitUpload() {
      this.sumbit = false;
      this.nextBtn = false;
      this.$refs.upload.submit();
    },
    handleNext() {
      this.$emit("nextStep");
    },
  },
};
</script>

<style scoped>
.cardBg {
  width: 380px;
  background: #f8f9fc;
}
.el-card {
  margin: auto;
}
.info-item {
  display: table-row;
}
.info-label {
  display: table-cell;
  padding: 20px 80px 0 20px;
  color: #909399;
}
.info-first {
  padding-top: 0px;
}
</style>