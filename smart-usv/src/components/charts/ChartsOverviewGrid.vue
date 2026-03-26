<template>
  <div class="landing">
    <main class="landing-main">
      <header class="landing-hero reveal-on-scroll is-visible">
        <div class="hero-bg-orb orb-a"></div>
        <div class="hero-bg-orb orb-b"></div>

        <div class="hero-content">
          <div class="hero-kicker">欠驱动 USV · 抗扰轨迹跟踪</div>
          <h1 class="hero-title">模型驱动 + 一维 CNN 的残差学习补偿方法</h1>
          <p class="hero-subtitle">
            针对欠驱动 USV 在强时变扰动下轨迹跟踪精度下降的问题，提出一种模型驱动与数据驱动相结合的抗扰轨迹跟踪控制方法：
            以 Fossen 动力学模型为基础，结合反步控制与扰动观测器（DOB）保证稳定性；引入一维 CNN 学习 DOB 观测残差，并将网络输出作为辅助补偿项注入控制输入，
            在不改变原有稳定性分析框架的前提下提升扰动抑制能力。
          </p>

          <div class="hero-tags" aria-label="关键词">
            <span class="tag">欠驱动无人船</span>
            <span class="tag">轨迹跟踪</span>
            <span class="tag">反步控制</span>
            <span class="tag">扰动观测器</span>
            <span class="tag">一维卷积神经网络</span>
          </div>

          <div class="hero-actions">
            <button type="button" class="btn-primary" @click="emit('go-demo')">进入预测界面</button>
            <button type="button" class="btn-ghost" @click="scrollToA()">查看仿真结果</button>
          </div>

          <div class="hero-metrics">
            <div class="metric">
              <div class="metric-value">20%–36%</div>
              <div class="metric-label">全程位置误差 RMS 降低</div>
            </div>
            <div class="metric">
              <div class="metric-value">60%–91%</div>
              <div class="metric-label">稳态 RMS 降低</div>
            </div>
            <div class="metric">
              <div class="metric-value">4 组</div>
              <div class="metric-label">对比工况验证</div>
            </div>
          </div>
        </div>
      </header>

      <section class="section reveal-on-scroll" aria-label="主要贡献">
        <div class="section-head">
          <h2>主要贡献</h2>
          <p>在不破坏闭环稳定性的前提下，用数据驱动补偿强时变扰动引入的观测残差。</p>
        </div>
        <div class="card-grid">
          <article class="card">
            <h3>残差学习补偿机制</h3>
            <p>在反步控制 + DOB 的框架内，引入一维 CNN 对观测残差进行学习，输出作为辅助补偿项叠加到控制输入。</p>
          </article>
          <article class="card">
            <h3>强时变扰动适应能力增强</h3>
            <p>利用一维 CNN 的时序特征提取优势，更精准估计残差并提升扰动抑制能力，显著改善稳态与全程误差。</p>
          </article>
          <article class="card">
            <h3>性能提升不以“更强控制”为代价</h3>
            <p>最大误差与收敛时间基本不变，控制能量未显著增加，实现的是结构内的“精修补偿”。</p>
          </article>
        </div>
      </section>

      <section class="section reveal-on-scroll" aria-label="实验工况与图片摘要">
        <div class="section-head">
          <h2>四组对比工况</h2>
          <p>通过扰动频率变化、参数变化与噪声等多工况对比仿真，验证方法的工程可用性与稳态精度提升。</p>
        </div>

        <div class="scene-grid">
          <article class="scene-card">
            <div class="scene-media">
              <img src="/second/scene-a.svg" alt="工况 A：扰动频率变化示意图" />
            </div>
            <div class="scene-body">
              <div class="scene-title">工况 A</div>
              <div class="scene-desc">扰动频率变化下的跟踪误差与补偿效果对比。</div>
            </div>
          </article>

          <article class="scene-card">
            <div class="scene-media">
              <img src="/second/scene-b.svg" alt="工况 B：参数变化示意图" />
            </div>
            <div class="scene-body">
              <div class="scene-title">工况 B</div>
              <div class="scene-desc">模型参数变化下的鲁棒性与误差收敛特性对比。</div>
            </div>
          </article>

          <article class="scene-card">
            <div class="scene-media">
              <img src="/second/scene-c.svg" alt="工况 C：噪声与不确定性示意图" />
            </div>
            <div class="scene-body">
              <div class="scene-title">工况 C</div>
              <div class="scene-desc">噪声与不确定性叠加下的稳态误差改善对比。</div>
            </div>
          </article>

          <article class="scene-card">
            <div class="scene-media">
              <img src="/second/scene-d.svg" alt="工况 D：综合对比示意图" />
            </div>
            <div class="scene-body">
              <div class="scene-title">工况 D</div>
              <div class="scene-desc">综合工况下的整体性能评估：RMS、最大误差、收敛时间与控制能量。</div>
            </div>
          </article>
        </div>
      </section>

      <section class="section chart-section">
        <div class="section-head reveal-on-scroll">
          <h2>仿真结果总览</h2>
          <p>滚动到对应模块会自动逐个渲染图表。</p>
        </div>

        <section ref="secA" id="sec-a" class="reveal-section chart-block" data-idx="0" :class="{ 'is-visible': visible[0] }">
          <ChartA :active="props.active && visible[0]" />
        </section>
        <section ref="secB" id="sec-b" class="reveal-section chart-block" data-idx="1" :class="{ 'is-visible': visible[1] }">
          <ChartB :active="props.active && visible[1]" />
        </section>
        <section ref="secC" id="sec-c" class="reveal-section chart-block" data-idx="2" :class="{ 'is-visible': visible[2] }">
          <ChartC :active="props.active && visible[2]" />
        </section>
        <section ref="secD" id="sec-d" class="reveal-section chart-block" data-idx="3" :class="{ 'is-visible': visible[3] }">
          <ChartD :active="props.active && visible[3]" />
        </section>
      </section>

      <footer class="landing-footer reveal-on-scroll">
        <button type="button" class="btn-primary" @click="emit('go-demo')">进入预测界面</button>
        <div class="footer-hint">你可以在预测界面输入参数，查看轨迹对比与误差指标。</div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ChartA from './ChartA.vue'
