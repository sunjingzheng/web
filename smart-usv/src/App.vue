<script setup>
import { onMounted, ref } from 'vue'
import ChartsOverviewGrid from './components/charts/ChartsOverviewGrid.vue'

const view = ref('chart')

const curtainClass = ref('')
let curtainTimer = null

// 从图片中读取的真实数据
const metricsTemplate = {
  A1: [
    ['RMS', '0.2981', '0.1921', '35.55%'],
    ['后20s的RMS', '0.5137', '0.0464', '90.97%'],
    ['收敛时间', '4.75', '4.77', '不变'],
    ['τ_u RMS', '54.8411', '54.5845', '不变'],
    ['τ_r RMS', '21.9155', '21.6048', '不变'],
  ],
  A2: [
    ['RMS', '0.2614', '0.1919', '26.58%'],
    ['后20s的RMS', '0.3829', '0.0330', '91.39%'],
    ['收敛时间', '4.82', '4.84', '不变'],
    ['τ_u RMS', '54.6987', '54.4918', '不变'],
    ['τ_r RMS', '21.6852', '21.4406', '不变'],
  ],
  B1: [
    ['RMS', '0.2612', '0.1919', '26.54%'],
    ['后20s的RMS', '0.3824', '0.0325', '91.49%'],
    ['收敛时间', '4.83', '4.84', '不变'],
    ['τ_u RMS', '54.7101', '54.5036', '不变'],
    ['τ_r RMS', '21.7668', '21.5257', '不变'],
  ],
  B2: [
    ['RMS', '0.3169', '0.2412', '23.88%'],
    ['后20s的RMS', '0.4746', '0.1748', '63.17%'],
    ['收敛时间', '4.79', '4.81', '不变'],
    ['τ_u RMS', '54.7282', '54.4880', '不变'],
    ['τ_r RMS', '21.7878', '21.5149', '不变'],
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

// 输入逻辑：1.5 → A1，0.7 → A2，空 → B1/B2
function getScenarioFromInputs(inputs) {
  const val = (inputs.input1 || '').trim()
  if (val === '1.5') return 'A1'
  if (val === '0.7') return 'A2'
  if (val) return 'A1' // 其他非空值默认 A1
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
  const smallFrames = SUB_PANEL_ORDER.map((subIndex, i) =>
    renderResultFrame(output.subs[subIndex], SUB_PANEL_LABELS[i], false),
  )

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
    document.getElementById('metricsContent').innerHTML =
      '<div class="metrics-empty">当前参数暂无指标数据</div>'
    return
  }

  const rows = metrics
    .map(
      (row) => `
      <tr>
        <td class="metric-name">${row[0]}</td>
        <td>${row[1]}</td>
        <td>${row[2]}</td>
        <td class="metric-improve ${row[3] !== '不变' ? 'improve-good' : ''}">${row[3]}</td>
      </tr>
    `,
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

function updateBScenarioVisibility() {
  const val = (document.getElementById('input1')?.value || '').trim()
  const bGroup = document.getElementById('bScenarioGroup')
  if (bGroup) {
    bGroup.style.opacity = val ? '0.38' : '1'
    bGroup.style.pointerEvents = val ? 'none' : 'auto'
  }
}

function fillInputs() {
  const inputs = groupData[currentGroup].inputs
  document.getElementById('input1').value = inputs.input1

  const isB1 = (inputs.bScenario || 'B1') === 'B1'
  const b1Radio = document.getElementById('radioB1')
  const b2Radio = document.getElementById('radioB2')
  if (b1Radio) b1Radio.checked = isB1
  if (b2Radio) b2Radio.checked = !isB1

  updateBScenarioVisibility()
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
  document.getElementById('metricsContent').innerHTML =
    '<div class="metrics-empty">等待预测结果...</div>'
}

function initPage() {
  fillInputs()
  document.getElementById('resultGrid').innerHTML = ''
  document.getElementById('metricsTitle').textContent = groupData[currentGroup].activeScenario
  document.getElementById('metricsContent').innerHTML =
    '<div class="metrics-empty">等待预测结果...</div>'

  // 监听 input1 变化以切换 B 场景的可用状态
  const inp = document.getElementById('input1')
  if (inp) inp.addEventListener('input', updateBScenarioVisibility)
}

function setView(next) {
  if (view.value === next || curtainClass.value) return
  clearTimeout(curtainTimer)
  curtainClass.value = 'cv-in'
  curtainTimer = setTimeout(() => {
    view.value = next
    document.body.style.overflow = next === 'demo' ? 'hidden' : 'auto'
    curtainClass.value = 'cv-out'
    curtainTimer = setTimeout(() => {
      curtainClass.value = ''
    }, 480)
  }, 480)
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
        <section class="demo-topbar">
          <div class="dtb-l">
            <div class="dtb-icon"></div>
            <span class="dtb-title">无人艇轨迹跟踪<em class="dtb-sep">·</em>演示控制台</span>
            <span class="dtb-live"><span class="dtb-pip"></span>LIVE</span>
          </div>
          <div class="dtb-r">
            <button
              type="button"
              class="nav-item"
              :class="{ active: view === 'demo' }"
              @click="setView('demo')"
            >
              轨迹跟踪演示
            </button>
            <button
              type="button"
              class="nav-item"
              :class="{ active: view === 'chart' }"
              @click="setView('chart')"
            >
              结果总览
            </button>
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
                <label for="input1"
                  >扰动频率参数
                  <span class="field-hint">1.5 → A1 &nbsp;|&nbsp; 0.7 → A2</span></label
                >
                <input id="input1" type="text" placeholder="输入 1.5 或 0.7" />
              </div>
              <div class="field" id="bScenarioGroup">
                <label>B 场景选择 <span class="field-hint">输入为空时生效</span></label>
                <div class="radio-group" role="radiogroup" aria-label="B 场景选择">
                  <label class="radio-item">
                    <input id="radioB1" type="radio" name="bScenario" value="B1" checked />
                    <span>B1 &nbsp;参数不确定</span>
                  </label>
                  <label class="radio-item">
                    <input id="radioB2" type="radio" name="bScenario" value="B2" />
                    <span>B2 &nbsp;噪声 + 不确定</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="metrics-panel" id="metricsPanel">
              <div class="metrics-header">
                <strong>指标结果</strong>
                <span id="metricsTitle" class="metrics-badge">A1</span>
              </div>
              <div class="metrics-table-wrap" id="metricsContent"></div>
            </div>

            <div class="actions">
              <button class="btn btn-primary" type="button" @click="runPrediction">
                <span class="btn-icon">▶</span>开始预测
              </button>
              <button class="btn btn-secondary" type="button" @click="resetForm">重置</button>
            </div>
          </aside>

          <main class="panel output-panel">
            <div class="panel-header">
              <h2 class="panel-title">结果展示</h2>
              <span class="panel-subtitle">可视化输出</span>
            </div>

            <div class="output-body">
              <div id="resultGrid"></div>
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

    <!-- 页面切换幕帘 -->
    <div class="view-curtain" :class="curtainClass" aria-hidden="true">
      <div class="vc-body">
        <div class="vc-icon"></div>
        <span class="vc-text">USV · 轨迹跟踪</span>
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
  --header-h: 3.375rem;
}

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
  font-family: Inter, 'Microsoft YaHei', PingFang SC, system-ui, sans-serif;
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
  content: '';
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

/* ── Demo 顶栏 ── */
.demo-topbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  border-radius: 1.125rem;
  background: linear-gradient(
    125deg,
    rgba(8, 18, 55, 0.96) 0%,
    rgba(14, 38, 116, 0.93) 50%,
    rgba(20, 54, 160, 0.88) 100%
  );
  border: 0.0625rem solid rgba(47, 115, 255, 0.32);
  box-shadow: 0 0.5rem 1.75rem rgba(8, 18, 55, 0.28),
    inset 0 0.0625rem 0 rgba(73, 167, 255, 0.22);
  backdrop-filter: blur(1rem);
  overflow: hidden;
}

.demo-topbar::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    96deg,
    transparent 20%,
    rgba(255, 255, 255, 0.04) 48%,
    transparent 66%
  );
  transform: translateX(-120%);
  animation: shine 6s linear infinite;
  pointer-events: none;
}

