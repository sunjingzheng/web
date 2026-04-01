<template>
  <div class="chart-card">
    <div class="chart-card-title">(a) DOB Residual Reduction — Surge (u-channel)</div>
    <div ref="elRef" class="chart-canvas"></div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { barSurgeU, modelNames, scenarios } from './chartData'

// 表A按你的要求：只展示四组（A1/A2/B1/B2）
const scenariosA = scenarios.slice(1)

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
      formatter: (name) => (name === '__zero__' ? '' : name),
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: 'rgba(47,115,255,0.18)',
      textStyle: { color: '#13356f', fontSize: 12 },
    },
    xAxis: {
      type: 'category',
      data: scenariosA,
      axisLine: { lineStyle: { color: 'rgba(88,120,173,0.25)' } },
      axisTick: { show: false },
      axisLabel: { color: '#5878ad', fontWeight: 700, fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      name: 'Reduction (%)',
      nameTextStyle: { color: '#5878ad', fontSize: 11 },
      min: -100,
      max: 25,
      axisLabel: { color: '#5878ad', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(88,120,173,0.1)', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      ...modelNames.map((name, i) => ({
        name,
        type: 'bar',
        barMaxWidth: 10,
        barGap: '20%',
        barCategoryGap: '40%',
        itemStyle: {
          color: palette[i],
          borderRadius: [3, 3, 0, 0],
        },
        emphasis: {
          focus: 'series',
          itemStyle: { opacity: 0.85 },
        },
        data: (barSurgeU[name] || []).slice(1).map((v) => (typeof v === 'number' ? v : Number(v))),
      })),
      {
        name: '__zero__',
        type: 'line',
        silent: true,
        legendHoverLink: false,
        data: scenariosA.map(() => 0),
        symbol: 'none',
        tooltip: { show: false },
        lineStyle: { type: 'dashed', color: 'rgba(88,120,173,0.45)', width: 1.5 },
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

