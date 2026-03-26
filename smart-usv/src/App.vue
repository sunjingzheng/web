<script setup>
import { onMounted, ref } from 'vue'
import ChartsOverviewGrid from './components/charts/ChartsOverviewGrid.vue'

const view = ref('chart')

const metricsTemplate = {
  A1: [
    ['RMS', '0.2981', '0.1921', '35.55%'],
    ['后20s的RMS', '0.5137', '0.0464', '90.97%'],
    ['收敛时间', '4.75', '4.77', '不变'],
    ['τ_u RMS', '54.8411', '54.5845', '不变'],
    ['τ_r RMS', '21.9155', '21.6048', '不变'],
  ],
  A2: [
    ['RMS', '0.3124', '0.2056', '34.18%'],
    ['后20s的RMS', '0.5289', '0.0512', '90.32%'],
    ['收敛时间', '5.12', '5.08', '不变'],
    ['τ_u RMS', '55.1023', '54.9011', '不变'],
    ['τ_r RMS', '22.3401', '21.8890', '不变'],
  ],
  B1: [
    ['RMS', '0.3310', '0.2188', '33.90%'],
    ['后20s的RMS', '0.5412', '0.0589', '89.12%'],
    ['收敛时间', '5.45', '5.40', '不变'],
    ['τ_u RMS', '56.2240', '55.9901', '不变'],
    ['τ_r RMS', '23.1188', '22.7602', '不变'],
  ],
  B2: [
    ['RMS', '0.3456', '0.2301', '33.42%'],
    ['后20s的RMS', '0.5598', '0.0624', '88.85%'],
    ['收敛时间', '5.88', '5.82', '不变'],
    ['τ_u RMS', '57.0012', '56.7123', '不变'],
    ['τ_r RMS', '23.8891', '23.4505', '不变'],
  ],
  BASE: [
    ['RMS', '0.2981', '—', '—'],
    ['后20s的RMS', '0.5137', '—', '—'],
    ['收敛时间', '4.75', '—', '—'],
    ['τ_u RMS', '54.8411', '—', '—'],
    ['τ_r RMS', '21.9155', '—', '—'],
  ],
}

const scenarioVideoMap = {
  A1: {
    main: '/main/USV_A1.mp4',
    subs: [
      '/other/tau_r_A1.mp4',
      '/other/tau_u_A1.mp4',
      '/other/x_error_A1.mp4',
      '/other/y_error_A1.mp4',
    ],
  },
  A2: {
    main: '/main/USV_A2.mp4',
    subs: [
      '/other/tau_r_A2.mp4',
      '/other/tau_u_A2.mp4',
      '/other/x_error_A2.mp4',
      '/other/y_error_A2.mp4',
    ],
  },
  B1: {
    main: '/main/USV_B1.mp4',
    subs: [
      '/other/tau_r_B1.mp4',
      '/other/tau_u_B1.mp4',
      '/other/x_error_B1.mp4',
      '/other/y_error_B1.mp4',
    ],
  },
  B2: {
    main: '/main/USV_B2.mp4',
    subs: [
      '/other/tau_r_B2.mp4',
      '/other/tau_u_B2.mp4',
      '/other/x_error_B2.mp4',
      '/other/y_error_B2.mp4',
    ],
  },
  BASE: {
    main: '/main/USV_BASE.mp4',
    subs: [
      '/other/tau_r_BASE.mp4',
      '/other/tau_u_BASE.mp4',
      '/other/x_error_BASE.mp4',
      '/other/y_error_BASE.mp4',
    ],
  },
}

let currentGroup = 0
let fakePredictionTimer = null

const groupData = [1, 2, 3, 4, 5].map((n) => ({
  id: n,
  inputs: { input1: '', bScenario: 'B1' },
  activeScenario: 'B1',
  outputs: JSON.parse(JSON.stringify(scenarioVideoMap)),
  metrics: JSON.parse(JSON.stringify(metricsTemplate)),
}))