import ChartB from './ChartB.vue'
import ChartC from './ChartC.vue'
import ChartD from './ChartD.vue'

const props = defineProps({
  active: { type: Boolean, default: false },
})

const emit = defineEmits(['go-demo'])

const secA = ref(null)
const secB = ref(null)
const secC = ref(null)
const secD = ref(null)

const visible = ref([false, false, false, false])
const activeIdx = ref(0)

let observer = null
let revealObserver = null

function connectObserver() {
  const targets = [
    { idx: 0, el: secA.value },
    { idx: 1, el: secB.value },
    { idx: 2, el: secC.value },
    { idx: 3, el: secD.value },
  ].filter((t) => t.el)

  if (!targets.length) return

  observer?.disconnect()
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const idx = Number(entry.target?.dataset?.idx)
        if (!Number.isFinite(idx) || idx < 0 || idx > 3) continue
        visible.value[idx] = true
        activeIdx.value = idx
      }
    },
    {
      // 模块露出到一半左右就开始渲染
      threshold: 0.35,
      root: null,
    },
  )

  targets.forEach((t) => observer.observe(t.el))
}

function connectRevealObserver() {
  const els = Array.from(document.querySelectorAll('.reveal-on-scroll'))
  if (!els.length) return

  revealObserver?.disconnect()
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        revealObserver?.unobserve(entry.target)
      }
    },
    { threshold: 0.18, root: null },
  )

  els.forEach((el) => revealObserver.observe(el))
}

onMounted(() => {
  // 只要页面开始滚动/进入视口，就逐个显示图表
  connectObserver()
  connectRevealObserver()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
  revealObserver?.disconnect()
  revealObserver = null
})

function scrollToEl(el) {
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollToA() {
  scrollToEl(secA.value)
}
function scrollToB() {
  scrollToEl(secB.value)
}
function scrollToC() {
  scrollToEl(secC.value)
}
function scrollToD() {
  scrollToEl(secD.value)
}
</script>

<style scoped>
.landing {
  width: 100%;
}

.landing-main {
  width: min(96.25rem, calc(100vw - 1.75rem));
  margin: 0 auto;
  padding: 0.75rem 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.landing-hero {
  position: relative;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 0.0625rem solid rgba(255, 255, 255, 0.72);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(234, 244, 255, 0.76)),
    radial-gradient(circle at 20% 30%, rgba(47, 115, 255, 0.14), transparent 40%),
    radial-gradient(circle at 85% 20%, rgba(125, 230, 255, 0.16), transparent 40%);
  box-shadow: 0 1.5rem 4.25rem rgba(46, 109, 225, 0.14);
}

.hero-bg-orb {
  position: absolute;
  border-radius: 999rem;
  filter: blur(0.85rem);
  opacity: 0.55;
  pointer-events: none;
}

.orb-a {
  width: min(18rem, 38vw);
  height: min(18rem, 38vw);
  right: -6rem;
  top: -7rem;
  background: rgba(72, 163, 255, 0.22);
}

.orb-b {
  width: min(15rem, 32vw);
  height: min(15rem, 32vw);
  left: -7rem;
  bottom: -7rem;
  background: rgba(123, 231, 255, 0.18);
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 1.25rem 1.25rem 1.125rem;
  display: grid;
  gap: 0.875rem;
}

.hero-kicker {
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.08rem;
  text-transform: uppercase;
  color: rgba(88, 120, 173, 0.96);
}

.hero-title {
  margin: 0;
  font-size: clamp(1.35rem, 1.5vw + 1rem, 2.35rem);
  line-height: 1.08;
  font-weight: 950;
  letter-spacing: 0.0125rem;
  color: rgba(19, 53, 111, 0.96);
}

.hero-subtitle {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.7;
  color: rgba(58, 88, 140, 0.96);
  max-width: 72rem;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: 0.75rem;
  font-weight: 900;
  color: rgba(58, 88, 140, 0.96);
  padding: 0.375rem 0.625rem;
  border-radius: 999rem;
  border: 0.0625rem solid rgba(74, 129, 255, 0.14);
  background: rgba(255, 255, 255, 0.58);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  align-items: center;
}

.btn-primary {
  height: 2.75rem;
  padding: 0 1rem;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  font-weight: 950;
  font-size: 0.9rem;
  color: #fff;
  background: linear-gradient(135deg, rgba(47, 115, 255, 0.95), rgba(73, 167, 255, 0.95));
  box-shadow: 0 0.75rem 1.5rem rgba(47, 115, 255, 0.22);
  transition: 0.2s ease;
}

.btn-ghost {
  height: 2.75rem;
  padding: 0 1rem;
  border-radius: 1rem;
  cursor: pointer;
  font-weight: 950;
  font-size: 0.9rem;
  color: rgba(58, 88, 140, 0.96);
  border: 0.0625rem solid rgba(74, 129, 255, 0.14);
  background: rgba(255, 255, 255, 0.7);
  transition: 0.2s ease;
}

.btn-primary:hover,
.btn-ghost:hover {
  transform: translateY(-0.125rem);
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.metric {
  border-radius: 1rem;
  border: 0.0625rem solid rgba(255, 255, 255, 0.72);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(240, 247, 255, 0.78));
  box-shadow: inset 0 0.0625rem 0 rgba(255, 255, 255, 0.55);
  padding: 0.875rem 0.875rem 0.75rem;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 950;
  color: rgba(19, 53, 111, 0.96);
}

.metric-label {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  line-height: 1.5;
  color: rgba(88, 120, 173, 0.96);
}

.section {
  border-radius: 1.125rem;
  border: 0.0625rem solid rgba(255, 255, 255, 0.72);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(239, 247, 255, 0.78));
  box-shadow: 0 1rem 2rem rgba(67, 116, 212, 0.08);
  padding: 1rem 1rem;
  display: grid;
  gap: 0.875rem;
}

