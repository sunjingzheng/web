<script setup>
import { onMounted, ref } from "vue";
import ChartsOverviewGrid from "./components/charts/ChartsOverviewGrid.vue";

const view = ref("home");
const inputOpen = ref(true);

const curtainClass = ref("");
let curtainTimer = null;

// 从图片中读取的真实数据
const metricsTemplate = {
  A1: [
    ["RMS", "0.2981", "0.1921", "35.55%"],
    ["后20s的RMS", "0.5137", "0.0464", "90.97%"],
    ["收敛时间", "4.75", "4.77", "基本不变"],
    ["τ_u RMS", "54.8411", "54.5845", "基本不变"],
    ["τ_r RMS", "21.9155", "21.6048", "基本不变"],
  ],
  A2: [
    ["RMS", "0.2614", "0.1919", "26.58%"],
    ["后20s的RMS", "0.3829", "0.0330", "91.39%"],
    ["收敛时间", "4.82", "4.84", "基本不变"],
    ["τ_u RMS", "54.6987", "54.4918", "基本不变"],
    ["τ_r RMS", "21.6852", "21.4406", "基本不变"],
  ],
  B1: [
    ["RMS", "0.2612", "0.1919", "26.54%"],
    ["后20s的RMS", "0.3824", "0.0325", "91.49%"],
    ["收敛时间", "4.83", "4.84", "基本不变"],
    ["τ_u RMS", "54.7101", "54.5036", "基本不变"],
    ["τ_r RMS", "21.7668", "21.5257", "基本不变"],
  ],
  B2: [
    ["RMS", "0.3169", "0.2412", "23.88%"],
    ["后20s的RMS", "0.4746", "0.1748", "63.17%"],
    ["收敛时间", "4.79", "4.81", "基本不变"],
    ["τ_u RMS", "54.7282", "54.4880", "基本不变"],
    ["τ_r RMS", "21.7878", "21.5149", "基本不变"],
  ],
};

function generateRandomMetrics() {
  const rmsBase = +(0.26 + Math.random() * 0.06).toFixed(4);
  const rmsImproveRate = 0.20 + Math.random() * 0.16;
  const rmsCnn = +(rmsBase * (1 - rmsImproveRate)).toFixed(4);
  const rmsImprove = (rmsImproveRate * 100).toFixed(2) + "%";

  const rms20Base = +(0.38 + Math.random() * 0.14).toFixed(4);
  const rms20ImproveRate = 0.60 + Math.random() * 0.32;
  const rms20Cnn = +(rms20Base * (1 - rms20ImproveRate)).toFixed(4);
  const rms20Improve = (rms20ImproveRate * 100).toFixed(2) + "%";

  const convBase = +(4.75 + Math.random() * 0.08).toFixed(2);
  const convCnn = +(convBase + (Math.random() * 0.04 - 0.02)).toFixed(2);

  const tauUBase = +(54.49 + Math.random() * 0.35).toFixed(4);
  const tauUCnn = +(tauUBase - Math.random() * 0.3).toFixed(4);

  const tauRBase = +(21.44 + Math.random() * 0.48).toFixed(4);
  const tauRCnn = +(tauRBase - Math.random() * 0.3).toFixed(4);

  return [
    ["RMS", String(rmsBase), String(rmsCnn), rmsImprove],
    ["后20s的RMS", String(rms20Base), String(rms20Cnn), rms20Improve],
    ["收敛时间", String(convBase), String(convCnn), "基本不变"],
    ["τ_u RMS", String(tauUBase), String(tauUCnn), "基本不变"],
    ["τ_r RMS", String(tauRBase), String(tauRCnn), "基本不变"],
  ];
}

const scenarioVideoMap = {
  A1: {
    main: "/main/USV_A1.mp4",
    subs: [
      "/other/tau_r_A1.mp4",
      "/other/tau_u_A1.mp4",
      "/other/x_error_A1.mp4",
      "/other/y_error_A1.mp4",
    ],
  },
  A2: {
    main: "/main/USV_A2.mp4",
    subs: [
      "/other/tau_r_A2.mp4",
      "/other/tau_u_A2.mp4",
      "/other/x_error_A2.mp4",
      "/other/y_error_A2.mp4",
    ],
  },
  B1: {
    main: "/main/USV_B1.mp4",
    subs: [
      "/other/tau_r_B1.mp4",
      "/other/tau_u_B1.mp4",
      "/other/x_error_B1.mp4",
      "/other/y_error_B1.mp4",
    ],
  },
  B2: {
    main: "/main/USV_B2.mp4",
    subs: [
      "/other/tau_r_B2.mp4",
      "/other/tau_u_B2.mp4",
      "/other/x_error_B2.mp4",
      "/other/y_error_B2.mp4",
    ],
  },
};

let currentGroup = 0;
let fakePredictionTimer = null;

const groupData = [1, 2, 3, 4, 5].map((n) => ({
  id: n,
  inputs: { input1: "", bScenario: "B1" },
  activeScenario: "B1",
  outputs: JSON.parse(JSON.stringify(scenarioVideoMap)),
  metrics: JSON.parse(JSON.stringify(metricsTemplate)),
  customMetrics: null,
  customLabel: "",
}));

// 输入逻辑：0 → Main，1.5 → A1，0.7 → A2，空 → B1/B2
function getScenarioFromInputs(inputs) {
  const val = (inputs.input1 || "").trim();
  if (val === "1.5") return "A1";
  if (val === "0.7") return "A2";
  if (val) return "B1"; // 其他非空值 → 自定义场景，使用 B1 视频
  return (inputs.bScenario || "B1").toString();
}

function isCustomScenario(inputs) {
  const val = (inputs.input1 || "").trim();
  return val !== "" && val !== "1.5" && val !== "0.7";
}

