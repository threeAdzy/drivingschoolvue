<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label style="margin-right: 5px"> 车牌号: </label>
        <el-input
          clearable
          v-model="carNumber"
          placeholder="请输入车牌号"
          style="width: 15%"
        />
        <label style="margin-right: 5px"> 教练姓名: </label>
        <el-input
          clearable
          v-model="name"
          placeholder="请输入教练姓名"
          style="width: 15%"
        />
        <el-select
          v-model="state"
          style="margin-left: 25px; width: 10%"
          clearable
          placeholder="选择车辆状态"
        >
          <el-option
            v-for="item in status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary" style="margin-left: 25px" @click="adminCarPage()"
          >查询</el-button
        >
        <el-button type="primary" style="float: right" @click="drawer = true"
          >+新增车辆</el-button
        >
      </div>

      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="rowStyle"
      >
        <el-table-column prop="carId" label="ID" width="100"> </el-table-column>
        <el-table-column prop="carNumber" label="车牌号" width="100"> </el-table-column>

        <el-table-column prop="cocahImg" label="车辆照片">
          <template slot-scope="{ row }">
            <el-image
              style="width: 40px; height: 40px; border: none; cursor: pointer"
              :src="row.carImg"
            >
              <div slot="error" class="image-slot">
                <img
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                  style="width: auto; height: 40px; border: none"
                />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="当前使用教练"> </el-table-column>
        <el-table-column prop="coachImg" label="教练头像">
          <template slot-scope="{ row }">
            <el-image
              style="width: 40px; height: 40px; border: none; cursor: pointer"
              :src="row.coachImg"
              v-show="row.name != null"
            >
              <div slot="error" class="image-slot">
                <img
                  src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
                  style="width: auto; height: 40px; border: none"
                />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="使用记录">
          <template slot-scope="scope"
            ><el-button type="text" @click="selectCarRecord(scope.row)"
              >查看使用记录</el-button
            ></template
          >
        </el-table-column>
        <el-table-column prop="carState" label="车辆状态">
          <template slot-scope="scope">
            {{
              scope.row.carState === 0
                ? "空闲"
                : scope.row.carState === 1
                ? "使用中"
                : "维修中"
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-popconfirm
              @confirm="deleteCar(scope.row)"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除该车辆吗？"
            >
              <el-button type="text" slot="reference" style="margin-right: 5px"
                >删除</el-button
              >
            </el-popconfirm>
            <el-popconfirm
              @confirm="updateState(scope.row)"
              icon="el-icon-info"
              icon-color="red"
              title="确定修改该车辆吗？"
            >
              <el-button type="text" slot="reference" style="margin-left: 15px">{{
                scope.row.carState === 2 ? "已维修" : "修改"
              }}</el-button>
            </el-popconfirm>
            <!-- <el-button type="text" @click="updateState(scope.row)">
              {{ scope.row.carState === 2 ? "已维修" : "修改" }}</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="counts"
      >
      </el-pagination>
    </div>
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->

    <el-drawer
      title="添加车辆"
      :visible.sync="drawer"
      :direction="rtl"
      @close="dialogFormNo('form')"
    >
      <div class="demo-drawer__content">
        <el-form :model="form" :rules="rulesNew" ref="form" label-width="80px">
          <el-form-item label="车牌号：" :label-width="formLabelWidth" prop="carNumber">
            <el-input
              v-model="form.carNumber"
              placeholder="请输入车牌号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="分配教练" :label-width="formLabelWidth" prop="coachId">
            <el-select v-model="form.coachId" placeholder="请选择分配教练" clearable>
              <el-option
                v-for="(item, index) in coachList"
                :key="index"
                :label="item.name"
                :value="item.coachId"
              />
            </el-select>
          </el-form-item>
          <div class="imguploadwin">
            <el-form-item label="汽车照片:" prop="coachImg" :label-width="formLabelWidth">
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
          <el-form-item
            ><el-button type="primary" @click="submintCar()"> 确 定</el-button>
            <el-button @click="cancelForm">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <el-dialog
      title="修改车辆信息"
      :visible.sync="dialogFormVisible"
      @close="dialogFormNo('updateform')"
      center
      width="450px"
    >
      <div style="display: flex; justify-content: center">
        <el-form :model="updateform" :rules="rulesUpdate" ref="updateform">
          <el-form-item label="车牌号：" :label-width="formLabelWidth" prop="carNumber">
            <el-input v-model="updateform.carNumber" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="车辆状态：">
            <el-radio-group v-model="updateform.carState">
              <el-radio :label="0">空闲</el-radio>
              <el-radio :label="1">使用</el-radio>
              <el-radio :label="2">维修</el-radio>
            </el-radio-group>
            <div style="margin: 0 0 0 80px; font-size: 12px; color: red">
              注：更改为空闲或维修时会自动清除分配教练。
            </div>
          </el-form-item>
          <el-form-item v-show="updateform.carState == 1" label="当前教练：">
            <el-input v-model="updateform.name" :disabled="true"> </el-input>
          </el-form-item>
          <el-form-item
            label="选择教练："
            prop="coachId"
            v-show="updateform.carState == 1"
          >
            <!-- <el-autocomplete
            class="inline-input"
            v-model="updateform.name"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            :trigger-on-focus="false"
            @select="handleSelect"
          ></el-autocomplete
        > -->
            <el-select v-model="updateform.coachId" filterable placeholder="请选择">
              <el-option
                v-for="item in updateform.coachList"
                :key="item.value"
                :label="item.name"
                :value="item.coachId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <div class="imguploadwin">
            <el-form-item label="汽车照片:" prop="coachImg" :label-width="formLabelWidth">
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
        </el-form>
      </div>

      <div slot="footer" class="subBox">
        <el-button @click="dialogFormNo('updateform')">取 消</el-button>
        <el-button type="primary" @click="dialogFormYes()">确 定</el-button>
      </div>
    </el-dialog>

    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!-- 车辆使用记录弹窗 -->

    <el-dialog :title="recordCarNumber" :visible.sync="dialogTableVisible">
      <el-table
        :data="carRecord"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="rowStyle"
      >
        <el-table-column property="recordId" label="编号" width="80"></el-table-column>
        <el-table-column property="name" label="教练姓名" width="200"></el-table-column>
        <el-table-column property="updateTime" label="更新日期"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-popconfirm
              @confirm="deleteRecord(scope.row)"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除该记录吗？"
            >
              <el-button type="text" slot="reference" style="margin-right: 5px"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "CarManage",
  inject: ["reload"],
  data() {
    return {
      //dialog相关
      dialogFormVisible: false,
      dialogTableVisible: false,
      updateform: {
        carNumber: "",
        coachId: "",
        name: "",
        carState: "",
        coachList: [],
      },

      rulesUpdate: {
        carNumber: [
          { required: true, message: "请输入车牌号", trigger: "blur" },
          { min: 4, max: 4, message: "应为4位数字", trigger: "blur" },
          {
            pattern: /^([0-9][0-9][0-9][0-9])$/,
            message: "应为4位数字",
            trigger: "blur",
          },
        ],
        // coachId: [{ required: updateform.carState==1, message: "请选择教练", trigger: "blur" }],
      },

      //弹出框相关

      formLabelWidth: "80px",
      drawer: false,
      imageUrl: "",
      headers: {
        token: sessionStorage.getItem("token"),
      },

      //弹出框表单
      form: {
        carNumber: "",
        coachId: "",
      },
      rulesNew: {
        carNumber: [
          { required: true, message: "请输入车牌号", trigger: "blur" },
          { min: 4, max: 4, message: "应为4位数字", trigger: "blur" },
          {
            pattern: /^([0-9][0-9][0-9][0-9])$/,
            message: "应为4位数字",
            trigger: "blur",
          },
        ],
      },
      //分割线-----------------------------------------------------------------

      page: 1, //页码
      pageSize: 5, //每页记录数
      carNumber: "", //车牌号，对应输入框
      recordCarNumber: "", //记录表标头的车牌号
      name: "", //教练姓名
      counts: Number,
      tableData: [],
      coachList: [],
      carRecord: [],
      // coachId: "",

      status: [
        {
          value: 0,
          label: "空闲",
        },
        {
          value: 1,
          label: "使用",
        },
        {
          value: 2,
          label: "维修",
        },
      ],
      state: "", //状态
    };
  },

  mounted() {
    // this.restaurants = this.loadAll();
  },

  methods: {
    rowStyle() {
      return "text-align:center";
    },

    //状态更新
    updateState(row) {
      this.selectCoachName();
      if (row.carState == 2) {
        this.stateTwo(row.carState, row.carId);
      }
      if (row.carState == 1) {
        this.dialogFormVisible = true;
        this.stateOne(row);
      }
      if (row.carState == 0) {
        this.dialogFormVisible = true;
        this.stateZero(row);
      }
      // this.dialogFormVisible = false;
    },

    //车辆使用中回显
    stateOne(row) {
      console.log(row);
      this.updateform = { ...row };
      // this.updateform.coachId = null;
      this.updateform.carNumber = this.updateform.carNumber.substring(3, 7);
      this.imageUrl = row.carImg;
      // console.log(typeof this.updateform.coachId, "woshileixing");
      this.updateform.coachList = this.coachList;
    },
    //车辆空闲时回显
    stateZero(row) {
      console.log(row);
      this.updateform = { ...row };
      this.updateform.carNumber = this.updateform.carNumber.substring(3, 7);
      this.imageUrl = row.carImg;
      this.updateform.coachList = this.coachList;
    },
    //更新时关闭
    dialogFormNo(ref) {
      this.adminCarPage();
      this.imageUrl = null;
      this.dialogFormVisible = false;
      this.$refs[ref].resetFields();
    },

    //车辆使用记录弹出框,查询车辆使用记录

    selectCarRecord(row) {
      console.log(row);
      this.recordCarNumber = row.carNumber;
      this.$axios
        .get("/api/admin/carRecord", {
          params: {
            carId: row.carId,
          },
          headers: {
            token: sessionStorage.getItem("token"),
          },
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            this.carRecord = res && res.data;
          }
          // if (res.code === 1) {
          //   this.coachList = res && res.data;
          //   console.log(this.coachList);
          // }
          this.dialogTableVisible = true;
          console.log(this.carRecord);
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },

    //删除记录
    deleteRecord(row) {
      console.log(row);
      this.$axios
        .delete("/api/admin/delRecord", {
          params: {
            recordId: row.recordId,
          },
          headers: {
            token: sessionStorage.getItem("token"),
          },
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            console.log("成功删除");
            this.$notify({
              title: "成功",
              message: "删除记录成功",
            });
            this.selectCarRecord(row);
          } else {
            this.$message.error("请求出错了：" + res.msg);
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },

    //提交修改
    dialogFormYes() {
      console.log(this.updateform);
      this.$axios
        .post(
          "/api/admin/update",
          {
            carState: this.updateform.carState,
            carId: this.updateform.carId,
            carImg: this.imageUrl,
            carNumber: this.updateform.carNumber,
            coachId: this.updateform.coachId,
          },
          {
            headers: this.headers,
          }
        )
        .then((res) => res.data)
        .then((res) => {
          if (res.code == 1) {
            console.log(res);

            this.$notify({
              title: "成功",
              message: "修改车辆状态成功",
              type: "success",
            });
            this.adminCarPage();
            this.selectCoachName();
            this.dialogFormVisible = false;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    //维修完成的请求修改
    stateTwo(state, id) {
      this.$axios
        .post(
          "/api/admin/updateState",
          {
            carId: id,
            carState: state,
          },
          {
            headers: this.headers,
          }
        )
        .then((res) => res.data)
        .then((res) => {
          if (res.code == 1) {
            console.log(res);
            this.$notify({
              title: "成功",
              message: "修改车辆状态成功",
              type: "success",
            });
            this.adminCarPage();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    //添加汽车

    addCar() {
      this.selectCoachName();
      this.$axios
        .post(
          "/api/admin/addCar",
          {
            coachId: this.form.coachId,
            carImg: this.imageUrl,
            carNumber: this.form.carNumber,
          },
          {
            headers: this.headers,
          }
        )
        .then((res) => res.data)
        .then((res) => {
          if (res.code == 1) {
            console.log(res);
            this.$notify({
              title: "成功",
              message: "新增车辆成功",
              type: "success",
            });
            this.drawer = false;
          } else {
            this.$message.error(res.msg);
          }
        });
    },

    //提交新增车辆
    submintCar() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.imageUrl);
          this.addCar();
        }
      });
    },
    //关闭
    cancelForm() {
      this.drawer = false;
    },

    //查询教练列表
    async selectCoachName() {
      await this.$axios
        .get("/api/admin/coachName", {
          headers: this.headers,
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

    //删除车辆
    deleteCar(row) {
      console.log(row);
      this.$axios
        .delete("/api/admin/delcar", {
          params: {
            carId: row.carId,
          },
          headers: {
            token: sessionStorage.getItem("token"),
          },
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            console.log("成功删除");
            this.$notify({
              title: "成功",
              message: "移除车辆成功",
            });
            this.adminCarPage();
          } else {
            this.$message.error("请求出错了：" + res.msg);
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },

    //车辆分页查询
    async adminCarPage() {
      await this.$axios
        .get("/api/admin/car/page", {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            carNumber: this.carNumber,
            carState: this.state,
            name: this.name,
          },
          headers: {
            token: sessionStorage.getItem("token"),
          },
        })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            this.tableData = res && res.data && res.data.records;
            this.counts = Number(res.data.total);
          }
          console.log(this.tableData);
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err.message);
        });
    },

    //翻页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page = 1;
      this.pageSize = val;
      this.adminCarPage();
    },
    //翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.adminCarPage();
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
    //
    //
    //
    // loadAll() {
    //   return [{ name: this.coachList.name, coachId: this.coachList.coachId }];
    // },
    // //
    // querySearch(queryString, cb) {
    //   var restaurants = this.restaurants;
    //   var results = queryString
    //     ? restaurants.filter(this.createFilter(queryString))
    //     : restaurants;
    //   // 调用 callback 返回建议列表的数据
    //   cb(results);
    // },
    // createFilter(queryString) {
    //   return (restaurant) => {
    //     return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
    //   };
    // },
    // handleSelect(item) {
    //   console.log(item);
    // },
  },

  created() {
    this.adminCarPage();
    this.selectCoachName();
  },
};
</script>
<style scoped>
.container {
  background: #fff;
  position: relative;
  z-index: 1;
  padding: 20px 28px;
  border-radius: 4px;
}

.tableBar {
  margin-bottom: 20px;
}

.el-input {
  width: 60%;
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
  /* float: left; */
  /* margin: 0%; */
}
.subBox {
  /* padding-top: 30px; */
  text-align: center;
  /* border-top: solid 1px gray; */
}
.el-dialog__body {
  /* padding-top: 0px; */
  padding-bottom: 0px;
  /* margin-left: 20px; */
  /* color: #606266; */
  /* font-size: 14px; */
}
</style>