.demo-topbar::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 0.125rem;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(47, 115, 255, 0.7) 20%,
    rgba(73, 167, 255, 1) 50%,
    rgba(125, 230, 255, 0.9) 70%,
    transparent
  );
  animation: topbar-glow 3s ease-in-out infinite;
}

@keyframes topbar-glow {
  0%,
  100% {
    opacity: 0.65;
  }
  50% {
    opacity: 1;
  }
}

.dtb-l {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.dtb-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5625rem;
  background: linear-gradient(135deg, var(--blue-1), var(--blue-2) 60%, var(--blue-3));
  box-shadow: 0 0.25rem 0.875rem rgba(47, 115, 255, 0.5);
  position: relative;
  flex-shrink: 0;
}

.dtb-icon::before,
.dtb-icon::after {
  content: '';
  position: absolute;
  border-radius: 999rem;
  background: rgba(255, 255, 255, 0.9);
}

.dtb-icon::before {
  width: 1rem;
  height: 0.15rem;
  left: 0.5rem;
  top: 0.9375rem;
  transform: rotate(-24deg);
}

.dtb-icon::after {
  width: 0.75rem;
  height: 0.15rem;
  left: 0.65rem;
  top: 0.625rem;
  box-shadow: -0.3125rem 0.5rem 0 rgba(255, 255, 255, 0.9);
}