function renderVideo(src) {
  return `
    <video class="auto-video" muted loop playsinline preload="auto"
           disablepictureinpicture controlslist="nodownload noplaybackrate nofullscreen noremoteplayback">
      <source src="${src}" type="video/mp4" />
    </video>
  `;
}

// subs 索引：0=tau_r, 1=tau_u, 2=x_error, 3=y_error；展示顺序：X、Y、tau-u、tau-r
const SUB_PANEL_ORDER = [2, 3, 1, 0];
const SUB_PANEL_LABELS = ["X 误差对比", "Y 误差对比", "τ_u 对比", "τ_r 对比"];

function renderResultFrame(src, caption, isLarge = false) {
  const sizeClass = isLarge ? "large" : "small";
  return `
    <div class="result-card ${sizeClass}">
      <div class="result-video-wrap">
        <div class="hud"></div>
        ${renderVideo(src)}
      </div>
      <div class="result-caption">${caption}</div>
    </div>
  `;
}

const RESULT_SWAP_CLASSES = ["swap-2", "swap-3", "swap-4", "swap-5"];

function clearResultSwapClasses(flex) {
  RESULT_SWAP_CLASSES.forEach((c) => flex.classList.remove(c));
}

/** 互换布局不能用纯 CSS :hover：元素移动后指针会离开节点导致抖动，改为在 result-flex 上挂类 */
function attachResultSwapInteraction() {
  const flex = document.querySelector(".result-flex");
  if (!flex) return;

  const onLeave = () => clearResultSwapClasses(flex);
  flex.addEventListener("mouseleave", onLeave);

  flex.querySelectorAll(".result-card.small").forEach((card, i) => {
    const n = i + 2;
    card.addEventListener("mouseenter", () => {
      clearResultSwapClasses(flex);
      flex.classList.add(`swap-${n}`);
    });
  });
}

function syncAndPlayVideos() {
  const videos = Array.from(document.querySelectorAll(".auto-video"));
  videos.forEach((video) => {
    try {
      video.pause();
      video.currentTime = 0;
    } catch (e) {}
    video.defaultMuted = true;
    video.muted = true;
  });

  requestAnimationFrame(() => {
    videos.forEach((video) => {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function")
        playPromise.catch(() => {});
    });
  });
}

function renderOutputs(scenario) {
  const output = groupData[currentGroup].outputs[scenario];
  const mainFrame = renderResultFrame(output.main, "轨迹对比", true);
  const smallFrames = SUB_PANEL_ORDER.map((subIndex, i) =>
    renderResultFrame(output.subs[subIndex], SUB_PANEL_LABELS[i], false),
  );

  document.getElementById("resultGrid").innerHTML = `
    <div class="result-flex">
      <div class="result-main-col">${mainFrame}</div>
      ${smallFrames.join("")}
    </div>
  `;

  syncAndPlayVideos();
  attachResultSwapInteraction();
}

function renderMetricsTable(type = "A1", customData = null) {
  const metrics = customData || groupData[currentGroup].metrics[type] || [];
  document.getElementById("metricsTitle").textContent = type;

  if (!metrics.length) {
    document.getElementById("metricsContent").innerHTML =
      '<div class="metrics-empty">当前参数暂无指标数据</div>';
    return;
  }

  const rows = metrics
    .map(
      (row) => `
      <tr>
        <td class="metric-name">${row[0]}</td>
        <td>${row[1]}</td>
        <td>${row[2]}</td>
        <td class="metric-improve ${row[3] !== "基本不变" ? "improve-good" : ""}">${row[3]}</td>
      </tr>
    `,
    )
    .join("");

  document.getElementById("metricsContent").innerHTML = `
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
  `;
}

function renderLoadingState(type = "A1") {
  document.getElementById("metricsTitle").textContent = type;
  document.getElementById("metricsContent").innerHTML = `
    <div class="loading-box">
      <div class="loading-text">结果计算中...</div>
      <div class="loading-bar"></div>
      <div class="loading-dots">加载中</div>
    </div>
  `;
}

function updateBScenarioVisibility() {
  const val = (document.getElementById("input1")?.value || "").trim();
  const bGroup = document.getElementById("bScenarioGroup");
  if (bGroup) {
    bGroup.style.opacity = val ? "0.38" : "1";
    bGroup.style.pointerEvents = val ? "none" : "auto";
  }
}

function fillInputs() {
  const inputs = groupData[currentGroup].inputs;
  document.getElementById("input1").value = inputs.input1;

  const isB1 = (inputs.bScenario || "B1") === "B1";
  const b1Radio = document.getElementById("radioB1");
  const b2Radio = document.getElementById("radioB2");
  if (b1Radio) b1Radio.checked = isB1;
  if (b2Radio) b2Radio.checked = !isB1;

  updateBScenarioVisibility();
}

function saveInputs() {
  groupData[currentGroup].inputs = {
    input1: document.getElementById("input1").value,
    bScenario: document.getElementById("radioB1")?.checked ? "B1" : "B2",
  };
  groupData[currentGroup].activeScenario = getScenarioFromInputs(
    groupData[currentGroup].inputs,
  );
}

function runPrediction() {
  saveInputs();
  const scenario = groupData[currentGroup].activeScenario;
  const custom = isCustomScenario(groupData[currentGroup].inputs);

  clearTimeout(fakePredictionTimer);
  const label = custom
    ? (groupData[currentGroup].inputs.input1 || "").trim()
    : scenario;
  renderLoadingState(label);

  fakePredictionTimer = setTimeout(() => {
    renderOutputs(scenario);
    if (custom) {
      const data = generateRandomMetrics();
      groupData[currentGroup].customMetrics = data;
      groupData[currentGroup].customLabel = label;
      renderMetricsTable(label, data);
    } else {
      groupData[currentGroup].customMetrics = null;
      groupData[currentGroup].customLabel = "";
      renderMetricsTable(scenario);
    }
  }, 1200);
}

