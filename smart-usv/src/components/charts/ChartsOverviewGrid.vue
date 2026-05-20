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
          <div class="kicker">
            <span class="kicker-pip"></span>欠驱动 USV · 抗扰轨迹跟踪
          </div>
          <h1 class="hero-h1">
            模型驱动<br />
            <span class="h1-grd">+ 一维 CNN</span><br />
            残差学习补偿
          </h1>
          <p class="hero-sub">
            针对强时变扰动下 USV 轨迹跟踪精度下降问题，提出 DOB 与一维 CNN
            相结合的辅助补偿策略，在不改变 Lyapunov
            稳定性框架的前提下显著提升扰动抑制能力。
          </p>
          <div class="hero-tags">
            <span v-for="t in tags" :key="t" class="htag">{{ t }}</span>
          </div>
          <div class="hero-btns">
            <button class="btn-p" @click="emit('go-demo')">
              进入预测界面 →
            </button>
            <button class="btn-g" @click="scrollToCharts">查看仿真结果</button>
          </div>
          <div class="hero-stats">
            <div class="hst" v-for="s in heroStats" :key="s.val">
              <div class="hst-v">{{ s.val }}</div>
              <div class="hst-l">{{ s.lab }}</div>
            </div>
          </div>
        </div>
      </header>

      <!-- ②  TICKER BAR  ──────────────────────────────── -->
      <div class="ticker-wrap reveal-on-scroll">
        <div class="ticker-track">
          <span v-for="(t, i) in tickerAll" :key="i" class="ti">
            <b>{{ t.val }}</b
            >&nbsp;{{ t.lab }}<span class="ti-sep">✦</span>
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
          <div class="pipe-node pn1 stagger-c" style="--d: 0s">
            <div class="pn-num">01</div>
            <div class="pn-icon">
              <svg viewBox="0 0 48 48" fill="none">
                <circle
                  cx="24"
                  cy="24"
                  r="19"
                  stroke="currentColor"
                  stroke-width="2.5"
                />
                <path
                  d="M16 24h16M24 16l8 8-8 8"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h3>动力学建模</h3>
            <p>Fossen 船舶模型，明确欠驱动约束与时变扰动特征分布。</p>
          </div>
          <div class="pipe-arr">
            <svg viewBox="0 0 64 16" fill="none">
              <path
                d="M2 8h60M56 2l6 6-6 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="pipe-node pn2 stagger-c" style="--d: 0.18s">
            <div class="pn-num">02</div>
            <div class="pn-icon">
              <svg viewBox="0 0 48 48" fill="none">
                <rect
                  x="8"
                  y="8"
                  width="32"
                  height="32"
                  rx="8"
                  stroke="currentColor"
                  stroke-width="2.5"
                />
                <path
                  d="M16 24h16M24 16v16"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <h3>反步法 + DOB</h3>
            <p>
              设计主控制律，扰动观测器实时估计并补偿未知扰动，保证 Lyapunov
              稳定。
            </p>
          </div>
          <div class="pipe-arr">
            <svg viewBox="0 0 64 16" fill="none">
              <path
                d="M2 8h60M56 2l6 6-6 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="pipe-node pn3 stagger-c" style="--d: 0.36s">
            <div class="pn-num">03</div>
            <div class="pn-icon">
              <svg viewBox="0 0 48 48" fill="none">
                <path
                  d="M8 36l7-14 6 10 5-20 6 15 5-8 3 8"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h3>CNN 残差学习</h3>
            <p>
              一维 CNN 学习 DOB
              观测残差，辅助补偿项叠加至控制输入，提升抗扰精度。
            </p>
          </div>
        </div>
      </section>

      <!-- ④  CONTRIBUTIONS  ────────────────────────────── -->
      <section class="contrib-sec" aria-label="主要贡献">
        <div class="sec-hd reveal-on-scroll">
          <div class="sec-tag">主要贡献</div>
          <h2>三项核心创新</h2>
          <p>
            在不破坏闭环稳定性的前提下，完成精度的结构内优化，无需增加控制代价。
          </p>
        </div>
        <div class="contrib-row">
          <article class="cc reveal-on-scroll" style="--d: 0s">
            <div class="cc-bg-num">01</div>
            <h3>残差学习补偿机制</h3>
            <p>
              在反步控制 + DOB 框架内，引入一维 CNN
              学习观测残差，输出作为辅助补偿项叠加到控制输入，不替代原有控制结构。
            </p>
          </article>
          <article class="cc reveal-on-scroll" style="--d: 0.12s">
            <div class="cc-bg-num">02</div>
            <h3>时变扰动适应能力增强</h3>
            <p>
              利用一维 CNN 的时序特征提取优势，更精准估计残差，全程 RMS 降低
              20%–36%，稳态 RMS 降低 60%–91%，效果显著。
            </p>
          </article>
          <article class="cc reveal-on-scroll" style="--d: 0.24s">
            <div class="cc-bg-num">03</div>
            <h3>性能提升不增加控制代价</h3>
            <p>
              最大误差与收敛时间基本不变，控制输入幅值未显著增大，实现结构内"精修补偿"，保持闭环稳定性。
            </p>
          </article>
        </div>
      </section>

      <!-- ⑤  CAROUSEL  ────────────────────────────────── -->
      <section class="car-sec reveal-on-scroll" aria-label="对比工况">
        <div class="sec-hd">
          <div class="sec-tag">对比工况</div>
          <h2>四组对比图</h2>
          <p>
            扰动频率变化、参数变化与噪声叠加等多场景下的系统性验证，涵盖两通道性能与计算效率。
          </p>
        </div>

        <div class="car-box">
          <button class="car-arr car-l" @click="prevSlide" aria-label="上一张">
            ‹
          </button>
          <div class="car-vp">
            <div
              class="car-track"
              :style="{ transform: `translateX(-${slideIdx * 100}%)` }"
            >
              <div class="car-slide" v-for="(img, i) in resultImages" :key="i">
                <div class="cs-img">
                  <img :src="img.src" :alt="img.label" />
                </div>
                <div class="cs-info">
                  <div class="cs-idx">{{ String(i + 1).padStart(2, "0") }}</div>
                  <div class="cs-text">
                    <div class="cs-title">{{ img.label }}</div>
                    <div class="cs-desc">{{ img.desc }}</div>
                  </div>
                  <img
                    v-if="img.legend"
                    :src="img.legend"
                    alt="颜色参考"
                    class="cs-legend"
                  />
                </div>
              </div>
            </div>
          </div>
          <button class="car-arr car-r" @click="nextSlide" aria-label="下一张">
            ›
          </button>
        </div>

        <div class="car-inds">
          <button
            v-for="(img, i) in resultImages"
            :key="i"
            class="car-ind"
            :class="{ active: i === slideIdx }"
            @click="goToSlide(i)"
          >
            <span>{{ img.label }}</span>
          </button>
        </div>
        <!-- progress bar -->
        <div class="car-progress">
          <div
            class="car-prog-bar"
            :style="{
              width: `${((slideIdx + 1) / resultImages.length) * 100}%`,
            }"
          ></div>
        </div>
      </section>

      <!-- ⑤.5  系统技术架构展示  ───────────────────────── -->
      <section class="arch-sec reveal-on-scroll" aria-label="系统技术架构">
        <div class="sec-hd">
          <div class="sec-tag">系统架构</div>
          <h2>系统技术构架图</h2>
          <p>强时变扰动下欠驱动无人船高精度轨迹跟踪的完整技术架构，实现了高稳定性与泛化性的自主航行控制</p>
        </div>

        <div class="arch-body">
          <!-- 左侧：四层模块 -->
          <div class="arch-layers">
            <div class="arch-layer reveal-on-scroll" style="--d:0.05s">
              <div class="layer-label">
                <span class="layer-icon layer-icon-1"></span>
                感知<br/>数据
              </div>
              <div class="layer-content">
                <div class="layer-tags">
                  <span class="ltag ltag-blue">多源传感器数据采集</span>
                  <span class="ltag ltag-blue-light">环境与状态感知</span>
                </div>
                <div class="layer-bullets">
                  <span class="lbullet">● 采集USV位置</span>
                  <span class="lbullet">● 多源异构数据同步</span>
                </div>
              </div>
            </div>

            <div class="arch-layer reveal-on-scroll" style="--d:0.12s">
              <div class="layer-label">
                <span class="layer-icon layer-icon-2"></span>
                一维<br/>CNN<br/>模型
              </div>
              <div class="layer-content">
                <div class="layer-tags">
                  <span class="ltag ltag-purple">PyTorch深度学习框架</span>
                  <span class="ltag ltag-purple-light">DOB观测误差修正</span>
                </div>
                <div class="layer-bullets">
                  <span class="lbullet">● 强时变扰动自适应补偿</span>
                  <span class="lbullet">● 稳定性</span>
                </div>
              </div>
            </div>

            <div class="arch-layer reveal-on-scroll" style="--d:0.19s">
              <div class="layer-label">
                <span class="layer-icon layer-icon-3"></span>
                控制<br/>算法
              </div>
              <div class="layer-content">
                <div class="layer-tags">
                  <span class="ltag ltag-teal">反步控制+DOB观测器</span>
                  <span class="ltag ltag-teal-light">鲁棒控制框架</span>
                </div>
                <div class="layer-bullets">
                  <span class="lbullet">● 李雅普诺夫稳定保障</span>
                  <span class="lbullet">● 扰动估计</span>
                </div>
                <div class="layer-tags" style="margin-top:0.375rem">
                  <span class="ltag ltag-teal">轨迹跟踪闭环系统</span>
                  <span class="ltag ltag-teal-light">自主航行核心</span>
                </div>
                <div class="layer-bullets">
                  <span class="lbullet">● 强时变扰动下高精度跟踪</span>
                  <span class="lbullet">● 泛化性强</span>
                </div>
              </div>
            </div>

            <div class="arch-layer reveal-on-scroll" style="--d:0.26s">
              <div class="layer-label">
                <span class="layer-icon layer-icon-4"></span>
                嵌入<br/>式部<br/>署
              </div>
              <div class="layer-content">
                <div class="layer-tags">
                  <span class="ltag ltag-green">仿真与实船验证</span>
                  <span class="ltag ltag-green-light">系统性能测试</span>
                </div>
                <div class="layer-bullets">
                  <span class="lbullet">● 多工况对比实验</span>
                </div>
                <div class="layer-tags" style="margin-top:0.375rem">
                  <span class="ltag ltag-green">岸基监控平台</span>
                  <span class="ltag ltag-green-light">远程状态监控</span>
                </div>
                <div class="layer-bullets">
                  <span class="lbullet">● 轨迹可视化</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：系统技术构架流程图 -->
          <div class="arch-diagram reveal-on-scroll" style="--d:0.1s">
            <div class="diag-title">系统技术构架图</div>
            <div class="diag-body">
              <!-- 三列：系统模型 / 一维CNN补偿 / 实验结果 -->
              <div class="diag-col">
                <div class="diag-col-hd diag-hd-blue">系统模型</div>
                <div class="diag-block diag-red">Fossen<br/>三自由度<br/>模型</div>
                <div class="diag-arrow-down"></div>
                <div class="diag-block diag-orange">欠驱动</div>
                <div class="diag-arrow-down"></div>
                <div class="diag-block diag-yellow">外部扰动<br/>有界</div>
                <div class="diag-arrow-down"></div>
                <div class="diag-block diag-green-light">李雅诺夫<br/>稳定</div>
              </div>

              <div class="diag-col diag-col-mid">
                <div class="diag-col-hd diag-hd-blue">一维CNN补偿</div>
                <div class="diag-row-group">
                  <div class="diag-sm-block">核心控制器</div>
                </div>
                <div class="diag-row-group">
                  <div class="diag-sm-block">反步控制</div>
                  <div class="diag-sm-block">DOB</div>
                  <div class="diag-sm-block diag-sm-blue">一维CNN</div>
                </div>
                <div class="diag-arrow-down"></div>
                <div class="diag-row-group">
                  <div class="diag-sm-block diag-sm-yellow">残差学习、辅助学习</div>
                </div>
                <div class="diag-row-group">
                  <div class="diag-sm-block diag-sm-yellow">欠驱动USV</div>
                  <div class="diag-sm-block diag-sm-yellow">强时变扰动</div>
                </div>
                <div class="diag-row-group">
                  <div class="diag-sm-block diag-sm-yellow">DOB观测残差大、稳态误差高</div>
                </div>
                <div class="diag-row-group">
                  <div class="diag-sm-block diag-sm-yellow">模型不确定性</div>
                  <div class="diag-sm-block diag-sm-yellow">环境干扰</div>
                  <div class="diag-sm-block diag-sm-yellow">传感器噪声</div>
                </div>
                <div class="diag-arrow-down"></div>
                <div class="diag-data-box">
                  <div class="data-in">
                    <div class="data-label">数据<br/>输入</div>
                    <div class="data-items">
                      <div class="di">特征提取</div>
                      <div class="di">误差反馈</div>
                      <div class="di">参数更新</div>
                    </div>
                  </div>
                </div>
                <div class="diag-arrow-down"></div>
                <div class="diag-row-group">
                  <div class="diag-sm-block diag-sm-green">控制输出</div>
                  <div class="diag-sm-block diag-sm-green">状态估计</div>
                </div>
                <div class="diag-row-group">
                  <div class="diag-sm-block diag-sm-green">状态估计</div>
                  <div class="diag-sm-block diag-sm-green">误差修正</div>
                </div>
              </div>

              <div class="diag-col">
                <div class="diag-col-hd diag-hd-blue">实验结果</div>
                <div class="diag-result diag-result-red">RMS降<br/>低20-<br/>36%</div>
                <div class="diag-result diag-result-yellow" style="margin-top:1.5rem">稳态误差<br/>降低60-<br/>91%</div>
                <div class="diag-result diag-result-orange" style="margin-top:1.5rem">控制能力<br/>不增加</div>
                <div class="diag-result diag-result-green" style="margin-top:1rem">闭合有<br/>界、CNN<br/>不破坏</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部总结条 -->
        <div class="arch-footer reveal-on-scroll" style="--d:0.3s">
          强时变扰动下欠驱动无人船高精度轨迹跟踪的完整技术架构，实现了高稳定性与泛化性的自主航行控制
        </div>
      </section>

      <!-- ⑥  CHARTS  ──────────────────────────────────── -->
      <section class="charts-sec" ref="chartsSection" aria-label="仿真图表">
        <div class="sec-hd reveal-on-scroll">
          <div class="sec-tag">仿真结果</div>
          <h2>总览图表</h2>
          <p>滚动到对应模块，图表自动逐个渲染。</p>
        </div>
        <section
          ref="secA"
          id="sec-a"
          class="reveal-section cblock"
          data-idx="0"
          :class="{ 'is-visible': visible[0] }"
        >
          <ChartA :active="props.active && visible[0]" />
        </section>
        <section
          ref="secB"
          id="sec-b"
          class="reveal-section cblock"
          data-idx="1"
          :class="{ 'is-visible': visible[1] }"
        >
          <ChartB :active="props.active && visible[1]" />
        </section>
        <section
          ref="secC"
          id="sec-c"
          class="reveal-section cblock"
          data-idx="2"
          :class="{ 'is-visible': visible[2] }"
        >
          <ChartC :active="props.active && visible[2]" />
        </section>
        <section
          ref="secD"
          id="sec-d"
          class="reveal-section cblock"
          data-idx="3"
          :class="{ 'is-visible': visible[3] }"
        >
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
          <button class="btn-p btn-lg" @click="emit('go-demo')">
            进入预测界面 →
          </button>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import ChartA from "./ChartA.vue";
