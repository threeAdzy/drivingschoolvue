<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <el-button type="primary" plain round @click="() => this.$router.go(-1)"
          >返回上一级页面</el-button
        >
        <el-badge :value="applyNO" class="item" style="float: right">
          <el-button @click="() => this.$router.push('/apply/UserApply.vue')"
            >未受理申请</el-button
          >
        </el-badge>
        <hr />
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

        <el-button type="primary" style="margin-left: 25px" @click="UserSelectCoachPage()"
          >查询</el-button
        >
        <el-button
          round
          type="info"
          style="float: right"
          plain
          disabled
          v-show="this.coachId != null"
          >当前教练：{{ this.coachName }}</el-button
        >
      </div>
      <!-- 表格表头居中 -->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="rowStyle"
      >
        <el-table-column prop="coachId" label="ID"> </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
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
        ><el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            {{ scope.row.sex === 0 ? "男" : "女" }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系方式"> </el-table-column>
        <el-table-column prop="age" label="年龄"> </el-table-column>
        <el-table-column prop="avgScore" label="平均评分" width="150">
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row.avgScore"
              v-show="scope.row.avgScore != null && scope.row.avgScore != 0"
              disabled
              show-score
              text-color="#ff9900"
            >
            </el-rate>
            <span v-show="scope.row.avgScore == null || scope.row.avgScore == 0"
              >暂无评分</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="scoreNumber" label="评分人数"> </el-table-column>

        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            {{ scope.row.state === 0 ? "在职" : "离职" }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="selectCoach(scope.row)"
              v-show="scope.row.state === 0"
              >选择教练</el-button
            >
            <el-button type="text" disabled v-show="scope.row.state === 1"
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
// import { number } from 'echarts';

export default {
  name: "CoachSelect",

  data() {
    return {
      page: 1, //页码
      pageSize: 5, //每页记录数
      name: "", //教练姓名，对应输入框
      counts: Number,
      tableData: [],
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
      value: "",
      //学员的部分信息用于申请更换教练。
      coachId: "",
      coachImg: "",
      coachName: "",
      lv: "",
      applyNO: 0,
    };
  },

  mounted() {},

  methods: {
    //选择教练
    async selectCoach(row) {
      console.log(row.coachId);
      if (row.coachId == this.coachId) {
        this.$message("您已经选择了该教练，请勿再次选择！");
      } else if (this.coachId != null) {
        this.$confirm("您已经有教练了，确定向管理员申请更换教练吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          // this.$message.error("adasdsadadsadasdas");
          this.applyCoach(row.coachId);
        });
      } else {
        await this.$axios
          .post(
            "/api/user/selectCoach",
            {
              coachId: row.coachId,
            },
            {
              headers: { token: sessionStorage.getItem("token") },
            }
          )
          .then((res) => res.data)
          .then((res) => {
            if (res.code == 1) {
              console.log(res);
              this.$message.success("选择教练成功！自动跳转至我的教练");
              //   this.adminCoachPage();
              this.$router.push("/MyViewCoach");
            }
          })
          .catch((error) => {
            console.log(error.response);
          });
      }
    },

    //更换教练申请
    async applyCoach(coachId) {
      console.log(coachId);
      await this.$axios
        .post(
          "/api/user/applyCoach",
          {
            contentId: coachId,
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
    },

    //教练评分分页查询
    async UserSelectCoachPage() {
      await this.$axios
        .get("/api/user/coach/ScorePage", {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            name: this.name,
            sex: this.value,
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
            console.log(res);
          }
          console.log(this.tableData);
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },
    // 获取当前教练和学员自己权限级别
    async getUserInfo() {
      await this.$axios
        .get("/api/user/info", {
          headers: {
            token: sessionStorage.getItem("token"),
          },
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            this.coachId = res.data.coachId; //当前学员的教练id
            this.coachImg = res.data.coachImg;
            this.coachName = res.data.coachName;
            this.lv = res.data.lv;
            console.log("成功", res.data);
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },
    //查询未受理申请数量
    async userApplyNo() {
      await this.$axios
        .get("/api/user/ApplyNo", {
          params: {
            lv: 2,
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
    //翻页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page = 1;
      this.pageSize = val;
      this.UserSelectCoachPage();
    },
    //翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.UserSelectCoachPage();
    },
    // <!-- 表格表头居中 -->
    rowStyle() {
      return "text-align:center";
    },
    MyCoach() {
      this.$router.push("/MyViewCoach");
    },
  },
  created() {
    this.getUserInfo();
    this.UserSelectCoachPage();
    this.userApplyNo();
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
