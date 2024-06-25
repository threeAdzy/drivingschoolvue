<template>
  <el-upload
    ref="uploadfiles"
    class="avatar-uploader"
    action="/api/admin/common/upload"
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
</template>

<script>
export default {
  name: "imgUpload",
  data() {
    return {
      imageUrl: "",
      headers: {
        token: sessionStorage.getItem("token"),
      },
    };
  },
  methods: {
    handleAvatarSuccess(response, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      // this.imageUrl = response.data
      // this.imageUrl = `http://172.17.2.120:8080/common/download?name=${response.data}`
      this.imageUrl = `${response.data}`;
      // this.imageUrl = `${baseUrl}/common/download?name=${response.data}`

      this.$emit("imageChange", this.imageUrl); //已经是阿里云的网址了
      //   alert(this.imageUrl);
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
      this.$emit("imageChange", this.imageUrl);
    },
    handleError(err, file, fileList) {
      console.log(err, file, fileList, "handleError");
      this.$message({
        message: "图片上传失败",
        type: "error",
      });
    },
  },
  //   created() {
  //     this.headers = sessionStorage.getItem("token");
  //   },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
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
