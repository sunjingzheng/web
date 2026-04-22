<template>
  <div class="apple-chart-card">
    <div class="chart-header">
      <div class="chart-label">Figure D</div>
      <h3 class="chart-title">Prediction Correlation ρ (Main Experiment)</h3>
    </div>
    <div ref="elRef" class="chart-canvas"></div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { correlationHeatmapData, modelNames, yLabelsD } from './chartData'
import { appleChartTheme } from './chartStyles'

const props = defineProps({
  active: { type: Boolean, default: false },
})

const elRef = ref(null)
let chart = null

function render() {
  if (!chart) return
  chart.setOption({
    ...appleChartTheme.getBaseConfig(),
    grid: { top: 40, left: 20, right: 120, bottom: 60, containLabel: true },
    tooltip: {
      ...appleChartTheme.getTooltipConfig(),
      position: 'top',
      formatter: (p) => {
        const x = modelNames[p.data[0]]
        const y = yLabelsD[p.data[1]]
        const v = p.data[2]
        return `<div style="font-weight: 600; margin-bottom: 8px;">${x}</div>
          <div style="color: #86868b; margin-bottom: 4px;">${y}</div>
          <div style="display: flex; align-items: center;">
            <span style="color: #86868b;">Pearson ρ:</span>
            <span style="font-weight: 600; margin-left: 8px;">${v.toFixed(4)}</span>
          </div>`
      },
    },
    xAxis: {
      ...appleChartTheme.getAxisConfig(true),
      type: 'category',
      data: modelNames,
      axisLabel: {
        ...appleChartTheme.getAxisConfig(true).axisLabel,
        rotate: 0,
        fontWeight: 600,
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.015)']
        }
      },
    },
    yAxis: {
      ...appleChartTheme.getAxisConfig(false),
      type: 'category',
      data: yLabelsD,
      axisLabel: {
        ...appleChartTheme.getAxisConfig(false).axisLabel,
        fontWeight: 500,
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.015)']
        }
      },
    },
    visualMap: {
      min: 0.43,
      max: 0.64,
      calculable: true,
      orient: 'vertical',
      right: 12,
      top: 'middle',
      itemHeight: 120,
      itemWidth: 16,
      textStyle: {
        color: '#86868b',
        fontSize: 11,
        fontWeight: 500,
      },
      inRange: {
        color: ['#E5F1FF', '#A8D1FF', '#6BB0FF', '#3D95FF', '#007AFF'],
      },
      borderColor: 'rgba(0, 0, 0, 0.06)',
      borderWidth: 1,
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
          color: '#1d1d1f',
          fontWeight: 600,
          fontSize: 14,
        },
        itemStyle: {
          borderColor: '#ffffff',
          borderWidth: 3,
          borderRadius: 8,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 16,
            shadowColor: 'rgba(0, 122, 255, 0.3)',
            borderWidth: 3,
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

<style scoped>
.apple-chart-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 24px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.apple-chart-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.chart-header {
  margin-bottom: 20px;
}

.chart-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #86868b;
  margin-bottom: 6px;
}

.chart-title {
  font-size: 17px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -0.3px;
}

.chart-canvas {
  width: 100%;
  height: 380px;
}
</style>
