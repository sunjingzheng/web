<template>
  <div class="landing">
    <main class="lm">

      <!-- ①  HERO  ─────────────────────────────────────── -->
      <header class="l-hero">
        <div class="hero-orb hero-o1"></div>
        <div class="hero-orb hero-o2"></div>
        <div class="hero-orb hero-o3"></div>

        <!-- left ── text -->
        <div class="hero-l">
          <div class="kicker"><span class="kicker-pip"></span>欠驱动 USV · 抗扰轨迹跟踪</div>
          <h1 class="hero-h1">
            模型驱动<br />
            <span class="h1-grd">+ 一维 CNN</span><br />
            残差学习补偿
          </h1>
          <p class="hero-sub">
            针对强时变扰动下 USV 轨迹跟踪精度下降问题，提出 DOB 与一维 CNN 相结合的辅助补偿策略，在不改变 Lyapunov 稳定性框架的前提下显著提升扰动抑制能力。
          </p>
          <div class="hero-tags">
            <span v-for="t in tags" :key="t" class="htag">{{ t }}</span>
          </div>
          <div class="hero-btns">
            <button class="btn-p" @click="emit('go-demo')">进入预测界面 →</button>
            <button class="btn-g" @click="scrollToCharts">查看仿真结果</button>
          </div>
          <div class="hero-stats">
            <div class="hst" v-for="s in heroStats" :key="s.val">
              <div class="hst-v">{{ s.val }}</div>
              <div class="hst-l">{{ s.lab }}</div>
            </div>
          </div>
        </div>

        <!-- right ── cycling image display -->
        <div class="hero-r">
          <div class="img-cycle">
            <div
              v-for="(img, i) in resultImages"
              :key="i"
              class="ic-item"
              :class="{ active: i === cycleIdx }"
            >
              <img :src="img.src" :alt="img.label" />
              <div class="ic-badge">{{ img.label }}</div>
            </div>
            <div class="ic-nav">
              <button
                v-for="(_, i) in resultImages"
                :key="i"
                class="ic-dot"
                :class="{ active: i === cycleIdx }"
                @click="goToCycle(i)"
              ></button>
            </div>
            <!-- decorative corner accents -->
            <div class="ic-corner ic-corner-tl"></div>
            <div class="ic-corner ic-corner-br"></div>
          </div>
        </div>
      </header>

      <!-- ②  TICKER BAR  ──────────────────────────────── -->
      <div class="ticker-wrap reveal-on-scroll">
        <div class="ticker-track">
          <span v-for="(t, i) in tickerAll" :key="i" class="ti">
            <b>{{ t.val }}</b>&nbsp;{{ t.lab }}<span class="ti-sep">✦</span>
          </span>
        </div>
      </div>

      <!-- ③  PIPELINE  ────────────────────────────────── -->
      <section class="pipe-sec reveal-on-scroll" aria-label="方法流程">
        <div class="sec-hd">
          <div class="sec-tag">方法框架</div>
          <h2>三步构建抗扰控制体系</h2>
          <p>模型驱动稳定性保障 × 数据驱动残差补偿，串联成完整增强控制回路。</p>
        </div>
        <div class="pipe-row">
          <div class="pipe-node pn1 stagger-c" style="--d:0s">
            <div class="pn-num">01</div>
            <div class="pn-icon">
              <svg viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="19" stroke="currentColor" stroke-width="2.5"/>
                <path d="M16 24h16M24 16l8 8-8 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>动力学建模</h3>
            <p>Fossen 船舶模型，明确欠驱动约束与时变扰动特征分布。</p>
          </div>
          <div class="pipe-arr">
            <svg viewBox="0 0 64 16" fill="none"><path d="M2 8h60M56 2l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="pipe-node pn2 stagger-c" style="--d:0.18s">
            <div class="pn-num">02</div>
            <div class="pn-icon">
              <svg viewBox="0 0 48 48" fill="none">
                <rect x="8" y="8" width="32" height="32" rx="8" stroke="currentColor" stroke-width="2.5"/>
                <path d="M16 24h16M24 16v16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>反步法 + DOB</h3>
            <p>设计主控制律，扰动观测器实时估计并补偿未知扰动，保证 Lyapunov 稳定。</p>
          </div>
          <div class="pipe-arr">
            <svg viewBox="0 0 64 16" fill="none"><path d="M2 8h60M56 2l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="pipe-node pn3 stagger-c" style="--d:0.36s">
            <div class="pn-num">03</div>
            <div class="pn-icon">
              <svg viewBox="0 0 48 48" fill="none">
                <path d="M8 36l7-14 6 10 5-20 6 15 5-8 3 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>CNN 残差学习</h3>
            <p>一维 CNN 学习 DOB 观测残差，辅助补偿项叠加至控制输入，提升抗扰精度。</p>
          </div>
        </div>
      </section>

      <!-- ④  CONTRIBUTIONS  ────────────────────────────── -->
      <section class="contrib-sec" aria-label="主要贡献">
        <div class="sec-hd reveal-on-scroll">
          <div class="sec-tag">主要贡献</div>
          <h2>三项核心创新</h2>
          <p>在不破坏闭环稳定性的前提下，完成精度的结构内优化，无需增加控制代价。</p>
        </div>
        <div class="contrib-row">
          <article class="cc reveal-on-scroll" style="--d:0s">
            <div class="cc-bg-num">01</div>
            <h3>残差学习补偿机制</h3>
            <p>在反步控制 + DOB 框架内，引入一维 CNN 学习观测残差，输出作为辅助补偿项叠加到控制输入，不替代原有控制结构。</p>
          </article>
          <article class="cc reveal-on-scroll" style="--d:0.12s">
            <div class="cc-bg-num">02</div>
            <h3>时变扰动适应能力增强</h3>
            <p>利用一维 CNN 的时序特征提取优势，更精准估计残差，全程 RMS 降低 20%–36%，稳态 RMS 降低 60%–91%，效果显著。</p>
          </article>
          <article class="cc reveal-on-scroll" style="--d:0.24s">
            <div class="cc-bg-num">03</div>
            <h3>性能提升不增加控制代价</h3>
            <p>最大误差与收敛时间基本不变，控制输入幅值未显著增大，实现结构内"精修补偿"，保持闭环稳定性。</p>
          </article>
        </div>
      </section>

      <!-- ⑤  CAROUSEL  ────────────────────────────────── -->
      <section class="car-sec reveal-on-scroll" aria-label="对比工况">
        <div class="sec-hd">
          <div class="sec-tag">对比工况</div>
          <h2>四组对比工况</h2>
          <p>扰动频率变化、参数变化与噪声叠加等多场景下的系统性验证，涵盖两通道性能与计算效率。</p>
        </div>

        <div class="car-box">
          <button class="car-arr car-l" @click="prevSlide" aria-label="上一张">‹</button>
          <div class="car-vp">
            <div class="car-track" :style="{ transform: `translateX(-${slideIdx * 100}%)` }">
              <div class="car-slide" v-for="(img, i) in resultImages" :key="i">
                <div class="cs-img">
                  <img :src="img.src" :alt="img.label" />
                </div>
                <div class="cs-info">
                  <div class="cs-idx">{{ String(i + 1).padStart(2, '0') }}</div>
                  <div class="cs-text">
                    <div class="cs-title">{{ img.label }}</div>
                    <div class="cs-desc">{{ img.desc }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="car-arr car-r" @click="nextSlide" aria-label="下一张">›</button>
        </div>

        <div class="car-inds">
          <button
            v-for="(img, i) in resultImages"
            :key="i"
            class="car-ind"
            :class="{ active: i === slideIdx }"
            @click="goToSlide(i)"
          ><span>{{ img.label }}</span></button>
        </div>
        <!-- progress bar -->
        <div class="car-progress">
          <div class="car-prog-bar" :style="{ width: `${((slideIdx + 1) / resultImages.length) * 100}%` }"></div>
        </div>
      </section>

      <!-- ⑥  CHARTS  ──────────────────────────────────── -->
      <section class="charts-sec" ref="chartsSection" aria-label="仿真图表">
        <div class="sec-hd reveal-on-scroll">
          <div class="sec-tag">仿真结果</div>
          <h2>总览图表</h2>
          <p>滚动到对应模块，图表自动逐个渲染。</p>
        </div>
        <section ref="secA" id="sec-a" class="reveal-section cblock" data-idx="0" :class="{ 'is-visible': visible[0] }">
          <ChartA :active="props.active && visible[0]" />
        </section>
        <section ref="secB" id="sec-b" class="reveal-section cblock" data-idx="1" :class="{ 'is-visible': visible[1] }">
          <ChartB :active="props.active && visible[1]" />
        </section>
        <section ref="secC" id="sec-c" class="reveal-section cblock" data-idx="2" :class="{ 'is-visible': visible[2] }">
          <ChartC :active="props.active && visible[2]" />
        </section>
        <section ref="secD" id="sec-d" class="reveal-section cblock" data-idx="3" :class="{ 'is-visible': visible[3] }">
          <ChartD :active="props.active && visible[3]" />
        </section>
      </section>

      <!-- ⑦  CTA FOOTER  ──────────────────────────────── -->
      <footer class="cta-footer reveal-on-scroll" aria-label="进入预测">
        <div class="cta-orb cta-o1"></div>
        <div class="cta-orb cta-o2"></div>
        <div class="cta-inner">
          <div class="cta-kicker">准备好了吗？</div>
          <h2>进入预测界面，开始轨迹仿真</h2>
          <p>输入扰动参数，查看 BASE 与 CNN 方法的轨迹、误差与控制力对比。</p>
          <button class="btn-p btn-lg" @click="emit('go-demo')">进入预测界面 →</button>
        </div>
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

const props = defineProps({ active: { type: Boolean, default: false } })
const emit = defineEmits(['go-demo'])

const tags = ['欠驱动无人船', '轨迹跟踪', '反步控制', '扰动观测器', '一维 CNN']

const heroStats = [
  { val: '20–36%', lab: '全程 RMS 降低' },
  { val: '60–91%', lab: '稳态 RMS 降低' },
  { val: '4 组', lab: '工况对比' },
]

const resultImages = [
  {
    src: '/second/first.png',
    label: '工况 A · Surge 通道残差降低',
    desc: 'DOB 残差减少率（Surge 通道）各模型对比，CNN 在 A2/B1 工况表现最优。',
  },
  {
    src: '/second/second.png',
    label: '工况 B · Yaw 通道残差降低',
    desc: 'DOB 残差减少率（Yaw 通道）各模型跨工况对比，整体改善稳定可靠。',
  },
  {
    src: '/second/third.png',
    label: '工况 C · 计算效率权衡',
    desc: 'CPU 推理时延与参数量散点图，CNN 达到最佳精度-效率权衡点。',
  },
  {
    src: '/second/forth.png',
    label: '工况 D · 预测相关性热图',
    desc: '主实验 Pearson 相关系数热图，CNN/MLP 在两通道均表现优异。',
  },
]

const baseTickerItems = [
  { val: '20%–36%', lab: '全程位置误差 RMS 降低' },
  { val: '60%–91%', lab: '稳态 RMS 降低' },
  { val: '4 组工况', lab: '全方位对比验证' },
  { val: '一维 CNN', lab: '时序残差学习' },
  { val: '收敛时间不变', lab: '稳定性保持' },
  { val: 'Lyapunov', lab: '稳定性框架完整保留' },
  { val: '控制能量', lab: '未显著增加' },
  { val: 'Fossen', lab: '船舶动力学建模' },
]
// triple for seamless scroll
const tickerAll = [...baseTickerItems, ...baseTickerItems, ...baseTickerItems]

// ── carousel (main)
const slideIdx = ref(0)
let slideTimer = null
function nextSlide() { slideIdx.value = (slideIdx.value + 1) % resultImages.length }
function prevSlide() { slideIdx.value = (slideIdx.value - 1 + resultImages.length) % resultImages.length }
function goToSlide(i) { slideIdx.value = i; resetSlideTimer() }
function resetSlideTimer() {
  clearInterval(slideTimer)
  slideTimer = setInterval(nextSlide, 4500)
}

// ── hero image cycle
const cycleIdx = ref(0)
let cycleTimer = null
function goToCycle(i) { cycleIdx.value = i }

// ── chart refs
const chartsSection = ref(null)
const secA = ref(null)
const secB = ref(null)
const secC = ref(null)
const secD = ref(null)
const visible = ref([false, false, false, false])

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
      }
    },
    { threshold: 0.3, root: null },
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
    { threshold: 0.1, root: null },
  )
  els.forEach((el) => revealObserver.observe(el))
}