.dtb-title {
  font-size: 0.875rem;
  font-weight: 900;
  color: rgba(210, 228, 255, 0.96);
  letter-spacing: 0.01rem;
  white-space: nowrap;
}

.dtb-sep {
  font-style: normal;
  margin: 0 0.375rem;
  opacity: 0.5;
}

.dtb-live {
  display: flex;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.1875rem 0.5625rem;
  border-radius: 999rem;
  background: rgba(47, 115, 255, 0.18);
  border: 0.0625rem solid rgba(73, 167, 255, 0.28);
  font-size: 0.625rem;
  font-weight: 900;
  color: rgba(125, 230, 255, 0.95);
  letter-spacing: 0.06rem;
}

.dtb-pip {
  width: 0.4375rem;
  height: 0.4375rem;
  border-radius: 999rem;
  background: #7de6ff;
  box-shadow: 0 0 0.3125rem rgba(125, 230, 255, 0.85);
  animation: pip-pulse 1.8s ease-in-out infinite;
}

@keyframes pip-pulse {
  0%,
  100% {
    box-shadow: 0 0 0.25rem rgba(125, 230, 255, 0.7);
  }
  50% {
    box-shadow: 0 0 0.75rem rgba(125, 230, 255, 1), 0 0 1.375rem rgba(125, 230, 255, 0.38);
  }
}

.dtb-r {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.demo-topbar .nav-item {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(73, 167, 255, 0.22);
  color: rgba(175, 210, 255, 0.85);
}

.demo-topbar .nav-item:hover {
  background: rgba(255, 255, 255, 0.13);
  border-color: rgba(73, 167, 255, 0.45);
  color: #fff;
}

.demo-topbar .nav-item.active {
  background: linear-gradient(135deg, rgba(47, 115, 255, 0.88), rgba(73, 167, 255, 0.82));
  border-color: transparent;
  color: #fff;
  box-shadow: 0 0.25rem 0.875rem rgba(47, 115, 255, 0.45);
}

.layout {
  min-height: 0;
  display: grid;
  grid-template-columns: 22rem minmax(0, 1fr);
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
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
      180deg,
      rgba(72, 163, 255, 0.08),
      transparent 20%,
      transparent 80%,
      rgba(123, 231, 255, 0.08)
    ),
    linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.28), transparent);
}

.panel::after {
  content: '';
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
  padding: 1rem 1.125rem 0;
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
  gap: 0.375rem;
}

.field label {
  font-size: 0.6875rem;
  font-weight: 800;
  color: #2a4f92;
  padding-left: 0.1875rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.field-hint {
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--text-2);
  opacity: 0.75;
  letter-spacing: 0;
}

.field input {
  width: 100%;
  height: 2.5rem;
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
  gap: 0.5rem;
  transition: opacity 0.3s ease, pointer-events 0.3s ease;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
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
  padding: 0.5rem 0.75rem 0.4rem;
  border-bottom: 0.0625rem solid rgba(57, 124, 255, 0.1);
}