function getScenarioFromInputs(inputs) {
  if ((inputs.input1 || '').trim()) return 'A1'
  return (inputs.bScenario || 'B1').toString()
}

function renderVideo(src) {
  return `
    <video class="auto-video" muted loop playsinline preload="auto"
           disablepictureinpicture controlslist="nodownload noplaybackrate nofullscreen noremoteplayback">
      <source src="${src}" type="video/mp4" />
    </video>
  `
}

// subs 索引：0=tau_r, 1=tau_u, 2=x_error, 3=y_error；展示顺序：X、Y、tau-u、tau-r
const SUB_PANEL_ORDER = [2, 3, 1, 0]
const SUB_PANEL_LABELS = ['X 误差对比', 'Y 误差对比', 'τ_u 对比', 'τ_r 对比']

function renderResultFrame(src, caption, isLarge = false) {
  const sizeClass = isLarge ? 'large' : 'small'
  return `
    <div class="result-card ${sizeClass}">
      <div class="result-video-wrap">
        <div class="hud"></div>
        ${renderVideo(src)}
      </div>
      <div class="result-caption">${caption}</div>
    </div>
  `
}

function syncAndPlayVideos() {
  const videos = Array.from(document.querySelectorAll('.auto-video'))
  videos.forEach((video) => {
    try {
      video.pause()
      video.currentTime = 0
    } catch (e) {}
    video.defaultMuted = true
    video.muted = true
  })

  requestAnimationFrame(() => {
    videos.forEach((video) => {
      const playPromise = video.play()
      if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {})
    })
  })
}

function renderOutputs(scenario) {
  const output = groupData[currentGroup].outputs[scenario]
  const mainFrame = renderResultFrame(output.main, '轨迹对比', true)
  const smallFrames = SUB_PANEL_ORDER.map((subIndex, i) => renderResultFrame(output.subs[subIndex], SUB_PANEL_LABELS[i], false))

  document.getElementById('resultGrid').innerHTML = `
    <div class="result-flex">
      <div class="result-main-col">${mainFrame}</div>
      <div class="result-side-col">${smallFrames.join('')}</div>
    </div>
  `

  syncAndPlayVideos()
}

function renderMetricsTable(type = 'A1') {
  const metrics = groupData[currentGroup].metrics[type] || []
  document.getElementById('metricsTitle').textContent = type

  if (!metrics.length) {
    document.getElementById('metricsContent').innerHTML = '<div class="metrics-empty">当前参数暂无指标数据</div>'
    return
  }

  const rows = metrics
    .map(
      (row) => `
      <tr>
        <td class="metric-name">${row[0]}</td>
        <td>${row[1]}</td>
        <td>${row[2]}</td>
        <td>${row[3]}</td>
      </tr>
    `
    )
    .join('')

  document.getElementById('metricsContent').innerHTML = `
    <table class="metrics-table">
      <thead>
        <tr>
          <th class="metric-name">指标</th>
          <th>BASE</th>
          <th>CNN</th>
          <th>改善程度</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `
}

function renderLoadingState(type = 'A1') {
  document.getElementById('metricsTitle').textContent = type
  document.getElementById('metricsContent').innerHTML = `
    <div class="loading-box">
      <div class="loading-text">结果计算中...</div>
      <div class="loading-bar"></div>
      <div class="loading-dots">加载中</div>
    </div>
  `
}

function fillInputs() {
  const inputs = groupData[currentGroup].inputs
  document.getElementById('input1').value = inputs.input1

  const isB1 = (inputs.bScenario || 'B1') === 'B1'
  const b1Radio = document.getElementById('radioB1')
  const b2Radio = document.getElementById('radioB2')
  if (b1Radio) b1Radio.checked = isB1
  if (b2Radio) b2Radio.checked = !isB1
}

