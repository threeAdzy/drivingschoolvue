<template>
  <div class="dashboard">
    <div class="container">
      <div class="tableBar">
        <el-button
          type="primary"
          plain
          round
          @click="() => this.$router.push('/UserManage')"
          >返回至学员管理</el-button
        >

        <hr />

        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <div style="display: flex; justify-content: center">
                <el-form-item label="账号" prop="userNumber">
                  <el-input v-model="ruleForm.userNumber"></el-input>
                </el-form-item>
              </div>
              <div style="display: flex; justify-content: center">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
              </div>
              <div style="display: flex; justify-content: center">
                <el-form-item label="密码" prop="password">
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
                </el-form-item>
              </div>
              <div style="display: flex; justify-content: center">
                <el-form-item label="性别" prop="sex">
                  <el-select v-model="ruleForm.sex" clearable>
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div style="display: flex; justify-content: center">
                <el-form-item label="身份证号" prop="identityCard">
                  <el-input v-model="ruleForm.identityCard" autocomplete="off"></el-input>
                </el-form-item>
              </div>
              <div style="display: flex; justify-content: center">
                <el-form-item label="驾驶证类别:" prop="classify">
                  <el-select
                    v-model="ruleForm.classify"
                    clearable
                    placeholder="选择驾照类别"
                  >
                    <el-option
                      v-for="item in classifies"
                      :key="item.value"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div style="display: flex; justify-content: center">
                <el-form-item
                  v-show="optType == 1"
                  label="已分配教练"
                  prop="coachName"
                  placeholder="暂无教练"
                >
                  <el-input
                    v-model="coachName"
                    autocomplete="off"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </div>
              <div style="display: flex; justify-content: center">
                <el-form-item label="新分配教练:" prop="coachId">
                  <el-select
                    v-model="ruleForm.coachId"
                    clearable
                    placeholder="请选择教练姓名"
                  >
                    <el-option
                      v-for="(item, index) in coachList"
                      :key="index"
                      :label="item.name"
                      :value="item.coachId"
                    />
                  </el-select>
                </el-form-item>
              </div>
              <div style="display: flex; justify-content: center">
                <el-form-item label="联系方式" prop="phone">
                  <el-input v-model="ruleForm.phone"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div v-show="optType == 1">
                <el-form-item label="科目一:" prop="subjectOne">
                  <el-radio-group v-model="ruleForm.subjectOne">
                    <el-radio :label="1">通过</el-radio>
                    <el-radio :label="0">未通过</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="科目二:" prop="subjectTwo">
                  <el-radio-group v-model="ruleForm.subjectTwo">
                    <el-radio :label="1">通过</el-radio>
                    <el-radio :label="0">未通过</el-radio>
                  </el-radio-group> </el-form-item
                ><el-form-item label="科目三:" prop="subjectThree">
                  <el-radio-group v-model="ruleForm.subjectThree">
                    <el-radio :label="1">通过</el-radio>
                    <el-radio :label="0">未通过</el-radio>
                  </el-radio-group> </el-form-item
                ><el-form-item label="科目四:" prop="subjectFour">
                  <el-radio-group v-model="ruleForm.subjectFour">
                    <el-radio :label="1">通过</el-radio>
                    <el-radio :label="0">未通过</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>

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
                    :headers="headers"
                  >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <span v-if="imageUrl" class="el-upload-list__item-actions">
                      <span class="el-upload-span" @click.stop="oploadImgDel">
                        删除图片
                      </span>
                      <span class="el-upload-span"> 重新上传 </span>
                    </span>
                  </el-upload>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>

        <el-form>
          <div class="subBox">
            <el-form-item style="margin: 0 0 5px 0; padding: 0px">
              <el-button type="primary" @click="submitForm()">保存</el-button>
              <el-button @click="() => this.$router.push('/UserManage')">返回</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddUser",

  data() {
    return {
      coachName: "",
      coachList: "",
      row: "",
      optType: "add",
      imageUrl: "",
      headers: {
        token: sessionStorage.getItem("token"),
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
      ruleForm: {
        userNumber: "",
        coachId: "",
        coachName: "",
        subjectOne: 0,
        subjectTwo: 0,
        subjectThree: 0,
        subjectFour: 0,
        identityCard: "",
        password: "",
        sex: "",
        phone: "",
        classify: "",
      },
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
        classify: [{ required: true, message: "请选择驾驶证类别", trigger: "change" }],
        identityCard: [
          { required: true, message: "身份证不能为空", trigger: "blur" },
          { min: 18, max: 18, message: "长度应为18位", trigger: "blur" },
          {
            pattern: /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}(((0[1-9]|1[0-2])(0[1-9]|1\d|2[0-8])|((0[13578]|1[02])(31)|((0[469]|11)(30))|(02(0[1-9]|1\d|2[0-9]))))(?!0000))\d{3}[\dxX]$/,
            message: "身份证号格式不正确",
            trigger: "blur",
          },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度应为11位", trigger: "blur" },
          {
            pattern: /^(1[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9])$/,
            message: "应为11位数字",
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
    //添加
    async addUser() {
      console.log(this.ruleForm);
      await this.$axios
        .post(
          "/api/admin/addUser",
          {
            userNumber: this.ruleForm.userNumber,
            name: this.ruleForm.name,
            password: this.ruleForm.password,
            sex: this.ruleForm.sex,
            identityCard: this.ruleForm.identityCard,
            phone: this.ruleForm.phone,
            coachId: this.ruleForm.coachId,
            userImg: this.imageUrl,
            classify: this.ruleForm.classify,
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
              message: "添加用户成功",
              type: "success",
            });
            this.$router.push("/UserManage");
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    //修改用户信息
    async updateUser() {
      await this.$axios
        .put(
          "/api/admin/updateUser",
          {
            userId: this.ruleForm.userId,
            userNumber: this.ruleForm.userNumber,
            name: this.ruleForm.name,
            password: this.ruleForm.password,
            sex: this.ruleForm.sex,
            identityCard: this.ruleForm.identityCard,
            phone: this.ruleForm.phone,
            coachId: this.ruleForm.coachId,
            userImg: this.imageUrl,
            subjectOne: this.ruleForm.subjectOne,
            subjectTwo: this.ruleForm.subjectOne,
            subjectThree: this.ruleForm.subjectThree,
            subjectFour: this.ruleForm.subjectFour,
          },
          {
            headers: { token: sessionStorage.getItem("token") },
          }
        )
        .then((res) => res.data)
        .then((res) => {
          if (res.code == 1) {
            // res.data.carId = null;
            console.log(res);
            this.$notify({
              title: "成功",
              message: "修改用户数据成功",
              type: "success",
            });
            this.$router.push("/UserManage");
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    //获取教练列表
    async selectCarNumber() {
      await this.$axios
        .get("/api/admin/coachOfUser", {
          headers: {
            token: sessionStorage.getItem("token"),
          },
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            this.coachList = res && res.data;
            console.log(this.coachList);
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },
    //提交
    addOrUpdateUser() {
      if (this.optType == 2) {
        this.addUser();
      } else {
        this.updateUser();
      }
    },
    //提交按钮
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          this.addOrUpdateUser();
        }
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
    //获取路由参数（id），如果有则为修改操作，否则为新增操作
    this.optType = this.$route.query.user ? 1 : 2; //1为更新，2为添加
    this.selectCarNumber();

    if (this.optType === 1) {
      this.ruleForm = this.$route.query.user;
      this.imageUrl = this.$route.query.user.userImg;
      this.ruleForm.coachId = null;
      this.coachName = this.$route.query.user.coachName;
      this.row = this.$route.query.user;
      console.log(this.ruleForm, "asdasdasdasdasd");

      //修改操作，需要根据id查询用户信息用于页面回显
      //   this.getIdCoach(this.id);
    }

    // this.selectCarNumber();
  },
};
</script>
<style scoped>
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
.dashboard {
  width: 100%;
  height: 100%;
}
.container {
  /* background: gray; */
  position: relative;
  z-index: 1;
  padding: 20px 28px;
  /* width: 100%; */
  height: 100%;
  /* border-radius: 4px; */
}

.tableBar {
  /* border: solid 1px gray; */
  border-radius: 5px;
  background: white;
  /* margin-bottom: 20px; */
  /* margin: 20px;
  /* padding: 20px;  */
  /* margin-top: 30px; */
}
.subBox {
  padding-top: 30px;
  text-align: center;
  border-top: solid 1px gray;
}
.tableLab {
  float: right;
}
.el-input {
  width: 223px;
  /* float: left; */
  /* margin: 0%; */
}
</style>
