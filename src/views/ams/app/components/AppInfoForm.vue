<template>
  <el-form
    :model="value"
    :rules="rules"
    ref="appInfoForm"
    label-width="120px"
    size="small"
  >
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-form-item label="应用名称：" prop="name">
        <el-input v-model="value.name"></el-input>
      </el-form-item>
      <el-form-item label="应用类型：" prop="category">
        <el-cascader
          style="width: 250px"
          :options="options"
          v-model="value.category"
          :props="props"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="关键词：" prop="keywords">
        <el-input
          v-model="value.keywords"
          placeholder="自定义1-4个中文关键词，用，隔开"
        ></el-input>
      </el-form-item>
      <el-form-item label="一句广告语：" prop="advertisement">
        <el-input
          v-model="value.advertisement"
          placeholder="请输入一句广告语，不能多于20个字符"
          maxlength="20"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="Github地址：" prop="github">
        <el-input
          v-model="value.github"
          placeholder="若为开源应用可填写Github地址"
        ></el-input>
      </el-form-item>
      <el-form-item label="应用简介：" prop="detailDesc">
        <tinymce
          :width="595"
          :height="300"
          :toolbar="toolbar"
          v-model="value.detailDesc"
        ></tinymce>
      </el-form-item>
    </el-card>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>图片素材</span>
      </div>
      <el-form-item label="应用图标：" prop="logo">
        <el-upload
          class="logo-uploader"
          action
          accept=".jpg, .jpeg, .png"
          :auto-upload="false"
          :show-file-list="false"
          :multiple="false"
          :on-change="handleLogoUpload"
          :http-request="uploadLogo"
          ref="logo"
        >
          <img v-if="logoUrl" :src="logoUrl" class="logo" />
          <i v-else class="el-icon-plus logo-uploader-icon"></i>
        </el-upload>
        <p class="remark">
          尺寸512*512，大小200K以内，JPG、PNG格式，建议使用直角图
        </p>
      </el-form-item>
      <el-form-item label="应用截图：" prop="pics">
        <el-upload
          action
          accept=".jpg, .jpeg, .png"
          list-type="picture-card"
          :auto-upload="false"
          :multiple="true"
          :limit="5"
          :on-exceed="handleExceed"
          :on-change="handlePictureCardUpload"
          :http-request="uploadPictureCard"
          ref="pics"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                class="el-upload-list__item-delete"
                @click="handleDelete(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <p class="remark">
          上传3-5张截图（尺寸保持一致），单张大小不超过1M，像素不低于480*800，JPG、PNG格式
        </p>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label="介绍视频：" prop="video">
        <el-input v-model="value.video"></el-input>
        <p class="remark">
          请上传应用相关视频，涉及暴力、色情、第三方视频等将被驳回
        </p>
      </el-form-item>
    </el-card>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>适配信息</span>
      </div>
      <el-form-item label="支持语言：" prop="language">
        <el-select v-model="value.language" placeholder="请选择">
          <el-option label="简体中文" value="简体中文"></el-option>
          <el-option label="繁体中文" value="繁体中文"></el-option>
          <el-option label="英文" value="英文"></el-option>
          <el-option label="其他" value="其他"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资费类型：" prop="expenses">
        <el-radio v-model="expensesRadio" label="免费">免费</el-radio>
        <el-radio v-model="expensesRadio" label="付费">付费</el-radio>
      </el-form-item>
      <el-form-item label="应用价格￥：" prop="price" v-show="priceShow">
        <el-input v-model="value.price">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
    </el-card>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>版权证明</span>
      </div>
      <el-form-item label="版权证明" prop="copyright">
        <el-upload
          action
          accept=".jpg, .jpeg, .png"
          list-type="picture-card"
          :auto-upload="false"
          :multiple="true"
          :limit="5"
          :on-exceed="handleExceed"
          :on-change="handleCopyrightUpload"
          :http-request="uploadCopyright"
          ref="copyright"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePreview(file, 'copyright')"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                class="el-upload-list__item-delete"
                @click="handleDelete(file, 'copyright')"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="crDialogVisible">
          <img width="100%" :src="crDialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <div class="remark">
        请提供相关版权证明，如：
        <ul>
          <li>
            开发者资质：个人开发者上传个人手持身份证照片，公司开发者上传公司营业执照。（如不是本账号注册的资质需要再提供）
          </li>
          <li>
            软件著作权：提供扫描件或加盖公章的原件高清拍照相片（大小2M以内，JPG/PNG格式的图片），软件著作权中的应用名称请与您上传的应用名称相符。
          </li>
          <li>
            其他特殊行业（金融、理财、彩票、传媒、杂志、新闻、医疗保健类），需要提供各个行业相应资质证明
            <a class="old-link" href="#">详情</a>
          </li>
        </ul>
      </div>
    </el-card>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>上架</span>
      </div>
      <el-form-item label="发布类型：" prop="publish">
        <el-radio v-model="publishRadio" label="1">审核后立即发布</el-radio>
        <el-radio v-model="publishRadio" label="2">定时发布</el-radio>
      </el-form-item>
      <el-form-item label="发布日期：" prop="onSaleDateStr" v-show="dateShow">
        <el-date-picker
          v-model="value.onSaleDateStr"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions0"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="备注：" prop="remarks">
        <el-input
          type="textarea"
          :rows="3"
          lmit
          v-model="value.remarks"
          maxlength="60"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-card>
    <el-form-item style="text-align: center">
      <el-button type="primary" size="medium" @click="handlePre()"
        >上一步，上传安装包</el-button
      >
      <el-button type="primary" size="medium" @click="handleNext()"
        >下一步，提交申请</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { categoryTreeList, applyApp } from "@/api/ams/app";
