<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-badge">Figure A</div>
      <h3 class="chart-title">RMS 误差降低率 — 全程对比</h3>
      <p class="chart-sub">各工况下 BASE vs CNN 全程位置误差 RMS 改善幅度</p>
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

const scenarios = ['Main', 'A1', 'A2', 'B1', 'B2']
const rmsData = {
  BASE: [0.2795, 0.2981, 0.2614, 0.2612, 0.3169],
  CNN:  [0.2016, 0.1921, 0.1919, 0.1919, 0.2412],
}
const improvePct = [27.87, 35.55, 26.58, 26.54, 23.88]

function render() {
  if (!chart) return
  chart.setOption({
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 900,
    animationEasing: 'cubicOut',
    grid: { top: 24, left: 16, right: 60, bottom: 56, containLabel: true },
    legend: {
      bottom: 8,
      left: 'center',
      itemWidth: 14,
      itemHeight: 14,
      itemGap: 24,
      textStyle: { fontSize: 12, color: '#5878ad', fontWeight: 600 },
      icon: 'roundRect',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(47,115,255,0.04)' } },
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: 'rgba(47,115,255,0.18)',
      borderWidth: 1,
      textStyle: { color: '#13356f', fontSize: 12 },
      padding: [10, 14],
      extraCssText: 'border-radius: 10px; box-shadow: 0 8px 24px rgba(47,115,255,0.12);',
      formatter(params) {
        const s = params[0].axisValue
        const i = scenarios.indexOf(s)
        let h = `<div style="font-weight:800;color:#13356f;margin-bottom:6px">${s} 工况</div>`
        params.forEach(p => {
          h += `<div style="display:flex;align-items:center;gap:8px;margin-top:4px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${p.color}"></span>
            <span style="color:#5878ad">${p.seriesName}</span>
            <span style="font-weight:700;margin-left:auto;color:#13356f">${p.value.toFixed(4)} m</span>
          </div>`
        })
        h += `<div style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(47,115,255,0.12);color:#0a7c44;font-weight:800">↓ 改善 ${improvePct[i]}%</div>`
        return h
      }
    },
    xAxis: {
      type: 'category',
      data: scenarios,
      axisLine: { lineStyle: { color: 'rgba(47,115,255,0.15)' } },
      axisTick: { show: false },
      axisLabel: { color: '#5878ad', fontSize: 12, fontWeight: 700 },
    },
    yAxis: {
      type: 'value',
      name: 'RMS (m)',
      nameTextStyle: { color: '#5878ad', fontSize: 11, fontWeight: 600 },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#5878ad', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(47,115,255,0.06)', type: 'dashed' } },
    },
    series: [
      {
        name: 'BASE',
        type: 'bar',
        barWidth: '28%',
        barGap: '20%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(164,196,255,0.9)' },
            { offset: 1, color: 'rgba(99,152,255,0.5)' },
          ]),
          borderRadius: [6, 6, 0, 0],
        },
        emphasis: { itemStyle: { opacity: 0.85 } },
        data: rmsData.BASE,
      },
      {
        name: 'CNN',
        type: 'bar',
        barWidth: '28%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(47,115,255,1)' },
            { offset: 1, color: 'rgba(73,167,255,0.7)' },
          ]),
          borderRadius: [6, 6, 0, 0],
        },
        emphasis: { itemStyle: { opacity: 0.85 } },
        data: rmsData.CNN,
        label: {
          show: true,
          position: 'top',
          formatter: (p) => `↓${improvePct[p.dataIndex]}%`,
          color: '#0a7c44',
          fontWeight: 800,
          fontSize: 10,
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
