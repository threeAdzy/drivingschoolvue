<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label style="margin-right: 5px"> 学员姓名: </label>
        <el-input
          clearable
          v-model="name"
          placeholder="请输入学员姓名"
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
          v-model="classify"
          style="margin-left: 25px; width: 12%"
          clearable
          placeholder="选择驾照类别"
        >
          <el-option v-for="item in classifies" :key="item.value" :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" style="margin-left: 25px" @click="coachUserPage()"
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

        <el-table-column prop="phone" label="联系方式"> </el-table-column>
        <!-- <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="exercise(scope.row)">安排练习</el-button>
          </template>
        </el-table-column> -->
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
  name: "CoachViewUser",

  data() {
    return {
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
    //教练分页查询学员
    async coachUserPage() {
      await this.$axios
        .get("/api/coach/user/page", {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            name: this.name,
            sex: this.value,
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
      this.coachUserPage();
    },
    //翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.coachUserPage();
    },
  },
  created() {
    this.coachUserPage();
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
