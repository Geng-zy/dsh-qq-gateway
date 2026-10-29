import assert from 'node:assert/strict'
import {test}from'node:test'
import{mkdtempSync,mkdirSync,rmSync,writeFileSync}from'node:fs'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{Proactive}from'../lib/qq/proactive.js'
import{archivedImage}from'../lib/qq/archived-image.js'
test('主动聊天先检查权限，名单外会话不读取历史/图片、不排任务、不出现在候选中；手动并发只唤醒一次', async () => {
  const umo = 'snowluma:GroupMessage:555'
  let allowed = false, reads = 0, wakes = 0, release
  const p = new Proactive({
    archive: { umos: () => [{ umo, kind: 'group' }], lastTime: () => Date.now(), recent: () => { reads++; return [] } },
    organizer: { categoryOf: () => 'group' },
    mediaDir: '/unused', meta: { get: () => undefined, set: () => { assert.ok(allowed, '禁止的会话不应排任务') } },
    allowed: () => allowed,
    settings: () => ({ enabled: true, groupEnabled: true, activeWithinDays: 7, groupContextMessages: 15, silenceToken: '[不发]', timeZone: 'UTC', override: () => undefined }),
    wake: () => async () => { wakes++; await new Promise(r => { release = r }) }, log: () => {},
  })
  assert.deepEqual(await p.tick(), [])
  assert.deepEqual(p.list(), [])
  assert.equal(await p.fire(umo, { category: 'group', umo }), false)
  assert.equal(reads, 0)
  allowed = true
  const one = p.fire(umo, { category: 'group', umo })
  assert.equal(await p.fire(umo, { category: 'group', umo }), false)
  release()
  assert.equal(await one, true)
  assert.equal(wakes, 1)
})
test('存档图片：保留格式回退与内容，拒绝越界路径，缺失文件跳过', () => {
  const dir = mkdtempSync(join(tmpdir(), 'companion-image-'))
  try {
    const hash = 'a'.repeat(64)
    for (const [ext, mime] of [['png', 'image/png'], ['gif', 'image/gif'], ['webp', 'image/webp'], ['jpg', 'image/jpeg'], ['jpeg', 'image/jpeg'], ['bin', 'image/jpeg'], ['constructor', 'image/jpeg']]) {
      writeFileSync(join(dir, hash + '.' + ext), 'image bytes')
      assert.deepEqual(archivedImage(dir, hash + '.' + ext), { type: 'image', mediaType: mime, data: Buffer.from('image bytes').toString('base64') })
    }
    for (const name of [undefined, '../' + hash + '.png', 'nested/' + hash + '.png', hash.toUpperCase() + '.png', 'missing.png', hash + '.bmp']) assert.equal(archivedImage(dir, name), undefined)
    mkdirSync(join(dir, hash + '.directory'))
    assert.throws(() => archivedImage(dir, hash + '.directory'), '读取失败仍由上层处理，不伪装为成功')
  } finally { rmSync(dir, { recursive: true, force: true }) }
})
