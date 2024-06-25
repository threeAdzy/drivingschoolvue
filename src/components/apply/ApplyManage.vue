<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <el-input
          clearable
          v-model="personName"
          placeholder="请输入申请人姓名"
          style="width: 13%"
        />

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
        <el-select
          v-model="type"
          style="margin-left: 20px; width: 10%"
          clearable
          placeholder="选择类型"
        >
          <el-option
            v-for="item in applyType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary" style="margin-left: 25px" @click="adminApplyPage()"
          >查询</el-button
        >
      </div>

      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="rowStyle"
      >
        <el-table-column prop="applyId" label="ID" width="50"> </el-table-column>
        <el-table-column prop="personName" label="姓名" width="70"> </el-table-column>
        <el-table-column prop="personImg" label="照片" width="70">
          <template slot-scope="{ row }">
            <el-image
              style="width: 40px; height: 40px; border: none; cursor: pointer"
              :src="row.personImg"
            >
              <div slot="error" class="image-slot">
                <img
                  src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
                  style="width: auto; height: 40px; border: none"
                />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="lv" label="申请人身份" width="90">
          <template slot-scope="scope">
            {{ scope.row.lv === 1 ? "教练" : "学员" }}
          </template> </el-table-column
        ><el-table-column prop="lv" label="申请类型">
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
        <el-table-column prop="contentName" label="申请目标" width="95">
        </el-table-column>

        <el-table-column prop="createTime" sortable label="申请时间" width="140">
        </el-table-column>

        <el-table-column prop="contentImg" label="目标图像">
          <template slot-scope="{ row }">
            <el-image
              style="width: 40px; height: 40px; border: none; cursor: pointer"
              :src="row.contentImg"
            >
              <div slot="error" class="image-slot" v-show="row.lv == 2">
                <img
                  src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
                  style="width: auto; height: 40px; border: none"
                />
              </div>
              <div slot="error" class="image-slot" v-show="row.lv == 1 || row.lv == 3">
                <img
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                  style="width: auto; height: 40px; border: none"
                />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="申请人电话" width="115"> </el-table-column>
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
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-show="scope.row.applyState === 0"
              @click="applyUpdate(1, scope.row)"
            >
              同意</el-button
            >
            <el-button
              type="text"
              v-show="scope.row.applyState === 0"
              @click="applyUpdate(2, scope.row)"
            >
              驳回</el-button
            >
            <el-button
              type="text"
              v-show="scope.row.applyState !== 0"
              @click="applydelete(scope.row.applyId)"
              >删除记录</el-button
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
  name: "ApplyManage",

  data() {
    return {
      page: 1, //页码
      pageSize: 5, //每页记录数
      counts: Number,
      tableData: [],
      personName: "", //申请人姓名
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
      type: "",
      applyType: [
        {
          value: 1,
          label: "申请车辆",
        },
        {
          value: 2,
          label: "更换教练",
        },
      ],
    };
  },

  mounted() {},
  created() {
    this.adminApplyPage();
  },
  methods: {
    //更新状态
    applyUpdate(state, row) {
      console.log(row);
      console.log(state);
      this.$axios
        .post(
          "/api/admin/applyUpdate",
          {
            applyState: state,
            applyId: row.applyId,
            lv: row.lv,
            contentId: row.contentId,
            personId: row.personId,
          },
          {
            headers: { token: sessionStorage.getItem("token") },
          }
        )
        .then((res) => res.data)
        .then((res) => {
          if (res.code == 1) {
            console.log(res);
            if (state == 1) {
              this.$notify({
                title: "成功",
                message: "已同意申请。",
                type: "success",
              });
            } else {
              this.$notify({
                title: "警告",
                message: "已驳回申请。",
                type: "warning",
              });
            }

            this.adminApplyPage();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    //管理员分页申请查询
    adminApplyPage() {
      this.$axios
        .get("/api/admin/apply/page", {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            applyState: this.state,
            lv: this.type,
            personName: this.personName,
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
    //删除记录
    applydelete(id) {
      console.log(id);
      this.$confirm("确定删除该申请吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios
          .delete("/api/admin/applydelete", {
            params: {
              applyId: id,
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
                message: "删除记录成功",
                type: "success",
              });
              this.adminApplyPage();
            } else {
              this.$message.error("请求出错了：" + res.msg);
            }
          })
          .catch((err) => {
            this.$message.error("请求出错了：" + err.message);
          });
      });
    },
    //翻页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page = 1;
      this.pageSize = val;
      this.adminApplyPage();
    },
    //翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.adminApplyPage();
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
