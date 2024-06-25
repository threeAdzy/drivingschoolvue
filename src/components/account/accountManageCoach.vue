<template>
  <div class="dashboard-container">
    <el-dialog title="注意事项" :visible.sync="centerDialogVisible" width="30%" center>
      <span style="color: crimson; margin-top: 25px; padding: 5px"
        >1：账号只有在禁用状态下才能被删除。</span
      ><br />
      <span style="color: crimson; margin-top: 25px; padding: 5px">
        2：只建议删除未被分配学员的教练。</span
      ><br />
      <span style="color: crimson; margin-top: 25px; padding: 5px">
        3：删除教练后所有相关信息（练车记录等）都会清空。</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <div class="container">
      <div class="tableBar">
        <el-button type="primary" plain round @click="AccountManage()"
          >切换到学员账号管理</el-button
        >
        <el-button
          type="danger"
          @click="centerDialogVisible = true"
          style="float: right"
          plain
          round
          >*注意事项</el-button
        >

        <hr />

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

        <el-table-column prop="" label="分配学员">
          <template slot-scope="scope">
            <el-popover trigger="click">
              <el-table
                :data="gridData"
                style="width: 100%"
                :header-cell-style="{ 'text-align': 'center' }"
                :cell-style="rowStyle"
              >
                <el-table-column property="name" label="姓名"></el-table-column>
                <!-- <el-table-column
                  width="100"
                  property="address"
                  label="地址"
                ></el-table-column> -->
              </el-table>
              <el-button
                type="text"
                slot="reference"
                @click="selectUserOfCoach(scope.row.coachId)"
                >查看学员</el-button
              >
            </el-popover>
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

            <el-popconfirm
              @confirm="delCoach(scope.row)"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除该教练吗？"
            >
              <el-button type="text" slot="reference" style="margin-left: 5px"
                >删除</el-button
              >
            </el-popconfirm>
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
  name: "AccountManageCoach",

  data() {
    return {
      nullUser: true,
      centerDialogVisible: false,
      page: 1, //页码
      pageSize: 5, //每页记录数
      name: "", //教练姓名，对应输入框
      counts: Number,
      tableData: [],
      gridData: [],
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

    //查询某个教练的id
    selectUserOfCoach(coachId) {
      this.$axios
        .get("/api/admin/selectUserOfCoach", {
          params: { coachId: coachId },
          headers: {
            token: sessionStorage.getItem("token"),
          },
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            this.gridData = res.data;
            // console.log(this.gridData);
            if (this.gridData.length == 0) {
              this.nullUser = true;
              console.log(this.nullUser);
            }
            // this.counts = Number(res.data.total);
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },

    //跳转到用户账号管理
    AccountManage() {
      this.$router.push("/accountManage");
    },
    //删除教练判断
    delCoach(row) {
      this.nullUser = false;
      this.selectUserOfCoach(row.coachId);
      setTimeout(() => {
        console.log(this.nullUser, "延时器内");
        if (row.state == 1) {
          if (this.nullUser) {
            this.deleteCoach(row.coachId);
          } else {
            this.$confirm("该教练有所属学员, 是否继续删除?", "警告", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })

              .then(() => {
                //调用删除函数
                this.deleteCoach(row.coachId);
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消删除",
                });
              });
          }
        } else {
          this.$message.error("该账号仍在使用中，无法删除！");
        }
      }, 300);
      console.log(this.nullUser, "延时器外");
    },

    //真正删除教练

    deleteCoach(coachId) {
      this.$axios
        .delete("/api/admin/delcoach", {
          params: {
            coachId: coachId,
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
              message: "删除教练成功",
            });
            this.adminCoachPage();
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
      // console.log(userId);
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
</style>