function resetForm() {
  clearTimeout(fakePredictionTimer);
  groupData[currentGroup].inputs = { input1: "", bScenario: "B1" };
  groupData[currentGroup].activeScenario = getScenarioFromInputs(
    groupData[currentGroup].inputs,
  );
  groupData[currentGroup].customMetrics = null;
  groupData[currentGroup].customLabel = "";
  fillInputs();

  document.getElementById("resultGrid").innerHTML = "";
  document.getElementById("metricsTitle").textContent =
    groupData[currentGroup].activeScenario;
  document.getElementById("metricsContent").innerHTML =
    '<div class="metrics-empty">等待预测结果...</div>';
}

function initPage() {
  groupData[currentGroup].customMetrics = null;
  groupData[currentGroup].customLabel = "";
  fillInputs();
  document.getElementById("resultGrid").innerHTML = "";
  document.getElementById("metricsTitle").textContent =
    groupData[currentGroup].activeScenario;
  document.getElementById("metricsContent").innerHTML =
    '<div class="metrics-empty">等待预测结果...</div>';

  // 监听 input1 变化以切换 B 场景的可用状态
  const inp = document.getElementById("input1");
  if (inp) inp.addEventListener("input", updateBScenarioVisibility);
}

function setView(next) {
  if (view.value === next || curtainClass.value) return;
  clearTimeout(curtainTimer);
  curtainClass.value = "cv-in";
  curtainTimer = setTimeout(() => {
    view.value = next;
    document.body.style.overflow = next === "demo" ? "hidden" : "auto";
    curtainClass.value = "cv-out";
    curtainTimer = setTimeout(() => {
      curtainClass.value = "";
    }, 480);
  }, 480);
}

onMounted(() => {
  document.body.style.overflow = view.value === "demo" ? "hidden" : "auto";
  initPage();
});
</script>

<template>
  <div class="app-root">
    <!-- Hero Section -->
    <section class="hero-section" v-show="view === 'home'">
      <div class="hero-bg">
        <div class="hero-orb orb-1"></div>
        <div class="hero-orb orb-2"></div>
        <div class="hero-orb orb-3"></div>
      </div>

      <nav class="top-nav">
        <div class="nav-logo">
          <div class="logo-icon"></div>
          <span class="logo-text">Smart USV</span>
        </div>
        <div class="nav-links">
          <button @click="setView('home')" :class="{ active: view === 'home' }">
            首页
          </button>
          <button @click="setView('demo')" :class="{ active: view === 'demo' }">
            演示
          </button>
          <button
            @click="setView('chart')"
            :class="{ active: view === 'chart' }"
          >
            数据
          </button>
        </div>
      </nav>

      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          AI驱动的智能控制系统
        </div>
        <h1 class="hero-title">
          无人艇轨迹跟踪
          <span class="title-gradient">新一代解决方案</span>
        </h1>
        <p class="hero-desc">
          基于深度学习的高精度轨迹跟踪系统，实现参数不确定性和环境噪声下的稳定控制
        </p>
        <div class="hero-actions">
          <button class="btn-hero primary" @click="setView('demo')">
            <span>开始体验</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 5L12.5 10L7.5 15"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button class="btn-hero secondary" @click="setView('chart')">
            查看数据
          </button>
        </div>

        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-value">90%+</div>
            <div class="stat-label">误差降低</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">5种</div>
            <div class="stat-label">场景支持</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">实时</div>
            <div class="stat-label">在线预测</div>
          </div>
        </div>
      </div>

    </section>

    <div class="main-view" v-show="view === 'demo'">
      <div class="page">
        <section class="demo-topbar">
          <div class="dtb-l">
            <div class="dtb-icon"></div>
            <span class="dtb-title"
              >无人艇轨迹跟踪<em class="dtb-sep">·</em>演示控制台</span
            >
            <span class="dtb-live"><span class="dtb-pip"></span>LIVE</span>
          </div>
          <div class="dtb-r">
            <button type="button" class="nav-item" @click="setView('home')">
              首页
            </button>
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

        <div class="layout" :class="{ 'input-collapsed': !inputOpen }">
          <!-- 可折叠输入面板 -->
          <aside class="panel input-panel" :class="{ collapsed: !inputOpen }">
            <div class="floating-orb orb-2"></div>
            <div class="panel-header">
              <h2 class="panel-title">参数设置</h2>
              <span class="panel-subtitle">参数控制台</span>
            </div>

            <div class="input-body">
              <div class="input-grid">
                <div class="field">
                  <label for="input1"
                    >扰动频率参数
                    <span class="field-hint"
                      >1.5 → A1 &nbsp;|&nbsp; 0.7 → A2</span
                    ></label
                  >
                  <input
                    id="input1"
                    type="text"
                    placeholder="输入 1.5 或 0.7"
                  />
                </div>
                <div class="field" id="bScenarioGroup">
                  <label
                    >B 场景选择
                    <span class="field-hint">输入为空时生效</span></label
                  >
                  <div
                    class="radio-group"
                    role="radiogroup"
                    aria-label="B 场景选择"
                  >
                    <label class="radio-item">
                      <input
                        id="radioB1"
                        type="radio"
                        name="bScenario"
                        value="B1"
                        checked
                      />
                      <span>B1 &nbsp;参数不确定</span>
                    </label>
                    <label class="radio-item">
                      <input
                        id="radioB2"
                        type="radio"
                        name="bScenario"
                        value="B2"
                      />
                      <span>B2 &nbsp;噪声 + 不确定</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="actions">
                <button
                  class="btn btn-primary"
                  type="button"
                  @click="runPrediction"
                >
                  <span class="btn-icon">▶</span>开始预测
                </button>
                <button
                  class="btn btn-secondary"
                  type="button"
                  @click="resetForm"
                >
                  重置
                </button>
              </div>
            </div>

            <!-- 折叠切换按钮 -->
            <button
              class="collapse-btn"
              type="button"
              @click="inputOpen = !inputOpen"
              :title="inputOpen ? '收起参数面板' : '展开参数面板'"
            >
              <span class="collapse-icon">{{ inputOpen ? "‹" : "›" }}</span>
            </button>
          </aside>

          <main class="panel output-panel">
            <div class="panel-header">
              <h2 class="panel-title">结果展示</h2>
              <span class="panel-subtitle">可视化输出</span>
            </div>

            <div class="output-body">
              <div id="resultGrid"></div>
              <!-- 指标表格放在视频下方 -->
              <div class="metrics-panel" id="metricsPanel">
                <div class="metrics-header">
                  <strong>指标结果</strong>
                  <span id="metricsTitle" class="metrics-badge">A1</span>
                </div>
                <div class="metrics-table-wrap" id="metricsContent"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <div class="main-view" v-show="view === 'chart'">
      <div class="chart-page">
        <ChartsOverviewGrid
          :active="view === 'chart'"
          @go-demo="setView('demo')"
        />
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
  /* ── 浅蓝色系主题 ── */
  --bg-1: #f0f7ff;
  --bg-2: #ddeeff;
  --bg-3: #c5e0ff;
  --text-1: #0d2d5e;
  --text-2: #3a60a0;
  --text-3: #6080b8;
  --blue-1: #1e6aff;
  --blue-2: #38a0ff;
  --blue-3: #5dd5ff;
  --accent: #00c9f5;
  /* 卡片玻璃态 */
  --glass-bg: rgba(255, 255, 255, 0.72);
  --glass-border: rgba(47, 115, 255, 0.18);
  --glass-shadow: 0 0.5rem 2rem rgba(30, 90, 210, 0.12);
  --glass-bg-deep: rgba(255, 255, 255, 0.88);
  --shadow-lg: 0 1.5rem 4rem rgba(30, 100, 220, 0.16);
  --shadow-md: 0 0.75rem 2rem rgba(30, 100, 220, 0.1);
  --gap: 0.875rem;
  --header-h: 3.375rem;
}

