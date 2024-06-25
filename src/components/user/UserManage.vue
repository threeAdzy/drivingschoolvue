<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <el-input
          clearable
          v-model="userName"
          placeholder="请输入学员姓名"
          style="width: 13%"
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
          v-model="classify"
          style="margin-left: 25px; width: 12%"
          clearable
          placeholder="选择驾照类别"
        >
          <el-option v-for="item in classifies" :key="item.value" :value="item.value">
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
        <el-button type="primary" style="margin-left: 25px" @click="adminUserPage()"
          >查询</el-button
        >
        <el-button type="primary" style="float: right" @click="addUser()"
          >+添加学员</el-button
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
          </template> </el-table-column
        ><el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            {{ scope.row.sex === 0 ? "男" : "女" }}
          </template>
        </el-table-column>
        <el-table-column prop="classify" label="驾照类别"> </el-table-column>
        <!-- <el-table-column prop="subjectOne" label="科目一">
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
        </el-table-column> -->
        <el-table-column prop="phone" label="联系方式" width="120"> </el-table-column>
        <el-table-column prop="identityCard" label="身份证号" width="200">
        </el-table-column>
        <el-table-column prop="coachName" label="所属教练"> </el-table-column>
        <el-table-column prop="coachImg" label="教练头像">
          <template slot-scope="{ row }">
            <el-image
              style="width: 40px; height: 40px; border: none; cursor: pointer"
              :src="row.coachImg"
              v-show="row.coachName != null"
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
        <el-table-column prop="state" label="帐号状态">
          <template slot-scope="scope">
            {{ scope.row.state === 0 ? "启用中" : "已禁用" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="StartOrStop(scope.row)">
              {{ scope.row.state === 1 ? "启用" : "禁用" }}</el-button
            >
            <el-button type="text" @click="UpdateUser(scope.row)">详细信息</el-button>
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
  name: "UserManage",

  data() {
    return {
      page: 1, //页码
      pageSize: 5, //每页记录数
      userName: null, //学员姓名，对应输入框
      counts: Number,
      tableData: [],
      state: "",
      value: "",
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
    //新增用户
    addUser() {
      this.$router.push("/user/AddUser");
    },
    UpdateUser(row) {
      //跳转到修改页面，通过地址栏传递参数
      this.$router.push({
        path: "/user/AddUser",
        query: { user: row },
      });
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
              this.$message.success("教练账号状态修改成功！");
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
          // this.page = 1;
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
    rowStyle() {
      return "text-align:center";
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
