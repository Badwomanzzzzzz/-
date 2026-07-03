<template>
  <el-dialog
    v-model="visible"
    title="🐍 贪吃蛇"
    width="440px"
    :close-on-click-modal="false"
    class="snake-dialog"
  >
    <div class="snake-game-box" tabindex="0" ref="gameBoxRef" @keydown="onKey">
      <div class="snake-score-bar">
        <span class="score-item">得分 <em>{{ score }}</em></span>
        <span class="score-item best">最高 <em>{{ bestScore }}</em></span>
      </div>

      <div class="canvas-area">
        <canvas ref="canvasRef" :width="canvasW" :height="canvasH" class="snake-canvas" />
        <div v-if="state === 'idle'" class="overlay">
          <span class="overlay-icon">🐍</span>
          <p>按 <kbd>空格</kbd> 或 <kbd>方向键</kbd> 开始</p>
          <p class="sub">WASD / ↑↓←→ 控制移动</p>
        </div>
        <div v-if="state === 'over'" class="overlay">
          <span class="overlay-icon">😵</span>
          <p>得分：<strong>{{ score }}</strong></p>
          <el-button type="primary" size="small" round @click="restart">再来一局</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, (v) => {
  visible.value = v
  if (v) nextTick(() => gameBoxRef.value?.focus())
  else stopLoop()
})
watch(visible, (v) => emit('update:modelValue', v))

const GRID = 18
const CELL = 20
const canvasW = GRID * CELL
const canvasH = GRID * CELL

const canvasRef = ref(null)
const gameBoxRef = ref(null)
const score = ref(0)
const bestScore = ref(+(localStorage.getItem('snake_best') || 0))
const state = ref('idle')

let ctx, snake, food, dir, nextDir, loopId, speed, lastTime, acc

const getCtx = () => {
  if (!ctx && canvasRef.value) ctx = canvasRef.value.getContext('2d')
  return ctx
}

const init = () => {
  const m = GRID >> 1
  snake = [{ x: m, y: m }, { x: m - 1, y: m }, { x: m - 2, y: m }]
  dir = { x: 1, y: 0 }
  nextDir = { x: 1, y: 0 }
  speed = 130
  lastTime = 0
  acc = 0
}

const spawnFood = () => {
  const set = new Set(snake.map(s => `${s.x},${s.y}`))
  const free = []
  for (let x = 0; x < GRID; x++)
    for (let y = 0; y < GRID; y++)
      if (!set.has(`${x},${y}`)) free.push({ x, y })
  food = free.length ? free[~~(Math.random() * free.length)] : { x: 0, y: 0 }
}

const rRect = (c, x, y, w, h, r) => {
  c.beginPath()
  c.moveTo(x + r, y)
  c.lineTo(x + w - r, y)
  c.quadraticCurveTo(x + w, y, x + w, y + r)
  c.lineTo(x + w, y + h - r)
  c.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  c.lineTo(x + r, y + h)
  c.quadraticCurveTo(x, y + h, x, y + h - r)
  c.lineTo(x, y + r)
  c.quadraticCurveTo(x, y, x + r, y)
  c.closePath()
}

const draw = () => {
  const c = getCtx()
  if (!c) return
  c.clearRect(0, 0, canvasW, canvasH)
  c.fillStyle = '#0f172a'
  c.fillRect(0, 0, canvasW, canvasH)
  for (let x = 0; x < GRID; x++)
    for (let y = 0; y < GRID; y++) {
      c.fillStyle = (x + y) & 1 ? '#111827' : '#0f172a'
      c.fillRect(x * CELL, y * CELL, CELL, CELL)
    }

  snake.forEach((s, i) => {
    const t = i / snake.length
    c.fillStyle = i === 0 ? '#22c55e' : `hsl(${160 + t * 30}, 60%, ${40 - t * 12}%)`
    const p = i === 0 ? 1 : 2
    rRect(c, s.x * CELL + p, s.y * CELL + p, CELL - p * 2, CELL - p * 2, i === 0 ? 6 : 4)
    c.fill()
    if (i === 0) {
      c.fillStyle = '#fff'
      const cx = s.x * CELL + CELL / 2, cy = s.y * CELL + CELL / 2
      const ex = dir.x * 4, ey = dir.y * 4
      ;[cx + ex - 4, cx + ex + 4].forEach(px => {
        c.beginPath(); c.arc(px, cy + ey, 2.5, 0, Math.PI * 2); c.fill()
      })
    }
  })

  const fx = food.x * CELL + CELL / 2, fy = food.y * CELL + CELL / 2
  const t = Date.now() / 200
  const pulse = 1 + Math.sin(t) * 0.12
  c.fillStyle = '#ef4444'
  c.shadowColor = '#f87171'
  c.shadowBlur = 8 * pulse
  c.beginPath()
  c.arc(fx, fy, (CELL / 2 - 2) * pulse, 0, Math.PI * 2)
  c.fill()
  c.shadowBlur = 0
}