function saveInputs() {
  groupData[currentGroup].inputs = {
    input1: document.getElementById('input1').value,
    bScenario: document.getElementById('radioB1')?.checked ? 'B1' : 'B2',
  }
  groupData[currentGroup].activeScenario = getScenarioFromInputs(groupData[currentGroup].inputs)
}

function runPrediction() {
  saveInputs()
  const scenario = groupData[currentGroup].activeScenario

  clearTimeout(fakePredictionTimer)
  renderLoadingState(scenario)

  fakePredictionTimer = setTimeout(() => {
    renderOutputs(scenario)
    renderMetricsTable(scenario)
  }, 1200)
}

function resetForm() {
  clearTimeout(fakePredictionTimer)
  groupData[currentGroup].inputs = { input1: '', bScenario: 'B1' }
  groupData[currentGroup].activeScenario = getScenarioFromInputs(groupData[currentGroup].inputs)
  fillInputs()

  document.getElementById('resultGrid').innerHTML = ''
  document.getElementById('metricsTitle').textContent = groupData[currentGroup].activeScenario
  document.getElementById('metricsContent').innerHTML = '<div class="metrics-empty">等待预测结果...</div>'
}

function initPage() {
  fillInputs()
  document.getElementById('resultGrid').innerHTML = ''
  document.getElementById('metricsTitle').textContent = groupData[currentGroup].activeScenario
  document.getElementById('metricsContent').innerHTML = '<div class="metrics-empty">等待预测结果...</div>'
}

function setView(next) {
  view.value = next
  document.body.style.overflow = next === 'demo' ? 'hidden' : 'auto'
}

onMounted(() => {
  document.body.style.overflow = view.value === 'demo' ? 'hidden' : 'auto'
  initPage()
})
</script>

<template>
  <div class="app-root">
    <div class="main-view" v-show="view === 'demo'">
      <div class="page">
        <section class="hero">
          <div class="floating-orb orb-1"></div>
          <div class="hero-left">
            <div class="hero-icon"></div>
            <div class="hero-text">
              <h1>无人艇轨迹跟踪演示</h1>
              <p>演示界面</p>
            </div>
          </div>
          <div class="hero-right" aria-label="页面切换">
            <div class="nav-links">
              <button type="button" class="nav-item" :class="{ active: view === 'demo' }" @click="setView('demo')">轨迹跟踪演示</button>
              <button type="button" class="nav-item" :class="{ active: view === 'chart' }" @click="setView('chart')">结果总览</button>
            </div>
            <div class="hero-badge">演示模式</div>
          </div>
        </section>

        <div class="layout">
          <aside class="panel input-panel">
            <div class="floating-orb orb-2"></div>
            <div class="panel-header">
              <h2 class="panel-title">参数设置</h2>
              <span class="panel-subtitle">参数控制台</span>
            </div>

            <div class="input-grid">
              <div class="field">
                <label for="input1">A1 高频扰动</label>
                <input id="input1" type="text" placeholder="请输入参数" />
              </div>
              <div class="field">
                <label>B 场景选择</label>
                <div class="radio-group" role="radiogroup" aria-label="B 场景选择">
                  <label class="radio-item">
                    <input id="radioB1" type="radio" name="bScenario" value="B1" />
                    <span>B1 参数不确定</span>
                  </label>
                  <label class="radio-item">
                    <input id="radioB2" type="radio" name="bScenario" value="B2" />
                    <span>B2 噪声+不确定</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="metrics-panel" id="metricsPanel">
              <div class="metrics-header">
                <strong>指标结果</strong>
                <span id="metricsTitle">A1</span>
              </div>
              <div class="metrics-table-wrap" id="metricsContent"></div>
            </div>

            <div class="actions">
              <button class="btn btn-primary" type="button" @click="runPrediction">开始预测</button>
              <button class="btn btn-secondary" type="button" @click="resetForm">重置</button>
            </div>
          </aside>

          <main class="panel output-panel">
            <div class="panel-header">
              <h2 class="panel-title">结果展示</h2>
              <span class="panel-subtitle">展示区</span>
            </div>

            <div class="output-body">
              <div class="section-head">
                <h3>可视化输出</h3>
                <span>轨迹与误差</span>
              </div>
              <div class="result-output" id="resultGrid"></div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <div class="main-view" v-show="view === 'chart'">
      <div class="chart-page">
        <ChartsOverviewGrid :active="view === 'chart'" @go-demo="setView('demo')" />
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --bg-1: #eef6ff;
  --bg-2: #dbeaff;
  --bg-3: #c8ddff;
  --text-1: #13356f;
  --text-2: #5878ad;
  --blue-1: #2f73ff;
  --blue-2: #49a7ff;
  --blue-3: #7de6ff;
  --shadow-lg: 0 1.5rem 4.375rem rgba(46, 109, 225, 0.14);
  --shadow-md: 0 0.875rem 2.125rem rgba(51, 101, 190, 0.1);
  --gap: 0.875rem;
  --header-h: 4.875rem;
}

