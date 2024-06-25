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

    <!-- <el-menu-item index="/CoachManage" style="font-size: 16px" @click="CoachManage()">
      <i class="el-icon-s-custom" style="color: white; font-size: 22px"></i>
      <span slot="title"><b>教练管理</b></span>
    </el-menu-item> -->
    <el-menu-item
      index="1"
      style="font-size: 16px"
      @click="() => this.$router.push('/user/CoachViewUser')"
    >
      <i class="el-icon-user-solid" style="color: white; font-size: 22px"></i>
      <span slot="title"><b>查看学员</b></span>
    </el-menu-item>
    <el-menu-item
      index="2"
      style="font-size: 16px"
      @click="() => this.$router.push('/coach/StudyTime')"
    >
      <i class="el-icon-s-unfold" style="color: white; font-size: 22px"></i>
      <span slot="title"><b>练习安排</b></span>
    </el-menu-item>
    <el-menu-item
      index="3"
      style="font-size: 16px"
      @click="() => this.$router.push('/CoachSelf')"
    >
      <i class="el-icon-s-management" style="color: white; font-size: 22px"></i>
      <span slot="title"><b>个人中心</b></span>
    </el-menu-item>

    <!-- <el-tooltip
      class="item"
      effect="dark"
      content="我的申请"
      placement="right"
      :disabled="!isCollapse"
      ><el-menu-item
        index="4"
        style="font-size: 16px"
        @click="() => this.$router.push('/apply/CoachApply')"
      >
        <i class="el-icon-s-opportunity" style="color: white; font-size: 22px"></i>
        <el-badge :value="abc" class="item" style="">
          <div>
            <span slot="title"><b>我的申请</b></span>
          </div>
        </el-badge>
      </el-menu-item></el-tooltip
    > -->
    <el-menu-item
      index="4"
      style="font-size: 16px"
      @click="() => this.$router.push('/apply/CoachApply')"
    >
      <i class="el-icon-s-opportunity" style="color: white; font-size: 22px"></i>
      <span slot="title"><b>我的申请</b></span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "CoachAside",

  data() {
    return {
      abc: 10,
    };
  },

  mounted() {},

  methods: {
    //跳转到教练管理
    // CoachManage() {
    //   this.$router.push("/CoachManage");
    // },
  },
  props: {
    isCollapse: Boolean, //导航栏菜单伸缩
  },
};
</script>
<style>
.el-tooltip__popper {
  font-weight: bold;
}
</style>
