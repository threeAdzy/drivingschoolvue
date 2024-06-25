<template>
  <div class="dashboard-container">
    <el-dialog title="注意事项" :visible.sync="centerDialogVisible" width="30%" center>
      <span style="color: crimson; margin-top: 25px; padding: 5px"
        >1：账号只有在禁用状态下才能被删除。</span
      ><br />
      <span style="color: crimson; margin-top: 25px; padding: 5px">
        2：只建议删除完成全部科目的用户。</span
      ><br />
      <span style="color: crimson; margin-top: 25px; padding: 5px">
        3：删除用户后除评分外所有相关信息都会删除。</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <div class="container">
      <div class="tableBar">
        <el-button type="primary" plain round @click="AccountManageCoach()"
          >切换到教练账号管理</el-button
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
          v-model="userName"
          placeholder="请输入学员姓名"
          style="width: 13%"
        />

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
        <el-select
          v-model="classify"
          style="margin-left: 25px; width: 12%"
          clearable
          placeholder="选择驾照类别"
        >
          <el-option v-for="item in classifies" :key="item.value" :value="item.value">
          </el-option>
        </el-select>
        <el-checkbox
          v-model="allsubjects"
          label="完成全部科目"
          style="margin-left: 25px"
          border
        ></el-checkbox>
        <el-button type="primary" style="margin-left: 25px" @click="adminUserPage()"
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
        <el-table-column prop="userId" label="ID" width="50"> </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>

        <el-table-column prop="userImg" label="照片">
          <template slot-scope="{ row }">
            <el-image
              style="width: 40px; height: 40px; border: none; cursor: pointer"
              :src="row.userImg"
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
        <el-table-column prop="classify" label="驾驶证类别"> </el-table-column>
        <el-table-column prop="subjectOne" label="科目一">
          <template slot-scope="scope">
            {{ scope.row.subjectOne === 1 ? "通过" : "未通过" }}
          </template>
        </el-table-column>
        <el-table-column prop="subjectTwo" label="科目二">
          <template slot-scope="scope">
            {{ scope.row.subjectTwo === 1 ? "通过" : "未通过" }}
          </template>
        </el-table-column>
        <el-table-column prop="subjectThree" label="科目三">
          <template slot-scope="scope">
            {{ scope.row.subjectThree === 1 ? "通过" : "未通过" }}
          </template>
        </el-table-column>
        <el-table-column prop="subjectFour" label="科目四">
          <template slot-scope="scope">
            {{ scope.row.subjectFour === 1 ? "通过" : "未通过" }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系方式" width="120"> </el-table-column>

        <el-table-column prop="coachName" label="所属教练"> </el-table-column>

        <el-table-column prop="state" label="帐号状态">
          <template slot-scope="scope">
            {{ scope.row.state === 0 ? "启用中" : "已禁用" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="StartOrStop(scope.row)">
              {{ scope.row.state === 1 ? "启用" : "禁用" }}</el-button
            >
            <el-popconfirm
              @confirm="delUser(scope.row)"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除该用户吗？"
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
  name: "DrivingschoolvueAccountManage",

  data() {
    return {
      centerDialogVisible: false,
      allsubjects: false,
      page: 1, //页码
      pageSize: 5, //每页记录数
      userName: "", //学员姓名，对应输入框
      counts: Number,
      tableData: [],
      state: "",
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
      classify: null, //驾照类别
      classifies: [
        {
          value: "C2",
        },
        {
          value: "C1",
        },
        {
          value: "B2",
        },
        {
          value: "B1",
        },
        {
          value: "A3",
        },
        {
          value: "A2",
        },
        {
          value: "A1",
        },
      ],
    };
  },

  mounted() {},

  methods: {
    rowStyle() {
      return "text-align:center";
    },
    //跳转到教练账号管理
    AccountManageCoach() {
      this.$router.push("/accountManageCoach");
    },
    //删除用户判断
    delUser(row) {
      if (row.state == 1) {
        if (
          row.subjectOne == 1 &&
          row.subjectTwo == 1 &&
          row.subjectThree == 1 &&
          row.subjectFour == 1
        ) {
          this.deleteUser(row.userId);
        } else {
          this.$confirm("该用户尚未完成所有科目, 是否继续删除?", "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })

            .then(() => {
              //调用删除函数
              this.deleteUser(row.userId);
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
    },

    //真正删除用户

    deleteUser(userId) {
      this.$axios
        .delete("/api/admin/deluser", {
          params: {
            userId: userId,
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
              message: "删除用户成功",
            });
            this.adminUserPage();
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
      // console.log(userId);
    },
    //更改账号状态
    async StartOrStop(row) {
      await this.$confirm("确认要修改当前学员账号状态吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const p = {
          userId: row.userId,
          state: !row.state ? 1 : 0,
        };
        this.$axios
          .post(
            "/api/admin/userstatus",
            {
              state: p.state,
              userId: p.userId,
            },
            {
              headers: { token: sessionStorage.getItem("token") },
            }
          )
          .then((res) => res.data)
          .then((res) => {
            if (res.code == 1) {
              console.log(res);
              this.$message.success("学员账号状态修改成功！");
              this.adminUserPage();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((error) => {
            console.log(error.response);
          });
      });
    },
    //管理员查询用户分页
    adminUserPage() {
      this.$axios
        .get("/api/admin/user/page", {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            coachName: this.coachName,
            userName: this.userName,
            sex: this.value,
            state: this.state,
            allsubjects: this.allsubjects,
            classify: this.classify,
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
      this.adminUserPage();
    },
    //翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.adminUserPage();
    },
  },
  created() {
    this.adminUserPage();
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
