<template>
  <div class="apple-chart-card">
    <div class="chart-header">
      <div class="chart-label">Figure C</div>
      <h3 class="chart-title">Computational Efficiency Trade-off</h3>
    </div>
    <div ref="elRef" class="chart-canvas"></div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { modelNames, scatterTradeOff } from './chartData'
import { appleChartTheme } from './chartStyles'

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
    grid: { ...appleChartTheme.getGridConfig(), top: 70, right: 40 },
    legend: appleChartTheme.getLegendConfig(),
    tooltip: {
      ...appleChartTheme.getTooltipConfig(),
      trigger: 'item',
      formatter: (p) => {
        return `<div style="font-weight: 600; margin-bottom: 8px;">${p.seriesName}</div>
          <div style="display: flex; justify-content: space-between; margin-top: 6px;">
            <span style="color: #86868b;">Parameters:</span>
            <span style="font-weight: 600; margin-left: 16px;">${p.value[0]}K</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 4px;">
            <span style="color: #86868b;">Latency:</span>
            <span style="font-weight: 600; margin-left: 16px;">${p.value[1]}μs</span>
          </div>`
      }
    },
    xAxis: {
      ...appleChartTheme.getAxisConfig(true),
      type: 'value',
      name: 'Number of Parameters (K)',
      min: 0,
      max: 350,
    },
    yAxis: {
      ...appleChartTheme.getAxisConfig(false),
      type: 'log',
      name: 'CPU Inference Latency (μs)',
      min: 10,
      max: 10000,
      axisLabel: {
        ...appleChartTheme.getAxisConfig(false).axisLabel,
        formatter: (value) => {
          if (value >= 1000) return (value / 1000).toFixed(0) + 'k'
          return value
        }
      }
    },
    series: [
      // 1ms 实时限制线
      {
        name: '1ms real-time limit',
        type: 'line',
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: '#FF3B30',
            width: 1.5,
            type: 'dashed',
          },
          label: {
            show: true,
            position: 'end',
            formatter: '1ms limit',
            color: '#FF3B30',
            fontSize: 11,
            fontWeight: 600,
          },
          data: [{ yAxis: 1000 }],
        },
      },
      // 250K 参数限制线
      {
        name: '250K param limit',
        type: 'line',
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: '#FF9500',
            width: 1.5,
            type: 'dashed',
          },
          label: {
            show: true,
            position: 'end',
            formatter: '250K limit',
            color: '#FF9500',
            fontSize: 11,
            fontWeight: 600,
          },
          data: [{ xAxis: 250 }],
        },
      },
      // 数据点
      ...modelNames.map((m, i) => ({
        name: m,
        type: 'scatter',
        itemStyle: {
          color: palette[i],
          shadowBlur: 8,
          shadowColor: palette[i] + '30',
        },
        symbolSize: 18,
        emphasis: {
          scale: 1.3,
          itemStyle: {
            shadowBlur: 16,
            shadowColor: palette[i] + '50',
          }
        },
        data: scatterTradeOff[m] || [],
      })),
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