/* 覆盖 Vite 模板里的 #app 尺寸限制，保证充满屏幕 */
#app {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  text-align: left !important;
  border: 0 !important;
  min-height: 100vh !important;
  display: block !important;
  box-sizing: border-box !important;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  height: 100%;
  overflow: hidden;
  font-family: Inter, "Microsoft YaHei", PingFang SC, system-ui, sans-serif;
  color: var(--text-1);
  background: radial-gradient(circle at 12% 12%, rgba(73, 167, 255, 0.34), transparent 18%),
    radial-gradient(circle at 88% 10%, rgba(125, 230, 255, 0.26), transparent 18%),
    radial-gradient(circle at 50% 100%, rgba(47, 115, 255, 0.18), transparent 30%),
    linear-gradient(180deg, var(--bg-1) 0%, var(--bg-2) 50%, var(--bg-3) 100%);
}

html {
  font-size: clamp(0.75rem, 0.6vw + 0.55rem, 1rem);
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(rgba(58, 128, 255, 0.05) 0.0625rem, transparent 0.0625rem),
    linear-gradient(90deg, rgba(58, 128, 255, 0.05) 0.0625rem, transparent 0.0625rem);
  background-size: 2.75rem 2.75rem;
  mask-image: radial-gradient(circle at center, rgba(255, 255, 255, 0.95), transparent 92%);
}

.app-root {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding-top: 0.75rem;
  box-sizing: border-box;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-item {
  padding: 0.5rem 1.125rem;
  border-radius: 999rem;
  border: 0.0625rem solid rgba(74, 129, 255, 0.2);
  background: rgba(255, 255, 255, 0.65);
  color: var(--text-2);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.nav-item:hover {
  color: var(--blue-1);
  border-color: rgba(47, 115, 255, 0.35);
}

.nav-item.active {
  color: #fff;
  background: linear-gradient(135deg, var(--blue-1), var(--blue-2));
  border-color: transparent;
  box-shadow: 0 0.375rem 1rem rgba(47, 115, 255, 0.28);
}

.main-view {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.page {
  width: min(96.25rem, calc(100vw - 1.75rem));
  flex: 1;
  min-height: 0;
  height: auto;
  margin: 0 auto 0.75rem;
  display: grid;
  grid-template-rows: var(--header-h) minmax(0, 1fr);
  gap: var(--gap);
}

.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  border-radius: 1.375rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(234, 244, 255, 0.76)),
    linear-gradient(90deg, rgba(47, 115, 255, 0.1), rgba(125, 230, 255, 0.12));
  border: 0.0625rem solid rgba(255, 255, 255, 0.75);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(1.125rem);
  overflow: hidden;
}

.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(96deg, transparent 16%, rgba(255, 255, 255, 0.58) 40%, transparent 62%);
  transform: translateX(-120%);
  animation: shine 7s linear infinite;
  pointer-events: none;
}

