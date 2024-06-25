<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <el-select
          v-model="state"
          style="margin-left: 20px; width: 11%"
          clearable
          placeholder="选择处理状态"
        >
          <el-option
            v-for="item in status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary" style="margin-left: 25px" @click="userApplyPage()"
          >查询</el-button
        >
        <el-button type="primary" style="float: right" @click="applyCoach()"
          >+教练申请</el-button
        >
      </div>

      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="rowStyle"
      >
        <el-table-column prop="lv" label="申请类型">
          <template slot-scope="scope">
            {{
              scope.row.lv === 1
                ? "申请车辆"
                : scope.row.lv === 2
                ? "更换教练"
                : "车辆报修"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="contentName" label="申请目标"> </el-table-column>

        <el-table-column prop="createTime" sortable label="申请时间" width="140">
        </el-table-column>

        <el-table-column prop="contentImg" label="目标图像">
          <template slot-scope="{ row }">
            <el-image
              style="width: 40px; height: 40px; border: none; cursor: pointer"
              :src="row.contentImg"
            >
              <div slot="error" class="image-slot">
                <img
                  src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
                  style="width: auto; height: 40px; border: none"
                />
              </div>
              <!-- <div slot="error" class="image-slot">
                <img
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                  style="width: auto; height: 40px; border: none"
                />
              </div> -->
            </el-image>
          </template>
        </el-table-column>

        <el-table-column prop="adminName" label="处理人"> </el-table-column>
        <el-table-column
          prop="updateTime"
          sortable
          label="处理时间"
          width="140"
        ></el-table-column>
        <el-table-column prop="applyState" label="状态">
          <template slot-scope="scope">
            {{
              scope.row.applyState === 0
                ? "未处理"
                : scope.row.applyState === 1
                ? "已处理"
                : "已驳回"
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-show="scope.row.applyState === 0"
              @click="applydelete(scope.row)"
            >
              撤销申请</el-button
            >
            <el-button type="text" v-show="scope.row.applyState !== 0" disabled
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
  name: "UserApply",

  data() {
    return {
      page: 1, //页码
      pageSize: 5, //每页记录数
      counts: Number,
      tableData: [],

      status: [
        {
          value: 0,
          label: "未处理",
        },
        {
          value: 1,
          label: "已同意",
        },
        {
          value: 2,
          label: "已驳回",
        },
      ],
      state: "", //状态
      //申请类型
    };
  },

  mounted() {},
  created() {
    this.userApplyPage();
  },
  methods: {
    applyCoach() {
      this.$router.push({
        path: "/CoachSelect",
        query: { lv: 2 },
      });
    },
    //撤销申请
    applydelete(row) {
      console.log(row);
      this.$confirm("确定撤回该申请吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios
          .delete("/api/user/applydelete", {
            params: {
              applyId: row.applyId,
            },
            headers: {
              token: sessionStorage.getItem("token"),
            },
          })
          .then((res) => res.data)
          .then((res) => {
            if (res.code === 1) {
              console.log("成功删除");
              this.$notify({
                title: "成功",
                message: "撤销申请成功",
                type: "success",
              });
              this.userApplyPage();
            } else {
              this.$message.error("请求出错了：" + res.msg);
            }
          })
          .catch((err) => {
            this.$message.error("请求出错了：" + err.message);
          });
      });
    },
    // 学员分页申请查询
    userApplyPage() {
      this.$axios
        .get("/api/user/apply/page", {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            applyState: this.state,
            lv: 2,
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
      this.userApplyPage();
    },
    //翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.userApplyPage();
    },
    rowStyle() {
      return "text-align:center";
    },
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