function scrollToCharts() {
  chartsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollToA() { secA.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
function scrollToB() { secB.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
function scrollToC() { secC.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
function scrollToD() { secD.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

onMounted(() => {
  connectObserver()
  connectRevealObserver()
  slideTimer = setInterval(nextSlide, 4500)
  cycleTimer = setInterval(() => {
    cycleIdx.value = (cycleIdx.value + 1) % resultImages.length
  }, 3800)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
  revealObserver?.disconnect()
  revealObserver = null
  clearInterval(slideTimer)
  clearInterval(cycleTimer)
})
</script>

<style scoped>
/* ─── layout shell ─── */
.landing { width: 100%; }

.lm {
  width: min(96.25rem, calc(100vw - 1.75rem));
  margin: 0 auto;
  padding: 0.75rem 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ─── shared helpers ─── */
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(1.2rem);
  transition: opacity 0.75s ease var(--d, 0s), transform 0.75s ease var(--d, 0s);
}
.reveal-on-scroll.is-visible { opacity: 1; transform: translateY(0); }

.reveal-section {
  opacity: 0;
  transform: translateY(1rem);
  transition: opacity 0.65s ease, transform 0.65s ease;
}
.reveal-section.is-visible { opacity: 1; transform: translateY(0); }

.sec-hd { display: grid; gap: 0.375rem; }
.sec-tag {
  display: inline-flex;
  align-self: start;
  font-size: 0.6875rem;
  font-weight: 900;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  color: var(--blue-1, #2f73ff);
  background: rgba(47, 115, 255, 0.08);
  border: 0.0625rem solid rgba(47, 115, 255, 0.18);
  border-radius: 999rem;
  padding: 0.25rem 0.75rem;
}
.sec-hd h2 {
  margin: 0.25rem 0 0;
  font-size: 1.5rem;
  font-weight: 950;
  letter-spacing: 0.01rem;
  color: var(--text-1, #13356f);
}
.sec-hd p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--text-2, #5878ad);
  max-width: 52rem;
}

.btn-p {
  display: inline-flex;
  align-items: center;
  height: 2.75rem;
  padding: 0 1.25rem;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  font-weight: 950;
  font-size: 0.9rem;
  color: #fff;
  background: linear-gradient(135deg, #2f73ff, #49a7ff 65%, #7de6ff);
  box-shadow: 0 0.75rem 1.75rem rgba(47, 115, 255, 0.28);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-p:hover { transform: translateY(-0.175rem); box-shadow: 0 1rem 2rem rgba(47, 115, 255, 0.36); }

.btn-g {
  display: inline-flex;
  align-items: center;
  height: 2.75rem;
  padding: 0 1.25rem;
  border-radius: 1rem;
  cursor: pointer;
  font-weight: 900;
  font-size: 0.9rem;
  color: var(--text-2, #5878ad);
  border: 0.0625rem solid rgba(74, 129, 255, 0.22);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(0.5rem);
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.btn-g:hover { transform: translateY(-0.175rem); border-color: rgba(47, 115, 255, 0.4); }

.btn-lg { height: 3.25rem; padding: 0 2rem; font-size: 1rem; }

/* ─── ① HERO ─── */
.l-hero {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  background:
    radial-gradient(circle at 68% 40%, rgba(47, 115, 255, 0.10), transparent 38%),
    radial-gradient(circle at 10% 80%, rgba(125, 230, 255, 0.14), transparent 36%),
    linear-gradient(135deg, rgba(255,255,255,0.94), rgba(228,241,255,0.82));
  border: 0.0625rem solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2rem 5rem rgba(46, 109, 225, 0.13), 0 0.5rem 1.25rem rgba(46,109,225,0.07);
  display: grid;
  grid-template-columns: 1fr 0.88fr;
  align-items: center;
  gap: 0;
  min-height: 26rem;
}

.hero-orb {
  position: absolute;
  border-radius: 999rem;
  pointer-events: none;
}
.hero-o1 {
  width: min(20rem, 42vw); height: min(20rem, 42vw);
  background: radial-gradient(circle, rgba(72,163,255,0.28), transparent 70%);
  right: -5rem; top: -8rem;
  filter: blur(1.5rem);
}
.hero-o2 {
  width: min(14rem, 28vw); height: min(14rem, 28vw);
  background: radial-gradient(circle, rgba(125,230,255,0.22), transparent 70%);
  left: -4rem; bottom: -5rem;
  filter: blur(1.25rem);
}
.hero-o3 {
  width: min(8rem, 16vw); height: min(8rem, 16vw);
  background: radial-gradient(circle, rgba(47,115,255,0.18), transparent 70%);
  left: 42%; top: -2rem;
  filter: blur(1rem);
}

.hero-l {
  position: relative;
  z-index: 1;
  padding: 1.75rem 1.5rem 1.75rem 1.75rem;
  display: grid;
  gap: 1rem;
}

.kicker {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.09rem;
  text-transform: uppercase;
  color: var(--blue-1, #2f73ff);
}
.kicker-pip {
  display: inline-block;
  width: 0.5rem; height: 0.5rem;
  border-radius: 999rem;
  background: linear-gradient(135deg, #2f73ff, #7de6ff);
  box-shadow: 0 0 0.5rem rgba(47,115,255,0.5);
  animation: pip-pulse 2s ease-in-out infinite;
}
@keyframes pip-pulse {
  0%, 100% { box-shadow: 0 0 0.4rem rgba(47,115,255,0.5); }
  50%       { box-shadow: 0 0 1rem  rgba(47,115,255,0.85); }
}

.hero-h1 {
  margin: 0;
  font-size: clamp(1.5rem, 1.8vw + 0.9rem, 2.6rem);
  line-height: 1.06;
  font-weight: 950;
  color: var(--text-1, #13356f);
}
.h1-grd {
  background: linear-gradient(110deg, #2f73ff, #49a7ff 55%, #7de6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.72;
  color: var(--text-2, #5878ad);
  max-width: 38rem;
}

.hero-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.htag {
  font-size: 0.71875rem;
  font-weight: 900;
  color: var(--text-2, #5878ad);
  padding: 0.3rem 0.6rem;
  border-radius: 999rem;
  border: 0.0625rem solid rgba(74, 129, 255, 0.18);
  background: rgba(255, 255, 255, 0.65);
  transition: background 0.2s;
}
.htag:hover { background: rgba(255,255,255,0.9); }

.hero-btns { display: flex; flex-wrap: wrap; gap: 0.625rem; align-items: center; }

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.625rem;
}
.hst {
  padding: 0.75rem 0.875rem;
  border-radius: 1rem;
  border: 0.0625rem solid rgba(255,255,255,0.78);
  background: linear-gradient(160deg, rgba(255,255,255,0.88), rgba(234,244,255,0.72));
  box-shadow: 0 0.25rem 0.75rem rgba(46,109,225,0.08);
}
.hst-v { font-size: 1.1rem; font-weight: 950; color: var(--text-1, #13356f); }
.hst-l { font-size: 0.71875rem; color: var(--text-2, #5878ad); margin-top: 0.2rem; line-height: 1.4; }

/* right side image cycle */
.hero-r {
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 1.5rem 1.75rem 1.5rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-cycle {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 1.25rem;
  overflow: hidden;
  background: linear-gradient(145deg, rgba(221,240,255,0.95), rgba(183,219,255,0.88));
  border: 0.0625rem solid rgba(255,255,255,0.72);
  box-shadow:
    0 1.5rem 3.5rem rgba(47,115,255,0.15),
    0 0.25rem 0.75rem rgba(47,115,255,0.10),
    inset 0 0.0625rem 0 rgba(255,255,255,0.65);
}
.ic-item {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.9s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ic-item.active { opacity: 1; }
.ic-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0.75rem;
}
.ic-badge {
  position: absolute;
  bottom: 0.6rem;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.71875rem;
  font-weight: 900;
  color: rgba(19,53,111,0.88);
  background: rgba(255,255,255,0.82);
  backdrop-filter: blur(0.4rem);
  padding: 0.3rem 0.75rem;
  border-radius: 999rem;
  border: 0.0625rem solid rgba(74,129,255,0.14);
}
.ic-nav {
  position: absolute;
  top: 0.6rem;
  right: 0.75rem;
  display: flex;
  gap: 0.3rem;
  z-index: 2;
}
.ic-dot {
  width: 0.5rem; height: 0.5rem;
  border-radius: 999rem;
  border: none;
  cursor: pointer;
  background: rgba(47,115,255,0.25);
  transition: background 0.2s, transform 0.2s;
}
.ic-dot.active { background: #2f73ff; transform: scale(1.3); }

/* corner accents */
.ic-corner {
  position: absolute;
  width: 1.5rem; height: 1.5rem;
  border-color: rgba(47,115,255,0.4);
  border-style: solid;
  pointer-events: none;
  z-index: 3;
}
.ic-corner-tl { top: 0.6rem; left: 0.6rem; border-width: 0.15rem 0 0 0.15rem; border-radius: 0.375rem 0 0 0; }
.ic-corner-br { bottom: 0.6rem; right: 0.6rem; border-width: 0 0.15rem 0.15rem 0; border-radius: 0 0 0.375rem 0; }

/* ─── ② TICKER ─── */
.ticker-wrap {
  overflow: hidden;
  border-radius: 1rem;
  background: linear-gradient(90deg, rgba(19,53,111,0.94), rgba(30,70,160,0.92));
  border: 0.0625rem solid rgba(47,115,255,0.3);
  padding: 0.7rem 0;
  position: relative;
}
.ticker-wrap::before,
.ticker-wrap::after {
  content: "";
  position: absolute;
  top: 0; bottom: 0;
  width: 3rem;
  z-index: 1;
  pointer-events: none;
}
.ticker-wrap::before { left: 0; background: linear-gradient(90deg, rgba(19,53,111,0.94), transparent); }
.ticker-wrap::after  { right: 0; background: linear-gradient(270deg, rgba(19,53,111,0.94), transparent); }

.ticker-track {
  display: flex;
  gap: 0;
  white-space: nowrap;
  animation: ticker-scroll 38s linear infinite;
}
@keyframes ticker-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-33.333%); }
}
.ti {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0 1.25rem;
  font-size: 0.8125rem;
  color: rgba(200,220,255,0.92);
}
.ti b { color: #fff; font-weight: 950; font-size: 0.875rem; }
.ti-sep { color: rgba(73,167,255,0.7); margin-left: 0.5rem; font-size: 0.6rem; }

/* ─── ③ PIPELINE ─── */
.pipe-sec {
  border-radius: 1.375rem;
  border: 0.0625rem solid rgba(255,255,255,0.72);
  background: linear-gradient(160deg, rgba(255,255,255,0.88), rgba(234,243,255,0.78));
  box-shadow: 0 1rem 2.5rem rgba(67,116,212,0.09);
  padding: 1.5rem 1.5rem 1.625rem;
  display: grid;
  gap: 1.25rem;
  /* override faster reveal for parent so children dominate */
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.pipe-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pipe-node {
  flex: 1;
  position: relative;
  border-radius: 1.125rem;
  padding: 1.125rem 1.125rem 1rem;
  border: 0.0625rem solid rgba(74,129,255,0.14);
  background: rgba(255,255,255,0.72);
  box-shadow: 0 0.5rem 1.5rem rgba(67,116,212,0.07);
  overflow: hidden;
  transition: transform 0.28s ease, box-shadow 0.28s ease;
}
.pipe-node:hover { transform: translateY(-0.25rem); box-shadow: 0 1rem 2rem rgba(67,116,212,0.13); }

/* stagger via parent is-visible */
.stagger-c {
  opacity: 0;
  transform: translateY(1.5rem);
  transition: opacity 0.65s ease var(--d, 0s), transform 0.65s ease var(--d, 0s);
}
.pipe-sec.is-visible .stagger-c { opacity: 1; transform: translateY(0); }

.pn-num {
  position: absolute;
  top: 0.5rem; right: 0.75rem;
  font-size: 2.5rem;
  font-weight: 950;
  color: rgba(47,115,255,0.06);
  line-height: 1;
}
.pn-icon {
  width: 2.75rem; height: 2.75rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}
.pn-icon svg { width: 1.75rem; height: 1.75rem; }

.pn1 .pn-icon { background: rgba(47,115,255,0.1); color: #2f73ff; }
.pn2 .pn-icon { background: rgba(73,167,255,0.1); color: #49a7ff; }
.pn3 .pn-icon { background: rgba(125,230,255,0.16); color: #3ab8f0; }

.pipe-node h3 {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 950;
  color: var(--text-1, #13356f);
}
.pipe-node p {
  margin: 0.4rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.68;
  color: var(--text-2, #5878ad);
}

.pipe-arr {
  flex-shrink: 0;
  color: rgba(47,115,255,0.35);
  width: 3.5rem;
}
.pipe-arr svg { width: 100%; display: block; }

/* ─── ④ CONTRIBUTIONS ─── */
.contrib-sec {
  display: grid;
  gap: 1rem;
}
.contrib-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.875rem;
}
.cc {
  position: relative;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 0.0625rem solid rgba(255,255,255,0.72);
  background: linear-gradient(160deg, rgba(255,255,255,0.92), rgba(234,243,255,0.76));
  box-shadow: 0 1rem 2.5rem rgba(67,116,212,0.09);
  padding: 1.5rem 1.25rem 1.25rem;
  transition:
    opacity 0.75s ease var(--d, 0s),
    transform 0.75s ease var(--d, 0s),
    box-shadow 0.28s ease;
}
.cc:hover { box-shadow: 0 1.5rem 3.5rem rgba(67,116,212,0.14); }
.cc-bg-num {
  position: absolute;
  right: -0.5rem; top: -0.5rem;
  font-size: 5.5rem;
  font-weight: 950;
  line-height: 1;
  color: rgba(47,115,255,0.055);
  user-select: none;
  pointer-events: none;
}
.cc h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 950;
  color: var(--text-1, #13356f);
  position: relative;
}
.cc h3::before {
  content: "";
  display: block;
  width: 1.75rem; height: 0.1875rem;
  border-radius: 999rem;
  background: linear-gradient(90deg, #2f73ff, #7de6ff);
  margin-bottom: 0.625rem;
}
.cc p {
  margin: 0.5rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.72;
  color: var(--text-2, #5878ad);
  position: relative;
}

/* ─── ⑤ CAROUSEL ─── */
.car-sec {
  border-radius: 1.375rem;
  border: 0.0625rem solid rgba(255,255,255,0.72);
  background: linear-gradient(160deg, rgba(255,255,255,0.88), rgba(234,243,255,0.78));
  box-shadow: 0 1rem 2.5rem rgba(67,116,212,0.09);
  padding: 1.5rem 1.5rem 1.25rem;
  display: grid;
  gap: 1.125rem;
}

.car-box {
  position: relative;
  display: grid;
  grid-template-columns: 2.5rem 1fr 2.5rem;
  align-items: center;
  gap: 0.625rem;
}
.car-arr {
  width: 2.5rem; height: 2.5rem;
  border-radius: 999rem;
  border: 0.0625rem solid rgba(74,129,255,0.2);
  background: rgba(255,255,255,0.8);
  color: var(--text-2, #5878ad);
  font-size: 1.375rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, background 0.2s;
  flex-shrink: 0;
}
.car-arr:hover { background: #fff; transform: scale(1.12); color: var(--blue-1, #2f73ff); }

.car-vp {
  overflow: hidden;
  border-radius: 1rem;
  border: 0.0625rem solid rgba(74,129,255,0.12);
  background: rgba(255,255,255,0.5);
}
.car-track {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.77, 0, 0.175, 1);
}
.car-slide {
  flex: 0 0 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: stretch;
}
.cs-img {
  background: linear-gradient(145deg, rgba(221,240,255,0.9), rgba(183,219,255,0.85));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  min-height: min(18rem, 38vh);
}
.cs-img img {
  max-width: 100%;
  max-height: min(16rem, 35vh);
  object-fit: contain;
  border-radius: 0.5rem;
}
.cs-info {
  width: min(16rem, 26vw);
  padding: 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.625rem;
  border-left: 0.0625rem solid rgba(74,129,255,0.1);
  background: rgba(255,255,255,0.5);
}
.cs-idx {
  font-size: 3rem;
  font-weight: 950;
  line-height: 1;
  color: rgba(47,115,255,0.14);
}
.cs-title {
  font-size: 1rem;
  font-weight: 950;
  color: var(--text-1, #13356f);
  line-height: 1.35;
}
.cs-desc {
  font-size: 0.8125rem;
  line-height: 1.7;
  color: var(--text-2, #5878ad);
}

.car-inds {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.car-ind {
  height: 2.125rem;
  padding: 0 0.75rem;
  border-radius: 999rem;
  border: 0.0625rem solid rgba(74,129,255,0.16);
  background: rgba(255,255,255,0.62);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 900;
  color: var(--text-2, #5878ad);
  transition: 0.2s ease;
}
.car-ind:hover { border-color: rgba(47,115,255,0.32); }
.car-ind.active {
  background: linear-gradient(135deg, #2f73ff, #49a7ff);
  border-color: transparent;
  color: #fff;
}
.car-ind span { pointer-events: none; }

.car-progress {
  height: 0.1875rem;
  border-radius: 999rem;
  background: rgba(47,115,255,0.1);
  overflow: hidden;
}
.car-prog-bar {
  height: 100%;
  border-radius: 999rem;
  background: linear-gradient(90deg, #2f73ff, #7de6ff);
  transition: width 0.6s cubic-bezier(0.77, 0, 0.175, 1);
}

/* ─── ⑥ CHARTS ─── */
.charts-sec {
  border-radius: 1.375rem;
  border: 0.0625rem solid rgba(255,255,255,0.72);
  background: linear-gradient(160deg, rgba(255,255,255,0.86), rgba(234,243,255,0.76));
  box-shadow: 0 1rem 2.5rem rgba(67,116,212,0.08);
  padding: 1.5rem 1.5rem 1.375rem;
  display: grid;
  gap: 1rem;
}
.cblock { margin: 0; }

/* ─── ⑦ CTA FOOTER ─── */
.cta-footer {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  background: linear-gradient(135deg, #1a3a8c, #2052c8 45%, #1e75e0 75%, #34a8f5);
  box-shadow: 0 2rem 5rem rgba(30,75,224,0.28), 0 0.5rem 1.25rem rgba(30,75,224,0.15);
  padding: 2.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cta-orb {
  position: absolute;
  border-radius: 999rem;
  pointer-events: none;
}
.cta-o1 {
  width: min(22rem, 46vw); height: min(22rem, 46vw);
  background: radial-gradient(circle, rgba(125,230,255,0.22), transparent 70%);
  right: -6rem; top: -8rem;
  filter: blur(1.5rem);
}
.cta-o2 {
  width: min(16rem, 32vw); height: min(16rem, 32vw);
  background: radial-gradient(circle, rgba(47,115,255,0.28), transparent 70%);
  left: -5rem; bottom: -5rem;
  filter: blur(1.25rem);
}
.cta-inner {
  position: relative;
  z-index: 1;
  text-align: center;
  display: grid;
  gap: 0.875rem;
  justify-items: center;
}
.cta-kicker {
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  color: rgba(180,215,255,0.9);
}
.cta-inner h2 {
  margin: 0;
  font-size: clamp(1.25rem, 1.5vw + 0.8rem, 2rem);
  font-weight: 950;
  color: #fff;
}
.cta-inner p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.7;
  color: rgba(180,215,255,0.88);
  max-width: 36rem;
}
.cta-footer .btn-p {
  background: rgba(255,255,255,0.15);
  border: 0.0625rem solid rgba(255,255,255,0.32);
  backdrop-filter: blur(0.5rem);
  color: #fff;
  box-shadow: 0 0.5rem 1.5rem rgba(0,0,20,0.18);
}
.cta-footer .btn-p:hover { background: rgba(255,255,255,0.26); box-shadow: 0 1rem 2rem rgba(0,0,20,0.24); }

/* ─── RESPONSIVE ─── */
@media (max-width: 64rem) {
  .lm { width: min(100%, calc(100vw - 1rem)); }

  .l-hero { grid-template-columns: 1fr; }
  .hero-r { height: min(22rem, 60vw); padding: 0 1.25rem 1.25rem; }
  .img-cycle { aspect-ratio: auto; height: 100%; }

  .pipe-row { flex-direction: column; }
  .pipe-arr { transform: rotate(90deg); width: 2.5rem; }
  .pipe-node { width: 100%; }

  .contrib-row { grid-template-columns: 1fr; }

  .car-slide { grid-template-columns: 1fr; }
  .cs-info { width: 100%; border-left: none; border-top: 0.0625rem solid rgba(74,129,255,0.1); }
  .cs-img { min-height: min(14rem, 50vw); }

  .hero-stats { grid-template-columns: 1fr 1fr 1fr; }
}

@media (max-width: 40rem) {
  .hero-stats { grid-template-columns: 1fr; }
  .car-inds { display: none; }
}
</style>
