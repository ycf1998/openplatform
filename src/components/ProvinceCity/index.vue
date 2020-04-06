<template>
  <div>
    <el-col :span="5" :xs="24" style="padding:0">
      <el-form-item prop="province">
        <el-select v-model="province" placeholder="省/直辖市" @change="provinceChanged">
          <el-option
            v-for="item in provinces"
            :key="item.code"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :sm="{span: 5, offset: 1}" :xs="24" style="padding:0">
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
    defaultProvince: {
      type: String,
      default: ""
    },
    defaultCity: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      provinces: [],
      cities: [],
      // prop是单向传递，只能父给子，所以需要创建副本，值必须由父提供
      province: this.defaultProvince,
      city: this.defaultCity
    };
  },
  created() {
    this.provinces = pcc;
  },
  watch: {
    defaultProvince: function(val) {
      this.province = val;
    },
    defaultCity: function(val) {
      this.city = val;
    }
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