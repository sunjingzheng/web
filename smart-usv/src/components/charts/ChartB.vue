<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-badge">Figure B</div>
      <h3 class="chart-title">稳态 RMS 误差降低率 — 各工况</h3>
      <p class="chart-sub">后20s稳态误差 CNN 相对 BASE 的改善百分比（多工况雷达对比）</p>
    </div>
    <div ref="elRef" class="chart-canvas"></div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  active: { type: Boolean, default: false },
})

const elRef = ref(null)
let chart = null

// 稳态RMS降低率: 后20s RMS improvement %
const steadyImprove = {
  Main: 89.38,
  A1:   90.97,
  A2:   91.39,
  B1:   91.49,
  B2:   63.17,
}
const scenarios = ['Main', 'A1', 'A2', 'B1', 'B2']
const baseValues = [0.4384, 0.5137, 0.3829, 0.3824, 0.4746]
const cnnValues  = [0.0467, 0.0464, 0.0330, 0.0325, 0.1748]

function render() {
  if (!chart) return
  chart.setOption({
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: 'rgba(47,115,255,0.18)',
      borderWidth: 1,
      textStyle: { color: '#13356f', fontSize: 12 },
      padding: [10, 14],
      extraCssText: 'border-radius: 10px; box-shadow: 0 8px 24px rgba(47,115,255,0.12);',
      formatter(p) {
        const i = p.dataIndex
        return `<div style="font-weight:800;color:#13356f;margin-bottom:6px">${scenarios[i]} 工况</div>
          <div style="color:#5878ad">BASE 稳态RMS: <b style="color:#13356f">${baseValues[i].toFixed(4)} m</b></div>
          <div style="color:#5878ad">CNN 稳态RMS:  <b style="color:#2f73ff">${cnnValues[i].toFixed(4)} m</b></div>
          <div style="color:#0a7c44;font-weight:800;margin-top:4px">↓ 改善 ${steadyImprove[scenarios[i]]}%</div>`
      }
    },
    legend: {
      bottom: 8,
      left: 'center',
      itemWidth: 14,
      itemHeight: 14,
      itemGap: 24,
      textStyle: { fontSize: 12, color: '#5878ad', fontWeight: 600 },
      icon: 'roundRect',
    },
    radar: {
      center: ['50%', '50%'],
      radius: '62%',
      indicator: scenarios.map(s => ({ name: s, max: 95 })),
      axisName: { color: '#5878ad', fontSize: 12, fontWeight: 700 },
      splitLine: { lineStyle: { color: 'rgba(47,115,255,0.1)' } },
      splitArea: {
        areaStyle: {
          color: ['rgba(47,115,255,0.02)', 'rgba(47,115,255,0.05)'],
        },
      },
      axisLine: { lineStyle: { color: 'rgba(47,115,255,0.15)' } },
    },
    series: [
      {
        name: '稳态RMS降低率',
        type: 'radar',
        data: [
          {
            value: scenarios.map(s => steadyImprove[s]),
            name: 'CNN vs BASE 改善(%)',
            areaStyle: {
              color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                { offset: 0, color: 'rgba(47,115,255,0.35)' },
                { offset: 1, color: 'rgba(73,167,255,0.05)' },
              ]),
            },
            lineStyle: { color: '#2f73ff', width: 2 },
            itemStyle: { color: '#2f73ff' },
            symbol: 'circle',
            symbolSize: 6,
          },
        ],
      },
    ],
  })
}

async function ensure() {
  if (!elRef.value) return
  if (!chart) chart = echarts.init(elRef.value)
  render()
  await nextTick()
  chart.resize()
}

watch(() => props.active, async (v) => { if (v) await ensure() }, { immediate: true })
onBeforeUnmount(() => { chart?.dispose(); chart = null })
</script>

<style scoped>
.chart-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 1.25rem;
  border: 1px solid rgba(47, 115, 255, 0.12);
  padding: 1.25rem 1.25rem 0.75rem;
  box-shadow: 0 4px 24px rgba(47, 115, 255, 0.08);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.chart-card:hover {
  box-shadow: 0 12px 36px rgba(47, 115, 255, 0.14);
  transform: translateY(-2px);
}
.chart-header { margin-bottom: 0.875rem; }
.chart-badge {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08rem;
  text-transform: uppercase;
  color: #2f73ff;
  background: rgba(47, 115, 255, 0.08);
  border: 1px solid rgba(47, 115, 255, 0.18);
  border-radius: 999rem;
  padding: 0.2rem 0.6rem;
  margin-bottom: 0.375rem;
}
.chart-title {
  font-size: 1rem;
  font-weight: 800;
  color: #13356f;
  margin: 0 0 0.25rem;
  letter-spacing: -0.01rem;
}
.chart-sub {
  margin: 0;
  font-size: 0.75rem;
  color: #5878ad;
  line-height: 1.5;
}
.chart-canvas {
  width: 100%;
  height: 320px;
}
</style>
