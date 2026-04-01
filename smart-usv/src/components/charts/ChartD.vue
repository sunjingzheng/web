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
    grid: { top: 32, left: 16, right: 100, bottom: 48, containLabel: true },
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: 'rgba(47,115,255,0.18)',
      textStyle: { color: '#13356f', fontSize: 12 },
      formatter: (p) => {
        const x = modelNames[p.data[0]]
        const y = yLabelsD[p.data[1]]
        const v = p.data[2]
        return `<b>${x}</b><br/>${y}<br/>ρ = ${v.toFixed(3)}`
      },
    },
    xAxis: {
      type: 'category',
      data: modelNames,
      axisLabel: { rotate: 20, color: '#5878ad', fontWeight: 700, fontSize: 11 },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(88,120,173,0.25)' } },
      splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,0)', 'rgba(47,115,255,0.03)'] } },
    },
    yAxis: {
      type: 'category',
      data: yLabelsD,
      axisLabel: { color: '#5878ad', fontSize: 11 },
      axisTick: { show: false },
      axisLine: { show: false },
      splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,0)', 'rgba(47,115,255,0.03)'] } },
    },
    visualMap: {
      min: 0.43,
      max: 0.64,
      calculable: true,
      orient: 'vertical',
      right: 8,
      top: 'middle',
      itemHeight: 100,
      textStyle: { color: '#5878ad', fontSize: 10 },
      inRange: {
        color: ['#dbeeff', '#93c5fd', '#2f73ff'],
      },
    },
    series: [
      {
        name: 'Pearson ρ',
        type: 'heatmap',
        coordinateSystem: 'cartesian2d',
        data: correlationHeatmapData,
        label: {
          show: true,
          formatter: (p) => p.value[2].toFixed(3),
          color: '#13356f',
          fontWeight: 800,
          fontSize: 13,
        },
        itemStyle: {
          borderColor: 'rgba(255,255,255,0.6)',
          borderWidth: 2,
          borderRadius: 6,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 12,
            shadowColor: 'rgba(47,115,255,0.35)',
          },
        },
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