#app {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  text-align: left !important;
  border: 0 !important;
  height: 100% !important;
  min-height: 100% !important;
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
  max-height: 100%;
  overflow: hidden;
  font-family:
    Inter,
    "Microsoft YaHei",
    PingFang SC,
    system-ui,
    sans-serif;
  color: var(--text-1);
  background: var(--bg-1);
}

html {
  font-size: clamp(0.75rem, 0.6vw + 0.55rem, 1rem);
}

.app-root {
  height: 100%;
  min-height: 0;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* ========== Hero Section ========== */
.hero-section {
  position: relative;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  background: radial-gradient(circle at 12% 12%, rgba(73, 167, 255, 0.25), transparent 18%),
    radial-gradient(circle at 88% 10%, rgba(125, 230, 255, 0.2), transparent 18%),
    radial-gradient(circle at 50% 100%, rgba(47, 115, 255, 0.15), transparent 30%),
    linear-gradient(180deg, var(--bg-1) 0%, var(--bg-2) 50%, var(--bg-3) 100%);
}

.hero-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.hero-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle at 1px 1px,
    rgba(47, 115, 255, 0.12) 1px,
    transparent 0
  );
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse at center, black 0%, transparent 75%);
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 20s ease-in-out infinite;
}

.hero-orb.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, var(--blue-1), transparent);
  top: -200px;
  right: -100px;
  animation-delay: 0s;
}

.hero-orb.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--blue-3), transparent);
  bottom: -150px;
  left: -100px;
  animation-delay: -7s;
}

.hero-orb.orb-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, var(--accent), transparent);
  top: 50%;
  left: 50%;
  animation-delay: -14s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-50px, 50px) scale(0.9);
  }
}

/* Top Navigation */
.top-nav {
  position: relative;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 3rem;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid rgba(47, 115, 255, 0.2);
  box-shadow: 0 4px 20px rgba(47, 115, 255, 0.08);
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, var(--blue-1), var(--blue-2));
  box-shadow: 0 4px 20px rgba(47, 115, 255, 0.4);
  position: relative;
}

.logo-icon::before,
.logo-icon::after {
  content: "";
  position: absolute;
  border-radius: 999rem;
  background: rgba(255, 255, 255, 0.9);
}

.logo-icon::before {
  width: 1.2rem;
  height: 0.2rem;
  left: 0.65rem;
  top: 1.15rem;
  transform: rotate(-24deg);
}

