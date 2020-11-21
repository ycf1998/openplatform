<template>
  <div class="app-container">
    <el-table ref="filterTable" :data="tableData" border style="width: 50%;margin: auto">
      <el-table-column
        prop="createTime"
        label="日期"
        sortable
        width="180"
        column-key="date"
        :filters="dateFilters"
        :filter-method="filterHandler"
      ></el-table-column>
      <el-table-column prop="ip" label="ip地址" width="180"></el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="address"
        label="登录地址"
        :formatter="formatter"
      ></el-table-column>
    </el-table>
    <div class="block" style="text-align: center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {getLoginLog} from "@/api/user"
export default {
  data() {
    return {
      currentPage: 1,
      tableData: [],
      dateFilters: [
        { text: "2016-05-01", value: "2016-05-01" }
      ],
      total: 0
    };
  },
  mounted() {
      getLoginLog().then(res => {
          this.tableData = res.data;
      });
  },
  methods: {
    formatter(row, column) {
      return row.address;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>