const drawIdle = () => {
  const c = getCtx()
  if (!c) return
  c.fillStyle = '#0f172a'
  c.fillRect(0, 0, canvasW, canvasH)
  for (let x = 0; x < GRID; x++)
    for (let y = 0; y < GRID; y++) {
      c.fillStyle = (x + y) & 1 ? '#111827' : '#0f172a'
      c.fillRect(x * CELL, y * CELL, CELL, CELL)
    }
  const m = (GRID >> 1) * CELL
  c.fillStyle = '#22c55e'
  for (let i = 0; i < 3; i++) { rRect(c, m - (1 - i) * CELL + 2, m + 2, CELL - 4, CELL - 4, 4); c.fill() }
  c.fillStyle = '#ef4444'
  c.beginPath(); c.arc(m + 3 * CELL, m + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2); c.fill()
}

const step = () => {
  dir = { ...nextDir }
  const h = snake[0]
  const nh = { x: h.x + dir.x, y: h.y + dir.y }
  if (nh.x < 0 || nh.x >= GRID || nh.y < 0 || nh.y >= GRID) { end(); return }
  if (snake.some(s => s.x === nh.x && s.y === nh.y)) { end(); return }
  snake.unshift(nh)
  if (nh.x === food.x && nh.y === food.y) {
    score.value += 10
    if (score.value > bestScore.value) { bestScore.value = score.value; localStorage.setItem('snake_best', score.value) }
    spawnFood()
    speed = Math.max(55, 130 - snake.length * 2)
  } else {
    snake.pop()
  }
  draw()
}

const tick = (ts) => {
  if (state.value !== 'playing') return
  if (!lastTime) lastTime = ts
  acc += ts - lastTime; lastTime = ts
  while (acc >= speed) { acc -= speed; step(); if (state.value !== 'playing') return }
  loopId = requestAnimationFrame(tick)
}

const start = () => {
  score.value = 0; speed = 130; lastTime = 0; acc = 0
  init(); spawnFood()
  state.value = 'playing'; draw()
  stopLoop()
  loopId = requestAnimationFrame(tick)
}

const end = () => { state.value = 'over'; stopLoop() }
const restart = () => start()
const stopLoop = () => { if (loopId) { cancelAnimationFrame(loopId); loopId = null } }

const onKey = (e) => {
  const k = e.key.toLowerCase()
  if (k === 'escape') return
  e.preventDefault()

  if (state.value === 'idle') {
    if (k === ' ' || k === 'arrowup' || k === 'arrowdown' || k === 'arrowleft' || k === 'arrowright' || k === 'w' || k === 'a' || k === 's' || k === 'd') start()
    return
  }
  if (state.value === 'over') {
    if (k === ' ' || k === 'enter') restart()
    return
  }

  const map = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] }
  const d = map[k]
  if (d && (d[0] !== -dir.x || d[1] !== -dir.y)) nextDir = { x: d[0], y: d[1] }
}

const showIdle = () => { nextTick(() => drawIdle()) }

onUnmounted(() => stopLoop())
</script>

<style scoped>
.snake-game-box { outline: none; }
.snake-score-bar {
  display: flex; justify-content: center; gap: 32px; margin-bottom: 10px;
}
.score-item { font-size: 13px; color: #64748b; }
.score-item em { font-style: normal; font-size: 24px; font-weight: 800; color: #22c55e; margin-left: 4px; }
.score-item.best em { color: #f59e0b; }

.canvas-area { position: relative; display: flex; justify-content: center; }
.snake-canvas { display: block; border-radius: 10px; border: 2px solid #1e293b; }

.overlay {
  position: absolute; inset: 0; border-radius: 10px;
  background: rgba(15, 23, 42, 0.8);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  pointer-events: none;
}
.overlay :deep(.el-button) { pointer-events: auto; }
.overlay-icon { font-size: 42px; margin-bottom: 8px; }
.overlay p { margin: 0 0 6px; font-size: 14px; color: #e2e8f0; }
.overlay .sub { font-size: 12px; color: #94a3b8; }
.overlay kbd {
  display: inline-block; padding: 1px 7px; font-size: 11px; font-family: inherit;
  background: #334155; color: #e2e8f0; border-radius: 4px; border: 1px solid #475569;
}
</style>

<style>
.snake-dialog .el-dialog__header {
  background: linear-gradient(135deg, #4a6cf7, #6366f1);
  margin: 0; padding: 12px 20px; border-bottom: none;
}
.snake-dialog .el-dialog__title { color: #fff; font-weight: 700; font-size: 15px; }
.snake-dialog .el-dialog__headerbtn .el-dialog__close { color: #fff; }
.snake-dialog .el-dialog__body { padding: 14px 20px; }
</style>