.hero::after {
  content: "";
  position: absolute;
  left: 1.5rem;
  right: 1.5rem;
  bottom: 0;
  height: 0.25rem;
  border-radius: 999rem;
  background: linear-gradient(
    90deg,
    rgba(47, 115, 255, 0.18),
    rgba(73, 167, 255, 0.82),
    rgba(125, 230, 255, 0.9),
    rgba(47, 115, 255, 0.18)
  );
}

.hero-left {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hero-right {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.hero-icon {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 1.125rem;
  background: linear-gradient(135deg, var(--blue-1), var(--blue-2) 60%, var(--blue-3));
  box-shadow: 0 0.75rem 1.5rem rgba(47, 115, 255, 0.22);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.hero-icon::before,
.hero-icon::after {
  content: "";
  position: absolute;
  border-radius: 999rem;
  background: rgba(255, 255, 255, 0.92);
}

.hero-icon::before {
  width: 1.5rem;
  height: 0.1875rem;
  left: 0.875rem;
  top: 1.5rem;
  transform: rotate(-24deg);
}

.hero-icon::after {
  width: 1.125rem;
  height: 0.1875rem;
  left: 1.125rem;
  top: 1.0625rem;
  box-shadow: -0.5rem 0.6875rem 0 rgba(255, 255, 255, 0.92);
}

.hero-text h1 {
  margin: 0;
  font-size: 1.75rem;
  line-height: 1.1;
  font-weight: 900;
  letter-spacing: 0.0125rem;
}

.hero-text p {
  margin: 0.375rem 0 0;
  color: var(--text-2);
  font-size: 0.75rem;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
}

.hero-badge {
  position: relative;
  z-index: 1;
  padding: 0.5rem 0.875rem;
  border-radius: 999rem;
  background: rgba(255, 255, 255, 0.56);
  border: 0.0625rem solid rgba(73, 167, 255, 0.18);
  color: #4f74b0;
  font-size: 0.75rem;
  letter-spacing: 0.0625rem;
  white-space: nowrap;
}

.layout {
  min-height: 0;
  display: grid;
  grid-template-columns: 21.875rem minmax(0, 1fr);
  gap: var(--gap);
}

.layout > .input-panel {
  align-self: stretch;
  min-height: 0;
}

.panel {
  position: relative;
  border-radius: 1.375rem;
  border: 0.0625rem solid rgba(255, 255, 255, 0.74);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(239, 247, 255, 0.64));
  backdrop-filter: blur(1.125rem);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  min-height: 0;
}

.panel::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(72, 163, 255, 0.08), transparent 20%, transparent 80%, rgba(123, 231, 255, 0.08)),
    linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.28), transparent);
}

.panel::after {
  content: "";
  position: absolute;
  left: 1.25rem;
  right: 1.25rem;
  top: 0;
  height: 0.1875rem;
  border-radius: 999rem;
  background: linear-gradient(
    90deg,
    rgba(47, 115, 255, 0.14),
    rgba(72, 163, 255, 0.72),
    rgba(123, 231, 255, 0.5),
    rgba(47, 115, 255, 0.12)
  );
}

.panel-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.125rem 1.125rem 0;
}

.panel-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.0125rem;
}

.panel-subtitle {
  color: var(--text-2);
  font-size: 0.6875rem;
  padding: 0.375rem 0.625rem;
  border-radius: 999rem;
  background: rgba(255, 255, 255, 0.56);
  border: 0.0625rem solid rgba(73, 128, 255, 0.08);
  text-transform: uppercase;
  letter-spacing: 0.04375rem;
}

.input-panel {
  padding-bottom: 0.875rem;
  min-height: 0;
  overflow: hidden;
  display: grid;
  /* 中间「指标结果」占据剩余高度并可滚动，避免整表被裁切 */
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  align-content: stretch;
  gap: 0;
}

