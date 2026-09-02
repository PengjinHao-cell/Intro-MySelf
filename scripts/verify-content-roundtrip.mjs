#!/usr/bin/env node
/**
 * Reversible content round-trip verifier.
 *
 * Writes one temporary published Moment through the same file contract
 * Keystatic and direct editing share, proves it flows through the Astro
 * build into a generated page, then removes exactly that entry. Exits
 * nonzero on refusal, build failure, missing marker, or failed cleanup.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const entryPath = join(projectRoot, 'src/content/moments/roundtrip-check.mdx')
const marker = `roundtrip-check-${Date.now()}`

if (existsSync(entryPath)) {
  console.error(`Refusing to overwrite existing entry: ${entryPath}`)
  process.exit(1)
}

const entry = `---
name: roundtrip-check
publishedAt: 2026-09-02
draft: false
---

${marker}
`

try {
  writeFileSync(entryPath, entry)
  console.log('Wrote temporary entry.')

  const build = spawnSync('npm', ['run', 'build'], {
    cwd: projectRoot,
    encoding: 'utf8',
    timeout: 180_000,
  })
  if (build.status !== 0) {
    console.error('Astro build failed:\n', build.stdout, build.stderr)
    process.exitCode = 1
  } else {
    const htmlPath = join(projectRoot, 'dist/moments/roundtrip-check/index.html')
    const html = readFileSync(htmlPath, 'utf8')
    if (!html.includes(marker)) {
      console.error(`Built Moment page does not contain the marker: ${marker}`)
      process.exitCode = 1
    } else {
      console.log(`Round trip verified: marker appeared in the built Moment page.`)
    }
  }
} finally {
  if (existsSync(entryPath)) {
    rmSync(entryPath)
    console.log('Removed the temporary entry.')
  } else {
    console.error('Cleanup failed: temporary entry is missing.')
    process.exitCode = 1
  }
}
