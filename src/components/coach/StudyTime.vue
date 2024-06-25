<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <el-input
          clearable
          v-model="name"
          placeholder="请输入学员姓名"
          style="width: 15%"
        />

        <el-select
          v-model="value"
          style="margin-left: 7px; width: 10%"
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
          style="margin-left: 7px; width: 12%"
          clearable
          placeholder="选择驾照类别"
        >
          <el-option v-for="item in classifies" :key="item.value" :value="item.value">
          </el-option>
        </el-select>
        <el-select
          v-model="selectSubject"
          style="margin-left: 7px; width: 10%"
          clearable
          placeholder="选择科目"
        >
          <el-option
            v-for="item in subjects"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <!-- <span class="demonstration" style="margin: 0px 10px">选择日期:</span> -->
        <el-date-picker
          v-model="begintime"
          type="date"
          placeholder="开始日期"
          style="margin: 0px 10px; width: 135px"
        >
        </el-date-picker>
        <el-date-picker
          v-model="endtime"
          type="date"
          placeholder="结束日期"
          style="width: 135px"
        >
        </el-date-picker>

        <el-button type="primary" style="margin-left: 25px" @click="coachUserStudyPage()"
          >查询</el-button
        >
        <el-button type="primary" style="float: right" @click="addStudy()"
          >+添加练习安排</el-button
        >
      </div>

      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="rowStyle"
      >
        <!-- <el-table-column prop="coachId" label="ID" width="100"> </el-table-column> -->
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
        <el-table-column prop="subject" label="科目">
          <template slot-scope="scope">
            {{ scope.row.subject === 2 ? "科目二" : "科目三" }}
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间"> </el-table-column>
        <el-table-column prop="endTime" label="结束时间"> </el-table-column>

        <el-table-column prop="phone" label="联系方式"> </el-table-column>
        <el-table-column label="操作">
          <!-- slot-scope="scope" -->
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="exercise(scope.row)">安排练习</el-button> -->

            <el-popconfirm
              @confirm="delStudyById(scope.row)"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除这条练习记录吗？"
            >
              <el-button type="text" slot="reference">删除</el-button>
            </el-popconfirm>
            <!-- <el-button type="text" @click="deleteStudy(scope.row)">删除</el-button> -->
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
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!-- 添加练习弹窗 -->

    <el-dialog title="练习安排" :visible.sync="dialogFormVisible" @close="handleCancle">
      <el-form :model="form" ref="form">
        <el-form-item label="学员姓名：" prop="userId" :label-width="formLabelWidth">
          <!-- <el-input
            placeholder="请输入内容"
            v-model="input"
            :disabled="true"
            v-show="this.userId != null"
          >
          </el-input> -->
          <el-select v-model="form.userId" placeholder="请选择学员" clearable>
            <el-option
              v-for="(item, index) in userList"
              :key="index"
              :label="item.name"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择科目：" :label-width="formLabelWidth">
          <el-radio-group v-model="subject">
            <el-radio :label="2">科目二</el-radio>
            <el-radio :label="3">科目三</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="练习时间：" :label-width="formLabelWidth">
          <el-date-picker
            clearable
            v-model="form.studyDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submintStudy()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "StudyTime",

  data() {
    return {
      //对话框相关
      dialogFormVisible: false,
      form: {
        userId: null,
        name: null,
        studyDate: [],
      },
      formLabelWidth: "120px",
      userList: [],
      subject: Number,
      studyDateChange1: "",
      studyDateChange2: "",
      // input: "",
      //
      //
      //
      //
      coachId: "",
      // userId: "",
      //分割
      selectSubject: "",
      begintime: "",
      endtime: "",
      begintimechange: "",
      endtimechange: "",
      page: 1, //页码
      pageSize: 5, //每页记录数
      name: "", //学员姓名，对应输入框
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
      value: "", //性别
      subjects: [
        {
          value: 2,
          label: "科目二",
        },
        {
          value: 3,
          label: "科目三",
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
  // watch: {
  //   // 此处监听variable变量，当期有变化时执行
  //   dialogFormVisible(item1, item2) {
  //     this.userId = null;
  //     console.log(item1, item2);
  //   },
  // },
  mounted() {},

  methods: {
    // abc() {
    //   console.log(this.value1[0]);
    //   console.log(this.value1[1]);
    // },
    // clearUserId() {
    //   this.dialogFormVisible = false;
    //   if (this.dialogFormVisible == false) {
    //     this.userId = null;
    //     console.log(this.userId);
    //   }
    // },
    rowStyle() {
      return "text-align:center";
    },
    handleCancle() {
      this.$refs.form.resetFields();
      this.dialogFormVisible = false;
      // this.form = null;
      this.subject = null;
      this.form.studyDate = null;
    },
    // 删除练车时间安排
    delStudyById(row) {
      console.log(row);
      this.$axios
        .delete("/api/coach/delStudy", {
          params: {
            studyId: row.studyId,
          },
          headers: {
            token: sessionStorage.getItem("token"),
          },
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            this.$notify({
              title: "成功",
              message: "删除练习时间成功",
            });
            this.coachUserStudyPage();
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },
    submintStudy() {
      if (
        this.form.studyDate == null ||
        this.subject == null ||
        this.form.userId == null ||
        this.form.userId == ""
      ) {
        this.$message.error("请将信息填写完整！");
      } else {
        this.newStudy();
        // this.dialogFormVisible = false;
        // this.form = null;
        // console.log(this.form);
      }
    },
    //新增练习安排
    async newStudy() {
      this.newTimeChenge();
      await this.$axios
        .post(
          "/api/coach/newstudy",
          {
            userId: this.form.userId,
            begin: this.studyDateChange0,
            end: this.studyDateChange1,
            subject: this.subject,
          },
          {
            headers: { token: sessionStorage.getItem("token") },
          }
        )
        .then((res) => res.data)
        .then((res) => {
          if (res.code == 1) {
            console.log(res);

            this.dialogFormVisible = false;
            this.coachUserStudyPage();
            this.$notify({
              title: "成功",
              message: "添加练习成功",
              type: "success",
            });
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    //练习分页
    async coachUserStudyPage() {
      this.timeChange();
      await this.$axios
        .get("/api/coach/user/studypage", {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            name: this.name,
            sex: this.value,
            coachId: this.coachId,
            userId: this.userId,
            begin: this.begintimechange,
            end: this.endtimechange,
            subject: this.selectSubject,
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
            this.begintimechange = null;
            this.endtimechange = null;
          }
          // console.log(this.begintime.getTime());
          console.log(this.tableData);
          // this.coachId = "";
          // this.userId = "";
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },
    //查询时间转时间戳
    timeChange() {
      // console.log(this.begintime);
      if (this.begintime == "" || this.begintime == null) {
        console.log();
      } else {
        this.begintimechange = this.begintime.getTime();
      }
      if (this.endtime == "" || this.endtime == null) {
        console.log();
      } else {
        this.endtimechange = this.endtime.getTime();
      }
    },
    //新增练习转时间戳
    newTimeChenge() {
      if (this.form.studyDate[0] == "" || this.form.studyDate[0] == null) {
        console.log();
      } else {
        this.studyDateChange0 = this.form.studyDate[0].getTime();
      }
      if (this.form.studyDate[1] == "" || this.form.studyDate[1] == null) {
        console.log();
      } else {
        this.studyDateChange1 = this.form.studyDate[1].getTime();
      }
    },

    addStudy() {
      this.dialogFormVisible = true;
      // this.selectUserName();
      // if (this.userId != null) {
      //   this.selectIdinfo();
      // }
    },
    //根据userid查用户信息
    // async selectIdinfo() {
    //   await this.$axios
    //     .get("/api/coach/userId", {
    //       params: {
    //         userId: this.userId,
    //       },
    //       headers: {
    //         token: sessionStorage.getItem("token"),
    //       },
    //     })
    //     .then((res) => res.data)
    //     .then((res) => {
    //       if (res.code === 1) {
    //         this.input = res && res.data.name;
    //         console.log(this.input);
    //       }
    //     })
    //     .catch((err) => {
    //       this.$message.error("请求出错了：" + err.message);
    //     });
    // },

    //查询学员列表
    async selectUserName() {
      await this.$axios
        .get("/api/coach/userName", {
          headers: {
            token: sessionStorage.getItem("token"),
          },
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            this.userList = res && res.data;
            console.log(this.userList);
          }
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
      this.coachUserStudyPage();
    },
    //翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.coachUserStudyPage();
    },
  },

  created() {
    this.coachId = this.$route.query.coachId;
    // this.userId = this.$route.query.userId;
    this.coachUserStudyPage();
    this.selectUserName();
    // if (this.userId != null) {
    //   this.selectIdinfo();
    //   this.dialogFormVisible = true;
    // }
  },
};
</script>
<style scoped>
.container {
  /* width: 70%; */
  background: #fff;
  position: relative;
  z-index: 1;
  padding: 20px 28px;
  border-radius: 4px;
}

.tableBar {
  margin-bottom: 20px;
  float: center;
}
/* .tableLab {
 
} */
</style>