.input-grid {
  position: relative;
  z-index: 1;
  padding: 0.75rem 1rem 0;
  display: grid;
  gap: 0.625rem;
  align-content: start;
}

.field {
  display: grid;
  gap: 0.4375rem;
}

.field label {
  font-size: 0.6875rem;
  font-weight: 800;
  color: #2a4f92;
  padding-left: 0.1875rem;
}

.field input {
  width: 100%;
  height: 2.625rem;
  border: 0.0625rem solid rgba(74, 129, 255, 0.13);
  border-radius: 0.9375rem;
  background: rgba(255, 255, 255, 0.84);
  color: var(--text-1);
  font-size: 0.875rem;
  padding: 0 0.875rem;
  outline: none;
  box-shadow: inset 0 0.0625rem 0 rgba(255, 255, 255, 0.7);
  transition: 0.2s ease;
}

.field input:focus {
  border-color: rgba(47, 115, 255, 0.34);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 0 0 0.25rem rgba(47, 115, 255, 0.07);
  transform: translateY(-0.0625rem);
}

.radio-group {
  display: grid;
  gap: 0.625rem;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.9375rem;
  border: 0.0625rem solid rgba(74, 129, 255, 0.13);
  background: rgba(255, 255, 255, 0.84);
  box-shadow: inset 0 0.0625rem 0 rgba(255, 255, 255, 0.7);
  cursor: pointer;
  user-select: none;
  transition: 0.2s ease;
}

.radio-item input[type='radio'] {
  width: 1.125rem;
  height: 1.125rem;
  accent-color: #2f73ff;
}

.radio-item:hover {
  border-color: rgba(47, 115, 255, 0.34);
  background: rgba(255, 255, 255, 0.96);
}

.metrics-panel {
  position: relative;
  z-index: 1;
  margin: 0.75rem 1rem 0;
  min-height: 0;
  border-radius: 1rem;
  border: 0.0625rem solid rgba(255, 255, 255, 0.66);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(240, 247, 255, 0.78));
  box-shadow: inset 0 0.0625rem 0 rgba(255, 255, 255, 0.55);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.metrics-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 0.75rem 0.5rem;
  border-bottom: 0.0625rem solid rgba(57, 124, 255, 0.1);
}

.metrics-header strong {
  font-size: 0.8125rem;
  font-weight: 800;
  color: #29508d;
}

.metrics-header span {
  font-size: 0.625rem;
  color: var(--text-2);
  letter-spacing: 0.0375rem;
  text-transform: uppercase;
}

.metrics-table-wrap {
  padding: 0.5rem 0.625rem 0.625rem;
  flex: 1;
  min-height: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.metrics-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 0.6875rem;
  color: var(--text-1);
}

.metrics-table th,
.metrics-table td {
  border: 0.0625rem solid rgba(57, 124, 255, 0.1);
  padding: 0.4375rem 0.375rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.46);
  line-height: 1.2;
  word-break: break-word;
}

.metrics-table thead th {
  background: rgba(111, 174, 255, 0.12);
  font-weight: 800;
  color: #214684;
}

.metrics-table .metric-name {
  text-align: left;
  padding-left: 0.5rem;
  width: 34%;
}

.metrics-empty {
  padding: 1.125rem 0.875rem;
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-2);
}

.loading-box {
  padding: 1.125rem 0.75rem 1.25rem;
  display: grid;
  gap: 0.75rem;
  justify-items: center;
  color: var(--text-2);
}

.loading-text {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05rem;
  color: #3f68a7;
}

.loading-bar {
  width: 100%;
  height: 0.625rem;
  border-radius: 999rem;
  background: rgba(73, 167, 255, 0.12);
  overflow: hidden;
  position: relative;
}

