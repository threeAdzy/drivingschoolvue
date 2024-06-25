<template>
  <div style="text-align: center; height: 100%; padding: 20px 0 0 0; margin: 0px">
    <i class="el-icon-s-order" style="font-size: 32px"><b> 当前登录信息</b></i>
    <el-descriptions title="" :column="2" size="40" border style="padding: 20px 0 20px 0">
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-message"></i>
          账号
        </template>

        <el-tag type="info">{{ ruleForm.coachNumber }}</el-tag>
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
          年龄
        </template>
        <el-tag type="info">{{ ruleForm.age }}</el-tag>
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
          <i class="el-icon-truck"></i>
          分配车辆
        </template>
        <el-tag
          type="info"
          v-show="ruleForm.carNumber != null"
          style="margin-right: 15px"
          >{{ ruleForm.carNumber }}</el-tag
        >
        <el-button
          size="small"
          type="primary"
          v-show="ruleForm.carNumber == null"
          plain
          @click="applyCar()"
          >申请车辆</el-button
        >
      </el-descriptions-item>
    </el-descriptions>
    <hr />
    <el-row style="text-align: left">
      <el-button
        type="warning"
        @click="carRepairs()"
        style="margin: 25px 0 0 90px; font-size: 22px"
      >
        <i class="el-icon-s-release" style="font-size: 24px"></i>
        车辆报修</el-button
      >
      <el-button
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
        <el-form-item label="账号" prop="coachNumber">
          <el-input v-model="updateForm.coachNumber"></el-input>
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
          <el-select v-model="updateForm.sex" style="float: left" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
            <!-- <el-option label="男" value="0"></el-option>
          <el-option label="女" value="1"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="updateForm.age" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="updateForm.phone"></el-input>
        </el-form-item>

        <div class="imguploadwin">
          <el-form-item label="教练头像:" prop="coachImg">
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
export default {
  name: "CoachSelf",

  data() {
    return {
      id: null,
      dialogFormVisible: false, //带表单的Dialog对话框
      imageUrl: "",
      carId: "",
      headers: {
        token: sessionStorage.getItem("token"),
      },
      ruleForm: {
        name: "",
        lv: "",
        coachNumber: "",
        age: "",
        sex: "",
        phone: "",
        state: "",
        password: "",
        carNumber: "",
      },
      updateForm: {
        name: "",
        coachNumber: "",
        age: "",
        sex: "",
        phone: "",
        password: "",
        carNumber: "",
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
        coachNumber: [
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
        age: [
          { required: true, message: "年龄不能为空" },
          {
            type: "number",
            message: "年龄必须为数字值",
            trigger: "blur",
          },
          {
            pattern: /^(2[5-9]|3\d|4\d|5[0-5])$/,
            message: "年龄应为25~55",
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
    //车辆报修
    carRepairs() {
      this.$confirm("车辆报修会清除当前正在使用的车辆，确认报修吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios
          .post(
            "/api/coach/updateCarState",
            {
              coachId: this.id,
              carId: this.carId,
            },
            {
              headers: { token: sessionStorage.getItem("token") },
            }
          )
          .then((res) => res.data)
          .then((res) => {
            if (res.code == 1) {
              console.log(res);
              this.$message.success("车辆已清除，请前往车辆选择页面申请车辆。");
            } else {
              this.$message.error(res.msg);
            }
            this.getCoachInfo();
          })
          .catch((error) => {
            console.log(error.response);
          });
      });
    },
    //修改时关闭
    dialogFormNo(ref) {
      this.getCoachInfo();
      this.imageUrl = null;
      this.dialogFormVisible = false;
      this.$refs[ref].resetFields();
    },

    //获取信息
    async getCoachInfo() {
      await this.$axios
        .get("/api/coach/info", {
          headers: {
            token: sessionStorage.getItem("token"),
          },
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            this.id = res.data.coachId;
            this.ruleForm.coachNumber = res.data.coachNumber;
            this.ruleForm.name = res.data.name;
            this.ruleForm.lv = res.data.lv;
            this.ruleForm.age = res.data.age;
            this.ruleForm.sex = res.data.sex;
            this.ruleForm.phone = res.data.phone;
            this.ruleForm.state = res.data.state;
            this.ruleForm.carNumber = res.data.carNumber;
            this.imageUrl = res.data.coachImg;
            this.carId = res.data.carId;
            console.log("成功", res.data);
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },

    changeInfo(ruleForm) {
      console.log(ruleForm);
      this.updateForm.coachNumber = ruleForm.coachNumber;
      this.updateForm.name = ruleForm.name;
      this.updateForm.sex = ruleForm.sex;
      this.updateForm.age = ruleForm.age;
      this.updateForm.phone = ruleForm.phone;
      this.dialogFormVisible = true;
      //   this.getUserInfo();
    },

    //提交
    submitForm() {
      this.$refs.updateForm.validate((valid) => {
        if (valid) {
          this.updateCoach(this.id);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //更新
    async updateCoach(id) {
      await this.$axios
        .put(
          "/api/coach/updateCoach",
          {
            coachId: id,
            coachNumber: this.updateForm.coachNumber,
            name: this.updateForm.name,
            password: this.updateForm.password,
            sex: this.updateForm.sex,
            age: this.updateForm.age,
            phone: this.updateForm.phone,
            coachImg: this.imageUrl,
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
            this.getCoachInfo();
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

    //跳转申请车辆
    applyCar() {
      //跳转到修改页面，通过地址栏传递参数
      this.$router.push({
        path: "/coach/CarSelect",
        query: { lv: this.ruleForm.lv },
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
    this.getCoachInfo();
  },
};
</script>
<style scoped>
.el-input {
  width: 223px;
  float: left;
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
</style>