.section-head h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 950;
  letter-spacing: 0.0125rem;
  color: rgba(19, 53, 111, 0.96);
}

.section-head p {
  margin: 0.375rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: rgba(88, 120, 173, 0.96);
  max-width: 70rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.card {
  border-radius: 1rem;
  border: 0.0625rem solid rgba(74, 129, 255, 0.14);
  background: rgba(255, 255, 255, 0.62);
  padding: 0.875rem 0.875rem;
}

.card h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 950;
  color: rgba(19, 53, 111, 0.96);
}

.card p {
  margin: 0.5rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: rgba(58, 88, 140, 0.96);
}

.scene-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.scene-card {
  overflow: hidden;
  border-radius: 1rem;
  border: 0.0625rem solid rgba(74, 129, 255, 0.14);
  background: rgba(255, 255, 255, 0.62);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1.15fr;
  align-items: stretch;
}

.scene-media {
  display: grid;
  place-items: center;
  padding: 0.875rem;
  background: radial-gradient(circle at 50% 16%, rgba(123, 231, 255, 0.34), transparent 28%),
    linear-gradient(135deg, rgba(221, 240, 255, 0.95), rgba(183, 219, 255, 0.9));
}

.scene-media img {
  width: 100%;
  height: min(9.5rem, 18vh);
  object-fit: contain;
  border-radius: 0.75rem;
}

.scene-body {
  padding: 0.875rem 0.875rem;
  display: grid;
  align-content: center;
  gap: 0.375rem;
}

.scene-title {
  font-weight: 950;
  color: rgba(19, 53, 111, 0.96);
  font-size: 0.95rem;
}

.scene-desc {
  color: rgba(58, 88, 140, 0.96);
  font-size: 0.8125rem;
  line-height: 1.7;
}

.chart-section {
  padding: 1rem 1rem 0.875rem;
}

.chart-block {
  margin-top: 0.75rem;
}

.reveal-section {
  opacity: 0;
  transform: translateY(1rem);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.reveal-on-scroll {
  opacity: 0;
  transform: translateY(0.9rem);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.reveal-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.landing-footer {
  border-radius: 1.125rem;
  border: 0.0625rem solid rgba(255, 255, 255, 0.72);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(239, 247, 255, 0.78));
  box-shadow: 0 1rem 2rem rgba(67, 116, 212, 0.06);
  padding: 1rem 1rem;
  display: grid;
  justify-items: start;
  gap: 0.5rem;
}

.footer-hint {
  font-size: 0.75rem;
  color: rgba(88, 120, 173, 0.96);
  line-height: 1.7;
}

@media (max-width: 64rem) {
  .landing-main {
    width: min(100%, calc(100vw - 1rem));
  }

  .hero-metrics {
    grid-template-columns: 1fr;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }

  .scene-grid {
    grid-template-columns: 1fr;
  }

  .scene-card {
    grid-template-columns: 1fr;
  }
}
</style>

