// .env.test を読み込む
require("dotenv").config({ path: ".env.test" });

module.exports = {
  default: {
    paths: ["e2e/features/**/*.feature"],
    require: ["e2e/**/*.ts"],
    requireModule: ["ts-node/register"],
    format: ["progress", "html:e2e-report.html"],
    formatOptions: {
      snippetInterface: "async-await",
    },
    timeout: 30000, // 30秒タイムアウト
  },
};