import ChartB from "./ChartB.vue";
import ChartC from "./ChartC.vue";
import ChartD from "./ChartD.vue";

const props = defineProps({ active: { type: Boolean, default: false } });
const emit = defineEmits(["go-demo"]);

const tags = ["欠驱动无人船", "轨迹跟踪", "反步控制", "扰动观测器", "一维 CNN"];

const heroStats = [
  { val: "20–36%", lab: "全程 RMS 降低" },
  { val: "60–91%", lab: "稳态 RMS 降低" },
  { val: "4 组", lab: "工况对比" },
];

const resultImages = [
  {
    src: "/second/one.png",
    label: "工况 A · Surge 通道残差降低",
    desc: "DOB 残差减少率（Surge 通道）各模型对比，CNN 在 A2/B1 工况表现最优。",
    legend: "/second/柱状图颜色参考.png",
  },
  {
    src: "/second/two.png",
    label: "工况 B · Yaw 通道残差降低",
    desc: "DOB 残差减少率（Yaw 通道）各模型跨工况对比，整体改善稳定可靠。",
    legend: "/second/柱状图颜色参考.png",
  },
  {
    src: "/second/three.png",
    label: "工况 C · 计算效率权衡",
    desc: "CPU 推理时延与参数量散点图，CNN 达到最佳精度-效率权衡点。",
  },
  {
    src: "/second/four.png",
    label: "工况 D · 预测相关性热图",
    desc: "主实验 Pearson 相关系数热图，CNN/MLP 在两通道均表现优异。",
  },
];

