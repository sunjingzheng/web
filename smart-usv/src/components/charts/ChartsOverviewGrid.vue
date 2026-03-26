<template>
  <div class="docs-layout">
    <aside class="docs-aside" aria-label="页面导航">
      <div class="docs-aside-title">USV · Trajectory Tracking</div>
      <div class="docs-aside-tip">滚动到对应模块会自动逐个渲染图表</div>
    </aside>

    <main class="docs-main">
      <section ref="secA" id="sec-a" class="reveal-section" data-idx="0" :class="{ 'is-visible': visible[0] }">
        <ChartA :active="props.active && visible[0]" />
      </section>
      <section ref="secB" id="sec-b" class="reveal-section" data-idx="1" :class="{ 'is-visible': visible[1] }">
        <ChartB :active="props.active && visible[1]" />
      </section>
      <section ref="secC" id="sec-c" class="reveal-section" data-idx="2" :class="{ 'is-visible': visible[2] }">
        <ChartC :active="props.active && visible[2]" />
      </section>
      <section ref="secD" id="sec-d" class="reveal-section" data-idx="3" :class="{ 'is-visible': visible[3] }">
        <ChartD :active="props.active && visible[3]" />
      </section>

      <section class="intro">
        <div class="intro-text">
          <h2>基于深度学习的无人船轨迹跟踪软件</h2>
          <p>
            通过对复杂工况下的动力学特性建模，实现轨迹预测与误差抑制。
            同时支持不同干扰场景下的对比验证，帮助你快速评估模型性能与工程可用性。
          </p>
        </div>
        <div class="intro-media">
          <img class="intro-image" src="/second/54268b685cc3858ab86b18d3d29db651.png" alt="demo" />
        </div>
      </section>

      <section class="jump-footer">
        <button type="button" class="jump-btn" @click="emit('go-demo')">
          去预测界面
        </button>
        <div class="jump-hint">返回后你可以输入参数并开始轨迹预测。</div>
      </section>
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

onMounted(() => {
  // 只要页面开始滚动/进入视口，就逐个显示图表
  connectObserver()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
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
.docs-layout {
  width: 100%;
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 16px;
  padding: 10px 6px 18px;
}

.docs-aside {
  position: sticky;
  top: 88px;
  align-self: start;
  height: fit-content;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(239, 247, 255, 0.78));
  box-shadow: 0 16px 32px rgba(67, 116, 212, 0.06);
  padding: 14px 14px 12px;
}

.docs-aside-title {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.2px;
  margin-bottom: 10px;
  color: rgba(19, 53, 111, 0.96);
}

.docs-nav {
  display: grid;
  gap: 8px;
}

.docs-nav-item {
  text-align: left;
  border-radius: 14px;
  border: 1px solid rgba(74, 129, 255, 0.14);
  background: rgba(255, 255, 255, 0.55);
  color: rgba(58, 88, 140, 0.96);
  padding: 10px 10px;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s ease;
}

.docs-nav-item:hover {
  border-color: rgba(47, 115, 255, 0.28);
  transform: translateY(-1px);
}

.docs-nav-item.active {
  background: linear-gradient(135deg, rgba(47, 115, 255, 0.95), rgba(73, 167, 255, 0.95));
  border-color: transparent;
  color: #fff;
  box-shadow: 0 10px 24px rgba(47, 115, 255, 0.2);
}

.docs-aside-tip {
  margin-top: 12px;
  font-size: 11px;
  line-height: 1.5;
  color: rgba(88, 120, 173, 0.96);
}

.docs-main {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.intro {
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(239, 247, 255, 0.78));
  box-shadow: 0 16px 32px rgba(67, 116, 212, 0.08);
  padding: 16px 16px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 14px;
  align-items: center;
}

.intro-text h2 {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 0.2px;
  color: rgba(19, 53, 111, 0.96);
}

.intro-text p {
  margin: 0;
  font-size: 12px;
  line-height: 1.7;
  color: rgba(88, 120, 173, 0.96);
}

.intro-media {
  display: flex;
  justify-content: center;
  align-items: center;
}

.intro-image {
  width: 100%;
  max-height: 240px;
  object-fit: contain;
  border-radius: 12px;
  border: 1px solid rgba(57, 124, 255, 0.14);
  background: rgba(255, 255, 255, 0.55);
}

.reveal-section {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.jump-footer {
  margin-top: 6px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(239, 247, 255, 0.78));
  box-shadow: 0 16px 32px rgba(67, 116, 212, 0.06);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.jump-btn {
  height: 42px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(135deg, rgba(47, 115, 255, 0.95), rgba(73, 167, 255, 0.95));
  box-shadow: 0 12px 24px rgba(47, 115, 255, 0.22);
  transition: 0.2s ease;
}

.jump-btn:hover {
  transform: translateY(-2px);
}

.jump-hint {
  font-size: 11px;
  color: rgba(88, 120, 173, 0.96);
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .docs-layout {
    grid-template-columns: 1fr;
  }

  .docs-aside {
    position: relative;
    top: auto;
  }

  .intro {
    grid-template-columns: 1fr;
  }
}
</style>

