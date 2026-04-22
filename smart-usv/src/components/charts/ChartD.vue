<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-badge">Figure D</div>
      <h3 class="chart-title">预测相关性热图 — Pearson ρ</h3>
      <p class="chart-sub">主实验各模型在 Surge/Yaw 两通道的预测相关系数</p>
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

const modelNames = ['CNN', 'Transformer', 'MLP', 'LSTM', 'BiLSTM']
const channels = ['Surge (u)', 'Yaw (r)']
const heatData = [
  [0, 0, 0.5573], [1, 0, 0.4991], [2, 0, 0.5587], [3, 0, 0.4532], [4, 0, 0.4684],
  [0, 1, 0.5813], [1, 1, 0.5929], [2, 1, 0.6292], [3, 1, 0.5574], [4, 1, 0.5590],
]

function render() {
  if (!chart) return
  chart.setOption({
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 900,
    animationEasing: 'cubicOut',
    grid: { top: 20, left: 16, right: 100, bottom: 56, containLabel: true },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: 'rgba(47,115,255,0.18)',
      borderWidth: 1,
      textStyle: { color: '#13356f', fontSize: 12 },
      padding: [10, 14],
      extraCssText: 'border-radius: 10px; box-shadow: 0 8px 24px rgba(47,115,255,0.12);',
      formatter(p) {
        const model = modelNames[p.data[0]]
        const ch = channels[p.data[1]]
        const v = p.data[2]
        const pct = ((v - 0.43) / (0.64 - 0.43) * 100).toFixed(0)
        return `<div style="font-weight:800;color:#13356f;margin-bottom:6px">${model}</div>
          <div style="color:#5878ad">通道: <b style="color:#13356f">${ch}</b></div>
          <div style="color:#5878ad">Pearson ρ: <b style="color:#2f73ff;font-size:14px">${v.toFixed(4)}</b></div>
          <div style="margin-top:6px;background:rgba(47,115,255,0.08);border-radius:4px;padding:2px 6px;font-size:11px;color:#5878ad">相对强度 ${pct}%</div>`
      }
    },
    xAxis: {
      type: 'category',
      data: modelNames,
      axisLine: { lineStyle: { color: 'rgba(47,115,255,0.15)' } },
      axisTick: { show: false },
      axisLabel: { color: '#5878ad', fontSize: 12, fontWeight: 700 },
      splitArea: { show: true, areaStyle: { color: ['rgba(47,115,255,0.02)', 'rgba(47,115,255,0.05)'] } },
    },
    yAxis: {
      type: 'category',
      data: channels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#5878ad', fontSize: 12, fontWeight: 600 },
      splitArea: { show: true, areaStyle: { color: ['rgba(47,115,255,0.02)', 'rgba(47,115,255,0.05)'] } },
    },
    visualMap: {
      min: 0.43,
      max: 0.64,
      calculable: true,
      orient: 'vertical',
      right: 12,
      top: 'middle',
      itemHeight: 100,
      itemWidth: 14,
      textStyle: { color: '#5878ad', fontSize: 11, fontWeight: 600 },
      inRange: {
        color: ['#c5dcff', '#7daeff', '#3d88ff', '#2f73ff', '#1a56cc'],
      },
    },
    series: [{
      name: 'Pearson ρ',
      type: 'heatmap',
      data: heatData,
      label: {
        show: true,
        formatter: p => p.value[2].toFixed(3),
        color: '#fff',
        fontWeight: 800,
        fontSize: 13,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowBlur: 4,
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 4,
        borderRadius: 10,
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(47,115,255,0.35)',
          borderWidth: 4,
        },
      },
    }],
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