.metrics-header strong {
  font-size: 0.8125rem;
  font-weight: 800;
  color: #29508d;
}

.metrics-badge {
  font-size: 0.625rem;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(135deg, var(--blue-1), var(--blue-2));
  padding: 0.2rem 0.625rem;
  border-radius: 999rem;
  letter-spacing: 0.04rem;
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

.metric-improve.improve-good {
  color: #0d7a3e;
  font-weight: 800;
  background: rgba(16, 185, 129, 0.08);
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
  height: 0.5rem;
  border-radius: 999rem;
  background: rgba(73, 167, 255, 0.12);
  overflow: hidden;
  position: relative;
}

.loading-bar::before {
  content: '';
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
  height: 2.5rem;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 800;
  transition: 0.22s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.btn-icon {
  font-size: 0.75rem;
  opacity: 0.85;
}

.btn-primary {
  color: #fff;
  background: linear-gradient(135deg, var(--blue-1), var(--blue-2) 65%, var(--blue-3));
  box-shadow: 0 0.5rem 1.25rem rgba(47, 115, 255, 0.28);
}

.btn-primary:hover {
  transform: translateY(-0.125rem);
  box-shadow: 0 0.75rem 1.75rem rgba(47, 115, 255, 0.38);
}

.btn-secondary {
  color: #3766ad;
  background: rgba(255, 255, 255, 0.82);
  border: 0.0625rem solid rgba(74, 129, 255, 0.1);
}

.btn-secondary:hover {
  transform: translateY(-0.125rem);
  background: rgba(255, 255, 255, 0.96);
  border-color: rgba(47, 115, 255, 0.22);
}

/* ── Output Panel ── */
.output-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  padding-bottom: 0.875rem;
}

.output-body {
  position: relative;
  z-index: 1;
  padding: 0.625rem 0.875rem 0;
  min-height: 0;
  height: 100%;
}

/* ── Result Grid ── */
#resultGrid {
  min-height: 0;
  height: 100%;
}

/* 左侧大图 + 右侧 2×2 小图，完全撑满容器 */
.result-flex {
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0.625rem;
}

.result-main-col {
  flex: 1.2;
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
  gap: 0.5rem;
  align-content: stretch;
}

.result-card {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  border: 0.0625rem solid rgba(255, 255, 255, 0.68);
  background: linear-gradient(180deg, rgba(248, 252, 255, 0.92), rgba(229, 242, 255, 0.84));
  box-shadow: 0 0.5rem 1.5rem rgba(67, 116, 212, 0.1);
  padding: 0.3rem 0.4rem 0.4rem;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.result-card::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.2),
      transparent 24%,
      transparent 72%,
      rgba(99, 179, 255, 0.08)
    ),
    radial-gradient(circle at top right, rgba(123, 231, 255, 0.24), transparent 26%);
}

.result-main-col .result-card {
  flex: 1;
  min-height: 0;
}

/* 鼠标悬停放大效果 */
.result-card:hover {
  box-shadow: 0 1.25rem 3rem rgba(47, 115, 255, 0.2);
  transform: scale(1.018);
  z-index: 10;
}

.result-caption {
  flex-shrink: 0;
  text-align: center;
  font-size: 0.6875rem;
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
  border-radius: 0.75rem;
  overflow: hidden;
  background: radial-gradient(circle at 50% 16%, rgba(123, 231, 255, 0.44), transparent 24%),
    linear-gradient(135deg, #ddf0ff, #b7dbff 58%, #96c9ff);
  box-shadow: inset 0 0 0 0.0625rem rgba(255, 255, 255, 0.28);
}

.result-video-wrap::before {
  content: '';
  position: absolute;
  inset: 0.5rem;
  border-radius: 0.625rem;
  border: 0.0625rem solid rgba(255, 255, 255, 0.34);
  pointer-events: none;
  z-index: 2;
}

.result-video-wrap::after {
  content: '';
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
  content: '';
  position: absolute;
  width: 1.5rem;
  height: 1.5rem;
  border-color: rgba(255, 255, 255, 0.72);
  border-style: solid;
  filter: drop-shadow(0 0 0.5rem rgba(72, 163, 255, 0.24));
}

.result-video-wrap .hud::before {
  top: 0.625rem;
  left: 0.625rem;
  border-width: 0.15rem 0 0 0.15rem;
  border-top-left-radius: 0.5rem;
}

.result-video-wrap .hud::after {
  right: 0.625rem;
  bottom: 0.625rem;
  border-width: 0 0.15rem 0.15rem 0;
  border-bottom-right-radius: 0.5rem;
}

.auto-video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  padding: 0.3rem;
  background: transparent;
}

