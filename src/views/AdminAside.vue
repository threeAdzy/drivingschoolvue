<template>
  <el-menu
    style="height: 100%"
    default-active="0"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :collapse="isCollapse"
    :collapse-transition="false"
  >
    <el-menu-item index="0" style="height: 100px; text-align: center">
      <span slot="title" style="font-size: 25px; line-height: 100px"
        ><b>驾校管理系统</b></span
      >
    </el-menu-item>

    <el-menu-item index="/CoachManage" style="font-size: 16px" @click="CoachManage()">
      <i class="el-icon-s-custom" style="color: white; font-size: 22px"></i>
      <span slot="title"><b>教练管理</b></span>
    </el-menu-item>
    <el-menu-item index="2" style="font-size: 16px" @click="UserManage()">
      <i class="el-icon-user-solid" style="color: white; font-size: 22px"></i>
      <span slot="title"><b>学员管理</b></span>
    </el-menu-item>
    <el-menu-item index="3" style="font-size: 16px" @click="CarManage()">
      <i class="el-icon-s-home" style="color: white; font-size: 22px"></i>
      <span slot="title"><b>车辆管理</b></span>
    </el-menu-item>
    <el-menu-item index="4" style="font-size: 16px" @click="AccountManage()">
      <i class="el-icon-s-management" style="color: white; font-size: 22px"></i>
      <span slot="title"><b>账号管理</b></span>
    </el-menu-item>
    <el-menu-item index="5" style="font-size: 16px" @click="Coachscore()">
      <i class="el-icon-star-on" style="color: white; font-size: 22px"></i>
      <span slot="title"><b>教练评优</b></span>
    </el-menu-item>
    <!-- <el-tooltip
      class="item"
      effect="dark"
      content="申请管理"
      placement="right"
      :disabled="!isCollapse"
    ></el-tooltip>
    <el-menu-item index="6" style="font-size: 16px" @click="ApplyManage()">
      <i class="el-icon-s-opportunity" style="color: white; font-size: 22px"></i>
      <el-badge :value="counts" class="item"
        ><div>
          <span slot="title"><b>申请管理</b></span>
        </div></el-badge
      >
    </el-menu-item> -->
    <el-menu-item index="6" style="font-size: 16px" @click="ApplyManage()">
      <i class="el-icon-s-opportunity" style="color: white; font-size: 22px"></i>
      <span slot="title"><b>申请管理</b></span>
    </el-menu-item>
  </el-menu>
</template>

<script>
// import CarManage from '../components/car/carManage.vue';

export default {
  name: "AdminAside",

  data() {
    return {
      counts: 5,
    };
  },

  mounted() {},

  methods: {
    //跳转到教练管理
    CoachManage() {
      this.$router.push("/CoachManage");
    },

    CarManage() {
      this.$router.push("/CarManage");
    },
    UserManage() {
      this.$router.push("/UserManage");
    },
    //跳转到账号管理
    AccountManage() {
      this.$router.push("/accountManage");
    },
    Coachscore() {
      this.$router.push("/Coachscore");
    },
    //申请管理
    ApplyManage() {
      this.$router.push("/ApplyManage");
    },
    //管理员获取未处理的申请
    // applyUntreated() {
    //   this.$axios
    //     .get("/api/admin/applyUntreated", {
    //       headers: {
    //         token: sessionStorage.getItem("token"),
    //       },
    //     })
    //     .then((res) => res.data)
    //     .then((res) => {
    //       if (res.code === 1) {
    //         // this.tableData = res && res.data && res.data.records;
    //         this.counts = Number(res.data);
    //       }
    //       console.log(this.counts);
    //     })
    //     .catch((err) => {
    //       this.$message.error("请求出错了：" + err.message);
    //     });
    // },
  },
  props: {
    isCollapse: Boolean, //导航栏菜单伸缩
  },
  created() {},
};
</script>
<style>
.el-tooltip__popper {
  font-weight: bold;
}
</style>
