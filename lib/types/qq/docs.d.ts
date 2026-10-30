/** QQ插件数据目录：<DSH_HOME>/qq-gateway */
export declare function defaultDataDir(): string;
/** 先写临时文件再改名，写到一半断电也不会把原文件弄坏。 */
export declare function writeAtomic(path: string, content: string | Uint8Array): void;