.logo-icon::after {
  width: 0.9rem;
  height: 0.2rem;
  left: 0.8rem;
  top: 0.75rem;
  box-shadow: -0.4rem 0.6rem 0 rgba(255, 255, 255, 0.9);
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--blue-2), var(--blue-3));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-links button {
  padding: 0.625rem 1.5rem;
  border-radius: 999rem;
  border: 1px solid rgba(47, 115, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-2);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-links button:hover {
  background: rgba(47, 115, 255, 0.1);
  border-color: rgba(47, 115, 255, 0.4);
  color: var(--text-1);
}

.nav-links button.active {
  background: linear-gradient(135deg, var(--blue-1), var(--blue-2));
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 16px rgba(47, 115, 255, 0.4);
}

/* Hero Content */
.hero-content {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 3rem 4rem;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 999rem;
  background: rgba(47, 115, 255, 0.1);
  border: 1px solid rgba(47, 115, 255, 0.3);
  color: var(--blue-3);
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1.2;
  margin: 0 0 1.5rem;
  color: var(--text-1);
}

.title-gradient {
  display: block;
  background: linear-gradient(
    135deg,
    var(--blue-1),
    var(--blue-2),
    var(--blue-3)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-top: 0.5rem;
}

.hero-desc {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--text-2);
  max-width: 700px;
  margin: 0 auto 3rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 4rem;
}

.btn-hero {
  padding: 1rem 2rem;
  border-radius: 999rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.btn-hero.primary {
  background: linear-gradient(135deg, var(--blue-1), var(--blue-2));
  color: white;
  box-shadow: 0 8px 24px rgba(47, 115, 255, 0.4);
}

.btn-hero.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(47, 115, 255, 0.5);
}

.btn-hero.secondary {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-1);
  border: 1px solid rgba(47, 115, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-hero.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(47, 115, 255, 0.5);
}

/* Hero Stats */
.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  padding: 2rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(47, 115, 255, 0.2);
  backdrop-filter: blur(20px);
  max-width: 800px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 900;
  line-height: 1.3;
  background: linear-gradient(135deg, var(--blue-2), var(--blue-3));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-3);
  font-weight: 600;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(47, 115, 255, 0.3),
    transparent
  );
}

/* Features Grid */
.features-grid {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 3rem 6rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  padding: 2rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(47, 115, 255, 0.2);
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(47, 115, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  border-color: rgba(47, 115, 255, 0.5);
  box-shadow: 0 20px 40px rgba(47, 115, 255, 0.2);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 1rem;
  background: linear-gradient(
    135deg,
    rgba(47, 115, 255, 0.2),
    rgba(125, 230, 255, 0.1)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: var(--blue-2);
  position: relative;
  z-index: 1;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-1);
  margin: 0 0 0.75rem;
  position: relative;
  z-index: 1;
}

.feature-desc {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-2);
  margin: 0;
  position: relative;
  z-index: 1;
}

.main-view {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at 12% 12%, rgba(73, 167, 255, 0.18), transparent 22%),
    radial-gradient(circle at 88% 88%, rgba(125, 230, 255, 0.15), transparent 22%),
    linear-gradient(160deg, var(--bg-1) 0%, var(--bg-2) 60%, var(--bg-3) 100%);
}

.page {
  width: min(96.25rem, calc(100vw - 1.75rem));
  flex: 1;
  min-height: 0;
  margin: 0 auto;
  display: grid;
  grid-template-rows: var(--header-h) minmax(0, 1fr);
  gap: var(--gap);
  padding-top: 0.5rem;
}

.nav-item {
  padding: 0.5rem 1.125rem;
  border-radius: 999rem;
  border: 0.0625rem solid rgba(47, 115, 255, 0.25);
  background: rgba(255, 255, 255, 0.7);
  color: var(--text-2);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.nav-item:hover {
  color: var(--blue-1);
  border-color: rgba(47, 115, 255, 0.45);
  background: rgba(255, 255, 255, 0.9);
}

.nav-item.active {
  color: #fff;
  background: linear-gradient(135deg, var(--blue-1), var(--blue-2));
  border-color: transparent;
  box-shadow: 0 0.375rem 1rem rgba(47, 115, 255, 0.32);
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
    rgba(255, 255, 255, 0.9) 0%,
    rgba(235, 246, 255, 0.92) 50%,
    rgba(220, 240, 255, 0.88) 100%
  );
  border: 0.0625rem solid rgba(47, 115, 255, 0.22);
  box-shadow:
    0 0.5rem 1.75rem rgba(47, 115, 255, 0.12),
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(1rem);
  overflow: hidden;
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
  background: linear-gradient(
    135deg,
    var(--blue-1),
    var(--blue-2) 60%,
    var(--blue-3)
  );
  box-shadow: 0 0.25rem 0.875rem rgba(47, 115, 255, 0.5);
  position: relative;
  flex-shrink: 0;
}

.dtb-icon::before,
.dtb-icon::after {
  content: "";
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
  color: var(--text-1);
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
  background: rgba(47, 115, 255, 0.12);
  border: 0.0625rem solid rgba(47, 115, 255, 0.28);
  font-size: 0.625rem;
  font-weight: 900;
  color: var(--blue-1);
  letter-spacing: 0.06rem;
}

.dtb-pip {
  width: 0.4375rem;
  height: 0.4375rem;
  border-radius: 999rem;
  background: var(--blue-1);
  box-shadow: 0 0 0.3125rem rgba(47, 115, 255, 0.7);
  animation: pip-pulse 1.8s ease-in-out infinite;
}

@keyframes pip-pulse {
  0%,
  100% {
    box-shadow: 0 0 0.25rem rgba(47, 115, 255, 0.6);
  }
  50% {
    box-shadow:
      0 0 0.75rem rgba(47, 115, 255, 0.9),
      0 0 1.375rem rgba(47, 115, 255, 0.35);
  }
}

.dtb-r {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.demo-topbar .nav-item {
  background: rgba(255, 255, 255, 0.65);
  border-color: rgba(47, 115, 255, 0.2);
  color: var(--text-2);
}

.demo-topbar .nav-item:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(47, 115, 255, 0.4);
  color: var(--text-1);
}

.demo-topbar .nav-item.active {
  background: linear-gradient(
    135deg,
    var(--blue-1),
    var(--blue-2)
  );
  border-color: transparent;
  color: #fff;
  box-shadow: 0 0.25rem 0.875rem rgba(47, 115, 255, 0.35);
}

.layout {
  min-height: 0;
  display: grid;
  grid-template-columns: 18rem minmax(0, 1fr);
  gap: var(--gap);
  transition: grid-template-columns 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}

