<template>
  <div style="text-align: center; height: 100%; padding: 20px 0 0 0; margin: 0px">
    <i class="el-icon-s-order" style="font-size: 32px"><b> 当前登录信息</b></i>
    <el-descriptions title="" :column="1" size="40" border style="padding: 20px 0 20px 0">
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-message"></i>
          账号
        </template>

        <el-tag type="info">{{ ruleForm.number }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          姓名
        </template>
        <el-tag type="info">{{ ruleForm.name }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-cpu"></i>
          角色
        </template>
        <el-tag type="success" disable-transitions>{{
          ruleForm.lv == 0 ? "管理员" : lv == 1 ? "教练" : "用户"
        }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <hr />
    <el-row style="text-align: left">
      <el-button
        type="primary"
        @click="changeInfo()"
        style="margin: 25px 0 0 90px; font-size: 22px"
      >
        <i class="el-icon-edit" style="font-size: 24px"></i>
        修改信息</el-button
      >
      <el-button
        type="danger"
        @click="logout"
        style="margin: 25px 0 0 90px; font-size: 22px"
      >
        <i class="el-icon-switch-button" style="font-size: 24px"></i>
        退出登录</el-button
      >
    </el-row>
    <!-- 修改信息的Dialog对话框 -->
    <el-dialog
      title="修改个人信息"
      :visible.sync="dialogFormVisible"
      @close="dialogFormNo('ruleForm')"
      center
      width="450px"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="number">
          <el-input v-model="ruleForm.number"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="密码" prop="password">
          <el-tooltip
            class="item"
            effect="dark"
            content="请输入密码，不输入则使用旧密码/默认密码"
            placement="bottom-start"
            ><el-input
              type="password"
              show-password
              v-model="ruleForm.password"
              placeholder="请输入密码"
            ></el-input
          ></el-tooltip>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">保存</el-button>

        <el-button @click="dialogFormNo('ruleForm')">返回</el-button></span
      >
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "AdminSelf",

  data() {
    return {
      dialogFormVisible: false, //带表单的Dialog对话框
      name: "",
      lv: "",
      number: "",
      ruleForm: {
        name: "",
        lv: "",
        number: "",
        // password: "",
        // oldPassword: "",
      },
      rules: {
        number: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 5, max: 20, message: "长度在 5 到 20 个字符", trigger: "blur" },
        ],
        // password: [
        //   { message: "请输入密码，不设置为默认密码", trigger: "blur" },
        //   { min: 6, max: 6, message: "长度6个字符", trigger: "blur" },
        // ],
        name: [
          { required: true, message: "请输入教练姓名", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {},

  methods: {
    //提交
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // alert("submit!!!");
          console.log("提交");
          //Img空的
          this.updateAdmin();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //更新
    async updateAdmin() {
      await this.$axios
        .put(
          "/api/admin/updateAdmin",
          {
            adminNumber: this.ruleForm.number,
            name: this.ruleForm.name,
            // password: this.ruleForm.password,
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
              title: "成功",
              message: "修改个人信息成功",
              type: "success",
            });
            this.dialogFormVisible = false;
            this.getUserInfo();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    //修改时关闭
    dialogFormNo(ref) {
      this.getUserInfo();
      // this.imageUrl = null;
      this.dialogFormVisible = false;
      this.$refs[ref].resetFields();
    },
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
            this.ruleForm.number = res.data.adminNumber;
            this.ruleForm.name = res.data.name;
            this.ruleForm.lv = res.data.lv;
            console.log("成功", res.data);
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },

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
    changeInfo() {
      this.getUserInfo();
      this.dialogFormVisible = true;
    },
  },
  created() {
    this.getUserInfo();
  },
};
</script>
<style scoped>
.el-descriptions {
  width: 86%;

  margin: 0 auto;
  text-align: center;
}
.el-input {
  width: 223px;
  float: left;
}
.el-dialog__body {
  /* display: flex; */

  justify-content: center;

  align-content: center;
}
</style>
