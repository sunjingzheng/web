<template>
  <div class="apple-chart-card">
    <div class="chart-header">
      <div class="chart-label">Figure A</div>
      <h3 class="chart-title">DOB Residual Reduction — Surge (u-channel)</h3>
    </div>
    <div ref="elRef" class="chart-canvas"></div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { barSurgeU, modelNames, scenarios } from './chartData'
import { appleChartTheme } from './chartStyles'

const scenariosA = scenarios.slice(1)

const props = defineProps({
  active: { type: Boolean, default: false },
})

const elRef = ref(null)
let chart = null

function render() {
  if (!chart) return

  const palette = appleChartTheme.modelColors

  chart.setOption({
    ...appleChartTheme.getBaseConfig(),
    grid: { ...appleChartTheme.getGridConfig(), top: 70 },
    legend: {
      ...appleChartTheme.getLegendConfig(),
      formatter: (name) => (name === '__zero__' ? '' : name),
    },
    tooltip: {
      ...appleChartTheme.getTooltipConfig(),
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(0, 0, 0, 0.03)',
        }
      },
      formatter: (params) => {
        const filtered = params.filter(p => p.seriesName !== '__zero__')
        let result = `<div style="font-weight: 600; margin-bottom: 8px;">${filtered[0].axisValue}</div>`
        filtered.forEach(p => {
          const value = p.value
          const color = p.color
          result += `<div style="display: flex; align-items: center; margin-top: 6px;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${color}; margin-right: 8px;"></span>
            <span style="flex: 1;">${p.seriesName}</span>
            <span style="font-weight: 600; margin-left: 16px;">${value.toFixed(2)}%</span>
          </div>`
        })
        return result
      }
    },
    xAxis: {
      ...appleChartTheme.getAxisConfig(true),
      type: 'category',
      data: scenariosA,
      axisLabel: {
        ...appleChartTheme.getAxisConfig(true).axisLabel,
        fontWeight: 600,
      }
    },
    yAxis: {
      ...appleChartTheme.getAxisConfig(false),
      type: 'value',
      name: 'Residual Reduction (%)',
      min: -100,
      max: 25,
    },
    series: [
      ...modelNames.map((name, i) => ({
        name,
        type: 'bar',
        barMaxWidth: 16,
        barGap: '30%',
        barCategoryGap: '35%',
        itemStyle: {
          color: palette[i],
          borderRadius: [6, 6, 0, 0],
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            opacity: 0.8,
            shadowBlur: 10,
            shadowColor: palette[i] + '40',
          },
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
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.15)',
          width: 1.5,
        },
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
