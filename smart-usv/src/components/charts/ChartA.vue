<template>
  <div class="chart-card">
    <div class="chart-card-title">(a) DOB Residual Reduction — Surge (u-channel)</div>
    <div ref="elRef" class="chart-canvas"></div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { barSurgeU, modelColorMap, modelNames, scenarios } from './chartData'

// 表A按你的要求：只展示四组（A1/A2/B1/B2）
const scenariosA = scenarios.slice(1)

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
    legend: {
      bottom: 14,
      left: 'center',
      type: 'scroll',
      textStyle: { fontSize: 12 },
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'category', data: scenariosA },
    yAxis: {
      type: 'value',
      name: 'Residual Reduction (%)',
      // 与截图一致的固定范围，保证柱高像素比例完全对齐
      min: -100,
      max: 20,
      axisLabel: { formatter: '{value}' },
      splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } },
    },
    series: [
      ...modelNames.map((name) => ({
        name,
        type: 'bar',
        // 与截图一致的柱宽设置，保证柱组在 x 轴分类处的显示比例一致
        barWidth: '22%',
        itemStyle: { color: modelColorMap[name] },
        emphasis: { focus: 'series' },
        data: (barSurgeU[name] || []).slice(1).map((v) => (typeof v === 'number' ? v : Number(v))),
      })),
      // 0 参考线：用 line series 确保始终显示在正确位置（虚线风格与截图一致）
      {
        name: '__zero__',
        type: 'line',
        showInLegend: false,
        data: scenariosA.map(() => 0),
        symbol: 'none',
        tooltip: { show: false },
        lineStyle: { type: 'dashed', color: 'rgba(0,0,0,0.35)', width: 2 },
        z: 1,
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

onMounted(() => {
  // 初始如果 active=true，则 mounted 后会触发 watch immediate
})

onBeforeUnmount(() => {
  chart?.dispose()
  chart = null
})
</script>

