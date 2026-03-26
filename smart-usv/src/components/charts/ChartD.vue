<template>
  <div class="chart-card">
    <div class="chart-card-title">(d) Prediction Correlation ρ (Main Experiment)</div>
    <div ref="elRef" class="chart-canvas"></div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { correlationHeatmapData, modelNames, yLabelsD } from './chartData'

const props = defineProps({
  active: { type: Boolean, default: false },
})

const elRef = ref(null)
let chart = null

function render() {
  if (!chart) return
  chart.setOption({
    backgroundColor: 'transparent',
    grid: { top: 54, left: 50, right: 20, bottom: 34, containLabel: true },
    tooltip: {
      position: 'top',
      formatter: (p) => {
        const x = modelNames[p.data[0]]
        const y = yLabelsD[p.data[1]]
        const v = p.data[2]
        return `${y}<br/>${x}: ${v.toFixed(3)}`
      },
    },
    xAxis: {
      type: 'category',
      data: modelNames,
      axisLabel: { rotate: 25 },
      axisTick: { alignWithLabel: true },
    },
    yAxis: { type: 'category', data: yLabelsD },
    visualMap: {
      min: 0.4,
      max: 0.65,
      calculable: false,
      orient: 'vertical',
      right: 10,
      top: 'center',
      inRange: { color: ['#e9f7ff', '#bfe9ff', '#2d9cf9'] },
    },
    series: [
      {
        name: 'Pearson ρ',
        type: 'heatmap',
        data: correlationHeatmapData,
        label: {
          show: true,
          formatter: (p) => p.value.toFixed(3),
          color: '#0b1b3a',
          fontWeight: 900,
        },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.25)' } },
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

