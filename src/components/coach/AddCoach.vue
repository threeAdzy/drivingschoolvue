<template>
  <div class="dashboard">
    <div class="container">
      <div class="tableBar">
        <el-button
          type="primary"
          plain
          round
          @click="() => this.$router.push('/CoachManage')"
          >返回至教练管理</el-button
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
            <!-- type="flex" align="middle" -->
            <el-col :span="12" type="flex" align="center">
              <div style="display: flex; justify-content: center">
                <el-form-item label="账号" prop="coachNumber">
                  <el-input v-model="ruleForm.coachNumber"></el-input>
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
                  >
                    <el-input
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
                    <!-- <el-option label="男" value="0"></el-option>
                     <el-option label="女" value="1"></el-option> -->
                  </el-select>
                </el-form-item>
              </div>
              <div style="display: flex; justify-content: center">
                <el-form-item label="年龄" prop="age">
                  <el-input v-model.number="ruleForm.age" autocomplete="off"></el-input>
                </el-form-item>
              </div>
              <div style="display: flex; justify-content: center">
                <el-form-item label="新分配车辆:" prop="carId">
                  <el-select
                    v-model="ruleForm.carId"
                    clearable
                    placeholder="请选择车牌号"
                  >
                    <el-option
                      v-for="(item, index) in carList"
                      :key="index"
                      :label="item.carNumber"
                      :value="item.carId"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="12" type="flex" justify="center">
              <el-form-item
                label="已分配车辆"
                v-show="optType == 1"
                prop="carNumber"
                placeholder="暂无车辆"
              >
                <el-input
                  v-model="carNumber"
                  autocomplete="off"
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="联系方式" prop="phone">
                <el-input v-model="ruleForm.phone"></el-input>
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
            <el-form-item>
              <el-button type="primary" @click="submitForm()">保存</el-button>

              <el-button @click="() => this.$router.push('/CoachManage')">返回</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import imgUpload from "../ImageUpload/imgUpload.vue";
export default {
  // components: { imgUpload },
  name: "Addcoach",

  data() {
    return {
      carNumber: "",
      id: "",
      imageUrl: "",
      headers: {
        token: sessionStorage.getItem("token"),
      },
      optType: 2,

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

      carList: [], //todo 汽车车牌号列表
      value: "", //汽车id
      //表单数据
      ruleForm: {
        coachNumber: null,
        name: null,
        sex: null,
        age: null,
        phone: null,
        carId: null,
        coachImg: "",
        // carNumber: "",
      },
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
            message: "应为11位数字",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    //获取路由参数（id），如果有则为修改操作，否则为新增操作
    this.optType = this.$route.query.coach ? 1 : 2;

    if (this.optType == 1) {
      console.log("hhhhh");
      this.id = this.$route.query.coach.coachId;
      //修改操作，需要根据id查询信息用于页面回显
      this.getIdCoach(this.id);
    }

    this.selectCarNumber();
  },
  methods: {
    // imageChange(value) {
    //   this.ruleForm.image = value;
    // },

    //根据id查询教练信息用于页面回显
    async getIdCoach(id) {
      await this.$axios
        .get("/api/admin/getIdCoach", {
          params: {
            coachId: id,
          },
          headers: {
            token: sessionStorage.getItem("token"),
          },
        })
        .then((res) => {
          if (res.data.code === 1) {
            this.imageUrl = res.data.data.coachImg;
            this.ruleForm = res.data.data;
            this.ruleForm.password = null;

            this.ruleForm.carId = null;
            this.carNumber = res.data.data.carNumber;
            // this.ruleForm = null;
            console.log(res);
          }
        });
    },

    //添加
    addCoach() {
      this.$axios
        .post(
          "/api/admin/addCoach",
          {
            coachNumber: this.ruleForm.coachNumber,
            name: this.ruleForm.name,
            password: this.ruleForm.password,
            sex: this.ruleForm.sex,
            age: this.ruleForm.age,
            phone: this.ruleForm.phone,
            carId: this.ruleForm.carId,
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
              message: "添加教练成功",
              type: "success",
            });
            this.$router.push("/CoachManage");
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    //修改
    async updateCoach(id) {
      await this.$axios
        .put(
          "/api/admin/updateCoach",
          {
            coachId: id,
            coachNumber: this.ruleForm.coachNumber,
            name: this.ruleForm.name,
            password: this.ruleForm.password,
            sex: this.ruleForm.sex,
            age: this.ruleForm.age,
            phone: this.ruleForm.phone,
            carId: this.ruleForm.carId,
            coachImg: this.imageUrl,
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
              message: "修改教练数据成功",
              type: "success",
            });
            this.$router.push("/CoachManage");
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    //提交
    addOrUpdateCoach() {
      if (this.optType == 1) {
        this.updateCoach(this.id);
      } else {
        this.addCoach();
      }
    },

    //提交按钮
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(valid);
          // alert("submit!!!");
          // console.log(this.imageUrl);
          // console.log(this.ruleForm.coachImg); //Img空的
          this.addOrUpdateCoach();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //查询车牌号
    async selectCarNumber() {
      await this.$axios
        .get("/api/admin/carNumber", {
          headers: {
            token: sessionStorage.getItem("token"),
          },
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            this.carList = res && res.data;
            console.log(this.carList);
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
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
