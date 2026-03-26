<template>
  <div class="chart-card">
    <div class="chart-card-title">(c) Computational Efficiency Trade-off</div>
    <div ref="elRef" class="chart-canvas"></div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { modelColorMap, modelNames, scatterTradeOff } from './chartData'

const props = defineProps({
  active: { type: Boolean, default: false },
})

const elRef = ref(null)
let chart = null

function render() {
  if (!chart) return
  chart.setOption({
    backgroundColor: 'transparent',
    grid: { top: 54, left: 48, right: 22, bottom: 44, containLabel: true },
    legend: { top: 8, left: 10, type: 'scroll', textStyle: { fontSize: 12 } },
    tooltip: { trigger: 'item' },
    xAxis: { type: 'value', name: 'Number of Parameters (K)' },
    yAxis: {
      type: 'log',
      name: 'CPU Inference Latency (μs)',
      // ECharts log 轴需要数据 > 0，假数据已保证为正
    },
    series: modelNames.map((m) => ({
      name: m,
      type: 'scatter',
      itemStyle: { color: modelColorMap[m] },
      symbolSize: 10,
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