.loading-bar::before {
  content: "";
  position: absolute;
  inset: 0;
  width: 38%;
  border-radius: 999rem;
  background: linear-gradient(90deg, var(--blue-1), var(--blue-2), var(--blue-3));
  box-shadow: 0 0 0.875rem rgba(73, 167, 255, 0.24);
  animation: fakeLoading 1.2s ease-in-out infinite;
}

.loading-dots {
  font-size: 0.6875rem;
  letter-spacing: 0.125rem;
  color: #6888bb;
}

.actions {
  position: relative;
  z-index: 1;
  padding: 0.75rem 1rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
}

.btn {
  height: 2.625rem;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 800;
  transition: 0.2s ease;
}

.btn-primary {
  color: #fff;
  background: linear-gradient(135deg, var(--blue-1), var(--blue-2) 65%, var(--blue-3));
  box-shadow: 0 0.75rem 1.5rem rgba(47, 115, 255, 0.22);
}

.btn-secondary {
  color: #3766ad;
  background: rgba(255, 255, 255, 0.82);
  border: 0.0625rem solid rgba(74, 129, 255, 0.1);
}

.btn:hover {
  transform: translateY(-0.125rem);
}

.output-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  padding-bottom: 1rem;
}

.output-body {
  position: relative;
  z-index: 1;
  padding: 0.75rem 1rem 0;
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.section-head h3 {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 800;
}

.section-head span {
  color: var(--text-2);
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
}

/* 左侧大图 + 右侧 2×2 小图，避免方形格子撑满导致上下留白 */
.result-flex {
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0.75rem;
}

.result-main-col {
  flex: 1.15;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.result-side-col {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0.625rem;
  align-content: stretch;
}

#resultGrid {
  min-height: 0;
  height: 100%;
}

.result-card {
  position: relative;
  overflow: hidden;
  border-radius: 1.125rem;
  border: 0.0625rem solid rgba(255, 255, 255, 0.68);
  background: linear-gradient(180deg, rgba(248, 252, 255, 0.92), rgba(229, 242, 255, 0.84));
  box-shadow: 0 1rem 2rem rgba(67, 116, 212, 0.1);
  padding: 0.375rem 0.5rem 0.5rem;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.result-card::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), transparent 24%, transparent 72%, rgba(99, 179, 255, 0.08)),
    radial-gradient(circle at top right, rgba(123, 231, 255, 0.24), transparent 26%);
}

.result-main-col .result-card {
  flex: 1;
  min-height: 0;
}

.result-caption {
  flex-shrink: 0;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--text-1);
  line-height: 1.25;
  letter-spacing: 0.0125rem;
  padding: 0 0.125rem;
}

.result-card.small .result-video-wrap {
  aspect-ratio: auto;
  height: 100%;
  flex: 1 1 auto;
  max-height: none;
}

.result-video-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1 1 auto;
  border-radius: 0.875rem;
  overflow: hidden;
  background: radial-gradient(circle at 50% 16%, rgba(123, 231, 255, 0.44), transparent 24%),
    linear-gradient(135deg, #ddf0ff, #b7dbff 58%, #96c9ff);
  box-shadow: inset 0 0 0 0.0625rem rgba(255, 255, 255, 0.28);
}

.result-video-wrap::before {
  content: "";
  position: absolute;
  inset: 0.625rem;
  border-radius: 0.75rem;
  border: 0.0625rem solid rgba(255, 255, 255, 0.34);
  pointer-events: none;
  z-index: 2;
}

.result-video-wrap::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.08) 0,
    rgba(255, 255, 255, 0.08) 0.0625rem,
    transparent 0.1875rem,
    transparent 0.375rem
  );
  opacity: 0.18;
  mix-blend-mode: soft-light;
}

.result-video-wrap .hud {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}

.result-video-wrap .hud::before,
.result-video-wrap .hud::after {
  content: "";
  position: absolute;
  width: 1.75rem;
  height: 1.75rem;
  border-color: rgba(255, 255, 255, 0.72);
  border-style: solid;
  filter: drop-shadow(0 0 0.5rem rgba(72, 163, 255, 0.24));
}

