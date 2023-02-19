/*
 * @Author: mengzonefire
 * @Date: 2021-08-25 08:34:46
 * @LastEditTime: 2023-02-19 13:34:09
 * @LastEditors: mengzonefire
 * @Description: 定义全套的前台弹窗逻辑, 在Swal的回调函数内调用***Task类内定义的任务代码
 */

import {
  doc,
  globalConfig,
  homeUrlPrefix,
  linkStyle,
  syncUrlPrefix,
  illegalPathPattern,
  syncPathPrefix,
  donateVer,
  feedbackVer,
  htmlDonate,
  htmlFeedback,
} from "./const";
import RapiduploadTask from "./RapiduploadTask";
import { DuParser } from "./duParser";
import { SwalConfig } from "./SwalConfig";
import { parsefileInfo } from "./utils";
import Swal from "sweetalert2";
import $ from "jquery";

export default class Swalbase {
  parseResult: any; // 存储 转存/生成 任务的结果信息
  swalGlobalArgs: any; // 全局swal参数配置对象
  constructor(readonly rapiduploadTask: RapiduploadTask) {}

  // 合并swal参数
  mergeArg(...inputArgs: any) {
    let output = {};
    let swalCfgArgs: any = {
      // 禁用backdrop动画, 阻止多次弹窗时的屏闪
      showClass: { backdrop: "swal2-noanimation" },
      hideClass: { backdrop: "swal2-noanimation" },
    };
    $.extend(output, this.swalGlobalArgs, swalCfgArgs, ...inputArgs);
    return output;
  }

  // 点击 "秒传链接" 后显示的弹窗
  async inputView(inputValue: string = "") {
    let pathValue: string = GM_getValue("last_dir") || ""; // 从GM存储读取上次输入的转存路径
    let preConfirm = () => {
      // 手动读取Multiple inputs内的数据, 由于未设置input参数, 原生Validator不生效, 自行添加Validator逻辑
      inputValue = $("#mzf-rapid-input")[0].value;
      pathValue = $("#mzf-path-input")[0].value;
      if (!inputValue) {
        Swal.showValidationMessage("秒传不能为空");
        return false;
      }
      if (!DuParser.parse(inputValue).length) {
        Swal.showValidationMessage(
          `<p>未识别到正确的链接 <a href="${doc.linkTypeDoc}" ${linkStyle}>查看支持格式</a></p>`
        );
        return false;
      }
      if (pathValue.match(illegalPathPattern)) {
        Swal.showValidationMessage(
          '保存路径不能含有字符\\":*?<>|, 示例：/GTA5/'
        );
        return false;
      }
      if (!globalConfig.bdstoken) {
        Swal.showValidationMessage(
          `<p>请先登录 <a href="https://pan.baidu.com/" ${linkStyle}>百度网盘</a></p>, 再刷新此页面`
        );
        return false;
      }
    };
    let willOpen = () => {
      $(".swal2-container").css("z-index", "99999999");
      $("#swal2-html-container")
        .css("font-size", "1rem")
        .css("display", "grid")
        .css("margin", "0");
      $("#mzf-rapid-input")[0].value = inputValue;
      $("#mzf-path-input")[0].value = pathValue;
      // 解绑可能影响输入框聚焦的document事件
      let focusListener = document.getEventListeners("focus");
      if (focusListener)
        for (let target of focusListener)
          document.removeEventListener("focus", target.listener, true);
    };
    Swal.fire(
      this.mergeArg(SwalConfig.inputView, {
        preConfirm: preConfirm,
        willOpen: willOpen,
      })
    ).then((result: any) => {
      if (result.isConfirmed) {
        this.rapiduploadTask.reset();
        this.rapiduploadTask.fileInfoList = DuParser.parse(inputValue);
        GM_setValue("last_dir", pathValue);
        if (!pathValue) {
          // 路径留空
          this.rapiduploadTask.isDefaultPath = true;
          let nowPath = location.href.match(/path=(.+?)(?:&|$)/);
          if (nowPath) pathValue = decodeURIComponent(nowPath[1]);
          else pathValue = "/";
        }
        if (pathValue.charAt(0) !== "/") pathValue = "/" + pathValue; // 补齐路径前缀斜杠
        if (pathValue.charAt(pathValue.length - 1) !== "/") pathValue += "/"; // 补全路径结尾的斜杠
        if (globalConfig.addSyncPath) pathValue = syncPathPrefix + pathValue; // 补全同步页路径前缀
        console.log(`秒传文件保存到: ${pathValue}`); // debug
        this.rapiduploadTask.savePath = pathValue;
        this.processView();
      }
    });
  }

