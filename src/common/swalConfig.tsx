/*
 * @Author: mengzonefire
 * @Date: 2021-08-26 12:16:57
 * @LastEditTime: 2023-02-12 04:06:40
 * @LastEditors: mengzonefire
 * @Description: 存放各Swal弹窗的固定参数配置
 */

import { linkStyle } from "./const";

export const SwalConfig = {
  inputView: {
    title: "请输入秒传&保存路径",
    showCancelButton: true,
    html: `<textarea id="mzf-rapid-input" class="swal2-textarea" placeholder="· 支持批量转存多条秒传(换行分隔)\n· 支持PanDL/游侠/标准码/PCS-GO格式\n· 支持输入一键秒传(自动转换为普通秒传)\n· 可在设置页开启监听剪贴板,自动粘贴秒传\n· 输入set进入设置页,gen进入生成页,info进入版本信息页" style="display: flex;padding: 0.4em;"></textarea>
    <input id="mzf-path-input" class="swal2-input" placeholder="保存路径, 示例: /GTA5/, 留空保存在根目录" style="display: flex;margin-top: 10px;">`,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    customClass: { htmlContainer: "mzf_html_container" },
  },

  processView: {
    showCloseButton: true,
    showConfirmButton: false,
    allowOutsideClick: false,
  },

  finishView: {
    showCloseButton: true,
    allowOutsideClick: false,
  },

  settingView: {
    title: "秒传链接提取Ultra 设置页",
    showCloseButton: true,
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    allowOutsideClick: false,
    html: `<label for="mzf-interval-input" class="swal2-input-label">脚本执行间隔(单位:秒)</label> <input id="mzf-interval-input" class="swal2-input" style="display: flex;margin-top: 10px;" /> <label for="mzf-add-syncPath" class="swal2-checkbox" style="display: flex" ><span class="swal2-label">转存到 <a href="https://pan.baidu.com/disk/synchronization#" ${linkStyle}>同步空间</a></span><input class="mzf_check_ori" type="checkbox" value="1" id="mzf-add-syncPath" /><span class="mzf_check"></span ></label> <br> <p style=" margin-bottom: 10px; ">刷新bdstoken: <a id="mzf-refresh-bdstoken" class="mzf_btn">点此刷新bdstoken</a></p>`,
  },
};
