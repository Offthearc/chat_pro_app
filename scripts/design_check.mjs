#!/usr/bin/env node
// design_check.mjs — DESIGN.md conformance gate.
//
//   node scripts/design_check.mjs            verify (default)
//   node scripts/design_check.mjs --write    (re)generate src/theme/tokens.css
//
// Verify mode fails (exit 1) when:
//   1. src/theme/tokens.css is missing or out of sync with DESIGN.md, or
//   2. a file under src/ uses a hex color not in the DESIGN.md palette, or
//   3. a CSS font-family literal uses a family not in the typography tokens.
// If DESIGN.md is absent it exits 0 with a warning (the designer has not run
// yet) — mirroring how init.sh tolerates a missing tests/ folder.

import {
  readFileSync,
  existsSync,
  writeFileSync,
  readdirSync,
  statSync,
  mkdirSync,
} from 'node:fs'
import { join, relative } from 'node:path'
import { parse } from 'yaml'

const ROOT = process.cwd()
const DESIGN_PATH = join(ROOT, 'DESIGN.md')
const TOKENS_PATH = join(ROOT, 'src', 'theme', 'tokens.css')
const SRC_DIR = join(ROOT, 'src')
const WRITE = process.argv.includes('--write')

const GENERIC_FONTS = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'ui-rounded',
  'inherit',
  'initial',
  'unset',
  'revert',
  '-apple-system',
])

function fail(msg) {
  console.error(`[FAIL]  ${msg}`)
}
function ok(msg) {
  console.log(`[OK]    ${msg}`)
}
function warn(msg) {
  console.log(`[WARN]  ${msg}`)
}

function parseFrontMatter(text) {
  const match = /^---\n([\s\S]*?)\n---/.exec(text)
  if (!match)
    throw new Error('DESIGN.md has no YAML front matter (--- ... ---)')
  return parse(match[1])
}

function generateTokensCss(tokens) {
  const lines = []
  lines.push('/* AUTO-GENERATED from DESIGN.md by scripts/design_check.mjs. */')
  lines.push(
    '/* Run `npm run design:tokens` to regenerate. Do not edit by hand. */',
  )
  lines.push(':root {')
  if (tokens.colors) {
    lines.push('  /* colors */')
    for (const [name, value] of Object.entries(tokens.colors)) {
      lines.push(`  --color-${name}: ${value};`)
    }
  }
  if (tokens.typography) {
    lines.push('  /* typography */')
    for (const [name, spec] of Object.entries(tokens.typography)) {
      if (spec.fontFamily) lines.push(`  --font-${name}: ${spec.fontFamily};`)
      if (spec.fontSize) lines.push(`  --font-size-${name}: ${spec.fontSize};`)
      if (spec.fontWeight)
        lines.push(`  --font-weight-${name}: ${spec.fontWeight};`)
      if (spec.lineHeight)
        lines.push(`  --line-height-${name}: ${spec.lineHeight};`)
      if (spec.letterSpacing)
        lines.push(`  --letter-spacing-${name}: ${spec.letterSpacing};`)
    }
  }
  if (tokens.rounded) {
    lines.push('  /* rounded */')
    for (const [name, value] of Object.entries(tokens.rounded)) {
      lines.push(`  --rounded-${name}: ${value};`)
    }
  }
  if (tokens.spacing) {
    lines.push('  /* spacing */')
    for (const [name, value] of Object.entries(tokens.spacing)) {
      lines.push(`  --space-${name}: ${value};`)
    }
  }
  lines.push('}')
  return lines.join('\n') + '\n'
}

function walk(dir, exts, out = []) {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) {
      if (entry === 'node_modules') continue
      walk(full, exts, out)
    } else if (exts.some((e) => entry.endsWith(e))) {
      out.push(full)
    }
  }
  return out
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length
}

