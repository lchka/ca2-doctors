// filepath: /c:/Users/laura/OneDrive - Dun Laoghaire Institute of Art, Design and Technology/year 3/Front-End D/ca2-doctors/src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://dataservice.accuweather.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};