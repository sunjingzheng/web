<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-badge">Figure C</div>
      <h3 class="chart-title">计算效率权衡 — 参数量 vs 推理延迟</h3>
      <p class="chart-sub">各模型参数量（K）与 CPU 推理延迟（μs）综合对比</p>
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

const models = [
  { name: 'CNN',         params: 210.5, latency: 523,  color: '#2f73ff', size: 32 },
  { name: 'Transformer', params: 69.8,  latency: 396,  color: '#49a7ff', size: 24 },
  { name: 'MLP',         params: 297.5, latency: 28,   color: '#34c78a', size: 28 },
  { name: 'LSTM',        params: 212.2, latency: 2026, color: '#ff6b6b', size: 26 },
  { name: 'BiLSTM',      params: 146.6, latency: 3411, color: '#ff9f43', size: 26 },
]

function render() {
  if (!chart) return
  chart.setOption({
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 900,
    animationEasing: 'cubicOut',
    grid: { top: 24, left: 16, right: 100, bottom: 56, containLabel: true },
    legend: {
      bottom: 8,
      left: 'center',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 16,
      textStyle: { fontSize: 11, color: '#5878ad', fontWeight: 600 },
      icon: 'circle',
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: 'rgba(47,115,255,0.18)',
      borderWidth: 1,
      textStyle: { color: '#13356f', fontSize: 12 },
      padding: [10, 14],
      extraCssText: 'border-radius: 10px; box-shadow: 0 8px 24px rgba(47,115,255,0.12);',
      formatter(p) {
        const m = models[p.seriesIndex]
        const isGood = m.params < 250 && m.latency < 1000
        return `<div style="font-weight:800;color:${m.color};margin-bottom:6px">${m.name}</div>
          <div style="color:#5878ad">参数量: <b style="color:#13356f">${m.params}K</b></div>
          <div style="color:#5878ad">推理延迟: <b style="color:#13356f">${m.latency}μs</b></div>
          <div style="margin-top:6px;color:${isGood ? '#0a7c44' : '#c0392b'};font-weight:700">
            ${isGood ? '✓ 实时可部署' : '✗ 超出实时限制'}
          </div>`
      }
    },
    xAxis: {
      type: 'value',
      name: '参数量 (K)',
      nameTextStyle: { color: '#5878ad', fontSize: 11, fontWeight: 600 },
      min: 0, max: 350,
      axisLine: { lineStyle: { color: 'rgba(47,115,255,0.15)' } },
      axisTick: { show: false },
      axisLabel: { color: '#5878ad', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(47,115,255,0.06)', type: 'dashed' } },
    },
    yAxis: {
      type: 'log',
      name: '推理延迟 (μs)',
      nameTextStyle: { color: '#5878ad', fontSize: 11, fontWeight: 600 },
      min: 10, max: 10000,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#5878ad', fontSize: 11,
        formatter: v => v >= 1000 ? (v/1000).toFixed(0)+'ms' : v+'μs'
      },
      splitLine: { lineStyle: { color: 'rgba(47,115,255,0.06)', type: 'dashed' } },
    },
    series: [
      // 1ms 实时限制线
      {
        type: 'line',
        markLine: {
          silent: true, symbol: 'none',
          lineStyle: { color: 'rgba(255,107,107,0.5)', width: 1.5, type: 'dashed' },
          label: { show: true, position: 'end', formatter: '1ms限制', color: '#ff6b6b', fontSize: 10, fontWeight: 700 },
          data: [{ yAxis: 1000 }],
        },
      },
      // 各模型气泡
      ...models.map(m => ({
        name: m.name,
        type: 'scatter',
        symbolSize: m.size,
        itemStyle: {
          color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
            { offset: 0, color: m.color + 'ff' },
            { offset: 1, color: m.color + '99' },
          ]),
          shadowBlur: 12,
          shadowColor: m.color + '40',
        },
        emphasis: {
          scale: 1.35,
          itemStyle: { shadowBlur: 20, shadowColor: m.color + '60' },
        },
        label: {
          show: true,
          position: 'top',
          formatter: m.name,
          color: m.color,
          fontWeight: 800,
          fontSize: 11,
        },
        data: [[m.params, m.latency]],
      })),
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