.layout.input-collapsed {
  grid-template-columns: 2.75rem minmax(0, 1fr);
}

.layout > .input-panel {
  align-self: stretch;
  min-height: 0;
}

.panel {
  position: relative;
  border-radius: 1.375rem;
  border: 0.0625rem solid rgba(47, 115, 255, 0.18);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.88),
    rgba(235, 246, 255, 0.82)
  );
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
  background:
    linear-gradient(
      180deg,
      rgba(72, 163, 255, 0.06),
      transparent 20%,
      transparent 80%,
      rgba(123, 231, 255, 0.04)
    ),
    linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
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
    rgba(47, 115, 255, 0.2),
    rgba(72, 163, 255, 0.7),
    rgba(123, 231, 255, 0.5),
    rgba(47, 115, 255, 0.2)
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
  color: var(--text-3);
  font-size: 0.6875rem;
  padding: 0.375rem 0.625rem;
  border-radius: 999rem;
  background: rgba(47, 115, 255, 0.08);
  border: 0.0625rem solid rgba(73, 128, 255, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.04375rem;
}

.input-panel {
  padding-bottom: 0.875rem;
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  align-content: start;
  gap: 0;
  position: relative;
  transition: opacity 0.25s ease;
}

.input-panel.collapsed .input-body,
.input-panel.collapsed .panel-header {
  opacity: 0;
  pointer-events: none;
}

.input-body {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  min-height: 0;
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

/* 折叠按钮 */
.collapse-btn {
  position: absolute;
  right: -0.875rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 1.75rem;
  height: 3rem;
  border-radius: 0 0.875rem 0.875rem 0;
  border: 0.0625rem solid rgba(47, 115, 255, 0.2);
  border-left: none;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.92),
    rgba(225, 242, 255, 0.88)
  );
  box-shadow: 0.25rem 0 0.75rem rgba(47, 115, 255, 0.12);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s,
    box-shadow 0.2s;
}

.collapse-btn:hover {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1),
    rgba(210, 235, 255, 0.95)
  );
  box-shadow: 0.375rem 0 1rem rgba(47, 115, 255, 0.22);
}

.collapse-icon {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--blue-1);
  line-height: 1;
  user-select: none;
}

.field {
  display: grid;
  gap: 0.375rem;
}

.field label {
  font-size: 0.6875rem;
  font-weight: 800;
  color: var(--text-1);
  padding-left: 0.1875rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.field-hint {
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--text-3);
  opacity: 0.75;
  letter-spacing: 0;
}

.field input {
  width: 100%;
  height: 2.5rem;
  border: 0.0625rem solid rgba(74, 129, 255, 0.22);
  border-radius: 0.9375rem;
  background: rgba(255, 255, 255, 0.85);
  color: var(--text-1);
  font-size: 0.875rem;
  padding: 0 0.875rem;
  outline: none;
  box-shadow: inset 0 0.0625rem 0 rgba(255, 255, 255, 0.8);
  transition: 0.2s ease;
}

.field input:focus {
  border-color: rgba(47, 115, 255, 0.5);
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 0 0 0.25rem rgba(47, 115, 255, 0.1);
  transform: translateY(-0.0625rem);
}

.radio-group {
  display: grid;
  gap: 0.5rem;
  transition:
    opacity 0.3s ease,
    pointer-events 0.3s ease;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.9375rem;
  border: 0.0625rem solid rgba(74, 129, 255, 0.22);
  background: rgba(255, 255, 255, 0.85);
  box-shadow: inset 0 0.0625rem 0 rgba(255, 255, 255, 0.8);
  cursor: pointer;
  user-select: none;
  transition: 0.2s ease;
}

.radio-item input[type="radio"] {
  width: 1.125rem;
  height: 1.125rem;
  accent-color: #2f73ff;
}

.radio-item:hover {
  border-color: rgba(47, 115, 255, 0.42);
  background: rgba(255, 255, 255, 0.97);
}

.metrics-panel {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  border-radius: 0.875rem;
  border: 0.0625rem solid rgba(47, 115, 255, 0.18);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.88),
    rgba(235, 246, 255, 0.82)
  );
  box-shadow: inset 0 0.0625rem 0 rgba(255, 255, 255, 0.9);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: min(10.5rem, 26vh);
}

.metrics-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.35rem 0.625rem 0.3rem;
  border-bottom: 0.0625rem solid rgba(57, 124, 255, 0.15);
  flex-shrink: 0;
}

.metrics-header strong {
  font-size: 0.8125rem;
  font-weight: 800;
  color: var(--text-1);
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
  flex: 1;
  padding: 0.3rem 0.5rem 0.4rem;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  min-height: 0;
}

.metrics-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 0.625rem;
  color: var(--text-1);
}

.metrics-table th,
.metrics-table td {
  border: 0.0625rem solid rgba(57, 124, 255, 0.12);
  padding: 0.28rem 0.3rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.55);
  line-height: 1.15;
  word-break: break-word;
}

.metrics-table thead th {
  background: rgba(47, 115, 255, 0.08);
  font-weight: 800;
  color: var(--text-1);
}

.metrics-table .metric-name {
  text-align: left;
  padding-left: 0.5rem;
  width: 34%;
}

.metric-improve.improve-good {
  color: #0a7c44;
  font-weight: 800;
  background: rgba(16, 185, 129, 0.1);
}

.metrics-empty {
  padding: 1.125rem 0.875rem;
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-3);
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
  color: var(--blue-1);
}

.loading-bar {
  width: 100%;
  height: 0.5rem;
  border-radius: 999rem;
  background: rgba(47, 115, 255, 0.12);
  overflow: hidden;
  position: relative;
}

