#!/usr/bin/env node
// Validates feature_list.json: at most one in_progress, all statuses valid.
import { readFileSync } from 'node:fs'

const valid = new Set(['pending', 'in_progress', 'done', 'blocked'])

try {
  const data = JSON.parse(readFileSync('feature_list.json', 'utf8'))
  const features = data.features ?? []
  const inProgress = features.filter((f) => f.status === 'in_progress')
  if (inProgress.length > 1) {
    console.log(`[FAIL]  ${inProgress.length} features in_progress (max 1)`)
    process.exit(1)
  }
  for (const f of features) {
    if (!valid.has(f.status)) {
      console.log(`[FAIL]  Invalid status in feature ${f.id}: ${f.status}`)
      process.exit(1)
    }
  }
  console.log(`[OK]    feature_list.json valid (${features.length} features)`)
} catch (e) {
  console.log(`[FAIL]  feature_list.json invalid: ${e.message}`)
  process.exit(1)
}
