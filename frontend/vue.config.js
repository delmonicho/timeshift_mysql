const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, '../nodejs-express-sequelize-mysql/public'),
  devServer: {
    port: 8081,
    // proxy: {
    //   '/': {
    //     target: 'http://localhost:3000'
    //   }
    // }
  }
}
