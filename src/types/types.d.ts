export {};
declare global {
  interface FileInfo {
    path: string; // 文件路径
    errno?: number; // =0成功, !=0为失败
    size: number; // 文件大小
    md5: string; // md5
  }
  interface Config {
    runInterval: number;
    addSyncPath: boolean;
    bdstoken: string;
  }
  interface HTMLElement {
    value: string;
    checked: boolean;
  }
  interface Document {
    getEventListeners: any;
  }
}
