<template>
  <div class="chart-card">
    <div class="chart-card-title">(b) DOB Residual Reduction — Yaw (r-channel)</div>
    <div ref="elRef" class="chart-canvas"></div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { barYawR, modelColorMap, modelNames, scenarios } from './chartData'

const props = defineProps({
  active: { type: Boolean, default: false },
})

const elRef = ref(null)
let chart = null

function render() {
  if (!chart) return
  chart.setOption({
    backgroundColor: 'transparent',
    grid: { top: 54, left: 44, right: 18, bottom: 42, containLabel: true },
    legend: { top: 8, left: 10, type: 'scroll', textStyle: { fontSize: 12 } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'category', data: scenarios },
    yAxis: {
      type: 'value',
      name: 'Residual Reduction (%)',
      min: 0,
      max: 20,
      axisLabel: { formatter: '{value}' },
    },
    series: modelNames.map((name) => ({
      name,
      type: 'bar',
      barWidth: '22%',
      itemStyle: { color: modelColorMap[name] },
      emphasis: { focus: 'series' },
      data: barYawR[name] || [],
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