  // 转存/生成过程中的弹窗
  processView() {
    let swalArg = {
      title: "文件转存中",
      html: "正在转存第 <file_num>0</file_num> 个",
      willOpen: () => {
        $(".swal2-container").css("z-index", "99999999");
        Swal.showLoading();
        this.saveFileWork();
      },
    };
    Swal.fire(this.mergeArg(SwalConfig.processView, swalArg));
  }

  // 转存/生成秒传完成的弹窗
  finishView() {
    let action = "转存";
    let fileInfoList = this.rapiduploadTask.fileInfoList;
    let parseResult = parsefileInfo(fileInfoList);
    this.parseResult = parseResult;
    let html = parseResult.htmlInfo; // 添加失败列表
    let htmlFooter = "";
    if (!GM_getValue(`${donateVer}_kill_donate`)) htmlFooter += htmlDonate; // 添加赞助入口提示
    if (!GM_getValue(`${feedbackVer}_kill_donate`)) htmlFooter += htmlFeedback; // 添加反馈入口提示
    if (htmlFooter) htmlFooter = "<br>" + htmlFooter; // 添加底部空行分隔
    let swalArg = {
      title: `${action}完毕 共${fileInfoList.length}个, 失败${parseResult.failList.length}个!`,
      confirmButtonText: "确认",
      reverseButtons: true,
      html: html + htmlFooter,
      willOpen: () => {
        $(".swal2-container").css("z-index", "99999999");
        this.addOpenDirBtn(); // 转存模式时添加 "打开目录" 按钮
      },
      preConfirm: () => {
        // 转存模式, "确定" 按钮
        return undefined;
      },
    };
    Swal.fire(this.mergeArg(SwalConfig.finishView, swalArg));
  }

  settingView() {
    let willOpen = () => {
      $("#swal2-html-container")
        .css("font-size", "1rem")
        .css("display", "grid")
        .css("margin", "0");
      $("#mzf-interval-input").val(globalConfig.runInterval);
      $("#mzf-add-syncPath")[0].checked = globalConfig.addSyncPath;
    };
    let preConfirm = () => {
      let interval = String($("#mzf-interval-input").val()).trim();
      if (!/^\d+(\.\d+)?$/.test(interval)) {
        Swal.showValidationMessage("执行间隔输入错误, 请输入正数");
        return false;
      }
      globalConfig.runInterval = Number(Number(interval).toFixed(3));
      globalConfig.addSyncPath = $("#mzf-add-syncPath")[0].checked;
      GM_setValue("globalConfig", globalConfig);
    };
    Swal.fire(
      this.mergeArg(SwalConfig.settingView, {
        willOpen: willOpen,
        preConfirm: preConfirm,
      })
    );
  }

  // 以下的方法都是任务操作逻辑, 不是弹窗逻辑
  saveFileWork() {
    this.rapiduploadTask.onFinish = () => this.finishView();
    this.rapiduploadTask.onProcess = (i, fileInfoList) => {
      Swal.getHtmlContainer().querySelector("file_num").textContent = `${
        i + 1
      } / ${fileInfoList.length}`;
    };
    this.rapiduploadTask.start(); // 开始转存任务
  }

  // 添加 "打开目录" 按钮
  addOpenDirBtn() {
    let _dir = (this.rapiduploadTask.savePath || "").replace(/\/$/, ""); // 去除路径结尾的"/"
    if (_dir.charAt(0) !== "/") _dir = "/" + _dir; // 补齐路径开头的"/"
    let cBtn = Swal.getConfirmButton();
    let btn: HTMLElement = cBtn.cloneNode() as HTMLElement;
    btn.textContent = "打开目录";
    btn.style.backgroundColor = "#ecae3c";
    btn.onclick = () => {
      if (_dir.includes(syncPathPrefix))
        GM_openInTab(
          syncUrlPrefix +
            encodeURIComponent(_dir.replace(syncPathPrefix, "") || "/"),
          {
            active: true,
          }
        );
      else
        GM_openInTab(homeUrlPrefix + encodeURIComponent(_dir), {
          active: true,
        });
      Swal.close();
    };
    cBtn.before(btn);
  }
}