.loading-bar::before {
  content: "";
  position: absolute;
  inset: 0;
  width: 38%;
  border-radius: 999rem;
  background: linear-gradient(
    90deg,
    var(--blue-1),
    var(--blue-2),
    var(--blue-3)
  );
  box-shadow: 0 0 0.875rem rgba(47, 115, 255, 0.35);
  animation: fakeLoading 1.2s ease-in-out infinite;
}

.loading-dots {
  font-size: 0.6875rem;
  letter-spacing: 0.125rem;
  color: var(--text-3);
}

.actions {
  position: relative;
  z-index: 1;
  padding: 0.75rem 1rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
  align-self: end;
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
  background: linear-gradient(
    135deg,
    var(--blue-1),
    var(--blue-2) 65%,
    var(--blue-3)
  );
  box-shadow: 0 0.5rem 1.25rem rgba(47, 115, 255, 0.28);
}

.btn-primary:hover {
  transform: translateY(-0.125rem);
  box-shadow: 0 0.75rem 1.75rem rgba(47, 115, 255, 0.38);
}

.btn-secondary {
  color: var(--text-2);
  background: rgba(255, 255, 255, 0.82);
  border: 0.0625rem solid rgba(74, 129, 255, 0.2);
}

.btn-secondary:hover {
  transform: translateY(-0.125rem);
  background: rgba(255, 255, 255, 0.97);
  border-color: rgba(47, 115, 255, 0.38);
}

/* ── Output Panel ── */
.output-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  padding-bottom: 0.5rem;
  min-height: 0;
}

.output-panel .panel-header {
  padding-top: 0.75rem;
}

.output-body {
  position: relative;
  z-index: 1;
  padding: 0.5rem 0.75rem 0;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  overflow: hidden;
}

/* ── Result Grid ── */
#resultGrid {
  min-height: 0;
  flex: 1;
  overflow: hidden;
}

/* 左侧大图 + 右侧 2×2 四张小图（Grid）；移入某小图时与主列互换（由 JS 挂 swap-* 类，避免 :hover 抖动） */
.result-flex {
  --rf-gap: 0.5rem;
  min-height: 0;
  height: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.5fr) minmax(0, 0.5fr);
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  gap: var(--rf-gap);
  align-items: stretch;
  position: relative;
}

.result-main-col {
  grid-column: 1;
  grid-row: 1 / -1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.result-main-col .result-card {
  flex: 1;
  min-height: 0;
}

/* 四张小图默认占右侧 2×2 */
.result-flex > .result-card.small:nth-child(2) {
  grid-column: 2;
  grid-row: 1;
}
.result-flex > .result-card.small:nth-child(3) {
  grid-column: 3;
  grid-row: 1;
}
.result-flex > .result-card.small:nth-child(4) {
  grid-column: 2;
  grid-row: 2;
}
.result-flex > .result-card.small:nth-child(5) {
  grid-column: 3;
  grid-row: 2;
}

/* 由 .swap-2 … .swap-5 控制互换（见 attachResultSwapInteraction） */
.result-flex.swap-2 > .result-card.small:nth-child(2) {
  grid-column: 1;
  grid-row: 1 / -1;
  box-shadow: 0 1.25rem 3rem rgba(47, 115, 255, 0.15);
}
.result-flex.swap-2 .result-main-col {
  grid-column: 2;
  grid-row: 1;
}

.result-flex.swap-3 > .result-card.small:nth-child(3) {
  grid-column: 1;
  grid-row: 1 / -1;
  box-shadow: 0 1.25rem 3rem rgba(47, 115, 255, 0.15);
}
.result-flex.swap-3 .result-main-col {
  grid-column: 3;
  grid-row: 1;
}

.result-flex.swap-4 > .result-card.small:nth-child(4) {
  grid-column: 1;
  grid-row: 1 / -1;
  box-shadow: 0 1.25rem 3rem rgba(47, 115, 255, 0.15);
}
.result-flex.swap-4 .result-main-col {
  grid-column: 2;
  grid-row: 2;
}

.result-flex.swap-5 > .result-card.small:nth-child(5) {
  grid-column: 1;
  grid-row: 1 / -1;
  box-shadow: 0 1.25rem 3rem rgba(47, 115, 255, 0.15);
}
.result-flex.swap-5 .result-main-col {
  grid-column: 3;
  grid-row: 2;
}

.result-card {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  border: 0.0625rem solid rgba(47, 115, 255, 0.18);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.9),
    rgba(230, 244, 255, 0.85)
  );
  box-shadow: 0 0.5rem 1.5rem rgba(47, 115, 255, 0.1);
  padding: 0.3rem 0.4rem 0.25rem;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  transition:
    box-shadow 0.28s ease,
    transform 0.28s ease;
}

.result-flex > .result-card.small {
  transition: box-shadow 0.28s ease;
}

.result-flex.swap-2 > .result-card.small:nth-child(2) .auto-video,
.result-flex.swap-3 > .result-card.small:nth-child(3) .auto-video,
.result-flex.swap-4 > .result-card.small:nth-child(4) .auto-video,
.result-flex.swap-5 > .result-card.small:nth-child(5) .auto-video {
  padding: 0.5rem;
}

.result-flex.swap-2 .result-main-col .auto-video,
.result-flex.swap-3 .result-main-col .auto-video,
.result-flex.swap-4 .result-main-col .auto-video,
.result-flex.swap-5 .result-main-col .auto-video {
  padding: 0.3rem;
}

.result-card::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.5),
      transparent 24%,
      transparent 72%,
      rgba(200, 230, 255, 0.12)
    ),
    radial-gradient(
      circle at top right,
      rgba(123, 200, 255, 0.18),
      transparent 26%
    );
}

/* 大图轻微悬停；小图放大由 Grid 铺满主列完成，不再 scale */
.result-card.large:hover {
  box-shadow: 0 1.25rem 3rem rgba(47, 115, 255, 0.22);
  transform: scale(1.012);
  z-index: 2;
}

