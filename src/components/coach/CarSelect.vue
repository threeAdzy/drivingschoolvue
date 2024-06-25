<template>
  <div class="dashboard">
    <div class="container">
      <div class="tableBar">
        <el-button type="primary" plain round @click="() => this.$router.go(-1)"
          >返回上一级页面</el-button
        >
        <el-badge :value="applyNO" class="item" style="float: right">
          <el-button @click="() => this.$router.push('/apply/CoachApply')"
            >未受理申请</el-button
          >
        </el-badge>
        <hr />
        <label style="margin-right: 5px"> 车牌号: </label>
        <el-input
          clearable
          v-model="carNumber"
          placeholder="请输入车牌号"
          style="width: 15%"
        /><el-select
          v-model="state"
          style="margin-left: 25px; width: 10%"
          clearable
          placeholder="选择状态"
        >
          <el-option
            v-for="item in status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary" style="margin-left: 25px" @click="coachCarPage()"
          >查询</el-button
        >
      </div>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="rowStyle"
      >
        <el-table-column prop="carId" label="ID"> </el-table-column>
        <el-table-column prop="carNumber" label="车牌号"> </el-table-column>

        <el-table-column prop="cocahImg" label="车辆照片">
          <template slot-scope="{ row }">
            <el-image
              style="width: 40px; height: 40px; border: none; cursor: pointer"
              :src="row.carImg"
            >
              <div slot="error" class="image-slot">
                <img
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                  style="width: auto; height: 40px; border: none"
                />
              </div>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column prop="carState" label="车辆状态" sortable>
          <template slot-scope="scope">
            {{
              scope.row.carState === 0
                ? "空闲"
                : scope.row.carState === 1
                ? "使用中"
                : "维修中"
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="applyCar(scope.row)"
              v-show="scope.row.carState === 0"
              >选择车辆</el-button
            >
            <el-button
              type="text"
              disabled
              v-show="scope.row.carState === 1 || scope.row.carState === 2"
              >不可用</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="counts"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "CarSelect",

  data() {
    return {
      lv: Number,
      page: 1, //页码
      pageSize: 5, //每页记录数
      carNumber: "", //车牌号，对应输入框
      applyNO: Number, //未受理申请数量
      counts: Number,
      tableData: [],
      status: [
        {
          value: 0,
          label: "空闲",
        },
        {
          value: 1,
          label: "使用",
        },
        {
          value: 2,
          label: "维修",
        },
      ],
      state: "", //状态
    };
  },

  mounted() {},

  methods: {
    rowStyle() {
      return "text-align:center";
    },
    //查询未受理申请数量
    async coachApplyNo() {
      await this.$axios
        .get("/api/coach/ApplyNo", {
          params: {
            lv: this.lv,
          },
          headers: {
            token: sessionStorage.getItem("token"),
          },
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            // this.tableData = res && res.data && res.data.records;
            // this.counts = Number(res.data.total);
            this.applyNO = res.data;
          }
          console.log(res);
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },

    //选择车辆申请
    applyCar(row) {
      console.log(row.carId);
      this.$confirm("您确定要申请使用该车辆吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios
          .post(
            "/api/coach/applyCar",
            {
              contentId: row.carId,
              lv: this.lv,
            },
            {
              headers: { token: sessionStorage.getItem("token") },
            }
          )
          .then((res) => res.data)
          .then((res) => {
            if (res.code == 1) {
              console.log(res);
              this.$message.success("申请已发送，等待管理员处理。");
              //   this.adminCoachPage();
              //   this.$router.push("/MyViewCoach");
              this.applyNO++;
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((error) => {
            console.log(error.response);
          });
      });
    },
    //汽车分页
    async coachCarPage() {
      await this.$axios
        .get("/api/coach/car/page", {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            carNumber: this.carNumber,
            carState: this.state,
            // name: this.name,
          },
          headers: {
            token: sessionStorage.getItem("token"),
          },
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            this.tableData = res && res.data && res.data.records;
            this.counts = Number(res.data.total);
          }
          console.log(this.tableData);
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },
    //翻页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page = 1;
      this.pageSize = val;
      this.coachCarPage();
    },
    //翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.coachCarPage();
    },
  },
  created() {
    this.lv = this.$route.query.lv;
    this.coachCarPage();
    this.coachApplyNo();
  },
};
</script>
<style scoped>
.container {
  background: #fff;
  position: relative;
  z-index: 1;
  padding: 20px 28px;
  border-radius: 4px;
}
.tableBar {
  margin-bottom: 20px;
}
.tableLab {
  float: right;
}
</style>