const baseTickerItems = [
  { val: "20%–36%", lab: "全程位置误差 RMS 降低" },
  { val: "60%–91%", lab: "稳态 RMS 降低" },
  { val: "4 组工况", lab: "全方位对比验证" },
  { val: "一维 CNN", lab: "时序残差学习" },
  { val: "收敛时间不变", lab: "稳定性保持" },
  { val: "Lyapunov", lab: "稳定性框架完整保留" },
  { val: "控制能量", lab: "未显著增加" },
  { val: "Fossen", lab: "船舶动力学建模" },
];
// triple for seamless scroll
const tickerAll = [...baseTickerItems, ...baseTickerItems, ...baseTickerItems];

// ── carousel (main)
const slideIdx = ref(0);
let slideTimer = null;
function nextSlide() {
  slideIdx.value = (slideIdx.value + 1) % resultImages.length;
}
function prevSlide() {
  slideIdx.value =
    (slideIdx.value - 1 + resultImages.length) % resultImages.length;
}
function goToSlide(i) {
  slideIdx.value = i;
  resetSlideTimer();
}
function resetSlideTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, 4500);
}

// ── chart refs
const chartsSection = ref(null);
const secA = ref(null);
const secB = ref(null);
const secC = ref(null);
const secD = ref(null);
const visible = ref([false, false, false, false]);

