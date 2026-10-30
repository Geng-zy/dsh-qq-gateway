/** 算"人说的话"的消息来源：dsh 里输入的（user）、QQ 来的（plugin:snowluma-bridge）。其他（压缩摘要、运行信息、技能等）不算一轮。 */
export declare const HUMAN_SOURCES: Set<string>;
/** 只用到会话的这几样东西（真实的 dsh Session 都有）。 */
export interface SurfaceLike {
    surface: {
        nodes: readonly number[];
    };
    eventAt(seq: number): {
        type: string;
        data?: unknown;
    } | undefined;
}
export declare function isHumanTurn(event: {
    type: string;
    data?: unknown;
} | undefined): boolean;
/** 当前上下文里一共有几轮。 */
export declare function countRounds(session: SurfaceLike): number;
/**
 * 这一轮刚开始、人说的话还没放进上下文吗？dsh 在每一步发请求前检查要不要压缩（agent/pre-step），
 * 新一轮的第一步检查时，新消息还排在后面没进上下文。往回找日志：先碰到 turn/start 说明还没进来。
 */
export declare function pendingHumanTurn(session: SurfaceLike & {
    seq?: number;
}): boolean;
