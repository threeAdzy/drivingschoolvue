<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <el-button type="primary" plain round @click="CoachSelect()"
          >切换到教练选择页面</el-button
        >
        <el-badge :value="applyNO" class="item" style="float: right">
          <el-button @click="() => this.$router.push('/apply/UserApply.vue')"
            >未受理申请</el-button
          >
        </el-badge>
        <hr />
        <el-descriptions
          class="margin-top"
          title="所属教练信息"
          :column="2"
          border
          style="padding: 20px 0 20px 0"
          v-show="coachInfo"
        >
          <template slot="extra">
            <el-button type="primary" size="small" @click="centerDialogVisible = true"
              ><i class="el-icon-star-off"></i>去评分</el-button
            >
          </template>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              姓名
            </template>
            {{ ruleForm.name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              联系方式
            </template>
            {{ ruleForm.phone }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-date"></i>
              年龄
            </template>
            {{ ruleForm.age }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              状态
            </template>
            {{ ruleForm.state == 0 ? "在职" : "离职" }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-share"></i>
              性别
            </template>
            <!-- <el-tag size="small">学校</el-tag> -->
            {{ ruleForm.sex == 0 ? "男" : "女" }} </el-descriptions-item
          ><el-descriptions-item>
            <template slot="label">
              <i class="el-icon-truck"></i>
              分配车辆
            </template>
            {{ ruleForm.carNumber }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-picture-outline-round"></i>
              教练照片
            </template>
            <template>
              <el-image
                style="width: 60px; height: 60px; border: none; cursor: pointer"
                :src="ruleForm.coachImg"
              >
                <div slot="error" class="image-slot" v-show="ruleForm.carId != null">
                  <img
                    src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
                    style="width: 60px; height: 60px; border: none"
                  />
                </div>
              </el-image>
            </template>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-picture-outline"></i>
              车辆照片
            </template>
            <template>
              <el-image
                style="width: 60px; height: 60px; border: none; cursor: pointer"
                :src="ruleForm.carImg"
              >
                <div slot="error" class="image-slot">
                  <img
                    src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                    style="width: 60px; height: 60px; border: none"
                  />
                </div>
              </el-image>
            </template>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <el-dialog title="评价教练" :visible.sync="centerDialogVisible" width="30%" center>
      <div class="outer">
        <div class="insider">
          <el-rate v-model="score" show-text :colors="colors"> </el-rate>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="subScore()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "MyViewCoach",

  data() {
    return {
      coachInfo: false,
      centerDialogVisible: false, //评分
      score: "",
      applyNO: 0,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      ruleForm: {
        name: "",
        // lv: "",
        coachNumber: "",
        age: "",
        sex: "",
        phone: "",
        state: "",
        carNumber: "",
        coachId: "",
        coachImg: "",
        carImg: "",
      },
    };
  },

  mounted() {},

  methods: {
    CoachSelect() {
      this.$router.push("/CoachSelect");
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

    subScore() {
      //发送评分请求
      console.log(this.score);
      this.$axios
        .post(
          "/api/user/score",
          {
            coachId: this.ruleForm.coachId,
            score: this.score,
          },
          {
            headers: { token: sessionStorage.getItem("token") },
          }
        )
        .then((res) => res.data)
        .then((res) => {
          if (res.code == 1) {
            console.log(res);
            this.$notify({
              title: "评分完成",
              message: "已成功对教练进行评分",
              type: "success",
            });
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });

      this.centerDialogVisible = false;
    },
    //学员查询自己教练信息
    async getUserInfo() {
      await this.$axios
        .get("/api/user/myCaoch", {
          headers: {
            token: sessionStorage.getItem("token"),
          },
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            this.ruleForm.coachId = res.data.coachId;
            this.ruleForm.coachNumber = res.data.coachNumber;
            this.ruleForm.name = res.data.name;
            // this.ruleForm.lv = res.data.lv;
            this.ruleForm.age = res.data.age;
            this.ruleForm.sex = res.data.sex;
            this.ruleForm.phone = res.data.phone;
            this.ruleForm.state = res.data.state;
            this.ruleForm.carNumber = res.data.carNumber;
            this.ruleForm.coachImg = res.data.coachImg;
            this.ruleForm.carImg = res.data.carImg;
            console.log("成功", res.data);
            console.log("成功", this.ruleForm.carImg);
            this.coachInfo = true;
          } else {
            this.$message(res.msg);
            this.$router.push("/CoachSelect");
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },
  },
  created() {
    this.getUserInfo();
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
  /* top: 50%; */
  left: 65%;
  transform: translateX(-50%);
}
</style>
