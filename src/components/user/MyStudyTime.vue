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

        <el-button type="primary" style="margin-left: 25px" @click="UserSelfStudyPage()"
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
        <!-- <el-table-column prop="coachId" label="ID" width="100"> </el-table-column> -->
        <el-table-column prop="name" label="教练姓名"> </el-table-column>
        <el-table-column prop="coachImg" label="教练照片">
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
          </template>
        </el-table-column>

        <el-table-column prop="subject" label="练习科目">
          <template slot-scope="scope">
            {{ scope.row.subject === 2 ? "科目二" : "科目三" }}
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间"> </el-table-column>
        <el-table-column prop="endTime" label="结束时间"> </el-table-column>

        <el-table-column prop="phone" label="教练联系方式"> </el-table-column>
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
  name: "MyStudyTime",

  data() {
    return {
      begintime: "",
      endtime: "",
      begintimechange: "",
      endtimechange: "",
      page: 1, //页码
      pageSize: 5, //每页记录数
      name: "", //教练姓名，对应输入框
      counts: Number,
      tableData: [],
    };
  },

  mounted() {},

  methods: {
    rowStyle() {
      return "text-align:center";
    },
    //练习分页
    async UserSelfStudyPage() {
      this.timeChange();
      await this.$axios
        .get("/api/user/studypage", {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            CoachName: this.name,
            begin: this.begintimechange,
            end: this.endtimechange,
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
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },
    //转换时间戳
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

    //翻页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page = 1;
      this.pageSize = val;
      this.UserSelfStudyPage(); ///////////////改
    },
    //翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.UserSelfStudyPage(); //////////////////改
    },
  },

  created() {
    this.UserSelfStudyPage(); //////////////////改
    // this.selectUserName();
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
</style>
