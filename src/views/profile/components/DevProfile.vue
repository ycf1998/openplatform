<template>
  <div class="info-table">
    <span style="color:red">注：若有疑问或想更改请联系客服！</span>
    <div class="info-item">
      <span class="info-label">开发者类型</span>
      <span class="info">{{user.typeName}}</span>
    </div>
    <div class="info-item">
      <span class="info-label">开发者资质</span>
      <span class="info">{{user.activation == 1 ? "已激活": "未激活"}}</span>
    </div>
    <div class="info-item">
      <span class="info-label">appId</span>
      <span class="info">{{dev.appId}}</span>
    </div>
    <div class="info-item">
      <span class="info-label">appKey</span>
      <span class="info">{{dev.appKey}}</span>
    </div>
    <template v-if="user.type===1">
      <div class="info-item">
        <span class="info-label">真实姓名</span>
        <span class="info">{{dev.realName}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">身份证号码</span>
        <span class="info">{{dev.idCard}}</span>
      </div>
    </template>
    <template v-else>
      <div class="info-item">
        <span class="info-label">公司名称</span>
        <span class="info">{{dev.companyName}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">营业执照注册号</span>
        <span class="info">{{dev.businessLicenseRegNumber}}</span>
      </div>
    </template>
    <div class="info-item">
      <span class="info-label">银行卡户主</span>
      <span class="info">{{dev.cardholder}}</span>
    </div>
    <div class="info-item">
      <span class="info-label">银行卡类型</span>
      <span class="info">{{dev.bankCardType}}</span>
    </div>
    <div class="info-item">
      <span class="info-label">银行卡号</span>
      <span class="info">{{dev.bankCardNumber}}</span>
    </div>
  </div>
</template>

<script>
import { getDevProfile } from "@/api/user";

export default {
  name: "userProfile",
  data() {
    return {
      dev: {
        appId: "",
        appKey: "",
        realName: "",
        idCard: "",
        companyName: "",
        businessLicenseRegNumber: "",
        bankCardType: "",
        bankCardNumber: ""
      }
    };
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          typeName: "",
          activation: 0
        };
      }
    }
  },
  created() {
    getDevProfile(this.$store.getters.type).then(res => {
      this.dev = res.data.dev;
    });
  }
};
</script>

<style lang="scss" scope>
.info-table {
  display: table;
  height: 100%;
  .info-item {
    display: table-row;
    .info-label {
      display: table-cell;
      padding: 20px 80px 0 20px;
      color: #909399;
    }
  }
}
</style>