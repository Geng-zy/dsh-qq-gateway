export interface SegmentSettings {
    adminPrivate: boolean;
    private: boolean;
    group: boolean;
    /** 最多拆成几条（至少 1） */
    maxSegments: number;
    /** 拆开发时每一条最多等几秒打字 */
    maxSecondsPerSegment: number;
}
/** 这个会话要不要分段。 */
export declare function segmentEnabled(s: SegmentSettings, kind: {
    group: boolean;
    adminPrivate: boolean;
}): boolean;
/** 合并发送时，普通文字移除换行，英文单词之间保留必要空格；围栏代码块保留换行及边界。 */
export declare function joinReply(text: string): string;
/** 把一次回复拆成几段。 */
export declare function splitReply(text: string, maxSegments: number): string[];
