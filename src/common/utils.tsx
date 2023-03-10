/*
 * @Author: mengzonefire
 * @Date: 2023-02-08 21:13:07
 * @LastEditTime: 2023-03-10 19:46:39
 * @LastEditors: mengzonefire
 * @Description: 存放工具函数
 */

import ajax from "@/common/ajax";
import findAndReplaceDOMText from "findAndReplaceDOMText";
import {
  baiduErrno,
  bdstoken_url,
  copyFailBranchList,
  copyFailList,
  copySuccessList,
  globalConfig,
  syncPathPrefix,
} from "./const";
import $ from "jquery";
import { swalInstance } from "./context";

/**
 * @description: 秒传链接dom对象点击回调
 * @param {*} ele 触发的dom对象
 */
export function ATAGListener(ele: any): void {
  let bdlinkList = [ele.target.innerText];
  $(ele.target)
    .siblings("a.mzf_bdlink")
    .each(function () {
      bdlinkList.push($(this).text());
    });
  swalInstance.inputView(bdlinkList.join("\n"));
}

/**
 * @description: 给页面内的秒传链接添加自定义a标签
 */
function addBdlinkWrap() {
  findAndReplaceDOMText(document.body, {
    find: /([\da-f]{9}[\da-z][\da-f]{22})#(?:([\da-f]{32})#)?([\d]{1,20})#(.+)/gi,
    portionMode: "first",
    wrap: "a",
    wrapClass: "mzf_bdlink",
    filterElements: function (ele) {
      return !(ele.classList?.length && ele.classList[0] === "mzf_bdlink");
    },
    forceContext: function (ele) {
      return !ele.matches("a");
    },
  });
}

/**
 * @description: 解密已加密的md5
 * @param {string} md5 (加密)
 * @return {string} md5 (解密)
 */
export function decryptMd5(md5: string): string {
  if (
    !(
      (parseInt(md5[9]) >= 0 && parseInt(md5[9]) <= 9) ||
      (md5[9] >= "a" && md5[9] <= "f")
    )
  )
    return decrypt(md5);
  else return md5;

  function decrypt(encryptMd5: string): string {
    let key = (encryptMd5[9].charCodeAt(0) - "g".charCodeAt(0)).toString(16);
    let key2 = encryptMd5.slice(0, 9) + key + encryptMd5.slice(10);
    let key3 = "";
    for (let a = 0; a < key2.length; a++)
      key3 += (parseInt(key2[a], 16) ^ (15 & a)).toString(16);
    let md5 =
      key3.slice(8, 16) +
      key3.slice(0, 8) +
      key3.slice(24, 32) +
      key3.slice(16, 24);
    return md5;
  }
}

/**
 * @description: 秒传梦姬标准码解析器
 */
export function duParser(szUrl: string) {
  return szUrl
    .split("\n")
    .map(function (z) {
      return z
        .trim()
        .match(
          /^([\da-f]{9}[\da-z][\da-f]{22})#(?:([\da-f]{32})#)?([\d]{1,20})#([\s\S]+)/i
        ); // 22.8.29新增支持第10位为g-z的加密md5, 输入后自动解密转存
    })
    .filter(function (z) {
      return z;
    })
    .map(function (info) {
      return {
        // 标准码 / 短版标准码(无md5s)
        md5: decryptMd5(info[1].toLowerCase()),
        md5s: info[2] || "",
        size: Number(info[3]),
        path: info[4],
      };
    });
}

/**
 * @description: 将data键值对转换为query字符串
 * @param {any} data
 * @return {string} query
 */
export function convertData(data: any): string {
  let query = "";
  for (let key in data) query += `&${key}=${encodeURIComponent(data[key])}`;
  return query;
}

/**
 * @description: 用于解决#31039报错
 * @param {string} path 原文件路径
 * @return {string} 修改文件后缀的路径
 */
export function suffixChange(path: string): string {
  let suffix = path.substring(path.lastIndexOf(".") + 1); // 获取后缀
  return path.substring(0, path.length - suffix.length) + reverseStr(suffix);
}

/**
 * @description: 逆转字符串大小写
 * @param {string} str 输入字符串
 * @return {string} 处理后的字符串
 */
function reverseStr(str: string): string {
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    let reverseChar: string;
    if (str.charAt(i) >= "a") reverseChar = str.charAt(i).toUpperCase();
    else if (str.charAt(i) >= "A") reverseChar = str.charAt(i).toLowerCase();
    else reverseChar = str.charAt(i);
    newStr += reverseChar;
  }
  return newStr;
}

/**
 * @description: 解析文件信息, 返回转存结果列表html, 秒传链接, 失败文件个数, 成功的文件信息列表, 失败的文件信息列表
 * @param {Array} fileInfoList 文件信息数据列表
 */
export function parsefileInfo(fileInfoList: Array<FileInfo>) {
  let bdcode = "";
  let successInfo = "";
  let failedInfo = "";
  let successList = [];
  let failList = [];
  let failCodeDic = {};
  fileInfoList.forEach((item) => {
    item.path = item.path.replace(syncPathPrefix, ""); // 移除同步页前缀
    // 成功文件
    if (0 === item.errno || undefined === item.errno) {
      successInfo += `<p>${item.path}</p>`;
      successList.push(item);
    }
    // 失败文件
    else {
      failList.push(item);
      if (String(item.errno) in failCodeDic)
        failCodeDic[String(item.errno)].push(item);
      else failCodeDic[String(item.errno)] = [item];
    }
  });
  for (let failCode in failCodeDic) {
    let failBranchInfo = "";
    let failBranchList = failCodeDic[failCode];
    failBranchList.forEach((item: any) => {
      failBranchInfo += `<p>${item.path}</p>`;
    });
    failedInfo += `<details class="mzf_details mzf_details_branch"><summary><svg class="mzf_arrow" width="16" height="7"><polyline points="0,0 8,7 16,0"/></svg><b>${baiduErrno(
      Number(failCode)
    )}(#${Number(
      failCode
    )}):</b>${copyFailBranchList}</summary></details><div class="mzf_content">${failBranchInfo}</div>`;
  }
  if (failedInfo)
    failedInfo = `<details class="mzf_details"><summary><svg class="mzf_arrow" width="16" height="7"><polyline points="0,0 8,7 16,0"/></svg><b>失败文件列表(点这里看失败原因):</b>${copyFailList}</summary></details><div class="mzf_content">${failedInfo}</div>`;
  if (successInfo)
    successInfo = `<details class="mzf_details"><summary><svg class="mzf_arrow" width="16" height="7"><polyline points="0,0 8,7 16,0"/></svg><b>成功文件列表(点击展开):</b>${copySuccessList}</summary></details><div class="mzf_content">${successInfo}</div>`;
  bdcode = bdcode.trim();
  return {
    htmlInfo:
      successInfo && failedInfo
        ? successInfo + "<p><br /></p>" + failedInfo
        : successInfo + failedInfo,
    bdcode: bdcode,
    successList: successList,
    failList: failList,
  };
}

export function getBdstoken(
  onSuccess: (bdstoken: string) => void,
  onFail: (errno: number) => void
) {
  ajax(
    {
      url: bdstoken_url,
      method: "GET",
      responseType: "json",
    },
    (data) => {
      if (0 === data.response.errno) onSuccess(data.response.result.bdstoken);
      else onFail(data.response.errno);
    },
    (statusCode) => onFail(statusCode)
  );
}

/**
 * @description: 定时器循环执行函数
 */
export function run() {
  let interval = globalConfig.runInterval * 1000;
  addBdlinkWrap();
  setTimeout(run, interval);
}