let observer = null;
let revealObserver = null;

function connectObserver() {
  const targets = [
    { idx: 0, el: secA.value },
    { idx: 1, el: secB.value },
    { idx: 2, el: secC.value },
    { idx: 3, el: secD.value },
  ].filter((t) => t.el);
  if (!targets.length) return;
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const idx = Number(entry.target?.dataset?.idx);
        if (!Number.isFinite(idx) || idx < 0 || idx > 3) continue;
        visible.value[idx] = true;
      }
    },
    { threshold: 0.3, root: null },
  );
  targets.forEach((t) => observer.observe(t.el));
}

function connectRevealObserver() {
  const els = Array.from(document.querySelectorAll(".reveal-on-scroll"));
  if (!els.length) return;
  revealObserver?.disconnect();
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        revealObserver?.unobserve(entry.target);
      }
    },
    { threshold: 0.1, root: null },
  );
  els.forEach((el) => revealObserver.observe(el));
}

function scrollToCharts() {
  chartsSection.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToA() {
  secA.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}
function scrollToB() {
  secB.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}
function scrollToC() {
  secC.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}
function scrollToD() {
  secD.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}

onMounted(() => {
  connectObserver();
  connectRevealObserver();
  slideTimer = setInterval(nextSlide, 4500);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
  revealObserver?.disconnect();
  revealObserver = null;
  clearInterval(slideTimer);
});
</script>

<style scoped>
/* ─── layout shell ─── */
.landing {
  width: 100%;
}

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
  transition:
    opacity 0.75s ease var(--d, 0s),
    transform 0.75s ease var(--d, 0s);
}
.reveal-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.reveal-section {
  opacity: 0;
  transform: translateY(1rem);
  transition:
    opacity 0.65s ease,
    transform 0.65s ease;
}
.reveal-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.sec-hd {
  display: grid;
  gap: 0.375rem;
}
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
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.btn-p:hover {
  transform: translateY(-0.175rem);
  box-shadow: 0 1rem 2rem rgba(47, 115, 255, 0.36);
}

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
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}
.btn-g:hover {
  transform: translateY(-0.175rem);
  border-color: rgba(47, 115, 255, 0.4);
}

.btn-lg {
  height: 3.25rem;
  padding: 0 2rem;
  font-size: 1rem;
}

/* ─── ① HERO ─── */
.l-hero {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  background:
    radial-gradient(
      circle at 68% 40%,
      rgba(47, 115, 255, 0.1),
      transparent 38%
    ),
    radial-gradient(
      circle at 10% 80%,
      rgba(125, 230, 255, 0.14),
      transparent 36%
    ),
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.94),
      rgba(228, 241, 255, 0.82)
    );
  border: 0.0625rem solid rgba(255, 255, 255, 0.8);
  box-shadow:
    0 2rem 5rem rgba(46, 109, 225, 0.13),
    0 0.5rem 1.25rem rgba(46, 109, 225, 0.07);
  min-height: 26rem;
  display: flex;
  align-items: center;
}

