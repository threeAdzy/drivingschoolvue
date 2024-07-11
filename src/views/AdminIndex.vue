<template>
  <div class="adminIndex">
    <el-container style="border: 1px solid #eee">
      <!--  -->
      <el-aside
        :width="isCollapse ? '64px' : '200px'"
        style="height: 100vh; background-color: #545c64; margin-left: 0px"
      >
        <Aside :isCollapse="isCollapse"></Aside>
      </el-aside>
      <el-container>
        <el-header
          style="
            text-align: right;
            font-size: 12px;
            height: 100px;
            background-color: gold;
          "
        >
          <Header @doCollapse="doCollapse" :icon="icon"></Header
        ></el-header>
        <el-main style="height: 100%">
          <!-- <el-table :data="tableData">
            <el-table-column prop="date" label="日期" width="140"> </el-table-column>
            <el-table-column prop="name" label="姓名" width="120"> </el-table-column>
            <el-table-column prop="address" label="地址"> </el-table-column>
          </el-table> -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
let clientId = Math.random().toString(36);
import Aside from "./AdminAside.vue";
import Header from "./AdminHeader.vue";
export default {
  name: "Adminindex",
  components: { Aside, Header },
  data() {
    return {
      path: "ws://localhost:8080/ws/",
      ws: {},
      isCollapse: false,
      aside_witdh: "200px",
      icon: "el-icon-d-arrow-left",
    };
  },
  created() {
    this.$router.push("/AdminSelf");
    this.init();
  },
  mounted() {},

  methods: {
    init() {
      // 实例化socket，这里的实例化直接赋值给this.ws是为了后面可以在其它的函数中也能调用websocket方法，例如：this.ws.close(); 完成通信后关闭WebSocket连接
      this.ws = new WebSocket("ws://localhost:8080/ws/" + clientId);

      //监听是否连接成功
      this.ws.onopen = () => {
        console.log("ws连接状态：" + this.ws.readyState);
        //连接成功则发送一个数据
        this.ws.send("连接成功");
      };

      //接听服务器发回的信息并处理展示
      this.ws.onmessage = (data) => {
        console.log("接收到来自服务器的消息：");
        console.log(data.data);
        let jsonObject = JSON.parse(data.data);
        let message = `
          申请类型: ${jsonObject.type}<br>
          申请人: ${jsonObject.person}<br>
          申请内容: ${jsonObject.content}
          `;
        this.$notify.info({
          title: "新的申请",
          dangerouslyUseHTMLString: true,
          message: message,
        });
      };

      //监听连接关闭事件
      this.ws.onclose = () => {
        //监听整个过程中websocket的状态
        console.log("ws连接状态：" + this.ws.readyState);
      };

      //监听并处理error事件
      this.ws.onerror = function (error) {
        console.log(error);
      };
    },

    doCollapse() {
      console.log(1111);

      this.isCollapse = !this.isCollapse;
      if (!this.isCollapse) {
        // 展开
        this.aside_witdh = "200px";
        this.icon = "el-icon-d-arrow-left";
      } else {
        //关起、关闭、收起
        this.aside_witdh = "64px";
        this.icon = "el-icon-d-arrow-right";
      }
    },
  },
};
</script>
<style scoped>
.adminIndex .el-header {
  background-color: #b3c0d1;
  color: #333;
  /* line-height: 60px; */
}

.el-aside {
  color: #333;
}
.el-main {
  padding: 0;
}
/* .el-icon-carrr-side {
  background: url(../assets/car-side.svg);
} */
/* .el-icon-carrr-side:before { */
/* content: "dog"; before属性中的content文本是用来占位的,必须有 */
/* font-size: px; */
/* 可以设置字体大小来确定图标大小 */
/* visibility: hidden; */
/* 使用visibility: hidden;来隐藏文字  */
/* } */
/* .el-main {
  color: #333;
  border: 0px;
} */
</style>
