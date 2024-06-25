// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
module.exports = {
  devServer: {
    host: '0.0.0.0',
    // public: '0.0.0.0:8080', // 本地的ip:端口号
    port: 8080,
    open: true,
    // disableHostCheck: true,
    hot: true,//自动保存
    // overlay: {
    //   warnings: false,
    //   errors: true
    // },

    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        ws: false,
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }


      //eyJhbGciOiJIUzI1NiJ9.eyJlbXBJZCI6MSwiZXhwIjoxNzEwNTg1MTU0fQ.fMFNV-soOOmIaBBdz4-H4T4_ZAvE4-p69meNes8-atA
    }
  },
}