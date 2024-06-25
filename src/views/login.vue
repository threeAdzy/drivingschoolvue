<template>
  <div class="login">
    <div
      style="
        width: 96%;
        text-align: center;
        color: white;
        padding: 8vh 100px 0 0;
        -webkit-text-stroke: 1px black;
        font-size: 3vh;
      "
    >
      <h1>欢迎使用驾校管理系统</h1>
    </div>
    <div class="login-form">
      <el-header>
        <i class="el-icon-truck" style="font-size: 36px"></i
        ><b style="font-size: 34px">驾校管理系统</b></el-header
      >
      <el-main>
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="账 号：" prop="loginNumber">
            <el-input placeholder="请输入账号" v-model="loginForm.loginNumber"></el-input
          ></el-form-item>
          <el-form-item label="密 码：" prop="password"
            ><el-input
              placeholder="请输入密码"
              v-model="loginForm.password"
              show-password
            ></el-input
          ></el-form-item>
          <el-form-item label="身 份：" prop="radio"
            ><el-radio-group v-model="loginForm.radio">
              <el-radio :label="0">管理员</el-radio>
              <el-radio :label="1">教练</el-radio>
              <el-radio :label="2">用户</el-radio>
            </el-radio-group></el-form-item
          >
          <el-form-item>
            <el-button type="primary" @click="submitForm()">登录</el-button>
            <el-button @click="dialogFormVisible = true"
              >用户注册</el-button
            ></el-form-item
          >
        </el-form></el-main
      >
    </div>

    <!-- 注册弹窗 -->
    <el-dialog
      title="用户注册"
      :visible.sync="dialogFormVisible"
      @close="dialogFormNo('ruleForm')"
      width="450px"
    >
      <el-form
        :model="ruleForm"
        :rules="rulesRegister"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="userNumber">
          <el-input v-model="ruleForm.userNumber" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-tooltip
            class="item"
            effect="dark"
            content="请输入密码，不输入则使用系统默认密码"
            placement="bottom-start"
            ><el-input
              type="password"
              show-password
              v-model="ruleForm.password"
              placeholder="请输入密码"
            ></el-input
          ></el-tooltip>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="ruleForm.sex" clearable style="float: left">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="驾驶证类别:" prop="classify">
          <el-select v-model="ruleForm.classify" clearable placeholder="选择驾照类别">
            <el-option v-for="item in classifies" :key="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="identityCard">
          <el-input
            v-model="ruleForm.identityCard"
            autocomplete="off"
            placeholder="请输入身份证号"
          ></el-input>
        </el-form-item>

        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="ruleForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <div class="imguploadwin">
          <el-form-item label="用户头像:" prop="userImg">
            <el-upload
              ref="uploadfiles"
              class="avatar-uploader"
              action="/api/common/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :on-remove="handleRemove"
              :on-error="handleError"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <span v-if="imageUrl" class="el-upload-list__item-actions">
                <span class="el-upload-span" @click.stop="oploadImgDel"> 删除图片 </span>
                <span class="el-upload-span"> 重新上传 </span>
              </span>
            </el-upload>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="subregister()">注册</el-button>

          <el-button @click="dialogFormNo('ruleForm')">返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import axios from "axios";
