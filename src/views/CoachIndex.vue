<template>
  <div class="CoachIndex">
    <el-container style="border: 1px solid #eee">
      <!--  -->
      <el-aside
        :width="isCollapse ? '64px' : '200px'"
        style="height: 100vh; background-color: #545c64; margin-left: 0px"
      >
        <Aside :isCollapse="isCollapse"></Aside>
      </el-aside>
      <el-container>
        <el-header
          style="
            text-align: right;
            font-size: 12px;
            height: 100px;
            background-color: gold;
          "
        >
          <Header @doCollapse="doCollapse" :icon="icon"></Header
        ></el-header>
        <el-main style="height: 100%">
          <!-- <el-table :data="tableData">
            <el-table-column prop="date" label="日期" width="140"> </el-table-column>
            <el-table-column prop="name" label="姓名" width="120"> </el-table-column>
            <el-table-column prop="address" label="地址"> </el-table-column>
          </el-table> -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from "./CoachAside.vue";
import Header from "./CoachHeader.vue";
export default {
  name: "Coachindex",
  components: { Aside, Header },
  data() {
    return {
      isCollapse: false,
      aside_witdh: "200px",
      icon: "el-icon-d-arrow-left",
    };
  },
  created() {
    this.$router.push("/CoachSelf");
  },
  mounted() {},

  methods: {
    doCollapse() {
      this.isCollapse = !this.isCollapse;
      if (!this.isCollapse) {
        // 展开
        this.aside_witdh = "200px";
        this.icon = "el-icon-d-arrow-left";
      } else {
        //关起、关闭、收起
        this.aside_witdh = "64px";
        this.icon = "el-icon-d-arrow-right";
      }
    },
  },
};
</script>
<style scoped>
.CoachIndex .el-header {
  background-color: #b3c0d1;
  color: #333;
  /* line-height: 60px; */
}

.el-aside {
  color: #333;
}
.el-main {
  padding: 0;
}

/* .el-icon-carrr-side {
  background: url(../assets/car-side.svg);
} */
/* .el-icon-carrr-side:before { */
/* content: "dog"; before属性中的content文本是用来占位的,必须有 */
/* font-size: px; */
/* 可以设置字体大小来确定图标大小 */
/* visibility: hidden; */
/* 使用visibility: hidden;来隐藏文字  */
/* } */
/* .el-main {
  color: #333;
  border: 0px;
} */
</style>
