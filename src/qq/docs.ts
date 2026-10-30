// QQ数据目录与原子文件写入。人格文档由人格插件负责。

import { renameSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

/** QQ插件数据目录：<DSH_HOME>/qq-gateway */
export function defaultDataDir(): string {
  const home = process.env.DSH_HOME && process.env.DSH_HOME !== '' ? process.env.DSH_HOME : join(homedir(), '.dsh')
  return join(home, 'qq-gateway')
}

/** 先写临时文件再改名，写到一半断电也不会把原文件弄坏。 */
export function writeAtomic(path: string, content: string | Uint8Array): void {
  const tmp = path + '.tmp-' + process.pid
  writeFileSync(tmp, content)
  renameSync(tmp, path)
}
