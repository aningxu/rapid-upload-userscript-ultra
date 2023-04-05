/*
 * @Author: mengzonefire
 * @Date: 2022-10-20 10:36:43
 * @LastEditTime: 2023-04-05 21:47:41
 * @LastEditors: mengzonefire
 * @Description: 存放各种全局常量对象
 */

export const TAG = "[秒传链接提取Ultra by mengzonefire]";
export const version = "1.1.6";
export const donateVer = "1.0.0"; // 用于检测可关闭的赞助提示的版本号
export const feedbackVer = "1.0.0"; // 用于检测可关闭的反馈提示的版本号
export const referralVer = "1.0.0"; // 用于检测可关闭的推广提示的版本号
export const donatePage = "https://afdian.net/@mengzonefire";
export const homePage = "https://greasyfork.org/zh-CN/scripts/459862";
export const referralPage = "https://snsyun.baidu.com/sl/eQlxlz8";
const defaultRunInterval = 2; // 默认脚本执行间隔
export const globalConfig: Config = GM_getValue("globalConfig") || {
  runInterval: defaultRunInterval,
  addSyncPath: false,
  bdstoken: "",
}; // 全局配置对象
export const ajaxError = 514; // 自定义ajax请求失败时的错误码(不能与http statusCode冲突)
export const retryMax_apiV2 = 4; // v2转存接口的最大重试次数
export const illegalPathPattern = /[\\":*?<>|]/g; // 匹配路径中的非法字符
export const bdlinkPattern =
  /https:\/\/pan.baidu.com\/#bdlink=([\da-zA-Z+/=]+)/; // b64可能出现的字符: 大小写字母a-zA-Z, 数字0-9, +, /, = (=用于末尾补位)
export const create_url = "https://pan.baidu.com/api/create";
export const precreate_url = "https://pan.baidu.com/api/precreate";
export const bdstoken_url =
  "https://pan.baidu.com/api/gettemplatevariable?fields=[%22bdstoken%22]";
export const syncPathPrefix = "/_pcs_.workspace";
export const syncUrlPrefix =
  "https://pan.baidu.com/disk/synchronization#/index?category=all&path=";
export const homeUrlPrefix =
  "https://pan.baidu.com/disk/main#/index?category=all&path=";
const docPrefix =
  "https://mengzonefire.code.misakanet.cn/rapid-upload-userscript-doc/document";
const docPrefix2 =
  "https://xtsat.github.io/rapid-upload-userscript-doc/document";
export const doc = {
  shareDoc: `${docPrefix}/FAQ/错误代码`,
  linkTypeDoc: `${docPrefix}/Info/秒传格式`,
  bdlinkDoc: `${docPrefix}/秒传链接生成/一键秒传`,
  fastGenDoc: `${docPrefix}/秒传链接生成/极速生成`,
}; // 文档载点1
export const doc2 = {
  shareDoc: `${docPrefix2}/FAQ/错误代码`,
  linkTypeDoc: `${docPrefix2}/Info/秒传格式`,
  bdlinkDoc: `${docPrefix2}/秒传链接生成/一键秒传`,
  fastGenDoc: `${docPrefix2}/秒传链接生成/极速生成`,
}; // 文档载点2
export const linkStyle =
  'class="mzf_link" rel="noopener noreferrer" target="_blank"';
export const btnStyle =
  'class="mzf_btn" rel="noopener noreferrer" target="_blank"';
export const htmlDonate = `<p id="mzf_donate" class="mzf_text">若喜欢该脚本, 可前往 <a href="${donatePage}" ${linkStyle}>赞助页</a> 支持作者<a id="mzf_kill_donate" class="mzf_btn">不再显示</a></p>`;
export const htmlFeedback = `<p id="mzf_feedback" class="mzf_text">若有任何疑问, 可前往 <a href="${homePage}" ${linkStyle}>脚本主页</a> 反馈<a id="mzf_kill_feedback" class="mzf_btn">不再显示</a></p>`;
export const htmlReferral = `<p id="mzf_referral" class="mzf_text">(百度官方推广) <a href="${referralPage}" ${linkStyle}>优惠开通网盘会员</a><a id="mzf_kill_referral" class="mzf_btn">不再显示</a></p>`;
export const htmlAboutBdlink = `什么是一键秒传?: <a href="${doc.bdlinkDoc}" ${linkStyle}>文档载点1</a> <a href="${doc2.bdlinkDoc}" ${linkStyle}>文档载点2</a>`;
export const copyFailList =
  '<a id="copy_fail_list" class="mzf_btn2">复制列表</a>';
export const copyFailBranchList =
  '<a id="copy_fail_branch_list" class="mzf_btn2">复制列表</a>';
export const copySuccessList =
  '<a id="copy_success_list" class="mzf_btn2">复制列表</a>';
export function baiduErrno(errno: number) {
  switch (errno) {
    case -6:
      return `认证失败(请看文档:<a href="${doc.shareDoc}#认证失败-6" ${linkStyle}>载点1</a> <a href="${doc2.shareDoc}#认证失败-6" ${linkStyle}>载点2</a>)`;
    case -7:
      return `转存路径含有非法字符(请看文档:<a href="${doc.shareDoc}#转存路径含有非法字符-7" ${linkStyle}>载点1</a> <a href="${doc2.shareDoc}#转存路径含有非法字符-7" ${linkStyle}>载点2</a>)`;
    case -8:
      return "路径下存在同名文件";
    case -9:
      return "验证已过期, 请刷新页面";
    case 400:
      return `请求错误(请看文档:<a href="${doc.shareDoc}#请求错误-400" ${linkStyle}>载点1</a> <a href="${doc2.shareDoc}#请求错误-400" ${linkStyle}>载点2</a>)`;
    case 403:
      return `接口限制访问(请看文档:<a href="${doc.shareDoc}#接口限制访问-403" ${linkStyle}>载点1</a> <a href="${doc2.shareDoc}#接口限制访问-403" ${linkStyle}>载点2</a>)`;
    case 404:
      return `秒传未生效(请看文档:<a href="${doc.shareDoc}#秒传未生效-404" ${linkStyle}>载点1</a> <a href="${doc2.shareDoc}#秒传未生效-404" ${linkStyle}>载点2</a>)`;
    case 114:
      return `转存失败-v2接口(请看文档:<a href="${doc.shareDoc}#转存失败-v2接口-114" ${linkStyle}>载点1</a> <a href="${doc2.shareDoc}#转存失败-v2接口-114" ${linkStyle}>载点2</a>)`;
    case 514:
      return `请求失败(请看文档:<a href="${doc.shareDoc}#请求失败-514" ${linkStyle}>载点1</a> <a href="${doc2.shareDoc}#请求失败-514" ${linkStyle}>载点2</a>)`;
    case 1919:
      return `文件已被和谐(请看文档:<a href="${doc.shareDoc}#文件已被和谐-1919" ${linkStyle}>载点1</a> <a href="${doc2.shareDoc}#文件已被和谐-1919" ${linkStyle}>载点2</a>)`;
    case 996:
      return `md5获取失败(请看文档:<a href="${doc.shareDoc}#md5-获取失败-996" ${linkStyle}>载点1</a> <a href="${doc2.shareDoc}#md5-获取失败-996" ${linkStyle}>载点2</a>)`;
    case 2:
      return `转存失败-v1接口(请看文档:<a href="${doc.shareDoc}#转存失败-v1接口-2" ${linkStyle}>载点1</a> <a href="${doc2.shareDoc}#转存失败-v1接口-2" ${linkStyle}>载点2</a>)`;
    case -10:
      return "网盘容量已满";
    case 500:
    case 502:
    case 503:
      return `服务器错误(请看文档:<a href="${doc.shareDoc}#服务器错误-50x" ${linkStyle}>载点1</a> <a href="${doc2.shareDoc}#服务器错误-50x" ${linkStyle}>载点2</a>)`;
    case 909:
      return "路径不存在/云端文件已损坏";
    case 900:
      return "路径为文件夹, 不支持生成秒传";
    case 31039:
      return `服务器错误(请看文档:<a href="${doc.shareDoc}#服务器错误-31039" ${linkStyle}>载点1</a> <a href="${doc2.shareDoc}#服务器错误-31039" ${linkStyle}>载点2</a>)`;
    case 110:
      return "请先登录百度账号";
    case 9013:
      return "账号被限制, 尝试 更换账号 或 等待一段时间再重试";
    default:
      return `未知错误(请看文档:<a href="${doc.shareDoc}#未知错误" ${linkStyle}>载点1</a> <a href="${doc2.shareDoc}#未知错误" ${linkStyle}>载点2</a>)`;
  }
} // 自定义百度api返回errno的报错
