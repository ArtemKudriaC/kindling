import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const dir = fileURLToPath(new URL('./follow/', import.meta.url))
const jar = process.env.TLA2TOOLS ?? join(homedir(), '.cache/tla/tla2tools-1.7.4.jar')

const tlc = cfg => {
  assert.ok(existsSync(jar), `no TLA+ tools at ${jar}: download tla2tools.jar 1.7.4 from github.com/tlaplus/tlaplus/releases there, or set TLA2TOOLS to its path`)
  const meta = mkdtempSync(join(tmpdir(), 'tlc-'))
  try {
    return execFileSync('java', ['-XX:+UseParallelGC', '-cp', jar, 'tlc2.TLC', '-workers', 'auto', '-metadir', meta, '-config', cfg, 'Follow.tla'], { cwd: dir, encoding: 'utf8' })
  } catch (e) {
    assert.ok(e.code !== 'ENOENT', 'no java on PATH: TLC runs on a JDK 11 or newer (brew install openjdk)')
    return String(e.stdout ?? '')
  } finally {
    rmSync(meta, { recursive: true, force: true })
  }
}

test('TLC: with a /look that catches up first, the store always holds the last choice and every chat converges to it', () => {
  const out = tlc('Follow.cfg')
  assert.match(out, /Model checking completed\. No error has been found\./, out)
  assert.match(out, /Checking temporal properties/, out)
})

test('TLC: the model is red when a /look writes without catching up (a chat writes its old look over a newer choice)', () => {
  const out = tlc('NoCatchUp.cfg')
  assert.match(out, /Invariant StoreIsLastChoice is violated\.\nError: The behavior up to this point is:/, out)
})

test('TLC: the model is red when no chat follows on its timer (an open chat keeps the look it had)', () => {
  const out = tlc('NoTimer.cfg')
  assert.match(out, /Temporal properties were violated\.[\s\S]*The following behavior constitutes a counter-example:/, out)
})
