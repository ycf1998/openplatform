<template>
  <div>
    <el-col :span="5">
    <el-form-item prop="province">
      <el-select v-model="province" placeholder="省/直辖市" @change="provinceChanged">
        <el-option v-for="item in provinces" :key="item.code" :label="item.name" :value="item.name"></el-option>
      </el-select>
    </el-form-item>
    </el-col>
    <el-col :span="5" :push="1">
    <el-form-item prop="city">
      <el-select v-model="city" placeholder="市/地区" @change="cityChanged">
        <el-option v-for="item in cities" :key="item.code" :label="item.name" :value="item.name"></el-option>
      </el-select>
    </el-form-item>
    </el-col>
  </div>
</template>
<script>
import pc from "./pc.json"; // 不带编码
import pcc from "./pc-code.json"; // 带编码

export default {
  name: "ProvinceCity",
  props: {
    defalutProvince: {
      type: String,
      default: ""
    },
    defalutCity: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      province: "",
      city: "",
      provinces: [],
      cities: []
    };
  },
  created() {
    this.provinces = pcc;
  },
  mounted() {
    this.province = this.defalutProvince;
    this.provinceChanged(this.defalutProvince);
    this.city = this.defalutCity;
  },
  methods: {
    provinceChanged(value) {
      for (var item of this.provinces) {
        if (item.name == value) {
          this.cities = item.children;
          this.city = "";
          break;
        }
      }
      this.$emit("selectChange", this.province, this.city);
    },
    cityChanged(value) {
      this.$emit("selectChange", this.province, this.city);
    }
  }
};
</script>