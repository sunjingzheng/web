<template>
  <div class="chart-card">
    <div class="chart-card-title">(c) Computational Efficiency Trade-off</div>
    <div ref="elRef" class="chart-canvas"></div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { modelNames, scatterTradeOff } from './chartData'

const props = defineProps({
  active: { type: Boolean, default: false },
})

const elRef = ref(null)
let chart = null

function render() {
  if (!chart) return
  const palette = ['#2f73ff', '#10b981', '#f472b6', '#f59e0b', '#8b5cf6']
  chart.setOption({
    backgroundColor: 'transparent',
    grid: { top: 48, left: 16, right: 16, bottom: 56, containLabel: true },
    legend: {
      bottom: 6,
      left: 'center',
      type: 'scroll',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { fontSize: 11, color: '#5878ad' },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: 'rgba(47,115,255,0.18)',
      textStyle: { color: '#13356f', fontSize: 12 },
      formatter: (p) =>
        `<b>${p.seriesName}</b><br/>参数量: ${p.value[0]}K<br/>推理延迟: ${p.value[1]}μs`,
    },
    xAxis: {
      type: 'value',
      name: 'Parameters (K)',
      nameTextStyle: { color: '#5878ad', fontSize: 11 },
      axisLabel: { color: '#5878ad', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(88,120,173,0.1)', type: 'dashed' } },
      axisLine: { lineStyle: { color: 'rgba(88,120,173,0.25)' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'log',
      name: 'Latency (μs)',
      nameTextStyle: { color: '#5878ad', fontSize: 11 },
      axisLabel: { color: '#5878ad', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(88,120,173,0.1)', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: modelNames.map((m, i) => ({
      name: m,
      type: 'scatter',
      itemStyle: {
        color: palette[i],
        opacity: 0.88,
        shadowBlur: 8,
        shadowColor: palette[i] + '55',
      },
      symbolSize: (val) => Math.max(12, Math.min(28, val[0] / 12)),
      data: scatterTradeOff[m] || [],
    })),
  })
}

async function ensure() {
  if (!elRef.value) return
  if (!chart) chart = echarts.init(elRef.value)
  render()
  await nextTick()
  chart.resize()
}

watch(
  () => props.active,
  async (v) => {
    if (!v) return
    await ensure()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  chart?.dispose()
  chart = null
})
</script>

