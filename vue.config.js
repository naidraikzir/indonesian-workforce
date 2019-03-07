require('dotenv').config();

module.exports = {
  chainWebpack: config => {
    config.module.rule('csv')
      .test(/\.csv$/)
      .use('file')
      .loader('file-loader');

    // Pass env variables to bundle
    config
      .plugin('define')
      .tap(args => {
        Object.keys(process.env).map(key => {
          args[0]['process.env'][key] = JSON.stringify(process.env[key]);
        });
        return args;
      });
  },
};
