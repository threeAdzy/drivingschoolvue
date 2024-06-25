<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  components: {},
  //解决前端刷新页面路由丢失问题
  data() {
    return {
      // user: JSON.parse(sessionStorage.getItem("token")),
    };
  },
};
</script>
<style></style>