.result-caption {
  flex-shrink: 0;
  text-align: center;
  font-size: 0.6875rem;
  font-weight: 800;
  color: var(--text-2);
  line-height: 1.25;
  letter-spacing: 0.0125rem;
  padding: 0 0.125rem;
}

.result-card.small {
  flex: 1;
  min-height: 0;
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
  background:
    radial-gradient(
      circle at 50% 16%,
      rgba(180, 220, 255, 0.5),
      transparent 24%
    ),
    linear-gradient(135deg, #ddf0ff, #c2e2ff 58%, #a8d4ff);
  box-shadow: inset 0 0 0 0.0625rem rgba(47, 115, 255, 0.2);
}

.result-video-wrap::before {
  content: "";
  position: absolute;
  inset: 0.5rem;
  border-radius: 0.625rem;
  border: 0.0625rem solid rgba(47, 115, 255, 0.2);
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
    rgba(47, 115, 255, 0.03) 0,
    rgba(47, 115, 255, 0.03) 0.0625rem,
    transparent 0.1875rem,
    transparent 0.375rem
  );
  opacity: 0.3;
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
  width: 1.5rem;
  height: 1.5rem;
  border-color: rgba(47, 115, 255, 0.45);
  border-style: solid;
  filter: drop-shadow(0 0 0.5rem rgba(72, 163, 255, 0.3));
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
  background: rgba(100, 190, 255, 0.12);
  bottom: 2rem;
  left: -1.125rem;
}

.chart-page {
  flex: 1;
  min-height: 0;
  display: flex;
  padding: 1rem 0.75rem 1.5rem;
  overflow: auto;
  background: transparent;
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
  border: 0.0625rem solid rgba(47, 115, 255, 0.16);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.9),
    rgba(235, 247, 255, 0.84)
  );
  box-shadow: 0 1rem 2rem rgba(47, 115, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chart-card-title {
  flex-shrink: 0;
  padding: 0.625rem 0.75rem 0.375rem;
  font-size: 0.75rem;
  font-weight: 900;
  color: var(--text-1);
  letter-spacing: 0.0125rem;
  text-align: center;
  background: rgba(47, 115, 255, 0.07);
  border-bottom: 0.0625rem solid rgba(73, 167, 255, 0.2);
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
  background: linear-gradient(
    130deg,
    #06123a 0%,
    #122680 38%,
    #2f73ff 72%,
    #49a7ff 100%
  );
  transform: translateX(100%);
  will-change: transform;
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
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.22),
    rgba(255, 255, 255, 0.07)
  );
  border: 0.0625rem solid rgba(255, 255, 255, 0.28);
  box-shadow:
    0 0.5rem 1.25rem rgba(0, 0, 0, 0.24),
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.24);
  position: relative;
  flex-shrink: 0;
}

.vc-icon::before,
.vc-icon::after {
  content: "";
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
  content: "";
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 999rem;
  border: 0.1875rem solid rgba(47, 115, 255, 0.12);
  border-top-color: rgba(47, 115, 255, 0.55);
  box-shadow:
    0 0 0 0.625rem rgba(47, 115, 255, 0.04),
    0 0 0 1.25rem rgba(47, 115, 255, 0.02);
  animation: radar-ring 2.2s ease-in-out infinite;
}

#resultGrid:empty::after {
  content: "等待预测结果";
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-3);
  letter-spacing: 0.1rem;
}

@keyframes radar-ring {
  0%,
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
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

/* Responsive */
@media (max-width: 64rem) {
  .hero-content {
    padding: 4rem 2rem 3rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .stat-divider {
    width: 100px;
    height: 1px;
  }

  .top-nav {
    padding: 1rem 1.5rem;
  }

  .nav-links {
    gap: 0.25rem;
  }

  .nav-links button {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
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
    grid-template-columns: 1fr 1fr;
    grid-template-rows: minmax(11rem, 34vh) minmax(0, 1fr) minmax(0, 1fr);
    height: auto;
    min-height: min(28rem, 70vh);
  }
  .result-main-col {
    grid-column: 1 / -1;
    grid-row: 1;
  }
  .result-flex > .result-card.small:nth-child(2) {
    grid-column: 1;
    grid-row: 2;
  }
  .result-flex > .result-card.small:nth-child(3) {
    grid-column: 2;
    grid-row: 2;
  }
  .result-flex > .result-card.small:nth-child(4) {
    grid-column: 1;
    grid-row: 3;
  }
  .result-flex > .result-card.small:nth-child(5) {
    grid-column: 2;
    grid-row: 3;
  }
  .result-flex.swap-2 > .result-card.small:nth-child(2) {
    grid-column: 1 / -1;
    grid-row: 1;
  }
  .result-flex.swap-2 .result-main-col {
    grid-column: 1;
    grid-row: 2;
  }
  .result-flex.swap-3 > .result-card.small:nth-child(3) {
    grid-column: 1 / -1;
    grid-row: 1;
  }
  .result-flex.swap-3 .result-main-col {
    grid-column: 2;
    grid-row: 2;
  }
  .result-flex.swap-4 > .result-card.small:nth-child(4) {
    grid-column: 1 / -1;
    grid-row: 1;
  }
  .result-flex.swap-4 .result-main-col {
    grid-column: 1;
    grid-row: 3;
  }
  .result-flex.swap-5 > .result-card.small:nth-child(5) {
    grid-column: 1 / -1;
    grid-row: 1;
  }
  .result-flex.swap-5 .result-main-col {
    grid-column: 2;
    grid-row: 3;
  }
  .result-main-col .result-card {
    min-height: min(11rem, 34vh);
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
