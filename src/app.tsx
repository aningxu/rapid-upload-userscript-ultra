/*
 * @Author: mengzonefire
 * @Date: 2023-02-04 14:51:19
 * @LastEditTime: 2023-03-29 23:48:24
 * @LastEditors: mengzonefire
 * @Description: 主函数入口
 */

import $ from "jquery";
import { Base64 } from "js-base64";
import appCss from "@/css/app.css";
import appSCss from "@/css/app.scss";
import { ATAGListener, run, getBdstoken } from "./common/utils";
import {
  donateVer,
  feedbackVer,
  globalConfig,
  homePage,
  TAG,
  version,
} from "./common/const";
import { swalInstance } from "./common/context";

function inital(): void {
  console.info("%s version: %s 正在运行", TAG, version);
  // 添加b64拓展
  Base64.extendString();
  // 添加swal参数以防止部分页面下body样式突变(现象: 点开弹窗后原页面样式会突然变化)
  swalInstance.swalGlobalArgs = {
    heightAuto: false,
    scrollbarPadding: false,
    keydownListenerCapture: true,
  };
  // 获取bdstoken
  if (!globalConfig.bdstoken)
    getBdstoken(
      (bdstoken) => {
        globalConfig.bdstoken = bdstoken;
        GM_setValue("globalConfig", globalConfig);
      },
      (_errno) => {}
    );
  // 注入样式
  GM_addStyle(appCss);
  GM_addStyle(appSCss);
  // 预先绑定好按钮事件
  $(document).on("click", "a.mzf_bdlink", ATAGListener);
  $(document).on("click", "#kill_donate", function () {
    GM_setValue(`${feedbackVer}_kill_donate`, true);
    $("#mzf_donate").remove();
  }); // 赞助提示 "不再显示" 按钮
  $(document).on("click", "#kill_feedback", function () {
    GM_setValue(`${donateVer}_kill_feedback`, true);
    $("#mzf_feedback").remove();
  }); // 反馈提示 "不再显示" 按钮
  $(document).on("click", "#copy_fail_list", (btn) => {
    let listText = "";
    for (let item of swalInstance.parseResult.failList)
      listText += item.path + "\n";
    GM_setClipboard(listText);
    btn.target.innerText = "复制成功";
  }); // 失败文件列表复制
  $(document).on("click", "#copy_success_list", (btn) => {
    let listText = "";
    for (let item of swalInstance.parseResult.successList)
      listText += item.path + "\n";
    GM_setClipboard(listText);
    btn.target.innerText = "复制成功";
  }); // 成功文件列表复制
  $(document).on("click", "#copy_fail_branch_list", (btn) => {
    let ele = $(btn.target);
    GM_setClipboard(
      ele
        .parents("details.mzf_details_branch")
        .next()[0]
        .innerText.replace(/\n\n/g, "\n")
    );
    btn.target.innerText = "复制成功";
  }); // 失败文件分支列表复制
  $(document).on("click", "#mzf-refresh-bdstoken", (btn) => {
    let ele = $(btn.target);
    if (ele.text() === "点此刷新bdstoken")
      getBdstoken(
        (bdstoken) => {
          ele.text("刷新成功!");
          globalConfig.bdstoken = bdstoken;
          GM_setValue("globalConfig", globalConfig);
        },
        (errno) => {
          if (-6 === errno) ele.text("刷新失败, 点此登录度盘");
          else ele.text(`刷新失败, 错误码:${errno}, 点此反馈`);
        }
      );
    else if (ele.text().includes("点此登录度盘"))
      GM_openInTab("https://pan.baidu.com", { active: true });
    else if (ele.text().includes("点此反馈"))
      GM_openInTab(homePage, { active: true });
  });
  try {
    // 添加油猴插件菜单按钮
    GM_registerMenuCommand("⚙ 工具设置", () => {
      swalInstance.settingView();
    });
  } catch (_) {
    console.info(
      "%s version: %s 插件菜单添加失败, 使用的插件不支持GM_registerMenuCommand",
      TAG,
      version
    );
  }
}

function app(): void {
  inital();
  $(run);
}

try {
  app();
} catch (error) {
  console.log(error);
}