function paletteHexSet(tokens) {
  const set = new Set()
  for (const value of Object.values(tokens.colors ?? {})) {
    if (typeof value === 'string') set.add(value.toLowerCase())
  }
  return set
}

function allowedFontFamilies(tokens) {
  const set = new Set(GENERIC_FONTS)
  for (const spec of Object.values(tokens.typography ?? {})) {
    if (!spec?.fontFamily) continue
    for (const fam of String(spec.fontFamily).split(',')) {
      set.add(
        fam
          .trim()
          .replace(/^['"]|['"]$/g, '')
          .toLowerCase(),
      )
    }
  }
  return set
}

function checkHexColors(files, palette) {
  const violations = []
  const hexRe = /#[0-9a-fA-F]{3,8}\b/g
  for (const file of files) {
    const text = readFileSync(file, 'utf8')
    let m
    hexRe.lastIndex = 0
    while ((m = hexRe.exec(text))) {
      if (!palette.has(m[0].toLowerCase())) {
        violations.push(
          `${relative(ROOT, file)}:${lineOf(text, m.index)} — off-palette color ${m[0]} (use a var(--color-*) token)`,
        )
      }
    }
  }
  return violations
}

function checkFontFamilies(files, allowed) {
  const violations = []
  const declRe = /font-family\s*:\s*([^;}\n]+)/gi
  for (const file of files) {
    if (!file.endsWith('.css')) continue
    const text = readFileSync(file, 'utf8')
    let m
    declRe.lastIndex = 0
    while ((m = declRe.exec(text))) {
      const value = m[1].trim()
      if (value.includes('var(')) continue
      for (const fam of value.split(',')) {
        const name = fam
          .trim()
          .replace(/^['"]|['"]$/g, '')
          .toLowerCase()
        if (name && !allowed.has(name)) {
          violations.push(
            `${relative(ROOT, file)}:${lineOf(text, m.index)} — off-token font-family "${fam.trim()}" (use a var(--font-*) token)`,
          )
        }
      }
    }
  }
  return violations
}

function main() {
  if (!existsSync(DESIGN_PATH)) {
    warn('DESIGN.md not present yet — run the designer agent to create it.')
    process.exit(0)
  }

  let tokens
  try {
    tokens = parseFrontMatter(readFileSync(DESIGN_PATH, 'utf8'))
  } catch (e) {
    fail(`Could not parse DESIGN.md: ${e.message}`)
    process.exit(1)
  }

  const expected = generateTokensCss(tokens)

  if (WRITE) {
    mkdirSync(join(SRC_DIR, 'theme'), { recursive: true })
    writeFileSync(TOKENS_PATH, expected)
    ok(`Wrote ${relative(ROOT, TOKENS_PATH)} from DESIGN.md tokens.`)
    process.exit(0)
  }

  let failed = false

  if (!existsSync(TOKENS_PATH)) {
    fail(
      `${relative(ROOT, TOKENS_PATH)} missing — run \`npm run design:tokens\`.`,
    )
    process.exit(1)
  }

  const actual = readFileSync(TOKENS_PATH, 'utf8')
  if (actual !== expected) {
    fail(
      `${relative(ROOT, TOKENS_PATH)} is out of sync with DESIGN.md — run \`npm run design:tokens\`.`,
    )
    failed = true
  } else {
    ok('tokens.css is in sync with DESIGN.md.')
  }

  const files = walk(SRC_DIR, ['.ts', '.tsx', '.css']).filter(
    (f) => f !== TOKENS_PATH,
  )
  const hexViolations = checkHexColors(files, paletteHexSet(tokens))
  const fontViolations = checkFontFamilies(files, allowedFontFamilies(tokens))

  for (const v of [...hexViolations, ...fontViolations]) fail(v)
  if (hexViolations.length || fontViolations.length) {
    failed = true
  } else {
    ok('No off-palette colors or off-token fonts in src/.')
  }

  process.exit(failed ? 1 : 0)
}

main()
