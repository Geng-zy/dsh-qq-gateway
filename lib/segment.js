// 本插件新增：分段发送。把她一次的回复拆成几条 QQ 消息，像真人一样一句一条地发。
// 规则：
//   - 按换行拆，空行去掉，每段去掉首尾空白；
//   - ``` 包起来的代码块整段算一条，不拆；
//   - 最多拆成 maxSegments 条，多出来的并进最后一条（用换行连着），免得刷屏；
//   - 主人私聊、其他私聊、群聊可以分别开关（默认只有主人私聊开）。
// 每一段各自走发消息节奏（打字等待、群里的频率），所以段和段之间也有自然的停顿。
/** 这个会话要不要分段。 */
export function segmentEnabled(s, kind) {
    return kind.group ? s.group : kind.adminPrivate ? s.adminPrivate : s.private;
}
/** 合并发送时，普通文字移除换行，英文单词之间保留必要空格；围栏代码块保留换行及边界。 */
export function joinReply(text) {
    const parts = splitReply(text, Number.MAX_SAFE_INTEGER);
    return parts.reduce((out, part, i) => out + (i === 0 ? '' :
        part.startsWith('```') || parts[i - 1].startsWith('```') ? '\n' : /[A-Za-z0-9]$/.test(parts[i - 1]) && /^[A-Za-z0-9]/.test(part) ? ' ' : '') + part, '');
}
/** 把一次回复拆成几段。 */
export function splitReply(text, maxSegments) {
    const parts = [];
    let code;
    for (const raw of text.replace(/\r\n?/g, '\n').split('\n')) {
        if (code !== undefined) {
            code.push(raw);
            if (raw.trim().startsWith('```')) {
                parts.push(code.join('\n'));
                code = undefined;
            }
            continue;
        }
        if (raw.trim().startsWith('```')) {
            code = [raw];
            continue;
        }
        const line = raw.trim();
        if (line !== '')
            parts.push(line);
    }
    if (code !== undefined)
        parts.push(code.join('\n'));
    const max = Math.max(1, Math.floor(maxSegments));
    if (parts.length <= max)
        return parts.length > 0 ? parts : [text.trim()];
    return [...parts.slice(0, max - 1), parts.slice(max - 1).join('\n')];
}