.hero-orb {
  position: absolute;
  border-radius: 999rem;
  pointer-events: none;
}
.hero-o1 {
  width: min(20rem, 42vw);
  height: min(20rem, 42vw);
  background: radial-gradient(
    circle,
    rgba(72, 163, 255, 0.28),
    transparent 70%
  );
  right: -5rem;
  top: -8rem;
  filter: blur(1.5rem);
}
.hero-o2 {
  width: min(14rem, 28vw);
  height: min(14rem, 28vw);
  background: radial-gradient(
    circle,
    rgba(125, 230, 255, 0.22),
    transparent 70%
  );
  left: -4rem;
  bottom: -5rem;
  filter: blur(1.25rem);
}
.hero-o3 {
  width: min(8rem, 16vw);
  height: min(8rem, 16vw);
  background: radial-gradient(
    circle,
    rgba(47, 115, 255, 0.18),
    transparent 70%
  );
  left: 42%;
  top: -2rem;
  filter: blur(1rem);
}

.hero-l {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 4rem;
  display: grid;
  gap: 1rem;
}

.kicker {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.18rem;
  text-transform: uppercase;
  color: var(--blue-1, #2f73ff);
}
.kicker-pip {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999rem;
  background: linear-gradient(135deg, #2f73ff, #7de6ff);
  box-shadow: 0 0 0.5rem rgba(47, 115, 255, 0.5);
  animation: pip-pulse 2s ease-in-out infinite;
}
@keyframes pip-pulse {
  0%,
  100% {
    box-shadow: 0 0 0.4rem rgba(47, 115, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 1rem rgba(47, 115, 255, 0.85);
  }
}

.hero-h1 {
  margin: 0;
  font-size: clamp(1.8rem, 2.2vw + 1rem, 3rem);
  line-height: 1.25;
  font-weight: 950;
  letter-spacing: 0.06em;
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
  font-size: 1rem;
  line-height: 1.8;
  letter-spacing: 0.04em;
  color: var(--text-2, #5878ad);
  max-width: 52rem;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.htag {
  font-size: 0.71875rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: var(--text-2, #5878ad);
  padding: 0.3rem 0.6rem;
  border-radius: 999rem;
  border: 0.0625rem solid rgba(74, 129, 255, 0.18);
  background: rgba(255, 255, 255, 0.65);
  transition: background 0.2s;
}
.htag:hover {
  background: rgba(255, 255, 255, 0.9);
}

.hero-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}
.hst {
  padding: 0.75rem 1.25rem;
  border-radius: 1.25rem;
  border: 0.0625rem solid rgba(255, 255, 255, 0.78);
  background: linear-gradient(
    160deg,
    rgba(255, 255, 255, 0.88),
    rgba(234, 244, 255, 0.72)
  );
  box-shadow: 0 0.25rem 0.75rem rgba(46, 109, 225, 0.08);
}
.hst-v {
  font-size: 1.25rem;
  font-weight: 950;
  letter-spacing: 0.04em;
  color: var(--text-1, #13356f);
}
.hst-l {
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  color: var(--text-2, #5878ad);
  margin-top: 0.25rem;
  line-height: 1.5;
}

/* ─── ② TICKER ─── */
.ticker-wrap {
  overflow: hidden;
  border-radius: 1rem;
  background: linear-gradient(
    90deg,
    rgba(19, 53, 111, 0.94),
    rgba(30, 70, 160, 0.92)
  );
  border: 0.0625rem solid rgba(47, 115, 255, 0.3);
  padding: 0.7rem 0;
  position: relative;
}
.ticker-wrap::before,
.ticker-wrap::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 3rem;
  z-index: 1;
  pointer-events: none;
}
.ticker-wrap::before {
  left: 0;
  background: linear-gradient(90deg, rgba(19, 53, 111, 0.94), transparent);
}
.ticker-wrap::after {
  right: 0;
  background: linear-gradient(270deg, rgba(19, 53, 111, 0.94), transparent);
}

.ticker-track {
  display: flex;
  gap: 0;
  white-space: nowrap;
  animation: ticker-scroll 38s linear infinite;
}
@keyframes ticker-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-33.333%);
  }
}
.ti {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0 1.25rem;
  font-size: 0.8125rem;
  color: rgba(200, 220, 255, 0.92);
}
.ti b {
  color: #fff;
  font-weight: 950;
  font-size: 0.875rem;
}
.ti-sep {
  color: rgba(73, 167, 255, 0.7);
  margin-left: 0.5rem;
  font-size: 0.6rem;
}

/* ─── ③ PIPELINE ─── */
.pipe-sec {
  border-radius: 1.375rem;
  border: 0.0625rem solid rgba(255, 255, 255, 0.72);
  background: linear-gradient(
    160deg,
    rgba(255, 255, 255, 0.88),
    rgba(234, 243, 255, 0.78)
  );
  box-shadow: 0 1rem 2.5rem rgba(67, 116, 212, 0.09);
  padding: 1.5rem 1.5rem 1.625rem;
  display: grid;
  gap: 1.25rem;
  /* override faster reveal for parent so children dominate */
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
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
  border: 0.0625rem solid rgba(74, 129, 255, 0.14);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 0.5rem 1.5rem rgba(67, 116, 212, 0.07);
  overflow: hidden;
  transition:
    transform 0.28s ease,
    box-shadow 0.28s ease;
}
.pipe-node:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 1rem 2rem rgba(67, 116, 212, 0.13);
}

/* stagger via parent is-visible */
.stagger-c {
  opacity: 0;
  transform: translateY(1.5rem);
  transition:
    opacity 0.65s ease var(--d, 0s),
    transform 0.65s ease var(--d, 0s);
}
.pipe-sec.is-visible .stagger-c {
  opacity: 1;
  transform: translateY(0);
}

.pn-num {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  font-size: 2.5rem;
  font-weight: 950;
  color: rgba(47, 115, 255, 0.06);
  line-height: 1;
}
.pn-icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}
.pn-icon svg {
  width: 1.75rem;
  height: 1.75rem;
}

.pn1 .pn-icon {
  background: rgba(47, 115, 255, 0.1);
  color: #2f73ff;
}
.pn2 .pn-icon {
  background: rgba(73, 167, 255, 0.1);
  color: #49a7ff;
}
.pn3 .pn-icon {
  background: rgba(125, 230, 255, 0.16);
  color: #3ab8f0;
}

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
  color: rgba(47, 115, 255, 0.35);
  width: 3.5rem;
}
.pipe-arr svg {
  width: 100%;
  display: block;
}

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
  border: 0.0625rem solid rgba(255, 255, 255, 0.72);
  background: linear-gradient(
    160deg,
    rgba(255, 255, 255, 0.92),
    rgba(234, 243, 255, 0.76)
  );
  box-shadow: 0 1rem 2.5rem rgba(67, 116, 212, 0.09);
  padding: 1.5rem 1.25rem 1.25rem;
  transition:
    opacity 0.75s ease var(--d, 0s),
    transform 0.75s ease var(--d, 0s),
    box-shadow 0.28s ease;
}
.cc:hover {
  box-shadow: 0 1.5rem 3.5rem rgba(67, 116, 212, 0.14);
}
.cc-bg-num {
  position: absolute;
  right: -0.5rem;
  top: -0.5rem;
  font-size: 5.5rem;
  font-weight: 950;
  line-height: 1;
  color: rgba(47, 115, 255, 0.055);
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
  width: 1.75rem;
  height: 0.1875rem;
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
  border: 0.0625rem solid rgba(255, 255, 255, 0.72);
  background: linear-gradient(
    160deg,
    rgba(255, 255, 255, 0.88),
    rgba(234, 243, 255, 0.78)
  );
  box-shadow: 0 1rem 2.5rem rgba(67, 116, 212, 0.09);
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
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999rem;
  border: 0.0625rem solid rgba(74, 129, 255, 0.2);
  background: rgba(255, 255, 255, 0.8);
  color: var(--text-2, #5878ad);
  font-size: 1.375rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.2s,
    background 0.2s;
  flex-shrink: 0;
}
.car-arr:hover {
  background: #fff;
  transform: scale(1.12);
  color: var(--blue-1, #2f73ff);
}

.car-vp {
  overflow: hidden;
  border-radius: 1rem;
  border: 0.0625rem solid rgba(74, 129, 255, 0.12);
  background: rgba(255, 255, 255, 0.5);
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
  background: linear-gradient(
    145deg,
    rgba(221, 240, 255, 0.9),
    rgba(183, 219, 255, 0.85)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  min-height: min(26rem, 55vh);
}
.cs-img img {
  max-width: 100%;
  max-height: min(24rem, 50vh);
  object-fit: contain;
  border-radius: 0.5rem;
}
.cs-info {
  width: min(14rem, 22vw);
  padding: 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.625rem;
  border-left: 0.0625rem solid rgba(74, 129, 255, 0.1);
  background: rgba(255, 255, 255, 0.5);
}
.cs-idx {
  font-size: 3rem;
  font-weight: 950;
  line-height: 1;
  color: rgba(47, 115, 255, 0.14);
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
.cs-legend {
  margin-top: 0.5rem;
  width: 100%;
  max-width: 160px;
  border-radius: 6px;
  border: 1px solid rgba(47, 115, 255, 0.12);
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
  border: 0.0625rem solid rgba(74, 129, 255, 0.16);
  background: rgba(255, 255, 255, 0.62);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 900;
  color: var(--text-2, #5878ad);
  transition: 0.2s ease;
}
.car-ind:hover {
  border-color: rgba(47, 115, 255, 0.32);
}
.car-ind.active {
  background: linear-gradient(135deg, #2f73ff, #49a7ff);
  border-color: transparent;
  color: #fff;
}
.car-ind span {
  pointer-events: none;
}

.car-progress {
  height: 0.1875rem;
  border-radius: 999rem;
  background: rgba(47, 115, 255, 0.1);
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
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(250, 250, 250, 0.6);
  backdrop-filter: blur(40px) saturate(180%);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  padding: 32px;
  display: grid;
  gap: 24px;
}
.cblock {
  margin: 0;
}

/* 苹果风格标题 */
.charts-sec .sec-hd {
  margin-bottom: 8px;
}
.charts-sec .sec-tag {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #86868b;
  background: rgba(0, 122, 255, 0.08);
  border: 1px solid rgba(0, 122, 255, 0.12);
  border-radius: 20px;
  padding: 6px 14px;
}
.charts-sec .sec-hd h2 {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #1d1d1f;
  margin: 12px 0 8px;
}
.charts-sec .sec-hd p {
  font-size: 15px;
  line-height: 1.6;
  color: #86868b;
  font-weight: 400;
}

/* ─── ⑦ CTA FOOTER ─── */
.cta-footer {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  background: linear-gradient(
    135deg,
    #1a3a8c,
    #2052c8 45%,
    #1e75e0 75%,
    #34a8f5
  );
  box-shadow:
    0 2rem 5rem rgba(30, 75, 224, 0.28),
    0 0.5rem 1.25rem rgba(30, 75, 224, 0.15);
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
  width: min(22rem, 46vw);
  height: min(22rem, 46vw);
  background: radial-gradient(
    circle,
    rgba(125, 230, 255, 0.22),
    transparent 70%
  );
  right: -6rem;
  top: -8rem;
  filter: blur(1.5rem);
}
.cta-o2 {
  width: min(16rem, 32vw);
  height: min(16rem, 32vw);
  background: radial-gradient(
    circle,
    rgba(47, 115, 255, 0.28),
    transparent 70%
  );
  left: -5rem;
  bottom: -5rem;
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
  color: rgba(180, 215, 255, 0.9);
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
  color: rgba(180, 215, 255, 0.88);
  max-width: 36rem;
}
.cta-footer .btn-p {
  background: rgba(255, 255, 255, 0.15);
  border: 0.0625rem solid rgba(255, 255, 255, 0.32);
  backdrop-filter: blur(0.5rem);
  color: #fff;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 20, 0.18);
}
.cta-footer .btn-p:hover {
  background: rgba(255, 255, 255, 0.26);
  box-shadow: 0 1rem 2rem rgba(0, 0, 20, 0.24);
}

/* ─── RESPONSIVE ─── */
@media (max-width: 64rem) {
  .lm {
    width: min(100%, calc(100vw - 1rem));
  }

  .l-hero {
    grid-template-columns: 1fr;
  }
  .hero-r {
    height: min(22rem, 60vw);
    padding: 0 1.25rem 1.25rem;
  }
  .img-cycle {
    aspect-ratio: auto;
    height: 100%;
  }

  .pipe-row {
    flex-direction: column;
  }
  .pipe-arr {
    transform: rotate(90deg);
    width: 2.5rem;
  }
  .pipe-node {
    width: 100%;
  }

  .contrib-row {
    grid-template-columns: 1fr;
  }

  .car-slide {
    grid-template-columns: 1fr;
  }
  .cs-info {
    width: 100%;
    border-left: none;
    border-top: 0.0625rem solid rgba(74, 129, 255, 0.1);
  }
  .cs-img {
    min-height: min(20rem, 55vw);
  }

  .hero-stats {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media (max-width: 40rem) {
  .hero-stats {
    grid-template-columns: 1fr;
  }
  .car-inds {
    display: none;
  }
}

/* ─── ⑤.5 ARCH ─── */
.arch-sec {
  border-radius: 1.375rem;
  border: 0.0625rem solid rgba(255, 255, 255, 0.72);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.9), rgba(230, 242, 255, 0.8));
  box-shadow: 0 1rem 2.5rem rgba(47, 115, 255, 0.1);
  padding: 1.5rem 1.5rem 1.25rem;
  display: grid;
  gap: 1.25rem;
}

.arch-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr);
  gap: 1rem;
  align-items: start;
}

/* 左侧四层 */
.arch-layers {
  display: grid;
  gap: 0.5rem;
}

.arch-layer {
  display: grid;
  grid-template-columns: 3rem 1fr;
  gap: 0.625rem;
  border-radius: 0.875rem;
  border: 0.0625rem solid rgba(47, 115, 255, 0.12);
  background: rgba(255, 255, 255, 0.82);
  padding: 0.625rem 0.75rem;
  align-items: start;
}

.layer-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 900;
  color: #13356f;
  line-height: 1.3;
  text-align: center;
  padding-top: 0.125rem;
}

.layer-icon {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.375rem;
  flex-shrink: 0;
}
.layer-icon-1 { background: linear-gradient(135deg, #2f73ff, #49a7ff); }
.layer-icon-2 { background: linear-gradient(135deg, #7b52de, #af79ff); }
.layer-icon-3 { background: linear-gradient(135deg, #0aa3a3, #3ecfcf); }
.layer-icon-4 { background: linear-gradient(135deg, #0a8a4a, #34c78a); }

.layer-content {
  display: grid;
  gap: 0.3rem;
}

.layer-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.ltag {
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 999rem;
  white-space: nowrap;
}
.ltag-blue       { background: #2f73ff; color: #fff; }
.ltag-blue-light { background: rgba(73,167,255,0.18); color: #2252b0; border: 0.0625rem solid rgba(47,115,255,0.3); }
.ltag-purple       { background: #7b52de; color: #fff; }
.ltag-purple-light { background: rgba(175,121,255,0.15); color: #6033b8; border: 0.0625rem solid rgba(123,82,222,0.3); }
.ltag-teal       { background: #0aa3a3; color: #fff; }
.ltag-teal-light { background: rgba(62,207,207,0.15); color: #0a7070; border: 0.0625rem solid rgba(10,163,163,0.3); }
.ltag-green       { background: #0a8a4a; color: #fff; }
.ltag-green-light { background: rgba(52,199,138,0.15); color: #0a6035; border: 0.0625rem solid rgba(10,138,74,0.3); }

.layer-bullets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem 0.75rem;
}
.lbullet {
  font-size: 0.6875rem;
  color: #5878ad;
  font-weight: 600;
}

/* 右侧构架图 */
.arch-diagram {
  border-radius: 1rem;
  border: 0.0625rem solid rgba(47, 115, 255, 0.14);
  background: rgba(255, 255, 255, 0.9);
  padding: 0.875rem;
  overflow: hidden;
}

.diag-title {
  text-align: center;
  font-size: 0.875rem;
  font-weight: 900;
  color: #13356f;
  margin-bottom: 0.75rem;
  letter-spacing: 0.05rem;
}

.diag-body {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 2fr) minmax(0, 0.85fr);
  gap: 0.5rem;
  align-items: start;
}

.diag-col {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
}

.diag-col-hd {
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.25rem 0.5rem;
  border-radius: 999rem;
  text-align: center;
  margin-bottom: 0.375rem;
  white-space: nowrap;
}
.diag-hd-blue {
  background: linear-gradient(135deg, #2f73ff, #49a7ff);
  color: #fff;
}

.diag-block {
  font-size: 0.625rem;
  font-weight: 800;
  text-align: center;
  padding: 0.5rem 0.375rem;
  border-radius: 0.5rem;
  width: 100%;
  line-height: 1.4;
}
.diag-red    { background: rgba(235,70,70,0.15); color: #c0392b; border: 0.0625rem solid rgba(235,70,70,0.3); }
.diag-orange { background: rgba(255,149,0,0.15); color: #b36200; border: 0.0625rem solid rgba(255,149,0,0.3); }
.diag-yellow { background: rgba(255,204,0,0.12); color: #805a00; border: 0.0625rem solid rgba(255,204,0,0.3); }
.diag-green-light { background: rgba(52,199,138,0.15); color: #0a6035; border: 0.0625rem solid rgba(52,199,138,0.3); }

.diag-arrow-down {
  width: 1px;
  height: 0.75rem;
  background: rgba(47, 115, 255, 0.3);
  margin: 0.125rem auto;
  position: relative;
}
.diag-arrow-down::after {
  content: '';
  position: absolute;
  bottom: -0.25rem;
  left: -0.2rem;
  border: 0.25rem solid transparent;
  border-top-color: rgba(47, 115, 255, 0.4);
}

.diag-col-mid { gap: 0.25rem; }

.diag-row-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  justify-content: center;
  width: 100%;
}

.diag-sm-block {
  font-size: 0.5625rem;
  font-weight: 700;
  text-align: center;
  padding: 0.25rem 0.375rem;
  border-radius: 0.375rem;
  border: 0.0625rem solid rgba(47, 115, 255, 0.15);
  background: rgba(255, 255, 255, 0.9);
  color: #13356f;
  white-space: nowrap;
}
.diag-sm-blue   { background: rgba(47,115,255,0.1); color: #2252b0; border-color: rgba(47,115,255,0.25); }
.diag-sm-yellow { background: rgba(255,204,0,0.1); color: #805a00; border-color: rgba(255,180,0,0.3); }
.diag-sm-green  { background: rgba(52,199,138,0.12); color: #0a6035; border-color: rgba(52,199,138,0.3); }

.diag-data-box {
  width: 100%;
  border: 0.0625rem dashed rgba(47,115,255,0.25);
  border-radius: 0.5rem;
  padding: 0.375rem;
}
.data-in {
  display: flex;
  gap: 0.375rem;
  align-items: center;
}
.data-label {
  font-size: 0.5625rem;
  font-weight: 800;
  color: #5878ad;
  text-align: center;
  flex-shrink: 0;
  line-height: 1.3;
}
.data-items {
  display: grid;
  gap: 0.2rem;
  flex: 1;
}
.di {
  font-size: 0.5625rem;
  font-weight: 700;
  text-align: center;
  padding: 0.2rem 0.3rem;
  border-radius: 0.25rem;
  background: rgba(47,115,255,0.08);
  color: #2252b0;
  border: 0.0625rem solid rgba(47,115,255,0.15);
}

.diag-result {
  font-size: 0.625rem;
  font-weight: 900;
  text-align: center;
  padding: 0.5rem 0.375rem;
  border-radius: 0.5rem;
  width: 100%;
  line-height: 1.4;
}
.diag-result-red    { background: rgba(235,70,70,0.15); color: #c0392b; border: 0.0625rem solid rgba(235,70,70,0.3); }
.diag-result-yellow { background: rgba(255,149,0,0.18); color: #b36200; border: 0.0625rem solid rgba(255,149,0,0.35); }
.diag-result-orange { background: rgba(255,204,0,0.15); color: #805a00; border: 0.0625rem solid rgba(255,180,0,0.3); }
.diag-result-green  { background: rgba(52,199,138,0.15); color: #0a6035; border: 0.0625rem solid rgba(52,199,138,0.3); }

/* 底部总结条 */
.arch-footer {
  padding: 0.875rem 1.5rem;
  border-radius: 0.875rem;
  background: linear-gradient(135deg, #13356f, #2252b0 50%, #2f73ff);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 800;
  text-align: center;
  letter-spacing: 0.04rem;
  line-height: 1.6;
}

@media (max-width: 64rem) {
  .arch-body {
    grid-template-columns: 1fr;
  }
}
</style>