import Tinymce from "@/components/Tinymce";

export default {
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  components: { Tinymce },
  created() {
    this.value.pics.length = 0;
    this.value.copyright.length = 0;
    if (this.isEdit) {
      this.previewEdit();
    } else {
      this.initAppCategory();
    }
  },
  mounted() {
    // 去除Tinymce的upload按钮
    document.querySelector(".editor-custom-btn-container").remove();
  },
  data() {
    return {
      formData: new FormData(),
      toolbar: ["preview"],
      expensesRadio: "免费",
      publishRadio: "1",
      logoUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      crDialogImageUrl: "",
      crDialogVisible: false,
      priceShow: false,
      dateShow: false,
      options: [],
      props: {
        value: "id",
        label: "categoryName",
      },
      pickerOptions0: {
        disabledDate(time) {
          return (
            time.getTime() < Date.now() + 1000 * 60 * 60 * 24 ||
            time.getTime() > Date.now() + 1000 * 60 * 60 * 24 * 90
          );
        },
      },
      rules: {
        name: [{ required: true, message: "请输入应用名称", trigger: "blur" }],
        category: [
          {
            type: "array",
            required: true,
            message: "请选择应用类型",
            trigger: "change",
          },
        ],
        keywords: [
          { required: true, message: "请输入1-4个中文关键词", trigger: "blur" },
          {
            pattern: /^([\u4e00-\u9fa5]{1,5})(([,，][\u4e00-\u9fa5]{1,5}){0,3})/,
            message: "请输入1-4个中文关键词并且用逗号隔开",
            trigger: "blur",
          },
        ],
        advertisement: [
          { required: true, message: "请输入一句广告词", trigger: "blur" },
        ],
        detailDesc: [
          { required: true, message: "请填写应用简介", trigger: "blur" },
        ],
        github: [
          {
            pattern: /^(https:\/\/github.com\/)[a-z]+/,
            message: "Github地址不合法",
            trigger: "blur",
          },
        ],
        logo: [{ required: true, message: "请上传应用LOGO" }],
        pics: [
          { required: true, message: "请上传应用截图" },
          { type: "array", min: 3, message: "至少上传三张应用截图" },
        ],
        language: [
          { required: true, message: "请选择应用语言", trigger: "blur" },
        ],
        expenses: [
          { required: true, message: "请选择资费类型", trigger: "blur" },
        ],
        price: [],
        copyright: [{ required: true, message: "请上传版权证明" }],
        publish: [
          { required: true, message: "请选择发布类型", trigger: "blur" },
        ],
        onSaleDateStr: [],
      },
    };
  },
  watch: {
    expensesRadio: function (val) {
      this.value.expenses = val;
      if (val == "付费") {
        this.priceShow = true;
        this.rules.price.push(
          "{ required: true, message: '请填写价格', trigger: 'blur' }"
        );
      } else {
        this.formData.delete("price");
        this.value.price = "";
        this.priceShow = false;
        this.rules.price.pop();
      }
    },
    publishRadio: function (val) {
      if (val == "2") {
        this.dateShow = true;
        this.rules.onSaleDateStr.push(
          "{ required: true, message: '请选择上架日期', trigger: 'blur' }"
        );
      } else {
        this.formData.delete("onSaleDateStr");
        this.value.onSaleDateStr = "";
        this.dateShow = false;
        this.rules.onSaleDateStr.pop();
      }
    },
  },
  methods: {
    // 修改预填
    previewEdit() {},
    // 加载应用分类联动框
    initAppCategory() {
      categoryTreeList().then((res) => {
        this.options = res.data;
      });
    },
    // logo上传钩子
    handleLogoUpload(file, fileList) {
      if (file.status == "ready" && this.limitSize(file, "logo")) {
        this.logoUrl = URL.createObjectURL(file.raw);
        this.value.logo = file.name;
      }
    },
    // logo上传行为
    uploadLogo(file) {
      if (file.name != "") {
        this.formData.set("logoFile", file.file);
      }
    },
    // 应用截图上传行为
    handlePictureCardUpload(file, fileList) {
      if (file.status == "ready" && this.limitSize(file, "logo")) {
        this.value.pics.push(file.name);
      }
    },
    // 应用截图上传行为
    uploadPictureCard(file) {
      if (
        file.name != "" &&
        this.value.pics.findIndex((f) => f == file.name) < 0
      ) {
        this.formData.append("picsFiles", file.file);
      }
    },
    // 版权证明选择文件后钩子
    handleCopyrightUpload(file) {
      if (file.status == "ready" && this.limitSize(file, "copyright")) {
        this.value.copyright.push(file.name);
      }
    },
    // 版权证明上传行为
    uploadCopyright(file) {
      if (
        file.name != "" &&
        this.value.copyright.findIndex((f) => f == file.name) < 0
      ) {
        this.formData.append("copyrightFiles", file.file);
      }
    },
    // 点击放大镜
    handlePreview(file, type) {
      if (type == "copyright") {
        this.crDialogImageUrl = file.url;
        this.crDialogVisible = true;
      } else {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    },
    // 文件超过个数限制
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    // 限制图片大小
    limitSize(file, type) {
      let isLt2M = "";
      let message = "超过文件大小限制";
      if (type == "logo") {
        isLt2M = file.size / 1024 < 200;
        message = "上传头像图片大小不能超过 200KB!";
      } else if (type == "pics") {
        isLt2M = file.size / 1024 / 1024 < 1;
        message = "应用截图单张图片大小不能超过 1MB!";
      } else if (type == "copyright") {
        isLt2M = file.size / 1024 / 1024 < 1;
        message = "版权证明单张图片大小不能超过 1MB!";
      }
      if (!isLt2M) {
        this.$message.error(message);
      }
      return isLt2M;
    },
    handleDelete(file, type) {
      if (type == "copyright") {
        this.$refs.copyright.handleRemove(file);
        this.value.copyright = this.value.copyright.filter(
          (item) => item != file.name
        );
      } else {
        this.$refs.pics.handleRemove(file);
        this.value.pics = this.value.pics.filter((item) => item != file.name);
      }
    },
    handlePre() {
      this.$emit("preStep");
    },
    handleNext() {
      this.$refs["appInfoForm"].validate((valid) => {
        if (valid) {
          this.formData.delete("logoFile");
          this.formData.delete("picsFiles");
          this.formData.delete("copyrightFiles");
          this.$refs.logo.submit();
          this.$refs.pics.submit();
          this.$refs.copyright.submit();
          for (let key in this.value) {
            if (this.value[key].length <= 0) continue;
            else this.formData.set(key, this.value[key]);
          }
          applyApp(this.formData).then((res) => {
            this.$emit("nextStep");
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.box-card {
  border-top: 1px solid #25d19d;
}
.remark {
  color: #909399;
}
ol {
  line-height: 20px;
  padding-left: 10px;
}
.logo-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.logo-uploader .el-upload:hover {
  border-color: #409eff;
}
.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.logo {
  width: 100px;
  height: 100px;
  display: block;
}
/* 应用截图上传 */
.el-upload-list__item-thumbnail {
  width: 128px;
  height: 200px;
}
</style>