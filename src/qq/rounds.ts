// 按"轮"数上下文：一轮 = 一条人说的话（QQ 消息或 dsh 里输入的话）加上她接下来的回复和工具调用。
// 这里只放不依赖 dsh 运行时的纯函数，方便单元测试。

/** 算"人说的话"的消息来源：dsh 里输入的（user）、QQ 来的（plugin:snowluma-bridge）。其他（压缩摘要、运行信息、技能等）不算一轮。 */
export const HUMAN_SOURCES = new Set(['user', 'plugin:snowluma-bridge'])

/** 只用到会话的这几样东西（真实的 dsh Session 都有）。 */
export interface SurfaceLike {
  surface: { nodes: readonly number[] }
  eventAt(seq: number): { type: string; data?: unknown } | undefined
}

export function isHumanTurn(event: { type: string; data?: unknown } | undefined): boolean {
  if (event === undefined || event.type !== 'user/message') return false
  const kind = (event.data as { source?: { kind?: unknown } } | undefined)?.source?.kind
  return typeof kind === 'string' && HUMAN_SOURCES.has(kind)
}

/** 当前上下文里一共有几轮。 */
export function countRounds(session: SurfaceLike): number {
  let n = 0
  for (const seq of session.surface.nodes) if (isHumanTurn(session.eventAt(seq))) n += 1
  return n
}

/**
 * 这一轮刚开始、人说的话还没放进上下文吗？dsh 在每一步发请求前检查要不要压缩（agent/pre-step），
 * 新一轮的第一步检查时，新消息还排在后面没进上下文。往回找日志：先碰到 turn/start 说明还没进来。
 */
export function pendingHumanTurn(session: SurfaceLike & { seq?: number }): boolean {
  const top = typeof session.seq === 'number' ? session.seq - 1 : -1
  for (let seq = top; seq >= 0; seq--) {
    const ev = session.eventAt(seq)
    if (ev === undefined) continue
    if (isHumanTurn(ev)) return false
    if (ev.type === 'turn/start') return true
  }
  return false
}
