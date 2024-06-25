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

    <el-menu-item
      index="1"
      style="font-size: 16px"
      @click="() => this.$router.push('/MyViewCoach')"
    >
      <i class="el-icon-user-solid" style="color: white; font-size: 22px"></i>
      <span slot="title"><b>我的教练</b></span>
    </el-menu-item>
    <el-menu-item
      index="2"
      style="font-size: 16px"
      @click="() => this.$router.push('/MyStudyTime')"
    >
      <i class="el-icon-s-unfold" style="color: white; font-size: 22px"></i>
      <span slot="title"><b>我的练习</b></span>
    </el-menu-item>
    <el-menu-item
      index="3"
      style="font-size: 16px"
      @click="() => this.$router.push('/UserSelf')"
    >
      <i class="el-icon-s-management" style="color: white; font-size: 22px"></i>
      <span slot="title"><b>个人中心</b></span>
    </el-menu-item>
    <el-menu-item
      index="4"
      style="font-size: 16px"
      @click="() => this.$router.push('/apply/UserApply.vue')"
    >
      <i class="el-icon-s-opportunity" style="color: white; font-size: 22px"></i>
      <span slot="title"><b>我的申请</b></span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "UserAside",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
  props: {
    isCollapse: Boolean, //导航栏菜单伸缩
  },
};
</script>
