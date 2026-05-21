#!/usr/bin/env node
// Prints a conventional-commit message when a feature has newly transitioned
// to "done" in feature_list.json (vs. the committed HEAD version). Otherwise
// prints nothing. Used by scripts/commit_on_done.sh.
import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

function emit(feature) {
  process.stdout.write(
    `feat(${feature.name}): ${feature.title}\n\nCloses feature #${feature.id}`,
  )
}

let current
try {
  current = JSON.parse(readFileSync('feature_list.json', 'utf8'))
} catch {
  process.exit(0)
}
const features = current.features ?? []

let previous = null
try {
  const prev = execSync('git show HEAD:feature_list.json', {
    stdio: ['ignore', 'pipe', 'ignore'],
  }).toString()
  previous = JSON.parse(prev)
} catch {
  previous = null
}

if (!previous) {
  const done = features.filter((f) => f.status === 'done')
  if (done.length) emit(done[done.length - 1])
  process.exit(0)
}

const prevDone = new Set(
  (previous.features ?? []).filter((f) => f.status === 'done').map((f) => f.id),
)
const newlyDone = features.filter(
  (f) => f.status === 'done' && !prevDone.has(f.id),
)
if (newlyDone.length) emit(newlyDone[newlyDone.length - 1])
