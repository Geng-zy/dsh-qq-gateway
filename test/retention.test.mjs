import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { Archive } from '../lib/qq/archive.js'
import { QqRetention } from '../lib/qq/retention.js'
const DAY = 86_400_000
function setup(t, over = {}) {
 const home = mkdtempSync(join(tmpdir(), 'qq-retention-'))
 const archive = new Archive(join(home, 'companion.db'))
 t.after(() => { archive.close(); rmSync(home, {recursive:true, force:true}) })
 const categories = new Map(), organized = [], rotated = [], registryCalls = [], carry = new Map(), known = new Set()
 const sessionsRoot = join(home, 'sessions')
 const organizer = {categoryOf:(umo,kind)=>kind==='group'?'group':categories.get(umo)??'private', rememberCategory:(umo,category)=>categories.set(umo,category), organizeUmo:async(umo)=>{organized.push(umo)}}
 const m = new QqRetention({archive, organizer,
 settings:()=>({rotateSessions:true,deleteOldSessions:true,carryMessages:3,archiveDays:s=>s.category==='master'?365:5}),
 snowluma:()=>({rotateSession:async umo=>{rotated.push(umo);return {oldSessionId:'snowluma-'+umo.replace(/[^A-Za-z0-9-]/g,'-'),newSessionId:'snowluma-new-'+rotated.length}}}),
 registry:()=>({archiveSession:async id=>registryCalls.push(['archive',id]),unarchiveSession:async id=>registryCalls.push(['unarchive',id]),list:()=>[{sessionIds:[...known],detachSession:async id=>{registryCalls.push(['detach',id]);known.delete(id)}}]}),
 persistence:()=>({stat:async id=>existsSync(join(sessionsRoot,'proj',id))?{}:undefined,list:async()=>[]}),
 isLive:()=>false,isRunning:()=>false,sessionsRoot,mediaDir:join(home,'media'),setCarry:(umo,text)=>carry.set(umo,text),log:()=>{},...over})
 return {archive,organizer,m,rotated,registryCalls,carry,sessionsRoot,known,home,organized}
}
test('存档到期：先整理，换会话（带最近几条），删存档，旧会话归档；别人的旧会话过期后删掉，主人的不删', async t0 => {
  const t = setup(t0)
  const now = Date.now()
  const group = 'snowluma:GroupMessage:555'
  const master = 'snowluma:FriendMessage:42'
  t.organizer.rememberCategory(master, 'master')
  const g = { umo: group, kind: 'group', groupId: '555', type: 'message', woke: true, direction: 'in', senderName: '群友', senderId: '9' }
  const oldId = 'snowluma-snowluma-GroupMessage-555'
  t.archive.add({ ...g, messageId: '1', time: now - 7 * DAY, text: '一周前', sessionId: oldId })
  t.archive.add({ ...g, messageId: '2', time: now - 6 * DAY, text: '六天前', sessionId: oldId })
  t.archive.add({ ...g, messageId: '3', time: now - DAY, text: '昨天', sessionId: oldId })
  t.archive.add({ umo: master, kind: 'private', userId: '42', type: 'message', woke: true, direction: 'in', senderName: '主人', senderId: '42', messageId: '9', time: now - 10 * DAY, text: '十天前', sessionId: 'snowluma-snowluma-FriendMessage-42' })
  const report = await t.m.run(now)
  assert.deepEqual(t.rotated, [group], '只有群会话用满了保留期')
  assert.equal(report.expired.find(e => e.umo === group).deleted, 2)
  assert.deepEqual(t.archive.recent(group, 10).map(r => r.text), ['昨天'])
  assert.match(t.carry.get(group), /一周前[\s\S]*昨天/)
  assert.deepEqual(t.registryCalls, [['archive', oldId]])
  assert.equal(t.archive.retiredList()[0].state, 'archived')
  assert.equal(t.archive.recent(master, 10).length, 1, '主人的存档 365 天才到期')
  // 旧会话最后一条也过期了：删掉
  mkdirSync(join(t.sessionsRoot, 'proj', oldId), { recursive: true })
  writeFileSync(join(t.sessionsRoot, 'proj', oldId, 'log.jsonl'), '{}')
  t.known.add(oldId)
  const later = await t.m.run(now + 6 * DAY)
  assert.deepEqual(later.deletedSessions, [oldId])
  assert.equal(existsSync(join(t.sessionsRoot, 'proj', oldId)), false)
  assert.deepEqual(t.registryCalls.slice(1).map(c => c[0]), ['detach', 'unarchive'])
  assert.equal(t.archive.retiredList()[0].state, 'deleted')
})

test('删旧会话：只删插件一建的会话；找不到文件夹算失败', async t0 => {
  const t = setup(t0)
  await assert.rejects(t.m.deleteSession('session-abc'), /只删/)
  await assert.rejects(t.m.deleteSession('snowluma-x'), /没找到会话文件夹/)
})

test('清理没被引用的图片', async t0 => {
  const t = setup(t0)
  const media = join(t.home, 'media')
  mkdirSync(media, { recursive: true })
  const used = 'a'.repeat(64) + '.png'
  const unused = 'b'.repeat(64) + '.jpg'
  writeFileSync(join(media, used), 'x')
  writeFileSync(join(media, unused), 'y')
  t.archive.add({ umo: 'u', kind: 'group', groupId: '1', type: 'message', woke: false, direction: 'in', senderName: 'a', senderId: '1', messageId: '1', time: Date.now(), text: '', segments: JSON.stringify([{ type: 'Image', _local: used }]) })
  const r = await t.m.run(Date.now())
  assert.equal(r.mediaRemoved, 1)
  assert.equal(existsSync(join(media, used)), true)
  assert.equal(existsSync(join(media, unused)), false)
})

test('正在回复的会话不轮换、不删除；空闲后才整理并轮换', async t0 => {
 let running=true
 const t=setup(t0,{isRunning:()=>running})
 const now=Date.now(), umo='snowluma:GroupMessage:123'
 t.archive.add({umo,kind:'group',groupId:'123',type:'message',woke:true,direction:'in',senderName:'user',senderId:'1',messageId:'1',time:now-7*DAY,text:'old',sessionId:'snowluma-old'})
 await t.m.run(now)
 assert.equal(t.rotated.length,0); assert.equal(t.organized.length,0); assert.equal(t.archive.recent(umo,10).length,1)
 running=false
 await t.m.run(now)
 assert.deepEqual(t.rotated,[umo]); assert.deepEqual(t.organized,[umo]); assert.equal(t.archive.recent(umo,10).length,0)
})
