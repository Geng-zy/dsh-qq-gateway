// 备份与迁移：管理员私聊QQ存档、完整dsh逻辑会话及本插件非密钥设置。
// 保留旧清单字段和设置迁移；cleanItems在导出/恢复写入前限制为本插件的项目。
// 上传先校验路径、文件类型、大小与摘要，确认后按选择恢复，其他数据保持。
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { writeBackupGuide } from './backup-guide.js';
import { Archive } from './archive.js';
import { exportMasterSessions, importMasterSessions } from './master-sessions.js';
export const BACKUP_FORMAT = 'dsh-companion-backup';
export const BACKUP_FORMAT_VERSION = 3;
/** 能备份的东西，顺序就是设置页里的顺序 */
export const ITEMS = ['archiveMaster', 'sessionsMaster', 'settingsBridge'];
/** 默认勾选：主人原始会话需自行勾选（旧设置中已选其他存档时迁移为此项） */
export const DEFAULT_ITEMS = ITEMS.filter(i => i !== 'sessionsMaster');
/** 旧版（格式 1）的包里固定有的 */
const LEGACY_ITEMS = ['persona', 'core', 'diary', 'memory', 'archiveMaster', 'settingsCompanion'];
export const SETTINGS_ITEMS = ['settingsCompanion', 'settingsBridge', 'settingsDsh'];
const DB_ITEMS = ['archiveMaster'];
/** 记忆库的表（换「记忆库」时整表换） */
const MEMORY_TABLES = ['memories', 'tombstones', 'consolidations', 'graph_entities', 'graph_edges', 'graph_mentions', 'graph_done'];
/** 主人的会话：organizer 记的分类是 1 */
const MASTER_UMOS = "SELECT substr(key, 5) FROM cursors WHERE key LIKE 'cat:%' AND value = 1";
export function cleanItems(list) {
    const want = new Set(Array.isArray(list) ? list.map(String) : []);
    return ITEMS.filter(i => want.has(i));
}
/** 设置项的旧选择迁移；不用于解释旧备份包的内容。 */
export function configuredItems(list) {
    return cleanItems(Array.isArray(list) ? list.map(i => i === 'archiveOthers' ? 'sessionsMaster' : i) : list);
}
/** 包里有哪些（旧包没写就按旧版固定内容算） */
export function itemsOf(m) {
    if (m.owner && m.owner !== 'dsh-qq-gateway')
        return [];
    const legacy = Array.isArray(m.items) ? m.items : LEGACY_ITEMS;
    const own = cleanItems(legacy);
    if (!m.owner && legacy.includes('settingsCompanion') && !own.includes('settingsBridge'))
        own.push('settingsBridge');
    return ITEMS.filter(item => own.includes(item));
}
/** 按当前插件可恢复项目列出已校验的业务文件。 */
export function restoreContents(m) {
    return itemsOf(m).map(item => ({ item, files: m.files.filter(f => {
            if (item === 'archiveMaster')
                return f.path === 'companion.db' || f.path.startsWith('media/');
            if (item === 'sessionsMaster')
                return f.path === 'master-sessions.json';
            if (item === 'settingsBridge' && !m.owner && ['settings/companion-core.json', 'settings.json'].includes(f.path))
                return true;
            return Object.entries(SETTINGS_FILES).some(([name, value]) => value === item && f.path === 'settings/' + name + '.json') || item === 'settingsCompanion' && f.path === 'settings.json';
        }).map(({ path, size }) => ({ path, size })) }));
}
export const SETTINGS_FILES = { 'companion-core': 'settingsCompanion', 'snowluma-bridge': 'settingsBridge', dsh: 'settingsDsh' };
function run(cmd, args) {
    return new Promise((resolve, reject) => {
        execFile(cmd, args, { timeout: 10 * 60_000, maxBuffer: 4 * 1024 * 1024 }, (error, _out, stderr) => {
            if (error)
                reject(new Error(cmd + ' 失败：' + (String(stderr).trim().slice(0, 300) || error.message)));
            else
                resolve(_out);
        });
    });
}
function sha256(path) {
    return createHash('sha256').update(readFileSync(path)).digest('hex');
}
function walk(root, dir = root) {
    const out = [];
    if (!existsSync(dir))
        return out;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory())
            out.push(...walk(root, p));
        else if (e.isFile())
            out.push(relative(root, p).split(sep).join('/'));
    }
    return out;
}
/** 文件名里的时间用服务器本地时间（YYYYMMDD-HHMMSS） */
const stamp = (t) => {
    const d = new Date(t);
    const p = (n) => String(n).padStart(2, '0');
    return '' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
};
/** 打一个备份包，返回文件名。成功生成后，所有类型合计仅保留最新 keep 份。 */
export async function createBackup(o) {
    const now = o.now ?? Date.now();
    mkdirSync(o.outDir, { recursive: true });
    const staging = join(o.outDir, '.tmp-' + now.toString(36) + Math.random().toString(36).slice(2, 6));
    mkdirSync(staging, { recursive: true });
    const items = new Set(cleanItems(o.items ?? DEFAULT_ITEMS));
    try {
        if (!items.size)
            throw new Error('至少选择一项属于当前插件的备份内容');
        let archiveMessages = 0;
        const masterSessions = items.has('sessionsMaster') ? await exportMasterSessions(staging, o.sessionServices ?? {}) : 0;
        let range = {};
        const media = new Set();
        if (DB_ITEMS.some(i => items.has(i))) {
            // 数据库：在线拷一份（VACUUM INTO 不影响正在用的），再删掉没勾的部分
            const dbPath = join(staging, 'companion.db');
            o.db.exec("VACUUM INTO '" + dbPath.replace(/'/g, "''") + "'");
            const copy = new DatabaseSync(dbPath);
            try {
                for (const table of [...MEMORY_TABLES, 'journal'])
                    copy.exec('DROP TABLE IF EXISTS ' + table);
                copy.exec("DELETE FROM meta WHERE key LIKE 'embed_dim:%' OR key LIKE 'care:%' OR key='selfcheck:last'");
                copy.exec('DELETE FROM messages WHERE umo NOT IN (' + MASTER_UMOS + ')');
                copy.exec("DELETE FROM meta WHERE key LIKE 'carry:%' OR key LIKE 'proactive:%'");
                archiveMessages = Number(copy.prepare('SELECT COUNT(*) AS n FROM messages WHERE umo IN (' + MASTER_UMOS + ')').get().n);
                const r = copy.prepare('SELECT MIN(time) AS a, MAX(time) AS b FROM messages').get();
                range = { ...(r.a !== null ? { from: Number(r.a) } : {}), ...(r.b !== null ? { to: Number(r.b) } : {}) };
                for (const row of copy.prepare("SELECT segments FROM messages WHERE segments LIKE '%_local%'").all()) {
                    for (const m of row.segments.matchAll(/"_local":"([0-9a-f]{64}\.[a-z0-9]+)"/g))
                        media.add(m[1]);
                }
                copy.exec('VACUUM; PRAGMA journal_mode=DELETE;');
            }
            finally {
                copy.close();
            }
        }
        for (const name of media) {
            const src = join(o.dataDir, 'media', name);
            if (!existsSync(src))
                continue;
            mkdirSync(join(staging, 'media'), { recursive: true });
            cpSync(src, join(staging, 'media', name));
        }
        for (const [name, value] of Object.entries(o.settingsFiles ?? {})) {
            if (SETTINGS_FILES[name] === undefined || !items.has(SETTINGS_FILES[name]))
                continue;
            mkdirSync(join(staging, 'settings'), { recursive: true });
            writeFileSync(join(staging, 'settings', name + '.json'), JSON.stringify(value, null, 2));
        }
        const descriptions = writeBackupGuide(staging, { owner: 'dsh-qq-gateway', plugin: o.plugin, createdAt: now, items: ITEMS.filter(i => items.has(i)), payload: walk(staging), settingDescriptions: o.settingDescriptions });
        const files = walk(staging).map(path => ({ path, sha256: sha256(join(staging, path)), size: statSync(join(staging, path)).size, description: descriptions[path]?.description, restoreItem: descriptions[path]?.restoreItem ?? null }));
        const manifest = {
            owner: 'dsh-qq-gateway', format: BACKUP_FORMAT, formatVersion: BACKUP_FORMAT_VERSION, plugin: o.plugin, schema: o.schema, createdAt: now, reason: o.reason,
            items: ITEMS.filter(i => items.has(i)),
            counts: { memories: 0, diaryDays: 0, months: 0, archiveMessages, media: media.size, masterSessions },
            range, embed: o.embed, settings: {}, files,
        };
        writeFileSync(join(staging, 'manifest.json'), JSON.stringify(manifest, null, 2));
        const name = 'qq-gateway-' + (o.reason === 'auto' ? 'auto' : o.reason === 'before-import' ? 'before-import' : 'manual') + '-' + stamp(now) + '.tar.gz';
        const tmp = join(o.outDir, name + '.part');
        await run('tar', ['-czf', tmp, '-C', staging, '.']);
        renameSync(tmp, join(o.outDir, name));
        prune(o.outDir, o.keep);
        return { name, manifest };
    }
    finally {
        rmSync(staging, { recursive: true, force: true });
    }
}
/** 备份文件列表，新的在前。 */
export function listBackups(outDir) {
    if (!existsSync(outDir))
        return [];
    return readdirSync(outDir).filter(n => /^(?:companion|persona-memory|qq-gateway)-[a-z-]+-\d{8}-\d{6}\.tar\.gz$/.test(n)).map(name => {
        const st = statSync(join(outDir, name));
        const reason = /^(?:companion|persona-memory|qq-gateway)-(auto|manual|before-import)-/.exec(name)?.[1];
        return { name, size: st.size, createdAt: st.mtimeMs, ...(reason ? { reason } : {}) };
    }).sort((a, b) => b.name.slice(-22).localeCompare(a.name.slice(-22)));
}
/** 自动、手动、导入前备份合计保留最新 keep 份；只处理列表中的正式备份包。 */
export function prune(outDir, keep) {
    for (const b of listBackups(outDir).slice(Math.max(1, Math.min(5, keep))))
        rmSync(join(outDir, b.name), { force: true });
}
export function safeBackupName(name) {
    return /^(?:companion|persona-memory|qq-gateway)-[a-z-]+-\d{8}-\d{6}\.tar\.gz$/.test(name);
}
/** 解开一个备份包、核对清单和校验值。返回解开的目录和清单。 */
export async function inspectBackup(file, workDir) {
    const dir = workDir;
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    try {
        // Check paths and entry types before extraction, including entries omitted from the manifest.
        const safePath = (path) => path.length > 0 && !path.startsWith('/') && !path.includes('\\') && !/[\x00-\x1f\x7f]/.test(path) && !path.split('/').some(p => p === '..' || p === '.');
        const names = (await run('tar', ['-tzf', file])).trimEnd().split('\n').map(p => p.replace(/^\.\//, '').replace(/\/$/, '')).filter(Boolean);
        if (names.some(p => !safePath(p)) || new Set(names).size !== names.length)
            throw new Error('备份包含不安全或重复的路径');
        const entries = (await run('tar', ['-tvzf', file])).trimEnd().split('\n');
        if (entries.some(line => !/^[-d]/.test(line)))
            throw new Error('备份包只允许普通文件和目录，不支持链接或特殊文件');
        await run('tar', ['-xzf', file, '-C', dir]);
        const mPath = join(dir, 'manifest.json');
        if (!existsSync(mPath))
            throw new Error('不是陪伴助手备份包（缺少 manifest.json）');
        const manifest = JSON.parse(readFileSync(mPath, 'utf-8'));
        if (manifest.format !== BACKUP_FORMAT)
            throw new Error('不是陪伴助手备份包');
        if (manifest.formatVersion > BACKUP_FORMAT_VERSION)
            throw new Error('备份包是更新版本的插件做的，请先升级插件');
        if (!Array.isArray(manifest.files))
            throw new Error('备份文件清单无效');
        for (const f of manifest.files) {
            if (typeof f.path !== 'string' || !safePath(f.path) || !/^[a-f0-9]{64}$/.test(f.sha256))
                throw new Error('备份文件清单无效');
            const p = join(dir, f.path);
            if (!p.startsWith(dir + sep))
                throw new Error('备份包里有不安全的路径');
            if (!existsSync(p) || !statSync(p).isFile() || statSync(p).size !== f.size || sha256(p) !== f.sha256)
                throw new Error('校验值对不上：' + f.path + '（包可能损坏）');
        }
        const listed = new Set(manifest.files.map(f => f.path));
        if (listed.size !== manifest.files.length || walk(dir).some(p => p !== 'manifest.json' && !listed.has(p)))
            throw new Error('实际文件与备份清单不一致');
        return { dir, manifest };
    }
    catch (error) {
        rmSync(dir, { recursive: true, force: true });
        throw error;
    }
}
/** 包里的设置文件（只读勾选了的）。 */
export function readSavedSettings(dir, items) {
    items = cleanItems(items);
    const out = {};
    for (const [name, item] of Object.entries(SETTINGS_FILES)) {
        const p = join(dir, 'settings', name + '.json');
        if (items.includes(item) && existsSync(p))
            out[name] = JSON.parse(readFileSync(p, 'utf-8'));
    }
    // 旧版的包只有 settings.json（插件二全部设置的值，没有 Key）
    if (items.includes('settingsCompanion') && out['companion-core'] === undefined && existsSync(join(dir, 'settings.json'))) {
        out['companion-core'] = { ns: 'companion-core', user: JSON.parse(readFileSync(join(dir, 'settings.json'), 'utf-8')) };
    }
    if (items.includes('settingsBridge')) {
        const file = join(dir, 'settings', 'companion-core.json'), legacyFile = join(dir, 'settings.json');
        const legacy = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')).user : existsSync(legacyFile) ? JSON.parse(readFileSync(legacyFile, 'utf8')) : undefined;
        if (legacy) {
            const fields = new Set(["imageGenEnabled", "imageGenProvider", "imageGenApiUrl", "imageGenApiKey", "imageGenModel", "imageGenOptions", "imageGenCommand", "imageGenPrivate", "imageGenGroup", "imageGenTimeoutSeconds", "imageGenMaxImages", "imageGenMaxMB", "imageGenKeepDays", "archiveEnabled", "archiveUnwoken", "archiveDaysMaster", "archiveDaysOthers", "groupContextCount", "rotateSessions", "deleteOldSessions", "carryMessages", "archiveImages", "proactiveEnabled", "proactiveMinMinutes", "proactiveMaxMinutes", "proactiveOthersMinMinutes", "proactiveOthersMaxMinutes", "proactivePrivate", "proactiveGroup", "quietStart", "quietEnd", "proactiveRecentMinutes", "proactiveGroupContext", "proactiveActiveDays", "timezone", "silenceToken"]);
            const migrated = Object.fromEntries(Object.entries(legacy).filter(([key]) => fields.has(key)));
            if (Array.isArray(legacy.rules))
                migrated.qqRules = legacy.rules.map((r) => Object.fromEntries(Object.entries(r).filter(([key]) => ['kind', 'target', 'archiveDays', 'archiveUnwoken', 'proactive', 'note'].includes(key))));
            out['snowluma-bridge'] = { ns: 'snowluma-bridge', user: { ...migrated, ...out['snowluma-bridge']?.user } };
        }
    }
    return out;
}
/**
 * 插件启动时（打开数据库之前）调用：有待导入的数据就按勾选还原。
 * 原始会话先建立新日志并切换绑定（旧日志保留），再换数据库（一个事务），最后补充缺失的存档图片。
 * 返回导入的清单和勾选（没有待导入时 undefined）。
 */
export async function applyPendingImport(dataDir, _historyKeep = () => 20, sessionServices = {}) {
    const pending = join(dataDir, '.pending-import');
    if (!existsSync(join(pending, 'manifest.json')))
        return undefined;
    const manifest = JSON.parse(readFileSync(join(pending, 'manifest.json'), 'utf-8'));
    const planPath = join(pending, 'restore.json');
    const plan = existsSync(planPath) ? JSON.parse(readFileSync(planPath, 'utf-8')) : { items: itemsOf(manifest) };
    plan.items = cleanItems(plan.items).filter(item => itemsOf(manifest).includes(item));
    if (!plan.items.length)
        throw new Error('备份中没有属于当前插件的可恢复内容');
    const items = new Set(plan.items); // 已在上一行按所属插件与清单筛选
    if (items.has('sessionsMaster'))
        await importMasterSessions(pending, sessionServices);
    if (DB_ITEMS.some(i => items.has(i)) && existsSync(join(pending, 'companion.db')))
        mergeDb(join(dataDir, 'companion.db'), join(pending, 'companion.db'), items);
    if (items.has('archiveMaster') && existsSync(join(pending, 'media'))) {
        mkdirSync(join(dataDir, 'media'), { recursive: true });
        for (const name of readdirSync(join(pending, 'media')))
            if (!existsSync(join(dataDir, 'media', name)))
                cpSync(join(pending, 'media', name), join(dataDir, 'media', name));
    }
    rmSync(pending, { recursive: true, force: true });
    return { manifest, plan: { ...plan, items: ITEMS.filter(i => items.has(i)) } };
}
/** 把备份库里勾选的部分换进当前库（两边先各自升级到当前版本，表结构就一样了）。 */
function mergeDb(currentPath, backupPath, items) {
    new Archive(backupPath).close();
    new Archive(currentPath).close();
    const db = new DatabaseSync(currentPath);
    db.exec("ATTACH DATABASE '" + backupPath.replace(/'/g, "''") + "' AS bk");
    const cols = (table) => db.prepare('PRAGMA main.table_info(' + table + ')').all().map(r => r.name);
    db.exec('BEGIN');
    try {
        if (items.has('archiveMaster')) {
            // 谁是主人的会话：两边的分类记录合起来
            db.exec('CREATE TEMP TABLE restore_master (umo TEXT PRIMARY KEY)');
            db.exec('INSERT OR IGNORE INTO temp.restore_master ' + MASTER_UMOS.replace('cursors', 'main.cursors') + ' UNION ' + MASTER_UMOS.replace('cursors', 'bk.cursors'));
            const msgCols = cols('messages').filter(c => c !== 'id');
            const insert = db.prepare('INSERT INTO main.messages (' + msgCols.join(', ') + ') VALUES (' + msgCols.map(() => '?').join(', ') + ')');
            const setCursor = db.prepare('INSERT INTO main.cursors (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
            const cursorOf = (key) => db.prepare('SELECT value FROM bk.cursors WHERE key = ?').get(key)?.value;
            {
                const cond = 'umo IN (SELECT umo FROM temp.restore_master)';
                db.exec('DELETE FROM main.messages WHERE ' + cond);
                // 换进来的消息 id 会变，「已整理到哪条」跟着换算（按 org:<会话> 在备份里指到的位置）
                const umos = db.prepare('SELECT DISTINCT umo FROM bk.messages WHERE ' + cond).all().map(r => r.umo);
                for (const umo of umos) {
                    const done = cursorOf('org:' + umo) ?? 0;
                    let mapped = 0;
                    for (const row of db.prepare('SELECT * FROM bk.messages WHERE umo = ? ORDER BY id').all(umo)) {
                        const r = insert.run(...msgCols.map(c => row[c] ?? null));
                        if (Number(row.id) <= done)
                            mapped = Number(r.lastInsertRowid);
                    }
                    setCursor.run('org:' + umo, mapped);
                    const cat = cursorOf('cat:' + umo);
                    if (cat !== undefined)
                        setCursor.run('cat:' + umo, cat);
                }
            }
        }
        db.exec('COMMIT');
    }
    catch (e) {
        db.exec('ROLLBACK');
        throw e;
    }
    finally {
        try {
            db.exec('DETACH DATABASE bk');
        }
        catch { /* 关库时也会断开 */ }
        db.close();
    }
}
