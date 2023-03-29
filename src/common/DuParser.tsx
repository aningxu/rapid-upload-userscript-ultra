/*
 * @Author: mengzonefire
 * @Date: 2021-08-26 12:01:28
 * @LastEditTime: 2023-03-30 00:11:32
 * @LastEditors: mengzonefire
 * @Description: 各种解析器
 */

import { bdlinkPattern } from "@/common/const";
import { decryptMd5 } from "./utils";

/**
 * @description: 从url中解析秒传链接
 */
export function parseQueryLink(url: string): string {
  let bdlinkB64 = url.match(bdlinkPattern);
  return bdlinkB64 ? bdlinkB64[1].fromBase64() : "";
}
/**
 * @description: 秒传链接解析器
 */
export function DuParser() {}

DuParser.parse = function generalDuCodeParse(szUrl: string) {
  let r: any;
  r = DuParser.parseDu_v4(szUrl);
  r.ver = "梦姬标准";
  return r;
};

DuParser.parseDu_v4 = function parseDu_v3(szUrl: string) {
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
        size: info[3],
        path: info[4],
      };
    });
};
