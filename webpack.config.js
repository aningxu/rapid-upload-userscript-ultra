const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackUserscript = require("webpack-userscript");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: [
    path.resolve(__dirname, "src", "common", "getEventListeners.js"),
    path.resolve(__dirname, "src", "app.tsx"),
  ],
  externalsPresets: { node: true },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json"],
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
  },
  output: {
    filename: "秒传链接提取Ultra.user.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "text-loader",
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "./tsconfig.json"),
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: "text-loader",
          },
          "sass-loader",
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "text-loader",
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    // 生成userscript header信息
    new WebpackUserscript({
      headers: {
        name: "秒传链接提取Ultra",
        "name:en": `[name]`,
        version: `[version]`,
        author: `[author]`,
        license: "GPLv3",
        icon: "data:image/png;base64,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",
        namespace: "moe.cangku.mengzonefire",
        supportURL:
          "https://github.com/mengzonefire/rapidupload-userscript-ultra/issues",
        homepageURL: `[homepage]`,
        contributionURL: "https://afdian.net/@mengzonefire",
        description: `[description]`,
        "description:en": "easy to get files from bdlink in web page",
        compatible: [
          "firefox Violentmonkey",
          "firefox Tampermonkey",
          "chrome Violentmonkey",
          "chrome Tampermonkey",
          "edge Violentmonkey",
          "edge Tampermonkey",
        ],
        match: ["*://**/*"],
        grant: [
          "GM_setClipboard",
          "GM_openInTab",
          "GM_setValue",
          "GM_getValue",
          "GM_addStyle",
          "GM_xmlhttpRequest",
          "GM_registerMenuCommand",
        ],
        "run-at": "document-start",
        connect: ["pan.baidu.com"],
        downloadURL:
          "https://greasyfork.org/scripts/459862/code/%E7%A7%92%E4%BC%A0%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96Ultra.user.js",
        updateURL:
          "https://greasyfork.org/scripts/459862/code/%E7%A7%92%E4%BC%A0%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96Ultra.user.js",
      },
      pretty: true,
    }),
  ],
  optimization: {
    minimize: false,
    // 完全禁用压缩(会导致下面的配置项全部失效), 防止在greasyfork上被举报为加密/最小化代码
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
          // 以下四项为禁用代码压缩 + 不压缩标识符
          mangle: false,
          compress: false,
          keep_fnames: true,
          keep_classnames: true,
          format: {
            // 输出格式化, 防止在greasyfork上被举报为最小化代码
            beautify: true,
            // 删除注释
            comments: false,
          },
        },
      }),
    ],
  },
};
