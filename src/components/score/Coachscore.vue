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

        <el-button type="primary" style="margin-left: 25px" @click="adminCoachPage()"
          >查询</el-button
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
        <!-- <el-table-column prop="" label="统计图">
          <template>
            <div id="myChart" ref="abc" style="width: 600px; height: 100px"></div>
          </template>
        </el-table-column> -->

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="StartOrStop(scope.row)">
              {{ scope.row.state === 1 ? "启用" : "禁用" }}</el-button
            > -->
            <el-button type="text" @click="scoreImg(scope.row)">查看评分详情</el-button>
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
    <el-drawer title="评分详情" :visible.sync="drawer" ref="lan" :direction="rtl">
      <template>
        <div class="outer">
          <div
            class="insider"
            id="myChart"
            ref="scoreimg"
            style="width: 400px; height: 400px"
            v-show="scoretable"
          ></div>
          <div v-show="zanwu"><el-empty description="暂无评分"></el-empty></div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Coachscore",

  data() {
    return {
      zanwu: false,
      scoretable: true,
      drawer: false, //控制抽屉
      page: 1, //页码
      pageSize: 5, //每页记录数
      name: null, //教练姓名，对应输入框
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
    };
  },

  mounted() {
    //取消懒加载
    try {
      let dialogRef = this.$refs["lan"];
      dialogRef.rendered = true;
      dialogRef.key++;
      dialogRef = null;
    } catch (error) {
      console.error(error);
    }

    // this.scoreImg();
    // this.$refs.drawer.drawer = true;
    this.aaaaa();
  },

  methods: {
    //详细评分
    scoreImg(row) {
      console.log(row);
      if (row.scoreNumber != 0) {
        this.drawer = true;
        this.aaaaa(row);

        this.scoretable = true;
        this.zanwu = false;
      } else {
        this.drawer = true;
        this.scoretable = false;
        this.zanwu = true;
      }
    },

    aaaaa(row) {
      // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      // var chartDom = document.getElementById("myChart");
      var myChart = this.$echarts.init(this.$refs.scoreimg);
      var option;

      option = {
        title: {
          text: "评分统计图",
          subtext: row.name,
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          // bottom: 10,
          orient: "vertical",
          left: "left",
          // data: ["评分：1", "评分：2", "评分：3", "评分：4", "五星数量"],
        },
        series: [
          {
            name: "评分数量",
            type: "pie",
            radius: "30%",
            selectedMode: "single",
            data: [
              { value: row.scoreFive, name: "5星评分" },
              { value: row.scoreFour, name: "4星评分" },
              { value: row.scoreThree, name: "3星评分" },
              { value: row.scoreTwo, name: "2星评分" },
              { value: row.scoreOne, name: "1星评分" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },
    //教练评分分页查询
    async adminCoachPage() {
      await this.$axios
        .get("/api/admin/coach/ScorePage", {
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

    rowStyle() {
      return "text-align:center";
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

/* 抽屉水平居中 */
.outer {
  width: 100%;
  height: 100%;
  /* background-color: burlywood; */
  position: relative;
}
.insider {
  width: 60%;
  height: 50%;
  /* background-color: cornflowerblue; */
  position: absolute;
  /* top: 20%; */
  left: 50%;
  transform: translateX(-50%);
}

/* .el-drawer .el-drawer__body {
  display: flex;
  justify-content: center;
  align-items: center;
} */
</style>
