module.exports = {
  devServer: {
    proxy: {
      '/sendtravelboost': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
};
