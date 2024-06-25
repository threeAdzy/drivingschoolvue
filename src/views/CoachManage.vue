<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label style="margin-right: 5px"> 教练姓名: </label>
        <el-input
          clearable
          v-model="name"
          placeholder="请输入教练姓名"
          style="width: 15%"
        />

        <el-select
          v-model="value"
          style="margin-left: 25px; width: 10%"
          clearable
          placeholder="选择性别"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="state"
          style="margin-left: 25px; width: 10%"
          clearable
          placeholder="帐号状态"
        >
          <el-option
            v-for="item in status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary" style="margin-left: 25px" @click="adminCoachPage()"
          >查询</el-button
        >
        <el-button type="primary" style="float: right" @click="addCoach()"
          >+添加教练</el-button
        >
      </div>

      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="rowStyle"
      >
        <el-table-column prop="coachId" label="ID" width="100"> </el-table-column>
        <el-table-column prop="name" label="姓名" width="100"> </el-table-column>
        <el-table-column prop="coachImg" label="照片">
          <template slot-scope="{ row }">
            <el-image
              style="width: 40px; height: 40px; border: none; cursor: pointer"
              :src="row.coachImg"
            >
              <div slot="error" class="image-slot">
                <img
                  src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
                  style="width: auto; height: 40px; border: none"
                />
              </div>
            </el-image>
          </template> </el-table-column
        ><el-table-column prop="sex" label="性别" width="100">
          <template slot-scope="scope">
            {{ scope.row.sex === 0 ? "男" : "女" }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系方式" width="140"> </el-table-column>
        <el-table-column prop="age" label="年龄" width="100"> </el-table-column>
        <el-table-column prop="carNumber" label="分配车辆"> </el-table-column>
        <el-table-column prop="carImg" label="车辆照片">
          <template slot-scope="{ row }">
            <el-image
              style="width: 40px; height: 40px; border: none; cursor: pointer"
              :src="row.carImg"
              v-show="row.carNumber != null"
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
        <el-table-column prop="state" label="帐号状态">
          <template slot-scope="scope">
            {{ scope.row.state === 0 ? "启用中" : "已禁用" }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope"
            ><el-button type="text" @click="StartOrStop(scope.row)">
              {{ scope.row.state === 1 ? "启用" : "禁用" }}</el-button
            >
            <el-button type="text" @click="UpdateCoach(scope.row)">修改</el-button>
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
  name: "CoachManage",

  data() {
    return {
      page: 1, //页码
      pageSize: 5, //每页记录数
      name: null, //教练姓名，对应输入框
      counts: Number,
      tableData: [],
      state: "",
      //   total: null,
      options: [
        {
          value: 0,
          label: "男",
        },
        {
          value: 1,
          label: "女",
        },
      ],
      status: [
        {
          value: 0,
          label: "启用中",
        },
        {
          value: 1,
          label: "已禁用",
        },
      ],
      value: "",
    };
  },

  mounted() {},

  methods: {
    rowStyle() {
      return "text-align:center";
    },

    //教练分页查询
    async adminCoachPage() {
      await this.$axios
        .get("/api/admin/coach/page", {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            name: this.name,
            sex: this.value,
            state: this.state,
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
      this.adminCoachPage();
    },
    //翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.adminCoachPage();
    },
    //增加教练
    addCoach() {
      this.$router.push("/coach/AddCoach");
    },
    //修改教练
    UpdateCoach(row) {
      //跳转到修改页面，通过地址栏传递参数
      this.$router.push({
        path: "/coach/AddCoach",
        query: { coach: row },
      });
    },

    //更改账号状态
    async StartOrStop(row) {
      await this.$confirm("确认要修改当前教练账号的状态吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const p = {
          coachId: row.coachId,
          state: !row.state ? 1 : 0,
        };
        this.$axios
          .post(
            "/api/admin/coachstatus",
            {
              state: p.state,
              coachId: p.coachId,
            },
            {
              headers: { token: sessionStorage.getItem("token") },
            }
          )
          .then((res) => res.data)
          .then((res) => {
            if (res.code == 1) {
              console.log(res);
              this.$message.success("教练账号状态修改成功！");
              this.adminCoachPage();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((error) => {
            console.log(error.response);
          });
      });
    },
  },
  created() {
    this.adminCoachPage();
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
/* span {
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  padding: 0 20px;
  /* color: $gray-2; */
/* } */
</style>
