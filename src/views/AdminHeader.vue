<template>
  <div style="display: flex; line-height: 60px">
    <div style="margin-top: 25px">
      <i :class="icon" style="font-size: 30px; cursor: pointer" @click="collapse"></i>
    </div>
    <div style="flex: 1; text-align: center; font-size: 34px">
      <DateUtils></DateUtils>
    </div>
    <el-row>
      <el-col :span="8"
        ><el-avatar
          :size="60"
          :src="circleUrl"
          @error="errorHandler"
          style="margin: 15px 5px -10px 0; border: 1px solid lightgrey"
          ><img
            src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
          /> </el-avatar
      ></el-col>
      <el-col :span="16" style="padding: 25px 0 0 0">
        <el-dropdown style="cursor: pointer">
          <!--dropdown下拉-->
          <span style="font-size: 20px"
            >{{ name }} <i class="el-icon-arrow-down" style="margin-left: 10px"></i
          ></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="toUser">个人中心</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DateUtils from "./DateUtils.vue";
export default {
  components: { DateUtils },
  name: "Header",

  data() {
    return {
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      name: "",
      lv: "",
      number: "",
    };
  },

  props: {
    icon: String,
  },
  methods: {
    // 头像加载错误
    errorHandler() {
      return true;
    },

    //获取用户信息用于回显
    async getUserInfo() {
      await this.$axios
        .get("/api/admin/info", {
          headers: {
            token: sessionStorage.getItem("token"),
          },
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            this.number = res.data.adminNumber;
            this.name = res.data.name;
            this.lv = res.data.lv;
            console.log("成功", res.data);
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },

    toUser() {
      this.$router.push("/AdminSelf");
    },

    //退出登录
    logout() {
      console.log("logout");

      this.$confirm("您确定要退出登录吗？", "提示", {
        confirmButtonText: "确定", //确认按钮的文字显示
        type: "warning",
        center: true, //文字居中显示
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出登录成功！",
          });

          this.$router.push("/");
          sessionStorage.clear();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出登录！",
          });
        });
    },
    collapse() {
      this.$emit("doCollapse");
    },
  },
  created() {
    this.getUserInfo();
  },
};
</script>
