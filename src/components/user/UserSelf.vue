<template>
  <div style="text-align: center; height: 100%; padding: 20px 0 0 0; margin: 0px">
    <i class="el-icon-s-order" style="font-size: 32px"><b> 当前登录信息</b></i>
    <el-descriptions title="" :column="2" size="40" border style="padding: 20px 0 20px 0">
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-message"></i>
          账号
        </template>

        <el-tag type="info">{{ ruleForm.userNumber }}</el-tag>
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
          ruleForm.lv == 0 ? "管理员" : ruleForm.lv == 1 ? "教练" : "用户"
        }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-date"></i>
          身份证
        </template>
        <el-tag type="info">{{ ruleForm.identityCard }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-share"></i>
          性别
        </template>
        <el-tag type="info">{{ ruleForm.sex == 0 ? "男" : "女" }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-phone"></i>
          联系方式
        </template>
        <el-tag type="info">{{ ruleForm.phone }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-info"></i>
          帐号状态
        </template>
        <el-tag type="info">{{ ruleForm.state == 0 ? "启用中" : "已锁定" }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-s-custom"></i>
          所属教练
        </template>
        <el-tag type="info">{{ ruleForm.coachName }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template slot="label">
          <i class="el-icon-s-claim"></i>
          驾驶证类别
        </template>
        <el-tag type="info">{{ ruleForm.classify }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-message-solid"></i>
          科目一
        </template>
        <el-tag type="info">{{ ruleForm.subjectOne == 0 ? "未通过" : "已通过" }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-message-solid"></i>
          科目二
        </template>
        <el-tag type="info">{{ ruleForm.subjectTwo == 0 ? "未通过" : "已通过" }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-message-solid"></i>
          科目三
        </template>
        <el-tag type="info">{{
          ruleForm.subjectThree == 0 ? "未通过" : "已通过"
        }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-message-solid"></i>
          科目四
        </template>
        <el-tag type="info">{{ ruleForm.subjectFour == 0 ? "未通过" : "已通过" }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <hr />
    <el-row style="text-align: left"
      ><el-button
        type="primary"
        @click="changeInfo(ruleForm)"
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
      @close="dialogFormNo('updateForm')"
      center
      width="450px"
    >
      <el-form
        :model="updateForm"
        :rules="rules"
        ref="updateForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="userNumber">
          <el-input v-model="updateForm.userNumber"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-tooltip
            class="item"
            effect="dark"
            content="请输入密码，不输入则使用旧密码/默认密码"
            placement="bottom-start"
            ><el-input
              type="password"
              show-password
              v-model="updateForm.password"
              placeholder="请输入密码"
            ></el-input
          ></el-tooltip>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="updateForm.sex" clearable style="float: left">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="identityCard">
          <el-input v-model="updateForm.identityCard" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="分配车辆:" prop="carId">
          <el-input v-model="ruleForm.carNumber" :disabled="true"></el-input>
        </el-form-item> -->
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="updateForm.phone"></el-input>
        </el-form-item>

        <div class="imguploadwin">
          <el-form-item label="用户头像:" prop="userImg">
            <!-- <img-upload :prop-image-url="imageUrl" @imageChange="imageChange"
              >图片大小不超过2M<br />仅能上传JPG类型图片<br />建议上传200*200或300*300尺寸的图片
            </img-upload> -->
            <el-upload
              ref="uploadfiles"
              class="avatar-uploader"
              action="/api/common/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :on-remove="handleRemove"
              :on-error="handleError"
              :before-upload="beforeAvatarUpload"
              :headers="headers"
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">保存</el-button>

        <el-button @click="dialogFormNo('ruleForm')">返回</el-button></span
      >
    </el-dialog>
  </div>
</template>

<script>
// import { number } from "echarts";

export default {
  name: "CoachSelf",

  data() {
    return {
      id: null,
      dialogFormVisible: false, //带表单的Dialog对话框
      imageUrl: "",
      headers: {
        token: sessionStorage.getItem("token"),
      },
      ruleForm: {
        name: "",
        lv: "",
        userNumber: "",
        password: "",
        // age: number,
        sex: "",
        phone: "",
        state: "",
        coachName: "",
        subjectOne: "",
        subjectTwo: "",
        subjectThree: "",
        subjectFour: "",
        identityCard: "",
        classify: "",
      },
      updateForm: {
        name: "",
        lv: "",
        userNumber: "",
        password: "",
        // age: number,
        sex: "",
        phone: "",
        state: "",
        coachName: "",
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

      rules: {
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

        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度应为11位", trigger: "blur" },
          {
            pattern: /^(1[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9])$/,
            trigger: "blur",
          },
        ],
      },
    };
  },

  mounted() {},

  methods: {
    //修改时关闭
    dialogFormNo(ref) {
      this.getUserInfo();
      this.imageUrl = null;
      this.dialogFormVisible = false;
      this.$refs[ref].resetFields();
    },

    //获取信息
    async getUserInfo() {
      await this.$axios
        .get("/api/user/info", {
          headers: {
            token: sessionStorage.getItem("token"),
          },
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            this.id = res.data.userId;
            this.ruleForm.userNumber = res.data.userNumber;
            this.ruleForm.name = res.data.name;
            this.ruleForm.lv = res.data.lv;
            // this.ruleForm.age = res.data.age;
            this.ruleForm.sex = res.data.sex;
            this.ruleForm.phone = res.data.phone;
            this.ruleForm.state = res.data.state;
            this.ruleForm.identityCard = res.data.identityCard;
            this.ruleForm.coachName = res.data.coachName; //教练姓名
            this.ruleForm.subjectOne = res.data.subjectOne;
            this.ruleForm.subjectTwo = res.data.subjectTwo;
            this.ruleForm.subjectThree = res.data.subjectThree;
            this.ruleForm.subjectFour = res.data.subjectFour;
            this.ruleForm.classify = res.data.classify;
            this.imageUrl = res.data.userImg;

            console.log("成功", res.data);
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },

    changeInfo(ruleForm) {
      // this.getUserInfo();
      console.log(ruleForm);
      this.updateForm.userNumber = ruleForm.userNumber;
      this.updateForm.name = ruleForm.name;
      this.updateForm.sex = ruleForm.sex;
      this.updateForm.identityCard = ruleForm.identityCard;
      this.updateForm.phone = ruleForm.phone;
      this.dialogFormVisible = true;
    },

    //提交
    submitForm() {
      this.$refs.updateForm.validate((valid) => {
        if (valid) {
          // alert("submit!!!");
          console.log(this.imageUrl);
          //Img空的
          this.updateUser(this.id);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //更新
    async updateUser(id) {
      await this.$axios
        .put(
          "/api/user/updateUser",
          {
            userId: id,
            userNumber: this.updateForm.userNumber,
            name: this.updateForm.name,
            password: this.updateForm.password,
            sex: this.updateForm.sex,
            identityCard: this.updateForm.identityCard,
            phone: this.updateForm.phone,
            userImg: this.imageUrl,
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

    //登出
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

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleRemove() {},

    oploadImgDel() {
      this.imageUrl = "";
      // this.$emit("imageChange", this.imageUrl);
    },
    handleError(err, file, fileList) {
      console.log(err, file, fileList, "handleError");
      this.$message({
        message: "图片上传失败",
        type: "error",
      });
    },
  },

  created() {
    this.getUserInfo();

    console.log(this.ruleForm);
  },
};
</script>
<style scoped>
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