.result-video-wrap .hud::before {
  top: 0.875rem;
  left: 0.875rem;
  border-width: 0.1875rem 0 0 0.1875rem;
  border-top-left-radius: 0.625rem;
}

.result-video-wrap .hud::after {
  right: 0.875rem;
  bottom: 0.875rem;
  border-width: 0 0.1875rem 0.1875rem 0;
  border-bottom-right-radius: 0.625rem;
}

.auto-video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  padding: 0.375rem;
  background: transparent;
}

.result-card.large .auto-video {
  padding: 0.625rem;
}

.floating-orb {
  position: absolute;
  border-radius: 999rem;
  filter: blur(0.625rem);
  pointer-events: none;
  opacity: 0.6;
}

.orb-1 {
  width: 8.75rem;
  height: 8.75rem;
  background: rgba(72, 163, 255, 0.22);
  top: -2.25rem;
  right: 6.25rem;
}

.orb-2 {
  width: 6.25rem;
  height: 6.25rem;
  background: rgba(123, 231, 255, 0.18);
  bottom: 2rem;
  left: -1.125rem;
}

.full-image-page {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.75rem 1.5rem;
  overflow: auto;
}

.full-image-page img {
  max-width: min(87.5rem, 100%);
  width: auto;
  height: auto;
  max-height: calc(100vh - 7.5rem);
  object-fit: contain;
  border-radius: 0.75rem;
  box-shadow: var(--shadow-md);
}

.chart-page {
  flex: 1;
  min-height: 0;
  display: flex;
  padding: 1rem 0.75rem 1.5rem;
  overflow: auto;
}

.chart-grid {
  width: 100%;
  height: auto;
  min-height: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  align-content: stretch;
}

.chart-card {
  min-height: 0;
  border-radius: 1.125rem;
  border: 0.0625rem solid rgba(255, 255, 255, 0.68);
  background: linear-gradient(180deg, rgba(248, 252, 255, 0.92), rgba(229, 242, 255, 0.84));
  box-shadow: 0 1rem 2rem rgba(67, 116, 212, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chart-card-title {
  flex-shrink: 0;
  padding: 0.625rem 0.75rem 0.375rem;
  font-size: 0.75rem;
  font-weight: 900;
  color: rgba(19, 53, 111, 0.92);
  letter-spacing: 0.0125rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.55);
  border-bottom: 0.0625rem solid rgba(73, 167, 255, 0.18);
}

.chart-canvas {
  flex: 1;
  min-height: min(22.5rem, 42vh);
}

@keyframes shine {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(120%);
  }
}

@keyframes fakeLoading {
  0% {
    transform: translateX(-120%);
  }
  50% {
    transform: translateX(90%);
  }
  100% {
    transform: translateX(220%);
  }
}

@media (max-width: 64rem) {
  html,
  body {
    overflow: auto;
  }
  .page {
    height: auto;
    min-height: calc(100vh - 1.5rem);
    grid-template-rows: auto auto;
  }
  .layout {
    grid-template-columns: 1fr;
  }
  .output-body {
    grid-template-rows: auto auto;
  }
  .result-flex {
    flex-direction: column;
    height: auto;
  }
  .result-main-col .result-card {
    min-height: min(13.75rem, 36vh);
  }
}

@media (max-width: 40rem) {
  .page {
    width: min(100%, calc(100vw - 1rem));
    margin: 0.5rem auto;
  }
  .hero {
    padding: 1rem 1.125rem;
  }
  .hero-text h1 {
    font-size: 1.125rem;
  }
  .hero-text p,
  .hero-badge,
  .panel-subtitle,
  .section-head span {
    display: none;
  }
  .layout {
    gap: 0.625rem;
  }
  .result-flex {
    gap: 0.625rem;
  }
}
</style>