.result-card.large .auto-video {
  padding: 0.5rem;
}

.floating-orb {
  position: absolute;
  border-radius: 999rem;
  filter: blur(0.625rem);
  pointer-events: none;
  opacity: 0.6;
}

.orb-2 {
  width: 6.25rem;
  height: 6.25rem;
  background: rgba(123, 231, 255, 0.18);
  bottom: 2rem;
  left: -1.125rem;
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

/* ── 幕帘过渡 ── */
.view-curtain {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(130deg, #06123a 0%, #122680 38%, #2f73ff 72%, #49a7ff 100%);
  transform: translateX(100%);
  will-change: transform;
}

.view-curtain::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    -30deg,
    transparent,
    transparent 3.5rem,
    rgba(255, 255, 255, 0.025) 3.5rem,
    rgba(255, 255, 255, 0.025) 3.5625rem
  );
  pointer-events: none;
}

.view-curtain.cv-in {
  animation: vc-in 0.48s cubic-bezier(0.77, 0, 0.175, 1) forwards;
}
.view-curtain.cv-out {
  animation: vc-out 0.48s cubic-bezier(0.77, 0, 0.175, 1) forwards;
}

@keyframes vc-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0%);
  }
}

@keyframes vc-out {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-100%);
  }
}

.vc-body {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  opacity: 0;
  animation: vc-body-fade 0.96s ease forwards;
}

@keyframes vc-body-fade {
  0% {
    opacity: 0;
    transform: scale(0.92);
  }
  30% {
    opacity: 1;
    transform: scale(1);
  }
  72% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.05);
  }
}

.vc-icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.875rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.07));
  border: 0.0625rem solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.24), inset 0 0.0625rem 0 rgba(255, 255, 255, 0.24);
  position: relative;
  flex-shrink: 0;
}

.vc-icon::before,
.vc-icon::after {
  content: '';
  position: absolute;
  border-radius: 999rem;
  background: rgba(255, 255, 255, 0.88);
}

.vc-icon::before {
  width: 1.25rem;
  height: 0.1875rem;
  left: 0.75rem;
  top: 1.375rem;
  transform: rotate(-24deg);
}

.vc-icon::after {
  width: 0.9375rem;
  height: 0.1875rem;
  left: 0.9375rem;
  top: 0.9375rem;
  box-shadow: -0.4375rem 0.625rem 0 rgba(255, 255, 255, 0.88);
}

.vc-text {
  font-size: 1.375rem;
  font-weight: 950;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: 0.1rem;
  white-space: nowrap;
}

/* ── 结果区空状态 ── */
#resultGrid:empty {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.875rem;
  min-height: 10rem;
}

#resultGrid:empty::before {
  content: '';
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 999rem;
  border: 0.1875rem solid rgba(47, 115, 255, 0.14);
  border-top-color: rgba(47, 115, 255, 0.62);
  box-shadow: 0 0 0 0.625rem rgba(47, 115, 255, 0.05), 0 0 0 1.25rem rgba(47, 115, 255, 0.025);
  animation: radar-ring 2.2s ease-in-out infinite;
}

#resultGrid:empty::after {
  content: '等待预测结果';
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(88, 120, 173, 0.48);
  letter-spacing: 0.1rem;
}

@keyframes radar-ring {
  0%,
  100% {
    transform: scale(0.95);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
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
  .demo-topbar {
    padding: 0 0.875rem;
  }
  .dtb-title {
    font-size: 0.75rem;
  }
  .dtb-live {
    display: none;
  }
  .panel-subtitle {
    display: none;
  }
  .layout {
    gap: 0.625rem;
  }
  .result-flex {
    gap: 0.5rem;
  }
}
</style>