export default {
  name: "Login",

  data() {
    return {
      success: false, //注册成功
      dialogFormVisible: false, //带表单的Dialog对话框
      loginForm: { radio: "", loginNumber: "", password: "" },
      //登录表单
      rules: {
        loginNumber: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输密码", trigger: "blur" }],
        radio: [{ required: true, message: "请选择身份", trigger: "change" }],
      },
      imageUrl: "",
      headers: {
        token: sessionStorage.getItem("token"),
      },
      //注册表单
      ruleForm: {
        userNumber: "",
        name: "",
        password: "",
        age: "",
        sex: "",
        phone: "",
        identityCard: "",
        classify: "",
      },

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

      rulesRegister: {
        userNumber: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 5, max: 20, message: "长度在 5 到 20 个字符", trigger: "blur" },
        ],
        password: [
          { message: "请输入密码，不设置为默认密码", trigger: "blur" },
          { min: 6, max: 6, message: "长度6个字符", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入教练姓名", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
        sex: [{ required: true, message: "请选择教练性别", trigger: "change" }],
        identityCard: [
          { required: true, message: "身份证不能为空", trigger: "blur" },
          { min: 18, max: 18, message: "长度应为18位", trigger: "blur" },
          {
            pattern: /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: "身份证号格式不正确",
            trigger: "blur",
          },
        ],
        classify: [{ required: true, message: "请选择驾驶证类别", trigger: "change" }],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度应为11位", trigger: "blur" },
          {
            pattern: /^(1[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9])$/,
            trigger: "blur",
          },
        ],
      },
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
    //图片相关函数
    handleAvatarSuccess(response, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.imageUrl = `${response.data}`;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 3;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 3MB!");
      }
      return isJPG && isLt2M;
    },
    //修改时关闭
    dialogFormNo(ref) {
      // this.getUserInfo();
      this.imageUrl = null;
      this.dialogFormVisible = false;
      this.$refs[ref].resetFields();
    },
    //登录函数
    login(url, router) {
      this.$axios
        .post(url, {
          coachNumber: this.loginForm.loginNumber,
          userNumber: this.loginForm.loginNumber,
          adminNumber: this.loginForm.loginNumber,
          password: this.loginForm.password,
          lv: this.loginForm.radio,
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code == 1) {
            console.log(res);
            sessionStorage.setItem("token", res.data.token);
            this.$router.push(router); //跳转路由
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    choices() {
      let url = "";
      let router = "";
      if (this.loginForm.radio == 0) {
        url = "/api/admin/login";
        router = "AdminIndex";
        this.login(url, router);
      } else if (this.loginForm.radio == 1) {
        url = "/api/coach/login";
        router = "CoachIndex";
        this.login(url, router);
      } else if (this.loginForm.radio == 2) {
        url = "/api/user/login";
        router = "UserIndex";
        this.login(url, router);
      }
    },
    //提交
    submitForm() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.choices();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    subregister() {
      this.register();

      setTimeout(() => {
        console.log(this.success, "aaaaaaaaaaaaaaaaaaaa");
        if (this.success) {
          // if(this.ruleForm.password==null||this.ruleForm.password==''){

          // }

          this.$axios
            .post("/api/user/Autologin", {
              userNumber: this.ruleForm.userNumber,
              // password: this.ruleForm.password,
              lv: 2,
            })
            .then((res) => res.data)
            .then((res) => {
              if (res.code == 1) {
                console.log(res);
                sessionStorage.setItem("token", res.data.token);
                this.$router.push("UserIndex"); //跳转路由
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((error) => {
              console.log(error.response);
            });
        }
      }, 500);
    },

    //用户注册
    register() {
      this.$axios
        .post("/api/register", {
          userNumber: this.ruleForm.userNumber,
          name: this.ruleForm.name,
          password: this.ruleForm.password,
          sex: this.ruleForm.sex,
          identityCard: this.ruleForm.identityCard,
          phone: this.ruleForm.phone,
          coachId: this.ruleForm.coachId,
          userImg: this.imageUrl,
          classify: this.ruleForm.classify,
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code == 1) {
            console.log(res);
            this.$notify({
              title: "成功",
              message: "用户注册成功，自动登录",
              type: "success",
            });
            // this.$router.push("/UserManage");
            // this.login(url, router);
            this.success = true;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  },
};
</script>
<style scoped>
.el-main {
  background-color: #e9eef3;
  color: #333;
  /* text-align: center; */
  line-height: 160px;
  border-radius: 0px 0px 8px 8px;
}
body > .el-container {
  margin-bottom: 40px;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.login {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  /* background-color: #333; */
  background: url("../assets/Ch9Jpl9rHm6AIb9HAAfwA0-_RA8750.jpg");
  /* filter: blur(3px); */
  background-size: 100% 100%;
  /* background-size: 1920 1280; */

  overflow-x: hidden;
}

.login-form {
  position: absolute;
  border-radius: 8px;
  top: 50%;
  left: 50%;
  filter: blur(0px);
  margin-top: -200px;
  margin-left: -220px;
  width: 380px;
  /* height: 350px; */

  /* border-radius: 5%; */

  opacity: 0.9;
}
.el-header {
  border-radius: 8px 8px 0px 0px;
}
.el-descriptions {
  width: 86%;

  margin: 0 auto;
  text-align: center;
}
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  width: 178px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-input {
  width: 223px;
  float: left;
}
</style>
